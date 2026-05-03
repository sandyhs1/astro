'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, LogOut, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AstrologerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/astrologer/auth');
        return;
      }

      // Check astrologer status and get details
      const { data: astroData } = await supabase
        .from('astrologers')
        .select('status, full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (!astroData) {
        // If they managed to bypass and they aren't in the astrologers table, kick them out
        router.push('/astrologer/auth');
        return;
      }

      setStatus(astroData.status);
      setFullName(astroData.full_name);
      setLoading(false);
    };

    checkAccess();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/astrologer/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
      </div>
    );
  }

  const firstName = fullName ? fullName.split(' ')[0] : 'Grand Master';

  // Blocking screens for pending or declined statuses
  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-[#05050A] text-white flex flex-col items-center justify-center p-6 font-outfit relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.1)_0%,rgba(0,0,0,0)_70%)] blur-[80px]" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-lg w-full bg-white/[0.02] border border-white/[0.08] p-10 rounded-[2rem] text-center shadow-2xl backdrop-blur-2xl"
        >
          <div className="mx-auto w-20 h-20 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mb-8 border border-[#00E5FF]/20 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            <ShieldCheck className="w-10 h-10 text-[#00E5FF]" />
          </div>
          <h2 className="text-3xl font-bold mb-4 font-cinzel text-white">Application Under Review</h2>
          <p className="text-gray-300 mb-8 font-light text-base leading-relaxed">
            Namaste, <span className="text-[#00E5FF] font-medium">{firstName}</span>. Your application has been received and is currently under review by our team. We carefully evaluate all partner applications to maintain our standards.
          </p>
          <div className="text-xs font-mono-tech text-gray-500 mb-10 tracking-widest uppercase">
            Thank you for your patience
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center mx-auto py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors text-sm font-medium text-gray-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </motion.div>
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div className="min-h-screen bg-[#05050A] text-white flex flex-col items-center justify-center p-6 font-outfit relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(123,97,255,0.1)_0%,rgba(0,0,0,0)_70%)] blur-[80px]" />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-lg w-full bg-white/[0.02] border border-white/[0.08] p-10 rounded-[2rem] text-center shadow-2xl backdrop-blur-2xl"
        >
          <h2 className="text-3xl font-bold text-white mb-6 font-cinzel">Application Update</h2>
          <p className="text-gray-300 mb-6 font-light text-base leading-relaxed">
            Dear <span className="text-[#7B61FF] font-medium">{firstName}</span>, thank you for your interest in partnering with us. After careful review, we are unable to approve your application at this time. We wish you the very best on your path.
          </p>
          <div className="bg-[#7B61FF]/10 border border-[#7B61FF]/20 rounded-2xl p-6 mb-10 italic font-serif-display text-lg text-[#7B61FF]">
            "Not all storms come to disrupt your life, some come to clear your path."
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center mx-auto py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors text-sm font-medium text-gray-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Continue Your Journey
          </button>
        </motion.div>
      </div>
    );
  }

  // If approved, render the dashboard with a personalized welcome banner
  return (
    <div className="min-h-screen bg-[#0A0A12] text-white selection:bg-[#FFD700] selection:text-black">
      <div className="bg-[#FFD700]/5 border-b border-[#FFD700]/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-[#FFD700]" />
          <span className="text-sm text-[#FFD700] font-medium">Welcome back, {firstName} — Partner Portal</span>
        </div>
        <button onClick={handleSignOut} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
          <LogOut className="w-3 h-3" /> Sign Out
        </button>
      </div>
      {children}
    </div>
  );
}
