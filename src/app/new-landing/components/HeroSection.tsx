'use client';
import { motion } from 'framer-motion';
import { ArrowDown, Zap } from 'lucide-react';
import Image from 'next/image';
import { useOnboarding } from '@/context/OnboardingContext';

export default function HeroSection() {
  const { openModal } = useOnboarding();
  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';
  return (
    <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', paddingTop:80 }}>
      <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:80, left:40, width:384, height:384, borderRadius:'50%', background:'hsl(245 60% 28% / 0.05)', filter:'blur(60px)', animation:'nl-float 6s ease-in-out infinite' }} />
        <div style={{ position:'absolute', bottom:80, right:40, width:320, height:320, borderRadius:'50%', background:'hsl(30 80% 55% / 0.1)', filter:'blur(60px)', animation:'nl-float 6s ease-in-out infinite', animationDelay:'2s' }} />
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:'hsl(270 60% 40% / 0.05)', filter:'blur(80px)' }} />
      </div>
      <div style={{ position:'relative', maxWidth:1280, margin:'0 auto', padding:'0 1.5rem', display:'grid', gridTemplateColumns:'1fr', gap:48, alignItems:'center' }} className="nl-hero-grid">
        <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6}}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'0.5rem 1rem', borderRadius:999, background:'hsl(245 60% 28% / 0.1)', border:'1px solid hsl(245 60% 28% / 0.2)', width:'fit-content' }} className="nl-hero-badge">
            <Zap size={16} color="hsl(30,80%,55%)" />
            <span style={{ fontSize:'0.875rem', fontWeight:500, color:'hsl(245,60%,28%)' }} className="nl-hero-badge-text">No sugarcoating. Just hard facts.</span>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.1}}
            style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(3rem,8vw,5.5rem)', fontWeight:700, lineHeight:0.95, letterSpacing:'-0.02em', color:'hsl(240,20%,8%)' }}>
            Know the hit<br/>before you<br/>
            <span style={{ background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>take the fall.</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.3}}
            style={{ fontSize:'1.125rem', color:'hsl(240,10%,46%)', maxWidth:480, lineHeight:1.7 }} className="nl-hero-subtext">
            The astrology industry sells you fear wrapped in gemstones. <span style={{ color:'hsl(240,20%,8%)', fontWeight:600 }}>Quantum Karma</span> gives you the actual blueprint — your triggers, your peak phases, your strike windows. No pandit required.
          </motion.p>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.5}}
            style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
            <motion.button onClick={openModal} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
              style={{ background:grad, color:'hsl(40,33%,97%)', padding:'1rem 2rem', borderRadius:999, fontWeight:700, border:'none', cursor:'pointer', boxShadow:'0 0 60px -15px hsl(245 80% 65% / 0.4)' }} className="nl-hero-btn-primary">
              Get Your Report Now →
            </motion.button>
            <motion.button onClick={(e) => { e.preventDefault(); document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' }); }} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
              style={{ border:'2px solid hsl(240 20% 8% / 0.2)', color:'hsl(240,20%,8%)', padding:'1rem 2rem', borderRadius:999, fontWeight:600, cursor:'pointer', background:'transparent' }} className="nl-hero-btn-secondary">
              See why you keep failing
            </motion.button>
          </motion.div>
        </div>
        <motion.div initial={{opacity:0,scale:0.8,rotate:-10}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:1,delay:0.3,ease:'easeOut'}}
          style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ position:'relative' }}>
            <Image src="/cosmic-mandala.png" alt="Quantum Karma cosmic mandala" width={500} height={500}
              style={{ width:'100%', maxWidth:480, animation:'nl-spin-slow 20s linear infinite' }} />
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', animation:'nl-pulse-glow 3s ease-in-out infinite' }} />
          </div>
        </motion.div>
      </div>
      <motion.div animate={{y:[0,10,0]}} transition={{duration:2,repeat:Infinity}}
        style={{ position:'absolute', bottom:40, left:'50%', transform:'translateX(-50%)' }}>
        <ArrowDown size={24} color="hsl(240,10%,46%)" />
      </motion.div>
      <style>{`
        @media(min-width:1024px){.nl-hero-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:767px){
          .nl-hero-badge-text{font-size:0.75rem!important}
          .nl-hero-subtext{font-size:0.95rem!important;line-height:1.6!important}
          .nl-hero-btn-primary{padding:0.8rem 1.5rem!important;font-size:0.875rem!important}
          .nl-hero-btn-secondary{padding:0.8rem 1.5rem!important;font-size:0.875rem!important}
        }
      `}</style>
    </section>
  );
}
