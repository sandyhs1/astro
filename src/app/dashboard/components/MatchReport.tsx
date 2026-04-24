"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import BirthDataForm from "./BirthDataForm";

export default function MatchReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"person1" | "person2" | "results">("person1");
  const [person1, setPerson1] = useState<any>(null);

  const handlePerson1 = (d: any) => { setPerson1(d); setStep("person2"); };

  const handlePerson2 = async (person2Data: any) => {
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch("/api/astrology/match", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ male: person1, female: person2Data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json.data); setStep("results");
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const reset = () => { setStep("person1"); setPerson1(null); setData(null); setError(null); };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">💑 Match Compatibility</h2>
        <p className="text-gray-400 text-sm">16-factor Kuta compatibility analysis between two birth charts.</p>
      </div>

      {step === "person1" && (
        <div className="dash-glass-card p-6">
          <h3 className="font-bold mb-4 text-[hsl(30,80%,55%)]">Person 1 (Male) Birth Details</h3>
          <BirthDataForm onSubmit={handlePerson1} label="Next → Person 2" />
        </div>
      )}

      {step === "person2" && (
        <div className="dash-glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[hsl(270,60%,60%)]">Person 2 (Female) Birth Details</h3>
            <button onClick={() => setStep("person1")} className="text-xs text-gray-400 hover:text-white">← Back</button>
          </div>
          <BirthDataForm onSubmit={handlePerson2} loading={loading} label="Generate Match Report" />
        </div>
      )}

      {error && <div className="dash-glass-card p-4 text-red-400 text-sm">⚠️ {error}</div>}
      {loading && <div className="skeleton" style={{ height: 200 }} />}

      {data && step === "results" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="dash-glass-card p-6 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Overall Compatibility</p>
            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[hsl(30,80%,55%)] to-[hsl(270,60%,60%)]">
              {typeof data === "object" && data?.KutaScore ? `${data.KutaScore}%` : "—"}
            </div>
          </div>

          {Array.isArray(data?.MatchResults || data) && (
            <div className="dash-glass-card p-6">
              <h3 className="font-bold text-lg mb-4">Factor Breakdown</h3>
              <div className="space-y-3">
                {(data?.MatchResults || data).map((factor: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <p className="text-sm font-semibold">{factor.Name || factor.name || `Factor ${i + 1}`}</p>
                      <p className="text-xs text-gray-500 mt-1">{factor.Description || factor.Info || ""}</p>
                    </div>
                    <span className={`prediction-nature ${(factor.Nature || factor.Result || "").toLowerCase().includes("good") ? "prediction-good" : "prediction-bad"}`}>
                      {factor.Nature || factor.Result || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={reset} className="text-sm text-gray-400 hover:text-white underline">← Start new comparison</button>
        </motion.div>
      )}
    </div>
  );
}
