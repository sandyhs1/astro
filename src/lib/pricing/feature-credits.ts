/**
 * Quantum Karma — central credit pricing.
 *
 * SINGLE source of truth for the credit cost of every paid feature.
 * Both backend routes (`/api/**`) and frontend panels import from here so a
 * change in pricing automatically propagates to:
 *   - the gating check that returns 402 when the user is short on credits
 *   - the deduction step
 *   - every CTA button label that shows "Generate · N credits"
 *   - every Bento card credit hint
 *
 * Reference: REPORT_TOKEN_ANALYSIS.md (token & cost study).
 *
 * IMPORTANT: do NOT inline these numbers anywhere else in the codebase.
 * Always import the constant.
 */

export const FEATURE_CREDITS = {
  /** Karma DNA — D1+D9+D10+D12+D60 + Karakas + Gochar synthesis. */
  karma_dna:               4,
  /** Karmic Patterns — full chart + Karmic Echoes + Gochar. */
  karmic_patterns:         5,
  /** Your Purpose (Soul Code) — Atmakaraka + Jaimini + Bio. */
  your_purpose:            4,
  /** Year Ahead — 12-month transit forecast + Yogas. */
  year_ahead:              5,
  /** Royal Roast — chart-based no-filter roast. */
  royal_roast:             2,
  /** Remedy — mantras / gemstones / rituals tailored to the chart. */
  remedy:                  4,
  /** Your Gotra — spiritual lineage (no chart needed). */
  your_gotra:              2,
  /** Ishta Devata — guiding deity derivation + interpretation. */
  ishta_devata:            2,
  /** Core Horoscope — Basic AstrologyAPI PDF (20+ pages). */
  core_horoscope:          2,
  /** Professional Horoscope — Pro AstrologyAPI PDF (60+ pages). */
  professional_horoscope:  5,
  /** Nakshatra report — half of the combined Nakshatra+Ascendant call. */
  nakshatra_report:        1,
  /** Ascendant report — half of the combined Nakshatra+Ascendant call. */
  ascendant_report:        1,
  /** Couple Compatibility — Soul Alignment between two people. */
  compatibility:           5,
} as const;

export type FeatureKey = keyof typeof FEATURE_CREDITS;

/**
 * The Nakshatra & Ascendant reports share a SINGLE LLM call but show as
 * two separate buttons on the dashboard (each labelled "1 credit"). The
 * combined call therefore charges this bundled total exactly once.
 */
export const NAKSHATRA_ASC_BUNDLE_COST: number =
  FEATURE_CREDITS.nakshatra_report + FEATURE_CREDITS.ascendant_report;

/**
 * Friendly display labels keyed by feature, used by the admin dashboard and
 * any user-facing copy that needs the canonical product name.
 */
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  karma_dna:               "Karma DNA",
  karmic_patterns:         "Karmic Patterns",
  your_purpose:            "Your Purpose (Soul Code)",
  year_ahead:              "Year Ahead",
  royal_roast:             "Royal Roast",
  remedy:                  "Remedy",
  your_gotra:              "Your Gotra",
  ishta_devata:            "Ishta Devata",
  core_horoscope:          "Core Horoscope",
  professional_horoscope:  "Professional Horoscope",
  nakshatra_report:        "Nakshatra Report",
  ascendant_report:        "Ascendant Report",
  compatibility:           "Couple Compatibility",
};

/** Helper: render "N credit(s)" with correct pluralisation. */
export function creditsLabel(n: number): string {
  return `${n} credit${n === 1 ? "" : "s"}`;
}

/** Helper: button suffix, e.g. "· 4 credits". */
export function costSuffix(key: FeatureKey): string {
  return `· ${creditsLabel(FEATURE_CREDITS[key])}`;
}
