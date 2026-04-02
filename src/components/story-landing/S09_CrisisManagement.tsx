"use client";

import { motion } from "framer-motion";

export default function S09_CrisisManagement() {
  const lines = [
    { text: "We don\u2019t sell hope.", highlight: false },
    { text: "We don\u2019t sell gemstones.", highlight: false },
    { text: "We don\u2019t sell rituals.", highlight: false },
    { text: "We sell the truth of your timeline.", highlight: true },
  ];

  return (
    <section className="relative w-full bg-[#0D0D0D] py-32 md:py-44 px-6 overflow-hidden">
      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] pointer-events-none opacity-[0.06]">
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white -translate-x-[0.5px]" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white -translate-y-[0.5px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-10">
        {lines.map((line, i) => (
          <motion.h2 key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`font-[family-name:var(--font-cinzel)] text-[clamp(1.5rem,4.5vw,4rem)] leading-[1.2] tracking-tight ${line.highlight ? "text-[#B8860B]" : "text-white/80"}`}>
            {line.text}
          </motion.h2>
        ))}
      </div>
    </section>
  );
}
