// Application Configuration
export const config = {
  // App Information
  app: {
    name: import.meta.env.VITE_APP_NAME || 'PromptCraft',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.NODE_ENV || 'development',
    debug: import.meta.env.VITE_DEBUG === 'true' || false,
    mockMode: import.meta.env.VITE_MOCK_MODE === 'true' || true
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
    timeout: 30000, // 30 seconds
    retries: 3
  },

  // Authentication Configuration
  auth: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || 'dev-jwt-secret-key',
    refreshTokenSecret: import.meta.env.VITE_REFRESH_TOKEN_SECRET || 'dev-refresh-secret-key',
    tokenExpiry: '24h',
    refreshTokenExpiry: '7d'
  },

  // Payment Gateway Configuration
  payment: {
    defaultGateway: import.meta.env.VITE_PAYMENT_GATEWAY || 'zarinpal',
    gateways: {
      zarinpal: {
        merchantId: import.meta.env.VITE_ZARINPAL_MERCHANT_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        sandbox: import.meta.env.NODE_ENV !== 'production'
      },
      idpay: {
        apiKey: import.meta.env.VITE_IDPAY_API_KEY || 'demo-idpay-key',
        sandbox: import.meta.env.NODE_ENV !== 'production'
      },
      nextpay: {
        apiKey: import.meta.env.VITE_NEXTPAY_API_KEY || 'demo-nextpay-key'
      },
      payir: {
        apiKey: import.meta.env.VITE_PAYIR_API_KEY || 'demo-payir-key'
      },
      zibal: {
        merchant: import.meta.env.VITE_ZIBAL_MERCHANT || 'zibal'
      },
      googleplay: {
        packageName: import.meta.env.VITE_GOOGLE_PLAY_PACKAGE_NAME || 'com.prompterfresh.app',
        serviceAccountKey: import.meta.env.VITE_GOOGLE_PLAY_SERVICE_KEY || '',
        publicKey: import.meta.env.VITE_GOOGLE_PLAY_PUBLIC_KEY || '',
        sandbox: import.meta.env.NODE_ENV !== 'production'
      }
    }
  },

  // Google Play Billing Configuration
  googlePlay: {
    // Product IDs for in-app purchases
    products: {
      removeAds: 'com.prompterfresh.app.remove_ads',
      tokens1000: 'tokens_1000_pack',
      tokens5000: 'tokens_5000_pack',
      tokens10000: 'tokens_10000_pack',
      // Add more product IDs as needed
    },
    
    // Subscription IDs
    subscriptions: {
      proMonthly: 'com.prompterfresh.app.pro_plan_monthly',
      proYearly: 'com.prompterfresh.app.pro_plan_yearly',
      premiumMonthly: 'com.prompterfresh.app.pro_plan_monthly',
      premiumYearly: 'com.prompterfresh.app.pro_plan_yearly'
    },

    // Billing client configuration
    client: {
      enablePendingPurchases: true,
      obfuscatedAccountId: import.meta.env.VITE_GOOGLE_PLAY_OBFUSCATED_ID || '',
      obfuscatedProfileId: import.meta.env.VITE_GOOGLE_PLAY_PROFILE_ID || ''
    },

    // Client-side verification only (server removed)
    verification: {
      endpoint: '',
      timeout: 30000
    }
  },

  // AI Services Configuration
  ai: {
    services: {
      openai: {
        apiKey: '', // user-provided only
        model: 'gpt-4o-mini',
        maxTokens: 4000
      },
      anthropic: {
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 4000
      },
      google: {
        apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY || '',
        model: 'gemini-pro',
        maxTokens: 4000
      }
    },
    defaultService: 'openai',
    fallbackService: 'anthropic'
  },







  // Security Configuration
  security: {
    corsOrigin: import.meta.env.VITE_CORS_ORIGIN || 'http://localhost:3000',
    rateLimit: {
      windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutes
      maxRequests: parseInt(import.meta.env.VITE_RATE_LIMIT_MAX_REQUESTS || '100')
    },
    encryption: {
      algorithm: 'aes-256-gcm',
      keyLength: 32
    }
  },

  // Feature Flags
  features: {
    enablePayments: true,
    enableSocialLogin: false, // Server removed
    enableEmailVerification: false, // Server removed
    enableTwoFactor: false,
    enableAnalytics: false,
    enableDebugMode: import.meta.env.NODE_ENV === 'development',
    enableGooglePlayBilling: true
  },

  // UI Configuration
  ui: {
    theme: {
      default: 'light',
      storageKey: 'promptcraft-theme'
    },
    language: {
      default: 'en',
      storageKey: 'promptcraft-language'
    },
    animation: {
      enabled: true,
      duration: 300
    }
  },

  // Storage Configuration
  storage: {
    keys: {
      authToken: 'prompter-auth-token',
      refreshToken: 'prompter-refresh-token',
      user: 'prompter-user-data',
      apiUsage: 'prompter-api-usage',
      adFreePurchase: 'prompter-ad-free-purchase',
      proSubscription: 'prompter-pro-subscription',
      prompts: 'prompter-saved-prompts',
      settings: 'prompter-user-settings',
      googlePlayPurchases: 'prompter-gplay-purchases'
    }
  },

  // Development Configuration
  development: {
    enableLogging: true,
    enableMockData: import.meta.env.VITE_MOCK_MODE === 'true',
    enableDevTools: import.meta.env.NODE_ENV === 'development',
    hotReload: true
  }
};

// Type definitions for better TypeScript support
export type Config = typeof config;

// Define specific types for payment gateways
export interface ZarinpalConfig {
  merchantId: string;
  sandbox: boolean;
}

export interface IdpayConfig {
  apiKey: string;
  sandbox: boolean;
}

export interface NextpayConfig {
  apiKey: string;
}

export interface PayirConfig {
  apiKey: string;
}

export interface ZibalConfig {
  merchant: string;
}

export interface GooglePlayConfig {
  packageName: string;
  serviceAccountKey: string;
  publicKey: string;
  sandbox: boolean;
}

export type PaymentGatewayConfig = {
  zarinpal: ZarinpalConfig;
  idpay: IdpayConfig;
  nextpay: NextpayConfig;
  payir: PayirConfig;
  zibal: ZibalConfig;
  googleplay: GooglePlayConfig;
};

export type PaymentGateway = keyof PaymentGatewayConfig;
export type AIService = keyof typeof config.ai.services;


// Google Play specific types
export type GooglePlayProduct = keyof typeof config.googlePlay.products;
export type GooglePlaySubscription = keyof typeof config.googlePlay.subscriptions;

// Helper functions
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.backendUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};

export const getPaymentConfig = <T extends PaymentGateway>(gateway: T): PaymentGatewayConfig[T] => {
  return config.payment.gateways[gateway];
};

export const getAIConfig = (service: AIService) => {
  return config.ai.services[service];
};

// export const getSocialConfig = (provider: SocialProvider) => {
//   return config.social[provider];
// };

export const getGooglePlayProduct = (product: GooglePlayProduct): string => {
  return config.googlePlay.products[product];
};

export const getGooglePlaySubscription = (subscription: GooglePlaySubscription): string => {
  return config.googlePlay.subscriptions[subscription];
};

export const isProduction = () => {
  return config.app.environment === 'production';
};

export const isDevelopment = () => {
  return config.app.environment === 'development';
};

export const isMockMode = () => {
  return config.app.mockMode;
};

export const isGooglePlayEnabled = () => {
  return config.features.enableGooglePlayBilling;
};

// Export default config
export default config; 