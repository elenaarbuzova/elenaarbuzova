import { Link } from 'wouter';
import { ArrowRight, Play } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Reveal';

export function TutorialPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-black/[0.06] px-6 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo />
          <Link href="/signup">
            <Button variant="accent" size="sm">
              Start free
            </Button>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Eyebrow>Product tour</Eyebrow>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          See LabAgent in five minutes
        </h1>
        <p className="mt-5 text-zinc-400">
          A guided walkthrough of knowledge upload, cited chat, and widget embed — no sales call
          required. Or book a live demo with our science team.
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl border border-black/[0.08] bg-gradient-to-br from-accent/10 to-accent-2/10">
          <div className="flex aspect-video flex-col items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_40px_rgba(255,77,46,0.25)]">
              <Play className="h-6 w-6 fill-current" />
            </div>
            <p className="text-sm text-zinc-400">Demo video placeholder</p>
          </div>
        </div>

        <ol className="mt-12 space-y-6">
          {[
            'Sign in to the Helix Bio demo workspace',
            'Open Chat and ask about the CRISPR protocol',
            'Inspect citations — page numbers included',
            'Customize and copy an embed snippet',
          ].map((step, i) => (
            <li key={step} className="flex gap-4 text-sm text-zinc-700">
              <span className="font-mono text-accent">0{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/login">
            <Button variant="accent" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Try the demo
            </Button>
          </Link>
          <Button variant="secondary" onClick={() => {}}>
            Book a live demo
          </Button>
        </div>
      </main>
    </div>
  );
}
