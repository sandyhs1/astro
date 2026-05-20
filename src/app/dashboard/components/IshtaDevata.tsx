"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { FEATURE_CREDITS } from "@/lib/pricing/feature-credits";
import remarkGfm from "remark-gfm";
import { PAL, PLANET_TONE } from "./destiny-theme";

interface IshtaDevataProps {
  profileId: string;
  profileName: string;
}

const LOADING_LINES = [
  "Scanning the Navamsa chart for your Atmakaraka…",
  "The 12th from Karakamsa is being revealed by the Jaimini Sutram…",
  "Your soul's chosen deity is being identified with mathematical precision…",
  "Cross-referencing with Agama Shastra and Puranic sources…",
  "The Devata's sacred forms are being drawn from scripture…",
  "Your personal Sadhana prescription is being formulated…",
  "The soul's liberation path is being decoded from your D-9 chart…",
  "Ancient Jaimini logic is being applied to your birth matrix…",
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

  useEffect(() => { if (profileId) checkForSaved(); }, [profileId]);

  async function checkForSaved() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/ishta-devata?profileId=${profileId}`);
      const data = await res.json();
      if (data.found && data.reportData) { setReportData(data.reportData); setStatus("done"); }
      else setStatus("idle");
    } catch { setStatus("idle"); }
  }

  async function generateReport() {
    setStatus("loading"); setErrorMsg(""); setLoadingLine(0);
    try {
      const res = await fetch("/api/ishta-devata", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Something went wrong."); setStatus("error"); return; }
      setReportData(data); setStatus("done");
    } catch { setErrorMsg("Network error. Please try again."); setStatus("error"); }
  }

  const planetTone = reportData?.twelfthLord ? (PLANET_TONE[reportData.twelfthLord] || PLANET_TONE.Saturn) : PLANET_TONE.Saturn;

  return (
    <div className="flex flex-col w-full" style={{ background: PAL.paper, color: PAL.ink }}>
      {/* Header */}
      <div
        className="px-5 md:px-7 lg:px-9 py-4 md:py-5 flex items-center justify-between gap-3 sticky top-0 z-10 backdrop-blur-md"
        style={{ background: "rgba(250,247,242,0.92)", borderBottom: `1px solid ${PAL.border2}` }}
      >
        <div className="flex items-baseline gap-3 min-w-0 flex-1">
          <span className="serif-display italic text-[18px] md:text-[22px]" style={{ color: PAL.accent }}>🙏</span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
              Ishta Devata
            </p>
            <h2 className="serif-display text-[16px] md:text-[20px] font-semibold leading-none tracking-tight mt-0.5 truncate" style={{ color: PAL.ink }}>
              {reportData ? reportData.ishtaDevata : "Jaimini Navamsa"}
            </h2>
            <p className="serif-text italic text-[11.5px] mt-1" style={{ color: PAL.ink3 }}>{profileName}</p>
          </div>
        </div>
        {status === "done" && (
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
        <div data-lenis-prevent className="flex flex-col items-center text-center px-6 py-12 md:py-16">
          <div
            className="relative w-24 h-24 rounded-sm grid place-items-center serif-display text-[42px] mb-7"
            style={{ background: PAL.ink, color: "#E1CE9B", border: `1px solid ${PAL.ink}` }}
          >
            🙏
            <span
              className="absolute -top-2 -right-2 px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ background: PAL.gold, color: PAL.paper, border: `1px solid ${PAL.gold}` }}
            >
              D9
            </span>
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
            Begin · soul deity
          </p>
          <h3 className="serif-display text-[24px] md:text-[32px] font-semibold tracking-tight leading-tight max-w-2xl" style={{ color: PAL.ink }}>
            Your soul's deity is hidden in your D-9 chart.
          </h3>
          <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed mt-3 max-w-lg" style={{ color: PAL.ink2 }}>
            Your Sun sign deity is for your ego. Your <strong style={{ color: PAL.accent }}>Ishta Devata</strong> is for your soul's liberation — Moksha. Mathematically derived from your birth chart via pure Jaimini Sutra logic.
          </p>

          <div className="rounded-sm p-4 md:p-5 mt-6 max-w-lg w-full text-left"
            style={{ background: PAL.paper2, border: `1px solid ${PAL.border}` }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.accent }}>
              The Jaimini derivation
            </p>
            {[
              { step: "01", text: "Identify the Atmakaraka (AK) — the soul planet with the highest degree" },
              { step: "02", text: "Find AK's position in the D-9 Navamsa chart → the Karakamsa" },
              { step: "03", text: "The 12th house from Karakamsa reveals your Ishta Devata" },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-3 mb-2 last:mb-0">
                <span className="serif-display italic text-[12px] tabular-nums flex-shrink-0 w-6 mt-0.5" style={{ color: PAL.accent }}>
                  {item.step}
                </span>
                <p className="serif-text text-[13px] md:text-[13.5px] leading-relaxed" style={{ color: PAL.ink2 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 max-w-lg mt-6">
            {["Mathematical derivation", "Jaimini Sutram", "All divine forms", "Soul alignment", "Sadhana prescription", "90-day protocol", "Moksha path"].map(label => (
              <span key={label}
                className="serif-text text-[11.5px] font-semibold px-2.5 py-1 rounded-sm"
                style={{ color: "#5A3A8F", background: "#ECE6F4", border: `1px solid #D2C4E5` }}
              >
                {label}
              </span>
            ))}
          </div>

          <button
            onClick={generateReport}
            className="mt-7 serif-text text-[13px] font-semibold px-7 py-3 rounded-sm text-white transition-opacity hover:opacity-90"
            style={{ background: PAL.accent }}
          >
            🙏 Reveal my Ishta Devata — {FEATURE_CREDITS.ishta_devata} credits
          </button>
          <p className="serif-text italic text-[11.5px] mt-3" style={{ color: PAL.ink3 }}>
            Saved permanently · never expires · free to re-read anytime
          </p>
        </div>
      )}

      {/* LOADING */}
      {status === "loading" && !reportData && (
        <div className="flex flex-col items-center justify-center px-6 py-14 md:py-20 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
            ॥ Karakamsa Vicharah ॥
          </p>
          <h3 className="serif-display text-[24px] md:text-[28px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
            The Jaimini Sutra speaks…
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
          <h3 className="serif-display text-[20px] font-semibold mt-3" style={{ color: PAL.ink }}>Derivation failed</h3>
          <p className="serif-text text-[13.5px] italic mt-1" style={{ color: PAL.ink2 }}>{errorMsg}</p>
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
                    🙏 Ishta Devata · Jaimini revelation
                  </p>
                  <h2 className="serif-display text-[24px] md:text-[34px] font-semibold tracking-tight leading-tight">
                    {reportData.ishtaDevata}
                  </h2>
                  <p className="serif-text italic text-[13px] mt-2" style={{ color: PAL.paper2 }}>
                    Soul's chosen deity for Moksha · {profileName}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
                    style={{ background: "rgba(255,255,255,0.10)", color: PAL.paper, border: `1px solid rgba(255,255,255,0.18)` }}
                  >
                    ✓ Saved
                  </span>
                  {reportData.generatedAt && (
                    <span className="serif-text italic text-[11px]" style={{ color: PAL.paper2, opacity: 0.8 }}>
                      {new Date(reportData.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>

              <div className="h-px mt-4 mb-4" style={{ background: "rgba(255,255,255,0.12)" }} />

              {/* Derivation chain */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                {[
                  { label: "AK", value: reportData.ak },
                  { label: "Karakamsa", value: reportData.karakamsaSign },
                  { label: "12th from", value: reportData.twelfthFromKarakamsa },
                  { label: "Lord", value: reportData.twelfthLord },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="text-center">
                      <p className="text-[9px] uppercase tracking-[0.18em]" style={{ color: PAL.paper2, opacity: 0.7 }}>
                        {item.label}
                      </p>
                      <p className="serif-display text-[15px] font-semibold mt-0.5" style={{ color: PAL.paper }}>
                        {item.value}
                      </p>
                    </div>
                    {i < 3 && <span className="serif-display text-[16px]" style={{ color: PAL.paper2, opacity: 0.5 }}>→</span>}
                  </div>
                ))}
                <div className="flex items-center gap-1 ml-2">
                  <span className="serif-display text-[14px]" style={{ color: PAL.paper2, opacity: 0.5 }}>⇒</span>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.16em] px-2.5 py-1 rounded-sm"
                    style={{ background: "rgba(255,255,255,0.14)", color: PAL.paper, border: `1px solid rgba(255,255,255,0.20)` }}
                  >
                    🙏 {reportData.ishtaDevata}
                  </span>
                </div>
              </div>

              {/* All forms */}
              {reportData.allForms?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {reportData.allForms.map((form: string) => (
                    <span key={form}
                      className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-0.5 rounded-sm"
                      style={{ background: "rgba(255,255,255,0.08)", color: PAL.paper, border: `1px solid rgba(255,255,255,0.14)` }}
                    >
                      {form}
                    </span>
                  ))}
                </div>
              )}
            </motion.section>

            {/* Markdown report */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="prose-editorial-ishta"
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
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>Section</p>
                      <h2 className="serif-display text-[22px] md:text-[26px] font-semibold tracking-tight leading-tight" style={{ color: PAL.ink }}>
                        {children}
                      </h2>
                      <div className="h-px mt-3" style={{ background: `linear-gradient(to right, ${PAL.border}, transparent)` }} />
                    </div>
                  ),
                  h3: ({ children }) => (
                    <h3 className="serif-display text-[17px] md:text-[19px] font-semibold tracking-tight mt-7 mb-2.5 flex items-center gap-2" style={{ color: planetTone.ink }}>
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: planetTone.ink }} />
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="serif-display text-[15px] font-semibold mt-5 mb-2" style={{ color: PAL.ink2 }}>{children}</h4>
                  ),
                  p: ({ children }) => (
                    <p className="serif-text text-[15px] md:text-[16px] leading-[1.85] mb-4" style={{ color: PAL.ink2 }}>{children}</p>
                  ),
                  strong: ({ children }) => <strong className="font-semibold" style={{ color: PAL.ink }}>{children}</strong>,
                  em: ({ children }) => <em className="not-italic font-medium" style={{ color: planetTone.ink }}>{children}</em>,
                  hr: () => (
                    <div className="my-8 flex items-center gap-3">
                      <div className="flex-1 h-px" style={{ background: PAL.border }} />
                      <span className="serif-display italic text-[13px]" style={{ color: PAL.ink3 }}>✦</span>
                      <div className="flex-1 h-px" style={{ background: PAL.border }} />
                    </div>
                  ),
                  blockquote: ({ children }) => (
                    <div className="my-5 rounded-sm pl-4 pr-4 py-3"
                      style={{ background: planetTone.bg, border: `1px solid ${planetTone.border}`, borderLeft: `2px solid ${planetTone.ink}` }}
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
                      <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full" style={{ background: planetTone.ink }} />
                      <span className="flex-1">{children}</span>
                    </li>
                  ),
                  table: ({ children }) => (
                    <div className="my-6 overflow-x-auto rounded-sm" style={{ border: `1px solid ${PAL.border}` }}>
                      <table className="w-full text-[14px] border-collapse">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead style={{ background: planetTone.ink, color: PAL.paper }}>{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em]">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2.5 serif-text text-[13.5px]" style={{ color: PAL.ink2, borderTop: `1px solid ${PAL.border2}` }}>{children}</td>
                  ),
                  tr: ({ children }) => <tr>{children}</tr>,
                }}
              >
                {reportData.report}
              </ReactMarkdown>

              <div className="mt-10 pt-5 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px solid ${PAL.border}` }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.ink3 }}>
                  Derived via Jaimini Sutram · for spiritual guidance only
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
