import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getApiUrl } from '../config';

// Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export class ApiError extends Error {
  statusCode: number;
  response?: any;

  constructor(message: string, statusCode: number, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

// Network error type
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ApiClient {
  private client: AxiosInstance;
  // private retryCount = 0;
  // private maxRetries = 3;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:5000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('prompter-auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add correlation ID for debugging
        config.headers['X-Correlation-ID'] = Date.now().toString();
        
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle token refresh for 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            await this.refreshToken();
            const token = localStorage.getItem('prompter-auth-token');
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // Handle network errors
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
          throw new NetworkError('Network connection failed. Please check your internet connection.');
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
          throw new NetworkError('Request timeout. Please try again.');
        }

        // Handle API errors
        const apiError = new ApiError(
          error.response?.data?.message || error.message || 'An unexpected error occurred',
          error.response?.status || 500,
          error.response?.data
        );

        return Promise.reject(apiError);
      }
    );
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('prompter-refresh-token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(getApiUrl('/auth/refresh'), {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      
      localStorage.setItem('prompter-auth-token', accessToken);
      localStorage.setItem('prompter-refresh-token', newRefreshToken);
    } catch (error) {
      localStorage.removeItem('prompter-auth-token');
      localStorage.removeItem('prompter-refresh-token');
      throw error;
    }
  }

  private handleAuthError(): void {
    localStorage.removeItem('prompter-auth-token');
    localStorage.removeItem('prompter-refresh-token');
    localStorage.removeItem('prompter-user-data');
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // Generic HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch(url, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // File upload method
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message,
      statusCode: response.status
    };
  }

  private handleError(error: any): Error {
    if (error instanceof ApiError || error instanceof NetworkError) {
      return error;
    }

    if (error.response) {
      return new ApiError(
        error.response.data?.message || 'Server error occurred',
        error.response.status,
        error.response.data
      );
    }

    if (error.request) {
      return new NetworkError('No response from server. Please check your connection.');
    }

    return new Error(error.message || 'An unexpected error occurred');
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  }

  // Set auth token manually
  setAuthToken(token: string): void {
    localStorage.setItem('prompter-auth-token', token);
  }

  // Clear auth data
  clearAuth(): void {
    localStorage.removeItem('prompter-auth-token');
    localStorage.removeItem('prompter-refresh-token');
    localStorage.removeItem('prompter-user-data');
  }

  // Get current auth status
  isAuthenticated(): boolean {
    return !!localStorage.getItem('prompter-auth-token');
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export specific API methods for different modules
export class AuthApi {
  static async login(email: string, password: string) {
    return apiClient.post('/auth/login', { email, password });
  }

  static async register(userData: any) {
    return apiClient.post('/auth/register', userData);
  }

  static async logout() {
    return apiClient.post('/auth/logout');
  }

  static async refreshToken() {
    return apiClient.post('/auth/refresh');
  }

  static async forgotPassword(email: string) {
    return apiClient.post('/auth/forgot-password', { email });
  }

  static async resetPassword(token: string, password: string) {
    return apiClient.post('/auth/reset-password', { token, password });
  }

  static async verifyEmail(token: string) {
    return apiClient.post('/auth/verify-email', { token });
  }

  static async changePassword(currentPassword: string, newPassword: string) {
    return apiClient.post('/auth/change-password', { currentPassword, newPassword });
  }
}

export class UserApi {
  static async getProfile() {
    return apiClient.get('/user/profile');
  }

  static async updateProfile(data: any) {
    return apiClient.put('/user/profile', data);
  }

  static async uploadAvatar(file: File, onProgress?: (progress: number) => void) {
    return apiClient.upload('/user/avatar', file, onProgress);
  }

  static async deleteAccount() {
    return apiClient.delete('/user/account');
  }

  static async getUsageStats() {
    return apiClient.get('/user/usage');
  }
}

export class PromptApi {
  static async getPrompts(page = 1, limit = 20) {
    return apiClient.get(`/prompts?page=${page}&limit=${limit}`);
  }

  static async getPrompt(id: string) {
    return apiClient.get(`/prompts/${id}`);
  }

  static async createPrompt(data: any) {
    return apiClient.post('/prompts', data);
  }

  static async updatePrompt(id: string, data: any) {
    return apiClient.put(`/prompts/${id}`, data);
  }

  static async deletePrompt(id: string) {
    return apiClient.delete(`/prompts/${id}`);
  }

  static async enhancePrompt(prompt: string, options: any) {
    return apiClient.post('/prompts/enhance', { prompt, options });
  }
}

export class PaymentApi {
  static async createPayment(data: any) {
    return apiClient.post('/payments/create', data);
  }

  static async verifyPayment(transactionId: string) {
    return apiClient.post('/payments/verify', { transactionId });
  }

  static async getPaymentHistory(page = 1, limit = 20) {
    return apiClient.get(`/payments/history?page=${page}&limit=${limit}`);
  }
}

export default apiClient; 