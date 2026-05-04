"use client";
import { fmtRange, isNow, ChogBadge, QualityLabel, SectionHeader } from "./PanchangUtils";

interface Props { dayChoghadiya: any[]; nightChoghadiya: any[]; }

function ChogRow({ period, highlight }: { period: any; highlight: boolean }) {
  const active = isNow(period.start, period.end);
  return (
    <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
      active
        ? "border-amber-300 bg-amber-50 shadow-sm"
        : highlight
        ? `border-transparent`
        : "border-transparent hover:bg-slate-50"
    }`}
      style={active ? {} : { borderColor: "transparent" }}
    >
      <div className="flex items-center gap-3">
        {active && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />}
        <p className={`text-[13px] font-semibold tabular-nums ${active ? "text-amber-800" : "text-slate-600"}`}>
          {fmtRange(period.start, period.end)}
        </p>
      </div>
      <div className="text-right">
        <ChogBadge name={period.name} />
        <div className="mt-0.5">
          <QualityLabel quality={period.quality} />
        </div>
      </div>
    </div>
  );
}

function ChogPanel({ title, emoji, periods, dark }: { title: string; emoji: string; periods: any[]; dark?: boolean }) {
  return (
    <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100 shadow-sm"}`}>
      <div className={`px-4 py-3 border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
        <p className={`font-black text-sm flex items-center gap-2 ${dark ? "text-white" : "text-slate-900"}`}>
          <span>{emoji}</span> {title}
        </p>
      </div>
      <div className={`p-2 divide-y ${dark ? "divide-slate-800" : "divide-slate-50"}`}>
        {periods.map((period, i) => (
          <div key={i} className={dark ? "text-white" : ""}>
            <ChogRow period={period} highlight={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PanchangChoghadiya({ dayChoghadiya, nightChoghadiya }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
        <SectionHeader emoji="⏱️" title="Choghadiya (Auspicious Timings)"
          subtitle="Use Amrit / Shubh / Labh for good work. Avoid Udveg / Rog / Kaal for new beginnings." />
        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {[
            { name: "Amrit", label: "Best" }, { name: "Shubh", label: "Good" },
            { name: "Labh", label: "Gains" }, { name: "Chal", label: "Neutral" },
            { name: "Kaal", label: "Avoid" }, { name: "Rog", label: "Avoid" }, { name: "Udveg", label: "Avoid" },
          ].map(x => (
            <div key={x.name} className="flex items-center gap-1">
              <ChogBadge name={x.name} />
              <span className="text-[10px] text-slate-400">{x.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChogPanel title="Day Choghadiya"   emoji="☀️" periods={dayChoghadiya} />
        <ChogPanel title="Night Choghadiya" emoji="🌙" periods={nightChoghadiya} dark />
      </div>
    </div>
  );
}
