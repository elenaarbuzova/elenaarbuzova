import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import heroPortrait from '@assets/generated_images/hero-portrait.png';

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const { t, lang } = useLanguage();
  const lines = t.hero.lines;

  return (
    <section className="relative min-h-screen overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-10 min-h-[calc(100vh-6rem)]">
        <motion.div
          className="relative z-10 w-full max-w-3xl lg:max-w-[54%] shrink-0"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <h1
            key={lang}
            className="text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.9] mb-6"
          >
            {lines.map((line) => (
              <span key={`${lang}-${line}`} className="block">
                {line}
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="flex flex-row justify-between items-end w-full gap-6 mt-2"
          >
            <p className="text-lg md:text-xl font-medium tracking-wide uppercase">
              {t.hero.role}
            </p>
            <a
              href="#work"
              className="shrink-0 text-sm font-semibold tracking-widest uppercase border-b border-foreground pb-1 hover:opacity-50 transition-opacity"
            >
              {t.hero.cta}
            </a>
          </motion.div>
        </motion.div>

        <motion.aside
          className="relative z-10 mx-auto lg:mx-0 w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[min(42vw,440px)]"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.25 }}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            <img
              src={heroPortrait}
              alt="Elena Arbuzova"
              className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
              draggable={false}
            />
          </div>

          <div
            className="absolute -z-10 inset-3 translate-x-3 translate-y-3 border border-foreground/15"
            aria-hidden
          />
        </motion.aside>
      </div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
        className="absolute bottom-10 left-6 right-6 h-px bg-foreground/20 origin-left"
      />
    </section>
  );
}
