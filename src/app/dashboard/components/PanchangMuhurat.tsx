"use client";
import { useState } from "react";
import { SectionHeader } from "./PanchangUtils";
import { buildGoogleCalendarUrl, downloadICS } from "@/lib/calendar-utils";


const EVENT_TYPES = ["Business Launch","Wedding","Travel","House Warming","Medical Procedure","Job / Interview","Finance","Education","General"];
const GRADE_CONFIG = {
  god:     { emoji: "🏆", label: "God Mode",  bg: "#FFFBEB", border: "#FCD34D", text: "#B45309" },
  diamond: { emoji: "💎", label: "Diamond",   bg: "#EFF6FF", border: "#93C5FD", text: "#1D4ED8" },
  gold:    { emoji: "🥇", label: "Gold",      bg: "#F0FDF4", border: "#86EFAC", text: "#15803D" },
};
const CHOG_COLORS: Record<string, string> = {
  Amrit:"#059669", Shubh:"#2563EB", Labh:"#7C3AED", Chal:"#6B7280", Kaal:"#DC2626", Rog:"#B91C1C", Udveg:"#D97706",
};

function fmtISO(iso: string) {
  try { return new Date(iso).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true }); }
  catch { return ""; }
}

interface Window { date: string; start: string; end: string; choghadiya: string; score: number; grade: string; reasons: string[]; }

export default function PanchangMuhurat({ profileId }: { profileId: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const weekLater = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const [eventType, setEventType] = useState("Business Launch");
  const [startDate, setStartDate] = useState(today);
  const [endDate,   setEndDate]   = useState(weekLater);
  const [loading,   setLoading]   = useState(false);
  const [results,   setResults]   = useState<Window[]>([]);
  const [searched,  setSearched]  = useState(false);
  const [error,     setError]     = useState("");

  async function find() {
    setLoading(true); setError(""); setSearched(false);
    try {
      const res = await fetch("/api/panchang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, startDate, endDate, eventType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResults(data.windows || []);
      setSearched(true);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
        <SectionHeader emoji="🔭" title="Muhurat Finder" subtitle="Scan any date range for your ideal auspicious window." />
        <div className="text-[11px] text-slate-500 space-y-1">
          <p>🏆 <strong>God Mode</strong> — Amrit/Abhijit overlap. Rare & Perfect.</p>
          <p>💎 <strong>Diamond</strong> — Amrit or Shubh in prime hours.</p>
          <p>🥇 <strong>Gold</strong> — Labh/Shubh with no Rahu Kaal.</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-4">
        {/* Event type chips */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">1. Event Type</p>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map(t => (
              <button key={t} onClick={() => setEventType(t)}
                className={`text-[12px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                  eventType === t ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">2. Start Date</p>
            <input type="date" value={startDate} min={today}
              onChange={e => setStartDate(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-400 font-medium" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">3. End Date</p>
            <input type="date" value={endDate} min={startDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-400 font-medium" />
          </div>
        </div>

        <button onClick={find} disabled={loading}
          className="w-full py-3.5 rounded-xl font-black text-white text-sm disabled:opacity-60 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>
          {loading ? "⏳ Scanning windows..." : "✦ Find Auspicious Windows"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 px-4">{error}</p>}

      {/* Results */}
      {searched && (
        <div className="space-y-3">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            {results.length} windows found for {eventType}
          </p>
          {results.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">No optimal windows in this range. Try extending the date range.</div>
          )}
          {results.map((w, i) => {
            const g = GRADE_CONFIG[w.grade as keyof typeof GRADE_CONFIG] || GRADE_CONFIG.gold;
            const chogColor = CHOG_COLORS[w.choghadiya] || "#6B7280";
            // Build date string from ISO
            const startDt = new Date(w.start);
            const dateStr = `${startDt.getFullYear()}-${String(startDt.getMonth()+1).padStart(2,'0')}-${String(startDt.getDate()).padStart(2,'0')}`;
            const startHM = `${String(startDt.getHours()).padStart(2,'0')}:${String(startDt.getMinutes()).padStart(2,'0')}`;
            const endDt   = new Date(w.end);
            const endHM   = `${String(endDt.getHours()).padStart(2,'0')}:${String(endDt.getMinutes()).padStart(2,'0')}`;
            const gcUrl   = buildGoogleCalendarUrl({ title: `${eventType} — ${w.choghadiya} Choghadiya`, date: dateStr, startTime: startHM, endTime: endHM, description: w.reasons.join('. ') });

            async function saveToCalendar() {
              await fetch("/api/calendar", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: `${eventType} — ${w.choghadiya}`, event_type: eventType.toLowerCase().replace(/\s+/g,"_"), event_date: dateStr, start_time: startHM, end_time: endHM, choghadiya: w.choghadiya, muhurat_grade: w.grade, notes: w.reasons.join('. '), color: w.grade==="god"?"#F59E0B":w.grade==="diamond"?"#3B82F6":"#10B981" }),
              });
            }

            return (
              <div key={i} className="rounded-2xl border p-4" style={{ background: g.bg, borderColor: g.border }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{g.emoji}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: g.text }}>{g.label}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">#{i + 1}</span>
                    </div>
                    <p className="font-black text-slate-900 text-sm">{w.date}</p>
                    <p className="font-semibold text-slate-600 text-sm tabular-nums">
                      {fmtISO(w.start)} – {fmtISO(w.end)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full border"
                      style={{ color: chogColor, borderColor: chogColor + "40", background: chogColor + "12" }}>
                      {w.choghadiya}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Score: {w.score}</p>
                  </div>
                </div>
                {w.reasons?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-black/5 space-y-0.5">
                    {w.reasons.map((r, ri) => (
                      <p key={ri} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <span className="text-indigo-400 flex-shrink-0 mt-0.5">◆</span>{r}
                      </p>
                    ))}
                  </div>
                )}
                {/* Calendar Actions */}
                <div className="mt-3 pt-2 border-t border-black/5 flex gap-2 flex-wrap">
                  <a href={gcUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/80 border border-blue-200 text-blue-700 rounded-lg text-[11px] font-bold hover:bg-blue-50 transition-colors">
                    📅 Google Calendar
                  </a>
                  <button onClick={() => downloadICS([{ title:`${eventType}`, date:dateStr, startTime:startHM, endTime:endHM, description:w.reasons.join('. ') }])}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/80 border border-slate-200 text-slate-600 rounded-lg text-[11px] font-bold hover:bg-slate-50 transition-colors">
                    ⬇ ICS
                  </button>
                  <button onClick={saveToCalendar}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] font-bold hover:bg-indigo-700 transition-colors">
                    + Save to My Calendar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
