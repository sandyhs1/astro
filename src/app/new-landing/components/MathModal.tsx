"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface MathModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MathModal({ isOpen, onClose }: MathModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl overflow-hidden flex flex-col shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-amber-100"
                    >
                        {/* Header */}
                        <div className="relative flex items-center justify-between p-6 md:p-8 bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-b border-amber-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white rounded-full shadow-sm border border-amber-100">
                                    <Sparkles className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">High-Precision Data Audits</h2>
                                    <p className="text-gray-600 font-medium text-sm md:text-base mt-1">Complete Reality Check of a sophisticated intelligence report rather than a horoscope.</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar" data-lenis-prevent>
                            <div className="space-y-12">

                                {/* USP Section */}
                                <div className="bg-gradient-to-br from-indigo-50 to-rose-50 p-6 md:p-8 rounded-2xl border border-indigo-100 relative overflow-hidden">
                                    <div className="absolute -right-10 -top-10 text-indigo-500/10 pointer-events-none">
                                        <Sparkles size={120} />
                                    </div>
                                    <h3 className="text-xl font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="text-indigo-500" />
                                        The Secret USP: Chalit Chart Mastery
                                    </h3>
                                    <p className="text-indigo-800/80 leading-relaxed font-medium">
                                        We use the Chalit (Actual Bhava) position. If a planet is at 29 degrees in the 1st house, it has already moved to the 2nd house. Most apps miss this. This Hard Fact makes the user realize every other app they've used is mathematically wrong.
                                    </p>
                                </div>

                                <div className="text-center">
                                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">The Technical Specification</h2>
                                    <p className="text-rose-500 font-bold mt-2 text-lg">30 Data-Audit Features</p>
                                </div>

                                {/* I. Advanced Predictive Engineering */}
                                <section>
                                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-amber-200 pb-3 mb-6 flex items-center gap-3">
                                        <span className="text-amber-500">I.</span> Advanced Predictive Engineering
                                    </h3>
                                    <ul className="space-y-5">
                                        {[
                                            { t: "D-60 (Shastiamsa) Forensic Audit", d: "The most granular divisional chart. We decode the Moola (Root) karma that D-1 and D-9 cannot see. This is the ultimate Why behind your unexplainable life patterns." },
                                            { t: "Upapada Lagna (UL) Lifecycle Mapping", d: "We don't predict love; we calculate the functional lifespan and legal stability of marital contracts. Identifying the specific Antardasha that triggers union or dissolution." },
                                            { t: "Real-Estate Liquidity Windows", d: "Analysis of the 4th House and Mars-Saturn vectors to identify the exact months for capital deployment in property or high-risk exits." },
                                            { t: "Investment Volatility Index", d: "Calculating your 5th and 11th House Speculation Scores to determine if your chart supports high-leverage trading or requires conservative asset allocation." },
                                            { t: "Karmic Debt (Rina) Algorithm", d: "Identifying the 6th/9th house Inherited Liabilities using Rahu/Ketu nodes to see where you are paying for ancestral financial or health patterns." },
                                            { t: "Migration & Displacement Probability", d: "Calculating the 4th House (Home) vs. 12th House (Foreign) strength to predict permanent relocation or temporary exile timelines." },
                                            { t: "Litigation & Conflict Latency", d: "A 6th House stress-test to identify periods of high vulnerability to legal sabotage, tax audits, or workplace disputes." },
                                            { t: "Legacy & Lineage Continuity", d: "Using the 5th House and Saptamsa (D-7) to map the energetic quality and timing of progeny or the creation of long-term intellectual property." }
                                        ].map((item, idx) => (
                                            <li key={idx} className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 hover:border-amber-200 transition-colors shadow-sm">
                                                <strong className="text-gray-900 block text-lg mb-2">{item.t}:</strong>
                                                <span className="text-gray-600 leading-relaxed font-medium">{item.d}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* II. Neuro-Psychological & Shadow Architecture */}
                                <section>
                                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-rose-200 pb-3 mb-6 mt-12 flex items-center gap-3">
                                        <span className="text-rose-500">II.</span> Neuro-Psychological & Shadow Architecture
                                    </h3>
                                    <ul className="space-y-5">
                                        {[
                                            { t: "Saturn-Ketu Trauma Coding", d: "Identifying the specific Memory Nodes in your chart where past trauma manifests as current self-sabotage." },
                                            { t: "Behavioral Loop Identification", d: "A recursive analysis of the 8th House to identify the Life Loops (repeating mistakes in money/love) and the specific dasha that breaks them." },
                                            { t: "Atmakaraka Source Code Extraction", d: "Identifying your highest-degree planet to reveal your core Operating System and the primary resistance you will face until death." },
                                            { t: "Ego-Dissolution (12th House) Windows", d: "Mapping periods of Identity Death where isolation or spiritual reset is mandatory for the next growth cycle." },
                                            { t: "Nadi-Amsa Micro-Purpose Mapping", d: "Using the 150 Nadi-Amsas to find the hyper-specific archetype of your destiny that regular Rashi charts miss by a mile." }
                                        ].map((item, idx) => (
                                            <li key={idx} className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 hover:border-rose-200 transition-colors shadow-sm">
                                                <strong className="text-gray-900 block text-lg mb-2">{item.t}:</strong>
                                                <span className="text-gray-600 leading-relaxed font-medium">{item.d}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* III. Strategic Enterprise & Leadership */}
                                <section>
                                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-amber-200 pb-3 mb-6 mt-12 flex items-center gap-3">
                                        <span className="text-amber-500">III.</span> Strategic Enterprise & Leadership
                                    </h3>
                                    <ul className="space-y-5">
                                        {[
                                            { t: "Business Scaling Vector", d: "Analyzing the 10th House and Artha-Trikona to determine the exact month for VC funding, product launch, or market pivot." },
                                            { t: "AL (Arudha Lagna) Brand Compatibility", d: "Calculating how the public perceives you versus your true self. Essential for founders who need to manage their Authority Image." },
                                            { t: "Competitor Vulnerability Audit", d: "Using the 6th House from Lagna and AL to see when your rivals are in a Weak Transit (your window to strike)." },
                                            { t: "Authority (Dig Bala) Assessment", d: "Measuring the Directional Strength of your Sun and Mars to determine if you are wired for CEO-level leadership or Lone Wolf execution." }
                                        ].map((item, idx) => (
                                            <li key={idx} className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 hover:border-amber-200 transition-colors shadow-sm">
                                                <strong className="text-gray-900 block text-lg mb-2">{item.t}:</strong>
                                                <span className="text-gray-600 leading-relaxed font-medium">{item.d}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* IV. Executive Support & Interactive Data */}
                                <section>
                                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-rose-200 pb-3 mb-6 mt-12 flex items-center gap-3">
                                        <span className="text-rose-500">IV.</span> Executive Support & Interactive Data
                                    </h3>
                                    <ul className="space-y-5">
                                        {[
                                            { t: "Direct WhatsApp Tactical Access", d: "3 high-priority follow-ups for real-world decision-making (e.g., Should I sign this contract on Tuesday?)." },
                                            { t: "12-Hour Emergency Response Protocol", d: "Your data is moved to the front of the compute queue for immediate delivery." },
                                            { t: "YNTRA WebApp Lifetime Dashboard", d: "Access to your real-time Personal Transit Weather updated every hour." },
                                            { t: "Monthly Macro-Shift Notifications", d: "Tactical alerts on major shifts like Saturn/Jupiter retrogrades and how they specifically hit your 10th and 11th houses." }
                                        ].map((item, idx) => (
                                            <li key={idx} className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 hover:border-rose-200 transition-colors shadow-sm">
                                                <strong className="text-gray-900 block text-lg mb-2">{item.t}:</strong>
                                                <span className="text-gray-600 leading-relaxed font-medium">{item.d}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* V. The Secret Data Points */}
                                <section>
                                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-amber-200 pb-3 mb-6 mt-12 flex items-center gap-3">
                                        <span className="text-amber-500">V.</span> The Secret Data Points
                                    </h3>
                                    <ul className="space-y-5">
                                        {[
                                            { t: "Gulika/Mandi Poison Point Mapping", d: "Identifying the invisible points of Sudden Friction in your chart that cause 90% of project delays." },
                                            { t: "Pushkar Navamsa Optimization", d: "Locating the hidden degrees where your Weak planets actually become high-performers. Most astrologers miss this and misdiagnose failures." },
                                            { t: "Vargottama Power Vectors", d: "Identifying planets that occupy the same sign in D-1 and D-9, creating Unbreakable strengths in your personality." },
                                            { t: "Lunar Tithi/Nakshatra Neutralization", d: "Micro-remedies based on the mathematical phase of the moon at birth—fixing the Internal Tide of your emotions." },
                                            { t: "Maraka (Death-Inflicting) Risk Analysis", d: "High-resolution monitoring of the 2nd and 7th house lords for periods of peak physical vulnerability." },
                                            { t: "Cognitive Acquisition Windows", d: "Using the 4th/5th house and Mercury to identify when your brain is most capable of learning complex new skill sets (AI, Coding, Strategy)." },
                                            { t: "Public Image (Arudha) Correction", d: "A strategy on how to align your Inner Reality with your Social Perception to stop the Imposter Syndrome loop." },
                                            { t: "The Bhrigu Point (Destiny Trigger)", d: "Calculating the exact degree in your chart that, when touched by a transit, changes your life forever." },
                                            { t: "5-Year Executive Life Roadmap", d: "A one-page Decision Matrix for the next 60 months." }
                                        ].map((item, idx) => (
                                            <li key={idx} className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 hover:border-amber-200 transition-colors shadow-sm">
                                                <strong className="text-gray-900 block text-lg mb-2">{item.t}:</strong>
                                                <span className="text-gray-600 leading-relaxed font-medium">{item.d}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex justify-center">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold py-4 px-12 rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all text-lg"
                            >
                                Awesome, Let's Go
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
