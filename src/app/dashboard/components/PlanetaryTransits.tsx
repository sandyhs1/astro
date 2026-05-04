"use client";
import { useState, useEffect } from "react";
import { SectionHeader } from "./PanchangUtils";

interface TransitPlanet { planet: string; sign: string; degree: number; isRetrograde: boolean; }
interface TransitsData { transits: TransitPlanet[]; ascendantSign: string; moonSign: string; timestamp: string; location: string; }

const ZODIAC_SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

const PLANET_META: Record<string, { emoji: string; color: string; bg: string; border: string }> = {
  Sun:     { emoji:"☀️",  color:"#F59E0B", bg:"#FFFBEB", border:"#FDE68A" },
  Moon:    { emoji:"🌙",  color:"#8B5CF6", bg:"#F5F3FF", border:"#C4B5FD" },
  Mars:    { emoji:"♂️",  color:"#EF4444", bg:"#FEF2F2", border:"#FCA5A5" },
  Mercury: { emoji:"☿️",  color:"#10B981", bg:"#ECFDF5", border:"#6EE7B7" },
  Jupiter: { emoji:"♃",   color:"#2563EB", bg:"#EFF6FF", border:"#93C5FD" },
  Venus:   { emoji:"♀️",  color:"#EC4899", bg:"#FDF2F8", border:"#F9A8D4" },
  Saturn:  { emoji:"♄",   color:"#6B7280", bg:"#F9FAFB", border:"#D1D5DB" },
  Rahu:    { emoji:"🐉",  color:"#7C3AED", bg:"#F5F3FF", border:"#A78BFA" },
  Ketu:    { emoji:"☄️",  color:"#D97706", bg:"#FFFBEB", border:"#FCD34D" },
};

// Planet-specific impact per house
const PLANET_HOUSE_MEANINGS: Record<string, Record<number, string>> = {
  Sun: {
    1:"Boosts your confidence, health, and visibility. A powerful time for personal branding and leadership.",
    2:"Strengthens your wealth building drive. Focus on family finances and speech.",
    3:"Fuels your courage, communication, and short travels. Ideal for bold moves.",
    4:"Brings focus on home, mother, and inner peace. Can create tension at home.",
    5:"Ignites creativity, romance, and children matters. A bright period for intellect.",
    6:"Powerful for defeating enemies and overcoming illness. Your willpower is at its peak.",
    7:"Shines light on partnerships and marriage. Public image improves significantly.",
    8:"Triggers transformation. Hidden matters surface. Health scrutiny advised.",
    9:"Exceptional for spirituality, travel, and higher learning. Blessings flow.",
    10:"Career peak. Promotions, recognition, and authority. Your best professional window.",
    11:"Significant income boost. Desires get fulfilled. Strong social connections.",
    12:"A spiritually reflective phase. Foreign connections and inner work are highlighted.",
  },
  Moon: {
    1:"Your emotions are highly visible. You feel things intensely — nurture your mental health.",
    2:"Focus on family harmony and financial security. Emotions tied to wealth.",
    3:"Restless energy. Urge to communicate and travel. Guard against overthinking.",
    4:"Deeply nourishing for home life and connecting with your mother.",
    5:"Heightened intuition, creativity, and romantic feelings. Trust your gut.",
    6:"Emotional sensitivity in your work environment. Health routines matter.",
    7:"Strong emotional need for relationships. Partnerships feel deeply important.",
    8:"Emotional intensity and depth. Healing work is powerful right now.",
    9:"Spiritual seeking and philosophical moods. Excellent for meditation and travel.",
    10:"Public recognition of your emotional intelligence. Career in caregiving shines.",
    11:"Social and emotional fulfillment. Community support is strong.",
    12:"Introspective and dreamy. Spiritual retreats and rest are healing.",
  },
  Mars: {
    1:"Raw energy surge. Drive is high, but so is temper. Channel into physical action.",
    2:"Aggressive pursuit of wealth. Risk of family conflicts over money.",
    3:"Bold, courageous communication. Ideal for taking initiative and fighting for goals.",
    4:"Tension at home. Property matters may arise. Mother's health needs attention.",
    5:"Competitive in love and creative pursuits. Passion is intense.",
    6:"Excellent for defeating opponents, health recovery, and disciplined work.",
    7:"Conflict in partnerships possible. Passion in relationships is high — both ways.",
    8:"Deep transformation. Investigations, surgery, or sudden changes may occur.",
    9:"Bold in beliefs. May challenge authority or religious structures.",
    10:"Career acceleration. Ambition peaks. Excellent for engineering, military, sports.",
    11:"Strong gains through bold action. Network and social influence grow.",
    12:"Hidden battles. Foreign land activities. Spiritual fighting and detachment.",
  },
  Mercury: {
    1:"Sharp intellect and communication. A great time for negotiations and writing.",
    2:"Financial wit is sharp. Use your words to earn. Family discussions go well.",
    3:"Peak communication phase. Writing, speaking, and learning thrive.",
    4:"Mental focus on home and family. Real estate discussions likely.",
    5:"Creative and intellectual pursuits shine. Good for exams, teaching, and romance.",
    6:"Analytical problem solving. Excellent for service, healing, and detailed work.",
    7:"Smart negotiations in business and partnerships. Contracts may be signed.",
    8:"Research, occult, and deep investigative thinking is heightened.",
    9:"Philosophical writing and publishing. Teaching and travel are highlighted.",
    10:"Career through communication excels — media, tech, commerce, and management.",
    11:"Strategic social networking. Income through clever communication.",
    12:"Introspective thinking. Ideal for research, journaling, and spiritual study.",
  },
  Jupiter: {
    1:"A rare blessing. Your wisdom, health, and personal magnetism expand.",
    2:"Wealth and family blessings flow. Excellent for financial expansion.",
    3:"Optimism in communication. Travel and skill building are favored.",
    4:"Deep peace at home. Property gains and maternal blessings.",
    5:"Children, creativity, and spirituality blossom. Intellectual brilliance.",
    6:"Healing and overcoming debts. Service brings expansion and virtue.",
    7:"A golden phase for marriage and business partnerships. Harmony prevails.",
    8:"Spiritual transformation. Unexpected gains through inheritance or research.",
    9:"One of the most auspicious transits possible. Dharma, luck, and wisdom peak.",
    10:"Professional peak. Leadership, name, and fame through integrity.",
    11:"Massive income gains, social elevation, and fulfillment of long-held desires.",
    12:"Spiritual liberation and generous giving. Foreign settlement possible.",
  },
  Venus: {
    1:"You radiate beauty and charm. Attraction, romance, and sensory pleasures abound.",
    2:"Luxury, family harmony, and financial flow increase. A prosperous phase.",
    3:"Creative expression flows. Romantic short trips and artistic communication.",
    4:"Home becomes a haven of beauty and comfort. Family relationships flourish.",
    5:"Peak romantic period. Creative brilliance and children-related joy.",
    6:"Beauty in service. Love of work. Health through aesthetics and pleasure.",
    7:"Exceptional for relationships, marriage, and business. Love flourishes.",
    8:"Deep intimacy, shared resources, and sensual transformation.",
    9:"Love of philosophy, spiritual beauty, and travel. Romantic journeys.",
    10:"Career in arts, beauty, fashion, or entertainment peaks. Public charm.",
    11:"Social magnetism and income through beauty-related ventures.",
    12:"Spiritual love and sensory retreat. Foreign romantic connections possible.",
  },
  Saturn: {
    1:"A defining karmic test. Discipline your body, health, and identity. Slow but transformative.",
    2:"Financial restrictions teach you to save and value true wealth. Family karma surfaces.",
    3:"Delays in communication and travel. Builds patience and disciplined learning.",
    4:"Karmic work on home, peace, and mother relationship. Inner restructuring.",
    5:"Challenges in romance and creative pursuits. Seriousness in parenting.",
    6:"Strong for defeating enemies through sheer endurance. Health discipline required.",
    7:"Relationship karma. Commitments are tested. Marriage requires conscious effort.",
    8:"Deep transformation through loss and regeneration. Occult and research favored.",
    9:"Tests of faith and spiritual discipline. Pilgrimage and earnest study pay off.",
    10:"Karma with career and authority. Hard work now builds a lasting legacy.",
    11:"Delayed but permanent income gains. Steady network building pays off long-term.",
    12:"Karmic completion and spiritual surrender. Isolation leads to deep inner wisdom.",
  },
  Rahu: {
    1:"An obsessive push for identity reinvention. Desire for fame and uniqueness surges.",
    2:"Foreign or unconventional money flows. Speech becomes persuasive and unusual.",
    3:"Bold, unorthodox communication. Media, technology, and courage are themes.",
    4:"Unsettled home environment. Desire for foreign real estate or unusual living.",
    5:"Unconventional creativity and romance. Obsession with children or speculation.",
    6:"Powerful for overcoming hidden enemies through cunning and strategy.",
    7:"Foreign or unusual partnerships. Desire for exotic relationships intensifies.",
    8:"Deep obsession with the occult, hidden wealth, and transformation.",
    9:"Unconventional spirituality. Foreign travel and philosophy are major themes.",
    10:"Ambitious career leaps. Fame through unconventional or foreign work.",
    11:"Massive desires for income and social elevation. Technology-driven gains.",
    12:"Foreign land, hidden spirituality, and unusual subconscious experiences.",
  },
  Ketu: {
    1:"Detachment from physical identity. A deeply spiritual, introspective phase.",
    2:"Detachment from wealth and family. Past-life financial karma surfaces.",
    3:"Withdrawal from communication. Introspection and inner courage emerge.",
    4:"Emotional detachment from home and family. Past-life home karma.",
    5:"Detachment from ego and creativity. Spiritual intelligence awakens.",
    6:"Mysterious health issues may arise. Spiritual approach to healing works.",
    7:"Detachment in relationships. Spiritual partnership or past-life soul contracts.",
    8:"Deep occult insight and detachment from the material world. Profound shifts.",
    9:"Detachment from conventional religion. True inner spirituality awakens.",
    10:"Career feels purposeless until a deeper calling is found. Spiritual vocation.",
    11:"Detachment from material desires. Fulfilment through spiritual service.",
    12:"Liberation and moksha themes. Deep meditation, solitude, and inner peace.",
  },
};

const HOUSE_MEANINGS: Record<number, string> = {
  1: "Impacts your physical health, identity, and personal focus.",
  2: "Influences your wealth, family matters, speech, and material possessions.",
  3: "Affects your courage, short travels, siblings, and communication skills.",
  4: "Brings focus to your inner peace, mother, home environment, and real estate.",
  5: "Impacts your creativity, intellect, children, and romantic pursuits.",
  6: "Triggers themes of health, debts, overcoming enemies, and daily work routines.",
  7: "Directly affects your marriage, business partnerships, and public image.",
  8: "Brings sudden transformations, hidden matters, research, and unexpected gains/losses.",
  9: "Influences your luck, long-distance travel, higher learning, and spiritual beliefs.",
  10: "Impacts your career, public status, professional achievements, and authority.",
  11: "Brings focus to your income, network, elder siblings, and fulfillment of desires.",
  12: "Triggers themes of spirituality, expenses, foreign lands, and subconscious release."
};

export default function PlanetaryTransits({ profileId }: { profileId: string }) {
  const [data, setData] = useState<TransitsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    fetch(`/api/transits?profileId=${profileId}`)
      .then(r => r.json())
      .then(d => { if (d.transits) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) return <div className="h-64 animate-pulse bg-slate-100 rounded-2xl" />;
  if (!data) return <div className="text-center py-8 text-slate-400">Failed to load transits.</div>;

  // Group planets by sign
  const signPlanets: Record<string, TransitPlanet[]> = {};
  ZODIAC_SIGNS.forEach(s => signPlanets[s] = []);
  data.transits.forEach(p => {
    if (signPlanets[p.sign]) signPlanets[p.sign].push(p);
  });

  return (
    <div className="space-y-4">
      <SectionHeader emoji="🪐" title="Live Planetary Transits" subtitle={`Current planetary positions · Moon in ${data.moonSign}`} />

      {/* How to use section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-4 shadow-sm">
        <h4 className="text-[12px] font-black uppercase tracking-widest text-indigo-800 mb-2 flex items-center gap-2">
          <span>🔭</span> How to Read Your Transits
        </h4>
        <div className="space-y-2 text-sm text-indigo-900/80 leading-relaxed font-medium">
          <p>
            <strong className="text-indigo-900">What is this?</strong> This shows exactly where the 9 planets are moving in the sky <em>right now</em>, mapped against the 12 Zodiac signs. 
          </p>
          <p>
            <strong className="text-indigo-900">Why it matters:</strong> While your Birth Chart is locked, these "Transits" are live. When a heavy planet like Saturn or Jupiter moves into your <strong>Moon Sign</strong> or <strong>Ascendant</strong>, it triggers major life events, shifts in mood, and new karmic lessons.
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-1 text-[13px]">
            <li>Check your <span className="text-[10px] font-black text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">ASCENDANT</span> sign: Planets here impact your physical health, identity, and major life path.</li>
            <li>Check your <span className="text-[10px] font-black text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded">MOON SIGN</span>: Planets here directly impact your emotions, mental peace, and daily reactions.</li>
            <li><strong className="text-red-700">® Retrograde</strong>: Planets marked with ® are appearing to move backward. Their energy becomes internalized, delayed, or more intense.</li>
          </ul>
        </div>
      </div>

      {data.transits.length === 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-indigo-800 text-sm">
          <p className="font-bold mb-1">🌌 Live Positions Loading</p>
          <p>Planetary positions are being fetched in real time. If this persists, please refresh the page.</p>
        </div>
      )}

      {/* Grid of Zodaic Signs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {ZODIAC_SIGNS.map((sign, idx) => {
          const planets = signPlanets[sign];
          const isAscendant = data.ascendantSign === sign;
          const isMoonSign = data.moonSign === sign;

          return (
            <div key={sign} className={`rounded-xl border p-3 flex flex-col ${planets.length > 0 ? "bg-white shadow-sm border-slate-200" : "bg-slate-50/50 border-slate-100"}`}>
              
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className={`text-[11px] font-black uppercase tracking-widest ${planets.length > 0 ? "text-slate-800" : "text-slate-400"}`}>{sign}</h4>
                  {isAscendant && <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1 rounded block w-fit mt-0.5">ASCENDANT</span>}
                  {isMoonSign && !isAscendant && <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-1 rounded block w-fit mt-0.5">MOON SIGN</span>}
                </div>
                <span className="text-slate-300 text-xs font-bold">{idx + 1}</span>
              </div>

              {planets.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[10px] text-slate-300">Empty</span>
                </div>
              ) : (
                <div className="flex-1 space-y-1.5 mt-1">
                  {planets.map(p => {
                    const meta = PLANET_META[p.planet] || { emoji:"🪐", color:"#94A3B8", bg:"#F8FAFC", border:"#E2E8F0" };
                    
                    // Personalized logic: calculate transit house relative to Ascendant
                    let houseNum = 0;
                    if (data.ascendantSign) {
                      const pIdx = ZODIAC_SIGNS.findIndex(s => s === p.sign);
                      const aIdx = ZODIAC_SIGNS.findIndex(s => s === data.ascendantSign);
                      if (pIdx !== -1 && aIdx !== -1) {
                        houseNum = ((pIdx - aIdx + 12) % 12) + 1;
                      }
                    }
                    
                    return (
                      <div key={p.planet} className="group relative">
                        <div className="flex justify-between items-center px-1.5 py-1 rounded cursor-pointer hover:ring-1 transition-all" style={{ background: meta.bg, borderColor: meta.color }}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{meta.emoji}</span>
                            <span className="text-[10px] font-black" style={{ color: meta.color }}>
                              {p.planet} {p.isRetrograde ? "®" : ""}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 tabular-nums">
                            {p.degree.toFixed(1)}°
                          </span>
                        </div>
                        
                        {/* Hover Tooltip for Personalized Meaning */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 bg-slate-900 text-white text-xs rounded-xl p-3.5 shadow-2xl z-50 pointer-events-none border border-white/10">
                          <div className="font-black mb-1.5 flex items-center gap-1.5 text-[11px]">
                            <span className="text-base">{meta.emoji}</span>
                            <span style={{ color: meta.color }}>{p.planet}{p.isRetrograde ? " ℞ Retrograde" : " Transit"}</span>
                          </div>
                          {houseNum > 0 ? (
                            <>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                Transiting your House {houseNum}
                              </div>
                              <div className="text-[11.5px] text-slate-200 leading-relaxed">
                                {(PLANET_HOUSE_MEANINGS[p.planet]?.[houseNum]) || HOUSE_MEANINGS[houseNum as keyof typeof HOUSE_MEANINGS]}
                              </div>
                              {p.isRetrograde && (
                                <div className="mt-2 text-[10px] text-amber-400 font-semibold border-t border-white/10 pt-2">
                                  ℞ Retrograde: energy is intensified, internalized, and may bring past events forward.
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-slate-300 text-[11px] leading-snug">
                              Currently transiting {p.sign}. Generate your Destiny Window to see personalized house impacts.
                            </div>
                          )}
                          {/* Triangle pointer */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-[12px] text-indigo-700 font-medium space-y-1">
        <p>💡 <strong>Note:</strong> ® indicates a retrograde planet. Current positions are calculated for <strong>{data.location}</strong>.</p>
      </div>
    </div>
  );
}
