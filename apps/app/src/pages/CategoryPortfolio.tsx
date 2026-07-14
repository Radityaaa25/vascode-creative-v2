import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ArrowLeft } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

function CategoryPortfolioInner() {
  const { category } = useParams<{ category: string }>();
  const { t, content } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const catName = category ? decodeURIComponent(category) : '';
  const isAll = catName === 'all';

  const projects = isAll
    ? content.projects
    : content.projects.filter((p) => p.category === catName);

  const pageTitle = isAll ? 'All Projects' : `${catName} Projects`
  useEffect(() => { window.scrollTo(0, 0) }, [catName])

  return (
    <>
      <SEO title={pageTitle} canonical={`https://vascode.my.id/portfolio/${category}`} />
      <main id="main-content" className="min-h-screen overflow-x-hidden">
        <Navbar />
      <section className="section-padding bg-void pt-28">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <Link
              to="/#portfolio"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-snow/50 transition-colors hover:text-snow"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('portfolio.back')}
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-snow md:text-4xl">
              {isAll ? t('portfolio.title') : `${catName}`}
            </h1>
            <p className="mt-2 text-snow/60">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </motion.div>

          <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl bg-snow/5 border border-snow/10"
                  aria-label={project.title}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-void/80 px-3 py-1 text-xs font-medium text-snow backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-bold text-snow">{project.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-snow/60">{project.description}</p>
                    <motion.button
                      onClick={() => setSelectedProject(project)}
                      className="portfolio-view-btn"
                      whileTap={{ scale: 0.95 }}
                      aria-label={`${t('portfolio.view')} ${project.title}`}
                      style={{ '--clr': 'hsl(257, 65%, 57%)' } as React.CSSProperties}
                    >
                      <span className="portfolio-view-btn__icon-wrapper">
                        <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="portfolio-view-btn__icon-svg" width={10}>
                          <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
                        </svg>
                        <svg viewBox="0 0 14 15" fill="none" width={10} xmlns="http://www.w3.org/2000/svg" className="portfolio-view-btn__icon-svg portfolio-view-btn__icon-svg--copy">
                          <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" />
                        </svg>
                      </span>
                      {t('portfolio.view')}
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {projects.length === 0 && (
            <div className="py-20 text-center text-snow/40">No projects found</div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-snow/10 bg-void shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setSelectedProject(null)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-void/80 text-snow transition-colors hover:bg-void"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
              <div className="aspect-video overflow-hidden">
                <img src={selectedProject.image} alt={selectedProject.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-6 md:p-8">
                <span className="mb-4 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                  {selectedProject.category}
                </span>
                <h3 className="mb-4 text-2xl font-bold text-snow md:text-3xl">{selectedProject.title}</h3>
                <p className="mb-6 leading-relaxed text-snow/70">{selectedProject.description}</p>
                {selectedProject.techStack && (
                  <div className="mb-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-snow/40">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.split(',').map((tech: string) => (
                        <span key={tech.trim()} className="rounded-full bg-snow/10 px-3 py-1 text-xs font-medium text-snow/70">{tech.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(selectedProject.projectUrl || selectedProject.link) && (
                  <motion.a
                    href={selectedProject.projectUrl || selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('portfolio.view')}
                    <ExternalLink className="h-4 w-4" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .portfolio-view-btn {
          line-height: 1;
          text-decoration: none;
          display: inline-flex;
          border: none;
          cursor: pointer;
          align-items: center;
          gap: 0.75rem;
          background-color: var(--clr);
          color: #fff;
          border-radius: 10rem;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          padding-left: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: background-color 0.3s;
          font-size: 0.875rem;
        }
        .portfolio-view-btn__icon-wrapper {
          flex-shrink: 0;
          width: 25px;
          height: 25px;
          position: relative;
          color: var(--clr);
          background-color: #fff;
          border-radius: 50%;
          display: grid;
          place-items: center;
          overflow: hidden;
        }
        .portfolio-view-btn:hover {
          background-color: #000;
        }
        .portfolio-view-btn:hover .portfolio-view-btn__icon-wrapper {
          color: #000;
        }
        .portfolio-view-btn__icon-svg--copy {
          position: absolute;
          transform: translate(-150%, 150%);
        }
        .portfolio-view-btn:hover .portfolio-view-btn__icon-svg:first-child {
          transition: transform 0.3s ease-in-out;
          transform: translate(150%, -150%);
        }
        .portfolio-view-btn:hover .portfolio-view-btn__icon-svg--copy {
          transition: transform 0.3s ease-in-out 0.1s;
          transform: translate(0);
        }
      `}</style>
      <Footer />
    </main>
    </>
  );
}

export default function CategoryPortfolio() {
  return (
    <LanguageProvider>
      <CategoryPortfolioInner />
    </LanguageProvider>
  );
}
