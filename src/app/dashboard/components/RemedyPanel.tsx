"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  profileId: string;
  profileName: string;
}

interface ReportSection {
  id: string;
  title: string;
  content: string;
  color: "indigo" | "amber" | "rose" | "emerald" | "purple";
  icon: string;
}

interface ReportData {
  rawMarkdown: string;
  sections: ReportSection[];
  personName: string;
  model: string;
  echoes: any;
  d3Available: boolean;
  d12Available: boolean;
  d60Available: boolean;
  generatedAt: string;
}

const SECTION_ACCENTS: Record<string, { gradient: string; light: string; accent: string; dot: string }> = {
  indigo:  { gradient: "from-indigo-500 to-indigo-600", light: "bg-indigo-50", accent: "text-indigo-700", dot: "bg-indigo-400" },
  amber:   { gradient: "from-amber-500 to-orange-500",  light: "bg-amber-50",  accent: "text-amber-800",  dot: "bg-amber-400" },
  rose:    { gradient: "from-rose-400 to-rose-600",     light: "bg-rose-50",   accent: "text-rose-700",   dot: "bg-rose-400" },
  emerald: { gradient: "from-emerald-400 to-emerald-600", light:"bg-emerald-50", accent:"text-emerald-700", dot: "bg-emerald-400" },
  purple:  { gradient: "from-purple-500 to-fuchsia-600",  light:"bg-purple-50",  accent:"text-purple-700",  dot: "bg-purple-400" },
};

const LOADING_STEPS = [
  "Analyzing Afflicted Planets",
  "Evaluating Dasha Lord Influences",
  "Calculating Ascendant Needs",
  "Consulting Grandmaster Oracle",
  "Selecting Potent Tantric Mantras",
];

const FEATURE_ITEMS = [
  { icon: "🔥", title: "Targeted Precision",      desc: "Mantras specific to your exact chart afflictions"     },
  { icon: "🧬", title: "Karmic DNA Rewrite",      desc: "Nuclear-level sound frequencies for deep shifts"                  },
  { icon: "⏳", title: "48-Day Mandala",         desc: "Strict protocols and frequency instructions"       },
];

export default function RemedyPanel({ profileId, profileName }: Props) {
  const [reportData, setReportData]   = useState<ReportData | null>(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [generated, setGenerated]     = useState(false);
  const [confirmed, setConfirmed]     = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load saved report on profile switch ──────────────────────────────────
  useEffect(() => {
    async function checkSaved() {
      setLoading(true);
      setError("");
      setReportData(null);
      setGenerated(false);
      setConfirmed(false);
      try {
        const pid = profileId || "self";
        const res  = await fetch(`/api/remedy?profileId=${pid}`);
        if (!res.ok) { setLoading(false); return; }
        const data = await res.json();
        if (data.found && data.reportData) {
          setReportData(data.reportData);
          setGenerated(true);
        }
      } catch (err) {
        console.error("Failed to check saved remedy report", err);
      } finally {
        setLoading(false);
      }
    }
    checkSaved();
  }, [profileId]);

  // ── Animate loading steps ────────────────────────────────────────────────
  useEffect(() => {
    if (loading && !generated) {
      setLoadingStep(0);
      stepTimer.current = setInterval(() => {
        setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2200);
    } else {
      if (stepTimer.current) clearInterval(stepTimer.current);
    }
    return () => { if (stepTimer.current) clearInterval(stepTimer.current); };
  }, [loading, generated]);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/remedy", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate report");
      setReportData(data);
      setGenerated(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const genDate = reportData?.generatedAt
      ? new Date(reportData.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Tantric Mantra Remedy — ${profileName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; color:#1e293b; background:#fff; padding:40px; max-width:820px; margin:0 auto; }
    .header { text-align:center; padding:30px 0; border-bottom:2px solid #e2e8f0; margin-bottom:30px; }
    .header h1 { font-size:26px; font-weight:700; color:#4338ca; }
    .header p  { color:#64748b; font-size:13px; margin-top:6px; }
    .badge { display:inline-block; background:#f1f5f9; border:1px solid #e2e8f0; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:600; color:#475569; margin:6px 3px 0; }
    h2 { font-size:17px; font-weight:700; color:#1e293b; margin:28px 0 10px; padding-bottom:6px; border-bottom:1px solid #e2e8f0; }
    h3 { font-size:14px; font-weight:700; color:#4338ca; margin:16px 0 6px; }
    p  { font-size:13.5px; line-height:1.85; color:#334155; margin-bottom:10px; }
    li { font-size:13.5px; line-height:1.85; color:#334155; margin-left:20px; margin-bottom:4px; }
    strong { color:#1e293b; }
    blockquote { border-left:3px solid #818cf8; padding-left:14px; color:#475569; font-style:italic; margin:12px 0; }
    hr { border:none; border-top:1px solid #e2e8f0; margin:20px 0; }
    .footer { text-align:center; padding:20px 0; border-top:1px solid #e2e8f0; margin-top:40px; color:#94a3b8; font-size:11px; }
    @media print { body { padding:20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔮 Tantric Mantra Remedy</h1>
    <p>Deep-Layer Vedic Intelligence Report — Quantum Karma</p>
    <div>
      <span class="badge">For: ${profileName}</span>
      <span class="badge">Generated: ${genDate}</span>
      <span class="badge">Engine: Grandmaster Oracle</span>
    </div>
  </div>
  ${content.innerHTML}
  <div class="footer">
    <p>Generated by Quantum Karma using Indian Vedic Astrology &amp; AI Intelligence.</p>
    <p>Confidential — For ${profileName} only · quantumkarma.tech</p>
  </div>
</body>
</html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.focus(); printWindow.print(); }, 500);
  };

  // ── LOADING STATE ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-7 p-8">
        {/* Animated orb */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-purple-100 border-b-purple-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.2s" }} />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🔮</div>
        </div>

        <div className="text-center">
          <p className="font-bold text-slate-800 text-lg mb-1">Karmic Analysis in Progress</p>
          <p className="text-sm text-slate-500">Scanning 16 divisional charts &amp; Jaimini Karakas...</p>
        </div>

        {/* Step indicators */}
        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          {LOADING_STEPS.map((step, i) => (
            <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i <= loadingStep ? "opacity-100" : "opacity-25"}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                i < loadingStep  ? "bg-emerald-500 text-white" :
                i === loadingStep ? "bg-indigo-500 text-white animate-pulse" :
                                    "bg-slate-200 text-slate-400"
              }`}>
                {i < loadingStep ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <span className="text-[8px] font-bold">{i + 1}</span>
                )}
              </div>
              <span className={`text-xs font-semibold ${i === loadingStep ? "text-indigo-700" : i < loadingStep ? "text-emerald-700" : "text-slate-400"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── IDLE — Pre-generation ─────────────────────────────────────────────────
  if (!generated && !loading) {
    return (
      <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex-shrink-0 px-4 md:px-10 py-4 md:py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50">
          <div className="flex items-start gap-3">
            <span className="text-2xl md:text-3xl">🔮</span>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">📿 Powerful Custom Remedies</h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Highly potent Tantric Mantras tailored to your exact birth chart · {profileName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-5 md:p-8">
          {/* Feature grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-lg">
            {FEATURE_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-2.5 p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cost notice */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-5 max-w-sm w-full">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💎</span>
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-900">Highly Potent Tantric Mantra Report</p>
                <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                  Personalized to your birth chart, active Dasha lord, and afflicted planets. Includes 48-day mandala protocol, specific chant counts, and strict Vedic instructions.
                </p>
                <p className="text-sm font-bold text-indigo-800 mt-2">Cost: 25 Credits</p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="w-full max-w-sm p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* CTA */}
          {!confirmed ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfirmed(true)}
              className="px-10 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all text-sm tracking-wide"
            >
              Generate Report · 25 Credits
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-sm font-bold text-slate-800">Confirm 25 credit deduction?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmed(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={generate}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-200 text-sm transition-all"
                >
                  Yes, Generate Report
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ── REPORT STATE — Intelligence Cards ────────────────────────────────────
  if (generated && reportData) {
    const genDate = reportData.generatedAt
      ? new Date(reportData.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : "";

    return (
      <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
        {/* Feature header */}
        <div className="flex-shrink-0 px-4 md:px-10 py-4 md:py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="text-xl md:text-2xl flex-shrink-0">🔮</span>
              <div className="min-w-0">
                <h2 className="text-sm md:text-lg font-black text-slate-900 tracking-tight leading-tight truncate">📿 Powerful Custom Remedies</h2>
                <p className="text-[10px] md:text-xs text-slate-500 truncate">{profileName} · {genDate}</p>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-3">
              {/* Data badges */}
              <div className="hidden md:flex gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700">
                  Tantric Mantras
                </span>
              </div>
              <button
                onClick={handlePrint}
                className="px-2.5 md:px-3.5 py-1.5 md:py-2 bg-white border border-slate-200 text-slate-600 text-[11px] md:text-xs font-semibold rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span className="hidden md:inline">Save as PDF</span>
                <span className="md:hidden">Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full-width free-flowing sections */}
        <div ref={printRef} className="flex-1 px-4 md:px-8 lg:px-12 py-5 md:py-8 space-y-8 md:space-y-10">
          <AnimatePresence>
            {reportData.sections.map((section, idx) => {
              const palette = SECTION_ACCENTS[section.color] ?? SECTION_ACCENTS.indigo;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
                >
                  {/* Section title — full-width accent bar, no border box */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${palette.gradient} flex items-center justify-center text-lg shadow-md flex-shrink-0`}>
                      <span className="drop-shadow-sm">{section.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[15px] md:text-[17px] font-black text-slate-900 tracking-tight uppercase">
                          {section.title}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${palette.light} ${palette.accent} flex-shrink-0`}>
                          Remedy {idx + 1} of {reportData.sections.length}
                        </span>
                      </div>
                      <div className={`h-0.5 mt-1.5 rounded-full bg-gradient-to-r ${palette.gradient} opacity-20`} />
                    </div>
                  </div>

                  {/* Free-flowing content — no card wrapper */}
                  <div className="pl-0 md:pl-12">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-4 mt-2">{children}</h1>,
                        h2: ({ children }) => (
                          <div className="mt-8 mb-4">
                            <h2 className="text-[16px] md:text-[18px] font-black text-slate-900 tracking-tight">{children}</h2>
                          </div>
                        ),
                        h3: ({ children }) => (
                          <h3 className={`text-sm font-extrabold mt-6 mb-2 flex items-center gap-2 ${palette.accent}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${palette.dot} flex-shrink-0`} />
                            {children}
                          </h3>
                        ),
                        h4: ({ children }) => <h4 className="text-sm font-bold text-slate-700 mt-5 mb-2">{children}</h4>,
                        p: ({ children }) => <p className="text-[14px] md:text-[15px] text-slate-700 leading-relaxed mb-4">{children}</p>,
                        strong: ({ children }) => <strong className="font-extrabold text-slate-900">{children}</strong>,
                        em: ({ children }) => <em className={`font-medium not-italic ${palette.accent}`}>{children}</em>,
                        blockquote: ({ children }) => (
                          <div className="my-4 relative">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b ${palette.gradient}`} />
                            <div className={`pl-4 md:pl-5 pr-4 py-3 ${palette.light} rounded-r-xl`}>
                              <div className="text-[13px] md:text-[14px] text-slate-700 leading-relaxed font-medium italic">{children}</div>
                            </div>
                          </div>
                        ),
                        ul: ({ children }) => <ul className="space-y-2 my-3 pl-0 list-none">{children}</ul>,
                        ol: ({ children }) => <ol className="space-y-2 my-3 pl-0 list-none">{children}</ol>,
                        li: ({ children }) => (
                          <li className="flex gap-2.5 text-[14px] md:text-[15px] text-slate-700 leading-relaxed">
                            <span className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-md ${palette.light} flex items-center justify-center`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${palette.dot}`} />
                            </span>
                            <span className="flex-1">{children}</span>
                          </li>
                        ),
                        table: ({ children }) => (
                          <div className="my-5 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                            <table className="w-full text-sm border-collapse min-w-[500px]">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => <thead className="bg-slate-800">{children}</thead>,
                        th: ({ children }) => <th className="text-left px-4 py-3 text-xs font-bold text-white uppercase tracking-wider">{children}</th>,
                        td: ({ children }) => <td className="px-4 py-3 text-slate-700 font-medium border-t border-slate-100">{children}</td>,
                        tr: ({ children }) => <tr className="even:bg-slate-50 hover:bg-slate-100 transition-colors">{children}</tr>,
                      }}
                    >
                      {section.content}
                    </ReactMarkdown>
                  </div>

                  {/* Divider between sections */}
                  {idx < reportData.sections.length - 1 && (
                    <div className="mt-10 flex items-center gap-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                      <span className="text-slate-300 text-xs">✦</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reportData.sections.length * 0.1 + 0.3 }}
            className="text-center py-6 border-t border-slate-100"
          >
            <p className="text-xs text-slate-400 font-medium">
              Report generated by Quantum Oracle · Grandmaster Jyotishi Engine · {genDate}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
