'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Users, Plus, MessageCircle, Star, Search, CheckCircle2, MoreVertical, LogOut, Navigation, Menu, X, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DeepCompatibilityWorkspace from '@/components/features/DeepCompatibilityWorkspace';
import { formatDate } from '@/lib/utils/format';

interface AstrologerClient {
  id: string;
  name: string;
  dob: string;
  tob: string;
  pob: string;
  timezone: string;
  notes?: string;
  gender?: string;
  tags?: string[];
  consultation_fee?: number;
}

function FormattedMessage({ content }: { content: string }) {
  if (!content) return null;
  
  // Clean up unwanted artifacts like ∅
  const cleanContent = content.replace(/∅/g, 'None');

  return (
    <div className="prose prose-invert prose-amber max-w-none 
      prose-headings:font-cinzel prose-headings:text-[#FFD700] prose-headings:tracking-wider
      prose-h3:border-b prose-h3:border-[#FFD700]/20 prose-h3:pb-2
      prose-p:text-gray-300 prose-p:leading-relaxed
      prose-li:text-gray-300
      prose-strong:text-[#FFD700] prose-strong:font-bold
      prose-table:border prose-table:border-white/10 prose-table:rounded-xl
      prose-th:bg-white/5 prose-th:p-2 prose-td:p-2 prose-td:border-t prose-td:border-white/5
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
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
  const [formData, setFormData] = useState({ name: '', dob: '', tob: '', pob: '', gender: 'Male', consultation_fee: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Chat State
  const [messages, setMessages] = useState<{role: 'user' | 'assistant' | 'system', content: string}[]>([
    { role: 'assistant', content: 'Welcome Grand Master. Select a client to begin their reading.' }
  ]);
  const [input, setInput] = useState('');
  const [pobSuggestions, setPobSuggestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'timeline' | 'comparison' | 'revenue' | 'compatibility-tool'>('chat');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [comparisonPartnerId, setComparisonPartnerId] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [geocoordCache, setGeocoordCache] = useState<Record<string, { lat: number; lon: number }>>({});

  // Client Management State
  const [showEditClient, setShowEditClient] = useState(false);
  const [showClientMenu, setShowClientMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowClientMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // POB Autocomplete State
  const [isSearchingPob, setIsSearchingPob] = useState(false);
  const [showPobDropdown, setShowPobDropdown] = useState(false);

  useEffect(() => {
    if (!formData.pob || formData.pob.length < 3 || !showPobDropdown) {
      setPobSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingPob(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.pob)}&limit=5`);
        const data = await res.json();
        const suggestions = data.map((item: any) => item.display_name);
        setPobSuggestions(suggestions);
      } catch (error) {
        console.error('POB search failed:', error);
      } finally {
        setIsSearchingPob(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.pob, showPobDropdown]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

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

  useEffect(() => {
    if (activeClient) {
      setClientNotes(activeClient.notes || '');
    }
  }, [activeClientId, clients]);

  const saveNotes = async (newNotes: string) => {
    if (!activeClientId) return;
    setIsSavingNotes(true);
    try {
      const { error } = await supabase
        .from('astrologer_clients')
        .update({ notes: newNotes })
        .eq('id', activeClientId);
      
      if (error) throw error;
      
      // Update local state
      setClients(prev => prev.map(c => c.id === activeClientId ? { ...c, notes: newNotes } : c));
    } catch (error: any) {
      console.error('Failed to save notes:', error);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Debounced notes saving
  useEffect(() => {
    if (!activeClientId) return;
    const timer = setTimeout(() => {
      const currentClient = clients.find(c => c.id === activeClientId);
      if (currentClient && clientNotes !== (currentClient.notes || '')) {
        saveNotes(clientNotes);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [clientNotes, activeClientId]);

  useEffect(() => {
    if (activeClientId && (activeTab === 'timeline' || activeTab === 'revenue')) {
      fetchMetrics();
    }
  }, [activeClientId, activeTab]);

  const fetchMetrics = async () => {
    setIsLoadingMetrics(true);
    try {
      const res = await fetch(`/api/astrologer/dashboard/metrics?clientId=${activeClientId}`);
      const data = await res.json();
      if (data.timeline) setTimelineData(data.timeline);
      if (data.revenue) setRevenueData(data.revenue);
    } catch (error) {
      console.error('Metrics fetch error:', error);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'comparison' && activeClientId && comparisonPartnerId) {
      fetchComparison();
    }
  }, [activeTab, activeClientId, comparisonPartnerId]);

  const fetchComparison = async () => {
    setIsLoadingMetrics(true);
    try {
      const res = await fetch(`/api/astrologer/dashboard/comparison?id1=${activeClientId}&id2=${comparisonPartnerId}`);
      const data = await res.json();
      setComparisonData(data);
    } catch (error) {
      console.error('Comparison error:', error);
    } finally {
      setIsLoadingMetrics(false);
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
          gender: formData.gender,
          consultation_fee: formData.consultation_fee,
          timezone: '+05:30'
        }])
        .select()
        .single();

      if (error) throw error;

      setClients([data, ...clients]);
      setActiveClientId(data.id);
      setShowAddClient(false);
      setFormData({ name: '', dob: '', tob: '', pob: '', gender: 'Male', consultation_fee: 0 });
      toast.success('Client added successfully');
      setIsMobileMenuOpen(false);
    } catch (error: any) {
      toast.error('Failed to add client: ' + error.message);
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient) return;
    try {
      const { error } = await supabase
        .from('astrologer_clients')
        .update({
          name: formData.name,
          dob: formData.dob,
          tob: formData.tob,
          pob: formData.pob,
          gender: formData.gender,
          consultation_fee: formData.consultation_fee,
        })
        .eq('id', activeClient.id);

      if (error) throw error;

      setClients(clients.map(c => c.id === activeClient.id ? { ...c, ...formData } : c));
      setShowEditClient(false);
      toast.success('Client updated successfully');
    } catch (error: any) {
      toast.error('Failed to update client: ' + error.message);
    }
  };

  const handleDeleteClient = async () => {
    if (!activeClient) return;
    if (!confirm(`Are you sure you want to delete ${activeClient.name}? All chat history for this client will be lost.`)) return;

    try {
      const { error } = await supabase
        .from('astrologer_clients')
        .delete()
        .eq('id', activeClient.id);

      if (error) throw error;

      setClients(clients.filter(c => c.id !== activeClient.id));
      setActiveClientId(clients.find(c => c.id !== activeClient.id)?.id || null);
      toast.success('Client deleted successfully');
      setShowClientMenu(false);
    } catch (error: any) {
      toast.error('Failed to delete client: ' + error.message);
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

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeClient = clients.find(c => c.id === activeClientId);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#05050A] font-outfit text-white">
      
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

            <div className="p-4 space-y-2">
              <button 
                onClick={() => setShowAddClient(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4 text-[#FFD700]" />
                Add New Client
              </button>
              <button 
                onClick={() => {
                  setActiveClientId(null);
                  setActiveTab('compatibility-tool');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 border rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'compatibility-tool' && !activeClientId
                    ? 'bg-[#FFD700]/10 border-[#FFD700]/20 text-[#FFD700]' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                }`}
              >
                <Users className="w-4 h-4 text-[#FFD700]" />
                Deep Compatibility
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
                      <div className="flex items-center gap-2 mt-1 overflow-hidden">
                        <span className="text-[10px] text-gray-500 shrink-0">{formatDate(client.dob)}</span>
                        <div className="flex gap-1 overflow-hidden">
                          {client.tags?.slice(0, 2).map((tag: any) => (
                            <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400 uppercase truncate">{tag}</span>
                          ))}
                        </div>
                      </div>
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
      <div className="flex-1 flex flex-col min-h-0 bg-[#05050A] relative md:pt-0 overflow-hidden">
        
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 215, 0, 0.3); }
        `}</style>

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
                  <span>{formatDate(activeClient.dob)} {activeClient.tob}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{activeClient.pob}</span>
                </div>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Select a client to begin</span>
            )}
          </div>
          
          {activeClient && (
             <div className="flex items-center gap-1 mr-4 bg-white/5 p-1 rounded-lg">
               <button 
                 onClick={() => setActiveTab('chat')}
                 className={`p-2 rounded-md transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
                 title="Oracle Chat"
               >
                 <MessageCircle className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">Chat</span>
               </button>
               <button 
                 onClick={() => setActiveTab('notes')}
                 className={`p-2 rounded-md transition-all flex items-center gap-2 ${activeTab === 'notes' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
                 title="Client Notes"
               >
                 <Edit className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">Notes</span>
               </button>
               <button 
                 onClick={() => setActiveTab('timeline')}
                 className={`p-2 rounded-md transition-all flex items-center gap-2 ${activeTab === 'timeline' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
                 title="Astro Timeline"
               >
                 <Navigation className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">Timeline</span>
               </button>
               <button 
                 onClick={() => setActiveTab('comparison')}
                 className={`p-2 rounded-md transition-all flex items-center gap-2 ${activeTab === 'comparison' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
                 title="Bulk Comparison"
               >
                 <Users className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">Sync</span>
               </button>
               <button 
                 onClick={() => setActiveTab('revenue')}
                 className={`p-2 rounded-md transition-all flex items-center gap-2 ${activeTab === 'revenue' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'}`}
                 title="Revenue Dashboard"
               >
                 <Star className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">ROI</span>
               </button>
             </div>
          )}
          
          {activeClient && (
             <div className="relative" ref={menuRef}>
               <button 
                 onClick={() => setShowClientMenu(!showClientMenu)}
                 className="p-2 text-gray-400 hover:text-white transition-colors"
               >
                 <MoreVertical className="w-5 h-5" />
               </button>
               
               <AnimatePresence>
                 {showClientMenu && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95, y: -10 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, y: -10 }}
                     className="absolute right-0 mt-2 w-48 bg-[#1A1A2E] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                   >
                     <button 
                       onClick={() => {
                         setFormData({ 
                           name: activeClient.name, 
                           dob: activeClient.dob, 
                           tob: activeClient.tob, 
                           pob: activeClient.pob,
                           gender: activeClient.gender || 'Male',
                           consultation_fee: activeClient.consultation_fee || 0
                         });
                         setShowEditClient(true);
                         setShowClientMenu(false);
                       }}
                       className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5"
                     >
                       <Edit className="w-4 h-4" />
                       Edit Client
                     </button>
                     <button 
                       onClick={handleDeleteClient}
                       className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                     >
                       <Trash2 className="w-4 h-4" />
                       Delete Client
                     </button>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          )}
        </div>

        {/* Chat Area - ABSOLUTE INSET PATTERN FOR GUARANTEED SCROLL */}
        <div className="flex-1 relative min-h-0 bg-[#05050A]">
          {activeClientId ? (
            <div 
              data-lenis-prevent 
              className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6 custom-scrollbar"
            >
              {activeTab === 'chat' && (
                <>
                  {messages.map((msg, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-5 py-4 shadow-xl ${
                        msg.role === 'user' 
                          ? 'bg-[#FFD700] rounded-tr-sm' 
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
                        <div className={msg.role === 'user' ? 'text-black font-bold' : ''}>
                          <FormattedMessage content={msg.content} />
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
                </>
              )}

              {activeTab === 'notes' && (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#FFD700] font-cinzel font-bold text-lg">Confidential Client Notes</h3>
                    {isSavingNotes && (
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                        Saving...
                      </div>
                    )}
                  </div>
                  <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent pointer-events-none opacity-50" />
                    <textarea 
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="Jot down personal observations, recurring patterns, or specific advice shared with this client..."
                      className="w-full h-full bg-transparent border-none focus:ring-0 text-gray-200 resize-none font-medium leading-relaxed placeholder:text-gray-600 relative z-10 custom-scrollbar"
                      style={{ fontSize: '1.1rem' }}
                    />
                  </div>
                  <p className="mt-4 text-[11px] text-gray-500 italic flex items-center gap-2">
                    <Star className="w-3 h-3" />
                    Notes are automatically encrypted and saved to this client's profile.
                  </p>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#FFD700] font-cinzel font-bold text-xl uppercase tracking-wider">Astro-Timeline Analysis</h3>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400">Live Dasha Stream</div>
                  </div>
                  
                  {isLoadingMetrics ? (
                    <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" /></div>
                  ) : timelineData ? (
                    <div className="grid gap-6">
                       {/* Current Dasha Card */}
                       <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-1 h-full bg-[#FFD700]" />
                         <div className="flex items-center justify-between mb-6">
                           <div>
                             <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Current Cycle</span>
                             <h4 className="text-2xl font-bold text-white mt-1">{timelineData.mahadasha.planet} Mahadasha</h4>
                           </div>
                           <div className="text-right">
                             <div className="text-[#FFD700] font-mono text-sm">{timelineData.mahadasha.start} — {timelineData.mahadasha.end}</div>
                           </div>
                         </div>
                         
                         <div className="space-y-6">
                           <div>
                             <div className="flex items-center justify-between text-xs mb-2">
                               <span className="text-gray-400">Antardasha: <span className="text-white font-bold">{timelineData.antardasha.planet}</span></span>
                               <span className="text-gray-500">{timelineData.antardasha.end}</span>
                             </div>
                             <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-[#FFD700]/40 w-[65%]" />
                             </div>
                           </div>
                           
                           <div>
                             <div className="flex items-center justify-between text-xs mb-2">
                               <span className="text-gray-400">Pratyantar: <span className="text-white font-bold">{timelineData.pratyantar.planet}</span></span>
                               <span className="text-gray-500">{timelineData.pratyantar.end}</span>
                             </div>
                             <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-[#FFD700] w-[30%]" />
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Next Dasha Preview */}
                       <div className="bg-white/5 border border-white/10 rounded-2xl p-6 border-dashed opacity-70">
                         <div className="flex items-center justify-between">
                            <div>
                               <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Next Major Shift</span>
                               <h4 className="text-lg font-bold text-gray-300 mt-1">{timelineData.nextMahadasha.planet} Mahadasha</h4>
                            </div>
                            <div className="text-right text-gray-500 font-mono text-xs">
                               Starts: {timelineData.nextMahadasha.start}
                            </div>
                         </div>
                       </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-gray-500 italic">No timeline data available for this profile.</div>
                  )}
                </div>
              )}

              {activeTab === 'comparison' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#FFD700] font-cinzel font-bold text-xl uppercase tracking-wider">Synastry & Comparison</h3>
                    <select 
                      onChange={(e) => setComparisonPartnerId(e.target.value)}
                      className="bg-[#0A0A12] border border-white/10 rounded-lg text-sm px-4 py-2 focus:outline-none focus:border-[#FFD700]/50"
                    >
                      <option value="">Select Partner Profile...</option>
                      {clients.filter(c => c.id !== activeClientId).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {comparisonPartnerId ? (
                    isLoadingMetrics ? (
                      <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" /></div>
                    ) : comparisonData ? (
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                              <h4 className="font-bold text-[#FFD700]">{activeClient?.name}</h4>
                           </div>
                           <div className="space-y-2">
                              {comparisonData.p1.planets.map((p: any) => (
                                <div key={p.name} className="flex items-center justify-between text-sm p-3 bg-white/5 rounded-lg">
                                  <span className="text-gray-400">{p.name}</span>
                                  <span className="text-white font-mono">{p.sign} {p.degree}°</span>
                                </div>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="text-center p-4 bg-white/5 rounded-xl border border-[#FFD700]/20">
                              <h4 className="font-bold text-[#FFD700]">{clients.find(c => c.id === comparisonPartnerId)?.name}</h4>
                           </div>
                           <div className="space-y-2">
                              {comparisonData.p2.planets.map((p: any) => (
                                <div key={p.name} className="flex items-center justify-between text-sm p-3 bg-white/5 rounded-lg">
                                  <span className="text-gray-400">{p.name}</span>
                                  <span className="text-white font-mono">{p.sign} {p.degree}°</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    ) : null
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center bg-white/2 border border-dashed border-white/10 rounded-2xl">
                      <Users className="w-12 h-12 text-gray-600 mb-4" />
                      <p className="text-gray-500">Select a second client to begin compatibility analysis</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'revenue' && (
                <div className="space-y-8">
                  <h3 className="text-[#FFD700] font-cinzel font-bold text-xl uppercase tracking-wider">Revenue & Usage Tracking</h3>
                  
                  {isLoadingMetrics ? (
                    <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" /></div>
                  ) : revenueData ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                         <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Platform Cost</span>
                         <div className="text-3xl font-bold text-white mt-2">₹{revenueData.totalCost.toFixed(2)}</div>
                         <p className="text-[10px] text-red-400 mt-2">Billed at current session</p>
                       </div>
                       <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                         <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Earnings</span>
                         <div className="text-3xl font-bold text-white mt-2">₹{(activeClient?.consultation_fee || 0).toLocaleString()}</div>
                         <p className="text-[10px] text-green-400 mt-2">From this client's sessions</p>
                       </div>
                       <div className="bg-white/5 border border-white/10 rounded-2xl p-6 bg-gradient-to-br from-[#FFD700]/10 to-transparent border-[#FFD700]/20">
                         <span className="text-[10px] text-[#FFD700] uppercase tracking-widest font-bold">Actual Profit (ROI)</span>
                         <div className="text-3xl font-bold text-white mt-2">
                           ₹{((activeClient?.consultation_fee || 0) - revenueData.totalCost).toLocaleString()}
                         </div>
                         <p className="text-[10px] text-[#FFD700] mt-2">
                           {revenueData.totalCost > 0 
                             ? `${(((activeClient?.consultation_fee || 0) / revenueData.totalCost) * 100).toFixed(0)}% Profit Margin`
                             : '100% Profit Margin'}
                         </p>
                       </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : activeTab === 'compatibility-tool' ? (
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6">
              <DeepCompatibilityWorkspace />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
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

          {/* Input Area */}
          {activeClientId && activeTab === 'chat' && (
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Gender</label>
                    <select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all appearance-none">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
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

                <div className="relative">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Place of Birth</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.pob} 
                    onChange={e => {
                      setFormData({...formData, pob: e.target.value});
                      setShowPobDropdown(true);
                    }} 
                    onFocus={() => setShowPobDropdown(true)}
                    onBlur={() => setTimeout(() => setShowPobDropdown(false), 200)}
                    placeholder="City, State, Country" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all" 
                  />
                  
                  <AnimatePresence>
                    {showPobDropdown && (pobSuggestions.length > 0 || isSearchingPob) && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-[#1A1A2E] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto"
                      >
                        {isSearchingPob && (
                          <div className="px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Searching locations...
                          </div>
                        )}
                        {pobSuggestions.map((suggestion, idx) => (
                          <button
                            key={idx} type="button"
                            onClick={() => { setFormData({...formData, pob: suggestion}); setShowPobDropdown(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Consultation Fee (INR)</label>
                  <input type="number" value={formData.consultation_fee} onChange={e => setFormData({...formData, consultation_fee: parseInt(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700]/50 outline-none transition-all" />
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

      {/* Edit Client Modal */}
      <AnimatePresence>
        {showEditClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowEditClient(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0A0A12] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-2 font-cinzel">Edit Client</h2>
              <p className="text-sm text-gray-400 mb-6">Update the birth coordinates for this client.</p>
              
              <form onSubmit={handleUpdateClient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Gender</label>
                    <select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all appearance-none">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
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

                <div className="relative">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Place of Birth</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.pob} 
                    onChange={e => {
                      setFormData({...formData, pob: e.target.value});
                      setShowPobDropdown(true);
                    }} 
                    onFocus={() => setShowPobDropdown(true)}
                    onBlur={() => setTimeout(() => setShowPobDropdown(false), 200)}
                    placeholder="City, State, Country" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 outline-none transition-all" 
                  />
                  
                  <AnimatePresence>
                    {showPobDropdown && (pobSuggestions.length > 0 || isSearchingPob) && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-1 bg-[#1A1A2E] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto"
                      >
                        {isSearchingPob && (
                          <div className="px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Searching locations...
                          </div>
                        )}
                        {pobSuggestions.map((suggestion, idx) => (
                          <button
                            key={idx} type="button"
                            onClick={() => { setFormData({...formData, pob: suggestion}); setShowPobDropdown(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowEditClient(false)} className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 px-4 rounded-xl font-medium text-black bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:opacity-90 transition-opacity">Update Client</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
