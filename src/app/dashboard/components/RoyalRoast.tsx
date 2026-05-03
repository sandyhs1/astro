"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RoyalRoastProps {
  profileId: string;
  profileName: string;
  isB2B?: boolean;
}

const LOADING_LINES = [
  "Pulling up your chart and keeping it real...",
  "Reading between the planetary lines...",
  "Your planets are talking. Some of them are shading you...",
  "No gemstones, just the truth...",
  "Compiling your personality at full resolution...",
  "The stars have opinions. Bracing for impact...",
];

const CAT_CONFIG: Record<string, { emoji: string; color: string; bg: string; label: string; intensity: string }> = {
  SELF:          { emoji: "🪞", color: "#6366F1", bg: "#EEF2FF", label: "Self",                  intensity: "Deep" },
  LOVE:          { emoji: "💘", color: "#EC4899", bg: "#FDF2F8", label: "Love Life",             intensity: "Spicy" },
  CAREER:        { emoji: "🚀", color: "#F59E0B", bg: "#FFFBEB", label: "Career",                intensity: "Nuclear" },
  PERSONALITY:   { emoji: "🎭", color: "#8B5CF6", bg: "#F5F3FF", label: "Personality",           intensity: "Savage" },
  MONEY:         { emoji: "💸", color: "#10B981", bg: "#ECFDF5", label: "Money",                 intensity: "Brutal" },
  HEALTH:        { emoji: "🏋️", color: "#14B8A6", bg: "#F0FDFA", label: "Health",                intensity: "Real" },
  SOCIAL:        { emoji: "🫂", color: "#3B82F6", bg: "#EFF6FF", label: "Social",                intensity: "Honest" },
  FEARS:         { emoji: "😰", color: "#EF4444", bg: "#FEF2F2", label: "Secret Fears",          intensity: "Exposed" },
  FAMILY:        { emoji: "🏡", color: "#F97316", bg: "#FFF7ED", label: "Family",                intensity: "Raw" },
  COMMUNICATION: { emoji: "🗣️", color: "#06B6D4", bg: "#ECFEFF", label: "Communication",         intensity: "Sharp" },
  VERDICT:       { emoji: "🏆", color: "#D97706", bg: "#FFFBEB", label: "Verdict",               intensity: "Final" },
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

  // Extract intro (before first ---SECTION---)
  const firstSection = raw.indexOf("---SECTION---");
  const intro = firstSection > -1 ? raw.slice(0, firstSection).trim() : "";

  // Extract each section block
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
      category,
      headline:  get("HEADLINE"),
      roast:     get("ROAST"),
      proof:     get("PROOF"),
      impact:    get("IMPACT"),
      tip:       get("TIP") || get("The shift"),
    });
  }

  return { intro, cards };
}

function IntensityDots({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0,1,2,3,4].map(i => (
        <div key={i} className="w-2 h-2 rounded-full" style={{ background: i < 3 ? color : `${color}30` }} />
      ))}
    </div>
  );
}

function RoastCard({ card, index }: { card: RoastCard; index: number }) {
  const cfg = CAT_CONFIG[card.category] || CAT_CONFIG["SELF"];
  const isVerdict = card.category === "VERDICT";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={`relative rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-shadow duration-300 ${
        isVerdict ? "col-span-full" : ""
      }`}
      style={{ borderColor: `${cfg.color}25` }}
    >
      {/* Top color bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${cfg.color}, ${cfg.color}60)` }} />

      {/* Header row */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: cfg.bg }}
          >
            {cfg.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[9px] font-black uppercase tracking-[0.18em]"
                style={{ color: cfg.color }}
              >
                {cfg.label}
              </span>
              <IntensityDots color={cfg.color} />
              <span
                className="text-[9px] font-black uppercase tracking-wider"
                style={{ color: cfg.color }}
              >
                {cfg.intensity}
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-[15px] leading-snug mt-0.5">
              {card.headline || cfg.label}
            </h3>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px" style={{ background: `${cfg.color}18` }} />

      {/* Roast text */}
      <div className="px-5 py-3">
        <p className="text-slate-700 text-sm leading-relaxed">{card.roast}</p>
      </div>

      {/* Chart proof */}
      {card.proof && (
        <div className="mx-5 mb-3 px-3.5 py-2.5 rounded-xl" style={{ background: cfg.bg }}>
          <div className="flex items-start gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider flex-shrink-0 mt-0.5" style={{ color: cfg.color }}>
              🔭
            </span>
            <p className="text-[12px] font-semibold text-slate-600 leading-relaxed">
              {card.proof.replace(/^Chart:\s*/i, "")}
            </p>
          </div>
        </div>
      )}

      {/* Impact + Tip */}
      <div className="mx-5 mb-4 space-y-2">
        {card.impact && (
          <div className="flex items-start gap-2">
            <span className="text-[11px] font-black text-slate-400 mt-0.5 flex-shrink-0">⚡</span>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-600">In real life: </span>
              {card.impact.replace(/^In real life:\s*/i, "")}
            </p>
          </div>
        )}
        {card.tip && (
          <div className="flex items-start gap-2">
            <span className="text-[11px] mt-0.5 flex-shrink-0">
              {card.category === "VERDICT" ? "🔑" : "💡"}
            </span>
            <p className="text-[12px] leading-relaxed font-semibold" style={{ color: cfg.color }}>
              <span className="font-black">
                {card.category === "VERDICT" ? "The shift: " : "Try this: "}
              </span>
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
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/royal-roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Something went wrong."); setStatus("error"); return; }
      setReportData(data);
      setStatus("done");
    } catch { setErrorMsg("Network error. Please try again."); setStatus("error"); }
  }

  const parsed = reportData?.report ? parseStructuredReport(reportData.report) : null;
  // Split cards: first 10 in 2-col grid, verdict (index 10) full-width
  const gridCards = parsed?.cards.filter(c => c.category !== "VERDICT") ?? [];
  const verdictCard = parsed?.cards.find(c => c.category === "VERDICT");

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-xl">🔥</div>
          <div>
            <h2 className="font-black text-slate-900 text-base leading-tight">Royal Roast</h2>
            <p className="text-[11px] text-slate-400 font-medium">
              {reportData ? `${reportData.personName} · ${reportData.lagna} Rising · ${reportData.moonNak} Moon` : `Chart-based personality breakdown · ${profileName}`}
            </p>
          </div>
        </div>
        {status === "done" && (
          <button
            onClick={() => { setStatus("idle"); setReportData(null); }}
            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 border border-slate-200 bg-white"
          >
            ↺ Regenerate
          </button>
        )}
      </div>

      {/* ── IDLE ── */}
      {status === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-100 to-red-100 border border-red-200 flex items-center justify-center text-4xl shadow-sm">
            🔥
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Ready for the truth, {profileName}?</h3>
            <p className="text-slate-500 mt-2 max-w-sm text-sm leading-relaxed">
              Your birth chart has a lot to say about you. We're going to say it — with real data, a little shade, and actual encouragement.
            </p>
          </div>
          {/* Category preview chips */}
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {Object.entries(CAT_CONFIG).slice(0, 8).map(([key, cfg]) => (
              <span key={key} className="text-[11px] font-bold px-3 py-1.5 rounded-full"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}28` }}>
                {cfg.emoji} {cfg.label}
              </span>
            ))}
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">+3 more</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={generateRoast}
              className="px-8 py-3.5 rounded-xl font-black text-white text-sm shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg, #F97316, #EF4444)" }}
            >
              🔥 Generate My Royal Roast — 15 Credits
            </button>
            <p className="text-[10px] text-slate-400 font-medium">Saved after generation · Free to re-read anytime</p>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {status === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
          <div className="text-5xl animate-bounce">🔥</div>
          <div className="text-center space-y-2">
            <div className="font-black text-slate-900 text-base">Building your Royal Roast...</div>
            <AnimatePresence mode="wait">
              <motion.p key={loadingLine} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-sm text-slate-400 font-medium">
                {LOADING_LINES[loadingLine]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex gap-1.5">
            {[0,1,2,3].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-orange-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── ERROR ── */}
      {status === "error" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="text-5xl">😬</div>
          <div>
            <h3 className="font-black text-slate-900">Something went wrong</h3>
            <p className="text-sm text-slate-500 mt-1">{errorMsg}</p>
          </div>
          <button onClick={generateRoast} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
            Try Again
          </button>
        </div>
      )}

      {/* ── DONE ── */}
      {status === "done" && reportData && (
        <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">

            {/* Intro Hero */}
            {parsed?.intro && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-2xl overflow-hidden mb-6 p-6 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 shadow-lg shadow-orange-100"
              >
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 60%)" }} />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">Royal Roast</span>
                      <h2 className="text-lg font-black text-white leading-tight">
                        {reportData.personName}'s Chart, Unfiltered
                      </h2>
                    </div>
                    <div className="ml-auto flex flex-col items-end gap-1">
                      {reportData.lagna && <span className="text-[11px] bg-white/20 text-white px-2.5 py-1 rounded-full font-bold">{reportData.lagna} Rising</span>}
                      {reportData.moonNak && <span className="text-[11px] bg-white/20 text-white px-2.5 py-1 rounded-full font-bold">{reportData.moonNak} Moon</span>}
                      {reportData.ak && <span className="text-[11px] bg-white/20 text-white px-2.5 py-1 rounded-full font-bold">AK: {reportData.ak}</span>}
                    </div>
                  </div>
                  <div className="h-px bg-white/20 mb-3" />
                  <p className="text-white/90 text-sm leading-relaxed font-medium">{parsed.intro}</p>
                  {reportData.dasha && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white/50">Current Dasha</span>
                      <span className="text-[11px] bg-white/15 text-white/90 px-2.5 py-1 rounded-full font-bold">{reportData.dasha}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 2-column card grid */}
            {gridCards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {gridCards.map((card, i) => (
                  <RoastCard key={card.category} card={card} index={i} />
                ))}
              </div>
            )}

            {/* Verdict — full width gold */}
            {verdictCard && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="rounded-2xl overflow-hidden border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-sm mb-6"
              >
                <div className="h-1 bg-gradient-to-r from-amber-400 to-yellow-400" />
                <div className="px-6 pt-5 pb-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">🏆</div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">Overall Verdict</span>
                      <h3 className="font-black text-slate-900 text-base leading-tight">
                        {verdictCard.headline || "The Bottom Line"}
                      </h3>
                    </div>
                    <div className="ml-auto">
                      <div className="flex gap-1">
                        {[0,1,2,3,4].map(i => (
                          <div key={i} className="w-2 h-2 rounded-full bg-amber-400" />
                        ))}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-500">Final</span>
                    </div>
                  </div>
                  <div className="h-px bg-amber-200 mb-3" />
                  <p className="text-slate-700 text-sm leading-relaxed mb-3">{verdictCard.roast}</p>
                  {verdictCard.proof && (
                    <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-100 mb-3">
                      <p className="text-[12px] font-semibold text-slate-600">
                        🔭 {verdictCard.proof.replace(/^Chart:\s*/i, "")}
                      </p>
                    </div>
                  )}
                  {verdictCard.impact && (
                    <p className="text-[12px] text-slate-500 mb-2">
                      <span className="font-bold text-slate-600">⚡ In real life: </span>
                      {verdictCard.impact.replace(/^In real life:\s*/i, "")}
                    </p>
                  )}
                  {verdictCard.tip && (
                    <div className="mt-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 shadow-sm">
                      <p className="text-sm font-black text-white">
                        🔑 The shift: {verdictCard.tip.replace(/^(The shift:|Try this:)\s*/i, "")}
                      </p>
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 flex items-center justify-between border-t border-amber-100 mt-3">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    Based on Vedic birth chart · Not medical advice
                  </p>
                  <button onClick={() => window.print()} className="text-[11px] text-slate-400 hover:text-slate-600 font-bold transition-colors flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                    </svg>
                    Print
                  </button>
                </div>
              </motion.div>
            )}

            {/* Fallback: if LLM didn't use structured format, render raw */}
            {(!parsed || (parsed.cards.length === 0 && parsed.intro)) && reportData.report && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{reportData.report}</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
