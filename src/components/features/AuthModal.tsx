"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowRight, FaGoogle } from "react-icons/fa";
import { useAuthModal } from "@/context/AuthModalContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const grad = "linear-gradient(135deg, hsl(245,60%,28%), hsl(270,60%,40%), hsl(30,80%,55%))";

export default function AuthModal() {
    const { isOpen, view, closeAuthModal, openAuthModal } = useAuthModal();
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Reset state when view changes
    useEffect(() => {
        setError(null);
        setMessage(null);
        setEmail("");
        setPassword("");
        setFullName("");
        setPromoCode("");
    }, [view, isOpen]);

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || "Error signing in with Google");
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            if (view === "sign_up") {
                if (!fullName.trim()) throw new Error("Full name is required");

                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (signUpError) throw signUpError;

                // ── Apply promo code if entered ───────────────────────────────
                if (promoCode.trim()) {
                    // Sign in immediately to get a session, then call the promo API
                    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                    if (!signInError) {
                        const promoRes = await fetch("/api/apply-promo", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ promoCode: promoCode.trim() }),
                        });
                        const promoData = await promoRes.json();
                        if (promoRes.ok) {
                            // Promo valid — go straight to dashboard
                            closeAuthModal();
                            router.push("/dashboard");
                            return;
                        } else {
                            // Promo failed — account still created, let user know
                            setMessage(`Account created! Note: ${promoData.error} Please sign in.`);
                            return;
                        }
                    }
                }

                setMessage("Check your email for the confirmation link!");

            } else if (view === "sign_in") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                closeAuthModal();
                router.push("/dashboard");
            } else if (view === "forgot_password") {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard/reset-password`,
                });
                if (error) throw error;
                setMessage("Password reset link sent to your email!");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeAuthModal}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    background: "rgba(250, 250, 247, 0.92)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                }}
            >
                {/* Card */}
                <motion.div
                    initial={{ y: 24, scale: 0.96, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: 24, scale: 0.96, opacity: 0 }}
                    transition={{ type: "spring", damping: 28, stiffness: 260 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        width: "100%",
                        maxWidth: 420,
                        background: "#FFFFFF",
                        border: "1px solid #E5E5E5",
                        borderRadius: 24,
                        boxShadow: "0 25px 60px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    {/* Top gradient accent bar */}
                    <div style={{ height: 4, background: grad, borderRadius: "24px 24px 0 0" }} />

                    <div style={{ padding: "28px 28px 32px" }}>
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                            <div>
                                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#111111", marginBottom: 4, lineHeight: 1.2 }}>
                                    {view === "sign_up" ? "Create Account" : view === "sign_in" ? "Welcome Back" : "Reset Password"}
                                </h2>
                                <p style={{ fontSize: "0.875rem", color: "#555555", margin: 0 }}>
                                    {view === "sign_up" ? "Join the reality-check." : view === "sign_in" ? "Enter your cosmic HQ." : "We'll send you a recovery link."}
                                </p>
                            </div>
                            <button
                                onClick={closeAuthModal}
                                style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#F3F3F3", border: "1px solid #E0E0E0", color: "#666666", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#E8E8E8"; e.currentTarget.style.color = "#333333"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "#F3F3F3"; e.currentTarget.style.color = "#666666"; }}
                            >
                                <FaTimes size={11} />
                            </button>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", fontSize: "0.8125rem", fontWeight: 500, lineHeight: 1.5 }}>
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {message && (
                            <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 12, background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", fontSize: "0.8125rem", fontWeight: 500, lineHeight: 1.5 }}>
                                {message}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                            {/* Full Name — sign_up only */}
                            {view === "sign_up" && (
                                <div>
                                    <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 700, color: "#444444", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                        Full Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        style={{ width: "100%", background: "#F9F9F9", border: "1px solid #D4D4D4", padding: "12px 14px", borderRadius: 12, color: "#111111", fontSize: "0.875rem", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(245,60%,48%)")}
                                        onBlur={(e) => (e.currentTarget.style.borderColor = "#D4D4D4")}
                                    />
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 700, color: "#444444", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    Email
                                </label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    style={{ width: "100%", background: "#F9F9F9", border: "1px solid #D4D4D4", padding: "12px 14px", borderRadius: 12, color: "#111111", fontSize: "0.875rem", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                                    onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(245,60%,48%)")}
                                    onBlur={(e) => (e.currentTarget.style.borderColor = "#D4D4D4")}
                                />
                            </div>

                            {/* Promo Code — sign_up only, optional */}
                            {view === "sign_up" && (
                                <div>
                                    <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 700, color: "#444444", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                        Promo Code{" "}
                                        <span style={{ fontWeight: 400, color: "#999", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="QK-XXXX-XXXX"
                                        maxLength={12}
                                        style={{
                                            width: "100%",
                                            background: promoCode ? "#F5F0FF" : "#F9F9F9",
                                            border: `1px solid ${promoCode ? "hsl(270,60%,70%)" : "#D4D4D4"}`,
                                            padding: "12px 14px",
                                            borderRadius: 12,
                                            color: "#111111",
                                            fontSize: "0.875rem",
                                            outline: "none",
                                            fontFamily: "'IBM Plex Mono', monospace",
                                            letterSpacing: "0.08em",
                                            transition: "border-color 0.2s, background 0.2s",
                                            boxSizing: "border-box",
                                        }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(270,60%,55%)"; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = promoCode ? "hsl(270,60%,70%)" : "#D4D4D4"; }}
                                    />
                                    {promoCode && (
                                        <p style={{ fontSize: "0.7rem", color: "hsl(270,60%,45%)", marginTop: 4, margin: "4px 0 0 0" }}>
                                            ✨ Promo code detected — you&apos;ll get instant dashboard access!
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Password — sign_up and sign_in only */}
                            {view !== "forgot_password" && (
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                        <label style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#444444", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                            Password
                                        </label>
                                        {view === "sign_in" && (
                                            <button
                                                type="button"
                                                onClick={() => openAuthModal("forgot_password")}
                                                style={{ fontSize: "0.75rem", color: "hsl(30,80%,40%)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}
                                            >
                                                Forgot?
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{ width: "100%", background: "#F9F9F9", border: "1px solid #D4D4D4", padding: "12px 14px", borderRadius: 12, color: "#111111", fontSize: "0.875rem", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(245,60%,48%)")}
                                        onBlur={(e) => (e.currentTarget.style.borderColor = "#D4D4D4")}
                                    />
                                </div>
                            )}

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    width: "100%",
                                    marginTop: 4,
                                    fontWeight: 700,
                                    padding: "14px",
                                    borderRadius: 12,
                                    fontSize: "0.875rem",
                                    border: "none",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    color: "#FFFFFF",
                                    background: grad,
                                    opacity: loading ? 0.7 : 1,
                                    boxShadow: "0 4px 14px -4px rgba(120, 60, 200, 0.35)",
                                    transition: "opacity 0.2s",
                                }}
                            >
                                {loading
                                    ? "Processing..."
                                    : view === "sign_up"
                                    ? "Create Account"
                                    : view === "sign_in"
                                    ? "Sign In"
                                    : "Send Reset Link"}
                                {!loading && <FaArrowRight style={{ fontSize: 11, opacity: 0.8 }} />}
                            </motion.button>
                        </form>

                        {/* Divider + Google — only for sign_up / sign_in */}
                        {view !== "forgot_password" && (
                            <>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
                                    <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
                                    <span style={{ fontSize: "0.6875rem", color: "#999999", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Or</span>
                                    <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
                                </div>

                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    style={{ width: "100%", background: "#FFFFFF", border: "1px solid #D4D4D4", color: "#222222", fontWeight: 700, padding: "13px", borderRadius: 12, fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.15s" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "#F7F7F7"; e.currentTarget.style.borderColor = "#BBBBBB"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#D4D4D4"; }}
                                >
                                    <FaGoogle style={{ color: "#4285F4", fontSize: 15 }} />
                                    Continue with Google
                                </button>
                            </>
                        )}

                        {/* Footer toggle */}
                        <div style={{ marginTop: 24, textAlign: "center" }}>
                            {view === "sign_up" ? (
                                <p style={{ fontSize: "0.8125rem", color: "#666666", margin: 0 }}>
                                    Already have an account?{" "}
                                    <button onClick={() => openAuthModal("sign_in")} style={{ color: "hsl(30,80%,38%)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                        Sign In
                                    </button>
                                </p>
                            ) : (
                                <p style={{ fontSize: "0.8125rem", color: "#666666", margin: 0 }}>
                                    Don&apos;t have an account?{" "}
                                    <button onClick={() => openAuthModal("sign_up")} style={{ color: "hsl(30,80%,38%)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                        Sign Up
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
