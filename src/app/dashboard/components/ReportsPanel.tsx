"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_LINES = [
  "Reading your exact Nakshatra from planetary positions...",
  "Calculating your Moon's precise degree and Pada...",
  "Decoding your Rising sign from your birth time...",
  "Synthesizing your personalized intelligence...",
  "Writing your brutal, legit Quantum Karma analysis...",
];

const PDF_BASIC_LINES = [
  "Mapping your planetary positions across all 12 houses...",
  "Computing your Vimshottari Dasha timeline...",
  "Encoding your Ascendant and Moon Sign data...",
  "Applying Quantum Karma formatting...",
  "Removing gemstone content...",
];

const PDF_PRO_LINES = [
  "Pulling all 12 divisional charts (D1 through D12)...",
  "Computing Char Dasha and Vimshottari layers...",
  "Analyzing Ashtakavarga matrices...",
  "Encoding 68 pages of hyper-personalized intelligence...",
  "Quantum Karma branding applied. Finalizing...",
];

interface NakReport {
  name: string; pada: number; rulingPlanet: string; tagline: string; shadowSide: string;
  strengths: string[]; maleTraits: string; femaleTraits: string; career: string; relationships: string; actionPlan: string[];
}
interface AscReport {
  sign: string; tagline: string; firstImpression: string; body: string;
  lifeTheme: string; shadowSide: string; actionPlan: string[];
}
interface ReportData { parsed: { nakshatra: NakReport; ascendant: AscReport } }

export default function ReportsPanel({ profileId }: { profileId: string }) {
  const [tab, setTab] = useState<"pdf" | "nakshatra" | "ascendant">("pdf");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [report, setReport] = useState<ReportData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingLine, setLoadingLine] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "loading") {
      timerRef.current = setInterval(() => setLoadingLine(l => (l + 1) % LOADING_LINES.length), 2500);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  useEffect(() => {
    if (!profileId) return;
    checkSaved();
  }, [profileId]);

  async function checkSaved() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/nakshatra-ascendant?profileId=${profileId}`);
      const data = await res.json();
      if (data.found && data.reportData) { setReport(data.reportData); setStatus("done"); }
      else setStatus("idle");
    } catch { setStatus("idle"); }
  }

  async function generate() {
    setStatus("loading"); setErrorMsg(""); setLoadingLine(0);
    try {
      const res = await fetch("/api/nakshatra-ascendant", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Failed"); setStatus("error"); return; }
      setReport(data); setStatus("done");
    } catch { setErrorMsg("Network error."); setStatus("error"); }
  }

  const tabs = [
    { id: "pdf",       label: "Horoscope PDFs",   icon: "📄" },
    { id: "nakshatra", label: "Nakshatra",         icon: "🌟" },
    { id: "ascendant", label: "Ascendant",         icon: "⬆️" },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto w-full">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 md:px-10 py-5 sticky top-0 z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">📋</div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Intelligence Reports</h2>
            <p className="text-xs text-slate-400 font-medium">Birth chart · Nakshatra · Rising sign</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all border ${
                tab === t.id ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300"
              }`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {tab === "pdf" && (
            <motion.div key="pdf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="px-6 md:px-10 lg:px-16 py-10">
              <PdfSection profileId={profileId} />
            </motion.div>
          )}

          {(tab === "nakshatra" || tab === "ascendant") && (
            <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {status === "idle" && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                  <div className="text-6xl mb-6">{tab === "nakshatra" ? "🌟" : "⬆️"}</div>
                  <h3 className="text-2xl font-black text-slate-800 mb-3">
                    {tab === "nakshatra" ? "Decode Your Nakshatra" : "Decode Your Rising Sign"}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-md">
                    {tab === "nakshatra"
                      ? "We extract your exact Moon Nakshatra from the planetary engine and synthesize a brutal, personalized reading — career, relationships, shadow side, and actionable plan."
                      : "Your Ascendant is the mask the world sees and the soul path you're walking. We decode it from your exact birth time and rewrite the generic text into something real."}
                  </p>
                  <button onClick={generate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-indigo-600/20 transition-all hover:scale-105">
                    Generate Report
                  </button>
                </div>
              )}

              {status === "loading" && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
                  <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
                      {tab === "nakshatra" ? "🌟" : "⬆️"}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Live Computation Running</h3>
                  <p className="text-indigo-600 text-sm font-bold text-center max-w-sm">{LOADING_LINES[loadingLine]}</p>
                </div>
              )}

              {status === "error" && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                  <div className="text-5xl mb-4">⚠️</div>
                  <p className="text-slate-600 text-sm mb-6">{errorMsg}</p>
                  <button onClick={generate} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold">Try Again</button>
                </div>
              )}

              {status === "done" && report?.parsed && tab === "nakshatra" && (
                <NakshatraView data={report.parsed.nakshatra} />
              )}
              {status === "done" && report?.parsed && tab === "ascendant" && (
                <AscendantView data={report.parsed.ascendant} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Nakshatra View ────────────────────────────────────────────────────────────
function NakshatraView({ data }: { data: NakReport }) {
  return (
    <div className="w-full">
      {/* Hero */}
      <div className="px-6 md:px-10 lg:px-16 pt-10 pb-8 border-b border-slate-100">
        <div className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2">Moon Nakshatra Blueprint</div>
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
          <h3 className="text-4xl md:text-5xl font-black text-slate-900">{data.name}</h3>
          {data.pada && <span className="text-xl md:text-2xl font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg w-fit">Pada {data.pada}</span>}
        </div>
        {data.rulingPlanet && (
          <p className="text-slate-400 text-sm font-medium mb-4">Ruled by <span className="font-black text-slate-700">{data.rulingPlanet}</span></p>
        )}
        <p className="text-xl font-bold text-indigo-600 italic max-w-2xl">"{data.tagline}"</p>
      </div>

      {/* Shadow Side */}
      <div className="px-6 md:px-10 lg:px-16 py-8 border-b border-slate-100 bg-red-50/50">
        <div className="text-xs font-black text-red-500 uppercase tracking-widest mb-3">⚠️ Shadow Side</div>
        <p className="text-slate-700 text-base leading-relaxed font-medium max-w-4xl">{data.shadowSide}</p>
      </div>

      {/* Gender Manifestations */}
      <div className="px-6 md:px-10 lg:px-16 py-8 border-b border-slate-100 bg-slate-50">
        <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">🧬 Energy Manifestation by Gender</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">♂</span>
              <h4 className="font-black text-slate-800">Male Manifestation</h4>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{data.maleTraits}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">♀</span>
              <h4 className="font-black text-slate-800">Female Manifestation</h4>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{data.femaleTraits}</p>
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className="px-6 md:px-10 lg:px-16 py-8 border-b border-slate-100">
        <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-5">✦ Core Strengths</div>
        <div className="space-y-3 max-w-4xl">
          {data.strengths?.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-slate-700 text-[15px] leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Career */}
      <div className="px-6 md:px-10 lg:px-16 py-8 border-b border-slate-100">
        <div className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3">💼 Career & Path</div>
        <p className="text-slate-700 text-base leading-relaxed max-w-4xl">{data.career}</p>
      </div>

      {/* Relationships */}
      <div className="px-6 md:px-10 lg:px-16 py-8 border-b border-slate-100">
        <div className="text-xs font-black text-pink-600 uppercase tracking-widest mb-3">💞 Love & Relationships</div>
        <p className="text-slate-700 text-base leading-relaxed max-w-4xl">{data.relationships}</p>
      </div>

      {/* Action Plan */}
      <div className="px-6 md:px-10 lg:px-16 py-10">
        <div className="text-xs font-black text-violet-600 uppercase tracking-widest mb-5">🎯 Your Action Plan</div>
        <div className="space-y-4 max-w-4xl">
          {data.actionPlan?.map((a, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-black flex-shrink-0">{i + 1}</div>
              <p className="text-slate-700 text-[15px] leading-relaxed pt-1">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Ascendant View ────────────────────────────────────────────────────────────
function AscendantView({ data }: { data: AscReport }) {
  return (
    <div className="w-full">
      {/* Hero */}
      <div className="px-6 md:px-10 lg:px-16 pt-10 pb-8 border-b border-slate-100">
        <div className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2">Your Rising Sign</div>
        <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">
          You Rise as{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{data.sign}</span>
        </h3>
        <p className="text-xl font-bold text-indigo-600 italic max-w-2xl">"{data.tagline}"</p>
      </div>

      {/* First Impression */}
      <div className="px-6 md:px-10 lg:px-16 py-8 border-b border-slate-100">
        <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">👁️ How Others See You</div>
        <p className="text-slate-700 text-base leading-relaxed max-w-4xl">{data.firstImpression}</p>
      </div>

      {/* Body */}
      <div className="px-6 md:px-10 lg:px-16 py-8 border-b border-slate-100">
        <div className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3">⚡ Physical Energy</div>
        <p className="text-slate-700 text-base leading-relaxed max-w-4xl">{data.body}</p>
      </div>

      {/* Life Theme */}
      <div className="px-6 md:px-10 lg:px-16 py-8 border-b border-slate-100">
        <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-3">🌱 Your Life Theme</div>
        <p className="text-slate-700 text-base leading-relaxed max-w-4xl">{data.lifeTheme}</p>
      </div>

      {/* Shadow */}
      <div className="px-6 md:px-10 lg:px-16 py-8 border-b border-slate-100 bg-red-50/50">
        <div className="text-xs font-black text-red-500 uppercase tracking-widest mb-3">⚠️ Shadow Side & Ego Trap</div>
        <p className="text-slate-700 text-base leading-relaxed max-w-4xl">{data.shadowSide}</p>
      </div>

      {/* Action Plan */}
      <div className="px-6 md:px-10 lg:px-16 py-10">
        <div className="text-xs font-black text-violet-600 uppercase tracking-widest mb-5">🎯 Your Action Plan</div>
        <div className="space-y-4 max-w-4xl">
          {data.actionPlan?.map((a, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-black flex-shrink-0">{i + 1}</div>
              <p className="text-slate-700 text-[15px] leading-relaxed pt-1">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PDF Section ──────────────────────────────────────────────────────────────
function PdfSection({ profileId }: { profileId: string }) {
  const [basicStatus, setBasicStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [proStatus, setProStatus] = useState<"idle" | "checking" | "locked" | "unlocking" | "ready" | "error">("checking");
  const [basicUrl, setBasicUrl] = useState<string | null>(null);
  const [proUrl, setProUrl] = useState<string | null>(null);
  const [basicLine, setBasicLine] = useState(0);
  const [proLine, setProLine] = useState(0);
  const [proError, setProError] = useState<string | null>(null);
  const [basicError, setBasicError] = useState<string | null>(null);

  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (basicStatus === "loading") t = setInterval(() => setBasicLine(l => (l + 1) % PDF_BASIC_LINES.length), 2500);
    return () => clearInterval(t);
  }, [basicStatus]);

  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (proStatus === "unlocking") t = setInterval(() => setProLine(l => (l + 1) % PDF_PRO_LINES.length), 2200);
    return () => clearInterval(t);
  }, [proStatus]);

  useEffect(() => {
    if (!profileId) return;
    (async () => {
      try {
        const res = await fetch(`/api/pdf-report?profileId=${profileId}&type=pro`);
        if (res.status === 402) { setProStatus("locked"); return; }
        const data = await res.json();
        if (data.url) { setProUrl(data.url); setProStatus("ready"); } else setProStatus("locked");
      } catch { setProStatus("locked"); }
    })();
  }, [profileId]);

  async function handleBasic() {
    if (basicUrl) { window.open(basicUrl, "_blank"); return; }
    setBasicStatus("loading"); setBasicError(null);
    try {
      const res = await fetch(`/api/pdf-report?profileId=${profileId}&type=basic`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setBasicUrl(data.url); setBasicStatus("ready"); window.open(data.url, "_blank");
    } catch (e: any) { setBasicError(e.message); setBasicStatus("error"); }
  }

  async function handleProUnlock() {
    setProStatus("unlocking"); setProError(null);
    try {
      const res = await fetch("/api/pdf-report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId }) });
      const data = await res.json();
      if (res.status === 402) {
        setProError(data.error === "insufficient_credits" ? `Need ${data.required} credits. You have ${data.available}.` : "Payment required.");
        setProStatus("locked"); return;
      }
      if (!res.ok) throw new Error(data.error || "Failed");
      setProUrl(data.url); setProStatus("ready"); window.open(data.url, "_blank");
    } catch (e: any) { setProError(e.message); setProStatus("locked"); }
  }

  return (
    <div className="space-y-16 max-w-3xl">
      <div>
        <div className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-3">Your Reports</div>
        <h3 className="text-3xl font-black text-slate-900 mb-2">Full Vedic diagnosis.<br /><span className="text-indigo-600">Packaged and permanent.</span></h3>
        <p className="text-slate-500 text-sm leading-relaxed">Generated once, stored securely, downloadable forever. No repeat charges. Zero gemstone recommendations — ever.</p>
      </div>

      {/* Basic */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Free Report</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        <div className="flex items-start gap-4 mb-5">
          <div className="text-4xl">📘</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-xl font-black text-slate-800">Core Horoscope Report</h4>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">FREE FOREVER</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">A 9-page deep-dive into your planetary architecture. Lagna, Moon sign, Dasha timing — formatted as a branded Quantum Karma PDF.</p>
          </div>
        </div>
        {basicStatus === "loading" && (
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mb-4">
            <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            {PDF_BASIC_LINES[basicLine]}
          </div>
        )}
        {basicError && <p className="text-red-500 text-sm mb-4">{basicError}</p>}
        <button onClick={handleBasic} disabled={basicStatus === "loading"}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
            basicStatus === "loading" ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
            basicStatus === "ready" ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md" :
            "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:scale-[1.02]"
          }`}>
          {basicStatus === "loading" ? "⏳ Generating..." : basicStatus === "ready" ? "⬇️ Download Again" : "⬇️ Download Free Report"}
        </button>
      </div>

      {/* Pro */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Pro — 5 Credits</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        <div className="flex items-start gap-4 mb-5">
          <div className="text-4xl">📗</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-xl font-black text-slate-800">Professional Horoscope Report</h4>
              {proStatus === "ready" && <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">✦ UNLOCKED</span>}
              {proStatus === "locked" && <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">5 Credits</span>}
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">The full 68-page diagnostic. All divisional charts, Vimshottari + Char Dasha, 5-year transits, activated yogas. Unlocked once — yours forever.</p>
          </div>
        </div>
        {proStatus === "checking" && <div className="flex items-center gap-2 text-slate-400 text-sm mb-4"><div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" /> Checking access...</div>}
        {proStatus === "unlocking" && (
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold mb-4">
            <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
            {PDF_PRO_LINES[proLine]}
          </div>
        )}
        {proError && <p className="text-red-500 text-sm mb-4">{proError}</p>}
        {proStatus === "locked" && (
          <button onClick={handleProUnlock} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-[1.02] shadow-md transition-all">
            ✦ Unlock for 5 Credits
          </button>
        )}
        {proStatus === "ready" && (
          <button onClick={() => window.open(proUrl!, "_blank")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-[1.02] shadow-md transition-all">
            ⬇️ Download Pro Report (68 Pages)
          </button>
        )}
      </div>
    </div>
  );
}
