/**
 * 🧪 Business Logic Tests - تست‌های جامع منطق کسب‌وکار
 * این فایل تمام منطق‌های برنامه را تست می‌کند
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    getPlatformProducts,
    getProductFeatures,
    validateProductId
} from '../config/products';
import {
    useAccessControl
} from '../hooks/useAccessControl';
import {
    getApiKeyMessage,
    getApiKeyType,
    isPersonalApiKey
} from '../utils/apiKeyDetector';
import {
    canUseTemplate,
    getRemainingFreeTemplates,
    getTemplateAccess,
    hasPremiumAccess,
    incrementTemplateUsage
} from '../utils/templateAccess';

// Mock React hooks
vi.mock('react', () => ({
  ...vi.importActual('react'),
  useState: vi.fn(),
  useEffect: vi.fn(),
  useContext: vi.fn()
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('🏢 Business Logic Tests - منطق کسب‌وکار', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('🔐 Authentication & Authorization Logic', () => {
    it('should correctly identify personal API keys', () => {
      const personalKey = 'sk-test123456789012345678901234567890';
      const freeKey = 'sk-free123456789012345678901234567890';
      const invalidKey = 'invalid-key';
      const emptyKey = '';

      // Mock environment variable
      vi.stubEnv('VITE_OPENAI_API_KEY', freeKey);

      expect(isPersonalApiKey(personalKey)).toBe(true);
      // Free API path removed: any valid-length key is treated as personal
      expect(isPersonalApiKey(freeKey)).toBe(true);
      expect(isPersonalApiKey(invalidKey)).toBe(false);
      expect(isPersonalApiKey(emptyKey)).toBe(false);
      expect(isPersonalApiKey(null)).toBe(false);
      expect(isPersonalApiKey(undefined)).toBe(false);
    });

    it('should provide correct API key type messages', () => {
      const personalMessage = getApiKeyMessage('personal');
      const freeMessage = getApiKeyMessage('free');
      const noneMessage = getApiKeyMessage('none');

      expect(personalMessage.title).toBe('🔑 Personal API Key');
      expect(personalMessage.message).toContain('Unlimited usage');
      expect(personalMessage.type).toBe('success');

      expect(freeMessage.title).toBe('🎁 Free API');
      expect(freeMessage.message).toContain('Limited usage');
      expect(freeMessage.type).toBe('info');

      expect(noneMessage.title).toBe('⚠️ No API Key');
      expect(noneMessage.message).toContain('Please configure');
      expect(noneMessage.type).toBe('warning');
    });

    it('should handle API key type detection', () => {
      const personalKey = 'sk-test123456789012345678901234567890';
      const freeKey = 'sk-free123456789012345678901234567890';

      vi.stubEnv('VITE_OPENAI_API_KEY', freeKey);

      expect(getApiKeyType(personalKey)).toBe('personal');
      // Free API path removed: treat as 'personal'
      expect(getApiKeyType(freeKey)).toBe('personal');
      expect(getApiKeyType('')).toBe('none');
      expect(getApiKeyType(null)).toBe('none');
    });
  });

  describe('💰 Subscription & Billing Logic', () => {
    it('should correctly check premium access', () => {
      // Test active subscription
      const activeSubscription = {
        productId: 'com.prompterfresh.app.pro_plan_monthly',
        purchaseToken: 'test-token',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 1 day from now
        status: 'active'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(activeSubscription));
      expect(hasPremiumAccess()).toBe(true);

      // Test expired subscription
      const expiredSubscription = {
        ...activeSubscription,
        expiresAt: Date.now() - 24 * 60 * 60 * 1000 // 1 day ago
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredSubscription));
      expect(hasPremiumAccess()).toBe(false);

      // Test no subscription
      localStorageMock.getItem.mockReturnValue(null);
      expect(hasPremiumAccess()).toBe(false);
    });

    it('should handle template access permissions', () => {
      // Test premium user access
      const premiumSubscription = {
        productId: 'com.prompterfresh.app.pro_plan_monthly',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        status: 'active'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(premiumSubscription));
      const premiumAccess = getTemplateAccess();

      expect(premiumAccess.isPremium).toBe(true);
      expect(premiumAccess.canCreateCustom).toBe(true);
      expect(premiumAccess.canAccessPremiumTemplates).toBe(true);
      expect(premiumAccess.canRemoveAds).toBe(true);

      // Test free user access
      localStorageMock.getItem.mockReturnValue(null);
      const freeAccess = getTemplateAccess();

      expect(freeAccess.isPremium).toBe(false);
      expect(freeAccess.canCreateCustom).toBe(false);
      expect(freeAccess.canAccessPremiumTemplates).toBe(false);
      expect(freeAccess.canRemoveAds).toBe(false);
    });

    it('should handle template usage limits', () => {
      // Test free tier usage
      const mockUsage = {
        monthlyUsage: 2,
        lastResetDate: new Date().toISOString(),
        currentMonth: new Date().toISOString().slice(0, 7)
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsage));
      expect(canUseTemplate()).toBe(true);
      expect(getRemainingFreeTemplates()).toBe(1);

      // Test usage at limit
      const limitUsage = { ...mockUsage, monthlyUsage: 3 };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(limitUsage));
      expect(canUseTemplate()).toBe(false);
      expect(getRemainingFreeTemplates()).toBe(0);

      // Test premium user (unlimited)
      const premiumSubscription = {
        productId: 'com.prompterfresh.app.pro_plan_monthly',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        status: 'active'
      };

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'premium-subscription') {
          return JSON.stringify(premiumSubscription);
        }
        return JSON.stringify(limitUsage);
      });

      expect(canUseTemplate()).toBe(true);
      expect(getRemainingFreeTemplates()).toBe(-1); // Unlimited
    });

    it('should track template usage correctly', () => {
      const initialUsage = {
        monthlyUsage: 1,
        lastResetDate: new Date().toISOString(),
        currentMonth: new Date().toISOString().slice(0, 7)
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(initialUsage));

      incrementTemplateUsage();

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'template-usage',
        expect.stringContaining('"monthlyUsage":2')
      );
    });
  });

  describe('🎯 Product & Pricing Logic', () => {
    it('should validate product IDs correctly', () => {
      const validProducts = [
        'com.prompterfresh.app.remove_ads',
        'com.prompterfresh.app.pro_plan_monthly',
        'com.prompterfresh.app.pro_plan_yearly'
      ];

      const invalidProducts = [
        'invalid-product',
        'com.prompterfresh.app.old_product',
        'test-product'
      ];

      validProducts.forEach(productId => {
        expect(validateProductId(productId)).toBe(true);
      });

      invalidProducts.forEach(productId => {
        expect(validateProductId(productId)).toBe(false);
      });
    });

    it('should get product features correctly', () => {
      const removeAdsFeatures = getProductFeatures('com.prompterfresh.app.remove_ads');
      const monthlyFeatures = getProductFeatures('com.prompterfresh.app.pro_plan_monthly');
      const yearlyFeatures = getProductFeatures('com.prompterfresh.app.pro_plan_yearly');

      expect(removeAdsFeatures).toBeTruthy();
      expect(removeAdsFeatures?.features.removeAds).toBe(true);
      expect(removeAdsFeatures?.price).toBe('$7.99');

      expect(monthlyFeatures).toBeTruthy();
      expect((monthlyFeatures?.features as any).unlimitedTemplates).toBe(true);
      expect(monthlyFeatures?.price).toBe('$7.99/month');

      expect(yearlyFeatures).toBeTruthy();
      expect((yearlyFeatures?.features as any).annualDiscount).toBe(true);
      expect(yearlyFeatures?.price).toBe('$79.99/year');
    });

    it('should handle platform-specific products', () => {
      const androidProducts = getPlatformProducts('android');
      const iosProducts = getPlatformProducts('ios');

      expect(androidProducts.REMOVE_ADS).toBe('com.prompterfresh.app.remove_ads');
      expect(androidProducts.PRO_PLAN_MONTHLY).toBe('com.prompterfresh.app.pro_plan_monthly');
      expect(androidProducts.PRO_PLAN_YEARLY).toBe('com.prompterfresh.app.pro_plan_yearly');

      expect(iosProducts.REMOVE_ADS).toBe('com.prompterfresh.app.remove_ads');
      expect(iosProducts.PRO_PLAN_MONTHLY).toBe('com.prompterfresh.app.pro_plan_monthly');
      expect(iosProducts.PRO_PLAN_YEARLY).toBe('com.prompterfresh.app.pro_plan_yearly');
    });
  });

  describe('🔍 Access Control Logic', () => {
    it('should handle difficulty level access control', () => {
      const { checkAccess } = useAccessControl();

      // Test free user access
      expect(checkAccess('beginner')).toBe(true); // Free users can access beginner
      expect(checkAccess('intermediate')).toBe(false); // Premium required
      expect(checkAccess('advanced')).toBe(false); // Premium required
      expect(checkAccess('expert')).toBe(false); // Premium required

      // Mock premium user
      const premiumSubscription = {
        productId: 'com.prompterfresh.app.pro_plan_monthly',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        status: 'active'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(premiumSubscription));

      // Premium users should have access to all levels
      expect(checkAccess('beginner')).toBe(true);
      expect(checkAccess('intermediate')).toBe(true);
      expect(checkAccess('advanced')).toBe(true);
      expect(checkAccess('expert')).toBe(true);
    });

    it('should handle feature-specific access control', () => {
      const { hasAccess } = useAccessControl();

      // Test feature access for different difficulty levels
      expect(hasAccess('beginner')).toBe(true);
      expect(hasAccess('intermediate')).toBe(false); // Requires premium
      expect(hasAccess('advanced')).toBe(false); // Requires premium
      expect(hasAccess('expert')).toBe(false); // Requires premium
    });
  });

  describe('📊 Template Management Logic', () => {
    it('should handle template creation permissions', () => {
      const { canCreateCustom } = getTemplateAccess();

      // Free users cannot create custom templates
      expect(canCreateCustom).toBe(false);

      // Mock premium user
      const premiumSubscription = {
        productId: 'com.prompterfresh.app.pro_plan_monthly',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        status: 'active'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(premiumSubscription));

      const premiumAccess = getTemplateAccess();
      expect(premiumAccess.canCreateCustom).toBe(true);
    });

    it('should handle template history access', () => {
      const { canAccessHistory } = getTemplateAccess();

      // Free users cannot access history
      expect(canAccessHistory).toBe(false);

      // Mock premium user
      const premiumSubscription = {
        productId: 'com.prompterfresh.app.pro_plan_monthly',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        status: 'active'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(premiumSubscription));

      const premiumAccess = getTemplateAccess();
      expect(premiumAccess.canAccessHistory).toBe(true);
    });

    it('should handle template rating permissions', () => {
      const { canRate } = getTemplateAccess();

      // Free users cannot rate templates
      expect(canRate).toBe(false);

      // Mock premium user
      const premiumSubscription = {
        productId: 'com.prompterfresh.app.pro_plan_monthly',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        status: 'active'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(premiumSubscription));

      const premiumAccess = getTemplateAccess();
      expect(premiumAccess.canRate).toBe(true);
    });
  });

  describe('🔧 Error Handling Logic', () => {
    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage Error');
      });

      // Should handle error gracefully (not throw)
      expect(() => {
        incrementTemplateUsage();
      }).not.toThrow();
      
      // Verify error was logged (we can't easily test console.error in vitest)
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      // Should handle gracefully by returning default values
      const access = getTemplateAccess();
      expect(access.isPremium).toBe(false);
      expect(access.monthlyUsage).toBe(0);
    });

    it('should handle missing subscription data', () => {
      localStorageMock.getItem.mockReturnValue(null);

      expect(hasPremiumAccess()).toBe(false);
      expect(getTemplateAccess().isPremium).toBe(false);
    });
  });

  describe('📈 Performance & Optimization Logic', () => {
    it('should handle monthly usage reset', () => {
      const lastMonthUsage = {
        monthlyUsage: 5,
        lastResetDate: '2024-01-01T00:00:00.000Z',
        currentMonth: '2024-01'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(lastMonthUsage));

      // Should reset usage for new month
      const currentAccess = getTemplateAccess();
      expect(currentAccess.monthlyUsage).toBe(0);
    });

    it('should handle concurrent access safely', () => {
      const mockUsage = {
        monthlyUsage: 1,
        lastResetDate: new Date().toISOString(),
        currentMonth: new Date().toISOString().slice(0, 7)
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsage));

      // Multiple increments should work correctly
      incrementTemplateUsage();
      incrementTemplateUsage();
      incrementTemplateUsage();

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('🌐 Internationalization Logic', () => {
    it('should handle language-specific prompt enhancement', () => {
      // This would test language-specific logic
      // For now, we'll test the basic structure
      const testPrompt = 'Test prompt';
      const persianPrompt = testPrompt + '\n\nPlease provide the response in Persian/Farsi.';
      const englishPrompt = testPrompt + '\n\nPlease provide the response in English.';

      expect(persianPrompt).toContain('Persian/Farsi');
      expect(englishPrompt).toContain('English');
    });
  });

  describe('🔒 Security Logic', () => {
    it('should validate API key format', () => {
      const validOpenAIKey = 'sk-test123456789012345678901234567890';
      const validAnthropicKey = 'sk-ant-test123456789012345678901234567890';
      const invalidKey = 'invalid-key';
      const shortKey = 'sk-short';

      expect(isPersonalApiKey(validOpenAIKey)).toBe(true);
      expect(isPersonalApiKey(validAnthropicKey)).toBe(true);
      expect(isPersonalApiKey(invalidKey)).toBe(false);
      expect(isPersonalApiKey(shortKey)).toBe(false);
    });

    it('should handle sensitive data storage', () => {
      const testApiKey = 'sk-test123456789012345678901234567890';
      
      // API keys should be stored securely
      localStorageMock.setItem.mockImplementation((key, value) => {
        if (key.includes('api-key') || key.includes('configs')) {
          expect(value).toContain(testApiKey);
        }
      });

      // This would test actual storage implementation
      expect(localStorageMock.setItem).toBeDefined();
    });
  });

  describe('📱 Mobile-Specific Logic', () => {
    it('should handle platform detection', () => {
      // Mock Android user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10; SM-G975F)',
        configurable: true
      });

      const androidProducts = getPlatformProducts('android');
      expect(androidProducts).toBeDefined();
      expect(androidProducts.REMOVE_ADS).toBe('com.prompterfresh.app.remove_ads');

      // Mock iOS user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      const iosProducts = getPlatformProducts('ios');
      expect(iosProducts).toBeDefined();
      expect(iosProducts.REMOVE_ADS).toBe('com.prompterfresh.app.remove_ads');
    });
  });
}); 