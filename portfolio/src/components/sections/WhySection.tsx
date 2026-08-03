import { RevealText, FadeIn } from '../ui/animations';
import { useLanguage } from '@/i18n/LanguageContext';

export function WhySection() {
  const { t } = useLanguage();
  const reasons = t.why.reasons.map((reason, i) => ({
    num: String(i + 1).padStart(2, '0'),
    ...reason,
  }));

  return (
    <section className="py-40 bg-muted/30">
      <div className="container mx-auto px-6">
        <RevealText>
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-24 flex items-center gap-4 text-muted-foreground">
            <span className="w-8 h-[1px] bg-border"></span>
            {t.why.title}
          </h2>
        </RevealText>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {reasons.map((reason, i) => (
            <FadeIn
              key={reason.num}
              delay={i * 0.1}
              className="group relative z-0 border border-border/40 p-12 lg:p-16 bg-transparent transition-all duration-500 ease-out hover:z-10 hover:bg-foreground hover:text-background hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
            >
              <div className="text-sm font-mono tracking-widest text-muted-foreground mb-16 transition-colors duration-500 group-hover:text-background/55">
                {reason.num} –
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-6">
                {reason.title}
              </h3>
              <p className="text-lg font-light leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-background/75">
                {reason.desc}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
