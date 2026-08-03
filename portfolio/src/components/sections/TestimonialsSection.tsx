import { FadeIn } from '../ui/animations';
import { useLanguage } from '@/i18n/LanguageContext';

export function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section id="testimonials" className="py-40 bg-foreground text-background relative overflow-hidden">
      <div className="absolute top-20 right-20 text-[20rem] text-background/5 font-serif leading-none select-none pointer-events-none">
        "
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10 space-y-40">
        <FadeIn>
          <div className="space-y-8">
            <p className="text-2xl md:text-4xl font-light leading-snug tracking-wide">
              {t.testimonials.t1}
            </p>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-widest uppercase">Daniil Sviridov</span>
              <span className="text-xs text-background/50 font-medium tracking-widest uppercase mt-1">
                {t.testimonials.t1Role}
              </span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="space-y-8">
            <p className="text-2xl md:text-4xl font-light leading-snug tracking-wide">
              {t.testimonials.t2}
            </p>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-widest uppercase">Katharine Lanskaya</span>
              <span className="text-xs text-background/50 font-medium tracking-widest uppercase mt-1">
                {t.testimonials.t2Role}
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
