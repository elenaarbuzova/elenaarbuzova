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
    return Math.max(0.16, 1 - d * 0.52);
  });

  const scale = useTransform(progress, (p) => {
    const d = Math.abs(p * span - index);
    return Math.max(0.84, 1 - d * 0.07);
  });

  const filter = useTransform(progress, (p) => {
    const d = Math.abs(p * span - index);
    return `blur(${Math.min(5, d * 2.5)}px)`;
  });

  return (
    <motion.li
      className="origin-left py-2 text-5xl font-bold tracking-tighter text-foreground will-change-transform sm:text-6xl md:py-2.5 md:text-7xl lg:text-8xl"
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
    [0, -Math.max(items.length - 1, 0) * 92],
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
      <div className="sticky top-0 h-svh w-full bg-background">
        {/* Full-bleed soft mask — no mid-column overflow clip that cuts blur into a hard line */}
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)',
          }}
        >
          <div className="mx-auto flex h-full w-full max-w-[72rem] items-center px-6 md:px-8">
            <div className="w-full pl-0 md:pl-[min(42%,22rem)]">
              <div className="relative h-[22rem] sm:h-[26rem] md:h-[30rem]">
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

        <div className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[72rem] items-center px-6 md:px-8">
          <p className="w-[min(100%,16rem)] text-2xl font-medium tracking-tight text-foreground md:w-[min(42%,20rem)] md:text-3xl lg:text-4xl">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
