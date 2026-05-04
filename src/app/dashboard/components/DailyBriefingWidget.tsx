"use client";
import { useState, useEffect } from "react";

// ─── Daily Briefing Widget ─────────────────────────────────────────────────
// Compact always-visible strip on the dashboard showing today's Panchang summary
// Fetches from /api/panchang and auto-refreshes every 60s

interface BriefingData {
  score: number;
  panchang: {
    nakshatra: string;
    tithi: { name: string; paksha: string };
    dayChoghadiya: Array<{ name: string; start: string; end: string; quality: string }>;
    nightChoghadiya: Array<{ name: string; start: string; end: string; quality: string }>;
    rahuKaal: { start: string; end: string };
    abhijit: { start: string; end: string };
    sunTimes: { sunrise: string; sunset: string };
  };
  location: string;
}

function fmtT(iso: string) {
  try { return new Date(iso).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true }); }
  catch { return ""; }
}

function msUntil(iso: string) {
  return new Date(iso).getTime() - Date.now();
}

function countdown(ms: number): string {
  if (ms <= 0) return "now";
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m/60)}h ${m%60}m`;
}

const CHOG_COLOR: Record<string, string> = {
  Amrit:"#059669", Shubh:"#2563EB", Labh:"#7C3AED", Chal:"#6B7280",
  Kaal:"#DC2626", Rog:"#B91C1C", Udveg:"#D97706",
};
const SCORE_COLOR = (s: number) => s >= 75 ? "#10B981" : s >= 50 ? "#F59E0B" : "#EF4444";

export default function DailyBriefingWidget({ profileId }: { profileId: string }) {
  const [data, setData]       = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [, forceRender]       = useState(0); // for countdown

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/panchang?profileId=${profileId}`);
        const d = await res.json();
        if (mounted && d.panchang) setData(d);
      } catch { /* silent */ }
      finally { if (mounted) setLoading(false); }
    }
    load();
    const interval = setInterval(load, 60000);
    const tick = setInterval(() => { if (mounted) forceRender(n => n + 1); }, 30000);
    return () => { mounted = false; clearInterval(interval); clearInterval(tick); };
  }, [profileId]);

  if (loading) return (
    <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center gap-3">
      <div className="w-40 h-4 bg-slate-100 rounded animate-pulse" />
      <div className="w-24 h-4 bg-slate-100 rounded animate-pulse" />
    </div>
  );
  if (!data) return null;

  const { panchang: p, score, location } = data;
  const now = Date.now();

  // Find active + next auspicious choghadiya
  const allChog = [...(p.dayChoghadiya || []), ...(p.nightChoghadiya || [])];
  const activeChog = allChog.find(c => new Date(c.start).getTime() <= now && now < new Date(c.end).getTime());
  const nextGood   = allChog.find(c => new Date(c.start).getTime() > now && ["Amrit","Shubh","Labh"].includes(c.name));
  const rahuNow    = new Date(p.rahuKaal.start).getTime() <= now && now < new Date(p.rahuKaal.end).getTime();
  const rahuSoon   = !rahuNow && msUntil(p.rahuKaal.start) > 0 && msUntil(p.rahuKaal.start) < 30 * 60000;

  const scoreColor = SCORE_COLOR(score);

  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-slate-900 to-indigo-950 border-b border-slate-800 px-4 py-3 overflow-x-auto scrollbar-hide shadow-md z-20">
      <div className="flex items-center gap-5 min-w-max">

        {/* Score */}
        <div className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded-lg">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white shadow-sm"
            style={{ background: scoreColor }}>
            {score}
          </div>
          <span className="text-[11px] font-black text-white uppercase tracking-wider">Day Score</span>
        </div>

        <div className="w-px h-5 bg-white/20" />

        {/* Active Choghadiya */}
        {activeChog && (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm" style={{ background: CHOG_COLOR[activeChog.name] || "#9CA3AF" }} />
            <span className="text-[12px] font-black drop-shadow-sm" style={{ color: CHOG_COLOR[activeChog.name] || "#fff" }}>{activeChog.name}</span>
            <span className="text-[11px] font-semibold text-slate-300">until {fmtT(activeChog.end)}</span>
          </div>
        )}

        <div className="w-px h-5 bg-white/20" />

        {/* Next good window */}
        {nextGood && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Next ✦</span>
            <span className="text-[12px] font-black drop-shadow-sm" style={{ color: CHOG_COLOR[nextGood.name] }}>{nextGood.name}</span>
            <span className="text-[11px] font-semibold text-slate-300">in {countdown(msUntil(nextGood.start))}</span>
          </div>
        )}

        <div className="w-px h-5 bg-white/20" />

        {/* Nakshatra */}
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-slate-300">⭐</span>
          <span className="text-[12px] font-bold text-white">{p.nakshatra}</span>
        </div>

        <div className="w-px h-5 bg-white/20" />

        {/* Rahu warning */}
        {(rahuNow || rahuSoon) && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${rahuNow ? "bg-red-600/40 border border-red-500/60" : "bg-amber-500/30 border border-amber-500/50"}`}>
            <span className="text-[11px]">⚠️</span>
            <span className={`text-[12px] font-black tracking-wide ${rahuNow ? "text-red-100" : "text-amber-100"}`}>
              {rahuNow ? `RAHU KAAL UNTIL ${fmtT(p.rahuKaal.end).toUpperCase()}` : `Rahu in ${countdown(msUntil(p.rahuKaal.start))}`}
            </span>
          </div>
        )}

        {/* Abhijit */}
        {msUntil(p.abhijit.end) > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[12px]">👑</span>
            <span className="text-[12px] text-emerald-200 font-bold">
              Abhijit {msUntil(p.abhijit.start) > 0 ? `in ${countdown(msUntil(p.abhijit.start))}` : `until ${fmtT(p.abhijit.end)}`}
            </span>
          </div>
        )}

        <div className="w-px h-5 bg-white/20" />

        {/* Location */}
        <span className="text-[11px] text-slate-400 font-bold tracking-wide">📍 {location?.split(",")[0].toUpperCase()}</span>
      </div>
    </div>
  );

}
