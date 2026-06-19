import React from 'react';

export default function CardPrice({ formattedPrice }) {
  return (
    <div className="card-price-section">
      <span className="price-label">Price</span>
      <span className="price-value">{formattedPrice}</span>
    </div>
  );
}
