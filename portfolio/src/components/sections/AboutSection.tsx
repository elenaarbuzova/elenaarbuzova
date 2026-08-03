import { RevealText } from '../ui/animations';
import { useLanguage } from '@/i18n/LanguageContext';

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-40 bg-foreground text-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-24">
          <RevealText>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-tight mb-4">
              {t.about.line1}
            </h2>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-background/50 leading-tight">
              {t.about.line2}
            </h2>
          </RevealText>
        </div>

        <div className="space-y-6 text-xl md:text-2xl font-light tracking-wide text-background/80 max-w-2xl">
          <RevealText delay={0.2}>
            <p>{t.about.point1}</p>
          </RevealText>
          <RevealText delay={0.3}>
            <p>{t.about.point2}</p>
          </RevealText>
          <RevealText delay={0.4}>
            <p>{t.about.point3}</p>
          </RevealText>
        </div>
      </div>
    </section>
  );
}
