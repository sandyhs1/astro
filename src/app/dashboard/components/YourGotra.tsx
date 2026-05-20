"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { FEATURE_CREDITS } from "@/lib/pricing/feature-credits";
import remarkGfm from "remark-gfm";
import { PAL } from "./destiny-theme";

interface YourGotraProps {
  profileId?: string;
  profileName?: string;
}

const VEDIC_LOADING_LINES = [
  "The lineage records are being retrieved from the Akashic archives…",
  "Your ancestral Rishi is being invoked from the Saptarishi mandala…",
  "Vedic Samskaras are being decoded from the Puranic texts…",
  "The Gotra-Sutra is being traced through 108 generations…",
  "Ancient wisdom is being aligned with your present moment…",
  "Dharmic lineage data is being cross-referenced with Shruti and Smriti…",
  "Sacred fire of knowledge is being kindled for your lineage reading…",
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

  useEffect(() => { if (!isB2B) checkForSaved(); }, [profileId]);

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
      } else { setStatus("idle"); }
    } catch { setStatus("idle"); }
  }

  async function generateReport() {
    if (!gotraInput.trim()) return;
    setStatus("loading"); setErrorMsg(""); setLoadingLine(0);
    try {
      const res = await fetch("/api/gotra-report", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gotra: gotraInput.trim(), profileId: profileId || null, saveReport: !isB2B }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Something went wrong."); setStatus("error"); return; }
      setReportData(data); setStatus("done");
    } catch { setErrorMsg("Network error. Please try again."); setStatus("error"); }
  }

  return (
    <div className="flex flex-col w-full" style={{ background: PAL.paper, color: PAL.ink }}>
      {/* Header */}
      <div
        className="px-5 md:px-7 lg:px-9 py-4 md:py-5 flex items-center justify-between gap-3 sticky top-0 z-10 backdrop-blur-md"
        style={{ background: "rgba(250,247,242,0.92)", borderBottom: `1px solid ${PAL.border2}` }}
      >
        <div className="flex items-baseline gap-3 min-w-0 flex-1">
          <span className="serif-display italic text-[18px] md:text-[22px]" style={{ color: PAL.accent }}>🕉</span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
              Your Gotra
            </p>
            <h2 className="serif-display text-[16px] md:text-[20px] font-semibold leading-none tracking-tight mt-0.5 truncate" style={{ color: PAL.ink }}>
              {reportData ? `${reportData.gotra} Gotra` : "Vedic lineage"}
            </h2>
            {profileName && (
              <p className="serif-text text-[11.5px] italic mt-1" style={{ color: PAL.ink3 }}>
                {profileName}
              </p>
            )}
          </div>
        </div>
        {status === "done" && isB2B && (
          <button
            onClick={() => { setStatus("idle"); setReportData(null); setGotraInput(""); }}
            className="flex-shrink-0 serif-text text-[12px] font-semibold px-3 py-1.5 rounded-sm transition-colors hover:bg-black/[0.04]"
            style={{ color: PAL.ink2, border: `1px solid ${PAL.border}` }}
          >
            ↺ New
          </button>
        )}
        {status === "done" && !isB2B && (
          <div className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm"
            style={{ background: PAL.sageBg, border: `1px solid #C7D6BB` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: PAL.sage }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: PAL.sage }}>Saved</span>
          </div>
        )}
      </div>

      {/* IDLE */}
      {status === "idle" && (
        <div data-lenis-prevent className="flex flex-col items-center justify-center text-center px-6 py-12 md:py-16">
          <div
            className="w-24 h-24 rounded-sm grid place-items-center serif-display text-[42px] mb-7"
            style={{ background: PAL.amberBg, color: PAL.gold, border: `1px solid #E1CE9B` }}
          >
            🕉
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
            Begin · Gotra reading
          </p>
          <h3 className="serif-display text-[28px] md:text-[36px] font-semibold tracking-tight leading-tight max-w-xl" style={{ color: PAL.ink }}>
            Decode your ancestral lineage.
          </h3>
          <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed mt-3 max-w-md" style={{ color: PAL.ink2 }}>
            Your Gotra is not just a name — it is your spiritual DNA, your lineage from one of the founding Rishis of Vedic civilisation.
          </p>

          <div className="w-full max-w-sm mt-7 space-y-3">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-left" style={{ color: PAL.ink3 }}>
              Your Gotra name
            </label>
            <input
              type="text"
              value={gotraInput}
              onChange={e => setGotraInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && gotraInput.trim()) generateReport(); }}
              placeholder="e.g. Bharadvaja, Kashyapa, Atreya…"
              className="w-full serif-text text-[16px] px-4 py-3 rounded-sm focus:outline-none transition-colors text-center"
              style={{
                color: PAL.ink, background: PAL.paper,
                border: `1px solid ${gotraInput.trim() ? PAL.accent : PAL.border}`,
                boxShadow: gotraInput.trim() ? `0 0 0 3px rgba(123,10,31,0.10)` : "none",
              }}
              autoFocus
            />
            <button
              onClick={generateReport}
              disabled={!gotraInput.trim()}
              className="w-full serif-text text-[13px] font-semibold py-3 rounded-sm text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: PAL.accent }}
            >
              🕉 Decode my Gotra{!isB2B && ` — ${FEATURE_CREDITS.your_gotra} credits`}
            </button>
            <p className="serif-text italic text-[11.5px]" style={{ color: PAL.ink3 }}>
              {!isB2B
                ? "Saved permanently · never expires · free to re-read anytime"
                : "Instant lookup · no report saved · check any Gotra"}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 max-w-md mt-7">
            {["The progenitor Rishi", "Inherited Samskaras", "Daily practice", "Rishi mantra", "Tarpana ritual", "Modern strengths"].map(label => (
              <span
                key={label}
                className="serif-text text-[11.5px] font-semibold px-2.5 py-1 rounded-sm"
                style={{ color: PAL.gold, background: PAL.amberBg, border: `1px solid #E1CE9B` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* LOADING */}
      {status === "loading" && reportData === null && (
        <div className="flex flex-col items-center justify-center px-6 py-14 md:py-20 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
            ॥ Karakamsa Vicharah ॥
          </p>
          <h3 className="serif-display text-[24px] md:text-[28px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
            The lineage speaks…
          </h3>
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingLine}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="serif-text italic text-[13.5px] mt-3 max-w-sm" style={{ color: PAL.ink2 }}
            >
              {VEDIC_LOADING_LINES[loadingLine]}
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
          <p className="serif-text text-[13.5px] italic mt-1 max-w-xs" style={{ color: PAL.ink2 }}>{errorMsg}</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-5 serif-text text-[13px] font-semibold px-5 py-2.5 rounded-sm text-white transition-opacity hover:opacity-90"
            style={{ background: PAL.ink }}
          >
            Try again
          </button>
        </div>
      )}

      {/* DONE */}
      {status === "done" && reportData && (
        <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scroll-light">
          <div className="px-4 md:px-7 lg:px-9 py-5 md:py-7">

            {/* Hero */}
            <motion.section
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-sm p-5 md:p-7 mb-6"
              style={{ background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] mb-2" style={{ color: "#E1CE9B" }}>
                    🕉 Gotra lineage report
                  </p>
                  <h2 className="serif-display text-[24px] md:text-[32px] font-semibold tracking-tight leading-tight">
                    {reportData.gotra} Gotra
                  </h2>
                  <p className="serif-text italic text-[13px] mt-2" style={{ color: PAL.paper2 }}>
                    Ancestral intelligence{profileName ? ` · ${profileName}` : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {!isB2B && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
                      style={{ background: "rgba(255,255,255,0.10)", color: PAL.paper, border: `1px solid rgba(255,255,255,0.18)` }}
                    >
                      ✓ Saved
                    </span>
                  )}
                  {reportData.generatedAt && (
                    <span className="serif-text italic text-[11px]" style={{ color: PAL.paper2, opacity: 0.8 }}>
                      {new Date(reportData.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
              <div className="h-px mt-4 mb-4" style={{ background: "rgba(255,255,255,0.12)" }} />
              <div className="flex flex-wrap gap-1.5">
                {["Saptarishi lineage", "Vedic Samskaras", "Nitya Karma", "Rishi mantra", "Tarpana"].map(tag => (
                  <span key={tag}
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-0.5 rounded-sm"
                    style={{ background: "rgba(255,255,255,0.08)", color: PAL.paper, border: `1px solid rgba(255,255,255,0.14)` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Report markdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="prose-editorial-gotra"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="serif-display text-[28px] md:text-[34px] font-semibold tracking-tight mt-2 mb-4" style={{ color: PAL.ink }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <div className="mt-10 mb-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
                        Section
                      </p>
                      <h2 className="serif-display text-[22px] md:text-[26px] font-semibold tracking-tight leading-tight" style={{ color: PAL.ink }}>
                        {children}
                      </h2>
                      <div className="h-px mt-3" style={{ background: `linear-gradient(to right, ${PAL.border}, transparent)` }} />
                    </div>
                  ),
                  h3: ({ children }) => (
                    <h3 className="serif-display text-[17px] md:text-[19px] font-semibold tracking-tight mt-7 mb-2.5 flex items-center gap-2" style={{ color: PAL.gold }}>
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: PAL.gold }} />
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="serif-display text-[15px] font-semibold mt-5 mb-2" style={{ color: PAL.ink2 }}>{children}</h4>
                  ),
                  p: ({ children }) => (
                    <p className="serif-text text-[15px] md:text-[16px] leading-[1.85] mb-4" style={{ color: PAL.ink2 }}>{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold" style={{ color: PAL.ink }}>{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="not-italic font-medium" style={{ color: PAL.gold }}>{children}</em>
                  ),
                  hr: () => (
                    <div className="my-8 flex items-center gap-3">
                      <div className="flex-1 h-px" style={{ background: PAL.border }} />
                      <span className="serif-display italic text-[13px]" style={{ color: PAL.ink3 }}>✦</span>
                      <div className="flex-1 h-px" style={{ background: PAL.border }} />
                    </div>
                  ),
                  blockquote: ({ children }) => (
                    <div className="my-5 rounded-sm pl-4 pr-4 py-3"
                      style={{ background: PAL.amberBg, border: `1px solid #E1CE9B`, borderLeft: `2px solid ${PAL.gold}` }}
                    >
                      <div className="serif-display italic text-[14px] md:text-[15px] leading-relaxed" style={{ color: PAL.ink }}>
                        {children}
                      </div>
                    </div>
                  ),
                  ul: ({ children }) => <ul className="space-y-2 my-4 list-none pl-0">{children}</ul>,
                  ol: ({ children }) => <ol className="space-y-2 my-4 list-none pl-0">{children}</ol>,
                  li: ({ children }) => (
                    <li className="serif-text text-[15px] leading-relaxed flex gap-3" style={{ color: PAL.ink2 }}>
                      <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full" style={{ background: PAL.gold }} />
                      <span className="flex-1">{children}</span>
                    </li>
                  ),
                  table: ({ children }) => (
                    <div className="my-6 overflow-x-auto rounded-sm" style={{ border: `1px solid ${PAL.border}` }}>
                      <table className="w-full text-[14px] border-collapse">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead style={{ background: PAL.gold, color: PAL.paper }}>{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em]">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2.5 serif-text text-[13.5px]" style={{ color: PAL.ink2, borderTop: `1px solid ${PAL.border2}` }}>{children}</td>
                  ),
                  tr: ({ children }) => <tr>{children}</tr>,
                  code: ({ children }) => (
                    <span className="font-mono text-[13px] px-1.5 py-0.5 rounded-sm"
                      style={{ background: PAL.amberBg, color: PAL.gold, border: `1px solid #E1CE9B` }}
                    >
                      {children}
                    </span>
                  ),
                }}
              >
                {reportData.report}
              </ReactMarkdown>

              {/* Footer */}
              <div className="mt-10 pt-5 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px solid ${PAL.border}` }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.ink3 }}>
                  Based on Vedic Puranic scriptures · for spiritual reference
                </p>
                <button
                  onClick={() => window.print()}
                  className="serif-text text-[11.5px] font-semibold transition-opacity hover:opacity-70 flex items-center gap-1"
                  style={{ color: PAL.ink2 }}
                >
                  <span>⎙</span> Print
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
