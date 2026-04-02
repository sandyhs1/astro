"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "I spent ₹3 lakhs on pujas and gemstones over 5 years. Nothing changed. This one report showed me I was acting in the worst possible window of my life. I stopped. I waited. Things shifted in 4 months.",
    name: "Rahul, 34",
    city: "Bangalore",
  },
  {
    quote: "Three different astrologers told me I had Manglik Dosh and would never have a happy marriage. My actual chart showed a Neechbhang Raja Yoga in the 7th house. I got married at 29. We're thriving.",
    name: "Priya, 31",
    city: "Mumbai",
  },
  {
    quote: "I was told to wear a Blue Sapphire worth ₹60,000. I wore it. My business tanked within 2 months. Turns out Saturn was already well-placed in my chart. The gemstone created interference, not support.",
    name: "Arjun, 28",
    city: "Delhi",
  },
];

export default function S13_Testimonials() {
  return (
    <section className="relative min-h-screen w-full bg-[#0D0D0D] py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-white/25 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] mb-6">
            From Real People
          </p>
          <h2 className="font-[family-name:var(--font-cinzel)] text-[clamp(2rem,5vw,4.5rem)] text-white leading-[1.1] tracking-tight">
            Their words. Not ours.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="group relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 md:p-10 hover:border-white/[0.12] transition-all duration-500 flex flex-col"
            >
              {/* Quote mark */}
              <div className="text-[#B8860B]/20 text-6xl font-serif leading-none mb-4">&ldquo;</div>
              
              <p className="text-white/60 text-sm md:text-base font-[family-name:var(--font-outfit)] leading-relaxed flex-1 mb-8">
                {t.quote}
              </p>

              <div className="flex items-center gap-3 pt-6 border-t border-white/[0.06]">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center">
                  <span className="text-[#B8860B] text-sm font-[family-name:var(--font-cinzel)] font-bold">
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-white/80 text-sm font-[family-name:var(--font-outfit)] font-medium">{t.name}</p>
                  <p className="text-white/30 text-xs font-[family-name:var(--font-space)]">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
