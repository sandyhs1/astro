// Shared mock data for all dashboard design variations.
// Used by /mobile-test/v1, v2, v3 so each variation can focus on visuals.

export type Feature = {
  key: string;
  label: string;
  emoji: string;
  badge?: "START" | "NEW" | "PRO";
  hint: string;
  accent: "indigo" | "amber" | "rose" | "emerald" | "purple" | "orange" | "sky" | "slate";
};

export const FEATURES: Feature[] = [
  { key: "explainer",       label: "Explainer",        emoji: "📖", badge: "START", hint: "Start here · 9-min masterclass", accent: "indigo" },
  { key: "chat",            label: "Oracle Chat",      emoji: "💬", hint: "Ask anything about your chart",                accent: "indigo" },
  { key: "destiny",         label: "Destiny Window",   emoji: "🗓️", hint: "Best dates this month",                       accent: "sky" },
  { key: "karma-dna",       label: "Karma DNA",        emoji: "🧬", hint: "Your karmic blueprint",                       accent: "purple" },
  { key: "karmic-patterns", label: "Karmic Patterns",  emoji: "🔮", hint: "Repeating life themes",                       accent: "purple" },
  { key: "royal-roast",     label: "Royal Roast",      emoji: "🔥", hint: "No-filter chart roast",                       accent: "orange" },
  { key: "gotra",           label: "Your Gotra",       emoji: "🕉️", badge: "NEW", hint: "Your spiritual lineage",         accent: "amber" },
  { key: "ishta-devata",    label: "Ishta Devata",     emoji: "🙏", badge: "NEW", hint: "Your guiding deity",            accent: "rose" },
  { key: "journal",         label: "Life Journal",     emoji: "🎙️", hint: "Voice-log your life events",                  accent: "emerald" },
  { key: "year-ahead",      label: "Year Ahead",       emoji: "📅", hint: "12-month transit forecast",                   accent: "amber" },
  { key: "soul-code",       label: "Your Purpose",     emoji: "🔱", hint: "Atmakaraka & life path",                      accent: "purple" },
  { key: "roadmap",         label: "Roadmap",          emoji: "🗺️", badge: "NEW", hint: "Your custom action plan",       accent: "indigo" },
  { key: "remedy",          label: "Remedy",           emoji: "📿", hint: "Mantras, gems, rituals",                      accent: "emerald" },
  { key: "reports",         label: "Reports",          emoji: "📜", hint: "Saved PDF reports",                           accent: "slate" },
  { key: "details",         label: "My Details",       emoji: "📋", hint: "Birth chart raw data",                        accent: "slate" },
];

export const PROFILES = [
  { id: "self",      name: "Sandeep",   relationship: "Self",   initial: "S" },
  { id: "spouse-1",  name: "Priya",     relationship: "Spouse", initial: "P" },
  { id: "child-1",   name: "Arjun",     relationship: "Child",  initial: "A" },
];

export const DAILY = {
  date: "Monday, May 18, 2026",
  tithi: "Shukla Chaturthi",
  nakshatra: "Mrigashira",
  yoga: "Siddha",
  moonSign: "Gemini",
  sunSign: "Taurus",
  dayScore: 78,
  vibe: "Sharp focus · Move on stalled work",
};

export const CHIPS = [
  "What is the core purpose of my Atmakaraka?",
  "When is my best window for a career move?",
  "Show karmic lessons of my current Dasha",
  "What hidden talents does my chart reveal?",
  "When will I experience financial abundance?",
];

export const SAMPLE_MESSAGES: { role: "user" | "assistant"; text: string }[] = [
  {
    role: "assistant",
    text:
      "Hey Sandeep, I'm your Quantum Karma Astrologer. Ask me anything — chart secrets, timing windows, karmic patterns. I cite proofs from your D1 through D60.",
  },
  {
    role: "user",
    text: "What does my D9 chart reveal about my destined partner?",
  },
  {
    role: "assistant",
    text:
      "Your D9 (Navamsa) Lagna sits in Libra with Venus exalted in Pisces in the 7th — a rare placement. Translation: your destined partner is artistic, emotionally fluent, and arrives during your Venus Mahadasha (active now). Expect a meeting tied to creative work or travel — not algorithmic dating.",
  },
];
