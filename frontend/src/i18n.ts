import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Load translation resources (bundled statically)
import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import te from './locales/te/translation.json';
import or from './locales/or/translation.json';
import bn from './locales/bn/translation.json';
import { applyLanguageAccent } from './lib/locale';

const resources = {
  en: { translation: en },
  hi: { translation: hi }, // Hindi (Madhya Pradesh)
  te: { translation: te }, // Telugu (Telangana)
  or: { translation: or }, // Odia (Odisha)
  bn: { translation: bn }  // Bengali (Tripura)
};

const storedLng = typeof window !== 'undefined' ? localStorage.getItem('app_language') : null;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLng || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

// Apply HTML lang and accent when language changes
if (typeof window !== 'undefined') {
  const setAttrs = (lng: string) => {
    document.documentElement.setAttribute('lang', lng);
    applyLanguageAccent(lng);
  };
  setAttrs(i18n.language);
  i18n.on('languageChanged', setAttrs);
}

export default i18n;


