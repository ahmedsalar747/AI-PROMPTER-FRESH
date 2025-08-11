import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import './SimpleTemplateCreator.css';

interface SimpleTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: 'beginner';
  createdAt: string;
  isCustom: boolean;
}

const SimpleTemplateCreator: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'general',
    tags: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  

  const { addToast } = useToast();
  const navigate = useNavigate();

  const categories = [
      { value: 'general', label: 'General' },
  { value: 'business', label: 'Business' },
  { value: 'creative', label: 'Creative' },
  { value: 'education', label: 'Education' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'technology', label: 'Technology' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      addToast('Template title and content are required', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const newTemplate: SimpleTemplate = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        difficulty: 'beginner',
        createdAt: new Date().toISOString(),
        isCustom: true
      };

      // Save to localStorage
      const existingTemplates = JSON.parse(localStorage.getItem('custom-templates') || '[]');
      existingTemplates.push(newTemplate);
      localStorage.setItem('custom-templates', JSON.stringify(existingTemplates));

      addToast('Template created! (Not really, this is a demo)', 'success');
      
              // Return to Templates page
      navigate('/templates');
      
    } catch {
      addToast('Failed to create template. Please check the fields.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/templates');
  };

  return (
    <div className="simple-template-creator">
      <div className="creator-header">
        <div className="header-content">
          <h1>
            <span className="header-icon">➕</span>
            Create New Template
          </h1>
                      <p>Create a simple template for your prompts</p>
        </div>
      </div>

      <div className="creator-container">
        <form onSubmit={handleSubmit} className="template-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
                              <label htmlFor="title">Template Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                                  placeholder="Example: Formal Email Writing Template"
                required
              />
            </div>

            <div className="form-group">
                              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                                  placeholder="Brief description of this template's usage..."
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                                      placeholder="email, formal, business (separate with commas)"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Template Content</h3>
            <div className="content-help">
                              <p>💡 Tip: Use the following variables for customizable parts:</p>
                <ul>
                  <li><code>{'{{name}}'}</code> - for person's name</li>
                  <li><code>{'{{subject}}'}</code> - for main topic</li>
                  <li><code>{'{{details}}'}</code> - for additional details</li>
                  <li><code>{'{{date}}'}</code> - for date</li>
                </ul>
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Prompt Content *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Example: Write a formal email for {{name}} about {{subject}} that includes {{details}}..."
                rows={8}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Template'}
            </button>
          </div>
        </form>

        <div className="preview-section">
          <h3>Preview</h3>
          <div className="template-preview">
            <div className="preview-header">
              <h4>{formData.title || 'Template Title'}</h4>
              <span className="preview-category">{categories.find(c => c.value === formData.category)?.label}</span>
            </div>
            <p className="preview-description">
              {formData.description || 'Template description...'}
            </p>
            <div className="preview-content">
              <strong>Content:</strong>
              <p>{formData.content || 'Prompt content...'}</p>
            </div>
            {formData.tags && (
              <div className="preview-tags">
                {formData.tags.split(',').map((tag, index) => (
                  <span key={index} className="preview-tag">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTemplateCreator; 