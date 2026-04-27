/**
 * Fetch Mean Rahu from astrologyapi.com to compare with True Rahu
 * and verify the D9 fix.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const idx = t.indexOf("=");
    if (idx === -1) continue;
    const k = t.slice(0, idx).trim();
    const v = t.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[k]) process.env[k] = v;
  }
}

const API_USER = process.env.ASTROLOGY_API_USER_ID;
const API_KEY  = process.env.ASTROLOGY_API_KEY;
const BASE     = "https://json.astrologyapi.com/v1";
const auth     = "Basic " + Buffer.from(`${API_USER}:${API_KEY}`).toString("base64");

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
               "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

function post(endpoint, params) {
  return fetch(`${BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: auth },
    body: JSON.stringify(params),
  }).then(r => r.json());
}

// Chart 1 params
const params = { day: 2, month: 4, year: 1985, hour: 11, min: 15,
                 lat: 12.9716, lon: 77.5946, tzone: 5.5 };

async function main() {
  console.log("Fetching planets (True nodes) and checking for mean node endpoint...\n");

  // Check if API has a mean planet endpoint
  const [planets, planetsAll] = await Promise.all([
    post("planets", params),
    post("planets/all", params).catch(() => null),
  ]);

  console.log("── TRUE NODE planets ────────────────────────────────────────");
  for (const p of planets) {
    if (["rahu","ketu","ascendant"].includes(p.name?.toLowerCase())) {
      console.log(`${p.name}: sign=${p.sign} normDeg=${parseFloat(p.normDegree||p.degree).toFixed(4)}° fullDeg=${parseFloat(p.fullDegree||0).toFixed(4)}°`);
    }
  }

  if (planetsAll) {
    console.log("\n── planets/all response ────────────────────────────────────");
    console.log(JSON.stringify(planetsAll).slice(0, 600));
  } else {
    console.log("\nplanets/all endpoint not available.");
  }

  // Try planets/mean or similar
  const meanNodes = await post("planets/mean", params).catch(() => null);
  if (meanNodes) {
    console.log("\n── Mean nodes ──────────────────────────────────────────────");
    console.log(JSON.stringify(meanNodes).slice(0, 600));
  } else {
    console.log("planets/mean endpoint not available.");
  }

  // Self-compute D9 with slight Mean node offset (True - Mean ≈ 0.5° for this date)
  console.log("\n── D9 WITH MEAN RAHU (subtract ~0.5° from True node) ────────");
  const MEAN_OFFSET = 0.5; // True - Mean ≈ 0.5° (retrograde — Mean is ahead of True)
  // Actually for 1985, Mean Rahu is slightly HIGHER than True Rahu (Mean ahead)
  // True Rahu 26.670° → to land in Scorpio needs < 26.6667° → Mean needs to be ~26.16°
  // The True-Mean difference is ~0.17° minimum to cross this boundary
  const rahuNormTrue = 26.67;
  const ketuNormTrue = 26.67;
  
  console.log("If Mean Rahu normDeg =", (rahuNormTrue - 0.17).toFixed(2), "→ D9 pada =", Math.floor((26.50) * 9 / 30 + 0*9), "...");
  
  // Compute using full degree
  function d9Sign(normDeg, signName) {
    const sIdx = SIGNS.findIndex(s => s.toLowerCase() === signName.toLowerCase());
    const fullDeg = sIdx * 30 + normDeg;
    const d9Idx = Math.floor(fullDeg * 9 / 30) % 12;
    return SIGNS[d9Idx];
  }

  // Test values around the boundary
  for (const testNorm of [26.67, 26.60, 26.50, 26.40, 26.00, 25.00]) {
    console.log(`  Rahu in Aries @ ${testNorm}° → D9 = ${d9Sign(testNorm, "Aries")}`);
  }
  console.log("\nConclusion: Rahu needs to be < 26.6667° in Aries to land in D9 Scorpio.");
}

main().catch(console.error);
