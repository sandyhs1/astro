import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserEntitlement, cancelSubscription } from '@/lib/freemius';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const entitlement = await getUserEntitlement(user.id);
    if (!entitlement) {
      return NextResponse.json({ success: false, message: 'No active subscription' }, { status: 400 });
    }

    const success = await cancelSubscription(entitlement);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
