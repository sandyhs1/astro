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
            {/* Looping Hypnotic Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_90deg_at_50%_50%,#050010_0%,#300060_50%,#050010_100%)] opacity-40 mix-blend-screen"
                ></motion.div>
                
                <motion.div animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.2)_0%,transparent_60%)]"></motion.div>
                
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)_translateZ(-200px)] opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: '100vh', x: (Math.random() - 0.5) * 500 }}
                        animate={{ y: '-20vh', x: (Math.random() - 0.5) * 500, opacity: [0, 0.6, 0] }}
                        transition={{ duration: Math.random() * 8 + 6, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
                        className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#FFD700] mix-blend-screen shadow-[0_0_10px_rgba(255,215,0,0.8)]"
                        style={{ left: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>
            {/* Color Overlay for Text Readability */}
            <div className="absolute inset-0 bg-[#05000a]/70 z-0"></div>

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
