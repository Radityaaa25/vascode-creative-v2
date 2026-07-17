import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getViewportConfig } from '@/lib/animations';

const DEFAULT_FAQ = [
  { question_id: 'Bagaimana cara memesan layanan?', question_en: 'How do I order a service?', answer_id: 'Anda bisa melihat portofolio kami, pilih layanan yang diinginkan, lalu klik tombol "Pesan Sekarang" untuk terhubung dengan kami via WhatsApp. Tim kami akan merespon dengan cepat!', answer_en: 'Browse our portfolio, choose a service, and click "Book Now" to connect with us via WhatsApp. Our team will respond promptly!' },
  { question_id: 'Berapa lama proses pengerjaan?', question_en: 'How long does it take?', answer_id: 'Waktu pengerjaan bervariasi tergantung kompleksitas proyek. Untuk website biasanya 1-2 minggu, untuk video 3-7 hari, dan desain 1-3 hari. Diskusikan dengan kami untuk estimasi yang lebih akurat.', answer_en: 'Timeline depends on project complexity. Websites typically take 1-2 weeks, videos 3-7 days, and designs 1-3 days. Discuss with us for a more accurate estimate.' },
  { question_id: 'Apakah bisa revisi?', question_en: 'Can I request revisions?', answer_id: 'Tentu saja! Kami menyediakan revisi untuk memastikan hasil akhir sesuai dengan keinginan Anda. Jumlah revisi akan disepakati di awal diskusi.', answer_en: 'Absolutely! We provide revisions to ensure the final result matches your expectations. The number of revisions will be agreed upon at the start.' },
  { question_id: 'Bagaimana sistem pembayarannya?', question_en: 'What is the payment system?', answer_id: 'Kami menerapkan sistem pembayaran 50% di awal sebagai DP dan 50% setelah proyek selesai. Metode pembayaran bisa melalui transfer bank, E-Wallet, atau QRIS.', answer_en: 'We apply a 50% upfront payment as DP and 50% upon project completion. Payment methods include bank transfer, E-Wallet, or QRIS.' },
  { question_id: 'Apakah ada garansi?', question_en: 'Is there a warranty?', answer_id: 'Ya, kami memberikan garansi kepuasan. Jika hasil belum sesuai, kami akan melakukan perbaikan hingga Anda puas. Kepuasan klien adalah prioritas utama kami.', answer_en: 'Yes, we provide a satisfaction guarantee. If the results are not as expected, we will make improvements until you are satisfied. Client satisfaction is our top priority.' },
];

const FAQ = () => {
  const { t, language, content } = useLanguage();
  const ref = useRef(null);
  const viewportConfig = getViewportConfig();
  const isInView = useInView(ref, { once: true, margin: viewportConfig.margin });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = content.faq.length > 0 ? content.faq : DEFAULT_FAQ;
  const isID = language === 'id';

  return (
    <section id="faq" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background blur elements */}
      <div className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-medium text-sm mb-4">
            {t('faq.title')}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-snow">
            {isID ? 'Pertanyaan Umum' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-snow/50 text-base mt-3 max-w-lg mx-auto">
            {isID
              ? 'Temukan jawaban untuk pertanyaan yang sering diajukan.'
              : 'Find answers to commonly asked questions.'}
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const question = isID ? faq.question_id : faq.question_en;
            const answer = isID ? faq.answer_id : faq.answer_en;
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <motion.button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl border border-snow/10 bg-snow/[0.03] p-5 text-left transition-all duration-300 hover:border-primary/30 hover:bg-snow/[0.06]"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-snow font-medium text-base md:text-lg pr-4 flex-1">
                    {question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? 1.1 : 1 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.div>
                </motion.button>
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ y: -4 }}
                    animate={{ y: isOpen ? 0 : -4 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 py-4 text-snow/60 text-sm md:text-base leading-relaxed border-x border-b border-snow/10 rounded-b-2xl bg-snow/[0.02]"
                  >
                    {answer}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
