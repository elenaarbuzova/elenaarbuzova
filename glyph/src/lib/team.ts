export type TeamRole = 'Admin' | 'Scientist' | 'Viewer';

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  initials: string;
  /** Soft pastel avatar fill (light) */
  bg: string;
  /** Initials color (light) */
  fg: string;
  /** Soft muted fill for dark mode */
  darkBg: string;
  darkFg: string;
  /** Optional collaboration task (Overview) */
  task?: string;
  status?: 'Completed' | 'In Progress' | 'Pending';
};

/** Shared roster — Settings Members + Overview Team Collaboration */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'amira',
    name: 'Dr. Amira Hassan',
    email: 'amira@helixbio.lab',
    role: 'Scientist',
    initials: 'AH',
    bg: '#ffedd5',
    fg: '#c2410c',
    darkBg: '#431407',
    darkFg: '#fdba74',
    task: 'Integrate CRISPR protocol Q&A',
    status: 'In Progress',
  },
  {
    id: 'james',
    name: 'James Okonkwo',
    email: 'james@helixbio.lab',
    role: 'Viewer',
    initials: 'JO',
    bg: '#e2e8f0',
    fg: '#475569',
    darkBg: '#1e293b',
    darkFg: '#94a3b8',
    task: 'Review reagent storage SOPs',
    status: 'Pending',
  },
];

export const ROLE_BADGE: Record<
  TeamRole,
  { bg: string; text: string; ring: string }
> = {
  Admin: {
    bg: 'bg-orange-50 dark:bg-orange-500/15',
    text: 'text-orange-800 dark:text-orange-200',
    ring: 'ring-orange-100 dark:ring-orange-500/25',
  },
  Scientist: {
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-700 dark:text-zinc-300',
    ring: 'ring-zinc-200/80 dark:ring-zinc-700',
  },
  Viewer: {
    bg: 'bg-slate-100 dark:bg-slate-800/80',
    text: 'text-slate-600 dark:text-slate-300',
    ring: 'ring-slate-200/80 dark:ring-slate-700',
  },
};

export function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
