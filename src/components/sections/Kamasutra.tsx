"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const cards = [
    {
        id: 1,
        title: "Emotional Bankruptcy",
        text: "Stop investing in people who treat you like an option. Your 7th House reveals why you attract takers, narcissists, and emotional ghosts. Close the account.",
    },
    {
        id: 2,
        title: "Cortisol Addiction",
        text: "You're not 'hustling', you're dying. Your body is keeping score of every compromise. We pinpoint exactly when your health will crash if you don't pivot.",
    },
    {
        id: 3,
        title: "The Mediocrity Trap",
        text: "Competence is a commodity. You are being paid to be safe, not great. We identify the exact 'X-Factor' in your chart that scares your boss but builds your empire.",
    },
    {
        id: 4,
        title: "Lineage Breaker",
        text: "You inherited your parents' fears, not just their genes. It ends with you. We show you the karmic debt you need to pay off so your children don't have to.",
    },
];

export default function Kamasutra() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-[#12011A]">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <h2 className="absolute top-10 left-10 z-10 font-serif text-4xl text-[#FFD700] mix-blend-difference">
                    Weaponize Your Attraction
                </h2>
                <motion.div style={{ x }} className="flex gap-10 pl-20 pr-20">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="group relative h-[60vh] w-[80vw] md:w-[40vw] flex-shrink-0 overflow-hidden rounded-3xl border border-[#FFD700]/30 bg-[#1a0524]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent group-hover:opacity-20 transition-opacity duration-500"></div>

                            <div className="absolute top-0 right-0 p-8 opacity-20 text-9xl font-mono font-bold text-[#FFD700]">
                                0{card.id}
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-10">
                                <h3 className="mb-4 font-serif text-4xl md:text-5xl text-white group-hover:text-[#FFD700] transition-colors">{card.title}</h3>
                                <p className="font-mono text-lg text-gray-400 group-hover:text-white transition-colors">{card.text}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
