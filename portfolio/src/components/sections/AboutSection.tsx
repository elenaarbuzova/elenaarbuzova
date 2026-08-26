import { useLanguage } from '@/i18n/LanguageContext';

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-foreground text-background/75">
      <div className="container mx-auto px-5 py-16 sm:px-6 sm:py-24 md:py-32">
        <p className="w-full text-pretty text-center text-[clamp(1.35rem,5.2vw,3.35rem)] font-medium tracking-tight leading-[1.45]">
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
