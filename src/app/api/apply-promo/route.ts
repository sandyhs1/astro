import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Service-role client — bypasses RLS, used only server-side
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/apply-promo
 * Body: { promoCode: string }
 *
 * Validates the promo code, marks it as used, and grants the user
 * full dashboard access (payment_status = "success", plan_type = "promo",
 * credits = credits_granted from the promo_codes table).
 *
 * Called immediately after the user successfully signs up via the AuthModal.
 */
export async function POST(req: Request) {
  try {
    const { promoCode } = await req.json();
    if (!promoCode?.trim()) {
      return NextResponse.json({ error: "No promo code provided." }, { status: 400 });
    }

    const normalised = promoCode.trim().toUpperCase();

    // ── Auth: verify the caller is a signed-in user ─────────────────────────
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized — please sign in first." }, { status: 401 });
    }

    // ── Fetch the promo code row ──────────────────────────────────────────────
    const { data: promo, error: fetchError } = await supabaseAdmin
      .from("promo_codes")
      .select("*")
      .eq("code", normalised)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!promo) {
      return NextResponse.json({ error: "Invalid promo code. Please check and try again." }, { status: 404 });
    }

    if (promo.used_by !== null) {
      return NextResponse.json({ error: "This promo code has already been used." }, { status: 409 });
    }

    // ── Mark code as used ────────────────────────────────────────────────────
    const { error: markError } = await supabaseAdmin
      .from("promo_codes")
      .update({ used_by: user.id, used_at: new Date().toISOString() })
      .eq("id", promo.id)
      .is("used_by", null); // Double-check still unused (race condition guard)

    if (markError) throw markError;

    // ── Grant dashboard access to the user ───────────────────────────────────
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .update({
        payment_status: "success",
        plan_type: "promo",
        credits: promo.credits_granted,
      })
      .eq("id", user.id);

    if (profileError) throw profileError;

    return NextResponse.json({
      success: true,
      creditsGranted: promo.credits_granted,
      message: `🎉 Promo code applied! You received ${promo.credits_granted} free credits.`,
    });

  } catch (err: any) {
    console.error("apply-promo error:", err);
    return NextResponse.json({ error: err.message || "Internal server error." }, { status: 500 });
  }
}
