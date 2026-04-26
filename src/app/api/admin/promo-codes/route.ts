import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * GET /api/admin/promo-codes
 * Returns all promo codes with their usage status.
 * Protected by Admin Bearer token.
 */

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyAdmin(req: Request): boolean {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  return token === process.env.ADMIN_SECRET_TOKEN || token === process.env.ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all promo codes with user info joined
    const { data: codes, error } = await supabaseAdmin
      .from("promo_codes")
      .select(`
        id,
        code,
        credits_granted,
        used_at,
        used_by,
        created_at
      `)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Enrich used codes with user info
    const usedIds = codes
      ?.filter((c) => c.used_by)
      .map((c) => c.used_by as string) ?? [];

    let userMap: Record<string, { email: string; full_name: string }> = {};
    if (usedIds.length > 0) {
      const { data: users } = await supabaseAdmin
        .from("user_profiles")
        .select("id, email, full_name")
        .in("id", usedIds);

      (users ?? []).forEach((u) => {
        userMap[u.id] = { email: u.email, full_name: u.full_name };
      });
    }

    const enriched = (codes ?? []).map((c) => ({
      ...c,
      used_by_email: c.used_by ? userMap[c.used_by]?.email ?? "Unknown" : null,
      used_by_name: c.used_by ? userMap[c.used_by]?.full_name ?? "Unknown" : null,
    }));

    const totalCodes = enriched.length;
    const usedCodes = enriched.filter((c) => c.used_by).length;
    const availableCodes = totalCodes - usedCodes;

    return NextResponse.json({
      codes: enriched,
      summary: { total: totalCodes, used: usedCodes, available: availableCodes },
    });
  } catch (err: any) {
    console.error("Admin promo-codes error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
