import { useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CountUp } from '@/components/ui/CountUp';
import { ANALYTICS } from '@/lib/data';
import { cn } from '@/lib/utils';

const stats = [
  {
    label: 'Questions asked',
    render: (i: number) => (
      <CountUp to={ANALYTICS.queries} delay={i * 0.05} duration={0.9} />
    ),
  },
  {
    label: 'Response accuracy',
    render: (i: number) => (
      <CountUp
        to={ANALYTICS.accuracy}
        decimals={1}
        suffix="%"
        delay={i * 0.05}
        duration={0.85}
      />
    ),
  },
  {
    label: 'Active researchers',
    render: (i: number) => (
      <CountUp to={ANALYTICS.activeUsers} delay={i * 0.05} duration={0.75} />
    ),
  },
  {
    label: 'Sources cited',
    render: (i: number) => (
      <CountUp to={ANALYTICS.sourcesUsed} delay={i * 0.05} duration={0.8} />
    ),
  },
  {
    label: 'Widget opens',
    render: (i: number) => (
      <CountUp to={ANALYTICS.widgetOpens} delay={i * 0.05} duration={0.9} />
    ),
  },
];

const topMax = Math.max(...ANALYTICS.topQuestions.map((q) => q.count), 1);

function TopQuestionsChart() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-[#141416] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] md:p-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h2 className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Top questions
        </h2>
        <p className="text-[12px] text-zinc-400 dark:text-zinc-500">
          Most frequent queries in the last 30 days
        </p>
      </div>

      <div className="mt-7 space-y-3.5">
        {ANALYTICS.topQuestions.map((item) => {
          const pct = (item.count / topMax) * 100;
          const active = hovered === item.q;
          return (
            <div
              key={item.q}
              className="group relative grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)_auto] items-center gap-3 sm:grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)_auto] sm:gap-4"
              onMouseEnter={() => setHovered(item.q)}
              onMouseLeave={() => setHovered(null)}
            >
              <p
                className="truncate text-right text-[12px] leading-snug text-zinc-500 dark:text-zinc-400 sm:text-[13px]"
                title={item.q}
              >
                {item.q.replace(/\?$/, '')}
              </p>

              <div className="relative h-[18px] w-full overflow-visible rounded-md bg-zinc-100 dark:bg-zinc-800/80">
                <div
                  className={cn(
                    'h-full rounded-md bg-gradient-to-r from-violet-700/90 to-violet-500/90 transition-all duration-200',
                    active && 'from-violet-600 to-violet-400 brightness-110',
                  )}
                  style={{ width: `${pct}%` }}
                />
                {active ? (
                  <div className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#1c1c1f] dark:text-zinc-200">
                    {item.count.toLocaleString()} queries · {Math.round(pct)}% of
                    top
                  </div>
                ) : null}
              </div>

              <span
                className={cn(
                  'min-w-[3.25rem] rounded-md bg-zinc-50 px-1.5 py-0.5 text-right font-mono text-[11px] tabular-nums text-zinc-500 transition-colors duration-200 dark:bg-white/[0.04] dark:text-zinc-400',
                  active &&
                    'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
                )}
              >
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  return (
      <div className="space-y-12">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Research intelligence
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            What your lab asks — and how confidently LabAgent answers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="rounded-2xl border border-black/[0.06] bg-zinc-50 p-5"
            >
              <p className="text-xs text-zinc-500">{s.label}</p>
              <p className="mt-3 font-display text-2xl font-semibold tracking-tight tabular-nums">
                {s.render(i)}
              </p>
            </div>
          ))}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-black/[0.06] p-8">
            <h2 className="font-medium">Queries over time</h2>
            <div className="mt-8 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ANALYTICS.messagesSeries}
                  margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
                >
                  <defs>
                    <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff4d2e" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#ff4d2e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    padding={{ left: 8, right: 8 }}
                    tickMargin={10}
                    tick={{ fill: '#52525b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    tick={{ fill: '#52525b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="queries"
                    stroke="#ff4d2e"
                    fill="url(#a1)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <TopQuestionsChart />
        </div>
      </div>
  );
}
