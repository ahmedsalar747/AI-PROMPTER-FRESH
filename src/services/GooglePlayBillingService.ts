/**
 * 🛒 Google Play Billing Service
 * Simple implementation for testing Google Play Billing
 */


export interface BillingProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  type: 'inapp' | 'subs';
}

export interface PurchaseResult {
  success: boolean;
  productId: string;
  purchaseToken?: string;
  error?: string;
}

export class GooglePlayBillingService {
  private static instance: GooglePlayBillingService;
  private isInitialized = false;

  // Product definitions
  private products: BillingProduct[] = [
    {
      id: 'com.prompterfresh.app.remove_ads',
      title: 'Remove Ads + Premium Templates',
      description: 'Remove all advertisements and unlock premium templates',
      price: '$7.99',
      type: 'inapp'
    },
    {
      id: 'com.prompterfresh.app.pro_plan_monthly',
      title: 'Pro Plan Monthly',
      description: '50,000 tokens per month + unlimited features',
      price: '$9.99/month',
      type: 'subs'
    },
    {
      id: 'com.prompterfresh.app.pro_plan_yearly',
      title: 'Pro Plan Yearly',
      description: '50,000 tokens per year + unlimited features',
      price: '$99.99/year',
      type: 'subs'
    }
  ];

  static getInstance(): GooglePlayBillingService {
    if (!GooglePlayBillingService.instance) {
      GooglePlayBillingService.instance = new GooglePlayBillingService();
    }
    return GooglePlayBillingService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // Simulate initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isInitialized = true;
      console.log('✅ Google Play Billing initialized');
      return true;
    } catch (error) {
      console.error('❌ Google Play Billing initialization failed:', error);
      return false;
    }
  }

  async getProducts(): Promise<BillingProduct[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.products;
  }

  async purchaseProduct(productId: string): Promise<PurchaseResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Simulate purchase process
      console.log(`🛒 Attempting to purchase: ${productId}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful purchase
      const result: PurchaseResult = {
        success: true,
        productId,
        purchaseToken: `mock_token_${Date.now()}`
      };

      // Store purchase in localStorage
      this.storePurchase(productId, result.purchaseToken!);
      
      console.log(`✅ Purchase successful: ${productId}`);
      return result;
    } catch (error) {
      console.error(`❌ Purchase failed: ${productId}`, error);
      return {
        success: false,
        productId,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async restorePurchases(): Promise<PurchaseResult[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Get stored purchases from localStorage
      const storedPurchases = this.getStoredPurchases();
      console.log(`🔄 Restored ${storedPurchases.length} purchases`);
      return storedPurchases.map(purchase => ({
        success: true,
        productId: purchase.productId,
        purchaseToken: purchase.purchaseToken
      }));
    } catch (error) {
      console.error('❌ Restore purchases failed:', error);
      return [];
    }
  }

  async isProductPurchased(productId: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const storedPurchases = this.getStoredPurchases();
    return storedPurchases.some(purchase => purchase.productId === productId);
  }

  private storePurchase(productId: string, purchaseToken: string): void {
    try {
      const purchases = this.getStoredPurchases();
      purchases.push({ productId, purchaseToken, timestamp: Date.now() });
      localStorage.setItem('prompter-gplay-purchases', JSON.stringify(purchases));
    } catch (error) {
      console.error('Failed to store purchase:', error);
    }
  }

  private getStoredPurchases(): Array<{productId: string, purchaseToken: string, timestamp: number}> {
    try {
      const stored = localStorage.getItem('prompter-gplay-purchases');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get stored purchases:', error);
      return [];
    }
  }

  // Test methods for development
  async testPurchase(productId: string): Promise<PurchaseResult> {
    console.log(`🧪 Testing purchase for: ${productId}`);
    return this.purchaseProduct(productId);
  }

  async clearTestPurchases(): Promise<void> {
    localStorage.removeItem('prompter-gplay-purchases');
    console.log('🧹 Test purchases cleared');
  }
}

// Export singleton instance
export const googlePlayBilling = GooglePlayBillingService.getInstance(); 