import { useState, type MouseEvent, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { rememberHomeSection } from '@/lib/homeScroll';

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
  const [location, setLocation] = useLocation();

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
    const hashIndex = link.indexOf('#');
    if (hashIndex < 0) return;

    const id = link.slice(hashIndex + 1);
    const el = document.getElementById(id);

    if (el) {
      event.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
      return;
    }

    if (location !== '/') {
      event.preventDefault();
      rememberHomeSection(id);
      setLocation('/');
    }
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
          'pointer-events-none fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-[5000] mx-auto flex max-w-fit items-center justify-center sm:top-6',
          className,
        )}
      >
        <div className="pointer-events-auto flex items-center justify-center gap-1 rounded-full border border-black/10 bg-white/85 px-1.5 py-1 shadow-lg shadow-black/10 backdrop-blur-md sm:gap-2 sm:px-2 sm:py-1.5">
          <div className="flex items-center gap-0.5 sm:gap-1">
            {navItems.map((navItem, idx) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                onClick={onNavClick(navItem.link)}
                className={cn(
                  'relative flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:min-h-0 sm:min-w-0 sm:px-4',
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
              <div className="pr-0.5 sm:pr-1">{action}</div>
            </>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
