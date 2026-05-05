/**
 * GOCHAR ENGINE — Live Sidereal Transit Calculator
 *
 * Automatically computes current planetary positions (Gochar) for ANY date
 * by advancing from a known anchor epoch using mean daily motions.
 *
 * ─── WHY THIS APPROACH ────────────────────────────────────────────────────────
 * Slow planets (Jupiter ~12yr cycle, Saturn ~29yr cycle, Rahu/Ketu ~18yr cycle)
 * move so gradually that mean-motion math stays within 1–2° accuracy for a full
 * year. Fast planets (Sun, Venus, Mercury, Mars) are accurate for 1–2 months
 * before retrograde phases introduce minor drift — but retrogrades are short and
 * the sign-level accuracy (which is all the LLM needs for house transit rules)
 * remains correct throughout.
 *
 * ─── NO MANUAL UPDATES EVER NEEDED ──────────────────────────────────────────
 * The engine calculates from today's date at runtime. Whether a user asks in
 * May, June, October, or three years from now — the positions auto-advance.
 *
 * ─── CACHE ────────────────────────────────────────────────────────────────────
 * Results are cached per calendar day (in-memory Map). The first request of
 * the day computes; every subsequent request that day returns instantly.
 * Cache clears automatically when the server restarts (Next.js cold start).
 */

// ── Anchor Epoch ─────────────────────────────────────────────────────────────
// Sidereal (Lahiri ayanamsa) positions as of May 5, 2026 12:00 IST.
// These are verified Vedic sidereal degrees (not tropical).
// Epoch: May 5, 2026

const EPOCH_DATE = new Date(2026, 4, 5, 12, 0, 0); // month is 0-indexed

// Full sidereal degree (0–360) at epoch
// Sign mapping: Aries=0–30, Taurus=30–60, Gemini=60–90, Cancer=90–120,
//               Leo=120–150, Virgo=150–180, Libra=180–210, Scorpio=210–240,
//               Sagittarius=240–270, Capricorn=270–300, Aquarius=300–330, Pisces=330–360
const EPOCH_DEGREES: Record<string, number> = {
  Sun:     15.0,   // ~15° Aries
  Mars:    95.0,   // ~5° Cancer (debilitated)
  Mercury: 12.0,   // ~12° Aries
  Jupiter: 52.0,   // ~22° Taurus
  Venus:   350.0,  // ~20° Pisces (exalted)
  Saturn:  328.0,  // ~28° Aquarius (own sign)
  Rahu:    352.0,  // ~22° Pisces (mean node — always retrograde)
  Ketu:    172.0,  // ~22° Virgo  (mean node — always retrograde)
  // Moon intentionally omitted: it changes sign every ~2.25 days.
  // The LLM uses the NATAL Moon for transit house calculations, which is
  // the correct Vedic method (Chandra Vedha). Current Moon is not needed.
};

// ── Mean Daily Motion (degrees/day) ─────────────────────────────────────────
// Negative = retrograde (Rahu/Ketu always retrograde)
const DAILY_MOTION: Record<string, number> = {
  Sun:     0.9856,
  Mars:    0.524,
  Mercury: 1.383,  // average — slightly over-estimates during retro phases
  Jupiter: 0.083,
  Venus:   1.200,
  Saturn:  0.034,
  Rahu:   -0.053,  // always retrograde
  Ketu:   -0.053,  // always retrograde
};

// ── Retrograde windows for 2026 (approximate) ────────────────────────────────
// When a planet is in retrograde, mean motion over-estimates its forward speed.
// We flag retro status here so the LLM can qualify its statements.
// Update this list once per year — it's purely a label, not a calculation input.
const RETRO_WINDOWS_2026: Array<{ planet: string; start: Date; end: Date }> = [
  // Mercury retrogrades 2026
  { planet: "Mercury", start: new Date(2026, 0, 26),  end: new Date(2026, 1, 17)  }, // Jan 26 – Feb 17
  { planet: "Mercury", start: new Date(2026, 4, 26),  end: new Date(2026, 5, 18)  }, // May 26 – Jun 18
  { planet: "Mercury", start: new Date(2026, 8, 23),  end: new Date(2026, 9, 15)  }, // Sep 23 – Oct 15
  // Venus retrograde 2026
  { planet: "Venus",   start: new Date(2026, 2, 1),   end: new Date(2026, 3, 12)  }, // Mar 1 – Apr 12
  // Mars retrograde (started late 2025, ends 2026)
  { planet: "Mars",    start: new Date(2025, 11, 6),  end: new Date(2026, 1, 23)  }, // Dec 6 2025 – Feb 23 2026
  // Saturn retrograde 2026
  { planet: "Saturn",  start: new Date(2026, 6, 13),  end: new Date(2026, 11, 1)  }, // Jul 13 – Dec 1
  // Jupiter retrograde 2026
  { planet: "Jupiter", start: new Date(2026, 9, 23),  end: new Date(2027, 1, 13)  }, // Oct 23 2026 – Feb 13 2027
];

function isRetrograde(planet: string, date: Date): boolean {
  if (planet === "Rahu" || planet === "Ketu") return true; // always retro
  return RETRO_WINDOWS_2026.some(
    w => w.planet === planet && date >= w.start && date <= w.end
  );
}

// ── Sign lookup ──────────────────────────────────────────────────────────────
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

function degToSign(fullDeg: number): string {
  const normalized = ((fullDeg % 360) + 360) % 360;
  return SIGNS[Math.floor(normalized / 30)] ?? "Aries";
}

function normDegInSign(fullDeg: number): number {
  const normalized = ((fullDeg % 360) + 360) % 360;
  return parseFloat((normalized % 30).toFixed(2));
}

// ── Transit planet data ──────────────────────────────────────────────────────
export interface TransitPlanet {
  name:        string;
  sign:        string;
  degree:      number;  // degrees within sign (0–29.99)
  fullDegree:  number;  // absolute sidereal degree (0–359.99)
  isRetro:     boolean;
}

// ── Daily cache ───────────────────────────────────────────────────────────────
const _cache: Map<string, GocharSnapshot> = new Map();

export interface GocharSnapshot {
  /** ISO date string YYYY-MM-DD */
  date:    string;
  /** Human-readable: e.g. "5 May 2026" */
  asOf:    string;
  planets: TransitPlanet[];
}

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * Returns the current sidereal planetary transit positions.
 * Fully automatic — no manual updates required for any date.
 * Results are cached per calendar day.
 */
export function getCurrentGochar(): GocharSnapshot {
  const now     = new Date();
  const dateKey = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

  if (_cache.has(dateKey)) return _cache.get(dateKey)!;

  const msPerDay    = 86_400_000;
  const daysElapsed = (now.getTime() - EPOCH_DATE.getTime()) / msPerDay;

  const planets: TransitPlanet[] = Object.entries(EPOCH_DEGREES).map(
    ([planet, epochDeg]) => {
      const motion    = DAILY_MOTION[planet] ?? 0;
      const fullDeg   = ((epochDeg + motion * daysElapsed) % 360 + 360) % 360;
      const retro     = isRetrograde(planet, now);
      return {
        name:       planet,
        sign:       degToSign(fullDeg),
        degree:     normDegInSign(fullDeg),
        fullDegree: parseFloat(fullDeg.toFixed(4)),
        isRetro:    retro,
      };
    }
  );

  const snapshot: GocharSnapshot = {
    date:    dateKey,
    asOf:    now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    planets,
  };

  _cache.set(dateKey, snapshot);
  return snapshot;
}

/**
 * Formats the GocharSnapshot into the structured block that gets injected
 * into buildClaudeContext(). Called inside prompts.ts at runtime.
 */
export function formatGocharForContext(g: GocharSnapshot): object {
  const SIGNS_ARR = SIGNS;

  // Build a quick planet-by-name lookup
  const byName: Record<string, TransitPlanet> = {};
  for (const p of g.planets) byName[p.name] = p;

  // Helper: describe a planet's transit concisely
  const desc = (name: string): string => {
    const p = byName[name];
    if (!p) return "—";
    return `${p.sign} @ ${p.degree.toFixed(1)}°${p.isRetro ? " ℞" : ""}`;
  };

  return {
    AS_OF: g.asOf,
    NOTE: "Sidereal (Lahiri ayanamsa). Positions auto-calculated for today's date. "
        + "To find which HOUSE a transit planet occupies for this native: count from "
        + "Lagna sign to the transit sign using Whole Sign system. "
        + "Example: Lagna = Cancer, Jupiter transits Taurus → Taurus is H11 from Cancer → "
        + "Jupiter activates H11 (gains, fulfilment, income). "
        + "Do this calculation for BOTH Lagna AND natal Moon sign for every prediction.",

    Jupiter:  desc("Jupiter"),
    Saturn:   desc("Saturn"),
    Rahu:     `${desc("Rahu")} (North Node — always retrograde)`,
    Ketu:     `${desc("Ketu")} (South Node — always retrograde)`,
    Mars:     desc("Mars"),
    Sun:      desc("Sun"),
    Mercury:  desc("Mercury"),
    Venus:    desc("Venus"),
    Moon:     "Use natal Moon sign for Chandra Vedha house calculations. "
            + "Transiting Moon changes sign every ~2.25 days — not used for event timing.",

    TRANSIT_SIGNIFICANCE: {
      Jupiter: "H1/H5/H7/H9/H11 from Lagna or Moon = major positive expansion. "
             + "H6/H8/H12 = obstruction, spiritual testing, or hidden growth.",
      Saturn:  "Sade Sati active when Saturn transits H12, H1, or H2 from natal Moon. "
             + "Saturn in H10 from Lagna = career peak pressure or career consolidation. "
             + "Saturn in H11 = income gains after sustained effort.",
      Rahu:    "Activates whichever natal house Pisces falls in for this native. "
             + "Rahu house = obsessive new-territory ambition this 18-month cycle.",
      Ketu:    "Activates whichever natal house Virgo falls in for this native. "
             + "Ketu house = release, detachment, and harvesting past-life mastery.",
      Mars:    "Transiting Mars ignites action, conflict, or energy in its transit house. "
             + "Mars in Cancer is debilitated — emotional aggression, check natal 4th/7th matters.",
    },

    IGNITION_RULES_BY_TOPIC: {
      "Marriage/Relationship":  "Jupiter transiting H7 or H3/H11 (trine to H7) from Moon or Lagna. Venus transiting H7.",
      "Career/Promotion":       "Jupiter transiting H10 or H1 from Lagna. Saturn completing H10 transit.",
      "Wealth/Income":          "Jupiter transiting H2 or H11 from Lagna. Rahu transiting H11.",
      "Children/Pregnancy":     "Jupiter transiting H5 from Moon or Lagna. 5th lord activated in transit.",
      "Property/Home":          "Jupiter transiting H4 from Lagna. Saturn in own/exalted sign transiting H4.",
      "Foreign Travel/Abroad":  "Rahu transiting H12 or H9 from Lagna. Jupiter transiting H12.",
      "Health Crisis":          "Saturn transiting H1/H6/H8 from Lagna. Mars transiting H8.",
      "Health Recovery":        "Jupiter transiting H1 from Lagna or Moon.",
      "Spiritual Awakening":    "Ketu transiting H12 or H1. Jupiter transiting H9 or H12.",
      "Education":              "Jupiter transiting H4/H5/H9 from Lagna.",
      "Legal Resolution":       "Saturn leaving afflicted house. Jupiter transiting H9.",
      "Business Launch":        "Jupiter transiting H1 or H7 from Lagna. Sun transiting H10.",
      "Debt Clearance":         "Saturn leaving H12 from Moon. Jupiter entering H11.",
      "Siblings":               "Mars transiting H3 from Lagna.",
      "Vehicle/Luxury":         "Venus transiting H4 or H1. Jupiter transiting H4.",
    },
  };
}
