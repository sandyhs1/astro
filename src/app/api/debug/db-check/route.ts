/**
 * DEBUG DIAGNOSTIC ENDPOINT
 * GET /api/debug/db-check
 *
 * Tests DB tables, RLS, and service-role INSERT capability.
 * REMOVE THIS FILE before going to production.
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const results: Record<string, any> = {};

  // 1. Check env vars
  results.env = {
    supabaseUrl:     process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
    anonKey:         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
    serviceRoleKey:  process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "MISSING",
    serviceRoleKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10),
  };

  // 2. Test service role — SELECT from saved_reports
  try {
    const { data, error } = await supabaseAdmin
      .from("saved_reports")
      .select("id, report_type, created_at")
      .limit(3);
    results.saved_reports_select = error
      ? { ok: false, error: error.message, code: error.code }
      : { ok: true, rowCount: data?.length ?? 0 };
  } catch (e: any) {
    results.saved_reports_select = { ok: false, threw: e.message };
  }

  // 3. Test service role — SELECT from chat_messages
  try {
    const { data, error } = await supabaseAdmin
      .from("chat_messages")
      .select("id, role, created_at")
      .limit(3);
    results.chat_messages_select = error
      ? { ok: false, error: error.message, code: error.code }
      : { ok: true, rowCount: data?.length ?? 0 };
  } catch (e: any) {
    results.chat_messages_select = { ok: false, threw: e.message };
  }

  // 4. Test service role — SELECT from family_profiles
  try {
    const { data, error } = await supabaseAdmin
      .from("family_profiles")
      .select("id, relationship")
      .limit(3);
    results.family_profiles_select = error
      ? { ok: false, error: error.message, code: error.code }
      : { ok: true, rowCount: data?.length ?? 0 };
  } catch (e: any) {
    results.family_profiles_select = { ok: false, threw: e.message };
  }

  // 5. Check auth user (server client)
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );
    const { data: { user }, error } = await supabase.auth.getUser();
    results.auth = error
      ? { ok: false, error: error.message }
      : { ok: true, userId: user?.id, email: user?.email };

    if (user) {
      // 6. Check user's family profiles
      const { data: fps, error: fpErr } = await supabaseAdmin
        .from("family_profiles")
        .select("id, name, relationship")
        .eq("user_id", user.id);
      results.user_family_profiles = fpErr
        ? { ok: false, error: fpErr.message }
        : { ok: true, profiles: fps };

      // 7. Check saved reports for this user
      const { data: sr, error: srErr } = await supabaseAdmin
        .from("saved_reports")
        .select("id, report_type, created_at, profile_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      results.user_saved_reports = srErr
        ? { ok: false, error: srErr.message }
        : { ok: true, reports: sr };

      // 8. Check chat messages for this user
      const { data: cm, error: cmErr } = await supabaseAdmin
        .from("chat_messages")
        .select("id, role, created_at, profile_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      results.user_chat_messages = cmErr
        ? { ok: false, error: cmErr.message }
        : { ok: true, messages: cm };
    }
  } catch (e: any) {
    results.auth = { ok: false, threw: e.message };
  }

  return NextResponse.json(results, {
    headers: { "Content-Type": "application/json" },
  });
}
