import React, { useState } from 'react';
import { useApiKey } from '../context/ApiKeyContext';
import './ModelSelector.css';

const WorkingModelSelector: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Get context data safely
  const {
    currentModel,
    availableModels, 
    getApiKey,
    setCurrentModel,
    setShowApiKeyModal
  } = useApiKey();

  const activeModel = availableModels.find(m => m.id === currentModel);
  const hasApiKey = !!getApiKey(currentModel);

  const enabledModels = availableModels.filter(model => {
    const hasKey = !!getApiKey(model.id);
    return hasKey || model.provider === 'Ollama';
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleModelChange = (modelId: string) => {
    setCurrentModel(modelId);
    setShowDropdown(false);
  };

  const handleManageKeys = () => {
    setShowDropdown(false);
    setShowApiKeyModal(true);
  };

  return (
    <div className="model-selector">
      <div className="current-model-display" onClick={handleToggle}>
        <div className="model-info">
          <span className="model-icon">{activeModel?.icon || '🤖'}</span>
          <div className="model-details">
            <div className="model-name">{activeModel?.name || 'No Model'}</div>
            <div className="model-status">
              {hasApiKey ? (
                <span className="status ready">✅ Ready</span>
              ) : (
                <span className="status warning">⚠️ No API Key</span>
              )}
            </div>
          </div>
        </div>
        <div className="dropdown-arrow">
          <span className={`arrow ${showDropdown ? 'open' : ''}`}>▼</span>
        </div>
      </div>

      {showDropdown && (
        <div className="model-dropdown">
          <div className="dropdown-header">
            <h4>🤖 Available Models</h4>
            <div className="model-count">{enabledModels.length} configured</div>
          </div>

          <div className="models-list">
            {enabledModels.map(model => {
              const isActive = model.id === currentModel;
              const modelHasKey = !!getApiKey(model.id);
              
              return (
                <div 
                  key={model.id}
                  className={`model-option ${isActive ? 'active' : ''}`}
                  onClick={() => handleModelChange(model.id)}
                >
                  <div className="option-info">
                    <span className="option-icon">{model.icon}</span>
                    <div className="option-details">
                      <div className="option-name">{model.name}</div>
                      <div className="option-provider">{model.provider}</div>
                    </div>
                  </div>
                  <div className="option-status">
                    {isActive && <span className="active-indicator">🎯</span>}
                    {modelHasKey ? (
                      <span className="status-icon ready">✅</span>
                    ) : (
                      <span className="status-icon warning">⚠️</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="dropdown-footer">
            <button className="manage-keys-btn" onClick={handleManageKeys}>
              🔑 Manage API Keys
            </button>
          </div>
        </div>
      )}

      {showDropdown && (
        <div 
          className="model-selector-backdrop" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default WorkingModelSelector; 