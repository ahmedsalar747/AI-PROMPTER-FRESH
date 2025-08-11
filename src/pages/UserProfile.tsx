import React, { useEffect, useRef, useState } from 'react';
import {
    FiBarChart2, // جایگزین FiBarChart3
    FiCalendar,
    FiCamera,
    FiCreditCard,
    FiDollarSign,
    FiEdit,
    FiLock,
    FiMail,
    FiMapPin,
    FiPhone,
    FiPieChart,
    FiSave,
    FiShield,
    FiTrash2,
    FiTrendingUp,
    FiUser,
    FiX,
    FiZap
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './UserProfile.css';

type TabType = 'profile' | 'security' | 'subscription' | 'usage';

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar: string;
  dateJoined: string;
  lastLogin: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
}

interface SubscriptionInfo {
  plan: 'free' | 'ad-free' | 'pro';
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenewal: boolean;
  nextBilling: string;
  amount: number;
}

interface UsageStats {
  tokensUsed: number;
  tokensLimit: number;
  requestsUsed: number;
  requestsLimit: number;
  lastResetDate: string;
  nextResetDate: string;
  averageDaily: number;
  peakUsageDay: string;
  favoriteModels: string[];
  totalSaved: number;
}

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    firstName: 'John',
    lastName: 'Doe', 
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: 'New York, USA',
    bio: 'AI enthusiast and content creator',
    avatar: '',
    dateJoined: '2024-01-15',
    lastLogin: '2024-12-10T14:30:00Z'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30
  });

  const [subscription] = useState<SubscriptionInfo>({
    plan: 'free',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    autoRenewal: true,
    nextBilling: '2024-02-15',
    amount: 0
  });

  const [usageStats] = useState<UsageStats>({
    tokensUsed: 1250,
    tokensLimit: 2000,
    requestsUsed: 45,
    requestsLimit: 100,
    lastResetDate: '2024-01-01',
    nextResetDate: '2024-02-01',
    averageDaily: 42,
    peakUsageDay: '2024-01-15',
    favoriteModels: ['GPT-4', 'Claude-3', 'Gemini'],
    totalSaved: 156
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateProfile, changePassword } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      // Load user data from API or localStorage
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      setIsLoading(true);
      
      const success = await updateProfile({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone,
        address: userProfile.address,
        bio: userProfile.bio
      });

      if (success) {
        addToast('Your profile has been updated successfully', 'success');
        setIsEditing(false);
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    if (securitySettings.newPassword.length < 8) {
      addToast('Password must be at least 8 characters long', 'error');
      return;
    }

    try {
      setIsLoading(true);
      
      const success = await changePassword(
        securitySettings.currentPassword,
        securitySettings.newPassword
      );

      if (success) {
        addToast('Your password has been changed successfully', 'success');
        
        setSecuritySettings(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to change password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Avatar image must be smaller than 2MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUserProfile(prev => ({ ...prev, avatar: result }));
        
        addToast('Your profile picture has been updated', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      const doubleConfirm = window.confirm(
        'This will permanently delete all your data. Type "DELETE" to confirm.'
      );
      
      if (doubleConfirm) {
        try {
          setIsLoading(true);
          // Call delete account API
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          addToast('Your account has been deleted successfully', 'success');
          
          // Redirect to home or login page
          window.location.href = '/';
        } catch (error: any) {
          addToast(error.message || 'Failed to delete account', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min(100, (used / limit) * 100);
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro': return '#7c3aed';
      case 'ad-free': return '#059669';
      default: return '#6b7280';
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: FiUser },
    { id: 'security' as TabType, label: 'Security', icon: FiShield },
    { id: 'subscription' as TabType, label: 'Subscription', icon: FiCreditCard },
    { id: 'usage' as TabType, label: 'Usage', icon: FiBarChart2 }
  ];

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="avatar-container">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt="Profile" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                <FiUser />
              </div>
            )}
            <button 
              className="avatar-upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiCamera />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <div className="profile-info">
            <h1>{userProfile.firstName} {userProfile.lastName}</h1>
            <p className="profile-email">{userProfile.email}</p>
            <p className="join-date">Member since {formatDate(userProfile.dateJoined)}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <FiZap className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{usageStats.tokensUsed.toLocaleString()}</span>
              <span className="stat-label">Tokens Used</span>
            </div>
          </div>
          <div className="stat-card">
            <FiTrendingUp className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{usageStats.requestsUsed}</span>
              <span className="stat-label">Requests Made</span>
            </div>
          </div>
          <div className="stat-card">
            <FiPieChart className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{usageStats.totalSaved}</span>
              <span className="stat-label">Prompts Saved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="tab-header">
                <h2>Personal Information</h2>
                <button 
                  className={`edit-button ${isEditing ? 'cancel' : ''}`}
                  onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                >
                  {isEditing ? <FiX /> : <FiEdit />}
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <div className="input-group">
                      <FiUser className="input-icon" />
                      <input
                        type="text"
                        value={userProfile.firstName}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        className={isEditing ? 'editing' : ''}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <div className="input-group">
                      <FiUser className="input-icon" />
                      <input
                        type="text"
                        value={userProfile.lastName}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        className={isEditing ? 'editing' : ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-group">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="readonly"
                    />
                  </div>
                  <small>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-group">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className={isEditing ? 'editing' : ''}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <div className="input-group">
                    <FiMapPin className="input-icon" />
                    <input
                      type="text"
                      value={userProfile.address}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      className={isEditing ? 'editing' : ''}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={userProfile.bio}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    className={isEditing ? 'editing' : ''}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button 
                      className="save-button"
                      onClick={handleProfileSave}
                      disabled={isLoading}
                    >
                      <FiSave />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-activity">
                <h3>Account Activity</h3>
                <div className="activity-stats">
                  <div className="activity-item">
                    <span className="activity-label">Last Login:</span>
                    <span className="activity-value">{formatDateTime(userProfile.lastLogin)}</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-label">Account Created:</span>
                    <span className="activity-value">{formatDate(userProfile.dateJoined)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-tab">
              <div className="security-section">
                <h3>Change Password</h3>
                <div className="password-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <div className="input-group">
                      <FiLock className="input-icon" />
                      <input
                        type="password"
                        value={securitySettings.currentPassword}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <div className="input-group">
                      <FiLock className="input-icon" />
                      <input
                        type="password"
                        value={securitySettings.newPassword}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="input-group">
                      <FiLock className="input-icon" />
                      <input
                        type="password"
                        value={securitySettings.confirmPassword}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <button 
                    className="change-password-button"
                    onClick={handlePasswordChange}
                    disabled={isLoading || !securitySettings.currentPassword || !securitySettings.newPassword}
                  >
                    <FiShield />
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>

              <div className="security-section">
                <h3>Security Settings</h3>
                <div className="security-options">
                  <div className="security-option">
                    <div className="option-info">
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorEnabled}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="security-option">
                    <div className="option-info">
                      <h4>Login Notifications</h4>
                      <p>Get notified when someone logs into your account</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={securitySettings.loginNotifications}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginNotifications: e.target.checked }))}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="security-option">
                    <div className="option-info">
                      <h4>Session Timeout</h4>
                      <p>Automatically log out after inactivity</p>
                    </div>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                      className="timeout-select"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={-1}>Never</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <div className="danger-section">
                  <div className="danger-info">
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all associated data</p>
                  </div>
                  <button 
                    className="delete-account-button"
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                  >
                    <FiTrash2 />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="subscription-tab">
              <div className="subscription-header">
                <h3>Current Subscription</h3>
                <span 
                  className="plan-badge"
                  style={{ backgroundColor: getPlanBadgeColor(subscription.plan) }}
                >
                  {subscription.plan === 'pro' ? 'Pro Plan' : 
                   subscription.plan === 'ad-free' ? 'Ad-Free' : 'Free Plan'}
                </span>
              </div>

              <div className="subscription-details">
                <div className="detail-card">
                  <div className="detail-header">
                    <FiCreditCard className="detail-icon" />
                    <h4>Plan Details</h4>
                  </div>
                  <div className="detail-content">
                    <div className="detail-row">
                      <span>Status:</span>
                      <span className={`status-badge ${subscription.status}`}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Start Date:</span>
                      <span>{formatDate(subscription.startDate)}</span>
                    </div>
                    <div className="detail-row">
                      <span>End Date:</span>
                      <span>{formatDate(subscription.endDate)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Auto Renewal:</span>
                      <span>{subscription.autoRenewal ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-header">
                    <FiDollarSign className="detail-icon" />
                    <h4>Billing Information</h4>
                  </div>
                  <div className="detail-content">
                    <div className="detail-row">
                      <span>Current Amount:</span>
                      <span>{subscription.amount.toLocaleString()} Toman</span>
                    </div>
                    <div className="detail-row">
                      <span>Next Billing:</span>
                      <span>{formatDate(subscription.nextBilling)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Payment Method:</span>
                      <span>Credit Card (**** 1234)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="subscription-actions">
                <button className="action-button primary">
                  Upgrade Plan
                </button>
                <button className="action-button secondary">
                  Manage Billing
                </button>
                <button className="action-button danger">
                  Cancel Subscription
                </button>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="usage-tab">
              <div className="usage-overview">
                <h3>Usage Overview</h3>
                <div className="usage-period">
                  <span>Period: {formatDate(usageStats.lastResetDate)} - {formatDate(usageStats.nextResetDate)}</span>
                </div>
              </div>

              <div className="usage-stats-grid">
                <div className="usage-card">
                  <div className="usage-header">
                    <FiZap className="usage-icon" />
                    <h4>Tokens</h4>
                  </div>
                  <div className="usage-content">
                    <div className="usage-numbers">
                      <span className="used">{usageStats.tokensUsed.toLocaleString()}</span>
                      <span className="separator">/</span>
                      <span className="limit">{usageStats.tokensLimit.toLocaleString()}</span>
                    </div>
                    <div className="usage-bar">
                      <div 
                        className="usage-fill"
                        style={{ width: `${getUsagePercentage(usageStats.tokensUsed, usageStats.tokensLimit)}%` }}
                      />
                    </div>
                    <div className="usage-percentage">
                      {getUsagePercentage(usageStats.tokensUsed, usageStats.tokensLimit).toFixed(1)}% used
                    </div>
                  </div>
                </div>

                <div className="usage-card">
                  <div className="usage-header">
                    <FiTrendingUp className="usage-icon" />
                    <h4>Requests</h4>
                  </div>
                  <div className="usage-content">
                    <div className="usage-numbers">
                      <span className="used">{usageStats.requestsUsed}</span>
                      <span className="separator">/</span>
                      <span className="limit">{usageStats.requestsLimit}</span>
                    </div>
                    <div className="usage-bar">
                      <div 
                        className="usage-fill"
                        style={{ width: `${getUsagePercentage(usageStats.requestsUsed, usageStats.requestsLimit)}%` }}
                      />
                    </div>
                    <div className="usage-percentage">
                      {getUsagePercentage(usageStats.requestsUsed, usageStats.requestsLimit).toFixed(1)}% used
                    </div>
                  </div>
                </div>

                <div className="usage-card">
                  <div className="usage-header">
                    <FiCalendar className="usage-icon" />
                    <h4>Daily Average</h4>
                  </div>
                  <div className="usage-content">
                    <div className="stat-value large">{usageStats.averageDaily}</div>
                    <div className="stat-label">tokens per day</div>
                  </div>
                </div>

                <div className="usage-card">
                  <div className="usage-header">
                    <FiPieChart className="usage-icon" />
                    <h4>Peak Usage</h4>
                  </div>
                  <div className="usage-content">
                    <div className="stat-value">{formatDate(usageStats.peakUsageDay)}</div>
                    <div className="stat-label">highest usage day</div>
                  </div>
                </div>
              </div>

              <div className="favorite-models">
                <h4>Favorite AI Models</h4>
                <div className="models-list">
                  {usageStats.favoriteModels.map((model, index) => (
                    <div key={model} className="model-item">
                      <span className="model-rank">#{index + 1}</span>
                      <span className="model-name">{model}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="usage-actions">
                <button className="action-button">
                  Download Usage Report
                </button>
                <button className="action-button secondary">
                  Reset Statistics
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 