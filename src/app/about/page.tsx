'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';

export default function AboutPage() {
  const [bootSequence, setBootSequence] = useState<number>(0);
  const [isBooted, setIsBooted] = useState(false);
  const [truthsCounter, setTruthsCounter] = useState(0);

  useEffect(() => {
    // 56000 counter logic
    if (isBooted) {
      let current = 0;
      const target = 56000;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setTruthsCounter(target);
          clearInterval(timer);
        } else {
          setTruthsCounter(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isBooted]);

  useEffect(() => {
    // Terminal boot simulation
    const steps = [
      800,  // Initial pause
      400,  // Initialize protocols
      600,  // Load data points
      500,  // Connect logic engine
      400,  // Ready to boot
    ];

    let totalDelay = 0;
    steps.forEach((delay, index) => {
      totalDelay += delay;
      setTimeout(() => {
        setBootSequence(index + 1);
        if (index === steps.length - 1) {
          setTimeout(() => setIsBooted(true), 600);
        }
      }, totalDelay);
    });
  }, []);

  if (!isBooted) {
    return (
      <div className="min-h-screen bg-[#12011A] text-white font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Subtle grid background to match terminal feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="w-full max-w-2xl bg-black/60 border border-white/10 p-6 sm:p-8 rounded-lg shadow-2xl backdrop-blur-sm z-10">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <Terminal className="text-[#FFD700]" size={20} />
            <span className="text-[#FFD700] text-sm tracking-[0.2em] font-bold">SYSTEM BOOT</span>
          </div>
          
          <div className="space-y-3 text-sm sm:text-base text-white/70">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: bootSequence >= 1 ? 1 : 0 }}>
              <span className="text-green-500 mr-2">{'>'}</span> Loading logic_engine_v2... <span className="text-white/40">[OK]</span>
            </motion.div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: bootSequence >= 2 ? 1 : 0 }}>
              <span className="text-green-500 mr-2">{'>'}</span> Stripping dogma.config... <span className="text-amber-500">[REMOVED]</span>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: bootSequence >= 3 ? 1 : 0 }}>
              <span className="text-green-500 mr-2">{'>'}</span> Fetching 10,000 data points... <span className="text-white/40">[OK]</span>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: bootSequence >= 4 ? 1 : 0 }}>
              <span className="text-green-500 mr-2">{'>'}</span> Overriding matrix... <span className="text-red-500 animate-pulse">[HACKING]</span>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: bootSequence >= 5 ? 1 : 0 }} className="pt-4 text-[#FFD700]">
              <span className="text-green-500 mr-2">{'>'}</span> Status: OPERATIONAL. 
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12011A] text-white selection:bg-[#FFD700] selection:text-black font-sans relative overflow-x-hidden">
      {/* Background Noise & Grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-screen bg-noise" />
      
      <div className="max-w-4xl mx-auto px-6 py-12 sm:py-24 relative z-10">
        
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-[#FFD700] transition-colors text-sm font-mono tracking-widest uppercase mb-16 sm:mb-24">
            <ArrowLeft size={16} />
            Abort & Return
          </Link>
        </motion.div>

        {/* Header Block */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20 sm:mb-32"
        >
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-[#FFD700]">
              ABOUT
            </span>
          </h1>
          <div className="w-16 h-1 bg-[#FFD700] mb-8" />
        </motion.header>

        {/* Section: The $4.5B Fear Factory */}
        <ContentSection title="The $4.5B Fear Factory" delay={0.4}>
          <p>
            I spent years watching the astrology industry operate, and I realized it wasn't a science—it was a <span className="text-red-400 font-bold">$4.5 Billion fear factory.</span> I saw people in their 20s and 30s—founders, creators, and professionals—walking into rooms with genuine pain, only to be met with "Shani is angry" and a ₹50,000 gemstone recommendation. 
          </p>
          <p>
            The "Gurus" weren't reading charts; they were reading insecurities. They were selling "hope" because hope is a high-margin product.
          </p>
        </ContentSection>

        {/* Section: The Glitch */}
        <ContentSection title="The Glitch" delay={0.6}>
          <p>
            I stopped looking for <RedactedWord cliche="blessings" technical="Vectors" /> and started looking at the Math. Vedic Astrology isn't a religion; it's a <span className="text-[#FFD700] font-mono whitespace-nowrap bg-[#FFD700]/10 px-2 py-0.5 rounded">Deterministic Coordinate System</span>. The planets are just the hands on a cosmic clock. They don't make things happen; they tell you what time it is.
          </p>
          <div className="my-8 p-6 sm:p-8 bg-black/40 border-l-2 border-[#FFD700] backdrop-blur-md">
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed m-0 font-medium italic">
              I found the "Glitch in the Matrix"—the industry was ignoring 90% of the data because it was too hard to explain to the masses. 
            </p>
            <p className="mt-4 text-white/70">
              They ignored the <span className="font-mono text-[#FFD700]">D-60 (Shastiamsa)</span> which changes every 120 seconds. They ignored the <span className="font-mono text-[#FFD700]">Bhava Chalit</span> which proves your planets might be in a different house entirely. They chose the easy lie over the complex truth.
            </p>
          </div>
        </ContentSection>

        {/* Section: The Manifesto */}
        <ContentSection title="The Manifesto" delay={0.8}>
          <p>
            I built Quantum Karma for the people who hate being lied to. We don't do "vibrations." We don't do <RedactedWord cliche="miracles." technical="Activation Windows." /> We do Life Intelligence. We process over 10,000 data points to reconstruct the exact space-time coordinates of your birth. We provide a surgical audit of your life's hardware.
          </p>
          <ul className="mt-8 space-y-4 font-mono text-sm sm:text-base text-white/80">
            <li className="flex items-start gap-4 p-4 border border-white/10 rounded-lg hover:border-[#FFD700]/50 transition-colors bg-white/[0.02]">
              <span className="text-red-500 mt-1">{'[!]'}</span>
              <span>If you're in a "Dead Zone," we tell you.</span>
            </li>
            <li className="flex items-start gap-4 p-4 border border-white/10 rounded-lg hover:border-[#FFD700]/50 transition-colors bg-white/[0.02]">
              <span className="text-red-500 mt-1">{'[!]'}</span>
              <span>If your relationship is a "Karmic Debt," we show you.</span>
            </li>
            <li className="flex items-start gap-4 p-4 border border-white/10 rounded-lg hover:border-[#FFD700]/50 transition-colors bg-white/[0.02]">
              <span className="text-[#FFD700] mt-1">{'[+]'}</span>
              <span>If your career window is opening in 4 months, we give you the timeframes.</span>
            </li>
          </ul>
        </ContentSection>

        {/* Section: The Bottom Line */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mt-20 sm:mt-32 p-8 sm:p-12 relative overflow-hidden ring-1 ring-white/10 rounded-2xl bg-gradient-to-br from-black/80 to-[#12011A]"
        >
          {/* Subtle flare */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px] pointer-events-none" />
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white tracking-tight">The Bottom Line</h2>
          
          <div className="space-y-6 text-lg text-white/80 leading-relaxed font-light">
            <p>
              <RedactedWord cliche="Destiny" technical="Data" isCapitalized /> is for people who are too lazy to read their own data. Strategy is for the people who want to win.
            </p>
            <p>
              We provide the Tide Chart. Whether you choose to swim with the current or drown fighting it is up to you. But after this report, you can never claim you didn't see the wave coming.
            </p>
            <p className="text-xl sm:text-2xl text-white font-bold tracking-tight mt-12 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-[#FFD700]">
              Stop guessing. Start striking.
            </p>
          </div>
        </motion.div>

        {/* Counter Metric */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 sm:mt-32 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="flex flex-col items-center justify-center p-8 border border-white/5 rounded-2xl bg-black/40">
            <span className="text-5xl font-bold text-red-500 tracking-tighter mb-4">0</span>
            <span className="text-xs sm:text-sm font-mono text-white/50 uppercase tracking-widest text-center">
              Total Gemstones<br/>Recommended
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-8 border border-[#FFD700]/20 rounded-2xl bg-[#FFD700]/[0.02] shadow-[0_0_30px_rgba(255,215,0,0.05)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,215,0,0.1),transparent_70%)]" />
            <span className="text-5xl font-bold text-[#FFD700] tracking-tighter mb-4 relative z-10">
              {truthsCounter.toLocaleString()}+
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#FFD700]/70 uppercase tracking-widest text-center relative z-10">
              Total Truths<br/>Delivered
            </span>
          </div>
        </motion.div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-24 sm:mt-40 text-center pb-20"
        >
          <p className="text-white/40 font-mono text-sm uppercase tracking-[0.3em] mb-4">
            Calculated by Logic. Not by Dogma.
          </p>
          <div className="text-5xl sm:text-6xl text-white font-serif italic tracking-wide">
            Sandesh
          </div>
        </motion.div>

      </div>
    </div>
  );
}

// ------------------------------------
// Inline Components
// ------------------------------------

const ContentSection = ({ title, children, delay }: { title: string, children: React.ReactNode, delay: number }) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay }}
    className="mb-16 sm:mb-24 last:mb-0"
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="w-8 h-[1px] bg-red-500/50" />
      <h2 className="text-xl sm:text-2xl font-mono text-red-400 uppercase tracking-widest">{title}</h2>
    </div>
    <div className="space-y-6 text-lg sm:text-xl text-white/80 leading-relaxed font-light pl-0 sm:pl-12">
      {children}
    </div>
  </motion.section>
);

const RedactedWord = ({ cliche, technical, isCapitalized = false }: { cliche: string; technical: string; isCapitalized?: boolean }) => {
  const [isRedacted, setIsRedacted] = useState(false);

  return (
    <motion.span 
      className="inline-flex items-center gap-2 "
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      onViewportEnter={() => {
        // Redact after a short delay of seeing it
        setTimeout(() => setIsRedacted(true), 800);
      }}
    >
      <span className="relative inline-block px-1">
        <span className={`transition-all duration-300 ${isRedacted ? 'text-white/30 truncate' : 'text-white font-bold'}`}>
          {cliche}
        </span>
        {/* Redacted Strike line */}
        <motion.span 
          className="absolute top-1/2 left-0 h-[3px] bg-red-600 z-10 w-full rounded"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: isRedacted ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        {/* Extra glitch burst purely visual */}
        {isRedacted && (
          <motion.span 
            className="absolute inset-0 bg-red-500/30 blur-sm mix-blend-screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </span>
      
      {/* Target Word Appears */}
      <AnimatePresence>
        {isRedacted && (
          <motion.span
            initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`font-mono text-[#FFD700] text-sm sm:text-base border border-[#FFD700]/30 bg-[#FFD700]/10 px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(255,215,0,0.2)] whitespace-nowrap`}
          >
            {technical}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
};
