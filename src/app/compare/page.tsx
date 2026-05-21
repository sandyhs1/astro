'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import LandingFooter from '@/components/LandingFooter';
import {
  ChevronLeft, Sparkles, Star, Cpu, Heart, MessageCircle,
  Database, Activity, Zap, CheckCircle2, XCircle, ShieldCheck,
  Infinity as InfinityIcon, ArrowRight, Quote, Flame, Eye,
  Target, Compass, Atom, Gauge, Lock, Moon, Sun, TrendingUp,
  Layers, Brain, Wand2, GitBranch, Rocket
} from 'lucide-react';

type Competitor = 'costar' | 'chani' | 'astrotalk' | 'astrosage' | 'pattern' | 'sanctuary' | 'timepassages';

/* ─────────────────────────────────────────────────────────────
   ANIMATED COSMIC ORBIT (LOOP ANIMATION)
   ───────────────────────────────────────────────────────────── */
function CosmicOrbit() {
  return (
    <div className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px] mx-auto">
      {/* Concentric Rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute inset-0 rounded-full border border-indigo-400/20"
          style={{ scale: 0.4 + ring * 0.2 }}
          animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 30 + ring * 10, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.8)]"
            style={{ top: 0, left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </motion.div>
      ))}

      {/* Outer dashed ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      {/* Center Glow Core */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.6)]"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles size={28} color="#fff" />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   KARMIC LOOP ILLUSTRATION (Trapped vs Free)
   ───────────────────────────────────────────────────────────── */
function KarmicLoopIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
      <defs>
        <linearGradient id="loopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer infinity loop */}
      <motion.path
        d="M 80 200 C 80 130, 160 130, 200 200 C 240 270, 320 270, 320 200 C 320 130, 240 130, 200 200 C 160 270, 80 270, 80 200 Z"
        fill="none"
        stroke="url(#loopGrad)"
        strokeWidth="3"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Moving particles along loop */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          r="6"
          fill="#fff"
          filter="url(#glow)"
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: '100%' }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear',
          }}
          style={{
            offsetPath: "path('M 80 200 C 80 130, 160 130, 200 200 C 240 270, 320 270, 320 200 C 320 130, 240 130, 200 200 C 160 270, 80 270, 80 200 Z')",
          }}
        />
      ))}

      {/* Center label */}
      <text x="200" y="205" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900" letterSpacing="2">
        BREAK THE LOOP
      </text>
    </svg>
  );
}

export default function ComparePage() {
  const [activeTab, setActiveTab] = useState<Competitor>('costar');
  const [activeStory, setActiveStory] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  // Mouse follow effect for hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 30);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 30);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  // Auto rotate testimonial
  useEffect(() => {
    const t = setInterval(() => setActiveStory((s) => (s + 1) % 4), 5500);
    return () => clearInterval(t);
  }, []);

  const COMPETITORS: Record<Competitor, {
    name: string; tagline: string; icon: React.ReactNode; color: string;
    tldr: string; superpower: string; difference: string;
    features: { name: string; them: string; us: string }[];
  }> = {
    costar: {
      name: 'Co-Star',
      tagline: 'The Social Phenomenon',
      icon: <Star size={18} />,
      color: 'from-amber-500 to-orange-500',
      tldr: 'Co-Star is the ultimate social astrology experience for the Instagram generation. Quantum Karma is a diagnostic instrument for breaking karmic loops using raw Vedic math.',
      superpower: 'Co-Star completely revolutionized how we talk about astrology. Their minimalist design, NASA JPL astronomical data, and blunt, meme-worthy push notifications made horoscopes a shared cultural experience. If you want to compare sun signs with friends at a party, Co-Star is unmatched.',
      difference: 'Co-Star uses the Western Tropical zodiac, which is based on seasons and currently ~24 degrees off from the actual physical sky. It focuses on surface-level placements (Sun, Moon, Rising) and uses algorithms to match those to pre-written text. Quantum Karma uses the Sidereal (Vedic) zodiac, calculating your exact position against the physical constellations. We compute advanced metrics like Nakshatras, Dasha timing cycles, and divisional charts (up to D-60) to provide a structural diagnosis of your life path, rather than a daily mood update.',
      features: [
        { name: 'Zodiac System', them: 'Western Tropical', us: 'Vedic Sidereal (Astronomically accurate)' },
        { name: 'Predictive Timing', them: 'Basic Transits', us: 'Vimshottari & Jaimini Dashas' },
        { name: 'Remedies', them: 'None', us: 'Mantras, Rituals, Karma Alignment' },
        { name: 'Vibe', them: 'Social & Provocative', us: 'Diagnostic & Uncompromising' },
      ],
    },
    chani: {
      name: 'CHANI',
      tagline: 'The Affirming Guide',
      icon: <Heart size={18} />,
      color: 'from-rose-500 to-pink-500',
      tldr: 'CHANI offers beautiful, affirming, socially conscious Western astrology. Quantum Karma delivers blunt, mathematically rigorous Vedic diagnostics.',
      superpower: 'CHANI is a masterpiece of emotional intelligence and inclusive design. Their weekly horoscopes, podcast integrations, and focus on self-care and affirmation provide a deeply nurturing space. It is the perfect app for emotional validation and progressive cosmic reflection.',
      difference: 'CHANI is built on Western Tropical astrology and emphasizes psychological healing and affirmation. Quantum Karma takes a fundamentally different philosophical approach: Parashari and Jaimini Vedic astrology. We do not focus on psychological validation; we focus on structural reality. By calculating your Lajjitadi Avasthas (planetary behavioral states) and Upapada Lagna, we diagnose exactly why certain areas of your life are blocked and provide the mathematical remedies to bypass those karmic constraints.',
      features: [
        { name: 'Core Focus', them: 'Emotional Affirmation', us: 'Structural Life Diagnostics' },
        { name: 'Divisional Charts', them: 'D-1 (Natal only)', us: 'D-1 through D-60' },
        { name: 'Calculation Depth', them: 'Standard Planetary Degrees', us: 'Shadbala & Ashtakavarga Points' },
        { name: 'Vibe', them: 'Nurturing & Inclusive', us: 'Technical & Blunt' },
      ],
    },
    astrotalk: {
      name: 'Astrotalk',
      tagline: 'The Freelance Marketplace',
      icon: <MessageCircle size={18} />,
      color: 'from-emerald-500 to-teal-500',
      tldr: 'Astrotalk connects you with human astrologers paying by the minute. Quantum Karma gives you instant, unified, top-tier calculation without the ticking clock.',
      superpower: 'Astrotalk built a massive marketplace that made connecting with a live Vedic astrologer in India as easy as ordering food. For users who strictly want human-to-human interaction and are willing to browse reviews to find a practitioner they vibe with, their platform scale is incredible.',
      difference: 'Astrotalk relies entirely on the individual freelancer you happen to select. The quality, accuracy, and depth of the reading vary wildly depending on their mood, memory, and calculation speed while the per-minute timer drains your wallet. Quantum Karma removes the human error and the ticking clock. Our engine instantly synthesizes millions of classical data points—including complex calculations like Mrityu Bhaga and Pranapada—that a human cannot compute in their head, delivering a hyper-targeted, unified intelligence report at a flat rate.',
      features: [
        { name: 'Delivery Model', them: 'Per-minute Chat/Call', us: 'Instant Intelligence Report' },
        { name: 'Consistency', them: 'Varies by Freelancer', us: '100% Unified & Flawless' },
        { name: 'Upsells', them: 'Frequent Gemstone Upsells', us: 'Zero Upsells. Ever.' },
        { name: 'Vibe', them: 'Human Consultation', us: 'Data-Driven Autonomy' },
      ],
    },
    astrosage: {
      name: 'Astrosage',
      tagline: 'The Legacy Calculator',
      icon: <Database size={18} />,
      color: 'from-blue-500 to-cyan-500',
      tldr: 'Astrosage is a powerhouse of raw Vedic calculations wrapped in a legacy UI. Quantum Karma takes that same hardcore math and synthesizes it into actionable, modern intelligence.',
      superpower: 'Astrosage is the undisputed OG of digital Vedic astrology. Their calculation engine is historically robust, offering an overwhelming amount of raw data, charts, and tables for free. For traditional astrologers who just need a quick ephemeris lookup, it remains a vital utility.',
      difference: 'Astrosage generates raw data—massive, confusing PDFs and endless tables wrapped in intrusive pop-up ads and 1990s web frameworks. It leaves the synthesis entirely up to you. Quantum Karma takes the same uncompromising Sidereal math and processes it. We do not just show you a grid of your Ashtakavarga points; our AI engine synthesizes what those points mean for your career timing this specific month, delivered in a stunning, premium, ad-free mobile interface.',
      features: [
        { name: 'User Interface', them: 'Legacy 1990s Web', us: 'Premium, Modern App' },
        { name: 'Data Output', them: 'Raw Tables & PDFs', us: 'Synthesized AI Intelligence' },
        { name: 'Monetization', them: 'Intrusive Ads & Popups', us: 'Clean Subscription / Credits' },
        { name: 'Vibe', them: 'Cluttered Utility', us: 'Sleek & Actionable' },
      ],
    },
    pattern: {
      name: 'The Pattern',
      tagline: 'The Psychological Mirror',
      icon: <Activity size={18} />,
      color: 'from-violet-500 to-purple-500',
      tldr: 'The Pattern excels at psychological behavioral analysis based on transits. Quantum Karma exposes the actual math to help you break those patterns.',
      superpower: 'The Pattern is genius at translating complex astrological transits into hyper-relatable psychological insights. Their relationship dynamics and "timing" descriptions are incredibly well-written. They successfully made astrology accessible by completely hiding the astrology.',
      difference: 'The Pattern obfuscates its mechanics—it tells you what your pattern is, but hides the planets and the math behind a black box. Quantum Karma believes in total transparency. We do not just tell you that you have a "relationship loop"; we show you the exact Upapada Lagna and Navamsa placements causing it. By exposing the raw Vedic mechanics, we give you the diagnostic tools to actually rewrite your code, rather than just observing it.',
      features: [
        { name: 'Astrology Visibility', them: 'Hidden (Black Box)', us: 'Exposed & Explained' },
        { name: 'System', them: 'Western Tropical', us: 'Vedic Sidereal' },
        { name: 'Remedial Action', them: 'Observation', us: 'Actionable Protocols' },
        { name: 'Vibe', them: 'Psychological Insight', us: 'Mathematical Diagnosis' },
      ],
    },
    sanctuary: {
      name: 'Sanctuary',
      tagline: 'Astrology on Demand',
      icon: <Zap size={18} />,
      color: 'from-yellow-500 to-amber-500',
      tldr: 'Sanctuary offers beautiful daily horoscopes and quick Western astrology text chats. Quantum Karma provides deep, systemic Vedic life navigation.',
      superpower: 'Sanctuary created a beautifully branded, highly accessible "astrology on demand" service. Their daily free content is visually stunning, and their text-based readings provide a quick, low-friction way to get basic Western astrological insights on the go.',
      difference: 'Sanctuary focuses on quick-hit Western readings and daily micro-content. Quantum Karma is built for systemic life strategy. We do not do "quick hits." Our Destiny Window maps your entire 30-day timeline using precise Nakshatra transits and granular Tithi data, while our Karma DNA engine processes your entire karmic blueprint. It is the difference between a daily vitamin and a full-body MRI.',
      features: [
        { name: 'Engagement', them: 'Daily Micro-Content', us: 'Deep Systemic Reports' },
        { name: 'Chat Mechanics', them: 'Human Text Chat', us: 'High-Fidelity AI Synthesis' },
        { name: 'Predictive Scope', them: 'Daily Horoscopes', us: '30-Day Destiny Window' },
        { name: 'Vibe', them: 'Accessible & Bright', us: 'Deep & Clinical' },
      ],
    },
    timepassages: {
      name: 'Time Passages',
      tagline: 'The Western Standard',
      icon: <Cpu size={18} />,
      color: 'from-slate-400 to-zinc-500',
      tldr: 'Time Passages is the technical gold standard for Western astrology. Quantum Karma brings that level of rigor to the superior predictive timing of the Vedic system.',
      superpower: 'Time Passages is beloved by professional Western astrologers for a reason. Their calculation engine is superb, their transit graphs are excellent, and their app is packed with highly technical, accurate data for the Tropical system.',
      difference: 'Time Passages represents the absolute peak of what Western Tropical astrology can offer. However, Western astrology inherently lacks the predictive timing mechanics unique to the East. Quantum Karma utilizes the Vedic Sidereal system, which includes the Vimshottari Dasha system (planetary time cycles) and the 27 Nakshatras. If you want psychological profiling, Time Passages is incredible. If you want to know *exactly when* an event will occur, Quantum Karma\'s Vedic engine is mathematically designed for predictive timing.',
      features: [
        { name: 'System Framework', them: 'Western Tropical', us: 'Vedic Sidereal' },
        { name: 'Timing Mechanics', them: 'Transits & Progressions', us: 'Dashas & Gocharas' },
        { name: 'Lunar Analysis', them: 'Moon Phases', us: '27 Nakshatras (Lunar Mansions)' },
        { name: 'Vibe', them: 'Technical Western', us: 'Technical Vedic' },
      ],
    },
  };

  const activeData = COMPETITORS[activeTab];

  /* ─── Emotional benefit-focused transformation cards ─── */
  const TRANSFORMATIONS = [
    {
      icon: <Flame size={22} />,
      from: 'Endlessly dating the same toxic archetype',
      to: 'See the exact karmic pattern behind every match',
      tag: 'Love',
      hue: 'from-rose-500 to-pink-600',
    },
    {
      icon: <Rocket size={22} />,
      from: 'Career stagnation despite working harder',
      to: 'Know the precise Dasha window opening for your rise',
      tag: 'Career',
      hue: 'from-indigo-500 to-blue-600',
    },
    {
      icon: <Brain size={22} />,
      from: 'Anxiety loops that no app can name',
      to: 'A mathematical map of every emotional trigger',
      tag: 'Mind',
      hue: 'from-purple-500 to-fuchsia-600',
    },
    {
      icon: <TrendingUp size={22} />,
      from: 'Generic horoscopes that say nothing real',
      to: 'Hyper-targeted intelligence calibrated to your chart',
      tag: 'Clarity',
      hue: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <Heart size={22} />,
      from: 'Spiritual seeking with no real answers',
      to: 'Ancient wisdom rendered as living, actionable code',
      tag: 'Spirit',
      hue: 'from-amber-500 to-orange-600',
    },
    {
      icon: <Wand2 size={22} />,
      from: 'Paying $300/hour for cryptic readings',
      to: 'A flat subscription, infinite depth, zero upsells',
      tag: 'Freedom',
      hue: 'from-cyan-500 to-sky-600',
    },
  ];

  /* ─── Process flow steps ─── */
  const PROCESS = [
    {
      icon: <Compass size={20} />,
      title: 'Birth Signature',
      desc: 'Your exact moment in the physical sky — to the second.',
    },
    {
      icon: <Atom size={20} />,
      title: 'Sidereal Math',
      desc: 'Swiss Ephemeris computes 100+ classical Vedic metrics.',
    },
    {
      icon: <Layers size={20} />,
      title: 'Karma DNA',
      desc: 'Your structural blueprint — Nakshatras, Dashas, D-charts.',
    },
    {
      icon: <Brain size={20} />,
      title: 'AI Synthesis',
      desc: 'Classical wisdom translated into clear, modern action.',
    },
    {
      icon: <Target size={20} />,
      title: 'You, Activated',
      desc: 'Break the loop. Make the move. Rewrite the timeline.',
    },
  ];

  /* ─── User stories ─── */
  const STORIES = [
    {
      quote: 'I had been chasing the wrong career for 12 years. The Dasha report told me my Mercury cycle was opening in 4 months. I pivoted. Within a year, I doubled my income.',
      author: 'Priya · Product Strategist',
      tag: 'Career Breakthrough',
    },
    {
      quote: 'My therapist could not explain why I kept attracting unavailable men. The Upapada Lagna analysis showed me — clearly, mathematically. I broke the loop.',
      author: 'Jordan · Designer',
      tag: 'Relationship Reset',
    },
    {
      quote: 'I spent thousands on astrologers who told me to buy gemstones. Quantum Karma gave me the same rigor for the price of two coffees. And actually told me what to do.',
      author: 'Arjun · Founder',
      tag: 'Wallet Saved',
    },
    {
      quote: 'I thought I knew myself. Then I saw my Karma DNA. It was like reading a manual for a machine I had been operating blindly my whole life.',
      author: 'Maya · Therapist',
      tag: 'Self Knowledge',
    },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Cosmic background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020205]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={14} color="#fff" />
            </motion.div>
            <span className="font-black text-white tracking-tight">Quantum Karma</span>
          </div>
        </div>
      </nav>

      {/* ────────── HERO ────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 pb-12 px-4 md:px-6 overflow-hidden">
        {/* Aurora Background */}
        <motion.div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[140%] h-[120vh] pointer-events-none"
          style={{ x: springX, y: springY }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,_rgba(168,85,247,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,_rgba(236,72,153,0.10),transparent_50%)]" />
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center"
        >
          {/* Text */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">An honest love letter</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-[1]"
            >
              We love every<br />
              astrology app.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                We just built<br />a different kind.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium mb-8"
            >
              Co-Star, CHANI, Astrotalk, Time Passages — they shaped a generation. We have nothing but respect. But you did not come here for a horoscope. You came to <span className="text-white font-bold">break the loop.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link href="/" className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-[1.03] transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]">
                Diagnose my chart
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                type="button"
                onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              >
                See the math
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/5 max-w-md mx-auto lg:mx-0"
            >
              {[
                { v: '127', l: 'Vedic Metrics' },
                { v: 'D-60', l: 'Sub-Charts' },
                { v: '0', l: 'Upsells. Ever.' },
              ].map((s, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-black text-white tracking-tight">{s.v}</div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-500 font-bold mt-1">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Cosmic Orbit Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            <CosmicOrbit />
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
        </motion.div>
      </section>

      {/* ────────── COMPETITOR LOVE STACK ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              ★ The icons we admire ★
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              The astrology<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-purple-300 to-indigo-300">universe is sexy.</span>
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Each of these apps does something brilliantly. Hover to feel the love.
            </p>
          </div>

          {/* Stacked cards / Hover deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {(Object.keys(COMPETITORS) as Competitor[]).map((key, idx) => {
              const c = COMPETITORS[key];
              return (
                <motion.button
                  key={key}
                  onClick={() => {
                    setActiveTab(key);
                    document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  whileHover={{ y: -8 }}
                  className="group relative text-left p-6 md:p-7 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/30"
                >
                  {/* Hover glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
                  <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${c.color} blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 rounded-full pointer-events-none`} />

                  {/* Stack effect cards behind */}
                  <div className="absolute inset-x-3 -bottom-2 h-2 rounded-3xl bg-white/5 group-hover:bottom-0 group-hover:opacity-0 transition-all duration-500" />
                  <div className="absolute inset-x-6 -bottom-4 h-2 rounded-3xl bg-white/[0.03] group-hover:bottom-0 group-hover:opacity-0 transition-all duration-500 delay-75" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-white">{c.icon}</span>
                      </div>
                      <Heart size={16} className="text-rose-400/60 group-hover:text-rose-400 group-hover:scale-125 transition-all" fill="currentColor" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{c.name}</h3>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">{c.tagline}</p>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors">
                      {c.superpower.slice(0, 140)}...
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Compare <ArrowRight size={12} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────── PROCESS FLOW ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 relative border-t border-white/5 bg-gradient-to-b from-[#020205] via-[#05030F] to-[#020205] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[60%] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-4 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              How it works
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              From birth data<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">to the life you actually want.</span>
            </h2>
          </div>

          <div className="relative">
            {/* Animated connecting line */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent">
              <motion.div
                className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                animate={{ x: ['-10%', '110%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6 lg:gap-4">
              {PROCESS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="relative p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all duration-300 h-full">
                    <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-indigo-500 text-white text-xs font-black flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.6)]">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 mt-3 text-indigo-300 group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                    <h4 className="text-base md:text-lg font-black text-white mb-2 tracking-tight">{step.title}</h4>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Mobile/tablet connector arrow */}
                  {i < PROCESS.length - 1 && (
                    <div className="lg:hidden flex justify-center my-2">
                      <ArrowRight size={16} className="text-indigo-500/50 rotate-90 md:rotate-0" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────── EMOTIONAL TRANSFORMATION CARDS ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-pink-400 mb-4 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
              ✦ What you actually feel ✦
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              We do not sell features.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">We deliver outcomes.</span>
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Other apps tell you what your sign means. We tell you what to do about it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {TRANSFORMATIONS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative p-7 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 overflow-hidden hover:border-white/30 transition-all"
              >
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${t.hue} blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-full pointer-events-none`} />

                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.hue} flex items-center justify-center text-white shadow-lg`}>
                    {t.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {t.tag}
                  </span>
                </div>

                {/* From */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle size={12} className="text-rose-400/70" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">Before</span>
                  </div>
                  <p className="text-sm text-slate-500 line-through decoration-rose-400/50 leading-relaxed">
                    {t.from}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center my-3">
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-px h-6 bg-gradient-to-b from-transparent via-indigo-400 to-transparent"
                  />
                </div>

                {/* To */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400">After Quantum Karma</span>
                  </div>
                  <p className="text-base text-white font-bold leading-relaxed">
                    {t.to}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── DEEP COMPARISON (TABS) ────────── */}
      <section id="comparison" className="px-4 md:px-6 py-20 md:py-28 border-t border-white/5 bg-[#03020A] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-indigo-900/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Side by side
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
              The honest<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300">deep dive.</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
              Tap an app to see what they do best — and where Quantum Karma takes a different path.
            </p>
          </div>

          {/* Tabs */}
          <div className="sticky top-16 z-30 -mx-4 md:mx-0 px-4 md:px-0 py-4 mb-8 backdrop-blur-xl bg-[#03020A]/80 border-y border-white/5">
            <div className="flex overflow-x-auto hide-scrollbar gap-2 md:gap-3 snap-x md:justify-center">
              {(Object.keys(COMPETITORS) as Competitor[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`snap-start flex-shrink-0 flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-full font-bold text-xs md:text-sm transition-all duration-300 ${
                    activeTab === key
                      ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-105'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {COMPETITORS[key].icon}
                  {COMPETITORS[key].name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Competitor Body */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-12">
                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r ${activeData.color} bg-opacity-10 border border-white/10 mb-5`}>
                  <span className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    {activeData.icon} {activeData.name}
                    <span className="opacity-60">vs</span>
                    <Sparkles size={12} /> Quantum Karma
                  </span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 max-w-3xl">
                  {activeData.tagline}
                </h3>
                <p className="text-base md:text-lg text-indigo-200 font-medium max-w-3xl leading-relaxed">
                  {activeData.tldr}
                </p>
              </div>

              {/* Two Column */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-12">
                {/* Their Superpower */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-7 md:p-9 rounded-3xl bg-white/[0.02] border border-white/10 relative overflow-hidden group"
                >
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-5 relative z-10">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${activeData.color} flex items-center justify-center shadow-lg`}>
                      <Heart size={20} className="text-white" fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-black text-slate-500">Their Superpower</div>
                      <h4 className="text-lg font-black text-white">What they do brilliantly</h4>
                    </div>
                  </div>
                  <p className="text-slate-400 leading-relaxed font-medium relative z-10">
                    {activeData.superpower}
                  </p>
                </motion.div>

                {/* The QK Difference */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-7 md:p-9 rounded-3xl bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/30 relative overflow-hidden group"
                >
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/30 blur-3xl rounded-full group-hover:bg-indigo-500/50 transition-colors" />
                  <div className="flex items-center gap-3 mb-5 relative z-10">
                    <motion.div
                      className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles size={20} className="text-white" />
                    </motion.div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-black text-indigo-400">Quantum Karma</div>
                      <h4 className="text-lg font-black text-white">A different path</h4>
                    </div>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium relative z-10">
                    {activeData.difference}
                  </p>
                </motion.div>
              </div>

              {/* Feature Comparison */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-5 px-2">Direct comparison</h3>
                <div className="rounded-3xl border border-white/10 bg-[#06050E] overflow-hidden">
                  <div className="grid grid-cols-3 bg-white/[0.02] border-b border-white/5 p-4 md:p-5">
                    <div className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Metric</div>
                    <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{activeData.name}</div>
                    <div className="text-[10px] md:text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      Quantum Karma <Sparkles size={10} className="hidden md:block" />
                    </div>
                  </div>

                  <div className="divide-y divide-white/5">
                    {activeData.features.map((feat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="grid grid-cols-3 p-4 md:p-5 hover:bg-white/[0.02] transition-colors items-start"
                      >
                        <div className="pr-3">
                          <span className="text-xs md:text-sm font-black text-white">{feat.name}</span>
                        </div>
                        <div className="pr-3">
                          <div className="flex items-start gap-2 text-slate-500">
                            <XCircle size={13} className="mt-0.5 flex-shrink-0 opacity-60" />
                            <span className="text-[11px] md:text-sm leading-snug font-medium">{feat.them}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-start gap-2 text-indigo-100">
                            <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-indigo-400" />
                            <span className="text-[11px] md:text-sm leading-snug font-bold">{feat.us}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ────────── BREAK THE LOOP ILLUSTRATION ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.12),transparent_60%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          <div>
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-4 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              The QK promise
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1]">
              Astrology shows<br />you the map.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300">We show you the exit.</span>
            </h2>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-8">
              Most apps describe the loop you are stuck in and call it insight. Quantum Karma diagnoses the structural cause — Upapada Lagna, Mahadasha, Nakshatra — and hands you the exact protocol to escape it.
            </p>
            <ul className="space-y-3">
              {[
                { icon: <Eye size={16} />, t: 'See the exact karmic cause behind the pattern' },
                { icon: <Wand2 size={16} />, t: 'Get a precise mantra, ritual, or behavioral protocol' },
                { icon: <Gauge size={16} />, t: 'Track the timeline window when change is easiest' },
                { icon: <GitBranch size={16} />, t: 'Rewrite the loop, in this lifetime' },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.t}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <KarmicLoopIllustration />
          </motion.div>
        </div>
      </section>

      {/* ────────── USER STORIES (LOOPING CAROUSEL) ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 border-t border-white/5 bg-gradient-to-b from-[#020205] to-[#06061A] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-pink-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-pink-400 mb-4 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
              ✦ Real lives, rewritten ✦
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              They came for stars.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">They left with a new life.</span>
            </h2>
          </div>

          <div className="relative h-[420px] md:h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.96 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="relative h-full p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

                  <div className="relative z-10">
                    <Quote size={40} className="text-indigo-400/40 mb-6" />
                    <p className="text-xl md:text-3xl font-bold text-white leading-snug tracking-tight">
                      &ldquo;{STORIES[activeStory].quote}&rdquo;
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <div>
                      <div className="text-sm font-bold text-white">{STORIES[activeStory].author}</div>
                      <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-black mt-1">{STORIES[activeStory].tag}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {STORIES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveStory(i)}
                          className={`h-1.5 rounded-full transition-all ${
                            i === activeStory ? 'w-8 bg-indigo-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                          }`}
                          aria-label={`Story ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ────────── PHILOSOPHY ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 bg-gradient-to-b from-[#020205] to-indigo-950/30 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-purple-900/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart size={28} className="text-indigo-300" fill="currentColor" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-[1]">
            We built this<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">because we want you to win.</span>
          </h2>
          <div className="space-y-6 text-base md:text-xl text-indigo-100/80 font-medium leading-relaxed max-w-3xl mx-auto">
            <p>
              We love the stars, but more importantly, we love humanity. You are not meant to suffer through repeating karmic loops, toxic relationships, and career plateaus. You are meant to be joyful, wildly successful, and deeply healthy.
            </p>
            <p>
              Quantum Karma was not built to entertain you. It was built to <span className="text-white font-black">empower and heal</span> you. We give you the exact mathematical blueprints of your life so you can finally break the cycle, step into your power, and build the beautiful reality you deserve.
            </p>
            <p className="text-white text-2xl md:text-3xl font-black tracking-tight pt-4">
              We are in your corner. Always.
            </p>
          </div>
        </div>
      </section>

      {/* ────────── VOW / ETHICS ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 border-t border-white/5 bg-[#05050A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Our vow
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
              No games.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Just guidance.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                icon: <Lock size={26} />,
                title: 'Total Privacy',
                desc: 'Your birth data is sacred. We never sell, share, or train on your personal blueprint.',
                color: 'from-indigo-500 to-blue-600',
              },
              {
                icon: <ShieldCheck size={26} />,
                title: 'Zero Upsells',
                desc: 'No fear-mongering. No $500 gemstones. Real mantras, real protocols, flat pricing.',
                color: 'from-purple-500 to-fuchsia-600',
              },
              {
                icon: <Cpu size={26} />,
                title: 'Swiss Ephemeris',
                desc: 'Astronomical precision trusted by global observatories. Down to the second.',
                color: 'from-pink-500 to-rose-600',
              },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group p-8 md:p-10 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 flex flex-col items-center text-center hover:border-white/30 transition-all relative overflow-hidden"
              >
                <div className={`absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br ${v.color} blur-3xl opacity-0 group-hover:opacity-30 transition-opacity rounded-full pointer-events-none`} />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform text-white relative z-10`}>
                  {v.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-4 relative z-10">{v.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium relative z-10">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── FINAL CTA ────────── */}
      <section className="px-4 md:px-6 py-32 md:py-48 relative overflow-hidden bg-[#020205]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-600/20 via-[#020205] to-[#020205] pointer-events-none" />

        {/* Floating stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur">
              <InfinityIcon size={14} className="text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-200">Time to choose</span>
            </div>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.95]">
              Ready to break<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">the loop?</span>
            </h2>

            <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto mb-10 font-medium">
              Stop reading horoscopes. Start rewriting your timeline.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/" className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-sm hover:scale-[1.04] transition-transform shadow-[0_0_60px_rgba(255,255,255,0.4)]">
                Diagnose your chart
                <Sparkles size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 px-7 py-4 text-slate-400 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors">
                Learn more
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest font-black text-slate-500">
              <span className="flex items-center gap-1.5"><Sun size={10} /> Vedic Sidereal</span>
              <span className="flex items-center gap-1.5"><Moon size={10} /> 27 Nakshatras</span>
              <span className="flex items-center gap-1.5"><Atom size={10} /> Swiss Ephemeris</span>
              <span className="flex items-center gap-1.5"><Lock size={10} /> Privacy First</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}} />

      <LandingFooter />
    </div>
  );
}
