import { useLanguage } from '@/i18n/LanguageContext';

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-foreground text-background/75">
      <div className="container mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
        <p className="mx-auto max-w-4xl text-pretty text-[clamp(1.7rem,4.1vw,3.35rem)] font-medium tracking-tight leading-[1.45]">
          {t.about.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
