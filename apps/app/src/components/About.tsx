import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import logoIcon from '@/assets/logo-icon.png';

const About = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: t('about.stat1.value'), label: t('about.stat1.label') },
    { value: t('about.stat2.value'), label: t('about.stat2.label') },
    { value: t('about.stat3.value'), label: t('about.stat3.label') },
  ];

  return (
    <section id="about" className="section-padding bg-void/95" ref={ref}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-medium text-sm mb-4"
            >
              {t('about.subtitle')}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-snow mb-6 leading-tight"
            >
              {t('about.title')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-snow/70 text-lg leading-relaxed mb-8"
            >
              {t('about.description')}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="text-center p-4 rounded-2xl bg-snow/5 border border-snow/10"
                >
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-snow/60">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative Elements */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-4 rounded-3xl bg-gradient-to-br from-primary to-primary/80"
                animate={{ rotate: [0, -3, 0, 3, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-8 rounded-3xl bg-void flex items-center justify-center border border-snow/10"
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              >
                
                {/* --- BAGIAN INI YANG DIGANTI --- */}
                {/* Menampilkan Gambar Logo Ikon */}
                <motion.div
                  className="w-2/3 h-2/3 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <img 
                        src={logoIcon} 
                        alt="Vascode Logo" 
                        className="w-full h-full object-contain drop-shadow-2xl"
                    />
                </motion.div>
                {/* --- SELESAI PENGGANTIAN --- */}

              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-2xl">🎨</span>
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-2xl">💻</span>
              </motion.div>
              <motion.div
                className="absolute top-1/2 -right-8 w-12 h-12 rounded-xl bg-void/80 border border-snow/20 shadow-lg flex items-center justify-center"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-xl">📸</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;