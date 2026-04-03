'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, X, ChevronRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useOnboarding } from '@/context/OnboardingContext';

// ─── DATA ───────────────────────────────────────────────────────────────────

const essentialFeatures = [
  'Full Shodashavarga (D-1 to D-16) Structural Audit: A foundational breakdown of your physical and psychological hardware.',
  '3-Year High-Resolution Career Trajectory: Quarterly mapping of "Push" vs. "Pause" phases in professional growth.',
  'Relationship Karma & Behavioral Red-Flag Mapping: Identification of recurring toxic patterns in your 7th house.',
  '12-Month Crisis Avoidance Map: A month-by-month risk assessment for health, finance, and conflict.',
  'Dasha Transition Impact Reports: Analyzing the shift from Mahadasha to Antardasha with surgical precision.',
  'Ashtakvarga "Energy Budget": A numerical table showing exactly how much planetary "fuel" you have for specific tasks.',
  'Personalized "Neutralization" Protocols: Action-based remedies (no stones, no expensive rituals).',
  'The "Hidden Enemy" Audit: Identifying 6th-house triggers that manifest as workplace sabotage or legal friction.',
  'Wealth Activation Windows: Pinpointing the specific months where the 2nd and 11th house lords are most potent.',
  'Private PDF Dossier: A clean, data-heavy report delivered within 24 hours.',
];

const completePreviewFeatures = [
  'Everything in the Essential Plan +',
  'Full D-60 (Shastiamsa) Analysis: The most critical chart that reveals past-life baggage.',
  'Marriage & Separation Timelines: Using Upapada Lagna to predict the quality and duration of unions.',
  'Deep Shadow Work (Trauma Coding): Using Saturn and Ketu to identify subconscious self-sabotage loops.',
  'Corporate/Business Scaling Strategy: When to launch, when to scale, and when to exit.',
  '3 Direct WhatsApp Follow-Up Questions (valid for 7 days).',
  'Priority 12-Hour "Emergency" Delivery: Internally prioritised for immediate clarity.',
  '6 Months YNTRA WebApp Free Access: Early access to our upcoming Webapp.*',
];

const completeFullSections = [
  {
    title: 'I. Advanced Predicative Data',
    items: [
      'Full D-60 (Shastiamsa) Analysis: The most critical chart that reveals past-life baggage and the "why" behind current struggles.',
      'Marriage & Separation Timelines: Using Upapada Lagna to predict the exact quality and duration of unions.',
      'Property & Real-Estate Windows: Data on when to buy, sell, or avoid land disputes.',
      'Stock Market & Investment Risk Profile: Your innate planetary "speculation" score.',
      'Generational Curse (Rina) Decoding: Identifying inherited ancestral patterns using the 9th house and Rahu/Ketu.',
      'Foreign Settlement Probability: Analysis of the 4th, 9th, and 12th houses for migration data.',
      'Litigation & Conflict Risk Analysis: Mapping periods where the 6th house is under siege.',
      'Progeny & Legacy Karma: Timeline for children and the energetic impact on your career.',
    ],
  },
  {
    title: 'II. Psychological & Shadow Work',
    items: [
      'Deep Shadow Work (Trauma Coding): Using Saturn and Ketu to identify subconscious self-sabotage loops.',
      'Recurring Life Loops Identified: Highlighting why you keep dating the same person or losing the same job.',
      '"Soul Source Code" (Atmakaraka Analysis): Your primary life lesson and how to stop fighting it.',
      'Ego-Dissolution Windows: Identifying periods for spiritual reset and mental health prioritisation.',
      'Nadi-Amsa Purpose Discovery: Using Nadi systems to find the specific "sub-breath" of your destiny.',
    ],
  },
  {
    title: 'III. Strategic Business & Scaling',
    items: [
      'Corporate/Business Scaling Strategy: When to launch, when to scale, and when to exit.',
      'Hiring/Partnership Compatibility: Using Arudha Lagna to see who will actually help your public image.',
      'Competitor Vulnerability Windows: Knowing when your rivals are in a weakening cycle.',
      'Leadership Style Audit: Analysis of your Sun/Mars strength for authority management.',
    ],
  },
  {
    title: 'IV. Technical & Interactive Support',
    items: [
      '3 Direct WhatsApp Follow-Up Questions: Human-verified, data-driven answers (valid for 7 days).',
      'Priority 12-Hour "Emergency" Delivery: Internally prioritised for immediate clarity.',
      '6 Months YNTRA WebApp Free Access: Early access to our upcoming Webapp.*',
      'Monthly "Transit Watch" Notifications: 3 months of alerts for major planetary shifts (e.g., Saturn Retrograde).',
    ],
  },
  {
    title: 'V. The "Grand Master" Secrets',
    items: [
      'Gulika/Mandi Poison Points: Identifying the "invisible" points in your chart that cause sudden delays.',
      'Pushkar Navamsa Mapping: Finding the exact degrees where your planets become "super-powered" despite looking weak.',
      'Vargottama Utilisation Guide: How to use planets that occupy the same sign in D-1 and D-9.',
      'Specific Tithi/Nakshatra Neutralisers: Micro-remedies based on your birth lunar day.',
      'Longevity & Maraka Precautions: Straight talk on high-risk health periods.',
      'Education & Skill Acquisition Windows: When your mind is most receptive to new certifications or degrees.',
      'Public Perception (Arudha) vs. Reality: How the world sees you versus who you actually are.',
      'The "Bhrigu" Point Identification: A singular, specific point in your life that indicates your ultimate destiny trigger.',
      'No-BS Executive Summary: A one-page "Cheat Sheet" for the next 5 years of your life.',
    ],
  },
];

// ─── RAZORPAY HELPER ────────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: any;
  }
}

async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function initiateRazorpayCheckout({
  amountPaise,
  plan,
  description,
  keyId,
  onSuccess,
  onError,
}: {
  amountPaise: number;
  plan: string;
  description: string;
  keyId: string;
  onSuccess: (data: any) => void;
  onError: (msg: string) => void;
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) return onError('Failed to load Razorpay. Please check your connection.');

  const res = await fetch('/api/razorpay-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', plan }),
  });

  const data = await res.json();
  if (!res.ok || !data.orderId) return onError(data.error || 'Failed to create order');

  const rzp = new window.Razorpay({
    key: keyId,
    amount: data.amount,
    currency: data.currency,
    order_id: data.orderId,
    name: 'YNTRA',
    description,
    image: '/favicon.ico',
    theme: { color: '#1a1a2e' },
    handler: (response: any) => onSuccess(response),
    modal: { ondismiss: () => {} },
  });
  rzp.open();
}

// ─── MANY MORE MODAL ────────────────────────────────────────────────────────

function ManyMoreModal({ onClose }: { onClose: () => void }) {
  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';
  let featureCount = 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(8,8,20,0.92)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 720,
            maxHeight: '90vh', overflowY: 'auto',
            background: 'hsl(240,20%,10%)',
            border: '1px solid hsl(240,15%,22%)',
            borderRadius: 20,
            padding: '2rem',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, background: 'hsl(30 80% 55% / 0.2)', color: 'hsl(30,80%,55%)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>
                COMPLETE REALITY CHECK · 30 DELIVERABLES
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 700, color: 'hsl(40,33%,97%)', lineHeight: 1.2 }}>
                The Executive Life Audit.<br />
                <span style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Total transparency. Zero surprises.</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: 'hsl(240,15%,20%)', border: '1px solid hsl(240,15%,28%)', color: 'hsl(40 33% 97% / 0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {completeFullSections.map((section, si) => (
              <div key={si}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 14px', borderRadius: 8,
                  background: 'hsl(240,15%,18%)',
                  border: '1px solid hsl(240,15%,28%)',
                  marginBottom: 14,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: grad }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.8125rem', fontWeight: 700, color: 'hsl(30,80%,65%)', letterSpacing: '0.04em' }}>
                    {section.title}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {section.items.map((item, ii) => {
                    featureCount++;
                    const num = featureCount;
                    const [title, detail] = item.split(': ');
                    return (
                      <div key={ii} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{
                          flexShrink: 0, width: 24, height: 24, borderRadius: 6,
                          background: 'hsl(240,15%,20%)', border: '1px solid hsl(240,15%,30%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.625rem', fontWeight: 700, color: 'hsl(30,80%,65%)', fontFamily: 'monospace',
                          marginTop: 1,
                        }}>
                          {num}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, color: 'hsl(40,33%,92%)', fontSize: '0.8125rem', lineHeight: 1.5 }}>{title}</span>
                          {detail && <span style={{ color: 'hsl(40 33% 97% / 0.5)', fontSize: '0.75rem', display: 'block', marginTop: 2, lineHeight: 1.45 }}>{detail}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid hsl(240,15%,20%)', textAlign: 'center' }}>
            <p style={{ color: 'hsl(40 33% 97% / 0.45)', fontSize: '0.8125rem', marginBottom: 16 }}>
              All 30 deliverables. One report. Delivered within 12 hours.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '0.875rem 2.5rem', borderRadius: 12,
                background: grad, border: 'none',
                color: '#fff', fontFamily: "'Space Grotesk',sans-serif",
                fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              I Want This Report →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function PricingSection() {
  const { openModal } = useOnboarding();
  const [showModal, setShowModal] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testMsg, setTestMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

  const handleTestPayment = async () => {
    setTestLoading(true);
    setTestMsg(null);
    await initiateRazorpayCheckout({
      amountPaise: 1000, // ₹10 = 1000 paise
      plan: 'test',
      description: '₹10 Test Payment — YNTRA',
      keyId,
      onSuccess: (data) => {
        setTestMsg({ type: 'success', text: `✅ Payment successful! ID: ${data.razorpay_payment_id}` });
        setTestLoading(false);
      },
      onError: (msg) => {
        setTestMsg({ type: 'error', text: `❌ ${msg}` });
        setTestLoading(false);
      },
    });
    setTestLoading(false);
  };

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
      previewCount: essentialFeatures.length,
      showMore: false,
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
      previewCount: completePreviewFeatures.length,
      showMore: true,
    },
  ];

  return (
    <>
      {showModal && <ManyMoreModal onClose={() => setShowModal(false)} />}

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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 20, flexGrow: 1 }}>
                    {p.features.map((f, j) => {
                      const [title, detail] = f.split(': ');
                      return (
                        <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                          <div style={{
                            width: 17, height: 17,
                            borderRadius: '50%',
                            background: p.popular ? grad : 'hsl(240,15%,20%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, marginTop: 2,
                          }}>
                            <Check size={10} color={p.popular ? '#fff' : 'hsl(30,80%,55%)'} strokeWidth={3} />
                          </div>
                          <span style={{ color: 'hsl(40 33% 97% / 0.85)', fontSize: '0.8125rem', lineHeight: 1.45, letterSpacing: '-0.01em' }}>
                            {detail ? <><strong style={{ color: 'hsl(40,33%,97%)', fontWeight: 600 }}>{title}</strong>: {detail}</> : title}
                          </span>
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
                          marginTop: 6, padding: '6px 14px',
                          borderRadius: 999,
                          background: 'hsl(30 80% 55% / 0.12)',
                          border: '1px solid hsl(30 80% 55% / 0.35)',
                          color: 'hsl(30,80%,65%)',
                          fontSize: '0.75rem', fontWeight: 700,
                          cursor: 'pointer', letterSpacing: '0.03em',
                          transition: 'background 0.2s, border-color 0.2s',
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

          {/* ₹10 Razorpay Test Section */}
          <AnimatedSection delay={0.3}>
            <div style={{
              marginTop: 48,
              padding: '28px 32px',
              borderRadius: 16,
              background: 'hsl(240,15%,11%)',
              border: '1px dashed hsl(240,15%,28%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              textAlign: 'center',
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'hsl(245,60%,65%)', textTransform: 'uppercase' }}>
                🔬 Razorpay Integration Test
              </span>
              <p style={{ color: 'hsl(40 33% 97% / 0.55)', fontSize: '0.875rem', maxWidth: 480 }}>
                Verify the payment gateway is live before going full-price. This charges exactly ₹10.
              </p>
              <motion.button
                id="razorpay-test-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleTestPayment}
                disabled={testLoading}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: 10,
                  background: testLoading ? 'hsl(240,15%,22%)' : 'hsl(245,60%,55%)',
                  border: 'none',
                  color: '#fff',
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  cursor: testLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  minWidth: 220,
                }}
              >
                {testLoading ? 'Opening Checkout…' : 'Test Payment — ₹10'}
              </motion.button>

              {testMsg && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: '0.8125rem',
                    color: testMsg.type === 'success' ? 'hsl(142,60%,55%)' : 'hsl(0,80%,65%)',
                    fontFamily: 'monospace',
                    background: testMsg.type === 'success' ? 'hsl(142 60% 55% / 0.1)' : 'hsl(0 80% 65% / 0.1)',
                    padding: '8px 14px', borderRadius: 8, maxWidth: 480,
                  }}
                >
                  {testMsg.text}
                </motion.p>
              )}

              <p style={{ fontSize: '0.7rem', color: 'hsl(40 33% 97% / 0.25)', marginTop: 4 }}>
                Test mode · Uses Razorpay test credentials · No real money charged in test mode
              </p>
            </div>
          </AnimatedSection>

          {/* Trust note */}
          <AnimatedSection delay={0.4}>
            <p style={{ textAlign: 'center', marginTop: 36, fontSize: '0.875rem', color: 'hsl(40 33% 97% / 0.35)', fontFamily: 'var(--font-mono), monospace' }}>
              Limited to 52 reports/day to maintain human verification standards. · No refunds on karma.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
