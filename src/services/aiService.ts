import axios from 'axios';
import { AIModel, AVAILABLE_MODELS } from '../context/ApiKeyContext';
import { notificationManager } from '../utils/notifications';
import {
    PROMPT_ORACLE_SYSTEM_PROMPT,
    getComplexityGuidelines,
    getDomainSpecificSystemPrompt,
    getOutputFormatGuidelines
} from '../utils/systemPrompts';
import { estimateTokens, recordTokenUsage } from '../utils/tokenUsage';

// Main enhance prompt function - NO LIMITS
export const enhancePrompt = async (options: {
  userPrompt: string;
  apiKey: string;
  language?: string;
  modelId?: string;
  temperature?: number;
  domain?: string;
  complexity?: string;
  outputFormat?: string;
}): Promise<string> => {
  const {
    userPrompt,
    apiKey,
    language = 'fa',
    modelId,
    temperature = 0.7,
    domain = 'General',
    complexity = 'intermediate',
    outputFormat = 'paragraph'
  } = options;

  try {
    console.log('🔑 Personal API call - NO LIMITS');

    // Get model configuration
    let targetModel: AIModel | undefined;
    let modelConfig: any = null;
    
    if (modelId) {
      targetModel = AVAILABLE_MODELS.find(m => m.id === modelId);
      const configs = localStorage.getItem('prompter-model-configs');
      if (configs) {
        try {
          const parsedConfigs = JSON.parse(configs);
          modelConfig = parsedConfigs[modelId];
        } catch {
          // Ignore parsing errors
        }
      }
    } else {
      // Use current model configuration
      const currentModel = localStorage.getItem('prompter-current-model') || 'openai-gpt35';
      targetModel = AVAILABLE_MODELS.find(m => m.id === currentModel);
      const configs = localStorage.getItem('prompter-model-configs');
      if (configs) {
        try {
          const parsedConfigs = JSON.parse(configs);
          modelConfig = parsedConfigs[currentModel];
        } catch {
          // Ignore parsing errors
        }
      }
    }
    
    if (!targetModel) {
      throw new Error('No AI model selected. Please configure a model in Settings.');
    }

    // Validate API key
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error(`API key is required for ${targetModel.provider}. Please set it in Settings.`);
    }

    // Prepare strict language instruction
    const languageInstruction = language === 'fa'
      ? 'Respond only in Persian (Farsi). Do not include any translations or bilingual content.'
      : language === 'en'
      ? 'Respond only in English. Do not include any translations or bilingual content.'
      : `Respond only in ${language}. Do not include any translations or bilingual content.`;

    const finalPrompt = `${userPrompt}\n\n${languageInstruction}`;

    // Select appropriate system prompt based on domain
    let systemPrompt = PROMPT_ORACLE_SYSTEM_PROMPT;
    
    if (domain && domain !== 'General') {
      // Use domain-specific system prompt for professional domains
      systemPrompt = getDomainSpecificSystemPrompt(domain, complexity, outputFormat);
      
      // Add complexity and format guidelines
      const complexityGuidelines = getComplexityGuidelines(complexity);
      const formatGuidelines = getOutputFormatGuidelines(outputFormat);
      
      systemPrompt = `${systemPrompt}\n\n${complexityGuidelines}\n\n${formatGuidelines}`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: finalPrompt }
    ];

    // Use model config settings if available
    const effectiveTemperature = modelConfig?.temperature || temperature;
    const effectiveMaxTokens = modelConfig?.maxTokens || 4096;

    // Direct API call without any limits or usage tracking
    console.log('🔑 Direct personal API call - NO LIMITS APPLIED');
    
    return await callAIModel(targetModel, apiKey, messages, effectiveTemperature, effectiveMaxTokens);

  } catch (err: any) {
    console.error('🔑 Personal API call error:', err);
    throw err;
  }
};

// Call AI model based on provider
const callAIModel = async (
  modelInfo: AIModel,
  apiKey: string,
  messages: any[],
  temperature: number,
  maxTokens?: number
): Promise<string> => {
  try {
    switch (modelInfo.provider) {
      case 'OpenAI':
        return await callOpenAI(modelInfo, apiKey, messages, temperature, maxTokens);
      
      case 'Anthropic':
        return await callAnthropic(modelInfo, apiKey, messages, temperature, maxTokens);
      
      case 'Google':
        return await callGemini(modelInfo, apiKey, messages, temperature, maxTokens);
      
      case 'Mistral AI':
        return await callMistral(modelInfo, apiKey, messages, temperature, maxTokens);
      
      case 'Cohere':
        return await callCohere(modelInfo, apiKey, messages, temperature, maxTokens);
      
      case 'Ollama':
        return await callOllama(modelInfo, messages, temperature, maxTokens);
      
      case 'DeepSeek':
        return await callDeepSeek(modelInfo, apiKey, messages, temperature, maxTokens);
      
      default:
        throw new Error(`Unsupported AI provider: ${modelInfo.provider}`);
    }
  } catch (error: any) {
    // Enhanced error handling
    let errorMessage = error.message || `Error calling ${modelInfo.provider} API`;
    
    if (error.response?.status === 401) {
      errorMessage = 'Invalid API key';
      notificationManager.showInvalidApiKey(modelInfo.provider);
    } else if (error.response?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please wait a moment';
      notificationManager.addToast({
        type: 'warning',
        title: `⏳ Rate Limit - ${modelInfo.provider}`,
        message: errorMessage,
        duration: 5000
      });
    } else if (error.response?.status >= 500) {
      errorMessage = 'Server error. Please try again later';
      notificationManager.addToast({
        type: 'error',
        title: `🚫 Server Error - ${modelInfo.provider}`,
        message: errorMessage,
        duration: 6000
      });
    } else if (error.code === 'ECONNABORTED' || error.code === 'ENETUNREACH') {
      errorMessage = 'Internet connection problem';
      notificationManager.showConnectionError(modelInfo.provider);
    } else {
      notificationManager.showApiKeyError(modelInfo.provider, errorMessage);
    }
    
    throw new Error(errorMessage);
  }
};

// OpenAI API call
const callOpenAI = async (
  model: AIModel,
  apiKey: string,
  messages: any[],
  temperature: number,
  maxTokens?: number
): Promise<string> => {
  const modelName = model.id === 'openai-gpt4' ? 'gpt-4' : 'gpt-3.5-turbo';
  
  const response = await axios.post(
    model.defaultEndpoint,
    {
      model: modelName,
      messages,
      temperature,
      max_tokens: maxTokens || 4096
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  const content: string = response.data.choices[0].message.content;
  const usage = response.data.usage;
  const promptTokens = usage?.prompt_tokens ?? estimateTokens(messages.map((m:any)=>m.content).join('\n'));
  const completionTokens = usage?.completion_tokens ?? estimateTokens(content);
  const totalTokens = usage?.total_tokens ?? (promptTokens + completionTokens);
  recordTokenUsage({
    provider: model.provider,
    modelId: model.id,
    promptTokens,
    completionTokens,
    totalTokens,
    timestamp: Date.now(),
    approximate: !usage
  });
  return content;
};

// Anthropic API call
const callAnthropic = async (
  model: AIModel,
  apiKey: string,
  messages: any[],
  temperature: number,
  maxTokens?: number
): Promise<string> => {
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');
  
  const modelName = model.id === 'claude-3-sonnet' ? 'claude-3-sonnet-20240229' : 'claude-3-haiku-20240307';
  
  const response = await axios.post(
    model.defaultEndpoint,
    {
      model: modelName,
      system: systemMessage?.content || '',
      messages: userMessages,
      temperature,
      max_tokens: maxTokens || 4096
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    }
  );
  const content: string = response.data.content?.[0]?.text || '';
  const promptTokens = estimateTokens((systemMessage?.content || '') + '\n' + userMessages.map((m:any)=>m.content).join('\n'));
  const completionTokens = estimateTokens(content);
  const totalTokens = promptTokens + completionTokens;
  recordTokenUsage({ provider: model.provider, modelId: model.id, promptTokens, completionTokens, totalTokens, timestamp: Date.now(), approximate: true });
  return content;
};

// Google Gemini API call
const callGemini = async (
  model: AIModel,
  apiKey: string,
  messages: any[],
  temperature: number,
  maxTokens?: number
): Promise<string> => {
  const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
  const userPrompt = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n');
  
  const response = await axios.post(
    `${model.defaultEndpoint}?key=${apiKey}`,
    {
      contents: [{
        parts: [{
          text: systemPrompt + '\n\n' + userPrompt
        }]
      }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens || 4096
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  const content: string = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const promptTokens = estimateTokens(systemPrompt + '\n\n' + userPrompt);
  const completionTokens = estimateTokens(content);
  const totalTokens = promptTokens + completionTokens;
  recordTokenUsage({ provider: model.provider, modelId: model.id, promptTokens, completionTokens, totalTokens, timestamp: Date.now(), approximate: true });
  return content;
};

// Mistral AI API call
const callMistral = async (
  model: AIModel,
  apiKey: string,
  messages: any[],
  temperature: number,
  maxTokens?: number
): Promise<string> => {
  const response = await axios.post(
    model.defaultEndpoint,
    {
      model: model.id,
      messages,
      temperature,
      max_tokens: maxTokens || 4096
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  const content: string = response.data.choices?.[0]?.message?.content || '';
  const promptTokens = estimateTokens(messages.map((m:any)=>m.content).join('\n'));
  const completionTokens = estimateTokens(content);
  const totalTokens = promptTokens + completionTokens;
  recordTokenUsage({ provider: model.provider, modelId: model.id, promptTokens, completionTokens, totalTokens, timestamp: Date.now(), approximate: true });
  return content;
};

// Cohere API call
const callCohere = async (
  model: AIModel,
  apiKey: string,
  messages: any[],
  temperature: number,
  maxTokens?: number
): Promise<string> => {
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  
  const response = await axios.post(
    model.defaultEndpoint,
    {
      model: model.id,
      prompt,
      temperature,
      max_tokens: maxTokens || 4096
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  const content: string = response.data.generations?.[0]?.text || '';
  const promptTokens = estimateTokens(prompt);
  const completionTokens = estimateTokens(content);
  const totalTokens = promptTokens + completionTokens;
  recordTokenUsage({ provider: model.provider, modelId: model.id, promptTokens, completionTokens, totalTokens, timestamp: Date.now(), approximate: true });
  return content;
};

// Ollama API call (local)
const callOllama = async (
  model: AIModel,
  messages: any[],
  temperature: number,
  maxTokens?: number
): Promise<string> => {
  const response = await axios.post(
    model.defaultEndpoint,
    {
      model: model.id,
      messages,
      temperature,
      num_predict: maxTokens || 4096
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  const content: string = response.data.message?.content || response.data.response || '';
  const promptTokens = estimateTokens(messages.map((m:any)=>m.content).join('\n'));
  const completionTokens = estimateTokens(content);
  const totalTokens = promptTokens + completionTokens;
  recordTokenUsage({ provider: model.provider, modelId: model.id, promptTokens, completionTokens, totalTokens, timestamp: Date.now(), approximate: true });
  return content;
};

// DeepSeek API call
const callDeepSeek = async (
  model: AIModel,
  apiKey: string,
  messages: any[],
  temperature: number,
  maxTokens?: number
): Promise<string> => {
  const response = await axios.post(
    model.defaultEndpoint,
    {
      model: model.id,
      messages,
      temperature,
      max_tokens: maxTokens || 4096
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  const content: string = response.data.choices?.[0]?.message?.content || '';
  const usage = response.data.usage;
  const promptTokens = usage?.prompt_tokens ?? estimateTokens(messages.map((m:any)=>m.content).join('\n'));
  const completionTokens = usage?.completion_tokens ?? estimateTokens(content);
  const totalTokens = usage?.total_tokens ?? (promptTokens + completionTokens);
  recordTokenUsage({ provider: model.provider, modelId: model.id, promptTokens, completionTokens, totalTokens, timestamp: Date.now(), approximate: !usage });
  return content;
};

// Compatibility functions
export const getApiKey = (): string | null => {
  const configs = localStorage.getItem('prompter-model-configs');
  const currentModel = localStorage.getItem('prompter-current-model') || 'openai-gpt35';
  
  if (configs) {
    try {
      const parsedConfigs = JSON.parse(configs);
      return parsedConfigs[currentModel]?.apiKey || null;
    } catch {
      // Ignore parsing errors
    }
  }
  
  // Fallback to legacy OpenAI key
  return localStorage.getItem('openai_api_key') || null;
};

export const saveApiKey = (apiKey: string): void => {
  // Save to both new and legacy systems for compatibility
  localStorage.setItem('openai_api_key', apiKey);
  
  // Also save to current model in multi-model system
  const currentModel = localStorage.getItem('prompter-current-model') || 'openai-gpt35';
  const configs = localStorage.getItem('prompter-model-configs');
  
  try {
    const parsedConfigs = configs ? JSON.parse(configs) : {};
    parsedConfigs[currentModel] = {
      ...parsedConfigs[currentModel],
      apiKey: apiKey,
      enabled: true
    };
    localStorage.setItem('prompter-model-configs', JSON.stringify(parsedConfigs));
  } catch {
    // If error, just save to legacy
  }
};

export const removeApiKey = (): void => {
  // Remove from both systems
  localStorage.removeItem('openai_api_key');
  
  const currentModel = localStorage.getItem('prompter-current-model') || 'openai-gpt35';
  const configs = localStorage.getItem('prompter-model-configs');
  
  try {
    const parsedConfigs = configs ? JSON.parse(configs) : {};
    if (parsedConfigs[currentModel]) {
      parsedConfigs[currentModel].apiKey = '';
      parsedConfigs[currentModel].enabled = false;
      localStorage.setItem('prompter-model-configs', JSON.stringify(parsedConfigs));
    }
  } catch {
    // Ignore errors
  }
}; 