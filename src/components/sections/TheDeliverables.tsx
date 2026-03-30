"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const deliverables = [
    {
        id: "01",
        title: "12-Month Tactical Timeline",
        desc: "A precise, algorithmic mapping of your upcoming high-leverage cycles. Know exactly when to strike and when to shadow."
    },
    {
        id: "02",
        title: "'Lethal Weakness' Behavioral Audit",
        desc: "Forensic analysis of the recurring blind spots that are actively self-sabotaging your wealth and relationships."
    },
    {
        id: "03",
        title: "DIY Ritual Protocol",
        desc: "Zero crystals. Zero recurring fees. Pure executable actions you stringently deploy to recalibrate neural wiring."
    }
];

export default function TheDeliverables() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    const yTransform = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section ref={containerRef} className="bg-[#05000A] min-h-screen py-32 px-6 flex flex-col items-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#FFD700]/5 blur-[200px] rounded-full pointer-events-none mix-blend-screen" />
            
            <div className="max-w-7xl w-full z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                {/* Text Content */}
                <div className="flex-1 w-full order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-6xl text-white font-bold mb-4 tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
                            THE SURVEILLANCE DATA: <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFF8D6] italic">WHAT YOU GET.</span>
                        </h2>
                        <div className="h-[2px] bg-[#FFD700] w-24 mb-10"></div>
                    </motion.div>

                    <div className="space-y-12">
                        {deliverables.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                className="group relative"
                            >
                                <div className="absolute -left-6 top-0 w-1 h-full bg-[#FFD700]/20 group-hover:bg-[#FFD700] transition-colors" />
                                <div className="flex flex-col gap-2">
                                    <span className="font-mono text-xs text-[#FFD700]/50 tracking-[0.2em]">DELIVERABLE {item.id}</span>
                                    <h3 className="font-serif text-2xl text-white tracking-wide">{item.title}</h3>
                                    <p className="font-mono text-gray-400 text-sm md:text-base leading-relaxed max-w-lg mt-2">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 px-8 py-4 border border-[#FFD700]/30 text-[#FFD700] font-mono text-sm uppercase tracking-widest hover:bg-[#FFD700]/10 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:shadow-[0_0_25px_rgba(255,215,0,0.2)]"
                    >
                        <a href="/sample-report" className="flex items-center gap-3">
                            [ VIEW THE FRAMEWORK ]
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </a>
                    </motion.button>
                </div>

                {/* Conceptual Terminal Window */}
                <div className="flex-1 w-full order-1 lg:order-2 perspective-1000">
                    <motion.div 
                        style={{ y: yTransform }}
                        className="relative w-full aspect-[4/5] max-w-md mx-auto"
                    >
                        {/* Frame */}
                        <div className="absolute inset-0 bg-[#0A0505] rounded-xl border border-[#FFD700]/20 shadow-[0_0_50px_rgba(255,215,0,0.05)] overflow-hidden backdrop-blur-md flex flex-col">
                            {/* Window Header */}
                            <div className="h-8 bg-black/40 border-b border-[#FFD700]/10 flex items-center px-4 gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                <span className="ml-auto font-mono text-[10px] text-[#FFD700]/40 tracking-widest">SYSTEM_AUDIT.EXE</span>
                            </div>

                            {/* Window Body (Blurred/Scrolling Content) */}
                            <div className="p-6 h-full w-full relative overflow-hidden flex flex-col">
                                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] z-20" />
                                
                                <div className="animate-[scrollUp_20s_linear_infinite] space-y-6 text-[#FFD700] font-mono text-xs whitespace-pre-wrap opacity-60">
                                    <div className="mb-4 text-[#FF4B4B] font-bold">WARNING: LEAK ALONG TIMELINE DETECTED</div>
                                    <p>{"TIMESTAMP: " + new Date().toISOString()}</p>
                                    <p>TARGET: IDENTIFIED</p>
                                    <p className="opacity-50">INITIALIZING PATTERN RECOGNITION...</p>
                                    <div className="h-px w-full bg-[#FFD700]/20 my-4" />
                                    
                                    {/* Abstract Data Viz */}
                                    <div className="space-y-3">
                                        <div className="flex gap-2 items-center">
                                            <span className="w-12 text-right">Q1</span>
                                            <div className="flex-1 h-2 bg-[#FFD700]/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500/50 w-[80%]" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span className="w-12 text-right">Q2</span>
                                            <div className="flex-1 h-2 bg-[#FFD700]/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#FFD700]/50 w-[30%]" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <span className="w-12 text-right">Q3</span>
                                            <div className="flex-1 h-2 bg-[#FFD700]/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500/50 w-[95%]" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="h-px w-full bg-[#FFD700]/20 my-4" />
                                    <p>PROTOCOL RECOMMENDED: RECALIBRATION REQUIRED</p>
                                    <p>{"{"}</p>
                                    <p className="ml-4">"dasha": "Mercury",</p>
                                    <p className="ml-4">"sub_dasha": "Saturn",</p>
                                    <p className="ml-4 text-red-400">"risk_vector": "High"</p>
                                    <p>{"}"}</p>
                                    <p>EXECUTING COUNTER-MEASURES...</p>
                                </div>
                            </div>
                        </div>

                        {/* Scanner Effect */}
                        <motion.div 
                            animate={{ y: ["0%", "400%", "0%"] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent top-0 z-30 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                        />
                    </motion.div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scrollUp {
                    0% { transform: translateY(100%); }
                    100% { transform: translateY(-100%); }
                }
            `}</style>
        </section>
    );
}
