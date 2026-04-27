/**
 * DIRECT DIAGNOSIS TEST — No app layer, no cache, no LLM.
 * Calls AstrologyAPI.com directly and prints raw D1 + D9 house placements.
 *
 * Chart 1: DOB 02 April 1985 | TOB 11:15 AM | POB Bangalore, India
 * Chart 2: DOB 23 June 2003  | TOB 7:30 AM  | POB Palasa, India
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local manually (no dotenv dependency)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const API_USER = process.env.ASTROLOGY_API_USER_ID;
const API_KEY  = process.env.ASTROLOGY_API_KEY;
const BASE     = "https://json.astrologyapi.com/v1";

if (!API_USER || !API_KEY) {
  console.error("❌ Missing ASTROLOGY_API_USER_ID or ASTROLOGY_API_KEY in .env.local");
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`${API_USER}:${API_KEY}`).toString("base64");

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

function signNum(name) {
  return SIGNS.findIndex(s => s.toLowerCase() === name?.toLowerCase()) + 1;
}

async function geocode(place) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`;
  const r = await fetch(url, { headers: { "User-Agent": "AstroTest/1.0" } });
  const d = await r.json();
  if (!d?.length) throw new Error(`Cannot geocode: ${place}`);
  return { lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon), name: d[0].display_name };
}

async function post(endpoint, params) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", Authorization: auth },
    body:    JSON.stringify(params),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${endpoint} → HTTP ${res.status}: ${text.slice(0,300)}`);
  try { return JSON.parse(text); }
  catch { throw new Error(`${endpoint} → Invalid JSON: ${text.slice(0,300)}`); }
}

// Parse "11:15 AM" or "7:30 AM" or "17:20" → { hour, min }
function parseTime(tob) {
  const ampm = tob.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let h = parseInt(ampm[1], 10);
    const m = parseInt(ampm[2], 10);
    const period = ampm[3].toUpperCase();
    if (period === "AM" && h === 12) h = 0;
    if (period === "PM" && h !== 12) h += 12;
    return { hour: h, min: m };
  }
  const parts = tob.split(":");
  return { hour: parseInt(parts[0], 10), min: parseInt(parts[1], 10) };
}

async function runChartTest(label, dob, tob, pob) {
  console.log("\n" + "═".repeat(70));
  console.log(`  ${label}`);
  console.log(`  DOB: ${dob} | TOB: ${tob} | POB: ${pob}`);
  console.log("═".repeat(70));

  // Geocode
  const geo = await geocode(pob);
  console.log(`\n📍 Geocoded: lat=${geo.lat.toFixed(4)}, lon=${geo.lon.toFixed(4)}`);
  console.log(`   → ${geo.name}`);

  // Parse DOB
  const [d, m, y] = dob.split(/[\/-]/).map(Number);
  const { hour, min } = parseTime(tob);
  const params = { day: d, month: m, year: y, hour, min, lat: geo.lat, lon: geo.lon, tzone: 5.5 };
  console.log(`\n📅 Params: day=${d}, month=${m}, year=${y}, hour=${hour}, min=${min}, tzone=5.5`);

  // Fetch all endpoints
  console.log("\n⏳ Fetching from AstrologyAPI.com...");
  const [astro, planets, horoD1, horoD9] = await Promise.all([
    post("astro_details", params),
    post("planets", params),
    post("horo_chart/D1", params),
    post("horo_chart/D9", params),
  ]);

  // === BASIC INFO ===
  console.log("\n── BASIC INFO ─────────────────────────────────────────────────────");
  console.log(`Ascendant (Lagna): ${astro.ascendant}`);
  console.log(`Moon Sign:         ${astro.sign || astro.moon_sign}`);
  console.log(`Moon Nakshatra:    ${astro.Naksahtra || astro.nakshatra}`);
  console.log(`Sun Sign:          ${astro.sun_sign}`);

  const lagnaSignNum = signNum(astro.ascendant);
  console.log(`\nLagna sign index: ${lagnaSignNum} (${astro.ascendant})`);

  // === D1 PLANETS RAW ===
  console.log("\n── D1 PLANETS (raw from /planets) ────────────────────────────────");
  console.log("Planet         | API Sign       | API sign_id | API house | normDeg | isRetro");
  console.log("─".repeat(85));
  const planetTable = [];
  for (const p of planets) {
    const apiHouse = p.house !== undefined ? p.house : "—";
    const signId   = p.sign_id !== undefined ? p.sign_id : signNum(p.sign);
    const computedHouse = ((parseInt(signId, 10) - lagnaSignNum + 12) % 12) + 1;
    const isRetro  = p.isRetro === "true" || p.isRetro === true || parseFloat(p.speed) < 0;
    console.log(
      `${p.name.padEnd(14)} | ${(p.sign||"").padEnd(14)} | sign_id=${String(signId).padEnd(3)} | house=${String(apiHouse).padEnd(3)} | normDeg=${parseFloat(p.normDegree||p.degree||0).toFixed(2).padStart(6)} | ${isRetro ? "Retro ↺" : "Direct"}`
    );
    planetTable.push({
      name: p.name,
      sign: p.sign,
      signId: parseInt(signId, 10),
      apiHouse: parseInt(apiHouse, 10) || computedHouse,
      normDeg: parseFloat(p.normDegree || p.degree || 0),
      isRetro,
    });
  }

  // === D1 HOUSES (computed Whole Sign) ===
  console.log("\n── D1 HOUSES — Whole Sign (recomputed from lagna) ────────────────");
  console.log("House | Sign           | Planets");
  console.log("─".repeat(60));
  for (let i = 1; i <= 12; i++) {
    const hSign = SIGNS[(lagnaSignNum - 1 + i - 1) % 12];
    const occ = planetTable.filter(p => p.apiHouse === i).map(p => p.name);
    console.log(`H${String(i).padEnd(4)} | ${hSign.padEnd(14)} | ${occ.join(", ") || "∅"}`);
  }

  // === D1 HORO_CHART/D1 (raw — cross-check) ===
  console.log("\n── D1 horo_chart/D1 RAW (verification cross-check) ───────────────");
  if (Array.isArray(horoD1)) {
    for (let i = 0; i < horoD1.length; i++) {
      const h = horoD1[i];
      console.log(`H${String(i+1).padEnd(3)} | sign=${h.sign} sign_name=${h.sign_name||h.sign} | Planets: [${(h.planet||[]).join(", ")||"∅"}]`);
    }
  } else {
    console.log("horoD1 raw structure:");
    console.log(JSON.stringify(horoD1, null, 2).slice(0, 800));
  }

  // === D9 NAVAMSHA ===
  console.log("\n── D9 NAVAMSHA — horo_chart/D9 RAW ───────────────────────────────");
  if (Array.isArray(horoD9)) {
    const d9Lagna = horoD9[0]?.sign_name || "—";
    console.log(`D9 Lagna: ${d9Lagna}`);
    console.log("House | Sign           | Planets");
    console.log("─".repeat(60));
    for (let i = 0; i < horoD9.length; i++) {
      const h = horoD9[i];
      console.log(`H${String(i+1).padEnd(4)} | ${(h.sign_name||"").padEnd(14)} | ${(h.planet||[]).join(", ")||"∅"}`);
    }
  } else {
    console.log("D9 raw:");
    console.log(JSON.stringify(horoD9, null, 2).slice(0, 1000));
  }

  // Save raw dump for inspection
  const dump = { astro, planets, horoD1, horoD9 };
  const fname = `raw_dump_${label.replace(/\s+/g,"_")}.json`;
  fs.writeFileSync(path.join(__dirname, fname), JSON.stringify(dump, null, 2));
  console.log(`\n💾 Raw dump saved → ${fname}`);
}

async function main() {
  try {
    // Chart 1
    await runChartTest(
      "CHART 1 — 02 April 1985, 11:15 AM, Bangalore",
      "02/04/1985",
      "11:15 AM",
      "Bangalore, India"
    );

    // Chart 2
    await runChartTest(
      "CHART 2 — 23 June 2003, 7:30 AM, Palasa",
      "23/06/2003",
      "7:30 AM",
      "Palasa, Andhra Pradesh, India"
    );

    console.log("\n\n✅ DIAGNOSIS COMPLETE");
  } catch (err) {
    console.error("\n❌ FATAL:", err.message);
    process.exit(1);
  }
}

main();
