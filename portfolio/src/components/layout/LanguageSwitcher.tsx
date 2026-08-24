import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Lang } from '@/i18n/translations';

const EASE = [0.22, 1, 0.36, 1] as const;

export function LanguageSwitcher() {
  const { uiLang, setLanguage, isSwitching } = useLanguage();
  const isRu = uiLang === 'ru';

  const select = (next: Lang) => {
    if (isSwitching || next === uiLang) return;
    setLanguage(next);
  };

  return (
    <motion.div
      className="language-switcher relative isolate select-none shrink-0"
      style={{ width: 88, height: 26 }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
    >
      <motion.div
        role="group"
        aria-label="Language"
        className="relative h-full w-full overflow-hidden rounded-full border border-black bg-white cursor-pointer"
        whileHover={{
          scale: 1.02,
          boxShadow: '0 8px 22px -16px rgba(0,0,0,0.28)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      >
        <motion.div
          className="absolute top-0 bottom-0 z-0 rounded-full bg-black will-change-transform"
          initial={false}
          animate={{
            left: isRu ? 'calc(50% - 1px)' : '0px',
            width: 'calc(50% + 1px)',
            scaleX: isSwitching ? 1.04 : 1,
            filter: isSwitching ? 'blur(0.25px)' : 'blur(0px)',
          }}
          transition={{
            left: { type: 'spring', stiffness: 160, damping: 26, mass: 0.7 },
            width: { type: 'spring', stiffness: 160, damping: 26, mass: 0.7 },
            scaleX: { duration: 0.4, ease: EASE },
            filter: { duration: 0.3, ease: EASE },
          }}
          style={{ transformOrigin: isRu ? 'right center' : 'left center' }}
        />

        <div className="relative z-10 grid h-full grid-cols-2">
          <LangHalf active={!isRu} isSwitching={isSwitching} label="EN" onPick={() => select('en')} />
          <LangHalf active={isRu} isSwitching={isSwitching} label="RU" onPick={() => select('ru')} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function LangHalf({
  active,
  isSwitching,
  label,
  onPick,
}: {
  active: boolean;
  isSwitching: boolean;
  label: string;
  onPick: () => void;
}) {
  const color = active
    ? '#ffffff'
    : isSwitching
      ? 'rgba(0,0,0,0.35)'
      : 'rgba(0,0,0,0.9)';

  return (
    <button
      type="button"
      className="relative flex h-full w-full items-center justify-center bg-transparent cursor-pointer"
      onClick={onPick}
      aria-pressed={active}
    >
      <motion.span
        className="text-[10px] font-semibold tracking-[0.08em] leading-none"
        style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
        animate={{ color }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        {label}
      </motion.span>
    </button>
  );
}
