'use client';
import { Users, FileText, Star, ShieldAlert } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const stats = [
  { icon:Users, value:'50,000+', label:'People Stopped Guessing' },
  { icon:Star, value:'4.9/5', label:'Brutally Honest Rating' },
  { icon:FileText, value:'Detailed', label:'Personalized Reality Check' },
  { icon:ShieldAlert, value:'0', label:'Scammy Gemstones Sold' },
];

export default function SocialProofBar() {
  return (
    <section style={{ padding:'4rem 1.5rem', background:'hsl(40 20% 92% / 0.5)' }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <AnimatedSection>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:32 }} className="nl-social-grid">
            {stats.map((s,i)=>(
              <div key={i} style={{ textAlign:'center' }}>
                <s.icon size={24} color="hsl(30,80%,55%)" style={{ margin:'0 auto 8px' }} />
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:700, color:'hsl(240,20%,8%)' }}>{s.value}</div>
                <div style={{ fontSize:'0.875rem', color:'hsl(240,10%,46%)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
      <style>{`@media(min-width:768px){.nl-social-grid{grid-template-columns:repeat(4,1fr)!important}}`}</style>
    </section>
  );
}
