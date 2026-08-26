import { type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

const EASE = [0.16, 1, 0.3, 1] as const;

const titleClass =
  'select-none font-black uppercase leading-[0.88] tracking-[-0.07em] text-foreground [font-family:Inter,sans-serif] text-[clamp(1.55rem,6.8vw,4.75rem)]';

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
      <div className="flex flex-1 items-center justify-center px-3 pb-[7.5rem] pt-24 min-[400px]:px-5 sm:px-8 sm:pb-28 sm:pt-28 md:pb-32 md:pt-32">
        <motion.div
          className="flex w-full max-w-6xl justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/*
            Variant A — symmetry:
            WEB DESIGNER (left, upper) | photo | AI DEVELOPER (right, lower)
          */}
          <div className="relative aspect-[3/4] w-[4.75rem] min-[390px]:w-[5.25rem] min-[430px]:w-[5.85rem] sm:w-[7.5rem] md:w-40 lg:w-48">
            <img
              src="/elena-portrait.png"
              alt="Elena Arbuzova"
              className="absolute inset-0 z-10 h-full w-full object-cover object-center"
              width={400}
              height={533}
            />

            <p className="absolute top-0 right-full z-30 mr-1.5 whitespace-nowrap text-[8px] font-medium uppercase leading-none tracking-[0.16em] text-foreground [font-family:Inter,sans-serif] min-[390px]:mr-2 min-[390px]:text-[9px] sm:mr-4 sm:text-[11px] sm:tracking-[0.22em] md:mr-5 md:text-xs">
              {t.hero.greetingLeft}
            </p>

            <p className="absolute top-0 left-full z-30 ml-1.5 whitespace-nowrap text-[8px] font-medium uppercase leading-none tracking-[0.14em] text-foreground [font-family:Inter,sans-serif] min-[390px]:ml-2 min-[390px]:text-[9px] sm:ml-4 sm:text-[11px] sm:tracking-[0.22em] md:ml-5 md:text-xs">
              {t.hero.greetingRight}
            </p>

            <h1
              aria-hidden
              className={`absolute right-full bottom-1/2 z-[1] mr-1.5 whitespace-nowrap text-right sm:mr-4 md:mr-5 ${titleClass}`}
            >
              {t.hero.leftLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <h1
              className={`absolute left-full top-1/2 z-[1] ml-1.5 whitespace-nowrap text-left sm:ml-4 md:ml-5 ${titleClass}`}
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
