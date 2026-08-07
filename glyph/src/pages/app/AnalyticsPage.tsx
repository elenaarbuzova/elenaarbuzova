import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, Settings2 } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CountUp } from '@/components/ui/CountUp';
import { Modal } from '@/components/ui/Modal';
import { ANALYTICS } from '@/lib/data';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

const ORANGE = '#ff4d2e';
const ORANGE_LINK = '#ff4d2e';

const PERIODS = [
  'Last 7 days',
  'Last 30 days',
  'Last 90 days',
  'Year to date',
] as const;

type Period = (typeof PERIODS)[number];

const CHART_BY_PERIOD: Record<Period, { day: string; queries: number }[]> = {
  'Last 7 days': ANALYTICS.weeklySeries.map((d) => ({
    day: d.day,
    queries: d.queries,
  })),
  'Last 30 days': [
    { day: 'W1', queries: 820 },
    { day: 'W2', queries: 1140 },
    { day: 'W3', queries: 980 },
    { day: 'W4', queries: 1420 },
    { day: 'W5', queries: 1680 },
  ],
  'Last 90 days': [
    { day: 'Jan', queries: 3120 },
    { day: 'Feb', queries: 3580 },
    { day: 'Mar', queries: 4010 },
    { day: 'Apr', queries: 4460 },
  ],
  'Year to date': ANALYTICS.messagesSeries.map((d) => ({
    day: d.day,
    queries: d.queries,
  })),
};

const STATS_BY_PERIOD: Record<
  Period,
  {
    queries: number;
    accuracy: number;
    activeUsers: number;
    sourcesUsed: number;
    widgetOpens: number;
  }
> = {
  'Last 7 days': {
    queries: 4120,
    accuracy: 96.8,
    activeUsers: 64,
    sourcesUsed: 218,
    widgetOpens: 740,
  },
  'Last 30 days': {
    queries: 9840,
    accuracy: 96.4,
    activeUsers: 98,
    sourcesUsed: 486,
    widgetOpens: 1680,
  },
  'Last 90 days': {
    queries: 14260,
    accuracy: 96.1,
    activeUsers: 118,
    sourcesUsed: 712,
    widgetOpens: 2540,
  },
  'Year to date': {
    queries: ANALYTICS.queries,
    accuracy: ANALYTICS.accuracy,
    activeUsers: ANALYTICS.activeUsers,
    sourcesUsed: ANALYTICS.sourcesUsed,
    widgetOpens: ANALYTICS.widgetOpens,
  },
};

const TOP_SCALE: Record<Period, number> = {
  'Last 7 days': 0.28,
  'Last 30 days': 0.55,
  'Last 90 days': 0.78,
  'Year to date': 1,
};

type ActivityRow = {
  time: string;
  actor: string;
  action: string;
};

const ACTOR_STYLES: Record<
  string,
  { initials: string; bg: string; fg: string; darkBg: string; darkFg: string }
> = {
  'Dr. Chen': {
    initials: 'DC',
    bg: '#ffedd5',
    fg: '#c2410c',
    darkBg: '#431407',
    darkFg: '#fdba74',
  },
  'Alex D.': {
    initials: 'AD',
    bg: '#dbeafe',
    fg: '#1d4ed8',
    darkBg: '#172554',
    darkFg: '#93c5fd',
  },
  'Elena A.': {
    initials: 'EA',
    bg: '#f3e8ff',
    fg: '#7e22ce',
    darkBg: '#3b0764',
    darkFg: '#d8b4fe',
  },
  'Sarah M.': {
    initials: 'SM',
    bg: '#dcfce7',
    fg: '#15803d',
    darkBg: '#052e16',
    darkFg: '#86efac',
  },
  'Marcus L.': {
    initials: 'ML',
    bg: '#fce7f3',
    fg: '#be185d',
    darkBg: '#500724',
    darkFg: '#f9a8d4',
  },
  'Sofia R.': {
    initials: 'SR',
    bg: '#e0f2fe',
    fg: '#0369a1',
    darkBg: '#0c4a6e',
    darkFg: '#7dd3fc',
  },
};

const RECENT_ACTIVITY_PREVIEW: ActivityRow[] = [
  {
    time: '2m ago',
    actor: 'Dr. Chen',
    action: "uploaded 'mRNA_stability_protocol.pdf'",
  },
  {
    time: '15m ago',
    actor: 'Alex D.',
    action: 'asked a question about CRISPR transfection',
  },
  {
    time: '1h ago',
    actor: 'Elena A.',
    action: 'configured a new research widget',
  },
  {
    time: '2h ago',
    actor: 'Sarah M.',
    action: 'generated a Q2 summary report',
  },
  {
    time: '3h ago',
    actor: 'System',
    action: 'indexed 14 new PubMed articles',
  },
  {
    time: '5h ago',
    actor: 'Dr. Chen',
    action: 'deleted an outdated API widget',
  },
  {
    time: '6h ago',
    actor: 'Marcus L.',
    action: 'flagged low-confidence answer on LNP stability',
  },
];

const RECENT_ACTIVITY_WEEK: ActivityRow[] = [
  ...RECENT_ACTIVITY_PREVIEW,
  {
    time: 'Yesterday',
    actor: 'Dr. Chen',
    action: 'published Lab Assistant to the intranet widget',
  },
  {
    time: 'Yesterday',
    actor: 'Sofia R.',
    action: 'asked about reagent X storage conditions',
  },
  {
    time: '2d ago',
    actor: 'Alex D.',
    action: 'updated metadata tags on CRISPR_Cas9_v3.pdf',
  },
  {
    time: '2d ago',
    actor: 'Elena A.',
    action: 'shared Top questions report with Research Lead',
  },
  {
    time: '3d ago',
    actor: 'Marcus L.',
    action: 'indexed 4 protocols into Oncology workspace',
  },
  {
    time: '4d ago',
    actor: 'Dr. Chen',
    action: 'uploaded Nature_Biotech_2024_mRNA.pdf',
  },
  {
    time: '5d ago',
    actor: 'Sofia R.',
    action: 'invited 2 collaborators to Helix Bio workspace',
  },
  {
    time: '6d ago',
    actor: 'Alex D.',
    action: 'ran batch Q&A against PCR knowledge base',
  },
];

function ActivityAvatar({ actor }: { actor: string }) {
  const { isDark } = useTheme();

  if (actor === 'System') {
    return (
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500"
        aria-hidden
      >
        <Settings2 className="h-3 w-3" strokeWidth={2} />
      </span>
    );
  }

  const style = ACTOR_STYLES[actor] ?? {
    initials: actor
      .split(/\s+/)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    bg: '#f4f4f5',
    fg: '#52525b',
    darkBg: '#27272a',
    darkFg: '#a1a1aa',
  };

  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold leading-none"
      style={{
        backgroundColor: isDark ? style.darkBg : style.bg,
        color: isDark ? style.darkFg : style.fg,
      }}
      aria-hidden
    >
      {style.initials}
    </span>
  );
}

function renderActionText(action: string): ReactNode {
  const toneClass = /\b(deleted|flagged)\b/i.test(action)
    ? 'text-red-600/80 dark:text-red-400/70'
    : /\b(asked|generated)\b/i.test(action)
      ? 'text-accent dark:text-accent/85'
      : 'text-zinc-600 dark:text-zinc-400';

  const parts = action.split(
    /('[^']+'|\b[\w.-]+\.pdf\b|\bQ2 summary report\b|\bTop questions report\b)/g,
  );

  return (
    <span className={cn('leading-snug', toneClass)}>
      {parts.map((part, i) => {
        if (!part) return null;
        const isFileOrReport =
          /^'[^']+'$/.test(part) ||
          /\.pdf$/i.test(part) ||
          /report$/i.test(part);
        if (isFileOrReport) {
          return (
            <span
              key={i}
              className="font-semibold text-zinc-900 dark:text-zinc-50"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function ActivityLine({
  row,
  dense = false,
}: {
  row: ActivityRow;
  dense?: boolean;
}) {
  return (
    <li
      className={cn(
        'flex items-center gap-3 border-b border-zinc-100 last:border-b-0 dark:border-white/[0.04]',
        dense ? 'py-2' : 'py-2.5',
      )}
    >
      <span
        className={cn(
          'w-[4.5rem] shrink-0 tabular-nums leading-none text-zinc-500 dark:text-zinc-500',
          dense ? 'text-[12px]' : 'text-[11px]',
        )}
      >
        {row.time}
      </span>
      <ActivityAvatar actor={row.actor} />
      <p
        className={cn(
          'min-w-0 flex-1 truncate leading-snug',
          dense ? 'text-[13px]' : 'text-[11px]',
        )}
      >
        <span className="font-medium text-zinc-800 dark:text-zinc-100">
          {row.actor}
        </span>{' '}
        {renderActionText(row.action)}
      </p>
    </li>
  );
}

const card =
  'rounded-2xl border border-zinc-200/90 bg-white dark:border-white/[0.06] dark:bg-[#141416]';

/** Single-screen Research intelligence — no page scroll */
export function AnalyticsPage() {
  const { isDark } = useTheme();
  const [period, setPeriod] = useState<Period>('Last 7 days');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [chartKey, setChartKey] = useState(0);
  const [activityOpen, setActivityOpen] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);

  const chartData = CHART_BY_PERIOD[period];
  const periodStats = STATS_BY_PERIOD[period];
  const topQuestions = useMemo(() => {
    const scale = TOP_SCALE[period];
    return ANALYTICS.topQuestions.map((item) => ({
      ...item,
      count: Math.max(1, Math.round(item.count * scale)),
    }));
  }, [period]);
  const topMax = Math.max(...topQuestions.map((q) => q.count), 1);

  useEffect(() => {
    if (!periodOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!periodRef.current?.contains(e.target as Node)) setPeriodOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPeriodOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [periodOpen]);

  const stats = [
    {
      label: 'Questions asked',
      render: (i: number) => (
        <CountUp
          key={`${period}-q`}
          to={periodStats.queries}
          delay={i * 0.04}
          duration={0.75}
        />
      ),
    },
    {
      label: 'Response accuracy',
      render: (i: number) => (
        <CountUp
          key={`${period}-a`}
          to={periodStats.accuracy}
          decimals={1}
          suffix="%"
          delay={i * 0.04}
          duration={0.7}
        />
      ),
    },
    {
      label: 'Active researchers',
      render: (i: number) => (
        <CountUp
          key={`${period}-u`}
          to={periodStats.activeUsers}
          delay={i * 0.04}
          duration={0.65}
        />
      ),
    },
    {
      label: 'Sources cited',
      render: (i: number) => (
        <CountUp
          key={`${period}-s`}
          to={periodStats.sourcesUsed}
          delay={i * 0.04}
          duration={0.7}
        />
      ),
    },
    {
      label: 'Widget opens',
      render: (i: number) => (
        <CountUp
          key={`${period}-w`}
          to={periodStats.widgetOpens}
          delay={i * 0.04}
          duration={0.75}
        />
      ),
    },
  ] as const;

  const gridStroke = isDark ? '#1f1f22' : '#e4e4e7';
  const tickFill = isDark ? '#71717a' : '#3f3f46';
  const yTickFill = isDark ? '#52525b' : '#71717a';
  const areaOpacity = isDark
    ? { top: 0.16, mid: 0.06, bottom: 0 }
    : { top: 0.22, mid: 0.08, bottom: 0 };

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-2 overflow-hidden">
      <header className="flex h-9 shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-lg font-bold leading-none tracking-tight text-zinc-950 dark:text-zinc-50">
            Usage
          </h1>
        </div>

        <div ref={periodRef} className="relative shrink-0">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={periodOpen}
            onClick={() => setPeriodOpen((v) => !v)}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-accent/35 bg-white py-1 pl-3 pr-2.5 text-[12px] font-medium text-zinc-800 outline-none transition-colors hover:border-accent/55 focus-visible:ring-2 focus-visible:ring-accent/20 dark:border-accent/40 dark:bg-[#141416] dark:text-zinc-200 dark:hover:border-accent/60"
          >
            {period}
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-accent transition-transform duration-200',
                periodOpen && 'rotate-180',
              )}
              strokeWidth={1.75}
              aria-hidden
            />
          </button>

          {periodOpen ? (
            <div
              role="listbox"
              aria-label="Select period"
              className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[168px] overflow-hidden rounded-2xl border border-accent/30 bg-white p-1.5 shadow-[0_12px_32px_rgba(255,77,46,0.14)] dark:border-accent/35 dark:bg-[#1a1a1d] dark:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
            >
              {PERIODS.map((p) => {
                const selected = p === period;
                return (
                  <button
                    key={p}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setPeriod(p);
                      setPeriodOpen(false);
                      setChartKey((k) => k + 1);
                    }}
                    className={cn(
                      'flex w-full rounded-xl px-3 py-2 text-left text-[12px] font-medium transition-colors',
                      selected
                        ? 'bg-accent text-white'
                        : 'text-zinc-700 hover:bg-accent/[0.08] dark:text-zinc-300 dark:hover:bg-accent/10',
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </header>

      <div className="grid h-14 shrink-0 grid-cols-5 gap-2">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={cn(card, 'flex min-w-0 flex-col justify-center px-3 py-1.5')}
          >
            <p className="truncate text-[10px] font-medium leading-none text-zinc-500 dark:text-zinc-400">
              {s.label}
            </p>
            <p className="mt-1 font-display text-lg font-semibold leading-none tabular-nums tracking-tight text-zinc-950 dark:text-zinc-50 xl:text-xl">
              {s.render(i)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid min-h-0 grid-cols-2 gap-2 overflow-hidden">
        <section
          className={cn(card, 'flex min-h-0 flex-col overflow-hidden p-2.5')}
        >
          <h2 className="shrink-0 text-[12px] font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-50">
            Queries over time
          </h2>
          <div
            className="relative mt-1.5 min-h-0 flex-1"
            onMouseLeave={() => setChartKey((k) => k + 1)}
          >
            <div className="absolute inset-0 min-h-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart
                  key={`${period}-${chartKey}`}
                  data={chartData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="queries-area-orange"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={ORANGE}
                        stopOpacity={areaOpacity.top}
                      />
                      <stop
                        offset="55%"
                        stopColor={ORANGE}
                        stopOpacity={areaOpacity.mid}
                      />
                      <stop
                        offset="100%"
                        stopColor={ORANGE}
                        stopOpacity={areaOpacity.bottom}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="0"
                    vertical={false}
                    stroke={gridStroke}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    padding={{ left: 6, right: 6 }}
                    tickMargin={6}
                    tick={{ fill: tickFill, fontSize: 10, fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={28}
                    tick={{ fill: yTickFill, fontSize: 10 }}
                  />
                  <Tooltip
                    cursor={{
                      stroke: ORANGE,
                      strokeWidth: 1,
                      strokeDasharray: '4 4',
                      strokeOpacity: isDark ? 0.35 : 0.45,
                    }}
                    contentStyle={{
                      background: isDark ? '#18181b' : '#ffffff',
                      border: isDark
                        ? '1px solid rgba(255,255,255,0.08)'
                        : '1px solid #e4e4e7',
                      borderRadius: 10,
                      fontSize: 12,
                      boxShadow: 'none',
                      color: isDark ? '#fafafa' : '#18181b',
                    }}
                    labelStyle={{ color: isDark ? '#a1a1aa' : '#71717a' }}
                    itemStyle={{ color: isDark ? '#fafafa' : '#18181b' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="queries"
                    stroke={ORANGE}
                    strokeWidth={2.5}
                    fill="url(#queries-area-orange)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: ORANGE,
                      stroke: isDark ? '#141416' : '#fff',
                      strokeWidth: 2,
                    }}
                    isAnimationActive
                    animationDuration={450}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section
          className={cn(card, 'flex min-h-0 flex-col overflow-hidden p-3')}
        >
          <div className="shrink-0">
            <h2 className="text-[12px] font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-50">
              Top questions
            </h2>
            <div className="mt-2 flex flex-col gap-1.5">
              {topQuestions.map((item) => {
                const pct = (item.count / topMax) * 100;
                return (
                  <div key={item.q} className="flex items-center gap-2">
                    <p
                      className="w-[36%] min-w-0 shrink-0 truncate text-[11px] leading-tight text-zinc-600 dark:text-zinc-400"
                      title={item.q}
                    >
                      {item.q.replace(/\?$/, '')}
                    </p>
                    <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                      <div
                        className="h-full rounded-full transition-[width] duration-300"
                        style={{ width: `${pct}%`, backgroundColor: ORANGE }}
                      />
                    </div>
                    <span className="w-7 shrink-0 text-right font-mono text-[10px] tabular-nums text-zinc-700 dark:text-zinc-300">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex min-h-0 flex-1 flex-col border-t border-zinc-100 pt-3 dark:border-white/[0.06]">
            <h2 className="shrink-0 text-[12px] font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-50">
              Recent activity
            </h2>
            <ul className="mt-2 shrink-0">
              {RECENT_ACTIVITY_PREVIEW.map((row) => (
                <ActivityLine
                  key={`${row.time}-${row.actor}-${row.action}`}
                  row={row}
                />
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setActivityOpen(true)}
              className="mt-3 shrink-0 self-start text-[11px] font-medium transition-opacity hover:opacity-80"
              style={{ color: ORANGE_LINK }}
            >
              View more ›
            </button>
          </div>
        </section>
      </div>

      <Modal
        open={activityOpen}
        onClose={() => setActivityOpen(false)}
        title="Recent activity"
        wide
      >
        <p className="-mt-2 mb-4 text-[13px] text-zinc-600 dark:text-zinc-400">
          Full lab activity for the past week
        </p>
        <ul className="max-h-[min(52vh,380px)] overflow-y-auto pr-1">
          {RECENT_ACTIVITY_WEEK.map((row, i) => (
            <ActivityLine
              key={`${row.time}-${row.actor}-${row.action}-${i}`}
              row={row}
              dense
            />
          ))}
        </ul>
      </Modal>
    </div>
  );
}
