import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorHandler } from '../utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Report to error handler
    errorHandler.handleError(error, {
      source: 'react-error-boundary',
      severity: 'high',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name
      }
    });

    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>🚨 Unexpected Error</h2>
            <p>Unfortunately, an issue occurred in the application.</p>
            
            <div className="error-boundary-actions">
              <button 
                onClick={this.handleRetry}
                className="retry-button"
              >
                🔄 Retry
              </button>
              <button 
                onClick={this.handleReload}
                className="reload-button"
              >
                🔄 Reload
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error details (development only)</summary>
                <pre>{this.state.error?.stack}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC برای wrap کردن components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, _ref) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...(props as any)} />
    </ErrorBoundary>
  ));
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook برای error handling در functional components
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: string) => {
    errorHandler.handleError(error, {
      source: 'component-hook',
      severity: 'medium',
      metadata: { additionalInfo: errorInfo }
    });
  };
}; 