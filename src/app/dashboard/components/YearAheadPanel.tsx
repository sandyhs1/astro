"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_LINES = [
  "Casting your Solar Return chart for the current year...",
  "Analyzing Muntha position and Varshphal planetary strengths...",
  "Scanning for active Yogas and hidden planetary combinations...",
  "Decoding the month-by-month cosmic blueprint...",
  "Synthesizing your precise actionable timeline...",
  "Writing your brutal, legit Quantum Karma analysis...",
];

interface Yoga {
  name: string;
  meaning: string;
}

interface MonthData {
  monthNumber: number;
  theme: string;
  keywords: string[];
  nuances: string;
  actionPlan: string;
  advice: string;
}

interface YearAheadReport {
  parsed: {
    intro: string;
    activeYogas: Yoga[];
    months: MonthData[];
  };
  metadata?: {
    birthMonth: number;
    varshaphalYear: number;
  };
}

function getMonthLabel(monthIndex: number, birthMonth?: number, startYear?: number) {
  if (!birthMonth || !startYear) return `Month ${monthIndex}`;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const targetMonthIndex = (birthMonth - 1 + (monthIndex - 1)) % 12;
  const yearOffset = Math.floor((birthMonth - 1 + (monthIndex - 1)) / 12);
  const targetYear = startYear + yearOffset;
  return `${monthNames[targetMonthIndex]} ${targetYear}`;
}

export default function YearAheadPanel({ profileId }: { profileId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [reportData, setReportData] = useState<YearAheadReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingLine, setLoadingLine] = useState(0);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (status === "loading") {
      timerRef.current = setInterval(() => {
        setLoadingLine((l) => (l + 1) % LOADING_LINES.length);
      }, 2500);
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
      const res = await fetch(`/api/year-ahead?profileId=${profileId}`);
      const data = await res.json();
      if (data.found && data.reportData?.parsed) {
        setReportData(data.reportData);
        setStatus("done");
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  }

  async function generateReport() {
    setStatus("loading");
    setErrorMsg("");
    setLoadingLine(0);
    try {
      const res = await fetch("/api/year-ahead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Something went wrong."); setStatus("error"); return; }
      setReportData(data);
      setStatus("done");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  const parsed = reportData?.parsed;

  return (
    <div data-lenis-prevent className="flex flex-col h-full bg-[#FAFAFA] overflow-y-auto w-full text-slate-800">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 md:px-10 py-5 md:py-6 sticky top-0 z-10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl shadow-lg shadow-orange-500/20 flex-shrink-0">📅</div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Year Ahead — {currentYear}</h2>
            <p className="text-[11px] md:text-xs text-slate-500 font-bold uppercase tracking-wide">Solar Return Yogas & Monthly Blueprint</p>
          </div>
        </div>
        {status === "done" && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 self-start sm:self-auto">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">Live Blueprint</span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        {status === "idle" && (
          <div className="flex flex-col items-center justify-center h-full p-6 md:p-8 text-center max-w-2xl mx-auto min-h-[60vh]">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-xl bg-gradient-to-br from-orange-100 to-amber-100 border border-amber-200">✨</div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">Decode Your Year</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 font-medium">
              We extract your exact Varshaphal (Solar Return) chart, active yogas, and monthly transitions to generate a brutal, accurate, and highly actionable blueprint for your entire year. No generic horoscopes.
            </p>
            <button onClick={generateReport} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-black shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 w-full md:w-auto">
              Generate Year Ahead Blueprint
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center h-full p-6 md:p-8 min-h-[60vh]">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">📅</div>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 text-center">Live Cosmic Computation</h3>
            <p className="text-amber-600 text-sm font-black text-center max-w-sm transition-all duration-300 h-10">
              {LOADING_LINES[loadingLine]}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center h-full p-6 md:p-8 text-center min-h-[60vh]">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Error Generating Report</h3>
            <p className="text-slate-600 text-sm mb-6 font-medium">{errorMsg}</p>
            <button onClick={generateReport} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold w-full md:w-auto">Try Again</button>
          </div>
        )}

        {status === "done" && parsed && (
          <div className="w-full px-4 md:px-10 lg:px-16 py-8 md:py-10 space-y-10">
            
            {/* Intro */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-50 rounded-bl-full opacity-50 pointer-events-none" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-amber-500 mb-3 relative z-10">Yearly Assessment</h3>
              <p className="text-slate-700 text-[15px] md:text-[17px] leading-relaxed font-medium relative z-10 max-w-4xl">
                {parsed.intro}
              </p>
            </div>

            {/* Yogas */}
            {parsed.activeYogas && parsed.activeYogas.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-sm">⚡</div>
                  <h3 className="text-xl font-black text-slate-900">Active Yogas</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parsed.activeYogas.map((yoga, i) => (
                    <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="text-lg font-black text-orange-600 mb-2">{yoga.name}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{yoga.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly Blueprint Grid */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm">🗓️</div>
                <h3 className="text-xl font-black text-slate-900">Monthly Blueprint</h3>
              </div>
              <p className="text-slate-500 text-sm mb-6 max-w-2xl">Your Solar Return (Varshaphal) chart begins precisely from your birth month this year. Here is your 12-month blueprint.</p>

              <div className="space-y-4">
                {parsed.months.map((m, i) => {
                  const isExpanded = activeMonth === i;
                  return (
                    <div key={i} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? "border-indigo-200 shadow-md bg-white" : "border-slate-200 hover:border-slate-300 bg-white"}`}>
                      {/* Month Header / Trigger */}
                      <button 
                        onClick={() => setActiveMonth(isExpanded ? null : i)}
                        className={`w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors ${isExpanded ? "bg-indigo-50/50" : ""}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0 border ${isExpanded ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-50 text-slate-700 border-slate-200"}`}>
                            {m.monthNumber}
                          </div>
                          <div>
                            <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                              {getMonthLabel(m.monthNumber, reportData?.metadata?.birthMonth, reportData?.metadata?.varshaphalYear)}
                            </div>
                            <h4 className={`text-base md:text-lg font-black ${isExpanded ? "text-indigo-900" : "text-slate-800"}`}>{m.theme}</h4>
                          </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 flex-shrink-0 ${isExpanded ? "bg-indigo-100 rotate-180" : "bg-slate-100"}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={isExpanded ? "text-indigo-600" : "text-slate-500"}><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </button>

                      {/* Month Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 md:p-6 pt-0 border-t border-slate-100">
                              
                              <div className="flex flex-wrap gap-2 mt-5 mb-6">
                                {m.keywords.map((kw, j) => (
                                  <span key={j} className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest">
                                    {kw}
                                  </span>
                                ))}
                              </div>

                              <div className="space-y-6">
                                <div>
                                  <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Nuances & Subtleties</div>
                                  <p className="text-slate-700 text-sm md:text-[15px] leading-relaxed">{m.nuances}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-1.5"><span className="text-sm">🎯</span> Action Plan</div>
                                    <p className="text-slate-700 text-sm leading-relaxed font-medium">{m.actionPlan}</p>
                                  </div>
                                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-1.5"><span className="text-sm">💡</span> Advice</div>
                                    <p className="text-slate-700 text-sm leading-relaxed font-medium">{m.advice}</p>
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

          </div>
        )}
      </div>
    </div>
  );
}
