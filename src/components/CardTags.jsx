import React from 'react';

export default function CardTags({ fabric, color }) {
  return (
    <div className="card-tags">
      <span className="card-tag">{fabric}</span>
      <span className="card-tag accent-tag">{color}</span>
    </div>
  );
}
