"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import InitiationModal from "../features/InitiationModal";

export default function ExclusiveEntry() {
    const [isInitiationOpen, setIsInitiationOpen] = useState(false);

    return (
        <section className="min-h-[80vh] flex items-center justify-center bg-[#1a1a1a] text-[#FAFAF7] p-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.1)_0%,transparent_50%)] pointer-events-none" />

            <div className="max-w-4xl text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="font-mono text-[#D4AF37] text-xs tracking-[0.4em] uppercase mb-8 block font-[family-name:var(--font-space)]">
                        Final Protocol
                    </span>

                    <h2 className="font-[family-name:var(--font-cinzel)] text-5xl md:text-8xl font-medium mb-8 tracking-tight leading-[1.1]">
                        The Blueprint Is <br />
                        <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B]">Ready.</span>
                    </h2>

                    <p className="font-[family-name:var(--font-outfit)] text-base md:text-xl font-light mb-16 max-w-2xl mx-auto leading-relaxed text-[#FAFAF7]/70">
                        Stop guessing. Step into exact coordinates. <br className="hidden md:block" />
                        We extract your data, you execute the timeline.
                    </p>

                    <button
                        onClick={() => setIsInitiationOpen(true)}
                        className="group relative px-14 py-6 bg-[#FAFAF7] text-[#1a1a1a] text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-space)] hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(201,168,76,0.15)] hover:shadow-[0_0_60px_rgba(201,168,76,0.3)] overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Initiate Extraction
                        </span>
                    </button>
                </motion.div>
            </div>

            <InitiationModal isOpen={isInitiationOpen} onClose={() => setIsInitiationOpen(false)} />
        </section>
    );
}
