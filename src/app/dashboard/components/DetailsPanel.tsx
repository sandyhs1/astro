"use client";
import { useState, useEffect } from "react";
import { PAL, PLANET_TONE } from "./destiny-theme";

interface Props { activeProfileId: string; familyProfiles: any[]; userEmail: string; }

const KARAKA_LABELS: Record<string, string> = {
  ak:  "AK — Atmakaraka (Soul's Desire)",
  amk: "AMK — Amatyakaraka (Career & Mind)",
  bk:  "BK — Bhratrukaraka (Siblings)",
  mk:  "MK — Matrukaraka (Mother)",
  pk:  "PK — Pitrukaraka (Father)",
  gk:  "GK — Gnatikaraka (Rivals)",
  dk:  "DK — Darakaraka (Spouse / Partner)",
};

const SIGN_LORD: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon", Leo: "Sun",
  Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars", Sagittarius: "Jupiter",
  Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

/* ── Editorial primitives ─────────────────────────────────────────── */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-sm p-5 md:p-6 mb-4 ${className}`}
      style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.accent }}>
      {children}
    </p>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2" style={{ borderBottom: `1px solid ${PAL.border2}` }}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: PAL.ink3 }}>
        {label}
      </div>
      <div className="serif-display text-[14px] md:text-[15px] font-semibold leading-tight mt-1" style={{ color: PAL.ink }}>
        {value || "—"}
      </div>
    </div>
  );
}

function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "sage" | "rose" | "gold" | "blue" }) {
  const tones: Record<string, { ink: string; bg: string; border: string }> = {
    default: { ink: PAL.ink2, bg: PAL.paper2, border: PAL.border2 },
    sage:    { ink: PAL.sage, bg: PAL.sageBg, border: "#C7D6BB" },
    rose:    { ink: PAL.rose, bg: PAL.roseBg, border: "#E5BFC1" },
    gold:    { ink: PAL.gold, bg: PAL.amberBg, border: "#E1CE9B" },
    blue:    { ink: "#1F4F7A", bg: "#E5EEF6", border: "#BCD0E1" },
  };
  const t = tones[tone];
  return (
    <span
      className="inline-block text-[10px] font-semibold uppercase tracking-[0.16em] px-1.5 py-0.5 rounded-sm"
      style={{ color: t.ink, background: t.bg, border: `1px solid ${t.border}` }}
    >
      {children}
    </span>
  );
}

function DashaBar({ label, planet, end, remaining, start }: {
  label: string; planet: string; end?: string; remaining?: string; start?: string;
}) {
  const tone = PLANET_TONE[planet] || PLANET_TONE.Saturn;
  return (
    <div className="flex items-center gap-3 mb-3">
      <span
        className="w-1 self-stretch rounded-sm flex-shrink-0"
        style={{ background: tone.ink, minHeight: 36 }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: PAL.ink3 }}>
          {label}
        </div>
        <div className="serif-display text-[16px] font-semibold mt-0.5 tracking-tight" style={{ color: PAL.ink }}>
          {planet || "—"}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        {start && <div className="serif-text text-[11px] italic" style={{ color: PAL.ink3 }}>From {start}</div>}
        {end && <div className="serif-text text-[12px] font-semibold tabular-nums" style={{ color: PAL.ink2 }}>Until {end}</div>}
        {remaining && <div className="text-[10px] font-semibold uppercase tracking-[0.18em] mt-0.5" style={{ color: tone.ink }}>{remaining}</div>}
      </div>
    </div>
  );
}

function YogaCard({ yoga }: { yoga: any }) {
  const [open, setOpen] = useState(false);
  const active = yoga.status === "ACTIVATED";
  const tone = active
    ? { ink: PAL.sage, bg: PAL.sageBg, border: "#C7D6BB" }
    : { ink: PAL.gold, bg: PAL.amberBg, border: "#E1CE9B" };
  return (
    <div
      className="rounded-sm overflow-hidden mb-2"
      style={{ background: PAL.paper, border: `1px solid ${tone.border}` }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left flex items-center justify-between gap-3 px-4 py-3 transition-colors"
        style={{ background: tone.bg }}
      >
        <div className="min-w-0">
          <div className="serif-display text-[14px] md:text-[15px] font-semibold leading-tight" style={{ color: PAL.ink }}>
            {yoga.fullName}
          </div>
          <div className="serif-text text-[11px] mt-1 italic" style={{ color: PAL.ink2 }}>
            {yoga.category} · Planets {yoga.planets.join(", ")} · H{yoga.houses.join(", H")}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Pill tone={active ? "sage" : "gold"}>{yoga.status}</Pill>
          <span className="serif-display italic text-[14px] transition-transform"
            style={{ color: tone.ink, transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          >›</span>
        </div>
      </button>
      {open && (
        <div className="px-4 py-3.5" style={{ borderTop: `1px solid ${tone.border}` }}>
          <p className="serif-text text-[13px] leading-relaxed mb-3" style={{ color: PAL.ink2 }}>
            <strong style={{ color: PAL.ink }}>Logic.</strong> {yoga.logic}
          </p>
          <div
            className="rounded-sm px-3.5 py-2.5"
            style={{ background: PAL.sageBg, border: `1px solid #C7D6BB` }}
          >
            <p className="serif-text text-[13px] leading-relaxed" style={{ color: PAL.sage }}>
              <strong>Benefit.</strong> {yoga.benefit}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ChartViewer({ profileId, data }: { profileId: string; data: any }) {
  const [chart, setChart] = useState("D1");
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const charts = [
    { id: "D1", name: "D1 (Rasi)" }, { id: "D2", name: "D2 (Hora)" }, { id: "D3", name: "D3 (Drekkana)" },
    { id: "D4", name: "D4 (Chaturthamsha)" }, { id: "D7", name: "D7 (Saptamsha)" }, { id: "D9", name: "D9 (Navamsha)" },
    { id: "D10", name: "D10 (Dashamsha)" }, { id: "D12", name: "D12 (Dwadashamsha)" }, { id: "D16", name: "D16 (Shodashamsha)" },
    { id: "D20", name: "D20 (Vimshamsha)" }, { id: "D24", name: "D24 (Chaturvimshamsha)" }, { id: "D27", name: "D27 (Bhamsha)" },
    { id: "D30", name: "D30 (Trimshamsha)" }, { id: "D40", name: "D40 (Khavedamsha)" }, { id: "D45", name: "D45 (Akshavedamsha)" },
    { id: "D60", name: "D60 (Shashtiamsha)" },
  ];

  useEffect(() => {
    async function loadSvg() {
      setLoading(true);
      try {
        const res = await fetch(`/api/chart-image?profileId=${profileId}&chartId=${chart}`);
        const resData = await res.json();
        if (resData.svg) setSvg(resData.svg);
      } finally {
        setLoading(false);
      }
    }
    loadSvg();
  }, [profileId, chart]);

  const { person, core, extras } = data;
  const panchang = extras?.panchang;

  return (
    <Card>
      <Eyebrow>Astrological divisional charts &amp; details</Eyebrow>

      <div className="rounded-sm p-4 md:p-5 mb-5"
        style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
      >
        <p className="serif-display text-[15px] md:text-[16px] font-semibold mb-3" style={{ color: PAL.ink }}>
          Personal details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <Row label="Name" value={person.fullName} />
          <Row label="DOB" value={person.dob} />
          <Row label="TOB" value={person.tob} />
          <Row label="POB" value={person.pob} />
          <Row label="Nakshatra" value={core.moonNakshatra || "—"} />
          <Row label="Pada" value={core.moonNakshatraPada?.toString() || "—"} />
          <Row label="Rasi (Moon sign)" value={core.moonSign || "—"} />
          <Row label="Tithi" value={panchang ? `${panchang.tithiName} (${panchang.tithiPaksha})` : "—"} />
        </div>
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2.5" style={{ color: PAL.accent }}>
        Select chart
      </p>
      <div className="flex gap-2 flex-wrap mb-4">
        {charts.map(c => (
          <button
            key={c.id}
            onClick={() => setChart(c.id)}
            className="serif-text text-[11.5px] font-semibold px-3 py-1.5 rounded-sm transition-colors"
            style={
              chart === c.id
                ? { background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }
                : { background: PAL.paper2, color: PAL.ink2, border: `1px solid ${PAL.border}` }
            }
          >
            {c.name}
          </button>
        ))}
      </div>

      <div
        className="rounded-sm p-4 md:p-5 min-h-[300px] grid place-items-center"
        style={{ background: PAL.paper, border: `1px solid ${PAL.border2}` }}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-2.5">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent }} />
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.15s" }} />
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.3s" }} />
            </div>
            <p className="serif-text text-[13px] italic" style={{ color: PAL.ink3 }}>
              Computing {chart}…
            </p>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: svg || "" }}
            style={{ width: "100%", maxWidth: 400, display: "flex", justifyContent: "center" }}
          />
        )}
      </div>
    </Card>
  );
}

export default function DetailsPanel({ activeProfileId }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true); setError(null); setData(null);
      try {
        const res = await fetch(`/api/chart-details?profileId=${activeProfileId}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load.");
        setData(json);
      } catch (e: any) { setError(e.message); }
      finally { setLoading(false); }
    }
    load();
  }, [activeProfileId]);

  if (loading) return (
    <div
      className="rounded-sm py-14 px-6 text-center m-4 md:m-6"
      style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
        Live computation
      </p>
      <h3 className="serif-display text-[22px] md:text-[26px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
        Generating your astrological blueprint…
      </h3>
      <p className="serif-text text-[13.5px] italic mt-2 max-w-md mx-auto" style={{ color: PAL.ink2 }}>
        Deep-astro algorithms are rendering your precise chart details in real time. Please don't close this tab.
      </p>
      <div className="mt-4 inline-flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent }} />
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.15s" }} />
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PAL.accent, animationDelay: "0.3s" }} />
      </div>
    </div>
  );

  if (error) return (
    <div
      className="rounded-sm m-4 md:m-6 px-4 py-3 serif-text text-[14px]"
      style={{ background: PAL.roseBg, color: PAL.rose, border: `1px solid #E5BFC1` }}
    >
      {error}
    </div>
  );

  if (!data) return null;

  const { person, core, dasha, planets, houses, karakas, specialPoints, yogas, enrichments } = data;
  const { vargottama, rahuKetuAxis, moonNakData, moonNakName, planetStrengths, retrogrades } = enrichments || {};

  const moonPlanet = planets?.find((p: any) => p.name === "Moon");
  const displayMoonSign = core.moonSign || moonPlanet?.sign || "—";

  const activated = yogas?.filter((y: any) => y.status === "ACTIVATED") || [];
  const dormant   = yogas?.filter((y: any) => y.status === "DORMANT")   || [];

  return (
    <div data-lenis-prevent className="px-4 md:px-7 lg:px-9 py-5 md:py-6 overflow-y-auto" style={{ background: PAL.paper }}>

      {/* ── Header card (cream, navy ink) ── */}
      <section
        className="rounded-sm p-5 md:p-7 mb-4"
        style={{ background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: "#E1CE9B" }}>
          Birth blueprint
        </p>
        <h2 className="serif-display text-[24px] md:text-[32px] font-semibold leading-tight tracking-tight">
          {person.fullName}
        </h2>
        <p className="serif-text text-[13px] mt-2 italic" style={{ color: PAL.paper2 }}>
          {person.dob} · {person.tob} · {person.pob}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mt-2" style={{ color: "#E1CE9B" }}>
          {person.timezone} · Lahiri Ayanamsa · Whole Sign · Sidereal
        </p>
      </section>

      {/* Core Identity */}
      <Card>
        <Eyebrow>Core identity</Eyebrow>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <Row label="Ascendant (Lagna)" value={`${core.ascendant}${core.ascendantNakshatra ? ` · ${core.ascendantNakshatra} Pada ${core.ascendantNakshatraPada}` : ""}`} />
          <Row label="Ascendant lord" value={`${core.ascLord} in ${core.ascLordSign} (House ${core.ascLordHouse})`} />
          <Row label="Moon sign (Rashi)" value={displayMoonSign} />
          <Row label="Moon nakshatra" value={`${core.moonNakshatra}${core.moonNakshatraPada ? ` Pada ${core.moonNakshatraPada}` : ""}`} />
        </div>
      </Card>

      {/* Moon nakshatra deep-dive */}
      {moonNakData && (
        <Card>
          <Eyebrow>{moonNakName} · nakshatra deep-dive</Eyebrow>
          <div
            className="rounded-sm p-4 md:p-5 mb-4"
            style={{ background: "#ECE6F4", border: `1px solid #D2C4E5` }}
          >
            <p className="serif-display text-[18px] font-semibold tracking-tight" style={{ color: "#5A3A8F" }}>
              {moonNakName}
            </p>
            <p className="serif-text text-[13.5px] mt-1.5 leading-relaxed" style={{ color: "#5A3A8F", opacity: 0.9 }}>
              {moonNakData.nature}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <Row label="Ruling planet (Nakshatra lord)" value={moonNakData.ruler} />
            <Row label="Presiding deity" value={moonNakData.deity} />
            <Row label="Symbol" value={moonNakData.symbol} />
            <Row
              label="Gana (Nature)"
              value={`${moonNakData.gana} — ${
                moonNakData.gana === "Deva"
                  ? "Divine, sattvic, spiritually oriented"
                  : "Manushya" === moonNakData.gana
                  ? "Human, rajasic, worldly oriented"
                  : "Fierce, tamasic, intensely driven"
              }`}
            />
            <Row label="Quality (Gunam)" value={moonNakData.quality} />
          </div>
        </Card>
      )}

      {/* Vargottama */}
      {vargottama?.length > 0 && (
        <Card>
          <Eyebrow>Vargottama planets · double strength</Eyebrow>
          <p className="serif-text text-[13px] leading-relaxed mb-4" style={{ color: PAL.ink2 }}>
            A Vargottama planet occupies the <strong style={{ color: PAL.ink }}>same sign in both D1 (Rashi) and D9 (Navamsha)</strong>. This doubles its power — the soul-level chart confirms the physical-world promise.
          </p>
          {vargottama.map((v: any, i: number) => (
            <div
              key={i}
              className="rounded-sm p-4 mb-2"
              style={{ background: PAL.amberBg, border: `1px solid #E1CE9B` }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="serif-display text-[16px] md:text-[18px] font-semibold" style={{ color: PAL.gold }}>
                  {v.name}
                </p>
                <Pill tone="gold">Vargottama</Pill>
              </div>
              <p className="serif-text text-[12.5px] mb-1.5" style={{ color: PAL.ink2 }}>
                Sign · <strong style={{ color: PAL.ink }}>{v.sign}</strong> · House · <strong style={{ color: PAL.ink }}>{v.house}</strong>
              </p>
              <p className="serif-text text-[13px] leading-relaxed" style={{ color: PAL.ink2 }}>
                {v.meaning}
              </p>
            </div>
          ))}
        </Card>
      )}

      {/* Rahu-Ketu axis */}
      {rahuKetuAxis && (
        <Card>
          <Eyebrow>Rahu–Ketu karmic axis</Eyebrow>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className="rounded-sm p-4 md:p-5"
              style={{ background: "#E5EEF6", border: `1px solid #BCD0E1` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: "#1F4F7A" }}>
                ☊ Rahu · House {rahuKetuAxis.rahuHouse} ({rahuKetuAxis.rahuSign})
              </p>
              <p className="serif-display text-[14px] font-semibold mb-2" style={{ color: "#1F4F7A" }}>
                Your destined direction this lifetime
              </p>
              <p className="serif-text text-[13.5px] leading-relaxed" style={{ color: "#1F4F7A", opacity: 0.9 }}>
                {rahuKetuAxis.rahuDestiny}
              </p>
            </div>
            <div
              className="rounded-sm p-4 md:p-5"
              style={{ background: "#ECE6F4", border: `1px solid #D2C4E5` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: "#5A3A8F" }}>
                ☋ Ketu · House {rahuKetuAxis.ketuHouse} ({rahuKetuAxis.ketuSign})
              </p>
              <p className="serif-display text-[14px] font-semibold mb-2" style={{ color: "#5A3A8F" }}>
                What you've mastered — now release
              </p>
              <p className="serif-text text-[13.5px] leading-relaxed" style={{ color: "#5A3A8F", opacity: 0.9 }}>
                {rahuKetuAxis.ketuMastered}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Planet strengths */}
      {planetStrengths?.length > 0 && (
        <Card>
          <Eyebrow>Planetary strength ranking</Eyebrow>
          <p className="serif-text text-[13px] leading-relaxed mb-4" style={{ color: PAL.ink2 }}>
            Ranked by classical dignity · Exalted (6) → Moolatrikona (5) → Own Sign (4) → Friendly (3) → Neutral (2) → Enemy (1) → Debilitated (0). Combust planets lose 1 point.
          </p>
          {planetStrengths.map((p: any, i: number) => {
            const isTop = i < 3, isWeak = p.score <= 1;
            const tone = isTop ? "sage" : isWeak ? "rose" : "default";
            const barColor = p.score >= 5 ? "#5A8856" : p.score >= 3 ? "#1F4F7A" : p.score >= 2 ? PAL.gold : PAL.rose;
            return (
              <div
                key={p.name}
                className="flex items-center gap-3 mb-2 px-3.5 py-2.5 rounded-sm"
                style={{
                  background: isTop ? PAL.sageBg : isWeak ? PAL.roseBg : PAL.paper2,
                  border: `1px solid ${isTop ? "#C7D6BB" : isWeak ? "#E5BFC1" : PAL.border2}`,
                }}
              >
                <span
                  className="serif-display italic text-[13px] font-semibold tabular-nums w-7"
                  style={{ color: isTop ? PAL.sage : isWeak ? PAL.rose : PAL.ink3 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="serif-display text-[14px] font-semibold" style={{ color: PAL.ink }}>{p.name}</span>
                    <span className="serif-text text-[11.5px] italic" style={{ color: PAL.ink3 }}>
                      in {p.sign} · H{p.house}
                    </span>
                    {p.isCombust && <Pill tone="gold">Combust</Pill>}
                    {p.isRetro && <Pill tone="blue">Retro</Pill>}
                  </div>
                  <div className="mt-1.5 h-[3px] rounded-full overflow-hidden" style={{ background: PAL.border2 }}>
                    <div className="h-full rounded-full" style={{ width: `${(p.score / 6) * 100}%`, background: barColor }} />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: barColor }}>
                    {p.label}
                  </div>
                  <div className="serif-display text-[14px] font-semibold tabular-nums" style={{ color: PAL.ink }}>
                    {p.score}/6
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* Retrograde analysis */}
      {retrogrades?.length > 0 && (
        <Card>
          <Eyebrow>Retrograde planet analysis</Eyebrow>
          <p className="serif-text text-[13px] leading-relaxed mb-4" style={{ color: PAL.ink2 }}>
            Retrograde planets carry intensified karmic energy from past lives. Their power is directed inward rather than outward — making their effects more profound, internalised, and ultimately more transformative.
          </p>
          {retrogrades.map((r: any, i: number) => (
            <div
              key={i}
              className="rounded-sm p-4 mb-2.5"
              style={{ background: "#E5EEF6", border: `1px solid #BCD0E1` }}
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="serif-display text-[15px] font-semibold" style={{ color: "#1F4F7A" }}>
                  {r.name} ℞
                </span>
                <span className="serif-text text-[11.5px] italic" style={{ color: PAL.ink3 }}>
                  in {r.sign} · House {r.house}
                </span>
                <Pill tone="blue">Retrograde</Pill>
              </div>
              <p className="serif-text text-[13px] leading-relaxed" style={{ color: "#1F4F7A", opacity: 0.9 }}>
                {r.meaning}
              </p>
            </div>
          ))}
        </Card>
      )}

      {/* Dasha timeline */}
      <Card>
        <Eyebrow>Vimshottari dasha timeline</Eyebrow>
        <DashaBar label="Mahadasha" planet={dasha.mahadasha} end={dasha.mahadashaEnd} remaining={dasha.mahadashaRemaining} />
        <DashaBar label="Antardasha" planet={dasha.antardasha} end={dasha.antardashaEnd} remaining={dasha.antardashaRemaining} />
        {dasha.pratyantar && dasha.pratyantar !== "—" && <DashaBar label="Pratyantar" planet={dasha.pratyantar} />}
        {dasha.nextMahadasha && (
          <div className="mt-4 pt-4" style={{ borderTop: `1px dashed ${PAL.border}` }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
              Next mahadasha
            </p>
            <DashaBar label="Next mahadasha" planet={dasha.nextMahadasha} start={dasha.nextMahadashaStart} end={dasha.nextMahadashaEnd} />
          </div>
        )}
      </Card>

      {/* Planets table */}
      <Card>
        <Eyebrow>Planetary positions · D1 Rashi chart</Eyebrow>
        <div className="overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
          <table className="w-full" style={{ minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${PAL.border}` }}>
                {["Planet", "Sign", "House", "Degree", "Nakshatra", "Pada", "Status"].map(h => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-semibold uppercase tracking-[0.18em] py-2 pr-3 whitespace-nowrap"
                    style={{ color: PAL.ink3 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planets.map((p: any) => {
                const flags = [
                  p.isRetro ? "Retro" : "",
                  p.isExalted ? "Exalted" : "",
                  p.isDebilitated ? "Debilitated" : "",
                  p.isCombust ? "Combust" : "",
                ].filter(Boolean);
                return (
                  <tr key={p.name} style={{ borderBottom: `1px solid ${PAL.border2}` }}>
                    <td className="py-2.5 pr-3 serif-display text-[13.5px] font-semibold" style={{ color: PAL.ink }}>{p.name}</td>
                    <td className="py-2.5 pr-3 serif-text text-[13px]" style={{ color: PAL.ink2 }}>{p.sign}</td>
                    <td className="py-2.5 pr-3 serif-text text-[13px] text-center" style={{ color: PAL.ink2 }}>{p.house}</td>
                    <td className="py-2.5 pr-3 serif-text text-[12.5px] tabular-nums" style={{ color: PAL.ink2 }}>{(p.normDegree || 0).toFixed(2)}°</td>
                    <td className="py-2.5 pr-3 serif-text text-[13px]" style={{ color: PAL.ink2 }}>{p.nakshatra || "—"}</td>
                    <td className="py-2.5 pr-3 serif-text text-[13px] text-center" style={{ color: PAL.ink2 }}>{p.nakshatraPada || "—"}</td>
                    <td className="py-2.5 pr-3">
                      {flags.length === 0 ? (
                        <span style={{ color: PAL.ink3 }}>—</span>
                      ) : (
                        <div className="flex gap-1 flex-wrap">
                          {flags.map(f => (
                            <Pill
                              key={f}
                              tone={
                                f === "Exalted" ? "sage" :
                                f === "Debilitated" ? "rose" :
                                f === "Retro" ? "blue" : "gold"
                              }
                            >
                              {f}
                            </Pill>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Houses */}
      <Card>
        <Eyebrow>All 12 houses (Bhava)</Eyebrow>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {houses.map((h: any) => (
            <div
              key={h.number}
              className="rounded-sm p-3"
              style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] leading-none" style={{ color: PAL.accent }}>
                H{h.number} · {h.sign}
              </p>
              <p className="serif-text text-[11px] italic mt-1" style={{ color: PAL.ink3 }}>
                Lord · {SIGN_LORD[h.sign] || "?"}
              </p>
              <p className="serif-display text-[13px] font-semibold mt-1.5 leading-tight" style={{ color: PAL.ink }}>
                {h.occupants?.length > 0 ? h.occupants.join(", ") : <span style={{ color: PAL.ink3, fontStyle: "italic" }}>empty</span>}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Karakas */}
      <Card>
        <Eyebrow>Jaimini karakas</Eyebrow>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          {Object.entries(KARAKA_LABELS).map(([key, label]) => (
            <div
              key={key}
              className="flex justify-between items-baseline gap-3 py-2"
              style={{ borderBottom: `1px solid ${PAL.border2}` }}
            >
              <p className="serif-text text-[12.5px] leading-tight" style={{ color: PAL.ink2 }}>
                {label}
              </p>
              <span className="serif-display text-[14px] font-semibold whitespace-nowrap" style={{ color: PAL.accent }}>
                {karakas[key] || "—"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Special points */}
      <Card>
        <Eyebrow>Special sensitive points</Eyebrow>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <Row label="Arudha Lagna (AL) — Public image & status" value={specialPoints.AL || "—"} />
          <Row label="Upapada Lagna (UL) — Marriage & bond" value={specialPoints.UL || "—"} />
          <Row label="A7 Darapada — Physical attraction" value={specialPoints.A7 || "—"} />
          <Row label="Pranapada Lagna — Life force centre" value={specialPoints.PP || "—"} />
        </div>
      </Card>

      {/* Yogas */}
      <Card>
        <Eyebrow>Classical yogas · {yogas?.length || 0} detected</Eyebrow>
        {activated.length > 0 && (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.sage }}>
              Activated · {activated.length}
            </p>
            {activated.map((y: any, i: number) => <YogaCard key={i} yoga={y} />)}
          </>
        )}
        {dormant.length > 0 && (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mt-4 mb-2" style={{ color: PAL.gold }}>
              Dormant / Latent · {dormant.length}
            </p>
            {dormant.map((y: any, i: number) => <YogaCard key={i} yoga={y} />)}
          </>
        )}
        {(!yogas || yogas.length === 0) && (
          <p className="serif-text text-[13px] italic" style={{ color: PAL.ink3 }}>
            No classical yogas detected.
          </p>
        )}
      </Card>

      {/* Chart viewer */}
      <ChartViewer profileId={activeProfileId} data={data} />

      <div style={{ height: 30 }} />
    </div>
  );
}
