import { RevealText, FadeIn } from '../ui/animations';
import { useLanguage } from '@/i18n/LanguageContext';

export function ProcessSection() {
  const { t } = useLanguage();
  const steps = t.process.steps.map((step, i) => ({
    num: String(i + 1).padStart(2, '0'),
    ...step,
  }));

  return (
    <section id="process" className="py-40 bg-background text-foreground">
      <div className="container mx-auto px-6">
        <RevealText>
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-24 text-muted-foreground flex items-center gap-4">
            <span className="w-8 h-[1px] bg-border"></span>
            {t.process.title}
          </h2>
        </RevealText>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {steps.map((step, i) => (
            <div key={step.num} className="border-t border-border/50 pt-8">
              <FadeIn delay={i * 0.1}>
                <div className="text-sm font-mono tracking-widest text-muted-foreground mb-6">
                  {step.num}
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {step.desc}
                </p>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
