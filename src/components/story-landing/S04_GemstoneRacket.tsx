"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const gems = [
  { name: "Yellow Sapphire", color: "#F4D03F", actualCost: "₹800", sellingPrice: "₹28,000", markup: "3,400%", claim: "Wealth & Career" },
  { name: "Blue Sapphire", color: "#5DADE2", actualCost: "₹1,200", sellingPrice: "₹45,000", markup: "3,650%", claim: "Saturn Protection" },
  { name: "Ruby", color: "#E74C3C", actualCost: "₹600", sellingPrice: "₹35,000", markup: "5,733%", claim: "Sun Power" },
  { name: "Emerald", color: "#27AE60", actualCost: "₹900", sellingPrice: "₹32,000", markup: "3,456%", claim: "Mercury Boost" },
  { name: "Pearl", color: "#D5D5D5", actualCost: "₹200", sellingPrice: "₹12,000", markup: "5,900%", claim: "Moon Healing" },
  { name: "Cat\u0027s Eye", color: "#BDB76B", actualCost: "₹400", sellingPrice: "₹22,000", markup: "5,400%", claim: "Ketu Relief" },
];

export default function S04_GemstoneRacket() {
  return (
    <section className="relative w-full bg-[#0D0D0D] py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }} className="text-center mb-16 md:mb-24">
          <p className="text-white/25 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] mb-6">The Gemstone Racket</p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-[clamp(2rem,5vw,4.5rem)] text-white leading-[1.1] tracking-tight">
            Rocks don&apos;t fix your life.
          </h2>
          <p className="text-white/40 text-sm font-[family-name:var(--font-outfit)] mt-4">Tap to see what your &quot;healer&quot; actually charges.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {gems.map((gem, i) => <GemCard key={i} gem={gem} index={i} />)}
        </div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-16 text-white/15 text-xs font-[family-name:var(--font-space)] tracking-widest uppercase">
          A gemstone is a mineral. Not a business strategy.
        </motion.p>
      </div>
    </section>
  );
}

function GemCard({ gem, index }: { gem: typeof gems[0]; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.7 }}
      onClick={() => setFlipped(!flipped)}
      className="relative aspect-[4/5] md:aspect-square cursor-pointer"
      style={{ perspective: "1000px" }}>
      <div className={`relative w-full h-full transition-transform duration-700`}
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl border border-white/[0.06] bg-white/[0.03] flex flex-col items-center justify-center gap-4 p-6"
          style={{ backfaceVisibility: "hidden" }}>
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full blur-[2px] opacity-60"
            style={{ background: `radial-gradient(circle at 35% 35%, ${gem.color}, transparent)` }} />
          <h3 className="font-[family-name:var(--font-cinzel)] text-white text-lg md:text-xl text-center tracking-tight">{gem.name}</h3>
          <span className="text-white/30 text-xs font-[family-name:var(--font-space)] tracking-widest uppercase">{gem.claim}</span>
          <span className="text-white/20 text-[10px] font-[family-name:var(--font-space)] tracking-widest uppercase mt-2 animate-pulse">Tap to reveal</span>
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-2xl border border-[#C0392B]/20 bg-[#1a0808] flex flex-col items-center justify-center gap-3 p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <span className="text-[#C0392B] text-[11px] tracking-[0.3em] uppercase font-[family-name:var(--font-space)] font-bold">Actual Cost</span>
          <span className="text-white/60 text-2xl font-[family-name:var(--font-outfit)] font-light">{gem.actualCost}</span>
          <div className="w-8 h-[1px] bg-white/10 my-1" />
          <span className="text-[#C0392B] text-[11px] tracking-[0.3em] uppercase font-[family-name:var(--font-space)] font-bold">You Pay</span>
          <span className="text-[#C0392B] text-3xl font-[family-name:var(--font-cinzel)] font-bold">{gem.sellingPrice}</span>
          <span className="bg-[#C0392B]/10 text-[#C0392B] px-3 py-1 rounded-full text-xs font-[family-name:var(--font-space)] tracking-wider font-bold mt-2">↑ {gem.markup} markup</span>
        </div>
      </div>
    </motion.div>
  );
}
