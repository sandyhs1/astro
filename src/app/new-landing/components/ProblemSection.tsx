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
    <section id="problem" style={{ padding:'6rem 1.5rem', background:'linear-gradient(180deg, hsl(40,33%,97%) 0%, hsl(40,20%,94%) 100%)', position:'relative', overflow:'hidden' }}>
      {/* Decorative background elements */}
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'40%', height:'60%', background:'radial-gradient(circle, hsl(5,90%,62%,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:'40%', height:'60%', background:'radial-gradient(circle, hsl(270,60%,40%,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
      
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

        {/* Enhanced Grid with better spacing and visual hierarchy */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%, 320px),1fr))', gap:28, marginBottom:48 }}>
          {scams.map(({Icon,title,desc,color,bg},i)=>(
            <AnimatedSection key={i} delay={i*0.08}>
              <motion.div 
                whileHover={{y:-8, scale:1.02, boxShadow:'0 20px 60px -10px hsl(240 20% 8% / 0.15)'}} 
                transition={{ type:'spring', stiffness:300, damping:20 }}
                style={{ 
                  padding:'32px 28px', 
                  borderRadius:20, 
                  background:'#fff', 
                  border:`2px solid ${bg.replace('0.1', '0.2')}`,
                  boxShadow:'0 10px 40px -10px hsl(240 20% 8% / 0.08)', 
                  cursor:'default',
                  position:'relative',
                  overflow:'hidden',
                  height:'100%',
                  display:'flex',
                  flexDirection:'column'
                }}
              >
                {/* Decorative corner accent */}
                <div style={{ position:'absolute', top:0, right:0, width:80, height:80, background:`linear-gradient(135deg, ${bg}, transparent)`, borderRadius:'0 20px 0 100%', opacity:0.4 }} />
                
                {/* Icon with enhanced styling */}
                <div style={{ 
                  width:56, 
                  height:56, 
                  borderRadius:14, 
                  background:`linear-gradient(135deg, ${bg}, ${bg.replace('0.1', '0.2')})`, 
                  display:'flex', 
                  alignItems:'center', 
                  justifyContent:'center', 
                  marginBottom:20,
                  boxShadow:`0 8px 20px -8px ${color}`,
                  position:'relative',
                  zIndex:1
                }}>
                  <Icon size={28} color={color} strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div style={{ flex:1, display:'flex', flexDirection:'column', position:'relative', zIndex:1 }}>
                  <h3 style={{ 
                    fontFamily:"'Space Grotesk',sans-serif", 
                    fontSize:'1.15rem', 
                    fontWeight:700, 
                    color:'hsl(240,20%,8%)', 
                    marginBottom:12,
                    lineHeight:1.3
                  }}>
                    {title}
                  </h3>
                  <p style={{ 
                    color:'hsl(240,10%,46%)', 
                    lineHeight:1.7, 
                    fontSize:'0.95rem',
                    margin:0
                  }}>
                    {desc}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div style={{ 
                  position:'absolute', 
                  bottom:0, 
                  left:0, 
                  right:0, 
                  height:3, 
                  background:`linear-gradient(90deg, ${color}, transparent)`,
                  opacity:0.6
                }} />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Call-to-action footer */}
        <AnimatedSection delay={0.6}>
          <motion.div
            whileHover={{ scale:1.02 }}
            style={{
              textAlign:'center',
              padding:'32px 40px',
              borderRadius:20,
              background:'linear-gradient(135deg, hsl(240,20%,8%), hsl(245,60%,28%))',
              border:'1px solid hsl(240,15%,15%)',
              boxShadow:'0 20px 60px -15px hsl(240,20%,8%,0.4)',
              position:'relative',
              overflow:'hidden'
            }}
          >
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 30% 50%, hsl(30,80%,55%,0.1), transparent 60%)', pointerEvents:'none' }} />
            <p style={{ 
              fontFamily:"'Space Grotesk',sans-serif", 
              fontSize:'1.25rem', 
              fontWeight:600, 
              color:'hsl(40,33%,97%)', 
              margin:0,
              position:'relative',
              zIndex:1
            }}>
              Ready to see what <span style={{ color:'hsl(30,80%,55%)', fontWeight:700 }}>real astrology</span> looks like?
            </p>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
