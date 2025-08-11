import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { hasPremiumAccess } from '../utils/templateAccess';
import './TemplateMarketplace.css';

interface MarketplaceTemplate {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  rating: number;
  reviews: number;
  downloads: number;
  createdAt: number;
  updatedAt: number;
  promptContent: string;
  fields: TemplateField[];
  price: number; // 0 for free
  isPremium: boolean;
  isVerified: boolean;
  likes: number;
  screenshots?: string[];
  demo?: string;
}

interface TemplateField {
  id: string;
  key: string;
  displayName: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'file' | 'number' | 'date';
  required: boolean;
  placeholder: string;
  options?: string[];
}

// interface TemplateReview {
//   id: string;
//   templateId: string;
//   userId: string;
//   userName: string;
//   userAvatar?: string;
//   rating: number;
//   comment: string;
//   createdAt: number;
//   helpful: number;
// }

const TemplateMarketplace: React.FC = () => {
  // const { t } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<MarketplaceTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<MarketplaceTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MarketplaceTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'downloads'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  // const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Handler for upload form toggle
  const handleUploadFormToggle = () => {
    setShowUploadForm(!showUploadForm);
  };

  // Mock data - should come from API in production
  const mockTemplates: MarketplaceTemplate[] = [
    {
      id: '1',
      title: 'Social Media Content Creator',
      description: 'Create engaging social media posts for various platforms with customizable tone and style',
      author: 'Sarah Johnson',
      authorAvatar: '👩‍💼',
      category: 'marketing',
      tags: ['social media', 'content', 'marketing', 'engagement'],
      difficulty: 'beginner',
      rating: 4.8,
      reviews: 156,
      downloads: 2340,
      likes: 890,
      createdAt: Date.now() - 86400000 * 30,
      updatedAt: Date.now() - 86400000 * 5,
      promptContent: 'Create a social media post for {platform} about {topic} with {tone} tone...',
      fields: [
        { id: '1', key: 'platform', displayName: 'Platform', type: 'select', required: true, placeholder: 'Select platform', options: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook'] },
        { id: '2', key: 'topic', displayName: 'Topic', type: 'text', required: true, placeholder: 'What is your post about?' },
        { id: '3', key: 'tone', displayName: 'Tone', type: 'select', required: true, placeholder: 'Select tone', options: ['Professional', 'Casual', 'Funny', 'Inspirational'] }
      ],
      price: 0,
      isPremium: false,
      isVerified: true
    },
    {
      id: '2',
      title: 'Technical Documentation Generator',
      description: 'Generate comprehensive technical documentation for APIs, libraries, and software projects',
      author: 'Ahmad Al-Rashid',
      authorAvatar: '👨‍💻',
      category: 'development',
      tags: ['documentation', 'technical', 'API', 'software'],
      difficulty: 'advanced',
      rating: 4.9,
      reviews: 89,
      downloads: 1560,
      likes: 445,
      createdAt: Date.now() - 86400000 * 15,
      updatedAt: Date.now() - 86400000 * 2,
      promptContent: 'Create technical documentation for {project_type} named {project_name}...',
      fields: [
        { id: '1', key: 'project_type', displayName: 'Project Type', type: 'select', required: true, placeholder: 'Select type', options: ['API', 'Library', 'Framework', 'Tool'] },
        { id: '2', key: 'project_name', displayName: 'Project Name', type: 'text', required: true, placeholder: 'Enter project name' },
        { id: '3', key: 'features', displayName: 'Key Features', type: 'textarea', required: true, placeholder: 'List the main features...' }
      ],
      price: 5,
      isPremium: true,
      isVerified: true
    },
    {
      id: '3',
      title: 'Email Marketing Campaign',
      description: 'Design compelling email marketing campaigns with A/B testing suggestions',
      author: 'Maria Rodriguez',
      authorAvatar: '👩‍🎨',
      category: 'marketing',
      tags: ['email', 'marketing', 'campaigns', 'conversion'],
      difficulty: 'intermediate',
      rating: 4.6,
      reviews: 203,
      downloads: 3450,
      likes: 1200,
      createdAt: Date.now() - 86400000 * 45,
      updatedAt: Date.now() - 86400000 * 10,
      promptContent: 'Create an email marketing campaign for {campaign_goal} targeting {audience}...',
      fields: [
        { id: '1', key: 'campaign_goal', displayName: 'Campaign Goal', type: 'select', required: true, placeholder: 'Select goal', options: ['Lead Generation', 'Sales', 'Retention', 'Awareness'] },
        { id: '2', key: 'audience', displayName: 'Target Audience', type: 'text', required: true, placeholder: 'Describe your target audience' },
        { id: '3', key: 'budget', displayName: 'Budget Range', type: 'select', required: false, placeholder: 'Select budget', options: ['$0-500', '$500-2000', '$2000-5000', '$5000+'] }
      ],
      price: 0,
      isPremium: false,
      isVerified: false
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🌐' },
    { value: 'marketing', label: 'Marketing', icon: '📈' },
    { value: 'development', label: 'Development', icon: '💻' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'creative', label: 'Creative', icon: '🎨' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'finance', label: 'Finance', icon: '💰' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner', color: '#10B981' },
    { value: 'intermediate', label: 'Intermediate', color: '#F59E0B' },
    { value: 'advanced', label: 'Advanced', color: '#EF4444' },
    { value: 'expert', label: 'Expert', color: '#8B5CF6' }
  ];

  useEffect(() => {
    // In production, API call would be made here
    setTemplates(mockTemplates);
    setFilteredTemplates(mockTemplates);
  }, []);

  useEffect(() => {
    const filtered = templates.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'popular':
        default:
          return (b.downloads + b.likes) - (a.downloads + a.likes);
      }
    });

    setFilteredTemplates(filtered);
  }, [templates, searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const handleDownload = (template: MarketplaceTemplate) => {
    if (template.isPremium && template.price > 0) {
      // Check if user has premium access
      if (!hasPremiumAccess()) {
        addToast('This template requires Premium subscription', 'warning');
        // Navigate to premium page after a short delay
        setTimeout(() => {
          navigate('/premium');
        }, 1500);
        return;
      }
    }
    
    // Handle download (free or premium user)
    addToast(`"${template.title}" has been downloaded successfully!`, 'success');
    
    // Update download count
    setTemplates(prev => prev.map(t => 
      t.id === template.id ? { ...t, downloads: t.downloads + 1 } : t
    ));
  };

  const handleLike = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, likes: t.likes + 1 } : t
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  const TemplateCard: React.FC<{ template: MarketplaceTemplate }> = ({ template }) => (
    <div className="template-card" onClick={() => setSelectedTemplate(template)}>
      <div className="template-header">
        <div className="template-meta">
          <span className="author">
            <span className="author-avatar">{template.authorAvatar}</span>
            {template.author}
          </span>
          {template.isVerified && <span className="verified-badge">✅</span>}
          {template.isPremium && <span className="premium-badge">✨</span>}
        </div>
        <div className="template-actions">
          <button 
            onClick={(e) => { e.stopPropagation(); handleLike(template.id); }}
            className="like-button"
          >
            ❤️ {template.likes}
          </button>
        </div>
      </div>

      <div className="template-content">
        <h3 className="template-title">{template.title}</h3>
        <p className="template-description">{template.description}</p>
        
        <div className="template-tags">
          {template.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
          {template.tags.length > 3 && <span className="tag-more">+{template.tags.length - 3}</span>}
        </div>
      </div>

      <div className="template-footer">
        <div className="template-stats">
          <div className="rating">
            {renderStars(template.rating)}
            <span className="rating-value">{template.rating}</span>
            <span className="reviews">({template.reviews})</span>
          </div>
          <div className="downloads">📥 {template.downloads.toLocaleString()}</div>
        </div>
        
        <div className="template-info">
          <span className={`difficulty difficulty-${template.difficulty}`}>
            {template.difficulty}
          </span>
          <span className="price">
            {template.price === 0 ? 'Free' : `$${template.price}`}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="template-marketplace">
      <div className="marketplace-header">
        <div className="header-content">
          <h2>🏪 Template Marketplace</h2>
          <p>Discover and share amazing prompt templates with the community</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={handleUploadFormToggle}
            className="upload-button"
          >
            📤 Share Template
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search templates, tags, or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
          >
            🔍 Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="popular">🔥 Most Popular</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="newest">🆕 Newest</option>
                <option value="downloads">📥 Most Downloaded</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="results-section">
        <div className="results-header">
          <span className="results-count">
            {filteredTemplates.length} templates found
          </span>
          <div className="view-toggle">
            <button className="view-btn active">📋 Grid</button>
            <button className="view-btn">📝 List</button>
          </div>
        </div>

        <div className="templates-grid">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No templates found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="modal-overlay" onClick={() => setSelectedTemplate(null)}>
          <div className="template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="template-info">
                <h3>{selectedTemplate.title}</h3>
                <div className="author-info">
                  <span className="author-avatar">{selectedTemplate.authorAvatar}</span>
                  <span className="author-name">{selectedTemplate.author}</span>
                  {selectedTemplate.isVerified && <span className="verified-badge">✅</span>}
                </div>
              </div>
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="close-button"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="template-description">
                <p>{selectedTemplate.description}</p>
              </div>

              <div className="template-details">
                <div className="detail-item">
                  <strong>Category:</strong> 
                  <span className="category-badge">
                    {categories.find(c => c.value === selectedTemplate.category)?.icon}
                    {categories.find(c => c.value === selectedTemplate.category)?.label}
                  </span>
                </div>
                
                <div className="detail-item">
                  <strong>Difficulty:</strong>
                  <span className={`difficulty difficulty-${selectedTemplate.difficulty}`}>
                    {selectedTemplate.difficulty}
                  </span>
                </div>

                <div className="detail-item">
                  <strong>Fields:</strong>
                  <span>{selectedTemplate.fields.length} input fields</span>
                </div>

                <div className="detail-item">
                  <strong>Rating:</strong>
                  <div className="rating-detail">
                    {renderStars(selectedTemplate.rating)}
                    <span>{selectedTemplate.rating}/5 ({selectedTemplate.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="template-tags">
                {selectedTemplate.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>

              <div className="template-preview">
                <h4>Preview Fields:</h4>
                <div className="fields-preview">
                  {selectedTemplate.fields.map(field => (
                    <div key={field.id} className="field-preview">
                      <label>{field.displayName} {field.required && '*'}</label>
                      <div className="field-type">{field.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="price-info">
                {selectedTemplate.price === 0 ? (
                  <span className="free-badge">Free</span>
                ) : (
                  <span className="price-badge">${selectedTemplate.price}</span>
                )}
              </div>
              <div className="modal-actions">
                <button 
                  onClick={() => handleLike(selectedTemplate.id)}
                  className="like-button-large"
                >
                  ❤️ Like ({selectedTemplate.likes})
                </button>
                <button 
                  onClick={() => handleDownload(selectedTemplate)}
                  className="download-button"
                >
                  {selectedTemplate.price === 0 ? '📥 Download' : '💳 Purchase & Download'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateMarketplace; 