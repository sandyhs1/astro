'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { Briefcase, Heart, Activity, Coins } from "lucide-react";

const domains = [
  {
    id: "career",
    icon: Briefcase,
    title: "Career & Purpose",
    tagline: "Stop guessing. Start striking.",
    color: "hsl(245,60%,28%)",
    bg: "hsl(245 60% 28% / 0.1)",
    activeBg: "linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%))",
    points: [
      "Exactly when your boss is going to lay off the team",
      "When to ask for the raise without getting fired",
      "The industries where you actually won't burn out",
      "When to switch jobs vs. when to shut up and grind",
      "Your natural leadership style and why people hate working for you"
    ],
  },
  {
    id: "wealth",
    icon: Coins,
    title: "Wealth & Money",
    tagline: "Your money has a personality. Learn it.",
    color: "hsl(30,80%,55%)",
    bg: "hsl(30 80% 55% / 0.1)",
    activeBg: "linear-gradient(135deg,hsl(42,90%,55%),hsl(30,80%,55%))",
    points: [
      "Buying a house at the top of the market? Bad idea. We show the drop.",
      "The exact timelines when financial risks will backfire completely",
      "Passive income potential mapped specifically to your periods",
      "Your worst spending triggers and financial blind spots",
      "The exact months when you should double down and take risk"
    ],
  },
  {
    id: "love",
    icon: Heart,
    title: "Love & Relationships",
    tagline: "Compatibility isn't a checklist. It's chemistry.",
    color: "hsl(340,80%,60%)",
    bg: "hsl(340 80% 60% / 0.1)",
    activeBg: "linear-gradient(135deg,hsl(340,80%,60%),hsl(320,70%,50%))",
    points: [
      "Stop dating narcissists. We show your unconscious trauma patterns",
      "Periods where you are heavily prone to trauma-bonding",
      "When your actual compatibility window opens (so you can stop forcing it)",
      "When relationships are most likely to aggressively end",
      "Your actual deal-breakers vs your imaginary ones"
    ],
  },
  {
    id: "health",
    icon: Activity,
    title: "Health & Vitality",
    tagline: "Your body has seasons. Respect them.",
    color: "hsl(150,40%,45%)",
    bg: "hsl(150 40% 45% / 0.1)",
    activeBg: "linear-gradient(135deg,hsl(150,40%,45%),hsl(160,50%,35%))",
    points: [
      "Burnout doesn't happen overnight. It happens on a schedule.",
      "Know your exact high-stress periods before you end up in the ER",
      "Best periods for starting serious detoxes or fitness routines",
      "Mental health trigger periods you need to watch out for",
      "Energy cycles — when you're unstoppable vs. when you need to rest"
    ],
  },
];

export default function LifeDomainsSection() {
  const [active, setActive] = useState("career");
  const activeDomain = domains.find((d) => d.id === active)!;

  return (
    <section id="features" className="py-24 md:py-32" style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: 'hsl(245 60% 28% / 0.1)', color: 'hsl(245,60%,28%)' }}>
            FOUR PILLARS
          </span>
          <h2 className="text-4xl md:text-6xl font-bold" style={{ color: 'hsl(240,20%,8%)', fontFamily: "'Space Grotesk',sans-serif" }}>
            Real life problems.<br />
            <span style={{ background: 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Real timelines.</span>
          </h2>
        </AnimatedSection>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Tabs */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" style={{ scrollbarWidth: 'none' }}>
            {domains.map((domain) => (
              <motion.button
                key={domain.id}
                onClick={() => setActive(domain.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all duration-300 whitespace-nowrap"
                style={{
                  background: active === domain.id ? domain.activeBg : '#fff',
                  color: active === domain.id ? '#fff' : 'hsl(240,10%,46%)',
                  border: active === domain.id ? '1px solid transparent' : '1px solid hsl(40,15%,88%)',
                  boxShadow: active === domain.id ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <domain.icon className="w-5 h-5 shrink-0" color={active === domain.id ? '#fff' : 'hsl(240,10%,46%)'} />
                <span className="font-semibold" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{domain.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12 rounded-2xl border"
              style={{ background: '#FAFAF7', borderColor: 'hsl(40,15%,88%)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: activeDomain.bg }}>
                <activeDomain.icon className="w-4 h-4" style={{ color: activeDomain.color }} />
                <span className="text-sm font-semibold" style={{ color: activeDomain.color }}>{activeDomain.title}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'hsl(240,20%,8%)', fontFamily: "'Space Grotesk',sans-serif" }}>
                {activeDomain.tagline}
              </h3>
              <div className="space-y-3 mt-6">
                {activeDomain.points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-black/5"
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: 'hsl(240 20% 8% / 0.1)', color: 'hsl(240,20%,8%)' }}>
                      {i + 1}
                    </span>
                    <span style={{ color: 'hsl(240 20% 8% / 0.8)' }}>{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <style>{`
        /* Hide scrollbar for tabs */
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
