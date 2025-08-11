// Enhanced Error Display Component
// Displays error messages with multi-language support

import React from 'react';
import { purchaseErrorHandler, PurchaseErrorType } from '../utils/purchaseErrorHandler';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: any;
  language?: string;
  context?: string;
  showTechnicalDetails?: boolean;
  onRetry?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  language = 'en',
  context = 'general',
  showTechnicalDetails = false,
  onRetry,
  onContactSupport,
  className = ''
}) => {
  if (!error) return null;

  const errorResult = purchaseErrorHandler.handleError(error, context);
  const { error: processedError, userGuidance, technicalDetails, shouldRetry } = errorResult;

  const getErrorIcon = (errorType: PurchaseErrorType): string => {
    switch (errorType) {
      case PurchaseErrorType.USER_CANCELLED:
        return '✋';
      case PurchaseErrorType.PAYMENT_METHOD:
        return '💳';
      case PurchaseErrorType.NETWORK_ERROR:
        return '🌐';
      case PurchaseErrorType.BILLING_UNAVAILABLE:
        return '🛒';
      case PurchaseErrorType.PRODUCT_UNAVAILABLE:
        return '❌';
      case PurchaseErrorType.VALIDATION_FAILED:
        return '🔒';
      case PurchaseErrorType.SERVER_ERROR:
        return '🖥️';
      default:
        return '⚠️';
    }
  };

  const getErrorSeverity = (errorType: PurchaseErrorType): 'info' | 'warning' | 'error' => {
    switch (errorType) {
      case PurchaseErrorType.USER_CANCELLED:
        return 'info';
      case PurchaseErrorType.NETWORK_ERROR:
      case PurchaseErrorType.BILLING_UNAVAILABLE:
      case PurchaseErrorType.SERVER_ERROR:
        return 'warning';
      case PurchaseErrorType.PAYMENT_METHOD:
      case PurchaseErrorType.VALIDATION_FAILED:
      case PurchaseErrorType.PRODUCT_UNAVAILABLE:
        return 'error';
      default:
        return 'warning';
    }
  };

  const userMessage = purchaseErrorHandler.getLocalizedMessage(error, language);
  const icon = getErrorIcon(processedError.type);
  const severity = getErrorSeverity(processedError.type);

  return (
    <div className={`error-display error-display--${severity} ${className}`}>
      {/* Main Error Message */}
      <div className="error-display__header">
        <span className="error-display__icon">{icon}</span>
        <h3 className="error-display__title">{userMessage}</h3>
      </div>

      {/* User Guidance Steps */}
      {userGuidance.length > 0 && (
        <div className="error-display__guidance">
          <h4 className="error-display__guidance-title">
            {language === 'fa' ? 'راهنمایی:' : 
             language === 'ar' ? 'الإرشاد:' :
             language === 'es' ? 'Orientación:' :
             'What you can do:'}
          </h4>
          <ul className="error-display__guidance-list">
            {userGuidance.map((step, index) => (
              <li key={index} className="error-display__guidance-item">
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="error-display__actions">
        {shouldRetry && onRetry && (
          <button 
            className="error-display__button error-display__button--primary"
            onClick={onRetry}
          >
            {language === 'fa' ? '🔄 تلاش مجدد' :
             language === 'ar' ? '🔄 إعادة المحاولة' :
             language === 'es' ? '🔄 Intentar de nuevo' :
             '🔄 Try Again'}
          </button>
        )}
        
        {onContactSupport && (
          <button 
            className="error-display__button error-display__button--secondary"
            onClick={onContactSupport}
          >
            {language === 'fa' ? '📞 تماس با پشتیبانی' :
             language === 'ar' ? '📞 اتصل بالدعم' :
             language === 'es' ? '📞 Contactar Soporte' :
             '📞 Contact Support'}
          </button>
        )}
      </div>

      {/* Technical Details (for debugging) */}
      {showTechnicalDetails && technicalDetails.length > 0 && (
        <details className="error-display__technical">
          <summary className="error-display__technical-summary">
            {language === 'fa' ? 'جزئیات فنی' :
             language === 'ar' ? 'التفاصيل التقنية' :
             language === 'es' ? 'Detalles Técnicos' :
             'Technical Details'}
          </summary>
          <div className="error-display__technical-content">
            <ul>
              {technicalDetails.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </details>
      )}

      {/* Error Type Badge */}
      <div className="error-display__metadata">
        <span className="error-display__badge">
          {processedError.code}
        </span>
        <span className="error-display__timestamp">
          {new Date(processedError.timestamp).toLocaleString(
            language === 'fa' ? 'fa-IR' :
            language === 'ar' ? 'ar-SA' :
            language === 'es' ? 'es-ES' :
            'en-US'
          )}
        </span>
      </div>
    </div>
  );
};

// Utility Components for specific error types
export const PurchaseErrorDisplay: React.FC<{
  error: any;
  language?: string;
  onRetry?: () => void;
}> = ({ error, language, onRetry }) => (
  <ErrorDisplay
    error={error}
    language={language}
    context="purchase"
    onRetry={onRetry}
    onContactSupport={() => {
      // Open support contact
      const supportEmail = 'support@prompterfresh.com';
      const subject = `Purchase Error: ${error?.message || 'Unknown error'}`;
      const body = `Error details:\n${JSON.stringify(error, null, 2)}`;
      window.open(`mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }}
    className="purchase-error"
  />
);

export const ApiErrorDisplay: React.FC<{
  error: any;
  language?: string;
  onRetry?: () => void;
}> = ({ error, language, onRetry }) => (
  <ErrorDisplay
    error={error}
    language={language}
    context="api"
    onRetry={onRetry}
    showTechnicalDetails={process.env.NODE_ENV === 'development'}
    className="api-error"
  />
);

export const NetworkErrorDisplay: React.FC<{
  error: any;
  language?: string;
  onRetry?: () => void;
}> = ({ error, language, onRetry }) => (
  <ErrorDisplay
    error={error}
    language={language}
    context="network"
    onRetry={onRetry}
    className="network-error"
  />
);

// Hook for using error display
export const useErrorDisplay = (language: string = 'en') => {
  const showError = (error: any, context?: string, onRetry?: () => void) => {
    return (
      <ErrorDisplay
        error={error}
        language={language}
        context={context}
        onRetry={onRetry}
      />
    );
  };

  const showPurchaseError = (error: any, onRetry?: () => void) => {
    return (
      <PurchaseErrorDisplay
        error={error}
        language={language}
        onRetry={onRetry}
      />
    );
  };

  const showApiError = (error: any, onRetry?: () => void) => {
    return (
      <ApiErrorDisplay
        error={error}
        language={language}
        onRetry={onRetry}
      />
    );
  };

  return {
    showError,
    showPurchaseError,
    showApiError,
    ErrorDisplay,
    PurchaseErrorDisplay,
    ApiErrorDisplay,
    NetworkErrorDisplay
  };
};

export default ErrorDisplay; 