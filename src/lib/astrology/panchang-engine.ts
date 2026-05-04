/**
 * Vedic Panchang Engine — Pure TypeScript math (no external deps)
 * Works in both Node and browser environments.
 * Computes: Sunrise/Sunset, Choghadiya, Planetary Hora, Rahu Kaal,
 *           Abhijit Muhurat, Kubera Time, Tithi, Nakshatra, Yoga
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  nextSunrise: Date; // following day sunrise
}

export interface ChoghadiyaPeriod {
  name: string;
  start: Date;
  end: Date;
  quality: "auspicious" | "inauspicious" | "neutral";
  description: string;
  color: string;
  bgColor: string;
}

export interface HoraPeriod {
  planet: string;
  planetEmoji: string;
  start: Date;
  end: Date;
  quality: "good" | "bad" | "neutral";
  taskTip: string;
}

export interface PanchangData {
  tithi: { number: number; name: string; paksha: string };
  nakshatra: string;
  yoga: string;
  sunTimes: SunTimes;
  rahuKaal: { start: Date; end: Date };
  yamaganda: { start: Date; end: Date };
  gulikKaal: { start: Date; end: Date };
  abhijit: { start: Date; end: Date };
  kubera: { start: Date; end: Date };
  dayChoghadiya: ChoghadiyaPeriod[];
  nightChoghadiya: ChoghadiyaPeriod[];
  horas: HoraPeriod[];
  weekdayLord: string;
}

export interface MuhuratWindow {
  date: string;
  start: Date;
  end: Date;
  choghadiya: string;
  score: number;
  grade: "god" | "diamond" | "gold";
  reasons: string[];
  avoid: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CHOGHADIYA_META: Record<string, {
  quality: "auspicious" | "inauspicious" | "neutral";
  desc: string;
  color: string;
  bgColor: string;
}> = {
  Amrit:  { quality: "auspicious",   desc: "Most auspicious. Ideal for new beginnings, investments, health.",  color: "#059669", bgColor: "#ECFDF5" },
  Shubh:  { quality: "auspicious",   desc: "Auspicious for marriage, business deals, and ceremonies.",         color: "#2563EB", bgColor: "#EFF6FF" },
  Labh:   { quality: "auspicious",   desc: "Favorable for financial gains, learning, and trade.",               color: "#7C3AED", bgColor: "#F5F3FF" },
  Chal:   { quality: "neutral",      desc: "Neutral. Suitable for travel, movement, and transit.",              color: "#6B7280", bgColor: "#F9FAFB" },
  Kaal:   { quality: "inauspicious", desc: "Avoid new starts. Best for completing existing tasks quietly.",     color: "#DC2626", bgColor: "#FEF2F2" },
  Rog:    { quality: "inauspicious", desc: "Inauspicious. Avoid health matters, new ventures, arguments.",      color: "#B91C1C", bgColor: "#FFF1F2" },
  Udveg:  { quality: "inauspicious", desc: "Government matters problematic. Avoid important decisions.",        color: "#D97706", bgColor: "#FFFBEB" },
};

// Day choghadiya sequence per weekday (0=Sun … 6=Sat)
const DAY_CHOG: string[][] = [
  ["Udveg","Chal","Labh","Amrit","Kaal","Shubh","Rog","Udveg"],   // Sun
  ["Amrit","Kaal","Shubh","Rog","Udveg","Chal","Labh","Amrit"],   // Mon
  ["Rog","Udveg","Chal","Labh","Amrit","Kaal","Shubh","Rog"],     // Tue
  ["Labh","Amrit","Kaal","Shubh","Rog","Udveg","Chal","Labh"],    // Wed
  ["Shubh","Rog","Udveg","Chal","Labh","Amrit","Kaal","Shubh"],   // Thu
  ["Chal","Labh","Amrit","Kaal","Shubh","Rog","Udveg","Chal"],    // Fri
  ["Kaal","Shubh","Rog","Udveg","Chal","Labh","Amrit","Kaal"],    // Sat
];

// Night choghadiya sequence per weekday
const NIGHT_CHOG: string[][] = [
  ["Shubh","Amrit","Chal","Rog","Kaal","Labh","Udveg","Shubh"],   // Sun
  ["Chal","Rog","Kaal","Labh","Udveg","Shubh","Amrit","Chal"],    // Mon
  ["Kaal","Labh","Udveg","Shubh","Amrit","Chal","Rog","Kaal"],    // Tue
  ["Udveg","Shubh","Amrit","Chal","Rog","Kaal","Labh","Udveg"],   // Wed
  ["Amrit","Chal","Rog","Kaal","Labh","Udveg","Shubh","Amrit"],   // Thu
  ["Rog","Kaal","Labh","Udveg","Shubh","Amrit","Chal","Rog"],     // Fri
  ["Labh","Udveg","Shubh","Amrit","Chal","Rog","Kaal","Labh"],    // Sat
];

// Rahu Kaal 8-slot index (0-based) per weekday — verified traditional formula
const RAHU_SLOT:    number[] = [7, 1, 6, 4, 5, 3, 2]; // Sun Mon Tue Wed Thu Fri Sat
const YAMAGANDA_SLOT: number[] = [4, 6, 3, 5, 2, 0, 1];
const GULIK_SLOT:   number[] = [6, 5, 4, 3, 2, 1, 0];

// Planetary Hora — Chaldean sequence
const HORA_SEQ    = ["Sun","Venus","Mercury","Moon","Saturn","Jupiter","Mars"];
const HORA_START  = [0, 3, 6, 2, 5, 1, 4]; // Start index per weekday
const HORA_META: Record<string, { emoji: string; quality: "good"|"bad"|"neutral"; tip: string }> = {
  Sun:     { emoji: "☀️",  quality: "neutral", tip: "Leadership, authority, government. Good for recognition." },
  Venus:   { emoji: "♀️",  quality: "good",    tip: "Beauty, luxury, love. Best for buying, romance, art." },
  Mercury: { emoji: "☿️",  quality: "good",    tip: "Communication, intellect. Best for study, deals, writing." },
  Moon:    { emoji: "🌙",  quality: "good",    tip: "Emotions, public, creativity. Good for social work." },
  Saturn:  { emoji: "♄",   quality: "bad",     tip: "Discipline, delays. Avoid important starts today." },
  Jupiter: { emoji: "♃",   quality: "good",    tip: "Wisdom, wealth, blessings. Best for finance, teaching." },
  Mars:    { emoji: "♂️",  quality: "bad",     tip: "Action, conflict. Good for gym; avoid agreements." },
};

const WEEKDAY_LORDS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];

const TITHI_NAMES = [
  "Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami",
  "Shashthi","Saptami","Ashtami","Navami","Dashami",
  "Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima",
  "Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami",
  "Shashthi","Saptami","Ashtami","Navami","Dashami",
  "Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Amavasya",
];

const NAKSHATRAS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashirsha","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Moola","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha",
  "Purva Bhadrapada","Uttara Bhadrapada","Revati",
];

const YOGAS = [
  "Vishkambha","Preeti","Ayushman","Saubhagya","Shobhana","Atiganda",
  "Sukarman","Dhriti","Shoola","Ganda","Vriddhi","Dhruva",
  "Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyana",
  "Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla",
  "Brahma","Indra","Vaidhriti",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toRad(d: number) { return d * Math.PI / 180; }
function toDeg(r: number) { return r * 180 / Math.PI; }

function getJulianDay(date: Date): number {
  let y = date.getUTCFullYear();
  let m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

function addDays(date: Date, n: number): Date {
  return new Date(date.getTime() + n * 86400000);
}

// ─── Sunrise / Sunset ─────────────────────────────────────────────────────────

export function calculateSunTimes(date: Date, lat: number, lon: number): SunTimes {
  const compute = (d: Date) => {
    const JD = getJulianDay(d);
    const n  = JD - 2451545.0;
    const L  = (280.460 + 0.9856474 * n) % 360;
    const g  = toRad((357.528 + 0.9856003 * n) % 360);
    const lambda = toRad(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
    const eps = toRad(23.439 - 0.0000004 * n);
    const sinDec = Math.sin(eps) * Math.sin(lambda);
    const dec = Math.asin(sinDec);
    const latR = toRad(lat);
    const cosH = (Math.cos(toRad(90.833)) - Math.sin(latR) * sinDec) / (Math.cos(latR) * Math.cos(dec));
    const H = toDeg(Math.acos(Math.max(-1, Math.min(1, cosH))));
    const B = toRad(360 / 365 * (JD - 81));
    const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const noonUTC = 12 - lon / 15 - EoT / 60;
    const riseUTC = noonUTC - H / 15;
    const setUTC  = noonUTC + H / 15;
    const base = new Date(d); base.setUTCHours(0, 0, 0, 0);
    return {
      sunrise:   new Date(base.getTime() + riseUTC * 3600000),
      sunset:    new Date(base.getTime() + setUTC  * 3600000),
      solarNoon: new Date(base.getTime() + noonUTC * 3600000),
    };
  };
  const today    = compute(date);
  const tomorrow = compute(addDays(date, 1));
  return { ...today, nextSunrise: tomorrow.sunrise };
}

// ─── Choghadiya ───────────────────────────────────────────────────────────────

export function calculateChoghadiya(
  date: Date, sunrise: Date, sunset: Date, nextSunrise: Date
): { day: ChoghadiyaPeriod[]; night: ChoghadiyaPeriod[] } {
  const dow = date.getDay();
  const build = (names: string[], from: Date, to: Date): ChoghadiyaPeriod[] => {
    const dur = (to.getTime() - from.getTime()) / 8;
    return names.map((name, i) => {
      const m = CHOGHADIYA_META[name];
      return {
        name, quality: m.quality, description: m.desc, color: m.color, bgColor: m.bgColor,
        start: new Date(from.getTime() + i * dur),
        end:   new Date(from.getTime() + (i + 1) * dur),
      };
    });
  };
  return {
    day:   build(DAY_CHOG[dow],   sunrise, sunset),
    night: build(NIGHT_CHOG[dow], sunset,  nextSunrise),
  };
}

// ─── Planetary Hora ───────────────────────────────────────────────────────────

export function calculateHoras(date: Date, sunrise: Date): HoraPeriod[] {
  const dow = date.getDay();
  const startIdx = HORA_START[dow];
  return Array.from({ length: 24 }, (_, i) => {
    const planet = HORA_SEQ[(startIdx + i) % 7];
    const m = HORA_META[planet];
    return {
      planet, planetEmoji: m.emoji, quality: m.quality, taskTip: m.tip,
      start: new Date(sunrise.getTime() + i * 3600000),
      end:   new Date(sunrise.getTime() + (i + 1) * 3600000),
    };
  });
}

// ─── Bad Times ────────────────────────────────────────────────────────────────

function computeSlot(sunrise: Date, sunset: Date, slotArr: number[], dow: number) {
  const slotMs = (sunset.getTime() - sunrise.getTime()) / 8;
  const idx = slotArr[dow];
  return {
    start: new Date(sunrise.getTime() + idx * slotMs),
    end:   new Date(sunrise.getTime() + (idx + 1) * slotMs),
  };
}

export function calculateRahuKaal  (d: Date, rise: Date, set: Date) { return computeSlot(rise, set, RAHU_SLOT,     d.getDay()); }
export function calculateYamaganda (d: Date, rise: Date, set: Date) { return computeSlot(rise, set, YAMAGANDA_SLOT, d.getDay()); }
export function calculateGulikKaal  (d: Date, rise: Date, set: Date) { return computeSlot(rise, set, GULIK_SLOT,    d.getDay()); }

// ─── Auspicious Specials ──────────────────────────────────────────────────────

export function calculateAbhijit(solarNoon: Date) {
  return { start: new Date(solarNoon.getTime() - 24 * 60000), end: new Date(solarNoon.getTime() + 24 * 60000) };
}

// Kubera Time — Jupiter Hora closest to business hours each weekday
export function calculateKuberaTime(date: Date, horas: HoraPeriod[]): { start: Date; end: Date } {
  const jupHoras = horas.filter(h => h.planet === "Jupiter");
  // Find first Jupiter hora that falls between 9 AM and 4 PM local (use UTC heuristic)
  const preferred = jupHoras.find(h => {
    const hr = h.start.getUTCHours();
    return hr >= 3 && hr <= 12; // 9 AM to 6 PM IST
  }) || jupHoras[0];
  return preferred ? { start: preferred.start, end: preferred.end } : { start: date, end: date };
}

// ─── Tithi / Nakshatra / Yoga ─────────────────────────────────────────────────

export function computeTithi(moonLon: number, sunLon: number) {
  let diff = ((moonLon - sunLon) % 360 + 360) % 360;
  const num = Math.floor(diff / 12) + 1;
  return {
    number: num,
    name:   TITHI_NAMES[num - 1] || "Pratipada",
    paksha: num <= 15 ? "Shukla Paksha" : "Krishna Paksha",
  };
}

export function computeNakshatra(moonLon: number): string {
  return NAKSHATRAS[Math.floor(((moonLon % 360) / (360 / 27))) % 27];
}

export function computeYoga(sunLon: number, moonLon: number): string {
  return YOGAS[Math.floor((((sunLon + moonLon) % 360) / (360 / 27))) % 27];
}

// ─── Muhurat Finder ───────────────────────────────────────────────────────────

const EVENT_BEST_CHOG: Record<string, string[]> = {
  "Business Launch":   ["Amrit", "Labh", "Shubh"],
  "Wedding":           ["Shubh", "Amrit", "Labh"],
  "Travel":            ["Chal", "Amrit", "Labh"],
  "House Warming":     ["Shubh", "Amrit"],
  "Medical Procedure": ["Amrit", "Shubh"],
  "Job / Interview":   ["Shubh", "Labh", "Amrit"],
  "Finance":           ["Labh", "Amrit"],
  "Education":         ["Labh", "Amrit", "Shubh"],
  "General":           ["Amrit", "Shubh", "Labh"],
};

export function findMuhurats(
  startDate: Date, endDate: Date, lat: number, lon: number, eventType: string
): MuhuratWindow[] {
  const best = EVENT_BEST_CHOG[eventType] || EVENT_BEST_CHOG["General"];
  const results: MuhuratWindow[] = [];
  const cursor = new Date(startDate); cursor.setHours(0, 0, 0, 0);
  const end = new Date(endDate); end.setHours(23, 59, 59, 999);

  while (cursor <= end && results.length < 20) {
    const sun = calculateSunTimes(cursor, lat, lon);
    const chog = calculateChoghadiya(cursor, sun.sunrise, sun.sunset, sun.nextSunrise);
    const rahu = calculateRahuKaal(cursor, sun.sunrise, sun.sunset);
    const abhijit = calculateAbhijit(sun.solarNoon);

    const allPeriods = [...chog.day, ...chog.night];

    for (const period of allPeriods) {
      // Skip Rahu Kaal overlap
      const rahuOverlap = period.start < rahu.end && period.end > rahu.start;
      if (rahuOverlap) continue;

      const isBest = best.includes(period.name);
      if (!isBest) continue;

      // Abhijit bonus
      const abhijitOverlap = period.start < abhijit.end && period.end > abhijit.start;
      const rankIdx = best.indexOf(period.name);

      let score = 60 + (2 - rankIdx) * 15;
      const reasons: string[] = [CHOGHADIYA_META[period.name]?.desc || ""];

      if (abhijitOverlap) {
        score += 20;
        reasons.push("Overlaps Abhijit Muhurat — most auspicious time of day");
      }

      const grade: MuhuratWindow["grade"] = score >= 90 ? "god" : score >= 75 ? "diamond" : "gold";

      const dateStr = cursor.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
      results.push({ date: dateStr, start: period.start, end: period.end, choghadiya: period.name, score, grade, reasons, avoid: false });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 12);
}

// ─── Full Panchang Builder ────────────────────────────────────────────────────

export function buildFullPanchang(
  date: Date, lat: number, lon: number,
  moonLon: number, sunLon: number
): PanchangData {
  const sunTimes = calculateSunTimes(date, lat, lon);
  const { day, night } = calculateChoghadiya(date, sunTimes.sunrise, sunTimes.sunset, sunTimes.nextSunrise);
  const horas = calculateHoras(date, sunTimes.sunrise);

  return {
    tithi:        computeTithi(moonLon, sunLon),
    nakshatra:    computeNakshatra(moonLon),
    yoga:         computeYoga(sunLon, moonLon),
    sunTimes,
    rahuKaal:     calculateRahuKaal(date,   sunTimes.sunrise, sunTimes.sunset),
    yamaganda:    calculateYamaganda(date,  sunTimes.sunrise, sunTimes.sunset),
    gulikKaal:    calculateGulikKaal(date,  sunTimes.sunrise, sunTimes.sunset),
    abhijit:      calculateAbhijit(sunTimes.solarNoon),
    kubera:       calculateKuberaTime(date, horas),
    dayChoghadiya: day,
    nightChoghadiya: night,
    horas,
    weekdayLord:  WEEKDAY_LORDS[date.getDay()],
  };
}
