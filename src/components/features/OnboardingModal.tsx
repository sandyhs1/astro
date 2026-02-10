"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowRight, FaCheck } from "react-icons/fa";
import { useOnboarding } from "@/context/OnboardingContext";
import emailjs from '@emailjs/browser';

export default function OnboardingModal() {
    const { isOpen, closeModal } = useOnboarding();
    const [step, setStep] = useState(1);
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        dob: "",
        tob: "",
        pob: "",
        questions: ""
    });

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Trigger payment modal
            setShowPayment(true);
        }
    };

    const handleMockPayment = async () => {
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(async () => {
            const transactionId = `TXN${Date.now()}`;
            const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

            // Prepare EmailJS template parameters
            const emailParams = {
                fullName: formData.fullName,
                email: formData.email,
                dob: formData.dob,
                tob: formData.tob,
                pob: formData.pob,
                questions: formData.questions,
                paymentStatus: "Mock Payment Success",
                transactionId: transactionId,
                submissionTime: submissionTime
            };

            try {
                // Send email using EmailJS
                await emailjs.send(
                    'service_kejjsw8',        // Service ID
                    'template_dq668f3',       // Template ID (CORRECTED)
                    emailParams,
                    'p0Y1TsA4CgkB89zWO'       // Public Key
                );

                console.log("✅ Email sent successfully to sandesh@soulsync.tech");
                console.log("Form Data:", emailParams);

                setIsProcessing(false);
                setShowPayment(false);
                setShowSuccess(true);

                // Auto-close after success message
                setTimeout(() => {
                    handleClose();
                }, 5000);
            } catch (error) {
                console.error("❌ EmailJS Error:", error);
                alert("Failed to send email. Please check console for details.");
                setIsProcessing(false);
            }
        }, 2000);
    };

    const handleClose = () => {
        closeModal();
        setStep(1);
        setShowPayment(false);
        setShowSuccess(false);
        setFormData({
            fullName: "",
            email: "",
            dob: "",
            tob: "",
            pob: "",
            questions: ""
        });
    };

    if (!isOpen) return null;

    // Success Screen
    if (showSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-lg bg-gradient-to-b from-[#0a0a0a] to-[#12011A] border border-[#FFD700] rounded-2xl p-8 md:p-12 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 mx-auto mb-6 bg-[#FFD700] rounded-full flex items-center justify-center"
                    >
                        <FaCheck className="text-black text-3xl" />
                    </motion.div>

                    <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Transmission Received.</h2>
                    <p className="font-mono text-sm text-gray-400 mb-6 leading-relaxed">
                        The algorithm has begun its surveillance. <br />
                        Expect your dossier within <span className="text-[#FFD700]">4-6 hours</span> during business hours, <br />
                        or by the next day.
                    </p>
                    <div className="border-t border-white/10 pt-6">
                        <p className="font-mono text-xs text-gray-600">
                            Confirmation sent to <span className="text-white">{formData.email}</span>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    // Mock Payment Modal
    if (showPayment) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl"
                >
                    {/* Razorpay-style Header */}
                    <div className="bg-[#528FF0] p-6 text-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl">SoulSync</h3>
                            <button onClick={() => setShowPayment(false)} className="opacity-70 hover:opacity-100">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="text-3xl font-bold">₹4,999</div>
                        <div className="text-sm opacity-90">Complete Destiny Report</div>
                    </div>

                    {/* Payment Body */}
                    <div className="p-6">
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Card Number</label>
                            <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 focus:border-[#528FF0] focus:outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Expiry</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 focus:border-[#528FF0] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">CVV</label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 focus:border-[#528FF0] focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleMockPayment}
                            disabled={isProcessing}
                            className="w-full bg-[#528FF0] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#3d7cd6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Verifying Funds...
                                </span>
                            ) : (
                                "Pay ₹4,999"
                            )}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            🔒 Secured by Razorpay (Mock Mode)
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="w-full max-w-2xl bg-[#0a0a0a] border border-[#FFD700]/20 rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(255,215,0,0.1)] max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/10 bg-white/5 sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="font-mono text-[#FFD700] text-xs md:text-sm tracking-widest uppercase">
                                    System Access: Level {step}/3
                                </span>
                            </div>
                            <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-12">

                            {/* Step 1: Identity */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="font-serif text-2xl md:text-3xl text-white">Identify Yourself.</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block font-mono text-xs text-gray-500 mb-2 uppercase">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-white font-serif focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base"
                                                placeholder="Enter your legal name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-mono text-xs text-gray-500 mb-2 uppercase">Email Coordinates</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-white font-serif focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base"
                                                placeholder="Where do we send the dossier?"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Coordinates */}
                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="font-serif text-2xl md:text-3xl text-white">Temporal Coordinates.</h2>
                                    <p className="font-mono text-xs text-gray-400">Precision is mandatory. 4 minutes = different destiny.</p>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block font-mono text-xs text-gray-500 mb-2 uppercase">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    value={formData.dob}
                                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-white font-mono focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-mono text-xs text-gray-500 mb-2 uppercase">Time of Birth</label>
                                                <input
                                                    type="time"
                                                    value={formData.tob}
                                                    onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-white font-mono focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block font-mono text-xs text-gray-500 mb-2 uppercase">Place of Birth</label>
                                            <input
                                                type="text"
                                                value={formData.pob}
                                                onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-white font-serif focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base"
                                                placeholder="City, Country"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Interrogation */}
                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="font-serif text-2xl md:text-3xl text-white">The Interrogation.</h2>
                                    <p className="font-mono text-xs text-gray-400">What specific failures are you trying to fix?</p>
                                    <div>
                                        <textarea
                                            value={formData.questions}
                                            onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                                            className="w-full h-40 md:h-48 bg-white/5 border border-white/10 p-3 md:p-4 text-white font-serif focus:border-[#FFD700] focus:outline-none transition-colors resize-none text-sm md:text-base"
                                            placeholder="Ex: Why do I sabotage every relationship? When will my business scale?"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Footer Control */}
                            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                                {step > 1 ? (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="text-gray-500 hover:text-white font-mono text-xs uppercase tracking-widest"
                                    >
                                        Back
                                    </button>
                                ) : <div></div>}

                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 bg-[#FFD700] text-black px-6 md:px-8 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors text-xs md:text-sm"
                                >
                                    {step === 3 ? "Initialize Payment" : "Next Phase"} <FaArrowRight />
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
