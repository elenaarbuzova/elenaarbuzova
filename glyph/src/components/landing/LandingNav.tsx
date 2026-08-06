import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

const links = [
  { href: '#reasons', label: 'Solutions' },
  { href: '#features', label: 'Features' },
  { href: '#testimonials', label: 'Customers' },
  { href: '#pricing', label: 'Pricing' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/85 backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 md:h-[72px]">
        <Link href="/" className="justify-self-start">
          <Logo variant="light" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-black/70 transition-colors duration-200 hover:text-black"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 justify-self-end md:flex">
          <Link href="/login">
            <span className="text-[13px] font-medium text-black/55 transition-colors duration-200 hover:text-black">
              Log in
            </span>
          </Link>
          <Link href="/signup">
            <span className="inline-flex h-10 items-center rounded-full bg-black px-5 text-[13px] font-medium text-white transition-colors hover:bg-zinc-800">
              Sign up
            </span>
          </Link>
        </div>

        <button
          type="button"
          className="justify-self-end rounded-lg p-2 text-black md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-black/[0.06] bg-white px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-black/70"
              >
                {l.label}
              </a>
            ))}
            <Link href="/login" onClick={() => setOpen(false)}>
              <span className="mt-2 inline-flex h-10 w-full items-center justify-center text-[13px] font-medium text-black/60">
                Log in
              </span>
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)}>
              <span className="inline-flex h-10 w-full items-center justify-center rounded-full bg-black text-[13px] font-medium text-white">
                Sign up
              </span>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
