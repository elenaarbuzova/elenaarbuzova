import { Plus } from 'lucide-react';
import { useApp } from '@/lib/store';
import { TEAM_MEMBERS, memberInitials } from '@/lib/team';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

type Status = 'Completed' | 'In Progress' | 'Pending';

const STATUS_DOT: Record<Status, string> = {
  Completed: 'bg-emerald-500',
  'In Progress': 'bg-amber-500',
  Pending: 'bg-red-500',
};

type Props = {
  className?: string;
  onAddMember?: () => void;
};

/** Team Collaboration — same roster as Settings → Members */
export function TeamCollaborationCard({ className, onAddMember }: Props) {
  const { user } = useApp();
  const { isDark } = useTheme();

  const roster = [
    {
      id: 'you',
      name: user?.name ?? 'Lab User',
      initials: memberInitials(user?.name ?? 'Lab User'),
      bg: isDark ? '#7c2d12' : '#FDBA74',
      fg: isDark ? '#fed7aa' : '#ffffff',
      task: 'Workspace admin & knowledge curation',
      status: 'Completed' as Status,
    },
    ...TEAM_MEMBERS.map((m) => ({
      id: m.id,
      name: m.name,
      initials: m.initials,
      bg: isDark ? m.darkBg : m.bg,
      fg: isDark ? m.darkFg : m.fg,
      task: m.task ?? 'Lab collaboration',
      status: (m.status ?? 'Pending') as Status,
    })),
  ];

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:border-white/[0.06] dark:bg-[#141416] dark:shadow-none',
        className,
      )}
    >
      <div className="mb-2.5 flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400">
          Team Collaboration
        </h2>
        <button
          type="button"
          onClick={onAddMember}
          className="inline-flex shrink-0 items-center gap-0.5 rounded-md border border-orange-200 px-2 py-0.5 text-[8px] font-semibold leading-none transition-colors hover:bg-orange-50 hover:border-orange-300 dark:border-orange-500/35 dark:bg-transparent dark:text-orange-400 dark:hover:bg-orange-500/10 dark:hover:border-orange-500/50"
          style={isDark ? undefined : { color: '#EA580C' }}
        >
          <Plus className="h-2 w-2" strokeWidth={2.5} />
          Add Member
        </button>
      </div>

      <ul className="scrollbar-thin min-h-0 flex-1 space-y-0 overflow-y-auto">
        {roster.map((m) => (
          <li
            key={m.id}
            className="flex items-start gap-2.5 border-b border-black/[0.04] py-2 last:border-0 dark:border-white/[0.04]"
          >
            <span
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tracking-wide ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
              style={{ backgroundColor: m.bg, color: m.fg }}
              aria-hidden
            >
              {m.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-1.5">
                <p className="truncate text-[11px] font-semibold text-zinc-900 dark:text-zinc-50">
                  {m.name}
                </p>
                <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-medium text-zinc-700 dark:text-zinc-400">
                  <span
                    className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[m.status])}
                    aria-hidden
                  />
                  {m.status}
                </span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-zinc-600 dark:text-zinc-500">
                Working on{' '}
                <span className="font-medium text-zinc-800 dark:text-zinc-300">
                  {m.task}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
