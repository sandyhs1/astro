import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { routeLLM } from "@/lib/astrology/llm-router";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CREDITS_COST = 5;

const LLM_PRICE: Record<string, { in: number; out: number }> = {
  "bedrock/us.anthropic.claude-sonnet-4-6": { in: 0.252, out: 1.26 },
  "gemini/gemini-3.1-pro-preview":          { in: 0.105, out: 0.42 },
  "gemini/gemini-3.1-flash-lite-preview":   { in: 0.0063, out: 0.0063 },
};
function calcCostInr(model: string, tokIn: number, tokOut: number): number {
  const p = LLM_PRICE[model] ?? { in: 0.252, out: 1.26 };
  return (tokIn / 1000) * p.in + (tokOut / 1000) * p.out;
}

const GOTRA_SYSTEM_PROMPT = (gotra: string) =>
  `You are a Grandmaster Jyotishi and Vedic Scholar specializing in the lineage of the Saptarishis and the Puranic scriptures. Your Vedic scholarly knowledge and expertise is deep, legitimate, accurate and guaranteed. The world respects you. You reveal secrets which most scholars miss. You have an eye for detail.

Task: Generate a deep-dive analysis for the Gotra: ${gotra}.

## INTRO (2-3 sentences only):
Begin with what Gotras are — their Vedic origin, the mechanism of spiritual and genetic wisdom transmission through lineage, and why this ancient system remains one of the most precise identity markers in Dharmic civilization. Be authoritative. No hedging.

## OUTPUT STRUCTURE — FOLLOW EXACTLY:

### 🔱 The Progenitor
Detailed lore on the founding Rishi — their name, their era (which Manvantara), their primary Vedic contributions (which Shakhas, Sutras, or Brahmanas they authored/compiled), and the core spiritual temperament they embodied. What was their relationship with Brahma? With Indra? What is the Rishi known for that most scholars overlook?

### ⚡ The Inherited Samskaras
What specific psychological, intellectual, and spiritual tendencies does someone born in the ${gotra} Gotra carry? These are not random traits — they are Samskaras encoded into the lineage through thousands of generations of practice. Be precise. Be unapologetic. Reference the specific qualities the founding Rishi is known for and how they manifest in descendants.

### 📿 Scriptural Plan of Action
Provide three specific, actionable prescriptions:
1. **Nitya Karma (Daily Practice)**: The single most important daily practice for someone of this Gotra.
2. **Rishi Mantra**: The specific mantra to invoke the founding Rishi — with the Devanagari transliteration and meaning.
3. **Tarpana Guideline**: The exact Gotra-specific water offering ritual — what to say, when, and why.

### 🚀 Modern Context: Strengths for 2026
Translate the ancient Samskaras of this lineage into specific professional, intellectual, and leadership strengths for the modern world. What industries, roles, and domains does this Gotra naturally excel in? What is their hidden competitive edge that most don't leverage?

### 🏆 Carrying This Gotra With Pride
How to walk as a worthy descendant of this lineage. What behaviors honor the Rishi? What actions desecrate it? This section must be direct — tell them specifically what to do and what never to do.

### ⚔️ The Sacred Responsibilities
The non-negotiables. The duties that cannot be bargained with. What is this lineage obligated to carry forward? What would the founding Rishi demand of any living descendant in 2026?

## TONE:
- Savage yet Divine. Brutally honest about the weight of this lineage. No consolation prizes.
- Authoritative, not academic. Speak as someone who has access to the original texts — not a Wikipedia summary.
- Direct sentences. No poetic rambling. Every line must deliver information.

## BANNED WORDS:
cosmic, cosmos, shimmer, amulet, orchestrate, tapestry, dance, illuminate, poetic, poetry, architect, celestial, mystical, vibrations, energies, interplay, paradigm, resonate, journey, weave, fabric, awakening.

## FORMAT:
Premium Markdown with H2/H3 headers, bold key terms, bullet points for lists. No filler, no fluff. Length: 900–1200 words.`;

// ─── GET: Load saved report for a profile ───────────────────────────────────
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

    // Resolve profile_id
    let targetProfileId = profileId;
    if (!profileId || profileId === "self") {
      const { data: fp } = await supabase
        .from("family_profiles")
        .select("id")
        .eq("user_id", user.id)
        .eq("relationship", "Self")
        .maybeSingle();
      if (fp) targetProfileId = fp.id;
    }

    if (!targetProfileId) return NextResponse.json({ found: false });

    const { data: saved } = await supabaseAdmin.from("saved_reports")
      .select("content")
      .eq("user_id", user.id)
      .eq("profile_id", targetProfileId)
      .eq("report_type", "gotra_report")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (saved) return NextResponse.json({ found: true, reportData: saved.content });
    return NextResponse.json({ found: false });

  } catch (err: any) {
    console.error("[GOTRA REPORT] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST: Generate Gotra report ────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { gotra, profileId, saveReport = true } = await req.json();

    if (!gotra || !gotra.trim()) {
      return NextResponse.json({ error: "Gotra name is required." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ── Credits check (only if saveReport is true — B2C mode) ────────────────
    let credits = 0;
    if (saveReport) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      credits = profile?.credits ?? 0;
      if (credits < CREDITS_COST) {
        return NextResponse.json(
          { error: `Insufficient credits. This report costs ${CREDITS_COST} credits.` },
          { status: 402 }
        );
      }
    }

    // ── Generate report via LLM ───────────────────────────────────────────────
    const cleanGotra = gotra.trim();
    const llmResult = await routeLLM(
      GOTRA_SYSTEM_PROMPT(cleanGotra),
      [{ role: "user", content: `Generate the complete Gotra deep-dive for: ${cleanGotra} Gotra. Follow the exact structure. Be precise, authoritative, and specific to this lineage only.` }],
      3500
    );

    const reportData = {
      gotra:       cleanGotra,
      report:      llmResult.text,
      model:       llmResult.model,
      generatedAt: new Date().toISOString(),
    };

    // ── B2C only: deduct credits, log usage, save report ─────────────────────
    if (saveReport) {
      // Deduct credits
      await supabaseAdmin
        .from("user_profiles")
        .update({ credits: Math.max(0, credits - CREDITS_COST) })
        .eq("id", user.id);

      // Log usage
      supabaseAdmin.from("token_usage_logs").insert({
        user_id:        user.id,
        model_name:     llmResult.model,
        input_tokens:   llmResult.tokensIn,
        output_tokens:  llmResult.tokensOut,
        total_tokens:   llmResult.tokensIn + llmResult.tokensOut,
        cost_inr:       calcCostInr(llmResult.model, llmResult.tokensIn, llmResult.tokensOut).toFixed(6),
        credits_used:   CREDITS_COST,
        question_preview: `Gotra Report: ${cleanGotra}`,
      });

      // Resolve target profile_id
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

      // Save report permanently
      if (targetProfileId) {
        const { error: saveErr } = await supabaseAdmin.from("saved_reports").insert({
          user_id:     user.id,
          profile_id:  targetProfileId,
          report_type: "gotra_report",
          content:     reportData,
        });
        if (saveErr) console.error("[GOTRA REPORT] Save error:", saveErr.message);
      }

      return NextResponse.json({ ...reportData, creditsRemaining: Math.max(0, credits - CREDITS_COST) });
    }

    // ── B2B mode: just return the generated report (no save, no credit deduction) ──
    return NextResponse.json(reportData);

  } catch (err: any) {
    console.error("[GOTRA REPORT] POST error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
