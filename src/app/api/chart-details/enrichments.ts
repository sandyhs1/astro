import type { GoldenMasterJSON } from "@/lib/astrology/manager";

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGN_LORD: Record<string,string> = {
  Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",
  Leo:"Sun",Virgo:"Mercury",Libra:"Venus",Scorpio:"Mars",
  Sagittarius:"Jupiter",Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter",
};
const OWN_SIGNS: Record<string,string[]> = {
  Sun:["Leo"],Moon:["Cancer"],Mars:["Aries","Scorpio"],
  Mercury:["Gemini","Virgo"],Jupiter:["Sagittarius","Pisces"],
  Venus:["Taurus","Libra"],Saturn:["Capricorn","Aquarius"],
};
const EXALT_SIGN: Record<string,string> = {
  Sun:"Aries",Moon:"Taurus",Mars:"Capricorn",Mercury:"Virgo",
  Jupiter:"Cancer",Venus:"Pisces",Saturn:"Libra",Rahu:"Gemini",Ketu:"Sagittarius",
};
const DEBI_SIGN: Record<string,string> = {
  Sun:"Libra",Moon:"Scorpio",Mars:"Cancer",Mercury:"Pisces",
  Jupiter:"Capricorn",Venus:"Virgo",Saturn:"Aries",Rahu:"Sagittarius",Ketu:"Gemini",
};
const MOOLATRIKONA: Record<string,{sign:string;from:number;to:number}> = {
  Sun:{sign:"Leo",from:0,to:20},Moon:{sign:"Taurus",from:4,to:30},
  Mars:{sign:"Aries",from:0,to:12},Mercury:{sign:"Virgo",from:16,to:20},
  Jupiter:{sign:"Sagittarius",from:0,to:10},Venus:{sign:"Libra",from:0,to:15},
  Saturn:{sign:"Aquarius",from:0,to:20},
};
const FRIENDS: Record<string,string[]> = {
  Sun:["Moon","Mars","Jupiter"],Moon:["Sun","Mercury"],Mars:["Sun","Moon","Jupiter"],
  Mercury:["Sun","Venus"],Jupiter:["Sun","Moon","Mars"],Venus:["Mercury","Saturn"],
  Saturn:["Mercury","Venus"],Rahu:["Venus","Saturn","Mercury"],Ketu:["Mars","Jupiter","Venus"],
};
const ENEMIES: Record<string,string[]> = {
  Sun:["Venus","Saturn"],Moon:[],Mars:["Mercury"],Mercury:["Moon"],
  Jupiter:["Mercury","Venus"],Venus:["Sun","Moon"],Saturn:["Sun","Moon","Mars"],
  Rahu:["Sun","Moon","Mars"],Ketu:["Sun","Moon","Saturn"],
};

// ─── Nakshatra Data ───────────────────────────────────────────────────────────
export const NAKSHATRA_DATA: Record<string,{
  ruler:string; deity:string; symbol:string;
  gana:"Deva"|"Manushya"|"Rakshasa"; quality:string; nature:string;
}> = {
  "Ashwini":           {ruler:"Ketu",    deity:"Ashwini Kumaras",   symbol:"Horse's head",                    gana:"Deva",     quality:"Laghu (Light/Swift)",       nature:"Swift initiation, healing, new beginnings, pioneering spirit"},
  "Bharani":           {ruler:"Venus",   deity:"Yama",              symbol:"Yoni (womb)",                     gana:"Manushya", quality:"Ugra (Fierce)",             nature:"Transformation, bearing burdens, endurance, responsibility"},
  "Krittika":          {ruler:"Sun",     deity:"Agni",              symbol:"Flame / Razor",                   gana:"Rakshasa", quality:"Mishra (Mixed)",            nature:"Purification, sharp discrimination, fierce courage"},
  "Rohini":            {ruler:"Moon",    deity:"Brahma / Prajapati",symbol:"Chariot / Ox and cart",           gana:"Manushya", quality:"Sthira (Fixed)",            nature:"Growth, fertility, beauty, sensuality, material abundance"},
  "Mrigashira":        {ruler:"Mars",    deity:"Soma",              symbol:"Deer's head",                     gana:"Deva",     quality:"Mridu (Soft/Gentle)",       nature:"Seeking, gentle curiosity, creativity, a restless searching mind"},
  "Ardra":             {ruler:"Rahu",    deity:"Rudra",             symbol:"Teardrop / Diamond",              gana:"Manushya", quality:"Tikshna (Sharp/Dreadful)",  nature:"Storms, destruction leading to renewal, intellectual intensity"},
  "Punarvasu":         {ruler:"Jupiter", deity:"Aditi",             symbol:"Quiver of arrows / Bow",          gana:"Deva",     quality:"Chara (Movable)",           nature:"Return, renewal, infinite abundance, restoration after hardship"},
  "Pushya":            {ruler:"Saturn",  deity:"Brihaspati",        symbol:"Flower / Circle / Cow's udder",   gana:"Deva",     quality:"Laghu (Light/Swift)",       nature:"Nourishment, spiritual wisdom, protection, the most auspicious nakshatra"},
  "Ashlesha":          {ruler:"Mercury", deity:"Sarpa (Nagas)",     symbol:"Coiled serpent",                  gana:"Rakshasa", quality:"Tikshna (Sharp/Dreadful)",  nature:"Kundalini energy, mysticism, penetrating intelligence, occult power"},
  "Magha":             {ruler:"Ketu",    deity:"Pitrs (Ancestors)", symbol:"Royal throne / Palanquin",        gana:"Rakshasa", quality:"Ugra (Fierce)",             nature:"Regal authority, ancestral karma, royalty, connection to lineage"},
  "Purva Phalguni":    {ruler:"Venus",   deity:"Bhaga",             symbol:"Front legs of bed / Hammock",     gana:"Manushya", quality:"Ugra (Fierce)",             nature:"Pleasure, creativity, love, rest, artistic expression, generosity"},
  "Uttara Phalguni":   {ruler:"Sun",     deity:"Aryaman",           symbol:"Back legs of bed / Fig tree",     gana:"Manushya", quality:"Sthira (Fixed)",            nature:"Social responsibility, patronage, contracts, lasting unions"},
  "Hasta":             {ruler:"Moon",    deity:"Savitar",           symbol:"Hand / Fist",                     gana:"Deva",     quality:"Laghu (Light/Swift)",       nature:"Skill, craftsmanship, healing hands, practicality, manifestation"},
  "Chitra":            {ruler:"Mars",    deity:"Tvashtar / Vishwakarma",symbol:"Bright jewel / Pearl",         gana:"Rakshasa", quality:"Mridu (Soft/Gentle)",       nature:"Creativity, architecture, art, brilliance, the architect's mind"},
  "Swati":             {ruler:"Rahu",    deity:"Vayu",              symbol:"Young sprout / Coral",            gana:"Deva",     quality:"Chara (Movable)",           nature:"Independence, flexibility, diplomacy, trade, adaptability like wind"},
  "Vishakha":          {ruler:"Jupiter", deity:"Indra-Agni",        symbol:"Triumphal arch / Potter's wheel", gana:"Rakshasa", quality:"Mishra (Mixed)",            nature:"Ambition, focused purpose, achievement through perseverance"},
  "Anuradha":          {ruler:"Saturn",  deity:"Mitra",             symbol:"Lotus / Umbrella",                gana:"Deva",     quality:"Mridu (Soft/Gentle)",       nature:"Deep friendship, devotion, emotional bonds, spiritual discipline"},
  "Jyeshtha":          {ruler:"Mercury", deity:"Indra",             symbol:"Circular amulet / Umbrella",      gana:"Rakshasa", quality:"Tikshna (Sharp/Dreadful)",  nature:"Seniority, authority, protective power, eldest-born themes"},
  "Mula":              {ruler:"Ketu",    deity:"Nirrti",            symbol:"Bunch of roots / Lion's tail",    gana:"Rakshasa", quality:"Tikshna (Sharp/Dreadful)",  nature:"Root-level transformation, destruction of illusion, liberation"},
  "Purva Ashadha":     {ruler:"Venus",   deity:"Apas (Water gods)", symbol:"Elephant tusk / Fan",             gana:"Manushya", quality:"Ugra (Fierce)",             nature:"Early invincibility, purification, bold declaration of victory"},
  "Uttara Ashadha":    {ruler:"Sun",     deity:"Vishvadevas",       symbol:"Elephant tusk / Small bed",       gana:"Manushya", quality:"Sthira (Fixed)",            nature:"Final victory, universal principles, lasting achievement"},
  "Shravana":          {ruler:"Moon",    deity:"Vishnu",            symbol:"Ear / Three footprints",          gana:"Deva",     quality:"Chara (Movable)",           nature:"Learning through listening, cosmic order, Vishnu's blessings"},
  "Dhanishtha":        {ruler:"Mars",    deity:"Ashta Vasus",       symbol:"Drum / Flute",                    gana:"Rakshasa", quality:"Chara (Movable)",           nature:"Wealth, music, rhythm, group energy, prosperity"},
  "Shatabhisha":       {ruler:"Rahu",    deity:"Varuna",            symbol:"Empty circle / Thousand stars",   gana:"Rakshasa", quality:"Chara (Movable)",           nature:"Healing, mysticism, cosmic law, secrets, the hundred physicians"},
  "Purva Bhadrapada":  {ruler:"Jupiter", deity:"Aja Ekapada",       symbol:"Sword / Front legs of funeral cot",gana:"Manushya",quality:"Ugra (Fierce)",             nature:"Transformation through fire, spiritual ardor, passionate intensity"},
  "Uttara Bhadrapada": {ruler:"Saturn",  deity:"Ahir Budhanya",     symbol:"Twins / Back legs of funeral cot",gana:"Deva",     quality:"Sthira (Fixed)",            nature:"Depth, wisdom, cosmic serpent energy, path to moksha"},
  "Revati":            {ruler:"Mercury", deity:"Pushan",            symbol:"Fish / Drum",                     gana:"Deva",     quality:"Mridu (Soft/Gentle)",       nature:"Completion, protection on journeys, nourishment, the final nakshatra"},
};

// ─── Retrograde meanings ──────────────────────────────────────────────────────
const RETROGRADE_MEANING: Record<string,string> = {
  Sun:    "Sun retrograde is exceedingly rare and marks a soul profoundly reworking its relationship with identity, authority, and the father archetype. You carry past-life wounds around leadership and recognition. This lifetime demands building genuine, internally-sourced authority — not one that seeks external validation.",
  Moon:   "Moon retrograde deepens emotional introspection and magnifies past-life karmic patterns around nurturing and belonging. Your emotional processing is intensely internal — feelings are felt in full depth before being expressed. A powerful indicator of psychic sensitivity and deep emotional healing capacity.",
  Mars:   "Mars retrograde channels drive and aggression inward rather than outward. You possess extraordinary strategic patience and the capacity to absorb pressure that others cannot. Past-life warrior karma is being recalibrated — action must arise from wisdom, not impulse. Your power accumulates silently.",
  Mercury:"Mercury retrograde produces a deeply reflective, non-linear mind. You think in spirals rather than straight lines — processing information through layers of intuition and past-life knowledge. Classical scholars and occultists frequently carry this placement. Your insights arrive from within, not from convention.",
  Jupiter:"Jupiter retrograde carries profound accumulated spiritual wisdom from past incarnations. Traditional beliefs are not accepted without deep personal verification — your spiritual path is intensely internal and may transcend conventional religion. When your inner wisdom crystallizes, it becomes unshakable.",
  Venus:  "Venus retrograde creates an extraordinarily deep relationship with beauty, love, and values — refined through repeated testing. You carry past-life longing and unresolved relationship karma. Superficial connections do not satisfy; you seek soul-level union. Your aesthetic sensibility eventually surpasses conventional taste.",
  Saturn: "Saturn retrograde means discipline and karma are entirely self-directed. External authority has limited power over you — your deepest lessons emerge from within. Past-life themes of restriction and responsibility are being re-examined. This placement produces sovereign individuals who ultimately self-govern at the highest level.",
  Rahu:   "Rahu is always retrograde by astronomical convention. Its obsessive, evolutionary drive toward the destined future is a permanent force — intensifying the themes of the house and sign Rahu occupies throughout your life.",
  Ketu:   "Ketu is always retrograde by astronomical convention. Its spiritual detachment and past-life mastery operate continuously — the dissolution and liberation Ketu represents is an ever-present undercurrent in your consciousness.",
};

// ─── Rahu-Ketu axis meanings ──────────────────────────────────────────────────
const RAHU_DESTINY: Record<number,string> = {
  1: "Self-mastery, pioneering a new identity, and asserting your unique presence in the world. You are destined to build a powerful, self-defined sense of self.",
  2: "Accumulating wealth, mastering speech, and building family legacy. Financial independence and the authoritative use of words are your karmic destination.",
  3: "Bold communication, courage, media, and entrepreneurial ventures. Your voice and initiative are the vehicles of your destiny.",
  4: "Deep roots, homeland, real estate, emotional security, and nurturing others. Building an unshakeable home and emotional foundation is your calling.",
  5: "Creative genius, inspired leadership, children, speculation, and romance. You are destined to express extraordinary creative and intellectual brilliance.",
  6: "Mastery of service, health, competition, and overcoming adversaries. Discipline, healing, and victory over opposition are your karmic mandate.",
  7: "Partnership, marriage, public engagement, and mastery of 'the other.' Your evolution comes through deep, transformative relationships and public dealings.",
  8: "Hidden knowledge, occult research, transformation, and inheritance. You are destined to plunge into the depths of the hidden and emerge transformed.",
  9: "Higher wisdom, dharma, philosophy, and gurus. Truth-seeking beyond convention and spiritual law are your destined path.",
  10:"Career mastery, public authority, and building a lasting professional legacy. You are destined for significant public recognition and leadership.",
  11:"Network power, large-scale gains, humanitarian causes, and influential connections. Cultivating abundant resources and social influence is your karma.",
  12:"Spiritual liberation, foreign connections, meditation, and surrender to the mystical. The path of moksha and transcendence is your ultimate destination.",
};
const KETU_MASTERED: Record<number,string> = {
  1: "Strong personal identity, self-reliance, and independence were deeply developed across past lives. The self was the primary reference point.",
  2: "Material security, wealth accumulation, and family tradition were the central focus of past incarnations. The soul is highly skilled in these areas.",
  3: "Communication, courage, short journeys, and initiative were mastered in past lives. Words and bold action came naturally.",
  4: "Domestic stability, emotional security, land, and mother were deeply experienced. The soul is deeply familiar with comfort and rootedness.",
  5: "Creative expression, romance, children, and speculation were the focus. Intelligence and creative risk-taking are deeply ingrained.",
  6: "Service, health, competition, and overcoming obstacles were the domain. A warrior and healer mentality is already embedded in the soul.",
  7: "Partnerships, marriage, and public dealings were extensively experienced. The soul carries great expertise in relating and negotiation.",
  8: "Hidden knowledge, transformation, and crisis management were mastered. The soul is deeply comfortable with the unseen and the taboo.",
  9: "Higher philosophy, religion, teachers, and dharma were lived. Conventional spiritual paths feel familiar — but are now being transcended.",
  10:"Career success, authority, and public recognition were achieved. The soul carries the weight of past achievements and must now release attachment to status.",
  11:"Social networks, mass influence, and financial gains were the domain. The soul is expert in group dynamics and large-scale abundance.",
  12:"Spiritual practices, foreign lands, isolation, and liberation were the path. The soul has tasted transcendence and now must engage with the world.",
};

// ─── Dignity scoring ──────────────────────────────────────────────────────────
function getDignityScore(name: string, sign: string, normDeg: number): {score:number; label:string} {
  if (EXALT_SIGN[name]===sign)                          return {score:6, label:"Exalted"};
  if (DEBI_SIGN[name]===sign)                           return {score:0, label:"Debilitated"};
  const mt = MOOLATRIKONA[name];
  if (mt && mt.sign===sign && normDeg>=mt.from && normDeg<=mt.to) return {score:5, label:"Moolatrikona"};
  if ((OWN_SIGNS[name]||[]).includes(sign))             return {score:4, label:"Own Sign"};
  const lord = SIGN_LORD[sign];
  if ((FRIENDS[name]||[]).includes(lord))               return {score:3, label:"Friendly Sign"};
  if ((ENEMIES[name]||[]).includes(lord))               return {score:1, label:"Enemy Sign"};
  return {score:2, label:"Neutral Sign"};
}

// ─── TOB parser (HH:MM or H:MM AM/PM) ────────────────────────────────────────
function tobToHours(tob: string): number {
  const clean = tob.trim().toUpperCase();
  const isPM = clean.includes("PM"), isAM = clean.includes("AM");
  const [hStr, mStr] = clean.replace(/AM|PM/g,"").trim().split(":");
  let h = parseInt(hStr)||0; const m = parseInt(mStr)||0;
  if (isPM && h!==12) h+=12;
  if (isAM && h===12) h=0;
  return h + m/60;
}

// ─── Hora Lagna ───────────────────────────────────────────────────────────────
// Formula (Parashari / JHora standard):
// HL = (Sun's sidereal longitude + hours_from_sunrise × 30°) mod 360°
// Sunrise approximated at 06:00 local time for standard IST births.
// For non-IST timezones the tz offset is factored into birth hour conversion.
function computeHoraLagna(chart: GoldenMasterJSON, tob: string): {
  sign: string; house: number; lord: string; meaning: string;
} {
  const sun = chart.d1.planets.find(p=>p.name==="Sun");
  if (!sun) return {sign:"", house:0, lord:"", meaning:""};

  const SUNRISE = 6.0; // approximate local sunrise (standard IST)
  const tobH = tobToHours(tob);
  const elapsed = tobH - SUNRISE; // hours elapsed since sunrise
  const hlFull = ((sun.fullDegree + elapsed * 30) % 360 + 360) % 360;
  const hlSignIdx = Math.floor(hlFull / 30);
  const hlSign = SIGNS[hlSignIdx] ?? "";
  const lord = SIGN_LORD[hlSign] ?? "";

  // House of HL from lagna
  const lagnaIdx = SIGNS.findIndex(s=>s.toLowerCase()===chart.d1.ascendant.toLowerCase());
  const house = lagnaIdx>=0 ? ((hlSignIdx - lagnaIdx + 12)%12)+1 : 0;

  const HORA_HOUSE_MEANING: Record<number,string> = {
    1:"Hora Lagna in the 1st house — wealth and well-being arise through self-effort, personal initiative, and the strength of your own character.",
    2:"Hora Lagna in the 2nd house — financial abundance comes through family lineage, accumulated savings, speech, and traditional resources.",
    3:"Hora Lagna in the 3rd house — wealth is earned through courageous self-effort, communication, media, siblings, and entrepreneurial action.",
    4:"Hora Lagna in the 4th house — prosperity is rooted in real estate, mother's support, homeland, and deep emotional stability.",
    5:"Hora Lagna in the 5th house — wealth arrives through speculation, creative intelligence, children, investments, and inspired leadership.",
    6:"Hora Lagna in the 6th house — financial gains come through service, competition, overcoming debts, and disciplined hard work.",
    7:"Hora Lagna in the 7th house — prosperity flows through partnerships, business alliances, trade, and the spouse.",
    8:"Hora Lagna in the 8th house — wealth arrives through inheritance, hidden resources, transformation, research, and sudden windfalls.",
    9:"Hora Lagna in the 9th house — abundance comes through dharma, higher education, teaching, fortune, and the blessings of gurus.",
    10:"Hora Lagna in the 10th house — wealth flows through career authority, public recognition, government, and professional mastery.",
    11:"Hora Lagna in the 11th house — great gains through networks, large organizations, elder siblings, and fulfillment of desires.",
    12:"Hora Lagna in the 12th house — wealth arrives through foreign connections, spiritual merit, hidden reserves, and expenditure on luxury.",
  };

  return {
    sign: hlSign,
    house,
    lord,
    meaning: HORA_HOUSE_MEANING[house] ?? "",
  };
}

// ─── Main enrichment function ─────────────────────────────────────────────────
export function computeEnrichments(chart: GoldenMasterJSON, tob: string) {
  const { d1, divisional } = chart;
  const planets = d1.planets;
  const fp = (n: string) => planets.find(p=>p.name.toLowerCase()===n.toLowerCase());

  // 1. Vargottama planets (same sign in D1 and D9)
  const vargottama = planets
    .map(p => {
      const d9p = divisional.d9.planets.find(d=>d.name===p.name);
      return d9p && d9p.sign===p.sign ? {
        name: p.name,
        sign: p.sign,
        house: p.house,
        meaning: `${p.name} occupies ${p.sign} in both the D1 (Rashi) and D9 (Navamsha) charts. A Vargottama planet carries double the power of its sign — its qualities, significations, and natural energy are reinforced at the soul level. The D9 confirms and amplifies what D1 promises. This is a mark of exceptional strength.`,
      } : null;
    })
    .filter(Boolean);

  // 2. Rahu-Ketu axis
  const rahu = fp("Rahu"), ketu = fp("Ketu");
  const rahuKetuAxis = rahu && ketu ? {
    rahuHouse:    rahu.house,
    rahuSign:     rahu.sign,
    ketuHouse:    ketu.house,
    ketuSign:     ketu.sign,
    rahuDestiny:  RAHU_DESTINY[rahu.house] ?? "",
    ketuMastered: KETU_MASTERED[ketu.house] ?? "",
  } : null;

  // 3. Moon nakshatra deep-dive
  const moonNak = d1.moonNakshatra;
  const moonNakData = moonNak ? NAKSHATRA_DATA[moonNak] ?? null : null;

  // 4. Planet strengths ranking
  const planetStrengths = planets.map(p => {
    const dignity = getDignityScore(p.name, p.sign, p.normDegree);
    // Modifier: combust -1, retrograde has complex meaning (not simply weak)
    const effectiveScore = Math.max(0, dignity.score - (p.isCombust ? 1 : 0));
    return {
      name:    p.name,
      sign:    p.sign,
      house:   p.house,
      score:   effectiveScore,
      label:   dignity.label,
      isCombust: p.isCombust,
      isRetro:   p.isRetro,
    };
  }).sort((a,b)=>b.score-a.score);

  // 5. Retrograde planets with interpretations
  const retrogrades = planets
    .filter(p => p.isRetro)
    .map(p => ({
      name:    p.name,
      sign:    p.sign,
      house:   p.house,
      meaning: RETROGRADE_MEANING[p.name] ?? "",
    }));

  // 6. Hora Lagna
  const horaLagna = computeHoraLagna(chart, tob);

  return { vargottama, rahuKetuAxis, moonNakData, moonNakName: moonNak, planetStrengths, retrogrades, horaLagna };
}
