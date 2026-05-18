"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PAL } from "./destiny-theme";

interface RoadmapFeature {
  id: string;
  symbol: string;
  number: string;
  title: string;
  tagline: string;
  intelligence: string;
  impact: string;
  vedicCore: string[];
  tier: "flagship" | "premium" | "core";
}

const FEATURES: RoadmapFeature[] = [
  { id: "birth-verifier", symbol: "✦", number: "01", title: "Birth Chart Accuracy Verifier",
    tagline: "Your chart is only as precise as your birth time. Most people's are wrong.",
    intelligence: "A conversational AI-driven Temporal Audit powered by a proprietary Multi-Factor Logic Stack. Your chart is cross-referenced against the gravitational signatures of your actual lived experience. The engine executes BCP/BSP analysis, Kunda Method triangulation, Tattwa Shuddhi verification, Pranapada Lagna Validation, and Varga-Vimshaka Scoring across multiple divisional layers. The result: a chart that is provably, mathematically yours.",
    impact: "Every insight, prediction, and report you have ever received is only as accurate as your birth time. This feature fixes the foundation. Everything that comes after becomes exponentially more precise.",
    vedicCore: ["BCP/BSP Analysis", "Tattwa Shuddhi", "Pranapada Validation", "Varga-Vimshaka Scoring", "Kunda Method"],
    tier: "flagship" },
  { id: "muhurta", symbol: "◈", number: "02", title: "Muhurta Optimizer",
    tagline: "The right action at the wrong moment produces the wrong result. Every time.",
    intelligence: "An Electional Astrology Engine that deploys a fine-tuned frontier model against your exact natal configuration and the real-time planetary sky. It identifies the single most auspicious window — down to the hour — for signing a contract, launching a venture, proposing a partnership, or making any irreversible life decision. No consumer intelligence platform has built this with this level of Vedic precision.",
    impact: "The difference between success and failure is often not effort or talent — it is timing. This engine gives you the same temporal intelligence that generations of Maharajahs and builders relied on before executing the most important moments of their lives.",
    vedicCore: ["Panchanga Analysis", "Lagna Shuddhi", "Tara Bala", "Chandra Bala", "Vara & Tithi Scoring"],
    tier: "flagship" },
  { id: "synastry", symbol: "◇", number: "03", title: "Soul Contract Report",
    tagline: "You did not meet by accident. The question is: what do you owe each other?",
    intelligence: "A two-chart karmic fusion engine that goes far beyond surface-level Guna Milan. Our intelligence layer computes Navamsha overlay compatibility, Upapada Lagna axis alignment, cross-Dasha synchronisation, Mangal Dosha evaluation in full context, and a five-domain Soul Contract Score. This is multi-layer, multi-divisional analysis — not the oversimplified Ashtakoota matching that every basic app performs.",
    impact: "Understanding the karmic architecture of your most important relationships transforms how you navigate them. You stop fighting the contract. You start fulfilling it — consciously.",
    vedicCore: ["Navamsha Overlay", "Upapada Lagna Axis", "Dasha Synchronisation", "Mangal Dosha (Contextual)", "Jaimini Karakas"],
    tier: "flagship" },
  { id: "varshaphal", symbol: "☼", number: "04", title: "Annual Solar Return — Varshaphal",
    tagline: "Every year, a new chart is born. Most people never read it.",
    intelligence: "At the exact moment the Sun returns to its natal degree, an entirely new annual chart is cast — the Varshaphal. This chart governs every domain of your life for the next twelve months. Our frontier model delivers a structured year-ahead intelligence briefing: active houses, Dasha-solar return intersections, Muntha progression, and Panchadhayee lords for your specific year.",
    impact: "Stop navigating the year blind. Know in advance which periods demand bold action, which demand stillness, and which carry your single highest-probability window for breakthrough.",
    vedicCore: ["Varshaphal Lagna", "Muntha Progression", "Panchadhayee Lords", "Varsha Pati", "Tajika Yogas"],
    tier: "premium" },
  { id: "dasha-timeline", symbol: "◐", number: "05", title: "Dasha Progression Timeline",
    tagline: "Your entire life — past, present, and future — mapped against the cosmos.",
    intelligence: "A fully interactive visual timeline of your Vimshottari Dasha sequence from birth onwards. Past Dashas are mapped against your annotated life events — you will see, with undeniable clarity, how every major chapter corresponded to a specific planetary period. Future Dashas are rendered with AI-generated predictions for each sub-period.",
    impact: "When you can see your life as a precisely orchestrated karmic sequence rather than random events, the panic around difficult periods dissolves. The clarity around upcoming opportunities sharpens into strategic intention.",
    vedicCore: ["Vimshottari Dasha", "Antardasha Mapping", "Pratyantar Dasha", "Dasha Sandhi Analysis", "Life Event Correlation"],
    tier: "premium" },
  { id: "medical", symbol: "✚", number: "06", title: "Medical Karma Report",
    tagline: "Your body is not malfunctioning. It is delivering a karmic message.",
    intelligence: "A precision health-karma intelligence layer built on the 6th house, its lord, the Arudha of the 6th (A6), Saturn's placement, Rahu's influence axis, and the Shashthamsha (D6 chart). The engine identifies which organ systems are under karmic pressure in the current Dasha — not as medical diagnosis, but as a roadmap of where your body is asking for conscious attention. Includes Ayurvedic Prakriti correlation.",
    impact: "The body speaks the language of karma before it speaks the language of disease. Reading this report gives you the intelligence to intervene at the right level — before karmic pressure becomes a physical crisis.",
    vedicCore: ["6th House Analysis", "Arudha A6", "Shashthamsha D6", "Saturn-Rahu Axis", "Ayurvedic Prakriti"],
    tier: "premium" },
  { id: "family-karma", symbol: "❑", number: "07", title: "Family Karma Matrix",
    tagline: "Your family is not random. It is your most complex karmic assignment.",
    intelligence: "A multi-chart cross-analysis engine that overlays all family profiles in your account. The intelligence layer identifies Dasha confluence zones — periods when multiple family members are simultaneously under malefic or benefic planetary periods. It surfaces the 3 dominant karmic themes across the family lineage and identifies which soul contracts are active between specific members.",
    impact: "Family conflict is almost never what it appears to be. When you can see the karmic architecture beneath the surface, you gain the power to consciously evolve it instead of unconsciously repeating it.",
    vedicCore: ["Inter-chart Dasha Overlay", "Jaimini Karakas", "12th Lord Contracts", "Graha Drishti Cross-Chart", "Lagna Lord Synergy"],
    tier: "core" },
  { id: "daily-briefing", symbol: "◴", number: "08", title: "Daily Cosmic Briefing",
    tagline: "Every morning. Your chart. Today's sky. Three lines that change how you move.",
    intelligence: "A personalised daily intelligence card generated fresh every morning. The engine computes the real-time transit overlay against your natal chart, identifies the dominant planetary energy of the day specifically for your configuration, and delivers: one primary opportunity, one action directive, and one caution — all grounded in Vedic transit logic and your active Dasha. Not generic horoscope content. Your chart, today's sky, precise output.",
    impact: "The highest performers in any field operate in alignment with their natural cycles, not against them. This feature trains you to move with your karmic current — every single day.",
    vedicCore: ["Gochara Transit Analysis", "Ashtakavarga Daily Score", "Moon Nakshatra Transit", "Dasha-Transit Confluence", "Yoga Formation Detection"],
    tier: "core" },
  { id: "journal", symbol: "✎", number: "09", title: "Quantum Journal",
    tagline: "Your life events are data. Over time, patterns emerge that will change everything.",
    intelligence: "A chart-linked journaling interface where every entry is automatically tagged with your active Dasha, Gochara transit energy, Moon's Nakshatra, and lunar phase at the moment of writing. Over time, our pattern recognition engine surfaces correlations: 'You consistently feel a surge of creative energy when Jupiter transits your 5th house.' Evidence-based self-awareness.",
    impact: "This journal becomes the most precise mirror you have ever looked into — not just recording your life, but revealing the invisible forces shaping it.",
    vedicCore: ["Dasha-Tagged Entries", "Nakshatra Phase Logging", "Gochara Correlation Engine", "Moon Phase Mapping", "Yoga-Event Pattern Recognition"],
    tier: "core" },
  { id: "qk-score", symbol: "❖", number: "10", title: "Quantum Karma Score",
    tagline: "A single number that tells you the truth about where you stand in the cosmos.",
    intelligence: "A proprietary composite intelligence metric — the first of its kind — that synthesises your active Yoga strength (Rajayoga, Dhana Yoga, Viparita Raja Yoga), Dasha quality scoring, current Gochara Bindu count from Ashtakavarga, Shadbala planetary strengths, and transit confluence into a single dynamic score between 0 and 1000. Updated on a rolling basis. Tracked over time.",
    impact: "You cannot optimise what you cannot measure. The Quantum Karma Score is the world's first precision instrument for measuring your karmic momentum.",
    vedicCore: ["Yoga Activation Scoring", "Ashtakavarga Bindu Synthesis", "Shadbala Composite", "Dasha Quality Index", "Transit Confluence Score"],
    tier: "core" },
  { id: "shadbala", symbol: "⚖", number: "11", title: "Shadbala Strength Report",
    tagline: "Not all planets in your chart are equal. Most astrologers never check which ones truly have power.",
    intelligence: "A full computational rendering of the six classical Vedic planetary strength metrics: Sthana Bala (positional), Dig Bala (directional), Kala Bala (temporal), Chesta Bala (motional), Naisargika Bala (natural), and Drig Bala (aspectual). Each planet receives a precise Rupas score. The visual strength dashboard immediately shows which planets are genuinely capable of delivering their significations — and which are weakened.",
    impact: "A planet in exaltation is not necessarily powerful. A planet in debilitation is not necessarily weak. Shadbala reveals the actual force behind every planet — so you know which ones to activate and which to mitigate.",
    vedicCore: ["Sthana Bala", "Dig Bala", "Kala Bala", "Chesta Bala", "Naisargika + Drig Bala"],
    tier: "core" },
];

const TIER_TONE: Record<string, { label: string; ink: string; bg: string; border: string }> = {
  flagship: { label: "Flagship", ink: PAL.gold, bg: PAL.amberBg, border: "#E1CE9B" },
  premium:  { label: "Premium",  ink: "#5A3A8F", bg: "#ECE6F4", border: "#D2C4E5" },
  core:     { label: "Core",     ink: "#1F4F7A", bg: "#E5EEF6", border: "#BCD0E1" },
};

interface Props { onClose?: () => void }

function FeatureCard({ f, index }: { f: RoadmapFeature; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const tone = TIER_TONE[f.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: "easeOut" }}
      className="rounded-sm overflow-hidden mb-3"
      style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4 mb-3">
          {/* Symbol + number */}
          <div className="flex-shrink-0 text-center">
            <span className="serif-display italic text-[12px] tabular-nums" style={{ color: PAL.accent }}>
              № {f.number}
            </span>
            <div className="serif-display text-[28px] leading-none mt-1" style={{ color: tone.ink }}>
              {f.symbol}
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h3 className="serif-display text-[17px] md:text-[20px] font-semibold tracking-tight leading-tight" style={{ color: PAL.ink }}>
              {f.title}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
                style={{ color: tone.ink, background: tone.bg, border: `1px solid ${tone.border}` }}
              >
                {tone.label}
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
                style={{ color: PAL.sage, background: PAL.sageBg, border: `1px solid #C7D6BB` }}
              >
                Coming soon
              </span>
            </div>
          </div>
        </div>

        {/* Tagline (pull quote) */}
        <div
          className="mt-3 px-4 py-3 rounded-sm"
          style={{ background: PAL.paper2, borderLeft: `2px solid ${tone.ink}` }}
        >
          <p className="serif-display italic text-[13.5px] md:text-[15px] leading-snug" style={{ color: tone.ink }}>
            &ldquo;{f.tagline}&rdquo;
          </p>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setExpanded(o => !o)}
          className="w-full text-[11px] font-semibold uppercase tracking-[0.22em] py-3 mt-1 flex items-center justify-between transition-opacity hover:opacity-70"
          style={{ color: PAL.accent }}
        >
          <span>{expanded ? "Hide details" : "Explore intelligence layer"}</span>
          <span className="serif-display italic transition-transform" style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pb-2">
                <div className="rounded-sm p-4" style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: PAL.ink3 }}>
                    The intelligence layer
                  </p>
                  <p className="serif-text text-[13.5px] leading-relaxed" style={{ color: PAL.ink2 }}>
                    {f.intelligence}
                  </p>
                </div>

                <div className="rounded-sm p-4" style={{ background: PAL.amberBg, border: `1px solid #E1CE9B` }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: PAL.gold }}>
                    Why it changes everything
                  </p>
                  <p className="serif-text italic text-[13.5px] leading-relaxed" style={{ color: PAL.ink }}>
                    {f.impact}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.ink3 }}>
                    Vedic computation core
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.vedicCore.map(v => (
                      <span
                        key={v}
                        className="serif-text text-[11.5px] font-semibold px-2.5 py-1 rounded-sm"
                        style={{ color: tone.ink, background: tone.bg, border: `1px solid ${tone.border}` }}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Roadmap({ onClose }: Props) {
  const flagship = FEATURES.filter(f => f.tier === "flagship");
  const premium  = FEATURES.filter(f => f.tier === "premium");
  const core     = FEATURES.filter(f => f.tier === "core");

  return (
    <div className="flex flex-col w-full" style={{ background: PAL.paper, color: PAL.ink }}>
      {/* Header — editorial dark navy */}
      <div
        className="px-5 md:px-7 lg:px-9 py-5 md:py-7 flex items-start justify-between gap-4"
        style={{ background: PAL.ink, color: PAL.paper, borderBottom: `1px solid ${PAL.ink}` }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] mb-2" style={{ color: "#E1CE9B" }}>
            Intelligence roadmap
          </p>
          <h1 className="serif-display text-[20px] md:text-[26px] lg:text-[30px] font-semibold leading-tight tracking-tight" style={{ color: PAL.paper }}>
            Quantum Karma is the world&apos;s most precise Vedic intelligence system.
          </h1>
          <p className="serif-text italic text-[13px] md:text-[14.5px] mt-3 max-w-2xl" style={{ color: PAL.paper2 }}>
            Every feature is engineered on classical Vedic Jyotisha, computed by fine-tuned frontier models across D1 through D60 divisional charts.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {Object.entries(TIER_TONE).map(([k, t]) => (
              <span
                key={k}
                className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-0.5 rounded-sm"
                style={{ color: PAL.ink, background: t.bg, border: `1px solid ${t.border}` }}
              >
                {t.label}
              </span>
            ))}
            <span className="serif-text italic text-[12px]" style={{ color: PAL.paper2 }}>
              · Tap any card to explore
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="h-9 w-9 grid place-items-center rounded-sm transition-colors flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.15)`, color: PAL.paper }}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      <div className="px-4 md:px-7 lg:px-9 py-5 md:py-7 overflow-y-auto custom-scroll-light">
        {/* Flagship */}
        <SectionDivider label="Flagship features" tone={TIER_TONE.flagship} />
        {flagship.map((f, i) => <FeatureCard key={f.id} f={f} index={i} />)}

        {/* Premium */}
        <SectionDivider label="Premium features" tone={TIER_TONE.premium} />
        {premium.map((f, i) => <FeatureCard key={f.id} f={f} index={flagship.length + i} />)}

        {/* Core */}
        <SectionDivider label="Core features" tone={TIER_TONE.core} />
        {core.map((f, i) => <FeatureCard key={f.id} f={f} index={flagship.length + premium.length + i} />)}

        {/* Footer pull quote */}
        <section className="my-3 py-8 md:py-10 text-center"
          style={{ borderTop: `1px solid ${PAL.border}`, borderBottom: `1px solid ${PAL.border}` }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.accent }}>
            The Quantum Karma promise
          </p>
          <p className="serif-display italic text-[18px] md:text-[24px] leading-snug max-w-3xl mx-auto" style={{ color: PAL.ink }}>
            We don&apos;t just tell you what the stars say. We tell you what your specific karma means — and exactly what to do about it.
          </p>
        </section>
      </div>
    </div>
  );
}

function SectionDivider({ label, tone }: { label: string; tone: { label: string; ink: string; bg: string; border: string } }) {
  return (
    <div
      className="flex items-baseline gap-3 mt-6 mb-4 first:mt-1 px-3 py-2 rounded-sm"
      style={{ background: tone.bg, border: `1px solid ${tone.border}` }}
    >
      <span className="serif-display italic text-[14px]" style={{ color: tone.ink }}>—</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: tone.ink }}>
        {label}
      </span>
    </div>
  );
}
