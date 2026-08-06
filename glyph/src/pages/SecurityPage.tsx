import { Link } from 'wouter';
import { ArrowLeft, Fingerprint, Lock, Server, Shield } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Eyebrow, Reveal } from '@/components/ui/Reveal';

const pillars = [
  {
    icon: Lock,
    title: 'Encryption',
    body: 'TLS in transit. AES-256 at rest. Keys managed via HSM-backed KMS on Enterprise.',
  },
  {
    icon: Shield,
    title: 'SOC 2 & GDPR',
    body: 'Controls mapped to SOC 2 Type II readiness. GDPR data processing agreements available.',
  },
  {
    icon: Fingerprint,
    title: 'Access control',
    body: 'Role-based permissions, SSO / SCIM on Enterprise, and workspace isolation by default.',
  },
  {
    icon: Server,
    title: 'Private datasets',
    body: 'Your documents never train foundation models. Optional private routing and VPC.',
  },
];

export function SecurityPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-black/[0.06] px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Logo />
          <Link href="/">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Home
            </Button>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <Reveal>
          <Eyebrow>Security</Eyebrow>
          <h1 className="max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Built for labs that treat knowledge as IP.
          </h1>
          <p className="mt-6 max-w-xl text-zinc-400">
            LabAgent is designed for biotech, pharma, and regulated R&D — where provenance and
            isolation matter as much as speed.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-black/[0.06] p-8">
                <p.icon className="h-5 w-5 text-accent" />
                <h2 className="mt-5 text-lg font-semibold">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 rounded-2xl border border-black/[0.08] bg-zinc-50 p-10">
            <h2 className="text-xl font-semibold">Audit-ready trails</h2>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Every query can retain source provenance for inspection. Enterprise unlocks immutable
              audit log export for GLP and quality systems.
            </p>
            <Link href="/signup" className="mt-8 inline-block">
              <Button variant="accent">Start free</Button>
            </Link>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
