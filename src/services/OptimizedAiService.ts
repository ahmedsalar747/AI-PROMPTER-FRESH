import { notificationManager } from '../utils/notifications';
import { OptimizationOptions, TokenOptimizationResult, TokenOptimizer } from '../utils/tokenOptimizer';
import { enhancePrompt } from './aiService';

export interface OptimizedAiServiceConfig {
  enableOptimization: boolean;
  optimizationLevel: 'light' | 'medium' | 'aggressive';
  customOptions?: OptimizationOptions;
  showOptimizationStats: boolean;
  maxTokensPerRequest?: number;
  costOptimization: boolean;
}

export interface OptimizedAiResponse {
  result: string;
  originalTokens: number;
  optimizedTokens: number;
  tokensSaved: number;
  costSaved: number;
  optimizationMethods: string[];
  suggestions: string[];
  performance: {
    requestTime: number;
    tokenEfficiency: number;
    qualityScore: number;
  };
}

export class OptimizedAiService {
  private static readonly TOKEN_COSTS = {
    'openai-gpt4': { input: 0.01, output: 0.03 },
    'openai-gpt35': { input: 0.001, output: 0.002 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-haiku': { input: 0.00025, output: 0.00125 },
    'gemini-pro': { input: 0.0005, output: 0.0015 },
    'deepseek-v3': { input: 0.00027, output: 0.0011 }
  };

  private static readonly DEFAULT_CONFIG: OptimizedAiServiceConfig = {
    enableOptimization: true,
    optimizationLevel: 'medium',
    showOptimizationStats: true,
    costOptimization: true
  };

  /**
   * 🚀 Enhanced AI call with automatic optimization
   */
  static async enhancePromptOptimized(
    userPrompt: string,
    apiKey: string,
    modelId: string,
    config: Partial<OptimizedAiServiceConfig> = {}
  ): Promise<OptimizedAiResponse> {
    const startTime = Date.now();
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    let optimizedPrompt = userPrompt;
    let optimizationResult: TokenOptimizationResult | null = null;
    
    try {
      // 1. Pre-optimization analysis
      const originalTokens = Math.ceil(userPrompt.length / 4);
      
      // 2. Apply optimization if enabled
      if (finalConfig.enableOptimization) {
        const options = finalConfig.customOptions || 
                       TokenOptimizer.getOptimizationPresets()[finalConfig.optimizationLevel];
        
        optimizationResult = TokenOptimizer.optimizeUserPrompt(userPrompt, options);
        optimizedPrompt = optimizationResult.optimizedPrompt;
        
        // Show optimization notification
        if (finalConfig.showOptimizationStats && optimizationResult.savedTokens > 0) {
          notificationManager.addToast({
            type: 'success',
            title: '🎯 بهینه‌سازی انجام شد',
            message: `${optimizationResult.savedTokens} توکن صرفه‌جویی (${optimizationResult.savingPercentage.toFixed(1)}%)`,
            duration: 4000
          });
        }
      }
      
      // 3. Make AI call with optimized prompt
      const aiResponse = await enhancePrompt({
        userPrompt: optimizedPrompt,
        apiKey,
        modelId,
        language: 'en'
      });
      
      // 4. Calculate performance metrics
      const endTime = Date.now();
      const requestTime = endTime - startTime;
      
      const optimizedTokens = optimizationResult?.optimizedTokens || originalTokens;
      const tokensSaved = optimizationResult?.savedTokens || 0;
      
      // 5. Calculate cost savings
      const modelCost = this.TOKEN_COSTS[modelId as keyof typeof this.TOKEN_COSTS];
      const costSaved = modelCost ? tokensSaved * modelCost.input : 0;
      
      // 6. Calculate quality and efficiency scores
      const tokenEfficiency = tokensSaved > 0 ? (tokensSaved / originalTokens) * 100 : 0;
      const qualityScore = this.calculateQualityScore(userPrompt, optimizedPrompt, aiResponse);
      
      return {
        result: aiResponse,
        originalTokens,
        optimizedTokens,
        tokensSaved,
        costSaved,
        optimizationMethods: optimizationResult?.optimizationMethods || [],
        suggestions: optimizationResult?.suggestions || [],
        performance: {
          requestTime,
          tokenEfficiency,
          qualityScore
        }
      };
      
    } catch (error: any) {
      // Error handling with optimization context
      const errorMessage = `AI request failed: ${error.message}`;
      
      notificationManager.addToast({
        type: 'error',
        title: '❌ خطا در درخواست AI',
        message: errorMessage,
        duration: 5000
      });
      
      throw new Error(errorMessage);
    }
  }

  /**
   * 📊 Batch optimization for multiple prompts
   */
  static async batchOptimize(
    prompts: string[],
    options: OptimizationOptions
  ): Promise<{
    results: TokenOptimizationResult[];
    totalTokensSaved: number;
    totalCostSaved: number;
    averageEfficiency: number;
  }> {
    const results: TokenOptimizationResult[] = [];
    let totalTokensSaved = 0;
    let totalOriginalTokens = 0;
    
    for (const prompt of prompts) {
      const result = TokenOptimizer.optimizeUserPrompt(prompt, options);
      results.push(result);
      totalTokensSaved += result.savedTokens;
      totalOriginalTokens += result.originalTokens;
    }
    
    const averageEfficiency = totalOriginalTokens > 0 
      ? (totalTokensSaved / totalOriginalTokens) * 100 
      : 0;
    
    // Estimate cost savings (using average model cost)
    const averageCost = 0.005; // متوسط هزینه per token
    const totalCostSaved = totalTokensSaved * averageCost;
    
    return {
      results,
      totalTokensSaved,
      totalCostSaved,
      averageEfficiency
    };
  }

  /**
   * 🎯 Smart system prompt optimization
   */
  static optimizeSystemPrompt(
    systemPrompt: string,
    targetReduction: number = 50 // درصد کاهش مطلوب
  ): {
    optimizedPrompt: string;
    reduction: number;
    level: 'light' | 'medium' | 'aggressive';
  } {
    const originalTokens = Math.ceil(systemPrompt.length / 4);
    const targetTokens = Math.ceil(originalTokens * (1 - targetReduction / 100));
    
    // Try different levels to reach target
    const levels: Array<'light' | 'medium' | 'aggressive'> = ['light', 'medium', 'aggressive'];
    
    for (const level of levels) {
      const optimized = TokenOptimizer.optimizeSystemPrompt(systemPrompt, level);
      const optimizedTokens = Math.ceil(optimized.length / 4);
      const reduction = ((originalTokens - optimizedTokens) / originalTokens) * 100;
      
      if (optimizedTokens <= targetTokens || level === 'aggressive') {
        return {
          optimizedPrompt: optimized,
          reduction,
          level
        };
      }
    }
    
    // Fallback
    return {
      optimizedPrompt: systemPrompt,
      reduction: 0,
      level: 'light'
    };
  }

  /**
   * 📈 Performance analytics for optimization
   */
  static analyzeOptimizationPerformance(
    results: OptimizedAiResponse[]
  ): {
    totalTokensSaved: number;
    totalCostSaved: number;
    averageEfficiency: number;
    averageQuality: number;
    recommendedSettings: {
      optimizationLevel: 'light' | 'medium' | 'aggressive';
      reasoning: string;
    };
  } {
    const totalTokensSaved = results.reduce((sum, r) => sum + r.tokensSaved, 0);
    const totalCostSaved = results.reduce((sum, r) => sum + r.costSaved, 0);
    const averageEfficiency = results.reduce((sum, r) => sum + r.performance.tokenEfficiency, 0) / results.length;
    const averageQuality = results.reduce((sum, r) => sum + r.performance.qualityScore, 0) / results.length;
    
    // Recommend optimization level based on performance
    let recommendedLevel: 'light' | 'medium' | 'aggressive' = 'medium';
    let reasoning = '';
    
    if (averageQuality > 85 && averageEfficiency > 30) {
      recommendedLevel = 'aggressive';
      reasoning = 'کیفیت عالی با صرفه‌جویی بالا - سطح قوی پیشنهاد می‌شود';
    } else if (averageQuality > 75) {
      recommendedLevel = 'medium';
      reasoning = 'تعادل مناسب بین کیفیت و صرفه‌جویی - سطح متوسط مناسب است';
    } else {
      recommendedLevel = 'light';
      reasoning = 'حفظ کیفیت در اولویت - سطح آرام پیشنهاد می‌شود';
    }
    
    return {
      totalTokensSaved,
      totalCostSaved,
      averageEfficiency,
      averageQuality,
      recommendedSettings: {
        optimizationLevel: recommendedLevel,
        reasoning
      }
    };
  }

  /**
   * 🎨 Calculate quality score
   */
  private static calculateQualityScore(
    originalPrompt: string,
    optimizedPrompt: string,
    aiResponse: string
  ): number {
    let score = 100;
    
    // Penalize for excessive reduction
    const reductionRatio = 1 - (optimizedPrompt.length / originalPrompt.length);
    if (reductionRatio > 0.8) {
      score -= 30; // بیش از 80% کاهش
    } else if (reductionRatio > 0.6) {
      score -= 15; // بیش از 60% کاهش
    }
    
    // Reward for maintaining key elements
    const keyWords = ['explain', 'create', 'analyze', 'provide', 'generate'];
    const maintainedKeywords = keyWords.filter(word => 
      originalPrompt.toLowerCase().includes(word) && 
      optimizedPrompt.toLowerCase().includes(word)
    );
    
    score += maintainedKeywords.length * 5;
    
    // Check response quality (basic heuristics)
    if (aiResponse.length < 50) {
      score -= 20; // پاسخ خیلی کوتاه
    }
    
    if (aiResponse.includes('error') || aiResponse.includes('sorry')) {
      score -= 15; // نشانه‌های مشکل
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * 💡 Get optimization suggestions based on usage patterns
   */
  static getPersonalizedSuggestions(
    userHistory: OptimizedAiResponse[]
  ): string[] {
    const suggestions: string[] = [];
    
    if (userHistory.length === 0) {
      return ['شروع استفاده از بهینه‌سازی برای صرفه‌جویی در هزینه‌ها'];
    }
    
    const averageEfficiency = userHistory.reduce((sum, r) => sum + r.performance.tokenEfficiency, 0) / userHistory.length;
    const averageQuality = userHistory.reduce((sum, r) => sum + r.performance.qualityScore, 0) / userHistory.length;
    
    if (averageEfficiency < 20) {
      suggestions.push('🔧 سطح بهینه‌سازی را افزایش دهید برای صرفه‌جویی بیشتر');
    }
    
    if (averageQuality < 70) {
      suggestions.push('⚠️ سطح بهینه‌سازی را کاهش دهید برای حفظ کیفیت');
    }
    
    if (averageEfficiency > 40 && averageQuality > 80) {
      suggestions.push('✨ عملکرد عالی! می‌توانید سطح aggressive را امتحان کنید');
    }
    
    const totalSaved = userHistory.reduce((sum, r) => sum + r.tokensSaved, 0);
    if (totalSaved > 1000) {
      suggestions.push(`💰 تاکنون ${totalSaved} توکن صرفه‌جویی کرده‌اید!`);
    }
    
    return suggestions;
  }

  /**
   * 🔄 Auto-adjustment based on performance
   */
  static getRecommendedConfig(
    currentConfig: OptimizedAiServiceConfig,
    recentPerformance: OptimizedAiResponse[]
  ): OptimizedAiServiceConfig {
    if (recentPerformance.length < 5) {
      return currentConfig; // Not enough data
    }
    
    const analysis = this.analyzeOptimizationPerformance(recentPerformance);
    
    return {
      ...currentConfig,
      optimizationLevel: analysis.recommendedSettings.optimizationLevel,
      enableOptimization: analysis.averageEfficiency > 10, // Keep enabled if saving tokens
      costOptimization: analysis.totalCostSaved > 0.01 // Enable if saving significant cost
    };
  }
}

export default OptimizedAiService; 