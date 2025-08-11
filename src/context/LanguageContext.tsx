import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getAvailableLanguages, getCurrentLanguage, translateSync } from '../../i18n';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface LanguageContextType {
  currentLanguage: string;
  availableLanguages: Language[];
  t: (key: string, fallback?: string, replacements?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(getCurrentLanguage());
  const [, forceUpdate] = useState({});
  const availableLanguages = getAvailableLanguages();

  // Update current language when it changes
  useEffect(() => {
    const newLanguage = getCurrentLanguage();
    if (newLanguage !== currentLanguage) {
      setCurrentLanguage(newLanguage);
      forceUpdate({});
    }
  }, [currentLanguage]);

  // Listen for auto-translation changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'autoTranslationEnabled' || e.key === 'targetLanguage') {
        forceUpdate({});
        // Small delay before reload to let the user see the change
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value: LanguageContextType = {
    currentLanguage,
    availableLanguages,
    t: translateSync // Use synchronous version for components
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 