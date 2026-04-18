"use client";

import { useState, useEffect } from 'react';
import { Upload, LogOut, Copy, CheckCircle2, Loader2 } from 'lucide-react';
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

            <div className="clients-table-container">
                <table className="clients-table">
                    <thead>
                        <tr>
                            <th>Client Info</th>
                            <th>Status</th>
                            <th>Portal Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-slate-400">No clients found yet.</td>
                            </tr>
                        ) : clients.map(client => (
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
