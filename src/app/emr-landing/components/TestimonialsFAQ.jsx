"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Plus, Minus, X } from "lucide-react";

/* ── DATA ─────────────────────────────────────────────────────────── */
const row1 = [
  { user:"u/burnout_szn",            time:"3h",  title:"sister is speechless",         content:"Thanku sooooo so much... my sister hardly gets impressed by someone... but literally got impressed with your knowledge. She still can't believe someone can interpret her this accurately. Hrudayapoorvaka Dhanyavaadagalu." },
  { user:"u/chaotic_millennial",     time:"1d",  title:"pure clarity",                  content:"You are amazing! I've been analysing myself for years, but you connected dots I didn't even know existed. The way you explained my career blockages was surgical. No fluff, just pure clarity." },
  { user:"u/corporate_slave_no_more",time:"5h",  title:"reading my soul source code",   content:"This felt like you were reading my soul's source code—exposing the glitches and showing me exactly how to patch them. Truly beyond helpful." },
  { user:"u/relationship_wreck",     time:"12h", title:"honest and straightforward",    content:"Thank you for breaking this down so clearly. A lot of what you pointed out makes sense. I appreciate the straightforward perspective and honesty around expectations during this period." },
  { user:"u/crypto_casualties",      time:"2d",  title:"flabbergasted",                 content:"I'm honestly flabbergasted. No one has ever described me this accurately—not even myself. Every single point felt spot on. I'm genuinely considering printing this out and framing it." },
  { user:"u/sleep_deprived_founder", time:"8h",  title:"marriage clarity",              content:"You got almost everything right. I am still giving this marriage everything and maybe in the end everything works out. Thank you for the advice." },
  { user:"u/data_nerd_validated",    time:"4h",  title:"psycho-spiritual audit",        content:"You are fabulous. The depth of this report is insane—it's not just astrology, it's a full psycho-spiritual audit. I walked in skeptical and walked out a believer. 10/10." },
  { user:"u/scared_but_seen",        time:"2d",  title:"almost too accurate",           content:"Okayyy, almost all of it is accurate. That's scary. Thank you." },
  { user:"u/spot_on_1000",           time:"8h",  title:"1000/10 spot on",               content:"I've never had a reading be sooo spot on. It's a bit scary just how accurate some of these are. 1000/10 thank you!" },
  { user:"u/jaw_on_floor",           time:"2h",  title:"jaw on the floor",              content:"HOLY CRAP. The way my jaw was on the floor reading this. You are so clever and talented wow!!!!!" },
  { user:"u/read_to_filth",          time:"5h",  title:"read to absolute filth",        content:"You just read me to absolute filth and nailed everything farrrrkkk" },
  { user:"u/freakily_correct",       time:"3h",  title:"freaky accurate",               content:"Your reading was literally spot on in every aspect. It's actually a bit freaky just how correct you are! Your gift is incredible and I'm so grateful ☺️" },
];

const row2 = [
  { user:"u/gen_z_chaos",            time:"9h",  title:"literally cried",               content:"Fuck why this is so accurate 🥲 I literally cried for 10 minutes straight. Thank you bub! Means a lot!" },
  { user:"u/midwest_overthinker",    time:"1d",  title:"dragged me but i needed it",    content:"okay i was skeptical bc most astrology is vague trash but this?? dragged me to hell and back in the best way. calling out my commitment issues with actual dates? rude but necessary. i feel seen." },
  { user:"u/toxic_ex_survivor",      time:"7h",  title:"scary accurate timeline",       content:"bro the career timeline is actually scary accurate. said i'd pivot in 2024... i literally handed in my notice last week. how do you know this?? subscriber for life." },
  { user:"u/startup_graveyard",      time:"11h", title:"no toxic positivity",           content:"no toxic positivity here and i love it. just straight facts about why i keep failing at business. the 'invisible tax' concept hit hard. fixed my strategy based on the wealth window." },
  { user:"u/overthinker_anonymous",  time:"5h",  title:"cheat code for life",           content:"finally something that doesn't tell me to 'just manifest it'. gave me practical windows for action. i feel like i have a cheat code for the next 5 years. worth every rupee." },
  { user:"u/manifestation_skeptic",  time:"3h",  title:"therapist is gonna be shook",   content:"my therapist is gonna act surprised when i show up with actual answers next week lol. this report did in 20 mins what we've been trying to figure out for months. wild." },
  { user:"u/astro_bro_salute",       time:"6h",  title:"you are an expert brother",     content:"Damn bro this is such a detailed explanation. You are an expert, brother 🫡 👏" },
  { user:"u/understood_at_last",     time:"11h", title:"feels good to be understood",   content:"Thank you so much for your time and attention. This is the perfect depiction of my current mental and physical state! Feels good to be understood." },
  { user:"u/no_sugarcoating",        time:"10h", title:"no sugarcoating truth",         content:"Thank you so much for taking the time to explain everything so honestly and without sugarcoating. Everything you said is absolutely true. You are genuinely gifted." },
  { user:"u/newbie_mindblown",       time:"2d",  title:"told me the reasons why",       content:"You didn't just show me what's happening but also told me the reason why it's happening. Once again thank you and I truly appreciate you for your time and help !!! 😊🙏🏻" },
  { user:"u/chronic_job_hopper",     time:"2d",  title:"life-saving roast",             content:"this isn't a horoscope, it's a roast session that saves your life. finding out my 'nice guy' act was actually a defense mechanism? oof. heavy realization but exactly what i needed to grow up." },
  { user:"u/holy_shit_wow",          time:"7h",  title:"holy shit wow",                 content:"Holy shit I wanted to give this a go for the hell of it but I think you're actually onto something, wow" },
];

const votes1  = [312,89,247,156,421,73,338,267,483,229,178,356];
const votes2  = [401,167,289,134,212,95,443,256,408,329,376,187];
const cmts1   = [42,17,31,8,56,12,38,44,62,33,28,49];
const cmts2   = [51,22,37,11,16,9,57,34,52,43,48,25];

const ACCENTS = ["#FF5E3A","#00E5FF","#7B61FF","#FFB547"];

function Card({ data, votes, cmts, i }) {
  const accent = ACCENTS[i % 4];
  return (
    <div style={{
      width:320, flexShrink:0,
      background:"rgba(255,255,255,0.02)",
      border:`1px solid rgba(255,255,255,0.07)`,
      padding:"20px 20px 16px",
      display:"flex", gap:14,
      transition:"all 0.35s",
    }}
    onMouseEnter={e=>{e.currentTarget.style.borderColor=`${accent}55`; e.currentTarget.style.background="rgba(255,255,255,0.04)";}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.background="rgba(255,255,255,0.02)";}}
    >
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,minWidth:24,paddingTop:2}}>
        <span style={{color:accent,fontSize:"0.9rem",fontWeight:700}}>▲</span>
        <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"10px",color:"rgba(255,255,255,0.6)"}}>{votes}</span>
        <span style={{color:"rgba(255,255,255,0.2)",fontSize:"0.9rem"}}>▼</span>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,fontFamily:"'IBM Plex Mono',monospace",fontSize:"9px",color:"rgba(255,255,255,0.35)",letterSpacing:"0.05em"}}>
          <span style={{color:accent}}>{data.user}</span>
          <span>·</span>
          <span>{data.time}</span>
        </div>
        <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1rem",color:"#fff",marginBottom:8,lineHeight:1.3}}>{data.title}</div>
        <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"0.8125rem",color:"rgba(255,255,255,0.5)",lineHeight:1.65}}>{data.content}</p>
        <div style={{display:"flex",gap:14,marginTop:12,fontFamily:"'IBM Plex Mono',monospace",fontSize:"9px",color:"rgba(255,255,255,0.25)"}}>
          <span>💬 {cmts}</span><span>Share</span>
        </div>
      </div>
    </div>
  );
}

/* ── TESTIMONIALS ─────────────────────────────────────────────────── */
export function TestimonialsEMR() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [paused, setPaused] = useState(false);
  const dup1 = [...row1,...row1,...row1];
  const dup2 = [...row2,...row2,...row2];

  useEffect(()=>{
    let id; let last = performance.now(); const spd = 0.045;
    const tick = now => {
      const dt = now - last; last = now;
      if (!paused) {
        if (ref1.current) { ref1.current.scrollLeft -= spd*dt; if (ref1.current.scrollLeft<=0) ref1.current.scrollLeft = ref1.current.scrollWidth/2; }
        if (ref2.current) { ref2.current.scrollLeft += spd*dt; if (ref2.current.scrollLeft>=ref2.current.scrollWidth/2) ref2.current.scrollLeft=0; }
      }
      id = requestAnimationFrame(tick);
    };
    if (ref1.current && ref1.current.scrollLeft===0) ref1.current.scrollLeft = ref1.current.scrollWidth/2;
    id = requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(id);
  },[paused]);

  return (
    <section data-testid="section-testimonials" className="relative py-32 md:py-44 border-t border-white/5 overflow-hidden">
      <div className="aurora-blob" style={{width:500,height:500,background:"#7B61FF",top:"-10%",left:"20%",opacity:0.08,animationDelay:"-4s"}}/>
      <div className="aurora-blob" style={{width:400,height:400,background:"#FF5E3A",bottom:"-10%",right:"15%",opacity:0.07,animationDelay:"-10s"}}/>

      {/* heading */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 mb-16">
        <div className="flex items-center gap-4 font-mono-tech text-[10px] text-zinc-500 mb-8">
          <span className="w-8 h-px" style={{background:"#FF5E3A"}}/>
          <span className="text-zinc-700">—</span>
          <span>VERIFIED SIGNAL</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <motion.h2 initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,ease:[0.22,1,0.36,1]}}
              className="font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em]">
              When the data<span className="text-zinc-600">.</span><br/>
              <span className="italic-serif text-zinc-500">hits</span> <span className="shimmer-text">reality.</span>
            </motion.h2>
          </div>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,delay:0.15,ease:[0.22,1,0.36,1]}}
            className="lg:col-span-5 lg:pb-3">
            <p className="font-body text-zinc-300 leading-relaxed">
              Tears, truth, and shattered egos. Savage, unfiltered feedback from the frontlines.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-px bg-white/5 max-w-xs">
              {[["50k+","People"],["4.9/5","Rating"],["100%","Personalised"]].map(([v,k])=>(
                <div key={k} className="bg-[#050507] p-4">
                  <div className="font-serif-display text-2xl text-white">{v}</div>
                  <div className="font-mono-tech text-[9px] text-zinc-500 mt-1">{k}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll rows */}
      <div onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} style={{display:"flex",flexDirection:"column",gap:20}}>
        {[{ref:ref1,data:dup1,v:votes1,c:cmts1},{ref:ref2,data:dup2,v:votes2,c:cmts2}].map(({ref,data,v,c},ri)=>(
          <div key={ri} ref={ref} style={{display:"flex",gap:16,overflowX:"auto",scrollbarWidth:"none",padding:"8px 40px"}}>
            {data.map((t,i)=><Card key={`r${ri}-${i}`} data={t} votes={v[i%v.length]} cmts={c[i%c.length]} i={i}/>)}
          </div>
        ))}
      </div>
      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
}

/* ── FAQ DATA ─────────────────────────────────────────────────────── */
const topFAQs = [
  {q:"Is this another horoscope app?",                a:"No. Horoscopes are for people who want to be flattered. This is predictive analytics for people who want to win. We don't sell hope and fears; we sell a surveillance report on your destiny."},
  {q:"Does astrology actually work, or is it a scam?",a:"Gravity works whether you believe in it or not. Saturn doesn't care about your opinion. You can ignore the data, but you'll still pay the tax."},
  {q:"I control my own life. Why do I need this?",    a:"Cute. You control your reaction, not the event. You don't control the weather, but you check the forecast so you don't look like an idiot in the rain. This is your weather report for trauma and wealth."},
  {q:"Isn't astrology just pseudoscience?",           a:"'Pseudoscience' is a label mediocre minds use to dismiss what they can't measure. Our analysis is based on 5,000-year-old Vedic texts that mapped the solar system before Europe learned to wash its hands."},
  {q:"How do you predict this stuff? Magic?",         a:"We don't predict. We calculate. We run your birth data through rigid, ancient sacred texts and scriptures. It's not magic; it's celestial ballistics."},
  {q:"Is this just AI hallucinating answers?",        a:"Hell no. AI is just the delivery boy. The logic is pure, hard-coded Vedic math. The delivery is AI; the data is undisputed astronomical fact."},
  {q:"Why do I need my exact birth time?",            a:"Because a 2-4 minute difference changes your entire grid. If you guess, you get someone else's destiny. Go find your birth certificate. Precision is power."},
  {q:"Why is your tone so brutal? Can't you be nice?",a:"Your mom is nice, and look where that got you. 'Nice' keeps you comfortable. 'Brutal' wakes you up. We're here to break your loops, not validate your feelings."},
  {q:"Is this strictly for Hindus/Vedic followers?",  a:"Does gravity only work for Newton? The code applies to everyone. The nomenclature is Sanskrit; the mechanics are universal."},
  {q:"Why do you talk like a villain?",               a:"Heroes save you. Villains force you to save yourself. We are the antagonist to your laziness."},
];

const allFAQs = [
  ...topFAQs,
  {q:"Will this tell me when I'll get rich?",         a:"It tells you when the window opens. If you're sitting on the couch eating Cheetos during your wealth era, you'll just get fat. We give you the timing; you bring the hustle."},
  {q:"Can this save my failing relationship?",        a:"It can tell you if it should be saved. Sometimes the most 'spiritual' thing you can do is leave a dead-end toxicity loop. We'll show you the compatibility code; you pull the trigger."},
  {q:"Will this fix my depression?",                  a:"We are not therapists. We are strategists. Knowing why you feel heavy stops you from thinking you're broken. It's just a season. Survive it."},
  {q:"Can I use this for stock trading?",             a:"We calculate your personal luck cycles. If you use that to buy meme coins, that's on you. But yes, timing is everything."},
  {q:"What is 'The Void'?",                           a:"The backend of your subconscious. The place where you hide your potential. We drag it out into the light and make it pay rent."},
  {q:"Date of birth? Are you stealing my data?",      a:"We need your coordinates to map the sky. We don't care about your identity; we care about your geometry. Your data is encrypted, unlike your emotional baggage."},
  {q:"What if I get a bad prediction?",               a:"There are no bad predictions, only weak strategies. If a storm is coming, we hand you a helmet. Build a shelter or get buried."},
  {q:"Can I change my destiny?",                      a:"You can navigate it. You can't stop the waves, but you can learn to surf. Or you can drown. Your choice."},
  {q:"Is this better than Western Astrology?",        a:"Western is solar-based (personality). Vedic is lunar/stellar-based (predictive). We don't care how you feel; we care what will happen to you. Engineering vs. psychology."},
  {q:"Why do I have to pay?",                         a:"Because paying signals commitment. Also, servers aren't free. If you want free advice, go ask a fortune cookie."},
];

function FAQItem({ item, isOpen, onClick, accent="#FF5E3A" }) {
  return (
    <motion.div layout style={{
      border:`1px solid ${isOpen ? accent+"44" : "rgba(255,255,255,0.07)"}`,
      background: isOpen ? `${accent}08` : "transparent",
      transition:"border-color 0.3s, background 0.3s",
      overflow:"hidden",
    }}>
      <button onClick={onClick} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px",background:"none",border:"none",cursor:"pointer",textAlign:"left",gap:12}}>
        <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"0.8125rem",letterSpacing:"0.04em",color: isOpen ? "#fff" : "rgba(255,255,255,0.55)",lineHeight:1.5,flex:1}}>{item.q}</span>
        <span style={{color: isOpen ? accent : "rgba(255,255,255,0.3)",flexShrink:0,transition:"color 0.2s"}}>
          {isOpen ? <Minus size={16} strokeWidth={1.5}/> : <Plus size={16} strokeWidth={1.5}/>}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.3}}>
            <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"0.9rem",color:"rgba(255,255,255,0.5)",lineHeight:1.7,padding:"0 20px 20px"}}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── FAQ SECTION ──────────────────────────────────────────────────── */
export function FAQEMR() {
  const [open, setOpen] = useState(null);
  const [modal, setModal] = useState(false);
  const toggle = i => setOpen(open===i ? null : i);
  const col1 = topFAQs.slice(0,5);
  const col2 = topFAQs.slice(5,10);

  useEffect(()=>{
    document.body.style.overflow = modal ? "hidden" : "";
    return ()=>{ document.body.style.overflow=""; };
  },[modal]);

  return (
    <section id="faq" data-testid="section-faq" className="relative py-32 md:py-44 border-t border-white/5 overflow-hidden">
      <div className="aurora-blob" style={{width:480,height:480,background:"#00E5FF",top:"5%",right:"-10%",opacity:0.06,animationDelay:"-7s"}}/>
      <div className="aurora-blob" style={{width:380,height:380,background:"#7B61FF",bottom:"5%",left:"-5%",opacity:0.07,animationDelay:"-14s"}}/>
      <div className="absolute inset-0 grid-bg opacity-20"/>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 relative">
        {/* heading */}
        <div className="flex items-center gap-4 font-mono-tech text-[10px] text-zinc-500 mb-8">
          <span className="w-8 h-px" style={{background:"#7B61FF"}}/>
          <span className="text-zinc-700">—</span>
          <span>THE INTERROGATION ROOM</span>
        </div>
        <motion.h2 initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,ease:[0.22,1,0.36,1]}}
          className="font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em] mb-4 max-w-4xl">
          Questions you should<br/>
          <span className="italic-serif text-zinc-500">definitely</span> <span className="shimmer-text">ask.</span>
        </motion.h2>
        <p className="font-body text-zinc-400 text-lg mb-16 max-w-xl">No softballs. No fluff. Just the uncomfortable questions that actually matter.</p>

        {/* 2-col accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="flex flex-col gap-3">
            {col1.map((item,i)=>(
              <FAQItem key={i} item={item} isOpen={open===i} onClick={()=>toggle(i)} accent={ACCENTS[i%4]}/>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {col2.map((item,i)=>(
              <FAQItem key={i+5} item={item} isOpen={open===i+5} onClick={()=>toggle(i+5)} accent={ACCENTS[(i+5)%4]}/>
            ))}
          </div>
        </div>

        {/* reveal all button */}
        <div className="mt-16 text-center">
          <motion.button
            whileHover={{scale:1.02}} whileTap={{scale:0.98}}
            onClick={()=>setModal(true)}
            className="inline-flex items-center gap-3 font-mono-tech text-[11px] px-8 py-4 border border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06] hover:text-white hover:border-white/20 transition-all"
          >
            Reveal all answers
            <ArrowUpRight size={13} strokeWidth={1.5}/>
          </motion.button>
        </div>
      </div>

      {/* Full modal */}
      <AnimatePresence>
        {modal && (
          <motion.div key="faq-modal-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}
            onClick={()=>setModal(false)}
            style={{position:"fixed",inset:0,zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",background:"rgba(5,5,7,0.88)",backdropFilter:"blur(20px)",overflowY:"auto"}}>
            <motion.div key="faq-modal-card" initial={{y:28,scale:0.95,opacity:0}} animate={{y:0,scale:1,opacity:1}} exit={{y:28,scale:0.95,opacity:0}}
              transition={{type:"spring",damping:30,stiffness:280}}
              onClick={e=>e.stopPropagation()}
              style={{width:"100%",maxWidth:960,height:"85vh",display:"flex",flexDirection:"column",background:"#0B0B12",border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,229,255,0.06)",overflow:"hidden"}}>
              {/* modal top bar */}
              <div style={{height:2,background:"linear-gradient(90deg,#FF5E3A,#00E5FF,#7B61FF)",flexShrink:0}}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
                <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.75rem",color:"#fff"}}>
                  Archive<span style={{color:"#FF5E3A"}}>.</span> <span style={{color:"rgba(255,255,255,0.3)",fontStyle:"italic"}}>Declassified</span>
                </div>
                <button onClick={()=>setModal(false)} style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.color="rgba(255,255,255,0.5)";}}>
                  <X size={13} strokeWidth={1.5}/>
                </button>
              </div>
              {/* scrollable content */}
              <div data-lenis-prevent style={{flex:1,minHeight:0,overflowY:"auto",padding:"32px 28px 40px",WebkitOverflowScrolling:"touch"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"40px 48px"}}>
                  {allFAQs.map((item,i)=>(
                    <div key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.06)",paddingBottom:24}}>
                      <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.0625rem",color:ACCENTS[i%4],marginBottom:10,lineHeight:1.3}}>{item.q}</div>
                      <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"0.875rem",color:"rgba(255,255,255,0.45)",lineHeight:1.7}}>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
