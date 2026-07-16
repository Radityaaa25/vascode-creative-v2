import { useId } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import logoIcon from '@/assets/logo-icon.png';
import { Globe, Video, Camera, Palette, Film, Monitor, Smartphone, PenTool, Image, Music, Code, Layout, Megaphone, BookOpen, ShoppingBag, Users, MessageCircle, Mail, Instagram, MessageSquare } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Video, Camera, Palette, Film, Monitor, Smartphone,
  PenTool, Image, Music, Code, Layout, Megaphone, BookOpen,
  ShoppingBag, Users, MessageCircle, Mail, Instagram, MessageSquare,
};

const DEFAULT_SOCIALS = [
  { platform: 'Instagram', icon: 'Instagram', url: '#', label_id: 'Instagram', label_en: 'Instagram' },
  { platform: 'WhatsApp', icon: 'MessageCircle', url: '#', label_id: 'WhatsApp', label_en: 'WhatsApp' },
  { platform: 'Email', icon: 'Mail', url: '#', label_id: 'Email', label_en: 'Email' },
];

const SOCIAL_COLORS: Record<string, string> = {
  Instagram: '#e4405f',
  WhatsApp: '#25D366',
  Email: '#4285F4',
};

function SocialIcon({ icon, color }: { icon: string; color?: string }) {
  const IconComp = ICON_MAP[icon];
  if (!IconComp) return null;
  return <IconComp className="h-5 w-5" style={{ color: color || '#000' }} />;
}

const Footer = () => {
  const { t, content } = useLanguage();
  const uid = useId().replace(/[:.]/g, '');

  const socials = content.socialLinks.length > 0 ? content.socialLinks : DEFAULT_SOCIALS;

  return (
    <footer className="border-t border-snow/10">
      <style>{`
        .${uid}-wrapper {
          display: inline-flex;
          flex-wrap: wrap;
          list-style: none;
          justify-content: center;
          gap: 0.5rem;
        }
        .${uid}-wrapper .${uid}-icon {
          position: relative;
          background: #fff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .${uid}-wrapper .${uid}-icon svg {
          color: #000;
        }
        .${uid}-wrapper .${uid}-tooltip {
          position: absolute;
          top: 0;
          font-size: 14px;
          background: #fff;
          color: #fff;
          padding: 5px 8px;
          border-radius: 5px;
          box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          white-space: nowrap;
        }
        .${uid}-wrapper .${uid}-tooltip::before {
          position: absolute;
          content: "";
          height: 8px;
          width: 8px;
          background: #fff;
          bottom: -3px;
          left: 50%;
          transform: translate(-50%) rotate(45deg);
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .${uid}-wrapper .${uid}-icon:hover .${uid}-tooltip {
          top: -45px;
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        .${uid}-wrapper .${uid}-icon:hover,
        .${uid}-wrapper .${uid}-icon:hover .${uid}-tooltip,
        .${uid}-wrapper .${uid}-icon:hover .${uid}-tooltip::before {
          background: var(--soc-color) !important;
          color: #fff !important;
        }
        .${uid}-wrapper .${uid}-icon:hover svg {
          color: #fff !important;
        }
      `}</style>
      <div className="container-custom py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center md:items-start gap-4"
          >
            <div className="flex items-center gap-3">
              <motion.img
                src={logoIcon}
                alt="Vascode Creative"
                className="h-10 w-10 object-contain"
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.3 }}
                loading="lazy" width={40} height={40}
              />
              <div className="flex flex-col items-start leading-none">
                <span className="font-bold text-xl text-snow tracking-tight">
                  Vas<span className="text-volt">Code</span>
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-snow/60 font-medium ml-0.5 mt-0.5">
                  Creative
                </span>
              </div>
            </div>
            <p className="text-snow/60 text-sm max-w-xs text-center md:text-left">
              {t('footer.tagline')}
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ul className={`${uid}-wrapper`}>
              {socials.map((s) => {
                const color = SOCIAL_COLORS[s.platform] || '#666';
                return (
                  <li key={s.platform}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${uid}-icon`}
                      style={{ '--soc-color': color } as React.CSSProperties}
                    >
                      <SocialIcon icon={s.icon} color={undefined} />
                      <span className={`${uid}-tooltip`}>{s.label_id}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 pt-8 border-t border-snow/10 text-center"
        >
          <p className="text-snow/40 text-sm">
            © {new Date().getFullYear()} Vascode Creative. {t('footer.rights')}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
