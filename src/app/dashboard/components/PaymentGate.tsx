"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import emailjs from "@emailjs/browser";

// ─── Types ───────────────────────────────────────────────────────────────────
type PlanType = "plan1" | "plan2";
type GateState =
  | "loading"        // checking payment status
  | "gate"           // unpaid → show plan selection
  | "confirm"        // INR only: pre-checkout step with affordability widget
  | "processing"     // Razorpay/Freemius checkout open
  | "plan1_form"     // Plan 1 paid → show intake form
  | "plan1_success"  // Plan 1 form submitted → final thank you
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

// ─── jQuery loader for Freemius ───────────────────────────────────────────────
function loadjQuery(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).jQuery) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

// ─── Freemius SDK loader ──────────────────────────────────────────────────────
async function loadFreemius(): Promise<boolean> {
  await loadjQuery();
  return new Promise((resolve) => {
    if ((window as any).FS && (window as any).FS.Checkout) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.freemius.com/checkout.min.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Razorpay Affordability SDK loader ────────────────────────────────────────
function loadRazorpayAffordability(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-affordability-script")) { resolve(true); return; }
    const script = document.createElement("script");
    script.id = "razorpay-affordability-script";
    script.src = "https://cdn.razorpay.com/widgets/affordability/affordability.js";
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
    priceUSD: "$79",
    freemiusPlanId: "47400",
    freemiusPricingId: "61717",
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
    label: "Intelligence Dashboard",
    tag: "Premium Sub",
    price: "₹1,799",
    priceUSD: "$39",
    freemiusPlanId: "47401",
    freemiusPricingId: "61718",
    period: "per month",
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
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  // ── Intake form state ──────────────────────────────────────────────────────
  const [intakeForm, setIntakeForm] = useState({
    fullName: "",
    dob: "",
    tob: "",
    pob: "",
    questions: "",
  });
  const [intakeSubmitting, setIntakeSubmitting] = useState(false);
  const [intakeError, setIntakeError] = useState<string | null>(null);
  const [intakeSubmittedName, setIntakeSubmittedName] = useState("");

  // ── On mount: check if user has already paid ───────────────────────────────
  useEffect(() => {
    async function checkPaymentStatus() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setGateState("gate"); return; }

      setUserEmail(user.email ?? "");
      setUserName(user.user_metadata?.full_name ?? user.email ?? "");

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("plan_type, payment_status, credits")
        .eq("id", user.id)
        .single();

      if (!profile || profile.payment_status !== "success") {
        setGateState("gate");
        return;
      }

      if (profile.plan_type === "plan2" || profile.plan_type === "promo") {
        setGateState("open");       // Full access (paid or promo)
      } else if (profile.plan_type === "plan1") {
        // Check if they already submitted the intake form
        try {
          const intakeRes = await fetch("/api/plan1-intake/status");
          if (intakeRes.ok) {
            const intakeData = await intakeRes.json();
            setGateState(intakeData.submitted ? "plan1_success" : "plan1_form");
          } else {
            setGateState("plan1_form");
          }
        } catch {
          setGateState("plan1_form");
        }
      } else {
        setGateState("gate");
      }
    }
    checkPaymentStatus();
  }, []);

  // ── Initialize Affordability Widget on the confirm screen ─────────────────
  // We deliberately do NOT show this on the plan selection (gate) screen.
  // Instead, it renders inside the dedicated pre-checkout confirm step so it
  // never clutters or obstructs the pricing cards.
  useEffect(() => {
    if (currency === "INR" && gateState === "confirm") {
      let isSubscribed = true;
      loadRazorpayAffordability().then((loaded) => {
        if (loaded && (window as any).RazorpayAffordabilitySuite && isSubscribed) {
          const amountStr = PLANS[selectedPlan].price;
          const amountPaise = parseInt(amountStr.replace(/\D/g, '')) * 100;

          const container = document.getElementById("razorpay-affordability-widget");
          if (container) container.innerHTML = '';

          const rzpAffordabilitySuite = new (window as any).RazorpayAffordabilitySuite({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: amountPaise,
          });
          rzpAffordabilitySuite.render();
        }
      });
      return () => { isSubscribed = false; };
    }
  }, [currency, selectedPlan, gateState]);

  // ── Initiate payment ───────────────────────────────────────────────────────
  // For INR: first go to the 'confirm' pre-checkout screen (shows EMI widget).
  // The actual Razorpay checkout only launches when user clicks "Pay Now" there.
  // For USD: goes straight to Freemius checkout overlay.
  async function handleProceed(plan: PlanType) {
    setError(null);
    if (currency === "INR") {
      // Show the confirm/EMI screen instead of directly opening Razorpay
      setGateState("confirm");
      return;
    }
    // USD goes straight through
    handlePay(plan);
  }

  async function handlePay(plan: PlanType) {
    setError(null);
    setGateState("processing");

    // ─── Freemius (USD) Flow ──────────────────────────────────────────────────
    if (currency === "USD") {
      const fsLoaded = await loadFreemius();
      if (!fsLoaded) {
        setError("Failed to load secure payment window. Please check your connection.");
        setGateState("gate");
        return;
      }

      try {
        const configRes = await fetch("/api/freemius/config");
        const configData = await configRes.json();

        if (!configData.productId || !configData.publicKey) {
           throw new Error("Missing payment configuration.");
        }

        const handler = (window as any).FS.Checkout.configure({
            plugin_id: configData.productId,
            plan_id: PLANS[plan].freemiusPlanId,
            public_key: configData.publicKey,
            image: "https://quantumkarma.tech/favicon.ico",
        });

        handler.open({
            name: "Quantum Karma",
            pricing_id: PLANS[plan].freemiusPricingId,
            user_email: userEmail,
            readonly_user: true,
            user_firstname: userName,
            success: async function (response: any) {
                try {
                    const purchaseId = response.purchase?.id || response.license_id || response.purchase?.license_id;
                    const verifyRes = await fetch("/api/payments/freemius-verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ purchaseId, plan }),
                    });
                    const verifyData = await verifyRes.json();
                    
                    if (!verifyRes.ok || !verifyData.success) {
                        setError("Payment verification failed. Please contact support.");
                        setGateState("gate");
                        return;
                    }

                    if (plan === "plan1") {
                        setGateState("plan1_form");
                    } else {
                        setGateState("plan2_success");
                        setTimeout(() => window.location.reload(), 2000);
                    }
                } catch (err) {
                    setError("Verification error. Your payment may have gone through — please contact support.");
                    setGateState("gate");
                }
            },
            cancel: function () {
                setGateState("gate");
            }
        });
      } catch (err: any) {
        setError(err.message ?? "Something went wrong initializing USD payments.");
        setGateState("gate");
      }
      return;
    }

    // ─── Razorpay (INR) Flow ──────────────────────────────────────────────────
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
              setGateState("plan1_form");
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

  // ── Shared form styles ─────────────────────────────────────────────────────
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "9px",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.35)",
    marginBottom: 6,
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 2,
    padding: "11px 14px",
    color: "rgba(255,255,255,0.85)",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "11px",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  };

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

  // ── Intake form submit handler ────────────────────────────────────────────
  async function handleIntakeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIntakeError(null);
    setIntakeSubmitting(true);
    try {
      // ─ Step 1: Save to Supabase (source of truth) ──────────────────────────
      const res = await fetch("/api/plan1-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intakeForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setIntakeError(data.error || "Submission failed. Please try again.");
        return;
      }

      // ─ Step 2: Fire EmailJS to help@quantumkarma.tech ─────────────────────
      // Non-blocking: data is already in Supabase, so email failure is safe.
      const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  || "";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
      const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  || "";

      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(
            serviceId,
            templateId,
            {
              to_email:       "help@quantumkarma.tech",
              user_name:      intakeForm.fullName,
              user_email:     userEmail,
              date_of_birth:  intakeForm.dob      || "Not provided",
              time_of_birth:  intakeForm.tob      || "Not provided",
              place_of_birth: intakeForm.pob      || "Not provided",
              questions:      intakeForm.questions || "No specific questions provided.",
              submission_time: new Date().toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "long",
                timeStyle: "short",
              }),
            },
            publicKey
          );
          console.log("[EmailJS] Intake email sent to help@quantumkarma.tech");
        } catch (emailErr) {
          // Log but don't surface — data is safe in Supabase
          console.error("[EmailJS] Email send failed (non-fatal):", emailErr);
        }
      } else {
        console.warn("[EmailJS] Missing env vars — email not sent (data saved to Supabase).");
      }

      // ─ Step 3: Advance to final thank-you screen ───────────────────────────
      setIntakeSubmittedName(intakeForm.fullName.split(" ")[0]);
      setGateState("plan1_success");
    } catch {
      setIntakeError("Network error. Please try again.");
    } finally {
      setIntakeSubmitting(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // BLURRED DASHBOARD + OVERLAY
  // Shown for: gate (unpaid), processing, plan1_form, plan1_success
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
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "1.5rem 1rem",
        background: "rgba(5,5,7,0.82)",
        backdropFilter: "blur(4px)",
        overflowY: "auto",
      }}>
        <AnimatePresence mode="wait">

          {/* ── PLAN 1 FORM: Intake Form ──────────────────────────────────── */}
          {gateState === "plan1_form" && (
            <motion.div key="plan1-form"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              style={{ width: "100%", maxWidth: 580, marginTop: "2rem", marginBottom: "2rem" }}>

              {/* Top accent bar */}
              <div style={{ height: 2, background: "linear-gradient(90deg,#FF5E3A,#7B61FF,#00E5FF)", marginBottom: 0, borderRadius: "2px 2px 0 0" }} />

              <div style={{
                background: "#0B0B12",
                border: "1px solid rgba(255,94,58,0.25)",
                borderTop: "none",
                padding: "36px 36px 32px",
              }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🙏</div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "#fff", marginBottom: 8 }}>
                    Payment Confirmed. Thank You.
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
                    To prepare your Life Intelligence Report, our senior Vedic astrologer needs<br />
                    your exact birth details and the questions most important to you.
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleIntakeSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* Full Name */}
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={intakeForm.fullName}
                      onChange={e => setIntakeForm(p => ({ ...p, fullName: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>

                  {/* DOB + TOB row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Date of Birth</label>
                      <input
                        type="date"
                        value={intakeForm.dob}
                        onChange={e => setIntakeForm(p => ({ ...p, dob: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Time of Birth</label>
                      <input
                        type="time"
                        value={intakeForm.tob}
                        onChange={e => setIntakeForm(p => ({ ...p, tob: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Place of Birth */}
                  <div>
                    <label style={labelStyle}>Place of Birth</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Maharashtra, India"
                      value={intakeForm.pob}
                      onChange={e => setIntakeForm(p => ({ ...p, pob: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>

                  {/* Questions */}
                  <div>
                    <label style={labelStyle}>Your Specific Questions</label>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
                      What specific areas of life do you want deeply analyzed?
                    </div>
                    <textarea
                      rows={5}
                      placeholder="e.g. Will I get a promotion this year? When will I find the right partner? What is blocking my financial growth?"
                      value={intakeForm.questions}
                      onChange={e => setIntakeForm(p => ({ ...p, questions: e.target.value }))}
                      style={{ ...inputStyle, resize: "vertical", minHeight: 110, lineHeight: 1.6 }}
                    />
                  </div>

                  {/* Error */}
                  {intakeError && (
                    <div style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px",
                      color: "#FF5E3A", padding: "10px 14px",
                      border: "1px solid rgba(255,94,58,0.3)",
                      background: "rgba(255,94,58,0.06)",
                    }}>
                      {intakeError}
                    </div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={intakeSubmitting}
                    whileHover={{ scale: intakeSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      marginTop: 4,
                      width: "100%",
                      padding: "16px 24px",
                      background: intakeSubmitting
                        ? "rgba(255,94,58,0.1)"
                        : "linear-gradient(135deg, rgba(255,94,58,0.2), rgba(255,94,58,0.35))",
                      border: "1px solid rgba(255,94,58,0.5)",
                      color: "#FF5E3A",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      cursor: intakeSubmitting ? "not-allowed" : "pointer",
                      opacity: intakeSubmitting ? 0.6 : 1,
                      transition: "all 0.2s",
                    }}
                  >
                    {intakeSubmitting ? "SUBMITTING..." : "→ SUBMIT MY DETAILS"}
                  </motion.button>

                  <div style={{ textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
                    YOUR REPORT WILL BE SENT TO: <span style={{ color: "rgba(255,255,255,0.4)" }}>{userEmail}</span>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── PLAN 1 FINAL THANK YOU (after form submitted) ─────────────── */}
          {gateState === "plan1_success" && (
            <motion.div key="plan1-success"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                width: "100%", maxWidth: 540, background: "#0B0B12",
                border: "1px solid rgba(255,94,58,0.3)",
                padding: "48px 40px", textAlign: "center",
                marginTop: "4rem",
              }}>
              <div style={{ height: 2, background: "linear-gradient(90deg,#FF5E3A,#7B61FF,#00E5FF)", marginBottom: 36, marginLeft: -40, marginRight: -40 }} />
              <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#fff", marginBottom: 16 }}>
                Thank You{intakeSubmittedName ? `, ${intakeSubmittedName}` : ""}!
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.78rem",
                color: "rgba(255,255,255,0.5)", lineHeight: 2, marginBottom: 32,
              }}>
                Your birth chart will be deeply analyzed by our senior Vedic astrologer.<br />
                A personalized report will be delivered to your email within<br />
                <strong style={{ color: "#FF5E3A", fontSize: "1rem" }}>4–6 business hours.</strong>
              </div>
              <div style={{
                padding: "16px 20px",
                background: "rgba(255,94,58,0.06)",
                border: "1px solid rgba(255,94,58,0.15)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.08em",
                lineHeight: 1.9,
              }}>
                DASHBOARD ACCESS IS NOT INCLUDED WITH THIS PLAN.<br />
                REPORT WILL BE EMAILED TO: <strong style={{ color: "rgba(255,255,255,0.5)" }}>{userEmail}</strong>
              </div>
              <div style={{ marginTop: 24, fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
                Questions? Email us at sandesh@quantumkarma.tech
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

              {/* Currency Selector */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.05)", borderRadius: "30px", padding: "4px" }}>
                  <button 
                    onClick={() => setCurrency("INR")}
                    style={{
                      padding: "8px 24px",
                      borderRadius: "24px",
                      background: currency === "INR" ? "rgba(255,255,255,0.15)" : "transparent",
                      color: currency === "INR" ? "#fff" : "rgba(255,255,255,0.4)",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    INR (₹)
                  </button>
                  <button 
                    onClick={() => setCurrency("USD")}
                    style={{
                      padding: "8px 24px",
                      borderRadius: "24px",
                      background: currency === "USD" ? "rgba(255,255,255,0.15)" : "transparent",
                      color: currency === "USD" ? "#fff" : "rgba(255,255,255,0.4)",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

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
                        <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2rem", color: p.accent }}>
                          {currency === "INR" ? p.price : p.priceUSD}
                        </span>
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
                      {/* Note: Affordability widget is intentionally NOT placed here.
                          It renders on the dedicated confirm screen shown after this step. */}
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Button — for INR shows confirm screen first; USD goes straight to checkout */}
              <div style={{ marginTop: 20 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  disabled={gateState === "processing"}
                  onClick={() => handleProceed(selectedPlan)}
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
                    : `→ ${PLANS[selectedPlan].cta} · ${currency === "INR" ? PLANS[selectedPlan].price : PLANS[selectedPlan].priceUSD}`}
                </motion.button>
              </div>

              {currency === "INR" && selectedPlan === "plan2" && (
                <div style={{ marginTop: 12, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "rgba(0, 229, 255, 0.7)", letterSpacing: "0.05em" }}>
                  * NOTE: YOU CAN CANCEL ANYTIME. THE "2036" EXPIRY SHOWN ON RAZORPAY IS JUST A DEFAULT E-MANDATE REQUIREMENT BY RBI.
                </div>
              )}

              <div style={{ marginTop: 14, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
                SECURED BY {currency === "INR" ? "RAZORPAY" : "FREEMIUS"} · 256-BIT SSL ENCRYPTION · PAYMENTS NEVER STORED ON OUR SERVERS
              </div>
            </motion.div>
          )}

          {/* ── Confirm / Pre-Checkout Screen (INR only) ───────────────────────
              Shows AFTER plan selection, BEFORE the Razorpay popup.
              This is the correct place for the Affordability (EMI) widget. */}
          {gateState === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "24px",
              }}
            >
              <div style={{
                width: "100%", maxWidth: 480,
                background: "#0B0B12",
                border: `1px solid ${PLANS[selectedPlan].accent}40`,
                padding: "36px 32px",
                boxShadow: `0 0 40px ${PLANS[selectedPlan].accent}15`,
              }}>
                {/* Back button */}
                <button
                  onClick={() => setGateState("gate")}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(255,255,255,0.35)", fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px", letterSpacing: "0.1em", marginBottom: 24,
                    padding: 0, textTransform: "uppercase",
                  }}
                >
                  ← Back to Plans
                </button>

                {/* Plan summary */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "0.15em", color: PLANS[selectedPlan].accent, textTransform: "uppercase", marginBottom: 6 }}>
                    {PLANS[selectedPlan].tag}
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.5rem", color: "#fff", marginBottom: 4 }}>
                    {PLANS[selectedPlan].label}
                  </div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "2.2rem", color: PLANS[selectedPlan].accent, fontWeight: 700 }}>
                    {PLANS[selectedPlan].price}
                    <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)", fontFamily: "'IBM Plex Mono', monospace", marginLeft: 8 }}>
                      {PLANS[selectedPlan].period}
                    </span>
                  </div>
                </div>

                {/* Affordability / EMI Widget — white bg so Razorpay's own
                    styling is fully visible against the dark modal */}
                <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px", marginBottom: 28 }}>
                  <div id="razorpay-affordability-widget" />
                </div>

                {/* Pay Now button */}
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handlePay(selectedPlan)}
                  style={{
                    width: "100%",
                    padding: "18px",
                    background: `linear-gradient(135deg, ${PLANS[selectedPlan].accent}33, ${PLANS[selectedPlan].accent}66)`,
                    border: `1px solid ${PLANS[selectedPlan].accent}`,
                    color: PLANS[selectedPlan].accent,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "13px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  → Pay Now · {PLANS[selectedPlan].price}
                </motion.button>

                {selectedPlan === "plan2" && (
                  <div style={{ marginTop: 10, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "rgba(0,229,255,0.6)", letterSpacing: "0.05em" }}>
                    * Cancel anytime. "2036" expiry is an RBI e-mandate default — not a lock-in.
                  </div>
                )}

                <div style={{ marginTop: 14, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
                  SECURED BY RAZORPAY · 256-BIT SSL ENCRYPTION
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
