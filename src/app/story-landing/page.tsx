import S01_Hero from "@/components/story-landing/S01_Hero";
import S02_TheNumbers from "@/components/story-landing/S02_TheNumbers";
import S03_FearFactory from "@/components/story-landing/S03_FearFactory";
import S04_GemstoneRacket from "@/components/story-landing/S04_GemstoneRacket";
import S05_RitualTrap from "@/components/story-landing/S05_RitualTrap";
import S06_RealVsFake from "@/components/story-landing/S06_RealVsFake";
import S07_Timeline from "@/components/story-landing/S07_Timeline";
import S08_TheScience from "@/components/story-landing/S08_TheScience";
import S09_CrisisManagement from "@/components/story-landing/S09_CrisisManagement";
import S10_TheProcess from "@/components/story-landing/S10_TheProcess";
import S11_WhatYouGet from "@/components/story-landing/S11_WhatYouGet";
import S12_TheMirror from "@/components/story-landing/S12_TheMirror";
import S13_Testimonials from "@/components/story-landing/S13_Testimonials";
import S14_TwoPaths from "@/components/story-landing/S14_TwoPaths";
import S15_FinalCTA from "@/components/story-landing/S15_FinalCTA";

export const metadata = {
  title: "Your Astrologer Is Lying | YNTRA",
  description: "₹40,000 crore industry built on fear. We expose the scam and deliver the real Vedic astrology — mathematical, precise, and zero fluff.",
};

export default function StoryLandingPage() {
  return (
    <main className="overflow-x-hidden bg-[#FAFAF7] selection:bg-[#B8860B]/20 selection:text-[#1a1a1a]">
      <S01_Hero />
      <S02_TheNumbers />
      <S03_FearFactory />
      <S04_GemstoneRacket />
      <S05_RitualTrap />
      <S06_RealVsFake />
      <S07_Timeline />
      <S08_TheScience />
      <S09_CrisisManagement />
      <S10_TheProcess />
      <S11_WhatYouGet />
      <S12_TheMirror />
      <S13_Testimonials />
      <S14_TwoPaths />
      <S15_FinalCTA />
    </main>
  );
}
