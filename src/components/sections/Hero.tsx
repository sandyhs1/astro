"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useOnboarding } from "@/context/OnboardingContext";

export default function Hero() {
    const { openModal } = useOnboarding();
    const eyeContainerRef = useRef<HTMLDivElement>(null);

    // Mouse position logic for the eye (unchanged)
    const mouseX = useMotionValue(0);

    const mouseY = useMotionValue(0);

    // Smooth spring animation for the eye movement
    const springConfig = { damping: 25, stiffness: 150 };
    const eyeX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-35, 35]), springConfig);
    const eyeY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-35, 35]), springConfig);
    const pupilX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
    const pupilY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize mouse position from -0.5 to 0.5
            const { innerWidth, innerHeight } = window;
            mouseX.set(e.clientX / innerWidth - 0.5);
            mouseY.set(e.clientY / innerHeight - 0.5);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#12011A] z-0">
            {/* Background Texture/Grid (Subtle) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="z-10 flex flex-col items-center text-center px-4">
                {/* The 3D Eye Graphic */}


                {/* Typography */}
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white max-w-6xl mx-auto"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    Don't chase. <br />
                    <span className="text-[#FFD700]">Attract.</span> On command.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-6 text-lg md:text-xl font-light text-gray-400 max-w-4xl mx-auto leading-relaxed tracking-wide"
                    style={{ fontFamily: "var(--font-body)" }}
                >
                    The universe has favorites. Be one of them. <br />
                    <span className="text-white border-b border-[#FFD700]">We map your personal &apos;God Mode&apos; cycles so you never waste energy on a bad day again.</span>
                </motion.p>

                {/* CTA */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    onClick={openModal}
                    className="mt-12 px-8 py-4 bg-[#FFD700] text-[#12011A] font-bold font-mono text-lg uppercase tracking-widest hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                >
                    See My Decision Map
                </motion.button>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#FFD700]/60 uppercase">Scroll to Disintegrate</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#FFD700] to-transparent"></div>
            </motion.div>
        </section>
    );
}
