"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import LandingFooter from "@/components/LandingFooter";
import { useOnboarding } from "@/context/OnboardingContext";
import FloatingLogo from "@/components/ui/FloatingLogo";

/* ──────────────────────────────────────────────────────────────────
   FRACTAL UNIVERSE SVG · "As Above, So Below"
   Two nested mandalas rotating in opposite directions with a
   pulsing center — visually expresses macro/micro fractal symmetry.
   ────────────────────────────────────────────────────────────────── */
function FractalMandala() {
    return (
        <svg viewBox="0 0 320 320" className="w-full h-full">
            <defs>
                <linearGradient id="fmgold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0.4" />
                </linearGradient>
            </defs>
            <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "160px 160px" }}
            >
                {[0, 30, 60, 90, 120, 150].map((a, i) => (
                    <line key={i} x1="160" y1="20" x2="160" y2="300"
                        stroke="url(#fmgold)" strokeWidth="0.5"
                        transform={`rotate(${a} 160 160)`} />
                ))}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const cx = 160 + Math.cos(rad) * 50;
                    const cy = 160 + Math.sin(rad) * 50;
                    return <circle key={i} cx={cx} cy={cy} r="55" fill="none" stroke="url(#fmgold)" strokeWidth="0.7" />;
                })}
            </motion.g>
            <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "160px 160px" }}
            >
                <circle cx="160" cy="160" r="120" fill="none" stroke="url(#fmgold)" strokeWidth="0.5" strokeDasharray="3 6" />
                <circle cx="160" cy="160" r="90" fill="none" stroke="url(#fmgold)" strokeWidth="0.5" />
            </motion.g>
            <motion.circle
                cx="160" cy="160" r="20"
                fill="url(#fmgold)"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "160px 160px" }}
            />
        </svg>
    );
}

/* ──────────────────────────────────────────────────────────────────
   KARMA RECEIPT — Visual representation of the chart-as-receipt.
   Stylized like a vintage cash receipt with cosmic line-items.
   ────────────────────────────────────────────────────────────────── */
function KarmaReceipt() {
    return (
        <div className="relative max-w-sm mx-auto w-full">
            {/* Stack effect — peek shadow behind the receipt */}
            <div className="absolute inset-x-3 -bottom-2 h-3 rounded-b-2xl bg-[#FFD700]/10 blur-sm" />
            <div className="absolute inset-x-6 -bottom-4 h-3 rounded-b-2xl bg-[#FFD700]/5 blur-sm" />

            <motion.div
                whileHover={{ y: -4 }}
                className="relative bg-gradient-to-b from-[#fdfaef] to-[#f5e9c5] text-black p-6 md:p-8 rounded-2xl shadow-[0_30px_60px_-20px_rgba(255,215,0,0.3)] font-mono"
                style={{ filter: "drop-shadow(0 0 60px rgba(255,215,0,0.15))" }}
            >
                <div className="text-center border-b-2 border-dashed border-black/30 pb-4 mb-4">
                    <div className="text-[10px] uppercase tracking-[0.3em] font-black opacity-60">— Receipt of Existence —</div>
                    <div className="text-2xl font-serif font-black mt-2">YOUR KARMA</div>
                    <div className="text-[10px] opacity-50 mt-1">issued at: birth · ledger no. ∞</div>
                </div>

                <div className="space-y-2 text-sm">
                    {[
                        { k: "Past Life Actions", v: "carried fwd" },
                        { k: "Present Birth", v: "scheduled" },
                        { k: "Body Type", v: "configured" },
                        { k: "Family Conditions", v: "delivered" },
                        { k: "Mental Patterns", v: "imprinted" },
                        { k: "Soul Mission", v: "encoded" },
                    ].map((row, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="flex justify-between"
                        >
                            <span className="opacity-70">{row.k}</span>
                            <span className="font-bold">{row.v}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="border-t-2 border-dashed border-black/30 mt-4 pt-4 flex justify-between text-sm font-bold">
                    <span>TOTAL</span>
                    <span>= YOU</span>
                </div>

                <div className="mt-4 text-center text-[10px] uppercase tracking-widest opacity-60">
                    your free will: how you respond
                </div>

                {/* Receipt teeth */}
                <div className="absolute -bottom-1.5 left-0 right-0 flex">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="flex-1 h-3 bg-gradient-to-b from-[#f5e9c5] to-transparent"
                            style={{
                                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

/* ──────────────────────────────────────────────────────────────────
   ANIMATED COUNTER (used in stat strip)
   Cubic-eased count-up driven by setInterval; respects reduced motion
   via the surrounding CSS.
   ────────────────────────────────────────────────────────────────── */
function StatCounter({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
    const [v, setV] = useState(0);
    useEffect(() => {
        const start = Date.now();
        const duration = 1800;
        const t = setInterval(() => {
            const e = (Date.now() - start) / duration;
            if (e >= 1) { setV(value); clearInterval(t); }
            else setV(Math.floor(value * (1 - Math.pow(1 - e, 3))));
        }, 30);
        return () => clearInterval(t);
    }, [value]);
    return (
        <div className="text-center">
            <div className="text-3xl md:text-5xl font-serif font-black text-[#FFD700] tracking-tight tabular-nums">{v}{suffix}</div>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-500 font-mono mt-2">{label}</div>
        </div>
    );
}

export default function Astrology() {
    const { openModal } = useOnboarding();

    /* ─── Cursor parallax for hero aurora ─── */
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            mouseX.set((e.clientX / window.innerWidth - 0.5) * 30);
            mouseY.set((e.clientY / window.innerHeight - 0.5) * 30);
        };
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, [mouseX, mouseY]);

    /* ─── Hero parallax on scroll ─── */
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

    /* ─── Planet active state (3D feel) ─── */
    const [hoveredPlanet, setHoveredPlanet] = useState<number | null>(null);

    /* ─── House interaction ─── */
    const [activeHouse, setActiveHouse] = useState<number>(0);

    /* ─── Signs filter (element selection) ─── */
    const [activeElement, setActiveElement] = useState<string>("FIRE");

    /* ─── Planets data — preserved verbatim, color added for theme ─── */
    const PLANETS = [
        { name: "SUN",     role: "THE CEO",       desc: "Your Soul. Your Ego. Your Father. Where you shine and want validation.",                  glyph: "☉", hue: "from-amber-400 to-orange-600" },
        { name: "MOON",    role: "THE MIND",      desc: "Your Emotions. Your Mother. Your Peace. How you perceive reality.",                       glyph: "☽", hue: "from-slate-300 to-slate-500" },
        { name: "MARS",    role: "THE GENERAL",   desc: "Your Drive. Your Aggression. Your Logic. How you fight for what you want.",               glyph: "♂", hue: "from-red-500 to-rose-700" },
        { name: "MERCURY", role: "THE MESSENGER", desc: "Your Intellect. Your Communication. Your Data Processing.",                                glyph: "☿", hue: "from-emerald-400 to-teal-600" },
        { name: "JUPITER", role: "THE GURU",      desc: "Your Wisdom. Your Luck. Your Expansion. Where you find easy growth.",                     glyph: "♃", hue: "from-yellow-400 to-amber-600" },
        { name: "VENUS",   role: "THE ARTIST",    desc: "Your Desire. Your Love. Your Comfort. What you value and enjoy.",                          glyph: "♀", hue: "from-pink-400 to-rose-500" },
        { name: "SATURN",  role: "THE JUDGE",     desc: "Your Discipline. Your Fear. Your Delay. The harsh teacher that builds mastery.",          glyph: "♄", hue: "from-zinc-400 to-zinc-700" },
        { name: "RAHU",    role: "THE REBEL",     desc: "Your Obsession. Your Ambition. The smoke that blinds you to get what you want.",          glyph: "☊", hue: "from-violet-500 to-purple-700" },
        { name: "KETU",    role: "THE MONK",      desc: "Your Detachment. Your Past Lives. Spiritual liberation through loss.",                     glyph: "☋", hue: "from-indigo-500 to-blue-700" },
    ];

    /* ─── Houses data (preserved) ─── */
    const HOUSES = [
        { n: "1H",  t: "Self, Body, Personality" },
        { n: "2H",  t: "Wealth, Family, Speech" },
        { n: "3H",  t: "Courage, Siblings, Effort" },
        { n: "4H",  t: "Mother, Home, Happiness" },
        { n: "5H",  t: "Love, Children, Speculation" },
        { n: "6H",  t: "Debt, Disease, Enemies" },
        { n: "7H",  t: "Marriage, Partnership, Trade" },
        { n: "8H",  t: "Occult, Sudden Gains, Death" },
        { n: "9H",  t: "Dharma, Luck, Guru" },
        { n: "10H", t: "Career, Fame, Father" },
        { n: "11H", t: "Gains, Friends, Network" },
        { n: "12H", t: "Loss, Sleep, Spirituality" },
    ];

    /* ─── Elements / Signs (preserved + enriched) ─── */
    const ELEMENTS = {
        FIRE:  { signs: "Aries · Leo · Sagittarius",   trait: "Action, Ego, Vision",          color: "from-orange-500 to-rose-600", text: "text-orange-400" },
        EARTH: { signs: "Taurus · Virgo · Capricorn",  trait: "Stability, Money, Structure",  color: "from-emerald-500 to-green-700", text: "text-emerald-400" },
        AIR:   { signs: "Gemini · Libra · Aquarius",   trait: "Ideas, Talk, Network",         color: "from-cyan-400 to-sky-600",      text: "text-cyan-400" },
        WATER: { signs: "Cancer · Scorpio · Pisces",   trait: "Emotion, Intuition, Depth",    color: "from-blue-500 to-indigo-700",   text: "text-blue-400" },
    } as const;

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#FFD700] selection:text-[#050505] font-sans overflow-x-hidden">
            <FloatingLogo position="left" />

            {/* Cosmic background grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.04]" style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "40px 40px",
            }} />

            {/* ────────────────────────── 01 · HERO ────────────────────────── */}
            <section ref={heroRef} className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-4 md:px-6 overflow-hidden pt-24 pb-12">
                {/* Cursor-tracking aurora */}
                <motion.div
                    className="absolute -top-40 left-1/2 -translate-x-1/2 w-[140%] h-[120vh] pointer-events-none"
                    style={{ x: springX, y: springY }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.12),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,_rgba(168,85,247,0.10),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,_rgba(236,72,153,0.06),transparent_50%)]" />
                </motion.div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="z-10 max-w-5xl mx-auto text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 mb-8 backdrop-blur"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD700]" />
                        </span>
                        <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#FFD700]">Vedic Truth · No Filter</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight leading-[1.05] text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600 mx-auto max-w-4xl"
                    >
                        THE PLANETS DO NOT CONTROL YOU.<br />
                        <span className="text-[#FFD700] [-webkit-text-fill-color:#FFD700]">THEY REFLECT YOU.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="font-mono text-base md:text-lg text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
                    >
                        There is no bearded man in the sky moving Mars into your 7th house to wreck your marriage.<br />
                        The planets are mirrors.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-3 justify-center"
                    >
                        <button
                            onClick={openModal}
                            className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#FFD700] text-black font-bold uppercase tracking-widest text-xs hover:scale-[1.03] transition-all shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.5)]"
                        >
                            Decode my chart
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <a
                            href="#mechanism"
                            className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                        >
                            See the math
                        </a>
                    </motion.div>
                </motion.div>

                {/* Scroll cue */}
                <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 font-mono"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
                    <span className="text-xs">↓</span>
                </motion.div>
            </section>

            {/* ────────── NEW · POWERFUL BRAND POSITIONING STRIP ────────── */}
            {/* Anchors the page in mathematical authority before the deep
                dive. Three big numbers + tagline that re-frames Vedic
                astrology as engineering, not entertainment. */}
            <section className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-[#050505] via-[#0a0500] to-[#050505] border-y border-[#FFD700]/10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-block text-[10px] md:text-xs font-mono font-black uppercase tracking-[0.3em] text-[#FFD700]">
                            ★ Vedic Astrology · By the Numbers ★
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto">
                        <StatCounter value={5000} label="Years of Lineage" suffix="+" />
                        <StatCounter value={127} label="Vedic Variables" />
                        <StatCounter value={9} label="Cosmic Forces" />
                    </div>
                    <div className="text-center mt-8 max-w-2xl mx-auto">
                        <p className="font-mono text-sm md:text-base text-gray-500 leading-relaxed">
                            Older than Western medicine. More precise than modern psychology. <span className="text-white font-bold">Honest enough to make you uncomfortable.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* ────────────── 02 · CARL JUNG (preserved + restyled) ────────────── */}
            <section className="py-20 md:py-28 px-4 md:px-6 bg-[#0a0500] border-t border-[#FFD700]/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#FFD700]/5 via-transparent to-transparent opacity-60" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block border border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700] px-3 py-1 rounded text-[10px] md:text-xs font-mono uppercase tracking-widest mb-8"
                    >
                        Declassified // The Secret Tool of Psychoanalysis
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-3xl md:text-6xl font-bold mb-12 text-white leading-tight tracking-tight"
                    >
                        CARL JUNG&apos;S<br />
                        <span className="text-[#FFD700]">OPEN SECRET.</span>
                    </motion.h2>

                    <div className="grid lg:grid-cols-12 gap-10 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-7"
                        >
                            <p className="font-mono text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
                                Dr. Carl Jung, the founding father of modern analytical psychology, did not view astrology as a myth. He viewed it as the ultimate diagnostic tool for the human psyche.
                            </p>
                            <p className="font-mono text-gray-400 mb-8 text-sm md:text-base leading-relaxed">
                                When Jung faced a psychological diagnosis he could not solve, he cast the patient&apos;s astrological chart. He recognized that the positions of the planets mapped directly to the unconscious archetypes driving human behavior.
                            </p>
                            <div className="border-l-2 border-[#FFD700] pl-6 py-2 relative">
                                <div className="absolute -left-2 top-0 text-4xl text-[#FFD700]/50 font-serif">&ldquo;</div>
                                <p className="font-serif text-[#FFD700] text-lg md:text-xl italic leading-snug">
                                    Astrology is assured of recognition from psychology, without further restrictions, because astrology represents the summation of all the psychological knowledge of antiquity.
                                </p>
                                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-4">
                                    — Carl G. Jung
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 relative"
                        >
                            {/* Stack-card peek shadows behind */}
                            <div className="absolute inset-x-3 -bottom-2 h-3 rounded-2xl bg-white/5" />
                            <div className="absolute inset-x-6 -bottom-4 h-3 rounded-2xl bg-white/[0.02]" />

                            <div className="relative bg-black/60 border border-[#FFD700]/20 p-6 md:p-8 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.05)] backdrop-blur">
                                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-[#FFD700] mb-5 border-b border-white/10 pb-4">The Psychological Reality</h3>
                                <ul className="space-y-4 font-light text-gray-400 text-sm">
                                    <li className="flex gap-3"><span className="text-[#FFD700] shrink-0 mt-1">✓</span> Used natively to bypass the conscious ego and read the subconscious patterns.</li>
                                    <li className="flex gap-3"><span className="text-[#FFD700] shrink-0 mt-1">✓</span> Created the concept of <strong className="text-white">Synchronicity</strong> explicitly to explain astrological correlations.</li>
                                    <li className="flex gap-3"><span className="text-[#FFD700] shrink-0 mt-1">✓</span> Understood that astrology maps the exact mathematical geometry of human instinct.</li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ────── NEW · PROCESS FLOW: Birth → Karma → Math → Choice ────── */}
            {/* Visual process flow with animated light pulse traveling across
                the connector line. Re-frames the entire page as a 4-stage
                journey from the moment of birth to free-willed action. */}
            <section className="py-20 md:py-28 px-4 md:px-6 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-[#FFD700]/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-block text-[10px] md:text-xs font-mono font-black uppercase tracking-[0.3em] text-[#FFD700] mb-4 px-3 py-1 border border-[#FFD700]/30 rounded">
                            How a soul becomes a chart
                        </div>
                        <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
                            From the cosmos<br />
                            <span className="text-[#FFD700]">to your decisions.</span>
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Animated connecting line — light pulse loops */}
                        <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent">
                            <motion.div
                                className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"
                                animate={{ x: ["-10%", "110%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                            {[
                                { icon: "✦", t: "Birth Moment",  d: "The exact second your soul entered the body. A unique geometric snapshot." },
                                { icon: "☉", t: "Cosmic Imprint", d: "Planetary positions imprint on your nervous system at the cellular level." },
                                { icon: "Σ", t: "Mathematical Map", d: "The chart calculates your probabilistic patterns — strengths, scars, timing." },
                                { icon: "→", t: "Conscious Choice", d: "Free will activates when you see the patterns. The unconscious becomes conscious." },
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative group"
                                >
                                    <div className="relative p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-[#FFD700]/40 transition-all h-full">
                                        <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-[#FFD700] text-black text-xs font-black flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.6)]">
                                            {String(i + 1).padStart(2, "0")}
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-orange-700/20 border border-[#FFD700]/30 flex items-center justify-center mb-4 mt-3 text-[#FFD700] text-2xl font-serif group-hover:scale-110 transition-transform">
                                            {step.icon}
                                        </div>
                                        <h4 className="font-serif text-lg md:text-xl font-bold text-white mb-2 tracking-tight">{step.t}</h4>
                                        <p className="font-mono text-xs md:text-sm text-gray-500 leading-relaxed">{step.d}</p>
                                    </div>
                                    {i < 3 && (
                                        <div className="lg:hidden flex justify-center mt-2 mb-2">
                                            <span className="text-[#FFD700]/40 rotate-90">→</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ────────────── 03 · MECHANISM (preserved + restyled) ────────────── */}
            <section id="mechanism" className="py-20 md:py-28 px-4 md:px-6 bg-black border-t border-[#222] relative">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-3xl md:text-6xl font-bold text-center mb-16 md:mb-24 text-white tracking-tight"
                    >
                        HOW IT<br className="md:hidden" />
                        <span className="text-[#FFD700]"> ACTUALLY </span>
                        WORKS
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                n: "01.",
                                t: "GRAVITY & FIELDS",
                                d: <>The moon moves billions of tons of ocean water daily. You are 70% water. The sun&apos;s solar flares disrupt global communication grids. You are a bio-electrical nervous system. To think you are immune to these massive electromagnetic fields is biological arrogance.</>,
                            },
                            {
                                n: "02.",
                                t: "AS ABOVE, SO BELOW",
                                d: <>The universe is fractal. The pattern of the macro (solar system) repeats in the micro (your atomic structure/psychology). We don&apos;t look at Mars to blame it for your anger. We look at Mars to see <em>where</em> your anger is currently magnified.</>,
                            },
                            {
                                n: "03.",
                                t: "NO FATE. ONLY PROBABILITY.",
                                d: <>Astrology is not a script; it is a weather report. If the forecast says &ldquo;Rain,&rdquo; you aren&apos;t destined to get wet. You can use an umbrella. Your free will determines how you play the hand you are dealt.</>,
                            },
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6 }}
                                className="group relative border border-[#222] p-6 md:p-8 hover:border-[#FFD700] transition-colors duration-500 bg-[#0a0a0a] overflow-hidden"
                            >
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FFD700]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                                <div className="text-[#FFD700] font-mono text-3xl md:text-4xl mb-6">{card.n}</div>
                                <h3 className="font-serif text-xl md:text-2xl text-white mb-4">{card.t}</h3>
                                <p className="font-mono text-gray-400 text-sm leading-relaxed">{card.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ────── NEW · FRACTAL UNIVERSE ILLUSTRATION ────── */}
            {/* Visualizes the "As above, so below" axiom with a counter-rotating
                mandala. Pairs with text emphasizing macro-micro symmetry. */}
            <section className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-black to-[#0a0500] border-t border-[#222] relative overflow-hidden">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 lg:order-1 max-w-md mx-auto w-full aspect-square"
                    >
                        <FractalMandala />
                    </motion.div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-block text-[10px] md:text-xs font-mono font-black uppercase tracking-[0.3em] text-[#FFD700] mb-4 px-3 py-1 border border-[#FFD700]/30 rounded">
                            The Fractal Truth
                        </div>
                        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
                            The cosmos is not<br />
                            <span className="text-[#FFD700]">outside of you.</span>
                        </h2>
                        <p className="font-mono text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                            The same geometric ratios that govern galaxies govern the spiral of your DNA. The same gravitational rhythms that pull tides pull the fluid in your inner ear. You are not <em>looking up</em> at the sky.
                        </p>
                        <p className="font-mono text-white font-bold text-base md:text-lg leading-relaxed">
                            You ARE the sky, looking down at itself through human eyes.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {[
                                { v: "Macro", l: "Galaxies · planets" },
                                { v: "Micro", l: "Cells · atoms · psyche" },
                            ].map((b, i) => (
                                <div key={i} className="p-4 border border-white/10 rounded-xl bg-black/40 hover:border-[#FFD700]/30 transition-colors">
                                    <div className="font-serif text-2xl font-bold text-[#FFD700]">{b.v}</div>
                                    <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-1">{b.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ────────────── 04 · PLANETS — Board of Directors ────────────── */}
            {/* Restyled: 9 stacked cards with hover lift, glyph reveal, color
                gradient halos, and stack-card-peek shadows behind each. */}
            <section className="py-20 md:py-28 px-4 md:px-6 bg-[#080808] border-t border-[#222]">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-3xl md:text-6xl text-center mb-6 text-white leading-tight tracking-tight"
                    >
                        MEET THE<br />
                        <span className="text-[#FFD700]">BOARD OF DIRECTORS.</span>
                    </motion.h2>
                    <p className="font-mono text-center text-gray-500 mb-16 md:mb-20 max-w-2xl mx-auto text-sm md:text-base px-4">
                        These are not gods. They are psychological archetypes that live inside your head.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                        {PLANETS.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -8 }}
                                onMouseEnter={() => setHoveredPlanet(i)}
                                onMouseLeave={() => setHoveredPlanet(null)}
                                className="group relative bg-[#121212] p-7 md:p-8 border border-[#333] hover:border-[#FFD700] transition-all duration-500 overflow-hidden"
                            >
                                {/* Stack effect — peek cards behind */}
                                <div className="absolute inset-x-3 -bottom-2 h-2 bg-white/5 group-hover:bottom-0 group-hover:opacity-0 transition-all duration-500" />
                                <div className="absolute inset-x-6 -bottom-4 h-2 bg-white/[0.02] group-hover:bottom-0 group-hover:opacity-0 transition-all duration-500 delay-75" />
                                {/* Hover gradient halo */}
                                <div className={`absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br ${p.hue} blur-3xl opacity-0 group-hover:opacity-30 transition-opacity rounded-full pointer-events-none`} />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-end mb-4 border-b border-[#333] pb-4">
                                        <div className="flex items-center gap-3">
                                            <motion.span
                                                animate={hoveredPlanet === i ? { rotate: [0, 360], scale: [1, 1.2, 1] } : {}}
                                                transition={{ duration: 1 }}
                                                className={`text-3xl md:text-4xl bg-gradient-to-br ${p.hue} bg-clip-text text-transparent font-serif`}
                                                style={{ WebkitTextFillColor: "transparent" }}
                                            >
                                                {p.glyph}
                                            </motion.span>
                                            <h3 className="font-serif text-2xl md:text-3xl text-white">{p.name}</h3>
                                        </div>
                                        <span className="font-mono text-[10px] md:text-xs text-[#FFD700] uppercase tracking-widest text-right">{p.role}</span>
                                    </div>
                                    <p className="font-mono text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ────────── 05 · HOUSES + SIGNS (preserved + interactive) ────────── */}
            <section className="py-20 md:py-28 px-4 md:px-6 bg-black border-t border-[#222]">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20">

                    {/* HOUSES — interactive list with focus card */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-serif text-2xl md:text-4xl text-white mb-6 border-l-4 border-[#FFD700] pl-5"
                        >
                            THE STAGE<br />
                            <span className="text-[#FFD700] text-xl md:text-2xl block mt-1">(12 HOUSES)</span>
                        </motion.h2>
                        <p className="font-mono text-gray-400 mb-8 leading-relaxed text-sm md:text-base">
                            If Planets are the actors, Houses are the <strong className="text-white">scenes</strong> where they perform. Mars in the 1st House is an aggressive personality. Mars in the 7th House is an aggressive partner.
                        </p>

                        {/* Focus card — animates between houses */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeHouse}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="relative mb-6 p-6 rounded-2xl bg-gradient-to-br from-[#FFD700]/10 to-orange-700/5 border border-[#FFD700]/30 overflow-hidden"
                            >
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FFD700]/20 blur-3xl rounded-full" />
                                <div className="relative z-10">
                                    <div className="font-serif text-5xl md:text-6xl font-bold text-[#FFD700] tracking-tighter">
                                        {HOUSES[activeHouse].n}
                                    </div>
                                    <div className="font-mono text-sm md:text-base text-white mt-2">
                                        {HOUSES[activeHouse].t}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* House list */}
                        <ul className="grid grid-cols-2 gap-2 font-mono text-xs md:text-sm">
                            {HOUSES.map((h, i) => (
                                <li key={i}>
                                    <button
                                        onMouseEnter={() => setActiveHouse(i)}
                                        onClick={() => setActiveHouse(i)}
                                        className={`w-full text-left flex gap-3 px-3 py-2 rounded transition-all ${
                                            activeHouse === i
                                                ? "bg-[#FFD700]/10 text-white"
                                                : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                                        }`}
                                    >
                                        <span className={`font-bold w-8 ${activeHouse === i ? "text-[#FFD700]" : "text-gray-600"}`}>{h.n}</span>
                                        <span className="truncate">{h.t}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ZODIAC — element selector */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-serif text-2xl md:text-4xl text-white mb-6 border-l-4 border-red-500 pl-5"
                        >
                            THE COSTUME<br />
                            <span className="text-red-400 text-xl md:text-2xl block mt-1">(12 SIGNS)</span>
                        </motion.h2>
                        <p className="font-mono text-gray-400 mb-8 leading-relaxed text-sm md:text-base">
                            The Zodiac Signs are simply the <strong className="text-white">filters</strong> or costumes the planets wear. Mars (The Soldier) in Aries (Fire) is a Special Forces Commando. Mars in Cancer (Water) is a passive-aggressive emotional protector.
                        </p>

                        {/* Element tabs */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {(Object.keys(ELEMENTS) as Array<keyof typeof ELEMENTS>).map((el) => (
                                <button
                                    key={el}
                                    onClick={() => setActiveElement(el)}
                                    onMouseEnter={() => setActiveElement(el)}
                                    className={`px-2 py-3 rounded font-mono text-[10px] md:text-xs uppercase tracking-widest font-bold transition-all ${
                                        activeElement === el
                                            ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105"
                                            : "bg-[#1a1a1a] text-gray-500 hover:bg-[#222] hover:text-white"
                                    }`}
                                >
                                    {el}
                                </button>
                            ))}
                        </div>

                        {/* Element detail */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeElement}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="relative p-6 md:p-8 rounded-2xl border border-white/10 overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${ELEMENTS[activeElement as keyof typeof ELEMENTS].color} opacity-10`} />
                                <div className="absolute -top-12 -right-12 w-40 h-40 blur-3xl rounded-full opacity-30 bg-gradient-to-br pointer-events-none">
                                    <div className={`w-full h-full bg-gradient-to-br ${ELEMENTS[activeElement as keyof typeof ELEMENTS].color}`} />
                                </div>
                                <div className="relative z-10">
                                    <div className={`font-mono text-[10px] uppercase tracking-[0.3em] mb-2 ${ELEMENTS[activeElement as keyof typeof ELEMENTS].text}`}>
                                        {activeElement} SIGNS
                                    </div>
                                    <div className="font-serif text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                                        {ELEMENTS[activeElement as keyof typeof ELEMENTS].signs}
                                    </div>
                                    <div className="font-mono text-sm text-gray-400">
                                        {ELEMENTS[activeElement as keyof typeof ELEMENTS].trait}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </section>

            {/* ────────── 06 · BASTARDIZATION (preserved + restyled) ────────── */}
            <section className="py-20 md:py-28 px-4 md:px-6 bg-[#0a000f] border-t border-red-900/30 relative overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-3xl md:text-6xl font-bold text-center mb-12 md:mb-16 text-white tracking-tight leading-tight"
                    >
                        THE COMMERCIALIZATION<br />
                        OF A <span className="text-[#FFD700]">SACRED SCIENCE.</span>
                    </motion.h2>

                    <div className="grid md:grid-cols-2 gap-6 md:gap-10 font-mono text-sm leading-relaxed text-gray-400 mb-16 md:mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -4 }}
                            className="bg-black/40 border border-red-900/30 p-7 md:p-8 rounded-2xl relative overflow-hidden"
                        >
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 blur-3xl rounded-full" />
                            <div className="relative z-10">
                                <h3 className="text-red-400 font-bold uppercase tracking-widest mb-4 text-xs">The Scam (Pop Astrology)</h3>
                                <p className="mb-4">
                                    Over the last century, astrology was stripped of its mathematical rigor and sold to the masses as newspaper horoscopes and basic &ldquo;Sun Sign&rdquo; personality quizzes.
                                </p>
                                <p>
                                    It was weaponized to sell hope, validate toxic traits, and provide vague, generalized comfort. This commercialization destroyed the reputation of what was once the most sophisticated celestial science on Earth.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -4 }}
                            className="bg-[#12011A] border border-[#FFD700]/30 p-7 md:p-8 rounded-2xl relative shadow-[0_0_30px_rgba(255,215,0,0.05)] overflow-hidden"
                        >
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FFD700]/10 blur-3xl rounded-full" />
                            <div className="relative z-10">
                                <h3 className="text-[#FFD700] font-bold uppercase tracking-widest mb-4 text-xs">The Sacred Reality</h3>
                                <p className="mb-4 text-gray-300">
                                    True Vedic Astrology (Jyotish) is pure mathematics. It calculates the exact geometric angles of planetary bodies at your moment of birth down to the degree, minute, and second.
                                </p>
                                <p className="text-gray-300">
                                    It is a brutal, uncompromising diagnosis of the cosmic radiation imprinted on your nervous system. It does not exist to make you feel good; it exists to tell you the truth about your structural advantages and fatal flaws.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* KARMA LAW — preserved, paired with KarmaReceipt visual */}
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="lg:col-span-5 order-2 lg:order-1"
                        >
                            <KarmaReceipt />
                        </motion.div>

                        <div className="lg:col-span-7 order-1 lg:order-2">
                            <div className="bg-black border border-white/10 p-8 md:p-12 rounded-3xl relative overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                                <h2 className="font-serif text-2xl md:text-4xl font-bold mb-6 text-white tracking-tight leading-tight">
                                    THE ABSOLUTE LAW<br />
                                    <span className="text-red-400">OF KARMA.</span>
                                </h2>

                                <p className="font-mono text-sm md:text-lg text-red-400 font-bold mb-6 uppercase tracking-widest leading-tight">
                                    There is no god sitting on a cloud controlling your life.
                                </p>

                                <div className="space-y-5 text-gray-400 text-sm md:text-base leading-relaxed font-light">
                                    <p>
                                        As per the ancient Indian Vedic Scriptures, your birth chart is not a punishment or a reward distributed by a deity. <strong className="text-white">It is a receipt.</strong>
                                    </p>
                                    <p>
                                        It is the precise mathematical accumulation of your own past actions (Karma). The planets merely act as the cosmic timekeepers, executing the delivery of the situations you have already earned.
                                    </p>
                                    <p className="text-white font-bold text-base md:text-lg mt-6 border-l-4 border-[#FFD700] inline-block pl-4 leading-snug">
                                        THE ONLY FREE WILL YOU HAVE IS YOUR REACTION.
                                    </p>
                                    <p>
                                        You cannot change the storm, but you control how you sail the ship. The situations prescribed in your chart will happen. However, <strong className="text-white">how you react to these situations is what paves your future and builds your new Karma.</strong> You retain absolute control over your conscious response.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ────────── NEW · ANATOMY OF YOUR CHART ────────── */}
            {/* Stack-card grid breaking down the 5 forces every chart computes.
                Adds depth without changing existing copy. */}
            <section className="py-20 md:py-28 px-4 md:px-6 bg-[#050505] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <div className="inline-block text-[10px] md:text-xs font-mono font-black uppercase tracking-[0.3em] text-[#FFD700] mb-4 px-3 py-1 border border-[#FFD700]/30 rounded">
                            What we actually compute
                        </div>
                        <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
                            The five forces<br />
                            <span className="text-[#FFD700]">written into your chart.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { n: "01", t: "Planets",   d: "9 archetypal forces",          icon: "☉" },
                            { n: "02", t: "Houses",    d: "12 stages of life",             icon: "▦" },
                            { n: "03", t: "Signs",     d: "12 elemental costumes",         icon: "♈" },
                            { n: "04", t: "Aspects",   d: "Geometric relationships",       icon: "△" },
                            { n: "05", t: "Dashas",    d: "Time cycles · 120 yr loop",     icon: "↻" },
                        ].map((c, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -6 }}
                                className="group relative p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-[#FFD700]/40 transition-all overflow-hidden"
                            >
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FFD700]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />
                                <div className="font-mono text-[10px] uppercase tracking-widest text-[#FFD700] mb-2">VAR · {c.n}</div>
                                <div className="text-3xl md:text-4xl font-serif text-[#FFD700] mb-3">{c.icon}</div>
                                <div className="font-serif text-lg font-bold text-white mb-1">{c.t}</div>
                                <div className="font-mono text-xs text-gray-500">{c.d}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ────────── 07 · CAPTAIN — Final empowerment (preserved) ────────── */}
            <section className="py-24 md:py-32 px-4 md:px-6 bg-[#050505] border-t border-[#222] relative overflow-hidden">
                {/* Floating star particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
                        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
                    />
                ))}

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block border border-[#FFD700] text-[#FFD700] px-4 py-1 rounded-full text-[10px] md:text-xs font-mono uppercase tracking-widest mb-8"
                    >
                        The SoulSync Philosophy
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-4xl md:text-7xl font-bold mb-8 text-white tracking-tight leading-[0.95]"
                    >
                        YOU ARE<br />
                        <span className="text-[#FFD700]">THE CAPTAIN.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-mono text-gray-400 mb-10 text-base md:text-lg leading-relaxed"
                    >
                        Planets do not sit in a house thinking, &ldquo;Yes, I should destroy their marriage today.&rdquo;<br />
                        Planets function on <strong className="text-white">autopilot</strong>.<br />
                        If you are unconscious, you are a slave to their gravity.<br />
                        If you are conscious (SoulSync), you use their energy to sail your ship.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -4 }}
                        className="relative bg-[#111] border border-[#333] p-8 md:p-12 mb-12 md:mb-16 rounded-2xl overflow-hidden"
                    >
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FFD700]/10 blur-3xl rounded-full" />
                        <p className="font-serif text-xl md:text-2xl text-gray-300 italic mb-6 leading-snug relative z-10">
                            &ldquo;Fate is what happens when you don&apos;t take responsibility for your own psychology.&rdquo;
                        </p>
                        <p className="font-mono text-[10px] md:text-xs text-gray-500 uppercase tracking-widest relative z-10">— Carl Jung (Paraphrased)</p>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={openModal}
                        className="px-10 md:px-16 py-5 md:py-6 bg-[#FFD700] text-black font-bold text-base md:text-xl uppercase tracking-widest transition-shadow shadow-[0_0_50px_rgba(255,215,0,0.3)] hover:shadow-[0_0_80px_rgba(255,215,0,0.5)]"
                    >
                        Decode My Dashboard
                    </motion.button>
                </div>
            </section>

            <LandingFooter />

            {/* Reduced-motion respect */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}} />
        </main>
    );
}
