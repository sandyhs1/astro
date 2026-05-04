"use client";
import { useEffect, useState } from "react";
import { SectionHeader } from "./PanchangUtils";

interface ScoreEntry { score_date: string; score: number; nakshatra?: string; choghadiya?: string; }

const COLOR = (s: number) => s >= 75 ? "#10B981" : s >= 50 ? "#F59E0B" : "#EF4444";
const LABEL = (s: number) => s >= 75 ? "Strong" : s >= 50 ? "Moderate" : "Low";

export default function ScoreHistory({ profileId }: { profileId: string }) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;
    fetch(`/api/day-score?profileId=${profileId}`)
      .then(r => r.json())
      .then(d => setScores(d.scores || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) return <div className="h-32 animate-pulse bg-slate-100 rounded-2xl" />;

  const sorted  = [...scores].sort((a, b) => a.score_date.localeCompare(b.score_date));
  const max     = Math.max(...sorted.map(s => s.score), 1);
  const best    = [...scores].sort((a, b) => b.score - a.score)[0];
  const worst   = [...scores].sort((a, b) => a.score - b.score)[0];
  const avg     = scores.length ? Math.round(scores.reduce((s, e) => s + e.score, 0) / scores.length) : 0;

  return (
    <div className="space-y-4">
      <SectionHeader emoji="📊" title="Auspiciousness History" subtitle="Your daily energy score over the last 30 days" />

      {scores.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          No history yet. Load the Panchang daily to build your score history.
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Average", value: avg, emoji: "📈" },
              { label: "Best Day", value: best?.score ?? 0, sub: best?.score_date, emoji: "🏆" },
              { label: "Days Tracked", value: scores.length, sub: "days", emoji: "📅" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-3 text-center">
                <p className="text-lg mb-1">{stat.emoji}</p>
                <p className="font-black text-slate-900 text-xl" style={ i < 2 ? { color: COLOR(stat.value as number) } : {}}>
                  {stat.value}
                </p>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{stat.label}</p>
                {stat.sub && <p className="text-[10px] text-slate-400">{stat.sub}</p>}
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Score Trend</p>
            <div className="flex items-end gap-1 h-24">
              {sorted.map((entry, i) => {
                const h = Math.round((entry.score / max) * 100);
                const c = COLOR(entry.score);
                const d = new Date(entry.score_date);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10">
                      <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                        {d.toLocaleDateString("en-IN",{month:"short",day:"numeric"})} · {entry.score}
                      </div>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
                    </div>
                    <div className="w-full rounded-t transition-all hover:opacity-80"
                      style={{ height: `${h}%`, minHeight:4, background: c }} />
                    {/* Day label — show every 5th */}
                    {i % 5 === 0 && (
                      <span className="text-[8px] text-slate-300 tabular-nums">{d.getDate()}</span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Y-axis labels */}
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-slate-300">0</span>
              <span className="text-[10px] text-slate-300">50</span>
              <span className="text-[10px] text-slate-300">100</span>
            </div>
          </div>

          {/* Recent scores list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <p className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Recent Days</p>
            <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
              {[...sorted].reverse().slice(0, 15).map((entry, i) => {
                const c = COLOR(entry.score);
                const d = new Date(entry.score_date);
                return (
                  <div key={i} className="flex items-center px-4 py-2.5 gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                      style={{ background: c }}>
                      {entry.score}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {d.toLocaleDateString("en-IN", { weekday:"short", month:"short", day:"numeric" })}
                      </p>
                      {entry.nakshatra && (
                        <p className="text-[11px] text-slate-400">{entry.nakshatra} · {entry.choghadiya || ""}</p>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase" style={{ color: c }}>{LABEL(entry.score)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
