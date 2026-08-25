import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import heroPortrait from '@assets/generated_images/hero-portrait.png';

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const { t, lang } = useLanguage();
  const lines = t.hero.lines;
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deliverSuffix, setDeliverSuffix] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pauseDot' | 'eraseDot' | 'typeSmile' | 'done'>('typing');

  useEffect(() => {
    setLineIndex(0);
    setCharIndex(0);
    setDeliverSuffix('');
    setPhase('typing');
  }, [lang]);

  useEffect(() => {
    if (phase === 'done') return;

    if (phase === 'typing') {
      if (lineIndex >= lines.length) {
        setPhase('pauseDot');
        return;
      }

      const current = lines[lineIndex];

      if (charIndex < current.length) {
        const timeout = window.setTimeout(() => {
          setCharIndex((prev) => prev + 1);
        }, 90);
        return () => window.clearTimeout(timeout);
      }

      if (lineIndex === lines.length - 1) {
        const timeout = window.setTimeout(() => {
          setDeliverSuffix('.');
          setPhase('pauseDot');
        }, 90);
        return () => window.clearTimeout(timeout);
      }

      const pause = window.setTimeout(() => {
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
      }, 320);

      return () => window.clearTimeout(pause);
    }

    if (phase === 'pauseDot') {
      const timeout = window.setTimeout(() => {
        setPhase('eraseDot');
      }, 450);
      return () => window.clearTimeout(timeout);
    }

    if (phase === 'eraseDot') {
      const timeout = window.setTimeout(() => {
        setDeliverSuffix('');
        setPhase('typeSmile');
      }, 180);
      return () => window.clearTimeout(timeout);
    }

    if (phase === 'typeSmile') {
      if (deliverSuffix.length < 2) {
        const next = ':)'.slice(0, deliverSuffix.length + 1);
        const timeout = window.setTimeout(() => {
          setDeliverSuffix(next);
        }, 120);
        return () => window.clearTimeout(timeout);
      }

      const timeout = window.setTimeout(() => {
        setPhase('done');
      }, 200);
      return () => window.clearTimeout(timeout);
    }
  }, [phase, lineIndex, charIndex, deliverSuffix, lines]);

  const showCursor = phase !== 'done';

  return (
    <section className="relative min-h-screen overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-10 min-h-[calc(100vh-6rem)]">
        <motion.div
          className="relative z-10 w-full max-w-3xl lg:max-w-[54%] shrink-0"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.9] mb-6 min-h-[2.7em] -ml-[0.08em]">
            {lines.map((line, index) => {
              const isPast = index < lineIndex || (index === lineIndex && phase !== 'typing');
              const isCurrent = index === lineIndex && phase === 'typing';
              const isLast = index === lines.length - 1;
              const isFuture = index > lineIndex && phase === 'typing';

              let visible = '';
              if (isPast || phase !== 'typing') {
                visible = isLast ? `${line}${deliverSuffix}` : line;
              } else if (isCurrent) {
                visible = line.slice(0, charIndex);
              }

              const showLineCursor =
                showCursor &&
                !isFuture &&
                ((isCurrent && charIndex <= line.length) ||
                  (isLast && phase !== 'typing' && phase !== 'done'));

              return (
                <span key={`${lang}-${line}`} className="block">
                  {visible || '\u00A0'}
                  {showLineCursor && (
                    <span className="inline-block w-[0.08em] h-[0.85em] bg-foreground ml-1 align-[-0.05em] animate-pulse" />
                  )}
                </span>
              );
            })}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
            className="flex flex-row justify-between items-end w-full gap-6 mt-2"
          >
            <p className="text-lg md:text-xl font-medium tracking-wide uppercase">
              {t.hero.role}
            </p>
            <a
              href="#work"
              className="shrink-0 text-sm font-semibold tracking-widest uppercase border-b border-foreground pb-1 hover:opacity-50 transition-opacity"
            >
              {t.hero.cta}
            </a>
          </motion.div>
        </motion.div>

        <motion.aside
          className="relative z-10 mx-auto lg:mx-0 w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[min(42vw,440px)]"
          initial={{ opacity: 0, x: 56 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.15, ease: EASE, delay: 0.35 }}
          aria-hidden={false}
        >
          <motion.div
            className="relative aspect-[3/4] overflow-hidden bg-muted"
            initial={{ clipPath: 'inset(18% 18% 18% 18%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 1.45, ease: EASE, delay: 0.45 }}
          >
            <motion.img
              src={heroPortrait}
              alt="Elena Arbuzova"
              className="absolute inset-0 h-full w-full object-cover object-[center_18%] will-change-transform"
              initial={{ scale: 1.22, filter: 'brightness(0.7) contrast(1.05)' }}
              animate={{ scale: 1, filter: 'brightness(1) contrast(1)' }}
              transition={{ duration: 1.7, ease: EASE, delay: 0.5 }}
              draggable={false}
            />

            <motion.div
              className="pointer-events-none absolute inset-0 bg-background"
              initial={{ opacity: 0.55 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
            />
          </motion.div>

          <motion.div
            className="absolute -z-10 inset-3 translate-x-3 translate-y-3 border border-foreground/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
            aria-hidden
          />
        </motion.aside>
      </div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.7 }}
        className="absolute bottom-10 left-6 right-6 h-[1px] bg-foreground/20 origin-left"
      />
    </section>
  );
}
