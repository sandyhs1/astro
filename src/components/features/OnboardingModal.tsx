"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowRight, FaCheck, FaLock, FaShieldAlt, FaChevronLeft } from "react-icons/fa";
import { useOnboarding } from "@/context/OnboardingContext";
import { useRouter } from "next/navigation";
import Script from "next/script";
import emailjs from '@emailjs/browser';

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

function generateIdentityInsight(dob: string, fullName: string, pob: string): string {
    const date = new Date(dob);
    const month = isNaN(date.getMonth()) ? 0 : date.getMonth();           // 0–11
    const day = isNaN(date.getDate()) ? 1 : date.getDate();               // 1–31
    const nameLen = fullName.trim().length % 6;                            // 0–5
    const pobCode = (pob.trim().charCodeAt(0) || 65) % 5;                 // 0–4
    const index = (month * 2 + (day % 2) + nameLen + pobCode) % IDENTITY_INSIGHTS.length;
    return IDENTITY_INSIGHTS[index];
}

const slideAnim: any = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeOut" },
};

export default function OnboardingModal() {
    const { isOpen, closeModal } = useOnboarding();
    const router = useRouter();
    const [step, setStep] = useState(1);
    
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showRazorpayIframe, setShowRazorpayIframe] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [wowRevealed, setWowRevealed] = useState(false);
    const [isDecoding, setIsDecoding] = useState(false);

    const wowTimerRef = useRef<NodeJS.Timeout | null>(null);

    // ZERO-LAG DATA CACHE
    const dataRef = useRef({
        fullName: "",
        email: "",
        dob: "",
        tob: "",
        tobAmPm: "AM",
        pob: "",
        questions: ""
    });

    const [error, setError] = useState<string | null>(null);
    const [userFirstName, setUserFirstName] = useState("there");
    const [identityInsight, setIdentityInsight] = useState("");

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

    // Handle countdown
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

    // Automated success from Dodo redirect
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const status = searchParams.get('status');

        if (status === 'success') {
            const savedData = localStorage.getItem('onboardingFormData');
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    dataRef.current = parsedData;
                    setShowSuccess(true);

                    const emailParams = {
                        fullName: dataRef.current.fullName,
                        email: dataRef.current.email,
                        dob: dataRef.current.dob,
                        tob: `${dataRef.current.tob} ${dataRef.current.tobAmPm}`,
                        pob: dataRef.current.pob,
                        questions: dataRef.current.questions,
                        paymentStatus: "Success (Automated Gateway Payment)",
                        transactionId: `DODO_${Date.now()}`,
                        submissionTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                    };

                    emailjs.send('service_kejjsw8', 'template_dq668f3', emailParams, 'p0Y1TsA4CgkB89zWO');
                    
                    localStorage.removeItem('onboardingFormData');
                    window.history.replaceState({}, document.title, "/");
                } catch (e) {
                    console.error("Failed to parse saved onboarding data", e);
                }
            }
        }
    }, [showSuccess]);

    const handleStepSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        // -- Validation & Data Cache Update --

        if (step === 1) {
            const name = formData.get("fullName") as string;
            const email = formData.get("email") as string;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name.trim() || !emailRegex.test(email.trim())) {
                setError("Please enter a valid name and email.");
                return;
            }
            dataRef.current.fullName = name;
            dataRef.current.email = email;
            setUserFirstName(name.trim().split(" ")[0]);
            setStep(2);
        } 
        else if (step === 2) {
            const dob = formData.get("dob") as string;
            const tob = formData.get("tob") as string;
            const tobAmPm = formData.get("tobAmPm") as string;
            const pob = formData.get("pob") as string;

            if (!dob || !tob || !pob.trim()) {
                setError("We need your date, time, and place of birth to continue.");
                return;
            }
            dataRef.current.dob = dob;
            dataRef.current.tob = tob;
            dataRef.current.tobAmPm = tobAmPm;
            dataRef.current.pob = pob;
            setIdentityInsight(generateIdentityInsight(dob, dataRef.current.fullName, pob));
            setStep(3);
        }
        else if (step === 3) {
            const qs = formData.get("questions") as string;
            if (!qs.trim() || qs.length < 10) {
                setError("Please share a bit more context so we can personalise your report.");
                return;
            }
            dataRef.current.questions = qs;

            // Send initial lead capture email
            emailjs.send(
                'service_kejjsw8',
                'template_dq668f3',
                {
                    fullName: dataRef.current.fullName,
                    email: dataRef.current.email,
                    dob: dataRef.current.dob,
                    tob: `${dataRef.current.tob} ${dataRef.current.tobAmPm}`,
                    pob: dataRef.current.pob,
                    questions: dataRef.current.questions,
                    paymentStatus: "⏳ Lead Captured — Payment Pending",
                    transactionId: `LEAD_${Date.now()}`,
                    submissionTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                },
                'p0Y1TsA4CgkB89zWO'
            ).catch(console.error);

            setIsDecoding(true);
            setTimeout(() => {
                setIsDecoding(false);
                setStep(4);
            }, 2500);
        }
    };

    const handleNextNonForm = () => {
        if (step === 4) {
            // Log supabase lead here as per original code
            fetch('/api/save-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    fullName: dataRef.current.fullName,
                    email: dataRef.current.email,
                    dob: dataRef.current.dob,
                    tob: `${dataRef.current.tob} ${dataRef.current.tobAmPm}`,
                    pob: dataRef.current.pob,
                    questions: dataRef.current.questions,
                    paymentStatus: 'pending',
                })
            }).catch(console.error);

            setStep(5);
        } else if (step === 5) {
            setShowPayment(true);
        }
    };

    const handleRazorpayPayment = () => {
        setIsProcessing(true);
        localStorage.setItem('onboardingFormData', JSON.stringify(dataRef.current));
        window.open(razorpayPaymentLink, '_blank', 'noopener,noreferrer');
        setShowRazorpayIframe(true);
        setIsProcessing(false);
    };

    const handleVerification = async () => {
        setIsProcessing(true);
        const emailParams = {
            fullName: dataRef.current.fullName,
            email: dataRef.current.email,
            dob: dataRef.current.dob,
            tob: `${dataRef.current.tob} ${dataRef.current.tobAmPm}`,
            pob: dataRef.current.pob,
            questions: dataRef.current.questions,
            paymentStatus: "User Reported Success (Manual Verify)",
            transactionId: `MANUAL_${Date.now()}`,
            submissionTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };

        try {
            await emailjs.send('service_kejjsw8', 'template_dq668f3', emailParams, 'p0Y1TsA4CgkB89zWO');
        } catch (error) {
            console.error("EmailJS Error:", error);
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
        dataRef.current = { fullName: "", email: "", dob: "", tob: "", tobAmPm: "AM", pob: "", questions: "" };
    };

    const handleCloseSuccess = () => {
        handleClose();
        router.push('/myths');
    };

    const razorpayPaymentLink = "https://razorpay.com/payment-link/plink_SXrL6hUxIpAjCc";

    if (!isOpen && !showSuccess) return null;

    // ----- SUCCESS SCREEN -----
    if (showSuccess) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FAFAF7]/95 backdrop-blur-md p-4">
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-sm bg-white rounded-2xl p-6 md:p-8 shadow-xl text-center border border-gray-100 relative">
                    <button onClick={handleCloseSuccess} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes /></button>
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <FaCheck className="text-green-600 text-2xl" />
                    </div>
                    <h2 className="font-serif text-2xl text-gray-900 mb-2">Done ✔️</h2>
                    <p className="text-sm text-gray-600 mb-4 tracking-tight">Your chart is now in analysis mode.</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4 text-left">
                        <p className="text-sm text-gray-800 mb-2">Hey <span className="font-bold">{dataRef.current.fullName.split(' ')[0] || 'Friend'}</span>,</p>
                        <p className="text-xs text-gray-600 mb-2">The humans are working on your report now. Expected delivery: within 24 hours.</p>
                        <p className="text-[10px] text-gray-400 mt-2 border-t border-gray-200 pt-2">No need to check back. We'll email you.</p>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">Redirecting in <b>{countdown}s</b>…</p>
                    <button onClick={handleCloseSuccess} className="w-full bg-gray-900 text-white font-medium text-sm py-3 rounded-lg hover:bg-gray-800 transition-colors">
                        Thank You
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    // ----- PAYMENT MODAL -----
    if (showPayment) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[110] flex items-center justify-center bg-[#FAFAF7]/95 backdrop-blur-md p-4">
                <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 relative">
                    <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
                            <FaShieldAlt className="text-blue-500" /> Secure Checkout
                        </span>
                        <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="space-y-2 mb-4">
                            {["Human-reviewed analysis", "No fear-based upsells", "Delivered within 24 hours"].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-xs text-gray-700">
                                    <FaCheck className="text-green-500" /> <span>{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={handleRazorpayPayment} disabled={isProcessing} className="w-full bg-[#111111] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-900 transition-all flex items-center justify-center gap-3">
                                Pay in INR (₹4,799) <FaArrowRight className="text-xs" />
                            </button>
                            <a href="https://buy.polar.sh/polar_cl_EFeCp21opdRhscmMBhyZd9kdQDSj2uVuuk48l2GTHNq" data-polar-checkout data-polar-checkout-theme="light" onClick={() => localStorage.setItem('onboardingFormData', JSON.stringify(dataRef.current))} className="w-full bg-white text-gray-900 border border-gray-300 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-3">
                                Pay in USD ($74) <FaArrowRight className="text-xs" />
                            </a>
                        </div>
                        <div className="border-t border-gray-100 pt-4 mt-2">
                            <p className="text-[10px] text-center text-gray-500 mb-2 uppercase tracking-wide">After payment</p>
                            <button onClick={handleVerification} disabled={isProcessing} className="w-full bg-gray-50 text-gray-700 border border-gray-200 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 flex items-center justify-center gap-2">
                                {isProcessing ? "Verifying…" : <> <FaCheck className="text-green-500"/> I Have Completed Payment</>}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 mt-2">
                            <FaLock /> 256-Bit SSL Encrypted
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    // ----- RAZORPAY VERIFICATION IFRAME HUD -----
    if (showRazorpayIframe) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/95 backdrop-blur-md p-6">
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-sm bg-white rounded-2xl overflow-hidden p-6 text-center">
                    <button onClick={() => setShowRazorpayIframe(false)} className="absolute top-4 right-4 text-gray-400"><FaTimes /></button>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center relative">
                        <FaLock className="text-gray-600 text-xl" />
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300 animate-[spin_4s_linear_infinite]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Secure checkout opened</h3>
                    <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">
                        Complete your payment in the tab that just opened. Once done, confirm here.
                    </p>
                    <button onClick={handleVerification} disabled={isProcessing} className="w-full py-4 bg-[#FFD700] text-black font-bold rounded-xl text-sm mb-3">
                        I've Paid Successfully
                    </button>
                    <button onClick={() => window.open(razorpayPaymentLink, '_blank', 'noopener,noreferrer')} className="text-xs text-gray-500 underline">
                        Reopen payment page
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    // ----- MAIN ONBOARDING MODAL -----
    const totalSteps = 5;

    return (
        <AnimatePresence>
            <Script src="https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js" strategy="lazyOnload" data-auto-init />
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-[#FAFAF7]/95 backdrop-blur-sm md:p-4"
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="w-full max-w-md bg-white border-t md:border border-gray-200 rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex gap-1.5 flex-1 max-w-[200px]">
                                {Array.from({ length: totalSteps }).map((_, i) => (
                                    <div key={i} className={`h-1 rounded-full transition-all duration-300 flex-1 ${i < step ? "bg-indigo-900" : "bg-gray-100"}`} />
                                ))}
                            </div>
                            <button onClick={handleClose} className="text-gray-400 hover:text-gray-800 p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                                <FaTimes className="text-sm" />
                            </button>
                        </div>

                        {/* Scrolling Body content */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar block">
                            <AnimatePresence mode="wait">

                                {isDecoding && (
                                    <motion.div key="decode" {...slideAnim} className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                                        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-900 rounded-full animate-spin mx-auto mb-4" />
                                        <h2 className="text-xl font-serif text-gray-900">Stacking & Decoding...</h2>
                                        <p className="text-sm text-gray-500">Mapping your chart patterns</p>
                                    </motion.div>
                                )}

                                {!isDecoding && step === 1 && (
                                    <motion.form key="step1" {...slideAnim} onSubmit={handleStepSubmit} className="space-y-6">
                                        <div>
                                            <p className="uppercase text-[10px] tracking-widest text-indigo-900 font-bold mb-2">Step 1</p>
                                            <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-2 leading-tight">
                                                I'll help build your life map.
                                            </h2>
                                            <p className="text-sm text-gray-600 block">This takes roughly a minute.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Legal Name</label>
                                                <input required name="fullName" type="text" defaultValue={dataRef.current.fullName} className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-gray-900 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all" placeholder="John Doe" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Best Email</label>
                                                <input required name="email" type="email" defaultValue={dataRef.current.email} className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-gray-900 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all" placeholder="john@example.com" />
                                            </div>
                                        </div>
                                        {/* Action Area Fixed inline */}
                                        <div className="pt-4 mt-4 block">
                                            {error && <p className="text-xs text-red-500 mb-3 font-medium bg-red-50 p-2 rounded-lg">{error}</p>}
                                            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-medium py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                                                Continue <FaArrowRight className="text-[10px]" />
                                            </button>
                                        </div>
                                    </motion.form>
                                )}

                                {!isDecoding && step === 2 && (
                                    <motion.form key="step2" {...slideAnim} onSubmit={handleStepSubmit} className="space-y-6">
                                        <div>
                                            <p className="uppercase text-[10px] tracking-widest text-indigo-900 font-bold mb-2">Step 2</p>
                                            <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-1 leading-tight">
                                                When did your story begin, {userFirstName}?
                                            </h2>
                                            <p className="text-sm text-gray-600 block">Provide approximate times if unsure.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Date of Birth</label>
                                                <input required name="dob" type="date" defaultValue={dataRef.current.dob} className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-gray-900 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Time of Birth</label>
                                                <div className="flex gap-2">
                                                    <input required name="tob" type="time" defaultValue={dataRef.current.tob} className="flex-1 bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-gray-900 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
                                                    <select name="tobAmPm" defaultValue={dataRef.current.tobAmPm} className="w-24 bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-gray-900 text-sm outline-none shrink-0 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600">
                                                        <option value="AM">AM</option>
                                                        <option value="PM">PM</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Place of Birth</label>
                                                <input required name="pob" type="text" defaultValue={dataRef.current.pob} className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-gray-900 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" placeholder="City, State, Country" />
                                            </div>
                                        </div>
                                        <div className="pt-4 mt-4 block">
                                            {error && <p className="text-xs text-red-500 mb-3 font-medium bg-red-50 p-2 rounded-lg">{error}</p>}
                                            <div className="flex gap-3">
                                                <button type="button" onClick={() => setStep(1)} className="p-4 bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                                                    <FaChevronLeft className="text-sm" />
                                                </button>
                                                <button type="submit" className="flex-1 bg-gray-900 hover:bg-black text-white font-medium py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                                                    Next <FaArrowRight className="text-[10px]" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.form>
                                )}

                                {!isDecoding && step === 3 && (
                                    <motion.form key="step3" {...slideAnim} onSubmit={handleStepSubmit} className="space-y-6">
                                        <div>
                                            <p className="uppercase text-[10px] tracking-widest text-indigo-900 font-bold mb-2">Step 3</p>
                                            <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-2 leading-tight">
                                                What made you come here today?
                                            </h2>
                                            <p className="text-sm text-gray-600">The more specific you are, the sharper your report.</p>
                                        </div>
                                        <div>
                                            <textarea required name="questions" defaultValue={dataRef.current.questions} className="w-full h-32 md:h-40 bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-900 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all resize-none" placeholder="Ask about career shifts, relationship loops, or life direction..." />
                                        </div>
                                        <div className="pt-4 mt-4 block">
                                            {error && <p className="text-xs text-red-500 mb-3 font-medium bg-red-50 p-2 rounded-lg">{error}</p>}
                                            <div className="flex gap-3">
                                                <button type="button" onClick={() => setStep(2)} className="p-4 bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                                                    <FaChevronLeft className="text-sm" />
                                                </button>
                                                <button type="submit" className="flex-1 bg-gray-900 hover:bg-black text-white font-medium py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                                                    Process My Data
                                                </button>
                                            </div>
                                        </div>
                                    </motion.form>
                                )}

                                {!isDecoding && step === 4 && (
                                    <motion.div key="step4" {...slideAnim} className="space-y-6">
                                        <div>
                                            <p className="uppercase text-[10px] tracking-widest text-orange-600 font-bold mb-2">Observation</p>
                                            <h2 className="font-serif text-2xl md:text-3xl text-gray-900 leading-tight">
                                                I'm already noticing a pattern.
                                            </h2>
                                        </div>
                                        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 md:p-6 shadow-sm">
                                            <p className="font-serif text-lg text-gray-800 leading-relaxed italic">"{identityInsight}"</p>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                            This is a surface observation. The full report maps the timeline.
                                        </p>
                                        <div className="pt-4 mt-4 block">
                                            <button onClick={handleNextNonForm} className="w-full bg-gray-900 hover:bg-black text-white font-medium py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                                                Continue <FaArrowRight className="text-[10px]" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {!isDecoding && step === 5 && (
                                    <motion.div key="step5" {...slideAnim} className="space-y-6">
                                        {!wowRevealed ? (
                                            <div className="flex flex-col items-center gap-4 py-8">
                                                <div className="flex gap-2 mb-2">
                                                    {[0, 0.15, 0.3].map((d, i) => (
                                                        <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1, delay: d }} className="w-2.5 h-2.5 rounded-full bg-indigo-900" />
                                                    ))}
                                                </div>
                                                <p className="font-serif text-xl border-b border-transparent text-gray-900 text-center">Give me a second...</p>
                                                <p className="text-sm text-gray-500">Connecting the dots...</p>
                                            </div>
                                        ) : (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 py-4">
                                                <div className="text-center space-y-3 mb-6">
                                                    <span className="text-3xl block">🙏</span>
                                                    <h2 className="font-serif text-2xl text-gray-900">You're in good hands.</h2>
                                                    <p className="text-sm text-gray-500 block leading-relaxed px-4">Your report is drafted personally by humans, not algorithms.</p>
                                                </div>
                                                <div className="pt-2 mt-4 block">
                                                    <button onClick={handleNextNonForm} className="w-full bg-[#FFD700] hover:bg-yellow-400 text-gray-900 font-bold py-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
                                                        Unlock My Full Report <FaLock className="text-xs opacity-70" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
