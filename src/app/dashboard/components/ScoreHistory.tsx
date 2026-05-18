"use client";
import { useEffect, useState } from "react";
import { SectionHeader } from "./PanchangUtils";
import { PAL } from "./destiny-theme";

interface ScoreEntry { score_date: string; score: number; nakshatra?: string; choghadiya?: string; }

const COLOR = (s: number) => s >= 75 ? "#5A8856" : s >= 50 ? PAL.gold : PAL.rose;
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

  if (loading) {
    return (
      <div className="rounded-sm h-32 animate-pulse"
        style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
      />
    );
  }

  const sorted = [...scores].sort((a, b) => a.score_date.localeCompare(b.score_date));
  const max = Math.max(...sorted.map(s => s.score), 1);
  const best = [...scores].sort((a, b) => b.score - a.score)[0];
  const avg = scores.length ? Math.round(scores.reduce((s, e) => s + e.score, 0) / scores.length) : 0;

  return (
    <div className="space-y-5">
      <SectionHeader
        emoji="❑"
        title="Auspiciousness history"
        subtitle="Your daily energy score over the last 30 days"
      />

      {scores.length === 0 ? (
        <div
          className="rounded-sm py-12 text-center"
          style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
        >
          <p className="serif-display italic text-[18px]" style={{ color: PAL.ink2 }}>
            No history yet.
          </p>
          <p className="serif-text text-[13.5px] mt-1.5" style={{ color: PAL.ink3 }}>
            Open the Panchang daily to begin building your score history.
          </p>
        </div>
      ) : (
        <>
          {/* Stats — editorial trio */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <StatCard label="Average score" value={avg} sub={LABEL(avg)} color={COLOR(avg)} />
            <StatCard label="Best day" value={best?.score ?? 0} sub={best?.score_date} color={COLOR(best?.score ?? 0)} />
            <StatCard label="Days tracked" value={scores.length} sub="days" color={PAL.ink} />
          </div>

          {/* Bar chart */}
          <div className="rounded-sm p-5 md:p-6"
            style={{ background: PAL.paper, border: `1px solid ${PAL.border2}` }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: PAL.accent }}>
              Score trend · last {sorted.length} days
            </p>
            <div className="flex items-end gap-1 h-32">
              {sorted.map((entry, i) => {
                const h = Math.round((entry.score / max) * 100);
                const c = COLOR(entry.score);
                const d = new Date(entry.score_date);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* tooltip */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10">
                      <div
                        className="serif-text text-[11px] tabular-nums px-2 py-1 rounded-sm whitespace-nowrap"
                        style={{ background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }}
                      >
                        {d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })} · {entry.score}
                      </div>
                    </div>
                    <div
                      className="w-full rounded-t-[2px] transition-opacity group-hover:opacity-80"
                      style={{ height: `${h}%`, minHeight: 4, background: c }}
                    />
                    {i % 5 === 0 && (
                      <span className="serif-text text-[10px] tabular-nums" style={{ color: PAL.ink3 }}>
                        {d.getDate()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 pt-2" style={{ borderTop: `1px solid ${PAL.border2}` }}>
              <span className="serif-text text-[10px] tabular-nums italic" style={{ color: PAL.ink3 }}>0</span>
              <span className="serif-text text-[10px] tabular-nums italic" style={{ color: PAL.ink3 }}>50</span>
              <span className="serif-text text-[10px] tabular-nums italic" style={{ color: PAL.ink3 }}>100</span>
            </div>
          </div>

          {/* Recent scores list */}
          <div className="rounded-sm overflow-hidden"
            style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
          >
            <p className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: PAL.accent, borderBottom: `1px solid ${PAL.border2}`, background: PAL.paper2 }}
            >
              Recent days
            </p>
            <ul className="max-h-72 overflow-y-auto custom-scroll-light">
              {[...sorted].reverse().slice(0, 15).map((entry, i, arr) => {
                const c = COLOR(entry.score);
                const d = new Date(entry.score_date);
                return (
                  <li
                    key={i}
                    className="flex items-center px-5 py-3 gap-4"
                    style={{ borderTop: i === 0 ? "none" : `1px solid ${PAL.border2}` }}
                  >
                    <div
                      className="w-12 h-12 rounded-sm grid place-items-center serif-display text-[16px] font-semibold tabular-nums flex-shrink-0"
                      style={{ background: c, color: PAL.paper }}
                    >
                      {entry.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="serif-display text-[15px] font-semibold leading-none" style={{ color: PAL.ink }}>
                        {d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                      </p>
                      {entry.nakshatra && (
                        <p className="serif-text text-[12px] mt-1.5 italic" style={{ color: PAL.ink3 }}>
                          {entry.nakshatra}{entry.choghadiya ? ` · ${entry.choghadiya}` : ""}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: c }}
                    >
                      {LABEL(entry.score)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div
      className="rounded-sm p-4 md:p-5 text-center"
      style={{ background: PAL.paper, border: `1px solid ${PAL.border2}` }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>
        {label}
      </p>
      <p className="serif-display text-[28px] md:text-[36px] font-semibold mt-1.5 leading-none tabular-nums" style={{ color }}>
        {value}
      </p>
      {sub && (
        <p className="serif-text text-[11.5px] mt-1.5 italic" style={{ color: PAL.ink3 }}>
          {sub}
        </p>
      )}
    </div>
  );
}
