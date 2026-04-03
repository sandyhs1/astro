'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, X, ChevronRight, MessageCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useOnboarding } from '@/context/OnboardingContext';

// ─── DATA ───────────────────────────────────────────────────────────────────

// First 3 rows (visible features - showing ~9 features in 3 columns = 3 rows)
const visibleFeatures = [
  { badge: 'Amatyakaraka', title: 'Amatyakaraka (AmK) Pivot Timing', detail: 'Identifying the exact Antardasha windows when your professional authority planet triggers a status shift.' },
  { badge: '10th House', title: '10th House Power Windows', detail: 'Mapping the specific months where planetary Dig Bala (directional strength) favors a move over stagnation.' },
  { badge: 'Dasamsa', title: 'Dasamsa (D-10) Structural Audit', detail: 'A cold analysis of your professional varga to determine if your karma supports leadership or specialized labor.' },
  { badge: 'Upapada', title: 'Upapada Lagna (UL) Contract Integrity', detail: 'Predicting the functional lifespan and legal stability of marital unions based on the UL and its Padas.' },
  { badge: 'Darakaraka', title: 'Darakaraka (DK) Persona Mapping', detail: 'Decoding the psychological archetype of your partner and the specific timing of the 7th House activation.' },
  { badge: 'Navamsa', title: 'Navamsa (D-9) Fruit Analysis', detail: 'Revealing the "hidden" quality of your relationships—what manifests after the initial attraction phase ends.' },
  { badge: 'Indu', title: 'Indu Lagna Prosperity Surge', detail: 'Pinpointing the specific planetary periods mathematically wired for sudden financial inflow and asset accumulation.' },
  { badge: 'Ashtakvarga', title: 'Ashtakvarga Energy Budgeting', detail: 'A numerical breakdown of your wealth houses to predict months of financial "leakage" vs. "retention."' },
  { badge: 'Hora', title: 'Hora (D-2) Wealth Segregation', detail: 'Identifying if your chart is optimized for active income (labor) or passive wealth (investments/inheritance).' },
];

// All features (for modal)
const allFeatures = [
  { badge: 'Amatyakaraka', title: 'Amatyakaraka (AmK) Pivot Timing', detail: 'Identifying the exact Antardasha windows when your professional authority planet triggers a status shift.' },
  { badge: '10th House', title: '10th House Power Windows', detail: 'Mapping the specific months where planetary Dig Bala (directional strength) favors a move over stagnation.' },
  { badge: 'Dasamsa', title: 'Dasamsa (D-10) Structural Audit', detail: 'A cold analysis of your professional varga to determine if your karma supports leadership or specialized labor.' },
  { badge: 'Upapada', title: 'Upapada Lagna (UL) Contract Integrity', detail: 'Predicting the functional lifespan and legal stability of marital unions based on the UL and its Padas.' },
  { badge: 'Darakaraka', title: 'Darakaraka (DK) Persona Mapping', detail: 'Decoding the psychological archetype of your partner and the specific timing of the 7th House activation.' },
  { badge: 'Navamsa', title: 'Navamsa (D-9) Fruit Analysis', detail: 'Revealing the "hidden" quality of your relationships—what manifests after the initial attraction phase ends.' },
  { badge: 'Indu', title: 'Indu Lagna Prosperity Surge', detail: 'Pinpointing the specific planetary periods mathematically wired for sudden financial inflow and asset accumulation.' },
  { badge: 'Ashtakvarga', title: 'Ashtakvarga Energy Budgeting', detail: 'A numerical breakdown of your wealth houses to predict months of financial "leakage" vs. "retention."' },
  { badge: 'Hora', title: 'Hora (D-2) Wealth Segregation', detail: 'Identifying if your chart is optimized for active income (labor) or passive wealth (investments/inheritance).' },
  { badge: 'Arudha', title: 'Arudha Lagna (AL) Market Perception', detail: 'Aligning your public brand and "image" timing with the strength of your AL and 11th house gains.' },
  { badge: 'Chara', title: 'Chara Dasha Exit Windows', detail: 'Using Jaimini systems to predict the most favorable years for business pivots, scaling, or high-value exits.' },
  { badge: '6th House', title: '6th House Litigation Shield', detail: 'Mapping potential windows for tax audits, legal friction, or hidden workplace sabotage before they hit.' },
  { badge: 'Badhaka', title: 'Badhaka & Maraka Risk Mapping', detail: 'Locating the planetary periods where your physical vitality reaches a structural low in the Bhava Chalit.' },
  { badge: '8th House', title: '8th House Transformation Triggers', detail: 'Predicting periods of sudden physical or psychological upheaval that demand immediate "neutralization."' },
  { badge: 'Shastiamsa', title: 'Shastiamsa (D-60) Event Timeline', detail: 'Accessing the most sensitive divisional chart to explain "Act of God" events and inexplicable life shifts.' },
  { badge: 'Atmakaraka', title: 'Atmakaraka (AK) Soul-Mandate', detail: 'Identifying the "King" of your chart and the specific psychological hunger that drives your decision-making.' },
  { badge: 'Karmic', title: 'Karmic Shadow Coding', detail: 'Using the Saturn/Ketu axis to identify the subconscious self-sabotage loops that repeat every 9 or 18 years.' },
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
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';

  return (
    <>
      {/* Modals */}
      {showModal && (
        <RawFeaturesModal
          onClose={() => setShowModal(false)}
          openModal={openModal}
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
                        No gemstones. No pujas. No motives.
                      </p>
                      <p style={{ 
                        margin: '2px 0 0', 
                        fontSize: '0.72rem', 
                        color: 'hsl(40 33% 97% / 0.6)', 
                        lineHeight: 1.3 
                      }}>
                        Just powerful custom mantras & DIY rituals.
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
                  onClick={openModal}
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
                    See Full 30+ Deliverables Breakdown
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
