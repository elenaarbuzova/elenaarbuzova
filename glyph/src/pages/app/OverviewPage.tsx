import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Database,
  FileText,
  MessageSquare,
  Target,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/Button';
import { CountUp } from '@/components/ui/CountUp';
import { useApp } from '@/lib/store';
import { ANALYTICS } from '@/lib/data';

export function OverviewPage() {
  const { files, activity, chatbot, workspace } = useApp();

  const cards = [
    {
      label: 'Documents',
      icon: FileText,
      render: (i: number) => (
        <CountUp to={files.length} delay={i * 0.06} duration={0.7} />
      ),
    },
    {
      label: 'Knowledge chunks',
      icon: Database,
      render: (i: number) => (
        <CountUp
          to={12.4}
          decimals={1}
          suffix="k"
          delay={i * 0.06}
          duration={0.85}
        />
      ),
    },
    {
      label: 'Queries',
      icon: MessageSquare,
      render: (i: number) => (
        <CountUp to={ANALYTICS.queries} delay={i * 0.06} duration={0.9} />
      ),
    },
    {
      label: 'Accuracy',
      icon: Target,
      render: (i: number) => (
        <CountUp
          to={ANALYTICS.accuracy}
          decimals={1}
          suffix="%"
          delay={i * 0.06}
          duration={0.85}
        />
      ),
    },
  ];

  return (
      <div className="space-y-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {workspace?.name ?? 'Workspace'}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              {chatbot?.name ?? 'Assistant'} · institutional knowledge at a glance
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/app/knowledge">
              <Button variant="secondary">Add sources</Button>
            </Link>
            <Link href="/app/playground">
              <Button variant="accent">Ask a question</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-black/[0.06] bg-zinc-50 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/15"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-wide text-zinc-500">{m.label}</p>
                <m.icon className="h-4 w-4 text-accent/70" />
              </div>
              <p className="mt-4 font-display text-3xl font-semibold tracking-tight tabular-nums">
                {m.render(i)}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
            className="rounded-2xl border border-black/[0.06] bg-zinc-50 p-8"
          >
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
            >
              <h2 className="font-medium">Query volume</h2>
              <span className="text-xs text-zinc-500">Last 7 days</span>
            </motion.div>
            <motion.div
              className="mt-8 h-56"
              initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
              animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
              transition={{
                delay: 0.35,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ANALYTICS.weeklySeries}
                  margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
                >
                  <defs>
                    <linearGradient id="q" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff4d2e" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#ff4d2e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    padding={{ left: 12, right: 12 }}
                    tickMargin={10}
                    tick={{ fill: '#52525b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    domain={[0, 2400]}
                    ticks={[0, 800, 1600, 2400]}
                    tick={{ fill: '#52525b', fontSize: 12 }}
                    tickMargin={6}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="queries"
                    stroke="#ff4d2e"
                    fill="url(#q)"
                    strokeWidth={2.5}
                    isAnimationActive
                    animationBegin={280}
                    animationDuration={1400}
                    animationEasing="ease-out"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: '#ff4d2e',
                      stroke: '#fff',
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>

          <div className="rounded-2xl border border-black/[0.06] bg-zinc-50 p-8">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              <h2 className="font-medium">Recent activity</h2>
            </div>
            <ul className="mt-8 space-y-5">
              {(activity.length ? activity : []).slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-4">
                  <p className="text-sm text-zinc-700">{a.text}</p>
                  <span className="shrink-0 text-xs text-zinc-600">{a.time}</span>
                </li>
              ))}
              {!activity.length ? (
                <li className="text-sm text-zinc-500">No activity yet — upload a protocol to begin.</li>
              ) : null}
            </ul>
            <Link href="/app/analytics" className="mt-8 inline-flex items-center gap-1 text-sm text-accent hover:underline">
              View analytics <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
  );
}
