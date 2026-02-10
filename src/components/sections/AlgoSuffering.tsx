"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AlgoSuffering() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

    return (
        <section ref={containerRef} className="relative min-h-[120vh] bg-[#12011A] flex items-center justify-center overflow-hidden py-24">
            {/* Matrix-like Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,1,26,0.9),rgba(18,1,26,0.9)),url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full px-6 z-10 items-center">
                {/* Logic Gate Visuals - Parallax Up */}
                <motion.div style={{ y: y1 }} className="space-y-6">
                    <div className="p-6 border border-[#FFD700]/30 bg-black/50 backdrop-blur-md rounded-lg transform translate-x-4">
                        <h4 className="font-mono text-[#FFD700] text-xs mb-2">THE TRIGGER</h4>
                        <p className="font-mono text-white text-sm">"I need them to like me."</p>
                    </div>
                    <div className="p-6 border border-[#FFD700]/30 bg-black/50 backdrop-blur-md rounded-lg transform -translate-x-4">
                        <h4 className="font-mono text-[#FFD700] text-xs mb-2">THE HABIT</h4>
                        <p className="font-mono text-white text-sm">Sacrifice boundaries. Plea for validation.</p>
                    </div>
                    <div className="p-6 border border-[#FFD700]/30 bg-black/50 backdrop-blur-md rounded-lg transform translate-x-4">
                        <h4 className="font-mono text-[#FFD700] text-xs mb-2">THE OUTCOME</h4>
                        <p className="font-mono text-white text-sm">Resentment. Rejection. Repeat.</p>
                    </div>
                </motion.div>

                {/* Text Block - Parallax Down */}
                <motion.div style={{ y: y2 }} className="text-right">
                    <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-8 leading-none">
                        Break the <br />
                        <span className="text-[#FFD700]">Loop</span>.
                    </h2>
                    <p className="font-serif text-xl text-gray-400 mb-6">
                        Your pain isn&apos;t destiny. It&apos;s just a bad habit you haven't identified yet.
                    </p>
                    <p className="font-mono text-sm text-gray-500 max-w-md ml-auto">
                        We pinpoint the exact moment your self-sabotage kicks in—and give you the psychological weapon to kill it.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
