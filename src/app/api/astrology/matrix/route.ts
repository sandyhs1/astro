import { NextResponse } from "next/server";
import { geocodePlace, buildVedAstroTime, fetchAllPlanetData } from "@/lib/vedastro";

// Planet dignity color mapping
const DIGNITY_MAP: Record<string, string> = {
    Sun: "exalted_in_Aries",
    Moon: "exalted_in_Taurus",
    Mars: "exalted_in_Capricorn",
    Mercury: "exalted_in_Virgo",
    Jupiter: "exalted_in_Cancer",
    Venus: "exalted_in_Pisces",
    Saturn: "exalted_in_Libra",
};

export async function POST(req: Request) {
    try {
        const { dob, tob, pob, timezone, lat, lon } = await req.json();
        if (!dob || !tob || !pob) {
            return NextResponse.json({ error: "Birth details required" }, { status: 400 });
        }

        let coords = { lat: Number(lat), lon: Number(lon) };
        if (!lat || !lon) {
            const geo = await geocodePlace(pob);
            coords = { lat: geo.lat, lon: geo.lon };
        }
        const time = buildVedAstroTime(dob, tob, coords.lat, coords.lon, timezone || "+05:30");

        const planetData = await fetchAllPlanetData(time);

        // Build a rich strength matrix from AllPlanetData
        const planetMap: Record<string, any> = {};
        for (const entry of planetData) {
            const name = Object.keys(entry)[0];
            if (name) planetMap[name] = entry[name];
        }

        const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
        const matrix = planets.map((name) => {
            const p = planetMap[name] || {};
            const isExalted = p.IsPlanetExalted ?? false;
            const isDebilitated = p.IsPlanetDebilitated ?? false;
            const isOwnHouse = p.IsPlanetInOwnHouse ?? false;
            const isRetrograde = p.IsPlanetRetrograde ?? false;
            const isFriendlyHouse = p.IsPlanetInFriendHouse ?? false;
            const isEnemyHouse = p.IsPlanetInEnemyHouse ?? false;

            // Calculate a simple strength score (0-10)
            let score = 5; // base
            if (isExalted) score += 4;
            if (isDebilitated) score -= 4;
            if (isOwnHouse) score += 3;
            if (isFriendlyHouse) score += 1;
            if (isEnemyHouse) score -= 1;
            if (isRetrograde) score -= 1; // mild malefic unless Jupiter/Saturn
            score = Math.max(0, Math.min(10, score));

            return {
                name,
                sign: p.PlanetRasiD1Sign?.Name || "Unknown",
                house: p.HousePlanetOccupiesBasedOnSign?.replace("House", "") || "Unknown",
                nakshatra: p.PlanetConstellation?.Name || null,
                isExalted,
                isDebilitated,
                isOwnHouse,
                isRetrograde,
                isFriendlyHouse,
                isEnemyHouse,
                score,
                status: isExalted ? "Exalted" : isDebilitated ? "Debilitated" : isOwnHouse ? "Own House" : isFriendlyHouse ? "Friendly" : isEnemyHouse ? "Enemy" : "Neutral",
            };
        });

        return NextResponse.json({ success: true, data: { matrix } });
    } catch (err: any) {
        console.error("Matrix API error:", err);
        return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
    }
}
