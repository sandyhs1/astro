"use client";

import React from "react";
import { motion } from "framer-motion";
import TheVoid from "@/components/sections/TheVoid";

export default function Myths() {
    return (
        <main className="min-h-screen bg-[#12011A] text-white selection:bg-[#FFD700] selection:text-[#12011A]">
            {/* Header */}
            <section className="py-32 px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-5xl md:text-8xl font-bold mb-6 text-red-500"
                >
                    LIES YOU WERE TOLD.
                </motion.h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg font-mono">
                    You think astrology is vague because you read a generic horoscope in a newspaper. <br />
                    That's like judging oceanography by looking at a glass of water.
                </p>
            </section>

            {/* Myths Breakdown */}
            <section className="py-12 px-6 max-w-5xl mx-auto space-y-16">

                {/* Myth 1 */}
                <div className="border border-[#333] p-8 md:p-12 hover:border-red-500/50 transition-colors group">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-red-900/20 text-red-500 font-mono text-xs px-2 py-1 uppercase tracking-widest border border-red-900/50">Myth #01</span>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-300 group-hover:text-white transition-colors">"ASTROLOGY IS VAGUE & GENERIC (BARNUM EFFECT)"</h2>
                    </div>
                    <p className="font-mono text-gray-400 leading-relaxed mb-6">
                        <strong className="text-white">THE LIE:</strong> Astrologers use broad statements like "You work hard" that apply to everyone.
                    </p>
                    <p className="font-mono text-gray-400 leading-relaxed">
                        <strong className="text-[#FFD700]">THE TRUTH:</strong> Real astrology is terrifyingly specific. Your chart is a mathematical fingerprint calculated from the exact position of planets at your birth second. We don't say "You work hard." We say "Saturn in your 10th house indicates a career delay until age 32, followed by a rapid ascent in authority roles involving structure or government."
                    </p>
                </div>

                {/* Myth 2 */}
                <div className="border border-[#333] p-8 md:p-12 hover:border-red-500/50 transition-colors group">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-red-900/20 text-red-500 font-mono text-xs px-2 py-1 uppercase tracking-widest border border-red-900/50">Myth #02</span>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-300 group-hover:text-white transition-colors">"IT'S NOT SCIENTIFIC"</h2>
                    </div>
                    <p className="font-mono text-gray-400 leading-relaxed mb-6">
                        <strong className="text-white">THE LIE:</strong> There is no physical mechanism for planets to affect humans.
                    </p>
                    <p className="font-mono text-gray-400 leading-relaxed">
                        <strong className="text-[#FFD700]">THE TRUTH:</strong> The moon moves billions of tons of ocean water daily. The sun's solar flares disrupt global communications satellites. You live in a soup of electromagnetic fields and gravitational waves. To assume biology is immune to physics is the ultimate arrogance.
                    </p>
                </div>

                {/* Myth 3 */}
                <div className="border border-[#333] p-8 md:p-12 hover:border-red-500/50 transition-colors group">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-red-900/20 text-red-500 font-mono text-xs px-2 py-1 uppercase tracking-widest border border-red-900/50">Myth #03</span>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-300 group-hover:text-white transition-colors">"IT'S FATALISTIC"</h2>
                    </div>
                    <p className="font-mono text-gray-400 leading-relaxed mb-6">
                        <strong className="text-white">THE LIE:</strong> Astrology says you have no free will.
                    </p>
                    <p className="font-mono text-gray-400 leading-relaxed">
                        <strong className="text-[#FFD700]">THE TRUTH:</strong> Your chart is the terrain; you are the driver. If your chart shows "accident prone," you don't stop driving—you drive carefully. We don't predict your death; we predict the weather of your life. You decide whether to bring an umbrella.
                    </p>
                </div>

            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <p className="font-serif text-2xl italic text-gray-500 mb-8">
                    "Millionaires don't use astrology, billionaires do." <br /> — J.P. Morgan
                </p>
            </section>

            <TheVoid />
        </main>
    );
}
