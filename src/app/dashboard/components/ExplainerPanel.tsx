"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  Sparkles, ArrowRight, ArrowLeft, Home, Users, Star, Compass,
  Crown, Shield, BookOpen, Eye, Flame, Wind, Mountain,
  Droplet, Check, Lock, Play, Zap, Trophy, MessageCircle
} from 'lucide-react';

interface ExplainerPanelProps {
  profileId?: string;
  profileName?: string;
}

type StepKey = 'intro' | 'houses' | 'planets' | 'signs' | 'story' | 'finale';
const STEPS: StepKey[] = ['intro', 'houses', 'planets', 'signs', 'story', 'finale'];
const STEP_LABELS: Record<StepKey, string> = {
  intro: 'Start',
  houses: 'Houses',
  planets: 'Planets',
  signs: 'Signs',
  story: 'Read a Story',
  finale: 'Your Wisdom',
};

// ─── MAGNETIC CARD ─────────────────────────────────────────────────────────
function MagneticCard({ children, className = "", strength = 0.04 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
      {children}
    </motion.div>
  );
}

// ─── DATA ──────────────────────────────────────────────────────────────────
const HOUSES = [
  { num: 1, title: "Self & Identity", emoji: "🪞", desc: "Your body, personality, the front door of your life.", color: "from-rose-400 to-rose-600" },
  { num: 2, title: "Wealth & Family", emoji: "💎", desc: "Savings, speech, immediate family.", color: "from-amber-400 to-amber-600" },
  { num: 3, title: "Courage & Voice", emoji: "🎯", desc: "Effort, communication, younger siblings.", color: "from-orange-400 to-orange-600" },
  { num: 4, title: "Home & Mother", emoji: "🏡", desc: "Inner peace, real estate, maternal warmth.", color: "from-yellow-400 to-yellow-600" },
  { num: 5, title: "Children & Love", emoji: "✨", desc: "Creativity, romance, higher learning.", color: "from-pink-400 to-pink-600" },
  { num: 6, title: "Healing & Service", emoji: "⚔️", desc: "Health, daily routines, overcoming obstacles.", color: "from-red-400 to-red-600" },
  { num: 7, title: "Marriage & Partners", emoji: "💞", desc: "Spouse, business partners, the public mirror.", color: "from-fuchsia-400 to-fuchsia-600" },
  { num: 8, title: "Transformation", emoji: "🌑", desc: "Sudden shifts, longevity, hidden depths.", color: "from-purple-400 to-purple-600" },
  { num: 9, title: "Dharma & Luck", emoji: "🕉️", desc: "Beliefs, father, long journeys.", color: "from-violet-400 to-violet-600" },
  { num: 10, title: "Career & Status", emoji: "👑", desc: "Profession, public image, life's peak.", color: "from-indigo-400 to-indigo-600" },
  { num: 11, title: "Gains & Network", emoji: "🌐", desc: "Communities, profits, dreams fulfilled.", color: "from-blue-400 to-blue-600" },
  { num: 12, title: "Liberation", emoji: "🪷", desc: "Solitude, spirituality, foreign lands.", color: "from-teal-400 to-teal-600" },
];

const PLANETS = [
  { name: "Sun",     sanskrit: "Surya",   role: "The King",         desc: "Soul · ego · confidence · father figure", emoji: "☀️", grad: "from-orange-400 via-amber-500 to-yellow-500", quote: "I shine, therefore I am." },
  { name: "Moon",    sanskrit: "Chandra", role: "The Queen",        desc: "Mind · emotions · mother · comfort",       emoji: "🌙", grad: "from-blue-400 via-sky-500 to-indigo-500",  quote: "I feel, therefore I belong." },
  { name: "Mars",    sanskrit: "Mangal",  role: "The Warrior",      desc: "Courage · drive · logic · fire",           emoji: "🔥", grad: "from-red-500 via-rose-500 to-orange-500",  quote: "I conquer, therefore I grow." },
  { name: "Mercury", sanskrit: "Budh",    role: "The Prince",       desc: "Intellect · speech · wit · commerce",      emoji: "💫", grad: "from-emerald-400 via-green-500 to-teal-500", quote: "I think, therefore I trade." },
  { name: "Jupiter", sanskrit: "Guru",    role: "The Teacher",      desc: "Wisdom · luck · expansion · faith",        emoji: "🌟", grad: "from-amber-400 via-yellow-500 to-orange-400", quote: "I teach, therefore I bless." },
  { name: "Venus",   sanskrit: "Shukra",  role: "The Artist",       desc: "Love · beauty · luxury · pleasure",        emoji: "💖", grad: "from-pink-400 via-rose-400 to-fuchsia-500",  quote: "I love, therefore I create." },
  { name: "Saturn",  sanskrit: "Shani",   role: "The Judge",        desc: "Discipline · karma · time · structure",    emoji: "⏳", grad: "from-slate-500 via-zinc-600 to-gray-700",   quote: "I endure, therefore I master." },
  { name: "Rahu",    sanskrit: "Rahu",    role: "The Illusionist",  desc: "Obsession · taboo · worldly hunger",        emoji: "🌒", grad: "from-indigo-500 via-purple-500 to-violet-600", quote: "I hunger, therefore I evolve." },
  { name: "Ketu",    sanskrit: "Ketu",    role: "The Monk",         desc: "Detachment · past lives · liberation",      emoji: "🌠", grad: "from-violet-400 via-purple-400 to-indigo-500", quote: "I release, therefore I return." },
];

const SIGNS = [
  { name: "Aries",       symbol: "♈", element: "Fire",  trait: "Pioneering · Bold",     ruler: "Mars",    color: "text-red-600 bg-red-50 border-red-200" },
  { name: "Taurus",      symbol: "♉", element: "Earth", trait: "Stable · Sensual",      ruler: "Venus",   color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { name: "Gemini",      symbol: "♊", element: "Air",   trait: "Curious · Adaptable",   ruler: "Mercury", color: "text-cyan-700 bg-cyan-50 border-cyan-200" },
  { name: "Cancer",      symbol: "♋", element: "Water", trait: "Nurturing · Protective",ruler: "Moon",    color: "text-blue-700 bg-blue-50 border-blue-200" },
  { name: "Leo",         symbol: "♌", element: "Fire",  trait: "Dramatic · Generous",   ruler: "Sun",     color: "text-orange-600 bg-orange-50 border-orange-200" },
  { name: "Virgo",       symbol: "♍", element: "Earth", trait: "Analytical · Helpful",  ruler: "Mercury", color: "text-lime-700 bg-lime-50 border-lime-200" },
  { name: "Libra",       symbol: "♎", element: "Air",   trait: "Harmonious · Fair",     ruler: "Venus",   color: "text-pink-600 bg-pink-50 border-pink-200" },
  { name: "Scorpio",     symbol: "♏", element: "Water", trait: "Intense · Deep",        ruler: "Mars",    color: "text-rose-700 bg-rose-50 border-rose-200" },
  { name: "Sagittarius", symbol: "♐", element: "Fire",  trait: "Adventurous · Honest",  ruler: "Jupiter", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { name: "Capricorn",   symbol: "♑", element: "Earth", trait: "Disciplined · Ambitious",ruler: "Saturn", color: "text-slate-700 bg-slate-100 border-slate-200" },
  { name: "Aquarius",    symbol: "♒", element: "Air",   trait: "Innovative · Rebel",    ruler: "Saturn",  color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  { name: "Pisces",      symbol: "♓", element: "Water", trait: "Dreamy · Empathetic",   ruler: "Jupiter", color: "text-purple-700 bg-purple-50 border-purple-200" },
];

const ELEMENTS = [
  { name: "Fire",  signs: "Aries · Leo · Sagittarius", desc: "Action, passion, leadership.",       icon: Flame,    color: "text-orange-600 bg-orange-100" },
  { name: "Earth", signs: "Taurus · Virgo · Capricorn", desc: "Stability, patience, mastery.",     icon: Mountain, color: "text-emerald-700 bg-emerald-100" },
  { name: "Air",   signs: "Gemini · Libra · Aquarius",  desc: "Ideas, communication, connection.", icon: Wind,     color: "text-cyan-700 bg-cyan-100" },
  { name: "Water", signs: "Cancer · Scorpio · Pisces",  desc: "Emotion, intuition, depth.",        icon: Droplet,  color: "text-blue-700 bg-blue-100" },
];

// ─── STORY EXAMPLES ───────────────────────────────────────────────────────
const STORIES = [
  {
    planet: "Sun", planetEmoji: "☀️", planetGrad: "from-orange-400 to-amber-500",
    house: 10, houseTitle: "Career & Status", houseEmoji: "👑",
    title: "The King in the Office",
    formula: "Sun + 10th House",
    story: "When the Sun (the King) walks into the 10th room (Career), this person craves recognition through their work. Leadership comes naturally. They rise by being seen.",
    realWorld: "CEOs, public speakers, government officials, performers."
  },
  {
    planet: "Moon", planetEmoji: "🌙", planetGrad: "from-blue-400 to-indigo-500",
    house: 4, houseTitle: "Home & Mother", houseEmoji: "🏡",
    title: "The Queen at Home",
    formula: "Moon + 4th House",
    story: "The Moon (the Queen) in the 4th room (Home) creates a person whose emotional security is rooted in family and a peaceful sanctuary. They flourish when their inner world is calm.",
    realWorld: "Caretakers, hospitality leaders, real estate, deeply private people."
  },
  {
    planet: "Venus", planetEmoji: "💖", planetGrad: "from-pink-400 to-fuchsia-500",
    house: 5, houseTitle: "Children & Love", houseEmoji: "✨",
    title: "The Artist in Romance",
    formula: "Venus + 5th House",
    story: "Venus (the Artist) in the 5th room (Love & Creativity) makes love feel like art. This person courts beauty in everything — relationships, creative projects, and self-expression alike.",
    realWorld: "Artists, performers, romantic poets, creative parents."
  },
  {
    planet: "Saturn", planetEmoji: "⏳", planetGrad: "from-slate-500 to-gray-700",
    house: 6, houseTitle: "Healing & Service", houseEmoji: "⚔️",
    title: "The Judge as Healer",
    formula: "Saturn + 6th House",
    story: "Saturn (the Judge) in the 6th room (Service & Healing) creates the ultimate disciplined healer. They overcome obstacles through grit, structure, and patient daily routines.",
    realWorld: "Doctors, therapists, athletes, lawyers, dedicated service professionals."
  },
];

const FUN_FACTS = [
  { label: "Years of Knowledge", value: "5,000+", emoji: "📜" },
  { label: "Yogas in Your Chart", value: "300+", emoji: "🧬" },
  { label: "Divisional Charts", value: "16", emoji: "🌌" },
  { label: "Classical Metrics", value: "127", emoji: "✨" },
];

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function ExplainerPanel({ profileName }: ExplainerPanelProps) {
  const [activeStep, setActiveStep] = useState<StepKey>('intro');
  const [completedSteps, setCompletedSteps] = useState<Set<StepKey>>(new Set());
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const firstName = (profileName || 'friend').trim().split(' ')[0] || 'friend';

  const currentStepIndex = STEPS.indexOf(activeStep);
  const progressPercent = Math.round(((currentStepIndex + (completedSteps.has(activeStep) ? 1 : 0)) / STEPS.length) * 100);

  const goNext = () => {
    setCompletedSteps(prev => new Set([...prev, activeStep]));
    const next = STEPS[currentStepIndex + 1];
    if (next) setActiveStep(next);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goPrev = () => {
    const prev = STEPS[currentStepIndex - 1];
    if (prev) setActiveStep(prev);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const jumpTo = (step: StepKey) => {
    setActiveStep(step);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 w-full h-full bg-gradient-to-b from-indigo-50/40 via-slate-50 to-white flex flex-col relative overflow-hidden">
      {/* Atmospheric backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-100/60 via-purple-50/30 to-transparent pointer-events-none" />
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-15%] w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-[120px] pointer-events-none" />

      {/* PROGRESS BAR — sticky top */}
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 md:py-4">
          {/* Step pills + progress text */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <BookOpen size={14} className="text-white" />
              </div>
              <div>
                <div className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase text-indigo-600">Masterclass</div>
                <div className="text-[10px] md:text-xs text-slate-500 font-medium">{progressPercent}% complete</div>
              </div>
            </div>
            <div className="text-[10px] md:text-xs font-mono text-slate-500">
              Step {currentStepIndex + 1} of {STEPS.length}
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-slate-200/80 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            />
          </div>
          {/* Step pills (mobile-scrollable) */}
          <div className="flex gap-1.5 md:gap-2 mt-3 overflow-x-auto no-scrollbar -mx-1 px-1">
            {STEPS.map((step, i) => {
              const isActive = step === activeStep;
              const isDone = completedSteps.has(step);
              const isLocked = i > currentStepIndex && !isDone;
              return (
                <button
                  key={step}
                  onClick={() => jumpTo(step)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                      : isDone
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : isLocked
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isDone && <Check size={10} className="flex-shrink-0" />}
                  {isLocked && !isDone && <Lock size={10} className="flex-shrink-0" />}
                  <span>{i + 1}. {STEP_LABELS[step]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN SCROLLABLE CONTENT */}
      <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-12 pb-32">
          <AnimatePresence mode="wait">

            {/* ════════════════════════════════════════════════════════════
                STEP 1 · INTRO — Hyper-personalized welcome
            ═══════════════════════════════════════════════════════════ */}
            {activeStep === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-8 md:space-y-12"
              >
                {/* Personalized welcome card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.7 }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-1 shadow-2xl shadow-indigo-500/20"
                >
                  <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-3xl px-6 py-12 md:px-12 md:py-16 overflow-hidden">
                    {/* Animated stars */}
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/60"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          opacity: [0.2, 1, 0.2],
                          scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 3,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}

                    {/* Glow orbs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl" />

                    <div className="relative z-10 text-center">
                      <motion.div
                        initial={{ rotate: -10, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-white/20"
                      >
                        <Sparkles size={12} className="text-amber-300" />
                        Your Personal Cosmic Onboarding
                      </motion.div>

                      <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] mb-4"
                      >
                        Welcome,
                        <br />
                        <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                          {firstName}.
                        </span>
                      </motion.h1>

                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.6 }}
                        className="text-base md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed font-light mb-8"
                      >
                        Your birth chart is already loaded. Before you explore it, let's spend 9 minutes
                        making you fluent in the language of the stars.
                      </motion.p>

                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        onClick={goNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 px-7 py-3.5 md:px-9 md:py-4 rounded-full bg-white text-indigo-700 font-bold text-sm md:text-base shadow-2xl shadow-black/20 hover:shadow-amber-300/40 transition-shadow"
                      >
                        <Play size={16} fill="currentColor" />
                        Begin Your Journey
                        <ArrowRight size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* What You'll Learn */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
                >
                  {FUN_FACTS.map((fact, i) => (
                    <MagneticCard key={i}>
                      <div className="group relative bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                          <div className="text-2xl md:text-3xl mb-2">{fact.emoji}</div>
                          <div className="text-xl md:text-2xl font-black text-slate-900 mb-0.5">{fact.value}</div>
                          <div className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-wider">{fact.label}</div>
                        </div>
                      </div>
                    </MagneticCard>
                  ))}
                </motion.div>

                {/* The Big Metaphor — UPGRADED */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.7 }}
                  className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-purple-500" />
                  <div className="p-6 md:p-12">
                    <div className="text-center mb-8 md:mb-10">
                      <div className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-indigo-600 mb-3">
                        <Sparkles size={12} />
                        The Cosmic Metaphor
                      </div>
                      <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                        Astrology is just a play.
                      </h2>
                      <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto">
                        Three things you need to understand. That's it. Memorize this metaphor and you'll never feel lost again.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                      {[
                        { icon: Home,  title: "Houses", subtitle: "= Rooms", desc: "Twelve life areas: career, love, wealth, health, family. Each is a room.", grad: "from-blue-500 to-cyan-500", bg: "bg-blue-50", glow: "shadow-blue-200" },
                        { icon: Users, title: "Planets", subtitle: "= Actors", desc: "Nine cosmic actors who walk into the rooms, each with unique energy.", grad: "from-amber-500 to-orange-500", bg: "bg-amber-50", glow: "shadow-amber-200" },
                        { icon: Star,  title: "Signs", subtitle: "= Costumes", desc: "Twelve costumes the actors wear. Mood and flavor — same actor, different vibe.", grad: "from-purple-500 to-fuchsia-500", bg: "bg-purple-50", glow: "shadow-purple-200" },
                      ].map((card, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 + i * 0.1, duration: 0.5 }}
                          whileHover={{ y: -6 }}
                          className={`group relative p-6 md:p-7 rounded-2xl ${card.bg} border border-white shadow-lg ${card.glow} hover:shadow-xl transition-shadow`}
                        >
                          <div className={`absolute top-3 right-3 text-3xl md:text-4xl font-black bg-gradient-to-br ${card.grad} bg-clip-text text-transparent opacity-30 group-hover:opacity-60 transition-opacity`}>
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${card.grad} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                            <card.icon size={24} className="text-white" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1">{card.title}</h3>
                          <p className={`text-sm font-bold bg-gradient-to-r ${card.grad} bg-clip-text text-transparent mb-3`}>{card.subtitle}</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8 md:mt-10 p-4 md:p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/80 flex items-start gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                        <Zap size={16} className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-xs md:text-sm font-bold text-indigo-900 mb-1">The Magic Formula</div>
                        <div className="text-sm md:text-base text-slate-700 leading-relaxed">
                          <span className="font-bold">A planet (actor)</span> wearing <span className="font-bold">a sign (costume)</span> walks into <span className="font-bold">a house (room)</span> — and that's your life story.
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Footer CTA */}
                <div className="flex justify-end">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    onClick={goNext}
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm md:text-base hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    Let's meet the rooms
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════
                STEP 2 · HOUSES — interactive 12-room explorer
            ═══════════════════════════════════════════════════════════ */}
            {activeStep === 'houses' && (
              <motion.div
                key="houses"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                    Step 1 · Houses
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    The 12 Rooms of{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                      Your Life
                    </span>
                  </h2>
                  <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
                    Imagine your life is a 12-room mansion. Each room governs a specific area.
                    <span className="block mt-1 text-slate-700 font-semibold">Tap any room to enter it.</span>
                  </p>
                </div>

                {/* The 12 houses interactive grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                  {HOUSES.map((house, i) => {
                    const isSelected = selectedHouse === house.num;
                    return (
                      <motion.button
                        key={house.num}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.4 }}
                        onClick={() => setSelectedHouse(isSelected ? null : house.num)}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={`relative aspect-square rounded-2xl p-3 md:p-4 text-left transition-all overflow-hidden ${
                          isSelected
                            ? `bg-gradient-to-br ${house.color} text-white shadow-xl shadow-slate-400/30`
                            : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                        }`}
                      >
                        {/* Number background */}
                        <div className={`absolute -top-2 -right-2 text-5xl md:text-6xl font-black ${
                          isSelected ? 'text-white/20' : 'text-slate-100'
                        } pointer-events-none select-none`}>
                          {house.num}
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                          <div className="text-2xl md:text-3xl">{house.emoji}</div>
                          <div>
                            <div className={`text-[9px] md:text-[10px] font-mono tracking-[0.15em] uppercase mb-0.5 ${
                              isSelected ? 'text-white/70' : 'text-slate-400'
                            }`}>
                              House {house.num}
                            </div>
                            <div className={`text-xs md:text-sm font-bold leading-tight ${
                              isSelected ? 'text-white' : 'text-slate-900'
                            }`}>
                              {house.title}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Detail panel — appears when a house is selected */}
                <AnimatePresence>
                  {selectedHouse && (() => {
                    const h = HOUSES.find(x => x.num === selectedHouse)!;
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                      >
                        <div className={`relative p-6 md:p-8 rounded-3xl bg-gradient-to-br ${h.color} text-white shadow-2xl overflow-hidden`}>
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                          <div className="relative z-10">
                            <div className="flex items-start gap-4 md:gap-5">
                              <div className="text-5xl md:text-6xl">{h.emoji}</div>
                              <div className="flex-1">
                                <div className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/80 mb-1">
                                  House {h.num}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black mb-2">{h.title}</h3>
                                <p className="text-sm md:text-base text-white/90 leading-relaxed">{h.desc}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                {/* Pro tip */}
                <div className="flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <Eye size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-bold text-amber-900 mb-1">Quick Tip, {firstName}</div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      The 1st, 4th, 7th, and 10th houses are called <span className="font-bold">Kendras</span> (Pillars). They hold the most weight in your chart — like the four corners of a temple.
                    </p>
                  </div>
                </div>

                {/* Nav */}
                <div className="flex items-center justify-between gap-3 pt-4">
                  <button onClick={goPrev} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button onClick={goNext} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm md:text-base hover:bg-slate-800 transition-colors shadow-lg">
                    Meet the planets <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════
                STEP 3 · PLANETS — interactive cosmic cast
            ═══════════════════════════════════════════════════════════ */}
            {activeStep === 'planets' && (
              <motion.div
                key="planets"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                    Step 2 · Planets
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    Meet Your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                      Cosmic Cast
                    </span>
                  </h2>
                  <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
                    Nine actors. Each plays a role in your life's story. Tap any planet to hear its monologue.
                  </p>
                </div>

                {/* Planets grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {PLANETS.map((planet, i) => {
                    const isSelected = selectedPlanet === planet.name;
                    return (
                      <motion.div
                        key={planet.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                      >
                        <MagneticCard className="h-full">
                          <button
                            onClick={() => setSelectedPlanet(isSelected ? null : planet.name)}
                            className={`relative w-full h-full text-left p-5 md:p-6 rounded-2xl transition-all overflow-hidden border ${
                              isSelected
                                ? 'border-transparent shadow-2xl scale-[1.02]'
                                : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm hover:shadow-lg hover:-translate-y-1'
                            }`}
                            style={isSelected ? {
                              backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                            } : undefined}
                          >
                            {/* Animated gradient background when selected */}
                            {isSelected && (
                              <div className={`absolute inset-0 bg-gradient-to-br ${planet.grad} opacity-95`} />
                            )}
                            {!isSelected && (
                              <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${planet.grad} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />
                            )}

                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg transition-all ${
                                  isSelected ? 'bg-white/25 backdrop-blur-md' : `bg-gradient-to-br ${planet.grad}`
                                }`}>
                                  <span className={isSelected ? '' : 'drop-shadow'}>{planet.emoji}</span>
                                </div>
                                <div className={`text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase font-bold ${
                                  isSelected ? 'text-white/80' : 'text-slate-400'
                                }`}>
                                  {planet.sanskrit}
                                </div>
                              </div>

                              <h3 className={`text-xl md:text-2xl font-black mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                {planet.name}
                              </h3>
                              <div className={`text-sm font-bold mb-3 ${
                                isSelected ? 'text-white/95' : `bg-gradient-to-r ${planet.grad} bg-clip-text text-transparent`
                              }`}>
                                {planet.role}
                              </div>
                              <p className={`text-xs md:text-sm leading-relaxed ${isSelected ? 'text-white/90' : 'text-slate-600'}`}>
                                {planet.desc}
                              </p>

                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-4 pt-4 border-t border-white/20 overflow-hidden"
                                >
                                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70 mb-1.5">Their Voice</div>
                                  <p className="text-sm md:text-base font-medium italic text-white">"{planet.quote}"</p>
                                </motion.div>
                              )}
                            </div>
                          </button>
                        </MagneticCard>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pro tip */}
                <div className="flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <Crown size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-bold text-indigo-900 mb-1">Did you know, {firstName}?</div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      In Vedic tradition, <span className="font-bold">Rahu and Ketu</span> are not physical planets — they are the points where the Moon's orbit crosses the Sun's path. Yet they're considered among the most powerful forces in your chart.
                    </p>
                  </div>
                </div>

                {/* Nav */}
                <div className="flex items-center justify-between gap-3 pt-4">
                  <button onClick={goPrev} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button onClick={goNext} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm md:text-base hover:bg-slate-800 transition-colors shadow-lg">
                    Try on costumes <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════
                STEP 4 · SIGNS — costumes & elements
            ═══════════════════════════════════════════════════════════ */}
            {activeStep === 'signs' && (
              <motion.div
                key="signs"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                    Step 3 · Signs
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    The 12 Costumes &{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-500">
                      4 Elements
                    </span>
                  </h2>
                  <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
                    Mars in Aries (a fiery battlefield) acts very differently than Mars in Cancer (a cozy emotional home).
                    The costume changes the actor.
                  </p>
                </div>

                {/* Elements row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {ELEMENTS.map((el, i) => (
                    <motion.div
                      key={el.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${el.color} flex items-center justify-center mb-3`}>
                        <el.icon size={20} />
                      </div>
                      <div className="text-xs md:text-sm font-bold text-slate-900 mb-1">{el.name}</div>
                      <div className="text-[10px] md:text-xs text-slate-500 mb-2 leading-tight">{el.signs}</div>
                      <div className="text-[11px] md:text-xs text-slate-700 leading-relaxed font-medium">{el.desc}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Signs grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                  {SIGNS.map((sign, i) => (
                    <motion.div
                      key={sign.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -3, scale: 1.03 }}
                      className={`p-3 md:p-4 rounded-2xl border ${sign.color} hover:shadow-md transition-shadow cursor-default`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-2xl md:text-3xl">{sign.symbol}</div>
                        <div className="text-[9px] md:text-[10px] font-mono tracking-wider uppercase font-bold opacity-60">
                          {sign.element}
                        </div>
                      </div>
                      <div className="text-sm md:text-base font-black mb-0.5">{sign.name}</div>
                      <div className="text-[10px] md:text-[11px] font-medium opacity-75 mb-1.5 leading-tight">{sign.trait}</div>
                      <div className="text-[9px] md:text-[10px] font-mono tracking-wider uppercase opacity-50">
                        Ruled by {sign.ruler}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* The Ascendant — KEY CONCEPT */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-1 shadow-xl"
                >
                  <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-3xl p-6 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/20">
                        <Compass size={28} className="text-amber-200" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-amber-200 mb-2">
                          The Most Important Concept
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-3">The Ascendant (Lagna)</h3>
                        <p className="text-sm md:text-base text-white/90 leading-relaxed mb-4">
                          The sign rising on the eastern horizon at the exact minute of your birth. It sets the entire layout of your cosmic mansion — which sign rules each room. Your Sun sign is famous, but the Lagna is what truly shapes you, {firstName}.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs md:text-sm font-medium text-white">
                          <Sparkles size={12} className="text-amber-200" />
                          Without an exact birth time, this can't be calculated.
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Nav */}
                <div className="flex items-center justify-between gap-3 pt-4">
                  <button onClick={goPrev} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button onClick={goNext} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm md:text-base hover:bg-slate-800 transition-colors shadow-lg">
                    See it in action <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════
                STEP 5 · STORY — read a chart together
            ═══════════════════════════════════════════════════════════ */}
            {activeStep === 'story' && (
              <motion.div
                key="story"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                    Step 4 · Read a Story
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    Now You{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                      Read the Sky
                    </span>
                  </h2>
                  <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
                    Time to combine what you know. Browse these real chart "scenes" — Planet + House — and watch the story write itself.
                  </p>
                </div>

                {/* Story selector tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-2">
                  {STORIES.map((story, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStoryIndex(i)}
                      className={`flex-shrink-0 px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
                        activeStoryIndex === i
                          ? 'bg-slate-900 text-white shadow-lg'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base md:text-lg">{story.planetEmoji}</span>
                      <span>+</span>
                      <span className="text-base md:text-lg">{story.houseEmoji}</span>
                      <span className="hidden md:inline ml-1">{story.title}</span>
                    </button>
                  ))}
                </div>

                {/* Active story card */}
                <AnimatePresence mode="wait">
                  {(() => {
                    const story = STORIES[activeStoryIndex];
                    return (
                      <motion.div
                        key={activeStoryIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl"
                      >
                        {/* Top gradient bar */}
                        <div className={`h-1.5 bg-gradient-to-r ${story.planetGrad}`} />

                        <div className="p-6 md:p-10">
                          {/* Formula badges */}
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-5 md:mb-6">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-br ${story.planetGrad} text-white font-bold text-xs md:text-sm shadow-md`}>
                              <span className="text-base md:text-lg">{story.planetEmoji}</span>
                              {story.planet}
                            </div>
                            <div className="text-slate-400 text-lg md:text-xl font-light">+</div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-slate-900 text-white font-bold text-xs md:text-sm shadow-md">
                              <span className="text-base md:text-lg">{story.houseEmoji}</span>
                              House {story.house} · {story.houseTitle}
                            </div>
                            <div className="text-slate-400 text-lg md:text-xl font-light">=</div>
                            <div className="text-xs md:text-sm font-mono tracking-wider uppercase text-slate-500 font-bold">
                              The Story
                            </div>
                          </div>

                          <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                            {story.title}
                          </h3>

                          <div className="prose prose-slate max-w-none">
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-5">
                              {story.story}
                            </p>
                          </div>

                          {/* Real-world */}
                          <div className="mt-6 p-4 md:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
                            <div className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-2">
                              In Real Life
                            </div>
                            <div className="text-sm md:text-base text-slate-800 font-medium">{story.realWorld}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                {/* Story counter dots */}
                <div className="flex items-center justify-center gap-2">
                  {STORIES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStoryIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeStoryIndex === i ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Story ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Try it yourself prompt */}
                <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm md:text-base font-bold text-emerald-900 mb-1">
                        Now try it on YOUR chart, {firstName}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        After this masterclass, ask the Oracle Chat: <span className="font-mono text-xs md:text-sm bg-white px-2 py-0.5 rounded">"Where is my Sun and what does it mean?"</span> — and use this same Planet + House formula to read the answer.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nav */}
                <div className="flex items-center justify-between gap-3 pt-4">
                  <button onClick={goPrev} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button onClick={goNext} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm md:text-base hover:shadow-xl hover:shadow-indigo-500/30 transition-all shadow-lg">
                    Receive your wisdom <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════
                STEP 6 · FINALE — celebration + CTA
            ═══════════════════════════════════════════════════════════ */}
            {activeStep === 'finale' && (
              <motion.div
                key="finale"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 md:space-y-10"
              >
                {/* Trophy / celebration card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.7, type: "spring" }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 p-1 shadow-2xl shadow-orange-500/30"
                >
                  <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 rounded-3xl px-6 py-12 md:px-12 md:py-16 relative overflow-hidden text-center">
                    {/* Sparkles */}
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                          rotate: [0, 180],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 3,
                        }}
                      >
                        <Sparkles size={Math.random() > 0.5 ? 12 : 16} className="text-white/80" />
                      </motion.div>
                    ))}

                    <div className="relative z-10">
                      <motion.div
                        initial={{ rotate: -20, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                        className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 mb-6 shadow-xl"
                      >
                        <Trophy size={36} className="text-white drop-shadow-lg" />
                      </motion.div>

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-5 border border-white/30">
                        <Sparkles size={12} /> Masterclass Complete
                      </div>

                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] mb-5 drop-shadow-lg">
                        You speak the<br />
                        <span className="bg-gradient-to-r from-yellow-100 via-white to-yellow-100 bg-clip-text text-transparent">
                          language of the stars,
                        </span>
                        <br />
                        {firstName}.
                      </h2>

                      <p className="text-base md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed font-light mb-8">
                        You now know the only formula that matters: <span className="font-bold text-white">Planet + House + Sign</span>. Everything else is depth and detail.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Recap */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-10"
                >
                  <div className="text-center mb-6 md:mb-8">
                    <div className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-indigo-600 mb-2">
                      <BookOpen size={12} /> Your Cheat Sheet
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900">Remember these 3 things</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      { num: "01", title: "Houses are rooms.", desc: "12 areas of life — career, love, wealth, health.", icon: Home, grad: "from-blue-500 to-cyan-500" },
                      { num: "02", title: "Planets are actors.", desc: "9 cosmic energies that walk through your rooms.", icon: Users, grad: "from-amber-500 to-orange-500" },
                      { num: "03", title: "Signs are costumes.", desc: "12 flavors that change how each actor performs.", icon: Star, grad: "from-purple-500 to-fuchsia-500" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                        className="group flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all"
                      >
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${item.grad} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                          <item.icon size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-slate-400 mb-0.5">
                            {item.num}
                          </div>
                          <div className="text-base md:text-lg font-black text-slate-900">{item.title}</div>
                          <div className="text-xs md:text-sm text-slate-600 leading-relaxed">{item.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      // Try to switch the dashboard to chat mode if running inside dashboard
                      window.dispatchEvent(new CustomEvent('explainer:goto', { detail: { feature: 'chat' } }));
                    }}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 md:p-8 text-white shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/50 transition-all hover:-translate-y-1"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
                    <div className="relative z-10">
                      <MessageCircle size={28} className="mb-3" />
                      <div className="text-lg md:text-xl font-black mb-1">Ask Anything</div>
                      <div className="text-sm md:text-base text-white/80 mb-4 leading-relaxed">
                        Practice the formula in Oracle Chat — ask about your own planets and rooms.
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-sm font-bold">
                        Open Oracle Chat <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </a>

                  <button
                    onClick={() => jumpTo('intro')}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 md:p-8 text-slate-900 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 text-left"
                  >
                    <Shield size={28} className="mb-3 text-slate-700" />
                    <div className="text-lg md:text-xl font-black mb-1">Replay the Masterclass</div>
                    <div className="text-sm md:text-base text-slate-600 mb-4 leading-relaxed">
                      Re-read any section anytime. The wisdom deepens with each pass.
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600">
                      Start Over <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </motion.div>

                {/* Final wisdom quote */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="text-center py-8"
                >
                  <p className="text-base md:text-xl text-slate-500 italic font-light leading-relaxed max-w-xl mx-auto">
                    "Your chart is not a sentence written in stone.
                    <br className="hidden md:inline"/>
                    It is a map written in starlight."
                  </p>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
