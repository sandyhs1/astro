"use client";

/* ────────────────────────────────────────────────────────────────────────────
 * V3 — COSMIC BENTO
 * Vibrant gradient bento cards · oversized typography · scroll-snap mobile
 * Floating sidebar on desktop · scroll-snap carousels on mobile
 * Modern consumer app — Cash App / Linear cross · loud but legible
 * Light theme · WCAG AA contrast · mobile-first
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles, Search, Send, ChevronRight, LogOut, MessageCircle,
  BookOpen, Compass, Map, Flame, Sun, Heart, Mic, Calendar, Crown, Gem,
  FileText, ListChecks, ArrowLeft, ArrowRight, Plus, Bell, Star, Zap, X,
} from "lucide-react";
import { FEATURES, PROFILES, DAILY, CHIPS, SAMPLE_MESSAGES, type Feature } from "../data";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  explainer: BookOpen, chat: MessageCircle, destiny: Calendar, "karma-dna": Sparkles,
  "karmic-patterns": Compass, "royal-roast": Flame, gotra: Sun, "ishta-devata": Heart,
  journal: Mic, "year-ahead": Calendar, "soul-code": Crown, roadmap: Map,
  remedy: Gem, reports: FileText, details: ListChecks,
};

/** Each accent gives a soft tinted card body that keeps text fully readable. */
const ACCENT_BG: Record<Feature["accent"], string> = {
  indigo:  "linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 60%,#C7D2FE 100%)",
  amber:   "linear-gradient(135deg,#FEF3C7 0%,#FDE68A 60%,#FCD34D 100%)",
  rose:    "linear-gradient(135deg,#FFE4E6 0%,#FECDD3 60%,#FDA4AF 100%)",
  emerald: "linear-gradient(135deg,#D1FAE5 0%,#A7F3D0 60%,#6EE7B7 100%)",
  purple:  "linear-gradient(135deg,#F5F3FF 0%,#DDD6FE 60%,#C4B5FD 100%)",
  orange:  "linear-gradient(135deg,#FFEDD5 0%,#FED7AA 60%,#FDBA74 100%)",
  sky:     "linear-gradient(135deg,#E0F2FE 0%,#BAE6FD 60%,#7DD3FC 100%)",
  slate:   "linear-gradient(135deg,#F1F5F9 0%,#E2E8F0 60%,#CBD5E1 100%)",
};
const ACCENT_TEXT: Record<Feature["accent"], string> = {
  indigo:  "text-indigo-900",
  amber:   "text-amber-950",
  rose:    "text-rose-950",
  emerald: "text-emerald-950",
  purple:  "text-purple-950",
  orange:  "text-orange-950",
  sky:     "text-sky-950",
  slate:   "text-slate-900",
};
const ACCENT_INK: Record<Feature["accent"], string> = {
  indigo:  "rgba(30,27,75,0.85)",
  amber:   "rgba(69,26,3,0.85)",
  rose:    "rgba(76,5,25,0.85)",
  emerald: "rgba(2,44,34,0.85)",
  purple:  "rgba(46,16,101,0.85)",
  orange:  "rgba(67,20,7,0.85)",
  sky:     "rgba(8,47,73,0.85)",
  slate:   "rgba(15,23,42,0.85)",
};
const ACCENT_DOT: Record<Feature["accent"], string> = {
  indigo: "#4F46E5", amber: "#D97706", rose: "#E11D48", emerald: "#059669",
  purple: "#7C3AED", orange: "#EA580C", sky: "#0284C7", slate: "#334155",
};

export default function V3Page() {
  const [activeProfile, setActiveProfile] = useState(PROFILES[0].id);
  const [activeFeature, setActiveFeature] = useState<string>("home");
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const profile = PROFILES.find((p) => p.id === activeProfile)!;

  return (
    <div className="relative min-h-[100dvh] w-full text-slate-900 overflow-x-hidden"
      style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#FAFAF9 100%)" }}
    >
      {/* Soft cosmic glow accents */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute -top-32 left-1/4 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-50"
          style={{ background: "radial-gradient(circle, #FCE7F3 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle, #DBEAFE 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 flex min-h-[100dvh]">
        {/* ── Desktop sidebar ─────────────────────────────────────────── */}
        <DesktopSidebar
          activeFeature={activeFeature}
          setActiveFeature={setActiveFeature}
          profile={profile}
          onProfileClick={() => setShowProfileSheet(true)}
        />

        {/* ── Main column ─────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 flex flex-col px-4 md:px-8 lg:px-10 pt-4 md:pt-8 pb-28 md:pb-10">
          {/* Top bar */}
          <header className="flex items-center justify-between gap-3 mb-5 md:mb-8">
            <div className="md:hidden flex items-center gap-2.5">
              <Link href="/mobile-test" className="w-10 h-10 grid place-items-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                <ArrowLeft size={16} className="text-slate-700" />
              </Link>
              <button
                onClick={() => setShowProfileSheet(true)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl bg-white border border-slate-200 shadow-sm"
              >
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 grid place-items-center text-white font-black text-xs">
                  {profile.initial}
                </span>
                <span className="text-xs font-black text-slate-900 truncate max-w-[6rem]">{profile.name}</span>
                <ChevronRight size={12} className="text-slate-500" />
              </button>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter leading-none">
                {activeFeature === "home" ? "Today" : currentLabel(activeFeature)}
              </h1>
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-[0.18em] mt-2">
                {DAILY.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-10 w-10 grid place-items-center rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <Search size={16} className="text-slate-700" />
              </button>
              <button className="h-10 w-10 grid place-items-center rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
                <Bell size={16} className="text-slate-700" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>
            </div>
          </header>

          {activeFeature === "home" && <HomeView profile={profile} onOpen={setActiveFeature} />}
          {activeFeature === "chat" && <ChatView />}
          {activeFeature !== "home" && activeFeature !== "chat" && (
            <FeatureStub featureKey={activeFeature} onBack={() => setActiveFeature("home")} />
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav active={activeFeature} setActive={setActiveFeature} />

      {/* Profile sheet */}
      {showProfileSheet && (
        <ProfileSheet
          activeId={activeProfile}
          onPick={(id) => { setActiveProfile(id); setShowProfileSheet(false); }}
          onClose={() => setShowProfileSheet(false)}
        />
      )}
    </div>
  );
}

/* ── Desktop sidebar ────────────────────────────────────────────── */
function DesktopSidebar({
  activeFeature, setActiveFeature, profile, onProfileClick,
}: {
  activeFeature: string;
  setActiveFeature: (k: string) => void;
  profile: typeof PROFILES[number];
  onProfileClick: () => void;
}) {
  return (
    <aside className="hidden md:flex flex-col w-[260px] lg:w-[280px] flex-shrink-0 px-4 py-5 gap-3">
      {/* Brand */}
      <Link href="/mobile-test" className="flex items-center gap-2.5 px-2 py-2 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-2xl grid place-items-center"
          style={{ background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 60%,#F59E0B 100%)" }}>
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <div className="text-[15px] font-black text-slate-900 leading-none tracking-tight">Quantum Karma</div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Cosmic Bento</div>
        </div>
      </Link>

      {/* Profile card */}
      <button
        onClick={onProfileClick}
        className="relative overflow-hidden rounded-3xl p-4 text-left shadow-sm hover:shadow-md transition-all border border-slate-200 bg-white"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl grid place-items-center text-white font-black text-lg shadow-md"
            style={{ background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 60%,#F59E0B 100%)" }}
          >
            {profile.initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Reading for</div>
            <div className="text-sm font-black text-slate-900 truncate">{profile.name}</div>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <Stat label="Score" value="78" />
          <Stat label="Credits" value="28" />
          <Stat label="Plan" value="Pro" />
        </div>
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pr-1 -mr-1 mt-1 custom-scroll-light">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 mb-2">Workspace</div>
        <NavBtn
          icon={<Sparkles size={15} />}
          label="Home" active={activeFeature === "home"} onClick={() => setActiveFeature("home")}
        />
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 mt-5 mb-2">Readings</div>
        <div className="space-y-0.5">
          {FEATURES.map((f) => {
            const Icon = ICON_MAP[f.key] ?? MessageCircle;
            return (
              <NavBtn
                key={f.key}
                icon={<Icon size={15} />}
                label={f.label}
                accentColor={ACCENT_DOT[f.accent]}
                badge={f.badge}
                active={activeFeature === f.key}
                onClick={() => setActiveFeature(f.key)}
              />
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Top up credits</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-snug mb-3">
          Out of credits? Buy a refill or upgrade to Pro for unlimited.
        </p>
        <button
          className="w-full text-[12px] font-black py-2 rounded-xl text-white shadow-md hover:shadow-lg transition-shadow"
          style={{ background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)" }}
        >
          ⚡ Refill now
        </button>
      </div>
      <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
        <LogOut size={14} /> Sign out
      </button>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-1.5 text-center">
      <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-sm font-black text-slate-900 tabular-nums">{value}</div>
    </div>
  );
}

function NavBtn({
  icon, label, active, onClick, badge, accentColor,
}: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: string; accentColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-3 px-2.5 py-2.5 rounded-2xl text-[13.5px] font-black transition-all
        ${active ? "bg-slate-900 text-white shadow-md" : "text-slate-700 hover:bg-white hover:shadow-sm"}`}
    >
      <span
        className={`w-8 h-8 rounded-xl grid place-items-center flex-shrink-0 transition-colors
          ${active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"}`}
      >
        {icon}
      </span>
      <span className="flex-1 text-left truncate">{label}</span>
      {accentColor && !active && (
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
      )}
      {badge && (
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-wider
          ${active ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* ── Home view ──────────────────────────────────────────────────── */
function HomeView({ profile, onOpen }: { profile: typeof PROFILES[number]; onOpen: (k: string) => void }) {
  const featured = ["explainer", "destiny", "karma-dna", "year-ahead", "royal-roast", "soul-code"];
  const rest = FEATURES.filter((f) => !featured.includes(f.key));

  return (
    <div className="space-y-6 md:space-y-9">
      {/* Hero greeting */}
      <section className="md:hidden">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-700">
          {DAILY.date.split(",")[0]} · {DAILY.date.split(",")[1]}
        </p>
        <h1 className="text-[34px] leading-[1.05] font-black text-slate-900 tracking-tighter mt-2">
          Hey {profile.name},<br/> the day is yours.
        </h1>
      </section>

      {/* Hero card — desktop oversized */}
      <section
        className="relative overflow-hidden rounded-[28px] md:rounded-[36px] p-5 md:p-9 text-slate-900 border border-slate-200"
        style={{
          background:
            "linear-gradient(135deg,#FFE4E6 0%,#EDE9FE 35%,#DBEAFE 70%,#FEF3C7 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-[40%] h-[200%] opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle,#A78BFA 0%,transparent 70%)" }} />

        <div className="relative grid md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white text-[11px] font-black text-slate-700 uppercase tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Today's briefing
            </div>
            <h2 className="hidden md:block text-[40px] lg:text-[48px] leading-[1.05] font-black tracking-tighter mt-4 max-w-2xl text-slate-900">
              {DAILY.vibe}
            </h2>
            <p className="md:hidden text-2xl font-black tracking-tight mt-3 leading-tight text-slate-900">
              {DAILY.vibe}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Pill k="Tithi"     v={DAILY.tithi} />
              <Pill k="Nakshatra" v={DAILY.nakshatra} />
              <Pill k="Yoga"      v={DAILY.yoga} />
              <Pill k="Moon"      v={DAILY.moonSign} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => onOpen("chat")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-[13px] font-black shadow-md hover:shadow-lg transition-shadow"
                style={{ background: "linear-gradient(135deg,#1E1B4B 0%,#581C87 100%)" }}
              >
                <MessageCircle size={14} /> Ask Oracle
              </button>
              <button
                onClick={() => onOpen("destiny")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-[13px] font-black hover:bg-slate-50 transition-colors"
              >
                See Destiny window <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Score circle */}
          <div className="md:scale-110 lg:scale-125 origin-right pr-2">
            <ScoreRing value={DAILY.dayScore} />
          </div>
        </div>
      </section>

      {/* Featured bento */}
      <section>
        <SectionHeading title="Featured for you" hint="Hand-picked from your chart" />
        {/* mobile: scroll-snap carousel */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-3 -mb-3">
            {featured.map((k) => {
              const f = FEATURES.find((x) => x.key === k);
              if (!f) return null;
              return <BentoCard key={k} f={f} onOpen={onOpen} className="snap-start min-w-[78%]" />;
            })}
          </div>
        </div>
        {/* desktop: bento grid */}
        <div className="hidden md:grid grid-cols-12 gap-4">
          {featured.map((k, i) => {
            const f = FEATURES.find((x) => x.key === k);
            if (!f) return null;
            const span = i === 0 ? "col-span-7 row-span-2" : i === 1 ? "col-span-5" : i === 2 ? "col-span-5" : i === 3 ? "col-span-4" : i === 4 ? "col-span-4" : "col-span-4";
            const tall = i === 0;
            return <BentoCard key={k} f={f} onOpen={onOpen} className={span} tall={tall} />;
          })}
        </div>
      </section>

      {/* All readings */}
      <section>
        <SectionHeading title="Everything else" hint={`${rest.length} more readings`} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {rest.map((f) => {
            const Icon = ICON_MAP[f.key] ?? MessageCircle;
            return (
              <button
                key={f.key}
                onClick={() => onOpen(f.key)}
                className="group relative overflow-hidden text-left rounded-2xl p-4 border border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span
                  className="inline-grid place-items-center w-10 h-10 rounded-xl mb-3"
                  style={{ background: ACCENT_BG[f.accent] }}
                >
                  <Icon size={16} className={ACCENT_TEXT[f.accent]} />
                </span>
                <div className="text-[14px] font-black text-slate-900 tracking-tight">{f.label}</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">{f.hint}</p>
                {f.badge && (
                  <span className="absolute top-3 right-3 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 tracking-wider">
                    {f.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <p className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
        AI-generated astrological insights · Not medical advice
      </p>
    </div>
  );
}

function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between mb-3 md:mb-4 px-1">
      <div>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">{title}</h3>
        {hint && <p className="text-[12px] text-slate-600 mt-1 font-medium">{hint}</p>}
      </div>
      <button className="text-[11px] font-black text-slate-700 hover:text-violet-700 transition-colors flex items-center gap-1">
        See all <ArrowRight size={12} />
      </button>
    </div>
  );
}

function BentoCard({
  f, onOpen, className = "", tall = false,
}: { f: Feature; onOpen: (k: string) => void; className?: string; tall?: boolean }) {
  const Icon = ICON_MAP[f.key] ?? MessageCircle;
  return (
    <button
      onClick={() => onOpen(f.key)}
      className={`group relative overflow-hidden rounded-3xl border border-slate-200 text-left transition-all hover:-translate-y-0.5 hover:shadow-xl ${className}`}
      style={{ background: ACCENT_BG[f.accent] }}
    >
      {/* Soft inner texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%,rgba(0,0,0,0.4) 1px,transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className={`relative p-5 md:p-6 flex flex-col justify-between ${tall ? "min-h-[280px] md:min-h-[300px]" : "min-h-[180px] md:min-h-[200px]"}`}>
        <div>
          <div className="flex items-center justify-between">
            <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm">
              <Icon size={18} className={ACCENT_TEXT[f.accent]} />
            </span>
            {f.badge && (
              <span
                className="text-[9px] font-black px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm tracking-wider"
                style={{ color: ACCENT_INK[f.accent] }}
              >
                {f.badge}
              </span>
            )}
          </div>
          <div className={`mt-4 ${tall ? "text-[26px] md:text-[34px]" : "text-[20px] md:text-[22px]"} font-black tracking-tight leading-tight`}
            style={{ color: ACCENT_INK[f.accent] }}
          >
            {f.label}
          </div>
          <p className={`mt-1.5 ${tall ? "text-[14px] md:text-[15px]" : "text-[12.5px]"} font-medium leading-snug max-w-md`}
            style={{ color: ACCENT_INK[f.accent] }}
          >
            {f.hint}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1 text-[12px] font-black px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm"
            style={{ color: ACCENT_INK[f.accent] }}
          >
            Open <ArrowRight size={12} />
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider"
            style={{ color: ACCENT_INK[f.accent], opacity: 0.7 }}
          >
            ~5 credits
          </span>
        </div>
      </div>
    </button>
  );
}

function Pill({ k, v }: { k: string; v: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md ring-1 ring-white text-[11px] font-bold text-slate-700 shadow-sm">
      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">{k}</span>
      <span className="text-slate-900 font-black">{v}</span>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative w-[140px] h-[140px] md:w-[180px] md:h-[180px]">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(15,23,42,0.10)" strokeWidth="7" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="url(#cosmic-grad)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
        />
        <defs>
          <linearGradient id="cosmic-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-[34px] md:text-[44px] font-black text-slate-900 tabular-nums leading-none tracking-tighter">{value}</div>
          <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-1.5">Day score</div>
        </div>
      </div>
    </div>
  );
}

/* ── Chat view ──────────────────────────────────────────────────── */
function ChatView() {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [input, setInput] = useState("");
  const send = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages((prev) => [...prev, { role: "user", text: t }]);
    setInput("");
  };
  return (
    <div className="rounded-[28px] md:rounded-[32px] border border-slate-200 bg-white shadow-md overflow-hidden flex flex-col h-[calc(100dvh-220px)] md:h-[calc(100dvh-200px)]">
      <div className="px-5 md:px-6 py-4 border-b border-slate-100 flex items-center justify-between"
        style={{ background: "linear-gradient(90deg,#FFE4E6 0%,#EDE9FE 100%)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-2xl grid place-items-center text-white shadow-md"
            style={{ background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 60%,#F59E0B 100%)" }}
          >
            <Sparkles size={16} />
          </span>
          <div>
            <div className="text-[15px] font-black text-slate-900 leading-none">Quantum Oracle</div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-600 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 align-middle" /> Online · cites D1–D60
            </div>
          </div>
        </div>
        <button className="text-[11px] font-black text-slate-600 hover:text-rose-600">Clear</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "items-start gap-3"}`}>
            {m.role === "assistant" && (
              <span
                className="w-9 h-9 rounded-2xl grid place-items-center text-white flex-shrink-0 shadow"
                style={{ background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)" }}
              >
                <Sparkles size={14} />
              </span>
            )}
            <div className={m.role === "user"
              ? "max-w-[88%] md:max-w-[68%] rounded-3xl rounded-tr-md px-4 py-3 text-white shadow-md"
              : "max-w-[88%] md:max-w-[80%] rounded-3xl rounded-tl-md px-4 py-3 bg-slate-50 border border-slate-100 text-slate-900"
            }
              style={m.role === "user"
                ? { background: "linear-gradient(135deg,#1E1B4B 0%,#581C87 100%)" }
                : undefined}
            >
              <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pt-3 flex gap-2 overflow-x-auto no-scrollbar pb-2 border-t border-slate-100">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => send(c)}
            className="flex-shrink-0 text-xs font-bold px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-violet-400 hover:text-violet-700 hover:bg-violet-50 transition-all whitespace-nowrap"
          >
            {c}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 md:p-4 flex items-end gap-2 border-t border-slate-100 bg-white">
        <div className="flex-1 flex items-end rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-violet-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100 transition-all overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Quantum Oracle…"
            rows={1}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 px-4 py-3 focus:outline-none text-[15px] font-medium resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim()}
          className="h-12 w-12 rounded-2xl text-white grid place-items-center shadow-md disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)" }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

/* ── Feature stub ───────────────────────────────────────────────── */
function FeatureStub({ featureKey, onBack }: { featureKey: string; onBack: () => void }) {
  const f = FEATURES.find((x) => x.key === featureKey);
  if (!f) return null;
  const Icon = ICON_MAP[f.key] ?? MessageCircle;
  return (
    <div>
      <button onClick={onBack} className="md:hidden inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-4">
        <ArrowLeft size={14} /> Back
      </button>

      <section
        className="rounded-[28px] md:rounded-[36px] border border-slate-200 p-6 md:p-10 mb-5"
        style={{ background: ACCENT_BG[f.accent] }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm mb-4">
              <Icon size={22} className={ACCENT_TEXT[f.accent]} />
            </span>
            <h2 className="text-[34px] md:text-[44px] font-black tracking-tighter leading-[1.05]"
              style={{ color: ACCENT_INK[f.accent] }}
            >
              {f.label}
            </h2>
            <p className="text-[15px] md:text-[17px] font-medium mt-2 max-w-2xl"
              style={{ color: ACCENT_INK[f.accent] }}
            >
              {f.hint}
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-white text-[14px] font-black shadow-md hover:shadow-lg transition-shadow self-start md:self-center"
            style={{ background: "linear-gradient(135deg,#1E1B4B 0%,#581C87 100%)" }}
          >
            Generate now <ArrowRight size={15} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 md:gap-3 max-w-xl">
          {[
            ["Charts", "16"],
            ["Layers", "3"],
            ["Sources", "Live"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-white/80 backdrop-blur-md px-3 py-2.5 text-center">
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-600">{k}</div>
              <div className="text-base font-black tabular-nums" style={{ color: ACCENT_INK[f.accent] }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7 shadow-sm">
        <p className="text-[15px] text-slate-800 leading-relaxed">
          <strong className="text-slate-900">Preview placeholder.</strong> In production
          this panel mounts the real <code className="font-mono text-violet-700">{f.key}</code> component
          from <code className="font-mono text-violet-700">/dashboard/components</code>. The
          frame, gradients, type scale and contrast are what's being evaluated here.
        </p>
        <p className="text-[14px] text-slate-700 mt-3 leading-relaxed">
          Cosmic Bento targets a vibrant, story-driven feel — closer to a premium
          consumer app than a workspace tool. Tinted bento cards keep every reading
          unique while shared frame proportions keep the system coherent.
        </p>
      </div>
    </div>
  );
}

/* ── Mobile bottom nav ──────────────────────────────────────────── */
function MobileNav({ active, setActive }: { active: string; setActive: (k: string) => void }) {
  const items: { key: string; icon: React.ReactNode; label: string }[] = [
    { key: "home",      icon: <Sparkles size={20} />,    label: "Home" },
    { key: "chat",      icon: <MessageCircle size={20} />, label: "Oracle" },
    { key: "destiny",   icon: <Calendar size={20} />,    label: "Destiny" },
    { key: "year-ahead",icon: <Star size={20} />,        label: "Year" },
    { key: "remedy",    icon: <Gem size={20} />,         label: "Remedy" },
  ];
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(env(safe-area-inset-bottom),10px)] pt-2"
      style={{ background: "linear-gradient(180deg,transparent 0%,#FAFAF9 50%)" }}
    >
      <div
        className="mx-auto max-w-md rounded-[28px] bg-white border border-slate-200 shadow-[0_18px_50px_-12px_rgba(124,58,237,0.25)]"
      >
        <div className="grid grid-cols-5 px-2 py-1.5">
          {items.map((it) => {
            const isActive = active === it.key;
            return (
              <button
                key={it.key}
                onClick={() => setActive(it.key)}
                className="relative flex flex-col items-center justify-center gap-0.5 py-2 rounded-2xl active:scale-95 transition-transform"
              >
                <span
                  className={`grid place-items-center w-11 h-11 rounded-2xl transition-all ${isActive ? "text-white shadow-md" : "text-slate-600"}`}
                  style={isActive
                    ? { background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)" }
                    : undefined}
                >
                  {it.icon}
                </span>
                <span className={`text-[10px] font-black tracking-wide ${isActive ? "text-violet-700" : "text-slate-500"}`}>
                  {it.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Profile sheet ──────────────────────────────────────────────── */
function ProfileSheet({ activeId, onPick, onClose }: { activeId: string; onPick: (id: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 md:p-6 bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full md:max-w-md rounded-[28px] bg-white shadow-2xl border border-slate-100 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-slate-900">Reading for</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-slate-100">
            <X size={14} className="text-slate-600" />
          </button>
        </div>
        <div className="space-y-1.5">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border
                ${activeId === p.id ? "border-violet-300 bg-violet-50/70" : "border-slate-100 hover:bg-slate-50"}`}
            >
              <span
                className="w-11 h-11 rounded-2xl grid place-items-center text-white font-black shadow-sm"
                style={{ background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 60%,#F59E0B 100%)" }}
              >
                {p.initial}
              </span>
              <div className="flex-1 text-left">
                <div className="text-[15px] font-black text-slate-900">{p.name}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{p.relationship}</div>
              </div>
              {activeId === p.id && <span className="text-[10px] font-black text-violet-700">ACTIVE</span>}
            </button>
          ))}
          <button className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-slate-300 hover:border-violet-400 hover:bg-violet-50/40 transition-all">
            <span className="w-11 h-11 rounded-2xl bg-slate-100 grid place-items-center text-slate-500">
              <Plus size={16} />
            </span>
            <span className="text-[14px] font-black text-slate-700">Add a bond</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function currentLabel(key: string) {
  if (key === "home") return "Home";
  return FEATURES.find((f) => f.key === key)?.label ?? "Dashboard";
}
