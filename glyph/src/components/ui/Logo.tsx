import { cn } from '@/lib/utils';

/**
 * LabAgent mark — knowledge graph.
 * Interconnected nodes + thin edges. Flat, monochrome, no gradients.
 */
export function LogoMark({
  className,
  size = 28,
  inverted = false,
  withTile = false,
}: {
  className?: string;
  size?: number;
  /** Light strokes on dark surfaces */
  inverted?: boolean;
  /** Charcoal app-icon tile (favicon-style) */
  withTile?: boolean;
}) {
  const ink = inverted ? '#FAFAFA' : '#0A0A0A';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {withTile ? <rect width="32" height="32" rx="8" fill="#0A0A0A" /> : null}
      <g
        stroke={withTile ? '#FAFAFA' : ink}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 7.5L24 12.2" />
        <path d="M24 12.2L24 19.8" />
        <path d="M24 19.8L16 24.5" />
        <path d="M16 24.5L8 19.8" />
        <path d="M8 19.8L8 12.2" />
        <path d="M8 12.2L16 7.5" />
        <path d="M16 7.5L16 16" />
        <path d="M8 19.8L16 16" />
        <path d="M24 19.8L16 16" />
      </g>
      <g fill={withTile ? '#FAFAFA' : ink}>
        <circle cx="16" cy="7.5" r="2.05" />
        <circle cx="24" cy="12.2" r="2.05" />
        <circle cx="24" cy="19.8" r="2.05" />
        <circle cx="16" cy="24.5" r="2.05" />
        <circle cx="8" cy="19.8" r="2.05" />
        <circle cx="8" cy="12.2" r="2.05" />
        <circle cx="16" cy="16" r="2.35" />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  markOnly = false,
  light = false,
  variant,
  size = 'md',
  subtitle,
}: {
  className?: string;
  markOnly?: boolean;
  light?: boolean;
  /** light = dark mark/text on light surfaces; dark = light mark/text on dark surfaces */
  variant?: 'light' | 'dark';
  size?: 'md' | 'lg';
  subtitle?: string;
}) {
  const onLight =
    variant !== 'dark' && (variant === 'light' || light || variant === undefined);
  const large = size === 'lg';
  const markSize = large ? 34 : 26;

  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      {/* Symbol */}
      <LogoMark
        size={markSize}
        inverted={!onLight}
        className="shrink-0"
      />
      {!markOnly ? (
        <div className="min-w-0 leading-none">
          {/* Wordmark */}
          <span
            className={cn(
              'font-display tracking-[-0.045em]',
              large ? 'text-[21px] font-semibold' : 'text-[16px] font-semibold',
              onLight ? 'text-zinc-950' : 'text-zinc-50',
            )}
          >
            LabAgent
            <span className="text-accent">.ai</span>
          </span>
          {subtitle ? (
            <p
              className={cn(
                'mt-1 text-[11px] font-medium tracking-[-0.01em]',
                onLight ? 'text-zinc-500' : 'text-zinc-400',
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
