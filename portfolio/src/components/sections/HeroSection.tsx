import { type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

const EASE = [0.16, 1, 0.3, 1] as const;

const titleClass =
  'select-none whitespace-nowrap font-black uppercase leading-none tracking-[-0.07em] text-foreground [font-family:Inter,sans-serif] text-[clamp(1.55rem,7.8vw,6.25rem)]';

const labelClass =
  'whitespace-nowrap text-[8px] font-medium uppercase leading-none tracking-[0.14em] text-foreground [font-family:Inter,sans-serif] min-[390px]:text-[9px] sm:text-[11px] sm:tracking-[0.22em] md:text-xs';

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
      <div className="flex flex-1 items-center justify-center overflow-x-hidden px-3 pb-[7.5rem] pt-24 min-[400px]:px-5 sm:px-8 sm:pb-28 sm:pt-28 md:pb-32 md:pt-32">
        <motion.div
          className="flex w-full justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/*
            Photo is the page center.
            I'm sits on the right of WEB, flush to the photo.
            DESIGNER steps down, Elena sits on the photo's top-right.
          */}
          <div className="relative aspect-[3/4] w-[6.25rem] min-[390px]:w-28 min-[430px]:w-32 sm:w-40 md:w-56 lg:w-64">
            <img
              src="/elena-portrait.png"
              alt="Elena Arbuzova"
              className="absolute inset-0 z-10 h-full w-full object-cover object-center"
              width={400}
              height={533}
            />

            <p className={`absolute top-0 right-full z-30 mr-1.5 sm:mr-3 md:mr-4 ${labelClass}`}>
              {t.hero.greetingLeft}
            </p>

            <h1
              aria-hidden
              className={`absolute top-[0.95rem] right-full z-[1] mr-1.5 text-right min-[390px]:top-[1.05rem] sm:top-[1.15rem] sm:mr-3 md:top-[1.25rem] md:mr-4 ${titleClass}`}
            >
              {t.hero.left}
            </h1>

            <p className={`absolute top-0 left-full z-30 ml-1.5 sm:ml-3 md:ml-4 ${labelClass}`}>
              {t.hero.greetingRight}
            </p>

            <h1 className={`absolute top-1/2 left-full z-[1] ml-1.5 text-left sm:ml-3 md:ml-4 ${titleClass}`}>
              <span className="sr-only">
                {t.hero.left} {t.hero.right}
              </span>
              <span aria-hidden>{t.hero.right}</span>
            </h1>
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
