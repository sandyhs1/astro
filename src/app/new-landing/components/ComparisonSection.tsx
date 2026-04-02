'use client';
import { motion } from 'framer-motion';
import { X, Check, Sparkles } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const comp = [
  { f:'Actually reads your exact data points', t:false, u:true },
  { f:'Blames your problems on "Doshas"', t:true, u:false },
  { f:'Tells you to buy a ₹10,000 ring', t:true, u:false },
  { f:'Tells you exactly which month you might get laid off', t:false, u:true },
  { f:'Explains why your last relationship failed', t:false, u:true },
  { f:'Secretly takes a 30% cut from the jeweler', t:true, u:false },
  { f:'50+ pages of hard data and timelines', t:false, u:true },
  { f:'Actionable advice for your bank account', t:false, u:true },
  { f:'One-time honest price', t:false, u:true },
];

export default function ComparisonSection() {
  return (
    <section style={{ padding:'6rem 1.5rem', background:'hsl(40,25%,95%)' }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span style={{ display:'inline-block', padding:'0.375rem 1rem', borderRadius:999, background:'hsl(30 80% 55% / 0.1)', color:'hsl(30,80%,55%)', fontSize:'0.875rem', fontWeight:600, marginBottom:16 }}>THE DIFFERENCE</span>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:700, color:'hsl(240,20%,8%)' }}>
              Them vs. <span style={{ background:'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Us.</span>
            </h2>
            <p style={{ color:'hsl(240,10%,46%)', fontSize:'1.125rem' }}>Spoiler: they want to keep you scared.</p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div style={{ borderRadius:16, border:'1px solid hsl(40,15%,88%)', overflow:'hidden', background:'#fff', boxShadow:'0 10px 40px -10px hsl(240 20% 8% / 0.08)' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px', padding:'1rem 1.5rem', background:'hsl(40 20% 92% / 0.5)', borderBottom:'1px solid hsl(40,15%,88%)' }} className="nl-comp-header">
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, color:'hsl(240,10%,46%)' }}>Reality</span>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, color:'hsl(5,90%,62%)', textAlign:'center' }}>Them</span>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, color:'hsl(245,60%,28%)', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}><Sparkles size={16} /> Us</span>
            </div>
            {comp.map((r,i)=>(
              <motion.div key={i} initial={{opacity:0}} whileInView={{opacity:1}} transition={{delay:i*0.05}} viewport={{once:true}}
                style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px', padding:'1rem 1.5rem', borderBottom:'1px solid hsl(40,15%,88%)' }} className="nl-comp-row">
                <span style={{ color:'hsl(240,20%,8%)' }}>{r.f}</span>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <span style={{ width:32, height:32, borderRadius:'50%', background:r.t ? 'hsl(5 90% 62% / 0.1)' : 'hsl(40 20% 92%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {r.t ? <Check size={16} color="hsl(5,90%,62%)" /> : <X size={16} color="hsl(240,10%,46%)" />}
                  </span>
                </div>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <span style={{ width:32, height:32, borderRadius:'50%', background:r.u ? 'hsl(150 25% 45% / 0.1)' : 'hsl(40 20% 92%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {r.u ? <Check size={16} color="hsl(150,25%,45%)" /> : <X size={16} color="hsl(240,10%,46%)" />}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
      <style>{`@media(min-width:768px){.nl-comp-header,.nl-comp-row{grid-template-columns:1fr 150px 150px!important}}`}</style>
    </section>
  );
}
