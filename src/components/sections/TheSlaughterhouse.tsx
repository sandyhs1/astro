"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const archetypes = [
    {
        id: "curse-architect",
        name: "The Ritual Architect",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-[#B8860B]">
                <path d="M12 2C7 2 4 6 4 10C4 13.5 6 15.5 7 18C7.5 19.5 8.5 22 12 22C15.5 22 16.5 19.5 17 18C18 15.5 20 13.5 20 10C20 6 17 2 12 2Z" />
                <path d="M9 13L15 13M10 16L14 16" strokeLinecap="round" />
                <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                <circle cx="15" cy="9" r="1.5" fill="currentColor" />
                <path d="M12 2V4" strokeLinecap="round" />
            </svg>
        ),
        frontDesc: "Tells you that you have a 'dosha' and desperately need a $500 ritual.",
        truthDesc: "Result: Their bank account grows exponentially, while your anxiety doubles. It's not spirituality; it's extortion driven by fear."
    },
    {
        id: "crystal-pimp",
        name: "The Gemstone Merchant",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 text-[#B8860B]">
                <path d="M12 2L2 9L12 22L22 9L12 2Z" fill="rgba(184,134,11,0.1)" strokeWidth="1.5" />
                <path d="M2 9H22M12 2V22" strokeWidth="1.5" />
                <path d="M7 6L17 16M17 6L7 16" opacity="0.5" />
                <circle cx="12" cy="12" r="3" fill="rgba(184,134,11,0.2)" />
            </svg>
        ),
        frontDesc: "Convinces you that wearing a specific yellow sapphire will cure your bankruptcy.",
        truthDesc: "A yellow sapphire is a rock, not a financial remedy. True wealth requires strategic timing and execution, not superstitious stones."
    },
    {
        id: "fortune-cookie",
        name: "The Generic Oracle",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-[#B8860B]">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.1537 8.06353C14.5485 8.60553 14.6734 9.29011 14.5079 9.96767C14.288 10.865 13.5 11.5 12 12V14" strokeLinecap="round" />
                <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
                <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.63604 5.63604L7.05025 7.05025M16.9497 16.9497L18.364 18.364M5.63604 18.364L7.05025 16.9497M16.9497 7.05025L18.364 5.63604" opacity="0.3" />
            </svg>
        ),
        frontDesc: "Vaguely predicts 'You will face a challenge today.' Wow, groundbreaking.",
        truthDesc: "Useless ambiguity masked as ancient wisdom. This applies to every human alive. You need exact coordinates, not generic horoscopes."
    }
];

export default function TheSlaughterhouse() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 0]);

    return (
        <section ref={containerRef} className="min-h-[80vh] flex flex-col items-center justify-center py-24 relative overflow-hidden bg-[#FAFAF7]">

            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <motion.div
                    animate={{ x: [0, 10, -10, 0], y: [0, -5, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute top-20 right-20 w-72 h-72 bg-[#D4AF37] rounded-full blur-[150px] opacity-10"
                ></motion.div>
                <motion.div
                    animate={{ x: [0, -15, 10, 0], y: [0, 10, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                    className="absolute bottom-20 left-20 w-72 h-72 bg-[#B8860B] rounded-full blur-[150px] opacity-10"
                ></motion.div>
            </div>

            <div className="max-w-6xl w-full px-6 z-10">
                <motion.div style={{ opacity }} className="text-center mb-24 relative">
                    <div className="inline-block relative">
                        <h2 className="font-[family-name:var(--font-cinzel)] uppercase leading-tight mb-6">
                            <span className="block font-medium text-[clamp(1.8rem,4vw,3rem)] tracking-[0.1em] text-[#1a1a1a]/80 mb-2">
                                Astrology isn&apos;t emotional fraud.
                            </span>
                            <span className="block font-medium text-[clamp(2rem,4.5vw,4rem)] tracking-[0.05em] text-[#1a1a1a] relative">
                                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] italic">astrologer</span> is.
                            </span>
                        </h2>
                    </div>
                    <p className="font-[family-name:var(--font-space)] text-[#D4AF37] text-xs md:text-sm max-w-3xl mx-auto uppercase tracking-widest mt-4">
                        Exposing the spiritual theater that profits from your anxiety.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-stretch">
                    {archetypes.map((type, index) => (
                        <ScannerCard key={type.id} data={type} index={index} />
                    ))}
                </div>
            </div>
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
            className="relative bg-white border border-[#1a1a1a]/10 rounded-2xl overflow-hidden cursor-crosshair group min-h-[380px] shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
        >
            {/* Base Content (The Illusion) */}
            <div className={`absolute inset-0 p-8 flex flex-col items-center justify-center text-center transition-opacity duration-300 z-10 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <div className="mb-8 p-6 rounded-[2rem] bg-[#FAFAF7] border border-[#D4AF37]/20 shadow-[0_5px_20px_rgba(212,175,55,0.05)] text-[#1a1a1a]">
                    {data.icon}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl text-[#1a1a1a] mb-4 tracking-wide font-medium">{data.name}</h3>
                <p className="font-[family-name:var(--font-outfit)] text-[#1a1a1a]/60 text-sm leading-relaxed max-w-[250px]">
                    {data.frontDesc}
                </p>
                <div className="mt-8 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em] animate-pulse">
                    Hover to Decode
                </div>
            </div>

            {/* Revealed Truth (The Reality) */}
            <div className={`absolute inset-0 p-8 flex flex-col justify-center text-left bg-[#FFFAFA] border-2 border-red-900/10 transition-all duration-300 z-20 overflow-hidden ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                
                <div className="z-10 relative h-full flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6 border-b border-red-900/10 pb-4">
                        <div className="w-2 h-2 rounded-full bg-red-700 animate-pulse"></div>
                        <h3 className="font-[family-name:var(--font-space)] text-red-800 font-medium uppercase tracking-widest text-xs">Illusion Decoded</h3>
                    </div>

                    <p className="font-[family-name:var(--font-outfit)] text-[#1a1a1a]/80 text-sm md:text-base leading-[1.8] font-light mb-auto">
                        {data.truthDesc}
                    </p>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-red-900/10 mb-8">
                        <span className="font-mono text-[10px] text-red-800/60 uppercase">Forensic Math</span>
                        <span className="font-mono text-[10px] text-red-800/60 tracking-wider">INVALIDATED</span>
                    </div>
                </div>
            </div>

            {/* The MYTH Stamp */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 2, rotate: -15 }}
                        animate={{ opacity: 1, scale: 1, rotate: -10 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                    >
                        <div className="border-[4px] border-red-700/80 text-red-700/80 text-4xl md:text-5xl font-bold uppercase tracking-widest px-6 py-2 rounded-lg backdrop-blur-sm shadow-[0_0_30px_rgba(185,28,28,0.1)] font-[family-name:var(--font-display)]">
                            MYTH
                            <div className="absolute inset-x-0 -bottom-6 text-center text-[9px] tracking-[0.4em] font-mono text-red-700/60 font-medium">
                                NARRATIVE REJECTED
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
