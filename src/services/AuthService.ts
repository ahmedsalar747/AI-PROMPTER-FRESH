/**
 * 🔐 Authentication Service
 * Complete authentication system with local and remote support
 */

import { config } from '../config';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  subscription: {
    type: 'free' | 'ad-free' | 'pro';
    status: 'active' | 'expired' | 'cancelled';
    expiresAt?: string;
  };
  createdAt: string;
  lastLoginAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
  error?: string;
}

// Local Storage Keys
const STORAGE_KEYS = {
  USERS: 'prompter-users',
  CURRENT_USER: 'prompter-current-user',
  AUTH_TOKEN: 'prompter-auth-token',
  REFRESH_TOKEN: 'prompter-refresh-token',
  SESSION: 'prompter-session'
};

// Local Authentication Service
class LocalAuthService {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, { userId: string; expiresAt: number }> = new Map();

  constructor() {
    this.loadUsers();
  }

  // Load users from localStorage
  private loadUsers() {
    try {
      const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
      if (usersData) {
        const users = JSON.parse(usersData);
        this.users = new Map(Object.entries(users));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  // Save users to localStorage
  private saveUsers() {
    try {
      const usersObj = Object.fromEntries(this.users);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersObj));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // Generate JWT-like token
  private generateToken(userId: string): string {
    const payload = {
      userId,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    return btoa(JSON.stringify(payload));
  }

  // Validate token
  private validateToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        return null; // Token expired
      }
      return payload.userId;
    } catch (error) {
      return null;
    }
  }

  // Hash password (simple implementation)
  private hashPassword(password: string): string {
    return btoa(password + 'salt'); // Simple hash for demo
  }

  // Verify password
  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = Array.from(this.users.values()).find(
        user => user.email.toLowerCase() === data.email.toLowerCase()
      );

      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      // Validate data
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        return {
          success: false,
          message: 'All fields are required'
        };
      }

      if (data.password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters'
        };
      }

      // Create new user
      const userId = Date.now().toString();
      const newUser: User = {
        id: userId,
        email: data.email.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        avatar: '',
        isEmailVerified: false,
        subscription: {
          type: 'free',
          status: 'active'
        },
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      // Store user with hashed password
      this.users.set(userId, {
        ...newUser,
        password: this.hashPassword(data.password)
      } as any);

      this.saveUsers();

      // Generate tokens
      const accessToken = this.generateToken(userId);
      const refreshToken = this.generateToken(userId + '_refresh');

      // Store session
      this.sessions.set(accessToken, {
        userId,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      });

      return {
        success: true,
        data: {
          user: newUser,
          accessToken,
          refreshToken
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed'
      };
    }
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = Array.from(this.users.values()).find(
        u => u.email.toLowerCase() === data.email.toLowerCase()
      );

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Verify password
      const userWithPassword = user as any;
      if (!this.verifyPassword(data.password, userWithPassword.password)) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Generate tokens
      const accessToken = this.generateToken(user.id);
      const refreshToken = this.generateToken(user.id + '_refresh');

      // Update last login
      const updatedUser = {
        ...user,
        lastLoginAt: new Date().toISOString()
      };

      this.users.set(user.id, updatedUser);
      this.saveUsers();

      // Store session
      this.sessions.set(accessToken, {
        userId: user.id,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      });

      return {
        success: true,
        data: {
          user: updatedUser,
          accessToken,
          refreshToken
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed'
      };
    }
  }

  // Get current user
  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const userId = this.validateToken(token);
      if (!userId) return null;

      const user = this.users.get(userId);
      if (!user) return null;

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const userId = this.validateToken(refreshToken);
      if (!userId) {
        return {
          success: false,
          message: 'Invalid refresh token'
        };
      }

      const user = this.users.get(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Generate new tokens
      const newAccessToken = this.generateToken(userId);
      const newRefreshToken = this.generateToken(userId + '_refresh');

      // Store new session
      this.sessions.set(newAccessToken, {
        userId,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      });

      return {
        success: true,
        data: {
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: 'Token refresh failed'
      };
    }
  }

  // Logout
  async logout(token: string): Promise<boolean> {
    try {
      this.sessions.delete(token);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  // Update user profile
  async updateProfile(userId: string, data: Partial<User>): Promise<AuthResponse> {
    try {
      const user = this.users.get(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const updatedUser = {
        ...user,
        ...data,
        name: `${data.firstName || user.firstName} ${data.lastName || user.lastName}`
      };

      this.users.set(userId, updatedUser);
      this.saveUsers();

      return {
        success: true,
        data: {
          user: updatedUser,
          accessToken: '',
          refreshToken: ''
        }
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Profile update failed'
      };
    }
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const user = this.users.get(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const userWithPassword = user as any;
      if (!this.verifyPassword(currentPassword, userWithPassword.password)) {
        return {
          success: false,
          message: 'Current password is incorrect'
        };
      }

      // Update password
      this.users.set(userId, {
        ...user,
        password: this.hashPassword(newPassword)
      } as any);

      this.saveUsers();

      return {
        success: true
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Password change failed'
      };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const user = Array.from(this.users.values()).find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // In a real app, send email here
      // For now, just return success
      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Password reset failed'
      };
    }
  }

  // Verify email
  async verifyEmail(_token: string): Promise<AuthResponse> {
    try {
      // In a real app, verify email token
      // For now, just return success
      return {
        success: true,
        message: 'Email verified successfully'
      };
    } catch (error) {
      console.error('Verify email error:', error);
      return {
        success: false,
        message: 'Email verification failed'
      };
    }
  }
}

// Remote Authentication Service (for future use)
class RemoteAuthService {
  async register(_data: RegisterData): Promise<AuthResponse> {
    // TODO: Implement remote registration
    throw new Error('Remote authentication not implemented yet');
  }

  async login(_data: LoginData): Promise<AuthResponse> {
    // TODO: Implement remote login
    throw new Error('Remote authentication not implemented yet');
  }

  async getCurrentUser(_token: string): Promise<User | null> {
    // TODO: Implement remote user fetch
    throw new Error('Remote authentication not implemented yet');
  }

  async refreshToken(_refreshToken: string): Promise<AuthResponse> {
    // TODO: Implement remote token refresh
    throw new Error('Remote authentication not implemented yet');
  }

  async logout(_token: string): Promise<boolean> {
    // TODO: Implement remote logout
    throw new Error('Remote authentication not implemented yet');
  }

  async updateProfile(_userId: string, _data: Partial<User>): Promise<AuthResponse> {
    // TODO: Implement remote profile update
    throw new Error('Remote authentication not implemented yet');
  }

  async changePassword(_userId: string, _currentPassword: string, _newPassword: string): Promise<AuthResponse> {
    // TODO: Implement remote password change
    throw new Error('Remote authentication not implemented yet');
  }

  async resetPassword(_email: string): Promise<AuthResponse> {
    // TODO: Implement remote password reset
    throw new Error('Remote authentication not implemented yet');
  }

  async verifyEmail(_token: string): Promise<AuthResponse> {
    // TODO: Implement remote email verification
    throw new Error('Remote authentication not implemented yet');
  }
}

// Export the appropriate service based on configuration
export const AuthService = config.app.mockMode ? new LocalAuthService() : new RemoteAuthService();

// Export types
// export type { AuthResponse, LoginData, RegisterData, User };
