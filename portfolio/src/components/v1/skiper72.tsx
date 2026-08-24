import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

import { cn } from '@/lib/utils';

function extractText(node: React.ReactNode): string {
  const parts: string[] = [];

  React.Children.forEach(node, (child) => {
    if (child == null || typeof child === 'boolean') return;
    if (typeof child === 'string' || typeof child === 'number') {
      parts.push(String(child));
      return;
    }
    if (!React.isValidElement(child)) return;
    if (child.type === 'br') {
      parts.push(' ');
      return;
    }
    const nested = (child.props as { children?: React.ReactNode }).children;
    if (nested) parts.push(extractText(nested));
  });

  return parts.join(' ').replace(/\s+/g, ' ').trim();
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

function Word({
  text,
  index,
  count,
  progress,
}: {
  text: string;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  // Spread word reveals across most of the scroll, leaving a short settle at the end.
  const start = count <= 1 ? 0 : (index / count) * 0.78;
  const end = Math.min(start + 0.18, 0.92);

  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  const x = useTransform(progress, [start, end], [72, 0]);
  const skewX = useTransform(progress, [start, end], [14, 0]);
  const filter = useTransform(progress, [start, end], ['blur(6px)', 'blur(0px)']);

  return (
    <motion.span
      className="mr-[0.28em] inline-block will-change-transform"
      style={{
        opacity,
        x,
        skewX,
        filter,
        transformOrigin: 'left center',
      }}
    >
      {text}
    </motion.span>
  );
}

export function SkiperTextRevealH({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const plainText = extractText(children);
  const words = plainText.split(/\s+/).filter(Boolean);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  if (reducedMotion) {
    return (
      <div className="flex min-h-[70vh] items-center">
        <div className="container mx-auto max-w-5xl px-6 py-24">
          <p className={cn('text-pretty', className)}>{plainText}</p>
        </div>
      </div>
    );
  }

  const scrollHeight = `calc(100svh + ${Math.max(words.length, 1) * 110}px)`;

  return (
    <div ref={containerRef} className="relative" style={{ height: scrollHeight }}>
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="container mx-auto max-w-5xl px-6">
          <p
            aria-label={plainText}
            className={cn(
              'text-pretty text-[clamp(1.7rem,4.1vw,3.35rem)] font-medium tracking-tight leading-[1.45]',
              className,
            )}
          >
            {words.map((word, index) => (
              <Word
                key={`${word}-${index}`}
                text={word}
                index={index}
                count={words.length}
                progress={scrollYProgress}
              />
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Skiper 72 Horizontal Text reveal — React
 * Inspired by made-with-gsap patterns and adapted from Skiper UI skiper72.
 * Sticky scroll: words arrive from the right with skew, blur, and opacity.
 */
export { SkiperTextRevealH as Skiper72 };
