// 🚀 Production Configuration
// این فایل تنظیمات production را مدیریت می‌کند

export const PRODUCTION_CONFIG = {
  // App Information
  app: {
    version: '1.0.0',
    buildNumber: 1,
    environment: 'production' as const,
    packageName: 'com.prompterfresh.app'
  },

  // API Configuration
  api: {
    openAI: {
      model: 'gpt-3.5-turbo',
      maxTokensPerRequest: 4000,
      temperature: 0.7
    },
    freeApi: {
      maxTokensPerMonth: 200, // کاهش از 500 به 200
      maxRequestsPerMonth: 3,
      resetDay: 1
    }
  },

  // Security Settings
  security: {
    enableReceiptValidation: true,
    enableServerValidation: false, // Server removed - client-side validation only
    enableDeviceFingerprinting: true,
    enableBehaviorAnalysis: true,
    suspiciousActivityAction: 'block' as const,
    minimumSecurityScore: 70,
    maxReceiptAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  },

  // Analytics & Monitoring
  analytics: {
    enabled: true,
    errorTracking: true,
    performanceMonitoring: true,
    userBehaviorTracking: true,
    revenueTracking: true
  },

  // Feature Flags
  features: {
    enableDevFeatures: false,
    enableDebugLogging: false,
    enableMockPurchases: false,
    enableOfflineMode: true,
    enablePWA: true,
    enableMultiLanguage: true
  },

  // Performance Settings
  performance: {
    enableCodeSplitting: true,
    enableBundleOptimization: true,
    enableServiceWorker: true,
    cacheDuration: 86400, // 24 hours
    maxBundleSize: 2048, // 2MB
    enableCompression: true
  },

  // Billing Configuration
  billing: {
    products: {
      removeAds: 'com.prompterfresh.app.remove_ads',
      proPlanMonthly: 'com.prompterfresh.app.pro_plan_monthly'
    },
    features: {
      enableGracePeriod: true,
      gracePeriodDays: 7,
      enableProration: true,
      autoRenewDefault: true
    }
  },

  // Content & Localization
  content: {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'fa', 'ar', 'tr', 'ur', 'es', 'fr', 'de'],
    fallbackLanguage: 'en',
    enableRTL: true,
    errorMessagesLanguage: 'en', // Primary language for error messages
    autoDetectLanguage: true // Auto-detect user's preferred language
  },

  // Rate Limiting
  rateLimiting: {
    enabled: true,
    maxRequestsPerMinute: 10,
    maxRequestsPerHour: 100,
    blockDuration: 300000 // 5 minutes
  },

  // Support & Legal
  support: {
    email: 'support@prompterfresh.com',
    website: 'https://prompterfresh.com',
    privacyPolicy: 'https://prompterfresh.com/privacy',
    termsOfService: 'https://prompterfresh.com/terms',
    helpCenter: 'https://help.prompterfresh.com'
  },

  // Social Links
  social: {
    twitter: 'https://twitter.com/prompterfresh',
    linkedin: 'https://linkedin.com/company/prompterfresh',
    youtube: 'https://youtube.com/@prompterfresh'
  }
};

// Environment validation
export const validateProductionConfig = (): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check environment variables
  // Free/shared API key removed: no global VITE_OPENAI_API_KEY validation

  // Check security settings
  if (!PRODUCTION_CONFIG.security.enableReceiptValidation) {
    warnings.push('Receipt validation is disabled in production');
  }

  if (!PRODUCTION_CONFIG.analytics.enabled) {
    warnings.push('Analytics are disabled in production');
  }

  // Check feature flags
  if (PRODUCTION_CONFIG.features.enableDevFeatures) {
    warnings.push('Development features are enabled in production');
  }

  if (PRODUCTION_CONFIG.features.enableDebugLogging) {
    warnings.push('Debug logging is enabled in production');
  }

  if (PRODUCTION_CONFIG.features.enableMockPurchases) {
    errors.push('Mock purchases are enabled in production');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Production readiness check
export const checkProductionReadiness = (): {
  ready: boolean;
  checklist: Array<{
    item: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }>;
} => {
  const checklist = [
    // Global API key checklist removed; keys are provided by user at runtime
    {
      item: 'Security',
      status: (PRODUCTION_CONFIG.security.enableReceiptValidation ? 'pass' : 'warning') as 'pass' | 'warning',
      message: PRODUCTION_CONFIG.security.enableReceiptValidation ? 'Security enabled' : 'Receipt validation disabled'
    },
    {
      item: 'Analytics',
      status: (PRODUCTION_CONFIG.analytics.enabled ? 'pass' : 'warning') as 'pass' | 'warning',
      message: PRODUCTION_CONFIG.analytics.enabled ? 'Analytics enabled' : 'Analytics disabled'
    },
    {
      item: 'Mock Features',
      status: (!PRODUCTION_CONFIG.features.enableMockPurchases ? 'pass' : 'fail') as 'pass' | 'fail',
      message: !PRODUCTION_CONFIG.features.enableMockPurchases ? 'Mock features disabled' : 'Mock purchases still enabled'
    },
    {
      item: 'Performance',
      status: (PRODUCTION_CONFIG.performance.enableBundleOptimization ? 'pass' : 'warning') as 'pass' | 'warning',
      message: PRODUCTION_CONFIG.performance.enableBundleOptimization ? 'Optimizations enabled' : 'Bundle optimization disabled'
    },
    {
      item: 'Support Info',
      status: (PRODUCTION_CONFIG.support.email !== 'support@example.com' ? 'pass' : 'fail') as 'pass' | 'fail',
      message: PRODUCTION_CONFIG.support.email !== 'support@example.com' ? 'Support contact configured' : 'Support email needs updating'
    }
  ];

  const ready = checklist.every(item => item.status === 'pass');

  return { ready, checklist };
};

// Export for use in app
export default PRODUCTION_CONFIG; 