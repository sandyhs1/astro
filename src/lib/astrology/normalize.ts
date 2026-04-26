/**
 * ASTROLOGY ENGINE — LAYER 3: NORMALIZER
 *
 * Converts raw AstrologyAPI.com bundle → GoldenMasterJSON.
 *
 * House system: Whole Sign (matches AstroSage, AstroTalk).
 * Karakas: Computed by Jaimini rules (degree within sign, descending).
 */

import type { RawAstroBundle } from "./batch-fetch";
import type { BirthParams } from "./client";
import crypto from "crypto";

// ─── Schema Types ─────────────────────────────────────────────────────────────

export interface PlanetData {
  name: string;
  fullDegree: number;       // 0–360°
  normDegree: number;       // 0–30° within sign
  speed: number;
  isRetro: boolean;
  sign: string;
  signNum: number;          // 1–12
  house: number;            // Whole Sign house (1–12)
  nakshatra: string;
  nakshatraPada: number;
  isExalted: boolean;
  isDebilitated: boolean;
  isCombust: boolean;
}

export interface HouseData {
  number: number;
  sign: string;
  signNum: number;
  occupants: string[];      // planet names
}

export interface GoldenMasterJSON {
  meta: {
    source: "astrologyapi.com";
    birthHash: string;
    generatedAt: string;
    apiErrors: Record<string, string>;
  };
  birth: {
    dob: string;
    tob: string;
    pob: string;
    lat: number;
    lon: number;
    tzone: number;
  };
  d1: {
    ascendant: string;
    ascendantDegree: number;
    moonSign: string;
    moonNakshatra: string;
    sunSign: string;
    planets: PlanetData[];
    houses: HouseData[];
  };
  divisional: {
    d9: { ascendant: string; planets: Array<{ name: string; sign: string; house: number }> };
    d10: { ascendant: string; planets: Array<{ name: string; sign: string; house: number }> };
  };
  dasha: {
    mahadasha: string;
    mahadashaEnd: string;
    antardasha: string;
    antardashaEnd: string;
    pratyantar: string;
    full: any;
  };
  karakas: {
    ak: string; amk: string; bk: string; mk: string; pk: string; gk: string; dk: string;
  };
  ashtakavarga: any;
  confidence: { score: number; warnings: string[] };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

function signNum(name: string): number {
  const idx = SIGNS.findIndex(s => s.toLowerCase() === name?.toLowerCase());
  return idx === -1 ? 0 : idx + 1;
}

function wholeSignHouse(planetSignNum: number, lagnaSignNum: number): number {
  return ((planetSignNum - lagnaSignNum + 12) % 12) + 1;
}

export function buildBirthHash(p: BirthParams): string {
  const key = `${p.day}-${p.month}-${p.year}-${p.hour}-${p.min}-${p.lat.toFixed(4)}-${p.lon.toFixed(4)}-${p.tzone}`;
  return crypto.createHash("sha256").update(key).digest("hex").slice(0, 16);
}

// ─── Main Normalizer ──────────────────────────────────────────────────────────

export function normalizeBundle(
  bundle: RawAstroBundle,
  params: BirthParams,
  pob: string,
  dobStr: string,
  tobStr: string,
): GoldenMasterJSON {
  const warnings: string[] = [];

  // ── Ascendant ────────────────────────────────────────────────────────────────
  const astro         = bundle.astroDetails || {};
  // NOTE: astrologyapi.com uses lowercase 'ascendant', 'sign' for moon, 'Naksahtra' (their typo)
  const ascendant: string  = astro.ascendant ?? astro.Ascendant ?? "";
  const ascendantDeg: number = 0; // Not provided in astro_details; sourced from planets array below
  const moonSign: string   = astro.sign ?? astro.moon_sign ?? astro.Moon_sign ?? "";
  const moonNak: string    = astro.Naksahtra ?? astro.nakshatra ?? astro.moon_nakshatra ?? ""; // 'Naksahtra' is their API typo
  const sunSign: string    = astro.sun_sign ?? astro.Sun_sign ?? "";

  if (!ascendant) warnings.push("CRITICAL: Ascendant missing");

  const lagnaSignNum = signNum(ascendant);

  // ── Planets ───────────────────────────────────────────────────────────────────
  const rawPlanets: any[] = Array.isArray(bundle.planets) ? bundle.planets : [];
  const rawExt: any[]     = Array.isArray(bundle.planetsExtended) ? bundle.planetsExtended : [];

  // Build extended lookup by name
  const extMap: Record<string, any> = {};
  for (const e of rawExt) {
    const n = e.name ?? e.planet_name ?? "";
    if (n) extMap[n.toLowerCase()] = e;
  }

  const PLANET_ORDER = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const planets: PlanetData[] = [];

  for (const rp of rawPlanets) {
    const name: string     = rp.name ?? rp.planet_name ?? "";
    const fullDeg: number  = parseFloat(rp.fullDegree ?? rp.full_degree ?? "0");
    const normDeg: number  = parseFloat(rp.normDegree ?? rp.norm_degree ?? rp.degree ?? "0");
    const speed: number    = parseFloat(rp.speed ?? "0");
    const isRetro: boolean = rp.isRetro === "true" || rp.isRetro === true || speed < 0;
    const pSign: string    = rp.sign ?? "";
    // sign_id from API is 1-based (1=Aries).
    const pSignId1: number = parseInt(rp.sign_id ?? rp.signId ?? String(signNum(pSign)), 10);
    // The API already provides the house number in the 'house' field (Whole Sign).
    const house: number    = parseInt(rp.house ?? "0", 10) || (lagnaSignNum ? wholeSignHouse(pSignId1, lagnaSignNum) : 0);
    const nak: string      = rp.nakshatra ?? rp.nakshatraName ?? "";
    const pada: number     = parseInt(rp.nakshatra_pad ?? rp.nakshatra_pada ?? rp.nakshatraPada ?? rp.Charan ?? "1", 10);

    const ext              = extMap[name.toLowerCase()] || {};
    const isExalted: boolean    = !!(ext.isExalted ?? ext.is_exalted);
    const isDebilitated: boolean= !!(ext.isDebilitated ?? ext.is_debilitated);
    const isCombust: boolean    = !!(ext.isCombust ?? ext.is_combust);

    if (!name) { warnings.push("Planet with missing name skipped"); continue; }
    if (!pSign) warnings.push(`${name}: missing sign`);

    planets.push({ name, fullDegree: fullDeg, normDegree: normDeg, speed, isRetro, sign: pSign, signNum: pSignId1, house, nakshatra: nak, nakshatraPada: pada, isExalted, isDebilitated, isCombust });
  }

  // Check all 9 planets present
  for (const expected of PLANET_ORDER) {
    if (!planets.find(p => p.name.toLowerCase() === expected.toLowerCase())) {
      warnings.push(`CRITICAL: Planet missing: ${expected}`);
    }
  }

  // ── Houses (Whole Sign) ───────────────────────────────────────────────────────
  const houses: HouseData[] = [];
  for (let i = 1; i <= 12; i++) {
    const hSign = SIGNS[(lagnaSignNum - 1 + i - 1) % 12] ?? "";
    const occupants = planets.filter(p => p.house === i).map(p => p.name);
    houses.push({ number: i, sign: hSign, signNum: ((lagnaSignNum - 1 + i - 1) % 12) + 1, occupants });
  }

  // D9/D10 from horo_chart/:chartId returns an array of house objects:
  // [{sign:3, sign_name:"Gemini", planet:["RAHU"], ...}]
  // First entry IS H1 (lagna house), not necessarily sign 1.
  function parseHoroChartArray(raw: any): { ascendant: string; planets: Array<{ name: string; sign: string; house: number }> } {
    if (!Array.isArray(raw) || raw.length === 0) return { ascendant: "", planets: [] };
    // First element = House 1 = Lagna
    const lagnaEntry = raw[0];
    const asc = lagnaEntry.sign_name ?? "";
    const result: Array<{ name: string; sign: string; house: number }> = [];
    for (let i = 0; i < raw.length; i++) {
      const houseNum = i + 1;
      const hEntry   = raw[i];
      const planetNames: string[] = hEntry.planet ?? [];
      for (const pName of planetNames) {
        // API returns uppercase: "RAHU", "SUN" etc.
        const formatted = pName.charAt(0).toUpperCase() + pName.slice(1).toLowerCase();
        result.push({ name: formatted, sign: hEntry.sign_name ?? "", house: houseNum });
      }
    }
    return { ascendant: asc, planets: result };
  }

  const d9  = parseHoroChartArray(bundle.horoChartD9);
  const d10 = parseHoroChartArray(bundle.horoChartD10);

  // ── Dasha Parsing ────────────────────────────────────────────────────────
  // AstrologyAPI returns dates in "D-M-YYYY  H:MM" format — NOT ISO.
  // e.g. "8-12-2010  3:44"  →  must be parsed manually.
  const cd = bundle.currentDasha || {};
  const md = bundle.majorDasha   || {};

  /**
   * Parse AstrologyAPI date string: "D-M-YYYY  H:MM" → Date
   */
  function parseAstroDate(s: string): Date {
    if (!s) return new Date(NaN);
    // "8-12-2010  3:44"  →  split on spaces+dash
    const clean = s.trim().replace(/\s+/g, " ");
    const parts = clean.split(" "); // ["8-12-2010", "3:44"]
    if (parts.length < 1) return new Date(NaN);
    const datePart  = parts[0]; // "8-12-2010"
    const timePart  = parts[1] || "0:00"; // "3:44"
    const [d, m, y] = datePart.split("-").map(Number);
    const [hr, min] = timePart.split(":").map(Number);
    if (!d || !m || !y) return new Date(NaN);
    return new Date(y, m - 1, d, hr || 0, min || 0, 0);
  }

  const now = new Date();

  let mahadasha     = "";
  let mahadashaEnd  = "";
  let antardasha    = "";
  let antardashaEnd = "";
  let pratyantar    = "";

  // majorDasha is an array of { planet, start, end }
  // currentDasha has { major: { dasha_period: [...] }, minor: {...}, sub_minor: {...} }
  const majorPeriods: any[] =
    (Array.isArray(md) ? md : null) ??
    cd.major?.dasha_period ??
    [];

  if (majorPeriods.length > 0) {
    const activeIdx = majorPeriods.findIndex((p: any) => {
      const s = parseAstroDate(p.start || "");
      const e = parseAstroDate(p.end   || "");
      return !isNaN(s.getTime()) && !isNaN(e.getTime()) && now >= s && now <= e;
    });

    const activePeriod = activeIdx >= 0 ? majorPeriods[activeIdx] : null;
    const nextPeriod   = activeIdx >= 0 ? majorPeriods[activeIdx + 1] : null;

    if (activePeriod) {
      mahadasha    = activePeriod.planet || activePeriod.name || "";
      mahadashaEnd = activePeriod.end    || "";
    } else {
      // No active found — find first future period
      const future = majorPeriods.find((p: any) => parseAstroDate(p.end || "") > now);
      if (future) { mahadasha = future.planet || ""; mahadashaEnd = future.end || ""; }
    }

    // Store next dasha in full for prompts
    (cd as any)._nextMahadasha   = nextPeriod?.planet || "";
    (cd as any)._nextMahadashaStart = nextPeriod?.start || "";
    (cd as any)._nextMahadashaEnd   = nextPeriod?.end   || "";
  }

  // Antardasha from currentDasha.minor
  if (cd.minor?.dasha_period) {
    const minorPeriods: any[] = cd.minor.dasha_period;
    const activeMinor = minorPeriods.find((p: any) => {
      const s = parseAstroDate(p.start || "");
      const e = parseAstroDate(p.end   || "");
      return !isNaN(s.getTime()) && !isNaN(e.getTime()) && now >= s && now <= e;
    });
    if (activeMinor) {
      antardasha    = activeMinor.planet || "";
      antardashaEnd = activeMinor.end    || "";
    }
  }

  // Pratyantar from currentDasha.sub_minor
  if (cd.sub_minor?.dasha_period) {
    const subMinorPeriods: any[] = cd.sub_minor.dasha_period;
    const activeSub = subMinorPeriods.find((p: any) => {
      const s = parseAstroDate(p.start || "");
      const e = parseAstroDate(p.end   || "");
      return !isNaN(s.getTime()) && !isNaN(e.getTime()) && now >= s && now <= e;
    });
    if (activeSub) pratyantar = activeSub.planet || "";
  }

  if (!mahadasha) {
    warnings.push("CRITICAL: Mahadasha could not be determined");
  }

  const dashaData = {
    mahadasha,
    mahadashaEnd,
    antardasha,
    antardashaEnd,
    pratyantar,
    full: { currentDasha: cd, majorDasha: md, allPeriods: majorPeriods },
  };

  // ── Jaimini Karakas ───────────────────────────────────────────────────────────
  // 7 planets (not Rahu/Ketu), ranked by normDegree descending
  const KARAKA_PLANETS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
  const KARAKA_LABELS  = ["ak","amk","bk","mk","pk","gk","dk"] as const;

  const karakaRanked = planets
    .filter(p => KARAKA_PLANETS.includes(p.name))
    .sort((a, b) => b.normDegree - a.normDegree);

  const karakas: any = {};
  KARAKA_LABELS.forEach((label, i) => {
    karakas[label] = karakaRanked[i]?.name ?? "";
  });

  // ── Confidence ────────────────────────────────────────────────────────────────
  const errorCount = Object.keys(bundle.errors).length + warnings.length;
  const score = Math.max(0, Math.round(100 - errorCount * 7));

  return {
    meta: {
      source: "astrologyapi.com",
      birthHash: buildBirthHash(params),
      generatedAt: new Date().toISOString(),
      apiErrors: bundle.errors,
    },
    birth: { dob: dobStr, tob: tobStr, pob, lat: params.lat, lon: params.lon, tzone: params.tzone },
    d1: { ascendant, ascendantDegree: ascendantDeg, moonSign, moonNakshatra: moonNak, sunSign, planets, houses },
    divisional: { d9, d10 },
    dasha: dashaData,
    karakas,
    ashtakavarga: bundle.sarvashtak ?? {},
    confidence: { score, warnings },
  };
}
