import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageCircle, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const openWhatsApp = () => {
    const message =
      language === 'en'
        ? "Hello Vascode Creative, I'm interested in discussing a project. Can we chat?"
        : 'Halo Vascode Creative, saya tertarik untuk mendiskusikan sebuah proyek. Bisakah kita mengobrol?';
    window.open(
      `https://wa.me/6281412234070?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      label: t('contact.whatsapp'),
      action: openWhatsApp,
      primary: true,
    },
    {
      icon: Instagram,
      label: t('contact.instagram'),
      action: () => window.open('https://www.instagram.com/vascode.creative?igsh=MWs2Z3c4d2gycWU3dA==', '_blank'),
      primary: false,
    },
    {
      icon: Mail,
      label: t('contact.email'),
      action: () => window.open('mailto:vascodecreative@gmail.com', '_blank'),
      primary: false,
    },
  ];

  return (
    <section id="contact" className="section-padding bg-void relative overflow-hidden" ref={ref}>
      {/* Background Elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-medium text-sm mb-4"
          >
            {t('contact.subtitle')}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-snow mb-6"
          >
            {t('contact.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-snow/60 text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            {t('contact.description')}
          </motion.p>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {contactMethods.map((method, index) => (
              <motion.button
                key={method.label}
                onClick={method.action}
                className={`group flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 w-full sm:w-auto justify-center ${
                  method.primary
                    ? 'bg-[#25D366] text-snow hover:shadow-lg hover:shadow-[#25D366]/30'
                    : 'border-2 border-snow/20 text-snow hover:bg-snow/5 hover:border-snow/40'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <method.icon className="w-5 h-5" />
                {method.label}
                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </motion.button>
            ))}
          </motion.div>

          {/* Email Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 pt-12 border-t border-snow/10"
          >
            <p className="text-snow/40 text-sm mb-2">Or email us directly at</p>
            <a
              href="mailto:vascodecreative@gmail.com"
              className="text-snow hover:text-volt transition-colors font-medium"
            >
              vascodecreative@gmail.com
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
