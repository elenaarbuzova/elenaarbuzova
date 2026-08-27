import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { RevealText } from '../ui/animations';
import { useLanguage } from '@/i18n/LanguageContext';
import { scrollToTopInstant } from '@/components/layout/ScrollToTop';
import { saveWorkScroll } from '@/lib/homeScroll';
import { projects } from '@/lib/projects';
import { ProjectMeta } from '@/components/projects/ProjectMeta';

function coverAspectClass(aspect: 'video' | 'wide' | undefined) {
  return aspect === 'video'
    ? 'aspect-[16/9]'
    : 'aspect-[16/9] md:aspect-[21/9]';
}

export function WorkSection() {
  const { t } = useLanguage();

  return (
    <section id="work" className="container mx-auto px-5 py-16 sm:px-6 sm:py-24 md:py-40">
      <RevealText>
        <h2 className="mb-10 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] sm:mb-24 sm:gap-4 sm:text-sm sm:tracking-widest">
          <span className="h-px w-6 bg-foreground sm:w-8"></span>
          {t.work.title}
        </h2>
      </RevealText>

      <div className="space-y-14 sm:space-y-24 md:space-y-32">
        {projects.map((project) => {
          const projectHref = `/work/${project.slug}`;
          const fit = project.coverFit ?? 'cover';
          const mediaBg =
            project.coverBg ?? (fit === 'contain' ? 'bg-black' : 'bg-muted');

          return (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="group"
            >
              <Link
                href={projectHref}
                onClick={() => {
                  saveWorkScroll();
                  scrollToTopInstant();
                }}
                className={`relative mb-5 block cursor-pointer overflow-hidden transition-opacity hover:opacity-90 sm:mb-8 ${mediaBg} ${coverAspectClass(project.coverAspect)}`}
              >
                {project.coverShift ? (
                  <div
                    className="absolute inset-y-0 left-0 h-full"
                    style={{ width: '148%', transform: project.coverShift }}
                  >
                    <img
                      src={project.cover}
                      alt={project.title}
                      width={1920}
                      height={1080}
                      decoding="async"
                      className="h-full w-full object-cover object-center"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <div className={`absolute inset-0 overflow-hidden ${mediaBg}`}>
                    <img
                      src={project.cover}
                      alt={project.title}
                      width={1920}
                      height={1080}
                      decoding="async"
                      className={`h-full w-full object-center ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                      draggable={false}
                    />
                  </div>
                )}
              </Link>

              <div className="flex flex-col gap-2">
                <div className="min-w-0">
                  <Link
                    href={projectHref}
                    onClick={() => {
                      saveWorkScroll();
                      scrollToTopInstant();
                    }}
                    className="inline-flex min-h-11 items-center"
                  >
                    <h3 className="text-[1.75rem] font-bold tracking-tight transition-opacity hover:opacity-70 sm:text-3xl md:text-5xl">
                      {project.title}
                    </h3>
                  </Link>
                </div>
                <ProjectMeta
                  items={[
                    project.tagKey
                      ? t.work[project.tagKey]
                      : project.categoryKey && t.work[project.categoryKey],
                    t.work[project.subtitleKey],
                    project.year,
                  ]}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
