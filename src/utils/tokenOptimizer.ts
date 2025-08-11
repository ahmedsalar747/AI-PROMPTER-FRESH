export interface TokenOptimizationResult {
  originalTokens: number;
  optimizedTokens: number;
  savedTokens: number;
  savingPercentage: number;
  optimizedPrompt: string;
  suggestions: string[];
  optimizationMethods: string[];
}

export interface OptimizationOptions {
  enableAbbreviations: boolean;
  removeRedundancy: boolean;
  compressInstructions: boolean;
  useShortForms: boolean;
  removeExamples: boolean;
  limitExplanations: boolean;
  maxLength?: number;
  preserveQuality: boolean;
}

export class TokenOptimizer {
  
  /**
   * ✂️ کوتاه سازی prompt های سیستم
   */
  static optimizeSystemPrompt(systemPrompt: string, level: 'light' | 'medium' | 'aggressive' = 'medium'): string {
    let optimized = systemPrompt;
    
    switch (level) {
      case 'light':
        // حذف توضیحات اضافی
        optimized = optimized.replace(/\*\*[^*]+\*\*/g, '');
        optimized = optimized.replace(/\(.*?\)/g, '');
        break;
        
      case 'medium':
        // حذف بخش‌های غیرضروری
        optimized = optimized.replace(/\*\*STAGE \d+:.*?\*\*/g, '');
        optimized = optimized.replace(/\*\*\d+\.\d+\..*?\*\*/g, '');
        optimized = optimized.replace(/\*\*III\..*?\*\*/g, '');
        break;
        
      case 'aggressive':
        // فقط هسته اصلی prompt
        optimized = `You are a professional prompt engineer. Create optimized, effective prompts based on user input. 
        Output only the raw prompt text without explanations or formatting.`;
        break;
    }
    
    return optimized.trim();
  }
  
  /**
   * 🔄 بهینه‌سازی prompt های کاربر
   */
  static optimizeUserPrompt(userPrompt: string, options: OptimizationOptions): TokenOptimizationResult {
    const originalTokens = this.estimateTokens(userPrompt);
    let optimized = userPrompt;
    const appliedMethods: string[] = [];
    const suggestions: string[] = [];
    
    // 1. حذف کلمات اضافی
    if (options.removeRedundancy) {
      optimized = this.removeRedundantWords(optimized);
      appliedMethods.push('Redundancy removal');
    }
    
    // 2. استفاده از مخفف‌ها
    if (options.enableAbbreviations) {
      optimized = this.applyAbbreviations(optimized);
      appliedMethods.push('Abbreviations');
    }
    
    // 3. فشرده‌سازی دستورالعمل‌ها
    if (options.compressInstructions) {
      optimized = this.compressInstructions(optimized);
      appliedMethods.push('Instruction compression');
    }
    
    // 4. استفاده از فرم‌های کوتاه
    if (options.useShortForms) {
      optimized = this.useShortForms(optimized);
      appliedMethods.push('Short forms');
    }
    
    // 5. حذف مثال‌ها
    if (options.removeExamples) {
      optimized = this.removeExamples(optimized);
      appliedMethods.push('Example removal');
    }
    
    // 6. محدود کردن توضیحات
    if (options.limitExplanations) {
      optimized = this.limitExplanations(optimized);
      appliedMethods.push('Limited explanations');
    }
    
    // 7. محدودیت طول
    if (options.maxLength) {
      optimized = this.truncateToLength(optimized, options.maxLength);
      appliedMethods.push('Length truncation');
    }
    
    const optimizedTokens = this.estimateTokens(optimized);
    const savedTokens = originalTokens - optimizedTokens;
    const savingPercentage = (savedTokens / originalTokens) * 100;
    
    // پیشنهادات
    suggestions.push(...this.generateSuggestions(userPrompt, optimized));
    
    return {
      originalTokens,
      optimizedTokens,
      savedTokens,
      savingPercentage,
      optimizedPrompt: optimized,
      suggestions,
      optimizationMethods: appliedMethods
    };
  }
  
  /**
   * 📊 تخمین تعداد توکن
   */
  private static estimateTokens(text: string): number {
    // تخمین: 4 کاراکتر ≈ 1 توکن
    return Math.ceil(text.length / 4);
  }
  
  /**
   * 🔍 حذف کلمات تکراری
   */
  private static removeRedundantWords(text: string): string {
    const redundantPhrases = [
      'please make sure to',
      'it is important to',
      'you should definitely',
      'I would like you to',
      'could you please',
      'if you would',
      'in order to',
      'for the purpose of',
      'it would be great if',
      'I need you to'
    ];
    
    let result = text;
    redundantPhrases.forEach(phrase => {
      result = result.replace(new RegExp(phrase, 'gi'), '');
    });
    
    return result.replace(/\s+/g, ' ').trim();
  }
  
  /**
   * 📝 استفاده از مخفف‌ها
   */
  private static applyAbbreviations(text: string): string {
    const abbreviations: Record<string, string> = {
      'for example': 'e.g.',
      'that is': 'i.e.',
      'et cetera': 'etc.',
      'and so on': 'etc.',
      'as soon as possible': 'asap',
      'frequently asked questions': 'FAQ',
      'application programming interface': 'API',
      'artificial intelligence': 'AI',
      'machine learning': 'ML',
      'natural language processing': 'NLP',
      'user interface': 'UI',
      'user experience': 'UX'
    };
    
    let result = text;
    Object.entries(abbreviations).forEach(([full, abbr]) => {
      result = result.replace(new RegExp(full, 'gi'), abbr);
    });
    
    return result;
  }
  
  /**
   * 🗜️ فشرده‌سازی دستورالعمل‌ها
   */
  private static compressInstructions(text: string): string {
    const compressionRules: Record<string, string> = {
      'provide a detailed explanation': 'explain',
      'give me a comprehensive overview': 'overview',
      'create a step-by-step guide': 'guide',
      'write a professional email': 'email',
      'generate a creative story': 'story',
      'analyze and provide insights': 'analyze',
      'summarize the key points': 'summarize',
      'translate the following text': 'translate',
      'optimize the following content': 'optimize',
      'review and provide feedback': 'review'
    };
    
    let result = text;
    Object.entries(compressionRules).forEach(([full, compressed]) => {
      result = result.replace(new RegExp(full, 'gi'), compressed);
    });
    
    return result;
  }
  
  /**
   * ⚡ استفاده از فرم‌های کوتاه
   */
  private static useShortForms(text: string): string {
    const shortForms: Record<string, string> = {
      'you are': "you're",
      'I am': "I'm",
      'it is': "it's",
      'we are': "we're",
      'they are': "they're",
      'do not': "don't",
      'will not': "won't",
      'cannot': "can't",
      'should not': "shouldn't",
      'would not': "wouldn't",
      'have not': "haven't",
      'has not': "hasn't"
    };
    
    let result = text;
    Object.entries(shortForms).forEach(([full, short]) => {
      result = result.replace(new RegExp(full, 'gi'), short);
    });
    
    return result;
  }
  
  /**
   * 🚫 حذف مثال‌ها
   */
  private static removeExamples(text: string): string {
    // حذف جملات که با "for example", "such as", "like" شروع می‌شوند
    const examplePatterns = [
      /for example[^.]*\./gi,
      /such as[^.]*\./gi,
      /like[^.]*\./gi,
      /e\.g\.[^.]*\./gi,
      /including[^.]*\./gi
    ];
    
    let result = text;
    examplePatterns.forEach(pattern => {
      result = result.replace(pattern, '');
    });
    
    return result.replace(/\s+/g, ' ').trim();
  }
  
  /**
   * 📏 محدود کردن توضیحات
   */
  private static limitExplanations(text: string): string {
    // حذف جملات پرانتزی و توضیحات اضافی
    return text
      .replace(/\([^)]*\)/g, '')
      .replace(/\[[^\]]*\]/g, '')
      .replace(/\{[^}]*\}/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * ✂️ کوتاه کردن بر اساس طول
   */
  private static truncateToLength(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    // کوتاه کردن در نزدیکترین نقطه
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > maxLength * 0.8 ? truncated.substring(0, lastSpace) : truncated;
  }
  
  /**
   * 💡 تولید پیشنهادات
   */
  private static generateSuggestions(original: string, _optimized: string): string[] {
    const suggestions: string[] = [];
    
    if (original.includes('please') || original.includes('could you')) {
      suggestions.push('استفاده از زبان مستقیم به جای محترمانه');
    }
    
    if (original.length > 500) {
      suggestions.push('تقسیم prompt بزرگ به چند بخش کوچکتر');
    }
    
    if (original.includes('step by step') || original.includes('detailed')) {
      suggestions.push('استفاده از bullet points به جای توضیحات مفصل');
    }
    
    if (original.includes('example') || original.includes('such as')) {
      suggestions.push('حذف مثال‌ها و اتکا به دانش مدل');
    }
    
    if (original.includes('background') || original.includes('context')) {
      suggestions.push('کاهش context اضافی و تمرکز بر هسته اصلی');
    }
    
    return suggestions;
  }
  
  /**
   * 🎯 بهینه‌سازی خروجی
   */
  static optimizeOutput(outputText: string, maxTokens?: number): string {
    let optimized = outputText;
    
    // حذف فضاهای اضافی
    optimized = optimized.replace(/\n\s*\n/g, '\n');
    optimized = optimized.replace(/\s+/g, ' ');
    
    // محدود کردن طول در صورت نیاز
    if (maxTokens) {
      const estimatedTokens = this.estimateTokens(optimized);
      if (estimatedTokens > maxTokens) {
        const targetLength = maxTokens * 4; // تبدیل توکن به کاراکتر
        optimized = this.truncateToLength(optimized, targetLength);
      }
    }
    
    return optimized.trim();
  }
  
  /**
   * 📋 پیش‌تنظیمات آماده
   */
  static getOptimizationPresets(): Record<string, OptimizationOptions> {
    return {
      light: {
        enableAbbreviations: true,
        removeRedundancy: true,
        compressInstructions: false,
        useShortForms: true,
        removeExamples: false,
        limitExplanations: false,
        preserveQuality: true
      },
      medium: {
        enableAbbreviations: true,
        removeRedundancy: true,
        compressInstructions: true,
        useShortForms: true,
        removeExamples: true,
        limitExplanations: true,
        preserveQuality: true
      },
      aggressive: {
        enableAbbreviations: true,
        removeRedundancy: true,
        compressInstructions: true,
        useShortForms: true,
        removeExamples: true,
        limitExplanations: true,
        maxLength: 500,
        preserveQuality: false
      }
    };
  }
} 