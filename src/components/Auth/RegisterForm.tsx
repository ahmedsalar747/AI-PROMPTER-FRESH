import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './AuthModal.css';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      addToast('Please fill in all required fields', 'error');
      return false;
    }

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      addToast('Please enter a valid email address', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: '', // Empty phone field
        password: formData.password
      });

      if (success) {
        addToast('Your account has been created successfully', 'success');
        onClose();
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to create account', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-header">
        <h2>📝 Register</h2>
        <p>Create a new account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="example@email.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Minimum 6 characters"
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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Repeat your password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Registering...' : '📝 Register'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="auth-link"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm; 