"use client";

import { useState, useEffect } from 'react';
import { Upload, LogOut, Copy, CheckCircle2, Loader2, Users, Activity, IndianRupee } from 'lucide-react';
import './admin.css';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    
    // Status states
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');
    
    const [clients, setClients] = useState<any[]>([]);
    
    // AI Metrics state
    const [activeTab, setActiveTab] = useState<'clients' | 'ai'>('clients');
    const [metrics, setMetrics] = useState<any>(null);
    const [isFetchingMetrics, setIsFetchingMetrics] = useState(false);

    useEffect(() => {
        // Simple local storage mock for session
        const savedToken = localStorage.getItem('adminToken');
        if (savedToken) {
            setToken(savedToken);
            setIsAuthenticated(true);
            fetchClients(savedToken);
        } else {
            setIsFetching(false);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();

            if (res.ok) {
                setToken(data.token);
                setIsAuthenticated(true);
                localStorage.setItem('adminToken', data.token);
                fetchClients(data.token);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setToken('');
        setClients([]);
    };

    const fetchClients = async (authToken: string) => {
        setIsFetching(true);
        try {
            const res = await fetch('/api/admin/clients', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await res.json();
            
            if (res.ok) {
                setClients(data.clients);
            } else if (res.status === 401) {
                handleLogout(); // Token expired/invalid
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchMetrics = async (authToken: string) => {
        setIsFetchingMetrics(true);
        try {
            const res = await fetch('/api/admin/ai-metrics', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const data = await res.json();
            
            if (res.ok) {
                setMetrics(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsFetchingMetrics(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && token && activeTab === 'ai' && !metrics) {
            fetchMetrics(token);
        }
    }, [activeTab, isAuthenticated, token]);

    // Auto-refresh AI metrics every 30s when on AI tab
    useEffect(() => {
        if (!isAuthenticated || !token || activeTab !== 'ai') return;
        const interval = setInterval(() => fetchMetrics(token), 30_000);
        return () => clearInterval(interval);
    }, [activeTab, isAuthenticated, token]);

    const handleFileUpload = async (portalId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Only PDF files are allowed');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('portalId', portalId);

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/upload-report', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            
            if (res.ok) {
                alert('Report uploaded successfully!');
                fetchClients(token); // Refresh list
            } else {
                const data = await res.json();
                alert(`Upload failed: ${data.error}`);
            }
        } catch (err) {
            alert('Upload failed due to network error');
        } finally {
            setIsLoading(false);
            // Reset input
            event.target.value = '';
        }
    };



    const handleUpdatePaymentStatus = async (leadId: string, paymentStatus: string) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/update-payment', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ leadId, paymentStatus })
            });
            if (res.ok) {
                fetchClients(token);
            } else {
                const data = await res.json();
                alert(`Update failed: ${data.error}`);
            }
        } catch (err) {
            alert('Update failed due to network error');
        } finally {
            setIsLoading(false);
        }
    };

    const copyPortalLink = (accessToken: string) => {
        const url = `${window.location.origin}/portal/${accessToken}`;
        navigator.clipboard.writeText(url);
        alert('Portal link copied to clipboard!');
    };

    if (isFetching && !isAuthenticated) {
        return <div className="login-container"><Loader2 className="animate-spin text-white" /></div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <h2 className="admin-title">YNTRA Admin</h2>
                    <form onSubmit={handleLogin}>
                        <input 
                            type="password" 
                            className="login-input" 
                            placeholder="Admin Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        {error && <p className="error-text mb-4">{error}</p>}
                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? 'Wait...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-root">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Client Portals</h1>
                    <p className="text-slate-400 mt-1">Manage birth reports and portal access</p>
                </div>
                <button onClick={handleLogout} className="admin-logout flex items-center gap-2">
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div className="flex gap-4 mb-6 px-6">
                <button 
                    onClick={() => setActiveTab('clients')}
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-all flex items-center gap-2 ${activeTab === 'clients' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    <Users size={16} /> Portals & Leads
                </button>
                <button 
                    onClick={() => setActiveTab('ai')}
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-all flex items-center gap-2 ${activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    <Activity size={16} /> AI Usage & Cost
                </button>
            </div>

            {activeTab === 'clients' ? (
                <div className="clients-table-container">
                <table className="clients-table">
                    <thead>
                        <tr>
                            <th>Client Info</th>
                            <th>Status (Portal)</th>
                            <th>Payment Status</th>
                            <th>Portal Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-slate-400">No clients found yet.</td>
                            </tr>
                        ) : clients.map(client => {
                            const paymentStatus = client.onboarding_leads?.payment_status || 'pending';
                            return (
                            <tr key={client.id}>
                                <td>
                                    <div className="font-semibold text-white">{client.full_name}</div>
                                    <div className="text-sm text-slate-400">{client.email}</div>
                                </td>
                                <td>
                                    <span className={`badge ${client.status}`}>
                                        {client.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        value={paymentStatus.toLowerCase()} 
                                        onChange={(e) => handleUpdatePaymentStatus(client.lead_id, e.target.value)}
                                        disabled={isLoading}
                                        className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-1 text-xs outline-none"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="success">Success</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </td>
                                <td>
                                    <div className="text-sm font-mono bg-slate-800 px-2 py-1 rounded inline-block">
                                        PIN: {client.access_pin}
                                    </div>
                                    <button 
                                        className="text-xs text-indigo-400 block mt-1 hover:underline flex items-center gap-1"
                                        onClick={() => copyPortalLink(client.access_token)}
                                    >
                                        <Copy size={12} /> Copy URL
                                    </button>
                                </td>
                                <td>
                                    <div className="actions-flex">
                                        <div className="file-input-wrapper">
                                            <button className="action-btn">
                                                {client.report_url ? <><CheckCircle2 size={14}/> Replace PDF</> : <><Upload size={14}/> Upload PDF</>}
                                            </button>
                                            <input 
                                                type="file" 
                                                accept=".pdf" 
                                                onChange={(e) => handleFileUpload(client.id, e)}
                                                disabled={isLoading}
                                            />
                                        </div>

                                    </div>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
            ) : (
                <div className="px-6 pb-12 text-white">
                    {isFetchingMetrics && !metrics ? (
                        <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-indigo-500" /></div>
                    ) : metrics ? (
                        <>
                            {/* Global Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Total Tokens</div>
                                    <div className="text-3xl font-bold text-white">{(metrics.global.totalTokens || 0).toLocaleString()}</div>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Input Tokens</div>
                                    <div className="text-3xl font-bold text-indigo-400">{(metrics.global.totalInputTokens || 0).toLocaleString()}</div>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Output Tokens</div>
                                    <div className="text-3xl font-bold text-emerald-400">{(metrics.global.totalOutputTokens || 0).toLocaleString()}</div>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <div className="text-sm font-semibold text-slate-400 mb-1 flex items-center gap-1 uppercase tracking-wider">
                                        <IndianRupee size={14}/> Total API Cost
                                    </div>
                                    <div className="text-3xl font-bold text-amber-400">₹{(metrics.global.totalCostInr || 0).toFixed(4)}</div>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Credits Consumed</div>
                                    <div className="text-3xl font-bold text-rose-400">{(metrics.global.totalCreditsUsed || 0).toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Model Usage Breakdown */}
                            <div className="mb-8 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
                                    <h2 className="text-lg font-bold text-white">Model Overview</h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {Object.keys(metrics.global.modelUsage || {}).length === 0 ? (
                                        <div className="text-slate-400">No AI usage logged yet.</div>
                                    ) : Object.entries(metrics.global.modelUsage).map(([model, data]: any) => (
                                        <div key={model} className="bg-slate-900 p-4 rounded-lg border border-slate-700/50">
                                            <div className="font-semibold text-indigo-300 mb-2">{model}</div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-400">Generations:</span>
                                                <span className="font-mono text-white">{data.count}</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-400">Tokens:</span>
                                                <span className="font-mono text-white">{data.tokens.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-bold">
                                                <span className="text-slate-400">Cost:</span>
                                                <span className="font-mono text-amber-400">₹{data.cost.toFixed(4)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-white">User Consumption Intel</h2>
                                    {metrics.fetchedAt && (
                                        <span className="text-xs text-slate-500">Last updated: {new Date(metrics.fetchedAt).toLocaleTimeString()} · auto-refreshes every 30s</span>
                                    )}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-900/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                                                <th className="px-6 py-4">User</th>
                                                <th className="px-6 py-4">Tokens (In / Out / Total)</th>
                                                <th className="px-6 py-4">Est. API Cost</th>
                                                <th className="px-6 py-4">Credits Used</th>
                                                <th className="px-6 py-4">Credits Remaining</th>
                                                <th className="px-6 py-4">Models Used</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50">
                                            {metrics.users.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No users found.</td>
                                                </tr>
                                            ) : metrics.users.map((u: any) => (
                                                <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-white">{u.name || 'Unknown User'}</div>
                                                        <div className="text-xs text-slate-500 mt-0.5">Joined: {new Date(u.joinedAt).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-sm">
                                                        <span className="text-indigo-400">{u.inputTokens.toLocaleString()}</span>
                                                        <span className="text-slate-600 mx-2">/</span>
                                                        <span className="text-emerald-400">{u.outputTokens.toLocaleString()}</span>
                                                        <span className="text-slate-600 mx-2">/</span>
                                                        <span className="text-white font-bold">{u.totalTokens.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-mono font-bold text-amber-400">₹{u.costInr.toFixed(4)}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-mono font-bold text-rose-400">{u.creditsUsed ?? 0}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`font-mono font-bold ${ (u.creditsRemaining ?? 0) <= 5 ? 'text-red-400' : (u.creditsRemaining ?? 0) <= 20 ? 'text-amber-400' : 'text-emerald-400' }`}>
                                                            {u.creditsRemaining ?? 0}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2 flex-wrap">
                                                            {u.modelsUsed.map((m: string, i: number) => (
                                                                <span key={i} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-[10px] uppercase font-bold tracking-wider">{m}</span>
                                                            ))}
                                                            {u.modelsUsed.length === 0 && <span className="text-slate-500 text-xs italic">None</span>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-slate-400">Error loading metrics. Did you run the SQL migration?</div>
                    )}
                </div>
            )}
        </div>
    );
}
