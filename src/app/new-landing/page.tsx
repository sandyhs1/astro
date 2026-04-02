import './new-landing.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import ProblemSection from './components/ProblemSection';
import FearFactorySection from './components/FearFactorySection';
import SavageQuoteSection from './components/SavageQuoteSection';
import TruthBombSection from './components/TruthBombSection';
import IntroSection from './components/IntroSection';
import LifeDomainsSection from './components/LifeDomainsSection';
import HowItWorksSection from './components/HowItWorksSection';
import StackCardsSection from './components/StackCardsSection';
import ComparisonSection from './components/ComparisonSection';
import SocialProofBar from './components/SocialProofBar';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import FooterSection from './components/FooterSection';

export default function NewLandingPage() {
  return (
    <div className="nl-root">
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <ProblemSection />
      <FearFactorySection />
      <SavageQuoteSection />
      <TruthBombSection />
      <IntroSection />
      <LifeDomainsSection />
      <HowItWorksSection />
      <StackCardsSection />
      <ComparisonSection />
      <SocialProofBar />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
