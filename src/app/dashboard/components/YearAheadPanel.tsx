"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PAL } from "./destiny-theme";
import { FEATURE_CREDITS } from "@/lib/pricing/feature-credits";

const LOADING_LINES = [
  "Casting your Solar Return chart for the current year…",
  "Analyzing Muntha position and Varshphal planetary strengths…",
  "Scanning for active yogas and hidden planetary combinations…",
  "Decoding the month-by-month cosmic blueprint…",
  "Synthesising your precise actionable timeline…",
  "Writing your Quantum Karma analysis…",
];

interface Yoga { name: string; meaning: string; }
interface MonthData { monthNumber: number; theme: string; keywords: string[]; nuances: string; actionPlan: string; advice: string; }

interface YearAheadReport {
  parsed: { intro: string; activeYogas: Yoga[]; months: MonthData[] };
  metadata?: { birthMonth: number; varshaphalYear: number };
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
      timerRef.current = setInterval(() => setLoadingLine((l) => (l + 1) % LOADING_LINES.length), 2500);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  useEffect(() => { if (profileId) checkForSaved(); }, [profileId]);

  async function checkForSaved() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/year-ahead?profileId=${profileId}`);
      const data = await res.json();
      if (data.found && data.reportData?.parsed) { setReportData(data.reportData); setStatus("done"); }
      else setStatus("idle");
    } catch { setStatus("idle"); }
  }

  async function generateReport() {
    setStatus("loading"); setErrorMsg(""); setLoadingLine(0);
    try {
      const res = await fetch("/api/year-ahead", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Something went wrong."); setStatus("error"); return; }
      setReportData(data); setStatus("done");
    } catch { setErrorMsg("Network error. Please try again."); setStatus("error"); }
  }

  const parsed = reportData?.parsed;

  return (
    <div data-lenis-prevent className="flex flex-col w-full" style={{ background: PAL.paper, color: PAL.ink }}>
      {/* Header */}
      <div
        className="px-5 md:px-7 lg:px-9 py-4 md:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-10 backdrop-blur-md"
        style={{ background: "rgba(250,247,242,0.92)", borderBottom: `1px solid ${PAL.border2}` }}
      >
        <div className="flex items-baseline gap-3">
          <span className="serif-display italic text-[18px] md:text-[22px]" style={{ color: PAL.accent }}>📅</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
              Year ahead · {currentYear}
            </p>
            <h2 className="serif-display text-[18px] md:text-[22px] font-semibold leading-none tracking-tight mt-0.5" style={{ color: PAL.ink }}>
              Solar Return blueprint
            </h2>
          </div>
        </div>
        {status === "done" && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm self-start sm:self-auto"
            style={{ background: PAL.sageBg, border: `1px solid #C7D6BB` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: PAL.sage }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: PAL.sage }}>Live</span>
          </div>
        )}
      </div>

      <div className="flex-1 w-full">
        {/* IDLE */}
        {status === "idle" && (
          <div className="flex flex-col items-center justify-center px-6 py-14 md:py-20 text-center">
            <div
              className="w-24 h-24 rounded-sm grid place-items-center serif-display text-[40px] mb-7"
              style={{ background: PAL.amberBg, color: PAL.gold, border: `1px solid #E1CE9B` }}
            >
              ☼
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
              Begin · year ahead
            </p>
            <h3 className="serif-display text-[28px] md:text-[36px] font-semibold tracking-tight leading-tight" style={{ color: PAL.ink }}>
              Decode your year.
            </h3>
            <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed mt-3 max-w-md" style={{ color: PAL.ink2 }}>
              We extract your exact Varshaphal (Solar Return) chart, active yogas, and monthly transitions to generate an accurate, highly actionable blueprint for your entire year.
            </p>
            <button
              onClick={generateReport}
              className="mt-7 serif-text text-[13px] font-semibold px-6 py-3 rounded-sm text-white transition-opacity hover:opacity-90"
              style={{ background: PAL.accent }}
            >
              Generate year ahead blueprint · {FEATURE_CREDITS.year_ahead} credits
            </button>
          </div>
        )}

        {/* LOADING */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center px-6 py-14 md:py-20 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
              Live cosmic computation
            </p>
            <h3 className="serif-display text-[24px] md:text-[28px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
              Casting your solar return…
            </h3>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingLine}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="serif-text italic text-[13.5px] mt-3 max-w-sm" style={{ color: PAL.ink2 }}
              >
                {LOADING_LINES[loadingLine]}
              </motion.p>
            </AnimatePresence>
            <div className="mt-6 inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent }} />
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.15s" }} />
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.3s" }} />
            </div>
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="serif-display text-[42px]" style={{ color: PAL.rose }}>⚠︎</div>
            <h3 className="serif-display text-[20px] font-semibold mt-3" style={{ color: PAL.ink }}>Generation failed</h3>
            <p className="serif-text text-[13.5px] italic mt-1" style={{ color: PAL.ink2 }}>{errorMsg}</p>
            <button
              onClick={generateReport}
              className="mt-5 serif-text text-[13px] font-semibold px-5 py-2.5 rounded-sm text-white transition-opacity hover:opacity-90"
              style={{ background: PAL.ink }}
            >
              Try again
            </button>
          </div>
        )}

        {/* DONE */}
        {status === "done" && parsed && (
          <div className="px-4 md:px-7 lg:px-9 py-5 md:py-7 space-y-7 md:space-y-9">
            {/* Intro */}
            <section className="rounded-sm p-5 md:p-7"
              style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.accent }}>
                Yearly assessment
              </p>
              <p className="serif-text text-[15px] md:text-[17px] leading-relaxed max-w-3xl" style={{ color: PAL.ink }}>
                {parsed.intro}
              </p>
            </section>

            {/* Yogas */}
            {parsed.activeYogas?.length > 0 && (
              <section>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="serif-display italic text-[18px] md:text-[22px]" style={{ color: PAL.accent }}>✦</span>
                  <h3 className="serif-display text-[20px] md:text-[24px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
                    Active yogas
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {parsed.activeYogas.map((yoga, i) => (
                    <div key={i} className="rounded-sm p-5"
                      style={{ background: PAL.paper, border: `1px solid ${PAL.border2}` }}
                    >
                      <h4 className="serif-display text-[16px] md:text-[18px] font-semibold tracking-tight" style={{ color: PAL.accent }}>
                        {yoga.name}
                      </h4>
                      <p className="serif-text text-[13.5px] mt-2 leading-relaxed" style={{ color: PAL.ink2 }}>
                        {yoga.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Monthly blueprint */}
            <section>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="serif-display italic text-[18px] md:text-[22px]" style={{ color: PAL.accent }}>❑</span>
                <h3 className="serif-display text-[20px] md:text-[24px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
                  Monthly blueprint
                </h3>
              </div>
              <p className="serif-text text-[13.5px] md:text-[14.5px] mb-5 max-w-2xl italic" style={{ color: PAL.ink2 }}>
                Your Solar Return (Varshaphal) chart begins precisely from your birth month this year. Below is your 12-month blueprint.
              </p>

              <div className="space-y-2.5">
                {parsed.months.map((m, i) => {
                  const isExpanded = activeMonth === i;
                  return (
                    <div
                      key={i}
                      className="rounded-sm overflow-hidden transition-all"
                      style={{
                        background: isExpanded ? PAL.paper2 : PAL.paper,
                        border: `1px solid ${isExpanded ? PAL.accent : PAL.border2}`,
                      }}
                    >
                      <button
                        onClick={() => setActiveMonth(isExpanded ? null : i)}
                        className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <span
                            className="w-11 h-11 md:w-12 md:h-12 rounded-sm grid place-items-center serif-display text-[18px] font-semibold flex-shrink-0"
                            style={
                              isExpanded
                                ? { background: PAL.accent, color: PAL.paper, border: `1px solid ${PAL.accent}` }
                                : { background: PAL.paper2, color: PAL.ink, border: `1px solid ${PAL.border}` }
                            }
                          >
                            {String(m.monthNumber).padStart(2, "0")}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>
                              {getMonthLabel(m.monthNumber, reportData?.metadata?.birthMonth, reportData?.metadata?.varshaphalYear)}
                            </p>
                            <h4 className="serif-display text-[16px] md:text-[18px] font-semibold tracking-tight leading-tight mt-0.5" style={{ color: PAL.ink }}>
                              {m.theme}
                            </h4>
                          </div>
                        </div>
                        <span className="serif-display italic text-[14px] flex-shrink-0 transition-transform"
                          style={{ color: isExpanded ? PAL.accent : PAL.ink3, transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                        >›</span>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 md:px-5 pb-5 md:pb-6 pt-4" style={{ borderTop: `1px solid ${PAL.border2}` }}>
                              <div className="flex flex-wrap gap-1.5 mb-5">
                                {m.keywords.map((kw, j) => (
                                  <span
                                    key={j}
                                    className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-0.5 rounded-sm"
                                    style={{ color: PAL.ink2, background: PAL.paper, border: `1px solid ${PAL.border2}` }}
                                  >
                                    {kw}
                                  </span>
                                ))}
                              </div>

                              <div className="space-y-5">
                                <div>
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: PAL.accent }}>
                                    Nuances &amp; subtleties
                                  </p>
                                  <p className="serif-text text-[14px] md:text-[15px] leading-relaxed" style={{ color: PAL.ink2 }}>
                                    {m.nuances}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="rounded-sm p-4"
                                    style={{ background: PAL.sageBg, border: `1px solid #C7D6BB` }}
                                  >
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: PAL.sage }}>
                                      ✓ Action plan
                                    </p>
                                    <p className="serif-text text-[13.5px] leading-relaxed font-medium" style={{ color: PAL.ink }}>
                                      {m.actionPlan}
                                    </p>
                                  </div>
                                  <div className="rounded-sm p-4"
                                    style={{ background: PAL.amberBg, border: `1px solid #E1CE9B` }}
                                  >
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: PAL.gold }}>
                                      ◆ Advice
                                    </p>
                                    <p className="serif-text text-[13.5px] leading-relaxed font-medium" style={{ color: PAL.ink }}>
                                      {m.advice}
                                    </p>
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
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
