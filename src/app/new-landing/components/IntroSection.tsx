'use client';
import { motion } from 'framer-motion';
import { Sparkles, Target, Brain, Flame } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const items = [
  { Icon: Target, title: 'Precision Mapping', desc: 'We map your exact activation periods — when your career peaks, when love finds you, when to push and when to pause.', grad: 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))' },
  { Icon: Brain, title: 'Trigger Intelligence', desc: 'Know your psychological triggers before they hit. Understand why you self-sabotage in relationships or panic about money.', grad: 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%))' },
  { Icon: Flame, title: 'Strike Windows', desc: 'Your life has power windows — specific months where everything aligns. We tell you exactly when they are. No fluff.', grad: 'linear-gradient(135deg,hsl(30,80%,55%),hsl(15,85%,58%),hsl(5,90%,62%))' },
];
const heroGrad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';

export default function IntroSection() {
  return (
    <section style={{ padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'hsl(245 60% 28% / 0.03)', filter: 'blur(80px)' }} />
      </div>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 16, background: heroGrad, marginBottom: 24 }}>
              <Sparkles size={32} color="hsl(40,33%,97%)" />
            </motion.div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(2rem,6vw,4.5rem)', fontWeight: 700, color: 'hsl(240,20%,8%)', lineHeight: 1.1, marginBottom: 24 }}>
              Enter <span style={{ background: heroGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Quantum Karma.</span>
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'hsl(240,10%,46%)', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
              Not another astrology app with vague daily horoscopes. This is a{' '}
              <span style={{ color: 'hsl(240,20%,8%)', fontWeight: 600 }}>hyper-personalized life intelligence report</span>{' '}
              that maps your triggers, phases, and activation windows across every domain of life.
            </p>
          </div>
        </AnimatedSection>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 32 }}>
          {items.map(({ Icon, title, desc, grad }, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <motion.div whileHover={{ y: -8 }} style={{ padding: 32, borderRadius: 16, background: '#fff', border: '1px solid hsl(40,15%,88%)', boxShadow: '0 10px 40px -10px hsl(240 20% 8% / 0.08)', height: '100%' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Icon size={24} color="hsl(40,33%,97%)" />
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'hsl(240,20%,8%)', marginBottom: 12 }}>{title}</h3>
                <p style={{ color: 'hsl(240,10%,46%)', lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
