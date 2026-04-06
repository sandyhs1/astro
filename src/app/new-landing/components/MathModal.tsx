"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import posthog from 'posthog-js';

interface MathModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MathModal({ isOpen, onClose }: MathModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            posthog.capture('content_engagement', { section: 'the_math_modal' });
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
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">The Math Behind The Magic</h2>
                                    <p className="text-gray-600 font-medium text-sm md:text-base mt-1">Why precision matters when reading your life's blueprint.</p>
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

                                {/* Top Section - Why 99% is Useless */}
                                <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-6 md:p-8 rounded-2xl border-2 border-rose-200 relative overflow-hidden">
                                    <div className="absolute -right-10 -top-10 text-rose-500/10 pointer-events-none">
                                        <Sparkles size={120} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-rose-900 mb-4">
                                        Why 99% of Astrology is Mathematically Useless.
                                    </h3>
                                    <div className="space-y-4 text-gray-800 leading-relaxed font-medium">
                                        <p>
                                            Standard astrology apps use the D-1 chart. Every person born in the same 2-hour window shares that chart. They use the D-9, which stays the same for 15 minutes.
                                        </p>
                                        <p>
                                            The Complete Reality Check uses the <strong className="text-rose-700">D-60 (Shastiamsa)</strong>. This chart changes every 2 minutes. It is the only data set that explains why twins have different lives.
                                        </p>
                                        <p className="text-rose-800 font-bold">
                                            If your report isn't looking at your D-60, it's not reading your life - it's reading a template for 500,000 other people.
                                        </p>
                                    </div>
                                </div>

                                {/* Main Title */}
                                <div className="text-center">
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">THE ENGINE</h2>
                                    <p className="text-amber-600 font-bold mt-2 text-xl">Deterministic Life-Calculation Logic</p>
                                </div>

                                {/* 01. Astronomical Data Integrity */}
                                <section>
                                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-amber-200 pb-3 mb-6 flex items-center gap-3">
                                        <span className="text-amber-500">01.</span> Astronomical Data Integrity (The Input)
                                    </h3>
                                    <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-4">
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            We do not use "estimated" planetary positions found in standard API wrappers. Our engine calculates coordinates based on the <strong>Swiss Ephemeris</strong>, the gold standard in physical astronomy, corrected for:
                                        </p>
                                        <ul className="space-y-3 ml-4">
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">True Chitra Paksha (Lahiri) Ayanamsa:</strong> Precision-corrected for the Earth's axial precession (50.3 arc-seconds per year).
                                            </li>
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">Geocentric Parallax:</strong> Adjusting planetary longitudes based on the observer's specific latitude and longitude, not just the city center.
                                            </li>
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">Topocentric Refraction:</strong> Correcting for atmospheric bending of light at the exact moment of the first breath.
                                            </li>
                                        </ul>
                                    </div>
                                </section>

                                {/* 02. The Shodasavarga */}
                                <section>
                                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-rose-200 pb-3 mb-6 flex items-center gap-3">
                                        <span className="text-rose-500">02.</span> The Shodasavarga + Higher-Order Matrix
                                    </h3>
                                    <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-4">
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            Most systems stop at the D-1. We run a <strong>Recursive Multi-Chart Audit</strong>. Every question you ask is routed through its specific high-resolution divisional coordinate.
                                        </p>
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            <strong className="text-gray-900">Contextual Varga Routing:</strong> If you ask about wealth, we prioritize the D-2 (Hora) and D-11 (Rudramsa). If you ask about property, we audit the D-4 (Chaturthamsa). We don't guess; we zoom into the specific mathematical division of the house in question.
                                        </p>
                                    </div>
                                </section>

                                {/* 03. Bhava Chalit */}
                                <section>
                                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-amber-200 pb-3 mb-6 flex items-center gap-3">
                                        <span className="text-amber-500">03.</span> Bhava Chalit: The True House Vector
                                    </h3>
                                    <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-4">
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            The "Sign-House" system is a simplified abstraction for the masses. We use <strong>Bhava Chalit (Cusp-based Calculation)</strong>.
                                        </p>
                                        <ul className="space-y-3 ml-4">
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">The Logic:</strong> Signs are fixed 30° blocks. Houses (Bhavas) are dynamic.
                                            </li>
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">The Difference:</strong> A planet at 28° in the 1st House is mathematically functioning in the 2nd House.
                                            </li>
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">The Result:</strong> We identify wealth and career results that "General" astrologers miss because they are looking at the wrong house entirely.
                                            </li>
                                        </ul>
                                    </div>
                                </section>

                                {/* 04. Ashtakvarga */}
                                <section>
                                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-rose-200 pb-3 mb-6 flex items-center gap-3">
                                        <span className="text-rose-500">04.</span> Ashtakvarga: The Probability Algorithm
                                    </h3>
                                    <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-4">
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            We quantify the "Benefic Strength" of every house using a 0-8 point system for all 7 planets (Totaling 337 points).
                                        </p>
                                        <ul className="space-y-3 ml-4">
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">Active Windows (28+ Points):</strong> Periods where effort yields a 1.5x return.
                                            </li>
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">Dead Zones (&lt;20 Points):</strong> Periods where any investment or risk results in unavoidable leakage.
                                            </li>
                                        </ul>
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            We overlay these points onto your current transits to determine the exact probability of success for your specific inquiry.
                                        </p>
                                    </div>
                                </section>

                                {/* 05. 5-Tier Dasha Recursion */}
                                <section>
                                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-amber-200 pb-3 mb-6 flex items-center gap-3">
                                        <span className="text-amber-500">05.</span> 5-Tier Dasha Recursion (Time-Lord Calculation)
                                    </h3>
                                    <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-4">
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            We don't provide "Yearly Horoscopes." We calculate the Vimshottari Dasha down to the 5th level of recursion.
                                        </p>
                                        <ul className="space-y-2 ml-4">
                                            <li className="text-gray-700"><strong className="text-gray-900">Mahadasha:</strong> The 10-20 year trend.</li>
                                            <li className="text-gray-700"><strong className="text-gray-900">Antardasha:</strong> The 1-3 year pivot.</li>
                                            <li className="text-gray-700"><strong className="text-gray-900">Pratyantardasha:</strong> The monthly scene.</li>
                                            <li className="text-gray-700"><strong className="text-gray-900">Sookshma Dasha:</strong> The weekly trigger.</li>
                                            <li className="text-gray-700"><strong className="text-gray-900">Prana Dasha:</strong> The daily event.</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* 06. Computational Source Code */}
                                <section>
                                    <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-rose-200 pb-3 mb-6 flex items-center gap-3">
                                        <span className="text-rose-500">06.</span> Computational Source Code
                                    </h3>
                                    <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-4">
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                            Our logic is hard-coded from the primary source texts of Vedic Mathematical Astronomy:
                                        </p>
                                        <ul className="space-y-3 ml-4">
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">Brihat Parashara Hora Shastra (BPHS):</strong> For the 16-divisional algorithmic framework.
                                            </li>
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">Jaimini Sutras:</strong> For Chara Karaka (Variable Significator) trajectory mapping.
                                            </li>
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">Surya Siddhanta:</strong> For the orbital mechanics of the Upagrahas (Gulika/Mandi).
                                            </li>
                                            <li className="text-gray-700">
                                                <strong className="text-gray-900">Phaladeepika:</strong> For clinical results and health diagnostic data.
                                            </li>
                                        </ul>
                                    </div>
                                </section>

                                {/* AUTHENTICITY STAMP - Highlighted Section */}
                                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50 p-8 rounded-2xl border-2 border-indigo-300 relative overflow-hidden shadow-lg">
                                    <div className="absolute -right-10 -bottom-10 text-indigo-500/10 pointer-events-none">
                                        <CheckCircle2 size={150} />
                                    </div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <CheckCircle2 className="text-indigo-600 w-8 h-8" />
                                            <h3 className="text-2xl font-bold text-indigo-900">AUTHENTICITY STAMP</h3>
                                        </div>
                                        <p className="text-indigo-900 text-lg leading-relaxed font-semibold">
                                            This is a deterministic reconstruction of the space-time coordinates at your birth. We do not use "Intuition." We use <strong>Sphuta (Longitudes)</strong>, <strong>Bala (Strength)</strong>, and <strong>Kala (Time)</strong>. If the birth data is accurate, the data output is unavoidable.
                                        </p>
                                    </div>
                                </div>

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
