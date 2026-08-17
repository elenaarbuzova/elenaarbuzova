import { motion } from 'framer-motion';
import { RevealText } from '../ui/animations';
import yeat from '@assets/generated_images/yeat.png';
import voidArena from '@assets/generated_images/void-arena.png';
import stillness from '@assets/generated_images/stillness.png';
import labagent from '@assets/generated_images/labagent.png';
import { useLanguage } from '@/i18n/LanguageContext';

type Project = {
  id: number;
  title: string;
  subtitleKey?: 'yeatSubtitle' | 'atelierSubtitle' | 'stillnessSubtitle' | 'labagentSubtitle';
  hoverKey?: 'stillnessHover' | 'atelierHover' | 'yeatHover' | 'labagentHover';
  categoryKey?: 'webDesign' | 'uxResearch';
  tagKey?: 'uiUx';
  year: string;
  image: string;
  href?: string;
  imageShift?: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: 'YEAT',
    subtitleKey: 'yeatSubtitle',
    categoryKey: 'webDesign',
    year: '2026',
    image: yeat,
    href: 'https://yeat-ruddy.vercel.app/',
    imageShift: 'translateX(-23%)',
    hoverKey: 'yeatHover',
  },
  {
    id: 2,
    title: 'Stillness',
    subtitleKey: 'stillnessSubtitle',
    tagKey: 'uiUx',
    year: '2026',
    image: stillness,
    href: 'https://stillnesshq.vercel.app/',
    hoverKey: 'stillnessHover',
  },
  {
    id: 3,
    title: 'Atelier Nordhavn',
    subtitleKey: 'atelierSubtitle',
    tagKey: 'uiUx',
    year: '2025',
    image: voidArena,
    href: 'https://atelier-nordhavn.vercel.app/',
    hoverKey: 'atelierHover',
  },
  {
    id: 4,
    title: 'LabAgent',
    subtitleKey: 'labagentSubtitle',
    tagKey: 'uiUx',
    year: '2026',
    image: labagent,
    href: 'https://labagent.vercel.app/',
    hoverKey: 'labagentHover',
  },
];

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
          const hasLink = Boolean(project.href);
          const hoverText = project.hoverKey ? t.work[project.hoverKey] : null;

          const media = (
            <>
              {project.imageShift ? (
                <div
                  className="absolute inset-y-0 left-0 h-full"
                  style={{ width: '148%', transform: project.imageShift }}
                >
                  <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/media:scale-105">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover object-center bg-no-repeat"
                      draggable={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/media:scale-105">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {hoverText && (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 ease-out group-hover/media:bg-black/85"
                    aria-hidden
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8 md:p-14">
                    <p className="max-w-3xl text-center text-base md:text-2xl lg:text-3xl leading-relaxed md:leading-snug font-medium text-white opacity-0 translate-y-3 transition-all duration-500 ease-out group-hover/media:opacity-100 group-hover/media:translate-y-0">
                      {hoverText}
                    </p>
                  </div>
                </>
              )}
            </>
          );

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
              className="group"
            >
              {hasLink ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/media block relative overflow-hidden bg-muted aspect-[16/9] md:aspect-[21/9] mb-8 cursor-pointer"
                >
                  {media}
                </a>
              ) : (
                <div className="group/media relative overflow-hidden bg-muted aspect-[16/9] md:aspect-[21/9] mb-8 cursor-pointer">
                  {media}
                </div>
              )}

              <div className="flex flex-row items-start justify-between gap-4">
                <div>
                  {hasLink ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <h3 className="text-3xl md:text-5xl font-bold tracking-tight hover:opacity-70 transition-opacity">
                        {project.title}
                      </h3>
                    </a>
                  ) : (
                    <h3 className="text-3xl md:text-5xl font-bold tracking-tight group-hover:opacity-70 transition-opacity">
                      {project.title}
                    </h3>
                  )}
                  {project.subtitleKey && (
                    <p className="mt-2 text-sm md:text-base font-medium tracking-wide text-muted-foreground">
                      {t.work[project.subtitleKey]}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0 pt-1">
                  {hasLink && (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm md:text-base text-[#3b82f6] hover:text-[#2563eb] hover:underline break-all text-right"
                    >
                      {project.href}
                    </a>
                  )}
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
