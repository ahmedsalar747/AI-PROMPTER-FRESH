// Enhanced Purchase Error Handler
// Handles all types of purchase-related errors with detailed user guidance
// Updated for international users with English as primary language

export enum PurchaseErrorType {
  // User errors
  USER_CANCELLED = 'USER_CANCELLED',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  SERVER_ERROR = 'SERVER_ERROR',
  
  // Security errors
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  SIGNATURE_INVALID = 'SIGNATURE_INVALID',
  RECEIPT_INVALID = 'RECEIPT_INVALID',
  
  // Platform errors
  BILLING_UNAVAILABLE = 'BILLING_UNAVAILABLE',
  PRODUCT_UNAVAILABLE = 'PRODUCT_UNAVAILABLE',
  PLAY_SERVICES_ERROR = 'PLAY_SERVICES_ERROR',
  
  // Business logic errors
  DUPLICATE_PURCHASE = 'DUPLICATE_PURCHASE',
  SUBSCRIPTION_EXPIRED = 'SUBSCRIPTION_EXPIRED',
  REGION_RESTRICTED = 'REGION_RESTRICTED',
  
  // System errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED'
}

export interface PurchaseError {
  type: PurchaseErrorType;
  code: string;
  message: string;
  userMessage: string; // English message for user
  details: Record<string, any>;
  timestamp: number;
  retryable: boolean;
  userAction?: string; // What user can do
  supportAction?: string; // What support can do
}

export interface ErrorHandlingResult {
  error: PurchaseError;
  shouldRetry: boolean;
  retryDelay?: number;
  userGuidance: string[];
  technicalDetails: string[];
}

export class PurchaseErrorHandler {
  private static instance: PurchaseErrorHandler;
  private errorHistory: PurchaseError[] = [];

  private constructor() {}

  public static getInstance(): PurchaseErrorHandler {
    if (!PurchaseErrorHandler.instance) {
      PurchaseErrorHandler.instance = new PurchaseErrorHandler();
    }
    return PurchaseErrorHandler.instance;
  }

  /**
   * Handle purchase error and provide user guidance
   */
  public handleError(error: any, context: string = 'purchase'): ErrorHandlingResult {
    try {
      const purchaseError = this.classifyError(error, context);
      this.logError(purchaseError);
      
      const guidance = this.generateUserGuidance(purchaseError);
      const retryInfo = this.determineRetryStrategy(purchaseError);
      
      return {
        error: purchaseError,
        shouldRetry: retryInfo.shouldRetry,
        retryDelay: retryInfo.delay,
        userGuidance: guidance.userSteps,
        technicalDetails: guidance.technicalInfo
      };
    } catch (handlerError) {
      console.error('❌ Error handler failed:', handlerError);
      return this.createFallbackResult(error);
    }
  }

  /**
   * Classify error into specific type
   */
  private classifyError(error: any, context: string): PurchaseError {
    const timestamp = Date.now();
    
    // User cancellation
    if (this.isUserCancellation(error)) {
      return {
        type: PurchaseErrorType.USER_CANCELLED,
        code: 'USER_CANCELLED',
        message: 'User cancelled the purchase',
        userMessage: 'Purchase was cancelled by user',
        details: { context, originalError: error.message },
        timestamp,
        retryable: true,
        userAction: 'Try purchasing again when ready'
      };
    }

    // Payment method issues
    if (this.isPaymentMethodError(error)) {
      return {
        type: PurchaseErrorType.PAYMENT_METHOD,
        code: 'PAYMENT_METHOD_ERROR',
        message: 'Payment method problem',
        userMessage: 'There is an issue with your payment method',
        details: { context, originalError: error.message },
        timestamp,
        retryable: true,
        userAction: 'Check your payment method in Google Play settings',
        supportAction: 'Verify payment method configuration'
      };
    }

    // Network errors
    if (this.isNetworkError(error)) {
      return {
        type: PurchaseErrorType.NETWORK_ERROR,
        code: 'NETWORK_ERROR',
        message: 'Network connection problem',
        userMessage: 'Internet connection problem detected',
        details: { context, originalError: error.message },
        timestamp,
        retryable: true,
        userAction: 'Check your internet connection',
        supportAction: 'Check server status'
      };
    }

    // Security/validation errors
    if (this.isSecurityError(error)) {
      return {
        type: PurchaseErrorType.VALIDATION_FAILED,
        code: 'SECURITY_VALIDATION_FAILED',
        message: 'Purchase validation failed',
        userMessage: 'Purchase verification failed',
        details: { context, originalError: error.message },
        timestamp,
        retryable: false,
        userAction: 'Contact support for assistance',
        supportAction: 'Manual verification required'
      };
    }

    // Billing unavailable
    if (this.isBillingUnavailable(error)) {
      return {
        type: PurchaseErrorType.BILLING_UNAVAILABLE,
        code: 'BILLING_UNAVAILABLE',
        message: 'Billing service unavailable',
        userMessage: 'Purchase service is temporarily unavailable',
        details: { context, originalError: error.message },
        timestamp,
        retryable: true,
        userAction: 'Please try again in a few minutes',
        supportAction: 'Check Google Play Services status'
      };
    }

    // Product unavailable
    if (this.isProductUnavailable(error)) {
      return {
        type: PurchaseErrorType.PRODUCT_UNAVAILABLE,
        code: 'PRODUCT_UNAVAILABLE',
        message: 'Product not available',
        userMessage: 'This product is currently unavailable',
        details: { context, originalError: error.message },
        timestamp,
        retryable: false,
        userAction: 'Contact support',
        supportAction: 'Check product configuration in store'
      };
    }

    // Server errors
    if (this.isServerError(error)) {
      return {
        type: PurchaseErrorType.SERVER_ERROR,
        code: 'SERVER_ERROR',
        message: 'Server error occurred',
        userMessage: 'Server error occurred',
        details: { context, originalError: error.message },
        timestamp,
        retryable: true,
        userAction: 'Please try again in a few minutes',
        supportAction: 'Check server logs and status'
      };
    }

    // Default unknown error
    return {
      type: PurchaseErrorType.UNKNOWN_ERROR,
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Unknown error occurred',
      userMessage: 'An unexpected error occurred',
      details: { context, originalError: error },
      timestamp,
      retryable: true,
      userAction: 'Please try again or contact support',
      supportAction: 'Investigate error details'
    };
  }

  /**
   * Check if error is user cancellation
   */
  private isUserCancellation(error: any): boolean {
    const message = error.message?.toLowerCase() || '';
    return message.includes('cancelled') || 
           message.includes('canceled') ||
           message.includes('user_cancelled') ||
           error.code === 'USER_CANCELLED';
  }

  /**
   * Check if error is payment method related
   */
  private isPaymentMethodError(error: any): boolean {
    const message = error.message?.toLowerCase() || '';
    return message.includes('payment') ||
           message.includes('billing') ||
           message.includes('card') ||
           message.includes('insufficient') ||
           error.code?.includes('PAYMENT');
  }

  /**
   * Check if error is network related
   */
  private isNetworkError(error: any): boolean {
    const message = error.message?.toLowerCase() || '';
    return message.includes('network') ||
           message.includes('internet') ||
           message.includes('connection') ||
           message.includes('timeout') ||
           error.code === 'NETWORK_ERROR' ||
           error.name === 'AbortError';
  }

  /**
   * Check if error is security related
   */
  private isSecurityError(error: any): boolean {
    const message = error.message?.toLowerCase() || '';
    return message.includes('validation') ||
           message.includes('signature') ||
           message.includes('receipt') ||
           message.includes('security') ||
           error.code?.includes('VALIDATION');
  }

  /**
   * Check if billing is unavailable
   */
  private isBillingUnavailable(error: any): boolean {
    const message = error.message?.toLowerCase() || '';
    return message.includes('billing unavailable') ||
           message.includes('play services') ||
           message.includes('service unavailable') ||
           error.code === 'BILLING_UNAVAILABLE';
  }

  /**
   * Check if product is unavailable
   */
  private isProductUnavailable(error: any): boolean {
    const message = error.message?.toLowerCase() || '';
    return message.includes('product unavailable') ||
           message.includes('item unavailable') ||
           message.includes('not found') ||
           error.code === 'PRODUCT_UNAVAILABLE';
  }

  /**
   * Check if error is server related
   */
  private isServerError(error: any): boolean {
    const message = error.message?.toLowerCase() || '';
    return message.includes('server') ||
           message.includes('503') ||
           message.includes('502') ||
           message.includes('500') ||
           error.status >= 500;
  }

  /**
   * Generate user guidance in English
   */
  private generateUserGuidance(error: PurchaseError): {
    userSteps: string[];
    technicalInfo: string[];
  } {
    const userSteps: string[] = [];
    const technicalInfo: string[] = [];

    switch (error.type) {
      case PurchaseErrorType.USER_CANCELLED:
        userSteps.push('✋ You cancelled the purchase');
        userSteps.push('🔄 You can try again when ready');
        break;

      case PurchaseErrorType.PAYMENT_METHOD:
        userSteps.push('💳 There is an issue with your payment method');
        userSteps.push('🔧 Check your payment method in Google Play settings');
        userSteps.push('💰 Make sure you have sufficient balance');
        userSteps.push('📱 Update your payment information if needed');
        break;

      case PurchaseErrorType.NETWORK_ERROR:
        userSteps.push('🌐 Internet connection problem');
        userSteps.push('📶 Check your Wi-Fi or mobile data connection');
        userSteps.push('🔄 Try again in a few minutes');
        userSteps.push('📍 Move to an area with better signal if needed');
        break;

      case PurchaseErrorType.BILLING_UNAVAILABLE:
        userSteps.push('🛒 Purchase service is temporarily unavailable');
        userSteps.push('🔄 Please try again in a few minutes');
        userSteps.push('📱 Make sure Google Play Services is updated');
        userSteps.push('⏰ The service should be back online shortly');
        break;

      case PurchaseErrorType.PRODUCT_UNAVAILABLE:
        userSteps.push('❌ This product is currently unavailable');
        userSteps.push('📞 Contact support for assistance');
        userSteps.push('🔄 Check back later as availability may change');
        break;

      case PurchaseErrorType.VALIDATION_FAILED:
        userSteps.push('🔒 Purchase verification failed');
        userSteps.push('📞 Please contact support for assistance');
        userSteps.push('🔐 This is a security measure to protect your account');
        break;

      case PurchaseErrorType.SERVER_ERROR:
        userSteps.push('🖥️ Server error occurred');
        userSteps.push('🔄 Please try again in a few minutes');
        userSteps.push('⏰ Our team has been notified and is working on it');
        break;

      default:
        userSteps.push('❓ An unexpected error occurred');
        userSteps.push('🔄 Please try again');
        userSteps.push('📞 Contact support if the problem persists');
    }

    // Technical information for debugging
    technicalInfo.push(`Error Type: ${error.type}`);
    technicalInfo.push(`Error Code: ${error.code}`);
    technicalInfo.push(`Timestamp: ${new Date(error.timestamp).toISOString()}`);
    technicalInfo.push(`Retryable: ${error.retryable}`);
    
    if (error.details.originalError) {
      technicalInfo.push(`Original Error: ${error.details.originalError}`);
    }

    return { userSteps, technicalInfo };
  }

  /**
   * Determine retry strategy
   */
  private determineRetryStrategy(error: PurchaseError): {
    shouldRetry: boolean;
    delay?: number;
    maxRetries?: number;
  } {
    if (!error.retryable) {
      return { shouldRetry: false };
    }

    switch (error.type) {
      case PurchaseErrorType.NETWORK_ERROR:
        return { shouldRetry: true, delay: 3000, maxRetries: 3 };
      
      case PurchaseErrorType.SERVER_ERROR:
        return { shouldRetry: true, delay: 5000, maxRetries: 2 };
      
      case PurchaseErrorType.BILLING_UNAVAILABLE:
        return { shouldRetry: true, delay: 10000, maxRetries: 2 };
      
      case PurchaseErrorType.USER_CANCELLED:
      case PurchaseErrorType.PAYMENT_METHOD:
        return { shouldRetry: true, delay: 0, maxRetries: 1 };
      
      default:
        return { shouldRetry: true, delay: 2000, maxRetries: 1 };
    }
  }

  /**
   * Log error for analytics and debugging
   */
  private logError(error: PurchaseError): void {
    try {
      // Add to error history
      this.errorHistory.push(error);
      
      // Keep only last 50 errors
      if (this.errorHistory.length > 50) {
        this.errorHistory.shift();
      }

      // Log to console with details
      console.error('🚨 Purchase Error:', {
        type: error.type,
        code: error.code,
        message: error.message,
        userMessage: error.userMessage,
        timestamp: new Date(error.timestamp).toISOString(),
        retryable: error.retryable,
        details: error.details
      });

      // Save to localStorage for debugging
      localStorage.setItem('purchase-error-history', JSON.stringify(this.errorHistory));

      // TODO: Send to analytics service in production
      // this.sendToAnalytics(error);

    } catch (logError) {
      console.error('❌ Failed to log purchase error:', logError);
    }
  }

  /**
   * Create fallback result when handler fails
   */
  private createFallbackResult(originalError: any): ErrorHandlingResult {
    return {
      error: {
        type: PurchaseErrorType.UNKNOWN_ERROR,
        code: 'HANDLER_ERROR',
        message: 'Error handler failed',
        userMessage: 'A system error occurred',
        details: { originalError },
        timestamp: Date.now(),
        retryable: true,
        userAction: 'Please contact support'
      },
      shouldRetry: false,
      userGuidance: [
        '❌ A system error occurred',
        '📞 Please contact support for assistance'
      ],
      technicalDetails: [
        'Error handler failure',
        `Original error: ${originalError.message || 'Unknown'}`
      ]
    };
  }

  /**
   * Get error statistics
   */
  public getErrorStatistics(): {
    totalErrors: number;
    errorsByType: Record<string, number>;
    mostCommonError: string;
    recentErrors: PurchaseError[];
  } {
    const errorsByType: Record<string, number> = {};
    
    this.errorHistory.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
    });

    const mostCommonError = Object.entries(errorsByType)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'NONE';

    return {
      totalErrors: this.errorHistory.length,
      errorsByType,
      mostCommonError,
      recentErrors: this.errorHistory.slice(-10)
    };
  }

  /**
   * Clear error history
   */
  public clearErrorHistory(): void {
    this.errorHistory = [];
    localStorage.removeItem('purchase-error-history');
    console.log('✅ Purchase error history cleared');
  }

  /**
   * Get user-friendly error message in English
   */
  public getUserFriendlyMessage(error: any): string {
    const result = this.handleError(error);
    return result.error.userMessage;
  }

  /**
   * Check if error is recoverable
   */
  public isRecoverable(error: any): boolean {
    const result = this.handleError(error);
    return result.error.retryable;
  }

  /**
   * Get localized error message (future enhancement)
   */
  public getLocalizedMessage(error: any, language: string = 'en'): string {
    const result = this.handleError(error);
    
    // For now, return English. Can be enhanced with i18n in the future
    switch (language) {
      case 'fa':
        return this.getPersianMessage(result.error);
      case 'ar':
        return this.getArabicMessage(result.error);
      case 'es':
        return this.getSpanishMessage(result.error);
      default:
        return result.error.userMessage;
    }
  }

  /**
   * Get Persian error message (for Persian users)
   */
  private getPersianMessage(error: PurchaseError): string {
    switch (error.type) {
      case PurchaseErrorType.USER_CANCELLED:
        return 'خرید توسط کاربر لغو شد';
      case PurchaseErrorType.PAYMENT_METHOD:
        return 'مشکل در روش پرداخت شما';
      case PurchaseErrorType.NETWORK_ERROR:
        return 'مشکل در اتصال اینترنت';
      case PurchaseErrorType.BILLING_UNAVAILABLE:
        return 'سرویس پرداخت در دسترس نیست';
      case PurchaseErrorType.PRODUCT_UNAVAILABLE:
        return 'محصول در دسترس نیست';
      case PurchaseErrorType.VALIDATION_FAILED:
        return 'خطا در اعتبارسنجی خرید';
      case PurchaseErrorType.SERVER_ERROR:
        return 'خطای سرور';
      default:
        return 'خطای نامشخص رخ داده';
    }
  }

  /**
   * Get Arabic error message (for Arabic users)
   */
  private getArabicMessage(error: PurchaseError): string {
    switch (error.type) {
      case PurchaseErrorType.USER_CANCELLED:
        return 'تم إلغاء الشراء من قبل المستخدم';
      case PurchaseErrorType.PAYMENT_METHOD:
        return 'مشكلة في طريقة الدفع';
      case PurchaseErrorType.NETWORK_ERROR:
        return 'مشكلة في الاتصال بالإنترنت';
      case PurchaseErrorType.BILLING_UNAVAILABLE:
        return 'خدمة الدفع غير متاحة';
      case PurchaseErrorType.PRODUCT_UNAVAILABLE:
        return 'المنتج غير متاح';
      case PurchaseErrorType.VALIDATION_FAILED:
        return 'فشل في التحقق من الشراء';
      case PurchaseErrorType.SERVER_ERROR:
        return 'خطأ في الخادم';
      default:
        return 'حدث خطأ غير متوقع';
    }
  }

  /**
   * Get Spanish error message (for Spanish users)
   */
  private getSpanishMessage(error: PurchaseError): string {
    switch (error.type) {
      case PurchaseErrorType.USER_CANCELLED:
        return 'Compra cancelada por el usuario';
      case PurchaseErrorType.PAYMENT_METHOD:
        return 'Problema con el método de pago';
      case PurchaseErrorType.NETWORK_ERROR:
        return 'Problema de conexión a internet';
      case PurchaseErrorType.BILLING_UNAVAILABLE:
        return 'Servicio de pago no disponible';
      case PurchaseErrorType.PRODUCT_UNAVAILABLE:
        return 'Producto no disponible';
      case PurchaseErrorType.VALIDATION_FAILED:
        return 'Error en la verificación de compra';
      case PurchaseErrorType.SERVER_ERROR:
        return 'Error del servidor';
      default:
        return 'Ocurrió un error inesperado';
    }
  }
}

// Export singleton instance
export const purchaseErrorHandler = PurchaseErrorHandler.getInstance();

// Export convenience functions with English as default
export const handlePurchaseError = (error: any, context?: string) => 
  purchaseErrorHandler.handleError(error, context);

export const getUserFriendlyErrorMessage = (error: any, language: string = 'en') => 
  purchaseErrorHandler.getLocalizedMessage(error, language);

export const isPurchaseErrorRecoverable = (error: any) => 
  purchaseErrorHandler.isRecoverable(error); 