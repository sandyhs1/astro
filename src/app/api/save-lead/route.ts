import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error('❌ Supabase environment variables are missing.');
        return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    try {
        const body = await req.json();
        console.log('📝 Received lead capture request:', JSON.stringify(body, null, 2));
        
        const { fullName, email, dob, tob, pob, questions, paymentStatus, transactionId } = body;

        if (!fullName || !email) {
            console.error('❌ Missing required fields (fullName or email)');
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
            ])
            .select()
            .single();

        if (error || !data) {
            console.error('❌ Supabase DB Insert Error:', JSON.stringify(error, null, 2));
            return NextResponse.json({ 
                error: error?.message || 'Failed to save lead', 
                details: error?.details, 
                hint: error?.hint 
            }, { status: 500 });
        }

        console.log('✅ Lead successfully saved to Supabase');

        // --- CLIENT PORTAL CREATION ---
        
        // Generate a URL-safe unqiue token (e.g. 16 chars)
        const accessToken = crypto.randomUUID().replace(/-/g, '').substring(0, 16);
        // Generate a 6-digit PIN
        const accessPin = Math.floor(100000 + Math.random() * 900000).toString();

        const { error: portalError } = await supabase
            .from('client_portals')
            .insert({
                lead_id: data.id,
                full_name: fullName,
                email: email,
                access_token: accessToken,
                access_pin: accessPin,
                status: 'pending'
            });
            
        if (portalError) {
            console.error('❌ Failed to create client portal:', portalError);
            // Non-blocking error, lead was saved
        } else {
            console.log(`✅ Client Portal created for ${email}`);
            // Dreamlit.ai will automatically detect this new row and send the email
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err: any) {
        console.error('❌ Save Lead API Exception:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
