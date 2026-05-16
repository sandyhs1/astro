import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Circle, Users, Star, Moon, Sun, ArrowRight, Home, Key, Map } from 'lucide-react';

interface ExplainerPanelProps {
  profileId?: string;
  profileName?: string;
}

export default function ExplainerPanel({ profileId, profileName }: ExplainerPanelProps) {
  const [activeTab, setActiveTab] = useState<'intro' | 'houses' | 'planets' | 'signs' | 'connection'>('intro');

  return (
    <div className="flex-1 w-full h-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-100/50 via-purple-50/30 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply opacity-50" />
      
      <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-4 md:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <AnimatePresence mode="wait">
            {activeTab === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-16"
              >
                {/* Section 1: Hero */}
                <section className="text-center space-y-6 pt-8 pb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-indigo-200/50">
                    <Sparkles size={14} /> The Masterclass
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Your Birth Chart, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Explained Like a Story</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Think of your chart as a cosmic house where planets visit different rooms wearing different costumes. Let's demystify the stars.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <button 
                      onClick={() => setActiveTab('houses')}
                      className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      Start the Journey <ArrowRight size={18} />
                    </button>
                  </div>
                </section>

                {/* Section 2: The Big Metaphor */}
                <section className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50">
                  <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">The Cosmic House Metaphor</h2>
                    <p className="text-slate-500">Astrology doesn't have to be complicated. It's just a play happening inside a house.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center hover:bg-white hover:shadow-lg transition-all group">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Home size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Houses = Rooms</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">Your life is divided into 12 areas (career, love, wealth). Each house is a room dedicated to one part of your life.</p>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center hover:bg-white hover:shadow-lg transition-all group">
                      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Users size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Planets = Actors</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">The 9 planets are the actors or visitors walking into these rooms. They bring their unique energy and desires.</p>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center hover:bg-white hover:shadow-lg transition-all group">
                      <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Star size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Signs = Costumes</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">The 12 zodiac signs are the costumes the actors wear. A warrior planet in a peaceful costume acts differently!</p>
                    </div>
                  </div>
                </section>
                
                {/* Final Insight Preview */}
                <div className="text-center px-4">
                  <p className="text-slate-500 font-medium italic">"Your chart is not a sentence. It is a map."</p>
                </div>
              </motion.div>
            )}

            {/* HOUSES TAB */}
            {activeTab === 'houses' && (
              <motion.div
                key="houses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setActiveTab('intro')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm">
                    <ArrowRight size={18} className="rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">The 12 Houses</h2>
                    <p className="text-slate-500 font-medium">The Rooms of Your Cosmic Home</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 bg-slate-50 p-6 md:p-8 border-r border-slate-200">
                    <div className="aspect-square relative w-full max-w-[250px] mx-auto">
                      {/* Abstract North Indian Chart Layout */}
                      <div className="absolute inset-0 border-2 border-indigo-200 rotate-45 transform origin-center rounded-sm"></div>
                      <div className="absolute inset-0 border-2 border-indigo-200 rounded-sm"></div>
                      <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 text-indigo-200">
                        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" />
                        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" />
                        <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" />
                        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" />
                      </svg>
                      
                      {/* Highlighted 1st House */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[40%] bg-indigo-500/20 backdrop-blur-sm polygon-rhombus flex items-center justify-center text-indigo-700 font-bold text-xl">
                        1
                      </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                      <h3 className="text-lg font-bold text-slate-900">North Indian Chart</h3>
                      <p className="text-sm text-slate-500 mt-2">The top diamond is ALWAYS the 1st House (The Front Door). The houses are counted counter-clockwise.</p>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-2/3 p-6 md:p-8 lg:p-10">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">What do the rooms represent?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { num: 1, title: "Self & Identity", desc: "Your body, personality, and the 'front door' of your life." },
                        { num: 2, title: "Wealth & Family", desc: "Savings, speech, and your immediate family." },
                        { num: 3, title: "Courage & Siblings", desc: "Effort, communication, and younger siblings." },
                        { num: 4, title: "Home & Mother", desc: "Inner peace, real estate, and maternal figures." },
                        { num: 5, title: "Children & Intellect", desc: "Creativity, romance, and higher education." },
                        { num: 6, title: "Obstacles & Health", desc: "Debts, enemies, daily routines, and healing." },
                        { num: 7, title: "Partnership & Marriage", desc: "Spouse, business partners, and the public." },
                        { num: 8, title: "Transformation", desc: "Sudden changes, longevity, and hidden knowledge." },
                        { num: 9, title: "Dharma & Luck", desc: "Beliefs, father figures, and long journeys." },
                        { num: 10, title: "Career & Status", desc: "Profession, public image, and your highest goals." },
                        { num: 11, title: "Gains & Network", desc: "Large groups, profits, and fulfillment of desires." },
                        { num: 12, title: "Loss & Liberation", desc: "Sleep, foreign lands, spirituality, and letting go." }
                      ].map(house => (
                        <div key={house.num} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-black flex items-center justify-center shrink-0">
                            {house.num}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{house.title}</h4>
                            <p className="text-xs text-slate-500 leading-snug">{house.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button onClick={() => setActiveTab('planets')} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                        Next: The Planets <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PLANETS TAB */}
            {activeTab === 'planets' && (
              <motion.div
                key="planets"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setActiveTab('houses')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm">
                    <ArrowRight size={18} className="rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">The 9 Planets</h2>
                    <p className="text-slate-500 font-medium">The Actors Walking Through Your Rooms</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { name: "Sun (Surya)", role: "The King", desc: "Ego, soul, confidence, father.", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", icon: <Sun size={24} /> },
                    { name: "Moon (Chandra)", role: "The Queen", desc: "Emotions, mind, mother, comfort.", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", icon: <Moon size={24} /> },
                    { name: "Mars (Mangal)", role: "The Warrior", desc: "Energy, courage, logic, anger.", color: "text-red-600", bg: "bg-red-50", border: "border-red-100", icon: <Circle size={24} /> },
                    { name: "Mercury (Budh)", role: "The Prince", desc: "Intellect, speech, business, humor.", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: <Circle size={24} /> },
                    { name: "Jupiter (Guru)", role: "The Teacher", desc: "Wisdom, wealth, expansion, luck.", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: <Circle size={24} /> },
                    { name: "Venus (Shukra)", role: "The Artist", desc: "Love, beauty, luxury, relationships.", color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100", icon: <Circle size={24} /> },
                    { name: "Saturn (Shani)", role: "The Judge", desc: "Discipline, karma, delays, structure.", color: "text-slate-800", bg: "bg-slate-100", border: "border-slate-300", icon: <Circle size={24} /> },
                    { name: "Rahu", role: "The Illusionist", desc: "Obsession, taboo, worldly desire.", color: "text-indigo-800", bg: "bg-indigo-50", border: "border-indigo-200", icon: <Circle size={24} /> },
                    { name: "Ketu", role: "The Monk", desc: "Detachment, past lives, spirituality.", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", icon: <Circle size={24} /> }
                  ].map(planet => (
                    <div key={planet.name} className={`bg-white rounded-2xl border ${planet.border} p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
                      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${planet.bg} opacity-50 group-hover:scale-150 transition-transform duration-500`} />
                      <div className={`w-12 h-12 rounded-xl ${planet.bg} ${planet.color} flex items-center justify-center mb-4 relative z-10`}>
                        {planet.icon}
                      </div>
                      <h3 className={`text-xl font-bold text-slate-900 mb-1 relative z-10`}>{planet.name}</h3>
                      <p className={`text-sm font-bold ${planet.color} mb-3 relative z-10`}>{planet.role}</p>
                      <p className="text-slate-600 text-sm leading-relaxed relative z-10">{planet.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-8">
                  <button onClick={() => setActiveTab('signs')} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                    Next: The Signs <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SIGNS TAB */}
            {activeTab === 'signs' && (
              <motion.div
                key="signs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setActiveTab('planets')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm">
                    <ArrowRight size={18} className="rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">The 12 Signs</h2>
                    <p className="text-slate-500 font-medium">The Costumes and Environments</p>
                  </div>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl">
                  <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
                    If planets are actors, signs are the costumes they wear and the mood of the room they are in. Mars (the warrior) acts very differently in Aries (a fiery battlefield) compared to Cancer (a cozy emotional home).
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: "Aries", element: "Fire", trait: "Pioneering, Bold" },
                      { name: "Taurus", element: "Earth", trait: "Stable, Sensual" },
                      { name: "Gemini", element: "Air", trait: "Curious, Adaptable" },
                      { name: "Cancer", element: "Water", trait: "Nurturing, Protective" },
                      { name: "Leo", element: "Fire", trait: "Dramatic, Generous" },
                      { name: "Virgo", element: "Earth", trait: "Analytical, Helpful" },
                      { name: "Libra", element: "Air", trait: "Harmonious, Fair" },
                      { name: "Scorpio", element: "Water", trait: "Intense, Deep" },
                      { name: "Sagittarius", element: "Fire", trait: "Adventurous, Honest" },
                      { name: "Capricorn", element: "Earth", trait: "Disciplined, Ambitious" },
                      { name: "Aquarius", element: "Air", trait: "Innovative, Rebel" },
                      { name: "Pisces", element: "Water", trait: "Dreamy, Empathetic" }
                    ].map(sign => (
                      <div key={sign.name} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 transition-colors">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">{sign.element}</div>
                        <h4 className="font-bold text-slate-900 mb-1">{sign.name}</h4>
                        <p className="text-xs text-slate-500">{sign.trait}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <Key className="text-indigo-600" size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-indigo-900 mb-2">The Ascendant (Lagna)</h4>
                      <p className="text-sm text-indigo-700/80 leading-relaxed">
                        The sign that was rising on the Eastern horizon the exact minute you were born. It determines the "costume" of your 1st House, setting the entire layout of your cosmic house!
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button onClick={() => setActiveTab('connection')} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                      Next: Bringing It Together <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* HOW IT CONNECTS TAB */}
            {activeTab === 'connection' && (
              <motion.div
                key="connection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8 pb-12"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setActiveTab('signs')} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm">
                    <ArrowRight size={18} className="rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">How It All Connects</h2>
                    <p className="text-slate-500 font-medium">Reading the Story</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Story Example 1 */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Sun size={120} />
                    </div>
                    <div className="flex gap-3 mb-6 relative z-10">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 font-bold text-xs rounded-full">Sun (Actor)</span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-full">10th House (Room)</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">The King in the Office</h3>
                    <p className="text-slate-600 leading-relaxed relative z-10">
                      The Sun (confidence, leadership) visits the 10th House (career, status). <br/><br/>
                      <strong>The Story:</strong> This person wants to shine and be recognized in their profession. They are likely to take on leadership roles and seek public authority.
                    </p>
                  </div>

                  {/* Story Example 2 */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Moon size={120} />
                    </div>
                    <div className="flex gap-3 mb-6 relative z-10">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full">Moon (Actor)</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold text-xs rounded-full">4th House (Room)</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">The Queen at Home</h3>
                    <p className="text-slate-600 leading-relaxed relative z-10">
                      The Moon (emotions, comfort) visits the 4th House (home, inner peace). <br/><br/>
                      <strong>The Story:</strong> This person is deeply connected to their family and physical home. Their emotional security comes from having a peaceful, private sanctuary.
                    </p>
                  </div>

                </div>

                <div className="mt-12 text-center bg-indigo-900 text-white p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
                  <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rotate-12 blur-3xl"></div>
                  
                  <div className="relative z-10 max-w-2xl mx-auto">
                    <Sparkles className="mx-auto text-amber-400 mb-6" size={40} />
                    <h3 className="text-3xl md:text-4xl font-bold mb-6">Your Chart is a Map, Not a Sentence.</h3>
                    <p className="text-lg md:text-xl text-indigo-100/90 leading-relaxed mb-8">
                      Planets do not force your fate; they indicate patterns. Understanding your chart helps you navigate life with awareness, rather than simply reacting to it.
                    </p>
                    <button onClick={() => setActiveTab('intro')} className="px-8 py-3 rounded-full bg-white text-indigo-900 font-bold hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl">
                      Back to Start
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      
      {/* Footer Navigation Tabs */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-2 md:p-4 overflow-x-auto custom-scrollbar">
          {[
            { id: 'intro', label: 'Start' },
            { id: 'houses', label: '1. Houses' },
            { id: 'planets', label: '2. Planets' },
            { id: 'signs', label: '3. Signs' },
            { id: 'connection', label: '4. Summary' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
