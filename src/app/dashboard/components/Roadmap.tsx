"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RoadmapFeature {
  id: string;
  icon: string;
  number: string;
  title: string;
  tagline: string;
  intelligence: string;
  impact: string;
  vedicCore: string[];
  tier: "flagship" | "premium" | "core";
}

const FEATURES: RoadmapFeature[] = [
  {
    id: "birth-verifier",
    icon: "🎯",
    number: "01",
    title: "Birth Chart Accuracy Verifier",
    tagline: "Your chart is only as precise as your birth time. Most people's are wrong.",
    intelligence:
      "A conversational AI-driven Temporal Audit powered by a proprietary Multi-Factor Logic Stack. Your chart is cross-referenced against the gravitational signatures of your actual lived experience. The engine executes BCP/BSP analysis, Kunda Method triangulation, Tattwa Shuddhi verification, Pranapada Lagna Validation, and Varga-Vimshaka Scoring across multiple divisional layers. The result: a chart that is provably, mathematically yours.",
    impact:
      "Every insight, prediction, and report you have ever received is only as accurate as your birth time. This feature fixes the foundation. Everything that comes after becomes exponentially more precise.",
    vedicCore: ["BCP/BSP Analysis", "Tattwa Shuddhi", "Pranapada Validation", "Varga-Vimshaka Scoring", "Kunda Method"],
    tier: "flagship",
  },
  {
    id: "muhurta",
    icon: "⚡",
    number: "02",
    title: "Muhurta Optimizer",
    tagline: "The right action at the wrong moment produces the wrong result. Every time.",
    intelligence:
      "An Electional Astrology Engine that deploys a fine-tuned frontier model against your exact natal configuration and the real-time planetary sky. It identifies the single most auspicious window — down to the hour — for signing a contract, launching a venture, proposing a partnership, or making any irreversible life decision. No consumer intelligence platform has built this with this level of Vedic precision.",
    impact:
      "The difference between success and failure is often not effort or talent — it is timing. This engine gives you the same temporal intelligence that generations of Maharajahs and builders relied on before executing the most important moments of their lives.",
    vedicCore: ["Panchanga Analysis", "Lagna Shuddhi", "Tara Bala", "Chandra Bala", "Vara & Tithi Scoring"],
    tier: "flagship",
  },
  {
    id: "synastry",
    icon: "🔗",
    number: "03",
    title: "Soul Contract Report",
    tagline: "You did not meet by accident. The question is: what do you owe each other?",
    intelligence:
      "A two-chart karmic fusion engine that goes far beyond surface-level Guna Milan. Our intelligence layer computes Navamsha overlay compatibility, Upapada Lagna axis alignment, cross-Dasha synchronisation, Mangal Dosha evaluation in full context, and a five-domain Soul Contract Score. This is multi-layer, multi-divisional analysis — not the oversimplified Ashtakoota matching that every basic app performs.",
    impact:
      "Understanding the karmic architecture of your most important relationships transforms how you navigate them. You stop fighting the contract. You start fulfilling it — consciously.",
    vedicCore: ["Navamsha Overlay", "Upapada Lagna Axis", "Dasha Synchronisation", "Mangal Dosha (Contextual)", "Jaimini Karakas"],
    tier: "flagship",
  },
  {
    id: "varshaphal",
    icon: "🌞",
    number: "04",
    title: "Annual Solar Return — Varshaphal",
    tagline: "Every year, a new chart is born. Most people never read it.",
    intelligence:
      "At the exact moment the Sun returns to its natal degree, an entirely new annual chart is cast — the Varshaphal. This chart governs every domain of your life for the next twelve months. Our frontier model delivers a structured year-ahead intelligence briefing: active houses, Dasha-solar return intersections, Muntha progression, and Panchadhayee lords for your specific year.",
    impact:
      "Stop navigating the year blind. Know in advance which periods demand bold action, which demand stillness, and which carry your single highest-probability window for breakthrough.",
    vedicCore: ["Varshaphal Lagna", "Muntha Progression", "Panchadhayee Lords", "Varsha Pati", "Tajika Yogas"],
    tier: "premium",
  },
  {
    id: "dasha-timeline",
    icon: "🕰️",
    number: "05",
    title: "Dasha Progression Timeline",
    tagline: "Your entire life — past, present, and future — mapped against the cosmos.",
    intelligence:
      "A fully interactive visual timeline of your Vimshottari Dasha sequence from birth onwards. Past Dashas are mapped against your annotated life events — you will see, with undeniable clarity, how every major chapter corresponded to a specific planetary period. Future Dashas are rendered with AI-generated predictions for each sub-period. This becomes the most personalised document you have ever possessed.",
    impact:
      "When you can see your life as a precisely orchestrated karmic sequence rather than random events, the panic around difficult periods dissolves. The clarity around upcoming opportunities sharpens into strategic intention.",
    vedicCore: ["Vimshottari Dasha", "Antardasha Mapping", "Pratyantar Dasha", "Dasha Sandhi Analysis", "Life Event Correlation"],
    tier: "premium",
  },
  {
    id: "medical",
    icon: "⚕️",
    number: "06",
    title: "Medical Karma Report",
    tagline: "Your body is not malfunctioning. It is delivering a karmic message.",
    intelligence:
      "A precision health-karma intelligence layer built on the 6th house, its lord, the Arudha of the 6th (A6), Saturn's placement, Rahu's influence axis, and the Shashthamsha (D6 chart). The engine identifies which organ systems are under karmic pressure in the current Dasha — not as medical diagnosis, but as a roadmap of where your body is asking for conscious attention. Includes Ayurvedic Prakriti correlation.",
    impact:
      "The body speaks the language of karma before it speaks the language of disease. Reading this report gives you the intelligence to intervene at the right level — before karmic pressure becomes a physical crisis.",
    vedicCore: ["6th House Analysis", "Arudha A6", "Shashthamsha D6", "Saturn-Rahu Axis", "Ayurvedic Prakriti"],
    tier: "premium",
  },
  {
    id: "family-karma",
    icon: "🏛️",
    number: "07",
    title: "Family Karma Matrix",
    tagline: "Your family is not random. It is your most complex karmic assignment.",
    intelligence:
      "A multi-chart cross-analysis engine that overlays all family profiles in your account. The intelligence layer identifies Dasha confluence zones — periods when multiple family members are simultaneously under malefic or benefic planetary periods. It surfaces the 3 dominant karmic themes across the family lineage and identifies which soul contracts are active between specific members.",
    impact:
      "Family conflict is almost never what it appears to be. When you can see the karmic architecture beneath the surface, you gain the power to consciously evolve it instead of unconsciously repeating it.",
    vedicCore: ["Inter-chart Dasha Overlay", "Jaimini Karakas", "12th Lord Contracts", "Graha Drishti Cross-Chart", "Lagna Lord Synergy"],
    tier: "core",
  },
  {
    id: "daily-briefing",
    icon: "🌅",
    number: "08",
    title: "Daily Cosmic Briefing",
    tagline: "Every morning. Your chart. Today's sky. Three lines that change how you move.",
    intelligence:
      "A personalised daily intelligence card generated fresh every morning. The engine computes the real-time transit overlay against your natal chart, identifies the dominant planetary energy of the day specifically for your configuration, and delivers: one primary opportunity, one action directive, and one caution — all grounded in Vedic transit logic and your active Dasha. Not generic horoscope content. Your chart, today's sky, precise output.",
    impact:
      "The highest performers in any field operate in alignment with their natural cycles, not against them. This feature trains you to move with your karmic current — every single day.",
    vedicCore: ["Gochara Transit Analysis", "Ashtakavarga Daily Score", "Moon Nakshatra Transit", "Dasha-Transit Confluence", "Yoga Formation Detection"],
    tier: "core",
  },
  {
    id: "journal",
    icon: "📖",
    number: "09",
    title: "Quantum Journal",
    tagline: "Your life events are data. Over time, patterns emerge that will change everything.",
    intelligence:
      "A chart-linked journaling interface where every entry is automatically tagged with your active Dasha, Gochara transit energy, Moon's Nakshatra, and lunar phase at the moment of writing. Over time, our pattern recognition engine surfaces correlations: 'You consistently feel a surge of creative energy when Jupiter transits your 5th house.' Evidence-based self-awareness — powered by the most sophisticated personal data set in existence: your own life, mapped against the cosmos.",
    impact:
      "This journal becomes the most precise mirror you have ever looked into — not just recording your life, but revealing the invisible forces shaping it.",
    vedicCore: ["Dasha-Tagged Entries", "Nakshatra Phase Logging", "Gochara Correlation Engine", "Moon Phase Mapping", "Yoga-Event Pattern Recognition"],
    tier: "core",
  },
  {
    id: "qk-score",
    icon: "📊",
    number: "10",
    title: "Quantum Karma Score",
    tagline: "A single number that tells you the truth about where you stand in the cosmos.",
    intelligence:
      "A proprietary composite intelligence metric — the first of its kind — that synthesises your active Yoga strength (Rajayoga, Dhana Yoga, Viparita Raja Yoga), Dasha quality scoring, current Gochara Bindu count from Ashtakavarga, Shadbala planetary strengths, and transit confluence into a single dynamic score between 0 and 1000. Updated on a rolling basis. Tracked over time.",
    impact:
      "You cannot optimise what you cannot measure. The Quantum Karma Score is the world's first precision instrument for measuring your karmic momentum — giving you the intelligence to double down when the score is rising, and to conserve when it is not.",
    vedicCore: ["Yoga Activation Scoring", "Ashtakavarga Bindu Synthesis", "Shadbala Composite", "Dasha Quality Index", "Transit Confluence Score"],
    tier: "core",
  },
  {
    id: "shadbala",
    icon: "⚖️",
    number: "11",
    title: "Shadbala Strength Report",
    tagline: "Not all planets in your chart are equal. Most astrologers never check which ones truly have power.",
    intelligence:
      "A full computational rendering of the six classical Vedic planetary strength metrics: Sthana Bala (positional), Dig Bala (directional), Kala Bala (temporal), Chesta Bala (motional), Naisargika Bala (natural), and Drig Bala (aspectual). Each planet receives a precise Rupas score. The visual strength dashboard immediately shows which planets are genuinely capable of delivering their significations — and which are weakened.",
    impact:
      "A planet in exaltation is not necessarily powerful. A planet in debilitation is not necessarily weak. Shadbala reveals the actual force behind every planet — so you know which ones to activate and which to mitigate.",
    vedicCore: ["Sthana Bala", "Dig Bala", "Kala Bala", "Chesta Bala", "Naisargika + Drig Bala"],
    tier: "core",
  },
];

const TIER_CONFIG = {
  flagship: {
    label: "Flagship",
    badgeBg: "#FEF3C7",
    badgeColor: "#92400E",
    badgeBorder: "#FDE68A",
    accentGradient: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
    accentLight: "#EDE9FE",
    accentText: "#6D28D9",
    borderColor: "#C4B5FD",
    numberColor: "#DDD6FE",
  },
  premium: {
    label: "Premium",
    badgeBg: "#F3E8FF",
    badgeColor: "#7E22CE",
    badgeBorder: "#E9D5FF",
    accentGradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    accentLight: "#FDF4FF",
    accentText: "#7C3AED",
    borderColor: "#DDD6FE",
    numberColor: "#EDE9FE",
  },
  core: {
    label: "Core",
    badgeBg: "#F0F9FF",
    badgeColor: "#0369A1",
    badgeBorder: "#BAE6FD",
    accentGradient: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
    accentLight: "#EFF6FF",
    accentText: "#1D4ED8",
    borderColor: "#BFDBFE",
    numberColor: "#DBEAFE",
  },
};

interface Props {
  onClose?: () => void;
}

function FeatureCard({ f, index }: { f: RoadmapFeature; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TIER_CONFIG[f.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: "easeOut" }}
      style={{ marginBottom: 16 }}
    >
      <div
        style={{
          background: "#fff",
          border: `1.5px solid ${cfg.borderColor}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(99,102,241,0.06)",
        }}
      >
        {/* ── Accent Bar ── */}
        <div style={{ height: 4, background: cfg.accentGradient }} />

        {/* ── Card Header ── */}
        <div style={{ padding: "20px 20px 0 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            {/* Number + Icon */}
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: cfg.numberColor, fontFamily: "monospace", letterSpacing: "0.05em" }}>
                {f.number}
              </div>
              <div style={{ fontSize: 28, lineHeight: 1, marginTop: 2 }}>{f.icon}</div>
            </div>

            {/* Title block */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: 0, lineHeight: 1.3 }}>
                  {f.title}
                </h2>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                    padding: "2px 8px", borderRadius: 99,
                    background: cfg.badgeBg, color: cfg.badgeColor, border: `1px solid ${cfg.badgeBorder}`,
                  }}
                >
                  {cfg.label}
                </span>
                <span
                  style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                    padding: "2px 8px", borderRadius: 99,
                    background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0",
                  }}
                >
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* ── Tagline ── */}
          <div
            style={{
              margin: "14px 0 0 0",
              background: cfg.accentLight,
              borderRadius: 10,
              padding: "10px 14px",
              borderLeft: `3px solid ${cfg.accentText}`,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: cfg.accentText, margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
              &ldquo;{f.tagline}&rdquo;
            </p>
          </div>
        </div>

        {/* ── Expandable Body ── */}
        <div style={{ padding: "0 20px" }}>
          <button
            onClick={() => setExpanded(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              width: "100%", background: "none", border: "none",
              padding: "12px 0", cursor: "pointer",
              fontSize: 11, fontWeight: 700, color: "#94A3B8",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}
          >
            <span style={{ flex: 1, textAlign: "left" }}>
              {expanded ? "Hide Details" : "Explore Intelligence Layer"}
            </span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", flexShrink: 0 }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ paddingBottom: 20, display: "flex", flexDirection: "column", gap: 14 }}>

                  {/* Intelligence Layer */}
                  <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "14px 16px", border: "1px solid #E2E8F0" }}>
                    <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>
                      The Intelligence Layer
                    </div>
                    <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, margin: 0 }}>
                      {f.intelligence}
                    </p>
                  </div>

                  {/* Why It Changes Everything */}
                  <div style={{ background: "#FFFBEB", borderRadius: 10, padding: "14px 16px", border: "1px solid #FDE68A" }}>
                    <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: "#92400E", marginBottom: 8 }}>
                      Why It Changes Everything
                    </div>
                    <p style={{ fontSize: 13, color: "#78350F", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                      {f.impact}
                    </p>
                  </div>

                  {/* Vedic Core Chips */}
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>
                      Vedic Computation Core
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {f.vedicCore.map(v => (
                        <span
                          key={v}
                          style={{
                            fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99,
                            background: cfg.accentLight, color: cfg.accentText,
                            border: `1px solid ${cfg.borderColor}`,
                          }}
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
      </div>
    </motion.div>
  );
}

export default function Roadmap({ onClose }: Props) {
  const flagship = FEATURES.filter(f => f.tier === "flagship");
  const premium  = FEATURES.filter(f => f.tier === "premium");
  const core     = FEATURES.filter(f => f.tier === "core");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fff", overflow: "hidden" }}>

      {/* ── Header ── */}
      <div style={{ flexShrink: 0, background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)", padding: "20px 20px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ flex: 1, paddingRight: onClose ? 16 : 0 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: "rgba(199,210,254,0.9)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 8px" }}>
              Intelligence Roadmap
            </p>
            <h1 style={{ fontSize: 16, fontWeight: 900, color: "#fff", lineHeight: 1.45, margin: "0 0 8px" }}>
              Quantum Karma is the world&apos;s most precise Vedic intelligence system — built for people who want to understand and change the trajectory of their lives.
            </h1>
            <p style={{ fontSize: 12, color: "rgba(199,210,254,0.85)", lineHeight: 1.6, margin: 0 }}>
              Every feature is engineered on classical Vedic Jyotisha, computed by fine-tuned frontier models across D1 through D60 divisional charts.
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{ padding: 8, borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#C7D2FE", flexShrink: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Tier legend */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          {[
            { label: "Flagship", bg: "#FEF3C7", color: "#92400E" },
            { label: "Premium",  bg: "#F3E8FF", color: "#7E22CE" },
            { label: "Core",     bg: "#E0F2FE", color: "#0369A1" },
          ].map(t => (
            <span key={t.label} style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: t.bg, color: t.color }}>
              {t.label}
            </span>
          ))}
          <span style={{ fontSize: 10, color: "rgba(199,210,254,0.7)", alignSelf: "center" }}>— Tap any card to explore</span>
        </div>
      </div>

      {/* ── Scrollable Feature List ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 8px", background: "#F8FAFC" }} className="custom-scrollbar">

        {/* Flagship */}
        <SectionDivider label="Flagship Features" emoji="🏆" color="#92400E" bg="#FFFBEB" border="#FDE68A" />
        {flagship.map((f, i) => <FeatureCard key={f.id} f={f} index={i} />)}

        {/* Premium */}
        <SectionDivider label="Premium Features" emoji="💎" color="#7E22CE" bg="#FAF5FF" border="#E9D5FF" />
        {premium.map((f, i) => <FeatureCard key={f.id} f={f} index={flagship.length + i} />)}

        {/* Core */}
        <SectionDivider label="Core Features" emoji="⚙️" color="#0369A1" bg="#F0F9FF" border="#BAE6FD" />
        {core.map((f, i) => <FeatureCard key={f.id} f={f} index={flagship.length + premium.length + i} />)}

        {/* Footer */}
        <div
          style={{
            margin: "8px 0 24px",
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            borderRadius: 16,
            padding: "20px 24px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 800, color: "rgba(199,210,254,0.9)", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 8px" }}>
            The Quantum Karma Promise
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.6, margin: 0 }}>
            We don&apos;t just tell you what the stars say. We tell you what your specific karma means — and exactly what to do about it.
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionDivider({
  label, emoji, color, bg, border,
}: { label: string; emoji: string; color: string; bg: string; border: string }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 14, marginTop: 4,
        padding: "8px 14px", borderRadius: 10,
        background: bg, border: `1px solid ${border}`,
      }}
    >
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}
