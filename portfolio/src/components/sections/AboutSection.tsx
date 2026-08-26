import { useLanguage } from '@/i18n/LanguageContext';

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="border-y border-border/40 bg-background">
      <div className="container mx-auto px-5 py-16 sm:px-6 sm:py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:gap-16 lg:gap-24">
          <h2 className="flex items-center gap-4 self-start text-sm font-semibold uppercase tracking-widest text-foreground">
            <span className="h-px w-8 bg-foreground" aria-hidden />
            {t.nav.about}
          </h2>

          <div className="max-w-2xl space-y-6 md:space-y-8">
            {t.about.lines.map((line, index) => (
              <p
                key={line}
                className={
                  index === 0
                    ? 'text-pretty text-2xl font-medium tracking-tight text-foreground sm:text-3xl md:text-4xl md:leading-[1.2]'
                    : 'text-pretty text-base leading-relaxed tracking-wide text-foreground/70 sm:text-lg md:text-xl md:leading-relaxed'
                }
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
