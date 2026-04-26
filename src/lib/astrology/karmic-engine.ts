/**
 * KARMIC INTELLIGENCE ENGINE
 *
 * Pure computation layer — zero API calls.
 * Derives "The 5 Echoes" from GoldenMasterJSON + raw divisional chart data.
 *
 * Echo 1 — VARGOTTAMA/BHAVOTTAMA:
 *   Planet appears in same sign across D1 & D9 (Vargottama).
 *   Also checks D10 and D60 for multi-chart lock (Bhavottama).
 *
 * Echo 2 — SOUL-SPOUSE BRIDGE:
 *   6/8 or 1/7 axis between Atmakaraka (AK) and Darakaraka (DK) in D9.
 *
 * Echo 3 — PUBLIC-PRIVATE GAP:
 *   Arudha Lagna (AL) vs Upapada Lagna (UL) vs 12th from UL.
 *
 * Echo 4 — LIFE-FORCE SYNC:
 *   Pranapada Lagna distance from Birth Lagna (mod 12).
 *
 * Echo 5 — MALEFIC CLUSTERING:
 *   Rahu / Ketu / Saturn hitting same bhava theme across D1, D3, D12.
 */

import type { GoldenMasterJSON } from "./normalize";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VargottamaPlanet {
  name: string;
  sign: string;          // sign locked in D1 & D9
  d1House: number;
  d9House: number;
  isD10Match: boolean;   // also same house theme in D10
  isD60Match: boolean;   // also found in D60 (if data available)
  strength: "Triple" | "Double" | "Single"; // D1+D9+D10/D60 → Triple, D1+D9 → Double
}

export interface SoulSpouseBridge {
  akPlanet: string;
  dkPlanet: string;
  akD9House: number;
  dkD9House: number;
  relationship: "1/7 Opposition" | "6/8 Karmic Axis" | "Neutral";
  interpretation: string;
}

export interface PublicPrivateGap {
  arudhaLagnaHouse: number;
  upapadaLagnaHouse: number;
  twelfthFromUL: number;
  gap: number;           // house distance between AL and UL
  gapType: "Aligned" | "Moderate Gap" | "Strong Tension";
}

export interface LifeForceSync {
  pranaPadaHouse: number;
  birthLagnaHouse: number;   // always 1
  distanceFromLagna: number; // 1–12
  syncType: "Strong Sync" | "Moderate" | "Weak Sync";
}

export interface MaleficCluster {
  planet: "Rahu" | "Ketu" | "Saturn";
  d1House: number;
  d3House: number | null;
  d12House: number | null;
  commonTheme: string;  // Derived bhava theme description
  isConverged: boolean; // All 3 charts point to same domain
}

export interface KarmicEchoes {
  vargottama: VargottamaPlanet[];
  soulSpouseBridge: SoulSpouseBridge;
  publicPrivateGap: PublicPrivateGap;
  lifeForceSync: LifeForceSync;
  maleficClusters: MaleficCluster[];
  computedAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const BHAVA_THEMES: Record<number, string> = {
  1: "Self / Body / Identity",
  2: "Wealth / Family / Speech",
  3: "Courage / Siblings / Communication",
  4: "Home / Mother / Comfort",
  5: "Intellect / Children / Creativity",
  6: "Enemies / Debt / Disease",
  7: "Partnership / Marriage / Public",
  8: "Transformation / Hidden / Longevity",
  9: "Dharma / Father / Fortune",
  10: "Career / Status / Action",
  11: "Gains / Network / Aspirations",
  12: "Loss / Foreign / Liberation / Expenses",
};

const SIGN_LORD: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

// ─── Helper: parse raw horo_chart array ──────────────────────────────────────

function parseHoroHouseMap(raw: any[]): Map<string, number> {
  // Returns planet_name (capitalised) → house number (1-based)
  const map = new Map<string, number>();
  if (!Array.isArray(raw)) return map;
  raw.forEach((h: any, i: number) => {
    const houseNum = i + 1;
    const planets: string[] = h.planet ?? [];
    for (const p of planets) {
      const fmt = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
      map.set(fmt, houseNum);
    }
  });
  return map;
}

function signNum(name: string): number {
  const idx = SIGNS.findIndex(s => s.toLowerCase() === name?.toLowerCase());
  return idx === -1 ? 0 : idx + 1;
}

function houseDistance(fromH: number, toH: number): number {
  return ((toH - fromH + 12) % 12) || 12;
}

// ─── Echo 1: Vargottama / Bhavottama ─────────────────────────────────────────

function computeVargottama(
  chart: GoldenMasterJSON,
  d60Raw: any[] | null,
): VargottamaPlanet[] {
  const results: VargottamaPlanet[] = [];

  // D60 house map
  const d60Map = d60Raw ? parseHoroHouseMap(d60Raw) : new Map<string, number>();

  for (const planet of chart.d1.planets) {
    const d1SignNum  = planet.signNum;
    const d1House    = planet.house;

    // Find in D9
    const d9Entry = chart.divisional.d9.planets.find(
      p => p.name.toLowerCase() === planet.name.toLowerCase()
    );
    if (!d9Entry) continue;

    const d9SignNum = signNum(d9Entry.sign);
    if (d9SignNum !== d1SignNum) continue; // Not Vargottama

    // Check D10
    const d10Entry = chart.divisional.d10.planets.find(
      p => p.name.toLowerCase() === planet.name.toLowerCase()
    );
    const isD10Match = d10Entry ? d10Entry.house === d1House : false;

    // Check D60
    const d60House    = d60Map.get(planet.name);
    const isD60Match  = d60House !== undefined && d60House === d1House;

    let strength: VargottamaPlanet["strength"] = "Double";
    if (isD10Match || isD60Match) strength = "Triple";

    results.push({
      name:      planet.name,
      sign:      planet.sign,
      d1House,
      d9House:   d9Entry.house,
      isD10Match,
      isD60Match,
      strength,
    });
  }

  return results;
}

// ─── Echo 2: Soul-Spouse Bridge ───────────────────────────────────────────────

function computeSoulSpouseBridge(chart: GoldenMasterJSON): SoulSpouseBridge {
  const ak = chart.karakas.ak;
  const dk = chart.karakas.dk;

  // Find AK and DK positions in D9
  const akD9 = chart.divisional.d9.planets.find(
    p => p.name.toLowerCase() === ak.toLowerCase()
  );
  const dkD9 = chart.divisional.d9.planets.find(
    p => p.name.toLowerCase() === dk.toLowerCase()
  );

  const akD9House = akD9?.house ?? 0;
  const dkD9House = dkD9?.house ?? 0;

  let relationship: SoulSpouseBridge["relationship"] = "Neutral";
  let interpretation = "";

  if (akD9House && dkD9House) {
    const dist = houseDistance(akD9House, dkD9House);
    const distBack = houseDistance(dkD9House, akD9House);
    const minDist = Math.min(dist, distBack);

    if (minDist === 6 || minDist === 8) {
      relationship = "6/8 Karmic Axis";
      interpretation = `${ak} (Soul) and ${dk} (Spouse Significator) sit in a 6/8 axis in D9 — a karmic debt pattern indicating unresolved past-life contracts with the partner archetype. The soul chose difficulty in partnership to burn old karma.`;
    } else if (minDist === 1 || minDist === 7) {
      relationship = "1/7 Opposition";
      interpretation = `${ak} (Soul) and ${dk} (Spouse Significator) are in 1/7 axis in D9 — direct opposition. The soul mission and partnership destiny are in constant negotiation. Growth comes through committed partnership or its deliberate absence.`;
    } else {
      interpretation = `${ak} (Soul) and ${dk} (Spouse Significator) in D9 are ${minDist} houses apart — a neutral configuration with no dominant karmic axis. Partnership karma is mixed and context-dependent.`;
    }
  }

  return { akPlanet: ak, dkPlanet: dk, akD9House, dkD9House, relationship, interpretation };
}

// ─── Echo 3: Public-Private Gap (AL vs UL) ───────────────────────────────────

function computePublicPrivateGap(chart: GoldenMasterJSON): PublicPrivateGap {
  const lagnaSignNum = signNum(chart.d1.ascendant);

  // Arudha Lagna (AL) — classical Parashari:
  // 1. Find lord of H1 (Lagna lord)
  // 2. Count houses from Lagna to Lagna Lord's placement
  // 3. Count same distance from Lagna Lord → that house is AL
  const lagnaSign = chart.d1.ascendant;
  const lagnaLord = SIGN_LORD[lagnaSign] ?? "";
  const lagnaLordPlanet = chart.d1.planets.find(
    p => p.name.toLowerCase() === lagnaLord.toLowerCase()
  );
  const lagnaLordHouse = lagnaLordPlanet?.house ?? 1;

  let alHouse = ((lagnaLordHouse - 1) * 2) % 12;
  if (alHouse === 0) alHouse = 12;
  // Classical exception: if AL falls on H1 or H7, add 10 houses
  if (alHouse === 1) alHouse = 10;
  if (alHouse === 7) alHouse = 4;

  // Upapada Lagna (UL) — H12 lord placement rule:
  const h12Sign  = chart.d1.houses.find(h => h.number === 12)?.sign ?? "";
  const h12Lord  = SIGN_LORD[h12Sign] ?? "";
  const h12LordPlanet = chart.d1.planets.find(
    p => p.name.toLowerCase() === h12Lord.toLowerCase()
  );
  const h12LordHouse = h12LordPlanet?.house ?? 12;

  let ulHouse = ((h12LordHouse - 1 + (h12LordHouse - 12 + 12)) % 12) + 1;
  // UL = count from H12 to its lord, then same distance from lord
  const distH12ToLord = houseDistance(12, h12LordHouse);
  ulHouse = ((h12LordHouse - 1 + distH12ToLord - 1) % 12) + 1;
  if (ulHouse === 12) ulHouse = 2;  // classical exception

  const twelfthFromUL = ((ulHouse - 1 + 11) % 12) + 1;  // 12th from UL (UP lagna)

  const gap = Math.min(
    houseDistance(alHouse, ulHouse),
    houseDistance(ulHouse, alHouse)
  );

  let gapType: PublicPrivateGap["gapType"] = "Aligned";
  if (gap >= 6) gapType = "Strong Tension";
  else if (gap >= 3) gapType = "Moderate Gap";

  return {
    arudhaLagnaHouse: alHouse,
    upapadaLagnaHouse: ulHouse,
    twelfthFromUL,
    gap,
    gapType,
  };
}

// ─── Echo 4: Life-Force Sync (Pranapada Lagna) ────────────────────────────────

function computeLifeForceSync(chart: GoldenMasterJSON): LifeForceSync {
  // Pranapada = (Lagna degree + Moon degree − Sun degree + 360) mod 360
  // Convert to sign/house: divide by 30, count from Lagna
  const sun  = chart.d1.planets.find(p => p.name === "Sun");
  const moon = chart.d1.planets.find(p => p.name === "Moon");

  const lagnaSignNum = signNum(chart.d1.ascendant);

  let pranaPadaHouse = 1; // Default to 1st if data unavailable

  if (sun && moon) {
    const lagnaDeg  = (lagnaSignNum - 1) * 30;
    const moonDeg   = (moon.signNum  - 1) * 30 + moon.normDegree;
    const sunDeg    = (sun.signNum   - 1) * 30 + sun.normDegree;

    const ppDeg     = ((lagnaDeg + moonDeg - sunDeg) % 360 + 360) % 360;
    const ppSignNum = Math.floor(ppDeg / 30) + 1;
    pranaPadaHouse  = ((ppSignNum - lagnaSignNum + 12) % 12) + 1;
  }

  const distance = pranaPadaHouse === 1 ? 1 :
    Math.min(pranaPadaHouse - 1, 13 - pranaPadaHouse);

  let syncType: LifeForceSync["syncType"] = "Moderate";
  if (distance <= 2) syncType = "Strong Sync";
  else if (distance >= 5) syncType = "Weak Sync";

  return {
    pranaPadaHouse,
    birthLagnaHouse: 1,
    distanceFromLagna: pranaPadaHouse,
    syncType,
  };
}

// ─── Echo 5: Malefic Clustering ───────────────────────────────────────────────

function computeMaleficClusters(
  chart: GoldenMasterJSON,
  d3Raw: any[] | null,
  d12Raw: any[] | null,
): MaleficCluster[] {
  const clusters: MaleficCluster[] = [];
  const malefics = ["Rahu", "Ketu", "Saturn"] as const;

  const d3Map  = d3Raw  ? parseHoroHouseMap(d3Raw)  : new Map<string, number>();
  const d12Map = d12Raw ? parseHoroHouseMap(d12Raw) : new Map<string, number>();

  for (const planet of malefics) {
    const d1Planet = chart.d1.planets.find(
      p => p.name.toLowerCase() === planet.toLowerCase()
    );
    if (!d1Planet) continue;

    const d1House  = d1Planet.house;
    const d3House  = d3Map.get(planet) ?? null;
    const d12House = d12Map.get(planet) ?? null;

    // Check convergence: same house number (or same theme group) across charts
    const housesPresent = [d1House, d3House, d12House].filter(h => h !== null) as number[];
    const uniqueHouses  = new Set(housesPresent);

    // Also check thematic convergence (houses 1 & 7 share the axis theme, etc.)
    const themeGroups: number[][] = [[1,7],[2,8],[3,9],[4,10],[5,11],[6,12]];
    let isConverged = uniqueHouses.size === 1; // exact house match

    if (!isConverged && housesPresent.length >= 2) {
      // Check if majority fall in same axis
      for (const group of themeGroups) {
        const inGroup = housesPresent.filter(h => group.includes(h));
        if (inGroup.length >= 2) { isConverged = true; break; }
      }
    }

    const commonTheme = BHAVA_THEMES[d1House] ?? `House ${d1House}`;

    clusters.push({
      planet,
      d1House,
      d3House,
      d12House,
      commonTheme,
      isConverged,
    });
  }

  return clusters;
}

// ─── Main Exported Function ───────────────────────────────────────────────────

export function computeKarmicEchoes(
  chart: GoldenMasterJSON,
  d3Raw: any[] | null,
  d12Raw: any[] | null,
  d60Raw: any[] | null,
): KarmicEchoes {
  return {
    vargottama:      computeVargottama(chart, d60Raw),
    soulSpouseBridge: computeSoulSpouseBridge(chart),
    publicPrivateGap: computePublicPrivateGap(chart),
    lifeForceSync:   computeLifeForceSync(chart),
    maleficClusters: computeMaleficClusters(chart, d3Raw, d12Raw),
    computedAt:      new Date().toISOString(),
  };
}

// ─── Serialise echoes as a concise string for LLM injection ──────────────────

export function echoesToPromptString(echoes: KarmicEchoes): string {
  const { vargottama, soulSpouseBridge, publicPrivateGap, lifeForceSync, maleficClusters } = echoes;

  const vLines = vargottama.length
    ? vargottama.map(v =>
        `  • ${v.name} is Vargottama in ${v.sign} (D1-H${v.d1House} / D9-H${v.d9House}) [${v.strength}]${v.isD10Match ? " + D10 lock" : ""}${v.isD60Match ? " + D60 lock" : ""}`
      ).join("\n")
    : "  • No Vargottama planets detected.";

  const ssb = soulSpouseBridge;
  const ppg = publicPrivateGap;
  const lfs = lifeForceSync;

  const mcLines = maleficClusters.map(mc =>
    `  • ${mc.planet}: D1-H${mc.d1House}${mc.d3House ? ` / D3-H${mc.d3House}` : ""}${mc.d12House ? ` / D12-H${mc.d12House}` : ""} — Theme: ${mc.commonTheme} — Converged: ${mc.isConverged ? "YES" : "NO"}`
  ).join("\n");

  return `
=== COMPUTED KARMIC ECHOES ===

[ECHO 1 — VARGOTTAMA]
${vLines}

[ECHO 2 — SOUL-SPOUSE BRIDGE]
  AK: ${ssb.akPlanet} (D9 H${ssb.akD9House}) | DK: ${ssb.dkPlanet} (D9 H${ssb.dkD9House})
  Axis: ${ssb.relationship}
  Pattern: ${ssb.interpretation}

[ECHO 3 — PUBLIC-PRIVATE GAP]
  Arudha Lagna: H${ppg.arudhaLagnaHouse} | Upapada Lagna: H${ppg.upapadaLagnaHouse} | 12th from UL: H${ppg.twelfthFromUL}
  Gap: ${ppg.gap} houses — ${ppg.gapType}

[ECHO 4 — LIFE-FORCE SYNC]
  Pranapada Lagna: H${lfs.pranaPadaHouse} | Distance from Birth Lagna: ${lfs.distanceFromLagna} houses
  Sync Quality: ${lfs.syncType}

[ECHO 5 — MALEFIC CLUSTERING]
${mcLines || "  • No malefic data available."}

=== END ECHOES ===`.trim();
}
