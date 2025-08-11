import React, { useEffect, useState } from 'react';
import ApiTestButton from '../components/ApiTestButton';
import TokenUsageCounter from '../components/TokenUsageCounter';
import { useToast } from '../context/ToastContext';
import './PromptEnhancer.redesigned.css';

// Professional domains and their specific prompt templates
const professionDomains = {
  developer: {
    nameKey: 'professions.developer',
    name: 'Software Developer',
    icon: '💻',
    templates: [
      'Write clean code for [feature] in [programming language]',
      'Design software architecture for [application type]',
      'Create API documentation for [service] endpoints',
      'Implement database schema for [business domain]',
      'Write unit tests for [functionality] in [language]',
      'Optimize performance for [application component]'
    ],
    guidelines: {
      tone: 'Technical and precise',
      focus: 'Code quality, performance, and maintainability',
      examples: 'Include code examples, best practices, and design patterns',
      constraints: 'Consider scalability, security, and platform limitations',
      terminology: 'Use programming and software development terminology'
    }
  },
  marketer: {
    nameKey: 'professions.marketer',
    name: 'Digital Marketer',
    icon: '📈',
    templates: [
      'Create marketing campaign for [product/service] targeting [audience]',
      'Develop social media strategy for [brand] on [platform]',
      'Design email marketing sequence for [conversion goal]',
      'Plan content marketing strategy for [industry]',
      'Create PPC campaign structure for [business type]',
      'Develop influencer marketing plan for [product category]'
    ],
    guidelines: {
      tone: 'Persuasive and engaging',
      focus: 'Customer engagement, conversion rates, and brand awareness',
      examples: 'Include campaign examples, metrics, and ROI considerations',
      constraints: 'Consider budget, platform policies, and target audience',
      terminology: 'Use marketing and digital advertising terminology'
    }
  },
  healthcare: {
    nameKey: 'professions.healthcare',
    name: 'Healthcare Professional',
    icon: '🏥',
    templates: [
      'Create patient education materials for [medical condition]',
      'Design treatment plan for [health condition]',
      'Write medical documentation for [procedure]',
      'Develop health promotion campaign for [target population]',
      'Create clinical guidelines for [medical specialty]',
      'Design patient care protocol for [healthcare setting]'
    ],
    guidelines: {
      tone: 'Professional and compassionate',
      focus: 'Patient safety, evidence-based practice, and healthcare outcomes',
      examples: 'Include medical protocols, safety guidelines, and patient education',
      constraints: 'Consider medical ethics, regulatory compliance, and patient privacy',
      terminology: 'Use medical and healthcare terminology'
    }
  },
  legal: {
    nameKey: 'professions.legal',
    name: 'Legal Professional',
    icon: '⚖️',
    templates: [
      'Draft legal document for [contract type]',
      'Create legal analysis for [case type]',
      'Write compliance policy for [industry]',
      'Develop legal strategy for [legal matter]',
      'Create terms of service for [business type]',
      'Draft privacy policy for [application/service]'
    ],
    guidelines: {
      tone: 'Formal and authoritative',
      focus: 'Legal accuracy, compliance, and risk mitigation',
      examples: 'Include legal precedents, regulatory requirements, and case law',
      constraints: 'Consider jurisdiction, legal requirements, and potential liabilities',
      terminology: 'Use legal and regulatory terminology'
    }
  },
  finance: {
    nameKey: 'professions.finance',
    name: 'Financial Advisor',
    icon: '💰',
    templates: [
      'Create investment strategy for [client profile]',
      'Develop financial plan for [life goal]',
      'Analyze financial statements for [business type]',
      'Create budgeting framework for [income level]',
      'Design retirement planning strategy for [age group]',
      'Develop risk management plan for [investment type]'
    ],
    guidelines: {
      tone: 'Professional and trustworthy',
      focus: 'Financial security, risk management, and long-term planning',
      examples: 'Include financial calculations, market analysis, and investment options',
      constraints: 'Consider regulatory compliance, risk tolerance, and market conditions',
      terminology: 'Use financial and investment terminology'
    }
  },
  sales: {
    nameKey: 'professions.sales',
    name: 'Sales Professional',
    icon: '🎯',
    templates: [
      'Create sales pitch for [product/service] targeting [prospect type]',
      'Develop objection handling strategy for [common objection]',
      'Design sales funnel for [business type]',
      'Create follow-up sequence for [lead type]',
      'Develop negotiation strategy for [deal size]',
      'Create customer retention plan for [industry]'
    ],
    guidelines: {
      tone: 'Persuasive and relationship-focused',
      focus: 'Customer needs, value proposition, and relationship building',
      examples: 'Include sales techniques, objection handling, and closing strategies',
      constraints: 'Consider customer preferences, competition, and sales cycle',
      terminology: 'Use sales and customer relationship terminology'
    }
  },
  hr: {
    nameKey: 'professions.hr',
    name: 'HR Professional',
    icon: '👥',
    templates: [
      'Create job description for [position] in [industry]',
      'Design employee onboarding program for [company size]',
      'Develop performance review system for [department]',
      'Create workplace policy for [policy type]',
      'Design training program for [skill development]',
      'Develop employee engagement strategy for [workplace type]'
    ],
    guidelines: {
      tone: 'Professional and people-focused',
      focus: 'Employee development, workplace culture, and organizational effectiveness',
      examples: 'Include HR best practices, compliance requirements, and employee development',
      constraints: 'Consider labor laws, company culture, and organizational goals',
      terminology: 'Use HR and organizational development terminology'
    }
  },
  content: {
    nameKey: 'professions.content',
    name: 'Content Creator',
    icon: '📱',
    templates: [
      'Create viral social media content for [platform] about [topic]',
      'Design content calendar for [brand] across [platforms]',
      'Develop storytelling strategy for [brand story]',
      'Create video script for [content type] targeting [audience]',
      'Design interactive content for [engagement goal]',
      'Develop content repurposing strategy for [original content]'
    ],
    guidelines: {
      tone: 'Creative and engaging',
      focus: 'Audience engagement, brand storytelling, and content virality',
      examples: 'Include content formats, platform-specific strategies, and engagement metrics',
      constraints: 'Consider platform algorithms, audience preferences, and brand guidelines',
      terminology: 'Use content creation and social media terminology'
    }
  },
  seo: {
    nameKey: 'professions.seo',
    name: 'SEO Specialist',
    icon: '🔍',
    templates: [
      'Optimize website content for keyword [keyword] in [industry]',
      'Create SEO strategy for [website type] targeting [audience]',
      'Develop link building strategy for [business type]',
      'Design technical SEO audit for [website]',
      'Create local SEO plan for [business location]',
      'Develop content optimization strategy for [content type]'
    ],
    guidelines: {
      tone: 'Technical and strategic',
      focus: 'Search visibility, organic traffic, and ranking improvements',
      examples: 'Include SEO techniques, keyword research, and technical optimization',
      constraints: 'Consider search engine guidelines, competition, and website authority',
      terminology: 'Use SEO and digital marketing terminology'
    }
  },
  teacher: {
    nameKey: 'professions.teacher',
    name: 'Teacher/Educator',
    icon: '🎓',
    templates: [
      'Design curriculum for teaching [subject] to [age/level] students',
      'Create practical exercises for [subject] with [easy/medium/hard] difficulty',
      'Provide engaging methods to teach [concept] to [age] children',
      'Prepare comprehensive assessment plan for [subject]',
      'Design group activities for teaching [concept]',
      'Provide motivation strategies for [age] students'
    ],
    guidelines: {
      tone: 'Educational and encouraging',
      focus: 'Learning outcomes, student engagement, and comprehension',
      examples: 'Include age-appropriate activities and assessment methods',
      constraints: 'Consider learning styles and educational standards',
      terminology: 'Use educational and pedagogical terms'
    }
  },
  writer: {
    nameKey: 'professions.writer',
    name: 'Writer/Copywriter',
    icon: '✍️',
    templates: [
      'Write [word count] word article about [topic] for [audience]',
      'Create SEO content for keyword [keyword] as [article/guide] type',
      'Write creative content for [content type] with [humor/serious/narrative] style',
      'Create engaging Instagram post about [topic] with relevant hashtags',
      'Write [duration] minute YouTube video script about [topic]',
      'Create blog content to increase traffic in [topic] area'
    ],
    guidelines: {
      tone: 'Adaptable to content type and audience',
      focus: 'Engagement, readability, and message clarity',
      examples: 'Include writing style examples and content structure',
      constraints: 'Consider word count, platform requirements, and SEO',
      terminology: 'Use writing and content creation terminology'
    }
  },
  designer: {
    nameKey: 'professions.designer',
    name: 'Graphic/UI/UX Designer',
    icon: '🎨',
    templates: [
      'Provide design ideas for [project type] with [modern/classic/minimal] style',
      'Suggest color palette for [brand type] with [desired feeling]',
      'Design better user experience for [app type]',
      'Provide logo design guide for [business type]',
      'Create banner design ideas for [product/service]',
      'Explain responsive design principles for [website type]'
    ],
    guidelines: {
      tone: 'Creative and visual-focused',
      focus: 'User experience, visual appeal, and brand consistency',
      examples: 'Include design principles and visual references',
      constraints: 'Consider accessibility, platform limitations, and brand guidelines',
      terminology: 'Use design and UX terminology'
    }
  },
  business: {
    nameKey: 'professions.business',
    name: 'Business Consultant',
    icon: '💼',
    templates: [
      'Prepare business plan for [idea] in [region] market',
      'Provide growth strategy for [business type] in [timeframe]',
      'Conduct competitive analysis for [industry] focusing on [specific aspect]',
      'Suggest revenue model for [business type]',
      'Create pricing strategy for [product/service] in [target] market',
      'Develop marketing and sales plan for [startup/company]'
    ],
    guidelines: {
      tone: 'Professional and analytical',
      focus: 'Profitability, market analysis, and strategic planning',
      examples: 'Include market research, financial projections, and case studies',
      constraints: 'Consider market conditions, competition, and regulatory requirements',
      terminology: 'Use business and financial terminology'
    }
  },
  analyst: {
    nameKey: 'professions.analyst',
    name: 'Data Analyst',
    icon: '📊',
    templates: [
      'Analyze [data type] data to discover [analysis goal]',
      'Create analytical report on [topic] focusing on [key metrics]',
      'Predict [topic] trends based on [data sources]',
      'Design analytical dashboard for [business] with appropriate KPIs',
      'Analyze customer behavior based on [available data]',
      'Build prediction model for [business goal] using [algorithm type]'
    ],
    guidelines: {
      tone: 'Analytical and data-driven',
      focus: 'Data accuracy, statistical significance, and actionable insights',
      examples: 'Include data visualization suggestions and statistical methods',
      constraints: 'Consider data quality, sample size, and statistical validity',
      terminology: 'Use data science and analytics terminology'
    }
  },
  researcher: {
    nameKey: 'professions.researcher',
    name: 'Research Specialist',
    icon: '🔬',
    templates: [
      'Conduct literature review on [research topic]',
      'Design research methodology for [study type]',
      'Analyze research data using [statistical method]',
      'Write research proposal for [academic/industry] project',
      'Create research presentation for [audience type]',
      'Develop research questions for [field] study'
    ],
    guidelines: {
      tone: 'Academic and methodical',
      focus: 'Research validity, methodology, and evidence-based conclusions',
      examples: 'Include research methods, citation formats, and statistical analysis',
      constraints: 'Consider research ethics, sample size, and methodology limitations',
      terminology: 'Use academic and research terminology'
    }
  },
  custom: {
    nameKey: 'professions.custom',
    name: 'Custom/General',
    icon: '🎯',
    templates: [
      'Write a custom prompt for [your specific need]',
      'Create a general-purpose prompt for [topic]',
      'Design a flexible prompt for [any domain]',
      'Build a universal prompt template for [purpose]',
      'Develop a cross-domain prompt for [objective]',
      'Craft a versatile prompt for [any application]'
    ],
    guidelines: {
      tone: 'Adaptable and flexible',
      focus: 'Universal applicability and broad scope',
      examples: 'Include versatile examples that work across domains',
      constraints: 'Consider general best practices and universal principles',
      terminology: 'Use clear, accessible language suitable for any field'
    }
  }
};

// Helper function to get domain-specific guidelines
const getDomainGuidelines = (profession: string) => {
  const domain = professionDomains[profession as keyof typeof professionDomains];
  if (!domain?.guidelines) {
    return 'Apply general professional standards and best practices with imperative commands.';
  }
  
  const { tone, focus, examples, constraints, terminology } = domain.guidelines;
  
  return `
• Tone: ${tone}
• Focus Areas: ${focus}
• Examples: ${examples}
• Constraints: ${constraints}
• Terminology: ${terminology}
• Commands: Use imperative action verbs appropriate for this domain
  `.trim();
};

const complexityLevels = {
  beginner: { name: 'Beginner', icon: '🌱', description: 'Simple and understandable' },
  intermediate: { name: 'Intermediate', icon: '🌿', description: 'Balanced and comprehensive' },
  advanced: { name: 'Advanced', icon: '🌳', description: 'Specialized and in-depth' },
  expert: { name: 'Expert', icon: '🚀', description: 'Highly specialized and complex' }
};

const outputTypes = {
  paragraph: { name: 'Paragraph', icon: '📝', description: 'Response in plain text format' },
  list: { name: 'List', icon: '📋', description: 'Response in bullet point format' },
  stepByStep: { name: 'Step-by-step', icon: '👣', description: 'Step-by-step guide' },
  table: { name: 'Table', icon: '📊', description: 'Response in organized table format' },
  code: { name: 'Code', icon: '💻', description: 'Response including programming code' },
  creative: { name: 'Creative', icon: '🎨', description: 'Creative and innovative response' }
};

const PromptEnhancer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [forceEnglishOutput, setForceEnglishOutput] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('force-english-output');
      return saved === 'true';
    } catch {
      return false;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Enhanced state variables
  const [selectedProfession, setSelectedProfession] = useState('custom');
  const [complexityLevel, setComplexityLevel] = useState('intermediate');
  const [outputType, setOutputType] = useState('paragraph');
  
  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedProfessionalTemplate, setSelectedProfessionalTemplate] = useState<string>('');
  
  // Quality analysis state
  const [promptQuality, setPromptQuality] = useState<any>(null);
  const [showQualityAnalysis, setShowQualityAnalysis] = useState(false);
  
  // Goal analysis state
  const [userGoal, setUserGoal] = useState<any>(null);
  const [showGoalAnalysis, setShowGoalAnalysis] = useState(false);
  
  // Input mode state
  const [inputMode, setInputMode] = useState<'simple' | 'advanced'>('simple');
  
  // Error state
  // const [error, setError] = useState('');
  
  const { addToast } = useToast();

  // Prompt quality analyzer
  const analyzePromptQuality = (promptText: string) => {
    const analysis = {
      score: 0,
      issues: [] as string[],
      suggestions: [] as string[],
      isGood: false
    };

    // Check length
    if (promptText.length < 10) {
      analysis.issues.push('Prompt is too short');
      analysis.suggestions.push('Add more details');
      analysis.score -= 30;
    } else if (promptText.length < 50) {
      analysis.issues.push('Prompt is short');
      analysis.suggestions.push('Add more explanations');
      analysis.score -= 15;
    } else if (promptText.length > 500) {
      analysis.issues.push('Prompt is too long');
      analysis.suggestions.push('Make it more concise');
      analysis.score -= 10;
    } else {
      analysis.score += 20;
    }

    // Check for action verbs
    const actionVerbs = ['write', 'create', 'analyze', 'design', 'develop', 'build', 'make', 'show', 'explain', 'generate'];
    const hasActionVerb = actionVerbs.some(verb => promptText.toLowerCase().includes(verb));
    if (!hasActionVerb) {
      analysis.issues.push('No clear command');
      analysis.suggestions.push('Use action words like "write", "create", "analyze"');
      analysis.score -= 20;
    } else {
      analysis.score += 15;
    }

    // Check for context
    const contextKeywords = ['for', 'in', 'with', 'that', 'this', 'about', 'regarding', 'concerning'];
    const hasContext = contextKeywords.some(keyword => promptText.toLowerCase().includes(keyword));
    if (!hasContext) {
      analysis.issues.push('No clear context');
      analysis.suggestions.push('Specify the context and purpose');
      analysis.score -= 15;
    } else {
      analysis.score += 10;
    }

    // Check for specific details
    const specificKeywords = ['code', 'program', 'website', 'app', 'report', 'analysis', 'design', 'content'];
    const hasSpecificDetails = specificKeywords.some(keyword => promptText.toLowerCase().includes(keyword));
    if (!hasSpecificDetails) {
      analysis.issues.push('No specific details');
      analysis.suggestions.push('Specify the expected output type');
      analysis.score -= 10;
    } else {
      analysis.score += 10;
    }

    // Determine if prompt is good
    analysis.isGood = analysis.score >= 60;

    return analysis;
  };

  // Goal analysis function
  const analyzeUserGoal = (promptText: string) => {
    const goalAnalysis = {
      primaryGoal: '',
      secondaryGoals: [] as string[],
      targetAudience: '',
      expectedOutput: '',
      domain: '',
      complexity: '',
      suggestions: [] as string[]
    };

    const text = promptText.toLowerCase();

    // Analyze primary goal
    if (text.includes('code') || text.includes('program') || text.includes('software')) {
      goalAnalysis.primaryGoal = 'Software Development';
      goalAnalysis.domain = 'developer';
      goalAnalysis.expectedOutput = 'Programming Code';
    } else if (text.includes('analyze') || text.includes('report') || text.includes('data')) {
      goalAnalysis.primaryGoal = 'Data Analysis';
      goalAnalysis.domain = 'analyst';
      goalAnalysis.expectedOutput = 'Analytical Report';
    } else if (text.includes('design') || text.includes('ui') || text.includes('ux')) {
      goalAnalysis.primaryGoal = 'UI/UX Design';
      goalAnalysis.domain = 'designer';
      goalAnalysis.expectedOutput = 'Design & Wireframes';
    } else if (text.includes('content') || text.includes('write') || text.includes('article')) {
      goalAnalysis.primaryGoal = 'Content Creation';
      goalAnalysis.domain = 'writer';
      goalAnalysis.expectedOutput = 'Content & Text';
    } else if (text.includes('marketing') || text.includes('advertising') || text.includes('sales')) {
      goalAnalysis.primaryGoal = 'Marketing & Advertising';
      goalAnalysis.domain = 'marketer';
      goalAnalysis.expectedOutput = 'Marketing Strategy';
    } else if (text.includes('education') || text.includes('teaching') || text.includes('learning')) {
      goalAnalysis.primaryGoal = 'Education & Teaching';
      goalAnalysis.domain = 'teacher';
      goalAnalysis.expectedOutput = 'Educational Content';
    } else if (text.includes('business') || text.includes('strategy') || text.includes('plan')) {
      goalAnalysis.primaryGoal = 'Business Management';
      goalAnalysis.domain = 'business';
      goalAnalysis.expectedOutput = 'Business Plan';
    } else if (text.includes('research') || text.includes('study') || text.includes('investigation')) {
      goalAnalysis.primaryGoal = 'Research & Investigation';
      goalAnalysis.domain = 'researcher';
      goalAnalysis.expectedOutput = 'Research Report';
    } else {
      goalAnalysis.primaryGoal = 'General';
      goalAnalysis.domain = 'custom';
      goalAnalysis.expectedOutput = 'General Response';
    }

    // Analyze target audience
    if (text.includes('beginner') || text.includes('newbie') || text.includes('learning')) {
      goalAnalysis.targetAudience = 'Beginners';
      goalAnalysis.complexity = 'beginner';
    } else if (text.includes('expert') || text.includes('professional') || text.includes('advanced')) {
      goalAnalysis.targetAudience = 'Experts';
      goalAnalysis.complexity = 'expert';
    } else if (text.includes('intermediate') || text.includes('medium')) {
      goalAnalysis.targetAudience = 'Intermediate Users';
      goalAnalysis.complexity = 'intermediate';
    } else {
      goalAnalysis.targetAudience = 'General';
      goalAnalysis.complexity = 'intermediate';
    }

    // Generate suggestions based on goal
    if (goalAnalysis.domain === 'developer') {
      goalAnalysis.suggestions.push('Specify the programming language');
      goalAnalysis.suggestions.push('Define project type (web, mobile, desktop)');
    } else if (goalAnalysis.domain === 'analyst') {
      goalAnalysis.suggestions.push('Specify the type of data to analyze');
      goalAnalysis.suggestions.push('Define analysis purpose (pattern discovery, prediction, reporting)');
    } else if (goalAnalysis.domain === 'designer') {
      goalAnalysis.suggestions.push('Specify design type (UI, UX, graphic)');
      goalAnalysis.suggestions.push('Define target platform (web, mobile, desktop)');
    }

    return goalAnalysis;
  };

  // Load selected template from localStorage on component mount
  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      try {
        const template = JSON.parse(savedTemplate);
        setSelectedTemplate(template);
        setPrompt(template.prompt || '');
        addToast('Template loaded successfully!', 'success');
        localStorage.removeItem('selectedTemplate');
      } catch (error) {
        console.error('Error parsing template:', error);
        addToast('Error loading template', 'error');
        localStorage.removeItem('selectedTemplate');
      }
    }
  }, [addToast]);

  // Auto-analyze prompt quality when prompt changes (only in advanced mode)
  useEffect(() => {
    if (inputMode === 'advanced' && prompt.trim().length > 0) {
      const analysis = analyzePromptQuality(prompt);
      const goalAnalysis = analyzeUserGoal(prompt);
      
      setPromptQuality(analysis);
      setUserGoal(goalAnalysis);
      
      // Show quality analysis if there are issues
      if (!analysis.isGood && analysis.issues.length > 0) {
        setShowQualityAnalysis(true);
      } else {
        setShowQualityAnalysis(false);
      }
      
      // Show goal analysis if goal is detected
      if (goalAnalysis.primaryGoal !== 'General') {
        setShowGoalAnalysis(true);
      } else {
        setShowGoalAnalysis(false);
      }
    } else {
      setPromptQuality(null);
      setUserGoal(null);
      setShowQualityAnalysis(false);
      setShowGoalAnalysis(false);
    }
  }, [prompt, inputMode]);

  const handleEnhance = async () => {
    if (!prompt.trim()) {
      addToast('Please enter a prompt', 'error');
      return;
    }

    // Quality check only in advanced mode
    if (inputMode === 'advanced') {
      const qualityAnalysis = analyzePromptQuality(prompt);
      if (!qualityAnalysis.isGood) {
        const shouldContinue = window.confirm(
          `⚠️ Your prompt has low quality (Score: ${qualityAnalysis.score}/100).\n\n` +
          `Issues:\n${qualityAnalysis.issues.map(issue => `• ${issue}`).join('\n')}\n\n` +
          `Suggestions:\n${qualityAnalysis.suggestions.map(suggestion => `• ${suggestion}`).join('\n')}\n\n` +
          `Do you want to continue without improving the prompt?`
        );
        
        if (!shouldContinue) {
          addToast('Please improve the prompt first.', 'info');
          return;
        }
      }
    }

    setIsLoading(true);
    // setError('');

    try {
      const selectedProfessionData = professionDomains[selectedProfession as keyof typeof professionDomains];
      const selectedComplexityData = complexityLevels[complexityLevel as keyof typeof complexityLevels];
      const selectedOutputData = outputTypes[outputType as keyof typeof outputTypes];

      let enhancedUserPrompt = '';

      if (selectedProfession === 'custom') {
        enhancedUserPrompt = `
CUSTOM MODE ENHANCEMENT

ORIGINAL PROMPT:
${prompt}

ENHANCEMENT CONTEXT:
- Complexity Level: ${selectedComplexityData?.name} (${selectedComplexityData?.description})
- Output Format: ${selectedOutputData?.name} (${selectedOutputData?.description})
- Professional Template: ${selectedProfessionalTemplate ? 'Applied' : 'None'}

ENHANCED PROMPT:
Please enhance the above prompt to be more specific, actionable, and effective. Focus on:
1. Making it more imperative and command-based
2. Adding specific details and context
3. Ensuring clear output requirements
4. Optimizing for ${selectedComplexityData?.name} level understanding
5. Structuring for ${selectedOutputData?.name} format

${selectedProfessionalTemplate ? `PROFESSIONAL TEMPLATE CONTEXT:\n${selectedProfessionalTemplate}\n\n` : ''}
Please provide an enhanced version that follows these guidelines.`;
      } else {
        enhancedUserPrompt = `
PROFESSIONAL ENHANCEMENT

ORIGINAL PROMPT:
${prompt}

PROFESSIONAL CONTEXT:
- Domain: ${selectedProfessionData?.name}
- Guidelines: ${selectedProfessionData?.guidelines?.tone || 'Professional tone'}

DOMAIN-SPECIFIC GUIDELINES:
${getDomainGuidelines(selectedProfession)}

COMMAND ENHANCEMENT REQUIREMENTS:
- Transform into imperative commands
- Use action verbs: Write, Create, Analyze, Design, Develop, Build, Explain
- Ensure clear, direct instructions
- Add specific context and constraints

OUTPUT REQUIREMENTS:
- Format: ${selectedOutputData?.name}
- Structure: ${selectedOutputData?.description}

COMMAND STRUCTURE:
1. START with a clear command
2. PROVIDE specific context and background
3. SPECIFY exact requirements and constraints
4. DEFINE expected output format and structure
5. INCLUDE domain-specific terminology and best practices

IMPERATIVE REQUIREMENTS:
- Use "Create", "Generate", "Analyze", "Design", "Develop", "Build", "Write", "Explain"
- Avoid passive language
- Be specific and actionable
- Include measurable outcomes

${selectedProfessionalTemplate ? `PROFESSIONAL TEMPLATE:\n${selectedProfessionalTemplate}\n\n` : ''}
Please enhance the original prompt following these professional guidelines and command structure.`;
      }

      // Import and use the enhancePrompt function
      const { enhancePrompt } = await import('../services/aiService');
      
      // Get API key from localStorage
      const modelConfigs = localStorage.getItem('prompter-model-configs');
      const currentModel = localStorage.getItem('prompter-current-model') || 'openai-gpt35';
      let apiKey = '';
      
      if (modelConfigs) {
        try {
          const configs = JSON.parse(modelConfigs);
          const modelConfig = configs[currentModel];
          apiKey = modelConfig?.apiKey || '';
        } catch (error) {
          console.error('Error parsing model configs:', error);
        }
      }
      
      // Detect input language roughly from user prompt
      const detectInputLang = (text: string): string => {
        try {
          // simple heuristic based on unicode ranges
          if (/\p{Script=Arabic}/u.test(text)) return 'fa';
          if (/\p{Script=Latin}/u.test(text)) return 'en';
          return navigator.language?.slice(0,2) || 'en';
        } catch {
          return 'en';
        }
      };

      const inputLanguage = detectInputLang(prompt);

      const result = await enhancePrompt({
        userPrompt: enhancedUserPrompt,
        apiKey: apiKey,
        modelId: currentModel,
        language: forceEnglishOutput ? 'en' : inputLanguage,
        domain: selectedProfession,
        complexity: complexityLevel,
        outputFormat: outputType
      });

      setEnhancedPrompt(result);
      addToast('Prompt enhanced successfully!', 'success');
    } catch (error) {
      console.error('Enhancement error:', error);
      // setError('An error occurred while enhancing the prompt');
      addToast('Enhancement failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!enhancedPrompt) {
      addToast('No enhanced prompt to copy', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      addToast('Enhanced prompt copied to clipboard!', 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = enhancedPrompt;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      addToast('Enhanced prompt copied to clipboard!', 'success');
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError);
      addToast('Failed to copy to clipboard.', 'error');
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleSave = () => {
    if (!enhancedPrompt) {
      addToast('No enhanced prompt to save', 'error');
      return;
    }

    try {
      const savedPrompts = JSON.parse(localStorage.getItem('saved-enhanced-prompts') || '[]');
      const newPrompt = {
        id: Date.now(),
        original: prompt,
        enhanced: enhancedPrompt,
        timestamp: new Date().toISOString(),
        profession: selectedProfession,
        complexity: complexityLevel,
        outputType: outputType
      };
      
      savedPrompts.unshift(newPrompt);
      localStorage.setItem('saved-enhanced-prompts', JSON.stringify(savedPrompts));
      
      addToast('Enhanced prompt saved successfully!', 'success');
    } catch (error) {
      console.error('Failed to save:', error);
      addToast('Failed to save prompt', 'error');
    }
  };

  const handleAddToLibrary = () => {
    if (!enhancedPrompt) {
      addToast('No enhanced prompt to add to library', 'error');
      return;
    }

    try {
      // Get existing prompts from library
      const existingPrompts = JSON.parse(localStorage.getItem('prompt-library') || '[]');
      
      // Create new prompt for library
      const newLibraryPrompt = {
        id: Date.now().toString(),
        title: `Enhanced: ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}`,
        content: enhancedPrompt,
        category: selectedProfession === 'custom' ? 'general' : selectedProfession,
        tags: [`enhanced`, `ai-generated`, selectedProfession, complexityLevel, outputType],
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        description: `Enhanced prompt from AI Generator - Original: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`,
        author: 'AI Enhanced',
        difficulty: complexityLevel === 'simple' ? 'beginner' : 
                   complexityLevel === 'moderate' ? 'intermediate' : 
                   complexityLevel === 'complex' ? 'advanced' : 'expert',
        complexity: complexityLevel,
        timeRequired: 'quick'
      };
      
      // Add to library
      existingPrompts.unshift(newLibraryPrompt);
      localStorage.setItem('prompt-library', JSON.stringify(existingPrompts));
      
      addToast('✅ Enhanced prompt added to My Prompts library!', 'success');
    } catch (error) {
      console.error('Failed to add to library:', error);
      addToast('Failed to add prompt to library', 'error');
    }
  };

  const handleQuickSave = () => {
    if (!enhancedPrompt) {
      addToast('No enhanced prompt to save', 'error');
      return;
    }

    try {
      // Quick save with default settings
      const existingPrompts = JSON.parse(localStorage.getItem('prompt-library') || '[]');
      
      const quickPrompt = {
        id: Date.now().toString(),
        title: `Quick Save: ${new Date().toLocaleDateString()}`,
        content: enhancedPrompt,
        category: 'general',
        tags: ['quick-save', 'enhanced'],
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        description: 'Quick saved enhanced prompt',
        author: 'You',
        difficulty: 'beginner',
        complexity: 'simple',
        timeRequired: 'quick'
      };
      
      existingPrompts.unshift(quickPrompt);
      localStorage.setItem('prompt-library', JSON.stringify(existingPrompts));
      
      addToast('⚡ Prompt quick saved to library!', 'success');
    } catch (error) {
      console.error('Failed to quick save:', error);
      addToast('Failed to quick save prompt', 'error');
    }
  };

  const resetForm = () => {
    setPrompt('');
    setEnhancedPrompt('');
    setSelectedTemplate(null);
    setSelectedProfessionalTemplate('');
    setSelectedProfession('custom'); // Default to custom instead of developer
    setComplexityLevel('intermediate');
    setOutputType('paragraph');
    addToast('Form has been reset to Custom mode.', 'info');
  };

  // Handle professional template selection
  const handleProfessionalTemplateSelect = (template: string) => {
    setSelectedProfessionalTemplate(template);
    setPrompt(template);
    
    if (selectedProfession === 'custom') {
      addToast('Custom template selected. You can modify it as needed.', 'info');
    } else {
      addToast('Professional template selected. You can modify it as needed.', 'info');
    }
  };

  // A helper function to render a selection card
  const renderSelectionCard = (title: string, options: any, selected: string, setSelected: (value: string) => void) => (
    <div className="enhancer-card">
      <h3>{title}</h3>
      <div className="form-group-redesigned">
        <select className="select-redesigned" value={selected} onChange={(e) => setSelected(e.target.value)}>
          {Object.entries(options).map(([key, value]: [string, any]) => (
            <option key={key} value={key}>{value.name}</option>
          ))}
        </select>
      </div>
      
      {/* Show professional templates for profession selection */}
      {title === "Select Profession" && professionDomains[selected as keyof typeof professionDomains] && (
        <div className="professional-templates">
          <h4>Professional Templates</h4>
          <div className="template-grid">
            {professionDomains[selected as keyof typeof professionDomains].templates.map((template, index) => (
              <button
                key={index}
                className={`template-btn ${selectedProfessionalTemplate === template ? 'selected' : ''}`}
                onClick={() => handleProfessionalTemplateSelect(template)}
                title={template}
                data-template={template}
              >
                <span className="template-text">
                  {template.length > 50 ? template.substring(0, 50) + '...' : template}
                </span>
                {selectedProfessionalTemplate === template && (
                  <span className="template-check">✓</span>
                )}
              </button>
            ))}
          </div>
          
          {/* Custom Domain Info */}
          {selected === 'custom' && (
            <div className="custom-domain-info">
              <div className="custom-info-text">
                <strong>Custom Mode:</strong> This mode is for general prompts that don't fit specific professional categories. 
                You can still select complexity level and output format for better results.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="prompt-enhancer-redesigned">
      <div className="page-header-redesigned">
        <h2>Prompt Enhancer</h2>
        <p>Transform your simple ideas into powerful, precise, and professional prompts.</p>
      </div>

      <div className="enhancer-content">
        {/* Template Info Display */}
        {selectedTemplate && (
          <div className="template-info-card">
            <div className="template-info-header">
              <h4>📋 Loaded Template</h4>
              <button 
                className="clear-template-btn"
                onClick={() => {
                  setSelectedTemplate(null);
                  setPrompt('');
                }}
              >
                Clear
              </button>
            </div>
            <div className="template-info-content">
              <div className="template-meta">
                <div className="template-title">{selectedTemplate.title}</div>
                <div className="template-domain">{selectedTemplate.domain}</div>
                <div className="template-difficulty">{selectedTemplate.difficulty}</div>
              </div>
              <div className="template-description">{selectedTemplate.description}</div>
            </div>
          </div>
        )}

          <div className="enhancer-card">
            <h3>Enter Your Prompt</h3>
            
            {/* Input Mode Selection */}
            <div className="input-mode-selector">
              <div className="mode-buttons">
                <button 
                  className={`mode-btn ${inputMode === 'simple' ? 'active' : ''}`}
                  onClick={() => setInputMode('simple')}
                >
                  <span className="mode-icon">✏️</span>
                  <span className="mode-title">Simple Input</span>
                  <span className="mode-desc">Quick and easy prompt entry</span>
                </button>
                
                <button 
                  className={`mode-btn ${inputMode === 'advanced' ? 'active' : ''}`}
                  onClick={() => setInputMode('advanced')}
                >
                  <span className="mode-icon">🔍</span>
                  <span className="mode-title">Smart Analysis</span>
                  <span className="mode-desc">AI-powered quality & goal analysis</span>
                </button>
              </div>
            </div>

            <div className="form-group-redesigned">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  inputMode === 'simple' 
                    ? "Enter your prompt here... (Simple mode - direct enhancement)"
                    : "Enter your prompt here... (Smart mode - AI will analyze and suggest improvements)"
                }
                rows={6}
                className="prompt-textarea"
              />
            </div>

            {/* Quality Analysis Display - Only in Advanced Mode */}
            {inputMode === 'advanced' && showQualityAnalysis && promptQuality && (
              <div className="quality-analysis">
                <div className="quality-header">
                  <span className="quality-icon">🔍</span>
                  <span className="quality-title">Prompt Quality Analysis</span>
                  <span className="quality-score">Score: {promptQuality.score}/100</span>
                </div>
                
                {promptQuality.issues.length > 0 && (
                  <div className="quality-issues">
                    <h4>Identified Issues:</h4>
                    <ul>
                      {promptQuality.issues.map((issue: string, index: number) => (
                        <li key={index}>⚠️ {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {promptQuality.suggestions.length > 0 && (
                  <div className="quality-suggestions">
                    <h4>Improvement Suggestions:</h4>
                    <ul>
                      {promptQuality.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>💡 {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button 
                  className="quality-close-btn"
                  onClick={() => setShowQualityAnalysis(false)}
                >
                  Close
                </button>
              </div>
            )}

            {/* Goal Analysis Display - Only in Advanced Mode */}
            {inputMode === 'advanced' && showGoalAnalysis && userGoal && (
              <div className="goal-analysis">
                <div className="goal-header">
                  <span className="goal-icon">🎯</span>
                  <span className="goal-title">User Goal Analysis</span>
                  <span className="goal-domain">{userGoal.primaryGoal}</span>
                </div>
                
                <div className="goal-details">
                  <div className="goal-item">
                    <strong>Primary Goal:</strong> {userGoal.primaryGoal}
                  </div>
                  <div className="goal-item">
                    <strong>Target Audience:</strong> {userGoal.targetAudience}
                  </div>
                  <div className="goal-item">
                    <strong>Expected Output:</strong> {userGoal.expectedOutput}
                  </div>
                  <div className="goal-item">
                    <strong>Complexity Level:</strong> {userGoal.complexity}
                  </div>
                </div>
                
                {userGoal.suggestions.length > 0 && (
                  <div className="goal-suggestions">
                    <h4>Improvement Suggestions:</h4>
                    <ul>
                      {userGoal.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>💡 {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button 
                  className="goal-close-btn"
                  onClick={() => setShowGoalAnalysis(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        
        {renderSelectionCard("Select Profession", professionDomains, selectedProfession, setSelectedProfession)}
        {renderSelectionCard("Select Complexity", complexityLevels, complexityLevel, setComplexityLevel)}
        {renderSelectionCard("Select Output Format", outputTypes, outputType, setOutputType)}

        <div className="enhanced-prompt-display">
          <h3>Enhanced Prompt</h3>
          <div style={{ marginBottom: 8 }}>
            <TokenUsageCounter />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <input
              id="force-english-output"
              type="checkbox"
              checked={forceEnglishOutput}
              onChange={(e) => {
                const v = e.target.checked;
                setForceEnglishOutput(v);
                try { localStorage.setItem('force-english-output', String(v)); } catch {}
              }}
            />
            <label htmlFor="force-english-output">Force output in English</label>
          </div>
          {isLoading ? (
            <p>⏳ Enhancing your prompt...</p>
          ) : (
            <p>{enhancedPrompt || "Your enhanced prompt will appear here."}</p>
          )}
        </div>

        <div className="action-buttons">
              <button 
                type="button" 
                onClick={handleEnhance}
                disabled={isLoading || !prompt.trim()}
                className="enhance-btn"
              >
                {isLoading ? '⏳ Enhancing...' : '✨ Enhance Prompt'}
              </button>
              
              <button 
                type="button" 
                onClick={resetForm}
                className="reset-btn"
              >
                🔄 Reset
              </button>
              
              <button 
                type="button" 
                onClick={handleCopy}
                disabled={!enhancedPrompt}
                className="copy-btn"
              >
                📋 Copy Result
              </button>
              
              <button 
                type="button" 
                onClick={handleSave}
                disabled={!enhancedPrompt}
                className="save-btn"
              >
                💾 Save Result
              </button>

              <button 
                type="button" 
                onClick={handleAddToLibrary}
                disabled={!enhancedPrompt}
                className="add-to-library-btn"
              >
                📚 Add to My Prompts
              </button>
              
              <button 
                type="button" 
                onClick={handleQuickSave}
                disabled={!enhancedPrompt}
                className="quick-save-btn"
              >
                ⚡ Quick Save
              </button>
            </div>

        <div className="enhancer-card">
          <h3>Actions</h3>
          <div className="enhancer-actions">
              <ApiTestButton
                userPrompt={prompt}
                onResult={(result) => setEnhancedPrompt(result)}
                onError={(error) => addToast(error, 'error')}
                disabled={isLoading || !prompt}
                forceEnglishOutput={forceEnglishOutput}
              />
            </div>
        </div>
      </div>
      

    </div>
  );
};

export default PromptEnhancer; 