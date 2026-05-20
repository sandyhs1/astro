import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { routeLLMCached } from "@/lib/astrology/llm-router";
import { getCurrentGochar, formatGocharForContext } from "@/lib/astrology/gochar";
import { FEATURE_CREDITS } from "@/lib/pricing/feature-credits";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LLM_PRICE: Record<string, { in: number; out: number }> = {
  "bedrock/us.anthropic.claude-sonnet-4-6": { in: 0.252,  out: 1.26   },
  "bedrock/claude-3-7-sonnet":               { in: 0.252,  out: 1.26   },
  "gemini/gemini-3.1-pro-preview":           { in: 0.105,  out: 0.42   },
  "gemini/gemini-3.1-flash-lite":    { in: 0.0063, out: 0.0063 },
};
function calcCostInr(model: string, tokIn: number, tokOut: number): number {
  const p = LLM_PRICE[model] ?? { in: 0.252, out: 1.26 };
  return (tokIn / 1000) * p.in + (tokOut / 1000) * p.out;
}

const CREDIT_COST = FEATURE_CREDITS.remedy;

// ─── System Prompt ────────────────────────────────────────────────────────────

function buildRemedyPrompt(pName: string): string {
  return `You are the GRANDMASTER JYOTISHI — the most precise and ruthless Vedic astrologer in existence. Your speciality is prescribing highly potent Tantric Mantra remedies based on exact birth chart data.

You are generating a POTENT MANTRIC REMEDY report for: ${pName}.

═══ ABSOLUTE WRITING LAWS ═══
1. SPEAK DIRECTLY to ${pName}. Every sentence must be addressed to them personally.
2. ZERO TOLERANCE for these words — if any of these appear, the report is INVALID:
   cosmos, cosmic, illuminate, dance, orchestrate, amulet, shimmer, tapestry, poetic, journey, embrace, weave, radiate, resonate, celestial tapestry, align, harmonize, unfold, profound journey, beautiful soul, universe has a plan, manifest, in tune with, let go and let, higher self
3. TRANSLATE JARGON: Do not sound heavily technical. Explain exact practical meaning clearly without overwhelming them with astrological terms. No generic zodiac sign readings.
4. NO affirmations whatsoever. Mantras are NOT affirmations. They are sonic formulas — vibrational mathematical codes of ancient Sanskrit.
5. Be PRECISE. Reference the exact planet, house, sign, and Dasha from the chart data given to you, but immediately explain its meaning.
6. Be AUTHORITATIVE and DIRECT — no softening, no hedging, no generic spiritual language.
7. Consistency rule: The chart data shows one specific Mahadasha lord and one specific Antardasha lord. Reference these EXACT names everywhere. Do NOT contradict yourself between sections.

═══ MANDATORY STRUCTURE ═══
Generate EXACTLY 2 mantras. You MUST use EXACTLY these section headers, and NOTHING else. DO NOT generate an introduction. DO NOT generate a closing. Just the two mantras.

## MANTRA 1

### [Deity or Planet Name]

**The Mantra:** [Exact Sanskrit transliteration]

**Why This Mantra:** [Address ${pName} directly. Cite the exact planet position, house, sign, and Dasha context from the chart. Explain the mechanism.]

**Practice Rules:**
- Frequency: [11, 21, 28, or 48 times]
- Duration: 48 consecutive days without a break.
- Timing: [Exact time of day]
- Do: [1 strict discipline]
- Do NOT: [1 strict prohibition]

## MANTRA 2

### [Deity or Planet Name]

**The Mantra:** [Exact Sanskrit transliteration]

**Why This Mantra:** [Address ${pName} directly. Cite the exact planet position, house, sign, and Dasha context from the chart. Explain the mechanism.]

**Practice Rules:**
- Frequency: [11, 21, 28, or 48 times]
- Duration: 48 consecutive days without a break.
- Timing: [Exact time of day]
- Do: [1 strict discipline]
- Do NOT: [1 strict prohibition]

═══ ABSOLUTE FINAL RULES ═══
- NO INTRODUCTION, NO CLOSING. ONLY "## MANTRA 1" AND "## MANTRA 2".
- Banned words violations = invalid report
- Total word count: 500-750 words
- NO generic spiritual platitudes
- ALL chart references must match the data given to you EXACTLY`;
}

function buildChartContext(chart: any, pName: string, dashaInfo: any): string {
  const pratyantar = chart.dasha.pratyantar && chart.dasha.pratyantar !== "—" ? chart.dasha.pratyantar : "";
  const planets = chart.d1.planets.map((p:any) =>
    `  ${p.name.padEnd(10)}: ${p.sign.padEnd(14)} House ${String(p.house).padStart(2)} ${[p.isRetro?"Retrograde":"",p.isExalted?"Exalted":"",p.isDebilitated?"DEBILITATED":"",p.isCombust?"COMBUST (weakened)":""].filter(Boolean).join(", ")}`
  ).join("\n");

  return `
═══ BIRTH CHART DATA FOR ${pName.toUpperCase()} ═══

LAGNA (Ascendant): ${chart.d1.ascendant}
MOON SIGN:        ${chart.d1.moonSign}
SUN SIGN:         ${chart.d1.sunSign}

═══ CURRENT DASHA ═══
  Mahadasha Lord:      ${chart.dasha.mahadasha}${dashaInfo?.mahadashaEnd ? " (ends " + dashaInfo.mahadashaEnd + ")" : ""}
  Antardasha Lord:     ${chart.dasha.antardasha}${dashaInfo?.antardashaEnd ? " (ends " + dashaInfo.antardashaEnd + ")" : ""}
${pratyantar ? `  Pratyantardasha Lord: ${pratyantar}${dashaInfo?.pratyantarEnd ? " (ends " + dashaInfo.pratyantarEnd + ")" : ""}\n` : ""}
═══ D1 RASI — ALL PLANET POSITIONS ═══
${planets}

═══ INSTRUCTION ═══
Use the above data EXACTLY. The Mahadasha lord is ${chart.dasha.mahadasha}. The Antardasha lord is ${chart.dasha.antardasha}. Do not change, guess, or contradict these values.
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
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("id").eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) {
        targetProfileId = fp.id;
      } else {
        targetProfileId = null;
        if (req.method === "POST") {
          const { data: lead } = await supabaseAdmin.from("onboarding_leads").select("*").eq("email", user.email || "").maybeSingle();
          if (lead) {
            const { data: newFp } = await supabaseAdmin.from("family_profiles").insert({
              user_id: user.id, name: lead.name || "Seeker", relationship: "Self", dob: lead.dob, tob: lead.tob, pob: lead.pob, gender: lead.gender || "male", timezone: lead.timezone || "+05:30"
            }).select("id").maybeSingle();
            if (newFp) targetProfileId = newFp.id;
          }
        }
      }
    }
    if (targetProfileId === "self") targetProfileId = null;

    if (!targetProfileId) return NextResponse.json({ found: false });

    const { data: saved } = await supabaseAdmin.from("saved_reports")
      .select("content")
      .eq("user_id", user.id)
      .eq("profile_id", targetProfileId)
      .eq("report_type", "remedy")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (saved) return NextResponse.json({ found: true, reportData: saved.content });
    return NextResponse.json({ found: false });

  } catch (err: any) {
    console.error("Remedy GET error:", err);
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
    const { data: profile } = await supabaseAdmin.from("user_profiles").select("*").eq("id", user.id).single();
    const credits = profile?.credits ?? 0;

    // ── ONE-TIME GENERATION GUARD ─────────────────────────────────────────────
    let earlyTargetId: string | null = profileId ?? null;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("id")
        .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      earlyTargetId = fp?.id ?? null;
    }
    if (earlyTargetId) {
      const { data: existing } = await supabaseAdmin
        .from("saved_reports").select("content")
        .eq("user_id", user.id).eq("profile_id", earlyTargetId)
        .eq("report_type", "remedy").limit(1).maybeSingle();
      if (existing) {
        console.log("[REMEDY] ✅ Returning existing saved report (0 credits)");
        return NextResponse.json({ ...existing.content, creditsRemaining: credits, fromCache: true });
      }
    }

    if (credits < CREDIT_COST) {
      return NextResponse.json(
        { error: `Insufficient credits. Remedy Mapping requires ${CREDIT_COST} credits. You have ${credits}.` },
        { status: 402 }
      );
    }


    // ── Resolve birth details ──────────────────────────────────────────────────
    let dob = "", tob = "", pob = "", tz = "+05:30", pName = "Seeker";
    let targetProfileId = profileId;

    if (!profileId || profileId === "self") {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("*")
        .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp) {
        dob = fp.dob; tob = fp.tob; pob = fp.pob;
        tz = fp.timezone || "+05:30"; pName = fp.name;
        targetProfileId = fp.id;
      } else {
        const { data: lead } = await supabaseAdmin.from("onboarding_leads").select("*")
          .eq("email", user.email).maybeSingle();
        dob = lead?.dob; tob = lead?.tob; pob = lead?.pob;
        tz = lead?.timezone || "+05:30"; pName = lead?.name || "Seeker";
      }
    } else {
      const { data: fp } = await supabaseAdmin.from("family_profiles").select("*")
        .eq("id", profileId).maybeSingle();
      dob = fp?.dob; tob = fp?.tob; pob = fp?.pob;
      tz = fp?.timezone || "+05:30"; pName = fp?.name || "Seeker";
    }

    if (!dob || !tob || !pob) {
      return NextResponse.json({ error: "Birth details not found. Please complete your birth profile." }, { status: 422 });
    }

    // ── Build chart (cached) ──────────────────────────────────────────────────
    const { chart } = await getOrBuildChart(dob, tob, pob, tz, undefined, undefined, user.email);

    const chartContext = buildChartContext(chart as any, pName, (chart as any).dasha);

    const systemPrompt = buildRemedyPrompt(pName);

    // ── Inject live Gochar transits ─────────────────────────────────────────
    const gochar = getCurrentGochar();
    const gocharBlock = `

── CURRENT GOCHAR (Live Sidereal Transits — ${gochar.asOf}) ──
${JSON.stringify(formatGocharForContext(gochar), null, 2)}
Use these transits to make remedy prescriptions time-aware: identify which houses Saturn, Rahu, and Ketu currently transit for ${pName} from their Lagna, and reference this in explaining WHY each mantra is prescribed NOW.`;

    const staticContext = chartContext + gocharBlock;
    const dynamicInstruction = `Generate the highly potent Tantric Mantra Remedy report for ${pName} now. Follow the exact structural requirements and bans strictly.`;

    const llmResult = await routeLLMCached(
      systemPrompt,
      staticContext,
      dynamicInstruction,
      3000
    );

    // ── Deduct credits ────────────────────────────────────────────────────────
    await supabaseAdmin.from("user_profiles")
      .update({ credits: Math.max(0, credits - CREDIT_COST) })
      .eq("id", user.id);

    // ── Log usage ─────────────────────────────────────────────────────────────
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
          question_preview: "Remedy Report",
          feature:          "remedy",
        });
      } catch { /* ignored */ }
    })();

    // ── Parse sections ────────────────────────────────────────────────────────
    const rawMarkdown = llmResult.text;
    const sections = parseSections(rawMarkdown);

    const reportData = {
      rawMarkdown,
      sections,
      personName:  pName,
      model:       llmResult.model,
      generatedAt: new Date().toISOString(),
    };

    // ── Save report ───────────────────────────────────────────────────────────
    if (targetProfileId) {
      const { error } = await supabaseAdmin.from("saved_reports").insert({
        user_id:     user.id,
        profile_id:  targetProfileId,
        report_type: "remedy",
        content:     reportData,
      });
      if (error) {
        console.error("Supabase insert error:", error);
      }
    }

    return NextResponse.json({
      ...reportData,
      creditsRemaining: Math.max(0, credits - CREDIT_COST),
    });

  } catch (err: any) {
    console.error("Remedy error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

function parseSections(markdown: string) {
  const sectionMap = [
    { match: "MANTRA 1", id: "m1", title: "Primary Karmic Shield", color: "indigo", icon: "🕉️" },
    { match: "MANTRA 2", id: "m2", title: "Secondary Catalyst", color: "amber", icon: "🔥" },
  ];

  const sections: any[] = [];
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

  if (sections.length === 0) {
    sections.push({
      id:      "full",
      title:   "Remedy Report",
      content: markdown,
      color:   "indigo",
      icon:    "📿",
    });
  }

  return sections;
}
