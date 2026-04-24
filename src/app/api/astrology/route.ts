/**
 * POST /api/astrology
 *
 * Server-side API route that:
 * 1. Receives birth data from an authenticated client
 * 2. Geocodes place of birth → lat/lon
 * 3. Calls 3 VedAstro endpoints in parallel
 * 4. Returns combined astrological data
 *
 * Request body:
 * {
 *   dob: "1992-10-25",        // YYYY-MM-DD
 *   tob: "14:30",             // HH:MM (24h)
 *   tobAmPm?: "PM",           // optional AM/PM
 *   pob: "Mumbai, India",     // place of birth (free text)
 *   timezone?: "+05:30"       // UTC offset (defaults to +05:30)
 * }
 */
import { NextResponse } from "next/server";
import {
    geocodePlace,
    formatVedAstroTime,
    fetchFullBirthChart,
    type VedAstroTimeLegacy as VedAstroTime,
} from "@/lib/vedastro";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { dob, tob, tobAmPm, pob, timezone } = body;

        // ── Validation ───────────────────────────────────────────────────────
        if (!dob || !tob || !pob) {
            return NextResponse.json(
                { error: "Missing required fields: dob, tob, pob" },
                { status: 400 }
            );
        }

        // ── Step 1: Geocode place of birth ───────────────────────────────────
        let geo;
        try {
            geo = await geocodePlace(pob);
        } catch (geoErr: any) {
            return NextResponse.json(
                {
                    error: `Could not geocode place of birth: "${pob}". Try a more specific location (e.g. "Mumbai, Maharashtra, India").`,
                    details: geoErr.message,
                },
                { status: 422 }
            );
        }

        // ── Step 2: Format time for VedAstro ─────────────────────────────────
        const stdTime = formatVedAstroTime(dob, tob, tobAmPm, timezone || "+05:30");

        const vedAstroTime: VedAstroTime = {
            StdTime: stdTime,
            Location: {
                Name: geo.displayName,
                Longitude: geo.lon,
                Latitude: geo.lat,
            },
        };

        console.log("🔮 VedAstro request:", JSON.stringify(vedAstroTime, null, 2));

        // ── Step 3: Fetch all data in parallel ───────────────────────────────
        const result = await fetchFullBirthChart(vedAstroTime);

        if (result.errors.length > 0) {
            console.warn("⚠️ VedAstro partial errors:", result.errors);
        }

        // ── Step 4: Return combined result ───────────────────────────────────
        return NextResponse.json(
            {
                success: true,
                data: {
                    horoscope: result.horoscope,
                    planets: result.planets,
                    houses: result.houses,
                },
                meta: {
                    geocoded: {
                        lat: geo.lat,
                        lon: geo.lon,
                        displayName: geo.displayName,
                    },
                    stdTime,
                    errors: result.errors.length > 0 ? result.errors : undefined,
                },
            },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("❌ Astrology API error:", err);
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}
