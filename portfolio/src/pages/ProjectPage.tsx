import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageEnter } from '@/components/layout/PageTransition';
import { scrollToTopInstant } from '@/components/layout/ScrollToTop';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  getOtherProjects,
  getProject,
  type ProjectSlug,
} from '@/lib/projects';
import NotFound from '@/pages/not-found';

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
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
    <div className="bg-background text-foreground min-h-screen font-sans selection:bg-foreground selection:text-background">
      <Navbar />

      <PageEnter animateKey={project.slug}>
        <motion.div
          initial={false}
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <main className="pt-28 pb-24 md:pt-32 md:pb-32">
            <div className="container mx-auto max-w-5xl px-6">
              <a
                href="/#work"
                className="inline-flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-16"
              >
                <span className="w-8 h-px bg-current" aria-hidden />
                {t.caseStudy.backToWork}
              </a>

              <header className="mb-16 md:mb-24 text-left">
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[0.95] mb-6">
                  {project.title}
                </h1>

                <p className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-muted-foreground max-w-3xl mb-8">
                  {caseCopy.headline}
                </p>

                <p className="text-sm md:text-base font-medium tracking-wide text-foreground/80 mb-8">
                  {disciplineLabel}
                  <span className="mx-3 text-muted-foreground" aria-hidden>
                    ·
                  </span>
                  <span className="text-muted-foreground">{t.work[project.subtitleKey]}</span>
                  <span className="mx-3 text-muted-foreground" aria-hidden>
                    ·
                  </span>
                  <span className="tracking-widest uppercase text-xs font-semibold text-muted-foreground">
                    {project.year}
                  </span>
                </p>
              </header>

              <section className="mb-16 md:mb-20 max-w-3xl text-left">
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
              </section>

              <section className="mb-20 md:mb-28 text-left">
                <h2 className="text-xs font-semibold tracking-widest uppercase mb-6 text-muted-foreground">
                  {t.caseStudy.disciplines}
                </h2>
                <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm md:text-base font-medium tracking-wide">
                  {caseCopy.disciplines.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="mb-24 md:mb-32">
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

            <div className="container mx-auto max-w-5xl px-6 text-left">
              <h2 className="text-xs font-semibold tracking-widest uppercase mb-10 text-muted-foreground">
                {t.caseStudy.otherWork}
              </h2>
              <ul className="divide-y divide-border/40 border-y border-border/40">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/work/${other.slug}`}
                      onClick={scrollToTopInstant}
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
      </PageEnter>
    </div>
  );
}
