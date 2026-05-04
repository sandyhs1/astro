"use client";
import { useState, useEffect } from "react";
import { SectionHeader } from "./PanchangUtils";

interface TransitPlanet { planet: string; sign: string; degree: number; isRetrograde: boolean; }
interface TransitsData { transits: TransitPlanet[]; ascendantSign: string; moonSign: string; timestamp: string; location: string; }

const ZODIAC_SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

const PLANET_META: Record<string, { emoji: string; color: string; bg: string; border: string }> = {
  Sun:     { emoji:"☀️",  color:"#F59E0B", bg:"#FFFBEB", border:"#FDE68A" },
  Moon:    { emoji:"🌙",  color:"#8B5CF6", bg:"#F5F3FF", border:"#C4B5FD" },
  Mars:    { emoji:"♂️",  color:"#EF4444", bg:"#FEF2F2", border:"#FCA5A5" },
  Mercury: { emoji:"☿️",  color:"#10B981", bg:"#ECFDF5", border:"#6EE7B7" },
  Jupiter: { emoji:"♃",   color:"#2563EB", bg:"#EFF6FF", border:"#93C5FD" },
  Venus:   { emoji:"♀️",  color:"#EC4899", bg:"#FDF2F8", border:"#F9A8D4" },
  Saturn:  { emoji:"♄",   color:"#6B7280", bg:"#F9FAFB", border:"#D1D5DB" },
  Rahu:    { emoji:"🐉",  color:"#7C3AED", bg:"#F5F3FF", border:"#A78BFA" },
  Ketu:    { emoji:"☄️",  color:"#D97706", bg:"#FFFBEB", border:"#FCD34D" },
};

export default function PlanetaryTransits({ profileId }: { profileId: string }) {
  const [data, setData] = useState<TransitsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    fetch(`/api/transits?profileId=${profileId}`)
      .then(r => r.json())
      .then(d => { if (d.transits) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) return <div className="h-64 animate-pulse bg-slate-100 rounded-2xl" />;
  if (!data) return <div className="text-center py-8 text-slate-400">Failed to load transits.</div>;

  // Group planets by sign
  const signPlanets: Record<string, TransitPlanet[]> = {};
  ZODIAC_SIGNS.forEach(s => signPlanets[s] = []);
  data.transits.forEach(p => {
    if (signPlanets[p.sign]) signPlanets[p.sign].push(p);
  });

  return (
    <div className="space-y-4">
      <SectionHeader emoji="🪐" title="Live Planetary Transits" subtitle={`Current planetary positions · Moon in ${data.moonSign}`} />

      {/* Grid of Zodaic Signs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {ZODIAC_SIGNS.map((sign, idx) => {
          const planets = signPlanets[sign];
          const isAscendant = data.ascendantSign === sign;
          const isMoonSign = data.moonSign === sign;

          return (
            <div key={sign} className={`rounded-xl border p-3 flex flex-col ${planets.length > 0 ? "bg-white shadow-sm border-slate-200" : "bg-slate-50/50 border-slate-100"}`}>
              
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className={`text-[11px] font-black uppercase tracking-widest ${planets.length > 0 ? "text-slate-800" : "text-slate-400"}`}>{sign}</h4>
                  {isAscendant && <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1 rounded block w-fit mt-0.5">ASCENDANT</span>}
                  {isMoonSign && !isAscendant && <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-1 rounded block w-fit mt-0.5">MOON SIGN</span>}
                </div>
                <span className="text-slate-300 text-xs font-bold">{idx + 1}</span>
              </div>

              {planets.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[10px] text-slate-300">Empty</span>
                </div>
              ) : (
                <div className="flex-1 space-y-1.5 mt-1">
                  {planets.map(p => {
                    const meta = PLANET_META[p.planet] || { emoji:"🪐", color:"#94A3B8", bg:"#F8FAFC", border:"#E2E8F0" };
                    return (
                      <div key={p.planet} className="flex justify-between items-center px-1.5 py-1 rounded" style={{ background: meta.bg }}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{meta.emoji}</span>
                          <span className="text-[10px] font-black" style={{ color: meta.color }}>
                            {p.planet} {p.isRetrograde ? "®" : ""}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 tabular-nums">
                          {p.degree.toFixed(1)}°
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-[12px] text-indigo-700 font-medium space-y-1">
        <p>💡 <strong>Note:</strong> ® indicates a retrograde planet. Current positions are calculated for <strong>{data.location}</strong>.</p>
      </div>
    </div>
  );
}
