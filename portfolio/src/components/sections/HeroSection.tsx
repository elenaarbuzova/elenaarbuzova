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
      <div className="flex flex-1 items-center justify-center px-6 pb-24 pt-28 md:pb-28 md:pt-32">
        <motion.div
          className="relative w-full max-w-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-8 lg:gap-10">
            <h1 className="shrink-0 text-[clamp(3.25rem,14vw,11.5rem)] font-black uppercase leading-none tracking-[-0.06em] text-foreground [font-family:Inter,sans-serif]">
              {t.hero.left}
            </h1>

            <div className="relative z-10 shrink-0 self-center">
              <p className="absolute -top-7 left-1/2 w-max -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.22em] text-foreground [font-family:Inter,sans-serif] sm:-top-8 sm:text-xs md:-top-9">
                Elena Arbuzova
              </p>
              <div className="overflow-hidden bg-muted aspect-[3/4] w-[4.5rem] sm:w-24 md:w-28 lg:w-32">
                <img
                  src="/elena-portrait.png"
                  alt="Elena Arbuzova"
                  className="h-full w-full object-cover object-[center_20%] grayscale"
                  width={256}
                  height={341}
                />
              </div>
            </div>

            <h1 className="shrink-0 text-[clamp(2rem,8.5vw,7.5rem)] font-black uppercase leading-none tracking-[-0.06em] text-foreground [font-family:Inter,sans-serif]">
              {t.hero.right}
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
            className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground hover:opacity-50 transition-opacity"
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
