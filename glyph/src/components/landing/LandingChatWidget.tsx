import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { FileText, MessageCircle, Send, X } from 'lucide-react';
import { LogoMark } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

type Source = { title: string; page: string };

type Msg =
  | { id: string; role: 'bot'; text: string; source?: Source }
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'cta' };

const GREETING =
  'Hello. Ask about your protocols, SOPs, publications, or laboratory documentation.';

const SUGGESTIONS = [
  'How should CRISPR samples be stored?',
  'Find SOP-014',
  'Summarize this publication',
  'Where is the PCR preparation protocol?',
];

const DEMO_REPLIES: { text: string; source: Source }[] = [
  {
    text: 'Storage temperature: −80°C. Aliquot before first thaw to avoid freeze–thaw cycles.',
    source: { title: 'SOP-014.pdf', page: '6' },
  },
  {
    text: 'SOP-014 covers CRISPR sample handling, storage, and chain-of-custody logging.',
    source: { title: 'SOP-014.pdf', page: '1' },
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function TypingDots() {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-zinc-100 px-3.5 py-3"
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-zinc-400"
          animate={{ y: [0, -3, 0], opacity: [0.35, 1, 0.35] }}
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

export function LandingChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  /** Visible only after scrolling past the hero */
  const [pastHero, setPastHero] = useState(false);
  const greeted = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const replyIdx = useRef(0);

  const canSend = input.trim().length > 0 && !busy;
  const isEmpty = messages.length === 0;

  useEffect(() => {
    const update = () => {
      // Show after the first viewport (hero)
      setPastHero(window.scrollY > window.innerHeight * 0.85);
      if (window.scrollY <= window.innerHeight * 0.85) setOpen(false);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 280);
    timers.current.push(t);

    if (!greeted.current) {
      greeted.current = true;
      const greet = window.setTimeout(() => {
        setMessages([
          { id: `bot-${Date.now()}`, role: 'bot', text: GREETING },
        ]);
      }, 320);
      timers.current.push(greet);
    }
  }, [open]);

  const insertSuggestion = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const send = () => {
    const text = input.trim();
    if (!text || busy) return;

    const userId = `user-${Date.now()}`;
    setMessages((m) => [...m, { id: userId, role: 'user', text }]);
    setInput('');
    setBusy(true);
    setTyping(true);

    const reply = DEMO_REPLIES[replyIdx.current % DEMO_REPLIES.length];
    replyIdx.current += 1;

    const replyTimer = window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: reply.text,
          source: reply.source,
        },
        { id: `cta-${Date.now()}`, role: 'cta' },
      ]);
      setBusy(false);
    }, 1200);
    timers.current.push(replyTimer);
  };

  const showWelcomeChips =
    messages.length === 1 &&
    messages[0]?.role === 'bot' &&
    !busy &&
    !typing;

  return (
    <div
      className={cn(
        'pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 transition-all duration-300 md:bottom-7 md:right-7',
        pastHero
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      )}
      aria-hidden={!pastHero}
    >
      {pastHero && open ? (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="LabAgent research assistant"
            className="pointer-events-auto flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.16)]"
            style={{ height: 'min(560px, calc(100svh - 7rem))' }}
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.32, ease }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] bg-white px-4 py-3.5">
              <div className="flex items-center gap-3">
                <LogoMark size={36} withTile />
                <div>
                  <p className="text-sm font-semibold tracking-tight text-black">
                    LabAgent
                    <span className="text-accent">.ai</span>
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Research Assistant
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-all duration-200 hover:bg-zinc-100 hover:text-black active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto bg-zinc-50/80 px-4 py-4"
            >
              <div
                className={cn(
                  'flex flex-col gap-3',
                  (isEmpty || showWelcomeChips) && 'my-auto',
                )}
              >
                {messages.map((msg) =>
                  msg.role === 'cta' ? (
                    <div key={msg.id} className="pt-1">
                      <Link
                        href="/signup"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-[#ff4d2e] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,77,46,0.22)] transition-all duration-300 hover:scale-[1.01] hover:bg-[#ff3b18] hover:shadow-[0_10px_28px_rgba(255,77,46,0.3)] active:scale-[0.99]"
                      >
                        Create a workspace
                      </Link>
                    </div>
                  ) : (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex',
                        msg.role === 'user' ? 'justify-end' : 'justify-start',
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed',
                          msg.role === 'user'
                            ? 'rounded-2xl rounded-br-md bg-black text-white'
                            : 'rounded-2xl rounded-bl-md bg-white text-zinc-700 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04]',
                        )}
                      >
                        {msg.text}
                        {msg.role === 'bot' && msg.source ? (
                          <div className="mt-2.5 rounded-lg border border-black/[0.06] bg-zinc-50/90 px-2.5 py-2">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                              Source
                            </p>
                            <div className="mt-1 flex items-start gap-2">
                              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                              <div className="min-w-0">
                                <p className="truncate text-[12px] font-medium text-zinc-700">
                                  {msg.source.title}
                                </p>
                                <p className="mt-0.5 text-[11px] text-zinc-400">
                                  Page {msg.source.page}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ),
                )}

                {showWelcomeChips ? (
                  <div className="mt-1 flex flex-wrap justify-center gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => insertSuggestion(s)}
                        className="rounded-full border border-black/[0.08] bg-white px-2.5 py-1.5 text-left text-[11px] leading-snug text-zinc-600 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-black/15 hover:text-zinc-900 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] active:scale-[0.98]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : null}

                {typing ? (
                  <div className="flex justify-start">
                    <TypingDots />
                  </div>
                ) : null}
              </div>
            </div>

            {/* Composer */}
            <form
              className="border-t border-black/[0.06] bg-white p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <div className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-zinc-50 px-2.5 py-1.5 transition-colors duration-200 focus-within:border-black/20 focus-within:bg-white">
                <input
                  ref={inputRef}
                  value={input}
                  disabled={busy}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    busy
                      ? 'Searching your documents…'
                      : 'Ask about a protocol or document…'
                  }
                  className="min-w-0 flex-1 bg-transparent px-1.5 py-2 text-sm text-black outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  aria-label="Send"
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-all duration-200',
                    canSend
                      ? 'bg-black opacity-100 hover:scale-105 hover:bg-zinc-800 active:scale-95'
                      : 'cursor-not-allowed bg-zinc-300 opacity-70',
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-zinc-400">
                Answers from your organization’s documents
              </p>
            </form>
          </motion.div>
        ) : null}

      {/* Launcher */}
      {pastHero ? (
        <motion.button
          type="button"
          aria-label={open ? 'Close chat' : 'Open chat'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
        </motion.button>
      ) : null}
    </div>
  );
}
