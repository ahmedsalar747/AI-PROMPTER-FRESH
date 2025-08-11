import React from 'react';
import './PricingModal.css';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: 'monthly' | 'yearly') => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade 
}) => {
  if (!isOpen) return null;

  const features = [
    '✅ Unlimited template usage',
    '✅ Create custom templates',
    '✅ Template history & analytics',
    '✅ Rate and review templates',
    '✅ Export templates',
    '✅ Advanced search filters',
    '✅ Premium templates access',
    '✅ Remove ads'
  ];

  return (
    <div className="pricing-modal-overlay" onClick={onClose}>
      <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔓 Pro Plan Premium</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="pricing-intro">
            <p>Unlock unlimited access to all templates and premium features</p>
          </div>
          
          <div className="pricing-plans">
            <div className="plan-card monthly">
              <div className="plan-header">
                <h3>Monthly Plan</h3>
                <div className="plan-price">
                  <span className="price">$7.99</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <ul className="plan-features">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button 
                className="upgrade-btn monthly"
                onClick={() => onUpgrade('monthly')}
              >
                🔓 Upgrade Monthly
              </button>
            </div>
            
            <div className="plan-card yearly">
              <div className="plan-badge">Best Value</div>
              <div className="plan-header">
                <h3>Annual Plan</h3>
                <div className="plan-price">
                  <span className="price">$79.99</span>
                  <span className="period">/year</span>
                </div>
                <div className="savings">Save 17% ($15.89)</div>
              </div>
              <ul className="plan-features">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button 
                className="upgrade-btn yearly"
                onClick={() => onUpgrade('yearly')}
              >
                🔓 Upgrade Yearly
              </button>
            </div>
          </div>
          
          <div className="modal-footer">
            <p className="terms">
              * Subscription automatically renews unless cancelled. 
              Cancel anytime in Google Play Store settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal; 