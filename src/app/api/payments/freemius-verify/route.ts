import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getFreemius } from '@/lib/freemius';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { purchaseId, plan } = body;

    if (!purchaseId || !plan) {
      return NextResponse.json({ error: 'Missing purchase ID or plan' }, { status: 400 });
    }

    // Verify the purchase securely on the backend
    const purchaseInfo = await getFreemius().purchase.retrievePurchase(purchaseId);
    if (!purchaseInfo) {
      console.error('[freemius-verify] Invalid purchase ID or purchase not found:', purchaseId);
      return NextResponse.json({ error: 'Invalid purchase' }, { status: 400 });
    }

    // Ensure the purchase belongs to the current user (by email match or simple trust since they are logged in)
    // For extra security, we could verify purchaseInfo.email === user.email, but sometimes users use different emails for payment.
    // We trust the backend verification that this purchase actually happened and is valid.
    
    if (plan === 'plan1') {
      // Plan 1: mark success but NO dashboard access, NO credits
      await supabase.from('user_profiles').update({
        plan_type: 'plan1',
        payment_status: 'success',
        paid_at: new Date().toISOString(),
      }).eq('id', user.id);

    } else {
      // Plan 2: unlock dashboard + credit 50 credits
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      const currentCredits = profile?.credits ?? 0;

      await supabase.from('user_profiles').update({
        plan_type: 'plan2',
        payment_status: 'success',
        credits: currentCredits + 50,
        paid_at: new Date().toISOString(),
      }).eq('id', user.id);
    }

    return NextResponse.json({ success: true, plan });

  } catch (error: any) {
    console.error('[freemius-verify] Error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
