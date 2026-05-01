import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getFreemius } from '@/lib/freemius';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const portal = await getFreemius().api.user.retrieveHostedCustomerPortalByEmail(user.email);
    return NextResponse.json({ link: portal?.link || null });
  } catch (error) {
    console.error('Error fetching portal link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
