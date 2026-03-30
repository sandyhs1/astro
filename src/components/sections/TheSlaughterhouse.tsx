"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const archetypes = [
    {
        id: "curse-architect",
        name: "The Curse Architect",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                <path d="M12 2C7 2 4 6 4 10C4 13.5 6 15.5 7 18C7.5 19.5 8.5 22 12 22C15.5 22 16.5 19.5 17 18C18 15.5 20 13.5 20 10C20 6 17 2 12 2Z" />
                <path d="M9 13L15 13M10 16L14 16" strokeLinecap="round" />
                <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                <circle cx="15" cy="9" r="1.5" fill="currentColor" />
                <path d="M12 2V4" strokeLinecap="round" />
            </svg>
        ),
        frontDesc: "Tells you that you have 'Kalsarp Dosh' and desperately need a $500 ritual.",
        truthDesc: "Result: Their bank account grows exponentially, while your anxiety doubles. It's not spirituality; it's extortion."
    },
    {
        id: "crystal-pimp",
        name: "The Crystal Pimp",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                <path d="M12 2L2 9L12 22L22 9L12 2Z" fill="rgba(255,215,0,0.1)" strokeWidth="1.5" />
                <path d="M2 9H22M12 2V22" strokeWidth="1.5" />
                <path d="M7 6L17 16M17 6L7 16" opacity="0.5" />
                <circle cx="12" cy="12" r="3" fill="rgba(255,215,0,0.2)" />
            </svg>
        ),
        frontDesc: "Convinces you that wearing a specific yellow sapphire will cure your bankruptcy.",
        truthDesc: "A yellow sapphire is a rock, not a financial strategy. True wealth requires ruthless strategy and execution, not magic stones."
    },
    {
        id: "fortune-cookie",
        name: "The Fortune Cookie",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.1537 8.06353C14.5485 8.60553 14.6734 9.29011 14.5079 9.96767C14.288 10.865 13.5 11.5 12 12V14" strokeLinecap="round" />
                <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
                <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.63604 5.63604L7.05025 7.05025M16.9497 16.9497L18.364 18.364M5.63604 18.364L7.05025 16.9497M16.9497 7.05025L18.364 5.63604" opacity="0.3" />
            </svg>
        ),
        frontDesc: "Says 'You will face a challenge today.' Wow, groundbreaking revelation.",
        truthDesc: "Useless ambiguity masked as ancient wisdom. This applies to literal every human alive. You need coordinates, not generalities."
    }
];

export default function TheSlaughterhouse() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const xLeft = useTransform(scrollYProgress, [0, 1], [-150, 50]);
    const xRight = useTransform(scrollYProgress, [0, 1], [150, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 0]);

    return (
        <section ref={containerRef} className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center py-24 relative overflow-hidden">

            {/* Background Glitch & Chaos */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDUwMDBhIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyMTUsMCwwLjEpIiAvPgo8L3N2Zz4=')]"></div>
                <motion.div
                    animate={{ x: [0, 10, -10, 0], y: [0, -5, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                    className="absolute top-20 right-20 w-72 h-72 bg-[#FF4B4B] rounded-full blur-[150px] opacity-10"
                ></motion.div>
                <motion.div
                    animate={{ x: [0, -15, 10, 0], y: [0, 10, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}
                    className="absolute bottom-20 left-20 w-72 h-72 bg-[#FFD700] rounded-full blur-[150px] opacity-10"
                ></motion.div>
            </div>

            <div className="max-w-7xl w-full px-6 z-10">
                <motion.div style={{ opacity }} className="text-center mb-24 relative">
                    <div className="inline-block relative">
                        <h2 className="text-5xl md:text-8xl text-[#FBFBFB] mb-6 font-bold tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
                            Astrology isn't a scam. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8A0303] to-[#FF4B4B] relative inline-block">
                                Your astrologer is.
                                {/* Clean Glitch effect overlay on text */}
                                <motion.span 
                                    animate={{ x: [-2, 2, -1, 1, 0], opacity: [1, 0.8, 1, 0.9, 1] }} 
                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                    className="absolute top-0 left-0 w-full h-full text-[#FF4B4B] opacity-50 mix-blend-screen -z-10 blur-[1px]"
                                    aria-hidden="true"
                                >
                                    Your astrologer is.
                                </motion.span>
                            </span>
                        </h2>
                    </div>
                    <p className="font-mono text-[#FFD700] text-lg md:text-xl max-w-3xl mx-auto uppercase tracking-widest mt-4 border-y border-[#FFD700]/20 py-4 bg-[#FFD700]/5">
                        Exposing the spiritual mafia that profits from your anxiety.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">
                    {archetypes.map((type, index) => (
                        <ScannerCard key={type.id} data={type} index={index} />
                    ))}
                </div>

            </div>

            <style jsx global>{`
                .stroke-text {
                    -webkit-text-stroke: 1px rgba(255,255,255,0.2);
                }
                .stroke-danger {
                     -webkit-text-stroke: 2px rgba(255, 75, 75, 0.6);
                     text-shadow: 0 0 20px rgba(255, 75, 75, 0.4), 0 0 40px rgba(255, 75, 75, 0.2);
                }
                .fade-danger {
                    opacity: 0.8;
                }
            `}</style>
        </section>
    );
}

function ScannerCard({ data, index }: { data: any, index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            className="relative bg-[#0d0213] border border-white/10 rounded-xl overflow-hidden cursor-crosshair group min-h-[400px]"
        >
            {/* Base Content (The Illusion) */}
            <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center text-center transition-opacity duration-300 z-10 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <div className="mb-6 p-6 rounded-full bg-[#1a0426] border border-[#FFD700]/20 shadow-[0_0_30px_rgba(255,215,0,0.1)] group-hover:shadow-[#FFD700]/30 transition-all duration-500">
                    {data.icon}
                </div>
                <h3 className="font-serif text-3xl text-white mb-4 tracking-wide">{data.name}</h3>
                <p className="font-mono text-gray-400 text-sm leading-relaxed">
                    {data.frontDesc}
                </p>
                <div className="mt-8 text-xs font-mono text-[#FFD700]/50 uppercase tracking-[0.2em] animate-pulse">
                    Hover to Scan Identity
                </div>
            </div>

            {/* Revealed Truth (The Reality) */}
            <div className={`absolute inset-0 p-8 flex flex-col justify-center text-left bg-[#150202] transition-all duration-300 z-20 overflow-hidden ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Red Glitch Background effect */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJ0cmFuc3BhcmVudCIgLz4KPHBhdGggZD0iTTAgMEw4IDhaIiBzdHJva2U9InJnYmEoMjU1LCAwLCAwLCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50 z-0"></div>

                <div className="z-10 relative h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6 border-b border-red-500/30 pb-4">
                        <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                        <h3 className="font-mono text-red-500 font-bold uppercase tracking-widest text-lg">Identity Verified</h3>
                    </div>

                    <p className="font-sans text-white text-lg leading-relaxed font-light mb-auto">
                        {data.truthDesc}
                    </p>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-red-500/20">
                        <span className="font-mono text-xs text-red-400/60 uppercase">System: SoulSync</span>
                        <span className="font-mono text-xs text-red-400/60">Status: DESTROYED</span>
                    </div>
                </div>
            </div>

            {/* The BULLSHIT Stamp */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 3, rotate: -20 }}
                        animate={{ opacity: 0.9, scale: 1, rotate: -15 }}
                        exit={{ opacity: 0, scale: 2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 mix-blend-screen"
                    >
                        <div className="border-[6px] border-[#FF4B4B] text-[#FF4B4B] text-5xl md:text-6xl font-black uppercase tracking-widest px-6 py-2 rounded-xl backdrop-blur-sm bg-black/20 shadow-[0_0_50px_rgba(255,75,75,0.6)]" style={{ fontFamily: "var(--font-display)", textShadow: "0 0 20px rgba(255,75,75,1)" }}>
                            BULLSHIT
                            <div className="absolute inset-x-0 -bottom-8 text-center text-sm tracking-[0.5em] font-mono text-[#FF4B4B]/80 font-normal">
                                TARGET IDENTIFIED
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Corner Bracket Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 transition-colors duration-300 z-30 pointer-events-none group-hover:border-red-500/50 rounded-tl-lg m-2"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 transition-colors duration-300 z-30 pointer-events-none group-hover:border-red-500/50 rounded-br-lg m-2"></div>
        </motion.div>
    );
}
