// Simple i18n setup for Prompter Fresh
import enTranslations from './locales/en.json';

// Simple translation storage
const translations = {
  en: enTranslations
};

// Simple translation function
export const t = (key: string, fallback?: string): string => {
  const keys = key.split('.');
  let value: any = translations.en;
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }
  
  return value || fallback || key;
};

// Get system language
export const getSystemLanguage = (): string => {
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language || 'en';
  return browserLang.split('-')[0].toLowerCase();
};

// Check if should show translation prompt
export const shouldShowTranslationPrompt = (): { 
  show: boolean; 
  systemLang: string; 
  systemLangName: string; 
} => {
  const systemLang = getSystemLanguage();
  const isNonEnglish = systemLang !== 'en';
  const hasDeclined = localStorage.getItem('translationDeclined') === 'true';
  const hasSeenPrompt = localStorage.getItem('hasSeenTranslationPrompt') === 'true';
  const isEnabled = localStorage.getItem('autoTranslationEnabled') === 'true';
  
  const languageNames: Record<string, string> = {
    'fa': 'فارسی (Persian)',
    'ar': 'العربية (Arabic)', 
    'es': 'Español (Spanish)',
    'fr': 'Français (French)',
    'de': 'Deutsch (German)',
    'zh': '中文 (Chinese)',
    'ja': '日本語 (Japanese)',
    'ko': '한국어 (Korean)',
    'hi': 'हिंदी (Hindi)',
    'tr': 'Türkçe (Turkish)',
    'ru': 'Русский (Russian)',
    'pt': 'Português (Portuguese)',
    'it': 'Italiano (Italian)',
    'nl': 'Nederlands (Dutch)'
  };
  
  const systemLangName = languageNames[systemLang] || systemLang.toUpperCase();
  
  const shouldShow = isNonEnglish && !hasDeclined && !isEnabled && !hasSeenPrompt;
  
  return {
    show: shouldShow,
    systemLang,
    systemLangName
  };
};

// Enable auto translation
export const enableAutoTranslation = (): void => {
  localStorage.setItem('autoTranslationEnabled', 'true');
  localStorage.setItem('targetLanguage', getSystemLanguage());
};

// Disable auto translation
export const disableAutoTranslation = (): void => {
  localStorage.setItem('autoTranslationEnabled', 'false');
  localStorage.removeItem('targetLanguage');
};

// Accept translation
export const acceptTranslation = (): void => {
  enableAutoTranslation();
  localStorage.setItem('hasSeenTranslationPrompt', 'true');
  localStorage.removeItem('translationDeclined');
};

// Decline translation
export const declineTranslation = (): void => {
  localStorage.setItem('translationDeclined', 'true');
  localStorage.setItem('hasSeenTranslationPrompt', 'true');
  disableAutoTranslation();
};

// Check if auto translation is enabled
export const isAutoTranslationEnabled = (): boolean => {
  return localStorage.getItem('autoTranslationEnabled') === 'true';
};

// Get target language
export const getTargetLanguage = (): string => {
  return localStorage.getItem('targetLanguage') || 'en';
};

// Get available languages
export const getAvailableLanguages = () => {
  return [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' }
  ];
};

// Get current language
export const getCurrentLanguage = (): string => {
  return 'en';
};

// Set language (for future use)
export const setLanguage = (locale: string): void => {
  // Currently only supports English
  console.log('Language set to:', locale);
};

// Initialize language system
export const initializeLanguage = (): void => {
  // Nothing to initialize for simple setup
};

// Preload translations (placeholder)
export const preloadTranslations = async (): Promise<void> => {
  // Simple implementation - no preloading needed
  return Promise.resolve();
};

// Synchronous translation function for components
export const translateSync = (key: string, fallback?: string, _replacements?: Record<string, any>): string => {
  // Same as t() function but with different name for compatibility
  return t(key, fallback);
} 