import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { notificationManager } from '../utils/notifications';

// Supported AI Models
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  icon: string;
  description: string;
  defaultEndpoint: string;
  supportsStreaming: boolean;
  maxTokens: number;
  pricing: {
    input: number; // per 1K tokens
    output: number; // per 1K tokens
  };
}

export interface ModelConfig {
  apiKey: string;
  endpoint: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  enabled: boolean;
}

export interface ApiKeyContextType {
  // Available Models
  availableModels: AIModel[];
  
  // Current Active Model
  currentModel: string;
  setCurrentModel: (modelId: string) => void;
  
  // Model Configurations
  modelConfigs: Record<string, ModelConfig>;
  updateModelConfig: (modelId: string, config: Partial<ModelConfig>) => void;
  
  // API Key Management
  setApiKey: (modelId: string, apiKey: string) => void;
  getApiKey: (modelId: string) => string | null;
  removeApiKey: (modelId: string) => void;
  
  // Validation
  validateApiKey: (modelId: string, apiKey: string) => Promise<boolean>;
  
  // Settings
  showApiKeyModal: boolean;
  setShowApiKeyModal: (show: boolean) => void;
}

const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'openai-gpt4',
    name: 'GPT-4',
    provider: 'OpenAI',
    icon: '🤖',
    description: 'Most capable OpenAI model, great for complex tasks',
    defaultEndpoint: 'https://api.openai.com/v1/chat/completions',
    supportsStreaming: true,
    maxTokens: 128000,
    pricing: { input: 0.01, output: 0.03 }
  },
  {
    id: 'openai-gpt35',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI', 
    icon: '⚡',
    description: 'Fast and efficient, good for most tasks',
    defaultEndpoint: 'https://api.openai.com/v1/chat/completions',
    supportsStreaming: true,
    maxTokens: 16384,
    pricing: { input: 0.001, output: 0.002 }
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    icon: '🧠',
    description: 'Balanced performance and speed',
    defaultEndpoint: 'https://api.anthropic.com/v1/messages',
    supportsStreaming: true,
    maxTokens: 200000,
    pricing: { input: 0.003, output: 0.015 }
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    icon: '🌸',
    description: 'Fastest Claude model, great for quick tasks',
    defaultEndpoint: 'https://api.anthropic.com/v1/messages',
    supportsStreaming: true,
    maxTokens: 200000,
    pricing: { input: 0.00025, output: 0.00125 }
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    icon: '🔍',
    description: 'Google\'s most capable model',
    defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    supportsStreaming: true,
    maxTokens: 32768,
    pricing: { input: 0.0005, output: 0.0015 }
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    icon: '🌪️',
    description: 'High-performance model from Mistral AI',
    defaultEndpoint: 'https://api.mistral.ai/v1/chat/completions',
    supportsStreaming: true,
    maxTokens: 32768,
    pricing: { input: 0.007, output: 0.024 }
  },
  {
    id: 'cohere-command',
    name: 'Cohere Command',
    provider: 'Cohere',
    icon: '🎯',
    description: 'Reliable and consistent model',
    defaultEndpoint: 'https://api.cohere.ai/v1/chat',
    supportsStreaming: true,
    maxTokens: 4096,
    pricing: { input: 0.0015, output: 0.002 }
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek',
    icon: '🔬',
    description: 'Advanced reasoning capabilities',
    defaultEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    supportsStreaming: true,
    maxTokens: 32768,
    pricing: { input: 0.0007, output: 0.0014 }
  },
  {
    id: 'ollama-llama2',
    name: 'Ollama Llama2',
    provider: 'Ollama',
    icon: '🦙',
    description: 'Local model for privacy',
    defaultEndpoint: 'http://localhost:11434/api/generate',
    supportsStreaming: true,
    maxTokens: 4096,
    pricing: { input: 0, output: 0 }
  }
];

// Export the models array
export { AVAILABLE_MODELS };

const DEFAULT_CONFIG: ModelConfig = {
  apiKey: '',
  endpoint: '',
  maxTokens: 4096,
  temperature: 0.7,
  topP: 0.9,
  enabled: false
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentModel, setCurrentModel] = useState<string>('openai-gpt35');
  const [modelConfigs, setModelConfigs] = useState<Record<string, ModelConfig>>({});
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);

  // Load saved configurations from localStorage
  useEffect(() => {
    const savedConfigs = localStorage.getItem('prompter-model-configs');
    const savedCurrentModel = localStorage.getItem('prompter-current-model');
    
    if (savedConfigs) {
      try {
        setModelConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        // Error loading configurations, using defaults
      }
    }
    
    if (savedCurrentModel) {
      setCurrentModel(savedCurrentModel);
    }
  }, []);

  // Save configurations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('prompter-model-configs', JSON.stringify(modelConfigs));
  }, [modelConfigs]);

  useEffect(() => {
    localStorage.setItem('prompter-current-model', currentModel);
  }, [currentModel]);

  const updateModelConfig = (modelId: string, config: Partial<ModelConfig>) => {
    setModelConfigs(prev => ({
      ...prev,
      [modelId]: {
        ...DEFAULT_CONFIG,
        ...prev[modelId],
        ...config
      }
    }));
  };

  const setApiKey = (modelId: string, apiKey: string) => {
    updateModelConfig(modelId, { apiKey, enabled: !!apiKey });
  };

  const getApiKey = (modelId: string): string | null => {
    return modelConfigs[modelId]?.apiKey || null;
  };

  const removeApiKey = (modelId: string) => {
    updateModelConfig(modelId, { apiKey: '', enabled: false });
  };

  const validateApiKey = async (modelId: string, apiKey: string): Promise<boolean> => {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (!model) {
      notificationManager.addToast({
        type: 'error',
        title: '❌ Model Not Found',
        message: 'Selected model not found',
        duration: 5000
      });
      return false;
    }

    try {
      // Check if API key is empty
      if (!apiKey || apiKey.trim().length === 0) {
        notificationManager.addToast({
          type: 'warning',
          title: `⚠️ ${model.provider} API Key Required`,
          message: `Please enter your ${model.provider} API key for ${model.name}`,
          duration: 5000
        });
        return false;
      }

      // Check minimum length
      if (apiKey.length < 10) {
        notificationManager.addToast({
          type: 'error',
          title: `❌ Invalid ${model.provider} API Key`,
          message: `${model.provider} API key is too short. Please check your key`,
          duration: 5000
        });
        return false;
      }

      // Check for placeholder values
      if (apiKey.includes('your-api-key') || 
          apiKey.includes('sk-your-api-key-here') ||
          apiKey.includes('placeholder')) {
        notificationManager.addToast({
          type: 'error',
          title: `❌ Placeholder ${model.provider} API Key`,
          message: `Please replace the placeholder with your actual ${model.provider} API key`,
          duration: 5000
        });
        return false;
      }

      // Provider-specific validation
      let isValid = false;
      let errorMessage = '';

      switch (model.provider) {
        case 'OpenAI':
          if (!apiKey.startsWith('sk-')) {
            errorMessage = `${model.name} API key must start with "sk-"`;
          } else if (apiKey.length < 20) {
            errorMessage = `${model.name} API key is too short`;
          } else {
            isValid = true;
          }
          break;

        case 'Anthropic':
          if (!apiKey.startsWith('sk-ant-')) {
            errorMessage = `${model.name} API key must start with "sk-ant-"`;
          } else if (apiKey.length < 20) {
            errorMessage = `${model.name} API key is too short`;
          } else {
            isValid = true;
          }
          break;

        case 'Google':
          if (apiKey.length < 20) {
            errorMessage = `${model.name} API key is too short`;
          } else {
            isValid = true;
          }
          break;

        case 'Mistral AI':
          if (apiKey.length < 20) {
            errorMessage = `${model.name} API key is too short`;
          } else {
            isValid = true;
          }
          break;

        case 'Cohere':
          if (apiKey.length < 20) {
            errorMessage = `${model.name} API key is too short`;
          } else {
            isValid = true;
          }
          break;

        case 'DeepSeek':
          if (!apiKey.startsWith('sk-')) {
            errorMessage = `${model.name} API key must start with "sk-"`;
          } else if (apiKey.length < 20) {
            errorMessage = `${model.name} API key is too short`;
          } else {
            isValid = true;
          }
          break;

        case 'Ollama':
          isValid = true; // Local doesn't need API key validation
          break;

        default:
          if (apiKey.length < 10) {
            errorMessage = 'API key is too short';
          } else {
            isValid = true;
          }
      }

      // Show error message if validation failed
      if (!isValid && errorMessage) {
        notificationManager.addToast({
          type: 'error',
          title: `❌ Invalid ${model.provider} API Key`,
          message: errorMessage,
          duration: 6000
        });
        return false;
      }

      // Show success message if validation passed
      if (isValid) {
        notificationManager.addToast({
          type: 'success',
          title: `✅ ${model.provider} API Key Valid`,
          message: 'API key format is correct',
          duration: 3000
        });
      }

      return isValid;

    } catch (error) {
      console.error('API key validation error:', error);
      notificationManager.addToast({
        type: 'error',
        title: '❌ Validation Error',
        message: 'Error validating API key. Please try again.',
        duration: 5000
      });
      return false;
    }
  };

  const value: ApiKeyContextType = {
    availableModels: AVAILABLE_MODELS,
    currentModel,
    setCurrentModel,
    modelConfigs,
    updateModelConfig,
    setApiKey,
    getApiKey,
    removeApiKey,
    validateApiKey,
    showApiKeyModal,
    setShowApiKeyModal
  };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}; 