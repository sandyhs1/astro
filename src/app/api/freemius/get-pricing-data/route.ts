import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPricingData, getUserEntitlement } from '@/lib/freemius';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const entitlement = user ? await getUserEntitlement(user.id) : null;
    const pricingData = await getPricingData(
      {
        email: user?.email || '',
        firstName: user?.user_metadata?.first_name || '',
        lastName: user?.user_metadata?.last_name || ''
      },
      entitlement
    );

    return NextResponse.json({ pricingData });
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
