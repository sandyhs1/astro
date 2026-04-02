'use client';
import { motion } from 'framer-motion';
import { Check, Zap, Crown } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useOnboarding } from '@/context/OnboardingContext';

const plans = [
  {
    name: 'Essential',
    price: '₹2,399',
    originalPrice: '₹4,999',
    desc: 'The reality check package. Get the exact timelines for your life.',
    icon: Zap,
    features: [
      'Complete Birth Chart Decoding',
      '5-Year Career Trajectory',
      'Relationship Karma & Timing',
      'Wealth Activation Periods',
      'Private PDF Download',
    ],
    popular: false,
    accentColor: 'hsl(245,60%,55%)',
  },
  {
    name: 'Complete Reality Check',
    price: '₹4,799',
    originalPrice: '₹9,999',
    desc: 'For those who want zero surprises. Every single detail mapped out.',
    icon: Crown,
    features: [
      'Everything in Essential',
      'Psychological Shadow Work',
      'Customized Action Plan',
      'Human-Verified Analysis',
      'Priority delivery options',
    ],
    popular: true,
    accentColor: 'hsl(30,80%,55%)',
  },
];

export default function PricingSection() {
  const { openModal } = useOnboarding();
  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';

  return (
    <section id="pricing" style={{ padding: '6rem 1.5rem', background: 'hsl(240,20%,8%)', position: 'relative', overflow: 'hidden' }}>
      {/* BG blobs */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 50%, hsl(245,60%,50%), transparent 50%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 50%, hsl(30,80%,55%), transparent 50%)' }} />
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ display: 'inline-block', padding: '0.375rem 1rem', borderRadius: 999, background: 'hsl(30 80% 55% / 0.2)', color: 'hsl(30,80%,55%)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 16 }}>
              PRICING
            </span>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(2rem,5vw,3.25rem)', fontWeight: 700, color: 'hsl(40,33%,97%)', lineHeight: 1.1 }}>
              Less than one gemstone.<br />
              <span style={{ color: 'hsl(30,80%,55%)' }}>More than every astrologer.</span>
            </h2>
            <p style={{ color: 'hsl(40 33% 97% / 0.6)', fontSize: '1.0625rem', marginTop: 16 }}>
              One report. No subscriptions. No upsells. No "wear this ring and come back next week."
            </p>
          </div>
        </AnimatedSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, padding: '0 10px' }}>
          {plans.map((p, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -6 }}
                style={{
                  position: 'relative',
                  padding: '24px 28px',
                  borderRadius: 16,
                  border: p.popular ? `2px solid ${p.accentColor}` : '2px solid hsl(240,15%,22%)',
                  background: p.popular ? 'hsl(40 33% 97% / 0.07)' : 'hsl(40 33% 97% / 0.03)',
                  backdropFilter: 'blur(4px)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: p.popular ? `0 0 40px -10px ${p.accentColor}40` : 'none',
                }}
              >
                {p.popular && (
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 16px',
                    borderRadius: 999,
                    background: grad,
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: p.popular ? grad : 'hsl(240,15%,20%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <p.icon size={20} color={p.popular ? '#fff' : 'hsl(30,80%,55%)'} />
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.25rem', fontWeight: 700, color: 'hsl(40,33%,97%)' }}>
                    {p.name}
                  </h3>
                  <p style={{ color: 'hsl(40 33% 97% / 0.55)', marginTop: 4, fontSize: '0.875rem', lineHeight: 1.4 }}>
                    {p.desc}
                  </p>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '2.25rem', fontWeight: 700, color: 'hsl(40,33%,97%)' }}>
                    {p.price}
                  </span>
                  <span style={{ color: 'hsl(40 33% 97% / 0.35)', textDecoration: 'line-through', marginLeft: 8, fontSize: '1rem' }}>
                    {p.originalPrice}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, flexGrow: 1 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: p.popular ? grad : 'hsl(240,15%,20%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Check size={10} color={p.popular ? '#fff' : 'hsl(30,80%,55%)'} />
                      </div>
                      <span style={{ color: 'hsl(40 33% 97% / 0.8)', fontSize: '0.8125rem', lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openModal}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: 10,
                    background: p.popular ? grad : 'transparent',
                    border: p.popular ? 'none' : '2px solid hsl(240,15%,30%)',
                    color: p.popular ? 'hsl(40,33%,97%)' : 'hsl(40 33% 97% / 0.7)',
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                >
                  Get Your Report Now →
                </motion.button>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Trust note */}
        <AnimatedSection delay={0.3}>
          <p style={{ textAlign: 'center', marginTop: 40, fontSize: '0.875rem', color: 'hsl(40 33% 97% / 0.35)', fontFamily: 'var(--font-mono), monospace' }}>
            Limited to 52 reports/day to maintain human verification standards. · No refunds on karma.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
