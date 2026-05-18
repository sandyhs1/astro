/* ───────────────────────────────────────────────────────────────────────────
 * Editorial theme tokens for the Destiny Window suite.
 * Mirrors the dashboard's Stripe Press / Editorial Calm direction:
 * cream paper, deep navy ink, oxblood accent, taupe borders, antique gold.
 * ─────────────────────────────────────────────────────────────────────────── */

export const PAL = {
  paper:    "#FAF7F2",
  paper2:   "#F1ECE0",
  paper3:   "#E8E0CE",
  ink:      "#0E1A33",
  ink2:     "#3F4F6F",
  ink3:     "#6F7B92",
  border:   "#D4C9B7",
  border2:  "#E8E0CE",
  accent:   "#7B0A1F",   // oxblood
  accent2:  "#A02236",
  gold:     "#A57C2A",   // antique gold
  sage:     "#4F7A4D",   // muted sage (auspicious)
  sageBg:   "#EAEFE5",
  rose:     "#9C2A3F",   // muted rose (caution / inauspicious)
  roseBg:   "#F6E3E5",
  amberBg:  "#F5EBD0",
} as const;

/* Score → editorial-friendly grade colors */
export const GRADE = {
  excellent: { ink: PAL.sage,   bg: PAL.sageBg,  bar: "#5A8856" },
  good:      { ink: PAL.sage,   bg: "#F0EFDC",   bar: "#7FA47A" },
  neutral:   { ink: PAL.gold,   bg: PAL.amberBg, bar: "#C9A94B" },
  caution:   { ink: PAL.rose,   bg: PAL.roseBg,  bar: "#C66D6D" },
  rest:      { ink: PAL.rose,   bg: PAL.roseBg,  bar: "#A23E47" },
} as const;

export type GradeKey = keyof typeof GRADE;

/* Choghadiya tone map (kept friendly to cream canvas) */
export const CHOG_TONE: Record<string, { ink: string; bg: string; border: string; label: string }> = {
  Amrit: { ink: PAL.sage,  bg: PAL.sageBg,   border: "#C7D6BB", label: "Best"    },
  Shubh: { ink: "#1F4F7A", bg: "#E5EEF6",    border: "#BCD0E1", label: "Good"    },
  Labh:  { ink: "#5A3A8F", bg: "#EBE5F4",    border: "#D2C4E5", label: "Gains"   },
  Chal:  { ink: PAL.ink2,  bg: PAL.paper2,   border: PAL.border, label: "Neutral" },
  Kaal:  { ink: PAL.rose,  bg: PAL.roseBg,   border: "#E5BFC1", label: "Avoid"   },
  Rog:   { ink: PAL.rose,  bg: PAL.roseBg,   border: "#E5BFC1", label: "Avoid"   },
  Udveg: { ink: PAL.gold,  bg: PAL.amberBg,  border: "#E1CE9B", label: "Avoid"   },
};

/* Planet tones for Horas / Dasha / Transits — restrained editorial set */
export const PLANET_TONE: Record<string, { ink: string; bg: string; border: string; emoji: string }> = {
  Sun:     { ink: "#A06A18", bg: "#F5EBD0", border: "#E1CE9B", emoji: "☀︎" },
  Moon:    { ink: "#5A3A8F", bg: "#ECE6F4", border: "#D2C4E5", emoji: "☾" },
  Mars:    { ink: "#9C2A3F", bg: "#F6E3E5", border: "#E5BFC1", emoji: "♂" },
  Mercury: { ink: "#3D6B4D", bg: "#E8EFE5", border: "#C4D2BB", emoji: "☿" },
  Jupiter: { ink: "#1F4F7A", bg: "#E5EEF6", border: "#BCD0E1", emoji: "♃" },
  Venus:   { ink: "#8B3F66", bg: "#F4E3EC", border: "#E5C2D3", emoji: "♀" },
  Saturn:  { ink: PAL.ink,    bg: PAL.paper2, border: PAL.border, emoji: "♄" },
  Rahu:    { ink: "#5A3A8F", bg: "#ECE6F4",  border: "#D2C4E5", emoji: "☊" },
  Ketu:    { ink: "#A06A18", bg: "#F5EBD0",  border: "#E1CE9B", emoji: "☋" },
};

/* Quality colors used across components */
export const QUALITY_TONE: Record<string, { ink: string; bg: string; border: string; label: string }> = {
  good:         { ink: PAL.sage,  bg: PAL.sageBg,  border: "#C7D6BB", label: "Good"    },
  auspicious:   { ink: PAL.sage,  bg: PAL.sageBg,  border: "#C7D6BB", label: "Auspicious" },
  bad:          { ink: PAL.rose,  bg: PAL.roseBg,  border: "#E5BFC1", label: "Avoid"   },
  inauspicious: { ink: PAL.rose,  bg: PAL.roseBg,  border: "#E5BFC1", label: "Avoid"   },
  neutral:      { ink: PAL.ink2,  bg: PAL.paper2,  border: PAL.border, label: "Neutral" },
};
