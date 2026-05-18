'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { PAL } from '@/app/dashboard/components/destiny-theme';

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

/* ── Inline serif font loader (page is outside dashboard shell) ── */
function SerifFonts() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap');
      .serif-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; font-feature-settings: 'ss01','liga'; letter-spacing: -0.02em; }
      .serif-text    { font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif; }
    `}} />
  );
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
        theme: { color: PAL.accent },
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
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: PAL.paper, color: PAL.ink }}
      >
        <SerifFonts />
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent }} />
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: '0.15s' }} />
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: '0.3s' }} />
          </div>
          <p className="serif-display italic" style={{ color: PAL.ink2 }}>Loading subscription…</p>
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
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${PAL.paper} 0%, ${PAL.paper2} 100%)`,
        color: PAL.ink,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Inter', 'Helvetica Neue', sans-serif",
      }}
    >
      <SerifFonts />

      {/* Subtle paper grain */}
      <div
        className="pointer-events-none fixed inset-0 -z-0 opacity-[0.022]"
        style={{
          backgroundImage: 'radial-gradient(rgba(14,26,51,1) 1px,transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Masthead */}
      <header
        className="sticky top-0 z-20 backdrop-blur-md"
        style={{ background: 'rgba(250,247,242,0.92)', borderBottom: `1px solid ${PAL.border2}` }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="serif-text text-[12.5px] font-semibold inline-flex items-center gap-2 transition-opacity hover:opacity-70"
            style={{ color: PAL.ink2 }}
          >
            <span aria-hidden>←</span> Back to dashboard
          </button>
          <div className="flex items-center gap-2.5">
            <span className="serif-display text-[14px] md:text-[16px] font-semibold" style={{ color: PAL.ink }}>
              Quantum Karma
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm"
              style={{ background: PAL.amberBg, border: `1px solid #E1CE9B` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.gold }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] tabular-nums" style={{ color: PAL.gold }}>
                {profile?.credits ?? 0} credits
              </span>
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-10 space-y-5">

        {/* Page heading */}
        <div className="flex items-baseline justify-between pb-2 mb-2"
          style={{ borderBottom: `1px solid ${PAL.border}` }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
              Account · Subscription
            </p>
            <h1 className="serif-display text-[34px] md:text-[44px] font-semibold tracking-tight leading-[0.98] mt-1" style={{ color: PAL.ink }}>
              Subscription.
            </h1>
            <p className="serif-text italic text-[13px] mt-2" style={{ color: PAL.ink2 }}>
              Member since {memberSince}
            </p>
          </div>
          <span className="serif-display italic text-[12px] tabular-nums" style={{ color: PAL.ink3 }}>
            № 01
          </span>
        </div>

        {/* ── Current plan card ── */}
        <section
          className="rounded-sm overflow-hidden"
          style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
        >
          {/* Header strip */}
          <div className="px-5 md:px-7 py-4 flex flex-wrap gap-3 items-center justify-between"
            style={{ borderBottom: `1px solid ${PAL.border2}`, background: PAL.paper2 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.ink3 }}>
              Current plan
            </p>
            {isPromo && (
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 rounded-sm"
                style={{ color: PAL.gold, background: PAL.amberBg, border: `1px solid #E1CE9B` }}
              >
                ✦ Promo · free access
              </span>
            )}
            {isPlan2 && !isPendingCancel && (
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 rounded-sm"
                style={{ color: PAL.sage, background: PAL.sageBg, border: `1px solid #C7D6BB` }}
              >
                ✓ Premium monthly · active
              </span>
            )}
            {isPendingCancel && (
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 rounded-sm"
                style={{ color: PAL.gold, background: PAL.amberBg, border: `1px solid #E1CE9B` }}
              >
                ⚠ Cancels at cycle end
              </span>
            )}
            {isPlan1 && (
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 rounded-sm"
                style={{ color: PAL.rose, background: PAL.roseBg, border: `1px solid #E5BFC1` }}
              >
                ❑ One-time report
              </span>
            )}
            {!profile?.plan_type && (
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 rounded-sm"
                style={{ color: PAL.ink3, background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
              >
                No active plan
              </span>
            )}
          </div>

          <div className="px-5 md:px-7 py-6 md:py-7">
            {/* Price hero */}
            <div className="mb-6 md:mb-7">
              <div className="flex items-baseline gap-2">
                <span className="serif-display text-[44px] md:text-[58px] font-semibold tabular-nums leading-none tracking-tight" style={{ color: PAL.ink }}>
                  {isPromo ? '₹0' : isPlan2 ? '₹1,799' : isPlan1 ? '₹4,799' : '—'}
                </span>
                {isPlan2 && (
                  <span className="serif-text italic text-[14px] md:text-[15px]" style={{ color: PAL.ink2 }}>
                    / month
                  </span>
                )}
              </div>
              <p className="serif-text text-[14px] mt-3 leading-relaxed max-w-xl" style={{ color: PAL.ink2 }}>
                {isPromo && 'Free access granted via promo code. Your credits are included.'}
                {isPlan2 && !isPendingCancel && 'Renews automatically every 30 days.'}
                {isPendingCancel && 'Your access continues until the billing cycle ends, then you will be downgraded.'}
                {isPlan1 && `One-time purchase · purchased on ${profile?.paid_at ? new Date(profile.paid_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}`}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-3 mb-6 md:mb-7">
              <Stat label="Credits left" value={String(profile?.credits ?? 0)} />
              {(isPlan2 || isPromo) && (
                <Stat
                  label="Next billing"
                  value={isPlan2 ? nextBilling : '—'}
                  hint={!isPlan2 ? 'Upgrade to get a date' : undefined}
                  small
                />
              )}
              {isPlan2 && (
                <Stat
                  label="Days left"
                  value={String(daysLeft)}
                  emphasis={daysLeft <= 5 ? 'rose' : 'default'}
                />
              )}
            </div>

            {/* Cancel link */}
            {isPlan2 && !isPendingCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="serif-text text-[13px] font-semibold transition-opacity hover:opacity-70"
                style={{
                  color: PAL.ink3,
                  textDecoration: 'underline',
                  textDecorationThickness: '1px',
                  textUnderlineOffset: '4px',
                  textDecorationColor: PAL.border,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = PAL.rose; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = PAL.ink3; }}
              >
                Cancel subscription
              </button>
            )}
          </div>
        </section>

        {/* ── Upgrade section (promo users) ── */}
        {isPromo && (
          <section
            className="rounded-sm overflow-hidden"
            style={{ background: PAL.paper, border: `1px solid ${PAL.accent}` }}
          >
            {/* Hero header — deep navy */}
            <div
              className="px-5 md:px-7 py-6 md:py-7"
              style={{ background: PAL.ink, color: PAL.paper, borderBottom: `1px solid ${PAL.ink}` }}
            >
              <span
                className="inline-block text-[10px] font-semibold uppercase tracking-[0.24em] px-2 py-1 rounded-sm mb-3"
                style={{ color: '#E1CE9B', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.16)` }}
              >
                ✦ Upgrade available
              </span>
              <h2 className="serif-display text-[26px] md:text-[36px] font-semibold leading-[1.05] tracking-tight">
                Your promo gave you a glimpse.
                <br />
                <span style={{ color: '#E1CE9B' }}>Your karma deserves the full journey.</span>
              </h2>
            </div>

            <div className="px-5 md:px-7 py-6 md:py-7">
              <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed mb-3" style={{ color: PAL.ink2 }}>
                In Jyotish, every Dasha period opens a unique window of transformation. The ancient Rishis taught that{' '}
                <strong style={{ color: PAL.ink }}>continuous self-knowledge is the highest Sadhana</strong> — what separates the seeker from the sage.
              </p>
              <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed mb-5" style={{ color: PAL.ink2 }}>
                Right now, your chart is active. Your transits are moving. Your karma is speaking. But when your promo credits run out — the cosmic mirror goes dark. Don&apos;t let that happen, {firstName}.
              </p>

              {/* Vedic pull quote */}
              <blockquote
                className="rounded-sm pl-5 pr-5 py-4 mb-7"
                style={{
                  background: PAL.amberBg,
                  border: `1px solid #E1CE9B`,
                  borderLeft: `2px solid ${PAL.gold}`,
                }}
              >
                <p className="serif-display text-[18px] md:text-[22px] font-medium italic leading-snug mb-1" style={{ color: PAL.ink }}>
                  ज्ञानं परमं बलम्
                </p>
                <p className="serif-display italic text-[14px] md:text-[15px] mb-2" style={{ color: PAL.gold }}>
                  Knowledge is the supreme strength.
                </p>
                <footer className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.gold, opacity: 0.85 }}>
                  — Brihat Parashara Hora Shastra
                </footer>
              </blockquote>

              {/* Features list */}
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.accent }}>
                What you get
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-7">
                {[
                  { symbol: '⚡', title: '50 fresh credits monthly',  desc: 'Resets on your billing date — your personal cycle' },
                  { symbol: '✦', title: 'Unlimited Oracle Chat',     desc: 'Ask your chart anything, any time' },
                  { symbol: '◐', title: 'Full Karma DNA access',     desc: 'All 16 divisional chart cross-references' },
                  { symbol: '🕉', title: 'Gotra & Ishta Devata',      desc: 'Your ancestral lineage & guardian deity' },
                  { symbol: '◴', title: 'Destiny window',            desc: 'Real-time planetary forecasts for your life' },
                  { symbol: '◇', title: 'Remedy engine',             desc: 'Precise Vedic protocols — mantras & rituals' },
                ].map(({ symbol, title, desc }) => (
                  <li
                    key={title}
                    className="flex items-start gap-3 rounded-sm p-3.5"
                    style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
                  >
                    <span className="serif-display text-[18px] flex-shrink-0 mt-0.5" style={{ color: PAL.accent }}>
                      {symbol}
                    </span>
                    <div>
                      <p className="serif-display text-[14px] font-semibold leading-tight" style={{ color: PAL.ink }}>
                        {title}
                      </p>
                      <p className="serif-text text-[12.5px] mt-1" style={{ color: PAL.ink3 }}>
                        {desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Second pull quote */}
              <div
                className="rounded-sm px-5 py-4 mb-7 text-center"
                style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
              >
                <p className="serif-display italic text-[15px] md:text-[16px] leading-snug" style={{ color: PAL.ink }}>
                  In every birth chart, there is a hidden river of grace waiting to be found.
                </p>
                <p className="serif-text text-[13px] mt-1.5" style={{ color: PAL.ink2 }}>
                  Upgrade to let us help you find yours — month after month.
                </p>
              </div>

              {/* Price + CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div>
                  <p className="serif-display text-[34px] md:text-[42px] font-semibold tabular-nums leading-none tracking-tight" style={{ color: PAL.ink }}>
                    ₹1,799
                  </p>
                  <p className="serif-text italic text-[12.5px] mt-2" style={{ color: PAL.ink3 }}>
                    per month · cancel anytime · existing credits kept
                  </p>
                </div>
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="sm:ml-auto w-full sm:w-auto serif-text text-[14px] font-semibold px-7 py-3.5 rounded-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: PAL.accent }}
                >
                  {upgrading ? 'Opening payment…' : 'Start premium →'}
                </button>
              </div>

              <p className="serif-text italic text-[11.5px] mt-4 inline-flex items-center gap-1.5" style={{ color: PAL.ink3 }}>
                <span>🔒</span>
                Secured by Razorpay · 256-bit SSL · cancel anytime from this page
              </p>
            </div>
          </section>
        )}

        {/* Support footer */}
        <div className="text-center pt-4">
          <p className="serif-text text-[13px]" style={{ color: PAL.ink3 }}>
            Questions?{' '}
            <a
              href="mailto:help@quantumkarma.tech"
              className="font-semibold transition-opacity hover:opacity-70"
              style={{
                color: PAL.accent,
                textDecoration: 'underline',
                textDecorationThickness: '1px',
                textUnderlineOffset: '3px',
              }}
            >
              help@quantumkarma.tech
            </a>
          </p>
        </div>
      </main>

      {/* ── Cancel Subscription Modal ── */}
      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(14,26,51,0.55)', backdropFilter: 'blur(6px)' }}
          onClick={() => !cancelling && setShowCancelModal(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-sm shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-5 sm:px-7 pt-7 pb-3">
              {/* Personalised message */}
              <div className="text-center mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] mb-2" style={{ color: PAL.accent }}>
                  Wait a moment, {firstName}
                </p>
                <h2 className="serif-display text-[24px] md:text-[28px] font-semibold leading-tight tracking-tight" style={{ color: PAL.ink }}>
                  Are you sure you want to leave?
                </h2>
                <p className="serif-text italic text-[14px] mt-3 max-w-sm mx-auto leading-relaxed" style={{ color: PAL.ink2 }}>
                  We&apos;ve been mapping your cosmic journey together — your Dashas, your transits, your karma. If you leave now, the mirror goes dark and your chart stops speaking to you.
                </p>
              </div>

              {/* Editorial divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: PAL.border }} />
                <span className="serif-display italic text-[12px]" style={{ color: PAL.ink3 }}>✦</span>
                <div className="flex-1 h-px" style={{ background: PAL.border }} />
              </div>

              <p className="serif-text text-[13.5px] leading-relaxed mb-3" style={{ color: PAL.ink2 }}>
                Cancelling will stop your subscription from renewing. You keep{' '}
                <strong style={{ color: PAL.ink }}>full access and all remaining credits</strong> until the end of your current billing cycle.
              </p>
              <p className="serif-text text-[13.5px] leading-relaxed mb-5" style={{ color: PAL.ink2 }}>
                This action notifies our payment provider and updates your plan automatically — no manual steps needed.
              </p>

              {/* Confirmation list */}
              <div
                className="rounded-sm p-4 space-y-2.5"
                style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
              >
                {[
                  <>You keep your <strong style={{ color: PAL.ink }}>{profile?.credits} remaining credits</strong> until cycle ends</>,
                  <>Access continues until <strong style={{ color: PAL.ink }}>{nextBilling}</strong></>,
                  <>No future charges — payment provider notified immediately</>,
                ].map((line, i) => (
                  <div key={i} className="flex items-start gap-2.5 serif-text text-[13px] leading-relaxed" style={{ color: PAL.ink2 }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: PAL.sage }}>✓</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky actions */}
            <div
              className="px-5 sm:px-7 pb-7 pt-4 space-y-2.5 flex-shrink-0"
              style={{ background: PAL.paper2, borderTop: `1px solid ${PAL.border2}` }}
            >
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full serif-text text-[14px] font-semibold py-3.5 rounded-sm text-white transition-opacity hover:opacity-90"
                style={{ background: PAL.accent }}
              >
                Nevermind, keep my plan
              </button>
              <button
                onClick={confirmCancellation}
                disabled={cancelling}
                className="w-full serif-text text-[13px] font-semibold py-3 rounded-sm transition-colors flex items-center justify-center gap-2"
                style={{
                  color: PAL.ink3,
                  background: 'transparent',
                  border: `1px solid ${PAL.border}`,
                }}
                onMouseEnter={(e) => {
                  if (!cancelling) {
                    e.currentTarget.style.color = PAL.rose;
                    e.currentTarget.style.borderColor = '#E5BFC1';
                    e.currentTarget.style.background = PAL.roseBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!cancelling) {
                    e.currentTarget.style.color = PAL.ink3;
                    e.currentTarget.style.borderColor = PAL.border;
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {cancelling ? (
                  <>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: PAL.rose }} />
                      <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: PAL.rose, animationDelay: '0.15s' }} />
                      <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: PAL.rose, animationDelay: '0.3s' }} />
                    </span>
                    Cancelling…
                  </>
                ) : 'Yes, cancel my subscription'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-cancel toast banner */}
      {cancelled && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 serif-text text-[13px] font-semibold px-5 py-3 rounded-sm shadow-xl flex items-center gap-2"
          style={{ background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }}
        >
          <span style={{ color: '#E1CE9B' }}>✓</span>
          Subscription cancelled. You keep access until {nextBilling}.
        </div>
      )}
    </div>
  );
}

/* ── Stat card ────────────────────────────────────────────────────────── */
function Stat({ label, value, hint, emphasis = 'default', small = false }: {
  label: string;
  value: string;
  hint?: string;
  emphasis?: 'default' | 'rose';
  small?: boolean;
}) {
  const valColor = emphasis === 'rose' ? PAL.rose : PAL.ink;
  return (
    <div
      className="rounded-sm p-4"
      style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>
        {label}
      </p>
      <p
        className={`serif-display ${small ? 'text-[15px] md:text-[16px]' : 'text-[28px] md:text-[34px]'} font-semibold tabular-nums leading-none mt-2 tracking-tight`}
        style={{ color: valColor }}
      >
        {value}
      </p>
      {hint && (
        <p className="serif-text italic text-[11px] mt-2" style={{ color: PAL.ink3 }}>
          {hint}
        </p>
      )}
    </div>
  );
}
