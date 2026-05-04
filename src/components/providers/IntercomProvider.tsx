'use client';

/**
 * IntercomProvider.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Correctly mounts Intercom with Identity Verification enabled.
 *
 * WHY user_hash IS REQUIRED:
 * Identity Verification is enabled on this Intercom workspace. When enabled,
 * the Messenger will NOT load for signed-in users unless a valid user_hash is
 * passed. The hash is HMAC-SHA256(secret, user_id) — generated server-side
 * via /api/intercom/hash so the secret is never exposed to the browser.
 *
 * BOOT PATTERN (correct for SPAs):
 * 1. Intercom({ app_id }) — called ONCE to inject the script (visitor mode)
 * 2. window.Intercom('boot', { app_id, user_id, user_hash, ... }) — for sign-in
 * 3. window.Intercom('shutdown') + boot anonymously — for sign-out
 *
 * The Intercom() init function from the SDK contains a one-shot guard
 * (!ref) that silently no-ops on repeat calls — so we use window.Intercom
 * directly for all re-identification after the first load.
 */

import { useEffect, useRef } from 'react';
import Intercom from '@intercom/messenger-js-sdk';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

const APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID as string;

function callIntercom(method: string, ...args: any[]) {
  if (typeof window !== 'undefined' && (window as any).Intercom) {
    (window as any).Intercom(method, ...args);
  }
}

function intercomBoot(payload: Record<string, any>) {
  callIntercom('boot', { app_id: APP_ID, ...payload });
}

function intercomShutdown() {
  callIntercom('shutdown');
}

/** Fetch the HMAC-SHA256 user_hash from our server-side API route */
async function fetchUserHash(): Promise<string | null> {
  try {
    const res = await fetch('/api/intercom/hash');
    if (!res.ok) return null;
    const data = await res.json();
    return data.hash ?? null;
  } catch {
    return null;
  }
}

export default function IntercomProvider() {
  const { user, loading } = useAuth();
  const supabase = createClient();

  const scriptLoadedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    // ── Load Intercom script exactly once ──────────────────────────────────────
    if (!scriptLoadedRef.current) {
      Intercom({ app_id: APP_ID });
      scriptLoadedRef.current = true;
    }

    // ── Signed-out: boot anonymously ───────────────────────────────────────────
    if (!user) {
      if (lastUserIdRef.current) {
        intercomShutdown();
        lastUserIdRef.current = null;
      }
      intercomBoot({});
      return;
    }

    // ── Signed-in: already identified this user, skip ─────────────────────────
    if (lastUserIdRef.current === user.id) return;

    // ── Signed-in: resolve name + hash, then boot with full identity ───────────
    (async () => {
      // 1. Resolve display name
      let displayName: string | undefined;

      try {
        const { data: selfProfile } = await supabase
          .from('family_profiles')
          .select('name')
          .eq('user_id', user.id)
          .eq('relationship', 'Self')
          .maybeSingle();

        if (selfProfile?.name) displayName = selfProfile.name;
      } catch {
        // Non-fatal
      }

      if (!displayName) {
        displayName =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          undefined;
      }

      if (!displayName && user.email) {
        displayName = user.email.split('@')[0];
      }

      const createdAtUnix = user.created_at
        ? Math.floor(new Date(user.created_at).getTime() / 1000)
        : undefined;

      // 2. Fetch the HMAC-SHA256 user_hash (required by Identity Verification)
      const userHash = await fetchUserHash();

      if (!userHash) {
        console.warn('[IntercomProvider] Could not obtain user_hash — Messenger will not load for signed-in users. Check /api/intercom/hash.');
        return;
      }

      // 3. Shut down anonymous session, boot as identified user
      intercomShutdown();

      const payload: Record<string, any> = {
        user_id:   user.id,
        user_hash: userHash,   // ← Required for Identity Verification
      };

      if (user.email)    payload.email      = user.email;
      if (displayName)   payload.name       = displayName;
      if (createdAtUnix) payload.created_at = createdAtUnix;

      intercomBoot(payload);

      lastUserIdRef.current = user.id;
    })();
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      intercomShutdown();
    };
  }, []);

  return null;
}
