import { NextResponse } from "next/server";
import { fetchNumerology } from "@/lib/vedastro";

export async function POST(req: Request) {
    try {
        const { name } = await req.json();
        if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
        const result = await fetchNumerology(name.trim());
        return NextResponse.json({ success: true, data: result });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
    }
}
