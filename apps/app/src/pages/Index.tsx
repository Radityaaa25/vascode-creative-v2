import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import HowToOrder from '@/components/HowToOrder';
import Portfolio from '@/components/Portfolio';
import FAQ from '@/components/FAQ';
import ToolsWeUse from '@/components/ToolsWeUse';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import BackgroundEffects from '@/components/BackgroundEffects';

function IndexInner() {
  const { t } = useLanguage();
  return (
    <>
      <SEO title={t('hero.title1') + ' ' + t('hero.title2')} description={t('hero.description')} />
      <main id="main-content" className="min-h-screen overflow-x-hidden relative">
        <BackgroundEffects />
        <Navbar />
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <HowToOrder />
        <FAQ />
        <ToolsWeUse />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

const Index = () => (
  <LanguageProvider>
    <IndexInner />
  </LanguageProvider>
);

export default Index;
