import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomTemplateCreator from '../components/CustomTemplateCreator';
import LoadingSpinner from '../components/LoadingSpinner';
import TemplateHistory from '../components/TemplateHistory';
import TemplateRating from '../components/TemplateRating';
import TemplateUpgradeBanner from '../components/TemplateUpgradeBanner';
import TemplateUsageCounter from '../components/TemplateUsageCounter';

import { useToast } from '../context/ToastContext';
import { Template } from '../data/templates';
import { useTemplateGallery } from '../hooks/useTemplateGallery';
import { canUseTemplate, getTemplateAccess, incrementTemplateUsage } from '../utils/templateAccess';
import './TemplateGallery.redesigned.css';

const TemplateCard: React.FC<{
  template: Template;
  onUse: (template: Template) => void;
  onCopy: (template: Template) => void;
  onSave: (template: Template) => void;
  onShare: (template: Template) => void;
  onRate: (templateId: string) => void;
  onExport: (template: Template) => void;
  isSaved: boolean;
  isCopied: boolean;
}> = ({ template, onUse, onCopy, onSave, onShare, onRate, onExport, isSaved, isCopied }) => {
  return (
    <div className="template-card-redesigned">
      <div className="template-header">
        <div className="template-meta">
          <span className="domain-badge">{template.domain}</span>
          <span className={`difficulty-badge ${template.difficulty}`}>
            {template.difficulty}
          </span>
          {template.isPremium && (
            <span className="premium-badge">⭐ Premium</span>
          )}
        </div>
        <div className="template-rating">
          {template.rating && template.rating > 0 ? (
            <div className="rating-display">
              <span className="stars">
                {'⭐'.repeat(Math.floor(template.rating))}
                {'☆'.repeat(5 - Math.floor(template.rating))}
              </span>
              <span className="rating-text">({template.ratingCount || 0})</span>
            </div>
          ) : (
            <div className="rating-display">
              <span className="stars">☆☆☆☆☆</span>
              <span className="rating-text">(0)</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="template-content">
        <h3>{template.title}</h3>
        <p>{template.description}</p>
        <div className="template-tags">
          {template.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="template-card-actions-redesigned">
        <div className="primary-actions">
          <button className="btn-primary-redesigned" onClick={() => onUse(template)}>
            Use Template
          </button>
        </div>
        <div className="secondary-actions">
          <button 
            className={`action-btn ${isCopied ? 'copied' : ''}`}
            onClick={() => onCopy(template)}
            title="Copy to clipboard"
          >
            {isCopied ? '✓' : '📄'}
          </button>
          <button 
            className={`action-btn ${isSaved ? 'saved' : ''}`}
            onClick={() => onSave(template)}
            title={isSaved ? 'Remove from saved' : 'Save template'}
          >
            {isSaved ? '🔖' : '☆'}
          </button>
          <button 
            className="action-btn"
            onClick={() => onShare(template)}
            title="Share template"
          >
            🔗
          </button>
          <button 
            className="action-btn"
            onClick={() => onRate(template.id)}
            title="Rate template"
          >
            ⭐
          </button>
          <button 
            className="action-btn"
            onClick={() => onExport(template)}
            title="Export template"
          >
            📤
          </button>
        </div>
      </div>
    </div>
  );
};

const TemplateGallery: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedDomain,
    setSelectedDomain,
    selectedDifficulty,
    setSelectedDifficulty,
    showSavedOnly,
    setShowSavedOnly,
    templatesLoading,
    domains,
    difficulties,
    filteredTemplates,
    templateStats,
    handleUseTemplate,
    handleCopyTemplate,
    handleSaveTemplate,
    handleShareTemplate,
    handleTemplateCreated,
    savedTemplates,
    copiedTemplateId,
  } = useTemplateGallery();

  const [showCustomCreator, setShowCustomCreator] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRating, setShowRating] = useState<string | null>(null);
  
  const { addToast } = useToast();
  const navigate = useNavigate();
  const access = getTemplateAccess();

  // Handle template usage with premium check
  const handleTemplateUse = (template: Template) => {
    if (!canUseTemplate()) {
      addToast('You\'ve used all free templates this month. Upgrade to continue.', 'warning');
      return;
    }
    
    // Increment usage for free users
    if (!access.isPremium) {
      incrementTemplateUsage();
    }
    
    // Proceed with template use
    handleUseTemplate(template);
  };

  // Handle upgrade
  // const handleUpgrade = () => {
  //   navigate('/premium');
  // };




  if (templatesLoading) {
    return (
      <div className="gallery-loading">
        <div className="loading-content">
          <LoadingSpinner />
          <p>Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="template-gallery-redesigned">
      {/* Usage Counter */}
      <TemplateUsageCounter />
      
      {/* Upgrade Banner */}
      <TemplateUpgradeBanner />
      
      <header className="gallery-header-redesigned">
        <div className="header-content">
          <h1>Template Gallery</h1>
          <p>Explore {templateStats.total}+ templates to kickstart your work.</p>
        </div>
        <div className="header-actions">
          <button 
            className={`header-btn ${!access.canCreateCustom ? 'locked' : ''}`}
            onClick={() => {
              if (!access.canCreateCustom) {
                addToast('Create custom templates with Premium subscription', 'warning');
                // Navigate to premium page after a short delay
                setTimeout(() => {
                  navigate('/premium');
                }, 1500);
                return;
              }
              setShowCustomCreator(true);
            }}
            title={access.canCreateCustom ? "Create custom template" : "Premium feature"}
          >
            {access.canCreateCustom ? '➕' : '🔒'} Create Template
          </button>
          <button 
            className={`header-btn ${!access.canAccessHistory ? 'locked' : ''}`}
            onClick={() => {
              if (!access.canAccessHistory) {
                addToast('View template history with Premium subscription', 'warning');
                // Navigate to premium page after a short delay
                setTimeout(() => {
                  navigate('/premium');
                }, 1500);
                return;
              }
              setShowHistory(true);
            }}
            title={access.canAccessHistory ? "View template history" : "Premium feature"}
          >
            {access.canAccessHistory ? '📚' : '🔒'} History
          </button>
        </div>
      </header>

      <div className="filters-container-redesigned">
        <div className="search-section">
          <input
            type="search"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-redesigned"
          />
          {access.canAdvancedSearch && (
            <button 
              className="advanced-search-btn"
              onClick={() => {
                addToast('Advanced search features are available for Premium users', 'info');
              }}
              title="Advanced search options"
            >
              🔍 Advanced
            </button>
          )}
        </div>
        <div className="filter-group-redesigned">
          <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)}>
            {domains.map(d => <option key={d.key} value={d.key}>{d.icon} {d.name}</option>)}
          </select>
          <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
            {difficulties.map(d => <option key={d.key} value={d.key}>{d.name}</option>)}
          </select>
          <label className="saved-filter">
            <input
              type="checkbox"
              checked={showSavedOnly}
              onChange={(e) => setShowSavedOnly(e.target.checked)}
            />
            <span>Saved Only</span>
          </label>
          {!access.canAdvancedSearch && (
            <button 
              className="upgrade-search-btn"
              onClick={() => {
                addToast('Advanced search with Premium subscription', 'warning');
                // Navigate to premium page after a short delay
                setTimeout(() => {
                  navigate('/premium');
                }, 1500);
              }}
              title="Upgrade for advanced search"
            >
              🔒 Advanced Search
            </button>
          )}
        </div>
      </div>

      <div className="templates-grid-redesigned">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={handleTemplateUse}
              onCopy={handleCopyTemplate}
              onSave={handleSaveTemplate}
              onShare={handleShareTemplate}
              onRate={(templateId) => {
                if (!access.canRate) {
                  addToast('Rate templates with Premium subscription', 'warning');
                  // Navigate to premium page after a short delay
                  setTimeout(() => {
                    navigate('/premium');
                  }, 1500);
                  return;
                }
                setShowRating(templateId);
              }}
              onExport={(template) => {
                if (!access.canExport) {
                  addToast('Export templates with Premium subscription', 'warning');
                  // Navigate to premium page after a short delay
                  setTimeout(() => {
                    navigate('/premium');
                  }, 1500);
                  return;
                }
                // TODO: Implement export functionality
                addToast(`${template.title} has been exported successfully`, 'success');
              }}

              isSaved={savedTemplates.includes(template.id)}
              isCopied={copiedTemplateId === template.id}
            />
          ))
        ) : (
          <div className="no-results">
            <div className="empty-icon">🔍</div>
            <h3>No templates found</h3>
            <p>Try adjusting your search or filters.</p>
            <button 
              className="btn-primary-redesigned"
              onClick={() => {
                setSearchTerm('');
                setSelectedDomain('all');
                setSelectedDifficulty('all');
                setShowSavedOnly(false);
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {showCustomCreator && <CustomTemplateCreator onClose={() => setShowCustomCreator(false)} onTemplateCreated={handleTemplateCreated} />}
      {showHistory && <TemplateHistory onClose={() => setShowHistory(false)} />}
      {showRating && <TemplateRating templateId={showRating} onClose={() => setShowRating(null)} />}
    </div>
  );
};

export default TemplateGallery;