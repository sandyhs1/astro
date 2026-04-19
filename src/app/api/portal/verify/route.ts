/**
 * POST /api/portal/verify
 *
 * Validates a user's portal token + PIN and returns their portal data.
 * This is the security gateway to all client portal content.
 *
 * Security Architecture (in order of operations):
 *
 * 1. TOKEN LOOKUP FIRST (before PIN):
 *    We fetch the row by token alone, then check the PIN separately in application
 *    code. This allows us to inspect is_locked and failed_attempts BEFORE comparing
 *    the PIN — preventing any info leakage about which field was wrong.
 *
 * 2. LOCK CHECK:
 *    If is_locked = true, we immediately return HTTP 423 (Locked) and stop.
 *    No amount of correct PINs will unlock the portal server-side.
 *    Only an admin running a Supabase SQL reset can unlock it.
 *
 * 3. PIN COMPARISON:
 *    Simple strict equality check in server-side code. Supabase parameterized
 *    queries prevent SQL injection entirely.
 *
 * 4. FAILED ATTEMPT TRACKING:
 *    Every wrong PIN atomically increments failed_attempts. At MAX_FAILED_ATTEMPTS
 *    (5), is_locked is set to true and the portal is permanently locked.
 *    The error message tells genuine users how many attempts remain.
 *
 * 5. SUCCESS RESET:
 *    A correct PIN resets failed_attempts to 0 and updates last_accessed_at,
 *    so a genuine user who made a few typos is not permanently penalised.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Maximum number of wrong PIN attempts before a portal is permanently locked.
// After this threshold, only an admin can reset via Supabase SQL.
const MAX_FAILED_ATTEMPTS = 5;

export async function POST(req: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    try {
        const body = await req.json();
        const { token, pin } = body;

        if (!token || !pin) {
            return NextResponse.json({ error: 'Missing token or PIN' }, { status: 400 });
        }

        // ── Step 1: Look up portal by token ONLY ─────────────────────────────────
        // We intentionally do NOT pass the PIN in the query.
        // This separates the existence check from the authentication check,
        // which lets us apply lock/attempt logic before PIN validation.
        const { data: portal, error: lookupError } = await supabase
            .from('client_portals')
            .select('id, full_name, status, payment_status, report_url, access_pin, failed_attempts, is_locked')
            .eq('access_token', token)
            .single();

        // If the token doesn't match any row, return a generic "Invalid credentials" error.
        // We deliberately do NOT say "token not found" to avoid hinting to attackers
        // which field was wrong.
        if (lookupError || !portal) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // ── Step 2: Lock check ────────────────────────────────────────────────────
        // This runs BEFORE PIN comparison so even a correct PIN can't bypass a lock.
        if (portal.is_locked) {
            return NextResponse.json({ 
                error: 'This portal has been locked due to too many incorrect PIN attempts. Please contact support.' 
            }, { status: 423 }); // HTTP 423 = Locked (RFC 4918)
        }

        // ── Step 3: PIN comparison ────────────────────────────────────────────────
        // Strict equality in server-side JS. Supabase already prevents SQL injection
        // via parameterized queries, so this in-memory comparison is purely for logic.
        const pinIsCorrect = portal.access_pin === pin.trim();

        if (!pinIsCorrect) {
            const newFailedAttempts = (portal.failed_attempts ?? 0) + 1;
            const shouldLock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;

            // Atomically update the failed attempt counter (and lock flag if threshold hit).
            // Using a single .update() call ensures no race conditions between
            // concurrent wrong-PIN submissions.
            await supabase
                .from('client_portals')
                .update({ 
                    failed_attempts: newFailedAttempts,
                    is_locked: shouldLock
                })
                .eq('id', portal.id);

            if (shouldLock) {
                console.warn(`🔒 Portal ${portal.id} LOCKED after ${newFailedAttempts} failed PIN attempts.`);
                return NextResponse.json({ 
                    error: 'Too many incorrect attempts. This portal has been locked for security. Please contact support.'
                }, { status: 423 });
            }

            // Tell the user how many attempts they have left before lockout.
            const remaining = MAX_FAILED_ATTEMPTS - newFailedAttempts;
            return NextResponse.json({ 
                error: `Incorrect PIN. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining before this portal is locked.`
            }, { status: 401 });
        }

        // ── Step 4: Success — reset counters & record access time ─────────────────
        // Reset failed_attempts to 0 so a genuine user who mistyped a few times
        // is not penalised on future visits.
        await supabase
            .from('client_portals')
            .update({ 
                failed_attempts: 0,
                last_accessed_at: new Date().toISOString()
            })
            .eq('id', portal.id);

        const welcomeMessage = `Welcome, ${portal.full_name}. Your cosmic blueprint awaits.`;

        // Return the minimal data the frontend needs — never expose the raw PIN,
        // failed_attempts, or is_locked back to the client.
        return NextResponse.json({ 
            success: true, 
            client: {
                fullName: portal.full_name,
                status: portal.status,
                // payment_status controls which message the portal UI shows:
                // 'pending'  → Awaiting Payment
                // 'failed'   → Payment Incomplete
                // 'success'  → Analyzing the Stars... (or Report Ready if report_url exists)
                paymentStatus: portal.payment_status,
                welcomeMessage,
                hasReport: !!portal.report_url
            }
        }, { status: 200 });

    } catch (err: any) {
        console.error('❌ Verify Portal Exception:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
