import { Link, useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageEnter } from '@/components/layout/PageTransition';
import { scrollToTopInstant } from '@/components/layout/ScrollToTop';
import { rememberHomeSection } from '@/lib/homeScroll';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  getOtherProjects,
  getProject,
  type ProjectSlug,
} from '@/lib/projects';
import { ProjectGalleryMarquee } from '@/components/projects/ProjectGalleryMarquee';
import NotFound from '@/pages/not-found';

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { t, contentVisible } = useLanguage();
  const project = getProject(params.slug);

  if (!project) return <NotFound />;

  const caseCopy = t.cases[project.slug];
  const others = getOtherProjects(project.slug as ProjectSlug);
  const disciplineLabel = project.tagKey
    ? t.work[project.tagKey]
    : project.categoryKey
      ? t.work[project.categoryKey]
      : t.work[project.subtitleKey];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-foreground selection:text-background">
      <Navbar />

      <PageEnter animateKey={project.slug}>
        <motion.div
          initial={false}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <main className="pt-20 pb-16 md:pt-28 md:pb-32">
            <div className="container mx-auto max-w-5xl px-5 sm:px-6">
              <a
                href="/#work"
                onClick={(event) => {
                  event.preventDefault();
                  rememberHomeSection('work');
                  setLocation('/');
                }}
                className="mb-8 inline-flex min-h-11 items-center gap-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground sm:mb-16"
              >
                <span className="h-px w-8 bg-current" aria-hidden />
                {t.caseStudy.backToWork}
              </a>

              <header className="mb-12 text-left md:mb-24">
                <h1 className="mb-4 text-4xl font-bold leading-[0.95] tracking-tighter sm:mb-6 sm:text-6xl md:text-8xl">
                  {project.title}
                </h1>

                <p className="mb-6 max-w-3xl text-lg font-medium tracking-tight text-muted-foreground sm:mb-8 sm:text-2xl md:text-3xl">
                  {caseCopy.headline}
                </p>

                <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium tracking-wide text-foreground/80 sm:mb-8 md:text-base">
                  {disciplineLabel}
                  <span className="text-muted-foreground" aria-hidden>
                    ·
                  </span>
                  <span className="text-muted-foreground">{t.work[project.subtitleKey]}</span>
                  <span className="text-muted-foreground" aria-hidden>
                    ·
                  </span>
                  <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                    {project.year}
                  </span>
                </p>
              </header>

              <section className="mb-12 max-w-3xl text-left md:mb-20">
                <h2 className="mb-4 text-xs font-semibold tracking-widest uppercase text-muted-foreground sm:mb-6">
                  {t.caseStudy.overview}
                </h2>
                <p className="mb-8 text-base font-light leading-relaxed tracking-wide text-foreground/85 sm:mb-10 sm:text-lg md:text-2xl">
                  {caseCopy.overview}
                </p>

                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-foreground px-6 py-3 text-sm font-semibold tracking-widest uppercase transition-colors hover:bg-foreground hover:text-background sm:w-auto"
                >
                  {t.caseStudy.visitSite}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </section>

              <section className="mb-14 text-left md:mb-28">
                <h2 className="mb-4 text-xs font-semibold tracking-widest uppercase text-muted-foreground sm:mb-6">
                  {t.caseStudy.disciplines}
                </h2>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium tracking-wide md:text-base">
                  {caseCopy.disciplines.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="mb-12 md:mb-32">
              <div
                className={`relative w-full overflow-hidden ${
                  project.coverAspect === 'video'
                    ? 'aspect-[16/9]'
                    : 'aspect-[16/9] md:aspect-[21/9]'
                } ${project.coverBg ?? (project.coverFit === 'contain' ? 'bg-black' : 'bg-muted')}`}
              >
                {project.coverShift ? (
                  <div
                    className="absolute inset-y-0 left-0 h-full"
                    style={{ width: '148%', transform: project.coverShift }}
                  >
                    <img
                      src={project.cover}
                      alt={`${project.title} ${t.caseStudy.coverLabel}`}
                      width={1920}
                      height={1080}
                      decoding="async"
                      className="h-full w-full object-cover object-center"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <img
                    src={project.cover}
                    alt={`${project.title} ${t.caseStudy.coverLabel}`}
                    width={1920}
                    height={1080}
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-center ${
                      project.coverFit === 'contain' ? 'object-contain' : 'object-cover'
                    }`}
                    draggable={false}
                  />
                )}
              </div>
            </div>

            <div className="container mx-auto mb-12 max-w-7xl px-5 sm:px-6 md:mb-32">
              <ProjectGalleryMarquee project={project} />
            </div>

            <div className="container mx-auto max-w-5xl px-5 text-left sm:px-6">
              <h2 className="mb-6 text-xs font-semibold tracking-widest uppercase text-muted-foreground sm:mb-10">
                {t.caseStudy.otherWork}
              </h2>
              <ul className="divide-y divide-border/40 border-y border-border/40">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/work/${other.slug}`}
                      onClick={scrollToTopInstant}
                      className="group flex min-h-16 flex-col justify-center gap-1 py-5 transition-opacity hover:opacity-70 sm:min-h-0 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:py-6"
                    >
                      <span className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                        {other.title}
                      </span>
                      <span className="text-sm tracking-wide text-muted-foreground">
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
      </PageEnter>
    </div>
  );
}
