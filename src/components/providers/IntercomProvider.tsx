'use client';

/**
 * IntercomProvider.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Correctly mounts the Intercom Messenger and identifies users.
 *
 * ROOT CAUSE OF PREVIOUS BUG:
 * The Intercom() init function from the SDK only runs once because it checks
 * an internal `!ref` guard. Calling Intercom(bootData) again after a user
 * logs in silently does nothing — the widget stays anonymous or disappears.
 *
 * CORRECT PATTERN:
 * 1. Call Intercom({ app_id }) ONCE on mount → loads the script, shows widget
 * 2. For signed-in users → call window.Intercom('boot', { app_id, ...userInfo })
 * 3. For sign-out      → call window.Intercom('shutdown'), then boot anonymously
 *
 * The SDK exports boot() and shutdown() helpers that call window.Intercom()
 * directly and work correctly for re-identification after initial load.
 */

import { useEffect, useRef } from 'react';
import Intercom from '@intercom/messenger-js-sdk';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

const APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID as string;

/** Directly call window.Intercom — works after the script is loaded */
function callIntercom(method: string, ...args: any[]) {
  if (typeof window !== 'undefined' && (window as any).Intercom) {
    (window as any).Intercom(method, ...args);
  }
}

/** Boot Intercom with a payload (works for both anonymous and identified) */
function intercomBoot(payload: Record<string, any>) {
  callIntercom('boot', { app_id: APP_ID, ...payload });
}

/** Shut down the current Intercom session */
function intercomShutdown() {
  callIntercom('shutdown');
}

export default function IntercomProvider() {
  const { user, loading } = useAuth();
  const supabase = createClient();

  // Has the Intercom script been loaded (Intercom() called at least once)?
  const scriptLoadedRef = useRef(false);
  // Track the last identified user ID to avoid redundant re-boots
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Wait until auth state is resolved
    if (loading) return;

    // ── Step 1: Load the Intercom script exactly once ─────────────────────────
    // Intercom() (the default export) injects the <script> tag and sets up
    // window.Intercom. It must only be called once per page session.
    if (!scriptLoadedRef.current) {
      Intercom({ app_id: APP_ID });
      scriptLoadedRef.current = true;
    }

    // ── Step 2: Handle sign-out ───────────────────────────────────────────────
    if (!user) {
      if (lastUserIdRef.current) {
        // User signed out: shut down identified session, re-boot as visitor
        intercomShutdown();
        lastUserIdRef.current = null;
      }
      // Boot anonymously so the widget is still visible to logged-out visitors
      intercomBoot({});
      return;
    }

    // ── Step 3: Handle sign-in / user already logged in ───────────────────────
    // Skip if this exact user is already booted
    if (lastUserIdRef.current === user.id) return;

    // Resolve name and boot with full identity
    (async () => {
      let displayName: string | undefined;

      try {
        const { data: selfProfile } = await supabase
          .from('family_profiles')
          .select('name')
          .eq('user_id', user.id)
          .eq('relationship', 'Self')
          .maybeSingle();

        if (selfProfile?.name) {
          displayName = selfProfile.name;
        }
      } catch {
        // Non-fatal — fall through to metadata fallbacks
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

      // Shut down the anonymous session first, then boot as identified user.
      // Using window.Intercom('boot') directly — NOT the Intercom() init
      // function — because the init function only runs once and silently
      // no-ops on subsequent calls.
      intercomShutdown();

      const payload: Record<string, any> = {
        user_id: user.id,
      };
      if (user.email)    payload.email      = user.email;
      if (displayName)   payload.name       = displayName;
      if (createdAtUnix) payload.created_at = createdAtUnix;

      intercomBoot(payload);

      lastUserIdRef.current = user.id;
    })();
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on full unmount only (page close / hard navigation)
  useEffect(() => {
    return () => {
      intercomShutdown();
    };
  }, []);

  return null;
}
