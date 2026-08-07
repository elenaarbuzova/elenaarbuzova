import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  Camera,
  Cloud,
  HelpCircle,
  LogOut,
  Settings,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PLANS } from '@/lib/data';
import { useApp } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

export function UserMenu({ className }: { className?: string }) {
  const [, setLocation] = useLocation();
  const { user, plan, files, openPaywall, openSettings, signOut } = useApp();
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name ?? '');
  const [username, setUsername] = useState(
    (user?.email ?? 'user').split('@')[0] ?? 'user',
  );
  const rootRef = useRef<HTMLDivElement>(null);

  const initials = (user?.name ?? 'U')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const planLabel =
    plan === 'starter' ? 'Free' : plan === 'research' ? 'Research' : 'Enterprise';

  const usageLabel =
    plan === 'starter' ? 'Personal' : plan === 'research' ? 'Research' : 'Enterprise';

  const usageLimit =
    plan === 'starter' ? 30 : plan === 'research' ? 500 : PLANS.enterprise.limits.chats;
  const usageUsed = Math.min(
    usageLimit,
    plan === 'starter' ? Math.max(files.length + 14, 19) : files.length * 12 + 40,
  );
  const usagePct = Math.min(100, Math.round((usageUsed / usageLimit) * 100));

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (editOpen) {
      setDisplayName(user?.name ?? '');
      setUsername((user?.email ?? 'user').split('@')[0] ?? 'user');
    }
  }, [editOpen, user?.email, user?.name]);

  const go = (href: string) => {
    setOpen(false);
    setLocation(href);
  };

  const onLogout = () => {
    setOpen(false);
    signOut();
    setLocation('/');
  };

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'ml-0.5 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-[12px] font-semibold text-white ring-2 ring-white transition-transform duration-200 hover:scale-105 dark:ring-white/20',
          isDark ? 'bg-[#7c2d12] text-orange-200' : 'bg-[#FDBA74]',
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        {initials.charAt(0)}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={cn(
              'absolute right-0 top-[calc(100%+10px)] z-50 w-[300px] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)]',
              isDark
                ? 'border border-white/10 bg-[#2a2a2a] text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)]'
                : 'border border-black/[0.08] bg-white text-zinc-800',
            )}
          >
            <div className="flex items-center gap-3 px-3.5 py-3.5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEditOpen(true);
                }}
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white',
                  isDark ? 'bg-[#7c2d12] text-orange-200' : 'bg-[#FDBA74]',
                )}
              >
                {initials}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEditOpen(true);
                }}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-[14px] font-semibold leading-tight">
                  {user?.name ?? 'Account'}
                </p>
                <p
                  className={cn(
                    'mt-0.5 text-[12px]',
                    isDark ? 'text-white/45' : 'text-zinc-400',
                  )}
                >
                  {planLabel}
                </p>
              </button>
            </div>

            <div
              className={cn(
                'mx-3 border-t',
                isDark ? 'border-white/10' : 'border-black/[0.06]',
              )}
            />

            <div className="py-1.5">
              {plan === 'starter' ? (
                <MenuItem
                  dark={isDark}
                  icon={Sparkles}
                  label="Research plan"
                  onClick={() => {
                    setOpen(false);
                    openPaywall(
                      'Research raises document limits and adds analytics and embed.',
                    );
                  }}
                />
              ) : null}
              <MenuItem
                dark={isDark}
                icon={UserRound}
                label="Account"
                onClick={() => {
                  setOpen(false);
                  setEditOpen(true);
                }}
              />
              <MenuItem
                dark={isDark}
                icon={Settings}
                label="Settings"
                onClick={() => {
                  setOpen(false);
                  openSettings();
                }}
              />
            </div>

            <div
              className={cn(
                'mx-3 border-t',
                isDark ? 'border-white/10' : 'border-black/[0.06]',
              )}
            />

            <div className="py-1.5">
              <MenuItem
                dark={isDark}
                icon={HelpCircle}
                label="Help"
                chevron
                onClick={() => {
                  setOpen(false);
                  setLocation('/docs');
                }}
              />
              <MenuItem
                dark={isDark}
                icon={LogOut}
                label="Log out"
                chevron
                onClick={onLogout}
              />
            </div>

            {/* Usage limits — below Log out */}
            <div
              className={cn(
                'border-t px-3.5 py-3',
                isDark
                  ? 'border-white/10 bg-white/[0.03]'
                  : 'border-black/[0.06] bg-accent/[0.04]',
              )}
            >
              <div className="flex items-center gap-2">
                <Cloud
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isDark ? 'text-accent' : 'text-accent',
                  )}
                  strokeWidth={1.75}
                />
                <span className="min-w-0 flex-1 text-[13px] font-semibold">
                  {usageLabel}
                </span>
                {plan !== 'enterprise' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openPaywall('Research raises document limits.');
                    }}
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors',
                      isDark
                        ? 'border border-accent/45 bg-transparent text-white/80 hover:bg-white/[0.04]'
                        : 'border border-accent/45 bg-transparent text-zinc-700 hover:bg-accent/[0.04]',
                    )}
                  >
                    Upgrade
                  </button>
                ) : null}
              </div>
              <div
                className={cn(
                  'mt-2.5 h-1.5 overflow-hidden rounded-full',
                  isDark ? 'bg-white/10' : 'bg-accent/15',
                )}
              >
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              <p
                className={cn(
                  'mt-2 text-[11px]',
                  isDark ? 'text-white/45' : 'text-zinc-500',
                )}
              >
                {usageUsed} summaries used of {usageLimit >= 9999 ? '∞' : usageLimit}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit profile"
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <div
              className={cn(
                'flex h-24 w-24 items-center justify-center rounded-full text-3xl font-semibold text-white',
                isDark ? 'bg-[#7c2d12] text-orange-200' : 'bg-[#FDBA74]',
              )}
            >
              {initials}
            </div>
            <button
              type="button"
              onClick={() => toast.message('Photo upload coming soon')}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-zinc-900 text-white shadow-md transition-transform hover:scale-105"
              aria-label="Change photo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-6 w-full space-y-4">
            <Field label="Display name">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Field>
            <Field label="Username">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Your profile helps teammates recognize you across the workspace.
            </p>
          </div>

          <div className="mt-8 flex w-full justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setEditOpen(false);
                toast.success('Profile saved');
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  chevron,
  dark,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  onClick: () => void;
  chevron?: boolean;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-[13px] transition-colors',
        dark
          ? 'text-white/90 hover:bg-white/[0.06]'
          : 'text-zinc-700 hover:bg-zinc-50',
      )}
    >
      <Icon
        className={cn('h-4 w-4 shrink-0', dark ? 'text-white/70' : 'text-zinc-400')}
        strokeWidth={1.75}
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {chevron ? (
        <span className={cn(dark ? 'text-white/35' : 'text-zinc-300')} aria-hidden>
          ›
        </span>
      ) : null}
    </button>
  );
}
