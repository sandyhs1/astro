'use client';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { AlertTriangle, Skull, HandCoins, ShieldAlert, Lock, Baby, Key, Zap } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useState } from 'react';

const scams = [
  { id: 'shani', Icon: AlertTriangle, title: '"Shani is angry with you"', desc: 'Classic opener. Next step? A ₹11,000 puja and a sapphire ring you literally can\'t afford. Shani isn\'t angry. Your astrologer\'s credit card bill is just due.', color:'hsl(5,90%,55%)', gradient: 'linear-gradient(135deg, hsl(5,90%,96%), hsl(5,90%,98%))' },
  { id: 'manglik', Icon: Skull, title: '"You have Manglik Dosha"', desc: 'Translation: \'Pay me or die alone.\' Almost half the country is technically Manglik. If it were a real death sentence, humanity would have ended centuries ago.', color:'hsl(15,85%,55%)', gradient: 'linear-gradient(135deg, hsl(15,85%,96%), hsl(15,85%,98%))' },
  { id: 'gemstone', Icon: HandCoins, title: '"Wear this ₹50k gemstone"', desc: 'They get a 30% cut from the jeweler. The rock does absolutely nothing. Your bank account, however, will feel the burn for months.', color:'hsl(30,85%,50%)', gradient: 'linear-gradient(135deg, hsl(30,85%,96%), hsl(30,85%,98%))' },
  { id: '7years', Icon: ShieldAlert, title: '"Bad period for 7.5 years"', desc: 'The ultimate fear weapon. They\'ll sell you 7 years of fake remedies. What they won\'t tell you? Some of your biggest career wins could happen right in the middle of it.', color:'hsl(270,70%,60%)', gradient: 'linear-gradient(135deg, hsl(270,70%,96%), hsl(270,70%,98%))' },
  { id: 'kalsarpa', Icon: Lock, title: 'The "Kalsarpa" Invention', desc: 'This "dosha" does not exist in the classical Brihat Parashara Hora Shastra. It was popularized in the last century specifically to sell expensive temple rituals. It\'s a modern revenue-generator.', color:'hsl(200,80%,50%)', gradient: 'linear-gradient(135deg, hsl(200,80%,96%), hsl(200,80%,98%))' },
  { id: 'gandmool', Icon: Baby, title: 'The "Gandmool" Newborn Scare', desc: 'Telling parents their newborn baby is "dangerous" for the father or maternal uncle. This forces a 27-day ritual. It preys on parental anxiety at the most vulnerable moment of birth.', color:'hsl(340,80%,55%)', gradient: 'linear-gradient(135deg, hsl(340,80%,96%), hsl(340,80%,98%))' },
  { id: 'rajayoga', Icon: Key, title: 'The "Locked Rajayoga" Dangler', desc: 'Telling a user they have the "chart of a billionaire" but it is "locked" by a specific planet. The astrologer offers to "unlock" it with a ritual. You can\'t bribe a planet to arrive early.', color:'hsl(45,95%,45%)', gradient: 'linear-gradient(135deg, hsl(45,95%,96%), hsl(45,95%,98%))' },
  { id: 'markesh', Icon: Zap, title: 'The "Markesh" Death Threat', desc: 'Telling a client they are in a "death-inflicting" period. This is the ultimate high-ticket close. Fact: Markesh usually just means a period of high expenditure or low energy.', color:'hsl(0,85%,55%)', gradient: 'linear-gradient(135deg, hsl(0,85%,96%), hsl(0,85%,98%))' },
];

export default function ProblemSection() {
  const [cards, setCards] = useState(scams);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  const moveCardToBack = (cardId: string) => {
    setCards((prevCards) => {
      const cardIndex = prevCards.findIndex(c => c.id === cardId);
      if (cardIndex === 0) {
        const newCards = [...prevCards];
        const [removed] = newCards.splice(0, 1);
        newCards.push(removed);
        return newCards;
      }
      return prevCards;
    });
  };

  return (
    <section id="problem" style={{ padding:'5rem 1.5rem 6rem', background:'linear-gradient(135deg, hsl(40,35%,98%), hsl(40,25%,96%))', position:'relative', overflow:'hidden' }}>
      
      {/* Decorative Elements */}
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, hsl(5,90%,95%) 0%, transparent 70%)', opacity:0.4, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-15%', left:'-8%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, hsl(270,70%,95%) 0%, transparent 70%)', opacity:0.3, pointerEvents:'none' }} />
      
      <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>
        <AnimatedSection>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ display:'inline-block', padding:'0.4rem 1.1rem', borderRadius:20, background:'hsl(5,90%,96%)', border:'1.5px solid hsl(5,90%,88%)', marginBottom:20 }}
            >
              <span style={{ fontSize:'0.7rem', fontWeight:800, color:'hsl(5,90%,55%)', textTransform:'uppercase', letterSpacing:'0.12em' }}>⚠️ Targeted Operations</span>
            </motion.div>
            
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(1.9rem,5vw,3.2rem)', fontWeight:800, color:'hsl(240,20%,8%)', marginBottom:14, lineHeight:1.2, letterSpacing:'-0.02em' }}>
              The industry is a <br className="lg:hidden" />
              <span style={{ color:'hsl(5,90%,60%)' }}>$4.5+ Billion</span> fear factory.
            </h2>
            <p style={{ color:'hsl(240,10%,35%)', fontSize:'1.05rem', maxWidth:580, margin:'0 auto', lineHeight:1.65, fontWeight:500 }}>
              They read your insecurities, not your chart. Here is exactly how millions are systemically manipulated daily.
            </p>
          </div>
        </AnimatedSection>

        {/* Card Stack Container */}
        <div style={{ 
          position:'relative', 
          height:'520px', 
          maxWidth:'600px', 
          margin:'0 auto',
          perspective:'1000px'
        }}>
          {cards.map((card, index) => {
            const isTop = index === 0;
            const stackIndex = cards.length - 1 - index;
            
            return (
              <Card
                key={card.id}
                card={card}
                index={index}
                stackIndex={stackIndex}
                isTop={isTop}
                totalCards={cards.length}
                onSwipe={() => moveCardToBack(card.id)}
                isDragging={draggedCard === card.id}
                setDraggedCard={setDraggedCard}
              />
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div style={{ 
          display:'flex', 
          justifyContent:'center', 
          gap:'8px', 
          marginTop:'32px',
          flexWrap:'wrap'
        }}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              style={{
                width: index === 0 ? '32px' : '8px',
                height:'8px',
                borderRadius:'4px',
                background: index === 0 ? card.color : 'hsl(240,15%,85%)',
                transition:'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CardProps {
  card: typeof scams[0];
  index: number;
  stackIndex: number;
  isTop: boolean;
  totalCards: number;
  onSwipe: () => void;
  isDragging: boolean;
  setDraggedCard: (id: string | null) => void;
}

function Card({ card, index, stackIndex, isTop, totalCards, onSwipe, isDragging, setDraggedCard }: CardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-200, 200], [10, -10]);
  const rotateY = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setDraggedCard(null);
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.offset.y) > threshold) {
      onSwipe();
    }
  };

  // Calculate stacking effect - cleaner and more visible
  const scale = 1 - (stackIndex * 0.02);
  const yOffset = stackIndex * 8;
  const zIndex = totalCards - index;
  const cardOpacity = stackIndex < 3 ? 1 : 0.95; // Keep cards fully visible

  const { Icon, title, desc, color, gradient } = card;
  const cardNumber = scams.findIndex((c: typeof scams[0]) => c.id === card.id) + 1;

  return (
    <motion.div
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragStart={() => setDraggedCard(card.id)}
      onDragEnd={handleDragEnd}
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : 0,
        rotateX: isTop ? rotateX : 0,
        rotateY: isTop ? rotateY : 0,
        opacity: isTop ? opacity : 1,
        scale: isDragging ? 1.05 : scale,
        zIndex,
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100%',
        maxWidth: '550px',
        cursor: isTop ? 'grab' : 'default',
        touchAction: 'none',
        pointerEvents: isTop ? 'auto' : 'none'
      }}
      animate={{
        y: yOffset,
        scale: isDragging ? 1.05 : scale,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      whileTap={isTop ? { cursor: 'grabbing', scale: 1.02 } : {}}
    >
      <div style={{
        transform: 'translate(-50%, -50%)',
        width: '100%',
        padding: '32px',
        background: '#ffffff',
        borderRadius: '24px',
        border: `2px solid ${color}40`,
        boxShadow: stackIndex === 0 
          ? `0 20px 60px -15px rgba(0,0,0,0.25), 0 10px 30px -10px ${color}20`
          : `0 ${8 + stackIndex * 2}px ${16 + stackIndex * 4}px -${4 + stackIndex}px rgba(0,0,0,0.1)`,
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none'
      }}>
        {/* Gradient Background Accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: gradient
        }} />

        {/* Card Number Badge */}
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: gradient,
          border: `2px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: '1.2rem',
          fontWeight: 800,
          color: color,
          boxShadow: '0 4px 12px -4px rgba(0,0,0,0.2)'
        }}>
          {cardNumber}
        </div>

        {/* Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '18px',
          background: gradient,
          border: `2px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 8px 16px -8px rgba(0,0,0,0.15)'
        }}>
          <Icon size={36} color={color} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
          fontWeight: 800,
          color: 'hsl(240,25%,15%)',
          marginBottom: '16px',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          paddingRight: '60px'
        }}>
          {title}
        </h3>

        {/* Description */}
        <p style={{
          color: 'hsl(240,15%,35%)',
          fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
          lineHeight: 1.7,
          margin: 0,
          fontWeight: 500
        }}>
          {desc}
        </p>

        {/* Swipe Indicator (only on top card) */}
        {isTop && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              marginTop: '24px',
              padding: '12px 20px',
              borderRadius: '12px',
              background: 'hsl(240,20%,97%)',
              border: '1px solid hsl(240,15%,90%)',
              textAlign: 'center'
            }}
          >
            <span style={{
              fontSize: '0.85rem',
              color: 'hsl(240,15%,45%)',
              fontWeight: 600
            }}>
              ← Swipe to see next tactic →
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
