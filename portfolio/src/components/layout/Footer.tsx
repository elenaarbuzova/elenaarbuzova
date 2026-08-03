import { useLanguage } from '@/i18n/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border/20 py-8">
      <div className="container mx-auto px-6 flex justify-between items-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
        <span>Elena Arbuzova</span>

        <button
          type="button"
          onClick={scrollToTop}
          className="hover:text-foreground transition-colors inline-flex items-center gap-2"
          aria-label={t.footer.backToTop}
        >
          {t.footer.backToTop}
          <span aria-hidden="true">↑</span>
        </button>

        <span>
          © {new Date().getFullYear()} · {t.footer.rights}
        </span>
      </div>
    </footer>
  );
}
