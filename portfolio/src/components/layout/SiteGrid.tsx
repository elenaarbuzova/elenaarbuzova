import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/utils';

type SiteGridProps<T extends ElementType = 'div'> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;

/** Shared page grid — one max width + gutters for every section edge. */
export function SiteGrid<T extends ElementType = 'div'>({
  as,
  className,
  ...props
}: SiteGridProps<T>) {
  const Comp = as ?? 'div';
  return <Comp className={cn('site-grid w-full', className)} {...props} />;
}
