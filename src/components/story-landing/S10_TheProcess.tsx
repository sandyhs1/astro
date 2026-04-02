"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Your Birth Map",
    desc: "Your exact birth time, date, and location. That's all we need. No guessing, no cold reading, no leading questions.",
    visual: (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
        <circle cx="100" cy="100" r="80" stroke="#B8860B" strokeWidth="0.5" opacity="0.3" />
        <circle cx="100" cy="100" r="60" stroke="#B8860B" strokeWidth="0.5" opacity="0.2" />
        <circle cx="100" cy="100" r="40" stroke="#B8860B" strokeWidth="0.5" opacity="0.15" />
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="100" y1="100" x2={100 + 80 * Math.cos((i * 30 * Math.PI) / 180)} y2={100 + 80 * Math.sin((i * 30 * Math.PI) / 180)} stroke="#B8860B" strokeWidth="0.5" opacity="0.15" />
        ))}
        <circle cx="140" cy="60" r="4" fill="#B8860B" fillOpacity="0.6" />
        <circle cx="65" cy="75" r="3" fill="#B8860B" fillOpacity="0.4" />
        <circle cx="120" cy="145" r="5" fill="#B8860B" fillOpacity="0.5" />
        <circle cx="55" cy="130" r="3.5" fill="#B8860B" fillOpacity="0.3" />
        <circle cx="100" cy="45" r="3" fill="#B8860B" fillOpacity="0.7" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Deep Analysis",
    desc: "We study your Dasha periods, divisional charts, transits, and planetary yogas. Every angle. Every blind spot.",
    visual: (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
        <circle cx="90" cy="85" r="45" stroke="#B8860B" strokeWidth="1.5" opacity="0.5" />
        <line x1="123" y1="118" x2="160" y2="155" stroke="#B8860B" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <line x1="70" y1="75" x2="110" y2="75" stroke="#B8860B" strokeWidth="1" opacity="0.3" />
        <line x1="70" y1="85" x2="105" y2="85" stroke="#B8860B" strokeWidth="1" opacity="0.3" />
        <line x1="70" y1="95" x2="100" y2="95" stroke="#B8860B" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Your Strategy",
    desc: "A clear, actionable life report. What to do, when to do it, what to avoid, and exactly how long each phase lasts.",
    visual: (
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
        <rect x="50" y="30" width="100" height="140" rx="8" stroke="#B8860B" strokeWidth="1" opacity="0.4" />
        <line x1="70" y1="60" x2="130" y2="60" stroke="#B8860B" strokeWidth="1.5" opacity="0.3" />
        <line x1="70" y1="75" x2="130" y2="75" stroke="#B8860B" strokeWidth="1" opacity="0.2" />
        <line x1="70" y1="90" x2="120" y2="90" stroke="#B8860B" strokeWidth="1" opacity="0.2" />
        <path d="M72 120L78 126L90 114" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        <path d="M72 138L78 144L90 132" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      </svg>
    ),
  },
];

export default function S10_TheProcess() {
  return (
    <section className="relative w-full bg-white py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-14 md:mb-20">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-[#1a1a1a]/25 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] mb-4">
            How It Works
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-[family-name:var(--font-cinzel)] text-[clamp(1.8rem,4vw,3.5rem)] text-[#1a1a1a] leading-[1.1] tracking-tight">
            Three steps. Zero nonsense.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="bg-[#FAFAF7] rounded-3xl p-8 md:p-10 border border-[#1a1a1a]/[0.04] hover:shadow-xl hover:shadow-black/[0.04] hover:-translate-y-2 transition-all duration-500">
              <div className="w-full aspect-square max-w-[140px] mx-auto mb-8 opacity-60">{step.visual}</div>
              <span className="text-[#B8860B]/40 font-[family-name:var(--font-space)] text-sm font-bold tracking-wider mb-3 block">{step.num}</span>
              <h3 className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl text-[#1a1a1a] tracking-tight mb-3">{step.title}</h3>
              <p className="text-[#1a1a1a]/50 text-sm font-[family-name:var(--font-outfit)] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
