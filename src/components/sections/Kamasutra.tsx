"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const cards = [
    {
        id: 1,
        title: "Relational Dynamics",
        subtitle: "The Magnetic Pull",
        text: "Stop attracting repetitive trauma loops. Your mathematical blueprint reveals exactly why you fall for certain archetypes. We dismantle these hidden patterns so you transition from reacting to selecting.",
        img: "https://images.unsplash.com/photo-1510006851086-4f738fe72922?q=80&w=3402&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Career Trajectory",
        subtitle: "Total Dominion",
        text: "You're not 'hustling', you're guessing. We expose the exact structural advantages in your chart. Stop playing fair and relying on luck. Start dominating markets by aligning with your proven temporal authority.",
        img: "https://images.unsplash.com/photo-1541086082987-0b16521bc569?q=80&w=3387&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Biological Cycles",
        subtitle: "Vitality Mastery",
        text: "Your body isn't random; it functions on strict planetary cadence. We pinpoint the precise temporal weaknesses draining your energy and bandwidth. Optimize your physical existence before exhaustion forces a shutdown.",
        img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=3514&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Self Actualization",
        subtitle: "The Final Form",
        text: "Destroy the version of you that seeks external validation. We provide the ruthless, objective path to self-mastery. Evolve using data, not feelings. The universe ignores potential that refuses to calculate its next move.",
        img: "https://images.unsplash.com/photo-1502809737437-1d85c70dd2ca?q=80&w=3474&auto=format&fit=crop"
    },
];

export default function Kamasutra() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.15, 0.05]);

    return (
        <section ref={targetRef} className="relative h-[400vh] bg-[#FAFAF7]">
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center border-y border-[#1a1a1a]/5">
                <motion.div
                    style={{ opacity: bgOpacity }}
                    className="absolute inset-0 bg-[#D4AF37] mix-blend-multiply pointer-events-none"
                />

                <div className="absolute top-12 md:top-24 left-6 md:left-12 lg:left-24 z-10 w-full md:w-auto pr-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h2 className="text-4xl md:text-5xl text-[#1a1a1a] font-medium tracking-wide mb-2 pt-4" style={{ fontFamily: "var(--font-cinzel)" }}>
                            Weaponize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] italic font-bold">Data.</span>
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-px bg-[#1a1a1a]/20"></span>
                            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#D4AF37]" style={{ fontFamily: "var(--font-space)" }}>
                                Scroll to unlock
                            </span>
                        </div>
                    </motion.div>
                </div>

                <motion.div style={{ x }} className="flex w-max flex-nowrap gap-8 md:gap-16 pl-6 md:pl-24 pr-[10vw] pt-24 items-center h-full">
                    {cards.map((card, idx) => (
                        <div
                            key={card.id}
                            className="group relative h-[65vh] w-[85vw] md:w-[35vw] flex-shrink-0 overflow-hidden rounded-[2rem] border border-[#1a1a1a]/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_rgba(212,175,55,0.1)] transition-shadow duration-700"
                        >
                            <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply group-hover:opacity-[0.25] group-hover:scale-105 transition-all duration-1000 ease-[0.16,1,0.3,1]">
                                <Image
                                    src={card.img}
                                    alt={card.title}
                                    fill
                                    className="object-cover grayscale"
                                    sizes="(max-width: 768px) 85vw, 35vw"
                                    priority={idx === 0}
                                />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent group-hover:from-white/95 transition-colors duration-700"></div>

                            <div className="absolute top-8 right-8 text-[8rem] leading-none text-[#1a1a1a] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 font-bold select-none pointer-events-none" style={{ fontFamily: "var(--font-display)" }}>
                                0{card.id}
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                                <span className="block text-[#D4AF37] text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold mb-4" style={{ fontFamily: "var(--font-space)" }}>
                                    {card.subtitle}
                                </span>
                                <h3 className="mb-4 text-3xl md:text-4xl text-[#1a1a1a] font-medium tracking-tight" style={{ fontFamily: "var(--font-cinzel)" }}>
                                    {card.title}
                                </h3>
                                <p className="text-base md:text-lg text-[#1a1a1a]/70 leading-[1.8] font-light line-clamp-4 group-hover:line-clamp-none transition-all duration-500" style={{ fontFamily: "var(--font-outfit)" }}>
                                    {card.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
