/**
 * POST /api/admin/update-payment
 *
 * Admin-only endpoint to update the payment_status for a specific lead.
 *
 * This is called from the /admin dashboard when an admin changes the
 * payment status dropdown for a client row.
 *
 * Updates two tables in sync:
 *   - onboarding_leads.payment_status  → the source of truth
 *   - client_portals.payment_status   → mirror, used by the portal verify API
 *     to dynamically render the correct message to the end user.
 *
 * Valid values for paymentStatus:
 *   - 'pending'  → Default. Lead captured, payment not confirmed.
 *   - 'success'  → Payment confirmed. Dreamlit email is triggered.
 *                  Portal shows "Analyzing the Stars..."
 *   - 'failed'   → Payment failed or abandoned. Portal shows "Payment Incomplete".
 *
 * Authentication: Bearer token derived from ADMIN_PASSWORD env variable.
 * This is a server-side route — safe to call from the admin dashboard.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Validates the Authorization header against the expected admin token.
 * The token is a base64-encoded version of the ADMIN_PASSWORD env variable.
 */
const isAuthenticated = (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    const expectedToken = Buffer.from(process.env.ADMIN_PASSWORD || '').toString('base64');
    return authHeader === `Bearer ${expectedToken}`;
};

export async function POST(req: Request) {
    // Guard: Reject unauthenticated requests immediately.
    if (!isAuthenticated(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    // Use service_role key to bypass RLS and perform admin-level writes.
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    try {
        const body = await req.json();
        const { leadId, paymentStatus } = body;

        if (!leadId || !paymentStatus) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // ── Step 1: Update onboarding_leads (source of truth) ────────────────────
        const { error: leadsError } = await supabase
            .from('onboarding_leads')
            .update({ payment_status: paymentStatus })
            .eq('id', leadId);

        if (leadsError) throw leadsError;

        // ── Step 2: Mirror the update to client_portals ───────────────────────────
        // The portal verify API reads payment_status from client_portals to decide
        // which UI message to show the user. We keep both tables in sync here.
        const { error: portalsError } = await supabase
            .from('client_portals')
            .update({ payment_status: paymentStatus })
            .eq('lead_id', leadId);

        if (portalsError) {
            // Log but don't throw — if the portal row doesn't exist yet (edge case),
            // the lead update still succeeded which is the source of truth.
            console.error('⚠️ Failed to mirror payment_status to client_portals:', portalsError);
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('❌ Update Payment Status Exception:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
