/**
 * 🔍 API Key Detection Utility
 * تشخیص API Key شخصی در مقابل Free API Key
 */

/**
 * Check if an API key is a personal key (not the free API key)
 */
export const isPersonalApiKey = (apiKey: string | null | undefined): boolean => {
  if (!apiKey || apiKey.length < 20) {
    return false;
  }

  // Free API key path removed: only treat sufficiently long non-placeholder keys as personal
  const isDifferentFromFree = true;
  
  // Check if it's not a placeholder
  const isNotPlaceholder = apiKey !== 'sk-your-api-key-here' && 
                          apiKey !== 'your-api-key-here' &&
                          !apiKey.includes('placeholder');
  
  // Check if it has valid format (starts with sk- for OpenAI, sk-ant- for Anthropic, etc.)
  const hasValidFormat = apiKey.startsWith('sk-') || 
                        apiKey.startsWith('sk-ant-') ||
                        apiKey.length > 20; // For other providers
  
  return isDifferentFromFree && isNotPlaceholder && hasValidFormat;
};

/**
 * Get the current personal API key from localStorage
 */
export const getCurrentPersonalApiKey = (): string | null => {
  try {
    const configs = localStorage.getItem('prompter-model-configs');
    
    if (!configs) {
      return null;
    }
    
    const parsedConfigs = JSON.parse(configs);
    
    // Get current model, default to first available model if not set
    let currentModel = localStorage.getItem('prompter-current-model');
    
    if (!currentModel || !parsedConfigs[currentModel]) {
      // If no current model or current model doesn't exist in configs, use first available
      const availableModels = Object.keys(parsedConfigs);
      if (availableModels.length > 0) {
        currentModel = availableModels[0];
        // Save the fallback model as current
        localStorage.setItem('prompter-current-model', currentModel);
      } else {
        return null;
      }
    }
    
    const modelConfig = parsedConfigs[currentModel];
    
    if (!modelConfig?.apiKey) {
      console.log('❌ DEBUG: No API key found in model config');
      return null;
    }
    
    // Check if this is a personal API key
    const isPersonal = isPersonalApiKey(modelConfig.apiKey);
    console.log('🔍 DEBUG: Is personal API key:', isPersonal);
    
    if (isPersonal) {
      console.log('✅ DEBUG: Found personal API key');
      return modelConfig.apiKey;
    }
    
    console.log('❌ DEBUG: API key is not personal or invalid');
    return null;
  } catch (error) {
    console.error('❌ DEBUG: Error getting personal API key:', error);
    return null;
  }
};

/**
 * Check if user has a personal API key configured
 */
export const hasPersonalApiKey = (): boolean => {
  return getCurrentPersonalApiKey() !== null;
};

/**
 * Get API key type for display purposes
 */
export const getApiKeyType = (apiKey: string | null | undefined): 'personal' | 'free' | 'none' => {
  if (!apiKey) return 'none';
  
  if (isPersonalApiKey(apiKey)) {
    return 'personal';
  }
  
  return 'free';
};

/**
 * Get appropriate message for API key type
 */
export const getApiKeyMessage = (apiKeyType: 'personal' | 'free' | 'none'): {
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
} => {
  switch (apiKeyType) {
    case 'personal':
      return {
        title: '🔑 Personal API Key',
        message: 'Unlimited usage with no restrictions - Full access to all features',
        type: 'success'
      };
    case 'free':
      return {
        title: '🎁 Free API',
        message: 'Limited usage: 200 tokens, 3 requests per month',
        type: 'info'
      };
    case 'none':
    default:
      return {
        title: '⚠️ No API Key',
        message: 'Please configure your API key for full functionality',
        type: 'warning'
      };
  }
};

 