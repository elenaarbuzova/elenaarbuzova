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
      <div className="flex flex-1 items-center justify-center px-5 pb-28 pt-28 sm:px-8 md:pb-32 md:pt-32">
        <motion.div
          className="relative mx-auto w-full max-w-[68rem]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* Staggered ARCHITECTURE-style composition: WEB high-left, photo center, DESIGNER low-right */}
          <div className="relative mx-auto h-[min(72vw,26rem)] w-full max-w-5xl sm:h-[28rem] md:h-[32rem] lg:h-[34rem]">
            <p className="absolute left-[calc(50%+3.1rem)] top-[18%] z-20 w-max max-w-[10rem] text-[10px] font-medium uppercase leading-snug tracking-[0.16em] text-foreground [font-family:Inter,sans-serif] sm:left-[calc(50%+4.2rem)] sm:top-[20%] sm:max-w-[14rem] sm:text-xs sm:tracking-[0.2em] md:left-[calc(50%+5.2rem)] md:top-[22%]">
              {t.hero.greeting}
            </p>

            <h1
              aria-hidden
              className="pointer-events-none absolute left-0 top-[22%] z-[1] select-none text-[clamp(4.5rem,18vw,12rem)] font-black uppercase leading-none tracking-[-0.07em] text-foreground [font-family:Inter,sans-serif] sm:top-[20%] md:left-[2%]"
            >
              {t.hero.left}
            </h1>

            <div className="absolute left-1/2 top-[42%] z-10 w-[5.25rem] -translate-x-1/2 -translate-y-1/2 sm:w-28 md:top-[44%] md:w-36 lg:w-40">
              <div className="overflow-hidden bg-neutral-900 aspect-[3/4] w-full">
                <img
                  src="/elena-portrait.png"
                  alt="Elena Arbuzova"
                  className="h-full w-full object-cover object-center"
                  width={400}
                  height={533}
                />
              </div>
            </div>

            <h1 className="pointer-events-none absolute right-0 top-[58%] z-[1] select-none text-right text-[clamp(2.4rem,10vw,7.25rem)] font-black uppercase leading-none tracking-[-0.07em] text-foreground [font-family:Inter,sans-serif] sm:top-[56%] md:right-[1%] lg:top-[54%]">
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
          <a
            href="#work"
            onClick={scrollToWork}
            className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground transition-opacity hover:opacity-50"
          >
            {t.hero.cta}
          </a>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
            {t.hero.role}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
