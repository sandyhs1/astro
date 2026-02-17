"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const cards = [
    {
        id: 1,
        title: "Love Life",
        text: "Stop attracting trauma bonds. Your chart reveals exactly why you simp for toxicity. We kill the weak patterns so you become the one they chase.",
    },
    {
        id: 2,
        title: "Career",
        text: "You're not 'hustling', you're dying. We expose the exact unfair advantage in your chart. Stop playing fair. Start dominating markets by aligning with your cosmic authority.",
    },
    {
        id: 3,
        title: "Health",
        text: "Your body isn't random; it's a stellar machine. We pinpoint the precise planetary weaknesses draining your vitality. Bio-hack your existence before your biology forces a shutdown.",
    },
    {
        id: 4,
        title: "Better Human",
        text: "Kill the version of you that seeks validation. We show you the ruthless path to self-mastery. Evolve or dissolve. The universe has no mercy for potential that refuses to act.",
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
                    Weaponize Your Life
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
