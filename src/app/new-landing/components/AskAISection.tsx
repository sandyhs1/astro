'use client';

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const queryPrompt = "What is QuantumKarma.tech? Why does it add so much value?";

const aiLinks = [
    {
        name: "ChatGPT",
        url: `https://chatgpt.com/?q=${encodeURIComponent(queryPrompt)}`,
        color: "#10a37f",
        icon: "GPT"
    },
    {
        name: "Claude",
        url: `https://claude.ai/new?q=${encodeURIComponent(queryPrompt)}`,
        color: "#d78a63",
        icon: "CLA"
    },
    {
        name: "Gemini",
        url: `https://www.google.com/search?q=${encodeURIComponent(queryPrompt)}`,
        color: "#4285f4",
        icon: "GEM"
    },
    {
        name: "Perplexity",
        url: `https://www.perplexity.ai/search?q=${encodeURIComponent(queryPrompt)}`,
        color: "#21b9b0",
        icon: "PRP"
    }
];

export default function AskAISection() {
    return (
        <section className="py-12 md:py-20 relative overflow-hidden" style={{ background: '#FAFAF7' }}>
            <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
                {/* Premium Animated Border Wrapper */}
                <div className="relative rounded-[2rem] md:rounded-[2.5rem] p-[2px] overflow-hidden shadow-2xl">
                    <style>
                        {`
                        @keyframes spin-border {
                            0% { transform: translate(-50%, -50%) rotate(0deg); }
                            100% { transform: translate(-50%, -50%) rotate(360deg); }
                        }
                        .animate-border-spin {
                            animation: spin-border 5s linear infinite;
                        }
                        `}
                    </style>
                    <div 
                        className="absolute top-[50%] left-[50%] w-[150%] h-[150%] animate-border-spin pointer-events-none"
                        style={{ 
                            background: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, hsl(245,60%,28%), hsl(270,60%,40%), hsl(30,80%,55%), transparent 100%)',
                            transformOrigin: 'center center'
                        }} 
                    />
                    
                    {/* Inner Content Box */}
                    <div className="relative z-10 flex flex-col items-center rounded-[1.9rem] md:rounded-[2.4rem] px-4 py-10 md:px-8 md:py-14" style={{ background: '#FAFAF7', boxShadow: 'inset 0 4px 25px rgba(0,0,0,0.03)' }}>
                        <AnimatedSection className="mb-6 md:mb-8 space-y-3 flex flex-col items-center text-center">
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold" style={{ color: 'hsl(240,20%,8%)', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1.1 }}>
                                Don't take our word for it.
                            </h2>
                            <p className="mt-3 text-sm md:text-base max-w-md mx-auto leading-relaxed" style={{ color: 'hsl(240,10%,46%)', fontFamily: "'Space Grotesk',sans-serif" }}>
                                Let AI empower your decisions. Select an engine below to verify the truth for yourself.
                            </p>
                        </AnimatedSection>

                        {/* 2x2 on mobile, 4 in a row on desktop */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 w-full max-w-3xl">
                            {aiLinks.map((ai, index) => (
                                <AnimatedSection key={ai.name} delay={index * 0.08}>
                                    <motion.a
                                        href={ai.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.04, y: -2 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="flex flex-col items-center justify-center p-3 md:p-4 rounded-xl md:rounded-2xl relative overflow-hidden group border text-center"
                                        style={{
                                            background: '#fff',
                                            borderColor: 'hsl(40,15%,92%)',
                                            boxShadow: '0 6px 18px -4px rgba(0,0,0,0.07)',
                                            cursor: 'pointer',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <div 
                                            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                            style={{ background: ai.color }}
                                        />
                                        
                                        <div 
                                            className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white font-bold text-[10px] md:text-xs shadow-md transition-transform duration-300 group-hover:scale-110 relative z-10"
                                            style={{ background: ai.color, fontFamily: "'Space Grotesk',sans-serif" }}
                                        >
                                            {ai.icon}
                                        </div>
                                        <h3 className="mt-2 text-xs md:text-sm font-bold relative z-10" style={{ color: 'hsl(240,20%,8%)', fontFamily: "'Space Grotesk',sans-serif" }}>
                                            {ai.name}
                                        </h3>
                                        <span className="text-[10px] md:text-[11px] font-medium relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: ai.color }}>
                                            Ask →
                                        </span>
                                    </motion.a>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
