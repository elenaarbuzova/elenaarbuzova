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
    <div className="inline-flex rounded-lg border border-black/[0.08] bg-zinc-50 p-0.5 text-[11px] dark:border-white/[0.08] dark:bg-white/[0.04]">
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
              ? 'bg-white text-black shadow-sm dark:bg-white/10 dark:text-zinc-100 dark:shadow-none'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300',
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
    <div className="relative isolate h-[520px] min-h-[420px] overflow-hidden rounded-2xl border border-black/[0.08] bg-[#eceae7] shadow-[0_24px_60px_rgba(0,0,0,0.1)] xl:h-full dark:border-white/[0.08] dark:bg-[#121214] dark:shadow-none">
      {/* Browser chrome */}
      <div className="relative z-10 flex h-[42px] items-center gap-2 rounded-t-2xl border-b border-black/[0.06] bg-white px-4 dark:border-white/[0.08] dark:bg-[#1a1a1d]">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-2 flex flex-1 items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 text-[11px] text-zinc-500 dark:bg-white/[0.05] dark:text-zinc-400">
          <Search className="h-3 w-3 shrink-0" />
          <span className="truncate">your-lab.com</span>
        </div>
      </div>

      {/* Mock landing + widget layer — explicit box so absolute bottom-* anchors correctly */}
      <div className="absolute inset-x-0 bottom-0 top-[42px] bg-gradient-to-br from-[#f8f7f5] via-white to-[#f0eeeb] dark:from-[#161618] dark:via-[#121214] dark:to-[#0e0e10]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 blur-[1.5px] dark:opacity-35 dark:blur-[1px]"
          aria-hidden
        >
          <div className="mx-auto max-w-lg px-8 pt-10">
            <div className="mb-6 h-3 w-24 rounded bg-zinc-300/80 dark:bg-zinc-600/50" />
            <div className="mb-3 h-8 w-4/5 max-w-sm rounded-lg bg-zinc-800/15 dark:bg-zinc-500/25" />
            <div className="mb-2 h-3 w-full rounded bg-zinc-300/60 dark:bg-zinc-600/35" />
            <div className="mb-2 h-3 w-[92%] rounded bg-zinc-300/50 dark:bg-zinc-600/28" />
            <div className="mb-8 h-3 w-[70%] rounded bg-zinc-300/40 dark:bg-zinc-600/22" />
            <div className="mb-10 flex gap-3">
              <div className="h-9 w-28 rounded-full bg-zinc-800/20 dark:bg-zinc-500/30" />
              <div className="h-9 w-24 rounded-full border border-zinc-300/80 bg-white/50 dark:border-zinc-600/40 dark:bg-zinc-700/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-xl border border-zinc-200/80 bg-white/60 dark:border-zinc-700/50 dark:bg-zinc-800/40"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#eceae7]/80 to-transparent dark:from-[#121214] dark:to-transparent" />

        <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-black/[0.06] bg-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 backdrop-blur-sm dark:border-white/[0.08] dark:bg-zinc-800/80 dark:text-zinc-400 dark:backdrop-blur-none">
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
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5174';

  const embedQuery = useMemo(() => {
    const p = new URLSearchParams({
      accent: widget.accent,
      name: widget.name,
      position: widget.position,
      avatar: widget.avatar,
      size: widget.size,
      radius: String(widget.radius),
      icon: widget.launcherIcon,
      branding: widget.showBranding ? '1' : '0',
    });
    return p.toString();
  }, [widget]);

  const embedUrl = `${origin}/embed?${embedQuery}`;

  const embedCode = useMemo(() => {
    if (format === 'iframe') {
      return `<iframe
  src="${embedUrl}"
  width="400"
  height="640"
  style="border:0;border-radius:16px;background:transparent"
  title="${widget.name}"
  allow="clipboard-write"
></iframe>`;
    }
    return `<script
  src="${origin}/widget.js"
  data-id="${BOT_ID}"
  data-accent="${widget.accent}"
  data-name="${widget.name}"
  data-position="${widget.position}"
  data-avatar="${widget.avatar}"
  data-size="${widget.size}"
  data-radius="${widget.radius}"
  data-icon="${widget.launcherIcon}"
  data-branding="${widget.showBranding ? '1' : '0'}"
  async
></script>`;
  }, [format, embedUrl, origin, widget]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
    } catch {
      /* demo fallback */
    }
    setCopied(true);
    publishWidget();
    toast.success('Embed code copied — works on this host');
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="mb-3 shrink-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-[1.75rem]">
          Embed builder
        </h1>
      </div>

      <div className="grid min-h-0 flex-1 items-stretch gap-6 overflow-y-auto overscroll-contain xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)] xl:overflow-hidden">
        {/* Left: customization — independent scroll on desktop */}
        <div className="space-y-6 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1">
            <section className="rounded-2xl border border-black/[0.06] bg-white p-6 transition-all duration-200 dark:border-white/[0.08] dark:bg-[#161618]">
              <div className="mb-5">
                <h2 className="text-sm font-semibold tracking-tight">
                  Widget appearance
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Changes appear in the preview.
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
                              ? 'scale-110 ring-2 ring-zinc-900 ring-offset-2 ring-offset-white dark:ring-zinc-100 dark:ring-offset-[#161618]'
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
                              ? 'border-black bg-black text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                              : 'border-black/[0.08] text-zinc-500 hover:border-black/15 hover:text-black dark:border-white/[0.08] dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-zinc-100',
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

            <section className="rounded-2xl border border-black/[0.06] bg-white p-6 transition-all duration-200 dark:border-white/[0.08] dark:bg-[#161618]">
              <div className="mb-1 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight">
                    Deployment
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Paste this code before the closing{' '}
                    <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[10px] text-zinc-700 dark:bg-white/10 dark:text-zinc-300">
                      {'</head>'}
                    </code>{' '}
                    tag of your website.
                  </p>
                </div>
                <FormatToggle value={format} onChange={setFormat} />
              </div>

              <div className="relative mt-5 overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.08] dark:bg-[#121214] dark:shadow-none">
                <div className="flex items-center justify-between border-b border-black/[0.06] bg-zinc-50/80 px-4 py-2.5 dark:border-white/[0.08] dark:bg-white/[0.03]">
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
                        : 'bg-white text-zinc-500 ring-1 ring-black/[0.06] hover:text-zinc-800 dark:bg-white/[0.05] dark:text-zinc-400 dark:ring-white/[0.08] dark:hover:text-zinc-200',
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
                              /(<\/?script|<\/?iframe|data-id|data-accent|data-position|src=|title=|allow=|width=|height=|style=|async)/g,
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
                    : 'bg-black text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white',
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
                  Ready to paste. Widget ID: {BOT_ID}.
                </motion.p>
              ) : null}
            </section>
        </div>

        {/* Right: desktop preview — pinned to top, no page scroll */}
        <div className="flex shrink-0 flex-col xl:min-h-0 xl:shrink xl:overflow-hidden">
          <div className="mb-2 flex shrink-0 items-center justify-between px-0.5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
              Desktop preview
            </p>
            <p className="text-xs text-zinc-400">
              Click the launcher to open chat
            </p>
          </div>
          <div className="xl:min-h-0 xl:flex-1">
            <SitePreview config={widget} />
          </div>
        </div>
      </div>
    </div>
  );
}
