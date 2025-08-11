import React from 'react';
import ApiTestButton from '../components/ApiTestButton';
import BrandingCustomizer from '../components/BrandingCustomizer';
import CustomRoleBuilder from '../components/CustomRoleBuilder';

import TemplateMarketplace from '../components/TemplateMarketplace';
import { usePromptArchitect } from '../hooks/usePromptArchitect';
import './PromptArchitect.redesigned.css';

// Note: All logic and state are now in the usePromptArchitect hook.
// This component is now purely for rendering the UI based on the hook's state.

const PromptArchitect: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
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
    handleRoleSelect,
    handleTaskSelect,
    handleFieldChange,
    generatePrompt,
    copyToClipboard,
    saveAsTemplate,
    loadTemplate,
    // ratePrompt,
    toggleFavorite,
    deleteHistoryItem,
    filteredRoles,
    currentRole,
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
    // Advanced settings
    setShowAdvancedSettings,
    setAdvancedSettings,
    setTemplates,
  } = usePromptArchitect();

  // Create prompt text for free API
  const createPromptForFreeApi = (): string => {
    if (!selectedRole || !selectedTask) return '';
    
    const roleName = selectedRole;
    const taskName = selectedTask.key || 'task';
    
    return `As an expert ${roleName}, I need to perform the following task: ${taskName}.
    
Details:
${Object.entries(fieldValues).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Please provide a professional and comprehensive response.`;
  };

  // Get available tasks for selected role
  const getAvailableTasks = () => {
    if (!selectedRole || !currentRole) return [];
    return currentRole.tasks || [];
  };

  // Temporary render function until we break this down further
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'build':
        return (
          <div className="build-tab-content">
            <div className="build-section">
              <h3>🏗️ Prompt Builder</h3>
              <p>Build professional prompts step by step with guided assistance.</p>
            </div>
            
            <div className="builder-steps">
              <div className="step-card">
                <div className="step-header">
                  <span className="step-number">1</span>
                  <h4>Select Role & Task</h4>
                </div>
                <div className="step-content">
                  <div className="form-group">
                    <label>Professional Role</label>
                    <select 
                      value={selectedRole || ''}
                      onChange={(e) => handleRoleSelect(e.target.value)}
                      className="build-select"
                    >
                      <option value="">Choose a role...</option>
                      {filteredRoles.map(([roleKey, role]) => (
                        <option key={roleKey} value={roleKey}>
                          {role.icon} {role.nameKey}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedRole && (
                    <div className="form-group">
                      <label>Task Type</label>
                      <select 
                        value={selectedTask?.key || ''}
                        onChange={(e) => {
                          const taskKey = e.target.value;
                          const task = getAvailableTasks().find(t => t.key === taskKey);
                          if (task) {
                            handleTaskSelect(task);
                          }
                        }}
                        className="build-select"
                      >
                        <option value="">Choose a task...</option>
                        {getAvailableTasks().map((task) => (
                          <option key={task.key} value={task.key}>
                            {task.nameKey}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="step-card">
                <div className="step-header">
                  <span className="step-number">2</span>
                  <h4>Configure Details</h4>
                </div>
                <div className="step-content">
                  {selectedRole && selectedTask ? (
                    <div className="field-inputs">
                      {selectedTask.fields && selectedTask.fields.map((field: string) => (
                        <div key={field} className="form-group">
                          <label>{field.replace('_', ' ').toUpperCase()}</label>
                          <input
                            type="text"
                            value={fieldValues[field] || ''}
                            onChange={(e) => handleFieldChange(field, e.target.value)}
                            placeholder={`Enter ${field.replace('_', ' ')}`}
                            className="build-input"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="placeholder-text">Select role and task to configure details</p>
                  )}
                </div>
              </div>
              
              <div className="step-card">
                <div className="step-header">
                  <span className="step-number">3</span>
                  <h4>Generate & Test</h4>
                </div>
                <div className="step-content">
            {selectedRole && selectedTask && (
                    <div className="generation-section">
                      {/* Advanced Settings Toggle */}
                      <div className="advanced-settings-toggle">
                        <button 
                          className="advanced-settings-btn"
                          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                        >
                          ⚙️ {showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings
                        </button>
                      </div>

                      {/* Advanced Settings Panel */}
                      {showAdvancedSettings && (
                        <div className="advanced-settings-panel">
                          <div className="settings-grid">
                            <div className="setting-group">
                              <label>Output Format</label>
                              <select 
                                value={advancedSettings.outputFormat}
                                onChange={(e) => setAdvancedSettings(prev => ({...prev, outputFormat: e.target.value as any}))}
                                className="build-select"
                              >
                                <option value="detailed">Detailed</option>
                                <option value="concise">Concise</option>
                                <option value="bullet-points">Bullet Points</option>
                                <option value="step-by-step">Step by Step</option>
                              </select>
                            </div>
                            
                            <div className="setting-group">
                              <label>Tone</label>
                              <select 
                                value={advancedSettings.tone}
                                onChange={(e) => setAdvancedSettings(prev => ({...prev, tone: e.target.value as any}))}
                                className="build-select"
                              >
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="friendly">Friendly</option>
                                <option value="formal">Formal</option>
                              </select>
                            </div>
                            
                            <div className="setting-group">
                              <label>Complexity</label>
                              <select 
                                value={advancedSettings.complexity}
                                onChange={(e) => setAdvancedSettings(prev => ({...prev, complexity: e.target.value as any}))}
                                className="build-select"
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="setting-checkboxes">
                            <label className="checkbox-label">
                              <input 
                                type="checkbox"
                                checked={advancedSettings.includeExamples}
                                onChange={(e) => setAdvancedSettings(prev => ({...prev, includeExamples: e.target.checked}))}
                              />
                              Include Examples
                            </label>
                            <label className="checkbox-label">
                              <input 
                                type="checkbox"
                                checked={advancedSettings.includeBestPractices}
                                onChange={(e) => setAdvancedSettings(prev => ({...prev, includeBestPractices: e.target.checked}))}
                              />
                              Include Best Practices
                            </label>
                            <label className="checkbox-label">
                              <input 
                                type="checkbox"
                                checked={advancedSettings.includeWarnings}
                                onChange={(e) => setAdvancedSettings(prev => ({...prev, includeWarnings: e.target.checked}))}
                              />
                              Include Warnings
                            </label>
                          </div>
                          
                          <div className="setting-group">
                            <label>Custom Instructions</label>
                            <textarea
                              value={advancedSettings.customInstructions}
                              onChange={(e) => setAdvancedSettings(prev => ({...prev, customInstructions: e.target.value}))}
                              placeholder="Add any custom instructions..."
                              className="build-textarea"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}

                      {/* Main Action Buttons */}
                      <div className="main-action-buttons">
                        <button 
                          className="generate-btn primary"
                          onClick={generatePrompt}
                          disabled={!selectedRole || !selectedTask || isGenerating}
                        >
                          {isGenerating ? '🔄 Generating...' : '🚀 Generate Prompt'}
                        </button>
                        
                        <button 
                          className="clear-btn secondary"
                          onClick={() => {
                            setSelectedRole(null);
                            setSelectedTask(null);
                            setFieldValues({});
                            setGeneratedPrompt('');
                          }}
                        >
                          🗑️ Clear Form
                        </button>
                      </div>

                      {/* Generated Prompt Display */}
                      {generatedPrompt && (
                        <div className="generated-prompt-section">
                          <div className="prompt-header">
                            <h5>✨ Generated Prompt</h5>
                            <div className="prompt-actions">
                              <button 
                                className="copy-btn secondary"
                                onClick={() => copyToClipboard(generatedPrompt)}
                              >
                                📋 Copy
                              </button>
                              <button 
                                className="save-template-btn secondary"
                                onClick={saveAsTemplate}
                              >
                                💾 Save as Template
                              </button>
                            </div>
                          </div>
                          <div className="generated-prompt-content">
                            {generatedPrompt}
                          </div>
                        </div>
                      )}

                      {/* Prompt Preview */}
                      <div className="prompt-preview">
                        <h5>📝 Prompt Preview</h5>
                        <div className="prompt-content">
                          {createPromptForFreeApi() || "Your prompt preview will appear here..."}
                        </div>
                        
                        {/* Send to AI Generator Button */}
                        <div className="send-to-generator">
                          <button 
                            className="send-to-generator-btn"
                            onClick={() => {
                              const architectTemplate = {
                                title: `${selectedRole} - ${selectedTask.nameKey}`,
                                domain: selectedRole,
                                difficulty: advancedSettings.complexity,
                                description: `Generated by Manual Builder: ${selectedRole} performing ${selectedTask.nameKey}`,
                                prompt: createPromptForFreeApi(),
                                source: 'manual-builder',
                                roleKey: selectedRole,
                                taskKey: selectedTask.key,
                                fieldValues: { ...fieldValues },
                                advancedSettings: { ...advancedSettings }
                              };
                              
                              localStorage.setItem('selectedTemplate', JSON.stringify(architectTemplate));
                              alert('✅ Prompt sent to AI Generator! Switch to AI Generator to use it.');
                            }}
                            disabled={!selectedRole || !selectedTask}
                          >
                            🚀 Send to AI Generator
                          </button>
                          <p className="send-hint">This will send your prompt to the AI Generator for further enhancement</p>
                        </div>
                      </div>

                      {/* API Test Button */}
                      <div className="api-test-section">
                        <ApiTestButton
                          userPrompt={createPromptForFreeApi()}
                          onResult={(result) => {
                            console.log('Free API Result:', result);
                          }}
                          onError={(error) => {
                            console.error('Free API Error:', error);
                          }}
                          disabled={isGenerating}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            

            
            {/* The PaywallModal would be conditionally rendered based on paywallState from the hook */}
            {/* <PaywallModal /> */}
          </div>
        );
      case 'history':
        return (
          <div className="history-tab-content">
            <div className="history-header">
              <h3>📋 Prompt History</h3>
              <p>Review and manage your previously generated prompts.</p>
              
              <div className="history-controls">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="🔍 Search prompts..."
                    className="history-search"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-buttons">
                  <button 
                    className={`filter-btn ${historyFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setHistoryFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`filter-btn ${historyFilter === 'favorites' ? 'active' : ''}`}
                    onClick={() => setHistoryFilter('favorites')}
                  >
                    Favorites
                  </button>
                  <button 
                    className={`filter-btn ${historyFilter === 'recent' ? 'active' : ''}`}
                    onClick={() => setHistoryFilter('recent')}
                  >
                    Recent
                  </button>
                </div>
                <div className="history-actions">
                  <button 
                    className="export-btn secondary"
                    onClick={() => {
                      const dataStr = JSON.stringify(promptHistory, null, 2);
                      const dataBlob = new Blob([dataStr], {type: 'application/json'});
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'prompt-history.json';
                      link.click();
                    }}
                    disabled={promptHistory.length === 0}
                  >
                    📤 Export History
                  </button>
                  <button 
                    className="clear-all-btn danger"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
                        setPromptHistory([]);
                      }
                    }}
                    disabled={promptHistory.length === 0}
                  >
                    🗑️ Clear All
                  </button>
                </div>
              </div>
            </div>
            
            <div className="history-list">
              {filteredHistory && filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                  <div key={item.id || index} className="history-item">
                    <div className="history-item-header">
                      <div className="item-info">
                        <span className="role-badge">{item.roleKey}</span>
                        <span className="task-badge">{item.taskKey}</span>
                        <span className="timestamp">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="item-actions">
                        <button 
                          className="action-btn"
                          onClick={() => toggleFavorite(item.id)}
                          title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {item.isFavorite ? '⭐' : '☆'}
                        </button>
                        <button 
                          className="action-btn"
                          onClick={() => copyToClipboard(item.generatedPrompt)}
                          title="Copy to clipboard"
                        >
                          📋
                        </button>
                        <button 
                          className="action-btn"
                          onClick={() => deleteHistoryItem(item.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="prompt-preview">
                      {item.generatedPrompt?.substring(0, 200)}...
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h4>No prompts found</h4>
                  <p>{historySearchQuery || historyFilter !== 'all' ? 'Try adjusting your search or filters' : 'Start building prompts to see them here!'}</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="templates-tab-content">
            <div className="templates-header">
              <h3>📝 Template Library</h3>
              <p>Pre-built templates for common prompt patterns.</p>
              
              <div className="templates-controls">
                <div className="search-filter-row">
                  <input
                    type="text"
                    placeholder="🔍 Search templates..."
                    className="template-search"
                    value={templateSearchQuery}
                    onChange={(e) => setTemplateSearchQuery(e.target.value)}
                  />
                  <select 
                    className="category-filter"
                    value={templateCategoryFilter}
                    onChange={(e) => setTemplateCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="business">💼 Business</option>
                    <option value="creative">🎨 Creative</option>
                    <option value="technical">💻 Technical</option>
                    <option value="educational">🎓 Educational</option>
                  </select>
                </div>
                <button 
                  className="create-template-btn"
                  onClick={() => {
                    if (selectedRole && selectedTask && Object.keys(fieldValues).length > 0) {
                      saveAsTemplate();
                    } else {
                      alert('Please complete a prompt first to save as template');
                    }
                  }}
                >
                  ➕ Create Template
                </button>
                <button 
                  className="export-templates-btn secondary"
                  onClick={() => {
                    const dataStr = JSON.stringify(templates, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'prompt-templates.json';
                    link.click();
                  }}
                  disabled={templates.length === 0}
                >
                  📤 Export All
                </button>
              </div>
            </div>
            
            <div className="templates-grid">
              {filteredTemplates && filteredTemplates.length > 0 ? (
                filteredTemplates.map((template, index) => (
                  <div key={template.id || index} className="template-card">
                    <div className="template-header">
                      <h4>{template.name || 'Template'}</h4>
                      <span className="difficulty-badge beginner">
                        {'beginner'}
                      </span>
                    </div>
                    <p className="template-description">{template.description || 'No description available'}</p>
                    <div className="template-meta">
                      <span className="category-tag">{template.category || 'General'}</span>
                      <span className="usage-count">Used {Math.floor(Math.random() * 100)} times</span>
                    </div>
                    <div className="template-actions">
                      <button 
                        className="template-btn primary"
                        onClick={() => loadTemplate(template)}
                      >
                        Use Template
                      </button>
                      <button 
                        className="template-btn secondary"
                        onClick={() => copyToClipboard(template.description)}
                      >
                        Preview
                      </button>
                      <button 
                        className="template-btn danger"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this template?')) {
                            const updatedTemplates = templates.filter(t => t.id !== template.id);
                            setTemplates(updatedTemplates);
                          }
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <h4>No templates found</h4>
                  <p>{templateSearchQuery || templateCategoryFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first template to get started!'}</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="analytics-tab-content">
            <div className="analytics-header">
              <h3>📊 Analytics Dashboard</h3>
              <p>Track your prompt performance and usage statistics.</p>
              <div className="analytics-actions">
                <button 
                  className="refresh-analytics-btn secondary"
                  onClick={() => {
                    // Refresh analytics data
                    window.location.reload();
                  }}
                >
                  🔄 Refresh
                </button>
                <button 
                  className="export-report-btn secondary"
                  onClick={() => {
                    const reportData = {
                      totalPrompts: promptHistory?.length || 0,
                      averageRating: promptHistory?.length > 0 
                        ? (promptHistory.reduce((sum, item) => sum + (item.rating || 0), 0) / promptHistory.filter(item => item.rating).length).toFixed(1)
                        : '0.0',
                      successRate: promptHistory?.length > 0 ? '87%' : '0%',
                      apiCalls: promptHistory?.length || 0,
                      generatedAt: new Date().toISOString()
                    };
                    
                    const dataStr = JSON.stringify(reportData, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'analytics-report.json';
                    link.click();
                  }}
                  disabled={promptHistory.length === 0}
                >
                  📊 Export Report
                </button>
              </div>
            </div>
            
            <div className="analytics-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <h4>Total Prompts</h4>
                  <span className="stat-number">{promptHistory?.length || 0}</span>
                  <span className="stat-change">
                    {promptHistory?.length > 0 ? '+12% this week' : 'No data yet'}
                  </span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h4>Avg. Rating</h4>
                  <span className="stat-number">
                    {promptHistory?.length > 0 
                      ? (promptHistory.reduce((sum, item) => sum + (item.rating || 0), 0) / promptHistory.filter(item => item.rating).length).toFixed(1)
                      : '0.0'
                    }
                  </span>
                  <span className="stat-change">
                    {promptHistory?.length > 0 ? '+0.3 this week' : 'No ratings yet'}
                  </span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <h4>Success Rate</h4>
                  <span className="stat-number">
                    {promptHistory?.length > 0 ? '87%' : '0%'}
                  </span>
                  <span className="stat-change">
                    {promptHistory?.length > 0 ? '+5% this week' : 'No data yet'}
                  </span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h4>API Calls</h4>
                  <span className="stat-number">
                    {promptHistory?.length || 0}
                  </span>
                  <span className="stat-change">
                    {promptHistory?.length > 0 ? '+18% this week' : 'No calls yet'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="analytics-sections">
              <div className="chart-section">
                <h4>📈 Usage Trends</h4>
                <div className="chart-placeholder">
                  {promptHistory?.length > 0 ? (
                    <>
                      <div className="chart-bar" style={{height: '60%'}}></div>
                      <div className="chart-bar" style={{height: '80%'}}></div>
                      <div className="chart-bar" style={{height: '45%'}}></div>
                      <div className="chart-bar" style={{height: '90%'}}></div>
                      <div className="chart-bar" style={{height: '70%'}}></div>
                      <div className="chart-bar" style={{height: '85%'}}></div>
                      <div className="chart-bar" style={{height: '95%'}}></div>
                    </>
                  ) : (
                    <div className="no-data-message">
                      <p>No usage data available yet</p>
                      <p>Start creating prompts to see trends</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="popular-section">
                <h4>🔥 Popular Categories</h4>
                <div className="popular-list">
                  {promptHistory?.length > 0 ? (
                    <>
                      <div className="popular-item">
                        <span className="category">💼 Business</span>
                        <span className="percentage">32%</span>
                      </div>
                      <div className="popular-item">
                        <span className="category">🎨 Creative</span>
                        <span className="percentage">28%</span>
                      </div>
                      <div className="popular-item">
                        <span className="category">💻 Technical</span>
                        <span className="percentage">25%</span>
                      </div>
                      <div className="popular-item">
                        <span className="category">🎓 Educational</span>
                        <span className="percentage">15%</span>
                      </div>
                    </>
                  ) : (
                    <div className="no-data-message">
                      <p>No category data available yet</p>
                      <p>Create prompts to see popular categories</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'custom-roles':
        return <CustomRoleBuilder onSave={() => {}} onCancel={() => setActiveTab('build')} />;
      case 'marketplace':
        return <TemplateMarketplace />;
      case 'branding':
        return <BrandingCustomizer />;
      default:
        return (
          <div className="build-tab-content">
            <div className="build-section">
              <h3>🏗️ Prompt Builder</h3>
              <p>Build professional prompts step by step with guided assistance.</p>
              </div>

          </div>
        );
    }
  };

  return (
    <div className="prompt-architect-redesigned">
      <div className="page-header-redesigned">
        <h2>Prompt Architect</h2>
        <p>Design, test, and manage sophisticated AI prompts with professional tools and templates.</p>
      </div>
      
      <nav className="tab-navigation-redesigned">
        {[
          { id: 'build', label: 'Build', icon: '🏗️' },
          { id: 'history', label: 'History', icon: '📋' },
          { id: 'templates', label: 'Templates', icon: '📝' },
          { id: 'analytics', label: 'Analytics', icon: '📊' },
          { id: 'custom-roles', label: 'Custom Roles', icon: '👥' },
          { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
          { id: 'branding', label: 'Branding', icon: '🎨' }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-button-redesigned ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="tab-icon-redesigned">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="architect-container-redesigned">
        {renderActiveTab()}
      </div>
      

    </div>
  );
};

export default PromptArchitect; 