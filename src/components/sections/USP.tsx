"use client";

import { motion } from "framer-motion";
import { FaCrosshairs, FaDatabase, FaSatellite } from "react-icons/fa";
import { useRouter } from "next/navigation";

const features = [
    {
        icon: <FaDatabase className="text-4xl text-[#FFD700]" />,
        title: "Decision Intelligence",
        desc: (
            <span className="block text-[#FFD700] font-bold text-lg mt-1">
                Not Astrology.
            </span>
        ),
    },
    {
        icon: <FaCrosshairs className="text-4xl text-[#FFD700]" />,
        // Not 'what will happen' but 'how you create outcomes' card
        title: "Not 'what will happen to you.'",
        desc: (
            <div className="font-mono text-xs text-gray-400 leading-relaxed">
                But <span className="text-white font-bold">&apos;how you repeatedly create outcomes.&apos;</span>
                <span className="block mt-2 text-gray-500">Your patterns are predictable. We make them visible.</span>
            </div>
        ),
    },
    {
        icon: <FaSatellite className="text-4xl text-[#FFD700]" />,
        title: "Your psychology runs in cycles.",
        desc: "Your calendar ignores it.",
    },
];

export default function USP() {
    const router = useRouter();

    return (
        <section className="min-h-screen bg-[#12011A] flex flex-col items-center justify-center py-24 relative overflow-hidden">

            {/* HUD Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,1,26,0.9),rgba(18,1,26,0.9)),url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#FFD700_1px,transparent_1px),linear-gradient(to_bottom,#FFD700_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            <div className="max-w-7xl w-full px-6 z-10">
                <div className="flex flex-col md:flex-row gap-16 items-center">

                    {/* Text Side */}
                    <div className="md:w-1/2">
                        <motion.h2
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-6xl md:text-8xl text-white font-medium leading-[1] tracking-tight mb-8" style={{ fontFamily: "var(--font-display)" }}
                        >
                            The <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFF8D6] italic pr-4">Unfair</span> <br />
                            Advantage.
                        </motion.h2>
                        <motion.p
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="font-mono text-gray-400 text-lg leading-relaxed mb-12"
                        >
                            Astrology is the original psychology. Quantum Karma is a <span className="text-white border-b border-[#FFD700]">surveillance system</span> for your destiny.
                            <br /><br />
                            While others look at the stars and make a wish, we look at the data and execute a command.
                            This isn't about feeling good. It's about being right.
                        </motion.p>

                        <button
                            onClick={() => router.push('/reviews')}
                            className="px-10 py-4 border border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all duration-300 font-mono text-sm uppercase tracking-widest flex items-center gap-4"
                        >
                            <FaCrosshairs className="animate-pulse" />
                            Acquire Target
                        </button>
                    </div>

                    {/* Features Side */}
                    <div className="md:w-1/2 space-y-8">
                        {features.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: 50, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                                viewport={{ once: true }}
                                className="flex gap-6 p-6 border border-white/5 bg-white/5 backdrop-blur-sm rounded-lg hover:border-[#FFD700]/30 transition-colors"
                            >
                                <div className="shrink-0 pt-1">{item.icon}</div>
                                <div>
                                    <h3 className="font-serif text-xl text-white mb-2">{item.title}</h3>
                                    <div className="font-mono text-xs text-gray-400 leading-relaxed">{item.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
