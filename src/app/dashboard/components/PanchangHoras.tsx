"use client";
import { fmtRange, isNow, SectionHeader } from "./PanchangUtils";

const QUALITY_STYLE: Record<string, { bg: string; border: string; label: string; labelColor: string }> = {
  good:    { bg: "#F0FDF4", border: "#86EFAC", label: "GOOD",    labelColor: "#16A34A" },
  bad:     { bg: "#FEF2F2", border: "#FCA5A5", label: "BAD",     labelColor: "#DC2626" },
  neutral: { bg: "#F8FAFC", border: "#E2E8F0", label: "NEUTRAL", labelColor: "#64748B" },
};

const PLANET_COLOR: Record<string, string> = {
  Sun: "#F59E0B", Venus: "#EC4899", Mercury: "#10B981",
  Moon: "#8B5CF6", Saturn: "#6B7280", Jupiter: "#2563EB", Mars: "#EF4444",
};

interface HoraPeriod {
  planet: string; planetEmoji: string; quality: string;
  taskTip: string; start: string; end: string;
}

function HoraCard({ hora }: { hora: HoraPeriod }) {
  const active = isNow(hora.start, hora.end);
  const q = QUALITY_STYLE[hora.quality] || QUALITY_STYLE.neutral;
  const planetColor = PLANET_COLOR[hora.planet] || "#6B7280";

  return (
    <div className={`relative rounded-xl border p-3 transition-all ${active ? "ring-2 ring-amber-400 shadow-md" : ""}`}
      style={{ background: q.bg, borderColor: q.border }}>
      {active && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
          NOW
        </div>
      )}
      <p className="text-[10px] text-slate-400 font-semibold tabular-nums">{fmtRange(hora.start, hora.end)}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="font-black text-sm" style={{ color: planetColor }}>
          {hora.planetEmoji} {hora.planet}
        </p>
        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: q.labelColor, background: q.border + "40" }}>
          {q.label}
        </span>
      </div>
      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">{hora.taskTip}</p>
    </div>
  );
}

export default function PanchangHoras({ horas }: { horas: HoraPeriod[] }) {
  const dayHoras   = horas.slice(0, 12);
  const nightHoras = horas.slice(12, 24);

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
        <SectionHeader emoji="🕐" title="Planetary Horas (24hr Cycle)"
          subtitle="Best for specific tasks: Mercury (Study), Venus (Buying/Luxury), Jupiter (Wealth/Wisdom), Mars (Action/Gym)." />
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(PLANET_COLOR).map(([planet, color]) => (
            <span key={planet} className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border"
              style={{ color, borderColor: color + "40", background: color + "12" }}>
              {planet}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
          ☀️ Day Horas
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {dayHoras.map((h, i) => <HoraCard key={i} hora={h} />)}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
          🌙 Night Horas
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {nightHoras.map((h, i) => <HoraCard key={i} hora={h} />)}
        </div>
      </div>
    </div>
  );
}
