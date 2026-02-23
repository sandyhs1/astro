"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
    const { openModal } = useOnboarding();
    const { scrollY } = useScroll();

    // Parallax and fade effects on scroll
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0500] z-0">
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
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white uppercase leading-[1.1] tracking-tighter"
                        style={{ fontFamily: "var(--font-unbounded)" }}
                    >
                        Don&apos;t chase. <br />
                        <span className="text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">Attract.</span> <br /> On command.
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
                        onClick={openModal}
                        className="px-8 md:px-10 py-4 md:py-5 bg-[#FFD700]/5 border border-[#FFD700]/40 text-[#FFD700] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm hover:text-white hover:border-[#FFD700] transition-all backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                    >
                        [ See My Decision Map ]
                    </motion.button>
                </div>
            </motion.div>

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
