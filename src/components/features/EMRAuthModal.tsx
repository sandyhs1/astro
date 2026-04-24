"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/context/AuthModalContext";
import { X, ArrowUpRight, AlertCircle, CheckCircle } from "lucide-react";

export default function EMRAuthModal() {
  const { isOpen, view, closeAuthModal, openAuthModal } = useAuthModal();
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setMessage(null);
    setEmail("");
    setPassword("");
    setFullName("");
  }, [view, isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
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

  const titles = {
    sign_up: "Initiate",
    sign_in: "Access",
    forgot_password: "Recover",
  };
  const subtitles = {
    sign_up: "Create your intelligence profile.",
    sign_in: "Return to your cosmic HQ.",
    forgot_password: "We'll send you a recovery key.",
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="emr-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={closeAuthModal}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "rgba(5, 5, 7, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Modal Card */}
        <motion.div
          key="emr-modal-card"
          initial={{ y: 32, scale: 0.94, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 32, scale: 0.94, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#0B0B12",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 0 0 1px rgba(0,229,255,0.08), 0 40px 80px -20px rgba(0,0,0,0.8), 0 0 60px -20px rgba(255,94,58,0.15)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Top gradient accent bar */}
          <div
            style={{
              height: 2,
              background: "linear-gradient(90deg, #FF5E3A, #00E5FF, #7B61FF)",
            }}
          />

          {/* Aurora blob decoration */}
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "#FF5E3A",
              top: "-80px",
              right: "-80px",
              filter: "blur(80px)",
              opacity: 0.06,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "#7B61FF",
              bottom: "-60px",
              left: "-60px",
              filter: "blur(60px)",
              opacity: 0.08,
              pointerEvents: "none",
            }}
          />

          <div style={{ padding: "28px 28px 32px", position: "relative" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 28,
              }}
            >
              <div>
                {/* Logo mark */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <svg width="20" height="20" viewBox="0 0 28 28" aria-hidden="true">
                    <circle cx="14" cy="14" r="13" fill="none" stroke="#00E5FF" strokeWidth="1" />
                    <polygon points="14,3 25,22 3,22" fill="none" stroke="#7B61FF" strokeWidth="1" />
                    <circle cx="14" cy="14" r="3" fill="#FF5E3A" />
                  </svg>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    Quantum<span style={{ color: "#FF5E3A" }}>/</span>Karma
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: "2.5rem",
                    fontWeight: 400,
                    color: "#FFFFFF",
                    marginBottom: 4,
                    lineHeight: 0.95,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {titles[view]}
                  <span style={{ color: "#FF5E3A" }}>.</span>
                </h2>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)",
                    marginTop: 6,
                  }}
                >
                  {subtitles[view]}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={closeAuthModal}
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                }}
              >
                <X size={13} strokeWidth={1.5} />
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginBottom: 16,
                  padding: "10px 14px",
                  background: "rgba(255,94,58,0.08)",
                  border: "1px solid rgba(255,94,58,0.3)",
                  color: "#FF5E3A",
                  fontSize: "12px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <AlertCircle size={13} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                {error}
              </motion.div>
            )}

            {/* Success */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginBottom: 16,
                  padding: "10px 14px",
                  background: "rgba(0,229,255,0.06)",
                  border: "1px solid rgba(0,229,255,0.25)",
                  color: "#00E5FF",
                  fontSize: "12px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <CheckCircle size={13} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                {message}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {view === "sign_up" && (
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,229,255,0.06)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,229,255,0.06)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>

              {view !== "forgot_password" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label style={labelStyle}>Password</label>
                    {view === "sign_in" && (
                      <button
                        type="button"
                        onClick={() => openAuthModal("forgot_password")}
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "9px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(0,229,255,0.6)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#00E5FF"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(0,229,255,0.6)"; }}
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
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,229,255,0.06)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              )}

              {/* Submit CTA */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  width: "100%",
                  marginTop: 4,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  padding: "14px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  color: "#050507",
                  background: loading
                    ? "rgba(248,250,252,0.5)"
                    : "#F8FAFC",
                  transition: "opacity 0.2s, background 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* shimmer sweep on hover */}
                <motion.span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.15), transparent)",
                  }}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span style={{ position: "relative", zIndex: 1 }}>
                  {loading
                    ? "Processing…"
                    : view === "sign_up"
                    ? "Create Account"
                    : view === "sign_in"
                    ? "Sign In"
                    : "Send Reset Link"}
                </span>
                {!loading && (
                  <ArrowUpRight size={12} strokeWidth={1.8} style={{ position: "relative", zIndex: 1, transition: "transform 0.3s" }} />
                )}
              </motion.button>
            </form>

            {/* Divider + Google */}
            {view !== "forgot_password" && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    margin: "20px 0",
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.25)",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    Or
                  </span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                  }}
                >
                  {/* Google G icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            {/* Footer toggle */}
            <div
              style={{
                marginTop: 20,
                textAlign: "center",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.05em",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              {view === "sign_up" ? (
                <span>
                  Already have an account?{" "}
                  <button
                    onClick={() => openAuthModal("sign_in")}
                    style={{
                      color: "#00E5FF",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  No account yet?{" "}
                  <button
                    onClick={() => openAuthModal("sign_up")}
                    style={{
                      color: "#00E5FF",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    Initiate
                  </button>
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* Style helpers */
const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "9px",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.35)",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "12px 14px",
  color: "#FFFFFF",
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
  borderRadius: 0,
};
