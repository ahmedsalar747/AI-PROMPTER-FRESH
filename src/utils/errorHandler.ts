// Enhanced Error Handling System

export interface ErrorInfo {
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  source: string;
  userId?: string;
  url?: string;
  userAgent?: string;
}

export interface ErrorReportOptions {
  notify?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorInfo[] = [];
  private maxLogSize = 100;
  private notificationManager: any = null;

  private constructor() {
    this.setupGlobalHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalHandlers(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError(new Error(event.message), {
        source: 'global',
        severity: 'high',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(new Error(event.reason), {
        source: 'promise',
        severity: 'high',
        metadata: {
          reason: event.reason
        }
      });
    });
  }

  public handleError(error: Error, options: ErrorReportOptions & { source: string } = { source: 'unknown' }): void {
    const errorInfo: ErrorInfo = {
      message: error.message,
      code: error.name,
      details: error.stack,
      timestamp: new Date(),
      source: options.source,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Add to local log
    this.addToLog(errorInfo);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('🚨 Error reported:', errorInfo);
    }

    // Show notification if requested
    if (options.notify && this.notificationManager) {
      this.notificationManager.addToast({
        type: 'error',
        title: 'خطا رخ داده',
        message: this.getUserFriendlyMessage(error),
        duration: 5000
      });
    }

    // In production, you would send to error tracking service
    if (import.meta.env.PROD && options.severity === 'critical') {
      this.reportToCrashlytics(errorInfo);
    }
  }

  private addToLog(errorInfo: ErrorInfo): void {
    this.errorLog.push(errorInfo);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
  }

  private getUserFriendlyMessage(error: Error): string {
    const errorMessages: Record<string, string> = {
      'NetworkError': 'مشکل در اتصال به اینترنت',
      'TypeError': 'خطای داخلی رخ داده',
      'ReferenceError': 'خطای داخلی رخ داده',
      'SyntaxError': 'خطای داخلی رخ داده',
      'RangeError': 'مقدار نامعتبر وارد شده',
      'URIError': 'آدرس نامعتبر است'
    };

    return errorMessages[error.name] || 'خطای غیرمنتظره‌ای رخ داده';
  }

  private reportToCrashlytics(errorInfo: ErrorInfo): void {
    // In production, integrate with services like Sentry, LogRocket, etc.
    // For now, we'll just log to console
    console.error('Critical error reported:', errorInfo);
  }

  public getErrorLog(): ErrorInfo[] {
    return [...this.errorLog];
  }

  public clearErrorLog(): void {
    this.errorLog = [];
  }

  public setNotificationManager(manager: any): void {
    this.notificationManager = manager;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Convenience functions
export const reportError = (error: Error, source: string, options?: ErrorReportOptions): void => {
  errorHandler.handleError(error, { ...options, source });
};

export const reportUserError = (message: string, source: string): void => {
  errorHandler.handleError(new Error(message), { 
    source, 
    notify: true, 
    severity: 'low' 
  });
};

export const reportCriticalError = (error: Error, source: string, metadata?: any): void => {
  errorHandler.handleError(error, { 
    source, 
    notify: true, 
    severity: 'critical',
    metadata 
  });
};

// API Error Handler
export const handleApiError = (error: any, source: string): string => {
  let message = 'خطای ناشناخته';
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        message = 'درخواست نامعتبر';
        break;
      case 401:
        message = 'کلید API نامعتبر است';
        break;
      case 403:
        message = 'دسترسی مجاز نیست';
        break;
      case 404:
        message = 'سرویس یافت نشد';
        break;
      case 429:
        message = 'تعداد درخواست‌ها بیش از حد مجاز';
        break;
      case 500:
        message = 'خطای سرور';
        break;
      default:
        message = `خطای سرور (${status})`;
    }
    
    reportError(new Error(`API Error: ${status} - ${data?.error?.message || message}`), source);
  } else if (error.request) {
    // Network error
    message = 'مشکل در اتصال به اینترنت';
    reportError(new Error('Network Error'), source);
  } else {
    // Other error
    reportError(error, source);
  }
  
  return message;
};

// Safe async wrapper
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  source: string,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    reportError(error as Error, source);
    return fallback;
  }
}; 