import React from 'react';

export default function CardActions({
  isAdmin,
  copied,
  onCopyMessage,
  onEdit,
  onDelete,
  instagramUrl,
  id,
  name
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <button 
        className={`copy-message-btn ${copied ? 'copied' : ''}`}
        onClick={onCopyMessage}
        title="Copy share message for WhatsApp/Instagram"
        aria-label="Copy share message"
      >
        {copied ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy Msg</span>
          </>
        )}
      </button>

      {isAdmin ? (
        <div className="card-admin-actions">
          <button 
            className="admin-action-btn" 
            onClick={onEdit}
            title="Edit Saree Details"
            aria-label={`Edit details for ${name}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
            </svg>
          </button>
          
          <button 
            className="admin-action-btn delete-btn" 
            onClick={onDelete}
            title="Delete Saree"
            aria-label={`Delete ${name}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      ) : (
        instagramUrl && (
          <a 
            href={instagramUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="instagram-btn"
            id={`insta-btn-${id}`}
            aria-label={`View ${name} post on Instagram`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>Insta</span>
          </a>
        )
      )}
    </div>
  );
}
