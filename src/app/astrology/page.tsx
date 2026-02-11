"use client";

import React from "react";
import { motion } from "framer-motion";
import TheVoid from "@/components/sections/TheVoid";
import { useOnboarding } from "@/context/OnboardingContext";

export default function Astrology() {
    const { openModal } = useOnboarding();

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#FFD700] selection:text-[#050505] font-sans">

            {/* 1. HERO: THE REFLECTION */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a0b2e] via-[#050505] to-[#000] opacity-60"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

                <div className="z-10 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-serif text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600">
                            THE PLANETS DO NOT <br /> CONTROL YOU. <br />
                            <span className="text-[#FFD700]">THEY REFLECT YOU.</span>
                        </h1>
                        <p className="font-mono text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                            There is no bearded man in the sky moving Jupiter to destroy your marriage. <br />
                            The planets are mirrors. <br />
                            <span className="text-white font-bold border-b border-[#FFD700]">You are the object in the mirror.</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. THE MECHANISM (SCIENCE & MYTH BUSTING) */}
            <section className="py-32 px-6 bg-black border-t border-[#222]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-24 text-white">
                        HOW IT ACTUALLY WORKS
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* 1. The Physics */}
                        <div className="group border border-[#222] p-8 hover:border-[#FFD700] transition-colors duration-500 bg-[#0a0a0a]">
                            <div className="text-[#FFD700] font-mono text-4xl mb-6">01.</div>
                            <h3 className="font-serif text-2xl text-white mb-4">GRAVITY & FIELDS</h3>
                            <p className="font-mono text-gray-400 text-sm leading-relaxed">
                                The moon moves billions of tons of ocean water daily. You are 70% water.
                                The sun's solar flares disrupt global communication grids. You are a bio-electrical nervous system.
                                To think you are immune to these massive electromagnetic fields is biological arrogance.
                            </p>
                        </div>

                        {/* 2. The Mirror */}
                        <div className="group border border-[#222] p-8 hover:border-[#FFD700] transition-colors duration-500 bg-[#0a0a0a]">
                            <div className="text-[#FFD700] font-mono text-4xl mb-6">02.</div>
                            <h3 className="font-serif text-2xl text-white mb-4">AS ABOVE, SO BELOW</h3>
                            <p className="font-mono text-gray-400 text-sm leading-relaxed">
                                The universe is fractal. The pattern of the macro (solar system) repeats in the micro (your atomic structure/psychology).
                                We don't look at Mars to blame it for your anger. We look at Mars to see <em>where</em> your anger is currently magnified.
                            </p>
                        </div>

                        {/* 3. The Controller */}
                        <div className="group border border-[#222] p-8 hover:border-[#FFD700] transition-colors duration-500 bg-[#0a0a0a]">
                            <div className="text-[#FFD700] font-mono text-4xl mb-6">03.</div>
                            <h3 className="font-serif text-2xl text-white mb-4">NO FATE. ONLY PROBABILITY.</h3>
                            <p className="font-mono text-gray-400 text-sm leading-relaxed">
                                Astrology is not a script; it is a weather report.
                                If the forecast says "Rain," you aren't destined to get wet. You can use an umbrella.
                                Your free will determines how you play the hand you are dealt.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. THE PLAYERS (PLANETS DEEP DIVE) */}
            <section className="py-32 px-6 bg-[#080808] border-t border-[#222]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-6xl text-center mb-16 text-white">
                        MEET THE BOARD OF DIRECTORS
                    </h2>
                    <p className="font-mono text-center text-gray-500 mb-24 max-w-2xl mx-auto">
                        These are not gods. They are psychological archetypes that live inside your head.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: "SUN", role: "THE CEO", desc: "Your Soul. Your Ego. Your Father. Where you shine and want validation." },
                            { name: "MOON", role: "THE MIND", desc: "Your Emotions. Your Mother. Your Peace. How you perceive reality." },
                            { name: "MARS", role: "THE GENERAL", desc: "Your Drive. Your Aggression. Your Logic. How you fight for what you want." },
                            { name: "MERCURY", role: "THE MESSENGER", desc: "Your Intellect. Your Communication. Your Data Processing." },
                            { name: "JUPITER", role: "THE GURU", desc: "Your Wisdom. Your Luck. Your Expansion. Where you find easy growth." },
                            { name: "VENUS", role: "THE ARTIST", desc: "Your Desire. Your Love. Your Comfort. What you value and enjoy." },
                            { name: "SATURN", role: "THE JUDGE", desc: "Your Discipline. Your Fear. Your Delay. The harsh teacher that builds mastery." },
                            { name: "RAHU", role: "THE REBEL", desc: "Your Obsession. Your Ambition. The smoke that blinds you to get what you want." },
                            { name: "KETU", role: "THE MONK", desc: "Your Detachment. Your Past Lives. Spiritual liberation through loss." }
                        ].map((planet, index) => (
                            <div key={index} className="bg-[#121212] p-8 border border-[#333] hover:border-[#FFD700] transition-all hover:-translate-y-1">
                                <div className="flex justify-between items-end mb-4 border-b border-[#333] pb-4">
                                    <h3 className="font-serif text-3xl text-white">{planet.name}</h3>
                                    <span className="font-mono text-xs text-[#FFD700] uppercase tracking-widest">{planet.role}</span>
                                </div>
                                <p className="font-mono text-gray-400 text-sm leading-relaxed">
                                    {planet.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. THE STAGE (HOUSES) & COSTUMES (SIGNS) */}
            <section className="py-32 px-6 bg-black border-t border-[#222]">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24">

                    {/* HOUSES */}
                    <div>
                        <h2 className="font-serif text-3xl text-white mb-8 border-l-4 border-[#FFD700] pl-6">THE STAGE (12 HOUSES)</h2>
                        <p className="font-mono text-gray-400 mb-8 leading-relaxed">
                            If Planets are the actors, Houses are the <strong>scenes</strong> where they perform. Mars in the 1st House is an aggressive personality. Mars in the 7th House is an aggressive partner.
                        </p>
                        <ul className="space-y-4 font-mono text-sm text-gray-500">
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">1H</span> Self, Body, Personality</li>
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">2H</span> Wealth, Family, Speech</li>
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">3H</span> Courage, Siblings, Effort</li>
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">4H</span> Mother, Home, Happiness</li>
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">5H</span> Love, Children, Speculation</li>
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">6H</span> Debt, Disease, Enemies</li>
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">7H</span> Marriage, Partnership, Trade</li>
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">8H</span> Occult, Sudden Gains, Death</li>
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">9H</span> Dharma, Luck, Guru</li>
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">10H</span> Career, Fame, Father</li>
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">11H</span> Gains, Friends, Network</li>
                            <li className="flex gap-4"><span className="text-[#FFD700] font-bold w-8">12H</span> Loss, Sleep, Spirituality</li>
                        </ul>
                    </div>

                    {/* ZODIAC */}
                    <div>
                        <h2 className="font-serif text-3xl text-white mb-8 border-l-4 border-red-500 pl-6">THE COSTUME (12 SIGNS)</h2>
                        <p className="font-mono text-gray-400 mb-8 leading-relaxed">
                            The Zodiac Signs are simply the <strong>filters</strong> or costumes the planets wear. Mars (The Soldier) in Aries (Fire) is a Special Forces Commando. Mars in Cancer (Water) is a passive-aggressive emotional protector.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border border-[#333] p-4">
                                <h4 className="font-bold text-white mb-2">FIRE SIGNS</h4>
                                <p className="text-xs text-gray-500">Aries, Leo, Sagittarius. <br /> Action, Ego, Vision.</p>
                            </div>
                            <div className="border border-[#333] p-4">
                                <h4 className="font-bold text-white mb-2">EARTH SIGNS</h4>
                                <p className="text-xs text-gray-500">Taurus, Virgo, Capricorn. <br /> Stability, Money, Structure.</p>
                            </div>
                            <div className="border border-[#333] p-4">
                                <h4 className="font-bold text-white mb-2">AIR SIGNS</h4>
                                <p className="text-xs text-gray-500">Gemini, Libra, Aquarius. <br /> Ideas, Talk, Network.</p>
                            </div>
                            <div className="border border-[#333] p-4">
                                <h4 className="font-bold text-white mb-2">WATER SIGNS</h4>
                                <p className="text-xs text-gray-500">Cancer, Scorpio, Pisces. <br /> Emotion, Intuition, Depth.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 5. THE ULTIMATE EMPOWERMENT (CAPTAIN) */}
            <section className="py-32 px-6 bg-[#050505] border-t border-[#222]">
                <div className="max-w-4xl mx-auto text-center">

                    <div className="inline-block border border-[#FFD700] text-[#FFD700] px-4 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-8">
                        The SoulSync Philosophy
                    </div>

                    <h2 className="font-serif text-5xl md:text-7xl font-bold mb-8 text-white">
                        YOU ARE THE CAPTAIN.
                    </h2>
                    <p className="font-mono text-gray-400 mb-12 text-lg leading-relaxed">
                        Planets do not sit in a house thinking, "Yes, I should destroy their marriage today." <br />
                        Planets function on <strong>autopilot</strong>. <br />
                        If you are unconscious, you are a slave to their gravity. <br />
                        If you are conscious (SoulSync), you use their energy to sail your ship.
                    </p>

                    <div className="bg-[#111] border border-[#333] p-8 md:p-12 mb-16">
                        <p className="font-serif text-2xl text-gray-300 italic mb-6">
                            "Fate is what happens when you don't take responsibility for your own psychology."
                        </p>
                        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">— Carl Jung (Paraphrased)</p>
                    </div>

                    <button
                        onClick={openModal}
                        className="px-16 py-6 bg-[#FFD700] text-black font-bold text-xl uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_50px_rgba(255,215,0,0.3)]"
                    >
                        Decode My Dashboard
                    </button>
                </div>
            </section>

            <TheVoid />
        </main>
    );
}
