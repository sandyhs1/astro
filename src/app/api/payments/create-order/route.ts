import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── Razorpay instance (server-side only, never exposed to client) ───────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();

    if (!plan || !["plan1", "plan2"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (plan === "plan1") {
      // ── ONE-TIME ORDER (₹4,799) ───────────────────────────────────────────
      const order = await razorpay.orders.create({
        amount: 479900,           // Amount in paise (₹4,799 × 100)
        currency: "INR",
        receipt: `plan1_${user.id.slice(0, 8)}_${Date.now()}`,
        notes: {
          userId: user.id,
          plan: "plan1",
          email: user.email ?? "",
        },
      });

      // Mark payment as pending in DB
      await supabase.from("user_profiles").update({
        plan_type: "plan1",
        payment_status: "pending",
        razorpay_order_id: order.id,
      }).eq("id", user.id);

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        plan: "plan1",
        prefill: { email: user.email ?? "" },
      });

    } else {
      // ── RECURRING SUBSCRIPTION (₹1,799/month) ────────────────────────────
      const subscription = await (razorpay.subscriptions as any).create({
        plan_id: process.env.RAZORPAY_PLAN_ID_CREDITS!,
        total_count: 120,         // Max 10 years of monthly billing
        quantity: 1,
        customer_notify: 1,       // Razorpay sends payment reminders
        notes: {
          userId: user.id,
          plan: "plan2",
          email: user.email ?? "",
        },
      });

      // Mark payment as pending in DB
      await supabase.from("user_profiles").update({
        plan_type: "plan2",
        payment_status: "pending",
        subscription_id: subscription.id,
      }).eq("id", user.id);

      return NextResponse.json({
        subscriptionId: subscription.id,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        plan: "plan2",
        prefill: { email: user.email ?? "" },
      });
    }
  } catch (error: any) {
    console.error("[create-order] Error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
