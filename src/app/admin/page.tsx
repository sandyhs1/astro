"use client";
import { useState, useEffect, useCallback } from "react";
import { Upload, LogOut, Copy, CheckCircle2, Loader2, Users, Activity, Database, RefreshCw, IndianRupee, Zap, TrendingUp, Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import "./admin.css";

type Tab = "users" | "ai" | "features" | "astro" | "promos" | "astrologers";

const fmt = (n: number) => n.toLocaleString("en-IN");
const inr = (n: number) => `₹${n.toFixed(4)}`;
const ago = (ts: string) => {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return new Date(ts).toLocaleDateString("en-IN");
};

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [tab, setTab] = useState<Tab>("users");
  const [clients, setClients] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [promos, setPromos] = useState<any>(null);
  const [astrologersData, setAstrologersData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [featureSearch, setFeatureSearch] = useState("");

  const fetchUsers = useCallback(async (t: string) => {
    const res = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${t}` } });
    if (res.ok) { const d = await res.json(); setUsersData(d); }
    else if (res.status === 401) logout();
  }, []);

  const fetchClients = useCallback(async (t: string) => {
    const res = await fetch("/api/admin/clients", { headers: { Authorization: `Bearer ${t}` } });
    if (res.ok) { const d = await res.json(); setClients(d.clients || []); }
    else if (res.status === 401) logout();
  }, []);

  const fetchMetrics = useCallback(async (t: string, silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/ai-metrics", { headers: { Authorization: `Bearer ${t}` } });
      if (res.ok) { const d = await res.json(); setMetrics(d); setLastUpdated(new Date()); }
    } finally { setRefreshing(false); }
  }, []);

  const fetchPromos = useCallback(async (t: string) => {
    const res = await fetch("/api/admin/promo-codes", { headers: { Authorization: `Bearer ${t}` } });
    if (res.ok) { const d = await res.json(); setPromos(d); }
  }, []);

  const fetchAstrologers = useCallback(async (t: string) => {
    try {
      const res = await fetch("/api/admin/astrologers", { headers: { Authorization: `Bearer ${t}` } });
      if (res.ok) { 
        const d = await res.json(); 
        setAstrologersData(d); 
      } else if (res.status === 401) {
        logout();
      } else {
        const d = await res.json();
        setError(d.error || "Failed to fetch astrologers");
        setAstrologersData({ recentAstrologers: [], overallMetrics: { gemini: { input: 0, output: 0, cost: 0 }, claude: { input: 0, output: 0, cost: 0 }, api: { cost: 0 } } });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setAstrologersData({ recentAstrologers: [], overallMetrics: { gemini: { input: 0, output: 0, cost: 0 }, claude: { input: 0, output: 0, cost: 0 }, api: { cost: 0 } } });
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("adminToken");
    if (saved) { setToken(saved); setAuthed(true); fetchUsers(saved).finally(() => setFetching(false)); }
    else setFetching(false);
  }, []);

  useEffect(() => {
    if (authed && token && tab === "users") fetchUsers(token);
    if (authed && token && (tab === "ai" || tab === "astro" || tab === "features")) fetchMetrics(token);
    if (authed && token && tab === "promos") fetchPromos(token);
    if (authed && token && tab === "astrologers") fetchAstrologers(token);
  }, [tab, authed, token]);

  useEffect(() => {
    if (!authed || !token || (tab !== "ai" && tab !== "astro" && tab !== "features")) return;
    const iv = setInterval(() => fetchMetrics(token, true), 30000);
    return () => clearInterval(iv);
  }, [tab, authed, token]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    const res = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const d = await res.json();
    if (res.ok) { setToken(d.token); setAuthed(true); localStorage.setItem("adminToken", d.token); fetchClients(d.token).finally(() => setFetching(false)); }
    else setError(d.error || "Login failed");
    setLoading(false);
  };

  const logout = () => { localStorage.removeItem("adminToken"); setAuthed(false); setToken(""); setClients([]); setMetrics(null); setAstrologersData(null); };

  const updateAstrologerStatus = async (astrologerId: string, status: string) => {
    await fetch("/api/admin/astrologers", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ astrologerId, status }) });
    fetchAstrologers(token);
  };

  const updatePayment = async (leadId: string, status: string) => {
    setLoading(true);
    await fetch("/api/admin/update-payment", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ leadId, paymentStatus: status }) });
    fetchClients(token); setLoading(false);
  };

  const uploadPdf = async (portalId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file); fd.append("portalId", portalId);
    setLoading(true);
    const res = await fetch("/api/admin/upload-report", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    if (res.ok) { alert("Report uploaded!"); fetchClients(token); } else alert("Upload failed");
    setLoading(false); e.target.value = "";
  };

  if (fetching) return <div className="login-container"><Loader2 className="animate-spin text-white w-8 h-8" /></div>;

  if (!authed) return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="admin-title">Quantum Karma Admin</h2>
        <form onSubmit={login}>
          <input type="password" className="login-input" placeholder="Admin Password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="error-text mb-4">{error}</p>}
          <button type="submit" className="login-btn" disabled={loading}>{loading ? "..." : "Login"}</button>
        </form>
      </div>
    </div>
  );

  const g = metrics?.global;

  return (
    <div className="admin-root">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Quantum Karma Admin</h1>
          <p className="text-slate-400 mt-1 text-sm">Real-time usage, billing &amp; user intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && <span className="text-xs text-slate-500">Updated {ago(lastUpdated.toISOString())}</span>}
          <button onClick={() => fetchMetrics(token)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-all">
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
          <button onClick={logout} className="admin-logout flex items-center gap-2"><LogOut size={16} /> Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 px-6 flex-wrap">
        {([[ "users", "Users & Plans", <Users size={15} key="u"/>],["ai","LLM Usage & Cost",<Activity size={15} key="ai"/>],["features","Feature Breakdown",<Sparkles size={15} key="f"/>],["astro","AstrologyAPI",<Database size={15} key="db"/>],["promos","Promo Codes",<Zap size={15} key="z"/>],["astrologers","Astrologers",<Users size={15} key="a"/>]] as const).map(([id, label, icon]) => (
          <button key={id} onClick={() => setTab(id as Tab)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${tab === id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* ── USERS TAB ──────────────────────────────────────────────────────── */}
      {tab === "users" && (
        <div className="px-6 pb-12">
          {!usersData ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div> : <>

            {/* ─ Summary KPI Cards ─ */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { label: "Total Users",  value: usersData.summary.totalUsers,  color: "text-white",       icon: <Users size={16}/> },
                { label: "Plan 1 Users", value: usersData.summary.plan1Users,  color: "text-orange-400",  icon: <TrendingUp size={16}/> },
                { label: "Plan 2 Users", value: usersData.summary.plan2Users,  color: "text-cyan-400",    icon: <TrendingUp size={16}/> },
                { label: "Paid Users",   value: usersData.summary.paidUsers,   color: "text-emerald-400", icon: <IndianRupee size={16}/> },
                { label: "Promo Users",  value: usersData.summary.promoUsers,  color: "text-amber-400",   icon: <Zap size={16}/> },
                { label: "Active Users", value: usersData.summary.activeUsers, color: "text-indigo-400",  icon: <Activity size={16}/> },
              ].map(k => (
                <div key={k.label} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{k.icon}{k.label}</div>
                  <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* ─ Recent 20 Signups Table ─ */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                <h2 className="font-bold text-white">Most Recent 20 Signups</h2>
                <button onClick={() => fetchUsers(token)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-all">
                  <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="px-5 py-3">User</th>
                      <th className="px-5 py-3">Signed Up</th>
                      <th className="px-5 py-3">Plan</th>
                      <th className="px-5 py-3">Payment / Access</th>
                      <th className="px-5 py-3">Credits</th>
                      <th className="px-5 py-3">Intake Form</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {(usersData.recentUsers || []).length === 0
                      ? <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">No users yet.</td></tr>
                      : (usersData.recentUsers || []).map((u: any) => (
                        <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                            {u.signedUpAt ? new Date(u.signedUpAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold ${
                              u.plan === "Plan 2" ? "bg-cyan-900/40 text-cyan-400 border border-cyan-700/40"
                              : u.plan === "Plan 1" ? "bg-orange-900/40 text-orange-400 border border-orange-700/40"
                              : u.plan === "Promo" ? "bg-amber-900/40 text-amber-400 border border-amber-700/40"
                              : "bg-slate-900/40 text-slate-500 border border-slate-700/40"
                            }`}>
                              {u.plan}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold ${
                              u.isPaid ? "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40"
                              : u.isPromo ? "bg-amber-900/40 text-amber-300 border border-amber-700/40"
                              : "bg-slate-900/40 text-slate-500 border border-slate-700/40"
                            }`}>
                              {u.paymentStatus}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono font-bold">
                            <span className={u.credits <= 5 ? "text-red-400" : u.credits <= 20 ? "text-amber-400" : "text-emerald-400"}>
                              {u.credits}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {u.plan === "Plan 1" ? (
                              u.intakeSubmitted
                                ? <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold"><CheckCircle2 size={13}/> Submitted</span>
                                : <span className="text-amber-400 text-xs font-semibold">Pending</span>
                            ) : (
                              <span className="text-slate-600 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
          }
        </div>
      )}

      {/* ── AI USAGE TAB ────────────────────────────────────── */}
      {tab === "ai" && (
        <div className="px-6 pb-12">
          {!metrics ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div> : <>

            {/* Top KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              {[
                { label: "Total Tokens", value: fmt(g.totalTokens || 0), color: "text-white", icon: <Zap size={16}/> },
                { label: "Input Tokens", value: fmt(g.totalInputTokens || 0), color: "text-indigo-400", icon: <TrendingUp size={16}/> },
                { label: "Output Tokens", value: fmt(g.totalOutputTokens || 0), color: "text-emerald-400", icon: <TrendingUp size={16}/> },
                { label: "LLM Cost (INR)", value: inr(g.totalLLMCostInr || 0), color: "text-amber-400", icon: <IndianRupee size={16}/> },
                { label: "Credits Used", value: fmt(g.totalCreditsUsed || 0), color: "text-rose-400", icon: <Activity size={16}/> },
              ].map(k => (
                <div key={k.label} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{k.icon}{k.label}</div>
                  <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* ── CREDIT P&L BANNER ── */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-slate-800 to-indigo-900/30 p-5 rounded-xl border border-indigo-700/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <Activity size={16} className="text-indigo-400" /> Actual Credits (Real Cost)
                </div>
                <div className="text-2xl font-bold text-indigo-300">{(g.totalActualCredits || 0).toFixed(4)}</div>
                <div className="text-xs text-slate-500 mt-1">= LLM Cost ÷ ₹35.98 per credit</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-rose-900/30 p-5 rounded-xl border border-rose-700/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <IndianRupee size={16} className="text-rose-400" /> Credits Deducted from Users
                </div>
                <div className="text-2xl font-bold text-rose-300">{(g.totalCreditsDeducted || 0).toFixed(4)}</div>
                <div className="text-xs text-slate-500 mt-1">= 2× actual (what users were charged)</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-emerald-900/30 p-5 rounded-xl border border-emerald-700/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <TrendingUp size={16} className="text-emerald-400" /> Profit Multiple
                </div>
                <div className="text-2xl font-bold text-emerald-300">
                  {g.totalActualCredits > 0
                    ? `${(g.totalCreditsDeducted / g.totalActualCredits).toFixed(2)}×`
                    : '—'}
                </div>
                <div className="text-xs text-slate-500 mt-1">Deducted ÷ Actual (target: 2.00×)</div>
              </div>
            </div>

            {/* Pricing reference */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-xs text-slate-400 flex flex-wrap gap-6">
              <span>💡 <strong className="text-slate-300">Pricing (INR @ ₹84/$)</strong></span>
              <span>Claude Sonnet 4.6: ₹0.252/1K in · ₹1.26/1K out</span>
              <span>Gemini 3.1 Pro: ₹0.105/1K in · ₹0.42/1K out</span>
              <span>Gemini Flash Lite: ₹0.0063/1K</span>
            </div>

            {/* Model Breakdown */}
            <div className="mb-8 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700"><h2 className="font-bold text-white">Model Breakdown</h2></div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(g.modelUsage || {}).length === 0
                  ? <p className="text-slate-400 text-sm">No AI calls logged yet.</p>
                  : Object.entries(g.modelUsage).map(([m, d]: any) => (
                    <div key={m} className="bg-slate-900 p-4 rounded-lg border border-slate-700/50">
                      <div className="font-semibold text-indigo-300 text-sm mb-3 truncate">{m}</div>
                      {[["Calls", d.count, "text-white"],["Input", fmt(d.inputTokens), "text-indigo-400"],["Output", fmt(d.outputTokens), "text-emerald-400"],["Cost", inr(d.costInr), "text-amber-400"]].map(([l,v,c]) => (
                        <div key={l as string} className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">{l as string}</span>
                          <span className={`font-mono font-bold ${c as string}`}>{v as string}</span>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>

            {/* Per-User Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-white">User Consumption &amp; Credit P&amp;L</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Actual = real INR cost ÷ ₹35.98 · Deducted = 2× actual (profit buffer)</p>
                </div>
                <span className="text-xs text-slate-500">Auto-refreshes every 30s</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="px-5 py-3">User</th>
                      <th className="px-5 py-3">Last Active</th>
                      <th className="px-5 py-3">Input / Output / Total</th>
                      <th className="px-5 py-3">LLM Cost ₹</th>
                      <th className="px-5 py-3 text-indigo-300">Actual Credits</th>
                      <th className="px-5 py-3 text-rose-300">Credits Deducted</th>
                      <th className="px-5 py-3 text-emerald-300">Profit ×</th>
                      <th className="px-5 py-3">Credits Left</th>
                      <th className="px-5 py-3">Models</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {metrics.users.length === 0
                      ? <tr><td colSpan={9} className="px-5 py-8 text-center text-slate-500">No users found.</td></tr>
                      : metrics.users.map((u: any) => (
                        <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-400">{ago(u.lastActivityAt)}</td>
                          <td className="px-5 py-4 font-mono text-xs">
                            <span className="text-indigo-400">{fmt(u.inputTokens)}</span>
                            <span className="text-slate-600 mx-1">/</span>
                            <span className="text-emerald-400">{fmt(u.outputTokens)}</span>
                            <span className="text-slate-600 mx-1">/</span>
                            <span className="text-white font-bold">{fmt(u.totalTokens)}</span>
                          </td>
                          <td className="px-5 py-4 font-mono font-bold text-amber-400">{inr(u.llmCostInr)}</td>
                          <td className="px-5 py-4 font-mono font-bold text-indigo-300">
                            {(u.actualCreditCost || 0).toFixed(4)}
                            <div className="text-[10px] text-slate-500 font-normal">real cost</div>
                          </td>
                          <td className="px-5 py-4 font-mono font-bold text-rose-300">
                            {(u.creditsDeducted || 0).toFixed(4)}
                            <div className="text-[10px] text-slate-500 font-normal">charged</div>
                          </td>
                          <td className="px-5 py-4 font-mono font-bold">
                            {u.profitMultiple != null ? (
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                u.profitMultiple >= 1.9 ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/40'
                                : u.profitMultiple >= 1.5 ? 'bg-amber-900/40 text-amber-400 border border-amber-700/40'
                                : 'bg-red-900/40 text-red-400 border border-red-700/40'
                              }`}>{u.profitMultiple}×</span>
                            ) : <span className="text-slate-600">—</span>}
                          </td>
                          <td className="px-5 py-4 font-mono font-bold">
                            <span className={u.creditsRemaining <= 5 ? "text-red-400" : u.creditsRemaining <= 20 ? "text-amber-400" : "text-emerald-400"}>
                              {typeof u.creditsRemaining === 'number' ? u.creditsRemaining.toFixed(2) : u.creditsRemaining}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1 flex-wrap">
                              {u.modelsUsed.map((m: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[10px] font-bold uppercase tracking-wider">
                                  {m.split("/")[0]}
                                </span>
                              ))}
                              {u.modelsUsed.length === 0 && <span className="text-slate-500 text-xs">—</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>}
        </div>
      )}

      {/* ── FEATURES TAB ────────────────────────────────────────────── */}
      {/* Per-feature breakdown across all 12 user-visible reports + Oracle Chat. */}
      {/* Shows token spend, INR cost and credit charge for each feature, plus  */}
      {/* a per-user matrix that lists exactly which features each user has    */}
      {/* consumed and how much each one cost.                                 */}
      {tab === "features" && (
        <div className="px-6 pb-12">
          {!metrics ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div> : <>

            {/* Header banner */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-xs text-slate-400 flex flex-wrap gap-4">
              <span className="text-slate-300">📊 <strong>Feature Breakdown</strong></span>
              <span>Tracks tokens & cost (INR) per feature, per user.</span>
              <span>LLM features show token counts; PDF features (Core / Professional Horoscope) show only AstrologyAPI cost.</span>
              <span className="ml-auto">Auto-refreshes every 30s</span>
            </div>

            {/* ── Global feature aggregates ─────────────────────────────── */}
            <div className="mb-8 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <h2 className="font-bold text-white">All-User Totals by Feature</h2>
                <span className="text-xs text-slate-500">{(metrics.global?.featureBreakdown || []).length} features tracked</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="px-5 py-3">Feature</th>
                      <th className="px-5 py-3">Engine</th>
                      <th className="px-5 py-3">Calls</th>
                      <th className="px-5 py-3">Unique Users</th>
                      <th className="px-5 py-3">Input Tokens</th>
                      <th className="px-5 py-3">Output Tokens</th>
                      <th className="px-5 py-3">Total Tokens</th>
                      <th className="px-5 py-3">LLM Cost ₹</th>
                      <th className="px-5 py-3">Astro Cost ₹</th>
                      <th className="px-5 py-3 text-rose-300">Total Cost ₹</th>
                      <th className="px-5 py-3">Credits Charged</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {(metrics.global?.featureBreakdown || []).length === 0
                      ? <tr><td colSpan={11} className="px-5 py-8 text-center text-slate-500">No feature usage logged yet. Once users generate reports, rows will appear here.</td></tr>
                      : (metrics.global.featureBreakdown as any[]).map(f => (
                        <tr key={f.key} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-4 font-semibold text-white">{f.label}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              f.engine === 'llm' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/40'
                              : 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40'
                            }`}>{f.engine === 'llm' ? 'LLM' : 'PDF'}</span>
                          </td>
                          <td className="px-5 py-4 font-mono text-white">{fmt(f.calls)}</td>
                          <td className="px-5 py-4 font-mono text-cyan-300">{fmt(f.uniqueUsers)}</td>
                          <td className="px-5 py-4 font-mono text-indigo-400">{fmt(f.inputTokens)}</td>
                          <td className="px-5 py-4 font-mono text-emerald-400">{fmt(f.outputTokens)}</td>
                          <td className="px-5 py-4 font-mono text-white font-bold">{fmt(f.totalTokens)}</td>
                          <td className="px-5 py-4 font-mono text-amber-400">{inr(f.llmCostInr || 0)}</td>
                          <td className="px-5 py-4 font-mono text-emerald-400">{inr(f.astroCostInr || 0)}</td>
                          <td className="px-5 py-4 font-mono font-bold text-rose-400">{inr(f.totalCostInr || 0)}</td>
                          <td className="px-5 py-4 font-mono text-slate-300">{f.creditsCharged ?? 0}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Per-User × Feature matrix ─────────────────────────────── */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 flex flex-wrap items-center gap-3">
                <h2 className="font-bold text-white">Per-User × Feature Matrix</h2>
                <span className="text-xs text-slate-500">Click a row to expand and see exactly which features each user has consumed.</span>
                <input
                  type="text"
                  value={featureSearch}
                  onChange={e => setFeatureSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="ml-auto bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white w-64 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="px-5 py-3 w-8"></th>
                      <th className="px-5 py-3">User</th>
                      <th className="px-5 py-3">Features Used</th>
                      <th className="px-5 py-3">Total Tokens</th>
                      <th className="px-5 py-3">LLM Cost ₹</th>
                      <th className="px-5 py-3">Astro Cost ₹</th>
                      <th className="px-5 py-3 text-rose-300">Total Cost ₹</th>
                      <th className="px-5 py-3">Credits Charged</th>
                      <th className="px-5 py-3">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {(() => {
                      const filtered = (metrics.users as any[]).filter((u: any) => {
                        if (!u.featureBreakdown || u.featureBreakdown.length === 0) return false;
                        if (!featureSearch.trim()) return true;
                        const q = featureSearch.toLowerCase();
                        return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
                      });
                      if (filtered.length === 0) {
                        return <tr><td colSpan={9} className="px-5 py-8 text-center text-slate-500">No matching users with feature usage.</td></tr>;
                      }
                      return filtered.map((u: any) => {
                        const isOpen = expandedUserId === u.id;
                        return (
                          <>
                            <tr
                              key={u.id}
                              className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                              onClick={() => setExpandedUserId(isOpen ? null : u.id)}
                            >
                              <td className="px-5 py-4 text-slate-400">
                                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </td>
                              <td className="px-5 py-4">
                                <div className="font-semibold text-white">{u.name}</div>
                                <div className="text-xs text-slate-500">{u.email}</div>
                              </td>
                              <td className="px-5 py-4 font-mono text-cyan-300">{u.featureBreakdown.length}</td>
                              <td className="px-5 py-4 font-mono text-white">{fmt(u.totalTokens)}</td>
                              <td className="px-5 py-4 font-mono text-amber-400">{inr(u.llmCostInr || 0)}</td>
                              <td className="px-5 py-4 font-mono text-emerald-400">{inr(u.astroCostInr || 0)}</td>
                              <td className="px-5 py-4 font-mono font-bold text-rose-400">{inr(u.totalCostInr || 0)}</td>
                              <td className="px-5 py-4 font-mono text-slate-300">{u.creditsDeducted ?? 0}</td>
                              <td className="px-5 py-4 text-xs text-slate-400">{ago(u.lastActivityAt)}</td>
                            </tr>
                            {isOpen && (
                              <tr key={`${u.id}-expand`} className="bg-slate-900/40">
                                <td colSpan={9} className="px-5 py-4">
                                  <div className="rounded-lg border border-slate-700/60 overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                      <thead className="bg-slate-900/80 text-[10px] uppercase tracking-wider text-slate-500">
                                        <tr>
                                          <th className="px-4 py-2">Feature</th>
                                          <th className="px-4 py-2">Engine</th>
                                          <th className="px-4 py-2">Calls</th>
                                          <th className="px-4 py-2">Input</th>
                                          <th className="px-4 py-2">Output</th>
                                          <th className="px-4 py-2">Total Tokens</th>
                                          <th className="px-4 py-2">LLM ₹</th>
                                          <th className="px-4 py-2">Astro ₹</th>
                                          <th className="px-4 py-2 text-rose-300">Total ₹</th>
                                          <th className="px-4 py-2">Credits Charged</th>
                                          <th className="px-4 py-2">Last Used</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-700/40">
                                        {u.featureBreakdown.map((f: any) => (
                                          <tr key={f.key}>
                                            <td className="px-4 py-2 font-semibold text-white">{f.label}</td>
                                            <td className="px-4 py-2">
                                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                                f.engine === 'llm' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/40'
                                                : 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40'
                                              }`}>{f.engine === 'llm' ? 'LLM' : 'PDF'}</span>
                                            </td>
                                            <td className="px-4 py-2 font-mono text-white">{fmt(f.calls)}</td>
                                            <td className="px-4 py-2 font-mono text-indigo-400">{fmt(f.inputTokens)}</td>
                                            <td className="px-4 py-2 font-mono text-emerald-400">{fmt(f.outputTokens)}</td>
                                            <td className="px-4 py-2 font-mono text-white font-bold">{fmt(f.totalTokens)}</td>
                                            <td className="px-4 py-2 font-mono text-amber-400">{inr(f.llmCostInr || 0)}</td>
                                            <td className="px-4 py-2 font-mono text-emerald-400">{inr(f.astroCostInr || 0)}</td>
                                            <td className="px-4 py-2 font-mono font-bold text-rose-400">{inr(f.totalCostInr || 0)}</td>
                                            <td className="px-4 py-2 font-mono text-slate-300">{f.creditsCharged ?? 0}</td>
                                            <td className="px-4 py-2 text-slate-400">{ago(f.lastUsedAt)}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </>}
        </div>
      )}

      {/* ── ASTROLOGY API TAB ────────────────────────────────── */}
      {tab === "astro" && (
        <div className="px-6 pb-12">
          {!metrics ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div> : <>

            {/* Top KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total API Calls", value: fmt(g.totalAstroCalls || 0), color: "text-white" },
                { label: "Cached (Free)", value: fmt((metrics.recentActivity || []).filter((r:any)=>r.type==="astro"&&r.cached).length), color: "text-emerald-400" },
                { label: "Live API Calls", value: fmt((metrics.recentActivity || []).filter((r:any)=>r.type==="astro"&&!r.cached).length), color: "text-indigo-400" },
                { label: "AstrologyAPI Cost", value: inr(g.totalAstroCostInr || 0), color: "text-amber-400" },
              ].map(k => (
                <div key={k.label} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{k.label}</div>
                  <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* Info banner */}
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-xs text-slate-400">
              💡 <strong className="text-slate-300">AstrologyAPI.com:</strong> Each new birth chart batch = ₹0.084 (~$0.001). Cached charts = ₹0.00 (free). Cache hit = no API call made.
            </div>

            {/* Endpoint breakdown */}
            <div className="mb-8 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700"><h2 className="font-bold text-white">Endpoint Usage</h2></div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(g.astroEndpointUsage || {}).length === 0
                  ? <p className="text-slate-400 text-sm col-span-3">No AstrologyAPI calls logged yet.</p>
                  : Object.entries(g.astroEndpointUsage).map(([ep, d]: any) => (
                    <div key={ep} className="bg-slate-900 p-4 rounded-lg border border-slate-700/50">
                      <div className="font-mono text-indigo-300 text-sm mb-3">{ep}</div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Calls</span><span className="font-mono text-white font-bold">{d.count}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-slate-400">Cost</span><span className="font-mono text-amber-400 font-bold">{inr(d.costInr)}</span></div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Per-user astro stats */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700"><h2 className="font-bold text-white">Per-User AstrologyAPI Consumption</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="px-5 py-3">User</th>
                      <th className="px-5 py-3">API Calls</th>
                      <th className="px-5 py-3">AstroCost ₹</th>
                      <th className="px-5 py-3">LLM Cost ₹</th>
                      <th className="px-5 py-3">Total Cost ₹</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {metrics.users.filter((u: any) => u.astroCalls > 0 || u.totalTokens > 0).length === 0
                      ? <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">No usage yet.</td></tr>
                      : metrics.users.map((u: any) => (
                        <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </td>
                          <td className="px-5 py-4 font-mono text-indigo-400 font-bold">{u.astroCalls}</td>
                          <td className="px-5 py-4 font-mono text-amber-400 font-bold">{inr(u.astroCostInr)}</td>
                          <td className="px-5 py-4 font-mono text-amber-300">{inr(u.llmCostInr)}</td>
                          <td className="px-5 py-4 font-mono font-bold text-rose-400">{inr(u.totalCostInr)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>}
        </div>
      )}
      {/* ── PROMO CODES TAB ──────────────────────────────────────── */}
      {tab === "promos" && (
        <div className="px-6 pb-12">
          {!promos ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div> : <>

            {/* Summary KPIs */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Codes", value: promos.summary.total, color: "text-white" },
                { label: "Used", value: promos.summary.used, color: "text-rose-400" },
                { label: "Available", value: promos.summary.available, color: "text-emerald-400" },
              ].map(k => (
                <div key={k.label} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{k.label}</div>
                  <div className={`text-3xl font-bold ${k.color}`}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* Codes Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                <h2 className="font-bold text-white">All Promo Codes</h2>
                <button onClick={() => fetchPromos(token)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-all">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="px-5 py-3">#</th>
                      <th className="px-5 py-3">Code</th>
                      <th className="px-5 py-3">Credits</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Used By</th>
                      <th className="px-5 py-3">Used At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {(promos.codes || []).map((c: any, i: number) => (
                      <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-3 text-slate-500 font-mono text-xs">{i + 1}</td>
                        <td className="px-5 py-3">
                          <span className="font-mono font-bold text-indigo-300 bg-slate-900 px-2 py-1 rounded text-xs tracking-widest">
                            {c.code}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono font-bold text-emerald-400">{c.credits_granted}</td>
                        <td className="px-5 py-3">
                          {c.used_by ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-900/40 text-rose-400 border border-rose-700/40 rounded text-xs font-bold">
                              ✓ USED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-900/40 text-emerald-400 border border-emerald-700/40 rounded text-xs font-bold">
                              ◦ AVAILABLE
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          {c.used_by ? (
                            <div>
                              <div className="font-semibold text-white text-sm">{c.used_by_name}</div>
                              <div className="text-xs text-slate-400">{c.used_by_email}</div>
                            </div>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-400 font-mono">
                          {c.used_at ? new Date(c.used_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
          }
        </div>
      )}
      {/* ── ASTROLOGERS TAB ──────────────────────────────────── */}
      {tab === "astrologers" && (
        <div className="px-6 pb-12">
          {!astrologersData ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div> : <>

            {/* LLM Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Gemini 3.1 Pro", input: astrologersData.overallMetrics?.gemini?.input, output: astrologersData.overallMetrics?.gemini?.output, cost: astrologersData.overallMetrics?.gemini?.cost, color: "text-blue-400" },
                { label: "Claude Sonnet", input: astrologersData.overallMetrics?.claude?.input, output: astrologersData.overallMetrics?.claude?.output, cost: astrologersData.overallMetrics?.claude?.cost, color: "text-purple-400" },
                { label: "Astro API", input: null, output: null, cost: astrologersData.overallMetrics?.api?.cost, color: "text-green-400" },
              ].map(k => (
                <div key={k.label} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{k.label}</div>
                  {k.input !== null && <><div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Tokens In</span><span className="text-indigo-400 font-mono">{fmt(k.input || 0)}</span></div>
                  <div className="flex justify-between text-xs mb-2"><span className="text-slate-400">Tokens Out</span><span className="text-emerald-400 font-mono">{fmt(k.output || 0)}</span></div></>}
                  <div className="flex justify-between text-sm font-bold border-t border-slate-700 pt-2 mt-1"><span className="text-slate-300">Cost</span><span className={k.color}>{inr(k.cost || 0)}</span></div>
                </div>
              ))}
            </div>

            {/* Astrologers Management Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                <h2 className="font-bold text-white">Astrologer Applications (10 Most Recent)</h2>
                <button onClick={() => fetchAstrologers(token)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-all">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="px-5 py-3">Astrologer</th>
                      <th className="px-5 py-3">Experience</th>
                      <th className="px-5 py-3">Applied On</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">LLM Usage</th>
                      <th className="px-5 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {(astrologersData.recentAstrologers || []).length === 0
                      ? <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">No astrologer applications yet.</td></tr>
                      : (astrologersData.recentAstrologers || []).map((a: any) => (
                        <tr key={a.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-white">{a.full_name || '—'}</div>
                            <div className="text-xs text-slate-500">{a.email}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-900/40 text-amber-400 border border-amber-700/40">
                              {a.experience_level || '—'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                            {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-bold ${
                              a.status === 'approved' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/40'
                              : a.status === 'declined' ? 'bg-red-900/40 text-red-400 border border-red-700/40'
                              : 'bg-blue-900/40 text-blue-400 border border-blue-700/40'
                            }`}>{a.status}</span>
                          </td>
                          <td className="px-5 py-4 font-mono">
                            <div className="text-xs text-slate-400">{fmt(a.usage?.total || 0)} tokens</div>
                            <div className="text-xs text-amber-400 font-bold mt-0.5">{inr(a.usage?.cost || 0)}</div>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <select
                              value={a.status}
                              onChange={(e) => updateAstrologerStatus(a.id, e.target.value)}
                              className="bg-slate-900 border border-slate-600 text-white text-xs rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approve ✓</option>
                              <option value="declined">Decline ✗</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
          }
        </div>
      )}
    </div>
  );
}
