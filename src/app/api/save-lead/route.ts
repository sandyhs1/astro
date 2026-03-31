import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase environment variables are missing.');
}

// Create a Supabase client with the service role key to bypass RLS
// DO NOT use this service role key in client-side code!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const { fullName, email, dob, tob, pob, questions, paymentStatus, transactionId } = body;

        if (!fullName || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('onboarding_leads')
            .insert([
                {
                    full_name: fullName,
                    email: email,
                    dob: dob || null,
                    tob: tob || null,
                    pob: pob || null,
                    questions: questions || null,
                    payment_status: paymentStatus || 'pending',
                    transaction_id: transactionId || null
                }
            ]);

        if (error) {
            console.error('Supabase DB Insert Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err: any) {
        console.error('Save Lead API Error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
