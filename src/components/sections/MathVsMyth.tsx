"use client";

import { motion } from "framer-motion";
import { FaTimes, FaCheck } from "react-icons/fa";

export default function MathVsMyth() {
    return (
        <section className="min-h-[80vh] py-24 bg-[#FAFAF7] flex flex-col items-center justify-center px-4 relative overflow-hidden border-y border-[#1a1a1a]/5">
            {/* Background Glyphs (Decorative) */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center overflow-hidden text-[#1a1a1a]">
                <span className="text-[20rem] md:text-[30rem] font-serif leading-none rotate-12 blur-[2px]">ॐ</span>
                <span className="text-[20rem] md:text-[30rem] font-mono leading-none -rotate-12 absolute right-[-5%] blur-[2px]">∑</span>
            </div>

            <div className="z-10 w-full max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-5xl text-[#1a1a1a] mb-4 font-medium tracking-wide">Feelings vs. Facts.</h2>
                    <p className="font-[family-name:var(--font-space)] text-[#D4AF37] uppercase tracking-widest text-xs md:text-sm">Why generic horoscopes are useless</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Western / Myth Card */}
                    <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="p-8 md:p-10 rounded-[2rem] border border-[#1a1a1a]/5 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
                    >
                        <h3 className="font-[family-name:var(--font-display)] text-2xl mb-6 text-[#1a1a1a]/60 font-medium">Generic Pop-Astrology</h3>
                        <ul className="space-y-6 font-[family-name:var(--font-outfit)] text-base text-[#1a1a1a]/70">
                            <li className="flex items-start gap-4">
                                <span className="bg-red-50 text-red-600 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <FaTimes className="text-sm" />
                                </span>
                                <span>Sells you fear ("Mercury Retrograde is coming!")</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="bg-red-50 text-red-600 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <FaTimes className="text-sm" />
                                </span>
                                <span>Vague Compliments ("You're such a leader")</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="bg-red-50 text-red-600 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <FaTimes className="text-sm" />
                                </span>
                                <span>Treats you like a helpless victim of planetary weather.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="bg-red-50 text-red-600 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <FaTimes className="text-sm" />
                                </span>
                                <span>Keeps you addicted to daily external validation.</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Vedic / Math Card */}
                    <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="p-8 md:p-10 rounded-[2rem] border border-[#D4AF37]/40 bg-white shadow-[0_20px_50px_rgba(212,175,55,0.08)] relative overflow-hidden"
                    >
                        {/* Premium Gradient Top Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B]" />
                        
                        <div className="absolute top-0 right-8 bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-white text-[10px] font-bold px-4 pt-4 pb-2 rounded-b-lg shadow-md uppercase tracking-[0.2em] font-[family-name:var(--font-space)]">
                            Our Advantage
                        </div>
                        <h3 className="font-[family-name:var(--font-display)] text-3xl mb-6 text-[#1a1a1a] font-medium pt-2">Forensic Precision</h3>
                        <ul className="space-y-6 font-[family-name:var(--font-outfit)] text-base text-[#1a1a1a]/80">
                            <li className="flex items-start gap-4">
                                <span className="bg-green-50 text-green-700 border border-green-200 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <FaCheck className="text-sm" />
                                </span>
                                <span className="font-medium">Identifies unyielding mathematical truths.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="bg-green-50 text-green-700 border border-green-200 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <FaCheck className="text-sm" />
                                </span>
                                <span>Exposes brutal behavioral weaknesses so you can finally fix them.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="bg-green-50 text-green-700 border border-green-200 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <FaCheck className="text-sm" />
                                </span>
                                <span>Provides exact timeline coordinates for strategic strikes.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="bg-green-50 text-green-700 border border-green-200 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <FaCheck className="text-sm" />
                                </span>
                                <span>Optimizes macro-decisions for exponential personal ROI.</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
