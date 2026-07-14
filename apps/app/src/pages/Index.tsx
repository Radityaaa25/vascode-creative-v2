import { useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Update page metadata for SEO
    document.title = 'Vascode Creative | Creative Agency & Production House';
  }, []);

  return (
    <LanguageProvider>
      <main className="min-h-screen overflow-x-hidden">
        <Navbar />
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Contact />
        <Footer />
      </main>
    </LanguageProvider>
  );
};

export default Index;
