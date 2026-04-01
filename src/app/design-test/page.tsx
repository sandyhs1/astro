"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const TITLE = "Don't chase.";
const ACCENT = "Attract.";
const TAIL = "On command.";
const SUB = "The universe has favorites. Be one of them.";

const fontStyles = [
  {
    id: 1,
    name: "1. The Aristocrat",
    desc: "Cormorant Garamond — editorial luxury serif. Paper-thin strokes, maximum contrast.",
    title: (
      <h1 className="font-[family-name:var(--font-cormorant)] font-light text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-[-0.02em] text-white">
        <span className="block">{TITLE}</span>
        <span className="block italic text-[clamp(3.5rem,9vw,8.5rem)] bg-clip-text text-transparent bg-gradient-to-r from-[#C9A84C] via-[#F5E6A3] to-[#B8962E]">{ACCENT}</span>
        <span className="block font-extralight text-white/40 text-[clamp(1.8rem,4vw,4rem)] tracking-[0.08em] mt-2">{TAIL}</span>
      </h1>
    ),
    sub: "font-[family-name:var(--font-manrope)] font-light text-white/30 text-xs tracking-[0.4em] uppercase",
  },
  {
    id: 2,
    name: "2. The Sovereign",
    desc: "Cinzel — classical Roman inscriptions. All-caps majesty, commanding and stoic.",
    title: (
      <h1 className="font-[family-name:var(--font-cinzel)] font-medium text-[clamp(1.8rem,4.5vw,4.5rem)] leading-[1.2] tracking-[0.2em] uppercase text-white">
        <span className="block">{TITLE.toUpperCase()}</span>
        <span className="block font-bold text-[clamp(2.5rem,6vw,6rem)] text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#F5E6A3] tracking-[0.15em]">{ACCENT.toUpperCase()}</span>
        <span className="block font-light text-white/30 tracking-[0.5em] text-[clamp(0.9rem,2vw,1.8rem)] mt-3">{TAIL.toUpperCase()}</span>
      </h1>
    ),
    sub: "font-[family-name:var(--font-cinzel)] text-white/20 text-[0.65rem] tracking-[0.5em] uppercase",
  },
  {
    id: 3,
    name: "3. The Ghost",
    desc: "Bodoni Moda — high-fashion, razor contrast. Haunting and sensual.",
    title: (
      <h1 className="font-[family-name:var(--font-bodoni)] font-light text-[clamp(3rem,8vw,7.5rem)] leading-[1.0] tracking-[-0.03em] text-white">
        <span className="block">{TITLE}</span>
        <span className="block italic font-bold text-[clamp(3.5rem,9vw,9rem)] text-transparent bg-clip-text bg-gradient-to-br from-white via-[#F5E6A3] to-[#C9A84C]">{ACCENT}</span>
        <span className="block font-light text-white/25 text-[clamp(1.5rem,3.5vw,3rem)] tracking-[0.05em] mt-2">{TAIL}</span>
      </h1>
    ),
    sub: "font-[family-name:var(--font-bodoni)] italic text-white/25 text-sm tracking-wider",
  },
  {
    id: 4,
    name: "4. The Architect",
    desc: "Unbounded — geometric neo-grotesque. Bold, systematic, unapologetic power.",
    title: (
      <h1 className="font-[family-name:var(--font-unbounded)] font-black text-[clamp(1.6rem,4vw,4.2rem)] leading-[1.05] tracking-[-0.03em] text-white">
        <span className="block">{TITLE}</span>
        <span className="block text-[clamp(2rem,5.5vw,5.5rem)] bg-clip-text text-transparent bg-gradient-to-r from-[#C9A84C] via-[#fff8d6] to-[#C9A84C]">{ACCENT}</span>
        <span className="block font-light text-white/20 text-[clamp(0.9rem,1.8vw,1.6rem)] tracking-[0.2em] mt-3">{TAIL}</span>
      </h1>
    ),
    sub: "font-[family-name:var(--font-unbounded)] text-white/20 text-[0.55rem] tracking-[0.4em] uppercase",
  },
  {
    id: 5,
    name: "5. The Auteur",
    desc: "Syne — experimental editorial grotesque. Irregular tension, designer taste.",
    title: (
      <h1 className="font-[family-name:var(--font-syne)] font-extrabold text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] tracking-[-0.04em] text-white">
        <span className="block text-white/70 font-light text-[clamp(1.5rem,4vw,3.5rem)] tracking-[0.0em] mb-1">{TITLE}</span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8D6] to-[#D4AF37]">{ACCENT}</span>
        <span className="block font-light text-white/20 text-[clamp(1.2rem,2.5vw,2.2rem)] tracking-[0.15em] mt-4">{TAIL}</span>
      </h1>
    ),
    sub: "font-[family-name:var(--font-syne)] text-white/25 text-xs tracking-[0.3em] uppercase",
  },
  {
    id: 6,
    name: "6. The Whisper",
    desc: "Italiana — ultra-thin romantic serif. Barely there, but impossible to ignore.",
    title: (
      <h1 className="font-[family-name:var(--font-italiana)] text-[clamp(3.5rem,9vw,9.5rem)] leading-[0.95] tracking-[-0.01em] text-white">
        <span className="block text-white/60">{TITLE}</span>
        <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#FDEAA8] to-[#C9A84C]">{ACCENT}</span>
        <span className="block text-white/20 text-[clamp(2rem,5vw,5rem)] mt-2">{TAIL}</span>
      </h1>
    ),
    sub: "font-[family-name:var(--font-italiana)] text-white/20 text-base tracking-[0.1em]",
  },
  {
    id: 7,
    name: "7. The Blade",
    desc: "Bricolage Grotesque — dark web editorial. Weighted contrast, cyber-luxury.",
    title: (
      <h1 className="font-[family-name:var(--font-bricolage)] font-light text-[clamp(2.5rem,6.5vw,7rem)] leading-[1.0] tracking-[-0.03em] text-white">
        <span className="block text-white/50">{TITLE}</span>
        <span className="block font-extrabold text-[clamp(3rem,8vw,8.5rem)] leading-[0.9] bg-clip-text text-transparent bg-gradient-to-r from-white via-[#F5E6A3] to-[#C9A84C]">{ACCENT}</span>
        <span className="block font-thin text-white/20 text-[clamp(1.2rem,2.5vw,2.5rem)] tracking-[0.12em] mt-3">{TAIL}</span>
      </h1>
    ),
    sub: "font-[family-name:var(--font-bricolage)] text-white/20 text-xs tracking-[0.3em] uppercase font-light",
  },
  {
    id: 8,
    name: "8. The Oracle",
    desc: "Playfair Display + Space Grotesk — classical serif meets precision sans. Dual tension.",
    title: (
      <h1 className="leading-[1.05]">
        <span className="block font-[family-name:var(--font-serif)] font-normal text-[clamp(2.5rem,7vw,7rem)] tracking-[-0.02em] text-white/60">{TITLE}</span>
        <span className="block font-[family-name:var(--font-serif)] font-bold italic text-[clamp(3rem,8.5vw,9rem)] text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8D6] to-[#B8962E] tracking-[-0.03em]">{ACCENT}</span>
        <span className="block font-[family-name:var(--font-space)] font-light text-white/20 text-[clamp(0.9rem,2vw,1.8rem)] tracking-[0.4em] uppercase mt-3">{TAIL}</span>
      </h1>
    ),
    sub: "font-[family-name:var(--font-space)] text-white/20 text-[0.65rem] tracking-[0.5em] uppercase",
  },
  {
    id: 9,
    name: "9. The Minimalist",
    desc: "Outfit — ultra-clean geometric sans. Less is everything. Silicon Valley luxury.",
    title: (
      <h1 className="font-[family-name:var(--font-outfit)]">
        <span className="block font-thin text-[clamp(3rem,8vw,8rem)] leading-[0.95] tracking-[-0.04em] text-white/40">{TITLE}</span>
        <span className="block font-semibold text-[clamp(3.5rem,9.5vw,10rem)] leading-[0.88] tracking-[-0.05em] bg-clip-text text-transparent bg-gradient-to-r from-[#C9A84C] to-[#F5E6A3]">{ACCENT}</span>
        <span className="block font-thin text-white/20 text-[clamp(1.5rem,3.5vw,3.5rem)] tracking-[0.0em] mt-2">{TAIL}</span>
      </h1>
    ),
    sub: "font-[family-name:var(--font-outfit)] text-white/20 text-xs tracking-[0.3em] uppercase font-light",
  },
  {
    id: 10,
    name: "10. The Clash",
    desc: "Afacad + Cormorant mix — elegant grotesque meets luxury serif. Unexpected sophistication.",
    title: (
      <h1 className="leading-[1.05]">
        <span className="block font-[family-name:var(--font-afacad)] font-light text-[clamp(2rem,5.5vw,5.5rem)] tracking-[0.18em] uppercase text-white/30">{TITLE.toUpperCase()}</span>
        <span className="block font-[family-name:var(--font-cormorant)] italic font-bold text-[clamp(4rem,11vw,11rem)] leading-[0.88] tracking-[-0.02em] text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] via-[#FDEAA8] to-[#B8962E]">{ACCENT}</span>
        <span className="block font-[family-name:var(--font-afacad)] font-light text-white/20 text-[clamp(1rem,2.2vw,2rem)] tracking-[0.35em] uppercase mt-3">{TAIL.toUpperCase()}</span>
      </h1>
    ),
    sub: "font-[family-name:var(--font-afacad)] text-white/20 text-xs tracking-[0.4em] uppercase",
  },
];

export default function DesignTestPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <main className="w-full bg-black text-white">
      {/* Sticky top nav */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <span className="font-[family-name:var(--font-space)] text-[10px] tracking-[0.5em] uppercase text-white/30">
          Font Typography Selection
        </span>
        {selected && (
          <span className="font-[family-name:var(--font-space)] text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]">
            Selected: {fontStyles.find(f => f.id === selected)?.name}
          </span>
        )}
      </div>

      {fontStyles.map((style) => {
        const isSelected = selected === style.id;
        return (
          <section
            key={style.id}
            onClick={() => setSelected(style.id)}
            className={`relative min-h-screen flex flex-col items-center justify-center px-8 cursor-pointer transition-all duration-500 border-b border-white/5
              ${isSelected ? "bg-[#0a0800]" : "bg-black hover:bg-[#050505]"}`}
          >
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-6 right-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="font-[family-name:var(--font-space)] text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]">Selected</span>
              </div>
            )}

            {/* ID Number */}
            <p className="font-[family-name:var(--font-space)] text-[0.55rem] tracking-[0.5em] uppercase text-white/10 mb-8">
              — Style {String(style.id).padStart(2, "0")} —
            </p>

            {/* Title showcase */}
            <div className="max-w-5xl w-full text-center">
              {style.title}

              <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-auto my-10" />

              <p className={`${style.sub} leading-loose`}>
                {SUB}
              </p>
            </div>

            {/* Name + Description */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="mt-16 text-center"
            >
              <p className="font-[family-name:var(--font-space)] text-white/60 text-sm tracking-wider mb-2">
                {style.name}
              </p>
              <p className="font-[family-name:var(--font-manrope)] text-white/20 text-xs max-w-md mx-auto leading-relaxed">
                {style.desc}
              </p>
            </motion.div>

            {/* Click hint */}
            {!isSelected && (
              <p className="absolute bottom-6 font-[family-name:var(--font-space)] text-white/10 text-[0.55rem] tracking-[0.4em] uppercase">
                Click to select
              </p>
            )}
          </section>
        );
      })}

      {/* Footer: shortlist summary */}
      <div className="py-20 px-8 text-center border-t border-white/5 bg-black">
        <p className="font-[family-name:var(--font-space)] text-white/20 text-xs tracking-[0.4em] uppercase mb-4">Your Selection</p>
        {selected ? (
          <p className="font-[family-name:var(--font-cormorant)] text-3xl text-white/60 italic">
            {fontStyles.find(f => f.id === selected)?.name}
          </p>
        ) : (
          <p className="font-[family-name:var(--font-manrope)] text-white/15 text-sm">
            Click a style above to select it
          </p>
        )}
      </div>
    </main>
  );
}
