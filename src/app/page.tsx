import './new-landing/new-landing.css';
import Navbar from './new-landing/components/Navbar';
import HeroSection from './new-landing/components/HeroSection';
import MarqueeSection from './new-landing/components/MarqueeSection';
import ProblemSection from './new-landing/components/ProblemSection';
import FearFactorySection from './new-landing/components/FearFactorySection';
import SavageQuoteSection from './new-landing/components/SavageQuoteSection';
import TruthBombSection from './new-landing/components/TruthBombSection';
import IntroSection from './new-landing/components/IntroSection';
import LifeDomainsSection from './new-landing/components/LifeDomainsSection';
import HowItWorksSection from './new-landing/components/HowItWorksSection';
import StackCardsSection from './new-landing/components/StackCardsSection';
import ComparisonSection from './new-landing/components/ComparisonSection';
import SocialProofBar from './new-landing/components/SocialProofBar';
import TestimonialsSection from './new-landing/components/TestimonialsSection';
import PricingSection from './new-landing/components/PricingSection';
import FAQSection from './new-landing/components/FAQSection';
import CTASection from './new-landing/components/CTASection';
import FooterSection from './new-landing/components/FooterSection';

export default function Home() {
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
