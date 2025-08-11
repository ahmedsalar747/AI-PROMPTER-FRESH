/**
 * Demo API Service - For testing without real API keys
 * Provides mock responses for UI testing
 */

// Mock responses for different prompt types
const DEMO_RESPONSES = {
  promptEnhancer: {
    'hello': '**Enhanced Prompt:** Create a comprehensive greeting that establishes rapport and sets a positive tone for professional communication.\n\n**Improvements Made:**\n- Added context and purpose\n- Specified tone and professionalism\n- Made it actionable and specific',
    
    'write code': '**Enhanced Prompt:** Write clean, well-documented code in [LANGUAGE] that implements [SPECIFIC_FUNCTIONALITY]. Include:\n- Clear variable names and comments\n- Error handling where appropriate\n- Unit tests for core functions\n- Performance considerations\n\n**Improvements Made:**\n- Added structure and requirements\n- Specified quality criteria\n- Included testing requirements',
    
    'default': '**Enhanced Prompt:** Transform this prompt into a clear, actionable instruction with specific requirements, context, and desired outcomes.\n\n**Improvements Made:**\n- Added clarity and structure\n- Defined specific requirements\n- Provided actionable framework'
  },
  
  promptArchitect: {
    'developer': 'As a Senior Software Engineer with 10+ years of experience, analyze the provided code or requirements and deliver:\n\n1. **Technical Assessment**\n2. **Best Practices Recommendations** \n3. **Implementation Strategy**\n4. **Code Examples** (if applicable)\n\nFormat your response with clear headings and practical examples.',
    
    'marketer': 'As a Digital Marketing Strategist with expertise in modern campaigns, create a comprehensive marketing strategy that includes:\n\n1. **Target Audience Analysis**\n2. **Channel Strategy**\n3. **Content Recommendations**\n4. **Success Metrics**\n\nProvide actionable insights with specific examples.',
    
    'default': 'As a professional expert in your field, provide comprehensive guidance that includes analysis, recommendations, and actionable steps.'
  }
};

export class DemoApiService {
  private static instance: DemoApiService;
  
  static getInstance(): DemoApiService {
    if (!DemoApiService.instance) {
      DemoApiService.instance = new DemoApiService();
    }
    return DemoApiService.instance;
  }

  /**
   * Simulate API call delay for realistic experience
   */
  private async simulateDelay(min: number = 1000, max: number = 3000): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Get demo response based on prompt content
   */
  private getDemoResponse(prompt: string, type: 'promptEnhancer' | 'promptArchitect' = 'promptEnhancer'): string {
    const responses = DEMO_RESPONSES[type];
    const lowercasePrompt = prompt.toLowerCase();
    
    // Try to match keywords
    for (const [keyword, response] of Object.entries(responses)) {
      if (keyword !== 'default' && lowercasePrompt.includes(keyword)) {
        return response;
      }
    }
    
    return responses.default;
  }

  /**
   * Demo prompt enhancement
   */
  async enhancePrompt(userPrompt: string): Promise<string> {
    if (!userPrompt || userPrompt.trim().length === 0) {
      throw new Error('Please enter a prompt to enhance');
    }

    if (userPrompt.length > 500) {
      throw new Error('Demo mode: Please keep prompts under 500 characters');
    }

    // Simulate API call
    await this.simulateDelay(1500, 2500);
    
    const response = this.getDemoResponse(userPrompt, 'promptEnhancer');
    
    // Add demo watermark
    return `${response}\n\n---\n*🎭 Demo Mode: This is a simulated response. Configure VITE_OPENAI_API_KEY for real AI responses.*`;
  }

  /**
   * Demo prompt architecture
   */
  async architectPrompt(userPrompt: string, profession: string = 'default'): Promise<string> {
    if (!userPrompt || userPrompt.trim().length === 0) {
      throw new Error('Please enter requirements for prompt architecture');
    }

    // Simulate API call
    await this.simulateDelay(2000, 3500);
    
    const response = this.getDemoResponse(profession, 'promptArchitect');
    
    return `${response}\n\n**Applied to your request:**\n"${userPrompt}"\n\n---\n*🎭 Demo Mode: This is a simulated response. Configure VITE_OPENAI_API_KEY for real AI responses.*`;
  }

  /**
   * Check if demo mode is active
   */
  isDemoMode(): boolean {
    return !import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'sk-your-api-key-here';
  }

  /**
   * Get usage stats for demo
   */
  getDemoUsage() {
    return {
      tokensUsed: Math.floor(Math.random() * 150) + 50,
      requestsUsed: Math.floor(Math.random() * 3) + 1,
      maxTokens: 200,
      maxRequests: 3,
      isDemo: true
    };
  }
}

// Export instance
export const demoApiService = DemoApiService.getInstance(); 