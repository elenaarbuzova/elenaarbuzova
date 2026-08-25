import { useEffect, useState, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';

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

  const scrollToWork = (event: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById('work');
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', '#work');
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20">
      <div className="container mx-auto flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-6 text-center">
        <motion.div
          className="relative z-10 w-full max-w-5xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <h1 className="mb-6 min-h-[2.7em] text-6xl font-bold leading-[0.9] tracking-tighter sm:text-7xl md:text-8xl xl:text-9xl">
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
            className="mx-auto flex w-full max-w-xl flex-col items-center gap-5"
          >
            <p className="text-lg font-medium uppercase tracking-wide md:text-xl">
              {t.hero.role}
            </p>
            <a
              href="#work"
              onClick={scrollToWork}
              className="text-sm font-semibold uppercase tracking-widest border-b border-foreground pb-1 hover:opacity-50 transition-opacity"
            >
              {t.hero.cta}
            </a>
          </motion.div>
        </motion.div>
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
