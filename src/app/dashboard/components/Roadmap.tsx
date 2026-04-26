"use client";

import { motion, AnimatePresence } from "framer-motion";

interface RoadmapFeature {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  intelligence: string;
  impact: string;
  vedicCore: string[];
  tier: "flagship" | "premium" | "core";
  tierLabel: string;
}

const FEATURES: RoadmapFeature[] = [
  {
    id: "birth-verifier",
    icon: "🎯",
    title: "Birth Chart Accuracy Verifier",
    tagline: "Your chart is only as precise as your birth time. Most people's are wrong.",
    intelligence:
      "A conversational AI-driven Temporal Audit powered by a proprietary Multi-Factor Logic Stack. Your chart is cross-referenced against the gravitational signatures of your actual lived experience — not guesswork. The engine executes BCP/BSP analysis, Kunda Method triangulation, Tattwa Shuddhi verification, Pranapada Lagna Validation, and Varga-Vimshaka Scoring across multiple divisional layers. The result: a chart you can trust completely — one that is provably, mathematically yours.",
    impact:
      "Every insight, every prediction, every report you have ever received from any source is only as accurate as your birth time. This feature fixes the foundation. Everything that comes after becomes exponentially more precise.",
    vedicCore: ["BCP/BSP Analysis", "Tattwa Shuddhi", "Pranapada Validation", "Varga-Vimshaka Scoring", "Kunda Method"],
    tier: "flagship",
    tierLabel: "Flagship Intelligence",
  },
  {
    id: "muhurta",
    icon: "⚡",
    title: "Muhurta Optimizer",
    tagline: "The right action at the wrong moment produces the wrong result. Every time.",
    intelligence:
      "An Electional Astrology Engine that deploys a fine-tuned frontier model against your exact natal configuration and the real-time planetary sky. It identifies the single most auspicious window — down to the hour — for signing a contract, launching a venture, proposing a partnership, or making any irreversible life decision. Used by every serious Jyotishi for every consequential moment. No consumer intelligence platform has built this with this level of precision.",
    impact:
      "The difference between success and failure is often not effort or talent — it is timing. This engine gives you the same temporal intelligence that generations of Maharajahs, generals, and builders relied on before executing the most important moments of their lives.",
    vedicCore: ["Panchanga Analysis", "Lagna Shuddhi", "Tara Bala", "Chandra Bala", "Vara & Tithi Scoring"],
    tier: "flagship",
    tierLabel: "Flagship Intelligence",
  },
  {
    id: "synastry",
    icon: "🔗",
    title: "Soul Contract Report",
    tagline: "You did not meet by accident. The question is what you owe each other.",
    intelligence:
      "A two-chart karmic fusion engine that goes far beyond the surface-level Guna Milan that every basic app performs. Our intelligence layer computes Navamsha overlay compatibility, Upapada Lagna axis alignment, cross-Dasha synchronisation, Mangal Dosha evaluation in context, and a five-domain Soul Contract Score. The output reveals the karmic nature of the bond — what was carried in from prior lives, what must be resolved, and what the relationship is cosmically designed to produce.",
    impact:
      "Understanding the karmic architecture of your most important relationships transforms how you navigate them. You stop fighting the contract. You start fulfilling it — consciously.",
    vedicCore: ["Navamsha Overlay", "Upapada Lagna Axis", "Dasha Synchronisation", "Mangal Dosha (Contextual)", "Jaimini Karakas"],
    tier: "flagship",
    tierLabel: "Flagship Intelligence",
  },
  {
    id: "varshaphal",
    icon: "🌞",
    title: "Annual Solar Return (Varshaphal)",
    tagline: "Every year, a new chart is born. Most people never read it.",
    intelligence:
      "At the exact moment the Sun returns to its natal degree, an entirely new annual chart is cast — the Varshaphal. This chart governs every domain of your life for the next twelve months. Our frontier model delivers a structured year-ahead intelligence briefing: which houses activate, which Dashas intersect with solar return energy, the Muntha progression, and the Panchadhayee lords for your specific year. The output is a twelve-month field map — identifying peak windows, caution zones, and the single most leverageable opportunity of your year.",
    impact:
      "Stop navigating the year blind. Know in advance which months demand bold action, which demand stillness, and which carry your single highest-probability opportunity for breakthrough.",
    vedicCore: ["Varshaphal Lagna", "Muntha Progression", "Panchadhayee Lords", "Year Lord (Varsha Pati)", "Tajika Yogas"],
    tier: "premium",
    tierLabel: "Premium Intelligence",
  },
  {
    id: "dasha-timeline",
    icon: "🕰️",
    title: "Dasha Progression Timeline",
    tagline: "Your entire life — past, present, and future — mapped against the cosmos.",
    intelligence:
      "A fully interactive, animated visual timeline of your Vimshottari Dasha sequence from birth to moksha. Past Dashas are mapped against your annotated life events — you will see, with undeniable clarity, how every major chapter of your life corresponded to a specific planetary period. Future Dashas are rendered with AI-generated predictions for each sub-period (Antardasha and Pratyantar Dasha). This becomes the most personalised document you have ever possessed — a living intelligence record you annotate and return to throughout your life.",
    impact:
      "When you can see your life as a precisely orchestrated karmic sequence rather than random events, everything changes. The panic around difficult periods dissolves. The clarity around upcoming opportunities sharpens into strategic intention.",
    vedicCore: ["Vimshottari Dasha", "Antardasha Mapping", "Pratyantar Dasha", "Dasha Sandhi Analysis", "Life Event Correlation"],
    tier: "premium",
    tierLabel: "Premium Intelligence",
  },
  {
    id: "medical",
    icon: "⚕️",
    title: "Medical Karma Report",
    tagline: "Your body is not malfunctioning. It is delivering a karmic message.",
    intelligence:
      "A precision health-karma intelligence layer built on the 6th house, its lord, the Arudha of the 6th (A6), Saturn's placement, Rahu's influence axis, and the Shashthamsha (D6 chart). The engine identifies which organ systems are under karmic pressure in the current Dasha — not as medical diagnosis, but as a roadmap of where your body is asking for conscious attention. Output includes Ayurvedic constitution mapping (Prakriti correlation), lifestyle recommendations tied to the specific planetary pressure, and the ideal window for health intervention.",
    impact:
      "The body speaks the language of karma before it speaks the language of disease. Reading this report gives you the intelligence to intervene at the right level — before the karmic pressure becomes a physical crisis.",
    vedicCore: ["6th House Analysis", "Arudha A6", "Shashthamsha D6", "Saturn-Rahu Axis", "Ayurvedic Prakriti Mapping"],
    tier: "premium",
    tierLabel: "Premium Intelligence",
  },
  {
    id: "family-karma",
    icon: "🏛️",
    title: "Family Karma Matrix",
    tagline: "Your family is not random. It is your most complex karmic assignment.",
    intelligence:
      "A multi-chart cross-analysis engine that overlays all family profiles saved in your account. The intelligence layer identifies Dasha confluence zones — periods when multiple family members are simultaneously under malefic or benefic planetary periods — and flags them as danger or opportunity windows for the family unit. It surfaces the 3 dominant karmic themes running across the family lineage, identifies which soul contracts are active between specific members, and reveals the karmic role each person is playing in the other's evolution. No other intelligence platform in the world has built this.",
    impact:
      "Family conflict is almost never what it appears to be. When you can see the karmic architecture beneath the surface — why this person triggers you, why this pattern keeps repeating — you gain the power to consciously evolve it instead of unconsciously repeating it.",
    vedicCore: ["Inter-chart Dasha Overlay", "Jaimini Karakas (Family)", "12th Lord Soul Contracts", "Graha Drishti Cross-Chart", "Lagna Lord Synergy"],
    tier: "core",
    tierLabel: "Core Intelligence",
  },
  {
    id: "daily-briefing",
    icon: "🌅",
    title: "Daily Cosmic Briefing",
    tagline: "Every morning. Your chart. Today's sky. Three lines that change how you move.",
    intelligence:
      "A personalised daily intelligence card generated fresh every morning at 5:00 AM IST. The engine computes the real-time transit overlay against your natal chart, identifies the dominant planetary energy of the day specifically for your configuration, and delivers: one primary opportunity, one action directive, and one caution — all grounded in Vedic transit logic and your active Dasha. Not generic horoscope content. Your chart, today's sky, precise output.",
    impact:
      "The highest performers in any field have one thing in common: they operate in alignment with their natural cycles, not against them. This feature trains you to move with your karmic current rather than fighting it — every single day.",
    vedicCore: ["Gochara Transit Analysis", "Ashtakavarga Daily Score", "Moon Nakshatra Transit", "Dasha-Transit Confluence", "Yoga Formation Detection"],
    tier: "core",
    tierLabel: "Core Intelligence",
  },
  {
    id: "journal",
    icon: "📖",
    title: "Quantum Journal",
    tagline: "Your life events are data. Over time, patterns emerge that will change everything.",
    intelligence:
      "A chart-linked journaling interface where every entry is automatically tagged with your active Dasha, current Gochara transit energy, Moon's Nakshatra, and lunar phase at the moment of writing. Over time, our pattern recognition engine surfaces correlations: 'You consistently feel a surge of creative energy when Jupiter transits your 5th house.' 'Conflict arises when the Moon transits Ashlesha in your chart.' This is evidence-based self-awareness — powered by the most sophisticated personal data set in existence: your own life, mapped against the cosmos.",
    impact:
      "Self-knowledge is the most powerful competitive advantage a human being can possess. This journal becomes the most precise mirror you have ever looked into — not just recording your life, but revealing the invisible forces shaping it.",
    vedicCore: ["Dasha-Tagged Entries", "Nakshatra Phase Logging", "Gochara Correlation Engine", "Moon Phase Mapping", "Yoga-Event Pattern Recognition"],
    tier: "core",
    tierLabel: "Core Intelligence",
  },
  {
    id: "qk-score",
    icon: "📊",
    title: "Quantum Karma Score",
    tagline: "A single number that tells you the truth about where you stand in the cosmos.",
    intelligence:
      "A proprietary composite intelligence metric — the first of its kind — that synthesises your active Yoga strength (Rajayoga, Dhana Yoga, Viparita Raja Yoga), Dasha quality scoring, current Gochara Bindu count (Ashtakavarga), Shadbala planetary strengths, and transit confluence into a single, dynamic Quantum Karma Score between 0 and 1000. Updated on a rolling basis. Tracked over time. The score does not judge you — it gives you an honest, mathematically grounded read on your current karmic position, so you can act accordingly.",
    impact:
      "You cannot optimise what you cannot measure. The Quantum Karma Score is the world's first precision instrument for measuring your karmic momentum — giving you the intelligence to double down when the score is rising, and to conserve when it is not.",
    vedicCore: ["Yoga Activation Scoring", "Ashtakavarga Bindu Synthesis", "Shadbala Composite", "Dasha Quality Index", "Transit Confluence Score"],
    tier: "core",
    tierLabel: "Core Intelligence",
  },
  {
    id: "shadbala",
    icon: "⚖️",
    title: "Shadbala Strength Report",
    tagline: "Not all planets in your chart are equal. Most astrologers never check which ones truly have power.",
    intelligence:
      "A full computational rendering of the six classical Vedic planetary strength metrics: Sthana Bala (positional strength), Dig Bala (directional strength), Kala Bala (temporal strength), Chesta Bala (motional strength), Naisargika Bala (natural strength), and Drig Bala (aspectual strength). Each planet in your chart is assigned a precise Rupas score. The visual strength dashboard immediately shows which planets are genuinely capable of delivering their significations — and which are weakened to the point where their promises in your chart are significantly diminished. This is the calculation that separates serious Jyotishis from those who read charts superficially.",
    impact:
      "A planet placed in an exalted sign is not necessarily powerful. A planet in a debilitated sign is not necessarily weak. Shadbala reveals the actual force behind every planet in your chart — so you know which ones to activate and which ones to mitigate.",
    vedicCore: ["Sthana Bala", "Dig Bala", "Kala Bala", "Chesta Bala", "Naisargika + Drig Bala"],
    tier: "core",
    tierLabel: "Core Intelligence",
  },
];

const TIER_CONFIG = {
  flagship: {
    gradient: "from-amber-500 via-orange-500 to-red-500",
    bg: "bg-gradient-to-br from-amber-950/60 via-orange-950/40 to-slate-900",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    glow: "shadow-amber-500/10",
    dot: "bg-amber-400",
  },
  premium: {
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    bg: "bg-gradient-to-br from-purple-950/60 via-violet-950/40 to-slate-900",
    border: "border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    glow: "shadow-purple-500/10",
    dot: "bg-purple-400",
  },
  core: {
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    bg: "bg-gradient-to-br from-cyan-950/60 via-teal-950/40 to-slate-900",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    glow: "shadow-cyan-500/10",
    dot: "bg-cyan-400",
  },
};

interface Props {
  onClose?: () => void;
}

export default function Roadmap({ onClose }: Props) {
  return (
    <div className="h-full flex flex-col bg-[#070b14] overflow-hidden">

      {/* ── Fixed Header ──────────────────────────────────────── */}
      <div className="flex-shrink-0 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/80 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative px-8 pt-8 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_#818cf8]" />
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">
                  Intelligence Roadmap
                </span>
              </div>

              <h1 className="text-2xl font-black text-white leading-tight mb-3 max-w-2xl">
                Quantum Karma is not an astrology app.
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                  It is the world&apos;s most precise Vedic intelligence system
                </span>{" "}
                for people who want to understand — and change — the
                trajectory of their lives.
              </h1>

              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                Every feature below is engineered on classical Vedic
                Jyotisha — not simplified, not westernised. Our
                fine-tuned frontier models compute what no astrologer can
                compute manually: multi-chart, multi-divisional,
                real-time karmic intelligence.
              </p>

              {/* Stats strip */}
              <div className="flex items-center gap-6 mt-5">
                {[
                  { v: "11", l: "Intelligence Modules" },
                  { v: "16+", l: "Divisional Charts" },
                  { v: "D1→D60", l: "Depth of Analysis" },
                ].map((s) => (
                  <div key={s.l} className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-white">{s.v}</span>
                    <span className="text-xs text-slate-500 font-medium">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Tier legend */}
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/5">
            <span className="text-xs text-slate-600 font-medium">Tiers:</span>
            {(["flagship", "premium", "core"] as const).map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${TIER_CONFIG[t].dot}`} />
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TIER_CONFIG[t].badge}`}>
                  {t === "flagship" ? "Flagship" : t === "premium" ? "Premium" : "Core"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scrollable Feature Grid ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-8 pt-2">
        <div className="space-y-4">
          {FEATURES.map((f, i) => {
            const cfg = TIER_CONFIG[f.tier];
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                className={`relative rounded-2xl border ${cfg.border} ${cfg.bg} p-6 shadow-2xl ${cfg.glow} group overflow-hidden`}
              >
                {/* Subtle gradient shimmer on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${cfg.gradient} opacity-[0.03] rounded-2xl pointer-events-none`} />

                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/5 border border-white/10 flex-shrink-0 shadow-inner`}>
                      {f.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${cfg.badge}`}>
                          {f.tierLabel}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/5">
                          Coming Soon
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-white leading-tight">
                        {f.title}
                      </h2>
                    </div>
                  </div>

                  {/* Feature number */}
                  <span className="text-3xl font-black text-white/5 select-none tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Tagline */}
                <p className={`text-sm font-semibold bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent mb-4 leading-snug`}>
                  &ldquo;{f.tagline}&rdquo;
                </p>

                {/* Intelligence description */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    The Intelligence Layer
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {f.intelligence}
                  </p>
                </div>

                {/* Impact */}
                <div className="mb-4 pl-4 border-l-2 border-white/10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Why It Changes Everything
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    {f.impact}
                  </p>
                </div>

                {/* Vedic chips */}
                <div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Vedic Computation Core
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.vedicCore.map((v) => (
                      <span
                        key={v}
                        className="text-[10px] font-semibold px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/5"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer promise */}
        <div className="mt-8 text-center px-6 pb-4">
          <div className="inline-block px-6 py-4 rounded-2xl bg-white/3 border border-white/5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              The Quantum Karma Promise
            </p>
            <p className="text-base font-bold text-white leading-snug max-w-lg">
              We don&apos;t just tell you what the stars say.{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                We tell you what your specific karma means — and exactly
                what to do about it.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
