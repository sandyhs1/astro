import { Freemius, PurchaseEntitlementData, Checkout } from '@freemius/sdk';
import { createAdminClient } from './supabase/server';

// ── Lazy singleton ──────────────────────────────────────────────────────────
// We intentionally do NOT instantiate Freemius at module-load time.
// The Freemius SDK validates its config immediately in the constructor and
// throws "Unsupported FSId type: undefined" when env vars are missing (e.g.
// during Vercel's build-time static analysis). Using a lazy getter ensures
// the SDK is only created at actual request time when env vars are present.
let _freemius: Freemius | null = null;

export function getFreemius(): Freemius {
  if (!_freemius) {
    const productId = process.env.FREEMIUS_PRODUCT_ID;
    const apiKey = process.env.FREEMIUS_API_KEY;
    const secretKey = process.env.FREEMIUS_SECRET_KEY;
    const publicKey = process.env.FREEMIUS_PUBLIC_KEY;

    if (!productId || !apiKey || !secretKey || !publicKey) {
      throw new Error(
        'Missing Freemius environment variables. Ensure FREEMIUS_PRODUCT_ID, ' +
        'FREEMIUS_API_KEY, FREEMIUS_SECRET_KEY, and FREEMIUS_PUBLIC_KEY are set.'
      );
    }

    _freemius = new Freemius({ productId, apiKey, secretKey, publicKey });
  }
  return _freemius;
}

// Keep a named export for backward-compat with files that import { freemius }
// This is a getter so it stays lazy.
export const freemius = { get instance() { return getFreemius(); } } as unknown as Freemius;

const SANDBOX = false; // Set to true to use Freemius sandbox/test mode

/**
 * Get the active entitlement for a user based on the records in the database.
 */
export async function getUserEntitlement(userId: string) {
  const supabase = await createAdminClient();
  const { data: entitlements, error } = await supabase
    .from('user_fs_entitlement')
    .select('*')
    .eq('user_id', userId);

  if (error || !entitlements) {
    console.error('Error fetching entitlements:', error);
    return null;
  }

  const mappedEntitlements = entitlements.map((entitlement: any) => ({
    fsLicenseId: entitlement.fs_license_id,
    fsPlanId: entitlement.fs_plan_id,
    fsPricingId: entitlement.fs_pricing_id,
    fsUserId: entitlement.fs_user_id,
    type: entitlement.type,
    expiration: entitlement.expiration,
    isCanceled: entitlement.is_canceled,
    createdAt: entitlement.created_at,
  }));

  const actives = getFreemius().entitlement.getActives(mappedEntitlements) ?? [];
  return actives?.[actives.length - 1] ?? null;
}

export async function deleteEntitlement(fsLicenseId: string) {
  const supabase = await createAdminClient();
  await supabase.from('user_fs_entitlement').delete().eq('fs_license_id', fsLicenseId);
}

/**
 * Helper function to check if the user has an active subscription for a specific plan.
 */
export async function hasPlan(userId: string, planId: string): Promise<boolean> {
  const entitlement = await getUserEntitlement(userId);
  return String(entitlement?.fsPlanId) === String(planId);
}

/**
 * Process purchase webhook/redirect to synchronize entitlement info to the database.
 */
export async function processPurchase(licenseId: string) {
  const purchaseInfo = await getFreemius().purchase.retrievePurchase(licenseId);
  if (!purchaseInfo) {
    console.error('Purchase info not found for license:', licenseId);
    return;
  }
  const supabase = await createAdminClient();

  // Get local user by email (assuming email is unique across users)
  // In Supabase, auth.users is not queryable easily via REST unless using admin api
  // Let's use RPC or an existing profile table. Assuming 'profiles' table exists or we match by email.
  // We'll query auth.users using admin api:
  const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
  const localUser = userData?.users?.find(u => u.email === purchaseInfo.email);

  if (!localUser) {
    console.error('Local user not found for email:', purchaseInfo.email);
    return;
  }

  // Convert purchase info
  const entitlementData = purchaseInfo.toEntitlementRecord({
    userId: localUser.id,
  });

  const entitlementDataForDB = {
    user_id: entitlementData.userId,
    fs_license_id: entitlementData.fsLicenseId,
    fs_plan_id: entitlementData.fsPlanId,
    fs_pricing_id: entitlementData.fsPricingId,
    fs_user_id: entitlementData.fsUserId,
    type: entitlementData.type,
    expiration: entitlementData.expiration,
    is_canceled: entitlementData.isCanceled,
    created_at: entitlementData.createdAt,
  };

  const newId = crypto.randomUUID();
  const { error } = await supabase
    .from('user_fs_entitlement')
    .upsert(
      { id: newId, ...entitlementDataForDB },
      { onConflict: 'fs_license_id' }
    );

  if (error) {
    console.error('Error upserting entitlement:', error);
  }
}

export type PricingData = {
  annual: number | null;
  monthly: number | null;
  annualDiscount: number | null;
  planId: string;
  title: string;
  canCheckout: boolean;
  checkoutUrl: string;
  isCurrentPlan: boolean;
  buttonText: string;
  features: { title: string; value: string }[];
};

async function createFreemiusCheckout(
  user: { email: string; firstName?: string; lastName?: string },
  planId?: string
): Promise<Checkout> {
  const checkout = await getFreemius().checkout.create({
    user,
    planId: planId,
    isSandbox: SANDBOX,
  });
  return checkout;
}

export async function getPricingData(
  user: { email: string; firstName?: string; lastName?: string },
  entitlement: Pick<PurchaseEntitlementData, 'fsLicenseId' | 'fsPlanId'> | null = null
): Promise<PricingData[]> {
  const productPricing = await getFreemius().api.product.retrievePricingData();
  const upgradeAuth = entitlement
    ? await getFreemius().api.license.retrieveCheckoutUpgradeAuthorization(entitlement.fsLicenseId)
    : null;

  const subscription = entitlement
    ? await getFreemius().api.license.retrieveSubscription(entitlement.fsLicenseId)
    : null;
  const hasActiveSubscription = subscription?.canceled_at == null;
  const currentPlanIndex = entitlement
    ? (productPricing?.plans?.findIndex((plan) => plan.id === entitlement.fsPlanId) ?? -1)
    : -1;

  const data: PricingData[] = [];
  let index = 0;

  for (const plan of productPricing?.plans ?? []) {
    if (plan.is_hidden) continue;

    const checkout = await createFreemiusCheckout(user, plan.id!);
    const isCurrentPlan = entitlement?.fsPlanId == plan.id;

    if (upgradeAuth && entitlement) {
      checkout.setLicenseUpgradeByAuth({
        authorization: upgradeAuth,
        licenseId: entitlement.fsLicenseId,
      });
    }

    const annualPrice = plan.pricing?.[0]?.annual_price;
    const monthlyPrice = plan.pricing?.[0]?.monthly_price;
    let annualOverMonthlyDiscount = null;

    if (annualPrice != undefined && monthlyPrice != undefined) {
      const annualCost = annualPrice;
      const monthlyCost = monthlyPrice * 12;
      if (monthlyCost > 0) {
        annualOverMonthlyDiscount = Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
      }
    }

    const canCheckout = !hasActiveSubscription || !isCurrentPlan;
    const isLowerPlan = currentPlanIndex !== -1 && index < currentPlanIndex;
    const buttonText =
      !upgradeAuth || !hasActiveSubscription
        ? 'Subscribe'
        : isCurrentPlan
        ? 'Your Plan'
        : isLowerPlan
        ? 'Downgrade'
        : 'Upgrade';

    data.push({
      isCurrentPlan,
      canCheckout,
      buttonText,
      annual: plan.pricing?.[0]?.annual_price ?? null,
      monthly: plan.pricing?.[0]?.monthly_price ?? null,
      annualDiscount: annualOverMonthlyDiscount,
      planId: plan.id!,
      title: plan.title!,
      checkoutUrl: canCheckout ? checkout.getLink() : '',
      features: plan.features?.map((f) => ({ title: f.title!, value: f.value! })) ?? [],
    });
    index++;
  }

  return data;
}

export async function cancelSubscription(
  entitlement: Pick<PurchaseEntitlementData, 'fsLicenseId'>
): Promise<boolean> {
  const subscription = await getFreemius().api.license.retrieveSubscription(entitlement.fsLicenseId);
  if (!subscription || subscription.canceled_at != null) {
    return false;
  }
  await getFreemius().api.subscription.cancel(subscription.id!);
  return true;
}

export const LIVE_SUPABASE_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/freemius/process-checkout`;
export const LIVE_FRONTEND_URL = `${process.env.NEXT_PUBLIC_SITE_URL}`;
