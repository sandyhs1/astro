"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PAL, PLANET_TONE } from "./destiny-theme";

const LOADING_LINES = [
  "Aligning Jaimini astrological algorithms…",
  "Calculating Atmakaraka and Amatyakaraka coordinates…",
  "Decoding physical and emotional biorhythms…",
  "Syncing lunar frequency matrices…",
  "Formulating your exact Soul blueprint…",
  "Writing your Quantum Karma analysis…",
];

const KARAKA_LABEL: Record<string, { short: string; symbol: string; desc: string; tone: keyof typeof PLANET_TONE }> = {
  Atmakaraka:    { short: "Soul Planet",     symbol: "✦", desc: "Your soul's mission. The single most powerful planet in your chart.",            tone: "Saturn"  },
  Amatyakaraka:  { short: "Career Planet",   symbol: "◆", desc: "Defines your career path, authority, and the mentor who shapes you.",            tone: "Jupiter" },
  Bhratrikaraka: { short: "Sibling Planet",  symbol: "◇", desc: "Your sibling energy, courage, short journeys, and co-workers.",                  tone: "Mars"    },
  Matrikaraka:   { short: "Mother Planet",   symbol: "☾", desc: "Home, emotions, mother figure, and your inner security.",                       tone: "Moon"    },
  Pitrikaraka:   { short: "Father Planet",   symbol: "☉", desc: "Father figure, dharma, higher learning, and long journeys.",                    tone: "Sun"     },
  Putrakaraka:   { short: "Children Planet", symbol: "✧", desc: "Children, intelligence, past-life blessings, creative expression.",              tone: "Mercury" },
  Gnatikaraka:   { short: "Obstacle Planet", symbol: "⚔", desc: "Competitors, disease, enemies, and karmic blocks to overcome.",                  tone: "Mars"    },
  Darakaraka:    { short: "Partner Planet",  symbol: "♡", desc: "Spouse, business partner, and the energy of key relationships.",                tone: "Venus"   },
};

const BIO_LABEL: Record<string, { label: string; tone: "rose" | "purple" | "blue" | "sage" }> = {
  physical:     { label: "Physical",     tone: "rose"   },
  emotional:    { label: "Emotional",    tone: "purple" },
  intellectual: { label: "Intellectual", tone: "blue"   },
  average:      { label: "Overall",      tone: "sage"   },
};

const BIO_BAR: Record<string, string> = {
  rose:   "#9C2A3F",
  purple: "#5A3A8F",
  blue:   "#1F4F7A",
  sage:   "#4F7A4D",
};

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
    <div data-lenis-prevent className="flex flex-col w-full" style={{ background: PAL.paper, color: PAL.ink }}>
      {/* ── Header ── */}
      <div
        className="px-5 md:px-7 lg:px-9 py-4 md:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-10 backdrop-blur-md"
        style={{ background: "rgba(250,247,242,0.92)", borderBottom: `1px solid ${PAL.border2}` }}
      >
        <div className="flex items-baseline gap-3">
          <span className="serif-display italic text-[18px] md:text-[22px]" style={{ color: PAL.accent }}>✦</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
              Your purpose
            </p>
            <h2 className="serif-display text-[18px] md:text-[22px] font-semibold leading-none tracking-tight mt-0.5" style={{ color: PAL.ink }}>
              Soul code · Jaimini blueprint
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

      {/* ── IDLE ── */}
      {status === "idle" && (
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-14 md:py-20 text-center">
          <div
            className="w-24 h-24 rounded-sm grid place-items-center serif-display text-[40px] mb-7"
            style={{ background: PAL.paper2, color: PAL.accent, border: `1px solid ${PAL.border}` }}
          >
            ✦
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
            Begin · soul blueprint
          </p>
          <h3 className="serif-display text-[28px] md:text-[36px] font-semibold tracking-tight leading-tight" style={{ color: PAL.ink }}>
            Decode your soul blueprint.
          </h3>
          <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed mt-3 max-w-md" style={{ color: PAL.ink2 }}>
            Your Jaimini Karakas reveal your exact soul contracts — who you're meant to become, what you're here to build, and the karmic patterns running your life on autopilot.
          </p>
          <button
            onClick={generateReport}
            className="mt-7 serif-text text-[13px] font-semibold px-6 py-3 rounded-sm text-white transition-opacity hover:opacity-90"
            style={{ background: PAL.accent }}
          >
            Generate soul blueprint
          </button>
        </div>
      )}

      {/* ── LOADING ── */}
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-14 md:py-20 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
            Live cosmic computation
          </p>
          <h3 className="serif-display text-[24px] md:text-[28px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
            Consulting the astro-engine…
          </h3>
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingLine}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="serif-text italic text-[13.5px] mt-3 max-w-sm"
              style={{ color: PAL.ink2 }}
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

      {/* ── ERROR ── */}
      {status === "error" && (
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-14 text-center">
          <div className="serif-display text-[42px]" style={{ color: PAL.rose }}>⚠︎</div>
          <h3 className="serif-display text-[20px] font-semibold mt-3" style={{ color: PAL.ink }}>
            Generation failed
          </h3>
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

      {/* ── DONE ── */}
      {status === "done" && parsed && (
        <div className="flex-1 w-full">
          {/* Tab switcher */}
          <div className="px-5 md:px-7 lg:px-9 pt-5 md:pt-7 pb-0 flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setTab("karakas")}
              className="serif-text text-[13px] font-semibold px-4 py-2.5 rounded-sm transition-colors whitespace-nowrap flex-shrink-0"
              style={
                tab === "karakas"
                  ? { background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }
                  : { background: "transparent", color: PAL.ink2, border: `1px solid ${PAL.border}` }
              }
            >
              ✦ Your karakas
            </button>
            <button
              onClick={() => setTab("biorhythm")}
              className="serif-text text-[13px] font-semibold px-4 py-2.5 rounded-sm transition-colors whitespace-nowrap flex-shrink-0"
              style={
                tab === "biorhythm"
                  ? { background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }
                  : { background: "transparent", color: PAL.ink2, border: `1px solid ${PAL.border}` }
              }
            >
              ◐ Your frequency
            </button>
          </div>

          {/* KARAKAS */}
          {tab === "karakas" && (
            <div className="px-4 md:px-7 lg:px-9 py-5 md:py-7 space-y-5">
              {parsed.karakasIntro && (
                <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed max-w-3xl" style={{ color: PAL.ink2 }}>
                  {parsed.karakasIntro}
                </p>
              )}

              <div className="space-y-2.5">
                {parsed.karakas.map((k, i) => {
                  const meta = KARAKA_LABEL[k.name] ?? { short: "Soul indicator", symbol: "◯", desc: k.meaning, tone: "Saturn" as const };
                  const tone = PLANET_TONE[meta.tone];
                  const isExpanded = expandedKaraka === i;
                  return (
                    <div
                      key={i}
                      className="rounded-sm overflow-hidden transition-all"
                      style={{
                        background: isExpanded ? tone.bg : PAL.paper,
                        border: `1px solid ${isExpanded ? tone.border : PAL.border2}`,
                      }}
                    >
                      <button
                        onClick={() => setExpandedKaraka(isExpanded ? null : i)}
                        className="w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors"
                      >
                        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                          <span
                            className="w-10 h-10 md:w-11 md:h-11 rounded-sm grid place-items-center serif-display text-[18px] flex-shrink-0"
                            style={{ background: PAL.paper, color: tone.ink, border: `1px solid ${tone.border}` }}
                          >
                            {meta.symbol}
                          </span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: tone.ink, opacity: 0.85 }}>
                              {meta.short}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <h3 className="serif-display text-[18px] md:text-[20px] font-semibold tracking-tight leading-none" style={{ color: PAL.ink }}>
                                {k.name}
                              </h3>
                              <span
                                className="text-[10px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
                                style={{ color: tone.ink, background: PAL.paper, border: `1px solid ${tone.border}` }}
                              >
                                {k.planet}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="serif-display italic text-[14px] flex-shrink-0 ml-2 transition-transform"
                          style={{ color: tone.ink, transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                        >
                          ›
                        </span>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 md:px-5 pb-5 md:pb-6 pt-4 space-y-5" style={{ borderTop: `1px solid ${tone.border}` }}>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: tone.ink, opacity: 0.85 }}>
                                  Cosmic role
                                </p>
                                <p className="serif-text text-[14px] md:text-[15px] leading-relaxed" style={{ color: PAL.ink2 }}>
                                  {meta.desc}
                                </p>
                              </div>
                              <div className="rounded-sm p-4" style={{ background: PAL.paper, border: `1px solid ${tone.border}` }}>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: tone.ink }}>
                                  Your impact
                                </p>
                                <p className="serif-display text-[15px] md:text-[16px] font-semibold leading-relaxed" style={{ color: PAL.ink }}>
                                  {k.impact}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: tone.ink, opacity: 0.85 }}>
                                  What you must do
                                </p>
                                <div className="flex gap-3 items-start">
                                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: tone.ink }} />
                                  <p className="serif-text text-[14px] md:text-[15px] leading-relaxed" style={{ color: PAL.ink2 }}>
                                    {k.significance}
                                  </p>
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

          {/* BIORHYTHM */}
          {tab === "biorhythm" && bio && (
            <div className="px-4 md:px-7 lg:px-9 py-5 md:py-7 space-y-7">
              {parsed.biorhythmIntro && (
                <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed max-w-3xl" style={{ color: PAL.ink2 }}>
                  {parsed.biorhythmIntro}
                </p>
              )}

              {/* Energy meters */}
              <section className="rounded-sm p-5 md:p-6"
                style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5" style={{ color: PAL.accent }}>
                  Current energy levels
                </p>
                <div className="space-y-5">
                  {(["physical", "emotional", "intellectual", "average"] as const).map((key) => {
                    const val = bio[key];
                    const meta = BIO_LABEL[key];
                    const positive = val.percent >= 0;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="serif-display text-[15px] font-semibold" style={{ color: PAL.ink }}>
                            {meta.label}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm tabular-nums"
                            style={
                              positive
                                ? { color: PAL.sage, background: PAL.sageBg, border: `1px solid #C7D6BB` }
                                : { color: PAL.rose, background: PAL.roseBg, border: `1px solid #E5BFC1` }
                            }
                          >
                            {val.percent > 0 ? "+" : ""}{val.percent}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: PAL.border2 }}>
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.abs(val.percent)}%`,
                              background: BIO_BAR[meta.tone],
                              opacity: positive ? 1 : 0.6,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Moon Bird */}
              {parsed.moonBird && (
                <section className="rounded-sm p-5 md:p-7"
                  style={{ background: PAL.amberBg, border: `1px solid #E1CE9B` }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="w-12 h-12 rounded-sm grid place-items-center serif-display text-[22px] flex-shrink-0"
                      style={{ background: PAL.paper, color: PAL.gold, border: `1px solid #E1CE9B` }}
                    >
                      ◈
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.gold }}>
                        Pancha Pakshi · lunar bird
                      </p>
                      <p className="serif-display text-[24px] md:text-[28px] font-semibold tracking-tight leading-none mt-1" style={{ color: PAL.ink }}>
                        {parsed.moonBird}
                      </p>
                    </div>
                  </div>
                  <p className="serif-text text-[14px] md:text-[15px] leading-relaxed mt-3 max-w-2xl" style={{ color: PAL.ink2 }}>
                    Your lunar energy cycles are governed by your birth bird. It defines your peak activity windows and optimal rest cycles throughout each day. Aligning with your bird's frequency minimises friction in daily life.
                  </p>
                </section>
              )}

              {/* Action plan */}
              <section>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.accent }}>
                  Your frequency action plan
                </p>
                <div className="rounded-sm p-5 md:p-7"
                  style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
                >
                  <p className="serif-text text-[14.5px] md:text-[15.5px] leading-[1.85] whitespace-pre-line" style={{ color: PAL.ink }}>
                    {parsed.biorhythmActionPlan}
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
