import React from 'react';
import { getRemainingFreeTemplates, getTemplateAccess } from '../utils/templateAccess';
import './TemplateUsageCounter.css';

interface TemplateUsageCounterProps {
  className?: string;
}

const TemplateUsageCounter: React.FC<TemplateUsageCounterProps> = ({ 
  className = '' 
}) => {
  const access = getTemplateAccess();
  const remainingTemplates = getRemainingFreeTemplates();
  
  // Don't show counter for premium users
  if (access.isPremium) {
    return null;
  }
  
  return (
    <div className={`template-usage-counter ${className}`}>
      <div className="usage-content">
        <div className="usage-icon">📊</div>
        <div className="usage-text">
          <div className="usage-title">Free Templates</div>
          <div className="usage-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${((access.maxFreeUsage - remainingTemplates) / access.maxFreeUsage) * 100}%` 
                }}
              />
            </div>
            <div className="usage-stats">
              <span className="used">{access.monthlyUsage}</span>
              <span className="separator">/</span>
              <span className="total">{access.maxFreeUsage}</span>
              <span className="remaining">
                {remainingTemplates > 0 ? ` (${remainingTemplates} left)` : ' (Upgrade needed)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateUsageCounter; 