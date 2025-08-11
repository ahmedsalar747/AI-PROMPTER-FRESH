import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { hasPremiumAccess } from '../utils/templateAccess';
import './BrandingCustomizer.css';

interface BrandingConfig {
  id: string;
  organizationName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: 'sharp' | 'rounded' | 'extra-rounded';
  theme: 'light' | 'dark' | 'auto';
  customCss?: string;
  headerSettings: {
    showLogo: boolean;
    showOrgName: boolean;
    showNavigation: boolean;
    headerColor: string;
    headerTextColor: string;
  };
  footerSettings: {
    showFooter: boolean;
    footerText: string;
    footerColor: string;
    showPoweredBy: boolean;
  };
  features: {
    customDomain: boolean;
    removeWatermark: boolean;
    customEmail: boolean;
    whiteLabel: boolean;
    apiAccess: boolean;
  };
  customDomains: string[];
  ssoConfig?: {
    enabled: boolean;
    provider: 'google' | 'microsoft' | 'okta' | 'custom';
    loginUrl?: string;
    logoutUrl?: string;
  };
}

interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

const BrandingCustomizer: React.FC = () => {
  // const { t } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const isPremium = hasPremiumAccess();

  const [config, setConfig] = useState<BrandingConfig>({
    id: 'default',
    organizationName: 'My Organization',
    logo: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    accentColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter, sans-serif',
    borderRadius: 'rounded',
    theme: 'light',
    headerSettings: {
      showLogo: true,
      showOrgName: true,
      showNavigation: true,
      headerColor: '#ffffff',
      headerTextColor: '#1f2937'
    },
    footerSettings: {
      showFooter: true,
      footerText: '© 2024 My Organization. All rights reserved.',
      footerColor: '#f8fafc',
      showPoweredBy: false
    },
    features: {
      customDomain: false,
      removeWatermark: false,
      customEmail: false,
      whiteLabel: false,
      apiAccess: false
    },
    customDomains: []
  });

  const [activeTab, setActiveTab] = useState<'colors' | 'layout' | 'branding' | 'features' | 'domains' | 'preview'>('colors');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);

  const colorThemes: ColorTheme[] = [
    {
      name: 'Professional Blue',
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#10b981',
      background: '#ffffff',
      text: '#1f2937'
    },
    {
      name: 'Corporate Purple',
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937'
    },
    {
      name: 'Modern Green',
      primary: '#10b981',
      secondary: '#059669',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#1f2937'
    },
    {
      name: 'Dark Mode',
      primary: '#60a5fa',
      secondary: '#3b82f6',
      accent: '#34d399',
      background: '#1f2937',
      text: '#ffffff'
    },
    {
      name: 'Warm Orange',
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937'
    }
  ];

  const fontOptions = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' }
  ];

  const handleConfigChange = (field: keyof BrandingConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedConfigChange = (parent: keyof BrandingConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  };

  const applyTheme = (theme: ColorTheme) => {
    setConfig(prev => ({
      ...prev,
      primaryColor: theme.primary,
      secondaryColor: theme.secondary,
      accentColor: theme.accent,
      backgroundColor: theme.background,
      textColor: theme.text
    }));
    addToast(`Applied "${theme.name}" theme`, 'success');
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `branding-config-${config.organizationName.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    addToast('Configuration exported successfully!', 'success');
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          setConfig(importedConfig);
          addToast('Configuration imported successfully!', 'success');
        } catch (error) {
          addToast('Invalid configuration file', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const generateCSS = () => {
    return `
:root {
  --primary-color: ${config.primaryColor};
  --secondary-color: ${config.secondaryColor};
  --accent-color: ${config.accentColor};
  --background-color: ${config.backgroundColor};
  --text-color: ${config.textColor};
  --font-family: ${config.fontFamily};
  --border-radius: ${config.borderRadius === 'sharp' ? '0px' : config.borderRadius === 'rounded' ? '8px' : '16px'};
  --header-color: ${config.headerSettings.headerColor};
  --header-text-color: ${config.headerSettings.headerTextColor};
  --footer-color: ${config.footerSettings.footerColor};
}

body {
  font-family: var(--font-family);
  background-color: var(--background-color);
  color: var(--text-color);
}

.btn-primary {
  background: var(--primary-color);
  border-radius: var(--border-radius);
}

.btn-secondary {
  background: var(--secondary-color);
  border-radius: var(--border-radius);
}

.btn-accent {
  background: var(--accent-color);
  border-radius: var(--border-radius);
}

${config.customCss || ''}
    `.trim();
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    addToast('CSS copied to clipboard!', 'success');
  };

  const saveConfiguration = async () => {
    // Check premium access for advanced features
    const hasAdvancedFeatures = config.features.customDomain || 
                               config.features.removeWatermark || 
                               config.features.customEmail || 
                               config.features.whiteLabel || 
                               config.features.apiAccess;
    
    if (hasAdvancedFeatures && !isPremium) {
      addToast('Advanced branding features require Premium subscription', 'warning');
      // Navigate to premium page after a short delay
      setTimeout(() => {
        navigate('/premium');
      }, 1500);
      return;
    }

    setIsLoading(true);
    try {
      // In production, should be sent to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast('Configuration saved successfully!', 'success');
    } catch {
      addToast('Failed to save configuration', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'colors':
        return (
          <div className="tab-content">
            <h3>🎨 Colors & Theme</h3>
            
            <div className="section">
              <h4>Quick Themes</h4>
              <div className="theme-grid">
                {colorThemes.map(theme => (
                  <div
                    key={theme.name}
                    className="theme-card"
                    onClick={() => applyTheme(theme)}
                  >
                    <div className="theme-preview">
                      <div 
                        className="color-block primary"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div 
                        className="color-block secondary"
                        style={{ backgroundColor: theme.secondary }}
                      />
                      <div 
                        className="color-block accent"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    <span className="theme-name">{theme.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h4>Custom Colors</h4>
              <div className="color-inputs">
                <div className="color-input-group">
                  <label>Primary Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                    />
                    <input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="color-text-input"
                    />
                  </div>
                </div>

                <div className="color-input-group">
                  <label>Secondary Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
                    />
                    <input
                      type="text"
                      value={config.secondaryColor}
                      onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
                      className="color-text-input"
                    />
                  </div>
                </div>

                <div className="color-input-group">
                  <label>Accent Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => handleConfigChange('accentColor', e.target.value)}
                    />
                    <input
                      type="text"
                      value={config.accentColor}
                      onChange={(e) => handleConfigChange('accentColor', e.target.value)}
                      className="color-text-input"
                    />
                  </div>
                </div>

                <div className="color-input-group">
                  <label>Background Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                    />
                    <input
                      type="text"
                      value={config.backgroundColor}
                      onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                      className="color-text-input"
                    />
                  </div>
                </div>

                <div className="color-input-group">
                  <label>Text Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => handleConfigChange('textColor', e.target.value)}
                    />
                    <input
                      type="text"
                      value={config.textColor}
                      onChange={(e) => handleConfigChange('textColor', e.target.value)}
                      className="color-text-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'layout':
        return (
          <div className="tab-content">
            <h3>📐 Layout & Typography</h3>
            
            <div className="section">
              <h4>Typography</h4>
              <div className="form-group">
                <label>Font Family</label>
                <select
                  value={config.fontFamily}
                  onChange={(e) => handleConfigChange('fontFamily', e.target.value)}
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="section">
              <h4>Border Radius</h4>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="borderRadius"
                    value="sharp"
                    checked={config.borderRadius === 'sharp'}
                    onChange={(e) => handleConfigChange('borderRadius', e.target.value)}
                  />
                  <span className="radio-label">Sharp (0px)</span>
                  <div className="radius-preview sharp"></div>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="borderRadius"
                    value="rounded"
                    checked={config.borderRadius === 'rounded'}
                    onChange={(e) => handleConfigChange('borderRadius', e.target.value)}
                  />
                  <span className="radio-label">Rounded (8px)</span>
                  <div className="radius-preview rounded"></div>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="borderRadius"
                    value="extra-rounded"
                    checked={config.borderRadius === 'extra-rounded'}
                    onChange={(e) => handleConfigChange('borderRadius', e.target.value)}
                  />
                  <span className="radio-label">Extra Rounded (16px)</span>
                  <div className="radius-preview extra-rounded"></div>
                </label>
              </div>
            </div>

            <div className="section">
              <h4>Theme Mode</h4>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={config.theme === 'light'}
                    onChange={(e) => handleConfigChange('theme', e.target.value)}
                  />
                  <span className="radio-label">☀️ Light</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={config.theme === 'dark'}
                    onChange={(e) => handleConfigChange('theme', e.target.value)}
                  />
                  <span className="radio-label">🌙 Dark</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="theme"
                    value="auto"
                    checked={config.theme === 'auto'}
                    onChange={(e) => handleConfigChange('theme', e.target.value)}
                  />
                  <span className="radio-label">🔄 Auto</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'branding':
        return (
          <div className="tab-content">
            <h3>🏢 Organization Branding</h3>
            
            <div className="section">
              <h4>Basic Information</h4>
              <div className="form-group">
                <label>Organization Name</label>
                <input
                  type="text"
                  value={config.organizationName}
                  onChange={(e) => handleConfigChange('organizationName', e.target.value)}
                  placeholder="Enter your organization name"
                />
              </div>

              <div className="form-group">
                <label>Logo URL</label>
                <input
                  type="url"
                  value={config.logo}
                  onChange={(e) => handleConfigChange('logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                {config.logo && (
                  <div className="logo-preview">
                    <img src={config.logo} alt="Logo Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="section">
              <h4>Header Settings</h4>
              <div className="checkbox-group">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={config.headerSettings.showLogo}
                    onChange={(e) => handleNestedConfigChange('headerSettings', 'showLogo', e.target.checked)}
                  />
                  Show Logo in Header
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={config.headerSettings.showOrgName}
                    onChange={(e) => handleNestedConfigChange('headerSettings', 'showOrgName', e.target.checked)}
                  />
                  Show Organization Name
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={config.headerSettings.showNavigation}
                    onChange={(e) => handleNestedConfigChange('headerSettings', 'showNavigation', e.target.checked)}
                  />
                  Show Navigation Menu
                </label>
              </div>

              <div className="color-inputs">
                <div className="color-input-group">
                  <label>Header Background</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={config.headerSettings.headerColor}
                      onChange={(e) => handleNestedConfigChange('headerSettings', 'headerColor', e.target.value)}
                    />
                    <input
                      type="text"
                      value={config.headerSettings.headerColor}
                      onChange={(e) => handleNestedConfigChange('headerSettings', 'headerColor', e.target.value)}
                      className="color-text-input"
                    />
                  </div>
                </div>

                <div className="color-input-group">
                  <label>Header Text Color</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={config.headerSettings.headerTextColor}
                      onChange={(e) => handleNestedConfigChange('headerSettings', 'headerTextColor', e.target.value)}
                    />
                    <input
                      type="text"
                      value={config.headerSettings.headerTextColor}
                      onChange={(e) => handleNestedConfigChange('headerSettings', 'headerTextColor', e.target.value)}
                      className="color-text-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="section">
              <h4>Footer Settings</h4>
              <div className="checkbox-group">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={config.footerSettings.showFooter}
                    onChange={(e) => handleNestedConfigChange('footerSettings', 'showFooter', e.target.checked)}
                  />
                  Show Footer
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={config.footerSettings.showPoweredBy}
                    onChange={(e) => handleNestedConfigChange('footerSettings', 'showPoweredBy', e.target.checked)}
                  />
                  Show "Powered by Prompter"
                </label>
              </div>

              {config.footerSettings.showFooter && (
                <>
                  <div className="form-group">
                    <label>Footer Text</label>
                    <input
                      type="text"
                      value={config.footerSettings.footerText}
                      onChange={(e) => handleNestedConfigChange('footerSettings', 'footerText', e.target.value)}
                      placeholder="© 2024 Your Organization. All rights reserved."
                    />
                  </div>

                  <div className="color-input-group">
                    <label>Footer Background</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={config.footerSettings.footerColor}
                        onChange={(e) => handleNestedConfigChange('footerSettings', 'footerColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={config.footerSettings.footerColor}
                        onChange={(e) => handleNestedConfigChange('footerSettings', 'footerColor', e.target.value)}
                        className="color-text-input"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="tab-content">
            <h3>⚡ Enterprise Features</h3>
            
            <div className="section">
              <h4>White-label Features</h4>
              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-header">
                    <span className="feature-icon">🌐</span>
                    <h5>Custom Domain</h5>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={config.features.customDomain}
                        onChange={(e) => handleNestedConfigChange('features', 'customDomain', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p>Use your own domain name for the application</p>
                </div>

                <div className="feature-card">
                  <div className="feature-header">
                    <span className="feature-icon">🏷️</span>
                    <h5>Remove Watermark</h5>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={config.features.removeWatermark}
                        onChange={(e) => handleNestedConfigChange('features', 'removeWatermark', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p>Remove all Prompter branding and watermarks</p>
                </div>

                <div className="feature-card">
                  <div className="feature-header">
                    <span className="feature-icon">📧</span>
                    <h5>Custom Email Domain</h5>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={config.features.customEmail}
                        onChange={(e) => handleNestedConfigChange('features', 'customEmail', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p>Send emails from your own domain</p>
                </div>

                <div className="feature-card">
                  <div className="feature-header">
                    <span className="feature-icon">🔗</span>
                    <h5>API Access</h5>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={config.features.apiAccess}
                        onChange={(e) => handleNestedConfigChange('features', 'apiAccess', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p>Full API access for integrations</p>
                </div>

                <div className="feature-card">
                  <div className="feature-header">
                    <span className="feature-icon">🎨</span>
                    <h5>Complete White-label</h5>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={config.features.whiteLabel}
                        onChange={(e) => handleNestedConfigChange('features', 'whiteLabel', e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p>Complete rebranding as your own product</p>
                </div>
              </div>
            </div>

            <div className="section">
              <h4>Custom CSS</h4>
              <div className="form-group">
                <label>Additional CSS (Advanced)</label>
                <textarea
                  value={config.customCss || ''}
                  onChange={(e) => handleConfigChange('customCss', e.target.value)}
                  placeholder="/* Add your custom CSS here */&#10;.custom-class {&#10;  color: #example;&#10;}"
                  rows={10}
                  className="css-editor"
                />
              </div>
              <div className="css-actions">
                <button onClick={copyCSS} className="copy-css-btn">
                  📋 Copy Generated CSS
                </button>
              </div>
            </div>
          </div>
        );

      case 'domains':
        return (
          <div className="tab-content">
            <h3>🌐 Custom Domains</h3>
            
            <div className="section">
              <h4>Domain Management</h4>
              <div className="domain-input">
                <input
                  type="text"
                  placeholder="yourdomain.com"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const domain = (e.target as HTMLInputElement).value;
                      if (domain && !config.customDomains.includes(domain)) {
                        setConfig(prev => ({
                          ...prev,
                          customDomains: [...prev.customDomains, domain]
                        }));
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <span className="domain-hint">Press Enter to add domain</span>
              </div>

              <div className="domains-list">
                {config.customDomains.map((domain, index) => (
                  <div key={index} className="domain-item">
                    <span className="domain-name">{domain}</span>
                    <div className="domain-status">
                      <span className="status-badge pending">Pending</span>
                      <button
                        onClick={() => {
                          setConfig(prev => ({
                            ...prev,
                            customDomains: prev.customDomains.filter((_, i) => i !== index)
                          }));
                        }}
                        className="remove-domain"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {config.customDomains.length === 0 && (
                <div className="no-domains">
                  <span className="no-domains-icon">🌐</span>
                  <p>No custom domains configured</p>
                  <p className="hint">Add your first domain above</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="tab-content">
            <h3>👁️ Live Preview</h3>
            
            <div className="preview-controls">
              <div className="device-selector">
                <button 
                  className={previewMode === 'desktop' ? 'active' : ''}
                  onClick={() => setPreviewMode('desktop')}
                >
                  💻 Desktop
                </button>
                <button 
                  className={previewMode === 'tablet' ? 'active' : ''}
                  onClick={() => setPreviewMode('tablet')}
                >
                  📱 Tablet
                </button>
                <button 
                  className={previewMode === 'mobile' ? 'active' : ''}
                  onClick={() => setPreviewMode('mobile')}
                >
                  📱 Mobile
                </button>
              </div>
            </div>

            <div className={`preview-container ${previewMode}`}>
              <div 
                className="preview-frame"
                style={{
                  backgroundColor: config.backgroundColor,
                  color: config.textColor,
                  fontFamily: config.fontFamily
                }}
              >
                {/* Header */}
                <div 
                  className="preview-header"
                  style={{
                    backgroundColor: config.headerSettings.headerColor,
                    color: config.headerSettings.headerTextColor,
                    display: config.headerSettings.showNavigation ? 'flex' : 'none'
                  }}
                >
                  {config.headerSettings.showLogo && config.logo && (
                    <img src={config.logo} alt="Logo" className="preview-logo" />
                  )}
                  {config.headerSettings.showOrgName && (
                    <h2 className="preview-org-name">{config.organizationName}</h2>
                  )}
                  <nav className="preview-nav">
                    <a href="#" style={{ color: config.headerSettings.headerTextColor }}>Home</a>
                    <a href="#" style={{ color: config.headerSettings.headerTextColor }}>Templates</a>
                    <a href="#" style={{ color: config.headerSettings.headerTextColor }}>Architect</a>
                  </nav>
                </div>

                {/* Content */}
                <div className="preview-content">
                  <h1 style={{ color: config.textColor }}>Welcome to {config.organizationName}</h1>
                  <p style={{ color: config.textColor }}>This is how your customized application will look.</p>
                  
                  <div className="preview-buttons">
                    <button 
                      className="preview-btn primary"
                      style={{ 
                        backgroundColor: config.primaryColor,
                        borderRadius: config.borderRadius === 'sharp' ? '0px' : config.borderRadius === 'rounded' ? '8px' : '16px'
                      }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="preview-btn secondary"
                      style={{ 
                        backgroundColor: config.secondaryColor,
                        borderRadius: config.borderRadius === 'sharp' ? '0px' : config.borderRadius === 'rounded' ? '8px' : '16px'
                      }}
                    >
                      Secondary Button
                    </button>
                    <button 
                      className="preview-btn accent"
                      style={{ 
                        backgroundColor: config.accentColor,
                        borderRadius: config.borderRadius === 'sharp' ? '0px' : config.borderRadius === 'rounded' ? '8px' : '16px'
                      }}
                    >
                      Accent Button
                    </button>
                  </div>

                  <div className="preview-card" style={{ borderRadius: config.borderRadius === 'sharp' ? '0px' : config.borderRadius === 'rounded' ? '8px' : '16px' }}>
                    <h3 style={{ color: config.textColor }}>Sample Card</h3>
                    <p style={{ color: config.textColor }}>This shows how cards and components will appear with your branding.</p>
                  </div>
                </div>

                {/* Footer */}
                {config.footerSettings.showFooter && (
                  <div 
                    className="preview-footer"
                    style={{ backgroundColor: config.footerSettings.footerColor }}
                  >
                    <p>{config.footerSettings.footerText}</p>
                    {config.footerSettings.showPoweredBy && (
                      <p className="powered-by">Powered by Prompter</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="branding-customizer">
      <div className="customizer-header">
        <div className="header-content">
          <h2>🎨 White-label Branding</h2>
          <p>Customize the appearance and branding for your organization</p>
          {!isPremium && (
            <div className="premium-badge">
              <span>⭐ Premium Feature</span>
            </div>
          )}
        </div>
        <div className="header-actions">
          <input
            type="file"
            accept=".json"
            onChange={importConfig}
            style={{ display: 'none' }}
            id="import-config"
          />
          <button 
            onClick={() => document.getElementById('import-config')?.click()}
            className="secondary-btn"
          >
            📤 Import
          </button>
          <button onClick={exportConfig} className="secondary-btn">
            📥 Export
          </button>
          <button 
            onClick={saveConfiguration} 
            className="primary-btn"
            disabled={isLoading}
          >
            {isLoading ? '💾 Saving...' : '💾 Save Configuration'}
          </button>
        </div>
      </div>

      <div className="customizer-content">
        <div className="tabs-navigation">
          <button 
            className={activeTab === 'colors' ? 'active' : ''}
            onClick={() => setActiveTab('colors')}
          >
            🎨 Colors
          </button>
          <button 
            className={activeTab === 'layout' ? 'active' : ''}
            onClick={() => setActiveTab('layout')}
          >
            📐 Layout
          </button>
          <button 
            className={activeTab === 'branding' ? 'active' : ''}
            onClick={() => setActiveTab('branding')}
          >
            🏢 Branding
          </button>
          <button 
            className={activeTab === 'features' ? 'active' : ''}
            onClick={() => setActiveTab('features')}
          >
            ⚡ Features
          </button>
          <button 
            className={activeTab === 'domains' ? 'active' : ''}
            onClick={() => setActiveTab('domains')}
          >
            🌐 Domains
          </button>
          <button 
            className={activeTab === 'preview' ? 'active' : ''}
            onClick={() => setActiveTab('preview')}
          >
            👁️ Preview
          </button>
        </div>

        <div className="tab-container">
          <TabContent />
        </div>
      </div>
    </div>
  );
};

export default BrandingCustomizer; 