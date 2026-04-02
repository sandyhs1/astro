"use client";

import { motion } from "framer-motion";

export default function S12_TheMirror() {
  return (
    <section className="relative w-full bg-[#F5F0EB] py-32 md:py-44 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full text-center">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-[#1a1a1a]/20 text-[11px] tracking-[0.4em] uppercase font-[family-name:var(--font-space)] mb-12">
          The Mirror
        </motion.p>

        <div className="space-y-8 md:space-y-10">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-[family-name:var(--font-cormorant)] text-2xl md:text-4xl lg:text-5xl text-[#1a1a1a]/80 leading-snug italic">
            Where were you two years ago?
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-[family-name:var(--font-cormorant)] text-2xl md:text-4xl lg:text-5xl text-[#1a1a1a]/60 leading-snug italic">
            Where are you right now?
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-[family-name:var(--font-cormorant)] text-2xl md:text-4xl lg:text-5xl text-[#C0392B] leading-snug italic">
            Is there actually a difference?
          </motion.p>
        </div>

        <div className="my-12 md:my-16 w-full h-[1px] bg-[#1a1a1a]/10" />

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.3 }} className="max-w-2xl mx-auto">
          <p className="font-[family-name:var(--font-outfit)] text-[#1a1a1a]/60 text-base md:text-lg leading-relaxed">
            If you&apos;re being honest, the answer stings. Same struggles. Same confusion. Same frustration. Different calendar year.
          </p>
          <p className="font-[family-name:var(--font-cinzel)] text-[#1a1a1a] text-xl md:text-2xl mt-6 tracking-tight">
            Something has to change.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
