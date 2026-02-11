"use client";

import { motion } from "framer-motion";
import { useOnboarding } from "@/context/OnboardingContext";

export default function ExclusiveEntry() {
    const { openModal } = useOnboarding();

    return (
        <section className="min-h-[80vh] flex items-center justify-center bg-[#FFD700] text-[#12011A] p-6 relative">
            <div className="max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-serif text-5xl md:text-8xl font-bold mb-6 tracking-tighter">
                        WE ARE CLOSING THE GATES.
                    </h2>
                    <p className="font-mono text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
                        The early access cohort is 98% full. <br />
                        We do not need more users. We need the elite. <br />
                        Decide. Now.
                    </p>

                    <button
                        onClick={openModal}
                        className="px-12 py-5 bg-[#12011A] text-white text-lg font-bold uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-2xl"
                    >
                        CLAIM MY SPOT
                    </button>

                </motion.div>
            </div>
        </section>
    );
}
