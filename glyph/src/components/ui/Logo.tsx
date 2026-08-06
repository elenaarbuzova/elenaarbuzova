import { cn } from '@/lib/utils';

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
  /** light = black mark on white surfaces (default) */
  variant?: 'light' | 'dark';
  size?: 'md' | 'lg';
  subtitle?: string;
}) {
  const onLight = variant !== 'dark' && (variant === 'light' || light || variant === undefined);
  const large = size === 'lg';

  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-lg',
          large ? 'h-9 w-9 rounded-xl' : 'h-7 w-7',
          onLight ? 'bg-black text-white' : 'bg-gradient-to-br from-accent to-accent-2 text-white',
        )}
      >
        <svg
          width={large ? 16 : 14}
          height={large ? 16 : 14}
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
        >
          <path
            d="M7 1.5c-1.2 1.8-2.8 2.6-5 3 2.2.4 3.8 1.2 5 3 1.2-1.8 2.8-2.6 5-3-2.2-.4-3.8-1.2-5-3z"
            fill="currentColor"
            opacity="0.95"
          />
          <circle cx="7" cy="7.5" r="1.2" fill="currentColor" />
        </svg>
      </div>
      {!markOnly ? (
        <div className="min-w-0 leading-none">
          <span
            className={cn(
              'font-display font-bold tracking-[-0.04em]',
              large ? 'text-[22px]' : 'text-[17px] font-semibold',
              onLight ? 'text-black' : 'text-white',
            )}
          >
            LabAgent
            <span className="text-accent">.ai</span>
          </span>
          {subtitle ? (
            <p
              className={cn(
                'mt-1 text-[12px] font-medium tracking-[-0.01em]',
                onLight ? 'text-zinc-400' : 'text-white/55',
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
