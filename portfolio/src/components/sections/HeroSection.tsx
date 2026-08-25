import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

const EASE = [0.16, 1, 0.3, 1] as const;
/** Horizontal scrub drifts — same idea as Catalin's data-drift xPercent */
const DRIFTS = [-10, 8, -7] as const;

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

  const x = useTransform(progress, [0, 1], reduced ? ['0%', '0%'] : ['0%', `${drift}%`]);
  const rotate = useTransform(
    progress,
    [0, 1],
    reduced ? [0, 0] : [0, drift > 0 ? 0.35 : -0.35],
  );
  const opacity = useTransform(progress, [0, 0.75, 1], [1, 1, 0.72]);

  return (
    <motion.span
      className={`block will-change-transform ${index === 2 ? 'pl-[clamp(0.5rem,4vw,5rem)]' : ''}`}
      style={{ x, rotate, opacity }}
    >
      <span className="block overflow-hidden">
        <motion.span
          className="inline-block"
          initial={reduced ? false : { y: '115%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.32 + index * 0.14 }}
        >
          <span className={accent ? 'text-neutral-400' : undefined}>{text}</span>
        </motion.span>
      </span>
    </motion.span>
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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.35,
    restDelta: 0.001,
  });

  const metaY = useTransform(smoothProgress, [0, 1], [0, -28]);
  const metaOpacity = useTransform(smoothProgress, [0, 0.55, 1], [1, 0.85, 0.35]);
  const footerY = useTransform(smoothProgress, [0, 1], [0, 40]);
  const footerOpacity = useTransform(smoothProgress, [0, 0.4, 1], [1, 0.7, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-background px-6 pb-[4vh] pt-24 md:pt-28"
    >
      <motion.div style={{ y: metaY, opacity: metaOpacity }}>
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
            progress={smoothProgress}
            accent={index === 1}
          />
        ))}
      </h1>

      <motion.div
        className="mx-auto mt-auto w-full max-w-[1400px]"
        style={{ y: footerY, opacity: footerOpacity }}
      >
        <div className="flex flex-col gap-8 pt-10 sm:flex-row sm:items-end sm:justify-between">
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
      </motion.div>
    </section>
  );
}
