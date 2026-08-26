import { useLanguage } from '@/i18n/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border/20 py-6 sm:py-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="container mx-auto flex flex-col items-start gap-3 px-5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:text-xs sm:tracking-widest">
        <span>Elena Arbuzova</span>

        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-foreground"
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
