import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import portrait from '@assets/generated_images/hero-portrait.png';

export function AvatarCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const rawX = useMotionValue(-120);
  const rawY = useMotionValue(-120);
  const x = useSpring(rawX, { stiffness: 420, damping: 32, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 420, damping: 32, mass: 0.35 });

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add('has-avatar-cursor');

    const onMove = (event: MouseEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      setHovering(
        Boolean(target?.closest('a, button, [role="button"], input, textarea, select, label')),
      );
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

    return () => {
      document.documentElement.classList.remove('has-avatar-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{ x, y }}
    >
      <motion.div
        className="size-[3.25rem] md:size-16 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-foreground bg-muted shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        animate={{ scale: hovering ? 1.14 : 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      >
        <img
          src={portrait}
          alt=""
          className="h-full w-full object-cover object-[center_16%]"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}
