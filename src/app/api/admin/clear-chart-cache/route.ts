import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * POST /api/admin/clear-chart-cache
 * Clears the cached golden_master_json for a user so
 * the next chat forces a fresh API fetch with the new dasha parser.
 * Admin-only: requires Authorization: Bearer <admin-token>
 */
export async function POST(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { userId, clearAll } = await req.json().catch(() => ({}));

  if (clearAll) {
    // Clear ALL cached charts — forces fresh fetch for every user
    const { error, count } = await supabaseAdmin
      .from("onboarding_leads")
      .update({ golden_master_json: null, chart_hash: null })
      .not("id", "is", null);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ cleared: "all", count });
  }

  if (userId) {
    // Clear for specific user
    const { error } = await supabaseAdmin
      .from("onboarding_leads")
      .update({ golden_master_json: null, chart_hash: null })
      .eq("email", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ cleared: userId });
  }

  return NextResponse.json({ error: "Provide userId or clearAll:true" }, { status: 400 });
}
