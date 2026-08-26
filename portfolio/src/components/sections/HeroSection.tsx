import { type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

const EASE = [0.16, 1, 0.3, 1] as const;

const titleClass =
  'select-none whitespace-nowrap font-black uppercase leading-[0.88] tracking-[-0.07em] text-foreground [font-family:Inter,sans-serif] text-[clamp(1.45rem,6.4vw,4.75rem)]';

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
            Left: I'm + WEB / DESIGNER (right-aligned to the photo)
            Right: Elena Arbuzova … A + AI / DEVELOPER (left-aligned to the photo)
          */}
          <div className="relative aspect-[3/4] w-[7.25rem] min-[390px]:w-32 min-[430px]:w-36 sm:w-44 md:w-56 lg:w-72">
            <img
              src="/elena-portrait.png"
              alt="Elena Arbuzova"
              className="absolute inset-0 z-10 h-full w-full object-cover object-center"
              width={400}
              height={533}
            />

            <div className="absolute top-0 right-full z-30 mr-1.5 flex flex-col items-end sm:mr-3 md:mr-4">
              <p className={labelClass}>{t.hero.greetingLeft}</p>
              <h1 aria-hidden className={`mt-2 text-right ${titleClass}`}>
                {t.hero.leftLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <p
              className={`absolute top-0 left-full z-30 ml-1.5 inline-flex items-baseline gap-4 sm:ml-3 sm:gap-5 md:ml-4 md:gap-6 ${labelClass}`}
            >
              <span>{t.hero.greetingRight}</span>
              <span>{t.hero.greetingInitial}</span>
            </p>

            <h1
              className={`absolute bottom-0 left-full z-[1] ml-1.5 text-left sm:ml-3 md:ml-4 ${titleClass}`}
            >
              <span className="sr-only">
                {t.hero.leftLines.join(' ')} {t.hero.rightLines.join(' ')}
              </span>
              <span aria-hidden>
                {t.hero.rightLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
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
