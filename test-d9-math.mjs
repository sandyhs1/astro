/**
 * Verify D9 math from first principles.
 * Formula: D9 sign index = floor(fullDegree * 9 / 30) % 12
 */

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
               "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

function signIdx(name) { return SIGNS.findIndex(s => s.toLowerCase() === name.toLowerCase()); }

function computeD9(name, signName, normDeg) {
  const sIdx = signIdx(signName);
  const fullDeg = sIdx * 30 + normDeg;
  const d9Idx = Math.floor(fullDeg * 9 / 30) % 12;
  const pada  = Math.floor(fullDeg * 9 / 30);
  return { name, d1Sign: signName, normDeg, fullDeg: fullDeg.toFixed(3), pada, d9Sign: SIGNS[d9Idx] };
}

// Chart 1 — 02 April 1985, 11:15 AM, Bangalore
// From /planets endpoint (exact values from API)
const chart1 = [
  computeD9("Sun",     "Pisces",      18.79),
  computeD9("Moon",    "Leo",          3.55),
  computeD9("Mars",    "Aries",       19.34),
  computeD9("Mercury", "Pisces",      21.18),
  computeD9("Jupiter", "Capricorn",   17.50),
  computeD9("Venus",   "Pisces",      21.50),
  computeD9("Saturn",  "Scorpio",      3.93),
  computeD9("Rahu",    "Aries",       26.67),  // TRUE node from API
  computeD9("Ketu",    "Libra",       26.67),  // TRUE node from API
];

// D9 lagna (ascendant) computation
// Ascendant is at normDeg=6.43° in Gemini
const d9Lagna = computeD9("Ascendant", "Gemini", 6.43);

console.log("═".repeat(70));
console.log("  Chart 1 D9 — Self-computed from fullDegree");
console.log("  DOB: 02 April 1985 | TOB: 11:15 AM | Bangalore");
console.log("═".repeat(70));
console.log(`\nD9 Lagna: ${d9Lagna.d9Sign} (pada ${d9Lagna.pada})`);
const d9LagnaIdx = signIdx(d9Lagna.d9Sign);

console.log("\nPlanet         | D1 Sign      | fullDeg | pada  | D9 Sign       | D9 House");
console.log("─".repeat(80));
for (const p of chart1) {
  const d9sIdx = signIdx(p.d9Sign);
  const d9house = ((d9sIdx - d9LagnaIdx + 12) % 12) + 1;
  console.log(
    `${p.name.padEnd(14)} | ${p.d1Sign.padEnd(12)} | ${p.fullDeg.padStart(7)} | ${String(p.pada).padStart(5)} | ${p.d9Sign.padEnd(13)} | H${d9house}`
  );
}

// Critical section — Rahu/Ketu boundary analysis
console.log("\n── RAHU/KETU BOUNDARY ANALYSIS ────────────────────────────────────");
const rahuFull = 0*30 + 26.67; // Aries at 26.67°
const padam = Math.floor(rahuFull * 9 / 30);
const boundaryStart = padam * 30/9;
const boundaryEnd   = (padam+1) * 30/9;
console.log(`Rahu fullDeg = ${rahuFull}°`);
console.log(`Current pada = ${padam}  (boundary: ${boundaryStart.toFixed(4)}° → ${boundaryEnd.toFixed(4)}°)`);
console.log(`D9 sign from API full degree = ${SIGNS[padam % 12]} (True node)`);
console.log(`\nFor Rahu to land in SCORPIO (H1), it needs fullDeg < ${boundaryStart.toFixed(4)}°`);
console.log(`i.e., normDeg < ${(boundaryStart).toFixed(4)}° in Aries`);
console.log(`Difference: ${(rahuFull - boundaryStart).toFixed(4)}° past the boundary`);
console.log(`\n→ If Mean Rahu normDeg ≈ 26.50° (just 0.17° less), D9 = Scorpio (H1) ✓`);
console.log(`→ True Rahu is at the boundary — tiny ayanamsa/node-type diff flips the house`);
