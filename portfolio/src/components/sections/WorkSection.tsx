import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { RevealText } from '../ui/animations';
import { useLanguage } from '@/i18n/LanguageContext';
import { scrollToTopInstant } from '@/components/layout/ScrollToTop';
import { projects } from '@/lib/projects';

function coverAspectClass(aspect: 'video' | 'wide' | undefined) {
  return aspect === 'video'
    ? 'aspect-[16/9]'
    : 'aspect-[16/9] md:aspect-[21/9]';
}

export function WorkSection() {
  const { t } = useLanguage();

  return (
    <section id="work" className="py-40 container mx-auto px-6">
      <RevealText>
        <h2 className="text-sm font-semibold tracking-widest uppercase mb-24 flex items-center gap-4">
          <span className="w-8 h-[1px] bg-foreground"></span>
          {t.work.title}
        </h2>
      </RevealText>

      <div className="space-y-32">
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
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="group"
            >
              <Link
                href={projectHref}
                onClick={scrollToTopInstant}
                className={`block relative overflow-hidden ${mediaBg} ${coverAspectClass(project.coverAspect)} mb-8 cursor-pointer transition-opacity hover:opacity-90`}
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

              <div className="flex flex-row items-start justify-between gap-4">
                <div>
                  <Link href={projectHref} onClick={scrollToTopInstant} className="inline-block">
                    <h3 className="text-3xl md:text-5xl font-bold tracking-tight hover:opacity-70 transition-opacity">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="mt-2 text-sm md:text-base font-medium tracking-wide text-muted-foreground">
                    {t.work[project.subtitleKey]}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0 pt-1">
                  <div className="flex items-center gap-8 text-sm uppercase tracking-widest font-medium text-muted-foreground">
                    {project.tagKey ? (
                      <span>{t.work[project.tagKey]}</span>
                    ) : (
                      project.categoryKey && <span>{t.work[project.categoryKey]}</span>
                    )}
                    <span>{project.year}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
