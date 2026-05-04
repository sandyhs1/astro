/**
 * GET /api/intercom/hash
 *
 * Generates an HMAC-SHA256 Identity Verification hash for the currently
 * authenticated user. Intercom requires this hash (user_hash) when Identity
 * Verification is enabled — without it the Messenger will not load for
 * signed-in users (error: user_hash_is_missing).
 *
 * The secret (INTERCOM_UNIFIED_SECRET) must NEVER be sent to the browser.
 * This route runs server-side only and returns just the computed hash.
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function GET() {
  // ── Verify the caller is authenticated via Supabase session ────────────────
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {}, // read-only in this route
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = process.env.INTERCOM_UNIFIED_SECRET;
  if (!secret) {
    console.error('[intercom/hash] INTERCOM_UNIFIED_SECRET is not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  // ── Generate HMAC-SHA256(secret, user_id) ───────────────────────────────────
  // This is the exact format Intercom's Identity Verification requires.
  const hash = crypto
    .createHmac('sha256', secret)
    .update(user.id)
    .digest('hex');

  return NextResponse.json({ hash });
}
