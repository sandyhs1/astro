"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MENU = [
  { id: "chat",            icon: "💬", label: "Oracle Chat",      badge: "LIVE" },
  { id: "destiny",         icon: "🗓️", label: "Destiny Window",   badge: null },
  { id: "karma-dna",       icon: "🧬", label: "Karma DNA",        badge: null },
  { id: "karmic-patterns", icon: "🔮", label: "Karmic Patterns",  badge: null },
  { id: "remedy",          icon: "📿", label: "Remedy Engine",    badge: "STRICT" },
  { id: "details",         icon: "📋", label: "My Details",       badge: null },
  { id: "royal-roast",     icon: "🔥", label: "Royal Roast",      badge: null },
  { id: "gotra",           icon: "🕉️", label: "Your Gotra",       badge: "NEW" },
  { id: "ishta-devata",    icon: "🙏", label: "Ishta Devata",     badge: "NEW" },
  { id: "journal",         icon: "🎙️", label: "Life Journal",     badge: "FREE" },
  { id: "roadmap",         icon: "🗺️", label: "Roadmap",          badge: "NEW" },
];

const SCENE_DURATION = 3800;

function OracleChatPanel() {
  return (
    <div className="h-full flex flex-col p-8">
      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">Oracle Chat · Intelligence Interface</div>
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
        <motion.div initial={{ opacity: 0, x: -30, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.5 }} className="self-start max-w-[85%] bg-slate-50 border border-slate-200 rounded-3xl rounded-tl-sm p-5 text-sm text-slate-800 shadow-sm font-medium">
          I am your Quantum Karma Astrologer. I have analyzed your Scorpio ascendant and your current Jupiter Mahadasha. How can I assist you today?
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="self-end max-w-[80%] bg-indigo-600 text-white rounded-3xl rounded-tr-sm p-5 text-sm shadow-md font-bold">
          What is the exact karmic purpose behind my current business obstacles?
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: 1.2 }} className="self-start max-w-[90%] bg-slate-50 border border-slate-200 rounded-3xl rounded-tl-sm p-5 text-sm text-slate-800 shadow-sm font-medium">
          <p className="mb-3">Your 10th house of career is ruled by the Sun, which is currently undergoing a severe transit block by Saturn.</p>
          <p>This is <strong className="text-indigo-700 font-black">not a punishment, but a structural pruning phase</strong>. The universe is intentionally dissolving revenue streams that do not serve your ultimate 2027 destiny. Surrender control over the immediate outcome for the next 4 months.</p>
        </motion.div>
      </div>
    </div>
  );
}

function DestinyPanel() {
  const days = Array.from({length: 30}, (_, i) => {
    const day = i + 1;
    const isRed = [3, 4, 12, 13, 21, 26, 27].includes(day);
    return { day, isRed };
  });

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">Destiny Window · 30-Day Transit Matrix</div>
      
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-red-500 rounded-sm shadow-sm"></div><span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Danger / Ashtamasthana</span></div>
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm shadow-sm"></div><span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Favorable / Exaltation</span></div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map(d => (
          <motion.div 
            key={d.day} 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ delay: d.day * 0.02, type: "spring", stiffness: 300 }}
            className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 shadow-sm ${d.isRed ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
          >
            <span className="text-lg font-black">{d.day}</span>
            <span className="text-[8px] font-bold uppercase tracking-wider">{d.isRed ? 'AVOID' : 'ACT'}</span>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="mt-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
        <strong className="text-slate-900 text-sm font-black uppercase tracking-widest">Transit Note:</strong>
        <p className="text-sm text-slate-700 mt-2 font-medium leading-relaxed">Dates highlighted in red (e.g., 12th and 13th) represent the Moon transiting your 8th house (Scorpio). Expect severe emotional volatility, sudden expenses, and betrayal. Do not sign contracts or initiate negotiations on these dates.</p>
      </motion.div>
    </div>
  );
}

function KarmaDNAPanel() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">Karma DNA · Deep Soul Blueprint</div>
      <div className="flex gap-5 mb-8">
        <motion.div initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", duration: 1 }} className="w-20 h-20 rounded-full border-2 border-indigo-200 flex items-center justify-center bg-indigo-50 shrink-0 shadow-inner">
          <span className="text-4xl">♏</span>
        </motion.div>
        <div>
          <div className="text-xl font-black text-slate-900 mb-1 tracking-tight">Scorpio Ascendant · Ketu Ruled</div>
          <div className="text-sm text-slate-600 leading-relaxed font-medium">
            Your rising sign at 18°42′ Jyeshtha Nakshatra points to a soul that has undergone intense transformations. You are here to decode hidden truths.
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-900 text-base tracking-tight">Past Life Indication</h3>
            <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-1 rounded uppercase tracking-wider">Rahu-Ketu Axis</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-3 font-medium">
            <strong className="text-slate-900 font-bold">Planetary Proof:</strong> Ketu in 1st House (Scorpio) opposite Rahu in 7th House (Taurus).
          </p>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            <strong className="text-slate-900 font-bold">Karmic Imprint:</strong> In previous incarnations, you operated as a solitary mystic or researcher. Your current life challenge is to master the art of deep, balanced partnerships without losing your spiritual depth.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function KarmicPatternsPanel() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">Karmic Patterns · Baggage & Rina</div>
      <div className="space-y-6">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
          <h3 className="font-black text-slate-900 text-lg mb-1 tracking-tight">Matri Rina (Maternal Debt)</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Proof: Afflicted Moon in 4th House</p>
          <p className="text-sm text-slate-700 leading-relaxed font-medium mb-5">
            You carry inherited maternal trauma manifesting as chronic housing instability and a persistent inability to feel "at home" anywhere. Your baseline emotional state is hyper-vigilance.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Mandatory Action</span>
            <span className="text-sm font-black text-slate-800">Feed stray animals on Mondays. Never disrespect maternal figures, regardless of provocation.</span>
          </div>
        </motion.div>

        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
          <h3 className="font-black text-slate-900 text-lg mb-1 tracking-tight">Bhratri Rina (Sibling Debt)</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Proof: Mars conjunct Ketu in 3rd House</p>
          <p className="text-sm text-slate-700 leading-relaxed font-medium mb-5">
            Severe betrayal trauma from siblings or close peers in a past incarnation. In this life, partnerships formed with equals will consistently end in sudden, aggressive dissolution.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Mandatory Action</span>
            <span className="text-sm font-black text-slate-800">Maintain strict financial boundaries. Never mix business with family or close friends.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RemedyPanel() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">Remedy Engine · Resonant Frequency Correction</div>
      <div className="space-y-6">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-black text-slate-900 text-xl mb-1 tracking-tight">Rahu Mahadasha Suppression</h3>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Target: 7th House Illusion & Anxiety</p>
            </div>
            <div className="bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-inner">Primary Beej</div>
          </div>
          
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-900/40 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out"></div>
            <div className="relative z-10 text-2xl font-black text-white text-center mb-2 tracking-wide drop-shadow-md">Om Bhram Bhreem Bhroum Sah Rahave Namah</div>
            <div className="relative z-10 text-center text-xs text-indigo-400 font-bold font-mono tracking-widest uppercase">108 Hz Frequency</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Impact & Mechanism</div>
              <div className="text-sm text-slate-800 font-semibold leading-relaxed">Severely grounds erratic energy. Instantly collapses obsessive mental loops and paranoia regarding partnerships. Forces the mind to perceive objective reality.</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Execution Protocol</div>
              <ul className="text-sm text-slate-800 font-semibold leading-relaxed list-disc ml-4 space-y-1">
                <li>108 recitations (1 Mala)</li>
                <li>Strictly post-sunset</li>
                <li>Face South-West</li>
                <li>Minimum 41 consecutive days</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DetailsPanel() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">My Details · Technical Chart Data</div>
      <div className="grid grid-cols-2 gap-5">
        {[
          ["Lagna (Ascendant)", "Scorpio 18°42′ · Jyeshtha", "bg-slate-50 text-slate-800"],
          ["Atmakaraka (Soul Planet)", "Sun 29°12′ · Magha", "bg-amber-50 text-amber-900"],
          ["Moon Nakshatra", "Revati Pada 4", "bg-indigo-50 text-indigo-900"],
          ["Vimshopaka Bala", "78.4 / 100", "bg-purple-50 text-purple-900"],
          ["Panchanga Tithi", "Shukla Panchami", "bg-slate-50 text-slate-800"],
          ["Yoga & Karana", "Siddhi Yoga / Bava Karana", "bg-slate-50 text-slate-800"],
          ["Navamsa (D9) Lagna", "Sagittarius", "bg-blue-50 text-blue-900"],
          ["Dasamsa (D10) Lagna", "Leo", "bg-rose-50 text-rose-900"],
        ].map(([k,v,c], i) => (
          <motion.div key={k} initial={{ opacity:0, y:20, scale: 0.95 }} animate={{ opacity:1, y:0, scale: 1 }} transition={{ delay: i*0.08, type: "spring" }} className={`p-5 rounded-2xl border border-slate-200 shadow-sm hover:scale-[1.02] transition-transform cursor-default ${c}`}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">{k}</div>
            <div className="text-sm font-black">{v}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RoyalRoastPanel() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-6">Royal Roast 🔥 · Brutal Truths</div>
      <div className="space-y-5">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-gradient-to-br from-red-50 to-orange-50 border border-orange-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-orange-900 mb-3 uppercase tracking-widest border-b border-orange-200/50 pb-2">Career: The Martyr Complex</h3>
          <p className="text-sm text-orange-950 leading-relaxed font-semibold">
            <strong className="text-red-700 font-black bg-red-100/50 px-1 rounded">Saturn in 10th House:</strong> You are destined to carry the heaviest operational load while incompetent peers take the credit. Expect a severe structural collapse in your career at age 32, forcing a brutal pivot. Stop trying to shortcut the hierarchy; you will be caught and penalized.
          </p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-rose-900 mb-3 uppercase tracking-widest border-b border-rose-200/50 pb-2">Love & Marriage: The Auditor</h3>
          <p className="text-sm text-rose-950 leading-relaxed font-semibold">
            <strong className="text-red-700 font-black bg-red-100/50 px-1 rounded">Venus Debilitated in Virgo:</strong> You do not date; you conduct audits. You are destined to reject perfectly viable partners over trivial flaws, ensuring prolonged isolation. Marriage is strictly delayed until your late 30s. Any earlier attempt will end in aggressive litigation.
          </p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-amber-900 mb-3 uppercase tracking-widest border-b border-amber-200/50 pb-2">Wealth: The Void</h3>
          <p className="text-sm text-amber-950 leading-relaxed font-semibold">
            <strong className="text-red-700 font-black bg-red-100/50 px-1 rounded">Rahu in 2nd House:</strong> You have an insatiable, erratic financial appetite. You will experience massive, unearned windfalls followed immediately by catastrophic drains due to impulsive, ego-driven investments. You cannot hold liquid cash; lock it in assets immediately.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function GotraPanel() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-6">Your Gotra · Genetic Lineage</div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-6 mb-8 bg-amber-50 border border-amber-200 p-6 rounded-3xl shadow-sm">
        <div className="text-6xl drop-shadow-md">🕉️</div>
        <div>
          <h2 className="text-3xl font-black text-amber-800 tracking-tight">Kashyapa Gotra</h2>
          <p className="text-xs text-amber-600 font-black uppercase tracking-widest mt-2 bg-amber-100 inline-block px-2 py-1 rounded">Derived from Revati Pada 4</p>
        </div>
      </motion.div>
      <div className="space-y-5">
        <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ delay: 0.1 }} className="border-l-4 border-amber-500 pl-5 py-2">
          <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Meaning & Lineage</h4>
          <p className="text-sm text-slate-800 font-semibold leading-relaxed">Descended directly from Sage Kashyapa, one of the original Saptarishis (Seven Sages) and the primal progenitor of universal creation. The Pravara (lineage path) is Kashyapa, Avatsara, Naidhruva.</p>
        </motion.div>
        <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ delay: 0.2 }} className="border-l-4 border-amber-500 pl-5 py-2">
          <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Significance & Impact</h4>
          <p className="text-sm text-slate-800 font-semibold leading-relaxed">This specific bloodline carries the genetic and spiritual memory of systemic expansion and preservation. You are wired for endurance. You carry the "Pitri Rina" (ancestral debt) of unresolved territorial boundary violations.</p>
        </motion.div>
        <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ delay: 0.3 }} className="border-l-4 border-amber-500 pl-5 py-2">
          <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Strategic Advantage</h4>
          <p className="text-sm text-slate-800 font-semibold leading-relaxed">Channel this preservation energy into building generational wealth structures or institutional frameworks. You are genetically unsuitable for gig-work or freelancing; your lineage demands you build an empire that outlasts your physical lifespan.</p>
        </motion.div>
      </div>
    </div>
  );
}

function IshtaDevataPanel() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">Ishta Devata · Divine Guardian</div>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-6 mb-8 bg-indigo-50 border border-indigo-200 p-6 rounded-3xl shadow-sm">
        <div className="text-6xl drop-shadow-md">🦚</div>
        <div>
          <h2 className="text-3xl font-black text-indigo-800 tracking-tight">Lord Kartikeya</h2>
          <p className="text-xs text-indigo-600 font-black uppercase tracking-widest mt-2 bg-indigo-100 inline-block px-2 py-1 rounded">The Commander of the Divine Army</p>
        </div>
      </motion.div>
      <div className="space-y-5">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Astrological Proof & Meaning</h4>
          <p className="text-sm text-slate-800 font-semibold leading-relaxed">Identified via your Atmakaraka (Sun) situated in the Leo Navamsa. The 12th house from this Karakamsa contains Mars. This exact alignment designates Kartikeya. He represents fierce, uncompromising action and tactical warfare.</p>
        </motion.div>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Significance & Impact</h4>
          <p className="text-sm text-slate-800 font-semibold leading-relaxed">His presence in your chart grants absolute tactical supremacy and actively removes karmic delays in professional execution. He destroys hesitation and internal doubt.</p>
        </motion.div>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.3 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
          <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">How to Take Advantage</h4>
          <p className="text-sm text-slate-200 font-semibold leading-relaxed mb-4">When facing insurmountable corporate or legal battles, utilize his frequency. He does not grant peace; he grants victory through conflict.</p>
          <div className="bg-black/60 p-4 rounded-xl border border-slate-700 text-center">
            <div className="text-xl font-black text-indigo-300 tracking-wide">Om Sharavanabhavaya Namah</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LifeJournalPanel() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">Life Journal · Neuro-Acoustic Analysis 🎙️</div>
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center mb-6 shadow-inner">
        <div className="flex justify-center gap-1.5 mb-6 h-16 items-end">
          {[0.2, 0.5, 0.8, 0.4, 0.9, 0.6, 0.3, 0.7, 0.5, 0.8, 0.2, 0.6, 0.9, 0.4].map((h, i) => (
            <motion.div key={i} animate={{ height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: i*0.08 }} className="w-3 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-sm shadow-md" />
          ))}
        </div>
        <div className="text-sm font-black text-indigo-700 uppercase tracking-widest animate-pulse">Analyzing voice frequencies...</div>
      </motion.div>
      <div className="grid grid-cols-2 gap-5">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Sentiment</div>
          <div className="text-2xl font-black text-emerald-600">Hopeful · 84%</div>
        </motion.div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Underlying Intent</div>
          <div className="text-2xl font-black text-indigo-600">Seeking validation</div>
        </motion.div>
      </div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="mt-5 bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
        <strong className="text-indigo-800 text-sm font-black uppercase tracking-widest">Astrological Correlation:</strong>
        <p className="text-sm text-slate-700 mt-2 font-semibold leading-relaxed">Your vocal tension levels have dropped by 18% correlating exactly with the Moon exiting your 8th House. This emotional stabilization is astronomically validated.</p>
      </motion.div>
    </div>
  );
}

function RoadmapPanel() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">Intelligence Roadmap · Evolution 🗺️</div>
      <div className="space-y-4">
        {[
          { label: "Deep Compatibility Matrix", status: "In Development", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Muhurat (Auspicious Timing) Engine", status: "In Development", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Medical Astrology Risk Scanner", status: "Q4 2026", color: "text-slate-500", bg: "bg-slate-50" },
          { label: "Geodetic Relocation Maps", status: "Q1 2027", color: "text-slate-500", bg: "bg-slate-50" }
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ x:-30, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ delay: i*0.1, type: "spring" }} className={`flex justify-between items-center p-5 rounded-2xl border border-slate-200 hover:scale-[1.02] transition-transform cursor-default ${item.bg}`}>
            <div className="text-sm font-black text-slate-800">{item.label}</div>
            <div className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const PANELS: Record<string, ()=>React.ReactElement> = {
  "chat": OracleChatPanel,
  "destiny": DestinyPanel,
  "karma-dna": KarmaDNAPanel,
  "karmic-patterns": KarmicPatternsPanel,
  "remedy": RemedyPanel,
  "details": DetailsPanel,
  "royal-roast": RoyalRoastPanel,
  "gotra": GotraPanel,
  "ishta-devata": IshtaDevataPanel,
  "journal": LifeJournalPanel,
  "roadmap": RoadmapPanel,
};

export default function DashboardAnimation() {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIdx(i => (i + 1) % MENU.length);
    }, SCENE_DURATION);
    return () => clearInterval(t);
  }, []);

  const activeMenu = MENU[activeIdx];
  const ActivePanel = PANELS[activeMenu.id];

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[740px] flex items-center justify-center font-sans perspective-1000 group">
      
      {/* Background Cinematic Glows */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/40 via-purple-100/30 to-rose-100/40 rounded-[3rem] blur-3xl opacity-60 pointer-events-none transition-opacity duration-1000"></div>

      {/* Main Dashboard Window with 3D Hover Float */}
      <motion.div 
        className="relative z-10 w-[1050px] h-[680px] bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden flex flex-col"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -5, scale: 1.01, boxShadow: "0 40px 80px -20px rgba(0,0,0,0.2)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Browser Chrome / Header */}
        <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center px-5 justify-between shrink-0">
          <div className="flex items-center gap-2.5 w-1/3">
            <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-sm hover:bg-red-500 transition-colors"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm hover:bg-amber-500 transition-colors"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm hover:bg-green-500 transition-colors"></div>
          </div>
          <div className="w-1/3 flex justify-center">
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-1.5 text-[11px] font-mono text-slate-500 shadow-sm flex items-center gap-2 font-semibold">
              <span className="text-slate-400">🔒</span> app.quantumkarma.in
            </div>
          </div>
          <div className="w-1/3 flex justify-end items-center gap-4">
            <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full shadow-inner tracking-widest uppercase">
              ⚡ 42 Credits
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center text-xs font-bold shadow-md ring-2 ring-white cursor-pointer hover:scale-110 transition-transform">
              RK
            </div>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="flex flex-1 overflow-hidden relative" ref={containerRef}>
          {/* Sidebar */}
          <div className="w-[240px] bg-slate-50 border-r border-slate-200 p-5 flex flex-col shrink-0 relative z-20 shadow-[5px_0_15px_-5px_rgba(0,0,0,0.02)]">
            <div className="mb-8">
              <h1 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <span className="w-6 h-6 rounded flex items-center justify-center bg-indigo-600 text-white text-[11px] shadow-sm">✦</span>
                Quantum Karma
              </h1>
            </div>

            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Features</div>
            
            <div className="relative flex-1 space-y-1">
              {/* Animated Sidebar Active Highlight Background */}
              <motion.div 
                className="absolute left-0 right-0 h-[48px] bg-white border border-indigo-100 rounded-xl shadow-sm z-0"
                initial={false}
                animate={{ top: activeIdx * 52 }} // 48px height + 4px gap
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />

              {MENU.map((item, i) => {
                const isActive = i === activeIdx;
                return (
                  <div 
                    key={item.id} 
                    className={`relative z-10 flex items-center gap-3.5 px-3 py-3 h-[48px] rounded-xl transition-colors duration-300 ${isActive ? "text-indigo-700 font-black" : "text-slate-600 font-bold hover:bg-slate-100/50 hover:text-slate-900"}`}
                  >
                    <span className="text-xl drop-shadow-sm">{item.icon}</span>
                    <span className="text-[13px] flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-sm ${isActive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative bg-white overflow-hidden bg-dot-pattern">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMenu.id}
                initial={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.06, filter: "blur(4px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="h-full origin-center"
              >
                <ActivePanel />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Animated Mouse Cursor tracking the sidebar items */}
      <motion.div
        className="absolute z-50 pointer-events-none"
        initial={{ x: 0, y: 0 }}
        animate={{ 
          x: 140, // X position hovering over sidebar
          y: 200 + activeIdx * 52 // Y position matching sidebar item height + gap + header offset
        }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        style={{ originX: 0, originY: 0 }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
          <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L6.35 3.35c-.31-.31-.85-.09-.85.36z" fill="#1e293b" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round"/>
        </svg>
        
        {/* Click Ripple Effect */}
        <motion.div 
          key={`click-${activeIdx}`}
          initial={{ scale: 0.5, opacity: 0.9, borderWidth: "4px" }}
          animate={{ scale: 3.5, opacity: 0, borderWidth: "0px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
          className="absolute top-1 left-1 w-5 h-5 rounded-full border-indigo-500 bg-indigo-400/30"
        />
      </motion.div>

      {/* Add subtle background pattern via CSS */}
      <style>{`
        .bg-dot-pattern {
          background-image: radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>
    </div>
  );
}
