import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Msg =
  | { id: string; role: 'bot' | 'user'; text: string }
  | { id: string; role: 'cta' };

const GREETING =
  'Привет! Я умный ИИ-помощник. Спроси меня о чем-нибудь!';
const DEMO_REPLY =
  'Я работаю в режиме демо-версии без бэкенда. Но если ты загрузишь свои документы в личном кабинете, я смогу отвечать на любые вопросы по твоему бизнесу!';

const ease = [0.22, 1, 0.36, 1] as const;

function TypingDots() {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-zinc-100 px-3.5 py-3"
      aria-label="Бот печатает"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-zinc-400"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
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
  const greeted = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

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

  const send = () => {
    const text = input.trim();
    if (!text || busy) return;

    const userId = `user-${Date.now()}`;
    setMessages((m) => [...m, { id: userId, role: 'user', text }]);
    setInput('');
    setBusy(true);
    setTyping(true);

    const replyTimer = window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: `bot-${Date.now()}`, role: 'bot', text: DEMO_REPLY },
        { id: `cta-${Date.now()}`, role: 'cta' },
      ]);
      setBusy(false);
    }, 1500);
    timers.current.push(replyTimer);
  };

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 md:bottom-7 md:right-7">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Демо чат LabAgent"
            className="pointer-events-auto flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.16)]"
            style={{ height: 'min(560px, calc(100svh - 7rem))' }}
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.32, ease }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] bg-white px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-tight text-black">
                    LabAgent
                  </p>
                  <p className="text-[11px] text-zinc-400">Online · demo</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Закрыть чат"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto bg-zinc-50/80 px-4 py-4"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) =>
                  msg.role === 'cta' ? (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease, delay: 0.12 }}
                      className="pt-1"
                    >
                      <Link
                        href="/signup"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-[#ff4d2e] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,77,46,0.28)] transition-all duration-300 hover:bg-[#ff3b18] hover:shadow-[0_10px_28px_rgba(255,77,46,0.36)]"
                      >
                        Создать своего бота
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.28, ease }}
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
                            : 'rounded-2xl rounded-bl-md bg-white text-zinc-700 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]',
                        )}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ),
                )}
              </AnimatePresence>

              {typing ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <TypingDots />
                </motion.div>
              ) : null}
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
                  placeholder={busy ? 'Бот печатает...' : 'Напишите сообщение…'}
                  className="min-w-0 flex-1 bg-transparent px-1.5 py-2 text-sm text-black outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Отправить"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white transition-all duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
        type="button"
        aria-label={open ? 'Закрыть чат' : 'Открыть чат'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:scale-105"
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 40, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ opacity: 0, rotate: 40, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -40, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              <MessageCircle className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open ? (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#ff4d2e]" />
        ) : null}
      </motion.button>
    </div>
  );
}
