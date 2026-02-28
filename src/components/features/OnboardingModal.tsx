"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowRight, FaCheck, FaLock, FaShieldAlt } from "react-icons/fa";
import { useOnboarding } from "@/context/OnboardingContext";
import { useRouter } from "next/navigation";
import emailjs from '@emailjs/browser';

// 24 distinct identity insights — selected by a multi-factor hash of birth data
// so every user sees something different based on THEIR actual information.
const IDENTITY_INSIGHTS: string[] = [
    "You carry a quiet intensity that most people mistake for stillness.",
    "You've been the most capable person in the room for years — but rarely the loudest.",
    "You've outgrown some relationships but haven't fully let go yet.",
    "You think in systems. You just haven't found the right one for your own life.",
    "You've spent a long time being responsible for other people's feelings.",
    "You know exactly what you want. The hard part is believing you deserve it.",
    "You process things deeply but rarely show it on the surface.",
    "You're better at starting things than finishing them — but not because you're lazy.",
    "You have strong instincts. The problem is you've been trained to doubt them.",
    "You give more than you receive — and you've mostly made your peace with it.",
    "Something shifted for you recently. You haven't quite named it yet, but it's real.",
    "You're in a chapter that feels like in-between — not stuck, just becoming.",
    "You're not afraid of hard work. You're afraid of working hard on the wrong thing.",
    "You've been patient with people who haven't earned it.",
    "You tend to overthink decisions and underthink your own worth.",
    "You've built your identity around being reliable — even when it cost you.",
    "You're more resilient than you give yourself credit for.",
    "You've started over before. This time feels different — and it is.",
    "You help everyone else find clarity but struggle to find your own.",
    "You care deeply but have learned to care quietly.",
    "There's a version of your life you haven't let yourself want out loud yet.",
    "You've been at a crossroads longer than you'd like to admit.",
    "You're not indecisive. You just need the stakes to feel worth it.",
    "You feel things fully — you just choose carefully who gets to see that.",
];

/**
 * Derives a unique insight for this user using birth month, birth day,
 * the length of their name, and the first character of their birthplace.
 * Two users who type the same questions will almost certainly see
 * different insights because the selection is driven by their birth data.
 */
function generateIdentityInsight(dob: string, fullName: string, pob: string): string {
    const date = new Date(dob);
    const month = isNaN(date.getMonth()) ? 0 : date.getMonth();           // 0–11
    const day = isNaN(date.getDate()) ? 1 : date.getDate();               // 1–31
    const nameLen = fullName.trim().length % 6;                            // 0–5
    const pobCode = (pob.trim().charCodeAt(0) || 65) % 5;                 // 0–4
    const index = (month * 2 + (day % 2) + nameLen + pobCode) % IDENTITY_INSIGHTS.length;
    return IDENTITY_INSIGHTS[index];
}

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.35, ease: "easeOut" as const },
};

export default function OnboardingModal() {
    const { isOpen, closeModal } = useOnboarding();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [wowRevealed, setWowRevealed] = useState(false);
    const [isDecoding, setIsDecoding] = useState(false); // micro-pause between step 3 → 4
    const wowTimerRef = useRef<NodeJS.Timeout | null>(null);
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

    const firstName = formData.fullName.trim().split(" ")[0] || "you";
    const identityInsight = generateIdentityInsight(formData.dob, formData.fullName, formData.pob);

    // Clear error when changing steps
    useEffect(() => {
        setError(null);
    }, [step]);

    // WOW screen loading timer
    useEffect(() => {
        if (step === 5) {
            setWowRevealed(false);
            wowTimerRef.current = setTimeout(() => setWowRevealed(true), 3000);
        }
        return () => {
            if (wowTimerRef.current) clearTimeout(wowTimerRef.current);
        };
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
                setError("Please enter your full name and a valid email address (e.g. you@example.com).");
                return false;
            }
        }
        if (currentStep === 2) {
            if (!formData.dob || !formData.tob || !formData.pob.trim()) {
                setError("We need your date, time, and place of birth to continue.");
                return false;
            }
        }
        if (currentStep === 3) {
            if (!formData.questions.trim() || formData.questions.length < 10) {
                setError("Share a little more — even a few sentences help us personalise your report.");
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (step <= 3 && !validateStep(step)) return;

        // After Step 3: fire lead-capture email immediately, THEN show 2.5s "decoding" pause
        if (step === 3) {
            // ── STEP 3 LEAD CAPTURE EMAIL ──────────────────────────────────────────
            // Fires as soon as the user submits their questions — before payment.
            // This ensures we always have the lead even if they drop off at checkout.
            const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            emailjs.send(
                'service_kejjsw8',
                'template_dq668f3',
                {
                    fullName: formData.fullName,
                    email: formData.email,
                    dob: formData.dob,
                    tob: `${formData.tob} ${formData.tobAmPm}`,
                    pob: formData.pob,
                    questions: formData.questions,
                    paymentStatus: "⏳ Lead Captured — Payment Pending",
                    transactionId: `LEAD_${Date.now()}`,
                    submissionTime: submissionTime,
                },
                'p0Y1TsA4CgkB89zWO'
            ).then(() => {
                console.log("✅ Step 3 lead email sent");
            }).catch((err) => {
                console.error("❌ Step 3 lead email failed:", err);
            });
            // ──────────────────────────────────────────────────────────────────────

            setIsDecoding(true);
            setTimeout(() => {
                setIsDecoding(false);
                setStep(4);
            }, 2500);
            return;
        }

        if (step < 5) {
            setStep(step + 1);
        } else {
            // Step 5 CTA → trigger payment modal (existing logic)
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
        setWowRevealed(false);
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

    // ─── SUCCESS SCREEN ────────────────────────────────────────────────────────
    if (showSuccess) {
        const successFirstName = formData.fullName.trim().split(" ")[0] || "friend";
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

                    <motion.h2
                        {...fadeUp}
                        transition={{ delay: 0.3 }}
                        className="font-serif text-3xl md:text-4xl text-white mb-2"
                    >
                        Done ✔️
                    </motion.h2>

                    <motion.p
                        {...fadeUp}
                        transition={{ delay: 0.4 }}
                        className="font-serif text-lg text-[#FFD700] mb-6"
                    >
                        Your chart is now in analysis mode.
                    </motion.p>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 text-left space-y-3">
                        <p className="font-mono text-sm text-gray-300 leading-relaxed">
                            Hey <span className="text-[#FFD700]">{successFirstName}</span>, the humans are working on your report now 🐾
                        </p>
                        <p className="font-mono text-xs text-[#FFD700] border-t border-white/10 pt-3">
                            Expected delivery: within 24 hours.
                        </p>
                        <p className="font-mono text-xs text-gray-500 leading-relaxed">
                            You don't need to check anything — we'll email you when it's ready.
                        </p>
                    </div>

                    <p className="font-mono text-xs text-gray-500 mb-6 leading-relaxed">
                        Redirecting in <span className="text-[#FFD700] font-bold">{countdown}s</span>…
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

    // ─── PAYMENT MODAL ─────────────────────────────────────────────────────────
    if (showPayment) {
        const payFirstName = formData.fullName.trim().split(" ")[0] || "friend";
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

                    {/* Header */}
                    <div className="bg-[#000000] p-4 text-white sticky top-0">
                        <button onClick={() => setShowPayment(false)} className="opacity-70 hover:opacity-100">
                            <FaTimes />
                        </button>
                    </div>

                    {/* Payment Body */}
                    <div className="p-6 -mt-4 bg-white rounded-t-2xl relative z-10 w-full space-y-4">

                        {/* Trust bullets */}
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-2 space-y-2">
                            {[
                                "Human-reviewed analysis",
                                "No fear-based upsells",
                                "Delivered within 24 hours",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-xs text-gray-700">
                                    <FaCheck className="text-green-500 flex-shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

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

                        {/* Payment Buttons — DO NOT MODIFY */}
                        <div className="grid grid-cols-1 gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDodoPayment('INR')}
                                disabled={isProcessing}
                                className="w-full bg-[#111111] text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                <span>Pay in INR (₹4,799)</span>
                                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDodoPayment('USD')}
                                disabled={isProcessing}
                                className="w-full bg-white text-[#111111] border-2 border-[#111111] py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-md flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                <span>Pay in USD ($97.30)</span>
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
                                {isProcessing ? "Verifying…" : (
                                    <>
                                        <FaCheck /> <span>I Have Completed Payment</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-6 flex flex-col items-center gap-2">
                            <div className="flex items-center justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
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

    // ─── MAIN ONBOARDING MODAL ─────────────────────────────────────────────────
    const totalSteps = 5;

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
                                <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></div>
                                <span className="font-mono text-[#FFD700] text-xs md:text-sm tracking-widest uppercase">
                                    Step {step}/{totalSteps}
                                </span>
                            </div>
                            {/* Progress dots */}
                            <div className="flex gap-1.5 absolute left-1/2 -translate-x-1/2">
                                {Array.from({ length: totalSteps }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i < step ? "bg-[#FFD700] w-5" : "bg-white/20 w-1.5"}`}
                                    />
                                ))}
                            </div>
                            <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-12">

                            <AnimatePresence mode="wait">

                                {/* ── DECODING MICRO-PAUSE (Step 3 → 4) ─────────── */}
                                {isDecoding && (
                                    <motion.div
                                        key="decoding"
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        transition={{ duration: 0.4 }}
                                        className="flex flex-col items-center justify-center gap-8 py-16 text-center"
                                    >
                                        {/* Pulsing gold rings */}
                                        <div className="relative flex items-center justify-center">
                                            {[0, 0.3, 0.6].map((delay, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                                                    transition={{ duration: 2, delay, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute w-16 h-16 rounded-full border border-[#FFD700]/40"
                                                />
                                            ))}
                                            <span className="text-3xl relative z-10">✨</span>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="font-mono text-[#FFD700] text-xs uppercase tracking-widest">
                                                Just a moment…
                                            </p>
                                            <p className="font-serif text-2xl text-white leading-snug">
                                                Your details are being<br />
                                                <span className="text-[#FFD700]">stacked & decoded</span> 🔮
                                            </p>
                                            <p className="font-mono text-xs text-gray-500 pt-1">
                                                Mapping your chart patterns…
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── STEP 1: Name + Email ───────────────────────── */}
                                {!isDecoding && step === 1 && (

                                    <motion.div
                                        key="step1"
                                        {...fadeUp}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-mono text-[#FFD700] text-xs uppercase tracking-widest mb-3">Hey 👋</p>
                                            <h2 className="font-serif text-2xl md:text-3xl text-white leading-snug">
                                                I'll help build your life map.
                                                <br />
                                                <span className="text-gray-400 text-xl md:text-2xl">This takes just a minute.</span>
                                            </h2>
                                        </div>
                                        <div className="space-y-4 pt-2">
                                            <div>
                                                <label className="block font-mono text-xs text-gray-500 mb-2 uppercase tracking-widest">Your name</label>
                                                <input
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-white font-serif focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base rounded-lg"
                                                    placeholder="What do people call you?"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-mono text-xs text-gray-500 mb-2 uppercase tracking-widest">Your email</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-white font-serif focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base rounded-lg"
                                                    placeholder="Where should we send your report?"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── STEP 2: Birth Details ─────────────────────── */}
                                {!isDecoding && step === 2 && (
                                    <motion.div
                                        key="step2"
                                        {...fadeUp}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-mono text-[#FFD700] text-xs uppercase tracking-widest mb-3">
                                                Nice to meet you, {firstName} ✨
                                            </p>
                                            <h2 className="font-serif text-2xl md:text-3xl text-white leading-snug">
                                                When did your story begin?
                                            </h2>
                                            <p className="font-mono text-xs text-gray-400 pt-1">
                                                Even approximate times work — we'll connect the dots.
                                            </p>
                                        </div>
                                        <div className="space-y-4 pt-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block font-mono text-xs text-gray-500 mb-2 uppercase tracking-widest">Date of birth</label>
                                                    <input
                                                        type="date"
                                                        value={formData.dob}
                                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-white font-mono focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-mono text-xs text-gray-500 mb-2 uppercase tracking-widest">Birth time</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="time"
                                                            value={formData.tob}
                                                            onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                                                            className="w-2/3 bg-white/5 border border-white/10 p-3 md:p-4 text-white font-mono focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base rounded-lg"
                                                        />
                                                        <select
                                                            value={formData.tobAmPm}
                                                            onChange={(e) => setFormData({ ...formData, tobAmPm: e.target.value })}
                                                            className="w-1/3 bg-white/5 border border-white/10 p-3 md:p-4 text-white font-mono focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base rounded-lg"
                                                        >
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>
                                                    <p className="text-[10px] text-gray-600 mt-1 font-mono">That's okay if you're unsure — we'll work with what we have.</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block font-mono text-xs text-gray-500 mb-2 uppercase tracking-widest">Place of birth</label>
                                                <input
                                                    type="text"
                                                    value={formData.pob}
                                                    onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 p-3 md:p-4 text-white font-serif focus:border-[#FFD700] focus:outline-none transition-colors text-sm md:text-base rounded-lg"
                                                    placeholder="Where did you enter this chaos called Earth?"
                                                />
                                            </div>
                                        </div>

                                        {/* Double-check callout */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="flex items-start gap-3 bg-[#FFD700]/8 border border-[#FFD700]/25 rounded-xl p-4 mt-2"
                                        >
                                            <span className="text-[#FFD700] text-base mt-0.5">🔍</span>
                                            <div>
                                                <p className="font-mono text-xs text-[#FFD700] font-semibold mb-1 uppercase tracking-wider">Double-check before continuing</p>
                                                <p className="font-mono text-xs text-gray-400 leading-relaxed">
                                                    These details directly shape your report. Even a small error — especially the birth time — can affect the accuracy of your analysis.
                                                </p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}

                                {/* ── STEP 3: Questions / Problem ───────────────── */}
                                {!isDecoding && step === 3 && (
                                    <motion.div
                                        key="step3"
                                        {...fadeUp}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-mono text-[#FFD700] text-xs uppercase tracking-widest mb-3">Almost there 💖</p>
                                            <h2 className="font-serif text-2xl md:text-3xl text-white leading-snug">
                                                What made you come here today, {firstName}?
                                            </h2>
                                            <p className="font-mono text-xs text-gray-400 pt-1">
                                                This is a safe space. The more you share, the sharper your report.
                                            </p>
                                        </div>
                                        <div>
                                            <textarea
                                                value={formData.questions}
                                                onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                                                className="w-full h-40 md:h-48 bg-white/5 border border-white/10 p-3 md:p-4 text-white font-serif focus:border-[#FFD700] focus:outline-none transition-colors resize-none text-sm md:text-base rounded-lg"
                                                placeholder="Ask us anything — love, career, life direction, patterns you can't shake. The more specific you are, the more precise your report. (e.g. Why do I attract unavailable partners? When will I get promoted? Is this year good for marriage?)"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── STEP 4: Identity Hook ─────────────────────── */}
                                {!isDecoding && step === 4 && (
                                    <motion.div
                                        key="step4"
                                        {...fadeUp}
                                        className="space-y-8 py-4"
                                    >
                                        <div className="space-y-3">
                                            <p className="font-mono text-[#FFD700] text-xs uppercase tracking-widest">One quick thing, {firstName}…</p>
                                            <h2 className="font-serif text-2xl md:text-3xl text-white leading-snug">
                                                I'm already noticing a pattern.
                                            </h2>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.97 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4, duration: 0.5 }}
                                            className="bg-gradient-to-br from-[#FFD700]/10 to-[#FFD700]/5 border border-[#FFD700]/30 rounded-2xl p-6 md:p-8"
                                        >
                                            <p className="font-serif text-xl md:text-2xl text-white leading-relaxed">
                                                "{identityInsight}"
                                            </p>
                                        </motion.div>

                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.8 }}
                                            className="font-mono text-xs text-gray-500 leading-relaxed"
                                        >
                                            This is an observation, not a prediction. Your full report goes much deeper.
                                        </motion.p>
                                    </motion.div>
                                )}

                                {/* ── STEP 5: WOW Moment ────────────────────────── */}
                                {!isDecoding && step === 5 && (
                                    <motion.div
                                        key="step5"
                                        {...fadeUp}
                                        className="space-y-8 py-4"
                                    >
                                        <AnimatePresence mode="wait">
                                            {!wowRevealed ? (
                                                /* Loading state */
                                                <motion.div
                                                    key="loading"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex flex-col items-center gap-6 py-8"
                                                >
                                                    {/* Pulsing dots loader */}
                                                    <div className="flex gap-2">
                                                        {[0, 0.2, 0.4].map((delay, i) => (
                                                            <motion.div
                                                                key={i}
                                                                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                                                                transition={{ duration: 1.2, delay, repeat: Infinity, ease: "easeInOut" }}
                                                                className="w-3 h-3 rounded-full bg-[#FFD700]"
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="font-serif text-xl md:text-2xl text-white text-center leading-relaxed">
                                                        Hmm… give me a second, {firstName}.
                                                        <br />
                                                        <span className="text-gray-400 text-lg">Connecting the dots…</span>
                                                    </p>
                                                </motion.div>
                                            ) : (
                                                /* Revealed state */
                                                <motion.div
                                                    key="revealed"
                                                    initial={{ opacity: 0, y: 12 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="space-y-6"
                                                >

                                                    {/* Cute reassurance */}
                                                    <div className="text-center space-y-2">
                                                        <p className="text-4xl">🌟</p>
                                                        <p className="font-serif text-xl md:text-2xl text-white leading-relaxed">
                                                            You're in good hands, {firstName}.
                                                        </p>
                                                        <p className="font-mono text-xs text-gray-400 leading-relaxed">
                                                            Your report is being prepared personally — no algorithms, no auto-generated fluff.
                                                        </p>
                                                    </div>

                                                    {/* Trust bullets */}
                                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                                                        {[
                                                            { icon: "✔", text: "Human-reviewed analysis" },
                                                            { icon: "✔", text: "No fear-based upsells" },
                                                            { icon: "✔", text: "Delivered within 24 hours" },
                                                        ].map(({ icon, text }) => (
                                                            <div key={text} className="flex items-center gap-3">
                                                                <span className="text-[#FFD700] font-bold text-sm">{icon}</span>
                                                                <span className="font-mono text-sm text-gray-300">{text}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                            </AnimatePresence>

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

                            {/* Footer Controls */}
                            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                                {step > 1 ? (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="text-gray-500 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
                                    >
                                        Back
                                    </button>
                                ) : <div />}

                                {/* Step 5 CTA only shows after reveal */}
                                {step === 5 && !wowRevealed ? (
                                    <div />
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-2 bg-[#FFD700] text-black px-6 md:px-8 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors text-xs md:text-sm rounded-sm"
                                    >
                                        {step === 4
                                            ? "Continue"
                                            : step === 5
                                                ? <>Unlock My Full Report <FaArrowRight /></>
                                                : <>Next <FaArrowRight /></>}
                                    </button>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
