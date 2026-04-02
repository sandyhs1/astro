'use client';
import { motion } from 'framer-motion';
import { CalendarDays, Cpu, FileText } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const steps = [
  { icon:CalendarDays, step:'01', title:'Drop your data', desc:'Date, time, place of birth. That\'s it. No phone number for telemarketers. No begging you for a review. Just data.' },
  { icon:Cpu, step:'02', title:'We run the math', desc:'We process 10,000+ data points using actual Vedic algorithms. This isn\'t some dude on a computer making it up as he goes.' },
  { icon:FileText, step:'03', title:'Get your reality check', desc:'A 50+ page PDF sent straight to your email. Hard truths, exact dates, and solid warnings about your career, money, and love life.' },
];

export default function HowItWorksSection() {
  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';
  return (
    <section style={{ padding:'6rem 1.5rem', position:'relative', background:'hsl(40 20% 92% / 0.5)' }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span style={{ display:'inline-block', padding:'0.375rem 1rem', borderRadius:999, background:'hsl(245 60% 28% / 0.1)', color:'hsl(245,60%,28%)', fontSize:'0.875rem', fontWeight:600, marginBottom:16 }}>HOW IT WORKS</span>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:700, color:'hsl(240,20%,8%)' }}>
              Three steps.<br/>
              <span style={{ background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Zero BS.</span>
            </h2>
          </div>
        </AnimatedSection>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:32, position:'relative' }} className="nl-steps-grid">
          <div className="nl-steps-line" style={{ position:'absolute', top:96, left:'16%', right:'16%', height:2, background:'linear-gradient(to right,hsl(245,60%,28%),hsl(30,80%,55%),hsl(5,90%,62%))', display:'none' }} />
          {steps.map((s,i)=>(
            <AnimatedSection key={i} delay={i*0.2}>
              <motion.div whileHover={{y:-8}} style={{ position:'relative', padding:32, borderRadius:16, background:'#fff', border:'1px solid hsl(40,15%,88%)', boxShadow:'0 10px 40px -10px hsl(240 20% 8% / 0.08)', textAlign:'center' }}>
                <div style={{ width:64, height:64, borderRadius:16, background:grad, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', position:'relative', zIndex:10 }}>
                  <s.icon size={28} color="hsl(40,33%,97%)" />
                </div>
                <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'4rem', fontWeight:700, color:'hsl(40 20% 92% / 0.5)', position:'absolute', top:16, right:24 }}>{s.step}</span>
                <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.25rem', fontWeight:700, color:'hsl(240,20%,8%)', marginBottom:12 }}>{s.title}</h3>
                <p style={{ color:'hsl(240,10%,46%)', lineHeight:1.7 }}>{s.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
      <style>{`@media(min-width:768px){.nl-steps-line{display:block!important;}}`}</style>
    </section>
  );
}
