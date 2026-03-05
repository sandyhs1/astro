"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaBolt, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";

interface InitiationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onIniate: () => void;
}

export default function InitiationModal({ isOpen, onClose, onIniate }: InitiationModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-gradient-to-b from-[#111] to-black border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.1)]"
                    >
                        {/* Radioactive Beam Effect */}
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#d4af37]/20 blur-[100px] pointer-events-none" />

                        <div className="p-8 md:p-12 text-center relative z-10">
                            {/* Icon */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black border border-[#d4af37]/30 mb-8"
                            >
                                <FaBolt className="text-[#d4af37] text-3xl" />
                            </motion.div>

                            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6 uppercase tracking-tighter leading-tight">
                                You are in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6c875] to-white">Right Place</span><br />
                                at the <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#e6c875]">Right Time</span>.
                            </h2>

                            <div className="space-y-6 mb-12">
                                <p className="font-mono text-gray-400 text-sm md:text-base leading-relaxed uppercase tracking-wider">
                                    There is a reason this alignment brought you here. The universe does not deal in coincidences—it deals in <span className="text-white font-bold italic">Mathematics</span>.
                                </p>
                                <p className="font-mono text-red-500/80 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
                                    Warning: The truth about your architecture cannot be unseen.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={onIniate}
                                    className="group relative w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-sm rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        Step Into Your Truth <FaArrowRight className="text-xs" />
                                    </span>
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 text-gray-600 font-mono text-xs uppercase tracking-[0.3em] hover:text-red-500 transition-colors"
                                >
                                    I am not ready. Return to ignorance.
                                </button>
                            </div>
                        </div>

                        {/* Particle elements */}
                        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-[#d4af37] rounded-full"
                                    initial={{
                                        x: Math.random() * 600,
                                        y: Math.random() * 800,
                                        opacity: 0
                                    }}
                                    animate={{
                                        y: [0, -100],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: Math.random() * 5 + 3,
                                        repeat: Infinity,
                                        delay: Math.random() * 5
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
