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
                We don&apos;t stop at basic D1 or D9 charts. We analyze <span className="text-[#D4AF37] italic">all Shodashavarga charts</span>, precise planetary degrees, Upapada Lagnas, ASV tables, Chalit, and Dashas for terrifying accuracy.
            </>
        ),
        color: "#050505", 
        glow: "rgba(34, 211, 238, 0.15)", // Cyan glow
        insight: {
            theme: "Protocol: Sub_Atomic",
            revelation: "Scraping multiple dimensional layers of the birth chart. Precision is the only variable."
        }
    },
    {
        title: "Wealth & Career Architecture",
        subtitle: "Phase 02",
        description: (
            <>
                Discover the hyper-specific algorithms of your <span className="text-white font-medium">Career Trajectory</span> and <span className="text-[#D4AF37] italic">Wealth Activation Periods</span>. Do the right thing at the exact right moment.
            </>
        ),
        color: "#0B0805", 
        glow: "rgba(212, 175, 55, 0.2)", // Gold glow
        insight: {
            theme: "Protocol: Resource_Map",
            revelation: "Identifying impending economic windfalls and mapping extreme high-leverage cycles."
        }
    },
    {
        title: "Karmic & Shadow Integration",
        subtitle: "Phase 03",
        description: (
            <>
                Map your <span className="text-white italic">Relationship Karma</span> and deploy crucial <span className="text-red-400 font-medium ml-1">Psychological Shadow Work</span> to eradicate the recurring blind spots sabotaging your success.
            </>
        ),
        color: "#0D0A0A", 
        glow: "rgba(248, 113, 113, 0.15)", // Red glow
        insight: {
            theme: "Protocol: Ego_Death",
            revelation: "Reverse-engineering subconscious limits and psychological wiring algorithms."
        }
    },
    {
        title: "Human Crafted Precision",
        subtitle: "Phase 04",
        description: (
            <>
                Zero bots. Zero templates. Every single calculation is completely <span className="text-[#D4AF37] italic">human-interpreted</span>. Receive your elite dossier and <span className="text-white font-medium">Action Plan</span> within 4 - 6 hours.
            </>
        ),
        color: "#121212", 
        glow: "rgba(255, 255, 255, 0.15)", // Pearl/White glow
        insight: {
            theme: "Protocol: Human_Intelligence",
            revelation: "Ensuring 100% human validation. Delivery locked within a 4 to 6-hour surgical window.",
            processFlow: "Input your birth details - Ask your questions - Kindly pay the Dakshina - Submit",
            command: "Authorize"
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

                                {data.insight.processFlow && (
                                    <div className="mt-8 font-mono text-xs md:text-sm text-[#FFD700] tracking-widest uppercase border-l-2 border-[#FFD700]/50 pl-4 py-3 bg-[#FFD700]/5">
                                        <div className="text-white/50 mb-3 text-[10px]">EXECUTION_FLOW:</div>
                                        <div className="flex flex-wrap gap-y-2 items-center">
                                            {data.insight.processFlow.split(' - ').map((step: string, idx: number, arr: any[]) => (
                                                <span key={idx} className="flex items-center">
                                                    <span className="text-white/90">{step}</span>
                                                    {idx < arr.length - 1 && <span className="mx-2 text-[#FFD700]/50 text-[10px]">►</span>}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {data.insight.command && (
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
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
