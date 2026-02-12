"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const benefits = [
    {
        title: "CAREER",
        headline: "WAR.",
        text: "The market doesn't care about your passion. It cares about timing. Most businesses fail because they launch in a void. We give you the astrological 'Cheat Codes' to strike when the universe is contractually obligated to back you.",
        img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "LOVE",
        headline: "CONQUEST.",
        text: "Marriage isn't a fairy tale; it's a merger. 50% end in divorce because people marry potential, not reality. We strip away the romance and show you the raw compatibility data. Save yourself a decade of lawyers and therapy.",
        img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1974&auto=format&fit=crop"
    },
    {
        title: "LEGACY",
        headline: "IMMORTAL.",
        text: "You will be forgotten in 3 generations unless you build something requiring divine intervention. Most people leave debt; you will leave a dynasty. We align your life's work with your soul's blueprint so it echoes after you're gone.",
        img: "https://images.unsplash.com/photo-1635322966219-b75ed3a9eb8c?q=80&w=2071&auto=format&fit=crop"
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
