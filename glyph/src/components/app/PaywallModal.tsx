import { Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { PLANS, type PlanId } from '@/lib/data';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

export function PaywallModal() {
  const { showPaywall, paywallReason, closePaywall, setPlan, plan } = useApp();

  const upgrade = (next: PlanId) => {
    setPlan(next);
    toast.success(`Upgraded to ${PLANS[next].name}`);
  };

  return (
    <Modal open={showPaywall} onClose={closePaywall} title="Research plan" wide>
      <p className="mb-6 text-sm leading-relaxed text-zinc-500">
        {paywallReason ||
          'Starter includes 1 workspace and 20 documents. Research raises those limits and adds embed, analytics, and team members.'}
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {(['research', 'enterprise'] as const).map((id) => {
          const p = PLANS[id];
          return (
            <div
              key={id}
              className={cn(
                'rounded-xl border p-5',
                id === 'research'
                  ? 'border-accent/30 bg-accent/[0.05] dark:border-accent/25 dark:bg-accent/[0.08]'
                  : 'border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04]',
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-display text-lg font-semibold text-black dark:text-zinc-50">
                  {p.name}
                </h4>
                {id === 'research' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-white">
                    <Sparkles className="h-3 w-3" /> Popular
                  </span>
                ) : null}
              </div>
              <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                {p.description}
              </p>
              <p className="mb-4 font-display text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
                {p.price === null ? 'Custom' : `$${p.price}`}
                {p.price !== null ? (
                  <span className="text-sm font-normal text-zinc-500"> /mo</span>
                ) : null}
              </p>
              <ul className="mb-5 space-y-2">
                {p.features.slice(0, 4).map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-black dark:text-zinc-200"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={id === 'research' ? 'accent' : 'secondary'}
                className="w-full"
                onClick={() =>
                  id === 'enterprise'
                    ? toast.message('Enterprise sales will reach out')
                    : upgrade(id)
                }
                disabled={plan === id}
              >
                {plan === id
                  ? 'Current plan'
                  : id === 'enterprise'
                    ? 'Contact sales'
                    : 'Upgrade'}
              </Button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
