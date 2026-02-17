"use client";

import { motion } from "framer-motion";
import { FaTimes, FaCheck } from "react-icons/fa";

export default function MathVsMyth() {
    return (
        <section className="min-h-screen py-24 bg-[#0a020f] flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background Glyphs (Decorative) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center overflow-hidden">
                <span className="text-[20rem] font-serif leading-none rotate-12">ॐ</span>
                <span className="text-[20rem] font-mono leading-none -rotate-12 absolute right-0">∑</span>
            </div>

            <div className="z-10 w-full max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-6xl text-white mb-4">Feelings vs. Facts.</h2>
                    <p className="font-mono text-[#FFD700] uppercase tracking-widest">Why your horoscope is useless</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Western / Myth Card */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
                    >
                        <h3 className="font-serif text-3xl mb-6 text-gray-400">Generic Pop-Astrology</h3>
                        <ul className="space-y-4 font-mono text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <FaTimes className="mt-1 text-red-500 shrink-0" />
                                <span>Sells you fear ("Mercury Retrograde is coming!")</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaTimes className="mt-1 text-red-500 shrink-0" />
                                <span>Vague Compliments ("You're such a leader")</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaTimes className="mt-1 text-red-500 shrink-0" />
                                <span>Treats you like a victim of the stars.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaTimes className="mt-1 text-red-500 shrink-0" />
                                <span>Keeps you addicted to daily validation.</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Vedic / Math Card */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-xl border border-[#FFD700] bg-[#12011A] shadow-[0_0_30px_rgba(255,215,0,0.1)] relative"
                    >
                        <div className="absolute -top-3 right-8 bg-[#FFD700] text-[#12011A] text-xs font-bold px-3 py-1 uppercase tracking-wider">
                            The SoulSync Advantage
                        </div>
                        <h3 className="font-serif text-3xl mb-6 text-white">Quantum Karma Precision</h3>
                        <ul className="space-y-4 font-mono text-sm text-white">
                            <li className="flex items-start gap-3">
                                <FaCheck className="mt-1 text-[#FFD700] shrink-0" />
                                <span>Gives you tactical timelines ("Act on Nov 12").</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheck className="mt-1 text-[#FFD700] shrink-0" />
                                <span>Exposes your brutal weaknesses so you fix them.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheck className="mt-1 text-[#FFD700] shrink-0" />
                                <span>Hands you the weapon to fight back.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheck className="mt-1 text-[#FFD700] shrink-0" />
                                <span>Optimizes your life for maximum ROI.</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
