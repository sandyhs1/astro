import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserEntitlement } from '@/lib/freemius';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const entitlement = await getUserEntitlement(user.id);
    return NextResponse.json({ entitlement });
  } catch (error) {
    console.error('Error fetching entitlements:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const entitlement = await getUserEntitlement(user.id);
    return NextResponse.json({ entitlement });
  } catch (error) {
    console.error('Error fetching entitlements:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
