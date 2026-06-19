import React from 'react';

export default function Sidebar({
  isAdminMode,
  setIsAdminMode,
  statusFilter,
  setStatusFilter,
  resetFilters,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  theme,
  toggleTheme,
  handleAddTrigger,
  isAdminAuthenticated,
  onOpenLogin,
  onLogout
}) {
  return (
    <aside className={`sidebar ${isMobileSidebarOpen ? 'sidebar-open' : ''}`}>
      <div>
        {/* Logo & Brand Info */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-row">
            <h2 className="sidebar-title">Mrida The Label</h2>
            <button 
              className="sidebar-close-btn" 
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close Sidebar"
            >
              &times;
            </button>
          </div>
          <span className="sidebar-subtitle">@mrida_thelabel</span>
        </div>

        {/* Mode Switch Panel */}
        <div className="sidebar-mode-selector">
          <button 
            className={`sidebar-mode-btn ${!isAdminMode ? 'active' : ''}`}
            onClick={() => {
              setIsAdminMode(false);
              setIsMobileSidebarOpen(false);
            }}
            id="view-catalog-mode"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            Catalog View
          </button>
          <button 
            className={`sidebar-mode-btn ${isAdminMode ? 'active' : ''}`}
            onClick={() => {
              if (isAdminAuthenticated) {
                setIsAdminMode(true);
              } else {
                onOpenLogin();
              }
              setIsMobileSidebarOpen(false);
            }}
            id="view-admin-mode"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Admin Mode
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <span className="sidebar-nav-header">Browse Collection</span>
          
          <button 
            className={`sidebar-nav-item ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={resetFilters}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            All Catalog
          </button>

          <button 
            className={`sidebar-nav-item ${statusFilter === 'available' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('available');
              setIsMobileSidebarOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--status-available)' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            Available Now
          </button>

          <button 
            className={`sidebar-nav-item ${statusFilter === 'pre_order' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('pre_order');
              setIsMobileSidebarOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--status-pre-order)' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Pre-order
          </button>

          <button 
            className={`sidebar-nav-item ${statusFilter === 'out_of_stock' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('out_of_stock');
              setIsMobileSidebarOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--status-out-of-stock)' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            Out of Stock
          </button>

          {isAdminMode && (
            <>
              <span className="sidebar-nav-header">Admin Tools</span>
              <button 
                className="sidebar-nav-item" 
                onClick={handleAddTrigger}
                style={{ color: 'var(--primary)', border: '1px dashed var(--primary)', backgroundColor: 'rgba(var(--primary-rgb), 0.02)' }}
                id="sidebar-add-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add New Saree
              </button>
              <button 
                className="sidebar-nav-item" 
                onClick={() => {
                  onLogout();
                  setIsMobileSidebarOpen(false);
                }}
                style={{ color: 'var(--status-out-of-stock)', marginTop: '0.4rem' }}
                id="sidebar-logout-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Log Out Admin
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-theme-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.4rem' }}>
          <span className="sidebar-theme-label" style={{ marginBottom: '0.2rem' }}>Theme Mode</span>
          <div className="theme-segmented-switch">
            <button 
              type="button"
              className={`theme-segment-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => {
                if (theme !== 'light') toggleTheme();
              }}
              title="Light Mode"
              aria-label="Switch to light mode"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              </svg>
              <span>Light</span>
            </button>
            <button 
              type="button"
              className={`theme-segment-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => {
                if (theme !== 'dark') toggleTheme();
              }}
              title="Dark Mode"
              aria-label="Switch to dark mode"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
