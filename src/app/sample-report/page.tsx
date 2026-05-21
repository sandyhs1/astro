"use client";

import React from 'react';
import LandingFooter from "@/components/LandingFooter";
import FloatingLogo from "@/components/ui/FloatingLogo";

export default function SampleReport() {
    return (
        <div className="min-h-screen bg-black text-white font-mono selection:bg-[#FFD700] selection:text-black antialiased">
            <FloatingLogo position="left" />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
                {/* DOSSIER HEADER */}
                <div className="mb-16 border-b border-[#333] pb-12">
                    <h1 className="text-4xl md:text-6xl font-serif tracking-tighter mb-6 text-[#FFD700] uppercase">
                        THE QUANTUM DESTINY MANIFESTO
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs tracking-[0.2em] text-gray-400">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[#FFD700] animate-pulse">●</span>
                                <span className="font-bold text-white">FULL NAME:</span>
                                <span className="text-gray-200">AANYA MEHRA</span>
                            </div>
                            <div className="text-[10px] text-gray-600">
                                TEMPORAL COORDINATION: FEBRUARY 21, 2026 // CLASSIFICATION: SOVEREIGN DESTINY
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <span className="text-red-500 border border-red-500/30 px-3 py-1 bg-red-500/5">STATUS: CONFIDENTIAL</span>
                            <span className="text-[#00FF41] border border-[#00FF41]/30 px-3 py-1 bg-[#00FF41]/5">PRIORITY: SOVEREIGN</span>
                        </div>
                    </div>
                </div>

                {/* HIGH-FIDELITY DIAGNOSTIC INTRO */}
                <section className="mb-24 p-8 bg-[#050505] border border-[#222] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 blur-3xl rounded-full"></div>
                    <div className="space-y-6 text-gray-300 leading-relaxed text-lg max-w-4xl">
                        <p className="font-bold text-white italic">
                            This is not a generic reading, Aanya Mehra. This is a high-fidelity diagnostic of your soul's architecture. Most astrologers play in the shallow end of D-1 and D-9; we are going into the deep-sea trenches of your D-30 and D-60.
                        </p>
                        <p>
                            Aanya, you are currently in a "Quantum Void." Your life feels like a fractured mirror, but that is because you are being recalibrated. Here is the brutal, logic-backed truth.
                        </p>
                    </div>
                </section>

                <div className="space-y-32">

                    {/* PAGE 1: THE SAVAGE WELCOME & VITAL DATA */}
                    <section className="relative group">
                        <div className="mb-8 flex items-baseline gap-4">
                            <span className="text-gray-700 text-sm font-mono whitespace-nowrap">PAGE 01 //</span>
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white border-b-4 border-[#FFD700] pb-2">
                                WELCOME
                            </h2>
                        </div>

                        <div className="prose prose-invert prose-p:text-gray-300 prose-p:leading-relaxed max-w-4xl mb-12 text-lg">
                            <p>
                                Aanya, stop looking for "hope." Hope is for the unprepared. You need Strategy. You are a Gemini Ascendant—a sign of the twin, the dual, and the infinite loop. You are designed to process the world through a high-speed processor, but your current hardware is overheating.
                            </p>
                        </div>

                        <div className="border border-[#333] bg-[#0A0A0A]">
                            <div className="bg-[#111] px-6 py-3 border-b border-[#333] text-xs tracking-widest text-[#FFD700] uppercase font-bold">
                                BIRTH DATA LOG: AANYA MEHRA
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="p-6 border-b md:border-b-0 md:border-r border-[#333] flex justify-between items-center group/data">
                                    <span className="text-gray-500 uppercase text-[10px] tracking-widest">Date of Birth</span>
                                    <div className="h-4 w-32 bg-white/20 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black translate-x-0 group-hover/data:translate-x-full transition-transform duration-700"></div>
                                        <span className="text-[10px] text-gray-500 flex items-center justify-center h-full">REDACTED</span>
                                    </div>
                                </div>
                                <div className="p-6 border-b border-[#333] flex justify-between items-center group/data">
                                    <span className="text-gray-500 uppercase text-[10px] tracking-widest">Time of Birth</span>
                                    <div className="h-4 w-32 bg-white/20 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black translate-x-0 group-hover/data:translate-x-full transition-transform duration-700"></div>
                                        <span className="text-[10px] text-gray-500 flex items-center justify-center h-full">REDACTED</span>
                                    </div>
                                </div>

                                <div className="p-6 border-b md:border-b-0 md:border-r border-[#333] flex justify-between">
                                    <span className="text-gray-500 uppercase text-[10px] tracking-widest">Parameter</span>
                                    <span className="text-gray-500 uppercase text-[10px] tracking-widest">Technical Detail</span>
                                </div>
                                <div className="p-6 border-b border-[#333] hidden md:flex justify-between">
                                    <span className="text-gray-500 uppercase text-[10px] tracking-widest">Parameter</span>
                                    <span className="text-gray-500 uppercase text-[10px] tracking-widest">Technical Detail</span>
                                </div>

                                <div className="p-6 border-b md:border-b-0 md:border-r border-[#333] flex justify-between">
                                    <span className="text-gray-400">Lagna (Ascendant)</span>
                                    <span className="text-white">Gemini (Mithuna) - Vargottama Strength</span>
                                </div>
                                <div className="p-6 border-b border-[#333] flex justify-between">
                                    <span className="text-gray-400">Moon Sign (Rashi)</span>
                                    <span className="text-white">Aries (Mesha) - Nakshatra: Ashwini</span>
                                </div>
                                <div className="p-6 border-b md:border-b-0 md:border-r border-[#333] flex justify-between">
                                    <span className="text-gray-400">Sun Sign</span>
                                    <span className="text-white">Pisces (Meena) - Nakshatra: Revati</span>
                                </div>
                                <div className="p-6 border-b border-[#333] flex justify-between">
                                    <span className="text-gray-400">Atmakaraka (AK)</span>
                                    <span className="text-[#FFD700] font-bold">Mercury (The Intellectual Sovereign)</span>
                                </div>
                                <div className="p-6 md:border-r border-[#333] flex justify-between bg-[#111]">
                                    <span className="text-gray-400">Current Mahadasha</span>
                                    <span className="text-[#00FF41] font-bold">Sun (Surya) - Ego Illumination</span>
                                </div>
                                <div className="p-6 flex justify-between bg-[#111]">
                                    <span className="text-gray-400">Current Antardasha</span>
                                    <span className="text-red-500 font-bold">Ketu (Until March 2026)</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PAGE 2: THE ANATOMY OF THE INTELLECTUAL BATTLEFIELD */}
                    <section className="relative">
                        <div className="mb-8 flex items-baseline gap-4">
                            <span className="text-gray-700 text-sm font-mono whitespace-nowrap">PAGE 02 //</span>
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white border-b-4 border-[#00FF41] pb-2">
                                THE ANATOMY OF THE INTELLECTUAL BATTLEFIELD
                            </h2>
                        </div>

                        <div className="bg-[#0A0A0A] border border-[#222] p-8 md:p-12 space-y-12">
                            <div>
                                <h3 className="text-[#00FF41] text-lg font-bold tracking-widest mb-6 uppercase border-b border-[#222] pb-2 inline-block">
                                    The Mercury-Saturn Friction (D-1 Analysis)
                                </h3>
                                <p className="text-gray-200 text-lg leading-relaxed mb-10">
                                    Aanya, your Ascendant Lord (Mercury) is placed in the 11th house of Aries, but it is locked in a tight embrace with a Debilitated Saturn.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-4 p-8 bg-black border border-[#222]">
                                    <span className="text-xs text-gray-500 tracking-[0.3em] uppercase block font-bold">The Logic</span>
                                    <p className="text-gray-300 text-base leading-relaxed">
                                        Saturn is the planet of restriction; Mercury is the planet of flow. When they meet in Aries (a fiery, impulsive sign), your mind becomes a pressure cooker. You are brilliant, but you are chronically exhausted by your own thoughts.
                                    </p>
                                </div>
                                <div className="space-y-4 p-8 bg-black border border-[#222]">
                                    <span className="text-xs text-[#00FF41] tracking-[0.3em] uppercase block font-bold">The "Secret" Marker</span>
                                    <p className="text-gray-300 text-base leading-relaxed">
                                        You have a "Mental Gridlock" yoga. You think faster than you can act, leading to a paralysis of analysis. Because Saturn is debilitated, your self-criticism is not constructive; it is corrosive.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#111] p-10 border-l-8 border-[#00FF41] relative">
                                <div className="absolute top-4 right-4 text-[#00FF41]/20 font-serif text-6xl">"</div>
                                <span className="text-xs text-white tracking-[0.4em] uppercase block mb-4 font-bold underline decoration-[#00FF41] underline-offset-8">The Proof</span>
                                <p className="text-gray-200 text-lg italic leading-relaxed relative z-10 font-serif">
                                    Look at your communication style. You are blunt because you are tired of the noise. You use your words as a scalpel to cut through the bullshit, but you often end up cutting yourself in the process.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* PAGE 3: THE HEART OF THE PIONEER */}
                    <section className="relative">
                        <div className="mb-8 flex items-baseline gap-4">
                            <span className="text-gray-700 text-sm font-mono whitespace-nowrap">PAGE 03 //</span>
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white border-b-4 border-[#FF3366] pb-2">
                                THE HEART OF THE PIONEER (MOON IN ASHWINI)
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="border border-[#333] p-10 bg-[#050505] relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FF3366]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="text-[#FF3366] text-xs font-bold tracking-[0.3em] mb-6 block uppercase">The Reality</span>
                                <p className="text-gray-200 text-xl leading-relaxed font-serif">
                                    You have "Start-up Energy" but "Maintenance Fatigue." You love the rush of a new romance or a new project, but the moment it becomes "routine," your soul begins to starve.
                                </p>
                            </div>

                            <div className="border border-[#333] p-10 bg-[#050505] relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FF3366]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="text-[#FF3366] text-xs font-bold tracking-[0.3em] mb-6 block uppercase">The Emotional Paradox</span>
                                <p className="text-gray-200 text-xl leading-relaxed font-serif">
                                    You are emotionally impulsive. You feel things with a 10,000-volt intensity, yet you are currently undergoing a Sun-Ketu period which makes you feel "numb." This is the universe forcing a reboot of your emotional motherboard.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* PAGE 4: THE POST-MORTEM OF THE MARRIAGE */}
                    <section className="relative">
                        <div className="mb-8 flex items-baseline gap-4">
                            <span className="text-gray-700 text-sm font-mono whitespace-nowrap">PAGE 04 //</span>
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white border-b-4 border-[#00CBFF] pb-2">
                                THE POST-MORTEM OF THE MARRIAGE (WHY IT COLLAPSED)
                            </h2>
                        </div>

                        <div className="bg-[#0A0A0A] border border-[#222] p-8 md:p-12 space-y-16">
                            <p className="text-gray-400 text-lg italic border-l-4 border-[#333] pl-6">
                                Aanya, you've been blaming yourself or the "timing." Let's look at the mathematical inevitability of that 6-month disaster.
                            </p>

                            <div className="space-y-20">
                                <div className="relative">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="bg-[#00CBFF] text-black w-10 h-10 flex items-center justify-center font-bold text-xl rounded-full">1</span>
                                        <h4 className="text-white text-xl font-bold uppercase tracking-widest">The 8th House Jupiter Trap</h4>
                                    </div>
                                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                        Your 7th Lord (The partner) is Jupiter, and it is Debilitated in Capricorn in the 8th house.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-black/80 p-8 border border-[#333] hover:border-[#00CBFF]/50 transition-colors">
                                            <span className="text-xs text-gray-500 uppercase font-bold tracking-[0.2em] block mb-4">The Logic</span>
                                            <p className="text-gray-300 text-base leading-relaxed">
                                                The 8th house is the house of "Scurrying Secrets" and "Sudden Endings." Jupiter, the planet of expansion and marriage, is at its absolute weakest here.
                                            </p>
                                        </div>
                                        <div className="bg-[#00CBFF]/5 p-8 border border-[#00CBFF]/30 hover:bg-[#00CBFF]/10 transition-all">
                                            <span className="text-xs text-[#00CBFF] uppercase font-bold tracking-[0.2em] block mb-4">The Secret</span>
                                            <p className="text-gray-200 text-base leading-relaxed">
                                                Your first marriage was never meant to be a "union." It was a Karmic Liquidation. You owed a debt to that soul, and the 6 months of marriage was the payment. Once the check cleared, the universe evicted him from your life.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="bg-[#00CBFF] text-black w-10 h-10 flex items-center justify-center font-bold text-xl rounded-full">2</span>
                                        <h4 className="text-white text-xl font-bold uppercase tracking-widest">The Combustion (Astangata) of Venus</h4>
                                    </div>
                                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                        In your 10th house, Venus is at 26° Pisces and the Sun is at 24°.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-black/80 p-8 border border-[#333] hover:border-[#00CBFF]/50 transition-colors">
                                            <span className="text-xs text-gray-500 uppercase font-bold tracking-[0.2em] block mb-4">The Logic</span>
                                            <p className="text-gray-300 text-base leading-relaxed">
                                                In astrology, the Sun is the Ego. When Venus (Love) is too close to the Sun, the Ego incinerates the romance.
                                            </p>
                                        </div>
                                        <div className="bg-white/5 p-8 border border-white/20 hover:bg-white/10 transition-all">
                                            <span className="text-xs text-white uppercase font-bold tracking-[0.2em] block mb-4">The Proof</span>
                                            <p className="text-gray-200 text-base leading-relaxed">
                                                The marriage didn't end because of "incompatibility." It ended because you realized you were losing your identity (Sun) to maintain the relationship (Venus).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PAGE 5: THE D-9 (NAVAMSHA) */}
                    <section className="relative">
                        <div className="mb-8 flex items-baseline gap-4">
                            <span className="text-gray-700 text-sm font-mono whitespace-nowrap">PAGE 05 //</span>
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white border-b-4 border-[#B026FF] pb-2">
                                THE D-9 (NAVAMSHA) – THE SPOUSE REVEALED
                            </h2>
                        </div>

                        <div className="bg-[#050505] border border-[#222] p-10 md:p-16 space-y-16">
                            <div className="p-10 bg-[#111] border-l-8 border-[#B026FF] relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#B026FF]/10 blur-[100px]"></div>
                                <h3 className="text-white text-xl font-serif mb-4 flex items-center gap-3">
                                    <span className="w-2 h-2 bg-[#B026FF] rounded-full animate-ping"></span>
                                    Vargottama Strength
                                </h3>
                                <p className="text-lg text-gray-300 leading-relaxed font-serif">
                                    Your D-9 Ascendant is also Gemini. This is rare. It means what you see is what you get. You are authentically yourself, which makes you "difficult" for a weak man to handle.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-16">
                                <div className="space-y-10">
                                    <h4 className="text-white text-lg font-bold border-b border-[#333] pb-4 uppercase tracking-[0.2em]">The Second Spouse Profile</h4>
                                    <div className="space-y-8">
                                        <div className="group">
                                            <span className="text-[#B026FF] text-[10px] uppercase font-bold tracking-[0.3em] block mb-2 transition-colors group-hover:text-white">The Marker</span>
                                            <p className="text-gray-300 text-base leading-relaxed">Your 7th Lord of the second marriage is Jupiter, which moves from Debilitated in D-1 to Exalted in Cancer in the D-9 (2nd House).</p>
                                        </div>
                                        <div className="group">
                                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.3em] block mb-2">The Logic</span>
                                            <p className="text-gray-400 text-base leading-relaxed">This is a "Pushkar Navamsha" placement. It indicates a massive upgrade.</p>
                                        </div>
                                        <div className="group">
                                            <span className="text-[#B026FF] text-[10px] uppercase font-bold tracking-[0.3em] block mb-2">The Identity</span>
                                            <p className="text-gray-300 text-base leading-relaxed">This person will be older or mentally more "weighted" than you. While your first husband was likely impulsive (mirroring your Aries Moon), the second will be a Jupiterian Anchor.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-10">
                                    <h4 className="text-white text-lg font-bold border-b border-[#333] pb-4 uppercase tracking-[0.2em]">Dossier Identifiers</h4>
                                    <div className="bg-black border border-[#222] p-10 space-y-10 relative">
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#B026FF] to-transparent"></div>
                                        <div>
                                            <span className="text-gray-600 text-[10px] uppercase tracking-[0.3em] block mb-4 font-bold">Physical/Mental Presence</span>
                                            <p className="text-[#B026FF] font-serif italic text-2xl leading-snug">"Rounder face, deep, resonant voice, and an aura of 'The Professor'."</p>
                                        </div>
                                        <div className="pt-10 border-t border-[#1a1a1a]">
                                            <span className="text-gray-600 text-[10px] uppercase tracking-[0.3em] block mb-4 font-bold">Meeting Coordinates</span>
                                            <p className="text-gray-200 text-lg leading-relaxed">
                                                You will meet him during the Moon-Mars period (<span className="text-white font-bold">Late 2027</span>). It will not be on an app. It will be during a high-intensity professional seminar or a short-distance business trip.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PAGE 6: THE D-30 */}
                    <section className="relative">
                        <div className="mb-8 flex items-baseline gap-4">
                            <span className="text-gray-700 text-sm font-mono whitespace-nowrap">PAGE 06 //</span>
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white border-b-4 border-[#FFA500] pb-2">
                                THE D-30 (TRIMSAMSHA) – THE SHADOW WORK
                            </h2>
                        </div>

                        <div className="bg-[#0A0A0A] border border-[#222] p-10 md:p-16">
                            <div className="flex flex-col md:flex-row gap-16">
                                <div className="md:w-1/3 flex flex-col justify-center items-center text-center p-10 bg-black border border-[#333] relative">
                                    <div className="absolute inset-0 border-[20px] border-transparent border-t-[#FFA500]/5 border-l-[#FFA500]/5"></div>
                                    <span className="text-[#FFA500] text-xs font-bold tracking-[0.4em] block mb-6 uppercase">The Marker</span>
                                    <div className="text-3xl font-serif text-white mb-4 tracking-tighter italic">DRIDHA KARMA</div>
                                    <p className="text-sm text-gray-500 uppercase tracking-widest">(Fixed Karma regarding deception)</p>
                                </div>
                                <div className="md:w-2/3 space-y-10">
                                    <div className="bg-red-950/20 border-l-8 border-red-600 p-8 shadow-2xl">
                                        <span className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase block mb-4">The Warning</span>
                                        <p className="text-gray-200 text-lg leading-relaxed">
                                            You are prone to "Authority Complex" attraction. You gravitate toward men who look powerful (Sun/Saturn influence) but are internally hollow.
                                        </p>
                                    </div>
                                    <div className="bg-white/5 border-l-8 border-white p-8">
                                        <span className="text-white text-xs font-bold tracking-[0.3em] uppercase block mb-4">The Lesson</span>
                                        <p className="text-gray-300 text-lg leading-relaxed italic font-serif">
                                            Until you heal your relationship with the "Father figure" or "Authority" (Sun-Saturn conjunction in 10th), you will keep attracting "imposters." 2026 is the year you stop being a "Fixer" and start being a "Sovereign."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PAGE 7: THE 2026 "VENUS TRAP" */}
                    <section className="relative">
                        <div className="mb-8 flex items-baseline gap-4">
                            <span className="text-gray-700 text-sm font-mono whitespace-nowrap">PAGE 07 //</span>
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white border-b-4 border-red-600 pb-2">
                                THE 2026 "VENUS TRAP" (MARCH 2026 - MARCH 2027)
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-[#100505] p-12 border border-red-900/30 text-center flex flex-col justify-center">
                                <h5 className="text-gray-600 text-xs tracking-[0.3em] uppercase mb-8 font-bold">The Deception</h5>
                                <p className="text-xl text-gray-400 font-serif leading-relaxed italic">"Most astrologers will tell you 'Venus is Exalted! You will find a new boyfriend!'"</p>
                            </div>
                            <div className="bg-red-600/5 p-12 border border-red-600/30 text-center flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <h5 className="text-red-500 text-xs tracking-[0.3em] uppercase mb-8 font-bold">The Brutal Fact</h5>
                                <p className="text-2xl text-white font-bold leading-tight uppercase tracking-tighter">Your Venus is crushed by a debilitated Saturn. Any man between March - Oct 2026 is a <span className="underline decoration-red-600 decoration-4 underline-offset-8">Debt Collector</span>.</p>
                            </div>
                        </div>
                        <div className="mt-4 p-12 bg-black border border-[#333] relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-[#333] px-6 py-1 text-[10px] tracking-[0.5em] text-white uppercase font-bold">
                                Directive Protocol
                            </div>
                            <p className="text-gray-200 text-lg text-center max-w-4xl mx-auto leading-relaxed font-serif">
                                Do not sign a marriage certificate. Do not move in. Treat 2026 as a "Cleansing Year." If you marry for vindication to prove the first divorce wasn't your fault, the second one will be even shorter.
                            </p>
                        </div>
                    </section>

                    {/* PAGE 8: THE ANCESTRAL DEBT */}
                    <section className="relative">
                        <div className="mb-8 flex items-baseline gap-4">
                            <span className="text-gray-700 text-sm font-mono whitespace-nowrap">PAGE 08 //</span>
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white border-b-4 border-[#FFD700] pb-2">
                                THE ANCESTRAL DEBT (D-60 ANALYSIS)
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
                            <div className="p-12 border border-[#333] bg-[#080808] flex flex-col justify-center space-y-6">
                                <span className="text-gray-600 text-xs uppercase font-bold tracking-[0.3em] block mb-4 border-b border-[#222] pb-2 w-fit">The Reality</span>
                                <p className="text-2xl font-serif text-white leading-snug">
                                    In a past life, you were "The Ruler." In this life, you are being asked to learn the "Internal Empire."
                                </p>
                                <p className="text-gray-400 text-base">Your D-60 shows a soul who has repeatedly held high status. You have Ketu in the 10th House.</p>
                            </div>
                            <div className="p-12 border border-[#333] bg-[#080808] flex flex-col justify-center space-y-6">
                                <span className="text-white text-xs uppercase font-bold tracking-[0.3em] block mb-4 border-b border-[#222] pb-2 w-fit">The Proof</span>
                                <p className="text-gray-300 text-lg leading-relaxed italic font-serif">
                                    "You feel 'old'. Even as a child, you felt like you were babysitting the adults. This is because your D-60 is finished with the material world; you are only here to master the Psychology of the Self."
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* PAGE 9: THE 30-DAY RECALIBRATION PLAN */}
                    <section className="relative">
                        <div className="mb-8 flex items-baseline gap-4">
                            <span className="text-gray-700 text-sm font-mono whitespace-nowrap">PAGE 09 //</span>
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white border-b-4 border-[#00FF41] pb-2">
                                THE 30-DAY "RECALIBRATION" PLAN
                            </h2>
                        </div>

                        <div className="space-y-8">
                            <p className="text-gray-400 text-lg mb-12">Aanya, we need to shift your frequency from "Panic" to "Precision."</p>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-10 border border-[#222] bg-black group hover:border-[#FFD700]/50 transition-colors">
                                    <span className="text-[#FFD700] text-xs font-bold tracking-[0.3em] block mb-6 uppercase">01. The Mantra (Vibrational Alignment)</span>
                                    <div className="text-2xl font-serif mb-6 text-white bg-[#111] p-6 border-l-4 border-[#FFD700]">Om Bram Brhaspataye Namah</div>
                                    <p className="text-gray-400 text-base leading-relaxed">
                                        <span className="text-white font-bold block mb-2 underline decoration-gray-700 underline-offset-4">Logic:</span>
                                        This strengthens your 7th Lord (Jupiter). Since it is debilitated, you must "manually" feed it energy. Recite 108 times at sunset.
                                    </p>
                                </div>
                                <div className="p-10 border border-[#222] bg-black group hover:border-[#00FF41]/50 transition-colors">
                                    <span className="text-[#00FF41] text-xs font-bold tracking-[0.3em] block mb-6 uppercase">02. The Activity (The Brain Dump)</span>
                                    <div className="text-2xl font-serif mb-6 text-white bg-[#111] p-6 border-l-4 border-[#00FF41]">Practice: Automatic Writing</div>
                                    <p className="text-gray-400 text-base leading-relaxed">
                                        <span className="text-white font-bold block mb-2 underline decoration-gray-700 underline-offset-4">Logic:</span>
                                        Your Gemini Ascendant/Mercury-Saturn conjunction creates mental silt. You need to "flush" the thoughts out of your system so they don't turn into physical illness (D-30 warning). 10 minutes every morning.
                                    </p>
                                </div>
                            </div>

                            <div className="p-10 border border-[#222] bg-[#050505]">
                                <span className="text-white text-xs font-bold tracking-[0.3em] block mb-8 uppercase">03. The Color Therapy</span>
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-red-600 flex-shrink-0 animate-pulse"></div>
                                        <div>
                                            <span className="text-red-500 font-bold block mb-2 text-lg">AVOID RED</span>
                                            <p className="text-gray-500 text-sm">It over-activates your impulsive Aries Moon. Stop the cycle for the next 6 months.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-[#FFD700] flex-shrink-0 shadow-[0_0_15px_#FFD700]"></div>
                                        <div>
                                            <span className="text-[#FFD700] font-bold block mb-2 text-lg">WEAR YELLOW or CREAM</span>
                                            <p className="text-gray-500 text-sm">To support your weak Jupiter/7th Lord. Surround yourself with these frequencies.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PAGE 10: THE ROAD AHEAD */}
                    <section className="relative pt-24 border-t-2 border-[#333]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 blur-[120px] rounded-full pointer-events-none"></div>

                        <div className="bg-[#050505] border border-[#222] p-10 md:p-16 max-w-4xl relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#FFD700] via-transparent to-transparent"></div>
                            <div className="space-y-8 text-gray-200 leading-relaxed text-left font-serif text-xl relative z-10">
                                <p className="text-2xl text-white font-bold not-italic border-b border-[#222] pb-6 inline-block">
                                    Aanya, my dear, fierce, brilliant girl...
                                </p>

                                <p>
                                    I know it feels like you're standing in the ruins of a life you thought you wanted. I know the "6-month divorce" feels like a scarlet letter on your chest. But look at your charts through my eyes.
                                </p>

                                <p>
                                    The universe didn't break your marriage; it rescued you from a cage. You are a Gemini Vargottama—you were never meant to be a "trophy wife". You are a storm, Aanya. And a storm doesn't belong in a glass jar.
                                </p>

                                <p>
                                    2026 is going to be hard because you have to face the person in the mirror without the distraction of a partner. It’s okay to cry. It’s okay to feel "invisible" right now (that’s just Ketu doing its job). But by 2027, when that Moon Mahadasha hits, you won't just be "fixed"—you will be transformed.
                                </p>

                                <p>
                                    You are a Phoenix, Aanya Mehra. The fire of 2024 didn't consume you; it just melted away everything that wasn't you. Hang in there, little butterfly. The real king is coming, but he’s waiting for the Queen to finish building her throne.
                                </p>

                                <div className="pt-12 border-t border-[#222] mt-16 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-gray-600 block tracking-[0.5em] uppercase font-mono">System Sign-off</span>
                                        <p className="text-sm font-mono text-gray-400 uppercase flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]"></span>
                                            Vedic Analyst CC-04 // Quantum Karma
                                        </p>
                                    </div>
                                    <div className="text-[8px] text-[#222] font-mono select-none">
                            // ENCRYPTED // FINAL ASSESSMENT //
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* POWERFUL REMEDIES SECTION */}
                    <section className="relative pt-32 border-t-4 border-double border-[#333]">
                        <h2 className="text-3xl font-serif text-[#FFD700] mb-12 uppercase tracking-[0.2em] flex items-center gap-6">
                            <span>Powerful Remedies, Just for You</span>
                            <span className="h-[1px] bg-[#333] flex-grow"></span>
                        </h2>

                        <div className="bg-[#050505] border border-[#222] p-10 md:p-14 mb-16 relative">
                            <div className="absolute top-0 right-10 bg-black px-4 -translate-y-1/2 text-[10px] text-gray-500 font-mono">
                                ENGINEERING PHASE: COMPLETION & MANDALA
                            </div>

                            <p className="text-lg text-gray-300 mb-16 leading-relaxed max-w-4xl border-l border-gray-800 pl-8">
                                We will use <span className="text-white font-bold">21 repetitions</span> (the number of "Completion") or <span className="text-white font-bold">48 repetitions</span> (the number of a "Mandala" or physiological cycle). These are precision-engineered to fix the specific glitches in your D-1 and D-9.
                            </p>

                            <div className="space-y-24">
                                {/* Remedy 1 */}
                                <div className="space-y-8">
                                    <h3 className="text-white text-xl font-bold uppercase tracking-tight border-b border-[#222] pb-4">
                                        1. The "Cooling" Ritual: For the Combust Venus & Saturn (Marriage/Relationships)
                                    </h3>
                                    <div className="grid md:grid-cols-12 gap-12">
                                        <div className="md:col-span-8 space-y-8 text-gray-300">
                                            <div className="p-8 bg-black border-l-4 border-[#FF3366]">
                                                <span className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-4 italic">The Logic Deep Dive</span>
                                                <p className="text-base leading-relaxed">Your Venus (Marriage/Happiness) is sitting in a furnace (Sun) and a freezer (Saturn). It is literally "burned out." You need to cool the energy of your 10th house so your relationships don't evaporate.</p>
                                            </div>
                                            <div className="p-8 bg-black border border-[#222] relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 py-1 px-4 bg-[#FF3366] text-black text-[10px] font-bold">FREQUENCY CODE</div>
                                                <span className="text-[#FF3366] text-xs font-bold uppercase tracking-widest block mb-4 italic">The Power Syllables</span>
                                                <p className="text-white font-serif text-3xl mb-4">Om Shum Shukraya Namaha *</p>
                                                <p className="text-sm text-gray-400 border-t border-[#1a1a1a] pt-4 mt-6">48 times every Friday morning before 8:00 AM.</p>
                                            </div>
                                            <div className="space-y-6 bg-black/40 p-10 border border-[#1a1a1a]">
                                                <span className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-4 border-b border-[#222] pb-2 w-fit">Sequential Protocol</span>
                                                <ol className="space-y-6 text-base text-gray-400">
                                                    <li className="flex gap-4"><span className="text-white font-bold font-mono">01.</span> Sit facing South-East.</li>
                                                    <li className="flex gap-4"><span className="text-white font-bold font-mono">02.</span> Place a small bowl of raw milk mixed with a pinch of white sandalwood powder (or a white flower) in front of you.</li>
                                                    <li className="flex gap-4"><span className="text-white font-bold font-mono">03.</span> Chant the mantra 48 times.</li>
                                                    <li className="flex gap-4 p-4 bg-[#FF3366]/5 border border-[#FF3366]/20">
                                                        <span className="text-[#FF3366] font-bold font-mono">04.</span>
                                                        <div>
                                                            <span className="text-white font-bold block mb-1">THE SECRET ACTION:</span>
                                                            After chanting, dip your ring finger in the milk and touch it to your throat (Vishuddha Chakra). This "cools" the sharp words that ruin your relationships.
                                                        </div>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>
                                        <div className="md:col-span-4 self-start">
                                            <div className="bg-[#FF3366]/5 p-8 border border-[#FF3366]/20 sticky top-10">
                                                <span className="text-[#FF3366] text-xs font-bold uppercase tracking-[0.3em] block mb-6">IMPACT ANALYSIS</span>
                                                <p className="text-sm text-gray-200 leading-loose italic">
                                                    "This repairs the 'Combustion' effect. It stops you from being 'too much' for partners and helps you attract the 'Anchor' spouse instead of the 'Debt Collector'."
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Remedy 2 */}
                                <div className="space-y-8 pt-12 border-t border-[#222]">
                                    <h3 className="text-white text-xl font-bold uppercase tracking-tight border-b border-[#222] pb-4">
                                        2. The "Mercury-Saturn" Grounding: For Anxiety & Overthinking
                                    </h3>
                                    <div className="grid md:grid-cols-12 gap-12 text-gray-300">
                                        <div className="md:col-span-8 space-y-8">
                                            <div className="p-8 bg-black border-l-4 border-[#00FF41]">
                                                <span className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-4 italic">The Logic Deep Dive</span>
                                                <p className="text-base leading-relaxed font-serif">Your Ascendant Lord (Mercury) is trapped with Saturn in Aries. Your brain is a super car with the parking brake on. This causes your mental exhaustion and the "battlefield" mindset.</p>
                                            </div>
                                            <div className="p-8 bg-black border border-[#222] relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 py-1 px-4 bg-[#00FF41] text-black text-[10px] font-bold font-mono">21 X DAILY</div>
                                                <span className="text-[#00FF41] text-xs font-bold uppercase tracking-widest block mb-4 italic">The Foundation Code</span>
                                                <p className="text-white font-serif text-3xl mb-4">Om Gan Ganapataye Namaha</p>
                                                <p className="text-sm text-gray-400 border-t border-[#1a1a1a] pt-4 mt-6">Daily (immediately after waking up, before checking your phone).</p>
                                            </div>
                                            <div className="space-y-6 bg-black/40 p-10 border border-[#1a1a1a]">
                                                <span className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-4">Grounding Protocol</span>
                                                <ul className="space-y-6 text-base text-gray-400">
                                                    <li className="flex gap-4 border-b border-[#111] pb-4">
                                                        <span className="text-[#00FF41]">●</span>
                                                        Sit on the floor (Earth element is vital for you).
                                                    </li>
                                                    <li className="flex gap-4 border-b border-[#111] pb-4">
                                                        <span className="text-[#00FF41]">●</span>
                                                        Close your eyes and visualize a deep green light at the base of your spine.
                                                    </li>
                                                    <li className="flex gap-4">
                                                        <span className="text-[#00FF41]">●</span>
                                                        Chant 21 times with a focus on making your voice deep and resonant.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="md:col-span-4 self-start">
                                            <div className="bg-[#00FF41]/5 p-8 border border-[#00FF41]/20 sticky top-10">
                                                <span className="text-[#00FF41] text-xs font-bold uppercase tracking-[0.3em] block mb-6 font-mono">ASSESSMENT</span>
                                                <p className="text-sm text-gray-200 leading-loose">
                                                    "Mercury is Ganesha’s planet. This grounds your electricity. It will stop the 'anxiety loop' you are feeling about your new job. It makes your mind a 'Tool' rather than a 'Torture Chamber'."
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Remedy 3 */}
                                <div className="space-y-8 pt-12 border-t border-[#222]">
                                    <h3 className="text-white text-xl font-bold uppercase tracking-tight border-b border-[#222] pb-4">
                                        3. The 8th House "Debt Clearance": For the Debilitated Jupiter
                                    </h3>
                                    <div className="grid md:grid-cols-12 gap-12 text-gray-300">
                                        <div className="md:col-span-8 space-y-8">
                                            <div className="p-8 bg-black border-l-4 border-[#FFD700]">
                                                <span className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-4 italic">The Logic Deep Dive</span>
                                                <p className="text-base leading-relaxed">Your 7th Lord (Marriage) is in the 8th house (Loss/Transformation). You have "spiritual debt" that took your first marriage as payment. We need to stop the 8th house from "eating" your second marriage.</p>
                                            </div>
                                            <div className="p-8 bg-[#FFD700]/5 border border-[#FFD700]/30 relative overflow-hidden group">
                                                <span className="text-[#FFD700] text-xs font-bold uppercase tracking-widest block mb-4 italic">The Earthly Transfer</span>
                                                <p className="text-white font-serif text-3xl mb-4 italic underline decoration-[#FFD700]/50 decoration-wavy">Yellow Grain Donation</p>
                                                <p className="text-sm text-gray-400 border-t border-[#FFD700]/20 pt-4 mt-6 uppercase font-bold">Every Thursday</p>
                                            </div>
                                            <div className="space-y-6 bg-black/40 p-10 border border-[#1a1a1a]">
                                                <span className="text-gray-600 text-[10px] uppercase font-bold tracking-widest block mb-4 border-b border-[#222] pb-2 w-fit italic">Offloading Protocol</span>
                                                <ul className="space-y-6 text-base text-gray-400">
                                                    <li className="flex gap-4 border-b border-[#111] pb-4">
                                                        <span className="text-[#FFD700]">01.</span>
                                                        Take a handful of Chana Dal (Split Yellow Gram).
                                                    </li>
                                                    <li className="flex gap-4 border-b border-[#111] pb-4">
                                                        <span className="text-[#FFD700]">02.</span>
                                                        Hold it in your right hand and circle it over your head 7 times clockwise.
                                                    </li>
                                                    <li className="flex gap-4">
                                                        <span className="text-[#FFD700]">03.</span>
                                                        Feed it to birds or donate it to a temple/needy person.
                                                    </li>
                                                </ul>
                                                <div className="mt-8 p-4 bg-red-950/20 border border-red-500/30">
                                                    <span className="text-red-500 text-[10px] font-bold uppercase block mb-1">STRICT PRECAUTION:</span>
                                                    <p className="text-xs text-gray-300 uppercase italic">Do not consume Chana Dal yourself on Thursdays.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-4 self-start">
                                            <div className="bg-[#FFD700]/5 p-8 border border-[#FFD700]/20 sticky top-10">
                                                <span className="text-[#FFD700] text-xs font-bold uppercase tracking-[0.3em] block mb-6">REASONING</span>
                                                <p className="text-sm text-gray-200 leading-loose border-l border-[#FFD700]/50 pl-4 py-2">
                                                    "You are physically 'giving away' the weight of your debilitated Jupiter. By offloading the grain, you are offloading the 'Guru-Dosha' that caused the 6-month divorce."
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Remedy 4 */}
                                <div className="space-y-8 pt-12 border-t border-[#222]">
                                    <h3 className="text-white text-xl font-bold uppercase tracking-tight border-b border-[#222] pb-4">
                                        4. The "Ketu-Pivot" Protection: For the New Job
                                    </h3>
                                    <div className="grid md:grid-cols-12 gap-12 text-gray-300">
                                        <div className="md:col-span-8 space-y-8">
                                            <div className="p-8 bg-black border-l-4 border-white">
                                                <span className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-4 italic">The Logic Deep Dive</span>
                                                <p className="text-base leading-relaxed">You are starting a job in Sun-Ketu. Ketu in the 10th house makes you feel "invisible" or "replaced." You need to "tame" Ketu so it gives you authority instead of isolation.</p>
                                            </div>
                                            <div className="p-8 bg-white/5 border border-white/20 relative overflow-hidden group">
                                                <span className="text-white text-xs font-bold uppercase tracking-widest block mb-4 italic">The Living Sacrifice</span>
                                                <p className="text-white font-serif text-3xl mb-4 italic underline decoration-white/30 decoration-double">Feed a Stray Dog</p>
                                                <p className="text-sm text-gray-400 border-t border-white/10 pt-4 mt-6">Saturdays or Tuesdays (Preferably dark-colored)</p>
                                            </div>
                                            <div className="p-10 border border-[#222] bg-[#0A0A0A] font-serif italic text-lg text-white">
                                                "Dogs represent Bhairava/Ketu. When you satisfy the 'hunger' of Ketu externally, it stops 'gnawing' at your career internally."
                                            </div>
                                        </div>
                                        <div className="md:col-span-4 self-start">
                                            <div className="bg-white/5 p-8 border border-white/20 sticky top-10">
                                                <span className="text-white text-xs font-bold uppercase tracking-[0.3em] block mb-6">IMPACT</span>
                                                <p className="text-sm text-gray-200 leading-loose">
                                                    "This will dampen the office politics and the 'micromanaging boss' energy I warned you about."
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RULES & PRECAUTIONS */}
                            <div className="mt-32 p-12 bg-black border-2 border-[#1a1a1a] shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
                                <h4 className="text-white text-xl font-serif mb-12 border-b border-[#222] pb-6 uppercase tracking-[0.4em] text-center">Summary of Rules & Precautions</h4>
                                <div className="grid md:grid-cols-3 gap-16">
                                    <div className="space-y-6">
                                        <span className="text-[#FFD700] text-xs font-bold uppercase tracking-[0.2em] block border-b border-[#FFD700]/30 pb-2">The "21/48" Rule</span>
                                        <p className="text-sm text-gray-400 leading-relaxed italic border-l-2 border-[#111] pl-4">
                                            "Since you aren't doing 108, you must compensate with Intent. Do not chant while multitasking. If you get distracted, start the count over."
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        <span className="text-red-600 text-xs font-bold uppercase tracking-[0.2em] block border-b border-red-600/30 pb-2">The "Tongue" Precaution</span>
                                        <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-red-900 pl-4">
                                            <span className="text-red-500 font-bold">CRITICAL:</span> Your 3rd house Mars is your biggest "remedy killer." You can do all the mantras in the world, but if you use your tongue to belittle someone, you reset the karma to zero. <span className="text-white underline decoration-red-600 underline-offset-4">Silence is your most powerful remedy.</span>
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        <span className="text-white text-xs font-bold uppercase tracking-[0.2em] block border-b border-white/30 pb-2">Consistency Protocol</span>
                                        <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-[#111] pl-4">
                                            "Doing a remedy for 21 days straight is more powerful than doing it once a week for a year. Aim for a 48-day streak starting this coming Friday to 're-wire' your D-9 chart."
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-16 p-8 bg-[#00FF41]/5 border border-[#00FF41]/20 text-center">
                                    <span className="text-[#00FF41] text-[10px] font-bold uppercase tracking-[1em] block mb-4">Mechanism of Action</span>
                                    <p className="text-gray-200 text-lg font-serif italic max-w-2xl mx-auto leading-relaxed">
                                        "These aren't religious favors; they are frequency adjustments. You are currently vibrating at a 'Sun-Ketu' frequency (Anxiety/Loss). These remedies shift you to a 'Jupiter-Venus' frequency (Abundance/Stability)."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SAMPLE REPORT OVERVIEW */}
                    <section className="mt-48 mb-24 relative overflow-hidden p-16 border-t-8 border-double border-[#111]">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/10 to-transparent"></div>
                        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-12">
                            <div className="inline-block px-10 py-2 border-2 border-[#FFD700] text-[#FFD700] font-bold uppercase text-sm tracking-[1em] mb-4 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                                ORIGINAL SYSTEM LOG
                            </div>

                            <div className="space-y-6">
                                <p className="text-2xl font-serif text-white italic leading-relaxed">
                                    This is a <span className="text-[#FFD700] not-italic font-bold">Sample Digital Dossier</span>.
                                </p>
                                <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto font-serif">
                                    Your original report would be precision-engineered, completely custom to your unique natal structure, specific questions, remedies, and various other micro factors.
                                </p>
                                <div className="flex flex-col md:flex-row justify-center items-center gap-12 pt-8">
                                    <div className="text-center">
                                        <span className="block text-4xl text-white font-serif mb-2">6-12</span>
                                        <span className="text-xs text-gray-500 uppercase tracking-widest font-mono font-bold">Custom Pages</span>
                                    </div>
                                    <div className="w-[2px] h-12 bg-[#222] hidden md:block"></div>
                                    <div className="text-center">
                                        <span className="block text-4xl text-white font-serif mb-2">48+</span>
                                        <span className="text-xs text-gray-500 uppercase tracking-widest font-mono font-bold">Karmic Knots</span>
                                    </div>
                                    <div className="w-[2px] h-12 bg-[#222] hidden md:block"></div>
                                    <div className="text-center">
                                        <span className="block text-4xl text-white font-serif mb-2">1:1</span>
                                        <span className="text-xs text-gray-500 uppercase tracking-widest font-mono font-bold">Logic Ratio</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-16">
                                <a href="/reviews" className="group relative px-12 py-5 bg-transparent border-2 border-[#FFD700] text-[#FFD700] text-sm font-bold uppercase tracking-[0.5em] overflow-hidden transition-all duration-300 hover:text-black">
                                    <div className="absolute inset-0 bg-[#FFD700] translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10"></div>
                                    GENERATE PERSONA REPORT
                                </a>
                            </div>

                            <p className="text-[10px] text-gray-800 uppercase tracking-[1em] pt-12">
                                QUANTUM KARMA // DATA SOVEREIGNTY // VEDIC SCIENCE
                            </p>
                        </div>
                    </section>

                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
