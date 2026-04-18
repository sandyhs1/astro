"use client";

import { useState, use } from 'react';
import { Download, Lock, Loader2, Sparkles } from 'lucide-react';
import './portal.css';

export default function ClientPortal({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<1 | 2>(1); // 1: PIN, 2: Dashboard
    const [portalData, setPortalData] = useState<any>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pin || pin.length < 6) {
            setError('Please enter your 6-digit PIN');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/portal/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, pin })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Invalid PIN');
            }

            setPortalData(data.client);
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/portal/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, pin })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to download report');
            }

            // Open the signed URL in a new tab to trigger download
            window.location.href = data.url;
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="portal-root">
            <div className="portal-container">
                <div className="portal-logo">
                    <Sparkles size={32} />
                </div>
                
                {step === 1 ? (
                    <>
                        <h1 className="portal-title">Client Portal</h1>
                        <p className="portal-subtitle">Enter the 6-digit PIN sent to your email to access your cosmic blueprint.</p>
                        
                        <form onSubmit={handleVerify} className="pin-input-group">
                            <div>
                                <input 
                                    type="text" 
                                    maxLength={6}
                                    placeholder="••••••"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\\D/g, ''))}
                                    className="pin-input"
                                    autoFocus
                                />
                                {error && <p className="error-text">{error}</p>}
                            </div>
                            <button 
                                type="submit" 
                                className="portal-btn"
                                disabled={isLoading || pin.length < 6}
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
                                Unlock Portal
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="portal-title">{portalData?.welcomeMessage}</h1>
                        <p className="portal-subtitle">Here is where your astrological insights are delivered securely.</p>
                        
                        <div className="portal-card">
                            <div className={`status-badge ${portalData?.hasReport ? 'status-ready' : 'status-pending'}`}>
                                {portalData?.hasReport ? 'Report Ready' : 'Report in Progress'}
                            </div>
                            
                            {portalData?.hasReport ? (
                                <>
                                    <h3 style={{ marginBottom: '1rem', color: 'white' }}>Your Birth Chart Report</h3>
                                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                        Carefully analyzed and compiled just for you.
                                    </p>
                                    <button 
                                        className="portal-btn"
                                        onClick={handleDownload}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : <Download size={20} />}
                                        Download PDF Report
                                    </button>
                                    {error && <p className="error-text mt-2">{error}</p>}
                                </>
                            ) : (
                                <>
                                    <div style={{ padding: '1rem' }}>
                                        <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: '#9333ea' }} />
                                        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Analyzing the Stars...</h3>
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                            Your birth details are being analyzed. You will receive an email as soon as your PDF report is ready here.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
