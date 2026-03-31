"use client";

import { HeroVar1 } from "@/components/design-test/HeroVar1";
import { HeroVar2 } from "@/components/design-test/HeroVar2";
import { HeroVar3 } from "@/components/design-test/HeroVar3";
import { HeroVar4 } from "@/components/design-test/HeroVar4";
import { HeroVar5 } from "@/components/design-test/HeroVar5";

export default function DesignTestPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      {/* Variation labels — fixed nav */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#FFD700]/40 uppercase">
          QuantumKarma · Hero Variations
        </span>
        <div className="flex items-center gap-4">
          {["01", "02", "03", "04", "05"].map((num) => (
            <a
              key={num}
              href={`#var${num}`}
              className="font-mono text-[10px] tracking-[0.2em] text-white/20 hover:text-[#FFD700]/60 transition-colors uppercase"
            >
              {num}
            </a>
          ))}
        </div>
      </nav>

      <div id="var01"><HeroVar1 /></div>

      {/* Separator */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/15 to-transparent" />

      <div id="var02"><HeroVar2 /></div>

      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/15 to-transparent" />

      <div id="var03"><HeroVar3 /></div>

      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/15 to-transparent" />

      <div id="var04"><HeroVar4 /></div>

      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/15 to-transparent" />

      <div id="var05"><HeroVar5 /></div>
    </main>
  );
}
