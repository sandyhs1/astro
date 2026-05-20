'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronLeft, Sparkles, Heart, ArrowRight, Quote, Compass,
  Atom, Brain, Target, Flame, Star, Eye, Shield, Lock,
  Cpu, Wand2, Moon, Sun, Infinity as InfinityIcon, Feather,
  Rocket, Layers, BookOpen, Zap, GitBranch, HandHeart
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   ANIMATED HEART CONSTELLATION (HERO VISUAL)
   ───────────────────────────────────────────────────────────── */
function HeartConstellation() {
  // Heart-shaped points
  const points = Array.from({ length: 28 }, (_, i) => {
    const t = (i / 28) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x: 200 + x * 9, y: 200 + y * 9 };
  });

  return (
    <div className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px] mx-auto">
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="heartGlow">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="connLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
          </linearGradient>
          <filter id="heartFilter">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft glow */}
        <circle cx="200" cy="200" r="160" fill="url(#heartGlow)" />

        {/* Connecting lines from center */}
        {points.map((p, i) => (
          <motion.line
            key={`l-${i}`}
            x1="200"
            y1="200"
            x2={p.x}
            y2={p.y}
            stroke="url(#connLine)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2, delay: i * 0.04 }}
          />
        ))}

        {/* Outline path */}
        <motion.path
          d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`}
          fill="none"
          stroke="#ec4899"
          strokeWidth="1.5"
          filter="url(#heartFilter)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />

        {/* Stars on heart */}
        {points.map((p, i) => (
          <motion.circle
            key={`s-${i}`}
            cx={p.x}
            cy={p.y}
            r="2.5"
            fill="#fff"
            filter="url(#heartFilter)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.6], scale: [0, 1.5, 1] }}
            transition={{ duration: 2, delay: i * 0.06, repeat: Infinity, repeatDelay: 4 }}
          />
        ))}

        {/* Center pulsing core */}
        <motion.circle
          cx="200"
          cy="220"
          r="14"
          fill="#fff"
          filter="url(#heartFilter)"
          animate={{ scale: [1, 1.2, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '200px 220px' }}
        />
      </svg>

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-pink-300"
          style={{
            top: `${30 + Math.random() * 40}%`,
            left: `${30 + Math.random() * 40}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -20, -40],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SVG: SACRED GEOMETRY (FLOWER OF LIFE STYLED)
   ───────────────────────────────────────────────────────────── */
function SacredGeometry() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="sgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 100 + Math.cos(rad) * 30;
        const cy = 100 + Math.sin(rad) * 30;
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="35"
            fill="none"
            stroke="url(#sgGrad)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: i * 0.2 }}
          />
        );
      })}
      <motion.circle
        cx="100" cy="100" r="35"
        fill="none" stroke="url(#sgGrad)" strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
      />
    </svg>
  );
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

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

  const [activeStory, setActiveStory] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveStory((s) => (s + 1) % 4), 6000);
    return () => clearInterval(t);
  }, []);

  /* ─── Why we exist (emotional pillars) ─── */
  const PILLARS = [
    {
      icon: <Heart size={22} />,
      title: 'For the heart that hurts',
      desc: 'For the soul tired of dating the same archetype, of love that loops back to pain. We see you. We hand you the map out.',
      hue: 'from-rose-500 to-pink-600',
    },
    {
      icon: <Rocket size={22} />,
      title: 'For the mind that strives',
      desc: 'For the dreamer working twice as hard with half the result. Your timeline matters. We show you exactly when to leap.',
      hue: 'from-indigo-500 to-blue-600',
    },
    {
      icon: <Brain size={22} />,
      title: 'For the seeker that questions',
      desc: 'For the one who reads horoscopes but craves real answers. No clichés. Just rigorous, ancient, mathematical truth.',
      hue: 'from-purple-500 to-fuchsia-600',
    },
    {
      icon: <HandHeart size={22} />,
      title: 'For the human that hopes',
      desc: 'For everyone who believes life can be more than survival. We built this to help you build the life you actually deserve.',
      hue: 'from-amber-500 to-orange-600',
    },
  ];

  /* ─── Origin story timeline ─── */
  const TIMELINE = [
    {
      year: 'The Question',
      icon: <Eye size={20} />,
      title: 'Why does astrology feel so vague?',
      desc: 'We were tired of generic horoscopes that said everything and nothing. Tired of paying $300 for a reading that left us more confused than before.',
    },
    {
      year: 'The Discovery',
      icon: <BookOpen size={20} />,
      title: 'Vedic math is shockingly precise',
      desc: 'Brihat Parashara Hora Shastra. Jaimini Sutras. 5,000-year-old systems with mathematical rigor that puts modern psychology to shame. The depth was already there. We just had to render it.',
    },
    {
      year: 'The Engine',
      icon: <Atom size={20} />,
      title: 'We built the calculator we always wanted',
      desc: 'Swiss Ephemeris precision. 127 classical metrics. D-1 through D-60 charts. Dashas, Nakshatras, Avasthas. No approximations. No shortcuts.',
    },
    {
      year: 'The Translation',
      icon: <Brain size={20} />,
      title: 'AI that respects the lineage',
      desc: 'We trained our synthesis layer on classical texts, not Instagram captions. Every word our engine speaks is grounded in mathematical placement, not vibes.',
    },
    {
      year: 'Today',
      icon: <Target size={20} />,
      title: 'A tool to break the loop',
      desc: 'You see your karma clearly. You make the move. You rewrite the timeline. That is the entire point.',
    },
  ];

  /* ─── Values / Vows ─── */
  const VALUES = [
    {
      icon: <Heart size={26} />,
      title: 'Love over Fear',
      desc: 'We will never sell you a remedy through panic. No "your Saturn will destroy you" upsells. Only love, only truth, only what works.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: <Lock size={26} />,
      title: 'Privacy is Sacred',
      desc: 'Your birth data is the most intimate thing you own. We never sell it, share it, or train external models on it. Period.',
      color: 'from-indigo-500 to-blue-600',
    },
    {
      icon: <Eye size={26} />,
      title: 'Radical Transparency',
      desc: 'No black boxes. We show you the planets, the math, the placements. You deserve to see how the engine works.',
      color: 'from-purple-500 to-fuchsia-600',
    },
    {
      icon: <Shield size={26} />,
      title: 'Zero Upsells. Ever.',
      desc: 'No $500 gemstones. No fear-based add-ons. Flat pricing. Real mantras. Real protocols. Real results.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: <Atom size={26} />,
      title: 'Uncompromising Precision',
      desc: 'Swiss Ephemeris. Sidereal. Classical Parashari. We will never round, approximate, or simplify the truth.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: <Sparkles size={26} />,
      title: 'Empower, Then Disappear',
      desc: 'The goal is not to keep you on the app. The goal is to give you so much clarity, you walk into your life and never look back.',
      color: 'from-cyan-500 to-sky-600',
    },
  ];

  /* ─── Voices we built this for ─── */
  const STORIES = [
    {
      quote: 'I cried reading my Karma DNA report. Not because it was sad. Because for the first time in 30 years, someone described me accurately.',
      author: 'Anaya',
      role: 'Writer · 32',
      tag: 'Self-recognition',
    },
    {
      quote: 'I thought astrology was for people who could not handle reality. Then Quantum Karma told me, mathematically, what no therapist could in 5 years.',
      author: 'Marcus',
      role: 'Engineer · 38',
      tag: 'The skeptic',
    },
    {
      quote: 'The app told me my Mars-Saturn cycle was opening. Three weeks later, I got the promotion I had been chasing for two years. Coincidence? I do not believe in those anymore.',
      author: 'Devika',
      role: 'Founder · 29',
      tag: 'The breakthrough',
    },
    {
      quote: 'I have used every astrology app. Quantum Karma is the only one that talks to me like an adult. No emojis. No vague poetry. Just truth.',
      author: 'Leo',
      role: 'Architect · 41',
      tag: 'The grown-up',
    },
  ];

  /* ─── Letter beliefs ─── */
  const BELIEFS = [
    'You are not broken. You are looped.',
    'Astrology is not destiny. It is diagnosis.',
    'Math is not cold. It is the warmest kind of honesty.',
    'Healing is not a vibe. It is a protocol.',
    'You deserve to win. So we built a tool to help.',
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-slate-300 font-sans selection:bg-pink-500/30 overflow-x-hidden">

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
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)]"
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
        <motion.div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[140%] h-[120vh] pointer-events-none"
          style={{ x: springX, y: springY }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(236,72,153,0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,_rgba(168,85,247,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,_rgba(99,102,241,0.12),transparent_50%)]" />
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center"
        >
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur"
            >
              <Heart size={12} className="text-pink-400" fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">A love letter to humanity</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-[1]"
            >
              We built this<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                because we love you.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium mb-8"
            >
              Not metaphorically. Actually. Quantum Karma exists because we believe you are not meant to suffer through the same loops, decade after decade. We made a tool to help you see clearly, choose differently, and finally win.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link href="/" className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-[1.03] transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]">
                Begin your reading
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/compare" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                Why we are different
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex items-center justify-center order-1 lg:order-2"
          >
            <HeartConstellation />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">Our Story</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
        </motion.div>
      </section>

      {/* ────────── THE LETTER (BELIEFS) ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-pink-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4">
              <Feather size={12} className="text-pink-400" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-pink-300">Our beliefs</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1] mb-6">
              A short letter,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">to the human reading this.</span>
            </h2>
          </div>

          <div className="space-y-5">
            {BELIEFS.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-pink-500/30 hover:bg-white/[0.04] transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-pink-300 flex-shrink-0 font-black text-xs">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p className="text-lg md:text-2xl font-bold text-white leading-tight tracking-tight">
                  {b}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12 pt-8 border-t border-white/5"
          >
            <p className="text-base md:text-lg text-slate-400 font-medium italic">
              With every line of code we write,<br />
              <span className="text-white font-black not-italic">we hope it helps you live freer.</span>
            </p>
            <div className="inline-flex items-center gap-2 mt-4 text-pink-400">
              <Heart size={14} fill="currentColor" />
              <span className="text-[10px] uppercase tracking-widest font-black">— The QK team</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────── WHO WE BUILT THIS FOR (PILLARS) ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-4 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              Who this is for
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              We built this<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">for everyone we love.</span>
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Which means we built it for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {PILLARS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative p-7 md:p-9 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 overflow-hidden hover:border-white/30 transition-all"
              >
                <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${p.hue} blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-full pointer-events-none`} />

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.hue} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                  {p.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight relative z-10">{p.title}</h3>
                <p className="text-base text-slate-400 leading-relaxed font-medium relative z-10">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── ORIGIN STORY TIMELINE ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 border-t border-white/5 bg-gradient-to-b from-[#020205] via-[#05030F] to-[#020205] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[60%] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              How we got here
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              From a question<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">to a movement.</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent" />

            {TIMELINE.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative mb-10 md:mb-16 flex items-start gap-5 md:gap-0 ${
                  i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 -translate-x-[7px] top-3 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] z-10" />

                {/* Card */}
                <div className={`md:w-[calc(50%-2rem)] ml-12 md:ml-0 ${i % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                  <div className="p-6 md:p-7 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 flex-shrink-0">
                        {step.icon}
                      </div>
                      <div className="text-[10px] md:text-xs uppercase tracking-widest font-black text-indigo-400">
                        {step.year}
                      </div>
                    </div>
                    <h4 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight leading-tight">{step.title}</h4>
                    <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── VALUES (STACKED CARDS) ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-pink-400 mb-4 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
              ✦ Our six vows ✦
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              The things we<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">will never compromise on.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative p-7 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-500"
              >
                {/* Hover glow */}
                <div className={`absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br ${v.color} blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-full pointer-events-none`} />

                {/* Stack effect cards behind */}
                <div className="absolute inset-x-3 -bottom-2 h-2 rounded-3xl bg-white/5 group-hover:bottom-0 group-hover:opacity-0 transition-all duration-500" />
                <div className="absolute inset-x-6 -bottom-4 h-2 rounded-3xl bg-white/[0.03] group-hover:bottom-0 group-hover:opacity-0 transition-all duration-500 delay-75" />

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                    {v.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight">{v.title}</h3>
                  <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── PHILOSOPHY (SACRED GEOMETRY) ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 border-t border-white/5 relative overflow-hidden bg-gradient-to-b from-[#020205] to-[#0A0418]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.12),transparent_60%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          <div className="order-2 lg:order-1">
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-4 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              Our philosophy
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1]">
              Ancient wisdom.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300">Modern delivery.</span>
            </h2>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-8 font-medium">
              The Vedic seers were not mystics. They were mathematicians, astronomers, and physicians who mapped human consciousness with the same rigor we now reserve for particle physics.
            </p>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-8 font-medium">
              We did not invent anything. We just refused to dilute it. <span className="text-white font-black">Pure lineage. Pure precision. Pure love.</span>
            </p>

            <ul className="space-y-3">
              {[
                { icon: <BookOpen size={16} />, t: 'Brihat Parashara Hora Shastra (the source code)' },
                { icon: <Layers size={16} />, t: 'Jaimini Sutras (predictive timing)' },
                { icon: <Atom size={16} />, t: 'Swiss Ephemeris (astronomical truth)' },
                { icon: <Brain size={16} />, t: 'Modern AI (linguistic clarity, never authority)' },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm md:text-base">{item.t}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative w-full max-w-md mx-auto aspect-square">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <SacredGeometry />
              </motion.div>
              {/* Inner counter rotation */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 opacity-50"
              >
                <SacredGeometry />
              </motion.div>
              {/* Center pulse */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_0_60px_rgba(168,85,247,0.6)]"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={24} className="text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────── VOICES (TESTIMONIAL CAROUSEL) ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 border-t border-white/5 bg-[#06051A] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-pink-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-pink-400 mb-4 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
              ✦ The voices behind us ✦
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              Why we keep<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">building.</span>
            </h2>
          </div>

          <div className="relative h-[460px] md:h-[360px]">
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
                  <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-3xl rounded-full pointer-events-none" />

                  <div className="relative z-10">
                    <Quote size={40} className="text-pink-400/40 mb-6" />
                    <p className="text-xl md:text-3xl font-bold text-white leading-snug tracking-tight">
                      &ldquo;{STORIES[activeStory].quote}&rdquo;
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <div>
                      <div className="text-sm font-bold text-white">{STORIES[activeStory].author}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{STORIES[activeStory].role}</div>
                      <div className="text-[10px] uppercase tracking-widest text-pink-400 font-black mt-1">{STORIES[activeStory].tag}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {STORIES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveStory(i)}
                          className={`h-1.5 rounded-full transition-all ${
                            i === activeStory ? 'w-8 bg-pink-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                          }`}
                          aria-label={`Voice ${i + 1}`}
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

      {/* ────────── PROMISE (CLOSING EMOTIONAL) ────────── */}
      <section className="px-4 md:px-6 py-24 md:py-32 bg-gradient-to-b from-[#020205] to-pink-950/30 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-pink-900/15 blur-[120px] rounded-full pointer-events-none" />

        {/* Floating hearts */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-400/30"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <Heart size={16 + Math.random() * 10} fill="currentColor" />
          </motion.div>
        ))}

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 mb-8 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart size={28} className="text-pink-300" fill="currentColor" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-[1]">
            Our promise<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">to you.</span>
          </h2>

          <div className="space-y-6 text-base md:text-xl text-slate-300/90 font-medium leading-relaxed mb-12">
            <p>
              We will never tell you to be afraid of your chart. We will never sell you a fix that does not exist. We will never pretend to know more about your life than you do.
            </p>
            <p>
              What we will do is give you the clearest mirror we can engineer. Mathematically rigorous. Beautifully designed. Privately yours.
            </p>
            <p className="text-white text-2xl md:text-3xl font-black tracking-tight pt-4">
              You deserve clarity. You deserve to win.<br />
              We are honored to walk with you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-sm hover:scale-[1.04] transition-transform shadow-[0_0_60px_rgba(255,255,255,0.3)]">
              Begin your journey
              <Sparkles size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            </Link>
            <Link href="/compare" className="inline-flex items-center justify-center gap-2 px-7 py-4 text-slate-400 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors">
              See our craft
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest font-black text-slate-500">
            <span className="flex items-center gap-1.5"><Sun size={10} /> Vedic Sidereal</span>
            <span className="flex items-center gap-1.5"><Moon size={10} /> 27 Nakshatras</span>
            <span className="flex items-center gap-1.5"><Atom size={10} /> Swiss Ephemeris</span>
            <span className="flex items-center gap-1.5"><Lock size={10} /> Privacy First</span>
            <span className="flex items-center gap-1.5"><InfinityIcon size={10} /> Made with love</span>
          </div>
        </div>
      </section>

      {/* CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}} />
    </div>
  );
}
