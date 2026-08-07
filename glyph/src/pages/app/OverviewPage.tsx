import {
  Activity,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Database,
  FileText,
  Filter,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Puzzle,
  Search,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { CountUp } from '@/components/ui/CountUp';
import { QueryVolumeWidget } from '@/components/app/QueryVolumeWidget';
import { TeamCollaborationCard } from '@/components/app/TeamCollaborationCard';
import { ANALYTICS, type KnowledgeFile } from '@/lib/data';
import { useApp } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import {
  DEFAULT_WORKSPACE_ID,
  WORKSPACES,
  WorkspaceAnchor,
  type WorkspaceId,
} from '@/lib/workspaces';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

const panel =
  'rounded-2xl border border-black/[0.05] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:border-white/[0.06] dark:bg-[#141416] dark:shadow-none';

type HealthTone = 'ok' | 'warn' | 'critical';

function toneForCoverage(pct: number): HealthTone {
  return pct >= 100 ? 'ok' : 'warn';
}

function toneForDupRisk(pct: number): HealthTone {
  if (pct > 50) return 'critical';
  if (pct > 0) return 'warn';
  return 'ok';
}

const TONE_BAR: Record<HealthTone, string> = {
  ok: 'bg-green-500',
  warn: 'bg-orange-500',
  critical: 'bg-red-500',
};

function HealthRow({
  id,
  label,
  value,
  tone,
  files,
  emptyHint,
  detailFor,
  open,
  onToggle,
}: {
  id: string;
  label: string;
  value: number;
  tone: HealthTone;
  files: KnowledgeFile[];
  emptyHint: string;
  detailFor: (f: KnowledgeFile) => string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`health-${id}`}
        className="group flex w-full cursor-pointer flex-col gap-1 rounded-lg py-1.5 text-left outline-none transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-accent/35"
      >
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="truncate font-medium text-zinc-700 dark:text-zinc-200">
            {label}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1">
            <span className="tabular-nums font-semibold text-zinc-800 dark:text-zinc-100">
              {value}%
            </span>
            <ChevronDown
              className={cn(
                'h-3 w-3 text-zinc-500 transition-transform duration-200',
                open && 'rotate-180',
              )}
              aria-hidden
            />
          </span>
        </div>
        <div className="h-[3px] overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
          <motion.div
            className={cn('h-full rounded-full', TONE_BAR[tone])}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.15 }}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`health-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="overflow-hidden"
          >
            <ul className="mb-1 max-h-[56px] space-y-0.5 overflow-y-auto rounded-lg bg-zinc-50 px-2 py-1 dark:bg-black/25">
              {files.length ? (
                files.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center gap-1.5 truncate py-0.5 text-[10px] text-zinc-700 dark:text-zinc-300"
                  >
                    <FileText className="h-2.5 w-2.5 shrink-0 text-zinc-400" />
                    <span className="truncate">{f.name}</span>
                    <span className="ml-auto shrink-0 text-zinc-500">
                      {detailFor(f)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="py-1 text-[10px] text-zinc-600">{emptyHint}</li>
              )}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function OverviewPage() {
  const {
    files,
    activity,
    chatbot,
    plan,
    openPaywall,
    openSettings,
    conversations,
    user,
    activeProjectId,
    setActiveProjectId,
  } = useApp();
  const { isDark } = useTheme();
  const [, setLocation] = useLocation();
  const isFree = plan === 'starter';
  const [activityQuery, setActivityQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState<
    'all' | 'upload' | 'chat' | 'other'
  >('all');
  const [openHealth, setOpenHealth] = useState<
    null | 'indexed' | 'duplicates' | 'metadata'
  >(null);

  const readyDocs = files.filter((f) => f.status === 'ready').length;
  const nameCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const f of files) {
      const key = f.name.toLowerCase();
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [files]);
  const duplicates = Math.max(
    0,
    files.length - new Set(files.map((f) => f.name.toLowerCase())).size,
  );
  const notIndexedFiles = useMemo(
    () => files.filter((f) => f.status !== 'ready'),
    [files],
  );
  const duplicateFiles = useMemo(
    () => files.filter((f) => (nameCounts.get(f.name.toLowerCase()) ?? 0) > 1),
    [files, nameCounts],
  );
  const missingMetaFiles = useMemo(
    () => files.filter((f) => !f.project || !f.tags?.length),
    [files],
  );
  const missingMeta = missingMetaFiles.length;
  const indexedPct =
    files.length === 0 ? 0 : Math.round((readyDocs / files.length) * 100);
  const dupRiskPct = files.length
    ? Math.min(100, Math.round((duplicates / files.length) * 100))
    : 0;
  const metaCoveragePct = files.length
    ? Math.round(((files.length - missingMeta) / files.length) * 100)
    : 0;
  const healthScore = Math.max(
    0,
    Math.min(
      100,
      indexedPct - duplicates * 8 - Math.min(30, missingMeta * 6),
    ),
  );

  const aiResponses = useMemo(
    () =>
      ANALYTICS.weeklySeries.reduce((sum, d) => sum + (d.responses ?? 0), 0),
    [],
  );

  const lastMsg = [...conversations]
    .flatMap((c) => c.messages)
    .filter((m) => m.role === 'user')
    .at(-1);

  const initials = (user?.name ?? 'Lab User')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const filteredActivity = useMemo(() => {
    const q = activityQuery.trim().toLowerCase();
    return (activity.length ? activity : []).filter((a) => {
      if (activityFilter === 'upload' && a.type !== 'upload' && a.type !== 'train')
        return false;
      if (activityFilter === 'chat' && a.type !== 'chat') return false;
      if (
        activityFilter === 'other' &&
        (a.type === 'upload' || a.type === 'train' || a.type === 'chat')
      )
        return false;
      if (!q) return true;
      return a.text.toLowerCase().includes(q);
    });
  }, [activity, activityQuery, activityFilter]);

  const healthLabel =
    healthScore >= 80
      ? 'Healthy'
      : healthScore >= 55
        ? 'Needs care'
        : 'Critical';

  const metrics = [
    {
      label: 'Accuracy',
      href: '/app/analytics',
      premium: true,
      render: (i: number) => (
        <CountUp
          to={ANALYTICS.accuracy}
          decimals={1}
          suffix="%"
          delay={0.1 + i * 0.04}
          duration={0.7}
        />
      ),
    },
    {
      label: 'Active sources',
      href: '/app/knowledge',
      render: (i: number) => (
        <CountUp to={readyDocs} delay={0.1 + i * 0.04} duration={0.65} />
      ),
    },
    {
      label: 'AI responses',
      href: '/app/playground',
      render: (i: number) => (
        <CountUp to={aiResponses} delay={0.1 + i * 0.04} duration={0.7} />
      ),
    },
    {
      label: 'Avg latency',
      href: '/app/analytics',
      premium: true,
      render: (i: number) => (
        <CountUp
          to={1.2}
          decimals={1}
          suffix="s"
          delay={0.1 + i * 0.04}
          duration={0.65}
        />
      ),
    },
  ];

  const go = (href: string, premium?: boolean) => {
    if (premium && isFree) {
      openPaywall(
        href.includes('analytics')
          ? 'Analytics is on the Research plan. It shows questions asked, accuracy, and sources cited.'
          : 'The embed builder is on the Research plan. Customize the widget and copy the embed code.',
      );
      return;
    }
    setLocation(href);
  };

  const selectWorkspace = (id: WorkspaceId) => {
    if (isFree && id !== DEFAULT_WORKSPACE_ID) {
      openPaywall(
        'Starter includes one workspace. Research adds more workspaces for separate projects.',
      );
      return;
    }
    setActiveProjectId(id);
  };

  const createWorkspace = () => {
    if (isFree) {
      openPaywall(
        'Starter includes one workspace. Research adds more workspaces for separate projects.',
      );
      return;
    }
    toast.message('Open Workspaces in the rail to create a new project.');
  };

  return (
    <div className="flex h-full min-h-0 gap-4 overflow-hidden">
      {/* ——— LEFT: Profile + Workspaces ——— */}
      <aside className="flex w-[240px] shrink-0 flex-col gap-2.5 overflow-hidden xl:w-[268px]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className={cn(panel, 'flex shrink-0 flex-col items-center px-3.5 pb-3.5 pt-3.5')}
        >
          <div className="mb-3 flex w-full items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400">
              Profile
            </h2>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
              aria-label="More profile options"
            >
              <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="relative mb-2.5 flex h-[72px] w-[72px] items-center justify-center">
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 72 72"
              aria-hidden
            >
              <circle
                cx="36"
                cy="36"
                r="32"
                fill="none"
                stroke={isDark ? '#3f3f46' : '#e4e4e7'}
                strokeWidth="3.5"
              />
              <circle
                cx="36"
                cy="36"
                r="32"
                fill="none"
                stroke="#F97316"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32 * 0.75} ${2 * Math.PI * 32}`}
              />
            </svg>
            <div
              className={cn(
                'flex h-[52px] w-[52px] items-center justify-center rounded-full text-[15px] font-semibold tracking-wide',
                isDark
                  ? 'bg-[#7c2d12] text-orange-200'
                  : 'bg-[#FDBA74] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]',
              )}
            >
              {initials}
            </div>
          </div>

          <p className="text-center text-[13px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {user?.name ?? 'Lab User'}
          </p>
          <p className="mt-1 text-center text-[11px] font-medium leading-snug text-slate-600 dark:text-zinc-400">
            Research Lead · Helix Bio
          </p>

          <div className="mt-3 flex w-full justify-center gap-2.5">
            {[
              { icon: FileText, value: String(files.length).padStart(2, '0'), key: 'docs' },
              { icon: MessageSquare, value: '11', key: 'chats' },
              { icon: Database, value: '03', key: 'bases' },
            ].map((s) => (
              <span
                key={s.key}
                className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-zinc-800 ring-1 ring-orange-200/80 dark:bg-orange-500/[0.12] dark:text-orange-200/90 dark:ring-orange-500/20"
              >
                <s.icon className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400/80" strokeWidth={1.75} />
                {s.value}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35, ease: EASE }}
          className={cn(panel, 'flex shrink-0 flex-col p-2.5')}
        >
          <h2 className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400">
            Workspaces
          </h2>
          <ul className="space-y-0.5">
            {WORKSPACES.map((ws) => {
              const active = activeProjectId === ws.id;
              return (
                <li key={ws.id}>
                  <button
                    type="button"
                    onClick={() => selectWorkspace(ws.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors',
                      active
                        ? 'bg-zinc-100 dark:bg-white/[0.08]'
                        : 'hover:bg-zinc-50 dark:hover:bg-white/[0.04]',
                    )}
                  >
                    <WorkspaceAnchor
                      color={ws.color}
                      glow={ws.glow}
                      shape={ws.shape}
                      size="md"
                    />
                    <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-zinc-800 dark:text-zinc-100">
                      {ws.name}
                    </span>
                    <span className="tabular-nums text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">
                      {ws.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={createWorkspace}
            className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-black/10 py-2 text-[11px] font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-800 dark:border-white/15 dark:text-zinc-300 dark:hover:bg-white/[0.04]"
          >
            <Plus className="h-3 w-3" strokeWidth={2} />
            New Workspace
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.35, ease: EASE }}
          className="min-h-0 flex-1"
        >
          <TeamCollaborationCard
            className="h-full"
            onAddMember={() => {
              if (isFree) {
                openPaywall(
                  'Team members are on the Research plan.',
                );
                return;
              }
              openSettings();
            }}
          />
        </motion.div>
      </aside>

      {/* ——— CENTER: Actions → KPI → Chart ——— */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex w-full shrink-0 flex-wrap items-center justify-start gap-2 px-5"
        >
          <button
            type="button"
            onClick={() => go('/app/playground')}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-zinc-900 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 dark:bg-zinc-950 dark:text-white dark:hover:bg-black dark:focus-visible:ring-white/20"
          >
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
            Ask
          </button>
          <button
            type="button"
            onClick={() => go('/app/knowledge')}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-[13px] font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/[0.06]"
          >
            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
            Upload
          </button>
          <button
            type="button"
            onClick={() => go('/app/builder', true)}
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
          >
            <Puzzle className="h-3.5 w-3.5" strokeWidth={1.75} />
            Embed widget
            {isFree ? (
              <span className="rounded bg-zinc-100 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-zinc-500 dark:bg-white/10">
                Pro
              </span>
            ) : null}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.3, ease: EASE }}
          className={cn(
            panel,
            'grid w-full shrink-0 grid-cols-2 divide-black/[0.06] sm:grid-cols-4 sm:divide-x dark:divide-white/10',
          )}
        >
          {metrics.map((m, i) => (
            <button
              key={m.label}
              type="button"
              onClick={() => go(m.href, m.premium)}
              className="cursor-pointer px-5 py-3.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600 dark:text-zinc-400">
                {m.label}
              </p>
              <p className="mt-1 font-display text-xl font-semibold tabular-nums tracking-tight text-zinc-950 dark:text-zinc-50">
                {m.render(i)}
              </p>
            </button>
          ))}
        </motion.div>

        <QueryVolumeWidget
          variant="wide"
          className="w-full"
          onClick={() => go('/app/analytics', true)}
        />
      </section>

      {/* ——— RIGHT: Activity / Health / Live ——— */}
      <aside className="flex w-[280px] shrink-0 flex-col gap-3 overflow-hidden xl:w-[300px]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35, ease: EASE }}
          className={cn(panel, 'flex min-h-0 flex-1 flex-col p-3.5')}
        >
          <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-accent" />
              <h2 className="text-[13px] font-semibold tracking-tight">
                Recent activity
              </h2>
            </div>
            {isFree ? (
              <button
                type="button"
                onClick={() =>
                  openPaywall(
                    'Analytics is on the Research plan. It shows questions asked, accuracy, and sources cited.',
                  )
                }
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent transition-opacity hover:opacity-80"
              >
                Analytics <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link href="/app/analytics">
                <span className="inline-flex cursor-pointer items-center gap-1 text-[13px] font-medium text-accent transition-opacity hover:opacity-80">
                  Analytics <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            )}
          </div>

          <div className="mb-2 flex shrink-0 items-center gap-1.5">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search activity</span>
              <Search
                className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500"
                aria-hidden
              />
              <input
                type="search"
                value={activityQuery}
                onChange={(e) => setActivityQuery(e.target.value)}
                placeholder="Search logs…"
                className="h-7 w-full rounded-lg bg-zinc-100 pl-7 pr-2 text-[11px] text-zinc-800 placeholder:text-zinc-500 outline-none focus:ring-1 focus:ring-accent/25 dark:bg-white/[0.06] dark:text-zinc-100"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                setActivityFilter((f) =>
                  f === 'all'
                    ? 'upload'
                    : f === 'upload'
                      ? 'chat'
                      : f === 'chat'
                        ? 'other'
                        : 'all',
                )
              }
              title={`Filter: ${activityFilter}`}
              aria-label={`Filter activity, current: ${activityFilter}`}
              className={cn(
                'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
                activityFilter === 'all'
                  ? 'bg-zinc-100 text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300'
                  : 'bg-accent/10 text-accent',
              )}
            >
              <Filter className="h-3 w-3" strokeWidth={1.75} />
            </button>
          </div>

          <ul className="scrollbar-thin min-h-0 flex-1 space-y-0 overflow-y-auto">
            {filteredActivity.slice(0, 8).map((a) => (
              <li
                key={a.id}
                className="flex gap-2.5 border-b border-black/[0.04] py-2.5 last:border-0 dark:border-white/[0.06]"
              >
                <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-zinc-50 ring-1 ring-black/[0.05] dark:bg-white/[0.06] dark:ring-white/10">
                  {a.type === 'upload' || a.type === 'train' ? (
                    <FileText className="h-2.5 w-2.5 text-accent" />
                  ) : a.type === 'chat' ? (
                    <MessageSquare className="h-2.5 w-2.5 text-accent" />
                  ) : (
                    <Sparkles className="h-2.5 w-2.5 text-accent" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 block text-[12px] font-medium leading-snug text-zinc-800 dark:text-zinc-100">
                    {a.text}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                    {a.time}
                  </span>
                </span>
                <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-zinc-400" />
              </li>
            ))}
            {!filteredActivity.length ? (
              <li className="py-4 text-center text-[11px] text-zinc-600">
                {activity.length ? 'No matching activity.' : 'No activity yet.'}
              </li>
            ) : null}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.35, ease: EASE }}
          className={cn(panel, 'shrink-0 p-3.5')}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-[13px] font-semibold tracking-tight">
              Knowledge Health
            </h2>
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'rounded-full px-1.5 py-px text-[9px] font-medium',
                  healthScore >= 80
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : healthScore >= 55
                      ? 'bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'
                      : 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
                )}
              >
                {healthLabel}
              </span>
              {healthScore < 80 ? (
                <button
                  type="button"
                  onClick={() => setLocation('/app/knowledge')}
                  className="rounded-full border border-orange-200 bg-orange-50 px-2 py-px text-[9px] font-semibold text-orange-700 hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-200 dark:hover:bg-orange-500/25"
                >
                  Fix
                </button>
              ) : null}
            </div>
          </div>
          <div className="space-y-0.5">
            <HealthRow
              id="indexed"
              label="Indexed documents"
              value={indexedPct}
              tone={toneForCoverage(indexedPct)}
              files={notIndexedFiles}
              emptyHint="All documents are indexed."
              detailFor={(f) => f.statusDetail ?? f.status}
              open={openHealth === 'indexed'}
              onToggle={() =>
                setOpenHealth((c) => (c === 'indexed' ? null : 'indexed'))
              }
            />
            <HealthRow
              id="duplicates"
              label="Duplicate risk"
              value={dupRiskPct}
              tone={toneForDupRisk(dupRiskPct)}
              files={duplicateFiles}
              emptyHint="No duplicates detected."
              detailFor={() => 'duplicate'}
              open={openHealth === 'duplicates'}
              onToggle={() =>
                setOpenHealth((c) =>
                  c === 'duplicates' ? null : 'duplicates',
                )
              }
            />
            <HealthRow
              id="metadata"
              label="Metadata coverage"
              value={metaCoveragePct}
              tone={toneForCoverage(metaCoveragePct)}
              files={missingMetaFiles}
              emptyHint="Full project + tags coverage."
              detailFor={(f) =>
                !f.project && !f.tags?.length
                  ? 'no project/tags'
                  : !f.project
                    ? 'no project'
                    : 'no tags'
              }
              open={openHealth === 'metadata'}
              onToggle={() =>
                setOpenHealth((c) => (c === 'metadata' ? null : 'metadata'))
              }
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.35, ease: EASE }}
          className={cn(panel, 'shrink-0 p-3.5')}
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold tracking-tight">
              Live assistant
            </h2>
            <span className="inline-flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.1em] text-zinc-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { ok: true, label: 'Assistant', detail: 'Ready' },
              {
                ok: readyDocs > 0,
                label: 'Knowledge',
                detail: readyDocs > 0 ? `${readyDocs}` : 'Empty',
              },
              {
                ok: Boolean(chatbot?.published),
                label: 'Widget',
                detail: chatbot?.published
                  ? 'Live'
                  : isFree
                    ? 'Locked'
                    : 'Draft',
              },
            ].map((row) => (
              <span
                key={row.label}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ring-1',
                  row.ok
                    ? 'bg-emerald-50 text-emerald-800 ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/25'
                    : 'bg-zinc-50 text-zinc-600 ring-black/[0.06] dark:bg-white/[0.04] dark:text-zinc-300 dark:ring-white/10',
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    row.ok ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600',
                  )}
                />
                {row.label}
                <span className="text-zinc-600 dark:text-zinc-400">{row.detail}</span>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLocation('/app/playground')}
            className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-xl bg-zinc-50 px-2.5 py-1.5 text-left transition-colors hover:bg-accent/[0.06] dark:bg-white/[0.04] dark:hover:bg-accent/[0.08]"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/50" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-zinc-800 dark:text-zinc-100">
              {lastMsg?.content ?? 'Ask something in Chat'}
            </span>
            <span className="shrink-0 rounded-md border border-black/[0.08] bg-white px-1.5 py-0.5 font-mono text-[9px] font-semibold tabular-nums text-zinc-700 dark:border-white/15 dark:bg-white/[0.08] dark:text-zinc-200">
              1.2s
            </span>
          </button>
        </motion.div>
      </aside>
    </div>
  );
}
