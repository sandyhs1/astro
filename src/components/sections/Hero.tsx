"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, useState } from "react";
import InitiationModal from "../features/InitiationModal";

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const [isInitiationOpen, setIsInitiationOpen] = useState(false);

    // Slightly taller initial bars so title has more breathing room from top
    const topBarH = useTransform(scrollYProgress, [0, 0.4], ["8vh", "50vh"]);
    const botBarH = useTransform(scrollYProgress, [0, 0.4], ["8vh", "50vh"]);
    const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
    const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

    return (
        <section ref={ref} className="relative w-full h-[160vh] bg-black">
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#020202]">

                {/* Slow ambient sweep */}
                <motion.div
                    animate={{ left: ["-60%", "160%"] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-[35vw] bg-gradient-to-r from-transparent via-white/[0.025] to-transparent skew-x-[-15deg] pointer-events-none blur-2xl z-0"
                />

                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,215,0,0.03),transparent)] pointer-events-none z-0" />

                <motion.div
                    style={{ scale, opacity }}
                    className="z-10 flex flex-col items-center justify-center text-center px-6 w-full"
                >
                    {/* Overline */}
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.8em" }}
                        animate={{ opacity: 0.4, letterSpacing: "0.55em" }}
                        transition={{ duration: 2.5, delay: 0.3 }}
                        className="font-[family-name:var(--font-cinzel)] text-[0.6rem] text-white tracking-[0.55em] uppercase mb-10"
                    >
                        Vedic Intelligence
                    </motion.p>

                    {/* Main Title — The Sovereign */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="font-[family-name:var(--font-cinzel)] uppercase leading-[1.15] mt-6"
                    >
                        <span className="block font-medium text-[clamp(2rem,5.5vw,5.5rem)] tracking-[0.18em] text-white/90">
                            Don&apos;t chase.
                        </span>
                        <span className="block font-bold text-[clamp(3rem,8vw,8.5rem)] tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#F5E6A3] to-[#C9A84C] leading-[1.05] my-1">
                            Attract.
                        </span>
                        <span className="block font-light text-[clamp(1rem,2.5vw,2.2rem)] tracking-[0.45em] text-white/60 mt-1">
                            On Command.
                        </span>
                    </motion.h1>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
                        className="w-px h-14 bg-gradient-to-b from-transparent via-white/20 to-transparent my-8 origin-top"
                    />

                    {/* Subtext — clearly legible */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1.5 }}
                        className="font-[family-name:var(--font-cinzel)] font-light text-white/70 text-[0.65rem] tracking-[0.35em] uppercase max-w-xs leading-[2.4] text-center mb-3"
                    >
                        The universe has favorites. Be one of them.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1.8 }}
                        className="font-[family-name:var(--font-manrope)] font-light text-white/45 text-[0.7rem] tracking-[0.12em] max-w-sm leading-[2.4] text-center mb-12"
                    >
                        We map your personal &apos;God Mode&apos; cycles so you never waste energy on a bad day again.
                    </motion.p>

                    {/* CTA */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2, delay: 2.1 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setIsInitiationOpen(true)}
                        className="group relative px-10 py-4 border border-white/15 text-white/60 hover:text-white hover:border-white/30 uppercase tracking-[0.4em] text-[0.6rem] font-[family-name:var(--font-cinzel)] transition-all duration-500 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        Initiate Sequence
                    </motion.button>
                </motion.div>

                {/* Letterbox bars */}
                <motion.div style={{ height: topBarH }} className="absolute top-0 left-0 w-full bg-black z-50 pointer-events-none" />
                <motion.div style={{ height: botBarH }} className="absolute bottom-0 left-0 w-full bg-black z-50 pointer-events-none" />
            </div>

            <InitiationModal isOpen={isInitiationOpen} onClose={() => setIsInitiationOpen(false)} />
        </section>
    );
}
