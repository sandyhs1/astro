import { NextResponse } from "next/server";
import { geocodePlace, buildVedAstroTime, fetchAllPlanetData, fetchHoroscopePredictions } from "@/lib/vedastro";

export async function POST(req: Request) {
    try {
        const { dob, tob, pob, timezone, lat, lon } = await req.json();
        if (!dob || !tob || !pob) {
            return NextResponse.json({ error: "Birth details required (dob, tob, pob)" }, { status: 400 });
        }

        // Use pre-resolved coords if provided, otherwise geocode (cached server-side)
        let coords = { lat: Number(lat), lon: Number(lon) };
        if (!lat || !lon) {
            const geo = await geocodePlace(pob);
            coords = { lat: geo.lat, lon: geo.lon };
        }
        const time = buildVedAstroTime(dob, tob, coords.lat, coords.lon, timezone || "+05:30");

        // Run both requests in parallel
        const [planets, predictions] = await Promise.allSettled([
            fetchAllPlanetData(time),
            fetchHoroscopePredictions(time),
        ]);

        const planetData = planets.status === "fulfilled" ? planets.value : [];
        const predictionData = predictions.status === "fulfilled" ? predictions.value : [];

        // Parse planet array into a keyed map for easy access
        const planetMap: Record<string, any> = {};
        for (const entry of planetData) {
            const name = Object.keys(entry)[0];
            if (name) planetMap[name] = entry[name];
        }

        // Extract the key blueprint fields
        const blueprint = {
            // Core identity
            sunSign: planetMap["Sun"]?.PlanetRasiD1Sign?.Name || null,
            moonSign: planetMap["Moon"]?.PlanetRasiD1Sign?.Name || null,
            moonNakshatra: planetMap["Moon"]?.PlanetConstellation?.Name || null,
            moonNakshatraPada: null, // VedAstro doesn't directly provide Pada in this endpoint easily, so we leave it null for now
            // All 9 planet positions for detailed view
            planets: Object.entries(planetMap).map(([name, data]) => ({
                name,
                sign: data.PlanetRasiD1Sign?.Name || "Unknown",
                house: data.HousePlanetOccupiesBasedOnSign?.replace("House", "") || "Unknown",
                nakshatra: data.PlanetConstellation?.Name || null,
                isRetrograde: data.IsPlanetRetrograde ?? false,
                isDignified: data.IsPlanetInOwnHouse || data.IsPlanetExalted || false,
                isDebilitated: data.IsPlanetDebilitated ?? false,
                isExalted: data.IsPlanetExalted ?? false,
                lord: data.PlanetLordOfHouse?.[0] || null,
            })),
            // Top predictions (positive first)
            keyPredictions: predictionData.slice(0, 12).map((p: any) => ({
                name: p.Name || "",
                description: p.Description || "",
                nature: p.Nature || "Neutral",
                related: p.RelatedBody || "",
            })),
        };

        return NextResponse.json({ success: true, data: blueprint });
    } catch (err: any) {
        console.error("Blueprint API error:", err);
        return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
    }
}
