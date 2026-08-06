declare module '@/components/background/DnaBackground' {
  import type { RefObject } from 'react';

  export function DnaBackground(props: {
    scrollTarget?: RefObject<HTMLElement | null>;
    reasonsTarget?: RefObject<HTMLElement | null>;
    theme?: 'light' | 'dark';
    onGatherChange?: (t: number) => void;
  }): JSX.Element;
}
