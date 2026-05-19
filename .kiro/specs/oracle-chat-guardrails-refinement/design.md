# Design Document

## Overview

This refinement reshapes the three-layer guardrail stack so legitimate personal / chart-anchored questions flow through, while abstract abuse and prompt injection remain blocked. No layers are added or removed. Each existing layer is sharpened with a clear responsibility:

| Layer | File | New responsibility |
|---|---|---|
| **L1 — Heuristic skip / pre-flag** | `src/lib/astrology/chat-pipeline.ts` | Decide cheaply whether to call the gatekeeper at all. Now allows continuation messages and personal-anchored messages without LLM cost. |
| **L2 — Gatekeeper LLM** | `src/lib/astrology/llm-router.ts` | Final on-topic / injection classifier. Prompt rewritten with explicit personal-anchor rule and rich examples. |
| **L3 — System prompt** | `src/lib/astrology/prompts.ts` | Tells the main LLM how to answer existential / life-meaning questions chart-first. |

The guiding principle stays:

> A question is on-topic if its answer would be different for a different birth chart. It is off-topic if the answer is the same regardless of who is asking.

## Architecture

```
User message
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│ L1 — Heuristic skip (chat-pipeline.ts)                   │
│  1. RED_FLAG_RE  → injection? force gatekeeper           │
│  2. continuation set + length≤30 + history → SKIP gate   │
│  3. personal-anchor + life-meaning OR chart-ref → SKIP   │
│  4. OFF_TOPIC_HARD_RE  (slim)  → force gatekeeper        │
│  5. otherwise → run gatekeeper                           │
└──────────────────────────────────────────────────────────┘
    │ (skip path)         │ (run path)
    │                     ▼
    │              ┌──────────────────────────┐
    │              │ L2 — Gatekeeper LLM      │
    │              │  Flash Lite, JSON mode   │
    │              │  Personal-anchor rule    │
    │              │  Heuristic fallback      │
    │              └──────────────────────────┘
    │                     │ allow         │ refuse
    │                     │               ▼
    │                     │           Return refusal
    └─────────────────────┴────────────────┐
                                           ▼
                                ┌──────────────────────────┐
                                │ L3 — Main LLM            │
                                │  ASTRO_SYSTEM_PROMPT     │
                                │  + SCOPE LOCK            │
                                │  + LIFE-MEANING RUBRIC   │
                                │    (NEW — chart-first)   │
                                └──────────────────────────┘
                                           │
                                           ▼
                                       Reply
```

## Components and Interfaces

### L1 — Heuristic skip (`chat-pipeline.ts`)

Replaces the current `canSkipGate` block. Order matters; first match wins.

```ts
// 0. RED FLAG — never skip on injection signature.
const RED_FLAG_RE = /…/i;          // unchanged
if (RED_FLAG_RE.test(message)) {
  // run gatekeeper, then defensive override
}

// 1. CONTINUATION — skip gatekeeper for natural follow-ups.
const CONTINUATION_PHRASES = new Set([
  "yes","no","ok","okay","sure","yeah","yep","yup","nope",
  "go","go on","go ahead","proceed","mhm","right","got it","and","so","then","next",
  "continue","please continue","keep going","keep on","carry on",
  "more","tell me more","what else","what next","next part",
  "finish","finish it","complete","complete it",
  "don't stop","dont stop","why did you stop","why stop","you stopped",
  "is that all","and?","and then?","then?","so?",
  "what does it mean","explain","tell me",
]);
const isPureContinuation = CONTINUATION_PHRASES.has(trimmed);
const isShortFollowUp    = trimmedRaw.length <= 30 && hasPriorContext;

if (hasPriorContext && (isPureContinuation || isShortFollowUp) && !looksRedFlag) {
  // SKIP gatekeeper. Mark gateSkipped=true for audit.
}

// 2. PERSONAL-ANCHOR FAST PATH — skip gatekeeper for clearly chart-related msgs.
const PERSONAL_ANCHOR_RE = /\b(my|mine|myself|i|i'?m|i'?ve|i'?ll|me)\b/i;
const CHART_REF_RE       = /\b(chart|kundli|kundali|horoscope|birth ?chart|natal|placement|placements|dasha|nakshatra|lagna|ascendant|moon sign|sun sign|rising sign|jupiter|saturn|mars|venus|mercury|rahu|ketu|atmakaraka|navamsa|d1|d9|d10|jyotish|astro)\b/i;
const LIFE_MEANING_RE    = /\b(karma|karmic|dharma|dharmic|moksha|soul|fate|destiny|purpose|meaning of (?:life|my life)|past life|past lives|spiritual|spirituality|sin|punishment|punish|suffering|suffer|grace|blessing|blessed|cursed|curse|mantra|deity|ishta|guru|prarabdha|sanchita|agami|reincarnation|rebirth|liberation|enlightenment|awakening|faith|prayer|prayers)\b/i;

const hasAnchor   = PERSONAL_ANCHOR_RE.test(message) || CHART_REF_RE.test(message);
const hasMeaning  = LIFE_MEANING_RE.test(message);
const isPersonalLifeQuestion = hasAnchor && (hasMeaning || CHART_REF_RE.test(message));

if (isPersonalLifeQuestion && !looksRedFlag) {
  // SKIP gatekeeper. Mark gateSkipped=true.
}

// 3. HARD OFF-TOPIC — force gatekeeper.
const OFF_TOPIC_HARD_RE = /\b(recipe|how to cook|football score|cricket score|election result|prime minister|news headline|tell me a joke|write me a poem|song lyrics|movie review|netflix|stock price|crypto price|bitcoin price|nifty|sensex|python (?:code|function|script)|javascript (?:code|function)|sql (?:query|injection)|hack|malware|porn|weather forecast|temperature today)\b/i;
const looksHardOffTopic = OFF_TOPIC_HARD_RE.test(message);

// 4. DEFAULT — run gatekeeper (covers everything not skipped above).
const gate = await gatekeeperCheck(message);
```

**Removed from `OFF_TOPIC_SEED_RE`:** `god`, `religion`, `caste`, `alcohol`, `drugs`, `education system`, `university`, `college`, `weather`, `temperature`. These have legitimate chart contexts and the gatekeeper LLM can handle borderline cases far better than a regex.

**Audit logging:** every skip path emits `console.log("[GATEKEEPER] skipped — reason=continuation|personal_anchor")`.

### L2 — Gatekeeper LLM (`llm-router.ts`)

The `gatekeeperCheck` function gets a rewritten prompt that codifies the personal-anchor rule and gives the model rich allow / refuse examples. Function signature is unchanged.

Key prompt additions:

```
RULE: A message is ON-TOPIC if (a) it mentions THIS user's chart, OR
(b) it uses "my / I / me / mine" with a life-meaning theme (karma, dharma,
soul, suffering, fate, purpose, religion as personal experience).

A message is OFF-TOPIC only if its answer would be the same for any user
(textbook definitions, recipes, code, news, sports, weather forecasts).

ALLOW these:
  - "Why is my karma so bad?"          (personal + life-meaning)
  - "What is my karma in this life?"   (personal + life-meaning)
  - "Is god punishing me for past lives?"  (personal experience of god)
  - "Will my faith help me through this dasha?"  (personal + chart)
  - "Should I avoid alcohol based on my chart?"  (chart anchor)
  - "Tell me about Hinduism and my chart"  (chart anchor present)

REFUSE these:
  - "What is karma?"     (no my, no chart)
  - "What is god?"       (no anchor)
  - "Tell me about Hinduism" (no anchor)
  - "What is the meaning of life?" (abstract)
  - "How do I cook biryani?"
  - "Latest cricket score?"
```

The heuristic fallback (when Flash classifier errors) drops the over-broad `HARD_OFFTOPIC` regex and keeps only `HARD_INJECT` plus a slim list mirroring `OFF_TOPIC_HARD_RE`. On uncertainty, fail open — better to let one borderline message through than block grief-stricken users.

### L3 — System prompt (`prompts.ts`)

The existing `SCOPE LOCK` block stays. A new block — `LIFE-MEANING RUBRIC` — is inserted right after `SCOPE LOCK` to instruct the main LLM how to answer existential questions chart-first.

```
════════════════════════════════════════
LIFE-MEANING RUBRIC — CHART-FIRST EXISTENTIAL ANSWERS
════════════════════════════════════════

When a user asks about their own karma, dharma, soul, suffering, faith,
religion, or purpose — you MUST anchor the answer to their actual chart.
Generic philosophy or theology is forbidden.

Required anchors by topic:

KARMA / "why is my karma so bad?":
  - Atmakaraka and its placement
  - Current Mahadasha + Antardasha lord condition
  - 8th house and its lord (karmic baggage)
  - 12th house and its lord (loss / dissolution)
  - Saturn (Sade Sati, return, transit pressure)
  - Rahu / Ketu axis (unfinished karma)

DHARMA / "what is my soul's purpose?":
  - Atmakaraka
  - 9th house and its lord (dharma)
  - 10th house and its lord (visible dharma in this life)
  - Karakamsa Lagna (D9 sign holding the AK)
  - Ishta Devata indicators

SUFFERING / "why am I suffering?":
  - D30 (Trimsamsa)
  - 6th, 8th, 12th houses
  - Dasha lord condition
  - Malefic transits over natal points

FAITH / RELIGION / "is god punishing me?":
  - 9th house (faith, guru, divine grace)
  - Jupiter placement and dignity
  - Ketu placement (spiritual liberation channel)
  - Atmakaraka in D9 (Karakamsa)

If the user mentions a religion or deity not represented in the chart
context, answer ONLY in terms of how their chart speaks to that question
(e.g., "Your 9th lord Jupiter in Pisces shows your soul gravitates toward
devotional traditions — that's where your faith will hold."). Do NOT
preach, validate, or invalidate any tradition.

If the chart truly does not contain the answer, say so precisely and
offer the closest chart-anchored angle. Never default to abstract advice.
```

This block is the chart-first answer template. Voice Lock and Data Integrity laws still govern HOW it's written.

### L4 (new) — Test fixture

A single TS test file `src/lib/astrology/__tests__/guardrails.spec.ts` exercises L1 directly without making LLM calls. The heuristic decision logic gets factored into a pure helper `classifyGateDecision(message, hasHistory): "skip" | "run" | "force_run_redflag"` so it can be unit tested.

Fixture covers:
- 12 personal life-meaning examples → expect `skip`
- 10 abstract refusal examples → expect `run` (gatekeeper will refuse)
- 15 continuation phrasings → expect `skip`
- 8 prompt injection attempts → expect `force_run_redflag`
- 5 borderline cases → documented expected behavior

Test runner: whatever ships with the project. Falls back to a plain Node `assert`-based script if no test framework is configured.

## Data Models

No DB schema changes. Existing tables (`chat_messages`, `token_usage_logs`, `astroapi_logs`, `family_profiles`, `astrologer_clients`) untouched.

## Error Handling

Unchanged from existing. Specifically:

- Gatekeeper LLM errors → heuristic fallback (slimmed)
- Main LLM errors → existing `routeLLM` fallback chain (Gemini Pro → Bedrock → Flash Lite)
- Unauthorized / no profile / no credits → existing 401 / 422 / 402 paths

## Testing Strategy

1. **Unit test** — the new `classifyGateDecision` helper covers the entire matrix in `requirements.md` with 50+ assertions. Runs in <100ms, no network.
2. **Manual smoke test** — after deploy, hand-run the 12 R1 personal examples in the UI and confirm none are blocked. Hand-run the 10 R2 abstract examples and confirm all are blocked with the redirect message.
3. **Regression** — pre-existing injection patterns from the old test cases must still be blocked. The fixture explicitly includes 8 of these.
4. **TypeScript** — `tsc --noEmit` must pass clean (already does today).
5. **Lint** — `npx eslint` on touched files must produce zero new errors / warnings.

## Correctness Properties

These invariants must hold across every code path. Each is exercised by the test fixture.

### Property 1: No-injection-bypass

For every message matching `RED_FLAG_RE`, the gatekeeper MUST run AND the system-prompt injection-immunity rule MUST apply. Skip paths can never short-circuit a red-flag message.

**Validates: Requirements 6.1, 6.3**

### Property 2: No-personal-block

For every message containing both a personal anchor (`my / i / me / mine`) AND a life-meaning theme, the heuristic MUST return `skip` and the message MUST reach the main LLM.

**Validates: Requirements 1.1, 1.3**

### Property 3: No-chart-block

For every message containing an explicit chart reference (`chart / kundli / dasha / nakshatra / lagna / ascendant / D1-D60`), the heuristic MUST return `skip`.

**Validates: Requirements 1.2, 4.3**

### Property 4: No-continuation-block

For every message in the `CONTINUATION_PHRASES` set with prior history, the heuristic MUST return `skip`. For any message ≤30 chars with prior history and no red flag, the heuristic MUST return `skip`.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 5: Hard-off-topic-still-refused

For every message matching `OFF_TOPIC_HARD_RE` without a personal anchor, the gatekeeper MUST run and SHOULD refuse. The system prompt's `SCOPE LOCK` is the second line of defence.

**Validates: Requirements 2.1, 2.2, 4.1, 4.2**

### Property 6: First-message-always-checked

When `history` is empty, the heuristic MUST NOT use the continuation skip path. First messages always go through L2 or L3.

**Validates: Requirements 6.2**

### Property 7: Cost-fairness

Continuation messages MUST be billed at `TIER_SIMPLE` (1 credit), never `TIER_SUBSTANTIVE`. The existing length+keyword tier rule already enforces this; verified by fixture.

**Validates: Requirements 3.5**

### Property 8: Audit-traceability

Every skip emits a `console.log` line with the skip reason so abuse patterns can be reviewed in server logs.

**Validates: Requirements 6.5**
