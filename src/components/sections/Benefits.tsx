"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const benefits = [
    {
        title: "CAREER",
        headline: "WAR.",
        // Career card: timing-focused, brutal, no fluff
        text: "You're not losing because you're lazy. You're losing because you're pitching, launching, and negotiating on your worst days. We show you exactly when the market is listening. Strike then. Not before. Not after.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "LOVE",
        headline: "CONQUEST.",
        // Love card: raw compatibility, no romance fluff
        text: "You keep falling for the same person with a different face. That's not bad luck — that's a pattern. We show you the exact emotional cycles that make you magnetic or repellent. Know your windows. Stop self-sabotaging the ones who actually stay.",
        img: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?q=80&w=2071&auto=format&fit=crop"
    },
    {
        title: "LEGACY",
        headline: "IMMORTAL.",
        // Legacy card: dynasty building, soul blueprint
        text: "Most people spend their whole life reacting. You get to be the one who decided. We align your decisions with the long game — the one that outlives you. Build something that doesn't need you to survive.",
        img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"
    }
];

export default function Benefits() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={containerRef} className="bg-[#000]">
            {benefits.map((b, i) => (
                <BenefitCard key={i} data={b} index={i} />
            ))}
        </section>
    );
}

function BenefitCard({ data, index }: { data: any, index: number }) {
    return (
        <div className="h-screen w-full sticky top-0 flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Parallax/Darken */}
            <div className="absolute inset-0 z-0">
                <img src={data.img} alt={data.title} className="w-full h-full object-cover opacity-40 grayscale transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>

                {/* Noise texturE */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center text-center w-full">

                {/* Border Frame Effect */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"
                ></motion.div>

                <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="font-mono text-[#FFD700] text-xs md:text-sm tracking-[0.5em] mb-4 uppercase border border-[#FFD700]/30 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md"
                >
                    {data.title}
                </motion.span>

                <motion.h2
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    whileInView={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-serif text-[18vw] md:text-[15vw] leading-[0.8] text-white font-bold tracking-tighter mix-blend-overlay opacity-90 select-none"
                    style={{ textShadow: "0 0 50px rgba(255,255,255,0.1)" }}
                >
                    {data.headline}
                </motion.h2>

                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 md:mt-12 backdrop-blur-sm bg-black/30 p-6 md:p-8 rounded-2xl border border-white/5 max-w-2xl"
                >
                    <p className="font-sans text-lg md:text-xl text-gray-200 leading-relaxed font-light">
                        {data.text}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"
                ></motion.div>
            </div>
        </div>
    );
}
