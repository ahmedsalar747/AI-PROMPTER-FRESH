import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { config } from '../config';
import { type RegisterData, type User, AuthService } from '../services/AuthService';

// Re-export types from AuthService
export type { RegisterData, User } from '../services/AuthService';

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(config.storage.keys.authToken);
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Get current user from AuthService
      const currentUser = await AuthService.getCurrentUser(token);
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Token is invalid, clear it
        setUser(null);
        localStorage.removeItem(config.storage.keys.authToken);
        localStorage.removeItem(config.storage.keys.refreshToken);
        localStorage.removeItem(config.storage.keys.user);
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);
      setUser(null);
      localStorage.removeItem(config.storage.keys.authToken);
      localStorage.removeItem(config.storage.keys.refreshToken);
      localStorage.removeItem(config.storage.keys.user);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await AuthService.login({ email, password });
      
      if (response.success && response.data) {
        const { user: userData, accessToken, refreshToken } = response.data;
        
        setUser(userData);
        localStorage.setItem(config.storage.keys.authToken, accessToken);
        localStorage.setItem(config.storage.keys.refreshToken, refreshToken);
        localStorage.setItem(config.storage.keys.user, JSON.stringify(userData));
        
        return true;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await AuthService.register(data);
      
      if (response.success && response.data) {
        const { user: userData, accessToken, refreshToken } = response.data;
        
        setUser(userData);
        localStorage.setItem(config.storage.keys.authToken, accessToken);
        localStorage.setItem(config.storage.keys.refreshToken, refreshToken);
        localStorage.setItem(config.storage.keys.user, JSON.stringify(userData));
        
        return true;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem(config.storage.keys.authToken);
      if (token) {
        await AuthService.logout(token);
      }

      // Clear user data
      setUser(null);
      
      // Clear all auth-related data
      localStorage.removeItem(config.storage.keys.authToken);
      localStorage.removeItem(config.storage.keys.refreshToken);
      localStorage.removeItem(config.storage.keys.user);
      localStorage.removeItem(config.storage.keys.apiUsage);
      localStorage.removeItem(config.storage.keys.adFreePurchase);
      localStorage.removeItem(config.storage.keys.proSubscription);
      localStorage.removeItem(config.storage.keys.settings);
      
      return true;
    } catch (error: any) {
      console.error('Logout failed:', error);
      // Even if API call fails, clear local storage
      setUser(null);
      localStorage.removeItem(config.storage.keys.authToken);
      localStorage.removeItem(config.storage.keys.refreshToken);
      localStorage.removeItem(config.storage.keys.user);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error('User not found');
      }

      const response = await AuthService.updateProfile(user.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone
      });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem(config.storage.keys.user, JSON.stringify(response.data.user));
        return true;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error: any) {
      console.error('Profile update failed:', error);
      throw new Error(error.message || 'Profile update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error('User not found');
      }

      const response = await AuthService.changePassword(user.id, currentPassword, newPassword);
      
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error: any) {
      console.error('Password change failed:', error);
      throw new Error(error.message || 'Password change failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await AuthService.resetPassword(email);
      
      if (response.success) {
        return true;
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error: any) {
      console.error('Password reset failed:', error);
      throw new Error(error.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await AuthService.verifyEmail(token);
      
      if (response.success) {
        // Update user's email verification status
        if (user) {
          const updatedUser = { ...user, isEmailVerified: true };
          setUser(updatedUser);
          localStorage.setItem(config.storage.keys.user, JSON.stringify(updatedUser));
        }
        return true;
      } else {
        throw new Error(response.message || 'Email verification failed');
      }
    } catch (error: any) {
      console.error('Email verification failed:', error);
      throw new Error(error.message || 'Email verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    verifyEmail,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 