"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";

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
        a: "'Pseudoscience' is a label mediocre minds use to dismiss what they can't measure. Our analysis is based on 5,000 year old Vedic texts (Brihat Parashara Hora Shastra, Jaimini Sutras, Phaladeepika, Brihat Jataka etc.,) that mapped the solar system before Europe learned to wash its hands."
    },
    {
        q: "How do you predict this stuff? Magic?",
        a: "We don't predict. We calculate. We run & analyse your birth data through rigid, ancient sacred texts and scriptures (Vimshottari Dasha, Ashtottari & Yogini Dashas, KP, Jaimini Chara Dasha, Shadbala & Bhava Bala etc.,) It’s not magic; it’s celestial ballistics."
    },
    {
        q: "Is this just AI hallucinating answers?",
        a: "Hell no. AI is just the delivery boy. The logic is pure, hard coded Vedic math. The \"roast\" is AI; the data is undisputed astronomical fact."
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
        a: "We are not therapists. We are strategists. Knowing why you feel heavy (e.g., Sade Sati) stops you from thinking you're broken. It’s just a season. Survive it."
    },
    {
        q: "Can I use this for stock trading?",
        a: "We calculate your personal luck cycles. If you use that to buy meme coins, that's on you. But yes, timing is everything."
    },
    {
        q: "Why 'SoulSync'?",
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

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Split top 10 into two columns
    const col1 = topFAQs.slice(0, 5);
    const col2 = topFAQs.slice(5, 10);

    return (
        <section className="bg-[#12011A] py-24 px-6 relative overflow-hidden">
            {/* Background noise */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="max-w-7xl mx-auto z-10 relative">
                <div className="text-center mb-16">
                    <p className="font-mono text-[#FFD700] text-sm tracking-[0.3em] uppercase mb-4">The Interrogation Room</p>
                    <h2 className="font-serif text-4xl md:text-6xl text-white font-bold">
                        Questions You're <br /> <span className="text-[#FFD700]">Afraid To Ask</span>.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
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
                        className="px-10 py-4 border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all duration-300 font-mono text-xs uppercase tracking-widest backdrop-blur-sm"
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#12011A] w-full max-w-4xl h-[85vh] overflow-y-auto rounded-xl border border-[#FFD700]/20 p-8 md:p-12 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                            >
                                <FaTimes size={24} />
                            </button>

                            <h3 className="font-serif text-3xl md:text-4xl text-white mb-10 text-center">Archive: <span className="text-[#FFD700]">Declassified</span></h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-8">
                                    {allFAQs.slice(0, 13).map((item, i) => (
                                        <div key={i}>
                                            <h4 className="font-serif text-lg text-[#FFD700] mb-2">{item.q}</h4>
                                            <p className="font-mono text-sm text-gray-400 leading-relaxed">{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-8">
                                    {allFAQs.slice(13).map((item, i) => (
                                        <div key={i}>
                                            <h4 className="font-serif text-lg text-[#FFD700] mb-2">{item.q}</h4>
                                            <p className="font-mono text-sm text-gray-400 leading-relaxed">{item.a}</p>
                                        </div>
                                    ))}
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
        <div className="border border-white/10 bg-white/5 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#FFD700]/30">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-serif text-lg text-white pr-4">{item.q}</span>
                <span className="text-[#FFD700] shrink-0">
                    {isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />}
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
                        <div className="p-6 pt-0 font-mono text-sm text-gray-400 leading-relaxed border-t border-white/5 mx-6 mt-2 pb-6">
                            {item.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
