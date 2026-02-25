"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const timelinePoints = [
    {
        id: "macro-micro",
        title: "The Macro-Micro Sync",
        color: "from-cyan-400 to-blue-600",
        shadow: "shadow-cyan-500/50",
        border: "border-cyan-500/30",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="rgba(34,211,238,0.1)" stroke="rgba(34,211,238,0.3)" />
                <path d="M2.5 12C2.5 12 6 8 12 8C18 8 21.5 12 21.5 12" strokeLinecap="round" />
                <path d="M2.5 12C2.5 12 6 16 12 16C18 16 21.5 12 21.5 12" strokeLinecap="round" opacity="0.5" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <path d="M12 2V4M12 20V22M4 12H2M22 12H20" opacity="0.2" />
            </svg>
        ),
        desc: "The moon pulls the ocean (70% water). You are 70% water. If you think a mass of rock 238,000 miles away governs planetary tides but magically skips your nervous system, you're denying basic physics, not astrology."
    },
    {
        id: "chronobiology",
        title: "Chronobiology & Solar Output",
        color: "from-[#FFD700] to-orange-600",
        shadow: "shadow-[#FFD700]/50",
        border: "border-[#FFD700]/30",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">
                <circle cx="12" cy="12" r="5" fill="rgba(255,215,0,0.2)" stroke="rgba(255,215,0,0.5)" />
                <path d="M12 2V4M12 20V22M4 12H2M22 12H20L19.0711 19.0711M4.92893 4.92893L6.34315 6.34315M19.0711 4.92893L17.6569 6.34315M4.92893 19.0711L6.34315 17.6569" strokeLinecap="round" strokeWidth="1" />
                <path d="M12 7V12L15 15" strokeLinecap="round" />
            </svg>
        ),
        desc: "Circadian rhythms dictate your sleep, hormone production, and neurological output. These biological clocks are anchored entirely by solar cycles. We precisely map this solar imprint from your exact minute of birth."
    },
    {
        id: "data-dogma",
        title: "Code Over Dogma",
        color: "from-purple-500 to-cyan-500",
        shadow: "shadow-purple-500/50",
        border: "border-purple-500/30",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                <ellipse cx="12" cy="12" rx="10" ry="4" strokeLinecap="round" stroke="rgba(168,85,247,0.8)" />
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" strokeLinecap="round" opacity="0.5" stroke="rgba(34,211,238,0.8)" />
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" strokeLinecap="round" opacity="0.3" stroke="rgba(168,85,247,0.8)" />
                <circle cx="12" cy="12" r="1.5" fill="rgba(34,211,238,1)" />
            </svg>
        ),
        desc: "Skeptics demand proof. We demand they look at the code. Vedic Astrology isn't faith. It's an ancient, highly evolved UI mapping orbital mechanics, quantum entanglement, and planetary electromagnetism."
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
        <section ref={containerRef} className="min-h-screen bg-[#020617] flex flex-col items-center justify-center py-32 px-4 relative overflow-hidden">

            {/* Cyberpunk Grid Background */}
            <motion.div
                style={{ y: bgY }}
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
            >
                <div className="w-full h-[200%] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </motion.div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-5xl w-full z-10 mx-auto relative">

                {/* Header Section */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm mb-6">
                            <span className="font-mono text-cyan-400 text-xs tracking-[0.2em] uppercase uppercase">
                                System Override: Initiated
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl text-white font-bold mb-6 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                            It's Not Magic.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                                It's Astrophysics.
                            </span>
                        </h2>
                        <p className="font-mono text-gray-400 text-lg md:text-xl max-w-2xl mx-auto uppercase tracking-widest border-l-2 border-cyan-500 pl-4 text-left">
                            Gravity doesn't care if you believe in it. Neither do the planets. Here is the math.
                        </p>
                    </motion.div>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-8 md:pl-0 mt-16">

                    {/* The Glowing Timeline Beam (Desktop Center, Mobile Left) */}
                    <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-800 -translate-x-1/2 rounded-full overflow-hidden">
                        <motion.div
                            style={{ scaleY, originY: 0 }}
                            className="w-full h-full bg-gradient-to-b from-cyan-400 via-[#FFD700] to-purple-500 shadow-[0_0_15px_rgba(34,211,238,1)]"
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
                    className="mt-32 text-center p-8 border border-white/5 bg-black/40 backdrop-blur-md rounded-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Corner Tech Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-500/50 m-2"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500/50 m-2"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-500/50 m-2"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500/50 m-2"></div>

                    <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">
                        Stop debating gravity.
                    </h3>
                    <p className="font-mono text-cyan-400 uppercase tracking-[0.15em] text-sm md:text-base">
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
                className={`absolute left-0 md:left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 ${point.border} bg-[#020617] z-20 flex items-center justify-center p-4 ${point.shadow} backdrop-blur-sm shadow-xl`}
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
                <div className={`p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors duration-500 relative group overflow-hidden`}>

                    {/* Hover Glow Effect */}
                    <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-1 h-full bg-gradient-to-b ${point.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

                    <div className="text-xs font-mono text-gray-500 mb-2 tracking-widest uppercase flex items-center gap-2 justify-start md:inline-flex md:justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                        Data Point 0{index + 1}
                    </div>

                    <h3 className="font-serif text-2xl md:text-3xl text-white mb-4 leading-tight">
                        {point.title}
                    </h3>

                    <p className="font-sans text-gray-400 leading-relaxed font-light text-sm md:text-base">
                        {point.desc}
                    </p>

                    {/* Tech Graphic Overlay inside card */}
                    <div className="absolute -bottom-4 -right-4 text-white/5 pointer-events-none group-hover:text-white/10 transition-colors">
                        {/* Subtle geometric pattern */}
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
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
