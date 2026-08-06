import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-[15px] text-black outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-accent/50 focus:ring-4 focus:ring-accent/10',
        'dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-accent/40 dark:focus:ring-accent/15',
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-[96px] w-full resize-none rounded-xl border border-black/10 bg-white px-3.5 py-3 text-[15px] text-black outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-accent/50 focus:ring-4 focus:ring-accent/10',
        'dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-accent/40 dark:focus:ring-accent/15',
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('mb-1.5 block text-sm font-medium text-zinc-600 dark:text-zinc-300', className)}>
      {children}
    </label>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}
