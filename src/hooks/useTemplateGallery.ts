import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import {
    addToTemplateHistory,
    createTemplateShare,
    domainClassifications,
    generateTemplateId,
    getAllTemplatesEnhanced,
    getAllTemplatesEnhancedSync,
    Template,
} from '../data/templates';

// Define types locally as they are not exported from the data layer
type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
type Domain = "business" | "technology" | "marketing" | "finance" | "legal" | "healthcare" | "education" | "engineering" | "science" | "creative";

export interface CustomTemplate {
  id: string;
  title: string;
  content: string;
  category: Domain;
  difficulty: Difficulty;
  description: string;
  estimatedOutputLength: string;
  skillLevel: {
    technical: string;
    complexity: string;
    timeRequired: string;
  };
  rating: number;
  ratingCount: number;
}

export function useTemplateGallery() {
  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<string[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  // در سیستم جدید، همه سطوح دشواری رایگان هستند
  // canAccessDifficulty function حذف شد چون استفاده نمی‌شود

  // بررسی دسترسی Template برای premium templates
  const canAccessTemplate = (): boolean => {
    // اگر template از نوع custom باشه یا کاربر premium دسترسی داشته باشه
    return true;
  };

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setTemplatesLoading(true);
        
        // Load standard templates with better error handling
        let templates: Template[] = [];
        try {
          templates = await getAllTemplatesEnhanced();
        } catch (error) {
          console.error('Failed to load standard templates:', error);
          // Fallback to sync version
          try {
            templates = getAllTemplatesEnhancedSync();
          } catch (syncError) {
            console.error('Failed to load templates even with sync fallback:', syncError);
            templates = [];
          }
        }
        
        // Load custom templates with error handling
        let customTemplates: CustomTemplate[] = [];
        try {
          const customTemplatesData = localStorage.getItem('custom-templates') || '[]';
          customTemplates = JSON.parse(customTemplatesData);
        } catch (error) {
          console.error('Failed to load custom templates:', error);
          customTemplates = [];
        }
        
        const customTemplatesFormatted: Template[] = customTemplates.map((template) => ({
          ...template,
          id: `custom-${template.id || generateTemplateId()}`,
          domain: template.category,
          useCase: template.description,
          description: template.description,
          tags: ['custom', template.category],
          content: template.content,
          title: template.title,
          isCustom: true,
          estimatedOutputLength: 'Medium',
          skillLevel: {
            technical: 'low',
            complexity: 'simple',
            timeRequired: 'quick'
          },
          rating: 5.0,
          ratingCount: 1,
        }));
        
        setAllTemplates([...templates, ...customTemplatesFormatted]);
      } catch (error) {
        console.error('Failed to load templates:', error);
        setAllTemplates([]);
      } finally {
        setTemplatesLoading(false);
      }
    };
    
    loadTemplates();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('savedTemplates');
    if (saved) {
      setSavedTemplates(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
  }, [savedTemplates]);

  const domains = useMemo(() => [
    { key: 'all', name: 'All Domains', icon: '🌟' },
    ...Object.entries(domainClassifications).map(([key, domain]) => ({
      key,
      name: domain.name,
      icon: domain.icon
    }))
  ], []);

  const difficulties = useMemo(() => [
    { key: 'all', name: 'All Levels' },
    { key: 'beginner', name: 'Beginner', color: '#10B981' },
    { key: 'intermediate', name: 'Intermediate', color: '#F59E0B' },
    { key: 'advanced', name: 'Advanced', color: '#EF4444' },
    { key: 'expert', name: 'Expert', color: '#8B5CF6' }
  ], []);

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((template) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = template.title.toLowerCase().includes(searchLower) ||
                           template.description.toLowerCase().includes(searchLower) ||
                           template.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
                           template.useCase.toLowerCase().includes(searchLower);
      
      const matchesDomain = selectedDomain === 'all' || template.domain === selectedDomain;
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
      const matchesSaved = !showSavedOnly || savedTemplates.includes(template.id);
      
      return matchesSearch && matchesDomain && matchesDifficulty && matchesSaved;
    });
  }, [allTemplates, searchTerm, selectedDomain, selectedDifficulty, showSavedOnly, savedTemplates]);

  const handleUseTemplate = (template: Template) => {
    if (!canAccessTemplate()) return;

    addToTemplateHistory({ templateId: template.id, usedAt: new Date().toISOString(), action: 'use' });
    localStorage.setItem('selectedTemplate', JSON.stringify({
      content: template.content,
      prompt: template.content, // اضافه کردن فیلد prompt
      category: template.category,
      difficulty: template.difficulty,
      title: template.title,
      domain: template.domain
    }));
    addToast(`🎯 Template "${template.title}" ready! Navigate to Enhancer to use it.`, 'success');
    navigate('/enhancer');
  };

  const handleCopyTemplate = async (template: Template) => {
    if (!canAccessTemplate()) return;

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(template.content);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = template.content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
        } catch (fallbackError) {
          console.error('Fallback copy failed:', fallbackError);
          throw new Error('Copy not supported');
        } finally {
          document.body.removeChild(textArea);
        }
      }
      
      setCopiedTemplateId(template.id);
      addToTemplateHistory({ templateId: template.id, usedAt: new Date().toISOString(), action: 'copy' });
      setTimeout(() => setCopiedTemplateId(null), 2000);
      addToast('📄 Template copied to clipboard!', 'success');
      
    } catch (error) {
      console.error('Failed to copy template:', error);
      addToast('❌ Failed to copy template. Please try selecting and copying manually.', 'error');
    }
  };

  const handleSaveTemplate = (template: Template) => {
    if (!canAccessTemplate()) return;

    const isAlreadySaved = savedTemplates.includes(template.id);
    const newSavedTemplates = isAlreadySaved
      ? savedTemplates.filter(id => id !== template.id)
      : [...savedTemplates, template.id];
    
    setSavedTemplates(newSavedTemplates);
    addToTemplateHistory({
      templateId: template.id,
      usedAt: new Date().toISOString(),
      action: isAlreadySaved ? 'unsave' : 'save',
    });
    addToast(isAlreadySaved ? '🔖 Template unsaved.' : '🔖 Template saved!', 'info');
  };

  const handleShareTemplate = (template: Template) => {
    if (!canAccessTemplate()) return;

    try {
      const sharedTemplate = createTemplateShare(template.id, undefined, 24); // 24 hours
      
      // Create share URL with fallback
      let shareUrl: string;
      try {
        shareUrl = `${window.location.origin}/templates/shared/${sharedTemplate.shareCode}`;
      } catch {
        // Fallback if window.location is not available
        shareUrl = `https://your-app-domain.com/templates/shared/${sharedTemplate.shareCode}`;
      }
      
      // Try to copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        addToast('🔗 Share link copied! Valid for 24 hours.', 'success');
      }).catch(() => {
        // Fallback: show share URL in alert
        alert(`Share URL: ${shareUrl}\n\nCopy this link to share your template.`);
        addToast('🔗 Share link created! Check the alert for the URL.', 'info');
      });
      
      addToTemplateHistory({
        templateId: template.id,
        usedAt: new Date().toISOString(),
        action: 'view'
      });
      
    } catch (error) {
      console.error('Failed to create share link:', error);
      addToast('❌ Failed to create share link. Please try again.', 'error');
    }
  };
  
  const getTemplateStats = useMemo(() => {
    const total = allTemplates.length;
    const showing = filteredTemplates.length;
    const saved = savedTemplates.length;
    return { total, showing, saved };
  }, [allTemplates.length, filteredTemplates.length, savedTemplates.length]);

  const handleTemplateCreated = (newTemplate: CustomTemplate) => {
    // Generate unique ID to prevent duplicates
    const uniqueId = generateTemplateId();
    
    const formattedTemplate: Template = {
      ...newTemplate,
      id: `custom-${uniqueId}`,
      domain: newTemplate.category,
      useCase: newTemplate.description,
      tags: ['custom', newTemplate.category],
      isCustom: true,
      estimatedOutputLength: 'Medium',
      skillLevel: { technical: 'low', complexity: 'simple', timeRequired: 'quick' },
      rating: 5.0,
      ratingCount: 1,
    };
    
    // Check if template with same ID already exists
    const existingTemplate = allTemplates.find(t => t.id === formattedTemplate.id);
    if (existingTemplate) {
      addToast('⚠️ Template with similar ID already exists. Please try again.', 'warning');
      return;
    }
    
    setAllTemplates(prev => [formattedTemplate, ...prev]);
    addToast('🎉 Custom template created successfully!', 'success');
  };

  return {
    // State
    searchTerm,
    setSearchTerm,
    selectedDomain,
    setSelectedDomain,
    selectedDifficulty,
    setSelectedDifficulty,
    showSavedOnly,
    setShowSavedOnly,
    savedTemplates,
    templatesLoading,
    copiedTemplateId,
    
    // Derived state
    domains,
    difficulties,
    filteredTemplates,
    templateStats: getTemplateStats,

    // Handlers
    handleUseTemplate,
    handleCopyTemplate,
    handleSaveTemplate,
    handleShareTemplate,
    handleTemplateCreated,
  };
} 