# Credit Pricing System — Design

## 1 Source of truth

Add `src/lib/pricing/feature-credits.ts`:

```ts
export const FEATURE_CREDITS = {
  karma_dna:               4,
  karmic_patterns:         5,
  your_purpose:            4,   // soul-code
  year_ahead:              5,
  royal_roast:             2,
  remedy:                  4,
  your_gotra:              2,
  ishta_devata:            2,
  core_horoscope:          2,   // basic PDF
  professional_horoscope:  5,   // pro PDF
  nakshatra_report:        1,
  ascendant_report:        1,
  compatibility:           5,
} as const;

export type FeatureKey = keyof typeof FEATURE_CREDITS;
export const NAKSHATRA_ASC_BUNDLE_COST =
  FEATURE_CREDITS.nakshatra_report + FEATURE_CREDITS.ascendant_report; // 2
```

Both backend routes and frontend components import from this module.
Anywhere we previously referenced a magic number (`20`, `25`, `15`, `5`,
`10`, `3`) we replace with the named constant.

## 2 Backend changes (per route)

Pattern, applied to every paid endpoint:

```
1. Auth check
2. Resolve profileId
3. Look up cached / saved record   ── if hit → return { ...content, creditsRemaining: <unchanged>, fromCache: true }
4. Look up user credits
5. If credits < FEATURE_CREDITS[key]  → 402 with { error, required, available }
6. Generate
7. Persist to saved_reports / pdf_unlocks / compatibility_reports
8. Deduct credits ONCE: credits := max(0, credits - FEATURE_CREDITS[key])
9. Log to token_usage_logs (and astroapi_logs for PDFs)
10. Return { ...content, creditsRemaining }
```

### 2.1 Specific route fixes

| Route | Current | Required change |
| --- | --- | --- |
| karma-dna | already correct, cost 20 | swap to FEATURE_CREDITS.karma_dna (4) |
| karmic-patterns | already correct, cost 25 | swap to FEATURE_CREDITS.karmic_patterns (5) |
| soul-code | already correct, cost 15 | swap to FEATURE_CREDITS.your_purpose (4) |
| year-ahead | already correct, cost 20 | swap to FEATURE_CREDITS.year_ahead (5) |
| royal-roast | **missing first-time guard** | add cache-before-charge using `saved_reports / royal_roast`; cost → 2 |
| remedy | **partial guard** | confirm cache-before-charge; cost → 4 |
| gotra-report | already correct, cost 5 | swap to 2; verify cache-before-charge |
| ishta-devata | already correct, cost 5 | swap to 2 |
| nakshatra-ascendant | combined cost 10 | combined cost = 2 (1 + 1); cache stays unified |
| pdf-report (basic) | free | charge 2 credits on first basic PDF, gate by `pdf_unlocks(hash, basic_horoscope_pdf)` |
| pdf-report (pro)  | charge 5 | confirm 5, no change other than constants |
| compatibility | free | charge 5 credits on first generation per **pair-hash**, free for re-opens & saved-list views |

### 2.2 Compatibility "pair-hash" cache

To keep "first time per pair only" semantics:

- Compute `pairHash = sha1(birthHash(p1) + ':' + birthHash(p2))`
  with the two birth-hashes sorted alphabetically (so `p1↔p2` and `p2↔p1`
  produce the same hash).
- Look up an existing report keyed by `(user_id, pair_hash)` in
  `compatibility_reports`. Existing pairs are returned free; new pairs are
  charged 5 credits.
- Add a `pair_hash text` column to `compatibility_reports` (nullable for
  legacy rows; new rows always populated).

## 3 Frontend changes

### 3.1 FEATURE_META gets a `creditCost` field

Extend the type in `dashboard/page.tsx`:

```ts
type FeatureMeta = {
  key: FeatureKey;
  label: string;
  hint: string;
  creditCost?: number;   // optional; falsy → free / no-cost feature
  ...
};
```

Populate from the central module so a single change in `feature-credits.ts`
updates every label.

### 3.2 BentoCard label

Replace the hard-coded `~5 credits` footer text with `${f.creditCost ?? "Free"} credits`.

### 3.3 Per-feature panels

Each panel CTA — `KarmaDNA`, `KarmicPatterns`, `RoyalRoast`, `RemedyPanel`,
`SoulCodePanel`, `YearAheadPanel`, `YourGotra`, `IshtaDevata`, `ReportsPanel`
(basic + pro + nakshatra + ascendant), `Compatibility` — pulls the cost from
`FEATURE_CREDITS` and uses it both in the button label and in the inline
"insufficient credits" toast.

### 3.4 Real-time balance

Already wired: every panel reads `creditsRemaining` from the API response and
calls `setProfile({ ...profile, credits })`. We just have to make sure every
new endpoint also returns it (Compatibility currently doesn't).

## 4 Database

`compatibility_reports` gets a new column:

```sql
ALTER TABLE public.compatibility_reports
  ADD COLUMN IF NOT EXISTS pair_hash text;
CREATE INDEX IF NOT EXISTS idx_compatibility_pair
  ON public.compatibility_reports(user_id, pair_hash);
```

`saved_reports.report_type` check constraint already covers all the LLM
features. Royal Roast and Year Ahead are present from prior migrations.

`pdf_unlocks` already keys by `(hash, report_type)` — exactly what we need.

## 5 Verification plan

- TypeScript compile clean: `npm run build` succeeds.
- Linter clean: `npm run lint` reports no new errors.
- For each feature, manually walk through:
  1. First generation → expect credits drop by exact amount.
  2. Reload / re-open → expect zero credit change.
  3. With insufficient credits → expect 402 + inline message.
- Dashboard cards show the correct numbers and update after each generation.
