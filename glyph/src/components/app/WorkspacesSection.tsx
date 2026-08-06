import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  WORKSPACES,
  WorkspaceAnchor,
  type Workspace,
  type WorkspaceId,
} from '@/lib/workspaces';
import { cn } from '@/lib/utils';

const COLOR_OPTS = [
  { id: 'violet', color: 'bg-violet-500', glow: 'shadow-[0_0_8px_rgba(139,92,246,0.5)]', border: 'border-violet-500', activeBg: 'bg-violet-500/[0.08] dark:bg-violet-500/15', shape: 'square' as const },
  { id: 'teal', color: 'bg-teal-400', glow: 'shadow-[0_0_8px_rgba(45,212,191,0.5)]', border: 'border-teal-400', activeBg: 'bg-teal-400/[0.08] dark:bg-teal-400/15', shape: 'diamond' as const },
  { id: 'amber', color: 'bg-amber-500', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]', border: 'border-amber-500', activeBg: 'bg-amber-500/[0.08] dark:bg-amber-500/15', shape: 'circle' as const },
  { id: 'sky', color: 'bg-sky-500', glow: 'shadow-[0_0_8px_rgba(14,165,233,0.5)]', border: 'border-sky-500', activeBg: 'bg-sky-500/[0.08] dark:bg-sky-500/15', shape: 'circle' as const },
  { id: 'rose', color: 'bg-rose-500', glow: 'shadow-[0_0_8px_rgba(244,63,94,0.5)]', border: 'border-rose-500', activeBg: 'bg-rose-500/[0.08] dark:bg-rose-500/15', shape: 'square' as const },
];

export type { WorkspaceId };

export function WorkspacesSection({
  activeId,
  onSelect,
  onClose,
}: {
  activeId: WorkspaceId | null;
  onSelect: (id: WorkspaceId | null) => void;
  onClose?: () => void;
}) {
  const [items, setItems] = useState<Workspace[]>(WORKSPACES);
  const [open, setOpen] = useState(true);
  const [creating, setCreating] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftColor, setDraftColor] = useState(COLOR_OPTS[0]);
  const [headerHover, setHeaderHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = () => {
    setOpen((v) => {
      if (v) {
        setCreating(false);
        setDraftName('');
      }
      return !v;
    });
  };

  const startCreate = () => {
    if (!open) setOpen(true);
    setCreating(true);
    setDraftName('');
    setDraftColor(COLOR_OPTS[0]);
    window.setTimeout(() => inputRef.current?.focus(), 40);
  };

  const cancelCreate = () => {
    setCreating(false);
    setDraftName('');
  };

  const saveCreate = () => {
    const name = draftName.trim();
    if (!name) {
      inputRef.current?.focus();
      return;
    }
    const id = `ws-${Date.now()}`;
    setItems((prev) => [
      ...prev,
      {
        id,
        name,
        count: '00',
        color: draftColor.color,
        glow: draftColor.glow,
        shape: draftColor.shape,
        border: draftColor.border,
        activeBg: draftColor.activeBg,
      },
    ]);
    setCreating(false);
    setDraftName('');
    onSelect(id);
    toast.success(`Workspace “${name}” created`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col px-1.5">
      <div
        className="group mb-1 flex items-center justify-between px-2 py-1"
        onMouseEnter={() => setHeaderHover(true)}
        onMouseLeave={() => setHeaderHover(false)}
      >
        <button
          type="button"
          onClick={toggleOpen}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-1 text-left"
        >
          <motion.span
            animate={{ rotate: open ? 0 : -90 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex shrink-0 text-zinc-400"
          >
            <ChevronDown className="h-3 w-3" strokeWidth={2.5} />
          </motion.span>
          <span className="text-[11px] font-semibold lowercase tracking-[0.04em] text-zinc-500">
            workspaces
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              startCreate();
            }}
            aria-label="New workspace"
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-md text-zinc-400 transition-all duration-150',
              'hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200',
              headerHover || creating ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          {onClose ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close workspaces"
              className="flex h-5 w-5 items-center justify-center rounded-md text-zinc-400 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.25} />
            </button>
          ) : null}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="workspace-body"
            initial={{ height: 0, opacity: 0, y: -6 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5">
              {items.map((ws) => {
                const active = activeId === ws.id;
                return (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => onSelect(ws.id)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg border-l-2 px-2 py-1.5 text-left transition-all duration-150 ease-in-out',
                      active
                        ? cn(ws.border, ws.activeBg, 'text-zinc-900 dark:text-zinc-100')
                        : 'border-transparent text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-100',
                    )}
                  >
                    <WorkspaceAnchor color={ws.color} glow={ws.glow} shape={ws.shape} />
                    <span className="min-w-0 flex-1 truncate text-xs font-medium">
                      {ws.name}
                    </span>
                    <span
                      className={cn(
                        'font-mono text-[10px] tabular-nums',
                        active
                          ? 'text-zinc-500 dark:text-zinc-400'
                          : 'text-zinc-400/80',
                      )}
                    >
                      {ws.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {creating ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, height: 0, y: -4 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-1.5 rounded-xl border border-black/[0.08] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/[0.06]">
                    <div className="mb-2 flex items-center gap-1.5 px-0.5">
                      {COLOR_OPTS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setDraftColor(c)}
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-md transition-all duration-150',
                            draftColor.id === c.id
                              ? 'bg-zinc-100 ring-1 ring-black/10 dark:bg-white/10 dark:ring-white/15'
                              : 'hover:bg-zinc-50 dark:hover:bg-white/[0.06]',
                          )}
                          aria-label={`Color ${c.id}`}
                        >
                          <WorkspaceAnchor color={c.color} glow={c.glow} shape={c.shape} />
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <WorkspaceAnchor
                        color={draftColor.color}
                        glow={draftColor.glow}
                        shape={draftColor.shape}
                      />
                      <input
                        ref={inputRef}
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveCreate();
                          if (e.key === 'Escape') cancelCreate();
                        }}
                        placeholder="Workspace name"
                        className="min-w-0 flex-1 bg-transparent text-xs font-medium text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={saveCreate}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        aria-label="Save workspace"
                      >
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={cancelCreate}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
                        aria-label="Cancel"
                      >
                        <X className="h-3 w-3" strokeWidth={2.25} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="cta"
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={startCreate}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-zinc-400 transition-all duration-150 ease-in-out hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-200"
                >
                  <Plus className="h-3 w-3" strokeWidth={2} />
                  New Workspace
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
