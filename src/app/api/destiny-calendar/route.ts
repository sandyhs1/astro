import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { computeCalendar } from "@/lib/astrology/transit-engine";
import { routeLLM } from "@/lib/astrology/llm-router";
import { astroClient } from "@/lib/astrology/client";
import { geocodePlace, parseBirthParams, tzStringToFloat } from "@/lib/astrology/client";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");
    
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let targetProfileId = profileId;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabase.from("family_profiles").select("id").eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) targetProfileId = fp.id;
    }

    if (!targetProfileId) return NextResponse.json({ found: false });

    const { data: saved } = await supabase
      .from("saved_reports")
      .select("content")
      .eq("user_id", user.id)
      .eq("profile_id", targetProfileId)
      .eq("report_type", "destiny_window")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (saved) {
      return NextResponse.json({ found: true, reportData: saved.content });
    }
    return NextResponse.json({ found: false });

  } catch (err: any) {
    console.error("Destiny Calendar GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { profileId } = await req.json();

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ── Credits check ──────────────────────────────────────────────────────────
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single();
    const credits = profile?.credits ?? 0;
    if (credits < 3) {
      return NextResponse.json({ error: "Insufficient credits. Destiny Calendar costs 3 credits." }, { status: 402 });
    }

    // ── Resolve birth details ──────────────────────────────────────────────────
    let dob = "", tob = "", pob = "", tz = "+05:30", pName = "Seeker";
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabase.from("family_profiles").select("*").eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) {
        dob = fp.dob; tob = fp.tob; pob = fp.pob; tz = fp.timezone || "+05:30"; pName = fp.name;
      } else {
        const { data: lead } = await supabase.from("onboarding_leads").select("*").eq("email", user.email).maybeSingle();
        dob = lead?.dob; tob = lead?.tob; pob = lead?.pob;
        tz  = lead?.timezone || "+05:30"; pName = lead?.name || "Seeker";
      }
    } else {
      const { data: fp } = await supabase.from("family_profiles").select("*").eq("id", profileId).maybeSingle();
      dob = fp?.dob; tob = fp?.tob; pob = fp?.pob;
      tz  = fp?.timezone || "+05:30"; pName = fp?.name || "Seeker";
    }
    if (!dob || !tob || !pob) return NextResponse.json({ error: "Birth details not found" }, { status: 422 });

    // ── Get natal chart ────────────────────────────────────────────────────────
    const { chart } = await getOrBuildChart(dob, tob, pob, tz, undefined, undefined, user.email);
    const moonSign    = chart.d1.moonSign;
    const moonSignNum = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
                         "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
                        .findIndex(s => s === moonSign) + 1;

    // ── Get TODAY's transiting planets (current sky) ───────────────────────────
    const now = new Date();
    const todayParams = {
      day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear(),
      hour: 12, min: 0,
      lat: 12.9716, lon: 77.5946, tzone: 5.5, // Default Bangalore noon sky
    };
    let transitPlanets: Array<{ name: string; fullDegree: number }> = [];
    try {
      const raw = await astroClient.vedic.getPlanets(todayParams);
      transitPlanets = (Array.isArray(raw) ? raw : []).map((p: any) => ({
        name:       p.name,
        fullDegree: parseFloat(p.fullDegree || p.full_degree || 0),
      })).filter((p: any) => p.name && !isNaN(p.fullDegree));
    } catch {
      // Fallback: use natal planets as approximation
      transitPlanets = chart.d1.planets.map(p => ({ name: p.name, fullDegree: p.fullDegree }));
    }

    // ── Compute 30-day calendar ────────────────────────────────────────────────
    const days = computeCalendar(
      chart.d1.planets,
      transitPlanets,
      moonSignNum,
      chart.dasha.antardasha,
    );

    // ── LLM: narrative for top 5 peak days only ───────────────────────────────
    const topDays = [...days]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const topDaysSummary = topDays.map(d =>
      `${d.dateStr}: Score ${d.score}/10 — ${d.factors.join("; ")}`
    ).join("\n");

    const systemPrompt = `You are KARMA — the Grand Master Jyotishi of Quantum Karma.
You are generating a Destiny Window Calendar narrative for ${pName}.
The calendar is based on their natal chart (Moon in ${moonSign}, ${chart.dasha.antardasha} Antardasha active until ${chart.dasha.antardashaEnd}).
Current Mahadasha: ${chart.dasha.mahadasha} until ${chart.dasha.mahadashaEnd}.

ABSOLUTE RULES:
- No gemstones. Vedic astrology only. Concise. Powerful.
- Begin with: "Namaste ${pName} 🙏" on its own line.
- Then a 2-line sweet, encouraging intro about this month's cosmic energy for them personally.
- Then analyze the 5 peak days provided.
- For each peak day: 1 bullet with the date, score, dominant planet, and what to DO that day (action, intention, ritual).
- End with one 48-day mantra recommendation tailored to their Antardasha lord.
- Total response: maximum 300 words.`;

    const llmResult = await routeLLM(
      systemPrompt,
      [{ role: "user", content: `Top peak days this month for ${pName}:\n${topDaysSummary}\n\nGenerate the Destiny Window narrative.` }],
      600
    );

    // ── Deduct 3 credits ───────────────────────────────────────────────────────
    await supabaseAdmin.from("user_profiles")
      .update({ credits: Math.max(0, credits - 3) })
      .eq("id", user.id);

    // ── Log usage ──────────────────────────────────────────────────────────────
    supabaseAdmin.from("token_usage_logs").insert({
      user_id: user.id, model_name: llmResult.model,
      input_tokens: llmResult.tokensIn, output_tokens: llmResult.tokensOut,
      total_tokens: llmResult.tokensIn + llmResult.tokensOut,
      cost_inr: ((llmResult.tokensIn / 1000) * 0.252 + (llmResult.tokensOut / 1000) * 1.26).toFixed(6),
      credits_used: 3, question_preview: "Destiny Calendar",
    });

    const reportData = {
      days: days.map(d => ({
        dateStr:       d.dateStr,
        score:         d.score,
        grade:         d.grade,
        color:         d.color,
        factors:       d.factors,
        dominantPlanet: d.dominantPlanet,
      })),
      narrative:       llmResult.text,
      moonSign,
      antardasha:      chart.dasha.antardasha,
      mahadasha:       chart.dasha.mahadasha,
    };

    // ── Save to DB ─────────────────────────────────────────────────────────────
    let targetProfileId = profileId;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("id").eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) targetProfileId = fp.id;
    }
    
    if (targetProfileId) {
      await supabaseAdmin.from("saved_reports").insert({
        user_id: user.id,
        profile_id: targetProfileId,
        report_type: 'destiny_window',
        content: reportData
      });
    }

    return NextResponse.json({
      ...reportData,
      creditsRemaining: Math.max(0, credits - 3),
    });

  } catch (err: any) {
    console.error("Destiny Calendar error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
