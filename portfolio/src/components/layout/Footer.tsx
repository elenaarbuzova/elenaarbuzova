import { useLanguage } from '@/i18n/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border/20 py-6 sm:py-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="container mx-auto grid grid-cols-1 items-center gap-3 px-5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:grid-cols-3 sm:gap-4 sm:px-6 sm:text-xs sm:tracking-widest">
        <span className="justify-self-start">Elena Arbuzova</span>

        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex min-h-11 items-center justify-center gap-2 justify-self-center transition-colors hover:text-foreground"
          aria-label={t.footer.backToTop}
        >
          {t.footer.backToTop}
          <span aria-hidden="true">↑</span>
        </button>

        <span className="justify-self-start sm:justify-self-end">
          © {new Date().getFullYear()} · {t.footer.rights}
        </span>
      </div>
    </footer>
  );
}
