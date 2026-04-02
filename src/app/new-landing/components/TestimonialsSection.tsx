'use client';
import AnimatedSection from './AnimatedSection';

// All testimonials from the reviews/page.tsx
const row1 = [
  {
    user: 'u/burnout_szn',
    time: '3h',
    title: 'sister is speechless',
    content: 'Thanku thanku sooooooo so much... You are very much true about her...my sister hardly get impressed by someone...but literally got impressed with your knowledge... She still can\'t able to believe that someone can interpret about her this much true.. Hrudayapoorvaka Dhanyavaadagalu... Thanku once again',
  },
  {
    user: 'u/chaotic_millennial',
    time: '1d',
    title: 'pure clarity',
    content: 'You are amazing! I\'ve been analyzing myself for years, but you connected dots I didn\'t even know existed. The way you explained my career blockages was surgical. No fluff, just pure clarity. I finally feel like I\'m in the driver\'s seat of my own life.',
  },
  {
    user: 'u/corporate_slave_no_more',
    time: '5h',
    title: 'reading my soul source code',
    content: 'This is so insightful! Thank you so much for such a deep and accurate analysis. It\'s truly beyond helpful. It felt like you were reading my soul\'s source code—exposing the glitches and showing me exactly how to patch them.',
  },
  {
    user: 'u/relationship_wreck',
    time: '12h',
    title: 'honest and straightforward',
    content: 'Thank you for taking the time to break this down so clearly. A lot of what you pointed out makes sense, I appreciate the straightforward perspective and the honesty around expectations during this period.',
  },
  {
    user: 'u/crypto_casualties',
    time: '2d',
    title: 'flabbergasted',
    content: 'I\'m honestly flabbergasted. I don\'t think anyone has ever described me this accurately before, not even myself. I don\'t know who you are, but wow... you held up a mirror for me in a way I\'ve never experienced. Every single point you mentioned felt absolutely spot on. Truly, every single one. I\'m genuinely considering printing this out and framing it.',
  },
  {
    user: 'u/sleep_deprived_founder',
    time: '8h',
    title: 'marriage clarity',
    content: 'You got almost everything right. I am still giving this marriage everything and maybe in the end everything works out. Thank you for the advice.',
  },
  {
    user: 'u/recovering_people_pleaser',
    time: '6h',
    title: 'wholesome read',
    content: 'This is such a wholesome read! I\'m surely going to try to be more assertive now. If not that then atleast authoritarian In my opinion I have the mindset and intentions but lack a little corporate confidence. Thank you for shedding light on it',
  },
  {
    user: 'u/data_nerd_validated',
    time: '4h',
    title: 'psycho-spiritual audit',
    content: 'You are fabulous. The depth of this report is insane—it\'s not just astrology, it\'s a full psycho-spiritual audit. I walked in skeptical and walked out a believer. 10/10 would recommend to anyone feeling lost.',
  },
  {
    user: 'u/transactional_no_more',
    time: '4h',
    title: 'accurate ancestral stuff',
    content: 'Thank you I would say this is accurate. I do over think less than I did when I was younger. I cut off many relationships last year due to that transactional feeling. But I do want to find closeness now. Is there any indication of when I could find real love? The ancestral stuff is accurate too',
  },
  {
    user: 'u/scared_but_seen',
    time: '2d',
    title: 'almost too accurate',
    content: 'Okayyy, almost all of it is accurate. Thats scary. Thank you.',
  },
  {
    user: 'u/skeptic_silenced',
    time: '1d',
    title: 'surprisingly accurate statements',
    content: 'Thanks for taking time and analyzing my situation. These are surprisingly accurate statements.',
  },
  {
    user: 'u/spot_on_1000',
    time: '8h',
    title: '1000/10 spot on',
    content: 'I\'ve never had a reading be sooo spot on before. It\'s a bit scary just how accurate some of these are, 1000/10 thank you!',
  },
  {
    user: 'u/read_to_filth',
    time: '5h',
    title: 'read to absolute filth',
    content: 'You just read me to absolute filth and nailed everything farrrrkkk',
  },
  {
    user: 'u/freakily_correct',
    time: '3h',
    title: 'freaky accurate',
    content: 'Honestly your reading was literally spot on in every aspect, it\'s actually a bit freaky just how correct you are! You\'re gift is incredible and I\'m so grateful ☺️',
  },
  {
    user: 'u/jaw_on_floor',
    time: '2h',
    title: 'jaw on the floor',
    content: 'HOLY CRAP. The way my jaw was on the floor reading this. And thank you for taking the time for such a detailed response. You are so clever and talented wow!!!!!! 💕',
  },
];

const row2 = [
  {
    user: 'u/gen_z_chaos',
    time: '9h',
    title: 'literally cried',
    content: 'Fuck why this is so accurate 🥲 And the analysis you did is on point I literally cried for 10 minutes straight. Thank you bub! Means a lot!',
  },
  {
    user: 'u/midwest_overthinker',
    time: '1d',
    title: 'dragged me but i needed it',
    content: "okay i was skeptical bc most astrology is vague trash but this?? dragged me to hell and back in the best way. calling out my commitment issues with actual dates? rude but necessary. i feel seen.",
  },
  {
    user: 'u/toxic_ex_survivor',
    time: '7h',
    title: 'scary accurate timeline',
    content: "bro the career timeline is actually scary accurate. said i'd pivot in 2024... i literally handed in my notice last week. how do you know this?? i'm shook. subscriber for life.",
  },
  {
    user: 'u/startup_graveyard',
    time: '11h',
    title: 'no toxic positivity',
    content: "no toxic positivity here and i love it. just straight facts about why i keep failing at business. the 'invisible tax' concept hit hard. fixed my strategy based on the wealth window and seeing movement already.",
  },
  {
    user: 'u/chronic_job_hopper',
    time: '2d',
    title: 'life-saving roast',
    content: "this isn't a horoscope, it's a roast session that saves your life. finding out my 'nice guy' act was actually a defense mechanism? oof. heavy realization but exactly what i needed to grow up.",
  },
  {
    user: 'u/overthinker_anonymous',
    time: '5h',
    title: 'cheat code for life',
    content: "finally something that doesn't tell me to 'just manifest it'. gave me practical windows for action. i feel like i have a cheat code for the next 5 years. worth every rupee.",
  },
  {
    user: 'u/manifestation_skeptic',
    time: '3h',
    title: 'therapist is gonna be shook',
    content: "my therapist is gonna act surprised when i show up with actual answers next week lol. this report did in 20 mins what we've been trying to figure out for months. wild.",
  },
  {
    user: 'u/family_business_heir',
    time: '10h',
    title: 'strategic personality audit',
    content: "i usually cringe at 'soul' stuff but this was surprisingly grounded. logical, structured, and deep. feels like a strategic audit of my personality. 100% accurate.",
  },
  {
    user: 'u/astro_bro_salute',
    time: '6h',
    title: 'you are an expert brother',
    content: 'Damn bro this is such a detailed explanation. You are an expert, brother 🫡 👏',
  },
  {
    user: 'u/holy_shit_wow',
    time: '7h',
    title: 'holy shit wow',
    content: "Holy shit I wanted to give this a go for the hell of it but I think you're actually onto something, wow",
  },
  {
    user: 'u/understood_at_last',
    time: '11h',
    title: 'feels good to be understood',
    content: "Thank you so much for your time and attention. This is the perfect depiction of my current metal and physical state! Feels good to be understood. Thanks again.",
  },
  {
    user: 'u/newbie_mindblown',
    time: '2d',
    title: 'told me the reasons why',
    content: "I love the way how you have explained everything.. you didn't just show me what's happening but also told me the reason why it's happening.. me being a newbie to astrology don't have much insight about the effect the planets can have on our life...Once again thank you and I truly appreciate you for your time and help !!! 😊🙏🏻",
  },
  {
    user: 'u/no_sugarcoating',
    time: '10h',
    title: 'no sugarcoating truth',
    content: "Thank you so much, sir, for taking the time to explain everything so honestly and without sugarcoating. Everything you said is absolutely true. I'm truly amazed at how accurate you were. You are genuinely gifted. Once again, thank you so much.",
  },
];

// Stable vote counts based on index to avoid hydration mismatch
const votes1 = [312, 89, 247, 156, 421, 73, 198, 338, 144, 267, 91, 483, 178, 356, 229];
const votes2 = [401, 167, 289, 134, 376, 212, 95, 318, 443, 187, 256, 329, 408];
const comments1 = [42, 17, 31, 8, 56, 12, 23, 38, 19, 44, 7, 62, 28, 49, 33];
const comments2 = [51, 22, 37, 11, 48, 16, 9, 41, 57, 25, 34, 43, 52];

function RedditCard({ data, voteCount, commentCount }: { data: typeof row1[0]; voteCount: number; commentCount: number }) {
  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';
  return (
    <div
      style={{
        width: 340,
        height: 'fit-content',
        background: '#ffffff',
        border: '1px solid hsl(240, 15%, 90%)',
        borderRadius: 16,
        padding: '24px',
        flexShrink: 0,
        display: 'flex',
        gap: 16,
        cursor: 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.06)',
      }}
      className="nl-review-card"
    >
      {/* Votes */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 28, paddingTop: 2 }}>
        <span style={{ color: '#ff6314', fontSize: '1.2rem', fontWeight: 700 }}>▲</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'hsl(240,20%,8%)' }}>{voteCount}</span>
        <span style={{ color: 'hsl(240,10%,60%)', fontSize: '1.1rem' }}>▼</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: '0.8125rem', color: 'hsl(240,10%,50%)' }}>
          <span style={{ fontWeight: 600, color: 'hsl(240,20%,8%)' }}>{data.user}</span>
          <span>•</span>
          <span>{data.time}</span>
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.0625rem', color: 'hsl(240,20%,8%)', marginBottom: 10, lineHeight: 1.3 }} className="nl-review-title">
          {data.title}
        </h3>
        <p style={{ fontSize: '0.9375rem', color: 'hsl(240,10%,35%)', lineHeight: 1.6 }}>{data.content}</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: '0.8125rem', fontWeight: 600, color: 'hsl(240,10%,50%)' }}>
          <span>💬 {commentCount} Comments</span>
          <span>Share</span>
        </div>
      </div>

      <style>{`
        .nl-review-card:hover {
          border-color: hsl(30,80%,75%) !important;
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
        }
        .nl-review-card:hover .nl-review-title {
          background: ${grad};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}

import { useRef, useEffect, useState } from 'react';

export default function TestimonialsSection() {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate arrays to make sure infinite scroll has enough content
  const duplicatedRow1 = [...row1, ...row1, ...row1, ...row1];
  const duplicatedRow2 = [...row2, ...row2, ...row2, ...row2];

  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();
    const speed = 0.04;

    const scrollRows = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (!isHovered) {
        if (scrollRef1.current) {
          scrollRef1.current.scrollLeft -= speed * delta;
          if (scrollRef1.current.scrollLeft <= 0) {
            scrollRef1.current.scrollLeft = scrollRef1.current.scrollWidth / 2;
          }
        }
        if (scrollRef2.current) {
          scrollRef2.current.scrollLeft += speed * delta;
          if (scrollRef2.current.scrollLeft >= scrollRef2.current.scrollWidth / 2) {
            scrollRef2.current.scrollLeft = 0;
          }
        }
      }
      animationId = requestAnimationFrame(scrollRows);
    };

    // Initialize row 1 so it doesn't immediately hit 0
    if (scrollRef1.current && scrollRef1.current.scrollLeft === 0) {
      scrollRef1.current.scrollLeft = scrollRef1.current.scrollWidth / 2;
    }

    animationId = requestAnimationFrame(scrollRows);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  const manualScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  const btnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: '#ffffff',
    border: '1px solid hsl(240, 15%, 85%)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'hsl(240,20%,8%)',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  };

  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';

  return (
    <section style={{ padding: '6rem 0', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '30%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'hsl(245 60% 28% / 0.04)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'hsl(30 80% 55% / 0.05)', filter: 'blur(80px)' }} />
      </div>

      <AnimatedSection>
        <div style={{ textAlign: 'center', marginBottom: 56, padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
          <span style={{ display: 'inline-block', padding: '0.375rem 1rem', borderRadius: 999, background: 'hsl(42 90% 55% / 0.1)', color: 'hsl(42,90%,55%)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 16 }}>
            REAL FEEDBACK FROM REAL PEOPLE
          </span>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: 'hsl(240,20%,8%)', lineHeight: 1.15 }}>
            When the data<br />
            <span style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              hits reality.
            </span>
          </h2>
          <p style={{ marginTop: 16, color: 'hsl(240,10%,46%)', fontSize: '1.0625rem', maxWidth: 520, margin: '16px auto 0' }}>
            Tears, truth, and shattered egos. Savage, unfiltered feedback from the frontlines.
          </p>
        </div>
      </AnimatedSection>

      <div 
        style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '16px 0' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Row 1 - Auto scrolls Right, so visual movement is right meaning scrollLeft decreases */}
        <div style={{ position: 'relative', width: '100vw' }}>
          <button
            onClick={() => manualScroll(scrollRef1, 'left')}
            style={{ ...btnStyle, left: 16 }}
            aria-label="Previous"
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(30,80%,55%)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(240,15%,85%)'; }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div
            ref={scrollRef1}
            style={{ display: 'flex', gap: 20, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', padding: '8px 64px', alignItems: 'flex-start' } as React.CSSProperties}
          >
            {duplicatedRow1.map((t, i) => (
              <RedditCard key={`r1-${i}`} data={t} voteCount={votes1[i % votes1.length]} commentCount={comments1[i % comments1.length]} />
            ))}
          </div>

          <button
            onClick={() => manualScroll(scrollRef1, 'right')}
            style={{ ...btnStyle, right: 16 }}
            aria-label="Next"
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(30,80%,55%)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(240,15%,85%)'; }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Row 2 - Auto scrolls Left */}
        <div style={{ position: 'relative', width: '100vw' }}>
          <button
            onClick={() => manualScroll(scrollRef2, 'left')}
            style={{ ...btnStyle, left: 16 }}
            aria-label="Previous"
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(30,80%,55%)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(240,15%,85%)'; }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div
            ref={scrollRef2}
            style={{ display: 'flex', gap: 20, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', padding: '8px 64px', alignItems: 'flex-start' } as React.CSSProperties}
          >
            {duplicatedRow2.map((t, i) => (
              <RedditCard key={`r2-${i}`} data={t} voteCount={votes2[i % votes2.length]} commentCount={comments2[i % comments2.length]} />
            ))}
          </div>

          <button
            onClick={() => manualScroll(scrollRef2, 'right')}
            style={{ ...btnStyle, right: 16 }}
            aria-label="Next"
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(30,80%,55%)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(240,15%,85%)'; }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
