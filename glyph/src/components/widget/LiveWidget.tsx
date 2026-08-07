import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  FlaskConical,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import type { WidgetConfig } from '@/lib/data';
import { answerFromKnowledge } from '@/lib/knowledge';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

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

function LauncherGlyph({
  icon,
  className,
}: {
  icon: WidgetConfig['launcherIcon'];
  className?: string;
}) {
  if (icon === 'flask') return <FlaskConical className={className} />;
  if (icon === 'dna') return <DnaIcon className={className} />;
  return <MessageCircle className={className} />;
}

function TypingDots({ accent }: { accent: string }) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-2xl rounded-tl-md bg-zinc-100 px-3.5 py-3 dark:bg-white/[0.08]"
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full"
          style={{ background: accent }}
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          transition={{
            duration: 0.95,
            repeat: Infinity,
            delay: i * 0.14,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

const PANEL_SIZE = {
  compact: 'h-[340px] w-[280px]',
  medium: 'h-[400px] w-[320px]',
  large: 'h-[440px] w-[360px]',
} as const;

const LAUNCHER_SIZE = {
  compact: 'h-12 w-12',
  medium: 'h-14 w-14',
  large: 'h-16 w-16',
} as const;

type Msg = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; type: string; page?: string }[];
  confidence?: number;
};

function SourceCard({
  sources,
  accent,
}: {
  sources: { title: string; type: string; page?: string }[];
  accent: string;
}) {
  const primary = sources[0];
  if (!primary) return null;

  return (
    <div className="mt-2.5 rounded-lg border border-zinc-200/80 bg-white/80 px-2.5 py-2 dark:border-white/[0.08] dark:bg-white/[0.04]">
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
        Source
      </p>
      <div className="mt-1 flex items-start gap-2">
        <FileText
          className="mt-0.5 h-3.5 w-3.5 shrink-0"
          style={{ color: accent }}
        />
        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium leading-snug text-zinc-700 dark:text-zinc-200">
            {primary.title}
          </p>
          {primary.page ? (
            <p className="mt-0.5 text-[11px] text-zinc-400">
              {/^\d/.test(primary.page.replace(/^Page\s+/i, ''))
                ? `Page ${primary.page.replace(/^Page\s+/i, '')}`
                : primary.page}
            </p>
          ) : (
            <p className="mt-0.5 text-[11px] text-zinc-400">{primary.type}</p>
          )}
        </div>
      </div>
      {sources.length > 1 ? (
        <p className="mt-1.5 text-[10px] text-zinc-400">
          +{sources.length - 1} more source{sources.length > 2 ? 's' : ''}
        </p>
      ) : null}
    </div>
  );
}

export function LiveWidget({
  config,
  className,
  mode = 'preview',
  defaultOpen = false,
}: {
  config: WidgetConfig;
  className?: string;
  /** preview = absolute in mock browser; embed = fixed on host page */
  mode?: 'preview' | 'embed';
  defaultOpen?: boolean;
  /** @deprecated */
  preview?: boolean;
}) {
  const { files } = useApp();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const panel = PANEL_SIZE[config.size] ?? PANEL_SIZE.medium;
  const launcher = LAUNCHER_SIZE[config.size] ?? LAUNCHER_SIZE.medium;
  const isLeft = config.position === 'bottom-left';
  const corner = isLeft ? 'left-4 bottom-4' : 'right-4 bottom-4';
  const windowPos = isLeft ? 'left-4 bottom-20' : 'right-4 bottom-20';
  const shell = mode === 'embed' ? 'fixed' : 'absolute';
  const canSend = draft.trim().length > 0 && !busy;
  const isEmpty = messages.length === 0;

  const suggestions = useMemo(
    () => config.suggestions.filter(Boolean).slice(0, 4),
    [config.suggestions],
  );

  useEffect(() => {
    const el = listRef.current;
    if (!el || !isOpen) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, busy, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 240);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  const insertSuggestion = (text: string) => {
    setDraft(text);
    inputRef.current?.focus();
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setDraft('');
    setBusy(true);
    const userMsg: Msg = { id: `u-${Date.now()}`, role: 'user', content: q };
    setMessages((m) => [...m, userMsg]);

    await new Promise((r) => setTimeout(r, 700));
    const res = answerFromKnowledge(q, files);
    setMessages((m) => [
      ...m,
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        sources: res.sources,
        confidence: res.confidence,
      },
    ]);
    setBusy(false);
  };

  return (
    <div
      className={cn(
        'pointer-events-none inset-0 z-50',
        shell === 'fixed' ? 'fixed' : 'absolute',
        className,
      )}
    >
      {isOpen ? (
          <motion.div
            key="chat-window"
            role="dialog"
            aria-label={config.name || 'Chat'}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease }}
            className={cn(
              'pointer-events-auto absolute z-50 flex flex-col overflow-hidden border border-zinc-200/80 bg-white text-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.16)]',
              'dark:border-white/10 dark:bg-[#1a1a1d] dark:text-zinc-100 dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]',
              panel,
              windowPos,
            )}
            style={{ borderRadius: config.radius }}
          >
            {/* Header */}
            <div
              className="flex shrink-0 items-center justify-between px-4 py-3 text-white"
              style={{ background: config.accent }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/15 text-sm font-semibold">
                  {(config.avatar || config.name || 'L').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight tracking-tight">
                    {config.name || 'Assistant'}
                  </p>
                  <p className="text-[11px] leading-tight opacity-80">
                    Research Assistant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 opacity-80 transition-all duration-200 hover:bg-black/10 hover:opacity-100 active:scale-95"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 text-sm"
            >
              <div
                className={cn(
                  'flex flex-col gap-3',
                  isEmpty && 'my-auto items-center',
                )}
              >
                <div
                  className={cn(
                    'max-w-[92%] rounded-2xl rounded-tl-md bg-zinc-100 px-3.5 py-2.5 leading-relaxed text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-200',
                    isEmpty && 'text-[13px]',
                  )}
                >
                  {config.greeting}
                </div>

                {config.enableSuggestions && isEmpty && !busy ? (
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => insertSuggestion(s)}
                        className="pointer-events-auto max-w-full rounded-full border border-zinc-200/90 bg-white px-2.5 py-1.5 text-left text-[11px] leading-snug text-zinc-600 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:text-zinc-900 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-zinc-200"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {messages.map((m) =>
                m.role === 'user' ? (
                  <div
                    key={m.id}
                    className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md px-3.5 py-2.5 text-white"
                    style={{ background: config.accent }}
                  >
                    {m.content}
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className="max-w-[92%] rounded-2xl rounded-tl-md bg-zinc-100 px-3.5 py-2.5 leading-relaxed text-zinc-800 dark:bg-white/[0.08] dark:text-zinc-200"
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    {config.showCitations && m.sources?.length ? (
                      <SourceCard
                        sources={m.sources}
                        accent={config.accent}
                      />
                    ) : null}
                    {config.showConfidence && m.confidence ? (
                      <p className="mt-2 text-[10px] text-zinc-400">
                        {m.confidence}% match to indexed documents
                      </p>
                    ) : null}
                  </div>
                ),
              )}

              {busy ? (
                <div className="flex justify-start">
                  <TypingDots accent={config.accent} />
                </div>
              ) : null}
            </div>

            {/* Composer */}
            <div className="shrink-0 border-t border-zinc-100/90 bg-white p-3 dark:border-white/10 dark:bg-[#1a1a1d]">
              <form
                className="flex items-center gap-2 rounded-xl border border-zinc-200/90 bg-zinc-50 px-3 py-2 transition-all duration-200 focus-within:border-zinc-300 focus-within:bg-white dark:border-transparent dark:bg-white/[0.06] dark:focus-within:border-white/15 dark:focus-within:bg-white/[0.08]"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send(draft);
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={
                    busy
                      ? 'Searching your documents…'
                      : 'Ask about a protocol or document…'
                  }
                  disabled={busy}
                  className="min-w-0 flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 disabled:opacity-60 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  aria-label="Send"
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white transition-all duration-200',
                    canSend
                      ? 'opacity-100 hover:scale-105 active:scale-95'
                      : 'cursor-not-allowed opacity-40',
                  )}
                  style={{ background: config.accent }}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              {config.showBranding ? (
                <p className="mt-2 text-center text-[10px] text-zinc-400">
                  Answers from your organization’s documents
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}

      <motion.button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'pointer-events-auto absolute z-50 flex items-center justify-center text-white shadow-[0_12px_32px_rgba(0,0,0,0.25)]',
          launcher,
          corner,
        )}
        style={{
          background: config.accent,
          borderRadius: config.launcher === 'bar' ? 14 : 9999,
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <LauncherGlyph icon={config.launcherIcon} className="h-5 w-5" />
        )}
      </motion.button>
    </div>
  );
}
