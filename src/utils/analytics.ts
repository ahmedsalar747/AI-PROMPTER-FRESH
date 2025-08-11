/**
 * Analytics and Logging System for Prompter Fresh
 * 
 * This module provides comprehensive analytics tracking and structured logging
 * capabilities for the application, including user behavior, performance metrics,
 * and error tracking.
 * 
 * @module Analytics
 * @version 1.0.0
 * @author Prompter Fresh Team
 */

import { ENV } from '../config/environment';

/**
 * Log levels for structured logging
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Analytics event types
 */
export type EventType = 
  | 'page_view'
  | 'user_action'
  | 'api_call'
  | 'error'
  | 'performance'
  | 'purchase'
  | 'feature_usage'
  | 'conversion';

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  /** Event type */
  type: EventType;
  /** Event name */
  name: string;
  /** Event properties */
  properties?: Record<string, any>;
  /** User ID (if available) */
  userId?: string;
  /** Session ID */
  sessionId?: string;
  /** Timestamp */
  timestamp: string;
  /** Page URL */
  page?: string;
  /** User agent */
  userAgent?: string;
  /** Platform */
  platform?: string;
}

/**
 * Log entry interface
 */
export interface LogEntry {
  /** Log level */
  level: LogLevel;
  /** Log message */
  message: string;
  /** Additional context */
  context?: Record<string, any>;
  /** Timestamp */
  timestamp: string;
  /** Source component/module */
  source?: string;
  /** Error stack (if applicable) */
  stack?: string;
  /** User ID (if available) */
  userId?: string;
  /** Session ID */
  sessionId?: string;
}

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  /** Page load time */
  pageLoadTime?: number;
  /** Time to first byte */
  timeToFirstByte?: number;
  /** First contentful paint */
  firstContentfulPaint?: number;
  /** Largest contentful paint */
  largestContentfulPaint?: number;
  /** Cumulative layout shift */
  cumulativeLayoutShift?: number;
  /** First input delay */
  firstInputDelay?: number;
  /** Memory usage */
  memoryUsage?: number;
  /** API response time */
  apiResponseTime?: number;
}

/**
 * Analytics service class
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private logs: LogEntry[] = [];
  private sessionId: string;
  private userId?: string;
  private isInitialized = false;
  private maxEvents = 1000;
  private maxLogs = 500;
  private flushInterval = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceTracking();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Initialize analytics service
   */
  public async initialize(userId?: string): Promise<void> {
    this.userId = userId;
    this.isInitialized = true;
    
    // Start periodic flush
    this.flushTimer = setInterval(() => {
      this.flushData();
    }, this.flushInterval);

    // Track initial page view
    this.trackPageView();

    // Setup global error tracking
    this.setupGlobalErrorTracking();

    // Setup performance monitoring
    this.setupPerformanceMonitoring();

    console.log('📊 Analytics service initialized');
  }

  /**
   * Track analytics event
   */
  public trackEvent(
    type: EventType,
    name: string,
    properties?: Record<string, any>
  ): void {
    if (!this.isInitialized) {
      console.warn('Analytics service not initialized');
      return;
    }

    const event: AnalyticsEvent = {
      type,
      name,
      properties,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      platform: this.getPlatform()
    };

    this.events.push(event);
    this.trimEvents();

    // Log to console in development
    if (ENV.isDevelopment) {
      console.log('📊 Event tracked:', event);
    }
  }

  /**
   * Track page view
   */
  public trackPageView(page?: string): void {
    this.trackEvent('page_view', 'page_view', {
      page: page || window.location.pathname,
      referrer: document.referrer,
      title: document.title
    });
  }

  /**
   * Track user action
   */
  public trackUserAction(action: string, properties?: Record<string, any>): void {
    this.trackEvent('user_action', action, properties);
  }

  /**
   * Track API call
   */
  public trackApiCall(
    endpoint: string,
    method: string,
    responseTime: number,
    success: boolean,
    statusCode?: number
  ): void {
    this.trackEvent('api_call', 'api_request', {
      endpoint,
      method,
      responseTime,
      success,
      statusCode
    });
  }

  /**
   * Track error
   */
  public trackError(
    error: Error,
    context?: Record<string, any>
  ): void {
    this.trackEvent('error', 'error_occurred', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context
    });
  }

  /**
   * Track purchase event
   */
  public trackPurchase(
    productId: string,
    price: number,
    currency: string = 'USD',
    properties?: Record<string, any>
  ): void {
    this.trackEvent('purchase', 'purchase_completed', {
      productId,
      price,
      currency,
      ...properties
    });
  }

  /**
   * Track feature usage
   */
  public trackFeatureUsage(
    feature: string,
    action: string,
    properties?: Record<string, any>
  ): void {
    this.trackEvent('feature_usage', `${feature}_${action}`, properties);
  }

  /**
   * Track conversion event
   */
  public trackConversion(
    goal: string,
    value?: number,
    properties?: Record<string, any>
  ): void {
    this.trackEvent('conversion', goal, {
      value,
      ...properties
    });
  }

  /**
   * Log message with structured logging
   */
  public log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    source?: string
  ): void {
    const logEntry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      source,
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.logs.push(logEntry);
    this.trimLogs();

    // Console output with appropriate level
    const logMessage = `[${level.toUpperCase()}] ${message}`;
    if (level === 'debug') {
      console.log(logMessage, context);
    } else if (level === 'info') {
      console.info(logMessage, context);
    } else if (level === 'warn') {
      console.warn(logMessage, context);
    } else if (level === 'error' || level === 'fatal') {
      console.error(logMessage, context);
    }
  }

  /**
   * Debug log
   */
  public debug(message: string, context?: Record<string, any>, source?: string): void {
    this.log('debug', message, context, source);
  }

  /**
   * Info log
   */
  public info(message: string, context?: Record<string, any>, source?: string): void {
    this.log('info', message, context, source);
  }

  /**
   * Warning log
   */
  public warn(message: string, context?: Record<string, any>, source?: string): void {
    this.log('warn', message, context, source);
  }

  /**
   * Error log
   */
  public error(message: string, context?: Record<string, any>, source?: string): void {
    this.log('error', message, context, source);
  }

  /**
   * Fatal log
   */
  public fatal(message: string, context?: Record<string, any>, source?: string): void {
    this.log('fatal', message, context, source);
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const metrics: PerformanceMetrics = {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      timeToFirstByte: navigation ? navigation.responseStart - navigation.requestStart : 0,
    };

    // First Contentful Paint
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    if (fcp) {
      metrics.firstContentfulPaint = fcp.startTime;
    }

    // Memory usage (if available)
    if ((performance as any).memory) {
      metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    return metrics;
  }

  /**
   * Track performance metrics
   */
  public trackPerformance(metrics?: PerformanceMetrics): void {
    const performanceMetrics = metrics || this.getPerformanceMetrics();
    
    this.trackEvent('performance', 'performance_metrics', performanceMetrics);
  }

  /**
   * Flush data to storage or external service
   */
  public async flushData(): Promise<void> {
    if (this.events.length === 0 && this.logs.length === 0) {
      return;
    }

    try {
      // Save to localStorage for persistence
      localStorage.setItem('analytics-events', JSON.stringify(this.events));
      localStorage.setItem('analytics-logs', JSON.stringify(this.logs));

      // In production, send to analytics service
      if (ENV.isProduction) {
        await this.sendToAnalyticsService();
      }

      console.log(`📊 Flushed ${this.events.length} events and ${this.logs.length} logs`);
      
    } catch (error) {
      console.error('Failed to flush analytics data:', error);
    }
  }

  /**
   * Get analytics summary
   */
  public getAnalyticsSummary(): {
    totalEvents: number;
    totalLogs: number;
    sessionDuration: number;
    topEvents: Record<string, number>;
    errorCount: number;
  } {
    const sessionStart = new Date(this.sessionId).getTime();
    const sessionDuration = Date.now() - sessionStart;
    
    const topEvents: Record<string, number> = {};
    this.events.forEach(event => {
      topEvents[event.name] = (topEvents[event.name] || 0) + 1;
    });

    const errorCount = this.events.filter(event => event.type === 'error').length;

    return {
      totalEvents: this.events.length,
      totalLogs: this.logs.length,
      sessionDuration,
      topEvents,
      errorCount
    };
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get platform information
   */
  private getPlatform(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Android')) return 'android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'ios';
    if (userAgent.includes('Windows')) return 'windows';
    if (userAgent.includes('Mac')) return 'macos';
    if (userAgent.includes('Linux')) return 'linux';
    return 'unknown';
  }

  /**
   * Trim events to prevent memory issues
   */
  private trimEvents(): void {
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  /**
   * Trim logs to prevent memory issues
   */
  private trimLogs(): void {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Setup global error tracking
   */
  private setupGlobalErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), {
        type: 'unhandled_promise_rejection'
      });
    });
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Track performance metrics periodically
    setInterval(() => {
      this.trackPerformance();
    }, 60000); // Every minute

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackUserAction('page_visibility_change', {
        visible: !document.hidden
      });
    });
  }

  /**
   * Initialize performance tracking
   */
  private initializePerformanceTracking(): void {
    // Track initial page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.trackPerformance();
      }, 1000);
    });
  }

  /**
   * Send data to external analytics service
   */
  private async sendToAnalyticsService(): Promise<void> {
    // This would integrate with services like Google Analytics, Mixpanel, etc.
    // For now, we'll just log
    console.log('📊 Would send analytics data to external service');
  }

  /**
   * Cleanup on page unload
   */
  public cleanup(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushData();
  }
}

// Export singleton instance
export const analytics = AnalyticsService.getInstance();

// Convenience functions
export const trackEvent = (type: EventType, name: string, properties?: Record<string, any>) => {
  analytics.trackEvent(type, name, properties);
};

export const trackPageView = (page?: string) => {
  analytics.trackPageView(page);
};

export const trackUserAction = (action: string, properties?: Record<string, any>) => {
  analytics.trackUserAction(action, properties);
};

export const trackApiCall = (endpoint: string, method: string, responseTime: number, success: boolean, statusCode?: number) => {
  analytics.trackApiCall(endpoint, method, responseTime, success, statusCode);
};

export const trackError = (error: Error, context?: Record<string, any>) => {
  analytics.trackError(error, context);
};

export const trackPurchase = (productId: string, price: number, currency?: string, properties?: Record<string, any>) => {
  analytics.trackPurchase(productId, price, currency, properties);
};

export const trackFeatureUsage = (feature: string, action: string, properties?: Record<string, any>) => {
  analytics.trackFeatureUsage(feature, action, properties);
};

export const trackConversion = (goal: string, value?: number, properties?: Record<string, any>) => {
  analytics.trackConversion(goal, value, properties);
};

// Logging shortcuts
export const logDebug = (message: string, context?: Record<string, any>, source?: string) => {
  analytics.debug(message, context, source);
};

export const logInfo = (message: string, context?: Record<string, any>, source?: string) => {
  analytics.info(message, context, source);
};

export const logWarn = (message: string, context?: Record<string, any>, source?: string) => {
  analytics.warn(message, context, source);
};

export const logError = (message: string, context?: Record<string, any>, source?: string) => {
  analytics.error(message, context, source);
};

export const logFatal = (message: string, context?: Record<string, any>, source?: string) => {
  analytics.fatal(message, context, source);
};

// Initialize analytics on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    analytics.initialize();
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    analytics.cleanup();
  });
} 