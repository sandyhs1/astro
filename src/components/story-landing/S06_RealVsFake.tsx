"use client";

import { motion } from "framer-motion";

const comparisons = [
  { fake: "\"You have a curse on your family.\"", real: "You have a Saturn transit in your 7th house. It lasts 2.5 years. Here are the exact dates." },
  { fake: "\"Wear this ₹40,000 ring or suffer.\"", real: "Your Venus period starts in March. Channel energy into creative work and partnerships." },
  { fake: "\"Do this ₹51,000 puja or face ruin.\"", real: "Your Rahu-Ketu axis is shifting. Avoid impulsive decisions between June and November." },
  { fake: "\"Your stars say marriage will fail.\"", real: "Your 7th lord is debilitated but gets Neechbhang. Marriage after 28 will be more stable." },
];

export default function S06_RealVsFake() {
  return (
    <section className="relative min-h-screen w-full bg-white py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-[#1a1a1a]/25 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] mb-6">
            Side by Side
          </p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-[clamp(2rem,5vw,4.5rem)] text-[#1a1a1a] leading-[1.1] tracking-tight">
            Noise vs. Signal.
          </h2>
        </motion.div>

        {/* Column Headers */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-6">
          <div className="text-center">
            <span className="inline-block bg-[#C0392B]/10 text-[#C0392B] text-[11px] font-[family-name:var(--font-space)] tracking-[0.3em] uppercase font-bold px-4 py-2 rounded-full">
              What They Say
            </span>
          </div>
          <div className="text-center">
            <span className="inline-block bg-[#27AE60]/10 text-[#27AE60] text-[11px] font-[family-name:var(--font-space)] tracking-[0.3em] uppercase font-bold px-4 py-2 rounded-full">
              What We Say
            </span>
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="space-y-4">
          {comparisons.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="grid grid-cols-2 gap-4 md:gap-8"
            >
              {/* Fake side */}
              <div className="bg-[#FFF5F5] rounded-2xl p-5 md:p-8 border border-[#C0392B]/[0.06] relative overflow-hidden group hover:border-[#C0392B]/20 transition-colors duration-500">
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#C0392B]/30" />
                <p className="text-[#1a1a1a]/70 text-sm md:text-base font-[family-name:var(--font-outfit)] leading-relaxed italic">
                  {row.fake}
                </p>
              </div>

              {/* Real side */}
              <div className="bg-[#F0FFF4] rounded-2xl p-5 md:p-8 border border-[#27AE60]/[0.06] relative overflow-hidden group hover:border-[#27AE60]/20 transition-colors duration-500">
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#27AE60]/30" />
                <p className="text-[#1a1a1a]/70 text-sm md:text-base font-[family-name:var(--font-outfit)] leading-relaxed">
                  {row.real}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
