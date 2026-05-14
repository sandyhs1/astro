"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

const steps = [
  {
    id: "01",
    title: "Spatial Geocoding & Temporal Normalization",
    description: "The moment a user submits their birth data, the system bypasses standard approximations. We execute precise temporal validation, parsing complex time structures.",
    bullets: [
      "The location is piped through a spatial geocoder to extract exact Geographic Coordinates down to 4 decimal places.",
      "These coordinates dynamically calculate the precise historical UTC temporal offset for that specific point in time."
    ]
  },
  {
    id: "02",
    title: "The NASA-Grade Ephemeris Subsystem",
    description: "We do not rely on standard JavaScript or third-party servers to guess planetary positions. Normalized coordinates are injected into a highly optimized, WebAssembly-compiled ephemeris engine utilizing algorithms designed at NASA JPL.",
    bullets: [
      "Instantaneously generates geocentric positions of all 9 Grahas (Planets) and the Lagna down to the minute of an arc.",
      "Simultaneously calculates all 16 Divisional Charts (Vargas), from the foundational D-1 to the microscopic D-60 (Shashtiamsa)."
    ]
  },
  {
    id: "03",
    title: "The Deep-Vedic Diagnostic Layer",
    description: "This is where Quantum Karma separates from the industry. Raw coordinates are fed into our custom architectural layer to execute highly advanced mathematics locally.",
    grid: [
      { name: "Mrityu Bhaga & Pushkara", desc: "Pinpoints 'kill points' (MB) and 'hidden blessings' (PN) for structural vitality." },
      { name: "Lajjitadi Avasthas", desc: "Maps geometric aspects to diagnose psychological friction (e.g., Kshudhita/Starved)." },
      { name: "Advanced Lagnas & Arudhas", desc: "Calculates Upapada Lagna, A7 (Darapada), and Pranapada Lagna for granular material/relationship mapping." },
      { name: "Bhava Chalit & Ashtakavarga (AV)", desc: "Analyzes true house placement and exact planetary strength point systems (Binnashtakavarga)." },
      { name: "64th Navamsa & Kharesh", desc: "Locates the exact degree of hidden transformations and profound karmic shifts." },
      { name: "Complete Jaimini Karakas", desc: "Extracts all fundamental soul-level markers (from Atmakaraka to Darakaraka)." }
    ]
  },
  {
    id: "04",
    title: "Multi-Dimensional Temporal Sequencing",
    description: "While legacy platforms offer a simple Vimshottari timeline, our engine cross-references the Moon's exact Nakshatra degree to project multiple timelines simultaneously.",
    bullets: [
      "Vimshottari Dasha: The 120-year universal timeline, resolved down to the Prana (minute-by-minute) level.",
      "Yogini Dasha: A secondary, highly sensitive 36-year cycle used to detect fast-moving karmic triggers.",
      "Chara Dasha: A Jaimini sign-based timeline mapping fundamental, unavoidable structural shifts."
    ]
  },
  {
    id: "05",
    title: "The Cryptographic Normalization Payload",
    description: "At this stage, the system holds tens of thousands of fragmented astrological data points. Feeding this directly into an AI would cause immediate context overflow.",
    bullets: [
      "Our custom normalization layer scrubs all boilerplate, isolates the core advanced flags, and compresses the data into a single, hyper-dense, mathematically flawless payload."
    ]
  },
  {
    id: "06",
    title: "The AI Logic Gates",
    description: "Before inference begins, the payload is injected into our Master System Prompt. This is governed by strict, unyielding logic gates to enforce absolute clinical discipline.",
    bullets: [
      "The D-60 Override: The AI must obey the D-60 Deva. If the D-1 chart shows a blessing but the D-60 shows a curse, the AI is forced to predict the D-60 outcome.",
      "The Diagnostic Gate: Forces the AI to actively identify Mrityu Bhaga (Fatal) points and prevents 'sugarcoating' harsh karmic realities.",
      "The No-BS Protocol: Strictly bans hallucination, poetic language, and the suggestion of superstitious, unscientific remedies."
    ]
  },
  {
    id: "07",
    title: "Multi-Model AI Matrix & Scriptural RAG",
    description: "The highly structured data payload is securely routed to our proprietary AI matrix.",
    bullets: [
      "Primary Inference Engine: An industry-leading, frontier AI model with a massive context window for high-speed analytical reasoning.",
      "Fallback Matrix: If the primary engine encounters network latency, the system instantly fails over to an Enterprise-grade AI model via AWS to ensure zero downtime.",
      "Scriptural RAG: The AI perpetually cross-references generated predictions against a Retrieval-Augmented Generation database of canonical Vedic texts (like BPHS) to eliminate hallucinations."
    ]
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
};

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 selection:text-white font-sans overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/30 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/30 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/60 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            QUANTUM KARMA
          </Link>
          <div className="hidden md:flex space-x-6 text-sm text-gray-400 font-medium">
            <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors duration-300">Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-24 px-6 max-w-7xl mx-auto text-center md:text-left">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block px-4 py-1.5 mb-8 border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-[0.2em] uppercase rounded-full shadow-[0_0_20px_rgba(59,130,246,0.15)]"
        >
          System Architecture
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]"
        >
          The <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-indigo-400 to-purple-600">Quantum Engine</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed font-light"
        >
          While legacy apps return basic planetary signs, our engine synthesizes millions of deep-Vedic data points in real-time. This is the anatomical breakdown of how we compute destiny.
        </motion.p>
      </section>

      {/* Process Flow Cards */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              variants={cardVariants}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/0 hover:from-blue-500/30 hover:to-indigo-500/10 transition-all duration-500">
                <div className="absolute inset-0 bg-black/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                <div className="relative bg-[#0a0a0a] border border-white/5 p-8 md:p-12 rounded-[22px] overflow-hidden shadow-2xl">
                  
                  {/* Large Background Number */}
                  <div className="absolute -right-4 -top-8 md:-right-6 md:-top-12 text-[120px] md:text-[180px] font-black text-white/[0.02] group-hover:text-blue-500/[0.03] transition-colors duration-700 pointer-events-none select-none overflow-hidden">
                    {step.id}
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center mb-6">
                      <span className="hidden md:inline-block text-blue-500 font-mono text-xl mr-4 opacity-70 group-hover:opacity-100 transition-opacity">{step.id}.</span>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-100 group-hover:text-white transition-colors">
                        {step.title}
                      </h2>
                    </div>
                    
                    <p className="text-lg text-gray-400 mb-8 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                      {step.description}
                    </p>

                    {step.bullets && (
                      <ul className="space-y-4">
                        {step.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start text-gray-400 group-hover:text-gray-300 transition-colors">
                            <span className="text-blue-500/50 mr-3 mt-1">✦</span>
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {step.grid && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {step.grid.map((item, i) => (
                          <div key={i} className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
                            <strong className="text-blue-300 block mb-2 font-medium">{item.name}</strong>
                            <span className="text-sm text-gray-500 leading-relaxed block">{item.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <section className="relative z-10 px-6 py-32 text-center max-w-4xl mx-auto border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
            Experience the Precision
          </h3>
          <p className="text-lg md:text-xl text-gray-400 mb-10 font-light">
            Through rigorous, uncompromised edge-computation, receive a clinically accurate, mathematically backed, and deeply personalized astrological analysis that simply cannot be replicated by any standard platform.
          </p>
          <Link 
            href="/dashboard"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white via-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Access the Oracle</span>
            <span className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
