import { Language, LanguageOption } from '../types';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'fa', name: 'فارسی', direction: 'rtl' },
  { code: 'en', name: 'English', direction: 'ltr' },
  { code: 'ar', name: 'العربية', direction: 'rtl' },
  { code: 'es', name: 'Español', direction: 'ltr' },
  { code: 'fr', name: 'Français', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', direction: 'ltr' },
  { code: 'zh', name: '中文', direction: 'ltr' },
  { code: 'ja', name: '日本語', direction: 'ltr' },
];

export const getLanguageOption = (code: Language): LanguageOption => {
  return LANGUAGE_OPTIONS.find(option => option.code === code) || LANGUAGE_OPTIONS[0];
};

export const formatText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const isRTL = (language: Language): boolean => {
  return ['fa', 'ar'].includes(language);
};

export const getTextDirection = (language: Language): 'ltr' | 'rtl' => {
  return isRTL(language) ? 'rtl' : 'ltr';
}; 