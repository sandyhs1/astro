# Credit Pricing System — Requirements

**Status:** In implementation
**Owner:** Quantum Karma core team
**Sub-domain:** Monetisation, paywall, dashboard UX

---

## 1 Background

We monetise via a ₹1,799 / month subscription that grants 50 AI credits. Each
LLM-backed report (and the AstrologyAPI PDFs) consumes credits. Up to today the
per-feature cost has been hard-coded inside each `/api/**/route.ts` file, with
inconsistent logic between routes (some have a "first-time only" guard, some
charge on every POST). The frontend bento cards all hard-code `~5 credits`,
which lies to the user.

---

## 2 Goals

- One source of truth for the credit cost of every report / feature.
- Real-time, accurate credit balance shown on every dashboard, panel, button.
- Charge **only on the first generation**. Re-opening a saved report or the
  same compatibility pair must be free.
- Save **every** generated report so the user always has access.
- Show the credit cost **directly on the button / CTA** for every feature so
  users know up-front what each click will cost.
- Pricing must be in sync between backend (gating) and frontend (labels).

## 3 Non-goals

- We are not changing the ₹1,799 / month price or the 50-credit grant.
- We are not changing the LLM model selection or token budgets.
- We are not refactoring the chat (`astro-chat`) credit flow — it has its own
  tier system and stays as-is.

---

## 4 Functional requirements

### 4.1 Final per-feature credit cost

| # | Feature                          | Credits |
| - | -------------------------------- | ------- |
| 1 | Karma DNA                        | 4       |
| 2 | Karmic Patterns                  | 5       |
| 3 | Your Purpose (Soul Code)         | 4       |
| 4 | Year Ahead                       | 5       |
| 5 | Royal Roast                      | 2       |
| 6 | Remedy                           | 4       |
| 7 | Your Gotra                       | 2       |
| 8 | Ishta Devata                     | 2       |
| 9 | Core Horoscope (PDF basic)       | 2       |
| 10| Professional Horoscope (PDF pro) | 5       |
| 11| Nakshatra Report                 | 1       |
| 12| Ascendant Report                 | 1       |
| 13| Couple Compatibility             | 5       |

> Nakshatra + Ascendant share one LLM call. They are sold as a 2-credit bundle
> ( shown as 1 + 1 on the two tabs, with a "bundled — unlocks both" note ).

### 4.2 First-time-only deduction

For every feature in 4.1 the server must:

1. Resolve the target profile.
2. Look up `saved_reports` (or the equivalent cache table — `pdf_unlocks` for
   PDFs, `compatibility_reports` for couples).
3. If a record exists, return it without touching `user_profiles.credits`.
4. Only on a true first generation: check credits → generate → save → deduct.

### 4.3 Save-every-generation

Every successful generation must persist to its caching table so step 4.2.3
can return it on the next visit. No silent failures — save errors must be
logged and surfaced.

### 4.4 Real-time credit balance

- Every API response that touches credits returns `creditsRemaining`.
- The dashboard updates `profile.credits` from `creditsRemaining` on every
  response.
- Bento cards and feature panels read the cost from the central pricing module
  so any change updates the UI without per-component edits.

### 4.5 Buttons show their cost

Every CTA that triggers a paid generation must include the credit cost in its
label, e.g. `Generate Karma DNA · 4 credits`. The cost reads from the central
pricing module, not a hard-coded number.

### 4.6 Insufficient-credits handling

When the user has fewer credits than the feature cost, the API returns 402
with `{ error, required, available }`. The frontend renders a friendly inline
message (no full-page redirect) and offers a Top-up CTA when applicable.

---

## 5 Acceptance criteria

- [ ] All 13 features deduct exactly the credits specified in 4.1, exactly
      once, on the first successful generation.
- [ ] Re-opening any saved report from any of the 13 features returns the
      saved content and does **not** change `user_profiles.credits`.
- [ ] Every CTA in the dashboard shows the live cost from the central module.
- [ ] Bento cards and side-panel CTAs reflect the new costs without manual
      sync.
- [ ] `npm run lint` passes with zero new errors.
- [ ] `npm run build` succeeds.
