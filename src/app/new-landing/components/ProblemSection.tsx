'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, Skull, HandCoins, ShieldAlert } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const scams = [
  { Icon: AlertTriangle, title: '"Shani is angry with you"', desc: 'Classic opener. Next step? A ₹11,000 puja and a sapphire ring you literally can\'t afford. Shani isn\'t angry. Your astrologer\'s credit card bill is just due.', color:'hsl(5,90%,62%)', bg:'hsl(5 90% 62% / 0.1)' },
  { Icon: Skull, title: '"You have Manglik Dosha"', desc: 'Translation: \'Pay me or die alone.\' Almost half the country is technically Manglik. If it were a real death sentence, humanity would have ended centuries ago.', color:'hsl(15,85%,58%)', bg:'hsl(15 85% 58% / 0.1)' },
  { Icon: HandCoins, title: '"Wear this ₹50k gemstone"', desc: 'They get a 30% cut from the jeweler. The rock does absolutely nothing. Your bank account, however, will feel the burn for months.', color:'hsl(30,80%,55%)', bg:'hsl(30 80% 55% / 0.1)' },
  { Icon: ShieldAlert, title: '"Bad period for 7.5 years"', desc: 'The ultimate fear weapon. They\'ll sell you 7 years of fake remedies. What they won\'t tell you? Some of your biggest career wins could happen right in the middle of it.', color:'hsl(270,60%,40%)', bg:'hsl(270 60% 40% / 0.1)' },
];

export default function ProblemSection() {
  return (
    <section id="problem" style={{ padding:'6rem 1.5rem', background:'hsl(40,33%,97%)' }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span style={{ display:'inline-block', padding:'0.375rem 1rem', borderRadius:999, background:'hsl(5 90% 62% / 0.1)', color:'hsl(5,90%,62%)', fontSize:'0.875rem', fontWeight:600, marginBottom:16 }}>THE UGLY TRUTH</span>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:700, color:'hsl(240,20%,8%)', marginBottom:16 }}>
              The industry is a<br/>
              <span style={{ background:'linear-gradient(135deg,hsl(30,80%,55%),hsl(15,85%,58%),hsl(5,90%,62%))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>₹50,000 crore fear factory.</span>
            </h2>
            <p style={{ color:'hsl(240,10%,46%)', fontSize:'1.125rem', maxWidth:600, margin:'0 auto' }}>They don't read your chart. They read your insecurities. Here's exactly how they hustle millions of Indians every single day.</p>
          </div>
        </AnimatedSection>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
          {scams.map(({Icon,title,desc,color,bg},i)=>(
            <AnimatedSection key={i} delay={i*0.1}>
              <motion.div whileHover={{y:-6,scale:1.02}} style={{ padding:32, borderRadius:16, background:'#fff', border:'1px solid hsl(40,15%,88%)', boxShadow:'0 10px 40px -10px hsl(240 20% 8% / 0.08)', cursor:'default' }}>
                <div style={{ width:48, height:48, borderRadius:12, background:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                  <Icon size={24} color={color} />
                </div>
                <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'hsl(240,20%,8%)', marginBottom:12 }}>{title}</h3>
                <p style={{ color:'hsl(240,10%,46%)', lineHeight:1.7 }}>{desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
