import React from 'react';

export default function CardContent({ name, description }) {
  return (
    <>
      <h3 className="card-title">{name}</h3>
      <p className="card-description">{description || "No description provided."}</p>
    </>
  );
}
