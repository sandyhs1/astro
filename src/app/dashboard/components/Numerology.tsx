"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export default function Numerology() {
  const [name, setName] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch("/api/astrology/numerology", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json.data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const aspects = ["Finance", "Romance", "Education", "Health", "Family", "Growth", "Career", "Reputation", "Spirituality", "Luck"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">🔢 Numerology Analysis</h2>
        <p className="text-gray-400 text-sm">Chaldean numerology for any name, business name, or number.</p>
      </div>

      <div className="dash-glass-card p-6">
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12 }}>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter any name..."
            style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", padding: "12px 14px", borderRadius: 12, color: "#fff", fontSize: "0.875rem", outline: "none" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(30,80%,55%)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
          <button type="submit" disabled={loading} style={{
            padding: "12px 24px", borderRadius: 12, border: "none", fontWeight: 700, fontSize: "0.875rem", cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 8, color: "#fff", background: "linear-gradient(135deg, hsl(245,60%,28%), hsl(30,80%,55%))", opacity: loading ? 0.6 : 1,
          }}>
            {loading ? "..." : "Analyze"} {!loading && <FaArrowRight style={{ fontSize: 11 }} />}
          </button>
        </form>
      </div>

      {error && <div className="dash-glass-card p-4 text-red-400 text-sm">⚠️ {error}</div>}
      {loading && <div className="skeleton" style={{ height: 200 }} />}

      {data && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="dash-glass-card p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {data.NameNumber != null && (
                <div className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <p className="text-xs text-gray-400 uppercase mb-1">Name Number</p>
                  <p className="text-3xl font-bold text-[hsl(30,80%,55%)]">{data.NameNumber}</p>
                </div>
              )}
              {data.RulingPlanet && (
                <div className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <p className="text-xs text-gray-400 uppercase mb-1">Ruling Planet</p>
                  <p className="text-lg font-bold">{typeof data.RulingPlanet === "object" ? data.RulingPlanet?.Name : data.RulingPlanet}</p>
                </div>
              )}
              {data.DestinyNumber != null && (
                <div className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <p className="text-xs text-gray-400 uppercase mb-1">Destiny Number</p>
                  <p className="text-3xl font-bold text-[hsl(270,60%,60%)]">{data.DestinyNumber}</p>
                </div>
              )}
            </div>
            {data.Prediction && <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{data.Prediction}</p>}
          </div>

          {/* Life aspect scores */}
          {(data.Finance != null || data.Scores) && (
            <div className="dash-glass-card p-6">
              <h3 className="font-bold text-lg mb-4">Life Aspect Scores</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {aspects.map((asp) => {
                  const score = data[asp] ?? data?.Scores?.[asp] ?? null;
                  if (score == null) return null;
                  const pct = typeof score === "number" ? (score / 10) * 100 : 50;
                  return (
                    <div key={asp} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-xs text-gray-400 mb-2">{asp}</p>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, hsl(245,60%,48%), hsl(30,80%,55%))", borderRadius: 999 }} />
                      </div>
                      <p className="text-sm font-bold mt-1 text-[hsl(30,80%,55%)]">{score}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
