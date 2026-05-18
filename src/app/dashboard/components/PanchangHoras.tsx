"use client";
import { fmtRange, isNow, SectionHeader } from "./PanchangUtils";
import { PAL, PLANET_TONE, QUALITY_TONE } from "./destiny-theme";

interface HoraPeriod {
  planet: string; planetEmoji: string; quality: string;
  taskTip: string; start: string; end: string;
}

function HoraCard({ hora }: { hora: HoraPeriod }) {
  const active = isNow(hora.start, hora.end);
  const planet = PLANET_TONE[hora.planet] || PLANET_TONE.Saturn;
  const quality = QUALITY_TONE[hora.quality] || QUALITY_TONE.neutral;

  return (
    <div
      className="relative rounded-sm p-3.5 md:p-4 transition-all"
      style={{
        background: PAL.paper,
        border: `1px solid ${active ? PAL.gold : PAL.border2}`,
        boxShadow: active ? "0 4px 16px -6px rgba(165,124,42,0.30)" : "none",
      }}
    >
      {active && (
        <div
          className="absolute -top-2 left-3 text-[9px] font-semibold uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-sm"
          style={{ background: PAL.gold, color: PAL.paper }}
        >
          Now
        </div>
      )}

      <p className="serif-text text-[11.5px] tabular-nums italic" style={{ color: PAL.ink3 }}>
        {fmtRange(hora.start, hora.end)}
      </p>

      <div className="flex items-center justify-between mt-1.5 gap-2">
        <p className="serif-display text-[14.5px] md:text-[15px] font-semibold leading-tight"
          style={{ color: planet.ink }}
        >
          <span className="mr-1.5" style={{ fontFamily: "system-ui" }}>{planet.emoji}</span>
          {hora.planet}
        </p>
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
          style={{ color: quality.ink, background: quality.bg, border: `1px solid ${quality.border}` }}
        >
          {quality.label}
        </span>
      </div>

      <p className="serif-text text-[12px] mt-2 leading-snug" style={{ color: PAL.ink2 }}>
        {hora.taskTip}
      </p>
    </div>
  );
}

export default function PanchangHoras({ horas }: { horas: HoraPeriod[] }) {
  const dayHoras   = horas.slice(0, 12);
  const nightHoras = horas.slice(12, 24);

  return (
    <div className="space-y-5">
      {/* Intro + planet legend */}
      <div className="rounded-sm p-4 md:p-5"
        style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
      >
        <SectionHeader
          emoji="◔"
          title="Planetary Horas · 24-hour cycle"
          subtitle="Best for specific tasks: Mercury (study), Venus (purchase), Jupiter (wealth & wisdom), Mars (action)."
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {Object.entries(PLANET_TONE).map(([planet, t]) => (
            <span
              key={planet}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-sm"
              style={{ color: t.ink, background: t.bg, border: `1px solid ${t.border}` }}
            >
              <span style={{ fontFamily: "system-ui" }}>{t.emoji}</span>
              {planet}
            </span>
          ))}
        </div>
      </div>

      {/* Day Horas */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3 flex items-baseline gap-2" style={{ color: PAL.accent }}>
          <span className="serif-display italic">Day</span>
          <span style={{ color: PAL.ink3 }}>· sunrise to sunset</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {dayHoras.map((h, i) => <HoraCard key={i} hora={h} />)}
        </div>
      </div>

      {/* Night Horas */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3 flex items-baseline gap-2" style={{ color: PAL.accent }}>
          <span className="serif-display italic">Night</span>
          <span style={{ color: PAL.ink3 }}>· sunset to sunrise</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {nightHoras.map((h, i) => <HoraCard key={i} hora={h} />)}
        </div>
      </div>
    </div>
  );
}
