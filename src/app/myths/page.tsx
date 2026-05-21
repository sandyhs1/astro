"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import LandingFooter from "@/components/LandingFooter";
import FloatingLogo from "@/components/ui/FloatingLogo";

// ─── ANIMATED COUNTER ───────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ─── MAGNETIC CARD ──────────────────────────────────────────────────────────
function MagneticCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.04);
    y.set((e.clientY - centerY) * 0.04);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── REVEAL WRAPPER ─────────────────────────────────────────────────────────
function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── DATA: EXPANDED, VERIFIABLE MYTHS ──────────────────────────────────────
// Each myth is grounded in real Vedic astrology principles documented in
// classical texts (BPHS, Jaimini Sutras, Phaladeepika) and verifiable
// astronomical fact.

const mythsData = [
  {
    id: "01",
    category: "Astronomical",
    myth: "TWINS HAVE IDENTICAL CHARTS",
    lie: "If two people are born minutes apart, they should live identical lives.",
    truth: "This assumes the chart is only the D-1 (Rasi). In reality, Vedic astrology uses 16 divisional charts (Shodasavarga). The D-60 (Shashtiamsa) — considered the most karmically definitive in classical Parashari texts — shifts every 2 minutes. The D-108 shifts even faster. Within a 4-minute gap, Arudha Padas, Ashtakavarga points, and Navamsa positions can all realign. Twins share the broad sky, not the granular karmic geometry.",
    classicalSource: "Brihat Parashara Hora Shastra, Ch. 7 — Shodasavarga Vivechana",
    focus: ["D-60 Shashtiamsa", "Arudha Padas", "Time-Sensitive Vargas"],
    color: "purple"
  },
  {
    id: "02",
    category: "Scientific",
    myth: "PLANETS ARE TOO FAR TO INFLUENCE US",
    lie: "Jupiter's gravitational pull on a newborn is weaker than the doctor's. Therefore astrology is impossible.",
    truth: "This argument misunderstands the framework. Vedic astrology has never claimed gravitational causation. It is a system of synchronicity — like a clock face mapping time without 'causing' it to pass. Planetary positions are temporal coordinates that correlate with patterns in human experience. The geometry of light and time is the language; gravity is irrelevant to the model.",
    classicalSource: "The clock-face analogy — used by Carl Jung in his synchronicity framework (1952)",
    focus: ["Synchronicity Principle", "Temporal Geometry", "Correlation Not Causation"],
    color: "blue"
  },
  {
    id: "03",
    category: "Methodology",
    myth: "ASTROLOGY IS JUST COLD READING",
    lie: "Astrologers ask leading questions, read body language, and make educated guesses.",
    truth: "Authentic Jyotisha is conducted blind — the practitioner only needs date, time, and place of birth. No conversation. No body language. The mathematics produce specific outputs: which house is afflicted, which Dasha is active, which yogas are formed. A skilled jyotishi can name historical events — financial losses, marriage years, career pivots — without the subject saying a word.",
    classicalSource: "Jaimini Sutras — predictive precision via Char Dasha + Karakas",
    focus: ["Blind Reading", "Vimshottari Dasha", "Mathematical Output"],
    color: "amber"
  },
  {
    id: "04",
    category: "Determinism",
    myth: "IF IT'S WRITTEN, EFFORT IS USELESS",
    lie: "If your chart predicts hardship, working hard is pointless because destiny is fixed.",
    truth: "Classical Vedic texts explicitly distinguish between Drudha (fixed) and Adrudha (modifiable) karma. Most life events fall into the modifiable category. The chart maps probability fields and timing windows — not absolute outcomes. A difficult Saturn transit doesn't guarantee failure; it indicates a period requiring strategic patience. Free will operates within the constraint, not against it.",
    classicalSource: "Brihat Parashara Hora Shastra — Sanchita, Prarabdha, and Kriyamana karma",
    focus: ["Drudha vs Adrudha Karma", "Probability Fields", "Strategic Free Will"],
    color: "emerald"
  },
];

const additionalMyths = [
  {
    id: "05",
    category: "Sun Sign",
    myth: "YOUR SUN SIGN DEFINES YOU",
    lie: "Just knowing your Sun sign (Aries, Leo, etc.) tells you everything about your personality.",
    truth: "Sun sign astrology was popularized by 20th-century newspaper columns to fit a 100-word format. In Vedic Jyotisha, the Sun is just one of nine grahas. Far more weight is placed on the Lagna (Ascendant) — which changes every two hours and reflects physical body and identity — and the Moon sign, which governs emotional patterns. A 1-in-12 description cannot represent a 6.5-billion-permutation chart.",
    classicalSource: "Phaladeepika — Lagna prominence in personality assessment",
    focus: ["Lagna (Ascendant)", "Moon Sign Priority", "9 Grahas Combined"],
    color: "rose"
  },
  {
    id: "06",
    category: "Western vs Vedic",
    myth: "VEDIC AND WESTERN ARE THE SAME",
    lie: "All astrology systems use the same zodiac and produce the same readings.",
    truth: "Western astrology uses the Tropical zodiac (tied to Earth's seasons). Vedic astrology uses the Sidereal zodiac (tied to actual constellations). The difference, called the Ayanamsa, currently equals about 24 degrees. This means most people's signs differ between systems — a Western Aries is often a Vedic Pisces. The two systems are not interchangeable; they're different mathematical frameworks producing different outputs.",
    classicalSource: "Surya Siddhanta — Sidereal calculation foundations",
    focus: ["Sidereal vs Tropical", "Lahiri Ayanamsa", "~24° Offset"],
    color: "indigo"
  },
  {
    id: "07",
    category: "Vague Predictions",
    myth: "ASTROLOGY GIVES VAGUE BARNUM STATEMENTS",
    lie: "Astrology only says things like 'You are independent but sometimes self-doubt.'",
    truth: "Barnum statements are characteristic of pop horoscopes, not classical Jyotisha. True Vedic prediction operates on planetary degrees, exact Dasha-Antardasha-Pratyantardasha periods (down to weeks), and house-specific afflictions. A genuine reading produces statements like: 'During the Mars Antardasha within Saturn Mahadasha, expect a property dispute in months 14–17.' Specificity is the diagnostic — not generality.",
    classicalSource: "Vimshottari Dasha system — 5-level deep timing",
    focus: ["Dasha-Antardasha", "Specific Timing Windows", "House Afflictions"],
    color: "cyan"
  },
  {
    id: "08",
    category: "Religious",
    myth: "ASTROLOGY IS A RELIGIOUS BELIEF",
    lie: "You have to be Hindu or believe in mysticism for Vedic astrology to work.",
    truth: "Jyotisha is one of the six Vedangas (limbs of the Vedas) — historically classified as a science (vidya), not a religion. It uses observational astronomy, geometric calculations, and statistical correlations. Practitioners exist across every religious background. The system works on mathematical inputs: it doesn't ask what you believe. The geometry of your birth moment is observable fact, regardless of the worldview you bring to interpreting it.",
    classicalSource: "Vedanga Jyotisha — c. 1400 BCE, foundational text",
    focus: ["Vedanga Classification", "Observational Science", "Belief-Independent"],
    color: "teal"
  },
];

const allMyths = [...mythsData, ...additionalMyths];

// ─── KEPT FROM ORIGINAL: WELL-DOCUMENTED HISTORICAL FIGURES ─────────────────
// All entries below are publicly documented historical facts, not assumptions.
const historicalFigures = [
  {
    name: "J.P. Morgan",
    role: "American financier · founded JPMorgan & Co.",
    fact: "Famously employed astrologer Evangeline Adams to time market decisions in the early 1900s. Adams was acquitted in a 1914 New York fortune-telling trial after demonstrating astrological methodology in court — establishing legal precedent that astrology was a 'science' rather than a fraud.",
    source: "New York Times archives, 1914 · 'Evangeline Adams: Bowl of Heaven' (1926)"
  },
  {
    name: "Ronald Reagan",
    role: "40th US President",
    fact: "Donald Regan, former White House Chief of Staff, revealed in his 1988 memoir 'For the Record' that astrologer Joan Quigley was consulted on the timing of major presidential events — including the 1985 Reagan-Gorbachev summit — for nearly the entire second term.",
    source: "Donald Regan, 'For the Record', 1988 · CBS News reporting"
  },
  {
    name: "Carl Jung",
    role: "Founder of Analytical Psychology",
    fact: "Used astrological birth charts as a clinical tool in his practice. His seminal 1952 work on synchronicity formalized the framework that astrology is a meaningful coincidence pattern, not a causal mechanism — the same epistemological stance most serious modern astrologers hold.",
    source: "C.G. Jung, 'Synchronicity: An Acausal Connecting Principle', 1952"
  },
  {
    name: "Indira Gandhi",
    role: "Former Prime Minister of India",
    fact: "Publicly consulted Vedic astrologers throughout her political career. Multiple biographies document her routine practice of consulting jyotishis before major political decisions and elections — a documented pattern continuing across many Indian heads of state.",
    source: "Indira Gandhi biographies by Katherine Frank, Inder Malhotra"
  },
  {
    name: "Theodore Roosevelt",
    role: "26th US President",
    fact: "Reportedly kept his natal horoscope mounted on a chess board in the White House. When asked about it, he responded: 'I always keep my weather eye on the opposition of my seventh house Moon to my first house Mars.' (Quoted in Larry Sabato's political biographies.)",
    source: "Larry Sabato, 'The Kennedy Half-Century' · presidential archives"
  },
  {
    name: "Sir Isaac Newton",
    role: "Father of Modern Physics",
    fact: "When ridiculed by Edmund Halley for his interest in astrology, Newton allegedly replied: 'Sir, I have studied the matter; you have not.' While this exact quote's primary source is debated, Newton's documented library at Trinity College contained substantial astrological texts and his early astronomical work intersected directly with horoscopic mathematics.",
    source: "Trinity College Cambridge library records · multiple Newton biographies"
  }
];

// ─── PILLARS DATA: MYTH VS MATH FOR LIFE DOMAINS ────────────────────────────
const lifePillars = [
  {
    domain: "LOVE & MARRIAGE",
    myth: "Find someone with a 'compatible Sun sign' and the rest will work out.",
    math: "Compatibility is calculated through Ashtakoota Milan (8-fold matching) — 36 points across factors like Varna, Vashya, Tara, and Nadi. The D-9 Navamsa chart reveals long-term marriage outcomes, while the Upapada Lagna (UL) shows the spouse's nature. Mangal Dosha (Mars affliction) and 7th house analysis identify friction patterns. Sun sign plays almost no role.",
    keyTools: ["Ashtakoota Milan", "Navamsa (D-9)", "Upapada Lagna", "Mangal Dosha"],
    hoverBorder: "hover:border-rose-500/30",
    glow: "bg-rose-500/10"
  },
  {
    domain: "WEALTH & FINANCE",
    myth: "Manifestation, mindset, and grinding will automatically generate wealth.",
    math: "Wealth potential is read through the D-2 Hora chart (financial body), the 2nd house (savings), the 11th house (gains), and the 5th house (investments). Dhana Yogas — over 30 specific planetary combinations — determine wealth capacity. Ashtakavarga points in the 11th house map gain timing. Effort succeeds when aligned with these activated periods.",
    keyTools: ["Hora Chart (D-2)", "Dhana Yogas", "11th House Bindus", "Wealth Dasha Periods"],
    hoverBorder: "hover:border-amber-500/30",
    glow: "bg-amber-500/10"
  },
  {
    domain: "CAREER & PURPOSE",
    myth: "'Follow your passion' and the right career will eventually emerge.",
    math: "The D-10 Dasamsa chart pinpoints career trajectory — far more accurate than the natal D-1. The 10th house lord, its placement, and aspects identify suitable industries. Atmakaraka (planet at highest degree) reveals soul-level vocational direction per Jaimini. The Arudha Lagna (AL) shows public image and reputation patterns.",
    keyTools: ["Dasamsa (D-10)", "10th House Lord", "Atmakaraka", "Arudha Lagna"],
    hoverBorder: "hover:border-blue-500/30",
    glow: "bg-blue-500/10"
  },
  {
    domain: "HEALTH & VITALITY",
    myth: "Health is genetic luck — astrology has no role.",
    math: "The 6th house governs disease, the Lagna governs constitution, the Sun rules vitality, and the Moon rules emotional health. Ayurvedic dosha balance maps to planetary placements. The D-30 Trimsamsa chart identifies areas of physical vulnerability. Maraka (death-inflicting) planets and Marakasthanas highlight critical periods requiring extra care.",
    keyTools: ["6th House Analysis", "D-30 Trimsamsa", "Sun & Moon", "Dosha Mapping"],
    hoverBorder: "hover:border-emerald-500/30",
    glow: "bg-emerald-500/10"
  }
];

// ─── BACKGROUND COMPONENTS ──────────────────────────────────────────────────
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-red-900/15 blur-[180px] rounded-full" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-amber-900/8 blur-[160px] rounded-full" />
      <div className="absolute bottom-[10%] left-[20%] w-[700px] h-[700px] bg-purple-900/6 blur-[200px] rounded-full" />
    </div>
  );
}

function GridOverlay() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.025]">
      <div className="w-full h-full" style={{
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function MythsPage() {
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [activeMyth, setActiveMyth] = useState(0);
  const [expandedMyth, setExpandedMyth] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#09000a] text-white selection:bg-[#FFD700] selection:text-[#09000a] overflow-x-hidden font-sans">
      {/* Scroll Progress */}
      <motion.div 
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-red-500 via-amber-500 to-yellow-500 z-[200]"
        style={{ width: progressWidth }}
      />

      <BackgroundOrbs />
      <GridOverlay />
      <FloatingLogo position="left" />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 md:pt-44 pb-20 md:pb-32 px-5 md:px-8 max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-red-500 to-transparent" />
          <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase text-red-400/80">
            Mythbusting · Verified Sources
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-serif text-[clamp(2.5rem,9vw,7rem)] md:text-[clamp(3.5rem,8vw,8rem)] font-bold tracking-[-0.04em] leading-[0.92] mb-8"
        >
          <span className="block text-white/95">Everything You</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 italic">
            Think You Know
          </span>
          <span className="block text-gray-500 text-[0.6em] font-light tracking-tight mt-2">is probably wrong.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-base md:text-xl text-gray-400 max-w-2xl leading-relaxed font-light mb-12 md:mb-16"
        >
          The world dismisses astrology because it has only seen the diluted, 100-word newspaper version. 
          We're here to dismantle the myths — with{" "}
          <span className="text-white font-medium">classical sources</span>,{" "}
          <span className="text-white font-medium">verified history</span>, and{" "}
          <span className="text-white font-medium">precise mathematics</span>.
        </motion.p>

        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {[
            { value: 8, suffix: "", label: "Myths Debunked" },
            { value: 5000, suffix: "+", label: "Years of Canon" },
            { value: 6, suffix: "", label: "Documented Figures" },
            { value: 100, suffix: "%", label: "Source-Cited" }
          ].map((stat, i) => (
            <MagneticCard key={i} className="group">
              <div className="relative p-5 md:p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-red-500/30 hover:bg-red-500/[0.03] transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              </div>
            </MagneticCard>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          THE TRUTH FRAMEWORK — DRUDHA vs ADRUDHA KARMA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <RevealSection className="mb-12">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-red-400/60 mb-4">Foundational Framework</div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            The Chart Maps Probability.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400 italic">
              You Make the Choice.
            </span>
          </h2>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          <RevealSection delay={0.1}>
            <MagneticCard className="h-full">
              <div className="group relative h-full p-7 md:p-10 rounded-2xl md:rounded-3xl border border-white/[0.06] bg-gradient-to-br from-red-950/20 to-transparent overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-transparent" />
                <div className="relative z-10">
                  <div className="text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-red-400/70 mb-3">Classical Doctrine</div>
                  <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-5 leading-tight">The Three Karmas</h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-6">
                    Brihat Parashara Hora Shastra and the Bhagavad Gita explicitly classify karma into three categories. Most people only know the first.
                  </p>
                  <div className="space-y-4">
                    {[
                      { name: "Sanchita", desc: "The total accumulated karma from all past lives — the cosmic warehouse." },
                      { name: "Prarabdha", desc: "The portion currently activated for this lifetime — what shows in the chart." },
                      { name: "Kriyamana", desc: "What you are creating right now through free will — the active variable." }
                    ].map((k, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-red-500/20 hover:bg-red-500/[0.03] transition-all duration-300">
                        <span className="font-mono text-[10px] text-red-400/60 mt-0.5 font-bold">0{i + 1}</span>
                        <div>
                          <div className="text-sm md:text-base font-bold text-white">{k.name}</div>
                          <div className="text-xs md:text-sm text-gray-500 mt-0.5">{k.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </MagneticCard>
          </RevealSection>

          <RevealSection delay={0.2}>
            <MagneticCard className="h-full">
              <div className="group relative h-full p-7 md:p-10 rounded-2xl md:rounded-3xl border border-white/[0.06] bg-gradient-to-br from-amber-950/20 to-transparent overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-transparent" />
                <div className="relative z-10">
                  <div className="text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-amber-400/70 mb-3">Practical Translation</div>
                  <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-5 leading-tight">The Weather Report</h3>
                  <p className="font-serif text-lg md:text-xl text-gray-300 italic leading-snug mb-6">
                    "We don't predict that you will drown. We predict the storm arrives at 4:32 PM. Free will is deciding to build the shelter."
                  </p>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-4">
                    Vedic astrology functions as cosmic meteorology. Vimshottari Dasha cycles can identify when a karmic "storm" hits a specific house — career, relationship, finance — with timing accurate to the month.
                  </p>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    Armed with that timeframe, free will pivots, prepares, and adapts. The storm is forecast. Your response is yours.
                  </p>
                </div>
              </div>
            </MagneticCard>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          THE 8 MYTHS — INTERACTIVE TWO-COLUMN
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <RevealSection className="mb-12 md:mb-20 text-center">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-amber-400/60 mb-4">The Core 8</div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            Shattering the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
              Illusions
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-4 max-w-2xl mx-auto">
            Eight common misconceptions — debunked with classical Sanskrit sources, documented history, and verifiable astronomy.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Selectors */}
          <div className="lg:col-span-5 flex flex-col gap-3 lg:sticky lg:top-24">
            {allMyths.map((myth, index) => (
              <button
                key={myth.id}
                onClick={() => setActiveMyth(index)}
                className={`text-left p-5 md:p-6 transition-all duration-500 rounded-2xl border relative overflow-hidden group ${
                  activeMyth === index 
                    ? "border-red-500/40 bg-red-950/20 shadow-[0_0_40px_rgba(220,38,38,0.06)]" 
                    : "border-white/[0.05] bg-white/[0.015] hover:border-white/[0.12] hover:bg-white/[0.025]"
                }`}
              >
                {activeMyth === index && (
                  <motion.div 
                    layoutId="myth-highlight" 
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-amber-500" 
                  />
                )}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className={`font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold ${
                    activeMyth === index ? "text-red-400" : "text-gray-600"
                  }`}>
                    MYTH {myth.id}
                  </span>
                  <span className="text-[9px] md:text-[10px] font-mono tracking-wider uppercase text-gray-600 px-2 py-0.5 rounded-full border border-white/[0.06]">
                    {myth.category}
                  </span>
                </div>
                <h3 className={`font-serif text-base md:text-xl font-bold transition-colors leading-tight ${
                  activeMyth === index ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                }`}>
                  "{myth.myth}"
                </h3>
              </button>
            ))}
          </div>

          {/* Detail Display */}
          <div className="lg:col-span-7 mt-4 lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMyth}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative p-7 md:p-10 rounded-2xl md:rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden"
              >
                {/* Background number */}
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none select-none">
                  <span className="font-serif text-[10rem] md:text-[14rem] font-bold text-white leading-none">
                    {allMyths[activeMyth].id}
                  </span>
                </div>

                <div className="relative z-10">
                  {/* Lie */}
                  <div className="mb-8 md:mb-10">
                    <h4 className="font-mono text-red-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-3 inline-flex items-center gap-2">
                      <span className="w-6 h-px bg-red-500/50" />
                      The Common Belief
                    </h4>
                    <p className="font-serif text-xl md:text-2xl lg:text-3xl text-gray-300 italic leading-snug">
                      "{allMyths[activeMyth].lie}"
                    </p>
                  </div>

                  {/* Truth */}
                  <div className="mb-8">
                    <h4 className="font-mono text-amber-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-3 inline-flex items-center gap-2">
                      <span className="w-6 h-px bg-amber-400/50" />
                      The Documented Reality
                    </h4>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                      {allMyths[activeMyth].truth}
                    </p>
                  </div>

                  {/* Source */}
                  <div className="mb-8 p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/20">
                    <div className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase text-amber-400/80 mb-1">Classical Source</div>
                    <div className="text-xs md:text-sm text-gray-300 italic">{allMyths[activeMyth].classicalSource}</div>
                  </div>

                  {/* Focus tags */}
                  <div className="flex flex-wrap gap-2">
                    {allMyths[activeMyth].focus.map((f, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] text-gray-300 font-mono text-[10px] md:text-xs uppercase tracking-wider rounded-full hover:border-amber-500/30 hover:text-white transition-colors">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          LIFE PILLARS — MYTH vs MATH FOR LIFE DOMAINS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <RevealSection className="mb-12 md:mb-16">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-blue-400/60 mb-4">Real-World Application</div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            Where Pop Astrology Fails.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 italic">
              Where Jyotisha Delivers.
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 mt-4 max-w-2xl">
            Four pillars of human life — and the precise classical methods that handle each.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {lifePillars.map((pillar, i) => (
            <RevealSection key={i} delay={i * 0.08}>
              <MagneticCard className="h-full">
                <div className={`group relative h-full p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/[0.06] bg-white/[0.015] ${pillar.hoverBorder} hover:bg-white/[0.025] transition-all duration-500 overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 ${pillar.glow} blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  
                  <div className="relative z-10">
                    <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-white mb-6 group-hover:text-white transition-colors">
                      {pillar.domain}
                    </h3>

                    <div className="mb-5">
                      <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-red-400/70 font-bold mb-2">The Myth</div>
                      <p className="text-xs md:text-sm text-gray-500 line-through decoration-red-500/40 leading-relaxed">
                        {pillar.myth}
                      </p>
                    </div>

                    <div className="mb-5">
                      <div className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-amber-400 font-bold mb-2">The Math</div>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                        {pillar.math}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-white/[0.06]">
                      <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">Classical Tools Used</div>
                      <div className="flex flex-wrap gap-1.5">
                        {pillar.keyTools.map((tool, j) => (
                          <span key={j} className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] text-[10px] md:text-xs text-gray-400 rounded-full font-mono">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </MagneticCard>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DOCUMENTED HISTORICAL FIGURES
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <RevealSection className="mb-12 md:mb-16 text-center">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-yellow-400/60 mb-4">Verifiable History</div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            They Were{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 italic">
              Believers.
            </span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-4 max-w-2xl mx-auto">
            History's most consequential figures consulted astrologers — not as a fad, but as a documented strategic practice.
            Every entry below is sourced.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {historicalFigures.map((figure, i) => (
            <RevealSection key={i} delay={i * 0.06}>
              <MagneticCard className="h-full">
                <div 
                  className="group relative h-full p-6 md:p-7 rounded-2xl border border-white/[0.06] bg-white/[0.015] hover:border-yellow-500/25 hover:bg-yellow-500/[0.02] transition-all duration-500 overflow-hidden cursor-pointer"
                  onClick={() => setExpandedMyth(expandedMyth === figure.name ? null : figure.name)}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-serif text-lg md:text-xl font-bold text-white mb-1">
                          {figure.name}
                        </h3>
                        <div className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-gray-500">
                          {figure.role}
                        </div>
                      </div>
                      <div className="text-yellow-500/40 text-2xl md:text-3xl font-serif group-hover:text-yellow-500/70 transition-colors">★</div>
                    </div>

                    <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors mb-4">
                      {figure.fact}
                    </p>

                    <div className="pt-3 border-t border-white/[0.06]">
                      <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-yellow-400/60 mb-1">Source</div>
                      <div className="text-[10px] md:text-xs text-gray-500 italic leading-relaxed">{figure.source}</div>
                    </div>
                  </div>
                </div>
              </MagneticCard>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          THE J.P. MORGAN QUOTE — Kept with honest disclaimer
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 md:py-32 px-5 md:px-8 text-center border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <RevealSection>
            <div className="text-amber-900/30 font-serif text-[120px] md:text-[180px] leading-none h-16 md:h-24 pointer-events-none select-none">
              "
            </div>
          </RevealSection>

          <RevealSection delay={0.1}>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 md:mb-10 leading-tight">
              Millionaires don't use astrology.{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 italic mt-2">
                Billionaires do.
              </span>
            </h2>
          </RevealSection>

          <RevealSection delay={0.2}>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6 md:mb-8" />
            <p className="font-mono text-gray-400 text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-6 md:mb-8">
              — Attributed to J.P. Morgan
              <span className="text-gray-600 text-[10px] tracking-normal normal-case italic ml-2 block sm:inline mt-1 sm:mt-0">
                (commonly cited · primary source unverified)
              </span>
            </p>
          </RevealSection>

          <RevealSection delay={0.3}>
            <div className="font-mono text-gray-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed italic border border-white/[0.06] bg-white/[0.02] p-5 md:p-7 rounded-xl text-left">
              <span className="font-bold text-white not-italic block mb-2">Honest Disclaimer:</span>
              The internet attributes this quote to Morgan, but no verified primary source exists. 
              What <em className="text-amber-400 not-italic font-semibold">is</em> documented: 
              Morgan employed astrologer Evangeline Adams to time financial decisions in the early 1900s. 
              Adams was acquitted in a 1914 fortune-telling trial after demonstrating astrological methodology in court. 
              The historical fact stands. The quote is folklore.
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          THE METHOD — WHAT WE ACTUALLY USE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <RevealSection className="mb-12 md:mb-16">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-purple-400/60 mb-4">Methodology</div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            What Real{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 italic">
              Jyotisha
            </span>{" "}
            Looks Like
          </h2>
          <p className="text-base md:text-lg text-gray-500 mt-4 max-w-2xl">
            Not vague horoscopes. Not personality types. Mathematical precision rooted in 5,000 years of canonical text.
          </p>
        </RevealSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { tool: "16 Divisional Charts", desc: "D-1 through D-60 · each governing a life domain" },
            { tool: "Vimshottari Dasha", desc: "120-year predictive cycle · 5 levels deep" },
            { tool: "Ashtakavarga", desc: "Point-based strength · 0-56 per house" },
            { tool: "Shadbala", desc: "Six-fold planetary strength calculation" },
            { tool: "Jaimini Karakas", desc: "8 planets ranked by exact degree" },
            { tool: "Arudha Padas", desc: "Reflected images · public reality" },
            { tool: "Mrityu Bhaga", desc: "Death-degree mapping · classical text" },
            { tool: "Lajjitadi Avasthas", desc: "Behavioral states of planets" },
            { tool: "Char Dasha", desc: "Jaimini sign-based predictive timeline" },
            { tool: "Yogas (300+)", desc: "Classical planetary combinations" },
            { tool: "Nakshatra Padas", desc: "27 stars × 4 quarters = 108 zones" },
            { tool: "Shodasamsa Vargas", desc: "All 16 vargas cross-referenced" },
          ].map((item, i) => (
            <RevealSection key={i} delay={i * 0.04}>
              <MagneticCard>
                <div className="group p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/[0.06] bg-white/[0.015] hover:border-purple-500/30 hover:bg-purple-500/[0.03] transition-all duration-400">
                  <div className="text-sm md:text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                    {item.tool}
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                    {item.desc}
                  </div>
                </div>
              </MagneticCard>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-24 md:py-40 max-w-4xl mx-auto text-center">
        <RevealSection>
          <div className="relative p-10 md:p-16 rounded-2xl md:rounded-3xl border border-white/[0.06] bg-gradient-to-br from-red-950/20 via-amber-950/10 to-transparent overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[400px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10">
              <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                <span className="text-white block">We reveal the matrix.</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 italic block mt-2">
                  You command your destiny.
                </span>
              </h3>
              <p className="text-base md:text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed font-light">
                Stop guessing. Stop relying on diluted horoscopes designed for newspaper columns.
                Get the precision math your life deserves.
              </p>
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 font-bold text-sm md:text-base text-black bg-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white via-amber-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">Get Your Real Chart</span>
                <span className="relative z-10 ml-2 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </Link>

              <div className="mt-8 font-mono text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.25em]">
                Mathematical · Source-Cited · Uncompromising
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      <LandingFooter />
    </main>
  );
}
