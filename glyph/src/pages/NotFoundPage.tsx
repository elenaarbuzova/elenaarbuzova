import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.12),transparent_55%)]" />
      <Logo />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 font-mono text-sm text-accent"
      >
        404
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl"
      >
        This sequence isn’t in the library.
      </motion.h1>
      <p className="mt-4 max-w-md text-sm text-zinc-400">
        The page you’re looking for doesn’t exist — or was moved when we reorganized the genome.
      </p>
      <div className="mt-10 flex gap-3">
        <Link href="/">
          <Button variant="accent">Back home</Button>
        </Link>
        <Link href="/app">
          <Button variant="secondary">Open app</Button>
        </Link>
      </div>
    </div>
  );
}
