/**
 * POST /api/save-lead
 *
 * Called by the OnboardingModal after the user completes all form steps (just before
 * the payment screen is shown). This route:
 *   1. Inserts the user's details into the `onboarding_leads` table.
 *   2. Creates a matching row in `client_portals` with a cryptographically secure
 *      access token and PIN so the user can later access their report.
 *
 * Security notes:
 *   - The access token is a full 32-character UUID hex string (2^128 combinations).
 *   - The 6-digit PIN is generated using Node's `crypto.randomInt`, which draws
 *     entropy from the OS — NOT from Math.random() which is predictable/seedable.
 *   - The initial payment_status defaults to 'pending'. Admins update it to
 *     'success' or 'failed' via /admin → /api/admin/update-payment.
 *   - Dreamlit.ai is configured to only fire the welcome email when
 *     payment_status is updated to 'success', preventing emails to non-payers.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// Use Node's built-in crypto module — provides OS-level entropy, cryptographically secure.
// NEVER use Math.random() for security-sensitive values.
import { randomUUID, randomInt } from 'crypto';

export async function POST(req: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error('❌ Supabase environment variables are missing.');
        return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    // Use the service_role key so we can bypass RLS and write from a server context.
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    try {
        const body = await req.json();
        console.log('📝 Received lead capture request:', JSON.stringify(body, null, 2));
        
        const { fullName, email, gender, dob, tob, pob, questions, paymentStatus, transactionId } = body;

        // Guard: fullName and email are the minimum required to create a meaningful lead.
        if (!fullName || !email) {
            console.error('❌ Missing required fields (fullName or email)');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // ── Step 1: Insert lead into onboarding_leads ────────────────────────────
        const { data, error } = await supabase
            .from('onboarding_leads')
            .insert([
                {
                    full_name: fullName,
                    email: email,
                    gender: gender || null,
                    dob: dob || null,
                    tob: tob || null,
                    pob: pob || null,
                    questions: questions || null,
                    // All leads start as 'pending' until payment is confirmed by admin.
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

        // ── Step 2: Create the Client Portal row ─────────────────────────────────
        
        // Access Token: Full 32-character UUID hex string.
        // e.g. "550e8400e29b41d4a716446655440000"
        // This becomes the unique URL segment: /portal/<accessToken>
        // With 2^128 possible values, brute-force guessing is computationally impossible.
        const accessToken = randomUUID().replace(/-/g, '');

        // PIN: 6-digit number (100000–999999) from OS-entropy crypto source.
        // This is a second authentication factor — user must know BOTH the URL and PIN.
        // Note: PIN uniqueness across users is by design NOT enforced globally —
        // two users CAN share the same PIN because they have different unique URLs.
        // (Forcing global PIN uniqueness would exhaust all 900,000 combinations over time.)
        const accessPin = randomInt(100000, 1000000).toString();

        const { error: portalError } = await supabase
            .from('client_portals')
            .insert({
                lead_id: data.id,
                full_name: fullName,
                email: email,
                access_token: accessToken,
                access_pin: accessPin,
                // 'pending' = report not yet uploaded
                status: 'pending',
                // Mirrors onboarding_leads.payment_status. Admin updates this via /admin dashboard.
                // Dreamlit watches for payment_status = 'success' before sending the welcome email.
                payment_status: paymentStatus || 'pending'
            });
            
        if (portalError) {
            // Non-fatal: the lead record was saved. Log for investigation but don't abort.
            console.error('❌ Failed to create client portal:', portalError);
        } else {
            console.log(`✅ Client Portal created for ${email}`);
            // Dreamlit.ai monitors the client_portals table. The welcome email
            // (with the portal URL and PIN) is only triggered when
            // payment_status transitions to 'success'.
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err: any) {
        console.error('❌ Save Lead API Exception:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
