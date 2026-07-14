import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

type Language = 'en' | 'id';

export type ContentStats = { label: string; value: string }[];
export type ContentService = { icon: string; title: string; description: string; waTemplate: string };
export type ContentProject = { id: string; title: string; description: string; category: string; image: string; link?: string; techStack?: string; projectUrl?: string };
export type ContentContact = { whatsapp: string; email: string; instagram: string };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  content: {
    stats: ContentStats;
    services: ContentService[];
    projects: ContentProject[];
    contact: ContentContact;
    categories: string[];
  };
  loading: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home', 'nav.services': 'Services', 'nav.about': 'About',
    'nav.portfolio': 'Portfolio', 'nav.contact': 'Contact',
    'hero.tagline': 'Creative Agency & Production House',
    'hero.title1': 'We Create', 'hero.title2': 'Digital Excellence',
    'hero.description': 'Transform your brand with stunning websites, captivating video content, and creative designs that make an impact.',
    'hero.cta1': 'Start Your Project', 'hero.cta2': 'View Our Work',
    'about.subtitle': 'About Us', 'about.title': 'Crafting Digital Experiences Since Day One',
    'about.description': 'Vascode Creative is a modern creative agency & production house dedicated to helping brands tell their stories through compelling digital experiences. We blend creativity with strategy to deliver results that matter.',
    'about.stat1.value': '50+', 'about.stat1.label': 'Projects Completed',
    'about.stat2.value': '30+', 'about.stat2.label': 'Happy Clients',
    'about.stat3.value': '100%', 'about.stat3.label': 'Satisfaction Rate',
    'services.subtitle': 'Our Services', 'services.title': 'What We Do Best',
    'services.description': 'From concept to creation, we deliver comprehensive digital solutions tailored to your needs.',
    'services.web.title': 'Website Development', 'services.web.description': 'Custom, responsive websites that drive conversions and elevate your online presence.',
    'services.video.title': 'Video Ads Production', 'services.video.description': 'Eye-catching video content for Instagram, Reels, and TikTok that captures attention.',
    'services.photo.title': 'Photography & Videography', 'services.photo.description': 'Professional event and commercial photography that tells your story beautifully.',
    'services.editing.title': 'Video & Photo Editing', 'services.editing.description': 'Expert post-production services to make your content shine and stand out.',
    'services.design.title': 'Graphic Design', 'services.design.description': 'Creative visual designs that communicate your brand message effectively.',
    'services.book': 'Book Now',
    'portfolio.subtitle': 'Our Work', 'portfolio.title': 'Featured Projects',
    'portfolio.description': 'Explore our latest work and see how we help brands stand out.',
    'portfolio.all': 'All', 'portfolio.viewAll': 'View All', 'portfolio.back': 'Back', 'portfolio.view': 'View Project',
    'contact.subtitle': 'Get In Touch', 'contact.title': "Let's Create Something Amazing",
    'contact.description': "Ready to start your project? We'd love to hear from you. Reach out through WhatsApp or Instagram.",
    'contact.whatsapp': 'Chat on WhatsApp', 'contact.instagram': 'Follow on Instagram', 'contact.email': 'Email Us',
    'footer.tagline': 'Creating digital excellence, one project at a time.', 'footer.rights': 'All rights reserved.',
  },
  id: {
    'nav.home': 'Beranda', 'nav.services': 'Layanan', 'nav.about': 'Tentang',
    'nav.portfolio': 'Portofolio', 'nav.contact': 'Kontak',
    'hero.tagline': 'Agensi Kreatif & Production House',
    'hero.title1': 'Kami Ciptakan', 'hero.title2': 'Keunggulan Digital',
    'hero.description': 'Transformasi brand Anda dengan website memukau, konten video memikat, dan desain kreatif yang berdampak.',
    'hero.cta1': 'Mulai Proyek Anda', 'hero.cta2': 'Lihat Karya Kami',
    'about.subtitle': 'Tentang Kami', 'about.title': 'Menciptakan Pengalaman Digital Sejak Hari Pertama',
    'about.description': 'Vascode Creative adalah agensi kreatif & production house modern yang berdedikasi membantu brand bercerita melalui pengalaman digital yang memikat. Kami memadukan kreativitas dengan strategi untuk memberikan hasil yang berarti.',
    'about.stat1.value': '50+', 'about.stat1.label': 'Proyek Selesai',
    'about.stat2.value': '30+', 'about.stat2.label': 'Klien Puas',
    'about.stat3.value': '100%', 'about.stat3.label': 'Tingkat Kepuasan',
    'services.subtitle': 'Layanan Kami', 'services.title': 'Yang Kami Kuasai',
    'services.description': 'Dari konsep hingga kreasi, kami memberikan solusi digital komprehensif sesuai kebutuhan Anda.',
    'services.web.title': 'Pembuatan Website', 'services.web.description': 'Website custom dan responsif yang meningkatkan konversi dan kehadiran online Anda.',
    'services.video.title': 'Produksi Video Ads', 'services.video.description': 'Konten video menarik untuk Instagram, Reels, dan TikTok yang memikat perhatian.',
    'services.photo.title': 'Fotografi & Videografi', 'services.photo.description': 'Fotografi profesional untuk event dan komersial yang menceritakan kisah Anda dengan indah.',
    'services.editing.title': 'Editing Video & Foto', 'services.editing.description': 'Layanan post-produksi ahli untuk membuat konten Anda bersinar dan menonjol.',
    'services.design.title': 'Desain Grafis', 'services.design.description': 'Desain visual kreatif yang mengkomunikasikan pesan brand Anda secara efektif.',
    'services.book': 'Pesan Sekarang',
    'portfolio.subtitle': 'Karya Kami', 'portfolio.title': 'Proyek Unggulan',
    'portfolio.description': 'Jelajahi karya terbaru kami dan lihat bagaimana kami membantu brand tampil beda.',
    'portfolio.all': 'Semua', 'portfolio.viewAll': 'Lihat Semua', 'portfolio.back': 'Kembali', 'portfolio.view': 'Lihat Proyek',
    'contact.subtitle': 'Hubungi Kami', 'contact.title': 'Mari Ciptakan Sesuatu yang Luar Biasa',
    'contact.description': 'Siap memulai proyek Anda? Kami senang mendengar dari Anda. Hubungi kami melalui WhatsApp atau Instagram.',
    'contact.whatsapp': 'Chat di WhatsApp', 'contact.instagram': 'Follow di Instagram', 'contact.email': 'Email Kami',
    'footer.tagline': 'Menciptakan keunggulan digital, satu proyek dalam satu waktu.', 'footer.rights': 'Hak cipta dilindungi.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function splitTitle(fullTitle: string): [string, string] {
  const words = fullTitle.trim().split(/\s+/);
  if (words.length <= 1) return [fullTitle, ''];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('id');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [statsRaw, setStatsRaw] = useState<any[]>([]);
  const [servicesRaw, setServicesRaw] = useState<any[]>([]);
  const [projectsRaw, setProjectsRaw] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const [settingsRes, statsRes, servicesRes, projectsRes] = await Promise.all([
          supabase.from('settings').select('*'),
          supabase.from('stats').select('*').order('order_index'),
          supabase.from('services').select('*').order('order_index'),
          supabase.from('projects').select('*').order('order_index'),
        ]);

        if (settingsRes.data) {
          const map: Record<string, string> = {};
          settingsRes.data.forEach((s: any) => { map[s.key] = s.value });
          setSettings(map);

          const raw = map['portfolio_categories'];
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                const names = typeof parsed[0] === 'string'
                  ? parsed
                  : parsed.filter((c: any) => c.visible).map((c: any) => c.name);
                setCategories(names.length > 0 ? names : ["Website", "Foto/Video", "Desain", "Editing Video", "Lainnya"]);
              }
            } catch { setCategories(["Website", "Foto/Video", "Desain", "Editing Video", "Lainnya"]) }
          } else {
            setCategories(["Website", "Foto/Video", "Desain", "Editing Video", "Lainnya"])
          }
        }
        if (statsRes.data) setStatsRaw(statsRes.data);
        if (servicesRes.data) setServicesRaw(servicesRes.data);
        if (projectsRes.data) setProjectsRaw(projectsRes.data);
      } catch (e) {
        console.error('Failed to fetch content:', e);
      }
      setLoading(false);
    }
    fetchContent();
  }, []);

  const t = (key: string): string => {
    const suffix = language === 'id' ? 'id' : 'en';
    const settingKey = `${key.replace('.', '_')}_${suffix}`;

    if (['hero.title1', 'hero.title2'].includes(key)) {
      const fullTitle = settings[`hero_title_${suffix}`];
      if (fullTitle) {
        const [p1, p2] = splitTitle(fullTitle);
        return key === 'hero.title1' ? p1 : p2;
      }
    }

    if (key === 'hero.description' && settings[`hero_desc_${suffix}`]) return settings[`hero_desc_${suffix}`];
    if (key === 'hero.cta1' && settings[`hero_cta1_${suffix}`]) return settings[`hero_cta1_${suffix}`];
    if (key === 'hero.cta2' && settings[`hero_cta2_${suffix}`]) return settings[`hero_cta2_${suffix}`];

    return translations[language][key] || key;
  };

  const content = useMemo(() => {
    const suffix = language === 'id' ? 'id' : 'en';

    const stats = statsRaw.map((s) => ({
      label: suffix === 'id' ? s.label_id : s.label_en,
      value: s.value,
    }));

    const services = servicesRaw.map((s) => ({
      icon: s.icon,
      title: suffix === 'id' ? s.title_id : s.title_en,
      description: suffix === 'id' ? s.description_id : s.description_en,
      waTemplate: suffix === 'id' ? s.wa_template_id : s.wa_template_en,
    }));

    const projects = projectsRaw.map((p) => ({
      id: p.id,
      title: suffix === 'id' ? p.title_id : p.title_en,
      description: suffix === 'id' ? p.description_id : p.description_en,
      category: p.category || 'Other',
      image: p.image_url || '',
      link: p.project_url || undefined,
      techStack: p.tech_stack || undefined,
      projectUrl: p.project_url || undefined,
    }));

    const contact = {
      whatsapp: (settings.contact_whatsapp || '+6281234567890').replace(/^\+/, ''),
      email: settings.contact_email || 'vascodecreative@gmail.com',
      instagram: settings.contact_instagram || 'vascode.creative',
    };

    return { stats, services, projects, contact, categories };
  }, [language, settings, statsRaw, servicesRaw, projectsRaw, categories]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, content, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
