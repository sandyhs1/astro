"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMail, FiMessageCircle, FiPhone } from "react-icons/fi";
import { useEffect } from "react";

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative w-full max-w-md bg-[#0a0a0a] border border-[#d4af37]/30 rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.15)] overflow-hidden"
                    >
                        {/* Header Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e6c875] via-[#d4af37] to-[#e6c875]" />

                        <div className="p-8">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2"
                            >
                                <FiX className="w-5 h-5" />
                            </button>

                            <div className="mb-8 text-center">
                                <h3 className="text-2xl font-serif text-[#d4af37] mb-2">We've Got Your Back</h3>
                                <p className="text-sm font-mono text-gray-400">
                                    Karma doesn't wait, neither do we.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Email */}
                                <a
                                    href="mailto:help@soulsync.tech"
                                    className="group flex flex-col p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#d4af37]/10 hover:border-[#d4af37]/50 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-[#d4af37]/20 text-[#d4af37]">
                                            <FiMail className="w-5 h-5" />
                                        </div>
                                        <span className="font-mono text-sm tracking-widest text-[#d4af37] group-hover:text-[#e6c875] transition-colors">Priority Email Support</span>
                                    </div>
                                    <span className="font-mono text-xs text-gray-400 pl-12">help@soulsync.tech</span>
                                </a>

                                {/* WhatsApp */}
                                <div className="group flex flex-col p-4 rounded-xl border border-white/5 bg-white/[0.02] opacity-70 cursor-not-allowed">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-gray-800 text-gray-400">
                                            <FiPhone className="w-5 h-5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm tracking-widest text-gray-400">WhatsApp Support</span>
                                            <span className="text-[10px] uppercase font-bold text-black bg-[#d4af37] px-2 py-0.5 rounded-sm">Coming Soon</span>
                                        </div>
                                    </div>
                                    <span className="font-mono text-xs text-gray-500 pl-12">Instant dominance on chat</span>
                                </div>

                                {/* Live Chat */}
                                <div className="group flex flex-col p-4 rounded-xl border border-white/5 bg-white/[0.02] opacity-70 cursor-not-allowed">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-gray-800 text-gray-400">
                                            <FiMessageCircle className="w-5 h-5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm tracking-widest text-gray-400">Live Chat</span>
                                            <span className="text-[10px] uppercase font-bold text-black bg-[#d4af37] px-2 py-0.5 rounded-sm">Coming Soon</span>
                                        </div>
                                    </div>
                                    <span className="font-mono text-xs text-gray-500 pl-12">System-level intervention</span>
                                </div>
                            </div>

                            <div className="mt-8 text-center border-t border-white/10 pt-6">
                                <p className="text-xs font-mono text-[#d4af37]/80 italic">
                                    "Even the stars occasionally need a reboot."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
