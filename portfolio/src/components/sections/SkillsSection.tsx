import { RevealText, FadeIn } from '../ui/animations';
import { useLanguage } from '@/i18n/LanguageContext';

export function SkillsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-40 container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
        <div>
          <RevealText>
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-12 flex items-center gap-4 text-muted-foreground">
              <span className="w-8 h-[1px] bg-border"></span>
              {t.skills.design}
            </h3>
          </RevealText>
          <div className="flex flex-col">
            {t.skills.designList.map((skill, i) => (
              <FadeIn key={skill} delay={i * 0.05}>
                <div className="py-6 border-b border-border/40 text-xl md:text-2xl font-medium tracking-tight">
                  {skill}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <div>
          <RevealText>
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-12 flex items-center gap-4 text-muted-foreground">
              <span className="w-8 h-[1px] bg-border"></span>
              {t.skills.testing}
            </h3>
          </RevealText>
          <div className="flex flex-col">
            {t.skills.testingList.map((skill, i) => (
              <FadeIn key={skill} delay={i * 0.05}>
                <div className="py-6 border-b border-border/40 text-xl md:text-2xl font-medium tracking-tight">
                  {skill}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
