"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * HERO VARIATION 5: "The Manifesto"
 *
 * Design: Full-screen, single-sentence, no-distraction manifesto statement.
 * Like a billboard for the soul. The page itself IS the pitch.
 * Minimal. Confident. Powerful. The whitespace does the heavy lifting.
 */

export function HeroVar5() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const lineWidth = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center px-6"
    >
      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-noise" />

      {/* Top border accent */}
      <motion.div
        style={{ width: lineWidth }}
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700]"
      />

      {/* Core content */}
      <div className="relative z-10 max-w-5xl w-full text-center">
        {/* Upper small text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ y: y2 }}
          className="mb-16 md:mb-20"
        >
          <span className="font-mono text-[10px] tracking-[0.5em] text-white/20 uppercase">
            A report for people who refuse to live on autopilot
          </span>
        </motion.div>

        {/* THE statement — one unforgettable line */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: y1, fontFamily: "var(--font-display)" }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] leading-[1.05] tracking-tight text-white font-medium"
        >
          Stop hoping. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8D6] to-[#D4AF37] italic">
            Start knowing.
          </span>
        </motion.h1>

        {/* Gold separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="w-16 md:w-24 h-[1px] bg-[#FFD700]/40 mx-auto mt-12 md:mt-16 origin-center"
        />

        {/* Supporting text — short, punchy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 md:mt-10 text-sm md:text-lg text-white/30 max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Your Vedic birth chart is a map.
          <br />
          Your life doesn&apos;t have to be trial and error.
        </motion.p>

        {/* CTA — understated but clear */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-12"
        >
          <button className="group relative px-12 py-5 font-mono text-xs tracking-[0.2em] uppercase font-bold text-[#0A0A0A] overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] transition-transform duration-500 group-hover:scale-105" />
            <span className="relative z-10 flex items-center gap-3">
              Read My Chart
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </button>
        </motion.div>

        {/* What you get — elegant list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {[
            { num: "01", text: "Full Shodashavarga decode" },
            { num: "02", text: "Your peak timing windows" },
            { num: "03", text: "Relationship & career vectors" },
          ].map((item) => (
            <div key={item.num} className="text-left sm:text-center">
              <span className="block font-mono text-[10px] text-[#FFD700]/30 tracking-[0.3em] mb-1">
                {item.num}
              </span>
              <span className="text-white/25 text-xs leading-relaxed" style={{ fontFamily: "var(--font-manrope)" }}>
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/15 uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-8 bg-gradient-to-b from-[#FFD700]/20 to-transparent"
        />
      </motion.div>

      {/* Section label */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/15 tracking-[0.3em] uppercase">
        Variation 05 — The Manifesto
      </div>
    </section>
  );
}
