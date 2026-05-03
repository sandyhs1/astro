'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Users, Plus, MessageCircle, Star, Search, CheckCircle2, MoreVertical, LogOut, Navigation, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

interface AstrologerClient {
  id: string;
  name: string;
  dob: string;
  tob: string;
  pob: string;
  timezone: string;
  notes?: string;
}

export default function AstrologerDashboard() {
  const supabase = createClient();
  const [clients, setClients] = useState<AstrologerClient[]>([]);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showAddClient, setShowAddClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', dob: '', tob: '', pob: '' });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Chat State
  const [messages, setMessages] = useState<{role: 'user' | 'assistant' | 'system', content: string}[]>([
    { role: 'assistant', content: 'Welcome Grand Master. Select a client to begin their reading.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Geocoding Cache
  const [geocoordCache, setGeocoordCache] = useState<Record<string, { lat: number; lon: number }>>({});

  useEffect(() => {
    fetchClients();
  }, [supabase]);

  const fetchClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('astrologer_clients')
        .select('*')
        .eq('astrologer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
      
      // Auto-select first client if available
      if (data && data.length > 0 && !activeClientId) {
        setActiveClientId(data[0].id);
      }
    } catch (error: any) {
      toast.error('Failed to load clients: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('astrologer_clients')
        .insert([{
          astrologer_id: user.id,
          name: formData.name,
          dob: formData.dob,
          tob: formData.tob,
          pob: formData.pob,
          timezone: '+05:30'
        }])
        .select()
        .single();

      if (error) throw error;

      setClients([data, ...clients]);
      setActiveClientId(data.id);
      setShowAddClient(false);
      setFormData({ name: '', dob: '', tob: '', pob: '' });
      toast.success('Client added successfully');
      setIsMobileMenuOpen(false); // Close mobile menu if open
    } catch (error: any) {
      toast.error('Failed to add client: ' + error.message);
    }
  };

  // Load chat history when client changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!activeClientId) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('role, content, created_at')
          .eq('user_id', user.id)
          .eq('astrologer_client_id', activeClientId) // using the new column
          .order('created_at', { ascending: true });

        if (data && data.length > 0) {
          const loaded = data.map(m => ({ role: m.role as any, content: m.content }));
          setMessages([
            { role: 'assistant', content: `Reading active for ${clients.find(c => c.id === activeClientId)?.name}. How may I assist?` },
            ...loaded
          ]);
        } else {
          setMessages([{ role: 'assistant', content: `New reading session for ${clients.find(c => c.id === activeClientId)?.name}. What would you like to explore?` }]);
        }
      } catch (err) {
         console.error('History load error:', err);
      }
    };

    if (activeClientId) {
      loadChatHistory();
    }
  }, [activeClientId, supabase, clients]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping || !activeClientId) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    const activeClient = clients.find(c => c.id === activeClientId);
    if (!activeClient) return;

    // Geocode if missing from cache
    let lat: number | undefined, lon: number | undefined;
    if (geocoordCache[activeClient.pob]) {
      lat = geocoordCache[activeClient.pob].lat;
      lon = geocoordCache[activeClient.pob].lon;
    } else {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(activeClient.pob)}&limit=1`);
        const data = await res.json();
        if (data && data[0]) {
          const parsedLat = parseFloat(data[0].lat);
          const parsedLon = parseFloat(data[0].lon);
          lat = parsedLat;
          lon = parsedLon;
          setGeocoordCache(prev => ({...prev, [activeClient.pob]: {lat: parsedLat, lon: parsedLon}}));
        }
      } catch (e) {
        console.error('Geocoding failed', e);
      }
    }

    try {
      const res = await fetch('/api/astro-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          profileId: activeClientId,
          lat,
          lon,
          history: messages.filter(m => m.role !== 'system').slice(-10)
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'system', content: data.error || 'API Error occurred.' }]);
      } else {
        if (data.systemWarning) {
           setMessages(prev => [...prev, { role: 'system', content: data.systemWarning }]);
        }
        if (data.reply) {
           setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'system', content: 'Network error.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const activeClient = clients.find(c => c.id === activeClientId);

  return (
    <div className="flex h-screen overflow-hidden bg-[#05050A] font-outfit text-white">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A0A12] border-b border-white/10 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-[#FFD700]" />
          <span className="font-cinzel font-bold text-lg">Partner Portal</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400 hover:text-white transition-colors">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile overlay */}
      <AnimatePresence>
        {(isMobileMenuOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`fixed md:static inset-y-0 left-0 z-20 w-72 bg-[#0A0A12] border-r border-white/10 flex flex-col pt-16 md:pt-0 ${isMobileMenuOpen ? 'shadow-2xl shadow-black' : ''}`}
          >
            {/* Desktop Brand */}
            <div className="hidden md:flex items-center gap-3 p-6 border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-[#FFD700]/10 flex items-center justify-center border border-[#FFD700]/20">
                <Star className="w-4 h-4 text-[#FFD700]" />
              </div>
              <span className="font-cinzel font-bold text-lg tracking-tight">Partner Portal</span>
            </div>

            <div className="p-4">
              <button 
                onClick={() => setShowAddClient(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4 text-[#FFD700]" />
                Add New Client
              </button>
            </div>

            <div className="px-4 mb-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search clients..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD700]/30 transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-5 h-5 animate-spin text-gray-600" /></div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center p-8 text-gray-500 text-sm">No clients found.</div>
              ) : (
                <div className="space-y-1">
                  {filteredClients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setActiveClientId(client.id);
                        setIsMobileMenuOpen(false); // Close on mobile select
                      }}
                      className={`w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all ${
                        activeClientId === client.id 
                          ? 'bg-[#FFD700]/10 border border-[#FFD700]/20' 
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`font-medium ${activeClientId === client.id ? 'text-[#FFD700]' : 'text-gray-200'}`}>
                          {client.name}
                        </span>
                        {activeClientId === client.id && <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />}
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{client.dob} • {client.pob}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* User Bottom Area */}
            <div className="p-4 border-t border-white/10">
               <button onClick={() => supabase.auth.signOut().then(() => window.location.href='/astrologer/auth')} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                 <LogOut className="w-4 h-4" />
                 Sign Out
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-10 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#05050A] relative pt-16 md:pt-0">
        
        {/* Top Bar Context */}
        <div className="h-16 border-b border-white/10 bg-[#0A0A12]/80 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            {activeClient ? (
              <div>
                <h2 className="font-semibold text-white leading-tight">{activeClient.name}</h2>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span>{activeClient.dob} {activeClient.tob}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{activeClient.pob}</span>
                </div>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Select a client to begin</span>
            )}
          </div>
          
          {activeClient && (
             <button className="p-2 text-gray-400 hover:text-white transition-colors">
               <MoreVertical className="w-5 h-5" />
             </button>
          )}
        </div>

        {/* Chat Area */}
        {activeClientId ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-5 py-4 ${
                    msg.role === 'user' 
                      ? 'bg-[#FFD700] text-black rounded-tr-sm' 
                      : msg.role === 'system'
                        ? 'bg-red-500/10 text-red-200 border border-red-500/20'
                        : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant' && i === 0 ? (
                      <div className="flex items-center gap-2 mb-2">
                         <Star className="w-4 h-4 text-[#FFD700]" />
                         <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider">System Ready</span>
                      </div>
                    ) : null}
                    <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-[#FFD700]/50 animate-bounce" />
                     <div className="w-2 h-2 rounded-full bg-[#FFD700]/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
                     <div className="w-2 h-2 rounded-full bg-[#FFD700]/50 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 p-4 bg-[#0A0A12] border-t border-white/10">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-end gap-2 bg-black/40 border border-white/10 rounded-2xl p-2 transition-all focus-within:border-[#FFD700]/50 focus-within:ring-1 focus-within:ring-[#FFD700]/50">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Generate reading for ${activeClient?.name}...`}
                  className="w-full bg-transparent text-white placeholder-gray-500 resize-none py-3 px-4 focus:outline-none max-h-32 min-h-[52px]"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-3 shrink-0 rounded-xl bg-[#FFD700] text-black hover:bg-[#FDB931] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-0.5 mr-0.5"
                >
                  <Navigation className="w-5 h-5 fill-current" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <Users className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Client Selected</h3>
            <p className="text-gray-400 mb-6 max-w-md">Select a client from the sidebar or add a new one to begin their reading session.</p>
            <button 
              onClick={() => setShowAddClient(true)}
              className="px-6 py-3 bg-[#FFD700] text-black font-semibold rounded-xl hover:bg-[#FDB931] transition-colors"
            >
              Add New Client
            </button>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowAddClient(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0A0A12] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-2 font-cinzel">Add New Client</h2>
              <p className="text-sm text-gray-400 mb-6">Enter birth coordinates to register a new client.</p>
              
              <form onSubmit={handleAddClient} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Date of Birth</label>
                    <input required type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Time of Birth</label>
                    <input required type="time" value={formData.tob} onChange={e => setFormData({...formData, tob: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Place of Birth</label>
                  <input required type="text" value={formData.pob} onChange={e => setFormData({...formData, pob: e.target.value})} placeholder="City, State, Country" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all" />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddClient(false)} className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 px-4 rounded-xl font-medium text-black bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:opacity-90 transition-opacity">Save Client</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
