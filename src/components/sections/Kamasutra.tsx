"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const cards = [
    {
        id: 1,
        title: "Love Life",
        subtitle: "The Magnetic Pull",
        text: "Stop attracting trauma bonds. Your chart reveals exactly why you simp for toxicity. We kill the weak patterns so you become the one they chase.",
        img: "https://images.unsplash.com/photo-1510006851086-4f738fe72922?q=80&w=3402&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Career",
        subtitle: "Total Dominion",
        text: "You're not 'hustling', you're dying. We expose the exact unfair advantage in your chart. Stop playing fair. Start dominating markets by aligning with your cosmic authority.",
        img: "https://images.unsplash.com/photo-1541086082987-0b16521bc569?q=80&w=3387&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Health",
        subtitle: "Biological Mastery",
        text: "Your body isn't random; it's a stellar machine. We pinpoint the precise planetary weaknesses draining your vitality. Bio-hack your existence before your biology forces a shutdown.",
        img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=3514&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Better Human",
        subtitle: "The Final Form",
        text: "Kill the version of you that seeks validation. We show you the ruthless path to self-mastery. Evolve or dissolve. The universe has no mercy for potential that refuses to act.",
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
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.4, 0.1]);

    return (
        <section ref={targetRef} className="relative h-[400vh] bg-[#050505]">
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
                <motion.div
                    style={{ opacity: bgOpacity }}
                    className="absolute inset-0 bg-[#8A0303] mix-blend-screen pointer-events-none"
                />

                <div className="absolute top-12 md:top-24 left-6 md:left-12 lg:left-24 z-10 w-full md:w-auto pr-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h2 className="text-4xl md:text-6xl text-white font-medium tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
                            Weaponize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFF8D6] italic">Life.</span>
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-px bg-white/30"></span>
                            <span className="text-sm font-light uppercase tracking-[0.3em] text-white/50" style={{ fontFamily: "var(--font-body)" }}>
                                Scroll to unlock
                            </span>
                        </div>
                    </motion.div>
                </div>

                <motion.div style={{ x }} className="flex gap-8 md:gap-16 pl-6 md:pl-24 pr-[10vw] pt-24 items-center h-full">
                    {cards.map((card, idx) => (
                        <div
                            key={card.id}
                            className="group relative h-[65vh] w-[85vw] md:w-[35vw] flex-shrink-0 overflow-hidden rounded-[2rem] border border-white/[0.05] bg-black shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                        >
                            <div className="absolute inset-0 opacity-40 mix-blend-luminosity group-hover:opacity-70 group-hover:scale-105 transition-all duration-1000 ease-[0.16,1,0.3,1]">
                                <Image
                                    src={card.img}
                                    alt={card.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 85vw, 35vw"
                                    priority={idx === 0}
                                />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-black/90 transition-colors duration-700"></div>

                            <div className="absolute top-8 right-8 text-[8rem] leading-none text-white opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 font-medium" style={{ fontFamily: "var(--font-display)" }}>
                                0{card.id}
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                                <span className="block text-[#D4AF37] text-xs uppercase tracking-[0.3em] font-medium mb-4" style={{ fontFamily: "var(--font-body)" }}>
                                    {card.subtitle}
                                </span>
                                <h3 className="mb-6 text-4xl md:text-5xl text-white font-medium" style={{ fontFamily: "var(--font-display)" }}>
                                    {card.title}
                                </h3>
                                <p className="text-lg text-white/60 leading-relaxed font-light line-clamp-4 group-hover:line-clamp-none transition-all duration-500" style={{ fontFamily: "var(--font-body)" }}>
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
