import { useEffect, useState } from 'react';
import { useApiKey } from '../context/ApiKeyContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { professionalRoles } from '../data/architectEnglishData';
import { enhancePrompt } from '../services/aiService';
import { useAccessControl } from './useAccessControl';

// Define interfaces right in the hook file for clarity and co-location
interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  roleKey: string;
  taskKey: string;
  fieldValues: Record<string, string>;
  category: string;
}

interface PromptHistory {
  id: string;
  timestamp: number;
  roleKey: string;
  taskKey: string;
  fieldValues: Record<string, string>;
  generatedPrompt: string;
  rating?: number;
  isFavorite: boolean;
}

interface AdvancedSettings {
  outputFormat: 'detailed' | 'concise' | 'bullet-points' | 'step-by-step';
  tone: 'professional' | 'casual' | 'friendly' | 'formal';
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  includeExamples: boolean;
  includeBestPractices: boolean;
  includeWarnings: boolean;
  customInstructions: string;
}

const defaultAdvancedSettings: AdvancedSettings = {
  outputFormat: 'detailed',
  tone: 'professional',
  complexity: 'intermediate',
  includeExamples: true,
  includeBestPractices: true,
  includeWarnings: false,
  customInstructions: ''
};


export const usePromptArchitect = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>(defaultAdvancedSettings);
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'build' | 'history' | 'templates' | 'analytics' | 'custom-roles' | 'marketplace' | 'branding'>('build');
  const [promptRating, setPromptRating] = useState<number>(0);

  // New state for filtering and search
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'favorites' | 'recent'>('all');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState('all');

  const { t } = useLanguage();
  const { addToast } = useToast();
  const { currentModel, getApiKey, availableModels } = useApiKey();
  const { checkAccess, closePaywall } = useAccessControl();
  
  // Mock paywall state since it's been removed from useAccessControl
  const paywallState = {
    isOpen: false,
    feature: null,
    blockedLevel: null
  };

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('promptArchitectHistory');
      if (savedHistory) setPromptHistory(JSON.parse(savedHistory));

      const savedTemplates = localStorage.getItem('promptArchitectTemplates');
      if (savedTemplates) setTemplates(JSON.parse(savedTemplates));

      const savedSettings = localStorage.getItem('promptArchitectSettings');
      if (savedSettings) setAdvancedSettings(JSON.parse(savedSettings));
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
        addToast("Could not load saved data.", "error");
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('promptArchitectHistory', JSON.stringify(promptHistory));
  }, [promptHistory]);

  useEffect(() => {
    localStorage.setItem('promptArchitectTemplates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('promptArchitectSettings', JSON.stringify(advancedSettings));
  }, [advancedSettings]);

  const handleRoleSelect = (roleKey: string) => {
    setSelectedRole(roleKey);
    setSelectedTask(null);
    setFieldValues({});
    setGeneratedPrompt('');
    setPromptRating(0);
  };

  const handleTaskSelect = (task: any) => {
    const hasAccess = checkAccess(task.difficulty);
    if (hasAccess) {
      setSelectedTask(task);
      setFieldValues({});
      setGeneratedPrompt('');
      setPromptRating(0);
    }
  };

  const handleFieldChange = (fieldKey: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [fieldKey]: value }));
  };

  const generatePrompt = async () => {
    if (!selectedRole || !selectedTask) return;
    
    const requiredFields = selectedTask.fields;
    const missingFields = requiredFields.filter((field: string) => !fieldValues[field]?.trim());
    
    if (missingFields.length > 0) {
      addToast(t('messages.fillRequired', 'Please fill all required fields'), 'error');
      return;
    }

    const apiKey = getApiKey(currentModel);
    const currentModelInfo = availableModels.find(m => m.id === currentModel);
    
    if (!currentModelInfo) {
      addToast('No AI model selected. Please configure a model in settings.', 'error');
      return;
    }
    
    if (currentModelInfo.provider !== 'Ollama' && !apiKey) {
      addToast(`Please set ${currentModelInfo.provider} API key in settings`, 'error');
      return;
    }

    setIsGenerating(true);
    try {
        const roleName = t(professionalRoles[selectedRole as keyof typeof professionalRoles].nameKey, selectedRole);
        const taskName = t(selectedTask.nameKey, selectedTask.key);
        
        const promptText = `
          As an expert ${roleName}, I need to perform the following task: ${taskName}.
          
          Details:
          ${Object.entries(fieldValues).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
  
          Advanced Settings:
          - Output Format: ${advancedSettings.outputFormat}
          - Tone: ${advancedSettings.tone}
          - Complexity: ${advancedSettings.complexity}
          ${advancedSettings.includeExamples ? '- Include examples in the output.' : ''}
          ${advancedSettings.includeBestPractices ? '- Include best practices where applicable.' : ''}
          ${advancedSettings.includeWarnings ? '- Include warnings about potential pitfalls.' : ''}
          ${advancedSettings.customInstructions ? `Custom Instructions: ${advancedSettings.customInstructions}` : ''}
        `;
        
        // 🔍 NEW: Detect if this is a personal API key
        const isPersonalApiKey = !!apiKey && apiKey.length > 20 && !apiKey.includes('your-api-key');
        if (!isPersonalApiKey) {
          throw new Error('API key required. Please enter your personal API key in Settings.');
        }
        
        const enhanced = await enhancePrompt({ 
          userPrompt: promptText, 
          apiKey: apiKey!, 
          modelId: currentModel, 
          language: 'en' 
        });
        setGeneratedPrompt(enhanced);
  
        const newHistoryItem: PromptHistory = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          roleKey: selectedRole,
          taskKey: selectedTask.key,
          fieldValues: { ...fieldValues },
          generatedPrompt: enhanced,
          isFavorite: false
        };
        setPromptHistory([newHistoryItem, ...promptHistory]);

        // 🔗 NEW: Send to PromptEnhancer
        const architectTemplate = {
          title: `${roleName} - ${taskName}`,
          domain: selectedRole,
          difficulty: advancedSettings.complexity,
          description: `Generated by Manual Builder: ${roleName} performing ${taskName}`,
          prompt: enhanced,
          source: 'manual-builder',
          roleKey: selectedRole,
          taskKey: selectedTask.key,
          fieldValues: { ...fieldValues },
          advancedSettings: { ...advancedSettings }
        };
        
        localStorage.setItem('selectedTemplate', JSON.stringify(architectTemplate));
        addToast('✅ Prompt sent to AI Generator! Switch to AI Generator to use it.', 'success');
  
      } catch {
        setIsGenerating(false);
        addToast(t('messages.generateError', 'Error generating prompt'), 'error');
      }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast(t('messages.copied', 'Copied to clipboard!'), 'success');
  };

  const saveAsTemplate = () => {
    if (!selectedRole || !selectedTask || !generatedPrompt) return;
    const templateName = prompt("Enter a name for this template:");
    if (templateName) {
      const newTemplate: PromptTemplate = {
        id: Date.now().toString(),
        name: templateName,
        description: `${t(professionalRoles[selectedRole as keyof typeof professionalRoles].nameKey)} - ${t(selectedTask.nameKey)}`,
        roleKey: selectedRole,
        taskKey: selectedTask.key,
        fieldValues: { ...fieldValues },
        category: 'uncategorized'
      };
      setTemplates([...templates, newTemplate]);
      addToast(t('messages.templateSaved', 'Template saved successfully!'), 'success');
    }
  };

  const loadTemplate = (template: PromptTemplate) => {
    setSelectedRole(template.roleKey);
    setSelectedTask(professionalRoles[template.roleKey as keyof typeof professionalRoles].tasks.find(t => t.key === template.taskKey));
    setFieldValues(template.fieldValues);
    setActiveTab('build');
    addToast(t('messages.templateLoaded', 'Template loaded.'), 'info');
  };

  const ratePrompt = (rating: number) => {
    setPromptRating(rating);
    const updatedHistory = promptHistory.map(item => 
      item.generatedPrompt === generatedPrompt ? { ...item, rating } : item
    );
    setPromptHistory(updatedHistory);
  };

  const toggleFavorite = (historyId: string) => {
    const updatedHistory = promptHistory.map(item =>
      item.id === historyId ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setPromptHistory(updatedHistory);
  };

  const deleteHistoryItem = (historyId: string) => {
    const updatedHistory = promptHistory.filter(item => item.id !== historyId);
    setPromptHistory(updatedHistory);
    addToast('History item deleted.', 'info');
  };

  const filteredRoles = Object.entries(professionalRoles).filter(([roleKey, role]) => {
    const matchesSearch = searchQuery === '' || 
      t(role.nameKey, roleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(role.description).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const currentRole = selectedRole ? professionalRoles[selectedRole as keyof typeof professionalRoles] : null;

  // Filtered history based on search and filter
  const filteredHistory = promptHistory.filter(item => {
    const matchesSearch = historySearchQuery === '' || 
      item.roleKey.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      item.taskKey.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      item.generatedPrompt.toLowerCase().includes(historySearchQuery.toLowerCase());
    
    const matchesFilter = historyFilter === 'all' || 
      (historyFilter === 'favorites' && item.isFavorite) ||
      (historyFilter === 'recent' && Date.now() - item.timestamp < 7 * 24 * 60 * 60 * 1000); // Last 7 days
    
    return matchesSearch && matchesFilter;
  });

  // Filtered templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = templateSearchQuery === '' || 
      template.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(templateSearchQuery.toLowerCase());
    
    const matchesCategory = templateCategoryFilter === 'all' || 
      template.category === templateCategoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return {
    selectedRole,
    setSelectedRole,
    selectedTask,
    setSelectedTask,
    fieldValues,
    setFieldValues,
    generatedPrompt,
    setGeneratedPrompt,
    isGenerating,
    showAdvancedSettings,
    advancedSettings,
    promptHistory,
    setPromptHistory,
    templates,
    searchQuery,
    selectedDifficulty,
    activeTab,
    promptRating,
    handleRoleSelect,
    handleTaskSelect,
    handleFieldChange,
    generatePrompt,
    copyToClipboard,
    saveAsTemplate,
    loadTemplate,
    ratePrompt,
    toggleFavorite,
    deleteHistoryItem,
    filteredRoles,
    currentRole,
    paywallState,
    closePaywall,
    checkAccess,
    setActiveTab,
    setShowAdvancedSettings,
    setSearchQuery,
    setSelectedDifficulty,
    setAdvancedSettings,
    // New filtered data
    filteredHistory,
    filteredTemplates,
    // New state setters
    historySearchQuery,
    setHistorySearchQuery,
    historyFilter,
    setHistoryFilter,
    templateSearchQuery,
    setTemplateSearchQuery,
    templateCategoryFilter,
    setTemplateCategoryFilter,
    setTemplates
  };
}; 