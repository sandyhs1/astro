'use client';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

export default function SavageQuoteSection() {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden" style={{ background: '#FAFAF7' }}>
      <div className="max-w-5xl mx-auto px-6 text-center">
        <AnimatedSection>
          <motion.blockquote
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="font-display text-3xl md:text-6xl lg:text-7xl font-bold leading-tight" style={{ color: 'hsl(240,20%,8%)', fontFamily: "'Space Grotesk',sans-serif" }}>
              "Astrology doesn't predict the future.{" "}
              <span style={{ background: 'linear-gradient(135deg,hsl(30,80%,55%),hsl(15,85%,58%),hsl(5,90%,62%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>It calculates the math of your life."</span>
            </p>
            <footer className="text-lg" style={{ color: 'hsl(240,10%,46%)' }}>
              — The planets are just a clock. We just read the time.
            </footer>
          </motion.blockquote>
        </AnimatedSection>
      </div>
    </section>
  );
}
