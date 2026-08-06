import type { ChatMessage } from '@/lib/data';

export const KNOWLEDGE_BASES = [
  'Oncology',
  'PCR',
  'Cell Culture',
  'Publications',
] as const;

export type KnowledgeBaseId = (typeof KNOWLEDGE_BASES)[number];

export type ConversationMessage = ChatMessage & {
  attachment?: string;
  attachmentId?: string;
  createdAt?: string;
};

export type Conversation = {
  id: string;
  title: string;
  knowledgeBase: KnowledgeBaseId;
  /** Links chat to a left-rail workspace (oncology / pcr / genetics) */
  workspaceId: string;
  messages: ConversationMessage[];
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export function generateConversationTitle(firstUserMessage: string): string {
  const raw = firstUserMessage.trim().replace(/\s+/g, ' ');
  if (!raw) return 'New conversation';

  const lower = raw.toLowerCase();

  const patterns: [RegExp, (m: RegExpMatchArray) => string][] = [
    [
      /(?:prepare|preparation of|prep(?:are)?)\s+(.+?)(?:\?|$)/i,
      (m) => `${titleCase(m[1])} Preparation`,
    ],
    [
      /(?:protocol|sop).*(?:for|to)\s+(.+?)(?:\?|$)/i,
      (m) => `${titleCase(m[1])} Protocol`,
    ],
    [
      /(?:for|about)\s+(.+?)\s+(?:protocol|extraction|preparation)(?:\?|$)/i,
      (m) => `${titleCase(m[1])} Protocol`,
    ],
    [
      /rna\s+extraction/i,
      () => 'RNA Extraction Protocol',
    ],
    [
      /crispr|cas9|transfect/i,
      () => 'CRISPR Transfection Protocol',
    ],
    [
      /storage|reagent/i,
      () => 'Reagent Storage Conditions',
    ],
    [
      /assay|qc\b/i,
      () => 'QC Assay Results',
    ],
    [
      /mrna|nature/i,
      () => 'mRNA Literature Review',
    ],
    [
      /glp|compliance|audit/i,
      () => 'GLP Compliance Notes',
    ],
    [
      /sample\s+([a-z0-9_-]+)/i,
      (m) => `Sample ${m[1].toUpperCase()} Preparation`,
    ],
  ];

  for (const [re, fn] of patterns) {
    const m = raw.match(re);
    if (m) return truncate(fn(m), 48);
  }

  // Strip question fluff
  let cleaned = raw
    .replace(/^(how do we|how do i|what|how|can you|please|tell me)\s+/i, '')
    .replace(/\?+$/, '')
    .trim();

  if (cleaned.length < 4) cleaned = raw.replace(/\?+$/, '');
  return truncate(titleCase(cleaned), 48);
}

function titleCase(s: string) {
  return s
    .split(/\s+/)
    .map((w) => {
      if (/^[A-Z0-9_-]+$/.test(w) && w.length <= 4) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

function truncate(s: string, n: number) {
  const t = s.trim();
  return t.length <= n ? t : `${t.slice(0, n - 1).trim()}…`;
}

export function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export type DateGroup = 'Pinned' | 'Today' | 'Yesterday' | 'Last Week' | 'Older';

export function conversationDateGroup(updatedAt: string, now = new Date()): Exclude<DateGroup, 'Pinned'> {
  const t = startOfDay(new Date(updatedAt)).getTime();
  const today = startOfDay(now).getTime();
  const day = 24 * 60 * 60 * 1000;
  if (t === today) return 'Today';
  if (t === today - day) return 'Yesterday';
  if (t > today - 7 * day) return 'Last Week';
  return 'Older';
}

export function createEmptyConversation(
  knowledgeBase: KnowledgeBaseId = 'Cell Culture',
  workspaceId = 'oncology',
): Conversation {
  const now = new Date().toISOString();
  return {
    id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: 'New conversation',
    knowledgeBase,
    workspaceId,
    messages: [
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          'I’m your lab research assistant. Ask about protocols, SOPs, publications, or assay data — I’ll cite every source.',
        createdAt: now,
      },
    ],
    pinned: false,
    favorite: false,
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function buildSeedConversations(): Conversation[] {
  const now = Date.now();
  const hour = 3600_000;
  const day = 24 * hour;

  const mk = (
    partial: Omit<Conversation, 'createdAt' | 'updatedAt' | 'pinned' | 'favorite' | 'archived'> & {
      pinned?: boolean;
      favorite?: boolean;
      archived?: boolean;
      createdAt?: string;
      updatedAt?: string;
    },
  ): Conversation => ({
    pinned: false,
    favorite: false,
    archived: false,
    createdAt: new Date(now - day).toISOString(),
    updatedAt: new Date(now - hour).toISOString(),
    ...partial,
  });

  return [
    mk({
      id: 'seed-rna',
      title: 'RNA Extraction Protocol (PCR)',
      knowledgeBase: 'PCR',
      workspaceId: 'pcr',
      pinned: true,
      favorite: true,
      updatedAt: new Date(now - 20 * 60_000).toISOString(),
      messages: [
        {
          id: 's1',
          role: 'assistant',
          content:
            'I’m your lab research assistant. Ask about protocols, SOPs, publications, or assay data — I’ll cite every source.',
        },
        {
          id: 's2',
          role: 'user',
          content: 'What protocol should I use for RNA extraction?',
        },
        {
          id: 's3',
          role: 'assistant',
          content:
            'Use SOP-RNA-04 (TRIzol). Lyse on ice, phase-separate, precipitate, then wash in 75% ethanol.',
          sources: [
            { title: 'Protocol_RNA_Extraction.pdf', type: 'Protocol', page: '17' },
            { title: 'SOP-042_Sample_Handling.docx', type: 'SOP' },
          ],
          confidence: 98,
        },
      ],
    }),
    mk({
      id: 'seed-oncology-pipeline',
      title: 'Oncology Biomarker Panel',
      knowledgeBase: 'Oncology',
      workspaceId: 'oncology',
      pinned: true,
      favorite: true,
      updatedAt: new Date(now - 45 * 60_000).toISOString(),
      messages: [
        {
          id: 'o1',
          role: 'user',
          content: 'Which biomarkers should we prioritize for the oncology panel?',
        },
        {
          id: 'o2',
          role: 'assistant',
          content:
            'Prioritize PD-L1, MSI, and TMB for immuno-oncology triage, then EGFR / ALK for targeted therapy eligibility.',
          sources: [
            { title: 'GLP_Compliance_Manual.pdf', type: 'PDF', page: '22' },
          ],
          confidence: 95,
        },
      ],
    }),
    mk({
      id: 'seed-crispr',
      title: 'CRISPR Transfection Protocol',
      knowledgeBase: 'Oncology',
      workspaceId: 'oncology',
      updatedAt: new Date(now - day - 3 * hour).toISOString(),
      createdAt: new Date(now - day - 5 * hour).toISOString(),
      messages: [
        {
          id: 's6',
          role: 'user',
          content: 'Walk me through the CRISPR transfection protocol',
        },
        {
          id: 's7',
          role: 'assistant',
          content:
            'Seed HEK293T 24h prior, assemble RNP on ice, transfect with CRISPRMAX, assay editing at 48–72h.',
          sources: [
            { title: 'CRISPR_Cas9_Transfection_v3.pdf', type: 'Protocol', page: '4–6' },
          ],
          confidence: 98,
        },
      ],
    }),
    mk({
      id: 'seed-sample',
      title: 'Tumor Sample Preparation',
      knowledgeBase: 'Oncology',
      workspaceId: 'oncology',
      updatedAt: new Date(now - 2 * hour).toISOString(),
      messages: [
        {
          id: 's4',
          role: 'user',
          content: 'How do we prepare oncology Sample A for sequencing?',
        },
        {
          id: 's5',
          role: 'assistant',
          content:
            'Thaw Sample A on ice, dilute 1:10 in cold buffer, and aliquot within 30 minutes. Document lot number in LIMS.',
          sources: [
            { title: 'SOP-042_Sample_Handling.docx', type: 'SOP', page: '§3.2' },
          ],
          confidence: 96,
        },
      ],
    }),
    mk({
      id: 'seed-editing-log',
      title: 'CRISPR Editing Log',
      knowledgeBase: 'Cell Culture',
      workspaceId: 'genetics',
      pinned: true,
      favorite: true,
      updatedAt: new Date(now - 35 * 60_000).toISOString(),
      messages: [
        {
          id: 'g1',
          role: 'user',
          content: 'Summarize last week’s CRISPR editing outcomes.',
        },
        {
          id: 'g2',
          role: 'assistant',
          content:
            'Editing efficiency averaged 68% across 4 guides. Off-target hits remained below 0.4% in GUIDE-seq.',
          sources: [
            { title: 'CRISPR_Cas9_Transfection_v3.pdf', type: 'Protocol', page: '12' },
          ],
          confidence: 97,
        },
      ],
    }),
    mk({
      id: 'seed-gene-seq',
      title: 'Gene Sequencing FAQ',
      knowledgeBase: 'Publications',
      workspaceId: 'genetics',
      pinned: true,
      updatedAt: new Date(now - hour).toISOString(),
      messages: [
        {
          id: 'g3',
          role: 'user',
          content: 'What coverage depth do we need for germline gene sequencing?',
        },
        {
          id: 'g4',
          role: 'assistant',
          content:
            'Target ≥30× mean coverage for germline panels; raise to 100× for low-VAF somatic calls.',
          sources: [
            { title: 'Nature_Biotech_2024_mRNA.pdf', type: 'Paper', page: '88' },
          ],
          confidence: 93,
        },
      ],
    }),
    mk({
      id: 'seed-nature',
      title: 'Genome Annotation Notes',
      knowledgeBase: 'Publications',
      workspaceId: 'genetics',
      updatedAt: new Date(now - 3 * day).toISOString(),
      createdAt: new Date(now - 4 * day).toISOString(),
      messages: [
        {
          id: 's8',
          role: 'user',
          content: 'Key points from the genetics archive on variant annotation?',
        },
        {
          id: 's9',
          role: 'assistant',
          content:
            'Prefer ClinVar + gnomAD filters first, then ACMG criteria for pathogenicity calls.',
          sources: [
            { title: 'Nature_Biotech_2024_mRNA.pdf', type: 'Paper', page: '112–118' },
          ],
          confidence: 94,
        },
      ],
    }),
  ];
}

/** Resolve workspace for legacy chats missing workspaceId */
export function conversationWorkspaceId(c: Conversation): string {
  if (c.workspaceId) return c.workspaceId;
  if (c.knowledgeBase === 'PCR') return 'pcr';
  if (c.knowledgeBase === 'Oncology') return 'oncology';
  const t = c.title.toLowerCase();
  if (
    t.includes('gene') ||
    t.includes('crispr editing') ||
    t.includes('sequenc') ||
    t.includes('genome')
  ) {
    return 'genetics';
  }
  if (c.knowledgeBase === 'Publications' || c.knowledgeBase === 'Cell Culture') {
    return 'genetics';
  }
  return 'oncology';
}

export function conversationMatchesQuery(c: Conversation, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  if (c.title.toLowerCase().includes(needle)) return true;
  if (c.knowledgeBase.toLowerCase().includes(needle)) return true;
  return c.messages.some((m) => m.content.toLowerCase().includes(needle));
}

export function formatRelativeEdited(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function exportConversationMarkdown(c: Conversation) {
  const lines = [`# ${c.title}`, '', `Knowledge Base: ${c.knowledgeBase}`, ''];
  c.messages.forEach((m) => {
    lines.push(`## ${m.role === 'user' ? 'You' : 'LabAgent'}`, '', m.content, '');
    if (m.sources?.length) {
      lines.push(
        'Sources:',
        ...m.sources.map(
          (s) => `- ${s.title}${s.page ? ` (p. ${s.page})` : ''}`,
        ),
        '',
      );
    }
  });
  return lines.join('\n');
}

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
