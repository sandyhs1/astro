import { NextResponse } from "next/server";
import { geocodePlace, buildVedAstroTime, fetchMatchReport } from "@/lib/vedastro";

export async function POST(req: Request) {
    try {
        const { male, female } = await req.json();

        if (!male?.dob || !male?.tob || !male?.pob || !female?.dob || !female?.tob || !female?.pob) {
            return NextResponse.json(
                { error: "Both persons require dob, tob, and pob" },
                { status: 400 }
            );
        }

        // Geocode both places in parallel
        const [maleGeo, femaleGeo] = await Promise.all([
            geocodePlace(male.pob),
            geocodePlace(female.pob),
        ]);

        const maleTime = buildVedAstroTime(male.dob, male.tob, maleGeo.lat, maleGeo.lon, male.timezone || "+05:30");
        const femaleTime = buildVedAstroTime(female.dob, female.tob, femaleGeo.lat, femaleGeo.lon, female.timezone || "+05:30");

        const result = await fetchMatchReport(maleTime, femaleTime);

        // result is the raw MatchReport payload. Normalize it:
        const normalized = {
            kutaScore: result.KutaScore ?? result.TotalScore ?? 0,
            maxScore: 36,
            compatibility: result.CompatibilityAnalysis || null,
            kutaList: (result.KutaDataList || result.KutaList || []).map((k: any) => ({
                name: k.Name || k.KutaName || "Unknown",
                score: k.Score ?? k.GotScore ?? 0,
                maxScore: k.MaxScore ?? k.TotalScore ?? 0,
                nature: k.Nature || "Neutral",
                description: k.Description || "",
            })),
        };

        return NextResponse.json({ success: true, data: normalized });
    } catch (err: any) {
        console.error("Match API error:", err);
        return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
    }
}
