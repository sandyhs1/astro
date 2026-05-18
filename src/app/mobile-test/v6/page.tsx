"use client";

/* ═══════════════════════════════════════════════════════════════════════════
 * V6 — STRIPE PRESS EDITORIAL
 * Premium publication aesthetic. Cream canvas, deep navy ink, single oxblood
 * accent. Display serif hero, asymmetric editorial grid, slow refined motion.
 * Light theme · WCAG AA contrast · mobile-first.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles, Search, Send, ChevronRight, LogOut, MessageCircle,
  BookOpen, Compass, Map, Flame, Sun, Heart, Mic, Calendar, Crown, Gem,
  FileText, ListChecks, ArrowLeft, ArrowRight, Plus, Bell, X, Menu,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { FEATURES, PROFILES, DAILY, CHIPS, SAMPLE_MESSAGES, type Feature } from "../data";

const ICON_MAP: Record<string, LucideIcon> = {
  explainer: BookOpen, chat: MessageCircle, destiny: Calendar, "karma-dna": Sparkles,
  "karmic-patterns": Compass, "royal-roast": Flame, gotra: Sun, "ishta-devata": Heart,
  journal: Mic, "year-ahead": Calendar, "soul-code": Crown, roadmap: Map,
  remedy: Gem, reports: FileText, details: ListChecks,
};

/* ── Editorial palette ─────────────────────────────────────────────
   Cream paper · deep navy ink · oxblood accent · stone borders.
   Pulled from Stripe Press / Aperture Magazine / 99U references. */
const PAL = {
  paper:    "#FAF7F2",  // warm cream canvas
  paper2:   "#F1ECE0",  // section tint
  ink:      "#0E1A33",  // deep navy text
  ink2:     "#3F4F6F",  // muted ink
  ink3:     "#6F7B92",  // tertiary
  border:   "#D4C9B7",  // taupe border
  border2:  "#E8E0CE",  // soft border
  accent:   "#7B0A1F",  // oxblood
  accent2:  "#A02236",  // rose-ish oxblood
  gold:     "#A57C2A",  // muted antique gold
};

/* Editorial sections. */
const SECTIONS: { num: string; title: string; subtitle: string; keys: string[] }[] = [
  { num: "01", title: "Begin here",   subtitle: "Your first reading",        keys: ["explainer", "chat", "destiny"] },
  { num: "02", title: "Blueprint",    subtitle: "What was sealed at birth",  keys: ["karma-dna", "karmic-patterns", "soul-code", "details"] },
  { num: "03", title: "Forecast",     subtitle: "What's bending toward you", keys: ["year-ahead", "roadmap", "royal-roast"] },
  { num: "04", title: "Practice",     subtitle: "What to do daily",          keys: ["remedy", "gotra", "ishta-devata", "journal"] },
  { num: "05", title: "Archive",      subtitle: "Saved & past readings",     keys: ["reports"] },
];

export default function V6Page() {
  const [activeProfile, setActiveProfile] = useState(PROFILES[0].id);
  const [activeFeature, setActiveFeature] = useState<string>("home");
  const [drawer, setDrawer] = useState(false);
  const profile = PROFILES.find((p) => p.id === activeProfile)!;

  return (
    <div
      className="min-h-[100dvh] w-full flex"
      style={{
        color: PAL.ink,
        background: `linear-gradient(180deg, ${PAL.paper} 0%, ${PAL.paper2} 100%)`,
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Inter', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Subtle paper grain */}
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(14,26,51,1) 1px,transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* Desktop sidebar */}
      <Sidebar
        activeFeature={activeFeature}
        setActiveFeature={(k) => { setActiveFeature(k); setDrawer(false); }}
        profile={profile}
        activeProfileId={activeProfile}
        onSwitchProfile={setActiveProfile}
        className="hidden md:flex"
      />

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setDrawer(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(14,26,51,0.55)" }} />
          <Sidebar
            activeFeature={activeFeature}
            setActiveFeature={(k) => { setActiveFeature(k); setDrawer(false); }}
            profile={profile}
            activeProfileId={activeProfile}
            onSwitchProfile={setActiveProfile}
            className="relative z-10 flex h-full w-[284px]"
            onClose={() => setDrawer(false)}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col relative z-10">
        <Masthead
          activeFeature={activeFeature}
          profile={profile}
          onMenu={() => setDrawer(true)}
        />

        <main className="flex-1 px-5 md:px-10 lg:px-16 py-7 md:py-12 max-w-[1280px] w-full mx-auto pb-24 md:pb-16">
          {activeFeature === "home" && <HomeView profile={profile} onOpen={setActiveFeature} />}
          {activeFeature === "chat" && <ChatView profile={profile} />}
          {activeFeature !== "home" && activeFeature !== "chat" && (
            <FeatureView featureKey={activeFeature} onBack={() => setActiveFeature("home")} />
          )}
        </main>

        <Footer />
      </div>

      {/* Mobile bottom bar */}
      <MobileTabBar active={activeFeature} setActive={setActiveFeature} onMenu={() => setDrawer(true)} />

      <SerifFonts />
    </div>
  );
}

/* ── Serif type loader (Google Fonts inline link via <style>) ───── */
function SerifFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap');
      .serif-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; font-feature-settings: 'ss01','liga'; letter-spacing: -0.02em; }
      .serif-text    { font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif; }
    `}</style>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────── */
function Sidebar({
  activeFeature, setActiveFeature, profile, activeProfileId, onSwitchProfile, className = "", onClose,
}: {
  activeFeature: string;
  setActiveFeature: (k: string) => void;
  profile: typeof PROFILES[number];
  activeProfileId: string;
  onSwitchProfile: (id: string) => void;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <aside
      className={`flex-shrink-0 w-[284px] flex-col ${className}`}
      style={{ background: PAL.paper, borderRight: `1px solid ${PAL.border2}` }}
    >
      {/* Brand */}
      <div className="h-16 px-6 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${PAL.border2}` }}
      >
        <Link href="/mobile-test" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-sm grid place-items-center" style={{ background: PAL.ink }}>
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="serif-display text-[18px] font-semibold leading-none" style={{ color: PAL.ink }}>
            Quantum Karma
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden h-8 w-8 grid place-items-center rounded hover:bg-black/5">
            <X size={16} style={{ color: PAL.ink }} />
          </button>
        )}
      </div>

      {/* Profile */}
      <div className="px-6 pt-5 pb-4" style={{ borderBottom: `1px solid ${PAL.border2}` }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: PAL.ink3 }}>
          Reading for
        </div>
        <div className="space-y-1">
          {PROFILES.map((p) => (
            <button key={p.id} onClick={() => onSwitchProfile(p.id)}
              className="w-full flex items-center gap-3 py-2 transition-opacity hover:opacity-80"
            >
              <span className="w-8 h-8 rounded-sm grid place-items-center font-semibold text-[13px]"
                style={{
                  background: activeProfileId === p.id ? PAL.ink : PAL.border2,
                  color: activeProfileId === p.id ? PAL.paper : PAL.ink,
                }}
              >
                {p.initial}
              </span>
              <div className="flex-1 text-left min-w-0">
                <div className="text-[13.5px] font-semibold truncate" style={{ color: PAL.ink }}>{p.name}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>
                  {p.relationship}
                </div>
              </div>
              {activeProfileId === p.id && (
                <span className="text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: PAL.accent }}>
                  Active
                </span>
              )}
            </button>
          ))}
          <button className="w-full flex items-center gap-3 py-2 hover:opacity-80 transition-opacity">
            <span className="w-8 h-8 rounded-sm grid place-items-center" style={{ background: PAL.border2, color: PAL.ink2 }}>
              <Plus size={14} />
            </span>
            <span className="text-[13.5px] font-semibold" style={{ color: PAL.ink2 }}>Add a bond</span>
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-6 pt-5 pb-3 custom-scroll-light">
        <NavBtn
          label="Home"
          active={activeFeature === "home"}
          onClick={() => setActiveFeature("home")}
          mono="—"
        />
        {SECTIONS.map((sec) => (
          <div key={sec.num} className="mt-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="serif-display text-[11px] tabular-nums" style={{ color: PAL.accent, fontStyle: "italic" }}>
                {sec.num}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>
                {sec.title}
              </span>
            </div>
            <div>
              {sec.keys.map((k) => {
                const f = FEATURES.find((x) => x.key === k);
                if (!f) return null;
                const Icon = ICON_MAP[f.key] ?? MessageCircle;
                return (
                  <NavBtn key={f.key} icon={<Icon size={13} />} label={f.label} badge={f.badge}
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
      <div className="px-6 py-4 space-y-2.5" style={{ borderTop: `1px solid ${PAL.border2}` }}>
        <div className="rounded-sm p-3" style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: PAL.ink3 }}>Credits</span>
            <span className="text-[12px] font-semibold tabular-nums" style={{ color: PAL.ink }}>28 / 50</span>
          </div>
          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: PAL.border2 }}>
            <div className="h-full rounded-full" style={{ width: "56%", background: PAL.accent }} />
          </div>
        </div>
        <button className="w-full flex items-center gap-2 py-1.5 text-[12.5px] font-semibold hover:opacity-70 transition-opacity"
          style={{ color: PAL.ink2 }}
        >
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </aside>
  );
}

function NavBtn({ icon, label, active, onClick, badge, mono }: {
  icon?: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: string; mono?: string;
}) {
  return (
    <button onClick={onClick}
      className="group w-full flex items-center gap-2.5 py-1.5 text-[13.5px] transition-colors text-left"
      style={{ color: active ? PAL.ink : PAL.ink2 }}
    >
      {mono ? (
        <span className="serif-display text-[12px] w-5 text-center"
          style={{ color: active ? PAL.accent : PAL.ink3, fontStyle: "italic" }}
        >
          {mono}
        </span>
      ) : icon ? (
        <span className="w-5 grid place-items-center" style={{ color: active ? PAL.accent : PAL.ink3 }}>
          {icon}
        </span>
      ) : (
        <span className="w-5" />
      )}
      <span className="flex-1 truncate font-semibold serif-text"
        style={{
          textDecoration: active ? "underline" : "none",
          textDecorationThickness: "1px",
          textUnderlineOffset: "4px",
          textDecorationColor: PAL.accent,
        }}
      >
        {label}
      </span>
      {badge && (
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: PAL.accent }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

/* ── Masthead ───────────────────────────────────────────────────── */
function Masthead({ activeFeature, profile, onMenu }: {
  activeFeature: string; profile: typeof PROFILES[number]; onMenu: () => void;
}) {
  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-md"
      style={{
        background: "rgba(250,247,242,0.92)",
        borderBottom: `1px solid ${PAL.border2}`,
      }}
    >
      <div className="flex items-center gap-3 px-5 md:px-10 lg:px-16 h-14 md:h-16 max-w-[1280px] w-full mx-auto">
        <button onClick={onMenu}
          className="md:hidden h-9 w-9 grid place-items-center rounded hover:bg-black/5 transition-colors"
        >
          <Menu size={18} style={{ color: PAL.ink }} />
        </button>

        <Link href="/mobile-test" className="md:hidden serif-display text-[16px] font-semibold tracking-tight" style={{ color: PAL.ink }}>
          Quantum Karma
        </Link>

        <div className="hidden md:flex items-baseline gap-3 flex-1 min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>
            Vol. III · {DAILY.date}
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button className="hidden md:flex items-center gap-2 h-9 px-3 rounded-sm transition-colors hover:bg-black/5"
            style={{ border: `1px solid ${PAL.border}` }}
          >
            <Search size={13} style={{ color: PAL.ink2 }} />
            <span className="text-[12.5px] pr-12 font-medium" style={{ color: PAL.ink2 }}>Find a reading</span>
          </button>
          <button className="h-9 w-9 grid place-items-center rounded hover:bg-black/5 transition-colors relative">
            <Bell size={15} style={{ color: PAL.ink2 }} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: PAL.accent }} />
          </button>
          <span className="hidden md:inline-flex items-center gap-2 ml-2 pl-3" style={{ borderLeft: `1px solid ${PAL.border2}` }}>
            <span className="w-7 h-7 rounded-sm grid place-items-center font-semibold text-[12px]"
              style={{ background: PAL.ink, color: PAL.paper }}
            >
              {profile.initial}
            </span>
            <span className="text-[12.5px] font-semibold" style={{ color: PAL.ink }}>{profile.name}</span>
          </span>
        </div>
      </div>

      {/* Section breadcrumb on desktop */}
      {activeFeature !== "home" && (
        <div className="hidden md:block max-w-[1280px] mx-auto px-10 lg:px-16 pb-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>
            <Link href="#" onClick={(e) => e.preventDefault()} className="hover:underline" style={{ color: PAL.accent }}>Home</Link>
            <span className="mx-2" style={{ color: PAL.border }}>/</span>
            {currentLabel(activeFeature)}
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Home view (editorial) ──────────────────────────────────────── */
function HomeView({ profile, onOpen }: { profile: typeof PROFILES[number]; onOpen: (k: string) => void }) {
  return (
    <div>
      {/* Issue head */}
      <div className="flex items-baseline justify-between gap-3 pb-2"
        style={{ borderBottom: `1px solid ${PAL.border}` }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.ink3 }}>
          Today · {DAILY.date}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.ink3 }}>
          № 137
        </span>
      </div>

      {/* HERO — asymmetric: serif headline on the left, kicker info on the right */}
      <section className="grid md:grid-cols-12 gap-6 md:gap-10 pt-7 md:pt-10 pb-10 md:pb-14"
        style={{ borderBottom: `1px solid ${PAL.border}` }}
      >
        <div className="md:col-span-8">
          <span className="serif-display italic text-[14px] md:text-[16px]" style={{ color: PAL.accent }}>
            № 137 · Today's briefing
          </span>
          <h1 className="serif-display text-[44px] md:text-[68px] lg:text-[88px] font-semibold leading-[0.97] mt-3"
            style={{ color: PAL.ink }}
          >
            Hello, <span style={{ color: PAL.accent }}>{profile.name}</span>.
            <br/>
            <span className="font-medium">{DAILY.vibe.toLowerCase()}.</span>
          </h1>

          <div className="mt-6 max-w-2xl">
            <p className="serif-text text-[17px] md:text-[19px] leading-[1.55]" style={{ color: PAL.ink2 }}>
              Mercury moves into your tenth house at <span className="font-semibold" style={{ color: PAL.ink }}>11:08 IST</span>,
              opening a precise window for stalled negotiations. The Moon sits in
              <span className="font-semibold" style={{ color: PAL.ink }}> {DAILY.nakshatra}</span>, sharpening
              clarity over emotion. Use the period before <span className="font-mono text-[15px] tabular-nums">13:42</span> for
              high-stakes communication; the rest of the day favours quiet revision over expansion.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <button onClick={() => onOpen("chat")}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-sm text-white text-[13px] font-semibold transition-opacity hover:opacity-90"
              style={{ background: PAL.ink }}
            >
              Ask the Oracle <ArrowRight size={14} />
            </button>
            <button onClick={() => onOpen("destiny")}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-sm text-[13px] font-semibold transition-colors"
              style={{
                background: "transparent", color: PAL.ink,
                border: `1px solid ${PAL.ink}`,
              }}
            >
              Today's destiny window <ArrowUpRight size={13} />
            </button>
          </div>
        </div>

        {/* Sidebar info column */}
        <aside className="md:col-span-4 md:pl-8 md:border-l space-y-6"
          style={{ borderColor: PAL.border }}
        >
          <ScoreBlock value={DAILY.dayScore} />

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: PAL.ink3 }}>
              Panchang · live
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
                  <tr key={k} className="align-baseline"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid ${PAL.border2}` : "none" }}
                  >
                    <td className="py-2.5 pr-3 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>{k}</td>
                    <td className="py-2.5 text-[14px] font-semibold serif-text text-right" style={{ color: PAL.ink }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
      </section>

      {/* Editorial table of contents */}
      <section className="py-10 md:py-14">
        <div className="flex items-baseline justify-between mb-7 md:mb-10">
          <h2 className="serif-display text-[28px] md:text-[36px] font-semibold leading-none" style={{ color: PAL.ink }}>
            In this issue
          </h2>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>
            {FEATURES.length} readings
          </span>
        </div>

        <div className="space-y-12 md:space-y-14">
          {SECTIONS.map((sec) => (
            <SectionBlock key={sec.num} section={sec} onOpen={onOpen} />
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="py-10 md:py-14 my-2"
        style={{ borderTop: `1px solid ${PAL.border}`, borderBottom: `1px solid ${PAL.border}` }}
      >
        <blockquote className="max-w-3xl mx-auto text-center px-2">
          <p className="serif-display italic text-[26px] md:text-[36px] lg:text-[42px] font-medium leading-[1.15]"
            style={{ color: PAL.ink }}
          >
            "The chart is not your fate.
            It is the timing of your <span style={{ color: PAL.accent }}>arrivals</span>."
          </p>
          <footer className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.ink3 }}>
            — A line from your karmic blueprint
          </footer>
        </blockquote>
      </section>
    </div>
  );
}

function SectionBlock({ section, onOpen }: {
  section: { num: string; title: string; subtitle: string; keys: string[] };
  onOpen: (k: string) => void;
}) {
  const items = section.keys
    .map((k) => FEATURES.find((f) => f.key === k))
    .filter(Boolean) as Feature[];
  if (items.length === 0) return null;

  return (
    <article className="grid md:grid-cols-12 gap-6 md:gap-10">
      {/* Section head */}
      <header className="md:col-span-3">
        <div className="serif-display italic text-[24px] md:text-[34px] font-medium leading-none" style={{ color: PAL.accent }}>
          {section.num}
        </div>
        <h3 className="serif-display text-[24px] md:text-[28px] font-semibold leading-tight mt-2" style={{ color: PAL.ink }}>
          {section.title}
        </h3>
        <p className="serif-text text-[14px] mt-1.5" style={{ color: PAL.ink2 }}>
          {section.subtitle}
        </p>
      </header>

      {/* Items list */}
      <ul className="md:col-span-9 md:border-l md:pl-10 divide-y"
        style={{ borderColor: PAL.border }}
      >
        {items.map((f, i) => {
          const Icon = ICON_MAP[f.key] ?? MessageCircle;
          return (
            <li key={f.key} style={{ borderColor: PAL.border2 }}>
              <button onClick={() => onOpen(f.key)}
                className="group w-full grid grid-cols-[auto_1fr_auto] items-baseline gap-4 md:gap-6 py-4 md:py-5 text-left transition-colors hover:bg-black/[0.015]"
              >
                <span className="serif-display italic text-[14px] md:text-[16px] tabular-nums" style={{ color: PAL.accent }}>
                  {section.num}.{String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} style={{ color: PAL.ink3 }} />
                    <h4 className="serif-display text-[20px] md:text-[24px] font-semibold leading-tight tracking-tight"
                      style={{ color: PAL.ink }}
                    >
                      {f.label}
                    </h4>
                    {f.badge && (
                      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
                        style={{ color: PAL.accent, border: `1px solid ${PAL.border}` }}
                      >
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <p className="serif-text text-[14.5px] md:text-[15.5px] mt-1.5 leading-snug max-w-2xl"
                    style={{ color: PAL.ink2 }}
                  >
                    {f.hint}
                  </p>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] flex items-center gap-1 transition-transform group-hover:translate-x-0.5"
                  style={{ color: PAL.accent }}
                >
                  Read <ArrowRight size={12} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function ScoreBlock({ value }: { value: number }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: PAL.ink3 }}>
        Day score
      </div>
      <div className="flex items-baseline gap-3">
        <span className="serif-display text-[88px] font-medium leading-none tabular-nums tracking-[-0.04em]"
          style={{ color: PAL.ink }}
        >
          {value}
        </span>
        <span className="text-[14px] font-semibold" style={{ color: PAL.ink3 }}>/ 100</span>
      </div>
      <div className="mt-3 h-[2px] w-full" style={{ background: PAL.border2 }}>
        <div className="h-full" style={{ width: `${value}%`, background: PAL.accent }} />
      </div>
      <p className="serif-text italic text-[13px] mt-3" style={{ color: PAL.ink2 }}>
        Sharp focus today. Move on stalled work between 11:08–13:42.
      </p>
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
    <div>
      <header className="pb-4 mb-6" style={{ borderBottom: `1px solid ${PAL.border}` }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.accent }}>
          Conversation
        </div>
        <h1 className="serif-display text-[34px] md:text-[44px] font-semibold leading-tight mt-2" style={{ color: PAL.ink }}>
          Quantum Oracle
        </h1>
        <p className="serif-text text-[14.5px] mt-1.5" style={{ color: PAL.ink2 }}>
          Reading for {profile.name} · cites D1–D60 · live transits
        </p>
      </header>

      <div className="rounded-sm overflow-hidden flex flex-col h-[calc(100dvh-360px)] md:h-[calc(100dvh-280px)]"
        style={{ background: PAL.paper, border: `1px solid ${PAL.border2}` }}
      >
        <div className="flex-1 overflow-y-auto px-5 md:px-7 py-6 space-y-6 custom-scroll-light">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
              {m.role === "assistant" ? (
                <div className="flex gap-3 max-w-[88%] md:max-w-[78%]">
                  <span className="w-8 h-8 rounded-sm grid place-items-center flex-shrink-0"
                    style={{ background: PAL.ink }}
                  >
                    <Sparkles size={13} className="text-white" />
                  </span>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5"
                      style={{ color: PAL.accent }}
                    >
                      Oracle
                    </div>
                    <p className="serif-text text-[15.5px] leading-[1.55] whitespace-pre-wrap" style={{ color: PAL.ink }}>
                      {m.text}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="max-w-[88%] md:max-w-[68%] rounded-sm px-4 py-3"
                  style={{ background: PAL.ink, color: PAL.paper }}
                >
                  <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">{m.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-4 pt-3 flex gap-2 overflow-x-auto no-scrollbar pb-2"
          style={{ borderTop: `1px solid ${PAL.border2}` }}
        >
          {CHIPS.map((c) => (
            <button key={c} onClick={() => send(c)}
              className="flex-shrink-0 text-[12px] font-medium serif-text px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors hover:bg-black/[0.04]"
              style={{
                background: PAL.paper2, color: PAL.ink,
                border: `1px solid ${PAL.border2}`,
              }}
            >
              "{c}"
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 flex items-end gap-2"
          style={{ borderTop: `1px solid ${PAL.border2}`, background: PAL.paper2 }}
        >
          <div className="flex-1 flex items-end overflow-hidden rounded-sm focus-within:ring-2 transition-all"
            style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
          >
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Oracle…"
              rows={1}
              className="w-full bg-transparent placeholder:text-stone-400 px-4 py-3 focus:outline-none text-[15px] font-medium serif-text resize-none"
              style={{ color: PAL.ink }}
            />
          </div>
          <button type="submit" disabled={!input.trim()}
            className="h-11 px-4 rounded-sm text-white text-[12.5px] font-semibold inline-flex items-center gap-1.5 transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: PAL.accent }}
          >
            Send <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Feature view (editorial article) ───────────────────────────── */
function FeatureView({ featureKey, onBack }: { featureKey: string; onBack: () => void }) {
  const f = FEATURES.find((x) => x.key === featureKey);
  if (!f) return null;
  const Icon = ICON_MAP[f.key] ?? MessageCircle;

  return (
    <article>
      <button onClick={onBack} className="md:hidden inline-flex items-center gap-1.5 text-[12px] font-semibold mb-5"
        style={{ color: PAL.ink2 }}
      >
        <ArrowLeft size={13} /> Back to issue
      </button>

      <header className="pb-7 mb-7" style={{ borderBottom: `1px solid ${PAL.border}` }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2.5" style={{ color: PAL.accent }}>
          Reading · {f.key}
        </div>
        <h1 className="serif-display text-[44px] md:text-[68px] lg:text-[80px] font-semibold leading-[0.97]"
          style={{ color: PAL.ink }}
        >
          {f.label}.
        </h1>
        <p className="serif-text italic text-[18px] md:text-[20px] mt-3 max-w-3xl leading-snug" style={{ color: PAL.ink2 }}>
          {f.hint}.
        </p>
      </header>

      <div className="grid md:grid-cols-12 gap-6 md:gap-10">
        {/* Article body */}
        <div className="md:col-span-8">
          <p className="serif-text text-[17px] md:text-[19px] leading-[1.6]" style={{ color: PAL.ink }}>
            <span className="serif-display text-[44px] md:text-[64px] font-medium leading-none float-left mr-3 mt-1.5 -ml-1"
              style={{ color: PAL.accent }}
            >
              T
            </span>
            his is a preview placeholder. In production this article frame mounts the real
            {" "}<code className="font-mono px-1.5 py-0.5 text-[14px]"
              style={{ background: PAL.paper2, color: PAL.ink, border: `1px solid ${PAL.border2}` }}
            >{f.key}</code> component
            from <code className="font-mono px-1.5 py-0.5 text-[14px]"
              style={{ background: PAL.paper2, color: PAL.ink, border: `1px solid ${PAL.border2}` }}
            >/dashboard/components</code> — the engine output is rendered inside this same
            editorial container so every reading reads like a published essay rather than a UI panel.
          </p>
          <p className="serif-text text-[17px] md:text-[19px] leading-[1.6] mt-5" style={{ color: PAL.ink }}>
            The Stripe Press Editorial direction prioritises prose: serif display headlines,
            a single oxblood accent, asymmetric spacing, and slow refined motion. The aesthetic
            says "this is something you read and keep" — the opposite of an algorithmic feed.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <button className="inline-flex items-center gap-2 h-11 px-5 rounded-sm text-white text-[13px] font-semibold transition-opacity hover:opacity-90"
              style={{ background: PAL.ink }}
            >
              Generate now <ArrowRight size={14} />
            </button>
            <button className="inline-flex items-center gap-2 h-11 px-5 rounded-sm text-[13px] font-semibold"
              style={{ background: "transparent", color: PAL.ink, border: `1px solid ${PAL.ink}` }}
            >
              Save for later
            </button>
          </div>
        </div>

        {/* Pull-out aside */}
        <aside className="md:col-span-4 md:pl-8 md:border-l space-y-6"
          style={{ borderColor: PAL.border }}
        >
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: PAL.ink3 }}>
              How it's built
            </div>
            <ul className="space-y-2.5 serif-text text-[14.5px]" style={{ color: PAL.ink }}>
              {[
                ["Charts scanned",  "16"],
                ["Dasha layers",    "3"],
                ["Transits",        "Live"],
                ["Sources cited",   "12+"],
                ["Cost per reading","5 credits"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-baseline justify-between gap-3 pb-2"
                  style={{ borderBottom: `1px solid ${PAL.border2}` }}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>{k}</span>
                  <span className="font-semibold tabular-nums">{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <blockquote className="serif-display italic text-[19px] leading-snug border-l-2 pl-4"
            style={{ color: PAL.ink, borderColor: PAL.accent }}
          >
            "Built to be read with care, not scrolled."
          </blockquote>
        </aside>
      </div>
    </article>
  );
}

/* ── Footer ─────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="hidden md:block max-w-[1280px] mx-auto px-10 lg:px-16 py-8"
      style={{ borderTop: `1px solid ${PAL.border}` }}
    >
      <div className="flex items-center justify-between">
        <span className="serif-display italic text-[13px]" style={{ color: PAL.ink3 }}>
          Quantum Karma · Vol. III · 2026
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.ink3 }}>
          AI-generated insights · Not medical advice
        </span>
      </div>
    </footer>
  );
}

/* ── Mobile bottom bar ──────────────────────────────────────────── */
function MobileTabBar({ active, setActive, onMenu }: { active: string; setActive: (k: string) => void; onMenu: () => void }) {
  const items: { key: string; label: string; onClick?: () => void }[] = [
    { key: "home",      label: "Home" },
    { key: "chat",      label: "Oracle" },
    { key: "destiny",   label: "Destiny" },
    { key: "year-ahead",label: "Year" },
    { key: "menu",      label: "Index", onClick: onMenu },
  ];
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)]"
      style={{ background: PAL.paper, borderTop: `1px solid ${PAL.border}` }}
    >
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <button key={it.key}
              onClick={() => (it.onClick ? it.onClick() : setActive(it.key))}
              className="relative flex flex-col items-center justify-center py-3 transition-colors"
              style={{
                color: isActive ? PAL.ink : PAL.ink3,
                background: isActive ? "rgba(123,10,31,0.04)" : "transparent",
              }}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8" style={{ background: PAL.accent }} />
              )}
              <span className="serif-display text-[14px] font-semibold tracking-tight">
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
  return FEATURES.find((f) => f.key === key)?.label ?? "Reading";
}
