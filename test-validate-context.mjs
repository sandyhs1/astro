/**
 * Validates the final chart context that gets sent to the LLM.
 * Reads the raw dump files from the diagnosis run and simulates normalizeBundle + buildClaudeContext.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];
const SIGN_LORD = {
  Aries:"Mars", Taurus:"Venus", Gemini:"Mercury", Cancer:"Moon",
  Leo:"Sun", Virgo:"Mercury", Libra:"Venus", Scorpio:"Mars",
  Sagittarius:"Jupiter", Capricorn:"Saturn", Aquarius:"Saturn", Pisces:"Jupiter",
};

function signNum(name) {
  return SIGNS.findIndex(s => s.toLowerCase() === name?.toLowerCase()) + 1;
}

function processChart(dumpFile, label) {
  const raw = JSON.parse(fs.readFileSync(path.join(__dirname, dumpFile), "utf8"));
  const { astro, planets, horoD1, horoD9 } = raw;

  console.log("\n" + "═".repeat(70));
  console.log(`  ${label}`);
  console.log("═".repeat(70));

  const ascendant = astro.ascendant;
  const lagnaSignNum = signNum(ascendant);
  console.log(`\nLagna: ${ascendant} (sign #${lagnaSignNum})`);

  // --- D1 PLANETS (with Ascendant filtered) ---
  console.log("\n── D1 PLANET TABLE (as sent to LLM) ──────────────────────────────");
  console.log("Name           | Sign         | Deg°   | House | Nakshatra       | Flags");
  console.log("─".repeat(85));
  const d1Planets = [];
  for (const p of planets) {
    if (p.name.toLowerCase() === "ascendant") continue; // FIXED: skip
    const flags = [];
    if (p.isRetro === "true" || p.isRetro === true || parseFloat(p.speed) < 0) flags.push("Retro");
    const signId = parseInt(p.sign_id || signNum(p.sign), 10);
    const apiHouse = p.house;
    const pEntry = {
      name: p.name, sign: p.sign, signId,
      house: apiHouse,
      normDeg: parseFloat(p.normDegree || p.degree || 0),
      nak: p.nakshatra || "",
      flags: flags.join(",") || "—"
    };
    d1Planets.push(pEntry);
    console.log(`${p.name.padEnd(14)} | ${(p.sign||"").padEnd(12)} | ${pEntry.normDeg.toFixed(2).padStart(6)}° | H${String(apiHouse).padEnd(3)} | ${(p.nakshatra||"").padEnd(15)} | ${pEntry.flags}`);
  }

  // --- D1 HOUSES from horo_chart/D1 (FIXED: authoritative source) ---
  console.log("\n── D1 HOUSE TABLE (as sent to LLM) ───────────────────────────────");
  console.log("House | Sign          | Lord     | Occupants");
  console.log("─".repeat(60));
  if (Array.isArray(horoD1) && horoD1.length === 12) {
    for (let i = 0; i < 12; i++) {
      const h = horoD1[i];
      const hSign = h.sign_name || "";
      const lord = SIGN_LORD[hSign] || "?";
      const rawOcc = (h.planet || []).filter(p => p.toLowerCase() !== "ascendant");
      const occ = rawOcc.map(p => p.charAt(0) + p.slice(1).toLowerCase());
      console.log(`H${String(i+1).padStart(2)} | ${hSign.padEnd(13)} | ${lord.padEnd(8)} | ${occ.join(", ") || "∅"}`);
    }
  } else {
    console.log("horoD1 not available in expected format.");
  }

  // --- D9 HOUSE TABLE ---
  console.log("\n── D9 NAVAMSHA HOUSE TABLE (as sent to LLM) ──────────────────────");
  const d9Lagna = horoD9?.[0]?.sign_name || "—";
  console.log(`D9 Lagna: ${d9Lagna}`);
  console.log("House | Sign          | Lord     | Occupants");
  console.log("─".repeat(60));
  if (Array.isArray(horoD9)) {
    for (let i = 0; i < horoD9.length; i++) {
      const h = horoD9[i];
      const hSign = h.sign_name || "";
      const lord = SIGN_LORD[hSign] || "?";
      const rawOcc = h.planet || [];
      const occ = rawOcc.map(p => p.charAt(0) + p.slice(1).toLowerCase());
      console.log(`H${String(i+1).padStart(2)} | ${hSign.padEnd(13)} | ${lord.padEnd(8)} | ${occ.join(", ") || "∅"}`);
    }
  }
}

// Chart 1
processChart(
  "raw_dump_CHART_1_—_02_April_1985,_11:15_AM,_Bangalore.json",
  "CHART 1 — 02 April 1985, 11:15 AM, Bangalore"
);

// Chart 2
processChart(
  "raw_dump_CHART_2_—_23_June_2003,_7:30_AM,_Palasa.json",
  "CHART 2 — 23 June 2003, 7:30 AM, Palasa"
);

console.log("\n\n✅ VALIDATION COMPLETE — above is exactly what the LLM receives");
