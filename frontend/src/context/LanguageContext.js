import React, { createContext, useState, useEffect } from 'react';
import languages from '../data/languages';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [texts, setTexts] = useState(languages[language].translations);

  useEffect(() => {
    setTexts(languages[language].translations);
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

export { LanguageContext };
export default LanguageContext;