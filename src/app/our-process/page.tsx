"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaCrosshairs, FaSkull, FaChartPie, FaBolt, FaClock, FaCheckCircle } from "react-icons/fa";
import TheVoid from "@/components/sections/TheVoid";

const sections = [
    {
        id: "01",
        icon: <FaCrosshairs className="text-[#FFD700] text-3xl" />,
        title: "The Illusion of the D-1",
        subtitle: "Why Most Astrologers Lie to You",
        content: (
            <>
                <p className="text-gray-400 leading-relaxed mb-4">
                    The D-1 (Lagna Chart) is just the physical shell. Most astrologers live and die by this basic map, diagnosing your entire existence from a surface-level scan.
                </p>
                <p className="text-gray-300 font-bold border-l-2 border-[#FFD700] pl-4 italic">
                    Reading only the D-1 is like diagnosing a car engine by looking at the paint job.
                </p>
                <p className="text-gray-400 leading-relaxed mt-4">
                    If your reading is based solely on the rising sign and D-1 placements, you are receiving an amateur summary, not a cosmic roadmap. We strip the paint and dismantle the engine block.
                </p>
            </>
        )
    },
    {
        id: "02",
        icon: <FaChartPie className="text-[#FFD700] text-3xl" />,
        title: "The Shodasavarga Synthesis",
        subtitle: "The 16-Dimensional X-Ray",
        content: (
            <>
                <p className="text-gray-400 leading-relaxed mb-6">
                    We deploy exact divisional charts (Vargas) to isolate the precise mechanisms of your karma. The Lagna chart is the promise; the divisional charts are the delivery.
                </p>
                <ul className="space-y-4">
                    <li className="bg-[#1a0524]/50 border border-white/10 p-4 rounded-lg">
                        <strong className="text-white text-lg block mb-1">D-9 (Navamasa)</strong>
                        <span className="text-gray-400 text-sm">The DNA and ultimate fruition of life. If a planet is strong in D-1 but dead in D-9, the promise breaks.</span>
                    </li>
                    <li className="bg-[#1a0524]/50 border border-white/10 p-4 rounded-lg">
                        <strong className="text-white text-lg block mb-1">D-10 (Dasamsa)</strong>
                        <span className="text-gray-400 text-sm">The microscopic mechanics of power, authority, and career collapses. We see exactly where your ambition hits a concrete wall.</span>
                    </li>
                    <li className="bg-[#1a0524]/50 border border-white/10 p-4 rounded-lg">
                        <strong className="text-white text-lg block mb-1">D-30 (Trimsamsa)</strong>
                        <span className="text-gray-400 text-sm">The skeleton closet. Subconscious curses, hidden diseases, and psychological rot. The trauma you cannot medicate away.</span>
                    </li>
                    <li className="bg-[#1a0524]/50 border border-white/10 p-4 rounded-lg">
                        <strong className="text-white text-lg block mb-1">D-60 (Shashtiamsa)</strong>
                        <span className="text-gray-400 text-sm">The root karma. What you did in the last lifetime that is actively hunting you in this one.</span>
                    </li>
                </ul>
            </>
        )
    },
    {
        id: "03",
        icon: <FaSkull className="text-[#FFD700] text-3xl" />,
        title: "Planetary Autopsy",
        subtitle: "Beyond 'Exalted' and 'Debilitated'",
        content: (
            <>
                <p className="text-gray-400 leading-relaxed mb-4">
                    "You have an exalted sun, you will be successful." It is a lie propagated by the ignorant. A planet's dignity is irrelevant if it lacks mathematical power and operational capacity.
                </p>
                <p className="text-gray-400 leading-relaxed mb-6">
                    We execute a full autopsy using <strong className="text-white">Shadbala</strong> (6-fold strength) and <strong className="text-white">Avasthas</strong> (Planetary states). We calculate the exact mathematical yield of every planet.
                </p>
                <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 p-5 rounded-lg flex items-start gap-4">
                    <span className="text-2xl mt-1">⚠️</span>
                    <p className="text-gray-300 font-mono text-sm leading-relaxed">
                        <span className="text-[#FFD700] font-bold">EXAMPLE:</span> An exalted Sun at 29 degrees in the 10th house is a dead king (Mrit Avastha). It gives you the ego of a CEO but the bank account of an intern. Looks powerful, yields nothing.
                    </p>
                </div>
            </>
        )
    },
    {
        id: "04",
        icon: <FaBolt className="text-[#FFD700] text-3xl" />,
        title: "Jaimini’s Core Engine",
        subtitle: "The Soul vs. The World",
        content: (
            <>
                <p className="text-gray-400 leading-relaxed mb-4">
                    Parashari limits you to the mechanics of circumstance. Jaimini forces you to confront the agony of your soul's agenda.
                </p>
                <ul className="space-y-4 mb-4">
                    <li className="flex gap-3 items-start">
                        <FaCheckCircle className="text-[#FFD700] mt-1 shrink-0" />
                        <div>
                            <strong className="text-white text-sm tracking-wider uppercase">Atmakaraka</strong>
                            <p className="text-gray-400 text-sm">The soul's agonizing lesson. The absolute ceiling of your spiritual and material evolution.</p>
                        </div>
                    </li>
                    <li className="flex gap-3 items-start">
                        <FaCheckCircle className="text-[#FFD700] mt-1 shrink-0" />
                        <div>
                            <strong className="text-white text-sm tracking-wider uppercase">Amatyakaraka</strong>
                            <p className="text-gray-400 text-sm">The minister that executes the agenda. The raw planetary force driving your career and survival.</p>
                        </div>
                    </li>
                </ul>
                <p className="text-gray-300 bg-white/5 p-4 rounded-lg font-mono text-sm border-l-2 border-red-500">
                    When these two clash (e.g., positioned 6/8 from each other), it creates a life of internal warfare, regardless of how good the Parashari yogas look on paper. We map the friction.
                </p>
            </>
        )
    },
    {
        id: "05",
        icon: <FaClock className="text-[#FFD700] text-3xl" />,
        title: "The Matrix of Time",
        subtitle: "Vimshottari & Micro-Dashas",
        content: (
            <>
                <p className="text-gray-400 leading-relaxed mb-4">
                    Time is not a circle; it is a highly targeted sequence. We do not just look at the Mahadasha (10-20 year cycles) and offer broad, useless generalizations.
                </p>
                <p className="text-gray-400 leading-relaxed mb-6">
                    We drill down to the <strong className="text-white">Pratyantar</strong> (months) and <strong className="text-white">Sookshma</strong> (days) levels. If a collapse is coming, we track its exact coordinates on the timeline.
                </p>
                <div className="bg-[#0f0f0f] border border-[#333] p-5 font-mono text-xs rounded-lg">
                    <div className="text-[#FFD700] mb-2">{`// TACTICAL INTELLIGENCE`}</div>
                    <div className="text-gray-400 leading-relaxed">
                        We pinpoint the exact week your 8th Lord activates your 22nd Drekkana, warning you of specific financial or physical ambushes before they strike. Forewarning is absolute leverage.
                    </div>
                </div>
            </>
        )
    },
    {
        id: "06",
        icon: <FaCrosshairs className="text-[#FFD700] text-3xl" />,
        title: "Ashtakavarga & Nadi Transits",
        subtitle: "The Reality Check",
        content: (
            <>
                <p className="text-gray-400 leading-relaxed mb-4">
                    General astrology claims that Jupiter transiting your 2nd house guarantees wealth. This is mathematically false.
                </p>
                <p className="text-gray-400 leading-relaxed mb-6">
                    A "great transit" of Jupiter means absolutely nothing if it hits a house with less than 25 Ashtakavarga points. <strong className="text-white">It is a bullet fired from an empty gun.</strong>
                </p>
                <p className="text-gray-400 leading-relaxed">
                    We use point-based transit overlays to predict concrete events, discarding "vibes." By synthesizing Nadi transit rules with Ashtakavarga thresholds, we separate what <span className="italic">could</span> happen from what <strong className="text-[#FFD700]">will</strong> happen.
                </p>
            </>
        )
    }
];

export default function OurProcess() {
    return (
        <main className="min-h-screen bg-[#12011A] text-white selection:bg-[#FFD700] selection:text-[#12011A] font-sans">
            {/* Minimalist Grid Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-20"></div>

            {/* Header */}
            <section className="relative pt-32 pb-20 px-6 border-b border-white/5">
                <div className="max-w-5xl mx-auto text-left md:text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black mb-6 uppercase tracking-tighter text-white">
                            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-[#FFD700] to-yellow-600">PROTOCOL</span>
                        </h1>
                        <p className="text-gray-400 max-w-3xl md:mx-auto text-lg md:text-xl font-light leading-relaxed">
                            We do not deal in hope. We deal in cosmological mechanics. Below is the uncompromising, multi-layered framework used to dismantle your psychological limits and map your stark reality.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* The Process Grid */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 md:p-10 hover:border-[#FFD700]/30 hover:bg-[#1a0524]/40 transition-all duration-500 overflow-hidden relative"
                            >
                                {/* Background Number Watermark */}
                                <div className="absolute -top-6 -right-4 text-[120px] font-black text-white/[0.02] group-hover:text-[#FFD700]/[0.05] transition-colors duration-500 select-none pointer-events-none font-serif leading-none">
                                    {section.id}
                                </div>

                                <div className="relative z-10">
                                    <div className="mb-6 inline-flex p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-[#FFD700]/10 group-hover:border-[#FFD700]/20 transition-all">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 tracking-tight group-hover:text-[#FFD700] transition-colors">
                                        {section.title}
                                    </h2>
                                    <h3 className="text-[#FFD700] font-mono text-xs tracking-[0.2em] uppercase mb-6 font-bold">
                                        {section.subtitle}
                                    </h3>
                                    <div className="text-gray-400 space-y-4 font-light">
                                        {section.content}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <TheVoid />
        </main>
    );
}
