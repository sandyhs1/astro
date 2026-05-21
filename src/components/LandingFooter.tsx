"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/* ─── LEGAL CONTENT — mirrored from landing page ─────────────────────── */
const LEGAL_CONTENT: Record<string, { title: string; body: string }> = {
  terms: {
    title: "Terms of Service",
    body: `Terms of Service — Quantum Karma\nLast updated: 15 February 2026\n\nWelcome. Read this properly. Not because we enjoy legal pages — but because clarity prevents future drama.\n\nBy using this website or purchasing a report from Quantum Karma, you agree to everything written below. If something here feels uncomfortable, don't use the service. No hard feelings. This service is operated from Bangalore, India.\n\n1. What We Actually Provide\nQuantum Karma provides interpretive life-pattern reports based on traditional astrological frameworks combined with analytical processing and human review. We do not provide: guaranteed predictions, miracles, fixes, rituals, remedies, supernatural intervention, or problem-solving for real-world emergencies. You receive interpretation, not control over reality.\n\n2. Eligibility\nYou must be at least 18 years old to purchase.\n\n3. Accuracy of Your Input\nYour report depends entirely on the data you submit. If you enter wrong date, time, or place of birth, you will receive a wrong report. This is not a defect. This is math. We do not refund reports generated from incorrect user input.\n\n4. Payments & Refunds\nAll payments are one-time purchases unless explicitly stated otherwise. Once work begins, effort is spent. Contact us within 7 days at help@soulsync.tech if you believe your report is clearly generic.\n\n5. Delivery Timelines\nStandard delivery: 48–72 hours. Delays may happen due to high order volume or technical interruptions.\n\n6. How You Should Use the Report\nUse it as reflection material. Not as financial instruction, medical direction, legal decision tool, or relationship ultimatum justification.\n\n7. Intellectual Property\nEvery report is licensed to you for personal use only. You may NOT resell, publish publicly, or train AI models on it.\n\n8. Limitation of Liability\nWe are not responsible for decisions you make after reading. The maximum liability we ever carry is the amount you paid us.\n\n9. Disputes\nContact us first at: help@soulsync.tech. Jurisdiction: Bangalore, India.\n\nASTROLOGY IS FOR REFERENCE PURPOSES ONLY. CONSULT MEDICAL/PROFESSIONAL EXPERTS FOR HEALTH-RELATED URGENCIES.`,
  },
  privacy: {
    title: "Privacy Policy",
    body: `Privacy Policy — Quantum Karma\nLast updated: 15 Feb 2026\n\nWe don't like creepy apps. So we built this to avoid becoming one.\n\n1. What Information We Collect\n• Name (can be nickname)\n• Date, time, and place of birth\n• Email address\n• Your stated concern (career, relationship, etc.)\n• Standard website data (IP, device type) to prevent fraud\n• Payment data is processed by third parties — we do not store your card/UPI credentials.\n\n2. How We Use Your Data\nStrictly to generate your chart, structure your report, review it manually, and deliver it. We do not use birth details to advertise to you. We do not sell your data to brokers.\n\n3. About AI / LLM Usage\nWe use language models as tools for structuring reports. They do NOT replace human interpretation. Every report is reviewed by a human before delivery.\n\n4. Data Storage & Security\nYour data is stored securely using access-restricted systems with encryption in transit.\n\n5. We Do Not Sell Personal Data\nOur revenue comes from reports — not from your identity.\n\n6. Your Rights\nRequest a copy, correction, or deletion at help@soulsync.tech.\n\n7. Final Clarity\nWe built Quantum Karma to give perspective — not surveillance.`,
  },
  refunds: {
    title: "Refund Policy",
    body: `Refund Policy — Quantum Karma\nLast updated: 15 February 2026\n\nWe'll be honest with you first: This is not a downloadable movie. Not a subscription you forgot to cancel. Every report we create is made specifically for one person — you. Once we begin work, time, analysis, and review are already invested. Refunds are generally not offered.\n\nWhy Refunds Are Not Encouraged\nThe moment we start preparing your personalized report, the work cannot be "un-done". Default position: No refunds after purchase.\n\nRare Exceptions\nWe may consider a refund only if:\n• The report is clearly unrelated to the details you provided\n• The report was not delivered at all\n• A verified technical failure prevented completion\n\nIn those cases, email us within 7 days at: help@soulsync.tech\n\nWhat Is NOT a Valid Refund Reason\n• You expected different answers\n• You disagree with interpretation\n• The content felt uncomfortable\n• You changed your mind after purchase\n\nOur Real Promise\nIf something feels off, write to us. We'll clarify, explain, and help you understand what the report meant.\n\nClarity first. Always.`,
  },
};

type LegalKey = "terms" | "privacy" | "refunds";

/* ─── INLINE LEGAL MODAL ─────────────────────────────────────────────── */
function InlineLegalModal({ type, onClose }: { type: LegalKey; onClose: () => void }) {
  const { title, body } = LEGAL_CONTENT[type] || { title: "", body: "" };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
        style={{ background: "rgba(5,5,7,0.94)", backdropFilter: "blur(20px)" }}
      >
        <motion.div
          initial={{ y: 20, scale: 0.97, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[680px] flex flex-col overflow-hidden"
          style={{ height: "min(85vh, 700px)", background: "#0B0B12", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="h-[2px] flex-shrink-0" style={{ background: "linear-gradient(90deg,#FF5E3A,#7B61FF)" }} />
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.4rem", color: "#fff" }}>{title}</div>
            <button
              onClick={onClose}
              className="w-[30px] h-[30px] flex items-center justify-center border border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white cursor-pointer transition-colors"
            >
              <X size={12} />
            </button>
          </div>
          <div data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto px-6 py-6 pb-10" style={{ WebkitOverflowScrolling: "touch" }}>
            <p className="font-mono text-xs text-white/40 leading-[2] whitespace-pre-wrap">{body}</p>
            <div className="mt-7 text-center">
              <button
                onClick={onClose}
                className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#FFD700] bg-transparent border-none cursor-pointer"
              >
                [ I Understand & Accept ]
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── INLINE SUPPORT MODAL ───────────────────────────────────────────── */
function InlineSupportModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
        style={{ background: "rgba(5,5,7,0.94)", backdropFilter: "blur(20px)" }}
      >
        <motion.div
          initial={{ y: 20, scale: 0.97, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[440px] relative overflow-hidden"
          style={{ background: "#0a0a0a", border: "1px solid rgba(212,175,55,0.3)", boxShadow: "0 0 40px rgba(212,175,55,0.15)" }}
        >
          <div className="h-[2px] flex-shrink-0" style={{ background: "linear-gradient(90deg,#e6c875,#d4af37,#e6c875)" }} />
          <div className="p-8">
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 bg-transparent border-none text-white/40 hover:text-white cursor-pointer text-lg leading-none"
            >
              ✕
            </button>
            <div className="text-center mb-7">
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.5rem", color: "#d4af37", marginBottom: 6 }}>
                We've Got Your Back
              </div>
              <div className="font-mono text-[10px] text-white/35 tracking-[0.08em]">
                Karma doesn't wait, neither do we.
              </div>
            </div>
            <a
              href="mailto:help@soulsync.tech"
              className="flex items-center gap-3 p-3.5 border border-[rgba(212,175,55,0.25)] mb-2.5 no-underline hover:bg-[rgba(212,175,55,0.08)] transition-colors"
            >
              <div className="w-9 h-9 flex items-center justify-center text-base" style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37" }}>
                ✉
              </div>
              <div>
                <div className="font-mono text-[11px] text-[#d4af37] tracking-[0.08em] mb-0.5">Priority Email Support</div>
                <div className="font-mono text-[10px] text-white/30">help@soulsync.tech</div>
              </div>
            </a>
            <div className="flex items-center gap-3 p-3.5 border border-white/5 opacity-50">
              <div className="w-9 h-9 flex items-center justify-center text-base bg-white/5 text-white/30">💬</div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-white/35 tracking-[0.08em]">WhatsApp & Live Chat</span>
                <span className="font-mono text-[8px] bg-[#d4af37] text-black px-1.5 py-0.5 font-bold">COMING SOON</span>
              </div>
            </div>
            <div className="mt-6 text-center border-t border-white/[0.06] pt-4">
              <div className="font-mono text-[9px] text-[rgba(212,175,55,0.5)] italic">
                "Even the stars occasionally need a reboot."
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── MAIN FOOTER COMPONENT ──────────────────────────────────────────── */
export default function LandingFooter() {
  const [legalType, setLegalType] = useState<LegalKey | null>(null);
  const [showSupport, setShowSupport] = useState(false);

  const linkCls =
    "font-mono text-[10px] text-zinc-500 hover:text-white transition-colors duration-200 tracking-[0.1em] uppercase";
  const btnCls =
    "font-mono text-[10px] text-zinc-500 hover:text-white transition-colors duration-200 tracking-[0.1em] uppercase bg-transparent border-none cursor-pointer p-0";

  return (
    <footer className="border-t border-white/10 py-14 relative bg-[#020205]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Brand + links row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 28 28" aria-hidden="true">
              <circle cx="14" cy="14" r="13" fill="none" stroke="#00E5FF" strokeWidth="1" />
              <polygon points="14,3 25,22 3,22" fill="none" stroke="#7B61FF" strokeWidth="1" />
              <circle cx="14" cy="14" r="3" fill="#FF5E3A" />
            </svg>
            <span className="font-mono text-[10px] text-zinc-600">Quantum Karma · Life Intelligence</span>
          </div>
          {/* Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
            <a href="/about" className={linkCls}>About</a>
            <a href="/compare" className={linkCls}>Compare</a>
            <a href="/reviews" className={linkCls}>Reviews</a>
            <a href="/sample-report" className={linkCls}>Sample Report</a>
            <a href="/roadmap" className={linkCls}>Roadmap</a>
            <a href="/astrology" className={linkCls}>Astrology</a>
            <a href="/our-process" className={linkCls}>Our Process</a>
            <a href="/myths" className={linkCls}>Myths</a>
            <a href="https://quantumkarma.substack.com/" target="_blank" rel="noopener noreferrer" className={linkCls}>Blog ↗</a>
            <a href="/technology" className={linkCls}>Tech</a>
            <button onClick={() => setLegalType("refunds")} className={btnCls}>Refunds</button>
            <button onClick={() => setLegalType("terms")} className={btnCls}>Terms</button>
            <button onClick={() => setLegalType("privacy")} className={btnCls}>Privacy</button>
            <a href="/astrologer/auth" className={btnCls} style={{ textDecoration: "none" }}>Partner Portal</a>
            <button
              onClick={() => setShowSupport(true)}
              className="font-mono text-[10px] tracking-[0.1em] uppercase bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
              style={{
                background: "linear-gradient(90deg,#00E5FF,#7B61FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Support
            </button>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="font-mono text-[10px] text-zinc-600">© 2026 Quantum Karma · v.1</span>
          <button
            onClick={() => setLegalType("refunds")}
            className="font-mono text-[10px] text-zinc-700 hover:text-zinc-500 transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            No refunds on karma. Precision is guaranteed; your ego is not.
          </button>
        </div>
      </div>
      {legalType && <InlineLegalModal type={legalType} onClose={() => setLegalType(null)} />}
      {showSupport && <InlineSupportModal onClose={() => setShowSupport(false)} />}
    </footer>
  );
}
