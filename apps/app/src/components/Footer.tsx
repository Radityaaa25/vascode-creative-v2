import { motion } from 'framer-motion';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logoIcon from '@/assets/logo-icon.png';

const Footer = () => {
  const { t } = useLanguage();

  const socialLinks = [
    {
      icon: Instagram,
      href: 'https://www.instagram.com/vascode.creative?igsh=MWs2Z3c4d2gycWU3dA==',
      label: 'Instagram',
    },
    {
      icon: MessageCircle,
      href: 'https://wa.me/6281412234070',
      label: 'WhatsApp',
    },
    {
      icon: Mail,
      href: 'mailto:vascodecreative@gmail.com',
      label: 'Email',
    },
  ];

  return (
    <footer className="bg-void border-t border-snow/10">
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
              />
              
              {/* Bagian Teks Baru */}
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
            className="flex items-center gap-4"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-snow/5 border border-snow/10 flex items-center justify-center text-snow/60 hover:text-volt hover:border-volt/50 hover:bg-volt/10 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </motion.a>
            ))}
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
