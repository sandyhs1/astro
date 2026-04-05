'use client';
import { useState } from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import LegalModal from '@/components/features/LegalModal';
import SupportModal from '@/components/features/SupportModal';

export default function FooterSection() {
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' | 'refunds' | null }>({
    isOpen: false,
    type: null,
  });
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const openLegal = (type: 'terms' | 'privacy' | 'refunds') => {
    setLegalModal({ isOpen: true, type });
  };

  const grad = 'linear-gradient(135deg,hsl(245,60%,28%),hsl(270,60%,40%),hsl(30,80%,55%))';

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Sample Report', href: '/sample-report' },
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Astrology', href: '/astrology' },
    { label: 'Our Process', href: '/our-process' },
    { label: 'Myths', href: '/myths' },
    { label: 'Blog', href: 'https://quantumkarma.substack.com/', external: true },
  ];

  return (
    <footer style={{ background: 'hsl(240,20%,8%)', borderTop: '1px solid hsl(240,15%,15%)', padding: '5rem 1.5rem 3rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Top: brand + columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 48, marginBottom: 48 }} className="nl-footer-grid">
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.25rem', fontWeight: 700, color: 'hsl(40,33%,97%)' }}>
                Quantum Karma
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'hsl(40 33% 97% / 0.4)', lineHeight: 1.6, maxWidth: 240 }}>
              Fate is optional. Dominance is a choice. Zero upsells. Ever.
            </p>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 32px', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', fontFamily: 'var(--font-mono), monospace', color: 'hsl(40 33% 97% / 0.45)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.07em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'hsl(30,80%,55%)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'hsl(40 33% 97% / 0.45)')}
              >
                {link.label}
                {link.external && <ExternalLink size={10} />}
              </a>
            ))}

            {/* Legal buttons */}
            {(['refunds', 'terms', 'privacy'] as const).map((type) => (
              <button
                key={type}
                onClick={() => openLegal(type)}
                style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono), monospace', color: 'hsl(40 33% 97% / 0.45)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.07em', transition: 'color 0.2s', padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'hsl(30,80%,55%)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'hsl(40 33% 97% / 0.45)')}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}

            <button
              onClick={() => setIsSupportOpen(true)}
              style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono), monospace', background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, padding: 0 }}
            >
              Support
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'hsl(240,15%,15%)', marginBottom: 32 }} />

        {/* Bottom bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <p style={{ fontSize: '0.8125rem', color: 'hsl(40 33% 97% / 0.3)', fontFamily: 'var(--font-mono), monospace' }}>
            © 2026 Quantum Karma. Brutally honest data only.
          </p>
          <button
            onClick={() => openLegal('refunds')}
            style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono), monospace', color: 'hsl(40 33% 97% / 0.25)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'hsl(0,60%,55%)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'hsl(40 33% 97% / 0.25)')}
          >
            No refunds on karma. Precision is guaranteed; your ego is not.
          </button>
        </div>
      </div>

      <LegalModal
        isOpen={legalModal.isOpen}
        type={legalModal.type}
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })}
      />
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <style>{`
        @media(max-width:1023px) {
          .nl-footer-grid {
            grid-template-columns: 1fr !important;
          }
          .nl-footer-grid > div:last-child {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
}
