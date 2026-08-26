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
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="flex flex-1 items-center justify-center px-4 pb-[7.5rem] pt-24 sm:px-8 sm:pb-28 sm:pt-28 md:pb-32 md:pt-32">
        <motion.div
          className="relative mx-auto flex w-full max-w-5xl flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/*
            Architecture lockup on a single vertical axis:
            photo (top) → micro caption → overlapping WEB / DESIGNER
          */}
          <div className="relative flex w-full flex-col items-center">
            {/* Portrait — top of stack, centered on axis */}
            <div className="relative z-20 aspect-[3/4] w-[5.75rem] sm:w-28 md:w-36 lg:w-40">
              <img
                src="/elena-portrait.png"
                alt="Elena Arbuzova"
                className="h-full w-full object-cover object-center"
                width={400}
                height={533}
              />
            </div>

            {/* Micro line — sits on photo bottom edge, 3 parts on the axis */}
            <div className="relative z-30 -mt-1 grid w-[min(100%,36rem)] grid-cols-[1fr_auto_1fr] items-center gap-x-2 sm:w-[min(100%,42rem)] sm:gap-x-3 md:w-[min(100%,48rem)]">
              <p className="justify-self-end text-right text-[8px] font-medium uppercase leading-none tracking-[0.16em] text-foreground [font-family:Inter,sans-serif] sm:text-[10px] sm:tracking-[0.2em] md:text-xs">
                {t.hero.greetingLeft}
              </p>
              <p className="justify-self-center text-center text-[8px] font-medium uppercase leading-none tracking-[0.16em] text-foreground [font-family:Inter,sans-serif] sm:text-[10px] sm:tracking-[0.2em] md:text-xs">
                {t.hero.greetingRight}
              </p>
              <p className="justify-self-start text-left text-[8px] font-medium uppercase leading-none tracking-[0.16em] text-foreground [font-family:Inter,sans-serif] sm:text-[10px] sm:tracking-[0.2em] md:text-xs">
                {t.hero.greetingInitial}
              </p>
            </div>

            {/* Overlapping WEB / DESIGNER — same size, negative leading, DESIGNER shifted right */}
            <h1 className="relative z-10 -mt-7 w-full select-none text-center [font-family:Inter,sans-serif] sm:-mt-9 md:-mt-11 lg:-mt-12">
              <span className="sr-only">
                {t.hero.left} {t.hero.right}
              </span>
              <span
                aria-hidden
                className="block font-black uppercase tracking-[-0.07em] text-foreground text-[clamp(3.25rem,16vw,9.5rem)] leading-[0.7] -translate-x-[12%] sm:-translate-x-[14%] md:-translate-x-[16%]"
              >
                {t.hero.left}
              </span>
              <span
                aria-hidden
                className="block font-black uppercase tracking-[-0.07em] text-foreground text-[clamp(3.25rem,16vw,9.5rem)] leading-[0.7] -mt-[0.42em] translate-x-[10%] sm:translate-x-[12%] md:translate-x-[14%]"
              >
                {t.hero.right}
              </span>
            </h1>

            {/* Small role accent — ties the lockup together */}
            <p className="relative z-10 mt-3 text-[9px] font-medium uppercase tracking-[0.22em] text-foreground/55 [font-family:Inter,sans-serif] sm:mt-4 sm:text-[10px] md:tracking-[0.28em]">
              {t.hero.role}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:inset-x-6 sm:bottom-8 md:inset-x-10 md:bottom-10">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
          className="mb-3 h-px origin-left bg-foreground/20 sm:mb-4"
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
          className="flex items-end justify-between gap-3"
        >
          <p className="min-w-0 flex-1 text-[9px] font-medium uppercase leading-snug tracking-[0.12em] text-foreground/55 min-[390px]:text-[10px] sm:max-w-[50%] sm:flex-none sm:truncate sm:text-[11px] sm:tracking-[0.18em]">
            {t.hero.role}
          </p>
          <a
            href="#work"
            onClick={scrollToWork}
            className="group relative shrink-0 pb-1 text-[9px] font-medium uppercase tracking-[0.18em] text-foreground min-[390px]:text-[10px] sm:text-[11px] sm:tracking-[0.28em]"
          >
            {t.hero.cta}
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-active:scale-x-100"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
