/**
 * TRANSIT SCORING ENGINE
 * 
 * Computes a 30-day auspicious score for each day using:
 * - Classical Vedic transit rules (Chandra-based: judged from Moon sign)
 * - Mean planet daily motions
 * - Antardasha lord bonus
 * - Moon nakshatra favorability
 */

export interface DayScore {
  date: Date;
  dateStr: string;         // "Mon, 25 Apr"
  score: number;           // 0–10
  grade: "excellent" | "good" | "neutral" | "caution" | "rest";
  color: string;
  factors: string[];       // human-readable reasons
  dominantPlanet: string;  // top influencer
}

// ── Mean daily motions (degrees/day) ──────────────────────────────────────────
const DAILY_MOTION: Record<string, number> = {
  Sun:     0.9856,
  Moon:    13.176,
  Mars:    0.524,
  Mercury: 1.383,   // approximate — ignores retro phases
  Jupiter: 0.083,
  Venus:   1.200,
  Saturn:  0.034,
  Rahu:   -0.053,   // always retrograde
  Ketu:   -0.053,
};

// ── Classical transit scores from natal Moon sign (Chandra Vedha) ─────────────
// Value = score when planet transits this house FROM natal Moon sign (1-based)
// Positive = auspicious, Negative = inauspicious
const CHANDRA_TRANSIT: Record<string, Record<number, number>> = {
  Jupiter: { 1: 0,  2: 3,  3: 0,  4: -1, 5: 3,  6: -1, 7: 1,  8: -2, 9: 3,  10: -1, 11: 3,  12: -1 },
  Venus:   { 1: 2,  2: 3,  3: 2,  4: 2,  5: 3,  6: 1,  7: 2,  8: 2,  9: 2,  10: 1,  11: 3,  12: 1  },
  Mercury: { 1: 1,  2: 2,  3: 1,  4: 2,  5: 1,  6: 1,  7: 0,  8: 2,  9: 0,  10: 1,  11: 2,  12: 0  },
  Moon:    { 1: -1, 2: 1,  3: 2,  4: 0,  5: -1, 6: 1,  7: -1, 8: -2, 9: 1,  10: 0,  11: 2,  12: -1 },
  Sun:     { 1: -2, 2: 0,  3: 2,  4: -1, 5: -2, 6: 2,  7: -1, 8: -1, 9: -3, 10: 2,  11: 2,  12: -2 },
  Mars:    { 1: -2, 2: -1, 3: 2,  4: -2, 5: -2, 6: 2,  7: -2, 8: -3, 9: -1, 10: -2, 11: 2,  12: -3 },
  Saturn:  { 1: -3, 2: -2, 3: 2,  4: -3, 5: -3, 6: 2,  7: -3, 8: -3, 9: -2, 10: -2, 11: 3,  12: -2 },
  Rahu:    { 1: -2, 2: 1,  3: 1,  4: -2, 5: -1, 6: 2,  7: -2, 8: -2, 9: -1, 10: -1, 11: 2,  12: -2 },
  Ketu:    { 1: -2, 2: -1, 3: 1,  4: -1, 5: -1, 6: 1,  7: -1, 8: -2, 9: -1, 10: -1, 11: 1,  12: -2 },
};

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

function signNumOf(name: string): number {
  const idx = SIGNS.findIndex(s => s.toLowerCase() === name?.toLowerCase());
  return idx === -1 ? 1 : idx + 1;
}

function degToSignNum(fullDeg: number): number {
  return Math.floor(((fullDeg % 360) + 360) % 360 / 30) + 1;
}

function houseFromMoon(transitSignNum: number, moonSignNum: number): number {
  return ((transitSignNum - moonSignNum + 12) % 12) + 1;
}

const GRADE_MAP = (s: number): DayScore["grade"] => {
  if (s >= 8) return "excellent";
  if (s >= 6) return "good";
  if (s >= 4) return "neutral";
  if (s >= 2) return "caution";
  return "rest";
};

const COLOR_MAP: Record<DayScore["grade"], string> = {
  excellent: "#22c55e",  // deep green
  good:      "#86efac",  // light green
  neutral:   "#fbbf24",  // amber
  caution:   "#f97316",  // orange
  rest:      "#ef4444",  // red
};

const PLANET_NAMES: Record<string, string> = {
  Jupiter: "Jupiter (Guru)", Venus: "Venus (Shukra)", Mercury: "Mercury (Budha)",
  Sun: "Sun (Surya)", Moon: "Moon (Chandra)", Mars: "Mars (Mangal)",
  Saturn: "Saturn (Shani)", Rahu: "Rahu (Shadow)", Ketu: "Ketu (Shadow)",
};

/**
 * Compute 30-day transit calendar starting from today.
 * @param natalPlanets - from GoldenMasterJSON.d1.planets
 * @param transitPlanets - current sky positions (today's planets from API)
 * @param moonSignNum - natal moon sign number (1-12)
 * @param antardashaLord - current antardasha planet name
 */
export function computeCalendar(
  natalPlanets: Array<{ name: string; fullDegree: number; sign: string }>,
  transitPlanets: Array<{ name: string; fullDegree: number }>,
  moonSignNum: number,
  antardashaLord: string,
): DayScore[] {
  const days: DayScore[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build transit position map (today)
  const transitMap: Record<string, number> = {};
  for (const p of transitPlanets) {
    transitMap[p.name] = p.fullDegree;
  }

  const DAYS_IN_MONTH = 30;

  for (let d = 0; d < DAYS_IN_MONTH; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);

    const factors: string[] = [];
    let rawScore = 0;
    const planetScores: Record<string, number> = {};

    for (const planet of Object.keys(DAILY_MOTION)) {
      const baseDeg = transitMap[planet];
      if (baseDeg === undefined) continue;

      // Advance planet position by mean motion × days
      const advancedDeg = (baseDeg + DAILY_MOTION[planet] * d + 360) % 360;
      const transitSignNum = degToSignNum(advancedDeg);
      const house = houseFromMoon(transitSignNum, moonSignNum);
      const pts = CHANDRA_TRANSIT[planet]?.[house] ?? 0;

      if (pts !== 0) {
        rawScore += pts;
        planetScores[planet] = pts;
        if (pts >= 2) factors.push(`${PLANET_NAMES[planet]} in H${house} from Moon`);
        if (pts <= -2) factors.push(`${PLANET_NAMES[planet]} challenges H${house}`);
      }

      // Antardasha lord bonus: +2 if it transits a favorable house (3/6/11)
      if (planet === antardashaLord && [3, 6, 11].includes(house)) {
        rawScore += 2;
        factors.push(`${antardashaLord} Antardasha lord in H${house} — peak activation`);
      }
    }

    // Normalize to 0–10 scale (raw range is roughly -15 to +15)
    const score = Math.min(10, Math.max(0, Math.round(5 + (rawScore / 3))));

    // Find dominant planet (most impactful)
    const dominant = Object.entries(planetScores)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0]?.[0] || "Saturn";

    const grade = GRADE_MAP(score);

    const dateStr = date.toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short",
    });

    days.push({
      date,
      dateStr,
      score,
      grade,
      color: COLOR_MAP[grade],
      factors: factors.slice(0, 3),
      dominantPlanet: dominant,
    });
  }

  return days;
}
