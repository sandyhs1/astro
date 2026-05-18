"use client";

/**
 * Compatibility — B2C Soul Alignment panel.
 *
 * Layout when a report is open:
 *   [Header band — partner names + percentage badge]
 *   [Score Card — Ashtakoota progress + Manglik chips + Dashakoota]
 *   [Ashtakoota 8-koota mini grid]
 *   [Generated narrative report — markdown with tables + boxes]
 *   [Footer — saved-to-archive notice + close]
 *
 * The score header is built from the deterministic AstrologyAPI snapshot, so
 * the user sees the orthodox numbers (19/36, 78%, Manglik status) before the
 * narrative reading.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRight, Heart, Loader2, Sparkles, Trash2, X } from "lucide-react";

import PlaceAutocomplete, { type PlaceSelection } from "@/components/PlaceAutocomplete";

/* ── Editorial palette (matches dashboard) ─────────────────────────────── */
const PAL = {
  paper:   "#FAF7F2",
  paper2:  "#F1ECE0",
  ink:     "#0E1A33",
  ink2:    "#3F4F6F",
  ink3:    "#6F7B92",
  border:  "#D4C9B7",
  border2: "#E8E0CE",
  accent:  "#7B0A1F",
  accent2: "#A02236",
  gold:    "#A57C2A",
  green:   "#3F6B4E",
} as const;

interface PartnerForm {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  gender: "male" | "female" | "other";
  lat?: number;
  lon?: number;
  timezone?: string;
}

interface SavedReportSummary {
  id: string;
  partner1Name: string;
  partner2Name: string;
  createdAt: string;
}

interface KootaCell {
  label: string;
  score: number | null;
  max: number;
  description?: string;
}

interface CompatibilitySnapshot {
  ashtakoot: { total: number | null; max: number; kootas: KootaCell[] };
  manglik:   { partnerA: boolean | null; partnerB: boolean | null; cancellation: boolean | null; summary: string | null };
  obstructions: { name: string; description?: string }[];
  dashakoot: { total: number | null; max: number };
  percentage: number | null;
  warnings: string[];
}

interface Props {
  /** Logged-in user's primary "Self" family_profiles row, used to prefill Partner 1. */
  selfProfile: any | null;
}

const EMPTY_PARTNER: PartnerForm = {
  name: "", dob: "", tob: "", pob: "", gender: "female",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  } catch { return iso; }
}

function pctTone(pct: number | null): { label: string; color: string } {
  if (pct == null) return { label: "—",        color: PAL.ink3 };
  if (pct >= 75)  return { label: "Strong",    color: PAL.green };
  if (pct >= 55)  return { label: "Workable",  color: PAL.gold };
  if (pct >= 35)  return { label: "Tested",    color: PAL.accent };
  return            { label: "Fragile",   color: PAL.accent };
}
function ashtaTone(total: number | null): { label: string; color: string } {
  if (total == null) return { label: "—",       color: PAL.ink3 };
  if (total >= 28)   return { label: "Excellent", color: PAL.green };
  if (total >= 24)   return { label: "Strong",    color: PAL.green };
  if (total >= 18)   return { label: "Mixed",     color: PAL.gold };
  return                   { label: "Strained",  color: PAL.accent };
}

export default function Compatibility({ selfProfile }: Props) {
  // ── Partner state ───────────────────────────────────────────────────────
  const partner1Default: PartnerForm = useMemo(() => {
    if (!selfProfile) return { ...EMPTY_PARTNER, gender: "male" };
    return {
      name:     selfProfile.name || "",
      dob:      selfProfile.dob  || "",
      tob:      selfProfile.tob  || "",
      pob:      selfProfile.pob  || "",
      gender:   (selfProfile.gender as PartnerForm["gender"]) || "male",
      lat:      typeof selfProfile.lat === "number" ? selfProfile.lat : undefined,
      lon:      typeof selfProfile.lng === "number" ? selfProfile.lng :
                typeof selfProfile.lon === "number" ? selfProfile.lon : undefined,
      timezone: selfProfile.timezone || "+05:30",
    };
  }, [selfProfile]);

  const [partner1, setPartner1] = useState<PartnerForm>(partner1Default);
  const [partner2, setPartner2] = useState<PartnerForm>(EMPTY_PARTNER);
  useEffect(() => { setPartner1(partner1Default); }, [partner1Default]);

  // ── Generation state ────────────────────────────────────────────────────
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [report,      setReport]      = useState<string | null>(null);
  const [snapshot,    setSnapshot]    = useState<CompatibilitySnapshot | null>(null);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [reportPair,  setReportPair]  = useState<{ p1Name: string; p2Name: string } | null>(null);

  // ── Past readings list ──────────────────────────────────────────────────
  const [items,       setItems]       = useState<SavedReportSummary[]>([]);
  const [listLoading, setListLoading] = useState(true);

  // ── Splash text ─────────────────────────────────────────────────────────
  const splashLines = useMemo(() => {
    const p1 = partner1.name?.trim() || "Partner 1";
    const p2 = partner2.name?.trim() || "Partner 2";
    return [
      `Reading the alignment between ${p1} and ${p2}…`,
      `Calculating Upapada Lagna strings and planetary degrees. Holding space for your truth…`,
      `Listening to the silence between ${p1}'s Moon and ${p2}'s heart…`,
      `Mapping ${p1}'s Atmakaraka against ${p2}'s Darakaraka. The soul contract is rendering…`,
      `Cross-examining the Navamsha. Stripping the dating illusion…`,
      `Counting the 36 Gunas and verifying Mangal Dosha. The truth is forming…`,
      `Writing the unfiltered reading for ${p1} and ${p2}…`,
    ];
  }, [partner1.name, partner2.name]);
  const [splashIdx, setSplashIdx] = useState(0);
  useEffect(() => {
    if (!submitting) return;
    setSplashIdx(0);
    const t = setInterval(() => {
      setSplashIdx(prev => (prev + 1) % splashLines.length);
    }, 3200);
    return () => clearInterval(t);
  }, [submitting, splashLines]);

  // ── Load past readings ──────────────────────────────────────────────────
  const loadList = async () => {
    setListLoading(true);
    try {
      const res  = await fetch("/api/compatibility");
      const data = await res.json();
      if (Array.isArray(data?.items)) setItems(data.items);
    } catch (err) {
      console.error("[compatibility] list load failed:", err);
    } finally {
      setListLoading(false);
    }
  };
  useEffect(() => { loadList(); }, []);

  // ── Submit ──────────────────────────────────────────────────────────────
  const reportRef = useRef<HTMLDivElement>(null);

  function validate(p: PartnerForm, label: string): string | null {
    if (!p.name.trim())   return `${label}: name is required`;
    if (!p.dob.trim())    return `${label}: date of birth is required`;
    if (!p.tob.trim())    return `${label}: time of birth is required`;
    if (!p.pob.trim())    return `${label}: place of birth is required`;
    if (!p.gender.trim()) return `${label}: gender is required`;
    return null;
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const e1 = validate(partner1, partner1.name?.trim() || "Partner 1");
    const e2 = validate(partner2, partner2.name?.trim() || "Partner 2");
    if (e1) { setError(e1); return; }
    if (e2) { setError(e2); return; }

    setSubmitting(true);
    setReport(null);
    setSnapshot(null);
    setActiveReportId(null);
    setReportPair(null);
    try {
      const res = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner1, partner2 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate the reading.");
      setReport(data.report);
      setSnapshot(data.snapshot ?? null);
      setActiveReportId(data.id ?? null);
      setReportPair({ p1Name: partner1.name, p2Name: partner2.name });
      loadList();
      requestAnimationFrame(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const openSavedReport = async (id: string) => {
    setError(null);
    setSubmitting(true);
    try {
      const res  = await fetch(`/api/compatibility?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load reading.");
      setReport(data.report);
      setSnapshot(data.snapshot ?? null);
      setActiveReportId(data.id);
      setReportPair({ p1Name: data.partner1?.name ?? "", p2Name: data.partner2?.name ?? "" });
      requestAnimationFrame(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSavedReport = async (id: string) => {
    if (!confirm("Delete this reading from your archive? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/compatibility?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to delete.");
      }
      if (activeReportId === id) {
        setReport(null); setSnapshot(null); setActiveReportId(null); setReportPair(null);
      }
      loadList();
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* ── Reusable form block ─────────────────────────────────────────────── */
  function PartnerCard({
    title, accentBar, partner, setPartner, isSelf,
  }: {
    title: string;
    accentBar: string;
    partner: PartnerForm;
    setPartner: (p: PartnerForm) => void;
    isSelf?: boolean;
  }) {
    return (
      <div
        className="relative rounded-sm overflow-hidden"
        style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
      >
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accentBar }} />
        <div className="px-5 md:px-6 pt-5 md:pt-6 pb-5 md:pb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
              {title}
            </h3>
            {isSelf && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>
                Pre-filled · editable
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: PAL.ink3 }}>
                Full name
              </label>
              <input
                type="text"
                value={partner.name}
                onChange={(e) => setPartner({ ...partner, name: e.target.value })}
                className="w-full rounded-sm px-3.5 py-2.5 focus:outline-none text-[15px]"
                style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
                placeholder="e.g. Riya Sharma"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: PAL.ink3 }}>
                  Date of birth
                </label>
                <input
                  type="date"
                  value={partner.dob}
                  onChange={(e) => setPartner({ ...partner, dob: e.target.value })}
                  className="w-full rounded-sm px-3.5 py-2.5 focus:outline-none text-[15px]"
                  style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: PAL.ink3 }}>
                  Time of birth
                </label>
                <input
                  type="time"
                  value={partner.tob}
                  onChange={(e) => setPartner({ ...partner, tob: e.target.value })}
                  className="w-full rounded-sm px-3.5 py-2.5 focus:outline-none text-[15px]"
                  style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: PAL.ink3 }}>
                Place of birth
              </label>
              <PlaceAutocomplete
                value={partner.pob}
                onChange={(text) => setPartner({ ...partner, pob: text, lat: undefined, lon: undefined })}
                onSelect={(s: PlaceSelection) => setPartner({
                  ...partner,
                  pob: s.name,
                  lat: s.lat,
                  lon: s.lon,
                  timezone: s.timezone,
                })}
                placeholder="Start typing a city…"
              />
              <p className="text-[10.5px] mt-1.5 leading-snug" style={{ color: PAL.ink3 }}>
                Pick a suggestion to lock the exact coordinates and timezone.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: PAL.ink3 }}>
                Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["male", "female", "other"] as const).map((g) => {
                  const active = partner.gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPartner({ ...partner, gender: g })}
                      className="rounded-sm px-3 py-2 text-[13px] font-semibold capitalize transition-colors"
                      style={{
                        background: active ? PAL.ink : PAL.paper2,
                        color:      active ? PAL.paper : PAL.ink2,
                        border:    `1px solid ${active ? PAL.ink : PAL.border}`,
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Score Card (rendered above the markdown narrative) ──────────────── */
  function ScoreCard({ snap, p1Name, p2Name }: { snap: CompatibilitySnapshot; p1Name: string; p2Name: string }) {
    const pctT  = pctTone(snap.percentage);
    const ashT  = ashtaTone(snap.ashtakoot.total);
    const ashPct = snap.ashtakoot.total != null ? Math.round((snap.ashtakoot.total / snap.ashtakoot.max) * 100) : null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-7">
        {/* Overall */}
        <div className="rounded-sm p-5" style={{ background: PAL.paper2, border: `1px solid ${PAL.border}` }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.ink3 }}>
            Overall Compatibility
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-[44px] md:text-[52px] leading-none font-semibold tabular-nums"
                 style={{ color: pctT.color, fontFamily: "var(--font-serif-display, Georgia)" }}>
              {snap.percentage != null ? `${Math.round(snap.percentage)}` : "—"}
            </div>
            <div className="text-[20px] font-semibold" style={{ color: PAL.ink3 }}>%</div>
          </div>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: pctT.color }}>
            {pctT.label}
          </div>
          <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: PAL.border2 }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${snap.percentage != null ? Math.min(100, Math.max(0, snap.percentage)) : 0}%`,
                background: pctT.color,
              }}
            />
          </div>
        </div>

        {/* Ashtakoota */}
        <div className="rounded-sm p-5" style={{ background: PAL.paper2, border: `1px solid ${PAL.border}` }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.ink3 }}>
            Ashtakoota Guna Milan
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-[44px] md:text-[52px] leading-none font-semibold tabular-nums"
                 style={{ color: ashT.color, fontFamily: "var(--font-serif-display, Georgia)" }}>
              {snap.ashtakoot.total != null ? snap.ashtakoot.total : "—"}
            </div>
            <div className="text-[18px] font-semibold" style={{ color: PAL.ink3 }}>
              / {snap.ashtakoot.max}
            </div>
          </div>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: ashT.color }}>
            {ashT.label}
          </div>
          <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: PAL.border2 }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${ashPct != null ? ashPct : 0}%`,
                background: ashT.color,
              }}
            />
          </div>
        </div>

        {/* Manglik */}
        <div className="rounded-sm p-5" style={{ background: PAL.paper2, border: `1px solid ${PAL.border}` }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.ink3 }}>
            Mangal Dosha
          </div>
          <div className="space-y-2">
            <ManglikChip label={p1Name} status={snap.manglik.partnerA} />
            <ManglikChip label={p2Name} status={snap.manglik.partnerB} />
          </div>
          {snap.manglik.cancellation != null && (
            <div
              className="mt-3 rounded-sm px-2.5 py-1.5 text-[11px] font-semibold inline-block"
              style={{
                background: snap.manglik.cancellation ? "rgba(63,107,78,0.10)" : "rgba(123,10,31,0.06)",
                color:      snap.manglik.cancellation ? PAL.green : PAL.accent,
                border:    `1px solid ${snap.manglik.cancellation ? PAL.green : PAL.accent}`,
              }}
            >
              {snap.manglik.cancellation ? "Cancellation applies" : "No cancellation"}
            </div>
          )}
        </div>

        {/* Ashtakoota — 8-koota grid (full width) */}
        <div className="md:col-span-3 rounded-sm p-5" style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: PAL.accent }}>
            8-Koota Breakdown
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {snap.ashtakoot.kootas.map((k) => {
              const ratio = (k.score != null && k.max > 0) ? k.score / k.max : 0;
              const ok    = ratio >= 0.6;
              return (
                <div
                  key={k.label}
                  className="rounded-sm px-3 py-2.5"
                  style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>
                    {k.label}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-[20px] font-semibold tabular-nums" style={{ color: ok ? PAL.green : PAL.accent }}>
                      {k.score != null ? k.score : "—"}
                    </span>
                    <span className="text-[12px]" style={{ color: PAL.ink3 }}>/ {k.max}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dashakoota optional */}
        {snap.dashakoot.total != null && (
          <div className="md:col-span-3 flex items-center justify-between rounded-sm px-5 py-3"
               style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: PAL.ink3 }}>
              Dashakoota (10-fold extended)
            </span>
            <span className="text-[16px] font-semibold tabular-nums" style={{ color: PAL.ink }}>
              {snap.dashakoot.total}
            </span>
          </div>
        )}
      </div>
    );
  }

  function ManglikChip({ label, status }: { label: string; status: boolean | null }) {
    let bg: string = PAL.border2;
    let fg: string = PAL.ink2;
    let text = "Unknown";
    if (status === true)  { bg = "rgba(123,10,31,0.08)"; fg = PAL.accent; text = "Manglik"; }
    if (status === false) { bg = "rgba(63,107,78,0.10)"; fg = PAL.green;  text = "Not Manglik"; }
    return (
      <div className="flex items-center justify-between gap-3 rounded-sm px-3 py-2"
           style={{ background: PAL.paper, border: `1px solid ${PAL.border2}` }}>
        <span className="text-[13px] font-semibold truncate" style={{ color: PAL.ink }}>{label || "—"}</span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] px-2 py-1 rounded-sm"
              style={{ background: bg, color: fg }}>
          {text}
        </span>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────────────── */

  return (
    <div className="px-5 md:px-7 py-6 md:py-8">
      {/* Past readings strip */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.ink3 }}>
            Your past readings
          </h3>
          {items.length > 0 && (
            <span className="text-[10px] font-semibold tabular-nums" style={{ color: PAL.ink3 }}>
              {items.length} archived
            </span>
          )}
        </div>
        {listLoading ? (
          <div className="text-[12px] italic" style={{ color: PAL.ink3 }}>Loading your archive…</div>
        ) : items.length === 0 ? (
          <div className="rounded-sm px-4 py-3 text-[13px]"
               style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}`, color: PAL.ink2 }}>
            No readings yet. Generate your first below — it will be saved here forever.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((it) => {
              const isActive = activeReportId === it.id;
              return (
                <div
                  key={it.id}
                  className="rounded-sm p-3 md:p-4 relative"
                  style={{
                    background: isActive ? PAL.paper : PAL.paper2,
                    border: `1px solid ${isActive ? PAL.accent : PAL.border2}`,
                  }}
                >
                  <button onClick={() => openSavedReport(it.id)} className="w-full text-left pr-7">
                    <div className="text-[13px] font-semibold leading-snug truncate" style={{ color: PAL.ink }}>
                      {it.partner1Name} &amp; {it.partner2Name}
                    </div>
                    <div className="text-[10.5px] mt-1 font-semibold uppercase tracking-[0.14em]" style={{ color: PAL.ink3 }}>
                      {formatDate(it.createdAt)}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: PAL.accent }}>
                      Open reading <ArrowRight size={11} />
                    </div>
                  </button>
                  <button
                    onClick={() => deleteSavedReport(it.id)}
                    title="Delete reading"
                    className="absolute top-2.5 right-2.5 h-6 w-6 grid place-items-center rounded transition-colors hover:bg-black/5"
                  >
                    <Trash2 size={11} style={{ color: PAL.ink3 }} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <PartnerCard title="Partner 1 — you" accentBar={PAL.accent} partner={partner1} setPartner={setPartner1} isSelf={!!selfProfile} />
        <PartnerCard title="Partner 2"       accentBar={PAL.gold}   partner={partner2} setPartner={setPartner2} />
      </div>

      {/* Caution */}
      <div className="mt-5 rounded-sm p-3.5"
           style={{ background: "rgba(165,124,42,0.08)", border: "1px solid rgba(165,124,42,0.22)" }}>
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: PAL.gold }}>
          Verify before you analyse
        </p>
        <p className="text-[12.5px] leading-snug" style={{ color: PAL.ink2 }}>
          Even a 5-minute error in time of birth can flip the Navamsha and break the synastry. Double-check both birth times. Pick a place from the suggestions to lock the exact coordinates and timezone.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-sm p-3.5 text-[13px]"
             style={{ background: "rgba(123,10,31,0.06)", border: `1px solid ${PAL.accent}`, color: PAL.accent }}>
          {error}
        </div>
      )}

      {/* CTA */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2.5 rounded-sm px-7 md:px-9 py-3.5 text-[14px] md:text-[15px] font-semibold uppercase tracking-[0.18em] transition-all w-full sm:w-auto justify-center disabled:opacity-60"
          style={{ background: PAL.ink, color: PAL.paper, border: `1px solid ${PAL.ink}` }}
        >
          {submitting ? (
            <><Loader2 size={16} className="animate-spin" /> Reading the alignment…</>
          ) : (
            <>Analyse Soul Alignment <ArrowRight size={16} /></>
          )}
        </button>
      </div>

      {/* Splash loader */}
      <AnimatePresence>
        {submitting && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] grid place-items-center px-6"
            style={{ background: "rgba(14,26,51,0.92)", backdropFilter: "blur(8px)" }}
            aria-live="polite" aria-busy="true"
          >
            <div className="w-full max-w-md text-center">
              <div className="relative mx-auto mb-9 h-24 w-24">
                <motion.div className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${PAL.gold}` }}
                  animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0.25, 0.7] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div className="absolute inset-3 rounded-full"
                  style={{ border: `2px solid ${PAL.accent2}` }}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.55, 0.15, 0.55] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                />
                <motion.div className="absolute inset-0 grid place-items-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={32} style={{ color: PAL.gold }} />
                </motion.div>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.32em] mb-3" style={{ color: PAL.gold }}>
                Soul Alignment in progress
              </div>
              <div className="min-h-[64px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={splashIdx}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5 }}
                    className="text-[16px] md:text-[18px] leading-relaxed text-white/90 italic font-light"
                  >
                    {splashLines[splashIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="mt-9 flex items-center justify-center gap-1.5">
                {splashLines.map((_, i) => (
                  <span key={i} className="h-[3px] w-6 rounded-full transition-all"
                        style={{ background: i === splashIdx ? PAL.gold : "rgba(255,255,255,0.18)" }} />
                ))}
              </div>
              <p className="mt-9 text-[11px] tracking-wider text-white/50">
                This usually takes 25 to 45 seconds. Hold the line.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated report */}
      {report && (
        <motion.div
          ref={reportRef}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mt-9 rounded-sm overflow-hidden"
          style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
        >
          {/* Header band */}
          <div className="px-6 md:px-9 pt-7 md:pt-9 pb-5 md:pb-6" style={{ borderBottom: `1px solid ${PAL.border2}` }}>
            <div className="flex items-center gap-2 mb-2">
              <Heart size={14} style={{ color: PAL.accent }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
                Soul Alignment
              </span>
            </div>
            <h2 className="text-[26px] md:text-[36px] font-semibold leading-tight tracking-tight"
                style={{ color: PAL.ink, fontFamily: "var(--font-serif-display, Georgia)" }}>
              {reportPair?.p1Name || "Partner 1"} &amp; {reportPair?.p2Name || "Partner 2"}
            </h2>
          </div>

          {/* Score header */}
          {snapshot && (
            <div className="px-5 md:px-9 pt-7">
              <ScoreCard
                snap={snapshot}
                p1Name={reportPair?.p1Name || "Partner 1"}
                p2Name={reportPair?.p2Name || "Partner 2"}
              />
            </div>
          )}

          {/* Markdown narrative */}
          <div className="px-5 md:px-9 pb-9 prose-compat">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h2 className="text-[22px] md:text-[26px] font-semibold leading-tight mt-9 mb-4 first:mt-0 pb-2"
                      style={{ color: PAL.ink, fontFamily: "var(--font-serif-display, Georgia)", borderBottom: `1px solid ${PAL.border2}` }}>
                    {children}
                  </h2>
                ),
                h2: ({ children }) => (
                  <h2 className="text-[19px] md:text-[22px] font-semibold leading-tight mt-9 mb-4 first:mt-0 pb-2"
                      style={{ color: PAL.ink, fontFamily: "var(--font-serif-display, Georgia)", borderBottom: `1px solid ${PAL.border2}` }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-[14.5px] md:text-[16px] font-semibold mt-6 mb-2" style={{ color: PAL.accent }}>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[15px] md:text-[16px] leading-[1.85] mb-4" style={{ color: PAL.ink }}>
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold" style={{ color: PAL.accent }}>{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic" style={{ color: PAL.ink2 }}>{children}</em>
                ),
                ul: ({ children }) => <ul className="list-disc pl-5 my-3 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 my-3 space-y-2">{children}</ol>,
                li: ({ children }) => (
                  <li className="text-[15px] md:text-[16px] leading-[1.8]" style={{ color: PAL.ink }}>
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="my-5 px-5 py-4 rounded-sm"
                              style={{ background: PAL.paper2, borderLeft: `3px solid ${PAL.accent}`, color: PAL.ink2 }}>
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="my-7" style={{ borderColor: PAL.border2 }} />,
                table: ({ children }) => (
                  <div className="my-6 overflow-x-auto rounded-sm"
                       style={{ border: `1px solid ${PAL.border}` }}>
                    <table className="w-full border-collapse text-[14px] md:text-[14.5px]">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead style={{ background: PAL.ink, color: PAL.paper }}>{children}</thead>
                ),
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => (
                  <tr className="even:bg-[#F1ECE0]/40">{children}</tr>
                ),
                th: ({ children }) => (
                  <th className="text-left px-3.5 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.16em]">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3.5 py-2.5 align-top leading-[1.6]"
                      style={{ borderTop: `1px solid ${PAL.border2}`, color: PAL.ink }}>
                    {children}
                  </td>
                ),
                code: ({ children }) => (
                  <code className="px-1 py-0.5 rounded text-[13px]"
                        style={{ background: PAL.paper2, color: PAL.ink, border: `1px solid ${PAL.border2}` }}>
                    {children}
                  </code>
                ),
              }}
            >
              {report}
            </ReactMarkdown>
          </div>

          {/* Footer */}
          <div className="px-6 md:px-9 py-4 flex items-center justify-between gap-3"
               style={{ borderTop: `1px solid ${PAL.border2}`, background: PAL.paper2 }}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: PAL.ink3 }}>
              Saved to your archive
            </span>
            <button
              onClick={() => { setReport(null); setSnapshot(null); setActiveReportId(null); setReportPair(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: PAL.ink2 }}
            >
              <X size={12} /> Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
