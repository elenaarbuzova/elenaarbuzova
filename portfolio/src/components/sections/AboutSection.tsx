import { TextBoxReveal } from '@/components/v1/skiper70';
import { useLanguage } from '@/i18n/LanguageContext';

export function AboutSection() {
  const { t, lang } = useLanguage();
  const [first, second, third] = t.about.lines;

  return (
    <section id="about" className="bg-foreground text-background">
      <TextBoxReveal
        key={lang}
        highlight={t.about.highlight}
        highlightTextClass="!text-foreground"
        highlightBgClass="!bg-background"
      >
        {first}
        <br />
        {second}
        <br />
        {third}
      </TextBoxReveal>
    </section>
  );
}
