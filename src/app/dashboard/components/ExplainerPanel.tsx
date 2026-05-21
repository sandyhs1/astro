"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowRight, ArrowLeft, BookOpen, Check, Lock, Play,
  Trophy, MessageCircle, ChevronDown, Star, Zap, Clock, Layers,
  Eye, Shield, Heart
} from "lucide-react";
import confetti from "canvas-confetti";

interface ExplainerPanelProps {
  profileId?: string;
  profileName?: string;
}

type StepKey = "welcome" | "villa" | "houses" | "planets" | "signs" | "formula" | "dashas" | "divisional" | "web" | "finale";
const STEPS: StepKey[] = ["welcome", "villa", "houses", "planets", "signs", "formula", "dashas", "divisional", "web", "finale"];
const STEP_LABELS: Record<StepKey, string> = {
  welcome: "Intro",
  villa: "The Villa",
  houses: "12 Rooms",
  planets: "9 Actors",
  signs: "Costumes",
  formula: "Formula",
  dashas: "Time",
  divisional: "16 Lenses",
  web: "The Web",
  finale: "Complete",
};

export default function ExplainerPanel({ profileName }: ExplainerPanelProps) {
  const [activeStep, setActiveStep] = useState<StepKey>("welcome");
  const [completedSteps, setCompletedSteps] = useState<Set<StepKey>>(new Set());
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract real first name — handle "My Chart", emails, or actual names
  const raw = (profileName || "").trim();
  const firstName = raw.includes("@") ? raw.split("@")[0] :
    (raw === "My Chart" || raw === "Unknown" || !raw) ? "Seeker" :
    raw.split(" ")[0];

  const currentIdx = STEPS.indexOf(activeStep);
  const progress = Math.round(((currentIdx + (completedSteps.has(activeStep) ? 1 : 0)) / STEPS.length) * 100);

  const goNext = () => {
    setCompletedSteps((p) => new Set([...p, activeStep]));
    const next = STEPS[currentIdx + 1];
    if (next) {
      setActiveStep(next);
      setExpandedItem(null);
      // Fire confetti when entering the finale
      if (next === "finale") {
        setTimeout(() => {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#FFD700", "#FF6B6B", "#A855F7", "#3B82F6", "#10B981", "#F59E0B"] });
          setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.3 }, colors: ["#EC4899", "#8B5CF6", "#06B6D4"] }), 300);
          setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.7 }, colors: ["#F59E0B", "#EF4444", "#6366F1"] }), 600);
        }, 200);
      }
    }
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goPrev = () => {
    const prev = STEPS[currentIdx - 1];
    if (prev) { setActiveStep(prev); setExpandedItem(null); }
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const jumpTo = (s: StepKey) => { setActiveStep(s); setExpandedItem(null); scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }); };
  const toggle = (id: string) => setExpandedItem(expandedItem === id ? null : id);

  // ─── NAV FOOTER (shared across all steps) ────────────────────────────────
  const NavFooter = ({ nextLabel = "Continue" }: { nextLabel?: string }) => (
    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
      {currentIdx > 0 ? (
        <button onClick={goPrev} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-sm">
          <ArrowLeft size={13} /> Back
        </button>
      ) : <div />}
      <button onClick={goNext} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:shadow-lg hover:shadow-indigo-500/25 transition-all shadow-sm">
        {nextLabel} <ArrowRight size={13} />
      </button>
    </div>
  );

  return (
    <div className="flex-1 w-full h-full bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 flex flex-col relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-amber-200/30 rounded-full blur-[80px] pointer-events-none" />

      {/* ─── STICKY PROGRESS BAR ─── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 md:px-5 py-2 md:py-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <BookOpen size={12} className="text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-indigo-600">Vedic Masterclass</div>
                <div className="text-[9px] text-slate-400 font-medium">for {firstName}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-indigo-600">{progress}%</div>
              <div className="text-[9px] text-slate-400">{currentIdx + 1} of {STEPS.length}</div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-sm" />
          </div>
          {/* Step pills */}
          <div className="flex gap-1 mt-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-0.5">
            {STEPS.map((s, i) => {
              const active = s === activeStep;
              const done = completedSteps.has(s);
              return (
                <button key={s} onClick={() => jumpTo(s)}
                  className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] md:text-[10px] font-bold transition-all ${
                    active ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/30" :
                    done ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    "bg-slate-50 text-slate-400 border border-slate-100"
                  }`}>
                  {done && <Check size={8} />}
                  {!done && i > currentIdx && <Lock size={7} />}
                  {STEP_LABELS[s]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── SCROLLABLE CONTENT ─── */}
      <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-24">
          <AnimatePresence mode="wait">

{/* ═══════════════════════════════════════════════════════════════════
    STEP 0 · WELCOME — Full-screen personalized intro
═══════════════════════════════════════════════════════════════════ */}
{activeStep === "welcome" && (
<motion.div key="welcome" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:0.5}} className="space-y-6">
  
  {/* Hero card — gradient, personalized */}
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 md:p-10 shadow-2xl shadow-indigo-500/20">
    {/* Animated stars */}
    {[...Array(15)].map((_, i) => (
      <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-white/70"
        style={{ top: `${10 + Math.random() * 80}%`, left: `${5 + Math.random() * 90}%` }}
        animate={{ opacity: [0.2, 1, 0.2], scale: [0.5, 1.5, 0.5] }}
        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
      />
    ))}
    <div className="absolute top-0 right-0 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-400/15 rounded-full blur-3xl" />

    <div className="relative z-10">
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase mb-4 border border-white/20">
        <Sparkles size={10} className="text-amber-300" /> Your Personal Cosmic Guide
      </motion.div>

      <motion.h1 initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
        className="text-2xl md:text-4xl font-black text-white tracking-tight leading-[1.1] mb-3">
        Welcome to the Masterclass,
        <br />
        <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
          {firstName}.
        </span>
      </motion.h1>

      <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.45}}
        className="text-sm md:text-base text-white/85 max-w-lg leading-relaxed font-light">
        Your birth chart is already computed — 127 metrics, 16 divisional charts, 300+ yogas. 
        Before you explore it, let's make you fluent in the language of the stars in under 10 minutes.
      </motion.p>

      <motion.button initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.6}}
        onClick={goNext} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-indigo-700 font-bold text-sm shadow-xl shadow-black/15 hover:shadow-amber-300/30 transition-shadow">
        <Play size={14} fill="currentColor" /> Begin the Journey
      </motion.button>
    </div>
  </div>

  {/* What you'll learn — colorful cards */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
    {[
      { icon: "🏠", label: "12 Houses", sub: "Life areas", color: "from-blue-500 to-cyan-500" },
      { icon: "🎭", label: "9 Planets", sub: "Cosmic actors", color: "from-amber-500 to-orange-500" },
      { icon: "👘", label: "12 Signs", sub: "Costumes", color: "from-purple-500 to-fuchsia-500" },
      { icon: "⏳", label: "Dashas", sub: "Time cycles", color: "from-rose-500 to-pink-500" },
    ].map((c, i) => (
      <motion.div key={i} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.7 + i * 0.08}}
        className="relative overflow-hidden rounded-2xl p-3.5 md:p-4 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.color}`} />
        <div className="text-xl md:text-2xl mb-1.5">{c.icon}</div>
        <div className="text-xs md:text-sm font-bold text-slate-900">{c.label}</div>
        <div className="text-[10px] text-slate-500 font-medium">{c.sub}</div>
      </motion.div>
    ))}
  </div>

  {/* Depth disclaimer */}
  <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}}
    className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
      <Star size={14} className="text-white" />
    </div>
    <div>
      <div className="text-xs font-bold text-amber-900 mb-0.5">This is just the beginning</div>
      <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed">
        Vedic astrology (Jyotisha) is one of the deepest, most mathematically rigorous knowledge systems ever created — 5,000+ years, hundreds of classical texts, millions of chart permutations. This masterclass covers the <span className="font-bold">absolute fundamentals</span>. Think of it as learning the alphabet before reading the Mahabharata.
      </p>
    </div>
  </motion.div>
</motion.div>
)}

{/* ═══════════════════════════════════════════════════════════════════
    STEP 1 · THE VILLA METAPHOR
═══════════════════════════════════════════════════════════════════ */}
{activeStep === "villa" && (
<motion.div key="villa" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:0.4}} className="space-y-5">
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-5 md:p-7 shadow-sm">
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
        <span className="text-lg">🏠</span>
      </div>
      <div>
        <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Think of your chart as a massive 12-BHK Villa</h2>
        <p className="text-[11px] text-blue-600 font-semibold mt-0.5">The foundational metaphor of Vedic astrology</p>
      </div>
    </div>
    <div className="text-xs md:text-sm text-slate-700 leading-relaxed space-y-3">
      <p>The moment you were born, the cosmos froze a snapshot of the sky. That snapshot is your birth chart — and it works exactly like a 12-room villa:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {[
          { emoji:"🏠", title:"Houses = Rooms", desc:"12 rooms, each dedicated to a specific life area. The 7th room is marriage. The 10th is career. The 12th is spirituality.", grad:"from-blue-500 to-cyan-500" },
          { emoji:"🎭", title:"Planets = Actors", desc:"9 cosmic actors walk through these rooms. Each has a specific expertise — Sun rules authority, Venus rules love, Saturn rules discipline.", grad:"from-amber-500 to-orange-500" },
          { emoji:"👘", title:"Signs = Costumes", desc:"12 costumes that change HOW each actor behaves. Mars in Aries (warrior costume) is aggressive. Mars in Cancer (nurturing costume) is protective.", grad:"from-purple-500 to-fuchsia-500" },
        ].map((c) => (
          <div key={c.title} className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-3.5 shadow-sm">
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${c.grad}`} />
            <div className="text-xl mb-2">{c.emoji}</div>
            <div className="text-xs font-bold text-slate-900 mb-1">{c.title}</div>
            <div className="text-[11px] text-slate-500 leading-relaxed">{c.desc}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600 italic pt-1">
        The magic happens when you combine all three: <span className="font-bold not-italic text-indigo-700">Planet + Sign + House = Your Life Story</span>. That's the formula we'll build toward.
      </p>
    </div>
  </div>

  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
    <Zap size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
    <p className="text-[11px] text-slate-700 leading-relaxed">
      <span className="font-bold text-emerald-800">Why this matters for you, {firstName}:</span> Your dashboard already computed all 12 houses, all 9 planetary positions, and all 16 divisional charts. This masterclass teaches you how to READ what it found.
    </p>
  </div>

  <NavFooter nextLabel="Enter the rooms" />
</motion.div>
)}

{/* ═══════════════════════════════════════════════════════════════════
    STEP 2 · THE 12 HOUSES — Expandable accordions
═══════════════════════════════════════════════════════════════════ */}
{activeStep === "houses" && (
<motion.div key="houses" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:0.4}} className="space-y-4">
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
      <span className="text-sm">🏠</span>
    </div>
    <div>
      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-600">Step 2 · The 12 Rooms</div>
      <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Each Room Has Intense, Specific Energy</h2>
      <p className="text-[11px] text-slate-500 mt-0.5">Tap any room to see what it governs and a real Vedic example.</p>
    </div>
  </div>

  <div className="space-y-1.5">
    {[
      { n:1, title:"Self & Body (Lagna)", desc:"Physical appearance, personality, vitality, and how the world perceives you. The most important house — it sets the entire chart layout based on your Ascendant sign.", ex:"Strong Sun here = natural leadership presence, government career. Weak Saturn here = chronic health issues in early life, thin frame." },
      { n:2, title:"Wealth & Speech", desc:"Accumulated wealth, family lineage, food habits, quality of voice, and early childhood environment.", ex:"Jupiter here = wealth through wisdom/teaching, sweet speech. Mars here = harsh speech, arguments in family, but wealth through courage." },
      { n:3, title:"Courage & Siblings", desc:"Short travels, communication skills, younger siblings, raw willpower, and hands/arms.", ex:"Mercury here = gifted writer/speaker, skilled with hands. Ketu here = distant relationship with siblings, unconventional courage." },
      { n:4, title:"Home & Mother", desc:"Inner peace, real estate, vehicles, mother, emotional foundation, and formal education.", ex:"Moon here (own house) = deep emotional security, close to mother. Rahu here = restlessness, frequent relocation, luxury vehicles." },
      { n:5, title:"Children & Creativity", desc:"Intelligence, romance, children, speculation/investments, and past-life merit (Purva Punya).", ex:"Venus here = artistic talent, romantic nature, beautiful children. Saturn here = delayed children, disciplined creativity, cautious investor." },
      { n:6, title:"Enemies & Disease", desc:"Daily work, health struggles, debts, legal disputes, service to others, and maternal uncle.", ex:"Mars here = wins over enemies through aggression, surgeon. Rahu here = mysterious illnesses, foreign employment, unconventional healing." },
      { n:7, title:"Marriage & Partners", desc:"Spouse, business partnerships, public dealings, foreign travel, and the 'other' in your life.", ex:"Venus here = beautiful/artistic spouse, harmonious marriage. Saturn here = delayed marriage, older/mature partner, long-lasting union." },
      { n:8, title:"Transformation & Death", desc:"Sudden events, longevity, inheritance, occult knowledge, sexual energy, and in-laws.", ex:"Ketu here = spiritual transformation, interest in occult. Mars here = accidents/surgeries, but also research ability and insurance gains." },
      { n:9, title:"Dharma & Fortune", desc:"Higher education, long journeys, father, guru, religion, luck, and philosophical beliefs.", ex:"Jupiter here (own house) = deeply fortunate, spiritual teacher, foreign travel. Sun here = father is authoritative, career in law/academia." },
      { n:10, title:"Career & Status", desc:"Profession, public reputation, government, authority, and your highest achievement in society.", ex:"Sun here = career in authority/government, public recognition. Saturn here = slow but massive career rise after 36, discipline-based success." },
      { n:11, title:"Gains & Networks", desc:"Income, large organizations, elder siblings, fulfillment of desires, and social circles.", ex:"Jupiter here = gains through wisdom, large network. Venus here = gains through arts, women, luxury industries, social popularity." },
      { n:12, title:"Loss & Liberation", desc:"Foreign lands, isolation, spiritual liberation, expenses, sleep quality, and bedroom pleasures.", ex:"Ketu here = natural spiritual detachment, moksha karaka. Rahu here = settlement abroad, hidden expenses, vivid dream life." },
    ].map((h) => (
      <button key={h.n} onClick={() => toggle(`h${h.n}`)} className="w-full text-left">
        <div className={`p-3 rounded-xl border transition-all ${expandedItem === `h${h.n}` ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm" : "bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm"}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${expandedItem === `h${h.n}` ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md" : "bg-blue-100 text-blue-700"}`}>{h.n}</span>
              <span className="text-xs md:text-sm font-bold text-slate-900 truncate">{h.title}</span>
            </div>
            <ChevronDown size={14} className={`text-slate-400 flex-shrink-0 transition-transform ${expandedItem === `h${h.n}` ? "rotate-180 text-blue-500" : ""}`} />
          </div>
          {expandedItem === `h${h.n}` && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="mt-2.5 pt-2.5 border-t border-blue-100 space-y-2 overflow-hidden">
              <p className="text-[11px] text-slate-600 leading-relaxed">{h.desc}</p>
              <div className="text-[11px] bg-white rounded-lg border border-blue-100 px-3 py-2 leading-relaxed text-blue-900">
                <span className="font-bold">📐 Real example:</span> {h.ex}
              </div>
            </motion.div>
          )}
        </div>
      </button>
    ))}
  </div>

  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
    <Shield size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
    <p className="text-[11px] text-slate-700 leading-relaxed">
      <span className="font-bold text-amber-800">Classical classification:</span> Houses 1, 4, 7, 10 = <span className="font-bold">Kendras</span> (pillars). Houses 1, 5, 9 = <span className="font-bold">Trikonas</span> (luck). Houses 6, 8, 12 = <span className="font-bold">Dusthanas</span> (struggle → hidden strength).
    </p>
  </div>

  <NavFooter nextLabel="Meet the actors" />
</motion.div>
)}

{/* ═══════════════════════════════════════════════════════════════════
    STEP 3 · THE 9 PLANETS
═══════════════════════════════════════════════════════════════════ */}
{activeStep === "planets" && (
<motion.div key="planets" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:0.4}} className="space-y-4">
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
      <span className="text-sm">🎭</span>
    </div>
    <div>
      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-amber-600">Step 3 · The 9 Actors</div>
      <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Each Actor Has Specific Expertise</h2>
      <p className="text-[11px] text-slate-500 mt-0.5">They don't "cause" events — they indicate karmic patterns. Tap to explore.</p>
    </div>
  </div>

  <div className="space-y-1.5">
    {[
      { name:"☀️ Sun (Surya)", role:"The King", portfolio:"Soul, ego, father, government, authority, vitality, bones", nature:"Natural malefic · Sattvic", rules:"Leo", friends:"Moon, Mars, Jupiter", enemies:"Venus, Saturn", ex:"Sun in 10th = career in authority/government. Sun + Saturn conjunction = conflict with father, delayed recognition but eventual power." },
      { name:"🌙 Moon (Chandra)", role:"The Queen", portfolio:"Mind, emotions, mother, public image, fluids, lungs", nature:"Benefic when waxing · Malefic when waning", rules:"Cancer", friends:"Sun, Mercury", enemies:"None", ex:"Moon in 4th = deep emotional security, close to mother. Moon + Rahu = anxiety/overthinking but powerful intuition (Grahan Yoga)." },
      { name:"🔥 Mars (Mangal)", role:"The Commander", portfolio:"Courage, aggression, siblings, land, surgery, blood, muscles", nature:"Natural malefic · Tamasic", rules:"Aries & Scorpio", friends:"Sun, Moon, Jupiter", enemies:"Mercury", ex:"Mars in 7th = Mangal Dosha (friction in marriage unless matched). Mars in 10th = career in military, engineering, sports, surgery." },
      { name:"💫 Mercury (Budh)", role:"The Merchant", portfolio:"Intellect, speech, commerce, mathematics, skin, nervous system", nature:"Benefic alone · Takes color of conjunctions", rules:"Gemini & Virgo", friends:"Sun, Venus", enemies:"Moon", ex:"Mercury in 2nd = gifted speaker, wealth through communication. Mercury + Ketu = unconventional thinking, coding/research talent." },
      { name:"🌟 Jupiter (Guru)", role:"The Teacher", portfolio:"Wisdom, children, wealth, dharma, liver, fat, expansion", nature:"Greatest natural benefic · Sattvic", rules:"Sagittarius & Pisces", friends:"Sun, Moon, Mars", enemies:"Mercury, Venus", ex:"Jupiter in 5th = blessed with intelligent children, speculative gains. Jupiter in 9th = deeply fortunate, spiritual wisdom, guru-like." },
      { name:"💖 Venus (Shukra)", role:"The Artist", portfolio:"Love, marriage, luxury, arts, reproductive system, kidneys", nature:"Natural benefic · Rajasic", rules:"Taurus & Libra", friends:"Mercury, Saturn", enemies:"Sun, Moon", ex:"Venus in 7th = beautiful/artistic spouse. Venus exalted in Pisces = highest expression of unconditional love and creativity." },
      { name:"⏳ Saturn (Shani)", role:"The Judge", portfolio:"Discipline, karma, delays, chronic illness, longevity, servants, oil, iron", nature:"Greatest natural malefic · Tamasic", rules:"Capricorn & Aquarius", friends:"Mercury, Venus", enemies:"Sun, Moon, Mars", ex:"Saturn in 10th = Sasa Yoga (massive career after 36). Saturn in 1st = slow start, thin body, but extraordinary endurance and longevity." },
      { name:"🌒 Rahu (North Node)", role:"The Illusionist", portfolio:"Obsession, foreign lands, technology, taboo, amplification, paternal grandfather", nature:"Malefic shadow planet · Tamasic", rules:"Co-rules Aquarius", friends:"Mercury, Venus, Saturn", enemies:"Sun, Moon, Mars", ex:"Rahu in 10th = fame through unconventional career, technology. Rahu in 7th = foreign spouse or unusual partnerships, multiple relationships." },
      { name:"🌠 Ketu (South Node)", role:"The Monk", portfolio:"Detachment, past lives, spirituality, sudden events, moksha, maternal grandfather", nature:"Malefic shadow planet · Moksha karaka", rules:"Co-rules Scorpio", friends:"Mars, Jupiter", enemies:"Moon, Venus", ex:"Ketu in 12th = natural spiritual liberation, vivid dreams. Ketu in 1st = identity confusion but deep inner wisdom, psychic ability." },
    ].map((p) => (
      <button key={p.name} onClick={() => toggle(`p-${p.name}`)} className="w-full text-left">
        <div className={`p-3 rounded-xl border transition-all ${expandedItem === `p-${p.name}` ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm" : "bg-white border-slate-200 hover:border-amber-200 hover:shadow-sm"}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs md:text-sm font-bold text-slate-900">{p.name}</div>
              <div className="text-[10px] text-amber-700 font-semibold">{p.role} · Rules {p.rules}</div>
            </div>
            <ChevronDown size={14} className={`text-slate-400 flex-shrink-0 transition-transform ${expandedItem === `p-${p.name}` ? "rotate-180 text-amber-500" : ""}`} />
          </div>
          {expandedItem === `p-${p.name}` && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="mt-2.5 pt-2.5 border-t border-amber-100 space-y-1.5 overflow-hidden">
              <div className="text-[11px] text-slate-600"><span className="font-bold text-slate-800">Portfolio:</span> {p.portfolio}</div>
              <div className="text-[11px] text-slate-600"><span className="font-bold text-slate-800">Nature:</span> {p.nature}</div>
              <div className="text-[11px] text-slate-600"><span className="font-bold text-slate-800">Friends:</span> {p.friends} · <span className="font-bold text-slate-800">Enemies:</span> {p.enemies}</div>
              <div className="text-[11px] bg-white rounded-lg border border-amber-100 px-3 py-2 leading-relaxed text-amber-900 mt-1">
                <span className="font-bold">📐 Real example:</span> {p.ex}
              </div>
            </motion.div>
          )}
        </div>
      </button>
    ))}
  </div>

  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
    <Eye size={14} className="text-indigo-600 flex-shrink-0 mt-0.5" />
    <p className="text-[11px] text-slate-700 leading-relaxed">
      <span className="font-bold text-indigo-800">Key insight, {firstName}:</span> A "malefic" planet in the right house can be extraordinarily powerful. Saturn in the 10th house is one of the strongest career placements in all of Jyotisha — it creates Sasa Yoga, one of the 5 Pancha Mahapurusha Yogas.
    </p>
  </div>

  <NavFooter nextLabel="The costumes" />
</motion.div>
)}

{/* ═══════════════════════════════════════════════════════════════════
    STEP 4 · SIGNS (compact — already well-known)
═══════════════════════════════════════════════════════════════════ */}
{activeStep === "signs" && (
<motion.div key="signs" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:0.4}} className="space-y-4">
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-md flex-shrink-0">
      <span className="text-sm">👘</span>
    </div>
    <div>
      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-purple-600">Step 4 · The 12 Costumes</div>
      <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Same Actor, Different Costume = Different Behavior</h2>
      <p className="text-[11px] text-slate-500 mt-0.5">In Vedic astrology we use the <span className="font-bold">Sidereal zodiac</span> — tied to actual star positions, not seasons. Your Vedic sign may differ from your Western sign by ~24°.</p>
    </div>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
    {[
      { sign:"♈ Aries", ruler:"Mars", q:"Cardinal Fire", trait:"Pioneering, impulsive, courageous" },
      { sign:"♉ Taurus", ruler:"Venus", q:"Fixed Earth", trait:"Stable, sensual, stubborn, wealth-oriented" },
      { sign:"♊ Gemini", ruler:"Mercury", q:"Mutable Air", trait:"Curious, dual-natured, communicative" },
      { sign:"♋ Cancer", ruler:"Moon", q:"Cardinal Water", trait:"Nurturing, emotional, protective, homebody" },
      { sign:"♌ Leo", ruler:"Sun", q:"Fixed Fire", trait:"Regal, dramatic, generous, authority-seeking" },
      { sign:"♍ Virgo", ruler:"Mercury", q:"Mutable Earth", trait:"Analytical, service-oriented, perfectionist" },
      { sign:"♎ Libra", ruler:"Venus", q:"Cardinal Air", trait:"Balanced, aesthetic, diplomatic, partnership-focused" },
      { sign:"♏ Scorpio", ruler:"Mars", q:"Fixed Water", trait:"Intense, secretive, transformative, research-minded" },
      { sign:"♐ Sagittarius", ruler:"Jupiter", q:"Mutable Fire", trait:"Philosophical, adventurous, honest, teacher" },
      { sign:"♑ Capricorn", ruler:"Saturn", q:"Cardinal Earth", trait:"Disciplined, ambitious, structured, late-bloomer" },
      { sign:"♒ Aquarius", ruler:"Saturn", q:"Fixed Air", trait:"Innovative, humanitarian, detached, unconventional" },
      { sign:"♓ Pisces", ruler:"Jupiter", q:"Mutable Water", trait:"Dreamy, spiritual, empathetic, boundary-less" },
    ].map((s) => (
      <div key={s.sign} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-200 hover:shadow-sm transition-all">
        <div className="text-xs font-bold text-slate-900 mb-0.5">{s.sign}</div>
        <div className="text-[10px] text-purple-600 font-semibold">{s.ruler} · {s.q}</div>
        <div className="text-[10px] text-slate-500 mt-1 leading-tight">{s.trait}</div>
      </div>
    ))}
  </div>

  {/* Ascendant callout */}
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 p-4 md:p-5 shadow-lg shadow-purple-500/20">
    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/15 rounded-full blur-3xl" />
    <div className="relative z-10 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/20">
        <Star size={14} className="text-amber-200" />
      </div>
      <div>
        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-amber-200 mb-1">The Ascendant (Lagna)</div>
        <p className="text-xs text-white/90 leading-relaxed">
          The sign rising on the eastern horizon at your exact birth minute. It determines which sign rules your 1st house — and therefore the entire layout of your villa. <span className="font-bold text-white">Without an accurate birth time, this cannot be calculated.</span> This is why Vedic astrology demands exact time of birth.
        </p>
      </div>
    </div>
  </div>

  <NavFooter nextLabel="See the formula" />
</motion.div>
)}

{/* ═══════════════════════════════════════════════════════════════════
    STEP 5 · THE FORMULA
═══════════════════════════════════════════════════════════════════ */}
{activeStep === "formula" && (
<motion.div key="formula" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:0.4}} className="space-y-4">
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md flex-shrink-0">
      <Zap size={14} className="text-white" />
    </div>
    <div>
      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-emerald-600">Step 5 · The Formula</div>
      <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Planet + Sign + House = Story</h2>
      <p className="text-[11px] text-slate-500 mt-0.5">Real Vedic examples — not assumptions. Each is a documented classical principle.</p>
    </div>
  </div>

  <div className="space-y-2.5">
    {[
      { formula:"Sun in Leo in 10th", story:"The King in his own royal costume, sitting in the career room. Born to lead publicly — government, CEO, authority. They NEED recognition.", principle:"Planet in own sign + angular house = Digbala + Swakshetra = maximum strength." },
      { formula:"Saturn in Capricorn in 1st", story:"The Judge in his own disciplined costume at the front door. Slow start, thin body, serious — but after 36, unstoppable. This is Sasa Yoga.", principle:"One of the 5 Pancha Mahapurusha Yogas (BPHS Ch. 75)." },
      { formula:"Venus in Pisces in 7th", story:"The Artist in the most romantic costume possible, in the marriage room. Venus is EXALTED in Pisces — highest expression of love. Deeply devoted, artistic spouse.", principle:"Exalted planet in its best house = extraordinary results." },
      { formula:"Mars in Cancer in 4th", story:"The Commander in a nurturing costume in the home room. Mars is DEBILITATED — the warrior becomes overly emotional, aggressive at home. Property disputes.", principle:"Debilitated planet = actor uncomfortable in costume. Energy misdirected." },
      { formula:"Jupiter in 5th in Sagittarius", story:"The Teacher in his own philosophical costume in the children/creativity room. Blessed with intelligent children, speculative gains, and natural teaching ability.", principle:"Jupiter in own sign in Trikona = Hamsa Yoga (another Pancha Mahapurusha)." },
    ].map((ex, i) => (
      <div key={i} className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-3.5 shadow-sm hover:shadow-md transition-shadow">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded-md mb-2">{ex.formula}</div>
        <p className="text-xs text-slate-700 leading-relaxed mb-2">{ex.story}</p>
        <div className="text-[10px] text-slate-500 italic border-t border-slate-100 pt-2">📐 {ex.principle}</div>
      </div>
    ))}
  </div>

  <NavFooter nextLabel="Time cycles" />
</motion.div>
)}

{/* ═══════════════════════════════════════════════════════════════════
    STEP 6 · DASHAS
═══════════════════════════════════════════════════════════════════ */}
{activeStep === "dashas" && (
<motion.div key="dashas" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:0.4}} className="space-y-4">
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md flex-shrink-0">
      <Clock size={14} className="text-white" />
    </div>
    <div>
      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-rose-600">Step 6 · Dashas</div>
      <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">When Does Each Planet Activate?</h2>
      <p className="text-[11px] text-slate-500 mt-0.5">The chart is static. Dashas make it predictive — telling you WHEN results manifest.</p>
    </div>
  </div>

  {/* Vimshottari overview */}
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 p-4 md:p-5">
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
    <h3 className="text-sm font-bold text-slate-900 mb-2">Vimshottari Dasha — The 120-Year Master Cycle</h3>
    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">Based on the Moon's exact Nakshatra at birth, life divides into planetary periods:</p>
    <div className="grid grid-cols-3 gap-1.5">
      {[{p:"Sun",y:"6"},{p:"Moon",y:"10"},{p:"Mars",y:"7"},{p:"Rahu",y:"18"},{p:"Jupiter",y:"16"},{p:"Saturn",y:"19"},{p:"Mercury",y:"17"},{p:"Ketu",y:"7"},{p:"Venus",y:"20"}].map((d) => (
        <div key={d.p} className="p-2 rounded-lg bg-white border border-rose-100 text-center">
          <div className="text-[10px] font-bold text-slate-900">{d.p}</div>
          <div className="text-[10px] text-rose-600 font-bold">{d.y} yrs</div>
        </div>
      ))}
    </div>
  </div>

  {/* 5 levels */}
  <div className="space-y-1.5">
    {[
      { level:"Mahadasha (MD)", dur:"Years–decades", desc:"The dominant planet ruling your current life chapter. Everything is colored by this energy.", ex:"Saturn MD (19 years) = life demands discipline, slow growth, karmic reckoning. Career solidifies after initial struggle." },
      { level:"Antardasha (AD)", dur:"Months–years", desc:"Sub-period within MD. A secondary planet modifies the main theme.", ex:"Saturn MD / Venus AD = discipline meets love. Serious relationships form, career in arts/luxury stabilizes." },
      { level:"Pratyantardasha (PD)", dur:"Weeks–months", desc:"Third level. Events become specific and time-bound.", ex:"Saturn MD / Venus AD / Mars PD = specific month where passion meets structure. Property purchase, marriage date." },
      { level:"Sookshma Dasha (SD)", dur:"Days–weeks", desc:"Fourth level. Pinpoints specific days when energy peaks.", ex:"Used to time exact surgery dates, business launches, or travel windows." },
      { level:"Prana Dasha", dur:"Hours–days", desc:"Fifth level. Finest resolution — used in Prashna (horary) for immediate questions.", ex:"Reserved for urgent timing. 'Should I sign this contract TODAY?' — answered at this level." },
    ].map((l) => (
      <button key={l.level} onClick={() => toggle(`d-${l.level}`)} className="w-full text-left">
        <div className={`p-3 rounded-xl border transition-all ${expandedItem === `d-${l.level}` ? "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200 shadow-sm" : "bg-white border-slate-200 hover:border-rose-200"}`}>
          <div className="flex items-center justify-between gap-2">
            <div><span className="text-xs font-bold text-slate-900">{l.level}</span><span className="text-[10px] text-rose-600 font-semibold ml-2">{l.dur}</span></div>
            <ChevronDown size={12} className={`text-slate-400 transition-transform ${expandedItem === `d-${l.level}` ? "rotate-180 text-rose-500" : ""}`} />
          </div>
          {expandedItem === `d-${l.level}` && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-2 pt-2 border-t border-rose-100 space-y-1.5 overflow-hidden">
              <p className="text-[11px] text-slate-600 leading-relaxed">{l.desc}</p>
              <div className="text-[11px] bg-white rounded-lg border border-rose-100 px-3 py-2 text-rose-900"><span className="font-bold">📐 Example:</span> {l.ex}</div>
            </motion.div>
          )}
        </div>
      </button>
    ))}
  </div>

  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200">
    <Heart size={14} className="text-rose-600 flex-shrink-0 mt-0.5" />
    <p className="text-[11px] text-slate-700 leading-relaxed">
      <span className="font-bold text-rose-800">Why twins diverge:</span> Two people born 4 minutes apart can have different Dasha sequences active at age 30. The D-60 chart shifts every 2 minutes — so their karmic starting points differ even when D-1 looks identical.
    </p>
  </div>

  <NavFooter nextLabel="16 lenses" />
</motion.div>
)}

{/* ═══════════════════════════════════════════════════════════════════
    STEP 7 · DIVISIONAL CHARTS
═══════════════════════════════════════════════════════════════════ */}
{activeStep === "divisional" && (
<motion.div key="divisional" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:0.4}} className="space-y-4">
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
      <Layers size={14} className="text-white" />
    </div>
    <div>
      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-cyan-600">Step 7 · Shodasavarga</div>
      <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">16 Microscopic Lenses</h2>
      <p className="text-[11px] text-slate-500 mt-0.5">D-1 is the wide-angle. Each divisional chart zooms into one life domain with surgical precision.</p>
    </div>
  </div>

  <div className="space-y-1.5">
    {[
      { c:"D-1 Rasi", d:"Overall Life", desc:"Master chart. Physical body, personality, foundation for everything." },
      { c:"D-2 Hora", d:"Wealth", desc:"Sun's half = earned wealth. Moon's half = inherited/lucky wealth." },
      { c:"D-3 Drekkana", d:"Siblings & Courage", desc:"Nature of siblings, communication style, raw willpower." },
      { c:"D-4 Chaturthamsa", d:"Property", desc:"Fixed assets — land, houses, vehicles, ancestral property." },
      { c:"D-7 Saptamsa", d:"Children", desc:"Definitive chart for children — nature, timing, relationship." },
      { c:"D-9 Navamsa", d:"Marriage & Dharma", desc:"THE most important varga. True spouse nature, marriage quality, soul purpose. 'D-1 is the promise, D-9 is the delivery.'" },
      { c:"D-10 Dasamsa", d:"Career", desc:"Specific industry, authority level, promotion timing, professional reputation." },
      { c:"D-12 Dwadasamsa", d:"Parents", desc:"Nature of parents, relationship with them, parental karma." },
      { c:"D-16 Shodasamsa", d:"Vehicles & Accidents", desc:"Physical comforts, vehicles, probability of accidents." },
      { c:"D-20 Vimsamsa", d:"Spirituality", desc:"Spiritual path, meditation capacity, connection to divine." },
      { c:"D-24 Chaturvimsamsa", d:"Education", desc:"Academic ability, type of knowledge mastered, intellectual capacity." },
      { c:"D-27 Bhamsa", d:"Strength", desc:"Overall physical and mental strength (one division per Nakshatra)." },
      { c:"D-30 Trimsamsa", d:"Misfortune", desc:"Hidden suffering — chronic illness, psychological patterns, subconscious blocks." },
      { c:"D-40 Khavedamsa", d:"Maternal Karma", desc:"Karma inherited specifically from mother's lineage." },
      { c:"D-45 Akshavedamsa", d:"Paternal Karma", desc:"Karma inherited specifically from father's lineage." },
      { c:"D-60 Shashtiamsa", d:"Past-Life Verdict", desc:"Shifts every 2 minutes. The FINAL karmic verdict. If D-1 blesses but D-60 curses, D-60 wins." },
    ].map((ch) => (
      <button key={ch.c} onClick={() => toggle(`dc-${ch.c}`)} className="w-full text-left">
        <div className={`p-2.5 rounded-xl border transition-all ${expandedItem === `dc-${ch.c}` ? "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 shadow-sm" : "bg-white border-slate-200 hover:border-cyan-200"}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[9px] font-mono font-bold text-cyan-700 bg-cyan-100 px-1.5 py-0.5 rounded flex-shrink-0">{ch.c}</span>
              <span className="text-xs font-bold text-slate-900 truncate">{ch.d}</span>
            </div>
            <ChevronDown size={12} className={`text-slate-400 flex-shrink-0 transition-transform ${expandedItem === `dc-${ch.c}` ? "rotate-180 text-cyan-500" : ""}`} />
          </div>
          {expandedItem === `dc-${ch.c}` && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-2 pt-2 border-t border-cyan-100 overflow-hidden">
              <p className="text-[11px] text-slate-600 leading-relaxed">{ch.desc}</p>
            </motion.div>
          )}
        </div>
      </button>
    ))}
  </div>

  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200">
    <Eye size={14} className="text-cyan-600 flex-shrink-0 mt-0.5" />
    <p className="text-[11px] text-slate-700 leading-relaxed">
      <span className="font-bold text-cyan-800">The D-9 Rule (BPHS):</span> "The Rasi chart shows what is promised. The Navamsa shows what is delivered." A planet exalted in D-1 but debilitated in D-9 = the promise breaks in execution. This is why surface-level astrology fails.
    </p>
  </div>

  <NavFooter nextLabel="The web" />
</motion.div>
)}

{/* ═══════════════════════════════════════════════════════════════════
    STEP 8 · THE WEB — HOW EVERYTHING CONNECTS
═══════════════════════════════════════════════════════════════════ */}
{activeStep === "web" && (
<motion.div key="web" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:0.4}} className="space-y-4">
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
      <Sparkles size={14} className="text-white" />
    </div>
    <div>
      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-violet-600">Step 8 · The Web</div>
      <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Nothing Works in Isolation</h2>
      <p className="text-[11px] text-slate-500 mt-0.5">A real reading cross-references ALL systems simultaneously. Here's how the layers interact:</p>
    </div>
  </div>

  <div className="space-y-2">
    {[
      { title:"D-1 sets the stage → D-9 confirms delivery", desc:"Jupiter in 7th (D-1) promises a wise spouse. But if Jupiter is debilitated in D-9, the spouse appears wise but lacks depth. D-9 is the reality check.", color:"border-l-violet-500 bg-violet-50/50" },
      { title:"Dashas activate what the chart promises", desc:"A powerful 10th house = career potential. But it only manifests when the 10th lord's Mahadasha or Antardasha runs. Exalted Sun in 10th may struggle until Sun MD begins.", color:"border-l-rose-500 bg-rose-50/50" },
      { title:"Transits trigger events within Dasha windows", desc:"Saturn transiting 7th during Venus AD = marriage pressure. Same transit during Ketu AD = separation. The Dasha determines HOW you experience the transit.", color:"border-l-blue-500 bg-blue-50/50" },
      { title:"Yogas form across multiple charts", desc:"Raj Yoga in D-1 is promising. Same planets forming Raj Yoga in D-10 as well = career success virtually guaranteed. Cross-chart confirmation = high confidence prediction.", color:"border-l-emerald-500 bg-emerald-50/50" },
      { title:"Nakshatras add emotional texture", desc:"27 Nakshatras subdivide the zodiac into 13°20' segments. Each has a deity, animal symbol, and psychological quality. Moon's Nakshatra determines your Dasha starting point AND emotional core.", color:"border-l-amber-500 bg-amber-50/50" },
      { title:"Ashtakavarga quantifies strength (0–8 points)", desc:"Each planet gets 0–8 Bindus per house based on all other planets' contributions. 5+ Bindus = strong results. Below 3 = weak regardless of other factors. The mathematical backbone of prediction.", color:"border-l-cyan-500 bg-cyan-50/50" },
      { title:"Shadbala measures six-fold power", desc:"Every planet scored across 6 dimensions: positional, directional, temporal, motional, natural, aspectual. A planet can look good by sign but be weak in Shadbala — meaning it lacks energy to deliver.", color:"border-l-pink-500 bg-pink-50/50" },
    ].map((item, i) => (
      <div key={i} className={`p-3.5 rounded-xl border-l-4 border border-slate-100 ${item.color}`}>
        <div className="text-xs font-bold text-slate-900 mb-1">{item.title}</div>
        <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
      </div>
    ))}
  </div>

  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
    <Layers size={14} className="text-violet-600 flex-shrink-0 mt-0.5" />
    <p className="text-[11px] text-slate-700 leading-relaxed">
      <span className="font-bold text-violet-800">Beyond this masterclass:</span> Lajjitadi Avasthas (behavioral states), Mrityu Bhaga (death degrees), Arudha Padas (reflected images), Jaimini Karakas (soul significators), Vimshopaka strength, and hundreds more layers exist. Your dashboard computes all of them automatically — this guide teaches you the foundation to understand the results.
    </p>
  </div>

  <NavFooter nextLabel="Complete ✓" />
</motion.div>
)}

{/* ═══════════════════════════════════════════════════════════════════
    STEP 9 · FINALE
═══════════════════════════════════════════════════════════════════ */}
{activeStep === "finale" && (
<motion.div key="finale" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:0.5}} className="space-y-5">
  
  {/* Celebration hero */}
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 p-6 md:p-8 shadow-2xl shadow-orange-500/20 text-center">
    {[...Array(12)].map((_, i) => (
      <motion.div key={i} className="absolute" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%` }}
        animate={{ opacity:[0,1,0], scale:[0,1.5,0], rotate:[0,180] }}
        transition={{ duration:2+Math.random()*2, repeat:Infinity, delay:Math.random()*3 }}>
        <Sparkles size={Math.random()>0.5?10:14} className="text-white/80" />
      </motion.div>
    ))}
    <div className="relative z-10">
      <Trophy size={32} className="text-white mx-auto mb-3 drop-shadow-lg" />
      <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/80 mb-2">Masterclass Complete</div>
      <h2 className="text-xl md:text-3xl font-black text-white tracking-tight leading-tight mb-2">
        You absolute star, {firstName}! 🌟
      </h2>
      <p className="text-xs md:text-sm text-white/85 max-w-md mx-auto leading-relaxed">
        You just conquered 5,000 years of cosmic wisdom in under 10 minutes. That's not just impressive — that's heroic. The universe is proud of you. Now go read your chart like the legend you are. ✨
      </p>
    </div>
  </div>

  {/* Cheat sheet */}
  <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
    <div className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
      <BookOpen size={12} className="text-indigo-600" /> Your Cheat Sheet
    </div>
    <div className="space-y-1.5">
      {[
        "12 Houses = 12 rooms of your life villa, each with intense specific energy",
        "9 Planets = 9 actors with specific expertise walking through those rooms",
        "12 Signs = costumes that change HOW each actor behaves in each room",
        "Planet + Sign + House = the formula for reading any placement",
        "Vimshottari Dasha = 120-year timing system, 5 levels deep (MD → AD → PD → SD → Prana)",
        "16 Divisional Charts = microscopic lenses for each life domain (D-1 through D-60)",
        "Everything cross-references — no single factor works alone",
        "This is just the alphabet — your dashboard computes the full language automatically",
      ].map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
          <Check size={11} className="text-emerald-500 flex-shrink-0 mt-0.5" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  </div>

  {/* CTAs */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
    <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("explainer:goto", { detail: { feature: "chat" } })); }}
      className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all shadow-sm">
      <MessageCircle size={18} />
      <div>
        <div className="text-xs font-bold">Ask the Oracle</div>
        <div className="text-[10px] text-white/70">Practice the formula on your own chart</div>
      </div>
    </a>
    <button onClick={() => jumpTo("welcome")}
      className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-sm transition-all text-left">
      <Play size={18} className="text-slate-500" />
      <div>
        <div className="text-xs font-bold">Replay Masterclass</div>
        <div className="text-[10px] text-slate-500">Wisdom deepens with each pass</div>
      </div>
    </button>
  </div>

  <div className="text-center pt-3">
    <p className="text-[11px] text-slate-400 italic">"Your chart is not a sentence. It is a map. And now you can read it."</p>
  </div>
</motion.div>
)}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
