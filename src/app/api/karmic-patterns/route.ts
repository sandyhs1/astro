import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { routeLLMCached } from "@/lib/astrology/llm-router";
import { getCurrentGochar, formatGocharForContext } from "@/lib/astrology/gochar";
import { astroClient } from "@/lib/astrology/client";
import { parseBirthParams, geocodePlace, tzStringToFloat } from "@/lib/astrology/client";
import { computeKarmicEchoes, echoesToPromptString } from "@/lib/astrology/karmic-engine";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ PRIMARY: Claude Sonnet 4.6 | ✅ FALLBACK: Gemini 3.1 Pro | ⛔ BANNED: Claude 3.7
const LLM_PRICE: Record<string, { in: number; out: number }> = {
  "bedrock/us.anthropic.claude-sonnet-4-6": { in: 0.252,  out: 1.26   }, // ✅ Active
  "bedrock/claude-3-7-sonnet":               { in: 0.252,  out: 1.26   }, // ⛔ Legacy only
  "gemini/gemini-3.1-pro-preview":           { in: 0.105,  out: 0.42   }, // ✅ Fallback
  "gemini/gemini-3.1-flash-lite-preview":    { in: 0.0063, out: 0.0063 }, // ✅ Gatekeeper
};
function calcCostInr(model: string, tokIn: number, tokOut: number): number {
  const p = LLM_PRICE[model] ?? { in: 0.252, out: 1.26 };
  return (tokIn / 1000) * p.in + (tokOut / 1000) * p.out;
}

const CREDIT_COST = 25;

// ─── System Prompt ────────────────────────────────────────────────────────────

function buildGrandmasterPrompt(pName: string, antardasha: string, mahadasha: string): string {
  return `You are the GRANDMASTER JYOTISHI of Quantum Karma.
You are writing a KARMIC PATTERNS MAPPING report for ${pName}.

YOUR TWO-LAYER WRITING RULE (mandatory for every single point):
- Layer 1 — PROOF: State the exact astrological fact. Name the planet, sign, house, chart. Be precise.
- Layer 2 — MEANING: Immediately after, in plain English, explain what this means in real life. What does the person actually EXPERIENCE because of this? What behavior, pattern, or event does this create in their daily life?

Format every insight like this:
> **Chart Proof:** [exact astrological data — planet, sign, house, chart name]
> **What this means for you:** [plain English explanation — no jargon — written as if explaining to a smart person who knows nothing about astrology]

This structure is NON-NEGOTIABLE. Every single claim must have both layers.

YOUR IDENTITY:
A high-consciousness Vedic astrologer with 40 years of practice. You cut through confusion. You explain what is actually happening in someone's life and WHY — with the chart as evidence. You never leave a user confused about what a term means.

ACTIVE DASHA CONTEXT:
- Mahadasha: ${mahadasha}
- Antardasha: ${antardasha}

BANNED WORDS AND PHRASES: "cosmic journey", "universe has plans", "soul's adventure", "divine timing", "vibration", "manifest", "abundance mindset", "resonate", "beautiful soul", "embrace", "energy". Use none of these.

MANDATORY REPORT STRUCTURE — follow exactly, use these exact section headers:

---

## SOUL GREETING

Write 2 sentences directly to ${pName}. Reference their active ${antardasha} Antardasha. State plainly what period of life they are in right now and what its primary demand is. No flattery. No spiritual fluff.

---

## THE RECURRING PATTERNS

Identify exactly 3 dominant Karmic Echoes from the computed echo data provided.

For each pattern, use this exact format:

### Pattern [N]: [Give it a plain-English name, e.g. "The Repeated Authority Conflict" or "The Self-Sabotage Loop"]

> **Chart Proof:** [Exact planets, signs, houses, which charts — e.g. "Mars is Vargottama: it sits in Scorpio H1 in D1 and also in Scorpio H1 in D9. It also appears in H1 in D10."]
> **What this means for you:** [In plain English: what recurring situation does this create in ${pName}'s life? What do they keep doing, feeling, or attracting? Make it feel personally recognizable.]

**The Loop:** [1 sentence describing the exact behavioral or life cycle this creates — e.g. "You take on challenges aggressively, burn out, retreat, then repeat the same pattern."]

**Root Cause:** [1 sentence on the past-life karmic origin based on the chart data.]

---

## BREAKING THE LOOP

For each of the 3 patterns above, provide one specific action. Use this format:

### Breaking Pattern [N]: [Pattern name]

> **Chart Proof:** [Which planet/house/chart dictates this remedy]
> **What this means for you:** [Plain English: why this specific action counteracts the pattern]

**The Action:** [Exact, specific, behavioral. Time-bound where possible. Tied to the planet/house. Not generic.]

---

## DOMAIN INTELLIGENCE

### MARRIAGE & PARTNERSHIP

> **Chart Proof:** [State AL house, UL house, DK planet, 7th house in D1 and D9. Name the signs.]
> **What this means for you:** [Plain English: What pattern does ${pName} repeat in relationships? What kind of partner do they keep attracting and why? What is the core relationship wound?]

**What is actually happening:** [2-3 sentences expanding on the pattern in real-life relationship terms]

**Your Plan of Action:**
- [Action 1 — specific, behavioral. Not "be more open". E.g. "Before committing to anyone, wait 6 months past the point where you first feel certain — your 7th lord in H8 means your initial certainty is consistently wrong."]
- [Action 2]
- [Action 3]

**Watch out for:**
- [Red flag 1 — based on chart data, explained in plain English]
- [Red flag 2]

---

### CAREER & PUBLIC ROLE

> **Chart Proof:** [State D10 ascendant, 10th lord in D1, AMK planet, AL house]
> **What this means for you:** [Plain English: What is ${pName}'s real career pattern? What do they keep doing that holds them back or propels them forward?]

**What is actually happening:** [2-3 sentences in plain language]

**Your Plan of Action:**
- [Action 1 — specific]
- [Action 2]
- [Action 3]

**Watch out for:**
- [Red flag 1 — plain English]
- [Red flag 2]

---

### HEALTH & VITALITY

> **Chart Proof:** [State Pranapada distance, 6th house sign and occupants, Saturn/Rahu/Ketu health impact]
> **What this means for you:** [Plain English: What health patterns does ${pName} repeat? Where does stress physically accumulate? What system in their body is under karmic pressure?]

**What is actually happening:** [2-3 sentences in plain language]

**Your Plan of Action:**
- [Action 1]
- [Action 2]

**Watch out for:**
- [Red flag 1]
- [Red flag 2]

---

## MOTIVATIONAL CLOSING

2 sentences. Reference the single strongest positive indicator in ${pName}'s chart — name the planet, sign, and chart. State plainly what this means they are capable of. No platitudes.

---

ABSOLUTE RULES:
- 🚫 BANNED AI CLICHES: "COSMOS", "COSMIC", "DANCE", "TAPESTRY", "ILLUMINATE", "POETIC", "AMULET", "SHIMMERING". Never use these words.
- TRANSLATE JARGON: Do not sound heavily technical. Explain exact practical meaning clearly.
- NO GENERIC ZODIAC STYLE: Be hyper-specific to their exact chart. No generic readings.
- Every claim MUST have a Chart Proof block AND a plain-English "What this means for you" block
- No astrology term left unexplained to the reader. Focus on the actual, practical life impact.
- No gemstone recommendations
- Language is confident and declarative — never "may", "might", "could", "perhaps"
- Do not cut off mid-sentence. Complete every section fully.
- Total word count: 1000–1400 words`;
}

// ─── Chart context builder ────────────────────────────────────────────────────

function buildChartContext(
  chart: ReturnType<typeof import("@/lib/astrology/normalize").normalizeBundle>,
  pName: string,
  d3Raw: any,
  d12Raw: any,
  d60Raw: any,
  echoesStr: string
): string {
  function parseHoroChart(raw: any): string {
    if (!Array.isArray(raw)) return "Data unavailable";
    return raw.map((h: any, i: number) => {
      const planets = (h.planet || []).join(", ") || "∅";
      return `H${i + 1}(${h.sign_name || "?"}): ${planets}`;
    }).join(" | ");
  }

  return `
PERSON: ${pName}
DATE: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}

── BIRTH CHART FOUNDATION ──
LAGNA (Ascendant): ${chart.d1.ascendant}
MOON SIGN: ${chart.d1.moonSign}
SUN SIGN: ${chart.d1.sunSign}
MOON NAKSHATRA: ${chart.d1.moonNakshatra}

── DASHA ──
Mahadasha:  ${chart.dasha.mahadasha} until ${chart.dasha.mahadashaEnd}
Antardasha: ${chart.dasha.antardasha} until ${chart.dasha.antardashaEnd}
Pratyantar: ${chart.dasha.pratyantar || "N/A"}

── JAIMINI KARAKAS ──
AK  (Atmakaraka  / Soul):          ${chart.karakas.ak}
AMK (Amatyakaraka / Career):       ${chart.karakas.amk}
BK  (Bhratrukaraka / Siblings):    ${chart.karakas.bk}
MK  (Matrukaraka / Mother):        ${chart.karakas.mk}
PK  (Putrakaraka / Children):      ${chart.karakas.pk}
GK  (Gnatikaraka / Rivals):        ${chart.karakas.gk}
DK  (Darakaraka / Spouse):         ${chart.karakas.dk}

── D1 RASI — PLANET POSITIONS ──
${chart.d1.planets.map(p =>
  `${p.name}: ${p.sign} H${p.house} ${p.normDegree.toFixed(1)}° ${p.nakshatra} Pada-${p.nakshatraPada}${p.isRetro ? " (Retro)" : ""}${p.isExalted ? " (Exalted)" : ""}${p.isDebilitated ? " (Debilitated)" : ""}${p.isCombust ? " (Combust)" : ""}`
).join("\n")}

── D1 HOUSE OCCUPANCY ──
${chart.d1.houses.map(h => `H${h.number}(${h.sign}): ${h.occupants.join(", ") || "∅"}`).join("  ")}

── D9 NAVAMSHA ──
Lagna: ${chart.divisional.d9.ascendant}
${chart.divisional.d9.planets.map((p: any) => `${p.name}: ${p.sign} H${p.house}`).join("  ")}

── D10 DASHAMSHA ──
Lagna: ${chart.divisional.d10.ascendant}
${chart.divisional.d10.planets.map((p: any) => `${p.name}: ${p.sign} H${p.house}`).join("  ")}

── D3 DREKKANA (Siblings / Vitality) ──
${parseHoroChart(d3Raw)}

── D12 DWADASHAMSHA (Ancestral / Parents) ──
${parseHoroChart(d12Raw)}

── D60 SHASHTIAMSHA (Soul Karma — Highest Precision) ──
${parseHoroChart(d60Raw)}

${echoesStr}
`.trim();
}

// ─── GET — Fetch saved report ─────────────────────────────────────────────────

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
      const { data: fp } = await supabase.from("family_profiles").select("id")
        .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) targetProfileId = fp.id;
    }

    if (!targetProfileId) return NextResponse.json({ found: false });

    const { data: saved } = await supabaseAdmin.from("saved_reports")
      .select("content")
      .eq("user_id", user.id)
      .eq("profile_id", targetProfileId)
      .eq("report_type", "karmic_patterns")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (saved) return NextResponse.json({ found: true, reportData: saved.content });
    return NextResponse.json({ found: false });

  } catch (err: any) {
    console.error("Karmic Patterns GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST — Generate report ───────────────────────────────────────────────────

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

    // ── Credits check ─────────────────────────────────────────────────────────
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single();
    const credits = profile?.credits ?? 0;

    // ── ONE-TIME GENERATION GUARD ─────────────────────────────────────────────
    let earlyTargetId: string | null = profileId ?? null;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabase.from("family_profiles").select("id")
        .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      earlyTargetId = fp?.id ?? null;
    }
    if (earlyTargetId) {
      const { data: existing } = await supabaseAdmin
        .from("saved_reports").select("content")
        .eq("user_id", user.id).eq("profile_id", earlyTargetId)
        .eq("report_type", "karmic_patterns").limit(1).maybeSingle();
      if (existing) {
        console.log("[KARMIC PATTERNS] ✅ Returning existing saved report (0 credits)");
        return NextResponse.json({ ...existing.content, creditsRemaining: credits, fromCache: true });
      }
    }

    if (credits < CREDIT_COST) {
      return NextResponse.json(
        { error: `Insufficient credits. Karmic Patterns Report requires ${CREDIT_COST} credits. You have ${credits}.` },
        { status: 402 }
      );
    }


    // ── Resolve birth details ──────────────────────────────────────────────────
    let dob = "", tob = "", pob = "", tz = "+05:30", pName = "Seeker";
    let targetProfileId = profileId;

    if (!profileId || profileId === "self") {
      const { data: fp } = await supabase.from("family_profiles").select("*")
        .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) {
        dob = fp.dob; tob = fp.tob; pob = fp.pob;
        tz = fp.timezone || "+05:30"; pName = fp.name;
        targetProfileId = fp.id;
      } else {
        const { data: lead } = await supabase.from("onboarding_leads").select("*")
          .eq("email", user.email).maybeSingle();
        dob = lead?.dob; tob = lead?.tob; pob = lead?.pob;
        tz = lead?.timezone || "+05:30"; pName = lead?.name || "Seeker";
      }
    } else {
      const { data: fp } = await supabase.from("family_profiles").select("*")
        .eq("id", profileId).maybeSingle();
      dob = fp?.dob; tob = fp?.tob; pob = fp?.pob;
      tz = fp?.timezone || "+05:30"; pName = fp?.name || "Seeker";
    }

    if (!dob || !tob || !pob) {
      return NextResponse.json({ error: "Birth details not found. Please complete your birth profile." }, { status: 422 });
    }

    // ── Build chart (cached) ──────────────────────────────────────────────────
    const { chart } = await getOrBuildChart(dob, tob, pob, tz, undefined, undefined, user.email);

    // ── Read D3, D12, D60 from CACHED chart (no API calls needed) ────────────
    // These are now always present in schema v2 GoldenMasterJSON.
    // Pass raw planet arrays directly (as computeKarmicEchoes expects any[]).
    const d3Raw  = chart.divisional.d3?.planets  ?? null;
    const d12Raw = chart.divisional.d12?.planets ?? null;
    const d60Raw = chart.divisional.d60?.planets ?? null;
    console.log("[karmic-patterns] D3/D12/D60 read from cache — 0 extra API calls");

    // ── Compute 5 Karmic Echoes ───────────────────────────────────────────────
    const echoes    = computeKarmicEchoes(chart, d3Raw, d12Raw, d60Raw);
    const echoesStr = echoesToPromptString(echoes);

    // ── Build full chart context ──────────────────────────────────────────────
    const chartContext = buildChartContext(chart as any, pName, d3Raw, d12Raw, d60Raw, echoesStr);

    // ── Inject live Gochar transits ───────────────────────────────────────────
    const gochar = getCurrentGochar();
    const gocharBlock = `

── CURRENT GOCHAR (Live Sidereal Transits — ${gochar.asOf}) ──
${JSON.stringify(formatGocharForContext(gochar), null, 2)}
Use these transits to specify WHICH karmic patterns are actively triggered right now for ${pName}. State the transit house from Lagna and from Moon for Saturn, Rahu, and Ketu.`;

    // ── Call Claude Sonnet 4.6 (Bedrock) with Prompt Caching ─────────────────
    // staticContext  = large chart + echoes + gochar block → cached
    // dynamicInstruction = small per-request command  → NOT cached
    const systemPrompt = buildGrandmasterPrompt(
      pName,
      chart.dasha.antardasha || "Unknown",
      chart.dasha.mahadasha  || "Unknown"
    );

    const staticContext      = chartContext + gocharBlock;  // the large 16-chart + echoes + gochar block
    const dynamicInstruction = `Generate the complete Karmic Patterns Mapping report for ${pName} now. Use the computed KARMIC ECHOES section above as the primary data source for [THE RECURRING PATTERNS] section. Cite exact planet, sign, house, and chart (D1/D3/D9/D10/D12/D60) references for every claim. Reference the CURRENT GOCHAR section to specify which patterns are live RIGHT NOW. Follow the mandatory structure exactly.`;

    const llmResult = await routeLLMCached(
      systemPrompt,
      staticContext,
      dynamicInstruction,
      5000
    );

    // ── Deduct credits ────────────────────────────────────────────────────────
    await supabaseAdmin.from("user_profiles")
      .update({ credits: Math.max(0, credits - CREDIT_COST) })
      .eq("id", user.id);

    // ── Log usage (fire-and-forget) ────────────────────────────────────────────
    void (async () => {
      try {
        await supabaseAdmin.from("token_usage_logs").insert({
          user_id:          user.id,
          model_name:       llmResult.model,
          input_tokens:     llmResult.tokensIn,
          output_tokens:    llmResult.tokensOut,
          total_tokens:     llmResult.tokensIn + llmResult.tokensOut,
          cost_inr:         calcCostInr(llmResult.model, llmResult.tokensIn, llmResult.tokensOut).toFixed(6),
          credits_used:     CREDIT_COST,
          question_preview: "Karmic Patterns Report",
        });
      } catch { /* non-critical */ }
    })();

    // ── Parse sections from markdown ──────────────────────────────────────────
    const rawMarkdown = llmResult.text;
    const sections = parseSections(rawMarkdown);

    const reportData = {
      rawMarkdown,
      sections,
      personName:  pName,
      model:       llmResult.model,
      echoes,
      d3Available:  !!d3Raw,
      d12Available: !!d12Raw,
      d60Available: !!d60Raw,
      generatedAt:  new Date().toISOString(),
    };

    // ── Save to saved_reports ─────────────────────────────────────────────────
    if (targetProfileId) {
      const { error: saveErr } = await supabaseAdmin.from("saved_reports").insert({
        user_id:     user.id,
        profile_id:  targetProfileId,
        report_type: "karmic_patterns",
        content:     reportData,
      });
      if (saveErr) {
        console.error("[KARMIC PATTERNS] ❌ Failed to save report:", saveErr.message, saveErr.code, saveErr.details);
      } else {
        console.log("[KARMIC PATTERNS] ✅ Report saved for profile:", targetProfileId);
      }
    } else {
      console.warn("[KARMIC PATTERNS] ⚠️ No valid profileId — report NOT saved.");
    }

    return NextResponse.json({
      ...reportData,
      creditsRemaining: Math.max(0, credits - CREDIT_COST),
    });

  } catch (err: any) {
    console.error("Karmic Patterns error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// ─── Section Parser ───────────────────────────────────────────────────────────

interface ReportSection {
  id: string;
  title: string;
  content: string;
  color: "indigo" | "amber" | "rose" | "emerald" | "purple";
  icon: string;
}

function parseSections(markdown: string): ReportSection[] {
  const sectionMap: Array<{
    match: string; id: string; title: string;
    color: ReportSection["color"]; icon: string;
  }> = [
    { match: "SOUL GREETING",         id: "greeting",  title: "Soul Greeting",           color: "indigo",  icon: "🙏" },
    { match: "RECURRING PATTERNS",    id: "patterns",  title: "The Recurring Patterns",  color: "amber",   icon: "🔮" },
    { match: "BREAKING THE LOOP",     id: "breaking",  title: "Breaking the Loop",       color: "rose",    icon: "⚡" },
    { match: "DOMAIN INTELLIGENCE",   id: "domains",   title: "Domain Intelligence",     color: "emerald", icon: "🗺️" },
    { match: "MOTIVATIONAL CLOSING",  id: "closing",   title: "Motivational Closing",    color: "purple",  icon: "✨" },
  ];

  const sections: ReportSection[] = [];

  // Split on ## headings
  const parts = markdown.split(/^##\s+/m).filter(Boolean);

  for (const part of parts) {
    const firstLine = part.split("\n")[0].trim().toUpperCase();
    const body = part.split("\n").slice(1).join("\n").trim();

    const def = sectionMap.find(s => firstLine.includes(s.match));
    if (!def) continue;

    sections.push({
      id:      def.id,
      title:   def.title,
      content: body,
      color:   def.color,
      icon:    def.icon,
    });
  }

  // If parser finds nothing (non-standard format), return single card
  if (sections.length === 0) {
    sections.push({
      id:      "full",
      title:   "Karmic Patterns Report",
      content: markdown,
      color:   "indigo",
      icon:    "🔮",
    });
  }

  return sections;
}
