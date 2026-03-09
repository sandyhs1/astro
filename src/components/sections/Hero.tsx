"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import InitiationModal from "../features/InitiationModal";



export default function Hero() {
    const { openModal } = useOnboarding();
    const { scrollY } = useScroll();
    const [isInitiationOpen, setIsInitiationOpen] = useState(false);

    // Parallax and fade effects on scroll
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0500] z-0">
            {/* Animated Parallax Mandala Background */}
            <motion.div
                style={{ y: useTransform(scrollY, [0, 1000], [0, 150]) }}
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] md:opacity-[0.25] mix-blend-screen flex items-center justify-center overflow-hidden"
            >
                {/* Glowing Radiant Light Rays behind Mandala */}
                <div className="absolute w-[120vw] h-[120vw] md:w-[80vw] md:h-[80vw] max-w-[900px] max-h-[900px] bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.15)_0%,transparent_60%)] origin-center animate-[spin_120s_linear_infinite]" />
                <div className="absolute w-[100vw] h-[100vw] md:w-[60vw] md:h-[60vw] max-w-[800px] max-h-[800px] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,215,0,0.05)_45deg,transparent_90deg,rgba(255,215,0,0.05)_135deg,transparent_180deg,rgba(255,215,0,0.05)_225deg,transparent_270deg,rgba(255,215,0,0.05)_315deg,transparent_360deg)] mix-blend-screen origin-center animate-[spin_240s_linear_infinite_reverse]" />

                {/* Floating Mystical Particles */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#FFD700] mix-blend-screen shadow-[0_0_15px_rgba(255,215,0,0.8)]"
                        initial={{
                            x: (Math.random() - 0.5) * 800,
                            y: (Math.random() - 0.5) * 800,
                            scale: Math.random() * 0.5 + 0.5,
                            opacity: Math.random() * 0.3 + 0.2
                        }}
                        animate={{
                            x: (Math.random() - 0.5) * 1000,
                            y: (Math.random() - 0.5) * 1000,
                            opacity: [0.1, 0.7, 0.1],
                            scale: [0.5, 1.2, 0.5]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                    />
                ))}

                {/* The Mandala */}
                <motion.img
                    src="/hero-bg.png"
                    alt="Vedic Astrology Mandala Background"
                    className="w-[100vw] h-[100vw] md:w-[70vw] md:h-[70vw] max-w-[800px] max-h-[800px] object-cover origin-center drop-shadow-[0_0_40px_rgba(255,215,0,0.25)] brightness-75 contrast-125 [mask-image:radial-gradient(circle_at_center,black_45%,transparent_70%)] relative z-10"
                />
            </motion.div>

            {/* Ambient Lighting / Quantum Void Effects */}
            <div className="absolute right-[-10%] top-[-10%] w-[60vh] h-[60vh] bg-[#FFD700]/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute left-[-10%] bottom-[-10%] w-[60vh] h-[60vh] bg-yellow-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#FFD700_1px,transparent_1px),linear-gradient(to_bottom,#FFD700_1px,transparent_1px)] bg-[size:48px_48px]"></div>

            <motion.div
                style={{ y, opacity }}
                className="z-10 flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl w-full mx-auto"
            >
                <div className="flex flex-col gap-8 md:gap-10 items-start">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] text-[#FBFBFB] leading-[1.05] tracking-tight font-medium mb-6"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Don&apos;t chase. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8D6] to-[#af8702] italic pr-2">Attract.</span> <br />
                        <span className="font-sans font-light tracking-tighter" style={{ fontFamily: 'var(--font-body)' }}>On command.</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "8rem" }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-[2px] bg-[#FFD700] w-24 md:w-32"
                    ></motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-sm md:text-lg text-[#FFD700]/60 max-w-2xl leading-relaxed font-light tracking-wide uppercase"
                        style={{ fontFamily: "var(--font-manrope)" }}
                    >
                        The universe has favorites. Be one of them. <br />
                        <span className="text-white bg-[#FFD700]/5 border border-[#FFD700]/20 px-3 py-1.5 md:py-1 mt-4 inline-block rounded md:whitespace-nowrap normal-case">We map your personal &apos;God Mode&apos; cycles so you never waste energy on a bad day again.</span>
                    </motion.p>

                    {/* CTA */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 215, 0, 0.15)" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        onClick={() => setIsInitiationOpen(true)}
                        className="px-8 md:px-10 py-4 md:py-5 bg-[#FFD700]/5 border border-[#FFD700]/40 text-[#FFD700] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm hover:text-white hover:border-[#FFD700] transition-all backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                    >
                        [ See My Decision Map ]
                    </motion.button>
                </div>
            </motion.div>

            <InitiationModal
                isOpen={isInitiationOpen}
                onClose={() => setIsInitiationOpen(false)}
            />

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                style={{ opacity }}
                className="absolute bottom-10 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] text-[#FFD700]/50 uppercase">Scroll to Disintegrate</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#FFD700] to-transparent"></div>
            </motion.div>
        </section>
    );
}
