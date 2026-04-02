"use client";

import { motion } from "framer-motion";

export default function S14_TwoPaths() {
  return (
    <section className="relative min-h-screen w-full bg-white py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-[#1a1a1a]/25 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] mb-6">
            Your Call
          </p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-[clamp(2rem,5vw,4.5rem)] text-[#1a1a1a] leading-[1.1] tracking-tight">
            Two paths. One decision.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          
          {/* Path 1 — Ignore */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative rounded-3xl overflow-hidden border border-[#1a1a1a]/[0.06] hover:border-[#C0392B]/20 transition-colors duration-500"
          >
            <div className="bg-[#FAFAF7] p-8 md:p-12 h-full flex flex-col">
              {/* Visual */}
              <div className="w-full aspect-[3/2] rounded-2xl bg-[#F5F0EB] flex items-center justify-center mb-8 relative overflow-hidden">
                <svg viewBox="0 0 200 120" fill="none" className="w-3/4 opacity-40">
                  {/* Infinite loop */}
                  <path d="M50 60C50 40 70 30 90 40C110 50 130 50 150 40C170 30 170 70 150 80C130 90 110 90 90 80C70 70 50 80 50 60Z" stroke="#C0392B" strokeWidth="2" fill="none" />
                  <circle cx="50" cy="60" r="4" fill="#C0392B" fillOpacity="0.5" />
                  {/* Arrow on path */}
                  <path d="M145 42L150 38L148 44" stroke="#C0392B" strokeWidth="1.5" fill="none" />
                </svg>
                <span className="absolute bottom-3 right-3 text-[#C0392B]/30 text-[10px] font-[family-name:var(--font-space)] tracking-widest uppercase">Repeating</span>
              </div>

              <h3 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-[#1a1a1a] tracking-tight mb-4">
                Keep guessing.
              </h3>
              <p className="text-[#1a1a1a]/50 text-sm font-[family-name:var(--font-outfit)] leading-relaxed mb-6 flex-1">
                Same cycle. Same confusion. Same frustration. Scroll away and revisit this page in 2 years when nothing has changed.
              </p>
              <div className="text-[#C0392B]/40 text-xs font-[family-name:var(--font-space)] tracking-widest uppercase">
                Cost: Another 2 years
              </div>
            </div>
          </motion.div>

          {/* Path 2 — Act */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative rounded-3xl overflow-hidden border border-[#1a1a1a]/[0.06] hover:border-[#27AE60]/20 transition-colors duration-500"
          >
            <div className="bg-[#FAFAF7] p-8 md:p-12 h-full flex flex-col">
              {/* Visual */}
              <div className="w-full aspect-[3/2] rounded-2xl bg-[#F0FFF4] flex items-center justify-center mb-8 relative overflow-hidden">
                <svg viewBox="0 0 200 120" fill="none" className="w-3/4 opacity-40">
                  {/* Upward trajectory */}
                  <path d="M30 100C50 90 70 85 90 70C110 55 130 35 170 20" stroke="#27AE60" strokeWidth="2" fill="none" />
                  <circle cx="170" cy="20" r="4" fill="#27AE60" fillOpacity="0.5" />
                  {/* Arrowhead */}
                  <path d="M163 25L170 20L165 14" stroke="#27AE60" strokeWidth="1.5" fill="none" />
                  {/* Dotted markers */}
                  {[30, 90, 130].map((x, i) => (
                    <line key={i} x1={x} y1={100 - i * 30} x2={x} y2={110} stroke="#27AE60" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
                  ))}
                </svg>
                <span className="absolute bottom-3 right-3 text-[#27AE60]/30 text-[10px] font-[family-name:var(--font-space)] tracking-widest uppercase">Ascending</span>
              </div>

              <h3 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-[#1a1a1a] tracking-tight mb-4">
                Know your timeline.
              </h3>
              <p className="text-[#1a1a1a]/50 text-sm font-[family-name:var(--font-outfit)] leading-relaxed mb-6 flex-1">
                Get the map. See the exact cycles affecting you right now. Make every decision with full awareness of your personal timing.
              </p>
              <div className="text-[#27AE60]/60 text-xs font-[family-name:var(--font-space)] tracking-widest uppercase font-bold">
                Starts today →
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
