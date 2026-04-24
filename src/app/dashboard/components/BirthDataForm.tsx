"use client";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

interface BirthDataFormProps {
  onSubmit: (data: { dob: string; tob: string; pob: string; timezone: string }) => void;
  loading?: boolean;
  label?: string;
}

const TIMEZONES = [
  { label: "IST (India)", value: "+05:30" },
  { label: "UTC", value: "+00:00" },
  { label: "EST (US East)", value: "-05:00" },
  { label: "PST (US West)", value: "-08:00" },
  { label: "GMT+1 (Europe)", value: "+01:00" },
  { label: "SGT (Singapore)", value: "+08:00" },
  { label: "JST (Japan)", value: "+09:00" },
  { label: "AEST (Australia)", value: "+10:00" },
  { label: "GST (Gulf)", value: "+04:00" },
];

export default function BirthDataForm({ onSubmit, loading, label = "Generate" }: BirthDataFormProps) {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");
  const [timezone, setTimezone] = useState("+05:30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob || !tob || !pob.trim()) return;
    onSubmit({ dob, tob, pob, timezone });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
    padding: "11px 14px", borderRadius: 12, color: "#fff", fontSize: "0.875rem", outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.6875rem", fontWeight: 700, color: "rgba(255,255,255,0.5)",
    marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Date of Birth</label>
          <input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(30,80%,55%)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
        </div>
        <div>
          <label style={labelStyle}>Time of Birth</label>
          <input required type="time" value={tob} onChange={(e) => setTob(e.target.value)} style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(30,80%,55%)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Place of Birth</label>
          <input required type="text" value={pob} onChange={(e) => setPob(e.target.value)} placeholder="Mumbai, India" style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(30,80%,55%)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
        </div>
        <div>
          <label style={labelStyle}>Timezone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {TIMEZONES.map((tz) => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" disabled={loading} style={{
        marginTop: 4, padding: "13px", borderRadius: 12, border: "none", fontWeight: 700, fontSize: "0.875rem",
        cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8, color: "#fff", background: "linear-gradient(135deg, hsl(245,60%,28%), hsl(30,80%,55%))",
        opacity: loading ? 0.6 : 1, boxShadow: "0 4px 14px -4px rgba(120,60,200,0.35)",
      }}>
        {loading ? "Calculating..." : label} {!loading && <FaArrowRight style={{ fontSize: 11 }} />}
      </button>
    </form>
  );
}
