# Token Consumption & Pricing Analysis — 12 Reports

**Generated:** May 19, 2026
**Source:** Static analysis of `/src/app/api/**/route.ts` + `/src/lib/astrology/llm-router.ts`

---

## Routing & Pricing model

The router (`/src/lib/astrology/llm-router.ts`) calls in this order:
1. **PRIMARY:** Gemini 3.1 Pro (`gemini-3.1-pro-preview`) — typical path
2. **FALLBACK:** AWS Bedrock Claude Sonnet 4.6 (`us.anthropic.claude-sonnet-4-6`)
3. **LAST RESORT:** Gemini 3.1 Flash Lite

| Model | Input ₹ / 1K | Output ₹ / 1K |
|---|---|---|
| Gemini 3.1 Pro (primary) | ₹0.105 | ₹0.420 |
| Claude Sonnet 4.6 (fallback) | ₹0.252 | ₹1.260 |
| Gemini 3.1 Flash Lite | ₹0.0063 | ₹0.0063 |

All numbers below assume **Gemini 3.1 Pro** (the active primary path). If Bedrock is used as fallback, multiply costs by ~3×.

---

## Report Token & Cost Table

| # | Report | Engine / Path | Input tokens (est.) | Output tokens (cap) | Total tokens | ₹ Gemini Pro | ₹ Claude 4.6 (fallback) | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | **Karma DNA** | LLM (`/api/karma-dna`) | ~9,000 | 4,000 | ~13,000 | ₹2.62 | ₹7.31 | Heavy chart context (D1, D9, D10, D12, D60 + Karakas + Gochar). 20 credits. |
| 2 | **Karmic Patterns** | LLM cached (`/api/karmic-patterns`) | ~12,000 | 5,000 | ~17,000 | ₹3.36 | ₹9.32 | Largest input (full chart + Karmic Echoes + Gochar). Bedrock cached path saves ~90% on repeat. 25 credits. |
| 3 | **Your Purpose** (Soul Code) | LLM (`/api/soul-code`) | ~3,500 | 4,000 | ~7,500 | ₹2.05 | ₹5.92 | Jaimini Karakas + Bio + Moon Bio. JSON mode. |
| 4 | **Year Ahead** | LLM (`/api/year-ahead`) | ~4,000 | 4,500 | ~8,500 | ₹2.31 | ₹6.68 | Yearly transits + Yogas + 12-month chart, JSON mode. |
| 5 | **Royal Roast** | LLM (`/api/royal-roast`) | ~6,500 | 5,500 | ~12,000 | ₹2.99 | ₹8.57 | Sharp roast prose. 15 credits. |
| 6 | **Remedy** | LLM cached (`/api/remedy`) | ~9,000 | 3,000 | ~12,000 | ₹2.21 | ₹6.05 | Chart context + Gochar transits. Cached on Bedrock. |
| 7 | **Your Gotra** | LLM (`/api/gotra-report`) | ~1,200 | 3,500 | ~4,700 | ₹1.60 | ₹4.71 | No chart needed (lineage only). |
| 8 | **Ishta Devata** | LLM (`/api/ishta-devata`) | ~3,500 | 4,000 | ~7,500 | ₹2.05 | ₹5.92 | Mathematical derivation pre-computed; LLM explains. |
| 9 | **Reports — Core Horoscope** | AstrologyAPI PDF (no LLM) | — | — | — | ₹0.084 | — | Pre-rendered PDF from `basic_horoscope_pdf` endpoint. **No tokens consumed.** Free tier. |
| 10 | **Reports — Professional Horoscope** | AstrologyAPI PDF (no LLM) | — | — | — | ₹0.084 | — | Pre-rendered PDF from `pro_horoscope_pdf` endpoint. **No tokens consumed.** 5-credit unlock. |
| 11 | **Reports — Nakshatra** | LLM (`/api/nakshatra-ascendant`) | ~2,500 | 4,000 (shared) | ~6,500 (shared) | ₹0.92 (½ share) | ₹2.84 (½ share) | Single LLM call generates Nakshatra + Ascendant together. |
| 12 | **Reports — Ascendant** | LLM (`/api/nakshatra-ascendant`) | shared with #11 | shared | shared | ₹0.92 (½ share) | ₹2.84 (½ share) | Same call as Nakshatra. Combined cost shown split. |

> Estimates assume average chart payload sizes observed in the codebase (system prompt + dynamic chart context). Real usage in `token_usage_logs` table will reflect exact counts.

---

## Sub-totals

| Bundle | Tokens (est.) | Gemini Pro ₹ | Claude 4.6 ₹ |
|---|---|---|---|
| All 12 reports (one-time per user) | ~88,200 | ~₹20.27 | ~₹60.16 |
| LLM-only (10 reports excl. PDFs) | ~88,200 | ~₹20.10 | ~₹59.99 |
| AstrologyAPI PDF cost (Core + Pro) | — | ~₹0.17 | ~₹0.17 |

---

## Methodology & Caveats

- **Output tokens** taken from the explicit `maxTokens` argument on each `routeLLM(...)` call. Actual output is usually 70–95% of the cap.
- **Input tokens** estimated at ~4 chars/token using observed system prompt + chart-context lengths. Karmic Patterns and Karma DNA inject D3/D9/D10/D12/D60 divisional charts → larger input.
- **Caching**: Karmic Patterns + Remedy use `routeLLMCached` which routes to Bedrock Claude with cachePoint blocks when triggered. On a cache hit, input is billed at ~10% — the table shows worst-case (no cache).
- **Core / Professional Horoscope** reports do **not** call any LLM. They are PDFs assembled from AstrologyAPI's `basic_horoscope_pdf` / `pro_horoscope_pdf` endpoints. Cost per call is fixed at ₹0.084 (per `ASTRO_API_COST_INR`).
- **Reports — Nakshatra & Ascendant**: a single LLM call (`/api/nakshatra-ascendant`) returns BOTH reports as one JSON. Cost is split 50/50 in the table for clarity.

---

## Pricing constants used

From `LLM_PRICE` in each route:
```ts
"bedrock/us.anthropic.claude-sonnet-4-6": { in: 0.252,  out: 1.26   }
"gemini/gemini-3.1-pro-preview":           { in: 0.105,  out: 0.42   }
"gemini/gemini-3.1-flash-lite":    { in: 0.0063, out: 0.0063 }
```

AstrologyAPI per-call cost: `ASTRO_API_COST_INR = 0.084` (~₹0.084 per request).

---

## Quick formula (for re-running on real data)

```
cost_inr = (input_tokens / 1000) * price_in + (output_tokens / 1000) * price_out
```

Run against `token_usage_logs` filtered by `question_preview` LIKE the report name to get true measured spend per report.
