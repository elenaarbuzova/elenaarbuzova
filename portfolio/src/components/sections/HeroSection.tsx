import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-6 pt-24 pb-28 text-center">
      <motion.div
        key={lang}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="mx-auto w-full max-w-4xl"
      >
        <p className="mb-5 text-xl font-normal tracking-tight text-muted-foreground md:mb-7 md:text-2xl lg:text-[1.75rem]">
          {t.hero.greeting}{' '}
          <span className="text-foreground/90">{t.hero.name}</span>
        </p>

        <h1 className="text-[2rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.08]">
          {t.hero.headline}
        </h1>
      </motion.div>

      <motion.a
        href="#work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
        className="absolute bottom-10 md:bottom-12 inline-flex flex-col items-center gap-2 text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground transition-colors"
      >
        {t.hero.projectsLink}
        <ChevronDown className="size-4" strokeWidth={1.75} aria-hidden />
      </motion.a>
    </section>
  );
}
