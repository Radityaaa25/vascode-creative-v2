import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Project {
  id: string | number;
  title: string;
  description: string;
  category: string;
  image: string;
  link?: string;
  techStack?: string;
  projectUrl?: string;
}

const MAX_VISIBLE = 6;

const Portfolio = () => {
  const { t, content } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filters: { key: string; label: string }[] = [
    { key: 'all', label: t('portfolio.all') },
    ...content.categories.map((c) => ({ key: c, label: c })),
  ];

  const projects: Project[] = content.projects.length > 0 ? content.projects : [
    { id: 1, title: 'E-Commerce Platform', description: 'A modern e-commerce platform with seamless shopping experience.', category: 'Website', image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&auto=format&fit=crop&q=60', link: '#' },
    { id: 2, title: 'Brand Photoshoot', description: 'Professional product photography for a lifestyle brand.', category: 'Foto/Video', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=60' },
    { id: 3, title: 'Corporate Identity', description: 'Complete brand identity design including logo, color palette, and typography.', category: 'Desain', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60' },
    { id: 4, title: 'Restaurant Website', description: 'Elegant website design for a premium restaurant with online reservation system.', category: 'Website', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60', link: '#' },
    { id: 5, title: 'Event Coverage', description: 'Complete photo and video coverage for corporate events.', category: 'Foto/Video', image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&auto=format&fit=crop&q=60' },
    { id: 6, title: 'Social Media Campaign', description: 'Creative social media content for brand awareness campaigns.', category: 'Desain', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60' },
  ];

  const filteredAll = activeFilter === 'all' ? projects : projects.filter((p) => p.category === activeFilter);
  const hasMore = filteredAll.length > MAX_VISIBLE;
  const visibleProjects = filteredAll.slice(0, MAX_VISIBLE);

  return (
    <section id="portfolio" className="section-padding bg-void" ref={ref}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-medium text-sm mb-4"
          >
            {t('portfolio.subtitle')}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-snow mb-4"
          >
            {t('portfolio.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-snow/70 text-lg max-w-2xl mx-auto"
          >
            {t('portfolio.description')}
          </motion.p>
        </div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filters.map((filter) => (
            <motion.button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                activeFilter === filter.key
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-snow/10 text-snow hover:bg-snow/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
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
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-void/80 backdrop-blur-sm text-snow text-xs font-medium">
                    {project.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-snow mb-2">
                    {project.title}
                  </h3>
                  <p className="text-snow/60 text-sm line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  <motion.button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`${t('portfolio.view')} ${project.title}`}
                  >
                    {t('portfolio.view')}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Link
              to={activeFilter === 'all' ? '/portfolio/all' : `/portfolio/${encodeURIComponent(activeFilter)}`}
              className="inline-flex items-center gap-2 rounded-full bg-snow/10 px-6 py-3 text-sm font-medium text-snow transition-all hover:bg-snow/20 hover:gap-3"
            >
              {t('portfolio.viewAll')} ({filteredAll.length})
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl bg-void border border-snow/10 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-void/80 text-snow flex items-center justify-center hover:bg-void transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-4">
                  {selectedProject.category}
                </span>

                <h3 className="text-2xl md:text-3xl font-bold text-snow mb-4">
                  {selectedProject.title}
                </h3>

                <p className="text-snow/70 leading-relaxed mb-6">
                  {selectedProject.description}
                </p>

                {selectedProject.techStack && (
                  <div className="mb-4">
                    <div className="text-xs font-semibold uppercase tracking-widest text-snow/40 mb-2">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.split(',').map((tech) => (
                        <span key={tech.trim()} className="rounded-full bg-snow/10 px-3 py-1 text-xs font-medium text-snow/70">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedProject.projectUrl || selectedProject.link) && (
                  <motion.a
                    href={selectedProject.projectUrl || selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('portfolio.view')}
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
