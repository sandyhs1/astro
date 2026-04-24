"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import BirthDataForm from "./BirthDataForm";

export default function DasaTimeline() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [birthData, setBirthData] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [step, setStep] = useState<"birth" | "range" | "results">("birth");

  const handleBirth = (d: any) => { setBirthData(d); setStep("range"); };

  const handleRange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch("/api/astrology/dasa", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...birthData, startDate, endDate }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json.data); setStep("results");
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const colors = ["hsl(30,80%,55%)", "hsl(270,60%,60%)", "hsl(180,60%,50%)", "hsl(350,70%,55%)", "hsl(120,50%,50%)", "hsl(200,70%,55%)", "hsl(45,80%,55%)", "hsl(300,50%,55%)", "hsl(160,60%,45%)"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">📊 Dasa Timeline</h2>
        <p className="text-gray-400 text-sm">Planetary period analysis — Mahadasa, Bhukti, and Antaram periods for any date range.</p>
      </div>

      {step === "birth" && (
        <div className="dash-glass-card p-6">
          <h3 className="font-bold mb-4 text-[hsl(30,80%,55%)]">Birth Details</h3>
          <BirthDataForm onSubmit={handleBirth} label="Next → Select Date Range" />
        </div>
      )}

      {step === "range" && (
        <div className="dash-glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[hsl(270,60%,60%)]">Select Date Range</h3>
            <button onClick={() => setStep("birth")} className="text-xs text-gray-400 hover:text-white">← Back</button>
          </div>
          <form onSubmit={handleRange} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Start Date</label>
                <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", padding: "11px 14px", borderRadius: 12, color: "#fff", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.6875rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>End Date</label>
                <input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", padding: "11px 14px", borderRadius: 12, color: "#fff", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              padding: "13px", borderRadius: 12, border: "none", fontWeight: 700, fontSize: "0.875rem", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#fff", background: "linear-gradient(135deg, hsl(245,60%,28%), hsl(30,80%,55%))", opacity: loading ? 0.6 : 1,
            }}>{loading ? "Calculating..." : "Generate Timeline"}</button>
          </form>
        </div>
      )}

      {error && <div className="dash-glass-card p-4 text-red-400 text-sm">⚠️ {error}</div>}
      {loading && <div className="skeleton" style={{ height: 200 }} />}

      {data && step === "results" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="dash-glass-card p-6">
            <h3 className="font-bold text-lg mb-4">Dasa Periods</h3>
            <div className="space-y-2">
              {(Array.isArray(data) ? data : Object.entries(data)).slice(0, 30).map((item: any, i: number) => {
                const period = item?.Name || item?.[0] || item?.Period || `Period ${i + 1}`;
                const info = item?.Data || item?.[1] || item;
                const periodStr = typeof period === "object" ? (period?.Name || JSON.stringify(period)) : String(period);
                return (
                  <div key={i} className="p-3 rounded-xl flex items-center gap-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ width: 4, height: 32, borderRadius: 4, background: colors[i % colors.length], flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{periodStr}</p>
                      {typeof info === "object" && (
                        <p className="text-xs text-gray-500 truncate">
                          {info?.Start || ""} {info?.Start && info?.End ? "→" : ""} {info?.End || ""}
                          {info?.DasaPlanet && ` · ${typeof info.DasaPlanet === "object" ? info.DasaPlanet?.Name : info.DasaPlanet}`}
                        </p>
                      )}
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[i % colors.length], flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={() => { setStep("birth"); setData(null); }} className="text-sm text-gray-400 hover:text-white underline">← New analysis</button>
        </motion.div>
      )}
    </div>
  );
}
