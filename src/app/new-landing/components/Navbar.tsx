'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';

export default function Navbar() {
  const { openModal } = useOnboarding();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'hsl(40 33% 97% / 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid hsl(40 15% 88% / 0.5)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={22} color="hsl(30,80%,55%)" />
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.2rem', fontWeight: 700, color: 'hsl(240,20%,8%)' }} className="nl-nav-logo">Quantum Karma</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['problem', 'features', 'pricing', 'faq'].map((id, i) => (
            <a key={i} href={`#${id}`} onClick={(e) => handleScroll(e, id)} style={{ display: 'none', fontSize: '0.875rem', color: 'hsl(240,10%,46%)', textDecoration: 'none', cursor: 'pointer' }}
              className="nl-nav-link">{['The Reality','Your Life','Pricing','FAQ'][i]}</a>
          ))}
          <motion.button
            onClick={openModal}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))',
              color: 'hsl(40,33%,97%)', padding: '0.6rem 1.25rem',
              borderRadius: 999, fontSize: '0.875rem', fontWeight: 600,
              border: 'none', cursor: 'pointer', display: 'block',
            }}
            className="nl-nav-btn"
          >Get Your Report</motion.button>
        </div>
      </div>
      <style>{`
        .nl-nav-link { display: none !important; } 
        @media(min-width:768px){.nl-nav-link{display:block!important}}
        @media(max-width:767px){
          .nl-nav-logo{font-size:1rem!important}
          .nl-nav-btn{padding:0.5rem 1rem!important;font-size:0.8rem!important}
        }
      `}</style>
    </motion.nav>
  );
}
