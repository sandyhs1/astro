"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Star, CheckCircle2 } from "lucide-react";

// ── Razorpay SDK loader (mirrors PaymentGate pattern) ─────────────────────────
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
  userEmail: string;
  onSuccess: (newTotal: number) => void;
}

const PACKS = [
  {
    id:        "boost" as const,
    name:      "Quick Boost",
    credits:   20,
    price:     "₹795",
    priceNote: "one-time",
    icon:      <Zap size={20} />,
    color:     "#6366F1",          // indigo
    bg:        "rgba(99,102,241,0.08)",
    border:    "rgba(99,102,241,0.3)",
    tag:       null,
    perCredit: "₹39.75/credit",
  },
  {
    id:        "power" as const,
    name:      "Power Pack",
    credits:   35,
    price:     "₹1,499",
    priceNote: "one-time",
    icon:      <Star size={20} />,
    color:     "#F59E0B",          // amber
    bg:        "rgba(245,158,11,0.08)",
    border:    "rgba(245,158,11,0.3)",
    tag:       "Best Value",
    perCredit: "₹42.83/credit",
  },
] as const;

type PackId = typeof PACKS[number]["id"];

export default function TopupModal({
  isOpen,
  onClose,
  currentCredits,
  userEmail,
  onSuccess,
}: TopupModalProps) {
  const [selected, setSelected]   = useState<PackId>("boost");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [addedCredits, setAddedCredits] = useState(0);

  const selectedPack = PACKS.find(p => p.id === selected)!;

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    try {
      // 0. Ensure Razorpay SDK is loaded
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        throw new Error("Could not load payment SDK. Please check your internet connection and try again.");
      }

      // 1. Create order
      const orderRes = await fetch("/api/payments/topup-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ pack: selected }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order.");

      // 2. Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const options = {
          key:         orderData.keyId,
          amount:      orderData.amount,
          currency:    orderData.currency,
          order_id:    orderData.orderId,
          name:        "Quantum Karma",
          description: `${orderData.label} — ${orderData.credits} Credits`,
          prefill:     { email: userEmail },
          theme:       { color: "#6366F1" },
          modal:       { ondismiss: () => reject(new Error("Payment cancelled.")) },

          handler: async (response: any) => {
            try {
              // 3. Verify & credit
              const verifyRes = await fetch("/api/payments/topup-verify", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id:   response.razorpay_order_id,
                  razorpay_signature:  response.razorpay_signature,
                  pack:                selected,
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed.");

              setAddedCredits(verifyData.creditsAdded);
              setSucceeded(true);
              onSuccess(verifyData.newTotal);
              resolve();
            } catch (err: any) {
              reject(err);
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", (resp: any) => {
          reject(new Error(resp.error?.description || "Payment failed."));
        });
        rzp.open();
      });

    } catch (err: any) {
      if (err.message !== "Payment cancelled.") {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setError(null);
    setSucceeded(false);
    setAddedCredits(0);
    setSelected("boost");
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="topup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{
            position: "fixed", inset: 0, zIndex: 1200,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
        >
          <motion.div
            key="topup-card"
            initial={{ y: 24, scale: 0.96, opacity: 0 }}
            animate={{ y: 0,  scale: 1,    opacity: 1 }}
            exit={{   y: 24, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 480,
              background: "#fff",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 32px 80px -12px rgba(0,0,0,0.25)",
            }}
          >
            {/* Top accent */}
            <div style={{ height: 4, background: "linear-gradient(90deg, #6366F1, #8B5CF6, #F59E0B)" }} />

            <div style={{ padding: "28px 28px 32px" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.35rem", fontWeight: 700, color: "#111", margin: 0, lineHeight: 1.2 }}>
                    ⚡ Top Up Credits
                  </h2>
                  <p style={{ fontSize: "0.8rem", color: "#666", marginTop: 4 }}>
                    Current balance: <strong style={{ color: "#6366F1" }}>{currentCredits} credits</strong>
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  style={{ width: 32, height: 32, borderRadius: "50%", background: "#F3F3F3", border: "1px solid #E0E0E0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#666", flexShrink: 0 }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Success state */}
              {succeeded ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: "24px 0" }}
                >
                  <CheckCircle2 size={52} style={{ color: "#10B981", margin: "0 auto 16px" }} />
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111", marginBottom: 8 }}>
                    Credits Added!
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#555", marginBottom: 20, lineHeight: 1.6 }}>
                    <strong style={{ color: "#6366F1", fontSize: "1.1rem" }}>+{addedCredits} credits</strong> have been added to your account.<br />
                    New balance: <strong>{currentCredits + addedCredits} credits</strong>
                  </div>
                  <button
                    onClick={handleClose}
                    style={{
                      padding: "12px 32px", borderRadius: 12,
                      background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                      color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.9rem",
                    }}
                  >
                    Continue →
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Pack selector */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    {PACKS.map(pack => (
                      <button
                        key={pack.id}
                        onClick={() => setSelected(pack.id)}
                        style={{
                          padding: "16px 14px",
                          borderRadius: 14,
                          border: `2px solid ${selected === pack.id ? pack.color : "#E5E7EB"}`,
                          background: selected === pack.id ? pack.bg : "#FAFAFA",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.18s",
                          position: "relative",
                        }}
                      >
                        {pack.tag && (
                          <span style={{
                            position: "absolute", top: -10, right: 10,
                            background: pack.color, color: "#fff",
                            fontSize: "9px", fontWeight: 800, padding: "2px 8px",
                            borderRadius: 99, letterSpacing: "0.06em", textTransform: "uppercase",
                          }}>
                            {pack.tag}
                          </span>
                        )}
                        <div style={{ color: pack.color, marginBottom: 8 }}>{pack.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111", marginBottom: 2 }}>{pack.name}</div>
                        <div style={{ fontSize: "1.3rem", fontWeight: 800, color: pack.color, lineHeight: 1, marginBottom: 4 }}>{pack.credits}</div>
                        <div style={{ fontSize: "10px", color: "#888", marginBottom: 8 }}>credits</div>
                        <div style={{ fontWeight: 800, fontSize: "1rem", color: "#111" }}>{pack.price}</div>
                        <div style={{ fontSize: "9px", color: "#999", marginTop: 2 }}>{pack.perCredit}</div>
                      </button>
                    ))}
                  </div>

                  {/* Subscription nudge */}
                  <div style={{
                    background: "#F0F9FF", border: "1px solid #BAE6FD",
                    borderRadius: 10, padding: "10px 14px", marginBottom: 16,
                    fontSize: "11px", color: "#0369A1", lineHeight: 1.6,
                  }}>
                    💡 <strong>Reminder:</strong> Your ₹1,799/month Plan 2 gives 50 credits at ₹36/credit — the best rate. Top-ups are for when you need a little extra this month.
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{
                      background: "#FEF2F2", border: "1px solid #FECACA",
                      borderRadius: 10, padding: "10px 14px", marginBottom: 12,
                      fontSize: "12px", color: "#991B1B",
                    }}>
                      {error}
                    </div>
                  )}

                  {/* CTA */}
                  <motion.button
                    onClick={handleCheckout}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%",
                      padding: "15px",
                      borderRadius: 12,
                      background: loading
                        ? "#D1D5DB"
                        : `linear-gradient(135deg, ${selectedPack.color}, ${selectedPack.color}cc)`,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "background 0.2s",
                    }}
                  >
                    {loading
                      ? "Processing..."
                      : `Pay ${selectedPack.price} · Get ${selectedPack.credits} Credits`}
                  </motion.button>

                  <p style={{ textAlign: "center", fontSize: "10px", color: "#9CA3AF", marginTop: 10 }}>
                    Secured by Razorpay · One-time charge · No subscription created
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
