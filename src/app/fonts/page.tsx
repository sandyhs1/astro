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
            <style>{`@import url('https://fonts.googleapis.com/css2?family=${allFonts}&display=swap');`}</style>
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
        </>
    );
}
