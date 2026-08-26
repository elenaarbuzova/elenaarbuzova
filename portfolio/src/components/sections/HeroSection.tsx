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
          <div className="relative mx-auto w-full max-w-5xl pb-[clamp(3.5rem,12vw,8rem)] pt-2">
            {/* WEB — high left */}
            <h1
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-[1] select-none text-[clamp(4.5rem,18vw,12rem)] font-black uppercase leading-none tracking-[-0.07em] text-foreground [font-family:Inter,sans-serif] md:left-2"
            >
              {t.hero.left}
            </h1>

            {/* Im | photo | Elena — photo bottom sits on DESIGNER top */}
            <div className="relative z-10 mx-auto w-fit pt-[clamp(2.5rem,8vw,5.5rem)]">
              <div className="flex items-start gap-3 sm:gap-5 md:gap-7">
                <p className="mt-[2.75rem] shrink-0 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground [font-family:Inter,sans-serif] sm:mt-14 sm:text-xs md:mt-16">
                  {t.hero.greetingLeft}
                </p>

                <div className="w-[5.25rem] shrink-0 sm:w-28 md:w-36 lg:w-40">
                  <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                    <img
                      src="/elena-portrait.png"
                      alt="Elena Arbuzova"
                      className="h-full w-full object-cover object-center"
                      width={400}
                      height={533}
                    />
                  </div>
                </div>

                <p className="mt-[2.75rem] shrink-0 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground [font-family:Inter,sans-serif] sm:mt-14 sm:text-xs md:mt-16">
                  {t.hero.greetingRight}
                </p>
              </div>

              {/* DESIGNER — top edge flush with photo bottom */}
              <h1 className="pointer-events-none absolute top-full right-[-8%] z-[1] mt-0 select-none text-right text-[clamp(2.4rem,10vw,7.25rem)] font-black uppercase leading-none tracking-[-0.07em] text-foreground [font-family:Inter,sans-serif] sm:right-[-18%] md:right-[-28%] lg:right-[-36%]">
                <span className="sr-only">
                  {t.hero.left} {t.hero.right}
                </span>
                <span aria-hidden>{t.hero.right}</span>
              </h1>
            </div>
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
