import { animate } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CountUp({
  to,
  duration = 0.85,
  decimals = 0,
  suffix = '',
  format,
  delay = 0,
}: {
  to: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  format?: (n: number) => string;
  delay?: number;
}) {
  const [text, setText] = useState(() =>
    format ? format(0) : decimals > 0 ? (0).toFixed(decimals) : '0',
  );

  useEffect(() => {
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (format) {
          setText(format(v));
        } else if (decimals > 0) {
          setText(v.toFixed(decimals));
        } else {
          setText(Math.round(v).toLocaleString('en-US'));
        }
      },
    });
    return () => controls.stop();
  }, [to, duration, decimals, format, delay]);

  return (
    <span>
      {text}
      {suffix}
    </span>
  );
}
