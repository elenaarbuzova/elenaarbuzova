import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FileText,
  FlaskConical,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import type { WidgetConfig } from '@/lib/data';
import { cn } from '@/lib/utils';

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

export function LiveWidget({
  config,
  className,
}: {
  config: WidgetConfig;
  className?: string;
  /** @deprecated preview is always relative to parent */
  preview?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const panel = PANEL_SIZE[config.size] ?? PANEL_SIZE.medium;
  const launcher = LAUNCHER_SIZE[config.size] ?? LAUNCHER_SIZE.medium;

  // Always pin to bottom-right in the embed preview (classic widget placement)
  const corner = 'right-4 bottom-4';
  const windowPos = 'right-4 bottom-20';

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-50',
        className,
      )}
    >
      {/* Chat window — only when open */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chat-window"
            role="dialog"
            aria-label={config.name || 'Chat'}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'pointer-events-auto absolute z-50 flex flex-col overflow-hidden border border-zinc-200/90 bg-white text-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.18)]',
              'dark:border-white/10 dark:bg-[#1a1a1d] dark:text-zinc-100 dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]',
              panel,
              windowPos,
            )}
            style={{ borderRadius: config.radius }}
          >
            {/* Header */}
            <div
              className="flex shrink-0 items-center justify-between px-4 py-3 text-white transition-colors duration-200"
              style={{ background: config.accent }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/15 text-sm font-semibold">
                  {(config.name || 'L').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    {config.name || 'Assistant'}
                  </p>
                  <p className="text-[11px] opacity-75">Online · Ready to help</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 opacity-80 transition-all duration-200 hover:bg-black/10 hover:opacity-100"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
              <div className="max-w-[92%] rounded-2xl rounded-tl-md bg-zinc-100 px-3.5 py-2.5 leading-relaxed text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-200">
                {config.greeting}
              </div>

              <div
                className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md px-3.5 py-2.5 text-white transition-colors duration-200"
                style={{ background: config.accent }}
              >
                Storage conditions for reagent X?
              </div>

              <div className="max-w-[92%] rounded-2xl rounded-tl-md bg-zinc-100 px-3.5 py-2.5 leading-relaxed text-zinc-800 dark:bg-white/[0.08] dark:text-zinc-200">
                Per SOP-042, store reagent X at −80°C in ≤50 µL aliquots. Thaw on
                ice; do not refreeze more than once.
                {(config.showCitations || config.showConfidence) && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-zinc-200/80 pt-2.5 dark:border-white/10">
                    {config.showCitations ? (
                      <>
                        <span className="inline-flex h-5 items-center justify-center gap-1 rounded-full border border-zinc-200 bg-white px-2 text-[10px] leading-none text-zinc-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                          <FileText className="h-3 w-3 text-[#ff4d2e]" />
                          SOP-042 · p. 3.2
                        </span>
                        <span className="inline-flex h-5 items-center justify-center gap-1 rounded-full border border-zinc-200 bg-white px-2 text-[10px] leading-none text-zinc-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                          <FileText className="h-3 w-3 text-[#ff4d2e]" />
                          Storage.pdf
                        </span>
                      </>
                    ) : null}
                    {config.showConfidence ? (
                      <span className="inline-flex h-5 items-center justify-center rounded-full border border-[#ff4d2e]/20 bg-[#ff4d2e]/5 px-2 text-[10px] leading-none text-[#ff4d2e]">
                        97% confidence
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              {config.enableSuggestions
                ? config.suggestions.filter(Boolean).slice(0, 3).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="mr-1.5 inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] text-zinc-600 transition-all duration-200 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-zinc-200"
                    >
                      {s}
                    </button>
                  ))
                : null}
            </div>

            {/* Input bar */}
            <div className="shrink-0 border-t border-zinc-100 bg-white p-3 dark:border-white/10 dark:bg-[#1a1a1d]">
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 transition-all duration-200 focus-within:border-zinc-300 focus-within:bg-white dark:border-transparent dark:bg-white/[0.06] dark:focus-within:border-white/15 dark:focus-within:bg-white/[0.08]">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask a question…"
                  className="min-w-0 flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setDraft('');
                  }}
                />
                <button
                  type="button"
                  onClick={() => setDraft('')}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white transition-all duration-200 hover:opacity-90"
                  style={{ background: config.accent }}
                  aria-label="Send"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              {config.showBranding ? (
                <p className="mt-2 text-center text-[10px] text-zinc-400">
                  Powered by LabAgent.ai
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          'pointer-events-auto absolute z-50 flex items-center justify-center text-white shadow-[0_8px_30px_rgba(0,0,0,0.22)] transition-all duration-200 hover:scale-105 active:scale-95',
          launcher,
          corner,
          config.launcher === 'bar' ? 'rounded-xl' : 'rounded-full',
        )}
        style={{ background: config.accent }}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <LauncherGlyph icon={config.launcherIcon} className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
