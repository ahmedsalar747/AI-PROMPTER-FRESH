import React from 'react';
import { demoApiService } from '../services/DemoApiService';

interface DemoModeIndicatorProps {
  className?: string;
}

const DemoModeIndicator: React.FC<DemoModeIndicatorProps> = ({ className = '' }) => {
  const isDemoMode = demoApiService.isDemoMode();
  
  if (!isDemoMode) {
    return null;
  }

  const pulseKeyframes = `
    @keyframes demo-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `;

  return (
    <>
      <style>{pulseKeyframes}</style>
      <div className={`demo-mode-indicator ${className}`} style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'demo-pulse 2s infinite'
      }}>
        <span style={{ fontSize: '16px' }}>🎭</span>
        <span>Demo Mode</span>
      </div>
    </>
  );
};

export default DemoModeIndicator; 