// 🛒 Product Configuration for Google Play Store & App Store
// این فایل تمام Product IDs را مدیریت می‌کند

export const APP_CONFIG = {
  // App Identity
  appId: 'com.prompterfresh.app',
  appName: 'Prompter Fresh',
  
  // Platform Detection
  supportedPlatforms: ['android', 'ios', 'web'] as const,
  
  // Release Configuration
  isProduction: import.meta.env.MODE === 'production',
  
  // API Configuration
  enableServerValidation: false, // Server removed - client-side validation only
  serverValidationUrl: ''
};

// 🛒 Google Play Store Product IDs
export const GOOGLE_PLAY_PRODUCTS = {
  // In-App Purchases (one-time)
  REMOVE_ADS: 'com.prompterfresh.app.remove_ads',
  
  // Subscriptions
  PRO_PLAN_MONTHLY: 'com.prompterfresh.app.pro_plan_monthly',
  PRO_PLAN_YEARLY: 'com.prompterfresh.app.pro_plan_yearly'
} as const;

// 🍎 App Store Product IDs
export const APP_STORE_PRODUCTS = {
  // In-App Purchases (one-time)
  REMOVE_ADS: 'com.prompterfresh.app.remove_ads',
  
  // Subscriptions
  PRO_PLAN_MONTHLY: 'com.prompterfresh.app.pro_plan_monthly',
  PRO_PLAN_YEARLY: 'com.prompterfresh.app.pro_plan_yearly'
} as const;

// 🎯 Active Product Configuration (simplified 2-tier system)
export const ACTIVE_PRODUCTS = {
  // Tier 1: Remove Ads (one-time purchase)
  REMOVE_ADS: {
    android: GOOGLE_PLAY_PRODUCTS.REMOVE_ADS,
    ios: APP_STORE_PRODUCTS.REMOVE_ADS,
    type: 'inapp' as const,
    price: '$7.99',
    features: {
      removeAds: true,
      premiumTemplates: true,
      basicSupport: true
    }
  },
  
  // Tier 2: Pro Plan Monthly (subscription)
  PRO_PLAN_MONTHLY: {
    android: GOOGLE_PLAY_PRODUCTS.PRO_PLAN_MONTHLY,
    ios: APP_STORE_PRODUCTS.PRO_PLAN_MONTHLY,
    type: 'subs' as const,
    price: '$7.99/month',
    features: {
      unlimitedTemplates: true,
      customTemplates: true,
      templateHistory: true,
      templateRating: true,
      templateExport: true,
      advancedSearch: true,
      premiumTemplates: true,
      removeAds: true
    }
  },
  
  // Tier 3: Pro Plan Yearly (subscription)
  PRO_PLAN_YEARLY: {
    android: GOOGLE_PLAY_PRODUCTS.PRO_PLAN_YEARLY,
    ios: APP_STORE_PRODUCTS.PRO_PLAN_YEARLY,
    type: 'subs' as const,
    price: '$79.99/year',
    features: {
      unlimitedTemplates: true,
      customTemplates: true,
      templateHistory: true,
      templateRating: true,
      templateExport: true,
      advancedSearch: true,
      premiumTemplates: true,
      removeAds: true,
      annualDiscount: true
    }
  }
} as const;

// 📱 Platform-specific product getter
export const getProductId = (
  productKey: keyof typeof ACTIVE_PRODUCTS,
  platform: 'android' | 'ios' = 'android'
): string => {
  return ACTIVE_PRODUCTS[productKey][platform];
};

// 🛡️ Product validation
export const validateProductId = (productId: string): boolean => {
  const allProductIds: string[] = [
    ...Object.values(GOOGLE_PLAY_PRODUCTS),
    ...Object.values(APP_STORE_PRODUCTS)
  ];
  
  return allProductIds.includes(productId);
};

// 🎯 Get platform products
export const getPlatformProducts = (platform: 'android' | 'ios') => {
  switch (platform) {
    case 'android':
      return GOOGLE_PLAY_PRODUCTS;
    case 'ios':
      return APP_STORE_PRODUCTS;
    default:
      return GOOGLE_PLAY_PRODUCTS;
  }
};

// 📊 Product features mapping
export const getProductFeatures = (productId: string) => {
  // Find which active product this ID belongs to
  for (const [key, product] of Object.entries(ACTIVE_PRODUCTS)) {
    if (product.android === productId || product.ios === productId) {
      return {
        productKey: key,
        features: product.features,
        type: product.type,
        price: product.price
      };
    }
  }
  
  return null;
};

// 🎮 Development/Testing Configuration
export const DEVELOPMENT_CONFIG = {
  enableMockPurchases: APP_CONFIG.isProduction === false,
  mockPurchaseDelay: 2000, // 2 seconds
  skipRealBilling: true,
  testProductIds: {
    // Google Play test product IDs
    android: {
      test_purchased: 'android.test.purchased',
      test_canceled: 'android.test.canceled',
      test_refunded: 'android.test.refunded',
      test_item_unavailable: 'android.test.item_unavailable'
    }
  }
};

// 📈 Analytics events for purchases
export const PURCHASE_EVENTS = {
  PURCHASE_STARTED: 'purchase_started',
  PURCHASE_SUCCESS: 'purchase_success',
  PURCHASE_FAILED: 'purchase_failed',
  PURCHASE_CANCELED: 'purchase_canceled',
  SUBSCRIPTION_RENEWED: 'subscription_renewed',
  SUBSCRIPTION_EXPIRED: 'subscription_expired',
  RESTORE_SUCCESS: 'restore_success',
  RESTORE_FAILED: 'restore_failed'
} as const;

// Export types for TypeScript
export type ProductKey = keyof typeof ACTIVE_PRODUCTS;
export type PlatformType = 'android' | 'ios' | 'web';
export type ProductType = 'inapp' | 'subs';
export type PurchaseEvent = keyof typeof PURCHASE_EVENTS;

// Default export for convenience
export default {
  APP_CONFIG,
  GOOGLE_PLAY_PRODUCTS,
  APP_STORE_PRODUCTS,
  ACTIVE_PRODUCTS,
  getProductId,
  validateProductId,
  getPlatformProducts,
  getProductFeatures,
  DEVELOPMENT_CONFIG,
  PURCHASE_EVENTS
}; 