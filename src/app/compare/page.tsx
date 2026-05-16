'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ChevronLeft, Sparkles, Star, Cpu, Heart, MessageCircle, 
  Database, Activity, Zap, CheckCircle2, XCircle, ShieldCheck
} from 'lucide-react';

type Competitor = 'costar' | 'chani' | 'astrotalk' | 'astrosage' | 'pattern' | 'sanctuary' | 'timepassages';

export default function ComparePage() {
  const [activeTab, setActiveTab] = useState<Competitor>('costar');

  const COMPETITORS = {
    costar: {
      name: 'Co-Star',
      tagline: 'The Social Phenomenon',
      icon: <Star size={18} />,
      tldr: 'Co-Star is the ultimate social astrology experience for the Instagram generation. Quantum Karma is a diagnostic instrument for breaking karmic loops using raw Vedic math.',
      superpower: 'Co-Star completely revolutionized how we talk about astrology. Their minimalist design, NASA JPL astronomical data, and blunt, meme-worthy push notifications made horoscopes a shared cultural experience. If you want to compare sun signs with friends at a party, Co-Star is unmatched.',
      difference: 'Co-Star uses the Western Tropical zodiac, which is based on seasons and currently ~24 degrees off from the actual physical sky. It focuses on surface-level placements (Sun, Moon, Rising) and uses algorithms to match those to pre-written text. Quantum Karma uses the Sidereal (Vedic) zodiac, calculating your exact position against the physical constellations. We compute advanced metrics like Nakshatras, Dasha timing cycles, and divisional charts (up to D-60) to provide a structural diagnosis of your life path, rather than a daily mood update.',
      features: [
        { name: 'Zodiac System', them: 'Western Tropical', us: 'Vedic Sidereal (Astronomically accurate)' },
        { name: 'Predictive Timing', them: 'Basic Transits', us: 'Vimshottari & Jaimini Dashas' },
        { name: 'Remedies', them: 'None', us: 'Mantras, Rituals, Karma Alignment' },
        { name: 'Vibe', them: 'Social & Provocative', us: 'Diagnostic & Uncompromising' },
      ]
    },
    chani: {
      name: 'CHANI',
      tagline: 'The Affirming Guide',
      icon: <Heart size={18} />,
      tldr: 'CHANI offers beautiful, affirming, socially conscious Western astrology. Quantum Karma delivers blunt, mathematically rigorous Vedic diagnostics.',
      superpower: 'CHANI is a masterpiece of emotional intelligence and inclusive design. Their weekly horoscopes, podcast integrations, and focus on self-care and affirmation provide a deeply nurturing space. It is the perfect app for emotional validation and progressive cosmic reflection.',
      difference: 'CHANI is built on Western Tropical astrology and emphasizes psychological healing and affirmation. Quantum Karma takes a fundamentally different philosophical approach: Parashari and Jaimini Vedic astrology. We do not focus on psychological validation; we focus on structural reality. By calculating your Lajjitadi Avasthas (planetary behavioral states) and Upapada Lagna, we diagnose exactly why certain areas of your life are blocked and provide the mathematical remedies to bypass those karmic constraints.',
      features: [
        { name: 'Core Focus', them: 'Emotional Affirmation', us: 'Structural Life Diagnostics' },
        { name: 'Divisional Charts', them: 'D-1 (Natal only)', us: 'D-1 through D-60' },
        { name: 'Calculation Depth', them: 'Standard Planetary Degrees', us: 'Shadbala & Ashtakavarga Points' },
        { name: 'Vibe', them: 'Nurturing & Inclusive', us: 'Technical & Blunt' },
      ]
    },
    astrotalk: {
      name: 'Astrotalk',
      tagline: 'The Freelance Marketplace',
      icon: <MessageCircle size={18} />,
      tldr: 'Astrotalk connects you with human astrologers paying by the minute. Quantum Karma gives you instant, unified, top-tier calculation without the ticking clock.',
      superpower: 'Astrotalk built a massive marketplace that made connecting with a live Vedic astrologer in India as easy as ordering food. For users who strictly want human-to-human interaction and are willing to browse reviews to find a practitioner they vibe with, their platform scale is incredible.',
      difference: 'Astrotalk relies entirely on the individual freelancer you happen to select. The quality, accuracy, and depth of the reading vary wildly depending on their mood, memory, and calculation speed while the per-minute timer drains your wallet. Quantum Karma removes the human error and the ticking clock. Our engine instantly synthesizes millions of classical data points—including complex calculations like Mrityu Bhaga and Pranapada—that a human cannot compute in their head, delivering a hyper-targeted, unified intelligence report at a flat rate.',
      features: [
        { name: 'Delivery Model', them: 'Per-minute Chat/Call', us: 'Instant Intelligence Report' },
        { name: 'Consistency', them: 'Varies by Freelancer', us: '100% Unified & Flawless' },
        { name: 'Upsells', them: 'Frequent Gemstone Upsells', us: 'Zero Upsells. Ever.' },
        { name: 'Vibe', them: 'Human Consultation', us: 'Data-Driven Autonomy' },
      ]
    },
    astrosage: {
      name: 'Astrosage',
      tagline: 'The Legacy Calculator',
      icon: <Database size={18} />,
      tldr: 'Astrosage is a powerhouse of raw Vedic calculations wrapped in a legacy UI. Quantum Karma takes that same hardcore math and synthesizes it into actionable, modern intelligence.',
      superpower: 'Astrosage is the undisputed OG of digital Vedic astrology. Their calculation engine is historically robust, offering an overwhelming amount of raw data, charts, and tables for free. For traditional astrologers who just need a quick ephemeris lookup, it remains a vital utility.',
      difference: 'Astrosage generates raw data—massive, confusing PDFs and endless tables wrapped in intrusive pop-up ads and 1990s web frameworks. It leaves the synthesis entirely up to you. Quantum Karma takes the same uncompromising Sidereal math and processes it. We do not just show you a grid of your Ashtakavarga points; our AI engine synthesizes what those points mean for your career timing this specific month, delivered in a stunning, premium, ad-free mobile interface.',
      features: [
        { name: 'User Interface', them: 'Legacy 1990s Web', us: 'Premium, Modern App' },
        { name: 'Data Output', them: 'Raw Tables & PDFs', us: 'Synthesized AI Intelligence' },
        { name: 'Monetization', them: 'Intrusive Ads & Popups', us: 'Clean Subscription / Credits' },
        { name: 'Vibe', them: 'Cluttered Utility', us: 'Sleek & Actionable' },
      ]
    },
    pattern: {
      name: 'The Pattern',
      tagline: 'The Psychological Mirror',
      icon: <Activity size={18} />,
      tldr: 'The Pattern excels at psychological behavioral analysis based on transits. Quantum Karma exposes the actual math to help you break those patterns.',
      superpower: 'The Pattern is genius at translating complex astrological transits into hyper-relatable psychological insights. Their relationship dynamics and "timing" descriptions are incredibly well-written. They successfully made astrology accessible by completely hiding the astrology.',
      difference: 'The Pattern obfuscates its mechanics—it tells you what your pattern is, but hides the planets and the math behind a black box. Quantum Karma believes in total transparency. We do not just tell you that you have a "relationship loop"; we show you the exact Upapada Lagna and Navamsa placements causing it. By exposing the raw Vedic mechanics, we give you the diagnostic tools to actually rewrite your code, rather than just observing it.',
      features: [
        { name: 'Astrology Visibility', them: 'Hidden (Black Box)', us: 'Exposed & Explained' },
        { name: 'System', them: 'Western Tropical', us: 'Vedic Sidereal' },
        { name: 'Remedial Action', them: 'Observation', us: 'Actionable Protocols' },
        { name: 'Vibe', them: 'Psychological Insight', us: 'Mathematical Diagnosis' },
      ]
    },
    sanctuary: {
      name: 'Sanctuary',
      tagline: 'Astrology on Demand',
      icon: <Zap size={18} />,
      tldr: 'Sanctuary offers beautiful daily horoscopes and quick Western astrology text chats. Quantum Karma provides deep, systemic Vedic life navigation.',
      superpower: 'Sanctuary created a beautifully branded, highly accessible "astrology on demand" service. Their daily free content is visually stunning, and their text-based readings provide a quick, low-friction way to get basic Western astrological insights on the go.',
      difference: 'Sanctuary focuses on quick-hit Western readings and daily micro-content. Quantum Karma is built for systemic life strategy. We do not do "quick hits." Our Destiny Window maps your entire 30-day timeline using precise Nakshatra transits and granular Tithi data, while our Karma DNA engine processes your entire karmic blueprint. It is the difference between a daily vitamin and a full-body MRI.',
      features: [
        { name: 'Engagement', them: 'Daily Micro-Content', us: 'Deep Systemic Reports' },
        { name: 'Chat Mechanics', them: 'Human Text Chat', us: 'High-Fidelity AI Synthesis' },
        { name: 'Predictive Scope', them: 'Daily Horoscopes', us: '30-Day Destiny Window' },
        { name: 'Vibe', them: 'Accessible & Bright', us: 'Deep & Clinical' },
      ]
    },
    timepassages: {
      name: 'Time Passages',
      tagline: 'The Western Standard',
      icon: <Cpu size={18} />,
      tldr: 'Time Passages is the technical gold standard for Western astrology. Quantum Karma brings that level of rigor to the superior predictive timing of the Vedic system.',
      superpower: 'Time Passages is beloved by professional Western astrologers for a reason. Their calculation engine is superb, their transit graphs are excellent, and their app is packed with highly technical, accurate data for the Tropical system.',
      difference: 'Time Passages represents the absolute peak of what Western Tropical astrology can offer. However, Western astrology inherently lacks the predictive timing mechanics unique to the East. Quantum Karma utilizes the Vedic Sidereal system, which includes the Vimshottari Dasha system (planetary time cycles) and the 27 Nakshatras. If you want psychological profiling, Time Passages is incredible. If you want to know *exactly when* an event will occur, Quantum Karma\'s Vedic engine is mathematically designed for predictive timing.',
      features: [
        { name: 'System Framework', them: 'Western Tropical', us: 'Vedic Sidereal' },
        { name: 'Timing Mechanics', them: 'Transits & Progressions', us: 'Dashas & Gocharas' },
        { name: 'Lunar Analysis', them: 'Moon Phases', us: '27 Nakshatras (Lunar Mansions)' },
        { name: 'Vibe', them: 'Technical Western', us: 'Technical Vedic' },
      ]
    }
  };

  const activeData = COMPETITORS[activeTab];

  return (
    <div className="min-h-screen bg-[#020205] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-[#020205]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={12} color="#fff" />
            </div>
            <span className="font-bold text-white tracking-tight">Quantum Karma</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 md:px-6 relative border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
              We Love All Astrology Apps. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">They Are Sexy And Cool.</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
              We have massive respect for the icons of our industry. They revolutionized how the world interacts with the stars. But every app has a specific philosophy. Here is an honest, deeply technical breakdown of what they do best, and why Quantum Karma exists.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabbed Navigation */}
      <section className="sticky top-16 z-30 bg-[#020205]/90 backdrop-blur-xl border-b border-white/5 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto hide-scrollbar py-4 gap-2 md:gap-4 snap-x justify-center">
            {(Object.keys(COMPETITORS) as Competitor[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`snap-start flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === key 
                    ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {COMPETITORS[key].icon}
                {COMPETITORS[key].name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Competitor View */}
      <section className="px-4 md:px-6 py-16 md:py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-16">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Quantum Karma vs</span>
                <span className="text-white font-black text-sm uppercase tracking-widest">{activeData.name}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                {activeData.tagline}
              </h2>
              <p className="text-lg md:text-xl text-indigo-300 font-medium max-w-3xl leading-relaxed">
                {activeData.tldr}
              </p>
            </div>

            {/* Two Column Layout for Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-20">
              {/* Their Superpower */}
              <div className="p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Heart size={20} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-white">Their Superpower</h3>
                </div>
                <p className="text-slate-400 leading-relaxed font-medium relative z-10">
                  {activeData.superpower}
                </p>
              </div>

              {/* The QK Difference */}
              <div className="p-8 md:p-10 rounded-3xl bg-indigo-900/10 border border-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-black text-indigo-100">The Quantum Difference</h3>
                </div>
                <p className="text-slate-300 leading-relaxed font-medium relative z-10">
                  {activeData.difference}
                </p>
              </div>
            </div>

            {/* Feature Head-to-Head Table */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 px-2">Direct Comparison</h3>
              <div className="rounded-3xl border border-white/5 bg-[#05050A] overflow-hidden">
                
                {/* Table Header */}
                <div className="grid grid-cols-3 bg-white/[0.02] border-b border-white/5 p-4 md:p-6">
                  <div className="col-span-1 text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Metric</div>
                  <div className="col-span-1 text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">{activeData.name}</div>
                  <div className="col-span-1 text-xs md:text-sm font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    Quantum Karma <Sparkles size={12} className="hidden md:block" />
                  </div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-white/5">
                  {activeData.features.map((feat, idx) => (
                    <div key={idx} className="grid grid-cols-3 p-4 md:p-6 hover:bg-white/[0.01] transition-colors items-center">
                      <div className="col-span-1 pr-4">
                        <span className="text-xs md:text-sm font-bold text-slate-300">{feat.name}</span>
                      </div>
                      <div className="col-span-1 pr-4">
                        <div className="flex items-start gap-2 text-slate-500">
                          <XCircle size={14} className="mt-1 flex-shrink-0 opacity-50" />
                          <span className="text-xs md:text-sm leading-snug font-medium">{feat.them}</span>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-start gap-2 text-indigo-100">
                          <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-indigo-400" />
                          <span className="text-xs md:text-sm leading-snug font-bold">{feat.us}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </section>

      {/* Our Core Philosophy */}
      <section className="px-4 md:px-6 py-24 md:py-32 bg-gradient-to-b from-[#020205] to-indigo-950/20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Heart size={28} className="text-indigo-400" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
            Why We Built This.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">Because We Want You To Win.</span>
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-indigo-100/80 font-medium leading-relaxed max-w-3xl mx-auto">
            <p>
              We love the stars, but more importantly, we love humanity. We believe that you are not meant to suffer through repeating karmic loops, toxic relationships, and career plateaus. You are meant to be joyful, wildly successful, and deeply healthy.
            </p>
            <p>
              Quantum Karma was not built to just entertain you. It was built to empower and heal you. We designed this engine to give you the exact mathematical blueprints of your life so you can finally break the cycle, step into your full power, and build the beautiful reality you deserve. 
              <br/><br/>
              <span className="text-white font-bold">We are in your corner. Always.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Ethics & Prowess */}
      <section className="px-4 md:px-6 py-24 md:py-32 border-t border-white/5 bg-[#05050A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
              Our Vow to You
            </h2>
            <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">
              We operate on an entirely different ethical and technological standard. No games, just pure guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center hover:bg-white/[0.04] transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database size={28} className="text-indigo-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-4">Total Privacy</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Your birth data is sacred. Our engine processes your chart securely, and we never sell your data to third parties. Your karmic blueprint belongs to you alone.
              </p>
            </div>

            <div className="p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center hover:bg-white/[0.04] transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} className="text-purple-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-4">Zero Upsells</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                We will never fear-monger you into buying a $500 gemstone to "fix your Saturn." We provide real, accessible mantras and behavioral protocols. No hidden agendas.
              </p>
            </div>

            <div className="p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center hover:bg-white/[0.04] transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={28} className="text-indigo-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-4">Swiss Ephemeris</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                We use the absolute gold standard in astronomical calculation, trusted by global observatories. No approximations. Pure, uncompromising precision down to the second.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 md:px-6 py-32 md:py-48 relative overflow-hidden bg-[#020205]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-600/20 via-[#020205] to-[#020205] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-10 leading-[1.1]">
            Ready to break <br className="hidden md:block"/> the loop?
          </h2>
          <Link href="/" className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_60px_rgba(255,255,255,0.4)]">
            Diagnose Your Chart Now <Sparkles size={16} />
          </Link>
        </div>
      </section>

      {/* CSS for hiding scrollbar but keeping functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
