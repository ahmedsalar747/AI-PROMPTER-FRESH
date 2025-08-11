import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { googlePlayBilling } from '../services/GooglePlayBillingService';
import { savePremiumSubscription } from '../utils/templateAccess';
import './Premium.css';

const Premium: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  // const access = getTemplateAccess();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const paymentsEnabled = (import.meta.env.VITE_FORCE_DISABLE_PAYMENTS === 'true')
    ? false
    : (import.meta.env.VITE_ENABLE_PAYMENTS !== 'false');

  const features = [
    {
      icon: '♾️',
      title: 'Unlimited Templates',
      description: 'Use unlimited templates without monthly restrictions'
    },
    {
      icon: '🎨',
      title: 'Custom Templates',
      description: 'Create and save your own custom templates'
    },
    {
      icon: '📊',
      title: 'Template History',
      description: 'Track your template usage and analytics'
    },
    {
      icon: '⭐',
      title: 'Rate & Review',
      description: 'Rate templates and share your feedback'
    },
    {
      icon: '📤',
      title: 'Export Templates',
      description: 'Export templates to various formats'
    },
    {
      icon: '🔍',
      title: 'Advanced Search',
      description: 'Advanced search filters and options'
    },
    {
      icon: '✨',
      title: 'Premium Templates',
      description: 'Access to exclusive premium templates'
    },
    {
      icon: '🚫',
      title: 'Remove Ads',
      description: 'Enjoy ad-free experience throughout the app'
    },
    {
      icon: '🚀',
      title: 'Priority Support',
      description: 'Get priority customer support'
    }
  ];

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '$7.99',
      period: '/month',
      originalPrice: null,
      savings: null,
      popular: false
    },
    {
      id: 'yearly',
      name: 'Annual Plan',
      price: '$79.99',
      period: '/year',
      originalPrice: '$95.88',
      savings: 'Save 17% ($15.89)',
      popular: true
    }
  ];

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    try {
      if (!paymentsEnabled) {
        addToast('Payments are disabled for this release', 'error');
        return;
      }
      const productId = plan === 'monthly' 
        ? 'com.prompterfresh.app.pro_plan_monthly' 
        : 'com.prompterfresh.app.pro_plan_yearly';
      const result = await googlePlayBilling.purchaseProduct(productId);
      if (result.success) {
        const expiresAt = Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000;
        savePremiumSubscription({
          productId: result.productId,
          purchaseToken: result.purchaseToken || 'local',
          expiresAt,
          status: 'active'
        });
        addToast('Premium activated successfully', 'success');
      } else {
        throw new Error(result.error || 'Purchase failed');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to complete purchase';
      addToast(message, 'error');
    }
  };

  const handleBackToGallery = () => {
    navigate('/gallery');
  };

  return (
    <div className="premium-page">
      {/* Header */}
      <header className="premium-header">
        <button className="back-btn" onClick={handleBackToGallery}>
          ← Back to Gallery
        </button>
        <div className="header-content">
          <h1>🔓 Conversational Wizard Premium</h1>
          <p>Unlock unlimited access to all templates and premium features</p>
        </div>
        {!paymentsEnabled && (
          <div style={{marginTop: '8px', color: '#b45309', background: '#fff7ed', padding: '8px 12px', borderRadius: 8}}>
            Payments are disabled in this version. Premium will be available soon.
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h2>Transform Your AI Experience</h2>
            <p>
              Get unlimited access to our comprehensive template library and advanced features. 
              Perfect for professionals, creators, and anyone serious about AI productivity.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Templates</span>
              </div>
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Usage</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="premium-badge-large">⭐ Premium</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Premium Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <h2>Choose Your Plan</h2>
        <div className="plan-selector">
          {plans.map((plan) => (
            <button
              key={plan.id}
              className={`plan-option ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
              onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
            >
              {plan.popular && <span className="popular-badge">Most Popular</span>}
              <div className="plan-info">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="original-price">
                    <span>Was {plan.originalPrice}</span>
                  </div>
                )}
                {plan.savings && (
                  <div className="savings">{plan.savings}</div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="selected-plan-details">
          <div className="plan-card" aria-disabled={!paymentsEnabled}>
            <div className="plan-header">
              <h3>{plans.find(p => p.id === selectedPlan)?.name}</h3>
              <div className="plan-price-large">
                <span className="price">{plans.find(p => p.id === selectedPlan)?.price}</span>
                <span className="period">{plans.find(p => p.id === selectedPlan)?.period}</span>
              </div>
              {plans.find(p => p.id === selectedPlan)?.savings && (
                <div className="savings-large">
                  {plans.find(p => p.id === selectedPlan)?.savings}
                </div>
              )}
            </div>
            <div className="plan-features">
              <h4>Everything included:</h4>
              <ul>
                {features.map((feature, index) => (
                  <li key={index}>
                    <span className="check-icon">✅</span>
                    {feature.title}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              className="upgrade-btn-large"
              onClick={() => handleUpgrade(selectedPlan)}
              disabled={!paymentsEnabled}
            >
              {paymentsEnabled ? '🔓 Upgrade to Premium' : '🔒 Premium temporarily disabled'}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I cancel anytime?</h3>
            <p>Yes, you can cancel your subscription anytime through Google Play Store settings. No questions asked.</p>
          </div>
          <div className="faq-item">
            <h3>What happens after I upgrade?</h3>
            <p>You'll immediately get access to all premium features and unlimited template usage.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a free trial?</h3>
            <p>You can try 3 templates for free each month. Upgrade to unlock unlimited access.</p>
          </div>
          <div className="faq-item">
            <h3>Can I use on multiple devices?</h3>
            <p>Yes, your premium subscription works across all your devices with the same Google account.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="premium-footer">
        <div className="footer-content">
          <p className="terms">
            * Subscription automatically renews unless cancelled. 
            Cancel anytime in Google Play Store settings.
          </p>
          <button className="back-to-gallery-btn" onClick={handleBackToGallery}>
            ← Back to Template Gallery
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Premium; 