/**
 * Shared chat pipeline.
 *
 * Both /api/astro-chat (one-shot JSON) and /api/astro-chat/stream (SSE)
 * share the same pre-LLM setup: auth, credit check, gatekeeper, profile
 * lookup, chart build, prompt assembly, intent classification.
 *
 * This module extracts that setup into a single function so the two routes
 * stay in lockstep. Anything specific to one transport (JSON vs streaming)
 * stays in the route file.
 */

import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { buildClaudeContext, ASTRO_SYSTEM_PROMPT, detectTopic } from "@/lib/astrology/prompts";
import { buildPredictionContext } from "@/lib/astrology/prediction-engine";
import { gatekeeperCheck, classifyIntent, INTENT_TOKEN_BUDGETS, type ChatIntent } from "@/lib/astrology/llm-router";
import { getCurrentGochar } from "@/lib/astrology/gochar";
import { getRelevantScriptures } from "@/lib/astrology/rag";

// ── Service-role client — bypasses RLS for persistent chat saving ──
export const supabaseAdmin: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Pricing & credit constants ──────────────────────────────────────
export const PRICE: Record<string, { in: number; out: number }> = {
  "bedrock/us.anthropic.claude-sonnet-4-6": { in: 0.252,  out: 1.26  },
  "bedrock/claude-3-7-sonnet":               { in: 0.252,  out: 1.26  },
  "gemini/gemini-3.1-pro-preview":           { in: 0.105,  out: 0.42  },
  "gemini/gemini-3.1-flash-lite":            { in: 0.0063, out: 0.0063 },
};
export const ASTRO_CALL_COST_INR = 0.084;
export const CREDIT_VALUE_INR = 35.98; // ₹1,799 ÷ 50 credits
export const TIER_SIMPLE = 1;
export const TIER_SUBSTANTIVE = 2;

export function calcCostInr(model: string, tokIn: number, tokOut: number): number {
  const p = PRICE[model] || { in: 0.252, out: 1.26 };
  return (tokIn / 1000) * p.in + (tokOut / 1000) * p.out;
}

// ── Public types ────────────────────────────────────────────────────
export interface ChatHistoryEntry { role: "user" | "assistant"; content: string }

export interface ChatRequestBody {
  message?: string;
  profileId?: string;
  history?: ChatHistoryEntry[];
  lat?: number | string;
  lon?: number | string;
}

export type PipelineResult =
  | { kind: "error"; status: number; body: Record<string, unknown> }
  | { kind: "warning"; body: Record<string, unknown> }
  | { kind: "ready"; ctx: PreparedChatContext };

export interface PreparedChatContext {
  // identity
  user: { id: string; email: string | null };
  isAstroClient: boolean;
  profileId: string | undefined;

  // accounting
  credits: number;
  creditsToDeduct: number;
  intent: ChatIntent;
  maxTokens: number;

  // prompt + history
  fullSystemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
  message: string;

  // chart metadata for downstream logging / response
  chartConfidence: number;
  fromCache: boolean;

  // for persistence
  pName: string;
  history: ChatHistoryEntry[];

  // raw clients (so caller can update credits / save messages)
  supabase: SupabaseClient;
}

/**
 * Run all pre-LLM steps. Returns either a ready-to-call context, a
 * user-facing warning (out of credits / blocked by gatekeeper), or an error.
 */
export async function prepareChatRequest(body: ChatRequestBody): Promise<PipelineResult> {
  const { message, profileId, history, lat, lon } = body;
  if (!message?.trim()) {
    return { kind: "error", status: 400, body: { error: "Message is required" } };
  }

  // ── Auth ──────────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { kind: "error", status: 401, body: { error: "Unauthorized" } };
  }

  // ── Credits Check ────────────────────────────────────────────────
  const { data: userProfile } = await supabase
    .from("user_profiles").select("*").eq("id", user.id).single();
  const credits = userProfile?.credits ?? 0;
  if (credits <= 0) {
    return {
      kind: "warning",
      body: {
        systemWarning: "Your AI Credits are currently depleted. Please top up your credits for immediate access, or wait until your next billing cycle to continue your destiny reading.",
        creditsRemaining: 0,
      },
    };
  }

  // ── Gatekeeper ────────────────────────────────────────────────────
  const trimmed = message.trim().toLowerCase();
  const isShortReply = message.trim().length <= 20;
  const isAffirmative = ["yes","no","ok","okay","sure","go on","go ahead",
    "tell me","please","continue","more","yes please","absolutely",
    "of course","definitely","yeah","yep","yup","nope","tell me more",
    "what does it mean","explain","and","so","then","next",
  ].some(a => trimmed === a || trimmed.startsWith(a+" ") || trimmed.endsWith(" "+a));
  const hasPriorContext = !!(history && history.length > 0);

  if (!isShortReply && !isAffirmative) {
    const gate = await gatekeeperCheck(message);
    if (!gate.allowed) {
      return { kind: "warning", body: { systemWarning: gate.reason, creditsRemaining: credits } };
    }
  }

  // ── Resolve Birth Details ────────────────────────────────────────
  let dob: string | undefined, tob: string | undefined,
      pob: string | undefined, tz = "+05:30", pName = "User", gender = "Male";
  let isAstroClient = false;

  if (!profileId || profileId === "self") {
    const { data: fp } = await supabase
      .from("family_profiles").select("*")
      .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
    if (fp) {
      dob = fp.dob; tob = fp.tob; pob = fp.pob;
      tz  = fp.timezone || "+05:30";
      pName = fp.name || user.email?.split("@")[0] || "User";
      gender = fp.gender || "Male";
    } else {
      const { data: lead } = await supabase
        .from("onboarding_leads").select("*").ilike("email", user.email ?? "").maybeSingle();
      dob = lead?.dob; tob = lead?.tob; pob = lead?.pob;
      tz  = lead?.timezone || "+05:30";
      pName = lead?.name || user.email?.split("@")[0] || "User";
      gender = lead?.gender || "Male";
    }
  } else {
    let { data: fp } = await supabase
      .from("family_profiles").select("*").eq("id", profileId).maybeSingle();
    if (!fp) {
      const { data: astroClient } = await supabase
        .from("astrologer_clients").select("*").eq("id", profileId).maybeSingle();
      fp = astroClient;
      if (astroClient) isAstroClient = true;
    }
    dob = fp?.dob; tob = fp?.tob; pob = fp?.pob;
    tz  = fp?.timezone || "+05:30";
    pName = fp?.name || "Client/Member";
    gender = fp?.gender || "Male";
  }

  if (!dob || !tob || !pob) {
    return { kind: "error", status: 422, body: { error: "Birth details not found. Please complete your profile first." } };
  }

  // ── Build chart ──────────────────────────────────────────────────
  const { chart, fromCache } = await getOrBuildChart(
    dob, tob, pob, tz,
    lat ? Number(lat) : undefined,
    lon ? Number(lon) : undefined,
    user.email ?? undefined,
  );

  if (!chart.d1.ascendant) {
    return { kind: "error", status: 422, body: { error: "Chart generation failed — Lagna missing. Verify birth details.", confidence: chart.confidence } };
  }

  const REQUIRED = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const missing  = REQUIRED.filter(n => !chart.d1.planets.find(p => p.name.toLowerCase() === n.toLowerCase()));
  if (missing.length > 0) {
    return { kind: "error", status: 422, body: { error: `Chart incomplete — missing planets: ${missing.join(", ")}`, confidence: chart.confidence } };
  }

  // ── Build Grandmaster Context ────────────────────────────────────
  const jyotishTopic = detectTopic(message);
  const gocharSnapshot = getCurrentGochar();
  const chartContext = buildClaudeContext(chart, pName, jyotishTopic, gocharSnapshot);
  const predictionContext = buildPredictionContext(chart, jyotishTopic, message);
  const scripturalReferences = await getRelevantScriptures(message);

  const isFirstMessage = !history || history.length === 0;
  const namasteInstruction = isFirstMessage
    ? `\n\nIMPORTANT: This is ${pName}'s FIRST message. Begin your response with exactly: "Namaste ${pName} 🙏" on its own line, then answer.`
    : "";
  const turnFormatInstruction = isFirstMessage
    ? `\n\n[TURN TYPE: FIRST_MESSAGE] Use the full 4-section Grandmaster Output Format including "Section 1: A Bit About You".`
    : `\n\n[TURN TYPE: FOLLOW_UP] Skip Section 1 ("A Bit About You") entirely — the user already knows who they are. Open with a fresh, contextual one-sentence response to THIS specific question, then go straight to Section 2 (The Answer), Section 3 (Timing, only if relevant), and Section 4 (Notes). Do NOT reintroduce the user. Do NOT recap their personality.`;

  const recentOpenings: string[] = ((history || []) as ChatHistoryEntry[])
    .filter(h => h.role === "assistant")
    .slice(-3)
    .map(h => {
      const firstLine = (h.content || "").split("\n").map(l => l.trim()).find(l => l.length > 0) || "";
      return firstLine.slice(0, 160);
    })
    .filter(Boolean);
  const noRepeatRule = recentOpenings.length > 0
    ? `\n\n[ANTI-REPETITION GUARD]\nYou recently used these opening lines in this conversation:\n${recentOpenings.map((o, i) => `${i + 1}. "${o}"`).join("\n")}\nDO NOT reuse, rephrase, or paraphrase any of them. Write a fundamentally different opening sentence with a different rhythm, length, and angle.`
    : "";

  const genderContext = `\n[GENDER CONTEXT: The native is ${gender}. Adapt the Vedic astrological interpretations, relationship karakas, and timeline predictions accordingly.]\n`;

  const antiHallucinationInstruction = `
═══════════════════════════════════════════════════════════════
MANDATORY PREDICTION LAWS (ANTI-HALLUCINATION)
═══════════════════════════════════════════════════════════════
1. You MUST use the Scriptural References provided above if they exist. 
2. NEVER hallucinate or assume astrological rules. If a rule contradicts another, use your profound logical judgment as a Grand Master, but explicitly state your reasoning based on the provided texts.
3. Your predictions must be flawlessly accurate, citing solid proofs and logic from the provided texts and the verified chart data.`;

  const fullSystemPromptBase = `${ASTRO_SYSTEM_PROMPT}${namasteInstruction}${genderContext}

${predictionContext}

═══════════════════════════════════════════════════════════════
VERIFIED CHART DATA — ${pName} (${gender})
═══════════════════════════════════════════════════════════════
${chartContext}
═══════════════════════════════════════════════════════════════
${scripturalReferences}
${antiHallucinationInstruction}`;

  // ── Sentiment Detection ──────────────────────────────────────────
  const msgLower = message.toLowerCase();
  const recentHistory = (history || []).slice(-6).map(h => h.content).join(" ").toLowerCase();
  const combinedText = msgLower + " " + recentHistory;

  let sentimentInstruction = "";
  if (/died|death|passed away|lost my|grief|mourning|funeral|gone forever|he is gone|she is gone/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: GRIEF] The user is carrying the weight of loss or grief. Open with genuine human compassion — one sentence that acknowledges their pain before any chart data. The karmic reading must bring meaning and peace, not statistics. Use the Quantum Shift Protocol to show the soul-level significance of this moment. This is sacred ground.`;
  } else if (/baby|born|birth|delivered|son|daughter|newborn|child arrived|blessed/.test(combinedText) &&
             /sick|ill|hospital|icu|nicu|complication|difficult|worried/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: GRIEF/ANXIETY] The user is sharing news about a newborn with health complications. Lead with deep empathy before any astrological reading. Be gentle and human first, Grand Master Jyotishi second.`;
  } else if (/divorce|separated|breakup|broke up|left me|cheated|affair|heartbreak|he left|she left/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: GRIEF] The user is moving through the pain of separation or heartbreak. Acknowledge the emotional weight with genuine compassion before analysing the chart. Do not be clinical. Be the compassionate elder who sees the karmic meaning behind the pain. Apply Quantum Shift Protocol.`;
  } else if (/depressed|anxious|scared|terrified|hopeless|giving up|can't go on|suicidal|no hope|i'm afraid|what if|worried|panicking|i don't know what/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: ANXIETY/DISTRESS] The user is in a state of fear or anxiety. Open with a STABILIZING HAND — one sentence of certainty and grounding before the chart reading. Lead with what the chart CONFIRMS, not what it questions. If distress level is severe (suicidal/hopeless language), acknowledge their pain with warmth and close with: "The chart shows the energy; your choices shape the outcome. Please speak to a qualified professional immediately." Apply the Sensitive Topic Protocol.`;
  } else if (/does this even work|i don't believe|prove it|are you sure|is astrology real|test this|show me|i'm skeptical|i'm not sure about this|can you actually/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: SKEPTICISM] The user is doubting or testing. Do NOT respond with mysticism or persuasion. Open immediately with the most specific, verifiable data point in their chart (exact degree, nakshatra, a past event their Dasha confirms). Let the precision do the convincing. Earn trust with accuracy, not charisma.`;
  } else if (/hopeful|excited|can't wait|will it happen|is it coming|i feel like|i think this is my time|feels like something is changing|finally|so close/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: HOPE/EXCITEMENT] The user is riding a wave of hope or excitement. Match and elevate their energy. Validate the instinct first — if the chart confirms it, celebrate it with them. If the timing needs correcting, do it gently but honestly. Show them exactly which chart factor their feeling is coming from.`;
  } else if (/got the job|promotion|married|engaged|new house|achieved|succeeded|won|cleared|passed|just got|great news|amazing news|baby is born|child arrived/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: CELEBRATION] The user is sharing a victory or milestone. Celebrate genuinely with them before connecting it to the chart. Show how their chart always pointed to this exact moment — make them feel seen and confirmed.`;
  }

  const fullSystemPrompt =
    fullSystemPromptBase + turnFormatInstruction + sentimentInstruction + noRepeatRule;

  // ── Build message history (last 20 turns) ────────────────────────
  const messages = [
    ...((history || []) as ChatHistoryEntry[]).slice(-20),
    { role: "user" as const, content: message },
  ];

  // ── Credit tier ──────────────────────────────────────────────────
  const PREDICTION_TOPICS = ['marriage','spouse','partner','career','job','wealth','money',
    'finance','children','child','property','house','land','travel','abroad','foreign',
    'health','sick','illness','business','promotion','education','spiritual','legal',
    'court','debt','vehicle','sibling','parent','divorce','love','relationship','when will',
    'when do','will i','will i get','will i meet','will i have','when am i','my future'];
  const isSubstantivePrediction = message.trim().length > 25 &&
    PREDICTION_TOPICS.some(kw => msgLower.includes(kw));
  const creditsToDeduct = isSubstantivePrediction ? TIER_SUBSTANTIVE : TIER_SIMPLE;

  if (credits < creditsToDeduct) {
    return {
      kind: "error", status: 402,
      body: {
        error: credits < TIER_SIMPLE
          ? `You have ${credits} credit${credits === 1 ? '' : 's'} remaining. Please top up to continue.`
          : `This prediction costs 2 credits. You have ${credits} credit left — enough for a simple follow-up question only.`,
        creditsRemaining: credits,
      },
    };
  }

  // ── Intent classification → token budget ────────────────────────
  const intent: ChatIntent = await classifyIntent(message, hasPriorContext);
  const maxTokens: number = INTENT_TOKEN_BUDGETS[intent];
  console.log(`[CHAT] intent=${intent} → maxTokens=${maxTokens} | credits=${creditsToDeduct}`);

  return {
    kind: "ready",
    ctx: {
      user: { id: user.id, email: user.email ?? null },
      isAstroClient,
      profileId,
      credits,
      creditsToDeduct,
      intent,
      maxTokens,
      fullSystemPrompt,
      messages,
      message,
      chartConfidence: chart.confidence.score,
      fromCache,
      pName,
      history: (history || []) as ChatHistoryEntry[],
      supabase,
    },
  };
}

/**
 * After the LLM call completes (whether one-shot or streamed), perform the
 * common post-call work: deduct credits, log usage, persist messages.
 *
 * Returns the new credit balance.
 */
export async function finalizeChatRequest(opts: {
  ctx: PreparedChatContext;
  finalText: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
}): Promise<{ newCredits: number; costInr: number; persistProfileId: string | null }> {
  const { ctx, finalText, model, tokensIn, tokensOut } = opts;

  // Deduct credits
  const newCredits = Math.max(0, ctx.credits - ctx.creditsToDeduct);
  await ctx.supabase
    .from("user_profiles")
    .update({ credits: newCredits })
    .eq("id", ctx.user.id);

  const costInr = calcCostInr(model, tokensIn, tokensOut);

  // Fire-and-forget logs
  supabaseAdmin.from("token_usage_logs").insert({
    user_id:          ctx.user.id,
    model_name:       model,
    input_tokens:     tokensIn,
    output_tokens:    tokensOut,
    total_tokens:     tokensIn + tokensOut,
    cost_inr:         costInr.toFixed(6),
    credits_used:     ctx.creditsToDeduct,
    question_preview: ctx.message.slice(0, 100),
    usage_type:       ctx.isAstroClient ? 'astrologer' : 'user',
  });

  supabaseAdmin.from("astroapi_logs").insert({
    user_id:    ctx.user.id,
    endpoint:   "batch_chart",
    from_cache: ctx.fromCache,
    cost_inr:   ctx.fromCache ? 0 : ASTRO_CALL_COST_INR,
    usage_type: ctx.isAstroClient ? 'astrologer' : 'user',
  });

  // Persist messages
  let persistProfileId: string | null = null;
  if (!ctx.profileId || ctx.profileId === "self") {
    const { data: selfProfile } = await supabaseAdmin
      .from("family_profiles")
      .select("id")
      .eq("user_id", ctx.user.id)
      .eq("relationship", "Self")
      .maybeSingle();
    persistProfileId = selfProfile?.id ?? null;
  } else {
    persistProfileId = ctx.profileId;
  }

  if (persistProfileId) {
    const msgDataUser: Record<string, unknown> = { user_id: ctx.user.id, role: "user", content: ctx.message };
    const msgDataAsst: Record<string, unknown> = { user_id: ctx.user.id, role: "assistant", content: finalText };
    if (ctx.isAstroClient) {
      msgDataUser.astrologer_client_id = persistProfileId;
      msgDataAsst.astrologer_client_id = persistProfileId;
    } else {
      msgDataUser.profile_id = persistProfileId;
      msgDataAsst.profile_id = persistProfileId;
    }
    const { error: chatSaveErr } = await supabaseAdmin.from("chat_messages").insert([msgDataUser, msgDataAsst]);
    if (chatSaveErr) {
      console.error("[CHAT] ❌ Failed to save messages:", chatSaveErr.message);
    }
  } else {
    console.warn("[CHAT] ⚠️ No valid profileId — messages NOT saved.");
  }

  return { newCredits, costInr, persistProfileId };
}
