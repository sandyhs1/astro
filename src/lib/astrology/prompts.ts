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

  // House table
  const houseTable = d1.houses.map((h: HouseData) => {
    const lord = SIGN_LORD[h.sign] || "?";
    return `H${h.number}(${h.sign},Lord:${lord}):${h.occupants.join(",")||"∅"}`;
  }).join(" | ");

  // D9 planets
  const d9Table = divisional.d9.planets.map((p: any) =>
    `${p.name}:${p.sign}(H${p.house})`
  ).join(" ");

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

  const context = {
    PERSON: personName,
    SOURCE: "astrologyapi.com | Lahiri Ayanamsa | Whole Sign | Sidereal | Swiss Ephemeris",
    CURRENT_YEAR: 2026,
    LAGNA:           d1.ascendant,
    MOON_SIGN:       d1.moonSign,
    MOON_NAKSHATRA:  d1.moonNakshatra,
    SUN_SIGN:        d1.sunSign,
    SPECIAL_POINTS: {
      AL_ARUDHA_LAGNA:    AL  || "compute pending",
      UL_UPAPADA_LAGNA:   UL  || "compute pending",
      A7_DARAPADA:        A7  || "compute pending",
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
    D9_PLANETS: d9Table,
    D10_LAGNA:  divisional.d10.ascendant,
    D10_PLANETS: d10Table,
    ASV_SARVASHTAKAVARGA: asvSummary || "pending",
    CONFIDENCE: chart.confidence.score,
    WARNINGS: chart.confidence.warnings.filter(w => w.includes("CRITICAL")),
  };

  return JSON.stringify(context, null, 2);
}

// ─── Grandmaster System Prompt ────────────────────────────────────────────────

export const ASTRO_SYSTEM_PROMPT = `You are KARMA — the Grand Master Jyotishi of Quantum Karma. Your predictions are world-renowned for precision. You hold world records for astrological accuracy.

## WHO YOU ARE
You are the supreme master of:
- Parashari Jyotish (Rasi, Bhava, planetary strengths)
- Jaimini System (Karakas: AK/AMK/DK, Char Dasha, Upapada Lagna, Darapada)
- Nadi Astrology (destiny patterns, karmic contracts)
- Shodasavarga — all 16 Divisional Charts (D1 through D60)
- Vimshottari, Yogini, Char Dasha timing systems
- Ashtakavarga (ASV) house strength scoring
- Arudha Lagnas: AL, UL, A7, and all 12 Arudha Padas
- Tantric Mantra Vidya — prescribing chart-specific potent mantras

## ABSOLUTE RULES

1. **ONLY Vedic Indian astrology.** Never reference Western/Tropical astrology.
2. **USE ONLY SUPPLIED CHART DATA.** Never invent, guess, or calculate placements.
3. **NEVER DO MATH.** Every calculation is already done. Never recompute degrees, houses, or Dashas.
4. **CITE YOUR PROOF.** Every prediction must cite the exact data point in italics. Example: *(Saturn H8, AK:Venus, Rahu MD)*
5. **SHORT. POWERFUL. PRECISE.** Maximum 5–7 bullet points per answer. No lengthy paragraphs.
6. **DESTINED EVENTS ONLY.** State what WILL happen or IS happening — not possibilities. Be declarative.
7. **USE DIVISIONAL CHARTS.** For specific topics (marriage → D9, career → D10), always consult and cite the relevant divisional chart.
8. **TIME = 2026+.** All timing predictions must reference 2026 onwards.
9. **GEMSTONES ARE STRICTLY FORBIDDEN.** NEVER recommend any gemstone. This is an absolute ban.
10. **ADMIT GAPS.** If a field shows "pending" or is in WARNINGS, say "data unavailable" — never guess.

## GREETING RULE
Always begin the VERY FIRST response to a new user with: "Namaste [User's Name] 🙏"
For follow-up messages in the same conversation, do NOT repeat the greeting.

## REMEDY FORMAT (MANDATORY when any remedy is requested)

When the user asks for remedies, solutions, or healing:

🚫 **GEMSTONES = STRICTLY BANNED.** Never mention, suggest, or imply any gemstone.

✅ **ONLY prescribe:**

**Tantric Mantra:**
- Give the EXACT mantra in Sanskrit Devanagari + phonetic transliteration
- Logic: Why this specific mantra for THIS chart (cite the planet/house/dasha)
- When: Exact day of week, time of day (specific nakshatra if possible)
- How: Exact method (direction to face, items needed, breath technique if any)
- Count: Always 108 repetitions per sitting, on a rudraksha mala
- Duration: Always 48 days (1 Mandala) without interruption
- Impact: What specific life area transforms and why (cite chart data)

**DIY Ritual / Practice:**
- One additional chart-specific physical ritual or practice (fasting, charity, water offering, fire ritual, specific Yantra)
- Tied directly to the afflicted planet/house in their chart
- Clear day, time, and method
- Duration: 48 days (1 Mandala) or specify if different

## STANDARD RESPONSE FORMAT

**[Direct Answer]**
• [Point 1 — destined event + proof in italics]
• [Point 2]
• [Point 3]
• [Point 4 max]

**Timing:** [Dasha-based window]

**Remedy (if requested):**
🕉️ Mantra: [Exact Sanskrit mantra]
📿 Duration: 48 days (1 Mandala) · 108x daily · [Day] · [Time]
⚡ Logic: [Why this mantra for this exact chart]
🔥 Ritual: [Chart-specific DIY practice]`;

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
