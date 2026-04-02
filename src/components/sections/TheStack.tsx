"use client";

import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const stackCards = [
    {
        title: "Forensic Decoding",
        subtitle: "Phase 01",
        description: (
            <>
                We don&apos;t stop at basic D1 or D9 charts. We analyze <span className="text-[#C9A84C] font-semibold">all 16 Shodashavarga charts</span>, precise planetary degrees, Upapada Lagnas, and specific Dasha timelines for absolute, uncompromising accuracy.
            </>
        ),
        color: "#FFFFFF", 
        glow: "rgba(201, 168, 76, 0.15)", // Warm gold glow
        insight: {
            theme: "Layer 1: Shodashavarga Extraction",
            revelation: "We don't just look at the surface. We decode 16 multidimensional charts to extract the exact granular data of your destiny."
        }
    },
    {
        title: "Wealth Architecture",
        subtitle: "Phase 02",
        description: (
            <>
                Discover the hyper-specific mechanics of your <span className="text-[#1a1a1a] font-semibold">Career Trajectory</span> and <span className="text-[#C9A84C] font-semibold">Wealth Activation Periods</span>. Take the right action at the mathematically ideal moment.
            </>
        ),
        color: "#F9F7F1", 
        glow: "rgba(245, 158, 11, 0.15)", // Amber glow
        insight: {
            theme: "Layer 2: Dasha Navigation",
            revelation: "Mapping the exact planetary time periods to identify your highest leverage economic windfalls and precise wealth windows."
        }
    },
    {
        title: "Karmic Integration",
        subtitle: "Phase 03",
        description: (
            <>
                Map your <span className="text-[#1a1a1a] font-semibold">Relationship Karma</span> and deploy crucial psychological shadow work to eradicate the recurring astrological blind spots that sabotage your peace.
            </>
        ),
        color: "#F4F1E8", 
        glow: "rgba(220, 38, 38, 0.1)", // Very soft, warm red glow
        insight: {
            theme: "Layer 3: Karmic Debt Analysis",
            revelation: "Identifying the specific planetary configurations causing repeated failure loops in your relationships, allowing you to finally break them."
        }
    },
    {
        title: "Human Precision",
        subtitle: "Phase 04",
        description: (
            <>
                Zero template generation. Every computation is <span className="text-[#C9A84C] font-semibold">human-interpreted</span>. Receive a sophisticated, artisan-crafted execution blueprint within 4 to 6 hours.
            </>
        ),
        color: "#EFEBE0", 
        glow: "rgba(201, 168, 76, 0.25)", // Gold glow
        insight: {
            theme: "Layer 4: Human-Driven Strategy",
            revelation: "No bots. Real Vedic scholars translating complex astronomical geometry into a beautiful, ruthless execution blueprint.",
            processFlow: "Supply Coordinate Data - Submit Context - Complete Offering - Initiate Blueprint Analysis",
            command: "View Your Blueprint"
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
        <div ref={containerRef} className="bg-[#FAFAF7] relative w-full pt-10">
            {stackCards.map((card, i) => {
                const targetScale = 1 - (stackCards.length - 1 - i) * 0.04;
                return (
                    <StackCard
                        key={i}
                        index={i}
                        data={card}
                        progress={scrollYProgress}
                        range={[i * (1 / stackCards.length), 1]}
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
                className="relative w-full md:w-[70vw] lg:w-[60vw] max-w-4xl h-[75vh] md:h-[65vh] rounded-[2.5rem] p-8 md:p-14 flex flex-col justify-between border border-[#1a1a1a]/5 origin-top overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
                initial={{ backgroundColor: data.color }}
                animate={{ backgroundColor: data.color }}
            >
                {/* Subtle Ambient Glow inside Card */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-80 blur-[100px] transition-opacity duration-1000"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${data.glow}, transparent 70%)` }}
                />

                {/* Main Content */}
                <div className="relative z-10 transition-opacity duration-700" style={{ opacity: isInsightOpen ? 0 : 1 }}>
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-xs tracking-[0.4em] uppercase text-[#1a1a1a]/40 font-medium" style={{ fontFamily: "var(--font-space)" }}>{data.subtitle}</h3>
                            <div className="h-[1px] w-12 bg-[#1a1a1a]/10"></div>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-medium text-[#1a1a1a] mb-8 leading-[1.1] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{data.title}</h2>
                    </div>

                    <div className="text-lg md:text-2xl text-[#1a1a1a]/70 leading-relaxed max-w-2xl font-light" style={{ fontFamily: "var(--font-outfit)" }}>
                        {data.description}
                    </div>
                </div>

                <div className="flex justify-between items-end relative z-10 transition-opacity duration-300" style={{ opacity: isInsightOpen ? 0 : 1 }}>
                    <span className="text-6xl md:text-8xl opacity-[0.03] font-black text-[#1a1a1a]" style={{ fontFamily: "var(--font-display)" }}>{`0${index + 1}`}</span>
                    <button
                        onClick={() => setIsInsightOpen(true)}
                        className="group flex flex-col items-end gap-2"
                    >
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#1a1a1a]/40 group-hover:text-[#1a1a1a] transition-colors duration-300 font-[family-name:var(--font-space)]">
                            Examine Logic
                        </span>
                        <div className="w-8 h-[1px] bg-[#1a1a1a]/20 group-hover:w-16 group-hover:bg-[#1a1a1a] transition-all duration-300"></div>
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
                            className="absolute inset-0 bg-[#FAFAF7]/90 z-20 flex flex-col p-8 md:p-16 border-[1px] border-[#1a1a1a]/5"
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsInsightOpen(false); }}
                                className="absolute top-8 right-8 w-12 h-12 rounded-full border border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:border-[#1a1a1a]/30 transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            <div className="flex items-center gap-3 mb-10">
                                <span className="w-2 h-2 rounded-full bg-[#B8860B] shadow-[0_0_10px_#B8860B]"></span>
                                <span className="text-[10px] text-[#1a1a1a]/50 uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-space)" }}>Process Expanded</span>
                            </div>

                            <div className="flex-grow flex flex-col justify-center max-w-xl">
                                <h4 className="text-3xl md:text-5xl text-[#1a1a1a] font-medium mb-6 font-sans" style={{ fontFamily: "var(--font-display)" }}>
                                    {data.insight.theme}
                                </h4>

                                <p className="text-xl md:text-2xl text-[#1a1a1a]/70 font-light leading-relaxed italic" style={{ fontFamily: "var(--font-outfit)" }}>
                                    &quot;{data.insight.revelation}&quot;
                                </p>

                                {data.insight.processFlow && (
                                    <div className="mt-8 font-mono text-[10px] md:text-xs text-[#8A631F] tracking-widest uppercase border-l-2 border-[#D4AF37] pl-4 py-3 bg-[#D4AF37]/5 font-[family-name:var(--font-space)]">
                                        <div className="text-[#1a1a1a]/40 mb-3 text-[9px]">Calculated Timeline:</div>
                                        <div className="flex flex-wrap gap-y-2 items-center">
                                            {data.insight.processFlow.split(' - ').map((step: string, idx: number, arr: any[]) => (
                                                <span key={idx} className="flex items-center">
                                                    <span className="text-[#1a1a1a]/80">{step}</span>
                                                    {idx < arr.length - 1 && <span className="mx-2 text-[#D4AF37] text-[9px]">►</span>}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {data.insight.command && (
                                <div className="mt-auto pt-8 border-t border-[#1a1a1a]/10">
                                    <button
                                        onClick={() => router.push('/reviews')}
                                        className="group relative overflow-hidden px-8 py-4 bg-[#1a1a1a] text-[#FAFAF7] font-medium uppercase tracking-[0.2em] text-[10px] transition-all duration-500 float-right shadow-[0_10px_20px_rgba(26,26,26,0.1)] hover:shadow-[0_15px_30px_rgba(184,134,11,0.2)] font-[family-name:var(--font-space)]"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            {data.insight.command}
                                        </span>
                                        <div className="absolute inset-0 bg-[#B8860B] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] z-0"></div>
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
