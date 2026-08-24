import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

import { cn } from '@/lib/utils';

const TOOLS = [
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
    const active = p * span;
    const d = Math.abs(active - index);
    return Math.max(0.12, 1 - d * 0.55);
  });

  const scale = useTransform(progress, (p) => {
    const active = p * span;
    const d = Math.abs(active - index);
    return Math.max(0.72, 1 - d * 0.14);
  });

  const blur = useTransform(progress, (p) => {
    const active = p * span;
    const d = Math.abs(active - index);
    return Math.min(14, d * 7);
  });

  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.li
      className="origin-left py-2 text-5xl font-bold tracking-tighter will-change-transform sm:text-6xl md:text-7xl lg:text-8xl"
      style={{ opacity, scale, filter }}
    >
      {text}
    </motion.li>
  );
}

/**
 * Skiper 44 — Vercel scroll with blur (recreated locally).
 * Sticky label + tool list that sharpens / blurs as you scroll.
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
    ['18%', `${-18 - Math.max(items.length - 1, 0) * 12}%`],
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

  const scrollHeight = `calc(${Math.max(items.length, 1) * 85}vh)`;

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="container mx-auto grid w-full grid-cols-1 items-center gap-8 px-6 md:grid-cols-2 md:gap-12 lg:gap-20">
          <p className="max-w-md text-2xl font-medium tracking-tight md:text-3xl lg:text-4xl">
            {label}
          </p>

          <div className="relative flex h-[min(52vh,28rem)] items-center overflow-hidden md:h-[min(60vh,34rem)]">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-background to-transparent md:h-24"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-background to-transparent md:h-24"
              aria-hidden
            />

            <motion.ul className="relative w-full" style={{ y: listY }}>
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
  );
}

export { TOOLS };
