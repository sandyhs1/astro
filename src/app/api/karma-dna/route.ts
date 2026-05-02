import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { routeLLM } from "@/lib/astrology/llm-router";
import { astroClient } from "@/lib/astrology/client";
import { parseBirthParams, geocodePlace, tzStringToFloat } from "@/lib/astrology/client";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Model-aware INR cost calculation — matches astro-chat/route.ts pricing
const LLM_PRICE: Record<string, { in: number; out: number }> = {
  "bedrock/us.anthropic.claude-sonnet-4-6": { in: 0.252,  out: 1.26   },
  "gemini/gemini-3.1-pro-preview":          { in: 0.105,  out: 0.42   },
  "gemini/gemini-3.1-flash-lite-preview":   { in: 0.0063, out: 0.0063 },
};
function calcCostInr(model: string, tokIn: number, tokOut: number): number {
  const p = LLM_PRICE[model] ?? { in: 0.252, out: 1.26 }; // default to Claude if unknown
  return (tokIn / 1000) * p.in + (tokOut / 1000) * p.out;
}

const KARMA_DNA_SYSTEM_PROMPT = (pName: string) => `You are KARMA — the Grand Master Jyotishi of Quantum Karma.
You are generating a deeply personal, sacred KARMA DNA REPORT for ${pName}.

THIS IS YOUR MOST IMPORTANT WORK. Every sentence must be precise, destined, and transformative.

## WHO THIS REPORT IS FOR
${pName} is asking about their soul's past-life karma, unresolved contracts, and this life's mission.

## REPORT STRUCTURE (follow exactly):

---
**Namaste ${pName} 🙏**

*[2-sentence warm, sweet, encouraging intro — acknowledge the courage it takes to look at one's karma honestly. Reference their specific chart energy.]*

---

## 🔮 Soul Blueprint — Atmakaraka Reading
[AK planet] is their soul. Analyze what unfinished karma this AK carries from past lives. Be specific to the chart data.

## ⚡ Past-Life Karma Indicators (D60 — Shashtiamsha)
Analyze the D60 chart provided. Identify 3 key past-life karmic patterns. Be precise — cite the D60 placements.

## 🌑 Saturn, Rahu & Ketu — The Karma Trio
- **Saturn in D1:** [precise analysis of Saturn's house, sign, aspects — karmic debt + lesson]
- **Rahu in D1:** [karmic obsession, what the soul chases this life]
- **Ketu in D1:** [what the soul has already mastered, must release]
- **Rahu-Ketu axis:** [the core karmic life lesson]

## 👪 D12 (Dwadashamsha) — Ancestral Karma & Parental Contracts
Analyze D12 placements. What ancestral karma is being inherited? What parental soul contracts are active?

## 💑 Soul Contracts — Jaimini Karakas
- AK (Atmakaraka): [soul's core mission]
- DK (Darakaraka): [the type of partner soul contracted to meet]
- AL (Arudha Lagna): [how the world perceives this soul]
- Upapada Lagna: [the nature of marriage/partnership karma]

## 🔥 This Life's Mission (Dharmic Path)
Based on all above — state clearly what ${pName}'s soul came here to DO. One paragraph. Decisive. Destined.

## 🕉️ Prescribed Karma Clearing Protocol
### Primary Mantra (48-Day Mandala):
[Give exact Sanskrit mantra with phonetic transliteration]
- Planet it activates: [specific planet]
- Logic: [why this mantra for this exact karma]
- When: [exact day, time]
- How: 108x daily on rudraksha mala, facing [direction]
- Impact: [what shifts after 48 days]

### Secondary Ritual:
[One DIY chart-specific ritual — charity, fasting, or offering — tied to exact house/planet]
Duration: 48 days (1 Mandala)

---
*This report is sealed with cosmic precision. Your karma is not a prison — it is your path.*

## ABSOLUTE RULES:
- ZERO gemstone recommendations
- Every claim must cite specific chart data (e.g., "Saturn in H6 Capricorn, conjunct Mars")
- Use confident, declarative language — never "may" or "might"
- Ensure your response is completely finished and does not cut off mid-sentence.
- Maximum 1500 words total`;

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
      .eq("report_type", "karma_dna")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (saved) {
      return NextResponse.json({ found: true, reportData: saved.content });
    }
    return NextResponse.json({ found: false });

  } catch (err: any) {
    console.error("Karma DNA GET error:", err);
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
    if (credits < 20) {
      return NextResponse.json({ error: "Insufficient credits. Karma DNA Report costs 20 credits." }, { status: 402 });
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

    // ── Get natal chart (cached) ────────────────────────────────────────────────
    const { chart } = await getOrBuildChart(dob, tob, pob, tz, undefined, undefined, user.email);

    // ── Read D12 and D60 from CACHED chart (no API calls needed) ──────────────
    // Present in schema v2 GoldenMasterJSON — always available after first build.
    const d12Data = chart.divisional.d12;
    const d60Data = chart.divisional.d60;
    console.log("[karma-dna] D12/D60 read from cache — 0 extra API calls");

    // ── Render divisional chart to string ──────────────────────────────────────
    function parseHoroChart(dc: typeof d12Data): string {
      if (!dc || !dc.ascendant) return "Data unavailable";
      return `Lagna: ${dc.ascendant} | ` +
        dc.planets.map((p: any) => `${p.name}:H${p.house}(${p.sign})`).join(" ");
    }

    // ── Build context for LLM ──────────────────────────────────────────────────
    const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
                   "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    const lagnaSignNum = SIGNS.findIndex(s => s === chart.d1.ascendant) + 1;

    // Compute Arudha Lagna (AL) for context
    const SIGN_LORD: Record<string, string> = {
      Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",
      Leo:"Sun",Virgo:"Mercury",Libra:"Venus",Scorpio:"Mars",
      Sagittarius:"Jupiter",Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter",
    };

    const chartContext = `
PERSON: ${pName}
LAGNA: ${chart.d1.ascendant} | MOON SIGN: ${chart.d1.moonSign} | SUN SIGN: ${chart.d1.sunSign}
MOON NAKSHATRA: ${chart.d1.moonNakshatra}

KARAKAS:
  AK (Atmakaraka/Soul):     ${chart.karakas.ak}
  AMK (Amatyakaraka):       ${chart.karakas.amk}
  BK (Bhratrukaraka):       ${chart.karakas.bk}
  DK (Darakaraka/Spouse):   ${chart.karakas.dk}
  GK (Gnatikaraka):         ${chart.karakas.gk}

DASHA:
  Mahadasha:  ${chart.dasha.mahadasha} until ${chart.dasha.mahadashaEnd}
  Antardasha: ${chart.dasha.antardasha} until ${chart.dasha.antardashaEnd}

D1 PLANETS:
${chart.d1.planets.map(p => `  ${p.name}: ${p.sign} H${p.house} ${p.normDegree.toFixed(1)}° ${p.nakshatra} ${p.isRetro?"(Retro)":""}`).join("\n")}

D1 HOUSES:
${chart.d1.houses.map(h => `  H${h.number}(${h.sign}): ${h.occupants.join(",")||"∅"}`).join("\n")}

D9 NAVAMSHA LAGNA: ${chart.divisional.d9.ascendant}
D9 PLANETS: ${chart.divisional.d9.planets.map((p: any) => `${p.name}:${p.sign}H${p.house}`).join(" ")}

D12 DWADASHAMSHA (Ancestral/Past-Life Parents):
${d12Data ? parseHoroChart(d12Data) : "Fetch failed — use D1 Saturn/Rahu/Ketu for past life reading"}

D60 SHASHTIAMSHA (Soul Karma — Most Precise):
${d60Data ? parseHoroChart(d60Data) : "Fetch failed — use D9 + Ketu placement for soul karma"}
`;

    // ── Call Claude 4.6 via Bedrock ────────────────────────────────────────────
    const llmResult = await routeLLM(
      KARMA_DNA_SYSTEM_PROMPT(pName),
      [{ role: "user", content: `Generate the complete Karma DNA Report for ${pName}.\n\n${chartContext}` }],
      4000  // Increased token limit to ensure complete report without cutoff
    );

    // ── Deduct 20 credits ──────────────────────────────────────────────────────
    await supabaseAdmin.from("user_profiles")
      .update({ credits: Math.max(0, credits - 20) })
      .eq("id", user.id);

    // ── Log usage ──────────────────────────────────────────────────────────────
    supabaseAdmin.from("token_usage_logs").insert({
      user_id: user.id, model_name: llmResult.model,
      input_tokens: llmResult.tokensIn, output_tokens: llmResult.tokensOut,
      total_tokens: llmResult.tokensIn + llmResult.tokensOut,
      cost_inr: calcCostInr(llmResult.model, llmResult.tokensIn, llmResult.tokensOut).toFixed(6),
      credits_used: 20, question_preview: "Karma DNA Report",
    });

    const reportData = {
      report:          llmResult.text,
      personName:      pName,
      model:           llmResult.model,
      d12Available:    !!d12Data,
      d60Available:    !!d60Data,
    };

    // ── Save to DB ─────────────────────────────────────────────────────────────
    let targetProfileId: string | null = null;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabaseAdmin
        .from("family_profiles")
        .select("id")
        .eq("user_id", user.id)
        .eq("relationship", "Self")
        .maybeSingle();
      targetProfileId = fp?.id ?? null;
    } else {
      targetProfileId = profileId;
    }

    if (targetProfileId) {
      const { error: saveErr } = await supabaseAdmin.from("saved_reports").insert({
        user_id:     user.id,
        profile_id:  targetProfileId,
        report_type: "karma_dna",
        content:     reportData,
      });
      if (saveErr) {
        console.error("[KARMA DNA] ❌ Failed to save report:", saveErr.message, saveErr.code, saveErr.details);
      } else {
        console.log("[KARMA DNA] ✅ Report saved for profile:", targetProfileId);
      }
    } else {
      console.warn("[KARMA DNA] ⚠️ No valid profileId found — report NOT saved.");
    }

    return NextResponse.json({
      ...reportData,
      creditsRemaining: Math.max(0, credits - 20),
    });

  } catch (err: any) {
    console.error("Karma DNA error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
