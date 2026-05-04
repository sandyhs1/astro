"use client";
import { useState, useEffect, useCallback } from "react";
import { buildGoogleCalendarUrl, downloadICS } from "@/lib/calendar-utils";
import { motion, AnimatePresence } from "framer-motion";

interface CalEvent {
  id: string; title: string; event_type: string; event_date: string;
  start_time?: string; end_time?: string; choghadiya?: string;
  muhurat_grade?: string; notes?: string; color: string;
}

const EVENT_COLORS = ["#6366F1","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#06B6D4","#F97316"];
const EVENT_TYPES  = ["General Task","Meeting","Business Launch","Travel","Health","Finance","Wedding","Education","Personal"];
const DAYS         = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS       = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function pad2(n: number) { return String(n).padStart(2,"0"); }
function toDateStr(d: Date) { return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function fmt12(t?: string) {
  if (!t) return "";
  const [h,m] = t.split(":").map(Number);
  return `${h===0?12:h>12?h-12:h}:${pad2(m)} ${h<12?"AM":"PM"}`;
}
function gcUrl(ev: Partial<CalEvent>) {
  return buildGoogleCalendarUrl({
    title: ev.title || "Event",
    date:  ev.event_date || toDateStr(new Date()),
    startTime: ev.start_time,
    endTime:   ev.end_time,
    description: [ev.choghadiya && `Choghadiya: ${ev.choghadiya}`, ev.notes].filter(Boolean).join("\n"),
  });
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function EventModal({ defaultDate, prefill, onSave, onClose }: {
  defaultDate: string;
  prefill?: Partial<CalEvent>;
  onSave: (ev: Partial<CalEvent>) => Promise<void>;
  onClose: () => void;
}) {
  const [title,  setTitle]  = useState(prefill?.title || "");
  const [notes,  setNotes]  = useState(prefill?.notes || "");
  const [type,   setType]   = useState(prefill?.event_type || "General Task");
  const [date,   setDate]   = useState(prefill?.event_date || defaultDate);
  const [start,  setStart]  = useState(prefill?.start_time || "");
  const [end,    setEnd]    = useState(prefill?.end_time || "");
  const [color,  setColor]  = useState(prefill?.color || "#6366F1");
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  async function handleSave() {
    if (!title.trim()) { setErr("Please add a title"); return; }
    setSaving(true); setErr("");
    try {
      await onSave({ title: title.trim(), notes: notes.trim(), event_type: type, event_date: date, start_time: start||undefined, end_time: end||undefined, color, choghadiya: prefill?.choghadiya, muhurat_grade: prefill?.muhurat_grade });
      onClose();
    } catch (e: any) { setErr(e.message || "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:30 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-base">
            {prefill?.id ? "Edit Event" : "Add Event / Task"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 text-lg leading-none">×</button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title — large, prominent */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Event / Task Title *</label>
            <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Sign business contract, Doctor appointment…"
              className="w-full border-2 border-slate-200 focus:border-indigo-400 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none transition-colors" />
          </div>

          {/* Notes / Description */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Notes / Description</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Add any details, reminders, or intentions…"
              className="w-full border-2 border-slate-200 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none transition-colors" />
          </div>

          {/* Type */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {EVENT_TYPES.map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${type===t ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Times */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 sm:col-span-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Date *</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full border-2 border-slate-200 focus:border-indigo-400 rounded-xl px-3 py-2.5 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Start</label>
              <input type="time" value={start} onChange={e => setStart(e.target.value)}
                className="w-full border-2 border-slate-200 focus:border-indigo-400 rounded-xl px-3 py-2.5 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">End</label>
              <input type="time" value={end} onChange={e => setEnd(e.target.value)}
                className="w-full border-2 border-slate-200 focus:border-indigo-400 rounded-xl px-3 py-2.5 text-sm focus:outline-none" />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Color</label>
            <div className="flex gap-2.5">
              {EVENT_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${color===c ? "scale-125 border-white shadow-md" : "border-transparent"}`}
                  style={{ background:c }} />
              ))}
            </div>
          </div>

          {/* Muhurat info (if pre-filled from Muhurat Finder) */}
          {prefill?.choghadiya && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
              <p className="text-[10px] font-black uppercase text-indigo-400 mb-1">Vedic Timing (from Muhurat Finder)</p>
              <p className="text-sm font-bold text-indigo-700">
                {prefill.muhurat_grade === "god" ? "🏆" : prefill.muhurat_grade === "diamond" ? "💎" : "🥇"} {prefill.choghadiya} Choghadiya
              </p>
            </div>
          )}

          {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{err}</p>}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 space-y-2">
          <button onClick={handleSave} disabled={saving || !title.trim()}
            className="w-full py-3.5 rounded-xl font-black text-white text-sm disabled:opacity-50 transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
            {saving ? "Saving…" : "✓ Save Event"}
          </button>
          {/* Google Calendar button — always visible in modal */}
          {title.trim() && date && (
            <a href={gcUrl({ title, notes, event_date: date, start_time: start||undefined, end_time: end||undefined, choghadiya: prefill?.choghadiya })}
              target="_blank" rel="noopener noreferrer"
              className="w-full py-3 rounded-xl font-bold text-blue-700 text-sm border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
              📅 Also Add to Google Calendar
            </a>
          )}
          <button onClick={onClose} className="w-full py-2.5 text-slate-400 text-sm font-semibold hover:text-slate-600">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Month Grid ───────────────────────────────────────────────────────────────
function MonthGrid({ year, month, events, onDayClick, onEventClick }: {
  year: number; month: number; events: CalEvent[];
  onDayClick: (d: string) => void; onEventClick: (e: CalEvent) => void;
}) {
  const today    = toDateStr(new Date());
  const firstDay = new Date(year, month, 1).getDay();
  const daysInM  = new Date(year, month+1, 0).getDate();
  const cells    = [...Array(firstDay).fill(null), ...Array.from({length:daysInM},(_,i)=>i+1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const evMap: Record<string,CalEvent[]> = {};
  events.forEach(e => { (evMap[e.event_date]||=[]).push(e); });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
        {DAYS.map(d => <div key={d} className="py-2 text-center text-[10px] font-black uppercase text-slate-400">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const ds   = day ? `${year}-${pad2(month+1)}-${pad2(day)}` : "";
          const evs  = ds ? (evMap[ds]||[]) : [];
          const isToday = ds === today;
          return (
            <div key={i} onClick={() => day && onDayClick(ds)}
              className={`min-h-[80px] p-1.5 border-r border-b border-slate-50 cursor-pointer transition-colors ${day?"hover:bg-indigo-50/40":"bg-slate-50/60"} ${isToday?"bg-indigo-50":""}`}>
              {day && (
                <>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mb-1 ${isToday?"bg-indigo-600 text-white":"text-slate-700"}`}>
                    {day}
                  </div>
                  {evs.slice(0,3).map(ev => (
                    <div key={ev.id} onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded mb-0.5 truncate text-white leading-tight cursor-pointer hover:opacity-80"
                      style={{ background: ev.color }}>
                      {ev.muhurat_grade==="god"?"🏆":ev.muhurat_grade==="diamond"?"💎":ev.muhurat_grade==="gold"?"🥇":""}{ev.title}
                    </div>
                  ))}
                  {evs.length > 3 && <p className="text-[9px] text-slate-400 pl-1">+{evs.length-3} more</p>}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Event Detail Card ────────────────────────────────────────────────────────
function EventCard({ ev, onClose, onDelete }: { ev: CalEvent; onClose: () => void; onDelete: () => void; }) {
  const [deleted, setDeleted] = useState(false);
  function handleDelete() { setDeleted(true); setTimeout(onDelete, 300); }

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity: deleted?0:1, y:0 }} exit={{ opacity:0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: ev.color }} />
        <div className="flex-1">
          <h4 className="font-black text-slate-900 text-base leading-tight">{ev.title}</h4>
          <p className="text-sm text-slate-500 mt-0.5">
            {new Date(ev.event_date+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short",month:"short",day:"numeric"})}
            {ev.start_time && ` · ${fmt12(ev.start_time)}${ev.end_time?` – ${fmt12(ev.end_time)}`:""}`}
          </p>
          {ev.event_type && ev.event_type !== "general" && (
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-1 inline-block">{ev.event_type}</span>
          )}
        </div>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-500 text-xl leading-none flex-shrink-0">×</button>
      </div>

      {ev.notes && <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5 leading-relaxed">{ev.notes}</p>}

      {ev.choghadiya && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
          <span className="text-amber-600 font-black text-xs">✦ Muhurat</span>
          <span className="text-amber-800 font-semibold text-sm">{ev.choghadiya} Choghadiya</span>
          {ev.muhurat_grade && <span className="ml-auto">{ev.muhurat_grade==="god"?"🏆":ev.muhurat_grade==="diamond"?"💎":"🥇"}</span>}
        </div>
      )}

      {/* Action buttons — large and clear */}
      <div className="space-y-2 pt-1">
        <a href={gcUrl(ev)} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors">
          📅 Add to Google Calendar
        </a>
        <button onClick={() => downloadICS([{ title:ev.title, date:ev.event_date, startTime:ev.start_time, endTime:ev.end_time, description:ev.notes }])}
          className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors">
          ⬇ Download ICS (Apple / Outlook)
        </button>
        <button onClick={handleDelete}
          className="flex items-center justify-center gap-2 w-full py-2.5 text-red-500 font-semibold text-sm rounded-xl hover:bg-red-50 transition-colors">
          🗑 Delete Event
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────────────────
export default function PanchangCalendar({ profileId }: { profileId: string }) {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [events,    setEvents]    = useState<CalEvent[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [saveErr,   setSaveErr]   = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState(toDateStr(now));
  const [prefill,   setPrefill]   = useState<Partial<CalEvent>|undefined>();
  const [selected,  setSelected]  = useState<CalEvent|null>(null);
  const [saved,     setSaved]     = useState(false); // success flash

  const loadEvents = useCallback(async () => {
    setLoading(true); setSaveErr("");
    const from = `${year}-${pad2(month+1)}-01`;
    const to   = `${year}-${pad2(month+1)}-${new Date(year,month+1,0).getDate()}`;
    try {
      const res  = await fetch(`/api/calendar?from=${from}&to=${to}&profileId=${profileId}`);
      const data = await res.json();
      if (!res.ok) { setSaveErr(data.error || "Failed to load"); return; }
      setEvents(data.events || []);
    } catch { setSaveErr("Network error — check your connection"); }
    finally { setLoading(false); }
  }, [year, month, profileId]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  async function saveEvent(ev: Partial<CalEvent>) {
    const res  = await fetch("/api/calendar", {
      method: "POST", headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ ...ev, profile_id: profileId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Save failed");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    loadEvents();
  }

  async function deleteEvent(id: string) {
    await fetch(`/api/calendar?id=${id}`, { method:"DELETE" });
    setSelected(null);
    loadEvents();
  }

  function prevMonth() { if (month===0){setYear(y=>y-1);setMonth(11);}else setMonth(m=>m-1); }
  function nextMonth() { if (month===11){setYear(y=>y+1);setMonth(0);}else setMonth(m=>m+1); }

  return (
    <div className="space-y-4">

      {/* Top bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex items-center gap-3 flex-wrap">
        <button onClick={prevMonth} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 font-bold text-lg">‹</button>
        <span className="font-black text-slate-900 text-base min-w-[160px] text-center">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 font-bold text-lg">›</button>
        <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }}
          className="px-3 py-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50">
          Today
        </button>
        <span className="text-sm text-slate-400">{events.length} event{events.length!==1?"s":""}</span>
        {loading && <span className="text-xs text-slate-400 animate-pulse">Loading…</span>}

        {/* Primary CTA */}
        <button onClick={() => { setModalDate(toDateStr(now)); setPrefill(undefined); setShowModal(true); }}
          className="ml-auto px-5 py-2.5 rounded-xl text-sm font-black text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all"
          style={{ background:"linear-gradient(135deg,#4F46E5,#7C3AED)" }}>
          + Add Event / Task
        </button>
      </div>

      {/* Success flash */}
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            ✓ Event saved! It's now showing in your calendar.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {saveErr && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          ⚠️ {saveErr}
          {saveErr.includes("does not exist") && (
            <span className="block mt-1 text-xs font-medium">
              Run <code className="bg-red-100 px-1 rounded">create_calendar_events.sql</code> in your Supabase SQL Editor first.
            </span>
          )}
        </div>
      )}

      {/* Selected event detail */}
      <AnimatePresence>
        {selected && (
          <EventCard ev={selected} onClose={() => setSelected(null)} onDelete={() => deleteEvent(selected.id)} />
        )}
      </AnimatePresence>

      {/* Calendar grid */}
      <MonthGrid year={year} month={month} events={events}
        onDayClick={d => { setModalDate(d); setPrefill(undefined); setShowModal(true); }}
        onEventClick={e => setSelected(prev => prev?.id===e.id ? null : e)} />

      {/* Empty state */}
      {!loading && events.length === 0 && (
        <div className="text-center py-10 text-slate-400">
          <p className="text-3xl mb-2">📅</p>
          <p className="text-sm font-semibold">No events this month</p>
          <p className="text-xs mt-1">Click any day or "+ Add Event" to get started</p>
        </div>
      )}

      {/* Tip */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-[12px] text-blue-700 font-medium space-y-1">
        <p>💡 <strong>Tip:</strong> Click any event to see details and add it directly to Google Calendar or download as ICS.</p>
        <p>🔭 Use <strong>Muhurat Finder</strong> tab to find the best timings — then save them directly to this calendar.</p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <EventModal defaultDate={modalDate} prefill={prefill} onSave={saveEvent}
            onClose={() => { setShowModal(false); setPrefill(undefined); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
