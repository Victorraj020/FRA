import React, { createContext, useContext, useMemo } from 'react';
import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';

interface I18nContextValue {
  language: string;
  changeLanguage: (lng: string) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n: i18nextInstance } = useTranslation();

  const value = useMemo<I18nContextValue>(() => ({
    language: i18nextInstance.language,
    changeLanguage: (lng: string) => {
      i18n.changeLanguage(lng);
      try { localStorage.setItem('app_language', lng); } catch {}
    }
  }), [i18nextInstance.language]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
};

export const useI18nContext = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18nContext must be used within I18nProvider');
  return ctx;
};

export default I18nContext;


