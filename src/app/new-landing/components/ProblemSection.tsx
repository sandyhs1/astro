'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, Skull, HandCoins, ShieldAlert, Lock, Baby, Key, Zap } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const scams = [
  { id: 'shani', Icon: AlertTriangle, title: '"Shani is angry with you"', desc: 'Classic opener. Next step? A ₹11,000 puja and a sapphire ring you literally can\'t afford. Shani isn\'t angry. Your astrologer\'s credit card bill is just due.', color:'hsl(5,90%,55%)' },
  { id: 'manglik', Icon: Skull, title: '"You have Manglik Dosha"', desc: 'Translation: \'Pay me or die alone.\' Almost half the country is technically Manglik. If it were a real death sentence, humanity would have ended centuries ago.', color:'hsl(15,85%,55%)' },
  { id: 'gemstone', Icon: HandCoins, title: '"Wear this ₹50k gemstone"', desc: 'They get a 30% cut from the jeweler. The rock does absolutely nothing. Your bank account, however, will feel the burn for months.', color:'hsl(30,85%,50%)' },
  { id: '7years', Icon: ShieldAlert, title: '"Bad period for 7.5 years"', desc: 'The ultimate fear weapon. They\'ll sell you 7 years of fake remedies. What they won\'t tell you? Some of your biggest career wins could happen right in the middle of it.', color:'hsl(270,70%,60%)' },
  { id: 'kalsarpa', Icon: Lock, title: 'The "Kalsarpa" Invention', desc: 'This "dosha" does not exist in the classical Brihat Parashara Hora Shastra. It was popularized in the last century specifically to sell expensive temple rituals. It\'s a modern revenue-generator.', color:'hsl(200,80%,50%)' },
  { id: 'gandmool', Icon: Baby, title: 'The "Gandmool" Newborn Scare', desc: 'Telling parents their newborn baby is "dangerous" for the father or maternal uncle. This forces a 27-day ritual. It preys on parental anxiety at the most vulnerable moment of birth.', color:'hsl(340,80%,55%)' },
  { id: 'rajayoga', Icon: Key, title: 'The "Locked Rajayoga" Dangler', desc: 'Telling a user they have the "chart of a billionaire" but it is "locked" by a specific planet. The astrologer offers to "unlock" it with a ritual. You can\'t bribe a planet to arrive early.', color:'hsl(45,95%,45%)' },
  { id: 'markesh', Icon: Zap, title: 'The "Markesh" Death Threat', desc: 'Telling a client they are in a "death-inflicting" period. This is the ultimate high-ticket close. Fact: Markesh usually just means a period of high expenditure or low energy.', color:'hsl(0,85%,55%)' },
];

export default function ProblemSection() {
  return (
    <section id="problem" style={{ padding:'7rem 1.5rem', background:'linear-gradient(to bottom, hsl(40,33%,98%), hsl(40,20%,95%))', position:'relative' }}>
      
      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>
        <AnimatedSection>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display:'inline-block', padding:'0.35rem 1rem', borderRadius:4, background:'hsl(5,90%,96%)', border:'1px solid hsl(5,90%,85%)', marginBottom:24 }}
            >
              <span style={{ fontSize:'0.75rem', fontWeight:800, color:'hsl(5,90%,55%)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Targeted Operations</span>
            </motion.div>
            
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:800, color:'hsl(240,20%,8%)', marginBottom:16, lineHeight:1.15, letterSpacing:'-0.02em' }}>
              The industry is a <br className="lg:hidden" />
              <span style={{ color:'hsl(5,90%,60%)' }}>$4.5+ Billion</span> fear factory.
            </h2>
            <p style={{ color:'hsl(240,10%,35%)', fontSize:'1.1rem', maxWidth:600, margin:'0 auto', lineHeight:1.6, fontWeight:500 }}>
              They read your insecurities, not your chart. Here is exactly how millions are systemically manipulated daily.
            </p>
          </div>
        </AnimatedSection>

        {/* Premium 2-Column Grid Layout */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          {scams.map(({id, Icon, title, desc, color}, index) => (
            <AnimatedSection key={id} delay={index * 0.08}>
              <motion.div 
                whileHover={{ y: -2, borderColor: 'hsl(240,10%,80%)', boxShadow: '0 12px 24px -12px rgba(0,0,0,0.06)' }}
                style={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  padding: '28px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid hsl(240,15%,90%)',
                  height: '100%',
                  boxShadow: '0 4px 12px -8px rgba(0,0,0,0.05)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Minimalist Icon Block */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 8, 
                    background: 'hsl(240,20%,98%)',
                    border: '1px solid hsl(240,15%,90%)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                  }}>
                    <Icon size={22} color={color} strokeWidth={2} />
                  </div>
                </div>

                {/* Content Block */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontFamily: "'Space Grotesk',sans-serif", 
                    fontSize: '1.15rem', 
                    fontWeight: 700, 
                    color: 'hsl(240,25%,15%)', 
                    marginBottom: '8px',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em'
                  }}>
                    {title}
                  </h3>
                  <p style={{ 
                    color: 'hsl(240,15%,40%)', 
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {desc}
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            div[style*="gridTemplateColumns"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
