import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, ChevronRight, FileText, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  {
    id: 'protocol',
    title: 'Protocol AI',
    body: 'Step-by-step procedures with critical notes, reagents, and safety callouts preserved.',
  },
  {
    id: 'chat',
    title: 'Scientific chat',
    body: 'Streaming answers with markdown, tables, and inline citations researchers actually use.',
  },
  {
    id: 'library',
    title: 'Knowledge library',
    body: 'Collections, tags, and previews across PDF, DOCX, Markdown, CSV, and papers.',
  },
  {
    id: 'compliance',
    title: 'Compliance-ready',
    body: 'Query provenance, role-based access, and exports designed for GLP / audit review.',
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

const TREE = [
  {
    id: 'sops',
    label: 'SOPs',
    children: ['RNA Extraction', 'PCR', 'Cell Culture'],
  },
  { id: 'pubs', label: 'Publications', children: ['Nature 2024', 'Cell Reports'] },
  { id: 'safety', label: 'Safety Manuals', children: ['BSL-2', 'Chemical'] },
  {
    id: 'trials',
    label: 'Clinical Trials',
    children: ['Phase I notes', 'Endpoints'],
  },
];

function LibraryPreview({ hovered }: { hovered: boolean }) {
  const [open, setOpen] = useState<Record<string, boolean>>({ sops: true });

  useEffect(() => {
    let idx = 0;
    const ids = TREE.map((t) => t.id);
    const tick = () => {
      const id = ids[idx % ids.length];
      setOpen((prev) => {
        const next: Record<string, boolean> = {};
        ids.forEach((k) => {
          next[k] = k === id;
        });
        return next;
      });
      idx += 1;
    };
    tick();
    const ms = hovered ? 1800 : 3200;
    const id = window.setInterval(tick, ms);
    return () => window.clearInterval(id);
  }, [hovered]);

  useEffect(() => {
    if (hovered) {
      setOpen({ sops: true, pubs: true, safety: false, trials: false });
    }
  }, [hovered]);

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-zinc-50/80 p-3">
      <motion.div
        className="mb-3 flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-2.5 py-2"
        animate={{
          boxShadow: [
            '0 0 0 rgba(255,77,46,0)',
            '0 0 0 1px rgba(255,77,46,0.2)',
            '0 0 0 rgba(255,77,46,0)',
          ],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Search className="h-3 w-3 text-zinc-400" />
        <span className="text-[11px] text-zinc-400">Search knowledge…</span>
      </motion.div>

      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
        Knowledge Base
      </p>

      <div className="space-y-1">
        {TREE.map((folder) => {
          const isOpen = !!open[folder.id];
          return (
            <div key={folder.id}>
              <div className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[12px] font-medium text-zinc-700">
                {isOpen ? (
                  <ChevronDown className="h-3 w-3 text-[#ff4d2e]" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-zinc-400" />
                )}
                {folder.label}
              </div>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="ml-5 space-y-0.5 border-l border-black/[0.06] py-0.5 pl-3">
                      {folder.children.map((child) => (
                        <p
                          key={child}
                          className="py-0.5 text-[11px] text-zinc-500"
                        >
                          {child}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const LOGS = [
  'Access Granted',
  'Protocol Updated',
  'Export Generated',
  'Audit Logged',
];

function CompliancePreview({ hovered }: { hovered: boolean }) {
  const [visible, setVisible] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setVisible(n);
      if (n >= LOGS.length) window.clearInterval(id);
    }, hovered ? 320 : 520);
    return () => window.clearInterval(id);
  }, [hovered]);

  useEffect(() => {
    if (!hovered || !listRef.current) return;
    listRef.current.scrollTo({ top: 8, behavior: 'smooth' });
    const t = window.setTimeout(() => {
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
    return () => window.clearTimeout(t);
  }, [hovered]);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-black/[0.06] bg-zinc-50/80 p-3 transition-shadow duration-500',
        hovered && 'shadow-[0_0_0_1px_rgba(255,77,46,0.25),0_0_24px_rgba(255,77,46,0.12)]',
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
          Activity
        </p>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      </div>

      <div ref={listRef} className="max-h-[132px] space-y-1.5 overflow-hidden">
        {LOGS.map((log, i) => (
          <motion.div
            key={log}
            initial={false}
            animate={{
              opacity: i < visible ? 1 : 0,
              y: i < visible ? 0 : 6,
            }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex items-center gap-2 rounded-lg border border-black/[0.04] bg-white px-2.5 py-2"
          >
            <Check className="h-3 w-3 text-emerald-500" strokeWidth={2.5} />
            <span className="text-[11px] text-zinc-600">{log}</span>
          </motion.div>
        ))}
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
          ? LibraryPreview
          : CompliancePreview;

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
          Scientific features
        </p>
        <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-black md:text-5xl">
          Designed for the bench — not the helpdesk.
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
