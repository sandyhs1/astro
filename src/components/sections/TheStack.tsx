"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

const cards = [
    {
        title: "THE FINANCIAL BLOCK",
        subtitle: "Why You're Broke",
        description: "You work harder than everyone else but stay in the same tax bracket. It's not the economy. It's your timing. We show you exactly when to push and when to hoard.",
        color: "#1a0524",
        border: "#FF4444"
    },
    {
        title: "THE TOXIC LOOP",
        subtitle: "Why You're Lonely",
        description: "You interpret anxiety as chemistry. We expose the exact planetary trigger that makes you attracted to people who destroy you—so you can finally stop.",
        color: "#22082e",
        border: "#FFD700"
    },
    {
        title: "THE AUTHORITY",
        subtitle: "How to Rule",
        description: "Mediocrity is a disease. We hand you the blueprint to your own power. No more asking for permission. No more waiting. pure, unadulterated command.",
        color: "#2a0a38",
        border: "#FFFFFF"
    }
];

export default function TheStack() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <div ref={containerRef} className="bg-[#12011A]">
            {cards.map((card, i) => {
                // Calculate dynamic scale and top position for stacking effect.
                // We want the earlier cards to scale down and fade out slightly as we scroll past them.
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
    })

    // As the main container scrolls, we transform the scale of previous cards
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
            <motion.div
                style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
                className="relative w-[90vw] md:w-[60vw] max-w-2xl h-[60vh] rounded-2xl p-10 flex flex-col justify-between border shadow-2xl origin-top"
                initial={{ backgroundColor: c.color, borderColor: c.border }}
                animate={{ backgroundColor: c.color, borderColor: c.border }}
            >
                <div>
                    <h3 className="font-mono text-sm tracking-widest uppercase opacity-60 mb-2" style={{ color: c.border }}>{c.subtitle}</h3>
                    <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">{c.title}</h2>
                </div>

                <p className="font-sans text-xl md:text-2xl text-gray-300 leading-relaxed max-w-lg">
                    {c.description}
                </p>

                <div className="flex justify-between items-end">
                    <span className="font-mono text-6xl opacity-10 font-bold">{`0${i + 1}`}</span>
                    <button className="text-sm font-bold uppercase tracking-widest border-b border-white pb-1 hover:text-[#FFD700] hover:border-[#FFD700] transition-colors">
                        Read protocol
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
