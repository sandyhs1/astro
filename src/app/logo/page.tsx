import AnimatedLogo from "@/components/ui/AnimatedLogo";
import QuantumLogo from "@/components/ui/QuantumLogo";
import { FiDownload } from "react-icons/fi";

export default function LogoPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-sans overflow-hidden relative">

            <div className="w-full max-w-5xl flex flex-col items-center z-10">

                <div className="text-center space-y-4 mb-4">
                    <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-400 to-red-600 tracking-widest uppercase mb-4">
                        Brand Identity
                    </h1>
                    <p className="text-red-500/80 text-sm md:text-lg tracking-[0.4em] uppercase font-mono">
                        Quantum Data Mesh Apex Series
                    </p>
                </div>

                <QuantumLogo />

                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-xs tracking-widest uppercase mb-8">Legacy Assets</p>
                    <div className="opacity-20 hover:opacity-100 transition-opacity">
                        <AnimatedLogo isFloating={true} />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mt-16 w-full max-w-3xl justify-center items-center">
                    <a
                        href="/logo-transparent.png"
                        download="Quantum_Karma_Logo_Transparent.png"
                        className="group flex flex-col items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-[#d4af37] to-[#e6c875] text-black font-semibold rounded-2xl hover:bg-[#ebd06b] transition-all transform hover:-translate-y-1 hover:scale-105 duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] w-full sm:w-auto"
                    >
                        <div className="flex items-center gap-3">
                            <FiDownload className="text-2xl group-hover:animate-bounce" />
                            <span className="text-lg tracking-wide uppercase">Transparent Logo</span>
                        </div>
                        <span className="text-xs opacity-80 font-medium">Perfect for dark backgrounds</span>
                    </a>

                    <a
                        href="/logo-original.png"
                        download="Quantum_Karma_Logo_Original.png"
                        className="group flex flex-col items-center justify-center gap-2 px-8 py-5 bg-black/50 backdrop-blur-md border border-[#d4af37]/50 text-[#d4af37] font-semibold rounded-2xl hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all transform hover:-translate-y-1 hover:scale-105 duration-300 w-full sm:w-auto"
                    >
                        <div className="flex items-center gap-3">
                            <FiDownload className="text-2xl group-hover:animate-bounce" />
                            <span className="text-lg tracking-wide uppercase">Original PNG</span>
                        </div>
                        <span className="text-xs opacity-70 font-medium">White bounding box</span>
                    </a>
                </div>

                <div className="mt-24 text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-5xl font-serif text-white tracking-widest uppercase">
                        New Logo Concepts
                    </h2>
                    <p className="text-red-500 font-mono text-sm md:text-md tracking-[0.2em] uppercase">
                        Quantum Data Mesh Apex Series
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-12 mt-8 w-full max-w-5xl justify-center items-center">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                            <img src="/quantum_karma_logo_dark.png" alt="Quantum Karma Dark Concept" className="w-full h-full object-cover" />
                        </div>
                        <a
                            href="/quantum_karma_logo_dark.png"
                            download="quantum_karma_logo_dark.png"
                            className="group flex flex-col items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-red-900 to-red-600 text-white font-semibold rounded-2xl hover:bg-red-500 transition-all transform hover:-translate-y-1 hover:scale-105 duration-300 shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:shadow-[0_0_40px_rgba(255,0,0,0.7)] w-full sm:w-auto"
                        >
                            <div className="flex items-center gap-3">
                                <FiDownload className="text-2xl group-hover:animate-bounce" />
                                <span className="text-lg tracking-wide uppercase">Dark Concept</span>
                            </div>
                        </a>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                            <img src="/quantum_karma_logo_light.png" alt="Quantum Karma Light Concept" className="w-full h-full object-cover" />
                        </div>
                        <a
                            href="/quantum_karma_logo_light.png"
                            download="quantum_karma_logo_light.png"
                            className="group flex flex-col items-center justify-center gap-2 px-8 py-5 bg-white text-black font-semibold rounded-2xl hover:bg-gray-200 transition-all transform hover:-translate-y-1 hover:scale-105 duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] w-full sm:w-auto"
                        >
                            <div className="flex items-center gap-3">
                                <FiDownload className="text-2xl group-hover:animate-bounce" />
                                <span className="text-lg tracking-wide uppercase">Light Concept</span>
                            </div>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
