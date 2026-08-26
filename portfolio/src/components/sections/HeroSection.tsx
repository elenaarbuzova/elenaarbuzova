import { type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

const EASE = [0.16, 1, 0.3, 1] as const;

const microClass =
  'text-[8px] font-medium uppercase leading-none tracking-[0.16em] text-foreground [font-family:Inter,sans-serif] sm:text-[10px] sm:tracking-[0.2em] md:text-xs';

const titleLineClass =
  'block font-black uppercase tracking-[-0.06em] text-foreground text-[clamp(2.75rem,14vw,8.5rem)] leading-none';

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
          <div className="relative flex w-full flex-col items-center">
            {/* Portrait — centered, behind large type at the shoulder line */}
            <div className="relative z-[1] aspect-[3/4] w-[5.75rem] sm:w-28 md:w-36 lg:w-40">
              <img
                src="/elena-portrait.png"
                alt="Elena Arbuzova"
                className="h-full w-full object-cover object-center"
                width={400}
                height={533}
              />

              {/*
                Micro line sits in the clear band under the portrait
                (between photo bottom and WEB top), never inside the letters.
              */}
              <div className="absolute top-[100%] left-1/2 z-30 mt-2 grid w-[min(100vw,34rem)] -translate-x-1/2 grid-cols-[1fr_auto_1fr] items-center gap-x-3 sm:mt-2.5 sm:w-[min(100vw,40rem)] sm:gap-x-4 md:w-[min(100vw,46rem)]">
                <p className={`justify-self-end text-right ${microClass}`}>
                  {t.hero.greetingLeft}
                </p>
                <p className={`justify-self-center text-center ${microClass}`}>
                  {t.hero.greetingRight}
                </p>
                <p className={`justify-self-start text-left ${microClass}`}>
                  {t.hero.greetingInitial}
                </p>
              </div>
            </div>

            {/*
              Reserve space for the micro band, then pull WEB up so only the
              lower part of the photo (shoulders/clothes) tucks behind WEB.
              Face + neck stay clear.
            */}
            <div className="h-10 sm:h-11 md:h-12" aria-hidden />

            <h1 className="relative z-10 -mt-[3.1rem] w-full select-none text-center [font-family:Inter,sans-serif] sm:-mt-[3.85rem] md:-mt-[4.75rem] lg:-mt-[5.25rem]">
              <span className="sr-only">
                {t.hero.left} {t.hero.right}
              </span>
              {/* WEB — upper step of the staircase */}
              <span
                aria-hidden
                className={`${titleLineClass} -translate-x-[14%] sm:-translate-x-[16%] md:-translate-x-[18%]`}
              >
                {t.hero.left}
              </span>
              {/* DESIGNER — lower step, shifted right, only ~12–14% letter overlap */}
              <span
                aria-hidden
                className={`${titleLineClass} -mt-[0.13em] translate-x-[12%] sm:translate-x-[14%] md:translate-x-[16%]`}
              >
                {t.hero.right}
              </span>
            </h1>

            <p className="relative z-10 mt-6 text-[9px] font-medium uppercase tracking-[0.22em] text-foreground/55 [font-family:Inter,sans-serif] sm:mt-7 sm:text-[10px] md:tracking-[0.28em]">
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
