"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LogOut, Sparkles, Send, Users, AlertTriangle, MessageCircle, BookOpen,
  Calendar, Map, Flame, Sun, Heart, Mic, Crown, Gem, FileText, ListChecks,
  Compass, Search, Bell, Plus, ArrowRight, ArrowUpRight, ArrowLeft, X, Menu,
  ChevronRight, ChevronDown, Trash2, Pencil,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PaymentGate from "./components/PaymentGate";
import DestinyCalendar from "./components/DestinyCalendar";
import KarmaDNA from "./components/KarmaDNA";
import KarmicPatterns from "./components/KarmicPatterns";
import RemedyPanel from "./components/RemedyPanel";
import Roadmap from "./components/Roadmap";
import TopupModal from "./components/TopupModal";
import DetailsPanel from "./components/DetailsPanel";
import RoyalRoast from "./components/RoyalRoast";
import Compatibility from "./components/Compatibility";
import ChatChipsRow from "./components/ChatChipsRow";
import ImportantNoteModal from "./components/ImportantNoteModal";
import DailyBriefingWidget from "./components/DailyBriefingWidget";
import YourGotra from "./components/YourGotra";
import IshtaDevata from "./components/IshtaDevata";
import LifeJournal from "./components/LifeJournal";
import ReportsPanel from "./components/ReportsPanel";
import SoulCodePanel from "./components/SoulCodePanel";
import YearAheadPanel from "./components/YearAheadPanel";
import ExplainerPanel from "./components/ExplainerPanel";

/* ── Editorial palette (V6 Stripe Press) ─────────────────────────── */
const PAL = {
  paper:    "#FAF7F2",  // warm cream canvas
  paper2:   "#F1ECE0",  // section tint
  ink:      "#0E1A33",  // deep navy text
  ink2:     "#3F4F6F",  // muted ink
  ink3:     "#6F7B92",  // tertiary
  border:   "#D4C9B7",  // taupe border
  border2:  "#E8E0CE",  // soft border
  accent:   "#7B0A1F",  // oxblood
  accent2:  "#A02236",
  gold:     "#A57C2A",
} as const;

/* ── V3-style bento accents (toned down to harmonise with the paper canvas) ── */
const BENTO_ACCENT: Record<string, { bg: string; ink: string; ring: string }> = {
  indigo:  { bg: "linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 60%,#C7D2FE 100%)", ink: "#1E1B4B", ring: "rgba(99,102,241,0.18)" },
  amber:   { bg: "linear-gradient(135deg,#FEF3C7 0%,#FDE68A 60%,#FCD34D 100%)", ink: "#451A03", ring: "rgba(217,119,6,0.18)"  },
  rose:    { bg: "linear-gradient(135deg,#FFE4E6 0%,#FECDD3 60%,#FDA4AF 100%)", ink: "#4C0519", ring: "rgba(225,29,72,0.18)"  },
  emerald: { bg: "linear-gradient(135deg,#D1FAE5 0%,#A7F3D0 60%,#6EE7B7 100%)", ink: "#022C22", ring: "rgba(5,150,105,0.18)"  },
  purple:  { bg: "linear-gradient(135deg,#F5F3FF 0%,#DDD6FE 60%,#C4B5FD 100%)", ink: "#2E1065", ring: "rgba(124,58,237,0.18)" },
  orange:  { bg: "linear-gradient(135deg,#FFEDD5 0%,#FED7AA 60%,#FDBA74 100%)", ink: "#431407", ring: "rgba(234,88,12,0.18)"  },
  sky:     { bg: "linear-gradient(135deg,#E0F2FE 0%,#BAE6FD 60%,#7DD3FC 100%)", ink: "#082F49", ring: "rgba(2,132,199,0.18)"  },
  slate:   { bg: "linear-gradient(135deg,#F1F5F9 0%,#E2E8F0 60%,#CBD5E1 100%)", ink: "#0F172A", ring: "rgba(71,85,105,0.18)"  },
};

/* ── Feature catalog: same 15 features the dashboard already exposes ── */
type FeatureKey =
  | "home"
  | "chat" | "explainer" | "destiny" | "karma-dna" | "karmic-patterns"
  | "remedy" | "roadmap" | "details" | "royal-roast" | "gotra"
  | "ishta-devata" | "journal" | "reports" | "soul-code" | "year-ahead"
  | "compatibility";

type FeatureMeta = {
  key: FeatureKey;
  label: string;
  hint: string;
  badge?: "START" | "NEW";
  accent: keyof typeof BENTO_ACCENT;
  Icon: LucideIcon;
  premium?: boolean;
};

const FEATURE_META: FeatureMeta[] = [
  { key: "explainer",       label: "Explainer Masterclass", hint: "Start here · 9-min onboarding masterclass",     badge: "START", accent: "indigo",  Icon: BookOpen },
  { key: "chat",            label: "Oracle Chat",           hint: "Ask anything about your chart",                                accent: "indigo",  Icon: MessageCircle },
  { key: "destiny",         label: "Destiny Window",        hint: "Best dates this month",                          accent: "sky",     Icon: Calendar, premium: true },
  { key: "karma-dna",       label: "Karma DNA",             hint: "Your karmic blueprint",                          accent: "purple",  Icon: Sparkles, premium: true },
  { key: "karmic-patterns", label: "Karmic Patterns",       hint: "Repeating life themes",                          accent: "purple",  Icon: Compass,  premium: true },
  { key: "royal-roast",     label: "Royal Roast",           hint: "No-filter chart roast",                          accent: "orange",  Icon: Flame,    premium: true },
  { key: "gotra",           label: "Your Gotra",            hint: "Your spiritual lineage",       badge: "NEW",     accent: "amber",   Icon: Sun },
  { key: "ishta-devata",    label: "Ishta Devata",          hint: "Your guiding deity",           badge: "NEW",     accent: "rose",    Icon: Heart },
  { key: "journal",         label: "Life Journal",          hint: "Voice-log your life events",                     accent: "emerald", Icon: Mic },
  { key: "year-ahead",      label: "Year Ahead",            hint: "12-month transit forecast",                      accent: "amber",   Icon: Calendar },
  { key: "soul-code",       label: "Your Purpose",          hint: "Atmakaraka & life path",                         accent: "purple",  Icon: Crown },
  { key: "roadmap",         label: "Roadmap",               hint: "Your custom action plan",      badge: "NEW",     accent: "indigo",  Icon: Map },
  { key: "remedy",          label: "Remedy",                hint: "Mantras, gems, rituals",                         accent: "emerald", Icon: Gem,      premium: true },
  { key: "reports",         label: "Reports",               hint: "Saved PDF reports",                              accent: "slate",   Icon: FileText },
  { key: "details",         label: "My Details",            hint: "Birth chart raw data",                           accent: "slate",   Icon: ListChecks },
  { key: "compatibility",   label: "Compatibility",         hint: "Soul alignment with another person", badge: "NEW", accent: "rose",    Icon: Heart },
];

/* ── Editorial sidebar sections ─────────────────────────────────── */
const NAV_SECTIONS: { num: string; title: string; keys: FeatureKey[] }[] = [
  { num: "01", title: "Begin here",  keys: ["explainer", "chat", "destiny"] },
  { num: "02", title: "Blueprint",   keys: ["karma-dna", "karmic-patterns", "soul-code", "details"] },
  { num: "03", title: "Forecast",    keys: ["year-ahead", "roadmap", "royal-roast"] },
  { num: "04", title: "Practice",    keys: ["remedy", "gotra", "ishta-devata", "journal"] },
  { num: "05", title: "Archive",     keys: ["reports"] },
  { num: "06", title: "Bonds",       keys: ["compatibility"] },
];

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [familyProfiles, setFamilyProfiles] = useState<any[]>([]);
  const [entitlement, setEntitlement] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  // Controls the "Important" disclaimer modal opened from below the chat composer
  const [showImportantNote, setShowImportantNote] = useState(false);
  const [modalType, setModalType] = useState<"self" | "family">("self");
  const [formData, setFormData] = useState({
    name: "",
    relationship: "Self",
    dob: "",
    tob: "",
    pob: "",
    gender: "male"
  });
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Stores the lat/lon/timezone from the user's selected autocomplete suggestion
  // so we can persist them to Supabase on save (avoids a second geocode lookup)
  const [selectedGeocode, setSelectedGeocode] = useState<{ lat: number; lon: number; timezone: string } | null>(null);

  // Geocoding cache: pob → { lat, lon }
  const [geocoordCache, setGeocoordCache] = useState<Record<string, { lat: number; lon: number }>>({});
  const [geocodingReady, setGeocodingReady] = useState(false);

  const [activeProfileId, setActiveProfileId] = useState<string>("self");
  const [activeFeature, setActiveFeature] = useState<"home" | "chat" | "explainer" | "destiny" | "karma-dna" | "karmic-patterns" | "remedy" | "roadmap" | "details" | "royal-roast" | "gotra" | "ishta-devata" | "journal" | "reports" | "soul-code" | "year-ahead" | "compatibility">("home");
  
  const [messages, setMessages] = useState<{id: string, role: "user" | "assistant" | "system", content: string, marker?: string}[]>([
    { id: "welcome", role: "assistant", content: "Hey there, I am your Quantum Karma Astrologer...", marker: "A" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  // Editorial dashboard: mobile sidebar drawer
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Refs to each USER message bubble — used to scroll the user's question to
  // the top of the viewport when an AI reply arrives (so the answer is read
  // top-down without manual scrolling). Keyed by message.id.
  const userMsgRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Cheap unique id for chat messages. crypto.randomUUID() may not exist in
  // older Safari versions; this fallback is collision-safe for chat use.
  const newMsgId = useCallback((): string => {
    if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
      return (crypto as any).randomUUID();
    }
    return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }, []);

  // ── Curated Suggestion Chips ──
  const INITIAL_CHIPS = [
    "What is the core purpose of my Atmakaraka?",
    "When is the best period for a career breakthrough?",
    "What does my D9 chart reveal about my destined partner?",
    "Show me the karmic lessons of my current Dasha",
    "What hidden talents does my birth chart reveal?",
    "When will I experience financial abundance?",
    "What relationship patterns should I be aware of?",
    "What spiritual practices suit my chart?",
    "How do planetary transits in 2026 affect me?",
    "What is the biggest opportunity in my next 3 years?"
  ];

  const FOLLOW_UP_CHIPS: Record<string, string[]> = {
    career: ["When is my best period for a promotion?", "Should I start my own business?", "What career path is most aligned with my chart?"],
    relationship: ["When will I meet my destined partner?", "What patterns affect my relationships?", "Is my current bond karmically aligned?"],
    finance: ["When is my peak wealth period?", "What investments suit my chart?", "Are there upcoming financial risks?"],
    health: ["What health areas should I focus on?", "Which Dasha periods affect my vitality?", "What daily practice strengthens my chart?"],
    spiritual: ["What mantras are most powerful for me?", "What is my Dharmic path?", "How can I accelerate my spiritual growth?"],
    general: INITIAL_CHIPS.slice(0, 5)
  };

  const [suggestionChips, setSuggestionChips] = useState<string[]>(INITIAL_CHIPS);
  // Tracks whether the most recent chip set came from the smart LLM suggester
  const [smartSuggestions, setSmartSuggestions] = useState(false);
  // Tracks "currently fetching new suggestions" so the row can show a skeleton
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  // ── Exclusion ledger ─────────────────────────────────────────────────────
  // Every question already SHOWN as a chip OR already CLICKED OR already
  // TYPED by the user is added here. The suggester reads this set so it
  // never recycles a question the user has already seen. We use a ref so
  // mutations don't trigger re-renders.
  const askedQuestionsRef = useRef<Set<string>>(new Set());
  const recordAskedQuestion = useCallback((q: string) => {
    if (!q) return;
    askedQuestionsRef.current.add(q.trim());
    if (askedQuestionsRef.current.size > 80) {
      // Cap memory — drop oldest entries past the limit
      const arr = Array.from(askedQuestionsRef.current);
      askedQuestionsRef.current = new Set(arr.slice(-60));
    }
  }, []);

  // When chips render, register them so the next round excludes them
  useEffect(() => {
    suggestionChips.forEach(recordAskedQuestion);
  }, [suggestionChips, recordAskedQuestion]);

  /**
   * SMART SUGGESTIONS — async, non-blocking.
   *
   * Called after each AI reply (or after the user sends a topic-shifting
   * message). Hits /api/astro-chat/suggest-prompts which uses Gemini Flash
   * Lite to compose 4 angle-diverse, chart-aware follow-ups built directly
   * on the latest exchange. The server pulls the user's chart fingerprint
   * (Lagna / Moon nakshatra / AK / DK / current Mahadasha + Antardasha)
   * from cache so suggestions can name the user's actual planets.
   *
   * Falls back to keyword-based static chips if anything goes wrong — the
   * chat UX is never blocked or broken by this.
   */
  const fetchSmartSuggestions = async (
    lastUserMessage: string,
    lastAssistantMessage: string,
    threadHistory: { role: "user" | "assistant" | "system"; content: string }[] = [],
  ) => {
    setSuggestionsLoading(true);
    try {
      // Send the last 6 turns (user + assistant only) so the model has full
      // thread context, not just the most recent pair.
      const recentHistory = threadHistory
        .filter(m => m.role === "user" || m.role === "assistant")
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }));

      const excludeQuestions = Array.from(askedQuestionsRef.current);

      const res = await fetch("/api/astro-chat/suggest-prompts", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          lastUserMessage,
          lastAssistantMessage,
          recentHistory,
          excludeQuestions,
          profileName: profile?.full_name || "",
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data?.suggestions) ? data.suggestions : [];
      if (list.length >= 2) {
        setSuggestionChips(list.slice(0, 4));
        setSmartSuggestions(data?.source === "llm");
        return;
      }
    } catch (err) {
      console.warn("[suggest-prompts] failed:", err);
    } finally {
      setSuggestionsLoading(false);
    }
    // Last-resort fallback: keep the existing keyword-matched chips
    updateChipsFromContext(lastUserMessage);
  };

  // Dynamically update chips based on the latest AI response
  const updateChipsFromContext = (latestUserMsg: string) => {
    const lower = latestUserMsg.toLowerCase();
    if (lower.includes("career") || lower.includes("job") || lower.includes("business") || lower.includes("promotion")) {
      setSuggestionChips(FOLLOW_UP_CHIPS.career);
    } else if (lower.includes("marriage") || lower.includes("love") || lower.includes("partner") || lower.includes("relationship")) {
      setSuggestionChips(FOLLOW_UP_CHIPS.relationship);
    } else if (lower.includes("money") || lower.includes("wealth") || lower.includes("finance") || lower.includes("income")) {
      setSuggestionChips(FOLLOW_UP_CHIPS.finance);
    } else if (lower.includes("health") || lower.includes("body") || lower.includes("energy") || lower.includes("vitality")) {
      setSuggestionChips(FOLLOW_UP_CHIPS.health);
    } else if (lower.includes("spiritual") || lower.includes("mantra") || lower.includes("meditation") || lower.includes("dharma")) {
      setSuggestionChips(FOLLOW_UP_CHIPS.spiritual);
    } else {
      setSuggestionChips(FOLLOW_UP_CHIPS.general);
    }
  };

  useEffect(() => {
    if (!loading && !user) router.push("/?auth=true");
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const { data: profileData } = await supabase.from("user_profiles").select("*").eq("id", user.id).single();
        setProfile(profileData);
        
        // Fetch family profiles
        const { data: familyData, error } = await supabase.from("family_profiles").select("*").eq("user_id", user.id);
        if (!error && familyData) {
          setFamilyProfiles(familyData);
          // If no 'self' profile exists, trigger onboarding
          if (!familyData.some(p => p.relationship === 'Self')) {
            setModalType("self");
            setShowProfileModal(true);
          }
        }

        // Fetch Freemius entitlement
        try {
          const res = await fetch("/api/freemius/get-entitlements", { method: 'POST' });
          const json = await res.json();
          if (json.entitlement) {
            setEntitlement(json.entitlement);
          }
        } catch (e) {
          console.error("Error fetching entitlement", e);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }

    }
    if (user) fetchData();
  }, [user, supabase]);

  // ── Load Chat History from Supabase on profile switch ──
  useEffect(() => {
    async function loadChatHistory() {
      if (!user) return;

      const userFirstName = profile?.full_name?.split(' ')[0] || user?.email?.split("@")[0] || "Seeker";
      const welcomeMsg = `Hey ${userFirstName}, I am your Quantum Karma Astrologer. What brings you here today? Ask away all your questions—I'm here to uncover the deepest truths of your chart just for you.`;

      // Always resolve to the actual UUID — same logic as the API
      let targetId: string | null = null;
      if (activeProfileId === "self") {
        const selfP = familyProfiles.find(p => p.relationship === "Self");
        targetId = selfP?.id || null;
      } else {
        targetId = activeProfileId;
      }

      if (!targetId) {
        setMessages([{ id: "welcome", role: "assistant", content: welcomeMsg }]);
        setHistoryLoaded(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("role, content, created_at")
          .eq("user_id", user.id)
          .eq("profile_id", targetId)
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          const loaded = data.map((m: any, idx: number) => {
            let text = m.content;
            let mkr = undefined;
            const markerMatch = text.match(/<!-- MARKER:([A-Z]) -->/);
            if (markerMatch) {
              mkr = markerMatch[1];
              text = text.replace(/<!-- MARKER:[A-Z] -->/, "").trim();
            }
            // Stable id derived from created_at + index — survives re-renders
            // and prevents accidental ref collisions with newly-sent messages.
            const stableId = `h_${m.created_at || idx}_${idx}`;
            return { id: stableId, role: m.role as "user" | "assistant" | "system", content: text, marker: mkr };
          });
          setMessages([{ id: "welcome", role: "assistant", content: welcomeMsg }, ...loaded]);

          // Rebuild the exclusion ledger from prior user messages so we never
          // re-suggest something the user has already typed in this profile.
          askedQuestionsRef.current = new Set();
          for (const m of loaded) {
            if (m.role === "user" && m.content) recordAskedQuestion(m.content);
          }

          // If we have prior messages, generate smart suggestions from the
          // last exchange — passing the full loaded thread for context.
          const lastUserMsg      = [...loaded].reverse().find(m => m.role === "user");
          const lastAssistantMsg = [...loaded].reverse().find(m => m.role === "assistant");
          if (lastUserMsg && lastAssistantMsg) {
            fetchSmartSuggestions(lastUserMsg.content, lastAssistantMsg.content, loaded);
          } else if (lastUserMsg) {
            updateChipsFromContext(lastUserMsg.content);
          }
        } else {
          setMessages([{ id: "welcome", role: "assistant", content: welcomeMsg }]);
          setSuggestionChips(INITIAL_CHIPS);
          setSmartSuggestions(false);
          askedQuestionsRef.current = new Set();
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setMessages([{ id: "welcome", role: "assistant", content: welcomeMsg }]);
      }
      setHistoryLoaded(true);
    }
    loadChatHistory();
  }, [activeProfileId, familyProfiles, user, profile?.full_name]);

  // Geocode all profiles exactly ONCE when familyProfiles loads
  // Stores { pob → { lat, lon } } to avoid hitting Nominatim per-feature
  useEffect(() => {
    if (!familyProfiles || familyProfiles.length === 0) return;
    const pobs = [...new Set(familyProfiles.map((p: any) => p.pob).filter(Boolean))];
    
    // Geocode sequentially with 1s delay between calls to respect Nominatim ToS
    let cancelled = false;
    (async () => {
      const newCache: Record<string, { lat: number; lon: number }> = {};
      for (let i = 0; i < pobs.length; i++) {
        if (cancelled) break;
        const pob = pobs[i] as string;
        if (!pob || newCache[pob]) continue;
        try {
          if (i > 0) await new Promise(r => setTimeout(r, 1100)); // 1.1s delay between calls
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pob)}&limit=1`,
            { headers: { "User-Agent": "QuantumKarma/1.0 (contact@quantumkarma.tech)" } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.[0]) newCache[pob] = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
          }
        } catch { /* silently skip */ }
      }
      if (!cancelled) { setGeocoordCache(prev => ({ ...prev, ...newCache })); setGeocodingReady(true); }
    })();
    return () => { cancelled = true; };
  }, [familyProfiles]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef      = useRef<HTMLTextAreaElement>(null);

  // ── "Jump to latest" pill state ─────────────────────────────────────────
  // Visible only when the user has scrolled up far enough that the latest
  // message is below the fold. Toggled by a scroll listener on the chat
  // messages container. Threshold is generous (~280px) so the pill doesn't
  // flicker for tiny scroll-up gestures.
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  useEffect(() => {
    if (activeFeature !== "chat") return;
    const el = chatContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
      setShowJumpToLatest(distFromBottom > 280);
    };
    onScroll(); // initialise
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeFeature, messages.length]);

  // Auto-resize textarea: shrinks back when cleared, grows up to max-height set in CSS
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";          // reset to measure scrollHeight
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  // ── Scroll the user's just-asked question to the top of the viewport ─────
  // This is the key UX fix: when a long AI answer arrives, we land the reader
  // at the START of their question, not the END of the answer. They then read
  // top-down naturally without having to scroll up.
  const scrollUserMessageToTop = (msgId: string) => {
    const el = userMsgRefs.current[msgId];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Whenever the user opens the Chat tab, jump to the latest message ─────
  // The chat panel is conditionally rendered, so on each tab activation we
  // wait one paint for layout, then snap to the bottom (no smooth — instant
  // feels right when revealing a feature).
  useEffect(() => {
    if (activeFeature !== "chat") return;
    if (!historyLoaded) return;
    const id = requestAnimationFrame(() => {
      const el = chatContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [activeFeature, historyLoaded]);

  // Initial-load scroll (kept as a safety net; the effect above handles tab switches)
  useEffect(() => {
    if (historyLoaded) {
      setTimeout(scrollToBottom, 100);
    }
  }, [historyLoaded]);

  const handleLocationSearch = async (query: string) => {
    setFormData(prev => ({ ...prev, pob: query }));
    if (!query || query.length < 3) {
      setShowSuggestions(false);
      return;
    }
    
    setIsSearchingLocation(true);
    try {
      // NOTE: photon.komoot.io was returning 502 Bad Gateway (service down as of May 2026).
      // We now route through our own /api/geocode proxy which calls Nominatim (OpenStreetMap).
      // This gives us stable results, proper User-Agent handling, and no CORS issues.
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const suggestions = await res.json();

      if (suggestions && suggestions.length > 0) {
        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error("Location search failed", err);
      setLocationSuggestions([]);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      // Check if we are updating an existing profile
      const existingProfile = familyProfiles.find(p => p.name === formData.name && p.relationship === (modalType === "self" ? "Self" : formData.relationship));
      
      let query;
      if (existingProfile) {
      query = supabase.from("family_profiles").update({
          dob: formData.dob,
          tob: formData.tob,
          pob: formData.pob,
          gender: formData.gender,
          // Persist precise coordinates from AstrologyAPI autocomplete selection.
          // If user typed a custom string without selecting from dropdown, keep existing coords.
          ...(selectedGeocode ? {
            lat: selectedGeocode.lat,
            lng: selectedGeocode.lon, // Supabase column is 'lng'
            timezone: selectedGeocode.timezone,
          } : {}),
        }).eq("id", existingProfile.id).select().single();
      } else {
        query = supabase.from("family_profiles").insert({
          user_id: user.id,
          name: formData.name,
          relationship: modalType === "self" ? "Self" : formData.relationship,
          dob: formData.dob,
          tob: formData.tob,
          pob: formData.pob,
          gender: formData.gender,
          // Use precise coords from autocomplete selection, or fall back to IST default
          lat: selectedGeocode?.lat ?? null,
          lng: selectedGeocode?.lon ?? null, // Supabase column is 'lng'
          timezone: selectedGeocode?.timezone ?? "+05:30",
        }).select().single();
      }

      const { data, error } = await query;

      if (!error && data) {
        if (existingProfile) {
          setFamilyProfiles(prev => prev.map(p => p.id === data.id ? data : p));
        } else {
          setFamilyProfiles(prev => [...prev, data]);
        }
        setShowProfileModal(false);
        setFormData({ name: "", relationship: "Self", dob: "", tob: "", pob: "", gender: "male" });
        setSelectedGeocode(null); // Reset geocode after save
        if (modalType === "self") {
           setActiveProfileId(data.id);
        }
      } else {
        console.error("Supabase Error saving profile:", error);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    // Make sure we have a valid profile ID before sending
    let targetProfileId = activeProfileId;
    let targetPob = "";
    if (activeProfileId === "self") {
      const selfProfile = familyProfiles.find(p => p.relationship === "Self");
      if (selfProfile) {
        targetProfileId = selfProfile.id;
        targetPob = selfProfile.pob || "";
      } else {
        setMessages(prev => [...prev, { id: newMsgId(), role: "system", content: "Please complete your birth profile onboarding first." }]);
        setShowProfileModal(true);
        return;
      }
    } else {
      const famProfile = familyProfiles.find(p => p.id === activeProfileId);
      targetPob = famProfile?.pob || "";
    }

    const userMessage = input.trim();
    setInput("");
    // Reset textarea height after clearing
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    // Tag this user message with a stable id so we can ref it and scroll to it
    // when the AI reply arrives.
    const userMsgId = newMsgId();
    setMessages(prev => [...prev, { id: userMsgId, role: "user", content: userMessage }]);
    setIsTyping(true);

    // Auto-scroll the freshly-typed question to the TOP of the viewport so the
    // user can read the AI's incoming answer top-down, naturally.
    setTimeout(() => scrollUserMessageToTop(userMsgId), 50);

    // Build the request body once — used by both the streaming path and the
    // non-streaming fallback so we cannot drift between them.
    const requestBody = {
      message: userMessage,
      profileId: targetProfileId,
      lat: geocoordCache[targetPob]?.lat,
      lon: geocoordCache[targetPob]?.lon,
      history: messages.filter(m => m.role !== "system").slice(-10),
    };

    // ── STREAMING PATH ──────────────────────────────────────────────────────
    // Hits /api/astro-chat/stream and parses Server-Sent Events. As "delta"
    // events arrive, we append text to a placeholder assistant message in
    // place — this is what gives the user the live "typing in" experience.
    // If anything goes wrong before any delta, we fall back to the one-shot
    // /api/astro-chat endpoint.
    const assistantMsgId = newMsgId();
    type StreamMeta = {
      creditsRemaining?: number;
      model?: string;
      marker?: string;
      chartCached?: boolean;
      confidence?: number;
      suggestedPrompts?: string[];
      usage?: Record<string, number>;
    };
    let streamReceivedAnyDelta = false;
    const streamState: { meta: StreamMeta | null; warning: string | null; error: string | null } = {
      meta: null, warning: null, error: null,
    };

    try {
      const res = await fetch("/api/astro-chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "text/event-stream" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok || !res.body) {
        throw new Error(`stream HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Parse SSE: events are separated by blank lines. Each event has lines
      // like "event: delta" and "data: {...}". We accumulate the data lines
      // for one event, then dispatch on the event name.
      const dispatch = (eventName: string, dataStr: string) => {
        let payload: { text?: string; systemWarning?: string; error?: string;
                       creditsRemaining?: number; model?: string; marker?: string;
                       chartCached?: boolean; confidence?: number;
                       suggestedPrompts?: string[]; usage?: Record<string, number> } = {};
        try { payload = JSON.parse(dataStr); } catch { return; }

        if (eventName === "delta" && typeof payload.text === "string") {
          const deltaText = payload.text;
          if (!streamReceivedAnyDelta) {
            streamReceivedAnyDelta = true;
            // First delta: insert the placeholder assistant message
            setMessages(prev => [...prev, { id: assistantMsgId, role: "assistant", content: deltaText }]);
          } else {
            setMessages(prev => prev.map(m => m.id === assistantMsgId
              ? { ...m, content: m.content + deltaText }
              : m
            ));
          }
        } else if (eventName === "meta") {
          streamState.meta = payload;
        } else if (eventName === "warning") {
          streamState.warning = payload.systemWarning || "Request blocked.";
        } else if (eventName === "error") {
          streamState.error = payload.error || "stream failed";
        }
      };

      // Read loop
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Split out complete SSE events on the \n\n delimiter
        let sepIdx = buffer.indexOf("\n\n");
        while (sepIdx !== -1) {
          const rawEvent = buffer.slice(0, sepIdx);
          buffer = buffer.slice(sepIdx + 2);

          let eventName = "message";
          const dataLines: string[] = [];
          for (const line of rawEvent.split("\n")) {
            if (line.startsWith(":")) continue;            // comment / heartbeat
            if (line.startsWith("event:")) eventName = line.slice(6).trim();
            else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
          }
          if (dataLines.length > 0) dispatch(eventName, dataLines.join("\n"));
          sepIdx = buffer.indexOf("\n\n");
        }
      }

      // Apply finalised metadata
      if (streamState.warning) {
        const warn = streamState.warning;
        setMessages(prev => [...prev, { id: newMsgId(), role: "system", content: warn }]);
      }
      if (streamState.error && !streamReceivedAnyDelta) {
        // Only surface error if we never got any text — otherwise the user
        // already has a partial answer and we shouldn't dump an error on top.
        throw new Error(streamState.error);
      }
      if (streamState.meta) {
        const meta = streamState.meta;
        if (meta.creditsRemaining !== undefined && profile) {
          setProfile({ ...profile, credits: meta.creditsRemaining });
        }
        // Patch marker on the just-streamed assistant message
        if (meta.marker && streamReceivedAnyDelta) {
          const markerVal = meta.marker;
          setMessages(prev => prev.map(m => m.id === assistantMsgId
            ? { ...m, marker: markerVal }
            : m
          ));
        }
        // Trigger smart suggestions using the fully-streamed reply
        if (streamReceivedAnyDelta) {
          const finalReply = (await new Promise<string>((resolve) => {
            // setMessages is async; resolve with current state via functional update
            setMessages(prev => {
              const m = prev.find(x => x.id === assistantMsgId);
              resolve(m?.content ?? "");
              return prev;
            });
          }));
          const threadForSuggester = [
            ...messages.filter(m => m.role !== "system"),
            { role: "user"      as const, content: userMessage },
            { role: "assistant" as const, content: finalReply },
          ];
          recordAskedQuestion(userMessage);
          fetchSmartSuggestions(userMessage, finalReply, threadForSuggester);
        } else {
          updateChipsFromContext(userMessage);
        }
      }

      // Re-anchor on the user's question (final position) once the stream completes
      setTimeout(() => scrollUserMessageToTop(userMsgId), 100);
    } catch (streamErr) {
      // ── FALLBACK PATH (non-streaming) ───────────────────────────────────
      // If the stream never produced any deltas, fall back to /api/astro-chat
      // for a one-shot JSON reply. If we already received some deltas before
      // the error, we keep what we have and surface a soft notice.
      if (streamReceivedAnyDelta) {
        console.warn("[CHAT] stream errored mid-flight; keeping partial reply", streamErr);
      } else {
        console.warn("[CHAT] stream failed before first delta; falling back to /api/astro-chat", streamErr);
        try {
          const res = await fetch("/api/astro-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });
          const data = await res.json();
          if (!res.ok) {
            setMessages(prev => [...prev, { id: newMsgId(), role: "system", content: data.error || "An error occurred." }]);
          } else {
            if (data.systemWarning) {
              setMessages(prev => [...prev, { id: newMsgId(), role: "system", content: data.systemWarning }]);
            }
            if (data.reply) {
              setMessages(prev => [...prev, { id: assistantMsgId, role: "assistant", content: data.reply, marker: data.marker }]);
            }
            if (data.creditsRemaining !== undefined && profile) {
              setProfile({ ...profile, credits: data.creditsRemaining });
            }
            if (data.reply) {
              const threadForSuggester = [
                ...messages.filter(m => m.role !== "system"),
                { role: "user"      as const, content: userMessage },
                { role: "assistant" as const, content: data.reply },
              ];
              recordAskedQuestion(userMessage);
              fetchSmartSuggestions(userMessage, data.reply, threadForSuggester);
            } else {
              updateChipsFromContext(userMessage);
            }
            setTimeout(() => scrollUserMessageToTop(userMsgId), 100);
          }
        } catch {
          setMessages(prev => [...prev, { id: newMsgId(), role: "system", content: "Network error. Please try again." }]);
        }
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipClick = (chip: string) => {
    // Mark this chip as "already used" so the next round of smart
    // suggestions won't recycle it.
    recordAskedQuestion(chip);
    setInput(chip);
    // Auto-send after a tiny delay for smooth UX
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      setInput(chip);
    }, 50);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleClearChat = async () => {
    if (!user || !activeProfileId) return;
    
    const confirmClear = window.confirm("Are you sure you want to clear your chat history? This will permanently delete all previous readings for this profile.");
    if (!confirmClear) return;

    let targetId: string | null = null;
    if (activeProfileId === "self") {
      const selfP = familyProfiles.find(p => p.relationship === "Self");
      targetId = selfP?.id || null;
    } else {
      targetId = activeProfileId;
    }

    if (!targetId) return;

    try {
      const res = await fetch("/api/astro-chat/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: targetId })
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to clear chat");
      }

      const userFirstName = profile?.full_name?.split(' ')[0] || user?.email?.split("@")[0] || "Seeker";
      const welcomeMsg = `Hey ${userFirstName}, I am your Quantum Karma Astrologer. What brings you here today? Ask away all your questions—I'm here to uncover the deepest truths of your chart just for you.`;

      // Reset local messages state
      setMessages([{ id: "welcome", role: "assistant", content: welcomeMsg }]);
      setSuggestionChips(INITIAL_CHIPS);
      setSmartSuggestions(false);
      askedQuestionsRef.current = new Set();
    } catch (err) {
      console.error("Failed to clear chat:", err);
      alert("Failed to clear chat history. Please try again.");
    }
  };

  // Wait for both auth AND profile data before rendering dashboard content.
  // PaymentGate does its own independent Supabase check — this guard doesn't block it.
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: PAL.paper, color: PAL.ink }}
      >
        <div className="serif-display italic" style={{ fontSize: 18, color: PAL.ink3, letterSpacing: "0.04em" }}>
          loading…
        </div>
        <SerifFonts />
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Seeker";
  const selfProfile = familyProfiles.find(p => p.relationship === "Self");
  // Zero-credit state: block all generation when user has fewer than 1 credit
  const isOutOfCredits = (profile?.credits ?? 0) < 1;
  
  let activeProfileName = "Unknown";
  if (activeProfileId === "self") {
    activeProfileName = selfProfile ? "My Chart" : "Onboarding Required";
  } else {
    activeProfileName = familyProfiles.find(p => p.id === activeProfileId)?.name || "Unknown";
  }

  return (
    <PaymentGate>
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{
        color: PAL.ink,
        background: `linear-gradient(180deg, ${PAL.paper} 0%, ${PAL.paper2} 100%)`,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Inter', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Subtle paper grain */}
      <div
        className="pointer-events-none fixed inset-0 -z-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(rgba(14,26,51,1) 1px,transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <SerifFonts />

      {/* ── Profile / Onboarding Modal — same handlers, restyled to editorial ── */}
      {showProfileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(14,26,51,0.55)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="relative w-full max-w-md rounded-sm shadow-2xl p-7 md:p-8"
            style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
              {modalType === "self" ? "Begin · Your identity" : "Add a bond"}
            </div>
            <h2 className="serif-display text-[28px] md:text-[34px] font-semibold leading-tight" style={{ color: PAL.ink }}>
              {modalType === "self" ? "Your birth coordinates." : "Their birth coordinates."}
            </h2>
            <p className="serif-text text-[14.5px] mt-2" style={{ color: PAL.ink2 }}>
              {modalType === "self"
                ? "Provide exact birth coordinates to unlock your timeline."
                : "Enter their details for accurate synastry mapping."}
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: PAL.ink3 }}>
                    Full name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-sm px-3.5 py-2.5 focus:outline-none transition-shadow serif-text text-[15px]"
                    style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: PAL.ink3 }}>
                    Gender
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-sm px-3.5 py-2.5 focus:outline-none serif-text text-[15px]"
                    style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {modalType === "family" && (
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: PAL.ink3 }}>
                    Relationship
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full rounded-sm px-3.5 py-2.5 focus:outline-none serif-text text-[15px]"
                    style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: PAL.ink3 }}>
                    Date of birth
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full rounded-sm px-3.5 py-2.5 focus:outline-none serif-text text-[15px]"
                    style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: PAL.ink3 }}>
                    Time of birth
                  </label>
                  <input
                    required
                    type="time"
                    value={formData.tob}
                    onChange={e => setFormData({ ...formData, tob: e.target.value })}
                    className="w-full rounded-sm px-3.5 py-2.5 focus:outline-none serif-text text-[15px]"
                    style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: PAL.ink3 }}>
                  Place of birth
                </label>
                <input
                  required
                  type="text"
                  value={formData.pob}
                  onChange={e => handleLocationSearch(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full rounded-sm px-3.5 py-2.5 focus:outline-none serif-text text-[15px]"
                  style={{ background: PAL.paper2, border: `1px solid ${PAL.border}`, color: PAL.ink }}
                  placeholder="e.g. Mumbai, India"
                />
                {isSearchingLocation && (
                  <div className="absolute right-3 top-[34px]">
                    <div className="w-4 h-4 rounded-full animate-spin"
                      style={{ border: `2px solid ${PAL.border}`, borderTopColor: PAL.accent }}
                    />
                  </div>
                )}
                {showSuggestions && locationSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 rounded-sm shadow-xl max-h-48 overflow-y-auto"
                    style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
                  >
                    {locationSuggestions.map((loc, idx) => (
                      <li
                        key={idx}
                        className="px-3.5 py-2.5 cursor-pointer text-[14px] serif-text transition-colors hover:bg-black/[0.04]"
                        style={{ color: PAL.ink, borderBottom: idx < locationSuggestions.length - 1 ? `1px solid ${PAL.border2}` : "none" }}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, pob: loc.Name }));
                          setSelectedGeocode({ lat: loc.lat, lon: loc.lon, timezone: loc.timezone || "+05:30" });
                          setShowSuggestions(false);
                        }}
                      >
                        {loc.Name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-sm p-3 mt-3"
                style={{ background: "rgba(165,124,42,0.08)", border: `1px solid rgba(165,124,42,0.25)` }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1 flex items-center gap-1.5" style={{ color: PAL.gold }}>
                  <AlertTriangle size={11} /> Caution
                </p>
                <p className="serif-text text-[12.5px] leading-snug" style={{ color: PAL.ink2 }}>
                  Please verify and double-check all details before saving. Vedic astrology requires absolute precision — even a 5-minute error in your time of birth can completely alter your chart and predictions.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                {modalType === "family" && (
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="flex-1 py-2.5 rounded-sm text-[13px] font-semibold transition-colors hover:bg-black/[0.04]"
                    style={{ color: PAL.ink2, border: `1px solid ${PAL.border}` }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-sm text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: PAL.ink }}
                >
                  Save blueprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Masthead (top bar) ─────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{ background: "rgba(250,247,242,0.92)", borderBottom: `1px solid ${PAL.border2}` }}
      >
        <div className="flex items-center gap-3 px-4 md:px-7 lg:px-10 h-14 md:h-16 max-w-[1400px] w-full mx-auto">
          <button
            onClick={() => setNavDrawerOpen(true)}
            className="md:hidden h-9 w-9 grid place-items-center rounded transition-colors hover:bg-black/5"
            aria-label="Menu"
          >
            <Menu size={18} style={{ color: PAL.ink }} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-sm grid place-items-center" style={{ background: PAL.ink }}>
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="serif-display text-[16px] md:text-[18px] font-semibold leading-none truncate" style={{ color: PAL.ink }}>
              Quantum Karma
            </span>
          </div>

          <span className="hidden md:inline-block text-[10px] font-semibold uppercase tracking-[0.2em] ml-3 pl-3" style={{ color: PAL.ink3, borderLeft: `1px solid ${PAL.border2}` }}>
            Vol. III · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>

          <div className="flex-1" />

          <button
            onClick={() => {
              if (activeProfileId === "self" && selfProfile) {
                setModalType("self");
                setFormData({ name: selfProfile.name, relationship: "Self", dob: selfProfile.dob, tob: selfProfile.tob, pob: selfProfile.pob, gender: selfProfile.gender || "male" });
              } else {
                const fp = familyProfiles.find(p => p.id === activeProfileId);
                if (fp) { setModalType("family"); setFormData({ name: fp.name, relationship: fp.relationship, dob: fp.dob, tob: fp.tob, pob: fp.pob, gender: fp.gender || "male" }); }
              }
              setShowProfileModal(true);
            }}
            className="md:hidden h-9 w-9 grid place-items-center rounded transition-colors hover:bg-black/5"
            title="Edit birth details"
          >
            <Pencil size={15} style={{ color: PAL.ink2 }} />
          </button>

          <button
            onClick={() => router.push("/subscription")}
            className="hidden sm:inline-flex items-center h-9 px-3 rounded-sm text-[12px] font-semibold transition-colors hover:bg-black/[0.04]"
            style={{ color: PAL.ink, border: `1px solid ${PAL.border}` }}
          >
            Subscription
          </button>

          <div className="inline-flex items-center gap-2 h-9 px-2.5 rounded-sm"
            style={{ background: PAL.paper, border: `1px solid ${PAL.border}` }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>Cr</span>
            <span className="serif-display text-[15px] font-semibold tabular-nums leading-none" style={{ color: PAL.ink }}>
              {Math.floor(profile.credits ?? 50)}
            </span>
          </div>

          {(profile.plan_type === "plan2" || profile.plan_type === "promo") && (
            <button
              onClick={() => setShowTopup(true)}
              className="hidden sm:inline-flex items-center gap-1 h-9 px-3 rounded-sm text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: PAL.accent }}
            >
              <Plus size={12} /> Top up
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 pl-3 ml-1.5" style={{ borderLeft: `1px solid ${PAL.border2}` }}>
            <span className="w-8 h-8 rounded-sm grid place-items-center font-semibold text-[12px]"
              style={{ background: PAL.ink, color: PAL.paper }}
            >
              {displayName.charAt(0).toUpperCase()}
            </span>
            <div className="hidden lg:block leading-tight">
              <div className="text-[12.5px] font-semibold" style={{ color: PAL.ink }}>{displayName}</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.accent }}>Seeker</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="h-9 w-9 grid place-items-center rounded transition-colors hover:bg-black/5"
            title="Sign out"
          >
            <LogOut size={15} style={{ color: PAL.ink2 }} />
          </button>
        </div>
      </header>

      {/* ── Body: sidebar + main ─────────────────────────────── */}
      <div className="flex-1 flex max-w-[1400px] w-full mx-auto min-h-0 relative z-10">
        <EditorialSidebar
          activeFeature={activeFeature}
          setActiveFeature={setActiveFeature}
          activeProfileId={activeProfileId}
          setActiveProfileId={setActiveProfileId}
          selfProfile={selfProfile}
          familyProfiles={familyProfiles}
          openSelfEdit={() => {
            if (selfProfile) {
              setModalType("self");
              setFormData({ name: selfProfile.name, relationship: "Self", dob: selfProfile.dob, tob: selfProfile.tob, pob: selfProfile.pob, gender: selfProfile.gender || "male" });
              setShowProfileModal(true);
            }
          }}
          openFamilyEdit={(fp: any) => {
            setModalType("family");
            setFormData({ name: fp.name, relationship: fp.relationship, dob: fp.dob, tob: fp.tob, pob: fp.pob, gender: fp.gender || "male" });
            setShowProfileModal(true);
          }}
          openAddBond={() => {
            setModalType("family");
            setFormData({ name: "", relationship: "Spouse", dob: "", tob: "", pob: "", gender: "male" });
            setShowProfileModal(true);
          }}
          credits={Math.floor(profile.credits ?? 0)}
          isOutOfCredits={isOutOfCredits}
          className="hidden md:flex"
        />

        {navDrawerOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setNavDrawerOpen(false)}>
            <div className="absolute inset-0" style={{ background: "rgba(14,26,51,0.55)" }} />
            <div onClick={(e) => e.stopPropagation()} className="relative z-10">
              <EditorialSidebar
                activeFeature={activeFeature}
                setActiveFeature={(k) => { setActiveFeature(k); setNavDrawerOpen(false); }}
                activeProfileId={activeProfileId}
                setActiveProfileId={(id) => { setActiveProfileId(id); setNavDrawerOpen(false); }}
                selfProfile={selfProfile}
                familyProfiles={familyProfiles}
                openSelfEdit={() => {
                  if (selfProfile) {
                    setModalType("self");
                    setFormData({ name: selfProfile.name, relationship: "Self", dob: selfProfile.dob, tob: selfProfile.tob, pob: selfProfile.pob, gender: selfProfile.gender || "male" });
                    setShowProfileModal(true);
                    setNavDrawerOpen(false);
                  }
                }}
                openFamilyEdit={(fp: any) => {
                  setModalType("family");
                  setFormData({ name: fp.name, relationship: fp.relationship, dob: fp.dob, tob: fp.tob, pob: fp.pob, gender: fp.gender || "male" });
                  setShowProfileModal(true);
                  setNavDrawerOpen(false);
                }}
                openAddBond={() => {
                  setModalType("family");
                  setFormData({ name: "", relationship: "Spouse", dob: "", tob: "", pob: "", gender: "male" });
                  setShowProfileModal(true);
                  setNavDrawerOpen(false);
                }}
                credits={Math.floor(profile.credits ?? 0)}
                isOutOfCredits={isOutOfCredits}
                className="flex h-[100dvh] w-[284px]"
                onClose={() => setNavDrawerOpen(false)}
              />
            </div>
          </div>
        )}

        <main
          className={
            activeFeature === "chat"
              ? "flex-1 min-w-0 flex flex-col overflow-hidden"
              : "flex-1 min-w-0 px-4 md:px-7 lg:px-10 py-6 md:py-8 pb-24 md:pb-10 overflow-y-auto"
          }
        >
          {activeFeature !== "chat" && (
            <div className="mb-6 md:mb-8">
              <DailyBriefingWidget profileId={activeProfileId} />
            </div>
          )}

          {activeFeature !== "home" && activeFeature !== "chat" && (
            <div className="hidden md:block mb-4 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>
              <button onClick={() => setActiveFeature("home")} className="hover:underline" style={{ color: PAL.accent }}>
                Home
              </button>
              <span className="mx-2" style={{ color: PAL.border }}>/</span>
              {labelOf(activeFeature)}
            </div>
          )}

          {activeFeature === "explainer" && (
            <FeatureFrame title="Explainer Masterclass" eyebrow="Section 01 · Begin">
              <ExplainerPanel profileId={activeProfileId} profileName={activeProfileName} />
            </FeatureFrame>
          )}
          {activeFeature === "destiny" && (
            <FeatureFrame title="Destiny Window" eyebrow="Section 01 · Begin">
              <DestinyCalendar profileId={activeProfileId} profileName={activeProfileName} />
            </FeatureFrame>
          )}
          {activeFeature === "karma-dna" && (
            <FeatureFrame title="Karma DNA" eyebrow="Section 02 · Blueprint">
              <KarmaDNA profileId={activeProfileId} profileName={activeProfileName} />
            </FeatureFrame>
          )}
          {activeFeature === "karmic-patterns" && (
            <FeatureFrame title="Karmic Patterns" eyebrow="Section 02 · Blueprint">
              <KarmicPatterns profileId={activeProfileId} profileName={activeProfileName} />
            </FeatureFrame>
          )}
          {activeFeature === "remedy" && (
            <FeatureFrame title="Remedy" eyebrow="Section 04 · Practice">
              <RemedyPanel profileId={activeProfileId} profileName={activeProfileName} />
            </FeatureFrame>
          )}
          {activeFeature === "roadmap" && (
            <FeatureFrame title="Roadmap" eyebrow="Section 03 · Forecast">
              <Roadmap onClose={() => setActiveFeature("home")} />
            </FeatureFrame>
          )}
          {activeFeature === "details" && (
            <FeatureFrame title="My Details" eyebrow="Section 02 · Blueprint">
              <DetailsPanel
                activeProfileId={activeProfileId}
                familyProfiles={familyProfiles}
                userEmail={user?.email ?? ""}
              />
            </FeatureFrame>
          )}
          {activeFeature === "royal-roast" && (
            <FeatureFrame title="Royal Roast" eyebrow="Section 03 · Forecast">
              <RoyalRoast
                profileId={activeProfileId === "self" ? (familyProfiles.find(p => p.relationship === "Self")?.id || "self") : activeProfileId}
                profileName={activeProfileName}
              />
            </FeatureFrame>
          )}
          {activeFeature === "gotra" && (
            <FeatureFrame title="Your Gotra" eyebrow="Section 04 · Practice">
              <YourGotra
                profileId={activeProfileId === "self" ? (familyProfiles.find(p => p.relationship === "Self")?.id || "self") : activeProfileId}
                profileName={activeProfileName}
              />
            </FeatureFrame>
          )}
          {activeFeature === "ishta-devata" && (
            <FeatureFrame title="Ishta Devata" eyebrow="Section 04 · Practice">
              <IshtaDevata
                profileId={activeProfileId === "self" ? (familyProfiles.find(p => p.relationship === "Self")?.id || "self") : activeProfileId}
                profileName={activeProfileName}
              />
            </FeatureFrame>
          )}
          {activeFeature === "journal" && (
            <FeatureFrame title="Life Journal" eyebrow="Section 04 · Practice">
              <LifeJournal
                activeProfileId={activeProfileId === "self" ? (familyProfiles.find(p => p.relationship === "Self")?.id || "self") : activeProfileId}
              />
            </FeatureFrame>
          )}
          {activeFeature === "reports" && (
            <FeatureFrame title="Reports" eyebrow="Section 05 · Archive">
              <ReportsPanel
                profileId={activeProfileId === "self" ? (familyProfiles.find(p => p.relationship === "Self")?.id || "self") : activeProfileId}
              />
            </FeatureFrame>
          )}
          {activeFeature === "soul-code" && (
            <FeatureFrame title="Your Purpose" eyebrow="Section 02 · Blueprint">
              <SoulCodePanel
                profileId={activeProfileId === "self" ? (familyProfiles.find(p => p.relationship === "Self")?.id || "self") : activeProfileId}
              />
            </FeatureFrame>
          )}
          {activeFeature === "year-ahead" && (
            <FeatureFrame title="Year Ahead" eyebrow="Section 03 · Forecast">
              <YearAheadPanel
                profileId={activeProfileId === "self" ? (familyProfiles.find(p => p.relationship === "Self")?.id || "self") : activeProfileId}
              />
            </FeatureFrame>
          )}
          {activeFeature === "compatibility" && (
            <FeatureFrame title="Compatibility" eyebrow="Section 06 · Bonds">
              <Compatibility selfProfile={selfProfile} />
            </FeatureFrame>
          )}

          {activeFeature === "chat" && (
            <OracleChatPanel
              messages={messages}
              isTyping={isTyping}
              input={input}
              setInput={setInput}
              autoResize={autoResize}
              handleSendMessage={handleSendMessage}
              handleClearChat={handleClearChat}
              handleChipClick={handleChipClick}
              suggestionChips={suggestionChips}
              smartSuggestions={smartSuggestions}
              suggestionsLoading={suggestionsLoading}
              chatContainerRef={chatContainerRef}
              messagesEndRef={messagesEndRef}
              textareaRef={textareaRef}
              userMsgRefs={userMsgRefs}
              showJumpToLatest={showJumpToLatest}
              onJumpToLatest={scrollToBottom}
              displayName={displayName}
              activeProfileName={activeProfileName}
              selfProfile={selfProfile}
              activeProfileId={activeProfileId}
              isOutOfCredits={isOutOfCredits}
              profile={profile}
              setShowTopup={setShowTopup}
              onBackToHome={() => setActiveFeature("home")}
              onOpenMenu={() => setNavDrawerOpen(true)}
              onOpenImportant={() => setShowImportantNote(true)}
            />
          )}

          {activeFeature === "home" && (
            <div className="space-y-7 md:space-y-9">
              <section className="pt-2 pb-6 md:pb-8" style={{ borderBottom: `1px solid ${PAL.border}` }}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: PAL.accent }}>
                  Welcome back
                </div>
                <h1 className="serif-display text-[36px] md:text-[58px] lg:text-[72px] font-semibold leading-[0.98] tracking-tight" style={{ color: PAL.ink }}>
                  Hello, <span style={{ color: PAL.accent }}>{displayName.split(" ")[0]}</span>.
                </h1>
                <p className="serif-text text-[16px] md:text-[18px] mt-3 max-w-2xl leading-snug" style={{ color: PAL.ink2 }}>
                  Your blueprint is below. The Oracle is ready to read it with you.
                  Pick a section to begin or scroll for the full table of contents.
                </p>
              </section>

              <section>
                <SectionHeading num="—" title="Featured for you" hint="Hand-picked from your chart" />
                <div className="md:hidden -mx-4 px-4">
                  <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-3 -mb-3">
                    {(["explainer", "destiny", "karma-dna", "year-ahead", "royal-roast", "soul-code"] as FeatureKey[])
                      .map((k) => {
                        const f = FEATURE_META.find(x => x.key === k); if (!f) return null;
                        return <BentoCard key={k} f={f} onOpen={setActiveFeature} className="snap-start min-w-[78%]" locked={isOutOfCredits && f.premium} />;
                      })}
                  </div>
                </div>
                <div className="hidden md:grid grid-cols-12 gap-4">
                  {[
                    { k: "explainer",   span: "col-span-7 row-span-2", tall: true },
                    { k: "destiny",     span: "col-span-5",            tall: false },
                    { k: "karma-dna",   span: "col-span-5",            tall: false },
                    { k: "year-ahead",  span: "col-span-4",            tall: false },
                    { k: "royal-roast", span: "col-span-4",            tall: false },
                    { k: "soul-code",   span: "col-span-4",            tall: false },
                  ].map(({ k, span, tall }) => {
                    const f = FEATURE_META.find(x => x.key === k as FeatureKey); if (!f) return null;
                    return <BentoCard key={k} f={f} onOpen={setActiveFeature} className={span} tall={tall} locked={isOutOfCredits && f.premium} />;
                  })}
                </div>
              </section>

              <section>
                <SectionHeading num="—" title="Ask the Oracle" hint="Quick prompts you can run now" />
                {!isOutOfCredits && (
                  <ChatChipsRow
                    chips={suggestionChips}
                    onChipClick={handleChipClick}
                    variant="comfy"
                    smartBadge={smartSuggestions}
                    loading={suggestionsLoading && suggestionChips.length === 0}
                    palette={{
                      bg:          PAL.paper2,
                      border:      PAL.border2,
                      ink:         PAL.ink,
                      accent:      PAL.accent,
                      arrowBg:     PAL.paper,
                      arrowInk:    PAL.ink,
                      arrowBorder: PAL.border,
                      paperBg:     PAL.paper,
                    }}
                  />
                )}
                {isOutOfCredits && (
                  <div className="rounded-sm p-5"
                    style={{ background: "rgba(165,124,42,0.08)", border: `1px solid ${PAL.border}` }}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.gold }}>
                      Out of credits
                    </div>
                    <p className="serif-text text-[15px] leading-snug" style={{ color: PAL.ink }}>
                      You've used all your readings for this cycle. Past chats and saved reports remain accessible. Top up to continue.
                    </p>
                    {(profile?.plan_type === "plan2" || profile?.plan_type === "promo") && (
                      <button
                        onClick={() => setShowTopup(true)}
                        className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-sm text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: PAL.accent }}
                      >
                        <Plus size={13} /> Top up now
                      </button>
                    )}
                  </div>
                )}
              </section>

              <section>
                <SectionHeading num="—" title="Open Oracle Chat" hint="Your full conversation space" />
                <button
                  onClick={() => setActiveFeature("chat")}
                  className="group w-full text-left rounded-sm p-6 md:p-8 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${PAL.paper} 0%, ${PAL.paper2} 100%)`,
                    border: `1px solid ${PAL.border}`,
                  }}
                >
                  <div className="flex items-start gap-5">
                    <span className="w-14 h-14 md:w-16 md:h-16 rounded-sm grid place-items-center flex-shrink-0 shadow-md"
                      style={{ background: PAL.ink }}
                    >
                      <Sparkles size={22} className="text-white" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: PAL.ink2 }}>
                          Live · cites D1 – D60 · Reading {activeProfileName}
                        </span>
                      </div>
                      <h3 className="serif-display text-[26px] md:text-[34px] font-semibold leading-tight tracking-tight" style={{ color: PAL.ink }}>
                        Talk to your <span style={{ color: PAL.accent }}>Quantum Oracle</span>.
                      </h3>
                      <p className="serif-text text-[14.5px] md:text-[16px] mt-2 max-w-2xl leading-snug" style={{ color: PAL.ink2 }}>
                        Open a full-height conversation. Ask anything about your chart, timing windows, karmic patterns. The Oracle reads your blueprint live.
                      </p>
                      <span
                        className="mt-5 inline-flex items-center gap-2 h-11 md:h-12 px-5 rounded-sm text-white text-[13px] md:text-[14px] font-semibold transition-transform group-hover:translate-x-0.5"
                        style={{ background: PAL.accent }}
                      >
                        <MessageCircle size={15} /> Open Oracle Chat
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </button>
              </section>

              <section>
                <SectionHeading num="—" title="In this issue" hint={`${FEATURE_META.length} readings · ordered by section`} />
                <div className="space-y-10 md:space-y-12">
                  {NAV_SECTIONS.map((sec) => {
                    const items = sec.keys.map(k => FEATURE_META.find(f => f.key === k)).filter(Boolean) as FeatureMeta[];
                    if (items.length === 0) return null;
                    return (
                      <article key={sec.num} className="grid md:grid-cols-12 gap-5 md:gap-10">
                        <header className="md:col-span-3">
                          <div className="serif-display italic text-[24px] md:text-[32px] font-medium leading-none" style={{ color: PAL.accent }}>
                            {sec.num}
                          </div>
                          <h3 className="serif-display text-[22px] md:text-[26px] font-semibold leading-tight mt-2" style={{ color: PAL.ink }}>
                            {sec.title}
                          </h3>
                        </header>
                        <ul className="md:col-span-9 md:border-l md:pl-10 divide-y" style={{ borderColor: PAL.border }}>
                          {items.map((f, i) => {
                            const Icon = f.Icon;
                            const locked = isOutOfCredits && f.premium;
                            return (
                              <li key={f.key} style={{ borderColor: PAL.border2 }}>
                                <button
                                  onClick={() => setActiveFeature(f.key)}
                                  className="group w-full grid grid-cols-[auto_1fr_auto] items-baseline gap-4 md:gap-6 py-4 md:py-5 text-left transition-colors hover:bg-black/[0.015]"
                                >
                                  <span className="serif-display italic text-[14px] md:text-[16px] tabular-nums" style={{ color: PAL.accent }}>
                                    {sec.num}.{String(i + 1).padStart(2, "0")}
                                  </span>
                                  <div>
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                      <Icon size={14} className="flex-shrink-0" style={{ color: PAL.ink3 }} />
                                      <h4 className="serif-display text-[19px] md:text-[22px] font-semibold leading-tight tracking-tight" style={{ color: PAL.ink }}>
                                        {f.label}
                                      </h4>
                                      {f.badge && (
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
                                          style={{ color: PAL.accent, border: `1px solid ${PAL.border}` }}
                                        >
                                          {f.badge}
                                        </span>
                                      )}
                                      {locked && (
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: PAL.gold }}>
                                          🔒 Top up
                                        </span>
                                      )}
                                    </div>
                                    <p className="serif-text text-[13.5px] md:text-[14.5px] mt-1 leading-snug max-w-2xl" style={{ color: PAL.ink2 }}>
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
                  })}
                </div>
              </section>

              <section className="py-8 md:py-12 my-2"
                style={{ borderTop: `1px solid ${PAL.border}`, borderBottom: `1px solid ${PAL.border}` }}
              >
                <blockquote className="max-w-3xl mx-auto text-center px-2">
                  <p className="serif-display italic text-[24px] md:text-[34px] font-medium leading-[1.15]" style={{ color: PAL.ink }}>
                    "The chart is not your fate.
                    It is the timing of your <span style={{ color: PAL.accent }}>arrivals</span>."
                  </p>
                  <footer className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: PAL.ink3 }}>
                    A line from your karmic blueprint
                  </footer>
                </blockquote>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom tab bar — hidden when Oracle Chat is open (chat owns the screen) */}
      {activeFeature !== "chat" && (
      <nav
        className="md:hidden fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)]"
        style={{ background: PAL.paper, borderTop: `1px solid ${PAL.border}` }}
      >
        <div className="grid grid-cols-5">
          {[
            { key: "home" as FeatureKey,       label: "Home",    Icon: Sparkles },
            { key: "chat" as FeatureKey,       label: "Oracle",  Icon: MessageCircle },
            { key: "destiny" as FeatureKey,    label: "Destiny", Icon: Calendar },
            { key: "year-ahead" as FeatureKey, label: "Year",    Icon: Compass  },
            { key: "menu",                     label: "Index",   Icon: Menu, onClick: () => setNavDrawerOpen(true) },
          ].map((it: any) => {
            const isActive = activeFeature === it.key;
            return (
              <button
                key={it.label}
                onClick={() => (it.onClick ? it.onClick() : setActiveFeature(it.key))}
                className="relative flex flex-col items-center justify-center py-2.5 transition-colors"
                style={{
                  color: isActive ? PAL.ink : PAL.ink3,
                  background: isActive ? "rgba(123,10,31,0.04)" : "transparent",
                }}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8" style={{ background: PAL.accent }} />
                )}
                <it.Icon size={17} />
                <span className="serif-display text-[11px] font-semibold tracking-tight mt-0.5">{it.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      )}

      {profile && showTopup && (
        <TopupModal
          isOpen={showTopup}
          onClose={() => setShowTopup(false)}
          currentCredits={profile.credits ?? 0}
          userEmail={user?.email ?? ""}
          onSuccess={(newTotal) => {
            setProfile((prev: any) => ({ ...prev, credits: newTotal }));
            setShowTopup(false);
          }}
        />
      )}

      <ImportantNoteModal
        open={showImportantNote}
        onClose={() => setShowImportantNote(false)}
        userName={profile?.full_name || user?.email?.split("@")[0] || null}
        palette={{
          paper:   PAL.paper,
          paper2:  PAL.paper2,
          ink:     PAL.ink,
          ink2:    PAL.ink2,
          ink3:    PAL.ink3,
          border:  PAL.border,
          border2: PAL.border2,
          accent:  PAL.accent,
          gold:    PAL.gold,
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scroll-light::-webkit-scrollbar { width: 6px; }
        .custom-scroll-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll-light::-webkit-scrollbar-thumb { background: ${PAL.border2}; border-radius: 999px; }
        .custom-scroll-light::-webkit-scrollbar-thumb:hover { background: ${PAL.border}; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .prose-editorial { font-family: 'Source Serif 4', Georgia, serif; font-size: 15.5px; line-height: 1.6; color: ${PAL.ink}; }
        .prose-editorial p { margin-bottom: 0.75em; }
        .prose-editorial p:last-child { margin-bottom: 0; }
        .prose-editorial strong { color: ${PAL.ink}; font-weight: 600; }
        .prose-editorial em { color: ${PAL.accent}; font-style: italic; }
        .prose-editorial ul { list-style-type: disc; padding-left: 1.4em; margin-bottom: 0.75em; }
        .prose-editorial ol { list-style-type: decimal; padding-left: 1.4em; margin-bottom: 0.75em; }
        .prose-editorial li { margin-bottom: 0.25em; }
        .prose-editorial h1, .prose-editorial h2, .prose-editorial h3 {
          font-family: 'Fraunces', Georgia, serif;
          color: ${PAL.ink};
          font-weight: 600;
          letter-spacing: -0.01em;
          margin-top: 1.25em;
          margin-bottom: 0.5em;
        }
        .prose-editorial h3 { font-size: 1.18em; }
        .prose-editorial blockquote {
          border-left: 2px solid ${PAL.accent};
          padding-left: 1em;
          font-family: 'Fraunces', Georgia, serif;
          font-style: italic;
          color: ${PAL.ink};
          margin: 0.75em 0;
        }
        .prose-editorial code {
          font-family: ui-monospace, 'SF Mono', monospace;
          font-size: 0.92em;
          background: ${PAL.paper2};
          color: ${PAL.ink};
          padding: 1px 6px;
          border: 1px solid ${PAL.border2};
          border-radius: 3px;
        }
        @keyframes qk-progress {
          0%   { width: 12%; margin-left: 0%;  }
          50%  { width: 55%; margin-left: 22%; }
          100% { width: 12%; margin-left: 0%;  }
        }
        .qk-progress-bar { animation: qk-progress 2.8s ease-in-out infinite; }
        @media (max-width: 767px) {
          .custom-scroll-light {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
          }
        }
      `}} />
    </div>
    </PaymentGate>
  );
}

/* ───────────────────────────────────────────────────────────────── */
/* ── Helpers (kept inside the file so we don't introduce new modules) ── */
/* ───────────────────────────────────────────────────────────────── */

function labelOf(key: string): string {
  return FEATURE_META.find(f => f.key === (key as FeatureKey))?.label ?? "Reading";
}

function SerifFonts() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap');
      .serif-display { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; font-feature-settings: 'ss01','liga'; letter-spacing: -0.02em; }
      .serif-text    { font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif; }
    `}} />
  );
}

function SectionHeading({ num, title, hint }: { num: string; title: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between mb-4 md:mb-5 px-1">
      <div>
        <div className="serif-display italic text-[14px] md:text-[16px]" style={{ color: PAL.accent }}>
          {num}
        </div>
        <h3 className="serif-display text-[22px] md:text-[28px] font-semibold tracking-tight leading-none mt-1" style={{ color: PAL.ink }}>
          {title}
        </h3>
        {hint && <p className="serif-text text-[13px] mt-1" style={{ color: PAL.ink2 }}>{hint}</p>}
      </div>
    </div>
  );
}

function BentoCard({
  f, onOpen, className = "", tall = false, locked = false,
}: {
  f: FeatureMeta;
  onOpen: (k: FeatureKey) => void;
  className?: string;
  tall?: boolean;
  locked?: boolean;
}) {
  const a = BENTO_ACCENT[f.accent];
  const Icon = f.Icon;
  return (
    <button
      onClick={() => onOpen(f.key)}
      className={`group relative overflow-hidden rounded-sm text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${className}`}
      style={{ background: a.bg, border: `1px solid ${PAL.border}` }}
    >
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 20%,rgba(0,0,0,0.4) 1px,transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className={`relative flex flex-col justify-between p-5 md:p-6 ${tall ? "min-h-[280px] md:min-h-[300px]" : "min-h-[180px] md:min-h-[200px]"}`}>
        <div>
          <div className="flex items-center justify-between">
            <span className="inline-grid place-items-center w-12 h-12 rounded-sm bg-white/70 backdrop-blur-sm shadow-sm">
              <Icon size={18} style={{ color: a.ink }} />
            </span>
            <div className="flex items-center gap-1.5">
              {f.badge && (
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm bg-white/80"
                  style={{ color: a.ink }}
                >
                  {f.badge}
                </span>
              )}
              {locked && (
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm bg-white/80"
                  style={{ color: PAL.gold }}
                >
                  Top up
                </span>
              )}
            </div>
          </div>
          <div className={`mt-4 serif-display ${tall ? "text-[26px] md:text-[34px]" : "text-[20px] md:text-[22px]"} font-semibold tracking-tight leading-tight`}
            style={{ color: a.ink }}
          >
            {f.label}
          </div>
          <p className={`mt-1.5 serif-text ${tall ? "text-[14px] md:text-[15px]" : "text-[12.5px]"} leading-snug max-w-md`}
            style={{ color: a.ink, opacity: 0.85 }}
          >
            {f.hint}
          </p>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold px-3 py-1.5 rounded-sm bg-white/80"
            style={{ color: a.ink }}
          >
            Open <ArrowRight size={12} />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: a.ink, opacity: 0.7 }}
          >
            ~5 credits
          </span>
        </div>
      </div>
    </button>
  );
}

function FeatureFrame({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <article>
      <header className="pb-5 md:pb-7 mb-5 md:mb-7" style={{ borderBottom: `1px solid ${PAL.border}` }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
          {eyebrow}
        </div>
        <h1 className="serif-display text-[34px] md:text-[48px] lg:text-[56px] font-semibold leading-[0.98] tracking-tight" style={{ color: PAL.ink }}>
          {title}.
        </h1>
      </header>
      <div className="rounded-sm" style={{ background: PAL.paper, border: `1px solid ${PAL.border2}` }}>
        {children}
      </div>
    </article>
  );
}

function EditorialSidebar({
  activeFeature, setActiveFeature,
  activeProfileId, setActiveProfileId,
  selfProfile, familyProfiles,
  openSelfEdit, openFamilyEdit, openAddBond,
  credits, isOutOfCredits,
  className = "", onClose,
}: {
  activeFeature: string;
  setActiveFeature: (k: FeatureKey) => void;
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  selfProfile: any;
  familyProfiles: any[];
  openSelfEdit: () => void;
  openFamilyEdit: (fp: any) => void;
  openAddBond: () => void;
  credits: number;
  isOutOfCredits: boolean;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <aside
      className={`flex-shrink-0 w-[284px] flex-col ${onClose ? "" : "self-start sticky top-16 h-[calc(100dvh-4rem)]"} ${className}`}
      style={{ background: PAL.paper, borderRight: `1px solid ${PAL.border2}` }}
      data-lenis-prevent
    >
      {onClose && (
        <div className="flex items-center justify-between px-5 pt-4 md:hidden">
          <span className="serif-display text-[14px] font-semibold" style={{ color: PAL.ink }}>Index</span>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded hover:bg-black/5">
            <X size={16} style={{ color: PAL.ink }} />
          </button>
        </div>
      )}

      <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${PAL.border2}` }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2.5" style={{ color: PAL.ink3 }}>
          Reading for
        </div>
        <div className="space-y-1">
          <div className="relative group">
            <button
              onClick={() => setActiveProfileId("self")}
              className="w-full flex items-center gap-3 py-2 pr-9 transition-opacity hover:opacity-80 text-left"
            >
              <span className="w-8 h-8 rounded-sm grid place-items-center font-semibold text-[13px] flex-shrink-0"
                style={{
                  background: activeProfileId === "self" ? PAL.ink : PAL.border2,
                  color: activeProfileId === "self" ? PAL.paper : PAL.ink,
                }}
              >
                {(selfProfile?.name || "Y").charAt(0).toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold serif-text truncate" style={{ color: PAL.ink }}>
                  My Blueprint
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>
                  Self
                </div>
              </div>
              {activeProfileId === "self" && (
                <span className="text-[10px] uppercase tracking-[0.14em] font-semibold absolute right-9 top-1/2 -translate-y-1/2" style={{ color: PAL.accent }}>
                  Active
                </span>
              )}
            </button>
            {selfProfile && (
              <button
                onClick={openSelfEdit}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded transition-colors hover:bg-black/5"
                title="Edit birth details"
              >
                <Pencil size={11} style={{ color: PAL.ink3 }} />
              </button>
            )}
          </div>

          {familyProfiles.filter(p => p.relationship !== "Self").map(fp => (
            <div key={fp.id} className="relative group">
              <button
                onClick={() => setActiveProfileId(fp.id)}
                className="w-full flex items-center gap-3 py-2 pr-9 transition-opacity hover:opacity-80 text-left"
              >
                <span className="w-8 h-8 rounded-sm grid place-items-center font-semibold text-[13px] flex-shrink-0"
                  style={{
                    background: activeProfileId === fp.id ? PAL.ink : PAL.border2,
                    color: activeProfileId === fp.id ? PAL.paper : PAL.ink,
                  }}
                >
                  {fp.name.charAt(0).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold serif-text truncate" style={{ color: PAL.ink }}>
                    {fp.name}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.ink3 }}>
                    {fp.relationship}
                  </div>
                </div>
                {activeProfileId === fp.id && (
                  <span className="text-[10px] uppercase tracking-[0.14em] font-semibold absolute right-9 top-1/2 -translate-y-1/2" style={{ color: PAL.accent }}>
                    Active
                  </span>
                )}
              </button>
              <button
                onClick={() => openFamilyEdit(fp)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded transition-colors hover:bg-black/5"
                title="Edit birth details"
              >
                <Pencil size={11} style={{ color: PAL.ink3 }} />
              </button>
            </div>
          ))}

          <button
            onClick={openAddBond}
            className="w-full flex items-center gap-3 py-2 hover:opacity-80 transition-opacity"
          >
            <span className="w-8 h-8 rounded-sm grid place-items-center" style={{ background: PAL.border2, color: PAL.ink2 }}>
              <Plus size={14} />
            </span>
            <span className="text-[13.5px] font-semibold serif-text" style={{ color: PAL.ink2 }}>
              Add a bond
            </span>
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 pt-5 pb-3 custom-scroll-light">
        <SidebarBtn
          label="Home"
          mono="—"
          active={activeFeature === "home"}
          onClick={() => setActiveFeature("home")}
        />
        {NAV_SECTIONS.map((sec) => (
          <div key={sec.num} className="mt-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="serif-display text-[11px] tabular-nums italic" style={{ color: PAL.accent }}>
                {sec.num}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.ink3 }}>
                {sec.title}
              </span>
            </div>
            <div>
              {sec.keys.map((k) => {
                const f = FEATURE_META.find(x => x.key === k);
                if (!f) return null;
                const Icon = f.Icon;
                return (
                  <SidebarBtn
                    key={f.key}
                    icon={<Icon size={13} />}
                    label={f.label}
                    badge={f.badge}
                    locked={isOutOfCredits && f.premium}
                    active={activeFeature === f.key}
                    onClick={() => setActiveFeature(f.key)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 space-y-3" style={{ borderTop: `1px solid ${PAL.border2}` }}>
        <div className="rounded-sm p-3" style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: PAL.ink3 }}>Credits</span>
            <span className="text-[12px] font-semibold tabular-nums" style={{ color: PAL.ink }}>{credits}</span>
          </div>
          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: PAL.border2 }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (credits / 50) * 100)}%`, background: PAL.accent }} />
          </div>
        </div>
        <div className="rounded-sm px-3 py-2.5" style={{ background: "rgba(165,124,42,0.08)", border: `1px solid rgba(165,124,42,0.18)` }}>
          <div className="flex items-start gap-2">
            <AlertTriangle size={11} className="flex-shrink-0 mt-0.5" style={{ color: PAL.gold }} />
            <p className="serif-text text-[11.5px] leading-snug" style={{ color: PAL.ink2 }}>
              Complex queries consume multiple credits. Stay focused.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarBtn({
  icon, label, active, onClick, badge, mono, locked,
}: {
  icon?: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
  mono?: string;
  locked?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-2.5 py-1.5 text-left transition-colors"
      style={{ color: active ? PAL.ink : PAL.ink2 }}
    >
      {mono ? (
        <span className="serif-display text-[12px] w-5 text-center italic" style={{ color: active ? PAL.accent : PAL.ink3 }}>
          {mono}
        </span>
      ) : icon ? (
        <span className="w-5 grid place-items-center" style={{ color: active ? PAL.accent : PAL.ink3 }}>
          {icon}
        </span>
      ) : (
        <span className="w-5" />
      )}
      <span
        className="flex-1 truncate font-semibold serif-text text-[13.5px]"
        style={{
          textDecoration: active ? "underline" : "none",
          textDecorationThickness: "1px",
          textUnderlineOffset: "4px",
          textDecorationColor: PAL.accent,
        }}
      >
        {label}
      </span>
      {locked && (
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.gold }}>🔒</span>
      )}
      {badge && (
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em]" style={{ color: PAL.accent }}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* ───────────────────────────────────────────────────────────────── */
/* ── Oracle Chat — dedicated full-height conversation panel ────── */
/* ───────────────────────────────────────────────────────────────── */
function OracleChatPanel({
  messages, isTyping, input, setInput, autoResize,
  handleSendMessage, handleClearChat, handleChipClick, suggestionChips,
  smartSuggestions, suggestionsLoading,
  chatContainerRef, messagesEndRef, textareaRef, userMsgRefs,
  showJumpToLatest, onJumpToLatest,
  displayName, activeProfileName, selfProfile, activeProfileId,
  isOutOfCredits, profile, setShowTopup, onBackToHome, onOpenMenu, onOpenImportant,
}: {
  messages: { id: string; role: "user" | "assistant" | "system"; content: string; marker?: string }[];
  isTyping: boolean;
  input: string;
  setInput: (s: string) => void;
  autoResize: () => void;
  handleSendMessage: (e?: React.FormEvent) => Promise<void> | void;
  handleClearChat: () => void;
  handleChipClick: (s: string) => void;
  suggestionChips: string[];
  smartSuggestions: boolean;
  suggestionsLoading: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  userMsgRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  showJumpToLatest: boolean;
  onJumpToLatest: () => void;
  displayName: string;
  activeProfileName: string;
  selfProfile: any;
  activeProfileId: string;
  isOutOfCredits: boolean;
  profile: any;
  setShowTopup: (b: boolean) => void;
  onBackToHome: () => void;
  onOpenMenu: () => void;
  onOpenImportant: () => void;
}) {
  const composerDisabled = isTyping || (!selfProfile && activeProfileId === "self");
  const placeholder = (!selfProfile && activeProfileId === "self")
    ? "Setup your profile to begin…"
    : "Ask the Oracle anything about your chart…";

  return (
    <div
      className="
        flex flex-col flex-1 min-h-0
        fixed inset-0 z-40
        md:static md:z-auto
        md:rounded-sm md:m-6 lg:m-8 md:overflow-hidden md:shadow-[0_2px_24px_-8px_rgba(15,23,42,0.10)]
      "
      style={{ background: PAL.paper, border: undefined }}
    >
      {/* Desktop: bordered card */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .oracle-card-frame { border: 1px solid ${PAL.border2}; }
        }
      `}} />

      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="oracle-card-frame flex items-center gap-3 px-4 md:px-7 lg:px-9 h-14 md:h-16 flex-shrink-0 sticky top-0 z-10"
        style={{ background: PAL.paper, borderBottom: `1px solid ${PAL.border2}` }}
      >
        {/* Mobile back */}
        <button
          onClick={onBackToHome}
          className="md:hidden h-9 w-9 grid place-items-center rounded transition-colors hover:bg-black/5"
          aria-label="Back to home"
        >
          <ArrowLeft size={18} style={{ color: PAL.ink }} />
        </button>

        {/* Avatar + title */}
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-10 h-10 md:w-11 md:h-11 rounded-sm grid place-items-center flex-shrink-0 shadow-md"
            style={{ background: PAL.ink }}
          >
            <Sparkles size={16} className="text-white" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="serif-display text-[18px] md:text-[22px] font-semibold leading-none tracking-tight truncate" style={{ color: PAL.ink }}>
                Quantum Oracle
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] truncate" style={{ color: PAL.ink2 }}>
                Live · Reading {activeProfileName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Clear */}
        <button
          onClick={handleClearChat}
          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-sm text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-black/[0.04]"
          style={{ color: PAL.ink2, border: `1px solid ${PAL.border}` }}
          title="Clear chat history"
        >
          <Trash2 size={12} /> Clear
        </button>
        <button
          onClick={handleClearChat}
          className="sm:hidden h-9 w-9 grid place-items-center rounded transition-colors hover:bg-black/5"
          aria-label="Clear chat history"
        >
          <Trash2 size={15} style={{ color: PAL.ink2 }} />
        </button>

        {/* Mobile menu */}
        <button
          onClick={onOpenMenu}
          className="md:hidden h-9 w-9 grid place-items-center rounded transition-colors hover:bg-black/5"
          aria-label="Open menu"
        >
          <Menu size={17} style={{ color: PAL.ink }} />
        </button>
      </header>

      {/* ── Messages area ──────────────────────────────────── */}
      <div
        data-lenis-prevent
        ref={chatContainerRef}
        className="oracle-card-frame flex-1 overflow-y-auto custom-scroll-light"
        style={{ borderLeft: undefined, borderRight: undefined }}
      >
        <div className="max-w-[760px] mx-auto px-5 md:px-8 py-7 md:py-10 space-y-7 md:space-y-9">
          {messages.length <= 1 && !isTyping && (
            <div className="pb-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: PAL.accent }}>
                Begin a reading
              </div>
              <h2 className="serif-display text-[28px] md:text-[40px] font-semibold leading-[1.05] tracking-tight" style={{ color: PAL.ink }}>
                Hello, <span style={{ color: PAL.accent }}>{displayName.split(" ")[0]}</span>.
                <br className="hidden md:block" />
                What would you like the Oracle to read?
              </h2>
              <p className="serif-text text-[15px] md:text-[16.5px] mt-3 leading-snug" style={{ color: PAL.ink2 }}>
                Ask anything about your chart, timing windows, karmic patterns, relationships, or career. The Oracle cites D1 through D60 with every answer.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={msg.id ?? idx}
              ref={msg.role === "user" ? (el) => { userMsgRefs.current[msg.id] = el; } : undefined}
              className={`flex animate-fade-in ${msg.role === "system" ? "justify-center" : msg.role === "user" ? "justify-end" : "items-start gap-3 md:gap-4"}`}
            >
              {msg.role === "system" ? (
                <div className="rounded-sm py-1.5 px-4 text-[12.5px] serif-text"
                  style={{ background: PAL.paper2, color: PAL.ink2, border: `1px solid ${PAL.border2}` }}
                >
                  {msg.content}
                </div>
              ) : msg.role === "user" ? (
                <div
                  className="max-w-[88%] md:max-w-[80%] rounded-sm rounded-tr-none px-5 py-3.5 md:px-6 md:py-4 text-white shadow-sm"
                  style={{ background: PAL.ink }}
                >
                  <p className="text-[15.5px] md:text-[16px] leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
                </div>
              ) : (
                <>
                  <span
                    className="w-10 h-10 md:w-11 md:h-11 rounded-sm grid place-items-center flex-shrink-0 mt-0.5 shadow-sm"
                    style={{ background: PAL.ink }}
                  >
                    <Sparkles size={16} className="text-white" />
                  </span>
                  <div className="flex-1 min-w-0 max-w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.accent }}>
                        Oracle
                      </span>
                      {msg.marker && (
                        <span
                          className="text-[9px] font-semibold tracking-[0.18em] px-1.5 py-0.5 rounded-sm"
                          style={{ color: PAL.ink, border: `1px solid ${PAL.border}`, background: PAL.paper2 }}
                        >
                          ✦ Verified
                        </span>
                      )}
                    </div>
                    <div
                      className="prose-editorial rounded-sm px-5 py-4 md:px-6 md:py-5"
                      style={{
                        background: PAL.paper2,
                        border: `1px solid ${PAL.border2}`,
                      }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 md:gap-4 items-start animate-fade-in">
              <span
                className="w-10 h-10 md:w-11 md:h-11 rounded-sm grid place-items-center flex-shrink-0 mt-0.5 shadow-sm"
                style={{ background: PAL.ink }}
              >
                <Sparkles size={16} className="text-white" />
              </span>
              <div
                className="flex-1 min-w-0 rounded-sm p-5 md:p-6"
                style={{ background: PAL.paper2, border: `1px solid ${PAL.border2}` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: PAL.accent }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: PAL.accent }} />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: PAL.accent }}>
                    Live cosmic computation
                  </span>
                </div>
                <p className="serif-text text-[16px] font-semibold mb-1" style={{ color: PAL.ink }}>
                  Unlocking your blueprint, {displayName.split(" ")[0]}…
                </p>
                <p className="serif-text text-[13px] leading-snug" style={{ color: PAL.ink2 }}>
                  Cross-referencing all 16 divisional charts, active Dasha layers, karmic echoes &amp; live transits.
                </p>
                <div className="mt-4 h-[2px] rounded-full overflow-hidden" style={{ background: PAL.border2 }}>
                  <div
                    className="h-full rounded-full qk-progress-bar"
                    style={{ background: `linear-gradient(90deg, ${PAL.accent}, ${PAL.gold}, ${PAL.accent})` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* ── "Jump to latest" pill — sits above composer when user has scrolled up ── */}
      <div className="relative">
        {showJumpToLatest && (
          <button
            type="button"
            onClick={onJumpToLatest}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold shadow-md transition-all hover:scale-105 active:scale-95 animate-fade-in"
            style={{
              background: PAL.ink,
              color: "#fff",
              border: `1px solid ${PAL.border}`,
            }}
            aria-label="Jump to latest message"
          >
            <ChevronDown size={14} />
            Jump to latest
          </button>
        )}

        {/* ── Composer ───────────────────────────────────────── */}
        <div
          className="oracle-card-frame flex-shrink-0 px-3 md:px-6 lg:px-8 pt-3 md:pt-4 pb-[max(env(safe-area-inset-bottom),12px)] md:pb-5"
          style={{ background: PAL.paper, borderTop: `1px solid ${PAL.border2}` }}
        >
        <div className="max-w-[760px] mx-auto">
          {/* Suggestion chips — horizontally scrollable with prev/next arrows.
              Smart-suggestions badge appears when the LLM-generated chips are
              served. Falls back gracefully to keyword chips if the suggestion
              endpoint is slow or unavailable. */}
          {!isOutOfCredits && (
            <ChatChipsRow
              chips={suggestionChips}
              onChipClick={handleChipClick}
              variant="compact"
              smartBadge={smartSuggestions}
              loading={suggestionsLoading && suggestionChips.length === 0}
              className="mb-2.5 md:mb-3"
              palette={{
                bg:          PAL.paper2,
                border:      PAL.border2,
                ink:         PAL.ink,
                accent:      PAL.accent,
                arrowBg:     PAL.paper,
                arrowInk:    PAL.ink,
                arrowBorder: PAL.border,
                paperBg:     PAL.paper,
              }}
            />
          )}

          {isOutOfCredits ? (
            <div
              className="rounded-sm p-4 md:p-5 flex flex-col sm:flex-row items-center gap-3"
              style={{ background: "rgba(165,124,42,0.08)", border: `1px solid ${PAL.border}` }}
            >
              <div className="flex-1 text-center sm:text-left">
                <div className="text-[13px] font-semibold" style={{ color: PAL.ink }}>You've used all your credits</div>
                <div className="serif-text text-[12.5px] mt-0.5" style={{ color: PAL.ink2 }}>
                  Past chats remain accessible. Top up to generate new readings.
                </div>
              </div>
              {(profile?.plan_type === "plan2" || profile?.plan_type === "promo") && (
                <button
                  onClick={() => setShowTopup(true)}
                  className="flex-shrink-0 h-10 px-5 rounded-sm text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: PAL.accent }}
                >
                  Top up now
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-end gap-2 md:gap-3">
              <div
                className="flex-1 flex items-end rounded-sm overflow-hidden focus-within:ring-2 focus-within:ring-black/10 transition-all shadow-sm"
                style={{ background: PAL.paper2, border: `1px solid ${PAL.border}` }}
              >
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={e => { setInput(e.target.value); autoResize(); }}
                  onKeyDown={e => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={placeholder}
                  className="w-full bg-transparent px-4 md:px-5 py-3.5 md:py-4 focus:outline-none text-[15.5px] md:text-[16px] serif-text resize-none leading-relaxed"
                  style={{ maxHeight: "200px", overflowY: "auto", color: PAL.ink }}
                  data-lenis-prevent="true"
                  disabled={composerDisabled}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || composerDisabled}
                className="h-12 md:h-[52px] w-12 md:w-auto md:px-5 rounded-sm text-white inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 disabled:opacity-40 flex-shrink-0 shadow-sm"
                style={{ background: PAL.accent }}
                aria-label="Send"
              >
                <Send size={16} />
                <span className="hidden md:inline text-[13px] font-semibold">Send</span>
              </button>
            </form>
          )}
          <div className="text-center mt-2 md:mt-3">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: PAL.ink3 }}>
              <span className="hidden sm:inline">⌘ + Return to send · </span>
              <button
                type="button"
                onClick={onOpenImportant}
                aria-label="Open important note about karma, free will, and disclaimers"
                className="inline-flex items-center gap-1 underline-offset-[3px] underline transition-opacity hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-offset-1 rounded-sm"
                style={{ color: PAL.accent, textDecorationColor: PAL.accent }}
              >
                Important
              </button>
            </span>
          </div>
        </div>
      </div>
      {/* /jump-pill + composer wrapper */}
      </div>
    </div>
  );
}
