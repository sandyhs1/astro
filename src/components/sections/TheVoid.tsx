"use client";

export default function TheVoid() {
    return (
        <footer className="bg-black py-20 px-6 border-t border-[#333]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end">
                <div>
                    <h2 className="font-serif text-2xl text-white mb-2">SoulSync</h2>
                    <p className="font-mono text-gray-500 text-sm">
                        Fate is optional. Dominance is a choice.
                    </p>
                </div>

                <div className="mt-12 md:mt-0 flex gap-8">
                    <a href="#" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Manifesto</a>
                    <a href="#" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Legal</a>
                    <a href="#" className="font-mono text-xs text-gray-600 hover:text-[#FFD700] transition-colors uppercase">Login</a>
                </div>
            </div>

            <div className="text-center mt-20">
                <p className="font-mono text-[10px] text-[#333]">
                    EST. 2026 // SYSTEM VERSION 1.0.4 // NO REFUNDS ON KARMA
                </p>
            </div>
        </footer>
    );
}
