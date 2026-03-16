'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

// Import language resources
import enTranslations from './en/translation.json';
import esTranslations from './es/translation.json';

// Types
export type LangCode = 'en' | 'es';

// Language Option Type
export interface LanguageOption {
  value: LangCode;
  label: string;
  countryCode: string;
}

// Language Configuration
export const LANGUAGE_RESOURCE: Record<LangCode, Record<string, any>> = {
  es: esTranslations,
  en: enTranslations,
};

// Language Options
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'es', label: LANGUAGE_RESOURCE.es?.languages?.es || 'Español', countryCode: 'es' },
  { value: 'en', label: LANGUAGE_RESOURCE.en?.languages?.en || 'English', countryCode: 'en' },
];

// Default language
let globalLang: LangCode = 'es'; 
const listeners = new Set<(lang: LangCode) => void>();

const detectBrowserLanguage = (): LangCode => {
  if (typeof window === 'undefined') return 'es';
  
  const browserLang = navigator.language?.toLowerCase() || 'es';
  
  // Extract language code (e.g., 'en-US' -> 'en')
  const langCode = browserLang.split('-')[0] as LangCode;
  
  // Return detected language if supported, else default to Spanish
  return LANGUAGE_OPTIONS.some(opt => opt.value === langCode) ? langCode : 'es';
};

const setGlobalLang = (lang: LangCode) => {
  globalLang = lang;
  // Persist to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18n_lang', lang);
  }
  listeners.forEach((listener) => listener(lang));
};

const getStoredLang = (): LangCode | null => {
  if (typeof window === 'undefined') return null;
  return (localStorage.getItem('i18n_lang') as LangCode) || null;
};

// useTranslate Hook
const getInitialLang = (): LangCode => {
  if (typeof window === 'undefined') return 'es';
  
  // Try to get from localStorage first
  const stored = localStorage.getItem('i18n_lang') as LangCode | null;
  if (stored && ['es', 'en'].includes(stored)) {
    return stored;
  }
  
  // Fallback to browser language
  return detectBrowserLanguage();
};

export const useTranslate = () => {
  const [currentLang, setCurrentLang] = useState<LangCode>(globalLang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleLangChange = (lang: LangCode) => {
      setCurrentLang(lang);
    };

    listeners.add(handleLangChange);

    // Get the language on client side and sync global state
    const lang = getInitialLang();
    setGlobalLang(lang);
    setMounted(true);

    return () => {
      listeners.delete(handleLangChange);
    };
  }, []);

  const onChangeLang = useCallback((lang: LangCode) => {
    // Validate the language
    if (!['es', 'en'].includes(lang)) return;

    // Update global store and notify all subscribers
    setGlobalLang(lang);
  }, []);

  const getByPath = useCallback((source: Record<string, any>, path: string) => {
    return path.split('.').reduce<any>((acc, part) => acc?.[part], source);
  }, []);

  const translate = useCallback(
    (namespaceOrKey: string, keyOrDefault?: string, defaultValue = '') => {
      const resource = LANGUAGE_RESOURCE[currentLang] || {};

      if (typeof keyOrDefault === 'undefined') {
        const value = getByPath(resource, namespaceOrKey);
        return value ?? defaultValue ?? namespaceOrKey;
      }

      const namespaceValue = resource?.[namespaceOrKey];
      if (namespaceValue && typeof namespaceValue === 'object') {
        const nestedValue = getByPath(namespaceValue, keyOrDefault);
        return nestedValue ?? defaultValue ?? keyOrDefault;
      }

      const flatValue = getByPath(resource, namespaceOrKey);
      return flatValue ?? keyOrDefault ?? defaultValue ?? namespaceOrKey;
    },
    [currentLang, getByPath]
  );

  const currentLangOption = useMemo(
    () => LANGUAGE_OPTIONS.find(opt => opt.value === currentLang),
    [currentLang]
  );

  const allLanguagesWithTranslatedLabels = useMemo(
    () => 
      LANGUAGE_OPTIONS.map(opt => ({
        ...opt,
        label: LANGUAGE_RESOURCE[currentLang]?.languages?.[opt.value] || opt.label,
      })),
    [currentLang]
  );

  return {
    currentLang,
    onChangeLang,
    translate,
    currentLangOption,
    allLanguages: allLanguagesWithTranslatedLabels,
    mounted, // true when hydrated on client
  };
};
