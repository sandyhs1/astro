"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const benefits = [
    {
        title: "CAREER",
        headline: "WAR.",
        text: "Don't compete. Devour. We show you the exact dates to launch, negotiate, or destroy the competition.",
        img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "LOVE",
        headline: "CONQUEST.",
        text: "Don't date. Collect souls. We identify who enhances your power and who drains your bank account.",
        img: "https://images.unsplash.com/photo-1507919909716-c8262e491cde?q=80&w=2127&auto=format&fit=crop"
    },
    {
        title: "LEGACY",
        headline: "IMMORTAL.",
        text: "You will die. Your empire shouldn't. We optimize your life for maximum historical impact.",
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
                <img src={data.img} alt={data.title} className="w-full h-full object-cover opacity-30 grayscale" />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
                <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="font-mono text-[#FFD700] text-sm tracking-[0.5em] mb-4"
                >
                    {data.title}
                </motion.span>

                <motion.h2
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="font-serif text-[15vw] leading-none text-white font-bold tracking-tighter mix-blend-overlay"
                >
                    {data.headline}
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="font-serif text-2xl md:text-4xl text-gray-300 max-w-3xl mt-8 leading-relaxed"
                >
                    {data.text}
                </motion.p>
            </div>
        </div>
    );
}
