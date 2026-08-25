import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

const EASE = [0.16, 1, 0.3, 1] as const;
const DRIFTS = [-8, 6, -5] as const;

function HeroLine({
  text,
  index,
  progress,
  accent,
}: {
  text: string;
  index: number;
  progress: MotionValue<number>;
  accent?: boolean;
}) {
  const reduced = useReducedMotion();
  const drift = DRIFTS[index] ?? 0;
  const y = useTransform(progress, [0, 1], reduced ? [0, 0] : [0, drift * 4]);

  return (
    <span
      className={`block overflow-hidden ${index === 2 ? 'pl-[clamp(0.5rem,4vw,5rem)]' : ''}`}
    >
      <motion.span
        className="inline-block will-change-transform"
        style={{ y }}
        initial={reduced ? false : { y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.05, ease: EASE, delay: 0.28 + index * 0.12 }}
      >
        <span className={accent ? 'text-neutral-400' : undefined}>{text}</span>
      </motion.span>
    </span>
  );
}

export function HeroSection() {
  const { t, lang } = useLanguage();
  const lines = t.hero.lines;
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-background px-6 pb-[4vh] pt-24 md:pt-28"
    >
      <motion.div
        className="mx-auto flex w-full max-w-[1400px] justify-between gap-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      >
        <p className="flex items-center gap-2.5">
          <span className="inline-block size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden />
          <span>
            Elena Arbuzova — {t.hero.role}
          </span>
        </p>
        <p className="shrink-0 text-right">Portfolio — 2026</p>
      </motion.div>

      <h1
        key={lang}
        className="mx-auto mt-[clamp(2.5rem,8vh,6rem)] w-full max-w-[1400px] text-[clamp(2.75rem,9.5vw,9.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.035em]"
      >
        {lines.map((line, index) => (
          <HeroLine
            key={`${lang}-${line}`}
            text={line}
            index={index}
            progress={scrollYProgress}
            accent={index === 1}
          />
        ))}
      </h1>

      <div className="mx-auto mt-auto flex w-full max-w-[1400px] flex-col gap-8 pt-10 sm:flex-row sm:items-end sm:justify-between">
        <motion.a
          href="#work"
          className="max-w-[38ch] text-[clamp(0.95rem,1.15vw,1.1rem)] leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.75 }}
        >
          {t.hero.cta}
        </motion.a>

        <motion.a
          href="#about"
          className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.85 }}
        >
          <span
            className="size-2 shrink-0 rounded-full bg-foreground animate-pulse"
            aria-hidden
          />
          Scroll
        </motion.a>
      </div>
    </section>
  );
}
