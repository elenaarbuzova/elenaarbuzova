import { useLocation } from 'wouter';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Reveal';

const sections = [
  {
    title: 'Getting started',
    items: [
      'Create a workspace for your lab',
      'Upload protocols, SOPs, and publications',
      'Ask a question in Chat — answers list sources',
      'Optional: copy an embed for your portal',
    ],
  },
  {
    title: 'Knowledge',
    items: [
      'Supported: PDF, DOCX, TXT, Markdown, CSV, papers',
      'Sections and tables are kept where possible',
      'Tags and folders help organize the library',
      'Re-index when an SOP is revised',
    ],
  },
  {
    title: 'Citations',
    items: [
      'Answers include source title, type, and page or section',
      'Confidence reflects retrieval strength',
      'Open the original document from the citation chip',
    ],
  },
  {
    title: 'Embed',
    items: [
      'Script tag or iframe from Embed builder',
      'Appearance and greeting are editable in the builder',
      'Enterprise: SSO, audit logs, private routing',
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
          How LabAgent works
        </h1>
        <p className="mt-5 text-zinc-400">
          Short reference for the prototype — upload, ask, cite, embed.
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
