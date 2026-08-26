import { type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const { t } = useLanguage();

  const scrollToWork = (event: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('work');
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', '#work');
  };

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="flex flex-1 items-center justify-center overflow-x-hidden px-4 pb-28 pt-28 sm:px-8 md:pb-32 md:pt-32">
        <motion.div
          className="flex w-full max-w-6xl justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/*
            Photo box is the single anchor.
            I'm / Elena → top edge
            WEB → bottom edge on 50% (fills top half)
            DESIGNER → top edge on 50% (fills bottom half)
          */}
          <div className="relative aspect-[3/4] w-[5.75rem] sm:w-[7.5rem] md:w-40 lg:w-48">
            <img
              src="/elena-portrait.png"
              alt="Elena Arbuzova"
              className="absolute inset-0 z-10 h-full w-full object-cover object-center"
              width={400}
              height={533}
            />

            <p className="absolute top-0 right-full z-30 mr-3 whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.22em] text-foreground [font-family:Inter,sans-serif] sm:mr-4 sm:text-[11px] md:mr-5 md:text-xs">
              {t.hero.greetingLeft}
            </p>

            <p className="absolute top-0 left-full z-30 ml-3 whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.22em] text-foreground [font-family:Inter,sans-serif] sm:ml-4 sm:text-[11px] md:ml-5 md:text-xs">
              {t.hero.greetingRight}
            </p>

            <h1
              aria-hidden
              className="absolute right-full bottom-1/2 z-[1] mr-3 select-none whitespace-nowrap text-right text-[3.5rem] font-black uppercase leading-none tracking-[-0.07em] text-foreground [font-family:Inter,sans-serif] sm:mr-4 sm:text-[4.6rem] md:mr-5 md:text-[6.2rem] lg:text-[7.4rem]"
            >
              {t.hero.left}
            </h1>

            <h1 className="absolute left-full top-1/2 z-[1] ml-3 select-none whitespace-nowrap text-left text-[2.15rem] font-black uppercase leading-none tracking-[-0.07em] text-foreground [font-family:Inter,sans-serif] sm:ml-4 sm:text-[3rem] md:ml-5 md:text-[4.15rem] lg:text-[5rem]">
              <span className="sr-only">
                {t.hero.left} {t.hero.right}
              </span>
              <span aria-hidden>{t.hero.right}</span>
            </h1>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-6 bottom-8 md:inset-x-10 md:bottom-10">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
          className="mb-4 h-px origin-left bg-foreground/20"
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
          className="flex items-center justify-between"
        >
          <p className="max-w-[50%] truncate text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
            {t.hero.role}
          </p>
          <a
            href="#work"
            onClick={scrollToWork}
            className="group relative pb-1 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground"
          >
            {t.hero.cta}
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
