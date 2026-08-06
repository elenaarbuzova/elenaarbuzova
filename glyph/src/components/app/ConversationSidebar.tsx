import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Archive,
  Copy,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  KNOWLEDGE_BASES,
  conversationDateGroup,
  conversationMatchesQuery,
  conversationWorkspaceId,
  formatRelativeEdited,
  type Conversation,
  type DateGroup,
  type KnowledgeBaseId,
} from '@/lib/conversations';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

const GROUP_ORDER: DateGroup[] = [
  'Pinned',
  'Today',
  'Yesterday',
  'Last Week',
  'Older',
];

export function ConversationSidebar() {
  const {
    conversations,
    activeConversationId,
    activeProjectId,
    setActiveConversation,
    updateConversation,
    deleteConversation,
    duplicateConversation,
  } = useApp();

  const [query, setQuery] = useState('');
  const [kbFilter, setKbFilter] = useState<KnowledgeBaseId | 'All'>('All');
  const [menuId, setMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const renameRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return conversations
      .filter((c) => (showArchived ? c.archived : !c.archived))
      .filter((c) => conversationWorkspaceId(c) === activeProjectId)
      .filter((c) => kbFilter === 'All' || c.knowledgeBase === kbFilter)
      .filter((c) => conversationMatchesQuery(c, query));
  }, [conversations, query, kbFilter, showArchived, activeProjectId]);

  const grouped = useMemo(() => {
    const map = new Map<DateGroup, Conversation[]>();
    GROUP_ORDER.forEach((g) => map.set(g, []));

    const pinned = filtered.filter((c) => c.pinned);
    map.set('Pinned', pinned);

    filtered
      .filter((c) => !c.pinned)
      .forEach((c) => {
        const g = conversationDateGroup(c.updatedAt);
        map.get(g)!.push(c);
      });

    GROUP_ORDER.forEach((g) => {
      map.get(g)!.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    });

    return map;
  }, [filtered]);

  const startRename = (c: Conversation) => {
    setMenuId(null);
    setRenamingId(c.id);
    setRenameValue(c.title);
    window.setTimeout(() => renameRef.current?.focus(), 30);
  };

  const commitRename = (id: string) => {
    const title = renameValue.trim();
    if (title) updateConversation(id, { title });
    setRenamingId(null);
  };

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col overflow-hidden rounded-l-[2rem] border-r border-black/[0.06] bg-zinc-50/80 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="shrink-0 space-y-3 border-b border-black/[0.06] px-3 pb-3 pt-5 dark:border-white/10">
        <div className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-2.5 py-2 dark:border-white/10 dark:bg-white/5">
          <Search className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full bg-transparent text-[13px] leading-normal outline-none placeholder:text-zinc-400"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setKbFilter('All')}
            className={cn(
              'rounded-full px-1.5 py-px text-[9px] font-medium leading-5 transition-all duration-300',
              kbFilter === 'All'
                ? 'bg-black text-white'
                : 'bg-white text-zinc-500 ring-1 ring-black/10 hover:text-black',
            )}
          >
            All
          </button>
          {KNOWLEDGE_BASES.map((kb) => (
            <button
              key={kb}
              type="button"
              onClick={() => setKbFilter(kb)}
              className={cn(
                'rounded-full px-1.5 py-px text-[9px] font-medium leading-5 transition-all duration-300',
                kbFilter === kb
                  ? 'bg-black text-white'
                  : 'bg-white text-zinc-500 ring-1 ring-black/10 hover:text-black',
              )}
            >
              {kb}
            </button>
          ))}
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto p-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeProjectId}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="transition-all duration-200"
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-10 text-center">
                <p className="text-sm text-zinc-500">No conversations found</p>
              </div>
            ) : (
              GROUP_ORDER.map((group) => {
                const items = grouped.get(group) ?? [];
                if (!items.length) return null;
                return (
                  <div key={group} className="mb-3">
                    <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                      {group}
                    </p>
                    <div className="space-y-1.5">
                      {items.map((c) => {
                        const active = c.id === activeConversationId;
                        const msgCount = c.messages.length;
                        return (
                          <div
                            key={c.id}
                            className={cn(
                              'group relative rounded-xl transition-all duration-200',
                              active
                                ? 'bg-white shadow-sm ring-1 ring-black/[0.06] dark:bg-white/[0.1] dark:ring-white/10 dark:shadow-none'
                                : 'hover:bg-white/80 dark:hover:bg-white/[0.06]',
                              c.pinned &&
                                !active &&
                                'bg-accent/[0.05] ring-1 ring-accent/10 dark:bg-accent/[0.08] dark:ring-accent/15',
                              c.pinned &&
                                active &&
                                'bg-accent/[0.07] ring-accent/20 dark:bg-accent/[0.12] dark:ring-accent/25',
                            )}
                          >
                        {renamingId === c.id ? (
                          <form
                            className="px-2.5 py-2"
                            onSubmit={(e) => {
                              e.preventDefault();
                              commitRename(c.id);
                            }}
                          >
                            <input
                              ref={renameRef}
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onBlur={() => commitRename(c.id)}
                              className="w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-[13px] text-ink outline-none focus:border-black/20 dark:border-white/10 dark:bg-white/5"
                            />
                          </form>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveConversation(c.id)}
                            className="w-full px-2.5 py-2 text-left"
                          >
                            <div className="flex items-start gap-1.5">
                              {c.pinned ? (
                                <Pin className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                              ) : null}
                              {c.favorite ? (
                                <Star className="mt-0.5 h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
                              ) : null}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                                  {c.title}
                                </p>
                                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-400">
                                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
                                    {c.knowledgeBase}
                                  </span>
                                  <span>{formatRelativeEdited(c.updatedAt)}</span>
                                  <span>·</span>
                                  <span>{msgCount} msgs</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        )}

                        <div className="absolute right-1 top-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuId((v) => (v === c.id ? null : c.id));
                            }}
                            className="rounded-lg p-1 text-zinc-400 opacity-0 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-700 group-hover:opacity-100 dark:hover:bg-white/10 dark:hover:text-zinc-200"
                            aria-label="Conversation actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          <AnimatePresence>
                            {menuId === c.id ? (
                              <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-8 z-30 w-44 overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
                              >
                                {(
                                  [
                                    {
                                      label: c.pinned ? 'Unpin' : 'Pin to top',
                                      icon: c.pinned ? PinOff : Pin,
                                      onClick: () =>
                                        updateConversation(c.id, {
                                          pinned: !c.pinned,
                                        }),
                                    },
                                    {
                                      label: c.favorite ? 'Unfavorite' : 'Favorite',
                                      icon: Star,
                                      onClick: () =>
                                        updateConversation(c.id, {
                                          favorite: !c.favorite,
                                        }),
                                    },
                                    {
                                      label: 'Rename',
                                      icon: Pencil,
                                      onClick: () => startRename(c),
                                    },
                                    {
                                      label: 'Duplicate',
                                      icon: Copy,
                                      onClick: () => {
                                        duplicateConversation(c.id);
                                        toast.success('Conversation duplicated');
                                      },
                                    },
                                    {
                                      label: c.archived ? 'Unarchive' : 'Archive',
                                      icon: Archive,
                                      onClick: () => {
                                        updateConversation(c.id, {
                                          archived: !c.archived,
                                        });
                                        toast.message(
                                          c.archived
                                            ? 'Restored from archive'
                                            : 'Archived',
                                        );
                                      },
                                    },
                                    {
                                      label: 'Delete',
                                      icon: Trash2,
                                      danger: true,
                                      onClick: () => {
                                        deleteConversation(c.id);
                                        toast.message('Conversation deleted');
                                      },
                                    },
                                  ] as const
                                ).map((item) => (
                                  <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => {
                                      item.onClick();
                                      setMenuId(null);
                                    }}
                                    className={cn(
                                      'flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors hover:bg-zinc-50',
                                      'danger' in item && item.danger
                                        ? 'text-danger'
                                        : 'text-zinc-700',
                                    )}
                                  >
                                    <item.icon className="h-3.5 w-3.5" />
                                    {item.label}
                                  </button>
                                ))}
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => setShowArchived((v) => !v)}
        className="border-t border-black/[0.06] px-4 py-2.5 text-left text-[11px] text-zinc-500 transition-colors hover:bg-white hover:text-zinc-800 dark:border-white/10 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200"
      >
        {showArchived ? 'Show active' : 'Show archived'}
      </button>
    </aside>
  );
}
