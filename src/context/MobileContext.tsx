import { Capacitor } from '@capacitor/core';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import MobileStorage from '../utils/mobileStorage';

interface MobileContextType {
  isReady: boolean;
  platform: string;
  isNative: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  showToast: (message: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

interface MobileProviderProps {
  children: ReactNode;
}

export const MobileProvider: React.FC<MobileProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [platform, setPlatform] = useState('');
  const [isNative, setIsNative] = useState(false);
  const [language, setLanguageState] = useState('fa');
  const [apiKey, setApiKeyState] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 شروع initialization...');
      
      // تشخیص platform
      const currentPlatform = Capacitor.getPlatform();
      const currentIsNative = Capacitor.isNativePlatform();
      
      setPlatform(currentPlatform);
      setIsNative(currentIsNative);
      
      console.log('📱 Platform:', currentPlatform);
      console.log('🏠 Native:', currentIsNative);
      
      // بارگذاری تنظیمات
      loadSettings();
      
      setIsReady(true);
      console.log('✅ App آماده است');
      
    } catch (error) {
      console.error('❌ خطا در initialization:', error);
      setIsReady(false);
    }
  };

  const loadSettings = () => {
    try {
      const savedLanguage = MobileStorage.getItem('language');
      if (savedLanguage) {
        setLanguageState(savedLanguage);
      }
      
      const savedApiKey = MobileStorage.getItem('apiKey');
      if (savedApiKey) {
        setApiKeyState(savedApiKey);
      }
      
      console.log('⚙️ تنظیمات بارگذاری شد');
    } catch (error) {
      console.warn('⚠️ خطا در بارگذاری تنظیمات:', error);
    }
  };

  const setLanguage = (lang: string) => {
    try {
      setLanguageState(lang);
      MobileStorage.setItem('language', lang);
      console.log('🌐 زبان تغییر کرد:', lang);
    } catch (error) {
      console.warn('⚠️ خطا در تغییر زبان:', error);
    }
  };

  const setApiKey = (key: string) => {
    try {
      setApiKeyState(key);
      MobileStorage.setItem('apiKey', key);
      console.log('🔑 API Key ذخیره شد');
    } catch (error) {
      console.warn('⚠️ خطا در ذخیره API Key:', error);
    }
  };

  const showToast = (message: string) => {
    try {
      setToastMessage(message);
      setTimeout(() => setToastMessage(''), 3000);
      console.log('🍞 Toast:', message);
    } catch (error) {
      console.warn('⚠️ خطا در نمایش toast:', error);
    }
  };

  const value: MobileContextType = {
    isReady,
    platform,
    isNative,
    language,
    setLanguage,
    showToast,
    apiKey,
    setApiKey
  };

  return (
    <MobileContext.Provider value={value}>
      {children}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          {toastMessage}
        </div>
      )}
    </MobileContext.Provider>
  );
};

export const useMobile = (): MobileContextType => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
}; 