"use client";
import { fmtRange, isNow, ChogBadge, QualityLabel, SectionHeader } from "./PanchangUtils";
import { PAL, CHOG_TONE } from "./destiny-theme";

interface Props { dayChoghadiya: any[]; nightChoghadiya: any[]; }

function ChogRow({ period }: { period: any }) {
  const active = isNow(period.start, period.end);
  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 transition-colors"
      style={{
        background: active ? PAL.amberBg : "transparent",
        borderTop: `1px solid ${PAL.border2}`,
      }}
    >
      <div className="flex items-center gap-3">
        {active && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: PAL.gold }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: PAL.gold }} />
          </span>
        )}
        <p
          className="serif-text text-[13.5px] tabular-nums font-semibold"
          style={{ color: active ? PAL.ink : PAL.ink2 }}
        >
          {fmtRange(period.start, period.end)}
        </p>
      </div>
      <div className="text-right flex items-center gap-2">
        <QualityLabel quality={period.quality} />
        <ChogBadge name={period.name} />
      </div>
    </div>
  );
}

function ChogPanel({ title, eyebrow, periods }: { title: string; eyebrow: string; periods: any[] }) {
  return (
    <div className="rounded-sm overflow-hidden"
      style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
    >
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${PAL.border2}`, background: PAL.paper2 }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
          {eyebrow}
        </p>
        <h4 className="serif-display text-[16px] md:text-[18px] font-semibold mt-0.5 leading-none" style={{ color: PAL.ink }}>
          {title}
        </h4>
      </div>
      <div>
        {periods.map((period, i) => (
          <ChogRow key={i} period={period} />
        ))}
      </div>
    </div>
  );
}

export default function PanchangChoghadiya({ dayChoghadiya, nightChoghadiya }: Props) {
  return (
    <div className="space-y-5">
      {/* Intro + legend */}
      <div className="rounded-sm p-4 md:p-5"
        style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
      >
        <SectionHeader
          emoji="◷"
          title="Choghadiya · auspicious timings"
          subtitle="Use Amrit / Shubh / Labh for important work. Avoid Udveg / Rog / Kaal for new beginnings."
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {["Amrit", "Shubh", "Labh", "Chal", "Kaal", "Rog", "Udveg"].map(name => {
            const t = CHOG_TONE[name];
            return (
              <span key={name} className="inline-flex items-center gap-1.5 text-[11px]"
                style={{ color: PAL.ink2 }}
              >
                <ChogBadge name={name} />
                <span className="serif-text" style={{ color: PAL.ink3 }}>· {t.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChogPanel title="Day Choghadiya"   eyebrow="Sunrise → Sunset"  periods={dayChoghadiya} />
        <ChogPanel title="Night Choghadiya" eyebrow="Sunset → Sunrise"  periods={nightChoghadiya} />
      </div>
    </div>
  );
}
