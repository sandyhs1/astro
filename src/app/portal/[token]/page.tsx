"use client";

import { useState, use } from 'react';
import { Download, Lock, Loader2, Sparkles } from 'lucide-react';
import './portal.css';

export default function ClientPortal({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLocked, setIsLocked] = useState(false);
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

            if (res.status === 423) {
                // Portal has been locked due to too many failed attempts
                setIsLocked(true);
                setError(data.error);
                return;
            }

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

                        {isLocked ? (
                            <>
                                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                    <div className="mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center p-4" style={{ width: 'fit-content' }}>
                                        <Lock className="text-red-600" size={28} />
                                    </div>
                                    <h2 className="portal-title" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Portal Locked</h2>
                                    <p className="portal-subtitle" style={{ color: '#f87171' }}>
                                        {error}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="portal-subtitle">Enter the 6-digit PIN sent to your email to access your cosmic blueprint.</p>
                                
                                <form onSubmit={handleVerify} className="pin-input-group">
                                    <div>
                                        <input 
                                            type="text" 
                                            maxLength={6}
                                            placeholder="••••••"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                            className="pin-input"
                                            autoFocus
                                            autoComplete="off"
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
                        )}
                    </>
                ) : (
                    <>
                        <h1 className="portal-title">{portalData?.welcomeMessage}</h1>
                        <p className="portal-subtitle">Here is where your astrological insights are delivered securely.</p>
                        
                        <div className="portal-card">
                            {portalData?.paymentStatus?.toLowerCase() === 'failed' && !portalData?.hasReport && (
                                <div style={{ padding: '1rem' }}>
                                    <div className="mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center p-3" style={{ width: 'fit-content' }}>
                                        <Lock className="text-red-600" size={24} />
                                    </div>
                                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Payment Incomplete</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                        It looks like your payment did not go through or was abandoned before completion. Please complete your payment to unlock your cosmic blueprint and report.
                                    </p>
                                </div>
                            )}

                            {portalData?.paymentStatus?.toLowerCase() === 'pending' && !portalData?.hasReport && (
                                <div style={{ padding: '1rem' }}>
                                    <div className="mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center p-3" style={{ width: 'fit-content' }}>
                                        <Loader2 className="text-yellow-600 animate-spin" size={24} />
                                    </div>
                                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Awaiting Payment</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                        Your birth details have been saved, but we are waiting for your payment to be completed. Your analysis will begin immediately after successful checkout.
                                    </p>
                                </div>
                            )}

                            {((portalData?.paymentStatus?.toLowerCase() === 'success' || !portalData?.paymentStatus) && !portalData?.hasReport) && (
                                <div style={{ padding: '1rem' }}>
                                    <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: '#9333ea' }} />
                                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Analyzing the Stars...</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                        Your payment is confirmed and your birth details are being analyzed. You will receive an email as soon as your PDF report is ready here.
                                    </p>
                                </div>
                            )}

                            {portalData?.hasReport && (
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
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
