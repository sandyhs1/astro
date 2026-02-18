import Hero from "@/components/sections/Hero";
import ProblemRoast from "@/components/sections/ProblemRoast";
import TheMirror from "@/components/sections/TheMirror";
import USP from "@/components/sections/USP";
import TheStack from "@/components/sections/TheStack";
import Benefits from "@/components/sections/Benefits";
import MathVsMyth from "@/components/sections/MathVsMyth";
import ForSkeptics from "@/components/sections/ForSkeptics";
import Kamasutra from "@/components/sections/Kamasutra";
import DashaClock from "@/components/sections/DashaClock";
import AlgoSuffering from "@/components/sections/AlgoSuffering";
import InstantGratification from "@/components/sections/InstantGratification";
import FAQ from "@/components/sections/FAQ";
import ExclusiveEntry from "@/components/sections/ExclusiveEntry";
import TheVoid from "@/components/sections/TheVoid";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#12011A]">
      <Hero />
      <ProblemRoast />
      <TheMirror />
      <USP />
      <TheStack />
      <Benefits />
      <MathVsMyth />
      <ForSkeptics />
      <Kamasutra />
      <DashaClock />
      <AlgoSuffering />
      <InstantGratification />
      <FAQ />
      <ExclusiveEntry />
      <TheVoid />
    </main>
  );
}
