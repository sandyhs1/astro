"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface YourGotraProps {
  profileId?: string;
  profileName?: string;
}

const AMBER = { from: "#92400E", to: "#D97706", accent: "#FDE68A" };

const VEDIC_LOADING_LINES = [
  "The lineage records are being retrieved from the Akashic archives...",
  "Your ancestral Rishi is being invoked from the Saptarishi mandala...",
  "Vedic Samskaras are being decoded from the Puranic texts...",
  "The Gotra-Sutra is being traced through 108 generations...",
  "Ancient wisdom is being aligned with your present moment...",
  "Dharmic lineage data is being cross-referenced with Shruti and Smriti...",
  "Sacred fire of knowledge is being kindled for your lineage reading...",
];

export default function YourGotra({ profileId, profileName }: YourGotraProps) {
  const isB2B = profileId === undefined;

  const [status, setStatus]       = useState<"idle" | "loading" | "done" | "error">("idle");
  const [gotraInput, setGotraInput] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [errorMsg, setErrorMsg]   = useState("");
  const [loadingLine, setLoadingLine] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "loading") {
      timerRef.current = setInterval(() => {
        setLoadingLine(l => (l + 1) % VEDIC_LOADING_LINES.length);
      }, 2600);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  useEffect(() => {
    if (isB2B) return;
    checkForSaved();
  }, [profileId]);

  async function checkForSaved() {
    setStatus("loading");
    try {
      const url = profileId && profileId !== "self"
        ? `/api/gotra-report?profileId=${profileId}`
        : `/api/gotra-report`;
      const res  = await fetch(url);
      const data = await res.json();
      if (data.found && data.reportData) {
        setReportData(data.reportData);
        setGotraInput(data.reportData.gotra || "");
        setStatus("done");
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  }

  async function generateReport() {
    if (!gotraInput.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    setLoadingLine(0);
    try {
      const res  = await fetch("/api/gotra-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gotra: gotraInput.trim(), profileId: profileId || null, saveReport: !isB2B }),
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

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 md:px-10 py-3 md:py-4 border-b border-slate-100 bg-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, #FEF3C7, #FDE68A)", border: "1px solid rgba(245,158,11,0.25)" }}>
            🕉️
          </div>
          <div className="min-w-0">
            <h2 className="font-black text-slate-900 text-sm md:text-base leading-tight">Your Gotra</h2>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-medium truncate">
              {reportData
                ? `${reportData.gotra} Gotra${profileName ? ` · ${profileName}` : ""}`
                : `Vedic Lineage${profileName ? ` · ${profileName}` : ""}`}
            </p>
          </div>
        </div>
        {status === "done" && isB2B && (
          <button
            onClick={() => { setStatus("idle"); setReportData(null); setGotraInput(""); }}
            className="flex-shrink-0 text-xs font-bold text-slate-400 hover:text-amber-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-amber-50 border border-slate-200 bg-white"
          >
            ↺ New
          </button>
        )}
        {status === "done" && !isB2B && (
          <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] md:text-[11px] font-bold text-emerald-700 whitespace-nowrap">Saved</span>
          </div>
        )}
      </div>

      {/* ── IDLE ── */}
      {status === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-5 md:p-8 gap-6 md:gap-8 overflow-y-auto custom-scrollbar">
          <div className="relative">
            <div
              className="w-28 h-28 rounded-3xl flex items-center justify-center text-5xl shadow-xl"
              style={{
                background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%)",
                border: "2px solid rgba(245,158,11,0.3)",
                boxShadow: "0 12px 40px rgba(245,158,11,0.25)",
              }}
            >
              🕉️
            </div>
            <div
              className="absolute -inset-2 rounded-[28px] opacity-20"
              style={{ background: "radial-gradient(circle, #F59E0B, transparent 70%)" }}
            />
          </div>

          <div className="max-w-md w-full">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-2 md:mb-3">
              Decode Your Ancestral Lineage
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your Gotra is not just a name — it is your spiritual DNA, your lineage from one of the
              founding Rishis of Vedic civilization. Enter your Gotra to receive a deep-dive report
              on your ancestral inheritance, responsibilities, and strengths.
            </p>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div className="relative">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 text-left">
                Your Gotra Name
              </label>
              <input
                type="text"
                value={gotraInput}
                onChange={e => setGotraInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && gotraInput.trim()) generateReport(); }}
                placeholder="e.g. Bharadvaja, Kashyapa, Atreya..."
                className="w-full px-5 py-3.5 rounded-xl border text-slate-900 font-semibold placeholder:text-slate-300 focus:outline-none transition-all text-center text-lg tracking-wide"
                style={{
                  borderColor: gotraInput.trim() ? "rgba(245,158,11,0.6)" : "rgba(203,213,225,1)",
                  boxShadow: gotraInput.trim() ? "0 0 0 3px rgba(245,158,11,0.12)" : "none",
                  background: "#FAFAFA",
                }}
                autoFocus
              />
            </div>

            <button
              onClick={generateReport}
              disabled={!gotraInput.trim()}
              className="w-full py-4 rounded-xl font-black text-white text-sm shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              style={{
                background: gotraInput.trim()
                  ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
                  : "linear-gradient(135deg, #94A3B8, #64748B)",
                boxShadow: gotraInput.trim() ? "0 8px 24px rgba(245,158,11,0.35)" : "none",
              }}
            >
              🕉️ Decode My Gotra{!isB2B && " — 5 Credits"}
            </button>

            <p className="text-[11px] text-slate-400 font-medium">
              {!isB2B
                ? "Saved permanently to your profile · Never expires · Free to re-read anytime"
                : "Instant lookup · No report saved · Check any Gotra"}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {["The Progenitor Rishi", "Inherited Samskaras", "Daily Practice", "Rishi Mantra", "Tarpana Ritual", "Modern Strengths 2026"].map(label => (
              <span
                key={label}
                className="text-[11px] font-bold px-3 py-1.5 rounded-full"
                style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid rgba(245,158,11,0.25)" }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {status === "loading" && reportData === null && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl"
              style={{
                background: "linear-gradient(135deg, #FEF3C7, #F59E0B)",
                animation: "pulse 2s ease-in-out infinite",
                boxShadow: "0 0 40px rgba(245,158,11,0.3)",
              }}
            >
              🕉️
            </div>
            <div
              className="absolute inset-0 rounded-3xl border-2"
              style={{ borderColor: "transparent", borderTopColor: "#F59E0B", animation: "spin 3s linear infinite" }}
            />
          </div>

          <div className="text-center space-y-3 max-w-sm">
            <div className="font-black text-slate-900 text-lg tracking-tight">The Lineage Speaks...</div>
            <div className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: "#D97706" }}>
              ॥ Invoking the Saptarishi Mandala ॥
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
                {VEDIC_LOADING_LINES[loadingLine]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="w-full max-w-xs space-y-2">
            {[
              { icon: "📜", label: "Tracing Gotra-Sutra threads" },
              { icon: "🔥", label: "Invoking Rishi consciousness" },
              { icon: "⚡", label: "Decoding Samskara matrix" },
              { icon: "🏛️", label: "Compiling Puranic evidence" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-[12px] text-slate-400 font-medium"
                style={{ animation: `slideIn 0.5s ease both`, animationDelay: `${i * 0.7}s` }}
              >
                <span className="text-sm leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-xs h-1 rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #F59E0B, #FDE68A, #F59E0B)",
                backgroundSize: "200% 100%",
                animation: "shimmerBar 2s linear infinite",
              }}
            />
          </div>

          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <span>⏳</span>
            <span>Keep this window open · Deep analysis in progress</span>
          </p>

          <style>{`
            @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
            @keyframes shimmerBar { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
            @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
          `}</style>
        </div>
      )}

      {/* ── ERROR ── */}
      {status === "error" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="text-5xl">🚫</div>
          <div>
            <h3 className="font-black text-slate-900 text-lg">Generation Failed</h3>
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

      {/* ── DONE — Full-Width Premium Report (matches IshtaDevata) ── */}
      {status === "done" && reportData && (
        <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 md:px-8 lg:px-12 py-4 md:py-6">

            {/* Hero Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden mb-6 md:mb-8 p-4 md:p-6"
              style={{
                background: `linear-gradient(135deg, ${AMBER.from} 0%, ${AMBER.to} 100%)`,
                boxShadow: `0 16px 48px rgba(180,83,9,0.3)`,
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
                      <span className="text-2xl">🕉️</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-200/80">
                        Gotra Lineage Report
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight mb-1">
                      {reportData.gotra} Gotra
                    </h2>
                    <p className="text-amber-200/70 text-xs font-semibold">
                      Ancestral Intelligence Decoded{profileName ? ` · ${profileName}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {!isB2B && (
                      <span className="text-[10px] bg-white/15 text-white/90 px-2.5 py-1 rounded-full font-bold border border-white/20">
                        ✓ Permanently Saved
                      </span>
                    )}
                    {reportData.generatedAt && (
                      <span className="text-[10px] text-amber-200/60 font-medium">
                        {new Date(reportData.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-px bg-white/15 mt-4 mb-4" />

                <div className="flex flex-wrap gap-1.5">
                  {["Saptarishi Lineage", "Vedic Samskaras", "Nitya Karma", "Rishi Mantra", "Tarpana"].map(tag => (
                    <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Report Content — Full width, free-flowing, no card wrapper */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="gotra-report">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-4 mt-2">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <div className="mt-10 mb-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-1.5 h-8 rounded-full"
                            style={{ background: `linear-gradient(to bottom, ${AMBER.from}, ${AMBER.to})` }}
                          />
                          <h2 className="text-[19px] font-black text-slate-900 tracking-tight uppercase">{children}</h2>
                        </div>
                        <div className="h-px" style={{ background: `linear-gradient(to right, ${AMBER.to}50, transparent)` }} />
                      </div>
                    ),
                    h3: ({ children }) => (
                      <h3
                        className="text-[15px] font-extrabold mt-7 mb-2.5 flex items-center gap-2"
                        style={{ color: AMBER.to }}
                      >
                        <span
                          className="w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: AMBER.to }}
                        />
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
                      <em className="font-medium not-italic" style={{ color: AMBER.to }}>{children}</em>
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
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                          style={{ background: `linear-gradient(to bottom, ${AMBER.from}, ${AMBER.to})` }}
                        />
                        <div className="pl-5 pr-4 py-3 rounded-r-xl" style={{ background: `${AMBER.to}12` }}>
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
                        <span
                          className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-md flex items-center justify-center"
                          style={{ background: `${AMBER.to}18` }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER.to }} />
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
                      <thead style={{ background: `linear-gradient(to right, ${AMBER.from}, ${AMBER.to})` }}>{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="text-left px-5 py-3 text-xs font-bold text-white uppercase tracking-wider">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-5 py-3 text-slate-700 font-medium border-t border-slate-100">{children}</td>
                    ),
                    tr: ({ children }) => (
                      <tr className="even:bg-amber-50/40 hover:bg-amber-50/70 transition-colors">{children}</tr>
                    ),
                    code: ({ children }) => (
                      <span className="bg-amber-50 text-amber-800 text-[13px] font-semibold px-2 py-0.5 rounded-md border border-amber-100">{children}</span>
                    ),
                  }}
                >
                  {reportData.report}
                </ReactMarkdown>
              </div>

              {/* Footer */}
              <div className="mt-10 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-relaxed">
                  Based on Vedic Puranic Scriptures · For spiritual reference
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
