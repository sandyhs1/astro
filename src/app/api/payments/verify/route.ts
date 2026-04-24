import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_subscription_id,
      razorpay_signature,
      plan,
    } = body;

    // ── Verify HMAC signature (prevents fake payment confirmations) ──────────
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    let isValid = false;

    if (plan === "plan1") {
      // One-time order signature: order_id + "|" + payment_id
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expected = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");
      isValid = expected === razorpay_signature;
    } else {
      // Subscription signature: subscription_id + "|" + payment_id
      const payload = `${razorpay_payment_id}|${razorpay_subscription_id}`;
      const expected = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");
      isValid = expected === razorpay_signature;
    }

    if (!isValid) {
      console.error("[verify] Signature mismatch — possible tampered payment");
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // ── Signature valid — unlock user in Supabase ────────────────────────────
    if (plan === "plan1") {
      // Plan 1: mark success but NO dashboard access, NO credits
      await supabase.from("user_profiles").update({
        plan_type: "plan1",
        payment_status: "success",
        razorpay_order_id,
        paid_at: new Date().toISOString(),
      }).eq("id", user.id);

    } else {
      // Plan 2: unlock dashboard + credit 50 credits
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("credits")
        .eq("id", user.id)
        .single();

      const currentCredits = profile?.credits ?? 0;

      await supabase.from("user_profiles").update({
        plan_type: "plan2",
        payment_status: "success",
        subscription_id: razorpay_subscription_id,
        credits: currentCredits + 50,
        paid_at: new Date().toISOString(),
      }).eq("id", user.id);
    }

    return NextResponse.json({ success: true, plan });

  } catch (error: any) {
    console.error("[verify] Error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
