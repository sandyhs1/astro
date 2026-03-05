"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaBolt, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";

interface InitiationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InitiationModal({ isOpen, onClose }: InitiationModalProps) {
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
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0a0500] border border-[#d4af37]/20 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.08)]"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d4af37]/5 blur-3xl pointer-events-none" />

                        <div className="p-8 md:p-10 text-center relative z-10">
                            {/* Icon - More Adorable & Pulsing */}
                            <motion.div
                                animate={{
                                    boxShadow: ["0 0 20px rgba(212,175,55,0.1)", "0 0 40px rgba(212,175,55,0.3)", "0 0 20px rgba(212,175,55,0.1)"]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-black border border-[#d4af37]/20 mb-6 rotate-12"
                            >
                                <FaBolt className="text-[#d4af37] text-2xl" />
                            </motion.div>

                            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4 tracking-tight leading-tight">
                                Welcome to the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6c875] to-[#d4af37] italic">Resonance</span>.
                            </h2>

                            <div className="space-y-5 mb-10">
                                <p className="font-mono text-gray-400 text-xs md:text-sm leading-relaxed uppercase tracking-widest">
                                    You have arrived exactly when you were meant to. The universe brought you here for a specific reason.
                                </p>
                                <p className="font-mono text-white/90 text-[10px] md:text-xs leading-relaxed uppercase tracking-[0.2em] px-4">
                                    Before we map your code, we invite you to understand the depth of what we are building together.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={onClose}
                                    className="group relative w-full py-5 bg-[#d4af37] text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl overflow-hidden transition-all hover:scale-[1.03] active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        Begin Exploration <FaArrowRight className="text-[10px]" />
                                    </span>
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em] hover:text-[#d4af37] transition-colors"
                                >
                                    I am already aware. Take me down.
                                </button>
                            </div>
                        </div>

                        {/* Subtle Bokeh Elements */}
                        <div className="absolute inset-0 pointer-events-none opacity-10">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-12 h-12 bg-[#d4af37] rounded-full blur-3xl"
                                    initial={{
                                        x: Math.random() * 400,
                                        y: Math.random() * 500,
                                        opacity: 0,
                                        scale: 0.5
                                    }}
                                    animate={{
                                        opacity: [0, 0.5, 0],
                                        scale: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: Math.random() * 8 + 5,
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
