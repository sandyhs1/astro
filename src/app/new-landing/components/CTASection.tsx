'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useOnboarding } from '@/context/OnboardingContext';

export default function CTASection() {
  const { openModal } = useOnboarding();
  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';
  
  return (
    <section style={{ padding:'8rem 10px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:0, left:'25%', width:384, height:384, borderRadius:'50%', background:'hsl(245 60% 28% / 0.05)', filter:'blur(60px)' }} />
        <div style={{ position:'absolute', bottom:0, right:'25%', width:384, height:384, borderRadius:'50%', background:'hsl(30 80% 55% / 0.1)', filter:'blur(60px)' }} />
      </div>

      <div style={{ maxWidth:'100%', margin:'0 auto', textAlign:'center', position:'relative', padding:'0 5px' }}>
        <AnimatedSection>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:32 }}>
            <motion.div animate={{rotate:[0,5,-5,0]}} transition={{duration:4,repeat:Infinity}}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', width:80, height:80, borderRadius:24, background:grad, boxShadow:'0 0 60px -15px hsl(245 80% 65% / 0.4)' }}>
              <Sparkles size={40} color="hsl(40,33%,97%)" />
            </motion.div>
            
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.8rem,7vw,4.5rem)', fontWeight:700, color:'hsl(240,20%,8%)', lineHeight:1.1 }}>
              Your chart isn't mystical.<br />
              <span style={{ background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>It's just data.</span>
            </h2>
            
            <p style={{ fontSize:'clamp(1rem, 4vw, 1.25rem)', color:'hsl(240,10%,46%)', maxWidth:900, margin:'0 auto', lineHeight:1.7 }}>
              Stop paying for fear. Start investing in clarity. Your Quantum Karma report is waiting and it's got more truth than most astrologers deliver in a lifetime.
            </p>
            
            <motion.button onClick={openModal} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
              style={{ display:'inline-block', background:grad, color:'hsl(40,33%,97%)', padding:'1.25rem 2.5rem', borderRadius:999, fontSize:'1.125rem', fontWeight:700, border:'none', cursor:'pointer', boxShadow:'0 0 60px -15px hsl(245 80% 65% / 0.4)' }}>
              Get Your Report Now →
            </motion.button>
            
            <p style={{ fontSize:'0.875rem', color:'hsl(240,10%,46%)' }}>Join 50,000+ people who decided to stop guessing. ⚡</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
