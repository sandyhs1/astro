"use client";
import { useState, useEffect } from "react";
import { SectionHeader } from "./PanchangUtils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface DashaData {
  mahadasha: string; mahadashaEnd: string;
  antardasha: string; antardashaEnd: string;
  pratyantardasha?: string;
  moonSign: string;
  allMahadashas?: Array<{ lord: string; start: string; end: string; years: number }>;
}

// ── Planet Data ───────────────────────────────────────────────────────────────
const PLANET_META: Record<string, {
  emoji: string; color: string; bg: string; border: string;
  keywords: string[]; bestFor: string[]; challenges: string[];
  affirmation: string;
}> = {
  Sun:     { emoji:"☀️",  color:"#F59E0B", bg:"#FFFBEB", border:"#FDE68A",
    keywords:["Authority","Recognition","Father","Government"],
    bestFor:["Leadership","Promotions","Government jobs","Public visibility"],
    challenges:["Ego conflicts","Health issues (heart/spine)","Father issues"],
    affirmation:"I shine with purpose and lead with dignity." },
  Moon:    { emoji:"🌙",  color:"#8B5CF6", bg:"#F5F3FF", border:"#C4B5FD",
    keywords:["Mind","Emotions","Mother","Public","Travel"],
    bestFor:["Creative work","Public relations","Real estate","Family"],
    challenges:["Emotional instability","Overthinking","Mind scattered"],
    affirmation:"My mind is calm, my intuition is sharp." },
  Mars:    { emoji:"♂️",  color:"#EF4444", bg:"#FEF2F2", border:"#FCA5A5",
    keywords:["Energy","Ambition","Courage","Property","Siblings"],
    bestFor:["Sports","Real estate","Surgery","Military","Starting businesses"],
    challenges:["Aggression","Accidents","Conflicts","Blood pressure"],
    affirmation:"I channel my fire into focused, constructive action." },
  Mercury: { emoji:"☿️",  color:"#10B981", bg:"#ECFDF5", border:"#6EE7B7",
    keywords:["Communication","Intelligence","Trade","Writing","Skill"],
    bestFor:["Business","Writing","Teaching","Technology","Commerce"],
    challenges:["Nervous tension","Overthinking","Skin issues"],
    affirmation:"My mind is sharp, my words create opportunities." },
  Jupiter: { emoji:"♃",   color:"#2563EB", bg:"#EFF6FF", border:"#93C5FD",
    keywords:["Wisdom","Wealth","Guru","Children","Religion","Expansion"],
    bestFor:["Education","Spirituality","Finance","Marriage","Wealth building"],
    challenges:["Overconfidence","Weight gain","Complacency"],
    affirmation:"I expand in wisdom, wealth, and divine blessings." },
  Venus:   { emoji:"♀️",  color:"#EC4899", bg:"#FDF2F8", border:"#F9A8D4",
    keywords:["Love","Beauty","Luxury","Arts","Relationships","Pleasure"],
    bestFor:["Marriage","Art","Fashion","Beauty industry","Relationships"],
    challenges:["Indulgence","Relationship issues","Vanity","Overspending"],
    affirmation:"I attract beauty, love, and abundance with grace." },
  Saturn:  { emoji:"♄",   color:"#6B7280", bg:"#F9FAFB", border:"#D1D5DB",
    keywords:["Discipline","Karma","Delays","Lessons","Longevity","Hard work"],
    bestFor:["Long-term plans","Discipline","Research","Real estate","Old age"],
    challenges:["Delays","Depression","Isolation","Chronic illness","Losses"],
    affirmation:"I embrace discipline and patience — my karma is healing." },
  Rahu:    { emoji:"🐉",  color:"#7C3AED", bg:"#F5F3FF", border:"#A78BFA",
    keywords:["Ambition","Foreign","Technology","Illusion","Obsession"],
    bestFor:["Technology","Foreign travel","Politics","Mass media","Innovation"],
    challenges:["Obsession","Deception","Addiction","Confusion","Anxiety"],
    affirmation:"I harness my ambition wisely, staying grounded in truth." },
  Ketu:    { emoji:"☄️",  color:"#D97706", bg:"#FFFBEB", border:"#FCD34D",
    keywords:["Spirituality","Liberation","Past life","Detachment","Occult"],
    bestFor:["Spirituality","Research","Healing","Moksha","Ancestral work"],
    challenges:["Detachment","Confusion","Health issues","Isolation","Loss"],
    affirmation:"I release the past with gratitude and walk forward free." },
};

const VIMSHOTTARI_YEARS: Record<string, number> = {
  Sun:7, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17, Ketu:7, Venus:20
};

function msToYears(ms: number) { return (ms / (365.25 * 24 * 3600 * 1000)); }

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width:`${Math.min(100,pct)}%`, background:color }} />
    </div>
  );
}

function TimeTag({ label, date }: { label: string; date: string }) {
  try {
    const d = new Date(date);
    const remaining = msToYears(d.getTime() - Date.now());
    return (
      <div className="text-right">
        <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
        <p className="text-sm font-bold text-slate-700">{d.toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</p>
        {remaining > 0 && <p className="text-[10px] text-slate-400">{remaining.toFixed(1)}y left</p>}
      </div>
    );
  } catch { return null; }
}

export default function DashaLifePlanner({ profileId }: { profileId: string }) {
  const [data, setData]     = useState<DashaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    // Fetch from chart-details which provides full dasha timeline accurately
    fetch(`/api/chart-details?profileId=${profileId}`)
      .then(r => r.json())
      .then(d => {
        if (d.dasha) {
          setData({
            mahadasha:     d.dasha.mahadasha,
            mahadashaEnd:  d.dasha.mahadashaEnd || "",
            antardasha:    d.dasha.antardasha,
            antardashaEnd: d.dasha.antardashaEnd || "",
            pratyantardasha: d.dasha.pratyantar || "",
            pratyantarStart: d.dasha.pratyantarStart || "",
            pratyantarEnd:   d.dasha.pratyantarEnd || "",
            moonSign:      d.core?.moonSign || "",
          } as any);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) return <div className="h-48 animate-pulse bg-slate-100 rounded-2xl" />;

  if (!data) return (
    <div className="text-center py-12 text-slate-400">
      <p className="text-4xl mb-3">🧘</p>
      <p className="text-sm">Unable to load Dasha Life Planner.</p>
    </div>
  );

  const MD  = PLANET_META[data.mahadasha]  || PLANET_META.Jupiter;
  const AD  = PLANET_META[data.antardasha] || PLANET_META.Moon;
  const PD  = (data as any).pratyantardasha ? (PLANET_META[(data as any).pratyantardasha] || PLANET_META.Sun) : null;

  // Compute MD progress
  const mdEndDate = data.mahadashaEnd ? new Date(data.mahadashaEnd) : null;
  const mdYears   = VIMSHOTTARI_YEARS[data.mahadasha] || 16;
  const mdStart   = mdEndDate ? new Date(mdEndDate.getTime() - mdYears * 365.25 * 86400000) : null;
  const mdPct     = mdStart && mdEndDate
    ? ((Date.now() - mdStart.getTime()) / (mdEndDate.getTime() - mdStart.getTime())) * 100
    : 50;

  const adEndDate = data.antardashaEnd ? new Date(data.antardashaEnd) : null;
  const adYearsTotal = VIMSHOTTARI_YEARS[data.antardasha] || 1;
  const adDurationMs = ((mdYears * adYearsTotal) / 120) * 365.25 * 86400000;
  const adStart   = adEndDate ? new Date(adEndDate.getTime() - adDurationMs) : null;
  const adPct     = adStart && adEndDate
    ? ((Date.now() - adStart.getTime()) / adDurationMs) * 100
    : 50;

  const pdEndDate = (data as any).pratyantarEnd ? new Date((data as any).pratyantarEnd) : null;
  const pdStart   = (data as any).pratyantarStart ? new Date((data as any).pratyantarStart) : null;
  const pdPct     = pdStart && pdEndDate
    ? ((Date.now() - pdStart.getTime()) / (pdEndDate.getTime() - pdStart.getTime())) * 100
    : 50;

  const SECTIONS = [
    { key: "md", planet: data.mahadasha, meta: MD, label: "Mahadasha (Major)", pct: mdPct, start: mdStart, end: mdEndDate, years: mdYears },
    { key: "ad", planet: data.antardasha, meta: AD, label: "Antardasha (Minor)", pct: adPct, start: adStart, end: adEndDate, years: ((mdYears * adYearsTotal)/120).toFixed(1) },
  ];
  
  if (PD && (data as any).pratyantardasha !== "—") {
    SECTIONS.push({
      key: "pd", planet: (data as any).pratyantardasha, meta: PD, label: "Pratyantardasha (Sub-minor)", 
      pct: pdPct, start: pdStart, end: pdEndDate, years: (pdStart && pdEndDate ? (pdEndDate.getTime() - pdStart.getTime()) / (365.25 * 86400000) : 0).toFixed(2) as any
    });
  }

  return (
    <div className="space-y-4">
      <SectionHeader emoji="🧘" title="Dasha Life Planner"
        subtitle={`Vimshottari Dasha Timeline · Moon in ${data.moonSign}`} />

      {/* Active periods */}
      {SECTIONS.map(sec => (
        <div key={sec.key} className="rounded-2xl border overflow-hidden" style={{ background:sec.meta.bg, borderColor:sec.meta.border }}>
          <button className="w-full p-4 text-left" onClick={() => setExpanded(expanded===sec.key ? null : sec.key)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Active {sec.label}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{sec.meta.emoji}</span>
                  <h3 className="font-black text-xl" style={{ color:sec.meta.color }}>{sec.planet}</h3>
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
              <div className="text-right flex flex-col items-end gap-1">
                 {sec.start && <span className="text-[10px] font-bold text-slate-500 bg-white/60 px-2 py-0.5 rounded-md border border-slate-200">Start: {sec.start.toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</span>}
                 {sec.end && <span className="text-[10px] font-bold text-slate-500 bg-white/60 px-2 py-0.5 rounded-md border border-slate-200">End: {sec.end.toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</span>}
                 {sec.end && msToYears(sec.end.getTime() - Date.now()) > 0 && <span className="text-[10px] text-slate-400 mt-1">{msToYears(sec.end.getTime() - Date.now()).toFixed(1)} yrs left</span>}
              </div>
            </div>
            <ProgressBar pct={sec.pct} color={sec.meta.color} />
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] font-semibold text-slate-400">{Math.round(sec.pct)}% complete</span>
              <span className="text-[9px] font-semibold text-slate-400">{sec.years} yr period</span>
            </div>

            <p className="text-[11px] text-slate-500 mt-1.5">
              {expanded===sec.key ? "▲" : "▼"} {expanded===sec.key ? "Hide" : "Show"} insights
            </p>
          </button>

          {expanded === sec.key && (
            <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor:sec.meta.border }}>
              {/* Best for */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2 mt-3">✅ Best Use of This Period</p>
                <div className="space-y-1.5">
                  {sec.meta.bestFor.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:sec.meta.color }} />
                      <p className="text-sm text-slate-700 font-medium">{b}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Challenges */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">⚠️ Watch Out For</p>
                <div className="space-y-1.5">
                  {sec.meta.challenges.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <p className="text-sm text-slate-600 font-medium">{c}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Affirmation */}
              <div className="bg-white/60 rounded-xl px-4 py-3 border" style={{ borderColor:sec.meta.border }}>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">✨ Your Mantra</p>
                <p className="text-sm font-semibold italic text-slate-700">"{sec.meta.affirmation}"</p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Vimshottari sequence reference */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mt-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Your Lifetime Timeline (Upcoming Dashas)</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {(() => {
            const SEQ = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
            let startIdx = SEQ.indexOf(data.mahadasha);
            if (startIdx === -1) startIdx = 0;
            
            // Reorder sequence to start from current Mahadasha
            const ordered = [...SEQ.slice(startIdx), ...SEQ.slice(0, startIdx)];
            
            let currentStartDate = mdStart;
            
            return ordered.map((planet, i) => {
              const m = PLANET_META[planet];
              const years = VIMSHOTTARI_YEARS[planet];
              const isActive = i === 0; // Current Mahadasha is first in ordered list
              
              let displayDates = "";
              let nextDate = null;
              
              if (currentStartDate) {
                nextDate = new Date(currentStartDate.getTime() + years * 365.25 * 86400000);
                displayDates = `${currentStartDate.getFullYear()} - ${nextDate.getFullYear()}`;
              }
              
              const res = (
                <div key={planet} className={`flex items-center gap-3 p-3 rounded-xl border ${isActive ? "ring-2 ring-offset-2 ring-indigo-500 shadow-md scale-[1.02] transition-transform" : "opacity-70 hover:opacity-100 transition-opacity"}`}
                  style={{ background:m?.bg, borderColor:m?.border }}>
                  <span className="text-2xl drop-shadow-sm">{m?.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[12px] font-black tracking-wide" style={{ color:m?.color }}>{planet.toUpperCase()}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{years} Years</p>
                  </div>
                  <div className="text-right">
                    {isActive ? (
                       <span className="text-[9px] font-black text-white px-2 py-1 rounded shadow-sm" style={{ background:m?.color }}>ACTIVE NOW</span>
                    ) : (
                       <span className="text-[11px] font-black text-slate-600">{displayDates}</span>
                    )}
                  </div>
                </div>
              );
              
              currentStartDate = nextDate;
              return res;
            });
          })()}
        </div>
      </div>
    </div>
  );
}
