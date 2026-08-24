import { motion, useScroll } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();
  const [location] = useLocation();
  const onHome = location === '/';

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const sectionHref = (hash: string) => (onHome ? hash : `/${hash}`);

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-colors duration-500 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/40' : 'bg-transparent border-b border-transparent'}`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 }}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-6">
        <Link href="/" className="text-sm font-semibold tracking-wide uppercase shrink-0">
          Elena Arbuzova
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          <nav className="hidden md:flex gap-8 text-xs font-medium tracking-widest uppercase">
            <a href={sectionHref('#about')} className="hover:opacity-50 transition-opacity">
              {t.nav.about}
            </a>
            <a href={sectionHref('#work')} className="hover:opacity-50 transition-opacity">
              {t.nav.work}
            </a>
            <a href={sectionHref('#contact')} className="hover:opacity-50 transition-opacity">
              {t.nav.contact}
            </a>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </motion.header>
  );
}
