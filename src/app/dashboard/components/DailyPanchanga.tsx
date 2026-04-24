"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const TIMEZONES = [
  { label: "IST (India)", value: "+05:30" },
  { label: "UTC", value: "+00:00" },
  { label: "EST (US East)", value: "-05:00" },
  { label: "PST (US West)", value: "-08:00" },
  { label: "GMT+1 (Europe)", value: "+01:00" },
  { label: "SGT (Singapore)", value: "+08:00" },
];

export default function DailyPanchanga() {
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("+05:30");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    setLoading(true); setError(null); setData(null);

    const now = new Date();
    const dob = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const tob = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    try {
      const res = await fetch("/api/astrology", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob, tob, pob: location.trim(), timezone }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json.data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">🌍 Daily Panchanga</h2>
        <p className="text-gray-400 text-sm">Today&apos;s Tithi, Nakshatra, Yoga, Karana, and planetary positions for your location.</p>
      </div>

      <div className="dash-glass-card p-6">
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter your city (e.g. Mumbai, Delhi, London)"
            style={{ flex: "1 1 200px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", padding: "12px 14px", borderRadius: 12, color: "#fff", fontSize: "0.875rem", outline: "none" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(30,80%,55%)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", padding: "12px 14px", borderRadius: 12, color: "#fff", fontSize: "0.875rem", cursor: "pointer" }}>
            {TIMEZONES.map((tz) => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
          </select>
          <button type="submit" disabled={loading} style={{
            padding: "12px 24px", borderRadius: 12, border: "none", fontWeight: 700, fontSize: "0.875rem", cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 8, color: "#fff", background: "linear-gradient(135deg, hsl(245,60%,28%), hsl(30,80%,55%))", opacity: loading ? 0.6 : 1,
          }}>
            {loading ? "..." : "Get Panchanga"} {!loading && <FaArrowRight style={{ fontSize: 11 }} />}
          </button>
        </form>
      </div>

      {error && <div className="dash-glass-card p-4 text-red-400 text-sm">⚠️ {error}</div>}
      {loading && <div className="space-y-3"><div className="skeleton" style={{ height: 80 }} /><div className="skeleton" style={{ height: 200 }} /></div>}

      {data?.houses && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dash-glass-card p-6">
          <h3 className="font-bold text-lg mb-2">Today&apos;s House Positions</h3>
          <p className="text-xs text-gray-500 mb-4">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
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
          <h3 className="font-bold text-lg mb-4">Current Planetary Positions</h3>
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
    </div>
  );
}
