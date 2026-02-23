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
                <div className="absolute top-10 left-10 text-[10rem] text-[#FFD700] font-serif opacity-10">✦</div>
                <div className="absolute bottom-10 right-10 text-[10rem] text-[#FFD700] font-serif opacity-10">✦</div>
                <div className="w-full h-full bg-[linear-gradient(45deg,transparent_45%,#FFD700_50%,transparent_55%)] bg-[size:20px_20px] opacity-10"></div>
            </div>

            <div className="max-w-6xl w-full px-6 z-10">
                <motion.div style={{ opacity }} className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl text-white mb-6 uppercase tracking-tighter" style={{ fontFamily: "var(--font-unbounded)" }}>
                        The <span className="text-[#FFD700] italic">Fear</span> Economy
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
                        className="bg-[#12011A] border border-[#FFD700]/20 p-8 rounded-xl hover:border-[#FFD700]/60 transition-colors duration-300 group shadow-[0_0_15px_rgba(255,215,0,0.05)] hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                    >
                        <FaGhost className="text-4xl text-[#FFD700] mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="font-serif text-2xl text-white mb-4">Monetized Anxiety</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-light mt-4" style={{ fontFamily: "var(--font-manrope)" }}>
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
                        className="bg-[#12011A] border border-[#FFD700]/20 p-8 rounded-xl hover:border-[#FFD700]/60 transition-colors duration-300 group shadow-[0_0_15px_rgba(255,215,0,0.05)] hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                    >
                        <FaSkull className="text-4xl text-[#FFD700] mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="font-serif text-2xl text-white mb-4">Lethal Ambiguity</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-light mt-4" style={{ fontFamily: "var(--font-manrope)" }}>
                            "You will face challenges today." <br />
                            <span className="text-white mt-2 block font-semibold italic">Useless.</span>
                            That applies to everyone from a CEO to a street dog. You need coordinates, not fortune cookies.
                        </p>
                    </motion.div>

                    {/* Card 3: The Upsell */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                        className="bg-[#12011A] border border-[#FFD700]/20 p-8 rounded-xl hover:border-[#FFD700]/60 transition-colors duration-300 group shadow-[0_0_15px_rgba(255,215,0,0.05)] hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                    >
                        <FaMoneyBillWave className="text-4xl text-[#FFD700] mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="font-serif text-2xl text-white mb-4">Subscription Doom</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-light mt-4" style={{ fontFamily: "var(--font-manrope)" }}>
                            If they solved your problem, you'd stop paying.
                            Their business model relies on you remaining confused, scared, and dependent.
                        </p>
                    </motion.div>
                </div>

                {/* Slogan Scroller */}
                <div className="mt-24 overflow-hidden relative">
                    <motion.div style={{ x: xLeft }} className="whitespace-nowrap">
                        <span className="text-[4rem] text-[#12011A] stroke-text font-bold opacity-30 tracking-tighter" style={{ fontFamily: "var(--font-unbounded)" }}>
                            REJECT THE FEAR. REJECT THE FEAR. REJECT THE FEAR.
                        </span>
                    </motion.div>
                    <motion.div style={{ x: xRight }} className="whitespace-nowrap absolute top-0 left-0">
                        <span className="text-[4rem] text-transparent stroke-danger fade-danger font-bold tracking-tighter" style={{ fontFamily: "var(--font-unbounded)" }}>
                            DEMAND THE DATA. DEMAND THE DATA. DEMAND THE DATA.
                        </span>
                    </motion.div>
                </div>
            </div>

            <style jsx global>{`
                .stroke-text {
                    -webkit-text-stroke: 1px #333;
                }
                .stroke-danger {
                     -webkit-text-stroke: 2px rgba(255, 0, 0, 0.4);
                     text-shadow: 0 0 15px rgba(255, 0, 0, 0.6), 0 0 30px rgba(255, 0, 0, 0.3);
                }
                .fade-danger {
                    opacity: 0.6;
                    filter: blur(1px);
                }
            `}</style>
        </section>
    );
}
