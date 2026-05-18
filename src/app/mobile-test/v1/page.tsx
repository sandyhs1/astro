"use client";

/* ────────────────────────────────────────────────────────────────────────────
 * V1 — AURORA SOFT
 * Soft pastel mesh background · glassmorphism · floating bottom dock on mobile
 * Slim left rail on desktop · friendly premium-consumer feel
 * Light theme · WCAG AA contrast · mobile-first
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles, Search, Send, Plus, ChevronRight, Bell, LogOut, MessageCircle,
  BookOpen, Compass, Map, Flame, Sun, Heart, Mic, Calendar, Crown, Gem,
  FileText, ListChecks, ArrowLeft, Settings,
} from "lucide-react";
import {
  FEATURES, PROFILES, DAILY, CHIPS, SAMPLE_MESSAGES, type Feature,
} from "../data";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  explainer: BookOpen, chat: MessageCircle, destiny: Calendar, "karma-dna": Sparkles,
  "karmic-patterns": Compass, "royal-roast": Flame, gotra: Sun, "ishta-devata": Heart,
  journal: Mic, "year-ahead": Calendar, "soul-code": Crown, roadmap: Map,
  remedy: Gem, reports: FileText, details: ListChecks,
};

const ACCENT: Record<Feature["accent"], { soft: string; ring: string; chip: string; text: string; dot: string }> = {
  indigo:  { soft: "from-indigo-100/70 to-violet-100/60",  ring: "ring-indigo-200",  chip: "bg-indigo-50 text-indigo-700",   text: "text-indigo-700",   dot: "bg-indigo-500"  },
  amber:   { soft: "from-amber-100/70 to-orange-100/50",   ring: "ring-amber-200",   chip: "bg-amber-50 text-amber-800",     text: "text-amber-800",    dot: "bg-amber-500"   },
  rose:    { soft: "from-rose-100/70 to-pink-100/60",      ring: "ring-rose-200",    chip: "bg-rose-50 text-rose-700",       text: "text-rose-700",     dot: "bg-rose-500"    },
  emerald: { soft: "from-emerald-100/70 to-teal-100/60",   ring: "ring-emerald-200", chip: "bg-emerald-50 text-emerald-700", text: "text-emerald-700",  dot: "bg-emerald-500" },
  purple:  { soft: "from-purple-100/70 to-fuchsia-100/60", ring: "ring-purple-200",  chip: "bg-purple-50 text-purple-700",   text: "text-purple-700",   dot: "bg-purple-500"  },
  orange:  { soft: "from-orange-100/70 to-red-100/50",     ring: "ring-orange-200",  chip: "bg-orange-50 text-orange-700",   text: "text-orange-700",   dot: "bg-orange-500"  },
  sky:     { soft: "from-sky-100/70 to-cyan-100/60",       ring: "ring-sky-200",     chip: "bg-sky-50 text-sky-700",         text: "text-sky-700",      dot: "bg-sky-500"     },
  slate:   { soft: "from-slate-100/80 to-slate-50",        ring: "ring-slate-200",   chip: "bg-slate-100 text-slate-700",    text: "text-slate-700",    dot: "bg-slate-500"   },
};

export default function V1Page() {
  const [activeProfile, setActiveProfile] = useState(PROFILES[0].id);
  const [activeFeature, setActiveFeature] = useState<string>("home");
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const profile = PROFILES.find((p) => p.id === activeProfile)!;

  return (
    <div className="relative min-h-[100dvh] w-full text-slate-900 overflow-x-hidden">
      {/* Aurora background */}
      <AuroraBackground />

      <div className="relative z-10 flex min-h-[100dvh]">
        {/* ── Desktop Rail ─────────────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-[88px] lg:w-[260px] flex-shrink-0 px-3 lg:px-4 py-5 gap-3">
          {/* Brand */}
          <Link href="/mobile-test" className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 grid place-items-center shadow-lg shadow-indigo-500/30">
              <Sparkles size={17} className="text-white" />
            </div>
            <div className="hidden lg:block">
              <div className="text-[15px] font-black text-slate-900 leading-none tracking-tight">Quantum</div>
              <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-0.5">Karma · Aurora</div>
            </div>
          </Link>

          {/* Profile card */}
          <button
            onClick={() => setShowProfileSheet(true)}
            className="group relative flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-400 grid place-items-center text-white font-black text-base shadow-md shadow-indigo-500/30">
              {profile.initial}
            </div>
            <div className="hidden lg:block flex-1 text-left min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reading for</div>
              <div className="text-sm font-black text-slate-900 truncate">{profile.name}</div>
            </div>
            <ChevronRight size={14} className="hidden lg:block text-slate-400 group-hover:text-slate-700 transition-colors" />
          </button>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto pr-1 -mr-1 mt-1 space-y-0.5 custom-scroll-light">
            <NavBtn
              icon={<Sparkles size={18} />} label="Home" active={activeFeature === "home"}
              onClick={() => setActiveFeature("home")}
            />
            {FEATURES.map((f) => {
              const Icon = ICON_MAP[f.key] ?? MessageCircle;
              const a = ACCENT[f.accent];
              const isActive = activeFeature === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFeature(f.key)}
                  className={`group w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-semibold transition-all
                    ${isActive ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-100" : "text-slate-700 hover:bg-white/60 hover:text-slate-900"}`}
                  title={f.label}
                >
                  <span
                    className={`w-9 h-9 rounded-xl grid place-items-center flex-shrink-0 transition-colors
                      ${isActive ? `bg-gradient-to-br ${a.soft} ring-1 ${a.ring}` : "bg-white/60 ring-1 ring-slate-200/70"}`}
                  >
                    <Icon size={16} className={isActive ? a.text : "text-slate-600"} />
                  </span>
                  <span className="hidden lg:flex flex-1 items-center justify-between min-w-0">
                    <span className="truncate">{f.label}</span>
                    {f.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${a.chip} tracking-wider`}>
                        {f.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="hidden lg:flex flex-col gap-2">
            <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 p-3.5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Credits</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 tabular-nums">28</span>
                <span className="text-xs font-semibold text-slate-500">/ 50</span>
              </div>
              <button className="mt-3 w-full text-[11px] font-bold py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-sm hover:shadow-md transition-shadow">
                ⚡ Top up
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-white/60 transition-colors">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </aside>

        {/* ── Main column ─────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 flex flex-col px-4 md:px-6 lg:px-8 pt-4 md:pt-6 pb-28 md:pb-8">
          {/* Top bar */}
          <header className="flex items-center justify-between gap-3 mb-5 md:mb-7">
            <div className="md:hidden flex items-center gap-2.5">
              <Link href="/mobile-test" className="w-9 h-9 grid place-items-center rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm">
                <ArrowLeft size={16} className="text-slate-700" />
              </Link>
              <button
                onClick={() => setShowProfileSheet(true)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm"
              >
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 grid place-items-center text-white font-black text-xs">
                  {profile.initial}
                </span>
                <span className="text-xs font-bold text-slate-900 truncate max-w-[7rem]">{profile.name}</span>
                <ChevronRight size={12} className="text-slate-500" />
              </button>
            </div>

            <div className="hidden md:block">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-indigo-600">Welcome back</p>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                {activeFeature === "home" ? `Hey ${profile.name}` : currentLabel(activeFeature)}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(true)}
                className="h-10 w-10 md:w-auto md:px-4 grid place-items-center md:flex md:items-center md:gap-2 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <Search size={16} className="text-slate-700" />
                <span className="hidden md:inline text-sm font-semibold text-slate-700">Search readings</span>
              </button>
              <button className="md:hidden h-10 w-10 grid place-items-center rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm">
                <Bell size={16} className="text-slate-700" />
              </button>
              <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm">
                <Bell size={16} className="text-slate-700" />
              </button>
            </div>
          </header>

          {/* Body */}
          {activeFeature === "home" && <HomeView profile={profile} onOpen={setActiveFeature} />}
          {activeFeature === "chat" && <ChatView />}
          {activeFeature !== "home" && activeFeature !== "chat" && (
            <FeatureStub featureKey={activeFeature} onBack={() => setActiveFeature("home")} />
          )}
        </main>
      </div>

      {/* ── Mobile floating dock ────────────────────────────────────── */}
      <MobileDock active={activeFeature} setActive={setActiveFeature} />

      {/* Profile sheet */}
      {showProfileSheet && (
        <ProfileSheet
          activeId={activeProfile}
          onPick={(id) => { setActiveProfile(id); setShowProfileSheet(false); }}
          onClose={() => setShowProfileSheet(false)}
        />
      )}

      {/* Search sheet */}
      {showSearch && <SearchSheet onClose={() => setShowSearch(false)} />}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* ── Aurora Background ───────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────────────── */
function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg,#FFF7F0 0%,#F5F3FF 25%,#EFF6FF 55%,#ECFEFF 80%,#FEF3C7 100%)",
        }}
      />
      <div
        className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #C7D2FE 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #FBCFE8 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 left-1/3 w-[40rem] h-[40rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #BAE6FD 0%, transparent 70%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,23,42,1) 1px,transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}

/* ── Nav button (desktop rail) ───────────────────────────────────── */
function NavBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-semibold transition-all
        ${active ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-100" : "text-slate-700 hover:bg-white/60"}`}
    >
      <span className={`w-9 h-9 rounded-xl grid place-items-center flex-shrink-0
        ${active ? "bg-gradient-to-br from-indigo-100 to-fuchsia-100 ring-1 ring-indigo-200" : "bg-white/60 ring-1 ring-slate-200/70"}`}>
        {icon}
      </span>
      <span className="hidden lg:inline truncate">{label}</span>
    </button>
  );
}

/* ── Home view ───────────────────────────────────────────────────── */
function HomeView({ profile, onOpen }: { profile: typeof PROFILES[number]; onOpen: (k: string) => void }) {
  const featured = FEATURES.filter((f) => ["explainer", "destiny", "karma-dna", "year-ahead"].includes(f.key));
  const rest = FEATURES.filter((f) => !["explainer", "destiny", "karma-dna", "year-ahead"].includes(f.key));

  return (
    <div className="space-y-5 md:space-y-7">
      {/* Mobile greeting */}
      <div className="md:hidden">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600">Today, {DAILY.date.split(",")[0]}</p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 leading-tight">
          Hey {profile.name} <span className="inline-block">✨</span>
        </h1>
        <p className="text-sm text-slate-700 mt-1">{DAILY.vibe}</p>
      </div>

      {/* Daily briefing card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(99,102,241,0.18)]">
        <div className="absolute inset-0 opacity-50 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top right, rgba(196,181,253,0.5) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(252,211,77,0.35) 0%, transparent 55%)" }} />
        <div className="relative p-5 md:p-7 grid md:grid-cols-[1fr_auto] gap-5 md:gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-700">Today's briefing</span>
              <span className="text-[10px] font-semibold text-slate-500">· {DAILY.date}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tight">
              {DAILY.vibe}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill label="Tithi" value={DAILY.tithi} />
              <Pill label="Nakshatra" value={DAILY.nakshatra} />
              <Pill label="Yoga" value={DAILY.yoga} />
              <Pill label="Moon" value={DAILY.moonSign} />
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <ScoreRing value={DAILY.dayScore} />
          </div>
        </div>
      </div>

      {/* Featured grid */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight">Start here</h3>
          <button className="text-xs font-bold text-indigo-700 hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {featured.map((f) => {
            const a = ACCENT[f.accent];
            const Icon = ICON_MAP[f.key] ?? MessageCircle;
            return (
              <button
                key={f.key}
                onClick={() => onOpen(f.key)}
                className="group relative text-left rounded-2xl md:rounded-3xl border border-white/80 bg-white/70 backdrop-blur-xl p-4 md:p-5 shadow-[0_4px_20px_-6px_rgba(15,23,42,0.08)] hover:shadow-[0_12px_40px_-12px_rgba(99,102,241,0.25)] hover:-translate-y-0.5 transition-all"
              >
                <div className={`absolute inset-x-0 top-0 h-24 rounded-t-2xl md:rounded-t-3xl bg-gradient-to-br ${a.soft} opacity-90`} />
                <div className="relative">
                  <span className={`inline-flex w-11 h-11 rounded-2xl bg-white grid place-items-center ring-1 ${a.ring} shadow-sm mb-3`}>
                    <Icon size={18} className={a.text} />
                  </span>
                  {f.badge && (
                    <span className={`absolute right-0 top-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${a.chip} tracking-wider`}>
                      {f.badge}
                    </span>
                  )}
                  <div className="text-sm md:text-base font-black text-slate-900 tracking-tight">{f.label}</div>
                  <p className="text-[11px] md:text-xs text-slate-600 mt-1 leading-snug line-clamp-2">{f.hint}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* All features list */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight">All readings</h3>
          <span className="text-[11px] font-bold text-slate-500">{rest.length} more</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
          {rest.map((f) => {
            const a = ACCENT[f.accent];
            const Icon = ICON_MAP[f.key] ?? MessageCircle;
            return (
              <button
                key={f.key}
                onClick={() => onOpen(f.key)}
                className="group flex items-center gap-3 p-3 md:p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 hover:bg-white hover:shadow-md transition-all text-left"
              >
                <span className={`w-11 h-11 rounded-2xl grid place-items-center bg-gradient-to-br ${a.soft} ring-1 ${a.ring} flex-shrink-0`}>
                  <Icon size={17} className={a.text} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <div className="text-sm font-black text-slate-900 truncate">{f.label}</div>
                    {f.badge && (
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${a.chip} tracking-wider`}>
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">{f.hint}</p>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer notice */}
      <p className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
        AI-generated astrological insights · Not medical advice
      </p>
    </div>
  );
}

/* ── Score ring ─────────────────────────────────────────────────── */
function ScoreRing({ value }: { value: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative w-[110px] h-[110px] md:w-[120px] md:h-[120px]">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="9" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="url(#aurora-grad)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
        />
        <defs>
          <linearGradient id="aurora-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-2xl md:text-3xl font-black text-slate-900 tabular-nums leading-none">{value}</div>
          <div className="text-[9px] font-black uppercase tracking-wider text-slate-500 mt-1">Day score</div>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 ring-1 ring-slate-200 text-[11px] font-bold text-slate-700">
      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-slate-900">{value}</span>
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
    <div className="flex flex-col h-[calc(100dvh-200px)] md:h-[calc(100dvh-180px)] rounded-3xl border border-white/80 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(99,102,241,0.15)] overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="text-sm font-black text-slate-900">Quantum Oracle</span>
        </div>
        <button className="text-[11px] font-bold text-slate-500 hover:text-rose-600">Clear</button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "items-start gap-3"}`}>
            {m.role === "assistant" && (
              <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-100 to-fuchsia-100 ring-1 ring-indigo-200 grid place-items-center flex-shrink-0">
                <Sparkles size={15} className="text-indigo-700" />
              </span>
            )}
            <div className={m.role === "user"
              ? "max-w-[88%] md:max-w-[70%] rounded-2xl rounded-tr-md px-4 py-3 bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-md"
              : "max-w-[88%] md:max-w-[80%] rounded-2xl rounded-tl-md px-4 py-3 bg-white border border-slate-100 text-slate-800 shadow-sm"
            }>
              <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Suggestion chips */}
      <div className="px-4 pt-3 flex gap-2 overflow-x-auto no-scrollbar pb-2 border-t border-slate-100/70">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => send(c)}
            className="flex-shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all whitespace-nowrap"
          >
            {c}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="p-3 md:p-4 flex items-end gap-2 border-t border-slate-100/70 bg-white/60"
      >
        <div className="flex-1 flex items-end rounded-2xl bg-white border border-slate-200 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all overflow-hidden">
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
          className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white grid place-items-center shadow-md disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

/* ── Generic feature stub ───────────────────────────────────────── */
function FeatureStub({ featureKey, onBack }: { featureKey: string; onBack: () => void }) {
  const f = FEATURES.find((x) => x.key === featureKey);
  if (!f) return null;
  const a = ACCENT[f.accent];
  const Icon = ICON_MAP[f.key] ?? MessageCircle;
  return (
    <div className="rounded-3xl border border-white/80 bg-white/70 backdrop-blur-xl p-6 md:p-10 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.10)]">
      <button onClick={onBack} className="md:hidden inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-5">
        <ArrowLeft size={14} /> Back
      </button>
      <div className="flex items-start gap-4">
        <span className={`w-14 h-14 rounded-2xl grid place-items-center bg-gradient-to-br ${a.soft} ring-1 ${a.ring} flex-shrink-0`}>
          <Icon size={22} className={a.text} />
        </span>
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Reading</div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">{f.label}</h2>
          <p className="text-sm md:text-base text-slate-700 mt-2 max-w-xl leading-relaxed">{f.hint}</p>
        </div>
      </div>

      <div className="mt-7 grid sm:grid-cols-3 gap-3">
        {["Charts scanned · 16", "Dasha layers · 3", "Cosmic context · live"].map((t) => (
          <div key={t} className="rounded-2xl bg-white border border-slate-100 px-4 py-3 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Engine</div>
            <div className="text-sm font-black text-slate-900 mt-0.5">{t}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50 border border-indigo-100 p-5">
        <p className="text-sm md:text-base text-slate-800 leading-relaxed">
          <span className="font-black text-slate-900">Preview placeholder.</span> In production
          this panel mounts the real <code className="px-1.5 py-0.5 rounded bg-white text-indigo-700 text-xs font-bold">{f.key}</code> component
          from <code className="px-1.5 py-0.5 rounded bg-white text-indigo-700 text-xs font-bold">/dashboard/components</code>. The
          surrounding layout, contrast and motion are what you're evaluating here.
        </p>
      </div>

      <button className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white text-sm font-black shadow-md hover:shadow-lg transition-shadow">
        Generate now <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ── Mobile dock ────────────────────────────────────────────────── */
function MobileDock({ active, setActive }: { active: string; setActive: (k: string) => void }) {
  const items: { key: string; icon: React.ReactNode; label: string }[] = [
    { key: "home",      icon: <Sparkles size={18} />,    label: "Home"  },
    { key: "chat",      icon: <MessageCircle size={18} />, label: "Oracle" },
    { key: "destiny",   icon: <Calendar size={18} />,    label: "Destiny" },
    { key: "karma-dna", icon: <Compass size={18} />,     label: "DNA" },
    { key: "more",      icon: <Settings size={18} />,    label: "More" },
  ];
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(env(safe-area-inset-bottom),12px)]">
      <div className="mx-auto max-w-md rounded-[28px] bg-white/85 backdrop-blur-xl border border-white shadow-[0_18px_50px_-12px_rgba(79,70,229,0.30)]">
        <div className="grid grid-cols-5 px-2 py-1.5">
          {items.map((it) => {
            const isActive = active === it.key || (it.key === "more" && !["home", "chat", "destiny", "karma-dna"].includes(active));
            return (
              <button
                key={it.key}
                onClick={() => setActive(it.key === "more" ? "remedy" : it.key)}
                className="relative flex flex-col items-center justify-center gap-0.5 py-2 rounded-2xl active:scale-95 transition-transform"
              >
                <span
                  className={`grid place-items-center w-10 h-10 rounded-2xl transition-all
                    ${isActive ? "bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-md shadow-indigo-500/30" : "text-slate-600"}`}
                >
                  {it.icon}
                </span>
                <span className={`text-[10px] font-black tracking-wide ${isActive ? "text-indigo-700" : "text-slate-500"}`}>
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
        className="w-full md:max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-slate-900">Reading for</h3>
          <button onClick={onClose} className="text-xs font-bold text-slate-500">Close</button>
        </div>
        <div className="space-y-1.5">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all
                ${activeId === p.id ? "border-indigo-300 bg-indigo-50/70" : "border-slate-100 hover:bg-slate-50"}`}
            >
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-400 grid place-items-center text-white font-black">
                {p.initial}
              </span>
              <div className="flex-1 text-left">
                <div className="text-sm font-black text-slate-900">{p.name}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{p.relationship}</div>
              </div>
              {activeId === p.id && <span className="text-[10px] font-black text-indigo-700">ACTIVE</span>}
            </button>
          ))}
          <button className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all">
            <span className="w-10 h-10 rounded-xl bg-slate-100 grid place-items-center text-slate-500">
              <Plus size={16} />
            </span>
            <span className="text-sm font-black text-slate-700">Add a bond</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Search sheet ───────────────────────────────────────────────── */
function SearchSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center pt-16 md:pt-0 p-3 bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full md:max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
          <Search size={16} className="text-slate-500" />
          <input autoFocus placeholder="Search readings, dates, places…" className="flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {FEATURES.slice(0, 6).map((f) => {
            const Icon = ICON_MAP[f.key] ?? MessageCircle;
            const a = ACCENT[f.accent];
            return (
              <button key={f.key} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left">
                <span className={`w-9 h-9 rounded-xl grid place-items-center bg-gradient-to-br ${a.soft} ring-1 ${a.ring}`}>
                  <Icon size={14} className={a.text} />
                </span>
                <span className="text-sm font-black text-slate-900 truncate">{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function currentLabel(key: string) {
  return FEATURES.find((f) => f.key === key)?.label ?? "Dashboard";
}

/* ── Inline scrollbar style ─────────────────────────────────────── */
function GlobalStyles() {
  return null;
}
