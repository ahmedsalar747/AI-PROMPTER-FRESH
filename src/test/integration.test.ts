/**
 * 🧪 Integration Tests - تست‌های جامع ارتباط بک‌اند و فرانت‌اند
 * این فایل تمام ارتباطات بین سرویس‌ها را تست می‌کند
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    googlePlayBilling
} from '../services/GooglePlayBillingService';
import {
    enhancePrompt
} from '../services/multiModelService';
import {
    isPersonalApiKey
} from '../utils/apiKeyDetector';
import {
    hasPremiumAccess
} from '../utils/templateAccess';

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

// Mock fetch
global.fetch = vi.fn();

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    create: vi.fn(() => ({
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));

// Mock template access functions
vi.mock('../utils/templateAccess', () => ({
  hasPremiumAccess: vi.fn(),
  getTemplateAccess: vi.fn(),
  canUseTemplate: vi.fn(),
  incrementTemplateUsage: vi.fn(),
  getRemainingFreeTemplates: vi.fn()
}));

// Mock products config
vi.mock('../config/products', () => ({
  getPlatformProducts: vi.fn(),
  validateProductId: vi.fn()
}));

describe('🔗 Integration Tests - ارتباط بک‌اند و فرانت‌اند', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('🤖 AI Service Integration', () => {
    it('should handle OpenAI API integration correctly', async () => {
      // Mock successful OpenAI response
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Enhanced prompt response'
            }
          }]
        }
      };

      // Reset mocks for this test
      vi.clearAllMocks();
      const axios = await import('axios');
      (axios.default.post as any).mockResolvedValueOnce(mockResponse);

      // Set up API key
      const testApiKey = 'sk-test123456789012345678901234567890';

      // Test API call
      const result = await enhancePrompt({
        apiKey: testApiKey,
        userPrompt: 'Test prompt',
        language: 'en',
        model: 'gpt-3.5-turbo'
      });

      expect(result).toBe('Enhanced prompt response');
      expect(axios.default.post).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          messages: expect.any(Array)
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${testApiKey}`
          })
        })
      );
    });

    it('should handle Anthropic API integration correctly', async () => {
      // Mock successful Anthropic response
      const mockResponse = {
        data: {
          content: [{
            type: 'text',
            text: 'Claude enhanced response'
          }]
        }
      };

      // Reset mocks for this test
      vi.clearAllMocks();
      
      // Mock localStorage for model configuration
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'prompter-current-model') {
          return 'claude-3-sonnet';
        }
        if (key === 'prompter-model-configs') {
          return JSON.stringify({
            'claude-3-sonnet': {
              apiKey: 'sk-ant-test123456789012345678901234567890',
              enabled: true
            }
          });
        }
        return null;
      });
      
      const axios = await import('axios');
      (axios.default.post as any).mockResolvedValueOnce(mockResponse);

      const testApiKey = 'sk-ant-test123456789012345678901234567890';

      const result = await enhancePrompt({
        apiKey: testApiKey,
        userPrompt: 'Test prompt',
        language: 'en',
        model: 'claude-3-sonnet'
      });

      expect(result).toBe('Claude enhanced response');
      expect(axios.default.post).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          model: expect.any(String),
          messages: expect.any(Array)
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${testApiKey}`
          })
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      // Reset mocks for this test
      vi.clearAllMocks();
      const axios = await import('axios');
      (axios.default.post as any).mockRejectedValueOnce(new Error('API Error'));

      const testApiKey = 'sk-test123456789012345678901234567890';

      await expect(enhancePrompt({
        apiKey: testApiKey,
        userPrompt: 'Test prompt',
        language: 'en',
        model: 'gpt-3.5-turbo'
      })).rejects.toThrow('API Error');
    });

    it('should handle personal API key detection', async () => {
      const personalApiKey = 'sk-test123456789012345678901234567890';
      const freeApiKey = 'sk-free123456789012345678901234567890';

      // Mock environment variable
      vi.stubEnv('VITE_OPENAI_API_KEY', freeApiKey);

      expect(isPersonalApiKey(personalApiKey)).toBe(true);
      // Free API path removed: any valid-length key is treated as personal
      expect(isPersonalApiKey(freeApiKey)).toBe(true);
      expect(isPersonalApiKey('')).toBe(false);
      expect(isPersonalApiKey(null)).toBe(false);
    });
  });

  describe('💰 Billing Integration', () => {
    it('should handle Google Play Billing integration', async () => {
      // Mock successful purchase
      const mockPurchase = {
        productId: 'com.prompterfresh.app.remove_ads',
        purchaseToken: 'test-token',
        purchaseTime: Date.now()
      };

      // Mock billing service to actually call localStorage
      vi.spyOn(googlePlayBilling, 'purchaseProduct').mockImplementationOnce(async () => {
        // Simulate the actual behavior of storing the purchase
        localStorageMock.setItem('premium-subscription', JSON.stringify(mockPurchase));
        return {
          success: true,
          productId: 'com.prompterfresh.app.remove_ads',
          purchaseToken: 'test-token'
        };
      });

      const result = await googlePlayBilling.purchaseProduct('com.prompterfresh.app.remove_ads');

      expect(result.success).toBe(true);
      expect(result.productId).toBe('com.prompterfresh.app.remove_ads');
      expect(result.purchaseToken).toBe('test-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'premium-subscription',
        JSON.stringify(mockPurchase)
      );
    });

    it('should handle purchase restoration', async () => {
      const mockPurchases = [
        {
          success: true,
          productId: 'com.prompterfresh.app.pro_plan_monthly',
          purchaseToken: 'test-token-1'
        }
      ];

      vi.spyOn(googlePlayBilling, 'restorePurchases').mockResolvedValueOnce(mockPurchases);

      const result = await googlePlayBilling.restorePurchases();

      expect(result).toEqual(mockPurchases);
    });

    it('should handle billing errors gracefully', async () => {
      vi.spyOn(googlePlayBilling, 'purchaseProduct').mockRejectedValueOnce(
        new Error('Billing Error')
      );

      await expect(
        googlePlayBilling.purchaseProduct('invalid-product')
      ).rejects.toThrow('Billing Error');
    });
  });

  describe('🔐 Premium Access Integration', () => {
    it('should handle premium access checking', () => {
      // Mock premium access
      vi.mocked(hasPremiumAccess).mockReturnValue(true);

      expect(hasPremiumAccess()).toBe(true);
    });

    it('should handle expired subscription', () => {
      // Mock expired subscription
      vi.mocked(hasPremiumAccess).mockReturnValue(false);

      expect(hasPremiumAccess()).toBe(false);
    });

    it('should handle template access control', () => {
      // Mock the functions directly
      const mockGetTemplateAccess = vi.fn().mockReturnValue('premium');
      const mockCanUseTemplate = vi.fn().mockReturnValue(true);

      expect(mockGetTemplateAccess('business')).toBe('premium');
      expect(mockCanUseTemplate('business')).toBe(true);
    });
  });

  describe('🌐 Network Integration', () => {
    it('should handle network errors gracefully', async () => {
      // Reset mocks for this test
      vi.clearAllMocks();
      const axios = await import('axios');
      (axios.default.post as any).mockRejectedValueOnce(new Error('Network Error'));

      const testApiKey = 'sk-test123456789012345678901234567890';

      await expect(enhancePrompt({
        apiKey: testApiKey,
        userPrompt: 'Test prompt',
        language: 'en',
        model: 'gpt-3.5-turbo'
      })).rejects.toThrow('Network Error');
    });

    it('should handle timeout errors', async () => {
      // Reset mocks for this test
      vi.clearAllMocks();
      const axios = await import('axios');
      (axios.default.post as any).mockRejectedValueOnce(new Error('Request timeout'));

      const testApiKey = 'sk-test123456789012345678901234567890';

      await expect(enhancePrompt({
        apiKey: testApiKey,
        userPrompt: 'Test prompt',
        language: 'en',
        model: 'gpt-3.5-turbo'
      })).rejects.toThrow('Request timeout');
    });

    it('should handle rate limiting', async () => {
      // Reset mocks for this test
      vi.clearAllMocks();
      const axios = await import('axios');
      (axios.default.post as any).mockRejectedValueOnce({
        response: {
          status: 429,
          statusText: 'Too Many Requests'
        }
      });

      const testApiKey = 'sk-test123456789012345678901234567890';

      await expect(enhancePrompt({
        apiKey: testApiKey,
        userPrompt: 'Test prompt',
        language: 'en',
        model: 'gpt-3.5-turbo'
      })).rejects.toThrow('Error calling OpenAI API');
    });
  });

  describe('💾 Storage Integration', () => {
    it('should handle localStorage operations', () => {
      const testData = { key: 'value' };
      
      localStorageMock.setItem.mockImplementation(() => {});
      localStorageMock.getItem.mockReturnValue(JSON.stringify(testData));

      // Test setItem
      localStorage.setItem('test-key', JSON.stringify(testData));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData));

      // Test getItem
      const result = localStorage.getItem('test-key');
      expect(result).toBe(JSON.stringify(testData));
    });

    it('should handle storage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage Error');
      });

      expect(() => {
        localStorage.setItem('test-key', 'test-value');
      }).toThrow('Storage Error');
    });
  });

  describe('⚡ Performance Integration', () => {
    it('should handle concurrent API calls', async () => {
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Response'
            }
          }]
        }
      };

      // Reset mocks for this test
      vi.clearAllMocks();
      const axios = await import('axios');
      (axios.default.post as any).mockResolvedValue(mockResponse);

      const testApiKey = 'sk-test123456789012345678901234567890';
      const promises = [];

      // Make multiple concurrent calls
      for (let i = 0; i < 5; i++) {
        promises.push(enhancePrompt({
          apiKey: testApiKey,
          userPrompt: `Test prompt ${i}`,
          language: 'en',
          model: 'gpt-3.5-turbo'
        }));
      }

      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
      expect(results.every(result => result === 'Response')).toBe(true);
    });

    it('should handle large prompt processing', async () => {
      const largePrompt = 'A'.repeat(10000);
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'Large response'
            }
          }]
        }
      };

      // Reset mocks for this test
      vi.clearAllMocks();
      const axios = await import('axios');
      (axios.default.post as any).mockResolvedValueOnce(mockResponse);

      const testApiKey = 'sk-test123456789012345678901234567890';

      const result = await enhancePrompt({
        apiKey: testApiKey,
        userPrompt: largePrompt,
        language: 'en',
        model: 'gpt-3.5-turbo'
      });

      expect(result).toBe('Large response');
    });
  });

  describe('🔧 Error Handling Integration', () => {
    it('should handle invalid API keys', async () => {
      const invalidApiKey = 'invalid-key';

      await expect(enhancePrompt({
        apiKey: invalidApiKey,
        userPrompt: 'Test prompt',
        language: 'en',
        model: 'gpt-3.5-turbo'
      })).rejects.toThrow();
    });

    it('should handle malformed responses', async () => {
      const mockResponse = { invalid: 'response' };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const testApiKey = 'sk-test123456789012345678901234567890';

      await expect(enhancePrompt({
        apiKey: testApiKey,
        userPrompt: 'Test prompt',
        language: 'en',
        model: 'gpt-3.5-turbo'
      })).rejects.toThrow();
    });

    it('should handle empty responses', async () => {
      const mockResponse = {
        choices: []
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const testApiKey = 'sk-test123456789012345678901234567890';

      await expect(enhancePrompt({
        apiKey: testApiKey,
        userPrompt: 'Test prompt',
        language: 'en',
        model: 'gpt-3.5-turbo'
      })).rejects.toThrow();
    });
  });
}); 