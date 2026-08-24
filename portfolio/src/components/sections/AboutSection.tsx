import { useLanguage } from '@/i18n/LanguageContext';

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      className="bg-foreground text-background/75 selection:bg-background selection:text-foreground"
    >
      <div className="container mx-auto max-w-5xl px-6 py-24 md:py-32">
        <p className="text-pretty text-[clamp(1.7rem,4.1vw,3.35rem)] font-medium tracking-tight leading-[1.45] selection:bg-background selection:text-foreground">
          {t.about.lines.join(' ')}
        </p>
      </div>
    </section>
  );
}
