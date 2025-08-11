import React, { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiCreditCard, FiHelpCircle, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { googlePlayBilling } from '../services/GooglePlayBillingService';
import { savePremiumSubscription } from '../utils/templateAccess';
import './UserMenu.css';

const UserMenu: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const restorePurchases = async () => {
    try {
      const restored = await googlePlayBilling.restorePurchases();
      if (!restored || restored.length === 0) {
        addToast('No purchases to restore', 'info');
        return;
      }
      const sub = restored.find(r => r.productId.includes('pro_plan')) || restored[0];
      const isYearly = sub.productId.includes('yearly');
      const expiresAt = Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000;
      savePremiumSubscription({
        productId: sub.productId,
        purchaseToken: sub.purchaseToken || 'restored',
        expiresAt,
        status: 'active'
      });
      addToast('Purchases restored successfully', 'success');
      setIsDropdownOpen(false);
    } catch (e: any) {
      addToast(e.message || 'Failed to restore purchases', 'error');
    }
  };

  const handleMenuItemClick = (path: string) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  // removed avatar text helper (no auth profile)

  // Simplified menu without authentication

  return (
    <div className="user-menu" ref={dropdownRef}>
      <button 
        className="user-menu-trigger"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <div className="user-info">
          <div className="user-avatar">
            <span className="avatar-text">PF</span>
          </div>
          <div className="user-details">
            <span className="user-name">Prompter Fresh</span>
            <span className="user-email">Local mode</span>
          </div>
        </div>
        <FiChevronDown className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <div className="user-avatar large">
              <span className="avatar-text">PF</span>
            </div>
            <div className="user-info">
              <span className="user-name">Prompter Fresh</span>
              <span className="user-email">Local mode</span>
            </div>
          </div>

          <div className="dropdown-divider" />

          <div className="dropdown-menu">
            <button 
              className="menu-item"
              onClick={() => handleMenuItemClick('/premium')}
            >
              <FiCreditCard className="menu-icon" />
              <span>Subscription</span>
            </button>

            <button 
              className="menu-item"
              onClick={restorePurchases}
            >
              <FiCreditCard className="menu-icon" />
              <span>Restore purchases</span>
            </button>

            <button 
              className="menu-item"
              onClick={() => handleMenuItemClick('/settings')}
            >
              <FiSettings className="menu-icon" />
              <span>Settings</span>
            </button>

            <button 
              className="menu-item"
              onClick={() => handleMenuItemClick('/help')}
            >
              <FiHelpCircle className="menu-icon" />
              <span>Help & Support</span>
            </button>
          </div>

          <div className="dropdown-divider" />
          <div className="dropdown-footer" />
        </div>
      )}
    </div>
  );
};

export default UserMenu; 