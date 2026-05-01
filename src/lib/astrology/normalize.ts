/**
 * ASTROLOGY ENGINE — LAYER 3: NORMALIZER
 *
 * Converts raw AstrologyAPI.com bundle → GoldenMasterJSON.
 *
 * SCHEMA VERSION 2:
 *   - All 16 Shodashavargas (D1–D60) parsed and stored
 *   - specialPoints: all 12 Arudha Padas + Pranapada + Hora Lagna
 *   - extras: Panchang, D60 Devas, Yogini/Char Dasha, Vimshopaka Bala
 *   - schemaVersion field for cache invalidation
 *
 * House system: Whole Sign.
 * D9: Self-computed using Mean Nodes (Rahu/Ketu) — matches JHora/AstroSage.
 * D2–D60 API responses: parsed via parseHoroChartArray().
 */

import type { RawAstroBundle } from "./batch-fetch";
import type { BirthParams } from "./client";
import { computeExtras, type ChartExtras } from "./compute-extras";
import crypto from "crypto";

export const SCHEMA_VERSION = 2;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlanetData {
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: boolean;
  sign: string;
  signNum: number;
  house: number;
  nakshatra: string;
  nakshatraPada: number;
  isExalted: boolean;
  isDebilitated: boolean;
  isCombust: boolean;
}

export interface HouseData {
  number: number;
  sign: string;
  signNum: number;
  occupants: string[];
}

export interface DivisionalChart {
  ascendant: string;
  planets: Array<{ name: string; sign: string; house: number }>;
}

export interface GoldenMasterJSON {
  schemaVersion: number;
  meta: {
    source: "astrologyapi.com";
    birthHash: string;
    generatedAt: string;
    apiErrors: Record<string, string>;
  };
  birth: {
    dob: string; tob: string; pob: string;
    lat: number; lon: number; tzone: number;
  };
  d1: {
    ascendant: string; ascendantDegree: number;
    moonSign: string; moonNakshatra: string; sunSign: string;
    planets: PlanetData[];
    houses: HouseData[];
  };
  divisional: {
    d2:  DivisionalChart;
    d3:  DivisionalChart;
    d4:  DivisionalChart;
    d7:  DivisionalChart;
    d9:  DivisionalChart;   // self-computed (Mean Nodes)
    d10: DivisionalChart;
    d12: DivisionalChart;
    d16: DivisionalChart;
    d20: DivisionalChart;
    d24: DivisionalChart;
    d27: DivisionalChart;
    d30: DivisionalChart;
    d40: DivisionalChart;
    d45: DivisionalChart;
    d60: DivisionalChart;
  };
  dasha: {
    mahadasha: string; mahadashaEnd: string;
    antardasha: string; antardashaEnd: string;
    pratyantar: string;
    full: any;
  };
  karakas: {
    ak: string; amk: string; bk: string; mk: string; pk: string; gk: string; dk: string;
  };
  specialPoints: {
    AL: string;  A2: string;  A3: string;  A4: string;
    A5: string;  A6: string;  A7: string;  A8: string;
    A9: string;  A10: string; A11: string; UL: string;
    PP: string;  HL: string;
    // house numbers
    AL_house: number;  A7_house: number; UL_house: number;
  };
  ashtakavarga: any;
  extras: ChartExtras;
  confidence: { score: number; warnings: string[] };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];
const SIGN_LORD: Record<string,string> = {
  Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",
  Leo:"Sun",Virgo:"Mercury",Libra:"Venus",Scorpio:"Mars",
  Sagittarius:"Jupiter",Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter",
};

function signNum(name: string): number {
  const idx = SIGNS.findIndex(s => s.toLowerCase() === name?.toLowerCase());
  return idx === -1 ? 0 : idx + 1;
}

function wholeSignHouse(planetSignNum: number, lagnaSignNum: number): number {
  return ((planetSignNum - lagnaSignNum + 12) % 12) + 1;
}

export function buildBirthHash(p: BirthParams): string {
  const key = `${p.day}-${p.month}-${p.year}-${p.hour}-${p.min}-${p.lat.toFixed(4)}-${p.lon.toFixed(4)}-${p.tzone}`;
  return crypto.createHash("sha256").update(key).digest("hex").slice(0, 16);
}

// ─── Mean Node Calculation (IAU 1980 + Lahiri) ────────────────────────────────
function meanRahuSidereal(year:number,month:number,day:number,hour:number,min:number): number {
  const a   = Math.floor((14-month)/12);
  const y   = year+4800-a;
  const m   = month+12*a-3;
  const jdn = day+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;
  const jd  = jdn+(hour-12+min/60)/24;
  const T   = (jd-2451545.0)/36525.0;
  const rahuTropical = ((125.04452-1934.136261*T+0.0020708*T*T)%360+360)%360;
  const lahiriAyanamsa = 23.85+(T*100*50.29)/3600;
  return ((rahuTropical-lahiriAyanamsa)%360+360)%360;
}

function d9SignIdx(fullDegree: number): number {
  return Math.floor((fullDegree*9)/30)%12;
}

// ─── Parse horo_chart API array → DivisionalChart ────────────────────────────
function parseHoroChartArray(raw: any): DivisionalChart {
  const empty: DivisionalChart = { ascendant: "", planets: [] };
  if (!Array.isArray(raw) || raw.length === 0) return empty;
  const asc = raw[0]?.sign_name ?? "";
  const planets: Array<{name:string;sign:string;house:number}> = [];
  for (let i = 0; i < raw.length; i++) {
    const houseNum = i + 1;
    for (const pName of (raw[i]?.planet ?? [])) {
      const fmt = pName.charAt(0).toUpperCase() + pName.slice(1).toLowerCase();
      if (fmt.toLowerCase() !== "ascendant") {
        planets.push({ name: fmt, sign: raw[i]?.sign_name ?? "", house: houseNum });
      }
    }
  }
  return { ascendant: asc, planets };
}

// ─── Special Points helpers ───────────────────────────────────────────────────
function computeArudhaSign(houseSign:string, lordSign:string, lagnaSign:string): string {
  const hIdx=SIGNS.findIndex(s=>s.toLowerCase()===houseSign?.toLowerCase());
  const lIdx=SIGNS.findIndex(s=>s.toLowerCase()===lordSign?.toLowerCase());
  const lagIdx=SIGNS.findIndex(s=>s.toLowerCase()===lagnaSign?.toLowerCase());
  if(hIdx===-1||lIdx===-1) return "";
  const dist=(lIdx-hIdx+12)%12;
  let aIdx=(lIdx+dist)%12;
  if(aIdx===lagIdx||aIdx===(lagIdx+6)%12) aIdx=(aIdx+9)%12;
  return SIGNS[aIdx]??"";
}

// ─── Dasha Parsing ────────────────────────────────────────────────────────────
function parseAstroDate(s: string): Date {
  if (!s) return new Date(NaN);
  const clean=s.trim().replace(/\s+/g," ");
  const parts=clean.split(" ");
  const [d,m,y]=parts[0].split("-").map(Number);
  const [hr,mn]=(parts[1]||"0:00").split(":").map(Number);
  if(!d||!m||!y) return new Date(NaN);
  return new Date(y,m-1,d,hr||0,mn||0,0);
}

// ─── Main Normalizer ──────────────────────────────────────────────────────────
export function normalizeBundle(
  bundle: RawAstroBundle,
  params: BirthParams,
  pob: string,
  dobStr: string,
  tobStr: string,
): GoldenMasterJSON {
  const warnings: string[] = [];
  const astro = bundle.astroDetails || {};

  // ── Ascendant ──────────────────────────────────────────────────────────────
  const ascendant: string = astro.ascendant ?? astro.Ascendant ?? "";
  const moonSign: string  = astro.sign ?? astro.moon_sign ?? astro.Moon_sign ?? "";
  const moonNak: string   = astro.Naksahtra ?? astro.nakshatra ?? astro.moon_nakshatra ?? "";
  const sunSign: string   = astro.sun_sign ?? astro.Sun_sign ?? "";
  if (!ascendant) warnings.push("CRITICAL: Ascendant missing");
  const lagnaSignNum = signNum(ascendant);

  // ── Planets ────────────────────────────────────────────────────────────────
  const rawPlanets: any[] = Array.isArray(bundle.planets) ? bundle.planets : [];
  const rawExt: any[]     = Array.isArray(bundle.planetsExtended) ? bundle.planetsExtended : [];
  const extMap: Record<string,any> = {};
  for (const e of rawExt) { const n=e.name??e.planet_name??""; if(n) extMap[n.toLowerCase()]=e; }

  const PLANET_ORDER=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const planets: PlanetData[] = [];

  for (const rp of rawPlanets) {
    const name: string      = rp.name ?? rp.planet_name ?? "";
    if (!name) { warnings.push("Planet with missing name skipped"); continue; }
    if (name.toLowerCase()==="ascendant") continue;
    const fullDeg: number   = parseFloat(rp.fullDegree ?? rp.full_degree ?? "0");
    const normDeg: number   = parseFloat(rp.normDegree ?? rp.norm_degree ?? rp.degree ?? "0");
    const speed: number     = parseFloat(rp.speed ?? "0");
    const isRetro: boolean  = rp.isRetro==="true"||rp.isRetro===true||speed<0;
    const pSign: string     = rp.sign ?? "";
    const pSignId: number   = parseInt(rp.sign_id ?? rp.signId ?? String(signNum(pSign)), 10);
    const house: number     = parseInt(rp.house ?? "0", 10) || (lagnaSignNum ? wholeSignHouse(pSignId, lagnaSignNum) : 0);
    const nak: string       = rp.nakshatra ?? rp.nakshatraName ?? "";
    const pada: number      = parseInt(rp.nakshatra_pad ?? rp.nakshatra_pada ?? rp.nakshatraPada ?? rp.Charan ?? "1", 10);
    const ext                     = extMap[name.toLowerCase()] || {};
    const isExalted: boolean      = !!(ext.isExalted ?? ext.is_exalted);
    const isDebilitated: boolean  = !!(ext.isDebilitated ?? ext.is_debilitated);
    const isCombust: boolean      = !!(ext.isCombust ?? ext.is_combust);
    if (!pSign) warnings.push(`${name}: missing sign`);
    planets.push({ name, fullDegree:fullDeg, normDegree:normDeg, speed, isRetro,
      sign:pSign, signNum:pSignId, house, nakshatra:nak, nakshatraPada:pada,
      isExalted, isDebilitated, isCombust });
  }
  for (const expected of PLANET_ORDER) {
    if (!planets.find(p=>p.name.toLowerCase()===expected.toLowerCase()))
      warnings.push(`CRITICAL: Planet missing: ${expected}`);
  }

  // ── Houses (D1 Whole Sign) ─────────────────────────────────────────────────
  const houses: HouseData[] = [];
  if (Array.isArray(bundle.horoChartD1) && bundle.horoChartD1.length===12) {
    for (let i=0;i<12;i++) {
      const hEntry = bundle.horoChartD1[i];
      const hSign  = hEntry.sign_name ?? SIGNS[(lagnaSignNum-1+i)%12] ?? "";
      const occ    = (hEntry.planet??[]).filter((pn:string)=>pn.toLowerCase()!=="ascendant")
        .map((pn:string)=>pn.charAt(0).toUpperCase()+pn.slice(1).toLowerCase());
      houses.push({ number:i+1, sign:hSign, signNum:((lagnaSignNum-1+i)%12)+1, occupants:occ });
    }
  } else {
    for (let i=1;i<=12;i++) {
      const hSign = SIGNS[(lagnaSignNum-1+i-1)%12]??"";
      houses.push({ number:i, sign:hSign, signNum:((lagnaSignNum-1+i-1)%12)+1,
        occupants:planets.filter(p=>p.house===i).map(p=>p.name) });
    }
  }

  // ── D9 (self-computed, Mean Nodes) ────────────────────────────────────────
  const mRahu    = meanRahuSidereal(params.year,params.month,params.day,params.hour,params.min);
  const mKetu    = (mRahu+180)%360;
  const ascRaw   = rawPlanets.find((rp:any)=>(rp.name??"").toLowerCase()==="ascendant");
  const ascFull  = ascRaw ? parseFloat(ascRaw.fullDegree??ascRaw.full_degree??"0") : (lagnaSignNum-1)*30;
  const d9LagnaIdx  = d9SignIdx(ascFull);
  const d9LagnaSign = SIGNS[d9LagnaIdx]??"";
  const d9Planets = planets.map((p:PlanetData) => {
    const fullDeg = p.name==="Rahu" ? mRahu : p.name==="Ketu" ? mKetu : p.fullDegree;
    const sIdx    = d9SignIdx(fullDeg);
    return { name:p.name, sign:SIGNS[sIdx]??"", house:((sIdx-d9LagnaIdx+12)%12)+1 };
  });
  const d9: DivisionalChart = { ascendant:d9LagnaSign, planets:d9Planets };

  // ── Parse all API-sourced divisional charts ────────────────────────────────
  const d10 = parseHoroChartArray(bundle.horoChartD10);
  const d2  = parseHoroChartArray(bundle.horoChartD2);
  const d3  = parseHoroChartArray(bundle.horoChartD3);
  const d4  = parseHoroChartArray(bundle.horoChartD4);
  const d7  = parseHoroChartArray(bundle.horoChartD7);
  const d12 = parseHoroChartArray(bundle.horoChartD12);
  const d16 = parseHoroChartArray(bundle.horoChartD16);
  const d20 = parseHoroChartArray(bundle.horoChartD20);
  const d24 = parseHoroChartArray(bundle.horoChartD24);
  const d27 = parseHoroChartArray(bundle.horoChartD27);
  const d30 = parseHoroChartArray(bundle.horoChartD30);
  const d40 = parseHoroChartArray(bundle.horoChartD40);
  const d45 = parseHoroChartArray(bundle.horoChartD45);
  const d60 = parseHoroChartArray(bundle.horoChartD60);

  // Log which charts came back empty
  const divisionalBundleMap: Record<string,any> = { d2:bundle.horoChartD2,d3:bundle.horoChartD3,d4:bundle.horoChartD4,d7:bundle.horoChartD7,d12:bundle.horoChartD12,d16:bundle.horoChartD16,d20:bundle.horoChartD20,d24:bundle.horoChartD24,d27:bundle.horoChartD27,d30:bundle.horoChartD30,d40:bundle.horoChartD40,d45:bundle.horoChartD45,d60:bundle.horoChartD60 };
  for (const [dn, raw] of Object.entries(divisionalBundleMap)) {
    if (!Array.isArray(raw) || raw.length === 0) warnings.push(`${dn.toUpperCase()}: empty or failed`);
  }

  // ── Dasha ─────────────────────────────────────────────────────────────────
  const cd = bundle.currentDasha || {};
  const md = bundle.majorDasha   || {};
  const now = new Date();
  let mahadasha="",mahadashaEnd="",antardasha="",antardashaEnd="",pratyantar="";
  const majorPeriods:any[] = (Array.isArray(md)?md:null)??cd.major?.dasha_period??[];
  if (majorPeriods.length>0) {
    const activeIdx=majorPeriods.findIndex((p:any)=>{
      const s=parseAstroDate(p.start||""),e=parseAstroDate(p.end||"");
      return !isNaN(s.getTime())&&!isNaN(e.getTime())&&now>=s&&now<=e;
    });
    const ap=activeIdx>=0?majorPeriods[activeIdx]:null;
    const np=activeIdx>=0?majorPeriods[activeIdx+1]:null;
    if(ap){ mahadasha=ap.planet||ap.name||""; mahadashaEnd=ap.end||""; }
    else { const f=majorPeriods.find((p:any)=>parseAstroDate(p.end||"")>now); if(f){mahadasha=f.planet||"";mahadashaEnd=f.end||"";} }
    (cd as any)._nextMahadasha=np?.planet||"";
    (cd as any)._nextMahadashaStart=np?.start||"";
    (cd as any)._nextMahadashaEnd=np?.end||"";
  }
  if(cd.minor?.dasha_period){
    const ap=cd.minor.dasha_period.find((p:any)=>{const s=parseAstroDate(p.start||""),e=parseAstroDate(p.end||"");return!isNaN(s.getTime())&&!isNaN(e.getTime())&&now>=s&&now<=e;});
    if(ap){antardasha=ap.planet||"";antardashaEnd=ap.end||"";}
  }
  if(cd.sub_minor?.dasha_period){
    const ap=cd.sub_minor.dasha_period.find((p:any)=>{const s=parseAstroDate(p.start||""),e=parseAstroDate(p.end||"");return!isNaN(s.getTime())&&!isNaN(e.getTime())&&now>=s&&now<=e;});
    if(ap) pratyantar=ap.planet||"";
  }
  if(!mahadasha) warnings.push("CRITICAL: Mahadasha could not be determined");

  // ── Karakas (Jaimini — 7 planets by normDegree desc) ──────────────────────
  const KARAKA_PLANETS=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
  const KARAKA_LABELS=["ak","amk","bk","mk","pk","gk","dk"] as const;
  const karakaRanked=planets.filter(p=>KARAKA_PLANETS.includes(p.name)).sort((a,b)=>b.normDegree-a.normDegree);
  const karakas:any={};
  KARAKA_LABELS.forEach((label,i)=>{ karakas[label]=karakaRanked[i]?.name??""; });

  // ── Special Points (all 12 Arudhas + Pranapada + Hora Lagna) ──────────────
  const fp=(n:string)=>planets.find(p=>p.name.toLowerCase()===n.toLowerCase());
  function arudhaSign(hNum:number): string {
    const h=houses.find(x=>x.number===hNum); if(!h) return "";
    const lord=SIGN_LORD[h.sign]; if(!lord) return "";
    const lp=fp(lord); if(!lp) return "";
    return computeArudhaSign(h.sign,lp.sign,ascendant);
  }
  function arudhaHouse(sign:string): number {
    const idx=SIGNS.findIndex(s=>s.toLowerCase()===sign.toLowerCase());
    return idx>=0?((idx-lagnaSignNum+1+12)%12)+1:0;
  }

  const AL=arudhaSign(1);   const A2=arudhaSign(2);  const A3=arudhaSign(3);
  const A4=arudhaSign(4);   const A5=arudhaSign(5);  const A6=arudhaSign(6);
  const A7=arudhaSign(7);   const A8=arudhaSign(8);  const A9=arudhaSign(9);
  const A10=arudhaSign(10); const A11=arudhaSign(11);const UL=arudhaSign(12);

  // Pranapada: (Sun × 3) mod 360 → sign
  const sunP=fp("Sun");
  const PP=sunP?SIGNS[Math.floor(((sunP.fullDegree*3)%360)/30)]??"":"";

  // Hora Lagna: Sun degree + hours_from_sunrise × 30°
  const SUNRISE=6.0;
  let tobH=0;
  if(tobStr){
    const clean=tobStr.trim().toUpperCase();
    const isPM=clean.includes("PM"),isAM=clean.includes("AM");
    const[hStr,mStr]=clean.replace(/AM|PM/g,"").trim().split(":");
    let h=parseInt(hStr)||0;const mn=parseInt(mStr)||0;
    if(isPM&&h!==12)h+=12; if(isAM&&h===12)h=0;
    tobH=h+mn/60;
  }
  const hlFull=((sunP?.fullDegree??0)+(tobH-SUNRISE)*30+360*99)%360;
  const HL=SIGNS[Math.floor(hlFull/30)]??"";

  const specialPoints = {
    AL, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, UL, PP, HL,
    AL_house: arudhaHouse(AL), A7_house: arudhaHouse(A7), UL_house: arudhaHouse(UL),
  };

  // ── Build partial chart for extras computation ─────────────────────────────
  // We need GoldenMasterJSON shape but extras needs it — build it first, then add extras
  const partialChart = {
    schemaVersion: SCHEMA_VERSION,
    meta:{ source:"astrologyapi.com" as const, birthHash:buildBirthHash(params), generatedAt:new Date().toISOString(), apiErrors:bundle.errors },
    birth:{ dob:dobStr, tob:tobStr, pob, lat:params.lat, lon:params.lon, tzone:params.tzone },
    d1:{ ascendant, ascendantDegree:0, moonSign, moonNakshatra:moonNak, sunSign, planets, houses },
    divisional:{ d2,d3,d4,d7,d9,d10,d12,d16,d20,d24,d27,d30,d40,d45,d60 },
    dasha:{ mahadasha, mahadashaEnd, antardasha, antardashaEnd, pratyantar,
      full:{ currentDasha:cd, majorDasha:md, allPeriods:majorPeriods } },
    karakas,
    specialPoints,
    ashtakavarga: bundle.sarvashtak ?? {},
    confidence:{ score:0, warnings },
  };

  // Parse birth date for extras
  let birthDate = new Date();
  let birthDow  = birthDate.getDay();
  try {
    const dp=dobStr.includes("/")?dobStr.split("/"):dobStr.split("-").reverse();
    birthDate=new Date(parseInt(dp[2]),parseInt(dp[1])-1,parseInt(dp[0]));
    birthDow=birthDate.getDay();
  } catch{ /* use today fallback */ }

  const extras = computeExtras(partialChart as GoldenMasterJSON, birthDate, birthDow);

  // ── Confidence ─────────────────────────────────────────────────────────────
  const errorCount=Object.keys(bundle.errors).length+warnings.length;
  const score=Math.max(0,Math.round(100-errorCount*4));

  return {
    ...partialChart,
    extras,
    confidence:{ score, warnings },
  } as GoldenMasterJSON;
}
