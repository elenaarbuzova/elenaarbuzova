import { Skiper44, TOOLS } from '@/components/v1/skiper44';
import { useLanguage } from '@/i18n/LanguageContext';

export function ToolsSection() {
  const { t } = useLanguage();

  return (
    <section id="tools" aria-label={t.tools.label} className="relative z-0">
      <Skiper44 label={t.tools.label} items={[...TOOLS]} />
    </section>
  );
}
