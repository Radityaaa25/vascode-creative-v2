import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import logoIcon from '@/assets/logo-icon.png';
import { AnimatedStatValue } from './AnimatedStatValue';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const slideLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }
const slideRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }
const statScale = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }

const About = () => {
  const { t, content } = useLanguage();

  const stats = content.stats.length > 0 ? content.stats : [
    { value: t('about.stat1.value'), label: t('about.stat1.label') },
    { value: t('about.stat2.value'), label: t('about.stat2.label') },
    { value: t('about.stat3.value'), label: t('about.stat3.label') },
  ];

  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Content */}
          <motion.div variants={slideLeft}>
            <motion.span variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-medium text-sm mb-4">
              {t('about.subtitle')}
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold text-snow mb-6 leading-tight">
              {t('about.title')}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-snow/70 text-lg leading-relaxed mb-8">
              {t('about.description')}
            </motion.p>
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <motion.div key={stat.value} variants={statScale} className="text-center p-4 rounded-2xl bg-snow/5 border border-snow/10">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1"><AnimatedStatValue value={stat.value} /></div>
                  <div className="text-sm text-snow/60">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Element */}
          <motion.div variants={slideRight} className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="about-r1 absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20" />
              <div className="about-r2 absolute inset-4 rounded-3xl bg-gradient-to-br from-primary to-primary/80" />
              <div className="about-r3 absolute inset-8 rounded-3xl bg-void flex items-center justify-center border border-snow/10">
                <div className="about-logo w-2/3 h-2/3 flex items-center justify-center">
                  <img src={logoIcon} alt="Vascode Logo" className="w-full h-full object-contain drop-shadow-2xl" loading="lazy" width={400} height={400} />
                </div>
              </div>
              <div className="about-f1 absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎨</span>
              </div>
              <div className="about-f2 absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <span className="text-2xl">💻</span>
              </div>
              <div className="about-f3 absolute top-1/2 -right-8 w-12 h-12 rounded-xl bg-void/80 border border-snow/20 shadow-lg flex items-center justify-center">
                <span className="text-xl">📸</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <style>{`
        .about-r1 { animation: ar1 20s ease-in-out infinite; }
        .about-r2 { animation: ar2 15s ease-in-out infinite; }
        .about-r3 { animation: ar3 10s ease-in-out infinite; }
        .about-logo { animation: al 4s ease-in-out infinite; }
        .about-f1 { animation: af1 3s ease-in-out infinite; }
        .about-f2 { animation: af2 4s ease-in-out infinite; }
        .about-f3 { animation: af3 3.5s ease-in-out infinite; }
        @keyframes ar1 { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(5deg)} 50%{transform:rotate(0deg)} 75%{transform:rotate(-5deg)} }
        @keyframes ar2 { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(-3deg)} 50%{transform:rotate(0deg)} 75%{transform:rotate(3deg)} }
        @keyframes ar3 { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(2deg)} 50%{transform:rotate(0deg)} 75%{transform:rotate(-2deg)} }
        @keyframes al { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes af1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes af2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
        @keyframes af3 { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
      `}</style>
    </section>
  );
};

export default About;
