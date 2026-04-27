/**
 * ASTROLOGY ENGINE — LAYER 3: NORMALIZER
 *
 * Converts raw AstrologyAPI.com bundle → GoldenMasterJSON.
 *
 * House system: Whole Sign (matches AstroSage, AstroTalk).
 * Karakas: Computed by Jaimini rules (degree within sign, descending).
 * D9 (Navamsha): Self-computed using Mean Nodes for Rahu/Ketu.
 *   - API uses True Rahu/Ketu (Swiss Ephemeris oscillating nodes).
 *   - Classical Parashari Jyotish mandates Mean Rahu/Ketu (uniform motion).
 *   - For boundary-sitting charts, True vs Mean can shift Rahu/Ketu by 1 D9 house.
 *   - All traditional software (JHora, AstroSage, Parashara's Light, Kala) use Mean nodes.
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

// ─── Mean Node Calculation ────────────────────────────────────────────────────
//
// Computes Mean Rahu (ascending node) sidereal longitude using:
//   - IAU 1980 formula: Ω = 125.04452 − 1934.136261·T (tropical)
//   - Lahiri ayanamsa for sidereal conversion
//
// This matches the node position used by JHora, Parashara's Light, and all
// traditional Parashari Jyotish software for Navamsha computation.

function meanRahuSidereal(
  year: number, month: number, day: number, hour: number, min: number
): number {
  // Julian Day Number for birth moment
  const a   = Math.floor((14 - month) / 12);
  const y   = year + 4800 - a;
  const m   = month + 12 * a - 3;
  const jdn = day
    + Math.floor((153 * m + 2) / 5)
    + 365 * y
    + Math.floor(y / 4)
    - Math.floor(y / 100)
    + Math.floor(y / 400)
    - 32045;
  const jd = jdn + (hour - 12 + min / 60) / 24;

  // Julian centuries from J2000.0 (JD 2451545.0)
  const T = (jd - 2451545.0) / 36525.0;

  // Mean ascending node tropical longitude (IAU 1980)
  const rahuTropical = ((125.04452 - 1934.136261 * T + 0.0020708 * T * T) % 360 + 360) % 360;

  // Lahiri ayanamsa (accurate to ~0.05° for 1900–2100)
  // Base: 23.85° at J2000.0, rate: 50.29"/year
  const lahiriAyanamsa = 23.85 + (T * 100 * 50.29) / 3600;

  // Sidereal = Tropical − Ayanamsa
  const rahuSidereal = ((rahuTropical - lahiriAyanamsa) % 360 + 360) % 360;
  return rahuSidereal;
}

// ─── D9 (Navamsha) Self-Computation ──────────────────────────────────────────
//
// Formula: D9 sign index (0-11) = floor(fullDegree × 9 / 30) % 12
// This is the universal Navamsha formula — independent of sign category.

function d9SignIdx(fullDegree: number): number {
  return Math.floor((fullDegree * 9) / 30) % 12;
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
  const ascendant: string  = astro.ascendant ?? astro.Ascendant ?? "";
  const ascendantDeg: number = 0;
  const moonSign: string   = astro.sign ?? astro.moon_sign ?? astro.Moon_sign ?? "";
  const moonNak: string    = astro.Naksahtra ?? astro.nakshatra ?? astro.moon_nakshatra ?? "";
  const sunSign: string    = astro.sun_sign ?? astro.Sun_sign ?? "";

  if (!ascendant) warnings.push("CRITICAL: Ascendant missing");

  const lagnaSignNum = signNum(ascendant);

  // ── Planets ───────────────────────────────────────────────────────────────────
  const rawPlanets: any[] = Array.isArray(bundle.planets) ? bundle.planets : [];
  const rawExt: any[]     = Array.isArray(bundle.planetsExtended) ? bundle.planetsExtended : [];

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
    const pSignId1: number = parseInt(rp.sign_id ?? rp.signId ?? String(signNum(pSign)), 10);
    const house: number    = parseInt(rp.house ?? "0", 10) || (lagnaSignNum ? wholeSignHouse(pSignId1, lagnaSignNum) : 0);
    const nak: string      = rp.nakshatra ?? rp.nakshatraName ?? "";
    const pada: number     = parseInt(rp.nakshatra_pad ?? rp.nakshatra_pada ?? rp.nakshatraPada ?? rp.Charan ?? "1", 10);

    const ext                    = extMap[name.toLowerCase()] || {};
    const isExalted: boolean     = !!(ext.isExalted ?? ext.is_exalted);
    const isDebilitated: boolean = !!(ext.isDebilitated ?? ext.is_debilitated);
    const isCombust: boolean     = !!(ext.isCombust ?? ext.is_combust);

    if (!name) { warnings.push("Planet with missing name skipped"); continue; }
    // Skip the 'Ascendant' pseudo-planet — it is NOT a graha
    if (name.toLowerCase() === "ascendant") continue;
    if (!pSign) warnings.push(`${name}: missing sign`);

    planets.push({ name, fullDegree: fullDeg, normDegree: normDeg, speed, isRetro, sign: pSign, signNum: pSignId1, house, nakshatra: nak, nakshatraPada: pada, isExalted, isDebilitated, isCombust });
  }

  for (const expected of PLANET_ORDER) {
    if (!planets.find(p => p.name.toLowerCase() === expected.toLowerCase())) {
      warnings.push(`CRITICAL: Planet missing: ${expected}`);
    }
  }

  // ── Houses (Whole Sign) ───────────────────────────────────────────────────────
  // Use horo_chart/D1 (API's own Whole Sign house chart) as authoritative source.
  const houses: HouseData[] = [];

  if (Array.isArray(bundle.horoChartD1) && bundle.horoChartD1.length === 12) {
    for (let i = 0; i < 12; i++) {
      const hEntry = bundle.horoChartD1[i];
      const hSign  = hEntry.sign_name ?? SIGNS[(lagnaSignNum - 1 + i) % 12] ?? "";
      const rawOcc: string[] = hEntry.planet ?? [];
      const occupants = rawOcc
        .filter((pn: string) => pn.toLowerCase() !== "ascendant")
        .map((pn: string) => pn.charAt(0).toUpperCase() + pn.slice(1).toLowerCase());
      houses.push({ number: i + 1, sign: hSign, signNum: ((lagnaSignNum - 1 + i) % 12) + 1, occupants });
    }
  } else {
    // Fallback: compute from planet sign positions
    for (let i = 1; i <= 12; i++) {
      const hSign = SIGNS[(lagnaSignNum - 1 + i - 1) % 12] ?? "";
      const occupants = planets.filter(p => p.house === i).map(p => p.name);
      houses.push({ number: i, sign: hSign, signNum: ((lagnaSignNum - 1 + i - 1) % 12) + 1, occupants });
    }
  }

  // ── D9 (Navamsha) — Self-computed with Mean Nodes ─────────────────────────────
  //
  // The API's horo_chart/D9 uses True Rahu/Ketu (oscillating nodes).
  // Classical Parashari Jyotish mandates Mean nodes.
  // For charts where True Rahu sits at a Navamsha pada boundary (as in Chart 1 / 1985),
  // True and Mean nodes produce different D9 house placements.
  // We compute D9 from first principles, substituting Mean Rahu/Ketu for the nodes.

  // 1. Compute Mean Rahu/Ketu sidereal longitude
  const mRahu = meanRahuSidereal(params.year, params.month, params.day, params.hour, params.min);
  const mKetu = (mRahu + 180) % 360;

  // 2. D9 Lagna — from ascendant full degree (use "Ascendant" raw entry)
  const ascRaw    = rawPlanets.find((rp: any) => (rp.name ?? "").toLowerCase() === "ascendant");
  const ascFull   = ascRaw ? parseFloat(ascRaw.fullDegree ?? ascRaw.full_degree ?? "0") : (lagnaSignNum - 1) * 30;
  const d9LagnaIdx  = d9SignIdx(ascFull);
  const d9LagnaSign = SIGNS[d9LagnaIdx] ?? "";

  // 3. Compute D9 sign and house for each planet
  const d9Planets: Array<{ name: string; sign: string; house: number }> = planets.map((p: PlanetData) => {
    // Use Mean node for Rahu/Ketu; True (API) position for all other planets
    const fullDeg = (p.name === "Rahu") ? mRahu : (p.name === "Ketu") ? mKetu : p.fullDegree;
    const sIdx    = d9SignIdx(fullDeg);
    const d9Sign  = SIGNS[sIdx] ?? "";
    const d9House = ((sIdx - d9LagnaIdx + 12) % 12) + 1;
    return { name: p.name, sign: d9Sign, house: d9House };
  });

  const d9 = { ascendant: d9LagnaSign, planets: d9Planets };

  // ── D10 — use API array (no node-type issue in D10) ───────────────────────────
  function parseHoroChartArray(raw: any): { ascendant: string; planets: Array<{ name: string; sign: string; house: number }> } {
    if (!Array.isArray(raw) || raw.length === 0) return { ascendant: "", planets: [] };
    const lagnaEntry = raw[0];
    const asc = lagnaEntry.sign_name ?? "";
    const result: Array<{ name: string; sign: string; house: number }> = [];
    for (let i = 0; i < raw.length; i++) {
      const houseNum = i + 1;
      const hEntry   = raw[i];
      const planetNames: string[] = hEntry.planet ?? [];
      for (const pName of planetNames) {
        const formatted = pName.charAt(0).toUpperCase() + pName.slice(1).toLowerCase();
        result.push({ name: formatted, sign: hEntry.sign_name ?? "", house: houseNum });
      }
    }
    return { ascendant: asc, planets: result };
  }

  const d10 = parseHoroChartArray(bundle.horoChartD10);

  // ── Dasha Parsing ────────────────────────────────────────────────────────
  // AstrologyAPI returns dates in "D-M-YYYY  H:MM" format — NOT ISO.
  const cd = bundle.currentDasha || {};
  const md = bundle.majorDasha   || {};

  function parseAstroDate(s: string): Date {
    if (!s) return new Date(NaN);
    const clean = s.trim().replace(/\s+/g, " ");
    const parts = clean.split(" ");
    if (parts.length < 1) return new Date(NaN);
    const datePart  = parts[0];
    const timePart  = parts[1] || "0:00";
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
      const future = majorPeriods.find((p: any) => parseAstroDate(p.end || "") > now);
      if (future) { mahadasha = future.planet || ""; mahadashaEnd = future.end || ""; }
    }

    (cd as any)._nextMahadasha      = nextPeriod?.planet || "";
    (cd as any)._nextMahadashaStart = nextPeriod?.start  || "";
    (cd as any)._nextMahadashaEnd   = nextPeriod?.end    || "";
  }

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
