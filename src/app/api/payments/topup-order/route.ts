/**
 * POST /api/payments/topup-order
 * Body: { pack: "boost" | "power" }
 *
 * Creates a Razorpay one-time order for a credit top-up pack.
 * - boost: ₹795  → 20 credits
 * - power: ₹1499 → 35 credits
 *
 * No Razorpay dashboard setup needed — reuses existing live keys.
 */
import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const TOPUP_PACKS = {
  boost: { credits: 20, amountPaise: 79500,  label: "Quick Boost",  priceDisplay: "₹795"  },
  power: { credits: 35, amountPaise: 149900, label: "Power Pack",   priceDisplay: "₹1,499" },
} as const;

export type TopupPack = keyof typeof TOPUP_PACKS;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { pack } = await req.json();
    if (!pack || !(pack in TOPUP_PACKS)) {
      return NextResponse.json({ error: "Invalid pack. Choose 'boost' or 'power'." }, { status: 400 });
    }

    // Only Plan 2 / promo users can top up (they have dashboard access)
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("plan_type, payment_status")
      .eq("id", user.id)
      .single();

    const eligible =
      profile?.payment_status === "success" &&
      (profile?.plan_type === "plan2" || profile?.plan_type === "promo");

    if (!eligible) {
      return NextResponse.json(
        { error: "Credit top-ups are available for active Plan 2 subscribers." },
        { status: 403 }
      );
    }

    const selectedPack = TOPUP_PACKS[pack as TopupPack];

    const order = await razorpay.orders.create({
      amount:   selectedPack.amountPaise,
      currency: "INR",
      receipt:  `topup_${pack}_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId:  user.id,
        email:   user.email ?? "",
        type:    "topup",
        pack,
        credits: String(selectedPack.credits),
      },
    });

    return NextResponse.json({
      orderId:      order.id,
      amount:       order.amount,
      currency:     order.currency,
      keyId:        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      pack,
      credits:      selectedPack.credits,
      label:        selectedPack.label,
      priceDisplay: selectedPack.priceDisplay,
      prefill:      { email: user.email ?? "" },
    });

  } catch (err: any) {
    console.error("[topup-order] Error:", err);
    return NextResponse.json({ error: "Failed to create top-up order." }, { status: 500 });
  }
}
