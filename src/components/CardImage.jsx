import React from 'react';

export default function CardImage({ imageUrl, name, code, status, isAdmin, isPending, onToggleStatus }) {
  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'out_of_stock': return 'Out of Stock';
      case 'pre_order': return 'Pre-order';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'available': return 'badge-available';
      case 'out_of_stock': return 'badge-out_of_stock';
      case 'pre_order': return 'badge-pre_order';
      default: return '';
    }
  };

  return (
    <div className="card-image-wrapper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={imageUrl || "/images/placeholder.jpg"} 
        alt={name} 
        className="card-image"
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop";
        }}
      />
      <span className="card-code">{code}</span>
      
      <button 
        className={`card-badge ${getStatusClass(status)} ${isAdmin ? 'interactive-badge' : ''}`}
        onClick={onToggleStatus}
        disabled={!isAdmin || isPending}
        title={isAdmin ? "Click to toggle availability status" : undefined}
        aria-label={isAdmin ? `Toggle availability status. Current: ${getStatusLabel(status)}` : `Availability status: ${getStatusLabel(status)}`}
        style={isAdmin ? { cursor: 'pointer', borderStyle: 'dashed' } : {}}
      >
        {isPending ? "Updating..." : getStatusLabel(status)}
      </button>
    </div>
  );
}
