"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Sparkles, Send, Users, AlertTriangle, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PaymentGate from "./components/PaymentGate";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [familyProfiles, setFamilyProfiles] = useState<any[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalType, setModalType] = useState<"self" | "family">("self");
  const [formData, setFormData] = useState({
    name: "",
    relationship: "Self",
    dob: "",
    tob: "",
    pob: ""
  });
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Geocoding cache: pob → { lat, lon }
  const [geocoordCache, setGeocoordCache] = useState<Record<string, { lat: number; lon: number }>>({});
  const [geocodingReady, setGeocodingReady] = useState(false);

  const [activeProfileId, setActiveProfileId] = useState<string>("self");
  
  const DEFAULT_WELCOME = "Namaste. I am your Quantum Karma Astrologer. How may I illuminate your path today?";

  const [messages, setMessages] = useState<{role: "user" | "assistant" | "system", content: string, marker?: string}[]>([
    { role: "assistant", content: DEFAULT_WELCOME, marker: "A" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    }
    if (user) fetchData();
  }, [user, supabase]);

  // ── Load Chat History from Supabase on profile switch ──
  useEffect(() => {
    async function loadChatHistory() {
      if (!user || !familyProfiles.length) return;

      let targetId: string | null = null;
      if (activeProfileId === "self") {
        const selfP = familyProfiles.find(p => p.relationship === "Self");
        targetId = selfP?.id || null;
      } else {
        targetId = activeProfileId;
      }

      if (!targetId) {
        setMessages([{ role: "assistant", content: DEFAULT_WELCOME }]);
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
          const loaded = data.map((m: any) => {
            let text = m.content;
            let mkr = undefined;
            const markerMatch = text.match(/<!-- MARKER:([A-Z]) -->/);
            if (markerMatch) {
              mkr = markerMatch[1];
              text = text.replace(/<!-- MARKER:[A-Z] -->/, "").trim();
            }
            return { role: m.role as "user" | "assistant" | "system", content: text, marker: mkr };
          });
          setMessages([{ role: "assistant", content: DEFAULT_WELCOME }, ...loaded]);
          // Update chips based on last user message
          const lastUserMsg = [...loaded].reverse().find(m => m.role === "user");
          if (lastUserMsg) updateChipsFromContext(lastUserMsg.content);
        } else {
          setMessages([{ role: "assistant", content: DEFAULT_WELCOME }]);
          setSuggestionChips(INITIAL_CHIPS);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setMessages([{ role: "assistant", content: DEFAULT_WELCOME }]);
      }
      setHistoryLoaded(true);
    }
    loadChatHistory();
  }, [activeProfileId, familyProfiles, user]);

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

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  // Only auto-scroll when history is initially loaded, NOT continuously on every re-render
  useEffect(() => {
    if (historyLoaded) {
      // Small delay to ensure DOM is updated
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
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`, {
        headers: {
          "User-Agent": "QuantumKarma/1.0 (contact@quantumkarma.tech)"
        }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        // Map nominatim results to the expected UI structure
        const suggestions = data.map((item: any) => ({
          Name: item.display_name,
          lat: item.lat,
          lon: item.lon
        }));
        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setLocationSuggestions([]);
      }
    } catch (err) {
      console.error("Location search failed", err);
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
          timezone: "+05:30"
        }).eq("id", existingProfile.id).select().single();
      } else {
        query = supabase.from("family_profiles").insert({
          user_id: user.id,
          name: formData.name,
          relationship: modalType === "self" ? "Self" : formData.relationship,
          dob: formData.dob,
          tob: formData.tob,
          pob: formData.pob,
          timezone: "+05:30"
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
        setFormData({ name: "", relationship: "Self", dob: "", tob: "", pob: "" });
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
        setMessages(prev => [...prev, { role: "system", content: "Please complete your birth profile onboarding first." }]);
        setShowProfileModal(true);
        return;
      }
    } else {
      const famProfile = familyProfiles.find(p => p.id === activeProfileId);
      targetPob = famProfile?.pob || "";
    }

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);
    
    // Auto-scroll when user sends a message
    setTimeout(scrollToBottom, 50);

    try {
      const res = await fetch("/api/astro-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          profileId: targetProfileId,
          lat: geocoordCache[targetPob]?.lat,
          lon: geocoordCache[targetPob]?.lon,
          history: messages.filter(m => m.role !== "system").slice(-10)
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setMessages(prev => [...prev, { role: "system", content: data.error || "An error occurred." }]);
      } else {
        if (data.systemWarning) {
           setMessages(prev => [...prev, { role: "system", content: data.systemWarning }]);
        }
        if (data.reply) {
           setMessages(prev => [...prev, { role: "assistant", content: data.reply, marker: data.marker }]);
        }
        if (data.creditsRemaining !== undefined && profile) {
           setProfile({ ...profile, credits: data.creditsRemaining });
        }
        // Dynamically update suggestion chips based on conversation context
        updateChipsFromContext(userMessage);
        // Auto-scroll when AI replies
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "system", content: "Network error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipClick = (chip: string) => {
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

      // Reset local messages state
      setMessages([{ role: "assistant", content: DEFAULT_WELCOME }]);
      setSuggestionChips(INITIAL_CHIPS);
    } catch (err) {
      console.error("Failed to clear chat:", err);
      alert("Failed to clear chat history. Please try again.");
    }
  };

  // Show minimal loader only while auth is resolving (before PaymentGate takes over)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>
          LOADING...
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Seeker";
  const selfProfile = familyProfiles.find(p => p.relationship === "Self");
  
  let activeProfileName = "Unknown";
  if (activeProfileId === "self") {
    activeProfileName = selfProfile ? "My Chart" : "Onboarding Required";
  } else {
    activeProfileName = familyProfiles.find(p => p.id === activeProfileId)?.name || "Unknown";
  }

  return (
    <PaymentGate>
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-200 selection:text-indigo-900">
      
      {/* Profile Modal - Light Theme */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-indigo-600" size={20} />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {modalType === "self" ? "Cosmic Identity" : "Add Bond"}
              </h2>
            </div>
            <p className="text-sm text-slate-500 mb-8">
              {modalType === "self" ? "Provide exact birth coordinates to unlock your timeline." : "Enter their details for accurate synastry mapping."}
            </p>
            
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400" placeholder="e.g. John Doe" />
              </div>
              
              {modalType === "family" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Relationship</label>
                  <select value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all">
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Date of Birth</label>
                  <input required type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Time of Birth</label>
                  <input required type="time" value={formData.tob} onChange={e => setFormData({...formData, tob: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Place of Birth</label>
                <input 
                  required 
                  type="text" 
                  value={formData.pob} 
                  onChange={e => handleLocationSearch(e.target.value)} 
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400" 
                  placeholder="e.g. Mumbai, India" 
                />
                {isSearchingLocation && (
                  <div className="absolute right-4 top-[38px]">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
                  </div>
                )}
                {showSuggestions && locationSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                    {locationSuggestions.map((loc, idx) => (
                      <li 
                        key={idx} 
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-100 last:border-0"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, pob: loc.Name }));
                          setShowSuggestions(false);
                        }}
                      >
                        {loc.Name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                {modalType === "family" && (
                  <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 py-3 px-4 rounded-lg font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all">Cancel</button>
                )}
                <button type="submit" className="flex-1 py-3 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-600/30 transition-all">Save Blueprint</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header - Light & Clean */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
               <Sparkles size={16} className="text-indigo-600" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Quantum <span className="text-indigo-600">Karma</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Credits</span>
              <span className="text-sm font-bold text-slate-900">{profile.credits ?? 50}</span>
            </div>

            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold text-slate-900">{displayName}</div>
                  <div className="text-xs text-indigo-600 font-medium">Seeker</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-700 border border-indigo-100">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </div>
              <button onClick={handleSignOut} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout - Light Theme */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 lg:gap-8 h-[calc(100vh-64px)]">
        
        {/* Sidebar - Clean & Structured */}
        <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-6">
          
          {/* Active Context Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Users size={14} className="text-indigo-600" /> Active Context
              </h2>
            </div>
            <div className="p-2 space-y-1">
              <div className="relative group">
                <button 
                  onClick={() => setActiveProfileId("self")}
                  className={`w-full text-left px-4 py-2.5 pr-10 rounded-lg text-sm font-medium transition-all ${activeProfileId === "self" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  My Blueprint <span className="ml-2 text-xs text-slate-400 font-normal">(Primary)</span>
                </button>
                {selfProfile && (
                  <button 
                    onClick={() => {
                      setModalType("self");
                      setFormData({ 
                        name: selfProfile.name, 
                        relationship: "Self", 
                        dob: selfProfile.dob, 
                        tob: selfProfile.tob, 
                        pob: selfProfile.pob 
                      });
                      setShowProfileModal(true);
                    }}
                    className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md opacity-0 group-hover:opacity-100 transition-all border border-slate-200"
                    title="Edit Coordinates"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                )}
              </div>
              {familyProfiles.filter(p => p.relationship !== "Self").map(fp => (
                <div key={fp.id} className="relative group">
                  <button 
                    onClick={() => setActiveProfileId(fp.id)}
                    className={`w-full text-left px-4 py-2.5 pr-10 rounded-lg text-sm font-medium transition-all ${activeProfileId === fp.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {fp.name} <span className="ml-2 text-xs text-slate-400 font-normal">({fp.relationship})</span>
                  </button>
                  <button 
                    onClick={() => {
                      setModalType("family");
                      setFormData({ 
                        name: fp.name, 
                        relationship: fp.relationship, 
                        dob: fp.dob, 
                        tob: fp.tob, 
                        pob: fp.pob 
                      });
                      setShowProfileModal(true);
                    }}
                    className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md opacity-0 group-hover:opacity-100 transition-all border border-slate-200"
                    title="Edit Bond"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                </div>
              ))}
              
              <div className="pt-2 pb-1 px-2">
                <button 
                  onClick={() => {
                    setModalType("family");
                    setFormData({ name: "", relationship: "Spouse", dob: "", tob: "", pob: "" });
                    setShowProfileModal(true);
                  }}
                  className="w-full text-xs font-semibold text-slate-500 hover:text-indigo-600 py-2.5 rounded-lg border border-dashed border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                  <span className="text-lg leading-none">+</span> Add Bond
                </button>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 shadow-sm">
             <div className="flex items-start gap-3">
               <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 mt-0.5">
                 <AlertTriangle size={16} />
               </div>
               <div>
                 <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider">System Rules</h3>
                 <p className="text-xs text-amber-700/80 mt-1.5 leading-relaxed font-medium">Multiple complex queries within a single prompt will consume multiple credits. Maintain focus.</p>
               </div>
             </div>
          </div>
        </aside>

        {/* Main Chat Interface - Light Theme Redesign */}
        <section className="flex-1 w-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden relative">
            
          {/* Chat Header */}
          <div className="h-14 px-6 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-md z-10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <div className="flex flex-col">
                <h1 className="font-semibold text-sm text-slate-800">Reading: {activeProfileName}</h1>
              </div>
            </div>
            
            <button 
              onClick={handleClearChat}
              className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-red-50"
              title="Clear session memory"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              Clear Chat
            </button>
          </div>

          {/* Messages Area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 space-y-8 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col animate-fade-in ${msg.role === "system" ? "items-center" : msg.role === "user" ? "items-end" : "items-start"}`}>
                
                {msg.role === "system" ? (
                  <div className="bg-slate-100 border border-slate-200 text-slate-600 text-xs py-1.5 px-4 rounded-full font-medium">
                    {msg.content}
                  </div>
                ) : msg.role === "user" ? (
                  <div className="max-w-[85%] lg:max-w-[75%] bg-indigo-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
                  </div>
                ) : (
                  <div className="max-w-full lg:max-w-[85%] w-full flex gap-4">
                    {/* AI Avatar */}
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                       <MessageCircle size={20} className="text-indigo-600" />
                    </div>
                    
                    {/* AI Message Content */}
                    <div className="flex-1 space-y-1 relative pt-1">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2">
                        Quantum Oracle
                        {msg.marker && (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide" title={`Model: ${msg.marker === 'A' ? 'Claude Sonnet' : msg.marker === 'B' ? 'Gemini Pro' : 'Gemini Flash'}`}>
                            {msg.marker}
                          </span>
                        )}
                      </div>
                      <div className="prose-chat-light text-slate-700 text-[15px] leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 animate-fade-in w-full max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                   <MessageCircle size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1 pt-3">
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Floating Input Area */}
          <div className="p-4 lg:p-6 bg-white border-t border-slate-100 relative">
            
            {/* Dynamic Suggestion Chips */}
            {!isTyping && suggestionChips.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-1 mask-linear-right">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(chip)}
                    className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all whitespace-nowrap shadow-sm flex-shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="relative flex items-center bg-slate-50 rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all overflow-hidden">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={(!selfProfile && activeProfileId === "self") ? "Setup profile to begin..." : `Message Quantum Oracle...`}
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 pl-4 pr-14 py-3.5 focus:outline-none text-[15px] font-medium"
                disabled={isTyping || (!selfProfile && activeProfileId === "self")}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping || (!selfProfile && activeProfileId === "self")}
                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
            <div className="text-center mt-2.5">
               <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">AI-generated astrological insights. Not medical advice.</span>
            </div>
          </div>
          
        </section>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .mask-linear-right {
          mask-image: linear-gradient(to right, black 85%, transparent 100%);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Custom markdown styling for light theme */
        .prose-chat-light p { margin-bottom: 0.75em; }
        .prose-chat-light p:last-child { margin-bottom: 0; }
        .prose-chat-light strong { color: #1e293b; font-weight: 700; }
        .prose-chat-light ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.75em; }
        .prose-chat-light li { margin-bottom: 0.25em; }
        .prose-chat-light h1, .prose-chat-light h2, .prose-chat-light h3 { color: #0f172a; font-weight: 700; margin-top: 1.25em; margin-bottom: 0.5em; }
        .prose-chat-light h3 { font-size: 1.1em; }
      `}</style>
    </div>
    </PaymentGate>
  );
}
