import { FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/lib/store';

const PREVIEWS: Record<string, string> = {
  'Protocol_RNA_Extraction.pdf':
    'Lyse cells on ice with TRIzol. Phase-separate with chloroform. Precipitate RNA with isopropanol and wash twice in 75% ethanol. Keep samples RNase-free throughout.',
  'CRISPR_Cas9_Transfection_v3.pdf':
    'Seed HEK293T at 2×10⁵ cells/well 24h prior. Assemble RNP on ice (20 pmol Cas9 + 25 pmol gRNA). Transfect with CRISPRMAX. Assay editing at 48–72h.',
  'SOP-042_Sample_Handling.docx':
    'Store aliquots at −80°C. Thaw on ice once. Working stock at 4°C ≤7 days. Scan barcode into LIMS before and after retrieval.',
  'Nature_Biotech_2024_mRNA.pdf':
    'LNP delivery remains the dominant clinical modality. Ionizable lipid optimization and cold-chain-independent formulations are highlighted advances.',
  'company_policy.pdf':
    'Company policy covers access control, data retention, and approval workflows for research documentation and shared lab resources.',
  default:
    'Referenced section from the source document. Critical notes, reagents, and safety callouts are preserved from the original protocol.',
};

export function SourcePreviewModal({
  open,
  onClose,
  title,
  page,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  page?: string;
}) {
  const { files } = useApp();
  const file = files.find(
    (f) => f.name.toLowerCase() === title.toLowerCase(),
  );
  const body = PREVIEWS[title] ?? PREVIEWS.default;

  return (
    <Modal open={open} onClose={onClose} title={title} wide>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.06] bg-zinc-50 px-2 py-1">
            <FileText className="h-3.5 w-3.5 text-accent" />
            {file?.type?.toUpperCase() ?? 'PDF'}
          </span>
          {page ? (
            <span className="rounded-lg border border-accent/20 bg-accent/5 px-2 py-1 text-accent">
              Page {page}
            </span>
          ) : null}
          {file?.folder ? (
            <span className="rounded-lg border border-black/[0.06] px-2 py-1">
              {file.folder}
            </span>
          ) : null}
        </div>

        <div className="relative overflow-hidden rounded-xl border border-black/[0.06] bg-zinc-50 p-4">
          <div className="absolute inset-x-3 top-3 rounded-md bg-[#ff4d2e]/10 px-3 py-2 ring-1 ring-[#ff4d2e]/25">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#ff4d2e]">
              Highlighted section{page ? ` · p. ${page}` : ''}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-800">{body}</p>
          </div>
          <div className="pointer-events-none select-none pt-28 text-[12px] leading-relaxed text-zinc-300">
            <p>
              Surrounding protocol context remains available for navigation. Steps before and after
              the cited section stay indexed in the knowledge graph for follow-up questions.
            </p>
            <p className="mt-3">
              Researchers can jump from citation chips back into the full source without leaving
              the assistant workflow.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
