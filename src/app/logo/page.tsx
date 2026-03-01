import AnimatedLogo from "@/components/ui/AnimatedLogo";
import { FiDownload } from "react-icons/fi";

export default function LogoPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-sans overflow-hidden relative">

            <div className="w-full max-w-5xl flex flex-col items-center z-10">

                <div className="text-center space-y-4 mb-4">
                    <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#e6c875] via-[#d4af37] to-[#e6c875] tracking-widest uppercase">
                        The Brand Assets
                    </h1>
                    <p className="text-gray-400 text-sm md:text-lg tracking-[0.2em] uppercase">
                        Exclusive Quantum Karma Logo Experience
                    </p>
                </div>

                <AnimatedLogo />

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
            </div>
        </div>
    );
}
