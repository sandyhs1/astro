/**
 * /api/day-score — Save and retrieve daily auspiciousness scores
 * GET  ?profileId=xxx           → last 30 days of scores
 * POST { profileId, score, nakshatra, choghadiya } → upsert today
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => cookieStore.get(n)?.value } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);

    let q = admin.from("day_scores")
      .select("score_date, score, nakshatra, choghadiya")
      .eq("user_id", user.id)
      .gte("score_date", cutoff.toISOString().slice(0, 10))
      .order("score_date", { ascending: true });

    if (profileId && profileId !== "all") q = q.eq("profile_id", profileId);

    const { data, error } = await q;
    if (error) throw error;

    return NextResponse.json({ scores: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { profileId, score, nakshatra, choghadiya } = await req.json();
    const today = new Date().toISOString().slice(0, 10);

    const { error } = await admin.from("day_scores").upsert({
      user_id:    user.id,
      profile_id: profileId || null,
      score_date: today,
      score:      Math.max(0, Math.min(100, Math.round(score))),
      nakshatra:  nakshatra || null,
      choghadiya: choghadiya || null,
    }, { onConflict: "user_id,profile_id,score_date" });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
