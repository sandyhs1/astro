"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowRight, FaCheck, FaLock, FaShieldAlt } from "react-icons/fa";
import { useOnboarding } from "@/context/OnboardingContext";
import { useRouter } from "next/navigation";
import emailjs from '@emailjs/browser';

export default function OnboardingModal() {
    const { isOpen, closeModal } = useOnboarding();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        dob: "",
        tob: "",
        tobAmPm: "AM",
        pob: "",
        questions: ""
    });
    const [error, setError] = useState<string | null>(null);

    // Clear error when changing steps
    useEffect(() => {
        setError(null);
    }, [step]);

    // Handle countdown and auto-redirect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showSuccess) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleCloseSuccess();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showSuccess]);

    const validateStep = (currentStep: number) => {
        setError(null);
        if (currentStep === 1) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.fullName.trim() || !emailRegex.test(formData.email.trim())) {
                setError("PROTOCOL INTERRUPTED: Identity verification failed. Please enter a valid Name and Email format (e.g. user@domain.com).");
                return false;
            }
        }
        if (currentStep === 2) {
            if (!formData.dob || !formData.tob || !formData.pob.trim()) {
                setError("PROTOCOL INTERRUPTED: Temporal coordinates missing. Date, Time, and Place of Birth are mandatory.");
                return false;
            }
        }
        if (currentStep === 3) {
            if (!formData.questions.trim() || formData.questions.length < 10) {
                setError("PROTOCOL INTERRUPTED: Insufficient data. Please ask at least 5 questions or provide more detail.");
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (!validateStep(step)) return;

        if (step < 3) {
            setStep(step + 1);
        } else {
            // Trigger payment modal
            setShowPayment(true);
        }
    };

    // Handle automated success from Dodo redirect
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const status = searchParams.get('status');

        if (status === 'success') {
            const savedData = localStorage.getItem('onboardingFormData');
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    setFormData(parsedData);
                    setShowSuccess(true);

                    // Trigger email notification automatically
                    const transactionId = `DODO_${Date.now()}`;
                    const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

                    const emailParams = {
                        fullName: parsedData.fullName,
                        email: parsedData.email,
                        dob: parsedData.dob,
                        tob: `${parsedData.tob} ${parsedData.tobAmPm}`,
                        pob: parsedData.pob,
                        questions: parsedData.questions,
                        paymentStatus: "Success (Automated Dodo)",
                        transactionId: transactionId,
                        submissionTime: submissionTime
                    };

                    emailjs.send(
                        'service_kejjsw8',
                        'template_dq668f3',
                        emailParams,
                        'p0Y1TsA4CgkB89zWO'
                    ).then(() => {
                        console.log("✅ Automated Success Email sent");
                        // Clean up
                        localStorage.removeItem('onboardingFormData');
                        window.history.replaceState({}, document.title, "/");
                    }).catch(error => {
                        console.error("❌ Email error:", error);
                    });
                } catch (e) {
                    console.error("Failed to parse saved onboarding data", e);
                }
            }
        }
    }, [showSuccess]);

    const handleDodoPayment = async (currency: 'INR' | 'USD') => {
        setIsProcessing(true);

        const productId = currency === 'USD'
            ? process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_USD
            : process.env.NEXT_PUBLIC_DODO_PRODUCT_ID_INR;

        // Persist form data before redirecting
        localStorage.setItem('onboardingFormData', JSON.stringify(formData));

        try {
            const response = await fetch('/api/create-dodo-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    customerEmail: formData.email,
                    customerName: formData.fullName,
                    currency
                }),
            });

            const data = await response.json();
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                throw new Error(data.error || "Failed to get checkout URL");
            }
        } catch (error) {
            console.error("Dodo Payment Error:", error);
            alert("Payment initialization failed. Please try again.");
            setIsProcessing(false);
        }
    };

    const handleVerification = async () => {
        setIsProcessing(true);

        const transactionId = `MANUAL_${Date.now()}`;
        const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const emailParams = {
            fullName: formData.fullName,
            email: formData.email,
            dob: formData.dob,
            tob: `${formData.tob} ${formData.tobAmPm}`,
            pob: formData.pob,
            questions: formData.questions,
            paymentStatus: "User Reported Success (Manual Verify)",
            transactionId: transactionId,
            submissionTime: submissionTime
        };

        try {
            await emailjs.send(
                'service_kejjsw8',
                'template_dq668f3',
                emailParams,
                'p0Y1TsA4CgkB89zWO'
            );
            console.log("✅ Email sent successfully");
        } catch (error) {
            console.error("❌ EmailJS Error:", error);
        }

        setIsProcessing(false);
        setShowPayment(false);
        setShowSuccess(true);
        setCountdown(60);
    }

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
            tobAmPm: "AM",
            pob: "",
            questions: ""
        });
    };

    const handleCloseSuccess = () => {
        handleClose();
        router.push('/myths');
    };

    if (!isOpen && !showSuccess) return null;

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
                    className="w-full max-w-lg bg-gradient-to-b from-[#0a0a0a] to-[#12011A] border border-[#FFD700] rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
                >
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1 bg-[#FFD700]" style={{ width: `${(countdown / 60) * 100}%`, transition: "width 1s linear" }}></div>

                    <button
                        onClick={handleCloseSuccess}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                    >
                        <FaTimes />
                    </button>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 mx-auto mb-6 bg-[#FFD700] rounded-full flex items-center justify-center shadow-[0_0_30px_#FFD700]"
                    >
                        <FaCheck className="text-black text-3xl" />
                    </motion.div>

                    <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                        We got you, <span className="text-[#FFD700]">{formData.fullName.split(' ')[0]}</span>.
                    </h2>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                        <p className="font-mono text-sm text-gray-300 leading-relaxed italic mb-4">
                            "The universe has been waiting for you to stop playing small. Your chart is a battlefield, and we will hand you the map shortly. Don't waste it."
                        </p>
                        <p className="font-mono text-xs text-[#FFD700] leading-relaxed border-t border-white/10 pt-4">
                            Your custom high voltage report will be shared with you in the next 4 - 6 hours (within regular business hours).
                        </p>
                    </div>

                    <p className="font-mono text-xs text-gray-500 mb-6 leading-relaxed">
                        Redirecting to the TRUTH in <span className="text-[#FFD700] font-bold">{countdown}s</span>...
                    </p>

                    <button
                        onClick={handleCloseSuccess}
                        className="w-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-widest py-3 rounded-lg border border-white/10 transition-colors"
                    >
                        Thank You
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    // Payment Confirmation Modal with Trust Badges
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
                    className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl relative"
                >
                    {/* Trust Header Badge */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 flex items-center gap-1.5">
                        <FaShieldAlt className="text-white text-xs" />
                        <span className="text-[10px] font-bold text-white tracking-wider uppercase">Official Partner</span>
                    </div>

                    {/* Dodo-style Header */}
                    <div className="bg-[#000000] p-6 text-white text-center pb-8 sticky top-0">
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={() => setShowPayment(false)} className="opacity-70 hover:opacity-100 absolute left-4 top-4">
                                <FaTimes />
                            </button>
                            <h3 className="font-bold text-xl w-full text-center">SoulSync Official</h3>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-sm opacity-80 mb-1 font-medium tracking-wide">SECURE CHECKOUT</span>
                            <div className="text-3xl font-extrabold tracking-tight">Complete Your Report</div>
                            <div className="text-xs opacity-75 mt-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                                Powered by Dodo Payments
                            </div>
                        </div>
                    </div>

                    {/* Payment Body */}
                    <div className="p-6 -mt-4 bg-white rounded-t-2xl relative z-10 w-full space-y-4">

                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-2 flex items-start gap-3">
                            <div className="bg-gray-100 p-2 rounded-full mt-0.5">
                                <FaLock className="text-gray-600 text-sm" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-800 mb-1">Global Payment Suite</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Choose your preferred currency. Secure payment processed globally via Dodo Payments.
                                </p>
                            </div>
                        </div>

                        {/* Payment Buttons */}
                        <div className="grid grid-cols-1 gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDodoPayment('INR')}
                                disabled={isProcessing}
                                className="w-full bg-[#111111] text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                <span>Pay in INR (₹3,799)</span>
                                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDodoPayment('USD')}
                                disabled={isProcessing}
                                className="w-full bg-white text-[#111111] border-2 border-[#111111] py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-md flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                <span>Pay in USD ($55.00)</span>
                                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mt-6">
                            <p className="text-xs text-center text-gray-500 mb-3 font-medium">After completing payment, verify below:</p>
                            <button
                                onClick={handleVerification}
                                disabled={isProcessing}
                                className="w-full bg-green-50 text-green-700 border border-green-200 py-3 rounded-lg font-bold text-sm hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? "Verifying Status..." : (
                                    <>
                                        <FaCheck /> <span>I Have Completed Payment</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-6 flex flex-col items-center gap-2">
                            <div className="flex items-center justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* Simple text badges for reliability if images aren't available */}
                                <span className="border border-gray-200 rounded px-2 py-1 text-[10px] font-bold text-gray-400">UPI</span>
                                <span className="border border-gray-200 rounded px-2 py-1 text-[10px] font-bold text-gray-400">VISA</span>
                                <span className="border border-gray-200 rounded px-2 py-1 text-[10px] font-bold text-gray-400">MasterCard</span>
                                <span className="border border-gray-200 rounded px-2 py-1 text-[10px] font-bold text-gray-400">RuPay</span>
                            </div>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-2">
                                <FaLock className="text-gray-300" /> 256-Bit SSL Encrypted Connection
                            </p>
                        </div>
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
                                                <div className="flex gap-2">
                                                    <input
                                                        type="time"
                                                        value={formData.tob}
                                                        onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                                                        className="w-2/3 bg-white/5 border border-white/10 p-3 md:p-4 text-white font-mono focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base"
                                                    />
                                                    <select
                                                        value={formData.tobAmPm}
                                                        onChange={(e) => setFormData({ ...formData, tobAmPm: e.target.value })}
                                                        className="w-1/3 bg-white/5 border border-white/10 p-3 md:p-4 text-white font-mono focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base"
                                                    >
                                                        <option value="AM">AM</option>
                                                        <option value="PM">PM</option>
                                                    </select>
                                                </div>
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

                            {/* Step 3: Cosmic Confessions */}
                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="font-serif text-2xl md:text-3xl text-white">Cosmic Confessions 💖</h2>
                                    <p className="font-mono text-xs text-gray-400">This is a safe space. The more context you give, the sharper your report.</p>
                                    <div>
                                        <textarea
                                            value={formData.questions}
                                            onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                                            className="w-full h-40 md:h-48 bg-white/5 border border-white/10 p-3 md:p-4 text-white font-serif focus:border-[#FFD700] focus:outline-none transition-colors resize-none text-sm md:text-base"
                                            placeholder="Ask us at least 5 questions about your life, love, career... We need the details to unlock your patterns! (e.g. Why do I attract unavailable partners? When will I get promoted? Is this year good for marriage?)"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3"
                                    >
                                        <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                                        <p className="font-mono text-xs text-red-400 leading-relaxed">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

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
