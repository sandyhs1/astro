"use client";
import { fmtTime, fmtRange, isNow, LiveClock, ScoreRing, ChogBadge, SectionHeader } from "./PanchangUtils";

interface Props { panchang: any; score: number; location: string; }

const PANCHANG_CARDS = [
  { key: "tithi",     emoji: "🌙", label: "Tithi",     getValue: (p: any) => `${p.tithi.name}`, sub: (p: any) => p.tithi.paksha },
  { key: "nakshatra", emoji: "⭐", label: "Nakshatra", getValue: (p: any) => p.nakshatra,       sub: () => "Moon Asterism"        },
  { key: "yoga",      emoji: "🔗", label: "Yoga",      getValue: (p: any) => p.yoga,            sub: () => "Sun + Moon Yoga"      },
  { key: "lord",      emoji: "👑", label: "Day Lord",  getValue: (p: any) => p.weekdayLord,     sub: () => "Ruling Planet"        },
  { key: "sunrise",   emoji: "🌅", label: "Sunrise",   getValue: (p: any) => fmtTime(p.sunTimes.sunrise),  sub: () => "Local Time", accent: "text-orange-600" },
  { key: "sunset",    emoji: "🌆", label: "Sunset",    getValue: (p: any) => fmtTime(p.sunTimes.sunset),   sub: () => "Local Time", accent: "text-indigo-600" },
];

export default function PanchangToday({ panchang: p, score, location }: Props) {
  const now = Date.now();

  // Find active choghadiya
  const allChog = [...(p.dayChoghadiya || []), ...(p.nightChoghadiya || [])];
  const activeChog = allChog.find((c: any) => isNow(c.start, c.end));
  const nextChog   = allChog.find((c: any) => new Date(c.start).getTime() > now);

  // Is Rahu Kaal now?
  const rahuNow = isNow(p.rahuKaal.start, p.rahuKaal.end);

  return (
    <div className="space-y-4">

      {/* Live Clock */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl overflow-hidden">
        <LiveClock />

        {/* Daily Briefing Banner */}
        <div className="px-4 pb-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-center gap-4">
            <ScoreRing score={score} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Day Success Score</p>
              <p className="text-white font-black text-sm leading-tight">
                {score >= 75 ? "Strong day — act boldly." : score >= 50 ? "Moderate energy — be selective." : "Low tide — conserve and plan."}
              </p>
              {activeChog && (
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[11px] text-white/60 font-semibold">Now:</span>
                  <ChogBadge name={activeChog.name} />
                  {nextChog && <>
                    <span className="text-[11px] text-white/40">→ Next:</span>
                    <ChogBadge name={nextChog.name} />
                    <span className="text-[10px] text-white/40">{fmtTime(nextChog.start)}</span>
                  </>}
                </div>
              )}
            </div>
          </div>

          {/* Avoid row */}
          {rahuNow && (
            <div className="mt-3 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-red-300 text-sm">⚠️</span>
              <p className="text-red-200 text-[12px] font-bold">Rahu Kaal active — avoid new starts until {fmtTime(p.rahuKaal.end)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Panchang Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <SectionHeader emoji="📅" title="Daily Panchang" subtitle={`For ${location}`} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PANCHANG_CARDS.map(card => (
            <div key={card.key} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                {card.emoji} {card.label}
              </p>
              <p className={`font-black text-sm mt-1 ${(card as any).accent || "text-slate-900"}`}>
                {card.getValue(p)}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{card.sub(p)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Special Times */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Rahu Kaal */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-red-600">Rahu Kaal</p>
              <p className="text-[10px] text-red-400">Strictly Avoid New Tasks</p>
            </div>
          </div>
          <p className="font-black text-red-700 text-base">{fmtRange(p.rahuKaal.start, p.rahuKaal.end)}</p>
        </div>

        {/* Abhijit */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">👑</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Abhijit Muhurat</p>
              <p className="text-[10px] text-emerald-500">Most Auspicious Window</p>
            </div>
          </div>
          <p className="font-black text-emerald-700 text-base">{fmtRange(p.abhijit.start, p.abhijit.end)}</p>
        </div>

        {/* Kubera */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💰</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Kubera Time</p>
              <p className="text-[10px] text-amber-500">Best for Finance</p>
            </div>
          </div>
          <p className="font-black text-amber-700 text-base">{fmtRange(p.kubera.start, p.kubera.end)}</p>
        </div>
      </div>

      {/* Yamaganda + Gulik */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">🔻 Yamaganda Kaal</p>
          <p className="font-bold text-slate-700 text-sm">{fmtRange(p.yamaganda.start, p.yamaganda.end)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Avoid travel & surgery</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">🔻 Gulik Kaal</p>
          <p className="font-bold text-slate-700 text-sm">{fmtRange(p.gulikKaal.start, p.gulikKaal.end)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Avoid major decisions</p>
        </div>
      </div>
    </div>
  );
}
