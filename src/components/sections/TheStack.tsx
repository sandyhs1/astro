"use client";

import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const cards = [
    {
        title: "THE FINANCIAL BLOCK",
        subtitle: "Why You're Broke",
        description: "You work harder than everyone else but stay in the same tax bracket. It's not the economy. It's your timing. We show you exactly when to push and when to hoard.",
        color: "#1a0524",
        border: "#FF4444",
        protocol: {
            code: "PROTOCOL: WEALTH_EXTRACTION",
            status: "CRITICAL FAILURE DETECTED",
            brief: "Subject is trading time for money. This is a losing volatility trade. 2nd House & 11th House alignment suggests dormant asset capabilities.",
            action: "ACTIVATE WEALTH YOGAS"
        }
    },
    {
        title: "THE TOXIC LOOP",
        subtitle: "Why You're Lonely",
        description: "You interpret anxiety as chemistry. We expose the exact planetary trigger that makes you attracted to people who destroy you—so you can finally stop.",
        color: "#22082e",
        border: "#FFD700",
        protocol: {
            code: "PROTOCOL: CORE_MAGNETISM",
            status: "PATTERN LOOP DETECTED",
            brief: "Subject confuses trauma bonding with soul recognition. Venus-Rahu conflict indicates high susceptibility to emotional vampires.",
            action: "BREAK THE CYCLE"
        }
    },
    {
        title: "THE AUTHORITY",
        subtitle: "How to Rule",
        description: "Mediocrity is a disease. We hand you the blueprint to your own power. No more asking for permission. No more waiting. pure, unadulterated command.",
        color: "#2a0a38",
        border: "#FFFFFF",
        protocol: {
            code: "PROTOCOL: DOMINION_OVERRIDE",
            status: "DORMANT POWER SIGNATURE",
            brief: "Subject is waiting for permission that will never come. Sun placement demands autonomous empire building, not employment.",
            action: "SEIZE COMMAND"
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
        <div ref={containerRef} className="bg-[#12011A] relative">
            {cards.map((card, i) => {
                const targetScale = 1 - (cards.length - i) * 0.05;
                return (
                    <Card
                        key={i}
                        i={i}
                        c={card}
                        progress={scrollYProgress}
                        range={[i * 0.25, 1]}
                        targetScale={targetScale}
                    />
                );
            })}
        </div>
    );
}

function Card({ i, c, progress, range, targetScale }: { i: number, c: any, progress: MotionValue<number>, range: [number, number], targetScale: number }) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    const scale = useTransform(progress, range, [1, targetScale]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
                className="relative w-full md:w-[60vw] max-w-2xl h-[65vh] md:h-[60vh] rounded-2xl p-6 md:p-10 flex flex-col justify-between border shadow-2xl origin-top overflow-hidden"
                initial={{ backgroundColor: c.color, borderColor: c.border }}
                animate={{ backgroundColor: c.color, borderColor: c.border }}
            >
                {/* Main Content */}
                <div className="relative z-10 transition-opacity duration-300" style={{ opacity: isOpen ? 0.1 : 1 }}>
                    <div>
                        <h3 className="font-mono text-xs md:text-sm tracking-widest uppercase opacity-60 mb-2" style={{ color: c.border }}>{c.subtitle}</h3>
                        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">{c.title}</h2>
                    </div>

                    <p className="font-sans text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-lg">
                        {c.description}
                    </p>
                </div>

                <div className="flex justify-between items-end relative z-10">
                    <span className="font-mono text-4xl md:text-6xl opacity-10 font-bold text-white">{`0${i + 1}`}</span>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-xs md:text-sm font-bold uppercase tracking-widest border-b border-white pb-1 hover:text-[#FFD700] hover:border-[#FFD700] transition-colors text-white"
                    >
                        Read protocol
                    </button>
                </div>

                {/* Dossier Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                            exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute inset-0 bg-[#0f0f0f] z-20 flex flex-col p-6 md:p-10 border-[1px] border-[#FFD700]/30"
                        >
                            {/* Paper texture overlay */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

                            {/* Close Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6 md:mb-8 border-b border-[#333] pb-4">
                                <span className="bg-red-600 text-black font-bold text-[10px] md:text-xs px-2 py-1 uppercase tracking-widest">Top Secret</span>
                                <span className="font-mono text-xs text-gray-500 uppercase">Clearance: Level 5</span>
                            </div>

                            {/* Typewriter text content */}
                            <div className="flex-grow space-y-4 md:space-y-6 font-mono">
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Decrypted Code:</p>
                                    <p className="text-[#FFD700] text-sm md:text-lg">{c.protocol.code}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Status:</p>
                                    <p className="text-red-500 font-bold flashing-text text-sm md:text-lg animate-pulse">{c.protocol.status}</p>
                                </div>

                                <div className="bg-[#1a1a1a] p-4 border-l-2 border-red-500">
                                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                                        "{c.protocol.brief}"
                                    </p>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="mt-auto pt-6 border-t border-[#333]">
                                <button
                                    onClick={() => router.push('/report')}
                                    className="w-full bg-[#FFD700] text-black font-bold py-3 md:py-4 uppercase tracking-widest text-xs md:text-sm hover:bg-white transition-colors flex items-center justify-center gap-2 group"
                                >
                                    <span>{c.protocol.action}</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                                <p className="text-[10px] text-gray-600 text-center mt-3 uppercase tracking-widest">Authorized Personnel Only</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
