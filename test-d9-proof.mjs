/**
 * PROOF TEST — verify D9 with Mean Nodes matches reference chart.
 * Chart 1: 02 April 1985, 11:15 AM, Bangalore
 * Expected (from reference software using Mean nodes):
 *   H1 Scorpio  → Rahu
 *   H2 Sagittarius → Sun
 *   H7 Taurus   → Moon, Ketu
 *   H8 Gemini   → Jupiter
 */

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
               "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

function d9SignIdx(fullDeg) {
  return Math.floor((fullDeg * 9) / 30) % 12;
}

function meanRahuSidereal(year, month, day, hour, min) {
  const a   = Math.floor((14 - month) / 12);
  const y   = year + 4800 - a;
  const m   = month + 12 * a - 3;
  const jdn = day + Math.floor((153*m+2)/5) + 365*y + Math.floor(y/4)
              - Math.floor(y/100) + Math.floor(y/400) - 32045;
  const jd  = jdn + (hour - 12 + min/60) / 24;
  const T   = (jd - 2451545.0) / 36525.0;
  const rahuTrop = ((125.04452 - 1934.136261*T + 0.0020708*T*T) % 360 + 360) % 360;
  const ayanamsa = 23.85 + (T * 100 * 50.29) / 3600;
  return ((rahuTrop - ayanamsa) % 360 + 360) % 360;
}

// Chart 1 planet full degrees (from API /planets endpoint)
const planets = [
  { name: "Sun",     fullDegree: 348.790 },
  { name: "Moon",    fullDegree: 123.550 },
  { name: "Mars",    fullDegree:  19.340 },
  { name: "Mercury", fullDegree: 351.180 },
  { name: "Jupiter", fullDegree: 287.500 },
  { name: "Venus",   fullDegree: 351.500 },
  { name: "Saturn",  fullDegree: 213.930 },
  { name: "Rahu",    fullDegree:  26.669 }, // True node (API)
  { name: "Ketu",    fullDegree: 206.669 }, // True node (API)
];

// Mean Rahu for 02 April 1985, 11:15 AM IST (06:45 UTC)
const mRahu = meanRahuSidereal(1985, 4, 2, 11, 15);
const mKetu = (mRahu + 180) % 360;

// D9 Lagna: Ascendant at Gemini, fullDeg = 66.436°
const ascFull   = 66.436;
const d9LagnaIdx = d9SignIdx(ascFull);

console.log("═".repeat(65));
console.log("  PROOF: D9 with Mean Nodes — Chart 1 (02 Apr 1985, Bangalore)");
console.log("═".repeat(65));
console.log(`\nMean Rahu sidereal: ${mRahu.toFixed(4)}° (${SIGNS[Math.floor(mRahu/30)]} ${(mRahu%30).toFixed(4)}°)`);
console.log(`Mean Ketu sidereal: ${mKetu.toFixed(4)}° (${SIGNS[Math.floor(mKetu/30)]} ${(mKetu%30).toFixed(4)}°)`);
console.log(`True Rahu sidereal: 26.6692° (Aries 26.6692°)`);
console.log(`\nD9 Lagna: ${SIGNS[d9LagnaIdx]} (idx ${d9LagnaIdx})`);

console.log("\n── D9 Planet Placements ─────────────────────────────────────");
console.log("Planet    | FullDeg Used | D9 Sign       | D9 House");
console.log("─".repeat(55));

const houseMap = {};
for (let i = 1; i <= 12; i++) houseMap[i] = [];

for (const p of planets) {
  const fullDeg = (p.name === "Rahu") ? mRahu : (p.name === "Ketu") ? mKetu : p.fullDegree;
  const sIdx    = d9SignIdx(fullDeg);
  const d9Sign  = SIGNS[sIdx];
  const d9House = ((sIdx - d9LagnaIdx + 12) % 12) + 1;
  houseMap[d9House].push(p.name);
  const src = (p.name === "Rahu" || p.name === "Ketu") ? "(Mean)" : "(True)";
  console.log(`${p.name.padEnd(9)} | ${fullDeg.toFixed(3).padStart(12)} ${src} | ${d9Sign.padEnd(13)} | H${d9House}`);
}

console.log("\n── D9 House Table ───────────────────────────────────────────");
console.log("House | Sign           | Planets");
console.log("─".repeat(50));
for (let i = 1; i <= 12; i++) {
  const hSign = SIGNS[(d9LagnaIdx + i - 1) % 12];
  console.log(`H${String(i).padStart(2)}  | ${hSign.padEnd(14)} | ${houseMap[i].join(", ") || "∅"}`);
}

console.log("\n── COMPARISON vs Reference Chart ────────────────────────────");
const checks = [
  { house: 1, expected: ["Rahu"],         label: "H1 should have Rahu" },
  { house: 2, expected: ["Sun"],           label: "H2 should have Sun only" },
  { house: 7, expected: ["Moon","Ketu"],   label: "H7 should have Moon + Ketu" },
  { house: 8, expected: ["Jupiter"],       label: "H8 should have Jupiter only" },
];
for (const c of checks) {
  const got     = houseMap[c.house].sort().join(", ");
  const exp     = c.expected.sort().join(", ");
  const pass    = got === exp;
  console.log(`${pass ? "✅" : "❌"} ${c.label}: got [${got}] expected [${exp}]`);
}
