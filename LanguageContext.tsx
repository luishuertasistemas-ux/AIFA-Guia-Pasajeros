'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { LANGUAGES, type Language } from '@/data/translations';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const STORAGE_KEY = 'aifa-language';

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: string | null): value is Language {
  return value !== null && LANGUAGES.some((language) => language === value);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ES');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
      if (isLanguage(savedLanguage)) setLanguage(savedLanguage);
    } catch (error) {
      console.error('No se pudo leer el idioma guardado.', error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  useEffect(() => {
    if (!isInitialized) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.error('No se pudo guardar el idioma seleccionado.', error);
    }
  }, [isInitialized, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe utilizarse dentro de LanguageProvider.');
  }
  return context;
}
