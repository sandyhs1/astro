"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref} className="tabular-nums">{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function S02_TheNumbers() {
  return (
    <section className="relative w-full bg-[#0D0D0D] py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }}
      />
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-white/30 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] text-center mb-16">
          The Uncomfortable Truth
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
          {[
            { number: 40000, suffix: " Cr", prefix: "₹", label: "Drained from wallets every year", sublabel: "on fake rituals and fear-based remedies" },
            { number: 87, suffix: "%", prefix: "", label: "Predictions are recycled nonsense", sublabel: "the same vague lines copy-pasted for everyone" },
            { number: 3, suffix: " Lakh+", prefix: "", label: "Families financially ruined", sublabel: "by gem dealers disguised as spiritual guides" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 md:p-10 hover:bg-white/[0.06] transition-colors duration-500">
              <div className="text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-cinzel)] text-white font-bold tracking-tight mb-6">
                <AnimatedCounter target={stat.number} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <p className="text-white/80 text-base md:text-lg font-[family-name:var(--font-outfit)] font-medium leading-snug mb-2">{stat.label}</p>
              <p className="text-white/35 text-sm font-[family-name:var(--font-outfit)]">{stat.sublabel}</p>
              <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#C0392B]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
          className="text-center mt-16 text-white/20 text-sm font-[family-name:var(--font-outfit)] tracking-wide">
          And you thought it was just a harmless consultation.
        </motion.p>
      </div>
    </section>
  );
}
