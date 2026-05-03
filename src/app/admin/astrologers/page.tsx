'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Cpu, Network, LogOut } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function AstrologerAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/admin/astrologers', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch admin data');
      const json = await res.json();
      setData(json);
    } catch (error: any) {
      toast.error(error.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'sandeshprasad7@gmail.com') {
        router.push('/');
        return;
      }
      fetchDashboardData();
    };

    checkAdmin();
  }, [router, supabase]);

  const handleStatusChange = async (astrologerId: string, newStatus: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/astrologers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ astrologerId, status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`Astrologer status updated to ${newStatus}`);
      
      fetchDashboardData(); // Refresh data
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050A] text-white font-outfit">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-[#FFD700] font-cinzel font-bold text-xl tracking-wider">Astrologer Admin Console</span>
          </div>
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg"><Cpu className="w-5 h-5 text-blue-400" /></div>
              <h3 className="font-medium text-gray-200">Gemini 3.1 Pro</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-400">Tokens In:</span> <span>{data?.overallMetrics?.gemini.input.toLocaleString() || 0}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Tokens Out:</span> <span>{data?.overallMetrics?.gemini.output.toLocaleString() || 0}</span></div>
              <div className="pt-2 mt-2 border-t border-white/5 flex justify-between font-medium">
                <span className="text-gray-300">Cost:</span> <span className="text-blue-400">₹{(data?.overallMetrics?.gemini.cost || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg"><Cpu className="w-5 h-5 text-purple-400" /></div>
              <h3 className="font-medium text-gray-200">Claude Sonnet</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-400">Tokens In:</span> <span>{data?.overallMetrics?.claude.input.toLocaleString() || 0}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Tokens Out:</span> <span>{data?.overallMetrics?.claude.output.toLocaleString() || 0}</span></div>
              <div className="pt-2 mt-2 border-t border-white/5 flex justify-between font-medium">
                <span className="text-gray-300">Cost:</span> <span className="text-purple-400">₹{(data?.overallMetrics?.claude.cost || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg"><Network className="w-5 h-5 text-green-400" /></div>
              <h3 className="font-medium text-gray-200">Astro API Endpoints</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm items-center h-[56px]">
                <span className="text-gray-400">Total System API Cost</span>
              </div>
              <div className="pt-2 mt-2 border-t border-white/5 flex justify-between font-medium">
                <span className="text-gray-300">Cost:</span> <span className="text-green-400">₹{(data?.overallMetrics?.api.cost || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Astrologers Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xl font-cinzel font-bold text-white">Recent Applications (10)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Astrologer</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined Date</th>
                  <th className="px-6 py-4 font-medium text-right">LLM / API Usage</th>
                  <th className="px-6 py-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.recentAstrologers?.map((astro: any) => (
                  <tr key={astro.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{astro.full_name || 'Unknown Name'}</div>
                      <div className="text-gray-500 text-xs mt-1">{astro.email}</div>
                      <div className="text-[#FFD700] text-xs mt-1">{astro.experience_level}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${astro.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          astro.status === 'declined' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'}
                      `}>
                        {astro.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(astro.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-gray-300 text-xs">Total: {astro.usage?.total?.toLocaleString() || 0} tokens</div>
                      <div className="text-[#FFD700] font-medium text-xs mt-1">₹{(astro.usage?.cost || 0).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={astro.status}
                        onChange={(e) => handleStatusChange(astro.id, e.target.value)}
                        className="bg-black border border-white/20 text-white text-xs rounded-lg focus:ring-[#FFD700] focus:border-[#FFD700] p-2"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approve</option>
                        <option value="declined">Decline</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {!data?.recentAstrologers?.length && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No astrologer applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#0A0A12", border: "1px solid rgba(255,215,0,0.2)", color: "#fff", fontFamily: "IBM Plex Mono, monospace", fontSize: "12px" } }} />
    </div>
  );
}
