import axios from 'axios';
import type { AIModel } from '../context/ApiKeyContext';
import { isPersonalApiKey } from '../utils/apiKeyDetector';

// Prompt Architect System Prompt - Optimized Version
const PROMPT_ORACLE_SYSTEM_PROMPT = `You are a Master Prompt Engineer with specialized training in AI instruction architecture. You transform user objectives into precisely-crafted prompts that maximize model performance through clarity, structure, and strategic design.

You are a skilled prompt architect specializing in creating high-quality, effective prompts. Your task is to enhance user prompts with strategic improvements while maintaining their original intent and voice.

**Core Process:**
1. **Analyze**: Understand the user's goal and target audience
2. **Enhance**: Add structure, clarity, and strategic elements
3. **Optimize**: Ensure the prompt is concise yet comprehensive
4. **Deliver**: Provide a polished, actionable prompt

**Enhancement Guidelines:**
- Add clear context and role definition when missing
- Include specific examples or formatting requirements
- Integrate relevant constraints or quality criteria  
- Maintain the user's original tone and purpose
- Focus on actionable, measurable outcomes
- **Use imperative/command form** (e.g., "Write..." not "You should write...")

**Quality Standards:**
- Clear and unambiguous instructions
- Appropriate level of detail for the task
- Considers edge cases and potential misunderstandings
- Balances creativity with precision
- Optimized for intended AI model capabilities

**Output Format:**
Provide the enhanced prompt directly in command form, followed by a brief explanation of key improvements made.

Remember: Great prompts are clear, purposeful, and get results. Focus on practical effectiveness over complexity.`;

// Available Models Definition (sync with ApiKeyContext)
const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'openai-gpt4',
    name: 'GPT-4',
    provider: 'OpenAI',
    icon: '🤖',
    description: 'Most capable OpenAI model',
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
    description: 'Fast and efficient',
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
    description: 'Fastest Claude model',
    defaultEndpoint: 'https://api.anthropic.com/v1/messages',
    supportsStreaming: true,
    maxTokens: 200000,
    pricing: { input: 0.00025, output: 0.00125 }
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    icon: '🔷',
    description: 'Google\'s advanced model',
    defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    supportsStreaming: true,
    maxTokens: 32768,
    pricing: { input: 0.0005, output: 0.0015 }
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    icon: '💎',
    description: 'High-performance European model',
    defaultEndpoint: 'https://api.mistral.ai/v1/chat/completions',
    supportsStreaming: true,
    maxTokens: 32768,
    pricing: { input: 0.008, output: 0.024 }
  },
  {
    id: 'cohere-command',
    name: 'Command',
    provider: 'Cohere',
    icon: '⚙️',
    description: 'Enterprise-focused AI',
    defaultEndpoint: 'https://api.cohere.ai/v1/generate',
    supportsStreaming: false,
    maxTokens: 4096,
    pricing: { input: 0.0015, output: 0.0015 }
  },
  {
    id: 'local-ollama',
    name: 'Local Ollama',
    provider: 'Ollama',
    icon: '🏠',
    description: 'Run models locally',
    defaultEndpoint: 'http://localhost:11434/api/generate',
    supportsStreaming: true,
    maxTokens: 8192,
    pricing: { input: 0, output: 0 }
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    icon: '🔍',
    description: 'Advanced reasoning model with long context',
    defaultEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    supportsStreaming: true,
    maxTokens: 131072,
    pricing: { input: 0.0014, output: 0.028 }
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    icon: '🚀',
    description: 'Latest DeepSeek model with enhanced capabilities',
    defaultEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    supportsStreaming: true,
    maxTokens: 65536,
    pricing: { input: 0.00027, output: 0.0011 }
  }
];

// Enhanced interface که سازگار با قبلی است
export interface EnhancePromptOptions {
  apiKey: string;
  userPrompt: string;
  language?: string;
  model?: string;
  temperature?: number;
}

// Helper function to get current model config
const getCurrentModelConfig = () => {
  const currentModel = localStorage.getItem('prompter-current-model') || 'openai-gpt35';
  const configs = localStorage.getItem('prompter-model-configs');
  
  let modelConfig = null;
  if (configs) {
    try {
      const parsedConfigs = JSON.parse(configs);
      modelConfig = parsedConfigs[currentModel];
    } catch {
      // Ignore parsing errors
    }
  }
  
  const targetModel = AVAILABLE_MODELS.find(m => m.id === currentModel);
  return { targetModel, modelConfig, currentModel };
};

// Multi-model API call handlers
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
  
  return response.data.choices[0].message.content;
};

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
  
  return response.data.content[0].text;
};

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
  
  return response.data.candidates[0].content.parts[0].text;
};

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
      model: 'mistral-large-latest',
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
  
  return response.data.choices[0].message.content;
};

const callCohere = async (
  model: AIModel,
  apiKey: string,
  messages: any[],
  temperature: number,
  maxTokens?: number
): Promise<string> => {
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessage = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n');
  
  const response = await axios.post(
    model.defaultEndpoint,
    {
      model: 'command',
      prompt: (systemMessage?.content || '') + '\n\n' + userMessage,
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
  
  return response.data.generations[0].text;
};

const callOllama = async (
  model: AIModel,
  messages: any[],
  temperature: number,
  maxTokens?: number
): Promise<string> => {
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessage = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n');
  
  const response = await axios.post(
    model.defaultEndpoint,
    {
      model: 'llama2',
      prompt: (systemMessage?.content || '') + '\n\n' + userMessage,
      options: {
        temperature,
        num_predict: maxTokens || 4096
      },
      stream: false
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data.response;
};

const callDeepSeek = async (
  model: AIModel,
  apiKey: string,
  messages: any[],
  temperature: number,
  maxTokens?: number
): Promise<string> => {
  const modelName = model.id === 'deepseek-r1' ? 'deepseek-reasoner' : 'deepseek-chat';
  
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
  
  return response.data.choices[0].message.content;
};

// Main multi-model dispatcher
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
    throw new Error(error.message || `Error calling ${modelInfo.provider} API`);
  }
};

// Main enhance prompt function - حفظ interface قبلی
export const enhancePrompt = async (options: EnhancePromptOptions): Promise<string> => {
  const {
    apiKey,
    userPrompt,
    language = 'fa',
    model: _model = 'gpt-3.5-turbo',
    temperature = 0.7
  } = options;

  try {
    // Get current model configuration
    const { targetModel, modelConfig } = getCurrentModelConfig();
    
    if (!targetModel) {
      throw new Error('No AI model selected. Please configure a model in Settings.');
    }

    // Determine which API key to use
    let effectiveApiKey = apiKey;
    
    // If no API key provided, try to get from model config
    if (!effectiveApiKey && modelConfig?.apiKey) {
      effectiveApiKey = modelConfig.apiKey;
    }
    
    // Ollama doesn't need API key
    if (targetModel.provider !== 'Ollama' && !effectiveApiKey) {
      throw new Error(`API key is required for ${targetModel.provider}. Please set it in Settings.`);
    }

    // 🔍 NEW: Use utility function to detect personal API key
    const isPersonal = isPersonalApiKey(effectiveApiKey);

    // Prepare language instruction
    const languageInstruction = language === 'fa' 
      ? 'Please provide the response in Persian/Farsi.'
      : language === 'en' 
      ? 'Please provide the response in English.'
      : `Please provide the response in ${language}.`;

    const finalPrompt = `${userPrompt}\n\n${languageInstruction}`;

    const messages = [
      { role: 'system', content: PROMPT_ORACLE_SYSTEM_PROMPT },
      { role: 'user', content: finalPrompt }
    ];

    // Use model config settings if available
    const effectiveTemperature = modelConfig?.temperature || temperature;
    const effectiveMaxTokens = modelConfig?.maxTokens || 4096;

    // Only allow personal API key usage
    if (!isPersonal) {
      throw new Error('API key required. Please enter your personal API key in Settings.');
    }

    // Direct API call without any usage tracking
    return await callAIModel(targetModel, effectiveApiKey, messages, effectiveTemperature, effectiveMaxTokens);

  } catch (err: any) {
    throw err.response?.data?.error?.message || err.message || 'Error connecting to AI service';
  }
};

// Compatibility functions - حفظ interface قبلی
export const getApiKey = (): string | null => {
  // Get API key for current model
  const { modelConfig } = getCurrentModelConfig();
  
  if (modelConfig?.apiKey) {
    return modelConfig.apiKey;
  }
  
  // Fallback to legacy OpenAI key
  return localStorage.getItem('openai_api_key') || null;
};

export const saveApiKey = (apiKey: string): void => {
  // Save to both new and legacy systems for compatibility
  localStorage.setItem('openai_api_key', apiKey);
  
  // Also save to current model in multi-model system
  const { currentModel } = getCurrentModelConfig();
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
  
  const { currentModel } = getCurrentModelConfig();
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