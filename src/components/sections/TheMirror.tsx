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
                    <h2 className="font-serif text-4xl md:text-6xl text-[#EFCAFF] leading-snug mb-8">
                        You don’t make bad decisions. <br />
                        You make the <span className="text-[#FFD700] underline decoration-1 underline-offset-8">right decisions</span> <br />
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
