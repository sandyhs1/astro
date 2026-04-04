'use client';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

const stats = [
  { number:'$58B+', label:'India\'s Rituals/Remedies Market', sub:'Built on fear' },
  { number:'89%', label:'Recommend expensive gems', sub:'With zero data to back it up' },
  { number:'3 in 4', label:'Indians consulted astrologers', sub:'And got absolutely scammed' },
  { number:'₹15,000+', label:'Avg. spent on remedies/yr', sub:'Per worried individual' },
];

export default function FearFactorySection() {
  return (
    <section style={{ padding:'6rem 1.5rem', background:'hsl(240,20%,8%)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, opacity:0.1, pointerEvents:'none' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 30% 20%, hsl(270,60%,40%), transparent 50%)' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 70% 80%, hsl(30,80%,55%), transparent 50%)' }} />
      </div>
      <div style={{ maxWidth:1280, margin:'0 auto', position:'relative' }}>
        <AnimatedSection>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:700, color:'hsl(40,33%,97%)', marginBottom:16 }}>
              How deep does the<br/><span style={{ color:'hsl(30,80%,55%)' }}>rabbit hole</span> go?
            </h2>
            <p style={{ color:'hsl(40 33% 97% / 0.6)', fontSize:'1.125rem', maxWidth:500, margin:'0 auto' }}>Numbers that should make every Indian sick. This isn't astrology. It's organized emotional extortion.</p>
          </div>
        </AnimatedSection>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:24 }}>
          {stats.map((s,i)=>(
            <AnimatedSection key={i} delay={i*0.1}>
              <motion.div whileHover={{scale:1.05}} style={{ padding:32, borderRadius:16, border:'1px solid hsl(40 33% 97% / 0.1)', background:'hsl(40 33% 97% / 0.05)', backdropFilter:'blur(10px)', textAlign:'center' }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, color:'hsl(30,80%,55%)', marginBottom:8 }}>{s.number}</div>
                <div style={{ color:'hsl(40,33%,97%)', fontWeight:600, marginBottom:4 }}>{s.label}</div>
                <div style={{ color:'hsl(40 33% 97% / 0.5)', fontSize:'0.875rem' }}>{s.sub}</div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
