// Security utility functions

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Validate prompt content
export const validatePrompt = (prompt: string): { isValid: boolean; error?: string } => {
  if (!prompt || typeof prompt !== 'string') {
    return { isValid: false, error: 'Prompt must be a non-empty string' };
  }
  
  const sanitized = sanitizeInput(prompt);
  
  if (sanitized.length === 0) {
    return { isValid: false, error: 'Prompt cannot be empty after sanitization' };
  }
  
  if (sanitized.length > 10000) {
    return { isValid: false, error: 'Prompt is too long (max 10,000 characters)' };
  }
  
  return { isValid: true };
};

// Rate limiting (simple in-memory implementation)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;
  
  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
  
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

// Export rate limiter instance
export const rateLimiter = new RateLimiter(5, 60000); // 5 requests per minute

// Environment validation
export const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for development mode security issues
  if (import.meta.env.DEV) {
    console.warn('🚨 Running in development mode - security features may be reduced');
  }
  
  // Check for required environment variables in production
  if (import.meta.env.PROD) {
    if (!import.meta.env.VITE_APP_TITLE) {
      errors.push('VITE_APP_TITLE is required in production');
    }
    
    if (!import.meta.env.VITE_APP_VERSION) {
      errors.push('VITE_APP_VERSION is required in production');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate secure random string
export const generateSecureId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Content Security Policy helpers
export const getCSPNonce = (): string => {
  return generateSecureId();
};

// Safe JSON parsing
export const safeJSONParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}; 