'use client';
import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const lies = [
  "You just made terrible financial choices during a tightening period. We show you when to hoard cash.",
  "You're dating in a 7th house dead zone. Your actual compatibility window opens in 8 months.",
  "The only thing getting promoted is your jeweler's bank balance. What you need is the date your 10th house activates.",
  "Who cares if you're a fiery Aries? You need to know if your startup is launching during a crash cycle."
];

const truths = [
  "Saturn isn't ruining your life.",
  "You haven't met your soulmate because of a dosha.",
  "Wearing a ruby will not get you promoted.",
  "Astrology is about your personality."
];

export default function TruthBombSection() {
  return (
    <section className="py-24 md:py-32 relative" style={{ background: '#FAFAF7' }}>
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection direction="up" className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'hsl(245 60% 28% / 0.1)', color: 'hsl(245,60%,28%)' }}>
            FACT CHECK
          </span>
          <h2 className="text-4xl md:text-6xl font-bold" style={{ color: 'hsl(240,20%,8%)', fontFamily: "'Space Grotesk',sans-serif" }}>
            The lies they tell you.<br />
            <span style={{ background: 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>The truth you need.</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Lies Column */}
          <AnimatedSection direction="left">
            <div className="p-8 rounded-2xl border" style={{ background: 'hsl(5 90% 62% / 0.05)', borderColor: 'hsl(5 90% 62% / 0.2)' }}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'hsl(5,90%,62%)', fontFamily: "'Space Grotesk',sans-serif" }}>
                <X className="w-7 h-7" /> The Lie
              </h3>
              <div className="space-y-4">
                {truths.map((truth, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: 'hsl(5 90% 62% / 0.1)' }}
                  >
                    <X className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'hsl(5,90%,62%)' }} />
                    <span style={{ color: 'hsl(240,20%,8%)', fontWeight: 500 }}>"{truth}"</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Truths Column */}
          <AnimatedSection direction="right">
            <div className="p-8 rounded-2xl border" style={{ background: 'hsl(150 40% 45% / 0.05)', borderColor: 'hsl(150 40% 45% / 0.2)' }}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'hsl(150,40%,45%)', fontFamily: "'Space Grotesk',sans-serif" }}>
                <Check className="w-7 h-7" /> The Reality
              </h3>
              <div className="space-y-4">
                {lies.map((lie, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: 'hsl(150 40% 45% / 0.1)' }}
                  >
                    <Check className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'hsl(150,40%,45%)' }} />
                    <span style={{ color: 'hsl(240,20%,8%)', fontWeight: 500 }}>{lie}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
