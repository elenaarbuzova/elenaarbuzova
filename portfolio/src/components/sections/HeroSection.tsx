import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Matches uustinov.design hero scale: 34/40 mobile, 56/62 desktop, weight 400. */
const heroLine =
  'font-normal text-[34px] leading-[40px] tracking-[0.1px] md:text-[56px] md:leading-[62px] md:tracking-[-0.5px]';

export function HeroSection() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-6 pb-24 pt-20">
      <motion.div
        key={lang}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE }}
        className="flex w-full max-w-[630px] flex-col items-center text-center"
      >
        <div className={`${heroLine} flex flex-wrap items-center justify-center gap-x-[0.35em] text-[rgba(20,20,26,0.32)]`}>
          <span>{t.hero.greeting}</span>
          <span>{t.hero.name}</span>
        </div>

        <h1
          className={`${heroLine} mt-0 whitespace-pre-line text-[rgb(20,20,26)]`}
        >
          {t.hero.headline}
        </h1>
      </motion.div>

      <motion.a
        href="#work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
        className="absolute bottom-10 md:bottom-14 inline-flex flex-col items-center gap-1.5 text-base font-normal text-foreground/70 hover:text-foreground transition-colors"
      >
        {t.hero.projectsLink}
        <ChevronDown className="size-4 opacity-70" strokeWidth={1.5} aria-hidden />
      </motion.a>
    </section>
  );
}
