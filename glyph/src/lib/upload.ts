import type { KnowledgeFile } from '@/lib/data';

const EXT_TYPE: Record<string, KnowledgeFile['type']> = {
  pdf: 'pdf',
  docx: 'docx',
  doc: 'docx',
  txt: 'txt',
  md: 'md',
  markdown: 'md',
  csv: 'csv',
  protocol: 'protocol',
};

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function typeFromName(name: string): KnowledgeFile['type'] {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (name.toLowerCase().includes('protocol')) return 'protocol';
  return EXT_TYPE[ext] ?? 'pdf';
}

export async function readFileExcerpt(file: File): Promise<string | undefined> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (['txt', 'md', 'markdown', 'csv', 'json', 'log'].includes(ext)) {
    const text = await file.text();
    return text.slice(0, 4000);
  }
  // Binary office/PDF — keep a searchable stub so chat can still ground on the filename
  return `Indexed document “${file.name}”. Ask questions about procedures, reagents, storage, or compliance covered in this file.`;
}

export async function knowledgeFileFromUpload(
  file: File,
  opts: {
    project?: string;
    source?: KnowledgeFile['source'];
    folder?: string;
  } = {},
): Promise<KnowledgeFile> {
  const excerpt = await readFileExcerpt(file);
  const type = typeFromName(file.name);
  return {
    id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: file.name,
    type,
    status: 'processing',
    size: formatBytes(file.size || 1200),
    sizeBytes: file.size || 1_200_000,
    uploadedAt: 'Just now',
    addedAt: Date.now(),
    folder: opts.folder ?? (type === 'protocol' ? 'Protocols' : 'Uploads'),
    project: opts.project,
    tags: ['Uploaded'],
    source: opts.source ?? 'upload',
    activeInChatbot: false,
    excerpt,
  };
}
