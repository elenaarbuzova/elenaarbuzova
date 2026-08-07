import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
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
        <Eyebrow>Walkthrough</Eyebrow>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Try LabAgent in a few minutes
        </h1>
        <p className="mt-5 text-zinc-400">
          Sign in to the sample workspace, ask a protocol question, then copy an embed
          snippet if you need the widget.
        </p>

        <ol className="mt-12 space-y-6">
          {[
            'Sign in to the Helix Bio sample workspace',
            'Open Chat and ask about the CRISPR protocol',
            'Open a citation and check the page reference',
            'In Embed builder, copy a script or iframe snippet',
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
              Open the demo
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
