import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Soft Marc Kuiper–style enter: fade + slight rise (not a long bottom scroll). */
export function PageEnter({
  children,
  className,
  animateKey,
}: {
  children: ReactNode;
  className?: string;
  animateKey?: string;
}) {
  return (
    <motion.div
      key={animateKey}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.85,
        ease: EASE,
        opacity: { duration: 0.7, ease: EASE },
      }}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}
