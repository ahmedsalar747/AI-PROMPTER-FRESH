import React from 'react';
import { FiBox, FiFeather, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import AdBanner from './AdBanner';
import ApiKeyWarning from './ApiKeyWarning';
import './Dashboard.redesigned.css'; // Using a new CSS file for the redesign

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    { title: 'AI Generator', icon: FiFeather, path: '/enhancer' },
    { title: 'My Prompts', icon: FiBox, path: '/library' },
    { title: 'Conversational Wizard', icon: FiZap, path: '/gallery' },
  ];

  return (
    <div className="dashboard-page">
      {/* 🔑 API Key Warning */}
      <ApiKeyWarning />
      
      {/* 🔧 API Key Debugger (for troubleshooting) */}
      
      
      <div className="welcome-card card">
        <h2>Welcome to PromptCraft Pro</h2>
        <p>Your central hub for crafting, managing, and optimizing AI prompts.</p>
      </div>

      {/* Ad Banner for free users */}
      <AdBanner position="top" />





      <div className="actions-grid">
        {quickActions.map((action) => (
          <div key={action.path} className="action-card card" onClick={() => navigate(action.path)}>
            <div className="action-icon">
              <action.icon />
            </div>
            <h3>{action.title}</h3>
            <p>Access {action.title.toLowerCase()} features</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 