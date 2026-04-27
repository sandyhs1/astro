"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface YogaResult {
  name: string; fullName: string; category: string;
  status: "ACTIVATED" | "DORMANT";
  planets: string[]; houses: number[];
  logic: string; benefit: string;
}

interface DetailsData {
  person: { fullName: string; dob: string; tob: string; pob: string; timezone: string };
  core: {
    ascendant: string; ascendantNakshatra: string; ascendantNakshatraPada: number;
    moonSign: string; moonNakshatra: string; moonNakshatraPada: number;
    sunSign: string; ascLord: string; ascLordSign: string; ascLordHouse: number;
  };
  dasha: {
    mahadasha: string; mahadashaEnd: string; mahadashaRemaining: string;
    antardasha: string; antardashaEnd: string; antardashaRemaining: string;
    pratyantar: string;
    nextMahadasha: string; nextMahadashaStart: string; nextMahadashaEnd: string;
  };
  planets: any[];
  houses: any[];
  karakas: Record<string, string>;
  specialPoints: { AL: string; UL: string; A7: string; PP: string };
  yogas: YogaResult[];
  ashtakavarga: any;
}

const KARAKA_LABELS: Record<string, string> = {
  ak: "AK — Atmakaraka (Soul's Desire)",
  amk: "AMK — Amatyakaraka (Career & Mind)",
  bk: "BK — Bhratrukaraka (Siblings)",
  mk: "MK — Matrukaraka (Mother)",
  pk: "PK — Pitrukaraka (Father)",
  gk: "GK — Gnatikaraka (Rivals & Competition)",
  dk: "DK — Darakaraka (Spouse / Partner)",
};

const SIGN_LORD: Record<string, string> = {
  Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",
  Leo:"Sun",Virgo:"Mercury",Libra:"Venus",Scorpio:"Mars",
  Sagittarius:"Jupiter",Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter",
};

// ─── Styling helpers ──────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background:"#fff", border:"1px solid #E2E8F0",
  borderRadius:12, padding:"20px 24px", marginBottom:16,
};
const sectionTitle: React.CSSProperties = {
  fontFamily:"'Space Grotesk', sans-serif", fontSize:"11px",
  fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase" as const,
  color:"#6366F1", marginBottom:14, display:"block",
};
const pill = (color: string, bg: string): React.CSSProperties => ({
  display:"inline-block", padding:"2px 10px", borderRadius:99,
  fontSize:"10px", fontWeight:700, letterSpacing:"0.06em",
  color, background:bg,
});

interface Props {
  activeProfileId: string;
  familyProfiles: any[];
  userEmail: string;
}

export default function DetailsPanel({ activeProfileId, familyProfiles, userEmail }: Props) {
  const [data, setData] = useState<DetailsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true); setError(null); setData(null);
      try {
        const res = await fetch(`/api/chart-details?profileId=${activeProfileId}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load chart details.");
        setData(json);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeProfileId]);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:300 }}>
      <div style={{ fontFamily:"'IBM Plex Mono', monospace", fontSize:11, color:"#94A3B8", letterSpacing:"0.12em" }}>
        LOADING COSMIC BLUEPRINT...
      </div>
    </div>
  );

  if (error) return (
    <div style={{ padding:24, background:"#FEF2F2", borderRadius:12, color:"#991B1B", fontSize:13, margin:16 }}>
      {error}
    </div>
  );

  if (!data) return null;

  const { person, core, dasha, planets, houses, karakas, specialPoints, yogas, ashtakavarga } = data;

  const activatedYogas = yogas.filter(y=>y.status==="ACTIVATED");
  const dormantYogas   = yogas.filter(y=>y.status==="DORMANT");

  return (
    <div style={{ padding:"16px 20px", overflowY:"auto", height:"100%", background:"#F8FAFC" }}>

      {/* ── Person Header ────────────────────────────────────── */}
      <div style={{ ...card, background:"linear-gradient(135deg,#6366F1,#8B5CF6)", color:"#fff", marginBottom:16 }}>
        <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontSize:"1.2rem", fontWeight:800, marginBottom:6 }}>
          {person.fullName}
        </div>
        <div style={{ fontSize:"12px", opacity:0.85, lineHeight:1.7 }}>
          🗓 {person.dob} &nbsp;|&nbsp; ⏰ {person.tob} &nbsp;|&nbsp; 📍 {person.pob}
        </div>
        <div style={{ fontSize:"11px", opacity:0.65, marginTop:4 }}>
          Timezone: {person.timezone} &nbsp;·&nbsp; Lahiri Ayanamsa · Whole Sign · Sidereal
        </div>
      </div>

      {/* ── Core Identity ─────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionTitle}>⭐ Core Identity</span>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 24px" }}>
          <Row label="Ascendant (Lagna)"    value={`${core.ascendant}${core.ascendantNakshatra ? ` · ${core.ascendantNakshatra} Pada ${core.ascendantNakshatraPada}` : ""}`} />
          <Row label="Ascendant Lord"       value={`${core.ascLord} in ${core.ascLordSign} (House ${core.ascLordHouse})`} />
          <Row label="Moon Sign (Rashi)"    value={core.moonSign} />
          <Row label="Moon Nakshatra"       value={`${core.moonNakshatra}${core.moonNakshatraPada ? ` Pada ${core.moonNakshatraPada}` : ""}`} />
          <Row label="Sun Sign"             value={core.sunSign} />
        </div>
      </div>

      {/* ── Dasha Timeline ────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionTitle}>⏱ Vimshottari Dasha Timeline</span>
        <DashaBar
          label="Mahadasha" planet={dasha.mahadasha}
          end={dasha.mahadashaEnd} remaining={dasha.mahadashaRemaining}
          color="#6366F1" isCurrent
        />
        <DashaBar
          label="Antardasha" planet={dasha.antardasha}
          end={dasha.antardashaEnd} remaining={dasha.antardashaRemaining}
          color="#8B5CF6" isCurrent
        />
        {dasha.pratyantar && dasha.pratyantar !== "—" && (
          <DashaBar label="Pratyantar" planet={dasha.pratyantar} color="#A78BFA" />
        )}
        {dasha.nextMahadasha && (
          <div style={{ marginTop:12, paddingTop:12, borderTop:"1px dashed #E2E8F0" }}>
            <div style={{ fontSize:"10px", fontWeight:700, color:"#94A3B8", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>
              Next Mahadasha
            </div>
            <DashaBar
              label="Next Mahadasha" planet={dasha.nextMahadasha}
              start={dasha.nextMahadashaStart} end={dasha.nextMahadashaEnd}
              color="#10B981" isCurrent={false}
            />
          </div>
        )}
      </div>

      {/* ── Planet Table ──────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionTitle}>🪐 Planetary Positions (D1 — Rashi Chart)</span>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #E2E8F0" }}>
                {["Planet","Sign","House","Degree","Nakshatra","Pada","Status"].map(h=>(
                  <th key={h} style={{ padding:"6px 8px", textAlign:"left", color:"#64748B", fontWeight:700, fontSize:"10px", letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planets.map((p: any)=>{
                const flags = [
                  p.isRetro       ? "Retro"       : "",
                  p.isExalted     ? "Exalted"     : "",
                  p.isDebilitated ? "Debilitated" : "",
                  p.isCombust     ? "Combust"     : "",
                ].filter(Boolean);
                return (
                  <tr key={p.name} style={{ borderBottom:"1px solid #F1F5F9" }}>
                    <td style={{ padding:"7px 8px", fontWeight:700, color:"#1E293B" }}>{p.name}</td>
                    <td style={{ padding:"7px 8px", color:"#334155" }}>{p.sign}</td>
                    <td style={{ padding:"7px 8px", color:"#334155", textAlign:"center" }}>{p.house}</td>
                    <td style={{ padding:"7px 8px", color:"#334155", fontFamily:"monospace" }}>{(p.normDegree||0).toFixed(2)}°</td>
                    <td style={{ padding:"7px 8px", color:"#334155" }}>{p.nakshatra||"—"}</td>
                    <td style={{ padding:"7px 8px", color:"#334155", textAlign:"center" }}>{p.nakshatraPada||"—"}</td>
                    <td style={{ padding:"7px 8px" }}>
                      {flags.length===0 ? <span style={{ color:"#94A3B8" }}>—</span> : flags.map(f=>(
                        <span key={f} style={{ ...pill(
                          f==="Exalted"?"#166534":f==="Debilitated"?"#991B1B":f==="Retro"?"#1D4ED8":"#92400E",
                          f==="Exalted"?"#DCFCE7":f==="Debilitated"?"#FEE2E2":f==="Retro"?"#DBEAFE":"#FEF3C7"
                        ), marginRight:3 }}>{f}</span>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Houses ────────────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionTitle}>🏠 All 12 Houses (Bhava)</span>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {houses.map((h: any)=>(
            <div key={h.number} style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:8, padding:"10px 12px" }}>
              <div style={{ fontSize:"10px", fontWeight:800, color:"#6366F1", letterSpacing:"0.08em", marginBottom:3 }}>
                H{h.number} — {h.sign}
              </div>
              <div style={{ fontSize:"10px", color:"#64748B", marginBottom:3 }}>Lord: {SIGN_LORD[h.sign]||"?"}</div>
              <div style={{ fontSize:"11px", color:"#1E293B", fontWeight:600 }}>
                {h.occupants?.length>0 ? h.occupants.join(", ") : <span style={{color:"#CBD5E1"}}>Empty</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Karakas ───────────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionTitle}>👑 Jaimini Karakas</span>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 24px" }}>
          {Object.entries(KARAKA_LABELS).map(([key,label])=>(
            <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"8px 0", borderBottom:"1px solid #F1F5F9" }}>
              <div style={{ fontSize:"11px", color:"#64748B", lineHeight:1.4, maxWidth:"70%" }}>{label}</div>
              <div style={{ fontSize:"13px", fontWeight:800, color:"#6366F1", marginLeft:8 }}>{karakas[key]||"—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Special Points ────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionTitle}>🔮 Special Sensitive Points</span>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 24px" }}>
          <Row label="Arudha Lagna (AL) — Public Image"       value={specialPoints.AL||"—"} />
          <Row label="Upapada Lagna (UL) — Marriage/Bond"     value={specialPoints.UL||"—"} />
          <Row label="A7 Darapada — Physical Attraction"      value={specialPoints.A7||"—"} />
          <Row label="Pranapada Lagna — Life Force Center"    value={specialPoints.PP||"—"} />
        </div>
      </div>

      {/* ── Yogas ─────────────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionTitle}>✨ Classical Yogas ({yogas.length} detected)</span>

        {activatedYogas.length > 0 && (
          <>
            <div style={{ fontSize:"10px", fontWeight:800, color:"#166534", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>
              🟢 ACTIVATED ({activatedYogas.length})
            </div>
            {activatedYogas.map((y,i)=>(
              <YogaCard key={i} yoga={y} />
            ))}
          </>
        )}

        {dormantYogas.length > 0 && (
          <>
            <div style={{ fontSize:"10px", fontWeight:800, color:"#92400E", letterSpacing:"0.1em", textTransform:"uppercase", margin:"16px 0 10px" }}>
              🟡 DORMANT / LATENT ({dormantYogas.length})
            </div>
            {dormantYogas.map((y,i)=>(
              <YogaCard key={i} yoga={y} />
            ))}
          </>
        )}

        {yogas.length===0 && (
          <div style={{ color:"#94A3B8", fontSize:"13px" }}>No classical yogas detected in this chart.</div>
        )}
      </div>

      {/* ── Ashtakavarga ──────────────────────────────────────── */}
      {ashtakavarga && typeof ashtakavarga==="object" && Object.keys(ashtakavarga).length>0 && (
        <div style={card}>
          <span style={sectionTitle}>📊 Ashtakavarga — House Strength Scores</span>
          <ASVGrid ashtakavarga={ashtakavarga} />
        </div>
      )}

      <div style={{ height:40 }} />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding:"6px 0", borderBottom:"1px solid #F1F5F9" }}>
      <div style={{ fontSize:"10px", color:"#94A3B8", fontWeight:600, letterSpacing:"0.04em", marginBottom:2 }}>{label}</div>
      <div style={{ fontSize:"13px", color:"#1E293B", fontWeight:700 }}>{value}</div>
    </div>
  );
}

function DashaBar({ label, planet, end, remaining, start, color, isCurrent }:
  { label:string; planet:string; end?:string; remaining?:string; start?:string; color:string; isCurrent?:boolean }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
      <div style={{ width:3, height:36, borderRadius:99, background:color, flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <div style={{ fontSize:"10px", color:"#94A3B8", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
        <div style={{ fontSize:"15px", fontWeight:800, color:"#1E293B" }}>{planet || "—"}</div>
      </div>
      <div style={{ textAlign:"right" }}>
        {start && <div style={{ fontSize:"10px", color:"#94A3B8" }}>From {start}</div>}
        {end     && <div style={{ fontSize:"11px", color:"#334155", fontWeight:600 }}>Until {end}</div>}
        {remaining && <div style={{ fontSize:"10px", color:color, fontWeight:700 }}>{remaining}</div>}
      </div>
    </div>
  );
}

function YogaCard({ yoga }: { yoga: YogaResult }) {
  const [open, setOpen] = useState(false);
  const isActive = yoga.status==="ACTIVATED";
  return (
    <div style={{ border:`1px solid ${isActive?"#BBF7D0":"#FDE68A"}`, borderRadius:10, marginBottom:8, overflow:"hidden" }}>
      <button
        onClick={()=>setOpen(o=>!o)}
        style={{ width:"100%", background:isActive?"#F0FDF4":"#FFFBEB", border:"none", padding:"12px 14px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", textAlign:"left" as const }}
      >
        <div>
          <div style={{ fontSize:"13px", fontWeight:800, color:"#1E293B" }}>{yoga.fullName}</div>
          <div style={{ fontSize:"10px", color:"#64748B", marginTop:2 }}>
            {yoga.category} &nbsp;·&nbsp; Planets: {yoga.planets.join(", ")}
            &nbsp;·&nbsp; H{yoga.houses.join(", H")}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <span style={pill(isActive?"#166534":"#92400E", isActive?"#DCFCE7":"#FEF3C7")}>
            {yoga.status}
          </span>
          <span style={{ color:"#94A3B8", fontSize:12 }}>{open?"▲":"▼"}</span>
        </div>
      </button>
      {open && (
        <div style={{ padding:"12px 14px", borderTop:`1px solid ${isActive?"#BBF7D0":"#FDE68A"}`, background:"#fff" }}>
          <div style={{ fontSize:"11px", color:"#475569", lineHeight:1.7, marginBottom:10 }}>
            <strong style={{ color:"#334155" }}>Why {yoga.status}:</strong><br />{yoga.logic}
          </div>
          <div style={{ fontSize:"11px", color:"#166534", background:"#F0FDF4", borderRadius:8, padding:"8px 12px", lineHeight:1.7 }}>
            <strong>Benefit:</strong> {yoga.benefit}
          </div>
        </div>
      )}
    </div>
  );
}

function ASVGrid({ ashtakavarga }: { ashtakavarga: any }) {
  // Try to extract sarvashtakavarga (total per house) from various API formats
  let houseScores: Record<number,number> = {};
  try {
    const sav = ashtakavarga?.ashtak_varga || ashtakavarga;
    if (sav && typeof sav==="object") {
      // Try "sarvashtakavarga" key first
      if (Array.isArray(sav.sarvashtakavarga)) {
        sav.sarvashtakavarga.forEach((entry: any, i: number)=>{
          houseScores[i+1] = entry?.total ?? entry?.score ?? 0;
        });
      }
    }
  } catch { /* ignore */ }

  if (Object.keys(houseScores).length===0) return (
    <div style={{ color:"#94A3B8", fontSize:"12px" }}>Ashtakavarga data not available for this chart.</div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6 }}>
      {Array.from({length:12},(_,i)=>i+1).map(h=>{
        const score = houseScores[h] ?? 0;
        const pct = Math.min(100, (score/56)*100);
        const color = score>=30?"#166534":score>=20?"#1D4ED8":"#991B1B";
        const bg    = score>=30?"#DCFCE7":score>=20?"#DBEAFE":"#FEE2E2";
        return (
          <div key={h} style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
            <div style={{ fontSize:"9px", color:"#94A3B8", fontWeight:700, letterSpacing:"0.08em" }}>H{h}</div>
            <div style={{ fontSize:"18px", fontWeight:800, color }}>{score}</div>
            <div style={{ marginTop:4, height:3, borderRadius:99, background:"#E2E8F0" }}>
              <div style={{ width:`${pct}%`, height:"100%", borderRadius:99, background:color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
