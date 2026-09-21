import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_lang');
      if (saved && (saved === 'en' || saved === 'nl')) {
        return saved;
      }
      const browserLang = navigator.language?.toLowerCase() || '';
      if (browserLang.startsWith('nl')) return 'nl';
      return 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    if (lang !== 'en' && lang !== 'nl') return;
    setLanguageState(lang);
    try {
      localStorage.setItem('portfolio_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
