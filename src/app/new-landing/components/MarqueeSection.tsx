'use client';
const phrases = ['NO BS. NO CRYSTALS.','NO ₹21,000 RINGS','NO FAKE REMEDIES','NO "SHANI IS ANGRY" SCAMS','KNOW WHEN YOU\'LL GET FIRED','KNOW WHEN YOU\'LL GO BROKE','JUST RAW DATA','JUST REAL TIMELINES'];
export default function MarqueeSection() {
  return (
    <section style={{ padding:'1.5rem 0', background:'hsl(240,20%,8%)', overflow:'hidden' }}>
      <div style={{ display:'flex', whiteSpace:'nowrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:32, animation:'nl-marquee 30s linear infinite' }}>
          {[...phrases,...phrases].map((p,i)=>(
            <span key={i} style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'hsl(40,33%,97%)', display:'flex', alignItems:'center', gap:32 }}>
              {p}<span style={{ color:'hsl(30,80%,55%)' }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
