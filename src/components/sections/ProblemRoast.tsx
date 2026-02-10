"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaGhost, FaMoneyBillWave, FaSkull } from "react-icons/fa";

export default function ProblemRoast() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const xLeft = useTransform(scrollYProgress, [0, 1], [-100, 50]);
    const xRight = useTransform(scrollYProgress, [0, 1], [100, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [0, 1, 0]);

    return (
        <section ref={containerRef} className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center py-24 relative overflow-hidden">

            {/* Background Chaos */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 text-[10rem] text-red-900 font-serif opacity-20">⚠</div>
                <div className="absolute bottom-10 right-10 text-[10rem] text-red-900 font-serif opacity-20">⚠</div>
                <div className="w-full h-full bg-[linear-gradient(45deg,transparent_45%,#FF0000_50%,transparent_55%)] bg-[size:20px_20px] opacity-10"></div>
            </div>

            <div className="max-w-6xl w-full px-6 z-10">
                <motion.div style={{ opacity }} className="text-center mb-20">
                    <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
                        The <span className="text-red-500 italic">Fear</span> Economy
                    </h2>
                    <p className="font-mono text-gray-400 text-lg max-w-2xl mx-auto uppercase tracking-widest">
                        Why your "popup astrologer" needs you to stay broken.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: The Trap */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="bg-[#12011A] border border-red-900/30 p-8 rounded-xl hover:border-red-500/50 transition-colors duration-300 group"
                    >
                        <FaGhost className="text-4xl text-red-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="font-serif text-2xl text-white mb-4">Monetized Anxiety</h3>
                        <p className="font-mono text-sm text-gray-500 leading-relaxed">
                            They tell you "Mercury is in Retrograde" so you buy a $47 protection candle.
                            It's not spirituality. It's a hostage situation.
                        </p>
                    </motion.div>

                    {/* Card 2: The Generic Pill */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-[#12011A] border border-red-900/30 p-8 rounded-xl hover:border-red-500/50 transition-colors duration-300 group"
                    >
                        <FaSkull className="text-4xl text-red-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="font-serif text-2xl text-white mb-4">Lethal Ambiguity</h3>
                        <p className="font-mono text-sm text-gray-500 leading-relaxed">
                            "You will face challenges today." <br />
                            <span className="text-white">Useless.</span> <br />
                            That applies to everyone from a CEO to a street dog. You need coordinates, not fortune cookies.
                        </p>
                    </motion.div>

                    {/* Card 3: The Upsell */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                        className="bg-[#12011A] border border-red-900/30 p-8 rounded-xl hover:border-red-500/50 transition-colors duration-300 group"
                    >
                        <FaMoneyBillWave className="text-4xl text-red-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="font-serif text-2xl text-white mb-4">Subscription Doom</h3>
                        <p className="font-mono text-sm text-gray-500 leading-relaxed">
                            If they solved your problem, you'd stop paying.
                            Their business model relies on you remaining confused, scared, and dependent.
                        </p>
                    </motion.div>
                </div>

                {/* Slogan Scroller */}
                <div className="mt-24 overflow-hidden relative">
                    <motion.div style={{ x: xLeft }} className="whitespace-nowrap">
                        <span className="font-serif text-[4rem] text-[#12011A] stroke-text font-bold opacity-30">
                            REJECT THE FEAR. REJECT THE FEAR. REJECT THE FEAR.
                        </span>
                    </motion.div>
                    <motion.div style={{ x: xRight }} className="whitespace-nowrap absolute top-0 left-0">
                        <span className="font-serif text-[4rem] text-transparent stroke-red font-bold opacity-30">
                            DEMAND THE DATA. DEMAND THE DATA. DEMAND THE DATA.
                        </span>
                    </motion.div>
                </div>
            </div>

            <style jsx global>{`
                .stroke-text {
                    -webkit-text-stroke: 1px #333;
                }
                .stroke-red {
                     -webkit-text-stroke: 1px #ff0000;
                }
            `}</style>
        </section>
    );
}
