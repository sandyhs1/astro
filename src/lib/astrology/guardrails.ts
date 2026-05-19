/**
 * GUARDRAILS — pre-LLM heuristic decision layer for Oracle Chat.
 *
 * This module is the FIRST of three guardrail layers:
 *   L1 — guardrails.ts (this file): cheap regex / set lookup, decides whether
 *        the gatekeeper LLM needs to run at all.
 *   L2 — llm-router.ts → gatekeeperCheck(): Gemini Flash Lite classifier.
 *   L3 — prompts.ts → ASTRO_SYSTEM_PROMPT: SCOPE LOCK, PROMPT INJECTION
 *        IMMUNITY, IDENTITY LOCK, LIFE-MEANING RUBRIC inside the main LLM call.
 *
 * Design principle:
 *   "A question is on-topic if its answer would be different for a different
 *    birth chart. It is off-topic if the answer is the same regardless of who
 *    is asking."
 *
 * This file is PURE — no I/O, no LLM calls, no Next.js cookies, no Supabase.
 * That keeps it unit-testable in milliseconds.
 *
 * See:  .kiro/specs/oracle-chat-guardrails-refinement/{requirements,design}.md
 */

// ─── Layer 1A: Red-flag injection signatures ──────────────────────────────
//
// Any message matching this regex MUST run the gatekeeper, regardless of
// length, history, or other characteristics. Skip paths can never short-
// circuit a red-flag message. Property 1 (No-injection-bypass).
//
// Kept verbatim from the previous implementation — proven to catch every
// known injection pattern observed in production logs.
export const RED_FLAG_RE =
  /\b(ignore (?:all |the |your |my )?(?:previous|prior|above)|forget (?:everything|all|prior|previous|above|the following)|disregard (?:all |the |your |my )?(?:previous|prior|above)|system prompt|jailbreak|dan mode|sudo mode|developer mode|new instructions? for you|reveal your prompt|print your (?:system|prompt|instructions)|i am your developer|i am from anthropic|i am from google|engineering team|act as (?:a )?(?:different|new)|roleplay as|pretend to be (?:a |an )?(?!.*(?:husband|wife|spouse|partner|child|parent))[a-z]{3,}|override (?:your |the )?(?:rules|prompt|code))\b/i;

// ─── Layer 1B: Continuation phrases (exact match) ─────────────────────────
//
// Users naturally type these when an answer was truncated and they want the
// model to keep going. With prior conversation history present and no red
// flag, we skip the gatekeeper entirely so continuation feels seamless and
// doesn't pay 200ms+ of LLM-classifier latency.
//
// Property 4 (No-continuation-block). Property 6 forbids using this set
// when there is no history.
export const CONTINUATION_PHRASES: ReadonlySet<string> = new Set([
  // affirmations
  "yes", "no", "ok", "okay", "sure", "yeah", "yep", "yup", "nope",
  "absolutely", "of course", "definitely", "mhm", "right", "got it",
  // proceed cues
  "go", "go on", "go ahead", "proceed",
  "continue", "please continue", "keep going", "keep on", "carry on",
  // more / next
  "more", "tell me more", "what else", "what next", "next", "next part",
  // finish / complete
  "finish", "finish it", "complete", "complete it",
  // don't stop
  "don't stop", "dont stop", "why did you stop", "why stop", "you stopped",
  "is that all",
  // conjunctional follow-ups
  "and", "and?", "and then?", "so", "so?", "then", "then?",
  // explanation requests
  "what does it mean", "explain", "tell me", "tell me about it",
  // casual short replies
  "please", "yes please",
]);

// ─── Layer 1C: Personal anchor + chart reference + life-meaning theme ─────

/**
 * Personal anchor: the user is talking about themselves.
 * `\bi\b` matches the standalone pronoun "I" (case-insensitive). Common
 * contractions are listed explicitly because `\b` does not split on `'`.
 */
export const PERSONAL_ANCHOR_RE =
  /\b(my|mine|myself|i|i'?m|i'?ve|i'?ll|i'?d|me|us|our|we)\b/i;

/**
 * Explicit chart reference: the answer is mechanically chart-bound.
 * If any of these words appear, the question MUST go through the main LLM.
 */
export const CHART_REF_RE =
  /\b(chart|kundli|kundali|kundlis|horoscope|birth ?chart|natal|placement|placements|dasha|dasa|antardasha|mahadasha|nakshatra|rashi|lagna|ascendant|moon sign|sun sign|rising sign|jupiter|saturn|mars|venus|mercury|rahu|ketu|atmakaraka|amatyakaraka|darakaraka|navamsa|navamsha|d1|d9|d10|d12|d20|d24|d27|d30|d40|d45|d60|jyotish|astro|yoga|dosha|sade ?sati)\b/i;

/**
 * Life-meaning theme: existential / spiritual concepts that ARE within scope
 * when paired with a personal anchor. Without an anchor these would be
 * abstract and out-of-scope — the heuristic combines anchor + theme.
 */
export const LIFE_MEANING_RE =
  /\b(karma|karmic|dharma|dharmic|moksha|soul|fate|destiny|purpose|meaning|past life|past lives|past-life|spiritual|spirituality|religion|religious|faith|prayer|prayers|god|deity|divine|grace|blessing|blessed|cursed|curse|sin|sins|punishment|punish|punishing|tested|testing|test me|tests me|suffering|suffer|prarabdha|sanchita|agami|reincarnation|rebirth|liberation|enlightenment|awakening|guru|mantra|ishta|ishta-devata|hinduism|buddhism|islam|christianity|jain|sikh)\b/i;

/**
 * Life-area theme: concrete life-event topics that are clearly chart questions
 * when paired with a personal anchor. "When will I get married" mentions no
 * "chart" word but is unambiguously a chart-prediction request.
 */
export const LIFE_AREA_RE =
  /\b(marriage|marry|married|spouse|partner|husband|wife|love|relationship|breakup|divorce|career|job|profession|business|promotion|salary|money|wealth|finance|finances|rich|poor|debt|child|children|baby|pregnan|son|daughter|education|exam|degree|study|abroad|foreign|travel|migrate|migration|health|illness|disease|surgery|hospital|death|accident|legal|court|lawsuit|property|house|home|land|vehicle|car|future|next year|this year|when will|when am i|when do i|when is)\b/i;

// ─── Layer 1D: Hard off-topic regex ───────────────────────────────────────
//
// Pure non-chart topics. Even with a personal anchor, these are almost
// always abuse — "give me my python code" is not a chart question. The
// heuristic forces the gatekeeper to run on these (it does NOT auto-refuse
// here; the gatekeeper LLM is more nuanced and can spot the rare false
// positive). Property 5 (Hard-off-topic-still-refused).
//
// REMOVED from this list compared to the prior version (per spec R4.1):
// `god`, `religion`, `caste`, `alcohol`, `drugs`, `education system`,
// `university`, `college`, `weather`, `temperature`. Those have legitimate
// chart contexts and the gatekeeper LLM handles them better than a regex.
export const OFF_TOPIC_HARD_RE =
  /\b(recipe|how to cook|football score|cricket score|election result|news headline|tell me a joke|write me a poem|song lyrics|movie review|netflix|stock price|crypto price|bitcoin price|nifty(?: price)?|sensex(?: price)?|python (?:code|function|script)|javascript (?:code|function)|sql (?:query|injection)|hack |malware|porn|weather forecast|temperature today)\b/i;

// ─── Decision API ─────────────────────────────────────────────────────────

export type GateDecision = "skip" | "run" | "force_run_redflag";

export interface GateClassification {
  decision: GateDecision;
  /** Short reason tag, used for audit logging and tests. */
  reason:
    | "redflag"
    | "continuation"
    | "personal_anchor"
    | "chart_reference"
    | "short_followup"
    | "hard_off_topic"
    | "default";
}

/**
 * Decide whether the gatekeeper LLM needs to run for this message.
 *
 * Decision order (first match wins):
 *   1. Empty / whitespace-only → "run" (defensive; the caller should have
 *      already rejected, but be safe).
 *   2. RED_FLAG_RE → "force_run_redflag" — gatekeeper runs, plus the
 *      caller's defensive override refuses on uncertainty.
 *   3. CONTINUATION_PHRASES exact match + hasHistory → "skip".
 *   4. ≤30 chars + hasHistory → "skip" (catches natural variants like
 *      "why did you stop").
 *   5. CHART_REF_RE → "skip" — chart-mechanical questions always allowed.
 *   6. PERSONAL_ANCHOR_RE + LIFE_MEANING_RE → "skip" — personal existential
 *      questions are the heart of Vedic chart reading.
 *   7. OFF_TOPIC_HARD_RE → "run" — likely abuse, gatekeeper decides.
 *   8. otherwise → "run" — default, safe-by-design.
 *
 * Property 6 (First-message-always-checked): when hasHistory is false,
 * rules 3 and 4 SHALL NOT apply. The very first message a user sends
 * always reaches L2 or L3.
 */
export function classifyGateDecision(
  message: string,
  hasHistory: boolean,
): GateClassification {
  const raw = (message ?? "").trim();
  if (!raw) {
    return { decision: "run", reason: "default" };
  }

  // 2. Red flag — never skip on injection signatures.
  if (RED_FLAG_RE.test(message)) {
    return { decision: "force_run_redflag", reason: "redflag" };
  }

  const lower = raw.toLowerCase();

  // 3. Pure continuation — exact match against the curated set.
  if (hasHistory && CONTINUATION_PHRASES.has(lower)) {
    return { decision: "skip", reason: "continuation" };
  }

  // 4. Short follow-up — covers natural variants like "why did you stop".
  if (hasHistory && raw.length <= 30) {
    return { decision: "skip", reason: "short_followup" };
  }

  // 5. Explicit chart reference — always on-topic.
  if (CHART_REF_RE.test(message)) {
    return { decision: "skip", reason: "chart_reference" };
  }

  // 6. Personal anchor + life-meaning OR life-area theme — on-topic.
  if (
    PERSONAL_ANCHOR_RE.test(message) &&
    (LIFE_MEANING_RE.test(message) || LIFE_AREA_RE.test(message))
  ) {
    return { decision: "skip", reason: "personal_anchor" };
  }

  // 7. Hard off-topic — likely abuse.
  if (OFF_TOPIC_HARD_RE.test(message)) {
    return { decision: "run", reason: "hard_off_topic" };
  }

  // 8. Default — let the gatekeeper LLM decide.
  return { decision: "run", reason: "default" };
}
