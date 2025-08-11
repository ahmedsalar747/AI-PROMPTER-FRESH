import React, { useEffect, useState } from 'react';
import type { AIModel, ModelConfig } from '../context/ApiKeyContext';
import { useApiKey } from '../context/ApiKeyContext';
import { notificationManager } from '../utils/notifications';
import './ApiKeyManager.css';

interface ApiKeyManagerProps {
  onClose: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onClose }) => {
  const {
    availableModels,
    currentModel,
    setCurrentModel,
    modelConfigs,
    updateModelConfig,
    setApiKey,
    getApiKey,
    // removeApiKey,
    validateApiKey
  } = useApiKey();

  const [selectedTab, setSelectedTab] = useState<'models' | 'settings'>('models');
  const [editingModel, setEditingModel] = useState<string | null>(null);
  const [tempApiKey, setTempApiKey] = useState<string>('');
  const [tempConfig, setTempConfig] = useState<Partial<ModelConfig>>({});
  const [validationStatus, setValidationStatus] = useState<Record<string, 'validating' | 'valid' | 'invalid' | null>>({});

  // Load current model config when editing starts
  useEffect(() => {
    if (editingModel) {
      const config = modelConfigs[editingModel] || {};
      setTempApiKey(config.apiKey || '');
      setTempConfig(config);
    }
  }, [editingModel, modelConfigs]);

  const handleModelSelect = (modelId: string) => {
    setCurrentModel(modelId);
  };

  const handleEditModel = (modelId: string) => {
    setEditingModel(modelId);
    setValidationStatus(prev => ({ ...prev, [modelId]: null }));
  };

  const handleSaveConfig = async (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    if (!model) {
      notificationManager.addToast({
        type: 'error',
        title: '❌ Model Not Found',
        message: 'Selected model not found',
        duration: 5000
      });
      return;
    }

    // Check if API key is empty
    if (!tempApiKey.trim()) {
      notificationManager.addToast({
        type: 'warning',
        title: `⚠️ ${model.provider} API Key Required`,
        message: `Please enter your ${model.provider} API key for ${model.name}`,
        duration: 5000
      });
      return;
    }

    // Check for placeholder values
    if (tempApiKey.includes('your-api-key') || 
        tempApiKey.includes('sk-your-api-key-here') ||
        tempApiKey.includes('placeholder')) {
      notificationManager.addToast({
        type: 'error',
        title: `❌ Placeholder ${model.provider} API Key`,
        message: `Please replace the placeholder with your actual ${model.provider} API key`,
        duration: 5000
      });
      return;
    }

    setValidationStatus(prev => ({ ...prev, [modelId]: 'validating' }));
    
    try {
      const isValid = await validateApiKey(modelId, tempApiKey);
      setValidationStatus(prev => ({ ...prev, [modelId]: isValid ? 'valid' : 'invalid' }));
      
      if (isValid) {
        setApiKey(modelId, tempApiKey);
        updateModelConfig(modelId, tempConfig);
        setEditingModel(null);
        setTempApiKey('');
        setTempConfig({});
        notificationManager.addToast({
          type: 'success',
          title: `✅ API Key Saved - ${model.provider}`,
          message: 'API key has been saved successfully',
          duration: 3000
        });
      } else {
        // Error message is already shown by validateApiKey function
        notificationManager.addToast({
          type: 'error',
          title: `❌ Invalid API Key - ${model.provider}`,
          message: 'Please check your API key and try again',
          duration: 5000
        });
      }
    } catch (error) {
      setValidationStatus(prev => ({ ...prev, [modelId]: 'invalid' }));
      notificationManager.addToast({
        type: 'error',
        title: `❌ Validation Error - ${model.provider}`,
        message: 'Error validating API key. Please try again.',
        duration: 5000
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingModel(null);
    setTempApiKey('');
    setTempConfig({});
    setValidationStatus({});
  };

  const renderModelCard = (model: AIModel) => {
    const isActive = currentModel === model.id;
    const isEditing = editingModel === model.id;
    const hasApiKey = !!getApiKey(model.id);
    const validation = validationStatus[model.id];

    return (
      <div key={model.id} className={`model-card ${isActive ? 'active' : ''} ${hasApiKey ? 'configured' : ''}`}>
        <div className="model-header">
          <div className="model-icon">{model.icon}</div>
          <div className="model-info">
            <h3>{model.name}</h3>
            <div className="model-provider">{model.provider}</div>
            <div className="model-description">{model.description}</div>
          </div>
          <div className="model-status">
            {hasApiKey && <span className="status-badge configured">✅ Configured</span>}
            {isActive && <span className="status-badge active">🎯 Active</span>}
          </div>
        </div>

        <div className="model-specs">
          <div className="spec-item">
            <span>Max Tokens:</span>
            <span>{model.maxTokens.toLocaleString()}</span>
          </div>
          <div className="spec-item">
            <span>Streaming:</span>
            <span>{model.supportsStreaming ? '✅' : '❌'}</span>
          </div>
          <div className="spec-item">
            <span>Pricing (1K tokens):</span>
            <span>${model.pricing.input}/${model.pricing.output}</span>
          </div>
        </div>

        {isEditing ? (
          <div className="model-config-form">
            <div className="form-group">
              <label>API Key:</label>
              <div className="api-key-input">
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder={`Enter your ${model.provider} API key`}
                  className={validation === 'invalid' ? 'invalid' : validation === 'valid' ? 'valid' : ''}
                />
                {validation === 'validating' && <div className="spinner">⏳</div>}
                {validation === 'valid' && <div className="validation-icon valid">✅</div>}
                {validation === 'invalid' && <div className="validation-icon invalid">❌</div>}
              </div>
              {validation === 'invalid' && (
                <div className="error-message">Invalid API key format</div>
              )}
            </div>

            <div className="form-group">
              <label>Custom Endpoint (Optional):</label>
              <input
                type="url"
                value={tempConfig.endpoint || model.defaultEndpoint}
                onChange={(e) => setTempConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                placeholder={model.defaultEndpoint}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Max Tokens:</label>
                <input
                  type="number"
                  value={tempConfig.maxTokens || 4096}
                  onChange={(e) => setTempConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  min="1"
                  max={model.maxTokens}
                />
              </div>
              <div className="form-group">
                <label>Temperature:</label>
                <input
                  type="number"
                  value={tempConfig.temperature || 0.7}
                  onChange={(e) => setTempConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  min="0"
                  max="2"
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="save-btn" 
                onClick={() => handleSaveConfig(model.id)}
                disabled={validation === 'validating'}
              >
                💾 Save Config
              </button>
              <button className="cancel-btn" onClick={handleCancelEdit}>
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="model-actions">
            <button 
              className={`select-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleModelSelect(model.id)}
              disabled={!hasApiKey && model.provider !== 'Ollama'}
            >
              {isActive ? '🎯 Selected' : '🔄 Select'}
            </button>
            <button 
              className="configure-btn"
              onClick={() => handleEditModel(model.id)}
            >
              ⚙️ Configure
            </button>
          </div>
        )}
      </div>
    );
  };

  const enabledModels = availableModels.filter(model => {
    const hasKey = !!getApiKey(model.id);
    return hasKey || model.provider === 'Ollama';
  });

  return (
    <div className="api-key-manager-overlay">
      <div className="api-key-manager">
        <div className="manager-header">
          <h2>🔑 AI Model Manager</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="manager-tabs">
          <button 
            className={`tab-btn ${selectedTab === 'models' ? 'active' : ''}`}
            onClick={() => setSelectedTab('models')}
          >
            🤖 Models ({availableModels.length})
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'settings' ? 'active' : ''}`}
            onClick={() => setSelectedTab('settings')}
          >
            ⚙️ Settings ({enabledModels.length} enabled)
          </button>
        </div>

        <div className="manager-content">
          {selectedTab === 'models' && (
            <div className="models-tab">
              <div className="tab-header">
                <h3>Available AI Models</h3>
                <p>Configure API keys for different AI providers to enhance your prompting experience.</p>
              </div>
              
              <div className="models-grid">
                {availableModels.map(renderModelCard)}
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="settings-tab">
              <div className="tab-header">
                <h3>Current Settings</h3>
                <p>Overview of your configured models and current selection.</p>
              </div>

              <div className="current-model-display">
                <h4>🎯 Active Model</h4>
                {(() => {
                  const activeModel = availableModels.find(m => m.id === currentModel);
                  if (activeModel) {
                    return (
                      <div className="active-model-card">
                        <div className="model-info">
                          <span className="model-icon">{activeModel.icon}</span>
                          <div>
                            <div className="model-name">{activeModel.name}</div>
                            <div className="model-provider">{activeModel.provider}</div>
                          </div>
                        </div>
                        <div className="model-status">
                          {getApiKey(currentModel) ? '✅ Ready' : '⚠️ No API Key'}
                        </div>
                      </div>
                    );
                  }
                  return <div>No model selected</div>;
                })()}
              </div>

              <div className="enabled-models-list">
                <h4>📝 Configured Models ({enabledModels.length})</h4>
                {enabledModels.length > 0 ? (
                  <div className="models-summary">
                    {enabledModels.map(model => (
                      <div key={model.id} className="model-summary-item">
                        <span className="model-icon">{model.icon}</span>
                        <span className="model-name">{model.name}</span>
                        <span className="model-provider">({model.provider})</span>
                        {model.id === currentModel && <span className="active-indicator">🎯</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-models-message">
                    <p>No models configured yet. Switch to the Models tab to set up API keys.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager; 