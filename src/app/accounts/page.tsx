'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
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

  const fetchAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/pricing');
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

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your monthly subscription? You will retain your AI credits until the end of your current billing cycle.')) return;
    
    setActionLoading(true);
    try {
      const res = await fetch('/api/payments/cancel-subscription', { method: 'POST' });
      const json = await res.json();
      
      if (res.ok && json.success) {
        toast.success('Subscription cancelled. It will not renew.');
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // No active plan
  if (!profile || !profile.plan_type) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-16">
        <div className="bg-[#1a0f2e] text-white border border-[#2d1b4e] rounded-xl p-8 text-center space-y-4 shadow-[0_0_40px_rgba(138,43,226,0.1)]">
          <Zap className="w-12 h-12 text-[#FFD700] mx-auto opacity-80" />
          <h2 className="text-2xl font-bold font-serif text-[#E2E8F0]">No Active Plan</h2>
          <p className="text-[#94A3B8]">You don't have an active subscription or plan at the moment.</p>
          <div className="pt-4">
            <p className="text-sm text-slate-400 mb-4">Current AI Credits: <span className="font-bold text-[#FFD700]">{profile?.credits || 0}</span></p>
            <button onClick={() => router.push('/pricing')} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold h-11 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(138,43,226,0.4)]">
              View Pricing Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPlan1 = profile.plan_type === 'plan1';
  const isPlan2 = profile.plan_type === 'plan2';
  const isPendingCancel = profile.payment_status === 'pending_cancellation';

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#E2E8F0]">Account & Billing</h1>
          <p className="text-[#94A3B8] mt-1">Manage your Quantum Karma subscription and credits</p>
        </div>
        <div className="bg-[#1a0f2e] border border-[#2d1b4e] px-4 py-2 rounded-full flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#FFD700]" />
          <span className="text-sm font-medium text-slate-300">Available Credits:</span>
          <span className="font-bold text-[#FFD700]">{profile.credits}</span>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-[#1a0f2e] border border-[#2d1b4e] rounded-xl shadow-[0_0_40px_rgba(138,43,226,0.1)] overflow-hidden">
        <div className="p-6 border-b border-[#2d1b4e] bg-[#120a20] flex justify-between items-center">
          <h3 className="text-xs uppercase tracking-widest text-[#94A3B8] font-bold">
            CURRENT PLAN
          </h3>
          {isPendingCancel ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <AlertCircle className="w-3.5 h-3.5" />
              Cancels at billing cycle end
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active
            </span>
          )}
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded text-sm font-bold tracking-wide">
              {isPlan1 ? 'Destiny Report (One-Time)' : 'AI Credits Plan (Monthly)'}
            </span>
          </div>
          
          <div className="text-4xl font-bold text-white font-serif">
            {isPlan1 ? '₹1,500' : '₹1,799'} 
            {!isPlan1 && <span className="text-lg text-[#94A3B8] font-sans font-normal"> / month</span>}
          </div>

          <p className="text-sm text-[#94A3B8]">
            {isPlan1 
              ? `Purchased on ${profile.paid_at ? new Date(profile.paid_at).toLocaleDateString() : 'N/A'}`
              : isPendingCancel
                ? 'Your subscription will not renew. You will be downgraded to a free user at the end of the current billing cycle.'
                : `Renews automatically every month. Started on ${profile.paid_at ? new Date(profile.paid_at).toLocaleDateString() : 'N/A'}`
            }
          </p>

          <div className="pt-6 flex flex-wrap gap-4 border-t border-[#2d1b4e]">
            {isPlan1 && (
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white h-10 px-6 rounded-md inline-flex items-center justify-center font-bold transition-all shadow-lg hover:shadow-purple-500/25" onClick={() => router.push('/pricing')}>
                Upgrade to Monthly
              </button>
            )}

            {isPlan2 && !isPendingCancel && (
              <button 
                className="bg-[#120a20] border border-red-900/50 text-red-400 hover:bg-red-950/30 hover:text-red-300 hover:border-red-800/50 h-10 px-6 rounded-md inline-flex items-center justify-center font-bold transition-all" 
                onClick={handleCancel} 
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Cancel Subscription
              </button>
            )}

            {isPlan2 && isPendingCancel && (
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white h-10 px-6 rounded-md inline-flex items-center justify-center font-bold transition-all shadow-lg hover:shadow-purple-500/25" onClick={() => router.push('/pricing')}>
                Re-subscribe
              </button>
            )}
            
            <button className="bg-[#2d1b4e] hover:bg-[#3d256a] text-white border border-[#4a2e82] h-10 px-6 rounded-md inline-flex items-center justify-center font-bold transition-colors" onClick={() => router.push('/pricing')}>
              Buy Extra Credits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
