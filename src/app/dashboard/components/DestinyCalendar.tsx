"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TabBtn } from "./PanchangUtils";
import { PAL, GRADE, type GradeKey } from "./destiny-theme";
import PanchangToday      from "./PanchangToday";
import PanchangChoghadiya from "./PanchangChoghadiya";
import PanchangHoras      from "./PanchangHoras";
import PanchangMuhurat    from "./PanchangMuhurat";
import PanchangCalendar   from "./PanchangCalendar";
import DashaLifePlanner   from "./DashaLifePlanner";
import ScoreHistory       from "./ScoreHistory";
import PlanetaryTransits  from "./PlanetaryTransits";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface DayData {
  dateStr: string; score: number;
  grade: GradeKey;
  color: string;
  factors: string[];
  dominantPlanet: string;
}
type Tab = "today" | "choghadiya" | "horas" | "muhurat" | "calendar" | "dasha" | "transits" | "history" | "month";

/* Tithi short text (preserved from previous version) */
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

export default function DestinyCalendar({ profileId, profileName }: { profileId: string; profileName: string }) {
  const [tab, setTab] = useState<Tab>("today");

  // Panchang state
  const [panchang, setPanchang]   = useState<any>(null);
  const [score, setScore]         = useState(0);
  const [location, setLocation]   = useState("");
  const [pLoading, setPLoading]   = useState(true);
  const [pError, setPError]       = useState("");

  // 30-day calendar state
  const [days, setDays]           = useState<DayData[]>([]);
  const [narrative, setNarrative] = useState("");
  const [meta, setMeta]           = useState<any>(null);
  const [calLoading, setCalLoading] = useState(false);
  const [calError, setCalError]   = useState("");
  const [generated, setGenerated] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [genMonth, setGenMonth]   = useState<string | null>(null);
  const currentMonth = new Date().toLocaleString("en-IN", { month: "long", year: "numeric" });

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
      if (data.panchang) setDayPanchang(data.panchang);
    } catch (e) {
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
  const getAyana = (month: number) => (month >= 0 && month <= 5) ? "Uttarayana" : "Dakshinayana";

  // Load panchang
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
      })
      .catch(() => {});
  }, [profileId]);

  async function generateCalendar(forceNew = false) {
    setCalLoading(true); setCalError("");
    try {
      const res = await fetch("/api/destiny-calendar", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, forceNew }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDays(data.days); setNarrative(data.narrative);
      setMeta({ moonSign: data.moonSign, mahadasha: data.mahadasha, antardasha: data.antardasha });
      setGenMonth(currentMonth); setGenerated(true);
    } catch (e: any) { setCalError(e.message); }
    finally { setCalLoading(false); }
  }

  const ScoreBar = ({ score: s, color }: { score: number; color: string }) => (
    <div className="w-full h-1 rounded-full overflow-hidden mt-1.5" style={{ background: PAL.border2 }}>
      <div className="h-full rounded-full" style={{ width: `${s * 10}%`, backgroundColor: color }} />
    </div>
  );

  return (
    <div className="flex flex-col" style={{ background: PAL.paper, color: PAL.ink }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-4 md:px-6 lg:px-7 pt-4 md:pt-5 pb-0"
        style={{ background: PAL.paper, borderBottom: `1px solid ${PAL.border2}` }}
      >
        <div className="flex items-baseline gap-3 flex-wrap mb-3">
          <span className="serif-display italic text-[18px] md:text-[22px]" style={{ color: PAL.accent }}>🗓</span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
              Destiny window
            </p>
            <h2 className="serif-display text-[20px] md:text-[24px] font-semibold leading-none tracking-tight mt-1" style={{ color: PAL.ink }}>
              Vedic Panchang & timing
            </h2>
            <p className="serif-text text-[12.5px] italic mt-1" style={{ color: PAL.ink2 }}>
              For {profileName}
            </p>
          </div>
          {location && (
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
              style={{ color: PAL.ink2, background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
            >
              📍 {location.split(",")[0]}
            </span>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3">
          <TabBtn active={tab === "today"}      onClick={() => setTab("today")}      emoji="◴" label="Today" />
          <TabBtn active={tab === "choghadiya"} onClick={() => setTab("choghadiya")} emoji="◷" label="Choghadiya" />
          <TabBtn active={tab === "horas"}      onClick={() => setTab("horas")}      emoji="◔" label="Horas" />
          <TabBtn active={tab === "muhurat"}    onClick={() => setTab("muhurat")}    emoji="❖" label="Muhurat finder" />
          <TabBtn active={tab === "calendar"}   onClick={() => setTab("calendar")}   emoji="❑" label="My calendar" />
          <TabBtn active={tab === "dasha"}      onClick={() => setTab("dasha")}      emoji="◐" label="Dasha planner" />
          <TabBtn active={tab === "transits"}   onClick={() => setTab("transits")}   emoji="◉" label="Live transits" />
          <TabBtn active={tab === "history"}    onClick={() => setTab("history")}    emoji="❑" label="Score history" />
          <TabBtn active={tab === "month"}      onClick={() => setTab("month")}      emoji="◇" label="30-day map" />
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div data-lenis-prevent className="overflow-y-auto custom-scroll-light">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-7 py-5 md:py-7">

          {/* Loading / error */}
          {pLoading && tab !== "month" && tab !== "muhurat" && tab !== "calendar" && tab !== "dasha" && tab !== "transits" && tab !== "history" && (
            <div className="flex items-center justify-center py-16 gap-3" style={{ color: PAL.ink3 }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent }} />
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.15s" }} />
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.3s" }} />
              <span className="serif-text text-[14px] italic">Loading today's Panchang…</span>
            </div>
          )}
          {pError && tab !== "month" && tab !== "muhurat" && (
            <div
              className="rounded-sm px-4 py-3 serif-text text-[13.5px]"
              style={{ background: PAL.roseBg, color: PAL.rose, border: `1px solid #E5BFC1` }}
            >
              {pError}
            </div>
          )}

          {tab === "today" && !pLoading && !pError && panchang && (
            <PanchangToday panchang={panchang} score={score} location={location} />
          )}
          {tab === "choghadiya" && !pLoading && !pError && panchang && (
            <PanchangChoghadiya dayChoghadiya={panchang.dayChoghadiya} nightChoghadiya={panchang.nightChoghadiya} />
          )}
          {tab === "horas" && !pLoading && !pError && panchang && (
            <PanchangHoras horas={panchang.horas} />
          )}
          {tab === "muhurat"  && <PanchangMuhurat profileId={profileId} />}
          {tab === "calendar" && <PanchangCalendar profileId={profileId} />}
          {tab === "dasha"    && <DashaLifePlanner profileId={profileId} />}
          {tab === "transits" && <PlanetaryTransits profileId={profileId} />}
          {tab === "history"  && <ScoreHistory profileId={profileId} />}

          {/* ── 30-Day Map ─────────────────────────────────────── */}
          {tab === "month" && (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: PAL.accent }}>
                    30-day destiny map
                  </p>
                  <h3 className="serif-display text-[22px] md:text-[26px] font-semibold tracking-tight leading-none" style={{ color: PAL.ink }}>
                    Your auspicious 30-day window
                  </h3>
                  {meta && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
                        style={{ color: PAL.accent, background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
                      >
                        Moon · {meta.moonSign}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
                        style={{ color: "#5A3A8F", background: "#ECE6F4", border: `1px solid #D2C4E5` }}
                      >
                        MD · {meta.mahadasha}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
                        style={{ color: PAL.ink2, background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
                      >
                        AD · {meta.antardasha}
                      </span>
                    </div>
                  )}
                </div>
                {!generated ? (
                  <button
                    onClick={() => generateCalendar()}
                    disabled={calLoading}
                    className="serif-text text-[13px] font-semibold px-4 py-2.5 rounded-sm text-white disabled:opacity-50 transition-opacity hover:opacity-90"
                    style={{ background: PAL.accent }}
                  >
                    {calLoading ? "Computing…" : "Generate · 3 credits"}
                  </button>
                ) : (
                  <button
                    onClick={() => generateCalendar(true)}
                    disabled={calLoading}
                    className="serif-text text-[12px] font-semibold px-3.5 py-2 rounded-sm transition-colors hover:bg-black/[0.04]"
                    style={{ color: PAL.ink2, background: "transparent", border: `1px solid ${PAL.border}` }}
                  >
                    {calLoading ? "Refreshing…" : "↻ New month · 3 credits"}
                  </button>
                )}
              </div>

              {calError && (
                <p className="serif-text text-[13px] rounded-sm px-3.5 py-2"
                  style={{ background: PAL.roseBg, color: PAL.rose, border: `1px solid #E5BFC1` }}
                >
                  {calError}
                </p>
              )}

              {!generated && !calLoading && (
                <div
                  className="rounded-sm py-14 text-center"
                  style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
                >
                  <p className="serif-display italic text-[20px]" style={{ color: PAL.ink2 }}>
                    Map your best 30 days.
                  </p>
                  <p className="serif-text text-[13.5px] mt-1.5 max-w-md mx-auto" style={{ color: PAL.ink3 }}>
                    Discover your most auspicious dates based on your natal chart, Chandra transits, and active Dasha.
                  </p>
                </div>
              )}

              {/* Grid */}
              {generated && days.length > 0 && (
                <>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
                    {days.map((day, idx) => {
                      const grade = GRADE[day.grade];
                      const isSelected = selectedDay?.dateStr === day.dateStr;
                      return (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.015 }}
                          onClick={() => handleSelectDay(day)}
                          className="relative p-2.5 rounded-sm text-left transition-all hover:shadow-md"
                          style={{
                            background: grade.bg,
                            border: `1px solid ${isSelected ? PAL.ink : PAL.border2}`,
                            transform: isSelected ? "scale(1.04)" : "scale(1)",
                          }}
                        >
                          <p className="serif-text text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>
                            {day.dateStr.split(",")[0]}
                          </p>
                          <p className="serif-display text-[15px] font-semibold mt-0.5" style={{ color: PAL.ink }}>
                            {day.dateStr.split(",")[1]}
                          </p>
                          <ScoreBar score={day.score} color={grade.bar} />
                          <p className="serif-text text-[11px] font-semibold mt-1.5 tabular-nums" style={{ color: grade.ink }}>
                            {day.score} / 10
                          </p>
                          {day.grade === "excellent" && (
                            <div className="absolute top-1.5 right-1.5 text-[10px]" style={{ color: PAL.gold }}>★</div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {selectedDay && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-sm overflow-hidden mt-4"
                        style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
                      >
                        {/* Day header */}
                        <div className="p-5 md:p-6" style={{ borderBottom: `1px solid ${PAL.border2}` }}>
                          <h2 className="serif-display text-[24px] md:text-[28px] font-semibold tracking-tight leading-tight" style={{ color: PAL.ink }}>
                            {selectedDay.dateStr} {new Date().getFullYear()}
                          </h2>
                          {dayPLoading ? (
                            <div className="h-4 mt-2 rounded-sm w-1/2 animate-pulse" style={{ background: PAL.border2 }} />
                          ) : dayPanchang ? (
                            <p className="serif-text text-[13.5px] italic mt-1" style={{ color: PAL.ink2 }}>
                              {dayPanchang.tithi?.paksha} · {dayPanchang.tithi?.name}
                            </p>
                          ) : null}

                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-semibold tracking-tight"
                              style={{
                                color: GRADE[selectedDay.grade].ink,
                                background: GRADE[selectedDay.grade].bg,
                                border: `1px solid ${GRADE[selectedDay.grade].bar}`,
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: GRADE[selectedDay.grade].bar }} />
                              {selectedDay.score >= 70 ? "Auspicious" : selectedDay.score >= 40 ? "Neutral" : "Avoid"}
                            </span>
                            <span
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-sm tabular-nums"
                              style={{ color: PAL.ink2, background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
                            >
                              Score {selectedDay.score} / 10
                            </span>
                          </div>

                          {!dayPLoading && dayPanchang && dayPanchang.tithi && (
                            <div className="mt-4">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: PAL.accent }}>
                                Tithi significance
                              </p>
                              <p className="serif-text text-[14px] leading-relaxed" style={{ color: PAL.ink }}>
                                {TITHI_SIGNS[dayPanchang.tithi.number] || dayPanchang.tithi.name}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Factors */}
                        <div className="p-5 md:p-6" style={{ background: PAL.paper2, borderBottom: `1px solid ${PAL.border2}` }}>
                          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
                              Astrological factors
                            </p>
                            <span
                              className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
                              style={{ color: PAL.accent, background: PAL.paper, border: `1px solid ${PAL.border2}` }}
                            >
                              Dominant · {selectedDay.dominantPlanet}
                            </span>
                          </div>
                          <ul className="space-y-1.5">
                            {selectedDay.factors.map((f, i) => (
                              <li key={i} className="serif-text text-[13.5px] leading-relaxed flex items-start gap-2" style={{ color: PAL.ink2 }}>
                                <span className="flex-shrink-0 mt-0.5" style={{ color: PAL.accent }}>◆</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {dayPLoading && (
                          <div className="p-8 flex justify-center">
                            <div className="flex gap-2">
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent }} />
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.15s" }} />
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.3s" }} />
                            </div>
                          </div>
                        )}

                        {!dayPLoading && dayPanchang && (
                          <div className="p-5 md:p-6 space-y-5">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <DetailCell label="Nakshatra" value={dayPanchang.nakshatra} />
                              <DetailCell label="Sunrise"   value={formatTime(dayPanchang.sunTimes?.sunrise)} />
                              <DetailCell label="Sunset"    value={formatTime(dayPanchang.sunTimes?.sunset)} />
                              <DetailCell label="Yoga"      value={dayPanchang.yoga} />
                            </div>

                            <div
                              className="rounded-sm p-3 flex items-center justify-between gap-3 flex-wrap"
                              style={{ background: PAL.roseBg, border: `1px solid #E5BFC1` }}
                            >
                              <span className="serif-text text-[13.5px] font-semibold" style={{ color: PAL.rose }}>
                                ⚠︎ Rahu Kaal
                              </span>
                              <span className="serif-display text-[14px] font-semibold tabular-nums" style={{ color: PAL.rose }}>
                                {formatTime(dayPanchang.rahuKaal?.start)} – {formatTime(dayPanchang.rahuKaal?.end)}
                              </span>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.accent }}>
                                Cosmic context
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <DetailCell label="Paksha"    value={dayPanchang.tithi?.paksha?.replace(" Paksha", "")} />
                                <DetailCell label="Ritu"      value={getRitu(new Date(dayPanchang.sunTimes?.solarNoon || new Date()).getMonth())} />
                                <DetailCell label="Ayana"     value={getAyana(new Date(dayPanchang.sunTimes?.solarNoon || new Date()).getMonth())} />
                                <DetailCell label="Day lord"  value={dayPanchang.weekdayLord} />
                              </div>
                            </div>

                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.accent }}>
                                Muhurta windows
                              </p>
                              <div className="space-y-2">
                                <MuhurtaRow
                                  symbol="✦"
                                  label="Abhijit Muhurta"
                                  range={`${formatTime(dayPanchang.abhijit?.start)} – ${formatTime(dayPanchang.abhijit?.end)}`}
                                  tag="Auspicious"
                                  tone="sage"
                                />
                                <MuhurtaRow
                                  symbol="◇"
                                  label="Guli Kaal"
                                  range={`${formatTime(dayPanchang.gulikKaal?.start)} – ${formatTime(dayPanchang.gulikKaal?.end)}`}
                                  tag="Avoid"
                                  tone="gold"
                                />
                                <MuhurtaRow
                                  symbol="⚠︎"
                                  label="Yamaganda Kaal"
                                  range={`${formatTime(dayPanchang.yamaganda?.start)} – ${formatTime(dayPanchang.yamaganda?.end)}`}
                                  tag="Avoid"
                                  tone="rose"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {narrative && (
                    <article
                      className="rounded-sm p-5 md:p-7"
                      style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-9 h-9 rounded-sm grid place-items-center"
                          style={{ background: PAL.ink, color: PAL.paper }}
                        >
                          ✦
                        </span>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
                            Quantum Oracle
                          </p>
                          <p className="serif-display text-[15px] font-semibold leading-none mt-1" style={{ color: PAL.ink }}>
                            Vedic analysis
                          </p>
                        </div>
                      </div>
                      <div className="prose-editorial">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{narrative}</ReactMarkdown>
                      </div>
                    </article>
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

/* ── Local helpers ────────────────────────────────────────────────────────── */
function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-sm p-3 md:p-3.5"
      style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] leading-none" style={{ color: PAL.ink3 }}>
        {label}
      </p>
      <p className="serif-display text-[14px] md:text-[15px] font-semibold mt-1.5 leading-tight" style={{ color: PAL.ink }}>
        {value || "—"}
      </p>
    </div>
  );
}

function MuhurtaRow({ symbol, label, range, tag, tone }: {
  symbol: string; label: string; range: string; tag: string;
  tone: "sage" | "gold" | "rose";
}) {
  const tones = {
    sage: { bg: PAL.sageBg, border: "#C7D6BB", ink: PAL.sage },
    gold: { bg: PAL.amberBg, border: "#E1CE9B", ink: PAL.gold },
    rose: { bg: PAL.roseBg, border: "#E5BFC1", ink: PAL.rose },
  }[tone];
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-sm p-3 flex-wrap"
      style={{ background: tones.bg, border: `1px solid ${tones.border}` }}
    >
      <div>
        <p className="serif-display text-[14px] font-semibold flex items-center gap-1.5" style={{ color: tones.ink }}>
          <span>{symbol}</span> {label}
        </p>
        <p className="serif-text text-[12.5px] tabular-nums mt-0.5" style={{ color: tones.ink, opacity: 0.85 }}>
          {range}
        </p>
      </div>
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
        style={{ color: PAL.paper, background: tones.ink }}
      >
        {tag}
      </span>
    </div>
  );
}
