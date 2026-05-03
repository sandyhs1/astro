import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { routeLLM } from "@/lib/astrology/llm-router";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LLM_PRICE: Record<string, { in: number; out: number }> = {
  "bedrock/us.anthropic.claude-sonnet-4-6": { in: 0.252, out: 1.26 },
  "gemini/gemini-3.1-pro-preview":          { in: 0.105, out: 0.42 },
  "gemini/gemini-3.1-flash-lite-preview":   { in: 0.0063, out: 0.0063 },
};
function calcCostInr(model: string, tokIn: number, tokOut: number): number {
  const p = LLM_PRICE[model] ?? { in: 0.252, out: 1.26 };
  return (tokIn / 1000) * p.in + (tokOut / 1000) * p.out;
}

// Structured card-format prompt — guaranteed to complete within token limits
const ROYAL_ROAST_SYSTEM_PROMPT = (pName: string) => `You are writing the ROYAL ROAST for ${pName} — a brutally honest, chart-backed personality breakdown.

## OUTPUT FORMAT — FOLLOW EXACTLY. NO DEVIATIONS.

First, write a 3-4 sentence intro. Address ${pName} directly. Reference their Lagna, Moon Nakshatra, and Atmakaraka by name. Be warm but sharp — like a friend who knows too much about them.

Then output exactly 11 sections using this EXACT block format for each:

---SECTION---
CATEGORY: [one of: SELF | LOVE | CAREER | PERSONALITY | MONEY | HEALTH | SOCIAL | FEARS | FAMILY | COMMUNICATION | VERDICT]
HEADLINE: [A punchy, witty 5-8 word title. Magazine-style headline. Specific to their chart. A little savage.]
ROAST: [2-3 sentences. Sharp, direct, funny, honest. Cite at least one specific placement.]
PROOF: [One line starting with "Chart:" — the exact placement evidence. Planet, sign, house, nakshatra.]
IMPACT: [One line starting with "In real life:" — what this pattern actually costs them or creates.]
TIP: [One line starting with "Try this:" — one specific, actionable thing to work with this energy.]
---END---

Cover categories in this order: SELF, LOVE, CAREER, PERSONALITY, MONEY, HEALTH, SOCIAL, FEARS, FAMILY, COMMUNICATION, VERDICT.
For VERDICT: make ROAST 3-4 sentences tying everything together. Change TIP to "The shift:" — one reframe that changes everything.

## TONE:
- Direct. Human. Occasionally sarcastic. Never mean or doom-saying.
- GenZ/Millennial language. Speak like a smart friend, not a textbook.
- Cite specific placements in every section.
- BANNED: cosmic, orchestrate, dance, shimmer, tapestry, illuminate, interplay, paradigm, linchpin, celestial, mystical, energies, vibrations, auspicious, inauspicious.
- Every challenge must end as a reframeable strength.

## CRITICAL RULE: Complete ALL 11 sections. The short structured format means there is absolutely no reason to stop early. Do not truncate.`;

// ─── GET: Check for saved report ────────────────────────────────────────────
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
      .eq("report_type", "royal_roast")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (saved) return NextResponse.json({ found: true, reportData: saved.content });
    return NextResponse.json({ found: false });

  } catch (err: any) {
    console.error("Royal Roast GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST: Generate new report ───────────────────────────────────────────────
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

    // ── Credits check ────────────────────────────────────────────────────────
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single();
    const credits = profile?.credits ?? 0;
    if (credits < 15) {
      return NextResponse.json({ error: "Insufficient credits. Royal Roast costs 15 credits." }, { status: 402 });
    }

    // ── Resolve birth details ─────────────────────────────────────────────────
    let dob = "", tob = "", pob = "", tz = "+05:30", pName = "Seeker";

    const { data: astroClientData } = await supabaseAdmin
      .from("astrologer_clients")
      .select("*")
      .eq("id", profileId)
      .maybeSingle();

    if (astroClientData) {
      dob = astroClientData.dob;
      tob = astroClientData.tob;
      pob = astroClientData.pob;
      tz = astroClientData.timezone || "+05:30";
      pName = astroClientData.name || "Client";
    } else if (!profileId || profileId === "self") {
      const { data: fp } = await supabase.from("family_profiles").select("*").eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) { dob = fp.dob; tob = fp.tob; pob = fp.pob; tz = fp.timezone || "+05:30"; pName = fp.name; }
      else {
        const { data: lead } = await supabase.from("onboarding_leads").select("*").eq("email", user.email).maybeSingle();
        dob = lead?.dob; tob = lead?.tob; pob = lead?.pob;
        tz = lead?.timezone || "+05:30"; pName = lead?.name || "Seeker";
      }
    } else {
      const { data: fp } = await supabase.from("family_profiles").select("*").eq("id", profileId).maybeSingle();
      dob = fp?.dob; tob = fp?.tob; pob = fp?.pob;
      tz = fp?.timezone || "+05:30"; pName = fp?.name || "Seeker";
    }

    if (!dob || !tob || !pob) return NextResponse.json({ error: "Birth details not found" }, { status: 422 });

    // ── Build cached chart ─────────────────────────────────────────────────────
    const { chart } = await getOrBuildChart(dob, tob, pob, tz, undefined, undefined, user.email);

    const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    const SIGN_LORD: Record<string, string> = {
      Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",
      Leo:"Sun",Virgo:"Mercury",Libra:"Venus",Scorpio:"Mars",
      Sagittarius:"Jupiter",Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter",
    };

    function computeArudha(houseSign: string, lordSign: string, lagnaSign: string): string {
      const signIdx = (s: string) => SIGNS.findIndex(sg => sg.toLowerCase() === s?.toLowerCase());
      const hIdx = signIdx(houseSign), lordIdx = signIdx(lordSign), lagnaIdx = signIdx(lagnaSign);
      if (hIdx === -1 || lordIdx === -1) return "Unknown";
      const dist = (lordIdx - hIdx + 12) % 12;
      let aIdx = (lordIdx + dist) % 12;
      if (aIdx === lagnaIdx || aIdx === (lagnaIdx + 6) % 12) aIdx = (aIdx + 9) % 12;
      return SIGNS[aIdx] ?? "Unknown";
    }

    const fp_name = (name: string) => chart.d1.planets.find(p => p.name.toLowerCase() === name.toLowerCase());
    const h = (n: number) => chart.d1.houses.find(x => x.number === n);

    const lagnaH = h(1); const h7 = h(7); const h12 = h(12);
    let AL = "", UL = "", A7 = "";
    if (lagnaH) { const lp = fp_name(SIGN_LORD[lagnaH.sign] ?? ""); if (lp) AL = computeArudha(lagnaH.sign, lp.sign, chart.d1.ascendant); }
    if (h7)     { const lp = fp_name(SIGN_LORD[h7.sign] ?? "");    if (lp) A7 = computeArudha(h7.sign, lp.sign, chart.d1.ascendant); }
    if (h12)    { const lp = fp_name(SIGN_LORD[h12.sign] ?? "");   if (lp) UL = computeArudha(h12.sign, lp.sign, chart.d1.ascendant); }
    const sunP = fp_name("Sun");
    const PP = sunP ? SIGNS[Math.floor(((sunP.fullDegree * 3) % 360) / 30)] ?? "" : "";

    const asvScores = (chart as any).ashtakavarga?.sarvashtakavarga ?? {};

    const chartContext = `
PERSON: ${pName}
DOB: ${dob} | TOB: ${tob} | POB: ${pob}

LAGNA: ${chart.d1.ascendant}
MOON SIGN: ${chart.d1.moonSign} | MOON NAKSHATRA: ${chart.d1.moonNakshatra} Pada${fp_name("Moon")?.nakshatraPada ?? "?"}
SUN SIGN: ${chart.d1.sunSign}

KARAKAS:
AK (Soul): ${chart.karakas.ak} | AMK (Career): ${chart.karakas.amk} | DK (Partner): ${chart.karakas.dk} | GK (Conflict): ${chart.karakas.gk}

SPECIAL POINTS:
AL (Public Image): ${AL || "N/A"} | A7 (Relationship): ${A7 || "N/A"} | UL (Marriage Karma): ${UL || "N/A"} | PP (Life Force): ${PP || "N/A"}

DASHA:
Mahadasha: ${chart.dasha.mahadasha} (until ${chart.dasha.mahadashaEnd})
Antardasha: ${chart.dasha.antardasha} (until ${chart.dasha.antardashaEnd})

D1 PLANETS:
${chart.d1.planets.map(p => `${p.name}: ${p.sign} H${p.house} ${p.normDegree.toFixed(1)}° ${p.nakshatra} P${p.nakshatraPada}${p.isRetro ? " [R]" : ""}${p.isCombust ? " [Combust]" : ""}`).join("\n")}

HOUSES:
${chart.d1.houses.map(h => `H${h.number}(${h.sign}): ${h.occupants.join(",") || "Empty"}`).join(" | ")}

ASHTAKAVARGA: H2=${asvScores["2"] ?? "N/A"}/56 | H7=${asvScores["7"] ?? "N/A"}/56 | H10=${asvScores["10"] ?? "N/A"}/56 | H11=${asvScores["11"] ?? "N/A"}/56

D9 LAGNA: ${chart.divisional?.d9?.ascendant ?? "N/A"}
D10 LAGNA: ${chart.divisional?.d10?.ascendant ?? "N/A"}
D10: ${chart.divisional?.d10?.planets?.map((p: any) => `${p.name}:H${p.house}(${p.sign})`).join(" ") ?? "N/A"}
`;

    // ── Call LLM — increased to 5500 to guarantee completion ──────────────────
    const llmResult = await routeLLM(
      ROYAL_ROAST_SYSTEM_PROMPT(pName),
      [{ role: "user", content: `Generate the complete Royal Roast for ${pName}. Use the chart data. Be sharp and specific.\n\n${chartContext}` }],
      5500
    );

    // ── Deduct 15 credits ─────────────────────────────────────────────────────
    await supabaseAdmin.from("user_profiles")
      .update({ credits: Math.max(0, credits - 15) })
      .eq("id", user.id);

    // ── Log usage ──────────────────────────────────────────────────────────────
    supabaseAdmin.from("token_usage_logs").insert({
      user_id: user.id, model_name: llmResult.model,
      input_tokens: llmResult.tokensIn, output_tokens: llmResult.tokensOut,
      total_tokens: llmResult.tokensIn + llmResult.tokensOut,
      cost_inr: calcCostInr(llmResult.model, llmResult.tokensIn, llmResult.tokensOut).toFixed(6),
      credits_used: 15, question_preview: "Royal Roast",
    });

    const reportData = {
      report:      llmResult.text,
      personName:  pName,
      model:       llmResult.model,
      lagna:       chart.d1.ascendant,
      moonNak:     chart.d1.moonNakshatra,
      ak:          chart.karakas.ak,
      dasha:       `${chart.dasha.mahadasha}/${chart.dasha.antardasha}`,
      generatedAt: new Date().toISOString(),
    };

    // ── Save report ────────────────────────────────────────────────────────────
    let targetProfileId: string | null = null;
    if (astroClientData) {
      targetProfileId = profileId;
    } else if (!profileId || profileId === "self") {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("id").eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      targetProfileId = fp?.id ?? null;
    } else {
      targetProfileId = profileId;
    }

    if (targetProfileId) {
      const { error: saveErr } = await supabaseAdmin.from("saved_reports").insert({
        user_id:     user.id,
        profile_id:  targetProfileId,
        report_type: "royal_roast",
        content:     reportData,
      });
      if (saveErr) console.error("[ROYAL ROAST] Save error:", saveErr.message);
    }

    return NextResponse.json({ ...reportData, creditsRemaining: Math.max(0, credits - 15) });

  } catch (err: any) {
    console.error("Royal Roast POST error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
