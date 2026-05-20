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
import { classifyGateDecision } from "@/lib/astrology/guardrails";
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
  // The decision logic lives in src/lib/astrology/guardrails.ts as a pure,
  // unit-tested helper. See:
  //   .kiro/specs/oracle-chat-guardrails-refinement/{requirements,design}.md
  //
  // Three outcomes:
  //   "skip"               — clearly on-topic personal / chart / continuation
  //                          message; the gatekeeper LLM is bypassed.
  //   "run"                — default; the gatekeeper LLM classifies it.
  //   "force_run_redflag"  — injection signature detected; the gatekeeper
  //                          LLM runs AND we apply a defensive override
  //                          below in case the gatekeeper misses it.
  const hasPriorContext = !!(history && history.length > 0);
  const gateDecision = classifyGateDecision(message, hasPriorContext);

  if (gateDecision.decision === "skip") {
    console.log(`[GATEKEEPER] skipped — reason=${gateDecision.reason}`);
  } else {
    if (gateDecision.decision === "force_run_redflag") {
      console.warn(`[GATEKEEPER] red-flag signature — running classifier defensively: ${message.slice(0, 120)}`);
    }
    const gate = await gatekeeperCheck(message);
    if (!gate.allowed) {
      return { kind: "warning", body: { systemWarning: gate.reason, creditsRemaining: credits } };
    }
    // Defensive override: if a red-flag signature was present but the
    // gatekeeper passed cleanly, refuse anyway. We assume the gatekeeper
    // either errored out or was tricked rather than truly cleared the
    // message. Property 1 of the spec: no-injection-bypass.
    if (gateDecision.decision === "force_run_redflag" && !gate.injectionDetected) {
      console.warn(`[GATEKEEPER] red-flag override → refusing: ${message.slice(0, 120)}`);
      return {
        kind: "warning",
        body: {
          systemWarning: "⚠️ This attempt has been flagged and logged. The Grand Master reads charts, not commands.",
          creditsRemaining: credits,
        },
      };
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

  // ── Sentiment & Intent Detection ──────────────────────────────────
  // Detects the user's emotional state and life context to inject a
  // hyper-personalized empathy instruction. The LLM uses this to open
  // like a wise, grounded friend — not a clinical report generator.
  const msgLower = message.toLowerCase();
  const recentHistory = (history || []).slice(-6).map(h => h.content).join(" ").toLowerCase();
  const combinedText = msgLower + " " + recentHistory;

  let sentimentInstruction = "";

  // ─── BEREAVEMENT / DEATH ───────────────────────────────────────────
  if (/died|death|passed away|lost my|grief|mourning|funeral|gone forever|he is gone|she is gone|no more|rip|rest in peace/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: BEREAVEMENT]
${pName} is carrying the weight of losing someone. This is sacred ground.

YOUR RESPONSE CONTRACT:
- Open like a friend who just heard the news. One sentence. Sit with it. Do not rush past it.
- Do NOT open with chart data. Do NOT open with "the chart shows..." or any analytical framing.
- After acknowledging their loss (1-2 sentences max), gently connect to what the chart reveals about this soul-level transition — the karmic meaning, the Dasha context, the clearing that follows.
- Use the Quantum Shift Protocol to show that this pain has a purpose visible in the chart architecture.
- Tone: quiet, steady, warm. Like a friend who puts their hand on your shoulder and says nothing for a moment before speaking.
- Close with something grounding and forward-looking — not a platitude, but a specific chart-based insight about what opens next.`;

  // ─── SEPARATION / HEARTBREAK / INFIDELITY ─────────────────────────
  } else if (/divorce|separated|breakup|broke up|left me|cheated|affair|heartbreak|he left|she left|betrayed|unfaithful|walked out|moved out|filing|custody|alimony/.test(combinedText)) {
    const isRelief = /finally|free|relieved|glad|better off|toxic|abusive|needed to leave|i left/.test(combinedText);
    sentimentInstruction = isRelief
      ? `\n\n[EMOTIONAL STATE: LIBERATION AFTER SEPARATION]
${pName} has left or ended a relationship and feels relief or freedom. This is not grief — this is reclamation.

YOUR RESPONSE CONTRACT:
- Open by validating their courage. One sentence that says "you did the hard thing."
- Then show them exactly WHY the chart confirms this was the right move — cite the 7th house, DK, UL, or Venus condition that made this relationship karmically complete.
- Show what opens next: the Dasha window, the transit trigger for the next chapter.
- Tone: warm, celebratory but grounded. Like a friend saying "I'm proud of you. Now let me show you what's coming."`
      : `\n\n[EMOTIONAL STATE: HEARTBREAK / SEPARATION]
${pName} is moving through the raw pain of a breakup, divorce, or betrayal. Their world has shifted.

YOUR RESPONSE CONTRACT:
- Open like a friend who has been through it too. One sentence that names what they are feeling without clinical labels. Not "I detect grief" — more like "I know this feels like the ground opened up."
- Do NOT minimize. Do NOT rush to silver linings. Sit with the weight for one beat.
- Then — and only then — show the karmic architecture: WHY this happened (7th lord, DK, UL, Venus/Mars condition, D9 data). Make the pain meaningful, not random.
- Apply Quantum Shift Protocol: show the exact Dasha end-date of this difficult period and what the chart promises after.
- If infidelity is mentioned: do not moralize about the other person. Focus entirely on ${pName}'s chart and their path forward.
- Tone: the compassionate elder who has seen a thousand charts and knows this specific pain has a specific expiry date.`;

  // ─── NEWBORN WITH COMPLICATIONS ────────────────────────────────────
  } else if (/baby|born|birth|delivered|son|daughter|newborn|child arrived|blessed/.test(combinedText) &&
             /sick|ill|hospital|icu|nicu|complication|difficult|worried|premature|surgery/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: PARENTAL FEAR — NEWBORN HEALTH]
${pName} has a newborn with health complications. This is one of the most vulnerable moments a parent can face.

YOUR RESPONSE CONTRACT:
- Open with one sentence of genuine human warmth. Acknowledge the fear without amplifying it.
- Be gentle and human FIRST. Chart data second.
- When you do read the chart (D7, PK, 5th house, child's potential Dasha if inferable), frame it with care — lead with what is STRONG and protective in the chart before addressing challenges.
- Close with a grounding statement about timing of recovery if the chart supports it.
- Tone: the steady, warm voice of someone who has seen many charts and can offer real reassurance grounded in data.`;

  // ─── CELEBRATION / VICTORY / MILESTONE ─────────────────────────────
  } else if (/got the job|promotion|married|engaged|new house|new car|achieved|succeeded|won|cleared|passed|just got|great news|amazing news|baby is born|child arrived|pregnant|expecting|accepted|admitted|visa approved|moved abroad/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: CELEBRATION]
${pName} is sharing a victory, milestone, or joyful life event. They are on a high.

YOUR RESPONSE CONTRACT:
- Open by celebrating WITH them. Not "congratulations" in a corporate way — more like a friend who is genuinely happy for them. One sentence that matches their energy.
- Then show them exactly WHY this happened NOW — which Dasha activated, which transit fired, which house delivered. Make them feel like the universe was always building toward this exact moment.
- If they ask "what's next?" — ride the momentum. Show the next window with the same energy.
- Tone: warm, present, genuinely happy for them. Then grounded and specific. Like a friend at a celebration who also happens to know their entire karmic blueprint.`;

  // ─── SEVERE DISTRESS / SUICIDAL / HOPELESS ─────────────────────────
  } else if (/suicidal|kill myself|end it all|no point|can't go on|want to die|giving up|no hope|hopeless|worthless|i'm done|nothing left/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: SEVERE DISTRESS — CRISIS LEVEL]
${pName} is expressing severe emotional distress or hopelessness. Handle with extreme care.

YOUR RESPONSE CONTRACT:
- Open with ONE sentence of absolute human presence. Not clinical. Not distant. Something like: "I hear you. And I need you to stay."
- Acknowledge their pain is real. Do not dismiss it. Do not rush to chart data.
- Then — gently — show what the chart reveals about this period: it is a TRANSIT. It has a start date and an end date. Name both. Show the Dasha architecture that explains why NOW feels this heavy.
- Apply Quantum Shift Protocol with extra care — show what opens after this period ends.
- MANDATORY CLOSE: "The chart shows the energy; your choices shape the outcome. Please reach out to a crisis helpline or a trusted person right now. You matter beyond what any chart can measure."
- Tone: the steadiest, warmest version of yourself. Like a friend who will not let go of your hand.`;

  // ─── ANXIETY / FEAR / WORRY ────────────────────────────────────────
  } else if (/depressed|anxious|scared|terrified|hopeless|afraid|what if|worried|panicking|i don't know what|overwhelmed|stressed|can't sleep|restless|nervous|uncertain|confused about my life|lost|stuck|trapped/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: ANXIETY / FEAR]
${pName} is in a state of fear, anxiety, or feeling stuck/lost. They need grounding before guidance.

YOUR RESPONSE CONTRACT:
- Open with a STABILIZING sentence. Not "don't worry" (dismissive). Something that says: "I see what you're carrying. Let me show you what the chart actually says — because it's more specific than the fear."
- Lead with what the chart CONFIRMS and STABILIZES — not what it questions. Ground them in certainty first.
- Then address the specific fear with precision: name the Dasha, the transit, the exact window. Fear shrinks when it has a timeline.
- Show the exit point: when does this anxious period end? What activates next?
- Tone: steady, calm, certain. Like a friend who has already read the ending and knows it works out — and is now walking you through the middle.`;

  // ─── ANGER / FRUSTRATION / INJUSTICE ───────────────────────────────
  } else if (/angry|furious|unfair|injustice|why me|frustrated|sick of|tired of|had enough|betrayed|screwed over|cheated out|robbed|stolen|corrupt|rigged/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: ANGER / FRUSTRATION]
${pName} is feeling anger, frustration, or a sense of injustice. They feel wronged by life or by people.

YOUR RESPONSE CONTRACT:
- Open by validating the anger without feeding it. One sentence that says "yeah, that IS unfair" or "I get why you're burning right now" — then pivot to the chart.
- Do NOT moralize. Do NOT tell them to "let go" or "forgive." That is not your job.
- Show the karmic architecture: WHY this pattern exists in their chart (6th house, Saturn, Rahu, GK). Make it make sense — not as punishment, but as a specific karmic pattern with a specific resolution window.
- Show the power move: what does the chart say they should DO with this energy? Mars placement, 3rd house, courage indicators.
- Tone: match their intensity briefly, then channel it. Like a friend who says "I hear you. Now let me show you how to use this."`;

  // ─── SKEPTICISM / TESTING ──────────────────────────────────────────
  } else if (/does this even work|i don't believe|prove it|are you sure|is astrology real|test this|show me|i'm skeptical|i'm not sure about this|can you actually|is this legit|fake|scam|bs|bullshit/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: SKEPTICISM]
${pName} is doubting, testing, or challenging the system. They want proof, not persuasion.

YOUR RESPONSE CONTRACT:
- Do NOT respond with mysticism, philosophy, or defensiveness. Zero persuasion.
- Open IMMEDIATELY with the most specific, verifiable data point in their chart — something they can check against their own life. An exact degree, a nakshatra characteristic, a past event their Dasha timeline confirms.
- Let the precision do the convincing. If the chart is accurate, it speaks for itself.
- Tone: confident, unbothered, precise. Like a surgeon who doesn't argue about whether surgery works — they just show you the scan.`;

  // ─── HOPE / EXCITEMENT / ANTICIPATION ──────────────────────────────
  } else if (/hopeful|excited|can't wait|will it happen|is it coming|i feel like|i think this is my time|feels like something is changing|finally|so close|i have a feeling|something good|turning point|new beginning/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: HOPE / ANTICIPATION]
${pName} is riding a wave of hope or sensing a shift. They feel something is coming.

YOUR RESPONSE CONTRACT:
- Open by validating the instinct. "That feeling? It's not random." Then show them exactly where in the chart it's coming from.
- If the chart confirms their timing — celebrate it. Be specific about WHEN and WHAT.
- If the chart says "not yet, but soon" — correct the timing gently but honestly. Don't crush the hope; redirect it to the accurate window.
- Tone: match their energy. Elevate it with specifics. Like a friend who says "you're right to feel this — and here's exactly why."`;

  // ─── LONELINESS / ISOLATION ────────────────────────────────────────
  } else if (/lonely|alone|no one|nobody|isolated|no friends|no one understands|feel alone|by myself|single for years|will i ever find|am i meant to be alone/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: LONELINESS]
${pName} is feeling isolated, unseen, or questioning whether connection will come. This is a tender place.

YOUR RESPONSE CONTRACT:
- Open with warmth that says "I see you" without being patronizing. One sentence that acknowledges the ache of feeling unseen.
- Then show the chart architecture for connection: 7th house, Venus, DK, UL, A7 — what does the chart PROMISE about partnership and belonging?
- Give a specific timeline if the Dasha supports it. Loneliness shrinks when it has an expiry date.
- Tone: gentle, warm, specific. Like a friend who says "you're not meant to be alone — and I can show you exactly when that changes."`;

  // ─── FINANCIAL STRESS / DEBT / POVERTY ─────────────────────────────
  } else if (/broke|bankrupt|debt|can't pay|no money|financial crisis|losing everything|poverty|struggling financially|bills|loan|emi|defaulting/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: FINANCIAL DISTRESS]
${pName} is under financial pressure — debt, loss, or the fear of not being able to provide. Money stress hits identity.

YOUR RESPONSE CONTRACT:
- Open by acknowledging that financial pressure is one of the heaviest things to carry — without being dramatic about it. One grounding sentence.
- Then go straight to the chart: 2nd house, 11th house, A2, A11, Jupiter, Dhana Yogas. What does the wealth architecture actually look like?
- Show the TIMING: when does the financial pressure lift? Which Dasha/transit opens the income channel?
- If the chart shows strong wealth potential that hasn't activated yet — say so clearly. Give them something concrete to hold onto.
- Tone: steady, practical, hopeful-but-honest. Like a friend who is also good with money and can see the bigger picture.`;

  // ─── HEALTH CRISIS / ILLNESS ───────────────────────────────────────
  } else if (/diagnosed|cancer|tumor|surgery|hospital|chronic|disease|illness|sick|health crisis|doctor said|terminal|chemo|treatment|disability|accident|injured/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: HEALTH CRISIS]
${pName} is facing a health challenge — diagnosis, treatment, or recovery. The body is vulnerable and so is the mind.

YOUR RESPONSE CONTRACT:
- Open with one sentence of genuine human care. Not "I'm sorry to hear that" (generic). Something that acknowledges the specific weight of what they shared.
- Read the health indicators: Lagna lord, 6th/8th house, Pranapada Lagna, relevant planet dignity. Lead with what is STRONG and protective before addressing the challenge.
- Show timing: when does the difficult health transit end? What recovery window does the chart indicate?
- MANDATORY: "The chart shows the energy pattern; your medical team guides the treatment. Trust both."
- Tone: warm, steady, careful. Like a friend who visits you in the hospital and brings both comfort and clarity.`;

  // ─── CONFUSION / EXISTENTIAL / "WHAT IS MY PURPOSE" ────────────────
  } else if (/what is my purpose|why am i here|what should i do with my life|i feel lost|no direction|confused about everything|existential|meaning of life|soul purpose|what am i meant to do/.test(combinedText)) {
    sentimentInstruction = `\n\n[EMOTIONAL STATE: EXISTENTIAL SEARCHING]
${pName} is asking the big questions — purpose, direction, meaning. They feel unmoored.

YOUR RESPONSE CONTRACT:
- Open by normalizing the question without dismissing it. Something like: "This question usually surfaces when the soul is ready for the answer."
- Go straight to the chart's purpose architecture: AK (Atmakaraka), 9th house, 10th house, D20, Karakamsa. Show them their soul's actual assignment in this life — specific, not generic.
- Make it feel like a revelation, not a lecture. They should finish reading and think "THAT is what I'm here for."
- Tone: wise, grounded, slightly awed by what the chart reveals. Like a friend who has been waiting for you to ask this question.`;

  // ─── DEFAULT: NEUTRAL / ROUTINE QUESTION ───────────────────────────
  } else {
    // No strong emotional signal detected — use standard conversational warmth
    sentimentInstruction = `\n\n[EMOTIONAL STATE: NEUTRAL — STANDARD CONVERSATIONAL WARMTH]
No extreme emotional signal detected. Respond with your natural warmth and directness.

YOUR RESPONSE CONTRACT:
- Open with a fresh, contextual sentence that speaks directly to what ${pName} asked. No preamble, no throat-clearing.
- Be conversational. Be specific. Be the friend who happens to know their entire chart.
- Match the energy of their question: casual question gets a casual-but-precise answer. Serious question gets weight and depth.
- Every response should feel like a text from a brilliant friend, not a report from a system.`;
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
    feature:          'chat',
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
