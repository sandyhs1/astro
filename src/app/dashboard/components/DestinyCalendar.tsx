"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TabBtn } from "./PanchangUtils";
import PanchangToday      from "./PanchangToday";
import PanchangChoghadiya from "./PanchangChoghadiya";
import PanchangHoras      from "./PanchangHoras";
import PanchangMuhurat    from "./PanchangMuhurat";
import PanchangCalendar   from "./PanchangCalendar";


// ─── Types ────────────────────────────────────────────────────────────────────
interface DayData { dateStr: string; score: number; grade: "excellent"|"good"|"neutral"|"caution"|"rest"; color: string; factors: string[]; dominantPlanet: string; }
type Tab = "today" | "choghadiya" | "horas" | "muhurat" | "month" | "calendar";


const GRADE_BG   = { excellent:"bg-emerald-50 border-emerald-200", good:"bg-green-50 border-green-200", neutral:"bg-amber-50 border-amber-200", caution:"bg-orange-50 border-orange-200", rest:"bg-red-50 border-red-200" };
const GRADE_TEXT = { excellent:"text-emerald-700", good:"text-green-700", neutral:"text-amber-700", caution:"text-orange-700", rest:"text-red-600" };
const SCORE_BG   = { excellent:"#22c55e", good:"#86efac", neutral:"#fbbf24", caution:"#f97316", rest:"#ef4444" };
const GRADE_LABELS = { excellent:"🟢 Excellent — ACT", good:"🟩 Good — Favorable", neutral:"🟡 Neutral", caution:"🟠 Caution", rest:"🔴 Rest — Conserve" };

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DestinyCalendar({ profileId, profileName }: { profileId: string; profileName: string }) {
  const [tab, setTab] = useState<Tab>("today");

  // Panchang state
  const [panchang, setPanchang]   = useState<any>(null);
  const [score, setScore]         = useState(0);
  const [location, setLocation]   = useState("");
  const [pLoading, setPLoading]   = useState(true);
  const [pError, setPError]       = useState("");

  // 30-day calendar state
  const [days, setDays]         = useState<DayData[]>([]);
  const [narrative, setNarrative] = useState("");
  const [meta, setMeta]           = useState<any>(null);
  const [calLoading, setCalLoading] = useState(false);
  const [calError, setCalError]   = useState("");
  const [generated, setGenerated] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [genMonth, setGenMonth]   = useState<string | null>(null);
  const currentMonth = new Date().toLocaleString("en-IN", { month:"long", year:"numeric" });

  // Load panchang on mount / profile change
  useEffect(() => {
    if (!profileId) return;
    setPLoading(true); setPError("");
    fetch(`/api/panchang?profileId=${profileId}`)
      .then(r => r.json())
      .then(d => {
        if (d.panchang) { setPanchang(d.panchang); setScore(d.score); setLocation(d.location || ""); }
        else setPError(d.error || "Failed to load Panchang");
      })
      .catch(() => setPError("Network error"))
      .finally(() => setPLoading(false));
  }, [profileId]);

  // Load saved 30-day calendar
  useEffect(() => {
    if (!profileId) return;
    fetch(`/api/destiny-calendar?profileId=${profileId}`)
      .then(r => r.json())
      .then(d => {
        if (d.found && d.reportData) {
          setDays(d.reportData.days || []);
          setNarrative(d.reportData.narrative || "");
          setMeta({ moonSign: d.reportData.moonSign, mahadasha: d.reportData.mahadasha, antardasha: d.reportData.antardasha });
          setGenMonth(d.reportData.generatedMonth || currentMonth);
          setGenerated(true);
        }
      }).catch(() => {});
  }, [profileId]);

  async function generateCalendar(forceNew = false) {
    setCalLoading(true); setCalError("");
    try {
      const res = await fetch("/api/destiny-calendar", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ profileId, forceNew }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDays(data.days); setNarrative(data.narrative);
      setMeta({ moonSign:data.moonSign, mahadasha:data.mahadasha, antardasha:data.antardasha });
      setGenMonth(currentMonth); setGenerated(true);
    } catch (e: any) { setCalError(e.message); }
    finally { setCalLoading(false); }
  }

  const ScoreBar = ({ score: s, color }: { score: number; color: string }) => (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
      <div className="h-full rounded-full" style={{ width:`${s*10}%`, backgroundColor:color }} />
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-slate-100 px-4 pt-3 pb-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🗓️</span>
          <div>
            <h2 className="font-black text-slate-900 text-base leading-tight">Destiny Window</h2>
            <p className="text-[11px] text-slate-400">Vedic Panchang & Good Timings · {profileName}</p>
          </div>
          {location && (
            <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1">
              📍 {location.split(",")[0]}
            </span>
          )}
        </div>

        {/* Tab bar — horizontally scrollable */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0">
          <TabBtn active={tab==="today"}      onClick={() => setTab("today")}      emoji="⏰" label="Today" />
          <TabBtn active={tab==="choghadiya"} onClick={() => setTab("choghadiya")} emoji="☀️" label="Choghadiya" />
          <TabBtn active={tab==="horas"}      onClick={() => setTab("horas")}      emoji="🕐" label="Horas" />
          <TabBtn active={tab==="muhurat"}    onClick={() => setTab("muhurat")}    emoji="🔭" label="Muhurat Finder" />
          <TabBtn active={tab==="calendar"}   onClick={() => setTab("calendar")}   emoji="📅" label="My Calendar" />
          <TabBtn active={tab==="month"}      onClick={() => setTab("month")}      emoji="📆" label="30-Day Map" />

        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-4 py-4">

          {/* Loading / Error */}
          {pLoading && tab !== "month" && tab !== "muhurat" && (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
              {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay:`${i*0.15}s` }} />)}
              <span className="text-sm">Loading today's Panchang…</span>
            </div>
          )}
          {pError && tab !== "month" && tab !== "muhurat" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{pError}</div>
          )}

          {/* TODAY */}
          {tab === "today" && !pLoading && !pError && panchang && (
            <PanchangToday panchang={panchang} score={score} location={location} />
          )}

          {/* CHOGHADIYA */}
          {tab === "choghadiya" && !pLoading && !pError && panchang && (
            <PanchangChoghadiya dayChoghadiya={panchang.dayChoghadiya} nightChoghadiya={panchang.nightChoghadiya} />
          )}

          {/* HORAS */}
          {tab === "horas" && !pLoading && !pError && panchang && (
            <PanchangHoras horas={panchang.horas} />
          )}

          {/* MUHURAT FINDER */}
          {tab === "muhurat" && <PanchangMuhurat profileId={profileId} />}

          {/* MY CALENDAR */}
          {tab === "calendar" && <PanchangCalendar profileId={profileId} />}

          {/* 30-DAY MAP */}
          {tab === "month" && (
            <div className="space-y-4">
              {/* Meta + Generate header */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-black text-slate-900 text-base">30-Day Destiny Map</h3>
                  {meta && (
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">Moon: {meta.moonSign}</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">MD: {meta.mahadasha}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">AD: {meta.antardasha}</span>
                    </div>
                  )}
                </div>
                {!generated ? (
                  <button onClick={() => generateCalendar()} disabled={calLoading}
                    className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200">
                    {calLoading ? "Computing…" : "Generate · 3 Credits"}
                  </button>
                ) : (
                  <button onClick={() => generateCalendar(true)} disabled={calLoading}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all">
                    {calLoading ? "Refreshing…" : "↻ New Month · 3 Credits"}
                  </button>
                )}
              </div>

              {calError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{calError}</div>}

              {!generated && !calLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="text-5xl">🌌</div>
                  <p className="text-slate-500 text-sm max-w-xs">Discover your best 30 days based on your natal chart, Chandra transits, and active Dasha.</p>
                </div>
              )}

              {/* Calendar grid */}
              {generated && days.length > 0 && (
                <>
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                    {days.map((day, idx) => (
                      <motion.button key={idx} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:idx*0.02 }}
                        onClick={() => setSelectedDay(selectedDay?.dateStr === day.dateStr ? null : day)}
                        className={`relative p-2 rounded-xl border-2 text-left transition-all hover:shadow-md ${selectedDay?.dateStr === day.dateStr ? "ring-2 ring-indigo-400 scale-105" : ""} ${GRADE_BG[day.grade]}`}>
                        <p className="text-[10px] font-bold text-slate-500 leading-tight">{day.dateStr.split(",")[0]}</p>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{day.dateStr.split(",")[1]}</p>
                        <ScoreBar score={day.score} color={SCORE_BG[day.grade]} />
                        <p className={`text-xs font-bold mt-1 ${GRADE_TEXT[day.grade]}`}>{day.score}/10</p>
                        {day.grade === "excellent" && <div className="absolute top-1.5 right-1.5 text-[10px]">⭐</div>}
                      </motion.button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {selectedDay && (
                      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                        className={`p-4 rounded-2xl border-2 ${GRADE_BG[selectedDay.grade]}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className={`font-bold text-base ${GRADE_TEXT[selectedDay.grade]}`}>{selectedDay.dateStr}</h3>
                            <p className={`text-sm font-semibold ${GRADE_TEXT[selectedDay.grade]}`}>{GRADE_LABELS[selectedDay.grade]} · Score: {selectedDay.score}/10</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Dominant</p>
                            <p className="text-sm font-bold text-slate-700">{selectedDay.dominantPlanet}</p>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {selectedDay.factors.map((f, i) => (
                            <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5"><span className="text-indigo-400 mt-0.5">◆</span>{f}</p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {narrative && (
                    <div className="bg-gradient-to-b from-indigo-50 to-white border border-indigo-100 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">🔮</div>
                        <div><p className="font-bold text-sm text-slate-800">Quantum Oracle</p><p className="text-xs text-slate-400">Vedic Analysis</p></div>
                      </div>
                      <div className="prose-chat-light text-slate-700 text-sm leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{narrative}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
