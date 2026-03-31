"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * HERO VARIATION 3: "The Countdown"
 * 
 * Design: Creates urgency and scarcity. A massive real-time ticker shows life
 * passing by. Combined with a clean, centered proclamation. The psychological
 * hook is: "You're wasting time without a map."
 */

function useLifeCounter() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Simulate seconds of life wasted without a strategy
    const start = Date.now();
    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return seconds;
}

export function HeroVar3() {
  const seconds = useLifeCounter();

  return (
    <section className="relative min-h-screen bg-[#060606] overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#FFD700_1px,transparent_1px),linear-gradient(to_bottom,#FFD700_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Top-left floating context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-8 left-8 md:top-12 md:left-12"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#FFD700]/40 uppercase">
            Live · Your session
          </span>
        </div>
      </motion.div>

      {/* The counter — massive */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-10 md:mb-14"
      >
        <div className="text-[#FFD700]/10 text-[120px] md:text-[200px] lg:text-[280px] font-mono font-bold leading-none select-none tabular-nums">
          {String(seconds).padStart(3, "0")}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] md:text-xs text-[#FFD700]/40 tracking-[0.5em] uppercase">
            Seconds on this page without clarity
          </span>
        </div>
      </motion.div>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-center text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white font-medium max-w-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        You wouldn&apos;t drive blind. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8D6] to-[#D4AF37] italic">
          Why are you living blind?
        </span>
      </motion.h1>

      {/* Sub-copy */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center text-sm md:text-base text-white/35 max-w-lg leading-relaxed"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        Every major decision you&apos;ve made — career moves, relationships, investments —
        had a planetary signature. You just couldn&apos;t read it. Until now.
      </motion.p>

      {/* Dual CTA row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
      >
        <button className="px-10 py-4 bg-[#FFD700] text-[#060606] font-mono text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#FFF8D6] transition-colors">
          Show Me My Blind Spots →
        </button>
        <button className="px-10 py-4 border border-white/10 text-white/40 font-mono text-xs tracking-[0.2em] uppercase hover:border-[#FFD700]/30 hover:text-[#FFD700]/60 transition-colors">
          See Sample Report
        </button>
      </motion.div>

      {/* Bottom strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 flex items-center gap-8 text-[10px] text-white/20 font-mono tracking-widest uppercase"
      >
        <span>₹4,799 / $97</span>
        <span className="w-1 h-1 rounded-full bg-white/15" />
        <span>60+ pages</span>
        <span className="w-1 h-1 rounded-full bg-white/15" />
        <span>Delivered in 24h</span>
      </motion.div>

      {/* Section label */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/15 tracking-[0.3em] uppercase">
        Variation 03 — The Countdown
      </div>
    </section>
  );
}
