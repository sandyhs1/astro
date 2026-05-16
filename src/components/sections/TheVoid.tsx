"use client";

import { useState } from 'react';
import LegalModal from '../features/LegalModal';
import SupportModal from '../features/SupportModal';

export default function TheVoid() {
    const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' | 'refunds' | null }>({
        isOpen: false,
        type: null
    });
    const [isSupportOpen, setIsSupportOpen] = useState(false);

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
                    <a href="/reviews" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Reviews</a>
                    <a href="/sample-report" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Sample Report</a>
                    <a href="/roadmap" className="font-mono text-xs text-gray-600 hover:text-[#00FF41] transition-colors uppercase">Roadmap</a>
                    <a href="/astrology" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Astrology</a>
                    <a href="/our-process" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Our Process</a>
                    <a href="/myths" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Myths</a>
                    <a href="https://quantumkarma.substack.com/" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Blog</a>
                    <a href="/technology" className="font-mono text-xs text-gray-600 hover:text-[#00FF41] transition-colors uppercase">Tech</a>
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
                    <button
                        onClick={() => setIsSupportOpen(true)}
                        className="font-mono text-xs text-[#FFD700] hover:text-[#e6c875] transition-colors uppercase font-bold"
                    >
                        Support
                    </button>
                </div>
            </div>

            <div className="text-center mt-20 flex flex-col items-center gap-4">

                <button 
                    onClick={() => openLegal('refunds')}
                    className="font-mono text-[10px] md:text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                    No refunds on karma. Precision is guaranteed; your ego is not.
                </button>
            </div>

            <LegalModal
                isOpen={legalModal.isOpen}
                type={legalModal.type}
                onClose={() => setLegalModal({ ...legalModal, isOpen: false })}
            />
            <SupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
            />


        </footer>
    );
}
