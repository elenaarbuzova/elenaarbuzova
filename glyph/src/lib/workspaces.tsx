import { cn } from '@/lib/utils';

export type WorkspaceId = string;

export type WorkspaceShape = 'square' | 'diamond' | 'circle';

export type Workspace = {
  id: WorkspaceId;
  name: string;
  count: string;
  color: string;
  glow: string;
  shape: WorkspaceShape;
  border: string;
  activeBg: string;
};

export const WORKSPACES: Workspace[] = [
  {
    id: 'oncology',
    name: 'Oncology R&D',
    count: '04',
    color: 'bg-violet-500',
    glow: 'shadow-[0_0_8px_rgba(139,92,246,0.5)]',
    shape: 'square',
    border: 'border-violet-500',
    activeBg: 'bg-violet-500/[0.08] dark:bg-violet-500/15',
  },
  {
    id: 'pcr',
    name: 'Clinical PCR Trials',
    count: '02',
    color: 'bg-teal-400',
    glow: 'shadow-[0_0_8px_rgba(45,212,191,0.5)]',
    shape: 'diamond',
    border: 'border-teal-400',
    activeBg: 'bg-teal-400/[0.08] dark:bg-teal-400/15',
  },
  {
    id: 'genetics',
    name: 'Genetics Archive',
    count: '09',
    color: 'bg-amber-500',
    glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    shape: 'circle',
    border: 'border-amber-500',
    activeBg: 'bg-amber-500/[0.08] dark:bg-amber-500/15',
  },
];

export const DEFAULT_WORKSPACE_ID: WorkspaceId = 'oncology';

export function getWorkspace(id: WorkspaceId | null | undefined): Workspace {
  return WORKSPACES.find((w) => w.id === id) ?? WORKSPACES[0];
}

export function workspaceDocCount(ws: Workspace): number {
  return Number.parseInt(ws.count, 10) || 0;
}

export function WorkspaceAnchor({
  color,
  glow,
  shape,
  size = 'sm',
}: {
  color: string;
  glow: string;
  shape: WorkspaceShape;
  size?: 'sm' | 'md';
}) {
  return (
    <span
      className={cn(
        'shrink-0',
        size === 'md' ? 'h-2.5 w-2.5' : 'h-2 w-2',
        color,
        glow,
        shape === 'square' && 'rounded-[2px]',
        shape === 'diamond' && 'rotate-45 rounded-[1px]',
        shape === 'circle' && 'rounded-full',
      )}
    />
  );
}
