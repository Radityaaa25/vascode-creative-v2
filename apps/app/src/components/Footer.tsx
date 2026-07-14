import { useId } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import logoIcon from '@/assets/logo-icon.png';

const socials = [
  {
    name: 'Instagram',
    cls: 'instagram',
    color: '#e4405f',
    href: (c: { instagram: string }) => `https://www.instagram.com/${c.instagram}`,
    path: <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />,
    viewBox: '0 0 16 16',
  },
  {
    name: 'WhatsApp',
    cls: 'whatsapp',
    color: '#25D366',
    href: (c: { whatsapp: string }) => `https://wa.me/${c.whatsapp}`,
    path: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />,
    viewBox: '0 0 24 24',
  },
  {
    name: 'Email',
    cls: 'email',
    color: '#4285F4',
    href: (c: { email: string }) => `mailto:${c.email}`,
    path: <path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />,
    viewBox: '0 0 512 512',
  },
];

const Footer = () => {
  const { t, content } = useLanguage();
  const uid = useId().replace(/[:.]/g, '');

  return (
    <footer className="bg-void border-t border-snow/10">
      <style>{`
        .${uid}-wrapper {
          display: inline-flex;
          list-style: none;
          height: 120px;
          width: 100%;
          padding-top: 40px;
          justify-content: center;
        }
        .${uid}-wrapper .${uid}-icon {
          position: relative;
          background: #fff;
          border-radius: 50%;
          margin: 10px;
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
        }`}
        {socials.map((s) => `
        .${uid}-wrapper .${uid}-${s.cls}:hover,
        .${uid}-wrapper .${uid}-${s.cls}:hover .${uid}-tooltip,
        .${uid}-wrapper .${uid}-${s.cls}:hover .${uid}-tooltip::before {
          background: ${s.color} !important;
          color: #fff !important;
        }
        .${uid}-wrapper .${uid}-${s.cls}:hover svg {
          color: #fff !important;
        }`).join('')}
      </style>
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
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href(content.contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${uid}-icon ${uid}-${s.cls}`}
                  >
                    <svg viewBox={s.viewBox} height="1.2em" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      {s.path}
                    </svg>
                    <span className={`${uid}-tooltip`}>{s.name}</span>
                  </a>
                </li>
              ))}
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
