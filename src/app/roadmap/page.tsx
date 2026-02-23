"use client";

import React from 'react';
import TheVoid from '@/components/sections/TheVoid';

export default function RoadmapPage() {
    const roadmapItems = [
        {
            id: "01",
            title: "Voice Frequency Analysis",
            status: "IN DEVELOPMENT",
            color: "#FF3366",
            mechanism: "AI analyzes the user's vocal cadence, pitch, and micro-tremors to detect elemental imbalances (e.g., excess Fire/Pitta, deficient Earth).",
            output: "Recommends specific Bija (seed) mantras at precise Hz frequencies to harmonize their current energetic state, acting as an instant 'vibrational reset'."
        },
        {
            id: "02",
            title: "Real-Time Dasha Danger Zones",
            status: "UPCOMING",
            color: "#00FF41",
            mechanism: "Syncs their Dasha/Antardasha (planetary periods) with real-time transit data and calendar APIs (like Google Calendar/Apple Calendar).",
            output: "Pushes notifications warning against scheduling crucial meetings (like VC pitches or contract signings) during acute Rahu-Ketu or Combustion windows, acting as a karmic risk-management tool."
        },
        {
            id: "04",
            title: "The Karmic Debt Tracker",
            status: "IN DESIGN",
            color: "#FFD700",
            mechanism: "An AI-driven ledger based on the user's 8th and 12th house placements.",
            output: "Users log specific interpersonal conflicts or financial losses. The AI categorizes these events into 'Karmic Payments' (unavoidable, meant for learning) vs. 'Ego Errors' (avoidable, stemming from current bad habits), providing savage clarity on why things failed."
        },
        {
            id: "06",
            title: "The 'Remedy Streak' Engine",
            status: "PLANNED",
            color: "#B026FF",
            mechanism: "Gamified habit tracker for prescribed remedies (like the 21/48 rule).",
            output: "Uses an AI 'Vedic Analyst' persona to aggressively hold users accountable. 'You missed your Thursday Jupiter donation. The universe doesn't do extensions. Streak reset to zero. Start again.'"
        },
        {
            id: "08",
            title: "AI Dream Decoder",
            status: "RESEARCH",
            color: "#00CBFF",
            mechanism: "Users input recurring dreams or nightmares via text or voice note.",
            output: "The AI maps dream symbols to their current planetary transits. 'You are dreaming of teeth falling out while transitioning into a Sun period. This isn't stress; this is your ego resisting the necessary death of your old identity. Stop fighting it.'"
        },
        {
            id: "09",
            title: "The 'Sade Sati' Survival Kit",
            status: "PLANNED",
            color: "#FFA500",
            mechanism: "A specialized dashboard activated only when a user enters their 7.5-year Saturn transit (Sade Sati).",
            output: "A brutal, survival-mode interface that tracks the phase of Saturn, predicting the specific area of life under attack (finances, health, or ego) and providing real-time, mandatory grounding exercises."
        },
        {
            id: "12",
            title: "'Vargottama' Strength Identifier",
            status: "IN DEVELOPMENT",
            color: "#FF3366",
            mechanism: "Scans all divisional charts (D-1 to D-60) for planets in identical signs.",
            output: "Highlights the user's absolute, unbreakable, inherent superpower. 'Your Mars is Vargottama. Stop trying to be diplomatic. You are a weapon. Be the weapon.'"
        },
        {
            id: "13",
            title: "Personalized Geometric Yantras",
            status: "UPCOMING",
            color: "#FFD700",
            mechanism: "Based on the user's weakest planetary placements.",
            output: "AI generates a unique, visually stunning sacred geometry Yantra. The user is instructed to set it as their lock screen to passively visually program their subconscious frequency every time they check their phone."
        },
        {
            id: "15",
            title: "Financial Transit Predictor",
            status: "IN DESIGN",
            color: "#00FF41",
            mechanism: "Analyzes real-time transits over the houses of wealth (2nd) and gain (11th).",
            output: "Identifies micro-windows for aggressive risk-taking vs. absolute capital preservation. 'Jupiter just aspected your 11th house. Ask for the raise today. Next week is a dead zone.'"
        },
        {
            id: "16",
            title: "The 'Shadow Self' AI Chatbot",
            status: "RESEARCH",
            color: "#B026FF",
            mechanism: "An AI trained specifically on the user's Rahu (North Node) placement constraints.",
            output: "Users can converse with their 'unconscious desires.' It forces them to confront the greedy, obsessive, or erratic parts of their psyche they usually hide from themselves to prevent blowing up their lives."
        },
        {
            id: "20",
            title: "Quantum End-of-Life Calculator",
            status: "CLASSIFIED",
            color: "#333333",
            mechanism: "Extreme, deep-dive analysis of the 8th, 12th, and D-9 charts, focusing on Ketu.",
            output: "Not predicting physical death, but defining what the user must 'let go of' before they die to achieve spiritual liberation (Moksha). It is a stark, absolute list of attachments they are carrying that serve no purpose."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#FFD700] selection:text-black font-sans antialiased overflow-x-hidden">

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto border-b border-[#222]">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFD700]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

                <div className="relative z-10 max-w-4xl">
                    <h5 className="font-mono text-[#FFD700] tracking-[0.5em] text-xs uppercase mb-6 flex items-center gap-4">
                        <span className="w-8 h-[1px] bg-[#FFD700]"></span>
                        The Future of Spiritual Tech
                    </h5>
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                        Quantum <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">
                            Roadmap
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-2xl">
                        We are building the most advanced karmic architecture engine on the planet. This is not generic astrology. This is <span className="text-white font-bold">weaponized planetary data</span> and <span className="text-white font-bold">AI.</span>
                    </p>
                </div>
            </section>

            {/* ROADMAP GRID */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {roadmapItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="group relative bg-[#050505] border border-[#222] hover:border-[#444] transition-colors p-8 md:p-12 overflow-hidden"
                        >
                            {/* Hover Gradient Background */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none"
                                style={{ background: `linear-gradient(135deg, transparent, ${item.color})` }}
                            />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-8">
                                    <span
                                        className="font-mono text-sm tracking-[0.3em] font-bold"
                                        style={{ color: item.color }}
                                    >
                                        {item.id} //
                                    </span>
                                    <span className="px-3 py-1 bg-[#111] border border-[#333] font-mono text-[10px] uppercase tracking-widest text-gray-500">
                                        {item.status}
                                    </span>
                                </div>

                                <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-8">
                                    {item.title}
                                </h3>

                                <div className="space-y-6 mt-auto">
                                    <div className="bg-black p-6 border-l-2" style={{ borderColor: item.color }}>
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2 block font-bold">The Mechanism</span>
                                        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                            {item.mechanism}
                                        </p>
                                    </div>

                                    <div className="bg-[#111] p-6 border border-[#222] group-hover:bg-[#151515] transition-colors">
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-white mb-2 block font-bold">The Output</span>
                                        <p className="text-gray-400 text-sm md:text-base leading-relaxed italic">
                                            "{item.output}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-32 px-6 border-t border-[#222] text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FFD700]/5 pointer-events-none"></div>
                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                        Be Ready.
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl font-light">
                        These features will roll out exclusively to early adopters of the Quantum Karma ecosystem.
                    </p>
                    <div className="pt-8">
                        <a href="/report" className="px-10 py-5 bg-white text-black font-bold text-sm uppercase tracking-[0.3em] hover:bg-[#FFD700] transition-colors inline-block">
                            Get Your Persona Report First
                        </a>
                    </div>
                </div>
            </section>

            <TheVoid />
        </div>
    );
}
