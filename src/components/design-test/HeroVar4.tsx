"use client";

import { motion } from "framer-motion";

/**
 * HERO VARIATION 4: "The Evidence Wall"
 * 
 * Design: Inspired by high-end consulting decks and forensic evidence boards.
 * A grid of "evidence cards" floats behind a crystal clear central statement.
 * Premium, clean, information-dense but never cluttered.
 */

const evidenceCards = [
  { label: "Saturn Return", note: "Ages 27–30: Career disruption or breakthrough", color: "border-red-500/20" },
  { label: "Rahu Dasha", note: "7-year cycle of obsession and ambition", color: "border-purple-500/20" },
  { label: "Venus Transit", note: "Relationship windows open every 18 months", color: "border-pink-500/20" },
  { label: "Jupiter Cycle", note: "12-year wealth expansion pattern", color: "border-[#FFD700]/20" },
  { label: "Ketu Period", note: "Spiritual detachment and career pivots", color: "border-blue-500/20" },
  { label: "Mars Aspect", note: "Aggression, surgery, or property timing", color: "border-orange-500/20" },
];

export function HeroVar4() {
  return (
    <section className="relative min-h-screen bg-[#080808] overflow-hidden flex items-center justify-center px-6">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,215,0,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Background evidence cards — scattered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-6xl h-[600px]">
          {evidenceCards.map((card, i) => {
            const positions = [
              "top-0 left-0 rotate-[-3deg]",
              "top-4 right-0 rotate-[2deg]",
              "top-1/3 left-[10%] rotate-[-1deg]",
              "top-1/3 right-[5%] rotate-[3deg]",
              "bottom-12 left-[5%] rotate-[1deg]",
              "bottom-8 right-[10%] rotate-[-2deg]",
            ];
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
                className={`absolute ${positions[i]} bg-white/[0.02] backdrop-blur-sm border ${card.color} rounded-lg p-4 md:p-5 w-52 md:w-64 hidden md:block`}
              >
                <div className="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase mb-2">
                  {card.label}
                </div>
                <div className="text-white/15 text-xs leading-relaxed" style={{ fontFamily: "var(--font-manrope)" }}>
                  {card.note}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Center content — clear and dominant */}
      <div className="relative z-10 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
            458 reports delivered this year
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white font-medium"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The planets don&apos;t care <br />
          about your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8D6] to-[#D4AF37] italic">feelings.</span>
          <br />
          <span className="text-white/60">They run on math.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-sm md:text-base text-white/35 leading-relaxed max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Your birth chart contains 16 divisional maps, each revealing a different dimension —
          career, love, wealth, health, purpose.
          <span className="text-[#FFD700]/50"> We decode all of them.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <button className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#080808] font-mono text-xs tracking-[0.2em] uppercase font-bold hover:from-[#FFD700] hover:to-[#D4AF37] transition-all shadow-[0_0_30px_rgba(255,215,0,0.1)]">
            Get My Evidence Report →
          </button>
        </motion.div>

        {/* Mini trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 flex items-center justify-center gap-4 flex-wrap"
        >
          {["Shodashavarga analysis", "Human-interpreted", "No fear tactics"].map((item) => (
            <span key={item} className="text-[10px] font-mono tracking-widest text-white/20 uppercase border border-white/5 px-3 py-1 rounded-full">
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Section label */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/15 tracking-[0.3em] uppercase">
        Variation 04 — The Evidence Wall
      </div>
    </section>
  );
}
