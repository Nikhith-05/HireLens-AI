import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import ExplainableSection from '../components/ExplainableSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <ExplainableSection />
      <CTASection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
