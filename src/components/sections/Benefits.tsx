"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";

const benefits = [
    {
        title: "CAREER",
        headline: "WAR.",
        text: "You're not losing because you lack ambition. You're losing because you're launching, pitching, and negotiating on your weakest mathematical days. We reveal the exact windows when your market is receptive. Strike then. Not before.",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2064&auto=format&fit=crop"
    },
    {
        title: "RELATIONSHIPS",
        headline: "GRAVITY.",
        text: "You keep falling for the same dynamic with a different face. That is not bad luck — that is an unrecognized psychological loop. We map the exact emotional cycles that make you magnetic or repellent. Stop self-sabotaging the ones built to last.",
        img: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?q=80&w=2071&auto=format&fit=crop"
    },
    {
        title: "LEGACY",
        headline: "IMMORTAL.",
        text: "Most people spend their entire lives reacting to environmental chaos. You now have the exact coordinates to navigate it. Align your strategic decisions with the macro-cycles that outlive you. Build something that doesn't rely on luck to survive.",
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
        <section ref={containerRef} className="bg-[#FAFAF7]">
            {benefits.map((b, i) => (
                <BenefitCard key={i} data={b} index={i} />
            ))}
        </section>
    );
}

function BenefitCard({ data, index }: { data: any, index: number }) {
    return (
        <div className="h-screen w-full sticky top-0 flex items-center justify-center overflow-hidden bg-[#FAFAF7] border-y border-[#1a1a1a]/5">
            {/* Background Image with Parallax/Lighten */}
            <div className="absolute inset-0 z-0">
                <img src={data.img} alt={data.title} className="w-full h-full object-cover opacity-[0.07] grayscale transition-transform duration-[2s] hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF7]/80 via-transparent to-[#FAFAF7]/90"></div>
                
                {/* Noise texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center text-center w-full">

                <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="font-mono text-[#D4AF37] text-xs md:text-sm tracking-[0.5em] mb-4 uppercase border border-[#D4AF37]/30 px-6 py-2 rounded-full bg-white/70 backdrop-blur-md font-[family-name:var(--font-space)] shadow-sm"
                >
                    {data.title}
                </motion.span>

                <motion.h2
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    whileInView={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-serif text-[18vw] md:text-[15vw] leading-[0.8] text-[#1a1a1a] font-bold tracking-tighter blur-[0.5px] opacity-10 select-none font-[family-name:var(--font-display)]"
                >
                    {data.headline}
                </motion.h2>

                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 md:mt-12 backdrop-blur-md bg-white/80 p-8 md:p-10 rounded-[2rem] border border-[#1a1a1a]/5 max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B]" />
                    <p className="font-sans text-base md:text-xl text-[#1a1a1a]/80 leading-relaxed font-light font-[family-name:var(--font-outfit)]">
                        {data.text}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
