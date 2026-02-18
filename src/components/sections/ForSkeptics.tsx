"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

export default function ForSkeptics() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

    return (
        <section ref={containerRef} className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center py-32 px-6 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>

            {/* Floating 'Logic' Symbols */}
            <motion.div style={{ y, rotate }} className="absolute top-20 right-10 text-[#FFD700] opacity-5 text-9xl font-serif select-none pointer-events-none">
                ?
            </motion.div>
            <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }} className="absolute bottom-20 left-10 text-red-500 opacity-5 text-9xl font-mono select-none pointer-events-none">
                !
            </motion.div>

            <div className="max-w-4xl mx-auto z-10 text-center relative">
                {/* Glowing Line */}
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mb-12 mx-auto max-w-lg"
                />

                {/* Main Headline - Broken/Glitchy Vibe */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="font-serif text-5xl md:text-7xl text-white font-bold leading-none mb-8 tracking-tight"
                >
                    Skepticism is <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#E5E5E5] italic pr-2">Expensive.</span>
                </motion.h2>

                {/* Subtext container */}
                <div className="space-y-12 mb-16 relative">
                    {/* Perspective Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <SkepticCard
                            delay={0.1}
                            title="The Gravity Test"
                            content={
                                <>
                                    Gravity works without your consent. <br />
                                    So does Saturn. <br />
                                    <span className="text-[#FFD700] font-bold block mt-2">
                                        You don't have to believe in the pavement to break your bones when you land.
                                    </span>
                                </>
                            }
                        />
                        <SkepticCard
                            delay={0.2}
                            title="The Ego Trap"
                            content={
                                <>
                                    Thinking you're immune to cosmic cycles isn't intelligence. <br />
                                    <span className="text-white font-bold">It's arrogance.</span> <br />
                                    The market crashes whether you "believe" in economics or not. Your life crashes whether you believe in transits or not.
                                </>
                            }
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="p-8 border-y border-white/5 bg-white/5 backdrop-blur-sm"
                    >
                        <p className="font-mono text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            "Psychology maps the <span className="text-white border-b border-[#FFD700]">ghost in the machine</span>. <br />
                            Astrology maps the <span className="text-white border-b border-[#FFD700]">timing of the crash</span>."
                        </p>
                    </motion.div>
                </div>

                {/* Final Punchline */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <p className="font-serif text-2xl md:text-3xl text-white">
                        Ignorance is a choice. <br />
                        <span className="text-[#FFD700] font-style-italic">Pain is the receipt.</span>
                    </p>
                </motion.div>

            </div>
        </section>
    );
}

function SkepticCard({ title, content, delay }: { title: string, content: ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="group p-8 rounded-2xl border border-white/10 bg-[#0a020f] hover:border-[#FFD700]/50 hover:bg-[#12011A] transition-all duration-300 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-16 h-16 rounded-full border-2 border-[#FFD700] border-dashed animate-spin-slow"></div>
            </div>
            <h3 className="font-mono text-[#FFD700] text-sm uppercase tracking-widest mb-4">{title}</h3>
            <p className="font-sans text-gray-400 text-sm leading-relaxed decoration-clone">
                {content}
            </p>
        </motion.div>
    );
}
