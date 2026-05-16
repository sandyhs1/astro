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
import DashaLifePlanner   from "./DashaLifePlanner";
import ScoreHistory       from "./ScoreHistory";
import PlanetaryTransits  from "./PlanetaryTransits";



// ─── Types ────────────────────────────────────────────────────────────────────
interface DayData { dateStr: string; score: number; grade: "excellent"|"good"|"neutral"|"caution"|"rest"; color: string; factors: string[]; dominantPlanet: string; }
type Tab = "today" | "choghadiya" | "horas" | "muhurat" | "calendar" | "dasha" | "transits" | "history" | "month";




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

  const [dayPanchang, setDayPanchang] = useState<any>(null);
  const [dayPLoading, setDayPLoading] = useState(false);

  const handleSelectDay = async (day: DayData) => {
    if (selectedDay?.dateStr === day.dateStr) {
      setSelectedDay(null);
      return;
    }
    setSelectedDay(day);
    setDayPanchang(null);
    setDayPLoading(true);
    try {
      const year = new Date().getFullYear();
      const parts = day.dateStr.split(",");
      const monthDay = parts.length > 1 ? parts[1].trim() : day.dateStr;
      const dateString = `${monthDay} ${year}`;
      const res = await fetch(`/api/panchang?profileId=${profileId}&date=${encodeURIComponent(dateString)}`);
      const data = await res.json();
      if (data.panchang) {
        setDayPanchang(data.panchang);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setDayPLoading(false);
    }
  };

  const formatTime = (iso: string) => {
    if (!iso) return "--:--";
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const getRitu = (month: number) => {
    if (month >= 2 && month <= 3) return "Vasant (Spring)";
    if (month >= 4 && month <= 5) return "Grishma (Summer)";
    if (month >= 6 && month <= 7) return "Varsha (Monsoon)";
    if (month >= 8 && month <= 9) return "Sharad (Autumn)";
    if (month >= 10 && month <= 11) return "Hemant (Pre-Winter)";
    return "Shishir (Winter)";
  };

  const getAyana = (month: number) => {
    return (month >= 0 && month <= 5) ? "Uttarayana" : "Dakshinayana";
  };

  const TITHI_SIGNS: Record<number, string> = {
    1: "Pratipada — auspicious for new beginnings and ceremonies",
    2: "Dwitiya — favorable for laying foundations and building",
    3: "Tritiya — excellent for acquiring wealth and assets",
    4: "Chaturthi — avoid new ventures; favorable for clearing obstacles",
    5: "Panchami — auspicious for education, healing, and travel",
    6: "Shashthi — favorable for property matters and war/competition",
    7: "Saptami — auspicious for travel, vehicles, and health remedies",
    8: "Ashtami — avoid major decisions; good for spiritual practices",
    9: "Navami — favorable for overcoming enemies and aggressive action",
    10: "Dashami — highly auspicious for all important and spiritual work",
    11: "Ekadashi — spiritually potent; recommended for fasting and meditation",
    12: "Dwadashi — completion of Ekadashi fast; auspicious for charity",
    13: "Trayodashi — favorable for wealth, health, and overcoming obstacles",
    14: "Chaturdashi — intense energy; avoid worldly pursuits, focus on spirituality",
    15: "Purnima — full moon; extremely auspicious for all positive rituals",
    30: "Amavasya — dark moon; reserved for ancestral offerings and rest",
  };

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
          <TabBtn active={tab==="dasha"}      onClick={() => setTab("dasha")}      emoji="🧘" label="Dasha Planner" />
          <TabBtn active={tab==="transits"}   onClick={() => setTab("transits")}   emoji="🪐" label="Live Transits" />
          <TabBtn active={tab==="history"}    onClick={() => setTab("history")}    emoji="📊" label="Score History" />

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

          {/* DASHA LIFE PLANNER */}
          {tab === "dasha" && <DashaLifePlanner profileId={profileId} />}

          {/* PLANETARY TRANSITS */}
          {tab === "transits" && <PlanetaryTransits profileId={profileId} />}

          {/* SCORE HISTORY */}

          {tab === "history" && <ScoreHistory profileId={profileId} />}

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
                        onClick={() => handleSelectDay(day)}
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
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6 mb-4"
                      >
                        {/* Day Header */}
                        <div className="p-5 border-b border-slate-100">
                          <div className="flex flex-col gap-1.5 mb-4">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                              {selectedDay.dateStr} {new Date().getFullYear()}
                            </h2>
                            {dayPLoading ? (
                              <div className="h-4 bg-slate-100 animate-pulse rounded w-1/2"></div>
                            ) : dayPanchang ? (
                              <p className="text-sm font-medium text-slate-600">
                                {dayPanchang.tithi?.paksha} · {dayPanchang.tithi?.name}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${GRADE_BG[selectedDay.grade]}`}>
                              <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: SCORE_BG[selectedDay.grade] }}></span>
                              <span className={GRADE_TEXT[selectedDay.grade]}>{selectedDay.score >= 70 ? "Auspicious" : selectedDay.score >= 40 ? "Neutral" : "Avoid"}</span>
                            </span>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                              Score: {selectedDay.score}/10
                            </span>
                          </div>

                          {/* Tithi Significance */}
                          {!dayPLoading && dayPanchang && dayPanchang.tithi && (
                            <div className="mt-2">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <span>☁️</span> TITHI SIGNIFICANCE
                              </h4>
                              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                {TITHI_SIGNS[dayPanchang.tithi.number] || dayPanchang.tithi.name}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Factors List (from computeCalendar) */}
                        <div className="p-5 bg-slate-50 border-b border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <span>✨</span> ASTROLOGICAL FACTORS
                            </h4>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                              Dominant: {selectedDay.dominantPlanet}
                            </span>
                          </div>
                          <div className="space-y-1.5 mt-3">
                            {selectedDay.factors.map((f, i) => (
                              <p key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                <span className="text-indigo-400 mt-0.5">✦</span>
                                <span>{f}</span>
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Loading State for Panchang */}
                        {dayPLoading && (
                          <div className="p-8 flex justify-center">
                            <div className="flex gap-2">
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                            </div>
                          </div>
                        )}

                        {/* Rich Panchang Details */}
                        {!dayPLoading && dayPanchang && (
                          <div className="p-5">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                              {/* Cards */}
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold mb-1">Nakshatra</p>
                                <p className="text-sm font-bold text-slate-800">{dayPanchang.nakshatra}</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold mb-1 flex items-center gap-1"><span>☀️</span> Sunrise</p>
                                <p className="text-sm font-bold text-slate-800">{formatTime(dayPanchang.sunTimes?.sunrise)}</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold mb-1 flex items-center gap-1"><span>🌇</span> Sunset</p>
                                <p className="text-sm font-bold text-slate-800">{formatTime(dayPanchang.sunTimes?.sunset)}</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold mb-1">Yoga</p>
                                <p className="text-sm font-bold text-slate-800">{dayPanchang.yoga}</p>
                              </div>
                            </div>

                            <div className="mb-6">
                              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-red-500">⚠️</span>
                                  <span className="text-sm font-bold text-red-800">Rahu Kaal</span>
                                </div>
                                <span className="text-sm font-bold text-red-700">
                                  {formatTime(dayPanchang.rahuKaal?.start)} - {formatTime(dayPanchang.rahuKaal?.end)}
                                </span>
                              </div>
                            </div>

                            {/* Cosmic Context */}
                            <div className="mb-6">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                <span>🌌</span> TODAY'S COSMIC CONTEXT
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-50">
                                  <p className="text-[10px] text-slate-400 font-bold mb-1">Paksha</p>
                                  <p className="text-sm font-bold text-indigo-900">{dayPanchang.tithi?.paksha?.replace(" Paksha", "")}</p>
                                </div>
                                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-50">
                                  <p className="text-[10px] text-slate-400 font-bold mb-1">Ritu (Season)</p>
                                  <p className="text-sm font-bold text-indigo-900">{getRitu(new Date(dayPanchang.sunTimes?.solarNoon || new Date()).getMonth())}</p>
                                </div>
                                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-50">
                                  <p className="text-[10px] text-slate-400 font-bold mb-1">Ayana</p>
                                  <p className="text-sm font-bold text-indigo-900">{getAyana(new Date(dayPanchang.sunTimes?.solarNoon || new Date()).getMonth())}</p>
                                </div>
                                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-50">
                                  <p className="text-[10px] text-slate-400 font-bold mb-1">Day Lord</p>
                                  <p className="text-sm font-bold text-indigo-900">{dayPanchang.weekdayLord}</p>
                                </div>
                              </div>
                            </div>

                            {/* Muhurta Windows */}
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                <span>⏱️</span> MUHURTA WINDOWS
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                  <div>
                                    <p className="text-sm font-bold text-emerald-900 flex items-center gap-1"><span>✨</span> Abhijit Muhurta</p>
                                    <p className="text-sm font-bold text-emerald-700 mt-0.5">
                                      {formatTime(dayPanchang.abhijit?.start)} - {formatTime(dayPanchang.abhijit?.end)}
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full">Auspicious</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                                  <div>
                                    <p className="text-sm font-bold text-amber-900 flex items-center gap-1"><span>🔸</span> Guli Kaal</p>
                                    <p className="text-sm font-bold text-amber-700 mt-0.5">
                                      {formatTime(dayPanchang.gulikKaal?.start)} - {formatTime(dayPanchang.gulikKaal?.end)}
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-1 rounded-full">Avoid</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                                  <div>
                                    <p className="text-sm font-bold text-red-900 flex items-center gap-1"><span>🔴</span> Yamaganda Kaal</p>
                                    <p className="text-sm font-bold text-red-700 mt-0.5">
                                      {formatTime(dayPanchang.yamaganda?.start)} - {formatTime(dayPanchang.yamaganda?.end)}
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-bold bg-red-200 text-red-800 px-2 py-1 rounded-full">Avoid</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        )}
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
