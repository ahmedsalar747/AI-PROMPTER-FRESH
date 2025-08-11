// Template Categories and Organization System
export interface Template {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  subcategory?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  estimatedOutputLength: string;
  useCase: string;
  exampleInput?: string;
  exampleOutput?: string;
  domain: 'business' | 'technology' | 'creative' | 'education' | 'healthcare' | 'legal' | 'marketing' | 'finance' | 'engineering' | 'science';
  skillLevel: {
    technical: 'low' | 'medium' | 'high' | 'expert';
    complexity: 'simple' | 'moderate' | 'complex' | 'advanced';
    timeRequired: 'quick' | 'medium' | 'long' | 'extensive';
  };
  // New features
  rating?: number; // Average rating (1-5 stars)
  ratingCount?: number; // Number of ratings
  createdAt?: string; // For custom templates
  createdBy?: string; // Author of custom template
  isCustom?: boolean; // Flag for custom templates
  isPremium?: boolean; // Flag for premium templates
}

// Template Rating Interface
export interface TemplateRating {
  templateId: string;
  rating: number; // 1-5 stars
  userId?: string;
  comment?: string;
  createdAt: string;
}

// Template History Interface
export interface TemplateHistoryEntry {
  templateId: string;
  usedAt: string;
  action: 'view' | 'copy' | 'use' | 'save' | 'unsave';
}

// Custom Template Interface
export interface CustomTemplate extends Omit<Template, 'id'> {
  id?: string; // Will be generated
  isCustom: true;
  createdAt: string;
  createdBy: string;
}

// Shared Template Interface
export interface SharedTemplate {
  id: string;
  templateId: string;
  shareCode: string;
  createdAt: string;
  expiresAt?: string;
  accessCount: number;
  maxAccess?: number;
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  domain: string;
  subcategories: TemplateSubcategory[];
}

export interface TemplateSubcategory {
  id: string;
  name: string;
  description: string;
  templates: Template[];
}

// Cache for loaded template categories
let cachedTemplateCategories: TemplateCategory[] | null = null;

// Function to get template categories (using try-catch for graceful fallback)
export const getTemplateCategories = async (): Promise<TemplateCategory[]> => {
  if (cachedTemplateCategories) {
    return cachedTemplateCategories;
  }

  try {
    // Dynamic imports with explicit error handling
    const businessModule = await import('./business').catch(() => ({ businessTemplates: null }));
    const technologyModule = await import('./technology').catch(() => ({ technologyTemplates: null }));
    const marketingModule = await import('./marketing').catch(() => ({ marketingTemplates: null }));
    const financeModule = await import('./finance').catch(() => ({ financeTemplates: null }));
    const legalModule = await import('./legal').catch(() => ({ legalTemplates: null }));
    const healthcareModule = await import('./healthcare').catch(() => ({ healthcareTemplates: null }));
    const educationModule = await import('./education').catch(() => ({ educationTemplates: null }));
    const engineeringModule = await import('./engineering').catch(() => ({ engineeringTemplates: null }));
    const scienceModule = await import('./science').catch(() => ({ scienceTemplates: null }));
    const creativeModule = await import('./creative').catch(() => ({ creativeTemplates: null }));

    const templateModules = [
      businessModule.businessTemplates,
      technologyModule.technologyTemplates,
      marketingModule.marketingTemplates,
      financeModule.financeTemplates,
      legalModule.legalTemplates,
      healthcareModule.healthcareTemplates,
      educationModule.educationTemplates,
      engineeringModule.engineeringTemplates,
      scienceModule.scienceTemplates,
      creativeModule.creativeTemplates
    ].filter(Boolean); // Remove any null values

    cachedTemplateCategories = templateModules as TemplateCategory[];
    return cachedTemplateCategories;
  } catch (error) {
    console.error('Error loading template categories:', error);
    return [];
  }
};

// Main template categories (populated dynamically)
export const templateCategories: TemplateCategory[] = [];

// Initialize template categories on first access
const initializeTemplateCategories = async () => {
  if (templateCategories.length === 0) {
    templateCategories.push(...await getTemplateCategories());
  }
};

// Difficulty level definitions
export const difficultyLevels = {
  beginner: {
    name: 'Beginner',
    description: 'Simple templates requiring basic knowledge',
    color: '#10B981',
    minExperience: '0-6 months'
  },
  intermediate: {
    name: 'Intermediate', 
    description: 'Moderate complexity requiring some experience',
    color: '#F59E0B',
    minExperience: '6 months - 2 years'
  },
  advanced: {
    name: 'Advanced',
    description: 'Complex templates for experienced professionals',
    color: '#EF4444',
    minExperience: '2-5 years'
  },
  expert: {
    name: 'Expert',
    description: 'Highly specialized templates for domain experts',
    color: '#8B5CF6',
    minExperience: '5+ years'
  }
};

// Domain classifications
export const domainClassifications = {
  business: {
    name: 'Business & Strategy',
    color: '#3B82F6',
    icon: '💼',
    description: 'Business planning, strategy, operations'
  },
  technology: {
    name: 'Technology & Development',
    color: '#10B981',
    icon: '💻',
    description: 'Programming, AI, software development'
  },
  marketing: {
    name: 'Marketing & Sales',
    color: '#F59E0B',
    icon: '📈',
    description: 'Digital marketing, sales, branding'
  },
  finance: {
    name: 'Finance & Investment',
    color: '#059669',
    icon: '💰',
    description: 'Financial analysis, investment, accounting'
  },
  legal: {
    name: 'Legal & Compliance',
    color: '#7C3AED',
    icon: '⚖️',
    description: 'Legal documents, compliance, contracts'
  },
  healthcare: {
    name: 'Healthcare & Medical',
    color: '#DC2626',
    icon: '🏥',
    description: 'Medical research, healthcare, wellness'
  },
  education: {
    name: 'Education & Training',
    color: '#2563EB',
    icon: '🎓',
    description: 'Learning, curriculum, teaching'
  },
  engineering: {
    name: 'Engineering & Technical',
    color: '#9333EA',
    icon: '⚙️',
    description: 'Engineering design, technical documentation'
  },
  science: {
    name: 'Science & Research',
    color: '#0891B2',
    icon: '🔬',
    description: 'Scientific research, analysis, documentation'
  },
  creative: {
    name: 'Creative & Content',
    color: '#EC4899',
    icon: '🎨',
    description: 'Creative writing, content creation, design'
  }
};

// Helper functions
export const getAllTemplates = async (): Promise<Template[]> => {
  await initializeTemplateCategories();
  return templateCategories.flatMap(category => 
    category.subcategories.flatMap(subcategory => subcategory.templates)
  );
};

export const getTemplatesByCategory = async (categoryId: string): Promise<Template[]> => {
  await initializeTemplateCategories();
  const category = templateCategories.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  return category.subcategories.flatMap(subcategory => subcategory.templates);
};

export const getTemplatesByDomain = async (domain: string): Promise<Template[]> => {
  const allTemplates = await getAllTemplates();
  return allTemplates.filter(template => template.domain === domain);
};

export const getTemplatesByDifficulty = async (difficulty: Template['difficulty']): Promise<Template[]> => {
  const allTemplates = await getAllTemplates();
  return allTemplates.filter(template => template.difficulty === difficulty);
};

export const getTemplatesBySkillLevel = async (skillLevel: Partial<Template['skillLevel']>): Promise<Template[]> => {
  const allTemplates = await getAllTemplates();
  return allTemplates.filter(template => {
    return Object.entries(skillLevel).every(([key, value]) => 
      template.skillLevel[key as keyof Template['skillLevel']] === value
    );
  });
};

export const getTemplatesByComplexity = async (technical: string, complexity: string): Promise<Template[]> => {
  const allTemplates = await getAllTemplates();
  return allTemplates.filter(template => 
    template.skillLevel.technical === technical && 
    template.skillLevel.complexity === complexity
  );
};

export const searchTemplates = async (query: string): Promise<Template[]> => {
  const allTemplates = await getAllTemplates();
  const lowercaseQuery = query.toLowerCase();
  
  return allTemplates.filter(template => 
    template.title.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    template.useCase.toLowerCase().includes(lowercaseQuery) ||
    template.domain.toLowerCase().includes(lowercaseQuery)
  );
};

export const getTemplatesByTags = async (tags: string[]): Promise<Template[]> => {
  const allTemplates = await getAllTemplates();
  return allTemplates.filter(template => 
    tags.some(tag => template.tags.some(templateTag => 
      templateTag.toLowerCase().includes(tag.toLowerCase())
    ))
  );
};

export const getRecommendedTemplates = async (userLevel: Template['difficulty'], domain?: string): Promise<Template[]> => {
  const templates = domain ? await getTemplatesByDomain(domain) : await getAllTemplates();
  
  // Priority algorithm based on user level and complementary skills
  const levelPriority = {
    beginner: ['beginner', 'intermediate'],
    intermediate: ['intermediate', 'beginner', 'advanced'],
    advanced: ['advanced', 'intermediate', 'expert'],
    expert: ['expert', 'advanced']
  };
  
  return templates
    .filter(template => levelPriority[userLevel].includes(template.difficulty))
    .sort((a, b) => {
      const aPriority = levelPriority[userLevel].indexOf(a.difficulty);
      const bPriority = levelPriority[userLevel].indexOf(b.difficulty);
      return aPriority - bPriority;
    });
};

export const getTemplateStats = async () => {
  const templates = await getAllTemplates();
  
  return {
    total: templates.length,
    byDifficulty: {
      beginner: templates.filter(t => t.difficulty === 'beginner').length,
      intermediate: templates.filter(t => t.difficulty === 'intermediate').length,
      advanced: templates.filter(t => t.difficulty === 'advanced').length,
      expert: templates.filter(t => t.difficulty === 'expert').length
    },
    byDomain: Object.keys(domainClassifications).reduce((acc, domain) => {
      acc[domain] = templates.filter(t => t.domain === domain).length;
      return acc;
    }, {} as Record<string, number>),
    byComplexity: {
      simple: templates.filter(t => t.skillLevel.complexity === 'simple').length,
      moderate: templates.filter(t => t.skillLevel.complexity === 'moderate').length,
      complex: templates.filter(t => t.skillLevel.complexity === 'complex').length,
      advanced: templates.filter(t => t.skillLevel.complexity === 'advanced').length
    }
  };
};

// ===== NEW ENHANCED FEATURES =====

// Rating System Functions
export const getTemplateRatings = (templateId: string): TemplateRating[] => {
  const ratings = localStorage.getItem(`template-ratings-${templateId}`);
  return ratings ? JSON.parse(ratings) : [];
};

export const addTemplateRating = (rating: TemplateRating): void => {
  const existingRatings = getTemplateRatings(rating.templateId);
  const newRatings = [...existingRatings, rating];
  localStorage.setItem(`template-ratings-${rating.templateId}`, JSON.stringify(newRatings));
  
  // Update template average rating
  updateTemplateAverageRating(rating.templateId);
};

export const updateTemplateAverageRating = (templateId: string): void => {
  const ratings = getTemplateRatings(templateId);
  if (ratings.length === 0) return;
  
  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  const templateRatings = getStoredTemplateRatings();
  templateRatings[templateId] = {
    rating: Math.round(averageRating * 10) / 10,
    count: ratings.length
  };
  localStorage.setItem('template-average-ratings', JSON.stringify(templateRatings));
};

export const getStoredTemplateRatings = (): Record<string, {rating: number, count: number}> => {
  const ratings = localStorage.getItem('template-average-ratings');
  return ratings ? JSON.parse(ratings) : {};
};

// Template History Functions
export const getTemplateHistory = (): TemplateHistoryEntry[] => {
  const history = localStorage.getItem('template-history');
  return history ? JSON.parse(history) : [];
};

export const addToTemplateHistory = (entry: TemplateHistoryEntry): void => {
  const history = getTemplateHistory();
  const newHistory = [entry, ...history.filter(h => 
    !(h.templateId === entry.templateId && h.action === entry.action)
  )];
  
  // Keep only last 50 entries
  const limitedHistory = newHistory.slice(0, 50);
  localStorage.setItem('template-history', JSON.stringify(limitedHistory));
};

export const getRecentlyUsedTemplates = async (limit: number = 10): Promise<Template[]> => {
  const history = getTemplateHistory();
  const recentTemplateIds = history
    .filter(entry => entry.action === 'use' || entry.action === 'copy')
    .slice(0, limit)
    .map(entry => entry.templateId);
  
  const allTemplates = await getAllTemplates();
  const customTemplates = getCustomTemplates();
  const combinedTemplates = [...allTemplates, ...customTemplates];
  
  return recentTemplateIds
    .map(id => combinedTemplates.find(t => t.id === id))
    .filter(Boolean) as Template[];
};

// Custom Template Functions
export const getCustomTemplates = (): Template[] => {
  const customTemplates = localStorage.getItem('custom-templates');
  return customTemplates ? JSON.parse(customTemplates) : [];
};

export const addCustomTemplate = (template: CustomTemplate): Template => {
  const customTemplates = getCustomTemplates();
  const newTemplate: Template = {
    ...template,
    id: generateTemplateId(),
    isCustom: true,
    createdAt: new Date().toISOString()
  };
  
  const updatedTemplates = [...customTemplates, newTemplate];
  localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));
  
  return newTemplate;
};

export const updateCustomTemplate = (templateId: string, updates: Partial<Template>): boolean => {
  const customTemplates = getCustomTemplates();
  const templateIndex = customTemplates.findIndex(t => t.id === templateId);
  
  if (templateIndex === -1) return false;
  
  customTemplates[templateIndex] = { ...customTemplates[templateIndex], ...updates };
  localStorage.setItem('custom-templates', JSON.stringify(customTemplates));
  
  return true;
};

export const deleteCustomTemplate = (templateId: string): boolean => {
  const customTemplates = getCustomTemplates();
  const filteredTemplates = customTemplates.filter(t => t.id !== templateId);
  
  if (filteredTemplates.length === customTemplates.length) return false;
  
  localStorage.setItem('custom-templates', JSON.stringify(filteredTemplates));
  return true;
};

// Template Sharing Functions
export const createTemplateShare = (templateId: string, maxAccess?: number, expiresInHours?: number): SharedTemplate => {
  const shareCode = generateShareCode();
  const sharedTemplate: SharedTemplate = {
    id: generateTemplateId(),
    templateId,
    shareCode,
    createdAt: new Date().toISOString(),
    accessCount: 0,
    maxAccess
  };
  
  if (expiresInHours) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);
    sharedTemplate.expiresAt = expiresAt.toISOString();
  }
  
  const sharedTemplates = getSharedTemplates();
  sharedTemplates.push(sharedTemplate);
  localStorage.setItem('shared-templates', JSON.stringify(sharedTemplates));
  
  return sharedTemplate;
};

export const getSharedTemplates = (): SharedTemplate[] => {
  const sharedTemplates = localStorage.getItem('shared-templates');
  return sharedTemplates ? JSON.parse(sharedTemplates) : [];
};

export const getTemplateByShareCode = async (shareCode: string): Promise<Template | null> => {
  const sharedTemplates = getSharedTemplates();
  const sharedTemplate = sharedTemplates.find(st => st.shareCode === shareCode);
  
  if (!sharedTemplate) return null;
  
  // Check if expired
  if (sharedTemplate.expiresAt && new Date(sharedTemplate.expiresAt) < new Date()) {
    return null;
  }
  
  // Check if max access reached
  if (sharedTemplate.maxAccess && sharedTemplate.accessCount >= sharedTemplate.maxAccess) {
    return null;
  }
  
  // Increment access count
  sharedTemplate.accessCount++;
  const updatedSharedTemplates = sharedTemplates.map(st => 
    st.shareCode === shareCode ? sharedTemplate : st
  );
  localStorage.setItem('shared-templates', JSON.stringify(updatedSharedTemplates));
  
  // Find the actual template
  const allTemplates = await getAllTemplates();
  const customTemplates = getCustomTemplates();
  const combinedTemplates = [...allTemplates, ...customTemplates];
  
  return combinedTemplates.find(t => t.id === sharedTemplate.templateId) || null;
};

// Utility Functions
export const generateTemplateId = (): string => {
  return 'template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const generateShareCode = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

// Enhanced Template Search with ratings and custom templates
export const getAllTemplatesEnhanced = async (): Promise<Template[]> => {
  const standardTemplates = await getAllTemplates();
  const customTemplates = getCustomTemplates();
  const ratings = getStoredTemplateRatings();
  
  const enhancedTemplates = [...standardTemplates, ...customTemplates].map(template => ({
    ...template,
    rating: ratings[template.id]?.rating,
    ratingCount: ratings[template.id]?.count
  }));
  
  return enhancedTemplates;
};

// Sync wrapper functions for backward compatibility
export const getAllTemplatesSync = (): Template[] => {
  if (templateCategories.length === 0) {
    // If not loaded yet, return empty array and trigger async load
    getTemplateCategories().then(categories => {
      templateCategories.push(...categories);
    });
    return [];
  }
  return templateCategories.flatMap(category => 
    category.subcategories.flatMap(subcategory => subcategory.templates)
  );
};

export const getTemplateByCategorySync = (categoryId: string): Template[] => {
  const category = templateCategories.find(cat => cat.id === categoryId);
  if (!category) return [];
  return category.subcategories.flatMap(subcategory => subcategory.templates);
};

export const getTemplateByDomainSync = (domain: string): Template[] => {
  return getAllTemplatesSync().filter(template => template.domain === domain);
};

export const searchTemplatesSync = (query: string): Template[] => {
  const allTemplates = getAllTemplatesSync();
  const lowercaseQuery = query.toLowerCase();
  
  return allTemplates.filter(template => 
    template.title.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    template.useCase.toLowerCase().includes(lowercaseQuery) ||
    template.domain.toLowerCase().includes(lowercaseQuery)
  );
};

export const getTemplateByIdSync = (templateId: string): Template | undefined => {
  const allTemplates = getAllTemplatesSync();
  const customTemplates = getCustomTemplates();
  const combinedTemplates = [...allTemplates, ...customTemplates];
  return combinedTemplates.find(t => t.id === templateId);
};

export const getRecentlyUsedTemplatesSync = (limit: number = 10): Template[] => {
  const history = getTemplateHistory();
  const recentTemplateIds = history
    .filter(entry => entry.action === 'use' || entry.action === 'copy')
    .slice(0, limit)
    .map(entry => entry.templateId);
  
  const allTemplates = getAllTemplatesSync();
  const customTemplates = getCustomTemplates();
  const combinedTemplates = [...allTemplates, ...customTemplates];
  
  return recentTemplateIds
    .map(id => combinedTemplates.find(t => t.id === id))
    .filter(Boolean) as Template[];
};

export const getAllTemplatesEnhancedSync = (): Template[] => {
  const standardTemplates = getAllTemplatesSync();
  const customTemplates = getCustomTemplates();
  const ratings = getStoredTemplateRatings();
  
  const enhancedTemplates = [...standardTemplates, ...customTemplates].map(template => ({
    ...template,
    rating: ratings[template.id]?.rating,
    ratingCount: ratings[template.id]?.count
  }));
  
  return enhancedTemplates;
};

// Legacy exports for backward compatibility (use sync versions by default)
export const getAllTemplates_LEGACY = getAllTemplatesSync;
export const searchTemplates_LEGACY = searchTemplatesSync;
export const getTemplatesByDomain_LEGACY = getTemplateByDomainSync;

// Initialize templates on module load (for better performance)
getTemplateCategories().then(categories => {
  templateCategories.push(...categories);
}).catch(error => {
  console.error('Failed to initialize template categories:', error);
}); 