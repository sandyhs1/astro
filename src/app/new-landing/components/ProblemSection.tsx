'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, Skull, HandCoins, ShieldAlert, Lock, Baby, Key, Zap } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const scams = [
  { Icon: AlertTriangle, title: '"Shani is angry with you"', desc: 'Classic opener. Next step? A ₹11,000 puja and a sapphire ring you literally can\'t afford. Shani isn\'t angry. Your astrologer\'s credit card bill is just due.', color:'hsl(5,90%,62%)', bg:'hsl(5 90% 62% / 0.1)' },
  { Icon: Skull, title: '"You have Manglik Dosha"', desc: 'Translation: \'Pay me or die alone.\' Almost half the country is technically Manglik. If it were a real death sentence, humanity would have ended centuries ago.', color:'hsl(15,85%,58%)', bg:'hsl(15 85% 58% / 0.1)' },
  { Icon: HandCoins, title: '"Wear this ₹50k gemstone"', desc: 'They get a 30% cut from the jeweler. The rock does absolutely nothing. Your bank account, however, will feel the burn for months.', color:'hsl(30,80%,55%)', bg:'hsl(30 80% 55% / 0.1)' },
  { Icon: ShieldAlert, title: '"Bad period for 7.5 years"', desc: 'The ultimate fear weapon. They\'ll sell you 7 years of fake remedies. What they won\'t tell you? Some of your biggest career wins could happen right in the middle of it.', color:'hsl(270,60%,40%)', bg:'hsl(270 60% 40% / 0.1)' },
  { Icon: Lock, title: 'The "Kalsarpa" Invention', desc: 'This "dosha" does not exist in the classical Brihat Parashara Hora Shastra. It was popularized in the last century specifically to sell expensive temple rituals in Nashik or Kalahasti. It\'s a modern revenue-generator, not an ancient truth.', color:'hsl(200,70%,45%)', bg:'hsl(200 70% 45% / 0.1)' },
  { Icon: Baby, title: 'The "Gandmool" Newborn Scare', desc: 'Telling parents their newborn baby is "dangerous" for the father or maternal uncle. This forces a 27-day ritual. It preys on parental anxiety at the most vulnerable moment of birth.', color:'hsl(340,75%,55%)', bg:'hsl(340 75% 55% / 0.1)' },
  { Icon: Key, title: 'The "Locked Rajayoga" Dangler', desc: 'Telling a user they have the "chart of a billionaire" but it is "locked" by a specific planet. The astrologer then offers to "unlock" it with a ritual. Planets don\'t have padlocks; they have Dashas. You can\'t bribe a planet to arrive early.', color:'hsl(45,90%,50%)', bg:'hsl(45 90% 50% / 0.1)' },
  { Icon: Zap, title: 'The "Markesh" Death Threat', desc: 'Telling a client they are in a "death-inflicting" period. This is the ultimate high-ticket close. Once the user fears for their life, they will pay any amount for a Mahamrityunjaya Japa. Fact: Markesh usually just means a period of high expenditure or low energy.', color:'hsl(0,85%,55%)', bg:'hsl(0 85% 55% / 0.1)' },
];

export default function ProblemSection() {
  return (
    <section id="problem" style={{ padding:'6rem 1.5rem', background:'hsl(40,33%,97%)', position:'relative', overflow:'hidden' }}>
      
      <div style={{ maxWidth:1280, margin:'0 auto', position:'relative' }}>
        <AnimatedSection>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'0.5rem 1.25rem', borderRadius:999, background:'linear-gradient(135deg, hsl(5,90%,62%,0.15), hsl(15,85%,58%,0.15))', border:'1px solid hsl(5,90%,62%,0.3)', marginBottom:20 }}
            >
              <AlertTriangle size={16} color="hsl(5,90%,62%)" />
              <span style={{ fontSize:'0.8rem', fontWeight:700, color:'hsl(5,90%,62%)', textTransform:'uppercase', letterSpacing:'0.1em' }}>THE UGLY TRUTH</span>
            </motion.div>
            
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:800, color:'hsl(240,20%,8%)', marginBottom:20, lineHeight:1.2 }}>
              The industry is a<br/>
              <span style={{ background:'linear-gradient(135deg,hsl(30,80%,55%),hsl(15,85%,58%),hsl(5,90%,62%))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', display:'inline-block' }}>$4.5+ Billion fear factory.</span>
            </h2>
            <p style={{ color:'hsl(240,10%,46%)', fontSize:'1.125rem', maxWidth:650, margin:'0 auto', lineHeight:1.7 }}>
              They don't read your chart. They read your insecurities. Here's exactly how they hustle millions of Indians every single day.
            </p>
          </div>
        </AnimatedSection>

        {/* Grid: 4 boxes per row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:24 }}>
          {scams.map(({Icon,title,desc,color,bg},i)=>(
            <AnimatedSection key={i} delay={i*0.08}>
              <motion.div 
                whileHover={{y:-4, boxShadow:'0 12px 40px -8px hsl(240 20% 8% / 0.12)'}} 
                transition={{ type:'spring', stiffness:300, damping:20 }}
                style={{ 
                  padding:'24px 20px', 
                  borderRadius:16, 
                  background:'#fff', 
                  border:`1px solid ${bg.replace('0.1', '0.15')}`,
                  boxShadow:'0 4px 20px -4px hsl(240 20% 8% / 0.06)', 
                  cursor:'default',
                  position:'relative',
                  overflow:'hidden',
                  height:'100%',
                  display:'flex',
                  flexDirection:'column'
                }}
              >
                {/* Icon */}
                <div style={{ 
                  width:48, 
                  height:48, 
                  borderRadius:12, 
                  background:`linear-gradient(135deg, ${bg}, ${bg.replace('0.1', '0.15')})`, 
                  display:'flex', 
                  alignItems:'center', 
                  justifyContent:'center', 
                  marginBottom:16,
                  position:'relative',
                  zIndex:1
                }}>
                  <Icon size={24} color={color} strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div style={{ flex:1, display:'flex', flexDirection:'column', position:'relative', zIndex:1 }}>
                  <h3 style={{ 
                    fontFamily:"'Space Grotesk',sans-serif", 
                    fontSize:'1.05rem', 
                    fontWeight:700, 
                    color:'hsl(240,20%,8%)', 
                    marginBottom:10,
                    lineHeight:1.3
                  }}>
                    {title}
                  </h3>
                  <p style={{ 
                    color:'hsl(240,10%,46%)', 
                    lineHeight:1.6, 
                    fontSize:'0.9rem',
                    margin:0
                  }}>
                    {desc}
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <style jsx>{`
          @media (max-width: 1024px) {
            div[style*="gridTemplateColumns"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 640px) {
            div[style*="gridTemplateColumns"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
