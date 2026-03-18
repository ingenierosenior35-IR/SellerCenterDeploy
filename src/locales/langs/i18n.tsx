'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type LangCode = 'en' | 'es';

export interface LanguageOption {
  value: LangCode;
  label: string;
  countryCode: string;
  icon: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'es', label: 'Español', countryCode: 'es', icon: 'co' },
  { value: 'en', label: 'English', countryCode: 'en', icon: 'us' },
];

// Cache en memoria: los idiomas ya cargados no vuelven a la red.
// Se exporta como LANGUAGE_RESOURCE para compatibilidad con código existente.
export const LANGUAGE_RESOURCE: Partial<Record<LangCode, Record<string, any>>> = {};

// ----------------------------------------------------------------------

interface TranslateContextValue {
  translate: (namespaceOrKey: string, keyOrDefault?: string, defaultValue?: string) => string;
  currentLang: LangCode;
  onChangeLang: (lang: LangCode) => void;
  currentLangOption: LanguageOption | undefined;
  allLanguages: LanguageOption[];
  mounted: boolean;
}

const TranslateContext = createContext<TranslateContextValue | null>(null);

// ----------------------------------------------------------------------

const detectLang = (): LangCode => {
  if (typeof window === 'undefined') return 'es';
  const stored = localStorage.getItem('i18n_lang') as LangCode | null;
  if (stored && ['es', 'en'].includes(stored)) return stored;
  const browser = navigator.language?.split('-')[0] as LangCode;
  return LANGUAGE_OPTIONS.some((o) => o.value === browser) ? browser : 'es';
};

export function TranslateProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<LangCode>('es');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [mounted, setMounted] = useState(false);

  // Detecta idioma correcto al montar en cliente
  useEffect(() => {
    setCurrentLang(detectLang());
    setMounted(true);
  }, []);

  // Carga el JSON solo del idioma activo.
  // Si ya se cargó antes, lo toma del cache LANGUAGE_RESOURCE.
  useEffect(() => {
    if (LANGUAGE_RESOURCE[currentLang]) {
      setTranslations(LANGUAGE_RESOURCE[currentLang]!);
      return;
    }

    let cancelled = false;

    const loadLang = (lang: LangCode): Promise<Record<string, any>> => {
      switch (lang) {
        case 'en':
          return import('./en/translation.json').then((m) => m.default);
        case 'es':
        default:
          return import('./es/translation.json').then((m) => m.default);
      }
    };

    loadLang(currentLang).then((translations) => {
      if (!cancelled) {
        LANGUAGE_RESOURCE[currentLang] = translations;
        setTranslations(translations);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [currentLang]);

  const onChangeLang = useCallback((lang: LangCode) => {
    if (!['es', 'en'].includes(lang)) return;
    localStorage.setItem('i18n_lang', lang);
    setCurrentLang(lang);
  }, []);

  // Compatible con ambos patrones de uso existentes:
  const translate = useCallback(
    (namespaceOrKey: string, keyOrDefault?: string, defaultValue = '') => {
      const getByPath = (source: Record<string, any>, path: string) =>
        path.split('.').reduce<any>((acc, part) => acc?.[part], source);

      if (typeof keyOrDefault === 'undefined') {
        return getByPath(translations, namespaceOrKey) ?? defaultValue ?? namespaceOrKey;
      }

      const ns = translations?.[namespaceOrKey];
      if (ns && typeof ns === 'object') {
        return getByPath(ns, keyOrDefault) ?? defaultValue ?? keyOrDefault;
      }

      return getByPath(translations, namespaceOrKey) ?? keyOrDefault ?? defaultValue ?? namespaceOrKey;
    },
    [translations]
  );

  const currentLangOption = useMemo(
    () => LANGUAGE_OPTIONS.find((o) => o.value === currentLang),
    [currentLang]
  );

  const allLanguages = useMemo(
    () =>
      LANGUAGE_OPTIONS.map((opt) => ({
        ...opt,
        label: translations?.languages?.[opt.value] || opt.label,
      })),
    [translations]
  );

  const value = useMemo(
    () => ({ translate, currentLang, onChangeLang, currentLangOption, allLanguages, mounted }),
    [translate, currentLang, onChangeLang, currentLangOption, allLanguages, mounted]
  );

  return <TranslateContext.Provider value={value}>{children}</TranslateContext.Provider>;
}

// ----------------------------------------------------------------------

export const useTranslate = (): TranslateContextValue => {
  const ctx = useContext(TranslateContext);
  if (!ctx) throw new Error('useTranslate must be inside <TranslateProvider>');
  return ctx;
};
