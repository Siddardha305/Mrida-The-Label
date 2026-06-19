"use client";

import React, { useState } from 'react';

export default function AdminLoginForm({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Add a slight artificial delay for a premium loading experience
    setTimeout(() => {
      if (email.trim() === 'siddardhachitturi789@gmail.com' && password === '1234567890') {
        onLoginSuccess();
      } else {
        setError('Invalid admin credentials. Please try again.');
        setIsSubmitting(false);
        setShake(true);
        setTimeout(() => setShake(false), 500); // Reset shake animation
      }
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-content auth-card ${shake ? 'shake-animation' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '400px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--card-border)',
          overflow: 'hidden'
        }}
      >
        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
          <h2 className="modal-title" style={{ fontSize: '1.25rem', fontWeight: '700' }}>Admin Authentication</h2>
          <button 
            className="modal-close" 
            onClick={onClose} 
            aria-label="Close authentication dialog"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ paddingTop: '0.5rem' }}>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.25rem', lineHeight: '1.4' }}>
            Enter your credentials to unlock dashboard administration tools, edit prices, and manage saree availability.
          </p>

          {error && (
            <div 
              style={{ 
                color: 'var(--status-out-of-stock)', 
                backgroundColor: 'rgba(239, 83, 80, 0.08)',
                border: '1px solid rgba(239, 83, 80, 0.2)',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.82rem', 
                fontWeight: 600,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="auth-email">Admin Email Address</label>
            <input
              type="email"
              id="auth-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className="form-input"
              placeholder="e.g., admin@mrida.com"
              required
              disabled={isSubmitting}
              style={{
                padding: '0.65rem 0.8rem',
                fontSize: '0.9rem',
                border: error ? '1px solid var(--status-out-of-stock)' : '1px solid var(--input-border)'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="auth-password">Password</label>
            <input
              type="password"
              id="auth-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="form-input"
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              style={{
                padding: '0.65rem 0.8rem',
                fontSize: '0.9rem',
                border: error ? '1px solid var(--status-out-of-stock)' : '1px solid var(--input-border)'
              }}
            />
          </div>

          <div className="form-actions" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose} 
              disabled={isSubmitting}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {isSubmitting ? (
                <>
                  <span className="auth-spinner" style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.6s linear infinite'
                  }}></span>
                  <span>Verifying...</span>
                </>
              ) : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
