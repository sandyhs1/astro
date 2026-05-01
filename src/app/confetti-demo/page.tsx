"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// ── Confetti burst helper (same logic as PaymentGate) ────────────────────────
function fireConfetti(plan: "plan1" | "plan2") {
  const colors =
    plan === "plan1"
      ? ["#FF5E3A", "#FFB347", "#FFF176", "#FFFFFF"]
      : ["#00E5FF", "#7B61FF", "#B3F0FF", "#FFFFFF"];

  const burst = (origin: { x: number; y: number }) =>
    confetti({
      particleCount: 120,
      spread: 80,
      startVelocity: 45,
      decay: 0.92,
      scalar: 1.1,
      colors,
      origin,
      zIndex: 9999,
    });

  burst({ x: 0.2, y: 0.55 });
  setTimeout(() => burst({ x: 0.8, y: 0.55 }), 150);
  setTimeout(() => burst({ x: 0.5, y: 0.4 }), 350);
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const mono = "'IBM Plex Mono', monospace";
const serif = "'Instrument Serif', serif";

export default function ConfettiDemoPage() {
  const [screen, setScreen] = useState<"menu" | "plan1" | "plan2">("menu");

  // Auto-fire confetti when screen transitions
  useEffect(() => {
    if (screen === "plan1") fireConfetti("plan1");
    if (screen === "plan2") fireConfetti("plan2");
  }, [screen]);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Instrument+Serif:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050507; }
        button:focus { outline: none; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#050507",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: mono,
      }}>

        <AnimatePresence mode="wait">

          {/* ── MENU ─────────────────────────────────────────────────────── */}
          {screen === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              style={{ textAlign: "center", maxWidth: 480 }}
            >
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", color: "#00E5FF", marginBottom: 16, textTransform: "uppercase" }}>
                Confetti Demo · Quantum Karma
              </div>
              <div style={{ fontFamily: serif, fontSize: "clamp(1.8rem, 5vw, 2.6rem)", color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>
                Live Preview
              </div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: 40 }}>
                Click a button below to see the exact success screen<br />
                users will see after payment — with live confetti 🎉
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setScreen("plan1")}
                  style={{
                    padding: "18px 24px",
                    background: "linear-gradient(135deg, rgba(255,94,58,0.15), rgba(255,94,58,0.3))",
                    border: "1px solid rgba(255,94,58,0.5)",
                    color: "#FF5E3A",
                    fontFamily: mono,
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  🎉 Preview Plan 1 — Thank You Screen
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setScreen("plan2")}
                  style={{
                    padding: "18px 24px",
                    background: "linear-gradient(135deg, rgba(0,229,255,0.1), rgba(0,229,255,0.25))",
                    border: "1px solid rgba(0,229,255,0.4)",
                    color: "#00E5FF",
                    fontFamily: mono,
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  ✨ Preview Plan 2 — Access Granted Screen
                </motion.button>
              </div>

              <div style={{ marginTop: 32, fontSize: "0.6rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>
                BOTH INR + USD USERS SEE THESE SAME SCREENS
              </div>
            </motion.div>
          )}

          {/* ── PLAN 1 SUCCESS ───────────────────────────────────────────── */}
          {screen === "plan1" && (
            <motion.div
              key="plan1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              style={{ width: "100%", maxWidth: 540, background: "#0B0B12", border: "1px solid rgba(255,94,58,0.3)", padding: "48px 40px", textAlign: "center" }}
            >
              <div style={{ height: 2, background: "linear-gradient(90deg,#FF5E3A,#7B61FF,#00E5FF)", marginBottom: 36, marginLeft: -40, marginRight: -40 }} />

              <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
              <div style={{ fontFamily: serif, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#fff", marginBottom: 16 }}>
                Thank You, Rahul!
              </div>
              <div style={{ fontFamily: mono, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 2, marginBottom: 28 }}>
                Your birth chart is now with our senior Vedic astrologer.<br />
                A deeply personalized Life Intelligence Report will land<br />
                in your inbox within{" "}
                <strong style={{ color: "#FF5E3A", fontSize: "1rem" }}>4–6 business hours.</strong>
              </div>

              {/* Email box */}
              <div style={{
                padding: "16px 20px", background: "rgba(255,94,58,0.06)",
                border: "1px solid rgba(255,94,58,0.15)", fontFamily: mono,
                fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em",
                lineHeight: 1.9, marginBottom: 28, textAlign: "left",
              }}>
                DASHBOARD ACCESS IS NOT INCLUDED WITH THIS PLAN.<br />
                REPORT WILL BE EMAILED TO: <strong style={{ color: "rgba(255,255,255,0.5)" }}>rahul@example.com</strong>
              </div>

              {/* Sign-out CTA */}
              <div style={{
                padding: "20px 24px", background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 20, textAlign: "left",
              }}>
                <div style={{ fontFamily: serif, fontSize: "1.05rem", color: "#fff", marginBottom: 8, lineHeight: 1.5 }}>
                  You're all set — you can safely sign out now.
                </div>
                <div style={{ fontFamily: mono, fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: 18 }}>
                  Your report is being prepared with full attention and care.<br />
                  There's nothing more you need to do — just check your inbox.<br />
                  We'll be in touch very soon.
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setScreen("menu")}
                  style={{
                    width: "100%", padding: "14px",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.8)", fontFamily: mono, fontSize: "11px",
                    letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  → Sign Out (demo — returns to menu)
                </motion.button>
              </div>

              <div style={{ fontFamily: mono, fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginBottom: 28 }}>
                Questions? Email us at help@quantumkarma.tech
              </div>

              {/* Replay button */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => fireConfetti("plan1")}
                style={{
                  padding: "10px 20px", background: "transparent",
                  border: "1px solid rgba(255,94,58,0.3)", color: "rgba(255,94,58,0.6)",
                  fontFamily: mono, fontSize: "9px", letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: "pointer", marginRight: 10,
                }}
              >
                🎉 Replay Confetti
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setScreen("menu")}
                style={{
                  padding: "10px 20px", background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)",
                  fontFamily: mono, fontSize: "9px", letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: "pointer",
                }}
              >
                ← Back to Menu
              </motion.button>
            </motion.div>
          )}

          {/* ── PLAN 2 SUCCESS ───────────────────────────────────────────── */}
          {screen === "plan2" && (
            <motion.div
              key="plan2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "40px", maxWidth: 440 }}
            >
              <div style={{ fontSize: 56, marginBottom: 20 }}>✨</div>
              <div style={{ fontFamily: serif, fontSize: "clamp(1.8rem, 5vw, 2.6rem)", color: "#00E5FF", marginBottom: 12 }}>
                Access Granted.
              </div>
              <div style={{ fontFamily: mono, fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", lineHeight: 1.9, marginBottom: 32 }}>
                50 CREDITS LOADED<br />
                <span style={{ color: "rgba(255,255,255,0.3)" }}>YOUR DASHBOARD IS LOADING...</span>
              </div>

              <div style={{
                padding: "20px 24px", background: "rgba(0,229,255,0.04)",
                border: "1px solid rgba(0,229,255,0.15)", marginBottom: 32,
              }}>
                <div style={{ fontFamily: mono, fontSize: "9px", color: "rgba(0,229,255,0.5)", letterSpacing: "0.1em", lineHeight: 1.9 }}>
                  PLAN 2 — MONTHLY SUBSCRIPTION<br />
                  FULL DASHBOARD + AI ORACLE ACCESS<br />
                  CREDITS RENEW EVERY 30 DAYS
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => fireConfetti("plan2")}
                  style={{
                    padding: "10px 20px", background: "transparent",
                    border: "1px solid rgba(0,229,255,0.3)", color: "rgba(0,229,255,0.6)",
                    fontFamily: mono, fontSize: "9px", letterSpacing: "0.1em",
                    textTransform: "uppercase", cursor: "pointer",
                  }}
                >
                  🎉 Replay Confetti
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setScreen("menu")}
                  style={{
                    padding: "10px 20px", background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)",
                    fontFamily: mono, fontSize: "9px", letterSpacing: "0.1em",
                    textTransform: "uppercase", cursor: "pointer",
                  }}
                >
                  ← Back to Menu
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </>
  );
}
