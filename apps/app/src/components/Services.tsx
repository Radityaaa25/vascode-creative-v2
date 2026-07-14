import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Globe, Video, Camera, Palette, Film, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const services = [
    {
      icon: Globe,
      title: t('services.web.title'),
      description: t('services.web.description'),
      whatsappMessage:
        language === 'en'
          ? 'Hello Vascode Creative, I would like to book Website Development services.\n\nHere are my details:\nName:\nCompany/Brand:\nWebsite Type (e.g. Landing Page/Company Profile):\nReference/Inspiration:\nBudget Estimate:'
          : 'Halo Vascode Creative, saya ingin memesan layanan Pembuatan Website.\n\nBerikut detail saya:\nNama:\nNama Bisnis/Brand:\nJenis Website (misal: Landing Page/Profil Perusahaan):\nReferensi/Contoh Website:\nEstimasi Budget:',
    },
    {
      icon: Video,
      title: t('services.video.title'),
      description: t('services.video.description'),
      whatsappMessage:
        language === 'en'
          ? 'Hello Vascode Creative, I would like to book Video Ads Production services.\n\nHere are my details:\nName:\nProduct/Brand Name:\nVideo Duration (e.g. 15s/30s):\nTarget Platform (e.g. TikTok/IG Reels):\nReference:'
          : 'Halo Vascode Creative, saya ingin memesan layanan Produksi Video Ads.\n\nBerikut detail saya:\nNama:\nNama Produk/Brand:\nDurasi Video (misal: 15s/30s):\nPlatform (misal: TikTok/IG Reels):\nReferensi Video:',
    },
    {
      icon: Camera,
      title: t('services.photo.title'),
      description: t('services.photo.description'),
      whatsappMessage:
        language === 'en'
          ? 'Hello Vascode Creative, I would like to book Photography & Videography services.\n\nHere are my details:\nName:\nEvent Type:\nDate & Time:\nLocation:\nSpecial Request:'
          : 'Halo Vascode Creative, saya ingin memesan layanan Fotografi & Videografi.\n\nBerikut detail saya:\nNama:\nJenis Acara:\nTanggal & Jam:\nLokasi:\nRequest Khusus:',
    },
    {
      icon: Film,
      title: t('services.editing.title'),
      description: t('services.editing.description'),
      whatsappMessage:
        language === 'en'
          ? 'Hello Vascode Creative, I would like to book Video & Photo Editing services.\n\nHere are my details:\nName:\nNumber of Files:\nTotal Duration:\nDesired Editing Style:\nDeadline:'
          : 'Halo Vascode Creative, saya ingin memesan layanan Editing Video & Foto.\n\nBerikut detail saya:\nNama:\nJumlah File:\nTotal Durasi:\nGaya Editing yang diinginkan:\nDeadline:',
    },
    {
      icon: Palette,
      title: t('services.design.title'),
      description: t('services.design.description'),
      whatsappMessage:
        language === 'en'
          ? 'Hello Vascode Creative, I would like to book Graphic Design services.\n\nHere are my details:\nName:\nDesign Type (e.g. Logo/Feed/Banner):\nBrand Description:\nColor Preference:\nVisual Reference:'
          : 'Halo Vascode Creative, saya ingin memesan layanan Desain Grafis.\n\nBerikut detail saya:\nNama:\nJenis Desain (misal: Logo/Feed/Banner):\nDeskripsi Brand:\nPilihan Warna:\nReferensi Visual:',
    },
  ];

  const openWhatsApp = (message: string) => {
    // encodeURIComponent akan memastikan karakter enter (\n) terbaca dengan benar di URL WhatsApp
    window.open(
      `https://wa.me/6281412234070?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <section id="services" className="section-padding bg-void" ref={ref}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-medium text-sm mb-4"
          >
            {t('services.subtitle')}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-snow mb-4"
          >
            {t('services.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-snow/60 text-lg max-w-2xl mx-auto"
          >
            {t('services.description')}
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -8 }}
              className="group relative p-6 md:p-8 rounded-3xl bg-snow/5 border border-snow/10 hover:border-primary/50 transition-all duration-500"
            >
              {/* Icon */}
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 5 }}
              >
                <service.icon className="w-7 h-7 text-snow" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-snow mb-3">{service.title}</h3>
              <p className="text-snow/60 mb-6 leading-relaxed">{service.description}</p>

              {/* CTA */}
              <motion.button
                onClick={() => openWhatsApp(service.whatsappMessage)}
                className="flex items-center gap-2 text-volt font-medium group/btn"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('services.book')}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;