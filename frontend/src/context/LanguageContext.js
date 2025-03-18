import React, { createContext, useState, useEffect } from 'react';
import languages from '../data/languages';


export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const storedLanguage = localStorage.getItem('language') || 'en';
  const [language, setLanguage] = useState(storedLanguage);
  const [texts, setTexts] = useState(languages[language].translations);

  useEffect(() => {
    setTexts(languages[language].translations);
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ texts, changeLanguage, languages, language }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;