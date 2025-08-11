import React, { useState } from 'react';
import { FiCopy, FiEdit, FiPlus, FiSave, FiSearch, FiTag, FiTrash2, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import useAccessControl from '../hooks/useAccessControl';
import { Prompt, usePromptLibrary } from '../hooks/usePromptLibrary';
import './PromptLibrary.redesigned.css';

const PromptLibrary: React.FC = () => {
  const { 
    prompts, 
    setPrompts,
    searchTerm,
    setSearchTerm,
    filteredPrompts,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    sortBy,
    setSortBy
  } = usePromptLibrary();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    isFavorite: false,
    description: '',
    author: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    complexity: 'simple' as 'simple' | 'moderate' | 'complex' | 'advanced',
    timeRequired: 'quick' as 'quick' | 'medium' | 'long' | 'extensive'
  });

  const { t } = useLanguage();
  const { addToast } = useToast();
  const { checkAccess } = useAccessControl();
  const navigate = useNavigate();
  // const isPremium = hasPremiumAccess();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      addToast(t('messages.titleContentRequired', 'Title and content are required'), 'error');
      return;
    }

    // Check access for difficulty level
    if (!checkAccess(formData.difficulty)) {
      addToast('Creating advanced prompts requires Premium subscription', 'warning');
      // Navigate to premium page after a short delay
      setTimeout(() => {
        navigate('/premium');
      }, 1500);
      return;
    }

    const now = new Date();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    if (editingPrompt) {
      // Update existing prompt
      const updatedPrompts = prompts.map(p => 
        p.id === editingPrompt.id 
          ? { ...p, ...formData, tags: tagsArray, updatedAt: now }
          : p
      );
      setPrompts(updatedPrompts);
      addToast(t('messages.promptSaved', 'Prompt updated successfully!'), 'success');
    } else {
      // Add new prompt
      const newPrompt: Prompt = {
        id: Date.now().toString(),
        ...formData,
        tags: tagsArray,
        createdAt: now,
        updatedAt: now,
        usageCount: 0
      };
      setPrompts([...prompts, newPrompt]);
      addToast(t('messages.promptSaved', 'Prompt saved successfully!'), 'success');
    }
    
    resetForm();
    setIsModalOpen(false);
    setEditingPrompt(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'general',
      tags: '',
      isFavorite: false,
      description: '',
      author: '',
      difficulty: 'beginner',
      complexity: 'simple',
      timeRequired: 'quick'
    });
    setEditingPrompt(null);
    setIsModalOpen(false);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setFormData({
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags.join(', '),
      isFavorite: prompt.isFavorite,
      description: prompt.description || '',
      author: prompt.author || '',
      difficulty: prompt.difficulty || 'beginner',
      complexity: prompt.complexity || 'simple',
      timeRequired: prompt.timeRequired || 'quick'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (promptId: string) => {
    if (confirm(t('messages.deleteConfirm', 'Are you sure you want to delete this prompt?'))) {
      const updatedPrompts = prompts.filter(prompt => prompt.id !== promptId);
      setPrompts(updatedPrompts);
      addToast(t('messages.promptDeleted', 'Prompt deleted successfully!'), 'success');
    }
  };

  const handleCopy = (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.content);
    // Increment usage count
    const updatedPrompts = prompts.map(p => 
      p.id === prompt.id ? { ...p, usageCount: p.usageCount + 1 } : p
    );
    setPrompts(updatedPrompts);
    addToast(t('messages.promptCopied', 'Prompt copied to clipboard!'), 'success');
  };

  const handleSendToGenerator = (prompt: Prompt) => {
    try {
      // Create template object for AI Generator
      const libraryTemplate = {
        title: prompt.title,
        domain: prompt.category,
        difficulty: prompt.difficulty || 'intermediate',
        description: prompt.description || `Personal prompt: ${prompt.title}`,
        prompt: prompt.content,
        source: 'prompt-library',
        tags: prompt.tags,
        author: prompt.author || 'You',
        usageCount: prompt.usageCount,
        createdAt: prompt.createdAt,
        isFavorite: prompt.isFavorite
      };
      
      // Save to localStorage for AI Generator
      localStorage.setItem('selectedTemplate', JSON.stringify(libraryTemplate));
      
      // Show success message
      addToast('✅ Prompt sent to AI Generator! Switch to AI Generator to use it.', 'success');
      
      // Increment usage count
      const updatedPrompts = prompts.map(p => 
        p.id === prompt.id 
          ? { ...p, usageCount: p.usageCount + 1 }
          : p
      );
      setPrompts(updatedPrompts);
      
    } catch (error) {
      console.error('Error sending prompt to generator:', error);
      addToast('Failed to send prompt to AI Generator', 'error');
    }
  };

  const renderLibraryTab = () => (
    <>
      <div className="library-controls-redesigned">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search your prompts..."
            className="search-input-redesigned"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="business">Business</option>
              <option value="creative">Creative</option>
              <option value="technical">Technical</option>
              <option value="educational">Educational</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Difficulty:</label>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="usage">Most Used</option>
              <option value="rating">Highest Rated</option>
              <option value="difficulty">Difficulty Level</option>
            </select>
          </div>
        </div>
        
        <button className="btn-primary-redesigned" onClick={() => setIsModalOpen(true)}>
          <FiPlus className="btn-icon" />
          Add New Prompt
        </button>
      </div>
      
      <div className="prompts-grid-redesigned">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((prompt) => (
            <div key={prompt.id} className="prompt-card-redesigned">
              <div className="card-header">
                <h3>{prompt.title}</h3>
                {prompt.isFavorite && <span className="favorite-badge">⭐</span>}
              </div>
              <p className="card-description">{prompt.description || 'No description available'}</p>
              
              <div className="card-meta">
                <span className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{prompt.category}</span>
                </span>
                <span className="meta-item">
                  <span className="meta-label">Difficulty:</span>
                  <span className="meta-value">{prompt.difficulty}</span>
                </span>
                {prompt.complexity && (
                  <span className="meta-item">
                    <span className="meta-label">Complexity:</span>
                    <span className="meta-value">{prompt.complexity}</span>
                  </span>
                )}
                {prompt.timeRequired && (
                  <span className="meta-item">
                    <span className="meta-label">Time:</span>
                    <span className="meta-value">{prompt.timeRequired}</span>
                  </span>
                )}
                {prompt.author && (
                  <span className="meta-item">
                    <span className="meta-label">Author:</span>
                    <span className="meta-value">{prompt.author}</span>
                  </span>
                )}
              </div>
              
              <div className="card-tags">
                {prompt.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="tag">
                    <FiTag className="tag-icon" />
                    {tag}
                  </span>
                ))}
                {prompt.tags.length > 3 && (
                  <span className="tag-more">+{prompt.tags.length - 3}</span>
                )}
              </div>
              <div className="card-footer">
                <span className="usage-count">Used {prompt.usageCount} times</span>
                <div className="prompt-card-actions">
                  <button 
                    className="action-btn-redesigned" 
                    onClick={() => handleCopy(prompt)}
                    title="Copy to clipboard"
                  >
                    <FiCopy />
                  </button>
                  <button 
                    className="action-btn-redesigned" 
                    onClick={() => handleEdit(prompt)}
                    title="Edit prompt"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    className="action-btn-redesigned send-to-generator" 
                    onClick={() => handleSendToGenerator(prompt)}
                    title="Send to AI Generator"
                  >
                    🚀
                  </button>
                  <button 
                    className="action-btn-redesigned delete" 
                    onClick={() => handleDelete(prompt.id)}
                    title="Delete prompt"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No prompts found</h3>
            <p>Start by creating your first prompt or adjust your search.</p>
            <button className="btn-primary-redesigned" onClick={() => setIsModalOpen(true)}>
              <FiPlus className="btn-icon" />
              Create First Prompt
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="prompt-library-redesigned">
      <div className="page-header-redesigned">
        <h2>My Prompts</h2>
        <p>Your personal collection of powerful and reusable prompts.</p>
      </div>

      {renderLibraryTab()}

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPrompt ? 'Edit Prompt' : 'Add New Prompt'}</h2>
              <button className="modal-close" onClick={resetForm}>
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter prompt title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  id="description"
                  type="text"
                  placeholder="Brief description of the prompt..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Content *</label>
                <textarea
                  id="content"
                  placeholder="Enter your prompt content here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="form-textarea"
                  rows={6}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  id="tags"
                  type="text"
                  placeholder="Enter tags separated by commas..."
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="general">General</option>
                    <option value="business">Business</option>
                    <option value="creative">Creative</option>
                    <option value="technical">Technical</option>
                    <option value="educational">Educational</option>
                    <option value="developer">Software Developer</option>
                    <option value="marketer">Digital Marketer</option>
                    <option value="healthcare">Healthcare Professional</option>
                    <option value="legal">Legal Professional</option>
                    <option value="finance">Financial Advisor</option>
                    <option value="sales">Sales Professional</option>
                    <option value="hr">HR Professional</option>
                    <option value="content">Content Creator</option>
                    <option value="seo">SEO Specialist</option>
                    <option value="designer">Graphic/UI/UX Designer</option>
                    <option value="analyst">Data Analyst</option>
                    <option value="researcher">Research Specialist</option>
                    <option value="teacher">Teacher/Educator</option>
                    <option value="writer">Writer/Copywriter</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="form-select"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="complexity">Complexity</label>
                  <select
                    id="complexity"
                    value={formData.complexity}
                    onChange={(e) => setFormData({ ...formData, complexity: e.target.value as any })}
                    className="form-select"
                  >
                    <option value="simple">Simple</option>
                    <option value="moderate">Moderate</option>
                    <option value="complex">Complex</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="timeRequired">Time Required</label>
                  <select
                    id="timeRequired"
                    value={formData.timeRequired}
                    onChange={(e) => setFormData({ ...formData, timeRequired: e.target.value as any })}
                    className="form-select"
                  >
                    <option value="quick">Quick (5-15 min)</option>
                    <option value="medium">Medium (15-30 min)</option>
                    <option value="long">Long (30-60 min)</option>
                    <option value="extensive">Extensive (1+ hours)</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="author">Author (Optional)</label>
                <input
                  id="author"
                  type="text"
                  placeholder="Your name or organization..."
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isFavorite}
                    onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span className="checkbox-text">Mark as favorite</span>
                </label>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FiSave className="btn-icon" />
                  {editingPrompt ? 'Update Prompt' : 'Save Prompt'}
                </button>
                {!editingPrompt && formData.title.trim() && formData.content.trim() && (
                  <button 
                    type="button" 
                    className="btn-send-to-generator"
                    onClick={() => {
                      const libraryTemplate = {
                        title: formData.title,
                        domain: formData.category,
                        difficulty: formData.difficulty,
                        description: formData.description || `Personal prompt: ${formData.title}`,
                        prompt: formData.content,
                        source: 'prompt-library-form',
                        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                        author: formData.author || 'You',
                        complexity: formData.complexity,
                        timeRequired: formData.timeRequired
                      };
                      
                      localStorage.setItem('selectedTemplate', JSON.stringify(libraryTemplate));
                      addToast('✅ Prompt sent to AI Generator! Switch to AI Generator to use it.', 'success');
                    }}
                  >
                    🚀 Send to AI Generator
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptLibrary; 