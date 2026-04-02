"use client";

import { motion } from "framer-motion";

const milestones = [
  { year: "3000 BCE", title: "Rig Veda", desc: "First astronomical observations recorded in hymns." },
  { year: "1500 BCE", title: "Jyotish Vedanga", desc: "Astrology codified as one of six limbs of the Vedas." },
  { year: "500 BCE", title: "Brihat Parashara", desc: "Sage Parashara writes the foundational text of Vedic Astrology." },
  { year: "200 CE", title: "Yavanajataka", desc: "Cross-cultural astronomical exchange refines calculation methods." },
  { year: "550 CE", title: "Varahamihira", desc: "Brihat Jataka — systematized predictive methods still used today." },
  { year: "2025", title: "Now", desc: "Same mathematics. Zero fear tactics. Pure interpretation." },
];

export default function S07_Timeline() {
  return (
    <section className="relative w-full bg-[#1A1510] py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-[#B8860B]/[0.06] blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-20 md:mb-28">
          <p className="text-[#B8860B]/50 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] mb-6">Not New Age. Ancient Age.</p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-[clamp(2.5rem,6vw,5rem)] text-[#F5F0EB] leading-[1.1] tracking-tight">
            5,000 years of<br /><span className="text-[#B8860B]">mathematics.</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-[#B8860B]/20 md:-translate-x-[0.5px]" />
          <div className="space-y-12 md:space-y-16">
            {milestones.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`relative flex items-start gap-8 ${i % 2 === 0 ? "md:flex-row pl-12 md:pl-0 md:pr-[calc(50%+2rem)]" : "md:flex-row-reverse pl-12 md:pl-[calc(50%+2rem)] md:pr-0"}`}>
                <div className="absolute left-[11px] md:left-1/2 top-1 w-[10px] h-[10px] rounded-full bg-[#1A1510] border-2 border-[#B8860B] md:-translate-x-[5px] z-10" />
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <span className="text-[#B8860B] font-[family-name:var(--font-space)] text-sm font-bold tracking-wider">{m.year}</span>
                  <h3 className="font-[family-name:var(--font-cinzel)] text-xl md:text-2xl text-[#F5F0EB] mt-2 tracking-tight">{m.title}</h3>
                  <p className="text-[#F5F0EB]/40 text-sm font-[family-name:var(--font-outfit)] mt-2 leading-relaxed">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
