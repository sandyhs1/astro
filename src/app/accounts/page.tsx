'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';
import { CreditCard, ExternalLink, FileText, Loader2, RefreshCcw } from 'lucide-react';
import type { SubscriptionPaymentData } from '@/app/api/freemius/get-account/route';

export default function AccountsPage() {
  const router = useRouter();
  const [data, setData] = useState<SubscriptionPaymentData | null>(null);
  const [entitlement, setEntitlement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [portalLink, setPortalLink] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(240); // 4 minutes
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAccount = async () => {
    try {
      const res = await fetch('/api/freemius/get-account');
      const json = await res.json();
      setEntitlement(json.entitlement);
      setData(json.subscriptionAndPayments);
    } catch (error) {
      toast.error('Failed to load account details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const handleManageBilling = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/freemius/get-customer-portal-link');
      const json = await res.json();
      if (json.link) {
        const opened = window.open(json.link, '_blank');
        if (!opened) {
          // Popup blocked
          setPortalLink(json.link);
          setCountdown(240);
          timerRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                if (timerRef.current) clearInterval(timerRef.current);
                setPortalLink(null);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
    } catch (error) {
      toast.error('Failed to get billing portal link');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/freemius/cancel-subscription', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.success('Subscription cancelled successfully');
        await fetchAccount();
      } else {
        toast.error(json.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      const res = await fetch(`/api/freemius/download-invoice?payment_id=${paymentId}`);
      
      // If it's an inline PDF response, blob it and open.
      // If it redirected to a URL, fetch will follow it, so it might just be the PDF blob.
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), '_blank');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!entitlement) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-16">
        <div className="bg-card text-card-foreground border rounded-xl p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold">No Active Subscription</h2>
          <p className="text-muted-foreground">You don't have an active subscription at the moment.</p>
          <button onClick={() => router.push('/pricing')} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center font-medium transition-colors">
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  const sub = data?.subscription;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 space-y-8">
      {/* Subscription Card */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-muted/30 flex justify-between items-center">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            CURRENT SUBSCRIPTION
          </h3>
          <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 inline-flex items-center justify-center text-sm font-medium transition-colors" onClick={handleManageBilling} disabled={actionLoading}>
            {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ExternalLink className="w-4 h-4 mr-2" />}
            Manage Billing
          </button>
        </div>

        {portalLink && (
          <div className="p-4 bg-yellow-50 border-b border-yellow-100 text-yellow-800 text-sm flex justify-between items-center">
            <span>
              Your billing portal link is ready: <a href={portalLink} target="_blank" rel="noreferrer" className="underline font-medium">Click here</a>
            </span>
            <span className="font-mono">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded text-sm font-medium">
              {sub?.planTitle || 'Premium Plan'}
            </span>
            {sub?.unitTitle && (
              <span className="bg-muted px-2.5 py-0.5 rounded text-sm text-muted-foreground">
                {sub.unitTitle}
              </span>
            )}
          </div>
          
          <div className="text-3xl font-bold">
            ${sub?.cyclePricing || '0.00'} 
            {sub?.frequency === 'annual' ? <span className="text-lg text-muted-foreground font-normal"> / year</span> : <span className="text-lg text-muted-foreground font-normal"> / month</span>}
          </div>

          <p className="text-sm text-muted-foreground">
            {sub?.isCancelled 
              ? `Cancelled on ${new Date(sub.canceledAt!).toLocaleDateString()}. Access expires on ${new Date(entitlement.expiration).toLocaleDateString()}.`
              : `Renews on ${sub?.nextPayment ? new Date(sub.nextPayment).toLocaleDateString() : 'N/A'}`
            }
          </p>

          <div className="pt-4 flex space-x-3">
            {sub?.isCancelled ? (
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center font-medium transition-colors" onClick={() => router.push('/pricing')}>
                Subscribe Again
              </button>
            ) : (
              <>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center font-medium transition-colors" onClick={() => router.push('/pricing')}>
                  Update Subscription
                </button>
                <button className="border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center font-medium transition-colors" onClick={handleCancel} disabled={actionLoading}>
                  Cancel Subscription
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-muted/30">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            PAYMENTS
          </h3>
        </div>
        
        <div className="divide-y">
          {data?.payments?.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              No payments found.
            </div>
          )}
          {data?.payments?.map((payment) => (
            <div key={payment.id} className="p-6 flex items-center justify-between hover:bg-muted/10 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-muted rounded-full">
                  {payment.type === 'refund' ? <RefreshCcw className="w-5 h-5 text-red-500" /> : <CreditCard className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div>
                  <p className="font-medium">
                    {new Date(payment.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.planTitle} {payment.unitTitle ? `• ${payment.unitTitle}` : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <span className={`font-semibold ${payment.type === 'refund' ? 'text-red-600' : ''}`}>
                    {payment.type === 'refund' ? '-' : ''}${payment.gross.toFixed(2)}
                  </span>
                  <div className="mt-1">
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-medium ${
                      payment.type === 'refund' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {payment.type}
                    </span>
                  </div>
                </div>
                
                <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 inline-flex items-center justify-center text-sm font-medium transition-colors" onClick={() => handleDownloadInvoice(payment.id)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
