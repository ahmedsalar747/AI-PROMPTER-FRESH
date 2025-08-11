import React from 'react';
import './App.css';
import { MobileProvider, useMobile } from './context/MobileContext';

const AppContent: React.FC = () => {
  const { isReady, platform, isNative, language, setLanguage, showToast, apiKey, setApiKey } = useMobile();

  if (!isReady) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🚀 Prompter Fresh</h1>
        <div className="platform-info">
          <p>📱 Platform: {platform}</p>
          <p>🏠 Native: {isNative ? 'بله' : 'خیر'}</p>
          <p>🌐 Language: {language}</p>
        </div>
      </header>

      <main className="app-main">
        <div className="feature-section">
          <h2>⚙️ تنظیمات</h2>
          
          <div className="setting-item">
            <label>زبان:</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="setting-select"
            >
              <option value="fa">فارسی</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="setting-item">
            <label>API Key:</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Key خود را وارد کنید"
              className="setting-input"
            />
          </div>

          <button 
            onClick={() => showToast('تنظیمات ذخیره شد!')}
            className="save-button"
          >
            ذخیره تنظیمات
          </button>
        </div>

        <div className="feature-section">
          <h2>🎯 ویژگی‌های اصلی</h2>
          
          <div className="feature-grid">
            <button 
              className="feature-button"
              onClick={() => showToast('Prompt Architect در حال توسعه')}
            >
              📝 Prompt Architect
            </button>
            
            <button 
              className="feature-button"
              onClick={() => showToast('Prompt Enhancer در حال توسعه')}
            >
              ⚡ Prompt Enhancer
            </button>
            
            <button 
              className="feature-button"
              onClick={() => showToast('Template Gallery در حال توسعه')}
            >
              🎨 Template Gallery
            </button>
            
            <button 
              className="feature-button"
              onClick={() => showToast('Prompt Library در حال توسعه')}
            >
              📚 Prompt Library
            </button>
          </div>
        </div>

        <div className="feature-section">
          <h2>🧪 تست عملکرد</h2>
          
          <div className="test-buttons">
            <button 
              onClick={() => showToast('تست موفق!')}
              className="test-button success"
            >
              تست Toast
            </button>
            
            <button 
              onClick={() => {
                console.log('تست Console Log');
                showToast('Log در console چاپ شد');
              }}
              className="test-button info"
            >
              تست Console
            </button>
            
            <button 
              onClick={() => {
                const testKey = 'test_' + Date.now();
                setApiKey(testKey);
                showToast('Storage تست شد');
              }}
              className="test-button warning"
            >
              تست Storage
            </button>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2024 Prompter Fresh - نسخه Mobile</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MobileProvider>
      <AppContent />
    </MobileProvider>
  );
};

export default App; 