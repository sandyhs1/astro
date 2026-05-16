"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IshtaDevataProps {
  profileId: string;
  profileName: string;
}

const DEITY_EMOJI: Record<string, string> = {
  "Sun":     "☀️",
  "Moon":    "🌙",
  "Mars":    "🔴",
  "Mercury": "💚",
  "Jupiter": "🟡",
  "Venus":   "🪷",
  "Saturn":  "🔵",
  "Rahu":    "🐍",
  "Ketu":    "🔥",
};

const DEITY_COLOR: Record<string, { from: string; to: string; accent: string }> = {
  "Sun":     { from: "#7C2D12", to: "#DC2626", accent: "#FCA5A5" },
  "Moon":    { from: "#1E3A5F", to: "#3B82F6", accent: "#93C5FD" },
  "Mars":    { from: "#7C1D1D", to: "#EF4444", accent: "#FCA5A5" },
  "Mercury": { from: "#064E3B", to: "#10B981", accent: "#6EE7B7" },
  "Jupiter": { from: "#713F12", to: "#D97706", accent: "#FDE68A" },
  "Venus":   { from: "#701A75", to: "#C026D3", accent: "#F5D0FE" },
  "Saturn":  { from: "#1E1B4B", to: "#6366F1", accent: "#C7D2FE" },
  "Rahu":    { from: "#1C1917", to: "#57534E", accent: "#D6D3D1" },
  "Ketu":    { from: "#422006", to: "#F97316", accent: "#FED7AA" },
};

const DEFAULT_COLOR = { from: "#1E1B4B", to: "#6366F1", accent: "#C7D2FE" };

const LOADING_LINES = [
  "Scanning the Navamsa chart for your Atmakaraka...",
  "The 12th from Karakamsa is being revealed by the Jaimini Sutram...",
  "Your soul's chosen deity is being identified with mathematical precision...",
  "Cross-referencing with Agama Shastra and Puranic sources...",
  "The Devata's sacred forms are being drawn from scripture...",
  "Your personal Sadhana prescription is being formulated...",
  "The soul's liberation path is being decoded from your D-9 chart...",
  "Ancient Jaimini logic is being applied to your birth matrix...",
];

export default function IshtaDevata({ profileId, profileName }: IshtaDevataProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [reportData, setReportData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingLine, setLoadingLine] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "loading") {
      timerRef.current = setInterval(() => {
        setLoadingLine(l => (l + 1) % LOADING_LINES.length);
      }, 2800);
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
      const res = await fetch(`/api/ishta-devata?profileId=${profileId}`);
      const data = await res.json();
      if (data.found && data.reportData) {
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
      const res = await fetch("/api/ishta-devata", {
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

  const colors = reportData?.twelfthLord ? (DEITY_COLOR[reportData.twelfthLord] ?? DEFAULT_COLOR) : DEFAULT_COLOR;
  const deityEmoji = reportData?.twelfthLord ? (DEITY_EMOJI[reportData.twelfthLord] ?? "🙏") : "🙏";

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 md:px-10 py-3 md:py-4 border-b border-slate-100 bg-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-lg"
            style={{ background: `linear-gradient(135deg, ${colors.from}22, ${colors.to}33)`, border: `1px solid ${colors.to}30` }}
          >
            🙏
          </div>
          <div className="min-w-0">
            <h2 className="font-black text-slate-900 text-sm md:text-base leading-tight">Your Ishta Devata</h2>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-medium truncate">
              {reportData
                ? `${reportData.ishtaDevata} · ${profileName}`
                : `Jaimini Navamsa · ${profileName}`}
            </p>
          </div>
        </div>
        {status === "done" && (
          <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] md:text-[11px] font-bold text-emerald-700 whitespace-nowrap">Saved</span>
          </div>
        )}
      </div>

      {/* ── IDLE ── */}
      {status === "idle" && (
        <div data-lenis-prevent className="flex-1 flex flex-col items-center justify-center text-center p-5 md:p-8 gap-6 md:gap-8 overflow-y-auto custom-scrollbar">
          <div className="relative">
            <div
              className="w-28 h-28 rounded-3xl flex items-center justify-center text-5xl shadow-xl"
              style={{
                background: "linear-gradient(135deg, #1E1B4B 0%, #4338CA 50%, #6366F1 100%)",
                boxShadow: "0 12px 40px rgba(99,102,241,0.3)",
              }}
            >
              🙏
            </div>
            <div
              className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, #D97706, #F59E0B)", boxShadow: "0 4px 12px rgba(217,119,6,0.4)" }}
            >
              D9
            </div>
          </div>

          <div className="max-w-lg space-y-3 md:space-y-4 w-full">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Your Soul's Deity is Hidden in Your D-9 Chart
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your Sun sign deity is for your ego. Your{" "}
              <span className="font-bold text-indigo-700">Ishta Devata</span> is for your soul's
              liberation — Moksha. Unlike your Kula Devata (inherited from family), the Ishta Devata
              is mathematically derived from your birth chart via pure Jaimini Sutra logic. It is
              unique to you alone.
            </p>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-left space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-2">The Jaimini Derivation</p>
              {[
                { step: "01", text: "Identify the Atmakaraka (AK) — the soul planet with the highest degree" },
                { step: "02", text: "Find AK's position in the D-9 Navamsa chart → the Karakamsa" },
                { step: "03", text: "The 12th house from Karakamsa reveals your Ishta Devata" },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="text-[10px] font-black text-indigo-400 mt-0.5 flex-shrink-0">{item.step}</span>
                  <p className="text-[12px] text-slate-600 font-medium leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {["Mathematical Derivation", "Jaimini Sutram", "All Divine Forms", "Soul Alignment", "Sadhana Prescription", "90-Day Protocol", "Moksha Path"].map(label => (
              <span key={label} className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={generateReport}
              className="px-10 py-4 rounded-xl font-black text-white text-sm shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)",
                boxShadow: "0 8px 28px rgba(99,102,241,0.4)",
              }}
            >
              🙏 Reveal My Ishta Devata — 5 Credits
            </button>
            <p className="text-[11px] text-slate-400 font-medium">
              Saved permanently · Never expires · Free to re-read anytime
            </p>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {status === "loading" && !reportData && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl"
              style={{
                background: "linear-gradient(135deg, #1E1B4B, #4338CA)",
                animation: "pulse 2s ease-in-out infinite",
                boxShadow: "0 0 50px rgba(99,102,241,0.4)",
              }}
            >
              🙏
            </div>
            <div
              className="absolute inset-0 rounded-3xl border-2"
              style={{
                borderColor: "transparent",
                borderTopColor: "#6366F1",
                animation: "spin 3s linear infinite",
              }}
            />
          </div>

          <div className="text-center space-y-3 max-w-sm">
            <div className="font-black text-slate-900 text-xl tracking-tight">
              The Jaimini Sutra Speaks...
            </div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              ॥ Karakamsa Vicharah ॥
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingLine}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-slate-500 font-medium leading-relaxed"
              >
                {LOADING_LINES[loadingLine]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="w-full max-w-xs space-y-2.5">
            {[
              { icon: "🪐", label: "Identifying Atmakaraka in Navamsa" },
              { icon: "📐", label: "Computing 12th from Karakamsa" },
              { icon: "📜", label: "Cross-referencing Jaimini Sutram" },
              { icon: "🏛️", label: "Deriving all divine manifestations" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-[12px] text-slate-500 font-semibold"
                style={{ animation: `slideIn 0.5s ease both`, animationDelay: `${i * 0.7}s` }}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-xs h-0.5 rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #4338CA, #818CF8, #4338CA)",
                backgroundSize: "200% 100%",
                animation: "shimmerBar 2s linear infinite",
              }}
            />
          </div>

          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <span>⏳</span>
            <span>Chart analysis in progress · Keep this window open</span>
          </p>

          <style>{`
            @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes shimmerBar { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}

      {/* ── ERROR ── */}
      {status === "error" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="text-5xl">🚫</div>
          <div>
            <h3 className="font-black text-slate-900 text-lg">Derivation Failed</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">{errorMsg}</p>
          </div>
          <button
            onClick={() => setStatus("idle")}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── DONE — Full-Width Premium Report ── */}
      {status === "done" && reportData && (
        <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 md:px-8 lg:px-12 py-4 md:py-6">

            {/* Hero Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden mb-6 md:mb-8 p-4 md:p-6"
              style={{
                background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
                boxShadow: `0 16px 48px ${colors.to}40`,
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.9) 0%, transparent 55%)" }}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{deityEmoji}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">
                        Ishta Devata · Jaimini Revelation
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight mb-1">
                      {reportData.ishtaDevata}
                    </h2>
                    <p className="text-white/60 text-xs font-semibold">
                      Soul's Chosen Deity for Moksha · {profileName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-[10px] bg-white/15 text-white/90 px-2.5 py-1 rounded-full font-bold border border-white/20">
                      ✓ Permanently Saved
                    </span>
                    {reportData.generatedAt && (
                      <span className="text-[10px] text-white/50 font-medium">
                        {new Date(reportData.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-px bg-white/15 mt-4 mb-4" />

                {/* Derivation chain */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-[11px] font-bold">
                  {[
                    { label: "AK", value: reportData.ak },
                    { label: "Karakamsa", value: reportData.karakamsaSign },
                    { label: "12th From", value: reportData.twelfthFromKarakamsa },
                    { label: "Lord", value: reportData.twelfthLord },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <span className="text-white/40 text-[9px] uppercase tracking-widest">{item.label}</span>
                        <span className="text-white font-black text-sm">{item.value}</span>
                      </div>
                      {i < 3 && <span className="text-white/30 text-base">→</span>}
                    </div>
                  ))}
                  <div className="flex items-center gap-1 ml-2">
                    <span className="text-white/30">⇒</span>
                    <span className="bg-white/20 text-white px-2.5 py-1 rounded-full font-black text-[11px] border border-white/30">
                      🙏 {reportData.ishtaDevata}
                    </span>
                  </div>
                </div>

                {/* All forms */}
                {reportData.allForms?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {reportData.allForms.map((form: string) => (
                      <span key={form} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                        {form}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Report Content — Full width, free-flowing, no card wrapper */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="ishta-devata-report">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-4 mt-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <div className="mt-10 mb-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-1.5 h-8 rounded-full" style={{ background: `linear-gradient(to bottom, ${colors.from}, ${colors.to})` }} />
                          <h2 className="text-[19px] font-black text-slate-900 tracking-tight uppercase">{children}</h2>
                        </div>
                        <div className="h-px" style={{ background: `linear-gradient(to right, ${colors.to}40, transparent)` }} />
                      </div>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-[15px] font-extrabold mt-7 mb-2.5 flex items-center gap-2" style={{ color: colors.to }}>
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: colors.to }} />
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-sm font-bold text-slate-700 mt-5 mb-2">{children}</h4>
                    ),
                    p: ({ children }) => (
                      <p className="text-[15px] text-slate-700 leading-[1.85] mb-4">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-extrabold text-slate-900">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="font-medium not-italic" style={{ color: colors.to }}>{children}</em>
                    ),
                    hr: () => (
                      <div className="my-8 flex items-center gap-3">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <span className="text-slate-300 text-xs">✦</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                      </div>
                    ),
                    blockquote: ({ children }) => (
                      <div className="my-5 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full" style={{ background: `linear-gradient(to bottom, ${colors.from}, ${colors.to})` }} />
                        <div className="pl-5 pr-4 py-3 rounded-r-xl" style={{ background: `${colors.to}10` }}>
                          <div className="text-[14px] text-slate-700 leading-relaxed font-medium italic">{children}</div>
                        </div>
                      </div>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-2.5 my-4 pl-0 list-none">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="space-y-2.5 my-4 pl-0 list-none">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="flex gap-3 text-[15px] text-slate-700 leading-relaxed">
                        <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-md flex items-center justify-center" style={{ background: `${colors.to}15` }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.to }} />
                        </span>
                        <span className="flex-1">{children}</span>
                      </li>
                    ),
                    table: ({ children }) => (
                      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                        <table className="w-full text-sm border-collapse">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead style={{ background: `linear-gradient(to right, ${colors.from}, ${colors.to})` }}>{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="text-left px-5 py-3 text-xs font-bold text-white uppercase tracking-wider">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-5 py-3 text-slate-700 font-medium border-t border-slate-100">{children}</td>
                    ),
                    tr: ({ children }) => (
                      <tr className="even:bg-slate-50/70 hover:bg-indigo-50/40 transition-colors">{children}</tr>
                    ),
                  }}
                >
                  {reportData.report}
                </ReactMarkdown>
              </div>

              {/* Footer */}
              <div className="mt-10 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-relaxed">
                  Derived via Jaimini Sutram · For spiritual guidance only
                </p>
                <button
                  onClick={() => window.print()}
                  className="text-[11px] text-slate-400 hover:text-slate-700 font-bold transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Print
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      )}
    </div>
  );
}
