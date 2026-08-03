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
    <section id="contact" className="py-40 md:py-60 container mx-auto px-6 text-center">
      <RevealText>
        <h2 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] mb-12">
          {t.contact.line1}
          <br />
          <span className="text-muted-foreground">{t.contact.line2}</span>
        </h2>
      </RevealText>

      <FadeIn delay={0.4}>
        <div className="inline-flex flex-col items-center mb-24">
          <button
            type="button"
            onClick={handleCopy}
            className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
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
            className="text-xl md:text-2xl font-medium tracking-wide border-b border-foreground pb-2 hover:text-muted-foreground hover:border-muted-foreground transition-colors inline-block cursor-pointer"
            aria-label={t.contact.copy}
          >
            {EMAIL}
          </button>
        </div>

        <div className="flex justify-center gap-12 text-sm font-semibold tracking-widest uppercase">
          <a href="https://www.linkedin.com/in/elena-arbuzova-25925a401/" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">LinkedIn</a>
          <a href="https://t.me/elenaarb" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">Telegram</a>
        </div>
      </FadeIn>
    </section>
  );
}
