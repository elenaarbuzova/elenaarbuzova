import { motion } from 'framer-motion';
import { FileText, Sparkles } from 'lucide-react';

export function HeroDashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md perspective-[1200px]"
    >
      <div className="absolute -inset-8 rounded-full bg-accent/10 blur-3xl" />
      <div className="glass relative overflow-hidden rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/15 text-accent">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-medium">Lab Assistant</span>
          </div>
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            Live
          </span>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-3">
            <p className="text-xs text-zinc-500">Researcher</p>
            <p className="mt-1 text-sm text-zinc-200">
              Walk me through the CRISPR transfection protocol.
            </p>
          </div>

          <div className="rounded-xl border border-accent/15 bg-accent/[0.04] px-3.5 py-3">
            <p className="text-xs text-accent">LabAgent</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-200">
              Seed HEK293T at 2×10⁵ cells/well… Prepare RNP: 20 pmol Cas9 + 25 pmol gRNA…
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[10px] text-zinc-400">
                <FileText className="h-3 w-3 text-accent" />
                CRISPR_v3.pdf · p.4
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { label: 'Accuracy', value: '98%' },
              { label: 'Sources', value: '2' },
              { label: 'Latency', value: '1.2s' },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-2.5 py-2.5 text-center"
              >
                <p className="font-mono text-sm text-ink">{m.value}</p>
                <p className="mt-0.5 text-[10px] tracking-wide text-zinc-500">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
