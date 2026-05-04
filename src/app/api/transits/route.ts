/**
 * /api/transits — Real-time planetary transits using astroClient
 * GET ?profileId=xxx
 */
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { astroClient, geocodePlace } from "@/lib/astrology/client";

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

    let pob = "Mumbai, India";
    let lat = 19.076;
    let lon = 72.8777;
    let tz  = "+05:30";

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

    try {
      const geo = await geocodePlace(pob);
      if (geo?.lat && geo?.lon) { lat = geo.lat; lon = geo.lon; }
    } catch { /* use defaults */ }

    const tzFloat = parseTzToFloat(tz);
    const now = new Date();

    let transitPlanets: any[] = [];
    try {
      transitPlanets = await astroClient.vedic.getPlanets({
        day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear(),
        hour: now.getHours(), min: now.getMinutes(),
        lat, lon, tzone: tzFloat,
      });
    } catch (err) {
      console.warn("Transits API limit reached:", err);
    }

    // 2. We also need to know the user's birth chart (Moon Sign, Ascendant) to show the transit in Houses
    // Let's fetch basic chart info from our API
    let ascendantSign = "";
    let moonSign = "";

    try {
      // Fetch birth details
      const { data: bfp } = await supabase
        .from("family_profiles").select("dob,tob,pob,timezone")
        .eq("id", profileId && profileId !== "self" ? profileId : (await supabase.from("family_profiles").select("id").eq("user_id", user.id).eq("relationship", "Self").single()).data?.id)
        .maybeSingle();

      if (bfp?.dob && bfp?.tob) {
         const [y, m, d] = bfp.dob.split("-").map(Number);
         const [h, min] = bfp.tob.split(":").map(Number);
         const bGeo = await geocodePlace(bfp.pob);
         const bLat = bGeo?.lat || lat;
         const bLon = bGeo?.lon || lon;
         const bTzFloat = parseTzToFloat(bfp.timezone || "+05:30");

         const birthPlanets = await astroClient.vedic.getPlanets({
            day: d, month: m, year: y, hour: h, min: min, lat: bLat, lon: bLon, tzone: bTzFloat
         });
         
         const birthAsc = birthPlanets?.find((p: any) => p.name === "Ascendant");
         const birthMoon = birthPlanets?.find((p: any) => p.name === "Moon");
         
         ascendantSign = birthAsc?.sign || "";
         moonSign = birthMoon?.sign || "";
      }
    } catch (err) {
      console.warn("Failed to get birth planets for house mapping", err);
    }

    return NextResponse.json({
      transits: transitPlanets.filter((p:any) => p.name !== "Ascendant").map((p: any) => ({
        planet: p.name,
        sign: p.sign,
        isRetrograde: p.isRetro === "true" || p.isRetrograde,
        degree: parseFloat(p.fullDegree || p.full_degree || "0") % 30,
      })),
      ascendantSign,
      moonSign,
      timestamp: now.toISOString(),
      location: pob
    });

  } catch (err: any) {
    console.error("[TRANSITS GET]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function parseTzToFloat(tz: string): number {
  const m = tz.match(/([+-])(\d{1,2}):(\d{2})/);
  if (!m) return 5.5;
  const sign = m[1] === "+" ? 1 : -1;
  return sign * (parseInt(m[2]) + parseInt(m[3]) / 60);
}
