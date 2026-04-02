"use client";

import { motion } from "framer-motion";
import { FaCrosshairs, FaDatabase, FaSatellite } from "react-icons/fa";
import { useRouter } from "next/navigation";

const features = [
    {
        icon: <FaDatabase className="text-3xl text-[#D4AF37]" />,
        title: "Decision Intelligence",
        desc: (
            <span className="block text-[#1a1a1a]/80 font-medium text-sm mt-1 font-[family-name:var(--font-outfit)]">
                Not generic astrology. Raw mathematical inputs decoded for strategic execution.
            </span>
        ),
    },
    {
        icon: <FaCrosshairs className="text-3xl text-[#D4AF37]" />,
        title: "Forensic Pattern Recognition",
        desc: (
            <div className="font-[family-name:var(--font-outfit)] text-sm text-[#1a1a1a]/70 leading-relaxed mt-1">
                We don't tell you <span className="text-[#1a1a1a] font-semibold">&apos;what will happen to you.&apos;</span>
                <span className="block mt-1">We reveal exact psychological cycles so you can circumvent them.</span>
            </div>
        ),
    },
    {
        icon: <FaSatellite className="text-3xl text-[#D4AF37]" />,
        title: "Macro-Cycle Navigation",
        desc: (
            <span className="block text-[#1a1a1a]/70 text-sm mt-1 font-[family-name:var(--font-outfit)] leading-relaxed">
                Your psychology runs in rigid planetary cycles. Your calendar ignores it. We sync them.
            </span>
        )
    },
];

export default function USP() {
    const router = useRouter();

    return (
        <section className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center py-24 relative overflow-hidden border-y border-[#1a1a1a]/5">

            {/* Premium Light Background */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FAFAF7] to-transparent pointer-events-none"></div>

            <div className="max-w-7xl w-full px-6 z-10">
                <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">

                    {/* Text Side */}
                    <div className="md:w-1/2">
                        <motion.h2
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-7xl text-[#1a1a1a] font-medium leading-[1.1] tracking-tight mb-8" style={{ fontFamily: "var(--font-display)" }}
                        >
                            The <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] italic pr-4 font-bold">Unfair</span> <br />
                            Advantage.
                        </motion.h2>
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="font-[family-name:var(--font-outfit)] font-light text-[#1a1a1a]/70 text-base md:text-lg leading-[1.8] mb-12"
                        >
                            Astrology is the original mapping system of human psychology. Our blueprint is a <span className="text-[#1a1a1a] font-medium border-b border-[#D4AF37]/50 pb-1">predictive architectural model</span> for your destiny.
                            <br /><br />
                            While others look at the stars and make a wish, we look at the data and execute a calculated command. This isn't about spiritual comfort. It's about precision engineering.
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            onClick={() => router.push('/reviews')}
                            className="group relative px-10 py-4 bg-white border border-[#1a1a1a]/10 text-[#1a1a1a] hover:border-[#1a1a1a] transition-all duration-500 font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] font-[family-name:var(--font-space)]"
                        >
                            <span className="absolute inset-0 bg-[#FAFAF7] -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                            <FaCrosshairs className="text-[#D4AF37] group-hover:animate-spin" />
                            <span>Read Case Studies</span>
                        </motion.button>
                    </div>

                    {/* Features Side */}
                    <div className="md:w-1/2 space-y-6">
                        {features.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 + (i * 0.1) }}
                                viewport={{ once: true }}
                                className="flex gap-6 p-8 border border-[#1a1a1a]/5 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-2xl hover:border-[#D4AF37]/30 hover:shadow-[0_20px_50px_rgba(212,175,55,0.08)] transition-all duration-500 group"
                            >
                                <div className="shrink-0 pt-1 transition-transform duration-500 group-hover:scale-110">{item.icon}</div>
                                <div>
                                    <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl text-[#1a1a1a] mb-2 font-medium">{item.title}</h3>
                                    <div>{item.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
