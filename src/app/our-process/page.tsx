"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FaCrosshairs, FaSkull, FaChartPie, FaBolt, FaClock, FaCheckCircle, FaExclamationTriangle, FaTerminal, FaEye, FaMicroscope } from "react-icons/fa";
import TheVoid from "@/components/sections/TheVoid";

// --- INTERACTIVE COMPONENTS ---

function TypewriterText({ text, delay = 0 }: { text: string, delay?: number }) {
    const [displayedText, setDisplayedText] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setStarted(true), delay * 1000);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 30);
        return () => clearInterval(typingInterval);
    }, [text, started]);

    return (
        <span className="inline-block">
            {displayedText}
            {started && displayedText.length < text.length && (
                <span className="inline-block w-2 h-5 bg-[#FFD700] animate-pulse ml-1 align-middle"></span>
            )}
        </span>
    );
}

const vargaData = [
    {
        id: "D-9",
        name: "Navamasa",
        subtitle: "The DNA & Eventual Reality",
        desc: "The Lagna chart is the promise; the D-9 is the delivery. If a planet is exalted in D-1 but debilitated in D-9, the promise breaks. It looks good on paper, but fails in execution. This is where we see the actual, inescapable frequency of your life.",
        color: "from-purple-500/20 to-purple-900/10",
        borderColor: "border-purple-500/50"
    },
    {
        id: "D-10",
        name: "Dasamsa",
        subtitle: "Microscopic Power Dynamics",
        desc: "We don't look at your 10th house and guess your career. We open the D-10 to see exactly how you handle authority, when your ambition hits a concrete wall, and the precise mechanics of your public rises and career collapses.",
        color: "from-[#FFD700]/20 to-[#FFD700]/5",
        borderColor: "border-[#FFD700]/50"
    },
    {
        id: "D-7",
        name: "Saptamsa",
        subtitle: "Legacies & Creations",
        desc: "Not just children. The D-7 reveals your capacity to create and leave a legacy. If you are building a startup, writing a book, or birthing an idea, the D-7 determines whether your creation thrives or dies in infancy.",
        color: "from-green-500/20 to-green-900/10",
        borderColor: "border-green-500/50"
    },
    {
        id: "D-16",
        name: "Shodashamsa",
        subtitle: "Vehicles & Disasters",
        desc: "A highly specific chart detailing extreme comforts or sudden, violent losses regarding vehicles and physical vessels. Most astrologers ignore this, completely missing the mathematical probability of physical accidents.",
        color: "from-orange-500/20 to-orange-900/10",
        borderColor: "border-orange-500/50"
    },
    {
        id: "D-24",
        name: "Chaturvimshamsha",
        subtitle: "Intellectual Filtration",
        desc: "The absolute truth of your cognitive capacity. You might have Mercury exalted in D-1, making you sound smart, but a destroyed D-24 means you cannot grasp complex, abstract systems. This separates the imitators from the innovators.",
        color: "from-teal-500/20 to-teal-900/10",
        borderColor: "border-teal-500/50"
    },
    {
        id: "D-30",
        name: "Trimsamsa",
        subtitle: "The Skeleton Closet",
        desc: "The psychological rot and subconscious curses. This chart maps the trauma you cannot medicate away, hidden diseases, and the inherent flaws in your character that will self-sabotage your greatest wins if left unchecked.",
        color: "from-red-500/20 to-red-900/10",
        borderColor: "border-red-500/50"
    },
    {
        id: "D-40",
        name: "Khavedamsha",
        subtitle: "Matrilineal Karma",
        desc: "The deep, ancestral debt inherited strictly from the mother's bloodline. Certain unexplained blockages in wealth or mental peace map directly back to unfulfilled vows in the maternal geometry.",
        color: "from-pink-500/20 to-pink-900/10",
        borderColor: "border-pink-500/50"
    },
    {
        id: "D-60",
        name: "Shashtiamsa",
        subtitle: "The Root Karma",
        desc: "The ultimate microscopic division. This reveals exactly what you did in the last lifetime that is actively hunting you in this one. This is the bedrock of why certain patterns feel completely inescapable until paid off.",
        color: "from-blue-500/20 to-blue-900/10",
        borderColor: "border-blue-500/50"
    }
];

function ShodasavargaScanner() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="bg-[#0a000f] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-5xl mx-auto mt-12 transition-all duration-500">
            {/* Header Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto custom-scrollbar bg-black/50">
                {vargaData.map((varga, idx) => (
                    <button
                        key={varga.id}
                        onClick={() => setActiveTab(idx)}
                        className={`flex-1 min-w-[100px] shrink-0 py-4 px-3 text-center border-b-2 font-mono uppercase tracking-widest text-[10px] md:text-sm transition-all duration-300 ${activeTab === idx ? "border-[#FFD700] text-[#FFD700] bg-white/[0.02]" : "border-transparent text-gray-500 hover:text-white hover:bg-white/[0.01]"
                            }`}
                    >
                        {varga.id}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className={`p-8 md:p-12 relative overflow-hidden transition-colors duration-700 bg-gradient-to-br ${vargaData[activeTab].color}`}>
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${vargaData[activeTab].color} blur-[100px] opacity-50`}></div>
                <div className="absolute top-4 right-6 font-serif text-[8rem] md:text-[12rem] font-black text-white/[0.02] pointer-events-none select-none leading-none">
                    {vargaData[activeTab].id}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(0px)" }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10"
                    >
                        <h3 className="font-serif text-3xl md:text-5xl font-bold text-white mb-2">{vargaData[activeTab].name}</h3>
                        <p className={`font-mono text-xs md:text-sm uppercase tracking-[0.2em] font-bold mb-8 inline-block px-3 py-1 border ${vargaData[activeTab].borderColor} bg-black/50 rounded`}>
                            {vargaData[activeTab].subtitle}
                        </p>
                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl font-light">
                            {vargaData[activeTab].desc}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.5);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,215,0,0.5);
                }
            `}</style>
        </div>
    );
}


// --- MAIN PAGE COMPONENT ---

export default function OurProcessInteractive() {
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <main className="min-h-screen bg-[#050008] text-white selection:bg-[#FFD700] selection:text-[#12011A] font-sans overflow-x-hidden">
            {/* Minimalist Grid Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-20 z-0"></div>

            {/* 1. HERO - THE HOOK */}
            <motion.section style={{ y: yHero, opacity: opacityHero }} className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 border-b border-white/5 z-10">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
                        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        <FaCrosshairs className="text-[#FFD700] text-4xl mx-auto mb-8 opacity-80" />
                        <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] font-black mb-6 uppercase tracking-tighter text-white leading-none">
                            THE <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-yellow-800">PROTOCOL</span>
                        </h1>
                    </motion.div>

                    <div className="mt-12 p-6 md:p-8 bg-black/40 border border-red-900/30 rounded-xl backdrop-blur-sm max-w-3xl mx-auto inline-block text-left shadow-[0_0_40px_rgba(255,0,0,0.05)] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                        <FaTerminal className="text-red-500 mb-4 text-xl" />
                        <p className="font-mono text-lg md:text-xl text-red-100/90 leading-relaxed">
                            <TypewriterText text="Astrology was never meant to make you feel good. It is the mathematics of your karma." delay={0.5} />
                        </p>
                        <p className="font-mono text-sm text-red-500/70 mt-4 uppercase tracking-widest mt-6 opacity-0 animate-[fadeIn_1s_ease-out_3s_forwards]">
                            We do not do "vibes". We execute precision cosmology.
                        </p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
                >
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Initialize</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
                </motion.div>
            </motion.section>

            {/* 2. D-1 ILLUSION */}
            <section className="py-32 px-6 relative z-10 bg-gradient-to-b from-[#050008] to-[#12011A]">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="font-serif text-4xl md:text-6xl font-bold text-white mb-8"
                    >
                        The Illusion of the D-1
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-3xl text-gray-400 font-light leading-relaxed mb-12"
                    >
                        Reading only the Lagna Chart is like diagnosing a car engine by looking at the paint job.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl text-left"
                    >
                        <p className="text-gray-300 leading-relaxed md:text-lg">
                            Most astrologers live and die by this basic map, diagnosing your entire existence from a surface-level scan. If your reading is based solely on the rising sign and D-1 placements, you are receiving an amateur summary, not a cosmic roadmap. <strong className="text-[#FFD700] block mt-4 text-xl font-serif">We strip the paint and dismantle the engine block.</strong>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 3. THE SHODASAVARGA SYNTHESIS */}
            <section className="py-32 px-6 relative z-10 border-t border-white/5 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            The Shodasavarga Synthesis
                        </h2>
                        <p className="text-gray-400 font-mono text-sm uppercase tracking-[0.3em]">
                            The 16-Dimensional X-Ray
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <ShodasavargaScanner />
                    </motion.div>
                </div>
            </section>

            {/* 4. PLANETARY AUTOPSY */}
            <section className="py-32 px-6 relative z-10 bg-[#0a000f] border-t border-white/5">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <FaSkull className="text-[#FFD700] text-4xl mb-6" />
                        <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Planetary Autopsy
                        </h2>
                        <h3 className="text-[#FFD700] font-mono text-xs tracking-[0.2em] uppercase mb-8 font-bold border-l-2 border-[#FFD700] pl-3">
                            Beyond "Exalted" & "Debilitated"
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            "You have an exalted sun, you will be successful." It is a lie propagated by the ignorant. A planet's dignity is irrelevant if it lacks mathematical power and operational capacity.
                        </p>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            We execute a full autopsy using <strong className="text-white">Shadbala</strong> (6-fold strength) and <strong className="text-white">Avasthas</strong> (Planetary states). We calculate the exact mathematical yield of every planet.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-[#12011A] border border-red-900/30 p-8 md:p-10 rounded-2xl relative shadow-[0_0_50px_rgba(255,0,0,0.05)]"
                    >
                        <div className="absolute -top-3 left-8 bg-red-900 text-white font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded shadow-lg flex items-center gap-2">
                            <FaExclamationTriangle /> LIVE DATA EXAMPLE
                        </div>

                        <div className="mb-8 mt-4">
                            <h4 className="text-white font-serif text-2xl mb-1">Exalted Sun <span className="text-gray-500 font-sans text-lg">(10th House)</span></h4>
                            <p className="font-mono text-xs text-red-400 uppercase tracking-wider mb-6">State: Mrit Avastha (Dead King)</p>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-mono uppercase text-gray-400 mb-2">
                                        <span>Perceived Power (Ego)</span>
                                        <span className="text-white">98%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: "98%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gray-400"></motion.div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-mono uppercase text-gray-400 mb-2">
                                        <span>Actual Mathematical Yield (Bank Account)</span>
                                        <span className="text-[#FFD700] font-bold">12%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: "12%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]"></motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-500 italic text-sm border-t border-white/10 pt-4">
                            "It gives you the ego of a CEO but the bank account of an intern. Looks powerful, yields nothing."
                        </p>
                    </motion.div>
                </div>
            </section>

            
            {/* 5. HIDDEN MECHANICS (Arudha & Padas) */}
            <section className="py-32 px-6 relative z-10 border-t border-white/5">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-black/40 border border-[#FFD700]/10 p-8 md:p-12 rounded-2xl flex flex-col justify-center"
                    >
                        <FaEye className="text-blue-400 text-3xl mb-6" />
                        <h3 className="font-serif text-3xl text-white mb-2">Arudha Lagna (AL)</h3>
                        <p className="font-mono text-xs uppercase tracking-widest text-blue-500 mb-6">The Illusion of Perception</p>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            The Lagna is who you. The Arudha Lagna is who the world *thinks* you are. Most astrologers ignore this, leading to massive predictive failures regarding fame and reputation.
                        </p>
                        <div className="mt-auto bg-blue-900/10 p-4 border-l-2 border-blue-500/50 rounded-r">
                            <p className="font-mono text-xs text-blue-200 leading-relaxed">
                                If you have an impoverished Lagna but a stacked AL, you will be broke but the world will perceive you as royalty. We decode the maya (illusion) attached to your societal standing.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-black/40 border border-[#FFD700]/10 p-8 md:p-12 rounded-2xl flex flex-col justify-center"
                    >
                        <FaMicroscope className="text-teal-400 text-3xl mb-6" />
                        <h3 className="font-serif text-3xl text-white mb-2">Nakshatra Padas</h3>
                        <p className="font-mono text-xs uppercase tracking-widest text-teal-500 mb-6">The 108 Micro-Frequencies</p>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            A zodiac sign is 30 degrees. This is too broad. We drill down into the 27 Nakshatras (13°20') and further into their 4 Padas (3°20' chunks). This is the absolute atomic level of Jyotish.
                        </p>
                        <div className="mt-auto bg-teal-900/10 p-4 border-l-2 border-teal-500/50 rounded-r">
                            <p className="font-mono text-xs text-teal-200 leading-relaxed">
                                Two people born with Jupiter in Aries will have completely different destinies if one is in Ashwini Pada 1 and the other in Krittika Pada 4. We target the exact Pada logic.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 6. JAIMINI'S CORE ENGINE */}
            <section className="py-32 px-6 relative z-10 border-t border-white/5">
                <div className="max-w-6xl mx-auto text-center mb-16">
                    <FaBolt className="text-[#FFD700] text-4xl mx-auto mb-6" />
                    <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Jaimini’s Core Engine
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Parashari limits you to the mechanics of circumstance. Jaimini forces you to confront the agony of your soul's agenda.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-black/50 border border-white/10 p-8 md:p-12 rounded-2xl group hover:border-purple-500/30 hover:bg-[#1a0524]/20 transition-all duration-500"
                    >
                        <h4 className="font-serif text-3xl text-white mb-2 group-hover:text-purple-400 transition-colors">Atmakaraka</h4>
                        <p className="font-mono text-xs uppercase tracking-widest text-purple-500 mb-6">The Soul's Director</p>
                        <p className="text-gray-400 leading-relaxed">
                            The soul's agonizing lesson. The absolute ceiling of your spiritual and material evolution in this lifetime. Everything flows downstream from this single planet.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-black/50 border border-white/10 p-8 md:p-12 rounded-2xl group hover:border-[#FFD700]/30 hover:bg-[#1a1805]/20 transition-all duration-500"
                    >
                        <h4 className="font-serif text-3xl text-white mb-2 group-hover:text-[#FFD700] transition-colors">Amatyakaraka</h4>
                        <p className="font-mono text-xs uppercase tracking-widest text-[#FFD700] mb-6">The Executioner</p>
                        <p className="text-gray-400 leading-relaxed">
                            The minister that executes the agenda. The raw planetary force driving your career, survival, and worldly ambition.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto mt-8 bg-red-900/10 border border-red-900/40 p-6 md:p-8 rounded-2xl text-center"
                >
                    <p className="text-red-200/90 font-mono text-sm leading-relaxed">
                        When these two clash (e.g., positioned 6/8 from each other), it creates a life of <strong className="text-red-400">internal warfare</strong>, regardless of how good the Parashari yogas look on paper. We map the friction.
                    </p>
                </motion.div>
            </section>

            {/* 7. MATRIX OF TIME & ASHTAKAVARGA (Combined dark execution) */}
            <section className="py-32 px-6 relative z-10 bg-[#0a000f] border-t border-b border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20 transform -skew-y-12"></div>

                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
                    {/* Matrix of Time */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <FaClock className="text-[#FFD700] text-3xl mb-6" />
                        <h2 className="font-serif text-4xl text-white mb-4">The Matrix of Time</h2>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            Time is not a circle; it is a highly targeted sequence. We do not just look at the Mahadasha (10-20 year cycles) and offer broad, useless generalizations. We drill down to the <strong className="text-white">Pratyantar</strong> (months) and <strong className="text-white">Sookshma</strong> (days) levels.
                        </p>

                        <div className="bg-black/80 border border-green-900/50 p-6 rounded-xl font-mono text-xs md:text-sm text-green-500 shadow-[0_0_30px_rgba(0,255,0,0.03)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                            <div className="mb-3 text-green-400/50 uppercase tracking-widest">// TACTICAL INTELLIGENCE</div>
                            <p className="leading-relaxed">
                                &gt; We pinpoint the exact week your 8th Lord activates your 22nd Drekkana.<br /><br />
                                &gt; Warning dispatched for specific financial or physical ambushes before they strike.<br /><br />
                                <span className="text-[#FFD700] font-bold">&gt; Forewarning is absolute leverage.</span>
                            </p>
                        </div>
                    </motion.div>

                    {/* Ashtakavarga & Nadi */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <FaCrosshairs className="text-[#FFD700] text-3xl mb-6" />
                        <h2 className="font-serif text-4xl text-white mb-4">The Reality Check</h2>
                        <h3 className="text-red-400 font-mono text-xs tracking-[0.2em] uppercase mb-6 font-bold">
                            Ashtakavarga Rekhas & Nadi Transits
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            General astrology claims that Jupiter transiting your 2nd house guarantees wealth. This is mathematically false.
                        </p>
                        <blockquote className="border-l-4 border-red-600 pl-6 my-8 py-2">
                            <p className="text-2xl font-serif text-white italic leading-snug">
                                "A great transit of Jupiter means absolutely nothing if it hits a house with less than 25 Ashtakavarga points (Rekhas). <span className="text-red-500 font-bold not-italic">It is a bullet fired from an empty gun.</span>"
                            </p>
                        </blockquote>
                        <p className="text-gray-400 leading-relaxed">
                            We use point-based transit overlays to predict concrete events, discarding "vibes." By synthesizing Nadi transit rules with Ashtakavarga thresholds, we separate what <span className="italic text-gray-300">could</span> happen from what <strong className="text-[#FFD700]">will</strong> happen.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 8. THE SUMMARY / EXPOSURE */}
            <section className="py-32 px-6 relative z-10">
                <div className="max-w-5xl mx-auto bg-[#12011A] border border-[#FFD700]/20 rounded-3xl p-8 md:p-16 text-center shadow-[0_0_100px_rgba(255,215,0,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 bg-white/5 border-b border-l border-white/10 text-gray-500 font-mono text-[10px] uppercase tracking-widest rounded-bl-xl">
                        CONFIDENTIAL PROTOCOL
                    </div>

                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-16">The Absolute Divide</h2>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-16 text-left">
                        {/* The Scam */}
                        <div className="space-y-6">
                            <h3 className="font-mono text-sm uppercase tracking-widest text-gray-500 border-b border-white/10 pb-4">Surface-Level "Astrology"</h3>
                            <ul className="space-y-4 font-light text-gray-400">
                                <li className="flex gap-3"><FaCheckCircle className="text-gray-600 shrink-0 mt-1" /> Generalizes complete 30° zodiac signs.</li>
                                <li className="flex gap-3"><FaCheckCircle className="text-gray-600 shrink-0 mt-1" /> Uses only the D-1 Lagna chart.</li>
                                <li className="flex gap-3"><FaCheckCircle className="text-gray-600 shrink-0 mt-1" /> Calls planets "Good" or "Bad" based on basic signs.</li>
                                <li className="flex gap-3"><FaCheckCircle className="text-gray-600 shrink-0 mt-1" /> Predicts 10-year Mahadasha periods vaguely.</li>
                                <li className="flex gap-3"><FaCheckCircle className="text-gray-600 shrink-0 mt-1" /> Relies on pop-psychology and feel-good validation.</li>
                            </ul>
                        </div>

                        {/* The Reality */}
                        <div className="space-y-6">
                            <h3 className="font-mono text-sm uppercase tracking-widest text-[#FFD700] border-b border-[#FFD700]/30 pb-4">Our Geometric Synthesis</h3>
                            <ul className="space-y-4 font-light text-white">
                                <li className="flex gap-3"><FaCheckCircle className="text-[#FFD700] shrink-0 mt-1" /> Drills down into the 108 Nakshatra Padas (3°20' micro-zodiac).</li>
                                <li className="flex gap-3"><FaCheckCircle className="text-[#FFD700] shrink-0 mt-1" /> Deploys 16 Divisional Charts for exact life mechanics.</li>
                                <li className="flex gap-3"><FaCheckCircle className="text-[#FFD700] shrink-0 mt-1" /> Calculates exact yield via Shadbala & mathematical strength.</li>
                                <li className="flex gap-3"><FaCheckCircle className="text-[#FFD700] shrink-0 mt-1" /> Isolates strikes down to Sookshma (days) and transit overlays.</li>
                                <li className="flex gap-3"><FaCheckCircle className="text-[#FFD700] shrink-0 mt-1" /> Delivers uncompromising reality and tactical leverage.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <TheVoid />
        </main>
    );
}
