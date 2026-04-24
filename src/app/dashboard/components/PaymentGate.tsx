"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

// ─── Types ───────────────────────────────────────────────────────────────────
type PlanType = "plan1" | "plan2";
type GateState =
  | "loading"        // checking payment status
  | "gate"           // unpaid → show plan selection
  | "processing"     // Razorpay checkout open
  | "plan1_success"  // Plan 1 paid → blurred + thank you
  | "plan2_success"  // Plan 2 paid → unblurred (gate hidden)
  | "open";          // previously paid, gate bypassed

interface PaymentGateProps {
  children: React.ReactNode;
}

// ─── Razorpay SDK loader ──────────────────────────────────────────────────────
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Plan data ────────────────────────────────────────────────────────────────
const PLANS = {
  plan1: {
    label: "Complete Reality Check",
    tag: "One-Time Report",
    price: "₹4,799",
    period: "one-time payment",
    accent: "#FF5E3A",
    features: [
      "Multi Page Life Intelligence Report",
      "Prepared by senior Vedic astrologer",
      "Delivered within 24 hours",
      "All 16 divisional charts analyzed",
      "Dasha timeline & predictions",
      "Career, wealth, health & relationships",
      "D-60 Shastyamsa karmic analysis",
    ],
    cta: "Get My Report",
  },
  plan2: {
    label: "AI Intelligence Credits",
    tag: "Monthly Plan",
    price: "₹1,799",
    period: "per month · 50 credits",
    accent: "#00E5FF",
    features: [
      "50 credits every month",
      "Unlimited AI chat sessions",
      "Real-time chart interrogation",
      "Extended follow-up questions",
      "Frontier-grade Vedic AI engine",
      "16 divisional chart cross-reference",
      "Credits roll over (no expiry in period)",
    ],
    cta: "Start With Credits",
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PaymentGate({ children }: PaymentGateProps) {
  const [gateState, setGateState] = useState<GateState>("loading");
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("plan2");
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  // ── On mount: check if user has already paid ───────────────────────────────
  useEffect(() => {
    async function checkPaymentStatus() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setGateState("gate"); return; }

      setUserEmail(user.email ?? "");
      setUserName(user.user_metadata?.full_name ?? user.email ?? "");

      // ── Admin Override ───────────────────────────────────────────────────────
      if (user.email === "sandeshprasad7@gmail.com") {
        setGateState("open");
        return;
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("plan_type, payment_status, credits")
        .eq("id", user.id)
        .single();

      if (!profile || profile.payment_status !== "success") {
        setGateState("gate");
        return;
      }

      if (profile.plan_type === "plan2") {
        setGateState("open");       // Full access
      } else if (profile.plan_type === "plan1") {
        setGateState("plan1_success"); // Blurred, report pending
      } else {
        setGateState("gate");
      }
    }
    checkPaymentStatus();
  }, []);

  // ── Initiate payment ───────────────────────────────────────────────────────
  async function handlePay(plan: PlanType) {
    setError(null);
    setGateState("processing");

    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      setError("Failed to load payment window. Please check your internet connection.");
      setGateState("gate");
      return;
    }

    try {
      // 1. Create order / subscription on our server
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const orderData = await res.json();

      if (!res.ok) throw new Error(orderData.error ?? "Order creation failed");

      // 2. Open Razorpay checkout
      const options: Record<string, any> = {
        key: orderData.keyId,
        currency: "INR",
        name: "Quantum Karma",
        description: plan === "plan1" ? "Complete Reality Check Report" : "AI Credits — 50/month",
        image: "https://quantumkarma.tech/favicon.ico",
        theme: { color: plan === "plan1" ? "#FF5E3A" : "#00E5FF" },
        prefill: { email: userEmail, name: userName },
        modal: {
          ondismiss: () => setGateState("gate"),
        },
        handler: async (response: any) => {
          // 3. Verify payment signature on our server
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, plan }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              setError("Payment verification failed. Please contact support.");
              setGateState("gate");
              return;
            }

            // 4. Update gate state based on plan
            if (plan === "plan1") {
              setGateState("plan1_success");
            } else {
              setGateState("plan2_success");
              // Reload after 2s to fully refresh dashboard data
              setTimeout(() => window.location.reload(), 2000);
            }
          } catch {
            setError("Verification error. Your payment may have gone through — please contact support.");
            setGateState("gate");
          }
        },
      };

      // Plan 1: order flow
      if (plan === "plan1" && orderData.orderId) {
        options.order_id = orderData.orderId;
        options.amount = orderData.amount;
      }
      // Plan 2: subscription flow
      if (plan === "plan2" && orderData.subscriptionId) {
        options.subscription_id = orderData.subscriptionId;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setError(`Payment failed: ${resp.error?.description ?? "Unknown error"}`);
        setGateState("gate");
      });
      rzp.open();

    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setGateState("gate");
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (gateState === "loading") {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>
          VERIFYING ACCESS...
        </div>
      </div>
    );
  }

  // ── Full access (Plan 2 already paid) ─────────────────────────────────────
  if (gateState === "open") return <>{children}</>;

  // ── Plan 2 just paid — brief success flash before reload ──────────────────
  if (gateState === "plan2_success") {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", color: "#00E5FF", marginBottom: 8 }}>
            Access Granted.
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
            50 CREDITS LOADED · LOADING YOUR DASHBOARD...
          </div>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // BLURRED DASHBOARD + OVERLAY
  // Shown for: gate (unpaid), processing, plan1_success
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>

      {/* ── Dashboard content (always rendered but blurred) ───────────────── */}
      <div style={{
        filter: "blur(12px) brightness(0.4)",
        pointerEvents: "none",
        userSelect: "none",
        minHeight: "100vh",
        overflow: "hidden",
      }}>
        {children}
      </div>

      {/* ── Overlay ──────────────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        background: "rgba(5,5,7,0.75)",
        backdropFilter: "blur(4px)",
        overflowY: "auto",
      }}>
        <AnimatePresence mode="wait">

          {/* ── PLAN 1 SUCCESS: Thank You Message ─────────────────────────── */}
          {gateState === "plan1_success" && (
            <motion.div key="plan1-success"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                width: "100%", maxWidth: 560, background: "#0B0B12",
                border: "1px solid rgba(255,94,58,0.3)",
                padding: "48px 40px", textAlign: "center",
              }}>
              <div style={{ height: 2, background: "linear-gradient(90deg,#FF5E3A,#7B61FF)", marginBottom: 32, marginLeft: -40, marginRight: -40 }} />
              <div style={{ fontSize: 40, marginBottom: 20 }}>🙏</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", color: "#fff", marginBottom: 12 }}>
                Payment Received. Thank You.
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.9, marginBottom: 32 }}>
                Your birth details are now with our senior Vedic astrologer.<br />
                Your <strong style={{ color: "rgba(255,255,255,0.7)" }}>Life Intelligence Report</strong> is being carefully prepared.<br /><br />
                It will be delivered to your email within<br />
                <strong style={{ color: "#FF5E3A", fontSize: "1rem" }}>4–6 business hours.</strong>
              </div>
              <div style={{
                padding: "14px 20px",
                background: "rgba(255,94,58,0.06)",
                border: "1px solid rgba(255,94,58,0.15)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.08em",
                lineHeight: 1.8,
              }}>
                DASHBOARD ACCESS IS NOT INCLUDED WITH THIS PLAN.<br />
                YOUR REPORT WILL BE EMAILED TO: <strong style={{ color: "rgba(255,255,255,0.5)" }}>{userEmail}</strong>
              </div>
              <div style={{ marginTop: 24, fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
                Questions? Email us at help@soulsync.tech
              </div>
            </motion.div>
          )}

          {/* ── GATE: Plan Selection Modal ────────────────────────────────── */}
          {(gateState === "gate" || gateState === "processing") && (
            <motion.div key="gate"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ width: "100%", maxWidth: 860 }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", color: "#00E5FF", textTransform: "uppercase", marginBottom: 12 }}>
                  SELECT YOUR ACCESS PLAN
                </div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#fff", lineHeight: 1.1 }}>
                  Choose how you want to<br />
                  <span style={{ color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>access the intelligence.</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ textAlign: "center", marginBottom: 20, fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#FF5E3A", padding: "10px", border: "1px solid rgba(255,94,58,0.3)", background: "rgba(255,94,58,0.06)" }}>
                  {error}
                </div>
              )}

              {/* Plan Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {(["plan1", "plan2"] as PlanType[]).map((planKey) => {
                  const p = PLANS[planKey];
                  const isSelected = selectedPlan === planKey;
                  return (
                    <motion.div key={planKey}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedPlan(planKey)}
                      style={{
                        background: "#0B0B12",
                        border: `1px solid ${isSelected ? p.accent + "60" : "rgba(255,255,255,0.07)"}`,
                        padding: "28px 24px 24px",
                        cursor: "pointer",
                        position: "relative",
                        transition: "border-color 0.25s",
                        boxShadow: isSelected ? `0 0 24px ${p.accent}15` : "none",
                      }}>
                      {/* Top accent bar */}
                      {isSelected && (
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${p.accent}, transparent)` }} />
                      )}

                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", color: p.accent, marginBottom: 10 }}>
                        {p.tag}
                      </div>
                      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.35rem", color: "#fff", marginBottom: 4 }}>
                        {p.label}
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", color: p.accent }}>{p.price}</span>
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
                        {p.period}
                      </div>

                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                        {p.features.map((f, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                            <span style={{ color: p.accent, flexShrink: 0, marginTop: 2 }}>▸</span>
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* Selected indicator */}
                      <div style={{ marginTop: 20, height: 1, background: `rgba(255,255,255,0.05)`, marginBottom: 16 }} />
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%",
                        border: `1.5px solid ${isSelected ? p.accent : "rgba(255,255,255,0.2)"}`,
                        background: isSelected ? p.accent : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                      }}>
                        {isSelected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#000" }} />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div style={{ marginTop: 20 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  disabled={gateState === "processing"}
                  onClick={() => handlePay(selectedPlan)}
                  style={{
                    width: "100%",
                    padding: "18px 32px",
                    background: `linear-gradient(135deg, ${PLANS[selectedPlan].accent}22, ${PLANS[selectedPlan].accent}44)`,
                    border: `1px solid ${PLANS[selectedPlan].accent}60`,
                    color: PLANS[selectedPlan].accent,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: gateState === "processing" ? "not-allowed" : "pointer",
                    opacity: gateState === "processing" ? 0.6 : 1,
                    transition: "all 0.2s",
                  }}>
                  {gateState === "processing"
                    ? "OPENING PAYMENT WINDOW..."
                    : `→ ${PLANS[selectedPlan].cta} · ${PLANS[selectedPlan].price}`}
                </motion.button>
              </div>

              <div style={{ marginTop: 14, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
                SECURED BY RAZORPAY · 256-BIT SSL ENCRYPTION · PAYMENTS NEVER STORED ON OUR SERVERS
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
