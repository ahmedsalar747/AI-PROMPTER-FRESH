import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './AuthModal.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      addToast('Please enter your email and password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        addToast('You have successfully logged in', 'success');
        onClose();
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to login', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-header">
        <h2>🔐 Sign In</h2>
        <p>Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Signing in...' : '🔓 Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="auth-link"
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            Register
          </button>
        </p>
      </div>

      <div className="auth-demo-info">
        <p>💡 For testing: demo@example.com / password123</p>
      </div>
    </div>
  );
};

export default LoginForm; 