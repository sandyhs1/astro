"use client";
import { useState, useEffect, useCallback } from "react";
import { buildGoogleCalendarUrl, downloadICS } from "@/lib/calendar-utils";
import { SectionHeader } from "./PanchangUtils";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CalEvent {
  id: string; title: string; event_type: string; event_date: string;
  start_time?: string; end_time?: string; choghadiya?: string;
  hora_lord?: string; muhurat_grade?: string; notes?: string; color: string;
}
type View = "month" | "week" | "day";

const GRADE_COLORS: Record<string, string> = { god:"#F59E0B", diamond:"#3B82F6", gold:"#10B981" };
const EVENT_COLORS = ["#6366F1","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#06B6D4"];
const EVENT_TYPES  = ["general","Business Launch","Wedding","Travel","Health","Finance","Education","Personal"];
const DAYS         = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS       = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function pad2(n: number) { return String(n).padStart(2,"0"); }
function toDateStr(d: Date) { return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function fmt12(t?: string) {
  if (!t) return ""; const [h,m] = t.split(":").map(Number);
  return `${h===0?12:h>12?h-12:h}:${pad2(m)} ${h<12?"AM":"PM"}`;
}

// ─── Event Modal ──────────────────────────────────────────────────────────────
function EventModal({ date, onSave, onClose, prefill }: {
  date: string; onSave: (ev: Partial<CalEvent>) => void;
  onClose: () => void; prefill?: Partial<CalEvent>;
}) {
  const [title,     setTitle]     = useState(prefill?.title || "");
  const [type,      setType]      = useState(prefill?.event_type || "general");
  const [start,     setStart]     = useState(prefill?.start_time || "");
  const [end,       setEnd]       = useState(prefill?.end_time || "");
  const [notes,     setNotes]     = useState(prefill?.notes || "");
  const [color,     setColor]     = useState(prefill?.color || "#6366F1");
  const [eventDate, setEventDate] = useState(prefill?.event_date || date);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:40 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900">Add Event</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        <div className="p-5 space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title…"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-400" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Date</p>
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Type</p>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400">
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Start Time</p>
              <input type="time" value={start} onChange={e => setStart(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">End Time</p>
              <input type="time" value={end} onChange={e => setEnd(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
            </div>
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)…" rows={2}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 resize-none" />
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Colour</p>
            <div className="flex gap-2">
              {EVENT_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${color===c ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : ""}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button disabled={!title.trim()} onClick={() => onSave({ title, event_type: type, event_date: eventDate, start_time: start||undefined, end_time: end||undefined, notes: notes||undefined, color, choghadiya: prefill?.choghadiya, hora_lord: prefill?.hora_lord, muhurat_grade: prefill?.muhurat_grade })}
            className="flex-1 py-3 rounded-xl text-sm font-black text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
            Save Event
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Month View ───────────────────────────────────────────────────────────────
function MonthView({ year, month, events, onDayClick, onEventClick }: {
  year: number; month: number; events: CalEvent[];
  onDayClick: (d: string) => void; onEventClick: (e: CalEvent) => void;
}) {
  const today    = toDateStr(new Date());
  const firstDay = new Date(year, month, 1).getDay();
  const daysInM  = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({length:daysInM},(_,i)=>i+1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const evMap: Record<string, CalEvent[]> = {};
  events.forEach(e => { (evMap[e.event_date] ||= []).push(e); });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 border-b border-slate-100">
        {DAYS.map(d => <div key={d} className="py-2 text-center text-[10px] font-black uppercase text-slate-400">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const dateStr = day ? `${year}-${pad2(month+1)}-${pad2(day)}` : "";
          const dayEvs  = dateStr ? (evMap[dateStr] || []) : [];
          const isToday = dateStr === today;
          return (
            <div key={i} onClick={() => day && onDayClick(dateStr)}
              className={`min-h-[80px] sm:min-h-[100px] p-1.5 border-r border-b border-slate-50 cursor-pointer transition-colors ${day ? "hover:bg-indigo-50/40" : "bg-slate-50/50"} ${isToday ? "bg-indigo-50" : ""}`}>
              {day && (
                <>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mb-1 ${isToday ? "bg-indigo-600 text-white" : "text-slate-700"}`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvs.slice(0,3).map(ev => (
                      <div key={ev.id} onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded truncate text-white leading-tight"
                        style={{ background: ev.color }}>
                        {ev.muhurat_grade && <span className="mr-0.5">{ev.muhurat_grade==="god"?"🏆":ev.muhurat_grade==="diamond"?"💎":"🥇"}</span>}
                        {ev.title}
                      </div>
                    ))}
                    {dayEvs.length > 3 && <p className="text-[10px] text-slate-400 font-semibold pl-1">+{dayEvs.length-3} more</p>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Week View ────────────────────────────────────────────────────────────────
function WeekView({ weekStart, events, onSlotClick, onEventClick }: {
  weekStart: Date; events: CalEvent[];
  onSlotClick: (d: string, h: number) => void; onEventClick: (e: CalEvent) => void;
}) {
  const days = Array.from({length:7}, (_,i) => { const d = new Date(weekStart); d.setDate(d.getDate()+i); return d; });
  const today = toDateStr(new Date());
  const evMap: Record<string, CalEvent[]> = {};
  events.forEach(e => { (evMap[e.event_date] ||= []).push(e); });

  const hours = Array.from({length:16}, (_,i) => i + 6); // 6AM to 9PM

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="grid border-b border-slate-100" style={{ gridTemplateColumns:"48px repeat(7,1fr)" }}>
        <div />
        {days.map((d,i) => (
          <div key={i} className={`py-2 text-center border-l border-slate-50 ${toDateStr(d)===today?"bg-indigo-50":""}`}>
            <p className="text-[10px] font-black uppercase text-slate-400">{DAYS[d.getDay()]}</p>
            <p className={`text-sm font-black ${toDateStr(d)===today?"text-indigo-600":"text-slate-700"}`}>{d.getDate()}</p>
          </div>
        ))}
      </div>
      <div className="overflow-y-auto max-h-[500px]">
        {hours.map(h => (
          <div key={h} className="grid border-b border-slate-50" style={{ gridTemplateColumns:"48px repeat(7,1fr)" }}>
            <div className="py-2 pr-2 text-right text-[10px] text-slate-300 font-semibold">{h===12?"12PM":h>12?`${h-12}PM`:`${h}AM`}</div>
            {days.map((d, di) => {
              const ds   = toDateStr(d);
              const evs  = (evMap[ds] || []).filter(e => e.start_time && parseInt(e.start_time) === h);
              return (
                <div key={di} onClick={() => onSlotClick(ds, h)}
                  className="border-l border-slate-50 min-h-[44px] p-0.5 hover:bg-indigo-50/30 cursor-pointer relative">
                  {evs.map(ev => (
                    <div key={ev.id} onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                      className="text-[10px] font-bold px-1.5 py-1 rounded text-white mb-0.5 truncate"
                      style={{ background: ev.color }}>
                      {ev.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Event Detail Panel ───────────────────────────────────────────────────────
function EventDetail({ event, onClose, onDelete }: { event: CalEvent; onClose: () => void; onDelete: () => void; }) {
  const gcUrl = buildGoogleCalendarUrl({
    title: event.title, date: event.event_date,
    startTime: event.start_time, endTime: event.end_time,
    description: [event.choghadiya && `Choghadiya: ${event.choghadiya}`, event.notes].filter(Boolean).join("\n"),
  });

  const handleICS = () => downloadICS([{
    title: event.title, date: event.event_date,
    startTime: event.start_time, endTime: event.end_time,
    description: event.notes,
  }], `${event.title.replace(/\s+/g,"-")}.ics`);

  return (
    <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: event.color }} />
            {event.muhurat_grade && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                style={{ background: (GRADE_COLORS[event.muhurat_grade]||"#6366F1")+"20", color: GRADE_COLORS[event.muhurat_grade]||"#6366F1" }}>
                {event.muhurat_grade==="god"?"🏆 God Mode":event.muhurat_grade==="diamond"?"💎 Diamond":"🥇 Gold"}
              </span>
            )}
          </div>
          <h3 className="font-black text-slate-900 text-base">{event.title}</h3>
          <p className="text-sm text-slate-500 font-medium">
            {new Date(event.event_date).toLocaleDateString("en-IN",{weekday:"long",month:"long",day:"numeric"})}
            {event.start_time && ` · ${fmt12(event.start_time)}${event.end_time?` – ${fmt12(event.end_time)}`:""}`}
          </p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
      </div>
      {event.choghadiya && (
        <div className="bg-slate-50 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-xs font-black text-slate-400">Choghadiya:</span>
          <span className="text-xs font-black text-indigo-700">{event.choghadiya}</span>
          {event.hora_lord && <><span className="text-xs text-slate-300">·</span><span className="text-xs font-semibold text-slate-600">Hora: {event.hora_lord}</span></>}
        </div>
      )}
      {event.notes && <p className="text-sm text-slate-600">{event.notes}</p>}
      <div className="flex gap-2 pt-1 flex-wrap">
        <a href={gcUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">
          📅 Add to Google Calendar
        </a>
        <button onClick={handleICS}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
          ⬇ Download ICS
        </button>
        <button onClick={onDelete}
          className="ml-auto px-3 py-2 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">
          🗑 Delete
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Calendar Component ──────────────────────────────────────────────────
export default function PanchangCalendar({ profileId }: { profileId: string }) {
  const now     = new Date();
  const [view,  setView]  = useState<View>("month");
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(now); d.setDate(d.getDate() - d.getDay()); return d;
  });
  const [events,     setEvents]     = useState<CalEvent[]>([]);
  const [showModal,  setShowModal]  = useState(false);
  const [modalDate,  setModalDate]  = useState(toDateStr(now));
  const [modalPre,   setModalPre]   = useState<Partial<CalEvent> | undefined>();
  const [selected,   setSelected]   = useState<CalEvent | null>(null);
  const [loading,    setLoading]    = useState(false);

  // Load events for visible range
  const loadEvents = useCallback(async () => {
    setLoading(true);
    const from = view === "month"
      ? `${year}-${pad2(month+1)}-01`
      : toDateStr(weekStart);
    const to   = view === "month"
      ? `${year}-${pad2(month+1)}-${new Date(year,month+1,0).getDate()}`
      : toDateStr(new Date(weekStart.getTime() + 6 * 86400000));

    try {
      const res = await fetch(`/api/calendar?from=${from}&to=${to}&profileId=${profileId}`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [view, year, month, weekStart, profileId]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  async function saveEvent(ev: Partial<CalEvent>) {
    try {
      await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ev, profile_id: profileId }),
      });
      setShowModal(false);
      setModalPre(undefined);
      loadEvents();
    } catch { /* silent */ }
  }

  async function deleteEvent(id: string) {
    await fetch(`/api/calendar?id=${id}`, { method: "DELETE" });
    setSelected(null);
    loadEvents();
  }

  function prevPeriod() {
    if (view === "month") { if (month === 0) { setYear(y => y-1); setMonth(11); } else setMonth(m => m-1); }
    else setWeekStart(d => new Date(d.getTime() - 7*86400000));
  }
  function nextPeriod() {
    if (view === "month") { if (month === 11) { setYear(y => y+1); setMonth(0); } else setMonth(m => m+1); }
    else setWeekStart(d => new Date(d.getTime() + 7*86400000));
  }

  const periodLabel = view === "month"
    ? `${MONTHS[month]} ${year}`
    : `${weekStart.toLocaleDateString("en-IN",{month:"short",day:"numeric"})} – ${new Date(weekStart.getTime()+6*86400000).toLocaleDateString("en-IN",{month:"short",day:"numeric"})}`;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {(["month","week"] as View[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black capitalize transition-all ${view===v?"bg-white text-slate-900 shadow-sm":"text-slate-500"}`}>
                {v}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <button onClick={prevPeriod} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">‹</button>
          <span className="font-black text-slate-900 text-sm min-w-[160px] text-center">{periodLabel}</span>
          <button onClick={nextPeriod} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">›</button>

          <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }}
            className="px-3 py-1.5 text-xs font-black text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50">
            Today
          </button>

          {/* Add event */}
          <button onClick={() => { setModalDate(toDateStr(now)); setModalPre(undefined); setShowModal(true); }}
            className="ml-auto px-4 py-2 rounded-xl text-xs font-black text-white"
            style={{ background:"linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
            + Add Event
          </button>
        </div>

        {loading && <div className="mt-2 h-0.5 w-full bg-indigo-100 rounded overflow-hidden"><div className="h-full bg-indigo-400 animate-pulse w-2/3" /></div>}
      </div>

      {/* Selected event detail */}
      <AnimatePresence>
        {selected && (
          <EventDetail event={selected} onClose={() => setSelected(null)} onDelete={() => deleteEvent(selected.id)} />
        )}
      </AnimatePresence>

      {/* Calendar grid */}
      {view === "month" && (
        <MonthView year={year} month={month} events={events}
          onDayClick={d => { setModalDate(d); setModalPre(undefined); setShowModal(true); }}
          onEventClick={e => setSelected(selected?.id === e.id ? null : e)} />
      )}
      {view === "week" && (
        <WeekView weekStart={weekStart} events={events}
          onSlotClick={(d, h) => { setModalDate(d); setModalPre({ start_time: `${pad2(h)}:00` }); setShowModal(true); }}
          onEventClick={e => setSelected(selected?.id === e.id ? null : e)} />
      )}

      {/* Legend */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <p className="text-[11px] font-bold text-blue-700 flex items-center gap-2">
          <span>📅</span> Google Calendar Integration
        </p>
        <p className="text-[11px] text-blue-600 mt-1">
          Click any event → "Add to Google Calendar" opens it pre-filled in your Google Calendar. Or download as ICS for Apple/Outlook.
        </p>
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showModal && (
          <EventModal date={modalDate} prefill={modalPre} onSave={saveEvent} onClose={() => { setShowModal(false); setModalPre(undefined); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
