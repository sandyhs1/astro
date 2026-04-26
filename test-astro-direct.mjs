/**
 * Direct AstrologyAPI test — no cache, no LLM.
 * DOB: 10 March 1992 | TOB: 17:20 | POB: Bangalore, India
 */

const API_USER = "652586";
const API_KEY  = "ak-a0522cc281f6c1588f781b28e581cb58a2716968";
const BASE     = "https://json.astrologyapi.com/v1";

const params = {
  day:   10,
  month: 3,
  year:  1992,
  hour:  17,
  min:   20,
  lat:   12.9716,
  lon:   77.5946,
  tzone: 5.5,
};

const auth = "Basic " + Buffer.from(`${API_USER}:${API_KEY}`).toString("base64");

async function post(endpoint) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", Authorization: auth },
    body:    JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`${endpoint} → HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  AstrologyAPI Direct Test");
  console.log("  DOB: 10 March 1992 | TOB: 17:20 | POB: Bangalore, India");
  console.log("═══════════════════════════════════════════════════════════\n");

  // Fire all calls in parallel
  const [astro, planets, horoD1, horoD9, currentDasha, majorDasha] = await Promise.all([
    post("astro_details"),
    post("planets"),
    post("horo_chart/D1"),
    post("horo_chart/D9"),
    post("current_vdasha_all"),
    post("major_vdasha"),
  ]);

  // ── Basic Info ─────────────────────────────────────────────────────────────
  console.log("── BASIC INFO ─────────────────────────────────────────────");
  console.log("Ascendant (Lagna):", astro.ascendant);
  console.log("Moon Sign:        ", astro.sign || astro.moon_sign);
  console.log("Moon Nakshatra:   ", astro.Naksahtra || astro.nakshatra);
  console.log("Sun Sign:         ", astro.sun_sign);
  console.log();

  // ── D1 Planets ────────────────────────────────────────────────────────────
  console.log("── D1 PLANETS ─────────────────────────────────────────────");
  console.log("Planet         | Sign         | Deg°   | House | Nakshatra      | Retro");
  console.log("─".repeat(80));

  const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
                 "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  function signNum(name) {
    return SIGNS.findIndex(s => s.toLowerCase() === name?.toLowerCase()) + 1;
  }
  function wholeSignHouse(pSignId, lagnaSignId) {
    return ((pSignId - lagnaSignId + 12) % 12) + 1;
  }

  const lagnaSignNum = signNum(astro.ascendant);
  let asmrTable = [];

  for (const p of planets) {
    const name     = p.name;
    const sign     = p.sign;
    const pSignId  = parseInt(p.sign_id || String(signNum(sign)), 10);
    const fullDeg  = parseFloat(p.fullDegree || 0).toFixed(2);
    const normDeg  = parseFloat(p.normDegree || p.degree || 0).toFixed(2);
    const nak      = p.nakshatra || "";
    const isRetro  = p.isRetro === "true" || p.isRetro === true || parseFloat(p.speed) < 0;
    // Use API house if provided, else compute
    const house    = p.house || wholeSignHouse(pSignId, lagnaSignNum);

    asmrTable.push({ name, sign, normDeg, fullDeg, house, nak, isRetro });
    console.log(
      `${name.padEnd(14)} | ${sign.padEnd(12)} | ${normDeg.padStart(6)}° | H${String(house).padEnd(4)} | ${nak.padEnd(14)} | ${isRetro ? "Retro ↺" : "—"}`
    );
  }
  console.log();

  // ── D1 Houses ────────────────────────────────────────────────────────────
  console.log("── D1 HOUSES (Whole Sign from Lagna:", astro.ascendant, ") ──");
  console.log("House | Sign          | Occupants");
  console.log("─".repeat(60));
  const houses = [];
  for (let i = 1; i <= 12; i++) {
    const hSign = SIGNS[(lagnaSignNum - 1 + i - 1) % 12];
    const occupants = asmrTable.filter(p => p.house == i).map(p => p.name);
    houses.push({ i, hSign, occupants });
    console.log(`H${String(i).padEnd(4)} | ${hSign.padEnd(13)} | ${occupants.join(", ") || "∅"}`);
  }
  console.log();

  // ── D1 Raw House Array (from horo_chart/D1) ───────────────────────────────
  console.log("── D1 HORO_CHART/D1 RAW (verification cross-check) ──────");
  if (Array.isArray(horoD1)) {
    for (let i = 0; i < horoD1.length; i++) {
      const h = horoD1[i];
      console.log(`H${i+1}: ${h.sign_name || h.sign} — Planets: [${(h.planet || []).join(", ") || "∅"}]`);
    }
  } else {
    console.log("horoD1 raw:", JSON.stringify(horoD1).slice(0, 400));
  }
  console.log();

  // ── D9 Houses ────────────────────────────────────────────────────────────
  console.log("── D9 NAVAMSHA (horo_chart/D9) ─────────────────────────");
  if (Array.isArray(horoD9)) {
    const d9Lagna = horoD9[0]?.sign_name || "—";
    console.log("D9 Lagna:", d9Lagna);
    console.log("House | Sign          | Occupants");
    console.log("─".repeat(60));
    for (let i = 0; i < horoD9.length; i++) {
      const h = horoD9[i];
      console.log(`H${String(i+1).padEnd(4)} | ${(h.sign_name||"").padEnd(13)} | ${(h.planet || []).join(", ") || "∅"}`);
    }
  } else {
    console.log("D9 raw:", JSON.stringify(horoD9).slice(0, 600));
  }
  console.log();

  // ── Jaimini Karakas (AK, DK) ─────────────────────────────────────────────
  console.log("── JAIMINI KARAKAS (computed from norm degree, desc) ────");
  const KARAKA_PLANETS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
  const ranked = asmrTable
    .filter(p => KARAKA_PLANETS.includes(p.name))
    .sort((a, b) => parseFloat(b.normDeg) - parseFloat(a.normDeg));

  const labels = ["AK (Atmakaraka)","AMK (Amatyakaraka)","BK (Bhratrukaraka)","MK (Matrukaraka)",
                  "PK (Pitrukaraka)","GK (Gnatikaraka)","DK (Darakaraka)"];
  ranked.forEach((p, i) => {
    const marker = i === 0 ? " ⭐ SOUL" : i === 6 ? " 💑 SPOUSE" : "";
    console.log(`${labels[i].padEnd(24)} → ${p.name.padEnd(10)} (${p.normDeg}° in ${p.sign})${marker}`);
  });
  console.log();

  // ── Dasha ─────────────────────────────────────────────────────────────────
  console.log("── DASHA RAW STRUCTURE (currentDasha) ───────────────────");
  console.log("Keys:", Object.keys(currentDasha));
  console.log("Full:", JSON.stringify(currentDasha, null, 2).slice(0, 1200));
  console.log();

  console.log("── DASHA RAW STRUCTURE (majorDasha) ─────────────────────");
  console.log("Keys:", Object.keys(majorDasha));
  console.log("Full:", JSON.stringify(majorDasha, null, 2).slice(0, 1200));
  console.log();

  // ── Smart Dasha Parse ─────────────────────────────────────────────────────
  console.log("── CURRENT & NEXT DASHA (parsed) ────────────────────────");
  const now = new Date();

  // Try various structures
  let allPeriods = [];
  if (Array.isArray(majorDasha)) allPeriods = majorDasha;
  else if (majorDasha.dasha_period) allPeriods = majorDasha.dasha_period;
  else if (majorDasha.major_vdasha) allPeriods = majorDasha.major_vdasha;
  else if (Array.isArray(currentDasha)) allPeriods = currentDasha;
  else if (currentDasha.major?.dasha_period) allPeriods = currentDasha.major.dasha_period;

  console.log("Parsed periods count:", allPeriods.length);
  if (allPeriods.length > 0) {
    console.log("Sample period:", JSON.stringify(allPeriods[0]));

    const activeIdx = allPeriods.findIndex(p => {
      const s = new Date(p.start || p.start_date || "");
      const e = new Date(p.end   || p.end_date   || "");
      return !isNaN(s.getTime()) && !isNaN(e.getTime()) && now >= s && now <= e;
    });

    if (activeIdx >= 0) {
      const curr = allPeriods[activeIdx];
      const next = allPeriods[activeIdx + 1];
      console.log("\n✅ CURRENT MAHADASHA:");
      console.log(`   Planet: ${curr.planet || curr.dasha_name || curr.name}`);
      console.log(`   Start:  ${curr.start  || curr.start_date}`);
      console.log(`   End:    ${curr.end    || curr.end_date}`);
      if (next) {
        console.log("\n➡️  NEXT MAHADASHA:");
        console.log(`   Planet: ${next.planet || next.dasha_name || next.name}`);
        console.log(`   Start:  ${next.start  || next.start_date}`);
        console.log(`   End:    ${next.end    || next.end_date}`);
      }
    } else {
      console.log("⚠️  No active period found by date range. Printing all periods:");
      allPeriods.forEach((p, i) =>
        console.log(`  [${i}] ${p.planet||p.dasha_name||p.name}: ${p.start||p.start_date} → ${p.end||p.end_date}`)
      );
    }
  } else {
    // Try flat structure from currentDasha
    console.log("Flat currentDasha structure:");
    console.log(JSON.stringify(currentDasha, null, 2).slice(0, 800));
  }

  // ── Antardasha from currentDasha ──────────────────────────────────────────
  console.log("\n── CURRENT ANTARDASHA (from currentDasha) ───────────────");
  if (currentDasha.sub_dasha) {
    console.log("Antardasha:    ", currentDasha.sub_dasha);
    console.log("Antardasha End:", currentDasha.sub_dasha_end || currentDasha.antardasha_end || "—");
    console.log("Pratyantar:    ", currentDasha.sub_sub_dasha || "—");
  } else if (currentDasha.current) {
    const c = currentDasha.current;
    console.log("Antardasha:    ", c.sub_dasha || c.antardasha || "—");
    console.log("Antardasha End:", c.sub_dasha_end || c.antardasha_end || "—");
  } else {
    console.log("Structure:", JSON.stringify(currentDasha).slice(0, 400));
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  Test Complete ✅");
  console.log("═══════════════════════════════════════════════════════════");
}

main().catch(err => {
  console.error("❌ Test failed:", err.message);
  process.exit(1);
});
