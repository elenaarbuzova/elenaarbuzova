import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Clock, Shield, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Reason = {
  id: string;
  title: string;
  body: string;
  icon: LucideIcon;
  /** Symmetric corner anchor (dot center) */
  anchor: string;
  /** Card sits the same distance from every dot */
  cardPos: string;
  from: { x: number; y: number };
};

const REASONS: Reason[] = [
  {
    id: 'memory',
    title: 'Institutional memory fades',
    body: 'Experts leave. Protocols scatter across drives. LabAgent keeps every SOP answerable.',
    icon: BookOpen,
    // Mirrored corners: 8% inset, 14% from top/bottom — card gap 0.85rem from every dot
    anchor: 'left-[8%] top-[14%] -translate-x-1/2 -translate-y-1/2',
    cardPos: 'left-1/2 top-[calc(100%+0.85rem)] -translate-x-1/2',
    from: { x: 72, y: 64 },
  },
  {
    id: 'compliance',
    title: 'Compliance without friction',
    body: 'Cited answers and provenance trails — ready for GLP review and audit.',
    icon: Shield,
    anchor: 'right-[8%] top-[14%] translate-x-1/2 -translate-y-1/2',
    cardPos: 'left-1/2 top-[calc(100%+0.85rem)] -translate-x-1/2',
    from: { x: -72, y: 64 },
  },
  {
    id: 'onboard',
    title: 'Onboarding takes months',
    body: 'New researchers get the current protocol with page numbers — not a scavenger hunt.',
    icon: Users,
    anchor: 'left-[8%] bottom-[14%] -translate-x-1/2 translate-y-1/2',
    cardPos: 'left-1/2 bottom-[calc(100%+0.85rem)] -translate-x-1/2',
    from: { x: 72, y: -64 },
  },
  {
    id: 'velocity',
    title: 'Decisions wait on search',
    body: 'Seconds to a cited answer instead of hours digging through PDFs.',
    icon: Clock,
    anchor: 'right-[8%] bottom-[14%] translate-x-1/2 translate-y-1/2',
    cardPos: 'left-1/2 bottom-[calc(100%+0.85rem)] -translate-x-1/2',
    from: { x: -72, y: -64 },
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export function ReasonsOrbit({ gather = 0 }: { gather?: number }) {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (gather >= 0.72) setVisible(true);
    else if (gather < 0.28) {
      setVisible(false);
      setActive(null);
    }
  }, [gather]);

  return (
    <section
      id="reasons"
      className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center bg-transparent px-6 py-20"
    >
      <motion.div
        className="relative z-10 mb-6 text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: '#ff4d2e' }}
        >
          Why labs need this
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-black md:text-4xl">
          Knowledge that holds together.
        </h2>
      </motion.div>

      <div className="relative mx-auto h-[min(68vh,600px)] w-full max-w-5xl">
        <AnimatePresence>
          {visible ? (
            <motion.span
              key="awaken-ring"
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/20"
              initial={{ opacity: 0.55, scale: 0.35 }}
              animate={{ opacity: 0, scale: 3.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.15, ease: easeOut }}
            />
          ) : null}
        </AnimatePresence>

        {REASONS.map((r, i) => {
          const delay = 0.18 + i * 0.11;
          const isActive = active === r.id;
          const Icon = r.icon;

          return (
            <div
              key={r.id}
              className={cn('absolute z-20', r.anchor)}
              onMouseEnter={() => setActive(r.id)}
              onMouseLeave={() => setActive(null)}
            >
              <motion.button
                type="button"
                aria-label={r.title}
                className="relative focus:outline-none"
                initial={false}
                animate={
                  visible
                    ? { opacity: 1, x: 0, y: 0, scale: 1 }
                    : {
                        opacity: 0,
                        x: r.from.x,
                        y: r.from.y,
                        scale: 0.2,
                      }
                }
                transition={{
                  opacity: {
                    delay: visible ? delay : 0,
                    duration: visible ? 0.35 : 0.25,
                  },
                  x: {
                    delay: visible ? delay : 0,
                    type: 'spring',
                    stiffness: 280,
                    damping: 22,
                    mass: 0.85,
                  },
                  y: {
                    delay: visible ? delay : 0,
                    type: 'spring',
                    stiffness: 280,
                    damping: 22,
                    mass: 0.85,
                  },
                  scale: {
                    delay: visible ? delay : 0,
                    type: 'spring',
                    stiffness: 320,
                    damping: 16,
                    mass: 0.7,
                  },
                }}
                style={{ pointerEvents: visible ? 'auto' : 'none' }}
                onFocus={() => setActive(r.id)}
                onBlur={() => setActive(null)}
              >
                <span className="relative flex h-14 w-14 items-center justify-center">
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-black/25"
                    initial={false}
                    animate={
                      visible
                        ? { opacity: [0.45, 0], scale: [0.55, 1.85] }
                        : { opacity: 0, scale: 0.55 }
                    }
                    transition={{
                      delay: visible ? delay + 0.28 : 0,
                      duration: 0.7,
                      ease: easeOut,
                    }}
                  />
                  <motion.span
                    aria-hidden
                    className={cn(
                      'absolute inset-[10px] rounded-full bg-black/10',
                      isActive ? 'opacity-55' : 'opacity-30',
                    )}
                    animate={
                      visible && !isActive
                        ? {
                            scale: [1, 1.08, 1],
                            transition: {
                              delay: delay + 0.6,
                              duration: 2.8,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            },
                          }
                        : { scale: isActive ? 1.12 : 1 }
                    }
                  />
                  <motion.span
                    className="relative block h-6 w-6 rounded-full border-[4px] border-white bg-black shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    animate={{ scale: isActive ? 1.14 : 1 }}
                  />
                </span>
              </motion.button>

              <AnimatePresence>
                {isActive ? (
                  <motion.div
                    key={`card-${r.id}`}
                    className={cn(
                      'absolute z-30 w-[260px] rounded-2xl border border-black/10 bg-white px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:w-[280px]',
                      r.cardPos,
                    )}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                  >
                    <div className="flex items-start gap-3 text-left">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ff4d2e]/10 text-[#ff4d2e]">
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold tracking-tight text-black">
                          {r.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                          {r.body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}

        <motion.p
          className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-[11px] tracking-wide text-zinc-400 md:bottom-2"
          initial={false}
          animate={{
            opacity: visible && !active ? 1 : 0,
            y: visible && !active ? 0 : 6,
          }}
          transition={{
            delay: visible && !active ? 0.85 : 0,
            duration: 0.45,
            ease: easeOut,
          }}
        >
          Hover the points
        </motion.p>
      </div>
    </section>
  );
}
