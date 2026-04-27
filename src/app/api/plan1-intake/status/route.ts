/**
 * GET /api/plan1-intake/status
 *
 * Returns whether the authenticated Plan 1 user has already submitted
 * their intake form. Used by PaymentGate to determine which screen to show
 * when a returning Plan 1 user visits the dashboard.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: intake } = await adminClient
      .from("plan1_intakes")
      .select("id, submitted_at")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json({ submitted: !!intake, submittedAt: intake?.submitted_at || null });
  } catch (err: any) {
    console.error("[plan1-intake/status] Error:", err);
    return NextResponse.json({ submitted: false });
  }
}
