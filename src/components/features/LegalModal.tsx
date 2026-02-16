"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'terms' | 'privacy' | 'refunds' | null;
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const getContent = () => {
        switch (type) {
            case 'terms':
                return {
                    title: "Terms of Service",
                    content: `Terms of Service — Quantum Karma

Last updated: 15 February 2026

Welcome. Read this properly. Not because we enjoy legal pages — but because clarity prevents future drama.

By using this website or purchasing a report from Quantum Karma, you agree to everything written below. If something here feels uncomfortable, don’t use the service. No hard feelings.

This service is operated from Bangalore, India.

1. What We Actually Provide

Quantum Karma provides interpretive life-pattern reports based on traditional astrological frameworks combined with analytical processing and human review.

We do not provide:
• guaranteed predictions
• miracles
• fixes
• rituals
• remedies
• supernatural intervention
• problem-solving for real-world emergencies

You receive interpretation, not control over reality. If you treat the report as destiny, you are misusing the product.

2. Eligibility

You must be at least 18 years old to purchase. If you’re under 18, you may only use the service through a parent or legal guardian who accepts responsibility for the purchase and interpretation. We are not responsible for how minors interpret psychological content.

3. Accuracy of Your Input

Your report depends entirely on the data you submit. If you enter wrong date, time, or place of birth, you will receive a wrong report. This is not a defect. This is math. We do not refund reports generated from incorrect user input. Double-check before submitting.

4. Payments & Refunds

All payments are one-time purchases unless explicitly stated otherwise. Once work begins, effort is spent. So refunds are not automatic. However — we offer a fairness rule: If your report is clearly generic or unrelated to your provided details, contact us within 7 days at help@soulsync.tech and we will review it manually.

We do not refund because:
• you didn’t like what it said
• it didn’t match expectations
• life didn’t go your way
• you changed your mind

This is a thinking product, not entertainment content.

5. Delivery Timelines

Standard delivery: 48–72 hours. Delays may happen due to high order volume, verification issues, or technical interruptions. We prefer late and correct over fast and careless.

6. How You Should Use the Report

Use it as reflection material. Not as financial instruction, medical direction, legal decision tool, or relationship ultimatum justification. If you quit a job, marry someone, or confront a family member purely because of a report — that is your decision, not our instruction. We provide interpretation, not authority.

7. Intellectual Property

Every report we create is licensed to you for personal use only. You may read, store, and print it. You may NOT resell, publish publicly, train AI models on it, or redistribute commercially. We retain rights to format, methodology, prompts, and analytical structure.

8. Prohibited Use

Do not use Quantum Karma to harass others, psychologically label other people, stalk relationships, or justify harmful behavior. If we detect misuse, we may refuse service without refund.

9. Limitation of Liability

We are not responsible for decisions you make after reading, emotional reactions, life outcomes, financial losses, or relationship changes. You remain responsible for your actions before and after receiving the report. The maximum liability we ever carry is the amount you paid us.

10. Service Availability

We may modify, pause, or discontinue features at any time. We are not obligated to maintain identical output formats forever.

11. Privacy

We only collect the data needed to generate your report. We do not sell personal birth data to third parties. We may store anonymized pattern information to improve analysis quality.

12. Changes to Terms

These terms may evolve as the product evolves. Continued use after updates means acceptance.

13. Disputes

If something goes wrong, contact us first at: help@soulsync.tech. Most issues resolve faster through conversation than confrontation. If legal resolution becomes necessary, jurisdiction will remain Bangalore, India.

14. Legal Protection & Non-Disparagement (IMPORTANT)

By using this platform, purchasing our services, or consuming our content, you expressly agree to the following:
• No Litigation Guarantee: You waive any and all rights to initiate legal action, lawsuits, or formal complaints against Quantum Karma, SoulSync, its owners, employees, or affiliates regarding the accuracy, interpretation, or consequences of any astrological prediction or report provided. You acknowledge that these reports are for reference and reflection only.
• Non-Disparagement: You agree to refrain from making any negative, disparaging, or defamatory statements, allegations, or public comments (on social media, review platforms, or otherwise) that could damage the reputation or brand integrity of Quantum Karma or its associated brand SoulSync.
• Assumption of Risk: You accept full responsibility for all life decisions made following the receipt of any service. Our liability is strictly limited to the purchase price of the specific product in question.
• Indemnification: You agree to indemnify and hold harmless Quantum Karma from any claims, damages, or legal expenses arising from your misuse of the platform or your violation of these terms.

15. Final Clarity Clause

This service exists to provide perspective, not power over reality. You always retain agency. If you are looking for certainty, this product is not designed for that.

ASTROLOGY IS FOR REFERENCE PURPOSES ONLY. THIS SHOULD BE USED AS A GUIDEBOOK, A NAVIGATION GUIDE. PLEASE CONSULT MEDICAL, PROFESSIONAL EXPERTS INCASE OF URGENCY OR HEALTH RELATED ASPECTS. ASTROLOGY IS NOT A SUBSTITUTE FOR EXPERT MEDICAL/HEALTH EXPERTS.`
                };
            case 'privacy':
                return {
                    title: "Privacy Policy",
                    content: `Privacy Policy — Quantum Karma

Last updated: 15 Feb 2026

We don’t like creepy apps. So we built this to avoid becoming one.

This page explains what data we collect, why we collect it, what we do with it, and what we don’t do with it. If you’re uncomfortable sharing personal birth details, you should not use this service. The product cannot exist without that information.

1. What Information We Collect

Information you provide:
• Name (can be nickname)
• Date of birth
• Time of birth
• Place of birth
• Email address
• Your stated concern (career, relationship, direction etc.)

Automatically collected information: Standard website data like IP address, device type, and browser type to help prevent fraud and fix bugs.

Payment data: Payments are processed by third-party processors. We do not store your card or UPI credentials on our servers.

2. How We Use Your Data

We use your information strictly to generate your chart, structure your report, review it manually, and deliver it to you. We do not use your birth details to advertise to you across the internet. We do not sell your data to brokers.

3. About AI / LLM Usage (Important)

We use multiple language models (LLMs) as tools to help with structuring reports and formatting explanations. They do NOT replace human interpretation. Every report is interpreted and reviewed by a human before delivery.

4. Data Storage & Security

Your data is stored securely using access-restricted systems with encryption in transit. Only people directly involved in generating your report can access identifiable data.

5. How Long We Keep Data

We keep identifiable data only as long as needed to deliver your report, provide support, or handle disputes. After that, we may retain anonymized pattern data.

6. Third-Party Services

We rely on infrastructure providers for hosting, payment processing, and email delivery. They process limited data required to perform their role and do not own your birth data.

7. We Do Not Sell Personal Data

We do not sell, rent, trade, or monetize your birth details. Our revenue comes from reports — not from your identity.

8. Your Rights

You may request a copy, correction, or deletion of your personal data at help@soulsync.tech.

9. Children’s Privacy

This service is not designed for children under 18. We do not knowingly store children’s personal data independently of a parent or guardian.

10. Policy Updates

We may update this policy when the product evolves. Continued use after update means acceptance.

11. Final Clarity

We built Quantum Karma to give perspective — not surveillance. Your personal information exists here only to generate your report and support you afterwards.`
                };
            case 'refunds':
                return {
                    title: "Refund Policy",
                    content: `Refund Policy — Quantum Karma

Last updated: 15 February 2026

We’ll be honest with you first: This is not a downloadable movie. Not a subscription you forgot to cancel. Not a physical item you can return in a box.

Every report we create is made specifically for one person — you. Once we begin work, time, analysis, and review are already invested. Because of that, refunds are generally not offered.

Why Refunds Are Not Encouraged

The moment we start preparing your personalized report, the work cannot be “un-done”. So our default position is: No refunds after purchase. This is a personalized service, not a mass-produced product.

Rare Exceptions

We may consider a refund only if:
• the report is clearly unrelated to the details you provided
• the report was not delivered at all
• a verified technical failure prevented completion

In those cases, email us within 7 days at: help@soulsync.tech.

What Is NOT a Valid Refund Reason

We cannot refund because:
• you expected different answers
• you disagree with interpretation
• the content felt uncomfortable
• your situation didn’t change
• you changed your mind after purchase
• life continued to be life

This product offers perspective, not guaranteed outcomes.

Our Real Promise

Instead of easy refunds, we offer something better: We respond. If something feels off, write to us. We’ll clarify, explain, and help you understand what the report meant.

Before You Purchase

Please only buy if you actually want reflection, understand this is interpretive, and are comfortable with honest insights. We want thoughtful users, not impulse buyers.

Final Note

We don’t build our business on refund friction. We build it on transparency before payment. Clarity first. Always.`
                };
            default:
                return { title: "", content: "" };
        }
    };

    const { title, content } = getContent();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-3xl max-h-[85vh] bg-[#1A0B21] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#1A0B21]">
                            <h2 className="font-serif text-2xl text-white tracking-wide">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                            <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap space-y-4">
                                {content}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-black/20 text-center">
                            <button
                                onClick={onClose}
                                className="font-mono text-xs text-[#FFD700] uppercase tracking-widest hover:opacity-80 transition-opacity"
                            >
                                [ I Understand & Accept ]
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
