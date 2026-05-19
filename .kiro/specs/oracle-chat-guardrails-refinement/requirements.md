# Requirements Document

## Introduction

The Oracle Chat guardrails were tightened in a previous pass to close two bypass holes (short-message skip path and `startsWith`/`endsWith` matching on affirmatives). That fix worked but introduced two new risks the user has flagged:

1. **Continuation messages may be over-blocked.** Users naturally type `continue`, `keep going`, `why did you stop`, `finish that thought` when an answer is truncated. The current rules cover the most common ones but miss several natural variants.
2. **Personal life-meaning questions may be over-blocked.** Vedic Jyotisha is fundamentally about karma, dharma, moksha, soul-purpose, and spiritual life. Questions like *"Why is my karma so bad?"*, *"What is my karma in this life?"*, *"What does my chart say about my dharma?"* are exactly what the product exists to answer. The current `OFF_TOPIC_SEED_RE` lists `religion`, `god`, `alcohol`, `drugs`, `education system` etc. which can force the gatekeeper to refuse a perfectly legitimate, chart-anchored question.

This refinement draws a precise, defensible line between **on-topic personal questions** (allowed) and **abstract / non-chart questions** (blocked), without weakening the protection against off-topic abuse and prompt injection.

The guiding principle:

> **A question is on-topic if its answer would be different for a different birth chart. It is off-topic if the answer is the same regardless of who is asking.**

## Glossary

- **Gatekeeper** — Gemini Flash Lite classifier in `src/lib/astrology/llm-router.ts` that runs before the main LLM call.
- **Heuristic skip** — the pre-LLM regex layer in `src/lib/astrology/chat-pipeline.ts` that decides whether to even call the gatekeeper.
- **Personal anchor** — the user mentions themselves (`my`, `i`, `me`, `mine`, `myself`) or their chart explicitly.
- **Life-meaning theme** — karma, dharma, moksha, soul, fate, purpose, suffering, spiritual path, religion-as-personal-experience.
- **Continuation message** — a short user reply asking the AI to keep going from where it stopped.

---

## Requirements

### Requirement 1: Personal life-meaning questions must always be allowed

**User Story:** As a seeker who is going through hardship, I want to ask the Oracle deep questions about my own karma, soul purpose, dharma, suffering, or spiritual path, and receive a chart-anchored answer — not a refusal.

#### Acceptance Criteria

1. WHEN the user sends a message that contains a personal anchor (`my`, `i`, `me`, `mine`, `myself`) AND a life-meaning theme (karma, dharma, soul, purpose, fate, destiny, suffering, spirituality, religion, god as personal experience), THEN the message SHALL be allowed through to the main LLM.
2. WHEN the message contains an explicit chart reference (`chart`, `kundli`, `kundali`, `horoscope`, `birth chart`, `natal chart`, `placements`), THEN it SHALL be allowed regardless of other words it contains.
3. THE following messages SHALL all be allowed:
   - "Why is my karma so bad?"
   - "What is my karma in this life?"
   - "What does my chart say about my dharma?"
   - "What is the meaning of my suffering?"
   - "Is god punishing me for past lives?"
   - "What is my soul's purpose?"
   - "Why do I feel like life keeps testing me?"
   - "What does my chart say about my spiritual path?"
   - "Will my faith help me through this dasha?"
   - "Should I avoid alcohol based on my chart?"
   - "Does my chart show religious inclination?"
4. WHEN such a message is allowed, the main LLM SHALL anchor the answer to the user's actual chart placements (Atmakaraka for soul purpose, 12th house for moksha, 8th house for karmic baggage, Saturn placement for prarabdha, etc.) and SHALL NOT respond with generic philosophy or theology.

### Requirement 2: Abstract non-chart questions must still be blocked

**User Story:** As the system operator, I want abstract questions that have nothing to do with the user's chart to be refused, so users do not abuse the chat as a free general AI.

#### Acceptance Criteria

1. WHEN the message has no personal anchor AND no chart reference AND its primary intent is a textbook definition or general topic, THEN the message SHALL be refused with a polite redirect.
2. THE following messages SHALL be refused:
   - "What is god?"
   - "Explain karma" (no `my`, no `chart`)
   - "What is religion?"
   - "Tell me about Hinduism"
   - "What is the meaning of life?"
   - "How do I cook biryani?"
   - "What is the latest cricket score?"
   - "Write me a Python function"
   - "What's the weather in Mumbai?"
   - "Tell me a joke"
3. THE refusal message SHALL invite the user to rephrase as a personal / chart question, e.g. *"🌙 Ask me how this relates to your chart — your placements, your dashas, your karmic themes — and I can speak."*

### Requirement 3: Continuation messages must always work

**User Story:** As a user reading a long prediction that was truncated, I want to type natural continuation phrases and have the Oracle pick up where it left off, without paying gatekeeper latency or being refused.

#### Acceptance Criteria

1. WHEN the user sends an exact-match continuation phrase from the expanded set, AND prior conversation history exists, AND no red-flag injection signature is present, THEN the gatekeeper SHALL be skipped.
2. THE expanded continuation set SHALL include at minimum: `continue`, `keep going`, `keep on`, `carry on`, `go on`, `go ahead`, `more`, `tell me more`, `next`, `next part`, `finish`, `finish it`, `complete`, `complete it`, `don't stop`, `dont stop`, `please continue`, `why did you stop`, `why stop`, `you stopped`, `is that all`, `and?`, `and then?`, `then?`, `so?`, `what next`, `what else`, `proceed`.
3. WHEN the message length is ≤30 characters AND prior history exists AND no red-flag is present, THEN the gatekeeper SHALL be skipped (covers natural variants beyond the exact-match set).
4. THE auto-continue-on-truncation server logic in `route.ts` and `stream/route.ts` SHALL remain in place, so most users never need to type "continue" at all.
5. WHEN a user does type "continue" anyway, the cost SHALL be the simple-tier credit cost (1 credit, not 2).

### Requirement 4: Off-topic seed list must not over-trigger on chart-related themes

**User Story:** As a user asking about religion, alcohol, drugs, or education in the context of my chart, I want the question to be allowed, not refused for matching a banned word.

#### Acceptance Criteria

1. THE off-topic seed regex (`OFF_TOPIC_SEED_RE`) SHALL only contain words that have NO legitimate connection to a personal birth-chart reading. Specifically, the following SHALL be REMOVED from the seed list: `god`, `religion`, `caste`, `alcohol`, `drugs`, `education system`, `university`, `college`.
2. THE off-topic seed regex SHALL retain only pure non-chart topics: `recipe`, `cook`, `football`, `cricket score`, `election`, `president`, `prime minister`, `news headline`, `joke`, `poem about`, `song lyrics`, `movie`, `netflix`, `stock price`, `crypto`, `bitcoin`, `nifty`, `sensex`, `python`, `javascript`, `sql`, `hack`, `malware`, `porn`, `weather forecast`, `temperature today`.
3. WHEN a message contains a removed-from-seed-list word AND a personal/chart anchor, THEN the heuristic SHALL allow it through (gatekeeper still runs as the second layer).
4. WHEN a message contains a removed-from-seed-list word but NO anchor, the gatekeeper SHALL still catch and refuse it on its own merits.

### Requirement 5: System prompt must answer existential questions chart-first

**User Story:** As a user asking *"Why is my karma so bad?"*, I want the answer to cite specific placements in MY chart (Saturn position, 8th house, current dasha) — not generic preaching about karma.

#### Acceptance Criteria

1. THE `ASTRO_SYSTEM_PROMPT` SHALL include explicit guidance on existential / life-meaning questions, instructing the LLM to anchor every answer to the user's actual chart data.
2. WHEN the user asks about their karma, the LLM SHALL reference at minimum: their Atmakaraka, their current Mahadasha, their 8th and 12th house placements, any Sade Sati / Saturn return state, and Rahu/Ketu axis.
3. WHEN the user asks about their dharma or soul purpose, the LLM SHALL reference: their Atmakaraka, their 9th and 10th house, their Karakamsa, and their Ishta Devata indicators.
4. WHEN the user asks about suffering, the LLM SHALL reference: their D30 (Trimsamsa), their 6th / 8th / 12th houses, malefic transits, and current dasha lord condition.
5. THE LLM SHALL NOT respond with abstract philosophy untied to the user's chart. If the chart truly does not contain the answer, it SHALL say so precisely and offer the closest chart-anchored angle.

### Requirement 6: Defence-in-depth integrity must be preserved

**User Story:** As the system operator, the new on-topic generosity must not weaken the existing protection against prompt injection or true off-topic abuse.

#### Acceptance Criteria

1. THE red-flag injection regex (`RED_FLAG_RE`) SHALL be UNCHANGED — every previously detected injection pattern continues to force the gatekeeper.
2. THE gatekeeper LLM SHALL still run on every message that does not match the (now-narrower) heuristic skip path.
3. THE system-prompt-level `PROMPT INJECTION IMMUNITY` and `IDENTITY LOCK` blocks SHALL remain in place as the third defensive layer.
4. THE gatekeeper-fail-open heuristic fallback (when the Flash classifier errors) SHALL be UNCHANGED for hard-injection patterns.
5. WHEN the gatekeeper is skipped, the audit log SHALL record `gate_skipped=true` so abuse patterns can be reviewed retroactively.

### Requirement 7: Out-of-the-box test coverage

**User Story:** As an engineer maintaining this code, I want a single test fixture that locks in the allowed / blocked verdict for the full matrix of real user phrasings.

#### Acceptance Criteria

1. THE repository SHALL contain a test fixture listing every example message in this spec along with its expected classification (`allow` / `gatekeeper` / `block`).
2. THE fixture SHALL be runnable as a unit test that exercises the heuristic layer directly (without making LLM calls).
3. THE fixture SHALL cover at minimum: 12 personal life-meaning examples, 10 abstract refusal examples, 15 continuation phrasings, 8 prompt-injection attempts, 5 borderline cases.
4. WHEN any acceptance criterion in this spec changes, the fixture SHALL be updated in the same commit.
