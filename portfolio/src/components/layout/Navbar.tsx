import { motion, useScroll } from 'framer-motion';
import { useState, useEffect, type MouseEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();
  const [location] = useLocation();
  const onHome = location === '/';

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const scrollToSection = (hash: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    if (!onHome) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', hash);
  };

  const sectionHref = (hash: string) => (onHome ? hash : `/${hash}`);

  const navLinks = [
    { hash: '#about', label: t.nav.about },
    { hash: '#work', label: t.nav.work },
    { hash: '#contact', label: t.nav.contact },
  ] as const;

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

        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden md:flex gap-8 text-xs font-medium tracking-widest uppercase">
            {navLinks.map(({ hash, label }) => (
              <a
                key={hash}
                href={sectionHref(hash)}
                onClick={scrollToSection(hash)}
                className="hover:opacity-50 transition-opacity"
              >
                {label}
              </a>
            ))}
          </nav>

          <LanguageSwitcher />

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center size-9 -mr-1 text-foreground hover:opacity-50 transition-opacity"
                aria-label={t.nav.menu}
              >
                <Menu className="size-5" strokeWidth={1.75} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw,20rem)] border-border/40">
              <SheetHeader>
                <SheetTitle className="text-left text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  {t.nav.menu}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-10 flex flex-col gap-8">
                {navLinks.map(({ hash, label }) => (
                  <a
                    key={hash}
                    href={sectionHref(hash)}
                    onClick={scrollToSection(hash)}
                    className="text-2xl font-bold tracking-tight hover:opacity-50 transition-opacity"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
