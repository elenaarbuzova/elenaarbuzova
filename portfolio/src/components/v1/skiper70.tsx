import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

import { cn } from '@/lib/utils';

type Token = { type: 'word'; text: string } | { type: 'br' };

function tokenize(node: React.ReactNode, tokens: Token[] = []): Token[] {
  React.Children.forEach(node, (child) => {
    if (child == null || typeof child === 'boolean') return;

    if (typeof child === 'string' || typeof child === 'number') {
      const lines = String(child).split('\n');
      lines.forEach((line, lineIndex) => {
        if (lineIndex > 0) tokens.push({ type: 'br' });
        line
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .forEach((text) => tokens.push({ type: 'word', text }));
      });
      return;
    }

    if (!React.isValidElement(child)) return;

    if (child.type === 'br') {
      tokens.push({ type: 'br' });
      return;
    }

    const nested = (child.props as { children?: React.ReactNode }).children;
    if (nested) tokenize(nested, tokens);
  });

  return tokens;
}

function normalizeWord(value: string) {
  return value.replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

function useIsNarrow() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return narrow;
}

function Word({
  text,
  index,
  count,
  progress,
  lookahead,
  isHighlight,
  highlightTextClass,
  highlightBgClass,
}: {
  text: string;
  index: number;
  count: number;
  progress: MotionValue<number>;
  lookahead: number;
  isHighlight: boolean;
  highlightTextClass?: string;
  highlightBgClass?: string;
}) {
  const padded = count + lookahead + 2;

  const boxOpacity = useTransform(progress, (p) => {
    const dist = p * padded - lookahead - index;
    if (dist < -lookahead) return 0;
    if (dist < -lookahead * 0.45) {
      return ((dist + lookahead) / (lookahead * 0.55)) * 0.25;
    }
    if (dist < 0) {
      return 0.25 + ((dist + lookahead * 0.45) / (lookahead * 0.45)) * 0.75;
    }
    if (isHighlight) return 1;
    if (dist < 0.85) return 1 - dist / 0.85;
    return 0;
  });

  const textOpacity = useTransform(progress, (p) => {
    const dist = p * padded - lookahead - index;
    if (dist < 0) return 0;
    if (dist < 0.7) return dist / 0.7;
    return 1;
  });

  const boxShadow = useTransform(boxOpacity, (opacity) => {
    const glow = Math.min(opacity, 1);
    return `0 0 ${28 * glow}px rgba(255,255,255,${0.22 * glow})`;
  });

  return (
    <span className="relative mx-[0.12em] my-[0.14em] inline-block">
      <motion.span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-[-0.1em_-0.18em] z-0 rounded-[0.16em] bg-background',
          isHighlight && highlightBgClass,
        )}
        style={{ opacity: boxOpacity, boxShadow }}
      />
      <motion.span
        className={cn('relative z-10', isHighlight && highlightTextClass)}
        style={{ opacity: textOpacity }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export function TextBoxReveal({
  children,
  highlight,
  highlightTextClass,
  highlightBgClass,
  className,
}: {
  children: React.ReactNode;
  highlight?: string;
  highlightTextClass?: string;
  highlightBgClass?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const narrow = useIsNarrow();
  const tokens = tokenize(children);
  const words = tokens.filter((token): token is { type: 'word'; text: string } => token.type === 'word');
  const lookahead = narrow ? 5 : 8;
  const pxPerWord = narrow ? 96 : 132;
  const highlightKey = highlight ? normalizeWord(highlight) : '';

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const plainText = tokens
    .map((token) => (token.type === 'br' ? '\n' : token.text))
    .join(' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/ +/g, ' ')
    .trim();

  if (reducedMotion) {
    return (
      <div className="flex min-h-[70vh] items-center">
        <div className="container mx-auto max-w-5xl px-6 py-24">
          <p className={cn('text-pretty', className)}>{children}</p>
        </div>
      </div>
    );
  }

  let wordIndex = 0;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `calc(100svh + ${Math.max(words.length, 1) * pxPerWord}px)` }}
    >
      <div className="sticky top-0 flex h-svh items-center">
        <div className="container mx-auto max-w-5xl px-6">
          <p
            aria-label={plainText}
            className={cn(
              'text-pretty text-[clamp(1.7rem,4.1vw,3.35rem)] font-medium tracking-tight leading-[1.5]',
              className,
            )}
          >
            {tokens.map((token, i) => {
              if (token.type === 'br') {
                return <br key={`br-${i}`} />;
              }

              const index = wordIndex;
              wordIndex += 1;

              return (
                <Word
                  key={`${token.text}-${index}`}
                  text={token.text}
                  index={index}
                  count={words.length}
                  progress={scrollYProgress}
                  lookahead={lookahead}
                  isHighlight={Boolean(highlightKey) && normalizeWord(token.text) === highlightKey}
                  highlightTextClass={highlightTextClass}
                  highlightBgClass={highlightBgClass}
                />
              );
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Skiper 70 Text reveal box — React
 * Inspired by nvg8.io and adapted from Skiper UI skiper70.
 * Scroll-triggered word boxes: emerge, focus, then dissolve as the word appears.
 */
export { TextBoxReveal as Skiper70 };
