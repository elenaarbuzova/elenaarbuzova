import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  photo: string;
};

const VISIBLE = 3;
const EASE = [0.22, 1, 0.36, 1] as const;

function stackPose(slot: number) {
  if (slot === 0) {
    return { y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 30 };
  }
  if (slot === 1) {
    return { y: 14, scale: 0.97, rotate: -1.2, opacity: 1, zIndex: 20 };
  }
  return { y: 26, scale: 0.94, rotate: 1.4, opacity: 1, zIndex: 10 };
}

const LIFT_NEXT = {
  y: -28,
  scale: 1.02,
  rotate: -2.5,
  opacity: 1,
  zIndex: 40,
};
const LIFT_PREV = {
  y: -28,
  scale: 1.02,
  rotate: 2.5,
  opacity: 1,
  zIndex: 40,
};

type Fly = {
  name: string;
  pose: 'lift' | 'settle';
  dir: 1 | -1;
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function ResearchNetwork({ items }: { items: Testimonial[] }) {
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const [fly, setFly] = useState<Fly | null>(null);
  const busy = useRef(false);

  const goNext = async () => {
    if (busy.current || items.length < 2) return;
    busy.current = true;
    const front = items[order[0]];

    setFly({ name: front.name, pose: 'lift', dir: 1 });
    await wait(420);

    setOrder((prev) => {
      const next = [...prev];
      const first = next.shift()!;
      next.push(first);
      return next;
    });
    setFly({ name: front.name, pose: 'settle', dir: 1 });
    await wait(480);

    setFly(null);
    busy.current = false;
  };

  const goPrev = async () => {
    if (busy.current || items.length < 2) return;
    busy.current = true;
    const backIdx = order[order.length - 1];
    const back = items[backIdx];

    setOrder((prev) => {
      const next = [...prev];
      const last = next.pop()!;
      next.unshift(last);
      return next;
    });
    setFly({ name: back.name, pose: 'lift', dir: -1 });
    await wait(40);
    setFly({ name: back.name, pose: 'settle', dir: -1 });
    await wait(480);

    setFly(null);
    busy.current = false;
  };

  return (
    <section
      id="testimonials"
      className="relative z-10 overflow-hidden bg-transparent px-6 py-24 md:py-32"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff4d2e]">
          From the lab
        </p>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-black md:text-5xl">
              From labs using LabAgent
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500 md:text-base">
              Short notes from discovery and ops teams who need cited answers.
            </p>
          </div>

          <div className="relative w-full max-w-xl lg:max-w-none lg:justify-self-end">
            <div
              className="relative pb-9"
              style={{ perspective: '1400px' }}
              data-testimonial-stage
            >
              {order.map((itemIndex, slot) => {
                if (slot >= VISIBLE) return null;

                const item = items[itemIndex];
                const isFlying = fly?.name === item.name;
                const isFront = slot === 0;

                let target = stackPose(Math.min(slot, VISIBLE - 1));
                if (isFlying && fly.pose === 'lift') {
                  target = fly.dir === 1 ? LIFT_NEXT : LIFT_PREV;
                } else if (isFlying && fly.pose === 'settle') {
                  target =
                    fly.dir === 1 ? stackPose(VISIBLE - 1) : stackPose(0);
                }

                const settlingAway = isFlying && fly?.pose === 'settle';
                const revealUnder =
                  fly?.pose === 'lift' && fly.dir === 1 && slot === 1;
                const showContent =
                  !settlingAway && (isFront || revealUnder);

                return (
                  <motion.article
                    key={item.name}
                    initial={false}
                    animate={target}
                    transition={{
                      duration: isFlying && fly?.pose === 'lift' ? 0.4 : 0.5,
                      ease: EASE,
                    }}
                    className={cn(
                      'origin-bottom overflow-hidden rounded-[1.75rem] bg-white will-change-transform md:rounded-[2rem]',
                      isFront
                        ? 'relative z-10'
                        : 'absolute inset-x-0 top-0 bottom-0',
                      isFront && !isFlying
                        ? 'pointer-events-auto'
                        : 'pointer-events-none',
                    )}
                    style={{
                      transformStyle: 'preserve-3d',
                      boxShadow:
                        isFront && !isFlying
                          ? '0 22px 60px rgba(0,0,0,0.1)'
                          : '0 10px 28px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div
                      aria-hidden
                      className={cn(
                        'absolute inset-0 rounded-[inherit] bg-white transition-opacity duration-300',
                        showContent ? 'opacity-0' : 'opacity-100',
                      )}
                    />

                    <motion.div
                      className="relative px-7 py-5 text-left md:px-9 md:py-6"
                      animate={{ opacity: showContent ? 1 : 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                    >
                      <p className="font-display text-[15px] font-medium leading-relaxed tracking-tight text-zinc-800 md:text-[17px] md:leading-[1.4]">
                        “{item.quote}”
                      </p>

                      <footer className="mt-5 flex items-center gap-3.5">
                        <img
                          src={item.photo}
                          alt=""
                          width={44}
                          height={44}
                          className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                          loading="lazy"
                          decoding="async"
                        />
                        <div>
                          <p className="text-sm font-semibold text-black">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-400">
                            {item.role}
                          </p>
                        </div>
                      </footer>
                    </motion.div>
                  </motion.article>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => void goPrev()}
              aria-label="Previous testimonial"
              className={cn(
                'absolute left-0 top-[38%] z-50 flex h-11 w-11 -translate-x-[calc(50%+0.75rem)] -translate-y-1/2 items-center justify-center',
                'rounded-full border border-black/5 bg-white/90 text-zinc-600 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md',
                'transition-all duration-300 hover:border-[#ff4d2e]/25 hover:text-[#ff4d2e]',
                'md:-translate-x-[calc(50%+1.25rem)]',
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => void goNext()}
              aria-label="Next testimonial"
              className={cn(
                'absolute right-0 top-[38%] z-50 flex h-11 w-11 translate-x-[calc(50%+0.75rem)] -translate-y-1/2 items-center justify-center',
                'rounded-full border border-black/5 bg-white/90 text-zinc-600 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md',
                'transition-all duration-300 hover:border-[#ff4d2e]/25 hover:text-[#ff4d2e]',
                'md:translate-x-[calc(50%+1.25rem)]',
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
