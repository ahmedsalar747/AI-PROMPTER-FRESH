import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTemplateAccess } from '../utils/templateAccess';
import './TemplateUpgradeBanner.css';

const TemplateUpgradeBanner: React.FC = () => {
  const access = getTemplateAccess();
  const navigate = useNavigate();

  // Don't show banner for premium users
  if (access.isPremium) {
    return null;
  }

  const handleUpgrade = () => {
    navigate('/premium');
  };

  return (
    <div className="upgrade-banner">
      <div className="upgrade-content">
        <div className="upgrade-icon">⭐</div>
        <div className="upgrade-text">
          <div className="upgrade-title">Pro Plan Premium</div>
          <div className="upgrade-description">
            Upgrade to unlock unlimited templates and premium features.
          </div>
        </div>
        <button className="upgrade-button" onClick={handleUpgrade}>
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default TemplateUpgradeBanner; 