'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import type { PricingData } from '@/lib/freemius';

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<PricingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await fetch('/api/freemius/get-pricing-data');
        const data = await res.json();
        
        if (data.pricingData) {
          setPlans(data.pricingData);
        } else {
          setError(data.error || 'Failed to load pricing');
        }
      } catch (err) {
        setError('Failed to load pricing');
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose the plan that best fits your needs.
        </p>
        
        <div className="mt-6 flex justify-center space-x-4">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md ${billingCycle === 'monthly' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-md ${billingCycle === 'annual' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Annual
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.monthly : plan.annual;
          const isRecurring = plan.monthly !== null || plan.annual !== null;
          
          return (
            <div key={plan.planId} className={`border rounded-2xl p-8 shadow-sm ${plan.isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
              <h3 className="text-2xl font-bold">{plan.title}</h3>
              {plan.isCurrentPlan && (
                <span className="inline-block mt-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              )}
              
              <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                ${price !== null ? price : '0'}
                {isRecurring && (
                  <span className="ml-1 text-xl font-medium text-muted-foreground">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                )}
              </div>
              
              {!isRecurring && <p className="mt-2 text-muted-foreground">One-time payment</p>}
              
              {billingCycle === 'annual' && plan.annualDiscount && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  Save {plan.annualDiscount}%
                </p>
              )}

              <button 
                disabled={!plan.canCheckout}
                className="w-full mt-8 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  let url = plan.checkoutUrl;
                  if (url && billingCycle === 'monthly') {
                    url += url.includes('?') ? '&billing_cycle=monthly' : '?billing_cycle=monthly';
                  }
                  if (url) window.location.href = url;
                }}
              >
                {plan.buttonText}
              </button>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="flex-shrink-0 w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium">{feature.title}</p>
                      {feature.value && <p className="text-sm text-muted-foreground">{feature.value}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
