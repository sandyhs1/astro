"use client";

import { motion } from "framer-motion";

const features = [
  { icon: "📍", title: "Exact Timing Windows", desc: "Not vague predictions. Exact months and dates when to act and when to wait." },
  { icon: "🔍", title: "16 Chart Deep Dive", desc: "Shodashavarga — 16 divisional charts analyzed. Career, marriage, wealth, health, all separately." },
  { icon: "📄", title: "100+ Page Report", desc: "Exhaustive, human-written analysis. Not a template. Every word specific to your birth chart." },
  { icon: "🗓️", title: "5-Year Roadmap", desc: "Your upcoming Dasha periods mapped out with actionable strategies for each phase." },
  { icon: "⚡", title: "Crisis Identification", desc: "We flag exactly where you are vulnerable right now and the precise timeline of relief." },
  { icon: "🧭", title: "Career Direction", desc: "Which industries, roles, and work environments align with your chart's planetary strengths." },
];

export default function S11_WhatYouGet() {
  return (
    <section className="relative w-full bg-[#0D0D0D] py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16 md:mb-24">
          <p className="text-white/25 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] mb-6">What You Actually Receive</p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-[clamp(2rem,5vw,4.5rem)] text-white leading-[1.1] tracking-tight">Your complete life audit.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-7 md:p-8 transition-all duration-500 cursor-default">
              <div className="text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <h3 className="font-[family-name:var(--font-cinzel)] text-lg text-white tracking-tight mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm font-[family-name:var(--font-outfit)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
