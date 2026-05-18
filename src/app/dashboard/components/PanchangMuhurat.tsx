"use client";
import { useState } from "react";
import { SectionHeader } from "./PanchangUtils";
import { PAL, CHOG_TONE } from "./destiny-theme";
import { buildGoogleCalendarUrl, downloadICS } from "@/lib/calendar-utils";

const EVENT_TYPES = ["Business Launch", "Wedding", "Travel", "House Warming", "Medical Procedure", "Job / Interview", "Finance", "Education", "General"];

const GRADE_CONFIG = {
  god:     { symbol: "✦", label: "God Mode", bg: PAL.amberBg,  border: "#E1CE9B", ink: PAL.gold },
  diamond: { symbol: "◆", label: "Diamond",  bg: "#E5EEF6",     border: "#BCD0E1", ink: "#1F4F7A" },
  gold:    { symbol: "✧", label: "Gold",     bg: PAL.sageBg,    border: "#C7D6BB", ink: PAL.sage },
};

function fmtISO(iso: string) {
  try { return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }); }
  catch { return ""; }
}

interface MuhuratWindow { date: string; start: string; end: string; choghadiya: string; score: number; grade: string; reasons: string[]; }

export default function PanchangMuhurat({ profileId }: { profileId: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const weekLater = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const [eventType, setEventType] = useState("Business Launch");
  const [startDate, setStartDate] = useState(today);
  const [endDate,   setEndDate]   = useState(weekLater);
  const [loading,   setLoading]   = useState(false);
  const [results,   setResults]   = useState<MuhuratWindow[]>([]);
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
    <div className="space-y-5">
      {/* Intro */}
      <div className="rounded-sm p-4 md:p-5"
        style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
      >
        <SectionHeader
          emoji="❖"
          title="Muhurat finder"
          subtitle="Scan any date range for your ideal auspicious window."
        />
        <ul className="space-y-1.5 mt-2 serif-text text-[12.5px]" style={{ color: PAL.ink2 }}>
          <li><span style={{ color: GRADE_CONFIG.god.ink }}>✦</span> <strong>God Mode</strong> — Amrit/Abhijit overlap. Rare and perfect.</li>
          <li><span style={{ color: GRADE_CONFIG.diamond.ink }}>◆</span> <strong>Diamond</strong> — Amrit or Shubh in prime hours.</li>
          <li><span style={{ color: GRADE_CONFIG.gold.ink }}>✧</span> <strong>Gold</strong> — Labh/Shubh with no Rahu Kaal.</li>
        </ul>
      </div>

      {/* Form */}
      <div
        className="rounded-sm p-5 md:p-6 space-y-5"
        style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
      >
        {/* Event type */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2.5" style={{ color: PAL.accent }}>
            01 · Event type
          </p>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setEventType(t)}
                className="serif-text text-[12.5px] font-semibold px-3 py-1.5 rounded-sm transition-colors"
                style={
                  eventType === t
                    ? { background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }
                    : { background: "transparent", color: PAL.ink2, border: `1px solid ${PAL.border}` }
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
              02 · Start date
            </p>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={e => setStartDate(e.target.value)}
              className="w-full serif-text text-[14px] rounded-sm px-3.5 py-2.5 focus:outline-none transition-colors"
              style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
            />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
              03 · End date
            </p>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full serif-text text-[14px] rounded-sm px-3.5 py-2.5 focus:outline-none transition-colors"
              style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
            />
          </div>
        </div>

        <button
          onClick={find}
          disabled={loading}
          className="w-full py-3.5 rounded-sm serif-text text-[13.5px] font-semibold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
          style={{ background: PAL.accent }}
        >
          {loading ? "Scanning windows…" : "✦ Find auspicious windows"}
        </button>
      </div>

      {error && (
        <p className="serif-text text-[13px] rounded-sm px-4 py-2.5"
          style={{ background: PAL.roseBg, color: PAL.rose, border: `1px solid #E5BFC1` }}
        >
          {error}
        </p>
      )}

      {/* Results */}
      {searched && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
            {results.length} {results.length === 1 ? "window" : "windows"} found · {eventType}
          </p>
          {results.length === 0 && (
            <div
              className="rounded-sm py-8 text-center"
              style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
            >
              <p className="serif-display italic text-[16px]" style={{ color: PAL.ink2 }}>
                No optimal windows in this range.
              </p>
              <p className="serif-text text-[13px] mt-1" style={{ color: PAL.ink3 }}>
                Try extending the date range.
              </p>
            </div>
          )}

          {results.map((w, i) => {
            const g = GRADE_CONFIG[w.grade as keyof typeof GRADE_CONFIG] || GRADE_CONFIG.gold;
            const chog = CHOG_TONE[w.choghadiya] || CHOG_TONE.Chal;
            const startDt = new Date(w.start);
            const endDt   = new Date(w.end);
            const dateStr = `${startDt.getFullYear()}-${String(startDt.getMonth() + 1).padStart(2, '0')}-${String(startDt.getDate()).padStart(2, '0')}`;
            const startHM = `${String(startDt.getHours()).padStart(2, '0')}:${String(startDt.getMinutes()).padStart(2, '0')}`;
            const endHM   = `${String(endDt.getHours()).padStart(2, '0')}:${String(endDt.getMinutes()).padStart(2, '0')}`;
            const gcUrl   = buildGoogleCalendarUrl({
              title: `${eventType} — ${w.choghadiya} Choghadiya`,
              date: dateStr, startTime: startHM, endTime: endHM,
              description: w.reasons.join('. '),
            });

            async function saveToCalendar() {
              await fetch("/api/calendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: `${eventType} — ${w.choghadiya}`,
                  event_type: eventType.toLowerCase().replace(/\s+/g, "_"),
                  event_date: dateStr,
                  start_time: startHM, end_time: endHM,
                  choghadiya: w.choghadiya,
                  muhurat_grade: w.grade,
                  notes: w.reasons.join('. '),
                  color: w.grade === "god" ? PAL.gold : w.grade === "diamond" ? "#1F4F7A" : "#5A8856",
                }),
              });
            }

            return (
              <div
                key={i}
                className="rounded-sm p-5 md:p-6"
                style={{ background: g.bg, border: `1px solid ${g.border}` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span style={{ color: g.ink, fontSize: 16 }}>{g.symbol}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: g.ink }}>
                        {g.label}
                      </span>
                      <span className="serif-display italic text-[12px] tabular-nums" style={{ color: PAL.ink3 }}>
                        № {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="serif-display text-[18px] md:text-[20px] font-semibold leading-tight" style={{ color: PAL.ink }}>
                      {w.date}
                    </p>
                    <p className="serif-text text-[14px] tabular-nums mt-0.5" style={{ color: PAL.ink2 }}>
                      {fmtISO(w.start)} – {fmtISO(w.end)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <span
                      className="inline-block text-[11px] font-semibold tracking-tight px-2.5 py-1 rounded-sm"
                      style={{ color: chog.ink, background: chog.bg, border: `1px solid ${chog.border}` }}
                    >
                      {w.choghadiya}
                    </span>
                    <p className="serif-text text-[11px] italic mt-1" style={{ color: PAL.ink3 }}>
                      Score · {w.score}
                    </p>
                  </div>
                </div>

                {w.reasons?.length > 0 && (
                  <ul className="mt-3 pt-3 space-y-1" style={{ borderTop: `1px solid rgba(14,26,51,0.08)` }}>
                    {w.reasons.map((r, ri) => (
                      <li key={ri} className="serif-text text-[12.5px] flex items-start gap-2" style={{ color: PAL.ink2 }}>
                        <span className="flex-shrink-0 mt-0.5" style={{ color: PAL.accent }}>◆</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Actions */}
                <div className="mt-4 pt-3 flex flex-wrap gap-2" style={{ borderTop: `1px solid rgba(14,26,51,0.08)` }}>
                  <a
                    href={gcUrl} target="_blank" rel="noopener noreferrer"
                    className="serif-text text-[12px] font-semibold px-3 py-1.5 rounded-sm inline-flex items-center gap-1.5 transition-colors"
                    style={{ background: PAL.paper, color: "#1F4F7A", border: `1px solid #BCD0E1` }}
                  >
                    Google Calendar
                  </a>
                  <button
                    onClick={() => downloadICS([{ title: eventType, date: dateStr, startTime: startHM, endTime: endHM, description: w.reasons.join('. ') }])}
                    className="serif-text text-[12px] font-semibold px-3 py-1.5 rounded-sm inline-flex items-center gap-1.5 transition-colors"
                    style={{ background: PAL.paper, color: PAL.ink2, border: `1px solid ${PAL.border}` }}
                  >
                    Download ICS
                  </button>
                  <button
                    onClick={saveToCalendar}
                    className="serif-text text-[12px] font-semibold px-3 py-1.5 rounded-sm text-white inline-flex items-center gap-1.5 transition-opacity hover:opacity-90"
                    style={{ background: PAL.accent }}
                  >
                    + Save to my calendar
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
