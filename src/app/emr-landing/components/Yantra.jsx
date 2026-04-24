"use client";
import React from "react";

/* ====== Big Orbital System for Hero ====== */
export const OrbitSystem = ({ size = 900, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 900 900"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,94,58,0.9)" />
        <stop offset="40%" stopColor="rgba(255,181,71,0.35)" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(123,97,255,0.25)" />
        <stop offset="60%" stopColor="rgba(0,229,255,0.06)" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>

    {/* outer nebula */}
    <circle cx="450" cy="450" r="430" fill="url(#nebula)" />

    {/* orbit rings (static faint) */}
    {[170, 240, 320, 400].map((r, i) => (
      <circle
        key={i}
        cx="450"
        cy="450"
        r={r}
        fill="none"
        stroke={`rgba(255,255,255,${0.04 + i * 0.01})`}
        strokeWidth="1"
        strokeDasharray={i % 2 ? "2 6" : "0"}
      />
    ))}

    {/* outer ring with ticks */}
    <g className="spin-slower" style={{ transformOrigin: "450px 450px" }}>
      <circle cx="450" cy="450" r="425" fill="none" stroke="rgba(0,229,255,0.25)" strokeWidth="1" />
      {Array.from({ length: 120 }).map((_, i) => {
        const a = (i * 360) / 120;
        const r1 = 425;
        const r2 = i % 10 === 0 ? 405 : i % 5 === 0 ? 415 : 420;
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={450 + r1 * Math.cos(rad)}
            y1={450 + r1 * Math.sin(rad)}
            x2={450 + r2 * Math.cos(rad)}
            y2={450 + r2 * Math.sin(rad)}
            stroke={i % 10 === 0 ? "rgba(0,229,255,0.6)" : "rgba(0,229,255,0.25)"}
            strokeWidth="1"
          />
        );
      })}
    </g>

    {/* rotating triangles (yantra-inspired) */}
    <g className="spin-slow" style={{ transformOrigin: "450px 450px" }}>
      <polygon points="450,180 720,600 180,600" fill="none" stroke="rgba(0,229,255,0.35)" strokeWidth="1" />
    </g>
    <g className="spin-reverse" style={{ transformOrigin: "450px 450px" }}>
      <polygon points="450,720 180,300 720,300" fill="none" stroke="rgba(123,97,255,0.35)" strokeWidth="1" />
    </g>

    {/* 12-house divisions */}
    <g className="spin-slower" style={{ transformOrigin: "450px 450px" }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 360) / 12 - 90;
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={450}
            y1={450}
            x2={450 + 400 * Math.cos(rad)}
            y2={450 + 400 * Math.sin(rad)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        );
      })}
    </g>

    {/* orbiting planets */}
    <g className="spin-slow" style={{ transformOrigin: "450px 450px" }}>
      <circle cx={450 + 240} cy="450" r="5" fill="#00E5FF" />
      <circle cx={450 + 240} cy="450" r="12" fill="none" stroke="rgba(0,229,255,0.4)" strokeWidth="1" />
    </g>
    <g className="spin-reverse" style={{ transformOrigin: "450px 450px" }}>
      <circle cx="450" cy={450 - 320} r="4" fill="#7B61FF" />
      <circle cx="450" cy={450 - 320} r="10" fill="none" stroke="rgba(123,97,255,0.4)" strokeWidth="1" />
    </g>
    <g className="spin-slower" style={{ transformOrigin: "450px 450px" }}>
      <circle cx={450 - 170} cy="450" r="3" fill="#FFB547" />
    </g>
    <g className="spin-slow" style={{ transformOrigin: "450px 450px" }}>
      <circle cx="450" cy={450 + 400} r="6" fill="#FF5E3A" />
      <circle cx="450" cy={450 + 400} r="14" fill="none" stroke="rgba(255,94,58,0.4)" strokeWidth="1" />
    </g>

    {/* sun */}
    <circle cx="450" cy="450" r="90" fill="url(#sunGlow)" />
    <circle cx="450" cy="450" r="28" fill="#F8FAFC" />
    <circle cx="450" cy="450" r="40" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
  </svg>
);

/* ====== Compact Yantra ====== */
export const YantraCore = ({ size = 420, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 420 420"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="yg1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,94,58,0.18)" />
        <stop offset="60%" stopColor="rgba(0,229,255,0.05)" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>
    <circle cx="210" cy="210" r="200" fill="url(#yg1)" />
    <g className="spin-slower" style={{ transformOrigin: "210px 210px" }}>
      <circle cx="210" cy="210" r="196" fill="none" stroke="rgba(0,229,255,0.35)" strokeWidth="1" />
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i * 360) / 60;
        const r1 = 196;
        const r2 = i % 5 === 0 ? 184 : 190;
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={210 + r1 * Math.cos(rad)}
            y1={210 + r1 * Math.sin(rad)}
            x2={210 + r2 * Math.cos(rad)}
            y2={210 + r2 * Math.sin(rad)}
            stroke="rgba(0,229,255,0.5)"
            strokeWidth="1"
          />
        );
      })}
    </g>
    <g className="spin-slow" style={{ transformOrigin: "210px 210px" }}>
      <circle cx="210" cy="210" r="158" fill="none" stroke="rgba(123,97,255,0.35)" strokeWidth="1" />
    </g>
    <polygon points="210,80 340,290 80,290" fill="none" stroke="rgba(0,229,255,0.6)" strokeWidth="1" />
    <polygon points="210,340 80,130 340,130" fill="none" stroke="rgba(123,97,255,0.6)" strokeWidth="1" />
    <circle cx="210" cy="210" r="6" fill="#F8FAFC" />
  </svg>
);

/* ====== Mini Yantra ====== */
export const MiniYantra = ({ size = 80, variant = "cyan" }) => {
  const stroke =
    variant === "violet" ? "rgba(123,97,255,0.7)"
    : variant === "coral" ? "rgba(255,94,58,0.7)"
    : "rgba(0,229,255,0.7)";
  const dot =
    variant === "violet" ? "#7B61FF"
    : variant === "coral" ? "#FF5E3A"
    : "#00E5FF";
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="none" stroke={stroke} strokeWidth="1" />
      <polygon points="40,10 68,58 12,58" fill="none" stroke={stroke} strokeWidth="1" />
      <polygon points="40,70 12,22 68,22" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <circle cx="40" cy="40" r="4" fill={dot} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 360) / 8;
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={40}
            y1={40}
            x2={40 + 38 * Math.cos(rad)}
            y2={40 + 38 * Math.sin(rad)}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
};

/* ====== Chart square (D1/D9/D10 style diamond) ====== */
export const ChartSquare = ({ label = "D1", highlight = false }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
    <rect x="2" y="2" width="116" height="116" fill="none" stroke={highlight ? "#00E5FF" : "rgba(255,255,255,0.15)"} strokeWidth="1" />
    <line x1="2" y1="2" x2="118" y2="118" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    <line x1="118" y1="2" x2="2" y2="118" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    <line x1="60" y1="2" x2="2" y2="60" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    <line x1="60" y1="2" x2="118" y2="60" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    <line x1="2" y1="60" x2="60" y2="118" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    <line x1="60" y1="118" x2="118" y2="60" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    <text x="60" y="66" textAnchor="middle" fill={highlight ? "#00E5FF" : "#F8FAFC"} fontFamily="IBM Plex Mono" fontSize="18" fontWeight="600">{label}</text>
  </svg>
);

/* ====== Wave Graph ====== */
export const WaveGraph = () => (
  <svg viewBox="0 0 800 200" className="w-full h-full" aria-hidden="true">
    <defs>
      <linearGradient id="wg" x1="0" x2="1">
        <stop offset="0%" stopColor="rgba(255,94,58,0)" />
        <stop offset="50%" stopColor="rgba(0,229,255,0.8)" />
        <stop offset="100%" stopColor="rgba(123,97,255,0)" />
      </linearGradient>
    </defs>
    {[0, 1, 2, 3].map((k) => (
      <path
        key={k}
        d={`M 0 ${100 + k * 4} Q 100 ${50 + k * 10}, 200 100 T 400 100 T 600 100 T 800 100`}
        stroke="url(#wg)"
        strokeWidth={1 + k * 0.3}
        fill="none"
        opacity={0.7 - k * 0.15}
      />
    ))}
  </svg>
);
