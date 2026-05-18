"use client";
import { fmtTime, fmtRange, isNow, LiveClock, ScoreRing, ChogBadge, SectionHeader } from "./PanchangUtils";
import { PAL } from "./destiny-theme";

interface Props { panchang: any; score: number; location: string; }

const PANCHANG_CARDS = [
  { key: "tithi",     emoji: "☾", label: "Tithi",     getValue: (p: any) => `${p.tithi.name}`, sub: (p: any) => p.tithi.paksha },
  { key: "nakshatra", emoji: "✦", label: "Nakshatra", getValue: (p: any) => p.nakshatra,       sub: () => "Moon Asterism"        },
  { key: "yoga",      emoji: "✧", label: "Yoga",      getValue: (p: any) => p.yoga,            sub: () => "Sun + Moon Yoga"      },
  { key: "lord",      emoji: "♕", label: "Day Lord",  getValue: (p: any) => p.weekdayLord,     sub: () => "Ruling Planet"        },
  { key: "sunrise",   emoji: "☀︎", label: "Sunrise",   getValue: (p: any) => fmtTime(p.sunTimes.sunrise),  sub: () => "Local Time" },
  { key: "sunset",    emoji: "☽", label: "Sunset",    getValue: (p: any) => fmtTime(p.sunTimes.sunset),   sub: () => "Local Time" },
];

export default function PanchangToday({ panchang: p, score, location }: Props) {
  const now = Date.now();

  const allChog = [...(p.dayChoghadiya || []), ...(p.nightChoghadiya || [])];
  const activeChog = allChog.find((c: any) => isNow(c.start, c.end));
  const nextChog   = allChog.find((c: any) => new Date(c.start).getTime() > now);
  const rahuNow    = isNow(p.rahuKaal.start, p.rahuKaal.end);

  return (
    <div className="space-y-5 md:space-y-6">

      {/* ── Live Clock + Day Score (hero) ───────────────────────── */}
      <section className="rounded-sm overflow-hidden"
        style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
      >
        <LiveClock />

        <div className="px-4 md:px-6 pb-5 md:pb-6 -mt-2">
          <div
            className="rounded-sm p-4 md:p-5 flex items-center gap-4"
            style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
          >
            <ScoreRing score={score} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: PAL.accent }}>
                Day success score
              </p>
              <p className="serif-display text-[16px] md:text-[18px] font-semibold leading-snug" style={{ color: PAL.ink }}>
                {score >= 75
                  ? "Strong day — act boldly."
                  : score >= 50
                  ? "Moderate energy — be selective."
                  : "Low tide — conserve and plan."}
              </p>
              {activeChog && (
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>Now</span>
                  <ChogBadge name={activeChog.name} />
                  {nextChog && (
                    <>
                      <span className="text-[11px]" style={{ color: PAL.ink3 }}>→</span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>Next</span>
                      <ChogBadge name={nextChog.name} />
                      <span className="serif-text text-[11px] tabular-nums" style={{ color: PAL.ink2 }}>
                        {fmtTime(nextChog.start)}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {rahuNow && (
            <div
              className="mt-3 rounded-sm px-4 py-2.5 flex items-center gap-2"
              style={{ background: PAL.roseBg, border: `1px solid ${PAL.border}` }}
            >
              <span style={{ color: PAL.rose }}>⚠︎</span>
              <p className="serif-text text-[13px] font-semibold" style={{ color: PAL.rose }}>
                Rahu Kaal active — avoid new starts until {fmtTime(p.rahuKaal.end)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Panchang Grid ───────────────────────────────────────── */}
      <section
        className="rounded-sm p-5 md:p-6"
        style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
      >
        <SectionHeader emoji="❑" title="Daily Panchang" subtitle={`For ${location || "your location"}`} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PANCHANG_CARDS.map(card => (
            <div
              key={card.key}
              className="rounded-sm p-3.5 md:p-4"
              style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] flex items-center gap-1.5 leading-none" style={{ color: PAL.ink3 }}>
                <span style={{ color: PAL.accent }}>{card.emoji}</span> {card.label}
              </p>
              <p className="serif-display text-[16px] md:text-[18px] font-semibold mt-2 leading-tight" style={{ color: PAL.ink }}>
                {card.getValue(p)}
              </p>
              <p className="serif-text text-[11.5px] mt-1 italic" style={{ color: PAL.ink3 }}>
                {card.sub(p)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Special Times row ───────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SpecialCard
          eyebrow="Avoid · Rahu Kaal"
          subtitle="Avoid new tasks"
          time={fmtRange(p.rahuKaal.start, p.rahuKaal.end)}
          tone="rose"
          symbol="⚠︎"
        />
        <SpecialCard
          eyebrow="Auspicious · Abhijit Muhurat"
          subtitle="Most auspicious window"
          time={fmtRange(p.abhijit.start, p.abhijit.end)}
          tone="sage"
          symbol="✦"
        />
        <SpecialCard
          eyebrow="Wealth · Kubera"
          subtitle="Best for finance"
          time={fmtRange(p.kubera.start, p.kubera.end)}
          tone="gold"
          symbol="✧"
        />
      </section>

      {/* ── Yamaganda + Gulik ───────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SmallTime
          label="Yamaganda Kaal"
          time={fmtRange(p.yamaganda.start, p.yamaganda.end)}
          hint="Avoid travel & surgery"
        />
        <SmallTime
          label="Gulik Kaal"
          time={fmtRange(p.gulikKaal.start, p.gulikKaal.end)}
          hint="Avoid major decisions"
        />
      </section>
    </div>
  );
}

function SpecialCard({ eyebrow, subtitle, time, tone, symbol }: {
  eyebrow: string; subtitle: string; time: string;
  tone: "rose" | "sage" | "gold"; symbol: string;
}) {
  const tones = {
    rose: { bg: PAL.roseBg, border: "#E5BFC1", ink: PAL.rose },
    sage: { bg: PAL.sageBg, border: "#C7D6BB", ink: PAL.sage },
    gold: { bg: PAL.amberBg, border: "#E1CE9B", ink: PAL.gold },
  }[tone];
  return (
    <div className="rounded-sm p-4 md:p-5" style={{ background: tones.bg, border: `1px solid ${tones.border}` }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] leading-none" style={{ color: tones.ink }}>
            {eyebrow}
          </p>
          <p className="serif-text text-[11.5px] mt-1 italic" style={{ color: PAL.ink3 }}>
            {subtitle}
          </p>
        </div>
        <span className="text-[16px] leading-none" style={{ color: tones.ink }}>
          {symbol}
        </span>
      </div>
      <p className="serif-display text-[18px] md:text-[20px] font-semibold tabular-nums" style={{ color: tones.ink }}>
        {time}
      </p>
    </div>
  );
}

function SmallTime({ label, time, hint }: { label: string; time: string; hint: string }) {
  return (
    <div
      className="rounded-sm p-3.5 md:p-4"
      style={{ background: PAL.paper, border: `1px solid ${PAL.border2}` }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>
        {label}
      </p>
      <p className="serif-display text-[15px] md:text-[16px] font-semibold mt-1.5 tabular-nums" style={{ color: PAL.ink }}>
        {time}
      </p>
      <p className="serif-text text-[11.5px] italic mt-1" style={{ color: PAL.ink3 }}>{hint}</p>
    </div>
  );
}
