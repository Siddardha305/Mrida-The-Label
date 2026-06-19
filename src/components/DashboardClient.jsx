"use client";

import React, { useState, useEffect, useTransition } from 'react';
import StatsHeader from './StatsHeader';
import SareeCard from './SareeCard';
import SareeForm from './SareeForm';
import Sidebar from './Sidebar';
import AdminLoginForm from './AdminLoginForm';
import { addSaree, updateSaree, deleteSaree, toggleSareeStatus } from '../app/actions';

export default function DashboardClient({ initialSarees }) {
  const [sarees, setSarees] = useState(initialSarees);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fabricFilter, setFabricFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSaree, setSelectedSaree] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFabricOpen, setIsFabricOpen] = useState(false);
  
  const [isPending, startTransition] = useTransition();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);

  // Sync state if initialSarees changes from server revalidation
  useEffect(() => {
    setSarees(initialSarees);
  }, [initialSarees]);

  // Load Admin Authentication State
  useEffect(() => {
    const storedAuth = localStorage.getItem('mrida-admin-auth');
    if (storedAuth === 'true') {
      setIsAdminAuthenticated(true);
      const storedAdminMode = localStorage.getItem('mrida-admin-mode');
      if (storedAdminMode === 'true') {
        setIsAdminMode(true);
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminMode(true);
    setIsLoginOpen(false);
    localStorage.setItem('mrida-admin-auth', 'true');
    localStorage.setItem('mrida-admin-mode', 'true');
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminMode(false);
    localStorage.removeItem('mrida-admin-auth');
    localStorage.removeItem('mrida-admin-mode');
  };

  const handleSetAdminMode = (val) => {
    setIsAdminMode(val);
    localStorage.setItem('mrida-admin-mode', val ? 'true' : 'false');
  };

  // Handle Theme Toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('saree-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  // Handle click outside to close custom select dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('#sort-select-container') && !e.target.closest('#fabric-select-container')) {
        setIsSortOpen(false);
        setIsFabricOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);



  // Custom keydown handlers for accessibility-compliant select options
  const handleSortKeyDown = (e, val) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSortBy(val);
      setIsSortOpen(false);
    } else if (e.key === 'Escape') {
      setIsSortOpen(false);
    }
  };

  const handleFabricKeyDown = (e, val) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFabricFilter(val);
      setIsFabricOpen(false);
    } else if (e.key === 'Escape') {
      setIsFabricOpen(false);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('saree-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Get unique fabric list for filters
  const uniqueFabrics = Array.from(new Set(sarees.map(s => s.fabric))).filter(Boolean);

  // Form Submit Handler (both Add and Edit)
  const handleFormSubmit = async (formData) => {
    if (selectedSaree) {
      // Edit mode
      const result = await updateSaree(selectedSaree.id, formData);
      if (result.success) {
        setSarees(prev => prev.map(s => s.id === selectedSaree.id ? result.saree : s));
      }
    } else {
      // Add mode
      const result = await addSaree(formData);
      if (result.success) {
        setSarees(prev => [result.saree, ...prev]);
      }
    }
    setIsFormOpen(false);
    setSelectedSaree(null);
  };

  // Trigger Delete Confirmation Modal
  const handleDeleteTrigger = (saree) => {
    setDeleteConfirmTarget(saree);
  };

  // Delete Action
  const handleDeleteSaree = async (id) => {
    const result = await deleteSaree(id);
    if (result.success) {
      setSarees(prev => prev.filter(s => s.id !== id));
    }
  };

  // Fast Toggle Status Action
  const handleToggleStatus = async (id) => {
    const result = await toggleSareeStatus(id);
    if (result.success) {
      setSarees(prev => prev.map(s => {
        if (s.id === id) {
          return { ...s, status: result.status, lastUpdated: new Date().toISOString() };
        }
        return s;
      }));
    }
  };

  // Trigger Edit Form
  const handleEditTrigger = (saree) => {
    setSelectedSaree(saree);
    setIsFormOpen(true);
    setIsMobileSidebarOpen(false); // Close sidebar on mobile
  };

  // Trigger Add Form
  const handleAddTrigger = () => {
    setSelectedSaree(null);
    setIsFormOpen(true);
    setIsMobileSidebarOpen(false); // Close sidebar on mobile
  };

  // Quick reset for all filters from Nav
  const resetFilters = () => {
    setStatusFilter('all');
    setFabricFilter('all');
    setSearchQuery('');
    setIsMobileSidebarOpen(false);
  };

  // Calculate total active value for the sidebar display
  const activeValue = sarees
    .filter(s => s.status !== 'out_of_stock')
    .reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  const formattedActiveValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(activeValue);

  // Filtering & Sorting Logic
  const filteredSarees = sarees
    .filter(saree => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        saree.name.toLowerCase().includes(query) ||
        saree.code.toLowerCase().includes(query) ||
        saree.fabric.toLowerCase().includes(query) ||
        saree.color.toLowerCase().includes(query) ||
        (saree.description && saree.description.toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'all' || saree.status === statusFilter;
      const matchesFabric = fabricFilter === 'all' || saree.fabric === fabricFilter;

      return matchesSearch && matchesStatus && matchesFabric;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price_desc') {
        return b.price - a.price;
      }
      if (sortBy === 'code_asc') {
        return a.code.localeCompare(b.code);
      }
      if (sortBy === 'newest') {
        return new Date(b.lastUpdated || b.id) - new Date(a.lastUpdated || a.id);
      }
      return 0;
    });

  return (
    <div className="app-layout">
      {/* Mobile Header Menu (Visible only on mobile/tablet) */}
      <header className="mobile-header">
        <button 
          className="hamburger-btn" 
          onClick={() => setIsMobileSidebarOpen(true)}
          aria-label="Open Sidebar Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
        <span className="mobile-brand-title">Mrida The Label</span>
        
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme} 
          style={{ width: '38px', height: '38px' }}
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Left Sidebar Drawer / Column */}
      <Sidebar 
        isAdminMode={isAdminMode}
        setIsAdminMode={handleSetAdminMode}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        resetFilters={resetFilters}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        handleAddTrigger={handleAddTrigger}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Workspace Column */}
      <div className="main-content-wrapper">
        {/* Statistics Dashboard Panel */}
        <StatsHeader sarees={sarees} />

        {/* Catalog Control Header Panel (Search, Sorting, Fabric filter) */}
        <section className="controls-panel">
          <div className="search-sort-row">
            <div className="search-wrapper">
              <span className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search by code, fabric, color, or saree name..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-input"
                aria-label="Search catalog sarees by code, fabric, color, or name"
              />
            </div>

            {/* Custom Sort Dropdown */}
            <div className="custom-select-wrapper" id="sort-select-container">
              <button 
                type="button"
                className="custom-select-trigger" 
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsFabricOpen(false);
                }}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
                aria-controls="sort-options-list"
                aria-label="Sort sarees catalog selection list"
              >
                <span>
                  {sortBy === 'newest' ? 'Newest Added' : 
                   sortBy === 'price_asc' ? 'Price: Low to High' : 
                   sortBy === 'price_desc' ? 'Price: High to Low' : 
                   sortBy === 'code_asc' ? 'Saree Code' : 'Newest Added'}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`select-caret ${isSortOpen ? 'open' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {isSortOpen && (
                <ul className="custom-select-options" id="sort-options-list" role="listbox" aria-label="Sort options menu">
                  {[
                    { value: 'newest', label: 'Newest Added' },
                    { value: 'price_asc', label: 'Price: Low to High' },
                    { value: 'price_desc', label: 'Price: High to Low' },
                    { value: 'code_asc', label: 'Saree Code' }
                  ].map(opt => (
                    <li 
                      key={opt.value}
                      className={`custom-select-option ${sortBy === opt.value ? 'selected' : ''}`}
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortOpen(false);
                      }}
                      onKeyDown={(e) => handleSortKeyDown(e, opt.value)}
                      role="option"
                      aria-selected={sortBy === opt.value}
                      tabIndex="0"
                    >
                      {opt.label}
                      {sortBy === opt.value && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--primary)' }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="filter-row" style={{ borderTop: 'none', paddingTop: 0 }}>
            {/* Displaying current browse filters for context */}
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Showing: <strong style={{ color: 'var(--primary)' }}>
                {statusFilter === 'all' ? 'All Statuses' : statusFilter === 'available' ? 'Available' : statusFilter === 'pre_order' ? 'Pre-orders' : 'Out of Stock'}
              </strong>
              {fabricFilter !== 'all' && <> in <strong>{fabricFilter}</strong></>}
              {searchQuery && <> matching &ldquo;{searchQuery}&rdquo;</>}
              <span style={{ marginLeft: '0.5rem', opacity: 0.5 }}>({filteredSarees.length} results)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Fabric:</span>
              {/* Custom Fabric Dropdown */}
              <div className="custom-select-wrapper" id="fabric-select-container">
                <button 
                  type="button"
                  className="custom-select-trigger" 
                  onClick={() => {
                    setIsFabricOpen(!isFabricOpen);
                    setIsSortOpen(false);
                  }}
                  style={{ minWidth: '130px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                  role="combobox"
                  aria-haspopup="listbox"
                  aria-expanded={isFabricOpen}
                  aria-controls="fabric-options-list"
                  aria-label="Filter catalog selection list by fabric"
                >
                  <span>{fabricFilter === 'all' ? 'All Fabrics' : fabricFilter}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`select-caret ${isFabricOpen ? 'open' : ''}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                {isFabricOpen && (
                  <ul className="custom-select-options" id="fabric-options-list" role="listbox" aria-label="Filter by fabric menu">
                    <li 
                      className={`custom-select-option ${fabricFilter === 'all' ? 'selected' : ''}`}
                      onClick={() => {
                        setFabricFilter('all');
                        setIsFabricOpen(false);
                      }}
                      onKeyDown={(e) => handleFabricKeyDown(e, 'all')}
                      role="option"
                      aria-selected={fabricFilter === 'all'}
                      tabIndex="0"
                    >
                      All Fabrics
                      {fabricFilter === 'all' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--primary)' }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </li>
                    {uniqueFabrics.map(fab => (
                      <li 
                        key={fab}
                        className={`custom-select-option ${fabricFilter === fab ? 'selected' : ''}`}
                        onClick={() => {
                          setFabricFilter(fab);
                          setIsFabricOpen(false);
                        }}
                        onKeyDown={(e) => handleFabricKeyDown(e, fab)}
                        role="option"
                        aria-selected={fabricFilter === fab}
                        tabIndex="0"
                      >
                        {fab}
                        {fabricFilter === fab && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--primary)' }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Card Catalog Workspace Grid */}
        <main className="saree-grid" id="saree-grid">
          {filteredSarees.length > 0 ? (
            filteredSarees.map(saree => (
              <SareeCard 
                key={saree.id} 
                saree={saree} 
                isAdmin={isAdminMode} 
                onEdit={handleEditTrigger}
                onDelete={handleDeleteTrigger}
                onToggleStatus={handleToggleStatus}
              />
            ))
          ) : (
            <div className="no-results" id="no-results">
              <h3 className="no-results-title">No Sarees Found</h3>
              <p className="no-results-desc">Try resetting your browse filters or adjusting search queries.</p>
              <button 
                className="btn-secondary" 
                onClick={resetFilters} 
                style={{ marginTop: '1rem', fontSize: '0.85rem' }}
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </main>

        {/* Footer Area */}
        <footer className="app-footer">
          <div className="app-footer-brand">Mrida The Label</div>
          <p>&copy; {new Date().getFullYear()} Mrida The Label India. Dashboard Catalog View.</p>
        </footer>
      </div>

      {/* dialog Overlay Forms */}
      {isFormOpen && (
        <SareeForm 
          saree={selectedSaree} 
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {isLoginOpen && (
        <AdminLoginForm 
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {deleteConfirmTarget && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmTarget(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', borderRadius: '16px' }}>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
              <h2 className="modal-title" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--status-out-of-stock)' }}>Delete Saree Design?</h2>
              <button className="modal-close" onClick={() => setDeleteConfirmTarget(null)}>&times;</button>
            </div>
            <div className="modal-body" style={{ paddingTop: '0.5rem' }}>
              <p style={{ fontSize: '0.9rem', opacity: 0.85, lineHeight: '1.45', marginBottom: '1.5rem' }}>
                Are you sure you want to permanently delete <strong>{deleteConfirmTarget.name}</strong> ({deleteConfirmTarget.code})? This action cannot be undone and will delete it from MongoDB Atlas.
              </p>
              <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
                <button type="button" className="btn-secondary" onClick={() => setDeleteConfirmTarget(null)} style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={async () => {
                    await handleDeleteSaree(deleteConfirmTarget.id);
                    setDeleteConfirmTarget(null);
                  }} 
                  style={{ flex: 1, justifyContent: 'center', backgroundColor: 'var(--status-out-of-stock)' }}
                >
                  Delete Saree
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
