import React from 'react';
import { shouldShowAds } from '../utils/templateAccess';
import './AdBanner.css';

interface AdBannerProps {
  className?: string;
  position?: 'top' | 'bottom' | 'sidebar';
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  className = '', 
  position = 'bottom' 
}) => {
  // Don't show ads for premium users
  if (!shouldShowAds()) {
    return null;
  }

  const handleUpgrade = () => {
    // Navigate to premium page
    window.location.href = '/premium';
  };

  return (
    <div className={`ad-banner ${position} ${className}`}>
      <div className="ad-content">
        <div className="ad-text">
          <div className="ad-title">🔒 Premium Experience</div>
          <div className="ad-message">
            Remove ads and unlock unlimited features with Premium
          </div>
        </div>
        <div className="ad-actions">
          <button className="upgrade-btn" onClick={handleUpgrade}>
            🔓 Upgrade
          </button>
          <div className="ad-price">$7.99/month</div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner; 