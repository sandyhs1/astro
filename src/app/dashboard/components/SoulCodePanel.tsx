"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_LINES = [
  "Aligning Jaimini astrological algorithms...",
  "Calculating Atmakaraka and Amatyakaraka coordinates...",
  "Decoding physical and emotional biorhythms...",
  "Syncing lunar frequency matrices...",
  "Formulating your exact Soul Blueprint...",
  "Writing your brutal, legit Quantum Karma analysis...",
];

const KARAKA_LABEL: Record<string, { short: string; emoji: string; desc: string; color: string; text: string; border: string; bg: string }> = {
  Atmakaraka:    { short: "Soul Planet",       emoji: "✨", desc: "Your soul's mission. The single most powerful planet in your chart.", color: "text-violet-700", text: "text-violet-900", border: "border-violet-200", bg: "bg-violet-50" },
  Amatyakaraka:  { short: "Career Planet",     emoji: "💼", desc: "Defines your career path, authority, and the mentor who shapes you.", color: "text-blue-700",   text: "text-blue-900",   border: "border-blue-200",   bg: "bg-blue-50" },
  Bhratrikaraka: { short: "Sibling Planet",    emoji: "🤝", desc: "Your sibling energy, courage, short journeys, and co-workers.", color: "text-rose-700",    text: "text-rose-900",    border: "border-rose-200",    bg: "bg-rose-50" },
  Matrikaraka:   { short: "Mother Planet",     emoji: "🌙", desc: "Home, emotions, mother figure, and your inner security.", color: "text-indigo-700", text: "text-indigo-900", border: "border-indigo-200", bg: "bg-indigo-50" },
  Pitrikaraka:   { short: "Father Planet",     emoji: "☀️", desc: "Father figure, dharma, higher learning, and long journeys.", color: "text-amber-700",  text: "text-amber-900",  border: "border-amber-200",  bg: "bg-amber-50" },
  Putrakaraka:   { short: "Children Planet",   emoji: "🌱", desc: "Children, intelligence, past-life blessings, creative expression.", color: "text-emerald-700", text: "text-emerald-900",  border: "border-emerald-200",  bg: "bg-emerald-50" },
  Gnatikaraka:   { short: "Obstacle Planet",   emoji: "⚔️", desc: "Competitors, disease, enemies, and karmic blocks to overcome.", color: "text-red-700",   text: "text-red-900",   border: "border-red-200",   bg: "bg-red-50" },
  Darakaraka:    { short: "Partner Planet",    emoji: "💞", desc: "Spouse, business partner, and the energy of key relationships.", color: "text-pink-700",   text: "text-pink-900",   border: "border-pink-200",   bg: "bg-pink-50" },
};

const BIO_COLOR: Record<string, { bar: string; label: string }> = {
  physical:     { bar: "bg-red-500",    label: "Physical" },
  emotional:    { bar: "bg-violet-500", label: "Emotional" },
  intellectual: { bar: "bg-blue-500",   label: "Intellectual" },
  average:      { bar: "bg-emerald-500",label: "Overall" },
};

function PercentBar({ pct, colorClass }: { pct: number; colorClass: string }) {
  const abs = Math.abs(pct);
  const positive = pct >= 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] font-bold text-slate-700">{pct > 0 ? "+" : ""}{pct}%</span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${positive ? "text-emerald-600" : "text-rose-600"}`}>
          {positive ? "Rising ▲" : "Low ▼"}
        </span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass} ${!positive ? "opacity-60" : ""}`}
          style={{ width: `${abs}%` }}
        />
      </div>
    </div>
  );
}

interface SoulCodeReport {
  parsed: {
    karakasIntro: string;
    karakas: Array<{ name: string; planet: string; meaning: string; impact: string; significance: string }>;
    biorhythmIntro: string;
    biorhythmActionPlan: string;
    moonBird: string;
  };
  rawBiorhythm: {
    physical: { percent: number; trend: number };
    emotional: { percent: number; trend: number };
    intellectual: { percent: number; trend: number };
    average: { percent: number; trend: number };
  };
}

export default function SoulCodePanel({ profileId }: { profileId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [reportData, setReportData] = useState<SoulCodeReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingLine, setLoadingLine] = useState(0);
  const [tab, setTab] = useState<"karakas" | "biorhythm">("karakas");
  const [expandedKaraka, setExpandedKaraka] = useState<number | null>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "loading") {
      timerRef.current = setInterval(() => setLoadingLine((l) => (l + 1) % LOADING_LINES.length), 2500);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  useEffect(() => {
    if (!profileId) return;
    checkForSaved();
  }, [profileId]);

  async function checkForSaved() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/soul-code?profileId=${profileId}`);
      const data = await res.json();
      if (data.found && data.reportData) { setReportData(data.reportData); setStatus("done"); }
      else setStatus("idle");
    } catch { setStatus("idle"); }
  }

  async function generateReport() {
    setStatus("loading"); setErrorMsg(""); setLoadingLine(0);
    try {
      const res = await fetch("/api/soul-code", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId })
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Something went wrong."); setStatus("error"); return; }
      setReportData(data); setStatus("done");
    } catch { setErrorMsg("Network error. Please try again."); setStatus("error"); }
  }

  const parsed = reportData?.parsed;
  const bio = reportData?.rawBiorhythm;

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto w-full text-slate-800">
      {/* Header */}
      <div className="px-5 md:px-10 py-5 md:py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20 text-white">🧬</div>
          <div>
            <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-900">Soul Code</h2>
            <p className="text-[11px] md:text-xs text-slate-500 font-bold uppercase tracking-wide">Jaimini Blueprint · Personal Frequencies</p>
          </div>
        </div>
        {status === "done" && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 self-start sm:self-auto">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">Live</span>
          </div>
        )}
      </div>

      {/* IDLE */}
      {status === "idle" && (
        <div className="flex flex-col items-center justify-center flex-1 p-6 md:p-8 text-center min-h-[60vh]">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-xl bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200">🧬</div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">Decode Your Soul Blueprint</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-md font-medium">
            Your Jaimini Karakas reveal your exact soul contracts — who you're meant to become, what you're here to build, and what karmic patterns are running your life on autopilot.
          </p>
          <button onClick={generateReport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-black shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 w-full md:w-auto">
            Generate Soul Blueprint
          </button>
        </div>
      )}

      {/* LOADING */}
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center flex-1 p-6 md:p-8 min-h-[60vh]">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">🧬</div>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 text-center">Live Computation Running</h3>
          <p className="text-indigo-600 text-sm font-black text-center max-w-sm h-10">{LOADING_LINES[loadingLine]}</p>
        </div>
      )}

      {/* ERROR */}
      {status === "error" && (
        <div className="flex flex-col items-center justify-center flex-1 p-6 md:p-8 text-center min-h-[60vh]">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Generation Failed</h3>
          <p className="text-slate-600 text-sm mb-6 font-medium">{errorMsg}</p>
          <button onClick={generateReport} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold w-full md:w-auto">Try Again</button>
        </div>
      )}

      {/* DONE */}
      {status === "done" && parsed && (
        <div className="flex-1 w-full">
          {/* Tab Switcher */}
          <div className="px-4 md:px-10 pt-6 md:pt-8 pb-0 flex gap-2 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setTab("karakas")}
              className={`px-5 py-3 rounded-xl font-black text-sm transition-all border whitespace-nowrap flex-1 md:flex-none text-center ${
                tab === "karakas"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300"
              }`}
            >
              ✨ Your Karakas
            </button>
            <button
              onClick={() => setTab("biorhythm")}
              className={`px-5 py-3 rounded-xl font-black text-sm transition-all border whitespace-nowrap flex-1 md:flex-none text-center ${
                tab === "biorhythm"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:border-emerald-300"
              }`}
            >
              ⚡ Your Frequency
            </button>
          </div>

          {/* KARAKAS TAB (Accordion Style) */}
          {tab === "karakas" && (
            <div className="px-4 md:px-10 py-6 md:py-8 space-y-6">
              <div className="mb-6">
                <p className="text-slate-600 text-[15px] md:text-base leading-relaxed font-medium max-w-3xl">{parsed.karakasIntro}</p>
              </div>

              <div className="space-y-3">
                {parsed.karakas.map((k, i) => {
                  const meta = KARAKA_LABEL[k.name] ?? { short: "Soul Indicator", emoji: "🪐", desc: k.meaning, color: "text-slate-700", text: "text-slate-900", border: "border-slate-200", bg: "bg-slate-50" };
                  const isExpanded = expandedKaraka === i;

                  return (
                    <div key={i} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? `${meta.border} shadow-md` : "border-slate-200 hover:border-slate-300 bg-white"}`}>
                      {/* Accordion Header */}
                      <button 
                        onClick={() => setExpandedKaraka(isExpanded ? null : i)}
                        className={`w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors ${isExpanded ? meta.bg : "bg-white"}`}
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="text-2xl md:text-3xl bg-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm border border-slate-100 flex-shrink-0">
                            {meta.emoji}
                          </div>
                          <div>
                            <div className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${meta.color} mb-0.5`}>{meta.short}</div>
                            <div className="flex items-center gap-2">
                              <h3 className={`text-base md:text-xl font-black ${meta.text}`}>{k.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full border ${meta.border} bg-white text-[10px] md:text-xs font-black ${meta.color} hidden sm:inline-block`}>
                                {k.planet}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className={`px-2 py-0.5 rounded-full border ${meta.border} bg-white text-[10px] font-black ${meta.color} sm:hidden`}>
                              {k.planet}
                            </span>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? "bg-white/50 rotate-180" : "bg-slate-100"}`}>
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={meta.color}><polyline points="6 9 12 15 18 9"></polyline></svg>
                           </div>
                        </div>
                      </button>

                      {/* Accordion Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={`p-4 md:p-6 pt-0 ${meta.bg} border-t border-white/50`}>
                              <div className="mt-4 space-y-5">
                                <div>
                                  <div className={`text-[10px] font-black uppercase tracking-widest ${meta.color} opacity-80 mb-1.5`}>Cosmic Role</div>
                                  <p className="text-slate-700 text-sm md:text-[15px] font-medium leading-relaxed">{meta.desc}</p>
                                </div>
                                
                                <div className="bg-white/60 p-4 rounded-xl border border-white/50">
                                  <div className={`text-[10px] font-black uppercase tracking-widest ${meta.color} mb-2`}>Your Impact</div>
                                  <p className={`text-sm md:text-[15px] leading-relaxed font-bold ${meta.text}`}>{k.impact}</p>
                                </div>

                                <div>
                                  <div className={`text-[10px] font-black uppercase tracking-widest ${meta.color} opacity-80 mb-1.5`}>What You Must Do</div>
                                  <div className="flex gap-3 items-start">
                                    <div className={`mt-1 w-1.5 h-1.5 rounded-full ${meta.bg} border border-${meta.color.split('-')[1]}-400 flex-shrink-0`} />
                                    <p className="text-slate-700 text-sm md:text-[15px] font-medium leading-relaxed">{k.significance}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BIORHYTHM TAB */}
          {tab === "biorhythm" && bio && (
            <div className="px-4 md:px-10 py-6 md:py-8 space-y-8 md:space-y-10">
              {/* Intro */}
              <div>
                <p className="text-slate-600 text-[15px] md:text-base leading-relaxed font-medium max-w-3xl">{parsed.biorhythmIntro}</p>
              </div>

              {/* Energy Meters */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-8">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-6">Current Energy Levels</h3>
                <div className="space-y-6">
                  {(["physical", "emotional", "intellectual", "average"] as const).map((key) => {
                    const val = bio[key];
                    const meta = BIO_COLOR[key];
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-slate-800">{meta.label}</span>
                          <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${val.percent >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                            {val.percent > 0 ? "+" : ""}{val.percent}%
                          </span>
                        </div>
                        <PercentBar pct={val.percent} colorClass={meta.bar} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Moon Bird */}
              {parsed.moonBird && (
                <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-4xl bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm border border-amber-100 flex-shrink-0">🦅</div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Pancha Pakshi · Lunar Bird</div>
                      <div className="text-2xl md:text-3xl font-black text-amber-900">{parsed.moonBird}</div>
                    </div>
                  </div>
                  <p className="text-amber-800/80 text-sm font-medium leading-relaxed mt-4 max-w-2xl">
                    Your lunar energy cycles are governed by your birth bird. It defines your peak activity windows and optimal rest cycles throughout each day. Aligning with your bird's frequency minimizes friction in daily life.
                  </p>
                </div>
              )}

              {/* Action Plan */}
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-4">Your Frequency Action Plan</h3>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 md:p-8">
                  <p className="text-slate-700 text-[15px] md:text-base font-medium leading-[1.8] whitespace-pre-line">{parsed.biorhythmActionPlan}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
