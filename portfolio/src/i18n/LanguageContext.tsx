import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { translations, type Dictionary, type Lang } from './translations';

type LanguageContextValue = {
  lang: Lang;
  uiLang: Lang;
  t: Dictionary;
  contentVisible: boolean;
  isSwitching: boolean;
  setLanguage: (next: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const SWITCH_MS = 820;
const FADE_OUT_MS = 280;
const FADE_GAP_MS = 180;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [uiLang, setUiLang] = useState<Lang>('en');
  const [contentVisible, setContentVisible] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const lockRef = useRef(false);

  const setLanguage = useCallback((next: Lang) => {
    if (lockRef.current || uiLang === next) return;

    lockRef.current = true;
    setIsSwitching(true);
    setUiLang(next);

    window.setTimeout(() => {
      setContentVisible(false);

      window.setTimeout(() => {
        setLang(next);

        window.setTimeout(() => {
          setContentVisible(true);
          setIsSwitching(false);
          lockRef.current = false;
        }, FADE_GAP_MS);
      }, FADE_OUT_MS);
    }, SWITCH_MS);
  }, [uiLang]);

  const value = useMemo(
    () => ({
      lang,
      uiLang,
      t: translations[lang] as Dictionary,
      contentVisible,
      isSwitching,
      setLanguage,
    }),
    [lang, uiLang, contentVisible, isSwitching, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
