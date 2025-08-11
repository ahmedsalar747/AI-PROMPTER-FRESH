import React, { useEffect, useState } from 'react';
import { useApiKey } from '../context/ApiKeyContext';
import { hasPersonalApiKey } from '../utils/apiKeyDetector';
import './ApiKeyWarning.css';

interface ApiKeyWarningProps {
  className?: string;
}

const ApiKeyWarning: React.FC<ApiKeyWarningProps> = ({ className = '' }) => {
  const { currentModel, getApiKey, availableModels } = useApiKey();
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    const checkApiKeyStatus = () => {
      const currentModelInfo = availableModels.find(m => m.id === currentModel);
      if (!currentModelInfo) return;

      const apiKey = getApiKey(currentModel);
      const hasPersonal = hasPersonalApiKey();

      // If user has personal API key, no warning needed
      if (hasPersonal) {
        setShowWarning(false);
        return;
      }

      // Check if current model needs API key
      if (currentModelInfo.provider === 'Ollama') {
        setShowWarning(false);
        return;
      }

      // Check if API key is missing or invalid
      if (!apiKey || apiKey.trim().length === 0) {
        setShowWarning(true);
        setWarningMessage(`You can use your LLM API Keys in Settings`);
        return;
      }

      // Check for placeholder values
      if (apiKey.includes('your-api-key') || 
          apiKey.includes('sk-your-api-key-here') ||
          apiKey.includes('placeholder')) {
        setShowWarning(true);
        setWarningMessage(`❌ Please replace the placeholder ${currentModelInfo.provider} API key for ${currentModelInfo.name} with your actual API key, or switch to another AI provider in Settings.`);
        return;
      }

      // Check minimum length
      if (apiKey.length < 10) {
        setShowWarning(true);
        setWarningMessage(`❌ ${currentModelInfo.provider} API key for ${currentModelInfo.name} appears to be invalid. Please check your API key or switch to another AI provider in Settings.`);
        return;
      }

      // Provider-specific format checks
      let isValid = true;
      switch (currentModelInfo.provider) {
        case 'OpenAI':
          if (!apiKey.startsWith('sk-')) {
            isValid = false;
          }
          break;
        case 'Anthropic':
          if (!apiKey.startsWith('sk-ant-')) {
            isValid = false;
          }
          break;
        case 'DeepSeek':
          if (!apiKey.startsWith('sk-')) {
            isValid = false;
          }
          break;
      }

      if (!isValid) {
        setShowWarning(true);
        setWarningMessage(`❌ Invalid ${currentModelInfo.provider} API key format for ${currentModelInfo.name}. Please check your API key format or switch to another AI provider in Settings.`);
        return;
      }

      setShowWarning(false);
    };

    checkApiKeyStatus();

    // Check again when model changes
    const interval = setInterval(checkApiKeyStatus, 5000);

    return () => clearInterval(interval);
  }, [currentModel, getApiKey, availableModels]);

  if (!showWarning) {
    return null;
  }

  return (
    <div className={`api-key-warning ${className}`}>
      <div className="warning-content">
        <div className="warning-icon">⚠️</div>
        <div className="warning-text">
          <div className="warning-title">
            API Key Required
          </div>
          <div className="warning-message">{warningMessage}</div>
        </div>
        <div className="warning-actions">
          <button 
            className="warning-button primary"
            onClick={() => window.location.href = '/settings'}
          >
            🔧 Configure AI Provider
          </button>
          <button 
            className="warning-button secondary"
            onClick={() => setShowWarning(false)}
          >
            ✕ Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyWarning; 