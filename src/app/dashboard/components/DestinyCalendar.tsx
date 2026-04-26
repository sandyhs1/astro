"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DayData {
  dateStr: string;
  score: number;
  grade: "excellent" | "good" | "neutral" | "caution" | "rest";
  color: string;
  factors: string[];
  dominantPlanet: string;
}

interface Props {
  profileId: string;
  profileName: string;
}

const GRADE_LABELS = {
  excellent: "🟢 Excellent — ACT",
  good:      "🟩 Good — Favorable",
  neutral:   "🟡 Neutral",
  caution:   "🟠 Caution",
  rest:      "🔴 Rest — Conserve",
};

const GRADE_BG = {
  excellent: "bg-emerald-50 border-emerald-200",
  good:      "bg-green-50 border-green-200",
  neutral:   "bg-amber-50 border-amber-200",
  caution:   "bg-orange-50 border-orange-200",
  rest:      "bg-red-50 border-red-200",
};

const GRADE_TEXT = {
  excellent: "text-emerald-700",
  good:      "text-green-700",
  neutral:   "text-amber-700",
  caution:   "text-orange-700",
  rest:      "text-red-600",
};

const SCORE_BG = {
  excellent: "#22c55e",
  good:      "#86efac",
  neutral:   "#fbbf24",
  caution:   "#f97316",
  rest:      "#ef4444",
};

export default function DestinyCalendar({ profileId, profileName }: Props) {
  const [days, setDays] = useState<DayData[]>([]);
  const [narrative, setNarrative] = useState("");
  const [meta, setMeta] = useState<{ moonSign: string; mahadasha: string; antardasha: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    async function checkSaved() {
      if (!profileId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/destiny-calendar?profileId=${profileId}`);
        const data = await res.json();
        if (data.found && data.reportData) {
          setDays(data.reportData.days || []);
          setNarrative(data.reportData.narrative || "");
          setMeta({
            moonSign: data.reportData.moonSign,
            mahadasha: data.reportData.mahadasha,
            antardasha: data.reportData.antardasha,
          });
          setGenerated(true);
        } else {
          setGenerated(false);
          setDays([]);
        }
      } catch (err) {
        console.error("Failed to check saved calendar", err);
      } finally {
        setLoading(false);
      }
    }
    checkSaved();
  }, [profileId]);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/destiny-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDays(data.days);
      setNarrative(data.narrative);
      setMeta({ moonSign: data.moonSign, mahadasha: data.mahadasha, antardasha: data.antardasha });
      setGenerated(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Score bar component
  const ScoreBar = ({ score, color }: { score: number; color: string }) => (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${score * 10}%`, backgroundColor: color }}
      />
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🗓️</span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Destiny Window</h2>
            </div>
            <p className="text-sm text-slate-500">30-day cosmic score calendar · {profileName}</p>
            {meta && (
              <div className="flex gap-4 mt-3">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">
                  Moon: {meta.moonSign}
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">
                  MD: {meta.mahadasha}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
                  AD: {meta.antardasha}
                </span>
              </div>
            )}
          </div>
          {!generated && (
            <button
              onClick={generate}
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
            >
              {loading ? "Computing..." : "Generate · 3 Credits"}
            </button>
          )}
          {generated && (
            <button
              onClick={generate}
              disabled={loading}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          )}
        </div>

        {/* Legend */}
        {generated && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-200">
            {(["excellent","good","neutral","caution","rest"] as const).map(g => (
              <div key={g} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCORE_BG[g] }} />
                <span className="text-slate-500 capitalize">{g}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !generated && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400">
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <p className="text-sm">Mapping the cosmic currents...</p>
        </div>
      )}

      {/* Idle State */}
      {!generated && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="text-6xl">🌌</div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Your 30-Day Destiny Map</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Discover which days to act boldly, rest deeply, or make life-changing decisions — based on your exact natal chart and current planetary transits.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400">
            <span className="px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">Chandra Transit Rules</span>
            <span className="px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">Antardasha Peaks</span>
            <span className="px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">Claude 4.6 Narrative</span>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      {generated && days.length > 0 && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {/* Calendar — 5 columns (6 rows of 5 = 30) */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {days.map((day, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => setSelectedDay(selectedDay?.dateStr === day.dateStr ? null : day)}
                className={`relative p-2 rounded-xl border-2 text-left transition-all hover:shadow-md
                  ${selectedDay?.dateStr === day.dateStr ? "ring-2 ring-indigo-400 scale-105" : ""}
                  ${GRADE_BG[day.grade]}`}
              >
                <p className="text-[10px] font-bold text-slate-500 leading-tight">{day.dateStr.split(",")[0]}</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">{day.dateStr.split(",")[1]}</p>
                <ScoreBar score={day.score} color={SCORE_BG[day.grade]} />
                <p className={`text-xs font-bold mt-1 ${GRADE_TEXT[day.grade]}`}>{day.score}/10</p>
                {day.grade === "excellent" && (
                  <div className="absolute top-1.5 right-1.5 text-[10px]">⭐</div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Selected Day Detail */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-2xl border-2 ${GRADE_BG[selectedDay.grade]}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className={`font-bold text-base ${GRADE_TEXT[selectedDay.grade]}`}>
                      {selectedDay.dateStr}
                    </h3>
                    <p className={`text-sm font-semibold ${GRADE_TEXT[selectedDay.grade]}`}>
                      {GRADE_LABELS[selectedDay.grade]} · Score: {selectedDay.score}/10
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Dominant</p>
                    <p className="text-sm font-bold text-slate-700">{selectedDay.dominantPlanet}</p>
                  </div>
                </div>
                {selectedDay.factors.length > 0 && (
                  <div className="space-y-1.5">
                    {selectedDay.factors.map((f, i) => (
                      <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-indigo-400 mt-0.5">◆</span>{f}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top 5 Peak Days summary */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              ⭐ Peak Action Days This Month
            </h3>
            <div className="space-y-2">
              {[...days]
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .sort((a, b) => days.indexOf(a) - days.indexOf(b))
                .map((day, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${GRADE_BG[day.grade]}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: SCORE_BG[day.grade] }}>
                    {day.score}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-800">{day.dateStr}</p>
                    <p className="text-xs text-slate-500">{day.factors[0] || day.dominantPlanet}</p>
                  </div>
                  <div className={`text-xs font-bold ${GRADE_TEXT[day.grade]}`}>
                    {day.grade === "excellent" ? "ACT" : "GOOD"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Oracle Narrative */}
          {narrative && (
            <div className="bg-gradient-to-b from-indigo-50 to-white border border-indigo-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-base">🔮</div>
                <div>
                  <p className="font-bold text-sm text-slate-800">Quantum Oracle</p>
                  <p className="text-xs text-slate-400">Claude 4.6 · Vedic Analysis</p>
                </div>
              </div>
              <div className="prose-chat-light text-slate-700 text-sm leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{narrative}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
