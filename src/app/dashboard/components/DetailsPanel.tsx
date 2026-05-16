"use client";
import { useState, useEffect } from "react";

interface Props { activeProfileId: string; familyProfiles: any[]; userEmail: string; }

const card: React.CSSProperties = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:12, padding:"20px 24px", marginBottom:16 };
const sec: React.CSSProperties = { fontFamily:"'Space Grotesk',sans-serif", fontSize:"11px", fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#6366F1", marginBottom:14, display:"block" };
const pill = (c:string,b:string):React.CSSProperties=>({display:"inline-block",padding:"2px 10px",borderRadius:99,fontSize:"10px",fontWeight:700,letterSpacing:"0.06em",color:c,background:b});

const KARAKA_LABELS: Record<string,string> = {
  ak:"AK — Atmakaraka (Soul's Desire)", amk:"AMK — Amatyakaraka (Career & Mind)",
  bk:"BK — Bhratrukaraka (Siblings)", mk:"MK — Matrukaraka (Mother)",
  pk:"PK — Pitrukaraka (Father)", gk:"GK — Gnatikaraka (Rivals)",
  dk:"DK — Darakaraka (Spouse / Partner)",
};
const SIGN_LORD: Record<string,string> = {
  Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",Leo:"Sun",
  Virgo:"Mercury",Libra:"Venus",Scorpio:"Mars",Sagittarius:"Jupiter",
  Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter",
};

function Row({label,value}:{label:string;value:string}) {
  return (
    <div style={{padding:"6px 0",borderBottom:"1px solid #F1F5F9"}}>
      <div style={{fontSize:"10px",color:"#94A3B8",fontWeight:600,marginBottom:2}}>{label}</div>
      <div style={{fontSize:"13px",color:"#1E293B",fontWeight:700}}>{value}</div>
    </div>
  );
}

function DashaBar({label,planet,end,remaining,start,color}:{label:string;planet:string;end?:string;remaining?:string;start?:string;color:string}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
      <div style={{width:3,height:36,borderRadius:99,background:color,flexShrink:0}}/>
      <div style={{flex:1}}>
        <div style={{fontSize:"10px",color:"#94A3B8",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>
        <div style={{fontSize:"15px",fontWeight:800,color:"#1E293B"}}>{planet||"—"}</div>
      </div>
      <div style={{textAlign:"right"}}>
        {start&&<div style={{fontSize:"10px",color:"#94A3B8"}}>From {start}</div>}
        {end&&<div style={{fontSize:"11px",color:"#334155",fontWeight:600}}>Until {end}</div>}
        {remaining&&<div style={{fontSize:"10px",color,fontWeight:700}}>{remaining}</div>}
      </div>
    </div>
  );
}

function YogaCard({yoga}:{yoga:any}) {
  const [open,setOpen]=useState(false);
  const act=yoga.status==="ACTIVATED";
  return (
    <div style={{border:`1px solid ${act?"#BBF7D0":"#FDE68A"}`,borderRadius:10,marginBottom:8,overflow:"hidden"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",background:act?"#F0FDF4":"#FFFBEB",border:"none",padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left" as const}}>
        <div>
          <div style={{fontSize:"13px",fontWeight:800,color:"#1E293B"}}>{yoga.fullName}</div>
          <div style={{fontSize:"10px",color:"#64748B",marginTop:2}}>{yoga.category} · Planets: {yoga.planets.join(", ")} · H{yoga.houses.join(", H")}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <span style={pill(act?"#166534":"#92400E",act?"#DCFCE7":"#FEF3C7")}>{yoga.status}</span>
          <span style={{color:"#94A3B8",fontSize:12}}>{open?"▲":"▼"}</span>
        </div>
      </button>
      {open&&(
        <div style={{padding:"12px 14px",borderTop:`1px solid ${act?"#BBF7D0":"#FDE68A"}`,background:"#fff"}}>
          <div style={{fontSize:"11px",color:"#475569",lineHeight:1.7,marginBottom:10}}><strong style={{color:"#334155"}}>Logic:</strong><br/>{yoga.logic}</div>
          <div style={{fontSize:"11px",color:"#166534",background:"#F0FDF4",borderRadius:8,padding:"8px 12px",lineHeight:1.7}}><strong>Benefit:</strong> {yoga.benefit}</div>
        </div>
      )}
    </div>
  );
}

function ChartViewer({profileId, data}: {profileId: string, data: any}) {
  const [chart, setChart] = useState("D1");
  const [svg, setSvg] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  
  const charts = [
    {id:"D1", name:"D1 (Rasi)"}, {id:"D2", name:"D2 (Hora)"}, {id:"D3", name:"D3 (Drekkana)"}, 
    {id:"D4", name:"D4 (Chaturthamsha)"}, {id:"D7", name:"D7 (Saptamsha)"}, {id:"D9", name:"D9 (Navamsha)"}, 
    {id:"D10", name:"D10 (Dashamsha)"}, {id:"D12", name:"D12 (Dwadashamsha)"}, {id:"D16", name:"D16 (Shodashamsha)"},
    {id:"D20", name:"D20 (Vimshamsha)"}, {id:"D24", name:"D24 (Chaturvimshamsha)"}, {id:"D27", name:"D27 (Bhamsha)"},
    {id:"D30", name:"D30 (Trimshamsha)"}, {id:"D40", name:"D40 (Khavedamsha)"}, {id:"D45", name:"D45 (Akshavedamsha)"},
    {id:"D60", name:"D60 (Shashtiamsha)"}
  ];

  useEffect(() => {
    async function loadSvg() {
      setLoading(true);
      try {
         const res = await fetch(`/api/chart-image?profileId=${profileId}&chartId=${chart}`);
         const resData = await res.json();
         if(resData.svg) setSvg(resData.svg);
      } finally {
         setLoading(false);
      }
    }
    loadSvg();
  }, [profileId, chart]);

  const { person, core, extras } = data;
  const panchang = extras?.panchang;

  return (
    <div style={card}>
       <span style={sec}>Astrological Divisional Charts & Details</span>
       
       <div style={{background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:10, padding:"16px", marginBottom: 20}}>
          <div style={{fontSize:"14px", fontWeight:800, color:"#1E293B", marginBottom: 12}}>Personal Details</div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 24px"}}>
             <Row label="Name" value={person.fullName} />
             <Row label="DOB" value={person.dob} />
             <Row label="TOB" value={person.tob} />
             <Row label="POB" value={person.pob} />
             <Row label="Nakshatra" value={core.moonNakshatra || "—"} />
             <Row label="Pada" value={core.moonNakshatraPada?.toString() || "—"} />
             <Row label="Rasi (Moon Sign)" value={core.moonSign || "—"} />
             <Row label="Tithi" value={panchang ? `${panchang.tithiName} (${panchang.tithiPaksha})` : "—"} />
          </div>
       </div>

       <div style={{fontSize:"13px", fontWeight:700, color:"#475569", marginBottom:10}}>Select Chart:</div>
       <div style={{display:"flex", gap: 8, flexWrap:"wrap", marginBottom:16}}>
         {charts.map(c => (
           <button 
             key={c.id} 
             onClick={() => setChart(c.id)} 
             style={{...pill(chart===c.id ? "#fff" : "#4F46E5", chart===c.id ? "#4F46E5" : "#EEF2FF"), border:"1px solid #C7D2FE", cursor:"pointer", padding:"6px 12px", fontSize:"11px", transition:"all 0.2s"}}
           >
             {c.name}
           </button>
         ))}
       </div>
       
       <div style={{background:"#fff", padding: 16, borderRadius: 12, border: "1px solid #E2E8F0", minHeight: 350, display:"flex", alignItems:"center", justifyContent:"center"}}>
         {loading ? (
            <div style={{color:"#64748B", fontSize:"13px", fontWeight:600, display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
              <div className="animate-spin text-2xl">⚙️</div>
              <div>Generating {chart} computation...</div>
            </div>
         ) : (
            <div dangerouslySetInnerHTML={{__html: svg || ""}} style={{width:"100%", maxWidth:400, display:"flex", justifyContent:"center"}} />
         )}
       </div>
    </div>
  );
}

export default function DetailsPanel({activeProfileId}:Props) {
  const [data,setData]=useState<any>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);

  useEffect(()=>{
    async function load() {
      setLoading(true);setError(null);setData(null);
      try {
        const res=await fetch(`/api/chart-details?profileId=${activeProfileId}`);
        const json=await res.json();
        if(!res.ok) throw new Error(json.error||"Failed to load.");
        setData(json);
      } catch(e:any){setError(e.message);}
      finally{setLoading(false);}
    }
    load();
  },[activeProfileId]);

  if(loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 m-4">
      <div className="relative mb-6">
        <div className="text-6xl animate-bounce">🔮</div>
        <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
      </div>
      <div className="text-lg font-black text-slate-800 mb-2">Generating your Astrological Blueprint... 🌸</div>
      <div className="text-[13px] text-slate-500 leading-relaxed max-w-sm mb-6">
        Hang in there, beautiful soul! 💖 Our deep-astro algorithms and high-fidelity calculation engines are rendering your precise astrological details in real-time.
      </div>
      <div className="text-[10px] font-black text-indigo-600 tracking-wider uppercase bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-200 animate-pulse">
        ⚠️ Please don't close this tab! Realtime magic is happening...
      </div>
    </div>
  );
  if(error) return <div style={{padding:24,background:"#FEF2F2",borderRadius:12,color:"#991B1B",fontSize:13,margin:16}}>{error}</div>;
  if(!data) return null;

  const {person,core,dasha,planets,houses,karakas,specialPoints,yogas,enrichments}=data;
  const {vargottama,rahuKetuAxis,moonNakData,moonNakName,planetStrengths,retrogrades}=enrichments||{};

  // Moon Sign fallback: if moonSign is blank, derive from planet data
  const moonPlanet = planets?.find((p:any)=>p.name==="Moon");
  const displayMoonSign = core.moonSign || moonPlanet?.sign || "—";

  const activated=yogas?.filter((y:any)=>y.status==="ACTIVATED")||[];
  const dormant=yogas?.filter((y:any)=>y.status==="DORMANT")||[];

  return (
    <div data-lenis-prevent style={{padding:"16px 20px",overflowY:"auto",height:"100%",background:"#F8FAFC"}}>

      {/* Header */}
      <div style={{...card,background:"linear-gradient(135deg,#6366F1,#8B5CF6)",color:"#fff",marginBottom:16}}>
        <div style={{fontSize:"1.2rem",fontWeight:800,marginBottom:6}}>{person.fullName}</div>
        <div style={{fontSize:"12px",opacity:0.85,lineHeight:1.7}}>🗓 {person.dob} &nbsp;|&nbsp; ⏰ {person.tob} &nbsp;|&nbsp; 📍 {person.pob}</div>
        <div style={{fontSize:"11px",opacity:0.65,marginTop:4}}>Timezone: {person.timezone} · Lahiri Ayanamsa · Whole Sign · Sidereal</div>
      </div>

      {/* Core Identity */}
      <div style={card}>
        <span style={sec}>⭐ Core Identity</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 24px"}}>
          <Row label="Ascendant (Lagna)" value={`${core.ascendant}${core.ascendantNakshatra?` · ${core.ascendantNakshatra} Pada ${core.ascendantNakshatraPada}`:""}`}/>
          <Row label="Ascendant Lord" value={`${core.ascLord} in ${core.ascLordSign} (House ${core.ascLordHouse})`}/>
          <Row label="Moon Sign (Rashi)" value={displayMoonSign}/>
          <Row label="Moon Nakshatra" value={`${core.moonNakshatra}${core.moonNakshatraPada?` Pada ${core.moonNakshatraPada}`:""}`}/>
        </div>
      </div>

      {/* Moon Nakshatra Deep-Dive */}
      {moonNakData&&(
        <div style={card}>
          <span style={sec}>🌙 {moonNakName} — Nakshatra Deep-Dive</span>
          <div style={{background:"linear-gradient(135deg,#EDE9FE,#F0F9FF)",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
            <div style={{fontSize:"14px",fontWeight:800,color:"#4C1D95",marginBottom:4}}>{moonNakName}</div>
            <div style={{fontSize:"11px",color:"#5B21B6",lineHeight:1.7}}>{moonNakData.nature}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 24px"}}>
            <Row label="Ruling Planet (Nakshatra Lord)" value={moonNakData.ruler}/>
            <Row label="Presiding Deity" value={moonNakData.deity}/>
            <Row label="Symbol" value={moonNakData.symbol}/>
            <Row label="Gana (Nature)" value={`${moonNakData.gana} — ${moonNakData.gana==="Deva"?"Divine, sattvic, spiritually oriented":"Manushya"===moonNakData.gana?"Human, rajasic, worldly-oriented":"Fierce, tamasic, intensely driven"}`}/>
            <Row label="Quality (Gunam)" value={moonNakData.quality}/>
          </div>
        </div>
      )}

      {/* Vargottama Planets */}
      {vargottama?.length>0&&(
        <div style={card}>
          <span style={sec}>💎 Vargottama Planets — Double Strength</span>
          <div style={{fontSize:"11px",color:"#64748B",marginBottom:14,lineHeight:1.6}}>
            A Vargottama planet occupies the <strong>same sign in both D1 (Rashi) and D9 (Navamsha)</strong>. This doubles its power — the soul-level chart confirms the physical-world promise. These are the most dependable, strongly expressed planets in your chart.
          </div>
          {vargottama.map((v:any,i:number)=>(
            <div key={i} style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"12px 16px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{fontSize:"15px",fontWeight:800,color:"#92400E"}}>{v.name}</div>
                <span style={pill("#92400E","#FEF3C7")}>VARGOTTAMA</span>
              </div>
              <div style={{fontSize:"11px",color:"#78350F",marginBottom:4}}>Sign: <strong>{v.sign}</strong> · House: <strong>{v.house}</strong></div>
              <div style={{fontSize:"11px",color:"#92400E",lineHeight:1.6}}>{v.meaning}</div>
            </div>
          ))}
        </div>
      )}

      {/* Rahu-Ketu Karmic Axis */}
      {rahuKetuAxis&&(
        <div style={card}>
          <span style={sec}>☊ Rahu–Ketu Karmic Axis</span>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:"10px",fontWeight:800,color:"#1D4ED8",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>☊ RAHU — House {rahuKetuAxis.rahuHouse} ({rahuKetuAxis.rahuSign})</div>
              <div style={{fontSize:"11px",fontWeight:700,color:"#1E3A8A",marginBottom:6}}>Your Destined Direction This Lifetime</div>
              <div style={{fontSize:"11px",color:"#1E40AF",lineHeight:1.7}}>{rahuKetuAxis.rahuDestiny}</div>
            </div>
            <div style={{background:"#FDF4FF",border:"1px solid #E9D5FF",borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:"10px",fontWeight:800,color:"#7E22CE",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>☋ KETU — House {rahuKetuAxis.ketuHouse} ({rahuKetuAxis.ketuSign})</div>
              <div style={{fontSize:"11px",fontWeight:700,color:"#581C87",marginBottom:6}}>What You've Mastered — Now Release</div>
              <div style={{fontSize:"11px",color:"#6B21A8",lineHeight:1.7}}>{rahuKetuAxis.ketuMastered}</div>
            </div>
          </div>
        </div>
      )}



      {/* Planet Strengths */}
      {planetStrengths?.length>0&&(
        <div style={card}>
          <span style={sec}>⚡ Planetary Strength Ranking</span>
          <div style={{fontSize:"11px",color:"#64748B",marginBottom:14,lineHeight:1.6}}>
            Ranked by classical dignity: Exalted (6) → Moolatrikona (5) → Own Sign (4) → Friendly (3) → Neutral (2) → Enemy (1) → Debilitated (0). Combust planets lose 1 point.
          </div>
          {planetStrengths.map((p:any,i:number)=>{
            const isTop=i<3, isWeak=p.score<=1;
            const barColor=p.score>=5?"#16A34A":p.score>=3?"#2563EB":p.score>=2?"#D97706":"#DC2626";
            return (
              <div key={p.name} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,padding:"8px 10px",borderRadius:8,background:isTop?"#F0FDF4":isWeak?"#FEF2F2":"#F8FAFC",border:`1px solid ${isTop?"#BBF7D0":isWeak?"#FECACA":"#E2E8F0"}`}}>
                <div style={{width:24,textAlign:"center",fontSize:"11px",fontWeight:800,color:isTop?"#166534":isWeak?"#991B1B":"#64748B"}}>#{i+1}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:"13px",fontWeight:800,color:"#1E293B"}}>{p.name}</span>
                    <span style={{fontSize:"10px",color:"#64748B"}}>in {p.sign} · H{p.house}</span>
                    {p.isCombust&&<span style={pill("#92400E","#FEF3C7")}>Combust</span>}
                    {p.isRetro&&<span style={pill("#1D4ED8","#DBEAFE")}>Retro</span>}
                  </div>
                  <div style={{marginTop:4,height:4,borderRadius:99,background:"#E2E8F0"}}>
                    <div style={{width:`${(p.score/6)*100}%`,height:"100%",borderRadius:99,background:barColor}}/>
                  </div>
                </div>
                <div style={{textAlign:"right",minWidth:80}}>
                  <div style={{fontSize:"10px",fontWeight:700,color:barColor}}>{p.label}</div>
                  <div style={{fontSize:"12px",fontWeight:800,color:"#1E293B"}}>{p.score}/6</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Retrograde Analysis */}
      {retrogrades?.length>0&&(
        <div style={card}>
          <span style={sec}>↩ Retrograde Planet Analysis</span>
          <div style={{fontSize:"11px",color:"#64748B",marginBottom:14,lineHeight:1.6}}>
            Retrograde planets carry intensified karmic energy from past lives. Their power is directed inward rather than outward — making their effects more profound, internalized, and ultimately more transformative.
          </div>
          {retrogrades.map((r:any,i:number)=>(
            <div key={i} style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:10,padding:"14px 16px",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{fontSize:"14px",fontWeight:800,color:"#1E40AF"}}>{r.name} ℞</span>
                <span style={{fontSize:"11px",color:"#3B82F6"}}>in {r.sign} · House {r.house}</span>
                <span style={pill("#1D4ED8","#DBEAFE")}>RETROGRADE</span>
              </div>
              <div style={{fontSize:"11px",color:"#1E3A8A",lineHeight:1.7}}>{r.meaning}</div>
            </div>
          ))}
        </div>
      )}

      {/* Dasha Timeline */}
      <div style={card}>
        <span style={sec}>⏱ Vimshottari Dasha Timeline</span>
        <DashaBar label="Mahadasha" planet={dasha.mahadasha} end={dasha.mahadashaEnd} remaining={dasha.mahadashaRemaining} color="#6366F1"/>
        <DashaBar label="Antardasha" planet={dasha.antardasha} end={dasha.antardashaEnd} remaining={dasha.antardashaRemaining} color="#8B5CF6"/>
        {dasha.pratyantar&&dasha.pratyantar!=="—"&&<DashaBar label="Pratyantar" planet={dasha.pratyantar} color="#A78BFA"/>}
        {dasha.nextMahadasha&&(
          <div style={{marginTop:12,paddingTop:12,borderTop:"1px dashed #E2E8F0"}}>
            <div style={{fontSize:"10px",fontWeight:700,color:"#94A3B8",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>Next Mahadasha</div>
            <DashaBar label="Next Mahadasha" planet={dasha.nextMahadasha} start={dasha.nextMahadashaStart} end={dasha.nextMahadashaEnd} color="#10B981"/>
          </div>
        )}
      </div>

      {/* Planets Table */}
      <div style={card}>
        <span style={sec}>🪐 Planetary Positions (D1 — Rashi Chart)</span>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px"}}>
            <thead>
              <tr style={{borderBottom:"2px solid #E2E8F0"}}>
                {["Planet","Sign","House","Degree","Nakshatra","Pada","Status"].map(h=>(
                  <th key={h} style={{padding:"6px 8px",textAlign:"left",color:"#64748B",fontWeight:700,fontSize:"10px",letterSpacing:"0.06em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planets.map((p:any)=>{
                const flags=[p.isRetro?"Retro":"",p.isExalted?"Exalted":"",p.isDebilitated?"Debilitated":"",p.isCombust?"Combust":""].filter(Boolean);
                return (
                  <tr key={p.name} style={{borderBottom:"1px solid #F1F5F9"}}>
                    <td style={{padding:"7px 8px",fontWeight:700,color:"#1E293B"}}>{p.name}</td>
                    <td style={{padding:"7px 8px",color:"#334155"}}>{p.sign}</td>
                    <td style={{padding:"7px 8px",color:"#334155",textAlign:"center"}}>{p.house}</td>
                    <td style={{padding:"7px 8px",color:"#334155",fontFamily:"monospace"}}>{(p.normDegree||0).toFixed(2)}°</td>
                    <td style={{padding:"7px 8px",color:"#334155"}}>{p.nakshatra||"—"}</td>
                    <td style={{padding:"7px 8px",color:"#334155",textAlign:"center"}}>{p.nakshatraPada||"—"}</td>
                    <td style={{padding:"7px 8px"}}>
                      {flags.length===0?<span style={{color:"#94A3B8"}}>—</span>:flags.map(f=>(
                        <span key={f} style={{...pill(f==="Exalted"?"#166534":f==="Debilitated"?"#991B1B":f==="Retro"?"#1D4ED8":"#92400E",f==="Exalted"?"#DCFCE7":f==="Debilitated"?"#FEE2E2":f==="Retro"?"#DBEAFE":"#FEF3C7"),marginRight:3}}>{f}</span>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Houses */}
      <div style={card}>
        <span style={sec}>🏠 All 12 Houses (Bhava)</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {houses.map((h:any)=>(
            <div key={h.number} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:"10px",fontWeight:800,color:"#6366F1",letterSpacing:"0.08em",marginBottom:3}}>H{h.number} — {h.sign}</div>
              <div style={{fontSize:"10px",color:"#64748B",marginBottom:3}}>Lord: {SIGN_LORD[h.sign]||"?"}</div>
              <div style={{fontSize:"11px",color:"#1E293B",fontWeight:600}}>{h.occupants?.length>0?h.occupants.join(", "):<span style={{color:"#CBD5E1"}}>Empty</span>}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Karakas */}
      <div style={card}>
        <span style={sec}>👑 Jaimini Karakas</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 24px"}}>
          {Object.entries(KARAKA_LABELS).map(([key,label])=>(
            <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"8px 0",borderBottom:"1px solid #F1F5F9"}}>
              <div style={{fontSize:"11px",color:"#64748B",lineHeight:1.4,maxWidth:"70%"}}>{label}</div>
              <div style={{fontSize:"13px",fontWeight:800,color:"#6366F1",marginLeft:8}}>{karakas[key]||"—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Points */}
      <div style={card}>
        <span style={sec}>🔮 Special Sensitive Points</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 24px"}}>
          <Row label="Arudha Lagna (AL) — Public Image & Status" value={specialPoints.AL||"—"}/>
          <Row label="Upapada Lagna (UL) — Marriage & Bond" value={specialPoints.UL||"—"}/>
          <Row label="A7 Darapada — Physical Attraction" value={specialPoints.A7||"—"}/>
          <Row label="Pranapada Lagna — Life Force Center" value={specialPoints.PP||"—"}/>
        </div>
      </div>

      {/* Yogas */}
      <div style={card}>
        <span style={sec}>✨ Classical Yogas ({yogas?.length||0} detected)</span>
        {activated.length>0&&(
          <>
            <div style={{fontSize:"10px",fontWeight:800,color:"#166534",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>🟢 ACTIVATED ({activated.length})</div>
            {activated.map((y:any,i:number)=><YogaCard key={i} yoga={y}/>)}
          </>
        )}
        {dormant.length>0&&(
          <>
            <div style={{fontSize:"10px",fontWeight:800,color:"#92400E",letterSpacing:"0.1em",textTransform:"uppercase",margin:"16px 0 10px"}}>🟡 DORMANT / LATENT ({dormant.length})</div>
            {dormant.map((y:any,i:number)=><YogaCard key={i} yoga={y}/>)}
          </>
        )}
        {(!yogas||yogas.length===0)&&<div style={{color:"#94A3B8",fontSize:"13px"}}>No classical yogas detected.</div>}
      </div>

      {/* Chart Viewer */}
      <ChartViewer profileId={activeProfileId} data={data} />

      <div style={{height:40}}/>
    </div>
  );
}
