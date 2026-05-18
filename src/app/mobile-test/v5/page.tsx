"use client";

/* ═══════════════════════════════════════════════════════════════════════════
 * V5 — LIQUID GLASS
 * iOS 26 · VisionOS · Spatial. Heavy frosted-glass panels layered over a
 * slow-drifting gradient mesh. Soft chrome, real depth, refined motion.
 * Light theme · WCAG AA contrast · mobile-first.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles, Search, Send, ChevronRight, LogOut, MessageCircle,
  BookOpen, Compass, Map, Flame, Sun, Heart, Mic, Calendar, Crown, Gem,
  FileText, ListChecks, ArrowLeft, ArrowRight, Plus, Bell, X,
  Home, Settings,
  type LucideIcon,
} from "lucide-react";
import { FEATURES, PROFILES, DAILY, CHIPS, SAMPLE_MESSAGES, type Feature } from "../data";

const ICON_MAP: Record<string, LucideIcon> = {
  explainer: BookOpen, chat: MessageCircle, destiny: Calendar, "karma-dna": Sparkles,
  "karmic-patterns": Compass, "royal-roast": Flame, gotra: Sun, "ishta-devata": Heart,
  journal: Mic, "year-ahead": Calendar, "soul-code": Crown, roadmap: Map,
  remedy: Gem, reports: FileText, details: ListChecks,
};

/* Per-feature glass tint — keeps each card distinct without breaking calm. */
const TINT: Record<Feature["accent"], { from: string; to: string; ink: string; ring: string }> = {
  indigo:  { from: "rgba(199,210,254,0.55)", to: "rgba(244,238,255,0.45)", ink: "#1E1B4B", ring: "rgba(99,102,241,0.18)" },
  amber:   { from: "rgba(254,243,199,0.60)", to: "rgba(255,247,237,0.50)", ink: "#451A03", ring: "rgba(217,119,6,0.18)"  },
  rose:    { from: "rgba(254,205,211,0.55)", to: "rgba(255,228,230,0.45)", ink: "#4C0519", ring: "rgba(225,29,72,0.18)"  },
  emerald: { from: "rgba(167,243,208,0.55)", to: "rgba(220,252,231,0.45)", ink: "#022C22", ring: "rgba(5,150,105,0.18)"  },
  purple:  { from: "rgba(221,214,254,0.55)", to: "rgba(245,243,255,0.45)", ink: "#2E1065", ring: "rgba(124,58,237,0.18)" },
  orange:  { from: "rgba(253,186,116,0.50)", to: "rgba(255,237,213,0.50)", ink: "#431407", ring: "rgba(234,88,12,0.18)"  },
  sky:     { from: "rgba(186,230,253,0.55)", to: "rgba(224,242,254,0.45)", ink: "#082F49", ring: "rgba(2,132,199,0.18)"  },
  slate:   { from: "rgba(226,232,240,0.55)", to: "rgba(248,250,252,0.45)", ink: "#0F172A", ring: "rgba(71,85,105,0.18)"  },
};

export default function V5Page() {
  const [activeProfile, setActiveProfile] = useState(PROFILES[0].id);
  const [activeFeature, setActiveFeature] = useState<string>("home");
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const profile = PROFILES.find((p) => p.id === activeProfile)!;

  return (
    <div className="relative min-h-[100dvh] w-full text-slate-900 overflow-x-hidden">
      {/* Drifting gradient mesh */}
      <MeshBackground />

      <div className="relative z-10 flex min-h-[100dvh]">
        {/* Desktop floating sidebar */}
        <DesktopSidebar
          activeFeature={activeFeature}
          setActiveFeature={setActiveFeature}
          profile={profile}
          onProfileClick={() => setShowProfileSheet(true)}
        />

        {/* Main */}
        <main className="flex-1 min-w-0 flex flex-col px-4 md:px-7 lg:px-9 pt-3 md:pt-5 pb-32 md:pb-8">
          <TopBar
            profile={profile}
            activeFeature={activeFeature}
            onProfileClick={() => setShowProfileSheet(true)}
          />

          {activeFeature === "home" && <HomeView profile={profile} onOpen={setActiveFeature} />}
          {activeFeature === "chat" && <ChatView profile={profile} />}
          {activeFeature !== "home" && activeFeature !== "chat" && (
            <FeatureView featureKey={activeFeature} onBack={() => setActiveFeature("home")} />
          )}
        </main>
      </div>

      {/* Mobile floating tab bar */}
      <MobileTabBar active={activeFeature} setActive={setActiveFeature} />

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

/* ── Mesh background ────────────────────────────────────────────── */
function MeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#FAFBFF" }} />
      {/* Drifting blobs */}
      <div className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[80px] opacity-70 v5-blob v5-blob-a"
        style={{ background: "radial-gradient(closest-side, #FBCFE8, transparent 70%)" }} />
      <div className="absolute top-[20%] -right-[15%] w-[50vw] h-[50vw] rounded-full blur-[80px] opacity-65 v5-blob v5-blob-b"
        style={{ background: "radial-gradient(closest-side, #C7D2FE, transparent 70%)" }} />
      <div className="absolute bottom-[5%] left-[10%] w-[60vw] h-[60vw] rounded-full blur-[80px] opacity-60 v5-blob v5-blob-c"
        style={{ background: "radial-gradient(closest-side, #BAE6FD, transparent 70%)" }} />
      <div className="absolute bottom-[20%] right-[15%] w-[40vw] h-[40vw] rounded-full blur-[80px] opacity-50 v5-blob v5-blob-d"
        style={{ background: "radial-gradient(closest-side, #FDE68A, transparent 70%)" }} />
      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.022] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,23,42,1) 1px,transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
      <style>{`
        @keyframes v5-drift-a { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(8vw,4vh) scale(1.08);} }
        @keyframes v5-drift-b { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-6vw,6vh) scale(0.92);} }
        @keyframes v5-drift-c { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(4vw,-5vh) scale(1.05);} }
        @keyframes v5-drift-d { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-8vw,-4vh) scale(0.95);} }
        .v5-blob-a { animation: v5-drift-a 28s ease-in-out infinite; }
        .v5-blob-b { animation: v5-drift-b 32s ease-in-out infinite; }
        .v5-blob-c { animation: v5-drift-c 30s ease-in-out infinite; }
        .v5-blob-d { animation: v5-drift-d 34s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

/* ── Glass primitive ────────────────────────────────────────────── */
function Glass({ children, className = "", strength = "lg", style }: {
  children: React.ReactNode; className?: string; strength?: "sm" | "md" | "lg" | "xl"; style?: React.CSSProperties;
}) {
  const blur = { sm: "blur(14px)", md: "blur(20px)", lg: "blur(28px)", xl: "blur(40px)" }[strength];
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/60 ${className}`}
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: `${blur} saturate(180%)`,
        WebkitBackdropFilter: `${blur} saturate(180%)`,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.9) inset, 0 0 0 0.5px rgba(255,255,255,0.5) inset, 0 30px 60px -25px rgba(15,23,42,0.18), 0 8px 24px -8px rgba(15,23,42,0.10)",
        ...style,
      }}
    >
      {/* Top inner highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.7), transparent)" }} />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ── Desktop sidebar (floating glass rail) ──────────────────────── */
function DesktopSidebar({
  activeFeature, setActiveFeature, profile, onProfileClick,
}: {
  activeFeature: string;
  setActiveFeature: (k: string) => void;
  profile: typeof PROFILES[number];
  onProfileClick: () => void;
}) {
  return (
    <aside className="hidden md:flex flex-col w-[256px] lg:w-[284px] flex-shrink-0 px-3 lg:px-4 py-4 gap-3 sticky top-0 h-[100dvh]">
      {/* Brand */}
      <Link href="/mobile-test" className="flex items-center gap-2.5 px-2 py-2 hover:opacity-80 transition-opacity">
        <div className="w-9 h-9 rounded-2xl grid place-items-center"
          style={{ background: "linear-gradient(135deg,#A78BFA 0%,#F472B6 50%,#FBBF24 100%)" }}
        >
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-slate-900 leading-none tracking-[-0.01em]">Quantum Karma</div>
          <div className="text-[10px] font-semibold text-slate-500 tracking-[0.18em] uppercase mt-1">Spatial</div>
        </div>
      </Link>

      {/* Profile */}
      <Glass className="p-3" strength="md">
        <button onClick={onProfileClick} className="w-full flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-2xl grid place-items-center text-white font-semibold text-[15px] shadow-md"
            style={{ background: "linear-gradient(135deg,#A78BFA 0%,#F472B6 100%)" }}
          >
            {profile.initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Reading for</div>
            <div className="text-[14px] font-semibold text-slate-900 truncate">{profile.name}</div>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </button>
      </Glass>

      {/* Nav */}
      <Glass className="flex-1 min-h-0 flex flex-col" strength="md">
        <div className="flex-1 overflow-y-auto px-2 py-2 custom-scroll-light">
          <NavBtn icon={<Home size={15} />} label="Home" active={activeFeature === "home"} onClick={() => setActiveFeature("home")} />
          <div className="px-2 mt-4 mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Readings
          </div>
          {FEATURES.map((f) => {
            const Icon = ICON_MAP[f.key] ?? MessageCircle;
            const tint = TINT[f.accent];
            return (
              <NavBtn
                key={f.key}
                icon={<Icon size={15} />}
                label={f.label}
                badge={f.badge}
                tintColor={tint.ring}
                active={activeFeature === f.key}
                onClick={() => setActiveFeature(f.key)}
              />
            );
          })}
        </div>
      </Glass>

      {/* Footer */}
      <Glass className="p-3" strength="md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">Credits</span>
          <span className="text-[12.5px] font-semibold text-slate-900 tabular-nums">28 / 50</span>
        </div>
        <div className="h-1 bg-slate-200/60 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: "56%", background: "linear-gradient(90deg,#A78BFA,#F472B6)" }} />
        </div>
        <button className="mt-3 w-full text-[12px] font-semibold py-2 rounded-xl text-white shadow-md transition-shadow hover:shadow-lg"
          style={{ background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)" }}
        >
          Refill credits
        </button>
      </Glass>
    </aside>
  );
}

function NavBtn({ icon, label, active, onClick, badge, tintColor }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: string; tintColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-[13.5px] font-medium transition-all
        ${active ? "bg-white/80 text-slate-900 shadow-sm ring-1 ring-white" : "text-slate-700 hover:bg-white/40 hover:text-slate-900"}`}
    >
      <span className={`w-8 h-8 rounded-xl grid place-items-center flex-shrink-0 transition-all
        ${active ? "bg-white shadow-sm" : "bg-white/50 group-hover:bg-white/70"}`}
        style={active && tintColor ? { boxShadow: `0 0 0 1px ${tintColor}, 0 1px 2px rgba(15,23,42,0.06)` } : undefined}
      >
        <span className={active ? "text-slate-900" : "text-slate-700"}>{icon}</span>
      </span>
      <span className="flex-1 text-left truncate font-semibold">{label}</span>
      {badge && (
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md tracking-[0.12em] ${active ? "bg-slate-900 text-white" : "bg-white/70 text-slate-700"}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* ── Top bar ────────────────────────────────────────────────────── */
function TopBar({ profile, activeFeature, onProfileClick }: {
  profile: typeof PROFILES[number]; activeFeature: string; onProfileClick: () => void;
}) {
  return (
    <header className="flex items-center gap-2.5 mb-5 md:mb-7">
      <div className="md:hidden flex items-center gap-2.5 flex-1 min-w-0">
        <Link href="/mobile-test"
          className="w-10 h-10 grid place-items-center rounded-2xl border border-white/60"
          style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px) saturate(180%)" }}
        >
          <ArrowLeft size={16} className="text-slate-700" />
        </Link>
        <button onClick={onProfileClick}
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl border border-white/60 max-w-full"
          style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px) saturate(180%)" }}
        >
          <span className="w-8 h-8 rounded-xl grid place-items-center text-white font-semibold text-[12px]"
            style={{ background: "linear-gradient(135deg,#A78BFA 0%,#F472B6 100%)" }}
          >
            {profile.initial}
          </span>
          <span className="text-[13px] font-semibold text-slate-900 truncate max-w-[7rem]">{profile.name}</span>
          <ChevronRight size={12} className="text-slate-500" />
        </button>
      </div>

      <div className="hidden md:flex items-baseline gap-3 flex-1 min-w-0">
        <h1 className="text-[26px] lg:text-[30px] font-semibold text-slate-900 tracking-[-0.02em] leading-none truncate">
          {activeFeature === "home" ? "Home" : currentLabel(activeFeature)}
        </h1>
        <span className="text-[12px] font-semibold text-slate-500 tracking-[0.16em] uppercase">
          {DAILY.date}
        </span>
      </div>

      <button className="h-10 w-10 md:w-auto md:px-4 grid place-items-center md:flex md:items-center md:gap-2 rounded-2xl border border-white/60"
        style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px) saturate(180%)" }}
      >
        <Search size={16} className="text-slate-700" />
        <span className="hidden md:inline text-[13px] font-semibold text-slate-700">Search</span>
      </button>
      <button className="h-10 w-10 grid place-items-center rounded-2xl border border-white/60 relative"
        style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px) saturate(180%)" }}
      >
        <Bell size={16} className="text-slate-700" />
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
      </button>
    </header>
  );
}

/* ── Home view ──────────────────────────────────────────────────── */
function HomeView({ profile, onOpen }: { profile: typeof PROFILES[number]; onOpen: (k: string) => void }) {
  const featured = ["explainer", "destiny", "karma-dna"];
  const rest = FEATURES.filter((f) => !featured.includes(f.key));

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero greeting card */}
      <Glass strength="lg" className="p-6 md:p-9">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Today's briefing
            </span>
            <h1 className="text-[32px] md:text-[44px] lg:text-[52px] font-semibold text-slate-900 tracking-[-0.025em] leading-[1.05] mt-4">
              Hello, {profile.name}.<br/>
              <span className="text-slate-700">{DAILY.vibe}.</span>
            </h1>
            <p className="text-[14.5px] md:text-[15.5px] text-slate-700 mt-3 leading-relaxed max-w-md">
              Mercury moves into your 10th at 11:08 IST — the day's negotiation window opens.
              Use it before 13:42 for high-stakes communication.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                ["Tithi", DAILY.tithi],
                ["Nakshatra", DAILY.nakshatra],
                ["Yoga", DAILY.yoga],
                ["Moon", DAILY.moonSign],
              ].map(([k, v]) => (
                <div key={k} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-white text-[12px]">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{k}</span>
                  <span className="font-semibold text-slate-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => onOpen("chat")}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl text-white text-[13px] font-semibold shadow-md hover:shadow-lg transition-shadow"
                style={{ background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)" }}
              >
                <MessageCircle size={14} /> Ask Oracle
              </button>
              <button
                onClick={() => onOpen("destiny")}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl border border-white/70 text-slate-900 text-[13px] font-semibold hover:bg-white/60 transition-colors"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(14px)" }}
              >
                Destiny window <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <ScoreRing value={DAILY.dayScore} />
        </div>
      </Glass>

      {/* Featured glass cards */}
      <section>
        <SectionHead title="Featured for you" hint="Hand-picked from your chart" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {featured.map((k) => {
            const f = FEATURES.find((x) => x.key === k);
            if (!f) return null;
            return <FeatureGlassCard key={k} f={f} onOpen={onOpen} large />;
          })}
        </div>
      </section>

      {/* All readings */}
      <section>
        <SectionHead title="All readings" hint={`${rest.length} more`} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {rest.map((f) => (
            <FeatureGlassCard key={f.key} f={f} onOpen={onOpen} />
          ))}
        </div>
      </section>

      <p className="text-center text-[10px] uppercase tracking-[0.22em] font-semibold text-slate-500">
        AI-generated astrological insights · Not medical advice
      </p>
    </div>
  );
}

function SectionHead({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between mb-3 md:mb-4 px-1">
      <div>
        <h3 className="text-[19px] md:text-[22px] font-semibold text-slate-900 tracking-[-0.02em] leading-none">
          {title}
        </h3>
        {hint && <p className="text-[12.5px] text-slate-600 mt-1">{hint}</p>}
      </div>
      <button className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1">
        See all <ArrowRight size={12} />
      </button>
    </div>
  );
}

function FeatureGlassCard({ f, onOpen, large = false }: { f: Feature; onOpen: (k: string) => void; large?: boolean }) {
  const Icon = ICON_MAP[f.key] ?? MessageCircle;
  const tint = TINT[f.accent];
  return (
    <button
      onClick={() => onOpen(f.key)}
      className={`group relative overflow-hidden rounded-3xl border border-white/60 text-left transition-all hover:-translate-y-0.5 ${large ? "p-5 md:p-6 min-h-[200px]" : "p-4 min-h-[150px]"}`}
      style={{
        background: `linear-gradient(135deg, ${tint.from} 0%, ${tint.to} 100%), rgba(255,255,255,0.55)`,
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.9) inset, 0 0 0 0.5px rgba(255,255,255,0.5) inset, 0 16px 36px -12px rgba(15,23,42,0.16), 0 4px 12px -4px rgba(15,23,42,0.08)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6), transparent)" }} />
      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between">
          <span className="w-11 h-11 rounded-2xl grid place-items-center bg-white/70 backdrop-blur-md ring-1 ring-white shadow-sm">
            <Icon size={17} style={{ color: tint.ink }} />
          </span>
          {f.badge && (
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] px-2 py-1 rounded-full bg-white/70 ring-1 ring-white"
              style={{ color: tint.ink }}
            >
              {f.badge}
            </span>
          )}
        </div>
        <div className={`mt-4 ${large ? "text-[20px]" : "text-[15px]"} font-semibold tracking-[-0.01em] leading-tight`}
          style={{ color: tint.ink }}
        >
          {f.label}
        </div>
        <p className={`mt-1 ${large ? "text-[13px]" : "text-[11.5px]"} leading-snug max-w-md`}
          style={{ color: tint.ink, opacity: 0.78 }}
        >
          {f.hint}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/70 ring-1 ring-white"
            style={{ color: tint.ink }}
          >
            Open <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </button>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative w-[140px] h-[140px] md:w-[180px] md:h-[180px]">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(15,23,42,0.10)" strokeWidth="6" />
        <circle cx="50" cy="50" r={r} fill="none"
          stroke="url(#v5-grad)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
        />
        <defs>
          <linearGradient id="v5-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-[36px] md:text-[44px] font-semibold text-slate-900 tabular-nums leading-none tracking-[-0.03em]">
            {value}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 mt-1.5">Day score</div>
        </div>
      </div>
    </div>
  );
}

/* ── Chat view ──────────────────────────────────────────────────── */
function ChatView({ profile }: { profile: typeof PROFILES[number] }) {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [input, setInput] = useState("");
  const send = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages((prev) => [...prev, { role: "user", text: t }]);
    setInput("");
  };
  return (
    <Glass strength="lg" className="overflow-hidden flex flex-col h-[calc(100dvh-200px)] md:h-[calc(100dvh-180px)]">
      <div className="px-5 py-4 border-b border-white/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-2xl grid place-items-center text-white shadow-md"
            style={{ background: "linear-gradient(135deg,#A78BFA 0%,#F472B6 100%)" }}
          >
            <Sparkles size={14} />
          </span>
          <div>
            <div className="text-[14px] font-semibold text-slate-900 leading-none">Quantum Oracle</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 align-middle" /> Live · for {profile.name}
            </div>
          </div>
        </div>
        <button className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 hover:text-rose-600 transition-colors">
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 custom-scroll-light">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "items-start gap-3"}`}>
            {m.role === "assistant" && (
              <span className="w-9 h-9 rounded-2xl grid place-items-center text-white flex-shrink-0 shadow"
                style={{ background: "linear-gradient(135deg,#A78BFA 0%,#F472B6 100%)" }}
              >
                <Sparkles size={14} />
              </span>
            )}
            <div className={m.role === "user"
              ? "max-w-[88%] md:max-w-[68%] rounded-3xl rounded-tr-md px-4 py-3 text-white shadow-md"
              : "max-w-[88%] md:max-w-[80%] rounded-3xl rounded-tl-md px-4 py-3 border border-white/60 text-slate-900"
            }
              style={m.role === "user"
                ? { background: "linear-gradient(135deg,#1E1B4B 0%,#581C87 100%)" }
                : { background: "rgba(255,255,255,0.65)", backdropFilter: "blur(14px)" }
              }
            >
              <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pt-3 flex gap-2 overflow-x-auto no-scrollbar pb-2 border-t border-white/40">
        {CHIPS.map((c) => (
          <button key={c} onClick={() => send(c)}
            className="flex-shrink-0 text-[12px] font-semibold px-3.5 py-1.5 rounded-full border border-white/60 text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap"
            style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(14px)" }}
          >
            {c}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 md:p-4 flex items-end gap-2 border-t border-white/40">
        <div className="flex-1 flex items-end rounded-2xl border border-white/60 focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100 transition-all overflow-hidden"
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(14px)" }}
        >
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Message Quantum Oracle…"
            rows={1}
            className="w-full bg-transparent text-slate-900 placeholder-slate-500 px-4 py-3 focus:outline-none text-[15px] font-medium resize-none"
          />
        </div>
        <button type="submit" disabled={!input.trim()}
          className="h-12 w-12 rounded-2xl text-white grid place-items-center shadow-md disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)" }}
        >
          <Send size={17} />
        </button>
      </form>
    </Glass>
  );
}

/* ── Feature view ───────────────────────────────────────────────── */
function FeatureView({ featureKey, onBack }: { featureKey: string; onBack: () => void }) {
  const f = FEATURES.find((x) => x.key === featureKey);
  if (!f) return null;
  const Icon = ICON_MAP[f.key] ?? MessageCircle;
  const tint = TINT[f.accent];
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="md:hidden inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-700">
        <ArrowLeft size={14} /> Back
      </button>

      <Glass strength="lg" className="p-6 md:p-10"
        style={{ background: `linear-gradient(135deg, ${tint.from} 0%, ${tint.to} 100%), rgba(255,255,255,0.55)` }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <span className="w-14 h-14 rounded-3xl grid place-items-center bg-white/70 ring-1 ring-white shadow-sm mb-4 inline-grid">
              <Icon size={22} style={{ color: tint.ink }} />
            </span>
            <h2 className="text-[32px] md:text-[40px] font-semibold tracking-[-0.025em] leading-[1.05]"
              style={{ color: tint.ink }}
            >
              {f.label}
            </h2>
            <p className="text-[14.5px] md:text-[16px] mt-2 max-w-2xl"
              style={{ color: tint.ink, opacity: 0.82 }}
            >
              {f.hint}
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-2xl text-white text-[13px] font-semibold shadow-md hover:shadow-lg transition-shadow self-start md:self-center"
            style={{ background: "linear-gradient(135deg,#1E1B4B 0%,#581C87 100%)" }}
          >
            Generate now <ArrowRight size={14} />
          </button>
        </div>
      </Glass>

      <Glass className="p-5 md:p-7">
        <p className="text-[15px] text-slate-800 leading-relaxed">
          <strong className="text-slate-900">Preview placeholder.</strong> In production this panel
          mounts the real <code className="font-mono text-violet-700 px-1.5 py-0.5 rounded bg-white/60">{f.key}</code> component
          from <code className="font-mono text-violet-700 px-1.5 py-0.5 rounded bg-white/60">/dashboard/components</code>.
        </p>
        <p className="text-[14px] text-slate-700 mt-3 leading-relaxed">
          Liquid Glass leans into translucency, depth and motion — the iOS 26 / VisionOS direction.
          Each card is a real frosted-glass surface with inner highlights and tinted gradients.
        </p>
      </Glass>
    </div>
  );
}

/* ── Mobile floating tab bar ────────────────────────────────────── */
function MobileTabBar({ active, setActive }: { active: string; setActive: (k: string) => void }) {
  const items: { key: string; icon: React.ReactNode; label: string }[] = [
    { key: "home",      icon: <Home size={18} />,         label: "Home" },
    { key: "chat",      icon: <MessageCircle size={18} />, label: "Oracle" },
    { key: "destiny",   icon: <Calendar size={18} />,    label: "Destiny" },
    { key: "karma-dna", icon: <Compass size={18} />,     label: "Karma" },
    { key: "remedy",    icon: <Settings size={18} />,    label: "More" },
  ];
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
      <div className="mx-auto max-w-md rounded-[28px] border border-white/60 px-2 py-1.5"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.9) inset, 0 0 0 0.5px rgba(255,255,255,0.6) inset, 0 18px 50px -12px rgba(15,23,42,0.20)",
        }}
      >
        <div className="grid grid-cols-5">
          {items.map((it) => {
            const isActive = active === it.key;
            return (
              <button key={it.key} onClick={() => setActive(it.key)}
                className="relative flex flex-col items-center justify-center gap-0.5 py-2 rounded-2xl active:scale-95 transition-transform"
              >
                <span className={`grid place-items-center w-10 h-10 rounded-2xl transition-all ${isActive ? "text-white shadow-md" : "text-slate-700"}`}
                  style={isActive
                    ? { background: "linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)" }
                    : undefined}
                >
                  {it.icon}
                </span>
                <span className={`text-[10px] font-semibold tracking-wide ${isActive ? "text-violet-700" : "text-slate-600"}`}>
                  {it.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/* ── Profile sheet ──────────────────────────────────────────────── */
function ProfileSheet({ activeId, onPick, onClose }: { activeId: string; onPick: (id: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 md:p-6 bg-slate-900/30 backdrop-blur-md" onClick={onClose}>
      <Glass className="w-full md:max-w-md p-5" strength="xl">
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-slate-900 tracking-[-0.01em]">Reading for</h3>
            <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-white/40">
              <X size={14} className="text-slate-600" />
            </button>
          </div>
          <div className="space-y-1.5">
            {PROFILES.map((p) => (
              <button key={p.id} onClick={() => onPick(p.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border
                  ${activeId === p.id ? "border-white bg-white/70" : "border-white/40 hover:bg-white/40"}`}
              >
                <span className="w-11 h-11 rounded-2xl grid place-items-center text-white font-semibold shadow"
                  style={{ background: "linear-gradient(135deg,#A78BFA 0%,#F472B6 100%)" }}
                >
                  {p.initial}
                </span>
                <div className="flex-1 text-left">
                  <div className="text-[14px] font-semibold text-slate-900">{p.name}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{p.relationship}</div>
                </div>
                {activeId === p.id && <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700">Active</span>}
              </button>
            ))}
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-white/70 hover:bg-white/40 transition-all">
              <span className="w-11 h-11 rounded-2xl bg-white/60 grid place-items-center text-slate-600">
                <Plus size={16} />
              </span>
              <span className="text-[14px] font-semibold text-slate-700">Add a bond</span>
            </button>
          </div>
        </div>
      </Glass>
    </div>
  );
}

function currentLabel(key: string) {
  if (key === "home") return "Home";
  return FEATURES.find((f) => f.key === key)?.label ?? "Dashboard";
}
