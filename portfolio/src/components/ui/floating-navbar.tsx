import { useState, type MouseEvent, type ReactNode } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { cn } from '@/lib/utils';

export type FloatingNavItem = {
  name: string;
  link: string;
  icon?: ReactNode;
};

export function FloatingNav({
  navItems,
  className,
  action,
}: {
  navItems: FloatingNavItem[];
  className?: string;
  action?: ReactNode;
}) {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (typeof current !== 'number') return;

    const previous = scrollYProgress.getPrevious() ?? current;
    const direction = current - previous;

    if (scrollYProgress.get() < 0.05) {
      setVisible(true);
      return;
    }

    setVisible(direction < 0);
  });

  const onNavClick = (link: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!link.startsWith('#')) return;
    const id = link.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', link);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          'pointer-events-none fixed inset-x-0 top-6 z-[5000] mx-auto flex max-w-fit items-center justify-center',
          className,
        )}
      >
        <div className="pointer-events-auto flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/85 px-2 py-1.5 shadow-lg shadow-black/10 backdrop-blur-md">
          <div className="flex items-center gap-1">
            {navItems.map((navItem, idx) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                onClick={onNavClick(navItem.link)}
                className={cn(
                  'relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900',
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block">{navItem.name}</span>
              </a>
            ))}
          </div>

          {action ? (
            <>
              <div className="h-5 w-px bg-neutral-200" />
              <div className="pr-1">{action}</div>
            </>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
