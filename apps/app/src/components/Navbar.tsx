import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logoIcon from '@/assets/logo-icon.png';
import logoFull from '@/assets/logo-full.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.portfolio'), href: '#portfolio' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-4 left-4 right-4 md:left-8 md:right-8 lg:left-12 lg:right-12 z-50 transition-all duration-500 ${
        isScrolled ? 'top-2 md:top-4' : 'top-4 md:top-6'
      }`}
    >
      <div
        className={`mx-auto max-w-6xl rounded-full px-4 md:px-6 py-3 md:py-4 transition-all duration-500 ${
          isScrolled
            ? 'glass shadow-lg shadow-primary/10'
            : 'bg-void/80 backdrop-blur-xl'
        }`}
      >
        <div className="flex items-center justify-between">
        {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center gap-2 md:gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.img
              src={logoIcon}
              alt="Vascode Creative"
              className="h-8 w-8 md:h-10 md:w-10 object-contain"
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Bagian Teks Baru */}
            <div className="flex flex-col items-start leading-none">
              <span className="font-bold text-lg md:text-xl text-snow tracking-tight">
                Vas<span className="text-volt">Code</span>
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-snow/60 font-medium ml-0.5">
                Creative
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="px-4 py-2 text-sm font-medium text-snow/80 hover:text-volt transition-colors duration-300 rounded-full hover:bg-snow/5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Toggle */}
            <motion.button
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-snow/10 text-snow text-sm font-medium hover:bg-volt hover:text-void transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={language === 'en' ? 'font-bold' : 'opacity-60'}>EN</span>
              <span className="opacity-40">/</span>
              <span className={language === 'id' ? 'font-bold' : 'opacity-60'}>ID</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-snow hover:text-volt transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden mt-2 mx-auto max-w-6xl rounded-2xl overflow-hidden glass-dark"
          >
            <div className="p-4 space-y-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="block px-4 py-3 text-snow/90 hover:text-volt hover:bg-snow/5 rounded-xl transition-all duration-300 font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
