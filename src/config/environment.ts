// Environment Configuration
export interface EnvironmentConfig {
  appTitle: string;
  appVersion: string;
  isDevelopment: boolean;
  isProduction: boolean;
  // Payment Configuration
  payments: {
    enabled: boolean;
    allowedRegions: string[];
    blockedRegions: string[];
    reason?: string;
  };
}

// Detect user's region/country
const detectUserRegion = (): string => {
  try {
    // Method 1: Browser language
    const language = navigator.language || 'en-US';
    if (language.includes('fa') || language.includes('ir')) return 'IR';
    
    // Method 2: Timezone detection for Iran
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Tehran') || timezone.includes('Iran')) return 'IR';
    
    // Method 3: Check for Persian/Farsi in accepted languages
    const languages = navigator.languages || [];
    for (const lang of languages) {
      if (lang.includes('fa') || lang.includes('ir')) return 'IR';
    }
    
    return 'UNKNOWN';
  } catch (error) {
    return 'UNKNOWN';
  }
};

// Get environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  const userRegion = detectUserRegion();
  
  // Payment configuration based on region and environment variables
  const forceDisabled = import.meta.env.VITE_FORCE_DISABLE_PAYMENTS === 'true';
  const globallyDisabled = import.meta.env.VITE_ENABLE_PAYMENTS === 'false';
  const regionBlocked = ['IR'].includes(userRegion);
  
  const paymentsEnabled = !forceDisabled && !globallyDisabled && !regionBlocked;

  return {
    appTitle: import.meta.env.VITE_APP_TITLE || 'Prompter Fresh',
    appVersion: import.meta.env.VITE_APP_VERSION || '2.0.0',
    isDevelopment,
    isProduction,
    payments: {
      enabled: paymentsEnabled,
      allowedRegions: ['US', 'EU', 'UK', 'CA', 'AU', 'JP', 'KR'],
      blockedRegions: ['IR', 'CU', 'KP', 'SY'],
      reason: forceDisabled ? 
        'پرداخت‌ها به صورت دستی غیرفعال شده‌اند' :
        globallyDisabled ?
        'پرداخت‌ها در حال حاضر غیرفعال هستند' :
        regionBlocked ? 
        'متأسفانه به دلیل محدودیت‌های بانکی، پرداخت در ایران فعلاً امکان‌پذیر نیست' : 
        'Payments are not available in your region'
    }
  };
};

// Validate environment configuration
export const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!import.meta.env.VITE_APP_TITLE) {
    errors.push('VITE_APP_TITLE is not set');
  }
  
  if (!import.meta.env.VITE_APP_VERSION) {
    errors.push('VITE_APP_VERSION is not set');
  }
  
  // Free/shared API key removed: do not require a global VITE_OPENAI_API_KEY
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Check if payments are enabled
export const isPaymentsEnabled = (): boolean => {
  const config = getEnvironmentConfig();
  return config.payments.enabled;
};

// Get payment disabled reason
export const getPaymentDisabledReason = (): string => {
  const config = getEnvironmentConfig();
  return config.payments.reason || 'Payments are not available';
};

// Export current config
export const ENV = getEnvironmentConfig(); 