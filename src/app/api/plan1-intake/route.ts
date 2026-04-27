/**
 * POST /api/plan1-intake
 *
 * Called after a Plan 1 user submits the intake form (name, DOB, TOB, POB,
 * questions). This route:
 *   1. Validates the user is authenticated and has a successful Plan 1 payment.
 *   2. Inserts the intake data into public.plan1_intakes.
 *
 * Dreamlit.ai watches the plan1_intakes table and automatically sends a
 * notification email to sandesh@quantumkarma.tech whenever a new row appears.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    // ── 1. Auth check ──────────────────────────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── 2. Parse body ──────────────────────────────────────────────────────────
    const body = await req.json();
    const { fullName, dob, tob, pob, questions } = body;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    // ── 3. Verify user has a successful Plan 1 payment ─────────────────────────
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("plan_type, payment_status, email")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 }
      );
    }

    if (
      profile.plan_type !== "plan1" ||
      profile.payment_status !== "success"
    ) {
      return NextResponse.json(
        { error: "Plan 1 payment required to submit intake form." },
        { status: 403 }
      );
    }

    // ── 4. Upsert intake data via service role (bypasses RLS) ──────────────────
    // Using service role so the insert is always authoritative.
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if intake already submitted (prevent duplicates)
    const { data: existing } = await adminClient
      .from("plan1_intakes")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      // Already submitted — return success silently (idempotent)
      return NextResponse.json({ success: true, alreadySubmitted: true });
    }

    const { error: insertError } = await adminClient
      .from("plan1_intakes")
      .insert({
        user_id: user.id,
        email: profile.email || user.email || "",
        full_name: fullName.trim(),
        dob: dob?.trim() || null,
        tob: tob?.trim() || null,
        pob: pob?.trim() || null,
        questions: questions?.trim() || null,
        submitted_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("[plan1-intake] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save intake data. Please try again." },
        { status: 500 }
      );
    }

    console.log(`[plan1-intake] Intake saved for user ${user.id} (${user.email})`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[plan1-intake] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
