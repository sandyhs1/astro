"use client";

import { motion } from "framer-motion";

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
      "A multi-chart cross-analysis engine that overlays all family profiles in your account. The intelligence layer identifies Dasha confluence zones — periods when multiple family members are simultaneously under malefic or benefic planetary periods. It surfaces the 3 dominant karmic themes across the family lineage and identifies which soul contracts are active between specific members. No other intelligence platform in the world has built this.",
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

const TIER_STYLES = {
  flagship: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    label: "Flagship",
    titleColor: "text-indigo-900",
    accent: "bg-amber-500",
  },
  premium: {
    badge: "bg-purple-50 text-purple-700 border border-purple-200",
    label: "Premium",
    titleColor: "text-indigo-900",
    accent: "bg-purple-500",
  },
  core: {
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    label: "Core",
    titleColor: "text-indigo-900",
    accent: "bg-indigo-400",
  },
};

interface Props {
  onClose?: () => void;
}

export default function Roadmap({ onClose }: Props) {
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-6">
            <p className="text-xs font-bold text-indigo-200 uppercase tracking-[0.2em] mb-2">
              Intelligence Roadmap
            </p>
            <h1 className="text-lg font-black text-white leading-snug mb-3 max-w-2xl">
              Quantum Karma is not an astrology app. It is the world&apos;s most precise
              Vedic intelligence system for people who want to understand — and change —
              the trajectory of their lives.
            </h1>
            <p className="text-sm text-indigo-200 leading-relaxed max-w-xl">
              Every feature below is engineered on classical Vedic Jyotisha — computed
              by fine-tuned frontier models across D1 through D60 divisional charts.
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Feature List ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
        {FEATURES.map((f, i) => {
          const cfg = TIER_STYLES[f.tier];
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
            >
              {/* Feature Card */}
              <div className="bg-white border-b border-slate-200 px-8 py-6">

                {/* ── Title Row ── */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Number */}
                  <span className="text-2xl font-black text-slate-200 tabular-nums select-none w-8 flex-shrink-0">
                    {f.number}
                  </span>

                  {/* Icon */}
                  <span className="text-2xl flex-shrink-0">{f.icon}</span>

                  {/* Title + Badge */}
                  <div className="flex-1 flex items-center gap-3 flex-wrap">
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      {f.title}
                    </h2>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Coming Soon
                    </span>
                  </div>
                </div>

                {/* ── Tagline ── */}
                <p className="text-sm font-semibold text-indigo-700 mb-4 pl-16 leading-snug">
                  &ldquo;{f.tagline}&rdquo;
                </p>

                {/* ── Body ── */}
                <div className="pl-16 space-y-4">

                  {/* Intelligence layer */}
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      The Intelligence Layer
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {f.intelligence}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100" />

                  {/* Impact */}
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Why It Changes Everything
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      {f.impact}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100" />

                  {/* Vedic core chips */}
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Vedic Computation Core
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {f.vedicCore.map((v) => (
                        <span
                          key={v}
                          className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          );
        })}

        {/* ── Footer Promise ── */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-center">
          <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">
            The Quantum Karma Promise
          </p>
          <p className="text-base font-bold text-white leading-snug max-w-lg mx-auto">
            We don&apos;t just tell you what the stars say. We tell you what your specific
            karma means — and exactly what to do about it.
          </p>
        </div>
      </div>
    </div>
  );
}
