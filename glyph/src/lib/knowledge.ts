import type { KnowledgeFile } from '@/lib/data';
import { PLAYGROUND_RESPONSES } from '@/lib/data';

export type KnowledgeAnswer = {
  answer: string;
  sources: { title: string; type: string; page?: string }[];
  confidence: number;
};

const TYPE_LABEL: Record<KnowledgeFile['type'], string> = {
  pdf: 'PDF',
  docx: 'DOCX',
  txt: 'TXT',
  md: 'MD',
  csv: 'CSV',
  protocol: 'Protocol',
  paper: 'Paper',
};

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((t) => t.length > 2);
}

function scoreFile(file: KnowledgeFile, queryTokens: string[]): number {
  const hay = tokens(
    [file.name, file.folder, file.project, ...(file.tags ?? []), file.excerpt ?? ''].join(
      ' ',
    ),
  );
  if (!queryTokens.length) return 0;
  let score = 0;
  for (const t of queryTokens) {
    if (hay.includes(t)) score += 3;
    else if (hay.some((h) => h.includes(t) || t.includes(h))) score += 1;
  }
  if (file.activeInChatbot) score += 1;
  if (file.excerpt) score += 0.5;
  return score;
}

function activeFiles(files: KnowledgeFile[]) {
  return files.filter((f) => f.status === 'ready');
}

function cite(file: KnowledgeFile, page?: string) {
  return {
    title: file.name,
    type: TYPE_LABEL[file.type] ?? 'Doc',
    page,
  };
}

function snippet(excerpt: string, max = 220) {
  const clean = excerpt.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

/** Prefer answers grounded in the user's indexed knowledge files. */
export function answerFromKnowledge(
  query: string,
  files: KnowledgeFile[],
): KnowledgeAnswer {
  const ready = activeFiles(files);
  const q = query.toLowerCase();
  const qTokens = tokens(query);

  if (!ready.length) {
    return {
      answer:
        'No documents indexed yet. Upload files in **Knowledge**, then ask again.',
      sources: [],
      confidence: 40,
    };
  }

  const ranked = [...ready]
    .map((f) => ({ file: f, score: scoreFile(f, qTokens) }))
    .sort((a, b) => b.score - a.score);

  const top = ranked.filter((r) => r.score > 0).slice(0, 3);
  const byName = (partial: string) =>
    ready.find((f) => f.name.toLowerCase().includes(partial.toLowerCase()));

  // Keyword intents remapped onto real KB files when present
  if (q.includes('crispr') || q.includes('cas9') || q.includes('transfect')) {
    const primary =
      top[0]?.file ??
      byName('crispr') ??
      byName('cas9') ??
      ranked[0]?.file;
    const secondary =
      byName('calibration') ??
      ranked.find((r) => r.file.id !== primary?.id)?.file;
    if (primary) {
      const base = PLAYGROUND_RESPONSES.crispr;
      return {
        answer: primary.excerpt
          ? `${base.answer}\n\nFrom your indexed **${primary.name}**:\n> ${snippet(primary.excerpt)}`
          : base.answer,
        sources: [cite(primary, '4–6'), ...(secondary ? [cite(secondary)] : [])],
        confidence: Math.min(99, 88 + Math.round((top[0]?.score ?? 2) * 2)),
      };
    }
  }

  if (q.includes('stor') || q.includes('reagent') || q.includes('temperature')) {
    const primary =
      top[0]?.file ?? byName('sop') ?? byName('sample') ?? ranked[0]?.file;
    const secondary = byName('glp') ?? ranked.find((r) => r.file.id !== primary?.id)?.file;
    if (primary) {
      const base = PLAYGROUND_RESPONSES.storage;
      return {
        answer: primary.excerpt
          ? `${base.answer}\n\nExcerpt from **${primary.name}**:\n> ${snippet(primary.excerpt)}`
          : base.answer,
        sources: [cite(primary, '§3.2'), ...(secondary ? [cite(secondary)] : [])],
        confidence: 96,
      };
    }
  }

  if (q.includes('assay') || q.includes('qc') || q.includes('result')) {
    const primary = top[0]?.file ?? byName('qc') ?? byName('assay') ?? ranked[0]?.file;
    if (primary) {
      return {
        answer: primary.excerpt
          ? `From **${primary.name}** in your knowledge base:\n\n${snippet(primary.excerpt, 360)}`
          : PLAYGROUND_RESPONSES.assay.answer,
        sources: [cite(primary)],
        confidence: 94,
      };
    }
  }

  if (q.includes('mrna') || q.includes('lnp') || q.includes('nature')) {
    const primary = top[0]?.file ?? byName('mrna') ?? byName('nature') ?? ranked[0]?.file;
    if (primary) {
      return {
        answer: primary.excerpt
          ? `${PLAYGROUND_RESPONSES.mrna.answer}\n\nIndexed passage (**${primary.name}**):\n> ${snippet(primary.excerpt)}`
          : PLAYGROUND_RESPONSES.mrna.answer,
        sources: [cite(primary, '112–118')],
        confidence: 93,
      };
    }
  }

  if (q.includes('glp') || q.includes('compliance') || q.includes('audit')) {
    const primary = top[0]?.file ?? byName('glp') ?? byName('compliance') ?? ranked[0]?.file;
    if (primary) {
      return {
        answer: PLAYGROUND_RESPONSES.glp.answer,
        sources: [cite(primary, '1–8')],
        confidence: 95,
      };
    }
  }

  // Strong lexical hit on uploaded docs → answer from those files
  if (top.length && top[0].score >= 3) {
    const hits = top.map((t) => t.file);
    const lead = hits[0];
    const excerptBit = lead.excerpt
      ? `\n\nRelevant passage from **${lead.name}**:\n> ${snippet(lead.excerpt, 280)}`
      : `\n\nI matched this to **${lead.name}**${lead.tags?.length ? ` (tags: ${lead.tags.join(', ')})` : ''} in your knowledge base. Ask a more specific question to pull a tighter citation.`;

    return {
      answer: `Based on your indexed sources (${hits.map((h) => h.name).join(', ')}):${excerptBit}`,
      sources: hits.map((h, i) => cite(h, i === 0 ? '1' : undefined)),
      confidence: Math.min(97, 80 + top[0].score * 3),
    };
  }

  // Default: still cite real KB files, not phantom titles
  const defaults = ranked.slice(0, 2).map((r) => r.file);
  return {
    answer: `Searching **${ready.length}** document${ready.length === 1 ? '' : 's'} in this workspace (e.g. ${defaults.map((d) => d.name).join(', ')}). Ask about a procedure, reagent, or SOP — answers list the source.`,
    sources: defaults.map((d) => cite(d)),
    confidence: 86,
  };
}
