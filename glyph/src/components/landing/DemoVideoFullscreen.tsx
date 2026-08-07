import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  FileText,
  Home,
  MessageSquare,
  Pause,
  Play,
  Plus,
  Puzzle,
  Search,
  Send,
} from 'lucide-react';
import { Logo, LogoMark } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

const ACCENT = '#ff4d2e';
const EASE = [0.22, 1, 0.36, 1] as const;

/** Screen-recording style chapters */
type Beat =
  | 'overview'
  | 'knowledge'
  | 'chat-type'
  | 'chat-answer'
  | 'widget'
  | 'analytics'
  | 'end';

type Chapter = {
  id: Beat;
  label: string;
  caption: string;
  duration: number;
  /** Cursor target inside the app frame, % */
  cursor: { x: number; y: number };
  click?: boolean;
};

const CHAPTERS: Chapter[] = [
  {
    id: 'overview',
    label: 'Overview',
    caption: 'Your lab workspace at a glance',
    duration: 3200,
    cursor: { x: 18, y: 42 },
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    caption: 'Upload protocols — they index automatically',
    duration: 4800,
    cursor: { x: 18, y: 52 },
    click: true,
  },
  {
    id: 'chat-type',
    label: 'Chat',
    caption: 'Ask about a protocol in plain language',
    duration: 4200,
    cursor: { x: 55, y: 82 },
    click: true,
  },
  {
    id: 'chat-answer',
    label: 'Citations',
    caption: 'Every answer links back to the source page',
    duration: 4800,
    cursor: { x: 48, y: 58 },
  },
  {
    id: 'widget',
    label: 'Widget',
    caption: 'Embed the same assistant on your lab site',
    duration: 4600,
    cursor: { x: 18, y: 62 },
    click: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    caption: 'See what researchers ask and cite',
    duration: 4400,
    cursor: { x: 18, y: 70 },
    click: true,
  },
  {
    id: 'end',
    label: 'LabAgent',
    caption: 'Documents in. Cited answers out.',
    duration: 3600,
    cursor: { x: 50, y: 50 },
  },
];

const TOTAL = CHAPTERS.reduce((s, c) => s + c.duration, 0);

function at(ms: number) {
  let t = ((ms % TOTAL) + TOTAL) % TOTAL;
  for (let i = 0; i < CHAPTERS.length; i++) {
    if (t < CHAPTERS[i].duration) {
      return { i, ch: CHAPTERS[i], local: t, p: t / CHAPTERS[i].duration };
    }
    t -= CHAPTERS[i].duration;
  }
  return { i: 0, ch: CHAPTERS[0], local: 0, p: 0 };
}

function Rail({ active }: { active: string }) {
  const items = [
    { id: 'overview', icon: Home },
    { id: 'chat', icon: MessageSquare },
    { id: 'knowledge', icon: BookOpen },
    { id: 'widget', icon: Puzzle },
    { id: 'analytics', icon: BarChart3 },
  ];
  const map: Record<string, string> = {
    overview: 'overview',
    knowledge: 'knowledge',
    'chat-type': 'chat',
    'chat-answer': 'chat',
    widget: 'widget',
    analytics: 'analytics',
    end: 'overview',
  };
  const current = map[active] ?? 'overview';

  return (
    <div className="flex w-14 shrink-0 flex-col items-center gap-2.5 rounded-[1.35rem] bg-[#f3f3f4] py-4">
      <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white">
        <Plus className="h-4 w-4" strokeWidth={2.25} />
      </div>
      {items.map(({ id, icon: Icon }) => {
        const on = id === current;
        return (
          <div
            key={id}
            className={cn(
              'relative flex h-9 w-9 items-center justify-center rounded-full transition-colors',
              on ? 'text-white' : 'text-zinc-400',
            )}
          >
            {on ? (
              <span
                className="absolute inset-0 rounded-full shadow-[0_6px_20px_rgba(255,77,46,0.4)]"
                style={{ background: ACCENT }}
              />
            ) : null}
            <Icon className="relative h-4 w-4" strokeWidth={1.75} />
          </div>
        );
      })}
    </div>
  );
}

function ScreenOverview({ p }: { p: number }) {
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            Overview
          </p>
          <h3 className="font-display text-xl font-bold tracking-tight text-zinc-950">
            Good morning, Researcher
          </h3>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-white"
          style={{ background: ACCENT }}
        >
          Research
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {[
          { l: 'Documents', v: '48' },
          { l: 'Chats', v: '126' },
          { l: 'Sources cited', v: '842' },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.06 }}
            className="rounded-2xl border border-zinc-200/90 bg-white p-3"
          >
            <p className="text-[10px] text-zinc-400">{s.l}</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-zinc-950">
              {s.v}
            </p>
          </motion.div>
        ))}
        <div className="col-span-2 rounded-2xl border border-zinc-200/90 bg-white p-3">
          <p className="text-[11px] font-semibold text-zinc-800">Recent activity</p>
          <div className="mt-2 space-y-1.5">
            {[
              'SOP-014 indexed',
              'CRISPR storage question',
              'Widget published',
            ].map((t, i) => (
              <div
                key={t}
                className="flex items-center gap-2 text-[11px] text-zinc-500"
                style={{ opacity: p > 0.15 + i * 0.12 ? 1 : 0.35 }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: ACCENT }}
                />
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-3">
          <p className="text-[11px] font-semibold text-zinc-800">Knowledge health</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
            <motion.div
              className="h-full rounded-full"
              style={{ background: ACCENT }}
              initial={{ width: '0%' }}
              animate={{ width: '92%' }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          </div>
          <p className="mt-2 text-[10px] text-zinc-400">92% indexed</p>
        </div>
      </div>
    </div>
  );
}

function ScreenKnowledge({ p }: { p: number }) {
  const files = [
    { name: 'SOP-014 CRISPR Storage.pdf', ok: p > 0.25 },
    { name: 'PCR Preparation Protocol.docx', ok: p > 0.45 },
    { name: 'mRNA Stability Review.pdf', ok: p > 0.65 },
    { name: 'Cell Culture Handbook.pdf', ok: p > 0.8 },
  ];

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            Knowledge
          </p>
          <h3 className="font-display text-lg font-bold text-zinc-950">
            Document library
          </h3>
        </div>
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
          style={{ background: ACCENT }}
        >
          <Plus className="h-3 w-3" />
          Upload
        </div>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
        <div className="h-9 rounded-full border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-[12px] leading-9 text-zinc-400">
          Search documents…
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-hidden">
        {files.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white px-3 py-2.5"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: 'rgba(255,77,46,0.1)', color: ACCENT }}
            >
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-zinc-900">{f.name}</p>
              <p className="text-[10px] text-zinc-400">
                {f.ok ? 'Ready · cited in chat' : 'Indexing…'}
              </p>
            </div>
            {f.ok ? (
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            ) : (
              <motion.span
                className="h-2 w-2 rounded-full"
                style={{ background: ACCENT }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScreenChat({ p, answering }: { p: number; answering: boolean }) {
  const q = 'How should CRISPR samples be stored?';
  const typed = answering
    ? q
    : q.slice(0, Math.floor(p * q.length));
  const showAnswer = answering && p > 0.18;
  const showSource = answering && p > 0.42;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-white"
          style={{ background: ACCENT }}
        >
          <LogoMark size={16} inverted />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-zinc-900">Lab Assistant</p>
          <p className="text-[10px] text-zinc-400">Research Assistant</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden bg-zinc-50/80 px-4 py-4">
        {(answering || typed.length > 8) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-zinc-900 px-3.5 py-2.5 text-[12px] text-white"
          >
            {answering ? q : typed}
            {!answering ? (
              <motion.span
                className="ml-0.5 inline-block h-3 w-[1.5px] translate-y-[2px] bg-white"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            ) : null}
          </motion.div>
        )}

        {showAnswer ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[88%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[12px] leading-relaxed text-zinc-700 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04]"
          >
            Storage temperature: −80°C. Aliquot before first thaw to avoid freeze–thaw cycles.
            {showSource ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 rounded-lg border border-black/[0.06] bg-zinc-50 px-2.5 py-2"
              >
                <p className="text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                  Source
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                  <div>
                    <p className="text-[11px] font-medium text-zinc-700">SOP-014.pdf</p>
                    <p className="text-[10px] text-zinc-400">Page 6</p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        ) : !answering && typed.length > 4 ? (
          <div className="flex gap-1 px-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-zinc-300"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="border-t border-zinc-100 bg-white p-3">
        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
          <span className="flex-1 text-[12px] text-zinc-400">
            {answering ? 'Ask about a protocol or document…' : typed || 'Ask about a protocol or document…'}
          </span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-white"
            style={{ background: ACCENT, opacity: typed.length > 2 || answering ? 1 : 0.35 }}
          >
            <Send className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

function ScreenWidget({ p }: { p: number }) {
  return (
    <div className="flex h-full gap-3 p-4">
      <div className="flex w-[38%] flex-col gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            Embed builder
          </p>
          <h3 className="font-display text-lg font-bold text-zinc-950">Widget</h3>
        </div>
        <label className="block">
          <span className="text-[10px] text-zinc-400">Accent</span>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2.5 py-2">
            <span className="h-4 w-4 rounded-full" style={{ background: ACCENT }} />
            <span className="font-mono text-[11px] text-zinc-600">#ff4d2e</span>
          </div>
        </label>
        <label className="block">
          <span className="text-[10px] text-zinc-400">Greeting</span>
          <div className="mt-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-2 text-[11px] text-zinc-600">
            Ask about protocols or SOPs…
          </div>
        </label>
        <motion.div
          className="mt-auto rounded-xl px-3 py-2 text-center text-[11px] font-semibold text-white"
          style={{ background: ACCENT }}
          animate={{ opacity: p > 0.5 ? 1 : 0.7 }}
        >
          Copy embed code
        </motion.div>
      </div>
      <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
        <div className="flex items-center gap-1 border-b border-zinc-200/80 bg-white px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
          <span className="h-2 w-2 rounded-full bg-zinc-200" />
          <span className="ml-2 text-[10px] text-zinc-400">lab.helixbio.com</span>
        </div>
        <div className="relative h-[calc(100%-32px)] bg-gradient-to-br from-white to-zinc-100 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-300">
            Lab portal
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-700">Protocols</p>
          <motion.div
            className="absolute bottom-3 right-3 w-[160px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
          >
            <div className="px-2.5 py-2 text-white" style={{ background: ACCENT }}>
              <p className="text-[11px] font-semibold">Lab Assistant</p>
              <p className="text-[9px] opacity-80">Research Assistant</p>
            </div>
            <div className="space-y-1.5 p-2">
              <div className="rounded-lg bg-zinc-50 px-2 py-1.5 text-[9px] text-zinc-500">
                Ask about a protocol…
              </div>
              <div className="flex gap-1">
                <span className="rounded-full border border-zinc-200 px-1.5 py-0.5 text-[8px] text-zinc-500">
                  Find SOP-014
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ScreenAnalytics({ p }: { p: number }) {
  const bars = [38, 62, 54, 78, 70, 88, 60];
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            Analytics
          </p>
          <h3 className="font-display text-lg font-bold text-zinc-950">Usage</h3>
        </div>
        <span className="rounded-full border border-accent/40 px-2.5 py-1 text-[10px] font-medium text-zinc-700">
          Last 7 days
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[
          ['Questions', '4.1k'],
          ['Accuracy', '96.8%'],
          ['Researchers', '64'],
          ['Sources', '218'],
        ].map(([l, v], i) => (
          <div
            key={l}
            className="rounded-2xl border border-zinc-200/90 bg-white px-2.5 py-2"
            style={{ opacity: p > i * 0.08 ? 1 : 0.4 }}
          >
            <p className="text-[9px] text-zinc-400">{l}</p>
            <p className="mt-0.5 font-display text-base font-semibold text-zinc-950">{v}</p>
          </div>
        ))}
      </div>
      <div className="min-h-0 flex-1 rounded-2xl border border-zinc-200/90 bg-white p-3">
        <p className="text-[11px] font-semibold text-zinc-800">Queries over time</p>
        <div className="mt-3 flex h-[120px] items-end gap-2">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-md"
              style={{ background: ACCENT }}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreenEnd() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-white px-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 shadow-[0_12px_40px_rgba(255,77,46,0.25)]"
      >
        <LogoMark size={34} inverted />
      </motion.div>
      <p className="font-display text-2xl font-bold tracking-tight text-zinc-950 md:text-3xl">
        Documents in.
        <br />
        <span style={{ color: ACCENT }}>Cited answers out.</span>
      </p>
      <p className="mt-3 text-[13px] text-zinc-400">
        LabAgent.ai — research answers from your documents
      </p>
    </div>
  );
}

function Cursor({ clicking }: { clicking?: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute z-30"
      style={{ left: 0, top: 0 }}
      animate={clicking ? { scale: 0.88 } : { scale: 1 }}
      transition={{ duration: 0.12 }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5.5 3.5 19 12.2l-6.1 1.4 2.6 6.4-2.4 1-2.7-6.5L5.5 18.5V3.5Z"
          fill="#0a0a0a"
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      {clicking ? (
        <motion.span
          className="absolute left-1 top-1 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{ borderColor: ACCENT }}
          initial={{ scale: 0.4, opacity: 0.7 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.45 }}
        />
      ) : null}
    </motion.div>
  );
}

type Props = { className?: string };

/**
 * Product demo as a polished screen recording of the real LabAgent UI —
 * same color system, typography, and chrome as the live app.
 */
export function DemoVideoFullscreen({ className }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const lastTs = useRef<number | null>(null);

  const { i, ch, p } = useMemo(() => at(elapsed), [elapsed]);

  const cx = useMotionValue(50);
  const cy = useMotionValue(45);
  const sx = useSpring(cx, { stiffness: 90, damping: 20, mass: 0.6 });
  const sy = useSpring(cy, { stiffness: 90, damping: 20, mass: 0.6 });

  useEffect(() => {
    cx.set(ch.cursor.x);
    cy.set(ch.cursor.y);
  }, [ch.id, ch.cursor.x, ch.cursor.y, cx, cy]);

  const clicking = Boolean(ch.click && p > 0.12 && p < 0.28);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const on = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        setPlaying(on);
        if (!on) lastTs.current = null;
      },
      { threshold: [0, 0.35, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) {
      lastTs.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (lastTs.current == null) lastTs.current = now;
      const dt = now - lastTs.current;
      lastTs.current = now;
      setElapsed((e) => (e + dt) % TOTAL);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const screen =
    ch.id === 'overview' ? (
      <ScreenOverview p={p} />
    ) : ch.id === 'knowledge' ? (
      <ScreenKnowledge p={p} />
    ) : ch.id === 'chat-type' ? (
      <ScreenChat p={p} answering={false} />
    ) : ch.id === 'chat-answer' ? (
      <ScreenChat p={p} answering />
    ) : ch.id === 'widget' ? (
      <ScreenWidget p={p} />
    ) : ch.id === 'analytics' ? (
      <ScreenAnalytics p={p} />
    ) : (
      <ScreenEnd />
    );

  return (
    <section
      ref={sectionRef}
      id="demo"
      className={cn(
        'relative z-10 flex h-[100svh] w-full flex-col overflow-hidden bg-[#0c0c0e]',
        className,
      )}
      aria-label="LabAgent product demo"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,77,46,0.12),transparent_55%)]" />

      {/* Stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-28 pt-14 md:px-10">
        <div
          ref={stageRef}
          className="relative w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#e8e8ea] shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
          style={{ aspectRatio: '16 / 10' }}
        >
          {/* Browser chrome */}
          <div className="flex h-10 items-center gap-3 border-b border-black/[0.06] bg-white px-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
            </div>
            <div className="flex h-6 min-w-0 flex-1 items-center justify-center rounded-md bg-zinc-100 px-3">
              <span className="truncate text-[11px] text-zinc-400">
                app.labagent.ai/{ch.id.startsWith('chat') ? 'playground' : ch.id === 'end' ? 'app' : ch.id}
              </span>
            </div>
            <Logo size="md" variant="light" className="hidden sm:flex" />
          </div>

          {/* App shell */}
          <div className="relative flex h-[calc(100%-2.5rem)] gap-2 bg-[#e8e8ea] p-2">
            {ch.id !== 'end' ? <Rail active={ch.id} /> : null}
            <div
              className={cn(
                'relative min-w-0 flex-1 overflow-hidden rounded-[1.25rem] bg-white',
                ch.id === 'end' && 'rounded-[1.25rem]',
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={ch.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {screen}
                </motion.div>
              </AnimatePresence>
            </div>

            {ch.id !== 'end' ? (
              <CursorLayer sx={sx} sy={sy} clicking={clicking} />
            ) : null}
          </div>
        </div>
      </div>

      {/* Chapter pills */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-center px-3 pt-5">
        <div className="flex max-w-full flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-black/40 px-1.5 py-1.5 backdrop-blur-md">
          {CHAPTERS.map((c, idx) => (
            <span
              key={c.id}
              className={cn(
                'rounded-full px-2.5 py-1 text-[10px] font-medium',
                idx === i ? 'text-white' : 'text-white/35',
              )}
              style={idx === i ? { background: ACCENT } : undefined}
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 md:px-10 md:pb-10">
        <div className="mb-4 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-100"
            style={{ width: `${(elapsed / TOTAL) * 100}%`, background: ACCENT }}
          />
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
              Product recording · {ch.label}
            </p>
            <p className="mt-1.5 max-w-lg font-display text-xl font-semibold tracking-tight text-white md:text-2xl">
              {ch.caption}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlaying((v) => !v);
              lastTs.current = null;
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white text-zinc-950 transition-colors hover:bg-zinc-100"
            aria-label={playing ? 'Pause demo' : 'Play demo'}
          >
            {playing ? (
              <Pause className="h-4 w-4 fill-current" strokeWidth={1.75} />
            ) : (
              <Play className="h-4 w-4 fill-current" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

function CursorLayer({
  sx,
  sy,
  clicking,
}: {
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
  clicking: boolean;
}) {
  const [pos, setPos] = useState({ x: 50, y: 45 });

  useEffect(() => {
    const unx = sx.on('change', (v) => setPos((p) => ({ ...p, x: v })));
    const uny = sy.on('change', (v) => setPos((p) => ({ ...p, y: v })));
    return () => {
      unx();
      uny();
    };
  }, [sx, sy]);

  return (
    <div
      className="pointer-events-none absolute z-40"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <Cursor clicking={clicking} />
    </div>
  );
}
