import { useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CursorMark } from '@/components/ui/CursorMark';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  getOtherProjects,
  getProject,
  type ProjectSlug,
} from '@/lib/projects';
import NotFound from '@/pages/not-found';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const { t, contentVisible } = useLanguage();
  const project = getProject(params.slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

  if (!project) return <NotFound />;

  const caseCopy = t.cases[project.slug];
  const others = getOtherProjects(project.slug as ProjectSlug);
  const disciplineLabel = project.tagKey
    ? t.work[project.tagKey]
    : project.categoryKey
      ? t.work[project.categoryKey]
      : t.work[project.subtitleKey];

  return (
    <div className="bg-background text-foreground min-h-screen font-sans selection:bg-foreground selection:text-background">
      <Navbar />

      <motion.div
        initial={false}
        animate={
          contentVisible
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 10, filter: 'blur(1px)' }
        }
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <main className="pt-28 pb-24 md:pt-32 md:pb-32">
          <div className="container mx-auto max-w-5xl px-6">
            <a
              href="/#work"
              className="inline-flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-14"
            >
              <span className="w-8 h-px bg-current" aria-hidden />
              {t.caseStudy.backToWork}
            </a>

            <motion.header
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mb-16 md:mb-24"
            >
              <p className="text-sm md:text-base font-medium tracking-wide text-muted-foreground mb-5">
                {project.title}
              </p>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] max-w-4xl mb-8">
                {caseCopy.headline}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm md:text-base">
                <span className="font-medium tracking-wide">{disciplineLabel}</span>
                <span className="hidden sm:inline text-muted-foreground" aria-hidden>
                  ·
                </span>
                <span className="inline-flex items-center gap-2 font-medium tracking-wide">
                  <span className="text-muted-foreground">{t.caseStudy.builtIn}</span>
                  <CursorMark className="size-4 shrink-0" />
                  <span>Cursor</span>
                </span>
                <span className="hidden sm:inline text-muted-foreground" aria-hidden>
                  ·
                </span>
                <span className="text-muted-foreground tracking-widest uppercase text-xs font-semibold">
                  {project.year}
                </span>
              </div>
            </motion.header>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
              className="mb-16 md:mb-20 max-w-3xl"
            >
              <h2 className="text-xs font-semibold tracking-widest uppercase mb-6 text-muted-foreground">
                {t.caseStudy.overview}
              </h2>
              <p className="text-lg md:text-2xl font-light leading-relaxed tracking-wide text-foreground/85 mb-10">
                {caseCopy.overview}
              </p>

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-foreground px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                {t.caseStudy.visitSite}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
              className="mb-20 md:mb-28"
            >
              <h2 className="text-xs font-semibold tracking-widest uppercase mb-6 text-muted-foreground">
                {t.caseStudy.disciplines}
              </h2>
              <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm md:text-base font-medium tracking-wide">
                {caseCopy.disciplines.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.section>
          </div>

          <div className="space-y-4 md:space-y-6 mb-24 md:mb-32">
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-muted overflow-hidden">
              {project.coverShift ? (
                <div
                  className="absolute inset-y-0 left-0 h-full"
                  style={{ width: '148%', transform: project.coverShift }}
                >
                  <img
                    src={project.cover}
                    alt={`${project.title} ${t.caseStudy.coverLabel}`}
                    className="h-full w-full object-cover object-center"
                    draggable={false}
                  />
                </div>
              ) : (
                <img
                  src={project.cover}
                  alt={`${project.title} ${t.caseStudy.coverLabel}`}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  draggable={false}
                />
              )}
            </div>

            {Array.from({ length: project.gallerySlots }).map((_, index) => (
              <div
                key={`${project.slug}-slot-${index}`}
                className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-muted flex items-center justify-center border border-border/40"
              >
                <div className="text-center px-6">
                  <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {t.caseStudy.imageSoon}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="container mx-auto max-w-5xl px-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase mb-10 text-muted-foreground">
              {t.caseStudy.otherWork}
            </h2>
            <ul className="divide-y divide-border/40 border-y border-border/40">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/work/${other.slug}`}
                    className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-6 hover:opacity-70 transition-opacity"
                  >
                    <span className="text-2xl md:text-3xl font-bold tracking-tight">
                      {other.title}
                    </span>
                    <span className="text-sm text-muted-foreground tracking-wide">
                      {t.work[other.subtitleKey]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}
