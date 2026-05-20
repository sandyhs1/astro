# Credit Pricing System — Tasks

## Phase 0 — Foundations
- [x] Create `src/lib/pricing/feature-credits.ts` with the canonical pricing map.

## Phase 1 — Database
- [x] Migration `add_pair_hash_to_compatibility.sql` adding `pair_hash` column + index.

## Phase 2 — API routes (one source of truth)
- [x] Karma DNA — cost 4
- [x] Karmic Patterns — cost 5
- [x] Soul Code (Your Purpose) — cost 4
- [x] Year Ahead — cost 5
- [x] Royal Roast — cost 2 + first-time guard (currently missing!)
- [x] Remedy — cost 4
- [x] Gotra — cost 2
- [x] Ishta Devata — cost 2
- [x] Nakshatra+Ascendant — combined 2 (1+1)
- [x] PDF Basic (Core Horoscope) — cost 2 + first-time guard
- [x] PDF Pro (Professional Horoscope) — cost 5 (already wired, just swap constant)
- [x] Compatibility — cost 5 + pair-hash first-time guard

## Phase 3 — Dashboard frontend
- [x] Add `creditCost` to FEATURE_META + populate from pricing map.
- [x] BentoCard footer reads dynamic credit cost.
- [x] Per-feature panel CTAs read cost from pricing map (Karma DNA,
       Karmic Patterns, Royal Roast, Remedy, Soul Code, Year Ahead,
       Gotra, Ishta Devata, Reports panel — basic/pro/nakshatra/ascendant,
       Compatibility).

## Phase 4 — Verification
- [ ] `npm run build` clean.
- [ ] `npm run lint` clean.
- [ ] Manual smoke pass.
