'use client';

/**
 * IntercomProvider.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Mounts the Intercom Messenger on every page and identifies the user as soon
 * as they are authenticated.
 *
 * Identity strategy
 * ─────────────────
 * • Logged-in users  → boot with user_id, email, name, and created_at.
 *                      Name is resolved in priority order:
 *                        1. family_profiles.name  (Self relationship)
 *                        2. user_metadata.full_name / .name  (OAuth / magic-link)
 *                        3. email prefix as last resort
 * • Visitors         → boot anonymously so the chat widget still appears.
 * • Sign-out         → calls Intercom('shutdown') to clear the session, then
 *                      re-boots anonymously.
 *
 * Environment variables required
 * ───────────────────────────────
 *   NEXT_PUBLIC_INTERCOM_APP_ID   (safe to expose to the browser)
 *   INTERCOM_UNIFIED_SECRET       (server-side HMAC signing only — never sent to client)
 */

import { useEffect, useRef } from 'react';
import Intercom from '@intercom/messenger-js-sdk';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

// ── App ID is a public token — safe to read in the browser ───────────────────
const APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID as string;

// ── Helper: boot Intercom anonymously (visitor / logged-out state) ────────────
function bootVisitor() {
  Intercom({ app_id: APP_ID });
}

// ── Helper: shut down the current Intercom session ───────────────────────────
function shutdownIntercom() {
  if (typeof window !== 'undefined' && (window as any).Intercom) {
    (window as any).Intercom('shutdown');
  }
}

export default function IntercomProvider() {
  const { user, loading } = useAuth();
  const supabase = createClient();

  // Track the last user ID we identified so we only re-boot on actual changes
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Wait until Supabase auth state is resolved to prevent a visitor → user flash
    if (loading) return;

    // ── Signed-out path ───────────────────────────────────────────────────────
    if (!user) {
      // If we were previously identified as a user, shut down first to clear
      // all user-specific data from the widget before booting as a visitor.
      if (lastUserIdRef.current) {
        shutdownIntercom();
        lastUserIdRef.current = null;
      }
      bootVisitor();
      return;
    }

    // ── Signed-in path ────────────────────────────────────────────────────────
    // Skip the full re-identification if the same user is already identified.
    // This avoids redundant Intercom calls on every re-render.
    if (lastUserIdRef.current === user.id) return;

    // Resolve the user's display name asynchronously, then boot Intercom.
    (async () => {
      let displayName: string | undefined;

      try {
        // Priority 1: fetch the "Self" profile saved in the dashboard onboarding
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
        // Non-fatal — fall through to metadata fallbacks below
      }

      // Priority 2: OAuth / magic-link user_metadata fields
      if (!displayName) {
        displayName =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          undefined;
      }

      // Priority 3: derive a readable name from the email address
      if (!displayName && user.email) {
        displayName = user.email.split('@')[0];
      }

      // Unix timestamp (seconds) for the Intercom "signed up" field
      const createdAtUnix = user.created_at
        ? Math.floor(new Date(user.created_at).getTime() / 1000)
        : undefined;

      // Shut down any anonymous/previous session before re-identifying
      shutdownIntercom();

      // Boot with full identity — this populates the Intercom inbox with
      // the user's Name, Email, User ID, and Signed-up date automatically.
      Intercom({
        app_id:     APP_ID,
        user_id:    user.id,          // Unique, stable identifier
        email:      user.email ?? undefined,
        name:       displayName,
        created_at: createdAtUnix,
      });

      lastUserIdRef.current = user.id;
    })();
  }, [user, loading, supabase]);

  // ── Global cleanup: shut down when the component unmounts ────────────────────
  useEffect(() => {
    return () => {
      shutdownIntercom();
    };
  }, []);

  // This component renders nothing — it is a pure side-effect provider
  return null;
}
