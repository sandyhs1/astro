"use client";

import { motion } from "framer-motion";

/**
 * HERO VARIATION 2: "The Split Screen"
 * 
 * Design: Bold asymmetric split — left side is deep dark with the value
 * proposition. Right side is a warm golden gradient with a counter-narrative.
 * The contrast creates visual tension. Clean, modern, high-conversion.
 */

const stats = [
  { value: "16", label: "Vedic divisional charts analyzed" },
  { value: "60+", label: "Pages of decoded intelligence" },
  { value: "4–6h", label: "Human analysis per report" },
];

export function HeroVar2() {
  return (
    <section className="relative min-h-screen bg-[#0A0500] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT — The Dark Truth */}
      <div className="relative flex flex-col justify-center px-8 md:px-16 lg:px-20 py-24 lg:py-0 z-10">
        {/* Subtle vertical line accent */}
        <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#FFD700]/20 to-transparent hidden lg:block" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-[10px] tracking-[0.5em] text-[#FFD700]/50 uppercase block mb-8">
            Not another astrology app.
          </span>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white font-medium mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Most people <br />
            marry wrong, <br />
            invest blind, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8D6] to-[#D4AF37] italic">
              and call it fate.
            </span>
          </h1>

          <p
            className="text-white/35 text-sm md:text-base leading-relaxed max-w-md mb-10"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            What if you could see the pattern before the damage?
            <br />A Vedic life report that tells you <em>when</em> to act, <em>what</em> to avoid,
            and <em>why</em> your timing keeps failing — backed by 5,000 years of mathematical astronomy.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 bg-[#FFD700] text-[#0A0500] font-mono text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#FFF8D6] transition-colors"
          >
            Decode My Timeline →
          </motion.button>
        </motion.div>
      </div>

      {/* RIGHT — The Golden Revelation */}
      <div className="relative flex flex-col justify-center items-center bg-gradient-to-br from-[#1A1200] via-[#12011A] to-[#0A0500] px-8 md:px-16 py-24 lg:py-0 overflow-hidden">
        {/* Abstract warm glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,215,0,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md space-y-10"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + i * 0.2 }}
              className="flex items-baseline gap-6 border-b border-white/5 pb-8"
            >
              <span
                className="text-5xl md:text-7xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-[#B8941F]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stat.value}
              </span>
              <span className="text-white/30 text-xs md:text-sm font-mono tracking-wider uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-12 flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Human-reviewed · No AI fluff
          </span>
        </motion.div>
      </div>

      {/* Section label */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/15 tracking-[0.3em] uppercase z-20">
        Variation 02 — The Split Screen
      </div>
    </section>
  );
}
