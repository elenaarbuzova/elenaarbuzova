import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  BarChart3,
  Bell,
  BookOpen,
  CreditCard,
  Home,
  Layers,
  LogOut,
  MessageSquare,
  Moon,
  Plus,
  Puzzle,
  Settings,
  Sun,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { PaywallModal } from '@/components/app/PaywallModal';
import { SettingsModal } from '@/components/app/SettingsModal';
import { HeaderSearch } from '@/components/app/CommandSearch';
import { UserMenu } from '@/components/app/UserMenu';
import { WorkspacesSection } from '@/components/app/WorkspacesSection';
import { useApp } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

const RAIL_NAV = [
  { href: '/app', label: 'Overview', icon: Home, exact: true },
  { href: '/app/playground', label: 'Chat', icon: MessageSquare },
  { href: '/app/knowledge', label: 'Knowledge', icon: BookOpen },
  { href: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/app/builder', label: 'Widget', icon: Puzzle },
  { href: '/app/billing', label: 'Billing', icon: CreditCard },
] as const;

const BTN = 44;
const GAP = 12;
const STEP = BTN + GAP;

const dropTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 24,
  mass: 0.95,
};

function RailButton({
  label,
  accent,
  dark,
  onClick,
  children,
  href,
}: {
  label: string;
  accent?: boolean;
  dark?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  href?: string;
}) {
  const className = cn(
    'relative z-10 flex h-11 w-11 items-center justify-center rounded-full',
    dark
      ? 'bg-black text-white shadow-[0_4px_14px_rgba(0,0,0,0.2)]'
      : accent
        ? 'bg-transparent text-white'
        : 'bg-transparent text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300',
  );

  const inner = (
    <motion.span
      className={className}
      title={label}
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return (
    <button type="button" onClick={onClick} title={label} aria-label={label} className="relative">
      <motion.span
        className={className}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        {children}
      </motion.span>
    </button>
  );
}

function RailDroplet({ activeIndex }: { activeIndex: number }) {
  if (activeIndex < 0) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-[1] h-11 w-11 -ml-[22px] rounded-full bg-accent/30 blur-md"
        initial={false}
        animate={{ top: activeIndex * STEP }}
        transition={{ ...dropTransition, stiffness: 200, damping: 22 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-[1] h-11 w-11 -ml-[22px] bg-accent shadow-[0_8px_28px_rgba(255,77,46,0.45)]"
        initial={false}
        animate={{
          top: activeIndex * STEP,
          scaleY: [1, 1.5, 1],
          scaleX: [1, 0.72, 1],
          borderRadius: ['50%', '40%', '50%'],
        }}
        transition={{
          top: dropTransition,
          scaleY: { duration: 0.55, ease: [0.34, 1.2, 0.64, 1] },
          scaleX: { duration: 0.55, ease: [0.34, 1.2, 0.64, 1] },
          borderRadius: { duration: 0.55, ease: [0.34, 1.2, 0.64, 1] },
        }}
      />
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const {
    createConversation,
    signOut,
    activeProjectId,
    setActiveProjectId,
    openSettings,
  } = useApp();
  const { theme, setTheme, isDark } = useTheme();
  const [isWorkspacesOpen, setIsWorkspacesOpen] = useState(true);

  const onNewChat = () => {
    createConversation();
    setLocation('/app/playground');
  };

  const onSignOut = () => {
    signOut();
    setLocation('/');
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? location === href : location.startsWith(href);

  const isChat = location.startsWith('/app/playground');

  return (
    <div className="app-shell flex h-screen flex-col overflow-hidden bg-surface-2 text-ink transition-colors duration-200">
      <header className="z-30 flex h-[68px] shrink-0 items-center gap-4 border-0 bg-transparent px-3 shadow-none md:px-4">
        <Link href="/app">
          <span className="shrink-0">
            <Logo
              size="lg"
              subtitle="AI Research Assistant"
              variant={isDark ? 'dark' : 'light'}
            />
          </span>
        </Link>

        <HeaderSearch className="hidden min-w-0 flex-1 sm:block" />

        <div className="hidden h-11 shrink-0 items-center rounded-full bg-white p-1 sm:flex dark:bg-[#1a1a1c]">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200',
              theme === 'dark'
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:text-zinc-600',
            )}
            aria-label="Dark mode"
            aria-pressed={theme === 'dark'}
          >
            <Moon className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200',
              theme === 'light'
                ? 'bg-zinc-100 text-zinc-800 dark:bg-white/10 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-300',
            )}
            aria-label="Light mode"
            aria-pressed={theme === 'light'}
          >
            <Sun className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex h-11 shrink-0 items-center gap-1 rounded-full bg-white pl-2 pr-1.5 dark:bg-[#1a1a1c]">
          <button
            type="button"
            className="relative rounded-full p-2 text-zinc-500 transition-colors duration-200 hover:bg-zinc-50 hover:text-ink dark:hover:bg-white/[0.06] dark:hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
            <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#c4a574] px-0.5 text-[9px] font-semibold text-white">
              1
            </span>
          </button>
          <button
            type="button"
            onClick={openSettings}
            className="flex rounded-full p-2 text-zinc-500 transition-colors duration-200 hover:bg-zinc-50 hover:text-ink dark:hover:bg-white/[0.06] dark:hover:text-white"
            aria-label="Settings"
          >
            <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
          <UserMenu />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-2 overflow-hidden px-3 pb-3">
        <motion.aside
          initial={false}
          animate={{ width: isWorkspacesOpen ? 280 : 72 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="z-20 flex shrink-0 overflow-hidden rounded-[2rem] bg-[#f3f3f4] dark:bg-[#1a1a1c]"
        >
          <div className="flex w-[72px] shrink-0 flex-col items-center py-5">
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <RailButton label="New chat" dark onClick={onNewChat}>
                <Plus className="h-[18px] w-[18px]" strokeWidth={2.25} />
              </RailButton>

              <button
                type="button"
                title="Workspaces"
                aria-label="Workspaces"
                aria-expanded={isWorkspacesOpen}
                aria-pressed={isWorkspacesOpen}
                onClick={() => setIsWorkspacesOpen((v) => !v)}
                className="group relative"
              >
                <span
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute inset-0 -z-0 scale-125 rounded-full bg-violet-500/25 blur-xl transition-opacity duration-300',
                    isWorkspacesOpen
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-70',
                  )}
                />
                <motion.span
                  className={cn(
                    'relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200',
                    isWorkspacesOpen
                      ? 'bg-white text-zinc-900 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_8px_24px_rgba(139,92,246,0.28)] dark:bg-white/10 dark:text-white dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_28px_rgba(139,92,246,0.35)]'
                      : 'bg-transparent text-zinc-400 group-hover:bg-white/80 group-hover:text-zinc-700 group-hover:shadow-[0_4px_16px_rgba(139,92,246,0.18)] dark:text-zinc-500 dark:group-hover:bg-white/10 dark:group-hover:text-zinc-200',
                  )}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                >
                  <Layers className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </motion.span>
              </button>

              <div className="relative flex flex-col items-center gap-3">
                <RailDroplet
                  activeIndex={RAIL_NAV.findIndex((item) =>
                    isActive(item.href, 'exact' in item && item.exact),
                  )}
                />
                {RAIL_NAV.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href, 'exact' in item && item.exact);

                  return (
                    <RailButton
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      accent={active}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </RailButton>
                  );
                })}
              </div>
            </div>

            <RailButton label="Sign out" onClick={onSignOut}>
              <LogOut className="h-[18px] w-[18px] text-[#e85d6a]" strokeWidth={1.75} />
            </RailButton>
          </div>

          <AnimatePresence initial={false}>
            {isWorkspacesOpen ? (
              <motion.div
                key="workspaces-col"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 208 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-0 shrink-0 flex-col overflow-hidden border-l border-black/[0.06] py-3 dark:border-white/10"
              >
                <WorkspacesSection
                  activeId={activeProjectId}
                  onSelect={(id) => setActiveProjectId(id ?? activeProjectId)}
                  onClose={() => setIsWorkspacesOpen(false)}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.aside>

        <main
          className={cn(
            'flex min-h-0 min-w-0 flex-1 flex-col rounded-[2rem] bg-surface',
            isChat
              ? 'overflow-hidden p-0'
              : 'overflow-auto p-8 md:p-10',
          )}
        >
          {children}
        </main>
      </div>
      <PaywallModal />
      <SettingsModal />
    </div>
  );
}
