"use client";
import { useState, useEffect } from "react";
import { SectionHeader } from "./PanchangUtils";

interface DashaData {
  mahadasha: string; mahadashaEnd: string;
  antardasha: string; antardashaEnd: string;
  pratyantar?: string;
  pratyantarStart?: string; pratyantarEnd?: string;
  nextMahadasha?: string;
  nextMahadashaStart?: string; nextMahadashaEnd?: string;
  moonSign: string;
}

const PLANET_META: Record<string, { emoji: string; color: string; bg: string; border: string; keywords: string[]; bestFor: string[]; challenges: string[] }> = {
  Sun:     { emoji:"☀️", color:"#D97706", bg:"#FFFBEB", border:"#FDE68A", keywords:["Authority","Recognition","Father","Government"], bestFor:["Leadership roles","Government jobs","Public visibility","Promotions"], challenges:["Ego conflicts","Heart/spine health","Father issues"] },
  Moon:    { emoji:"🌙", color:"#7C3AED", bg:"#F5F3FF", border:"#C4B5FD", keywords:["Mind","Emotions","Mother","Public","Travel"], bestFor:["Creative work","Public relations","Real estate","Family harmony"], challenges:["Emotional instability","Overthinking","Scattered focus"] },
  Mars:    { emoji:"♂️", color:"#DC2626", bg:"#FEF2F2", border:"#FCA5A5", keywords:["Energy","Ambition","Courage","Property","Siblings"], bestFor:["Sports","Real estate","Surgery","Military","Entrepreneurship"], challenges:["Aggression","Accidents","Conflicts","Blood pressure"] },
  Mercury: { emoji:"☿️", color:"#059669", bg:"#ECFDF5", border:"#6EE7B7", keywords:["Communication","Intelligence","Trade","Writing","Skill"], bestFor:["Business","Writing","Teaching","Technology","Commerce"], challenges:["Nervous tension","Overthinking","Skin issues"] },
  Jupiter: { emoji:"♃",  color:"#1D4ED8", bg:"#EFF6FF", border:"#93C5FD", keywords:["Wisdom","Wealth","Guru","Children","Religion"], bestFor:["Education","Spirituality","Finance","Marriage","Wealth building"], challenges:["Overconfidence","Weight gain","Complacency"] },
  Venus:   { emoji:"♀️", color:"#BE185D", bg:"#FDF2F8", border:"#F9A8D4", keywords:["Love","Beauty","Luxury","Arts","Relationships"], bestFor:["Marriage","Art","Fashion","Beauty industry","Relationships"], challenges:["Indulgence","Relationship strain","Overspending"] },
  Saturn:  { emoji:"♄",  color:"#374151", bg:"#F9FAFB", border:"#D1D5DB", keywords:["Discipline","Karma","Delays","Lessons","Longevity"], bestFor:["Long-term plans","Research","Real estate","Consistent work"], challenges:["Delays","Depression","Isolation","Chronic illness"] },
  Rahu:    { emoji:"🐉", color:"#6D28D9", bg:"#F5F3FF", border:"#A78BFA", keywords:["Ambition","Foreign","Technology","Illusion","Obsession"], bestFor:["Technology","Foreign travel","Politics","Mass media","Innovation"], challenges:["Obsession","Deception","Addiction","Confusion","Anxiety"] },
  Ketu:    { emoji:"☄️", color:"#B45309", bg:"#FFFBEB", border:"#FCD34D", keywords:["Spirituality","Liberation","Past life","Detachment","Occult"], bestFor:["Spirituality","Research","Healing","Ancestral work"], challenges:["Detachment","Confusion","Health issues","Isolation"] },
};

const VIMSHOTTARI_YEARS: Record<string, number> = {
  Sun:7, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17, Ketu:7, Venus:20
};
const VIMSHOTTARI_SEQ = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];

/** Parse the formatted string from chart-details API: "12 Aug 2031 14:23" */
function parseDashaDate(s: string): Date {
  if (!s || s === "—") return new Date(NaN);
  const clean = s.replace("·","").trim();
  const d = new Date(clean);
  if (!isNaN(d.getTime())) return d;
  // Manual parse fallback
  const months: Record<string,number> = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const m = clean.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (m) {
    return new Date(+m[3], months[m[2]]??0, +m[1], m[4]?+m[4]:0, m[5]?+m[5]:0);
  }
  return new Date(NaN);
}

function fmtDate(d: Date): string {
  if (!d || isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
}

function fmtTime(d: Date): string {
  if (!d || isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false});
}

function yearsLeft(d: Date): string {
  if (!d || isNaN(d.getTime())) return "";
  const ms = d.getTime() - Date.now();
  if (ms < 0) return "Ended";
  const y = ms / (365.25 * 86400000);
  if (y >= 1) return `${y.toFixed(1)} yrs left`;
  const mo = ms / (30.44 * 86400000);
  if (mo >= 1) return `${Math.round(mo)} mo left`;
  return `${Math.floor(ms/86400000)} d left`;
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const safe = isNaN(pct) ? 0 : Math.min(100, Math.max(0, pct));
  return (
    <div className="w-full h-2 bg-black/8 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000"
        style={{ width:`${safe}%`, background:`linear-gradient(90deg, ${color}cc, ${color})` }} />
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
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50" />
      ))}
    </div>
  );

  if (!data) return (
    <div className="text-center py-16 text-slate-400">
      <p className="text-4xl mb-3">🧘</p>
      <p className="text-sm font-medium">Unable to load Dasha Life Planner. Please check your birth profile.</p>
    </div>
  );

  const MD  = PLANET_META[data.mahadasha]  || PLANET_META.Jupiter;
  const AD  = PLANET_META[data.antardasha] || PLANET_META.Moon;
  const PD  = data.pratyantar && data.pratyantar !== "—" ? (PLANET_META[data.pratyantar] || null) : null;

  // Parse all dates
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

  // Anticipation banner
  const daysToMdEnd = !isNaN(mdEndDate.getTime()) ? (mdEndDate.getTime() - Date.now()) / 86400000 : 999;
  const showBanner  = daysToMdEnd > 0 && daysToMdEnd <= 180;
  const nextMD      = PLANET_META[data.nextMahadasha || ""] || null;

  const SECTIONS = [
    { key:"md", planet:data.mahadasha, meta:MD, label:"Mahadasha (Major)", pct:mdPct,
      startDate:mdStart, endDate:mdEndDate, years:mdYears },
    { key:"ad", planet:data.antardasha, meta:AD, label:"Antardasha (Minor)", pct:adPct,
      startDate:adStart, endDate:adEndDate, years:+(((mdYears*adYears)/120).toFixed(2)) },
    ...(PD && !isNaN(pdEndDate.getTime()) ? [{
      key:"pd", planet:data.pratyantar!, meta:PD, label:"Pratyantardasha (Sub-minor)", pct:pdPct,
      startDate:pdStartDate, endDate:pdEndDate,
      years:!isNaN(pdStartDate.getTime())&&!isNaN(pdEndDate.getTime())
        ? +((pdEndDate.getTime()-pdStartDate.getTime())/(365.25*86400000)).toFixed(3) : 0,
    }] : []),
  ];

  return (
    <div className="space-y-4">

      {/* ─── Anticipation Banner ─────────────────────────────── */}
      {showBanner && nextMD && (
        <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)" }}>
          {/* Glows */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-30 blur-3xl animate-pulse" style={{ background:MD.color }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-30 blur-3xl animate-pulse" style={{ background:nextMD.color, animationDelay:"1.2s" }} />

          <div className="relative z-10 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-3 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              CRITICAL KARMIC SHIFT — {Math.ceil(daysToMdEnd)} DAYS AWAY
            </p>

            {/* Current → Next transition */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-center">
                <p className="text-3xl">{MD.emoji}</p>
                <p className="text-xs font-black text-white mt-1">{data.mahadasha}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Closing</p>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-center w-full gap-1">
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-white/20 to-white/60 rounded-full" />
                  <span className="text-white text-xs font-black">→</span>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-white/60 to-white/20 rounded-full" />
                </div>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest">Mahadasha Ends</p>
                <div className="text-center">
                  <p className="text-xs font-bold text-white">{fmtDate(mdEndDate)}</p>
                  {fmtTime(mdEndDate) && <p className="text-[10px] font-black text-amber-400">{fmtTime(mdEndDate)}</p>}
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl">{nextMD.emoji}</p>
                <p className="text-xs font-black text-white mt-1">{data.nextMahadasha}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Rising</p>
              </div>
            </div>

            {/* Next dasha start/end */}
            {!isNaN(nextStartDate.getTime()) && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white/8 rounded-xl p-3 border border-white/10">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Next Dasha Starts</p>
                  <p className="text-sm font-bold text-white">{fmtDate(nextStartDate)}</p>
                  {fmtTime(nextStartDate) && <p className="text-xs font-black mt-0.5" style={{ color:nextMD.color }}>{fmtTime(nextStartDate)}</p>}
                </div>
                <div className="bg-white/8 rounded-xl p-3 border border-white/10">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{data.nextMahadasha} Dasha Ends</p>
                  <p className="text-sm font-bold text-white">{fmtDate(nextEndDate)}</p>
                  {fmtTime(nextEndDate) && <p className="text-xs font-black mt-0.5" style={{ color:nextMD.color }}>{fmtTime(nextEndDate)}</p>}
                </div>
              </div>
            )}

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              The {data.mahadasha} era is closing. Prepare for the {data.nextMahadasha} Mahadasha — a {VIMSHOTTARI_YEARS[data.nextMahadasha||""]}-year karmic chapter that will reshape your entire destiny matrix.
            </p>
          </div>
        </div>
      )}

      <SectionHeader emoji="🧘" title="Dasha Life Planner"
        subtitle={`Vimshottari Dasha Timeline · Moon in ${data.moonSign}`} />

      {/* ─── Active Dasha Sections ─────────────────────────────── */}
      {SECTIONS.map(sec => {
        const hasStart = sec.startDate && !isNaN(sec.startDate.getTime());
        const hasEnd   = sec.endDate   && !isNaN(sec.endDate.getTime());
        const safePct  = isNaN(sec.pct) ? 0 : Math.min(100, Math.max(0, sec.pct));
        return (
          <div key={sec.key} className="rounded-2xl border overflow-hidden shadow-sm"
            style={{ background:sec.meta.bg, borderColor:sec.meta.border }}>
            <button className="w-full p-4 text-left" onClick={() => setExpanded(expanded===sec.key ? null : sec.key)}>

              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Active {sec.label}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{sec.meta.emoji}</span>
                    <h3 className="font-black text-2xl" style={{ color:sec.meta.color }}>{sec.planet}</h3>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full text-white" style={{ background:sec.meta.color }}>
                      {safePct.toFixed(0)}% COMPLETE
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {sec.meta.keywords.slice(0,3).map(k => (
                      <span key={k} className="text-[10px] font-black px-2 py-0.5 rounded-full border"
                        style={{ color:sec.meta.color, borderColor:sec.meta.color+"40", background:sec.meta.color+"12" }}>
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Precise dates on the right */}
                <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
                  {hasStart && (
                    <div className="text-right bg-white/70 rounded-xl px-3 py-2 border border-slate-200">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Start</p>
                      <p className="text-[11px] font-bold text-slate-700">{fmtDate(sec.startDate!)}</p>
                      {fmtTime(sec.startDate!) && <p className="text-[10px] font-black" style={{ color:sec.meta.color }}>{fmtTime(sec.startDate!)}</p>}
                    </div>
                  )}
                  {hasEnd && (
                    <div className="text-right bg-white/70 rounded-xl px-3 py-2 border border-slate-200">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Ends</p>
                      <p className="text-[11px] font-bold text-slate-700">{fmtDate(sec.endDate!)}</p>
                      {fmtTime(sec.endDate!) && <p className="text-[10px] font-black" style={{ color:sec.meta.color }}>{fmtTime(sec.endDate!)}</p>}
                      {yearsLeft(sec.endDate!) && <p className="text-[9px] text-slate-400">{yearsLeft(sec.endDate!)}</p>}
                    </div>
                  )}
                </div>
              </div>

              <ProgressBar pct={safePct} color={sec.meta.color} />
              <div className="flex justify-between mt-1.5">
                <span className="text-[9px] font-semibold text-slate-400">Began</span>
                <span className="text-[9px] font-semibold text-slate-400">{sec.years} yr period</span>
                <span className="text-[9px] font-semibold text-slate-400">Ends</span>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 text-right">
                {expanded===sec.key ? "▲ Hide" : "▼ Show"} planetary insights
              </p>
            </button>

            {expanded === sec.key && (
              <div className="px-4 pb-5 space-y-3 border-t" style={{ borderColor:sec.meta.border }}>
                <div className="mt-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">✅ Best Use of This Period</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {sec.meta.bestFor.map((b,i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/60 rounded-lg px-2.5 py-1.5 border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:sec.meta.color }} />
                        <p className="text-[11px] text-slate-700 font-semibold">{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">⚠️ Watch Out For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sec.meta.challenges.map((c,i) => (
                      <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ─── Lifetime Timeline ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mt-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
          Your Lifetime Dasha Timeline
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {(() => {
            let startIdx = VIMSHOTTARI_SEQ.indexOf(data.mahadasha);
            if (startIdx === -1) startIdx = 0;
            const ordered = [...VIMSHOTTARI_SEQ.slice(startIdx), ...VIMSHOTTARI_SEQ.slice(0, startIdx)];
            let cursor = mdStart ?? new Date();
            return ordered.map((planet, i) => {
              const m = PLANET_META[planet];
              const yrs = VIMSHOTTARI_YEARS[planet];
              const isActive = i === 0;
              const start = cursor;
              const end   = new Date(cursor.getTime() + yrs * 365.25 * 86400000);
              cursor = end;
              return (
                <div key={planet} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isActive ? "ring-2 ring-indigo-500 shadow-md scale-[1.02]" : "opacity-60 hover:opacity-100"}`}
                  style={{ background:m?.bg, borderColor:m?.border }}>
                  <span className="text-2xl">{m?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-black tracking-wide" style={{ color:m?.color }}>{planet.toUpperCase()}</p>
                    <p className="text-[9px] text-slate-500 font-semibold">{yrs} Years</p>
                    <p className="text-[9px] text-slate-400 truncate">{fmtDate(start)} – {fmtDate(end)}</p>
                  </div>
                  {isActive && (
                    <span className="text-[8px] font-black text-white px-2 py-1 rounded flex-shrink-0" style={{ background:m?.color }}>NOW</span>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
