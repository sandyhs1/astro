export default function FontsPage() {
    const all12 = [
        // Round 1
        {
            num: 1, label: "Classic Luxe", vibe: "Playfair Display Bold + Inter Light",
            titleFamily: "'Playfair Display', serif", subtextFamily: "'Inter', sans-serif",
            titleSize: "clamp(2.2rem, 5vw, 3.5rem)", subtextSize: "1rem", subtextWeight: 300,
            accent: "#FFD700", bg: "#0e000f", titleCase: "none",
            googleFonts: "Playfair+Display:wght@700&family=Inter:wght@300",
        },
        {
            num: 2, label: "Editorial", vibe: "Cormorant Garamond Italic + Lato Light",
            titleFamily: "'Cormorant Garamond', serif", subtextFamily: "'Lato', sans-serif",
            titleSize: "clamp(2.5rem, 6vw, 4rem)", subtextSize: "1rem", subtextWeight: 300,
            accent: "#C9A84C", bg: "#0c000e", titleCase: "none",
            googleFonts: "Cormorant+Garamond:ital,wght@1,700&family=Lato:wght@300",
        },
        {
            num: 3, label: "Regal / Ancient", vibe: "Cinzel Bold + Raleway Light",
            titleFamily: "'Cinzel', serif", subtextFamily: "'Raleway', sans-serif",
            titleSize: "clamp(1.8rem, 4vw, 3rem)", subtextSize: "0.8rem", subtextWeight: 300,
            accent: "#E5C97E", bg: "#0a0008", titleCase: "uppercase",
            googleFonts: "Cinzel:wght@700&family=Raleway:wght@300",
        },
        {
            num: 4, label: "Timeless", vibe: "EB Garamond Bold + DM Sans Regular",
            titleFamily: "'EB Garamond', serif", subtextFamily: "'DM Sans', sans-serif",
            titleSize: "clamp(2.2rem, 5vw, 3.5rem)", subtextSize: "1rem", subtextWeight: 400,
            accent: "#FFD700", bg: "#0e000f", titleCase: "none",
            googleFonts: "EB+Garamond:wght@700&family=DM+Sans:wght@400",
        },
        {
            num: 5, label: "Warm Luxe", vibe: "Libre Baskerville Bold + Nunito Light",
            titleFamily: "'Libre Baskerville', serif", subtextFamily: "'Nunito', sans-serif",
            titleSize: "clamp(2rem, 4.5vw, 3.2rem)", subtextSize: "1rem", subtextWeight: 300,
            accent: "#F5C842", bg: "#0c0005", titleCase: "none",
            googleFonts: "Libre+Baskerville:wght@700&family=Nunito:wght@300",
        },
        {
            num: 6, label: "High Fashion", vibe: "Bodoni Moda Bold + Jost Light",
            titleFamily: "'Bodoni Moda', serif", subtextFamily: "'Jost', sans-serif",
            titleSize: "clamp(2.2rem, 5vw, 3.5rem)", subtextSize: "1rem", subtextWeight: 300,
            accent: "#D4AF37", bg: "#0a0008", titleCase: "none",
            googleFonts: "Bodoni+Moda:wght@700&family=Jost:wght@300",
        },
        // Round 2
        {
            num: 7, label: "Sleek Tech-Luxe ✦ SELECTED", vibe: "Space Grotesk Bold + Outfit Light",
            titleFamily: "'Space Grotesk', sans-serif", subtextFamily: "'Outfit', sans-serif",
            titleSize: "clamp(2.2rem, 5vw, 3.5rem)", subtextSize: "1rem", subtextWeight: 300,
            accent: "#FFD700", bg: "#0e000f", titleCase: "none",
            googleFonts: "Space+Grotesk:wght@700&family=Outfit:wght@300",
        },
        {
            num: 8, label: "Contemporary Editorial", vibe: "Syne ExtraBold + DM Sans Light",
            titleFamily: "'Syne', sans-serif", subtextFamily: "'DM Sans', sans-serif",
            titleSize: "clamp(2.2rem, 5vw, 3.5rem)", subtextSize: "0.8rem", subtextWeight: 300,
            accent: "#C084FC", bg: "#0c000e", titleCase: "uppercase",
            googleFonts: "Syne:wght@800&family=DM+Sans:wght@300",
        },
        {
            num: 9, label: "Warm High-Fashion", vibe: "Fraunces Bold Italic + Plus Jakarta Sans Light",
            titleFamily: "'Fraunces', serif", subtextFamily: "'Plus Jakarta Sans', sans-serif",
            titleSize: "clamp(2.5rem, 6vw, 4rem)", subtextSize: "1rem", subtextWeight: 300,
            accent: "#FB923C", bg: "#120008", titleCase: "none",
            googleFonts: "Fraunces:ital,wght@1,700&family=Plus+Jakarta+Sans:wght@300",
        },
        {
            num: 10, label: "Impact / Streetwear Luxe", vibe: "Big Shoulders Display Bold + Barlow Light",
            titleFamily: "'Big Shoulders Display', display", subtextFamily: "'Barlow', sans-serif",
            titleSize: "clamp(2.8rem, 7vw, 4.5rem)", subtextSize: "1rem", subtextWeight: 300,
            accent: "#F43F5E", bg: "#0e0005", titleCase: "uppercase",
            googleFonts: "Big+Shoulders+Display:wght@700&family=Barlow:wght@300",
        },
        {
            num: 11, label: "Dramatic Display", vibe: "Abril Fatface + Nunito Sans Light",
            titleFamily: "'Abril Fatface', display", subtextFamily: "'Nunito Sans', sans-serif",
            titleSize: "clamp(2.5rem, 6vw, 4rem)", subtextSize: "1rem", subtextWeight: 300,
            accent: "#34D399", bg: "#00100a", titleCase: "none",
            googleFonts: "Abril+Fatface&family=Nunito+Sans:wght@300",
        },
        {
            num: 12, label: "Futuristic / Premium", vibe: "Unbounded Bold + Manrope Light",
            titleFamily: "'Unbounded', sans-serif", subtextFamily: "'Manrope', sans-serif",
            titleSize: "clamp(1.8rem, 4vw, 2.8rem)", subtextSize: "0.9rem", subtextWeight: 300,
            accent: "#38BDF8", bg: "#00080f", titleCase: "none",
            googleFonts: "Unbounded:wght@700&family=Manrope:wght@300",
        },
    ];

    const allFonts = all12.map(v => v.googleFonts).join("&family=");

    return (
        <>
            <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${allFonts}&display=swap`} />
            <div style={{ minHeight: "100vh", background: "#08000d", padding: "4rem 1.5rem" }}>
                <div style={{ maxWidth: "860px", margin: "0 auto" }}>
                    <p style={{ fontFamily: "monospace", color: "#FFD700", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                        Font Preview — All 12 Options
                    </p>
                    <h1 style={{ fontFamily: "serif", color: "white", fontSize: "1.8rem", marginBottom: "0.5rem" }}>
                        Hero Style Variations
                    </h1>
                    <p style={{ fontFamily: "monospace", color: "#6b7280", fontSize: "0.85rem", marginBottom: "4rem" }}>
                        Scroll and compare all options. Option 7 is currently applied to the Hero.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                        {all12.map((v) => (
                            <div
                                key={v.num}
                                style={{
                                    position: "relative",
                                    background: v.bg,
                                    border: v.num === 7 ? `1px solid ${v.accent}` : "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "1rem",
                                    padding: "2.5rem",
                                    overflow: "hidden",
                                    boxShadow: v.num === 7 ? `0 0 30px ${v.accent}22` : "none",
                                }}
                            >
                                {/* Number badge */}
                                <div style={{
                                    position: "absolute", top: "1.5rem", right: "1.5rem",
                                    width: "2.2rem", height: "2.2rem", borderRadius: "50%",
                                    background: v.accent, display: "flex", alignItems: "center",
                                    justifyContent: "center", fontFamily: "monospace",
                                    fontSize: "0.85rem", fontWeight: 700, color: "#000"
                                }}>
                                    {v.num}
                                </div>

                                {/* Labels */}
                                <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                                    <span style={{ fontFamily: "monospace", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.2em", color: v.accent, fontWeight: 700 }}>
                                        {v.label}
                                    </span>
                                    <span style={{ color: "#555" }}>·</span>
                                    <span style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#555" }}>{v.vibe}</span>
                                </div>

                                <div style={{ width: "3rem", height: "2px", background: v.accent, marginBottom: "1.5rem" }} />

                                {/* Title */}
                                <h2 style={{
                                    fontFamily: v.titleFamily, fontSize: v.titleSize,
                                    fontWeight: 700, color: "white", lineHeight: 1.15,
                                    textTransform: v.titleCase as "uppercase" | "none",
                                    marginBottom: "1.25rem", maxWidth: "600px",
                                }}>
                                    Don&apos;t chase.{" "}
                                    <span style={{ color: v.accent }}>Attract.</span>{" "}
                                    On command.
                                </h2>

                                {/* Subtext */}
                                <p style={{
                                    fontFamily: v.subtextFamily, fontSize: v.subtextSize,
                                    fontWeight: v.subtextWeight, color: "#9ca3af",
                                    lineHeight: 1.75, maxWidth: "520px",
                                }}>
                                    The universe has favorites. Be one of them.{" "}
                                    <span style={{ color: "rgba(255,255,255,0.65)", borderBottom: `1px solid ${v.accent}` }}>
                                        We map your personal &apos;God Mode&apos; cycles so you never waste energy on a bad day again.
                                    </span>
                                </p>

                                <div style={{ marginTop: "2rem", height: "1px", background: "rgba(255,255,255,0.05)" }} />
                            </div>
                        ))}
                    </div>

                    <p style={{ fontFamily: "monospace", color: "#374151", fontSize: "0.7rem", textAlign: "center", marginTop: "4rem" }}>
                        Reply with the number (#1–12) and we&apos;ll apply it to the Hero section immediately.
                    </p>
                </div>
            </div>

            {/* NEW EXPLORATORY HERO DESIGNS */}
            <div className="w-full flex flex-col bg-black">
                {/* HERO 1: NEON MONOLITH */}
                <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black border-t-[12px] border-fuchsia-600">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.1),transparent_60%)] pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-900/20 blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="z-10 text-center px-6 max-w-5xl">
                        <span className="text-fuchsia-500 font-mono text-sm tracking-[0.4em] uppercase mb-6 block font-bold">Design 01 // Neon Monolith</span>
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Don&apos;t chase. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-600">Attract.</span> On command.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            The universe has favorites. Be one of them. <br />
                            <span className="text-white border-b border-fuchsia-500/50 pb-1 inline-block mt-2">We map your personal &apos;God Mode&apos; cycles so you never waste energy on a bad day again.</span>
                        </p>
                        <button className="px-10 py-5 bg-fuchsia-600 text-white font-mono uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(192,132,252,0.6)]">
                            See My Decision Map
                        </button>
                    </div>
                </div>

                {/* HERO 2: LIQUID GOLD MATRIX */}
                <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505] border-t-[12px] border-[#D4AF37]">
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#D4AF37_1px,transparent_1px),linear-gradient(to_bottom,#D4AF37_1px,transparent_1px)] bg-[size:48px_48px]"></div>

                    <div className="z-10 text-center px-6 max-w-5xl">
                        <span className="text-[#D4AF37] font-mono text-xs tracking-[0.5em] uppercase mb-8 block font-bold">Design 02 // Liquid Gold Matrix</span>
                        <h1 className="text-6xl md:text-[7rem] font-black text-white tracking-tight mb-8 leading-[0.85]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Don&apos;t chase.<br />
                            <span className="text-[#D4AF37] italic font-normal">Attract.</span> On command.
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-500 mb-14 max-w-3xl mx-auto font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                            The universe has favorites. Be one of them. <br />
                            <span className="text-gray-200 mt-2 inline-block">We map your personal &apos;God Mode&apos; cycles so you never waste energy on a bad day again.</span>
                        </p>
                        <button className="px-12 py-5 border items-center justify-center border-[#D4AF37] text-[#D4AF37] font-serif uppercase tracking-[0.3em] text-sm hover:bg-[#D4AF37] hover:text-black transition-all duration-500">
                            See My Decision Map
                        </button>
                    </div>
                </div>

                {/* HERO 3: QUANTUM VOID */}
                <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#020617] border-t-[12px] border-cyan-500">
                    <div className="absolute right-[-10%] top-[-10%] w-[60vh] h-[60vh] bg-blue-600/30 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
                    <div className="absolute left-[-10%] bottom-[-10%] w-[60vh] h-[60vh] bg-cyan-400/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

                    <div className="z-10 text-left px-6 md:px-16 max-w-7xl w-full">
                        <span className="text-cyan-400 font-mono text-sm tracking-[0.4em] uppercase mb-6 block font-bold">Design 03 // Quantum Void</span>
                        <h1 className="text-5xl md:text-[6rem] font-extrabold text-white mb-8 uppercase leading-[0.9] tracking-tighter" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                            Don&apos;t chase. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Attract.</span> <br /> On command.
                        </h1>
                        <div className="h-[2px] w-32 bg-cyan-500 mb-10"></div>
                        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed font-light tracking-wide" style={{ fontFamily: "'Manrope', sans-serif" }}>
                            The universe has favorites. Be one of them. <br />
                            <span className="text-slate-200 bg-white/5 border border-white/10 px-3 py-1 mt-4 inline-block rounded md:whitespace-nowrap">We map your personal &apos;God Mode&apos; cycles so you never waste energy on a bad day again.</span>
                        </p>
                        <button className="px-10 py-5 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 font-mono uppercase tracking-[0.3em] text-xs hover:bg-cyan-500 hover:text-black transition-all backdrop-blur-md">
                            [ See My Decision Map ]
                        </button>
                    </div>
                </div>

                {/* HERO 4: BLOOD MOON */}
                <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0A0000] border-t-[12px] border-red-600">
                    <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-red-900/10 blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

                    <div className="z-10 text-center px-6 max-w-5xl">
                        <span className="text-red-500 font-mono text-sm tracking-[0.6em] uppercase mb-10 block font-bold">Design 04 // Blood Moon</span>
                        <h1 className="text-6xl md:text-[9rem] font-black text-white uppercase leading-[0.8] tracking-tighter mb-8" style={{ fontFamily: "'Big Shoulders Display', display" }}>
                            Don&apos;t chase. <br />
                            <span className="text-red-600 mix-blend-screen drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">Attract.</span> <br /> On command.
                        </h1>
                        <p className="text-lg md:text-xl text-red-200/60 mb-14 max-w-2xl mx-auto uppercase tracking-[0.2em] leading-relaxed font-medium" style={{ fontFamily: "'Barlow', sans-serif" }}>
                            The universe has favorites.<br /> Be one of them. <br />
                            <span className="text-white border-b-2 border-red-600/50 mt-4 inline-block pb-1">We map your personal &apos;God Mode&apos; cycles so you never waste energy on a bad day again.</span>
                        </p>
                        <button className="px-14 py-6 bg-red-600 text-white font-black text-sm uppercase tracking-[0.4em] hover:bg-white hover:text-red-600 transition-colors shadow-2xl">
                            See My Decision Map
                        </button>
                    </div>
                </div>

                {/* HERO 5: ETHEREAL GLASS */}
                <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black border-t-[12px] border-emerald-400">
                    <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="z-10 text-center px-8 md:px-16 py-20 max-w-5xl border border-white/10 bg-black/40 backdrop-blur-3xl rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,1)]">
                        <span className="text-emerald-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-8 block">Design 05 // Ethereal Glass</span>
                        <h1 className="text-5xl md:text-7xl font-normal text-white mb-8 leading-tight tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            Don&apos;t chase. <br />
                            <span className="text-emerald-400 italic">Attract.</span> On command.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
                            The universe has favorites. Be one of them. <br />
                            <span className="text-white block mt-2">We map your personal &apos;God Mode&apos; cycles so you never waste energy on a bad day again.</span>
                        </p>
                        <button className="px-10 py-5 rounded-full bg-white text-black font-semibold uppercase tracking-widest text-xs hover:bg-emerald-400 hover:text-black transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
                            See My Decision Map
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
