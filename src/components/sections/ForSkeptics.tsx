"use client";

import { motion } from "framer-motion";

export default function ForSkeptics() {
    return (
        <section className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden">
            {/* Subtle background grid */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#FFD700_1px,transparent_1px),linear-gradient(to_bottom,#FFD700_1px,transparent_1px)] bg-[size:60px_60px]"></div>

            <div className="max-w-3xl mx-auto z-10 text-center">
                {/* Section label */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="font-mono text-[#FFD700] text-xs tracking-[0.4em] uppercase mb-8"
                >
                    For Skeptics
                </motion.p>

                {/* Main headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="font-serif text-4xl md:text-6xl text-white font-bold leading-tight mb-6"
                >
                    You don&apos;t need to{" "}
                    <span className="text-[#FFD700]">believe</span> in astrology.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="font-mono text-xl text-gray-400 mb-16"
                >
                    You only need to notice <span className="text-white">patterns</span>.
                </motion.p>

                {/* Content blocks */}
                <div className="space-y-10 text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="border-l-2 border-[#FFD700]/40 pl-6"
                    >
                        <p className="font-mono text-gray-400 text-lg leading-relaxed">
                            Psychology tracks <span className="text-white">behavior</span>.<br />
                            Astrology tracks <span className="text-white">behavioral timing</span>.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="border-l-2 border-[#FFD700]/40 pl-6"
                    >
                        <p className="font-mono text-gray-400 text-lg leading-relaxed">
                            We&apos;re not claiming stars control you.<br />
                            We&apos;re showing when your <span className="text-white">decision-making changes</span> — predictably.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="border-l-2 border-[#FFD700]/40 pl-6"
                    >
                        <p className="font-mono text-gray-400 text-lg leading-relaxed">
                            Treat it like <span className="text-white">weather data for human behavior</span>.
                        </p>
                    </motion.div>

                    {/* Final punchline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="mt-12 p-8 border border-[#FFD700]/20 bg-[#12011A]/80 backdrop-blur-sm rounded-xl"
                    >
                        <p className="font-serif text-2xl md:text-3xl text-white leading-snug">
                            You still <span className="text-[#FFD700] italic">choose</span>.<br />
                            You just stop choosing <span className="text-[#FFD700] italic">blind</span>.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
