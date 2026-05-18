"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildGoogleCalendarUrl, downloadICS } from "@/lib/calendar-utils";
import { PAL } from "./destiny-theme";

interface CalEvent {
  id: string; title: string; event_type: string; event_date: string;
  start_time?: string; end_time?: string; choghadiya?: string;
  muhurat_grade?: string; notes?: string; color: string;
}

const EVENT_COLORS = [PAL.accent, "#5A8856", PAL.gold, PAL.ink, "#5A3A8F", "#8B3F66", "#1F4F7A", PAL.ink2];
const EVENT_TYPES  = ["General Task", "Meeting", "Business Launch", "Travel", "Health", "Finance", "Wedding", "Education", "Personal"];
const DAYS         = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS       = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function pad2(n: number) { return String(n).padStart(2, "0"); }
function toDateStr(d: Date) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function fmt12(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${pad2(m)} ${h < 12 ? "AM" : "PM"}`;
}
function gcUrl(ev: Partial<CalEvent>) {
  return buildGoogleCalendarUrl({
    title: ev.title || "Event",
    date: ev.event_date || toDateStr(new Date()),
    startTime: ev.start_time, endTime: ev.end_time,
    description: [ev.choghadiya && `Choghadiya: ${ev.choghadiya}`, ev.notes].filter(Boolean).join("\n"),
  });
}

/* ── Add / Edit Modal ──────────────────────────────────────────── */
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
  const [color,  setColor]  = useState(prefill?.color || PAL.accent);
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  async function handleSave() {
    if (!title.trim()) { setErr("Please add a title"); return; }
    setSaving(true); setErr("");
    try {
      await onSave({
        title: title.trim(), notes: notes.trim(),
        event_type: type, event_date: date,
        start_time: start || undefined, end_time: end || undefined,
        color, choghadiya: prefill?.choghadiya, muhurat_grade: prefill?.muhurat_grade,
      });
      onClose();
    } catch (e: any) { setErr(e.message || "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(14,26,51,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
        className="w-full max-w-md rounded-sm shadow-2xl overflow-hidden"
        style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${PAL.border2}`, background: PAL.paper2 }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
              {prefill?.id ? "Edit · existing event" : "New entry"}
            </p>
            <h3 className="serif-display text-[18px] font-semibold mt-0.5 leading-none" style={{ color: PAL.ink }}>
              {prefill?.id ? "Edit event" : "Add event / task"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-sm hover:bg-black/5"
            style={{ color: PAL.ink2 }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scroll-light">
          <Field label="Event / task title" required>
            <input
              autoFocus value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Sign business contract, doctor appointment…"
              className="w-full serif-text text-[15px] rounded-sm px-3.5 py-2.5 focus:outline-none transition-colors"
              style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
            />
          </Field>

          <Field label="Notes / description">
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Add details, reminders, or intentions…"
              className="w-full serif-text text-[14px] rounded-sm px-3.5 py-2.5 focus:outline-none resize-none transition-colors"
              style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
            />
          </Field>

          <Field label="Category">
            <div className="flex flex-wrap gap-1.5">
              {EVENT_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="serif-text text-[11.5px] font-semibold px-2.5 py-1 rounded-sm transition-colors"
                  style={
                    type === t
                      ? { background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }
                      : { background: "transparent", color: PAL.ink2, border: `1px solid ${PAL.border}` }
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-3 gap-2">
            <Field label="Date" required>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full serif-text text-[13.5px] rounded-sm px-3 py-2 focus:outline-none"
                style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
              />
            </Field>
            <Field label="Start">
              <input type="time" value={start} onChange={e => setStart(e.target.value)}
                className="w-full serif-text text-[13.5px] rounded-sm px-3 py-2 focus:outline-none"
                style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
              />
            </Field>
            <Field label="End">
              <input type="time" value={end} onChange={e => setEnd(e.target.value)}
                className="w-full serif-text text-[13.5px] rounded-sm px-3 py-2 focus:outline-none"
                style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
              />
            </Field>
          </div>

          <Field label="Color">
            <div className="flex gap-2.5">
              {EVENT_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-transform"
                  style={{
                    background: c,
                    border: color === c ? `2px solid ${PAL.ink}` : `1px solid ${PAL.border}`,
                    transform: color === c ? "scale(1.1)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </Field>

          {prefill?.choghadiya && (
            <div className="rounded-sm px-4 py-3"
              style={{ background: PAL.amberBg, border: `1px solid #E1CE9B` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.gold }}>
                Vedic timing · from Muhurat Finder
              </p>
              <p className="serif-display text-[15px] font-semibold mt-1" style={{ color: PAL.ink }}>
                {prefill.muhurat_grade === "god" ? "✦" : prefill.muhurat_grade === "diamond" ? "◆" : "✧"} {prefill.choghadiya} Choghadiya
              </p>
            </div>
          )}

          {err && (
            <p className="serif-text text-[13px] rounded-sm px-3.5 py-2"
              style={{ background: PAL.roseBg, color: PAL.rose, border: `1px solid #E5BFC1` }}
            >
              {err}
            </p>
          )}
        </div>

        <div className="px-5 pb-5 pt-2 space-y-2"
          style={{ borderTop: `1px solid ${PAL.border2}`, background: PAL.paper2 }}
        >
          <button
            onClick={handleSave} disabled={saving || !title.trim()}
            className="w-full py-3 rounded-sm serif-text text-[13.5px] font-semibold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ background: PAL.ink }}
          >
            {saving ? "Saving…" : "Save event"}
          </button>
          {title.trim() && date && (
            <a
              href={gcUrl({ title, notes, event_date: date, start_time: start || undefined, end_time: end || undefined, choghadiya: prefill?.choghadiya })}
              target="_blank" rel="noopener noreferrer"
              className="w-full py-2.5 rounded-sm serif-text text-[13px] font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              style={{ background: PAL.paper, color: "#1F4F7A", border: `1px solid #BCD0E1` }}
            >
              Also add to Google Calendar
            </a>
          )}
          <button
            onClick={onClose}
            className="w-full py-2 serif-text text-[12.5px] font-semibold transition-opacity hover:opacity-70"
            style={{ color: PAL.ink3 }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.22em] block mb-1.5" style={{ color: PAL.ink3 }}>
        {label} {required && <span style={{ color: PAL.accent }}>*</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Month Grid ───────────────────────────────────────────────── */
function MonthGrid({ year, month, events, onDayClick, onEventClick }: {
  year: number; month: number; events: CalEvent[];
  onDayClick: (d: string) => void; onEventClick: (e: CalEvent) => void;
}) {
  const today    = toDateStr(new Date());
  const firstDay = new Date(year, month, 1).getDay();
  const daysInM  = new Date(year, month + 1, 0).getDate();
  const cells    = [...Array(firstDay).fill(null), ...Array.from({ length: daysInM }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const evMap: Record<string, CalEvent[]> = {};
  events.forEach(e => { (evMap[e.event_date] ||= []).push(e); });

  return (
    <div className="rounded-sm overflow-hidden"
      style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
    >
      <div className="grid grid-cols-7" style={{ background: PAL.paper2, borderBottom: `1px solid ${PAL.border2}` }}>
        {DAYS.map(d => (
          <div
            key={d}
            className="py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: PAL.ink3 }}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const ds   = day ? `${year}-${pad2(month + 1)}-${pad2(day)}` : "";
          const evs  = ds ? (evMap[ds] || []) : [];
          const isToday = ds === today;
          return (
            <div
              key={i}
              onClick={() => day && onDayClick(ds)}
              className="min-h-[88px] md:min-h-[100px] p-1.5 cursor-pointer transition-colors"
              style={{
                borderRight: i % 7 !== 6 ? `1px solid ${PAL.border2}` : "none",
                borderBottom: `1px solid ${PAL.border2}`,
                background: !day ? "rgba(14,26,51,0.02)" : isToday ? PAL.amberBg : "transparent",
              }}
              onMouseEnter={(e) => { if (day && !isToday) (e.currentTarget as HTMLDivElement).style.background = "rgba(123,10,31,0.03)"; }}
              onMouseLeave={(e) => { if (day && !isToday) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              {day && (
                <>
                  <div
                    className="w-6 h-6 grid place-items-center serif-display text-[13px] font-semibold mb-1 leading-none"
                    style={{
                      background: isToday ? PAL.ink : "transparent",
                      color: isToday ? PAL.paper : PAL.ink,
                      borderRadius: "2px",
                    }}
                  >
                    {day}
                  </div>
                  {evs.slice(0, 3).map(ev => (
                    <div
                      key={ev.id}
                      onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                      className="serif-text text-[11px] font-semibold px-1.5 py-0.5 rounded-sm mb-0.5 truncate text-white leading-tight cursor-pointer transition-opacity hover:opacity-80"
                      style={{ background: ev.color }}
                    >
                      {ev.muhurat_grade === "god" ? "✦ " : ev.muhurat_grade === "diamond" ? "◆ " : ev.muhurat_grade === "gold" ? "✧ " : ""}
                      {ev.title}
                    </div>
                  ))}
                  {evs.length > 3 && (
                    <p className="serif-text text-[10px] pl-1.5" style={{ color: PAL.ink3 }}>
                      +{evs.length - 3} more
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Event detail card ─────────────────────────────────────────── */
function EventCard({ ev, onClose, onDelete }: { ev: CalEvent; onClose: () => void; onDelete: () => void }) {
  const [deleted, setDeleted] = useState(false);
  function handleDelete() { setDeleted(true); setTimeout(onDelete, 300); }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: deleted ? 0 : 1, y: 0 }} exit={{ opacity: 0 }}
      className="rounded-sm p-5 space-y-3"
      style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ background: ev.color }} />
        <div className="flex-1 min-w-0">
          <h4 className="serif-display text-[18px] md:text-[20px] font-semibold leading-tight tracking-tight" style={{ color: PAL.ink }}>
            {ev.title}
          </h4>
          <p className="serif-text text-[13px] mt-1" style={{ color: PAL.ink2 }}>
            {new Date(ev.event_date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
            {ev.start_time && ` · ${fmt12(ev.start_time)}${ev.end_time ? ` – ${fmt12(ev.end_time)}` : ""}`}
          </p>
          {ev.event_type && ev.event_type !== "general" && (
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm mt-2 inline-block"
              style={{ color: PAL.accent, background: PAL.paper2, border: `1px solid ${PAL.border}` }}
            >
              {ev.event_type}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[18px] leading-none flex-shrink-0 transition-opacity hover:opacity-70"
          style={{ color: PAL.ink3 }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {ev.notes && (
        <p
          className="serif-text text-[13px] leading-relaxed rounded-sm px-3.5 py-2.5"
          style={{ background: PAL.paper2, color: PAL.ink2, border: `1px solid ${PAL.border2}` }}
        >
          {ev.notes}
        </p>
      )}

      {ev.choghadiya && (
        <div className="flex items-center gap-2 rounded-sm px-3.5 py-2.5"
          style={{ background: PAL.amberBg, border: `1px solid #E1CE9B` }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.gold }}>
            Muhurat
          </span>
          <span className="serif-display text-[14px] font-semibold" style={{ color: PAL.ink }}>
            {ev.choghadiya} Choghadiya
          </span>
          {ev.muhurat_grade && (
            <span className="ml-auto" style={{ color: PAL.gold }}>
              {ev.muhurat_grade === "god" ? "✦" : ev.muhurat_grade === "diamond" ? "◆" : "✧"}
            </span>
          )}
        </div>
      )}

      <div className="space-y-2 pt-1">
        <a
          href={gcUrl(ev)} target="_blank" rel="noopener noreferrer"
          className="w-full py-2.5 rounded-sm serif-text text-[13px] font-semibold inline-flex items-center justify-center gap-2 text-white transition-opacity hover:opacity-90"
          style={{ background: PAL.ink }}
        >
          Add to Google Calendar
        </a>
        <button
          onClick={() => downloadICS([{ title: ev.title, date: ev.event_date, startTime: ev.start_time, endTime: ev.end_time, description: ev.notes }])}
          className="w-full py-2.5 rounded-sm serif-text text-[13px] font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          style={{ background: PAL.paper2, color: PAL.ink, border: `1px solid ${PAL.border}` }}
        >
          Download ICS · Apple / Outlook
        </button>
        <button
          onClick={handleDelete}
          className="w-full py-2.5 rounded-sm serif-text text-[13px] font-semibold inline-flex items-center justify-center gap-2 transition-colors hover:bg-black/[0.03]"
          style={{ color: PAL.rose }}
        >
          Delete event
        </button>
      </div>
    </motion.div>
  );
}

/* ── Main Calendar ─────────────────────────────────────────────── */
export default function PanchangCalendar({ profileId }: { profileId: string }) {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [events,    setEvents]    = useState<CalEvent[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [saveErr,   setSaveErr]   = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState(toDateStr(now));
  const [prefill,   setPrefill]   = useState<Partial<CalEvent> | undefined>();
  const [selected,  setSelected]  = useState<CalEvent | null>(null);
  const [saved,     setSaved]     = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true); setSaveErr("");
    const from = `${year}-${pad2(month + 1)}-01`;
    const to   = `${year}-${pad2(month + 1)}-${new Date(year, month + 1, 0).getDate()}`;
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
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...ev, profile_id: profileId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Save failed");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    loadEvents();
  }

  async function deleteEvent(id: string) {
    await fetch(`/api/calendar?id=${id}`, { method: "DELETE" });
    setSelected(null);
    loadEvents();
  }

  function prevMonth() { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); }
  function nextMonth() { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); }

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Top bar */}
      <div
        className="rounded-sm p-3 md:p-4 flex items-center gap-2 md:gap-3 flex-wrap"
        style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
      >
        <button
          onClick={prevMonth}
          className="w-9 h-9 grid place-items-center rounded-sm serif-display text-[16px] transition-colors hover:bg-black/5"
          style={{ color: PAL.ink, border: `1px solid ${PAL.border}` }}
          aria-label="Previous month"
        >‹</button>
        <span className="serif-display text-[16px] md:text-[18px] font-semibold min-w-[160px] text-center tracking-tight" style={{ color: PAL.ink }}>
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="w-9 h-9 grid place-items-center rounded-sm serif-display text-[16px] transition-colors hover:bg-black/5"
          style={{ color: PAL.ink, border: `1px solid ${PAL.border}` }}
          aria-label="Next month"
        >›</button>
        <button
          onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }}
          className="serif-text text-[12px] font-semibold px-3 py-1.5 rounded-sm transition-colors hover:bg-black/[0.04]"
          style={{ color: PAL.ink2, border: `1px solid ${PAL.border}` }}
        >
          Today
        </button>
        <span className="serif-text text-[13px] italic" style={{ color: PAL.ink3 }}>
          {events.length} event{events.length !== 1 ? "s" : ""}
        </span>
        {loading && (
          <span className="serif-text text-[11px] italic animate-pulse" style={{ color: PAL.ink3 }}>
            Loading…
          </span>
        )}
        <button
          onClick={() => { setModalDate(toDateStr(now)); setPrefill(undefined); setShowModal(true); }}
          className="ml-auto serif-text text-[13px] font-semibold px-4 py-2 rounded-sm text-white transition-opacity hover:opacity-90"
          style={{ background: PAL.accent }}
        >
          + Add event / task
        </button>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-sm px-4 py-3 serif-text text-[13.5px] font-semibold flex items-center gap-2"
            style={{ background: PAL.sageBg, color: PAL.sage, border: `1px solid #C7D6BB` }}
          >
            ✓ Event saved. It's now showing in your calendar.
          </motion.div>
        )}
      </AnimatePresence>

      {saveErr && (
        <div
          className="rounded-sm px-4 py-3 serif-text text-[13.5px]"
          style={{ background: PAL.roseBg, color: PAL.rose, border: `1px solid #E5BFC1` }}
        >
          ⚠︎ {saveErr}
          {saveErr.includes("does not exist") && (
            <span className="block mt-1 text-[12px] italic">
              Run <code style={{ background: "rgba(0,0,0,0.06)", padding: "0 4px", borderRadius: 2 }}>create_calendar_events.sql</code> in your Supabase SQL editor first.
            </span>
          )}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <EventCard ev={selected} onClose={() => setSelected(null)} onDelete={() => deleteEvent(selected.id)} />
        )}
      </AnimatePresence>

      <MonthGrid
        year={year} month={month} events={events}
        onDayClick={d => { setModalDate(d); setPrefill(undefined); setShowModal(true); }}
        onEventClick={e => setSelected(prev => prev?.id === e.id ? null : e)}
      />

      {!loading && events.length === 0 && (
        <div
          className="text-center py-10 rounded-sm"
          style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
        >
          <p className="serif-display italic text-[18px]" style={{ color: PAL.ink2 }}>No events this month.</p>
          <p className="serif-text text-[13px] mt-1" style={{ color: PAL.ink3 }}>
            Click any day or "+ Add event" to get started.
          </p>
        </div>
      )}

      <div
        className="rounded-sm px-4 py-3 serif-text text-[12.5px] space-y-1"
        style={{ background: PAL.paper2, color: PAL.ink2, border: `1px solid ${PAL.border2}` }}
      >
        <p>◆ <strong style={{ color: PAL.ink }}>Tip:</strong> Click any event to see details and add it directly to Google Calendar or download as ICS.</p>
        <p>❖ Use <strong style={{ color: PAL.ink }}>Muhurat Finder</strong> to scan for the best timings — then save them directly to this calendar.</p>
      </div>

      <AnimatePresence>
        {showModal && (
          <EventModal
            defaultDate={modalDate} prefill={prefill} onSave={saveEvent}
            onClose={() => { setShowModal(false); setPrefill(undefined); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
