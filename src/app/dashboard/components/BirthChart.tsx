"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Star } from "lucide-react";
import BirthDataForm from "./BirthDataForm";

export default function BirthChart() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (birth: any) => {
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch("/api/astrology", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birth),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json.data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">🔮 Birth Chart Analysis</h2>
        <p className="text-gray-400 text-sm">Enter birth details to generate your full Vedic chart with 200+ life predictions.</p>
      </div>
      <div className="dash-glass-card p-6"><BirthDataForm onSubmit={handleSubmit} loading={loading} label="Generate Birth Chart" /></div>

      {error && <div className="dash-glass-card p-4 text-red-400 text-sm">⚠️ {error}</div>}

      {loading && <div className="space-y-4"><div className="skeleton" style={{ height: 80 }} /><div className="skeleton" style={{ height: 200 }} /><div className="skeleton" style={{ height: 160 }} /></div>}

      {data?.houses && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dash-glass-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Sun size={18} className="text-[hsl(30,80%,55%)]" /> House Overview</h3>
          <div className="flex flex-wrap gap-3">
            {(Array.isArray(data.houses) ? data.houses : Object.entries(data.houses)).slice(0, 12).map((item: any, i: number) => {
              const name = Object.keys(item)[0];
              const d = item[name];
              const sign = d?.HouseSignName || "—";
              return (
                <div key={i} className="astro-stat-chip">
                  <span className="label">{name}</span>
                  <span className="value">{sign}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {data?.planets && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="dash-glass-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Moon size={18} className="text-[hsl(270,60%,60%)]" /> Planetary Positions</h3>
          <div className="overflow-x-auto"><div style={{ minWidth: 400 }}>
            <div className="astro-planet-row" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <span>Planet</span><span>Sign</span><span>House</span><span>Nakshatra</span>
            </div>
            {(Array.isArray(data.planets) ? data.planets : Object.entries(data.planets)).map((item: any, i: number) => {
              const name = Object.keys(item)[0];
              const d = item[name];
              const sign = typeof d?.PlanetRasiD1Sign === "object" ? d.PlanetRasiD1Sign?.Name : d?.PlanetRasiD1Sign || "—";
              const house = d?.HousePlanetOccupiesBasedOnSign || d?.HousePlanetOccupiesBasedOnLongitudes || "—";
              const nakshatra = d?.PlanetConstellation || "—";
              return (
                <div key={i} className="astro-planet-row">
                  <span className="astro-planet-name">{name}</span>
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{sign}</span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>{house.replace("House", "")}</span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>{nakshatra}</span>
                </div>
              );
            })}
          </div></div>
        </motion.div>
      )}

      {data?.horoscope && Array.isArray(data.horoscope) && data.horoscope.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="dash-glass-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Star size={18} className="text-[hsl(30,80%,55%)]" /> Life Predictions ({data.horoscope.length})</h3>
          <div className="space-y-3" style={{ maxHeight: 500, overflowY: "auto", paddingRight: 8 }}>
            {data.horoscope.map((pred: any, i: number) => {
              const nature = (pred.Nature || "").toLowerCase();
              return (
                <div key={i} className="prediction-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`prediction-nature ${nature === "good" ? "prediction-good" : nature === "bad" ? "prediction-bad" : "prediction-neutral"}`}>
                      {nature === "good" ? "🟢" : nature === "bad" ? "🔴" : "⚪"} {nature || "neutral"}
                    </span>
                    {pred.RelatedBody && <span className="text-xs text-gray-500">{typeof pred.RelatedBody === "object" ? pred.RelatedBody?.Name : pred.RelatedBody}</span>}
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{pred.Name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{pred.Description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
