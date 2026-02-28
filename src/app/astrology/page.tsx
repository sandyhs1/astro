"use client";

import React from "react";
import { motion } from "framer-motion";
import TheVoid from "@/components/sections/TheVoid";
import { useOnboarding } from "@/context/OnboardingContext";
import { FaBookOpen, FaBrain, FaBalanceScaleRight, FaGlobe, FaEye, FaHandSparkles } from "react-icons/fa";

export default function Astrology() {
    const { openModal } = useOnboarding();

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#FFD700] selection:text-[#050505] font-sans">
            {/* 1. HERO: THE REFLECTION */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a0b2e] via-[#050505] to-[#000] opacity-60"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

                <div className="z-10 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <FaEye className="text-[#FFD700] mx-auto text-4xl mb-6 opacity-80" />
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600 uppercase">
                            THE PLANETS DO NOT <br /> CONTROL YOU. <br />
                            <span className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">THEY REFLECT YOU.</span>
                        </h1>
                        <p className="font-mono text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                            There is no bearded man in the sky moving Jupiter to destroy your marriage. <br className="hidden md:block" />
                            The planets are mirrors of your accumulated karma.<br className="hidden md:block" />
                            <span className="text-white font-bold border-b border-[#FFD700] pb-1">You are the object in the mirror.</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. PREMIUM SECTION: CARL JUNG */}
            <section className="py-24 px-6 relative z-10 border-t border-[#FFD700]/20 bg-gradient-to-b from-[#12011A] to-black">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <FaBrain className="text-[#FFD700] text-4xl mb-6" />
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            The Architect of the <br /> <span className="text-[#FFD700]">Modern Mind</span>
                        </h2>
                        <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-8 border-l-2 border-[#FFD700] pl-3">
                            The Psychoanalytical Endorsement
                        </h3>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6 font-light">
                            Carl Jung, the father of modern analytical psychology, did not view astrology as a myth. He viewed it as the ancient blueprint of the human subconscious.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed font-light">
                            When faced with psychologically difficult or dead-end cases, Jung would routinely draw up a patient's astrological chart. He recognized that the positions of the planets mapped perfectly to the <strong className="text-white">archetypes</strong> residing deep within the human psyche. What we call "destiny" is simply the subconscious playing out in physical reality.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-[#FFD700] blur-[100px] opacity-10 rounded-full"></div>
                        <div className="bg-black/50 border border-[#FFD700]/30 p-10 md:p-14 rounded-2xl relative backdrop-blur-sm shadow-[0_0_50px_rgba(255,215,0,0.05)]">
                            <span className="absolute -top-6 left-10 text-[6rem] text-[#FFD700] font-serif leading-none opacity-20">"</span>
                            <blockquote className="relative z-10 text-2xl md:text-3xl font-serif text-white italic leading-snug mb-8">
                                "Astrology represents the sum of all the psychological knowledge of antiquity."
                            </blockquote>
                            <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                                <div>
                                    <p className="text-[#FFD700] font-bold font-serif text-xl">Dr. Carl Jung</p>
                                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mt-1">Pioneer of Analytical Psychology</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. THE COMMERCIALIZATION SCAM VS THE SACRED SCIENCE */}
            <section className="py-32 px-6 bg-[#050505] border-t border-white/5">
                <div className="max-w-6xl mx-auto text-center mb-20">
                    <FaGlobe className="text-gray-600 text-4xl mx-auto mb-6" />
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                        The Great Commercial Scam
                    </h2>
                    <p className="font-mono text-sm uppercase tracking-widest text-red-500">
                        Pop-Psychology vs. Sacred Mathematics
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-black border border-white/10 p-10 rounded-xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-800"></div>
                        <h3 className="font-serif text-2xl text-white mb-4">The Dilution (Pop-Astrology)</h3>
                        <p className="text-gray-400 font-light leading-relaxed mb-6">
                            Daily horoscopes in magazines, generic "Sun Sign" memes, and apps telling you that you'll meet the love of your life on Tuesday. This is the tragic commercialization of a sacred science. It was designed to generate clicks, sell advertisements, and provide cheap dopamine hits.
                        </p>
                        <p className="text-red-400/80 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Result: Loss of Trust.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#12011A] border border-[#FFD700]/30 p-10 rounded-xl relative overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.03)]"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#FFD700]"></div>
                        <h3 className="font-serif text-2xl text-white mb-4">The Authority (Jyotish)</h3>
                        <p className="text-gray-300 font-light leading-relaxed mb-6">
                            True Vedic Astrology (Jyotish) is an astronomically precise mathematical model of space and time. It maps planetary geometries against your exact millisecond of birth to read the karmic ledger of your soul. It does not deal in vague platitudes; it deals in surgical timings and brutal realities.
                        </p>
                        <p className="text-[#FFD700]/80 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></span>
                            Result: Absolute Clarity.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 4. THE KARMIC ENGINE (DISCLAIMER) */}
            <section className="py-32 px-6 bg-black border-t border-[#222]">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <FaBalanceScaleRight className="text-[#FFD700] text-5xl mx-auto mb-8" />
                        <h2 className="font-serif text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                            THE KARMIC ENGINE
                        </h2>

                        <div className="text-left bg-[#0a000f] border border-white/10 p-8 md:p-12 rounded-2xl mb-12 relative shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                            <h3 className="font-mono text-sm uppercase text-[#FFD700] mb-6 tracking-widest border-b border-white/10 pb-4">
                                // MANDATORY DISCLAIMER UNDER VEDIC LAW
                            </h3>
                            <p className="text-xl md:text-2xl font-serif text-white mb-8 leading-snug">
                                There is no God sitting in the sky, arbitrarily controlling your life like a puppet on strings. <strong className="text-[#FFD700]">The full control is with you.</strong>
                            </p>

                            <div className="space-y-6 text-gray-400 font-light leading-relaxed">
                                <p>
                                    According to absolute Indian Vedic Scriptures, a birth chart is not a randomized curse or blessing. It is the precise receipt of your <strong className="text-white">Accumulated Karma (Sanchita Karma)</strong>.
                                </p>
                                <p>
                                    When the planets align to trigger a specific event in this lifetime, that is your <strong className="text-white">Active Karma (Prarabdha Karma)</strong>. It is the situation you are forced to face.
                                </p>
                                <div className="p-6 bg-white/[0.03] rounded-lg mt-8 border-l-2 border-[#FFD700]">
                                    <p className="text-gray-200">
                                        <strong className="text-[#FFD700]">THE FREE WILL PROTOCOL:</strong> How you react to these scripted situations is what paves your future ahead. Your daily choices, discipline, and reactions build your new, future karma (<strong className="text-white">Agami Karma</strong>).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="font-serif text-2xl text-gray-500 italic mb-12">
                            The chart reveals the battlefield. You choose how to swing the sword.
                        </p>

                        <button
                            onClick={openModal}
                            className="px-12 py-5 bg-white text-black font-bold text-lg md:text-xl uppercase tracking-widest hover:bg-[#FFD700] hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 mx-auto"
                        >
                            <FaHandSparkles /> Analyze My Karma
                        </button>
                    </motion.div>
                </div>
            </section>

            <TheVoid />
        </main>
    );
}
