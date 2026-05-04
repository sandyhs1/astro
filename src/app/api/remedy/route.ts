import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { routeLLMCached } from "@/lib/astrology/llm-router";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LLM_PRICE: Record<string, { in: number; out: number }> = {
  "bedrock/us.anthropic.claude-sonnet-4-6": { in: 0.252,  out: 1.26   },
  "bedrock/claude-3-7-sonnet":               { in: 0.252,  out: 1.26   },
  "gemini/gemini-3.1-pro-preview":           { in: 0.105,  out: 0.42   },
  "gemini/gemini-3.1-flash-lite-preview":    { in: 0.0063, out: 0.0063 },
};
function calcCostInr(model: string, tokIn: number, tokOut: number): number {
  const p = LLM_PRICE[model] ?? { in: 0.252, out: 1.26 };
  return (tokIn / 1000) * p.in + (tokOut / 1000) * p.out;
}

const CREDIT_COST = 25;

// ─── System Prompt ────────────────────────────────────────────────────────────

function buildRemedyPrompt(pName: string): string {
  return `You are the GRANDMASTER JYOTISHI of Quantum Karma.
You are generating a HIGHLY POTENT TANTRIC MANTRA REMEDY report for ${pName}.

YOUR WRITING RULE:
- You must speak directly to the user.
- Your tone must be authoritative, deeply powerful, and strict.
- NO AFFIRMATIONS ARE ALLOWED EVER. Do not generate generic positive psychology. There is a profound difference between modern affirmations and highly potent Vedic/Tantric mantras. Mantras are sonic mathematical formulas that alter human consciousness and karmic DNA. Treat them with ultimate reverence.

MANDATORY REPORT STRUCTURE — follow exactly, use these exact section headers:

---

## INTRODUCTION

Write a beautiful, personalized introduction addressed to ${pName}. 
Explain the profound power of mantras. Explain that mantras are not wishes or affirmations—they are highly potent, nuclear-level sound frequencies that literally rewrite spiritual and cellular DNA. Explain that this requires immense respect.

---

## YOUR POTENT MANTRAS

Based on the astrological data provided below (look closely at afflicted planets, current Mahadasha, and the Ascendant lord), generate EXACTLY 2 or 3 highly specific Tantric Mantras.

For each mantra, use this exact format:

### Mantra [N]: [Name of Mantra or Deity]

> **The Mantra:** [The exact Sanskrit text, transliterated clearly]
> **Why this specific mantra:** [Explain the logic and impact based on their exact astrological chart data. Be highly specific.]

**Instructions:**
- **Frequency:** [Must be exactly one of: 11, 21, 28, or 48 times per day. Do not use 108 unless absolutely necessary.]
- **Duration:** 48 days (1 mandala) without a single break.
- **When to do it:** [Specify morning, evening, twilight, or specific time based on the planet]
- **Do's:** [1-2 strict rules]
- **Don'ts:** [1-2 strict prohibitions]

---

## MOTIVATIONAL CLOSING

Write an emotionally powerful, encouraging closing. Demand that they get started immediately and perform this with utmost love, terrifying persistence, and unwavering focus. Make them feel thrilled to embrace this power.

---

ABSOLUTE RULES:
- Every section must be completed fully.
- Total word count: 600–900 words.
- NO affirmations!`;
}

function buildChartContext(chart: any, pName: string): string {
  return `
PERSON: ${pName}

── BIRTH CHART FOUNDATION ──
LAGNA (Ascendant): ${chart.d1.ascendant}
MOON SIGN: ${chart.d1.moonSign}
SUN SIGN: ${chart.d1.sunSign}

── DASHA ──
Mahadasha:  ${chart.dasha.mahadasha}
Antardasha: ${chart.dasha.antardasha}

── D1 RASI — PLANET POSITIONS ──
${chart.d1.planets.map((p:any) =>
  `${p.name}: ${p.sign} H${p.house} ${p.isRetro ? "(Retro)" : ""} ${p.isExalted ? "(Exalted)" : ""} ${p.isDebilitated ? "(Debilitated)" : ""} ${p.isCombust ? "(Combust)" : ""}`
).join("\\n")}
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

    const { data: saved } = await supabase
      .from("saved_reports")
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
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single();
    const credits = profile?.credits ?? 0;
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

    const chartContext = buildChartContext(chart as any, pName);

    const systemPrompt = buildRemedyPrompt(pName);

    const staticContext = chartContext;
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
      await supabaseAdmin.from("saved_reports").insert({
        user_id:     user.id,
        profile_id:  targetProfileId,
        report_type: "remedy",
        content:     reportData,
      });
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
    { match: "INTRODUCTION",       id: "intro",   title: "Introduction",       color: "indigo",  icon: "🕉️" },
    { match: "YOUR POTENT MANTRAS",id: "mantras", title: "Your Potent Mantras",color: "amber",   icon: "🔥" },
    { match: "MOTIVATIONAL CLOSING",id: "closing",title: "Closing",            color: "purple",  icon: "✨" },
  ];

  const sections: any[] = [];
  const parts = markdown.split(/^##\\s+/m).filter(Boolean);

  for (const part of parts) {
    const firstLine = part.split("\\n")[0].trim().toUpperCase();
    const body = part.split("\\n").slice(1).join("\\n").trim();

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
