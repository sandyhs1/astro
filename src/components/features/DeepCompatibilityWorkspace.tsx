import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Users, Star, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProfileData {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  gender: string;
}

export default function DeepCompatibilityWorkspace() {
  const [profile1, setProfile1] = useState<ProfileData>({ name: '', dob: '', tob: '', pob: '', gender: 'Male' });
  const [profile2, setProfile2] = useState<ProfileData>({ name: '', dob: '', tob: '', pob: '', gender: 'Female' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    if (!profile1.name || !profile2.name || !profile1.dob || !profile2.dob || !profile1.pob || !profile2.pob) {
      setError("Please fill all required fields for both profiles.");
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setReport(null);

    try {
      const res = await fetch('/api/astrologer/dashboard/deep-compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile1, profile2 })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate report');

      setReport(data.report);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
        <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center border border-[#FFD700]/20">
          <Users className="w-6 h-6 text-[#FFD700]" />
        </div>
        <div>
          <h2 className="text-2xl font-cinzel font-bold text-white uppercase tracking-widest">Deep Synastry Engine</h2>
          <p className="text-sm text-gray-400">Comprehensive karmic and astrological compatibility analysis</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile 1 */}
        <div className="bg-[#0A0A12] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
            Profile A
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
              <input type="text" value={profile1.name} onChange={e => setProfile1({...profile1, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700]/50 outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Date of Birth</label>
                <input type="date" value={profile1.dob} onChange={e => setProfile1({...profile1, dob: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700]/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Gender</label>
                <select value={profile1.gender} onChange={e => setProfile1({...profile1, gender: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700]/50 outline-none transition-all appearance-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Time</label>
                <input type="time" value={profile1.tob} onChange={e => setProfile1({...profile1, tob: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700]/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Place</label>
                <input type="text" value={profile1.pob} onChange={e => setProfile1({...profile1, pob: e.target.value})} placeholder="City, Country" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700]/50 outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile 2 */}
        <div className="bg-[#0A0A12] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs">2</span>
            Profile B
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
              <input type="text" value={profile2.name} onChange={e => setProfile2({...profile2, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700]/50 outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Date of Birth</label>
                <input type="date" value={profile2.dob} onChange={e => setProfile2({...profile2, dob: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700]/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Gender</label>
                <select value={profile2.gender} onChange={e => setProfile2({...profile2, gender: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700]/50 outline-none transition-all appearance-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Time</label>
                <input type="time" value={profile2.tob} onChange={e => setProfile2({...profile2, tob: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700]/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Place</label>
                <input type="text" value={profile2.pob} onChange={e => setProfile2({...profile2, pob: e.target.value})} placeholder="City, Country" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FFD700]/50 outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      <div className="flex justify-center pt-4">
        <button 
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:opacity-90 text-black font-bold py-4 px-12 rounded-xl shadow-2xl transition-all disabled:opacity-50 flex items-center gap-3 text-lg"
        >
          {isAnalyzing ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Computing Deep Synastry...</>
          ) : (
            <>Run Full Compatibility Analysis <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </div>

      {report && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-[#0A0A12] border border-[#FFD700]/30 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FFD700] to-yellow-600" />
          <div className="flex justify-center mb-8">
            <Star className="w-8 h-8 text-[#FFD700]" />
          </div>
          
          <div className="prose prose-invert prose-amber max-w-none 
            prose-headings:font-cinzel prose-headings:text-[#FFD700] prose-headings:tracking-wider prose-headings:text-center
            prose-h2:text-3xl prose-h2:border-b prose-h2:border-[#FFD700]/20 prose-h2:pb-4
            prose-h3:text-xl prose-h3:mt-8
            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg
            prose-li:text-gray-300 prose-li:text-lg
            prose-strong:text-[#FFD700] prose-strong:font-bold
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {report}
            </ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
}
