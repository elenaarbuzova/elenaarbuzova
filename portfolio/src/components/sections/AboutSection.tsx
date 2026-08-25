import { useLanguage } from '@/i18n/LanguageContext';

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-foreground text-background/75">
      <div className="container mx-auto px-6 py-24 md:py-32">
        {/* Same grid as hero: text spans left column through photo column */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_min(42vw,440px)] lg:gap-10">
          <p className="col-span-1 text-pretty text-[clamp(1.7rem,4.1vw,3.35rem)] font-medium tracking-tight leading-[1.45] lg:col-span-2">
            {t.about.lines.join(' ')}
          </p>
        </div>
      </div>
    </section>
  );
}
