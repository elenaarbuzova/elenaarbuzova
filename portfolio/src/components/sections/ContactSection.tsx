import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { RevealText, FadeIn } from '../ui/animations';
import { useLanguage } from '@/i18n/LanguageContext';

const EMAIL = 'elenaarbuzovvaa@gmail.com';

export function ContactSection() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = EMAIL;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section id="contact" className="container mx-auto px-5 py-20 text-center sm:px-6 sm:py-32 md:py-60">
      <RevealText>
        <h2 className="mb-8 text-[2.35rem] font-bold leading-[0.95] tracking-tighter sm:mb-12 sm:text-6xl md:text-8xl lg:text-9xl">
          {t.contact.line1}
          <br />
          <span className="text-muted-foreground">{t.contact.line2}</span>
        </h2>
      </RevealText>

      <FadeIn delay={0.4}>
        <div className="mb-12 inline-flex flex-col items-center sm:mb-24">
          <button
            type="button"
            onClick={handleCopy}
            className="mb-2 inline-flex min-h-11 items-center gap-1.5 px-2 text-[11px] font-semibold tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground"
            aria-label={t.contact.copy}
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                {t.contact.copied}
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                {t.contact.copy}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-block max-w-full cursor-pointer break-all border-b border-foreground px-1 pb-2 text-base font-medium tracking-wide transition-colors hover:border-muted-foreground hover:text-muted-foreground sm:text-xl md:text-2xl"
            aria-label={t.contact.copy}
          >
            {EMAIL}
          </button>
        </div>

        <div className="flex justify-center gap-6 text-sm font-semibold tracking-widest uppercase sm:gap-12">
          <a
            href="https://www.linkedin.com/in/elena-arbuzova-25925a401/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center px-2 transition-opacity hover:opacity-50"
          >
            LinkedIn
          </a>
          <a
            href="https://t.me/elenaarb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center px-2 transition-opacity hover:opacity-50"
          >
            Telegram
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
