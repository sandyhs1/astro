"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PAL } from "./destiny-theme";

interface RoyalRoastProps {
  profileId: string;
  profileName: string;
  isB2B?: boolean;
}

const LOADING_LINES = [
  "Pulling up your chart and keeping it real…",
  "Reading between the planetary lines…",
  "Your planets are talking. Some of them are shading you…",
  "No gemstones, just the truth…",
  "Compiling your personality at full resolution…",
  "The stars have opinions. Bracing for impact…",
];

/* Editorial tones for each category */
type ToneName = "indigo" | "rose" | "gold" | "sage" | "blue" | "ink" | "fire";
const TONES: Record<ToneName, { ink: string; bg: string; border: string }> = {
  indigo: { ink: "#5A3A8F", bg: "#ECE6F4", border: "#D2C4E5" },
  rose:   { ink: PAL.rose, bg: PAL.roseBg, border: "#E5BFC1" },
  gold:   { ink: PAL.gold, bg: PAL.amberBg, border: "#E1CE9B" },
  sage:   { ink: PAL.sage, bg: PAL.sageBg, border: "#C7D6BB" },
  blue:   { ink: "#1F4F7A", bg: "#E5EEF6", border: "#BCD0E1" },
  ink:    { ink: PAL.ink, bg: PAL.paper2, border: PAL.border },
  fire:   { ink: PAL.accent, bg: PAL.roseBg, border: "#E5BFC1" },
};

const CAT_CONFIG: Record<string, { symbol: string; label: string; intensity: string; tone: ToneName }> = {
  SELF:          { symbol: "◯", label: "Self",          intensity: "Deep",     tone: "indigo" },
  LOVE:          { symbol: "♡", label: "Love life",     intensity: "Spicy",    tone: "rose" },
  CAREER:        { symbol: "✈", label: "Career",        intensity: "Nuclear",  tone: "fire" },
  PERSONALITY:   { symbol: "◧", label: "Personality",   intensity: "Savage",   tone: "indigo" },
  MONEY:         { symbol: "₹", label: "Money",         intensity: "Brutal",   tone: "sage" },
  HEALTH:        { symbol: "✚", label: "Health",        intensity: "Real",     tone: "sage" },
  SOCIAL:        { symbol: "❀", label: "Social",        intensity: "Honest",   tone: "blue" },
  FEARS:         { symbol: "✗", label: "Secret fears",  intensity: "Exposed",  tone: "rose" },
  FAMILY:        { symbol: "⌂", label: "Family",        intensity: "Raw",      tone: "fire" },
  COMMUNICATION: { symbol: "✎", label: "Communication", intensity: "Sharp",    tone: "blue" },
  VERDICT:       { symbol: "✦", label: "Verdict",       intensity: "Final",    tone: "gold" },
};

interface RoastCard {
  category: string;
  headline: string;
  roast: string;
  proof: string;
  impact: string;
  tip: string;
}

function parseStructuredReport(raw: string): { intro: string; cards: RoastCard[] } {
  const cards: RoastCard[] = [];
  const firstSection = raw.indexOf("---SECTION---");
  const intro = firstSection > -1 ? raw.slice(0, firstSection).trim() : "";
  const blocks = raw.split("---SECTION---").slice(1);
  for (const block of blocks) {
    const end = block.indexOf("---END---");
    const content = end > -1 ? block.slice(0, end) : block;
    const get = (key: string): string => {
      const regex = new RegExp(`^${key}:\\s*(.+)`, "m");
      const match = content.match(regex);
      return match ? match[1].trim() : "";
    };
    const category = get("CATEGORY").toUpperCase();
    if (!category) continue;
    cards.push({
      category, headline: get("HEADLINE"), roast: get("ROAST"),
      proof: get("PROOF"), impact: get("IMPACT"),
      tip: get("TIP") || get("The shift"),
    });
  }
  return { intro, cards };
}

function IntensityDots({ ink }: { ink: string }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map(i => (
        <span key={i} className="w-1 h-1 rounded-full" style={{ background: i < 3 ? ink : `${ink}40` }} />
      ))}
    </span>
  );
}

function RoastCardView({ card, index }: { card: RoastCard; index: number }) {
  const cfg = CAT_CONFIG[card.category] || CAT_CONFIG["SELF"];
  const tone = TONES[cfg.tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="rounded-sm overflow-hidden"
      style={{ background: PAL.paper, border: `1px solid ${PAL.border2}` }}
    >
      {/* Category strip */}
      <div className="px-5 py-3.5" style={{ background: tone.bg, borderBottom: `1px solid ${tone.border}` }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="serif-display text-[16px]" style={{ color: tone.ink }}>{cfg.symbol}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: tone.ink }}>
            {cfg.label}
          </span>
          <IntensityDots ink={tone.ink} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: tone.ink }}>
            {cfg.intensity}
          </span>
        </div>
        <h3 className="serif-display text-[16px] md:text-[18px] font-semibold tracking-tight leading-tight mt-1" style={{ color: PAL.ink }}>
          {card.headline || cfg.label}
        </h3>
      </div>

      {/* Roast */}
      <div className="px-5 py-4">
        <p className="serif-text text-[14.5px] leading-relaxed" style={{ color: PAL.ink }}>
          {card.roast}
        </p>
      </div>

      {/* Proof */}
      {card.proof && (
        <div className="mx-5 mb-4 px-3.5 py-2.5 rounded-sm" style={{ background: tone.bg, border: `1px solid ${tone.border}` }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: tone.ink }}>
            Chart proof
          </p>
          <p className="serif-text text-[13px] leading-relaxed" style={{ color: PAL.ink2 }}>
            {card.proof.replace(/^Chart:\s*/i, "")}
          </p>
        </div>
      )}

      {/* Impact + Tip */}
      <div className="mx-5 mb-5 space-y-2.5">
        {card.impact && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: PAL.ink3 }}>
              In real life
            </p>
            <p className="serif-text text-[13px] leading-relaxed" style={{ color: PAL.ink2 }}>
              {card.impact.replace(/^In real life:\s*/i, "")}
            </p>
          </div>
        )}
        {card.tip && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: PAL.accent }}>
              {card.category === "VERDICT" ? "The shift" : "Try this"}
            </p>
            <p className="serif-display italic text-[13.5px] leading-relaxed" style={{ color: PAL.ink }}>
              {card.tip.replace(/^(Try this:|The shift:)\s*/i, "")}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function RoyalRoast({ profileId, profileName, isB2B = false }: RoyalRoastProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [reportData, setReportData] = useState<any>(null);
  const [loadingLine, setLoadingLine] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "loading") {
      timerRef.current = setInterval(() => setLoadingLine(l => (l + 1) % LOADING_LINES.length), 2200);
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
      const res = await fetch(`/api/royal-roast?profileId=${profileId}`);
      const data = await res.json();
      if (data.found && data.reportData) { setReportData(data.reportData); setStatus("done"); }
      else setStatus("idle");
    } catch { setStatus("idle"); }
  }

  async function generateRoast() {
    setStatus("loading"); setErrorMsg("");
    try {
      const res = await fetch("/api/royal-roast", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Something went wrong."); setStatus("error"); return; }
      setReportData(data); setStatus("done");
    } catch { setErrorMsg("Network error. Please try again."); setStatus("error"); }
  }

  const parsed = reportData?.report ? parseStructuredReport(reportData.report) : null;
  const gridCards = parsed?.cards.filter(c => c.category !== "VERDICT") ?? [];
  const verdictCard = parsed?.cards.find(c => c.category === "VERDICT");

  return (
    <div className="flex flex-col w-full" style={{ background: PAL.paper, color: PAL.ink }}>
      {/* Header */}
      <div
        className="px-5 md:px-7 lg:px-9 py-4 md:py-5 flex items-center justify-between gap-3 sticky top-0 z-10 backdrop-blur-md"
        style={{ background: "rgba(250,247,242,0.92)", borderBottom: `1px solid ${PAL.border2}` }}
      >
        <div className="flex items-baseline gap-3 min-w-0 flex-1">
          <span className="serif-display italic text-[18px] md:text-[22px]" style={{ color: PAL.accent }}>🔥</span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
              Royal roast
            </p>
            <h2 className="serif-display text-[16px] md:text-[20px] font-semibold leading-none tracking-tight mt-0.5 truncate" style={{ color: PAL.ink }}>
              Chart-based, unfiltered
            </h2>
            <p className="serif-text text-[11.5px] italic mt-1" style={{ color: PAL.ink3 }}>
              {reportData
                ? `${reportData.personName} · ${reportData.lagna} Rising · ${reportData.moonNak} Moon`
                : profileName}
            </p>
          </div>
        </div>
        {status === "done" && (
          <button
            onClick={() => { setStatus("idle"); setReportData(null); }}
            className="flex-shrink-0 serif-text text-[12px] font-semibold px-3 py-1.5 rounded-sm transition-colors hover:bg-black/[0.04]"
            style={{ color: PAL.ink2, border: `1px solid ${PAL.border}`, background: "transparent" }}
          >
            ↺ Regenerate
          </button>
        )}
      </div>

      {/* IDLE */}
      {status === "idle" && (
        <div className="flex flex-col items-center justify-center px-6 py-14 md:py-20 text-center">
          <div
            className="w-24 h-24 rounded-sm grid place-items-center serif-display text-[40px] mb-6"
            style={{ background: PAL.roseBg, color: PAL.accent, border: `1px solid #E5BFC1` }}
          >
            🔥
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
            Begin · roast
          </p>
          <h3 className="serif-display text-[26px] md:text-[34px] font-semibold tracking-tight leading-tight" style={{ color: PAL.ink }}>
            Ready for the truth, {profileName}?
          </h3>
          <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed mt-3 max-w-md" style={{ color: PAL.ink2 }}>
            Your birth chart has a lot to say about you. We're going to say it — with real data, a little shade, and actual encouragement.
          </p>

          {/* Category preview chips */}
          <div className="flex flex-wrap justify-center gap-1.5 max-w-xl mt-5">
            {Object.entries(CAT_CONFIG).slice(0, 8).map(([key, cfg]) => {
              const tone = TONES[cfg.tone];
              return (
                <span
                  key={key}
                  className="serif-text text-[11.5px] font-semibold px-2.5 py-1 rounded-sm"
                  style={{ color: tone.ink, background: tone.bg, border: `1px solid ${tone.border}` }}
                >
                  {cfg.symbol} {cfg.label}
                </span>
              );
            })}
            <span
              className="serif-text text-[11.5px] font-semibold px-2.5 py-1 rounded-sm"
              style={{ color: PAL.ink3, background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
            >
              + 3 more
            </span>
          </div>

          <button
            onClick={generateRoast}
            className="mt-7 serif-text text-[13px] font-semibold px-6 py-3 rounded-sm text-white transition-opacity hover:opacity-90"
            style={{ background: PAL.accent }}
          >
            🔥 Generate my royal roast — 15 credits
          </button>
          <p className="serif-text italic text-[11.5px] mt-3" style={{ color: PAL.ink3 }}>
            Saved after generation · free to re-read anytime
          </p>
        </div>
      )}

      {/* LOADING */}
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center px-6 py-14 md:py-20 text-center">
          <div className="serif-display text-[42px]" style={{ color: PAL.accent }}>🔥</div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mt-3" style={{ color: PAL.accent }}>
            Building your roast
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingLine}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="serif-display italic text-[18px] md:text-[22px] mt-3 max-w-md" style={{ color: PAL.ink }}
            >
              {LOADING_LINES[loadingLine]}
            </motion.p>
          </AnimatePresence>
          <div className="mt-5 inline-flex items-center gap-2">
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
          <h3 className="serif-display text-[20px] font-semibold mt-3" style={{ color: PAL.ink }}>Something went wrong</h3>
          <p className="serif-text text-[13.5px] italic mt-1" style={{ color: PAL.ink2 }}>{errorMsg}</p>
          <button
            onClick={generateRoast}
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
          <div className="max-w-5xl mx-auto px-4 md:px-7 lg:px-9 py-5 md:py-7">

            {/* Intro hero */}
            {parsed?.intro && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-sm overflow-hidden mb-5 md:mb-6 p-5 md:p-7"
                style={{ background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }}
              >
                <div className="flex items-start gap-3 mb-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: "#E1CE9B" }}>
                      Royal roast
                    </p>
                    <h2 className="serif-display text-[20px] md:text-[26px] font-semibold leading-tight tracking-tight mt-1">
                      {reportData.personName}'s chart, unfiltered
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {reportData.lagna && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
                        style={{ background: "rgba(255,255,255,0.10)", color: PAL.paper, border: `1px solid rgba(255,255,255,0.18)` }}
                      >
                        {reportData.lagna} Rising
                      </span>
                    )}
                    {reportData.moonNak && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
                        style={{ background: "rgba(255,255,255,0.10)", color: PAL.paper, border: `1px solid rgba(255,255,255,0.18)` }}
                      >
                        {reportData.moonNak} Moon
                      </span>
                    )}
                    {reportData.ak && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
                        style={{ background: "rgba(255,255,255,0.10)", color: PAL.paper, border: `1px solid rgba(255,255,255,0.18)` }}
                      >
                        AK · {reportData.ak}
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.12)" }} />

                <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed" style={{ color: PAL.paper2 }}>
                  {parsed.intro}
                </p>

                {reportData.dasha && (
                  <div className="mt-4 inline-flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#E1CE9B" }}>
                      Current dasha
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] px-2 py-0.5 rounded-sm"
                      style={{ background: "rgba(255,255,255,0.10)", color: PAL.paper, border: `1px solid rgba(255,255,255,0.18)` }}
                    >
                      {reportData.dasha}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* 2-col grid */}
            {gridCards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                {gridCards.map((card, i) => (
                  <RoastCardView key={card.category} card={card} index={i} />
                ))}
              </div>
            )}

            {/* Verdict */}
            {verdictCard && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="rounded-sm overflow-hidden mb-6"
                style={{ background: PAL.amberBg, border: `1px solid #E1CE9B` }}
              >
                <div className="px-5 md:px-6 py-5">
                  <div className="flex items-start gap-3 mb-3 flex-wrap">
                    <span className="serif-display text-[24px]" style={{ color: PAL.gold }}>✦</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: PAL.gold }}>
                        Overall verdict
                      </p>
                      <h3 className="serif-display text-[20px] md:text-[24px] font-semibold leading-tight tracking-tight mt-1" style={{ color: PAL.ink }}>
                        {verdictCard.headline || "The bottom line"}
                      </h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <IntensityDots ink={PAL.gold} />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mt-1" style={{ color: PAL.gold }}>
                        Final
                      </p>
                    </div>
                  </div>

                  <div className="h-px mb-4" style={{ background: "#E1CE9B" }} />

                  <p className="serif-text text-[15px] leading-relaxed mb-4" style={{ color: PAL.ink }}>
                    {verdictCard.roast}
                  </p>

                  {verdictCard.proof && (
                    <div className="rounded-sm px-3.5 py-2.5 mb-3"
                      style={{ background: PAL.paper, border: `1px solid #E1CE9B` }}
                    >
                      <p className="serif-text text-[12.5px] leading-relaxed" style={{ color: PAL.ink2 }}>
                        <strong style={{ color: PAL.gold }}>Chart proof.</strong> {verdictCard.proof.replace(/^Chart:\s*/i, "")}
                      </p>
                    </div>
                  )}

                  {verdictCard.impact && (
                    <p className="serif-text text-[13px] leading-relaxed mb-3" style={{ color: PAL.ink2 }}>
                      <strong style={{ color: PAL.ink }}>In real life.</strong> {verdictCard.impact.replace(/^In real life:\s*/i, "")}
                    </p>
                  )}

                  {verdictCard.tip && (
                    <div className="rounded-sm px-4 py-3 mt-3"
                      style={{ background: PAL.gold, color: PAL.paper, border: `1px solid ${PAL.gold}` }}
                    >
                      <p className="serif-display text-[14.5px] md:text-[15.5px] font-semibold italic">
                        ✦ The shift · {verdictCard.tip.replace(/^(The shift:|Try this:)\s*/i, "")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-5 md:px-6 py-3 flex items-center justify-between flex-wrap gap-2"
                  style={{ borderTop: `1px solid #E1CE9B`, background: PAL.paper }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.ink3 }}>
                    Based on Vedic birth chart · not medical advice
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
            )}

            {/* Fallback for unstructured */}
            {(!parsed || (parsed.cards.length === 0 && parsed.intro)) && reportData.report && (
              <div className="rounded-sm p-5 md:p-6"
                style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
              >
                <p className="serif-text text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: PAL.ink2 }}>
                  {reportData.report}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
