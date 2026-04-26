import { NextResponse } from "next/server";
import { getOrBuildChart } from "@/lib/astrology/manager";
import { geocodePlace, tzStringToFloat } from "@/lib/astrology/client";

/**
 * POST /api/generate-chart
 * Called after user onboarding to pre-generate and cache chart.
 *
 * Body: { dob, tob, pob, timezone?, lat?, lon?, userEmail? }
 */
export async function POST(req: Request) {
  try {
    const { dob, tob, pob, timezone, lat, lon, userEmail } = await req.json();

    if (!dob || !tob || !pob) {
      return NextResponse.json({ error: "dob, tob, and pob are required" }, { status: 400 });
    }

    const { chart, fromCache } = await getOrBuildChart(
      dob, tob, pob,
      timezone || "+05:30",
      lat ? Number(lat) : undefined,
      lon ? Number(lon) : undefined,
      userEmail,
    );

    return NextResponse.json({
      success: true,
      fromCache,
      birthHash: chart.meta.birthHash,
      summary: {
        lagna: chart.d1.ascendant,
        moonSign: chart.d1.moonSign,
        moonNakshatra: chart.d1.moonNakshatra,
        sunSign: chart.d1.sunSign,
        planets: chart.d1.planets.map(p => ({
          name: p.name,
          sign: p.sign,
          house: p.house,
          degree: p.normDegree.toFixed(2),
          isRetro: p.isRetro,
        })),
        houses: chart.d1.houses.map(h => ({
          number: h.number,
          sign: h.sign,
          occupants: h.occupants,
        })),
        karakas: chart.karakas,
        dasha: {
          mahadasha: chart.dasha.mahadasha,
          antardasha: chart.dasha.antardasha,
        },
        d9Lagna: chart.divisional.d9.ascendant,
        d10Lagna: chart.divisional.d10.ascendant,
        confidence: chart.confidence,
      },
    });

  } catch (err: any) {
    console.error("generate-chart error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
