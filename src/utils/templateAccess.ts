// Template Gallery Access Management
// Manages free tier limitations and premium features

export interface TemplateAccess {
  isPremium: boolean;
  monthlyUsage: number;
  maxFreeUsage: number;
  canCreateCustom: boolean;
  canAccessHistory: boolean;
  canRate: boolean;
  canExport: boolean;
  canAdvancedSearch: boolean;
  canAccessPremiumTemplates: boolean;
  canRemoveAds: boolean;
}

export interface TemplateUsage {
  monthlyUsage: number;
  lastResetDate: string;
  currentMonth: string;
}

// Free tier configuration
export const FREE_TIER_CONFIG = {
  maxMonthlyTemplates: 3,
  features: {
    basicTemplates: true,
    search: true,
    filter: true,
    viewTemplates: true
  }
} as const;

// Premium tier configuration
export const PREMIUM_TIER_CONFIG = {
  maxMonthlyTemplates: -1, // unlimited
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
} as const;

// Get current template usage
export const getTemplateUsage = (): TemplateUsage => {
  try {
    const usageData = localStorage.getItem('template-usage');
    if (!usageData) {
      return {
        monthlyUsage: 0,
        lastResetDate: new Date().toISOString(),
        currentMonth: new Date().toISOString().slice(0, 7) // YYYY-MM
      };
    }
    
    const usage = JSON.parse(usageData);
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Reset usage if month changed
    if (usage.currentMonth !== currentMonth) {
      const newUsage: TemplateUsage = {
        monthlyUsage: 0,
        lastResetDate: new Date().toISOString(),
        currentMonth
      };
      localStorage.setItem('template-usage', JSON.stringify(newUsage));
      return newUsage;
    }
    
    return usage;
  } catch (error) {
    console.error('Error getting template usage:', error);
    return {
      monthlyUsage: 0,
      lastResetDate: new Date().toISOString(),
      currentMonth: new Date().toISOString().slice(0, 7)
    };
  }
};

// Increment template usage
export const incrementTemplateUsage = (): void => {
  try {
    const usage = getTemplateUsage();
    usage.monthlyUsage += 1;
    localStorage.setItem('template-usage', JSON.stringify(usage));
  } catch (error) {
    console.error('Error incrementing template usage:', error);
  }
};

// Check if user has premium access
export const hasPremiumAccess = (): boolean => {
  try {
    const premiumData = localStorage.getItem('premium-subscription');
    if (!premiumData) return false;
    
    const subscription = JSON.parse(premiumData);
    const now = new Date().getTime();
    
    // Check if subscription is active
    return subscription.expiresAt > now && subscription.status === 'active';
  } catch (error) {
    console.error('Error checking premium access:', error);
    return false;
  }
};

// Get current template access
export const getTemplateAccess = (): TemplateAccess => {
  const isPremium = hasPremiumAccess();
  const usage = getTemplateUsage();
  
  return {
    isPremium,
    monthlyUsage: usage.monthlyUsage,
    maxFreeUsage: FREE_TIER_CONFIG.maxMonthlyTemplates,
    canCreateCustom: isPremium,
    canAccessHistory: isPremium,
    canRate: isPremium,
    canExport: isPremium,
    canAdvancedSearch: isPremium,
    canAccessPremiumTemplates: isPremium,
    canRemoveAds: isPremium
  };
};

// Check if user can use template
export const canUseTemplate = (): boolean => {
  const access = getTemplateAccess();
  
  if (access.isPremium) {
    return true; // Premium users have unlimited access
  }
  
  return access.monthlyUsage < access.maxFreeUsage;
};

// Get remaining free templates
export const getRemainingFreeTemplates = (): number => {
  const access = getTemplateAccess();
  
  if (access.isPremium) {
    return -1; // Unlimited for premium users
  }
  
  return Math.max(0, access.maxFreeUsage - access.monthlyUsage);
};

// Save premium subscription
export const savePremiumSubscription = (subscriptionData: {
  productId: string;
  purchaseToken: string;
  expiresAt: number;
  status: string;
}): void => {
  try {
    localStorage.setItem('premium-subscription', JSON.stringify({
      ...subscriptionData,
      purchasedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error saving premium subscription:', error);
  }
};

// Clear premium subscription
export const clearPremiumSubscription = (): void => {
  try {
    localStorage.removeItem('premium-subscription');
  } catch (error) {
    console.error('Error clearing premium subscription:', error);
  }
};

// Get subscription info
export const getSubscriptionInfo = () => {
  try {
    const premiumData = localStorage.getItem('premium-subscription');
    if (!premiumData) return null;
    
    return JSON.parse(premiumData);
  } catch (error) {
    console.error('Error getting subscription info:', error);
    return null;
  }
};

// Check if user can remove ads
export const canRemoveAds = (): boolean => {
  return hasPremiumAccess();
};

// Get ad status
export const shouldShowAds = (): boolean => {
  return !hasPremiumAccess();
}; 