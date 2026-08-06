export type PlanId = 'starter' | 'research' | 'enterprise';

export type KnowledgeFile = {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'md' | 'csv' | 'protocol' | 'paper';
  status: 'ready' | 'processing' | 'error';
  size: string;
  /** Display label, e.g. "Today" */
  uploadedAt: string;
  /** Epoch ms for sorting */
  addedAt: number;
  /** Size in bytes for sorting */
  sizeBytes: number;
  folder?: string;
  tags?: string[];
  /** Project workspace this document belongs to */
  project?: string;
  /** Whether the chatbot actively uses this file */
  activeInChatbot?: boolean;
  /** Extra status detail, e.g. "Limit Exceeded" */
  statusDetail?: string;
  /** Where the document entered the knowledge base */
  source?: 'upload' | 'chat';
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; type: string; page?: string }[];
  confidence?: number;
};

export type WidgetConfig = {
  name: string;
  accent: string;
  radius: number;
  position: 'bottom-right' | 'bottom-left';
  launcher: 'bubble' | 'bar';
  launcherIcon: 'chat' | 'dna' | 'flask';
  size: 'compact' | 'medium' | 'large';
  avatar: string;
  greeting: string;
  suggestions: string[];
  darkMode: boolean;
  showBranding: boolean;
  showCitations: boolean;
  showConfidence: boolean;
  enableSuggestions: boolean;
};

export type ActivityItem = {
  id: string;
  text: string;
  time: string;
  type: 'upload' | 'train' | 'publish' | 'chat' | 'member';
};

export type OnboardingStep =
  | 'welcome'
  | 'workspace'
  | 'chatbot'
  | 'knowledge'
  | 'training'
  | 'done';

export const PLANS = {
  starter: {
    id: 'starter' as const,
    name: 'Starter',
    price: 0,
    annualPrice: 0,
    description: 'Prove the value on a single research workspace.',
    features: [
      '500 indexed pages',
      '1 research assistant',
      'Protocol search',
      'Basic citations',
      'LabAgent branding',
    ],
    limits: { chatbots: 1, documents: 20, pages: 500, chats: 1000 },
    highlighted: false,
  },
  research: {
    id: 'research' as const,
    name: 'Research',
    price: 149,
    annualPrice: 119,
    description: 'For biotech teams accelerating discovery every day.',
    features: [
      'Unlimited documents',
      'Protocol AI',
      'Source citations',
      'SOP navigation',
      'Analytics & accuracy',
      'Remove LabAgent branding',
      'Up to 10 assistants',
    ],
    limits: { chatbots: 10, documents: 9999, pages: 99999, chats: 50000 },
    highlighted: true,
  },
  enterprise: {
    id: 'enterprise' as const,
    name: 'Enterprise',
    price: null as number | null,
    annualPrice: null as number | null,
    description: 'Security, compliance, and scale for pharma & R&D orgs.',
    features: [
      'SSO & SCIM',
      'Private model routing',
      'Audit logs',
      'API & VPC options',
      'SOC 2 & GDPR',
      'Dedicated success',
      'Unlimited everything',
    ],
    limits: { chatbots: 9999, documents: 9999, pages: 999999, chats: 999999 },
    highlighted: false,
  },
};

export const DEFAULT_WIDGET: WidgetConfig = {
  name: 'Lab Assistant',
  accent: '#ff4d2e',
  radius: 16,
  position: 'bottom-right',
  launcher: 'bubble',
  launcherIcon: 'chat',
  size: 'medium',
  avatar: 'L',
  greeting: 'Ask about protocols, SOPs, or publications. I cite every source.',
  suggestions: [
    'Find the CRISPR transfection protocol',
    'What are storage conditions for reagent X?',
    'Summarize last quarter’s assay results',
  ],
  darkMode: false,
  showBranding: true,
  showCitations: true,
  showConfidence: true,
  enableSuggestions: true,
};

export const SEED_FILES: KnowledgeFile[] = [
  {
    id: 'f1',
    name: 'CRISPR_Cas9_Transfection_v3.pdf',
    type: 'protocol',
    status: 'ready',
    size: '1.8 MB',
    sizeBytes: 1_800_000,
    uploadedAt: 'Today',
    addedAt: Date.now() - 1000 * 60 * 60 * 3,
    folder: 'Protocols',
    project: 'Genetics Archive',
    tags: ['CRISPR', 'Cell Culture'],
    activeInChatbot: true,
  },
  {
    id: 'f2',
    name: 'SOP-042_Sample_Handling.docx',
    type: 'docx',
    status: 'ready',
    size: '420 KB',
    sizeBytes: 420_000,
    uploadedAt: 'Today',
    addedAt: Date.now() - 1000 * 60 * 60 * 8,
    folder: 'SOPs',
    project: 'Oncology R&D',
    tags: ['Compliance', 'Samples'],
    activeInChatbot: true,
  },
  {
    id: 'f3',
    name: 'Nature_Biotech_2024_mRNA.pdf',
    type: 'paper',
    status: 'ready',
    size: '3.1 MB',
    sizeBytes: 3_100_000,
    uploadedAt: 'Yesterday',
    addedAt: Date.now() - 1000 * 60 * 60 * 28,
    folder: 'Publications',
    project: 'Genetics Archive',
    tags: ['mRNA', 'Review'],
    activeInChatbot: false,
  },
  {
    id: 'f4',
    name: 'QC_Assay_Results_Q2.csv',
    type: 'csv',
    status: 'error',
    statusDetail: 'Limit Exceeded',
    size: '890 KB',
    sizeBytes: 890_000,
    uploadedAt: 'Yesterday',
    addedAt: Date.now() - 1000 * 60 * 60 * 30,
    folder: 'Data',
    project: 'Clinical PCR Trials',
    tags: ['QC', 'Assay'],
    activeInChatbot: false,
  },
  {
    id: 'f5',
    name: 'Instrument_Calibration_Log.md',
    type: 'md',
    status: 'ready',
    size: '64 KB',
    sizeBytes: 64_000,
    uploadedAt: '2 days ago',
    addedAt: Date.now() - 1000 * 60 * 60 * 50,
    folder: 'Instruments',
    project: 'Clinical PCR Trials',
    tags: ['Calibration'],
    activeInChatbot: true,
  },
  {
    id: 'f6',
    name: 'GLP_Compliance_Manual.pdf',
    type: 'pdf',
    status: 'processing',
    size: '4.2 MB',
    sizeBytes: 4_200_000,
    uploadedAt: 'Just now',
    addedAt: Date.now() - 1000 * 60 * 2,
    folder: 'Compliance',
    project: 'Oncology R&D',
    tags: ['GLP', 'Regulatory'],
    activeInChatbot: false,
  },
];

export const PROJECT_COLORS: Record<string, string> = {
  'Oncology R&D': 'bg-violet-50 text-violet-700 ring-violet-200',
  'Clinical PCR Trials': 'bg-teal-50 text-teal-700 ring-teal-200',
  'Genetics Archive': 'bg-amber-50 text-amber-800 ring-amber-200',
};

/** Map legacy project labels → current workspace names */
const PROJECT_RENAME: Record<string, string> = {
  CRISPR_Cas9: 'Genetics Archive',
  'Oncology Pipeline': 'Oncology R&D',
  'Publications Hub': 'Genetics Archive',
  'QC Lab': 'Clinical PCR Trials',
  'Project Ideas': 'Oncology R&D',
};

export function migrateKnowledgeFiles(files: KnowledgeFile[]): KnowledgeFile[] {
  return files.map((f) => {
    if (!f.project) return f;
    const next = PROJECT_RENAME[f.project];
    return next ? { ...f, project: next } : f;
  });
}

export const SEED_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    text: 'Indexed CRISPR_Cas9_Transfection_v3.pdf',
    time: '2m ago',
    type: 'upload',
  },
  {
    id: 'a2',
    text: 'Knowledge graph rebuilt — 12,480 chunks',
    time: '8m ago',
    type: 'train',
  },
  {
    id: 'a3',
    text: 'Lab Assistant published to intranet',
    time: '14m ago',
    type: 'publish',
  },
  {
    id: 'a4',
    text: 'Researcher asked about reagent storage',
    time: '31m ago',
    type: 'chat',
  },
  {
    id: 'a5',
    text: 'Dr. Chen joined Helix Bio workspace',
    time: '2h ago',
    type: 'member',
  },
];

export const PLAYGROUND_RESPONSES: Record<
  string,
  { answer: string; sources: { title: string; type: string; page?: string }[]; confidence: number }
> = {
  default: {
    answer:
      'I can search your protocols, SOPs, publications, and assay data. Ask about a procedure, reagent, instrument, or compliance requirement — I’ll cite the exact source.',
    sources: [
      { title: 'CRISPR_Cas9_Transfection_v3.pdf', type: 'Protocol', page: '1' },
      { title: 'SOP-042_Sample_Handling.docx', type: 'SOP' },
    ],
    confidence: 91,
  },
  crispr: {
    answer:
      '**CRISPR-Cas9 transfection (v3)**\n\n1. Seed HEK293T at 2×10⁵ cells/well in a 6-well plate 24h prior.\n2. Prepare RNP complex: 20 pmol Cas9 + 25 pmol gRNA, incubate 10 min at RT.\n3. Transfect with Lipofectamine CRISPRMAX per manufacturer ratio 1:1.\n4. Change medium after 6h; assay editing efficiency at 48–72h via T7E1 or NGS.\n\n**Critical note:** Keep Cas9 on ice. Avoid freeze-thaw of RNP stocks more than twice.',
    sources: [
      { title: 'CRISPR_Cas9_Transfection_v3.pdf', type: 'Protocol', page: '4–6' },
      { title: 'Instrument_Calibration_Log.md', type: 'Log' },
    ],
    confidence: 98,
  },
  storage: {
    answer:
      'Per **SOP-042 Sample Handling**, reagent X must be stored at **−80°C** in aliquots ≤50 µL. Thaw on ice; do not refreeze more than once. Working stocks may be held at 4°C for up to 7 days if protected from light.\n\nChain-of-custody requires barcode scan into LIMS before and after retrieval.',
    sources: [
      { title: 'SOP-042_Sample_Handling.docx', type: 'SOP', page: '§3.2' },
      { title: 'GLP_Compliance_Manual.pdf', type: 'PDF', page: '22' },
    ],
    confidence: 97,
  },
  assay: {
    answer:
      '**Q2 QC assay summary** (n=48 runs):\n\n- Mean recovery: **98.4%** (spec 95–105%)\n- CV: **3.1%** (spec <5%)\n- 2 runs flagged for drift on Plate Reader #3 — recalibrated 14 Jun\n\nOverall pass rate: **95.8%**. Full series available in `QC_Assay_Results_Q2.csv`.',
    sources: [
      { title: 'QC_Assay_Results_Q2.csv', type: 'CSV' },
      { title: 'Instrument_Calibration_Log.md', type: 'Log' },
    ],
    confidence: 96,
  },
  mrna: {
    answer:
      'From the 2024 *Nature Biotechnology* review: lipid nanoparticle (LNP) delivery remains the dominant clinical modality for mRNA therapeutics. Key advances include ionizable lipid optimization for endosomal escape and cold-chain-independent formulations entering Phase I.\n\nYour internal protocols align with recommended RNase-free workflow in §§4–5 of the paper.',
    sources: [
      { title: 'Nature_Biotech_2024_mRNA.pdf', type: 'Paper', page: '112–118' },
      { title: 'CRISPR_Cas9_Transfection_v3.pdf', type: 'Protocol' },
    ],
    confidence: 94,
  },
  glp: {
    answer:
      'GLP compliance for this workspace requires: documented SOPs, instrument calibration logs, sample chain-of-custody, and audit-ready electronic records. LabAgent retains query + source provenance for every answer — suitable for inspection trails.\n\nEnable **Audit Logs** on Enterprise for immutable export.',
    sources: [
      { title: 'GLP_Compliance_Manual.pdf', type: 'PDF', page: '1–8' },
      { title: 'SOP-042_Sample_Handling.docx', type: 'SOP' },
    ],
    confidence: 95,
  },
};

export function matchResponse(query: string) {
  const q = query.toLowerCase();
  if (q.includes('crispr') || q.includes('cas9') || q.includes('transfect'))
    return PLAYGROUND_RESPONSES.crispr;
  if (q.includes('stor') || q.includes('reagent') || q.includes('temperature'))
    return PLAYGROUND_RESPONSES.storage;
  if (q.includes('assay') || q.includes('qc') || q.includes('result'))
    return PLAYGROUND_RESPONSES.assay;
  if (q.includes('mrna') || q.includes('lnp') || q.includes('nature'))
    return PLAYGROUND_RESPONSES.mrna;
  if (q.includes('glp') || q.includes('compliance') || q.includes('audit'))
    return PLAYGROUND_RESPONSES.glp;
  return PLAYGROUND_RESPONSES.default;
}

export const ANALYTICS = {
  queries: 18420,
  accuracy: 96.4,
  activeUsers: 128,
  sourcesUsed: 842,
  widgetOpens: 3210,
  messagesSeries: [
    { day: 'Jan', queries: 1420 },
    { day: 'Feb', queries: 1680 },
    { day: 'Mar', queries: 1950 },
    { day: 'Apr', queries: 2110 },
    { day: 'May', queries: 2380 },
    { day: 'Jun', queries: 2560 },
    { day: 'Jul', queries: 2740 },
    { day: 'Aug', queries: 2920 },
  ],
  weeklySeries: [
    { day: 'Mon', queries: 1100 },
    { day: 'Tue', queries: 1450 },
    { day: 'Wed', queries: 1680 },
    { day: 'Thu', queries: 1520 },
    { day: 'Fri', queries: 2100 },
    { day: 'Sat', queries: 780 },
    { day: 'Sun', queries: 520 },
  ],
  topQuestions: [
    { q: 'CRISPR transfection protocol steps?', count: 412 },
    { q: 'Reagent X storage conditions?', count: 287 },
    { q: 'Q2 assay QC summary?', count: 198 },
    { q: 'mRNA LNP delivery review?', count: 156 },
    { q: 'GLP audit trail requirements?', count: 112 },
  ],
};

export const FAQS = [
  {
    q: 'How is this different from ChatGPT?',
    a: 'LabAgent answers only from your lab’s documents — protocols, SOPs, papers, and data — with citations. Nothing leaves your knowledge boundary unless you choose.',
  },
  {
    q: 'What file types are supported?',
    a: 'PDF, DOCX, TXT, Markdown, CSV, research papers, and structured protocols. We preserve scientific formatting, tables, and section hierarchy.',
  },
  {
    q: 'Can it cite sources?',
    a: 'Every answer includes source titles, document type, and page or section references so researchers can verify instantly.',
  },
  {
    q: 'Is our data private?',
    a: 'Yes. Datasets are isolated per workspace. Enterprise adds SSO, private routing, audit logs, and VPC options. We never train foundation models on your content.',
  },
  {
    q: 'How long does indexing take?',
    a: 'Most protocol libraries are searchable in under two minutes. Large publication archives show live progress as chunks become available.',
  },
];
