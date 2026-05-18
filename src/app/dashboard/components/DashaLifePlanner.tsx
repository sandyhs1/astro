"use client";
import { useState, useEffect } from "react";
import { SectionHeader } from "./PanchangUtils";
import { PAL, PLANET_TONE } from "./destiny-theme";

interface DashaData {
  mahadasha: string; mahadashaEnd: string;
  antardasha: string; antardashaEnd: string;
  pratyantar?: string;
  pratyantarStart?: string; pratyantarEnd?: string;
  nextMahadasha?: string;
  nextMahadashaStart?: string; nextMahadashaEnd?: string;
  moonSign: string;
}

const PLANET_KEYWORDS: Record<string, { keywords: string[]; bestFor: string[]; challenges: string[] }> = {
  Sun:     { keywords: ["Authority", "Recognition", "Father", "Government"],          bestFor: ["Leadership roles", "Government jobs", "Public visibility", "Promotions"], challenges: ["Ego conflicts", "Heart/spine health", "Father issues"] },
  Moon:    { keywords: ["Mind", "Emotions", "Mother", "Public", "Travel"],            bestFor: ["Creative work", "Public relations", "Real estate", "Family harmony"], challenges: ["Emotional instability", "Overthinking", "Scattered focus"] },
  Mars:    { keywords: ["Energy", "Ambition", "Courage", "Property", "Siblings"],     bestFor: ["Sports", "Real estate", "Surgery", "Military", "Entrepreneurship"], challenges: ["Aggression", "Accidents", "Conflicts", "Blood pressure"] },
  Mercury: { keywords: ["Communication", "Intelligence", "Trade", "Writing", "Skill"], bestFor: ["Business", "Writing", "Teaching", "Technology", "Commerce"],     challenges: ["Nervous tension", "Overthinking", "Skin issues"] },
  Jupiter: { keywords: ["Wisdom", "Wealth", "Guru", "Children", "Religion"],          bestFor: ["Education", "Spirituality", "Finance", "Marriage", "Wealth building"], challenges: ["Overconfidence", "Weight gain", "Complacency"] },
  Venus:   { keywords: ["Love", "Beauty", "Luxury", "Arts", "Relationships"],         bestFor: ["Marriage", "Art", "Fashion", "Beauty industry", "Relationships"], challenges: ["Indulgence", "Relationship strain", "Overspending"] },
  Saturn:  { keywords: ["Discipline", "Karma", "Delays", "Lessons", "Longevity"],     bestFor: ["Long-term plans", "Research", "Real estate", "Consistent work"], challenges: ["Delays", "Depression", "Isolation", "Chronic illness"] },
  Rahu:    { keywords: ["Ambition", "Foreign", "Technology", "Illusion", "Obsession"], bestFor: ["Technology", "Foreign travel", "Politics", "Mass media", "Innovation"], challenges: ["Obsession", "Deception", "Addiction", "Confusion", "Anxiety"] },
  Ketu:    { keywords: ["Spirituality", "Liberation", "Past life", "Detachment", "Occult"], bestFor: ["Spirituality", "Research", "Healing", "Ancestral work"], challenges: ["Detachment", "Confusion", "Health issues", "Isolation"] },
};

const VIMSHOTTARI_YEARS: Record<string, number> = {
  Sun: 7, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17, Ketu: 7, Venus: 20,
};
const VIMSHOTTARI_SEQ = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

function parseDashaDate(s: string): Date {
  if (!s || s === "—") return new Date(NaN);
  const clean = s.replace("·", "").trim();
  const d = new Date(clean);
  if (!isNaN(d.getTime())) return d;
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const m = clean.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (m) {
    return new Date(+m[3], months[m[2]] ?? 0, +m[1], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
  }
  return new Date(NaN);
}

function fmtDate(d: Date): string {
  if (!d || isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtTime(d: Date): string {
  if (!d || isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function yearsLeft(d: Date): string {
  if (!d || isNaN(d.getTime())) return "";
  const ms = d.getTime() - Date.now();
  if (ms < 0) return "Ended";
  const y = ms / (365.25 * 86400000);
  if (y >= 1) return `${y.toFixed(1)} yrs left`;
  const mo = ms / (30.44 * 86400000);
  if (mo >= 1) return `${Math.round(mo)} mo left`;
  return `${Math.floor(ms / 86400000)} d left`;
}

function ProgressBar({ pct }: { pct: number }) {
  const safe = isNaN(pct) ? 0 : Math.min(100, Math.max(0, pct));
  return (
    <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: PAL.border2 }}>
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${safe}%`, background: PAL.accent }}
      />
    </div>
  );
}

export default function DashaLifePlanner({ profileId }: { profileId: string }) {
  const [data, setData]       = useState<DashaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    fetch(`/api/chart-details?profileId=${profileId}`)
      .then(r => r.json())
      .then(d => {
        if (d.dasha) {
          setData({
            mahadasha:     d.dasha.mahadasha,
            mahadashaEnd:  d.dasha.mahadashaEnd || "",
            antardasha:    d.dasha.antardasha,
            antardashaEnd: d.dasha.antardashaEnd || "",
            pratyantar:    d.dasha.pratyantar || "",
            pratyantarStart: d.dasha.pratyantarStart || "",
            pratyantarEnd:   d.dasha.pratyantarEnd || "",
            nextMahadasha:   d.dasha.nextMahadasha || "",
            nextMahadashaStart: d.dasha.nextMahadashaStart || "",
            nextMahadashaEnd:   d.dasha.nextMahadashaEnd || "",
            moonSign: d.core?.moonSign || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) return (
    <div
      className="rounded-sm py-14 px-6 text-center"
      style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
    >
      <div className="serif-display italic text-[24px] mb-2" style={{ color: PAL.accent }}>
        Consulting the astro-engine…
      </div>
      <p className="serif-text text-[14px] max-w-md mx-auto leading-snug" style={{ color: PAL.ink2 }}>
        Cross-referencing thousands of celestial data points to compute your precise Dasha timeline.
        Please don't close this tab — realtime calculations in progress.
      </p>
      <div className="mt-4 inline-flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent }} />
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.15s" }} />
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.3s" }} />
      </div>
    </div>
  );

  if (!data) return (
    <div
      className="rounded-sm py-14 px-6 text-center"
      style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
    >
      <p className="serif-display italic text-[18px]" style={{ color: PAL.ink2 }}>
        Unable to load Dasha planner.
      </p>
      <p className="serif-text text-[13px] mt-1" style={{ color: PAL.ink3 }}>
        Please check your birth profile and try again.
      </p>
    </div>
  );

  const MD = PLANET_TONE[data.mahadasha] || PLANET_TONE.Saturn;
  const AD = PLANET_TONE[data.antardasha] || PLANET_TONE.Moon;
  const PD = data.pratyantar && data.pratyantar !== "—" ? (PLANET_TONE[data.pratyantar] || null) : null;

  const mdEndDate   = parseDashaDate(data.mahadashaEnd);
  const adEndDate   = parseDashaDate(data.antardashaEnd);
  const pdStartDate = parseDashaDate(data.pratyantarStart || "");
  const pdEndDate   = parseDashaDate(data.pratyantarEnd || "");
  const nextStartDate = parseDashaDate(data.nextMahadashaStart || "");
  const nextEndDate   = parseDashaDate(data.nextMahadashaEnd || "");

  const mdYears  = VIMSHOTTARI_YEARS[data.mahadasha] || 16;
  const mdStart  = !isNaN(mdEndDate.getTime()) ? new Date(mdEndDate.getTime() - mdYears * 365.25 * 86400000) : null;
  const mdPct    = mdStart && !isNaN(mdEndDate.getTime())
    ? ((Date.now() - mdStart.getTime()) / (mdEndDate.getTime() - mdStart.getTime())) * 100
    : 0;

  const adYears  = VIMSHOTTARI_YEARS[data.antardasha] || 1;
  const adDurationMs = ((mdYears * adYears) / 120) * 365.25 * 86400000;
  const adStart  = !isNaN(adEndDate.getTime()) ? new Date(adEndDate.getTime() - adDurationMs) : null;
  const adPct    = adStart && !isNaN(adEndDate.getTime())
    ? ((Date.now() - adStart.getTime()) / adDurationMs) * 100
    : 0;

  const pdPct = pdStartDate && pdEndDate && !isNaN(pdStartDate.getTime()) && !isNaN(pdEndDate.getTime())
    ? ((Date.now() - pdStartDate.getTime()) / (pdEndDate.getTime() - pdStartDate.getTime())) * 100
    : 0;

  const daysToMdEnd = !isNaN(mdEndDate.getTime()) ? (mdEndDate.getTime() - Date.now()) / 86400000 : 999;
  const showBanner  = daysToMdEnd > 0 && daysToMdEnd <= 180;
  const nextMD      = data.nextMahadasha ? PLANET_TONE[data.nextMahadasha] : null;

  const SECTIONS = [
    { key: "md", planet: data.mahadasha, tone: MD, label: "Mahadasha · major", pct: mdPct,
      startDate: mdStart, endDate: mdEndDate, years: mdYears },
    { key: "ad", planet: data.antardasha, tone: AD, label: "Antardasha · minor", pct: adPct,
      startDate: adStart, endDate: adEndDate, years: +(((mdYears * adYears) / 120).toFixed(2)) },
    ...(PD && !isNaN(pdEndDate.getTime()) ? [{
      key: "pd", planet: data.pratyantar!, tone: PD, label: "Pratyantardasha · sub-minor", pct: pdPct,
      startDate: pdStartDate, endDate: pdEndDate,
      years: !isNaN(pdStartDate.getTime()) && !isNaN(pdEndDate.getTime())
        ? +((pdEndDate.getTime() - pdStartDate.getTime()) / (365.25 * 86400000)).toFixed(3) : 0,
    }] : []),
  ];

  return (
    <div className="space-y-5 md:space-y-6">

      {/* ── Anticipation Banner ─────────────────────────────────── */}
      {showBanner && nextMD && (
        <section
          className="rounded-sm overflow-hidden p-5 md:p-6"
          style={{ background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3 flex items-center gap-2" style={{ color: "#E5BFC1" }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: "#E5BFC1" }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#E5BFC1" }} />
            </span>
            Karmic shift · {Math.ceil(daysToMdEnd)} days away
          </p>

          <div className="grid grid-cols-3 items-center gap-4 mb-5">
            <div className="text-center">
              <p className="serif-display text-[28px] md:text-[32px]" style={{ color: MD.ink }}>
                {MD.emoji}
              </p>
              <p className="serif-display text-[15px] md:text-[16px] font-semibold mt-1.5">{data.mahadasha}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mt-1" style={{ color: PAL.paper2 }}>
                Closing
              </p>
            </div>
            <div className="text-center">
              <div className="serif-display italic text-[14px]" style={{ color: PAL.paper2 }}>→</div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mt-1" style={{ color: PAL.paper2 }}>
                Mahadasha ends
              </p>
              <p className="serif-text text-[13px] mt-0.5">{fmtDate(mdEndDate)}</p>
              {fmtTime(mdEndDate) && (
                <p className="serif-display text-[12px] tabular-nums" style={{ color: "#E5BFC1" }}>
                  {fmtTime(mdEndDate)}
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="serif-display text-[28px] md:text-[32px]" style={{ color: nextMD.ink }}>
                {nextMD.emoji}
              </p>
              <p className="serif-display text-[15px] md:text-[16px] font-semibold mt-1.5">{data.nextMahadasha}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mt-1" style={{ color: PAL.paper2 }}>
                Rising
              </p>
            </div>
          </div>

          {!isNaN(nextStartDate.getTime()) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-sm p-3" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.10)` }}>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.paper2 }}>
                  Next dasha starts
                </p>
                <p className="serif-display text-[14px] font-semibold mt-1">{fmtDate(nextStartDate)}</p>
                {fmtTime(nextStartDate) && (
                  <p className="serif-text text-[11px] mt-0.5 tabular-nums" style={{ color: "#E5BFC1" }}>
                    {fmtTime(nextStartDate)}
                  </p>
                )}
              </div>
              <div className="rounded-sm p-3" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.10)` }}>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.paper2 }}>
                  {data.nextMahadasha} ends
                </p>
                <p className="serif-display text-[14px] font-semibold mt-1">{fmtDate(nextEndDate)}</p>
                {fmtTime(nextEndDate) && (
                  <p className="serif-text text-[11px] mt-0.5 tabular-nums" style={{ color: "#E5BFC1" }}>
                    {fmtTime(nextEndDate)}
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="serif-text text-[13px] mt-4 leading-relaxed italic" style={{ color: PAL.paper2 }}>
            The {data.mahadasha} era is closing. Prepare for the {data.nextMahadasha} Mahadasha — a {VIMSHOTTARI_YEARS[data.nextMahadasha || ""]}-year karmic chapter.
          </p>
        </section>
      )}

      <SectionHeader
        emoji="◐"
        title="Dasha life planner"
        subtitle={`Vimshottari Dasha timeline · Moon in ${data.moonSign}`}
      />

      {/* ── Active sections ─────────────────────────────────────── */}
      {SECTIONS.map(sec => {
        const hasStart = sec.startDate && !isNaN(sec.startDate.getTime());
        const hasEnd   = sec.endDate   && !isNaN(sec.endDate.getTime());
        const safePct  = isNaN(sec.pct) ? 0 : Math.min(100, Math.max(0, sec.pct));
        const k = PLANET_KEYWORDS[sec.planet] || PLANET_KEYWORDS.Saturn;
        return (
          <div
            key={sec.key}
            className="rounded-sm overflow-hidden"
            style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
          >
            <button
              className="w-full p-5 md:p-6 text-left"
              onClick={() => setExpanded(expanded === sec.key ? null : sec.key)}
            >
              <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: PAL.accent }}>
                    Active · {sec.label}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="serif-display text-[20px]" style={{ color: sec.tone.ink }}>
                      {sec.tone.emoji}
                    </span>
                    <h3 className="serif-display text-[24px] md:text-[28px] font-semibold tracking-tight leading-none" style={{ color: PAL.ink }}>
                      {sec.planet}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm"
                      style={{ color: PAL.paper, background: sec.tone.ink }}
                    >
                      {safePct.toFixed(0)}% complete
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {k.keywords.slice(0, 3).map(kw => (
                      <span key={kw} className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-sm"
                        style={{ color: sec.tone.ink, background: sec.tone.bg, border: `1px solid ${sec.tone.border}` }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 min-w-[120px]">
                  {hasStart && (
                    <div className="text-right rounded-sm px-3 py-2" style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>Start</p>
                      <p className="serif-display text-[12px] font-semibold mt-0.5" style={{ color: PAL.ink }}>
                        {fmtDate(sec.startDate!)}
                      </p>
                      {fmtTime(sec.startDate!) && (
                        <p className="serif-text text-[10px] tabular-nums" style={{ color: PAL.ink3 }}>
                          {fmtTime(sec.startDate!)}
                        </p>
                      )}
                    </div>
                  )}
                  {hasEnd && (
                    <div className="text-right rounded-sm px-3 py-2" style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>Ends</p>
                      <p className="serif-display text-[12px] font-semibold mt-0.5" style={{ color: PAL.ink }}>
                        {fmtDate(sec.endDate!)}
                      </p>
                      {fmtTime(sec.endDate!) && (
                        <p className="serif-text text-[10px] tabular-nums" style={{ color: PAL.ink3 }}>
                          {fmtTime(sec.endDate!)}
                        </p>
                      )}
                      {yearsLeft(sec.endDate!) && (
                        <p className="serif-text text-[10px] italic mt-0.5" style={{ color: PAL.accent }}>
                          {yearsLeft(sec.endDate!)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <ProgressBar pct={safePct} />
              <div className="flex justify-between mt-2">
                <span className="serif-text text-[10px] italic" style={{ color: PAL.ink3 }}>Began</span>
                <span className="serif-text text-[10px] italic" style={{ color: PAL.ink3 }}>{sec.years} yr period</span>
                <span className="serif-text text-[10px] italic" style={{ color: PAL.ink3 }}>Ends</span>
              </div>

              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mt-3 text-right transition-opacity hover:opacity-70" style={{ color: PAL.accent }}>
                {expanded === sec.key ? "▲ Hide insights" : "▼ Show insights"}
              </p>
            </button>

            {expanded === sec.key && (
              <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-4 pt-4" style={{ borderTop: `1px solid ${PAL.border2}` }}>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2.5" style={{ color: PAL.sage }}>
                    ✓ Best use of this period
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {k.bestFor.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-sm"
                        style={{ background: PAL.sageBg, border: `1px solid #C7D6BB` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: PAL.sage }} />
                        <p className="serif-text text-[12.5px] font-semibold" style={{ color: PAL.ink }}>{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2.5" style={{ color: PAL.gold }}>
                    ⚠ Watch out for
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {k.challenges.map((c, i) => (
                      <span key={i} className="serif-text text-[12px] font-semibold px-2.5 py-1 rounded-sm"
                        style={{ color: PAL.gold, background: PAL.amberBg, border: `1px solid #E1CE9B` }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ── Lifetime Timeline ──────────────────────────────────── */}
      <section className="rounded-sm p-5 md:p-6"
        style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: PAL.accent }}>
          Your lifetime Dasha timeline
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {(() => {
            let startIdx = VIMSHOTTARI_SEQ.indexOf(data.mahadasha);
            if (startIdx === -1) startIdx = 0;
            const ordered = [...VIMSHOTTARI_SEQ.slice(startIdx), ...VIMSHOTTARI_SEQ.slice(0, startIdx)];
            let cursor = mdStart ?? new Date();
            return ordered.map((planet, i) => {
              const t = PLANET_TONE[planet];
              const yrs = VIMSHOTTARI_YEARS[planet];
              const isActive = i === 0;
              const start = cursor;
              const end   = new Date(cursor.getTime() + yrs * 365.25 * 86400000);
              cursor = end;
              return (
                <div
                  key={planet}
                  className="flex items-center gap-3 p-3 rounded-sm transition-opacity"
                  style={{
                    background: t?.bg, border: `1px solid ${isActive ? t.ink : t.border}`,
                    opacity: isActive ? 1 : 0.6,
                    boxShadow: isActive ? `0 4px 16px -6px rgba(14,26,51,0.12)` : "none",
                  }}
                >
                  <span className="serif-display text-[22px]" style={{ color: t?.ink }}>{t?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="serif-display text-[14px] font-semibold tracking-tight leading-none" style={{ color: t?.ink }}>
                      {planet}
                    </p>
                    <p className="serif-text text-[11px] mt-1" style={{ color: PAL.ink2 }}>{yrs} years</p>
                    <p className="serif-text text-[10px] truncate italic" style={{ color: PAL.ink3 }}>
                      {fmtDate(start)} – {fmtDate(end)}
                    </p>
                  </div>
                  {isActive && (
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-sm flex-shrink-0"
                      style={{ background: t?.ink, color: PAL.paper }}
                    >
                      Now
                    </span>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </section>
    </div>
  );
}
