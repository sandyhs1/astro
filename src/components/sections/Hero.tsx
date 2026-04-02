"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, useState } from "react";
import InitiationModal from "../features/InitiationModal";

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const [isInitiationOpen, setIsInitiationOpen] = useState(false);

    // Keep the letterbox bar animation logic since user likes scroll animations
    const topBarH = useTransform(scrollYProgress, [0, 0.4], ["8vh", "50vh"]);
    const botBarH = useTransform(scrollYProgress, [0, 0.4], ["8vh", "50vh"]);
    const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
    const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

    return (
        <section ref={ref} className="relative w-full h-[160vh] bg-[#FAFAF7]">
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#FAFAF7]">

                {/* Soft warm gradient orbs */}
                <div className="absolute top-[10%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-[#FFF3E0]/70 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#E8D5B7]/50 blur-[120px] pointer-events-none" />

                <motion.div
                    style={{ scale, opacity }}
                    className="z-10 flex flex-col items-center justify-center text-center px-4 md:px-6 w-full max-w-5xl mx-auto"
                >
                    {/* Overline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="flex items-center justify-center gap-3 mb-6 md:mb-10"
                    >
                        <div className="w-4 md:w-8 h-[1px] bg-[#1a1a1a]/30" />
                        <span className="text-[#1a1a1a]/60 text-[9px] md:text-[11px] tracking-[0.2em] md:tracking-[0.45em] uppercase font-[family-name:var(--font-space)]">
                            Ancient Vedic Mathematics
                        </span>
                        <div className="w-4 md:w-8 h-[1px] bg-[#1a1a1a]/30" />
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="font-[family-name:var(--font-cinzel)] uppercase leading-tight mt-2"
                    >
                        <span className="block font-medium text-[clamp(1.5rem,4vw,3.5rem)] tracking-[0.1em] text-[#1a1a1a]">
                            Your Destiny Is Not
                        </span>
                        <span className="block font-bold text-[clamp(2.2rem,6vw,5.5rem)] tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] leading-tight my-1 pb-2">
                            A Coincidence.
                        </span>
                    </motion.h1>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
                        className="w-[1px] h-10 md:h-16 bg-gradient-to-b from-transparent via-[#1a1a1a]/20 to-transparent my-6 md:my-8 origin-top"
                    />

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1.5 }}
                        className="font-[family-name:var(--font-cinzel)] font-light text-[#1a1a1a]/80 text-[0.7rem] md:text-[0.8rem] tracking-[0.2em] md:tracking-[0.3em] uppercase max-w-lg leading-[2] md:leading-[2.4] text-center mb-4"
                    >
                        5,000-year-old algorithms dictated by mechanics.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1.8 }}
                        className="font-[family-name:var(--font-outfit)] font-light text-[#1a1a1a]/60 text-[0.9rem] md:text-[1rem] tracking-[0.05em] max-w-2xl leading-[1.6] md:leading-[1.8] text-center mb-10 md:mb-14 px-2"
                    >
                        We calculate the exact mathematical blueprint of your life trajectory. No gemstones. No fear mongering. Just raw, uncompromising data decoded from the moment you took your first breath.
                    </motion.p>

                    {/* CTA */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2, delay: 2.1 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setIsInitiationOpen(true)}
                        className="group relative px-8 md:px-12 py-4 md:py-5 bg-[#1a1a1a] text-[#FAFAF7] uppercase tracking-[0.2em] text-[0.6rem] md:text-[0.7rem] font-[family-name:var(--font-space)] transition-all duration-500 overflow-hidden shadow-[0_10px_30px_rgba(26,26,26,0.15)] hover:shadow-[0_15px_40px_rgba(184,134,11,0.2)]"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        <span className="relative z-10 flex items-center gap-2 md:gap-3">
                            Decode Your Blueprint
                        </span>
                    </motion.button>
                </motion.div>

                {/* Letterbox bars - using light mode friendly overlay if needed */}
                <motion.div style={{ height: topBarH }} className="absolute top-0 left-0 w-full bg-white z-50 pointer-events-none" />
                <motion.div style={{ height: botBarH }} className="absolute bottom-0 left-0 w-full bg-white z-50 pointer-events-none" />
            </div>

            <InitiationModal isOpen={isInitiationOpen} onClose={() => setIsInitiationOpen(false)} />
        </section>
    );
}
