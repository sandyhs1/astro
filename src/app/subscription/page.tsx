'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

type UserProfile = {
  id: string;
  plan_type: string | null;
  payment_status: string | null;
  subscription_id: string | null;
  credits: number;
  paid_at: string | null;
  created_at: string | null;
};

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function getNextBillingDate(paidAt: string | null): string {
  if (!paidAt) return '—';
  const d = new Date(paidAt);
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getMemberSince(createdAt: string | null): string {
  if (!createdAt) return '—';
  return new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getDaysUntilNextBilling(paidAt: string | null): number {
  if (!paidAt) return 30;
  const next = new Date(paidAt);
  next.setDate(next.getDate() + 30);
  return Math.max(0, Math.ceil((next.getTime() - Date.now()) / 86400000));
}

export default function SubscriptionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const fetchAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/'); return; }
      setUserEmail(user.email ?? '');
      setUserName(user.user_metadata?.full_name ?? user.email ?? '');
      const { data } = await supabase
        .from('user_profiles')
        .select('id, plan_type, payment_status, subscription_id, credits, paid_at, created_at')
        .eq('id', user.id)
        .single();
      if (data) setProfile(data as UserProfile);
    } catch {
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccount(); }, []);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) { toast.error('Payment window failed to load.'); setUpgrading(false); return; }

      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'plan2' }),
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error ?? 'Order creation failed');

      const rzp = new (window as any).Razorpay({
        key: orderData.keyId,
        currency: 'INR',
        name: 'Quantum Karma',
        description: 'AI Credits — 50/month',
        image: 'https://quantumkarma.tech/favicon.ico',
        subscription_id: orderData.subscriptionId,
        theme: { color: '#4F46E5' },
        prefill: { email: userEmail, name: userName },
        modal: { ondismiss: () => setUpgrading(false) },
        handler: async (response: any) => {
          try {
            const vr = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, plan: 'plan2' }),
            });
            const vd = await vr.json();
            if (!vr.ok || !vd.success) { toast.error('Verification failed. Contact support.'); setUpgrading(false); return; }
            toast.success('🎉 Welcome to Premium! 50 credits loaded.');
            await fetchAccount();
            setUpgrading(false);
          } catch { toast.error('Verification error. Contact support.'); setUpgrading(false); }
        },
      });
      rzp.on('payment.failed', (r: any) => {
        toast.error(`Payment failed: ${r.error?.description ?? 'Unknown error'}`);
        setUpgrading(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong.');
      setUpgrading(false);
    }
  };

  const confirmCancellation = async () => {
    setCancelling(true);
    try {
      const res = await fetch('/api/payments/cancel-subscription', { method: 'POST' });
      const json = await res.json();
      if (res.ok && json.success) {
        setCancelled(true);
        setShowCancelModal(false);
        await fetchAccount();
        toast.success('Subscription cancelled — you keep access until the billing cycle ends.');
      } else {
        toast.error(json.error || 'Failed to cancel subscription');
      }
    } catch { toast.error('An error occurred. Please try again.'); }
    finally { setCancelling(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading subscription...</p>
        </div>
      </div>
    );
  }

  const isPromo = profile?.plan_type === 'promo';
  const isPlan2 = profile?.plan_type === 'plan2' && !!profile?.subscription_id;
  const isPlan1 = profile?.plan_type === 'plan1';
  const isPendingCancel = profile?.payment_status === 'pending_cancellation';
  const daysLeft = getDaysUntilNextBilling(profile?.paid_at ?? null);
  const nextBilling = getNextBillingDate(profile?.paid_at ?? null);
  const memberSince = getMemberSince(profile?.created_at ?? null);
  const firstName = userName.split(' ')[0] || 'Seeker';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">

      {/* ── Top Nav Bar ── */}
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Dashboard
          </button>
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold text-indigo-700">{profile?.credits ?? 0} Credits</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* ── Page Header ── */}
        <div className="mb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-1">Quantum Karma</p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Subscription</h1>
          <p className="text-slate-500 mt-1 text-sm">Member since {memberSince}</p>
        </div>

        {/* ── Current Plan Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card header strip */}
          <div className={`h-1 w-full ${isPromo ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : isPlan2 ? 'bg-gradient-to-r from-indigo-500 to-violet-600' : 'bg-gradient-to-r from-slate-300 to-slate-400'}`} />

          <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Current Plan</h2>
            {isPromo && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
                🎁 Promo — Free Access
              </span>
            )}
            {isPlan2 && !isPendingCancel && (
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">
                ✨ Premium Monthly — Active
              </span>
            )}
            {isPendingCancel && (
              <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full">
                ⚠️ Cancels at cycle end
              </span>
            )}
            {isPlan1 && (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full">
                📄 One-Time Report
              </span>
            )}
            {!profile?.plan_type && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-full">
                No Active Plan
              </span>
            )}
          </div>

          <div className="p-6">
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900">
                  {isPromo ? '₹0' : isPlan2 ? '₹1,799' : isPlan1 ? '₹4,799' : '—'}
                </span>
                {isPlan2 && <span className="text-base text-slate-400 font-medium">/ month</span>}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {isPromo && 'Free access granted via promo code. Your credits are included.'}
                {isPlan2 && !isPendingCancel && `Renews automatically every 30 days.`}
                {isPendingCancel && 'Your access continues until the billing cycle ends, then you will be downgraded.'}
                {isPlan1 && `One-time purchase · Purchased on ${profile?.paid_at ? new Date(profile.paid_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}`}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Credits Left</p>
                <p className="text-3xl font-black text-indigo-600">{profile?.credits ?? 0}</p>
              </div>
              {(isPlan2 || isPromo) && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Next Billing</p>
                  <p className="text-sm font-bold text-slate-900">{isPlan2 ? nextBilling : '—'}</p>
                  {!isPlan2 && <p className="text-xs text-slate-400 mt-0.5">Upgrade to get a date</p>}
                </div>
              )}
              {isPlan2 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Days Left</p>
                  <p className={`text-3xl font-black ${daysLeft <= 5 ? 'text-orange-500' : 'text-slate-900'}`}>{daysLeft}</p>
                </div>
              )}
            </div>

            {/* Cancel button */}
            {isPlan2 && !isPendingCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors underline underline-offset-2"
              >
                Cancel subscription
              </button>
            )}
          </div>
        </div>

        {/* ── UPGRADE SECTION — shown to promo users ── */}
        {isPromo && (
          <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-md overflow-hidden">
            {/* Purple accent top */}
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />

            <div className="p-6 sm:p-8">
              {/* Badge */}
              <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                ✦ Upgrade Available
              </span>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4">
                Your promo gave you a glimpse.<br />
                <span className="text-indigo-600">Your Karma deserves the full journey.</span>
              </h2>

              {/* Emotional body copy */}
              <p className="text-slate-600 leading-relaxed mb-6 text-base">
                In Jyotish, every Dasha period opens a unique window of transformation. The ancient Rishis of India taught that <strong className="text-slate-800">continuous self-knowledge is the highest Sadhana</strong> — it is what separates the seeker from the sage.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6 text-base">
                Right now, your chart is active. Your transits are moving. Your Karma is speaking. But when your promo credits run out — the cosmic mirror goes dark. Don't let that happen, {firstName}.
              </p>

              {/* Vedic quote */}
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl px-5 py-4 mb-8">
                <p className="text-amber-900 font-semibold text-base italic leading-relaxed mb-1">
                  "ज्ञानं परमं बलम्"
                </p>
                <p className="text-amber-800 text-sm leading-relaxed italic mb-2">
                  "Knowledge is the supreme strength."
                </p>
                <p className="text-amber-600 text-xs font-semibold tracking-wide">— Brihat Parashara Hora Shastra</p>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  { icon: '⚡', title: '50 fresh credits every month', desc: 'Resets on your billing date — your personal cycle' },
                  { icon: '🔮', title: 'Unlimited Oracle Chat', desc: 'Ask your chart anything, any time' },
                  { icon: '🧬', title: 'Full Karma DNA access', desc: 'All 16 divisional chart cross-references' },
                  { icon: '🕉️', title: 'Gotra & Ishta Devata', desc: 'Your ancestral lineage & guardian deity' },
                  { icon: '🗓️', title: 'Destiny Window', desc: 'Real-time planetary forecasts for your life' },
                  { icon: '📿', title: 'Remedy Engine', desc: 'Precise Vedic protocols — mantras & rituals' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second Vedic pull quote */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4 mb-8 text-center">
                <p className="text-indigo-900 font-bold text-sm leading-relaxed">
                  🌕 In every birth chart, there is a hidden river of grace waiting to be found.<br />
                  <span className="font-normal text-indigo-700">Upgrade to let us help you find yours — month after month.</span>
                </p>
              </div>

              {/* Price row + CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <p className="text-4xl font-black text-slate-900">₹1,799</p>
                  <p className="text-sm text-slate-500 mt-1">per month · cancel anytime · your existing credits are kept</p>
                </div>
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="sm:ml-auto w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-base px-8 py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {upgrading ? '⏳ Opening payment...' : '🚀 Start Premium →'}
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
                🔒 Secured by Razorpay · 256-bit SSL · Cancel anytime from this page
              </p>
            </div>
          </div>
        )}

        {/* ── Support footer ── */}
        <div className="text-center pt-4">
          <p className="text-sm text-slate-400">
            Questions?{' '}
            <a href="mailto:help@quantumkarma.tech" className="text-indigo-500 hover:text-indigo-700 font-semibold underline underline-offset-2 transition-colors">
              help@quantumkarma.tech
            </a>
          </p>
        </div>
      </div>

      {/* ── Cancel Subscription Modal ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">💔</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Are you sure?</h3>
              <p className="text-slate-600 leading-relaxed mb-2 text-sm">
                Cancelling will stop your subscription from renewing. You keep <strong>full access and all remaining credits</strong> until the end of your current billing cycle.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                This action cancels both your <strong>Razorpay subscription</strong> and removes your plan from our system automatically — no manual steps needed.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>You keep your <strong>{profile?.credits} remaining credits</strong> until cycle ends</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>Access continues until <strong>{nextBilling}</strong></span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>No future charges — Razorpay notified immediately</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm h-12 rounded-xl transition-colors shadow-sm"
                >
                  Nevermind, keep my plan
                </button>
                <button
                  onClick={confirmCancellation}
                  disabled={cancelling}
                  className="w-full bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 font-semibold text-sm h-12 rounded-xl transition-all flex items-center justify-center"
                >
                  {cancelling ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-red-500 rounded-full animate-spin" />
                      Cancelling...
                    </span>
                  ) : 'Yes, cancel my subscription'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Post-cancel confirmation banner ── */}
      {cancelled && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
          <span className="text-emerald-400">✓</span>
          Subscription cancelled. You keep access until {nextBilling}.
        </div>
      )}
    </div>
  );
}
