"use client";

import { motion } from "framer-motion";

export default function S01_Hero() {
  return (
    <section className="relative min-h-screen w-full bg-[#FAFAF7] flex items-center justify-center px-6 py-20 overflow-hidden">
      
      {/* Soft warm gradient orbs */}
      <div className="absolute top-[20%] left-[15%] w-[35vw] h-[35vw] rounded-full bg-[#FFF3E0]/60 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] w-[30vw] h-[30vw] rounded-full bg-[#E8D5B7]/40 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-8 h-[1px] bg-[#1a1a1a]/30" />
          <span className="text-[#1a1a1a]/50 text-[11px] tracking-[0.35em] uppercase font-[family-name:var(--font-space)]">
            Indian Vedic Astrology
          </span>
          <div className="w-8 h-[1px] bg-[#1a1a1a]/30" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-cinzel)] text-[clamp(3rem,8vw,9rem)] leading-[0.9] text-[#1a1a1a] tracking-[-0.02em]"
        >
          Your Astrologer<br />
          <span className="text-[#B8860B]">Is Lying</span>
          <span className="text-[#C0392B]">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-10 text-[#1a1a1a]/60 text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-[family-name:var(--font-outfit)]"
        >
          ₹40,000 Crore industry built on your fear.
          <br />
          <span className="text-[#1a1a1a]/90 font-medium">We&apos;re here to end that.</span>
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a]/30 font-[family-name:var(--font-space)]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-[#1a1a1a]/30 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
