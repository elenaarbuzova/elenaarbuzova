import { type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

const EASE = [0.16, 1, 0.3, 1] as const;

const titleClass =
  'select-none whitespace-nowrap font-black uppercase tracking-[-0.07em] text-foreground [font-family:Inter,sans-serif] text-[clamp(1.05rem,4.9vw,4.75rem)] md:text-[clamp(2.35rem,6.4vw,4.75rem)]';

const labelClass =
  'whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.12em] text-foreground [font-family:Inter,sans-serif] sm:text-[11px] sm:tracking-[0.22em] md:text-xs';

const photoGap = 'mr-1 sm:mr-3 md:mr-4';
const photoGapRight = 'ml-1 sm:ml-3 md:ml-4';

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
      <div className="flex flex-1 items-center justify-center overflow-x-hidden px-3 pb-28 pt-24 min-[400px]:px-5 sm:px-8 sm:pb-28 sm:pt-28 md:pb-32 md:pt-32">
        <motion.div
          className="flex w-full justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="relative aspect-[3/4] w-[4.85rem] min-[360px]:w-[5.35rem] min-[400px]:w-[5.85rem] sm:w-36 md:w-52 lg:w-72">
            <img
              src="/elena-portrait.png"
              alt="Elena Arbuzova"
              className="absolute inset-0 z-10 h-full w-full object-cover object-center"
              width={400}
              height={533}
            />

            <div className={`absolute top-0 right-full z-30 flex flex-col items-end ${photoGap}`}>
              <p className={labelClass}>{t.hero.greetingLeft}</p>
              <h1 aria-hidden className={`mt-1.5 text-right leading-[0.88] sm:mt-2 ${titleClass}`}>
                {t.hero.leftLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            <p
              className={`absolute top-0 left-full z-30 inline-flex items-baseline gap-2.5 sm:gap-5 md:gap-6 ${photoGapRight} ${labelClass}`}
            >
              <span>{t.hero.greetingRight}</span>
              <span>{t.hero.greetingInitial}</span>
            </p>

            <h1
              className={`absolute bottom-0 left-full z-30 translate-y-[0.1em] text-left leading-[0.88] ${photoGapRight} ${titleClass}`}
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
          className="flex items-end justify-between gap-4"
        >
          <p className="min-w-0 flex-1 text-[10px] font-medium uppercase leading-snug tracking-[0.1em] text-foreground/55 sm:max-w-[50%] sm:flex-none sm:truncate sm:text-[11px] sm:tracking-[0.18em]">
            {t.hero.role}
          </p>
          <a
            href="#work"
            onClick={scrollToWork}
            className="group relative inline-flex min-h-11 shrink-0 items-end pb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground sm:text-[11px] sm:tracking-[0.28em]"
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
