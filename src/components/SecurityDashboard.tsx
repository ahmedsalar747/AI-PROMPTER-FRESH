import React, { useEffect, useState } from 'react';
import './SecurityDashboard.css';

// Mock security API since SecureFreeApiService is removed
const secureFreeApi = {
  getSecurityDashboard: async () => ({
    threatLevel: 'low',
    trustScore: 85,
    deviceFingerprint: 'mock-fingerprint',
    lastActivity: new Date().toISOString(),
    incidents: []
  })
};

interface SecurityDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ isOpen, onClose }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'incidents'>('overview');

  useEffect(() => {
    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await secureFreeApi.getSecurityDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load security dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="security-dashboard-overlay">
      <div className="security-dashboard">
        <div className="dashboard-header">
          <h2>🛡️ Security Dashboard</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            🔍 Details
          </button>
          <button
            className={`tab-button ${activeTab === 'incidents' ? 'active' : ''}`}
            onClick={() => setActiveTab('incidents')}
          >
            🚨 Incidents
          </button>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p>Loading security data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="security-cards">
                    <div className="security-card">
                      <div className="card-header">
                        <span className="card-icon">🛡️</span>
                        <h3>Threat Level</h3>
                      </div>
                      <div className="card-content">
                        <div 
                          className="threat-level-badge"
                          style={{ backgroundColor: getThreatLevelColor(dashboardData?.stats?.threatLevel || 'unknown') }}
                        >
                          {dashboardData?.stats?.threatLevel?.toUpperCase() || 'UNKNOWN'}
                        </div>
                        <p className="card-description">
                          Current security threat assessment
                        </p>
                      </div>
                    </div>

                    <div className="security-card">
                      <div className="card-header">
                        <span className="card-icon">📊</span>
                        <h3>Trust Score</h3>
                      </div>
                      <div className="card-content">
                        <div className="trust-score-container">
                          <div className="trust-score-circle">
                            <div 
                              className="trust-score-fill"
                              style={{ 
                                strokeDasharray: `${(dashboardData?.stats?.usage?.trustScore || 0) * 2.83}, 283`,
                                stroke: getTrustScoreColor(dashboardData?.stats?.usage?.trustScore || 0)
                              }}
                            />
                            <span className="trust-score-text">
                              {dashboardData?.stats?.usage?.trustScore || 0}%
                            </span>
                          </div>
                        </div>
                        <p className="card-description">
                          Device trustworthiness rating
                        </p>
                      </div>
                    </div>

                    <div className="security-card">
                      <div className="card-header">
                        <span className="card-icon">📱</span>
                        <h3>Device Status</h3>
                      </div>
                      <div className="card-content">
                        <div className="device-info">
                          <p><strong>ID:</strong> {dashboardData?.stats?.deviceFingerprint?.deviceId?.substring(0, 8) || 'N/A'}...</p>
                          <p><strong>Platform:</strong> {dashboardData?.stats?.deviceFingerprint?.platform || 'Unknown'}</p>
                          <p><strong>Confidence:</strong> {dashboardData?.stats?.deviceFingerprint?.confidence || 'Unknown'}</p>
                        </div>
                        <p className="card-description">
                          Device identification status
                        </p>
                      </div>
                    </div>

                    <div className="security-card">
                      <div className="card-header">
                        <span className="card-icon">📈</span>
                        <h3>Usage Stats</h3>
                      </div>
                      <div className="card-content">
                        <div className="usage-stats">
                          <div className="stat-item">
                            <span className="stat-label">Requests:</span>
                            <span className="stat-value">{dashboardData?.stats?.usage?.requestsUsed || 0}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Tokens:</span>
                            <span className="stat-value">{dashboardData?.stats?.usage?.tokensUsed || 0}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Installs:</span>
                            <span className="stat-value">{dashboardData?.stats?.usage?.installCount || 0}</span>
                          </div>
                        </div>
                        <p className="card-description">
                          Current month usage
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="recommendations-section">
                    <h3>🔍 Security Recommendations</h3>
                    <div className="recommendations-list">
                      {dashboardData?.recommendations?.map((rec: string, index: number) => (
                        <div key={index} className="recommendation-item">
                          <span className="recommendation-icon">
                            {rec.includes('Trust Score') ? '📊' : 
                             rec.includes('Suspicious') ? '⚠️' : 
                             rec.includes('Multiple') ? '🔄' : '💡'}
                          </span>
                          <span className="recommendation-text">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="details-tab">
                  <div className="details-section">
                    <h3>🔍 Device Fingerprint Details</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Device ID:</span>
                        <span className="detail-value">{dashboardData?.stats?.deviceFingerprint?.deviceId || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Platform:</span>
                        <span className="detail-value">{dashboardData?.stats?.deviceFingerprint?.platform || 'Unknown'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Confidence:</span>
                        <span className="detail-value">{dashboardData?.stats?.deviceFingerprint?.confidence || 'Unknown'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Created:</span>
                        <span className="detail-value">{dashboardData?.stats?.deviceFingerprint?.created ? formatDate(dashboardData.stats.deviceFingerprint.created) : 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Seen:</span>
                        <span className="detail-value">{dashboardData?.stats?.deviceFingerprint?.lastSeen ? formatDate(dashboardData.stats.deviceFingerprint.lastSeen) : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>📊 Usage Details</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Tokens Used:</span>
                        <span className="detail-value">{dashboardData?.stats?.usage?.tokensUsed || 0}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Requests Used:</span>
                        <span className="detail-value">{dashboardData?.stats?.usage?.requestsUsed || 0}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Install Count:</span>
                        <span className="detail-value">{dashboardData?.stats?.usage?.installCount || 0}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Suspicious Activity:</span>
                        <span className="detail-value">{dashboardData?.stats?.usage?.suspiciousActivity || 0}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">IP Addresses:</span>
                        <span className="detail-value">{dashboardData?.stats?.usage?.ipAddresses?.length || 0}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">User Agents:</span>
                        <span className="detail-value">{dashboardData?.stats?.usage?.userAgents?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>🕒 Timing Analysis</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Avg Request Interval:</span>
                        <span className="detail-value">{Math.round(dashboardData?.stats?.usage?.averageRequestInterval / 1000) || 0}s</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Total Requests:</span>
                        <span className="detail-value">{dashboardData?.stats?.usage?.requestTimes?.length || 0}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">First Used:</span>
                        <span className="detail-value">{dashboardData?.stats?.usage?.firstUsed ? formatDate(dashboardData.stats.usage.firstUsed) : 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Used:</span>
                        <span className="detail-value">{dashboardData?.stats?.usage?.lastUsed ? formatDate(dashboardData.stats.usage.lastUsed) : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'incidents' && (
                <div className="incidents-tab">
                  <h3>🚨 Security Incidents</h3>
                  {dashboardData?.incidents?.length > 0 ? (
                    <div className="incidents-list">
                      {dashboardData.incidents.map((incident: any, index: number) => (
                        <div key={index} className="incident-item">
                          <div className="incident-header">
                            <span className="incident-icon">🚨</span>
                            <span className="incident-time">{formatDate(incident.timestamp)}</span>
                          </div>
                          <div className="incident-content">
                            <p className="incident-error">{incident.error}</p>
                            <div className="incident-details">
                              <span>Prompt Length: {incident.promptLength}</span>
                              <span>URL: {incident.url}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-incidents">
                      <span className="no-incidents-icon">✅</span>
                      <p>No security incidents detected</p>
                      <small>Your usage patterns appear normal</small>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="dashboard-footer">
          <button className="refresh-button" onClick={loadDashboardData}>
            🔄 Refresh Data
          </button>
          <button className="close-button-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard; 