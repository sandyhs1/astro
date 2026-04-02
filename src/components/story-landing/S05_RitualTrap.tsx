"use client";

import { motion } from "framer-motion";

const rituals = [
  { name: "Navagraha Puja", price: "₹11,000", icon: "🔥", time: "3 hours" },
  { name: "Rudrabhishek", price: "₹21,000", icon: "💧", time: "4 hours" },
  { name: "Kalsarp Shanti", price: "₹51,000", icon: "🐍", time: "Full day" },
  { name: "Mahamrityunjay Jaap", price: "₹31,000", icon: "📿", time: "7 days" },
  { name: "Baglamukhi Puja", price: "₹1,10,000", icon: "⚡", time: "11 days" },
];

export default function S05_RitualTrap() {
  return (
    <section className="relative w-full bg-[#F5F0EB] py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[#1a1a1a]/25 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] mb-4">
              The Ritual Marketplace
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-[family-name:var(--font-cinzel)] text-[clamp(2rem,4.5vw,4rem)] text-[#1a1a1a] leading-[1.1] tracking-tight">
              Your fear has a price list.
            </motion.h2>
          </div>
          <p className="text-[#1a1a1a]/40 text-sm font-[family-name:var(--font-outfit)] max-w-xs">
            Each ritual stacks up. Watch your wallet empty.
          </p>
        </div>

        {/* Stacking cards */}
        <div className="space-y-4">
          {rituals.map((ritual, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl border border-[#1a1a1a]/[0.06] p-6 md:p-8 flex items-center gap-6 md:gap-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl md:text-4xl flex-shrink-0">{ritual.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-[family-name:var(--font-cinzel)] text-lg md:text-xl text-[#1a1a1a] tracking-tight truncate">{ritual.name}</h3>
                <p className="text-[#1a1a1a]/40 text-sm font-[family-name:var(--font-outfit)]">{ritual.time}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[#C0392B] text-xl md:text-2xl font-[family-name:var(--font-cinzel)] font-bold">{ritual.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-[#1a1a1a] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white/40 text-xs font-[family-name:var(--font-space)] tracking-widest uppercase mb-1">Total Damage</p>
            <p className="text-white text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] font-bold">₹2,24,000</p>
          </div>
          <div className="md:text-right">
            <p className="text-white/30 text-xs font-[family-name:var(--font-space)] tracking-wider uppercase mb-1">Result</p>
            <p className="text-[#C0392B] text-lg font-[family-name:var(--font-outfit)] font-medium">Nothing changed.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
