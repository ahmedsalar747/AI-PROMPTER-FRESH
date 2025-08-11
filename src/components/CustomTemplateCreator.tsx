import React, { useState } from 'react';
import { addCustomTemplate, CustomTemplate, domainClassifications } from '../data/templates';
import './CustomTemplateCreator.css';

interface CustomTemplateCreatorProps {
  onClose: () => void;
  onTemplateCreated: (template: any) => void;
}

const CustomTemplateCreator: React.FC<CustomTemplateCreatorProps> = ({ onClose, onTemplateCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Custom',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    domain: 'business' as keyof typeof domainClassifications,
    tags: '',
    useCase: '',
    estimatedOutputLength: '',
    skillLevel: {
      technical: 'low' as 'low' | 'medium' | 'high' | 'expert',
      complexity: 'simple' as 'simple' | 'moderate' | 'complex' | 'advanced',
      timeRequired: 'quick' as 'quick' | 'medium' | 'long' | 'extensive'
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    // Description validation  
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Template content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Template content must be at least 50 characters';
    } else if (formData.content.length > 5000) {
      newErrors.content = 'Template content must be less than 5000 characters';
    }

    // Use case validation
    if (!formData.useCase.trim()) {
      newErrors.useCase = 'Use case is required';
    } else if (formData.useCase.length < 10) {
      newErrors.useCase = 'Use case must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const customTemplate: CustomTemplate = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isCustom: true,
      createdAt: new Date().toISOString(),
      createdBy: 'User' // In a real app, this would be the actual user
    };

    const newTemplate = addCustomTemplate(customTemplate);
    onTemplateCreated(newTemplate);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="custom-template-modal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isPreviewMode ? '👁️ Preview Template' : '🛠️ Create Custom Template'}</h3>
          <div className="header-actions">
            <button 
              type="button" 
              className="preview-btn"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              disabled={!formData.title || !formData.content}
            >
              {isPreviewMode ? '✏️ Edit' : '👁️ Preview'}
            </button>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {isPreviewMode ? (
          <div className="template-preview">
            <div className="preview-section">
              <h4>📋 {formData.title}</h4>
              <p className="preview-description">{formData.description}</p>
              
              <div className="preview-meta">
                <span className="preview-domain">
                  {domainClassifications[formData.domain]?.icon} {domainClassifications[formData.domain]?.name}
                </span>
                <span className="preview-difficulty">
                  {formData.difficulty === 'beginner' && '🟢'} 
                  {formData.difficulty === 'intermediate' && '🟡'}
                  {formData.difficulty === 'advanced' && '🔴'}
                  {formData.difficulty === 'expert' && '🟣'} 
                  {formData.difficulty}
                </span>
              </div>

              <div className="preview-content">
                <h5>Template Content:</h5>
                <div className="content-box">
                  {formData.content}
                </div>
              </div>

              {formData.useCase && (
                <div className="preview-usecase">
                  <h5>Use Case:</h5>
                  <p>{formData.useCase}</p>
                </div>
              )}

              {formData.tags && (
                <div className="preview-tags">
                  <h5>Tags:</h5>
                  <div className="tags-list">
                    {formData.tags.split(',').map((tag, index) => (
                      <span key={index} className="tag">{tag.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="preview-actions">
              <button type="button" onClick={() => setIsPreviewMode(false)} className="cancel-btn">
                ← Back to Edit
              </button>
              <button type="button" onClick={handleSubmit} className="create-btn">
                🚀 Create Template
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="template-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Template Title * <span className="char-count">({formData.title.length}/100)</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a descriptive title"
                className={errors.title ? 'error' : ''}
                maxLength={100}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label>Domain *</label>
              <select
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
              >
                {Object.entries(domainClassifications).map(([key, domain]) => (
                  <option key={key} value={key}>
                    {domain.icon} {domain.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty Level *</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
              >
                <option value="beginner">🟢 Beginner</option>
                <option value="intermediate">🟡 Intermediate</option>
                <option value="advanced">🔴 Advanced</option>
                <option value="expert">🟣 Expert</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Description * <span className="char-count">({formData.description.length}/500)</span></label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Briefly describe what this template does"
                rows={3}
                className={errors.description ? 'error' : ''}
                maxLength={500}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group full-width">
              <label>Use Case *</label>
              <input
                type="text"
                value={formData.useCase}
                onChange={(e) => handleInputChange('useCase', e.target.value)}
                placeholder="When would someone use this template?"
                className={errors.useCase ? 'error' : ''}
              />
              {errors.useCase && <span className="error-text">{errors.useCase}</span>}
            </div>

            <div className="form-group full-width">
              <label>Template Content * <span className="char-count">({formData.content.length}/5000)</span></label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter your prompt template here. Use [PLACEHOLDER] for variables that users should replace."
                rows={8}
                className={errors.content ? 'error' : ''}
                maxLength={5000}
              />
              {errors.content && <span className="error-text">{errors.content}</span>}
              <div className="content-help">
                💡 Tip: Use [PLACEHOLDER] or {`{VARIABLE}`} for parts users should customize
              </div>
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="ai, business, strategy"
              />
            </div>

            <div className="form-group">
              <label>Expected Output Length</label>
              <input
                type="text"
                value={formData.estimatedOutputLength}
                onChange={(e) => handleInputChange('estimatedOutputLength', e.target.value)}
                placeholder="e.g., 200-500 words"
              />
            </div>

            <div className="skill-levels">
              <h4>Skill Requirements</h4>
              
              <div className="form-group">
                <label>Technical Level</label>
                <select
                  value={formData.skillLevel.technical}
                  onChange={(e) => handleInputChange('skillLevel.technical', e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="form-group">
                <label>Complexity</label>
                <select
                  value={formData.skillLevel.complexity}
                  onChange={(e) => handleInputChange('skillLevel.complexity', e.target.value)}
                >
                  <option value="simple">Simple</option>
                  <option value="moderate">Moderate</option>
                  <option value="complex">Complex</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Time Required</label>
                <select
                  value={formData.skillLevel.timeRequired}
                  onChange={(e) => handleInputChange('skillLevel.timeRequired', e.target.value)}
                >
                  <option value="quick">Quick (5-15 min)</option>
                  <option value="medium">Medium (15-30 min)</option>
                  <option value="long">Long (30-60 min)</option>
                  <option value="extensive">Extensive (1+ hour)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="create-btn">
              🚀 Create Template
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default CustomTemplateCreator; 