"use client";

import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const stackCards = [
    {
        title: "The Calibration",
        subtitle: "Step 01",
        description: (
            <>
                A 4-minute error shifts your entire destiny grid. We don&apos;t do horoscopes. We do <span className="text-white italic">forensic soul audits</span>. Precision is the only variable that matters.
            </>
        ),
        color: "#050505", // Obsidian
        glow: "rgba(212, 175, 55, 0.15)", // Gold glow
        insight: {
            theme: "Protocol: Time_Lock",
            revelation: "Validating star chart alignment. Ensuring absolute precision before target lock.",
            command: "Lock Target"
        }
    },
    {
        title: "The Download",
        subtitle: "Step 02",
        description: (
            <>
                We calculate <span className="text-[#D4AF37] italic">algorithms</span>, not predictions. See your exact patterns in Love, Wealth, and Vitality. It&apos;s not magic. It&apos;s <span className="text-white font-medium">behavioral surveillance</span>.
            </>
        ),
        color: "#0D0A0A", // Very dark crimson tint
        glow: "rgba(138, 3, 3, 0.2)", // Crimson glow
        insight: {
            theme: "Protocol: Future_Architecture",
            revelation: "Mapping subconscious wiring and forthcoming volatility events across all sectors.",
            command: "Decode Now"
        }
    },
    {
        title: "The Execution",
        subtitle: "Step 03",
        description: (
            <>
                Timing is leverage. Reaction is mastery. We show you exactly <span className="text-[#D4AF37] italic">when to strike</span> and <span className="text-white font-medium">how to pivot</span>. Stop guessing. <span className="text-white italic font-medium">Dominate.</span>
            </>
        ),
        color: "#121212", // Slightly lighter obsidian
        glow: "rgba(255, 255, 255, 0.1)", // Pearl glow
        insight: {
            theme: "Protocol: Neural_Rewrite",
            revelation: "Optimizing reaction delays. Aligning ego with cosmic authority for total dominion.",
            command: "Execute"
        }
    }
];

export default function TheStack() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <div ref={containerRef} className="bg-[#050505] relative w-full pt-10">
            {stackCards.map((card, i) => {
                const targetScale = 1 - (stackCards.length - i) * 0.04;
                return (
                    <StackCard
                        key={i}
                        index={i}
                        data={card}
                        progress={scrollYProgress}
                        range={[i * 0.25, 1]}
                        targetScale={targetScale}
                    />
                );
            })}
        </div>
    );
}

function StackCard({ index, data, progress, range, targetScale }: { index: number, data: any, progress: MotionValue<number>, range: [number, number], targetScale: number }) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    const scale = useTransform(progress, range, [1, targetScale]);
    const [isInsightOpen, setIsInsightOpen] = useState(false);
    const router = useRouter();

    return (
        <div ref={container} className="h-[100vh] flex items-center justify-center sticky top-0 px-4 md:px-8">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${index * 30}px)` }}
                className="relative w-full md:w-[70vw] lg:w-[60vw] max-w-4xl h-[75vh] md:h-[65vh] rounded-[2.5rem] p-8 md:p-14 flex flex-col justify-between border border-white/[0.05] shadow-[0_30px_60px_rgba(0,0,0,0.8)] origin-top overflow-hidden"
                initial={{ backgroundColor: data.color }}
                animate={{ backgroundColor: data.color }}
            >
                {/* Subtle Ambient Glow inside Card */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-50 blur-[100px] transition-opacity duration-1000"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${data.glow}, transparent 70%)` }}
                />

                {/* Main Content */}
                <div className="relative z-10 transition-opacity duration-700" style={{ opacity: isInsightOpen ? 0 : 1 }}>
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-xs tracking-[0.4em] uppercase text-white/40 font-medium" style={{ fontFamily: "var(--font-body)" }}>{data.subtitle}</h3>
                            <div className="h-[1px] w-12 bg-white/20"></div>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-medium text-[#FBFBFB] mb-8 leading-[1.1] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{data.title}</h2>
                    </div>

                    <div className="text-lg md:text-2xl text-white/60 leading-relaxed max-w-2xl font-light" style={{ fontFamily: "var(--font-body)" }}>
                        {data.description}
                    </div>
                </div>

                <div className="flex justify-between items-end relative z-10 transition-opacity duration-300" style={{ opacity: isInsightOpen ? 0 : 1 }}>
                    <span className="text-6xl md:text-8xl opacity-[0.03] font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{`0${index + 1}`}</span>
                    <button
                        onClick={() => setIsInsightOpen(true)}
                        className="group flex flex-col items-end gap-2"
                    >
                        <span className="text-xs uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors duration-300">
                            Read Protocol
                        </span>
                        <div className="w-8 h-[1px] bg-white/30 group-hover:w-16 group-hover:bg-white transition-all duration-300"></div>
                    </button>
                </div>

                {/* Elegant Insight Overlay */}
                <AnimatePresence>
                    {isInsightOpen && (
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 bg-[#050505]/80 z-20 flex flex-col p-8 md:p-16 border-[1px] border-white/10"
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsInsightOpen(false); }}
                                className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            <div className="flex items-center gap-3 mb-12">
                                <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></span>
                                <span className="text-xs text-white/60 uppercase tracking-[0.3em] font-sans" style={{ fontFamily: "var(--font-body)" }}>Dossier Open</span>
                            </div>

                            <div className="flex-grow flex flex-col justify-center max-w-xl">
                                <h4 className="text-3xl md:text-5xl text-[#D4AF37] font-medium mb-6 font-sans" style={{ fontFamily: "var(--font-display)" }}>
                                    {data.insight.theme}
                                </h4>

                                <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed italic" style={{ fontFamily: "var(--font-body)" }}>
                                    &quot;{data.insight.revelation}&quot;
                                </p>
                            </div>

                            <div className="mt-auto pt-8 border-t border-white/10">
                                <button
                                    onClick={() => router.push('/reviews')}
                                    className="group relative overflow-hidden px-8 py-4 bg-white text-black font-medium uppercase tracking-[0.2em] text-xs transition-all duration-500 float-right hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        {data.insight.command}
                                    </span>
                                    <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0"></div>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
