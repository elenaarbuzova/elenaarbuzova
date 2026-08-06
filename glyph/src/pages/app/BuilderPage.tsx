import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Copy,
  FlaskConical,
  MessageCircle,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { LiveWidget } from '@/components/widget/LiveWidget';
import { Field, Textarea } from '@/components/ui/Input';
import { useApp } from '@/lib/store';
import type { WidgetConfig } from '@/lib/data';
import { cn } from '@/lib/utils';

const THEME_COLORS = [
  { id: 'coral', value: '#ff4d2e', label: 'Coral' },
  { id: 'ink', value: '#111111', label: 'Ink' },
  { id: 'ocean', value: '#0f766e', label: 'Teal' },
  { id: 'slate', value: '#334155', label: 'Slate' },
  { id: 'amber', value: '#d97706', label: 'Amber' },
  { id: 'blue', value: '#1d4ed8', label: 'Blue' },
] as const;

const BOT_ID = 'bot_9f82x';

function DnaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4c3 3 7 3 10 0M7 20c3-3 7-3 10 0M8 8c2.5 2 5.5 2 8 0M8 16c2.5-2 5.5-2 8 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M9 6.5v11M15 6.5v11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

function FormatToggle({
  value,
  onChange,
}: {
  value: 'script' | 'iframe';
  onChange: (v: 'script' | 'iframe') => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-black/[0.08] bg-zinc-50 p-0.5 text-[11px]">
      {(
        [
          { id: 'script' as const, label: 'Script Tag' },
          { id: 'iframe' as const, label: 'iFrame Code' },
        ] as const
      ).map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            'rounded-md px-2.5 py-1 font-medium transition-all duration-200',
            value === opt.id
              ? 'bg-white text-black shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SitePreview({ config }: { config: WidgetConfig }) {
  return (
    <div className="relative isolate h-[640px] overflow-hidden rounded-2xl border border-black/[0.08] bg-[#eceae7] shadow-[0_24px_60px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-[#121214] dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
      {/* Browser chrome */}
      <div className="relative z-10 flex h-[42px] items-center gap-2 rounded-t-2xl border-b border-black/[0.06] bg-white px-4 dark:border-white/10 dark:bg-[#1a1a1d]">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-2 flex flex-1 items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 text-[11px] text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400">
          <Search className="h-3 w-3 shrink-0" />
          <span className="truncate">your-lab.com</span>
        </div>
      </div>

      {/* Mock landing + widget layer — explicit box so absolute bottom-* anchors correctly */}
      <div className="absolute inset-x-0 bottom-0 top-[42px] bg-gradient-to-br from-[#f8f7f5] via-white to-[#f0eeeb] dark:from-[#161618] dark:via-[#121214] dark:to-[#0e0e10]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 blur-[1.5px] dark:opacity-50"
          aria-hidden
        >
          <div className="mx-auto max-w-lg px-8 pt-10">
            <div className="mb-6 h-3 w-24 rounded bg-zinc-300/80 dark:bg-white/15" />
            <div className="mb-3 h-8 w-4/5 max-w-sm rounded-lg bg-zinc-800/15 dark:bg-white/20" />
            <div className="mb-2 h-3 w-full rounded bg-zinc-300/60 dark:bg-white/10" />
            <div className="mb-2 h-3 w-[92%] rounded bg-zinc-300/50 dark:bg-white/[0.08]" />
            <div className="mb-8 h-3 w-[70%] rounded bg-zinc-300/40 dark:bg-white/[0.06]" />
            <div className="mb-10 flex gap-3">
              <div className="h-9 w-28 rounded-full bg-zinc-800/20 dark:bg-white/20" />
              <div className="h-9 w-24 rounded-full border border-zinc-300/80 bg-white/50 dark:border-white/15 dark:bg-white/[0.06]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-xl border border-zinc-200/80 bg-white/60 dark:border-white/10 dark:bg-white/[0.05]"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#eceae7]/80 to-transparent dark:from-[#121214]/90" />

        <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-black/[0.06] bg-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 backdrop-blur-sm dark:border-white/10 dark:bg-white/10 dark:text-zinc-400">
          Live preview
        </div>

        <LiveWidget config={config} preview />
      </div>
    </div>
  );
}

export function BuilderPage() {
  const { widget, setWidget, publishWidget } = useApp();
  const [format, setFormat] = useState<'script' | 'iframe'>('script');
  const [copied, setCopied] = useState(false);

  const embedCode = useMemo(() => {
    if (format === 'iframe') {
      return `<iframe
  src="https://embed.labagent.ai/w/${BOT_ID}"
  width="400"
  height="640"
  style="border:0;border-radius:16px"
  title="${widget.name}"
  allow="clipboard-write"
></iframe>`;
    }
    return `<script
  src="https://cdn.labagent.ai/widget.js"
  data-id="${BOT_ID}"
  data-accent="${widget.accent}"
  data-position="${widget.position}"
  async
></script>`;
  }, [format, widget.accent, widget.name, widget.position]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
    } catch {
      /* demo fallback */
    }
    setCopied(true);
    publishWidget();
    toast.success('Embed code copied to clipboard');
    window.setTimeout(() => setCopied(false), 2000);
  };

  const iconOptions: {
    value: WidgetConfig['launcherIcon'];
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: 'chat',
      label: 'Chat',
      icon: <MessageCircle className="h-4 w-4" />,
    },
    {
      value: 'dna',
      label: 'DNA',
      icon: <DnaIcon className="h-4 w-4" />,
    },
    {
      value: 'flask',
      label: 'Flask',
      icon: <FlaskConical className="h-4 w-4" />,
    },
  ];

  return (
      <div className="space-y-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Embed builder
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Style your launcher, preview it on a live page, then paste one snippet
            to ship the assistant on your site.
          </p>
        </div>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          {/* Left: customization */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-black/[0.06] bg-white p-6 transition-all duration-200">
              <div className="mb-5">
                <h2 className="text-sm font-semibold tracking-tight">
                  Widget appearance
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Changes update the preview instantly.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-medium">Theme color</p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {THEME_COLORS.map((c) => {
                      const active =
                        widget.accent.toLowerCase() === c.value.toLowerCase();
                      return (
                        <button
                          key={c.id}
                          type="button"
                          title={c.label}
                          aria-label={c.label}
                          onClick={() => setWidget({ accent: c.value })}
                          className={cn(
                            'relative h-8 w-8 rounded-full transition-all duration-200',
                            active
                              ? 'scale-110 ring-2 ring-black ring-offset-2'
                              : 'hover:scale-105',
                          )}
                          style={{ background: c.value }}
                        >
                          {active ? (
                            <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white drop-shadow" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Field
                  label="Welcome message"
                  hint="Shown as the first message when visitors open the chat."
                >
                  <Textarea
                    value={widget.greeting}
                    onChange={(e) => setWidget({ greeting: e.target.value })}
                    rows={3}
                    className="transition-all duration-200"
                  />
                </Field>

                <div>
                  <p className="mb-3 text-sm font-medium">Chat icon style</p>
                  <div className="grid grid-cols-3 gap-2">
                    {iconOptions.map((opt) => {
                      const active = widget.launcherIcon === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setWidget({ launcherIcon: opt.value })
                          }
                          className={cn(
                            'flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-xs font-medium transition-all duration-200',
                            active
                              ? 'border-black bg-black text-white'
                              : 'border-black/[0.08] text-zinc-500 hover:border-black/15 hover:text-black',
                          )}
                        >
                          {opt.icon}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-black/[0.06] bg-white p-6 transition-all duration-200 dark:border-white/10 dark:bg-[#161618]">
              <div className="mb-1 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight">
                    Deployment
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Paste this code right before the closing{' '}
                    <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[10px] text-zinc-700 dark:bg-white/10 dark:text-zinc-300">
                      {'</head>'}
                    </code>{' '}
                    tag of your website.
                  </p>
                </div>
                <FormatToggle value={format} onChange={setFormat} />
              </div>

              <div className="relative mt-5 overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#121214] dark:shadow-none">
                <div className="flex items-center justify-between border-b border-black/[0.06] bg-zinc-50/80 px-4 py-2.5 dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
                    <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
                    <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
                    <span className="ml-2 font-mono text-[10px] text-zinc-400">
                      {format === 'script' ? 'embed.js' : 'embed.html'}
                    </span>
                  </div>
                  <motion.button
                    type="button"
                    onClick={copyCode}
                    whileTap={{ scale: 0.96 }}
                    className={cn(
                      'inline-flex min-w-[6.5rem] items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200',
                      copied
                        ? 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-white text-zinc-500 ring-1 ring-black/[0.06] hover:text-zinc-800 dark:bg-white/[0.06] dark:text-zinc-400 dark:ring-white/10 dark:hover:text-zinc-200',
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Code
                      </>
                    )}
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                  <code>
                    {embedCode.split('\n').map((line, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="w-4 shrink-0 select-none text-right text-zinc-300 dark:text-zinc-600">
                          {i + 1}
                        </span>
                        <span>
                          {line
                            .split(
                              /(<\/?script|<\/?iframe|data-id|data-accent|data-position|src=|async|title=|allow=|width=|height=|style=)/g,
                            )
                            .map((part, j) => {
                              if (
                                /^(<\/?script|<\/?iframe|async)$/.test(part)
                              ) {
                                return (
                                  <span key={j} className="text-[#e11d48]">
                                    {part}
                                  </span>
                                );
                              }
                              if (/^data-|^src=|^title=|^allow=|^width=|^height=|^style=/.test(part)) {
                                return (
                                  <span key={j} className="text-[#2563eb]">
                                    {part}
                                  </span>
                                );
                              }
                              return <span key={j}>{part}</span>;
                            })}
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>

              <button
                type="button"
                onClick={copyCode}
                className={cn(
                  'mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black text-white hover:bg-zinc-800',
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </>
                )}
              </button>

              {copied ? (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-center text-xs text-emerald-600"
                >
                  Ready to paste — your widget ID is {BOT_ID}.
                </motion.p>
              ) : null}
            </section>
          </div>

          {/* Right: live preview */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            <div className="mb-3 flex items-center justify-between px-0.5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                Desktop preview
              </p>
              <p className="text-xs text-zinc-400">
                Click the launcher to open chat
              </p>
            </div>
            <SitePreview config={widget} />
          </div>
        </div>
      </div>
  );
}
