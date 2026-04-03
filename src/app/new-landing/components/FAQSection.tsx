'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, X as CloseIcon } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const topFAQs = [
    {
        q: "Is this another horoscope app?",
        a: "No. Horoscopes are for people who want to be flattered. This is predictive analytics for people who want to win. We don't sell hope and fears, we sell a surveillance report on your destiny."
    },
    {
        q: "Does astrology actually work, or is it a scam?",
        a: "Gravity works whether you believe in it or not. Saturn doesn't care about your opinion. You can ignore the data, but you'll still pay the tax. Ignorance is expensive; we just lower the cost."
    },
    {
        q: "I control my own life. Why do I need this?",
        a: "Cute. You control your reaction, not the event. You don't control the weather, but you check the forecast so you don't look like an idiot in the rain. This is your weather report for trauma and wealth."
    },
    {
        q: "Isn't astrology just pseudoscience?",
        a: "'Pseudoscience' is a label mediocre minds use to dismiss what they can't measure. Our analysis is based on 5,000 year old Vedic texts that mapped the solar system before Europe learned to wash its hands."
    },
    {
        q: "How do you predict this stuff? Magic?",
        a: "We don't predict. We calculate. We run & analyse your birth data through rigid, ancient sacred texts and scriptures. It’s not magic; it’s celestial ballistics."
    },
    {
        q: "Is this just AI hallucinating answers?",
        a: "Hell no. AI is just the delivery boy. The logic is pure, hard coded Vedic math. The delivery is AI; the data is undisputed astronomical fact."
    },
    {
        q: "Why do I need my exact birth time?",
        a: "Because a 2-4 minute difference changes your entire grid. If you guess, you get someone else's destiny. Go find your birth certificate. Precision is power."
    },
    {
        q: "Why is your tone so brutal? Can't you be nice?",
        a: "Your mom is nice, and look where that got you. 'Nice' keeps you comfortable. 'Brutal' wakes you up. We're here to break your loops, not validate your feelings."
    },
    {
        q: "Is this strictly for Hindus/Vedic followers?",
        a: "Does gravity only work for Newton? The code applies to everyone. The nomenclature is Sanskrit; the mechanics are universal."
    },
    {
        q: "Why do you talk like a villain?",
        a: "Heroes save you. Villains force you to save yourself. We are the antagonist to your laziness."
    }
];

const allFAQs = [
    ...topFAQs,
    {
        q: "Will this tell me when I'll get rich?",
        a: "It tells you when the window opens. If you're sitting on the couch eating Cheetos during your wealth era, you'll just get fat. We give you the timing; you bring the hustle."
    },
    {
        q: "Can this save my failing relationship?",
        a: "It can tell you if it should be saved. Sometimes the most 'spiritual' thing you can do is leave a dead-end toxicity loop. We'll show you the compatibility code; you pull the trigger."
    },
    {
        q: "Will this fix my depression?",
        a: "We are not therapists. We are strategists. Knowing why you feel heavy stops you from thinking you're broken. It’s just a season. Survive it."
    },
    {
        q: "Can I use this for stock trading?",
        a: "We calculate your personal luck cycles. If you use that to buy meme coins, that's on you. But yes, timing is everything."
    },
    {
        q: "Why accurate data?",
        a: "Because your ego is out of sync with your source code. Re-align or stay glitched."
    },
    {
        q: "What is 'The Void'?",
        a: "The backend of your subconscious. The place where you hide your potential. We drag it out into the light and make it pay rent."
    },
    {
        q: "Date of birth? Are you stealing my data?",
        a: "We need your coordinates to map the sky. We don't care about your identity; we care about your geometry. Your data is encrypted, unlike your emotional baggage."
    },
    {
        q: "What if I get a bad prediction?",
        a: "There are no bad predictions, only weak strategies. If a storm is coming, we hand you a helmet. Build a shelter or get buried."
    },
    {
        q: "Can I change my destiny?",
        a: "You can navigate it. You can't stop the waves, but you can learn to surf. Or you can drown. Your choice."
    },
    {
        q: "Can I get a refund on my Karma?",
        a: "No. You bought it in a past life. No receipt, no returns. Deal with it."
    },
    {
        q: "Why do I have to pay?",
        a: "Because paying signals commitment. Also, servers aren't free. If you want free advice, go ask a fortune cookie."
    },
    {
        q: "Is there a free trial?",
        a: "You can peek at the code, but the full download costs money. Value requires exchange."
    },
    {
        q: "What if I don't like my results?",
        a: "Reality doesn't require your approval. Change your habits, and you might change the outcome. But you can't change the weather."
    },
    {
        q: "Is this better than Western Astrology?",
        a: "Western is solar-based (personality). Vedic is lunar/stellar-based (predictive). We don't care how you feel; we care what will happen to you. It's engineering vs. psychology."
    },
    {
        q: "Can I share my account?",
        a: "Destiny is biometric. Would you share your fingerprint? One account, one soul. Don't dilute the data."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const col1 = topFAQs.slice(0, 5);
    const col2 = topFAQs.slice(5, 10);
    
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    return (
        <section id="faq" className="py-24 md:py-32 relative overflow-hidden" style={{ background: '#FAFAF7' }}>
            <div className="max-w-7xl mx-auto px-2 md:px-6 relative z-10">
                <AnimatedSection className="text-center mb-16 space-y-4">
                    <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-widest uppercase uppercase" style={{ background: 'hsl(245 60% 28% / 0.1)', color: 'hsl(245,60%,28%)' }}>
                        The Interrogation Room
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold px-1" style={{ color: 'hsl(240,20%,8%)', fontFamily: "'Space Grotesk',sans-serif" }}>
                        Questions you should <br /> 
                        <span style={{ background: 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>definitely ask.</span>
                    </h2>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        {col1.map((item, i) => (
                            <FAQItem
                                key={i}
                                item={item}
                                isOpen={openIndex === i}
                                onClick={() => toggleAccordion(i)}
                            />
                        ))}
                    </div>
                    {/* Column 2 */}
                    <div className="space-y-4">
                        {col2.map((item, i) => (
                            <FAQItem
                                key={i + 5}
                                item={item}
                                isOpen={openIndex === i + 5}
                                onClick={() => toggleAccordion(i + 5)}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: '1.25rem 2.5rem',
                            border: '1px solid hsl(240 20% 8% / 0.1)',
                            background: '#fff',
                            color: 'hsl(240,20%,8%)',
                            fontFamily: "'Space Grotesk',sans-serif",
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            borderRadius: '999px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'hsl(240,20%,8%)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'hsl(240,20%,8%)'; }}
                    >
                        Reveal all answers
                    </button>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                        style={{ background: 'rgba(0,0,0,0.6)' }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="w-full max-w-5xl h-[85vh] overflow-y-auto rounded-3xl relative"
                            style={{ background: '#FAFAF7', border: '1px solid hsl(40,15%,88%)', boxShadow: '0 25px 60px -10px rgba(0,0,0,0.4)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 right-0 p-6 flex justify-end" style={{ background: 'linear-gradient(to bottom, #FAFAF7 80%, transparent 100%)', zIndex: 10 }}>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ background: 'hsl(40 20% 92% / 0.8)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                    className="hover:scale-105 transition-transform"
                                >
                                    <CloseIcon size={20} color="hsl(240,20%,8%)" />
                                </button>
                            </div>

                            <div className="px-8 md:px-16 pb-16 pt-2">
                                <h3 className="text-3xl md:text-5xl font-bold mb-12 text-center" style={{ color: 'hsl(240,20%,8%)', fontFamily: "'Space Grotesk',sans-serif" }}>
                                    Archive: <span style={{ background: 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Declassified</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-10">
                                        {allFAQs.slice(0, 13).map((item, i) => (
                                            <div key={i}>
                                                <h4 className="text-xl font-bold mb-3" style={{ color: 'hsl(240,20%,8%)', fontFamily: "'Space Grotesk',sans-serif" }}>{item.q}</h4>
                                                <p className="text-base leading-relaxed" style={{ color: 'hsl(240,10%,46%)' }}>{item.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-10">
                                        {allFAQs.slice(13).map((item, i) => (
                                            <div key={i}>
                                                <h4 className="text-xl font-bold mb-3" style={{ color: 'hsl(240,20%,8%)', fontFamily: "'Space Grotesk',sans-serif" }}>{item.q}</h4>
                                                <p className="text-base leading-relaxed" style={{ color: 'hsl(240,10%,46%)' }}>{item.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

function FAQItem({ item, isOpen, onClick }: { item: any, isOpen: boolean, onClick: () => void }) {
    return (
        <AnimatedSection>
            <motion.div layout className="border rounded-xl overflow-hidden transition-all duration-300 bg-white" style={{ borderColor: isOpen ? 'hsl(30,80%,55%)' : 'hsl(40,15%,88%)', boxShadow: isOpen ? '0 10px 30px -10px rgba(0,0,0,0.1)' : 'none' }}>
                <button
                    onClick={onClick}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer border-none bg-transparent"
                >
                    <span className="text-lg font-bold pr-4 transition-colors" style={{ fontFamily: "'Space Grotesk',sans-serif", color: isOpen ? 'hsl(240,20%,8%)' : 'hsl(240,10%,46%)' }}>
                        {item.q}
                    </span>
                    <span className="shrink-0 transition-colors" style={{ color: isOpen ? 'hsl(30,80%,55%)' : 'hsl(240,10%,46%)' }}>
                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="p-6 pt-0 text-base leading-relaxed" style={{ color: 'hsl(240,10%,46%)' }}>
                                {item.a}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatedSection>
    );
}
