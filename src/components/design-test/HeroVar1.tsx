"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * HERO VARIATION 1: "The Oracle's Lens"
 * 
 * Design: Ultra-premium editorial feel. Giant serif headline with a circular
 * lens/portal element. Text wraps around the portal. Dark, intimate, high-fashion
 * inspired. Think luxury magazine meets ancient wisdom.
 */

const WORDS = ["Career", "Love", "Wealth", "Health", "Timing"];

export function HeroVar1() {
  const [activeWord, setActiveWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0A0A0A] overflow-hidden flex items-center justify-center">
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,215,0,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12 flex flex-col items-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-8 h-[1px] bg-[#FFD700]" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-[#FFD700]/70 uppercase">
            Vedic Intelligence System
          </span>
          <div className="w-8 h-[1px] bg-[#FFD700]" />
        </motion.div>

        {/* Main headline area with circular portal */}
        <div className="relative flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center leading-[0.95]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="block text-5xl md:text-7xl lg:text-8xl text-white/90 tracking-tight">
              Your next move
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl text-white/90 tracking-tight mt-2 md:mt-4">
              isn&apos;t a <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8D6] to-[#D4AF37]">guess.</span>
            </span>
          </motion.h1>

          {/* Circular portal — the oracle's lens */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-48 h-48 md:w-64 md:h-64 my-10 md:my-14"
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-[#FFD700]/20" />
            {/* Inner ring */}
            <div className="absolute inset-4 rounded-full border border-[#FFD700]/10" />
            {/* Spinning accent */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.15) 60deg, transparent 120deg)",
              }}
            />
            {/* Center rotating word */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                key={activeWord}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="text-[#FFD700] font-mono text-sm md:text-base tracking-[0.3em] uppercase"
              >
                {WORDS[activeWord]}
              </motion.span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center leading-[0.95]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="block text-5xl md:text-7xl lg:text-8xl text-white/90 tracking-tight">
              It&apos;s a <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8D6] to-[#D4AF37]">calculation.</span>
            </span>
          </motion.h1>
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10 md:mt-14 text-center text-sm md:text-base text-white/40 max-w-xl leading-relaxed"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          A 60+ page Vedic intelligence report that maps your career peaks, relationship blind spots, and wealth windows — with the math to prove every claim.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#0A0A0A] font-mono text-xs tracking-[0.2em] uppercase font-bold rounded-none hover:from-[#FFD700] hover:to-[#D4AF37] transition-all shadow-[0_0_40px_rgba(255,215,0,0.15)]"
        >
          Get My Report →
        </motion.button>

        {/* Bottom trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-8 flex items-center gap-6 text-[10px] md:text-xs text-white/25 font-mono tracking-widest uppercase"
        >
          <span>Human-reviewed</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>24h delivery</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>No upsells</span>
        </motion.div>
      </div>

      {/* Section label */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/15 tracking-[0.3em] uppercase">
        Variation 01 — The Oracle&apos;s Lens
      </div>
    </section>
  );
}
