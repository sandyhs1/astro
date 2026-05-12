"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Starfield } from "./components/Starfield";
import { OrbitSystem, YantraCore, MiniYantra, ChartSquare, WaveGraph } from "./components/Yantra";
import { Navbar } from "./components/Navbar";
import { CursorGlow } from "./components/CursorGlow";
import { TestimonialsEMR, FAQEMR } from "./components/TestimonialsFAQ";

import { useAuthModal } from "./hooks/useAuthModal";
import { toast } from "sonner";
import {
  ArrowUpRight, Lock, Activity, Database, Shield, Cpu,
  Layers, GitBranch, Binary, Sigma, Orbit, Network, Eye, Zap, Users, KeyRound, Sparkles, Infinity as InfinityIcon, X,
  Clock, Calendar, Search, Mic
} from "lucide-react";
import posthog from 'posthog-js';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }
  }),
};

const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-80px" }}
    custom={delay}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionLabel = ({ n, label, accent = "#FF5E3A" }) => (
  <div className="flex items-center gap-4 font-mono-tech text-[10px] text-zinc-500 mb-8">
    <span className="w-8 h-px" style={{ background: accent }} />
    <span className="text-zinc-700">{String(n).padStart(2, "0")}</span>
    <span>{label}</span>
  </div>
);

/* Magnetic primary CTA */
const PrimaryCTA = ({ children = "Initiate Life Intelligence Report", testid = "primary-cta" }) => {
  const ref = useRef(null);
  const { openAuthModal } = useAuthModal();
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  const onClick = () => {
    posthog.capture('emr_primary_cta_clicked', { component: 'PrimaryCTA' });
    openAuthModal("sign_up");
  };
  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      data-testid={testid}
      onClick={onClick}
      className="magnetic group relative inline-flex items-center gap-3 bg-[#F8FAFC] text-[#050507] font-mono-tech text-[11px] px-7 py-4 hover:bg-white transition-colors overflow-hidden"
    >
      <span className="relative z-10">{children}</span>
      <ArrowUpRight size={14} strokeWidth={1.5} className="relative z-10 group-hover:rotate-45 transition-transform duration-500" />
    </button>
  );
};

const GhostCTA = ({ children, onClick, testid }) => (
  <button
    data-testid={testid}
    onClick={(e) => {
      posthog.capture('emr_secondary_cta_clicked', { text: children, component: 'GhostCTA' });
      if (onClick) onClick(e);
    }}
    className="sweep-underline inline-flex items-center gap-2 font-mono-tech text-[10px] text-zinc-400 hover:text-white transition-colors"
  >
    {children}
    <ArrowUpRight size={12} strokeWidth={1.5} />
  </button>
);

/* ------------------------------------------------------------------ */
/* 1. HERO                                                            */
/* ------------------------------------------------------------------ */
const HERO_WORDS = ["temporal", "karmic", "biological", "cyclical"];
const Hero = () => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setW((v) => (v + 1) % HERO_WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <section
      id="hero"
      data-testid="section-hero"
      className="relative min-h-[100vh] overflow-hidden grain pt-20"
    >
      {/* Aurora blobs */}
      <div className="aurora-blob" style={{ width: 620, height: 620, background: "#FF5E3A", top: "-10%", left: "-10%" }} />
      <div className="aurora-blob" style={{ width: 720, height: 720, background: "#7B61FF", bottom: "-20%", right: "-10%", animationDelay: "-6s" }} />
      <div className="aurora-blob" style={{ width: 520, height: 520, background: "#00E5FF", top: "30%", left: "30%", animationDelay: "-12s", opacity: 0.2 }} />

      <Starfield count={140} shootingStars={3} />
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Orbit system on the right */}
      <div className="absolute right-[-15%] top-1/2 -translate-y-1/2 opacity-90 pointer-events-none hidden md:block float">
        <OrbitSystem size={900} />
      </div>

      {/* Corner coordinates */}
      <div className="absolute left-6 top-24 font-mono-tech text-[10px] text-zinc-600 hidden lg:flex flex-col gap-1">
        <span>N 28.6139°</span>
        <span>E 77.2090°</span>
        <span className="text-[#00E5FF]">● ONLINE</span>
      </div>
      <div className="absolute right-6 bottom-16 font-mono-tech text-[10px] text-zinc-600 hidden lg:block text-right">
        SIDEREAL<br />AYANAMSA 24°09′
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 pt-20 lg:pt-32">
        <Reveal>
          <div className="inline-flex items-center gap-3 border border-white/10 bg-white/[0.02] backdrop-blur-xl px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E3A] pulse-dot" />
            <span className="font-mono-tech text-[10px]">Life Intelligence · v.1 live</span>
            <span className="text-zinc-700">·</span>
            <span className="font-mono-tech text-[10px] text-zinc-500">148 variables · 16 charts</span>
          </div>
        </Reveal>

        <div className="mt-10 lg:mt-16 max-w-[1100px]">
          <h1 className="font-serif-display text-[15vw] md:text-[11vw] lg:text-[9.5rem] leading-[0.88] tracking-[-0.04em]">
            <Reveal delay={1}>
              <div>Decrypting</div>
            </Reveal>
            <Reveal delay={2}>
              <div className="flex items-baseline flex-wrap gap-4 md:gap-6">
                <span className="italic-serif text-zinc-400">your</span>
                <span className="relative inline-block">
                  {HERO_WORDS.map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                      animate={{
                        opacity: i === w ? 1 : 0,
                        y: i === w ? 0 : -20,
                        filter: i === w ? "blur(0px)" : "blur(8px)",
                      }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className={`${i === 0 ? "relative" : "absolute left-0 top-0"} shimmer-text whitespace-nowrap`}
                      style={{ pointerEvents: "none" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                  {/* ghost placeholder to reserve width */}
                  <span className="invisible">temporal</span>
                </span>
              </div>
            </Reveal>
            <Reveal delay={3}>
              <div className="flex items-baseline gap-5">
                <span>code</span>
                <span className="text-[#FF5E3A]">.</span>
              </div>
            </Reveal>
          </h1>
        </div>

        <div className="mt-12 lg:mt-16 max-w-xl">
          <Reveal delay={4}>
            <p className="font-body text-lg md:text-xl text-zinc-300 leading-snug">
              Patterns you keep entering. <span className="italic-serif text-zinc-500">Loops you didn't name.</span> <span className="text-white">Now computed.</span>
            </p>
          </Reveal>
        </div>

        <Reveal delay={6}>
          <div className="flex flex-wrap items-center gap-8 mt-10">
            <PrimaryCTA testid="hero-cta">Initiate your Life Intelligence Report</PrimaryCTA>
            <GhostCTA testid="hero-secondary" onClick={() => { document.getElementById("philosophy")?.scrollIntoView({behavior:"smooth"}); }}>
              Read the philosophy
            </GhostCTA>
          </div>
        </Reveal>

        <Reveal delay={8}>
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 max-w-3xl">
            {[
              { v: "99.2%", k: "Pattern fidelity" },
              { v: "148", k: "Variables" },
              { v: "16", k: "Divisional charts" },
              { v: "~40ms", k: "Compute time" },
            ].map((s) => (
              <div key={s.k} className="bg-[#050507] p-5">
                <div className="font-serif-display text-4xl text-white">{s.v}</div>
                <div className="font-mono-tech text-[9px] text-zinc-500 mt-1">{s.k}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 py-3 overflow-hidden z-10 bg-[#050507]/60 backdrop-blur-sm">
        <div className="marquee-track-fast flex gap-16 whitespace-nowrap font-mono-tech text-[10px] text-zinc-500">
          {Array.from({ length: 3 }).map((_, k) => (
            <React.Fragment key={k}>
              <span>PARASHARI · OPERATIONAL</span>
              <span className="text-[#FF5E3A]">◉</span>
              <span>JAIMINI KARAKAS · 08/08</span>
              <span className="text-[#00E5FF]">◉</span>
              <span>NADI ALGORITHMS · INDEXED</span>
              <span className="text-[#7B61FF]">◉</span>
              <span>SHODASAVARGA · D1—D60 LIVE</span>
              <span className="text-[#FF5E3A]">◉</span>
              <span>NO RITUALS · NO STONES · PURE COMPUTATION</span>
              <span className="text-[#00E5FF]">◉</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* TRUST BAND — standalone wow section (placed before Final CTA)        */
/* ------------------------------------------------------------------ */
const TRUST = [
  { icon: <Users size={16} strokeWidth={1.2} />,    v: "50,000",   suffix: "+",  k: "People stopped guessing",  accent: "#00E5FF" },
  { icon: <Sparkles size={16} strokeWidth={1.2} />, v: "4.9",      suffix: "/5", k: "Brutally honest rating",   accent: "#FFB547" },
  { icon: <Sigma size={16} strokeWidth={1.2} />,    v: "100%",     suffix: "",   k: "Personalised reality check", accent: "#7B61FF" },
  { icon: <Shield size={16} strokeWidth={1.2} />,   v: "0",        suffix: "",   k: "Scammy gemstones sold",    accent: "#FF5E3A" },
];

/* small scroll-triggered count-up */
const useCountUp = (target, trigger) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    // parse numeric prefix
    const m = String(target).replace(/,/g, "").match(/^([0-9]*\.?[0-9]+)/);
    if (!m) return;
    const end = parseFloat(m[1]);
    const isFloat = m[1].includes(".");
    const dur = 1400;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = end * eased;
      setVal(isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString());
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, trigger]);
  return val;
};

const TrustStat = ({ stat, index, inView }) => {
  const counted = useCountUp(stat.v, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.08 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative py-6 md:py-8 px-5 md:px-8 flex flex-col gap-4 first:border-l-0 border-l border-white/5 hover:bg-white/[0.02] transition-colors duration-500"
      data-testid={`trust-${index}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(400px at 50% 0%, ${stat.accent}15, transparent 60%)` }}
      />
      <div className="relative flex items-center gap-3 font-mono-tech text-[10px] text-zinc-500">
        <span className="w-6 h-6 flex items-center justify-center border" style={{ borderColor: `${stat.accent}55`, color: stat.accent, background: `${stat.accent}10` }}>
          {stat.icon}
        </span>
        <span>0{index + 1}</span>
      </div>
      <div className="relative">
        <div
          className="font-serif-display leading-none tracking-[-0.04em] flex items-baseline"
          style={{ color: stat.accent, fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          <span>{counted || stat.v.replace(/[^0-9.]/g, "") || stat.v}</span>
          <span className="ml-1 text-white/80" style={{ fontSize: "0.38em" }}>{stat.suffix}</span>
        </div>
      </div>
      <div className="relative font-mono-tech text-[10px] text-zinc-400 group-hover:text-white transition-colors duration-500">
        {stat.k}
      </div>
    </motion.div>
  );
};

const TrustBar = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section
      ref={ref}
      data-testid="section-trust"
      className="relative py-12 md:py-16 border-t border-white/5 overflow-hidden"
    >
      <div className="aurora-blob" style={{ width: 400, height: 400, background: "#FF5E3A", top: "-20%", left: "15%", opacity: 0.08 }} />
      <div className="aurora-blob" style={{ width: 400, height: 400, background: "#7B61FF", bottom: "-20%", right: "15%", opacity: 0.08, animationDelay: "-8s" }} />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 relative">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 md:mb-10">
          <Reveal>
            <div className="flex items-center gap-4 font-mono-tech text-[10px] text-zinc-500">
              <span className="w-8 h-px bg-[#FF5E3A]" />
              <span className="text-zinc-700">—</span>
              <span>TRUSTED BY THE AMBITIOUS</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-serif-display text-2xl md:text-3xl lg:text-4xl leading-[0.95] tracking-[-0.03em] max-w-sm text-right">
              The math, <span className="italic-serif text-zinc-500">apparently,</span> <span className="shimmer-text">works</span>.
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t, i) => (
            <TrustStat key={t.k} stat={t} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 2. PHILOSOPHY — Math × Fear                                         */
/* ------------------------------------------------------------------ */
const Philosophy = () => (
  <section id="philosophy" data-testid="section-philosophy" className="relative py-32 md:py-44 border-t border-white/5 overflow-hidden">
    <div className="absolute top-1/2 right-[-20%] -translate-y-1/2 opacity-30 hidden lg:block">
      <YantraCore size={620} />
    </div>
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 relative">
      <SectionLabel n={2} label="PHILOSOPHY" accent="#00E5FF" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-8">
          <Reveal>
            <h2 className="font-serif-display text-7xl md:text-[10rem] lg:text-[13rem] leading-[0.82] tracking-[-0.04em]">
              <span className="block">Math</span>
              <span className="block italic-serif text-zinc-500">over</span>
              <span className="block relative">
                <span className="text-[#FF5E3A]">fear.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.4, ease: [0.22,1,0.36,1] }}
                  style={{ transformOrigin: "left" }}
                  className="absolute left-[-2%] right-[-4%] top-[52%] h-[6px] md:h-[10px] bg-[#FF5E3A]"
                />
              </span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={2} className="lg:col-span-4 font-body text-base text-zinc-300 space-y-5 pb-4">
          <p>The industry weaponises fear. We return the model.</p>
          <p className="text-zinc-500">No "bad planets." No rituals for sale. An ancient computational system rewritten for the people who ask <span className="italic-serif text-white">why</span>.</p>
          <div className="pt-6 border-t border-white/10">
            <div className="font-mono-tech text-[10px] text-zinc-600">OPERATING PRINCIPLE</div>
            <div className="font-serif-display text-2xl text-white mt-2">Accuracy ≻ authority.</div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 3. VEDIC STACK — 3 tilting cards                                    */
/* ------------------------------------------------------------------ */
const STACK = [
  { code: "01", title: "Parashari", kicker: "Deterministic Core", body: "Rule-based engine. Houses, dignities, dasha.", icon: <Layers size={14} strokeWidth={1} />, variant: "cyan", accent: "#00E5FF" },
  { code: "02", title: "Jaimini",   kicker: "Karaka Logic",       body: "Eight karakas derived from planetary longitude.", icon: <GitBranch size={14} strokeWidth={1} />, variant: "violet", accent: "#7B61FF" },
  { code: "03", title: "Nadi",      kicker: "Pattern Library",    body: "Chart signatures mapped to observed life-events.", icon: <Binary size={14} strokeWidth={1} />, variant: "coral", accent: "#FF5E3A" },
];

const MATH_SECTIONS = [
  { n:"01", color:"#00E5FF", title:"Astronomical Data Integrity (The Input)", body: "We do not use estimated planetary positions. Our engine calculates coordinates based on the Swiss Ephemeris, corrected for: True Chitra Paksha (Lahiri) Ayanamsa — precision-corrected for Earth's axial precession (50.3 arc-seconds/year). Geocentric Parallax — adjusting longitudes for the observer's exact lat/lon. Topocentric Refraction — correcting for atmospheric bending of light at the moment of birth." },
  { n:"02", color:"#7B61FF", title:"The Shodasavarga + Higher-Order Matrix", body: "Most systems stop at D-1. We run a Recursive Multi-Chart Audit. Every question is routed through its specific divisional coordinate. Contextual Varga Routing: wealth questions prioritise D-2 (Hora) + D-11 (Rudramsa). Property questions audit D-4 (Chaturthamsa). We don't guess — we zoom into the precise mathematical division." },
  { n:"03", color:"#FF5E3A", title:"Bhava Chalit: The True House Vector", body: "The Sign-House system is a simplified abstraction. We use Bhava Chalit (Cusp-based Calculation). Signs are fixed 30° blocks; Houses are dynamic. A planet at 28° in the 1st House is mathematically functioning in the 2nd House. We identify results that general astrologers miss because they are looking at the wrong house entirely." },
  { n:"04", color:"#FFB547", title:"Ashtakvarga: The Probability Algorithm", body: "We quantify the Benefic Strength of every house using a 0–8 point system across 7 planets (337 total points). Active Windows (28+ pts): effort yields 1.5× return. Dead Zones (<20 pts): any investment results in unavoidable leakage. We overlay these points onto transits to determine exact probability of success for your inquiry." },
  { n:"05", color:"#00E5FF", title:"5-Tier Dasha Recursion (Time-Lord Calculation)", body: "We calculate Vimshottari Dasha down to the 5th level of recursion: Mahadasha (10–20 yr trend) → Antardasha (1–3 yr pivot) → Pratyantardasha (monthly) → Sookshma Dasha (weekly trigger) → Prana Dasha (daily event). No yearly horoscopes. Exact windows." },
  { n:"06", color:"#7B61FF", title:"Computational Source Code", body: "Logic is hard-coded from primary Vedic texts: Brihat Parashara Hora Shastra (BPHS) for the 16-divisional framework. Jaimini Sutras for Chara Karaka trajectory mapping. Surya Siddhanta for orbital mechanics of Upagrahas (Gulika/Mandi). Phaladeepika for clinical results and health diagnostic data." },
];

const StacksModal = ({ onClose }) => {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <AnimatePresence>
      <motion.div key="sm-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}
        onClick={onClose}
        style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",background:"rgba(5,5,7,0.92)",backdropFilter:"blur(20px)",overflowY:"auto"}}>
        <motion.div key="sm-card" initial={{y:24,scale:0.96,opacity:0}} animate={{y:0,scale:1,opacity:1}} exit={{y:24,scale:0.96,opacity:0}}
          transition={{type:"spring",damping:30,stiffness:280}} onClick={e=>e.stopPropagation()}
          style={{width:"100%",maxWidth:760,height:"min(88vh,780px)",display:"flex",flexDirection:"column",flexShrink:0,background:"#0B0B12",border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 40px 80px -20px rgba(0,0,0,0.9)",overflow:"hidden"}}>
          <div style={{height:2,background:"linear-gradient(90deg,#00E5FF,#7B61FF,#FF5E3A)",flexShrink:0}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            <div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"9px",letterSpacing:"0.2em",color:"#7B61FF",textTransform:"uppercase",marginBottom:6}}>THE COMPUTATIONAL ENGINE</div>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.75rem",color:"#fff"}}>The Math<span style={{color:"#7B61FF"}}>.</span> <span style={{fontStyle:"italic",color:"rgba(255,255,255,0.35)"}}>Behind the Signal.</span></div>
            </div>
            <button onClick={onClose} style={{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.color="#fff"}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.color="rgba(255,255,255,0.5)"}}>
              <X size={13} strokeWidth={1.5}/>
            </button>
          </div>
          <div data-lenis-prevent style={{flex:1,minHeight:0,overflowY:"auto",padding:"28px 28px 40px",WebkitOverflowScrolling:"touch"}}>
            <div style={{background:"rgba(255,94,58,0.07)",border:"1px solid rgba(255,94,58,0.25)",padding:"18px 22px",marginBottom:28}}>
              <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"0.78rem",color:"rgba(255,255,255,0.55)",lineHeight:1.75}}>
                Standard apps use the D-1 chart — shared by everyone born in the same 2-hour window. We use the <strong style={{color:"#FF5E3A"}}>D-60 (Shastiamsa)</strong> — which changes every 2 minutes. It is the only dataset that explains why twins have different lives. If your report is not looking at your D-60, it is reading a template for 500,000 other people.
              </p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              {MATH_SECTIONS.map((s,i)=>(
                <div key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.05)",paddingBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",background:`${s.color}12`,border:`1px solid ${s.color}40`,color:s.color,fontFamily:"'IBM Plex Mono',monospace",fontSize:"9px",flexShrink:0}}>{s.n}</span>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"10px",letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)"}}>{s.title}</div>
                  </div>
                  <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"0.875rem",color:"rgba(255,255,255,0.4)",lineHeight:1.75,paddingLeft:32}}>{s.body}</p>
                </div>
              ))}
            </div>
            <div style={{marginTop:24,padding:"16px 20px",background:"rgba(123,97,255,0.06)",border:"1px solid rgba(123,97,255,0.2)"}}>
              <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"9px",letterSpacing:"0.08em",color:"rgba(255,255,255,0.35)",lineHeight:1.8}}>
                This is a deterministic reconstruction of your space-time coordinates at birth. We use <strong style={{color:"rgba(255,255,255,0.5)"}}>Sphuta (Longitudes)</strong>, <strong style={{color:"rgba(255,255,255,0.5)"}}>Bala (Strength)</strong>, and <strong style={{color:"rgba(255,255,255,0.5)"}}>Kala (Time)</strong>. If the birth data is accurate, the output is unavoidable.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const VedicStack = () => {
  const [showStacks, setShowStacks] = useState(false);
  return (
    <section id="vedic-stack" data-testid="section-vedic-stack" className="relative py-28 md:py-36 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionLabel n={3} label="THE VEDIC STACK" accent="#7B61FF" />
        <Reveal>
          <h2 className="font-serif-display text-5xl md:text-6xl lg:text-7xl leading-[0.92] tracking-[-0.03em] max-w-4xl">
            Three <span className="italic-serif text-zinc-500">interlocking</span> frameworks. <span className="shimmer-text">One signal</span>.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14 perspective-[1200px]">
          {STACK.map((s, i) => (
            <Reveal key={s.code} delay={i + 1}>
              <TiltCard data-testid={`stack-card-${i}`} accent={s.accent}>
                <div className="relative h-full p-6 min-h-[280px] flex flex-col justify-between overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-45 transition-opacity duration-700">
                    <MiniYantra size={160} variant={s.variant} />
                  </div>
                  <div className="relative flex items-start justify-between">
                    <div>
                      <div className="font-mono-tech text-[9px] text-zinc-600">{s.code} / 03</div>
                      <div className="mt-6 font-serif-display text-5xl leading-none" style={{ color: s.accent }}>{s.title.charAt(0)}</div>
                    </div>
                    <div className="text-zinc-500 group-hover:text-white transition-colors">{s.icon}</div>
                  </div>
                  <div className="relative">
                    <div className="font-serif-display text-2xl">{s.title}</div>
                    <div className="font-mono-tech text-[9px] text-zinc-500 mt-1">{s.kicker}</div>
                    <p className="font-body text-[13px] text-zinc-400 mt-3 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={4}>
          <div className="mt-10 flex items-center gap-3">
            <span className="w-8 h-px bg-[#7B61FF]/40" />
            <button
              onClick={() => {
                posthog.capture('emr_stacks_modal_opened');
                setShowStacks(true);
              }}
              className="group flex flex-col items-start gap-1"
              style={{background:"none",border:"none",cursor:"pointer",padding:0}}
            >
              <span className="sweep-underline font-mono-tech text-[10px] text-zinc-500 group-hover:text-[#7B61FF] transition-colors duration-300 tracking-[0.12em] uppercase">Stacks</span>
              <span className="font-mono-tech text-[8px] text-zinc-700 group-hover:text-zinc-500 transition-colors">↳ The engine behind the intelligence →</span>
            </button>
          </div>
        </Reveal>
      </div>
      {showStacks && <StacksModal onClose={() => setShowStacks(false)} />}
    </section>
  );
};

/* 3D tilt card */
const TiltCard = ({ children, accent = "#00E5FF", ...rest }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "rotateY(0) rotateX(0)"; };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
      className="tilt-card group relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 h-full hover:border-transparent transition-colors duration-500"
      style={{ "--accent": accent }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${accent}66, 0 0 60px -10px ${accent}66` }}
      />
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 4. PATTERN RECOGNITION                                              */
/* ------------------------------------------------------------------ */
const PatternRecognition = () => (
  <section data-testid="section-pattern" className="relative py-32 md:py-44 border-t border-white/5 overflow-hidden">
    <div className="absolute inset-0 opacity-40"><WaveGraph /></div>
    <div className="scanline" style={{ top: "30%" }} />
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 relative">
      <SectionLabel n={4} label="PATTERN RECOGNITION" accent="#00E5FF" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <Reveal className="lg:col-span-8">
          <h2 className="font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em]">
            Loops repeat<span className="text-zinc-600">.</span>
            <br />
            <span className="italic-serif text-zinc-500">Until</span> you see them.
          </h2>
        </Reveal>
        <Reveal delay={2} className="lg:col-span-4 self-end">
          <p className="font-body text-zinc-300 leading-relaxed">
            The same relationship shape. The same career plateau. The same financial ceiling.
          </p>
          <p className="font-body text-zinc-500 mt-3 text-sm">
            We isolate your top signatures, map them to dasha windows, and tell you exactly when they re-trigger.
          </p>
        </Reveal>
      </div>
      {/* Big visual signature */}
      <Reveal delay={3}>
        <div className="mt-16 relative">
          <svg viewBox="0 0 1200 280" className="w-full">
            <defs>
              <linearGradient id="sigg" x1="0" x2="1">
                <stop offset="0%" stopColor="#FF5E3A" />
                <stop offset="50%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#7B61FF" />
              </linearGradient>
            </defs>
            {[0,1,2,3,4].map((k) => (
              <motion.path
                key={k}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.4, delay: 0.2 + k * 0.1, ease: "easeInOut" }}
                d={`M 0 ${140 + k * 3} Q 200 ${30 + k * 20}, 400 140 T 800 140 T 1200 140`}
                stroke="url(#sigg)"
                strokeWidth={k === 0 ? 2 : 1}
                fill="none"
                opacity={1 - k * 0.2}
              />
            ))}
            {/* event markers */}
            {[
              { x: 180, label: "Ve MD" },
              { x: 480, label: "Sa SubP" },
              { x: 780, label: "Ju trine" },
              { x: 1050, label: "Rahu ret." },
            ].map((m, i) => (
              <g key={i}>
                <line x1={m.x} y1="0" x2={m.x} y2="280" stroke="rgba(255,255,255,0.06)" />
                <circle cx={m.x} cy="140" r="5" fill="#FF5E3A" />
                <circle cx={m.x} cy="140" r="12" fill="none" stroke="#FF5E3A" strokeWidth="1" opacity="0.6">
                  <animate attributeName="r" values="5;18;5" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.4}s`} />
                </circle>
                <text x={m.x} y="40" fill="#A1A1AA" fontFamily="IBM Plex Mono" fontSize="10" textAnchor="middle" letterSpacing="0.2em">{m.label.toUpperCase()}</text>
              </g>
            ))}
          </svg>
          <div className="flex items-center justify-between mt-4 font-mono-tech text-[10px] text-zinc-600">
            <span>2020</span><span>2024</span><span className="text-[#FF5E3A]">NOW</span><span>2028</span><span>2032</span>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 5. TECHNICAL VARIABLES                                              */
/* ------------------------------------------------------------------ */
const VARIABLES = [
  { code: "AK", name: "Atma Karaka",    def: "Highest-degree planet. Soul-indicator in Jaimini.", accent: "#FF5E3A" },
  { code: "DK", name: "Dara Karaka",    def: "Lowest-degree planet. Co-dependency vector.", accent: "#7B61FF" },
  { code: "UL", name: "Upapada Lagna",  def: "Marriage-indicator lagna from 12th lord's arudha.", accent: "#00E5FF" },
  { code: "A7", name: "Arudha of 7th",  def: "Public projection of partnership node.", accent: "#FFB547" },
  { code: "°",  name: "Planetary Deg.", def: "Exact longitudinal position. Required for Jaimini + ASV.", accent: "#FF5E3A" },
  { code: "ASV",name: "Ashtakavarga",   def: "337-cell cumulative strength score grid.", accent: "#7B61FF" },
  { code: "AL", name: "Arudha Lagna",   def: "Projected image of self. How the world computes you.", accent: "#00E5FF" },
  { code: "PL", name: "Pranapada Lagna",def: "Sub-lagna isolating life-force windows.", accent: "#FFB547" },
];

const TechnicalVariables = () => {
  const [active, setActive] = useState(0);
  return (
    <section id="variables" data-testid="section-variables" className="relative py-32 md:py-44 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionLabel n={5} label="TECHNICAL PRECISION" accent="#FF5E3A" />
        <Reveal>
          <h2 className="font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em] max-w-4xl">
            148 variables. <br />
            <span className="italic-serif text-zinc-500">Zero</span> vagueness.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-20">
          {/* big letter display */}
          <Reveal className="lg:col-span-5">
            <div className="relative h-[420px] flex items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 overflow-hidden">
              <motion.div
                key={VARIABLES[active].code}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
                className="relative z-10"
              >
                <div
                  className="font-serif-display text-[12rem] leading-none"
                  style={{ color: VARIABLES[active].accent }}
                >
                  {VARIABLES[active].code}
                </div>
              </motion.div>
              <div className="absolute top-4 left-4 font-mono-tech text-[9px] text-zinc-600">
                VARIABLE · {String(active + 1).padStart(2, "0")} / 08
              </div>
              <div className="absolute bottom-4 right-4 font-mono-tech text-[9px] text-zinc-600">
                {VARIABLES[active].name.toUpperCase()}
              </div>
              <div className="absolute inset-0 opacity-20">
                <MiniYantra size={420} variant="cyan" />
              </div>
            </div>
            <Reveal delay={1}>
              <div className="mt-6 font-body text-base text-zinc-300 leading-relaxed">
                <span className="font-serif-display text-2xl text-white">{VARIABLES[active].name}</span> — {VARIABLES[active].def}
              </div>
            </Reveal>
          </Reveal>

          {/* grid of variables */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-3">
            {VARIABLES.map((v, i) => (
              <Reveal key={v.code} delay={i * 0.5}>
                <button
                  data-testid={`var-card-${v.code}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`group text-left border p-5 w-full aspect-square flex flex-col justify-between transition-all duration-500 hover-lift relative overflow-hidden ${
                    active === i
                      ? "border-transparent bg-white/[0.04]"
                      : "border-white/10 hover:border-white/30"
                  }`}
                  style={active === i ? { boxShadow: `inset 0 0 0 1px ${v.accent}, 0 0 40px -10px ${v.accent}` } : {}}
                >
                  <div className="font-mono-tech text-[9px] text-zinc-600">{String(i + 1).padStart(2,"0")}</div>
                  <div>
                    <div className="font-serif-display text-5xl md:text-6xl leading-none" style={{ color: active === i ? v.accent : "#fff" }}>{v.code}</div>
                    <div className="font-mono-tech text-[9px] text-zinc-500 mt-3 truncate">{v.name}</div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 6. SHODASAVARGA — 3D stack cards                                    */
/* ------------------------------------------------------------------ */
const DIVISIONS = [
  { n: "D1",  name: "Rasi",            use: "Physicality · Vitality · Foundation",                        impact: "Tanu: The physical body and the totality of existence" },
  { n: "D2",  name: "Hora",            use: "Wealth · Sustenance · Liquidity",                            impact: "Sampatti: The flow of wealth and the polarity of sustenance (Solar/Lunar)" },
  { n: "D3",  name: "Drekkana",        use: "Initiative · Prowess · Siblings",                            impact: "Bhratri: The native's drive, prowess, and co-born support" },
  { n: "D4",  name: "Chaturthamsa",    use: "Property · Fixed Assets · Home",                             impact: "Bhagya: The net \"luck\" regarding fixed assets and residence" },
  { n: "D7",  name: "Saptamsa",        use: "Progeny · Creativity · Legacy",                              impact: "Putra-Pautra: The fruit of the lineage and creative output" },
  { n: "D9",  name: "Navamsa",         use: "Dharma · Fruit · Inner Strength",                            impact: "Kalatra/Dharmamsa: The internal strength and the fruit of the Rashi tree" },
  { n: "D10", name: "Dasamsa",         use: "Career · Power · Status",                                    impact: "Mahat Phala: The results of one's interaction with the collective structure (Social Impact & Authority)" },
  { n: "D12", name: "Dwadasamsa",      use: "Lineage · Parents · DNA (Epigenetics)",                      impact: "Pitri-Matri: The immediate inherited influence of the father and mother." },
  { n: "D16", name: "Shodasamsa",      use: "Luxury · Comfort · Vehicles (Flow & Mobility)",              impact: "Kalamsa: Happiness derived from vehicles and the luxury of movement" },
  { n: "D20", name: "Vimsamsa",        use: "Meditativeness · Upasana · Merit (Spiritual Calibration)",   impact: "Upasana: The soul's alignment with higher intelligence and worship." },
  { n: "D24", name: "Chaturvimsamsa",  use: "Education · Vidya · Expertise (Intellectual Mastery)",       impact: "Vidya: The depth of specialized knowledge and academic achievement" },
  { n: "D27", name: "Bhamamsa",        use: "Resilience · Weakness · Character (Intrinsic Resilience)",   impact: "Nakshatramsa: The subconscious physical and mental strengths/weaknesses" },
  { n: "D30", name: "Trimsamsa",       use: "Evils · Misfortunes · Shadow (The Shadow Profile)",          impact: "Arishta: Subconscious impulses, risks, and inherent character flaws." },
  { n: "D40", name: "Khavedamsa",      use: "Maternal Grace · Ancient Merit (Maternal Karma/Epigenetic Luck)", impact: "Subha-Asubha: Auspiciousness inherited from the mother's side." },
  { n: "D45", name: "Akshavedamsa",    use: "Paternal Legacy · Conduct · Purity (Paternal Karma/Character Ethics)", impact: "Sarva-Phala: The integrity and conduct inherited from the father's side." },
  { n: "D60", name: "Shastyamsa",      use: "Past Karma · Final Verdict · Soul's Path",                   impact: "Sarva-Karyeshu: The ultimate blueprint & the absolute final verdict of past-life karma on every life aspect" },
];

const Shodasavarga = () => {
  const accents = ["#00E5FF", "#7B61FF", "#FF5E3A", "#FFB547"];
  const [hovered, setHovered] = useState(null);
  const showing = hovered !== null ? DIVISIONS[hovered] : null;
  const showingAccent = hovered !== null ? accents[hovered % 4] : "#00E5FF";
  return (
    <section id="shodasavarga" data-testid="section-shodasavarga" className="relative py-32 md:py-44 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionLabel n={6} label="SHODASAVARGA INTEGRATION" accent="#7B61FF" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="stack-card-sticky">
              {/* Sticky inspector — swaps between default & hovered state */}
              <div className="relative min-h-[540px]">
                <AnimatePresence mode="wait">
                  {showing ? (
                    <motion.div
                      key={showing.n}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
                      data-testid="shodasavarga-inspector"
                      className="relative border p-8 md:p-10 overflow-hidden"
                      style={{
                        borderColor: `${showingAccent}55`,
                        background: `linear-gradient(135deg, ${showingAccent}10, transparent 65%)`,
                      }}
                    >
                      <div className="absolute -right-16 -bottom-16 opacity-25">
                        <MiniYantra size={300} variant={hovered % 3 === 0 ? "violet" : hovered % 3 === 1 ? "coral" : "cyan"} />
                      </div>
                      <div className="relative flex items-start justify-between font-mono-tech text-[10px]">
                        <span style={{ color: showingAccent }}>{String(hovered + 1).padStart(2, "0")} / 16 · DIVISION</span>
                        <span className="text-zinc-500">{showing.n}</span>
                      </div>
                      <div
                        className="relative mt-6 font-serif-display text-6xl md:text-7xl leading-[0.9] tracking-tight"
                        style={{ color: showingAccent }}
                      >
                        {showing.name}
                      </div>
                      <div className="relative font-mono-tech text-[10px] text-zinc-500 mt-3">{showing.use.toUpperCase()}</div>
                      <div className="relative h-px w-16 my-6" style={{ background: showingAccent }} />
                      <div className="relative font-serif-display text-xl md:text-2xl text-white leading-snug">
                        {showing.impact}
                      </div>
                      <div className="relative mt-6 font-mono-tech text-[9px] text-zinc-600">
                        · real-world impact · from your chart ·
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
                      data-testid="shodasavarga-default"
                    >
                      <h2 className="font-serif-display text-5xl md:text-7xl leading-[0.9] tracking-[-0.03em]">
                        Sixteen<br />
                        <span className="italic-serif text-zinc-500">charts.</span><br />
                        <span className="shimmer-text">One signal.</span>
                      </h2>
                      <p className="font-body text-zinc-300 mt-8 max-w-sm leading-relaxed">
                        A single chart is one perspective. We cross-reference all 16 divisionals for a 360° reading with no blind spots.
                      </p>
                      <div className="mt-10 grid grid-cols-4 gap-2 max-w-sm">
                        {DIVISIONS.slice(0, 8).map((d, i) => (
                          <div key={d.n} className="aspect-square hover:scale-110 transition-transform duration-500">
                            <ChartSquare label={d.n} highlight={i % 3 === 0} />
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 font-mono-tech text-[10px] text-zinc-600 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00E5FF] pulse-dot" />
                        Hover any chart →
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-5">
            {DIVISIONS.map((d, i) => (
              <motion.div
                key={d.n}
                data-testid={`division-card-${d.n}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                initial={{ opacity: 0, y: 40, rotateX: -8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.03, ease: [0.22,1,0.36,1] }}
                whileHover={{ x: 12, transition: { duration: 0.3 } }}
                className="group relative glass p-6 flex items-center gap-6 hover:border-transparent transition-colors cursor-pointer"
                style={{
                  boxShadow: hovered === i
                    ? `inset 0 0 0 1px ${accents[i % 4]}66, 0 0 40px -10px ${accents[i % 4]}66`
                    : `inset 0 0 0 1px rgba(255,255,255,0.06)`,
                }}
              >
                <div className="w-16 h-16 shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <ChartSquare label={d.n} highlight={hovered === i || i % 4 === 0} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <div className="font-serif-display text-3xl" style={{ color: accents[i % 4] }}>{d.name}</div>
                    <div className="font-mono-tech text-[9px] text-zinc-500">{d.n}</div>
                  </div>
                  <div className="font-mono-tech text-[10px] text-zinc-500 mt-1">{d.use}</div>
                </div>
                <div className="font-serif-display text-3xl text-zinc-700 group-hover:text-white transition-colors">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-zinc-800">/16</span>
                </div>
                <ArrowUpRight size={16} strokeWidth={1} className="text-zinc-700 group-hover:text-[#00E5FF] group-hover:rotate-45 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 7. MANIFESTO                                                        */
/* ------------------------------------------------------------------ */
const Manifesto = () => {
  const crossed = ["Gemstones", "Rituals", "Yantras-for-sale", "Vague predictions", "Fear-selling"];
  return (
    <section data-testid="section-manifesto" className="relative py-32 md:py-44 border-t border-white/5 overflow-hidden">
      <div className="aurora-blob" style={{ width: 700, height: 700, background: "#FF5E3A", top: "10%", left: "-20%", opacity: 0.15 }} />
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 relative">
        <SectionLabel n={7} label="NO-REMEDY MANIFESTO" accent="#FF5E3A" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-1 md:space-y-2">
            {crossed.map((c, i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative font-serif-display text-5xl md:text-7xl lg:text-8xl text-zinc-600 leading-[0.95]"
              >
                <span data-testid={`crossed-${i}`}>{c}.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease: [0.22,1,0.36,1] }}
                  style={{ transformOrigin: "left" }}
                  className="absolute left-0 top-[55%] right-0 h-[3px] md:h-[5px] bg-[#FF5E3A]"
                />
              </motion.div>
            ))}
          </div>
          <Reveal delay={3} className="lg:col-span-5 flex flex-col justify-center">
            <div className="font-serif-display text-4xl md:text-6xl leading-[0.95]">
              We sell <span className="shimmer-text">clarity.</span><br />
              We sell <span className="italic-serif text-[#00E5FF]">strategy.</span>
            </div>
            <div className="mt-8 font-mono-tech text-[10px] text-zinc-500">
              /// WHAT THE REPORT ACTUALLY GIVES YOU
            </div>
            <ul className="mt-5 space-y-4">
              {[
                { v: "A map, not a fortune.", b: "Your patterns, plotted. Decide what to do with them." },
                { v: "Timing windows.",        b: "Dasha-weighted months when the odds tilt — not vague years." },
                { v: "The loop you can't name.", b: "The exact self-sabotage signature causing the repeat." },
                { v: "A play, not a prayer.",   b: "One-page strategy for the next 90 days. Actionable today." },
                { v: "Your money stays yours.", b: "No stones, no pujas, no 'karma-clearing' upsell. Ever." },
              ].map((b, i) => (
                <motion.li
                  key={b.v}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  className="group flex items-start gap-4 pb-4 border-b border-white/5 last:border-0"
                  data-testid={`manifesto-benefit-${i}`}
                >
                  <span
                    className="shrink-0 mt-1 w-5 h-5 flex items-center justify-center border border-[#FF5E3A]/50 text-[#FF5E3A] font-mono-tech text-[9px] group-hover:bg-[#FF5E3A] group-hover:text-[#050507] transition-colors"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="font-serif-display text-xl text-white leading-snug group-hover:translate-x-1 transition-transform duration-300">
                      {b.v}
                    </div>
                    <div className="font-body text-[13px] text-zinc-500 mt-1 leading-relaxed">
                      {b.b}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
            <div className="mt-6 font-mono-tech text-[10px] text-zinc-600">
              · Zero remedies · Zero guilt · Just math ·
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 8. GRANDMASTER                                                      */
/* ------------------------------------------------------------------ */
const Grandmaster = () => (
  <section data-testid="section-grandmaster" className="relative py-32 md:py-44 border-t border-white/5">
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
      <SectionLabel n={8} label="THE GRANDMASTER STANDARD" accent="#00E5FF" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <Reveal className="lg:col-span-5">
          <h2 className="font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em]">
            Human reading.<br />
            <span className="italic-serif text-zinc-500">Rewritten at</span><br />
            <span className="shimmer-text">machine speed.</span>
          </h2>
          <p className="font-body text-zinc-400 mt-8 max-w-sm leading-relaxed">
            A seasoned consultant holds two or three divisional charts in active memory. Our engine cross-references sixteen in <span className="text-white font-mono-tech text-[11px]">~40ms</span>.
          </p>
        </Reveal>
        <Reveal delay={2} className="lg:col-span-7">
          <div className="border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-2">
            <div className="grid grid-cols-12 gap-2 mb-2 font-mono-tech text-[9px] text-zinc-600 px-3 pt-3">
              <div className="col-span-4">METRIC</div>
              <div className="col-span-3 text-center">HUMAN</div>
              <div className="col-span-3 text-center text-[#00E5FF]">QK ENGINE</div>
              <div className="col-span-2 text-right">DELTA</div>
            </div>
            {[
              { k: "Divisional cross-refs", a: "02–03", b: "16 / 16", ratio: 99 },
              { k: "Variable concurrency",  a: "~12",   b: "148",     ratio: 95 },
              { k: "Dasha window scan",     a: "hours", b: "40 ms",   ratio: 98 },
              { k: "Bias surface",          a: "high",  b: "zero",    ratio: 100 },
              { k: "Session iteration",     a: "1 / mo", b: "live",   ratio: 96 },
            ].map((r, i) => (
              <div key={r.k} className="grid grid-cols-12 gap-2 items-center px-3 py-4 border-t border-white/5 font-mono-tech text-[10px] hover:bg-white/[0.02] transition-colors">
                <div className="col-span-4 text-zinc-400">{r.k}</div>
                <div className="col-span-3 text-center text-zinc-600">{r.a}</div>
                <div className="col-span-3 text-center text-white">{r.b}</div>
                <div className="col-span-2 text-right text-[#FF5E3A]">+{r.ratio}%</div>
                <motion.div
                  className="col-span-12 h-[2px] bg-white/5 overflow-hidden mt-2"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${r.ratio}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.1 + i * 0.08, ease: [0.22,1,0.36,1] }}
                    className="h-full"
                    style={{ background: "linear-gradient(90deg, #FF5E3A, #00E5FF, #7B61FF)" }}
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const DASHBOARD_FEATURES = [
  {
    id: "dasha",
    title: "Vimshottari Timeline",
    kicker: "Exact Timing of Life Chapters",
    accent: "#00E5FF",
    icon: <Clock size={20} strokeWidth={1.5} />,
    problem: "Sudden job loss? Painful divorce?",
    solution: "See the exact month your current painful Mahadasha ends, down to the minute. Know exactly when your peak earning years actually begin.",
  },
  {
    id: "remedy",
    title: "Custom Mantric Remedies",
    kicker: "Vibrational Corrections",
    accent: "#FF5E3A",
    icon: <Shield size={20} strokeWidth={1.5} />,
    problem: "Experiencing a sudden, massive financial drain?",
    solution: "Stop relying on generic advice. We prescribe the exact 2 mantras required to pacify the specific planets wrecking your chart right now.",
  },
  {
    id: "calendar",
    title: "Destiny Window Calendar",
    kicker: "Monthly Auspicious Mapping",
    accent: "#FFB547",
    icon: <Calendar size={20} strokeWidth={1.5} />,
    problem: "Signing a major contract next week?",
    solution: "Do not sign on a Thursday if your transit Mars destroys your leverage. See exactly which days guarantee success.",
  },
  {
    id: "karma",
    title: "Karma DNA & Patterns",
    kicker: "Generational Blueprint Decoding",
    accent: "#7B61FF",
    icon: <Search size={20} strokeWidth={1.5} />,
    problem: "Stuck in a cycle of repeated relationship failures?",
    solution: "Find out exactly what your deepest birth chart divisions demand you change. Break the cycle permanently.",
  },
  {
    id: "journal",
    title: "Life Journal Therapist",
    kicker: "AI Sentiment & Transit Analysis",
    accent: "#E879F9",
    icon: <Mic size={20} strokeWidth={1.5} />,
    problem: "Feeling overwhelmed and disconnected from why you're struggling today?",
    solution: "Speak your truth. We use advanced vocal sentiment analysis mapped against your active transits to validate your emotions and provide a 1-step behavioral remedy.",
  },
  {
    id: "ishta",
    title: "Ishta Devata Alignment",
    kicker: "Soul-Level Spiritual Acceleration",
    accent: "#00E5FF",
    icon: <Eye size={20} strokeWidth={1.5} />,
    problem: "Struggling to find the right meditation practice or focal point for your spiritual energy?",
    solution: "Discover your exact Ishta Devata—the specific deity mathematically aligned to your soul's D9 Navamsa signature—to unlock deep spiritual and material acceleration.",
  },
  {
    id: "gotra",
    title: "Ancestral Gotra Tracing",
    kicker: "Vedic DNA & Lineage Decoding",
    accent: "#FFB547",
    icon: <Network size={20} strokeWidth={1.5} />,
    problem: "Disconnected from your roots or unaware of the ancient sages your soul descends from?",
    solution: "Trace your exact Vedic lineage. Discover the specific cosmic Rishis (Saptarishis) that govern your spiritual DNA and ancestral karmic inheritances.",
  }
];

const StackedFeatures = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full max-w-lg mx-auto h-[750px] md:h-[600px] flex items-center justify-center cursor-pointer perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className={`font-mono-tech text-[10px] text-zinc-500 transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100 animate-pulse'}`}>
          [ HOVER TO EXPAND COMMAND CENTER ]
        </p>
      </div>

      {DASHBOARD_FEATURES.map((feature, i) => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const baseZIndex = DASHBOARD_FEATURES.length - i;
        
        // Stacked state (folded)
        const stackY = i * 20;
        const stackScale = 1 - (i * 0.06);
        const stackRotate = i % 2 === 0 ? i * 2.5 : -i * 2.5;
        
        // Expanded state (fanned out)
        // Center index for 7 items is 3
        const centerOffset = i - 3;
        
        // Desktop: Tighter horizontal spread, biased leftwards (centerOffset - 1.5) to avoid right-side cutoff
        const spreadX = isMobile ? 0 : (centerOffset - 1.5) * 85;
        const spreadY = isMobile ? centerOffset * 105 : centerOffset * 25;
        const spreadRotate = isMobile ? 0 : centerOffset * 5;

        return (
          <motion.div
            key={feature.id}
            initial={false}
            animate={{
              x: isHovered ? spreadX : 0,
              y: isHovered ? spreadY : stackY,
              scale: isHovered ? 1 : stackScale,
              rotate: isHovered ? spreadRotate : stackRotate,
              zIndex: baseZIndex,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
            whileHover={{ scale: 1.05, zIndex: 50, rotate: 0 }}
            className="absolute w-full max-w-[320px] bg-[#0A0A12] border p-6 rounded-2xl flex flex-col pointer-events-auto"
            style={{ 
              borderColor: `${feature.accent}50`, 
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px -10px ${feature.accent}30` 
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-[#050507] border rounded-lg" style={{ borderColor: `${feature.accent}66`, color: feature.accent }}>
                {feature.icon}
              </div>
              <div className="font-mono-tech text-[9px] uppercase tracking-widest" style={{ color: feature.accent }}>
                {feature.kicker}
              </div>
            </div>
            <h3 className="font-serif-display text-2xl text-white mb-5 leading-tight">
              {feature.title}
            </h3>
            
            <div className="space-y-3 flex-1 flex flex-col justify-end">
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                <div className="text-zinc-500 font-mono-tech text-[8px] mb-1.5 uppercase tracking-wider">The Problem</div>
                <p className="text-zinc-300 font-body text-xs leading-relaxed">{feature.problem}</p>
              </div>
              <div className="bg-[#050507] border p-3 rounded-lg border-l-2" style={{ borderLeftColor: feature.accent, borderTopColor: 'rgba(255,255,255,0.05)', borderRightColor: 'rgba(255,255,255,0.05)', borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                <div className="font-mono-tech text-[8px] mb-1.5 uppercase tracking-wider" style={{ color: feature.accent }}>The Solution</div>
                <p className="text-white font-body text-xs leading-relaxed">{feature.solution}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
};

const CalendarMockup = () => {
  const days = [
    { date: "10", type: "neutral" },
    { date: "11", type: "neutral" },
    { date: "12", type: "auspicious", task: "Sign Contract" },
    { date: "13", type: "neutral" },
    { date: "14", type: "neutral" },
    { date: "15", type: "inauspicious", task: "Avoid Conflict" },
    { date: "16", type: "neutral" },
  ];
  return (
    <div className="bg-[#0A0A12] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-white font-mono-tech text-[10px] tracking-widest">PERSONAL CALENDAR</h3>
        <span className="bg-white/10 px-2 py-1 rounded text-[9px] text-zinc-300">THIS WEEK</span>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-2 text-center relative z-10">
        {["M","T","W","T","F","S","S"].map((d,i) => <div key={i} className="text-zinc-500 text-[9px]">{d}</div>)}
      </div>
      
      <div className="grid grid-cols-7 gap-2 relative z-10">
        {days.map((d, i) => (
          <div key={i} className={`group relative flex flex-col items-center justify-center p-2 rounded-md border transition-colors cursor-default ${
            d.type === 'auspicious' ? 'border-[#00E5FF] bg-[#00E5FF]/10' :
            d.type === 'inauspicious' ? 'border-[#FF5E3A] bg-[#FF5E3A]/10' :
            'border-white/5 bg-white/5 hover:bg-white/10'
          } aspect-square`}>
            <span className={`text-[11px] font-bold ${
              d.type === 'auspicious' ? 'text-[#00E5FF]' :
              d.type === 'inauspicious' ? 'text-[#FF5E3A]' :
              'text-zinc-400'
            }`}>{d.date}</span>
            {d.task && (
              <div className={`w-1 h-1 rounded-full mt-1 ${d.type === 'auspicious' ? 'bg-[#00E5FF]' : 'bg-[#FF5E3A]'}`} />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex flex-col gap-3 relative z-10">
        <div className="bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-lg p-3 flex items-center justify-between group hover:bg-[#00E5FF]/10 transition-colors cursor-pointer">
           <div>
             <div className="text-[#00E5FF] text-[9px] font-mono-tech mb-1">12TH · AUSPICIOUS WINDOW</div>
             <div className="text-white text-xs font-semibold flex items-center gap-2">
               <div className="w-2 h-2 rounded-full border border-[#00E5FF]" />
               Sign Business Contract
             </div>
           </div>
        </div>
        <div className="bg-[#FF5E3A]/5 border border-[#FF5E3A]/20 rounded-lg p-3 flex items-center justify-between group hover:bg-[#FF5E3A]/10 transition-colors cursor-pointer">
           <div>
             <div className="text-[#FF5E3A] text-[9px] font-mono-tech mb-1">15TH · DESTRUCTIVE TRANSIT</div>
             <div className="text-white text-xs font-semibold flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#FF5E3A]" />
               Avoid Client Conflict
             </div>
           </div>
        </div>
      </div>
      
      <div className="mt-5 text-center relative z-10">
        <button className="text-[10px] font-mono-tech text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2 w-full border border-white/10 rounded-lg py-2 hover:bg-white/5">
          + ADD NEW TASK
        </button>
      </div>
    </div>
  )
};

const DashboardShowcase = () => (
  <section data-testid="section-dashboard-showcase" className="relative py-28 md:py-36 border-t border-white/5 overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-20" />
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 relative">
      <SectionLabel n={9} label="YOUR PERSONAL COMMAND CENTER" accent="#00E5FF" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
        <Reveal className="lg:col-span-6">
          <h2 className="font-serif-display text-5xl md:text-6xl lg:text-7xl leading-[0.92] tracking-[-0.03em]">
            Stop guessing. <br />
            <span className="italic-serif text-zinc-500">Take control of your</span> <span className="text-white">exact timeline</span>.
          </h2>
          <p className="font-body text-zinc-400 leading-relaxed text-lg mt-8">
            This is what you get inside. A dashboard built for immediate, real-world application. No vague predictions. Just hard facts, exact dates, and specific actions. 
          </p>
          <div className="mt-8 flex flex-col gap-4 border-l border-white/10 pl-6">
            <p className="font-mono-tech text-[10px] text-zinc-500 tracking-widest uppercase">The Edge You Gain:</p>
            <ul className="space-y-3 font-body text-sm text-zinc-300">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full"/> Know exactly when your peak earning years begin.</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#FF5E3A] rounded-full"/> Stop sudden financial drains with precise planetary pacification.</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#FFB547] rounded-full"/> Never sign a major contract on a destructive transit day.</li>
            </ul>
          </div>
        </Reveal>
        
        <Reveal delay={2} className="lg:col-span-6 flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12">
          <div className="w-full md:w-1/2 flex-shrink-0 z-20">
            <StackedFeatures />
          </div>
          <div className="w-full md:w-1/2 flex-shrink-0 z-10 hidden md:block opacity-90 hover:opacity-100 transition-opacity">
            <CalendarMockup />
          </div>
        </Reveal>
      </div>

      {/* Mobile Calendar Mockup (only shows on small screens below the stack) */}
      <div className="md:hidden mt-8">
        <Reveal delay={4}>
          <CalendarMockup />
        </Reveal>
      </div>
      
    </div>
  </section>
);

/* Per-panel category lock-in (micro-conversion) */
const CategoryLock = ({ category, accent }) => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | submitting | locked | error

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setState("submitting");
    try {
      // Submit email capture via the project's own save-lead API
      await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, category, source: "category-lock" }),
      });
      setState("locked");
      toast.success(`${category.toUpperCase()} preview locked. Check your inbox.`);
    } catch {
      setState("error");
      toast.error("Could not lock your preview. Retry.");
    }
  };

  // reset when category changes
  useEffect(() => { setState("idle"); setEmail(""); }, [category]);

  if (state === "locked") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        data-testid={`lock-success-${category}`}
        className="mt-10 border border-dashed p-5 flex items-center justify-between"
        style={{ borderColor: `${accent}66`, background: `${accent}08` }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-9 h-9 flex items-center justify-center"
            style={{ background: accent, color: "#050507" }}
          >
            <Sparkles size={14} strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-serif-display text-lg" style={{ color: accent }}>Locked.</div>
            <div className="font-mono-tech text-[10px] text-zinc-500 mt-1">
              Your {category.toUpperCase()} preview is being computed — delivered in ~48 h.
            </div>
          </div>
        </div>
        <div className="font-mono-tech text-[10px] text-zinc-500 hidden md:block">
          + You're on the waitlist
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={submit}
      data-testid={`lock-form-${category}`}
      className="mt-10 relative"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 font-mono-tech text-[10px]" style={{ color: accent }}>
          <Sparkles size={12} strokeWidth={1.3} />
          <span>LOCK IN YOUR {category.toUpperCase()} PREVIEW — FREE</span>
        </div>
        <div className="font-mono-tech text-[10px] text-zinc-500 hidden md:block">
          · 1,248 claimed this week
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 border border-white/10 bg-white/[0.02] p-2 focus-within:border-white/30 transition-colors">
        <input
          data-testid={`lock-email-${category}`}
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent px-4 py-3 font-body text-sm placeholder:text-zinc-600 focus:outline-none"
        />
        <button
          type="submit"
          data-testid={`lock-submit-${category}`}
          disabled={state === "submitting"}
          className="group relative font-mono-tech text-[10px] px-6 py-3 transition-colors disabled:opacity-60"
          style={{ background: accent, color: "#050507" }}
        >
          <span className="inline-flex items-center gap-2">
            {state === "submitting" ? "Locking…" : "Lock my preview"}
            <ArrowUpRight size={12} strokeWidth={1.8} className="group-hover:rotate-45 transition-transform duration-500" />
          </span>
        </button>
      </div>
      <div className="font-mono-tech text-[9px] text-zinc-600 mt-3">
        No card · No spam · Just your {category.toUpperCase()} preview, delivered.
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* 10. REAL LIFE PROBLEMS — tabbed questions                            */
/* ------------------------------------------------------------------ */
const LIFE_TABS = [
  {
    id: "career",
    label: "Career & Purpose",
    short: "Career",
    accent: "#00E5FF",
    icon: <Zap size={16} strokeWidth={1.3} />,
    kicker: "Stop guessing. Start striking.",
    questions: [
      "The signs your job is quietly becoming expendable — long before HR confirms it.",
      "When to ask for the raise — and when to keep your head down.",
      "The industries where you actually won't burn out.",
      "When to switch jobs vs. when to shut up and grind.",
      "Your natural leadership style — and why people hate working for you.",
    ],
  },
  {
    id: "wealth",
    label: "Wealth & Money",
    short: "Wealth",
    accent: "#FFB547",
    icon: <Orbit size={16} strokeWidth={1.3} />,
    kicker: "Know the windows. Time the moves.",
    questions: [
      "When your next real money window opens — to the month.",
      "The years you should not buy property. At any cost.",
      "When you're allowed to take the bigger risk.",
      "Why money keeps leaking out the same hole every year.",
      "The single investing habit your chart will reward.",
    ],
  },
  {
    id: "love",
    label: "Love & Relationships",
    short: "Love",
    accent: "#FF5E3A",
    icon: <InfinityIcon size={16} strokeWidth={1.3} />,
    kicker: "The patterns you didn't name.",
    questions: [
      "Why you keep dating the same person in different bodies.",
      "When you'll actually meet someone who sticks.",
      "The years your marriage will be genuinely tested.",
      "What you unconsciously destroy in every relationship.",
      "The partner archetype your chart is loudly asking for.",
    ],
  },
  {
    id: "health",
    label: "Health & Vitality",
    short: "Health",
    accent: "#7B61FF",
    icon: <Activity size={16} strokeWidth={1.3} />,
    kicker: "Your body keeps the score.",
    questions: [
      "The years your body is most vulnerable — and why.",
      "Why stress hits you differently than it hits everyone else.",
      "The diet pattern your chart is quietly asking for.",
      "When to slow down before your nervous system forces you to.",
      "The habit that's silently aging you 3x faster.",
    ],
  },
];

const LifestylePillars = () => {
  const [tab, setTab] = useState(0);
  const active = LIFE_TABS[tab];
  return (
    <section data-testid="section-pillars" className="relative py-32 md:py-44 border-t border-white/5 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-colors duration-700"
        style={{ background: `radial-gradient(600px at 20% 30%, ${active.accent}15, transparent 60%)` }}
      />
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 relative">
        <SectionLabel n={10} label="WHAT YOU ACTUALLY GET" accent="#FF5E3A" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <Reveal className="lg:col-span-8">
            <h2 className="font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em]">
              Real life <span className="italic-serif text-zinc-500">problems.</span><br />
              Real <span className="shimmer-text">timelines</span>.
            </h2>
          </Reveal>
          <Reveal delay={2} className="lg:col-span-4">
            <p className="font-body text-zinc-400 leading-relaxed">
              The Life Intelligence Report answers the exact questions you're already losing sleep over.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-16">
          {/* Tabs */}
          <div className="lg:col-span-4 space-y-2">
            {LIFE_TABS.map((t, i) => (
              <motion.button
                key={t.id}
                data-testid={`life-tab-${t.id}`}
                onClick={() => setTab(i)}
                whileHover={{ x: tab === i ? 0 : 4 }}
                className={`group relative w-full text-left p-5 md:p-6 border transition-all duration-500 overflow-hidden ${
                  tab === i
                    ? "border-transparent"
                    : "border-white/10 hover:border-white/30"
                }`}
                style={tab === i ? {
                  background: `linear-gradient(135deg, ${t.accent}18, transparent 70%)`,
                  boxShadow: `inset 0 0 0 1px ${t.accent}66`,
                } : {}}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 flex items-center justify-center border transition-colors duration-500"
                      style={{
                        borderColor: tab === i ? t.accent : "rgba(255,255,255,0.15)",
                        color: tab === i ? t.accent : "#A1A1AA",
                        background: tab === i ? `${t.accent}15` : "transparent",
                      }}
                    >
                      {t.icon}
                    </span>
                    <div>
                      <div className="font-mono-tech text-[9px] text-zinc-500">
                        {String(i + 1).padStart(2, "0")} · CATEGORY
                      </div>
                      <div
                        className="font-serif-display text-2xl md:text-3xl leading-none mt-1 transition-colors duration-500"
                        style={{ color: tab === i ? t.accent : "#F8FAFC" }}
                      >
                        {t.label}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1}
                    className={`mt-1 transition-all duration-500 ${tab === i ? "rotate-45" : ""}`}
                    style={{ color: tab === i ? t.accent : "#52525B" }}
                  />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Panel */}
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 relative border border-white/10 p-8 md:p-12 min-h-[540px] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${active.accent}12, transparent 60%)`,
            }}
            data-testid="life-panel"
          >
            <div
              className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${active.accent}44, transparent 60%)`,
                filter: "blur(60px)",
              }}
            />
            <div className="relative flex items-center justify-between">
              <div className="inline-flex items-center gap-2 font-mono-tech text-[10px] px-3 py-1.5 border" style={{ borderColor: `${active.accent}66`, color: active.accent }}>
                {active.icon}<span>{active.short.toUpperCase()}</span>
              </div>
              <div className="font-mono-tech text-[10px] text-zinc-500 hidden md:block">
                05 QUESTIONS · ANSWERED IN YOUR REPORT
              </div>
            </div>

            <div className="relative mt-10">
              <div className="font-serif-display text-3xl md:text-5xl leading-[1.02]" style={{ color: active.accent }}>
                {active.kicker}
              </div>
            </div>

            <ol className="relative mt-10 space-y-4">
              {active.questions.map((q, i) => (
                <motion.li
                  key={q}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                  className="group flex items-start gap-5 border-b border-white/5 pb-4 hover:border-white/20 transition-colors"
                  data-testid={`life-q-${active.id}-${i}`}
                >
                  <span
                    className="font-mono-tech text-[11px] shrink-0 w-7 text-right mt-1"
                    style={{ color: active.accent }}
                  >
                    0{i + 1}
                  </span>
                  <span className="font-serif-display text-xl md:text-2xl text-white leading-snug group-hover:translate-x-1 transition-transform duration-300">
                    {q}
                  </span>
                </motion.li>
              ))}
            </ol>

            <div className="relative mt-10 font-mono-tech text-[10px] text-zinc-500">
              · Every answer · dated to the month · for your chart ·
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 11. ASK-ANYTHING AI CHAT ILLUSTRATION                                */
/* ------------------------------------------------------------------ */
const CHAT_SCRIPT = [
  { role: "user", text: "Should I take the new job offer in Berlin?" },
  {
    role: "ai",
    text: "Your Venus–Mercury transit opens a career window from Sep 2026 → Mar 2027. The role maps cleanly to your D10 Dasamsa signature. Take it — but sign before Feb 14.",
    meta: "cross-ref · D10 · Ve MD · 94% confidence",
  },
  { role: "user", text: "Why do I keep attracting avoidant partners?" },
  {
    role: "ai",
    text: "Your Upapada Lagna sits with Saturn — you unconsciously pick people who make you work for love. The pattern breaks the moment you stop auditioning.",
    meta: "cross-ref · UL · Sa · D9",
  },
];

const TypingDots = ({ color = "#00E5FF" }) => (
  <div className="flex items-center gap-1.5 h-4" data-testid="typing-dots">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const FamilyOffice = () => {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const run = () => {
      // reset
      setStep(0);
      setTyping(false);
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];

      let t = 0;
      CHAT_SCRIPT.forEach((msg, i) => {
        if (msg.role === "ai") {
          // show typing first
          t += 1100;
          timers.current.push(setTimeout(() => setTyping(true), t));
          t += 1400;
          timers.current.push(setTimeout(() => {
            setTyping(false);
            setStep(i + 1);
          }, t));
        } else {
          t += 900;
          timers.current.push(setTimeout(() => setStep(i + 1), t));
        }
      });
      // loop
      t += 4500;
      timers.current.push(setTimeout(run, t));
    };
    run();
    return () => timers.current.forEach((x) => clearTimeout(x));
  }, []);

  return (
    <section data-testid="section-family" className="relative py-32 md:py-44 border-t border-white/5 overflow-hidden">
      <div className="aurora-blob" style={{ width: 640, height: 640, background: "#7B61FF", top: "10%", left: "-15%", opacity: 0.2 }} />
      <div className="aurora-blob" style={{ width: 520, height: 520, background: "#00E5FF", bottom: "-10%", right: "-10%", opacity: 0.2, animationDelay: "-8s" }} />
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 relative">
        <SectionLabel n={11} label="ASK-ANYTHING INTELLIGENCE" accent="#00E5FF" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <Reveal className="lg:col-span-5">
            <h2 className="font-serif-display text-5xl md:text-7xl leading-[0.9] tracking-[-0.03em]">
              Ask anything<span className="text-zinc-600">.</span><br />
              <span className="italic-serif text-zinc-500">It already</span> <br />
              <span className="shimmer-text">knows.</span>
            </h2>
            <p className="font-body text-zinc-300 mt-8 max-w-md leading-relaxed text-lg">
              Your chart becomes a conversation. Our model has read <span className="text-white">11,000+ Vedic texts</span> and cross-references them against your 16 divisional charts in real time.
            </p>
            <div className="mt-10 space-y-3">
              {[
                { k: "Natural language", v: "Ask like you'd ask a friend" },
                { k: "Grounded answers", v: "Every reply cites the variable" },
                { k: "Month-level dates", v: "Not 'soon'. Actual windows." },
                { k: "Zero BS filter", v: "Compliant, honest, non-mystical" },
              ].map((r, i) => (
                <motion.div
                  key={r.k}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex items-center justify-between gap-4 py-2 border-b border-white/5"
                >
                  <span className="font-serif-display text-lg text-white">{r.k}</span>
                  <span className="font-mono-tech text-[10px] text-zinc-500 text-right">{r.v}</span>
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={2} className="lg:col-span-7">
            <div className="relative">
              {/* chat shell */}
              <div className="relative glass overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <svg width="28" height="28" viewBox="0 0 28 28" className="spin-slower" style={{ transformOrigin: "center" }} aria-hidden="true">
                        <circle cx="14" cy="14" r="12" fill="none" stroke="#00E5FF" strokeWidth="1" />
                        <polygon points="14,4 24,22 4,22" fill="none" stroke="#7B61FF" strokeWidth="1" />
                        <circle cx="14" cy="14" r="3" fill="#FF5E3A" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-serif-display text-sm">Quantum Karma · LI v.1</div>
                      <div className="font-mono-tech text-[9px] text-zinc-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] pulse-dot" />
                        GROUNDED · 148 VARIABLES · 16 DIVISIONALS
                      </div>
                    </div>
                  </div>
                  <div className="font-mono-tech text-[9px] text-zinc-600 hidden md:block">
                    MODEL · qk-reasoner-3.2
                  </div>
                </div>

                {/* message stream */}
                <div className="relative p-6 md:p-8 h-[850px] sm:h-[700px] md:h-[600px] flex flex-col gap-5">
                  {CHAT_SCRIPT.slice(0, step).map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      data-testid={`chat-msg-${i}`}
                    >
                      {m.role === "ai" && (
                        <div className="mr-3 w-8 h-8 shrink-0 rounded-full border border-[#00E5FF]/40 flex items-center justify-center" style={{ background: "rgba(0,229,255,0.08)" }}>
                          <Sparkles size={12} strokeWidth={1.3} className="text-[#00E5FF]" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-5 py-4 ${
                          m.role === "user"
                            ? "bg-[#F8FAFC] text-[#050507]"
                            : "border border-white/10 bg-white/[0.03] text-white"
                        }`}
                      >
                        <div className={`font-mono-tech text-[9px] mb-2 ${m.role === "user" ? "text-zinc-500" : "text-[#00E5FF]"}`}>
                          {m.role === "user" ? "YOU" : "QK · AI"}
                        </div>
                        <div className="font-serif-display text-xl leading-snug">
                          {m.text}
                        </div>
                        {m.meta && (
                          <div className="mt-3 pt-3 border-t border-white/10 font-mono-tech text-[9px] text-zinc-500">
                            {m.meta}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* typing indicator */}
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full border border-[#00E5FF]/40 flex items-center justify-center" style={{ background: "rgba(0,229,255,0.08)" }}>
                        <Sparkles size={12} strokeWidth={1.3} className="text-[#00E5FF]" />
                      </div>
                      <div className="px-5 py-4 border border-white/10 bg-white/[0.03]">
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}

                  {/* scanning overlay when typing */}
                  {typing && <div className="scanline" style={{ top: "40%" }} />}

                  {/* empty state / scroll anchor */}
                  <div className="flex-1" />
                </div>

                {/* input bar */}
                <div className="border-t border-white/10 p-4 flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 border border-white/10 bg-white/[0.02] px-4 py-3">
                    <KeyRound size={14} strokeWidth={1} className="text-zinc-500" />
                    <div className="font-body text-sm text-zinc-500 truncate">
                      Ask about your career, money, love, health…
                    </div>
                  </div>
                  <button
                    data-testid="chat-send"
                    disabled
                    className="shrink-0 w-11 h-11 bg-[#F8FAFC] text-[#050507] flex items-center justify-center"
                  >
                    <ArrowUpRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 12. DATA PRIVACY                                                    */
/* ------------------------------------------------------------------ */
const PRIVACY = [
  { icon: <Lock size={20} strokeWidth={1}/>,   t: "AES-256", s: "At rest",     accent: "#00E5FF" },
  { icon: <Shield size={20} strokeWidth={1}/>, t: "TLS 1.3", s: "In transit",  accent: "#7B61FF" },
  { icon: <Eye size={20} strokeWidth={1}/>,    t: "Zero-sale",s: "Never shared", accent: "#FF5E3A" },
  { icon: <KeyRound size={20} strokeWidth={1}/>,t: "Deletion", s: "Granular, instant", accent: "#FFB547" },
];

const DataPrivacy = () => (
  <section data-testid="section-privacy" className="relative py-32 md:py-44 border-t border-white/5">
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
      <SectionLabel n={12} label="DATA INTEGRITY" accent="#00E5FF" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        <Reveal className="lg:col-span-7">
          <h2 className="font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em]">
            Your birth data <br />
            <span className="italic-serif text-zinc-500">is your most</span> <br />
            <span className="shimmer-text">personal data.</span>
          </h2>
        </Reveal>
        <Reveal delay={2} className="lg:col-span-5">
          <p className="font-body text-zinc-400 text-lg leading-relaxed">
            Bank-grade. Non-negotiable. Read-only by you.
          </p>
        </Reveal>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
        {PRIVACY.map((c, i) => (
          <Reveal key={i} delay={i}>
            <div
              data-testid={`privacy-${i}`}
              className="group relative border border-white/10 p-8 h-full hover-lift overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 20%, ${c.accent}22, transparent 60%)` }}
              />
              <div className="relative">
                <div style={{ color: c.accent }} className="mb-8">{c.icon}</div>
                <div className="font-serif-display text-4xl">{c.t}</div>
                <div className="font-mono-tech text-[9px] text-zinc-500 mt-2">{c.s}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 13. SUBSCRIPTION                                                    */
/* ------------------------------------------------------------------ */
/* 13. SUBSCRIPTION                                                    */
/* ------------------------------------------------------------------ */

const PLAN_PDF = {
  id: "pdf",
  label: "01 · ONE-TIME",
  name: "The Report",
  price: "₹4,799",
  priceUSD: "$79",
  period: "one-time",
  accent: "#FF5E3A",
  badge: null,
  perks: [
    "Full human Jyotishi analysis",
    "16 divisional chart computation",
    "148+ astrological variables",
    "Multi Page Life Intelligence Report",
    "Career, wealth, love & health windows",
    "Exact timing windows, not vague seasons",
    "Ancestral & karmic pattern mapping",
    "One follow-up round via email",
    "Delivered within 24 hours",
    "Lifetime access to your report",
  ],
  cta: "Initiate Report",
};

const PLAN_CREDITS = {
  id: "credits",
  label: "02 · MONTHLY",
  name: "AI Credits",
  price: "₹1,799",
  priceUSD: "$39",
  period: "50 credits",
  accent: "#00E5FF",
  badge: "MOST POPULAR",
  perks: [
    "50 credits included on activation",
    "Real-time AI intelligence system",
    "Extended limits on follow-up questions",
    "Cross-referenced across all 16 divisionals",
    "Career, wealth, relationships & health",
    "Precise date windows — not vague seasons",
    "Family member profiles supported",
    "Credits scale with response complexity",
    "Credits never expire within active period",
    "Priority access to new capabilities",
  ],
  cta: "Activate Credits",
};

const CREDIT_MODAL_POINTS = [
  { t: "Frontier-Grade Intelligence", d: "We deploy highly trained, frontier-grade AI systems purpose-built for Vedic reasoning. These are not general-purpose models — they are tuned to our proprietary Vedic computation framework." },
  { t: "Custom Reasoning Frameworks", d: "Every response runs through our custom multi-layer reasoning pipeline: intent classification, astronomical data retrieval, divisional chart cross-referencing, and Dasha-Bhukti temporal mapping — all in one exchange." },
  { t: "Credit Consumption Formula", d: "Our engine measures the true computational weight of every exchange — factoring in astronomical precision, divisional chart depth, dasha recursion layers, and the complexity of your inquiry. Heavier analysis consumes more credits. Lighter queries consume fewer. You are billed for what the engine actually does, not for simply sending a message." },
  { t: "Typical Usage", d: "A standard question uses approximately 1 credit. A deeply complex, multi-domain inquiry (e.g. 'analyze my career, marriage, and health simultaneously') may consume 2–3 credits due to the exponentially larger data retrieval and reasoning required." },
  { t: "No Hidden Charges", d: "Credits are only deducted after a response is successfully generated. If our system fails to respond, no credits are consumed. You will always see your remaining balance after each exchange." },
  { t: "Credit Validity", d: "Credits do not expire within your active subscription period. They are non-transferable, non-refundable once consumed, and are tied to your account's birth chart data." },
  { t: "Confidentiality", d: "Your queries, birth data, and credit activity are encrypted and stored on secured infrastructure. We do not sell or share any of your data." },
];

const CreditsModal = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="credits-modal-bg"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
          background: "rgba(5,5,7,0.9)", backdropFilter: "blur(20px)",
          overflowY: "auto",
        }}
      >
        <motion.div
          key="credits-modal-card"
          initial={{ y: 28, scale: 0.95, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 28, scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 280 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: 680,
            height: "min(85vh, 700px)",
            display: "flex", flexDirection: "column",
            flexShrink: 0,
            background: "#0B0B12",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,229,255,0.06)",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 2, background: "linear-gradient(90deg,#FF5E3A,#00E5FF,#7B61FF)", flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", letterSpacing: "0.2em", color: "#00E5FF", textTransform: "uppercase", marginBottom: 6 }}>CREDIT SYSTEM TRANSPARENCY</div>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: "1.75rem", color: "#fff" }}>How credits<span style={{ color: "#00E5FF" }}>.</span> <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>work.</span></div>
            </div>
            <button onClick={onClose}
              style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
            >
              <Zap size={13} strokeWidth={1.5} />
            </button>
          </div>
          <div data-lenis-prevent style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "28px 28px 40px", WebkitOverflowScrolling: "touch" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {CREDIT_MODAL_POINTS.map((pt, i) => (
                <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", color: "#00E5FF", fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>{pt.t}</div>
                  </div>
                  <p style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.75, paddingLeft: 30 }}>{pt.d}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: "14px 18px", background: "rgba(255,94,58,0.06)", border: "1px solid rgba(255,94,58,0.2)" }}>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", lineHeight: 1.8 }}>
                Credits are non-refundable once consumed. We reserve the right to adjust credit rates for future plans; existing purchased credits are always honoured at their original rate.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const NEW_FEATURES = [
  { t: "Dasha Life Planner", d: "A precise chronological breakdown of your active planetary periods (Mahadasha, Antardasha) and their real-world impact. Know exactly when your underlying karmic operating system shifts." },
  { t: "Live Planetary Transits", d: "High-fidelity mapping of current planetary positions overlaid on your birth chart. Understand exactly how real-time orbital mechanics are interacting with your baseline identity." },
  { t: "Destiny Calendar", d: "Calculate mathematically optimal windows for major life events. We identify your peak periods for career moves, financial investments, and relationship decisions based on aggregate planetary momentum." },
  { t: "Karma DNA Analysis", d: "Deep ancestral metric calculation using D12 and D60 divisional charts. Uncover inherited psychological blindspots and multi-generational behavioral loops that are quietly running your life." },
  { t: "Deep Compatibility Matrix", d: "Beyond basic sign matching. We run a 36-point structural analysis alongside intense divisional crossover metrics (D9 Navamsa resonance) to determine genuine long-term psychological and physical alignment." },
  { t: "Predictive Question Engine", d: "Ask direct, highly specific questions about your future. Our AI engines use your hyper-accurate astronomical data to calculate probable outcomes and optimal strategic actions." }
];

const FeaturesModal = ({ onClose }) => {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <AnimatePresence>
      <motion.div key="features-modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(5,5,7,0.92)", backdropFilter: "blur(20px)", overflowY: "auto" }}>
        <motion.div key="features-modal-card" initial={{ y: 24, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 24, scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 280 }} onClick={e => e.stopPropagation()}
          style={{ width: "100%", maxWidth: 640, height: "min(88vh,700px)", display: "flex", flexDirection: "column", flexShrink: 0, background: "#0B0B12", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.9)", overflow: "hidden" }}>
          
          <div style={{ height: 2, background: "linear-gradient(90deg,#00E5FF,#7B61FF,#FF5E3A)", flexShrink: 0 }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9px", letterSpacing: "0.2em", color: "#FF5E3A", textTransform: "uppercase", marginBottom: 6 }}>INTELLIGENCE UPGRADE</div>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: "1.75rem", color: "#fff" }}>Advanced<span style={{ color: "#FF5E3A" }}>.</span> <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>Capabilities.</span></div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff" }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)" }}>
              <X size={13} strokeWidth={1.5} />
            </button>
          </div>
          
          <div data-lenis-prevent style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "28px 28px 40px", WebkitOverflowScrolling: "touch" }}>
            <div style={{ background: "rgba(255,94,58,0.07)", border: "1px solid rgba(255,94,58,0.25)", padding: "18px 22px", marginBottom: 28 }}>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>
                Your AI Credits unlock continuous access to an expanding suite of highly personalized, math-backed astrological engines. No generic horoscopes — just pure computation tailored to your exact coordinates.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {NEW_FEATURES.map((pt, i) => (
                <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF5E3A" }} />
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>{pt.t}</div>
                  </div>
                  <p style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.75, paddingLeft: 16 }}>{pt.d}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PlanCard = ({ plan, isCredits, currency = "INR" }) => {
  const [showModal, setShowModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const { openAuthModal } = useAuthModal();

  return (
    <>
      <div
        className="group relative border flex flex-col h-full overflow-hidden hover-lift"
        style={isCredits
          ? { borderColor: plan.accent, background: `linear-gradient(135deg, ${plan.accent}0D, transparent 60%)` }
          : { borderColor: "rgba(255,255,255,0.1)" }
        }
      >
        {/* hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 0% 0%, ${plan.accent}18, transparent 55%)` }} />

        {plan.badge && (
          <div className="absolute top-0 right-0 font-mono-tech text-[9px] px-3 py-1" style={{ background: plan.accent, color: "#050507" }}>
            {plan.badge}
          </div>
        )}

        {/* top accent bar */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${plan.accent}, transparent)`, flexShrink: 0 }} />

        <div className="relative p-8 flex flex-col flex-1">
          {/* label + name */}
          <div className="font-mono-tech text-[10px] text-zinc-500 mb-2">{plan.label}</div>
          <div className="font-serif-display text-5xl mb-8">{plan.name}</div>

          {/* price */}
          <div className="flex items-baseline gap-3 pb-8 border-b border-white/10">
            <div className="font-serif-display text-6xl" style={{ color: plan.accent }}>{currency === "INR" ? plan.price : plan.priceUSD}</div>
            <div className="font-mono-tech text-[10px] text-zinc-500">{plan.period}</div>
          </div>

          {/* features */}
          <ul className="mt-8 space-y-3 flex-1">
            {plan.perks.map((p, i) => (
              <li key={i} className="font-body text-sm text-zinc-300 flex items-start gap-3">
                <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: plan.accent }} />
                {p}
              </li>
            ))}
          </ul>

          {/* disclaimer for credits plan */}
          {isCredits && (
            <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => setShowModal(true)}
                title="How credits work"
                className="group flex items-center gap-2 transition-colors"
                style={{background:"none",border:"none",cursor:"pointer",padding:0}}
              >
                <span style={{ width: 16, height: 16, borderRadius: "50%", border: "1px solid rgba(0,229,255,0.5)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#00E5FF", fontSize: 9, flexShrink: 0, transition: "background 0.2s" }} className="group-hover:bg-[rgba(0,229,255,0.12)]">?</span>
                <span className="font-mono-tech text-[8px] text-zinc-600 group-hover:text-zinc-400 transition-colors">How credits work</span>
              </button>
              
              <button
                onClick={() => setShowFeaturesModal(true)}
                className="sweep-underline font-mono-tech text-[9px] text-[#FF5E3A] font-bold tracking-wider hover:text-white transition-colors"
                style={{background:"none",border:"none",cursor:"pointer",padding:0}}
              >
                +Many more...
              </button>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8">
            <PrimaryCTA testid={`plan-cta-${plan.id}`}>{plan.cta}</PrimaryCTA>
          </div>
        </div>
      </div>

      {showModal && <CreditsModal onClose={() => setShowModal(false)} />}
      {showFeaturesModal && <FeaturesModal onClose={() => setShowFeaturesModal(false)} />}
    </>
  );
};

const Subscription = () => {
  const [currency, setCurrency] = useState("INR");

  return (
  <section id="subscription" data-testid="section-subscription" className="relative py-32 md:py-44 border-t border-white/5">
    <div className="aurora-blob" style={{ width: 500, height: 500, background: "#FF5E3A", top: "-10%", left: "-5%", opacity: 0.1 }} />
    <div className="aurora-blob" style={{ width: 500, height: 500, background: "#00E5FF", bottom: "-10%", right: "-5%", opacity: 0.08, animationDelay: "-8s" }} />
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
      <SectionLabel n={13} label="INTELLIGENCE PLANS" accent="#FF5E3A" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        <Reveal className="lg:col-span-8">
          <h2 className="font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em]">
            Two ways to<span className="text-zinc-600">.</span><br />
            <span className="italic-serif text-zinc-500">know</span> <span className="shimmer-text">everything.</span>
          </h2>
        </Reveal>
        <Reveal delay={2} className="lg:col-span-4">
          <p className="font-body text-zinc-400 text-base leading-relaxed">
            Choose depth or dynamism. The report gives you a permanent intelligence artifact. The credits give you an always-on reasoning engine.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.5}>
        <div className="flex justify-center mt-14 mb-2">
          <div className="inline-flex bg-white/5 rounded-full p-1 border border-white/10">
            <button 
              onClick={() => setCurrency("INR")}
              className={`px-8 py-3 rounded-full font-mono-tech text-[10px] tracking-widest transition-all duration-300 ${currency === "INR" ? "bg-white/15 text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
            >
              INR (₹)
            </button>
            <button 
              onClick={() => setCurrency("USD")}
              className={`px-8 py-3 rounded-full font-mono-tech text-[10px] tracking-widest transition-all duration-300 ${currency === "USD" ? "bg-white/15 text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
        <Reveal delay={1}>
          <PlanCard plan={PLAN_PDF} isCredits={false} currency={currency} />
        </Reveal>
        <Reveal delay={2}>
          <PlanCard plan={PLAN_CREDITS} isCredits={true} currency={currency} />
        </Reveal>
      </div>
    </div>
  </section>
  );
};


/* ------------------------------------------------------------------ */
/* 14. FINAL CTA                                                       */
/* ------------------------------------------------------------------ */
const FinalCTA = () => {
  return (
    <section data-testid="section-cta" className="relative py-40 md:py-52 border-t border-white/5 overflow-hidden">
      <Starfield count={120} shootingStars={2} />
      <div className="aurora-blob" style={{ width: 800, height: 800, background: "#FF5E3A", top: "-20%", left: "-10%", opacity: 0.2 }} />
      <div className="aurora-blob" style={{ width: 800, height: 800, background: "#7B61FF", bottom: "-20%", right: "-10%", opacity: 0.2 }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
        <OrbitSystem size={900} />
      </div>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 relative z-10 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 font-mono-tech text-[10px] text-[#FF5E3A]">
            <Sparkles size={12} strokeWidth={1} />
            <span>INITIATE</span>
            <span>·</span>
            <span>14 / 14</span>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="font-serif-display text-6xl md:text-8xl lg:text-[10rem] leading-[0.88] tracking-[-0.04em] mt-10 max-w-5xl mx-auto">
            Initiate your <span className="italic-serif text-zinc-500">Life</span> <span className="shimmer-text">Intelligence</span> Report<span className="text-[#FF5E3A]">.</span>
          </h2>
        </Reveal>
        <Reveal delay={5}>
          <div className="flex items-center justify-center mt-14">
            <PrimaryCTA testid="final-cta">Initiate your Life Intelligence Report</PrimaryCTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* ASK AI VERIFY — "Don't take our word for it"                        */
/* ------------------------------------------------------------------ */
const AI_QUERY = "What is QuantumKarma.tech? Why does it add so much value?";
const AI_LINKS = [
  { name: "ChatGPT",    url: `https://chatgpt.com/?q=${encodeURIComponent(AI_QUERY)}`,                        color: "#10a37f", tag: "GPT" },
  { name: "Claude",     url: `https://claude.ai/new?q=${encodeURIComponent(AI_QUERY)}`,                       color: "#d78a63", tag: "CLA" },
  { name: "Gemini",     url: `https://www.google.com/search?q=${encodeURIComponent(AI_QUERY)}`,               color: "#4285f4", tag: "GEM" },
  { name: "Perplexity", url: `https://www.perplexity.ai/search?q=${encodeURIComponent(AI_QUERY)}`,            color: "#21b9b0", tag: "PRP" },
];

const AskAIVerify = () => (
  <section className="relative py-20 md:py-28 border-t border-white/5">
    <style>{`
      @keyframes qk-spin-border {
        0%   { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      .qk-spin { animation: qk-spin-border 5s linear infinite; }
    `}</style>
    <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
      <SectionLabel n={14} label="INDEPENDENT VERIFICATION" accent="#00E5FF" />
      <Reveal>
        <h2 className="font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.03em] max-w-5xl">
          Don't take our<br /><span className="italic-serif text-zinc-500">word</span> for it<span className="text-[#00E5FF]">.</span>
        </h2>
      </Reveal>
      <Reveal delay={2}>
        <p className="font-body text-zinc-400 mt-5 max-w-xl leading-relaxed">
          Let AI empower your decisions. Select an engine below to verify the truth for yourself.
        </p>
      </Reveal>

      <Reveal delay={3}>
        <div className="mt-14 max-w-3xl relative rounded-[2rem] p-[2px] overflow-hidden">
          {/* Spinning conic border */}
          <div className="absolute top-[50%] left-[50%] w-[150%] h-[150%] qk-spin pointer-events-none"
            style={{ background: "conic-gradient(from 0deg, transparent 0%, transparent 60%, #00E5FF, #7B61FF, #FF5E3A, transparent 100%)", transformOrigin: "center center" }} />

          {/* Inner card */}
          <div className="relative z-10 rounded-[1.9rem] px-6 py-10 md:px-10 md:py-12 bg-[#0B0B12]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AI_LINKS.map((ai, i) => (
                <Reveal key={ai.name} delay={i + 1}>
                  <motion.a href={ai.url} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}
                    className="group relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-transparent overflow-hidden transition-colors"
                    style={{ textDecoration: "none" }}
                  >
                    {/* hover tint */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl" style={{ background: ai.color }} />
                    {/* AI badge */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono text-[10px] font-bold shadow-lg group-hover:scale-110 transition-transform relative z-10"
                      style={{ background: ai.color, fontFamily: "'IBM Plex Mono',monospace" }}>
                      {ai.tag}
                    </div>
                    <div className="font-mono-tech text-[11px] text-zinc-400 group-hover:text-white transition-colors relative z-10">{ai.name}</div>
                    <div className="font-mono-tech text-[9px] opacity-0 group-hover:opacity-100 transition-opacity relative z-10" style={{ color: ai.color }}>Ask →</div>
                  </motion.a>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 text-center font-mono-tech text-[9px] text-zinc-600 tracking-wider">
              THESE ARE INDEPENDENT AI SYSTEMS — NOT AFFILIATED WITH QUANTUM KARMA
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* Legal content */
const LEGAL_CONTENT = {
  terms: {
    title: "Terms of Service",
    body: `Terms of Service — Quantum Karma\nLast updated: 15 February 2026\n\nWelcome. Read this properly. Not because we enjoy legal pages — but because clarity prevents future drama.\n\nBy using this website or purchasing a report from Quantum Karma, you agree to everything written below. If something here feels uncomfortable, don't use the service. No hard feelings. This service is operated from Bangalore, India.\n\n1. What We Actually Provide\nQuantum Karma provides interpretive life-pattern reports based on traditional astrological frameworks combined with analytical processing and human review. We do not provide: guaranteed predictions, miracles, fixes, rituals, remedies, supernatural intervention, or problem-solving for real-world emergencies. You receive interpretation, not control over reality.\n\n2. Eligibility\nYou must be at least 18 years old to purchase.\n\n3. Accuracy of Your Input\nYour report depends entirely on the data you submit. If you enter wrong date, time, or place of birth, you will receive a wrong report. This is not a defect. This is math. We do not refund reports generated from incorrect user input.\n\n4. Payments & Refunds\nAll payments are one-time purchases unless explicitly stated otherwise. Once work begins, effort is spent. Contact us within 7 days at help@soulsync.tech if you believe your report is clearly generic.\n\n5. Delivery Timelines\nStandard delivery: 48–72 hours. Delays may happen due to high order volume or technical interruptions.\n\n6. How You Should Use the Report\nUse it as reflection material. Not as financial instruction, medical direction, legal decision tool, or relationship ultimatum justification.\n\n7. Intellectual Property\nEvery report is licensed to you for personal use only. You may NOT resell, publish publicly, or train AI models on it.\n\n8. Limitation of Liability\nWe are not responsible for decisions you make after reading. The maximum liability we ever carry is the amount you paid us.\n\n9. Disputes\nContact us first at: help@soulsync.tech. Jurisdiction: Bangalore, India.\n\nASTROLOGY IS FOR REFERENCE PURPOSES ONLY. CONSULT MEDICAL/PROFESSIONAL EXPERTS FOR HEALTH-RELATED URGENCIES.`
  },
  privacy: {
    title: "Privacy Policy",
    body: `Privacy Policy — Quantum Karma\nLast updated: 15 Feb 2026\n\nWe don't like creepy apps. So we built this to avoid becoming one.\n\n1. What Information We Collect\n• Name (can be nickname)\n• Date, time, and place of birth\n• Email address\n• Your stated concern (career, relationship, etc.)\n• Standard website data (IP, device type) to prevent fraud\n• Payment data is processed by third parties — we do not store your card/UPI credentials.\n\n2. How We Use Your Data\nStrictly to generate your chart, structure your report, review it manually, and deliver it. We do not use birth details to advertise to you. We do not sell your data to brokers.\n\n3. About AI / LLM Usage\nWe use language models as tools for structuring reports. They do NOT replace human interpretation. Every report is reviewed by a human before delivery.\n\n4. Data Storage & Security\nYour data is stored securely using access-restricted systems with encryption in transit.\n\n5. We Do Not Sell Personal Data\nOur revenue comes from reports — not from your identity.\n\n6. Your Rights\nRequest a copy, correction, or deletion at help@soulsync.tech.\n\n7. Final Clarity\nWe built Quantum Karma to give perspective — not surveillance.`
  },
  refunds: {
    title: "Refund Policy",
    body: `Refund Policy — Quantum Karma\nLast updated: 15 February 2026\n\nWe'll be honest with you first: This is not a downloadable movie. Not a subscription you forgot to cancel. Every report we create is made specifically for one person — you. Once we begin work, time, analysis, and review are already invested. Refunds are generally not offered.\n\nWhy Refunds Are Not Encouraged\nThe moment we start preparing your personalized report, the work cannot be "un-done". Default position: No refunds after purchase.\n\nRare Exceptions\nWe may consider a refund only if:\n• The report is clearly unrelated to the details you provided\n• The report was not delivered at all\n• A verified technical failure prevented completion\n\nIn those cases, email us within 7 days at: help@soulsync.tech\n\nWhat Is NOT a Valid Refund Reason\n• You expected different answers\n• You disagree with interpretation\n• The content felt uncomfortable\n• You changed your mind after purchase\n\nOur Real Promise\nIf something feels off, write to us. We'll clarify, explain, and help you understand what the report meant.\n\nClarity first. Always.`
  },
};

const InlineLegalModal = ({ type, onClose }) => {
  const { title, body } = LEGAL_CONTENT[type] || { title: "", body: "" };
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
        style={{position:"fixed",inset:0,zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",background:"rgba(5,5,7,0.94)",backdropFilter:"blur(20px)",overflowY:"auto"}}>
        <motion.div initial={{y:20,scale:0.97,opacity:0}} animate={{y:0,scale:1,opacity:1}} exit={{y:20,opacity:0}}
          transition={{type:"spring",damping:30,stiffness:280}} onClick={e=>e.stopPropagation()}
          style={{width:"100%",maxWidth:680,height:"min(85vh,700px)",display:"flex",flexDirection:"column",flexShrink:0,background:"#0B0B12",border:"1px solid rgba(255,255,255,0.08)",overflow:"hidden"}}>
          <div style={{height:2,background:"linear-gradient(90deg,#FF5E3A,#7B61FF)",flexShrink:0}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.4rem",color:"#fff"}}>{title}</div>
            <button onClick={onClose} style={{width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)",cursor:"pointer"}}
              onMouseEnter={e=>{e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.5)"}}>
              <X size={12}/>
            </button>
          </div>
          <div data-lenis-prevent style={{flex:1,minHeight:0,overflowY:"auto",padding:"24px 24px 40px",WebkitOverflowScrolling:"touch"}}>
            <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"0.75rem",color:"rgba(255,255,255,0.4)",lineHeight:2,whiteSpace:"pre-wrap"}}>{body}</p>
            <div style={{marginTop:28,textAlign:"center"}}>
              <button onClick={onClose} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"9px",letterSpacing:"0.15em",textTransform:"uppercase",color:"#FFD700",background:"none",border:"none",cursor:"pointer"}}>
                [ I Understand & Accept ]
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InlineSupportModal = ({ onClose }) => {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
        style={{position:"fixed",inset:0,zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",background:"rgba(5,5,7,0.94)",backdropFilter:"blur(20px)"}}>
        <motion.div initial={{y:20,scale:0.97,opacity:0}} animate={{y:0,scale:1,opacity:1}} exit={{y:20,opacity:0}}
          transition={{type:"spring",damping:30,stiffness:280}} onClick={e=>e.stopPropagation()}
          style={{width:"100%",maxWidth:440,background:"#0a0a0a",border:"1px solid rgba(212,175,55,0.3)",boxShadow:"0 0 40px rgba(212,175,55,0.15)",overflow:"hidden",position:"relative"}}>
          <div style={{height:2,background:"linear-gradient(90deg,#e6c875,#d4af37,#e6c875)",flexShrink:0}}/>
          <div style={{padding:"32px 32px 28px"}}>
            <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:18,lineHeight:1}} onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>✕</button>
            <div style={{textAlign:"center",marginBottom:28}}>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:"1.5rem",color:"#d4af37",marginBottom:6}}>We've Got Your Back</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"10px",color:"rgba(255,255,255,0.35)",letterSpacing:"0.08em"}}>Karma doesn't wait, neither do we.</div>
            </div>
            <a href="mailto:help@soulsync.tech"
              style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",border:"1px solid rgba(212,175,55,0.25)",marginBottom:10,textDecoration:"none",transition:"all 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(212,175,55,0.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(212,175,55,0.15)",color:"#d4af37",fontSize:16}}>✉</div>
              <div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"11px",color:"#d4af37",letterSpacing:"0.08em",marginBottom:3}}>Priority Email Support</div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"10px",color:"rgba(255,255,255,0.3)"}}>help@soulsync.tech</div>
              </div>
            </a>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",border:"1px solid rgba(255,255,255,0.05)",opacity:0.5}}>
              <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.3)",fontSize:16}}>💬</div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"11px",color:"rgba(255,255,255,0.35)",letterSpacing:"0.08em"}}>WhatsApp & Live Chat</span>
                  <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"8px",background:"#d4af37",color:"#000",padding:"2px 6px",fontWeight:700}}>COMING SOON</span>
                </div>
              </div>
            </div>
            <div style={{marginTop:24,textAlign:"center",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:18}}>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"9px",color:"rgba(212,175,55,0.5)",fontStyle:"italic"}}>"Even the stars occasionally need a reboot."</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Footer = () => {
  const [legalType, setLegalType] = useState(null);   // 'terms' | 'privacy' | 'refunds'
  const [showSupport, setShowSupport] = useState(false);

  const linkCls = "sweep-underline font-mono-tech text-[10px] text-zinc-500 hover:text-white transition-colors duration-200 tracking-[0.1em] uppercase";
  const btnCls = "sweep-underline font-mono-tech text-[10px] text-zinc-500 hover:text-white transition-colors duration-200 tracking-[0.1em] uppercase bg-transparent border-none cursor-pointer p-0";

  return (
    <footer data-testid="site-footer" className="border-t border-white/10 py-14 relative">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Brand + links row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 28 28" aria-hidden="true">
              <circle cx="14" cy="14" r="13" fill="none" stroke="#00E5FF" strokeWidth="1" />
              <polygon points="14,3 25,22 3,22" fill="none" stroke="#7B61FF" strokeWidth="1" />
              <circle cx="14" cy="14" r="3" fill="#FF5E3A" />
            </svg>
            <span className="font-mono-tech text-[10px] text-zinc-600">Quantum Karma · Life Intelligence</span>
          </div>
          {/* 12 links */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
            <a href="/about"         className={linkCls}>About</a>
            <a href="/reviews"       className={linkCls}>Reviews</a>
            <a href="/sample-report" className={linkCls}>Sample Report</a>
            <a href="/roadmap"       className={linkCls}>Roadmap</a>
            <a href="/astrology"     className={linkCls}>Astrology</a>
            <a href="/our-process"   className={linkCls}>Our Process</a>
            <a href="/myths"         className={linkCls}>Myths</a>
            <a href="https://quantumkarma.substack.com/" target="_blank" rel="noopener noreferrer" className={linkCls}>Blog ↗</a>
            <button onClick={()=>setLegalType("refunds")} className={btnCls}>Refunds</button>
            <button onClick={()=>setLegalType("terms")}   className={btnCls}>Terms</button>
            <button onClick={()=>setLegalType("privacy")} className={btnCls}>Privacy</button>
            <a href="/astrologer/auth" className={btnCls} style={{ textDecoration: 'none' }}>Partner Portal</a>
            <button onClick={()=>setShowSupport(true)}    className="sweep-underline font-mono-tech text-[10px] tracking-[0.1em] uppercase bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
              style={{background:"linear-gradient(90deg,#00E5FF,#7B61FF)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
              Support
            </button>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="font-mono-tech text-[10px] text-zinc-600">© 2025 Quantum Karma · v.1</span>
          <button onClick={()=>setLegalType("refunds")}
            className="font-mono-tech text-[10px] text-zinc-700 hover:text-zinc-500 transition-colors bg-transparent border-none cursor-pointer p-0">
            No refunds on karma. Precision is guaranteed; your ego is not.
          </button>
        </div>
      </div>
      {legalType && <InlineLegalModal type={legalType} onClose={()=>setLegalType(null)} />}
      {showSupport && <InlineSupportModal onClose={()=>setShowSupport(false)} />}
    </footer>
  );
};

/* ------------------------------------------------------------------ */
/* Scroll progress indicator                                            */
/* ------------------------------------------------------------------ */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <motion.div
      style={{ width }}
      className="fixed top-16 left-0 h-[2px] z-50"
      data-testid="scroll-progress"
    >
      <div className="h-full w-full" style={{ background: "linear-gradient(90deg, #FF5E3A, #00E5FF, #7B61FF)" }} />
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Landing Assembly                                                    */
/* ------------------------------------------------------------------ */
export const Landing = () => (
  <div className="emr-landing-root relative bg-[#050507] text-white overflow-x-hidden">
    <CursorGlow />
    <ScrollProgress />
    <Navbar />
    <Hero />
    <Philosophy />
    <VedicStack />
    <PatternRecognition />
    <TechnicalVariables />
    <Shodasavarga />
    <Manifesto />
    <Grandmaster />
    <DashboardShowcase />
    <LifestylePillars />
    <FamilyOffice />
    <TestimonialsEMR />
    <FAQEMR />
    <AskAIVerify />
    <DataPrivacy />
    <Subscription />
    <TrustBar />
    <FinalCTA />
    <Footer />
  </div>
);

export default Landing;
