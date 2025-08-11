import { Capacitor } from '@capacitor/core';
import React from 'react';
import './App.css';

const App: React.FC = () => {
  const [isReady, setIsReady] = React.useState(false);
  const [platform, setPlatform] = React.useState('');

  React.useEffect(() => {
    try {
      console.log('🚀 اپلیکیشن در حال شروع...');
      
      // بررسی platform
      const currentPlatform = Capacitor.getPlatform();
      setPlatform(currentPlatform);
      console.log('📱 Platform:', currentPlatform);
      
      // تست localStorage
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('test', 'ok');
        console.log('💾 localStorage کار می‌کند');
      }
      
      setIsReady(true);
      console.log('✅ اپلیکیشن آماده است');
      
    } catch (error) {
      console.error('❌ خطا در initialization:', error);
      setIsReady(false);
    }
  }, []);

  if (!isReady) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>در حال بارگذاری...</div>
        <div style={{ marginTop: '10px', fontSize: '14px' }}>
          Platform: {platform || 'در حال تشخیص...'}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header style={{ padding: '20px', textAlign: 'center' }}>
        <h1>🎉 اپلیکیشن با موفقیت اجرا شد!</h1>
        <p>Platform: {platform}</p>
        <p>Capacitor: {Capacitor.isNativePlatform() ? 'Native' : 'Web'}</p>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => {
              console.log('دکمه کلیک شد');
              alert('دکمه کار می‌کند!');
            }}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            تست کلیک
          </button>
        </div>
      </header>
    </div>
  );
};

export default App; 