export const formatNumber = (value: number, locale: string): string => {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
};

export const applyLanguageAccent = (lang: string) => {
  const accents: Record<string, string> = {
    en: '#2563eb', // blue
    hi: '#16a34a', // green (Madhya Pradesh)
    te: '#e11d48', // rose (Telangana)
    or: '#ea580c', // orange (Odisha)
    bn: '#9333ea'  // purple (Tripura)
  };
  const accent = accents[lang] || accents.en;
  const root = document.documentElement;
  root.style.setProperty('--lang-accent', accent);
};


