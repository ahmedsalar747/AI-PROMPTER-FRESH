import React, { useState } from 'react';
import ApiKeyManager from '../components/ApiKeyManager';
import { useLanguage } from '../context/LanguageContext';
import './Settings.redesigned.css';

const Settings: React.FC = () => {
  const { currentLanguage, availableLanguages } = useLanguage();
  const [selectedSection, setSelectedSection] = useState('tokens');
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);

  const sections = [
    { id: 'tokens', label: 'Token Usage', icon: '🎯' },
    { id: 'apikeys', label: 'API Keys', icon: '🔑' },
    { id: 'language', label: 'Language', icon: '🌐' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  return (
    <div className="settings-page-redesigned">
      <div className="settings-sidebar-redesigned">
        <nav className="settings-nav-redesigned">
          {sections.map(section => (
            <button
              key={section.id}
              className={`nav-item-redesigned ${selectedSection === section.id ? 'active' : ''}`}
              onClick={() => setSelectedSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-label">{section.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="settings-content-redesigned">
        {selectedSection === 'tokens' && (
          <div className="settings-section-redesigned">
            <h2>Token Usage Management</h2>
            <p>Monitor your token usage and manage your monthly free API allocation.</p>
            <div className="token-sections">
              <div className="token-balance-section">
                <p>Token details and history will be displayed here.</p>
              </div>
              <div className="token-management-section">
                <p>Free API management options will be available here.</p>
              </div>
            </div>
          </div>
        )}

        {selectedSection === 'apikeys' && (
          <div className="settings-section-redesigned">
            <h2>API Keys Management</h2>
            <p>Manage your API keys for different services.</p>
            <button className="btn-primary-redesigned" onClick={() => setShowApiKeyManager(true)}>
              Manage API Keys
            </button>
          </div>
        )}

        {selectedSection === 'language' && (
          <div className="settings-section-redesigned">
            <h2>Language Settings</h2>
            <p><strong>Current Language:</strong> {currentLanguage}</p>
            <p>Available languages: {availableLanguages.map(l => l.name).join(', ')}</p>
          </div>
        )}

        {selectedSection === 'about' && (
          <div className="settings-section-redesigned">
            <h2>About Prompter Fresh</h2>
            <p>Version: 2.0.0</p>
            <p>A powerful tool for prompt engineering.</p>
          </div>
        )}
      </div>

      {showApiKeyManager && (
        <ApiKeyManager onClose={() => setShowApiKeyManager(false)} />
      )}
    </div>
  );
};

export default Settings; 