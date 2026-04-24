"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TheVoid from "@/components/sections/TheVoid";
import FloatingLogo from "@/components/ui/FloatingLogo";

const mythsData = [
    {
        id: "01",
        myth: "TWINS HAVE THE SAME CHART, BUT DIFFERENT LIVES",
        lie: "If twins are born minutes apart, they should have identical lives according to astrology.",
        truth: "A deeply flawed assumption made by people who only know the basic D-1 (Rasi) chart. In advanced Vedic Astrometry, the D-60 (Shashtiamsa) chart shifts every 2 minutes. The D-108 changes even faster. Within a 3-minute gap, Arudha Padas shift, and Ashtakavarga points realign entirely. Twins do NOT have the same exact matrix; their karmic trajectories diverge drastically at a micro-level.",
        focus: ["D-60 Shashtiamsa", "Micro-Timings", "Divisional Chart Variances"],
    },
    {
        id: "02",
        myth: "PLANETS ARE TOO FAR TO 'PULL' ON US",
        lie: "The gravitational pull of Jupiter has less effect on a baby than the doctor in the delivery room.",
        truth: "Astrology is not about Newtonian gravity; it is the mapping of cosmic synchronicity and time geometry. Just as a clock reading 6:00 PM doesn't 'cause' the sun to set but perfectly maps the time it happens, planetary mathematics map the energetic cycles of human existence. We track the geometry of light and time to decode your life's specific rhythm.",
        focus: ["Cosmic Synchronicity", "Holographic Time", "Energetic Mapping"],
    },
    {
        id: "03",
        myth: "IT'S JUST COLD READING & PSYCHOLOGY",
        lie: "Astrologers just ask leading questions and read your body language to make guesses.",
        truth: "A master jyotishi doesn't need to hear your voice or see your face. Provide accurate birth data, and the math does the talking. Without asking a single question, exact calculations involving precise Dasha-Bhukti systems, Atmakaraka (AK), and Upapada Lagna will pinpoint specific historical years of financial ruin, marital breakdown, or sudden career ascension.",
        focus: ["Blind Chart Reading", "Precise Dasha-Bhukti", "Mathematical Objectivity"],
    },
    {
        id: "04",
        myth: "IF IT'S PREDICTED, EFFORT IS USELESS",
        lie: "If astrology says you will be poor or have a bad marriage, there is no point in working hard to avoid it.",
        truth: "Your chart maps probabilities and energetic weather, not absolute mandates. If a period shows intense career friction via Saturn transit over your natal Sun, it means the resistance is high—not that success is impossible. Freewill is the ultimate wildcard. You choose to navigate the friction strategically instead of being crushed by it.",
        focus: ["Probability Matrix", "Transits (Gochar)", "Karmic Resistance"],
    },
    {
        id: "05",
        myth: "REMEDIES ARE SUPERSTITIOUS NONSENSE",
        lie: "Wearing stones or chanting sounds cannot change your supposedly fixed destiny. It's just magic.",
        truth: "Remedies are precise frequency modulations. Specific gemstones filter distinct wavelengths of cosmic light into your aura, while specific mantras are acoustic formulas designed to alter your neuro-plasticity and energetic state. We do not use them to 'bribe planets', but to actively upgrade your electromagnetic field to handle incoming planetary transits.",
        focus: ["Frequency Modulation", "Acoustic Formulas", "Light Wavelengths"],
    },
    {
        id: "06",
        myth: "ALL ASTROLOGERS GIVE VAGUE HOROSCOPES",
        lie: "Astrology just uses Barnum statements like 'You are independent but have self-doubt.'",
        truth: "That is pop-astrology garbage meant to entertain. True Parashari and Jaimini systems are terrifyingly specific. We look at exact Planetary Degrees, A7 (Arudha representing business partners), and exact longitudinal conjunctions. We say: 'In November 2028, a business partner (A7) will cause a legal dispute involving foreign entities due to a calculated Rahu affliction in the 12th house.'",
        focus: ["Specific Event Timing", "A7 Arudha", "Longitudinal Afflictions"],
    }
];

export default function Myths() {
    const [activeMyth, setActiveMyth] = useState(0);

    return (
        <main className="min-h-screen bg-[#09000a] text-white selection:bg-[#FFD700] selection:text-[#09000a] overflow-hidden font-sans">
            <FloatingLogo position="left" />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-block border border-red-900/40 bg-red-950/20 px-4 py-1.5 rounded-full text-red-500 font-mono text-xs uppercase tracking-widest mb-8 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                >
                    Exposing The Diluted Mainstream
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500"
                >
                    THE IGNORANCE <br />
                    <span className="text-red-600 bg-none bg-clip-border drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]">OF THE MASSES.</span>
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl font-mono leading-relaxed"
                >
                    The modern world mocks astrology because they have only seen the corrupted, generic newspaper horoscopes. <br className="hidden md:block"/>
                    They do not know the actual ancient science. It is time to systematically dismantle the lies and reveal the exact, uncompromising mathematics behind the cosmos.
                </motion.p>
            </section>

            {/* The Ultimate Disclaimer: Freewill & The Weather Report */}
            <section className="relative py-24 border-y border-[#222] bg-[#0c000e] overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6"
                        >
                            THE SOVEREIGNTY OF <span className="text-red-500">FREEWILL</span>
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#050006] p-8 md:p-12 border border-[#333] shadow-2xl relative h-full flex flex-col justify-center"
                        >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                            <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-white">The Matrix Predicts.<br/>You Decide.</h3>
                            <p className="font-mono text-gray-400 text-base md:text-lg leading-relaxed mb-6">
                                The greatest fallacy surrounding astrology is the belief in absolute determinism. <strong className="text-white font-semibold">Freewill defies destiny and holds significant power.</strong> Your birth chart shows the exact topography of your life—the mountains, the rivers, the cliffs. But it does NOT dictate how you climb the mountain or swim the river.
                            </p>
                            <p className="font-mono text-gray-400 text-base md:text-lg leading-relaxed">
                                <strong className="text-white">An honest Jyotishi</strong> predicts your <em>circumstances</em>, but you make the final choice. If the mathematical parameters show intense legal friction, your freewill decides if you instigate a fiery lawsuit or gracefully settle outside of court. Freewill is the variable we cannot calculate.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8 flex flex-col justify-center"
                        >
                            <div>
                                <h4 className="font-mono text-[#FFD700] text-sm font-bold uppercase tracking-widest mb-4 border-b border-[#FFD700]/30 pb-2 inline-block">The Weather Report Analogy</h4>
                                <p className="font-serif text-2xl md:text-3xl text-gray-200 italic mb-6 leading-snug">
                                    "We don't predict that you will drown. We predict the Category 5 hurricane is arriving at 4:32 PM. Freewill is deciding to build the shelter."
                                </p>
                                <p className="font-mono text-gray-400 text-base md:text-lg leading-relaxed">
                                    Vedic astrology functions identically to highly advanced cosmic meteorology. Using extreme precision planetary cycles (Vishottari Dasha), we can accurately state that a karmic "storm" will hit your 10th house (Career) forcing a reset. 
                                </p>
                                <p className="font-mono text-gray-400 text-base md:text-lg leading-relaxed mt-4">
                                    Armed with this exact timeframe, your freewill empowers you to liquidate assets early and pivot your business, rather than being caught unprepared. The storm is inevitable; your destruction is not.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* The Architect Section (Refined & Typography Driven) */}
            <section className="relative py-24 bg-gradient-to-b from-[#0c000e] to-[#050006]">
                <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
                            World Record Precision. <br/>
                            <span className="text-gray-500">The Exact Science.</span>
                        </h2>
                        <p className="font-mono text-gray-400 text-lg md:text-xl leading-relaxed mb-10">
                            We don&apos;t look at &quot;star signs.&quot; We decipher the complex architecture of your soul&apos;s journey. Using exact <strong className="text-white font-semibold">Atmakaraka (AK)</strong>, <strong className="text-white font-semibold">Darakaraka (DK)</strong>, and <strong className="text-white font-semibold inline-flex">Upapada Lagna</strong> calculations alongside precise planetary degrees, we extract the literal granular truths of your future.
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            {[
                                "16 Divisional Charts",
                                "Jaimini Sutras",
                                "Nadi Astrometry",
                                "Arudha Padas (A7)",
                                "Planetary Degrees",
                                "Ashtakavarga Matrix"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-[#111] border border-[#222] px-4 py-2 rounded-sm" >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                                    <span className="font-mono text-xs uppercase tracking-widest text-[#e0e0e0] font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Life's User Manual Section */}
            <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10 border-t border-[#1a1a1a] bg-[#0c000e]">
                <div className="text-center mb-20">
                    <span className="font-mono text-red-500 text-sm font-bold uppercase tracking-widest mb-4 inline-block shadow-[0_0_15px_rgba(220,38,38,0.3)] bg-red-950/20 px-4 py-1 border border-red-900/40 rounded-full">Real-World Execution</span>
                    <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        THINK OF THIS AS<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">LIFE&apos;S USER MANUAL</span>
                    </h2>
                    <p className="font-mono text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        Astrology is not a personality test. It is a strategic database for your reality. Here is how the math breaks down the core pillars of human existence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Love & Relationships */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-[#050006] border border-[#222] p-8 group hover:border-red-900/50 hover:bg-[#0a000a] transition-colors shadow-xl"
                    >
                        <h3 className="font-serif text-2xl font-bold text-white mb-5 border-b border-[#333] group-hover:border-red-900/50 pb-4 transition-colors">LOVE & RELATIONSHIPS</h3>
                        <div className="mb-6">
                            <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest font-bold">The Myth</span>
                            <p className="font-mono text-sm text-gray-400 mt-2 line-through decoration-red-900/50">You just need to find someone with a compatible sun sign and wait for your &quot;perfect soulmate.&quot;</p>
                        </div>
                        <div>
                            <span className="font-mono text-[10px] text-[#FFD700] uppercase tracking-widest font-bold">The Math</span>
                            <p className="font-mono text-sm text-gray-300 mt-2 leading-relaxed">
                                We track the Navamsa (D-9) chart and Upapada Lagna. We calculate the exact timeline when relationship karma activates and when friction peaks down to the month. We don&apos;t look for magical soulmates; we map the structural compatibility and exact timing of your partnerships.
                            </p>
                        </div>
                    </motion.div>

                    {/* Wealth & Money */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-[#050006] border border-[#222] p-8 group hover:border-[#FFD700]/30 hover:bg-[#0a000a] transition-colors shadow-xl"
                    >
                        <h3 className="font-serif text-2xl font-bold text-white mb-5 border-b border-[#333] group-hover:border-[#FFD700]/30 pb-4 transition-colors">WEALTH & MONEY</h3>
                        <div className="mb-6">
                            <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest font-bold">The Myth</span>
                            <p className="font-mono text-sm text-gray-400 mt-2 line-through decoration-red-900/50">Manifestation, positive thinking, and non-stop grinding will automatically make you absolutely rich.</p>
                        </div>
                        <div>
                            <span className="font-mono text-[10px] text-[#FFD700] uppercase tracking-widest font-bold">The Math</span>
                            <p className="font-mono text-sm text-gray-300 mt-2 leading-relaxed">
                                Wealth is evaluated via the Hora (D-2) chart and 11th house Ashtakavarga points. If your wealth Dasha is dormant, grinding simply burns you out. We pinpoint the exact activation windows. When the window opens, you execute mercilessly. Effort multiplies only when aligned with cosmic timing.
                            </p>
                        </div>
                    </motion.div>

                    {/* Career & Trajectory */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-[#050006] border border-[#222] p-8 group hover:border-[#ccc]/30 hover:bg-[#0a000a] transition-colors shadow-xl"
                    >
                        <h3 className="font-serif text-2xl font-bold text-white mb-5 border-b border-[#333] group-hover:border-[#ccc]/30 pb-4 transition-colors">CAREER DESTINY</h3>
                        <div className="mb-6">
                            <span className="font-mono text-[10px] text-red-500 uppercase tracking-widest font-bold">The Myth</span>
                            <p className="font-mono text-sm text-gray-400 mt-2 line-through decoration-red-900/50">Just &quot;follow your passion&quot; or climb the corporate ladder blindly and success will eventually follow.</p>
                        </div>
                        <div>
                            <span className="font-mono text-[10px] text-[#FFD700] uppercase tracking-widest font-bold">The Math</span>
                            <p className="font-mono text-sm text-gray-300 mt-2 leading-relaxed">
                                Passion unchecked by structural reality leads to failure. Your Dasamsa (D-10) chart dictates exactly where your authority, influence, and financial spikes align. We isolate the specific industries and environments where your blueprint faces zero resistance and yields maximum leverage.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Interactive Myths Section */}
            <section className="py-32 px-6 sm:px-12 max-w-7xl mx-auto relative z-10 border-t border-[#1a1a1a]">
                <div className="text-center mb-24">
                    <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
                        SHATTERING THE ILLUSIONS
                    </h2>
                    <p className="font-mono text-gray-500 max-w-2xl mx-auto uppercase tracking-widest text-sm md:text-base">
                        Select a myth to reveal the architectural reality underneath it.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    {/* Selectors */}
                    <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-32">
                        {mythsData.map((myth, index) => (
                            <button
                                key={myth.id}
                                onClick={() => setActiveMyth(index)}
                                className={`text-left p-6 md:p-8 transition-all duration-500 border relative overflow-hidden group ${activeMyth === index ? "border-red-500/50 bg-red-950/10 shadow-[0_0_30px_rgba(220,38,38,0.05)]" : "border-[#1a1a1a] bg-[#050006] hover:border-[#333] hover:bg-[#0a000a]"}`}
                            >
                                {activeMyth === index && (
                                    <motion.div layoutId="myth-highlight" className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                                )}
                                <div className="flex items-center gap-4 mb-3">
                                    <span className={`font-mono text-xs uppercase tracking-[0.2em] font-semibold ${activeMyth === index ? "text-red-500" : "text-gray-600"}`}>
                                        MYTH {myth.id}
                                    </span>
                                </div>
                                <h3 className={`font-serif text-xl md:text-2xl font-bold transition-colors ${activeMyth === index ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                                    &quot;{myth.myth}&quot;
                                </h3>
                            </button>
                        ))}
                    </div>

                    {/* Content Display */}
                    <div className="lg:col-span-7 mt-8 lg:mt-0 min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeMyth}
                                initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="p-8 md:p-12 border border-[#222] bg-[#050006] relative h-full flex flex-col justify-center"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none">
                                    <span className="font-serif text-[12rem] font-bold text-white leading-none">
                                        {mythsData[activeMyth].id}
                                    </span>
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="mb-12">
                                        <h4 className="font-mono text-red-500 text-xs font-bold uppercase tracking-widest mb-4 border-b border-red-900/30 pb-2 inline-block">The Lie</h4>
                                        <p className="font-serif text-2xl md:text-3xl text-gray-300 italic leading-snug">
                                            &quot;{mythsData[activeMyth].lie}&quot;
                                        </p>
                                    </div>
                                    
                                    <div className="mb-10">
                                        <h4 className="font-mono text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-4 border-b border-[#FFD700]/30 pb-2 inline-block">The Objective Truth</h4>
                                        <p className="font-mono text-gray-300 leading-relaxed text-sm md:text-base">
                                            {mythsData[activeMyth].truth}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {mythsData[activeMyth].focus.map((f, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-[#111] border border-[#333] text-gray-300 font-mono text-[10px] sm:text-xs uppercase tracking-widest rounded-sm hover:border-gray-500 transition-colors">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* The JP Morgan Quote Section */}
            <section className="py-32 px-6 sm:px-12 text-center border-t border-[#1a1a1a] bg-[#050006]">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    <div className="text-red-900/30 font-serif text-[180px] leading-none h-24 pointer-events-none select-none">&quot;</div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-10 leading-tight z-10"
                    >
                        Millionaires don&apos;t use astrology;<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-600">billionaires do.</span>
                    </motion.h2>
                    
                    <div className="w-24 h-px bg-red-800 mx-auto mb-8 shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                    
                    <p className="font-mono text-gray-300 text-sm md:text-base uppercase tracking-[0.2em] font-semibold mb-8">
                        — J.P. Morgan <span className="text-gray-600 text-xs tracking-normal normal-case italic ml-2 block sm:inline mt-2 sm:mt-0">(Allegedly)</span>
                    </p>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="font-mono text-gray-500 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed italic border border-[#111] bg-[#0a000a] p-6 rounded-sm shadow-xl"
                    >
                        Look, we value absolute transparency. The internet heavily attributes this quote to him. Did he actually say it out loud? We can&apos;t confirm 100%. Did he employ astrologer Evangeline Adams to exactingly time the financial markets? Absolutely, yes. It&apos;s a legendary quote, but the sheer financial leverage of understanding absolute cosmic timing is incredibly real.
                    </motion.div>
                </div>
            </section>

            {/* Powerful Closing */}
            <section className="py-24 px-6 text-center border-t border-[#222] bg-gradient-to-b from-[#09000a] to-[#040005]">
                <div className="max-w-4xl mx-auto">
                    <p className="font-serif text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                        We reveal the matrix.<br/>
                        <span className="text-gray-500 italic font-medium pt-2 block">You command your destiny.</span>
                    </p>
                    <p className="font-mono text-gray-400 text-sm md:text-lg uppercase tracking-[0.2em] md:tracking-[0.3em] font-semibold">
                        Absolute Mathematical Certainty.
                    </p>
                </div>
            </section>

            <TheVoid />
        </main>
    );
}
