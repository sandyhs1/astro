import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Razorpay sends raw body — must read as buffer for signature verification
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";

    // ── Verify webhook signature ─────────────────────────────────────────────
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expected !== signature) {
      console.error("[webhook] Invalid signature — rejected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.event;
    const supabase = await createClient();

    console.log("[webhook] Event received:", eventType);

    // ── payment.captured ─────────────────────────────────────────────────────
    // Fires when a one-time Plan 1 payment is captured by Razorpay
    if (eventType === "payment.captured") {
      const payment = event.payload?.payment?.entity;
      const notes = payment?.notes ?? {};
      const userId: string = notes.userId;
      const plan: string = notes.plan;

      if (!userId) {
        console.warn("[webhook] payment.captured — no userId in notes");
        return NextResponse.json({ received: true });
      }

      if (plan === "plan1") {
        await supabase.from("user_profiles").update({
          plan_type: "plan1",
          payment_status: "success",
          razorpay_order_id: payment.order_id,
          paid_at: new Date().toISOString(),
        }).eq("id", userId);
        console.log(`[webhook] Plan 1 activated for user ${userId}`);
      }
    }

    // ── subscription.activated ───────────────────────────────────────────────
    // Fires when a Plan 2 subscription is first activated
    if (eventType === "subscription.activated") {
      const subscription = event.payload?.subscription?.entity;
      const notes = subscription?.notes ?? {};
      const userId: string = notes.userId;
      const subscriptionId: string = subscription?.id;

      if (!userId) {
        console.warn("[webhook] subscription.activated — no userId in notes");
        return NextResponse.json({ received: true });
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      const currentCredits = profile?.credits ?? 0;

      await supabase.from("user_profiles").update({
        plan_type: "plan2",
        payment_status: "success",
        subscription_id: subscriptionId,
        credits: currentCredits + 50,
        paid_at: new Date().toISOString(),
      }).eq("id", userId);

      console.log(`[webhook] Plan 2 activated for user ${userId} — 50 credits added`);
    }

    // ── subscription.charged ─────────────────────────────────────────────────
    // Fires EVERY MONTH when Razorpay auto-charges Plan 2 users
    // This is what tops up credits automatically on renewal
    if (eventType === "subscription.charged") {
      const subscription = event.payload?.subscription?.entity;
      const subscriptionId: string = subscription?.id;

      if (!subscriptionId) {
        console.warn("[webhook] subscription.charged — no subscriptionId");
        return NextResponse.json({ received: true });
      }

      // Look up user by subscription_id
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id, credits")
        .eq("subscription_id", subscriptionId)
        .single();

      if (!profile) {
        console.warn(`[webhook] No user found for subscription ${subscriptionId}`);
        return NextResponse.json({ received: true });
      }

      // ── Hard reset to exactly 50 credits every billing cycle ────────────────
      await supabase.from("user_profiles").update({
        credits: 50,
        payment_status: "success",    // Keep active
      }).eq("id", profile.id);

      console.log(`[webhook] Monthly renewal — user ${profile.id} credits hard-reset to 50`);
    }

    // ── subscription.cancelled & subscription.halted ─────────────────────────
    // Fires when a subscription ends (e.g., at the end of the billing cycle
    // if the user requested cancellation earlier, or if it halted due to failed payments).
    if (eventType === "subscription.cancelled" || eventType === "subscription.halted") {
      const subscription = event.payload?.subscription?.entity;
      const subscriptionId: string = subscription?.id;

      if (!subscriptionId) {
        console.warn(`[webhook] ${eventType} — no subscriptionId`);
        return NextResponse.json({ received: true });
      }

      // Look up user by subscription_id
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("subscription_id", subscriptionId)
        .single();

      if (!profile) {
        console.warn(`[webhook] No user found for cancelled subscription ${subscriptionId}`);
        return NextResponse.json({ received: true });
      }

      // Downgrade user cleanly
      await supabase.from("user_profiles").update({
        plan_type: null,
        payment_status: null,
        subscription_id: null,
      }).eq("id", profile.id);

      console.log(`[webhook] Subscription ended for user ${profile.id} — downgraded successfully`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("[webhook] Unhandled error:", error);
    // Always return 200 to Razorpay even on error — otherwise they retry indefinitely
    return NextResponse.json({ received: true });
  }
}
