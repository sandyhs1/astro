"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TheVoid from "@/components/sections/TheVoid";
import { useOnboarding } from "@/context/OnboardingContext";

export default function Report() {
    const { openModal } = useOnboarding();

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#FFD700] selection:text-[#050505] font-sans overflow-x-hidden">

            {/* 1. HERO: THE WAKE UP CALL */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a0b2e] via-[#050505] to-[#000] opacity-60"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

                <div className="z-10 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-serif text-5xl md:text-9xl font-bold mb-8 tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600">
                            YOU ARE FLYING <br /> BLIND.
                        </h1>
                        <p className="font-mono text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Every day you make decisions without knowing the terrain. <br />
                            That is not bravery. That is <span className="text-red-500 font-bold border-b border-red-500">negligence</span>.
                        </p>
                        <button
                            onClick={openModal}
                            className="group relative px-12 py-5 bg-[#FFD700] text-[#050505] font-bold text-xl uppercase tracking-widest overflow-hidden transition-transform duration-300 hover:scale-105 shadow-[0_0_40px_rgba(255,215,0,0.3)]"
                        >
                            <span className="relative z-10">Turn On The Lights</span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* 2. THE COST OF IGNORANCE (THE INVISIBLE TAX) */}
            <section className="py-32 px-6 bg-black border-t border-[#222]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-6xl font-bold text-center mb-6 text-white">
                        THE INVISIBLE TAX OF <span className="text-red-600">CONFUSION</span>
                    </h2>
                    <p className="font-mono text-center text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
                        You pay for ignorance every single day. Not just with money, but with your life force. <br />
                        How much is your peace of mind actually worth?
                    </p>

                    <div className="bg-[#111] border border-[#333] p-8 md:p-12 relative overflow-hidden group hover:border-red-600 transition-colors duration-500">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-9xl font-serif text-red-600 select-none">
                            ?
                        </div>

                        <div className="space-y-8 relative z-10">
                            {/* Item 1 */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#222] pb-6 gap-4">
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-1">The 3 AM Anxiety</h3>
                                    <p className="font-mono text-sm text-gray-400">Waking up in panic. Staring at the ceiling. Wondering "Is this it?"</p>
                                </div>
                                <span className="font-mono text-red-500 font-bold whitespace-nowrap">- 1,000+ Hrs Sleep/Year</span>
                            </div>

                            {/* Item 2 */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#222] pb-6 gap-4">
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-1">The Stagnation Loop</h3>
                                    <p className="font-mono text-sm text-gray-400">2 years in the same role. Same income. Watching less talented people pass you.</p>
                                </div>
                                <span className="font-mono text-red-500 font-bold whitespace-nowrap">- 2 Years of Growth</span>
                            </div>

                            {/* Item 3 */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#222] pb-6 gap-4">
                                <div>
                                    <h3 className="font-bold text-white text-lg mb-1">The Emotional Drain</h3>
                                    <p className="font-mono text-sm text-gray-400">Dating the wrong people. Pouring energy into dead-end situations.</p>
                                </div>
                                <span className="font-mono text-red-500 font-bold whitespace-nowrap">- Your Self-Worth</span>
                            </div>

                            <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="text-center md:text-right w-full">
                                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">Total Accumulated Cost</p>
                                    <p className="font-serif text-3xl md:text-5xl text-gray-300 font-bold italic">Unquantifiable Suffering</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <p className="font-serif text-2xl text-white mb-6">
                            VS
                        </p>
                        <div
                            className="inline-block border border-[#FFD700] px-10 py-6 bg-[#FFD700]/5 hover:bg-[#FFD700]/10 transition-all cursor-pointer group"
                            onClick={openModal}
                        >
                            <p className="font-mono text-xs text-[#FFD700] uppercase tracking-widest mb-3 group-hover:tracking-[0.2em] transition-all">The Cost of Clarity (SoulSync)</p>
                            <p className="font-serif text-5xl font-bold text-[#FFD700]">₹3,799</p>
                        </div>
                        <p className="mt-8 font-mono text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
                            Cheaper than a weekend of "distracting yourself" with drinks and bad movies. <br />
                            <span className="text-white font-bold">Stop coping. Start solving.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. THE 3 PATHS (ARCHETYPES) */}
            <section className="py-32 px-6 bg-[#0a0a0a] border-t border-[#222]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-6xl text-center mb-24 text-white">
                        CHOOSE YOUR AVATAR
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* 1. The Drifter */}
                        <div className="group bg-[#050505] border border-[#222] p-8 hover:border-gray-500 transition-all duration-500 relative overflow-hidden opacity-60 hover:opacity-100">
                            <div className="absolute top-0 right-0 bg-[#222] text-white text-xs font-bold px-3 py-1">90% OF PEOPLE</div>
                            <h3 className="font-serif text-3xl text-gray-400 mb-4 group-hover:text-white transition-colors">THE DRIFTER</h3>
                            <p className="font-mono text-gray-500 text-sm leading-relaxed mb-6">
                                "I'll see what happens." <br />
                                Floats through life. Gets surprised by Saturn Returns. Blames "bad luck" for systemic failures. Ends up bitter and broke.
                            </p>
                            <div className="w-full h-1 bg-[#222] mt-auto">
                                <div className="h-full bg-gray-600 w-[10%]"></div>
                            </div>
                        </div>

                        {/* 2. The Hustler */}
                        <div className="group bg-[#050505] border border-[#222] p-8 hover:border-red-500 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-red-900 text-white text-xs font-bold px-3 py-1">9% OF PEOPLE</div>
                            <h3 className="font-serif text-3xl text-red-500 mb-4">THE HUSTLER</h3>
                            <p className="font-mono text-gray-400 text-sm leading-relaxed mb-6">
                                "I'll outwork everyone." <br />
                                Grinds 18 hours/day. Swims upstream against cosmic tides. Achieves success but burns out at 40 with a heart condition and no family.
                            </p>
                            <div className="w-full h-1 bg-[#222] mt-auto">
                                <div className="h-full bg-red-600 w-[50%]"></div>
                            </div>
                        </div>

                        {/* 3. The Alchemist */}
                        <div className="group bg-[#050505] border border-[#FFD700] p-8 shadow-[0_0_30px_rgba(255,215,0,0.1)] transform scale-105 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-xs font-bold px-3 py-1">1% (YOU?)</div>
                            <h3 className="font-serif text-3xl text-[#FFD700] mb-4">THE ALCHEMIST</h3>
                            <p className="font-mono text-white text-sm leading-relaxed mb-6">
                                "I align with the flow." <br />
                                Checks the cosmic weather. Acts when the window is open. Rests when the tide is out. Maximum impact, minimum friction.
                            </p>
                            <div className="w-full h-1 bg-[#222] mt-auto">
                                <div className="h-full bg-[#FFD700] w-[100%] shadow-[0_0_10px_#FFD700]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. MARKET EXPOSURE (THE PREDATORS) */}
            <section className="py-32 px-6 bg-black border-t border-[#222]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16 text-red-600">
                        THE "PREDATOR" BUSINESS MODEL
                    </h2>

                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="p-8 border-l-4 border-red-600 bg-red-950/10">
                            <h3 className="font-mono text-xl text-red-500 mb-6 font-bold uppercase tracking-widest">HOW THEY HUNT YOU</h3>
                            <ul className="space-y-8 relative">
                                {/* Step 1 */}
                                <li className="relative pl-8">
                                    <span className="absolute left-0 top-0 w-2 h-2 bg-red-600 rounded-full mt-2"></span>
                                    <h4 className="font-bold text-white text-lg">The ₹650 Bait</h4>
                                    <p className="text-gray-400 text-sm mt-2">
                                        They sell you a "Basic Report" for coffee money. It effectively says nothing but lists 10 terrifying "Doshas" (curses).
                                    </p>
                                </li>
                                {/* Step 2 */}
                                <li className="relative pl-8">
                                    <div className="absolute left-[3px] top-[-20px] w-[2px] h-8 bg-red-900/50"></div>
                                    <span className="absolute left-0 top-0 w-2 h-2 bg-red-600 rounded-full mt-2"></span>
                                    <h4 className="font-bold text-white text-lg">The Fear Injection</h4>
                                    <p className="text-gray-400 text-sm mt-2">
                                        "Your marriage is cursed." "Your career will collapse." "You have Pitra Dosh." <br />
                                        <span className="text-red-400 italic">They create the disease so they can sell the cure.</span>
                                    </p>
                                </li>
                                {/* Step 3 */}
                                <li className="relative pl-8">
                                    <div className="absolute left-[3px] top-[-20px] w-[2px] h-8 bg-red-900/50"></div>
                                    <span className="absolute left-0 top-0 w-2 h-2 bg-red-600 rounded-full mt-2"></span>
                                    <h4 className="font-bold text-white text-lg">The ₹50,000 Extraction</h4>
                                    <p className="text-gray-400 text-sm mt-2">
                                        The upset: "To fix this, buy this gemstone (₹25k) or book this Puja (₹15k)." <br />
                                        It is an endless loop of paid fear.
                                    </p>
                                </li>
                            </ul>
                        </div>

                        <div className="text-center md:text-left">
                            <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-gray-200">
                                WE ARE THE <span className="text-[#FFD700]">ANTI-FIRM.</span>
                            </h3>
                            <p className="font-mono text-gray-400 leading-relaxed mb-8 text-lg">
                                We don't profit from your panic. We profit from your clarity. <br /><br />
                                Imagine a doctor who keeps you sick just to sell you more pills. That is the current astrology market. <br /><br />
                                We are the surgeon who fixes the break, hands you the X-ray, and sends you out to win.
                            </p>
                            <div className="inline-block border border-[#FFD700] text-[#FFD700] px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest hover:bg-[#FFD700] hover:text-black transition-colors cursor-default">
                                Zero Upsells. Ever.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. IMPACT STACK (ANALOGIES) */}
            <section className="py-32 px-6 bg-[#0a0a0a] border-t border-[#222]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-6xl text-center mb-24 text-white">
                        INTELLIGENCE VS. SUPERSTITION
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Analogy 1: Weather */}
                        <div className="group bg-[#050505] border border-[#222] p-8 hover:border-blue-500 transition-all duration-500 hover:-translate-y-2">
                            <div className="text-blue-500 font-mono text-xs mb-4 uppercase tracking-widest border border-blue-900/50 inline-block px-2 py-1">The Weather Analogy</div>
                            <h3 className="font-serif text-2xl text-white mb-4">WE DON'T SELL UMBRELLAS.</h3>
                            <p className="font-mono text-gray-400 text-sm leading-relaxed mb-6">
                                Others sell you "protection" (gemstones) from the rain. <br />
                                We give you the Doppler Radar. <br />
                                If you know a hurricane is hitting your 10th House (Career) in November 2026, you don't need a ruby. You need to reinforce your roof.
                            </p>
                        </div>

                        {/* Analogy 2: Casino */}
                        <div className="group bg-[#050505] border border-[#222] p-8 hover:border-[#FFD700] transition-all duration-500 hover:-translate-y-2">
                            <div className="text-[#FFD700] font-mono text-xs mb-4 uppercase tracking-widest border border-yellow-900/50 inline-block px-2 py-1">The Casino Analogy</div>
                            <h3 className="font-serif text-2xl text-white mb-4">CARD COUNTING.</h3>
                            <p className="font-mono text-gray-400 text-sm leading-relaxed mb-6">
                                Life is a casino. The house (Karma) usually wins. <br />
                                Most people play slots (blind luck). <br />
                                Astrology is card counting. It doesn't guarantee every hand, but it shifts the statistical probability in your favor by 30%. That 30% is the difference between bankruptcy and a yacht.
                            </p>
                        </div>

                        {/* Analogy 3: Navigation */}
                        <div className="group bg-[#050505] border border-[#222] p-8 hover:border-green-500 transition-all duration-500 hover:-translate-y-2">
                            <div className="text-green-500 font-mono text-xs mb-4 uppercase tracking-widest border border-green-900/50 inline-block px-2 py-1">The GPS Analogy</div>
                            <h3 className="font-serif text-2xl text-white mb-4">OFF-ROAD MAPS.</h3>
                            <p className="font-mono text-gray-400 text-sm leading-relaxed mb-6">
                                Society gives you a highway map (College → Job → Marriage). <br />
                                Your soul might be driving a tank designed for off-roading. <br />
                                If you try to drive a tank on a highway at 80mph, you break. We show you the terrain you were actually built for.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. THE OFFER (ONE PRICE) */}
            <section className="py-32 px-6 bg-[#050505] border-t border-[#222]">
                <div className="max-w-4xl mx-auto">
                    <div className="border border-[#FFD700] p-1 bg-[#FFD700]/5">
                        <div className="bg-[#050505] p-8 md:p-16 text-center border border-[#FFD700]/20 relative overflow-hidden">

                            {/* Badge */}
                            <div className="absolute top-0 right-0 bg-[#FFD700] text-black font-bold text-xs px-6 py-2 uppercase tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                                Full Access Protocol
                            </div>

                            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-white">
                                THE SOULSYNC BLUEPRINT
                            </h2>
                            <div className="flex justify-center items-end gap-2 mb-4">
                                <span className="font-serif text-6xl md:text-8xl font-bold text-[#FFD700]">₹3,799</span>
                                <span className="font-mono text-gray-500 mb-4 pb-2 text-xl line-through decoration-red-500">₹15,000</span>
                            </div>
                            <p className="font-mono text-gray-400 mb-12 uppercase tracking-widest text-sm">One Payment. Lifetime Clarity.</p>

                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 text-left mb-16">
                                <FeatureItem text="Complete Birth Chart Decoding" />
                                <FeatureItem text="5-Year Career Trajectory" />
                                <FeatureItem text="Relationship Karma & Timing" />
                                <FeatureItem text="Wealth Activation Periods" />
                                <FeatureItem text="Psychological Shadow Work" />
                                <FeatureItem text="Customized Action Plan" />
                                <FeatureItem text="Private PDF Download" />
                                <FeatureItem text="Human-Verified Analysis" />
                            </div>

                            <div className="bg-[#111] p-6 rounded border border-[#333] mb-12">
                                <p className="font-mono text-xs text-gray-500 mb-4 uppercase tracking-widest">
                                    <span className="text-red-500 mr-2">⚠</span> WE WILL NEVER SELL YOU
                                </p>
                                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                                    <span className="line-through decoration-red-600 decoration-2">Gemstones</span>
                                    <span className="line-through decoration-red-600 decoration-2">Rituals</span>
                                    <span className="line-through decoration-red-600 decoration-2">Curses</span>
                                    <span className="line-through decoration-red-600 decoration-2">Subscription</span>
                                </div>
                            </div>

                            <button
                                onClick={openModal}
                                className="w-full md:w-auto px-16 py-6 bg-[#FFD700] text-black font-bold text-xl uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_50px_rgba(255,215,0,0.3)]"
                            >
                                Secure My Report
                            </button>
                            <p className="mt-6 font-mono text-xs text-gray-600">
                                Limited to 52 reports/day to maintain human verification standards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. TESTIMONIALS (REDDIT STYLE) */}
            <TestimonialsSection />

            <TheVoid />
        </main>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border border-green-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <span className="font-mono text-sm text-gray-300">{text}</span>
        </div>
    );
}

function TestimonialsSection() {
    const scrollRef1 = useRef<HTMLDivElement>(null);
    const scrollRef2 = useRef<HTMLDivElement>(null);

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (ref.current) {
            const scrollAmount = 400;
            ref.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Row 1: 8 testimonials (Moving RIGHT)
    const row1 = [
        {
            user: "u/burnout_szn",
            time: "3h",
            title: "sister is speechless",
            content: "Thanku thanku sooooooo so much... You are very much true about her...my sister hardly get impressed by someone...but literally got impressed with your knowledge... She still can't able to believe that someone can interpret about her this much true.. Hrudayapoorvaka Dhanyavaadagalu... Thanku once again"
        },
        {
            user: "u/chaotic_millennial",
            time: "1d",
            title: "pure clarity",
            content: "You are amazing! I've been analyzing myself for years, but you connected dots I didn't even know existed. The way you explained my career blockages was surgical. No fluff, just pure clarity. I finally feel like I'm in the driver's seat of my own life."
        },
        {
            user: "u/corporate_slave_no_more",
            time: "5h",
            title: "reading my soul source code",
            content: "This is so insightful! Thank you so much for such a deep and accurate analysis. It's truly beyond helpful. It felt like you were reading my soul's source code—exposing the glitches and showing me exactly how to patch them."
        },
        {
            user: "u/relationship_wreck",
            time: "12h",
            title: "honest and straightforward",
            content: "Thank you for taking the time to break this down so clearly. .. A lot of what you pointed out makes sense, I appreciate the straightforward perspective and the honesty around expectations during this period."
        },
        {
            user: "u/crypto_casualties",
            time: "2d",
            title: "flabbergasted",
            content: "I'm honestly flabbergasted. I don't think anyone has ever described me this accurately before, not even myself. I don't know who you are, but wow... you held up a mirror for me in a way I've never experienced. Every single point you mentioned felt absolutely spot on. Truly, every single one. I'm genuinely considering printing this out and framing it."
        },
        {
            user: "u/sleep_deprived_founder",
            time: "8h",
            title: "marriage clarity",
            content: "You got almost everything right. I am still giving this marriage everything and maybe in the end everything works out. Thank you for the advice."
        },
        {
            user: "u/recovering_people_pleaser",
            time: "6h",
            title: "wholesome read",
            content: "This is such a wholesome read! I'm surely going to try to be more assertive now. If not that then atleast authoritarian In my opinion I have the mindset and intentions but lack a little corporate confidence. Thank you for shedding light on it"
        },
        {
            user: "u/data_nerd_validated",
            time: "4h",
            title: "psycho-spiritual audit",
            content: "You are fabulous. The depth of this report is insane—it's not just astrology, it's a full psycho-spiritual audit. I walked in skeptical and walked out a believer. 10/10 would recommend to anyone feeling lost."
        },
    ];

    // Row 2: 8 testimonials (Moving LEFT)
    const row2 = [
        {
            user: "u/gen_z_chaos",
            time: "9h",
            title: "literally cried",
            content: "Fuck why this is so accurate 🥲 And the analysis you did is on point I literally cried for 10 minutes straight. Thank you bub! Means a lot!"
        },
        {
            user: "u/midwest_overthinker",
            time: "1d",
            title: "dragged me but i needed it",
            content: "okay i was skeptical bc most astrology is vague trash but this?? dragged me to hell and back in the best way. calling out my commitment issues with actual dates? rude but necessary. i feel seen."
        },
        {
            user: "u/toxic_ex_survivor",
            time: "7h",
            title: "scary accurate timeline",
            content: "bro the career timeline is actually scary accurate. said i'd pivot in 2024... i literally handed in my notice last week. how do you know this?? i'm shook. subscriber for life."
        },
        {
            user: "u/startup_graveyard",
            time: "11h",
            title: "no toxic positivity",
            content: "no toxic positivity here and i love it. just straight facts about why i keep failing at business. the 'invisible tax' concept hit hard. fixed my strategy based on the wealth window and seeing movement already."
        },
        {
            user: "u/chronic_job_hopper",
            time: "2d",
            title: "life-saving roast",
            content: "this isn't a horoscope, it's a roast session that saves your life. finding out my 'nice guy' act was actually a defense mechanism? oof. heavy realization but exactly what i needed to grow up."
        },
        {
            user: "u/overthinker_anonymous",
            time: "5h",
            title: "cheat code for life",
            content: "finally something that doesn't tell me to 'just manifest it'. gave me practical windows for action. i feel like i have a cheat code for the next 5 years. worth every rupee."
        },
        {
            user: "u/manifestation_skeptic",
            time: "3h",
            title: "therapist is gonna be shook",
            content: "my therapist is gonna act surprised when i show up with actual answers next week lol. this report did in 20 mins what we've been trying to figure out for months. wild."
        },
        {
            user: "u/family_business_heir",
            time: "10h",
            title: "strategic personality audit",
            content: "i usually cringe at 'soul' stuff but this was surprisingly grounded. logical, structured, and deep. feels like a strategic audit of my personality. 100% accurate."
        },
    ];

    return (
        <section className="py-32 bg-[#080808] overflow-hidden border-t border-[#222]">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-gray-200">THE HIVEMIND SPEAKS</h2>
                <p className="font-mono text-gray-500">Real feedback. Unfiltered.</p>
            </div>

            <div className="flex flex-col gap-8">
                {/* Row 1 - With Manual Controls */}
                <div className="relative">
                    <button
                        onClick={() => scroll(scrollRef1, 'left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#FFD700] text-black p-3 rounded-full hover:bg-white transition-colors shadow-lg"
                        aria-label="Previous"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div
                        ref={scrollRef1}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        <style jsx>{`
                            div::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {[...row1, ...row1, ...row1].map((testimonial, i) => (
                            <div key={`r1-${i}`} className="flex-shrink-0">
                                <RedditCard data={testimonial} />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll(scrollRef1, 'right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#FFD700] text-black p-3 rounded-full hover:bg-white transition-colors shadow-lg"
                        aria-label="Next"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Row 2 - With Manual Controls */}
                <div className="relative">
                    <button
                        onClick={() => scroll(scrollRef2, 'left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#FFD700] text-black p-3 rounded-full hover:bg-white transition-colors shadow-lg"
                        aria-label="Previous"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div
                        ref={scrollRef2}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-12"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        {[...row2, ...row2, ...row2].map((testimonial, i) => (
                            <div key={`r2-${i}`} className="flex-shrink-0">
                                <RedditCard data={testimonial} />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll(scrollRef2, 'right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#FFD700] text-black p-3 rounded-full hover:bg-white transition-colors shadow-lg"
                        aria-label="Next"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}

function RedditCard({ data }: { data: any }) {
    return (
        <div className="w-[400px] bg-[#1a1a1b] border border-[#343536] text-gray-300 p-5 rounded-md flex-shrink-0 hover:border-gray-500 transition-colors cursor-default select-none group">
            <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1 min-w-[30px] pt-1">
                    <span className="text-[#ff4500] font-bold text-lg group-hover:-translate-y-1 transition-transform">⬆</span>
                    <span className="text-sm font-bold text-white">{Math.floor(Math.random() * 500) + 50}</span>
                    <span className="text-gray-600 text-lg group-hover:translate-y-1 transition-transform">⬇</span>
                </div>
                <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span className="font-bold text-gray-400 hover:underline">{data.user}</span>
                        <span>•</span>
                        <span>{data.time}</span>
                    </div>
                    <h3 className="font-bold text-lg text-white mb-2 leading-tight group-hover:text-[#FFD700] transition-colors">{data.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed font-sans">{data.content}</p>
                    <div className="flex gap-4 mt-4 text-xs font-bold text-gray-500">
                        <span className="flex items-center gap-1 hover:bg-[#2d2d2e] px-2 py-1 rounded transition-colors">💬 {Math.floor(Math.random() * 50) + 5} Comments</span>
                        <span className="flex items-center gap-1 hover:bg-[#2d2d2e] px-2 py-1 rounded transition-colors">Share</span>
                        <span className="flex items-center gap-1 hover:bg-[#2d2d2e] px-2 py-1 rounded transition-colors">Report</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
