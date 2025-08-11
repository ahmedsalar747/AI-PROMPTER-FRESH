// Purchase Security Service
// Handles receipt validation, purchase verification, and security measures

import { validateProductId } from '../config/products';

export interface PurchaseValidationResult {
  isValid: boolean;
  error?: string;
  warnings: string[];
  securityScore: number; // 0-100
  recommendations: string[];
}

export interface SecurityReceipt {
  originalJson: string;
  signature: string;
  purchaseToken: string;
  productId: string;
  purchaseTime: number;
  platform: 'android' | 'ios';
}

export class PurchaseSecurityService {
  private static instance: PurchaseSecurityService;
  private securityConfig = {
    enableReceiptValidation: true,
    enableTimestampValidation: true,
    enableSignatureValidation: true,
    maxReceiptAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    minimumSecurityScore: 70,
    enableServerValidation: false, // Server removed - client-side validation only
    serverValidationUrl: ''
  };

  private constructor() {}

  public static getInstance(): PurchaseSecurityService {
    if (!PurchaseSecurityService.instance) {
      PurchaseSecurityService.instance = new PurchaseSecurityService();
    }
    return PurchaseSecurityService.instance;
  }

  /**
   * Validate purchase receipt
   */
  public async validatePurchaseReceipt(receipt: SecurityReceipt): Promise<PurchaseValidationResult> {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let securityScore = 100;
    let isValid = true;

    try {
      console.log('🔍 Validating purchase receipt...');

      // 1. Basic validation
      const basicValidation = this.validateBasicFields(receipt);
      if (!basicValidation.isValid) {
        return {
          isValid: false,
          error: basicValidation.error,
          warnings,
          securityScore: 0,
          recommendations: ['Purchase receipt contains invalid data']
        };
      }

      // 2. Product ID validation
      if (!validateProductId(receipt.productId)) {
        securityScore -= 30;
        warnings.push('Unknown product ID detected');
        recommendations.push('Verify product configuration');
      }

      // 3. Timestamp validation
      if (this.securityConfig.enableTimestampValidation) {
        const timestampCheck = this.validateTimestamp(receipt.purchaseTime);
        if (!timestampCheck.isValid) {
          securityScore -= 20;
          warnings.push(timestampCheck.warning || 'Invalid purchase timestamp');
        }
      }

      // 4. Signature validation (platform specific)
      if (this.securityConfig.enableSignatureValidation) {
        const signatureCheck = await this.validateSignature(receipt);
        if (!signatureCheck.isValid) {
          securityScore -= 40;
          warnings.push('Purchase signature verification failed');
          recommendations.push('Contact support for purchase verification');
        }
      }

      // 5. Duplicate purchase check
      const duplicateCheck = await this.checkDuplicatePurchase(receipt);
      if (duplicateCheck.isDuplicate) {
        securityScore -= 25;
        warnings.push('Potential duplicate purchase detected');
        recommendations.push('Review purchase history');
      }



      // 7. Final security score check
      if (securityScore < this.securityConfig.minimumSecurityScore) {
        isValid = false;
        recommendations.push(`Security score ${securityScore} below minimum threshold ${this.securityConfig.minimumSecurityScore}`);
      }

      // 8. Generate final recommendations
      if (warnings.length > 0) {
        recommendations.push('Review purchase details carefully');
      }

      if (securityScore < 80) {
        recommendations.push('Consider additional verification steps');
      }

      console.log(`✅ Purchase validation completed. Security score: ${securityScore}`);

      return {
        isValid,
        warnings,
        securityScore,
        recommendations
      };

    } catch (error) {
      console.error('❌ Purchase validation failed:', error);
      return {
        isValid: false,
        error: 'Purchase validation system error',
        warnings: ['Validation system encountered an error'],
        securityScore: 0,
        recommendations: ['Contact support for manual verification']
      };
    }
  }

  /**
   * Validate basic receipt fields
   */
  private validateBasicFields(receipt: SecurityReceipt): { isValid: boolean; error?: string } {
    if (!receipt.originalJson) {
      return { isValid: false, error: 'Missing receipt data' };
    }

    if (!receipt.purchaseToken) {
      return { isValid: false, error: 'Missing purchase token' };
    }

    if (!receipt.productId) {
      return { isValid: false, error: 'Missing product ID' };
    }

    if (!receipt.purchaseTime || receipt.purchaseTime <= 0) {
      return { isValid: false, error: 'Invalid purchase timestamp' };
    }

    if (!['android', 'ios'].includes(receipt.platform)) {
      return { isValid: false, error: 'Invalid platform' };
    }

    return { isValid: true };
  }

  /**
   * Validate purchase timestamp
   */
  private validateTimestamp(purchaseTime: number): { isValid: boolean; warning?: string } {
    const now = Date.now();
    const age = now - purchaseTime;

    // Check if purchase is too old
    if (age > this.securityConfig.maxReceiptAge) {
      return {
        isValid: false,
        warning: `Purchase is ${Math.round(age / (24 * 60 * 60 * 1000))} days old`
      };
    }

    // Check if purchase is in the future
    if (purchaseTime > now + (5 * 60 * 1000)) { // 5 minutes tolerance
      return {
        isValid: false,
        warning: 'Purchase timestamp is in the future'
      };
    }

    return { isValid: true };
  }

  /**
   * Validate purchase signature
   */
  private async validateSignature(receipt: SecurityReceipt): Promise<{ isValid: boolean }> {
    try {
      if (receipt.platform === 'android') {
        return await this.validateGooglePlaySignature(receipt);
      } else if (receipt.platform === 'ios') {
        return await this.validateAppStoreSignature(receipt);
      }

      return { isValid: false };
    } catch (error) {
      console.error('❌ Signature validation failed:', error);
      return { isValid: false };
    }
  }

  /**
   * Validate Google Play signature
   */
  private async validateGooglePlaySignature(_receipt: SecurityReceipt): Promise<{ isValid: boolean }> {
    // در production باید از Google Play Developer API استفاده شود
    // فعلاً شبیه‌سازی می‌کنیم
    
    if (import.meta.env.MODE === 'development') {
      console.log('🧪 [DEV] Simulating Google Play signature validation');
      return { isValid: true };
    }

    // TODO: Implement real Google Play signature validation
    // این باید با Google Play Developer API انجام شود
    console.log('⚠️ Google Play signature validation not implemented');
    return { isValid: true }; // فعلاً true برمی‌گردانیم
  }

  /**
   * Validate App Store signature
   */
  private async validateAppStoreSignature(_receipt: SecurityReceipt): Promise<{ isValid: boolean }> {
    // در production باید از App Store Server API استفاده شود
    // فعلاً شبیه‌سازی می‌کنیم
    
    if (import.meta.env.MODE === 'development') {
      console.log('🧪 [DEV] Simulating App Store signature validation');
      return { isValid: true };
    }

    // TODO: Implement real App Store signature validation
    console.log('⚠️ App Store signature validation not implemented');
    return { isValid: true }; // فعلاً true برمی‌گردانیم
  }

  /**
   * Check for duplicate purchases
   */
  private async checkDuplicatePurchase(receipt: SecurityReceipt): Promise<{ isDuplicate: boolean }> {
    try {
      // بررسی در localStorage برای پیدا کردن خریدهای تکراری
      const existingPurchases = this.getStoredPurchases();
      
      const isDuplicate = existingPurchases.some(stored => 
        stored.purchaseToken === receipt.purchaseToken ||
        (stored.productId === receipt.productId && 
         Math.abs(stored.purchaseTime - receipt.purchaseTime) < 60000) // Within 1 minute
      );

      if (!isDuplicate) {
        // ذخیره purchase جدید
        this.storePurchase(receipt);
      }

      return { isDuplicate };
    } catch (error) {
      console.error('❌ Duplicate check failed:', error);
      return { isDuplicate: false };
    }
  }



  /**
   * Get stored purchases
   */
  private getStoredPurchases(): SecurityReceipt[] {
    try {
      const stored = localStorage.getItem('validated-purchases');
      if (!stored) return [];

      const purchases = JSON.parse(stored);
      // Remove old purchases (older than max age)
      const now = Date.now();
      const validPurchases = purchases.filter((p: SecurityReceipt) => 
        now - p.purchaseTime < this.securityConfig.maxReceiptAge
      );

      if (validPurchases.length !== purchases.length) {
        localStorage.setItem('validated-purchases', JSON.stringify(validPurchases));
      }

      return validPurchases;
    } catch (error) {
      console.error('❌ Failed to get stored purchases:', error);
      return [];
    }
  }

  /**
   * Store purchase for duplicate checking
   */
  private storePurchase(receipt: SecurityReceipt): void {
    try {
      const existingPurchases = this.getStoredPurchases();
      existingPurchases.push(receipt);

      // Keep only last 100 purchases
      if (existingPurchases.length > 100) {
        existingPurchases.splice(0, existingPurchases.length - 100);
      }

      localStorage.setItem('validated-purchases', JSON.stringify(existingPurchases));
    } catch (error) {
      console.error('❌ Failed to store purchase:', error);
    }
  }

  /**
   * Create security receipt from purchase data
   */
  public createSecurityReceipt(
    originalJson: string,
    signature: string,
    purchaseToken: string,
    productId: string,
    purchaseTime: number,
    platform: 'android' | 'ios'
  ): SecurityReceipt {
    return {
      originalJson,
      signature,
      purchaseToken,
      productId,
      purchaseTime,
      platform
    };
  }

  /**
   * Get security configuration
   */
  public getSecurityConfig() {
    return { ...this.securityConfig };
  }

  /**
   * Update security configuration
   */
  public updateSecurityConfig(updates: Partial<typeof this.securityConfig>): void {
    this.securityConfig = { ...this.securityConfig, ...updates };
    console.log('🔧 Security configuration updated:', updates);
  }

  /**
   * Generate security report
   */
  public generateSecurityReport(): {
    totalValidations: number;
    failedValidations: number;
    averageSecurityScore: number;
    commonWarnings: string[];
    recommendations: string[];
  } {
    // این باید از داده‌های واقعی validation گزارش تولید کند
    // فعلاً اطلاعات mock برمی‌گرداند
    
    return {
      totalValidations: 0,
      failedValidations: 0,
      averageSecurityScore: 85,
      commonWarnings: [],
      recommendations: [
        'Enable server-side validation for production',
        'Implement real signature validation',
        'Set up monitoring for failed validations'
      ]
    };
  }
}

// Export singleton instance
export const purchaseSecurityService = PurchaseSecurityService.getInstance(); 