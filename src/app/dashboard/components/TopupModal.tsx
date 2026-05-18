"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PAL } from "./destiny-theme";

/* ── Razorpay SDK loader (mirrors PaymentGate pattern) ───────────────────── */
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

type PackId = "boost" | "power";

interface PackDef {
  id: PackId;
  name: string;
  credits: number;
  price: string;
  symbol: string;
  tone: { ink: string; bg: string; border: string };
  tag?: string;
  perCredit: string;
}

const PACKS: PackDef[] = [
  {
    id:        "boost",
    name:      "Quick Boost",
    credits:   20,
    price:     "₹795",
    symbol:    "✦",
    tone:      { ink: "#1F4F7A", bg: "#E5EEF6", border: "#BCD0E1" },
    perCredit: "₹39.75 / credit",
  },
  {
    id:        "power",
    name:      "Power Pack",
    credits:   35,
    price:     "₹1,499",
    symbol:    "◆",
    tone:      { ink: PAL.gold, bg: PAL.amberBg, border: "#E1CE9B" },
    tag:       "Best value",
    perCredit: "₹42.83 / credit",
  },
];

export default function TopupModal({
  isOpen, onClose, currentCredits, userEmail, onSuccess,
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
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        throw new Error("Could not load payment SDK. Please check your internet connection and try again.");
      }

      const orderRes = await fetch("/api/payments/topup-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ pack: selected }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order.");

      await new Promise<void>((resolve, reject) => {
        const options = {
          key:         orderData.keyId,
          amount:      orderData.amount,
          currency:    orderData.currency,
          order_id:    orderData.orderId,
          name:        "Quantum Karma",
          description: `${orderData.label} — ${orderData.credits} Credits`,
          prefill:     { email: userEmail },
          theme:       { color: PAL.accent },
          modal:       { ondismiss: () => reject(new Error("Payment cancelled.")) },
          handler: async (response: any) => {
            try {
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
          className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{
            background: "rgba(14,26,51,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          {/* Inline serif fallback in case the modal renders outside the dashboard shell */}
          <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap');
            .serif-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; font-feature-settings: 'ss01','liga'; letter-spacing: -0.02em; }
            .serif-text    { font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif; }
          `}} />

          <motion.div
            key="topup-card"
            initial={{ y: 24, scale: 0.96, opacity: 0 }}
            animate={{ y: 0,  scale: 1,    opacity: 1 }}
            exit={{   y: 24, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-sm overflow-hidden shadow-2xl"
            style={{
              background: PAL.paper,
              border: `1px solid ${PAL.border}`,
            }}
          >
            {/* ── Header ─────────────────────────────────────────────── */}
            <div
              className="px-5 sm:px-7 pt-6 pb-4 flex items-start justify-between gap-3"
              style={{ background: PAL.paper2, borderBottom: `1px solid ${PAL.border2}` }}
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
                  ⚡ Top up · credits
                </p>
                <h2 className="serif-display text-[20px] md:text-[24px] font-semibold tracking-tight leading-none mt-1.5" style={{ color: PAL.ink }}>
                  Refill your karma engine.
                </h2>
                <p className="serif-text italic text-[13px] mt-2" style={{ color: PAL.ink2 }}>
                  Current balance ·{' '}
                  <span className="font-semibold tabular-nums not-italic" style={{ color: PAL.ink }}>
                    {currentCredits} credits
                  </span>
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="h-8 w-8 grid place-items-center rounded-sm transition-colors flex-shrink-0 disabled:opacity-40"
                style={{ background: PAL.paper, color: PAL.ink2, border: `1px solid ${PAL.border}` }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = PAL.paper; }}
                aria-label="Close"
              >
                <span className="text-[16px] leading-none">×</span>
              </button>
            </div>

            <div className="px-5 sm:px-7 py-6">
              {/* ── Success state ─────────────────────────────────── */}
              {succeeded ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-2"
                >
                  <div
                    className="w-16 h-16 rounded-sm grid place-items-center mx-auto mb-5 serif-display text-[28px]"
                    style={{ background: PAL.sageBg, color: PAL.sage, border: `1px solid #C7D6BB` }}
                  >
                    ✓
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: PAL.sage }}>
                    Credits added
                  </p>
                  <h3 className="serif-display text-[24px] md:text-[28px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
                    +{addedCredits} credits
                  </h3>
                  <p className="serif-text text-[14px] mt-3 leading-relaxed" style={{ color: PAL.ink2 }}>
                    They&apos;ve been added to your account. New balance ·{' '}
                    <strong style={{ color: PAL.ink }}>{currentCredits + addedCredits} credits</strong>
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 serif-text text-[13px] font-semibold px-6 py-3 rounded-sm text-white transition-opacity hover:opacity-90"
                    style={{ background: PAL.accent }}
                  >
                    Continue →
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* ── Pack selector ─────────────────────────────── */}
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.accent }}>
                    Pick a pack
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {PACKS.map(pack => {
                      const isActive = selected === pack.id;
                      return (
                        <button
                          key={pack.id}
                          onClick={() => setSelected(pack.id)}
                          className="relative text-left p-4 rounded-sm transition-all"
                          style={
                            isActive
                              ? { background: pack.tone.bg, border: `1px solid ${pack.tone.ink}`, boxShadow: `0 4px 14px -4px rgba(14,26,51,0.10)` }
                              : { background: PAL.paper, border: `1px solid ${PAL.border}` }
                          }
                          onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.borderColor = PAL.ink3; }}
                          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.borderColor = PAL.border; }}
                        >
                          {pack.tag && (
                            <span
                              className="absolute -top-2 right-3 text-[9px] font-semibold uppercase tracking-[0.22em] px-1.5 py-0.5 rounded-sm"
                              style={{ background: pack.tone.ink, color: PAL.paper, border: `1px solid ${pack.tone.ink}` }}
                            >
                              {pack.tag}
                            </span>
                          )}

                          <span className="serif-display text-[18px] block leading-none" style={{ color: pack.tone.ink }}>
                            {pack.symbol}
                          </span>

                          <p className="serif-display text-[14px] font-semibold tracking-tight mt-2.5" style={{ color: PAL.ink }}>
                            {pack.name}
                          </p>

                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="serif-display text-[26px] font-semibold tabular-nums leading-none tracking-tight" style={{ color: pack.tone.ink }}>
                              {pack.credits}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: PAL.ink3 }}>
                              credits
                            </span>
                          </div>

                          <p className="serif-display text-[15px] font-semibold mt-2 tabular-nums" style={{ color: PAL.ink }}>
                            {pack.price}
                          </p>
                          <p className="serif-text italic text-[11px] mt-0.5" style={{ color: PAL.ink3 }}>
                            {pack.perCredit}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* ── Subscription nudge ────────────────────────── */}
                  <div
                    className="rounded-sm px-4 py-3 mb-4"
                    style={{ background: "#E5EEF6", border: `1px solid #BCD0E1` }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: "#1F4F7A" }}>
                      ◆ Reminder
                    </p>
                    <p className="serif-text text-[12.5px] leading-relaxed" style={{ color: "#1F4F7A" }}>
                      Your <strong>₹1,799/month plan</strong> gives 50 credits at ₹36 / credit — the best rate. Top-ups are for when you need a little extra this cycle.
                    </p>
                  </div>

                  {/* ── Error ─────────────────────────────────────── */}
                  {error && (
                    <div
                      className="rounded-sm px-4 py-3 mb-4 serif-text text-[12.5px] leading-relaxed"
                      style={{ background: PAL.roseBg, color: PAL.rose, border: `1px solid #E5BFC1` }}
                    >
                      {error}
                    </div>
                  )}

                  {/* ── CTA ───────────────────────────────────────── */}
                  <motion.button
                    onClick={handleCheckout}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.005 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full serif-text text-[14px] font-semibold py-3.5 rounded-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: PAL.accent }}
                  >
                    {loading
                      ? "Processing…"
                      : `Pay ${selectedPack.price} · get ${selectedPack.credits} credits`}
                  </motion.button>

                  <p className="serif-text italic text-[11px] mt-3 text-center" style={{ color: PAL.ink3 }}>
                    🔒 Secured by Razorpay · one-time charge · no subscription created
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
