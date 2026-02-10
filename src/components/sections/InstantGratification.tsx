"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/context/OnboardingContext";

export default function InstantGratification() {
    const { openModal } = useOnboarding();
    const [dob, setDob] = useState("");
    const [glitch, setGlitch] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleScan = () => {
        if (!dob) return;
        setGlitch(true);

        // Simulate processing delay
        setTimeout(() => {
            setGlitch(false);
            setResult("Your Mars is weak. Stop asking for permission.");
        }, 1500);
    };

    return (
        <section className="min-h-screen bg-[#05000a] flex flex-col items-center justify-center p-6 relative overflow-hidden">

            <div className="z-10 w-full max-w-md text-center">
                <h2 className="font-serif text-3xl md:text-5xl text-white mb-2">Expose Your Lethal Weakness</h2>
                <p className="font-mono text-xs text-gray-500 mb-12 uppercase tracking-widest">What are you hiding from yourself?</p>

                {!result ? (
                    <motion.div
                        animate={glitch ? { x: [-5, 5, -5, 5, 0], opacity: [1, 0.5, 1] } : {}}
                        transition={{ duration: 0.2, repeat: glitch ? 5 : 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block text-left text-[#FFD700] font-mono text-xs mb-2 uppercase">Date of Birth</label>
                            <input
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full bg-[#12011A] border border-[#FFD700]/30 text-white font-mono p-4 rounded focus:outline-none focus:border-[#FFD700] focus:shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                            />
                        </div>

                        <button
                            onClick={openModal}
                            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-[#FFD700] transition-colors"
                        >
                            CLAIM MY SPOT
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border border-red-500 bg-red-900/10 p-8 rounded"
                    >
                        <div className="font-mono text-red-500 text-xs uppercase mb-4 animate-pulse">Core Weakness Detected</div>
                        <h3 className="font-serif text-2xl text-white leading-relaxed">
                            &quot;You apologize for taking up space. It's making you invisible to money and respect.&quot;
                        </h3>
                        <button
                            onClick={() => setResult(null)}
                            className="mt-8 text-xs text-gray-500 underline hover:text-white"
                        >
                            That hurt. Show me more.
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Glitch Overlay Elements */}
            <AnimatePresence>
                {glitch && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white mix-blend-difference pointer-events-none"
                        />
                        <motion.div
                            className="absolute top-1/2 left-0 w-full h-2 bg-[#FFD700] mix-blend-color-dodge"
                            animate={{ y: [-100, 100, -50, 200] }}
                            transition={{ duration: 0.1, repeat: Infinity }}
                        />
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
