import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

import { cn } from '@/lib/utils';

export const TOOLS = [
  'Cursor',
  'Figma',
  'Codex',
  'Claude',
  'Midjourney',
  'Gemini',
] as const;

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

function ToolItem({
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
  const span = Math.max(count - 1, 1);

  const opacity = useTransform(progress, (p) => {
    const d = Math.abs(p * span - index);
    return Math.max(0.2, 1 - d * 0.45);
  });

  const scale = useTransform(progress, (p) => {
    const d = Math.abs(p * span - index);
    return Math.max(0.78, 1 - d * 0.1);
  });

  const filter = useTransform(progress, (p) => {
    const d = Math.abs(p * span - index);
    return `blur(${Math.min(10, d * 5)}px)`;
  });

  return (
    <motion.li
      className="origin-left py-1.5 text-5xl font-bold tracking-tighter text-foreground will-change-transform sm:py-2 sm:text-6xl md:text-7xl lg:text-8xl"
      style={{ opacity, scale, filter }}
    >
      {text}
    </motion.li>
  );
}

/**
 * Skiper 44 — Vercel scroll with blur (local recreation).
 * Sticky “I work with” + tool list that sharpens as you scroll.
 */
export function Skiper44({
  label,
  items = [...TOOLS],
  className,
}: {
  label: string;
  items?: string[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const listY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -Math.max(items.length - 1, 0) * 88],
  );

  if (reducedMotion) {
    return (
      <div className={cn('container mx-auto px-6 py-24 md:py-32', className)}>
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <p className="text-xl font-medium tracking-tight md:text-3xl">{label}</p>
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item}
                className="text-4xl font-bold tracking-tighter md:text-6xl"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative bg-background', className)}
      style={{ height: `${Math.max(items.length, 1) * 90}vh` }}
    >
      <div className="sticky top-0 flex h-svh w-full items-center">
        <div className="container mx-auto grid w-full grid-cols-1 items-center gap-10 px-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16 lg:gap-24">
          <p className="text-2xl font-medium tracking-tight text-foreground md:text-3xl lg:text-4xl">
            {label}
          </p>

          <div className="relative h-[22rem] overflow-hidden sm:h-[26rem] md:h-[30rem]">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-background via-background/80 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-background via-background/80 to-transparent"
              aria-hidden
            />

            <div className="absolute left-0 right-0 top-1/2 w-full">
              <motion.ul className="w-full" style={{ y: listY }}>
                {items.map((item, index) => (
                  <ToolItem
                    key={item}
                    text={item}
                    index={index}
                    count={items.length}
                    progress={scrollYProgress}
                  />
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
