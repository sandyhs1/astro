/**
 * COMPUTE EXTRAS — Pure computation, zero API calls.
 * Derives: All 12 Arudha Padas, Panchang, D60 Deva,
 *          Yogini Dasha, Char Dasha, Vimshopaka Bala, Graha Drishti.
 */
import type { GoldenMasterJSON } from "./normalize";

const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGN_LORD: Record<string,string> = {
  Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",
  Leo:"Sun",Virgo:"Mercury",Libra:"Venus",Scorpio:"Mars",
  Sagittarius:"Jupiter",Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter",
};
const EXALT_SIGN: Record<string,string> = {
  Sun:"Aries",Moon:"Taurus",Mars:"Capricorn",Mercury:"Virgo",
  Jupiter:"Cancer",Venus:"Pisces",Saturn:"Libra",Rahu:"Gemini",Ketu:"Sagittarius",
};
const DEBI_SIGN: Record<string,string> = {
  Sun:"Libra",Moon:"Scorpio",Mars:"Cancer",Mercury:"Pisces",
  Jupiter:"Capricorn",Venus:"Virgo",Saturn:"Aries",Rahu:"Sagittarius",Ketu:"Gemini",
};
const OWN_SIGNS: Record<string,string[]> = {
  Sun:["Leo"],Moon:["Cancer"],Mars:["Aries","Scorpio"],
  Mercury:["Gemini","Virgo"],Jupiter:["Sagittarius","Pisces"],
  Venus:["Taurus","Libra"],Saturn:["Capricorn","Aquarius"],
};
const FRIENDS: Record<string,string[]> = {
  Sun:["Moon","Mars","Jupiter"],Moon:["Sun","Mercury"],Mars:["Sun","Moon","Jupiter"],
  Mercury:["Sun","Venus"],Jupiter:["Sun","Moon","Mars"],Venus:["Mercury","Saturn"],
  Saturn:["Mercury","Venus"],Rahu:["Venus","Saturn","Mercury"],Ketu:["Mars","Jupiter","Venus"],
};

function signIdx(s: string): number { return SIGNS.findIndex(x => x.toLowerCase()===s?.toLowerCase()); }
function houseDistance(from: number, to: number): number { return ((to - from + 12) % 12) || 12; }

// ─── 1. All 12 Arudha Padas ──────────────────────────────────────────────────
const ARUDHA_NAMES: Record<number,string> = {
  1:"AL",2:"A2",3:"A3",4:"A4",5:"A5",6:"A6",
  7:"A7",8:"A8",9:"A9",10:"A10",11:"A11",12:"UL",
};

function computeArudha(houseSign: string, lordSign: string, lagnaSign: string): string {
  const hIdx = signIdx(houseSign), lIdx = signIdx(lordSign), lagIdx = signIdx(lagnaSign);
  if (hIdx===-1||lIdx===-1) return "";
  const dist = (lIdx - hIdx + 12) % 12;
  let aIdx = (lIdx + dist) % 12;
  if (aIdx===lagIdx || aIdx===(lagIdx+6)%12) aIdx=(aIdx+9)%12;
  return SIGNS[aIdx]??"";
}

export function computeAllArudhas(chart: GoldenMasterJSON): Record<string,{sign:string;house:number}> {
  const result: Record<string,{sign:string;house:number}> = {};
  const lagnaSign = chart.d1.ascendant;
  const lagnaIdx  = signIdx(lagnaSign);
  const fp = (n:string) => chart.d1.planets.find(p=>p.name.toLowerCase()===n.toLowerCase());

  for (let h=1; h<=12; h++) {
    const hEntry = chart.d1.houses.find(x=>x.number===h);
    if (!hEntry) continue;
    const lord = SIGN_LORD[hEntry.sign];
    if (!lord) continue;
    const lordPlanet = fp(lord);
    if (!lordPlanet) continue;
    const aSign = computeArudha(hEntry.sign, lordPlanet.sign, lagnaSign);
    const aIdx  = signIdx(aSign);
    const aHouse = aIdx>=0 ? ((aIdx - lagnaIdx + 12) % 12) + 1 : 0;
    result[ARUDHA_NAMES[h]] = { sign: aSign, house: aHouse };
  }
  return result;
}

// ─── 2. Panchang ─────────────────────────────────────────────────────────────
const TITHI_NAMES = [
  "Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami",
  "Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima/Amavasya",
];
const YOGA_NAMES = [
  "Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarman","Dhriti",
  "Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata",
  "Variyan","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti",
];
const KARANA_NAMES = ["Bava","Balava","Kaulava","Taitila","Garija","Vanija","Vishti"];
const VARA_LORDS = ["Sunday→Sun","Monday→Moon","Tuesday→Mars","Wednesday→Mercury","Thursday→Jupiter","Friday→Venus","Saturday→Saturn"];

export interface Panchang {
  tithi: number; tithiName: string; tithiPaksha: "Shukla"|"Krishna";
  vara: string; varaLord: string;
  yoga: number; yogaName: string;
  karana: string;
  nakshatra: string; nakshatraLord: string;
}

export function computePanchang(chart: GoldenMasterJSON, birthDow: number): Panchang {
  const sun  = chart.d1.planets.find(p=>p.name==="Sun");
  const moon = chart.d1.planets.find(p=>p.name==="Moon");

  // Tithi
  const moonSunDiff = sun && moon ? ((moon.fullDegree - sun.fullDegree + 360) % 360) : 0;
  const tithiNum    = Math.floor(moonSunDiff / 12) + 1; // 1–30
  const tithiMod    = ((tithiNum - 1) % 15) + 1;
  const tithiPaksha = tithiNum <= 15 ? "Shukla" : "Krishna";
  const tithiName   = TITHI_NAMES[tithiMod - 1] ?? "Unknown";

  // Vara (day of week)
  const varaEntry = VARA_LORDS[birthDow] ?? "Sunday→Sun";
  const [vara, varaLord] = varaEntry.split("→");

  // Yoga
  const yogaSum = sun && moon ? (moon.fullDegree + sun.fullDegree) % 360 : 0;
  const yogaNum = Math.floor(yogaSum / (360/27)) + 1;
  const yogaName = YOGA_NAMES[yogaNum - 1] ?? "Unknown";

  // Karana
  const karanaNum = Math.floor(moonSunDiff / 6) % 7;
  const karana    = KARANA_NAMES[karanaNum] ?? "Unknown";

  // Nakshatra (Moon)
  const NAK_LORDS = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
  const nakIdx = chart.d1.moonNakshatra
    ? ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha",
       "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
       "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha",
       "Purva Bhadrapada","Uttara Bhadrapada","Revati"]
      .findIndex(n=>n.toLowerCase()===chart.d1.moonNakshatra.toLowerCase())
    : -1;
  const nakshatraLord = nakIdx>=0 ? NAK_LORDS[nakIdx%9] : "";

  return { tithi:tithiNum, tithiName, tithiPaksha, vara:vara??"Sunday", varaLord:varaLord??"Sun",
           yoga:yogaNum, yogaName, karana, nakshatra:chart.d1.moonNakshatra, nakshatraLord };
}

// ─── 3. D60 Deva Classification ───────────────────────────────────────────────
const D60_DEVAS = [
  "Ghora","Rakshasa","Deva","Kubera","Yaksha","Kinnara","Bhrashta","Kulagna",
  "Garala","Vahni","Maya","Purishaka","Apampathi","Marut","Kala","Sarpa",
  "Amrita","Indu","Mridu","Komala","Heramba","Brahma","Vishnu","Maheshvara",
  "Deva","Ardra","Kalinasha","Kshitesha","Kamalakara","Gulika",
  "Mrityu","Kala","Davagni","Ghora","Yama","Kantaka","Sudha","Amrita",
  "Poorna Chandra","Vishabadha","Kulanasha","Vamshakshaya","Utpata","Kala",
  "Saumya","Komala","Sheetala","Karaladamshtra","Chandramukhi","Praveena",
  "Kalapavaka","Dandayudha","Nirmala","Saumya","Krura","Atisheetala",
  "Amrita","Payodhi","Brahma","Chandrarekha",
];
const D60_QUALITY: Record<string,"highly auspicious"|"auspicious"|"mixed"|"inauspicious"|"highly inauspicious"> = {
  Ghora:"inauspicious",Rakshasa:"highly inauspicious",Deva:"auspicious",Kubera:"auspicious",
  Yaksha:"mixed",Kinnara:"auspicious",Bhrashta:"inauspicious",Kulagna:"inauspicious",
  Garala:"inauspicious",Vahni:"mixed",Maya:"inauspicious",Purishaka:"inauspicious",
  Apampathi:"auspicious",Marut:"auspicious",Kala:"inauspicious",Sarpa:"inauspicious",
  Amrita:"highly auspicious",Indu:"auspicious",Mridu:"auspicious",Komala:"auspicious",
  Heramba:"mixed",Brahma:"highly auspicious",Vishnu:"highly auspicious",Maheshvara:"highly auspicious",
  Ardra:"mixed",Kalinasha:"inauspicious",Kshitesha:"auspicious",Kamalakara:"auspicious",
  Gulika:"inauspicious",Mrityu:"highly inauspicious",Davagni:"inauspicious",
  Yama:"inauspicious",Kantaka:"inauspicious",Sudha:"auspicious",
  "Poorna Chandra":"auspicious",Vishabadha:"inauspicious",Kulanasha:"inauspicious",
  Vamshakshaya:"inauspicious",Utpata:"inauspicious",Saumya:"auspicious",Sheetala:"auspicious",
  Karaladamshtra:"inauspicious",Chandramukhi:"auspicious",Praveena:"auspicious",
  Kalapavaka:"inauspicious",Dandayudha:"inauspicious",Nirmala:"auspicious",
  Krura:"inauspicious",Atisheetala:"auspicious",Payodhi:"auspicious",Chandrarekha:"auspicious",
};

export function computeD60Devas(chart: GoldenMasterJSON): Record<string,{deva:string;quality:string}> {
  const result: Record<string,{deva:string;quality:string}> = {};
  for (const p of chart.d1.planets) {
    const partIdx = Math.floor(p.normDegree * 2); // 0-59
    const deva    = D60_DEVAS[Math.min(partIdx, 59)] ?? "Unknown";
    result[p.name] = { deva, quality: D60_QUALITY[deva] ?? "mixed" };
  }
  return result;
}

// ─── 4. Yogini Dasha ─────────────────────────────────────────────────────────
const YOGINI_SEQUENCE = [
  { name:"Mangala", lord:"Moon",    years:1 },
  { name:"Pingala", lord:"Sun",     years:2 },
  { name:"Dhanya",  lord:"Jupiter", years:3 },
  { name:"Bhramari",lord:"Mars",    years:4 },
  { name:"Bhadrika",lord:"Mercury", years:5 },
  { name:"Ulka",    lord:"Saturn",  years:6 },
  { name:"Siddha",  lord:"Venus",   years:7 },
  { name:"Sankata", lord:"Rahu",    years:8 },
];
const NAKSHATRA_LIST = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha",
  "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha",
  "Purva Bhadrapada","Uttara Bhadrapada","Revati",
];

export interface YoginiPeriod { yogini:string; lord:string; start:string; end:string; years:number }

export function computeYoginiDasha(chart: GoldenMasterJSON, birthDate: Date): {
  current: YoginiPeriod; upcoming: YoginiPeriod[]; birthYogini: string;
} {
  const moonNak = chart.d1.moonNakshatra;
  const moonPlanet = chart.d1.planets.find(p=>p.name==="Moon");
  const nakIdx = NAKSHATRA_LIST.findIndex(n=>n.toLowerCase()===moonNak?.toLowerCase());
  if (nakIdx===-1||!moonPlanet) {
    return { current:{yogini:"Unknown",lord:"Unknown",start:"",end:"",years:0}, upcoming:[], birthYogini:"Unknown" };
  }

  const startYoginiIdx = nakIdx % 8;
  // Balance in starting Yogini based on nakshatra pada
  const pada = moonPlanet.nakshatraPada || 1;
  const elapsedFrac = (pada - 1) / 4; // fraction elapsed in the nakshatra
  const startYogini = YOGINI_SEQUENCE[startYoginiIdx];
  const elapsedYears = elapsedFrac * startYogini.years;
  const remainingYears = startYogini.years - elapsedYears;

  // Build full timeline
  const periods: YoginiPeriod[] = [];
  let cursor = new Date(birthDate.getTime() + elapsedYears * 365.25 * 24*3600*1000);
  // First period: partial
  periods.push({
    yogini: startYogini.name, lord: startYogini.lord, years: startYogini.years,
    start: birthDate.toISOString().slice(0,10),
    end: new Date(cursor.getTime() + remainingYears*365.25*24*3600*1000).toISOString().slice(0,10),
  });
  cursor = new Date(cursor.getTime() + remainingYears*365.25*24*3600*1000);

  for (let i=1; i<8; i++) {
    const y = YOGINI_SEQUENCE[(startYoginiIdx + i) % 8];
    const endDate = new Date(cursor.getTime() + y.years*365.25*24*3600*1000);
    periods.push({ yogini:y.name, lord:y.lord, years:y.years,
      start:cursor.toISOString().slice(0,10), end:endDate.toISOString().slice(0,10) });
    cursor = endDate;
  }

  const now = new Date();
  const currentIdx = periods.findIndex(p => new Date(p.start)<=now && new Date(p.end)>=now);
  const current = currentIdx>=0 ? periods[currentIdx] : periods[0];
  const upcoming = periods.slice(currentIdx+1, currentIdx+4);

  return { current, upcoming, birthYogini: startYogini.name };
}

// ─── 5. Char Dasha (Jaimini — simplified Rashi Dasha) ────────────────────────
export interface CharDashaPeriod { rashi: string; years: number; start: string; end: string }

export function computeCharDasha(chart: GoldenMasterJSON, birthDate: Date): {
  current: CharDashaPeriod; sequence: CharDashaPeriod[];
} {
  const lagnaSign  = chart.d1.ascendant;
  const lagnaIdx   = signIdx(lagnaSign);
  const fp = (n:string) => chart.d1.planets.find(p=>p.name.toLowerCase()===n.toLowerCase());

  // Char Dasha years for each sign = distance from sign to its lord
  // Odd signs: count forward; Even signs: count backward
  function charYears(rashi: string): number {
    const rIdx = signIdx(rashi);
    const lord = SIGN_LORD[rashi];
    const lordPlanet = fp(lord);
    if (!lordPlanet) return 1;
    const lordIdx = signIdx(lordPlanet.sign);
    const isOdd   = (rIdx % 2) === 0; // 0-indexed: Aries=0,Taurus=1... Aries is odd sign
    let dist: number;
    if (isOdd) {
      dist = (lordIdx - rIdx + 12) % 12;
    } else {
      dist = (rIdx - lordIdx + 12) % 12;
    }
    return dist === 0 ? 12 : dist;
  }

  // Build sequence starting from Lagna sign
  const sequence: CharDashaPeriod[] = [];
  let cursor = new Date(birthDate);
  for (let i=0; i<12; i++) {
    const rashi = SIGNS[(lagnaIdx + i) % 12];
    const years = charYears(rashi);
    const end   = new Date(cursor.getTime() + years*365.25*24*3600*1000);
    sequence.push({ rashi, years, start:cursor.toISOString().slice(0,10), end:end.toISOString().slice(0,10) });
    cursor = end;
  }

  const now = new Date();
  const currentIdx = sequence.findIndex(p => new Date(p.start)<=now && new Date(p.end)>=now);
  const current    = currentIdx>=0 ? sequence[currentIdx] : sequence[0];

  return { current, sequence };
}

// ─── 6. Vimshopaka Bala (Shodasavarga — 16 chart weighted strength) ──────────
// Weights per classical Shodasavarga system (total = 40 points max for full strength)
const VIMSHOPAKA_WEIGHTS: Record<string,number> = {
  d1:3.5, d2:1, d3:2, d4:1.5, d7:0.5, d9:3, d10:2.5,
  d12:1, d16:2, d20:1.5, d24:1.5, d27:0.5, d30:1, d40:0.5, d45:0.5, d60:4,
};
// Points: exalted/own=full, friendly=3/4, neutral=1/2, enemy=1/4, debilitated=0
function dignityPoints(planet: string, sign: string): number {
  if (EXALT_SIGN[planet]===sign) return 1;
  if ((OWN_SIGNS[planet]||[]).includes(sign)) return 1;
  const lord = SIGN_LORD[sign];
  if (!lord) return 0.5;
  if ((FRIENDS[planet]||[]).includes(lord)) return 0.75;
  if (DEBI_SIGN[planet]===sign) return 0;
  return 0.5;
}

export function computeVimshopakaBala(chart: GoldenMasterJSON): Record<string,{score:number;max:number;percent:number}> {
  const result: Record<string,{score:number;max:number;percent:number}> = {};
  const charts: Array<[string, {ascendant:string;planets:Array<{name:string;sign:string;house:number}>}]> = [
    ["d1",  { ascendant: chart.d1.ascendant, planets: chart.d1.planets.map(p=>({name:p.name,sign:p.sign,house:p.house})) }],
    ["d9",  chart.divisional.d9],
    ["d10", chart.divisional.d10],
  ];
  // Add other divisional charts if present
  const divAny = chart.divisional as any;
  for (const dn of ["d2","d3","d4","d7","d12","d16","d20","d24","d27","d30","d40","d45","d60"]) {
    if (divAny[dn]) charts.push([dn, divAny[dn]]);
  }

  for (const planet of chart.d1.planets) {
    let score = 0;
    let max   = 0;
    for (const [dn, dc] of charts) {
      const w    = VIMSHOPAKA_WEIGHTS[dn] ?? 0;
      max += w;
      const dp = dc.planets.find((p:any)=>p.name.toLowerCase()===planet.name.toLowerCase());
      if (dp?.sign) score += w * dignityPoints(planet.name, dp.sign);
    }
    result[planet.name] = { score: parseFloat(score.toFixed(2)), max: parseFloat(max.toFixed(2)), percent: max>0 ? Math.round(score/max*100) : 0 };
  }
  return result;
}

// ─── 7. Graha Drishti (Planetary Aspects) ────────────────────────────────────
export interface PlanetAspect { from:string; toHouse:number; strength:"full"|"3/4"|"1/2"|"1/4" }

export function computeGrahaDrishti(chart: GoldenMasterJSON): PlanetAspect[] {
  const aspects: PlanetAspect[] = [];
  for (const p of chart.d1.planets) {
    if (["Rahu","Ketu"].includes(p.name)) continue;
    // All planets aspect 7th house fully
    aspects.push({ from:p.name, toHouse:((p.house+6-1)%12)+1, strength:"full" });
    // Special aspects
    if (p.name==="Mars") {
      aspects.push({ from:"Mars", toHouse:((p.house+3-1)%12)+1, strength:"full" }); // 4th
      aspects.push({ from:"Mars", toHouse:((p.house+7-1)%12)+1, strength:"full" }); // 8th
    }
    if (p.name==="Jupiter") {
      aspects.push({ from:"Jupiter", toHouse:((p.house+4-1)%12)+1, strength:"full" }); // 5th
      aspects.push({ from:"Jupiter", toHouse:((p.house+8-1)%12)+1, strength:"full" }); // 9th
    }
    if (p.name==="Saturn") {
      aspects.push({ from:"Saturn", toHouse:((p.house+2-1)%12)+1, strength:"full" }); // 3rd
      aspects.push({ from:"Saturn", toHouse:((p.house+9-1)%12)+1, strength:"full" }); // 10th
    }
    if (p.name==="Rahu"||p.name==="Ketu") {
      // Rahu/Ketu aspect 5th and 9th from their position
      aspects.push({ from:p.name, toHouse:((p.house+4-1)%12)+1, strength:"full" });
      aspects.push({ from:p.name, toHouse:((p.house+8-1)%12)+1, strength:"full" });
    }
  }
  return aspects;
}

// ─── Master export ────────────────────────────────────────────────────────────
export interface ChartExtras {
  arudhas:        Record<string,{sign:string;house:number}>;
  panchang:       Panchang;
  d60Devas:       Record<string,{deva:string;quality:string}>;
  yoginiDasha:    { current:YoginiPeriod; upcoming:YoginiPeriod[]; birthYogini:string };
  charDasha:      { current:CharDashaPeriod; sequence:CharDashaPeriod[] };
  vimshopakaBala: Record<string,{score:number;max:number;percent:number}>;
  grahaDrishti:   PlanetAspect[];
  computedAt:     string;
}

export function computeExtras(chart: GoldenMasterJSON, birthDate: Date, birthDow: number): ChartExtras {
  return {
    arudhas:        computeAllArudhas(chart),
    panchang:       computePanchang(chart, birthDow),
    d60Devas:       computeD60Devas(chart),
    yoginiDasha:    computeYoginiDasha(chart, birthDate),
    charDasha:      computeCharDasha(chart, birthDate),
    vimshopakaBala: computeVimshopakaBala(chart),
    grahaDrishti:   computeGrahaDrishti(chart),
    computedAt:     new Date().toISOString(),
  };
}
