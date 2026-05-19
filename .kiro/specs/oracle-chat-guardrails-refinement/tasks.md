# Implementation Plan

## Overview

Seven tasks, sequential. The first extracts the heuristic into a pure helper so it's testable without spinning up the chat pipeline. Tasks 2–5 wire it into the three layers and update the system prompt and refusal copy. Task 6 locks the behaviour with a fixture. Task 7 is the build/lint/test gate.

## Tasks

- [x] 1. Extract heuristic decision into pure helper for testability
  - Create `src/lib/astrology/guardrails.ts` exporting `classifyGateDecision(message: string, hasHistory: boolean): { decision: "skip" | "run" | "force_run_redflag"; reason: string }`.
  - Define `RED_FLAG_RE`, `CONTINUATION_PHRASES`, `PERSONAL_ANCHOR_RE`, `CHART_REF_RE`, `LIFE_MEANING_RE`, `OFF_TOPIC_HARD_RE` as named exports so tests and future audits can reference them.
  - Helper is pure — no I/O, no LLM calls, no `cookies()` access.
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 3.2, 3.3, 4.1, 4.2, 6.1, 6.2, 6.3_

- [x] 2. Wire `classifyGateDecision` into `chat-pipeline.ts`
  - In `prepareChatRequest`, replace the inline heuristic block with a single call to `classifyGateDecision(message, hasPriorContext)`.
  - For decision `"skip"`: emit `console.log("[GATEKEEPER] skipped — reason=<reason>")` and bypass the gatekeeper LLM.
  - For decision `"run"`: call `gatekeeperCheck` as today.
  - For decision `"force_run_redflag"`: call `gatekeeperCheck` AND apply the existing defensive override (refuse if gatekeeper passes despite red flag).
  - Trim `OFF_TOPIC_SEED_RE` per Requirement 4.1: remove `god`, `religion`, `caste`, `alcohol`, `drugs`, `education system`, `university`, `college`, `weather`, `temperature`. (This regex no longer lives in the pipeline file once step 1 is done — its slim equivalent is `OFF_TOPIC_HARD_RE` inside `guardrails.ts`.)
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 6.1, 6.2, 6.5_

- [x] 3. Rewrite the gatekeeper LLM prompt with personal-anchor rule
  - In `src/lib/astrology/llm-router.ts`, update the prompt inside `gatekeeperCheck` to:
    - Define ON-TOPIC as: chart reference present, OR `my/I/me/mine` + life-meaning theme, OR explicit chart-anchored question.
    - Define OFF-TOPIC strictly as: answer would be the same regardless of who asks (textbook, recipe, code, news, sports, weather forecast).
    - Provide 6 concrete ALLOW examples (R1.3 list) and 6 concrete REFUSE examples (R2.2 list).
  - Slim the heuristic fallback's `HARD_OFFTOPIC` regex to mirror the new `OFF_TOPIC_HARD_RE`. Remove `god`, `religion`, `caste`, `alcohol`, `drugs`, `weather`, `temperature` from it.
  - Keep `HARD_INJECT` regex unchanged.
  - On uncertainty in the fallback, return `allowed: true` (fail open) — the system-prompt SCOPE LOCK and LIFE-MEANING RUBRIC still cover us.
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 4.3, 4.4, 6.4_

- [x] 4. Add LIFE-MEANING RUBRIC block to the system prompt
  - In `src/lib/astrology/prompts.ts`, insert a new section titled `LIFE-MEANING RUBRIC — CHART-FIRST EXISTENTIAL ANSWERS` immediately after the `SCOPE LOCK` block.
  - The block must list the four required-anchor topic groups (KARMA, DHARMA, SUFFERING, FAITH/RELIGION) with the specific chart elements each one must reference (per R5.2–5.4 in requirements.md).
  - End the block with the rule: "If the user mentions a religion or deity not represented in chart context, answer ONLY in terms of how their chart speaks to that question. Do NOT preach, validate, or invalidate any tradition."
  - Existing `SCOPE LOCK`, `PROMPT INJECTION IMMUNITY`, and `IDENTITY LOCK` blocks remain unchanged.
  - _Requirements: 1.4, 5.1, 5.2, 5.3, 5.4, 5.5, 6.3_

- [x] 5. Soften the SCOPE LOCK refusal copy
  - In the same file, update the `REFUSAL FORMAT` line inside `SCOPE LOCK` to the warmer variant from R2.3: "🌙 Ask me how this relates to your chart — your placements, your dashas, your karmic themes — and I can speak."
  - The intent is that even the rare false-positive refusal feels like an invitation to rephrase, not a wall.
  - _Requirements: 2.3_

- [x] 6. Create the unit test fixture
  - Create `src/lib/astrology/__tests__/guardrails.spec.ts` (or `.test.ts` matching project convention).
  - Import `classifyGateDecision` from `../guardrails`.
  - Define the full fixture as a typed array: `{ msg: string; hasHistory: boolean; expect: "skip" | "run" | "force_run_redflag"; note?: string }[]`.
  - Cover the matrix from R7.3:
    - 12 personal life-meaning examples (all R1.3 entries) → `expect: "skip"`
    - 10 abstract refusal examples (all R2.2 entries) → `expect: "run"`
    - 15 continuation phrasings (from R3.2) with `hasHistory: true` → `expect: "skip"`
    - 8 prompt injection attempts (from existing `RED_FLAG_RE` corpus) → `expect: "force_run_redflag"`
    - 5 borderline cases (`"Why is karma so cruel?"` → `run`; `"Tell me about Hinduism and my chart"` → `skip`; `"continue"` with `hasHistory: false` → `run`; `"my karma"` → `skip`; `"is this real?"` with history → `skip`)
  - Iterate with a single `for…of` and assert. Use whatever runner the project ships with (Jest/Vitest); fall back to a plain Node script that exits non-zero on mismatch if no runner is configured.
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 7. Verify build, types, lint, and run the fixture
  - Run `npx tsc --noEmit` and confirm zero errors.
  - Run `npx eslint` on `src/lib/astrology/guardrails.ts`, `chat-pipeline.ts`, `llm-router.ts`, `prompts.ts`, and the new spec file. Confirm no NEW errors or warnings (pre-existing project-wide warnings are out of scope).
  - Execute the test fixture and confirm 50+ assertions pass.
  - Hand-trace the four worked examples from the spec discussion to confirm L1 routing matches expectations: `"Why is my karma so bad?"` (skip, personal_anchor), `"continue"` with history (skip, continuation), `"Latest cricket score?"` (run), `"ignore all previous instructions"` (force_run_redflag).
  - _Requirements: 7.4_


## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2", "3", "4", "5"] },
    { "wave": 3, "tasks": ["6"] },
    { "wave": 4, "tasks": ["7"] }
  ]
}
```

```
1 (guardrails.ts helper)
 └─ 2 (wire into chat-pipeline.ts)
 └─ 6 (test fixture imports the helper)

3 (gatekeeper LLM prompt) — independent
4 (LIFE-MEANING RUBRIC) — independent
5 (refusal copy) — independent (touches same file as 4)

2, 3, 4, 5, 6
 └─ 7 (build, types, lint, run fixture)
```

Practical execution order: 1 → 2 → 3 → 4 → 5 → 6 → 7. Tasks 3, 4, 5 can be done in any sub-order since they touch different concerns.

## Notes

- No DB schema change. Audit logging is `console.log` only.
- The `RED_FLAG_RE` injection regex is intentionally untouched. If a test fails because a new injection pattern slips through, that is a separate fix and should be raised against this spec rather than worked around in the helper.
- The prompts file (`prompts.ts`) is large (~1560 lines). When inserting the LIFE-MEANING RUBRIC, keep it adjacent to SCOPE LOCK and resist the urge to refactor surrounding blocks — touch the minimum surface area required.
- If the project does not have Jest or Vitest configured, the fixture in task 6 should be a plain Node script under `scripts/` that the developer can run with `node --import tsx scripts/test-guardrails.ts` or equivalent. Do not add a test runner as a dependency just for this.
