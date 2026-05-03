import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId, fullName, experienceLevel, q1Answer, q2Answer, q3Answer } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if the user is already in the astrologers table
    const { data: existing } = await supabaseAdmin
      .from('astrologers')
      .select('status')
      .eq('id', userId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ message: 'Application already exists', status: existing.status }, { status: 200 });
    }

    // Insert as pending
    const { error: insertError } = await supabaseAdmin
      .from('astrologers')
      .insert([{ 
        id: userId, 
        status: 'pending',
        full_name: fullName,
        experience_level: experienceLevel,
        q1_answer: q1Answer,
        q2_answer: q2Answer,
        q3_answer: q3Answer
      }]);

    if (insertError) {
      console.error('Failed to insert astrologer:', insertError);
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('API /astrologer/apply error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
