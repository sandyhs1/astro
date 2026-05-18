"use client";

/* ────────────────────────────────────────────────────────────────────────────
 * V2 — EDITORIAL CALM
 * Pure white surfaces · dense bento grid · single indigo accent
 * Fixed sidebar on desktop · slide-in drawer on mobile · power-user clean
 * Light theme · WCAG AA contrast · mobile-first
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles, Search, Send, Plus, ChevronRight, Bell, LogOut, MessageCircle,
  BookOpen, Compass, Map, Flame, Sun, Heart, Mic, Calendar, Crown, Gem,
  FileText, ListChecks, ArrowLeft, Menu, X, Command, ArrowUpRight,
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

export default function V2Page() {
  const [activeProfile, setActiveProfile] = useState(PROFILES[0].id);
  const [activeFeature, setActiveFeature] = useState<string>("home");
  const [drawer, setDrawer] = useState(false);
  const profile = PROFILES.find((p) => p.id === activeProfile)!;

  return (
    <div className="min-h-[100dvh] w-full bg-white text-slate-900 flex">
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <Sidebar
        activeFeature={activeFeature}
        setActiveFeature={(k) => { setActiveFeature(k); setDrawer(false); }}
        profile={profile}
        onSwitchProfile={setActiveProfile}
        activeProfileId={activeProfile}
        className="hidden md:flex"
      />

      {/* ── Mobile drawer ───────────────────────────────────────────── */}
      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setDrawer(false)}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <Sidebar
            activeFeature={activeFeature}
            setActiveFeature={(k) => { setActiveFeature(k); setDrawer(false); }}
            profile={profile}
            onSwitchProfile={setActiveProfile}
            activeProfileId={activeProfile}
            className="relative z-10 flex h-full w-[280px] shadow-2xl"
            onClose={() => setDrawer(false)}
          />
        </div>
      )}

      {/* ── Main column ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center gap-3 px-4 md:px-7 h-14 md:h-16">
            <button
              onClick={() => setDrawer(true)}
              className="md:hidden h-9 w-9 grid place-items-center rounded-lg hover:bg-slate-100"
              aria-label="Menu"
            >
              <Menu size={18} className="text-slate-700" />
            </button>

            <div className="flex-1 min-w-0 flex items-center gap-3">
              <p className="hidden md:block text-[12px] font-semibold text-slate-500 truncate">
                <span className="text-slate-400">Dashboard</span>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-900">{currentLabel(activeFeature)}</span>
              </p>
              <button className="md:hidden flex items-center gap-1.5 text-sm font-bold text-slate-900">
                <span className="w-7 h-7 rounded-md bg-indigo-600 grid place-items-center text-white font-black text-xs">
                  {profile.initial}
                </span>
                <span className="truncate max-w-[10rem]">{profile.name}</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
            </div>

            <button className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
              <Search size={14} className="text-slate-500" />
              <span className="text-sm text-slate-500 font-medium pr-12">Search readings…</span>
              <kbd className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                <Command size={10} /> K
              </kbd>
            </button>

            <div className="flex items-center gap-1.5">
              <button className="h-9 w-9 grid place-items-center rounded-lg hover:bg-slate-100">
                <Bell size={16} className="text-slate-600" />
              </button>
              <div className="hidden sm:flex items-center gap-2 pl-3 ml-1.5 border-l border-slate-200">
                <div className="text-right hidden md:block leading-tight">
                  <div className="text-[12px] font-bold text-slate-900">{profile.name}</div>
                  <div className="text-[10px] font-semibold text-slate-500">28 / 50 credits</div>
                </div>
                <span className="w-9 h-9 rounded-full bg-indigo-600 grid place-items-center text-white font-black">
                  {profile.initial}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 px-4 md:px-7 py-5 md:py-8 max-w-[1400px] w-full mx-auto pb-24 md:pb-10">
          {activeFeature === "home" && <HomeView profile={profile} onOpen={setActiveFeature} />}
          {activeFeature === "chat" && <ChatView />}
          {activeFeature !== "home" && activeFeature !== "chat" && (
            <FeatureStub featureKey={activeFeature} onBack={() => setActiveFeature("home")} />
          )}
        </main>
      </div>

      {/* ── Mobile bottom tab bar ───────────────────────────────────── */}
      <MobileTabBar
        active={activeFeature}
        setActive={setActiveFeature}
        onOpenDrawer={() => setDrawer(true)}
      />
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────── */
function Sidebar({
  activeFeature, setActiveFeature, profile, onSwitchProfile, activeProfileId, className = "", onClose,
}: {
  activeFeature: string;
  setActiveFeature: (k: string) => void;
  profile: typeof PROFILES[number];
  onSwitchProfile: (id: string) => void;
  activeProfileId: string;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <aside className={`flex-shrink-0 w-[260px] flex-col bg-white border-r border-slate-200 ${className}`}>
      {/* Brand */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-slate-100">
        <Link href="/mobile-test" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-slate-900 grid place-items-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <div className="text-[14px] font-black text-slate-900 leading-none tracking-tight">Quantum Karma</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Editorial</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden h-8 w-8 grid place-items-center rounded-md hover:bg-slate-100">
            <X size={16} className="text-slate-600" />
          </button>
        )}
      </div>

      {/* Profile switcher */}
      <div className="px-3 pt-3">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.18em] px-2 mb-2">Reading for</div>
        <div className="space-y-0.5">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => onSwitchProfile(p.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors
                ${activeProfileId === p.id ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}
            >
              <span className={`w-6 h-6 rounded-md grid place-items-center font-black text-[11px]
                ${activeProfileId === p.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                {p.initial}
              </span>
              <span className="font-bold truncate">{p.name}</span>
              <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider
                ${activeProfileId === p.id ? "text-white/70" : "text-slate-400"}`}>
                {p.relationship}
              </span>
            </button>
          ))}
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-dashed border-slate-200 mt-1.5">
            <Plus size={14} /> Add a bond
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 pt-5 pb-3 flex-1 overflow-y-auto custom-scroll-light">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.18em] px-2 mb-2">Workspace</div>
        <SidebarBtn
          icon={<Sparkles size={15} />} label="Home"
          active={activeFeature === "home"} onClick={() => setActiveFeature("home")}
        />

        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.18em] px-2 mt-5 mb-2">Readings</div>
        <div className="space-y-0.5">
          {FEATURES.map((f) => {
            const Icon = ICON_MAP[f.key] ?? MessageCircle;
            return (
              <SidebarBtn
                key={f.key}
                icon={<Icon size={15} />}
                label={f.label}
                badge={f.badge}
                active={activeFeature === f.key}
                onClick={() => setActiveFeature(f.key)}
              />
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-3 pt-2 border-t border-slate-100">
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Credits</span>
            <span className="text-xs font-black text-slate-900 tabular-nums">28 / 50</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: "56%" }} />
          </div>
          <button className="mt-2.5 w-full text-[11px] font-black py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            Top up
          </button>
        </div>
        <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}

function SidebarBtn({ icon, label, active, onClick, badge }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-semibold transition-all
        ${active ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`}
    >
      <span className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors
        ${active ? "text-indigo-600" : "text-slate-500"}`}>
        {icon}
      </span>
      <span className="flex-1 text-left truncate">{label}</span>
      {badge && (
        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 tracking-wider">
          {badge}
        </span>
      )}
    </button>
  );
}

/* ── Home view ──────────────────────────────────────────────────── */
function HomeView({ profile, onOpen }: { profile: typeof PROFILES[number]; onOpen: (k: string) => void }) {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Greeting */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{DAILY.date}</p>
          <h1 className="text-[26px] md:text-[34px] font-black text-slate-900 tracking-tight leading-tight mt-1">
            Hey {profile.name}, here's today.
          </h1>
          <p className="text-sm md:text-base text-slate-700 mt-1.5">{DAILY.vibe}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs font-bold text-slate-700 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            View calendar
          </button>
          <button
            onClick={() => onOpen("chat")}
            className="text-xs font-bold text-white bg-slate-900 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <MessageCircle size={13} /> Ask Oracle
          </button>
        </div>
      </div>

      {/* Bento grid — Today */}
      <div className="grid grid-cols-12 gap-3 md:gap-4">
        {/* Day score */}
        <div className="col-span-12 md:col-span-5 rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Day score</div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Strong</span>
          </div>
          <div className="p-5 md:p-6 flex items-center gap-5">
            <ScoreBar value={DAILY.dayScore} />
            <div>
              <div className="text-[44px] md:text-[56px] font-black text-slate-900 leading-none tabular-nums tracking-tight">
                {DAILY.dayScore}
              </div>
              <p className="text-sm text-slate-700 mt-1.5 max-w-[16rem] leading-snug">
                Sharp focus today. Move on stalled work between 11am-2pm.
              </p>
            </div>
          </div>
        </div>

        {/* Panchang */}
        <div className="col-span-12 md:col-span-7 rounded-2xl border border-slate-200 bg-white">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Panchang</div>
            <button className="text-[11px] font-bold text-indigo-600 hover:underline">Full reading</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
            {[
              ["Tithi", DAILY.tithi],
              ["Nakshatra", DAILY.nakshatra],
              ["Yoga", DAILY.yoga],
              ["Moon", DAILY.moonSign],
            ].map(([k, v], i) => (
              <div key={k} className={`p-4 ${i > 1 ? "border-t md:border-t-0 border-slate-100" : ""}`}>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{k}</div>
                <div className="text-sm md:text-base font-black text-slate-900 mt-1">{v}</div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3.5 flex items-center justify-between">
            <div className="text-xs text-slate-700">
              Auspicious window <span className="font-black text-slate-900">11:08 — 13:42</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
            </span>
          </div>
        </div>

        {/* Featured callouts */}
        <FeaturedCard span="md:col-span-4" featureKey="explainer" onOpen={onOpen} accent="indigo" />
        <FeaturedCard span="md:col-span-4" featureKey="destiny" onOpen={onOpen} accent="indigo" />
        <FeaturedCard span="md:col-span-4" featureKey="year-ahead" onOpen={onOpen} accent="amber" />
      </div>

      {/* All readings list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight">All readings</h3>
          <span className="text-[11px] font-bold text-slate-500 tabular-nums">{FEATURES.length} total</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
          {FEATURES.map((f) => {
            const Icon = ICON_MAP[f.key] ?? MessageCircle;
            return (
              <button
                key={f.key}
                onClick={() => onOpen(f.key)}
                className="w-full flex items-center gap-3 px-4 md:px-5 py-3 md:py-3.5 hover:bg-slate-50 transition-colors text-left group"
              >
                <span className="w-9 h-9 rounded-lg bg-slate-100 grid place-items-center group-hover:bg-indigo-100 transition-colors flex-shrink-0">
                  <Icon size={15} className="text-slate-700 group-hover:text-indigo-700 transition-colors" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-black text-slate-900 truncate">{f.label}</span>
                    {f.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 tracking-wider">
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-slate-600 truncate mt-0.5">{f.hint}</p>
                </div>
                <ArrowUpRight size={15} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
        AI-generated astrological insights · Not medical advice
      </p>
    </div>
  );
}

function FeaturedCard({ span, featureKey, onOpen, accent }: { span: string; featureKey: string; onOpen: (k: string) => void; accent: "indigo" | "amber" }) {
  const f = FEATURES.find((x) => x.key === featureKey)!;
  const Icon = ICON_MAP[f.key] ?? MessageCircle;
  const accentBg = accent === "indigo" ? "bg-indigo-50" : "bg-amber-50";
  const accentText = accent === "indigo" ? "text-indigo-700" : "text-amber-800";
  return (
    <button
      onClick={() => onOpen(f.key)}
      className={`col-span-12 ${span} group rounded-2xl border border-slate-200 bg-white p-5 md:p-6 text-left hover:border-slate-300 hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between">
        <span className={`w-10 h-10 rounded-lg ${accentBg} grid place-items-center`}>
          <Icon size={17} className={accentText} />
        </span>
        {f.badge && (
          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${accent === "indigo" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"} tracking-wider`}>
            {f.badge}
          </span>
        )}
      </div>
      <div className="mt-4 text-[15px] md:text-[17px] font-black text-slate-900 tracking-tight">{f.label}</div>
      <p className="text-[12.5px] text-slate-700 mt-1 leading-snug">{f.hint}</p>
      <div className="mt-4 inline-flex items-center gap-1 text-[12px] font-black text-slate-900 group-hover:gap-2 transition-all">
        Open <ArrowUpRight size={13} />
      </div>
    </button>
  );
}

function ScoreBar({ value }: { value: number }) {
  const segments = 10;
  const filled = Math.round((value / 100) * segments);
  return (
    <div className="flex flex-col gap-1.5 h-[110px] md:h-[130px]">
      {Array.from({ length: segments }).map((_, i) => {
        const idx = segments - 1 - i;
        return (
          <span
            key={i}
            className={`block w-3 md:w-4 flex-1 rounded-sm transition-colors ${idx < filled ? "bg-slate-900" : "bg-slate-200"}`}
          />
        );
      })}
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
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col h-[calc(100dvh-220px)] md:h-[calc(100dvh-180px)]">
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <div>
            <div className="text-[14px] font-black text-slate-900 leading-none">Quantum Oracle</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Live · cites D1–D60</div>
          </div>
        </div>
        <button className="text-[11px] font-bold text-slate-500 hover:text-rose-600">Clear chat</button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "items-start gap-3"}`}>
            {m.role === "assistant" && (
              <span className="w-9 h-9 rounded-lg bg-slate-900 grid place-items-center flex-shrink-0">
                <Sparkles size={14} className="text-white" />
              </span>
            )}
            <div className={m.role === "user"
              ? "max-w-[85%] md:max-w-[68%] rounded-2xl rounded-tr-sm px-4 py-3 bg-slate-900 text-white"
              : "max-w-[88%] md:max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 bg-slate-50 border border-slate-100 text-slate-800"
            }>
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
            className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            {c}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 md:p-4 flex items-end gap-2 border-t border-slate-100">
        <div className="flex-1 flex items-end rounded-xl bg-white border border-slate-300 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-200 transition-all overflow-hidden">
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
          className="h-11 w-11 rounded-xl bg-slate-900 text-white grid place-items-center hover:bg-slate-800 disabled:opacity-40"
        >
          <Send size={16} />
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
    <div className="space-y-5">
      <button onClick={onBack} className="md:hidden inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
        <ArrowLeft size={14} /> Back to home
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-5 md:px-7 py-5 md:py-6 border-b border-slate-100 flex items-start gap-4">
          <span className="w-12 h-12 rounded-xl bg-slate-900 grid place-items-center flex-shrink-0">
            <Icon size={20} className="text-white" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Reading</div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">{f.label}</h2>
            <p className="text-sm md:text-base text-slate-700 mt-1.5 max-w-2xl">{f.hint}</p>
          </div>
          <button className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-black hover:bg-slate-800 transition-colors flex-shrink-0">
            Generate <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
          {[
            ["Charts", "16 ÷ scanned"],
            ["Dasha", "3 layers"],
            ["Transits", "Live"],
          ].map(([k, v]) => (
            <div key={k} className="px-4 md:px-6 py-4">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{k}</div>
              <div className="text-sm md:text-base font-black text-slate-900 mt-1">{v}</div>
            </div>
          ))}
        </div>

        <div className="p-5 md:p-7 prose prose-slate max-w-none">
          <p className="text-slate-800 text-[15px] leading-relaxed">
            <strong>Preview placeholder.</strong> In production this panel mounts the
            real <code className="font-mono">{f.key}</code> component
            from <code className="font-mono">/dashboard/components</code>. The frame, density,
            type scale, and contrast you see here are what's being evaluated.
          </p>
          <p className="text-slate-700 text-[14px] mt-3 leading-relaxed">
            The Editorial Calm direction prioritises legibility and information density,
            similar to Linear and Notion. White surfaces, sharp 1px borders, single
            indigo accent — built for users who'll spend hours in this dashboard.
          </p>
        </div>

        <div className="px-5 md:px-7 py-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-500 font-semibold">
            Generation costs ~5 credits · You have <span className="text-slate-900 font-black tabular-nums">28</span> remaining
          </p>
          <button className="md:hidden inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-black">
            Generate <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile bottom tab bar ──────────────────────────────────────── */
function MobileTabBar({
  active, setActive, onOpenDrawer,
}: { active: string; setActive: (k: string) => void; onOpenDrawer: () => void }) {
  const items: { key: string; icon: React.ReactNode; label: string; onClick?: () => void }[] = [
    { key: "home",      icon: <Sparkles size={18} />,    label: "Home" },
    { key: "chat",      icon: <MessageCircle size={18} />, label: "Oracle" },
    { key: "destiny",   icon: <Calendar size={18} />,    label: "Destiny" },
    { key: "karma-dna", icon: <Compass size={18} />,     label: "Karma" },
    { key: "menu",      icon: <Menu size={18} />,        label: "Menu", onClick: onOpenDrawer },
  ];
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-white border-t border-slate-200 pb-[max(env(safe-area-inset-bottom),0px)]">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => (it.onClick ? it.onClick() : setActive(it.key))}
              className="relative flex flex-col items-center justify-center py-2.5 active:bg-slate-100 transition-colors"
            >
              {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-slate-900 rounded-full" />}
              <span className={isActive ? "text-slate-900" : "text-slate-500"}>{it.icon}</span>
              <span className={`text-[10px] mt-1 font-black tracking-wide ${isActive ? "text-slate-900" : "text-slate-500"}`}>
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
