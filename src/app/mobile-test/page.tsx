"use client";

import Link from "next/link";

const VARIANTS = [
  {
    href: "/mobile-test/v4",
    name: "V4 — Operator Grade",
    tag: "Mercury · Stripe · Linear",
    desc:
      "Financial-app crispness. Charcoal sidebar with white canvas, electric lime accent, tabular numerics, monospace labels. Looks like a tool a professional uses 8 hours a day.",
    palette: ["#0A0A0A", "#FFFFFF", "#84CC16", "#F1F5F9"],
    bg: "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",
    fresh: true,
  },
  {
    href: "/mobile-test/v5",
    name: "V5 — Liquid Glass",
    tag: "iOS 26 · VisionOS · Spatial",
    desc:
      "Heavy frosted-glass panels layered over a slow-drifting gradient mesh. Soft chrome, real depth, refined motion. Apple's current Spatial aesthetic.",
    palette: ["#F472B6", "#A78BFA", "#60A5FA", "#FDE68A"],
    bg: "linear-gradient(135deg,#FFE4E6 0%,#EDE9FE 35%,#DBEAFE 70%,#FEF3C7 100%)",
    fresh: true,
  },
  {
    href: "/mobile-test/v6",
    name: "V6 — Stripe Press Editorial",
    tag: "Magazine · Serif · Asymmetric",
    desc:
      "Cream canvas, deep navy text, single oxblood accent. Display serif hero, asymmetric editorial grid, slow refined motion. Premium publication feel.",
    palette: ["#FAF7F2", "#0E1A33", "#7B0A1F", "#D4C9B7"],
    bg: "linear-gradient(180deg,#FAF7F2 0%,#F1ECE0 100%)",
    fresh: true,
  },
  {
    href: "/mobile-test/v1",
    name: "V1 — Aurora Soft",
    tag: "Calm · Glass · Pastel",
    desc:
      "Soft pastel mesh gradients, glassmorphic cards, generous whitespace. Floating bottom dock on mobile, slim left rail on desktop. Friendly, premium-consumer feel.",
    palette: ["#EEF2FF", "#FCE7F3", "#FEF3C7", "#DBEAFE"],
    bg: "linear-gradient(135deg,#FFF1F2 0%,#EEF2FF 35%,#ECFEFF 70%,#FEF3C7 100%)",
  },
  {
    href: "/mobile-test/v2",
    name: "V2 — Editorial Calm",
    tag: "Linear · Notion · Crisp",
    desc:
      "Pure white surfaces, dense bento grid, single indigo accent. Minimal sans, sharp contrast. Slide-in drawer on mobile, fixed sidebar on desktop. Power-user clean.",
    palette: ["#FFFFFF", "#F8FAFC", "#E0E7FF", "#1E293B"],
    bg: "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",
  },
  {
    href: "/mobile-test/v3",
    name: "V3 — Cosmic Bento",
    tag: "Vibrant · Bold · Story",
    desc:
      "Vibrant gradient bento cards, oversized typography, scroll-snap mobile carousels. Modern consumer app feel. Loud but legible.",
    palette: ["#7C3AED", "#F59E0B", "#EC4899", "#06B6D4"],
    bg: "linear-gradient(135deg,#FAF5FF 0%,#FFF7ED 50%,#ECFEFF 100%)",
  },
];

export default function MobileTestIndexPage() {
  return (
    <div
      className="min-h-screen w-full px-5 py-10 md:px-10 md:py-14"
      style={{
        background:
          "linear-gradient(135deg,#F8FAFC 0%,#EEF2FF 50%,#F0F9FF 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 md:mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600 mb-3">
            Internal · Design Test
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Dashboard Redesign · 3 Variations
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-700 max-w-2xl leading-relaxed">
            Each variation is a complete, mobile-optimised dashboard. All
            light theme, high-contrast, real layout — pick the direction that
            fits the Quantum Karma brand.
          </p>
        </div>

        <div className="grid gap-5 md:gap-6 md:grid-cols-3">
          {VARIANTS.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_2px_20px_-4px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.25)] hover:-translate-y-1 transition-all duration-300"
            >
              {(v as any).fresh && (
                <span className="absolute top-3 right-3 z-10 text-[9px] font-black px-2 py-1 rounded-full bg-slate-900 text-white tracking-[0.18em] uppercase">
                  New
                </span>
              )}
              <div
                className="h-40 md:h-48 w-full relative"
                style={{ background: v.bg }}
              >
                <div className="absolute inset-0 flex items-end p-4 gap-1.5">
                  {v.palette.map((c) => (
                    <span
                      key={c}
                      className="w-7 h-7 rounded-full border border-white/80 shadow"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600 mb-2">
                  {v.tag}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 tracking-tight">
                  {v.name}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {v.desc}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-700 group-hover:gap-3 transition-all">
                  Open preview <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-2">
            How to test on mobile
          </p>
          <p className="text-sm text-amber-900 leading-relaxed">
            Open Chrome DevTools → toggle device toolbar (⌘+Shift+M), pick
            iPhone 15 Pro / Pixel 8, then visit each variation. All three are
            built mobile-first with real touch targets, safe-area padding, and
            high-contrast text per WCAG AA.
          </p>
        </div>
      </div>
    </div>
  );
}
