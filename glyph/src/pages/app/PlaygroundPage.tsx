import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  FlaskConical,
  MessageSquarePlus,
  Microscope,
  Share2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ChatComposer,
  type ChatSendPayload,
} from '@/components/app/ChatComposer';
import { ConversationSidebar } from '@/components/app/ConversationSidebar';
import { SourcePreviewModal } from '@/components/app/SourcePreviewModal';
import {
  downloadText,
  exportConversationMarkdown,
  KNOWLEDGE_BASES,
  type ConversationMessage,
  type KnowledgeBaseId,
} from '@/lib/conversations';
import { matchResponse } from '@/lib/data';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  getWorkspace,
  WORKSPACES,
  WorkspaceAnchor,
  workspaceDocCount,
  type Workspace,
} from '@/lib/workspaces';

const suggestions = [
  'What protocol should I use for RNA extraction?',
  'How do we prepare Sample A?',
  'Walk me through the CRISPR transfection protocol',
  'Key points from the mRNA Nature review?',
];

const KB_META: Record<
  KnowledgeBaseId,
  { icon: LucideIcon; hint: string }
> = {
  Oncology: { icon: Microscope, hint: 'Cancer research' },
  PCR: { icon: FlaskConical, hint: 'Amplification' },
  'Cell Culture': { icon: FlaskConical, hint: 'Lab protocols' },
  Publications: { icon: BookOpen, hint: 'Papers & reviews' },
};

export function PlaygroundPage() {
  const {
    files,
    conversations,
    activeConversationId,
    activeProjectId,
    setActiveProjectId,
    createConversation,
    setActiveConversation,
    updateConversation,
    appendMessage,
    patchMessage,
    replaceMessages,
  } = useApp();

  const activeProject = useMemo(
    () => getWorkspace(activeProjectId),
    [activeProjectId],
  );

  const active = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  );

  const [streaming, setStreaming] = useState(false);
  const [preview, setPreview] = useState<{ title: string; page?: string } | null>(
    null,
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef(files);
  filesRef.current = files;

  useEffect(() => {
    if (!conversations.length) return;
    if (
      !activeConversationId ||
      !conversations.some((c) => c.id === activeConversationId)
    ) {
      setActiveConversation(conversations[0].id);
    }
  }, [conversations, activeConversationId, setActiveConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages, streaming, activeConversationId]);

  const streamAssistant = async (
    conversationId: string,
    full: string,
    extras?: Partial<ConversationMessage>,
  ) => {
    const id = `a-${Date.now()}`;
    appendMessage(conversationId, {
      id,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      ...extras,
    });

    let i = 0;
    await new Promise<void>((resolve) => {
      const tick = () => {
        i += Math.max(1, Math.floor(full.length / 55));
        const slice = full.slice(0, i);
        patchMessage(conversationId, id, { content: slice });
        if (i >= full.length) {
          resolve();
          return;
        }
        window.setTimeout(tick, 16);
      };
      tick();
    });
  };

  const hasInKnowledge = (file?: { id: string; name: string }) => {
    if (!file) return false;
    return filesRef.current.some(
      (f) => f.id === file.id || f.name.toLowerCase() === file.name.toLowerCase(),
    );
  };

  const send = async ({ text, file }: ChatSendPayload) => {
    if (streaming) return;
    if (!text.trim() && !file) return;

    let conversationId = activeConversationId;
    if (!conversationId || !active) {
      conversationId = createConversation('Cell Culture');
    }

    setStreaming(true);

    const userMsg: ConversationMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim() || (file ? `Attached ${file.name}` : ''),
      attachment: file?.name,
      attachmentId: file?.id,
      createdAt: new Date().toISOString(),
    };
    appendMessage(conversationId, userMsg);

    if (file && !text.trim()) {
      await new Promise((r) => setTimeout(r, 1000));
      if (!hasInKnowledge(file)) {
        await streamAssistant(
          conversationId,
          `“${file.name}” is no longer in the Knowledge Base — I can’t answer from it. Upload the file again via the paperclip.`,
        );
      } else {
        await streamAssistant(
          conversationId,
          `I’ve reviewed “${file.name}”. Ask me anything about it!`,
          {
            sources: [{ title: file.name, type: 'PDF', page: '1' }],
            confidence: 97,
          },
        );
      }
      setStreaming(false);
      return;
    }

    const q = text.toLowerCase();
    const mentionsChatDoc =
      q.includes('company_policy') ||
      q.includes('this document') ||
      q.includes('this file') ||
      q.includes('the document') ||
      q.includes('policy');

    if (mentionsChatDoc) {
      const chatDoc = filesRef.current.find(
        (f) =>
          f.source === 'chat' ||
          f.name.toLowerCase() === 'company_policy.pdf',
      );
      if (!chatDoc) {
        await streamAssistant(
          conversationId,
          'I no longer have access to that document — it was removed from the Knowledge Base. Upload it again in chat so I can answer from it.',
        );
        setStreaming(false);
        return;
      }
      await streamAssistant(
        conversationId,
        `Based on “${chatDoc.name}”: the key rules are in the company policy sections. Tell me which part you need — access, data retention, or approval workflows.`,
        {
          sources: [{ title: chatDoc.name, type: 'PDF', page: '1' }],
          confidence: 94,
        },
      );
      setStreaming(false);
      return;
    }

    const res = matchResponse(text);
    await streamAssistant(conversationId, res.answer, {
      sources: res.sources,
      confidence: res.confidence,
    });
    setStreaming(false);
  };

  const copyConversation = async () => {
    if (!active) return;
    const text = exportConversationMarkdown(active);
    await navigator.clipboard.writeText(text);
    toast.success('Conversation copied');
  };

  const exportMd = () => {
    if (!active) return;
    downloadText(
      `${active.title.replace(/\s+/g, '_')}.md`,
      exportConversationMarkdown(active),
      'text/markdown;charset=utf-8',
    );
    toast.success('Exported as Markdown');
  };

  const exportPdf = () => {
    if (!active) return;
    // Lightweight printable export (browser print → PDF)
    const w = window.open('', '_blank');
    if (!w) {
      toast.message('Allow pop-ups to export PDF');
      return;
    }
    w.document.write(
      `<html><head><title>${active.title}</title></head><body style="font-family:system-ui;padding:32px;max-width:720px;margin:auto">` +
        `<h1>${active.title}</h1><p>Knowledge Base: ${active.knowledgeBase}</p>` +
        active.messages
          .map(
            (m) =>
              `<h3>${m.role === 'user' ? 'You' : 'LabAgent'}</h3><p>${m.content.replace(/\n/g, '<br/>')}</p>`,
          )
          .join('') +
        `</body></html>`,
    );
    w.document.close();
    w.focus();
    w.print();
    toast.success('Print dialog opened for PDF export');
  };

  const shareConversation = async () => {
    if (!active) return;
    const url = `${window.location.origin}/app/playground?c=${active.id}`;
    await navigator.clipboard.writeText(url);
    toast.success('Share link copied');
  };

  const empty = conversations.filter((c) => !c.archived).length === 0;

  return (
    <>
      <div className="flex h-full min-h-0 overflow-hidden rounded-[2rem]">
        <ConversationSidebar />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-r-[2rem] bg-white dark:bg-surface">
          {empty || !active ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
                <MessageSquarePlus className="h-7 w-7" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight text-black">
                Start your first research conversation
              </h2>
              <p className="mt-2 max-w-md text-sm text-zinc-500">
                Ask about protocols, SOPs, and publications. Every answer stays cited and tied to
                your knowledge base. Use <span className="font-medium text-zinc-700">New chat</span> in
                the sidebar to begin.
              </p>
            </div>
          ) : (
            <>
              <header className="flex shrink-0 items-center justify-between gap-3 border-b border-black/[0.06] px-5 pb-3 pt-5">
                <div className="min-w-0 overflow-visible">
                  <ProjectSelect
                    value={activeProject}
                    onChange={(project) => {
                      if (project.id === activeProjectId) return;
                      setActiveProjectId(project.id);
                      const docs = workspaceDocCount(project);
                      const id = createConversation(undefined, project.id);
                      const now = new Date().toISOString();
                      replaceMessages(id, [
                        {
                          id: `switch-${Date.now()}`,
                          role: 'assistant',
                          content: `Switched to ${project.name} workspace. The AI is now answering questions based on ${docs} document${docs === 1 ? '' : 's'} uploaded in this project.`,
                          createdAt: now,
                        },
                      ]);
                      updateConversation(id, {
                        title: project.name,
                        workspaceId: project.id,
                        updatedAt: now,
                      });
                    }}
                  />
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <p className="text-[11px] text-zinc-400">
                      Continue anytime · {active.messages.length} messages
                    </p>
                    <KbSelect
                      value={active.knowledgeBase}
                      onChange={(kb) =>
                        updateConversation(active.id, { knowledgeBase: kb })
                      }
                    />
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <IconBtn label="Copy" onClick={copyConversation}>
                    <Copy className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn label="Export Markdown" onClick={exportMd}>
                    <Download className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn label="Export PDF" onClick={exportPdf}>
                    <FileText className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn label="Share" onClick={shareConversation}>
                    <Share2 className="h-3.5 w-3.5" />
                  </IconBtn>
                </div>
              </header>

              <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-5 py-5">
                <AnimatePresence initial={false}>
                  {active.messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'flex',
                        m.role === 'user' ? 'justify-end' : 'justify-start',
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                          m.role === 'user'
                            ? 'bg-black text-white'
                            : 'border border-black/[0.08] bg-zinc-50 text-zinc-800',
                        )}
                      >
                        {m.role === 'assistant' ? (
                          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-accent">
                            <Sparkles className="h-3 w-3" /> LabAgent
                          </div>
                        ) : null}

                        {m.attachment ? (
                          <div
                            className={cn(
                              'mb-2.5 flex items-center gap-2 rounded-xl border px-2.5 py-2',
                              m.role === 'user'
                                ? 'border-white/15 bg-white/10'
                                : 'border-black/[0.06] bg-white',
                            )}
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span className="truncate text-[12px] font-medium">
                              {m.attachment}
                            </span>
                          </div>
                        ) : null}

                        {m.content &&
                        !(
                          m.attachment && m.content === `Attached ${m.attachment}`
                        ) ? (
                          <div className="whitespace-pre-wrap">
                            {m.content}
                            {streaming &&
                            m.role === 'assistant' &&
                            m === active.messages[active.messages.length - 1] ? (
                              <span className="caret" />
                            ) : null}
                          </div>
                        ) : null}

                        {m.sources?.length && m.content.length > 12 ? (
                          <div className="mt-3 flex flex-wrap gap-2 border-t border-black/[0.08] pt-3">
                            {m.sources.map((s) => (
                              <button
                                key={`${s.title}-${s.page ?? ''}`}
                                type="button"
                                onClick={() =>
                                  setPreview({ title: s.title, page: s.page })
                                }
                                className="inline-flex h-6 items-center justify-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-2.5 text-[10px] leading-none text-zinc-500 transition-all duration-300 hover:border-accent/30 hover:text-accent"
                              >
                                <FileText className="h-3 w-3 text-accent" />
                                {s.title}
                                {s.page ? ` · p. ${s.page}` : ''}
                              </button>
                            ))}
                            {m.confidence ? (
                              <span className="inline-flex h-6 items-center justify-center rounded-full border border-accent/20 bg-accent/5 px-2.5 text-[10px] leading-none text-accent">
                                {m.confidence}% confidence
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              {active.messages.length < 3 ? (
                <div className="flex flex-wrap gap-2 px-5 pb-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send({ text: s })}
                      disabled={streaming}
                      className="rounded-full border border-black/[0.08] px-3 py-1.5 text-xs text-zinc-400 transition-all duration-300 hover:border-accent/30 hover:text-accent disabled:opacity-40"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="px-5 pb-5">
                <ChatComposer disabled={streaming} onSend={send} />
              </div>
            </>
          )}
        </div>
      </div>

      <SourcePreviewModal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.title ?? ''}
        page={preview?.page}
      />
    </>
  );
}

function ProjectSelect({
  value,
  onChange,
}: {
  value: Workspace;
  onChange: (project: Workspace) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="group inline-flex max-w-full items-center gap-2 rounded-xl py-0.5 pr-1.5 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <WorkspaceAnchor
          color={value.color}
          glow={value.glow}
          shape={value.shape}
          size="md"
        />
        <span className="truncate font-display text-lg font-semibold leading-snug tracking-tight text-black dark:text-white">
          {value.name}
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
          strokeWidth={2.25}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-[calc(100%+0.45rem)] z-50 w-[280px] overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#1a1a1d] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
            role="listbox"
          >
            <p className="px-2.5 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Projects
            </p>
            {WORKSPACES.map((ws) => {
              const selected = ws.id === value.id;
              return (
                <button
                  key={ws.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(ws);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors duration-150',
                    selected
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
                  )}
                >
                  <WorkspaceAnchor
                    color={ws.color}
                    glow={ws.glow}
                    shape={ws.shape}
                    size="md"
                  />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                    {ws.name}
                  </span>
                  <span className="font-mono text-[10px] tabular-nums text-zinc-400">
                    {ws.count}
                  </span>
                  {selected ? (
                    <Check
                      className="h-3.5 w-3.5 shrink-0 text-accent"
                      strokeWidth={2.5}
                    />
                  ) : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function KbSelect({
  value,
  onChange,
}: {
  value: KnowledgeBaseId;
  onChange: (kb: KnowledgeBaseId) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-5 items-center gap-1 rounded-full bg-zinc-100/90 pl-2 pr-1.5 text-[9px] font-medium leading-none text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:bg-white/[0.1] dark:hover:text-zinc-200"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {value}
        <ChevronDown
          className={cn('h-2.5 w-2.5 transition-transform', open && 'rotate-180')}
          strokeWidth={2.5}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 top-[calc(100%+0.4rem)] z-50 w-[220px] overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#1a1a1d] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
            role="listbox"
          >
            <p className="px-2.5 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Knowledge
            </p>
            {KNOWLEDGE_BASES.map((kb) => {
              const selected = kb === value;
              const { icon: Icon, hint } = KB_META[kb];
              return (
                <button
                  key={kb}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(kb);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors',
                    selected
                      ? 'bg-accent/[0.08] text-black'
                      : 'text-zinc-700 hover:bg-black/[0.03] dark:text-zinc-300 dark:hover:bg-white/[0.04]',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                      selected
                        ? 'bg-accent text-white'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">{kb}</span>
                    <span className="block truncate text-[11px] text-zinc-400">{hint}</span>
                  </span>
                  {selected ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} />
                  ) : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded-lg p-2 text-zinc-400 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-700"
    >
      {children}
    </button>
  );
}
