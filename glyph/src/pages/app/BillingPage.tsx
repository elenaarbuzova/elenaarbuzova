import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { PLANS, type PlanId } from '@/lib/data';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

export function BillingPage() {
  const { plan, setPlan } = useApp();

  return (
      <div className="space-y-12">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Plan</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Current plan:{' '}
            <span className="text-accent">{PLANS[plan].name}</span>
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {(Object.keys(PLANS) as PlanId[]).map((id) => {
            const p = PLANS[id];
            const active = plan === id;
            return (
              <div
                key={id}
                className={cn(
                  'flex flex-col rounded-2xl border p-8 transition-all duration-300',
                  active
                    ? 'border-accent/40 bg-accent/[0.05]'
                    : 'border-black/[0.06] hover:border-black/15',
                )}
              >
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">{p.description}</p>
                <p className="mt-6 font-display text-3xl font-semibold">
                  {p.price === null ? 'Custom' : `$${p.price}`}
                  {p.price !== null ? (
                    <span className="text-sm font-normal text-zinc-500">/mo</span>
                  ) : null}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-zinc-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={active ? 'secondary' : p.highlighted ? 'accent' : 'secondary'}
                  disabled={active}
                  onClick={() => {
                    if (id === 'enterprise') {
                      toast.message('Enterprise sales will reach out');
                      return;
                    }
                    setPlan(id);
                    toast.success(`Switched to ${p.name}`);
                  }}
                >
                  {active ? 'Current plan' : id === 'enterprise' ? 'Contact sales' : 'Select'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
  );
}
