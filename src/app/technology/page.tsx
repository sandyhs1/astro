"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import FloatingLogo from "@/components/ui/FloatingLogo";
import LandingFooter from "@/components/LandingFooter";

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

// ─── MAGNETIC CARD COMPONENT ────────────────────────────────────────────────
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
    x.set((e.clientX - centerX) * 0.05);
    y.set((e.clientY - centerY) * 0.05);
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

// ─── GLOWING ORB BACKGROUND ─────────────────────────────────────────────────
function GlowingOrbs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[180px] rounded-full animate-pulse" />
      <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] bg-blue-600/8 blur-[160px] rounded-full" style={{ animation: 'pulse 8s ease-in-out infinite' }} />
      <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-indigo-600/6 blur-[200px] rounded-full" style={{ animation: 'pulse 12s ease-in-out infinite' }} />
      <div className="absolute top-[60%] right-[30%] w-[300px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full" style={{ animation: 'pulse 6s ease-in-out infinite' }} />
    </div>
  );
}

// ─── PARTICLE GRID ──────────────────────────────────────────────────────────
function ParticleGrid() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]">
      <div className="w-full h-full" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
    </div>
  );
}

// ─── SECTION REVEAL WRAPPER ─────────────────────────────────────────────────
function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── DATA ───────────────────────────────────────────────────────────────────

const heroStats = [
  { value: 127, suffix: "+", label: "Classical Vedic Metrics" },
  { value: 16, suffix: "", label: "Divisional Charts" },
  { value: 300, suffix: "+", label: "Yogas Auto-Detected" },
  { value: 50, suffix: "ms", prefix: "<", label: "Cache Response" },
];

const architectureLayers = [
  {
    id: "spatial",
    phase: "PHASE 01",
    title: "Spatial Geocoding & Temporal Normalization",
    subtitle: "Sub-100 Meter Precision",
    description: "The instant birth data is submitted, we bypass all standard approximations. A spatial geocoder extracts exact geographic coordinates to 4 decimal places — sub-100 meter accuracy on the Earth's surface.",
    details: [
      "WGS84 coordinate extraction with atmospheric refraction correction",
      "Dynamic historical UTC offset calculation for the exact moment in time",
      "Deterministic birth-hash generation via cryptographic SHA-256",
      "Three-layer cache lookup before any computation begins"
    ],
    gradient: "from-emerald-500/20 to-emerald-900/5",
    accentColor: "emerald",
    icon: "◎"
  },
  {
    id: "ephemeris",
    phase: "PHASE 02",
    title: "Astronomical Ephemeris Engine",
    subtitle: "0.0001° Precision · Sub-Arc-Second",
    description: "We do not guess planetary positions. Normalized coordinates are injected into a WebAssembly-compiled ephemeris engine utilizing algorithms originally designed for space navigation — achieving sub-arc-second precision.",
    details: [
      "True Chitra Paksha (Lahiri) Ayanamsa with geocentric parallax",
      "All 9 Grahas computed to 0.0001° — the precision of orbital mechanics",
      "16 Divisional Charts generated simultaneously (D-1 through D-60)",
      "Batch parallel computation — 24 astronomical calculations in a single round-trip"
    ],
    gradient: "from-blue-500/20 to-blue-900/5",
    accentColor: "blue",
    icon: "⊛"
  },
  {
    id: "vedic-engine",
    phase: "PHASE 03",
    title: "Deep-Vedic Diagnostic Layer",
    subtitle: "7 Custom Computation Engines",
    description: "This is where Quantum Karma separates from the entire industry. Raw astronomical data is fed into seven proprietary TypeScript engines that execute advanced Vedic mathematics locally — no external dependencies, no shortcuts.",
    details: [
      "Karmic Engine — cross-references all 16 divisional charts, detects 300+ classical Yogas",
      "Prediction Engine — layers Vimshottari Dasha 5 levels deep (Maha → Antar → Pratyantar)",
      "Transit Engine — 30-day Gochara mapping with Tithi/Nakshatra overlay",
      "Advanced Points — Lajjitadi Avasthas, Mrityu Bhaga, Pranapada, Jaimini Karakas",
      "Strength Analysis — Shadbala (6-fold), Ashtakavarga (0-56 point system), Vimshopaka"
    ],
    gradient: "from-purple-500/20 to-purple-900/5",
    accentColor: "purple",
    icon: "◈"
  },
  {
    id: "normalization",
    phase: "PHASE 04",
    title: "Cryptographic Data Normalization",
    subtitle: "Tens of Thousands of Data Points → One Payload",
    description: "At this stage, the system holds tens of thousands of fragmented astrological data points. Feeding this raw into any AI would cause immediate context overflow and hallucination. Our normalization layer solves this.",
    details: [
      "Custom compression algorithm strips all boilerplate, isolates core advanced flags",
      "Schema-versioned GoldenMaster object — auto-rebuilds on logic upgrades",
      "Deterministic caching — same birth data always produces identical output",
      "Typed, validated structure with confidence scoring at every node"
    ],
    gradient: "from-amber-500/20 to-amber-900/5",
    accentColor: "amber",
    icon: "⬡"
  },
  {
    id: "guardrails",
    phase: "PHASE 05",
    title: "3-Layer Security Guardrails",
    subtitle: "Sub-200ms · Zero Tolerance",
    description: "Before any intelligence is generated, every input passes through a military-grade 3-layer security system. Prompt injection, impersonation, off-topic manipulation — all neutralized before they reach the reasoning engine.",
    details: [
      "Layer 1 — Pattern matching at sub-millisecond speed (effectively free)",
      "Layer 2 — Lightweight AI classifier for subtle injection detection (~100ms)",
      "Layer 3 — Hardcoded identity lock, scope lock, and injection immunity in the reasoning layer",
      "Blocks: impersonation, role-play exploits, off-scope medical/legal/financial advice"
    ],
    gradient: "from-red-500/20 to-red-900/5",
    accentColor: "red",
    icon: "⊘"
  },
  {
    id: "rag",
    phase: "PHASE 06",
    title: "Scriptural RAG · 5,000 Years of Canon",
    subtitle: "Vector-Indexed Sanskrit Corpus",
    description: "Most astrology platforms hallucinate. Ours retrieves directly from canonical scripture. Every answer is grounded in 5,000 years of mathematically precise Vedic text — not internet astrology or social media captions.",
    details: [
      "7 primary Sanskrit sources: Brihat Parashara Hora Shastra, Jaimini Sutras, Phaladeepika, Hora Sara, Saravali, Nadi texts, Medical Astrology",
      "1024-dimensional vector embeddings with cosine similarity search",
      "Top-K retrieval with source metadata — every claim is citable",
      "Injected as authoritative references — the AI is forced to cite back to source text"
    ],
    gradient: "from-indigo-500/20 to-indigo-900/5",
    accentColor: "indigo",
    icon: "❖"
  },
  {
    id: "ai-matrix",
    phase: "PHASE 07",
    title: "3-Tier AI Reasoning Matrix",
    subtitle: "Multi-Cloud · Zero Downtime · Prompt-Cached",
    description: "The structured payload is routed through a proprietary 3-tier AI orchestration layer. A primary frontier reasoning engine, an enterprise-grade fallback with prompt caching, and a lightweight gatekeeper — ensuring zero downtime and sub-second classification.",
    details: [
      "Tier 1 — Primary frontier reasoning engine with massive context window",
      "Tier 2 — Enterprise fallback with cross-region inference and 90% prompt cache savings",
      "Tier 3 — Lightweight gatekeeper for sub-100ms intent classification",
      "Custom router with automatic failover, latency tracking, and per-call cost logging"
    ],
    gradient: "from-cyan-500/20 to-cyan-900/5",
    accentColor: "cyan",
    icon: "◉"
  },
  {
    id: "voice",
    phase: "PHASE 08",
    title: "Voice Intelligence Layer",
    subtitle: "Transcription · Sentiment · Intent",
    description: "Quantum Karma doesn't just read text — it listens. Our voice AI pipeline captures spoken questions, extracts emotional sentiment and true intent, then calibrates the reasoning engine's response to match the user's psychological state.",
    details: [
      "Real-time multi-language transcription with smart formatting",
      "Sentiment analysis — positive/negative/neutral with confidence scoring",
      "Intent recognition — automatically classifies career, love, anxiety, family queries",
      "Emotional calibration — the AI adjusts tone and depth based on detected state"
    ],
    gradient: "from-pink-500/20 to-pink-900/5",
    accentColor: "pink",
    icon: "◐"
  }
];

const techCapabilities = [
  { label: "Streaming Server-Side Rendering", category: "Frontend" },
  { label: "Edge Runtime Deployment", category: "Frontend" },
  { label: "Atomic Mobile-First Design System", category: "Frontend" },
  { label: "Production-Grade Motion Design", category: "Frontend" },
  { label: "50+ Dedicated API Endpoints", category: "Backend" },
  { label: "Type-Safe Schema Validation", category: "Backend" },
  { label: "Server Actions Architecture", category: "Backend" },
  { label: "PDF Generation & Processing", category: "Backend" },
  { label: "Vector Database (pgvector)", category: "Database" },
  { label: "Realtime Subscriptions", category: "Database" },
  { label: "Row-Level Security", category: "Database" },
  { label: "Deterministic Birth-Hash Cache", category: "Database" },
  { label: "Multi-Cloud LLM Orchestration", category: "AI" },
  { label: "Retrieval-Augmented Generation", category: "AI" },
  { label: "Prompt Caching (90% savings)", category: "AI" },
  { label: "Voice Sentiment + Intent", category: "AI" },
];

const defensibilityPoints = [
  {
    title: "Custom RAG on Canonical Sanskrit",
    description: "While competitors train on social media captions, our knowledge base is 5,000 years of mathematically precise Vedic scripture — chunked, embedded, and vector-indexed.",
    metric: "7 Primary Sources"
  },
  {
    title: "3-Tier LLM with Auto-Failover",
    description: "If one cloud provider fails, the system instantly routes to an enterprise fallback. Zero downtime. Zero user-facing errors. Ever.",
    metric: "99.99% Uptime"
  },
  {
    title: "Birth-Hash Deterministic Cache",
    description: "Every recurring user gets sub-50ms responses. Same birth data = same cryptographic hash = instant retrieval. No recomputation.",
    metric: "<50ms Cached"
  },
  {
    title: "Schema-Versioned Auto-Rebuild",
    description: "When our Vedic logic upgrades, cached charts auto-rebuild without data migration. Users always get the latest computation without waiting.",
    metric: "Zero Migration"
  },
  {
    title: "Voice as First-Class Input",
    description: "No other Vedic platform processes voice with sentiment analysis and intent recognition. We calibrate AI responses to the user's emotional state.",
    metric: "3 AI Layers"
  },
  {
    title: "Every Output is Traceable",
    description: "Every prediction maps back to a citable classical rule. Every computation is mathematically verifiable. Open methodology, zero hallucination.",
    metric: "100% Citable"
  }
];

const latencyBudget = [
  { step: "Edge-Rendered First Paint", firstTime: "800ms", returning: "400ms" },
  { step: "Geocoding & Validation", firstTime: "250ms", returning: "0ms (cached)" },
  { step: "Cache Lookup (3 tables)", firstTime: "50ms", returning: "50ms → HIT" },
  { step: "Chart Construction (24 parallel calls)", firstTime: "4-6s", returning: "0ms (cached)" },
  { step: "Guardrails (3 layers)", firstTime: "100ms", returning: "100ms" },
  { step: "RAG Retrieval (vector search)", firstTime: "300ms", returning: "300ms" },
  { step: "AI Synthesis (streaming)", firstTime: "2-5s", returning: "2-5s" },
  { step: "Total to First Answer", firstTime: "~8-12s", returning: "~3-5s" },
];

// ─── MAIN PAGE COMPONENT ────────────────────────────────────────────────────

export default function TechnologyPage() {
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [hoveredCap, setHoveredCap] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-purple-500/30 selection:text-white font-sans overflow-x-hidden">
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 z-[200]"
        style={{ width: progressWidth }}
      />

      <GlowingOrbs />
      <ParticleGrid />
      <FloatingLogo />

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-32 md:pt-44 pb-20 md:pb-32 px-5 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-purple-500 to-transparent" />
          <span className="text-[11px] md:text-xs font-mono tracking-[0.3em] uppercase text-purple-400/80">
            System Architecture · v2.0
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-[clamp(2.5rem,8vw,6rem)] md:text-[clamp(3.5rem,7vw,7rem)] font-black tracking-[-0.04em] leading-[0.95] mb-8"
        >
          <span className="block text-white/90">The Engine</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
            Behind Destiny
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-base md:text-xl text-gray-400 max-w-2xl leading-relaxed font-light mb-16"
        >
          While legacy platforms return basic planetary signs from a single API call, 
          Quantum Karma orchestrates <span className="text-white font-medium">127 classical metrics</span>, {" "}
          <span className="text-white font-medium">16 divisional charts</span>, and {" "}
          <span className="text-white font-medium">5,000 years of canonical scripture</span> — 
          synthesized through a multi-cloud AI matrix in under 8 seconds.
        </motion.p>

        {/* Hero Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {heroStats.map((stat, i) => (
            <MagneticCard key={i} className="group">
              <div className="relative p-5 md:p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-purple-500/30 hover:bg-purple-500/[0.03] transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="text-2xl md:text-4xl font-black tracking-tight text-white mb-1 md:mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <div className="text-[11px] md:text-xs text-gray-500 font-medium tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              </div>
            </MagneticCard>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          THE PROMISE SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <RevealSection>
          <div className="relative p-8 md:p-14 rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/5 blur-[80px] rounded-full" />
            
            <div className="relative z-10">
              <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-purple-400/60 mb-4">The Promise</div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-6">
                When you type your date of birth,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  this is what actually happens.
                </span>
              </h2>
              <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-3xl">
                127 classical Vedic metrics. 16 divisional charts. 300+ yogas. 5 levels of Dasha cycles. 
                5,000 years of Sanskrit scripture. Processed in under 8 seconds — rendered as a personalized, 
                mathematically grounded life report. Every subsequent visit: sub-50 milliseconds.
              </p>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          ARCHITECTURE DEEP-DIVE — STACKED CARDS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-6xl mx-auto">
        <RevealSection className="mb-16 md:mb-20">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-blue-400/60 mb-4">Deep Architecture</div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
            8 Phases.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Zero Shortcuts.
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 mt-4 max-w-2xl">
            Every phase is a precision-engineered subsystem. Click any card to explore the technical depth.
          </p>
        </RevealSection>

        <div className="space-y-6 md:space-y-8">
          {architectureLayers.map((layer, index) => (
            <RevealSection key={layer.id} delay={index * 0.05}>
              <motion.div
                layout
                onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                className={`group relative cursor-pointer rounded-2xl md:rounded-3xl border transition-all duration-500 overflow-hidden
                  ${activeLayer === layer.id 
                    ? 'border-white/20 bg-white/[0.04] shadow-2xl shadow-purple-500/5' 
                    : 'border-white/[0.06] bg-white/[0.015] hover:border-white/[0.12] hover:bg-white/[0.025]'
                  }`}
                whileHover={{ scale: activeLayer === layer.id ? 1 : 1.005 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >

                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${layer.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                
                {/* Card Content */}
                <div className="relative z-10 p-6 md:p-10">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="text-2xl md:text-3xl opacity-40 group-hover:opacity-80 transition-opacity">{layer.icon}</span>
                      <div>
                        <div className="text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase text-gray-500 group-hover:text-gray-400 transition-colors">
                          {layer.phase}
                        </div>
                        <h3 className="text-lg md:text-2xl lg:text-3xl font-bold tracking-tight text-gray-100 group-hover:text-white transition-colors mt-0.5">
                          {layer.title}
                        </h3>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: activeLayer === layer.id ? 45 : 0 }}
                      className="text-gray-600 group-hover:text-gray-400 transition-colors text-xl md:text-2xl flex-shrink-0 ml-4"
                    >
                      +
                    </motion.div>
                  </div>

                  {/* Subtitle Badge */}
                  <div className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] md:text-[11px] font-mono tracking-wider text-gray-400 mb-4">
                    {layer.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {layer.description}
                  </p>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {activeLayer === layer.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 mt-6 border-t border-white/[0.06]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {layer.details.map((detail, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300"
                              >
                                <span className="text-purple-400/60 mt-0.5 text-xs">▸</span>
                                <span className="text-sm text-gray-300 leading-relaxed">{detail}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TECH CAPABILITIES GRID — FLOATING TAGS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <RevealSection className="mb-12 md:mb-16">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-cyan-400/60 mb-4">Technical Surface</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Built With{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Obsessive Precision
            </span>
          </h2>
        </RevealSection>

        <RevealSection delay={0.1}>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {techCapabilities.map((cap, i) => (
              <motion.div
                key={i}
                onHoverStart={() => setHoveredCap(i)}
                onHoverEnd={() => setHoveredCap(null)}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`relative px-4 py-2.5 md:px-5 md:py-3 rounded-xl border cursor-default transition-all duration-300 ${
                  hoveredCap === i
                    ? 'border-purple-500/40 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    cap.category === 'Frontend' ? 'bg-emerald-400' :
                    cap.category === 'Backend' ? 'bg-blue-400' :
                    cap.category === 'Database' ? 'bg-amber-400' :
                    'bg-purple-400'
                  }`} />
                  <span className="text-xs md:text-sm text-gray-300 font-medium">{cap.label}</span>
                </div>
                {hoveredCap === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-gray-400 whitespace-nowrap"
                  >
                    {cap.category}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </RevealSection>

        {/* Category Legend */}
        <RevealSection delay={0.2} className="mt-8 flex flex-wrap gap-4 md:gap-6">
          {["Frontend", "Backend", "Database", "AI"].map((cat) => (
            <div key={cat} className="flex items-center gap-2 text-xs text-gray-500">
              <span className={`w-2 h-2 rounded-full ${
                cat === 'Frontend' ? 'bg-emerald-400' :
                cat === 'Backend' ? 'bg-blue-400' :
                cat === 'Database' ? 'bg-amber-400' :
                'bg-purple-400'
              }`} />
              {cat}
            </div>
          ))}
        </RevealSection>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DEFENSIBILITY — BENTO GRID
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <RevealSection className="mb-12 md:mb-16">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-amber-400/60 mb-4">Competitive Moat</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Why This Stack Is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Indefensible
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-500 mt-4 max-w-2xl">
            Six architectural decisions that make Quantum Karma impossible to replicate overnight.
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {defensibilityPoints.map((point, i) => (
            <RevealSection key={i} delay={i * 0.06}>
              <MagneticCard className="h-full">
                <div className="group relative h-full p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] hover:border-amber-500/20 hover:bg-amber-500/[0.02] transition-all duration-500 overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Metric Badge */}
                    <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono tracking-wider text-amber-400 mb-4">
                      {point.metric}
                    </div>
                    
                    <h3 className="text-base md:text-lg font-bold text-gray-100 group-hover:text-white transition-colors mb-3">
                      {point.title}
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 leading-relaxed transition-colors">
                      {point.description}
                    </p>
                  </div>
                </div>
              </MagneticCard>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          LATENCY BUDGET TABLE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-5xl mx-auto">
        <RevealSection className="mb-12 md:mb-16">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-green-400/60 mb-4">Performance Budget</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Every Millisecond{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Accounted For
            </span>
          </h2>
        </RevealSection>

        <RevealSection delay={0.1}>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1fr_1fr] gap-4 px-5 md:px-8 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <span className="text-[10px] md:text-xs font-mono tracking-wider uppercase text-gray-500">Pipeline Step</span>
              <span className="text-[10px] md:text-xs font-mono tracking-wider uppercase text-gray-500 text-right md:text-center">First Visit</span>
              <span className="text-[10px] md:text-xs font-mono tracking-wider uppercase text-gray-500 text-right md:text-center">Returning</span>
            </div>
            
            {/* Table Rows */}
            {latencyBudget.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1fr_1fr] gap-4 px-5 md:px-8 py-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                  i === latencyBudget.length - 1 ? 'bg-white/[0.03] border-b-0' : ''
                }`}
              >
                <span className={`text-xs md:text-sm ${i === latencyBudget.length - 1 ? 'text-white font-bold' : 'text-gray-300'}`}>
                  {row.step}
                </span>
                <span className={`text-xs md:text-sm font-mono text-right md:text-center ${i === latencyBudget.length - 1 ? 'text-amber-400 font-bold' : 'text-gray-400'}`}>
                  {row.firstTime}
                </span>
                <span className={`text-xs md:text-sm font-mono text-right md:text-center ${i === latencyBudget.length - 1 ? 'text-green-400 font-bold' : 'text-green-400/70'}`}>
                  {row.returning}
                </span>
              </motion.div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DATA FLOW VISUALIZATION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-5xl mx-auto">
        <RevealSection className="mb-12 md:mb-16">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-indigo-400/60 mb-4">Data Flow</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            From Birth Data to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Karmic Intelligence
            </span>
          </h2>
        </RevealSection>

        <RevealSection delay={0.1}>
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-5 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/40 via-blue-500/20 to-transparent" />

            {/* Flow Steps */}
            {[
              { label: "User Input", desc: "Date, time, place of birth submitted", color: "purple" },
              { label: "Geocoding", desc: "Spatial coordinates extracted to 0.0001° precision", color: "blue" },
              { label: "Birth Hash", desc: "SHA-256 deterministic key generated", color: "indigo" },
              { label: "Cache Check", desc: "3-table lookup — hit = instant response", color: "green" },
              { label: "Ephemeris Engine", desc: "24 parallel astronomical computations", color: "cyan" },
              { label: "Vedic Engines", desc: "7 custom engines compute 127 metrics + 300 yogas", color: "purple" },
              { label: "Normalization", desc: "Compressed into schema-versioned GoldenMaster payload", color: "amber" },
              { label: "Guardrails", desc: "3-layer security screening in <200ms", color: "red" },
              { label: "RAG Retrieval", desc: "Vector search across 5,000 years of Sanskrit canon", color: "indigo" },
              { label: "AI Synthesis", desc: "3-tier reasoning matrix with streaming response", color: "blue" },
              { label: "Delivery", desc: "Rendered, persisted, optionally compiled to PDF", color: "emerald" },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.06 }}
                className="relative pl-12 md:pl-20 pb-8 md:pb-10 group"
              >
                {/* Dot */}
                <div className={`absolute left-[14px] md:left-[26px] top-1 w-3 h-3 rounded-full border-2 border-${step.color}-400/60 bg-[#030303] group-hover:bg-${step.color}-400/20 transition-colors`} />
                
                <div className="text-sm md:text-base font-bold text-gray-200 group-hover:text-white transition-colors">
                  {step.label}
                </div>
                <div className="text-xs md:text-sm text-gray-500 group-hover:text-gray-400 transition-colors mt-0.5">
                  {step.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DESIGN PRINCIPLES
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <RevealSection className="mb-12 md:mb-16">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-rose-400/60 mb-4">Core Principles</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Engineering{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
              Philosophy
            </span>
          </h2>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {[
            { principle: "Deterministic Cache Before Any Compute", detail: "Same birth = same hash = same chart, forever. No wasted cycles." },
            { principle: "Schema Versioning Over Data Migration", detail: "Upgrades auto-rebuild without touching existing data. Zero downtime." },
            { principle: "3-Tier LLM With Automatic Failover", detail: "Never fail because one provider fails. Graceful degradation at every layer." },
            { principle: "RAG Over Sanskrit Canon", detail: "Every claim traceable to a citable classical rule. Zero hallucination tolerance." },
            { principle: "Guardrails Before Reasoning", detail: "Refuse cheap, fail safe. Security screening completes before any AI inference." },
            { principle: "Voice as First-Class Input", detail: "Sentiment and intent calibrate the AI. Emotional context shapes every response." },
            { principle: "Cost Observability at Every Call", detail: "Per-call token spend, latency, cache hit rates — all tracked in real-time." },
            { principle: "Privacy by Default", detail: "Birth data never trains external models. Encrypted at rest. TLS 1.3 in transit." },
          ].map((item, i) => (
            <RevealSection key={i} delay={i * 0.05}>
              <div className="group p-5 md:p-7 rounded-2xl border border-white/[0.05] bg-white/[0.01] hover:border-rose-500/20 hover:bg-rose-500/[0.02] transition-all duration-400">
                <div className="flex items-start gap-3">
                  <span className="text-rose-400/40 font-mono text-sm mt-0.5 group-hover:text-rose-400/70 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-gray-200 group-hover:text-white transition-colors mb-1">
                      {item.principle}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          NUMBERS THAT MATTER — LARGE DISPLAY
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-20 md:py-32 max-w-7xl mx-auto">
        <RevealSection className="mb-12 md:mb-16 text-center">
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/40 mb-4">By The Numbers</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Precision at{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Scale
            </span>
          </h2>
        </RevealSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { value: 50, suffix: "+", label: "API Endpoints" },
            { value: 7, suffix: "", label: "Custom Engines" },
            { value: 5, suffix: "", label: "Dasha Levels Deep" },
            { value: 90, suffix: "%", label: "Cache Cost Savings" },
            { value: 127, suffix: "", label: "Metrics Per Chart" },
            { value: 3, suffix: "", label: "LLM Tiers" },
            { value: 8, suffix: "s", prefix: "<", label: "Cold Start" },
            { value: 15, suffix: "+", label: "Sanskrit Sources" },
          ].map((stat, i) => (
            <RevealSection key={i} delay={i * 0.04}>
              <div className="group text-center p-5 md:p-8 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-400">
                <div className="text-3xl md:text-5xl font-black text-white/90 group-hover:text-white transition-colors mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
                </div>
                <div className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wider uppercase group-hover:text-gray-400 transition-colors">
                  {stat.label}
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 md:px-8 py-24 md:py-40 max-w-4xl mx-auto text-center">
        <RevealSection>
          <div className="relative p-10 md:p-16 rounded-3xl border border-white/[0.06] bg-gradient-to-br from-purple-500/[0.03] to-blue-500/[0.03] overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[400px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                  Experience the Precision
                </span>
              </h3>
              <p className="text-base md:text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed font-light">
                Through rigorous, uncompromised edge-computation — receive a clinically accurate, 
                mathematically backed, and deeply personalized astrological analysis that cannot be 
                replicated by any standard platform.
              </p>
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 font-bold text-sm md:text-base text-black bg-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white via-purple-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">Access the Oracle</span>
                <span className="relative z-10 ml-2 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Bottom Gradient Fade */}
      <div className="h-32 bg-gradient-to-t from-[#030303] to-transparent" />

      <LandingFooter />
    </div>
  );
}
