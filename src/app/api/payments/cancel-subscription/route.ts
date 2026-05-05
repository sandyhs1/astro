import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";

// Service-role client for updating user records securely
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch user's subscription ID
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("user_profiles")
      .select("subscription_id, plan_type")
      .eq("id", user.id)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (!profile.subscription_id || profile.plan_type !== "plan2") {
      return NextResponse.json({ error: "No active monthly subscription found" }, { status: 400 });
    }

    // 2. Call Razorpay API to cancel at end of billing cycle
    try {
      await razorpay.subscriptions.cancel(profile.subscription_id, true);
    } catch (razorpayErr: any) {
      console.error("[cancel-subscription] Razorpay API error:", razorpayErr);
      return NextResponse.json(
        { error: "Failed to cancel subscription with payment provider." },
        { status: 500 }
      );
    }

    // 3. Mark locally as pending_cancellation so UI updates immediately
    const { error: updateErr } = await supabaseAdmin
      .from("user_profiles")
      .update({ payment_status: "pending_cancellation" })
      .eq("id", user.id);

    if (updateErr) {
      console.error("[cancel-subscription] DB update error:", updateErr);
      // Even if DB update fails, the Razorpay cancel succeeded, so we still return 200
      // The webhook will eventually clean it up anyway.
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("[cancel-subscription] Unhandled error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
