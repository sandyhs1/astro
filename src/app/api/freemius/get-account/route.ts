import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserEntitlement, getFreemius } from '@/lib/freemius';
import type { PurchaseEntitlementData } from '@freemius/sdk';

export type SubscriptionPaymentData = {
  subscription: {
    id: string;
    cyclePricing: number;
    frequency: 'annual' | 'monthly';
    nextPayment: string;
    isCancelled: boolean;
    canceledAt: string | null;
    planTitle: string | null;
    unitTitle: string | null;
  } | null;
  payments: {
    id: string;
    gross: number;
    vat: number;
    currency: string;
    created: string;
    planTitle: string | null;
    type: 'payment' | 'refund';
    unitTitle: string | null;
    isRenewal: boolean;
  }[];
};

async function getSubscriptionAndPayments(
  entitlement: Pick<PurchaseEntitlementData, 'fsLicenseId' | 'fsUserId'>
): Promise<SubscriptionPaymentData> {
  const subscription = await getFreemius().api.license.retrieveSubscription(entitlement.fsLicenseId);
  const payments = await getFreemius().api.user.retrievePayments(entitlement.fsUserId);
  const pricingData = await getFreemius().api.product.retrievePricingData();

  const planTitleById = new Map<string, string>();
  const pricingById = new Map<string, { quota: number }>();

  pricingData?.plans?.forEach((plan) => {
    planTitleById.set(plan.id!, plan.title!);
    plan.pricing?.forEach((pricing) => {
      pricingById.set(pricing.id!, { quota: pricing.licenses ?? 1 });
    });
  });

  function formatQuota(quota: number | null): string | null {
    if (!quota || quota === 1) return null;
    const singular = pricingData?.plugin?.selling_unit_label?.singular ?? 'Unit';
    const plural = pricingData?.plugin?.selling_unit_label?.plural ?? 'Units';
    return `${quota} ${quota === 1 ? singular : plural}`;
  }

  const data: SubscriptionPaymentData = {
    subscription: subscription
      ? {
          id: subscription.id!,
          cyclePricing: subscription.amount_per_cycle!,
          frequency: subscription.billing_cycle === 12 ? 'annual' : 'monthly',
          nextPayment: subscription.next_payment!,
          isCancelled: subscription.canceled_at !== null,
          canceledAt: subscription.canceled_at ?? null,
          planTitle: planTitleById.get(subscription.plan_id!) ?? 'Unknown Plan',
          unitTitle: formatQuota(pricingById.get(subscription.pricing_id!)?.quota ?? null),
        }
      : null,
    payments: payments?.map((payment) => ({
      id: payment.id!,
      gross: payment.gross!,
      vat: payment.vat!,
      currency: payment.currency!,
      created: payment.created!,
      planTitle: planTitleById.get(payment.plan_id!) ?? 'Unknown Plan',
      type: payment.type === 'payment' ? 'payment' : 'refund',
      unitTitle: formatQuota(pricingById.get(payment.pricing_id!)?.quota ?? null),
      isRenewal: payment.is_renewal ?? false,
    })) ?? [],
  };

  return data;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const entitlement = await getUserEntitlement(user.id);
    const subscriptionAndPayments = entitlement ? await getSubscriptionAndPayments(entitlement) : null;
    return NextResponse.json({ entitlement, subscriptionAndPayments });
  } catch (error) {
    console.error('Error fetching account details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
