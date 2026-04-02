"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function TheMirror() {
    const containerRef = useRef<HTMLDivElement>(null);
    const blockRef = useRef<HTMLDivElement>(null);
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.2, 0.5], [0.95, 1]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setGlowPos({ x, y });
    }, []);

    return (
        <section
            ref={containerRef}
            className="min-h-screen flex items-center justify-center bg-[#FAFAF7] relative overflow-hidden py-24 border-y border-[#1a1a1a]/5"
        >
            <div className="max-w-5xl mx-auto px-6 text-center z-10 w-full">
                <motion.div style={{ opacity, scale }}>

                    {/*
                      Torch Effect — new approach:
                      - Entire block is always readable at moderate opacity
                      - On hover: text snaps to high brightness
                      - A warm ambient radial glow (not a mask) follows the cursor as a background light source
                    */}
                    <div
                        ref={blockRef}
                        className="relative cursor-default group"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {/* The ambient torch glow — large soft radial that follows the cursor */}
                        <div
                            className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 z-0"
                            style={{
                                opacity: isHovering ? 1 : 0,
                                background: `radial-gradient(ellipse 70% 80% at ${glowPos.x}% ${glowPos.y}%, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 40%, transparent 70%)`,
                            }}
                        />

                        {/* Title text — dim at rest, fully bright on hover of anywhere in block */}
                        <h2 className="relative z-10 font-[family-name:var(--font-cinzel)] uppercase leading-[1.25] transition-all duration-700 ease-out
                            text-[#1a1a1a]/30 group-hover:text-[#1a1a1a]/95
                            [text-shadow:none] group-hover:[text-shadow:0_0_60px_rgba(201,168,76,0.2)]"
                        >
                            <span className="block font-medium text-[clamp(1.6rem,4vw,4.2rem)] tracking-[0.15em] mb-2">
                                You don&apos;t make{" "}
                                <em className="not-italic font-light tracking-[0.2em] transition-colors duration-700
                                    text-[#1a1a1a]/20 group-hover:text-[#1a1a1a]/60">
                                    bad
                               </em>{" "}
                                decisions.
                            </span>
                            <span className="block font-medium text-[clamp(1.6rem,4vw,4.2rem)] tracking-[0.15em] mb-2">
                                You make the{" "}
                                <span className="font-bold italic
                                    text-[#1a1a1a]/20 group-hover:text-transparent
                                    bg-clip-text
                                    transition-all duration-700"
                                    style={{
                                        backgroundImage: isHovering
                                            ? "linear-gradient(to right, #B8860B, #D4AF37, #B8860B)"
                                            : "none",
                                        WebkitTextFillColor: isHovering ? "transparent" : undefined,
                                        color: isHovering ? "transparent" : undefined,
                                    }}
                                >
                                    right decisions
                                </span>
                            </span>
                            <span className="block font-light text-[clamp(1rem,2.2vw,2rem)] tracking-[0.4em] mt-2
                                text-[#1a1a1a]/20 group-hover:text-[#1a1a1a]/70 transition-colors duration-700">
                                at the wrong time.
                            </span>
                        </h2>
                    </div>

                    {/* Subtext box — clearly readable */}
                    <div className="mt-16 p-8 border border-[#1a1a1a]/10 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-xl">
                        <p className="font-[family-name:var(--font-cinzel)] text-[#D4AF37] text-[0.6rem] uppercase tracking-[0.45em] mb-4 border-b border-[#1a1a1a]/10 pb-4">
                            Reality Check
                        </p>
                        <p className="font-[family-name:var(--font-outfit)] font-light text-sm md:text-base text-[#1a1a1a]/70 leading-[1.8] tracking-[0.06em]">
                            Your birth chart isn&apos;t predicting events — it reveals the rigid mathematical cycles causing you to repeatedly create them. We map the cycles. You break the loops.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
