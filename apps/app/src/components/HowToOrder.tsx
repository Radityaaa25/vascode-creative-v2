import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowRight, ExternalLink, FileText, MessageSquare,
  CreditCard, Settings, CheckCircle2, Sparkles, Eye, Layout, MessageCircle, Check,
} from 'lucide-react';

const FALLBACK_ICONS: Record<string, React.ComponentType<{ className?: string, size?: number }>> = {
  ArrowRight, ExternalLink, FileText, MessageSquare, CreditCard,
  Settings, CheckCircle2, Sparkles, Eye, Layout, MessageCircle,
};

const DEFAULT_STEPS = [
  { step_number: 1,  title_id: 'Lihat Portofolio',    title_en: 'Browse Portfolio',      description_id: 'Jelajahi hasil proyek yang telah kami selesaikan untuk melihat langsung kualitas dan gaya karya kami.',   description_en: 'Explore our completed projects to see the quality and style of our work firsthand.',   icon: 'Eye' },
  { step_number: 2,  title_id: 'Pilih Layanan',        title_en: 'Choose Service',        description_id: 'Tentukan layanan yang sesuai dengan kebutuhan Anda, mulai dari Website, Video, Desain hingga Editing.', description_en: 'Select the service that fits your needs, from Websites, Video, Design to Editing.', icon: 'Layout' },
  { step_number: 3,  title_id: 'Pesan Sekarang',       title_en: 'Book Now',              description_id: 'Klik tombol "Pesan Sekarang" untuk memulai diskusi dengan tim kami melalui WhatsApp.',                  description_en: 'Click the "Book Now" button to start a discussion with our team via WhatsApp.',       icon: 'MessageCircle' },
  { step_number: 4,  title_id: 'Dialihkan ke WhatsApp', title_en: 'Redirected to WhatsApp', description_id: 'Anda akan otomatis dialihkan ke WhatsApp dengan template pesan yang sudah kami siapkan.',           description_en: 'You will be automatically redirected to WhatsApp with a pre-filled message template.', icon: 'ExternalLink' },
  { step_number: 5,  title_id: 'Lengkapi Data',        title_en: 'Fill In Details',       description_id: 'Isi data-data yang diperlukan agar kami bisa memahami kebutuhan dan keinginan Anda.',                  description_en: 'Fill in the required details so we can understand your needs and preferences.',       icon: 'FileText' },
  { step_number: 6,  title_id: 'Diskusi & Sepakat',    title_en: 'Discuss & Agree',       description_id: 'Diskusikan harga, jadwal, lokasi, dan detail layanan lainnya langsung dengan tim kami.',                description_en: 'Discuss pricing, schedule, location, and other service details directly with our team.', icon: 'MessageSquare' },
  { step_number: 7,  title_id: 'Lakukan Pembayaran',   title_en: 'Make Payment',          description_id: 'Lakukan pembayaran sesuai dengan kesepakatan yang telah didiskusikan sebelumnya.',                      description_en: 'Make the payment according to the agreement that was discussed earlier.',            icon: 'CreditCard' },
  { step_number: 8,  title_id: 'Proses Pengerjaan',    title_en: 'Production Process',    description_id: 'Tim kami akan mulai mengerjakan proyek Anda dengan penuh dedikasi dan perhatian pada detail.',         description_en: 'Our team will start working on your project with full dedication and attention to detail.', icon: 'Settings' },
  { step_number: 9,  title_id: 'Terima Hasil',         title_en: 'Receive Results',       description_id: 'Hasil proyek akan dikirimkan kepada Anda untuk direview dan diberikan masukan.',                         description_en: 'The project results will be sent to you for review and feedback.',                  icon: 'CheckCircle2' },
  { step_number: 10, title_id: 'Selesai!',              title_en: 'Done!',                 description_id: 'Proyek selesai. Mudah bukan? Nikmati hasil karya terbaik dari Vascode Creative.',                      description_en: 'Project completed. Easy, right? Enjoy the best work from Vascode Creative.',        icon: 'Sparkles' },
];

function generateWindingPath(points: { x: number; y: number }[], isMobile: boolean): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const dy = p1.y - p0.y;
    
    if (isMobile) {
      // Subtle wave to the right on mobile so it doesn't cross text
      const dx = 15; 
      d += ` C ${p0.x + dx},${p0.y + dy * 0.3} ${p1.x + dx},${p1.y - dy * 0.3} ${p1.x},${p1.y}`;
    } else {
      // Winding S-curve left and right following the text cards
      const bulge = i % 2 === 1 ? 1 : -1;
      const dx = 140 * bulge; 
      d += ` C ${p0.x - dx},${p0.y + dy * 0.4} ${p1.x + dx},${p1.y - dy * 0.4} ${p1.x},${p1.y}`;
    }
  }
  return d;
}

const HowToOrder = () => {
  const { t, language, content } = useLanguage();
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [size, setSize] = useState({ w: 800, h: 1200 });
  const [isMobile, setIsMobile] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(0);

  const measures = useCallback(() => {
    const container = stepsContainerRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const circles = container.querySelectorAll<HTMLElement>('[data-step-circle]');
    const pts: { x: number; y: number }[] = [];
    circles.forEach((el) => {
      const r = el.getBoundingClientRect();
      pts.push({ x: r.left + r.width / 2 - cr.left, y: r.top + r.height / 2 - cr.top });
    });
    if (pts.length > 1) setPoints(pts);
    setSize({ w: Math.round(cr.width), h: Math.round(cr.height) });
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    measures();
    window.addEventListener('resize', measures);
    const ro = new ResizeObserver(measures);
    if (stepsContainerRef.current) ro.observe(stepsContainerRef.current);
    return () => {
      window.removeEventListener('resize', measures);
      ro.disconnect();
    };
  }, [measures]);

  const windingPath = useMemo(() => generateWindingPath(points, isMobile), [points, isMobile]);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      if (len > 0) setPathLen(len);
    }
  }, [windingPath]);

  const { scrollYProgress } = useScroll({
    target: stepsContainerRef,
    offset: ['start center', 'end center'],
  });

  const dashOffset = useTransform(scrollYProgress, [0, 1], [pathLen, 0]);

  const steps = content.howToOrderSteps?.length > 0 ? content.howToOrderSteps : DEFAULT_STEPS;
  const isID = language === 'id';
  const sortedSteps = useMemo(
    () => [...steps].sort((a, b) => a.step_number - b.step_number),
    [steps]
  );

  return (
    <section id="how-to-order" className="relative z-10 mx-auto w-full max-w-[1200px] px-4 py-24 md:px-6 overflow-hidden">
      
      {/* Glow Backgrounds */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-volt/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mb-20 text-center relative z-10">
        <span className="mb-4 inline-block rounded-full bg-volt/20 px-4 py-1.5 text-xs font-bold tracking-widest text-volt">
          {t('howtoorder.title')}
        </span>
        <h2 className="mb-4 text-3xl font-bold text-snow md:text-4xl lg:text-5xl">
          {isID ? 'Alur Mudah Bersama Kami' : 'Simple Process With Us'}
        </h2>
        <p className="mx-auto max-w-2xl text-base text-snow/60 md:text-lg">
          {isID
            ? 'Ikuti langkah-langkah sederhana ini untuk memulai proyek Anda.'
            : 'Follow these simple steps to start your project.'}
        </p>
      </div>

      <div ref={stepsContainerRef} className="relative mx-auto max-w-5xl py-4">
        
        {/* Winding animated line SVG */}
        {points.length > 1 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            preserveAspectRatio="none"
            viewBox={`0 0 ${size.w} ${size.h}`}
          >
            {/* Background inactive line */}
            <path 
              d={windingPath} 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth={4} 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Glow effect */}
            <motion.path
              d={windingPath}
              stroke="hsl(77 100% 50%)"
              strokeWidth={14}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={pathLen}
              style={{ strokeDashoffset: dashOffset, opacity: 0.15 }}
            />
            {/* Active animated line */}
            <motion.path
              ref={pathRef}
              d={windingPath}
              stroke="hsl(77 100% 50%)" // Volt color
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pathLen}
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>
        )}

        {/* Steps */}
        <div className="relative flex flex-col gap-16 md:gap-24">
          {sortedSteps.map((step, index) => {
            const IconComp = FALLBACK_ICONS[step.icon] || ArrowRight;
            const isEven = index % 2 === 0;

            return (
              <div 
                key={step.step_number} 
                className={`flex flex-col items-start gap-4 pl-20 md:flex-row md:items-center md:justify-between md:gap-8 md:pl-0 ${!isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -20 : 20, y: 10 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5 }}
                  className={`md:w-5/12 ${isEven ? 'md:text-right' : 'md:text-left'}`}
                >
                  <div className="mb-2 flex items-center gap-3 md:hidden">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-volt text-sm font-bold text-void">
                      {step.step_number}
                    </span>
                    <h3 className="text-xl font-bold text-snow">
                      {isID ? step.title_id : step.title_en}
                    </h3>
                  </div>
                  <h3 className="hidden md:block mb-3 text-2xl font-bold text-snow">
                    {step.step_number}. {isID ? step.title_id : step.title_en}
                  </h3>
                  <p className="text-base text-snow/70 leading-relaxed bg-void/50 backdrop-blur-sm p-4 rounded-xl border border-snow/5 md:bg-transparent md:backdrop-blur-none md:p-0 md:border-none">
                    {isID ? step.description_id : step.description_en}
                  </p>
                </motion.div>

                {/* Circle Icon */}
                <motion.div 
                  data-step-circle
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, type: 'spring' }}
                  className="absolute left-6 md:left-1/2 z-10 flex h-12 w-12 md:h-16 md:w-16 -translate-x-1/2 items-center justify-center rounded-full border-4 border-void bg-snow/5 text-volt shadow-lg shadow-volt/10 transition-transform hover:scale-110 backdrop-blur-md"
                >
                  <IconComp size={24} className="md:w-7 md:h-7" />
                </motion.div>

                {/* Empty Space for layout balance */}
                <div className="hidden md:block md:w-5/12"></div>
              </div>
            );
          })}
        </div>
      </div>
        
      {/* Completion Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative text-center mt-20 pt-8"
      >
        <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-volt/20 to-primary/20 px-6 py-3 md:px-8 md:py-4 border border-volt/20">
          <Check className="h-5 w-5 text-volt" />
          <span className="text-base md:text-lg font-bold text-snow">
            {isID ? 'Selesai — Mudah bukan?' : 'Done — Easy, right?'}
          </span>
        </div>
      </motion.div>
    </section>
  );
};

export default HowToOrder;
