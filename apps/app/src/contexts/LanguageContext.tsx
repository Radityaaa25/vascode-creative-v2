import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.portfolio': 'Portfolio',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.tagline': 'Creative Agency & Production House',
    'hero.title1': 'We Create',
    'hero.title2': 'Digital Excellence',
    'hero.description': 'Transform your brand with stunning websites, captivating video content, and creative designs that make an impact.',
    'hero.cta1': 'Start Your Project',
    'hero.cta2': 'View Our Work',
    
    // About
    'about.subtitle': 'About Us',
    'about.title': 'Crafting Digital Experiences Since Day One',
    'about.description': 'Vascode Creative is a modern creative agency & production house dedicated to helping brands tell their stories through compelling digital experiences. We blend creativity with strategy to deliver results that matter.',
    'about.stat1.value': '50+',
    'about.stat1.label': 'Projects Completed',
    'about.stat2.value': '30+',
    'about.stat2.label': 'Happy Clients',
    'about.stat3.value': '100%',
    'about.stat3.label': 'Satisfaction Rate',
    
    // Services
    'services.subtitle': 'Our Services',
    'services.title': 'What We Do Best',
    'services.description': 'From concept to creation, we deliver comprehensive digital solutions tailored to your needs.',
    'services.web.title': 'Website Development',
    'services.web.description': 'Custom, responsive websites that drive conversions and elevate your online presence.',
    'services.video.title': 'Video Ads Production',
    'services.video.description': 'Eye-catching video content for Instagram, Reels, and TikTok that captures attention.',
    'services.photo.title': 'Photography & Videography',
    'services.photo.description': 'Professional event and commercial photography that tells your story beautifully.',
    'services.editing.title': 'Video & Photo Editing',
    'services.editing.description': 'Expert post-production services to make your content shine and stand out.',
    'services.design.title': 'Graphic Design',
    'services.design.description': 'Creative visual designs that communicate your brand message effectively.',
    'services.book': 'Book Now',
    
    // Portfolio
    'portfolio.subtitle': 'Our Work',
    'portfolio.title': 'Featured Projects',
    'portfolio.description': 'Explore our latest work and see how we help brands stand out.',
    'portfolio.all': 'All',
    'portfolio.website': 'Website',
    'portfolio.photo': 'Photo / Video',
    'portfolio.design': 'Design',
    'portfolio.other': 'Other',
    'portfolio.view': 'View Project',
    
    // Contact
    'contact.subtitle': 'Get In Touch',
    'contact.title': "Let's Create Something Amazing",
    'contact.description': "Ready to start your project? We'd love to hear from you. Reach out through WhatsApp or Instagram.",
    'contact.whatsapp': 'Chat on WhatsApp',
    'contact.instagram': 'Follow on Instagram',
    'contact.email': 'Email Us',
    
    // Footer
    'footer.tagline': 'Creating digital excellence, one project at a time.',
    'footer.rights': 'All rights reserved.',
  },
  id: {
    // Navbar
    'nav.home': 'Beranda',
    'nav.services': 'Layanan',
    'nav.about': 'Tentang',
    'nav.portfolio': 'Portofolio',
    'nav.contact': 'Kontak',
    
    // Hero
    'hero.tagline': 'Agensi Kreatif & Production House',
    'hero.title1': 'Kami Ciptakan',
    'hero.title2': 'Keunggulan Digital',
    'hero.description': 'Transformasi brand Anda dengan website memukau, konten video memikat, dan desain kreatif yang berdampak.',
    'hero.cta1': 'Mulai Proyek Anda',
    'hero.cta2': 'Lihat Karya Kami',
    
    // About
    'about.subtitle': 'Tentang Kami',
    'about.title': 'Menciptakan Pengalaman Digital Sejak Hari Pertama',
    'about.description': 'Vascode Creative adalah agensi kreatif & production house modern yang berdedikasi membantu brand bercerita melalui pengalaman digital yang memikat. Kami memadukan kreativitas dengan strategi untuk memberikan hasil yang berarti.',
    'about.stat1.value': '50+',
    'about.stat1.label': 'Proyek Selesai',
    'about.stat2.value': '30+',
    'about.stat2.label': 'Klien Puas',
    'about.stat3.value': '100%',
    'about.stat3.label': 'Tingkat Kepuasan',
    
    // Services
    'services.subtitle': 'Layanan Kami',
    'services.title': 'Yang Kami Kuasai',
    'services.description': 'Dari konsep hingga kreasi, kami memberikan solusi digital komprehensif sesuai kebutuhan Anda.',
    'services.web.title': 'Pembuatan Website',
    'services.web.description': 'Website custom dan responsif yang meningkatkan konversi dan kehadiran online Anda.',
    'services.video.title': 'Produksi Video Ads',
    'services.video.description': 'Konten video menarik untuk Instagram, Reels, dan TikTok yang memikat perhatian.',
    'services.photo.title': 'Fotografi & Videografi',
    'services.photo.description': 'Fotografi profesional untuk event dan komersial yang menceritakan kisah Anda dengan indah.',
    'services.editing.title': 'Editing Video & Foto',
    'services.editing.description': 'Layanan post-produksi ahli untuk membuat konten Anda bersinar dan menonjol.',
    'services.design.title': 'Desain Grafis',
    'services.design.description': 'Desain visual kreatif yang mengkomunikasikan pesan brand Anda secara efektif.',
    'services.book': 'Pesan Sekarang',
    
    // Portfolio
    'portfolio.subtitle': 'Karya Kami',
    'portfolio.title': 'Proyek Unggulan',
    'portfolio.description': 'Jelajahi karya terbaru kami dan lihat bagaimana kami membantu brand tampil beda.',
    'portfolio.all': 'Semua',
    'portfolio.website': 'Website',
    'portfolio.photo': 'Foto / Video',
    'portfolio.design': 'Desain',
    'portfolio.other': 'Lainnya',
    'portfolio.view': 'Lihat Proyek',
    
    // Contact
    'contact.subtitle': 'Hubungi Kami',
    'contact.title': 'Mari Ciptakan Sesuatu yang Luar Biasa',
    'contact.description': 'Siap memulai proyek Anda? Kami senang mendengar dari Anda. Hubungi kami melalui WhatsApp atau Instagram.',
    'contact.whatsapp': 'Chat di WhatsApp',
    'contact.instagram': 'Follow di Instagram',
    'contact.email': 'Email Kami',
    
    // Footer
    'footer.tagline': 'Menciptakan keunggulan digital, satu proyek dalam satu waktu.',
    'footer.rights': 'Hak cipta dilindungi.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
