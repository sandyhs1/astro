"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PAL } from "./destiny-theme";
import { FEATURE_CREDITS, NAKSHATRA_ASC_BUNDLE_COST } from "@/lib/pricing/feature-credits";

const LOADING_LINES = [
  "Reading your exact Nakshatra from planetary positions…",
  "Calculating your Moon's precise degree and Pada…",
  "Decoding your Rising sign from your birth time…",
  "Synthesising your personalised intelligence…",
  "Writing your Quantum Karma analysis…",
];

const PDF_BASIC_LINES = [
  "Mapping your planetary positions across all 12 houses…",
  "Computing your Vimshottari Dasha timeline…",
  "Encoding your Ascendant and Moon Sign data…",
  "Applying Quantum Karma formatting…",
  "Removing gemstone content…",
];

const PDF_PRO_LINES = [
  "Pulling all 12 divisional charts (D1 through D12)…",
  "Computing Char Dasha and Vimshottari layers…",
  "Analyzing Ashtakavarga matrices…",
  "Encoding 68 pages of hyper-personalised intelligence…",
  "Quantum Karma branding applied. Finalising…",
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

  useEffect(() => { if (profileId) checkSaved(); }, [profileId]);

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
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Failed"); setStatus("error"); return; }
      setReport(data); setStatus("done");
    } catch { setErrorMsg("Network error."); setStatus("error"); }
  }

  const tabs = [
    { id: "pdf",       label: "Horoscope PDFs", symbol: "❑" },
    { id: "nakshatra", label: "Nakshatra",      symbol: "✦" },
    { id: "ascendant", label: "Ascendant",      symbol: "↑" },
  ] as const;

  return (
    <div data-lenis-prevent className="flex flex-col w-full" style={{ background: PAL.paper, color: PAL.ink }}>
      {/* Header */}
      <div
        className="px-5 md:px-7 lg:px-9 py-4 md:py-5 sticky top-0 z-10 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        style={{ background: "rgba(250,247,242,0.92)", borderBottom: `1px solid ${PAL.border2}` }}
      >
        <div className="flex items-baseline gap-3">
          <span className="serif-display italic text-[18px] md:text-[22px]" style={{ color: PAL.accent }}>📜</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
              Reports
            </p>
            <h2 className="serif-display text-[18px] md:text-[22px] font-semibold leading-none tracking-tight mt-0.5" style={{ color: PAL.ink }}>
              Intelligence reports
            </h2>
            <p className="serif-text italic text-[11.5px] mt-1" style={{ color: PAL.ink3 }}>
              Birth chart · Nakshatra · Rising sign
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="serif-text text-[12.5px] font-semibold inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm transition-colors"
              style={
                tab === t.id
                  ? { background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }
                  : { background: "transparent", color: PAL.ink2, border: `1px solid ${PAL.border}` }
              }
            >
              <span>{t.symbol}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {tab === "pdf" && (
            <motion.div key="pdf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="px-4 md:px-7 lg:px-9 py-6 md:py-8"
            >
              <PdfSection profileId={profileId} />
            </motion.div>
          )}

          {(tab === "nakshatra" || tab === "ascendant") && (
            <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {status === "idle" && (
                <div className="flex flex-col items-center justify-center px-6 py-14 md:py-20 text-center">
                  <div
                    className="w-24 h-24 rounded-sm grid place-items-center serif-display text-[42px] mb-7"
                    style={{ background: PAL.paper2, color: PAL.accent, border: `1px solid ${PAL.border}` }}
                  >
                    {tab === "nakshatra" ? "✦" : "↑"}
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
                    Begin · {tab === "nakshatra" ? "nakshatra" : "ascendant"}
                  </p>
                  <h3 className="serif-display text-[26px] md:text-[34px] font-semibold tracking-tight leading-tight" style={{ color: PAL.ink }}>
                    {tab === "nakshatra" ? "Decode your nakshatra." : "Decode your rising sign."}
                  </h3>
                  <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed mt-3 max-w-md" style={{ color: PAL.ink2 }}>
                    {tab === "nakshatra"
                      ? "We extract your exact Moon Nakshatra and synthesise a brutal, personalised reading — career, relationships, shadow side, and an actionable plan."
                      : "Your Ascendant is the mask the world sees and the soul path you're walking. We decode it from your exact birth time and rewrite the generic text into something real."}
                  </p>
                  <button
                    onClick={generate}
                    className="mt-7 serif-text text-[13px] font-semibold px-6 py-3 rounded-sm text-white transition-opacity hover:opacity-90"
                    style={{ background: PAL.accent }}
                  >
                    Generate report · {NAKSHATRA_ASC_BUNDLE_COST} credits
                  </button>
                </div>
              )}

              {status === "loading" && (
                <div className="flex flex-col items-center justify-center px-6 py-14 md:py-20 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
                    Live computation
                  </p>
                  <h3 className="serif-display text-[24px] md:text-[28px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
                    Reading your exact configuration…
                  </h3>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingLine}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      className="serif-text italic text-[13.5px] mt-3 max-w-sm" style={{ color: PAL.ink2 }}
                    >
                      {LOADING_LINES[loadingLine]}
                    </motion.p>
                  </AnimatePresence>
                  <div className="mt-6 inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                  <div className="serif-display text-[42px]" style={{ color: PAL.rose }}>⚠︎</div>
                  <h3 className="serif-display text-[20px] font-semibold mt-3" style={{ color: PAL.ink }}>Generation failed</h3>
                  <p className="serif-text text-[13.5px] italic mt-1" style={{ color: PAL.ink2 }}>{errorMsg}</p>
                  <button
                    onClick={generate}
                    className="mt-5 serif-text text-[13px] font-semibold px-5 py-2.5 rounded-sm text-white transition-opacity hover:opacity-90"
                    style={{ background: PAL.ink }}
                  >
                    Try again
                  </button>
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

/* ── Nakshatra ───────────────────────────────────────────────────── */
function NakshatraView({ data }: { data: NakReport }) {
  return (
    <div className="w-full">
      {/* Hero */}
      <header className="px-4 md:px-7 lg:px-9 py-7 md:py-9" style={{ borderBottom: `1px solid ${PAL.border}` }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
          Moon nakshatra blueprint
        </p>
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
          <h3 className="serif-display text-[42px] md:text-[56px] font-semibold tracking-tight leading-[0.95]" style={{ color: PAL.ink }}>
            {data.name}
          </h3>
          {data.pada && (
            <span
              className="serif-display text-[18px] md:text-[20px] font-semibold w-fit px-3 py-1 rounded-sm"
              style={{ color: PAL.accent, background: PAL.paper2, border: `1px solid ${PAL.border}` }}
            >
              Pada {data.pada}
            </span>
          )}
        </div>
        {data.rulingPlanet && (
          <p className="serif-text text-[14px] mt-2" style={{ color: PAL.ink3 }}>
            Ruled by <strong style={{ color: PAL.ink }}>{data.rulingPlanet}</strong>
          </p>
        )}
        <p className="serif-display italic text-[18px] md:text-[22px] mt-4 max-w-2xl" style={{ color: PAL.accent }}>
          &ldquo;{data.tagline}&rdquo;
        </p>
      </header>

      <Section eyebrow="Shadow side" toneBg={PAL.roseBg} toneInk={PAL.rose}>
        <p className="serif-text text-[15px] md:text-[16px] leading-relaxed max-w-3xl" style={{ color: PAL.ink }}>
          {data.shadowSide}
        </p>
      </Section>

      <Section eyebrow="Energy manifestation by gender" toneBg={PAL.paper2} toneInk={PAL.accent}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
          <div className="rounded-sm p-5 md:p-6"
            style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
              ♂ Male manifestation
            </p>
            <p className="serif-text text-[14px] md:text-[15px] leading-relaxed" style={{ color: PAL.ink2 }}>
              {data.maleTraits}
            </p>
          </div>
          <div className="rounded-sm p-5 md:p-6"
            style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
              ♀ Female manifestation
            </p>
            <p className="serif-text text-[14px] md:text-[15px] leading-relaxed" style={{ color: PAL.ink2 }}>
              {data.femaleTraits}
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Core strengths">
        <ul className="space-y-3 max-w-3xl">
          {data.strengths?.map((s, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="serif-display italic text-[14px] tabular-nums w-7 flex-shrink-0 mt-1" style={{ color: PAL.sage }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed" style={{ color: PAL.ink2 }}>
                {s}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Career & path">
        <p className="serif-text text-[15px] md:text-[16px] leading-relaxed max-w-3xl" style={{ color: PAL.ink }}>
          {data.career}
        </p>
      </Section>

      <Section eyebrow="Love & relationships">
        <p className="serif-text text-[15px] md:text-[16px] leading-relaxed max-w-3xl" style={{ color: PAL.ink }}>
          {data.relationships}
        </p>
      </Section>

      <Section eyebrow="Your action plan" last>
        <ol className="space-y-4 max-w-3xl">
          {data.actionPlan?.map((a, i) => (
            <li key={i} className="flex items-start gap-4">
              <span
                className="w-8 h-8 rounded-sm grid place-items-center serif-display text-[13px] font-semibold flex-shrink-0"
                style={{ background: PAL.accent, color: PAL.paper, border: `1px solid ${PAL.accent}` }}
              >
                {i + 1}
              </span>
              <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed pt-1" style={{ color: PAL.ink2 }}>
                {a}
              </p>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

/* ── Ascendant ───────────────────────────────────────────────────── */
function AscendantView({ data }: { data: AscReport }) {
  return (
    <div className="w-full">
      <header className="px-4 md:px-7 lg:px-9 py-7 md:py-9" style={{ borderBottom: `1px solid ${PAL.border}` }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
          Your rising sign
        </p>
        <h3 className="serif-display text-[36px] md:text-[52px] font-semibold tracking-tight leading-[0.95]" style={{ color: PAL.ink }}>
          You rise as <span style={{ color: PAL.accent }}>{data.sign}</span>.
        </h3>
        <p className="serif-display italic text-[18px] md:text-[22px] mt-4 max-w-2xl" style={{ color: PAL.accent }}>
          &ldquo;{data.tagline}&rdquo;
        </p>
      </header>

      <Section eyebrow="How others see you">
        <p className="serif-text text-[15px] md:text-[16px] leading-relaxed max-w-3xl" style={{ color: PAL.ink }}>
          {data.firstImpression}
        </p>
      </Section>

      <Section eyebrow="Physical energy">
        <p className="serif-text text-[15px] md:text-[16px] leading-relaxed max-w-3xl" style={{ color: PAL.ink }}>
          {data.body}
        </p>
      </Section>

      <Section eyebrow="Your life theme">
        <p className="serif-text text-[15px] md:text-[16px] leading-relaxed max-w-3xl" style={{ color: PAL.ink }}>
          {data.lifeTheme}
        </p>
      </Section>

      <Section eyebrow="Shadow side & ego trap" toneBg={PAL.roseBg} toneInk={PAL.rose}>
        <p className="serif-text text-[15px] md:text-[16px] leading-relaxed max-w-3xl" style={{ color: PAL.ink }}>
          {data.shadowSide}
        </p>
      </Section>

      <Section eyebrow="Your action plan" last>
        <ol className="space-y-4 max-w-3xl">
          {data.actionPlan?.map((a, i) => (
            <li key={i} className="flex items-start gap-4">
              <span
                className="w-8 h-8 rounded-sm grid place-items-center serif-display text-[13px] font-semibold flex-shrink-0"
                style={{ background: PAL.accent, color: PAL.paper, border: `1px solid ${PAL.accent}` }}
              >
                {i + 1}
              </span>
              <p className="serif-text text-[14.5px] md:text-[15.5px] leading-relaxed pt-1" style={{ color: PAL.ink2 }}>
                {a}
              </p>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

function Section({ eyebrow, children, toneBg, toneInk, last = false }: {
  eyebrow: string; children: React.ReactNode;
  toneBg?: string; toneInk?: string; last?: boolean;
}) {
  return (
    <section
      className="px-4 md:px-7 lg:px-9 py-7 md:py-9"
      style={{
        background: toneBg ?? "transparent",
        borderBottom: last ? "none" : `1px solid ${PAL.border}`,
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: toneInk ?? PAL.accent }}>
        {eyebrow}
      </p>
      {children}
    </section>
  );
}

/* ── PDF section ─────────────────────────────────────────────────── */
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

  async function handleBasic(force = false) {
    if (basicUrl && !force) { window.open(basicUrl, "_blank"); return; }
    setBasicStatus("loading"); setBasicError(null); setBasicLine(0);
    try {
      const res = await fetch(`/api/pdf-report?profileId=${profileId}&type=basic${force ? "&force=true" : ""}`);
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
    <div className="space-y-10 max-w-3xl">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.accent }}>
          Your reports
        </p>
        <h3 className="serif-display text-[28px] md:text-[36px] font-semibold tracking-tight leading-tight" style={{ color: PAL.ink }}>
          Full Vedic diagnosis.
          <br />
          <span style={{ color: PAL.accent }}>Packaged and permanent.</span>
        </h3>
        <p className="serif-text text-[14.5px] md:text-[15px] leading-relaxed mt-3 max-w-2xl" style={{ color: PAL.ink2 }}>
          Generated once, stored securely, downloadable forever. No repeat charges. Zero gemstone recommendations — ever.
        </p>
      </header>

      {/* Basic */}
      <section>
        <Divider label={`Core · ${FEATURE_CREDITS.core_horoscope} credits`} />
        <div className="flex items-start gap-4 mb-4">
          <span
            className="w-12 h-12 rounded-sm grid place-items-center serif-display text-[20px] flex-shrink-0"
            style={{ background: PAL.sageBg, color: PAL.sage, border: `1px solid #C7D6BB` }}
          >
            ❑
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="serif-display text-[18px] md:text-[20px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
                Core horoscope report
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
                style={{ color: PAL.sage, background: PAL.sageBg, border: `1px solid #C7D6BB` }}
              >
                {FEATURE_CREDITS.core_horoscope} credits · one-time
              </span>
            </div>
            <p className="serif-text text-[14px] leading-relaxed" style={{ color: PAL.ink2 }}>
              A 20+ page deep-dive into your planetary architecture. Lagna, Moon sign, Dasha timing — formatted as a branded Quantum Karma PDF.
            </p>
          </div>
        </div>

        {basicStatus === "loading" && (
          <p className="serif-text italic text-[12.5px] mt-2 mb-3 inline-flex items-center gap-2" style={{ color: PAL.accent }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent }} />
            {PDF_BASIC_LINES[basicLine]}
          </p>
        )}
        {basicError && (
          <p className="serif-text text-[13px] mt-2 mb-3 px-3 py-2 rounded-sm"
            style={{ background: PAL.roseBg, color: PAL.rose, border: `1px solid #E5BFC1` }}
          >
            {basicError}
          </p>
        )}

        <div className="flex items-center gap-2.5 flex-wrap mt-3">
          <button
            onClick={() => handleBasic(false)}
            disabled={basicStatus === "loading"}
            className="serif-text text-[13px] font-semibold px-5 py-2.5 rounded-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            style={
              basicStatus === "ready"
                ? { background: PAL.sage, color: PAL.paper, border: `1px solid ${PAL.sage}` }
                : { background: PAL.accent, color: PAL.paper, border: `1px solid ${PAL.accent}` }
            }
          >
            {basicStatus === "loading" ? "Generating…" : basicStatus === "ready" ? "⬇ Download again" : "⬇ Download free report"}
          </button>
          {basicStatus === "ready" && (
            <button
              onClick={() => handleBasic(true)}
              className="serif-text text-[12px] font-semibold px-4 py-2.5 rounded-sm transition-colors hover:bg-black/[0.04]"
              style={{ color: PAL.ink2, border: `1px solid ${PAL.border}` }}
            >
              ↻ Regenerate
            </button>
          )}
        </div>
      </section>

      {/* Pro */}
      <section>
        <Divider label={`Pro · ${FEATURE_CREDITS.professional_horoscope} credits`} tone="gold" />
        <div className="flex items-start gap-4 mb-4">
          <span
            className="w-12 h-12 rounded-sm grid place-items-center serif-display text-[20px] flex-shrink-0"
            style={{ background: PAL.amberBg, color: PAL.gold, border: `1px solid #E1CE9B` }}
          >
            ◆
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="serif-display text-[18px] md:text-[20px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
                Professional horoscope report
              </h4>
              {proStatus === "ready" && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
                  style={{ color: "#5A3A8F", background: "#ECE6F4", border: `1px solid #D2C4E5` }}
                >
                  ✦ Unlocked
                </span>
              )}
              {proStatus === "locked" && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
                  style={{ color: PAL.gold, background: PAL.amberBg, border: `1px solid #E1CE9B` }}
                >
                  {FEATURE_CREDITS.professional_horoscope} credits
                </span>
              )}
            </div>
            <p className="serif-text text-[14px] leading-relaxed" style={{ color: PAL.ink2 }}>
              The full 68-page diagnostic. All divisional charts, Vimshottari + Char Dasha, 5-year transits, activated yogas. Unlocked once — yours forever.
            </p>
          </div>
        </div>

        {proStatus === "checking" && (
          <p className="serif-text italic text-[12.5px] inline-flex items-center gap-2" style={{ color: PAL.ink3 }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent }} />
            Checking access…
          </p>
        )}
        {proStatus === "unlocking" && (
          <p className="serif-text italic text-[12.5px] mt-2 mb-3 inline-flex items-center gap-2" style={{ color: "#5A3A8F" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#5A3A8F" }} />
            {PDF_PRO_LINES[proLine]}
          </p>
        )}
        {proError && (
          <p className="serif-text text-[13px] mt-2 mb-3 px-3 py-2 rounded-sm"
            style={{ background: PAL.roseBg, color: PAL.rose, border: `1px solid #E5BFC1` }}
          >
            {proError}
          </p>
        )}

        {proStatus === "locked" && (
          <button
            onClick={handleProUnlock}
            className="serif-text text-[13px] font-semibold px-5 py-2.5 rounded-sm text-white transition-opacity hover:opacity-90"
            style={{ background: PAL.ink }}
          >
            ✦ Unlock for {FEATURE_CREDITS.professional_horoscope} credits
          </button>
        )}
        {proStatus === "ready" && (
          <button
            onClick={() => window.open(proUrl!, "_blank")}
            className="serif-text text-[13px] font-semibold px-5 py-2.5 rounded-sm text-white transition-opacity hover:opacity-90"
            style={{ background: PAL.ink }}
          >
            ⬇ Download pro report (68 pages)
          </button>
        )}
      </section>
    </div>
  );
}

function Divider({ label, tone = "default" }: { label: string; tone?: "default" | "gold" }) {
  const ink = tone === "gold" ? PAL.gold : PAL.accent;
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-px" style={{ background: PAL.border }} />
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] whitespace-nowrap" style={{ color: ink }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: PAL.border }} />
    </div>
  );
}
