import { useEffect, useMemo, useState } from 'react';

// Simplified interface for now
export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  rating?: number;
  description?: string;
  author?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  complexity?: 'simple' | 'moderate' | 'complex' | 'advanced';
  timeRequired?: 'quick' | 'medium' | 'long' | 'extensive';
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'usage' | 'rating' | 'difficulty';

export const usePromptLibrary = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = () => {
    try {
      const savedPrompts = localStorage.getItem('prompt-library');
      if (savedPrompts) {
        const parsed = JSON.parse(savedPrompts);
        setPrompts(parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          usageCount: p.usageCount || 0,
        })));
      }
    } catch (error) {
      console.error("Failed to load prompts from localStorage", error);
      // Here you might want to use a toast notification if available
    }
  };

  const savePrompts = (newPrompts: Prompt[]) => {
    try {
      localStorage.setItem('prompt-library', JSON.stringify(newPrompts));
      setPrompts(newPrompts);
    } catch (error) {
      console.error("Failed to save prompts to localStorage", error);
    }
  };

  const allTags = useMemo(() => {
    const tags = prompts.flatMap(prompt => prompt.tags);
    return [...new Set(tags)].sort();
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      const matchesSearch = searchTerm === '' ||
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => prompt.tags.includes(tag));
      
      const matchesDifficulty = selectedDifficulty === 'all' || prompt.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesTags && matchesDifficulty;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'usage':
          return (b.usageCount || 0) - (a.usageCount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };
          return (difficultyOrder[a.difficulty || 'beginner'] || 1) - (difficultyOrder[b.difficulty || 'beginner'] || 1);
        default:
          return 0;
      }
    });
  }, [prompts, searchTerm, selectedCategory, selectedTags, selectedDifficulty, sortBy]);

  return {
    prompts,
    setPrompts: savePrompts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedTags,
    setSelectedTags,
    selectedDifficulty,
    setSelectedDifficulty,
    sortBy,
    setSortBy,
    allTags,
    filteredPrompts
  };
}; 