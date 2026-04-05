'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Terminal, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const [counterValue, setCounterValue] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Animate sections appearing one by one
    const timers = [0, 800, 1600, 2400].map((delay, index) =>
      setTimeout(() => setVisibleSections(prev => [...prev, index]), delay)
    );

    // Animate counter
    const counterInterval = setInterval(() => {
      setCounterValue(prev => {
        if (prev >= 56000) {
          clearInterval(counterInterval);
          return 56000;
        }
        return prev + 1000;
      });
    }, 30);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(counterInterval);
    };
  }, []);

  if (!mounted) return null;

  const redactedWords = [
    { original: 'Destiny', replacement: 'Data-Point' },
    { original: 'Blessings', replacement: 'Vector' },
    { original: 'Miracle', replacement: 'Activation Window' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, hsl(240,20%,8%) 0%, hsl(240,25%,12%) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Grid Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(hsl(240,15%,15%) 1px, transparent 1px), linear-gradient(90deg, hsl(240,15%,15%) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        opacity: 0.3,
        pointerEvents: 'none'
      }} />

      {/* Glowing Orbs */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, hsl(30,80%,55%) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, hsl(270,60%,50%) 0%, transparent 70%)', opacity: 0.08, filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'hsl(40,33%,70%)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, marginBottom: 48, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'hsl(30,80%,55%)'}
          onMouseLeave={e => e.currentTarget.style.color = 'hsl(40,33%,70%)'}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Terminal Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'hsl(240,20%,10%)',
            border: '1px solid hsl(240,15%,20%)',
            borderRadius: 16,
            padding: '16px 24px',
            marginBottom: 48,
            fontFamily: 'monospace'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Terminal size={16} color="hsl(30,80%,55%)" />
            <span style={{ color: 'hsl(30,80%,55%)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>SYSTEM BOOT</span>
          </div>
          <div style={{ color: 'hsl(40,33%,70%)', fontSize: '0.875rem', lineHeight: 1.8 }}>
            <div><span style={{ color: 'hsl(120,60%,50%)' }}>{'>'}</span> Loading truth_engine.exe...</div>
            <div><span style={{ color: 'hsl(120,60%,50%)' }}>{'>'}</span> Initializing reality_check_protocol...</div>
            <div><span style={{ color: 'hsl(120,60%,50%)' }}>{'>'}</span> Status: <span style={{ color: 'hsl(30,80%,55%)' }}>OPERATIONAL</span></div>
          </div>
        </motion.div>

        {/* Main Title */}
        <AnimatePresence>
          {visibleSections.includes(0) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: 64 }}
            >
              <h1 style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 800,
                color: 'hsl(40,33%,97%)',
                lineHeight: 1.1,
                marginBottom: 24,
                letterSpacing: '-0.02em'
              }}>
                About <span style={{ 
                  background: 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Quantum Karma</span>
              </h1>
              <div style={{ width: 80, height: 4, background: 'linear-gradient(90deg, hsl(30,80%,55%), transparent)', borderRadius: 2 }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {/* Section 1: The Problem */}
          <AnimatePresence>
            {visibleSections.includes(1) && (
              <ContentSection
                title="The $4.5B Fear Factory"
                content="I spent years watching the astrology industry operate, and I realized it wasn't a science—it was a $4.5 Billion fear factory. I saw people in their 20s and 30s—founders, creators, and professionals—walking into rooms with genuine pain, only to be met with 'Shani is angry' and a ₹50,000 gemstone recommendation. The 'Gurus' weren't reading charts; they were reading insecurities. They were selling 'hope' because hope is a high-margin product."
                delay={0}
              />
            )}
          </AnimatePresence>

          {/* Section 2: The Glitch */}
          <AnimatePresence>
            {visibleSections.includes(2) && (
              <ContentSection
                title="The Glitch"
                content="I stopped looking for 'blessings' and started looking at the Math. Vedic Astrology isn't a religion; it's a Deterministic Coordinate System. The planets are just the hands on a cosmic clock. They don't make things happen; they tell you what time it is."
                highlight="I found the 'Glitch in the Matrix'—the industry was ignoring 90% of the data because it was too hard to explain to the masses. They ignored the D-60 (Shastiamsa) which changes every 120 seconds. They ignored the Bhava Chalit which proves your planets might be in a different house entirely. They chose the easy lie over the complex truth."
                delay={0.2}
              />
            )}
          </AnimatePresence>

          {/* Section 3: The Manifesto */}
          <AnimatePresence>
            {visibleSections.includes(2) && (
              <ContentSection
                title="The Manifesto"
                content="I built Quantum Karma for the people who hate being lied to. We don't do 'vibrations.' We don't do 'daily horoscopes.' We do Life Intelligence. We process over 10,000 data points to reconstruct the exact space-time coordinates of your birth. We provide a surgical audit of your life's hardware."
                bullets={[
                  'If you\'re in a "Dead Zone," we tell you.',
                  'If your relationship is a "Karmic Debt," we show you.',
                  'If your career window is opening in 4 months, we give you the timeframes.'
                ]}
                delay={0.4}
              />
            )}
          </AnimatePresence>

          {/* Section 4: The Bottom Line */}
          <AnimatePresence>
            {visibleSections.includes(3) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{
                  background: 'linear-gradient(135deg, hsl(245,60%,28%) 0%, hsl(270,60%,40%) 50%, hsl(30,80%,55%) 100%)',
                  padding: 48,
                  borderRadius: 24,
                  border: '1px solid hsl(30,80%,55%)',
                  boxShadow: '0 20px 60px -10px rgba(255,130,50,0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                
                <h3 style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 24,
                  letterSpacing: '-0.01em'
                }}>
                  The Bottom Line
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.125rem', lineHeight: 1.8, marginBottom: 24 }}>
                  Fate is for people who are too lazy to read their own data. Strategy is for the people who want to win.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 24 }}>
                  We provide the Tide Chart. Whether you choose to swim with the current or drown fighting it is up to you. But after this report, you can never claim you didn't see the wave coming.
                </p>
                <p style={{ 
                  color: '#fff', 
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  fontFamily: "'Space Grotesk',sans-serif",
                  letterSpacing: '0.02em'
                }}>
                  Stop guessing. Start striking.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Counter Metrics */}
          <AnimatePresence>
            {visibleSections.includes(3) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 24,
                  marginTop: 48
                }}
              >
                <MetricCard
                  label="Total Gemstones Recommended"
                  value="0"
                  color="hsl(0,70%,55%)"
                />
                <MetricCard
                  label="Total Truths Delivered"
                  value={`${counterValue.toLocaleString()}+`}
                  color="hsl(120,60%,50%)"
                  animated
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Signature */}
          <AnimatePresence>
            {visibleSections.includes(3) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                style={{
                  marginTop: 64,
                  paddingTop: 48,
                  borderTop: '1px solid hsl(240,15%,20%)',
                  textAlign: 'center'
                }}
              >
                <p style={{
                  color: 'hsl(40,33%,60%)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 16
                }}>
                  Calculated by Logic. Not by Dogma.
                </p>
                <div style={{
                  fontFamily: "'Brush Script MT', cursive",
                  fontSize: '2.5rem',
                  background: 'linear-gradient(135deg, hsl(30,80%,55%), hsl(270,60%,50%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 400,
                  fontStyle: 'italic'
                }}>
                  Sandesh
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ContentSection({ title, content, highlight, bullets, delay = 0 }: {
  title: string;
  content: string;
  highlight?: string;
  bullets?: string[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      style={{
        background: 'hsl(240,20%,10%)',
        border: '1px solid hsl(240,15%,18%)',
        borderRadius: 20,
        padding: 40,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: 'linear-gradient(180deg, hsl(30,80%,55%), hsl(270,60%,50%))', borderRadius: '4px 0 0 4px' }} />
      
      <h3 style={{
        fontFamily: "'Space Grotesk',sans-serif",
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 800,
        color: 'hsl(40,33%,97%)',
        marginBottom: 20,
        letterSpacing: '-0.01em'
      }}>
        {title}
      </h3>
      
      <p style={{
        color: 'hsl(40,33%,80%)',
        fontSize: '1.05rem',
        lineHeight: 1.8,
        marginBottom: highlight || bullets ? 24 : 0
      }}>
        {content}
      </p>

      {highlight && (
        <div style={{
          background: 'hsl(30,80%,55% / 0.1)',
          border: '1px solid hsl(30,80%,55% / 0.3)',
          borderRadius: 12,
          padding: 20,
          marginTop: 24
        }}>
          <p style={{
            color: 'hsl(30,80%,70%)',
            fontSize: '1rem',
            lineHeight: 1.8,
            fontWeight: 500,
            margin: 0
          }}>
            {highlight}
          </p>
        </div>
      )}

      {bullets && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bullets.map((bullet, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Zap size={16} color="hsl(30,80%,55%)" style={{ marginTop: 4, flexShrink: 0 }} />
              <span style={{ color: 'hsl(40,33%,80%)', fontSize: '1rem', lineHeight: 1.7 }}>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function MetricCard({ label, value, color, animated = false }: {
  label: string;
  value: string;
  color: string;
  animated?: boolean;
}) {
  return (
    <div style={{
      background: 'hsl(240,20%,10%)',
      border: `2px solid ${color}`,
      borderRadius: 16,
      padding: 32,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 50%, ${color}15 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />
      
      <p style={{
        color: 'hsl(40,33%,70%)',
        fontSize: '0.875rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: 12
      }}>
        {label}
      </p>
      
      <p style={{
        fontFamily: "'Space Grotesk',sans-serif",
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: 800,
        color,
        margin: 0,
        lineHeight: 1
      }}>
        {value}
      </p>
    </div>
  );
}
