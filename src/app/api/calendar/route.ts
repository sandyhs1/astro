/**
 * /api/calendar — CRUD for user calendar events
 * GET    ?from=YYYY-MM-DD&to=YYYY-MM-DD&profileId=xxx → list events
 * POST   { title, event_date, start_time, end_time, event_type, choghadiya, hora_lord, muhurat_grade, notes, color, profile_id }
 * DELETE ?id=UUID → delete event
 */

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => cookieStore.get(n)?.value } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

// ─── GET: list events in date range ──────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from      = searchParams.get("from");
    const to        = searchParams.get("to");
    const profileId = searchParams.get("profileId");

    const { user } = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let q = admin.from("calendar_events")
      .select("*")
      .eq("user_id", user.id)
      .order("event_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (from) q = q.gte("event_date", from);
    if (to)   q = q.lte("event_date", to);
    if (profileId && profileId !== "all") q = q.eq("profile_id", profileId);

    const { data, error } = await q;
    if (error) throw error;

    return NextResponse.json({ events: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── POST: create event ───────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user } = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await admin.from("calendar_events").insert({
      user_id:       user.id,
      profile_id:    body.profile_id  || null,
      title:         body.title,
      event_type:    body.event_type  || "general",
      event_date:    body.event_date,
      start_time:    body.start_time  || null,
      end_time:      body.end_time    || null,
      choghadiya:    body.choghadiya  || null,
      hora_lord:     body.hora_lord   || null,
      muhurat_grade: body.muhurat_grade || null,
      notes:         body.notes       || null,
      color:         body.color       || "#6366F1",
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ event: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── DELETE: remove event ─────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { user } = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { error } = await admin.from("calendar_events")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
