import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  FileText,
  Filter,
  Lock,
  MessageSquare,
  Search,
  Trash2,
  Upload,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { useApp } from '@/lib/store';
import { PROJECT_COLORS, type KnowledgeFile } from '@/lib/data';
import { getWorkspace } from '@/lib/workspaces';
import { cn } from '@/lib/utils';

const typeMeta: Record<string, { label: string; className: string }> = {
  pdf: { label: 'PDF', className: 'bg-red-50 text-red-600' },
  protocol: { label: 'PDF', className: 'bg-red-50 text-red-600' },
  paper: { label: 'PDF', className: 'bg-red-50 text-red-600' },
  docx: { label: 'DOCX', className: 'bg-blue-50 text-blue-600' },
  md: { label: 'MD', className: 'bg-emerald-50 text-emerald-600' },
  csv: { label: 'CSV', className: 'bg-amber-50 text-amber-700' },
  txt: { label: 'TXT', className: 'bg-zinc-100 text-zinc-600' },
};

type SortKey = 'name' | 'project' | 'status' | 'addedAt' | 'sizeBytes';
type SortDir = 'asc' | 'desc';

const STATUS_ORDER: Record<KnowledgeFile['status'], number> = {
  processing: 0,
  error: 1,
  ready: 2,
};

function projectClass(project?: string) {
  if (!project) return 'bg-zinc-100 text-zinc-600 ring-zinc-200';
  return PROJECT_COLORS[project] ?? 'bg-zinc-100 text-zinc-600 ring-zinc-200';
}

function SortHeader({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
  className,
}: {
  label: string;
  column: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === column;
  return (
    <th className={cn('px-5 py-3.5 font-medium', className)}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          'inline-flex items-center gap-1.5 uppercase tracking-wider transition-colors',
          active ? 'text-zinc-800' : 'text-zinc-500 hover:text-zinc-700',
        )}
      >
        {label}
        {active ? (
          sortDir === 'asc' ? (
            <ArrowUp className="h-3 w-3 opacity-70" strokeWidth={2.25} />
          ) : (
            <ArrowDown className="h-3 w-3 opacity-70" strokeWidth={2.25} />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-35" strokeWidth={2} />
        )}
      </button>
    </th>
  );
}

export function KnowledgePage() {
  const {
    files,
    addFiles,
    updateFile,
    removeFile,
    canAddDocument,
    openPaywall,
    activeProjectId,
  } = useApp();
  const activeProject = useMemo(
    () => getWorkspace(activeProjectId),
    [activeProjectId],
  );
  const [q, setQ] = useState('');
  const [folder, setFolder] = useState('All');
  const [dragging, setDragging] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('addedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const folders = useMemo(() => {
    const set = new Set(files.map((f) => f.folder).filter(Boolean) as string[]);
    return ['All', ...Array.from(set)];
  }, [files]);

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' || key === 'project' ? 'asc' : 'desc');
    }
  };

  const filtered = useMemo(() => {
    const list = files.filter((f) => {
      const matchQ =
        !q ||
        f.name.toLowerCase().includes(q.toLowerCase()) ||
        f.project?.toLowerCase().includes(q.toLowerCase()) ||
        f.tags?.some((t) => t.toLowerCase().includes(q.toLowerCase())) ||
        (f.source === 'chat' && 'uploaded from chat'.includes(q.toLowerCase()));
      const matchF = folder === 'All' || f.folder === folder;
      return matchQ && matchF;
    });

    const dir = sortDir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortKey === 'project')
        return (a.project ?? '').localeCompare(b.project ?? '') * dir;
      if (sortKey === 'status')
        return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * dir;
      if (sortKey === 'sizeBytes')
        return ((a.sizeBytes ?? 0) - (b.sizeBytes ?? 0)) * dir;
      return ((a.addedAt ?? 0) - (b.addedAt ?? 0)) * dir;
    });
  }, [files, q, folder, sortKey, sortDir]);

  const uploadDemo = () => {
    if (!canAddDocument()) {
      openPaywall(
        'Starter is limited to 20 documents. Upgrade for unlimited knowledge.',
      );
      return;
    }
    const file: KnowledgeFile = {
      id: `f-${Date.now()}`,
      name: `Protocol_Upload_${files.length + 1}.pdf`,
      type: 'protocol',
      status: 'processing',
      size: '1.2 MB',
      sizeBytes: 1_200_000,
      uploadedAt: 'Just now',
      addedAt: Date.now(),
      folder: 'Protocols',
      project: activeProject.name,
      tags: ['New'],
      source: 'upload',
      activeInChatbot: false,
    };
    addFiles([file]);
    window.setTimeout(() => {
      updateFile(file.id, { status: 'ready', activeInChatbot: true });
    }, 2200);
  };

  const onRemove = (f: KnowledgeFile) => {
    removeFile(f.id);
    toast.message(
      f.source === 'chat'
        ? `${f.name} removed — chat can no longer use this document`
        : `${f.name} removed`,
    );
  };

  const onRowClick = (f: KnowledgeFile) => {
    if (f.status === 'error') {
      openPaywall(
        f.statusDetail === 'Limit Exceeded'
          ? 'Document limit exceeded. Upgrade to index more sources into your knowledge base.'
          : 'This document failed to index. Upgrade for higher limits and priority processing.',
      );
    }
  };

  return (
      <div className="space-y-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Knowledge
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Protocols, SOPs, publications, and data — indexed with structure intact.
            </p>
          </div>
          <Button
            variant="accent"
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={uploadDemo}
          >
            Upload
          </Button>
        </div>

        <button
          type="button"
          onClick={uploadDemo}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            uploadDemo();
          }}
          className={cn(
            'flex w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 transition-all duration-300 ease-in-out',
            dragging
              ? 'border-accent bg-accent/[0.06]'
              : 'border-black/10 bg-zinc-50 hover:border-accent/30',
          )}
        >
          <Upload className="h-6 w-6 text-accent" />
          <p className="mt-3 text-sm font-medium">
            Drop PDF, DOCX, TXT, Markdown, CSV, protocols
          </p>
          <p className="mt-1 text-xs text-zinc-500">Click or drop to simulate upload</p>
        </button>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              className="pl-10"
              placeholder="Search documents, projects, tags…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            {folders.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFolder(f)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs transition-all duration-300 ease-in-out',
                  folder === f
                    ? 'bg-black text-white'
                    : 'border border-black/[0.08] text-zinc-400 hover:text-black',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.06] px-8 py-20 text-center">
            <FileText className="mx-auto h-8 w-8 text-zinc-600" />
            <p className="mt-4 text-sm text-zinc-400">No documents yet</p>
            <p className="mt-1 text-xs text-zinc-600">
              Upload your first protocol to build institutional memory.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-hidden rounded-2xl border border-black/[0.06]">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/[0.06] bg-zinc-50/80 text-xs">
                  <SortHeader
                    label="Document"
                    column="name"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={onSort}
                  />
                  <SortHeader
                    label="Project"
                    column="project"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={onSort}
                    className="hidden md:table-cell"
                  />
                  <SortHeader
                    label="Status"
                    column="status"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={onSort}
                    className="hidden sm:table-cell"
                  />
                  <SortHeader
                    label="Added"
                    column="addedAt"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={onSort}
                    className="hidden lg:table-cell"
                  />
                  <SortHeader
                    label="Size"
                    column="sizeBytes"
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={onSort}
                    className="hidden lg:table-cell"
                  />
                  <th className="px-5 py-3.5 text-center font-medium uppercase tracking-wider text-zinc-500">
                    Active in Chatbot
                  </th>
                  <th className="px-5 py-3.5 font-medium" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {filtered.map((f) => {
                    const meta = typeMeta[f.type] ?? typeMeta.txt;
                    const failed = f.status === 'error';
                    return (
                      <motion.tr
                        key={f.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => onRowClick(f)}
                        className={cn(
                          'group border-b border-black/[0.06] transition-all duration-300 ease-in-out dark:border-white/10',
                          failed
                            ? 'cursor-pointer bg-red-50/40 hover:bg-red-50/70 dark:bg-red-500/10 dark:hover:bg-red-500/15'
                            : 'hover:bg-zinc-50 dark:hover:bg-white/[0.06]',
                        )}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold tracking-wide transition-transform duration-300 group-hover:scale-105',
                                meta.className,
                              )}
                            >
                              {meta.label}
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate font-medium text-zinc-800 dark:text-zinc-100">
                                  {f.name}
                                </p>
                                {f.project ? (
                                  <span
                                    className={cn(
                                      'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset md:hidden',
                                      projectClass(f.project),
                                    )}
                                  >
                                    {f.project}
                                  </span>
                                ) : null}
                              </div>
                              {f.source === 'chat' ? (
                                <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                  <MessageSquare className="h-2.5 w-2.5" />
                                  Uploaded from chat
                                </span>
                              ) : f.tags?.length ? (
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                  {f.tags.map((t) => (
                                    <span
                                      key={t}
                                      className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-5 py-4 md:table-cell">
                          {f.project ? (
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset',
                                projectClass(f.project),
                              )}
                            >
                              {f.project}
                            </span>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>
                        <td className="hidden px-5 py-4 sm:table-cell">
                          {f.status === 'ready' ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                            </span>
                          ) : f.status === 'processing' ? (
                            <span className="inline-flex items-center gap-1.5 text-accent">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Processing…
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-red-600/80">
                              <Lock className="h-3.5 w-3.5 text-amber-500" />
                              Failed
                              {f.statusDetail ? (
                                <span className="text-red-500/70">
                                  ({f.statusDetail})
                                </span>
                              ) : null}
                            </span>
                          )}
                        </td>
                        <td className="hidden px-5 py-4 text-zinc-500 lg:table-cell">
                          {f.uploadedAt}
                        </td>
                        <td className="hidden px-5 py-4 text-zinc-500 lg:table-cell">
                          {f.size}
                        </td>
                        <td
                          className="px-5 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-center">
                            <Toggle
                              checked={!!f.activeInChatbot && f.status === 'ready'}
                              disabled={f.status !== 'ready'}
                              label={`Active in chatbot: ${f.name}`}
                              onCheckedChange={(next) => {
                                updateFile(f.id, { activeInChatbot: next });
                                toast.message(
                                  next
                                    ? `${f.name} is now used by the chatbot`
                                    : `${f.name} paused for chatbot answers`,
                                  { duration: 1200 },
                                );
                              }}
                            />
                          </div>
                        </td>
                        <td
                          className="px-5 py-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => onRemove(f)}
                            className="rounded-lg p-2 text-zinc-400 opacity-70 transition-all duration-300 ease-in-out hover:bg-red-50 hover:text-danger group-hover:opacity-100"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
  );
}
