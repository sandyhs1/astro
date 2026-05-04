"use client";
import { useState, useEffect, useRef } from "react";

// ── helpers ───────────────────────────────────────────────────────────────────
export function fmtTime(iso: string | null | undefined, tz?: string): string {
  if (!iso) return "--:--";
  try {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  } catch { return "--:--"; }
}

export function fmtRange(startIso: string, endIso: string): string {
  return `${fmtTime(startIso)} – ${fmtTime(endIso)}`;
}

export function isNow(startIso: string, endIso: string): boolean {
  const now = Date.now();
  return new Date(startIso).getTime() <= now && now < new Date(endIso).getTime();
}

// ── Live Clock ────────────────────────────────────────────────────────────────
export function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");
  const date = time.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="text-center py-6">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-1">Live Vedic Clock</p>
      <div className="font-black text-white tabular-nums" style={{ fontSize: "clamp(2.5rem, 10vw, 4.5rem)", letterSpacing: "-0.03em" }}>
        {hh}<span className="text-emerald-400 animate-pulse">:</span>{mm}<span className="text-emerald-400 animate-pulse">:</span>{ss}
      </div>
      <p className="text-sm font-semibold text-white/60 mt-1 uppercase tracking-wider">{date}</p>
    </div>
  );
}

// ── Score Ring ────────────────────────────────────────────────────────────────
export function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";
  const r = 28, c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-black text-white drop-shadow-sm">{score}</span>
        <span className="text-[8px] font-bold text-white/60 leading-none">score</span>
      </div>
    </div>
  );
}

// ── Choghadiya Badge ──────────────────────────────────────────────────────────
const CHOG_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  Amrit: { text: "#059669", bg: "#ECFDF5", border: "#6EE7B7" },
  Shubh: { text: "#2563EB", bg: "#EFF6FF", border: "#93C5FD" },
  Labh:  { text: "#7C3AED", bg: "#F5F3FF", border: "#C4B5FD" },
  Chal:  { text: "#6B7280", bg: "#F9FAFB", border: "#D1D5DB" },
  Kaal:  { text: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5" },
  Rog:   { text: "#B91C1C", bg: "#FFF1F2", border: "#FDA4AF" },
  Udveg: { text: "#D97706", bg: "#FFFBEB", border: "#FCD34D" },
};

export function ChogBadge({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const c = CHOG_COLORS[name] || CHOG_COLORS.Chal;
  const px = size === "lg" ? "px-4 py-1.5 text-sm" : "px-2.5 py-0.5 text-[11px]";
  return (
    <span className={`${px} rounded-full font-black border`}
      style={{ color: c.text, background: c.bg, borderColor: c.border }}>
      {name}
    </span>
  );
}

// ── Quality Dot ───────────────────────────────────────────────────────────────
export function QualityLabel({ quality }: { quality: string }) {
  const map: Record<string, [string, string]> = {
    auspicious:   ["text-emerald-700", "Auspicious"],
    inauspicious: ["text-red-600",     "Inauspicious"],
    neutral:      ["text-slate-500",   "Neutral"],
  };
  const [cls, label] = map[quality] || ["text-slate-400", quality];
  return <span className={`text-[10px] font-black uppercase tracking-wide ${cls}`}>{label}</span>;
}

// ── Section Header ────────────────────────────────────────────────────────────
export function SectionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">{emoji}</div>
      <div>
        <h3 className="font-black text-slate-900 text-sm leading-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 font-medium mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Tab Button ────────────────────────────────────────────────────────────────
export function TabBtn({ active, onClick, emoji, label }: { active: boolean; onClick: () => void; emoji: string; label: string }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${
        active ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
      }`}>
      <span>{emoji}</span><span>{label}</span>
    </button>
  );
}
