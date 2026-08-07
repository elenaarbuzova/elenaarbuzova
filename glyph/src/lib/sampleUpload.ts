import type { KnowledgeFile } from '@/lib/data';

/** Instant sample protocol — no folder picker (demo / prototype) */
export function createSampleProtocolFile(opts?: {
  project?: string;
  folder?: string;
  source?: KnowledgeFile['source'];
}): KnowledgeFile {
  const now = Date.now();
  return {
    id: `up-${now}`,
    name: 'CRISPR_Cas9_Transfection_v3.pdf',
    type: 'protocol',
    status: 'processing',
    size: '1.8 MB',
    sizeBytes: 1_800_000,
    uploadedAt: 'Just now',
    addedAt: now,
    folder: opts?.folder ?? 'Protocols',
    project: opts?.project ?? 'Genetics Archive',
    tags: ['CRISPR', 'Protocol'],
    activeInChatbot: true,
    source: opts?.source ?? 'upload',
    excerpt:
      'CRISPR-Cas9 transfection v3: Seed HEK293T at 2×10⁵ cells/well. Prepare RNP: 20 pmol Cas9 + 25 pmol gRNA, 10 min RT. Transfect with Lipofectamine CRISPRMAX 1:1. Store aliquots at −80°C.',
  };
}
