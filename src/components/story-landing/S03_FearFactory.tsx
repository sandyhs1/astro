"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const fearCards = [
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <circle cx="32" cy="32" r="28" stroke="#C0392B" strokeWidth="1.5" />
        <path d="M32 18V38M26 32L32 38L38 32" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="46" r="2" fill="#C0392B" />
      </svg>
    ),
    title: "Kalsarp Dosh",
    hook: "\"Your entire life is cursed.\"",
    reality: "A chart pattern found in 33% of all people. Not a curse. Just geometry.",
    price: "Remedy cost: ₹21,000 – ₹1,50,000"
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <path d="M32 8L8 24V48L32 56L56 48V24L32 8Z" stroke="#E67E22" strokeWidth="1.5" />
        <path d="M32 28L24 32V40L32 44L40 40V32L32 28Z" fill="#E67E22" fillOpacity="0.2" stroke="#E67E22" strokeWidth="1.5" />
      </svg>
    ),
    title: "Manglik Dosh",
    hook: "\"Your marriage will destroy your partner.\"",
    reality: "50% of all charts are Manglik. Half the planet would be unmarriageable.",
    price: "Remedy cost: ₹11,000 – ₹51,000"
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <circle cx="32" cy="32" r="20" stroke="#8E44AD" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="32" cy="32" r="10" stroke="#8E44AD" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="3" fill="#8E44AD" />
      </svg>
    ),
    title: "Shani Sade Sati",
    hook: "\"7.5 years of guaranteed suffering.\"",
    reality: "Everyone goes through it. Multiple times. It's a growth cycle, not a death sentence.",
    price: "Remedy cost: ₹5,000 – ₹2,00,000"
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <path d="M16 48C16 48 24 32 32 32C40 32 48 48 48 48" stroke="#2ECC71" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="22" r="8" stroke="#2ECC71" strokeWidth="1.5" />
        <path d="M28 22L32 26L36 22" stroke="#2ECC71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Pitra Dosh",
    hook: "\"Your dead ancestors are angry.\"",
    reality: "Emotional manipulation at its finest. Your grandparents aren't plotting against you.",
    price: "Remedy cost: ₹15,000 – ₹5,00,000"
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <rect x="14" y="14" width="36" height="36" rx="4" stroke="#F39C12" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="4" fill="#F39C12" fillOpacity="0.3" stroke="#F39C12" strokeWidth="1.5" />
      </svg>
    ),
    title: "Vastu Defects",
    hook: "\"Your house direction is killing your wealth.\"",
    reality: "You could rotate your bed 47 times. Your EMI will still be the same.",
    price: "Remedy cost: ₹25,000 – ₹10,00,000"
  },
];

export default function S03_FearFactory() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full bg-[#FAFAF7] py-24 md:py-32 overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-16 mb-10 md:mb-14">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-[#1a1a1a]/30 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] mb-4">
          The Fear Factory
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-[family-name:var(--font-cinzel)] text-[clamp(2rem,5vw,4.5rem)] text-[#1a1a1a] leading-[1.1] tracking-tight">
          Scare them first.<br />
          <span className="text-[#C0392B]">Sell them the cure.</span>
        </motion.h2>
      </div>

      {/* Horizontal scroll cards — native CSS overflow scroll */}
      <div ref={scrollRef}
        className="flex gap-6 md:gap-8 pl-6 md:pl-16 pr-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {fearCards.map((card, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group flex-shrink-0 w-[85vw] md:w-[380px] bg-white rounded-3xl border border-[#1a1a1a]/[0.06] p-8 md:p-10 flex flex-col gap-5 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 hover:-translate-y-2 snap-start">
            <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-500">{card.icon}</div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-[#1a1a1a] tracking-tight">{card.title}</h3>
            <p className="text-[#C0392B] text-base font-[family-name:var(--font-outfit)] font-medium italic leading-snug">{card.hook}</p>
            <div className="w-full h-[1px] bg-[#1a1a1a]/10" />
            <p className="text-[#1a1a1a]/60 text-sm font-[family-name:var(--font-outfit)] leading-relaxed flex-1">{card.reality}</p>
            <div className="bg-[#FFF5F5] rounded-xl px-4 py-3 border border-[#C0392B]/10">
              <p className="text-[#C0392B]/80 text-xs font-[family-name:var(--font-space)] tracking-wider font-medium">{card.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
