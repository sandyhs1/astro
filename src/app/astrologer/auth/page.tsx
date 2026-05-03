'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Toaster, toast } from 'sonner';
import { Loader2, ArrowRight, ArrowLeft, Star, Sparkles, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AstrologerAuth() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/astrologer/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!email || !password)) return toast.error('Email and password required');
    if (step === 2 && (!fullName || !experienceLevel)) return toast.error('Name and level required');
    if (step === 3 && !q1) return toast.error('Please answer the question to proceed');
    if (step === 4 && !q2) return toast.error('Please answer the question to proceed');
    if (step === 5 && !q3) return toast.error('Please answer the question to proceed');
    
    if (step < 5) setStep(s => s + 1);
    else handleSignup();
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      let userId = null;
      let { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: 'astrologer' } },
      });

      if (error) {
        if (error.message.includes('User already registered') || error.message.includes('already exists')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) throw new Error('Account exists. Please use your correct password to apply.');
          userId = signInData.user?.id;
        } else {
          throw error;
        }
      } else {
        userId = data.user?.id;
      }

      if (userId) {
        const res = await fetch('/api/astrologer/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId, fullName, experienceLevel, q1Answer: q1, q2Answer: q2, q3Answer: q3 
          }),
        });
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to submit application');
        }

        setStep(6); // Success screen
      }
    } catch (error: any) {
      toast.error(error.message || 'Application submission failed');
    } finally {
      setLoading(false);
    }
  };

  const renderLogin = () => (
    <form className="space-y-6" onSubmit={handleLogin}>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="block w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FFD700]/50 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 transition-all text-sm sm:text-base"
          placeholder="master@astrology.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
          className="block w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FFD700]/50 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 transition-all text-sm sm:text-base"
          placeholder="••••••••" />
      </div>
      <div className="pt-2">
        <button type="submit" disabled={loading} className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FDB931] px-4 py-3.5 text-sm sm:text-base font-semibold text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all overflow-hidden">
          <span className="relative z-10 flex items-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In to Portal <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
          </span>
        </button>
      </div>
    </form>
  );

  const renderSignupStep = () => {
    if (step === 6) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#FFD700]/10 rounded-full flex items-center justify-center border border-[#FFD700]/30 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
              <Sparkles className="w-10 h-10 text-[#FFD700]" />
            </div>
          </div>
          <h3 className="text-2xl font-cinzel font-bold text-[#FFD700] mb-4">Application Received</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-8 px-4">
            Namaste, {fullName}. Your application has been successfully submitted. Our team is carefully reviewing your insights to ensure they meet our standards. You will be notified once the review is complete.
          </p>
          <button onClick={() => router.push('/astrologer/dashboard')} className="px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium text-white">
            Enter the Waiting Room
          </button>
        </motion.div>
      );
    }

    return (
      <div className="space-y-6">
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} className="text-gray-400 hover:text-white flex items-center text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
        )}
        
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-xl font-cinzel text-white mb-6">Create your gateway</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FFD700]/50 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 text-sm sm:text-base" placeholder="Email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FFD700]/50 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 text-sm sm:text-base" placeholder="Password" />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="text-xl font-cinzel text-white mb-6">Who walks this path?</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="block w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FFD700]/50 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 text-sm sm:text-base" placeholder="E.g., Dr. B.V. Raman" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Astrology Experience Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                    <button key={lvl} type="button" onClick={() => setExperienceLevel(lvl)} className={`py-3 px-4 rounded-xl border transition-all text-sm font-medium ${experienceLevel === lvl ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30'}`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-4 text-[#FFD700] text-xs font-bold uppercase tracking-widest"><Sun className="w-4 h-4"/> Insight 1 of 3</div>
            <h3 className="text-lg font-cinzel text-white mb-4 leading-relaxed">How do you distinguish between fate and free will when interpreting a difficult planetary transit?</h3>
            <textarea value={q1} onChange={e => setQ1(e.target.value)} rows={5} className="block w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FFD700]/50 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 text-sm sm:text-base resize-none" placeholder="Keep it brief, grounded, and powerful..." />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-4 text-[#FFD700] text-xs font-bold uppercase tracking-widest"><Moon className="w-4 h-4"/> Insight 2 of 3</div>
            <h3 className="text-lg font-cinzel text-white mb-4 leading-relaxed">What is your approach to delivering challenging or 'negative' astrological insights to a vulnerable client?</h3>
            <textarea value={q2} onChange={e => setQ2(e.target.value)} rows={5} className="block w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FFD700]/50 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 text-sm sm:text-base resize-none" placeholder="Keep it brief, grounded, and powerful..." />
          </motion.div>
        )}

        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-4 text-[#FFD700] text-xs font-bold uppercase tracking-widest"><Star className="w-4 h-4"/> Final Insight</div>
            <h3 className="text-lg font-cinzel text-white mb-4 leading-relaxed">How do you integrate traditional astrological principles with modern psychological understanding?</h3>
            <textarea value={q3} onChange={e => setQ3(e.target.value)} rows={5} className="block w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white focus:border-[#FFD700]/50 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 text-sm sm:text-base resize-none" placeholder="Keep it brief, grounded, and powerful..." />
          </motion.div>
        )}

        <div className="pt-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-6 bg-[#FFD700]' : step > i ? 'w-3 bg-[#FFD700]/50' : 'w-3 bg-white/10'}`} />
            ))}
          </div>
          <button type="button" onClick={nextStep} disabled={loading} className="group flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FDB931] px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{step === 5 ? 'Submit Application' : 'Next'} <ArrowRight className="ml-2 w-4 h-4" /></>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white flex flex-col justify-center relative overflow-hidden font-outfit">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[100px]" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 mt-8 sm:mt-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"><Star className="w-8 h-8 text-[#FFD700]" /></div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 font-cinzel">Partner Portal</h2>
          <p className="text-sm sm:text-base text-gray-400 font-light px-4">Exclusive enterprise access for Grand Master Astrologers.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.03] backdrop-blur-2xl py-8 px-6 sm:px-10 shadow-2xl border border-white/[0.08] sm:rounded-3xl rounded-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                {renderLogin()}
              </motion.div>
            ) : (
              <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {renderSignupStep()}
              </motion.div>
            )}
          </AnimatePresence>

          {step !== 6 && (
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <button type="button" onClick={() => { setIsLogin(!isLogin); setStep(1); }} className="text-sm text-gray-400 hover:text-white transition-colors">
                {isLogin ? "Don't have an account? " : "Already approved? "}
                <span className="text-[#FFD700] font-medium">{isLogin ? 'Apply Now' : 'Sign In'}</span>
              </button>
            </div>
          )}
        </motion.div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-xs sm:text-sm text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center">&larr; Return to main website</Link>
        </div>
      </div>
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#0A0A12", border: "1px solid rgba(255,215,0,0.2)", color: "#fff", fontFamily: "IBM Plex Mono, monospace", fontSize: "12px" } }} />
    </div>
  );
}
