'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, X, ChevronRight, MessageCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useOnboarding } from '@/context/OnboardingContext';

// ─── DATA ───────────────────────────────────────────────────────────────────

const essentialFeatures = [
  { badge: 'Shodashavarga', title: 'Complete Structural Audit', detail: 'A foundational breakdown of your physical & psychological hardware (D-1 to D-16).' },
  { badge: 'Dashas', title: '3-Year Premium Trajectory', detail: 'Quarterly mapping of "Push" vs. "Pause" phases in your professional growth.' },
  { badge: '7th House', title: 'Relationship Red-Flags', detail: 'Identification of recurring toxic patterns in your partnerships.' },
  { badge: 'Transit', title: '12-Month Crisis Map', detail: 'Month-by-month risk assessment for health, finance, and conflict.' },
  { badge: 'Antardasha', title: 'Transition Impact Reports', detail: 'Analyzing major time-period shifts with surgical precision.' },
  { badge: 'Ashtakvarga', title: 'Planetary "Energy Budget"', detail: 'A numerical table showing exactly how much fuel you have for specific tasks.' },
  { badge: 'Remedies', title: 'Personalized Neutralizations', detail: 'Action-based protocols (no expensive stones, no rituals).' },
  { badge: '6th House', title: 'The "Hidden Enemy" Audit', detail: 'Identifying triggers that manifest as workplace sabotage or legal friction.' },
  { badge: 'Dhana Yoga', title: 'Wealth Activation Windows', detail: 'Pinpointing the exact months your wealth houses are most potent.' },
  { badge: 'Dossier', title: 'Private PDF Delivery', detail: 'A clean, data-heavy executive report delivered in 24 hours.' },
];

const completePreviewFeatures = [
  { badge: 'Essential', title: 'Everything in Essential Plan', detail: 'Plus all the advanced features below.' },
  { badge: 'Shastiamsa', title: 'Full D-60 Timeline Analysis', detail: 'The most critical chart revealing past-life baggage.' },
  { badge: 'Upapada Lagna', title: 'Marriage & Separation Timelines', detail: 'Predicting the exact quality and duration of unions.' },
  { badge: 'Shadow Work', title: 'Deep Trauma Coding', detail: 'Using Saturn/Ketu to identify subconscious self-sabotage loops.' },
  { badge: 'Strategy', title: 'Corporate Scaling Strategy', detail: 'When to launch, when to scale, and when to exit.' },
  { badge: 'Support', title: '3 WhatsApp Follow-Ups', detail: 'Human-verified, data-driven answers (valid for 7 days).' },
  { badge: 'Priority', title: '12-Hour Emergency Delivery', detail: 'Internally prioritised for immediate clarity.' },
  { badge: 'App', title: '6 Months YNTRA WebApp', detail: 'Early free access to our upcoming Webapp.*' },
];

const completeFullSections = [
  {
    title: 'I. Advanced Predicative Data',
    items: [
      { badge: 'Shastiamsa', title: 'Full D-60 Timeline Analysis', detail: 'The most critical chart that reveals past-life baggage and the "why" behind current struggles.' },
      { badge: 'Upapada Lagna', title: 'Marriage & Separation Timelines', detail: 'Predicting the exact quality and duration of unions.' },
      { badge: 'Real-Estate', title: 'Property Windows', detail: 'Data on when to buy, sell, or avoid land disputes.' },
      { badge: 'Speculation', title: 'Stock Market Risk Profile', detail: 'Your innate planetary "speculation" score.' },
      { badge: 'Lineage', title: 'Generational Curse (Rina) Decoding', detail: 'Identifying inherited ancestral patterns using the 9th house and Rahu/Ketu.' },
      { badge: 'Migration', title: 'Foreign Settlement Probability', detail: 'Analysis of the 4th, 9th, and 12th houses for migration data.' },
      { badge: '6th House', title: 'Litigation & Conflict Risk', detail: 'Mapping periods where the 6th house is under siege.' },
      { badge: 'Progeny', title: 'Legacy Karma Timeline', detail: 'Timeline for children and the energetic impact on your career.' },
    ],
  },
  {
    title: 'II. Psychological & Shadow Work',
    items: [
      { badge: 'Subconscious', title: 'Deep Shadow Work', detail: 'Using Saturn and Ketu to identify subconscious self-sabotage loops.' },
      { badge: 'Patterns', title: 'Recurring Life Loops', detail: 'Highlighting why you keep dating the same person or losing the same job.' },
      { badge: 'Atmakaraka', title: '"Soul Source Code"', detail: 'Your primary life lesson and how to stop fighting it.' },
      { badge: 'Mental Reset', title: 'Ego-Dissolution Windows', detail: 'Identifying periods for spiritual reset and mental health prioritisation.' },
      { badge: 'Nadi-Amsa', title: 'Sub-breath Destiny Discovery', detail: 'Using Nadi systems to find the specific "sub-breath" of your destiny.' },
    ],
  },
  {
    title: 'III. Strategic Business & Scaling',
    items: [
      { badge: 'Strategy', title: 'Corporate Scaling', detail: 'When to launch, when to scale, and when to exit.' },
      { badge: 'Arudha Lagna', title: 'Hiring/Partnership Compatibility', detail: 'Knowing who will actually help your public image.' },
      { badge: 'Competition', title: 'Rival Vulnerability Windows', detail: 'Knowing when your rivals are in a weakening cycle.' },
      { badge: 'Authority', title: 'Leadership Style Audit', detail: 'Analysis of your Sun/Mars strength for authority management.' },
    ],
  },
  {
    title: 'IV. Technical & Interactive Support',
    items: [
      { badge: 'Support', title: '3 WhatsApp Follow-Ups', detail: 'Human-verified, data-driven answers (valid for 7 days).' },
      { badge: 'Priority', title: '12-Hour Emergency Delivery', detail: 'Internally prioritised for immediate clarity.' },
      { badge: 'App', title: '6 Months YNTRA WebApp', detail: 'Early free access to our upcoming Webapp.*' },
      { badge: 'Alerts', title: 'Monthly "Transit Watch"', detail: '3 months of notifications for major planetary shifts (e.g., Saturn Retrograde).' },
    ],
  },
  {
    title: 'V. The "Grand Master" Secrets',
    items: [
      { badge: 'Mandi', title: 'Gulika Poison Points', detail: 'Identifying the "invisible" points in your chart that cause sudden delays.' },
      { badge: 'Pushkar', title: 'Navamsa Mapping', detail: 'Finding exact degrees where weak planets become "super-powered".' },
      { badge: 'Vargottama', title: 'Utilisation Guide', detail: 'How to use planets that occupy the same sign in D-1 and D-9.' },
      { badge: 'Neutralizers', title: 'Specific Tithi Micro-remedies', detail: 'Micro-remedies based on your birth lunar day.' },
      { badge: 'Maraka', title: 'Longevity Precautions', detail: 'Straight talk on high-risk health periods.' },
      { badge: 'Skill', title: 'Education Acquisition Windows', detail: 'When your mind is most receptive to new certifications or degrees.' },
      { badge: 'Arudha', title: 'Public Perception vs Reality', detail: 'How the world sees you versus who you actually are.' },
      { badge: 'Bhrigu', title: 'Destiny Point Identification', detail: 'A singular specific point indicating your ultimate destiny trigger.' },
      { badge: 'Cheat Sheet', title: 'No-BS Executive Summary', detail: 'A one-page cheat sheet for the next 5 years of your life.' },
    ],
  },
];

// ─── MANY MORE MODAL (Light Theme) ──────────────────────────────────────────

function RawFeaturesModal({ onClose, openModal }: { onClose: () => void; openModal: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Aggressively lock both HTML and Body, standard trick to freeze background on strict iOS devices
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.overflow = origBodyOverflow;
    };
  }, []);

  let featureCount = 0;
  const sectionColors = [
    { bg: '#EFF6FF', border: '#BFDBFE', accent: '#1D4ED8', dot: '#3B82F6' },
    { bg: '#F5F3FF', border: '#DDD6FE', accent: '#6D28D9', dot: '#7C3AED' },
    { bg: '#FFF7ED', border: '#FED7AA', accent: '#C2410C', dot: '#EA580C' },
    { bg: '#F0FDF4', border: '#BBF7D0', accent: '#15803D', dot: '#16A34A' },
    { bg: '#FDF4FF', border: '#E9D5FF', accent: '#7E22CE', dot: '#9333EA' },
  ];

  if (!mounted) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#FAFAF8',
          borderRadius: '24px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
          
          /* CRITICAL: Enforce maximum height and flex layout for internal scrolling */
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Fixed Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#fff', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: '#4F46E5', marginBottom: 12 }}>
                <Crown size={12} color="#fff" />
                <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em' }}>COMPLETE REALITY CHECK</span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', fontFamily: "'Space Grotesk', sans-serif" }}>
                The Executive Life Audit
              </h2>
              <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5 }}>
                All 30 deliverables. Human-interpreted. Delivered within 12 hours.
              </p>
            </div>
            <button 
              onClick={onClose}
              style={{
                width: '36px', height: '36px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, color: '#4B5563'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable List Content Area */}
        <div style={{ 
          padding: '28px', 
          overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch',
          display: 'block', // CRITICAL: using block instead of flex prevents children from being crushed to 0 height
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {completeFullSections.map((section, si) => {
              const col = sectionColors[si % sectionColors.length];
            return (
              <div key={si} style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '12px 18px', borderBottom: `1px solid ${col.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot }} />
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: col.accent, letterSpacing: '0.04em' }}>
                    {section.title}
                  </span>
                </div>
                
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {section.items.map((item: any, ii) => {
                    featureCount++;
                    const num = featureCount;
                    return (
                      <div key={ii} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        <div style={{
                          flexShrink: 0, width: '24px', height: '24px', borderRadius: '6px', background: '#fff', border: `1.5px solid ${col.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: col.accent, fontFamily: 'monospace'
                        }}>
                          {num}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '-1px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                            {item.badge && (
                              <span style={{
                                background: col.bg, color: col.accent, border: `1px solid ${col.border}`, padding: '2px 8px', borderRadius: '6px',
                                fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.04em'
                              }}>
                                {item.badge}
                              </span>
                            )}
                            <span style={{ color: '#111827', fontSize: '0.9rem', fontWeight: 800, lineHeight: 1.3 }}>
                              {item.title}
                            </span>
                          </div>
                          {item.detail && (
                            <span style={{ color: '#4B5563', fontSize: '0.8rem', lineHeight: 1.5 }}>
                              {item.detail}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Fixed Footer */}
        <div style={{ padding: '20px 28px 24px', flexShrink: 0, backgroundColor: '#FAFAF8', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
          <button
            onClick={() => { onClose(); openModal(); }}
            style={{
              width: '100%', padding: '18px', background: 'linear-gradient(135deg, hsl(245,60%,28%), hsl(30,80%,55%))', color: '#fff', border: 'none', borderRadius: '14px',
              fontSize: '1rem', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(255,130,50,0.2)'
            }}
          >
            Get This Report Now →
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function PricingSection() {
  const { openModal } = useOnboarding();
  const [showModal, setShowModal] = useState(false);

  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';

  const plans = [
    {
      name: 'Essential',
      tagline: 'The "Reality Check" for the casual but cautious.',
      price: '₹2,399',
      originalPrice: '₹4,999',
      icon: Zap,
      features: essentialFeatures,
      popular: false,
      accentColor: 'hsl(245,60%,55%)',
      showMore: false,
      highlight: null,
    },
    {
      name: 'Complete Reality Check',
      tagline: 'The "Executive Life Audit." Total transparency. Zero surprises.',
      price: '₹4,799',
      originalPrice: '₹9,999',
      icon: Crown,
      features: completePreviewFeatures,
      popular: true,
      accentColor: 'hsl(30,80%,55%)',
      showMore: true,
      highlight: {
        icon: MessageCircle,
        text: '10 Specific Questions Answered',
        sub: 'You choose them. We decode them — directly from your chart.',
      },
    },
  ];

  return (
    <>
      {/* Modal */}
      {showModal && (
        <RawFeaturesModal
          onClose={() => setShowModal(false)}
          openModal={openModal}
        />
      )}

      <section
        id="pricing"
        style={{ padding: '6rem 1.5rem', background: 'hsl(240,20%,8%)', position: 'relative', overflow: 'hidden' }}
      >
        {/* BG blobs */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 50%, hsl(245,60%,50%), transparent 50%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 50%, hsl(30,80%,55%), transparent 50%)' }} />
        </div>

        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>
          {/* Heading */}
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

          {/* Plan Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
            {plans.map((p, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  style={{
                    position: 'relative',
                    padding: '28px 30px 30px',
                    borderRadius: 18,
                    border: p.popular ? `2px solid ${p.accentColor}` : '2px solid hsl(240,15%,22%)',
                    background: p.popular ? 'hsl(40 33% 97% / 0.07)' : 'hsl(40 33% 97% / 0.03)',
                    backdropFilter: 'blur(4px)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: p.popular ? `0 0 50px -10px ${p.accentColor}40` : 'none',
                  }}
                >
                  {/* Popular badge */}
                  {p.popular && (
                    <div style={{
                      position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                      padding: '5px 18px', borderRadius: 999,
                      background: grad, color: '#fff',
                      fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.06em', whiteSpace: 'nowrap',
                    }}>
                      Most Popular · Executive
                    </div>
                  )}

                  {/* Icon + Name */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: p.popular ? grad : 'hsl(240,15%,20%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <p.icon size={20} color={p.popular ? '#fff' : 'hsl(30,80%,55%)'} />
                    </div>
                    <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.3rem', fontWeight: 700, color: 'hsl(40,33%,97%)' }}>
                      {p.name}
                    </h3>
                    <p style={{ color: 'hsl(40 33% 97% / 0.5)', marginTop: 5, fontSize: '0.8125rem', lineHeight: 1.5, fontStyle: 'italic' }}>
                      {p.tagline}
                    </p>
                  </div>

                  {/* Highlight Feature Badge */}
                  {p.highlight && (
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '12px 14px', borderRadius: 12, marginBottom: 18,
                      background: 'hsl(30 80% 55% / 0.12)',
                      border: '1px solid hsl(30 80% 55% / 0.35)',
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: 'hsl(30,80%,55%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <p.highlight.icon size={15} color="#fff" />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem', fontWeight: 700, color: 'hsl(30,80%,70%)' }}>
                          {p.highlight.text}
                        </p>
                        <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: 'hsl(40 33% 97% / 0.5)', lineHeight: 1.4 }}>
                          {p.highlight.sub}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div style={{ marginBottom: 22 }}>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '2.25rem', fontWeight: 700, color: 'hsl(40,33%,97%)' }}>
                      {p.price}
                    </span>
                    <span style={{ color: 'hsl(40 33% 97% / 0.35)', textDecoration: 'line-through', marginLeft: 10, fontSize: '1rem' }}>
                      {p.originalPrice}
                    </span>
                  </div>

                  {/* Features list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20, flexGrow: 1 }}>
                    {p.features.map((f: any, j) => {
                      return (
                        <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%',
                            background: p.popular ? grad : 'hsl(240,15%,20%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, marginTop: 4,
                          }}>
                            <Check size={10} color={p.popular ? '#fff' : 'hsl(30,80%,55%)'} strokeWidth={3} />
                          </div>
                      
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                              {f.badge && (
                                <span style={{
                                  background: 'hsl(40 80% 55% / 0.12)',
                                  color: 'hsl(40,90%,60%)',
                                  border: '1px solid hsl(40 80% 55% / 0.25)',
                                  padding: '2px 8px', borderRadius: 6,
                                  fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase',
                                  fontFamily: 'monospace', letterSpacing: '0.05em'
                                }}>
                                  {f.badge}
                                </span>
                              )}
                              <span style={{ color: p.popular ? 'hsl(40,33%,97%)' : 'hsl(40,33%,92%)', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.3 }}>
                                {f.title}
                              </span>
                            </div>
                            {f.detail && (
                              <span style={{ color: 'hsl(40 33% 97% / 0.55)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                                {f.detail}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* "many more..." button */}
                    {p.showMore && (
                      <button
                        id="pricing-many-more-btn"
                        onClick={() => setShowModal(true)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          marginTop: 8, padding: '7px 14px',
                          borderRadius: 999,
                          background: 'hsl(30 80% 55% / 0.12)',
                          border: '1px solid hsl(30 80% 55% / 0.35)',
                          color: 'hsl(30,80%,65%)',
                          fontSize: '0.75rem', fontWeight: 700,
                          cursor: 'pointer', letterSpacing: '0.03em',
                          transition: 'background 0.2s',
                          alignSelf: 'flex-start',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(30 80% 55% / 0.22)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'hsl(30 80% 55% / 0.12)'; }}
                      >
                        <ChevronRight size={12} />
                        +22 more deliverables — see full breakdown
                      </button>
                    )}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={openModal}
                    style={{
                      width: '100%', padding: '0.9rem',
                      borderRadius: 12,
                      background: p.popular ? grad : 'transparent',
                      border: p.popular ? 'none' : '2px solid hsl(240,15%,30%)',
                      color: p.popular ? 'hsl(40,33%,97%)' : 'hsl(40 33% 97% / 0.7)',
                      fontFamily: "'Space Grotesk',sans-serif",
                      fontSize: '0.9375rem', fontWeight: 700,
                      cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
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
    </>
  );
}
