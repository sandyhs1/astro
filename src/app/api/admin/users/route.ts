/**
 * GET /api/admin/users
 *
 * Returns:
 *  - Summary KPIs: total users, plan1, plan2, paid, promo users
 *  - Last 20 sign-ups with full details
 *
 * Protected by Admin Bearer token (same as other admin routes).
 */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyAdmin(req: Request): boolean {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  const expectedToken = Buffer.from(
    process.env.ADMIN_PASSWORD || ""
  ).toString("base64");
  return (
    token === expectedToken ||
    token === process.env.ADMIN_SECRET_TOKEN ||
    token === process.env.ADMIN_PASSWORD
  );
}

export async function GET(req: Request) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ── 1. Fetch all user profiles ─────────────────────────────────────────────
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("user_profiles")
      .select(
        "id, full_name, email, created_at, plan_type, payment_status, credits, paid_at"
      )
      .order("created_at", { ascending: false });

    if (profilesError) throw profilesError;

    const allUsers = profiles || [];

    // ── 2. Fetch promo code usage to identify "promo" users ───────────────────
    const { data: promoCodes } = await supabaseAdmin
      .from("promo_codes")
      .select("used_by, credits_granted, used_at")
      .not("used_by", "is", null);

    const promoUserIds = new Set(
      (promoCodes || []).map((p: any) => p.used_by as string)
    );
    const promoCreditsMap: Record<string, number> = {};
    for (const p of promoCodes || []) {
      promoCreditsMap[p.used_by] = (promoCreditsMap[p.used_by] || 0) + p.credits_granted;
    }

    // ── 3. Fetch plan1_intakes to flag form submission ────────────────────────
    const { data: intakes } = await supabaseAdmin
      .from("plan1_intakes")
      .select("user_id, submitted_at");

    const intakeUserIds = new Set(
      (intakes || []).map((i: any) => i.user_id as string)
    );

    // ── 4. Build summary KPIs ──────────────────────────────────────────────────
    const totalUsers  = allUsers.length;
    const plan1Users  = allUsers.filter((u) => u.plan_type === "plan1").length;
    const plan2Users  = allUsers.filter((u) => u.plan_type === "plan2").length;
    const paidUsers   = allUsers.filter((u) => u.payment_status === "success").length;
    const promoUsers  = allUsers.filter(
      (u) => promoUserIds.has(u.id) && u.payment_status !== "success"
    ).length;
    // Paid + promo (anyone with dashboard access)
    const activeUsers = allUsers.filter(
      (u) => u.payment_status === "success" || promoUserIds.has(u.id)
    ).length;

    // ── 5. Build last 20 signup rows ───────────────────────────────────────────
    const recent = allUsers.slice(0, 20).map((u) => {
      const isPromo   = promoUserIds.has(u.id);
      const isPaid    = u.payment_status === "success";
      const intakeSubmitted = intakeUserIds.has(u.id);

      // Determine display plan label
      let planLabel = "Unpaid";
      if (u.plan_type === "plan1" && isPaid) planLabel = "Plan 1";
      else if (u.plan_type === "plan2" && isPaid) planLabel = "Plan 2";
      else if (isPromo) planLabel = "Promo";

      // Determine payment/access label
      let paymentLabel = "Pending";
      if (isPaid) paymentLabel = "Paid";
      else if (isPromo) paymentLabel = `Free Credits (${promoCreditsMap[u.id] ?? 0})`;

      return {
        id:               u.id,
        name:             u.full_name || "—",
        email:            u.email || "—",
        signedUpAt:       u.created_at,
        plan:             planLabel,
        paymentStatus:    paymentLabel,
        credits:          u.credits ?? 0,
        paidAt:           u.paid_at || null,
        intakeSubmitted:  intakeSubmitted,
        isPromo:          isPromo,
        isPaid:           isPaid,
      };
    });

    return NextResponse.json({
      summary: {
        totalUsers,
        plan1Users,
        plan2Users,
        paidUsers,
        promoUsers,
        activeUsers,
      },
      recentUsers: recent,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[admin/users] Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
