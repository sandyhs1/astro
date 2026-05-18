"use client";

/* ═══════════════════════════════════════════════════════════════════════════
 * V4 — OPERATOR GRADE
 * Mercury · Stripe · Linear aesthetic.
 * Charcoal sidebar, white canvas, single electric-lime accent, tabular nums,
 * monospace labels, sharp 1px borders. Looks like a tool a professional uses
 * 8 hours a day. Light theme · WCAG AA · mobile-first.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles, Search, Send, ChevronRight, ChevronDown, LogOut, MessageCircle,
  BookOpen, Compass, Map, Flame, Sun, Heart, Mic, Calendar, Crown, Gem,
  FileText, ListChecks, ArrowLeft, Menu, X, Command, Bell, Plus,
  TrendingUp, Activity, ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { FEATURES, PROFILES, DAILY, CHIPS, SAMPLE_MESSAGES, type Feature } from "../data";

const ICON_MAP: Record<string, LucideIcon> = {
  explainer: BookOpen, chat: MessageCircle, destiny: Calendar, "karma-dna": Sparkles,
  "karmic-patterns": Compass, "royal-roast": Flame, gotra: Sun, "ishta-devata": Heart,
  journal: Mic, "year-ahead": Calendar, "soul-code": Crown, roadmap: Map,
  remedy: Gem, reports: FileText, details: ListChecks,
};

/* Section grouping for the sidebar — mirrors how operators actually think. */
const SECTIONS: { title: string; keys: string[] }[] = [
  { title: "Today",     keys: ["explainer", "chat", "destiny"] },
  { title: "Blueprint", keys: ["karma-dna", "karmic-patterns", "soul-code", "details"] },
  { title: "Forecasts", keys: ["year-ahead", "roadmap", "royal-roast"] },
  { title: "Practice",  keys: ["remedy", "gotra", "ishta-devata", "journal"] },
  { title: "Archive",   keys: ["reports"] },
];

export default function V4Page() {
  const [activeProfile, setActiveProfile] = useState(PROFILES[0].id);
  const [activeFeature, setActiveFeature] = useState<string>("home");
  const [drawer, setDrawer] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profile = PROFILES.find((p) => p.id === activeProfile)!;

  return (
    <div
      className="min-h-[100dvh] w-full text-slate-900 flex"
      style={{ fontFeatureSettings: '"ss01","ss02","cv11"', background: "#FAFAF9" }}
    >
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <Sidebar
        activeFeature={activeFeature}
        setActiveFeature={(k) => { setActiveFeature(k); setDrawer(false); }}
        profile={profile}
        activeProfileId={activeProfile}
        onSwitchProfile={setActiveProfile}
        profileMenuOpen={profileMenuOpen}
        setProfileMenuOpen={setProfileMenuOpen}
        className="hidden md:flex"
      />

      {/* ── Mobile drawer ───────────────────────────────────────────── */}
      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setDrawer(false)}>
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <Sidebar
            activeFeature={activeFeature}
            setActiveFeature={(k) => { setActiveFeature(k); setDrawer(false); }}
            profile={profile}
            activeProfileId={activeProfile}
            onSwitchProfile={setActiveProfile}
            profileMenuOpen={profileMenuOpen}
            setProfileMenuOpen={setProfileMenuOpen}
            className="relative z-10 flex h-full w-[280px]"
            onClose={() => setDrawer(false)}
          />
        </div>
      )}

      {/* ── Main column ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="flex items-center gap-3 px-4 md:px-6 h-14">
            <button
              onClick={() => setDrawer(true)}
              className="md:hidden h-9 w-9 grid place-items-center rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              <Menu size={18} className="text-slate-700" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-[12px] font-medium text-slate-500 tracking-tight">
              <span>Quantum Karma</span>
              <ChevronRight size={12} className="text-slate-300" />
              <span>{profile.name}</span>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-slate-900 font-semibold">{currentLabel(activeFeature)}</span>
            </div>

            <div className="flex-1 md:hidden text-[13px] font-bold text-slate-900 truncate">
              {currentLabel(activeFeature)}
            </div>

            {/* Search */}
            <button className="hidden md:flex items-center gap-2 h-8 px-3 rounded-md border border-slate-200 bg-white hover:border-slate-300 transition-colors group ml-auto">
              <Search size={13} className="text-slate-500" />
              <span className="text-[12.5px] text-slate-500 pr-12 font-medium">Find a reading</span>
              <kbd className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                ⌘K
              </kbd>
            </button>

            {/* Right cluster */}
            <div className="flex items-center gap-1 ml-auto md:ml-2">
              {/* Credits chip */}
              <div className="hidden sm:flex items-center gap-2 h-8 px-2.5 rounded-md border border-slate-200 bg-white">
                <span className="font-mono text-[10px] font-bold text-slate-500 tracking-wider uppercase">CR</span>
                <span className="font-mono text-[13px] font-bold text-slate-900 tabular-nums">28</span>
                <span className="text-slate-300">/</span>
                <span className="font-mono text-[12px] text-slate-500 tabular-nums">50</span>
              </div>
              <button className="h-8 px-2.5 hidden md:inline-flex items-center gap-1 rounded-md text-[12px] font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                <Plus size={12} /> Top up
              </button>
              <button className="h-9 w-9 grid place-items-center rounded-md hover:bg-slate-100 transition-colors relative">
                <Bell size={16} className="text-slate-600" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 px-4 md:px-7 py-6 md:py-8 max-w-[1400px] w-full mx-auto pb-24 md:pb-10">
          {activeFeature === "home" && <HomeView profile={profile} onOpen={setActiveFeature} />}
          {activeFeature === "chat" && <ChatView profile={profile} />}
          {activeFeature !== "home" && activeFeature !== "chat" && (
            <FeatureView featureKey={activeFeature} onBack={() => setActiveFeature("home")} />
          )}
        </main>
      </div>

      {/* ── Mobile bottom bar ───────────────────────────────────────── */}
      <MobileTabBar active={activeFeature} setActive={setActiveFeature} onMenu={() => setDrawer(true)} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* ── Sidebar (charcoal, dense) ───────────────────────────────────── */
/* ────────────────────────────────────────────────────────────────── */
function Sidebar({
  activeFeature, setActiveFeature, profile, activeProfileId, onSwitchProfile,
  profileMenuOpen, setProfileMenuOpen, className = "", onClose,
}: {
  activeFeature: string;
  setActiveFeature: (k: string) => void;
  profile: typeof PROFILES[number];
  activeProfileId: string;
  onSwitchProfile: (id: string) => void;
  profileMenuOpen: boolean;
  setProfileMenuOpen: (b: boolean) => void;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <aside
      className={`flex-shrink-0 w-[260px] flex-col text-slate-200 ${className}`}
      style={{ background: "#0A0A0A" }}
    >
      {/* Brand */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
        <Link href="/mobile-test" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-7 h-7 rounded-md grid place-items-center" style={{ background: "#84CC16" }}>
            <Sparkles size={14} className="text-slate-900" strokeWidth={2.5} />
          </div>
          <span className="text-[13.5px] font-bold text-white tracking-tight">Quantum<span className="text-slate-500">.</span></span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden h-8 w-8 grid place-items-center rounded-md hover:bg-white/5">
            <X size={16} className="text-slate-300" />
          </button>
        )}
      </div>

      {/* Profile switcher */}
      <div className="px-3 pt-3 pb-2 border-b border-white/10 relative">
        <button
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
        >
          <span className="w-8 h-8 rounded-md bg-gradient-to-br from-lime-400 to-emerald-500 grid place-items-center text-slate-900 font-bold text-[13px]">
            {profile.initial}
          </span>
          <div className="flex-1 text-left min-w-0">
            <div className="text-[13px] font-semibold text-white truncate">{profile.name}</div>
            <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{profile.relationship}</div>
          </div>
          <ChevronDown size={13} className={`text-slate-400 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
        </button>

        {profileMenuOpen && (
          <div className="absolute top-full left-3 right-3 mt-1 rounded-lg bg-slate-900 border border-white/10 shadow-xl py-1 z-30">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSwitchProfile(p.id); setProfileMenuOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left transition-colors text-[13px]
                  ${activeProfileId === p.id ? "bg-white/5 text-white" : "text-slate-300 hover:bg-white/5"}`}
              >
                <span className="w-7 h-7 rounded-md bg-gradient-to-br from-lime-400 to-emerald-500 grid place-items-center text-slate-900 font-bold text-[12px]">
                  {p.initial}
                </span>
                <span className="font-semibold flex-1 truncate">{p.name}</span>
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">{p.relationship}</span>
              </button>
            ))}
            <div className="border-t border-white/10 my-1" />
            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left text-[13px] text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
              <span className="w-7 h-7 rounded-md bg-white/10 grid place-items-center text-slate-300">
                <Plus size={13} />
              </span>
              <span className="font-semibold">Add a bond</span>
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 pt-3 pb-3 custom-scroll-dark">
        <NavBtn
          icon={<Activity size={14} />} label="Home" mono="01"
          active={activeFeature === "home"} onClick={() => setActiveFeature("home")}
        />

        {SECTIONS.map((sec) => (
          <div key={sec.title} className="mt-5">
            <div className="px-2 mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-[0.16em]">
                {sec.title}
              </span>
              <span className="font-mono text-[10px] text-slate-600 tabular-nums">{sec.keys.length}</span>
            </div>
            <div className="space-y-px">
              {sec.keys.map((k, i) => {
                const f = FEATURES.find((x) => x.key === k);
                if (!f) return null;
                const Icon = ICON_MAP[f.key] ?? MessageCircle;
                return (
                  <NavBtn
                    key={f.key}
                    icon={<Icon size={14} />}
                    label={f.label}
                    badge={f.badge}
                    mono={String(i + 1).padStart(2, "0")}
                    active={activeFeature === f.key}
                    onClick={() => setActiveFeature(f.key)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-3 pt-2 border-t border-white/10 space-y-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credits</span>
            <span className="font-mono text-[12px] text-white tabular-nums font-bold">28 / 50</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "56%", background: "#84CC16" }} />
          </div>
          <div className="font-mono text-[10px] text-slate-500 mt-2">Renews May 31</div>
        </div>
        <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-[12.5px] font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </aside>
  );
}

function NavBtn({ icon, label, active, onClick, badge, mono }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: string; mono?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-all
        ${active ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
    >
      {mono && (
        <span className={`font-mono text-[10px] tabular-nums tracking-tight w-5
          ${active ? "text-lime-400" : "text-slate-600 group-hover:text-slate-400"}`}>
          {mono}
        </span>
      )}
      <span className={active ? "text-lime-400" : "text-slate-500 group-hover:text-slate-300"}>
        {icon}
      </span>
      <span className="flex-1 text-left truncate font-semibold">{label}</span>
      {badge && (
        <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider
          ${active ? "bg-lime-400 text-slate-900" : "bg-white/10 text-slate-300"}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* ── Home view ───────────────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────────────── */
function HomeView({ profile, onOpen }: { profile: typeof PROFILES[number]; onOpen: (k: string) => void }) {
  return (
    <div className="space-y-7">
      {/* Greeting + KPI strip */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {DAILY.date}
          </p>
          <h1 className="text-[28px] md:text-[36px] font-bold tracking-tight text-slate-900 leading-[1.1] mt-1.5">
            Hey {profile.name}.
          </h1>
          <p className="text-[15px] text-slate-600 mt-1">{DAILY.vibe}</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
          <Kpi label="Day score"   value={`${DAILY.dayScore}`} suffix="/100" delta="+12"  trend="up" />
          <Kpi label="Credits"     value="28"  suffix=" / 50" delta="−5"   trend="down" />
          <Kpi label="Active dasha" value="Mer-Ven" mono delta="04y 02m" trend="flat" />
          <Kpi label="Profiles"    value="3"   suffix="" delta="2 family" trend="flat" />
        </div>
      </div>

      {/* Briefing + Panchang split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
        {/* Briefing card */}
        <Card className="lg:col-span-7 p-5 md:p-6">
          <CardHeader title="Today's briefing" eyebrow="Computed" trail={<button className="font-mono text-[11px] font-bold text-slate-500 hover:text-slate-900">Refresh</button>} />
          <h3 className="text-[20px] md:text-[24px] font-bold tracking-tight text-slate-900 mt-3 leading-snug">
            {DAILY.vibe}.
          </h3>
          <p className="text-[14px] text-slate-700 mt-2 leading-relaxed max-w-xl">
            Mercury moves into your 10th house at <span className="font-semibold text-slate-900">11:08 IST</span>.
            Stalled negotiations open. Use the window before
            <span className="font-mono mx-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 text-[12px]">13:42</span>
            for high-stakes communication.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => onOpen("chat")}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-slate-900 text-white text-[12.5px] font-semibold hover:bg-slate-800 transition-colors"
            >
              <MessageCircle size={13} /> Ask Oracle
            </button>
            <button
              onClick={() => onOpen("destiny")}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md border border-slate-200 bg-white text-slate-900 text-[12.5px] font-semibold hover:border-slate-300 transition-colors"
            >
              Destiny window <ArrowUpRight size={13} />
            </button>
          </div>
        </Card>

        {/* Panchang */}
        <Card className="lg:col-span-5">
          <div className="px-5 md:px-6 pt-5 md:pt-6 pb-4">
            <CardHeader title="Panchang" eyebrow="Live" trail={<DotLive />} />
          </div>
          <table className="w-full">
            <tbody>
              {[
                ["Tithi",     DAILY.tithi],
                ["Nakshatra", DAILY.nakshatra],
                ["Yoga",      DAILY.yoga],
                ["Moon sign", DAILY.moonSign],
                ["Sun sign",  DAILY.sunSign],
              ].map(([k, v], i, arr) => (
                <tr key={k} className={i < arr.length - 1 ? "border-b border-slate-100" : ""}>
                  <td className="px-5 md:px-6 py-2.5 font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">{k}</td>
                  <td className="px-5 md:px-6 py-2.5 text-[14px] font-semibold text-slate-900 text-right">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Reading sections */}
      {SECTIONS.map((sec) => {
        const items = sec.keys.map((k) => FEATURES.find((f) => f.key === k)).filter(Boolean) as Feature[];
        if (items.length === 0) return null;
        return (
          <section key={sec.title}>
            <div className="flex items-end justify-between mb-3">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {sec.title}
                </span>
                <h3 className="text-[18px] md:text-[20px] font-bold tracking-tight text-slate-900 mt-0.5">
                  {sectionTitle(sec.title)}
                </h3>
              </div>
              <span className="font-mono text-[11px] tabular-nums text-slate-500">
                {String(items.length).padStart(2, "0")} {items.length === 1 ? "reading" : "readings"}
              </span>
            </div>
            <Card className="overflow-hidden">
              <ul className="divide-y divide-slate-100">
                {items.map((f, i) => {
                  const Icon = ICON_MAP[f.key] ?? MessageCircle;
                  return (
                    <li key={f.key}>
                      <button
                        onClick={() => onOpen(f.key)}
                        className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-3.5 hover:bg-slate-50 transition-colors text-left group"
                      >
                        <span className="hidden md:block font-mono text-[11px] tabular-nums text-slate-400 w-8 group-hover:text-slate-700 transition-colors">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="w-9 h-9 rounded-md bg-slate-100 grid place-items-center group-hover:bg-slate-900 transition-colors flex-shrink-0">
                          <Icon size={15} className="text-slate-700 group-hover:text-lime-400 transition-colors" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold text-slate-900 truncate">{f.label}</span>
                            {f.badge && (
                              <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider bg-slate-900 text-lime-400">
                                {f.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[12.5px] text-slate-600 truncate mt-0.5">{f.hint}</p>
                        </div>
                        <span className="font-mono text-[11px] tabular-nums text-slate-400 hidden md:inline">~5cr</span>
                        <ChevronRight size={15} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </section>
        );
      })}

      <p className="font-mono text-center text-[10px] uppercase tracking-[0.2em] text-slate-500">
        AI-generated astrological insights · Not medical advice
      </p>
    </div>
  );
}

function sectionTitle(t: string) {
  switch (t) {
    case "Today":     return "Read first";
    case "Blueprint": return "Your karmic blueprint";
    case "Forecasts": return "What's coming";
    case "Practice":  return "Daily practice";
    case "Archive":   return "Saved reports";
    default: return t;
  }
}

function Kpi({ label, value, suffix, delta, trend, mono }: {
  label: string; value: string; suffix?: string; delta: string; trend: "up" | "down" | "flat"; mono?: boolean;
}) {
  const trendColor = trend === "up" ? "text-emerald-700 bg-emerald-50" : trend === "down" ? "text-rose-700 bg-rose-50" : "text-slate-700 bg-slate-100";
  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "·";
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums ${trendColor}`}>
          {arrow} {delta}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={`text-[24px] font-bold text-slate-900 leading-none tabular-nums tracking-tight ${mono ? "font-mono text-[20px]" : ""}`}>
          {value}
        </span>
        {suffix && <span className="text-[12px] font-medium text-slate-500 tabular-nums">{suffix}</span>}
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, eyebrow, trail }: { title: string; eyebrow?: string; trail?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        {eyebrow && (
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {eyebrow}
          </span>
        )}
        <h3 className="text-[15px] font-bold text-slate-900 tracking-tight mt-0.5">{title}</h3>
      </div>
      {trail}
    </div>
  );
}

function DotLive() {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      Live
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* ── Chat view ───────────────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────────────── */
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
    <Card className="overflow-hidden flex flex-col h-[calc(100dvh-180px)] md:h-[calc(100dvh-160px)]">
      <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2.5">
          <DotLive />
          <span className="text-slate-300">|</span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Oracle / {profile.name.toLowerCase()}
          </span>
        </div>
        <button className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-rose-600 transition-colors">
          Clear chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-7 py-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
            {m.role === "assistant" ? (
              <div className="flex gap-3 max-w-[88%] md:max-w-[78%]">
                <span className="w-8 h-8 rounded-md bg-slate-900 grid place-items-center flex-shrink-0">
                  <Sparkles size={13} className="text-lime-400" strokeWidth={2.5} />
                </span>
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Oracle
                  </div>
                  <p className="text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap font-medium">{m.text}</p>
                </div>
              </div>
            ) : (
              <div className="max-w-[88%] md:max-w-[68%] rounded-2xl rounded-tr-sm px-4 py-3 bg-slate-900 text-white">
                <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">{m.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Suggestion chips */}
      <div className="px-4 pt-2.5 flex gap-1.5 overflow-x-auto no-scrollbar pb-2 border-t border-slate-200">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => send(c)}
            className="flex-shrink-0 text-[12px] font-medium px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            {c}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="px-3 py-3 flex items-end gap-2 border-t border-slate-200 bg-white">
        <div className="flex-1 flex items-end rounded-md bg-white border border-slate-300 focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-100 transition-all overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Oracle…  (⌘+Return to send)"
            rows={1}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 px-3 py-2.5 focus:outline-none text-[14.5px] font-medium resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim()}
          className="h-10 px-4 rounded-md bg-slate-900 text-white text-[12.5px] font-bold inline-flex items-center gap-1.5 hover:bg-slate-800 disabled:opacity-40 transition-colors"
        >
          <Send size={13} /> Send
        </button>
      </form>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* ── Feature view ────────────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────────────── */
function FeatureView({ featureKey, onBack }: { featureKey: string; onBack: () => void }) {
  const f = FEATURES.find((x) => x.key === featureKey);
  if (!f) return null;
  const Icon = ICON_MAP[f.key] ?? MessageCircle;
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="md:hidden inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-600">
        <ArrowLeft size={13} /> Home
      </button>

      <Card className="overflow-hidden">
        <div className="px-5 md:px-7 py-5 md:py-6 flex items-start gap-4">
          <span className="w-11 h-11 rounded-md bg-slate-900 grid place-items-center flex-shrink-0">
            <Icon size={18} className="text-lime-400" strokeWidth={2.5} />
          </span>
          <div className="flex-1 min-w-0">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Reading · {f.key}
            </span>
            <h2 className="text-[24px] md:text-[28px] font-bold tracking-tight text-slate-900 leading-tight mt-1">
              {f.label}
            </h2>
            <p className="text-[14px] text-slate-700 mt-1.5 max-w-2xl">{f.hint}</p>
          </div>
          <button className="hidden md:inline-flex h-9 px-3.5 items-center gap-1.5 rounded-md bg-slate-900 text-white text-[12.5px] font-bold hover:bg-slate-800 transition-colors flex-shrink-0">
            Generate <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200">
          {[
            ["Charts",   "16",   "scanned"],
            ["Dashas",   "3",    "active"],
            ["Transits", "Live", ""],
          ].map(([k, v, sub]) => (
            <div key={k} className="px-4 md:px-6 py-3.5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{k}</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-slate-900 tabular-nums leading-none tracking-tight">{v}</span>
                {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 md:px-7 py-5 md:py-7 border-t border-slate-200">
          <p className="text-[14.5px] text-slate-800 leading-relaxed">
            <strong className="text-slate-900">Preview placeholder.</strong> In production this panel
            mounts the real <code className="font-mono px-1.5 py-0.5 bg-slate-100 rounded text-[12.5px] text-slate-900">{f.key}</code> component
            from <code className="font-mono px-1.5 py-0.5 bg-slate-100 rounded text-[12.5px] text-slate-900">/dashboard/components</code>.
          </p>
          <p className="text-[14px] text-slate-600 mt-3 leading-relaxed">
            Operator Grade prioritises information density, monospaced numerics, and
            keyboard-first interactions. Built for users who'll spend serious time in this dashboard.
          </p>
        </div>

        <div className="px-5 md:px-7 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="font-mono text-[11px] text-slate-500">
            Cost <span className="text-slate-900 font-bold">5 credits</span> · Balance <span className="text-slate-900 font-bold tabular-nums">28</span>
          </span>
          <button className="md:hidden h-9 px-3.5 inline-flex items-center gap-1.5 rounded-md bg-slate-900 text-white text-[12.5px] font-bold">
            Generate <ArrowUpRight size={13} />
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* ── Mobile bottom bar ───────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────────────── */
function MobileTabBar({ active, setActive, onMenu }: { active: string; setActive: (k: string) => void; onMenu: () => void }) {
  const items: { key: string; icon: React.ReactNode; label: string; onClick?: () => void }[] = [
    { key: "home",      icon: <Activity size={17} />,    label: "Home" },
    { key: "chat",      icon: <MessageCircle size={17} />, label: "Oracle" },
    { key: "destiny",   icon: <Calendar size={17} />,    label: "Destiny" },
    { key: "karma-dna", icon: <Compass size={17} />,     label: "DNA" },
    { key: "menu",      icon: <Menu size={17} />,        label: "Menu", onClick: onMenu },
  ];
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => (it.onClick ? it.onClick() : setActive(it.key))}
              className="relative flex flex-col items-center justify-center py-2.5 active:bg-slate-100 transition-colors"
            >
              {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[2px]" style={{ background: "#84CC16" }} />}
              <span className={isActive ? "text-slate-900" : "text-slate-500"}>{it.icon}</span>
              <span className={`font-mono text-[10px] mt-1 font-bold uppercase tracking-wider ${isActive ? "text-slate-900" : "text-slate-500"}`}>
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function currentLabel(key: string) {
  if (key === "home") return "Home";
  return FEATURES.find((f) => f.key === key)?.label ?? "Dashboard";
}
