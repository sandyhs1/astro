import type { GoldenMasterJSON, PlanetData, HouseData, DivisionalChart } from "./normalize";
import type { JyotishTopic } from "./prompts";

// ─── Utility Functions ────────────────────────────────────────────────────────

const SIGN_LORD: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

function getPlanet(chart: GoldenMasterJSON, name: string): PlanetData | undefined {
  if (!name) return undefined;
  return chart.d1.planets.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

function getHouse(chart: GoldenMasterJSON, num: number): HouseData | undefined {
  return chart.d1.houses.find((h) => h.number === num);
}

function getDivisionalPlanet(dc: DivisionalChart, name: string) {
  if (!name) return undefined;
  return dc.planets.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

function getASVScore(chart: GoldenMasterJSON, houseNum: number): number {
  if (!chart.ashtakavarga || typeof chart.ashtakavarga !== "object") return 0;
  const svData = chart.ashtakavarga.ashtak_varga || chart.ashtakavarga;
  return svData[`${houseNum}`] || 0;
}

function formatDignity(p: PlanetData | undefined, chart: GoldenMasterJSON): string {
  if (!p) return "Unknown";
  let dig = p.isExalted ? "Exalted" : p.isDebilitated ? "Debilitated" : "Normal";
  if (p.isCombust) dig += " (Combust)";
  if (p.isRetro) dig += " (Retro)";
  
  const d60DevaObj = (chart.extras?.d60Devas as any)?.[p.name];
  if (d60DevaObj) {
    dig += ` | D60 Deva: ${d60DevaObj.deva} (${d60DevaObj.quality})`;
  }
  return dig;
}

// ─── Module 11: Dasha Timing Engine ──────────────────────────────────────────

export function computeDashaTimingContext(chart: GoldenMasterJSON, targetPlanets: string[]): string {
  const d = chart.dasha;
  let timingContext = `CURRENT DASHA:
  Mahadasha:  ${d.mahadasha} (ends ${d.mahadashaEnd})
  Antardasha: ${d.antardasha} (ends ${d.antardashaEnd})
  Pratyantar: ${d.pratyantar} (${d.pratyantarStart} → ${d.pratyantarEnd})
`;

  const targetsSet = new Set(targetPlanets.map(p => p.toLowerCase()));
  const isActive = targetsSet.has(d.mahadasha?.toLowerCase()) || 
                   targetsSet.has(d.antardasha?.toLowerCase()) || 
                   targetsSet.has(d.pratyantar?.toLowerCase());

  timingContext += `\nTARGET PLANETS ACTIVATION (${targetPlanets.join(", ")}):\n`;
  if (isActive) {
    timingContext += `  ✅ A target planet is CURRENTLY ACTIVE in the Dasha timeline.\n`;
  } else {
    timingContext += `  ⏳ Target planets are NOT active right now. Check VIMSHOTTARI_ALL_PERIODS for future timing.\n`;
  }
  
  return timingContext;
}

// ─── Module 1: Marriage & Relationships ──────────────────────────────────────

export function computeMarriageContext(chart: GoldenMasterJSON): string {
  const h7 = getHouse(chart, 7);
  const h9 = getHouse(chart, 9);
  const h11 = getHouse(chart, 11);
  const venus = getPlanet(chart, "Venus");
  const dkName = chart.karakas.dk;
  const dkPlanet = getPlanet(chart, dkName);

  const asv7 = getASVScore(chart, 7);
  const asv9 = getASVScore(chart, 9);

  let output = `══════════════════════════════════════════════════════
COMPUTED MARRIAGE ANALYSIS — PRE-CALCULATED. DO NOT RE-DERIVE.
══════════════════════════════════════════════════════

1ST MARRIAGE INDICATORS (7th House & Upapada):
  7th House Sign: ${h7?.sign} | Lord: ${h7 ? SIGN_LORD[h7.sign] : "?"}
  Occupants: ${h7?.occupants.join(", ") || "None"}
  7th House ASV: ${asv7} pts
  Upapada Lagna (UL): ${chart.specialPoints.UL} (House ${chart.specialPoints.UL_house})

NATURAL SIGNIFICATOR (Venus):
  D1: House ${venus?.house} (${venus?.sign}) | Dignity: ${formatDignity(venus, chart)}
  D9 (Navamsha): House ${getDivisionalPlanet(chart.divisional.d9, "Venus")?.house} (${getDivisionalPlanet(chart.divisional.d9, "Venus")?.sign})

DARAKARAKA (Spouse Indicator - ${dkName}):
  D1: House ${dkPlanet?.house} (${dkPlanet?.sign}) | Dignity: ${formatDignity(dkPlanet, chart)}
  D9 (Navamsha): House ${getDivisionalPlanet(chart.divisional.d9, dkName)?.house} (${getDivisionalPlanet(chart.divisional.d9, dkName)?.sign})

SUCCESSIVE MARRIAGES (Jaimini Framework):
  2nd Marriage (9th House - 3rd from 7th): Sign ${h9?.sign} | Lord: ${h9 ? SIGN_LORD[h9.sign] : "?"} | Occupants: ${h9?.occupants.join(", ") || "None"} | ASV: ${asv9}
  3rd Marriage (11th House - 3rd from 9th): Sign ${h11?.sign} | Lord: ${h11 ? SIGN_LORD[h11.sign] : "?"} | Occupants: ${h11?.occupants.join(", ") || "None"}

TIMING (Targeting 7th Lord, Venus, and DK):
${computeDashaTimingContext(chart, [h7 ? SIGN_LORD[h7.sign] : "", "Venus", dkName].filter(Boolean))}

LLM RULES FOR MARRIAGE READING:
  ✅ Focus strictly on the 1st Marriage data for general inquiries.
  ✅ Only discuss 2nd/3rd marriage if explicitly asked, using ONLY the 9th/11th house data respectively.
  ❌ DO NOT predict multiple marriages based merely on 7th house afflictions without analyzing the 9th house.
  ❌ DO NOT use Western/Tropical rules.
`;
  return output;
}

// ─── Module 2: Sexuality, Fantasies & Affairs ────────────────────────────────

export function computeSexualityContext(chart: GoldenMasterJSON): string {
  const h8 = getHouse(chart, 8);
  const h12 = getHouse(chart, 12);
  const a7House = chart.specialPoints.A7_house;
  const a7Sign = chart.specialPoints.A7;

  let output = `══════════════════════════════════════════════════════
COMPUTED SEXUALITY & SECRETS ANALYSIS — PRE-CALCULATED.
══════════════════════════════════════════════════════

HIDDEN DESIRES & TABOOS (8th House):
  Sign: ${h8?.sign} | Lord: ${h8 ? SIGN_LORD[h8.sign] : "?"} | Occupants: ${h8?.occupants.join(", ") || "None"}

BED PLEASURES & FANTASIES (12th House):
  Sign: ${h12?.sign} | Lord: ${h12 ? SIGN_LORD[h12.sign] : "?"} | Occupants: ${h12?.occupants.join(", ") || "None"}

PHYSICAL ATTRACTION & AFFAIRS (Darapada - A7):
  A7 Sign: ${a7Sign} | Placed in House: ${a7House}

KARAKAS (Venus, Mars, Rahu):
  Venus: House ${getPlanet(chart, "Venus")?.house} | Dignity: ${formatDignity(getPlanet(chart, "Venus"), chart)}
  Mars: House ${getPlanet(chart, "Mars")?.house} | Dignity: ${formatDignity(getPlanet(chart, "Mars"), chart)}
  Rahu: House ${getPlanet(chart, "Rahu")?.house} | Dignity: ${formatDignity(getPlanet(chart, "Rahu"), chart)}

D30 (Trimshamsha - Hidden Flaws):
  Lagna: ${chart.divisional.d30.ascendant}
  Venus in D30: House ${getDivisionalPlanet(chart.divisional.d30, "Venus")?.house}
  Mars in D30: House ${getDivisionalPlanet(chart.divisional.d30, "Mars")?.house}

LLM RULES FOR SEXUALITY READING:
  ✅ Speak with raw, non-judgmental honesty about desires and psychological shadows.
  ✅ Frame "affairs" or "cheating" as karmic vulnerabilities (indicated by A7, 8H, 12H, and Rahu/Venus), not guaranteed events.
  ❌ DO NOT shame the user.
  ❌ DO NOT predict infidelity unless there are severe afflictions involving A7, Venus, and Rahu.
`;
  return output;
}

// ─── Module 3: Career & Profession ──────────────────────────────────────────

export function computeCareerContext(chart: GoldenMasterJSON): string {
  const h10 = getHouse(chart, 10);
  const asv10 = getASVScore(chart, 10);
  const amkName = chart.karakas.amk;
  const amkPlanet = getPlanet(chart, amkName);
  
  return `══════════════════════════════════════════════════════
COMPUTED CAREER ANALYSIS — PRE-CALCULATED.
══════════════════════════════════════════════════════

10TH HOUSE (Career & Reputation):
  Sign: ${h10?.sign} | Lord: ${h10 ? SIGN_LORD[h10.sign] : "?"}
  Occupants: ${h10?.occupants.join(", ") || "None"}
  10th House ASV: ${asv10} pts (≥28 is excellent)

AMATYAKARAKA (Career Indicator - ${amkName}):
  D1: House ${amkPlanet?.house} (${amkPlanet?.sign}) | Dignity: ${formatDignity(amkPlanet, chart)}
  D10 (Dashamsha): House ${getDivisionalPlanet(chart.divisional.d10, amkName)?.house} (${getDivisionalPlanet(chart.divisional.d10, amkName)?.sign})

D10 DASHAMSHA (Professional Success):
  D10 Lagna: ${chart.divisional.d10.ascendant}

ARUDHAS (Public Image):
  Arudha Lagna (AL): ${chart.specialPoints.AL} (House ${chart.specialPoints.AL_house})
  Rajya Pada (A10): ${chart.specialPoints.A10}

TIMING (Targeting 10th Lord and AmK):
${computeDashaTimingContext(chart, [h10 ? SIGN_LORD[h10.sign] : "", amkName].filter(Boolean))}

LLM RULES FOR CAREER:
  ✅ A strong AmK in D10 confirms career rise.
  ✅ ASV < 25 in 10H means hard work with delayed recognition.
`;
}

// ─── Module 4: Wealth & Finance ────────────────────────────────────────────

export function computeWealthContext(chart: GoldenMasterJSON): string {
  const h2 = getHouse(chart, 2);
  const h11 = getHouse(chart, 11);
  const jup = getPlanet(chart, "Jupiter");
  
  return `══════════════════════════════════════════════════════
COMPUTED WEALTH ANALYSIS — PRE-CALCULATED.
══════════════════════════════════════════════════════

2ND HOUSE (Savings & Assets):
  Sign: ${h2?.sign} | Lord: ${h2 ? SIGN_LORD[h2.sign] : "?"} | ASV: ${getASVScore(chart, 2)}
  Occupants: ${h2?.occupants.join(", ") || "None"}

11TH HOUSE (Gains & Income):
  Sign: ${h11?.sign} | Lord: ${h11 ? SIGN_LORD[h11.sign] : "?"} | ASV: ${getASVScore(chart, 11)}
  Occupants: ${h11?.occupants.join(", ") || "None"}

JUPITER (Karaka of Wealth):
  D1: House ${jup?.house} | Dignity: ${formatDignity(jup, chart)}
  D2 (Hora): House ${getDivisionalPlanet(chart.divisional.d2, "Jupiter")?.house}

ARUDHAS (Tangible Wealth):
  Dhana Pada (A2): ${chart.specialPoints.A2}
  Labha Pada (A11): ${chart.specialPoints.A11}

TIMING (Targeting 2nd/11th Lords and Jupiter):
${computeDashaTimingContext(chart, [h2 ? SIGN_LORD[h2.sign] : "", h11 ? SIGN_LORD[h11.sign] : "", "Jupiter"].filter(Boolean))}

LLM RULES FOR WEALTH:
  ✅ 11th lord in 2nd house or vice versa creates a strong Dhana Yoga.
  ✅ Evaluate Hora (D2) for actual retained wealth.
`;
}

// ─── Module 5: Children, IVF & Fertility ────────────────────────────────────

export function computeChildrenContext(chart: GoldenMasterJSON): string {
  const h5 = getHouse(chart, 5);
  const pkName = chart.karakas.pk;
  const pkPlanet = getPlanet(chart, pkName);
  const jup = getPlanet(chart, "Jupiter");

  return `══════════════════════════════════════════════════════
COMPUTED FERTILITY & PROGENY ANALYSIS — PRE-CALCULATED.
══════════════════════════════════════════════════════

5TH HOUSE (Progeny):
  Sign: ${h5?.sign} | Lord: ${h5 ? SIGN_LORD[h5.sign] : "?"}
  Occupants: ${h5?.occupants.join(", ") || "None"}

PUTRAKARAKA (Child Indicator - ${pkName}):
  D1: House ${pkPlanet?.house} | Dignity: ${formatDignity(pkPlanet, chart)}
  D7 (Saptamsha): House ${getDivisionalPlanet(chart.divisional.d7, pkName)?.house}

JUPITER (Natural Significator for Children):
  D1: House ${jup?.house} | Dignity: ${formatDignity(jup, chart)}
  D7: House ${getDivisionalPlanet(chart.divisional.d7, "Jupiter")?.house}

D7 SAPTAMSHA (Detailed Progeny Chart):
  D7 Lagna: ${chart.divisional.d7.ascendant}

ARUDHA (Putra Pada - A5):
  A5 Sign: ${chart.specialPoints.A5}

TIMING (Targeting 5th Lord, PK, and Jupiter):
${computeDashaTimingContext(chart, [h5 ? SIGN_LORD[h5.sign] : "", pkName, "Jupiter"].filter(Boolean))}

LLM RULES FOR CHILDREN/IVF:
  ✅ Address IVF or fertility struggles ONLY if asked. Look for afflictions to 5H (Saturn/Rahu/Ketu) or debilitated Jupiter.
  ✅ Do not predict absolute barrenness; reframe as "medical assistance required" or "delayed manifestation."
  ✅ D7 Lagna lord dignity heavily influences childbirth success.
`;
}

// ─── Module 6: Health & Diseases ─────────────────────────────────────────────

export function computeHealthContext(chart: GoldenMasterJSON): string {
  const h1 = getHouse(chart, 1);
  const h6 = getHouse(chart, 6);
  const lagnaLord = h1 ? SIGN_LORD[h1.sign] : "";
  const llPlanet = getPlanet(chart, lagnaLord);

  return `══════════════════════════════════════════════════════
COMPUTED HEALTH ANALYSIS — PRE-CALCULATED.
══════════════════════════════════════════════════════

1ST HOUSE (Vitality & Physical Body):
  Lagna Lord: ${lagnaLord} | House: ${llPlanet?.house} | Dignity: ${formatDignity(llPlanet, chart)}
  Occupants in Lagna: ${h1?.occupants.join(", ") || "None"}

6TH HOUSE (Acute Illness & Immunity):
  Sign: ${h6?.sign} | Lord: ${h6 ? SIGN_LORD[h6.sign] : "?"}
  Occupants: ${h6?.occupants.join(", ") || "None"}

PRANAPADA LAGNA (Life Force):
  Sign: ${chart.specialPoints.PP}

D30 TRIMSHAMSHA (Detailed Health/Disease & Misfortunes):
  Lagna: ${chart.divisional.d30.ascendant}

TIMING (Targeting 6th Lord, 8th Lord, and Lagna Lord):
${computeDashaTimingContext(chart, [h6 ? SIGN_LORD[h6.sign] : "", lagnaLord].filter(Boolean))}

LLM RULES FOR HEALTH:
  ✅ Address chronic disease via the 8th house; acute illness via 6th house.
  ✅ Never predict death or specific fatal dates. Tell them to consult a doctor.
`;
}

// ─── Module 7: Misfortunes & Tragedies ───────────────────────────────────────

export function computeMisfortuneContext(chart: GoldenMasterJSON): string {
  const h8 = getHouse(chart, 8);
  
  return `══════════════════════════════════════════════════════
COMPUTED MISFORTUNE ANALYSIS — PRE-CALCULATED.
══════════════════════════════════════════════════════

8TH HOUSE (Sudden Events, Traumas, Transformations):
  Sign: ${h8?.sign} | Lord: ${h8 ? SIGN_LORD[h8.sign] : "?"}
  Occupants: ${h8?.occupants.join(", ") || "None"}

D30 TRIMSHAMSHA (Misfortunes & Unseen Dangers):
  D30 Lagna: ${chart.divisional.d30.ascendant}
  Saturn in D30: House ${getDivisionalPlanet(chart.divisional.d30, "Saturn")?.house}
  Rahu in D30: House ${getDivisionalPlanet(chart.divisional.d30, "Rahu")?.house}

LLM RULES FOR MISFORTUNE:
  ✅ Reframe misfortune as intense karmic clearing.
  ✅ 8th house activations bring sudden upheaval but also profound spiritual transformation.
`;
}

// ─── Module 8: Ancestral Karma & Pitru Dosh ─────────────────────────────────

export function computeAncestralContext(chart: GoldenMasterJSON): string {
  const h9 = getHouse(chart, 9);
  const h4 = getHouse(chart, 4);
  const sun = getPlanet(chart, "Sun");
  const rahu = getPlanet(chart, "Rahu");
  
  const pitruDosh = (sun?.house === rahu?.house) || (sun?.house === getPlanet(chart, "Ketu")?.house);

  return `══════════════════════════════════════════════════════
COMPUTED ANCESTRAL & PITRU DOSH ANALYSIS — PRE-CALCULATED.
══════════════════════════════════════════════════════

9TH HOUSE (Father & Ancestral Lineage):
  Sign: ${h9?.sign} | Lord: ${h9 ? SIGN_LORD[h9.sign] : "?"} | Occupants: ${h9?.occupants.join(", ") || "None"}

4TH HOUSE (Mother & Roots):
  Sign: ${h4?.sign} | Lord: ${h4 ? SIGN_LORD[h4.sign] : "?"} | Occupants: ${h4?.occupants.join(", ") || "None"}

PITRU DOSH (Ancestral Affliction):
  Sun conjunct Rahu/Ketu: ${pitruDosh ? "YES (Ancestral karma needs clearing)" : "NO"}
  Sun Dignity: ${formatDignity(sun, chart)}

DIVISIONAL CHARTS (D12/D40/D45):
  D12 Dwadashamsha (Parents): Lagna ${chart.divisional.d12.ascendant}
  D40 Khavedamsha (Maternal Karma): Lagna ${chart.divisional.d40.ascendant}
  D45 Akshavedamsha (Paternal Karma): Lagna ${chart.divisional.d45.ascendant}

LLM RULES FOR ANCESTRAL KARMA:
  ✅ If Pitru Dosh is present, prescribe specific spiritual remedies (no gemstones).
  ✅ D40 and D45 reveal deep inherited psychological patterns.
`;
}

// ─── Module 9: Spirituality & Soul Journey ──────────────────────────────────

export function computeSpiritualityContext(chart: GoldenMasterJSON): string {
  const akName = chart.karakas.ak;
  const akPlanet = getPlanet(chart, akName);
  const ketu = getPlanet(chart, "Ketu");
  const h12 = getHouse(chart, 12);

  return `══════════════════════════════════════════════════════
COMPUTED SPIRITUALITY ANALYSIS — PRE-CALCULATED.
══════════════════════════════════════════════════════

ATMAKARAKA (Soul's Core Mission - ${akName}):
  D1: House ${akPlanet?.house} | Dignity: ${formatDignity(akPlanet, chart)}
  D60 Deva: ${((chart.extras?.d60Devas as any)?.[akName]?.deva) || "Unknown"}

12TH HOUSE (Moksha & Liberation):
  Occupants: ${h12?.occupants.join(", ") || "None"}

KETU (Karaka of Moksha):
  House ${ketu?.house} (${ketu?.sign}) | Dignity: ${formatDignity(ketu, chart)}

D20 VIMSHAMSHA (Spiritual Progress):
  Lagna: ${chart.divisional.d20.ascendant}

LLM RULES FOR SPIRITUALITY:
  ✅ A strong Ketu or 12H indicates a soul nearing completion of its cycles.
  ✅ Relate the AK to the specific karmic lesson they are mastering.
`;
}

// ─── Module 10: Education & Learning ────────────────────────────────────────

export function computeEducationContext(chart: GoldenMasterJSON): string {
  const h4 = getHouse(chart, 4);
  const h5 = getHouse(chart, 5);
  const merc = getPlanet(chart, "Mercury");
  const jup = getPlanet(chart, "Jupiter");

  return `══════════════════════════════════════════════════════
COMPUTED EDUCATION ANALYSIS — PRE-CALCULATED.
══════════════════════════════════════════════════════

4TH HOUSE (Foundational Learning):
  Occupants: ${h4?.occupants.join(", ") || "None"} | ASV: ${getASVScore(chart, 4)}

5TH HOUSE (Intelligence & Higher Learning):
  Occupants: ${h5?.occupants.join(", ") || "None"} | ASV: ${getASVScore(chart, 5)}

KARAKAS (Mercury/Jupiter):
  Mercury (Intellect): Dignity ${formatDignity(merc, chart)}
  Jupiter (Wisdom): Dignity ${formatDignity(jup, chart)}

D24 CHATURVIMSHAMSHA (Education):
  Lagna: ${chart.divisional.d24.ascendant}
  Mercury in D24: House ${getDivisionalPlanet(chart.divisional.d24, "Mercury")?.house}

LLM RULES FOR EDUCATION:
  ✅ Strong D24 + Mercury indicates academic excellence.
  ✅ Dasha of 4th/5th lord triggers educational milestones.
`;
}

// ─── Module Router ────────────────────────────────────────────────────────────

export function buildPredictionContext(chart: GoldenMasterJSON, topic: JyotishTopic, message: string): string {
  const msg = message.toLowerCase();
  
  if (topic === "marriage") {
    if (msg.match(/cheat|affair|sex|fantasy|desire|secret|intimacy|kink/)) return computeSexualityContext(chart);
    return computeMarriageContext(chart);
  }
  if (topic === "career") return computeCareerContext(chart);
  if (topic === "wealth") return computeWealthContext(chart);
  if (topic === "children") return computeChildrenContext(chart);
  if (topic === "health") return computeHealthContext(chart);
  if (topic === "suffering" || msg.match(/misfortune|accident|tragedy/)) return computeMisfortuneContext(chart);
  if (topic === "paternal" || topic === "maternal" || msg.match(/pitru|dosh|ancestor|parent|curse/)) return computeAncestralContext(chart);
  if (topic === "spiritual" || topic === "soul") return computeSpiritualityContext(chart);
  if (topic === "education") return computeEducationContext(chart);

  // Fallback
  return `══════════════════════════════════════════════════════
COMPUTED ANALYSIS — PRE-CALCULATED.
══════════════════════════════════════════════════════
No specialized computation module triggered for this exact topic. Apply standard Parashari/Jaimini rules using the provided JSON data.`;
}
