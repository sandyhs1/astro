"use client";

/**
 * ImportantNoteModal — opens from the "Important" link beneath the Oracle
 * chat composer. Hyper-personalized, Gen-Z / Gen-alpha tone explaining the
 * three layers of karma, the role of free will, and that the chart is a
 * mirror — never a cage. Closes with a non-medical-advice disclaimer.
 *
 * Mobile-first: bottom-sheet on phones, centered card on tablet+, tap-out
 * to close, ESC to close, scroll-locked body, safe-area aware.
 *
 * The user's first name is interpolated throughout so the read feels like
 * a private note from a wise friend.
 */

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Heart, ShieldAlert, Sparkles, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  userName?: string | null;
  /** Editorial palette overrides; defaults match the dashboard cream theme */
  palette?: {
    paper?:   string;
    paper2?:  string;
    ink?:     string;
    ink2?:    string;
    ink3?:    string;
    border?:  string;
    border2?: string;
    accent?:  string;
    gold?:    string;
  };
}

const DEFAULT_PALETTE = {
  paper:   "#FAF7F2",
  paper2:  "#F1ECE0",
  ink:     "#0E1A33",
  ink2:    "#3F4F6F",
  ink3:    "#6F7B92",
  border:  "#D4C9B7",
  border2: "#E8E0CE",
  accent:  "#7B0A1F",
  gold:    "#A57C2A",
};

export default function ImportantNoteModal({ open, onClose, userName, palette }: Props) {
  const PAL = { ...DEFAULT_PALETTE, ...(palette ?? {}) };

  // Pull just the first name for warmth; fall back to "you" if missing
  const firstName = (userName ?? "")
    .toString()
    .trim()
    .split(/\s+/)[0]
    .replace(/[^A-Za-z\u00C0-\u017F'-]/g, "")
    .slice(0, 24) || "you";

  // ESC to close + body scroll lock while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
          style={{ background: "rgba(14,26,51,0.55)", backdropFilter: "blur(6px)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="important-note-title"
          data-lenis-prevent
          data-modal-scroll
        >
          <motion.div
            key="sheet"
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{    y: 32, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            // Stop wheel/touch events from bubbling up to the page-level Lenis
            // smooth-scroll instance, which would otherwise hijack the modal scroll.
            // The data-lenis-prevent + data-modal-scroll attributes on this
            // element AND on the backdrop above make Lenis ignore any pointer
            // input that originates inside the modal tree.
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-[640px] sm:mx-4 max-h-[92svh] sm:max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-md shadow-2xl"
            style={{
              background: PAL.paper,
              border: `1px solid ${PAL.border}`,
              paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
            data-lenis-prevent
            data-modal-scroll
          >
            {/* Mobile drag-handle affordance */}
            <div className="sm:hidden flex justify-center pt-3">
              <span className="block h-1 w-10 rounded-full" style={{ background: PAL.border }} />
            </div>

            {/* Sticky close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 h-9 w-9 grid place-items-center rounded-full transition-colors hover:bg-black/5"
              style={{ color: PAL.ink2 }}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="px-5 sm:px-9 pt-4 sm:pt-9 pb-4 sm:pb-6" style={{ borderBottom: `1px solid ${PAL.border2}` }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} style={{ color: PAL.accent }} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
                  Read this once, {firstName}
                </span>
              </div>
              <h2
                id="important-note-title"
                className="text-[24px] sm:text-[34px] leading-[1.1] tracking-tight font-semibold"
                style={{ color: PAL.ink, fontFamily: "var(--font-serif-display, Georgia)" }}
              >
                Your chart is a mirror.<br className="hidden sm:block" /> Not a cage.
              </h2>
              <p className="mt-3 text-[14.5px] sm:text-[15.5px] leading-[1.7]" style={{ color: PAL.ink2 }}>
                Quick truth before you scroll the rest of your life. The way the Oracle speaks to you depends on something most people miss.
              </p>
            </div>

            {/* Body */}
            <div className="px-5 sm:px-9 py-6 sm:py-8 space-y-7">
              {/* Three karmas */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Compass size={13} style={{ color: PAL.gold }} />
                  <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.gold }}>
                    The three layers of karma
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <KarmaCard
                    PAL={PAL}
                    tag="01 — Sanchita"
                    title="Everything you've ever earned"
                    body={`The full vault. Every action across every lifetime your soul has lived. You can't see it. You can't undo it. ${firstName}, this is the storage drive your current life is downloading from.`}
                  />
                  <KarmaCard
                    PAL={PAL}
                    tag="02 — Prarabdha"
                    title="The slice that's already loaded"
                    body={`This is the part that is locked in. Your birth date, your family, your body, the big plot beats. Showing up was non-negotiable. How you respond to it — that's a different layer.`}
                  />
                  <KarmaCard
                    PAL={PAL}
                    tag="03 — Kriyamana"
                    title="What you're writing right now"
                    body={`The choices you make today, this hour, this scroll. Every reaction creates fresh karma that becomes your future. This is where your power actually lives.`}
                  />
                </div>
              </section>

              {/* Free will block */}
              <section
                className="rounded-md p-5 sm:p-6"
                style={{
                  background: PAL.paper2,
                  border: `1px solid ${PAL.border}`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Heart size={13} style={{ color: PAL.accent }} />
                  <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
                    Free will is the plot twist
                  </h3>
                </div>
                <p className="text-[15px] sm:text-[16px] leading-[1.75] mb-3" style={{ color: PAL.ink }}>
                  {firstName}, the chart describes the weather. You're still the one driving the car.
                </p>
                <p className="text-[14.5px] leading-[1.7]" style={{ color: PAL.ink2 }}>
                  Some things in your chart are absolute promises — they will land regardless. Other things are <em>conditional</em> — they only show up if your choices, habits, and energy line up to receive them. A green-light Mahadasha won't deliver if you keep ghosting your own potential. A heavy period won't break you if you walk through it with your eyes open.
                </p>
                <p className="text-[14.5px] leading-[1.7] mt-3" style={{ color: PAL.ink2 }}>
                  The same chart can give two different lives to two different versions of {firstName}. The difference is response.
                </p>
              </section>

              {/* Predestined vs response */}
              <section>
                <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.ink3 }}>
                  Some of it is set. Most of it is response.
                </h3>
                <p className="text-[15px] leading-[1.75] mb-3" style={{ color: PAL.ink }}>
                  Prarabdha — the chunk that's already in motion — explains why some events feel non-negotiable. The flat tire. The breakup that arrived on schedule. The lesson you didn't sign up for.
                </p>
                <p className="text-[14.5px] leading-[1.7]" style={{ color: PAL.ink2 }}>
                  But every reaction you have to that pre-loaded story instantly mints new karma. Lash out, and the same situation ages into something heavier. Sit with it, learn from it, choose softer — and the next round arrives lighter. The chart shows what's pulling at you. You decide who you become while it pulls.
                </p>
              </section>

              {/* Pull-quote */}
              <blockquote
                className="rounded-md py-5 sm:py-6 px-5 sm:px-7 text-center"
                style={{
                  background: "rgba(123,10,31,0.04)",
                  border: `1px solid ${PAL.accent}`,
                }}
              >
                <p
                  className="text-[19px] sm:text-[24px] leading-[1.25] italic"
                  style={{ color: PAL.accent, fontFamily: "var(--font-serif-display, Georgia)" }}
                >
                  "We create our fate and call it destiny."
                </p>
                <p className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.ink3 }}>
                  Read that twice, {firstName}.
                </p>
              </blockquote>

              {/* Planets don't control you */}
              <section>
                <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.ink3 }}>
                  Planets don't run your life
                </h3>
                <p className="text-[15px] leading-[1.75] mb-3" style={{ color: PAL.ink }}>
                  This part is important so we don't lose you to fear-bait astrology. Saturn is not punishing you. Mars is not chasing you. Rahu is not plotting against you.
                </p>
                <p className="text-[14.5px] leading-[1.7]" style={{ color: PAL.ink2 }}>
                  Your birth chart is a snapshot of the energy you walked in with — the patterns, the talents, the rough edges, the gifts. It is a reflection of <strong style={{ color: PAL.ink }}>you</strong>, not a remote control over you. Read it the same way you'd read a really specific personality test that also happens to be terrifyingly accurate. Then keep building.
                </p>
              </section>

              {/* Disclaimer */}
              <section
                className="rounded-md p-5 sm:p-6"
                style={{
                  background: "rgba(165,124,42,0.07)",
                  border: `1px solid ${PAL.gold}`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert size={13} style={{ color: PAL.gold }} />
                  <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.gold }}>
                    Important — please read this
                  </h3>
                </div>
                <p className="text-[13.5px] leading-[1.7] mb-2.5" style={{ color: PAL.ink }}>
                  Quantum Karma offers spiritual and astrological guidance for self-reflection only. Nothing the Oracle, your reports, or any feature on this app produces is medical, legal, financial, psychological, or psychiatric advice. It is not a diagnosis, a prescription, a treatment plan, or a substitute for professional care.
                </p>
                <p className="text-[13px] leading-[1.7] mb-2.5" style={{ color: PAL.ink2 }}>
                  If you are dealing with anything tied to your physical health, mental health, finances, legal situation, or any safety concern, please speak with a licensed and qualified practitioner — a doctor, therapist, financial advisor, lawyer, or other regulated professional in your jurisdiction. If you're in crisis or feel unsafe, contact local emergency services immediately.
                </p>
                <p className="text-[13px] leading-[1.7] mb-2.5" style={{ color: PAL.ink2 }}>
                  Every reading you receive is generated by AI based on the chart data you provide and may be inaccurate, incomplete, or out of date. You are solely responsible for any choice you make in response to a reading, and Quantum Karma, its creators, employees, and affiliates accept no liability for outcomes that follow from your interpretation or use of any content on this platform.
                </p>
                <p className="text-[12.5px] leading-[1.65]" style={{ color: PAL.ink3 }}>
                  Use this app the way you'd use a thoughtful friend's perspective — to think, reflect, and ask better questions. Then go live your life with your eyes open.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div
              className="px-5 sm:px-9 py-4 sm:py-5 flex items-center justify-between gap-3"
              style={{ borderTop: `1px solid ${PAL.border2}`, background: PAL.paper2 }}
            >
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>
                Read · breathe · then ask
              </span>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-sm px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-90"
                style={{ background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }}
              >
                Got it, {firstName}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Small inner card for the three karmas ───────────────────────────── */
function KarmaCard({
  PAL,
  tag,
  title,
  body,
}: {
  PAL: typeof DEFAULT_PALETTE;
  tag:   string;
  title: string;
  body:  string;
}) {
  return (
    <div
      className="rounded-md p-4 sm:p-5"
      style={{ background: PAL.paper, border: `1px solid ${PAL.border2}` }}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: PAL.accent }}>
        {tag}
      </div>
      <h4
        className="text-[16px] sm:text-[18px] font-semibold leading-[1.25] mb-1.5"
        style={{ color: PAL.ink, fontFamily: "var(--font-serif-display, Georgia)" }}
      >
        {title}
      </h4>
      <p className="text-[14px] leading-[1.7]" style={{ color: PAL.ink2 }}>
        {body}
      </p>
    </div>
  );
}
