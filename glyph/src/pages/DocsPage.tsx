import { useLocation } from 'wouter';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Reveal';

const sections = [
  {
    title: 'Getting started',
    items: [
      'Create a workspace for your lab or R&D org',
      'Upload protocols, SOPs, and publications',
      'Generate a research assistant with citations enabled',
      'Ask your first scientific question in Chat',
    ],
  },
  {
    title: 'Knowledge ingestion',
    items: [
      'Supported: PDF, DOCX, TXT, Markdown, CSV, research papers',
      'Structure-aware chunking preserves sections and tables',
      'Tags and collections organize institutional memory',
      'Re-index when SOPs are revised — version awareness coming soon',
    ],
  },
  {
    title: 'Citations & trust',
    items: [
      'Every answer includes source title, type, and page/section',
      'Confidence scores reflect retrieval strength',
      'Researchers can open the original document from the citation chip',
    ],
  },
  {
    title: 'Embed & API',
    items: [
      'iframe, JavaScript snippet, React, and Vue embeds',
      'API keys under Settings → API Keys',
      'Enterprise: SSO, audit logs, private model routing',
    ],
  },
];

export function DocsPage() {
  const [, setLocation] = useLocation();

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      setLocation('/app');
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-black/[0.06] px-6 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Eyebrow>Documentation</Eyebrow>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Build a scientific assistant
        </h1>
        <p className="mt-5 text-zinc-400">
          Concise reference for LabAgent — enough to ship a prototype tomorrow.
        </p>

        <div className="mt-16 space-y-12">
          {sections.map((s) => (
            <section key={s.title}>
              <div className="mb-5 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
              </div>
              <ul className="space-y-3">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-black/[0.06] bg-zinc-50 px-5 py-4 text-sm text-zinc-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={goBack}
          >
            Back
          </Button>
        </div>
      </main>
    </div>
  );
}
