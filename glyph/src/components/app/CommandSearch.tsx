import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import {
  BarChart3,
  BookOpen,
  CreditCard,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Puzzle,
  Search,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

type Hit = {
  id: string;
  label: string;
  hint?: string;
  href: string;
  group: 'Pages' | 'Documents' | 'Actions';
  icon: LucideIcon;
};

const PAGES: Hit[] = [
  { id: 'p-overview', label: 'Overview', hint: 'Dashboard', href: '/app', group: 'Pages', icon: LayoutDashboard },
  { id: 'p-sources', label: 'Sources', hint: 'Knowledge base', href: '/app/knowledge', group: 'Pages', icon: BookOpen },
  { id: 'p-chat', label: 'Chat', hint: 'Research assistant', href: '/app/playground', group: 'Pages', icon: MessageSquare },
  { id: 'p-builder', label: 'Widget', hint: 'Embed builder & copy code', href: '/app/builder', group: 'Pages', icon: Puzzle },
  { id: 'p-analytics', label: 'Analytics', hint: 'Usage & queries', href: '/app/analytics', group: 'Pages', icon: BarChart3 },
  { id: 'p-billing', label: 'Billing', hint: 'Plans & invoices', href: '/app/billing', group: 'Pages', icon: CreditCard },
  { id: 'p-settings', label: 'Settings', hint: 'Workspace & team', href: '/app/settings', group: 'Pages', icon: Settings },
];

const ACTIONS: Hit[] = [
  { id: 'a-ask', label: 'Ask a question', hint: 'Open chat', href: '/app/playground', group: 'Actions', icon: MessageSquare },
  { id: 'a-upload', label: 'Upload documents', hint: 'Add sources', href: '/app/knowledge', group: 'Actions', icon: BookOpen },
];

function matchQuery(text: string, q: string) {
  const hay = text.toLowerCase();
  const needle = q.toLowerCase().trim();
  if (!needle) return true;
  return needle.split(/\s+/).every((part) => hay.includes(part));
}

export function HeaderSearch({ className }: { className?: string }) {
  const [, setLocation] = useLocation();
  const { files } = useApp();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hits = useMemo(() => {
    const docs: Hit[] = files.map((f) => ({
      id: `doc-${f.id}`,
      label: f.name,
      hint: [f.folder, f.type, ...(f.tags ?? [])].filter(Boolean).join(' · '),
      href: '/app/knowledge',
      group: 'Documents' as const,
      icon: FileText,
    }));

    const all = [...PAGES, ...docs, ...ACTIONS];
    const filtered = all.filter(
      (h) =>
        matchQuery(h.label, query) ||
        matchQuery(h.hint ?? '', query) ||
        matchQuery(h.group, query),
    );
    const order = ['Pages', 'Documents', 'Actions'] as const;
    return order.flatMap((g) => filtered.filter((h) => h.group === g));
  }, [files, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, []);

  const go = (hit: Hit) => {
    setLocation(hit.href);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const groups = (['Pages', 'Documents', 'Actions'] as const).filter((g) =>
    hits.some((h) => h.group === g),
  );

  let flatIndex = -1;

  return (
    <div ref={rootRef} className={cn('relative min-w-0 flex-1', className)}>
      <div className="flex h-11 w-full items-center gap-3 rounded-full bg-white px-5 transition-all duration-200 dark:bg-[#1a1a1c]">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, Math.max(hits.length - 1, 0)));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && hits[active]) {
              e.preventDefault();
              go(hits[active]);
            } else if (e.key === 'Escape') {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder="Search for article, video or document"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-zinc-400"
        />
        <Search className="h-4 w-4 shrink-0 text-zinc-400" strokeWidth={1.75} />
      </div>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#1a1a1d] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
          <div className="max-h-[min(50vh,360px)] overflow-y-auto p-1.5">
            {hits.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-zinc-400">No results</p>
            ) : (
              groups.map((group) => (
                <div key={group} className="mb-0.5">
                  <p className="px-2.5 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    {group}
                  </p>
                  {hits
                    .filter((h) => h.group === group)
                    .map((hit) => {
                      flatIndex += 1;
                      const index = flatIndex;
                      const Icon = hit.icon;
                      return (
                        <button
                          key={hit.id}
                          type="button"
                          onMouseEnter={() => setActive(index)}
                          onClick={() => go(hit)}
                          className={cn(
                            'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors',
                            active === index
                              ? 'bg-accent/[0.08] text-black'
                              : 'text-zinc-700 hover:bg-black/[0.03]',
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                              active === index
                                ? 'bg-accent text-white'
                                : 'bg-zinc-100 text-zinc-500',
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-medium">
                              {hit.label}
                            </span>
                            {hit.hint ? (
                              <span className="block truncate text-[11px] text-zinc-400">
                                {hit.hint}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
