"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const timelinePoints = [
    {
        id: "macro-micro",
        title: "The Macro-Micro Sync",
        color: "from-[#D4AF37] to-[#B8860B]",
        shadow: "shadow-[#D4AF37]/30",
        border: "border-[#D4AF37]/30",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="rgba(212,175,55,0.1)" stroke="rgba(212,175,55,0.3)" />
                <path d="M2.5 12C2.5 12 6 8 12 8C18 8 21.5 12 21.5 12" strokeLinecap="round" />
                <path d="M2.5 12C2.5 12 6 16 12 16C18 16 21.5 12 21.5 12" strokeLinecap="round" opacity="0.5" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <path d="M12 2V4M12 20V22M4 12H2M22 12H20" opacity="0.2" />
            </svg>
        ),
        desc: "The moon pulls the ocean (70% water). You are 70% water. If you think a mass of rock 238,000 miles away governs planetary tides but magically skips your nervous system, you're denying basic physics, not astrology.",
        visual: (
            <div className="mt-6 flex flex-col gap-4">
                <div className="bg-[#FFF8EC] p-4 rounded-lg border border-[#D4AF37]/20">
                    <div className="flex justify-between text-xs font-mono text-[#8A631F] mb-2 font-[family-name:var(--font-space)]">
                        <span>PLANETARY_TIDES.WATER_VOL</span>
                        <span>70%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#EAE0C8] rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "70%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" 
                        />
                    </div>
                </div>
                <div className="bg-[#FFF8EC] p-4 rounded-lg border border-[#D4AF37]/20">
                    <div className="flex justify-between text-xs font-mono text-[#8A631F] mb-2 font-[family-name:var(--font-space)]">
                        <span>HUMAN_BIOME.WATER_VOL</span>
                        <span>70%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#EAE0C8] rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "70%" }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            className="h-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" 
                        />
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "chronobiology",
        title: "Chronobiology & Solar Output",
        color: "from-[#F59E0B] to-[#D97706]",
        shadow: "shadow-[#F59E0B]/30",
        border: "border-[#F59E0B]/30",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-[#F59E0B] drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <circle cx="12" cy="12" r="5" fill="rgba(245,158,11,0.2)" stroke="rgba(245,158,11,0.5)" />
                <path d="M12 2V4M12 20V22M4 12H2M22 12H20L19.0711 19.0711M4.92893 4.92893L6.34315 6.34315M19.0711 4.92893L17.6569 6.34315M4.92893 19.0711L6.34315 17.6569" strokeLinecap="round" strokeWidth="1" />
                <path d="M12 7V12L15 15" strokeLinecap="round" />
            </svg>
        ),
        desc: "Circadian rhythms dictate your sleep, hormone production, and neurological output. These biological clocks are anchored entirely by solar cycles. We precisely map this solar imprint from your exact minute of birth."
    },
    {
        id: "data-dogma",
        title: "Code Over Dogma",
        color: "from-[#1a1a1a] to-[#2C2C2C]",
        shadow: "shadow-[#1a1a1a]/20",
        border: "border-[#1a1a1a]/20",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 text-[#1a1a1a] drop-shadow-[0_0_15px_rgba(26,26,26,0.3)]">
                <ellipse cx="12" cy="12" rx="10" ry="4" strokeLinecap="round" stroke="rgba(26,26,26,0.8)" />
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" strokeLinecap="round" opacity="0.5" stroke="rgba(212,175,55,0.8)" />
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" strokeLinecap="round" opacity="0.3" stroke="rgba(26,26,26,0.8)" />
                <circle cx="12" cy="12" r="1.5" fill="rgba(212,175,55,1)" />
            </svg>
        ),
        desc: "Skeptics demand proof. We demand they look at the code. Vedic Astrology isn't faith. It's an ancient, highly evolved mathematical UI mapping orbital mechanics, quantum entanglement, and planetary electromagnetism."
    }
];

export default function QuantumProofs() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Smooth progress for the timeline beam
    const scaleY = useSpring(useTransform(scrollYProgress, [0.1, 0.8], [0, 1]), {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Parallax background grid
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section ref={containerRef} className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center py-32 px-4 relative overflow-hidden">

            {/* Grid Background */}
            <motion.div
                style={{ y: bgY }}
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
            >
                <div className="w-full h-[200%] bg-[linear-gradient(to_right,#B8860B_1px,transparent_1px),linear-gradient(to_bottom,#B8860B_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </motion.div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-[#FFEDD5]/40 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#FEF3C7]/40 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-5xl w-full z-10 mx-auto relative">

                {/* Header Section */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block px-5 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 backdrop-blur-sm mb-6">
                            <span className="font-mono text-[#8A631F] text-[10px] md:text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-space)]">
                                System Override: Initiated
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl text-[#1a1a1a] font-medium mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "var(--font-display)" }}>
                            It's Not Magic.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B]">
                                It's Astrophysics.
                            </span>
                        </h2>
                        <p className="font-mono text-[#1a1a1a]/70 text-base md:text-lg max-w-2xl mx-auto uppercase tracking-[0.15em] border-l-2 border-[#D4AF37] pl-4 text-left font-[family-name:var(--font-space)]">
                            Gravity doesn't care if you believe in it. Neither do the planets. Here is the math.
                        </p>
                    </motion.div>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-8 md:pl-0 mt-16">

                    {/* The Glowing Timeline Beam (Desktop Center, Mobile Left) */}
                    <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#EAE0C8] -translate-x-1/2 rounded-full overflow-hidden">
                        <motion.div
                            style={{ scaleY, originY: 0 }}
                            className="w-full h-full bg-gradient-to-b from-[#D4AF37] via-[#F59E0B] to-[#B8860B] shadow-[0_0_15px_rgba(212,175,55,0.6)]"
                        />
                    </div>

                    {/* Timeline Nodes */}
                    <div className="space-y-24 md:space-y-32">
                        {timelinePoints.map((point, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <TimelineNode
                                    key={point.id}
                                    point={point}
                                    isEven={isEven}
                                    index={index}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Final Scientific Verdict */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-32 text-center p-8 border border-[#D4AF37]/20 bg-[#FFF8EC]/60 backdrop-blur-md rounded-2xl relative overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.05)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 via-[#F59E0B]/5 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Corner Tech Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#D4AF37]/50 m-2"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#D4AF37]/50 m-2"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#D4AF37]/50 m-2"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#D4AF37]/50 m-2"></div>

                    <h3 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] mb-4 font-[family-name:var(--font-display)]">
                        Stop debating gravity.
                    </h3>
                    <p className="font-mono text-[#D4AF37] uppercase tracking-[0.2em] text-sm md:text-base font-[family-name:var(--font-space)]">
                        Start leveraging the mechanics.
                    </p>
                </motion.div>

            </div>
        </section>
    );
}

function TimelineNode({ point, isEven, index }: { point: any, isEven: boolean, index: number }) {
    return (
        <div className={`relative flex flex-col md:flex-row items-start md:items-center justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>

            {/* Spacing element for staggered layout on desktop */}
            <div className="hidden md:block w-5/12"></div>

            {/* Center Node / Icon */}
            <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.4, duration: 1, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`absolute left-0 md:left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 ${point.border} bg-[#FAFAF7] z-20 flex items-center justify-center p-4 ${point.shadow} backdrop-blur-sm shadow-xl`}
            >
                {point.icon}
            </motion.div>

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`w-full pl-16 md:pl-0 md:w-5/12 ${isEven ? 'md:text-left' : 'md:text-right'}`}
            >
                <div className={`p-8 rounded-[1.5rem] border border-[#1a1a1a]/5 bg-white backdrop-blur-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] transition-all duration-500 relative group overflow-hidden`}>

                    {/* Hover Glow Effect */}
                    <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-1 h-full bg-gradient-to-b ${point.color} opacity-40 group-hover:opacity-100 transition-opacity`} />

                    <div className="text-[10px] font-mono text-[#1a1a1a]/40 mb-3 tracking-[0.25em] uppercase flex items-center gap-2 justify-start md:inline-flex md:justify-end font-[family-name:var(--font-space)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                        Data Point 0{index + 1}
                    </div>

                    <h3 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-4 leading-tight font-[family-name:var(--font-display)]">
                        {point.title}
                    </h3>

                    <p className="font-sans text-[#1a1a1a]/70 leading-relaxed font-light text-sm md:text-base font-[family-name:var(--font-outfit)]">
                        {point.desc}
                    </p>
                    {point.visual && point.visual}

                    {/* Tech Graphic Overlay inside card */}
                    <div className="absolute -bottom-6 -right-6 text-[#1a1a1a]/[0.02] pointer-events-none group-hover:text-[#D4AF37]/10 transition-colors">
                        {/* Subtle geometric pattern */}
                        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" />
                            <path d="M100 10L100 190M10 100L190 100" stroke="currentColor" strokeWidth="1" />
                        </svg>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
