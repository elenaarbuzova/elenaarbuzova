import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Code2, FileText, MessageCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  {
    id: 'protocol',
    title: 'Protocols',
    body: 'Steps and notes stay readable after you upload a protocol.',
  },
  {
    id: 'chat',
    title: 'Chat',
    body: 'Ask in plain language. Answers stream with source citations.',
  },
  {
    id: 'projects',
    title: 'Projects',
    body: 'Switch between Oncology, PCR, and Genetics workspaces.',
  },
  {
    id: 'embed',
    title: 'Embed',
    body: 'Copy a script or iframe and place the assistant on your lab site.',
  },
] as const;

function ProtocolPreview({ hovered }: { hovered: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-zinc-50/80 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04]">
          <FileText className="h-4 w-4 text-[#ff4d2e]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-medium text-black">
            Protocol_RNA_Extraction.pdf
          </p>
          <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600">
            <Check className="h-3 w-3" strokeWidth={2.5} />
            Indexed
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {['SOP', 'Protocol', 'PCR'].map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-black/[0.06] bg-white px-2 py-0.5 text-[10px] text-zinc-500"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl border border-black/[0.05] bg-white p-3">
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-10 h-px bg-gradient-to-r from-transparent via-[#ff4d2e] to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{
            duration: hovered ? 1.8 : 3.6,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: hovered ? 0.2 : 0.8,
          }}
          style={{ boxShadow: '0 0 12px rgba(255,77,46,0.45)' }}
        />
        <motion.p
          className="text-[11px] leading-relaxed text-zinc-500"
          animate={
            hovered
              ? {
                  color: ['#71717a', '#ff4d2e', '#71717a'],
                }
              : { color: '#71717a' }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          Lyse cells on ice with TRIzol. Phase-separate with chloroform.
          Precipitate RNA with isopropanol and wash twice in 75% ethanol.
        </motion.p>
      </div>

      {/* Soft local dust */}
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-[#ff4d2e]/50"
          style={{ left: `${18 + i * 22}%`, top: `${30 + (i % 2) * 28}%` }}
          animate={{
            y: [0, -6, 0, 4, 0],
            opacity: [0.2, 0.55, 0.25],
          }}
          transition={{
            duration: 3.5 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

function ChatPreview({ hovered }: { hovered: boolean }) {
  const [typed, setTyped] = useState('');
  const [showCites, setShowCites] = useState(0);
  const full =
    'Use SOP-RNA-04 (TRIzol). Lyse on ice, phase-separate, precipitate, then wash in 75% ethanol.';

  useEffect(() => {
    let i = 0;
    let citeTimer: number | undefined;
    setTyped('');
    setShowCites(0);

    const speed = hovered ? 12 : 22;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(id);
        citeTimer = window.setInterval(() => {
          setShowCites((c) => {
            if (c >= 2) {
              if (citeTimer) window.clearInterval(citeTimer);
              return c;
            }
            return c + 1;
          });
        }, hovered ? 280 : 450);
      }
    }, speed);

    return () => {
      window.clearInterval(id);
      if (citeTimer) window.clearInterval(citeTimer);
    };
  }, [hovered]);

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-zinc-50/80">
      <div className="border-b border-black/[0.05] px-3 py-2 text-[10px] font-medium text-zinc-400">
        Lab Assistant
      </div>
      <div className="space-y-2.5 p-3">
        <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-md bg-black px-3 py-2 text-[11px] leading-relaxed text-white">
          What protocol should I use for RNA extraction?
        </div>
        <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-[#ff4d2e]/15 bg-white px-3 py-2">
          <p className="min-h-[2.6rem] text-[11px] leading-relaxed text-zinc-700">
            {typed}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              className="ml-0.5 inline-block h-3 w-[1.5px] translate-y-[2px] bg-[#ff4d2e]"
            />
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <AnimatePresence>
              {showCites >= 1 ? (
                <motion.span
                  key="p17"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-md border border-black/[0.06] bg-zinc-50 px-1.5 py-0.5 text-[9px] text-zinc-500"
                >
                  Page 17
                </motion.span>
              ) : null}
              {showCites >= 2 ? (
                <motion.span
                  key="pdf"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    boxShadow: hovered
                      ? [
                          '0 0 0 rgba(255,77,46,0)',
                          '0 0 10px rgba(255,77,46,0.25)',
                          '0 0 0 rgba(255,77,46,0)',
                        ]
                      : '0 0 0 rgba(255,77,46,0)',
                  }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="rounded-md border border-[#ff4d2e]/20 bg-[#ff4d2e]/5 px-1.5 py-0.5 text-[9px] text-[#ff4d2e]"
                >
                  RNA_Protocol.pdf
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

const PROJECTS = [
  {
    id: 'oncology',
    name: 'Oncology R&D',
    count: '04',
    color: 'bg-violet-500',
    shape: 'square' as const,
    docs: ['CRISPR_guide.pdf', 'Cell_line_SOP.docx'],
  },
  {
    id: 'pcr',
    name: 'Clinical PCR Trials',
    count: '02',
    color: 'bg-teal-400',
    shape: 'diamond' as const,
    docs: ['Assay_QC_Q2.csv', 'Primer_map.md'],
  },
  {
    id: 'genetics',
    name: 'Genetics Archive',
    count: '09',
    color: 'bg-amber-500',
    shape: 'circle' as const,
    docs: ['Nature_2024_mRNA.pdf', 'SOP-042.docx'],
  },
];

function ProjectDot({
  color,
  shape,
}: {
  color: string;
  shape: 'square' | 'diamond' | 'circle';
}) {
  return (
    <span
      className={cn(
        'h-2 w-2 shrink-0',
        color,
        shape === 'square' && 'rounded-[2px]',
        shape === 'diamond' && 'rotate-45 rounded-[1px]',
        shape === 'circle' && 'rounded-full',
      )}
    />
  );
}

function ProjectsPreview({ hovered }: { hovered: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ms = hovered ? 1600 : 2800;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % PROJECTS.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [hovered]);

  const project = PROJECTS[active];

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-zinc-50/80 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
          Workspaces
        </p>
        <Plus
          className="h-3.5 w-3.5 shrink-0 text-zinc-400"
          strokeWidth={2.25}
          aria-hidden
        />
      </div>

      <div className="space-y-1">
        {PROJECTS.map((p, i) => {
          const selected = i === active;
          return (
            <motion.div
              key={p.id}
              animate={{
                backgroundColor: selected
                  ? 'rgba(255,255,255,1)'
                  : 'rgba(255,255,255,0)',
              }}
              transition={{ duration: 0.35, ease: EASE }}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-2 py-2',
                selected && 'ring-1 ring-black/[0.06] shadow-[0_4px_14px_rgba(0,0,0,0.04)]',
              )}
            >
              <ProjectDot color={p.color} shape={p.shape} />
              <span
                className={cn(
                  'min-w-0 flex-1 truncate text-[12px] font-medium',
                  selected ? 'text-zinc-900' : 'text-zinc-500',
                )}
              >
                {p.name}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-zinc-400">
                {p.count}
              </span>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="mt-3 rounded-xl border border-black/[0.05] bg-white px-2.5 py-2"
        >
          <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-zinc-400">
            Active docs
          </p>
          <div className="space-y-1">
            {project.docs.map((doc) => (
              <div key={doc} className="flex items-center gap-2">
                <FileText className="h-3 w-3 shrink-0 text-[#ff4d2e]" />
                <span className="truncate text-[11px] text-zinc-600">{doc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const SNIPPET_LINES = [
  { tone: 'muted', text: '<script' },
  { tone: 'code', text: '  src="labagent.ai/embed.js"' },
  { tone: 'code', text: '  data-bot="helix-lab"' },
  { tone: 'muted', text: '></script>' },
];

function EmbedPreview({ hovered }: { hovered: boolean }) {
  const [visible, setVisible] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setVisible(0);
    setCopied(false);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setVisible(n);
      if (n >= SNIPPET_LINES.length) {
        window.clearInterval(id);
        window.setTimeout(() => setCopied(true), hovered ? 200 : 400);
      }
    }, hovered ? 180 : 320);
    return () => window.clearInterval(id);
  }, [hovered]);

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-zinc-50/80 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
          Embed code
        </p>
        <motion.span
          animate={{ opacity: copied ? 1 : 0.35 }}
          className={cn(
            'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-medium',
            copied
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-white text-zinc-400 ring-1 ring-black/[0.06]',
          )}
        >
          {copied ? (
            <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
          ) : (
            <Code2 className="h-2.5 w-2.5" />
          )}
          {copied ? 'Copied' : 'script'}
        </motion.span>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white px-3 py-2.5 font-mono">
        {SNIPPET_LINES.map((line, i) => (
          <motion.p
            key={line.text}
            initial={false}
            animate={{
              opacity: i < visible ? 1 : 0,
              x: i < visible ? 0 : -4,
            }}
            transition={{ duration: 0.28, ease: EASE }}
            className={cn(
              'text-[10px] leading-5',
              line.tone === 'muted' ? 'text-zinc-400' : 'text-[#ff4d2e]',
            )}
          >
            {line.text}
          </motion.p>
        ))}
      </div>

      <div className="relative mt-3 h-[72px] overflow-hidden rounded-xl border border-black/[0.05] bg-white">
        <div className="absolute inset-x-0 top-0 flex h-7 items-center gap-1.5 border-b border-black/[0.04] px-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
          <span className="ml-1 truncate text-[9px] text-zinc-400">
            your-lab.com
          </span>
        </div>
        <motion.div
          className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
          animate={
            hovered
              ? { scale: [1, 1.06, 1], y: [0, -2, 0] }
              : { scale: 1, y: 0 }
          }
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  const Preview =
    index === 0
      ? ProtocolPreview
      : index === 1
        ? ChatPreview
        : index === 2
          ? ProjectsPreview
          : EmbedPreview;

  return (
    <motion.article
      data-feature-card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex h-full flex-col rounded-3xl border border-black/5 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:p-10"
      whileHover={{
        y: -6,
        boxShadow: '0 18px 48px rgba(0,0,0,0.08)',
        borderColor: 'rgba(0,0,0,0.12)',
      }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <motion.h3
        className="text-lg font-semibold tracking-tight text-black"
        animate={{ y: hovered ? -2 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {feature.title}
      </motion.h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{feature.body}</p>
      <div className="mt-6 flex-1">
        <Preview hovered={hovered} />
      </div>
    </motion.article>
  );
}

export function FeatureShowcase() {
  return (
    <section
      id="features"
      className="relative z-10 overflow-hidden bg-transparent px-6 py-24 md:py-32"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff4d2e]">
          Product
        </p>
        <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-black md:text-5xl">
          Built for bench work.
        </h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
