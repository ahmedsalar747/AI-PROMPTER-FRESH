import React, { useState } from 'react';
import { enhancePrompt } from '../services/aiService';
import { notificationManager } from '../utils/notifications';

interface ApiTestButtonProps {
  userPrompt: string;
  onResult: (result: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  className?: string;
  forceEnglishOutput?: boolean;
}

const ApiTestButton: React.FC<ApiTestButtonProps> = ({
  userPrompt,
  onResult,
  onError,
  disabled = false,
  className = '',
  forceEnglishOutput = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = async () => {
    if (!userPrompt.trim()) {
      notificationManager.addToast({
        type: 'warning',
        title: '⚠️ Prompt Required',
        message: 'Please enter a prompt to test',
        duration: 3000
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get current model and API key
      const currentModel = localStorage.getItem('prompter-current-model') || 'openai-gpt35';
      const configs = localStorage.getItem('prompter-model-configs');
      
      let apiKey = '';
      if (configs) {
        try {
          const parsedConfigs = JSON.parse(configs);
          apiKey = parsedConfigs[currentModel]?.apiKey || '';
        } catch {
          // Ignore parsing errors
        }
      }

      if (!apiKey) {
        throw new Error('API key not found. Please set your API key in Settings.');
      }

      const detectInputLang = (text: string): string => {
        try {
          if (/\p{Script=Arabic}/u.test(text)) return 'fa';
          if (/\p{Script=Latin}/u.test(text)) return 'en';
          return navigator.language?.slice(0,2) || 'en';
        } catch {
          return 'en';
        }
      };

      const result = await enhancePrompt({
        userPrompt,
        apiKey,
        modelId: currentModel,
        language: forceEnglishOutput ? 'en' : detectInputLang(userPrompt)
      });

      onResult(result);
      notificationManager.addToast({
        type: 'success',
        title: '✅ API Call Successful',
        message: 'Your personal API key worked perfectly!',
        duration: 3000
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Error making API call';
      onError(errorMessage);
      notificationManager.addToast({
        type: 'error',
        title: '❌ API Call Failed',
        message: errorMessage,
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`api-test-button ${className}`}>
      <button
        className={`test-button ${isLoading ? 'loading' : ''}`}
        onClick={handleApiCall}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <span className="loading-spinner">⏳</span>
        ) : (
          <>
            <span className="icon">🔑</span>
            <span className="text">Test Personal API Key</span>
          </>
        )}
      </button>
      
      <div className="api-info">
        <p>🔑 Using your personal API key</p>
        <small>No usage limits - you pay for your own API calls</small>
      </div>
    </div>
  );
};

export default ApiTestButton; 