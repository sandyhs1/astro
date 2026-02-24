"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function TheMirror() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.2, 0.5], [0.8, 1]);

    return (
        <section
            ref={containerRef}
            className="min-h-screen flex items-center justify-center bg-[#0d0012] relative overflow-hidden py-24"
        >
            <div className="max-w-4xl mx-auto px-6 text-center z-10">
                <motion.div style={{ opacity, scale }}>
                    <h2 className="text-4xl md:text-6xl lg:text-[5rem] text-[#FBFBFB] leading-[1.1] tracking-tight font-medium" style={{ fontFamily: "var(--font-display)" }}>
                        You don&apos;t make <span className="text-white/40 italic">bad</span> decisions. <br />
                        You make the <span className="relative inline-block mt-2">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFF8D6] pr-2">right decisions</span>
                            <span className="absolute bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></span>
                        </span> <br />
                        at the wrong time.
                    </h2>

                    <div className="mt-16 p-8 border border-[#FFD700]/20 bg-[#12011A]/80 backdrop-blur-sm rounded-lg">
                        <p className="font-mono text-gray-300 text-lg uppercase tracking-wider mb-4 border-b border-[#FFD700]/20 pb-4">
                            Reality Check
                        </p>
                        <p className="font-serif text-xl italic text-gray-400">
                            Your birth chart isn’t predicting events - it reveals how you repeatedly create them.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Ambient particles or glitch effect could go here */}
        </section>
    );
}
