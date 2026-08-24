import { SkiperTextRevealH } from '@/components/v1/skiper72';
import { useLanguage } from '@/i18n/LanguageContext';

export function AboutSection() {
  const { t, lang } = useLanguage();

  return (
    <section id="about" className="bg-background text-foreground">
      <SkiperTextRevealH key={lang}>
        {t.about.lines.join(' ')}
      </SkiperTextRevealH>
    </section>
  );
}
