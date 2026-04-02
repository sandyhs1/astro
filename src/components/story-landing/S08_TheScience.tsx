"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    label: "Dasha System",
    desc: "Your personal timeline. Which planet is ruling your life right now, and for exactly how long.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 12V24L32 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Divisional Charts",
    desc: "16 magnifying glasses on your life. Career, marriage, wealth, health — each one examined separately.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="6" width="36" height="36" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="6" y1="18" x2="42" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="6" y1="30" x2="42" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="18" y1="6" x2="18" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="30" y1="6" x2="30" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  },
  {
    label: "Transit Analysis",
    desc: "Where the planets are today vs. where they were when you were born. The real-time weather report of your life.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="6" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
        <circle cx="38" cy="30" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    label: "Yogas & Combinations",
    desc: "Special planetary patterns unique to your chart. Your hidden strengths and blind spots.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 6L6 18V36L24 42L42 36V18L24 6Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 6V42M6 18L42 36M42 18L6 36" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      </svg>
    ),
  },
];

export default function S08_TheScience() {
  return (
    <section className="relative min-h-screen w-full bg-[#FAFAF7] py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 md:mb-28 max-w-3xl"
        >
          <p className="text-[#1a1a1a]/25 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] mb-6">
            The Real Framework
          </p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-[clamp(2rem,5vw,4.5rem)] text-[#1a1a1a] leading-[1.1] tracking-tight">
            Not predictions.<br />
            <span className="text-[#B8860B]">Calculations.</span>
          </h2>
        </motion.div>

        {/* Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="group bg-white rounded-3xl border border-[#1a1a1a]/[0.05] p-8 md:p-10 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-500 hover:-translate-y-1 cursor-default"
            >
              <div className="text-[#B8860B] mb-6 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                {p.icon}
              </div>
              <h3 className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl text-[#1a1a1a] tracking-tight mb-3">
                {p.label}
              </h3>
              <p className="text-[#1a1a1a]/50 text-sm md:text-base font-[family-name:var(--font-outfit)] leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
