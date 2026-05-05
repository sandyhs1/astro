'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Zap, CheckCircle2, AlertCircle, HeartCrack } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type UserProfile = {
  id: string;
  plan_type: string | null;
  payment_status: string | null;
  subscription_id: string | null;
  credits: number;
  paid_at: string | null;
};

export default function AccountsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { data } = await supabase
        .from('user_profiles')
        .select('id, plan_type, payment_status, subscription_id, credits, paid_at')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      toast.error('Failed to load account details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const confirmCancellation = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/payments/cancel-subscription', { method: 'POST' });
      const json = await res.json();
      
      if (res.ok && json.success) {
        toast.success('Subscription cancelled. It will not renew.');
        setShowCancelModal(false);
        await fetchAccount(); // Refresh data to show pending_cancellation
      } else {
        toast.error(json.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      toast.error('An error occurred while communicating with the server.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // No active plan
  if (!profile || !profile.plan_type) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 pt-16">
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">No Active Plan</h2>
          <p className="text-slate-600 text-lg">You don't have an active subscription or plan at the moment.</p>
          <div className="pt-8">
            <div className="bg-slate-50 rounded-xl p-4 inline-block mb-6 border border-slate-100">
              <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Current AI Credits</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{profile?.credits || 0}</p>
            </div>
            <div>
              <button onClick={() => router.push('/dashboard')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 px-8 rounded-full transition-colors shadow-sm">
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPlan1 = profile.plan_type === 'plan1';
  const isPlan2 = profile.plan_type === 'plan2' && !!profile.subscription_id;
  const isPendingCancel = profile.payment_status === 'pending_cancellation';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6 pt-12 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account & Billing</h1>
            <p className="text-slate-600 mt-1 text-lg">Manage your Quantum Karma subscription and credits</p>
          </div>
          <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm">
            <Zap className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Credits</span>
            <span className="font-bold text-slate-900 text-lg ml-1">{profile.credits}</span>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">
              Current Plan Details
            </h3>
            {isPendingCancel ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                <AlertCircle className="w-3.5 h-3.5" />
                Cancels at cycle end
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Subscription
              </span>
            )}
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-md text-sm font-bold tracking-wide">
                {isPlan1 ? 'Destiny Report (One-Time)' : 'AI Credits Plan (Monthly)'}
              </span>
            </div>
            
            <div className="text-4xl font-bold text-slate-900">
              {isPlan1 ? '₹1,500' : '₹1,799'} 
              {!isPlan1 && <span className="text-lg text-slate-500 font-normal"> / month</span>}
            </div>

            <p className="text-base text-slate-600">
              {isPlan1 
                ? `Purchased on ${profile.paid_at ? new Date(profile.paid_at).toLocaleDateString() : 'N/A'}`
                : isPendingCancel
                  ? 'Your subscription will not renew. You will be downgraded to a free user at the end of the current billing cycle.'
                  : `Renews automatically every month. Started on ${profile.paid_at ? new Date(profile.paid_at).toLocaleDateString() : 'N/A'}`
              }
            </p>

            <div className="pt-8 flex flex-wrap gap-4 border-t border-slate-100">
              {isPlan2 && !isPendingCancel && (
                <button 
                  className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-11 px-6 rounded-lg inline-flex items-center justify-center font-semibold transition-colors shadow-sm" 
                  onClick={() => setShowCancelModal(true)} 
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Beautiful Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartCrack className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">We're so sad to see you go!</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                You and Quantum Karma were like BFFs. We've loved mapping your cosmic journey together. Are you absolutely sure you want to cancel? 
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8 text-sm text-slate-600 text-left">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>You'll keep your remaining <strong>{profile.credits} credits</strong> until the end of your billing cycle.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>You can still come back and check us out later anytime!</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 rounded-xl transition-colors shadow-sm"
                >
                  Nevermind, I'll stay
                </button>
                <button 
                  onClick={confirmCancellation}
                  disabled={actionLoading}
                  className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-600 font-semibold h-12 rounded-xl transition-colors flex items-center justify-center"
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, cancel my subscription"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
