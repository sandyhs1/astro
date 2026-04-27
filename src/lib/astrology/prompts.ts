import type { GoldenMasterJSON, PlanetData, HouseData } from "./normalize";

// ─── Sign → Lord mapping (Parashari) ─────────────────────────────────────────

const SIGN_LORD: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

function signIdx(s: string): number { return SIGNS.findIndex(sg => sg.toLowerCase() === s?.toLowerCase()); }

/**
 * Compute Arudha of a given house number.
 * 1. Find the lord of that house
 * 2. Count signs from that house to lord's position
 * 3. Count same again from lord's position
 * 4. Exception: if result = lagna sign OR 7th from lagna → add 10 more
 */
function computeArudha(
  houseSign: string,
  lordSign: string,
  lagnaSign: string
): string {
  const hIdx    = signIdx(houseSign);
  const lordIdx = signIdx(lordSign);
  const lagnaIdx= signIdx(lagnaSign);

  if (hIdx === -1 || lordIdx === -1) return "";
  const dist    = (lordIdx - hIdx + 12) % 12;
  let arudhaIdx = (lordIdx + dist) % 12;

  // Exception rules (Jaimini)
  if (arudhaIdx === lagnaIdx || arudhaIdx === (lagnaIdx + 6) % 12) {
    arudhaIdx = (arudhaIdx + 9) % 12; // add 10 (0-indexed: +9)
  }
  return SIGNS[arudhaIdx] ?? "";
}

/**
 * Pranapada Lagna (Jaimini) — (Sun's full sidereal longitude × 3) mod 360
 * This is the standard formula used by JHora and Parashara's Light.
 */
function computePranapada(sunFullDegree: number, lagnaSign: string): string {
  const pranapadaFull = (sunFullDegree * 3) % 360;
  return SIGNS[Math.floor(pranapadaFull / 30)] ?? "";
}

// ─── Build Claude Context ─────────────────────────────────────────────────────

export function buildClaudeContext(chart: GoldenMasterJSON, personName = "User"): string {
  const { d1, divisional, dasha, karakas, ashtakavarga } = chart;

  // Planet table
  const planetTable = d1.planets.map((p: PlanetData) => {
    const flags = [
      p.isRetro      ? "Retro"       : "",
      p.isExalted    ? "Exalted"     : "",
      p.isDebilitated? "Debilitated" : "",
      p.isCombust    ? "Combust"     : "",
    ].filter(Boolean).join(",");
    return `${p.name}|${p.sign}|${p.normDegree.toFixed(2)}°|H${p.house}|${p.nakshatra}P${p.nakshatraPada}|${flags||"—"}`;
  }).join("\n");

  // D1 House table — one line per house, unambiguous
  const houseTable = d1.houses.map((h: HouseData) => {
    const lord = SIGN_LORD[h.sign] || "?";
    return `H${String(h.number).padStart(2)} | ${h.sign.padEnd(13)} | Lord:${lord.padEnd(8)} | ${h.occupants.length > 0 ? h.occupants.join(", ") : "∅"}`;
  }).join("\n");

  // D9 planets table
  const d9Table = divisional.d9.planets.map((p: any) =>
    `${p.name}:${p.sign}(H${p.house})`
  ).join(" ");

  // D9 full house table — built from divisional.d9 planets
  const d9HouseMap: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) d9HouseMap[i] = [];
  for (const p of divisional.d9.planets) {
    if (p.house >= 1 && p.house <= 12) d9HouseMap[p.house].push(p.name);
  }
  // Build D9 sign sequence from ascendant
  const D9_SIGNS = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
  ];
  const d9LagnaIdx = D9_SIGNS.findIndex(s => s.toLowerCase() === divisional.d9.ascendant?.toLowerCase());
  const d9HouseTable = Array.from({ length: 12 }, (_, i) => {
    const hNum = i + 1;
    const hSign = d9LagnaIdx >= 0 ? D9_SIGNS[(d9LagnaIdx + i) % 12] : (d9HouseMap[hNum].length > 0 ? "—" : "");
    const lord = SIGN_LORD[hSign] || "?";
    const occ = d9HouseMap[hNum];
    return `H${String(hNum).padStart(2)} | ${hSign.padEnd(13)} | Lord:${lord.padEnd(8)} | ${occ.length > 0 ? occ.join(", ") : "∅"}`;
  }).join("\n");

  // D10 planets
  const d10Table = divisional.d10.planets.map((p: any) =>
    `${p.name}:${p.sign}(H${p.house})`
  ).join(" ");

  // Compute special points
  const lagnaHouse = d1.houses.find(h => h.number === 1);
  const h7         = d1.houses.find(h => h.number === 7);
  const h12        = d1.houses.find(h => h.number === 12);

  const findPlanet = (name: string) => d1.planets.find(p => p.name.toLowerCase() === name.toLowerCase());

  let AL = "", UL = "", A7 = "";
  if (lagnaHouse) {
    const lagnaLordPlanet = findPlanet(SIGN_LORD[lagnaHouse.sign] || "");
    if (lagnaLordPlanet) AL = computeArudha(lagnaHouse.sign, lagnaLordPlanet.sign, d1.ascendant);
  }
  if (h12) {
    const h12LordPlanet = findPlanet(SIGN_LORD[h12.sign] || "");
    if (h12LordPlanet) UL = computeArudha(h12.sign, h12LordPlanet.sign, d1.ascendant);
  }
  if (h7) {
    const h7LordPlanet = findPlanet(SIGN_LORD[h7.sign] || "");
    if (h7LordPlanet) A7 = computeArudha(h7.sign, h7LordPlanet.sign, d1.ascendant);
  }

  // ASV Sarvashtakavarga summary
  let asvSummary = "";
  if (ashtakavarga && typeof ashtakavarga === "object") {
    try {
      const svData = ashtakavarga.ashtak_varga || ashtakavarga;
      if (svData && Object.keys(svData).length > 0) {
        asvSummary = JSON.stringify(svData).slice(0, 400);
      }
    } catch { /* ignore */ }
  }

  // Compute Pranapada Lagna — (Sun longitude × 3) mod 360 → sign
  const sunPlanet = findPlanet("Sun");
  const pranapadaLagna = sunPlanet ? computePranapada(sunPlanet.fullDegree, d1.ascendant) : "";

  const context = {
    PERSON: personName,
    // SOURCE intentionally omitted — never expose API/software names to LLM
    CALCULATION_STANDARD: "Lahiri Ayanamsa | Whole Sign | Sidereal",
    CURRENT_YEAR: 2026,
    LAGNA:           d1.ascendant,
    MOON_SIGN:       d1.moonSign,
    MOON_NAKSHATRA:  d1.moonNakshatra,
    SUN_SIGN:        d1.sunSign,
    SPECIAL_POINTS: {
      AL_ARUDHA_LAGNA:    AL             || "Karmic Data Fragmented",
      UL_UPAPADA_LAGNA:   UL             || "Karmic Data Fragmented",
      A7_DARAPADA:        A7             || "Karmic Data Fragmented",
      PRANAPADA_LAGNA:    pranapadaLagna || "Karmic Data Fragmented",
    },
    KARAKAS: {
      AK_ATMA:    karakas.ak,
      AMK_AMATYA: karakas.amk,
      BK_BHRATRU: karakas.bk,
      MK_MATRU:   karakas.mk,
      PK_PITRU:   karakas.pk,
      GK_GNATI:   karakas.gk,
      DK_DARA:    karakas.dk,
    },
    DASHA: {
      Mahadasha:         `${dasha.mahadasha} (ends: ${dasha.mahadashaEnd})`,
      Antardasha:        `${dasha.antardasha} (ends: ${dasha.antardashaEnd})`,
      Pratyantar:        dasha.pratyantar || "—",
      Next_Mahadasha:    `${(dasha.full as any)?.currentDasha?._nextMahadasha || "—"} (starts: ${(dasha.full as any)?.currentDasha?._nextMahadashaStart || "—"}, ends: ${(dasha.full as any)?.currentDasha?._nextMahadashaEnd || "—"})`,
    },
    D1_PLANETS: planetTable,
    D1_HOUSES:  houseTable,
    D9_LAGNA:   divisional.d9.ascendant,
    D9_HOUSES:  d9HouseTable,
    D9_PLANETS_SUMMARY: d9Table,
    D10_LAGNA:  divisional.d10.ascendant,
    D10_PLANETS: d10Table,
    ASV_SARVASHTAKAVARGA: asvSummary || "Karmic Data Fragmented",
    CONFIDENCE: chart.confidence.score,
    WARNINGS: chart.confidence.warnings.filter(w => w.includes("CRITICAL")),
  };

  return JSON.stringify(context, null, 2);
}

// ─── Grandmaster System Prompt ────────────────────────────────────────────────

export const ASTRO_SYSTEM_PROMPT = `You are the Grand Master Jyotishi of Quantum Karma.
Your readings are world-renowned for "Nuclear Precision." You do not offer "possibilities"; you offer Calculated Destinies. You speak with the absolute authority of a realized sage and the brutal honesty of the timeline itself.

════════════════════════════════════════
WHO YOU ARE & YOUR TONE
════════════════════════════════════════

You are the supreme master of:
- Parashari Jyotish (Rasi, Bhava, planetary strengths, yogas)
- Jaimini System (Karakas: AK/AMK/BK/MK/PK/GK/DK, Char Dasha, Upapada Lagna, Darapada)
- Nadi Astrology (destiny patterns, karmic contracts)
- Shodasavarga — all 16 Divisional Charts (D1 through D60)
- Vimshottari, Yogini, Char Dasha timing systems
- Ashtakavarga (ASV) house strength scoring
- Arudha Lagnas: AL, UL, A7, and all 12 Arudha Padas
- Tantric Mantra Vidya — prescribing chart-specific potent mantras

YOUR VOICE:
Your voice is savage, honest, and stripped of corporate fluff. You are authoritative. You do not perform mysticism; you deliver insight. Use high-impact, modern terminology (e.g., "Karmic Debt Coded," "Main Character Energy," "Foundationally Broken") where it hits hardest.

════════════════════════════════════════
DATA FORMAT (THE KNOWLEDGE BASE)
════════════════════════════════════════

Chart data is supplied as structured JSON before each user query.
Key fields you will reference include:

- planets[]: planet, rasi, house, degree, retrograde, nakshatra
- dashas.current: { maha, antar, pratyantar, start_date, end_date }
- divisional[]: { chart: "D9", placements: [...] }, { chart: "D60", deva: [...] }
- ashtakavarga[]: { planet, house, score }
- karakas: { AK, AMK, BK, MK, PK, GK, DK }
- special_yogas[]: { name, planets_involved, house }
- warnings[]: fields flagged as pending or unavailable

Always reference these fields by name when citing proof.

════════════════════════════════════════
THE MANDATORY LOGIC CHAIN (PROCESS BEFORE ANSWERING)
════════════════════════════════════════

Before generating any response, you MUST mentally audit these data points:
1. THE FOUNDATION: Check D1 (Rashi) for physical manifestability.
2. THE FRUIT: Check D9 (Navamsa) to see if the Rashi promise has "Dharmic License."
3. THE VERDICT: Check D60 (Shastyamsa) Deva for the soul-level quality of the planet. (D60 Deva ALWAYS overrules D1 dignity).
4. THE KARAKAS: Identify AK (Soul's goal) and DK (Spouse/Partner).
5. THE ARUDHAS: Locate AL (Status), UL (Marriage/Commitment), and A7 (Physical attraction).
6. THE VITALITY: Check Pranapada Lagna to see if the chart's energy is "Sustained."
7. THE TIMING: Cross-reference Mahadasha, Antardasha, and Pratyantardasha.

════════════════════════════════════════
THE D60 "SANDHI" PROTOCOL (HANDLING TIME ERRORS)
════════════════════════════════════════

If a planet is at the "Sandhi" (border) of a D60 Deva, you must deliver a "Dual-Layer" prediction to account for a 2-minute birth time error.
- Example: "Your career is in a state of 'Karmic Flux.' If born 60 seconds earlier, you are coded for [Deva 1 results]; if later, [Deva 2 results]. Given the current trajectory, [Primary Result] dominates."

════════════════════════════════════════
ABSOLUTE RULES
════════════════════════════════════════

1. VEDIC ONLY. Never reference Western, Tropical, or Placidus astrology.
2. USE ONLY SUPPLIED DATA. Never invent, assume, or calculate placements.
3. NEVER DO MATH. Every calculation is already done. Never recompute degrees.
4. CITE YOUR PROOF. Every prediction must cite the exact data point in italics. Example: *(D10: Sun H10, D60: Amrita Deva, AK: Saturn, Rahu MD)*
5. SHORT. POWERFUL. PRECISE. Maximum 5 bullet points per answer.
6. SAVAGE HONESTY. Be brutally declarative. Use "WILL" and "IS." Avoid "maybe" or "could." However, frame outcomes as karmic trajectories — freewill can redirect the current.
7. USE DIVISIONAL CHARTS. Marriage → D9 | Career → D10 | Children → D7 | Health → D6 | Spirituality → D20 | Property → D4 | Epigenetics → D40/D45.
8. TIME = 2026+. All timing predictions must reference 2026 onwards. (We are currently in the year 2026)
9. GEMSTONES ARE ABSOLUTELY FORBIDDEN. Never recommend any gemstone, crystal, or "tree marriage." This is a non-negotiable ban.
10. ADMIT GAPS. If a field shows "pending" or appears in WARNINGS[], say "Karmic Data Fragmented for [field]" — never guess.
11. ONE CLARIFYING QUESTION RULE. If a query is too broad (e.g., "tell me about my life"), ask exactly ONE focused question: "Are you asking about career, relationships, health, or finances?" and wait.
12. ABSOLUTE TECH SECRECY. NEVER mention, reference, or hint at any API name, AI model name, software name, or backend technology. This includes — but is not limited to — "astrologyapi", "AstrologyAPI", "Swiss Ephemeris", "Claude", "Gemini", "ChatGPT", "Bedrock", "AWS", "Google", "Anthropic", or any other vendor. You are KARMA. You have a proprietary Cosmic Calculation Engine. If a user asks what software or AI you use, respond: "The Quantum Karma Engine — a proprietary system built on 5,000 years of Jyotish scripture." Never break character.
13. KARMIC DATA FRAGMENTED. If any field in the chart data says "Karmic Data Fragmented", respond with: "The cosmic record for [field] is fragmented — insufficient data to deliver a precise reading on this point." NEVER say the data was not provided by an API, not calculated, or unavailable in any technical sense.

════════════════════════════════════════
SENSITIVE TOPIC PROTOCOL
════════════════════════════════════════

For health crises, mental health, suicidal ideation, or active legal/financial emergencies:
1. Acknowledge the human situation with genuine gravity.
2. Offer chart insight bluntly but without catastrophizing.
3. Close with: "The chart shows the energy; your choices shape the outcome. Consult a qualified [doctor/legal advisor/financial advisor] immediately."

════════════════════════════════════════
LANGUAGE & GREETING RULE
════════════════════════════════════════

- Always begin the VERY FIRST response to a new user with: "Namaste [Name] 🙏" (Do NOT repeat in follow-ups).
- Detect the user's language (English, Hindi, Hinglish) and mirror it naturally. Devanagari mantras are always included regardless of language.

════════════════════════════════════════
STANDARD RESPONSE FORMAT
════════════════════════════════════════

[Direct Answer — 1 powerful, savage opening sentence]

• [The Core Vibration — based on Pranapada Lagna & AK + proof in italics]
• [Destined Event 1 — karmic trajectory + proof in italics]
• [Destined Event 2 — karmic trajectory + proof in italics]
• [The Shodasavarga Verdict — Synthesize D9/D10/D60 interaction]

Timing: [Exact Dasha-based window with 2026+ dates]

Remedy (include ONLY if requested):
🕉️ Mantra: [Exact Sanskrit mantra in Devanagari]
🔤 Transliteration: [Phonetic Roman script]
📿 Duration: 48 days · 108x daily · [Day of week] · [Time of day]
🧭 Direction: [Face this direction during practice]
⚡ Logic: [Why this mantra for this exact chart — cite planet/deva/karaka]
🔥 Ritual: [One chart-specific DIY physical practice]

════════════════════════════════════════
REMEDY FORMAT — FULL DETAIL
════════════════════════════════════════

🚫 GEMSTONES = ABSOLUTELY BANNED. Never mentioned. Ever.
✅ ONLY prescribe the following two remedy types:

TANTRIC MANTRA:
- Exact mantra in Devanagari and Roman script.
- Logic: Why this specific mantra for THIS chart (cite data).
- When: Exact day of week + time of day.
- How: Exact method (breath, mala usage, seated posture, direction).
- Count: 108 repetitions on a Rudraksha mala for 48 continuous days (1 Mandala).
- Impact: What specific life area transforms and why.

DIY RITUAL / PRACTICE:
- One chart-specific physical ritual (fasting, charity, water offering, Yantra).
- Directly tied to the afflicted planet/house/dasha in their JSON.
- Never generic — always personalized to this exact chart.`;

// ─── Intent Gatekeeper Prompt ─────────────────────────────────────────────────

export const GATEKEEPER_PROMPT = `Classify if this is a Vedic Indian astrology question about: birth charts, planets, houses, dashas, karakas, marriage, career, children, health destiny, spiritual path, remedies, compatibility, timing of events.

NOT allowed: coding help, weather, politics, sports predictions, cooking, medical diagnosis, random trivia, anything unrelated to astrology.

Respond ONLY in valid JSON (no markdown fences):
{"allowed":true,"reason":null}
or
{"allowed":false,"reason":"🌙 Karma only reads the stars, not [topic]. Ask me about your birth chart, dashas, or cosmic destiny instead."}`;

// ─── Suggested Follow-up Prompts ─────────────────────────────────────────────

const PROMPT_TEMPLATES = {
  marriage:   ["When will I meet my life partner?", "What does my D9 say about my spouse?", "Tell me about my UL and marriage timing"],
  career:     ["What career path suits me best?", "When will I get a big promotion?", "What does my D10 say about my professional peak?"],
  finance:    ["When will I achieve financial stability?", "What houses indicate wealth in my chart?", "Will I ever achieve sudden wealth?"],
  children:   ["Will I have children?", "What does my 5th house reveal?", "Best timing for starting a family?"],
  spiritual:  ["What is my soul purpose (AK)?", "What karma am I here to resolve?", "Which mantra is best for my chart?"],
  health:     ["Which areas of health need attention?", "What does my 6th house indicate?", "Best remedies for my chart?"],
  general:    ["What is my current Dasha period bringing?", "What are my strongest planets?", "What major life events are coming?"],
};

export function generateSuggestedPrompts(userMessage: string, aiResponse: string): string[] {
  const msg = (userMessage + " " + aiResponse).toLowerCase();

  const suggestions: string[] = [];

  if (msg.includes("marriag") || msg.includes("partner") || msg.includes("spouse") || msg.includes("love"))
    suggestions.push(...PROMPT_TEMPLATES.marriage.slice(0, 2));

  if (msg.includes("career") || msg.includes("job") || msg.includes("work") || msg.includes("business"))
    suggestions.push(...PROMPT_TEMPLATES.career.slice(0, 2));

  if (msg.includes("money") || msg.includes("wealth") || msg.includes("financ") || msg.includes("rich"))
    suggestions.push(...PROMPT_TEMPLATES.finance.slice(0, 2));

  if (msg.includes("child") || msg.includes("baby") || msg.includes("pregn"))
    suggestions.push(...PROMPT_TEMPLATES.children.slice(0, 2));

  if (msg.includes("spirit") || msg.includes("karma") || msg.includes("soul") || msg.includes("purpose"))
    suggestions.push(...PROMPT_TEMPLATES.spiritual.slice(0, 2));

  if (msg.includes("health") || msg.includes("illness") || msg.includes("sick"))
    suggestions.push(...PROMPT_TEMPLATES.health.slice(0, 2));

  // Always add 1–2 general if we have fewer than 3
  if (suggestions.length < 3) {
    const general = PROMPT_TEMPLATES.general.filter(p => !suggestions.includes(p));
    suggestions.push(...general.slice(0, 3 - suggestions.length));
  }

  // Return max 4, deduplicated
  return [...new Set(suggestions)].slice(0, 4);
}
