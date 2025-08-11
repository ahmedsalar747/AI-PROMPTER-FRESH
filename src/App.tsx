import React, { useEffect, useState } from 'react';
import { FiBox, FiFeather, FiGrid, FiLayers, FiMenu, FiSettings, FiUser, FiX, FiZap } from 'react-icons/fi';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';

import './App.redesigned.css'; // A new dedicated CSS file for the app shell

// Import contexts
import { ApiKeyProvider } from './context/ApiKeyContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';

// Import ErrorBoundary
import DemoModeIndicator from './components/DemoModeIndicator';
import { ErrorBoundary } from './components/ErrorBoundary';
import GooglePlayBillingTest from './components/GooglePlayBillingTest';
import UserMenu from './components/UserMenu';

// Import pages
import Dashboard from './components/Dashboard';
import Premium from './pages/Premium';
import PromptArchitect from './pages/PromptArchitect';
import PromptEnhancer from './pages/PromptEnhancer';
import PromptLibrary from './pages/PromptLibrary';
import Settings from './pages/Settings';
import TemplateGallery from './pages/TemplateGallery';
import UserProfile from './pages/UserProfile';

// A simple placeholder for routes not yet implemented
// const Placeholder: React.FC<{ title: string }> = ({ title }) => <div style={{ padding: '2rem' }}><h2>{title}</h2><p>This page is under construction.</p></div>;

const navItems = [
  { path: '/', label: 'Dashboard', component: Dashboard, icon: FiGrid },
  { path: '/enhancer', label: 'AI Generator', component: PromptEnhancer, icon: FiFeather },
  { path: '/architect', label: 'Manual Builder', component: PromptArchitect, icon: FiLayers },
  { path: '/library', label: 'My Prompts', component: PromptLibrary, icon: FiBox },
  { path: '/gallery', label: 'Conversational Wizard', component: TemplateGallery, icon: FiZap },
  { path: '/billing-test', label: 'Billing Test', component: GooglePlayBillingTest, icon: FiZap, hidden: true }, // Hidden from sidebar nav
  { path: '/premium', label: 'Premium', component: Premium, icon: FiZap, hidden: true }, // Hidden from sidebar nav
  { path: '/profile', label: 'User Profile', component: UserProfile, icon: FiUser, hidden: true }, // Hidden from sidebar nav
  { path: '/settings', label: 'Settings', component: Settings, icon: FiSettings },
];

const AppContent: React.FC = () => {
  // Check if mobile on initial load
  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth > 768; // Only open by default on desktop
  });
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth <= 768;
  });
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile when switching to desktop
      if (!mobile && isSidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleOverlayClick = () => {
    if (isMobile && isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const activeLabel = navItems.find(item => item.path === location.pathname)?.label || 'Dashboard';

  // Filter out hidden nav items for sidebar
  const visibleNavItems = navItems.filter(item => !item.hidden);

  return (
    <div className="app-container">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div className="mobile-overlay" onClick={handleOverlayClick} />
      )}
      
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">PromptCraft</span>
          </div>
          {/* Close button for mobile */}
          {isMobile && (
            <button onClick={closeSidebar} className="mobile-close-btn">
              <FiX />
            </button>
          )}
        </div>
        
        <nav className="sidebar-nav">
          {visibleNavItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <item.icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="credits-info">
            <span className="credits-label">Credits</span>
            <span className="credits-value">100</span>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <header className="main-header">
          <button onClick={toggleSidebar} className="menu-toggle">
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <h2>{activeLabel}</h2>
          <div className="header-right">
            <DemoModeIndicator />
            <UserMenu />
          </div>
        </header>
        <main className="page-content">
          <Routes>
            {navItems.map(item => (
              <Route key={item.path} path={item.path} element={<item.component />} />
            ))}
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <LanguageProvider>
          <AuthProvider>
            <ApiKeyProvider>
              <AppContent />
            </ApiKeyProvider>
          </AuthProvider>
        </LanguageProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App; 