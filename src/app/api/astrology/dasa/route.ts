import { NextResponse } from "next/server";
import { geocodePlace, buildVedAstroTime, fetchDasaAtRange } from "@/lib/vedastro";

export async function POST(req: Request) {
    try {
        const { dob, tob, pob, timezone, lat, lon } = await req.json();
        if (!dob || !tob || !pob) {
            return NextResponse.json({ error: "Birth details required (dob, tob, pob)" }, { status: 400 });
        }

        let coords = { lat: Number(lat), lon: Number(lon) };
        if (!lat || !lon) {
            const geo = await geocodePlace(pob);
            coords = { lat: geo.lat, lon: geo.lon };
        }
        const birth = buildVedAstroTime(dob, tob, coords.lat, coords.lon, timezone || "+05:30");

        // 50 year range: 5 years back to 45 forward
        const currentYear = new Date().getFullYear();
        const data = await fetchDasaAtRange(birth, currentYear - 5, currentYear + 45);

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error("Dasa API error:", err);
        return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
    }
}
