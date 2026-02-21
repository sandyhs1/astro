"use client";

import { useState } from 'react';
import LegalModal from '../features/LegalModal';

export default function TheVoid() {
    const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' | 'refunds' | null }>({
        isOpen: false,
        type: null
    });

    const openLegal = (type: 'terms' | 'privacy' | 'refunds') => {
        setLegalModal({ isOpen: true, type });
    };

    return (
        <footer className="bg-black py-20 px-6 border-t border-[#333]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end">
                <div>
                    <h2 className="font-serif text-2xl text-white mb-2">Quantum Karma</h2>
                    <p className="font-mono text-gray-500 text-sm">
                        Fate is optional. Dominance is a choice.
                    </p>
                </div>

                <div className="mt-12 md:mt-0 flex flex-wrap gap-x-8 gap-y-4 justify-end">
                    <a href="/report" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Report</a>
                    <a href="/sample-report" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Sample Report</a>
                    <a href="/astrology" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Astrology</a>
                    <a href="/our-process" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Our Process</a>
                    <a href="/myths" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Myths</a>
                    <button
                        onClick={() => openLegal('refunds')}
                        className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase"
                    >
                        Refunds
                    </button>
                    <button
                        onClick={() => openLegal('terms')}
                        className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase"
                    >
                        Terms
                    </button>
                    <button
                        onClick={() => openLegal('privacy')}
                        className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase"
                    >
                        Privacy
                    </button>
                </div>
            </div>

            <div className="text-center mt-20">
                <p className="font-mono text-[10px] text-[#333]">
                    EST. 2026 // SYSTEM VERSION 1.0.4 // NO REFUNDS ON KARMA
                </p>
            </div>

            <LegalModal
                isOpen={legalModal.isOpen}
                type={legalModal.type}
                onClose={() => setLegalModal({ ...legalModal, isOpen: false })}
            />
        </footer>
    );
}
