import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  LayoutTemplate,
  MoreHorizontal,
  Shield,
  User,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';
import { PremiumLock } from '@/components/ui/PremiumLock';
import { useApp } from '@/lib/store';
import { ROLE_BADGE, TEAM_MEMBERS, memberInitials } from '@/lib/team';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

type Section = 'profile' | 'workspace' | 'members' | 'security';

const SECTIONS: {
  id: Section;
  label: string;
  icon: LucideIcon;
  premium?: boolean;
}[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'workspace', label: 'Workspace', icon: LayoutTemplate },
  { id: 'members', label: 'Members', icon: Users, premium: true },
  { id: 'security', label: 'Security', icon: Shield },
];

export function SettingsModal() {
  const {
    showSettings,
    closeSettings,
    user,
    workspace,
    plan,
    openPaywall,
  } = useApp();
  const [section, setSection] = useState<Section>('profile');
  const isFree = plan === 'starter';
  const { isDark } = useTheme();

  useEffect(() => {
    if (!showSettings) return;
    setSection('profile');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [showSettings, closeSettings]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {showSettings ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-label="Settings"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative z-10 flex h-[min(560px,86vh)] w-full max-w-[720px] flex-col overflow-hidden rounded-[1.75rem]',
              'border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]',
              'dark:border-white/[0.08] dark:bg-[#232326] dark:shadow-[0_24px_80px_rgba(0,0,0,0.55)]',
            )}
          >
            <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-5 sm:px-6">
              <h2 className="text-[17px] font-semibold tracking-tight text-ink dark:text-zinc-50">
                Settings
              </h2>
              <button
                type="button"
                onClick={closeSettings}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-black/[0.04] hover:text-ink dark:hover:bg-white/10 dark:hover:text-zinc-100"
                aria-label="Close settings"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 gap-2 px-3 pb-4 pt-1 sm:px-4 sm:pb-5">
              <nav className="flex w-[148px] shrink-0 flex-col gap-0.5 sm:w-[168px]">
                {SECTIONS.map(({ id, label, icon: Icon, premium }) => {
                  const active = section === id;
                  const locked = Boolean(premium && isFree);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        if (locked) {
                          openPaywall(
                            'Team members are on the Research plan.',
                          );
                          return;
                        }
                        setSection(id);
                      }}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors',
                        active && !locked
                          ? 'bg-zinc-100 text-ink dark:bg-white/[0.1] dark:text-zinc-50'
                          : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-zinc-200',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
                      <span className="min-w-0 flex-1">{label}</span>
                      {locked ? (
                        <PremiumLock
                          size={17}
                          label="Research plan"
                          onClick={() =>
                            openPaywall(
                              'Team members are on the Research plan.',
                            )
                          }
                        />
                      ) : null}
                    </button>
                  );
                })}
              </nav>

              <div
                className={cn(
                  'min-h-0 min-w-0 flex-1 overflow-y-auto rounded-2xl px-4 py-4 sm:px-5',
                  'bg-zinc-50/80 dark:bg-white/[0.03]',
                )}
              >
                {section === 'profile' ? (
                  <div className="space-y-4">
                    <Field label="Name">
                      <Input defaultValue={user?.name} />
                    </Field>
                    <Field label="Email">
                      <Input defaultValue={user?.email} />
                    </Field>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => toast.success('Profile saved')}
                    >
                      Save changes
                    </Button>
                  </div>
                ) : null}

                {section === 'workspace' ? (
                  <div className="space-y-4">
                    <Field label="Organization">
                      <Input defaultValue={workspace?.name} />
                    </Field>
                    <Field label="Industry">
                      <Input defaultValue={workspace?.industry} />
                    </Field>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => toast.success('Workspace updated')}
                    >
                      Save
                    </Button>
                  </div>
                ) : null}

                {section === 'members' ? (
                  <div className="space-y-3">
                    {[
                      {
                        id: 'you',
                        name: user?.name ?? 'You',
                        email: user?.email ?? 'you@helixbio.lab',
                        role: 'Admin' as const,
                        initials: memberInitials(user?.name ?? 'You'),
                        bg: isDark ? '#7c2d12' : '#FDBA74',
                        fg: isDark ? '#fed7aa' : '#ffffff',
                      },
                      ...TEAM_MEMBERS.map((m) => ({
                        ...m,
                        bg: isDark ? m.darkBg : m.bg,
                        fg: isDark ? m.darkFg : m.fg,
                      })),
                    ].map((m) => {
                      const badge = ROLE_BADGE[m.role];
                      return (
                        <div
                          key={m.id}
                          className={cn(
                            'flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-3.5 py-3',
                            'dark:border-white/[0.06] dark:bg-[#141416]',
                          )}
                        >
                          <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold tracking-wide"
                            style={{ backgroundColor: m.bg, color: m.fg }}
                            aria-hidden
                          >
                            {m.initials}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink dark:text-zinc-100">
                              {m.name}
                            </p>
                            <p className="truncate text-xs text-zinc-500">
                              {m.email}
                            </p>
                          </div>
                          <span
                            className={cn(
                              'inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
                              badge.bg,
                              badge.text,
                              badge.ring,
                            )}
                          >
                            {m.role}
                          </span>
                          {m.role !== 'Admin' ? (
                            <button
                              type="button"
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
                              aria-label={`Manage ${m.name}`}
                              onClick={() =>
                                toast.message(`Member options · ${m.name} (demo)`)
                              }
                            >
                              <MoreHorizontal
                                className="h-4 w-4"
                                strokeWidth={1.75}
                              />
                            </button>
                          ) : (
                            <span className="w-8 shrink-0" aria-hidden />
                          )}
                        </div>
                      );
                    })}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => toast.message('Invite sent (demo)')}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-orange-200 bg-white px-4 text-[13px] font-semibold transition-colors hover:bg-orange-50 dark:border-orange-500/30 dark:bg-transparent dark:hover:bg-orange-500/10"
                        style={{ color: '#EA580C' }}
                      >
                        Invite member
                      </button>
                    </div>
                  </div>
                ) : null}

                {section === 'security' ? (
                  <div className="space-y-3">
                    <div
                      className={cn(
                        'rounded-xl border border-black/[0.06] bg-white p-4',
                        'dark:border-white/[0.08] dark:bg-white/[0.04]',
                      )}
                    >
                      <p className="text-sm font-medium text-ink dark:text-zinc-100">
                        Two-factor authentication
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Recommended for regulated workspaces.
                      </p>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-3"
                        onClick={() => toast.message('2FA setup (demo)')}
                      >
                        Enable 2FA
                      </Button>
                    </div>
                    <div
                      className={cn(
                        'rounded-xl border border-black/[0.06] bg-white p-4',
                        'dark:border-white/[0.08] dark:bg-white/[0.04]',
                      )}
                    >
                      <p className="text-sm font-medium text-ink dark:text-zinc-100">
                        SSO
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Available on Enterprise.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
