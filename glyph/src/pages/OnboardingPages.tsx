import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, Upload } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';
import { useApp } from '@/lib/store';
import { knowledgeFileFromUpload } from '@/lib/upload';
import { createSampleProtocolFile } from '@/lib/sampleUpload';
import { cn } from '@/lib/utils';

/** Solid black CTA — stays visible on white auth/onboarding even in dark theme */
const ctaClass =
  'bg-black text-white hover:bg-zinc-800 dark:bg-black dark:text-white dark:hover:bg-zinc-800';

function Shell({
  step,
  total,
  children,
}: {
  step: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white px-6 py-10 text-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,77,46,0.07),transparent_50%)]" />
      <div className="relative mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <Logo variant="light" />
          <span className="font-mono text-xs text-zinc-400">
            {step}/{total}
          </span>
        </div>
        <div className="mt-6 flex gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-0.5 flex-1 rounded-full transition-all duration-500',
                i < step ? 'bg-accent' : 'bg-black/[0.08]',
              )}
            />
          ))}
        </div>
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-14"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

function WelcomeStep() {
  const [, setLocation] = useLocation();
  return (
    <Shell step={1} total={4}>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Welcome</p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-black md:text-4xl">
        Set up your workspace
      </h1>
      <p className="mt-5 text-zinc-500">
        Name the lab, upload a document, and ask a first question.
      </p>
      <Button
        variant="primary"
        size="lg"
        className={cn('mt-10', ctaClass)}
        rightIcon={<ArrowRight className="h-4 w-4" />}
        onClick={() => setLocation('/onboarding/workspace')}
      >
        Continue
      </Button>
    </Shell>
  );
}

function WorkspaceStep() {
  const { setWorkspace } = useApp();
  const [, setLocation] = useLocation();
  const [name, setName] = useState('Helix Bio');
  const [industry, setIndustry] = useState('Biotech');

  return (
    <Shell step={2} total={4}>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Organization</p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-black">
        Name your workspace
      </h1>
      <p className="mt-4 text-sm text-zinc-500">
        Documents you upload stay inside this workspace.
      </p>
      <form
        className="mt-10 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setWorkspace({ name, website: '', industry });
          setLocation('/onboarding/knowledge');
        }}
      >
        <Field label="Organization">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Focus">
          <Input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Biotech, Pharma, Academic core…"
          />
        </Field>
        <Button type="submit" variant="primary" size="lg" className={cn('w-full', ctaClass)}>
          Continue
        </Button>
      </form>
    </Shell>
  );
}

function KnowledgeStep() {
  const { addFiles, setChatbot, updateFile } = useApp();
  const [, setLocation] = useLocation();
  const [uploaded, setUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [fileName, setFileName] = useState('CRISPR_Cas9_Transfection_v3.pdf');

  const finishSampleUpload = () => {
    if (processing || uploaded) return;
    setProcessing(true);
    const doc = createSampleProtocolFile({
      project: 'Genetics Archive',
      folder: 'Protocols',
      source: 'upload',
    });
    setFileName(doc.name);
    addFiles([doc]);
    window.setTimeout(() => {
      updateFile(doc.id, { status: 'ready', activeInChatbot: true });
      setProcessing(false);
      setUploaded(true);
    }, 900);
  };

  const onDropFiles = (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file || processing || uploaded) return;
    setProcessing(true);
    void (async () => {
      const doc = await knowledgeFileFromUpload(file, {
        project: 'Genetics Archive',
        source: 'upload',
        folder: 'Protocols',
      });
      setFileName(doc.name);
      addFiles([doc]);
      window.setTimeout(() => {
        updateFile(doc.id, { status: 'ready', activeInChatbot: true });
        setProcessing(false);
        setUploaded(true);
      }, 900);
    })();
  };

  return (
    <Shell step={3} total={4}>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Knowledge</p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-black">
        Upload a document
      </h1>
      <p className="mt-4 text-sm text-zinc-500">
        PDF, DOCX, Markdown, CSV, or papers. Structure is kept where possible.
      </p>

      <button
        type="button"
        onClick={finishSampleUpload}
        disabled={processing || uploaded}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.files?.length) onDropFiles(e.dataTransfer.files);
        }}
        className={cn(
          'mt-10 flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 transition-all duration-300',
          uploaded
            ? 'border-success/30 bg-success/5'
            : 'border-black/15 bg-zinc-50 hover:border-accent/40 hover:bg-accent/[0.03]',
        )}
      >
        {processing ? (
          <>
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="mt-4 text-sm text-zinc-500">Uploading…</p>
          </>
        ) : uploaded ? (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-success">
              File uploaded successfully
            </p>
            <p className="mt-1 text-xs text-zinc-500">{fileName}</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-accent" />
            <p className="mt-4 text-sm font-medium text-black">
              Drop files or click to upload
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Or{' '}
              <span className="font-medium text-accent underline-offset-2">
                use sample CRISPR protocol
              </span>
            </p>
          </>
        )}
      </button>

      <Button
        variant="primary"
        size="lg"
        className={cn('mt-8 w-full', ctaClass)}
        disabled={!uploaded}
        onClick={() => {
          setChatbot({
            name: 'Lab Assistant',
            purpose: 'Answers from uploaded protocols and SOPs, with sources listed.',
            language: 'English',
            tone: 'Precise',
          });
          setLocation('/onboarding/done');
        }}
      >
        Continue
      </Button>
      <button
        type="button"
        className="mt-4 w-full text-center text-sm text-zinc-500 hover:text-black"
        onClick={() => {
          setChatbot({
            name: 'Lab Assistant',
            purpose: 'Answers from uploaded protocols and SOPs, with sources listed.',
            language: 'English',
            tone: 'Precise',
          });
          setLocation('/onboarding/done');
        }}
      >
        Skip for now
      </button>
    </Shell>
  );
}

function DoneStep() {
  const { completeOnboarding, setTrained } = useApp();
  const [, setLocation] = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTrained(true);
    const t = setTimeout(() => setReady(true), 1600);
    return () => clearTimeout(t);
  }, [setTrained]);

  return (
    <Shell step={4} total={4}>
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className={cn(
            'mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-white',
            ready
              ? 'bg-emerald-500 shadow-[0_0_32px_rgba(16,185,129,0.35)]'
              : 'bg-gradient-to-br from-accent to-accent-2 shadow-[0_0_40px_rgba(255,77,46,0.3)]',
          )}
        >
          {ready ? (
            <Check className="h-8 w-8" strokeWidth={2.5} />
          ) : (
            <Sparkles className="h-7 w-7 animate-pulse" />
          )}
        </motion.div>
        <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight text-black">
          {ready ? 'Ready' : 'Indexing documents…'}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm text-zinc-500">
          {ready
            ? 'Open Chat and ask about a protocol or SOP.'
            : 'This usually takes a minute.'}
        </p>
        <Button
          variant="primary"
          size="lg"
          className={cn('mt-10', ctaClass)}
          disabled={!ready}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          onClick={() => {
            completeOnboarding();
            setLocation('/app');
          }}
        >
          Enter workspace
        </Button>
      </div>
    </Shell>
  );
}

export function OnboardingRouter() {
  const params = useParams<{ step?: string }>();
  const { user } = useApp();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) setLocation('/signup');
  }, [user, setLocation]);

  const step = params.step ?? 'welcome';
  if (step === 'workspace') return <WorkspaceStep />;
  if (step === 'knowledge' || step === 'chatbot' || step === 'training') return <KnowledgeStep />;
  if (step === 'done') return <DoneStep />;
  return <WelcomeStep />;
}
