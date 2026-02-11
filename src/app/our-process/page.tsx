"use client";

import React from "react";
import { motion } from "framer-motion";
import TheVoid from "@/components/sections/TheVoid";

export default function OurProcess() {
    return (
        <main className="min-h-screen bg-[#12011A] text-white selection:bg-[#FFD700] selection:text-[#12011A] font-mono">
            {/* Header */}
            <section className="py-32 px-6 text-center border-b border-[#333]">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="font-serif text-5xl md:text-8xl font-bold mb-6"
                >
                    DECODING THE <br /><span className="text-[#FFD700]">ALGORITHM</span>
                </motion.h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    We don't do "vibes." We calculate coordinates. <br />
                    Here is exactly how we dismantle your ego and reconstruct your potential.
                </p>
            </section>

            {/* The Process Steps */}
            <section className="py-24 px-6 max-w-6xl mx-auto">
                <div className="space-y-24">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row gap-12 items-start group">
                        <div className="font-serif text-8xl text-[#333] group-hover:text-[#FFD700] transition-colors duration-500">01</div>
                        <div>
                            <h2 className="text-3xl font-bold mb-4 font-serif">RAW DATA INGESTION</h2>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                We take your exact birth coordinates (Latitude, Longitude, Time). A difference of 4 minutes changes the Ascendant degree, altering the entire house system. We align your birth moment with the NASA Jet Propulsion Laboratory ephemeris data.
                            </p>
                            <div className="bg-[#0f0f0f] p-4 border border-[#333] font-mono text-xs text-green-500">
                                {`> INITIATING SEQUENCE...`} <br />
                                {`> CALCULATING: 40.7128° N, 74.0060° W`} <br />
                                {`> TIME CORRECTION: UTC-5`} <br />
                                {`> PLANETARY POSITIONS LOCKED.`}
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row gap-12 items-start group">
                        <div className="font-serif text-8xl text-[#333] group-hover:text-[#FFD700] transition-colors duration-500">02</div>
                        <div>
                            <h2 className="text-3xl font-bold mb-4 font-serif">INTERPLANETARY GEOMETRY</h2>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                We calculate the angular relationships (Aspects) between planets. This isn't poetry; it's geometry. A Square (90°) creates tension and drive. A Trine (120°) creates flow and talent. We map the friction and the grease in your engine.
                            </p>
                            <div className="bg-[#0f0f0f] p-4 border border-[#333] font-mono text-xs text-[#FFD700]">
                                {`> DETECTED: SATURN SQUARE MARS`} <br />
                                {`> IMPACT: HIGH FRICTION / HIGH AMBITION`} <br />
                                {`> STATUS: CRITICAL DRIVE MECHANISM`}
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row gap-12 items-start group">
                        <div className="font-serif text-8xl text-[#333] group-hover:text-[#FFD700] transition-colors duration-500">03</div>
                        <div>
                            <h2 className="text-3xl font-bold mb-4 font-serif">TEMPORAL MAPPING (DASHAS)</h2>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Using the Vimshottari Dasha system, we project your verified timeline. We don't guess "when." We know "when." We map your peak career cycles, your relationship failures, and your spiritual awakenings down to the month.
                            </p>
                            <ul className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                <li className="border border-[#333] p-2">JUPITER CYCLE: EXPANSION</li>
                                <li className="border border-[#333] p-2">SATURN CYCLE: RESTRICTION</li>
                                <li className="border border-[#333] p-2">RAHU CYCLE: OBSESSION</li>
                                <li className="border border-[#333] p-2">KETU CYCLE: DETACHMENT</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Example Section */}
            <section className="py-24 bg-[#0a000f] border-t border-[#333]">
                <div className="container mx-auto px-6">
                    <h2 className="font-serif text-4xl text-center mb-16">CASE STUDY: THE EXECUTIVE</h2>
                    <div className="max-w-4xl mx-auto bg-[#12011A] border border-[#333] p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 bg-[#FFD700] text-[#12011A] font-bold text-xs uppercase tracking-widest">
                            ANONYMIZED DATA
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-gray-500 text-sm tracking-widest mb-2">THE INPUT</h3>
                                <p className="text-white text-lg mb-6">"I feel stuck despite making $300k/year. High anxiety. Zero satisfaction."</p>

                                <h3 className="text-gray-500 text-sm tracking-widest mb-2">THE DIAGNOSIS</h3>
                                <p className="text-gray-400 mb-4">
                                    Chart revealed a <span className="text-[#FFD700]">Ketu Mahadasha</span> (Period of Detachment) activating the 10th House (Career).
                                </p>
                                <p className="text-gray-400">
                                    The anxiety wasn't failure; it was a cosmic signal to pivot from "Accumulation" to "Dissemination."
                                </p>
                            </div>
                            <div className="flex flex-col justify-center border-l border-[#333] pl-8">
                                <h3 className="text-gray-500 text-sm tracking-widest mb-4">THE STRATEGY</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4 text-gray-300">
                                        <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
                                        Pivot role to mentorship/advisory
                                    </li>
                                    <li className="flex items-center gap-4 text-gray-300">
                                        <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
                                        Initiate spiritual practice (Meditation)
                                    </li>
                                    <li className="flex items-center gap-4 text-gray-300">
                                        <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
                                        Wait for Venus Sub-period (6 months)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <TheVoid />
        </main>
    );
}
