"use client";
import { useState, useEffect } from "react";
import { PAL, CHOG_TONE, QUALITY_TONE } from "./destiny-theme";

/* ── helpers (unchanged) ──────────────────────────────────────────────────── */
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

/* ── Live Clock — editorial serif numerals on cream paper ────────────────── */
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
    <div className="text-center py-7 md:py-9">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-2" style={{ color: PAL.accent }}>
        Live Vedic Clock
      </p>
      <div
        className="serif-display tabular-nums leading-none"
        style={{
          fontSize: "clamp(2.75rem, 11vw, 5rem)",
          letterSpacing: "-0.04em",
          color: PAL.ink,
          fontWeight: 600,
        }}
      >
        {hh}<span style={{ color: PAL.accent }}>:</span>{mm}<span style={{ color: PAL.accent }}>:</span>{ss}
      </div>
      <p className="serif-text text-[14px] md:text-[15px] mt-2 italic" style={{ color: PAL.ink2 }}>
        {date}
      </p>
    </div>
  );
}

/* ── Score Ring — minimal arc on paper ────────────────────────────────────── */
export function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? "#5A8856" : score >= 50 ? PAL.gold : PAL.rose;
  const r = 28, c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke={PAL.border2} strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="serif-display text-[18px] font-semibold" style={{ color: PAL.ink }}>
          {score}
        </span>
        <span className="text-[8px] font-semibold tracking-[0.18em] leading-none uppercase" style={{ color: PAL.ink3 }}>
          score
        </span>
      </div>
    </div>
  );
}

/* ── Choghadiya Badge ─────────────────────────────────────────────────────── */
export function ChogBadge({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const t = CHOG_TONE[name] || CHOG_TONE.Chal;
  const px = size === "lg" ? "px-3.5 py-1 text-[12px]" : "px-2.5 py-0.5 text-[11px]";
  return (
    <span className={`${px} rounded-sm font-semibold tracking-tight inline-block`}
      style={{ color: t.ink, background: t.bg, border: `1px solid ${t.border}` }}
    >
      {name}
    </span>
  );
}

/* ── Quality dot label ────────────────────────────────────────────────────── */
export function QualityLabel({ quality }: { quality: string }) {
  const t = QUALITY_TONE[quality] || QUALITY_TONE.neutral;
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-[0.16em]"
      style={{ color: t.ink }}
    >
      {t.label}
    </span>
  );
}

/* ── Section Header — editorial number + serif title ──────────────────────── */
export function SectionHeader({
  emoji, title, subtitle,
}: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4 md:mb-5">
      <span
        className="serif-display italic text-[18px] md:text-[22px] leading-none"
        style={{ color: PAL.accent }}
      >
        {emoji}
      </span>
      <div className="min-w-0">
        <h3 className="serif-display text-[18px] md:text-[22px] font-semibold tracking-tight leading-none" style={{ color: PAL.ink }}>
          {title}
        </h3>
        {subtitle && (
          <p className="serif-text text-[12.5px] md:text-[13.5px] mt-1 italic" style={{ color: PAL.ink2 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Tab Button — editorial pill, restrained accent ───────────────────────── */
export function TabBtn({
  active, onClick, emoji, label, highlight = false,
}: { active: boolean; onClick: () => void; emoji: string; label: string; highlight?: boolean }) {
  const baseInactive = highlight
    ? { background: PAL.amberBg, color: PAL.gold, border: `1px solid ${PAL.gold}` }
    : { background: "transparent", color: PAL.ink2, border: `1px solid ${PAL.border}` };
  const baseActive = highlight
    ? { background: PAL.gold, color: PAL.paper, border: `1px solid ${PAL.gold}` }
    : { background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 h-9 px-3.5 md:px-4 rounded-sm text-[12.5px] font-semibold whitespace-nowrap flex-shrink-0 transition-all ${highlight ? "shadow-sm" : ""}`}
      style={active ? baseActive : baseInactive}
      onMouseEnter={(e) => {
        if (!active && !highlight) (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.04)";
      }}
      onMouseLeave={(e) => {
        if (!active && !highlight) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      <span className="text-[13px] leading-none">{emoji}</span>
      <span className="serif-text">{label}</span>
      {highlight && !active && (
        <span className="ml-1 text-[9px] font-bold uppercase tracking-wider" style={{ color: PAL.gold }}>
          ★
        </span>
      )}
    </button>
  );
}
