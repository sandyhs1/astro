'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, X, ChevronRight, MessageCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useAuthModal } from '@/context/AuthModalContext';

// ─── DATA ───────────────────────────────────────────────────────────────────

// First 8 visible features (main pricing section)
const visibleFeatures = [
  { badge: 'D-60', title: 'D-60 (Shastiamsa) Audit', detail: 'The "Twin-Killer" chart. The final word on your actual destiny.' },
  { badge: 'Upapada', title: 'Upapada Lagna (UL) Lifecycle', detail: 'Mapping the functional lifespan and legal stability of marriage/partnerships.' },
  { badge: 'Real-Estate', title: 'Real-Estate & Asset Timelines', detail: 'Exact windows for property acquisition or exit.' },
  { badge: 'Investment', title: 'Investment Volatility Index', detail: 'Calculating your innate "Speculation Score" (Safe vs. High Leverage).' },
  { badge: 'Karmic Debt', title: 'Karmic Debt (Rina)', detail: 'Identifying inherited family liabilities using Rahu/Ketu nodes.' },
  { badge: 'Migration', title: 'Foreign Settlement Probability', detail: 'Analyzing 4th/9th/12th house vectors for migration.' },
  { badge: 'Litigation', title: 'Litigation & Conflict Latency', detail: 'A stress-test of your 6th house for legal or tax vulnerabilities.' },
  { badge: 'Progeny', title: 'Progeny & Legacy Karma', detail: 'Timeline for children and long-term intellectual property creation.' },
];

const completeFullSections = [
  {
    title: 'II. Psychological & Shadow Architecture',
    items: [
      { badge: 'Trauma', title: 'Saturn-Ketu Trauma Coding', detail: 'Identifying the specific memory nodes where past trauma blocks current growth.' },
      { badge: 'Loops', title: 'Behavioral Loop Identification', detail: 'A recursive analysis of the 8th House to find why you repeat mistakes.' },
      { badge: 'Atmakaraka', title: 'Atmakaraka "Source Code" Extraction', detail: 'Identifying your soul\'s primary mission and greatest resistance.' },
      { badge: '12th House', title: 'Ego-Dissolution (12th H) Windows', detail: 'Mapping periods for isolation, spiritual reset, and mental health.' },
      { badge: 'Nadi-Amsa', title: 'Nadi-Amsa Micro-Purpose Mapping', detail: 'Finding the hyper-specific "archetype" of your destiny.' },
    ],
  },
  {
    title: 'III. Strategic Enterprise & Brand (for founders)',
    items: [
      { badge: '10th House', title: 'Business Scaling Vector', detail: 'Analyzing the 10th House for product launches or market pivots.' },
      { badge: 'Arudha', title: 'Arudha Lagna (AL) Reputation Audit', detail: 'How the world sees you vs. how you see yourself.' },
      { badge: 'Competition', title: 'Competitor Vulnerability Windows', detail: 'Knowing when your rivals\' charts are in a "weak transit" cycle.' },
      { badge: 'Dig Bala', title: 'Authority (Dig Bala) Assessment', detail: 'Measuring your "Directional Strength" for leadership roles.' },
    ],
  },
  {
    title: 'IV. More...',
    items: [
      { badge: 'Bhrigu', title: 'The Bhrigu Point (Destiny Trigger)', detail: 'The exact degree that, when touched, changes your life forever.' },
      { badge: 'Gulika', title: 'Gulika/Mandi Poison Points', detail: 'Identifying the invisible points that cause "unexplainable" project delays.' },
      { badge: 'Pushkar', title: 'Pushkar Navamsa Optimization', detail: 'Locating hidden degrees where "Weak" planets become "Super-Powered."' },
      { badge: 'Vargottama', title: 'Vargottama Power Vectors', detail: 'Identifying unbreakable strengths (planets in the same sign in D-1 & D-9).' },
      { badge: 'Tithi', title: 'Lunar Tithi Neutralization', detail: 'Fixing the "Internal Tide" of your emotions based on birth lunar phase.' },
      { badge: 'Maraka', title: 'Maraka Risk Audit', detail: 'High-res monitoring of the 2nd and 7th houses for health vulnerability.' },
      { badge: 'Learning', title: 'Cognitive Skill Acquisition Windows', detail: 'When your mind is most receptive to learning AI, coding, or strategy.' },
      { badge: 'Roadmap', title: '5-Year Executive Roadmap', detail: 'A one-page "Decision Matrix" for the next 60 months.' },
    ],
  },
  {
    title: 'V. VIP Support & Access',
    items: [
      { badge: 'WhatsApp', title: '3 Direct WhatsApp Tactical Questions', detail: 'Human-verified answers for real-world decision making.' },
      { badge: 'Priority', title: '12-Hour Priority Delivery', detail: 'Moved to the front of the compute queue.' },
      { badge: 'YNTRA', title: 'Early Free Access to our upcoming YNTRA WebApp', detail: 'Be among the first to experience our revolutionary platform.' },
      { badge: 'Summary', title: 'No-BS Executive Summary', detail: 'A brutal, one-page "Bottom Line" summary for the CEO in a hurry.' },
      { badge: 'No Scams', title: 'No expensive gemstones, no expansive poojs, no fear mongering', detail: 'Just pure, actionable intelligence based on your chart.' },
    ],
  },
];

// ─── DISCLAIMER MODAL (Light Theme) ─────────────────────────────────────────

function DisclaimerModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.overflow = origBodyOverflow;
    };
  }, []);

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
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', fontFamily: "'Space Grotesk', sans-serif" }}>
                The Fine Print (But Make It Fun)
              </h2>
              <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5 }}>
                A love letter to reality, wrapped in cosmic wisdom.
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

        {/* Scrollable Content */}
        <div style={{ 
          padding: '28px', 
          overflowY: 'auto', 
          flex: 1, 
          WebkitOverflowScrolling: 'touch',
          display: 'block',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#374151', fontSize: '0.95rem', lineHeight: 1.7 }}>
            
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#1F2937' }}>Astrology is pure math and science.</strong> We follow Vedic principles, and all calculations are strictly based on <em>Parashari</em>, <em>Jaimini</em>, and <em>Nadi</em> systems. But here's the plot twist: <strong>free will still holds good and can alter everything.</strong>
            </p>

            <p style={{ margin: 0 }}>
              Think of our reports as <strong>weather forecasts</strong>—not destiny decrees. No astrologer should guarantee results. If they do, <strong>RUN</strong>. 🏃‍♂️
            </p>

            <p style={{ margin: 0 }}>
              Astrology was never meant to be used solely as a prediction tool. It's more of a <strong>diagnostic tool</strong> used to identify recurring patterns and break the loop. Think of it as <strong>your life's user manual—for you, about you.</strong>
            </p>

            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '12px', padding: '16px', margin: '8px 0' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#92400E' }}>
                💎 We do NOT recommend nor encourage expensive gemstones as a remedy.
              </p>
            </div>

            <p style={{ margin: 0 }}>
              <strong>Age Policy:</strong> We read birth charts of only adults who are <strong>above 23 years old</strong> (barring serious or life-threatening situations). Your Saturn Return hasn't even kicked in yet—let's wait for the real plot to unfold.
            </p>

            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '16px', margin: '8px 0' }}>
              <p style={{ margin: '0 0 12px', fontWeight: 700, color: '#991B1B', fontSize: '1rem' }}>
                🚫 We Do NOT Encourage Nor Predict Questions Like:
              </p>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#7F1D1D' }}>
                <li>"Will my ex come back?"</li>
                <li>"When will my ex text me?"</li>
                <li>"Is my ex thinking about me now?"</li>
                <li>"Is my boyfriend/girlfriend cheating?"</li>
                <li>"How rich will my future spouse be?"</li>
                <li>"Will I marry a billionaire?"</li>
                <li>"Does my crush like me?"</li>
                <li>"Which celebrity will I marry?"</li>
                <li>"Will I become famous on Instagram?"</li>
                <li>"Will I become a millionaire by 25?"</li>
                <li>"Which gemstone will fix my life?"</li>
                <li>"How wealthy will my future in-laws be?"</li>
              </ul>
              <p style={{ margin: '12px 0 0', fontStyle: 'italic', color: '#991B1B' }}>
                <strong>Astrology is not a rom-com script generator.</strong>
              </p>
            </div>

            <p style={{ margin: 0 }}>
              <strong style={{ color: '#1F2937' }}>Our reports are honest, brutal, and straightforward.</strong> Do not expect flattery or sugar-coated words. If you're looking for a cosmic cheerleader, there are many other astrologers out there—and we genuinely wish you all the love and success! 💜
            </p>

            <p style={{ margin: 0, fontStyle: 'italic', color: '#6B7280' }}>
              We're here for the seekers, the skeptics, and the ones ready to face their chart with courage. If that's you, welcome home.
            </p>

          </div>
        </div>

        {/* Fixed Footer */}
        <div style={{ padding: '20px 28px', flexShrink: 0, backgroundColor: '#FAFAF8', borderTop: '1px solid #E5E7EB', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '14px', background: '#1F2937', color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '0.95rem', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer',
            }}
          >
            Got It, Let's Go →
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── MANY MORE MODAL (Light Theme) ──────────────────────────────────────────

function RawFeaturesModal({ onClose, openAuthModal }: { onClose: () => void; openAuthModal: () => void }) {
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
                All 29 deliverables. Human-interpreted. Delivered within 12 hours.
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
            onClick={() => { onClose(); openAuthModal(); }}
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
  const { openAuthModal } = useAuthModal();
  const [showModal, setShowModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';

  return (
    <>
      {/* Modals */}
      {showModal && (
        <RawFeaturesModal
          onClose={() => setShowModal(false)}
          openAuthModal={() => openAuthModal("sign_up")}
        />
      )}
      {showDisclaimer && (
        <DisclaimerModal
          onClose={() => setShowDisclaimer(false)}
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

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', padding: '0 16px' }}>
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

          {/* Single Premium Plan Card */}
          <AnimatedSection delay={0.15}>
            <motion.div
              whileHover={{ y: -4 }}
              style={{
                position: 'relative',
                padding: '0',
                borderRadius: 18,
                border: '2px solid hsl(30,80%,55%)',
                background: 'hsl(40 33% 97% / 0.08)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 0 50px -10px hsl(30,80%,55%)',
                overflow: 'visible',
                marginTop: 20,
                maxWidth: '100%',
              }}
            >
              {/* Premium Badge */}
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                padding: '5px 18px', borderRadius: 999,
                background: grad, color: '#fff',
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(255,130,50,0.3)',
                zIndex: 10,
              }}>
                Most Popular · Executive
              </div>

              {/* Header Section */}
              <div style={{ 
                padding: '28px 24px 22px', 
                background: 'linear-gradient(180deg, hsl(40 33% 97% / 0.12) 0%, hsl(40 33% 97% / 0.04) 100%)',
                borderBottom: '1px solid hsl(40 33% 97% / 0.1)',
              }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: 12, 
                    background: grad, 
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 6px 20px rgba(255,130,50,0.3)',
                    marginBottom: 12,
                  }}>
                    <Crown size={24} color="#fff" />
                  </div>
                  <h3 style={{ 
                    fontFamily: "'Space Grotesk',sans-serif", 
                    fontSize: '1.5rem', 
                    fontWeight: 800, 
                    color: 'hsl(40,33%,97%)',
                    margin: '0 0 6px',
                    lineHeight: 1.2,
                  }}>
                    Complete Reality Check
                  </h3>
                  <p style={{ 
                    color: 'hsl(40 33% 97% / 0.6)', 
                    margin: 0, 
                    fontSize: '0.875rem', 
                    lineHeight: 1.4, 
                    fontStyle: 'italic' 
                  }}>
                    The "Executive Life Audit." Total transparency. Zero surprises.
                  </p>
                </div>

                {/* Two Highlight Boxes in Same Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: '12px',
                  marginBottom: 18,
                  maxWidth: '100%',
                }}>
                  {/* Box 1: 10 Questions */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', borderRadius: 12,
                    background: 'hsl(30 80% 55% / 0.15)',
                    border: '1px solid hsl(30 80% 55% / 0.4)',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: 'hsl(30,80%,55%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <MessageCircle size={16} color="#fff" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ 
                        margin: 0, 
                        fontFamily: "'Space Grotesk',sans-serif", 
                        fontSize: '0.85rem', 
                        fontWeight: 700, 
                        color: 'hsl(30,80%,75%)' 
                      }}>
                        10 Specific Questions Answered
                      </p>
                      <p style={{ 
                        margin: '2px 0 0', 
                        fontSize: '0.72rem', 
                        color: 'hsl(40 33% 97% / 0.6)', 
                        lineHeight: 1.3 
                      }}>
                        You choose them. We decode them.
                      </p>
                    </div>
                  </div>

                  {/* Box 2: Premium Remedies */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', borderRadius: 12,
                    background: 'hsl(270 60% 50% / 0.15)',
                    border: '1px solid hsl(270 60% 50% / 0.4)',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: 'hsl(270,60%,50%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Zap size={16} color="#fff" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ 
                        margin: 0, 
                        fontFamily: "'Space Grotesk',sans-serif", 
                        fontSize: '0.85rem', 
                        fontWeight: 700, 
                        color: 'hsl(270,60%,75%)' 
                      }}>
                        Your Full-scale life audit and intelligence report.
                      </p>
                      <p style={{ 
                        margin: '2px 0 0', 
                        fontSize: '0.72rem', 
                        color: 'hsl(40 33% 97% / 0.6)', 
                        lineHeight: 1.3 
                      }}>
                        Delivered to your inbox in 4–6 hours. Read it. Apply it. Win.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign: 'center', marginBottom: 18 }}>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ 
                      fontFamily: "'Space Grotesk',sans-serif", 
                      fontSize: '2.5rem', 
                      fontWeight: 800, 
                      color: 'hsl(40,33%,97%)',
                      letterSpacing: '-0.02em',
                    }}>
                      ₹4,799
                    </span>
                    <span style={{ 
                      color: 'hsl(40 33% 97% / 0.4)', 
                      textDecoration: 'line-through', 
                      marginLeft: 12, 
                      fontSize: '1.2rem',
                      fontWeight: 600,
                    }}>
                      ₹9,999
                    </span>
                  </div>
                  <p style={{ 
                    color: 'hsl(30,80%,65%)', 
                    fontSize: '0.85rem', 
                    fontWeight: 600,
                    margin: 0,
                  }}>
                    52% OFF · Limited Time Offer
                  </p>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openAuthModal("sign_up")}
                  style={{
                    width: '100%', 
                    maxWidth: 400,
                    margin: '0 auto',
                    display: 'block',
                    padding: '0.95rem 1.5rem',
                    borderRadius: 12,
                    background: grad,
                    border: 'none',
                    color: 'hsl(40,33%,97%)',
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: '1rem', 
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 10px 28px rgba(255,130,50,0.4)',
                    letterSpacing: '0.02em',
                  }}
                >
                  Get Your Report Now →
                </motion.button>
              </div>

              {/* Clean Features List - WIDE Horizontal Rectangle Layout */}
              <div style={{ padding: '32px 20px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 10, 
                  marginBottom: 20,
                  justifyContent: 'center',
                }}>
                  <div style={{ 
                    width: 28, 
                    height: 28, 
                    borderRadius: 7, 
                    background: grad,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                  }}>
                    <Check size={14} color="#fff" strokeWidth={3} />
                  </div>
                  <h4 style={{ 
                    fontFamily: "'Space Grotesk',sans-serif", 
                    fontSize: '1.2rem', 
                    fontWeight: 700, 
                    color: 'hsl(40,33%,97%)',
                    margin: 0,
                  }}>
                    Everything Included
                  </h4>
                </div>

                {/* WIDE Horizontal Rectangle Container - EXPANDED WIDTH */}
                <div style={{
                  background: 'hsl(40 33% 97% / 0.03)',
                  border: '1px solid hsl(40 33% 97% / 0.1)',
                  borderRadius: 14,
                  padding: '20px 24px',
                  marginBottom: 24,
                  maxWidth: '100%',
                }}>
                  {/* 3 COLUMNS for WIDE layout - LESS HEIGHT */}
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                    gap: '12px 20px',
                    columnCount: 3,
                  }}>
                    {visibleFeatures.map((f, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                        }}
                      >
                        <div style={{
                          width: 16, 
                          height: 16, 
                          borderRadius: '50%',
                          background: grad,
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0, 
                          marginTop: 3,
                        }}>
                          <Check size={9} color="#fff" strokeWidth={3} />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                            {f.badge && (
                              <span style={{
                                background: 'hsl(40 80% 55% / 0.15)',
                                color: 'hsl(40,90%,65%)',
                                border: '1px solid hsl(40 80% 55% / 0.3)',
                                padding: '2px 7px', 
                                borderRadius: 4,
                                fontSize: '0.6rem', 
                                fontWeight: 800, 
                                textTransform: 'uppercase',
                                fontFamily: 'monospace', 
                                letterSpacing: '0.03em',
                                flexShrink: 0,
                              }}>
                                {f.badge}
                              </span>
                            )}
                            <span style={{ 
                              color: 'hsl(40,33%,97%)', 
                              fontSize: '0.825rem', 
                              fontWeight: 700, 
                              lineHeight: 1.3,
                            }}>
                              {f.title}
                            </span>
                          </div>
                          {f.detail && (
                            <span style={{ 
                              color: 'hsl(40 33% 97% / 0.55)', 
                              fontSize: '0.75rem', 
                              lineHeight: 1.4,
                            }}>
                              {f.detail}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* "See full breakdown" button */}
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                  <button
                    id="pricing-many-more-btn"
                    onClick={() => setShowModal(true)}
                    style={{
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 6,
                      padding: '10px 20px',
                      borderRadius: 999,
                      background: 'hsl(30 80% 55% / 0.15)',
                      border: '1px solid hsl(30 80% 55% / 0.4)',
                      color: 'hsl(30,80%,70%)',
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      cursor: 'pointer', 
                      letterSpacing: '0.02em',
                      transition: 'all 0.2s',
                      fontFamily: "'Space Grotesk',sans-serif",
                    }}
                    onMouseEnter={e => { 
                      (e.currentTarget as HTMLButtonElement).style.background = 'hsl(30 80% 55% / 0.25)';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => { 
                      (e.currentTarget as HTMLButtonElement).style.background = 'hsl(30 80% 55% / 0.15)';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                    }}
                  >
                    <ChevronRight size={14} />
                    See Full 29 Deliverables Breakdown
                  </button>
                </div>

                {/* Disclaimer Link */}
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <button
                    onClick={() => setShowDisclaimer(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'hsl(40 33% 97% / 0.5)',
                      fontSize: '0.8rem',
                      fontFamily: "'Space Grotesk',sans-serif",
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                      transition: 'color 0.2s',
                      padding: 0,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'hsl(40 33% 97% / 0.8)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'hsl(40 33% 97% / 0.5)'; }}
                  >
                    Disclaimer
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
