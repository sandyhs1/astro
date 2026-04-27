/**
 * GET /api/chart-details?profileId=self|<uuid>
 *
 * Returns GoldenMasterJSON + computed yogas, special points, karakas
 * for the requested profile. Uses cached chart — 0 credits deducted.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getOrBuildChart, type GoldenMasterJSON } from "@/lib/astrology/manager";

// ─── Lookup tables ─────────────────────────────────────────────────────────────
const SIGN_LORD: Record<string, string> = {
  Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",
  Leo:"Sun",Virgo:"Mercury",Libra:"Venus",Scorpio:"Mars",
  Sagittarius:"Jupiter",Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter",
};
const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const OWN_SIGNS: Record<string,string[]> = {
  Sun:["Leo"],Moon:["Cancer"],Mars:["Aries","Scorpio"],
  Mercury:["Gemini","Virgo"],Jupiter:["Sagittarius","Pisces"],
  Venus:["Taurus","Libra"],Saturn:["Capricorn","Aquarius"],
};
const EXALT_SIGN: Record<string,string> = {
  Sun:"Aries",Moon:"Taurus",Mars:"Capricorn",Mercury:"Virgo",
  Jupiter:"Cancer",Venus:"Pisces",Saturn:"Libra",
  Rahu:"Gemini",Ketu:"Sagittarius",
};
const DEBI_SIGN: Record<string,string> = {
  Sun:"Libra",Moon:"Scorpio",Mars:"Cancer",Mercury:"Pisces",
  Jupiter:"Capricorn",Venus:"Virgo",Saturn:"Aries",
  Rahu:"Sagittarius",Ketu:"Gemini",
};
const NAKSHATRA_LIST = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha",
  "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha",
  "Purva Bhadrapada","Uttara Bhadrapada","Revati",
];

function signIdx(s: string) { return SIGNS.findIndex(sg=>sg.toLowerCase()===s?.toLowerCase()); }

function computeArudha(houseSign: string, lordSign: string, lagnaSign: string): string {
  const hIdx=signIdx(houseSign), lordIdx=signIdx(lordSign), lagnaIdx=signIdx(lagnaSign);
  if(hIdx===-1||lordIdx===-1) return "";
  const dist=(lordIdx-hIdx+12)%12;
  let aIdx=(lordIdx+dist)%12;
  if(aIdx===lagnaIdx||aIdx===(lagnaIdx+6)%12) aIdx=(aIdx+9)%12;
  return SIGNS[aIdx]??"";
}

function computePranapada(sunFullDegree: number): string {
  return SIGNS[Math.floor(((sunFullDegree*3)%360)/30)]??"";
}

function getNakshatraFromDegree(fullDegree: number): { nakshatra: string; pada: number } {
  const idx = Math.floor((fullDegree % 360) / (360/27));
  const pada = Math.floor(((fullDegree % 360) % (360/27)) / (360/108)) + 1;
  return { nakshatra: NAKSHATRA_LIST[idx] ?? "", pada };
}

// ─── Yoga Engine ───────────────────────────────────────────────────────────────
export interface YogaResult {
  name: string;
  fullName: string;
  category: string;
  status: "ACTIVATED" | "DORMANT";
  planets: string[];
  houses: number[];
  logic: string;
  benefit: string;
}

function computeYogas(chart: GoldenMasterJSON): YogaResult[] {
  const { d1, dasha } = chart;
  const { planets, houses } = d1;
  const yogas: YogaResult[] = [];

  const fp = (name: string) => planets.find(p=>p.name.toLowerCase()===name.toLowerCase());
  const isKendra   = (h: number) => [1,4,7,10].includes(h);
  const isTrikona  = (h: number) => [1,5,9].includes(h);
  const isDusthana = (h: number) => [6,8,12].includes(h);

  const dashaActive = [dasha.mahadasha, dasha.antardasha, dasha.pratyantar].filter(Boolean).map(s=>s.toLowerCase());
  const inDasha = (name: string) => dashaActive.includes(name.toLowerCase());

  const houseLord = (h: number) => SIGN_LORD[houses.find(x=>x.number===h)?.sign ?? ""] ?? "";

  // 1. Pancha Mahapurusha Yogas
  const pmConfigs = [
    { planet:"Mars",    yoga:"Ruchaka",  benefit:"Exceptional courage, military/executive leadership, physical dominance" },
    { planet:"Mercury", yoga:"Bhadra",   benefit:"Razor-sharp intellect, communication mastery, business brilliance" },
    { planet:"Jupiter", yoga:"Hamsa",    benefit:"Wisdom, spirituality, social fortune, societal respect" },
    { planet:"Venus",   yoga:"Malavya",  benefit:"Luxury, beauty, artistic success, romantic abundance, material comfort" },
    { planet:"Saturn",  yoga:"Sasa",     benefit:"Iron discipline, authority over masses, political power, longevity" },
  ];

  for (const { planet, yoga, benefit } of pmConfigs) {
    const p = fp(planet); if (!p) continue;
    const inOwn  = (OWN_SIGNS[planet]??[]).includes(p.sign);
    const inExalt = EXALT_SIGN[planet] === p.sign;
    if (!(inOwn || inExalt) || !isKendra(p.house)) continue;
    const active = !p.isCombust && p.sign !== DEBI_SIGN[planet];
    yogas.push({
      name: yoga,
      fullName: `${yoga} Yoga — Pancha Mahapurusha`,
      category: "Pancha Mahapurusha",
      status: active ? "ACTIVATED" : "DORMANT",
      planets: [planet],
      houses: [p.house],
      logic: `${planet} is in ${p.sign} (${inExalt?"exaltation":"own sign"}) in House ${p.house}, which is a kendra (angular house — 1,4,7,10). ${p.isCombust?"⚠️ Combust: Sun's proximity burns this planet's energy, weakening the yoga despite its formation.":"Planet is not combust — yoga stands at full strength."} ${inDasha(planet)?`✅ Currently in ${planet} Mahadasha/Antardasha — yoga is actively delivering results now.`:`Results will intensify during ${planet} Mahadasha/Antardasha.`}`,
      benefit,
    });
  }

  // 2. Gaja Kesari Yoga
  const moon = fp("Moon"); const jupiter = fp("Jupiter");
  if (moon && jupiter) {
    const diff = ((jupiter.house - moon.house + 12) % 12) + 1;
    if ([1,4,7,10].includes(diff)) {
      const active = !jupiter.isCombust && jupiter.sign !== DEBI_SIGN["Jupiter"];
      yogas.push({
        name: "Gaja Kesari",
        fullName: "Gaja Kesari Yoga — Elephant-Lion Union",
        category: "Lunar Yoga",
        status: active ? "ACTIVATED" : "DORMANT",
        planets: ["Jupiter","Moon"],
        houses: [moon.house, jupiter.house],
        logic: `Jupiter is in House ${jupiter.house}, which is the ${diff}th house from Moon in House ${moon.house} — a kendra position from the Moon. ${jupiter.isCombust?"⚠️ Jupiter is combust — severely weakens this yoga.":"Jupiter is not combust."} ${jupiter.sign===DEBI_SIGN["Jupiter"]?"⚠️ Jupiter is debilitated in Capricorn — yoga exists but is greatly weakened.":""} ${(inDasha("Jupiter")||inDasha("Moon"))?"✅ Currently in Moon/Jupiter dasha — actively delivering results.":"Results peak during Jupiter or Moon Mahadasha."}`,
        benefit: "Fame, wisdom, prosperity, social prestige. The elephant's power meets the lion's royalty — produces natural leaders and respected intellectuals.",
      });
    }
  }

  // 3. Budha-Aditya Yoga
  const sun = fp("Sun"); const merc = fp("Mercury");
  if (sun && merc && sun.house === merc.house) {
    const deg = Math.abs(sun.fullDegree - merc.fullDegree);
    const diff = Math.min(deg, 360 - deg);
    const active = diff > 6;
    yogas.push({
      name: "Budha-Aditya",
      fullName: "Budha-Aditya Yoga — Mercury-Sun Fusion",
      category: "Solar Yoga",
      status: active ? "ACTIVATED" : "DORMANT",
      planets: ["Sun","Mercury"],
      houses: [sun.house],
      logic: `Sun and Mercury are conjunct in House ${sun.house} (${sun.sign}). Mercury is ${diff.toFixed(1)}° from Sun. ${diff<6?"⚠️ Mercury is deeply combust (<6°) — intelligence is 'burnt' by solar heat. Yoga forms but delivers very weakly.":diff<14?"Mercury is mildly combust but the yoga is operational.":"Mercury is beyond combustion range — yoga is fully active."} ${(inDasha("Sun")||inDasha("Mercury"))?"✅ In Sun/Mercury dasha — actively manifesting.":"Manifests strongly during Sun or Mercury dasha."}`,
      benefit: "Leadership through intellect, sharp communication fused with solar authority, government connections, writing and oratory brilliance.",
    });
  }

  // 4. Chandra-Mangal Yoga
  const mars = fp("Mars");
  if (moon && mars && moon.house === mars.house) {
    yogas.push({
      name: "Chandra-Mangal",
      fullName: "Chandra-Mangal Yoga — Moon-Mars Alliance",
      category: "Lunar Yoga",
      status: !mars.isCombust ? "ACTIVATED" : "DORMANT",
      planets: ["Moon","Mars"],
      houses: [moon.house],
      logic: `Moon (mind) and Mars (action) are conjunct in House ${moon.house} (${moon.sign}). ${mars.isRetro?"Mars is retrograde — intensifies energy inward; creates fierce internal ambition.":""} ${mars.isCombust?"⚠️ Mars is combust — yoga weakened.":""} ${(inDasha("Moon")||inDasha("Mars"))?"✅ In Moon/Mars dasha — delivering wealth and ambition now.":"Results surface during Moon or Mars Mahadasha."}`,
      benefit: "Relentless financial drive, real estate gains, entrepreneurial success. The emotional force of the Moon combines with the aggressive drive of Mars to create unstoppable material ambition.",
    });
  }

  // 5. Neecha Bhanga Raja Yoga
  const NBRY_planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
  for (const pName of NBRY_planets) {
    const p = fp(pName);
    if (!p || p.sign !== DEBI_SIGN[pName]) continue;
    const disp = SIGN_LORD[p.sign];
    const dispP = fp(disp);
    const exaltHere = Object.entries(EXALT_SIGN).find(([,s])=>s===p.sign)?.[0];
    const exaltP = exaltHere ? fp(exaltHere) : null;
    const moonH = moon?.house ?? 0;
    const c1 = dispP && isKendra(dispP.house);
    const c2 = exaltP && isKendra(exaltP.house);
    const c1m = dispP && moonH>0 && [1,4,7,10].includes(((dispP.house-moonH+12)%12)+1);
    const c2m = exaltP && moonH>0 && [1,4,7,10].includes(((exaltP.house-moonH+12)%12)+1);
    if (!c1&&!c2&&!c1m&&!c2m) continue;
    const reasons: string[] = [];
    if(c1)  reasons.push(`${disp} (dispositor) is in kendra H${dispP!.house} from Lagna`);
    if(c1m) reasons.push(`${disp} is in kendra from Moon`);
    if(c2)  reasons.push(`${exaltHere} (exalted in this sign) is in kendra H${exaltP!.house} from Lagna`);
    if(c2m) reasons.push(`${exaltHere} is in kendra from Moon`);
    yogas.push({
      name: "Neecha Bhanga Raja",
      fullName: `Neecha Bhanga Raja Yoga — ${pName}'s Debilitation Cancelled`,
      category: "Raja Yoga",
      status: inDasha(pName) ? "ACTIVATED" : "DORMANT",
      planets: [pName, disp],
      houses: [p.house],
      logic: `${pName} is debilitated in ${DEBI_SIGN[pName]} (House ${p.house}). However, debilitation is CANCELLED because: ${reasons.join("; ")}. Classical law: when debilitation is cancelled (Neecha Bhanga), the planet paradoxically over-compensates — it becomes stronger than a planet in its own sign. ${inDasha(pName)?`✅ Currently in ${pName} dasha — the extraordinary reversal is manifesting NOW.`:`The dramatic reversal peaks during ${pName} Mahadasha.`}`,
      benefit: "Dramatic rise after initial struggles. Extraordinary success in the planet's significations. The native overcomes severe setbacks and achieves above-average results in areas ruled by the debilitated planet.",
    });
  }

  // 6. Parivartana Yoga (mutual sign exchange)
  const grahas = planets.filter(p=>!["Rahu","Ketu"].includes(p.name));
  for (let i=0;i<grahas.length;i++) {
    for (let j=i+1;j<grahas.length;j++) {
      const p1=grahas[i], p2=grahas[j];
      const p1inP2 = (OWN_SIGNS[p2.name]??[]).includes(p1.sign);
      const p2inP1 = (OWN_SIGNS[p1.name]??[]).includes(p2.sign);
      if (!p1inP2||!p2inP1) continue;
      const dusthana = isDusthana(p1.house)||isDusthana(p2.house);
      const type = dusthana ? "Dainya Parivartana" : "Maha Parivartana";
      yogas.push({
        name: "Parivartana",
        fullName: `${type} Yoga — ${p1.name} ↔ ${p2.name}`,
        category: "Exchange Yoga",
        status: (!dusthana && !p1.isCombust && !p2.isCombust) ? "ACTIVATED" : "DORMANT",
        planets: [p1.name, p2.name],
        houses: [p1.house, p2.house],
        logic: `${p1.name} is in ${p1.sign} (ruled by ${p2.name}) and ${p2.name} is in ${p2.sign} (ruled by ${p1.name}) — a mutual sign exchange called Parivartana. ${dusthana?`⚠️ Classified as DAINYA (inauspicious) because one or both planets occupy a dusthana house (6/8/12 — H${p1.house} and H${p2.house}). This brings karmic entanglements and complex fate in the matters of these houses.`:`Both planets are in favorable houses — this is MAHA Parivartana, one of the most powerful yogas. H${p1.house} and H${p2.house} become permanently interlinked.`} ${(inDasha(p1.name)||inDasha(p2.name))?"✅ In dasha of one exchange planet — actively delivering results.":"Peak manifestation during either planet's Mahadasha."}`,
        benefit: dusthana
          ? `Complex karma: initial hardships in H${p1.house} and H${p2.house} matters, followed by unexpected reversals and breakthroughs.`
          : `Extraordinary combined results from H${p1.house} and H${p2.house}. These two life areas permanently amplify each other.`,
      });
    }
  }

  // 7. Raja Yogas — kendra lord + trikona lord conjunction
  const seen = new Set<string>();
  for (const kh of [1,4,7,10]) {
    for (const th of [1,5,9]) {
      if (kh===th) continue;
      const kl = houseLord(kh), tl = houseLord(th);
      if (!kl||!tl||kl===tl) continue;
      const key = [kl,tl].sort().join("+");
      if (seen.has(key)) continue;
      const kp = fp(kl), tp = fp(tl);
      if (!kp||!tp||kp.house!==tp.house) continue;
      seen.add(key);
      const active = !kp.isCombust && !tp.isCombust;
      yogas.push({
        name: "Raja Yoga",
        fullName: `Raja Yoga — ${kl} (L${kh}) + ${tl} (L${th}) Conjunction`,
        category: "Raja Yoga",
        status: active ? "ACTIVATED" : "DORMANT",
        planets: [kl,tl],
        houses: [kp.house],
        logic: `${kl} lords House ${kh} (a kendra — angular house of power) and ${tl} lords House ${th} (a trikona — trinal house of fortune). Both planets are conjunct in House ${kp.house}. Classical Parashari law: union of a kendra lord and trikona lord = Raja Yoga. Kendra provides materialization power; trikona provides divine fortune. ${!active?"⚠️ One or both planets are combust — reduces the yoga's potency.":"Neither planet is combust — yoga is at full strength."} ${(inDasha(kl)||inDasha(tl))?"✅ In dasha of a participating planet — raja yoga is actively manifesting. Expect career elevation, authority, and recognition NOW.":"Peak results during dasha of either planet."}`,
        benefit: "Power, authority, status elevation. Career peaks, leadership recognition, above-average rise in professional life. The stronger the yoga planets, the more dramatic and public the success.",
      });
    }
  }

  // 8. Viparita Raja Yoga — dusthana lord in another dusthana
  for (const dh of [6,8,12]) {
    const lord = houseLord(dh);
    if (!lord) continue;
    const p = fp(lord);
    if (!p) continue;
    const otherDusthanas = [6,8,12].filter(x=>x!==dh);
    if (!otherDusthanas.includes(p.house) && p.house !== dh) continue;
    yogas.push({
      name: "Viparita Raja",
      fullName: `Viparita Raja Yoga — Lord of H${dh} in Dusthana`,
      category: "Raja Yoga",
      status: inDasha(lord) ? "ACTIVATED" : "DORMANT",
      planets: [lord],
      houses: [dh, p.house],
      logic: `${lord}, the lord of House ${dh} (a dusthana — house of difficulties), is placed in House ${p.house} (also a dusthana). Classical principle: when the lord of a bad house goes to another bad house, the two evils cancel each other out — producing unexpected good results in life through apparent setbacks. Enemies destroy each other; obstacles become stepping stones. ${inDasha(lord)?`✅ In ${lord} dasha — the paradoxical Raja Yoga is actively operating. What appears as difficulty is transmuting into power.`:`Results manifest powerfully during ${lord} Mahadasha.`}`,
      benefit: "Sudden elevation through apparent reversals. The native experiences difficulties that paradoxically destroy their obstacles — enemies fail, competitions are overcome, crises become catalysts for rise.",
    });
  }

  return yogas;
}

// ─── Derived data helpers ──────────────────────────────────────────────────────
function getSpecialPoints(chart: GoldenMasterJSON) {
  const { d1 } = chart;
  const fp = (n: string) => d1.planets.find(p=>p.name.toLowerCase()===n.toLowerCase());
  const h = (n: number) => d1.houses.find(x=>x.number===n);

  const lagnaH = h(1); const h7 = h(7); const h12 = h(12);
  let AL="", UL="", A7="";
  if (lagnaH) { const lp=fp(SIGN_LORD[lagnaH.sign]??"")||null; if(lp) AL=computeArudha(lagnaH.sign,lp.sign,d1.ascendant); }
  if (h7)    { const lp=fp(SIGN_LORD[h7.sign]??"")||null;    if(lp) A7=computeArudha(h7.sign,lp.sign,d1.ascendant); }
  if (h12)   { const lp=fp(SIGN_LORD[h12.sign]??"")||null;   if(lp) UL=computeArudha(h12.sign,lp.sign,d1.ascendant); }
  const sunP = fp("Sun");
  const PP = sunP ? computePranapada(sunP.fullDegree) : "";
  return { AL, UL, A7, PP };
}

function getAscLordData(chart: GoldenMasterJSON) {
  const lord = SIGN_LORD[chart.d1.ascendant] ?? "";
  const p = chart.d1.planets.find(x=>x.name===lord);
  return { lord, sign: p?.sign??"", house: p?.house??0 };
}

function formatDate(raw: string): string {
  if (!raw) return "—";
  const clean = raw.trim().replace(/\s+/g," ");
  const [datePart] = clean.split(" ");
  const [d,m,y] = datePart.split("-");
  if (!d||!m||!y) return raw;
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[parseInt(m)-1]} ${y}`;
}

function dashaRemaining(endRaw: string): string {
  if (!endRaw) return "";
  const [datePart] = endRaw.trim().split(" ");
  const [d,m,y] = datePart.split("-").map(Number);
  if (!d||!m||!y) return "";
  const end = new Date(y,m-1,d);
  const now = new Date();
  if (end<now) return "Completed";
  const diffMs = end.getTime()-now.getTime();
  const days = Math.floor(diffMs/86400000);
  const years = Math.floor(days/365);
  const months = Math.floor((days%365)/30);
  return years>0 ? `${years}y ${months}m remaining` : `${months}m remaining`;
}

// ─── Route Handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(n:string){return cookieStore.get(n)?.value;} } }
    );
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error:"Unauthorized" },{status:401});

    const profileId = req.nextUrl.searchParams.get("profileId") ?? "self";

    let dob="", tob="", pob="", tz="+05:30", fullName="", dob_display="", tob_display="";

    if (!profileId || profileId==="self") {
      // ── Self profile: try family_profiles (relationship=Self) first ───────────
      // Dashboard modal saves to family_profiles; onboarding_leads is legacy fallback.
      const { data: selfFp } = await supabase
        .from("family_profiles")
        .select("*")
        .eq("user_id", user.id)
        .eq("relationship", "Self")
        .maybeSingle();

      if (selfFp?.dob && selfFp?.tob && selfFp?.pob) {
        dob=selfFp.dob; tob=selfFp.tob; pob=selfFp.pob;
        tz=selfFp.timezone||"+05:30";
        fullName=selfFp.name||user.email?.split("@")[0]||"User";
        dob_display=selfFp.dob; tob_display=selfFp.tob;
      } else {
        // Fallback: legacy onboarding_leads table
        const { data: lead } = await supabase
          .from("onboarding_leads").select("*").eq("email", user.email).maybeSingle();
        if (!lead?.dob||!lead?.tob||!lead?.pob)
          return NextResponse.json({ error:"Profile not found. Please complete your profile from the dashboard first." },{status:404});
        dob=lead.dob; tob=lead.tob; pob=lead.pob;
        tz=lead.timezone||"+05:30";
        fullName=lead.name||user.email?.split("@")[0]||"User";
        dob_display=lead.dob; tob_display=lead.tob;
      }
    } else {
      const { data: fp } = await supabase
        .from("family_profiles").select("*").eq("id",profileId).maybeSingle();
      if (!fp?.dob||!fp?.tob||!fp?.pob)
        return NextResponse.json({ error:"Family profile not found." },{status:404});
      dob=fp.dob; tob=fp.tob; pob=fp.pob;
      tz=fp.timezone||"+05:30";
      fullName=fp.name||"Family Member";
      dob_display=fp.dob; tob_display=fp.tob;
    }

    // Uses Supabase cache — no API call if chart exists
    const { chart, fromCache } = await getOrBuildChart(dob,tob,pob,tz,undefined,undefined,user.email);

    const yogas = computeYogas(chart);
    const specialPoints = getSpecialPoints(chart);
    const ascLord = getAscLordData(chart);

    // Ascendant nakshatra (from ascendant full degree via Moon planet position proxy)
    const moonP = chart.d1.planets.find(p=>p.name==="Moon");
    const ascNak = chart.d1.planets.find(p=>(p as any).name==="Ascendant");
    const ascNakData = ascNak
      ? getNakshatraFromDegree((ascNak as any).fullDegree)
      : { nakshatra:"", pada:0 };

    // Dasha formatting
    const { dasha } = chart;
    const nextMD   = (dasha.full as any)?.currentDasha?._nextMahadasha ?? "";
    const nextMDSt = (dasha.full as any)?.currentDasha?._nextMahadashaStart ?? "";
    const nextMDEn = (dasha.full as any)?.currentDasha?._nextMahadashaEnd ?? "";

    return NextResponse.json({
      fromCache,
      person: {
        fullName,
        dob: dob_display,
        tob: tob_display,
        pob,
        timezone: tz,
      },
      core: {
        ascendant: chart.d1.ascendant,
        ascendantNakshatra: ascNakData.nakshatra || moonP?.nakshatra || "",
        ascendantNakshatraPada: ascNakData.pada || 0,
        moonSign: chart.d1.moonSign,
        moonNakshatra: chart.d1.moonNakshatra,
        moonNakshatraPada: moonP?.nakshatraPada ?? 0,
        sunSign: chart.d1.sunSign,
        ascLord: ascLord.lord,
        ascLordSign: ascLord.sign,
        ascLordHouse: ascLord.house,
      },
      dasha: {
        mahadasha:      dasha.mahadasha,
        mahadashaEnd:   formatDate(dasha.mahadashaEnd),
        mahadashaRemaining: dashaRemaining(dasha.mahadashaEnd),
        antardasha:     dasha.antardasha,
        antardashaEnd:  formatDate(dasha.antardashaEnd),
        antardashaRemaining: dashaRemaining(dasha.antardashaEnd),
        pratyantar:     dasha.pratyantar || "—",
        nextMahadasha:  nextMD,
        nextMahadashaStart: formatDate(nextMDSt),
        nextMahadashaEnd:   formatDate(nextMDEn),
      },
      planets: chart.d1.planets,
      houses:  chart.d1.houses,
      d9: chart.divisional.d9,
      d10: chart.divisional.d10,
      karakas: chart.karakas,
      specialPoints,
      yogas,
      ashtakavarga: chart.ashtakavarga,
    });

  } catch (err: any) {
    console.error("[chart-details]", err);
    return NextResponse.json({ error: err.message||"Internal error" },{status:500});
  }
}
