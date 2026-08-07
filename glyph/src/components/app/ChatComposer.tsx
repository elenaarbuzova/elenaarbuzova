import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  CloudUpload,
  FileText,
  Paperclip,
  Send,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { PLANS } from '@/lib/data';
import { useApp } from '@/lib/store';
import { knowledgeFileFromUpload } from '@/lib/upload';
import { createSampleProtocolFile } from '@/lib/sampleUpload';
import { getWorkspace } from '@/lib/workspaces';
import { cn } from '@/lib/utils';

export type PendingAttachment = {
  id: string;
  name: string;
  status: 'uploading' | 'ready';
  progress: number;
};

export type ChatSendPayload = {
  text: string;
  file?: { id: string; name: string };
};

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  disabled?: boolean;
  onSend: (payload: ChatSendPayload) => void;
};

export function ChatComposer({ disabled, onSend }: Props) {
  const {
    files,
    addFiles,
    updateFile,
    canAddDocument,
    openPaywall,
    activeProjectId,
  } = useApp();
  const activeProject = getWorkspace(activeProjectId);
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSuccess, setMenuSuccess] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<PendingAttachment | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const progressRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuCloseTimer = useRef<number | null>(null);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
        setMenuSuccess(null);
      }
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, []);

  useEffect(() => {
    return () => {
      if (progressRef.current) window.clearInterval(progressRef.current);
      if (menuCloseTimer.current) window.clearTimeout(menuCloseTimer.current);
    };
  }, []);

  /** If the pending file was removed from Knowledge Base, drop it from chat context */
  useEffect(() => {
    setAttachment((prev) => {
      if (!prev || prev.status !== 'ready') return prev;
      if (files.some((f) => f.id === prev.id)) return prev;
      toast.message('File removed from Knowledge Base and is no longer available in chat');
      return null;
    });
  }, [files]);

  const clearAttachment = () => {
    if (progressRef.current) window.clearInterval(progressRef.current);
    progressRef.current = null;
    setAttachment(null);
  };

  const finishMenuSuccess = (name: string) => {
    setMenuSuccess(name);
    if (menuCloseTimer.current) window.clearTimeout(menuCloseTimer.current);
    menuCloseTimer.current = window.setTimeout(() => {
      setMenuOpen(false);
      setMenuSuccess(null);
      menuCloseTimer.current = null;
    }, 1100);
  };

  const startSampleUpload = () => {
    if (!canAddDocument()) {
      setMenuOpen(false);
      openPaywall(
        `Starter is limited to ${PLANS.starter.limits.documents} documents. Research removes the limit.`,
      );
      return;
    }

    const doc = createSampleProtocolFile({
      project: activeProject.name,
      source: 'chat',
      folder: 'Chat uploads',
    });
    doc.tags = ['Chat', 'Uploaded'];

    setAttachment({ id: doc.id, name: doc.name, status: 'uploading', progress: 0 });
    addFiles([doc]);
    toast.success('File uploaded successfully');
    finishMenuSuccess(doc.name);

    const started = performance.now();
    const duration = 900;
    if (progressRef.current) window.clearInterval(progressRef.current);

    progressRef.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - started) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const progress = Math.round(eased * 100);
      setAttachment((prev) =>
        prev && prev.id === doc.id ? { ...prev, progress } : prev,
      );
      if (t >= 1) {
        if (progressRef.current) window.clearInterval(progressRef.current);
        progressRef.current = null;
        setAttachment((prev) =>
          prev && prev.id === doc.id
            ? { ...prev, progress: 100, status: 'ready' }
            : prev,
        );
        updateFile(doc.id, { status: 'ready', activeInChatbot: true });
      }
    }, 16);
  };

  const startUpload = async (file: File) => {
    if (!canAddDocument()) {
      setMenuOpen(false);
      openPaywall(
        `Starter is limited to ${PLANS.starter.limits.documents} documents. Research removes the limit.`,
      );
      return;
    }

    const doc = await knowledgeFileFromUpload(file, {
      project: activeProject.name,
      source: 'chat',
      folder: 'Chat uploads',
    });
    doc.tags = ['Chat', 'Uploaded'];
    doc.activeInChatbot = true;

    setAttachment({ id: doc.id, name: doc.name, status: 'uploading', progress: 0 });
    addFiles([doc]);
    toast.success('File uploaded successfully');
    finishMenuSuccess(doc.name);

    const started = performance.now();
    const duration = 900;
    if (progressRef.current) window.clearInterval(progressRef.current);

    progressRef.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - started) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const progress = Math.round(eased * 100);
      setAttachment((prev) =>
        prev && prev.id === doc.id ? { ...prev, progress } : prev,
      );
      if (t >= 1) {
        if (progressRef.current) window.clearInterval(progressRef.current);
        progressRef.current = null;
        setAttachment((prev) =>
          prev && prev.id === doc.id
            ? { ...prev, progress: 100, status: 'ready' }
            : prev,
        );
        updateFile(doc.id, { status: 'ready', activeInChatbot: true });
      }
    }, 16);
  };

  const pickFile = () => {
    startSampleUpload();
  };

  const canSend =
    !disabled &&
    (input.trim().length > 0 || attachment?.status === 'ready') &&
    attachment?.status !== 'uploading';

  const submit = () => {
    if (!canSend) return;
    const text = input.trim();
    const file =
      attachment?.status === 'ready'
        ? { id: attachment.id, name: attachment.name }
        : undefined;
    setInput('');
    clearAttachment();
    onSend({ text, file });
    textareaRef.current?.focus();
  };

  return (
    <div ref={rootRef} className="relative mt-6">
      <AnimatePresence>
        {attachment ? (
          <motion.div
            key={attachment.id}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="mb-3"
          >
            <div
              className={cn(
                'relative overflow-hidden rounded-xl border bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 ease-in-out',
                attachment.status === 'ready'
                  ? 'border-emerald-500/40 bg-emerald-50/40'
                  : 'border-black/[0.08]',
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[13px] font-medium text-zinc-800">
                      {attachment.name}
                    </p>
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-zinc-500">
                      PDF
                    </span>
                    {attachment.status === 'ready' ? (
                      <motion.span
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white"
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </motion.span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[11px] text-zinc-400">
                    {attachment.status === 'uploading'
                      ? `Uploading… ${attachment.progress}%`
                      : 'File uploaded successfully · Ready to send'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearAttachment}
                  className="rounded-lg p-1.5 text-zinc-400 transition-all duration-300 ease-in-out hover:bg-black/[0.04] hover:text-zinc-700"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <AnimatePresence>
                {attachment.status === 'uploading' ? (
                  <motion.div
                    key="bar"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="mt-2.5 h-1 overflow-hidden rounded-full bg-zinc-100"
                  >
                    <motion.div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${attachment.progress}%` }}
                      transition={{ duration: 0.1, ease: 'linear' }}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="upload-menu"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute bottom-[calc(100%+0.65rem)] left-0 z-20 w-[min(100%,320px)] origin-bottom-left"
          >
            <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
              <button
                type="button"
                onClick={pickFile}
                disabled={!!menuSuccess}
                onDragEnter={(e) => {
                  e.preventDefault();
                  if (!menuSuccess) setDragOver(true);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (menuSuccess) return;
                  const f = e.dataTransfer.files?.[0];
                  if (f) void startUpload(f);
                }}
                className={cn(
                  'flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-7 text-center transition-all duration-300 ease-in-out',
                  menuSuccess
                    ? 'border-emerald-500/40 bg-emerald-50'
                    : dragOver
                      ? 'border-blue-400 bg-blue-50/60'
                      : 'border-black/15 bg-zinc-50/80 hover:border-black/25 hover:bg-zinc-50',
                )}
              >
                {menuSuccess ? (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                    <p className="mt-2.5 text-[12px] font-medium text-emerald-700">
                      File uploaded successfully
                    </p>
                    <p className="mt-1 truncate px-2 text-[10px] text-emerald-600/80">
                      {menuSuccess}
                    </p>
                  </>
                ) : (
                  <>
                    <CloudUpload
                      className={cn(
                        'h-6 w-6 transition-colors duration-300',
                        dragOver ? 'text-blue-500' : 'text-zinc-400',
                      )}
                    />
                    <p className="mt-2.5 text-[12px] font-medium text-zinc-700">
                      Drop a file here or click to upload
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-400">
                      PDF, DOCX, TXT, MD, CSV — indexed into Knowledge
                    </p>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md,.csv,application/pdf,text/plain,text/markdown,text/csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void startUpload(f);
          e.target.value = '';
        }}
      />

      <div className="flex items-end gap-2 rounded-2xl border border-black/[0.08] bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 ease-in-out focus-within:border-black/15 focus-within:shadow-[0_10px_36px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={() =>
            setMenuOpen((v) => {
              if (v) setMenuSuccess(null);
              return !v;
            })
          }
          disabled={disabled || attachment?.status === 'uploading'}
          className={cn(
            'mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition-all duration-300 ease-in-out hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-40',
            menuOpen && 'bg-zinc-100 text-zinc-800',
          )}
          aria-label="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Ask about a protocol or SOP…"
          disabled={disabled}
          className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent py-2.5 text-sm text-black outline-none placeholder:text-zinc-400 disabled:opacity-50"
        />

        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          className={cn(
            'mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-in-out',
            canSend
              ? 'bg-black text-white hover:bg-zinc-800 active:scale-[0.98]'
              : 'bg-zinc-100 text-zinc-300',
          )}
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
