/**
 * POST /api/payments/topup-verify
 * Body: { razorpay_payment_id, razorpay_order_id, razorpay_signature, pack }
 *
 * Verifies HMAC signature then atomically adds credits to user_profiles.
 */
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";
import { TOPUP_PACKS, TopupPack } from "../topup-order/route";

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      pack,
    } = await req.json();

    if (!pack || !(pack in TOPUP_PACKS)) {
      return NextResponse.json({ error: "Invalid pack." }, { status: 400 });
    }

    // ── 1. Verify HMAC signature ───────────────────────────────────────────────
    const secret  = process.env.RAZORPAY_KEY_SECRET!;
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    if (expected !== razorpay_signature) {
      console.error("[topup-verify] Signature mismatch — possible tampered payment");
      return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
    }

    // ── 2. Fetch current credits ───────────────────────────────────────────────
    const { data: profile, error: fetchErr } = await supabaseAdmin
      .from("user_profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (fetchErr || !profile) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    const creditsToAdd  = TOPUP_PACKS[pack as TopupPack].credits;
    const newTotal      = (profile.credits ?? 0) + creditsToAdd;

    // ── 3. Atomically increment credits ───────────────────────────────────────
    const { error: updateErr } = await supabaseAdmin
      .from("user_profiles")
      .update({ credits: newTotal })
      .eq("id", user.id);

    if (updateErr) throw updateErr;

    console.log(
      `[topup-verify] +${creditsToAdd} credits for ${user.email} → total: ${newTotal}`
    );

    return NextResponse.json({
      success:      true,
      creditsAdded: creditsToAdd,
      newTotal,
      pack,
    });

  } catch (err: any) {
    console.error("[topup-verify] Error:", err);
    return NextResponse.json({ error: "Top-up verification failed." }, { status: 500 });
  }
}
