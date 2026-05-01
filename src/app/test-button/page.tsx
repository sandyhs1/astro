'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function TestButtonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleTestPremiumAction = async () => {
    setLoading(true);
    try {
      // In a real scenario, this would call a protected API like chart-details
      // For this test, we simulate an API that checks entitlement.
      const res = await fetch('/api/freemius/get-entitlements', {
        method: 'POST',
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401 || res.status === 403 || data.code === 'subscription_required') {
          toast.error('Premium Subscription Required');
          router.push('/pricing');
          return;
        }
        throw new Error(data.error || 'Request failed');
      }
      
      if (!data.entitlement) {
        toast.error('Premium Subscription Required');
        router.push('/pricing');
        return;
      }
      
      toast.success('Premium action successful! You have an active subscription.');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Test Premium Action</h1>
        <p className="text-muted-foreground">
          Click the button below to simulate a premium feature. If you don't have an active Freemius subscription, you'll be redirected to the pricing page.
        </p>
        
        <button 
          onClick={handleTestPremiumAction} 
          disabled={loading}
          className="w-full text-lg bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md font-medium transition-colors"
        >
          {loading ? 'Processing...' : 'Execute Premium Action'}
        </button>
      </div>
    </div>
  );
}
