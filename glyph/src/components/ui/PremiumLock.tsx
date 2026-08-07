import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  className?: string;
  label?: string;
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
};

/** Compact padlock mark — line art, no fills inside the shackle. */
function LockMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 7.25V5.1a3 3 0 0 1 6 0v2.15"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="3.25"
        y="7.25"
        width="9.5"
        height="6.5"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <circle cx="8" cy="10.35" r="0.85" fill="currentColor" />
    </svg>
  );
}

/**
 * Premium gate affordance — quiet lock chip, no glow / neon / pink haze.
 * Reads as a product control, not a decorative badge.
 */
export function PremiumLock({
  className,
  label = 'Research plan',
  size = 18,
  onClick,
}: Props) {
  const [hover, setHover] = useState(false);
  const icon = Math.max(9, Math.round(size * 0.52));

  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <span
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={(e) => {
          if (!onClick) return;
          e.stopPropagation();
          onClick(e);
        }}
        onKeyDown={(e) => {
          if (!onClick) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onClick(e as unknown as React.MouseEvent);
          }
        }}
        aria-label={label}
        className={cn(
          'relative inline-flex cursor-pointer items-center justify-center rounded-full',
          'bg-zinc-100 text-zinc-700',
          'ring-1 ring-black/[0.08]',
          'transition-[transform,background-color,color,box-shadow] duration-200 ease-out',
          'hover:bg-zinc-200 hover:text-zinc-900',
          'active:scale-[0.94]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40',
          'dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/12',
          'dark:hover:bg-zinc-700 dark:hover:text-white',
          'dark:focus-visible:ring-white/25',
        )}
        style={{ width: size, height: size }}
      >
        <LockMark size={icon} />
      </span>

      <AnimatePresence>
        {hover ? (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.18, ease: EASE }}
            className={cn(
              'pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 -translate-x-1/2',
              'whitespace-nowrap rounded-lg px-2.5 py-1.5',
              'border border-black/[0.06] bg-white text-[11px] font-medium tracking-tight text-zinc-800',
              'shadow-[0_6px_20px_rgba(0,0,0,0.08)]',
              'dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]',
            )}
          >
            {label}
            <span
              aria-hidden
              className="absolute left-1/2 top-full -mt-px -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-zinc-900"
            />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
