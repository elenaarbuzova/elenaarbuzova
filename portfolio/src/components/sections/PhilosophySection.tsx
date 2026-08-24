import { RevealText } from '../ui/animations';
import { useLanguage } from '@/i18n/LanguageContext';

export function PhilosophySection() {
  const { t } = useLanguage();

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-40 container mx-auto px-6 relative">
      <div className="absolute top-20 left-6 text-9xl text-muted/30 font-serif leading-none select-none">
        "
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <RevealText>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-8">
            {t.philosophy.line1}
          </h2>
        </RevealText>
        <RevealText delay={0.2}>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-muted-foreground">
            {t.philosophy.line2}
          </h2>
        </RevealText>
      </div>
    </section>
  );
}
