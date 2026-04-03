'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const cards = [
  { title:'The Big Picture', desc:'Know exactly what phase of life you are currently swimming in. Stop pushing for a massive career peak if your current phase demands quiet building and saving cash.', grad:'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))' },
  { title:'The Shocks (Good & Bad)', desc:'Sudden job loss, unexpected medical bills, or landing a client that changes everything. We map out the exact months these massive disruptions will hit.', grad:'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%))' },
  { title:'The Green Light Windows', desc:'The 2-3 months a year where the universe actually gets out of your way. This is when you launch the business, ask for the promotion, or move cities.', grad:'linear-gradient(135deg,hsl(30,80%,55%),hsl(15,85%,58%),hsl(5,90%,62%))' },
  { title:'Your Self-Sabotage Profile', desc:'Why do you keep dating emotionally unavailable people? Why does your temper ruin your best opportunities? We map your wiring so you can finally stop destroying your own life.', grad:'linear-gradient(135deg,hsl(42,90%,55%),hsl(30,80%,55%))' },
];

export default function StackCardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  return (
    <section ref={containerRef} style={{ position:'relative', height:`${(cards.length + 1) * 100}vh`, background:'#FAFAF7' }}>
      <div style={{ position:'sticky', top:0, height:'100vh', display:'flex', alignItems:'center', overflow:'hidden' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 1.5rem', width:'100%' }}>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:700, color:'hsl(240,20%,8%)', textAlign:'center', marginBottom:48 }}>
            What you actually<br/>
            <span style={{ background:'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>get in the report.</span>
          </h2>
          <div style={{ position:'relative', height:480 }}>
            {cards.map((c, i) => {
              const progress = useTransform(scrollYProgress, [i / cards.length, (i + 1) / cards.length], [0, 1]);
              const y = useTransform(progress, [0, 1], [300, 0]);
              const scale = useTransform(scrollYProgress, [(i + 1) / cards.length, (i + 2) / cards.length], [1, 0.9]);
              const opacity = useTransform(scrollYProgress, [(i + 1) / cards.length, (i + 2) / cards.length], [1, 0.5]);

              return (
                <motion.div key={i} style={{ y: i === 0 ? 0 : y, scale, opacity: i === cards.length - 1 ? 1 : opacity, position:'absolute', inset:0, padding:'clamp(24px, 6vw, 40px)', borderRadius:24, background:c.grad, color:'hsl(40,33%,97%)', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                  <span style={{ fontSize:'0.875rem', fontWeight:500, opacity:0.7, textTransform:'uppercase', letterSpacing:'0.05em' }}>Component {i + 1}</span>
                  <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.5rem,4vw,3rem)', fontWeight:700, marginTop:12, marginBottom:12 }}>{c.title}</h3>
                  <p style={{ fontSize:'clamp(0.95rem, 3.5vw, 1.125rem)', opacity:0.85, maxWidth:600, lineHeight:1.6 }}>{c.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
