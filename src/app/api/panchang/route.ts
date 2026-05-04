/**
 * /api/panchang — Real-time Vedic Panchang endpoint
 * GET  ?profileId=xxx  → full panchang for today (no credits, always fresh)
 * POST { profileId, startDate, endDate, eventType } → Muhurat Finder results
 */

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { astroClient, geocodePlace } from "@/lib/astrology/client";
import {
  buildFullPanchang,
  findMuhurats,
  calculateSunTimes,
} from "@/lib/astrology/panchang-engine";

// ─── GET: Today's Panchang ────────────────────────────────────────────────────

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (n) => cookieStore.get(n)?.value } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ── Resolve birth place for lat/lon + timezone ─────────────────────────
    let pob = "Mumbai, India";
    let tz  = "+05:30";
    let lat = 19.076;
    let lon = 72.8777;

    if (!profileId || profileId === "self") {
      const { data: fp } = await supabase
        .from("family_profiles").select("pob,timezone")
        .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp?.pob) { pob = fp.pob; tz = fp.timezone || "+05:30"; }
    } else {
      const { data: fp } = await supabase
        .from("family_profiles").select("pob,timezone")
        .eq("id", profileId).maybeSingle();
      if (fp?.pob) { pob = fp.pob; tz = fp.timezone || "+05:30"; }
    }

    // Geocode birth place
    try {
      const geo = await geocodePlace(pob);
      if (geo?.lat && geo?.lon) { lat = geo.lat; lon = geo.lon; }
    } catch { /* use defaults */ }

    // ── Get today's Moon + Sun positions from astroClient ─────────────────
    const now = new Date();
    let moonLon = 0;
    let sunLon  = 0;

    try {
      const tzFloat = parseTzToFloat(tz);
      const planets = await astroClient.vedic.getPlanets({
        day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear(),
        hour: now.getHours(), min: now.getMinutes(),
        lat, lon, tzone: tzFloat,
      });
      if (Array.isArray(planets)) {
        const moon = planets.find((p: any) => p.name === "Moon");
        const sun  = planets.find((p: any) => p.name === "Sun");
        moonLon = parseFloat(moon?.fullDegree || moon?.full_degree || "0");
        sunLon  = parseFloat(sun?.fullDegree  || sun?.full_degree  || "0");
      }
    } catch {
      // Fallback: approximate Moon longitude from date (moves ~13.17°/day from known epoch)
      const JD = getApproxJD(now);
      moonLon = ((JD - 2451549.5) * 13.176396 + 218.316) % 360;
      sunLon  = ((JD - 2451545.0) * 0.9856474 + 280.460) % 360;
    }

    // ── Build full panchang ───────────────────────────────────────────────
    const panchang = buildFullPanchang(now, lat, lon, moonLon, sunLon);

    // Compute success score (0-100) based on current Choghadiya + active Hora
    const score = computeDayScore(panchang, now);

    return NextResponse.json({
      panchang: serializePanchang(panchang),
      score,
      location: pob,
      lat, lon, tz,
      timestamp: now.toISOString(),
    });

  } catch (err: any) {
    console.error("[PANCHANG GET]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

// ─── POST: Muhurat Finder ─────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { profileId, startDate, endDate, eventType } = await req.json();

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (n) => cookieStore.get(n)?.value } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let lat = 19.076, lon = 72.8777;
    let pob = "Mumbai, India";

    if (!profileId || profileId === "self") {
      const { data: fp } = await supabase
        .from("family_profiles").select("pob,timezone")
        .eq("user_id", user.id).eq("relationship", "Self").maybeSingle();
      if (fp?.pob) pob = fp.pob;
    } else {
      const { data: fp } = await supabase
        .from("family_profiles").select("pob,timezone")
        .eq("id", profileId).maybeSingle();
      if (fp?.pob) pob = fp.pob;
    }

    try {
      const geo = await geocodePlace(pob);
      if (geo?.lat && geo?.lon) { lat = geo.lat; lon = geo.lon; }
    } catch { /* use defaults */ }

    const start = new Date(startDate);
    const end   = new Date(endDate);
    const windows = findMuhurats(start, end, lat, lon, eventType || "General");

    return NextResponse.json({
      windows: windows.map(w => ({
        ...w,
        start: w.start.toISOString(),
        end:   w.end.toISOString(),
      })),
      location: pob,
    });

  } catch (err: any) {
    console.error("[PANCHANG POST]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseTzToFloat(tz: string): number {
  const m = tz.match(/([+-])(\d{1,2}):(\d{2})/);
  if (!m) return 5.5;
  const sign = m[1] === "+" ? 1 : -1;
  return sign * (parseInt(m[2]) + parseInt(m[3]) / 60);
}

function getApproxJD(date: Date): number {
  const y = date.getUTCFullYear(), m = date.getUTCMonth() + 1, d = date.getUTCDate();
  let Y = y, M = m;
  if (M <= 2) { Y--; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5;
}

function computeDayScore(panchang: any, now: Date): number {
  const CHOG_SCORES: Record<string, number> = {
    Amrit: 100, Shubh: 85, Labh: 80, Chal: 55, Udveg: 30, Rog: 20, Kaal: 15,
  };
  const HORA_SCORES: Record<string, number> = {
    Jupiter: 20, Venus: 18, Mercury: 15, Moon: 12, Sun: 8, Mars: 3, Saturn: 2,
  };

  let score = 50;

  // Active Choghadiya
  const allChog = [...panchang.dayChoghadiya, ...panchang.nightChoghadiya];
  const activeCh = allChog.find((c: any) => new Date(c.start) <= now && new Date(c.end) > now);
  if (activeCh) score = CHOG_SCORES[activeCh.name] ?? 50;

  // Active Hora
  const activeHora = panchang.horas.find((h: any) => new Date(h.start) <= now && new Date(h.end) > now);
  if (activeHora) score += HORA_SCORES[activeHora.planet] ?? 5;

  // Rahu Kaal penalty
  const rk = panchang.rahuKaal;
  if (now >= new Date(rk.start) && now < new Date(rk.end)) score -= 30;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function serializePanchang(p: any): any {
  const serDate = (d: Date | undefined) => d?.toISOString() ?? null;
  const serPeriods = (arr: any[]) => arr.map(x => ({
    ...x,
    start: serDate(x.start),
    end:   serDate(x.end),
  }));

  return {
    tithi:            p.tithi,
    nakshatra:        p.nakshatra,
    yoga:             p.yoga,
    weekdayLord:      p.weekdayLord,
    sunTimes: {
      sunrise:    serDate(p.sunTimes.sunrise),
      sunset:     serDate(p.sunTimes.sunset),
      solarNoon:  serDate(p.sunTimes.solarNoon),
      nextSunrise: serDate(p.sunTimes.nextSunrise),
    },
    rahuKaal:   { start: serDate(p.rahuKaal.start),   end: serDate(p.rahuKaal.end)   },
    yamaganda:  { start: serDate(p.yamaganda.start),  end: serDate(p.yamaganda.end)  },
    gulikKaal:  { start: serDate(p.gulikKaal.start),  end: serDate(p.gulikKaal.end)  },
    abhijit:    { start: serDate(p.abhijit.start),    end: serDate(p.abhijit.end)    },
    kubera:     { start: serDate(p.kubera.start),     end: serDate(p.kubera.end)     },
    dayChoghadiya:   serPeriods(p.dayChoghadiya),
    nightChoghadiya: serPeriods(p.nightChoghadiya),
    horas:           serPeriods(p.horas),
  };
}
