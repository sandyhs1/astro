import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { astroClient, parseBirthParams, geocodePlace } from "@/lib/astrology/client";
import { tzStringToFloat } from "@/lib/astrology/client";

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
    const chartId = req.nextUrl.searchParams.get("chartId") ?? "D1"; // e.g. D1, D9, D10

    let dob="", tob="", pob="", tz="+05:30";

    if (!profileId || profileId==="self") {
      const { data: selfFp } = await supabase
        .from("family_profiles")
        .select("*")
        .eq("user_id", user.id)
        .eq("relationship", "Self")
        .maybeSingle();

      if (selfFp?.dob && selfFp?.tob && selfFp?.pob) {
        dob=selfFp.dob; tob=selfFp.tob; pob=selfFp.pob; tz=selfFp.timezone||"+05:30";
      } else {
        const { data: lead } = await supabase
          .from("onboarding_leads").select("*").eq("email", user.email).maybeSingle();
        if (!lead?.dob||!lead?.tob||!lead?.pob)
          return NextResponse.json({ error:"Profile not found" },{status:404});
        dob=lead.dob; tob=lead.tob; pob=lead.pob; tz=lead.timezone||"+05:30";
      }
    } else {
      let { data: fp } = await supabase
        .from("family_profiles").select("*").eq("id",profileId).maybeSingle();
      if (!fp) {
        const { data: astroClient } = await supabase
          .from("astrologer_clients").select("*").eq("id",profileId).maybeSingle();
        fp = astroClient;
      }
      if (!fp?.dob||!fp?.tob||!fp?.pob)
        return NextResponse.json({ error:"Profile not found." },{status:404});
      dob=fp.dob; tob=fp.tob; pob=fp.pob; tz=fp.timezone||"+05:30";
    }

    // Geocode and parse params
    const geo = await geocodePlace(pob);
    const tzFloat = tzStringToFloat(tz);
    const params = parseBirthParams(dob, tob, geo.lat, geo.lon, tzFloat);

    // Call AstrologyAPI to get the SVG
    const result = await astroClient.customRequest({
      method: "POST",
      endpoint: `horo_chart_image/${chartId}`,
      params
    });

    if (!result || !result.svg) {
      throw new Error("Failed to generate SVG");
    }

    return NextResponse.json({ svg: result.svg });

  } catch (err: any) {
    console.error("[chart-image]", err);
    return NextResponse.json({ error: err.message||"Internal error" },{status:500});
  }
}
