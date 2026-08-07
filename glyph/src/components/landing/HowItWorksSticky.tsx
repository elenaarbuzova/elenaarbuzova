import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Check,
  Copy,
  FileText,
  Sparkles,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const ORANGE = '#ff4d2e';
const ORANGE_SOFT = '#ff8a3d';

const DOC_CHIPS = [
  { label: 'PDF', x: '8%', y: '14%', delay: 0 },
  { label: 'SOP', x: '68%', y: '10%', delay: 0.15 },
  { label: 'DOCX', x: '74%', y: '52%', delay: 0.3 },
  { label: 'Research Paper', x: '4%', y: '58%', delay: 0.45 },
  { label: 'Markdown', x: '16%', y: '78%', delay: 0.55 },
  { label: 'CSV', x: '58%', y: '76%', delay: 0.65 },
];

const STATUS_LABELS = [
  'Reading documents…',
  'Extracting text…',
  'Indexing…',
  'Building search…',
  'Ready',
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function FloatingParticles({ count = 12 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 11) % 94}%`,
        top: `${(i * 53 + 7) % 90}%`,
        size: 2 + (i % 3),
        duration: 4 + (i % 5),
        delay: (i % 8) * 0.35,
        color: i % 2 === 0 ? ORANGE : ORANGE_SOFT,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            background: d.color,
            boxShadow: `0 0 10px ${d.color}`,
          }}
          animate={{
            y: [0, -12, 0, 8, 0],
            x: [0, 6, 0, -5, 0],
            opacity: [0.12, 0.65, 0.22, 0.5, 0.12],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function StepUploadVisual({ active }: { active: boolean }) {
  return (
    <div className="relative min-h-[200px] overflow-hidden rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-8 text-center">
      <FloatingParticles count={10} />
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          animate={
            active
              ? {
                  y: [0, -5, 0],
                  boxShadow: [
                    '0 0 0 rgba(255,77,46,0)',
                    '0 0 24px rgba(255,77,46,0.35)',
                    '0 0 0 rgba(255,77,46,0)',
                  ],
                }
              : { y: 0 }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-black/[0.06] bg-white"
        >
          <Upload className="h-5 w-5 text-[#ff4d2e]" strokeWidth={1.5} />
        </motion.div>
        <p className="text-sm font-medium text-black">Drop files to upload</p>
        <p className="mt-1.5 text-[11px] text-zinc-400">Protocols · SOPs · Papers · CSV</p>
        <div className="mt-5 h-1 w-32 overflow-hidden rounded-full bg-black/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#ff4d2e] to-[#ff8a3d]"
            animate={active ? { x: ['-100%', '100%'] } : { x: '-100%' }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '55%' }}
          />
        </div>
      </div>
      {DOC_CHIPS.map((chip) => (
        <motion.span
          key={chip.label}
          className="absolute z-20 rounded-full border border-black/[0.06] bg-white/95 px-2.5 py-1 text-[9px] font-medium text-zinc-600 shadow-sm"
          style={{ left: chip.x, top: chip.y }}
          animate={active ? { y: [0, -6, 0] } : { y: 0 }}
          transition={{
            duration: 3,
            delay: chip.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {chip.label}
        </motion.span>
      ))}
    </div>
  );
}

function StepProcessVisual({ active }: { active: boolean }) {
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_LABELS.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [active]);

  const nodes = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = i % 2 === 0 ? 72 : 48;
        return {
          id: i,
          x: 50 + Math.cos(angle) * (r / 1.75),
          y: 50 + Math.sin(angle) * (r / 2),
        };
      }),
    [],
  );

  return (
    <div className="relative min-h-[200px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white/50">
      <FloatingParticles count={12} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
        {nodes.map((n, i) => {
          const next = nodes[(i + 3) % nodes.length];
          return (
            <motion.line
              key={`l-${n.id}`}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke="url(#neuralGradPin)"
              strokeWidth="0.35"
              animate={{ opacity: active ? [0.2, 0.6, 0.2] : 0.15 }}
              transition={{ duration: 2.8, delay: i * 0.1, repeat: Infinity }}
            />
          );
        })}
        <defs>
          <linearGradient id="neuralGradPin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={ORANGE} />
            <stop offset="100%" stopColor={ORANGE_SOFT} />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          animate={active ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          style={{
            background:
              'radial-gradient(circle, rgba(255,77,46,0.18) 0%, rgba(255,138,61,0.08) 45%, transparent 70%)',
            boxShadow: '0 0 28px rgba(255,77,46,0.2)',
          }}
        >
          <Sparkles className="h-6 w-6 text-[#ff4d2e]" strokeWidth={1.5} />
        </motion.div>
      </div>

      {nodes.map((n) => (
        <motion.span
          key={n.id}
          className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff4d2e]"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            boxShadow: '0 0 8px rgba(255,77,46,0.6)',
          }}
          animate={
            active
              ? { scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }
              : { opacity: 0.3 }
          }
          transition={{ duration: 2, delay: n.id * 0.08, repeat: Infinity }}
        />
      ))}

      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <p className="rounded-full border border-black/[0.06] bg-white/95 px-3 py-1 text-[10px] font-medium text-[#ff4d2e] shadow-sm">
          {STATUS_LABELS[statusIdx]}
        </p>
      </div>
    </div>
  );
}

function StepDeployVisual({ active }: { active: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        '<script src="https://labagent.ai/embed.js" data-bot="demo"></script>',
      );
    } catch {
      /* demo */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white/80">
        <div className="flex items-center gap-2 border-b border-black/[0.05] px-3 py-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#ff4d2e]/10 text-[#ff4d2e]">
            <Sparkles className="h-3 w-3" />
          </span>
          <span className="text-[11px] font-medium text-black">Lab Assistant</span>
          <span className="ml-auto rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-medium text-emerald-600">
            Live
          </span>
        </div>
        <div className="space-y-2 p-3">
          <motion.div
            animate={{ opacity: active ? 1 : 0.5 }}
            className="ml-auto max-w-[92%] rounded-2xl rounded-br-md bg-black px-3 py-2 text-[11px] leading-relaxed text-white"
          >
            What protocol should I use for RNA extraction?
          </motion.div>
          <motion.div
            animate={{ opacity: active ? 1 : 0.45 }}
            className="max-w-[95%] rounded-2xl rounded-bl-md border border-[#ff4d2e]/20 bg-[#ff4d2e]/[0.04] px-3 py-2"
          >
            <p className="text-[11px] leading-relaxed text-zinc-700">
              Use SOP-RNA-04 (TRIzol). Lyse on ice, phase-separate, precipitate, wash in 75% ethanol.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md border border-black/[0.06] bg-white px-1.5 py-0.5 text-[9px] text-zinc-500">
                <FileText className="h-2.5 w-2.5 text-[#ff4d2e]" />
                SOP-RNA-04.pdf · p.2
              </span>
              <span className="rounded-md border border-[#ff4d2e]/25 bg-[#ff4d2e]/5 px-1.5 py-0.5 text-[9px] text-[#ff4d2e]">
                97%
              </span>
            </div>
          </motion.div>
        </div>
      </div>
      <button
        type="button"
        onClick={copy}
        className={cn(
          'inline-flex h-9 w-full items-center justify-center gap-2 rounded-full text-[11px] font-semibold text-white transition-colors duration-300',
          copied
            ? 'bg-emerald-600 hover:bg-emerald-600'
            : 'bg-black hover:bg-zinc-800',
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy Embed Code'}
      </button>
    </div>
  );
}

const STEPS = [
  {
    id: '01',
    title: 'Upload documents',
    body: 'Add protocols, SOPs, papers, and data files. LabAgent indexes them for search and citation.',
    Visual: StepUploadVisual,
  },
  {
    id: '02',
    title: 'Build the assistant',
    body: 'Answers come only from the files you uploaded. Each reply shows the source document.',
    Visual: StepProcessVisual,
  },
  {
    id: '03',
    title: 'Use it where you work',
    body: 'Try Chat inside LabAgent, or paste an embed into your lab portal or site.',
    Visual: StepDeployVisual,
  },
] as const;

function cardStyle(index: number, progress: number) {
  // progress 0 → 1 maps across steps: only one card fully visible at a time
  const t = progress * (STEPS.length - 1); // 0 .. 2
  const d = index - t; // 0 = active/centered

  const xPct = d * 108;
  const abs = Math.abs(d);
  const opacity = clamp01(1 - abs * 1.05);
  const scale = lerp(0.92, 1, clamp01(1 - abs));

  return {
    transform: `translate3d(${xPct}%, 0, 0) scale(${scale})`,
    opacity,
    pointerEvents: abs < 0.45 ? ('auto' as const) : ('none' as const),
  };
}

function StoryCard({
  step,
  index,
  progress,
  activeIndex,
}: {
  step: (typeof STEPS)[number];
  index: number;
  progress: number;
  activeIndex: number;
}) {
  const Visual = step.Visual;
  const style = cardStyle(index, progress);

  return (
    <article
      style={style}
      className="absolute inset-0 origin-center overflow-hidden rounded-3xl border border-black/[0.06] bg-white/85 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-md will-change-transform md:p-7"
    >
      <p className="font-mono text-xs tracking-widest text-[#ff4d2e]">{step.id}</p>
      <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-black md:text-2xl">
        {step.title}
      </h3>
      <div className="mt-5">
        <Visual active={activeIndex === index} />
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-zinc-500 md:text-sm">
        {step.body}
      </p>
    </article>
  );
}

export function HowItWorksSticky() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 1.65)}`,
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          const idx = Math.min(
            STEPS.length - 1,
            Math.round(p * (STEPS.length - 1)),
          );
          setActiveIndex(idx);
        },
      });
    }, section);

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how"
      className="relative z-10 flex min-h-[100svh] items-center bg-transparent text-black"
    >
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-6 py-20 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-12 xl:gap-16 lg:py-0">
        <aside className="flex flex-col justify-center lg:min-h-[calc(100svh-8rem)]">
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ff4d2e]">
            How it works
          </p>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-black md:text-5xl lg:text-[3.25rem]">
            From documents
            <br />
            to cited answers
            <br />
            in three steps.
          </h2>
          <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-zinc-500">
            Upload lab documents. Ask a question. Open the source that was cited.
          </p>

          <div className="mt-12 hidden items-center gap-3 lg:flex">
            {STEPS.map((s, i) => (
              <span
                key={s.id}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  i === activeIndex
                    ? 'w-8 bg-[#ff4d2e] shadow-[0_0_12px_rgba(255,77,46,0.45)]'
                    : 'w-1.5 bg-black/15',
                )}
              />
            ))}
            <span className="ml-2 font-mono text-[11px] text-zinc-400">
              0{activeIndex + 1} / 03
            </span>
          </div>
        </aside>

        {/* One card at a time: outgoing slides left, next enters from right */}
        <div className="relative min-h-[70svh] w-full overflow-hidden lg:min-h-[calc(100svh-8rem)]">
          <div className="absolute inset-y-0 left-0 right-0 my-auto h-[min(100%,560px)]">
            {STEPS.map((step, i) => (
              <StoryCard
                key={step.id}
                step={step}
                index={i}
                progress={progress}
                activeIndex={activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
