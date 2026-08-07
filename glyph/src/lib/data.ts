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
  /** Indexed text excerpt used for grounded answers in the prototype */
  excerpt?: string;
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
    description: 'One workspace. Enough to try LabAgent on a real protocol library.',
    features: [
      '1 workspace',
      '20 documents',
      '1 assistant',
      'Protocol search',
      'Source citations',
    ],
    limits: { chatbots: 1, documents: 20, pages: 20, chats: 1000, workspaces: 1 },
    highlighted: false,
  },
  research: {
    id: 'research' as const,
    name: 'Research',
    price: 49,
    annualPrice: 39,
    description: 'For labs that keep protocols and papers in one place.',
    features: [
      'Unlimited documents',
      'Unlimited workspaces',
      'Embeddable widget',
      'Usage analytics',
      'Team members',
      'Source citations',
      'Remove LabAgent branding',
    ],
    limits: { chatbots: 10, documents: 9999, pages: 99999, chats: 50000, workspaces: 9999 },
    highlighted: true,
  },
  enterprise: {
    id: 'enterprise' as const,
    name: 'Enterprise',
    price: null as number | null,
    annualPrice: null as number | null,
    description: 'SSO, audit logs, and private routing for regulated teams.',
    features: [
      'SSO & SCIM',
      'Private model routing',
      'Audit logs',
      'API & VPC options',
      'SOC 2 & GDPR',
      'Dedicated support',
    ],
    limits: { chatbots: 9999, documents: 9999, pages: 999999, chats: 999999, workspaces: 9999 },
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
  greeting:
    'Hello. Ask about your protocols, SOPs, publications, or laboratory documentation. I answer using only the documents your organization has uploaded.',
  suggestions: [
    'How should CRISPR samples be stored?',
    'Find SOP-014',
    'Summarize this publication',
    'Where is the PCR preparation protocol?',
  ],
  darkMode: false,
  showBranding: true,
  showCitations: true,
  showConfidence: false,
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
    excerpt:
      'CRISPR-Cas9 transfection v3: Seed HEK293T at 2×10⁵ cells/well. Prepare RNP: 20 pmol Cas9 + 25 pmol gRNA, 10 min RT. Transfect with Lipofectamine CRISPRMAX 1:1. Change medium after 6h; assay at 48–72h. Keep Cas9 on ice.',
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
    excerpt:
      'SOP-042 §3.2: Store reagent X at −80°C in aliquots ≤50 µL. Thaw on ice; do not refreeze more than once. Working stocks at 4°C up to 7 days protected from light. Barcode into LIMS before and after retrieval.',
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
    excerpt:
      'LNP delivery remains the dominant clinical modality for mRNA therapeutics. Ionizable lipid optimization improves endosomal escape; cold-chain-independent formulations enter Phase I.',
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
    excerpt:
      'Q2 QC: mean recovery 98.4%, CV 3.1%, pass rate 95.8%. Two runs flagged on Plate Reader #3.',
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
    excerpt:
      'Plate Reader #3 recalibrated 14 Jun after drift. Pipettes due next quarter. Freezer −80 alarms cleared.',
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
    excerpt:
      'GLP requires documented SOPs, instrument calibration logs, sample chain-of-custody, and audit-ready electronic records.',
  },
];

export const PROJECT_COLORS: Record<string, string> = {
  'Oncology R&D':
    'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-400/25',
  'Clinical PCR Trials':
    'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:ring-teal-400/25',
  'Genetics Archive':
    'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/25',
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
    let next = f;
    if (f.project) {
      const renamed = PROJECT_RENAME[f.project];
      if (renamed) next = { ...next, project: renamed };
    }
    if (!next.excerpt) {
      const seed = SEED_FILES.find((s) => s.id === f.id || s.name === f.name);
      if (seed?.excerpt) next = { ...next, excerpt: seed.excerpt };
    }
    return next;
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
      'I search the documents in this workspace. Ask about a procedure, reagent, instrument, or compliance requirement — answers point back to the source.',
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
      'GLP work in this workspace needs documented SOPs, calibration logs, sample chain-of-custody, and records you can hand to QA. Each answer keeps the query and cited sources.\n\nEnterprise adds exportable audit logs.',
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
    { day: 'Mon', queries: 1100, responses: 860 },
    { day: 'Tue', queries: 1450, responses: 1180 },
    { day: 'Wed', queries: 1680, responses: 1420 },
    { day: 'Thu', queries: 1520, responses: 980 },
    { day: 'Fri', queries: 2100, responses: 1760 },
    { day: 'Sat', queries: 780, responses: 540 },
    { day: 'Sun', queries: 520, responses: 410 },
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
    a: 'LabAgent answers only from the documents you upload — protocols, SOPs, papers, and data. Each answer shows the source. Your files stay in your workspace.',
  },
  {
    q: 'What file types are supported?',
    a: 'PDF, DOCX, TXT, Markdown, CSV, papers, and structured protocols. Sections and tables are kept where possible.',
  },
  {
    q: 'Can it cite sources?',
    a: 'Yes. Answers include the document title, type, and page or section so you can open the original.',
  },
  {
    q: 'Is our data private?',
    a: 'Workspaces are isolated. We do not train foundation models on your content. Enterprise adds SSO, private routing, audit logs, and VPC options.',
  },
  {
    q: 'How long does indexing take?',
    a: 'Most protocol libraries are searchable within a few minutes. Larger archives show progress as files finish indexing.',
  },
];
