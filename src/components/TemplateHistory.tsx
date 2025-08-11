import React, { useEffect, useState } from 'react';
import {
    getRecentlyUsedTemplatesSync,
    getTemplateByIdSync,
    getTemplateHistory,
    Template,
    TemplateHistoryEntry
} from '../data/templates';
import './TemplateHistory.css';

interface TemplateHistoryProps {
  onTemplateSelect?: (template: Template) => void;
  onClose?: () => void;
}

const TemplateHistory: React.FC<TemplateHistoryProps> = ({ onTemplateSelect, onClose }) => {
  const [history, setHistory] = useState<TemplateHistoryEntry[]>([]);
  const [recentTemplates, setRecentTemplates] = useState<Template[]>([]);
  const [filter, setFilter] = useState<'all' | 'view' | 'copy' | 'use' | 'save'>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyData = getTemplateHistory();
    const recentData = getRecentlyUsedTemplatesSync(10);
    
    setHistory(historyData);
    setRecentTemplates(recentData);
  };

  const filteredHistory = history.filter(entry => 
    filter === 'all' || entry.action === filter
  );

  const getActionIcon = (action: string) => {
    const icons = {
      view: '👁️',
      copy: '📄',
      use: '📋',
      save: '🔖',
      unsave: '🗑️'
    };
    return icons[action as keyof typeof icons] || '📝';
  };

  const getActionText = (action: string) => {
    const texts = {
      view: 'Viewed',
      copy: 'Copied',
      use: 'Used',
      save: 'Saved',
      unsave: 'Unsaved'
    };
    return texts[action as keyof typeof texts] || action;
  };

  const getActionColor = (action: string) => {
    const colors = {
      view: '#6b7280',
      copy: '#3b82f6',
      use: '#10b981',
      save: '#f59e0b',
      unsave: '#ef4444'
    };
    return colors[action as keyof typeof colors] || '#6b7280';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getTemplateById = (templateId: string): Template | undefined => {
    return getTemplateByIdSync(templateId);
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your template history?')) {
      localStorage.removeItem('template-history');
      setHistory([]);
      setRecentTemplates([]);
    }
  };

  return (
    <div className="template-history">
      <div className="history-header">
        <h3>📚 Template History</h3>
        <div className="header-actions">
          <button className="clear-history-btn" onClick={clearHistory}>
            🗑️ Clear History
          </button>
          {onClose && (
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Recently Used Templates */}
      {recentTemplates.length > 0 && (
        <div className="recent-templates-section">
          <h4>🔥 Recently Used Templates</h4>
          <div className="recent-templates-grid">
            {recentTemplates.map((template, index) => (
              <div
                key={`recent-${template.id}-${index}`}
                className="recent-template-card"
                onClick={() => onTemplateSelect && onTemplateSelect(template)}
              >
                <div className="recent-template-header">
                  <span className="template-domain-badge"
                        style={{ backgroundColor: `var(--domain-${template.domain})` }}>
                    {template.domain}
                  </span>
                  <span className="template-difficulty">{template.difficulty}</span>
                </div>
                <h5 className="recent-template-title">{template.title}</h5>
                <p className="recent-template-description">
                  {template.description.substring(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Filter */}
      <div className="history-filters">
        <h4>📋 Activity History</h4>
        <div className="filter-buttons">
          {['all', 'view', 'copy', 'use', 'save'].map((filterType) => (
            <button
              key={filterType}
              className={`filter-btn ${filter === filterType ? 'active' : ''}`}
              onClick={() => setFilter(filterType as any)}
            >
              {getActionIcon(filterType)} {filterType === 'all' ? 'All' : getActionText(filterType)}
            </button>
          ))}
        </div>
      </div>

      {/* History Timeline */}
      <div className="history-timeline">
        {filteredHistory.length === 0 ? (
          <div className="empty-history">
            <p>No {filter === 'all' ? '' : filter} history found.</p>
            <p className="empty-subtitle">Start using templates to see your activity here!</p>
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map((entry, index) => {
              const template = getTemplateById(entry.templateId);
              if (!template) return null;

              return (
                <div
                  key={`${entry.templateId}-${entry.action}-${entry.usedAt}-${index}`}
                  className="history-item"
                  onClick={() => onTemplateSelect && onTemplateSelect(template)}
                >
                  <div className="history-icon" style={{ color: getActionColor(entry.action) }}>
                    {getActionIcon(entry.action)}
                  </div>
                  
                  <div className="history-content">
                    <div className="history-main">
                      <span className="history-action" style={{ color: getActionColor(entry.action) }}>
                        {getActionText(entry.action)}
                      </span>
                      <strong className="template-name">{template.title}</strong>
                    </div>
                    
                    <div className="history-meta">
                      <span className="template-category">{template.domain}</span>
                      <span className="history-time">{formatDate(entry.usedAt)}</span>
                    </div>
                    
                    {template.description && (
                      <p className="template-preview">
                        {template.description.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                  
                  <div className="template-quick-info">
                    <span className={`difficulty-badge difficulty-${template.difficulty}`}>
                      {template.difficulty}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Statistics */}
      {history.length > 0 && (
        <div className="history-stats">
          <h4>📊 Your Stats</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{history.length}</span>
              <span className="stat-label">Total Actions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{recentTemplates.length}</span>
              <span className="stat-label">Templates Used</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {history.filter(h => h.action === 'copy').length}
              </span>
              <span className="stat-label">Templates Copied</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {history.filter(h => h.action === 'save').length}
              </span>
              <span className="stat-label">Templates Saved</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateHistory; 