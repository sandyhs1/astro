"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import InitiationModal from "../features/InitiationModal";

export default function S15_FinalCTA() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative min-h-screen w-full bg-[#0D0D0D] flex items-center justify-center py-24 md:py-32 px-6 overflow-hidden">
      
      {/* Radial gold glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vh] h-[50vh] rounded-full bg-[radial-gradient(circle,rgba(184,134,11,0.3)_0%,transparent_70%)] pointer-events-none"
      />

      {/* Grid dots */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "32px 32px"
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#B8860B]/50 text-[11px] tracking-[0.5em] uppercase font-[family-name:var(--font-space)] font-bold mb-10"
        >
          Your Move
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-cinzel)] text-[clamp(3rem,8vw,8rem)] text-white leading-[0.95] tracking-tight mb-6"
        >
          Stop
          <br />
          <span className="text-[#B8860B]">guessing.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-white/30 text-sm md:text-base font-[family-name:var(--font-outfit)] mb-12 max-w-md mx-auto"
        >
          Get the mathematical truth of your birth chart.
          <br />
          No fear. No rituals. No gemstones.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(true)}
          className="group relative inline-flex items-center gap-3 px-10 md:px-14 py-4 md:py-5 bg-[#B8860B] hover:bg-[#D4A017] text-black rounded-full font-[family-name:var(--font-cinzel)] text-sm md:text-base uppercase tracking-[0.2em] font-bold transition-all duration-500 shadow-[0_0_40px_rgba(184,134,11,0.2)] hover:shadow-[0_0_60px_rgba(184,134,11,0.4)]"
        >
          View Your Timeline
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-white/15 text-xs font-[family-name:var(--font-space)] tracking-widest uppercase"
        >
          4–6 hour delivery · Human-written analysis · Refund policy included
        </motion.p>
      </div>

      <InitiationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  );
}
