import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMobileDevice } from '@/hooks/use-mobile';
import { createSlideUpVariants, getHoverTapConfig } from '@/lib/animations';

const Hero = () => {
  const { t, language } = useLanguage();
  const isMobile = useMobileDevice();

  const openWhatsApp = () => {
    const messageText = language === 'en' 
      ? "Hello Vascode Creative, I'm interested in starting a project with you. Can we discuss?"
      : "Halo Vascode Creative, saya tertarik untuk memulai proyek dengan Anda. Bisa kita diskusikan?";

    const message = encodeURIComponent(messageText);
    window.open(`https://wa.me/6281412234070?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const scrollToPortfolio = () => {
    const element = document.querySelector('#portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slideUp = createSlideUpVariants();
  const hoverTap = getHoverTapConfig();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center"
    >
      <div className="container-custom relative z-10 text-center px-4 pt-28 md:pt-24">
        {/* Tagline */}
        <motion.div
          initial={slideUp.hidden}
          animate={slideUp.visible}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-snow/5 border border-snow/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-volt animate-pulse" />
          <span className="text-snow/80 text-sm md:text-base font-medium tracking-wide">
            {t('hero.tagline')}
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: isMobile ? 10 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.3 : 0.6, delay: isMobile ? 0 : 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-snow leading-tight mb-6"
        >
          {t('hero.title1')}
          <br />
          <span className="text-gradient">{t('hero.title2')}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: isMobile ? 10 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.3 : 0.6, delay: isMobile ? 0.05 : 0.2 }}
          className="text-snow/60 text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          {t('hero.description')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 10 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.3 : 0.6, delay: isMobile ? 0.1 : 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={openWhatsApp}
            className="group flex items-center gap-2 px-8 py-4 rounded-full bg-volt text-void font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-volt/30"
            {...(isMobile ? { whileTap: { scale: 0.97 } } : hoverTap)}
            aria-label={t('hero.cta1')}
          >
            {t('hero.cta1')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            onClick={scrollToPortfolio}
            className="hero-cta-anim flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg"
            whileTap={{ scale: 0.97 }}
            aria-label={t('hero.cta2')}
          >
            <Play className="w-5 h-5" />
            {t('hero.cta2')}
          </motion.button>
        </motion.div>

        <style>{`
          .hero-cta-anim {
            position: relative;
            overflow: hidden;
            z-index: 1;
            border: 2px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            transition: all 0.2s ease-in;
            cursor: pointer;
          }
          .hero-cta-anim:before {
            content: "";
            position: absolute;
            left: 50%;
            transform: translateX(-50%) scaleY(1) scaleX(1.25);
            top: 100%;
            width: 140%;
            height: 180%;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
            display: block;
            transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
            z-index: -1;
          }
          .hero-cta-anim:after {
            content: "";
            position: absolute;
            left: 55%;
            transform: translateX(-50%) scaleY(1) scaleX(1.45);
            top: 180%;
            width: 160%;
            height: 190%;
            background-color: hsl(257, 65%, 57%);
            border-radius: 50%;
            display: block;
            transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
            z-index: -1;
          }
          .hero-cta-anim:hover {
            color: #ffffff;
            border-color: hsl(257, 65%, 57%);
          }
          .hero-cta-anim:hover:before {
            top: -35%;
            background-color: hsl(257, 65%, 57%);
            transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
          }
          .hero-cta-anim:hover:after {
            top: -45%;
            background-color: hsl(257, 65%, 57%);
            transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
          }
        `}</style>

        {/* Scroll Indicator - Disable animation on mobile */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-24 md:mt-6 flex justify-center relative z-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-10 rounded-full border-2 border-snow/30 flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ opacity: [1, 0, 1], y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-volt"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
      
    </section>
  );
};

export default Hero;