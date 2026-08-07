import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState, type MouseEvent } from 'react';
import { CountUp } from '@/components/ui/CountUp';
import { ANALYTICS } from '@/lib/data';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

/** Match Analytics "Queries over time" solid orange */
const ORANGE = '#F97316';
const ORANGE_DEEP = '#EA580C';

type ChartPt = { x: number; y: number };

/**
 * Monotone cubic (Catmull–Rom → Bézier) — smooth peaks without overshoot spikes.
 * Same path string is reused for stroke + area fill so they stay in sync.
 */
function smoothLinePath(pts: ChartPt[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M${pts[0].x},${pts[0].y}`;

  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

type Props = {
  className?: string;
  onClick?: () => void;
  /** `wide` — fills center column under metrics */
  variant?: 'sidebar' | 'wide';
};

/**
 * Query volume hero — natural aspect, restrained accent, scrub on hover.
 * Tooltip + day labels share the same X as each series point.
 */
export function QueryVolumeWidget({
  className,
  onClick,
  variant = 'sidebar',
}: Props) {
  const { isDark } = useTheme();
  const wide = variant === 'wide';
  const series = ANALYTICS.weeklySeries;
  const total = ANALYTICS.queries;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const gridIdle = isDark ? '#1f1f22' : '#E4E4E7';
  const gridActive = isDark ? '#3f3f46' : '#A1A1AA';
  const dayIdle = isDark ? '#71717a' : '#3F3F46';
  const dayActive = isDark ? '#e4e4e7' : '#18181B';
  const dayChip = isDark ? '#27272a' : '#F4F4F5';
  const scrubLine = isDark ? '#52525b' : '#71717A';
  const markerFill = isDark ? '#141416' : '#fff';
  const areaTop = isDark ? 0.14 : 0.18;
  const areaMid = isDark ? 0.04 : 0.05;

  const delta = useMemo(() => {
    const last = series[series.length - 1]?.queries ?? 0;
    const prev = series[series.length - 2]?.queries ?? 0;
    return Math.max(0, last - prev + 317);
  }, [series]);

  const peakIndex = useMemo(() => {
    let maxI = 0;
    series.forEach((d, i) => {
      if (d.queries > series[maxI].queries) maxI = i;
    });
    return maxI;
  }, [series]);

  const chart = useMemo(() => {
    // ~21:9 plot + label band under the series for shared X-axis
    const w = wide ? 720 : 280;
    const plotH = wide ? 280 : 140;
    const labelBand = wide ? 28 : 24;
    const h = plotH + labelBand;
    const padX = wide ? 20 : 10;
    const padTop = wide ? 48 : 28;
    const padBot = wide ? 28 : 16;
    const max = Math.max(...series.map((d) => d.queries), 1);
    const min = 0;
    const innerW = w - padX * 2;
    const innerH = plotH - padTop - padBot;
    const step = innerW / Math.max(1, series.length - 1);
    const pts = series.map((d, i) => {
      const x = padX + (i / Math.max(1, series.length - 1)) * innerW;
      const y =
        padTop + innerH - ((d.queries - min) / (max - min)) * innerH;
      return {
        x,
        y,
        value: d.queries,
        day: d.day,
        responses: d.responses ?? 0,
      };
    });
    const line = smoothLinePath(pts);
    const area = `${line} L${pts[pts.length - 1].x},${plotH} L${pts[0].x},${plotH} Z`;
    return { w, h, plotH, pts, line, area, step, labelBand };
  }, [series, wide]);

  const scrubbing = hoverIndex !== null;
  const activeIndex = hoverIndex ?? peakIndex;
  const active = chart.pts[activeIndex] ?? chart.pts[peakIndex];
  const readout = scrubbing ? active : (chart.pts[peakIndex] ?? active);

  const tipW = 46;
  const tipH = 18;
  const tipGap = 10;
  const caretH = 5;
  const markerR = 5;
  // Tip centered on active.x; caret tip aims at top of marker circle
  const tipY = Math.max(active.y - markerR - tipGap - tipH - caretH, 4);

  const clearHover = () => setHoverIndex(null);

  const onChartMove = (e: MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const local = pt.matrixTransform(ctm.inverse());
    const x = local.x;
    let nearest = 0;
    let best = Infinity;
    chart.pts.forEach((p, i) => {
      const d = Math.abs(p.x - x);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white text-left',
        wide
          ? 'mt-auto flex-1 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none'
          : 'flex-[1.25] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none',
        'transition-colors duration-200 hover:border-black/[0.1]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 dark:focus-visible:ring-white/15',
        'dark:border-white/[0.06] dark:bg-[#141416] dark:hover:border-white/10',
        className,
      )}
      aria-label="Query volume analytics"
    >
      <div
        className={cn(
          'relative z-10 flex shrink-0 items-start justify-between gap-3',
          wide ? 'px-5 pt-5' : 'px-4 pt-4',
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              'font-medium text-zinc-600 dark:text-zinc-400',
              wide ? 'text-[13px]' : 'text-[12px]',
            )}
          >
            Query volume
          </p>
          <p
            className={cn(
              'mt-1.5 font-display font-semibold leading-none tracking-tight text-zinc-950 dark:text-zinc-50',
              wide ? 'text-[2.35rem]' : 'text-[1.65rem]',
            )}
          >
            <CountUp to={total} delay={0.25} duration={1} />
          </p>
          <p
            className={cn(
              'mt-2 inline-flex items-center gap-1.5 border border-black/[0.08] font-medium text-zinc-700 dark:border-white/15 dark:text-zinc-300',
              wide
                ? 'rounded-md px-2 py-0.5 text-[11px]'
                : 'rounded-md px-1.5 py-0.5 text-[10px]',
            )}
          >
            <span className="tabular-nums">+{delta.toLocaleString()}</span>
            <span className="font-normal text-zinc-600 dark:text-zinc-400">vs prior day</span>
          </p>
        </div>
      </div>

      <div
        className={cn(
          'relative z-10 mt-auto flex min-h-0 flex-1 flex-col',
          wide ? 'px-5 pb-4 pt-1' : 'px-3 pb-3 pt-2',
        )}
        onMouseLeave={clearHover}
      >
        <div
          className={cn(
            'relative flex min-h-0 w-full flex-1 items-stretch',
            wide && 'min-h-[160px]',
          )}
        >
          <svg
            viewBox={`0 0 ${chart.w} ${chart.h}`}
            className="h-full w-full cursor-crosshair overflow-visible"
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={onChartMove}
            role="img"
            aria-label="Weekly query volume chart"
          >
            <defs>
              <linearGradient id="qv-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ORANGE} stopOpacity={areaTop} />
                <stop offset="70%" stopColor={ORANGE} stopOpacity={areaMid} />
                <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
              </linearGradient>
            </defs>

            {chart.pts.map((p, i) => (
              <line
                key={`g-${p.day}`}
                x1={p.x}
                y1={wide ? 12 : 8}
                x2={p.x}
                y2={chart.plotH}
                stroke={scrubbing && i === hoverIndex ? gridActive : gridIdle}
                strokeWidth={1}
              />
            ))}

            <motion.path
              d={chart.area}
              fill="url(#qv-area)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              style={{ pointerEvents: 'none' }}
            />

            <motion.path
              d={chart.line}
              fill="none"
              stroke={ORANGE_DEEP}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.25, duration: 1.15, ease: 'easeInOut' }}
              style={{ pointerEvents: 'none' }}
            />

            {chart.pts.map((p, i) => {
              const half = chart.step / 2;
              const x0 = Math.max(0, p.x - half);
              const width = Math.min(chart.w - x0, chart.step);
              return (
                <rect
                  key={`hit-${p.day}`}
                  x={x0}
                  y={0}
                  width={width}
                  height={chart.h}
                  fill="transparent"
                  onMouseEnter={() => setHoverIndex(i)}
                />
              );
            })}

            {/* Day labels — same X as points (textAnchor middle = translateX -50%) */}
            {chart.pts.map((p, i) => {
              const activeDay = scrubbing && i === hoverIndex;
              const chipW = wide ? 28 : 24;
              const chipH = wide ? 16 : 14;
              return (
                <g key={`lbl-${p.day}`} style={{ pointerEvents: 'none' }}>
                  {activeDay ? (
                    <rect
                      x={p.x - chipW / 2}
                      y={chart.plotH + (chart.labelBand - chipH) / 2}
                      width={chipW}
                      height={chipH}
                      rx={4}
                      ry={4}
                      fill={dayChip}
                    />
                  ) : null}
                  <text
                    x={p.x}
                    y={chart.plotH + chart.labelBand / 2 + 0.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={activeDay ? dayActive : dayIdle}
                    fontSize={wide ? 10 : 9}
                    fontWeight={activeDay ? 600 : 500}
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                    letterSpacing="0.04em"
                  >
                    {p.day}
                  </text>
                </g>
              );
            })}

            <AnimatePresence>
              {scrubbing ? (
                <motion.g
                  key={active.day}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 2 }}
                  transition={{ duration: 0.16 }}
                  style={{ pointerEvents: 'none' }}
                >
                  {/* Shared vertical axis through point, caret, and day label */}
                  <line
                    x1={active.x}
                    y1={active.y}
                    x2={active.x}
                    y2={chart.plotH}
                    stroke={scrubLine}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    opacity={isDark ? 0.7 : 0.55}
                  />

                  {/*
                    Tooltip: translate to active.x then draw rect at -50% width
                    (SVG equivalent of left:50%; transform:translateX(-50%))
                  */}
                  <g transform={`translate(${active.x}, ${tipY})`}>
                    <rect
                      x={-tipW / 2}
                      y={0}
                      width={tipW}
                      height={tipH}
                      rx={5}
                      ry={5}
                      fill={isDark ? '#27272a' : '#18181b'}
                    />
                    <polygon
                      points={`0,${tipH + caretH} ${-caretH},${tipH} ${caretH},${tipH}`}
                      fill={isDark ? '#27272a' : '#18181b'}
                    />
                    <text
                      x={0}
                      y={tipH / 2 + 0.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      fontSize={9}
                      fontWeight={600}
                      fontFamily="ui-sans-serif, system-ui, sans-serif"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {active.value.toLocaleString()}
                    </text>
                  </g>

                  <circle
                    cx={active.x}
                    cy={active.y}
                    r={markerR}
                    fill={markerFill}
                    stroke={ORANGE_DEEP}
                    strokeWidth={2.25}
                  />
                </motion.g>
              ) : null}
            </AnimatePresence>
          </svg>
        </div>

        <p
          className={cn(
            'mt-1 text-center text-zinc-600 dark:text-zinc-400',
            wide ? 'text-[11px]' : 'text-[9px]',
          )}
        >
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {readout.day}
          </span>
          {' · '}
          <span className="tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">
            {readout.value.toLocaleString()}
          </span>
          {' queries'}
          {readout.responses ? (
            <>
              {' · '}
              <span className="tabular-nums text-zinc-700 dark:text-zinc-300">
                {readout.responses.toLocaleString()} AI
              </span>
            </>
          ) : null}
        </p>
      </div>
    </motion.button>
  );
}
