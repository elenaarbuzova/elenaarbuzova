import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-black text-white hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-zinc-200',
  secondary:
    'bg-white text-black border border-black/10 hover:border-black/20 hover:bg-zinc-50 active:scale-[0.98] dark:border-white/15 dark:bg-white/[0.06] dark:text-zinc-100 dark:hover:bg-white/10',
  ghost:
    'bg-transparent text-zinc-500 hover:text-black hover:bg-black/[0.04] dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100',
  danger: 'bg-danger text-white hover:bg-red-700 active:scale-[0.98]',
  accent:
    'bg-black text-white hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-zinc-200',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-full',
  md: 'h-10 px-5 text-sm rounded-full',
  lg: 'h-12 px-6 text-[13px] font-semibold tracking-wide rounded-full',
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-out disabled:opacity-45 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});
